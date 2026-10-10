import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { usePortalState } from '../common/PortalStateContext';
import { Briefcase, Plus, CheckCircle2, X, Search, Clock } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { Select } from '../../shared/ui/EnterpriseKit';
import { SubmissionsPanel, TalentPoolsPanel, InterviewsPanel, NotificationsPanel, OffersPlacementsPanel, CommissionsPanel } from '../common/EnterprisePanels';
import { getUserEmail } from '../../shared/auth/session';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const FEE_RATE = 0.0833;

function parseAmountToNumber(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function formatINR(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

const navItems = [
  { label: 'Pipeline Overview', path: '/recruiter' },
  { label: 'Jobs & Mandates', path: '/recruiter/jobs' },
  { label: 'Talent Pool Search', path: '/recruiter/talent-pool' },
  { label: 'ATS Stages', path: '/recruiter/ats' },
  { label: 'Interviews & Fee Ledger', path: '/recruiter/interviews' },
  { label: 'Candidate Submissions', path: '/recruiter/submissions' },
  { label: 'Talent Pools', path: '/recruiter/pools' },
  { label: 'Schedule Interview', path: '/recruiter/schedule' },
  { label: 'Offers & Placements', path: '/recruiter/offers' },
  { label: 'Commissions', path: '/recruiter/commissions' },
  { label: 'Notifications', path: '/recruiter/notifications' },
];

export function RecruiterPortal() {
  const location = useLocation();

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/jobs')) return 'jobs';
    if (p.includes('/talent-pool') || p.includes('/talent')) return 'talent';
    if (p.includes('/ats')) return 'ats';
    if (p.includes('/interviews')) return 'interviews';
    if (p.includes('/submissions')) return 'submissions';
    if (p.includes('/pools')) return 'pools';
    if (p.includes('/schedule')) return 'schedule';
    if (p.includes('/offers')) return 'offers';
    if (p.includes('/commissions')) return 'commissions';
    if (p.includes('/notifications')) return 'notifications';
    return 'overview';
  })();

  const { submitCandidate, candidates } = usePortalState();
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    roleTitle: '',
    experienceYears: '' as unknown as number,
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: '',
    jobId: '',
    jobTitle: '',
    resumeSummary: '',
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [jRes, iRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/jobs').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/interviews').catch(() => ({ data: [] as any[] })),
        ]);
        if (jRes?.data) setJobs(jRes.data);
        if (iRes?.data) setInterviews(iRes.data);
      } catch (err) {
        console.warn('API Error in RecruiterPortal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const openSubmitModal = (jobId = '', jobTitle = '') => {
    setSubmitError('');
    setCandidateForm({
      name: '',
      email: '',
      phone: '',
      roleTitle: '',
      experienceYears: '' as unknown as number,
      currentCtc: '',
      expectedCtc: '',
      noticePeriod: '',
      jobId,
      jobTitle,
      resumeSummary: '',
    });
    setShowSubmitModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!candidateForm.name.trim() || !candidateForm.email.trim() || !candidateForm.jobId) {
      setSubmitError('Candidate name, email and a target requisition are required.');
      return;
    }
    setIsSubmitting(true);

    try {
      // Single write through shared context: POSTs to the API, then refreshes
      // all collections so employer Kanban sees the submission (cross-role sync).
      await submitCandidate({
        ...candidateForm,
        submittedBy: getUserEmail() || 'Agency Partner',
        sourceType: 'Agency',
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSubmitModal(false);
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err?.response?.data?.message || err?.message || 'Submission failed. Try again.');
    }
  };

  // Fee ledger computed from live pipeline — 8.33% of expected CTC for offer-stage candidates.
  const offerStage = candidates.filter((c) => c.stage === 'Offer Issued' || c.stage === 'Hired');
  const finalRoundCount = candidates.filter((c) => c.stage === 'Tech Round' || c.stage === 'Executive Round').length;
  const projectedFees = offerStage.reduce((sum, c) => {
    const ctc = parseAmountToNumber(c.expectedCtc);
    return sum + (ctc ? ctc * FEE_RATE : 0);
  }, 0);
  const feeForInterview = (candidateName: string): string | null => {
    const c = candidates.find((x) => x.name === candidateName);
    const ctc = c ? parseAmountToNumber(c.expectedCtc) : null;
    return ctc ? formatINR(ctc * FEE_RATE) : null;
  };

  return (
    <PortalShell portalTitle="Recruiter Workspace" portalRole="recruiter" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#087BFF] border border-blue-200 mb-2">
              <Briefcase size={14} /> Agency Partner Workspace
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Recruiter & Headhunter Delivery Console
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Source qualified tech talent, submit candidate profiles to assigned mandates, and track placement fees.
            </p>
          </div>
          <button
            onClick={() => openSubmitModal(jobs[0]?.id || '', jobs[0]?.title || '')}
            className="px-5 py-3.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} /> Submit Candidate to Mandate
          </button>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/recruiter' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'submissions' && <SubmissionsPanel />}
        {currentTab === 'pools' && <TalentPoolsPanel />}
        {currentTab === 'schedule' && <InterviewsPanel />}
        {currentTab === 'offers' && <OffersPlacementsPanel />}
        {currentTab === 'commissions' && <CommissionsPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Client Mandates</div>
                <div className="text-3xl font-extrabold text-slate-900">{jobs.length} Active</div>
                <div className="text-xs font-bold text-[#087BFF]">Fee per commission agreement</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Agency Pipeline</div>
                <div className="text-3xl font-extrabold text-slate-900">{candidates.length} Candidates</div>
                <div className="text-xs font-bold text-emerald-600">Vetted & Dispatched to Employers</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected Placement Fees</div>
                <div className="text-3xl font-extrabold text-slate-900">{offerStage.length === 0 ? '—' : formatINR(projectedFees)}</div>
                <div className="text-xs font-bold text-slate-500">{finalRoundCount} Final Rounds Pending</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Assigned Client Mandates & Fee Structures</h3>
              {isLoading ? (
                <InlineLoading message="Loading mandates…" />
              ) : jobs.length === 0 ? (
                <EmptyState title="No mandates assigned" message="Employer requisitions assigned to your agency will appear here." />
              ) : (
              <div className="space-y-3">
                {jobs.map((j, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{j.title} • {j.companyName}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        REQ ID: {j.id} • Target Budget: {j.budgetRange} • Fee per agreement
                      </div>
                    </div>
                    <button
                      onClick={() => openSubmitModal(j.id, j.title)}
                      className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs hover:bg-blue-600 cursor-pointer"
                    >
                      + Submit Profile
                    </button>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: JOBS & MANDATES */}
        {currentTab === 'jobs' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900">Active Client Requisition Mandates</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search job title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none w-64"
                />
              </div>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading mandates…" />
            ) : jobs.length === 0 ? (
              <EmptyState title="No mandates found" message="Active client requisitions will appear here." />
            ) : (
            <div className="space-y-3">
              {jobs
                .filter(j => String(j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(j.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()))
                .map((job, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#087BFF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">{job.id}</span>
                        <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        Client: <strong>{job.companyName}</strong> • Budget: {job.budgetRange} • Location: {job.location}
                      </div>
                    </div>
                    <button
                      onClick={() => openSubmitModal(job.id, job.title)}
                      className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs hover:bg-blue-600 cursor-pointer shrink-0"
                    >
                      Submit Candidate
                    </button>
                  </div>
                ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 3: TALENT POOL SEARCH */}
        {currentTab === 'talent' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Agency Sourced Candidate Talent Database</h3>
            {candidates.length === 0 ? (
              <EmptyState title="Talent pool is empty" message="Candidates you submit to mandates will build your pool here." />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Candidate ID</th>
                    <th className="pb-3">Full Name</th>
                    <th className="pb-3">Role & Skillset</th>
                    <th className="pb-3">Experience</th>
                    <th className="pb-3">Current / Expected CTC</th>
                    <th className="pb-3">Notice Period</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {candidates.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-500">{c.id}</td>
                      <td className="py-3 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3">{c.roleTitle}</td>
                      <td className="py-3">{c.experienceYears} Years</td>
                      <td className="py-3 font-mono text-slate-700">{c.currentCtc} / {c.expectedCtc}</td>
                      <td className="py-3 font-bold text-amber-700">{c.noticePeriod}</td>
                      <td className="py-3">
                        <button
                          onClick={() => openSubmitModal(c.jobId || '', c.jobTitle || '')}
                          className="px-3 py-1 rounded-lg bg-blue-50 text-[#087BFF] border border-blue-200 font-bold hover:bg-blue-100 cursor-pointer"
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* TAB 4: ATS PIPELINE STAGES */}
        {currentTab === 'ats' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Active Agency Candidates in Client ATS Pipeline</h3>
            {candidates.length === 0 ? (
              <EmptyState title="Pipeline is empty" message="Submitted candidates and their live stages will appear here." />
            ) : (
            <div className="space-y-3">
              {candidates.map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{c.name} — {c.roleTitle}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Submitted to {c.jobTitle || c.jobId} • Source: {c.submittedBy}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-xs">
                    Current Stage: {c.stage}
                  </span>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 5: INTERVIEWS & FEE LEDGER */}
        {currentTab === 'interviews' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Scheduled Candidate Interviews & Commission Fee Ledger</h3>
            {isLoading ? (
              <InlineLoading message="Loading interviews…" />
            ) : interviews.length === 0 ? (
              <EmptyState title="No interviews scheduled" message="Interviews for your submitted candidates will appear here." />
            ) : (
            <div className="space-y-3">
              {interviews.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-sm">{item.candidateName} — {item.jobTitle}</div>
                    <div className="text-xs text-slate-600 font-medium">Round: <strong>{item.roundName}</strong> • Client: {item.clientName}</div>
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Clock size={13} /> {item.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-500">Estimated commission (per agreement rate)</div>
                    <div className="text-lg font-extrabold text-[#087BFF] font-mono">{feeForInterview(item.candidateName) || 'Pending offer'}</div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Submit Candidate Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 relative space-y-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-extrabold text-slate-900">Submit Sourced Candidate Profile</h3>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                  <div className="text-lg font-extrabold text-slate-900">Candidate Submitted via HTTP API!</div>
                  <p className="text-xs text-slate-600">Profile pushed to Employer ATS Pipeline & Employee Ops Vetting Board.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold">
                      {submitError}
                    </div>
                  )}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Requisition *</label>
                    <Select
                      value={candidateForm.jobId}
                      ariaLabel="Target requisition"
                      placeholder="Select a requisition…"
                      onChange={(v) => {
                        const job = jobs.find((j) => j.id === v);
                        setCandidateForm({ ...candidateForm, jobId: v, jobTitle: job?.title || '' });
                      }}
                      options={jobs.map((j) => ({ value: j.id, label: `${j.id} — ${j.title}` }))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      value={candidateForm.name}
                      onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={candidateForm.email}
                        onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Notice Period *</label>
                      <input
                        type="text"
                        required
                        value={candidateForm.noticePeriod}
                        onChange={(e) => setCandidateForm({ ...candidateForm, noticePeriod: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Current CTC *</label>
                      <input
                        type="text"
                        required
                        value={candidateForm.currentCtc}
                        onChange={(e) => setCandidateForm({ ...candidateForm, currentCtc: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Expected CTC *</label>
                      <input
                        type="text"
                        required
                        value={candidateForm.expectedCtc}
                        onChange={(e) => setCandidateForm({ ...candidateForm, expectedCtc: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold shadow-md cursor-pointer mt-3"
                  >
                    {isSubmitting ? 'Submitting to API...' : 'Submit Profile to Requisition'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </PortalShell>
  );
}
