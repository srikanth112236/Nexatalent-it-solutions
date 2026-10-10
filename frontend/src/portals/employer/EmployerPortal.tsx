import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { AtsKanbanBoard } from './components/AtsKanbanBoard';
import { Building2, Plus, CheckCircle2, ArrowRight, X, Search, Video, Clock } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import {
  RequisitionsPanel, ApplicationsPanel, InterviewsPanel, ChatPanel, TalentPoolsPanel,
  CandidateSearchPanel, OutreachPanel, BillingPanel, OffersPlacementsPanel,
  SubmissionsPanel, NotificationsPanel, TimesheetsPanel,
} from '../common/EnterprisePanels';
import { getTenantId } from '../../shared/auth/session';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const navItems = [
  { label: 'Hiring Overview', path: '/employer' },
  { label: 'Company Profile', path: '/employer/company', group: 'Company' },
  { label: 'Active Requirements', path: '/employer/requirements', group: 'Hiring' },
  { label: 'ATS Candidate Pipeline', path: '/employer/candidates', group: 'Hiring' },
  { label: 'Interviews & Feedback', path: '/employer/interviews', group: 'Hiring' },
  { label: 'Requisition Pipeline', path: '/employer/requisitions', group: 'Hiring' },
  { label: 'Application Pipeline', path: '/employer/pipeline', group: 'Hiring' },
  { label: 'Schedule Interview', path: '/employer/schedule', group: 'Hiring' },
  { label: 'Talent Search', path: '/employer/talent', group: 'Talent' },
  { label: 'Talent Pools', path: '/employer/pools', group: 'Talent' },
  { label: 'Outreach', path: '/employer/outreach', group: 'Talent' },
  { label: 'Agency Submissions', path: '/employer/submissions', group: 'Talent' },
  { label: 'Offers & Placements', path: '/employer/offers', group: 'Commercial' },
  { label: 'Timesheet Reviews', path: '/employer/timesheets', group: 'Commercial' },
  { label: 'Billing & Usage', path: '/employer/billing', group: 'Commercial' },
  { label: 'Messages', path: '/employer/messages', group: 'Workspace' },
  { label: 'Hiring Reports', path: '/employer/reports', group: 'Workspace' },
  { label: 'Security', path: '/employer/security', group: 'Workspace' },
  { label: 'Notifications', path: '/employer/notifications', group: 'Workspace' },
];

