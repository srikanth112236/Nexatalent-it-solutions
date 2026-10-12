import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { Briefcase, Plus, CheckCircle2, X, Search, Clock } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { applicationsApi, platformApi, talentApi } from '../../shared/enterprise/phaseApi';
import { syncAll } from '../common/EnterprisePanels';
import { Select, ActionConfirm } from '../../shared/ui/EnterpriseKit';
import { SearchSuggest, SkillsMultiSelect, FilterPanel, DataTable } from '../../shared/ui/SearchKit';
import { SubmissionsPanel, TalentPoolsPanel, InterviewsPanel, NotificationsPanel, OffersPlacementsPanel, CommissionsPanel } from '../common/EnterprisePanels';
import { useCan } from '../../shared/auth/AuthContext';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const navItems = [
  { label: 'Pipeline Overview', path: '/recruiter' },
  { label: 'Jobs & Mandates', path: '/recruiter/jobs', group: 'Delivery' },
  { label: 'Talent Pool Search', path: '/recruiter/talent-pool', group: 'Delivery' },
  { label: 'ATS Stages', path: '/recruiter/ats', group: 'Delivery' },
  { label: 'Candidate Submissions', path: '/recruiter/submissions', group: 'Delivery' },
  { label: 'Talent Pools', path: '/recruiter/pools', group: 'Delivery' },
  { label: 'Schedule Interview', path: '/recruiter/schedule', group: 'Delivery' },
  { label: 'My Tasks', path: '/recruiter/tasks', group: 'Delivery' },
  { label: 'Interviews', path: '/recruiter/interviews', group: 'Delivery' },
  { label: 'Offers & Placements', path: '/recruiter/offers', group: 'Commercial' },
  { label: 'Commissions', path: '/recruiter/commissions', group: 'Commercial' },
  { label: 'Security', path: '/recruiter/security', group: 'Workspace' },
  { label: 'Notifications', path: '/recruiter/notifications', group: 'Workspace' },
];

