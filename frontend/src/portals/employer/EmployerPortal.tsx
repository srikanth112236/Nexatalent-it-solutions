import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { Building2, Plus, CheckCircle2, ArrowRight, X, Pencil } from 'lucide-react';
import { KeyValues, StatusPill, DetailDrawer, DrawerCard, DrawerList, SearchSuggest, drawerTone } from '../common/CrudKit';
import { apiClient } from '../../shared/api-client';
import { jobsApi, requisitionsApi, applicationsApi, directoryApi } from '../../shared/enterprise/phaseApi';
import {
  RequisitionsPanel, ApplicationsPanel, InterviewsPanel, ChatPanel, TalentPoolsPanel,
  CandidateSearchPanel, OutreachPanel, EmployerBillingWorkspace, OffersPlacementsPanel, RequirementCreatePage,
  SubmissionsPanel, NotificationsPanel, TimesheetsPanel, syncAll,
  ActivityTimeline, AssignRecruiterModal, auditLabel, sortActivity,
} from '../common/EnterprisePanels';
import type { ActivityItem } from '../common/EnterprisePanels';
import { getTenantId, getActiveRole } from '../../shared/auth/session';
import { ConfirmDialog, RowMenu } from '../../shared/ui/EnterpriseKit';
import type { MenuItem } from '../../shared/ui/EnterpriseKit';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const navItems = [
  { label: 'Hiring Overview', path: '/employer' },
  { label: 'Company Profile', path: '/employer/company', group: 'Company' },
  { label: 'Requirements', path: '/employer/requisitions', group: 'Hiring' },
  { label: 'Job Postings', path: '/employer/requirements', group: 'Hiring' },
  { label: 'Applications', path: '/employer/candidates', group: 'Hiring' },
  { label: 'Interviews & Feedback', path: '/employer/interviews', group: 'Hiring' },
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
    if (p.includes('/requisitions/new')) return 'requisitions-new';
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
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
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
  const [companyProfile, setCompanyProfile] = useState({    legalName: '',
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
    verificationStatus: '',
    accountStatus: '',
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSnapshot, setProfileSnapshot] = useState<any>(null);
  const startEditProfile = () => { setProfileSnapshot({ ...companyProfile }); setEditingProfile(true); setSaveError(''); };
  const cancelEditProfile = () => { if (profileSnapshot) setCompanyProfile(profileSnapshot); setEditingProfile(false); setSaveError(''); };
  const viewingProfile = Boolean(companyProfile.legalName) && !editingProfile;

  // Job Form State — full §8.4 field set (create + edit)
  const [jobForm, setJobForm] = useState<any>(blankJobForm());

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const tenant = getTenantId() || 'TNT-9011';
        const [jRes, iRes, cRes, compRes, useRes, invRes, reqRes, appRes, subRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/jobs').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/interviews?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/candidates').catch(() => ({ data: [] as any[] })),
          apiClient.get<any>(`/api/v1/company?tenant=${encodeURIComponent(tenant)}`).catch(() => null),
          apiClient.get<any>('/api/v1/usage').catch(() => null),
          apiClient.get<any[]>('/api/v1/invoices').catch(() => ({ data: [] as any[] })),
          requisitionsApi.list().catch(() => ({ data: [] as any[] })),
          applicationsApi.list('?page=1&pageSize=200').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/subscriptions').catch(() => ({ data: [] as any[] })),
        ]);
        if (jRes?.data) setJobs(jRes.data);
        if (iRes?.data) setInterviews(iRes.data);
        if (cRes?.data) setCandidates(cRes.data);
        if ((useRes as { data?: any })?.data) setUsage((useRes as { data: any }).data);
        if (invRes?.data) setOutstanding(invRes.data.reduce((a: number, i: any) => a + Number(i.balance || 0), 0));
        const saved = (compRes as { data?: any })?.data;
        if (saved?.legalName) setCompanyProfile((prev) => ({ ...prev, ...saved }));
        const reqs = ((reqRes as { data?: any })?.data as any[]) || (((reqRes as { data?: { data?: any[] } })?.data)?.data as any[]) || [];
        setRequisitions(Array.isArray(reqs) ? reqs : []);
        const apps = ((appRes as { data?: any })?.data as any[]) || (((appRes as { data?: { data?: any[] } })?.data)?.data as any[]) || [];
        setAllApplications(Array.isArray(apps) ? apps : []);
        const subs = ((subRes as { data?: any })?.data as any[]) || [];
        if (Array.isArray(subs) && subs.length > 0) setSubscription(subs[0]);
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

  const [editingJob, setEditingJob] = useState<any>(null);
  const [jobAction, setJobAction] = useState<{ job: any; kind: string } | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'role' | 'setup' | 'applicants' | 'activity'>('overview');
  const [reqTab, setReqTab] = useState<'all' | 'live' | 'paused' | 'closed' | 'draft'>('all');
  const [jobActionReason, setJobActionReason] = useState('');
  const [jobActionExpiry, setJobActionExpiry] = useState('');
  const [jobActionError, setJobActionError] = useState('');
  const [jobDetail, setJobDetail] = useState<any>(null);
  const jobDetailId = jobDetail?.id;
  const [jobLogs, setJobLogs] = useState<any[]>([]);
  const [jobDetailLoading, setJobDetailLoading] = useState(false);
  const [reqAssignFor, setReqAssignFor] = useState<any>(null);
  const [reqAssignBusy, setReqAssignBusy] = useState(false);
  useEffect(() => { setDrawerTab('overview'); }, [jobDetailId]);
  // Full job record (history, expiry) + the tenant audit trail for this posting.
  useEffect(() => {
    setJobLogs([]);
    if (!jobDetailId) return;
    let live = true;
    (async () => {
      setJobDetailLoading(true);
      const [jRes, aRes] = await Promise.all([
        jobsApi.detail(jobDetailId).catch(() => null),
        directoryApi.auditLogs(`?recordId=${encodeURIComponent(jobDetailId)}&page=1&pageSize=50`).catch(() => null),
      ]);
      if (!live) return;
      const full = (jRes as { data?: any })?.data;
      if (full?.id) setJobDetail((prev: any) => (prev && prev.id === full.id ? { ...prev, ...full } : prev));
      const d = (aRes as { data?: any })?.data;
      setJobLogs(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      setJobDetailLoading(false);
    })();
    return () => { live = false; };
  }, [jobDetailId]);
  /** Assign a recruiter to the requirement behind this posting (shared modal). */
  const openJobAssign = async () => {
    const rid = jobDetail?.requisitionId;
    if (!rid) return;
    setReqAssignBusy(true);
    try {
      const res = await requisitionsApi.get(rid);
      const row = (res as { data?: any })?.data;
      setReqAssignFor(row?.id ? row : { id: rid, title: jobDetail?.title || rid });
    } catch { setReqAssignFor({ id: rid, title: jobDetail?.title || rid }); }
    finally { setReqAssignBusy(false); }
  };

  const openNewJob = () => {
    setEditingJob(null);
    setJobForm(blankJobForm());
    setWizardStep(1);
    setShowJobModal(true);
  };
  const openEditJob = (job: any) => {
    setEditingJob(job);
    setJobForm({
      ...blankJobForm(),
      requisitionId: job.requisitionId || '',
      title: job.title || '', description: job.description || '', responsibilities: job.responsibilities || '',
      requiredSkills: job.requiredSkills || '', preferredSkills: job.preferredSkills || '',
      qualifications: job.qualifications || '',
      experienceMin: job.experienceMin ?? '', experienceMax: job.experienceMax ?? '',
      location: job.location || '', employmentType: job.employmentType || '',
      workArrangement: job.workArrangement || '', salaryMin: job.salaryMin ?? '',
      salaryMax: job.salaryMax ?? '', currency: job.currency || 'INR',
      salaryDisclosure: job.salaryDisclosure || '', visibility: job.visibility || 'public',
      startDate: (job.startDate || '').slice(0, 10), expiryDate: (job.expiryDate || '').slice(0, 10),
      applicationQuestions: job.applicationQuestions || '', requiredDocs: job.requiredDocs || '',
      applicationSettings: job.applicationSettings || '',
      agencyNames: (job.assignedAgencies || []).join(', '), vendorNames: (job.assignedVendors || []).join(', '),
      department: job.department || '', editReason: '',
    });
    setWizardStep(1);
    setShowJobModal(true);
  };

  const validateJobForm = (): string[] => {
    const errs: string[] = [];
    if (String(jobForm.title || '').trim().length < 3) errs.push('Title needs at least 3 characters.');
    const emn = jobForm.experienceMin === '' ? null : Number(jobForm.experienceMin);
    const emx = jobForm.experienceMax === '' ? null : Number(jobForm.experienceMax);
    if (emn !== null && emx !== null && emn > emx) errs.push('Experience min cannot exceed max.');
    const smn = jobForm.salaryMin === '' ? null : Number(jobForm.salaryMin);
    const smx = jobForm.salaryMax === '' ? null : Number(jobForm.salaryMax);
    if (smn !== null && smx !== null && smn > smx) errs.push('Salary min cannot exceed max.');
    if (jobForm.startDate && jobForm.expiryDate && jobForm.expiryDate <= jobForm.startDate) errs.push('Expiry must be after start date.');
    if (editingJob?.status === 'Published' && !String(jobForm.editReason || '').trim()) errs.push('A change note is required when editing a published job (audited).');
    return errs;
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateJobForm();
    if (errs.length > 0) { setSaveError(errs.join(' ')); return; }
    setSaveError('');
    setIsSubmitting(true);
    const num = (v: unknown) => (v === '' || v === undefined ? undefined : Number(v));
    const payload: any = {
      requisitionId: jobForm.requisitionId || undefined,
      title: String(jobForm.title).trim(),
      description: jobForm.description || undefined,
      responsibilities: jobForm.responsibilities || undefined,
      requiredSkills: jobForm.requiredSkills || undefined,
      preferredSkills: jobForm.preferredSkills || undefined,
      qualifications: jobForm.qualifications || undefined,
      experienceMin: num(jobForm.experienceMin), experienceMax: num(jobForm.experienceMax),
      location: jobForm.location || undefined, employmentType: jobForm.employmentType || undefined,
      workArrangement: jobForm.workArrangement || undefined,
      salaryMin: num(jobForm.salaryMin), salaryMax: num(jobForm.salaryMax),
      currency: jobForm.currency || undefined, salaryDisclosure: jobForm.salaryDisclosure || undefined,
      visibility: jobForm.visibility || 'public',
      startDate: jobForm.startDate || undefined, expiryDate: jobForm.expiryDate || undefined,
      applicationQuestions: jobForm.applicationQuestions || undefined,
      requiredDocs: jobForm.requiredDocs || undefined,
      applicationSettings: jobForm.applicationSettings || undefined,
      department: jobForm.department || undefined,
      companyName: companyProfile.legalName || undefined,
      assignedAgencies: String(jobForm.agencyNames || '').split(',').map((s) => s.trim()).filter(Boolean),
      assignedVendors: String(jobForm.vendorNames || '').split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingJob) {
        const res = await jobsApi.update(editingJob.id, payload);
        const updated = (res as { data?: any })?.data || { ...editingJob, ...payload };
        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? updated : j)));
        if (jobDetail?.id === editingJob.id) setJobDetail(updated);
      } else {
        const res = await jobsApi.create(payload);
        const created = (res as { data?: any })?.data;
        if (created) setJobs((prev) => [created, ...prev]);
      }
      syncAll();
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowJobModal(false);
        setWizardStep(1);
        setEditingJob(null);
      }, 1200);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Could not save job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const runJobAction = async () => {
    if (!jobAction) return;
    setJobActionError('');
    const statusMap: Record<string, string> = {
      review: 'Pending Review', publish: 'Published', pause: 'Paused', resume: 'Published',
      close: 'Closed', reopen: 'Published', archive: 'Archived', approve: 'Approved',
    };
    const next = statusMap[jobAction.kind];
    if (!next) return;
    if ((jobAction.kind === 'reopen' || jobAction.kind === 'publish') && jobActionExpiry) {
      // expiry passed through below
    }
    try {
      const res = await jobsApi.setStatus(
        jobAction.job.id, next,
        jobActionReason.trim() || undefined,
        jobActionExpiry || undefined,
      );
      const updated = (res as { data?: any })?.data || { ...jobAction.job, status: next };
      setJobs((prev) => prev.map((j) => (j.id === jobAction.job.id ? updated : j)));
      if (jobDetail?.id === jobAction.job.id) setJobDetail(updated);
      syncAll();
      // Sync fan-out display: requisition rollups + pipeline counts refresh after every transition.
      try {
        const [rqRes, appRes] = await Promise.all([
          requisitionsApi.list().catch(() => null),
          applicationsApi.list('?page=1&pageSize=200').catch(() => null),
        ]);
        const rq = ((rqRes as { data?: any })?.data as any[]) || (((rqRes as { data?: { data?: any[] } })?.data)?.data as any[]) || [];
        if (Array.isArray(rq)) setRequisitions(rq);
        const ap = ((appRes as { data?: any })?.data as any[]) || (((appRes as { data?: { data?: any[] } })?.data)?.data as any[]) || [];
        if (Array.isArray(ap)) setAllApplications(ap);
      } catch { /* lists already updated optimistically */ }
      setJobAction(null); setJobActionReason(''); setJobActionExpiry('');
    } catch (err: any) {
      setJobActionError(err?.response?.data?.message || err?.message || 'Transition rejected by approval rules.');
    }
  };

  // Single Manage menu per job: View + Edit (locked while live) + lifecycle (pause/close/…).
  const startAction = (job: any, kind: string) => {
    setJobDetail(job);
    setJobAction({ job, kind }); setJobActionReason(''); setJobActionExpiry(''); setJobActionError('');
  };
  const manageItems = (job: any, hideView = false): MenuItem[] => {
    const items: MenuItem[] = [];
    if (!hideView) items.push({ label: 'View details', onSelect: () => setJobDetail(job) });
    if (job.status === 'Published') {
      items.push({ label: 'Edit — locked while live', disabled: true, hint: 'Pause the job to edit it, or close it.', onSelect: () => {} });
    } else {
      items.push({ label: 'Edit', onSelect: () => { setJobDetail(null); setJobAction(null); openEditJob(job); } });
    }
    // Reopen needs the 'approve' permission (hiring managers, ops, superadmin) — others see it locked with the reason.
    const canApprove = ['superadmin', 'platform_owner', 'operations_admin', 'employee', 'hiring_manager', 'sales_manager'].includes(getActiveRole() || '');
    for (const a of lifecycleFor(job.status)) {
      const locked = a.kind === 'reopen' && !canApprove;
      items.push({
        label: locked ? `${a.label} — needs approver` : a.label,
        danger: ['close', 'archive'].includes(a.kind),
        disabled: locked,
        hint: locked ? 'Only hiring managers, ops or superadmin can reopen. Ask them or support.' : a.label,
        onSelect: () => startAction(job, a.kind),
      });
    }
    return items;
  };
  const reqBucket = (j: any) => j.status === 'Published' ? 'live' : j.status === 'Paused' ? 'paused' : j.status === 'Closed' ? 'closed' : 'draft';
  const reqCounts = (bucket: string) => jobs.filter((j: any) => bucket === 'all' || reqBucket(j) === bucket).length;
  const reqApps = (bucket: string) => {
    const ids = new Set(jobs.filter((j: any) => bucket === 'all' || reqBucket(j) === bucket).map((j: any) => j.id));
    return allApplications.filter((a: any) => ids.has(a.jobId)).length;
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
      setEditingProfile(false);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Could not save company profile.');
    }
  };

  return (
    <PortalShell portalTitle="Employer Workspace" portalRole="employer" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#087BFF] border border-blue-200 mb-2">
              <Building2 size={14} /> {companyProfile.legalName || getTenantId() || 'Employer Workspace'}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Employer Hiring Requirements & Intelligence
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Publish technical requirements, evaluate vetted candidate shortlists, and manage ATS pipelines.
            </p>
          </div>

          <button
            onClick={openNewJob}
            className="px-5 py-3.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} /> Post New Requirement
          </button>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/employer' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'requisitions' && <RequisitionsPanel />}
        {currentTab === 'requisitions-new' && <RequirementCreatePage base="/employer" />}
        {currentTab === 'pipeline' && <ApplicationsPanel />}
        {currentTab === 'talent' && <CandidateSearchPanel />}
        {currentTab === 'pools' && <TalentPoolsPanel />}
        {currentTab === 'outreach' && <OutreachPanel />}
        {currentTab === 'offers' && <OffersPlacementsPanel />}
        {currentTab === 'schedule' && <InterviewsPanel />}
        {currentTab === 'submissions' && <SubmissionsPanel canReview />}
        {currentTab === 'timesheets' && <TimesheetsPanel canApprove />}
        {currentTab === 'billing' && <EmployerBillingWorkspace />}
        {currentTab === 'messages' && <ChatPanel />}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

        {/* TAB 1: OVERVIEW (§8.2 — 14 widgets, each linked) */}
        {currentTab === 'overview' && (
          <OverviewDashboard
            jobs={jobs} requisitions={requisitions} applications={allApplications}
            interviews={interviews} usage={usage} subscription={subscription}
            outstanding={outstanding} isLoading={isLoading} navigate={navigate}
            onNewJob={openNewJob}
          />
        )}

        {/* TAB 2: COMPANY PROFILE & KYC */}
        {currentTab === 'company' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Enterprise Company Profile & KYC Verification</h3>
                <p className="text-xs text-slate-500">Maintain corporate registration, billing contacts, and technical stack taxonomy.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs hidden sm:flex items-center gap-1">
                  <CheckCircle2 size={13} /> {companyProfile.legalName ? 'Profile Saved' : 'Profile Incomplete'}
                </span>
                {viewingProfile ? (
                  <button type="button" onClick={startEditProfile} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-700 transition cursor-pointer">
                    <Pencil size={13} /> Edit profile
                  </button>
                ) : (
                  <button type="button" onClick={cancelEditProfile} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition cursor-pointer">
                    <X size={13} /> Cancel
                  </button>
                )}
              </div>
            </div>

            {/* §8.1: verification vs account status are separate */}
            <CompanyStatusBanner
              verification={companyProfile.verificationStatus}
              account={companyProfile.accountStatus}
            />

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

            {viewingProfile ? (
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#0B2E5E] text-white relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#087BFF]/30 blur-3xl" aria-hidden="true" />
                  <span aria-hidden="true" className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white font-extrabold text-xl flex items-center justify-center shrink-0 relative">
                    {companyProfile.legalName.trim().charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1 relative">
                    <div className="text-lg font-extrabold truncate">{companyProfile.legalName}</div>
                    {companyProfile.displayName && companyProfile.displayName !== companyProfile.legalName && (
                      <div className="text-xs text-slate-300 font-bold truncate">{companyProfile.displayName}</div>
                    )}
                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                      {[companyProfile.industry, companyProfile.companySize].filter(Boolean).join(' • ') || '—'}
                    </div>
                    {companyProfile.website && (
                      <a href={companyProfile.website.startsWith('http') ? companyProfile.website : `https://${companyProfile.website}`} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-300 font-bold hover:underline break-all">
                        {companyProfile.website}
                      </a>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <StatusPill value={companyProfile.verificationStatus || 'Pending'} />
                      <StatusPill value={companyProfile.accountStatus || 'Invited'} />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Identity</div>
                  <KeyValues data={[
                    ['Display / brand name', companyProfile.displayName || '—'],
                    ['Entity type', companyProfile.entityType || '—'],
                    ['Industry', companyProfile.industry || '—'],
                    ['Sub-industry', companyProfile.subIndustry || '—'],
                    ['Company size', companyProfile.companySize || '—'],
                    ['Employees', companyProfile.employeeCount || '—'],
                  ]} />
                </div>

                {companyProfile.description && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">About</div>
                    <div className="text-xs font-medium text-slate-800 mt-1 whitespace-pre-wrap">{companyProfile.description}</div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Registration & tax</div>
                  <KeyValues data={[
                    ['CIN / registration', companyProfile.registrationNumber || '—'],
                    ['GSTIN', companyProfile.gstin || '—'],
                    ['Registered address', companyProfile.registeredAddress || '—'],
                    ['Headquarters', companyProfile.headquarters || companyProfile.hqLocation || '—'],
                    ['Operating locations', companyProfile.operatingLocations || '—'],
                    ['Domain', companyProfile.domain || '—'],
                  ]} />
                </div>

                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Contacts</div>
                  <KeyValues data={[
                    ['Primary contact', companyProfile.primaryContactName ? `${companyProfile.primaryContactName}${companyProfile.primaryContactDesignation ? ` (${companyProfile.primaryContactDesignation})` : ''}` : '—'],
                    ['Business email', companyProfile.businessEmail || '—'],
                    ['Business phone', companyProfile.businessPhone || '—'],
                    ['Billing contact', companyProfile.billingContact || '—'],
                    ['Finance email', companyProfile.financeEmail || '—'],
                    ['Tech stack', companyProfile.techStack || '—'],
                  ]} />
                </div>
              </div>
            ) : (
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
            )}
            {/* Phase 4: branches live under the company that owns them */}
            <CompanyBranches />
          </div>
        )}

        {/* TAB 3: JOB REQUIREMENTS — cards + status tabs + compact rows, one Manage menu */}
        {currentTab === 'requirements' && (
          <div className="space-y-4">
            {/* Main cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                ['live', 'Live', 'bg-emerald-500', 'Published — hiring now'],
                ['paused', 'Paused', 'bg-amber-500', 'Pipeline frozen'],
                ['closed', 'Closed', 'bg-slate-400', 'Fully closed'],
                ['draft', 'Drafts', 'bg-[#087BFF]', 'Needs review'],
              ] as const).map(([v, label, dot, sub]) => (
                <button key={v} type="button" onClick={() => setReqTab(reqTab === v ? 'all' : v)}
                  className={`p-4 bg-white rounded-2xl border shadow-sm text-left transition cursor-pointer hover:-translate-y-0.5 hover:shadow ${reqTab === v ? 'border-[#087BFF] ring-2 ring-blue-100' : 'border-slate-200/90'}`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{label}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{v === 'draft' ? reqCounts('draft') : reqCounts(v)}</div>
                  <div className="text-[11px] font-bold text-slate-500">{reqApps(v === 'draft' ? 'draft' : v)} applicants • {sub}</div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Requirement status">
                  {([['all', 'All'], ['live', 'Live'], ['paused', 'Paused'], ['closed', 'Closed'], ['draft', 'Drafts']] as const).map(([v, label]) => (
                    <button key={v} role="tab" aria-selected={reqTab === v} type="button" onClick={() => setReqTab(v)}
                      className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${reqTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label} • {v === 'all' ? jobs.length : reqCounts(v)}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full sm:w-64">
                    <SearchSuggest value={searchQuery} onChange={setSearchQuery} placeholder="Search job title or req ID…"
                      items={jobs.map((j: any) => ({ key: String(j.id), query: String(j.id), title: String(j.title || j.id), meta: [j.location, j.employmentType].filter(Boolean).join(' • '), status: j.status }))}
                      onPick={(it) => setSearchQuery(it.query ?? it.key)} />
                  </div>
                  <button onClick={openNewJob} className="px-4 py-2 bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer whitespace-nowrap">
                    <Plus size={14} /> New Job
                  </button>
                </div>
              </div>

              {isLoading ? (
                <InlineLoading message="Loading requisitions…" />
              ) : jobs.length === 0 ? (
                <EmptyState title="No requirements yet" message="Create your first hiring requirement to start hiring." />
              ) : (
              <div className="space-y-2">
                {jobs
                  .filter((j: any) => reqTab === 'all' || reqBucket(j) === reqTab)
                  .filter((j: any) => String(j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(j.id || '').toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((job: any) => {
                    const apps = allApplications.filter((a: any) => a.jobId === job.id).length;
                    const frozen = job.status === 'Paused';
                    return (
                    <div key={job.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${job.status === 'Published' ? 'bg-emerald-500' : job.status === 'Paused' ? 'bg-amber-500' : job.status === 'Closed' ? 'bg-slate-400' : 'bg-[#087BFF]'}`} title={job.status} />
                      <button type="button" onClick={() => setJobDetail(job)} className="flex-1 min-w-0 text-left cursor-pointer" title="View details">
                        <div className="font-extrabold text-slate-900 text-sm truncate">{job.title || job.id}</div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          <span className="font-mono">{job.id}</span>{job.requisitionId ? ` • Req ${job.requisitionId}` : ''} • {job.location || '—'} • {job.employmentType || '—'}
                          {frozen && <span className="ml-1.5 px-1.5 py-px rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">Frozen — pipeline stopped</span>}
                          {job.status === 'Closed' && <span className="ml-1.5 px-1.5 py-px rounded-md bg-slate-200 text-slate-600 font-bold text-[10px]">Closed — applications ended</span>}
                        </div>
                      </button>
                      <div className="hidden sm:block text-right shrink-0">
                        <div className="text-sm font-extrabold text-slate-900">{apps} <span className="text-[10px] font-bold text-slate-500">apps</span></div>
                        <div className="text-[10px] font-bold text-slate-500">exp {job.expiryDate ? String(job.expiryDate).slice(0, 10) : '—'}</div>
                      </div>
                      <StatusPill value={job.status} />
                      <RowMenu label={`Manage ${job.id}`} items={manageItems(job)} />
                    </div>
                    );
                  })}
              </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: APPLICATIONS (Phase 4: single server-driven board — legacy mock retired) */}
        {currentTab === 'candidates' && (
          <ApplicationsPanel />
        )}

        {/* Job detail drawer (shared standard) + lifecycle action modal (E1) */}
        {jobDetail && (
          <DetailDrawer title={jobDetail.title || jobDetail.id} subtitle={`${jobDetail.id}${jobDetail.requisitionId ? ` • Req ${jobDetail.requisitionId}` : ''} • ${jobDetail.visibility || 'public'}`} onClose={() => { setJobDetail(null); setJobAction(null); }} width="max-w-2xl">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${drawerTone(jobDetail.status).card}`}>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-slate-900 text-sm truncate">{jobDetail.title}</div>
                <div className="text-[11px] text-slate-500 font-medium truncate">{jobDetail.location || '—'} • {jobDetail.employmentType || '—'} • {jobDetail.workArrangement || '—'}</div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <StatusPill value={jobDetail.status} />
                  {(jobDetail.status === 'Closed' || (jobDetail.expiryDate && new Date(jobDetail.expiryDate) <= new Date())) && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px]">Closed</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {jobDetail.requisitionId && (
                <button type="button" onClick={() => { void openJobAssign(); }} disabled={reqAssignBusy}
                  className="px-3.5 py-2 rounded-xl bg-white border border-blue-300 text-blue-800 font-bold text-xs disabled:opacity-60">
                  {reqAssignBusy ? 'Loading…' : 'Assign recruiter…'}
                </button>
              )}
              <RowMenu label="Manage job" items={manageItems(jobDetail, true)} />
              {jobDetail.status === 'Published' && <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">Live — editing locked. Pause to edit, close to end.</span>}
              {jobDetail.status === 'Paused' && <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">Frozen — pipeline stopped. Resume to continue.</span>}
              {jobDetail.status === 'Closed' && <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5">Fully closed — applications ended as Job Closed.</span>}
            </div>
            {jobAction && jobAction.job.id === jobDetail.id && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-slate-900 capitalize">Confirm {jobAction.kind} — {jobAction.job.id}</div>
                  <button type="button" onClick={() => setJobAction(null)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Collapse</button>
                </div>
                {jobActionError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{jobActionError}</div>}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">Reason (audited, required for publish/pause/close/reopen)</label>
                  <textarea rows={2} value={jobActionReason} onChange={(e) => setJobActionReason(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" placeholder="e.g. Approved by hiring manager" />
                </div>
                {(jobAction.kind === 'reopen' || jobAction.kind === 'publish') && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Expiry date {(jobAction.kind === 'reopen') ? '*' : '(required to publish)'}</label>
                    <input type="date" value={jobActionExpiry} onChange={(e) => setJobActionExpiry(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setJobAction(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
                  <button type="button" onClick={runJobAction} className="px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs capitalize">Confirm {jobAction.kind}</button>
                </div>
              </div>
            )}
            {(() => {
              const jobApps = allApplications.filter((a: any) => a.jobId === jobDetail.id);
              // Activity = status history + applications + audit rows the history already covers.
              const jobActivity: ActivityItem[] = (() => {
                const items: ActivityItem[] = [];
                (jobDetail.history || []).forEach((h: any) => items.push({
                  at: h.at, title: `${h.from || '—'} → ${h.to}`,
                  meta: h.reason ? `${h.by || '—'} • ${h.reason}` : (h.by || '—'),
                  tone: h.to === 'Closed' ? 'bad' : h.to === 'Published' ? 'ok' : 'info',
                }));
                jobApps.forEach((a: any) => items.push({ at: a.createdAt, title: 'Application received', meta: `${a.candidateEmail || ''}${a.stage ? ` • now ${a.stage}` : ''}`, tone: 'neutral' }));
                jobLogs.filter((l: any) => !/(_STATUS:|_CREATED:)/.test(String(l.action)))
                  .forEach((l: any) => items.push({ at: l.timestamp, title: auditLabel(String(l.action)), meta: l.actor, tone: 'neutral' }));
                if (jobDetail.createdAt) items.push({ at: jobDetail.createdAt, title: 'Posting created', meta: jobDetail.createdBy || '—', tone: 'info' });
                return sortActivity(items);
              })();
              const tabs = [
                ['overview', 'Overview'],
                ['role', 'Role & pay'],
                ['setup', 'Hiring setup'],
                ['applicants', `Applicants (${jobApps.length})`],
                ['activity', `Activity (${jobActivity.length})`],
              ] as const;
              return (
              <div className="space-y-3">
                <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit max-w-full overflow-x-auto" role="tablist" aria-label="Job details">
                  {tabs.map(([v, label]) => (
                    <button key={v} role="tab" aria-selected={drawerTab === v} type="button" onClick={() => setDrawerTab(v)}
                      className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap ${drawerTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
                  ))}
                </div>
                {drawerTab === 'overview' && (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['Salary', jobDetail.salaryMin ? `${jobDetail.salaryMin}–${jobDetail.salaryMax || jobDetail.salaryMin} ${jobDetail.currency || ''}` : (jobDetail.budgetRange || 'Undisclosed')],
                      ['Experience', jobDetail.experienceMin != null ? `${jobDetail.experienceMin}–${jobDetail.experienceMax ?? '+'} yrs` : '—'],
                      ['Dates', `${String(jobDetail.startDate || '').slice(0, 10) || '—'} → ${String(jobDetail.expiryDate || '').slice(0, 10) || '—'}`],
                      ['Pipeline', `${jobApps.length} applicants`],
                    ].map(([k, v]) => (
                      <div key={k} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{k}</div>
                        <div className="text-xs font-extrabold text-slate-900 mt-0.5 truncate" title={String(v)}>{v}</div>
                      </div>
                    ))}
                    <div className="col-span-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Partners</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(jobDetail.assignedAgencies || []).map((ag: string, i: number) => (
                          <span key={`a${i}`} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">{ag}</span>
                        ))}
                        {(jobDetail.assignedVendors || []).map((vn: string, i: number) => (
                          <span key={`v${i}`} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">{vn}</span>
                        ))}
                        {(!jobDetail.assignedAgencies || jobDetail.assignedAgencies.length === 0) && (!jobDetail.assignedVendors || jobDetail.assignedVendors.length === 0) && <span className="text-slate-400 text-[11px] font-bold">None assigned</span>}
                      </div>
                    </div>
                  </div>
                )}
                {drawerTab === 'role' && (
                  <KeyValues data={[
                    ['Description', jobDetail.description || '—'],
                    ['Responsibilities', jobDetail.responsibilities || '—'],
                    ['Required skills', jobDetail.requiredSkills || '—'],
                    ['Preferred skills', jobDetail.preferredSkills || '—'],
                    ['Qualifications', jobDetail.qualifications || '—'],
                    ['Salary', jobDetail.salaryMin ? `${jobDetail.salaryMin}–${jobDetail.salaryMax || jobDetail.salaryMin} ${jobDetail.currency || ''}${jobDetail.salaryDisclosure ? ` (${jobDetail.salaryDisclosure})` : ''}` : (jobDetail.budgetRange || 'Undisclosed')],
                    ['Experience', jobDetail.experienceMin != null ? `${jobDetail.experienceMin}–${jobDetail.experienceMax ?? '+'} yrs` : (jobDetail.experienceRequired || '—')],
                    ['Dates', `${String(jobDetail.startDate || '').slice(0, 10) || '—'} → ${String(jobDetail.expiryDate || '').slice(0, 10) || '—'}`],
                  ]} />
                )}
                {drawerTab === 'setup' && (
                  <KeyValues data={[
                    ['Application questions', jobDetail.applicationQuestions || '—'],
                    ['Required documents', jobDetail.requiredDocs || '—'],
                    ['Application settings', jobDetail.applicationSettings || '—'],
                    ['Agencies', (jobDetail.assignedAgencies || []).join(', ') || '—'],
                    ['Vendors', (jobDetail.assignedVendors || []).join(', ') || '—'],
                  ]} />
                )}
                {drawerTab === 'applicants' && (
                  <JobApplicantsATS job={jobDetail} apps={jobApps} candidates={candidates} onFullBoard={() => navigate('/employer/candidates')} />
                )}
                {drawerTab === 'activity' && (
                  <div className="space-y-2">
                    {jobDetailLoading && <InlineLoading message="Loading full record…" />}
                    <ActivityTimeline items={jobActivity}
                      empty="No activity yet — publish, pause or receive an application to start the trail." />
                  </div>
                )}
              </div>
              );
            })()}
          </DetailDrawer>
        )}
        {reqAssignFor && (
          <AssignRecruiterModal open={true} targets={[reqAssignFor]} rows={requisitions}
            onClose={() => setReqAssignFor(null)}
            onDone={(updated) => {
              const u = updated[0];
              if (u?.id) setRequisitions((rs: any[]) => rs.map((r: any) => (r.id === u.id ? { ...r, ...u } : r)));
              setJobDetail((j: any) => (j ? { ...j, recruiter: u?.recruiter ?? j.recruiter } : j));
              setReqAssignFor(null);
              syncAll();
            }} />
        )}

        {/* TAB 5: INTERVIEWS & FEEDBACK — shared panel: 4-col cards, 40/page, detail drawer + full schedule/track/score flow */}
        {currentTab === 'interviews' && <InterviewsPanel />}

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
                <div className="text-xs font-bold text-slate-500 uppercase">Open Requirements</div>
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

        {/* RICH MULTI-STEP REQUIREMENT WIZARD MODAL */}
        {showJobModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative space-y-6">
              
              <button
                onClick={() => { setShowJobModal(false); setEditingJob(null); setSaveError(''); }}
                className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{editingJob ? `Edit Job — ${editingJob.id}` : 'Create Job Posting'}</h3>
                  <p className="text-xs text-slate-500 font-medium">Full §8.4 field set. Link an approved requisition where possible.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-xs">
                  Step {wizardStep} of 4
                </span>
              </div>

              {saveError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{saveError}</div>
              )}

              {submitSuccess ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">{editingJob ? 'Job Updated!' : 'Job Posting Created as Draft!'}</h4>
                  <p className="text-xs text-slate-600">Use Publish from the job board when ready — approval rules are enforced server-side.</p>
                </div>
              ) : (
                <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
                  
                  {/* STEP 1: Basics + requisition link */}
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Linked requisition (approved requisitions preferred)</label>
                        <select value={jobForm.requisitionId} onChange={(e) => setJobForm({ ...jobForm, requisitionId: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none">
                          <option value="">No linked requisition</option>
                          {requisitions.map((r: any) => (
                            <option key={r.id} value={r.id}>{r.id} — {r.title} ({r.status})</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Public title *</label>
                          <input
                            type="text"
                            required
                            value={jobForm.title}
                            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Department</label>
                          <input
                            type="text"
                            value={jobForm.department}
                            onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Public description</label>
                        <textarea
                          rows={3}
                          value={jobForm.description}
                          onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Responsibilities</label>
                        <textarea
                          rows={2}
                          value={jobForm.responsibilities}
                          onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Role, skills, location */}
                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Required skills</label>
                        <input
                          type="text"
                          value={jobForm.requiredSkills}
                          onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                          placeholder="e.g. React, Node.js, PostgreSQL"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Preferred skills</label>
                        <input
                          type="text"
                          value={jobForm.preferredSkills}
                          onChange={(e) => setJobForm({ ...jobForm, preferredSkills: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Qualifications & experience</label>
                        <input
                          type="text"
                          value={jobForm.qualifications}
                          onChange={(e) => setJobForm({ ...jobForm, qualifications: e.target.value })}
                          placeholder="e.g. B.Tech + 4 yrs backend"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Min experience (yrs)</label>
                          <input type="number" min={0} max={40} value={jobForm.experienceMin} onChange={(e) => setJobForm({ ...jobForm, experienceMin: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Max experience (yrs)</label>
                          <input type="number" min={0} max={40} value={jobForm.experienceMax} onChange={(e) => setJobForm({ ...jobForm, experienceMax: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Location</label>
                          <input type="text" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Employment type</label>
                          <input type="text" value={jobForm.employmentType} onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value })} placeholder="Full-time / Contract" className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Work arrangement</label>
                          <select value={jobForm.workArrangement} onChange={(e) => setJobForm({ ...jobForm, workArrangement: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none">
                            <option value="">Select…</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">Onsite</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Compensation, disclosure, dates */}
                  {wizardStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Min salary</label>
                          <input type="number" min={0} value={jobForm.salaryMin} onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Max salary</label>
                          <input type="number" min={0} value={jobForm.salaryMax} onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Currency</label>
                          <select value={jobForm.currency} onChange={(e) => setJobForm({ ...jobForm, currency: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none">
                            {['INR', 'USD', 'AED', 'EUR', 'GBP', 'SGD'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Salary disclosure</label>
                          <select value={jobForm.salaryDisclosure} onChange={(e) => setJobForm({ ...jobForm, salaryDisclosure: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none">
                            <option value="">Undisclosed</option>
                            <option value="disclosed">Disclosed range</option>
                            <option value="range_on_request">Range on request</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Start date</label>
                          <input type="date" value={jobForm.startDate} onChange={(e) => setJobForm({ ...jobForm, startDate: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Expiry date</label>
                          <input type="date" value={jobForm.expiryDate} onChange={(e) => setJobForm({ ...jobForm, expiryDate: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Application config, visibility, partners */}
                  {wizardStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Application questions</label>
                        <textarea rows={2} value={jobForm.applicationQuestions} onChange={(e) => setJobForm({ ...jobForm, applicationQuestions: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Required documents</label>
                        <input type="text" value={jobForm.requiredDocs} onChange={(e) => setJobForm({ ...jobForm, requiredDocs: e.target.value })} placeholder="e.g. Resume, ID proof" className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Application settings</label>
                        <input type="text" value={jobForm.applicationSettings} onChange={(e) => setJobForm({ ...jobForm, applicationSettings: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Visibility</label>
                        <select value={jobForm.visibility} onChange={(e) => setJobForm({ ...jobForm, visibility: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none">
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="assigned">Assigned partners only</option>
                        </select>
                      </div>
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Agency names (comma-separated)</label>
                          <input type="text" value={jobForm.agencyNames} onChange={(e) => setJobForm({ ...jobForm, agencyNames: e.target.value })} className="w-full p-3 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Vendor names (comma-separated)</label>
                          <input type="text" value={jobForm.vendorNames} onChange={(e) => setJobForm({ ...jobForm, vendorNames: e.target.value })} className="w-full p-3 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none" />
                        </div>
                      </div>
                      {editingJob?.status === 'Published' && (
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Change note * (editing a published job is audited)</label>
                          <input type="text" value={jobForm.editReason} onChange={(e) => setJobForm({ ...jobForm, editReason: e.target.value })} placeholder="Why is this change needed?" className="w-full bg-amber-50 border border-amber-300 rounded-xl p-3 font-semibold text-slate-900 outline-none" />
                        </div>
                      )}
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

                    {wizardStep < 4 ? (
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
                        <span>{isSubmitting ? 'Saving...' : editingJob ? 'Save Changes' : 'Create Job (Draft)'}</span>
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

/* ---------- E1 helpers: job form + lifecycle + detail ---------- */
function blankJobForm(): any {
  return {
    requisitionId: '', title: '', description: '', responsibilities: '',
    requiredSkills: '', preferredSkills: '', qualifications: '',
    experienceMin: '', experienceMax: '', location: '', employmentType: '',
    workArrangement: '', salaryMin: '', salaryMax: '', currency: 'INR',
    salaryDisclosure: '', visibility: 'public', startDate: '', expiryDate: '',
    applicationQuestions: '', requiredDocs: '', applicationSettings: '',
    agencyNames: '', vendorNames: '', department: '', editReason: '',
  };
}

function lifecycleFor(status: string): { kind: string; label: string }[] {
  switch (status) {
    case 'Draft': return [{ kind: 'review', label: 'Submit for review' }, { kind: 'publish', label: 'Publish' }, { kind: 'archive', label: 'Archive' }];
    case 'Pending Review': return [{ kind: 'approve', label: 'Approve' }, { kind: 'archive', label: 'Archive' }];
    case 'Approved': return [{ kind: 'publish', label: 'Publish' }, { kind: 'archive', label: 'Archive' }];
    case 'Published': return [{ kind: 'pause', label: 'Pause' }, { kind: 'close', label: 'Close' }];
    case 'Paused': return [{ kind: 'resume', label: 'Resume' }, { kind: 'close', label: 'Close' }];
    case 'Closed': return [{ kind: 'reopen', label: 'Reopen' }, { kind: 'archive', label: 'Archive' }];
    default: return [];
  }
}

/* ---------- ATS v1 (client-side, explainable) — required skills 70 · preferred 15 · experience 15.
   Full ATS engine lands later; this powers the per-job Applicants & ATS drawer section today. ---------- */
function tokensOf(v: unknown): string[] {
  const s = Array.isArray(v) ? v.join(',') : String(v || '');
  return [...new Set(s.split(/[,;|\n]+/).map((t) => t.trim().toLowerCase()).filter((t) => t.length >= 2))].slice(0, 24);
}
function numOrNull(v: unknown): number | null {
  const n = typeof v === 'number' ? v : (String(v ?? '').trim() === '' ? NaN : Number(v));
  return Number.isFinite(n) ? n : null;
}
function atsScore(job: any, cand: any): { score: number; matched: string[]; missing: string[]; expNote: string } {
  const req = tokensOf(job?.requiredSkills);
  const pref = tokensOf(job?.preferredSkills);
  const skillBits = Array.isArray(cand?.skills) ? cand.skills : [];
  const corpus = [...skillBits.map((s: unknown) => String(s)), cand?.headline, cand?.roleTitle, cand?.summary].filter(Boolean).join(' ').toLowerCase();
  const mReq = req.filter((t) => corpus.includes(t));
  const mPref = pref.filter((t) => corpus.includes(t));
  const reqScore = req.length ? (mReq.length / req.length) * 70 : 35;
  const prefScore = pref.length ? (mPref.length / pref.length) * 15 : 7;
  const exp = numOrNull(cand?.experienceYears);
  const emin = numOrNull(job?.experienceMin);
  const emax = numOrNull(job?.experienceMax);
  let expScore = 7; let expNote = 'experience unknown';
  if (exp !== null) {
    const lo = emin ?? exp; const hi = emax ?? exp;
    if (exp >= lo && exp <= hi) { expScore = 15; expNote = `${exp} yrs — in range`; }
    else if (exp >= lo - 1 && exp <= hi + 1) { expScore = 9; expNote = `${exp} yrs — close`; }
    else { expScore = 4; expNote = `${exp} yrs — outside range`; }
  }
  const missing = [...req.filter((t) => !corpus.includes(t)), ...pref.filter((t) => !corpus.includes(t))].slice(0, 12);
  return { score: Math.max(0, Math.min(100, Math.round(reqScore + prefScore + expScore))), matched: [...mReq, ...mPref].slice(0, 12), missing, expNote };
}
function scoreTone(s: number): string {
  if (s >= 75) return 'bg-emerald-600 text-white';
  if (s >= 50) return 'bg-amber-500 text-white';
  return 'bg-slate-500 text-white';
}

function JobApplicantsATS({ job, apps, candidates, onFullBoard }: { job: any; apps: any[]; candidates: any[]; onFullBoard: () => void }) {
  const ranked = apps.map((a) => {
    const cand = candidates.find((c: any) => String(c.email || '').toLowerCase() === String(a.candidateEmail || '').toLowerCase());
    return { app: a, cand, ...atsScore(job, cand) };
  }).sort((x, y) => y.score - x.score);
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1 px-0.5">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Applicants & ATS ({apps.length})</div>
        <button type="button" onClick={onFullBoard} className="text-[11px] font-extrabold text-[#087BFF] hover:underline cursor-pointer whitespace-nowrap">Full pipeline →</button>
      </div>
      <div className="text-[10px] text-slate-400 font-medium mb-1.5 px-0.5">v1 scoring — required skills 70 · preferred 15 · experience 15. Full ATS engine coming later.</div>
      <DrawerList items={ranked} empty="No applications for this job yet."
        render={(r: any, i: number) => {
          const name = r.cand?.name || r.app.candidateName || r.app.candidateEmail;
          const sub = [r.cand?.roleTitle || r.cand?.headline, r.cand?.experienceYears != null ? `${r.cand.experienceYears} yrs` : '', r.cand?.location].filter(Boolean).join(' • ');
          return (
            <DrawerCard key={r.app.id} status={r.app.stage} title={name}
              meta={<>{r.app.candidateEmail}{sub ? ` • ${sub}` : ''}</>}
              right={<><span className={`px-2 py-0.5 rounded-full font-extrabold text-[11px] ${scoreTone(r.score)}`}>ATS {r.score}</span><StatusPill value={r.app.stage} /></>}>
              {i === 0 && r.score > 0 && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px]">★ Best match</span>
              )}
              {(r.matched.length > 0 || r.missing.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {r.matched.map((t: string) => <span key={`m${t}`} className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">✓ {t}</span>)}
                  {r.missing.map((t: string) => <span key={`x${t}`} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[10px]">{t}</span>)}
                </div>
              )}
              <div className="text-[10px] text-slate-400 font-medium mt-1">{r.expNote}</div>
            </DrawerCard>
          );
        }} />
    </div>
  );
}

/* ---------- E6: company onboarding states (§8.1) ---------- */
function CompanyBranches() {
  const [rows, setRows] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [msg, setMsg] = useState('');
  const [removeFor, setRemoveFor] = useState<any>(null);
  const load = async () => {
    try {
      const res: any = await directoryApi.branches();
      const list = Array.isArray((res as any)?.data) ? (res as any).data : [];
      setRows(list);
    } catch { /* best-effort */ }
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await directoryApi.createBranch({ name: name.trim(), city: city.trim() || undefined });
      setName(''); setCity(''); setMsg('Branch added.');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Could not add branch.'); }
  };
  const remove = async () => {
    if (!removeFor) return;
    try { await directoryApi.deleteBranch(removeFor.id); setMsg('Branch removed.'); setRemoveFor(null); load(); }
    catch (err: any) { setMsg(err?.response?.data?.message || 'Could not remove branch.'); }
  };
  return (
    <div className="pt-2 mt-2 border-t border-slate-100">
      <h4 className="text-sm font-extrabold text-slate-900">Branches</h4>
      <p className="text-xs text-slate-500">Hiring locations under your company. Requisitions and jobs reference these branches.</p>
      {rows.length === 0 ? (
        <div className="text-xs text-slate-500 font-medium mt-2">No branches yet — add your first hiring location.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {rows.map((b: any) => (
            <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
              <div><div className="font-bold text-slate-900">{b.name}</div><div className="text-slate-500 font-mono">{b.id} • {b.city || '—'} • {b.status || 'Active'}</div></div>
              <button type="button" onClick={() => setRemoveFor(b)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-red-600">Remove</button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={create} className="flex flex-col sm:flex-row gap-2 mt-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Branch name *" className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-xs outline-none" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full sm:w-44 p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-xs outline-none" />
        <button className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs">Add branch</button>
      </form>
      {msg && <div className="text-xs font-bold text-slate-600 mt-2">{msg}</div>}
      <ConfirmDialog
        open={removeFor !== null}
        title={`Remove branch ${removeFor?.name || ''}?`}
        body="Requisitions linked to this branch keep their stored branch name. This cannot be undone."
        confirmLabel="Remove branch"
        onCancel={() => setRemoveFor(null)}
        onConfirm={remove}
      />
    </div>
  );
}
const COMPANY_STATE_ORDER = ['Invited', 'Registration In Progress', 'Verification Pending', 'Approved', 'Active'];
function CompanyStatusBanner({ verification, account }: { verification: string; account: string }) {
  const v = verification || 'Pending';
  const a = account || 'Invited';
  const nextStep =
    a === 'Active' ? 'Your company is live — publish requisitions and jobs.' :
    v === 'Rejected' ? 'Verification was rejected — contact your NexaTalent manager.' :
    v === 'Approved' ? 'Verification approved — complete any missing profile details to activate.' :
    'Complete your profile below — verification review follows automatically.';
  const pill = (label: string, value: string, tone: string) => (
    <span className={`px-3 py-1 rounded-full border font-extrabold text-xs ${tone}`}>
      {label}: {value}
    </span>
  );
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {pill('Verification', v, v === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : v === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200')}
        {pill('Account', a, a === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : a === 'Suspended' || a === 'Closed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200')}
      </div>
      <div className="flex items-center gap-1">
        {COMPANY_STATE_ORDER.map((s, i) => {
          const done = a === 'Active' || (v === 'Approved' && i <= 3) || i < 2;
          const current = !done && ((a === 'Invited' && i === 0) || (v === 'Pending' && i === 2));
          return <div key={s} title={s} className={`h-2 flex-1 rounded-full ${done ? 'bg-emerald-500' : current ? 'bg-[#087BFF]' : 'bg-slate-200'}`} />;
        })}
      </div>
      <div className="text-xs font-bold text-slate-600">{nextStep} <span className="font-medium text-slate-500">(Verification and account status are managed by SuperAdmin.)</span></div>
    </div>
  );
}

/* ---------- E2: dashboard with 14 linked widgets (§8.2, company-scoped) ---------- */
function quotaText(v: any): string {
  if (!v) return '—';
  if (v.limit !== undefined) return `${v.used ?? 0}/${v.limit} (left ${v.remaining ?? '—'})`;
  return v.enabled ? 'Enabled' : '—';
}

function OverviewDashboard({ jobs, requisitions, applications, interviews, usage, subscription, outstanding, isLoading, navigate, onNewJob }: {
  jobs: any[]; requisitions: any[]; applications: any[]; interviews: any[];
  usage: any; subscription: any; outstanding: number; isLoading: boolean;
  navigate: (p: string) => void; onNewJob: () => void;
}) {
  const activeReqs = requisitions.filter((r) => ['Approved', 'Sourcing'].includes(r.status));
  const published = jobs.filter((j) => j.status === 'Published');
  const drafts = jobs.filter((j) => ['Draft', 'Pending Review'].includes(j.status));
  const underReview = applications.filter((a) => ['Screening', 'Under Review', 'New', 'Shortlisted'].includes(a.stage));
  const upcomingIv = interviews.filter((i) => ['Scheduled', 'Rescheduled'].includes(i.status));
  const offersOpen = applications.filter((a) => ['Offer', 'Selected'].includes(a.stage));
  const filled = applications.filter((a) => a.stage === 'Hired');
  const u = (usage?.usage || {}) as Record<string, any>;
  const searchU = u['candidates.search'] || u['search'];
  const contactU = u['candidates.contact_unlock'] || u['contact_unlock'];
  const outreachU = u['outreach.monthly_limit'] || u['outreach.send'] || u['outreach'];
  const renewal = subscription?.renewalDate || subscription?.currentPeriodEnd || subscription?.endDate || null;
  const recentApps = [...applications].sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''))).slice(0, 5);

  const widgets: { label: string; value: string; sub: string; to: string }[] = [
    { label: 'Active Requirements', value: String(activeReqs.length), sub: `${requisitions.length} total`, to: '/employer/requirements' },
    { label: 'Published Jobs', value: String(published.length), sub: 'Live in market', to: '/employer/requirements' },
    { label: 'Draft Jobs', value: String(drafts.length), sub: 'Needs review', to: '/employer/requirements' },
    { label: 'Applications Received', value: String(applications.length), sub: 'All stages', to: '/employer/pipeline' },
    { label: 'Candidates Under Review', value: String(underReview.length), sub: 'Screening + shortlist', to: '/employer/pipeline' },
    { label: 'Interviews Scheduled', value: String(upcomingIv.length), sub: `${interviews.length} total`, to: '/employer/interviews' },
    { label: 'Offers In Progress', value: String(offersOpen.length), sub: 'Offer / Selected', to: '/employer/offers' },
    { label: 'Positions Filled', value: String(filled.length), sub: 'Hired', to: '/employer/offers' },
    { label: 'Search Usage', value: quotaText(searchU), sub: usage?.plan ? `Plan: ${usage.plan}` : 'Talent search', to: '/employer/talent' },
    { label: 'Contact Unlock Usage', value: quotaText(contactU), sub: 'Profile unlocks', to: '/employer/talent' },
    { label: 'Outreach Usage', value: quotaText(outreachU), sub: 'Monthly quota', to: '/employer/outreach' },
    { label: 'Renewal Date', value: renewal ? String(renewal).slice(0, 10) : (usage?.subscription || '—'), sub: subscription ? `Plan status: ${subscription.status || ''}` : 'Subscription', to: '/employer/billing' },
    { label: 'Outstanding Invoices', value: `₹${Number(outstanding || 0).toLocaleString('en-IN')}`, sub: outstanding > 0 ? 'Due now' : 'All clear', to: '/employer/billing' },
    { label: 'Recent Activity', value: recentApps.length > 0 ? recentApps[0].stage : '—', sub: recentApps.length > 0 ? `${recentApps[0].jobTitle || ''}` : 'No activity yet', to: '/employer/pipeline' },
  ];

  if (isLoading) return <InlineLoading message="Loading hiring overview…" />;
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button type="button" onClick={onNewJob} className="px-5 py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer">+ Post New Requirement</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w) => (
          <button key={w.label} type="button" onClick={() => navigate(w.to)} className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1 text-left hover:border-blue-300 hover:shadow transition-all cursor-pointer">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{w.label}</div>
            <div className="text-2xl font-extrabold text-slate-900 truncate">{w.value}</div>
            <div className="text-[11px] font-bold text-[#087BFF] truncate">{w.sub} →</div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Recent pipeline activity</h3>
          <button type="button" onClick={() => navigate('/employer/pipeline')} className="text-[11px] font-bold text-blue-600 underline">Open pipeline</button>
        </div>
        {recentApps.length === 0 ? (
          <div className="text-xs text-slate-500 font-medium">Applications, stage moves and interviews will appear here.</div>
        ) : recentApps.map((a) => (
          <div key={a.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
            <span><strong>{a.jobTitle}</strong> • {a.candidateEmail} → <strong className="text-blue-600">{a.stage}</strong></span>
            <span className="text-slate-500 shrink-0">{String(a.updatedAt || a.createdAt || '').slice(0, 10)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