export function EmployerPortal() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/company')) return 'company';
    if (p.includes('/requirements')) return 'requirements';
    if (p.includes('/candidates')) return 'candidates';
    if (p.includes('/interviews')) return 'interviews';
    if (p.includes('/requisitions')) return 'requisitions';
    if (p.includes('/pipeline')) return 'pipeline';
    if (p.includes('/talent') && !p.includes('/pools')) return 'talent';
    if (p.includes('/pools')) return 'pools';
    if (p.includes('/outreach')) return 'outreach';
    if (p.includes('/offers')) return 'offers';
    if (p.includes('/schedule')) return 'schedule';
    if (p.includes('/submissions')) return 'submissions';
    if (p.includes('/timesheets')) return 'timesheets';
    if (p.includes('/billing')) return 'billing';
    if (p.includes('/messages') || p.includes('/chat')) return 'messages';
    if (p.includes('/security')) return 'security';
    if (p.includes('/notifications')) return 'notifications';
    if (p.includes('/reports')) return 'reports';
    return 'overview';
  })();

  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [outstanding, setOutstanding] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState('');

  // Requisition Modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Company Profile Form — full §6.4 field set; blank until loaded from the server.
  const [companyProfile, setCompanyProfile] = useState({
    legalName: '',
    displayName: '',
    entityType: '',
    industry: '',
    subIndustry: '',
    companySize: '',
    website: '',
    description: '',
    registrationNumber: '',
    gstin: '',
    registeredAddress: '',
    headquarters: '',
    operatingLocations: '',
    hqLocation: '',
    employeeCount: '',
    primaryContactName: '',
    primaryContactDesignation: '',
    businessEmail: '',
    businessPhone: '',
    billingContact: '',
    financeEmail: '',
    domain: '',
    techStack: '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    employmentType: '',
    location: '',
    experienceRequired: '',
    skills: '',
    minCtc: '',
    maxCtc: '',
    description: '',
    agencyNames: '',
    vendorNames: '',
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const tenant = getTenantId() || 'TNT-9011';
        const [jRes, iRes, cRes, compRes, useRes, invRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/jobs').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/interviews').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/candidates').catch(() => ({ data: [] as any[] })),
          apiClient.get<any>(`/api/v1/company?tenant=${encodeURIComponent(tenant)}`).catch(() => null),
          apiClient.get<any>('/api/v1/usage').catch(() => null),
          apiClient.get<any[]>('/api/v1/invoices').catch(() => ({ data: [] as any[] })),
        ]);
        if (jRes?.data) setJobs(jRes.data);
        if (iRes?.data) setInterviews(iRes.data);
        if (cRes?.data) setCandidates(cRes.data);
        if ((useRes as { data?: any })?.data) setUsage((useRes as { data: any }).data);
        if (invRes?.data) setOutstanding(invRes.data.reduce((a: number, i: any) => a + Number(i.balance || 0), 0));
        const saved = (compRes as { data?: any })?.data;
        if (saved?.legalName) setCompanyProfile((prev) => ({ ...prev, ...saved }));
      } catch (err) {
        console.warn('API Error in EmployerPortal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const vettedCount = candidates.filter((c) => c.stage && c.stage !== 'Applied').length;
  const offerCount = candidates.filter((c) => c.stage === 'Offer Issued' || c.stage === 'Hired').length;

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiClient.post<any>('/api/v1/jobs', {
        title: jobForm.title,
        department: jobForm.department,
        companyName: companyProfile.legalName,
        location: jobForm.location,
        budgetRange: `${jobForm.minCtc} - ${jobForm.maxCtc} PA`,
        experienceRequired: jobForm.experienceRequired,
        assignedAgencies: jobForm.agencyNames.split(',').map((s) => s.trim()).filter(Boolean),
        assignedVendors: jobForm.vendorNames.split(',').map((s) => s.trim()).filter(Boolean),
      });

      if (res.data) {
        setJobs([res.data, ...jobs]);
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowJobModal(false);
        setWizardStep(1);
        navigate('/employer/requirements');
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      setShowJobModal(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    try {
      const res = await apiClient.put<any>('/api/v1/company', companyProfile);
      if ((res as { data?: any })?.data) {
        setCompanyProfile((prev) => ({ ...prev, ...(res as { data: any }).data }));
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Could not save company profile.');
    }
  };

  return (
    <PortalShell portalTitle="Employer Workspace" portalRole="employer" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#087BFF] border border-blue-200 mb-2">
              <Building2 size={14} /> {companyProfile.legalName || getTenantId() || 'Employer Workspace'}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Employer Hiring Requisitions & Intelligence
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Publish technical requisitions, evaluate vetted candidate shortlists, and manage ATS pipelines.
            </p>
          </div>

          <button
            onClick={() => setShowJobModal(true)}
            className="px-5 py-3.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} /> Post New Requisition
          </button>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/employer' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'requisitions' && <RequisitionsPanel />}
        {currentTab === 'pipeline' && <ApplicationsPanel />}
        {currentTab === 'talent' && <CandidateSearchPanel />}
        {currentTab === 'pools' && <TalentPoolsPanel />}
        {currentTab === 'outreach' && <OutreachPanel />}
        {currentTab === 'offers' && <OffersPlacementsPanel />}
        {currentTab === 'schedule' && <InterviewsPanel />}
        {currentTab === 'submissions' && <SubmissionsPanel canReview />}
        {currentTab === 'timesheets' && <TimesheetsPanel canApprove />}
        {currentTab === 'billing' && <BillingPanel />}
        {currentTab === 'messages' && <ChatPanel />}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Requisitions</div>
                <div className="text-3xl font-extrabold text-slate-900">{jobs.length} Active</div>
                <div className="text-xs font-bold text-[#087BFF]">{interviews.length} interviews scheduled</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Candidates</div>
                <div className="text-3xl font-extrabold text-slate-900">{candidates.length} Total</div>
                <div className="text-xs font-bold text-emerald-600">{vettedCount} past initial stage</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers Issued</div>
                <div className="text-3xl font-extrabold text-slate-900">{offerCount} Placements</div>
                <div className="text-xs font-bold text-slate-500">{candidates.length === 0 ? 'No pipeline yet' : `${offerCount} of ${candidates.length} in offer stage`}</div>
              </div>
            </div>

            {(usage || outstanding > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plan</div>
                  <div className="text-xl font-extrabold text-slate-900">{usage?.plan || '—'}</div>
                  <div className="text-[11px] font-bold text-slate-500">Subscription: {usage?.subscription || '—'}</div>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Outstanding Invoices</div>
                  <div className="text-xl font-extrabold text-slate-900">₹{outstanding.toLocaleString('en-IN')}</div>
                </div>
                {Object.entries((usage?.usage || {}) as Record<string, any>).slice(0, 2).map(([k, v]: [string, any]) => (
                  <div key={k} className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{k}</div>
                    <div className="text-xl font-extrabold text-slate-900">{v.limit !== undefined ? `${v.used}/${v.limit}` : 'Enabled'}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Active Job Requisitions & Assigned Delivery Partners</h3>
              {isLoading ? (
                <InlineLoading message="Loading requisitions…" />
              ) : jobs.length === 0 ? (
                <EmptyState title="No requisitions yet" message="Post your first requisition to start receiving vetted candidates." />
              ) : (
              <div className="space-y-3">
                {jobs.map((job, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{job.title}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {job.id} • {job.location} • Budget: {job.budgetRange}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/employer/candidates')}
                      className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs hover:bg-blue-600 cursor-pointer"
                    >
                      View ATS Board →
                    </button>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMPANY PROFILE & KYC */}
        {currentTab === 'company' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Enterprise Company Profile & KYC Verification</h3>
                <p className="text-xs text-slate-500">Maintain corporate registration, billing contacts, and technical stack taxonomy.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs flex items-center gap-1">
                <CheckCircle2 size={13} /> {companyProfile.legalName ? 'Profile Saved' : 'Profile Incomplete'}
              </span>
            </div>

            {profileSaved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Enterprise Company Profile successfully saved and updated!
              </div>
            )}

            {saveError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Legal Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={companyProfile.legalName}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, legalName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corporate CIN / Tax Registration *</label>
                  <input
                    type="text"
                    required
                    value={companyProfile.registrationNumber}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, registrationNumber: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HQ Address & Hubs *</label>
                  <input
                    type="text"
                    required
                    value={companyProfile.hqLocation}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, hqLocation: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Finance & Billing Email *</label>
                  <input
                    type="email"
                    required
                    value={companyProfile.billingContact}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, billingContact: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Tech Stack Taxonomy</label>
                <input
                  type="text"
                  value={companyProfile.techStack}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, techStack: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display / Brand Name</label>
                  <input
                    type="text"
                    value={companyProfile.displayName}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, displayName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Entity Type</label>
                  <input
                    type="text"
                    value={companyProfile.entityType}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, entityType: e.target.value })}
                    placeholder="Pvt Ltd / LLP / …"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={companyProfile.industry}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, industry: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sub-Industry</label>
                  <input
                    type="text"
                    value={companyProfile.subIndustry}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, subIndustry: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Size</label>
                  <input
                    type="text"
                    value={companyProfile.companySize}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, companySize: e.target.value })}
                    placeholder="e.g. 51–200"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={companyProfile.website}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, website: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={companyProfile.gstin}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, gstin: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Description</label>
                <textarea
                  rows={2}
                  value={companyProfile.description}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registered Address</label>
                  <input
                    type="text"
                    value={companyProfile.registeredAddress}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, registeredAddress: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operating & Hiring Locations</label>
                  <input
                    type="text"
                    value={companyProfile.operatingLocations}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, operatingLocations: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Contact Name</label>
                  <input
                    type="text"
                    value={companyProfile.primaryContactName}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, primaryContactName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Contact Designation</label>
                  <input
                    type="text"
                    value={companyProfile.primaryContactDesignation}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, primaryContactDesignation: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={companyProfile.businessEmail}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, businessEmail: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Phone</label>
                  <input
                    type="tel"
                    value={companyProfile.businessPhone}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, businessPhone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Finance Email</label>
                  <input
                    type="email"
                    value={companyProfile.financeEmail}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, financeEmail: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Save Profile & KYC Details
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ACTIVE REQUISITIONS */}
        {currentTab === 'requirements' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900">Active Technical Job Requisitions</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search job title or req ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none w-56"
                  />
                </div>
                <button
                  onClick={() => setShowJobModal(true)}
                  className="px-4 py-2 bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> New Job
                </button>
              </div>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading requisitions…" />
            ) : jobs.length === 0 ? (
              <EmptyState title="No requisitions yet" message="Create your first job requisition to start hiring." />
            ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs
                .filter(j => String(j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(j.id || '').toLowerCase().includes(searchQuery.toLowerCase()))
                .map((job, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-[10px] font-mono mr-2">
                          {job.id}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                        {job.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 font-medium">
                      <div><strong>Department:</strong> {job.department} • <strong>Location:</strong> {job.location}</div>
                      <div><strong>CTC Budget:</strong> {job.budgetRange} • <strong>Experience:</strong> {job.experienceRequired}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-slate-500 font-bold">Allocated Partners:</span>
                        {job.assignedAgencies?.map((ag: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">
                            Agency: {ag}
                          </span>
                        ))}
                        {job.assignedVendors?.map((vn: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px]">
                            Vendor: {vn}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 4: ATS CANDIDATE PIPELINE */}
        {currentTab === 'candidates' && (
          <AtsKanbanBoard />
        )}

        {/* TAB 5: INTERVIEWS & FEEDBACK */}
        {currentTab === 'interviews' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Scheduled Candidate Interviews & Evaluator Scorecards</h3>
            {isLoading ? (
              <InlineLoading message="Loading interviews…" />
            ) : interviews.length === 0 ? (
              <EmptyState title="No interviews scheduled" message="Interviews for shortlisted candidates will appear here." />
            ) : (
            <div className="space-y-3">
              {interviews.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{item.candidateName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#087BFF] font-extrabold text-[10px]">{item.roundName}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Role: <strong>{item.jobTitle}</strong> • Interviewer: {item.interviewer}
                    </div>
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 pt-1">
                      <Clock size={13} /> {item.date}
                    </div>
                  </div>
                  <a
                    href={item.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Video size={14} /> Join Video Interview
                  </a>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 6: HIRING REPORTS */}
        {currentTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Technical Hiring Performance Intelligence</h3>
              <p className="text-xs text-slate-500">Real-time metrics on Time-to-Fill, Cost-per-Hire, and Sourcing Channel Efficiency.</p>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading reports…" />
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase">Open Requisitions</div>
                <div className="text-3xl font-extrabold text-slate-900">{jobs.length}</div>
                <div className="text-xs font-bold text-emerald-600">Live mandates in market</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase">Pipeline Conversion</div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {candidates.length === 0 ? '—' : `${Math.round((offerCount / candidates.length) * 100)}%`}
                </div>
                <div className="text-xs font-bold text-[#087BFF]">{offerCount} offers from {candidates.length} candidates</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase">Vetting Throughput</div>
                <div className="text-3xl font-extrabold text-slate-900">{vettedCount}</div>
                <div className="text-xs font-bold text-emerald-600">Candidates past screening</div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* RICH MULTI-STEP REQUISITION WIZARD MODAL */}
        {showJobModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative space-y-6">
              
              <button
                onClick={() => setShowJobModal(false)}
                className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Create Technical Requisition</h3>
                  <p className="text-xs text-slate-500 font-medium">Define technical specs, CTC budget, and partner allocation.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-xs">
                  Step {wizardStep} of 3
                </span>
              </div>

              {submitSuccess ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">Requisition Published & Dispatched!</h4>
                  <p className="text-xs text-slate-600">Broadcasted to assigned Agency and Vendor partner networks via HTTP API.</p>
                </div>
              ) : (
                <form onSubmit={handlePublishJob} className="space-y-4 text-xs">
                  
                  {/* STEP 1: Overview */}
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Requisition Job Title *</label>
                          <input
                            type="text"
                            required
                            value={jobForm.title}
                            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Department / Pod *</label>
                          <input
                            type="text"
                            required
                            value={jobForm.department}
                            onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Work Location & Mode *</label>
                          <input
                            type="text"
                            required
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Experience Years Required *</label>
                          <input
                            type="text"
                            required
                            value={jobForm.experienceRequired}
                            onChange={(e) => setJobForm({ ...jobForm, experienceRequired: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Skills & Compensation */}
                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Primary Skillset Taxonomy Tags *</label>
                        <input
                          type="text"
                          required
                          value={jobForm.skills}
                          onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                          placeholder="e.g. React, Node.js, AWS, Kubernetes, Docker"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Min Annual CTC (INR) *</label>
                          <input
                            type="text"
                            required
                            value={jobForm.minCtc}
                            onChange={(e) => setJobForm({ ...jobForm, minCtc: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Max Annual CTC (INR) *</label>
                          <input
                            type="text"
                            required
                            value={jobForm.maxCtc}
                            onChange={(e) => setJobForm({ ...jobForm, maxCtc: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Requisition Summary & Scope *</label>
                        <textarea
                          rows={2}
                          required
                          value={jobForm.description}
                          onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Allocation Controls */}
                  {wizardStep === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                        <div className="font-bold text-slate-900">Allocation to External Delivery Networks:</div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Agency names (comma-separated, leave blank for open marketplace)</label>
                          <input
                            type="text"
                            value={jobForm.agencyNames}
                            onChange={(e) => setJobForm({ ...jobForm, agencyNames: e.target.value })}
                            placeholder="e.g. Apex Tech Search, Premier Talent"
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Vendor names (comma-separated, leave blank for none)</label>
                          <input
                            type="text"
                            value={jobForm.vendorNames}
                            onChange={(e) => setJobForm({ ...jobForm, vendorNames: e.target.value })}
                            placeholder="e.g. Global TechSolutions"
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal Navigation */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {wizardStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setWizardStep(wizardStep - 1)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                      >
                        ← Back
                      </button>
                    ) : <div />}

                    {wizardStep < 3 ? (
                      <button
                        type="button"
                        onClick={() => setWizardStep(wizardStep + 1)}
                        className="px-6 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold hover:bg-blue-600 cursor-pointer flex items-center gap-2"
                      >
                        <span>Next Step</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <span>{isSubmitting ? 'Publishing...' : 'Publish & Broadcast Requisition'}</span>
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>

                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </PortalShell>
  );
}