export function RecruiterPortal() {
  const location = useLocation();
  // Phase 1 — finance nav denied by default (§3.3). Server denies API;
  // UI hides as secondary measure. Explicit `manage_billing` grant restores it.
  const canFinance = useCan('manage_billing');
  const visibleNavItems = useMemo(() => navItems.filter((n) => n.path !== '/recruiter/commissions' || canFinance), [canFinance]);

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/jobs')) return 'jobs';
    if (p.includes('/talent-pool') || p.includes('/talent')) return 'talent';
    if (p.includes('/ats')) return 'ats';
    if (p.includes('/interviews')) return 'interviews';
    if (p.includes('/submissions')) return 'submissions';
    if (p.includes('/pools')) return 'pools';
    if (p.includes('/schedule')) return 'schedule';
    if (p.includes('/tasks')) return 'tasks';
    if (p.includes('/offers')) return 'offers';
    if (p.includes('/commissions')) return 'commissions';
    if (p.includes('/security')) return 'security';
    if (p.includes('/notifications')) return 'notifications';
    return 'overview';
  })();

  // Phase F: sourced pipeline comes from live applications, never mock context.
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [liveApps, setLiveApps] = useState<any[]>([]);
  // Phase F: sourced pipeline comes from live applications, never mock context.
  const offerStage = liveApps.filter((a) => ['Offer', 'Selected', 'Hired'].includes(a.stage));
  const finalRoundCount = liveApps.filter((a) => ['Interview Scheduled', 'Interview Completed'].includes(a.stage)).length;
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState('');
  const [advFor, setAdvFor] = useState('');
  const [advStage, setAdvStage] = useState('Shortlisted');
  const [advReason, setAdvReason] = useState('');
  const [advConfirm, setAdvConfirm] = useState<string | null>(null);
  const [advBusy, setAdvBusy] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', client: '', dueDate: '', priority: 'Medium' });
  const [taskBusy, setTaskBusy] = useState(false);
  const [taskError, setTaskError] = useState('');
  // Tiered candidate search (§8.5 tiers: preview → full → contact/unlock)
  const [tq, setTq] = useState('');
  const [tskills, setTskills] = useState('');
  const [texp, setTexp] = useState('');
  const [tloc, setTloc] = useState('');
  const [tier, setTier] = useState('preview');
  const [tresults, setTresults] = useState<any[]>([]);
  const [tierUsed, setTierUsed] = useState('preview');
  const [tLoading, setTLoading] = useState(false);
  const [tUpgrade, setTUpgrade] = useState('');
  const [tSearched, setTSearched] = useState(false);
  const [fbPending, setFbPending] = useState(0);

  const STAGES = ['New', 'Applied', 'Under Review', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Offer', 'Hired', 'Rejected', 'Withdrawn', 'On Hold', 'Job Closed'];

  const mandateSuggest = useMemo(() => {
    const vals = [...new Set([...jobs.map((j) => j.title), ...jobs.map((j) => j.companyName)].map((s) => String(s || '').trim()).filter(Boolean))].sort();
    return (q: string) => {
      const ql = q.trim().toLowerCase();
      if (ql.length < 2) return [];
      return [...vals.filter((s) => s.toLowerCase().startsWith(ql)), ...vals.filter((s) => !s.toLowerCase().startsWith(ql) && s.toLowerCase().includes(ql))].slice(0, 8);
    };
  }, [jobs]);
  const tSkillList = useMemo(() => tskills.split(',').map((s) => s.trim()).filter(Boolean), [tskills]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [candidateForm, setCandidateForm] = useState({
    email: '',
    jobId: '',
    jobTitle: '',
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [jRes, iRes, tRes, aRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/jobs').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/interviews?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
          platformApi.tasks().catch(() => ({ data: [] as any[] })),
          applicationsApi.list().catch(() => ({ data: [] as any[] })),
        ]);
        if (jRes?.data) setJobs(jRes.data);
        if (iRes?.data) setInterviews(iRes.data);
        setTasks((((tRes as { data?: any[] })?.data || []) as any[]));
        setLiveApps((((aRes as { data?: any })?.data as any)?.data || (aRes as { data?: any[] })?.data || []) as any[]);
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
      email: '',
      jobId,
      jobTitle,
    });
    setShowSubmitModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!candidateForm.email.trim() || !candidateForm.jobId) {
      setSubmitError('Candidate email and a target mandate are required.');
      return;
    }
    setIsSubmitting(true);

    try {
      // Phase 5: attach through the common application pipeline (source-attributed,
      // duplicate-checked server-side) so employer boards see the same record.
      await applicationsApi.apply(candidateForm.jobId, candidateForm.email.trim().toLowerCase());

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSubmitModal(false);
        loadAts();
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err?.response?.data?.message || err?.message || 'Submission failed. Try again.');
    }
  };

  /* ---------- tasks (§10.1) ---------- */
  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const prev = tasks;
    const next = task.status === 'Completed' ? 'Pending' : 'Completed';
    setTasks(prev.map((t) => (t.id === taskId ? { ...t, status: next } : t)));
    try {
      await platformApi.setTask(taskId, next);
      syncAll();
    } catch {
      setTasks(prev);
    }
  };
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) { setTaskError('Task title is required.'); return; }
    setTaskBusy(true); setTaskError('');
    try {
      const created = (await platformApi.createTask({ title: taskForm.title.trim(), client: taskForm.client.trim(), dueDate: taskForm.dueDate || undefined, priority: taskForm.priority })) as { data?: any };
      if (created?.data) setTasks((x) => [created.data, ...x]);
      setTaskForm({ title: '', client: '', dueDate: '', priority: 'Medium' });
      syncAll();
    } catch (err: any) {
      setTaskError(err?.response?.data?.message || err?.message || 'Could not create task.');
    } finally {
      setTaskBusy(false);
    }
  };

  /* ---------- live ATS (§10.1: agency-scoped advance) ---------- */
  const loadAts = async () => {
    setAtsLoading(true); setAtsError('');
    try {
      const res = await applicationsApi.list('?page=1&pageSize=100');
      const body = (res as { data?: any })?.data as any;
      setLiveApps(Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []);
    } catch (err: any) {
      setAtsError(err?.response?.data?.message || err?.message || 'Could not load pipeline.');
    } finally {
      setAtsLoading(false);
    }
  };
  useEffect(() => { if (currentTab === 'ats') loadAts(); }, [currentTab]);
  const advanceStage = async (appId: string) => {
    // Phase 5: Hired comes only from Record joining; terminal stages need reopen.
    if (advStage === 'Hired') { setAtsError('Hired comes only from Record joining (Offers tab) with an accepted agreement — it cannot be set directly.'); return; }
    if (['Hired', 'Withdrawn', 'Rejected', 'Job Closed'].includes(liveApps.find((a) => a.id === appId)?.stage)) { setAtsError('Terminal applications must be reopened explicitly before moving again.'); return; }
    if (['Rejected', 'Withdrawn', 'On Hold', 'Job Closed'].includes(advStage) && !advReason.trim()) { setAtsError('A reason is required to move there — it is recorded in the audit log.'); return; }
    setAdvConfirm(appId);
  };
  const doAdvance = async () => {
    const appId = advConfirm;
    if (!appId) return;
    setAdvBusy(true); setAtsError('');
    try {
      const res = await applicationsApi.setStage(appId, advStage, advReason.trim() || undefined);
      const updated = (res as { data?: any })?.data;
      if (updated) setLiveApps((x) => x.map((a) => (a.id === appId ? updated : a)));
      setAdvFor(''); setAdvReason(''); setAdvConfirm(null);
      syncAll();
    } catch (err: any) {
      setAtsError(err?.response?.data?.message || err?.message || 'Stage move failed.');
    } finally {
      setAdvBusy(false);
    }
  };

  /* ---------- tiered candidate search (§8.5: preview → full → contact) ---------- */
  const runTalentSearch = async () => {
    setTLoading(true); setTUpgrade(''); setTSearched(true);
    try {
      const sp = new URLSearchParams({ tier });
      if (tq.trim()) sp.set('q', tq.trim());
      if (tskills.trim()) sp.set('skills', tskills.trim());
      if (texp.trim()) sp.set('expMin', texp.trim());
      if (tloc.trim()) sp.set('location', tloc.trim());
      const res = await talentApi.searchFull(`?${sp.toString()}`);
      const body = (res as { data?: any })?.data as any;
      setTierUsed(body?.tier || tier);
      setTresults(Array.isArray(body?.data) ? body.data : []);
    } catch (err: any) {
      const data = err?.response?.data as any;
      if (data?.upgrade) {
        setTUpgrade(data?.message || 'Your plan does not include this access tier.');
        setTresults([]);
      } else {
        setTUpgrade('');
        setTresults([]);
      }
    } finally {
      setTLoading(false);
    }
  };

  /* ---------- overview: feedback pending (§10.1, single query — no N+1 fan-out) ---------- */
  useEffect(() => {
    if (currentTab !== 'overview') return;
    (async () => {
      try {
        const res: any = await apiClient.get<any>('/api/v1/interviews/feedback-pending').catch(() => null);
        const n = Number((res as any)?.data?.pending ?? (res as any)?.pending ?? NaN);
        setFbPending(Number.isFinite(n) ? n : 0);
      } catch { setFbPending(0); }
    })();
  }, [currentTab]);
  // Phase 2: no UI fee math — slabs are server-enforced (8.33–15%). Show operational counts only.

  return (
    <PortalShell portalTitle="Recruiter Workspace" portalRole="recruiter" navItems={visibleNavItems}>
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#087BFF] border border-blue-200 mb-2">
              <Briefcase size={14} /> Agency Partner Workspace
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
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
          <h2 className="text-base font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/recruiter' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'submissions' && <SubmissionsPanel />}
        {currentTab === 'pools' && <TalentPoolsPanel />}
        {currentTab === 'schedule' && <InterviewsPanel />}
        {currentTab === 'offers' && <OffersPlacementsPanel />}
        {currentTab === 'commissions' && (canFinance ? <CommissionsPanel /> : <EmptyState title="Not authorized" message="Commission and payout ledgers require a finance grant. Ask your admin." />)}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Client Mandates</div>
                <div className="text-3xl font-extrabold text-slate-900">{jobs.length} Active</div>
                <div className="text-xs font-bold text-[#087BFF]">Fee per commission agreement</div>
              </div>
              <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Agency Pipeline</div>
                <div className="text-3xl font-extrabold text-slate-900">{liveApps.length} Candidates</div>
                <div className="text-xs font-bold text-emerald-600">Vetted & Dispatched to Employers</div>
              </div>
              <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers & Placements</div>
                <div className="text-3xl font-extrabold text-slate-900">{offerStage.length}</div>
                <div className="text-xs font-bold text-slate-500">{finalRoundCount} Final Rounds Pending • Fees per agreement</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Screening Queue</div>
                <div className="text-2xl font-extrabold text-slate-900">{liveApps.filter((a) => ['New', 'Applied', 'Under Review', 'Screening', 'Shortlisted'].includes(a.stage)).length}</div>
                <div className="text-xs font-bold text-amber-600">Awaiting action</div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Interviews</div>
                <div className="text-2xl font-extrabold text-slate-900">{interviews.filter((i) => ['Scheduled', 'Rescheduled'].includes(i.status)).length}</div>
                <div className="text-xs font-bold text-[#087BFF]">{interviews.length} total</div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feedback Pending</div>
                <div className="text-2xl font-extrabold text-slate-900">{fbPending}</div>
                <div className="text-xs font-bold text-slate-500">Completed, no scorecard</div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Tasks</div>
                <div className="text-2xl font-extrabold text-slate-900">{tasks.filter((t) => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString())).length}</div>
                <div className="text-xs font-bold text-red-600">{tasks.filter((t) => t.status !== 'Completed').length} open</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
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
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900">Active Client Requisition Mandates</h3>
              <div className="w-64">
                <SearchSuggest value={searchQuery} onChange={setSearchQuery} fetchSuggestions={mandateSuggest} placeholder="Search job title or company..." ariaLabel="Search mandates" />
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
                .sort((a, b) => Number(b.assignedToMe || false) - Number(a.assignedToMe || false))
                .map((job, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#087BFF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">{job.id}</span>
                        <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                        {job.assignedToMe && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Assigned to me</span>}
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

        {/* TAB 3: TALENT POOL SEARCH (tiered §8.5) */}
        {currentTab === 'talent' && (
          <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Candidate Search — tiered access</h3>
            <FilterPanel title="Search & filters" count={tSearched ? tresults.length : undefined} storageKey="nexa:recruiter-talent-filters">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <input value={tq} onChange={(e) => setTq(e.target.value)} placeholder="Name / role / keyword" aria-label="Keyword" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <div className="col-span-2"><SkillsMultiSelect value={tSkillList} onChange={(v) => setTskills(v.join(', '))} /></div>
              <input value={texp} onChange={(e) => setTexp(e.target.value)} placeholder="Min exp (yrs)" type="number" min={0} aria-label="Min experience" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <input value={tloc} onChange={(e) => setTloc(e.target.value)} placeholder="Location" aria-label="Location" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <Select value={tier} onChange={setTier} ariaLabel="Access tier" options={[{ value: 'preview', label: 'Preview (masked)' }, { value: 'full', label: 'Full profile' }, { value: 'contact', label: 'Contact unlock' }]} />
              <button type="button" onClick={runTalentSearch} disabled={tLoading} className="col-span-2 lg:col-span-1 px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-50"><Search size={13} /> Search</button>
            </div>
            </FilterPanel>
            {tUpgrade && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                🔒 {tUpgrade} Contact and full-profile tiers need a manager grant — ask your manager for access. Your search filters are preserved.
              </div>
            )}
            {tLoading ? (
              <InlineLoading message="Searching candidates…" />
            ) : tSearched && tresults.length === 0 && !tUpgrade ? (
              <EmptyState title="No candidates match" message="Adjust filters or tier and search again." />
            ) : tresults.length > 0 ? (
              <div className="space-y-2">
                {tresults.map((c: any, i: number) => (
                  <div key={c.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 text-sm">{c.name || 'Unnamed'} {c.contactLocked && <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px]">Preview — contact locked</span>}</div>
                      <div className="text-xs text-slate-500 font-medium">{c.roleTitle || ''} • {c.experienceYears ?? '—'} yrs • {c.location || ''}{c.email ? ` • ${c.email}` : ''}{c.phone ? ` • ${c.phone}` : ''}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Source: {c.submittedBy || 'platform'} • Ownership is shared — colleagues may act on authorized records.</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-bold text-[11px]">{tierUsed}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Sourced Candidates — live pipeline</h3>
            <DataTable
              rows={liveApps}
              keyOf={(a) => a.id}
              emptyTitle="No sourced candidates yet"
              emptyMessage="Candidates you attach to mandates appear here with live stages."
              columns={[
                { key: 'cand', label: 'Candidate', render: (a) => (
                  <><div className="font-extrabold text-slate-900 text-sm">{a.candidateEmail}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{a.jobTitle || a.jobId}</div></>
                ) },
                { key: 'stage', label: 'Stage', render: (a) => (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-[11px] whitespace-nowrap">{a.stage}</span>
                ) },
                { key: 'updated', label: 'Updated', render: (a) => (
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{String(a.updatedAt || '').slice(0, 16).replace('T', ' ')}</span>
                ) },
              ]}
            />
          </div>
          </div>
        )}

        {/* TAB 4: ATS PIPELINE STAGES (live, agency-scoped advance) */}
        {currentTab === 'ats' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-base font-extrabold text-slate-900">Active Agency Candidates in Client ATS Pipeline</h3>
              <button type="button" onClick={loadAts} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">Refresh</button>
            </div>
            {atsError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">{atsError}</div>}
            {atsLoading ? (
              <InlineLoading message="Loading pipeline…" />
            ) : (
            <DataTable
              rows={liveApps}
              keyOf={(a) => a.id}
              emptyTitle="Pipeline is empty"
              emptyMessage="Applications for candidates your agency submitted will appear here."
              columns={[
                { key: 'cand', label: 'Candidate', render: (a) => (
                  <><div className="font-extrabold text-slate-900 text-sm">{a.candidateEmail}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{a.jobTitle || a.jobId} • Applied {String(a.createdAt || '').slice(0, 10)}</div></>
                ) },
                { key: 'stage', label: 'Stage', render: (a) => (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-[11px] whitespace-nowrap">{a.stage}</span>
                ) },
                { key: 'updated', label: 'Updated', render: (a) => (
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{String(a.updatedAt || '').slice(0, 16).replace('T', ' ')}</span>
                ) },
                { key: 'action', label: '', render: (a) => advFor === a.id ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Select value={advStage} onChange={setAdvStage} ariaLabel="Next stage" options={STAGES.map((s) => ({ value: s, label: s }))} />
                    <input value={advReason} onChange={(e) => setAdvReason(e.target.value)} placeholder="Reason (for Rejected…)" aria-label="Move reason" className="w-40 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none" />
                    <button type="button" onClick={() => advanceStage(a.id)} disabled={advBusy} className="px-3 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-[11px] disabled:opacity-50">Review…</button>
                    <button type="button" onClick={() => { setAdvFor(''); setAdvReason(''); }} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setAdvFor(a.id); setAdvStage(a.stage); }} className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#087BFF] border border-blue-200 font-bold text-[11px] hover:bg-blue-100 whitespace-nowrap">Advance…</button>
                ) },
              ]}
            />
            )}
            <ActionConfirm
              open={advConfirm !== null}
              onCancel={() => setAdvConfirm(null)}
              title={`Move application → ${advStage}`}
              subtitle={liveApps.find((a) => a.id === advConfirm)?.candidateEmail || advConfirm || ''}
              why={['Stage change is audited with actor, timestamp and reason', 'Scoped notifications go to the hiring team']}
              confirmLabel={`Move to ${advStage}`}
              onConfirm={doAdvance}
            />
          </div>
        )}

        {/* TAB 5: INTERVIEWS */}
        {currentTab === 'interviews' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Scheduled Candidate Interviews</h3>
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
                    <div className="text-xs font-bold text-slate-500">Commission</div>
                    <div className="text-sm font-extrabold text-slate-700">Per agreement</div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB: MY TASKS (§10.1) */}
        {currentTab === 'tasks' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">My Delivery Tasks</h3>
            {taskError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">{taskError}</div>}
            <form onSubmit={createTask} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title *" aria-label="Task title" className="sm:col-span-2 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <input value={taskForm.client} onChange={(e) => setTaskForm({ ...taskForm, client: e.target.value })} placeholder="Client" aria-label="Client" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <input value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} type="date" aria-label="Due date" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <div className="flex gap-2">
                <Select value={taskForm.priority} onChange={(v) => setTaskForm({ ...taskForm, priority: v })} ariaLabel="Priority" options={['High', 'Medium', 'Low'].map((v) => ({ value: v, label: v }))} />
                <button type="submit" disabled={taskBusy} className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50 shrink-0">Add</button>
              </div>
            </form>
            {isLoading ? (
              <InlineLoading message="Loading tasks…" />
            ) : tasks.length === 0 ? (
              <EmptyState title="No tasks assigned" message="Create a task above — vetting and delivery work will appear here." />
            ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <button type="button" onClick={() => toggleTask(task.id)} aria-label={task.status === 'Completed' ? 'Reopen task' : 'Complete task'}
                      className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-colors shrink-0 ${task.status === 'Completed' ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'}`}>
                      {task.status === 'Completed' && <CheckCircle2 size={14} />}
                    </button>
                    <div className="min-w-0">
                      <div className={`font-extrabold text-slate-900 text-sm ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</div>
                      <div className="text-slate-500 font-medium mt-0.5">{task.client ? `Client: ${task.client} • ` : ''}Due: {task.dueDate || '—'} • {task.status}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-700'}`}>
                    {task.priority} Priority
                  </span>
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

              <h3 className="text-xl font-extrabold text-slate-900">Attach Candidate to Mandate</h3>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                  <div className="text-lg font-extrabold text-slate-900">Candidate attached!</div>
                  <p className="text-xs text-slate-600">The application entered the common pipeline with your attribution — employers see the same record.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold">
                      {submitError}
                    </div>
                  )}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Mandate *</label>
                    <Select
                      value={candidateForm.jobId}
                      ariaLabel="Target mandate"
                      placeholder="Select a mandate…"
                      onChange={(v) => {
                        const job = jobs.find((j) => j.id === v);
                        setCandidateForm({ ...candidateForm, jobId: v, jobTitle: job?.title || '' });
                      }}
                      options={jobs.map((j) => ({ value: j.id, label: `${j.id} — ${j.title}` }))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Candidate Email *</label>
                    <input
                      type="email"
                      required
                      value={candidateForm.email}
                      onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                      placeholder="candidate@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                    />
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Duplicates are blocked; existing profiles route to review, never overwritten.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold shadow-md cursor-pointer mt-3"
                  >
                    {isSubmitting ? 'Attaching…' : 'Attach to Mandate'}
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
