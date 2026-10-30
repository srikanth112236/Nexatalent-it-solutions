import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { CheckCircle2, Save, ArrowLeft } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { applicationsApi, talentApi, jobsApi, interviewsApi, platformApi, offersPlacementsApi } from '../../shared/enterprise/phaseApi';
import { syncAll } from '../common/EnterprisePanels';
import { CandidateMessagesView } from './CandidateMessagesView';
import { CandidateDocumentsView } from './CandidateDocumentsView';
import { CandidatePrivacyView } from './CandidatePrivacyView';
import { CandidateSecurityView } from './CandidateSecurityView';
import { CandidateNotificationsView } from './CandidateNotificationsView';
import { CandidateSettingsView } from './CandidateSettingsView';
import { Select } from '../../shared/ui/EnterpriseKit';
import { getUserEmail } from '../../shared/auth/session';
import { onboardingCompleted } from '../../shared/onboarding';
import { EmptyState, ErrorState, InlineLoading } from '../../shared/ui/DataState';
import { safeMeetLink } from '../../shared/utils';
import { useFormValidation, required, email, phone } from '../../shared/validation';
import { OnboardingWizard } from './OnboardingWizard';
import { CandidateDashboard } from './CandidateDashboard';
import { CandidateProfilePreview } from './CandidateProfilePreview';
import { ModernDatePicker } from '../../shared/ui/ModernDatePicker';
import { CandidateApplicationsView } from './CandidateApplicationsView';
import { CandidateAppDetailView } from './CandidateAppDetailView';
import { CandidateInterviewsView } from './CandidateInterviewsView';
import { CandidateSavedJobsView } from './CandidateSavedJobsView';
import { CandidateOffersView } from './CandidateOffersView';
import { JobDetailPage } from './JobDetailPage';
import { CandidateJobsView } from './CandidateJobsView';
import { CandidateTimesheetsView } from './CandidateTimesheetsView';

const navItems = [
  { label: 'Career Dashboard', path: '/candidate' },
  { label: 'Onboarding', path: '/candidate/onboarding', group: 'Career' },
  { label: 'My Profile & CV', path: '/candidate/profile', group: 'Career' },
  { label: 'Curated Jobs', path: '/candidate/jobs', group: 'Career' },
  { label: 'Active Applications', path: '/candidate/applications', group: 'Career' },
  { label: 'Upcoming Interviews', path: '/candidate/interviews', group: 'Career' },
  { label: 'Saved Jobs', path: '/candidate/saved', group: 'Career' },
  { label: 'Offers & Joining', path: '/candidate/offers', group: 'Career' },
  { label: 'My Timesheets', path: '/candidate/timesheets', group: 'Career' },
  { label: 'Messages', path: '/candidate/messages', group: 'Workspace' },
  { label: 'Documents', path: '/candidate/docs', group: 'Workspace' },
  { label: 'Privacy', path: '/candidate/privacy', group: 'Workspace' },
  { label: 'Security', path: '/candidate/security', group: 'Workspace' },
  { label: 'Notifications', path: '/candidate/notifications', group: 'Workspace' },
  { label: 'Settings', path: '/candidate/settings', group: 'Workspace' },
];

/** Candidate-visible stage names (§7.6). Raw backend stages pass through unchanged. */

type Tab =
  | 'dashboard' | 'onboarding' | 'profile' | 'jobs' | 'jobDetail' | 'applications'
  | 'appDetail' | 'appChat' | 'interviews' | 'saved' | 'offers' | 'timesheets' | 'messages'
  | 'docs' | 'privacy' | 'security' | 'notifications' | 'settings';

function parseRoute(pathname: string): { tab: Tab; param: string } {
  const p = pathname.replace(/\/$/, '');
  const seg = p.split('/').filter(Boolean).slice(1); // after 'candidate'
  if (seg.length === 0 || seg[0] === 'dashboard') return { tab: 'dashboard', param: '' };
  if (seg[0] === 'onboarding') return { tab: 'onboarding', param: '' };
  if (seg[0] === 'profile') return { tab: 'profile', param: '' };
  if (seg[0] === 'jobs') return seg[1] ? { tab: 'jobDetail', param: seg[1] } : { tab: 'jobs', param: '' };
  if (seg[0] === 'applications') {
    if (seg[2] === 'chat') return { tab: 'appChat', param: seg[1] };
    if (seg[1]) return { tab: 'appDetail', param: seg[1] };
    return { tab: 'applications', param: '' };
  }
  if (seg[0] === 'interviews') return { tab: 'interviews', param: '' };
  if (seg[0] === 'saved' || seg[0] === 'saved-jobs') return { tab: 'saved', param: '' };
  if (seg[0] === 'offers') return { tab: 'offers', param: '' };
  if (seg[0] === 'timesheets') return { tab: 'timesheets', param: '' };
  if (seg[0] === 'messages' || seg[0] === 'chat') return { tab: 'messages', param: '' };
  if (seg[0] === 'docs' || seg[0] === 'documents') return { tab: 'docs', param: '' };
  if (seg[0] === 'privacy') return { tab: 'privacy', param: '' };
  if (seg[0] === 'settings') return { tab: 'settings', param: '' };
  if (seg[0] === 'security') return { tab: 'security', param: '' };
  if (seg[0] === 'notifications') return { tab: 'notifications', param: '' };
  return { tab: 'dashboard', param: '' };
}

const TAB_TITLES: Record<Tab, string> = {
  dashboard: 'Career Dashboard', onboarding: 'Onboarding', profile: 'My Profile & CV',
  jobs: 'Curated Jobs', jobDetail: 'Job Detail', applications: 'Active Applications',
  appDetail: 'Application Detail', appChat: 'Application Chat', interviews: 'Upcoming Interviews',
  saved: 'Saved Jobs', offers: 'Offers & Joining', timesheets: 'My Timesheets', messages: 'Messages', docs: 'Documents',
  privacy: 'Privacy', security: 'Security', notifications: 'Notifications', settings: 'Settings',
};

/* ---------- helpers ---------- */
function asArray(v: unknown): any[] { return Array.isArray(v) ? v : []; }
function fmtDate(v: unknown): string {
  if (!v) return '—';
  const s = String(v);
  return s.length >= 10 ? s.slice(0, 10) : s;
}
function fmtDateTime(v: unknown): string {
  if (!v) return '—';
  return String(v).slice(0, 16).replace('T', ' ');
}
function readRecent(): { id: string; title: string; at: string }[] {
  try { return JSON.parse(localStorage.getItem('nexa_recent_jobs') || '[]'); } catch { return []; }
}
function pushRecent(id: string, title: string) {
  try {
    const rows = readRecent().filter((r) => r.id !== id);
    rows.unshift({ id, title, at: new Date().toISOString() });
    localStorage.setItem('nexa_recent_jobs', JSON.stringify(rows.slice(0, 20)));
  } catch { /* private mode */ }
}
function skillOverlap(job: any, mySkills: string[]): number {
  const jobSkills = `${job.requiredSkills || ''},${job.preferredSkills || ''}`.split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 6);
  if (mySkills.length === 0 || jobSkills.length === 0) return -1;
  const overlap = jobSkills.filter((s: string) => mySkills.some((m: string) => m.includes(s.toLowerCase()) || s.toLowerCase().includes(m))).length;
  return Math.round((overlap / jobSkills.length) * 100);
}
function isClosed(job: any): boolean {
  if (!job) return false;
  if (job.status === 'Closed') return true;
  return !!(job.expiryDate && new Date(job.expiryDate) <= new Date());
}

const inputCls = 'w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none text-xs';
const labelCls = 'block font-bold text-slate-700 mb-1';
const cardCls = 'bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3';



const blankExp = { employer: '', designation: '', employmentType: 'Full-time', startDate: '', endDate: '', current: false, responsibilities: '', achievements: '' };
const blankEdu = { institution: '', qualification: '', specialization: '', startDate: '', endDate: '' };
const blankSkill = { skill: '', level: 'Intermediate', years: '' };
const blankCert = { name: '', issuer: '', issueDate: '', expiryDate: '' };
const blankProj = { name: '', description: '', role: '', stack: '', startDate: '', endDate: '' };

export function CandidatePortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tab: currentTab, param: routeParam } = parseRoute(location.pathname);

  const userEmail = getUserEmail() || '';
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [recentTick, setRecentTick] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [hasProfile, setHasProfile] = useState(false);
  const [updates, setUpdates] = useState<any[]>([]);
  const [notifPreview, setNotifPreview] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  /* ---------- profile state (spec §7.3, structured) ---------- */
  const [profile, setProfile] = useState<any>({
    name: '', email: userEmail, phone: '', headline: '', roleTitle: '', experienceYears: '' as unknown as number,
    location: '', country: '', contactPrefs: '', currentCtc: '', expectedCtc: '', currency: 'INR',
    payPeriod: 'annual', noticePeriod: '', skills: '', skillLevels: [], summary: '', objectives: '',
    education: '', educations: [], experience: [], experiences: [], certifications: '', certList: [],
    projects: '', projectList: [], availability: '', employmentTypes: '', workArrangement: '',
    portfolio: '', linkedin: '', github: '', codeSamples: '', resumeRef: '', resumeVersion: 1, resumeUploadedAt: '',
    visibility: 'standard', preferences: null, jobPreferences: { roles: '', locations: '', employmentTypes: '', workArrangement: '', availability: '' },
    onboarding: null,
  });

  /* ---------- real-time field validation for profile inputs ---------- */
  const profileForm = useFormValidation(
    { name: '', email: '', phone: '', expectedCtc: '' },
    {
      name: [required('Full name')],
      email: [required('Email address'), email()],
      phone: [phone()],
      expectedCtc: [required('Expected compensation')],
    },
    { validateOnChange: true, validateOnBlur: true }
  );

  /* Onboarding is a FIRST-TIME flow. Once completed, the details live in the
     Profile tab and can be edited there forever — the prompt/nav must not reappear. */
  const onboardingDone = onboardingCompleted(profile);
  const visibleNavItems = useMemo(
    () => (onboardingDone ? navItems.filter((n) => n.path !== '/candidate/onboarding') : navItems),
    [onboardingDone],
  );

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setLoadError('');
      let failed = 0;
      try {
        const [jRes, iRes, pRes, aRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/jobs').catch(() => { failed += 1; return ({ data: [] as any[] }); }),
          apiClient.get<any[]>('/api/v1/interviews?page=1&pageSize=100').catch(() => { failed += 1; return ({ data: [] as any[] }); }),
          userEmail
            ? apiClient.get<any>(`/api/v1/candidate/profile?email=${encodeURIComponent(userEmail)}`).catch(() => { failed += 1; return null; })
            : Promise.resolve(null),
          userEmail
            ? apiClient.get<any[]>(`/api/v1/candidate/applications?email=${encodeURIComponent(userEmail)}`).catch(() => { failed += 1; return ({ data: [] as any[] }); })
            : Promise.resolve({ data: [] as any[] }),
        ]);
        // P3: all-primary failed = outage, not empty dashboard.
        if (failed >= 4) setLoadError('Could not reach the career service. Check your connection and retry — your data is safe.');
        if (jRes?.data) setJobs(jRes.data);
        if (iRes?.data) setInterviews(iRes.data);
        const saved = (pRes as { data?: any })?.data;
        if (saved?.email) {
          setProfile((prev: any) => ({
            ...prev, ...saved,
            experiences: asArray(saved.experiences ?? saved.experience),
            educations: asArray(saved.educations).length > 0 ? saved.educations : [],
            skillLevels: asArray(saved.skillLevels),
            certList: asArray(saved.certList),
            projectList: asArray(saved.projectList),
            jobPreferences: saved.jobPreferences || saved.preferences || prev.jobPreferences,
          }));
          setHasProfile(true);
        }
        const apps = (aRes?.data as any[]) || [];
        setMyApplications(apps);
        // Application updates: latest history entries across the 5 most recent applications.
        try {
          const top = apps.slice(0, 5);
          const hs = await Promise.all(top.map((a) => applicationsApi.history(a.id).catch(() => ({ data: [] }))));
          const all: any[] = [];
          hs.forEach((h, i) => ((h as { data?: any })?.data as any[] || []).forEach((e) => all.push({ ...e, jobTitle: top[i].jobTitle, appId: top[i].id })));
          all.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
          setUpdates(all.slice(0, 8));
        } catch { /* updates best-effort */ }
        try {
          const nres = await platformApi.notifications();
          setNotifPreview((((nres as { data?: any[] })?.data) || []).slice(0, 5));
        } catch { /* best-effort */ }
      } catch {
        // P3: unexpected throw = outage banner, not silent zeros (no PII in UI).
        setLoadError('Could not reach the career service. Check your connection and retry — your data is safe.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userEmail, reloadKey]);

  const appliedJobIds = myApplications.map((a) => a.jobId);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedRows, setSavedRows] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [offersMine, setOffersMine] = useState<any[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await talentApi.saved();
        const rows = ((res as { data?: any[] })?.data || []) as any[];
        setSavedRows(rows);
        setSavedIds(rows.map((s) => s.jobId));
      } catch { /* best-effort */ }
      try {
        const nres = await platformApi.notifications();
        const nrows = ((nres as { data?: any[] })?.data || []) as any[];
        setUnreadCount(nrows.filter((n) => n.status !== 'read').length);
      } catch { /* best-effort */ }
    })();
  }, []);

  const toggleSave = async (jobId: string) => {
    setSaveError('');
    setSavedSuccess(false);
    try {
      if (savedIds.includes(jobId)) {
        await talentApi.unsave(jobId);
        setSavedIds((x) => x.filter((id) => id !== jobId));
        setSavedRows((x) => x.filter((s) => s.jobId !== jobId));
      } else {
        await talentApi.save(jobId);
        setSavedIds((x) => [jobId, ...x]);
        try {
          const res = await talentApi.saved();
          setSavedRows(((res as { data?: any[] })?.data || []) as any[]);
        } catch { /* best-effort refresh for server enrichment */ }
      }
      setSavedSuccess(true);
      syncAll();
    } catch {
      // P3: surface instead of silent warn — heart state stays truthful.
      setSaveError('Could not save this job. Retry — nothing was changed.');
    }
  };

  const [jobsLoading] = useState(false);

  /* ---------- job detail route (§7.4) ---------- */
  const [detailJob, setDetailJob] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  useEffect(() => {
    if (currentTab !== 'jobDetail' || !routeParam) { setDetailJob(null); return; }
    (async () => {
      setDetailLoading(true);
      try {
        const res = await jobsApi.detail(routeParam);
        const job = (res as { data?: any })?.data || null;
        setDetailJob(job);
        if (job) { pushRecent(job.id, job.title); setRecentTick((t) => t + 1); }
      } catch {
        setDetailJob(null);
      } finally {
        setDetailLoading(false);
      }
    })();
  }, [currentTab, routeParam]);

  /* ---------- application detail route (§7.6) ---------- */
  const [appDetail, setAppDetail] = useState<any>(null);
  const [appDetailLoading, setAppDetailLoading] = useState(false);
  useEffect(() => {
    if ((currentTab !== 'appDetail' && currentTab !== 'appChat') || !routeParam) { setAppDetail(null); return; }
    (async () => {
      setAppDetailLoading(true);
      try {
        const res = await applicationsApi.detail(routeParam);
        setAppDetail((res as { data?: any })?.data || null);
      } catch {
        setAppDetail(null);
      } finally {
        setAppDetailLoading(false);
      }
    })();
  }, [currentTab, routeParam]);

  const handleSaveProfile = async (e?: React.FormEvent, silent = false, override?: any) => {
    if (e) e.preventDefault();
    setSaveError('');
    const src: any = override || profile;
    try {
      // Keep legacy string columns in sync with structured arrays for admin/directory views.
      const body = {
        ...src,
        email: src.email || userEmail,
        education: asArray(src.educations).length > 0
          ? asArray(src.educations).map((r: any) => `${r.institution} — ${r.qualification}${r.endDate ? `, ${r.endDate}` : ''}`).join('; ')
          : src.education,
        certifications: asArray(src.certList).length > 0
          ? asArray(src.certList).map((r: any) => `${r.name} — ${r.issuer}${r.expiryDate ? ` (exp ${r.expiryDate})` : ''}`).join('; ')
          : src.certifications,
        projects: asArray(src.projectList).length > 0
          ? asArray(src.projectList).map((r: any) => r.name).join(', ')
          : src.projects,
        skills: asArray(src.skillLevels).length > 0
          ? asArray(src.skillLevels).map((r: any) => r.skill).join(', ')
          : src.skills,
        experience: src.experiences,
      };
      const res = await apiClient.put<any>('/api/v1/candidate/profile', body);
      if ((res as { data?: any })?.data) {
        setProfile((prev: any) => ({ ...prev, ...(res as { data: any }).data }));
      }
      setHasProfile(true);
      if (!silent) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
      return true;
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Could not save profile. Try again.');
      return false;
    }
  };

  const handleApplyJob = async (jobId: string) => {
    const email = profile.email || userEmail;
    if (!email || appliedJobIds.includes(jobId)) return;
    try {
      const res = await applicationsApi.apply(jobId, email);
      const created = (res as { data?: any })?.data;
      if (created) {
        setMyApplications((prev) => [created, ...prev]);
      } else {
        const list = await apiClient.get<any[]>(`/api/v1/candidate/applications?email=${encodeURIComponent(email)}`);
        if (list?.data) setMyApplications(list.data);
      }
    } catch (err) {
      console.warn('Apply job API notice:', err);
    }
  };

  const myInterviews = interviews.filter((item) => {
    if (item.candidateEmail && userEmail) {
      return String(item.candidateEmail).toLowerCase() === userEmail.toLowerCase();
    }
    if (item.candidateName && profile.name) {
      return item.candidateName === profile.name;
    }
    return false;
  });

  const mySkills = String(
    asArray(profile.skillLevels).length > 0
      ? asArray(profile.skillLevels).map((r: any) => r.skill).join(',')
      : profile.skills || '',
  ).toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
  const recommended = useMemo(
    () => jobs.map((j) => ({ job: j, match: skillOverlap(j, mySkills) })).filter((r) => r.match >= 0)
      .sort((a, b) => b.match - a.match).slice(0, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs, profile.skillLevels, profile.skills],
  );
  void recentTick;
  const recentJobs = useMemo(() => {
    const rows = readRecent();
    const byId = new Map(jobs.map((j) => [j.id, j]));
    return rows.map((r) => ({ ...r, job: byId.get(r.id) || null })).slice(0, 5);
  }, [jobs, recentTick, currentTab]);

  const profileChecks = [
    profile.name, profile.email, profile.phone, profile.headline, profile.roleTitle,
    profile.experienceYears, profile.location, profile.country, profile.expectedCtc,
    profile.noticePeriod, mySkills.length > 0 ? 'x' : '', profile.summary,
    asArray(profile.experiences).length > 0 ? 'x' : '',
    (asArray(profile.educations).length > 0 || String(profile.education || '').trim() !== '') ? 'x' : '',
    profile.availability || profile.jobPreferences?.availability, profile.resumeRef,
  ];
  const matchScore = Math.round((profileChecks.filter((f) => String(f ?? '').trim() !== '').length / profileChecks.length) * 100);

  // Prefer server enrichment (survives paging/expiry); fall back to client jobs list.
  const savedById = new Map(savedRows.map((s) => [s.jobId, s]));
  const savedJobsEnriched = savedIds.map((id) => {
    const server = savedById.get(id) as any;
    const job = server?.job || jobs.find((j) => j.id === id) || null;
    const closed = server?.closed ?? (job ? isClosed(job) : false);
    const applied = server?.applied ?? appliedJobIds.includes(id);
    const savedAt = server?.savedAt || server?.createdAt || '2026-10-24T12:00:00.000Z';
    return { jobId: id, job, closed, applied, jobMissing: server?.jobMissing ?? !job, savedAt };
  });

  /* ---------- offers inbox (§7 offers: letter, CTC, join date, accept/decline) ---------- */
  useEffect(() => {
    if (currentTab !== 'offers') return;
    (async () => {
      setOffersLoading(true);
      try {
        const res = await offersPlacementsApi.mine();
        setOffersMine(((res as { data?: any[] })?.data || []) as any[]);
      } catch { /* fallback to derived list below */ }
      finally { setOffersLoading(false); }
    })();
  }, [currentTab]);

  const respondOffer = async (offerId: string, decision: 'accepted' | 'declined', reason?: string) => {
    try {
      const res = await offersPlacementsApi.respond(offerId, decision, reason);
      const updated = (res as { data?: any })?.data;
      if (updated) {
        setOffersMine((prev) => prev.map((o) => (o.id === offerId ? { ...o, ...updated } : o)));
        if (updated.applicationId) {
          setMyApplications((prev) => prev.map((a) => (a.id === updated.applicationId && decision === 'accepted' ? { ...a, stage: 'Selected' } : a)));
        }
      }
      syncAll();
    } catch (err) {
      console.warn('Offer respond notice:', err);
    }
  };

  const validateProfile = (): string[] => {
    const errs: string[] = [];
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(profile.email))) errs.push('Primary email looks invalid.');
    if (profile.phone && !/^[+\d][\d\s-]{6,20}$/.test(String(profile.phone))) errs.push('Phone number looks invalid.');
    const seen = new Set<string>();
    asArray(profile.experiences).forEach((r: any, i: number) => {
      const k = `${r.employer}|${r.designation}|${r.startDate}`.toLowerCase();
      if (r.employer && seen.has(k)) errs.push(`Experience #${i + 1} looks like a duplicate entry.`);
      seen.add(k);
      if (r.startDate && r.endDate && !r.current && r.endDate < r.startDate) errs.push(`Experience #${i + 1}: end date is before start date.`);
    });
    asArray(profile.certList).forEach((r: any, i: number) => {
      if (r.issueDate && r.expiryDate && r.expiryDate < r.issueDate) errs.push(`Certification #${i + 1}: expiry is before issue date.`);
    });
    return errs;
  };
  const [profileErrors, setProfileErrors] = useState<string[]>([]);



  return (
    <PortalShell portalTitle="Candidate Career Hub" portalRole="candidate" navItems={visibleNavItems}>
      <div className="max-w-6xl mx-auto space-y-4">

        <div className="px-1">
          <h2 className="text-base font-extrabold text-slate-900">{TAB_TITLES[currentTab]}</h2>
        </div>

        {/* ============ DASHBOARD (§7.2 — Modern Career Command Center) ============ */}
        {currentTab === 'dashboard' && (
          isLoading ? (
            <InlineLoading message="Loading your career command center…" />
          ) : loadError ? (
            <ErrorState message={loadError} onRetry={() => setReloadKey((k) => k + 1)} />
          ) : (
            <CandidateDashboard
              profile={profile}
              matchScore={matchScore}
              onboardingDone={onboardingDone}
              myApplications={myApplications}
              interviews={myInterviews}
              recommended={recommended}
              recentJobs={recentJobs}
              savedIds={savedIds}
              updates={updates}
              unreadCount={unreadCount}
              notifPreview={notifPreview}
              toggleSave={toggleSave}
              navigate={navigate}
              fmtDate={fmtDate}
              fmtDateTime={fmtDateTime}
              safeMeetLink={safeMeetLink}
            />
          )
        )}

        {/* ============ ONBOARDING (§7.1 — 9 sections, save progress) ============ */}
        {currentTab === 'onboarding' && (
          onboardingDone ? (
            <div className={cardCls + ' sm:p-8 text-center space-y-3'}>
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"><CheckCircle2 size={30} /></div>
              <h3 className="text-lg font-extrabold text-slate-900">Onboarding complete</h3>
              <p className="text-xs text-slate-500">Your details are saved in your profile and can be edited any time from “My Profile &amp; CV”.</p>
              <button type="button" onClick={() => navigate('/candidate/profile')} className="px-5 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs">Open profile</button>
            </div>
          ) : (
            <OnboardingWizard profile={profile} setProfile={setProfile} hasProfile={hasProfile} onSaveSection={async (step: number) => {
              setSaveError('');
              try {
                const completing = step >= 9;
                const payload = {
                  ...profile,
                  country: profile.country || 'India',
                  contactPrefs: profile.contactPrefs || 'WhatsApp & Email',
                  email: profile.email || userEmail,
                  onboarding: { step, completed: completing, ...(completing ? { completedAt: new Date().toISOString() } : {}), updatedAt: new Date().toISOString() },
                };
                const res = await apiClient.put<any>('/api/v1/candidate/profile', payload);
                const saved = (res as { data?: any })?.data;
                if (saved?.onboarding) setProfile((prev: any) => ({ ...prev, onboarding: saved.onboarding }));
              } catch (e: any) {
                console.warn('Auto-save profile step best-effort:', e);
              }
            }} onFinish={async () => {
              const now = new Date().toISOString();
              // Persist every wizard field AND the completed flag in one save —
              // the wizard only saves the `onboarding` object per step.
              const completing = {
                ...profile,
                onboarding: { step: 9, completed: true, completedAt: now, updatedAt: now },
              };
              await handleSaveProfile(undefined, false, completing);
              navigate('/candidate/profile');
            }} saveError={saveError} />
          )
        )}

        {/* ============ PROFILE (§7.3 — Preview by default, Edit on demand) ============ */}
        {currentTab === 'profile' && (
          !isEditingProfile ? (
            <div className="space-y-4">
              {savedSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} /> Profile saved successfully.
                </div>
              )}
              <CandidateProfilePreview
                profile={profile}
                matchScore={matchScore}
                onEdit={() => setIsEditingProfile(true)}
                navigate={navigate}
                fmtDate={fmtDate}
              />
            </div>
          ) : (
            <div className={cardCls + ' sm:p-8 space-y-4'}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Back to Preview"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Edit Candidate Profile</h3>
                    <p className="text-xs text-slate-500">Update your background, technical skills, and career preferences</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async (e) => {
                      const errs = validateProfile();
                      setProfileErrors(errs);
                      if (errs.length > 0) return;
                      const ok = await handleSaveProfile(e as any);
                      if (ok) setIsEditingProfile(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {saveError && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{saveError}</div>}
              {profileErrors.length > 0 && <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold space-y-1">{profileErrors.map((e, i) => <div key={i}>• {e}</div>)}</div>}

              <form onSubmit={async (e) => {
                const errs = validateProfile();
                setProfileErrors(errs);
                if (errs.length > 0) { e.preventDefault(); return; }
                const ok = await handleSaveProfile(e);
                if (ok) setIsEditingProfile(false);
              }} className="space-y-4 text-xs">
              {/* Personal */}
              <Section title="Personal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field2 label="Full Name *"><input required value={profile.name} onChange={(e) => { setProfile({ ...profile, name: e.target.value }); profileForm.setField('name', e.target.value); }} onBlur={() => profileForm.setTouchedField('name')} className={inputCls} /></Field2>
                  {profileForm.errorFor('name') && <p className="text-xs text-red-600 font-bold mt-1 ml-2">{profileForm.errorFor('name')}</p>}
                  <Field2 label="Primary Email *"><input required type="email" value={profile.email} onChange={(e) => { setProfile({ ...profile, email: e.target.value }); profileForm.setField('email', e.target.value); }} onBlur={() => profileForm.setTouchedField('email')} className={inputCls} /></Field2>
                  {profileForm.errorFor('email') && <p className="text-xs text-red-600 font-bold mt-1 ml-2">{profileForm.errorFor('email')}</p>}
                  <Field2 label="Phone"><input value={profile.phone} onChange={(e) => { setProfile({ ...profile, phone: e.target.value }); profileForm.setField('phone', e.target.value); }} onBlur={() => profileForm.setTouchedField('phone')} className={inputCls} placeholder="+91 ..." /></Field2>
                  {profileForm.errorFor('phone') && <p className="text-xs text-red-600 font-bold mt-1 ml-2">{profileForm.errorFor('phone')}</p>}
                  <Field2 label="Professional Headline"><input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} className={inputCls} placeholder="e.g. Senior Fullstack Engineer" /></Field2>
                  <Field2 label="Location"><input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className={inputCls} placeholder="City, State" /></Field2>
                  <Field2 label="Country"><input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className={inputCls} /></Field2>
                </div>
                <Field2 label="Contact preferences"><input value={profile.contactPrefs} onChange={(e) => setProfile({ ...profile, contactPrefs: e.target.value })} className={inputCls} placeholder="e.g. Email after 6pm; no calls on weekends" /></Field2>
              </Section>

              {/* Summary */}
              <Section title="Summary & Objectives">
                <Field2 label="Professional summary"><textarea rows={3} value={profile.summary} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} className={inputCls} /></Field2>
                <Field2 label="Career objectives"><textarea rows={2} value={profile.objectives} onChange={(e) => setProfile({ ...profile, objectives: e.target.value })} className={inputCls} /></Field2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field2 label="Current Role Title"><input value={profile.roleTitle} onChange={(e) => setProfile({ ...profile, roleTitle: e.target.value })} className={inputCls} /></Field2>
                  <Field2 label="Experience (years)"><input type="number" min={0} max={60} value={profile.experienceYears} onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value as unknown as number })} className={inputCls} /></Field2>
                </div>
              </Section>

              {/* Experience */}
              <Section title="Experience" action={<AddBtn onClick={() => setProfile({ ...profile, experiences: [...asArray(profile.experiences), { ...blankExp }] })} label="+ Add role" />}>
                {asArray(profile.experiences).length === 0 && <div className="text-slate-500 font-medium">No roles yet — add your employment history.</div>}
                {asArray(profile.experiences).map((r: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field2 label="Employer *"><input value={r.employer} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { employer: e.target.value })} className={inputCls} /></Field2>
                      <Field2 label="Designation *"><input value={r.designation} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { designation: e.target.value })} className={inputCls} /></Field2>
                      <Field2 label="Employment type"><Select value={r.employmentType} onChange={(v) => updArr(profile, setProfile, 'experiences', i, { employmentType: v })} options={['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map((v) => ({ value: v, label: v }))} /></Field2>
                      <div className="flex items-end gap-2">
                        <Field2 label="Start">
                          <ModernDatePicker
                            value={r.startDate || ''}
                            onChange={(v) => updArr(profile, setProfile, 'experiences', i, { startDate: v })}
                            mode="month-year"
                            placeholder="Start date"
                          />
                        </Field2>
                        <Field2 label="End">
                          <ModernDatePicker
                            value={r.current ? 'Present' : r.endDate || ''}
                            disabled={r.current}
                            onChange={(v) => updArr(profile, setProfile, 'experiences', i, { endDate: v, current: v.toLowerCase() === 'present' })}
                            mode="month-year"
                            allowPresent
                            placeholder="End date"
                          />
                        </Field2>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 font-bold text-slate-700"><input type="checkbox" checked={!!r.current} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { current: e.target.checked })} /> Currently in this role</label>
                    <Field2 label="Responsibilities"><textarea rows={2} value={r.responsibilities} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { responsibilities: e.target.value })} className={inputCls} /></Field2>
                    <Field2 label="Achievements"><textarea rows={2} value={r.achievements} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { achievements: e.target.value })} className={inputCls} /></Field2>
                    <div className="flex justify-end"><button type="button" onClick={() => delArr(profile, setProfile, 'experiences', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button></div>
                  </div>
                ))}
              </Section>

              {/* Education */}
              <Section title="Education" action={<AddBtn onClick={() => setProfile({ ...profile, educations: [...asArray(profile.educations), { ...blankEdu }] })} label="+ Add education" />}>
                {asArray(profile.educations).length === 0 && <div className="text-slate-500 font-medium">No education entries yet.</div>}
                {asArray(profile.educations).map((r: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field2 label="Institution *"><input value={r.institution} onChange={(e) => updArr(profile, setProfile, 'educations', i, { institution: e.target.value })} className={inputCls} /></Field2>
                      <Field2 label="Qualification *"><input value={r.qualification} onChange={(e) => updArr(profile, setProfile, 'educations', i, { qualification: e.target.value })} className={inputCls} /></Field2>
                      <Field2 label="Specialization"><input value={r.specialization} onChange={(e) => updArr(profile, setProfile, 'educations', i, { specialization: e.target.value })} className={inputCls} /></Field2>
                      <div className="grid grid-cols-2 gap-3">
                        <Field2 label="Start">
                          <ModernDatePicker
                            value={r.startDate || ''}
                            onChange={(v) => updArr(profile, setProfile, 'educations', i, { startDate: v })}
                            mode="month-year"
                            placeholder="Start date"
                          />
                        </Field2>
                        <Field2 label="End">
                          <ModernDatePicker
                            value={r.endDate || ''}
                            onChange={(v) => updArr(profile, setProfile, 'educations', i, { endDate: v })}
                            mode="month-year"
                            placeholder="End date"
                          />
                        </Field2>
                      </div>
                    </div>
                    <div className="flex justify-end"><button type="button" onClick={() => delArr(profile, setProfile, 'educations', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button></div>
                  </div>
                ))}
              </Section>

              {/* Skills */}
              <Section title="Skills" action={<AddBtn onClick={() => setProfile({ ...profile, skillLevels: [...asArray(profile.skillLevels), { ...blankSkill }] })} label="+ Add skill" />}>
                {asArray(profile.skillLevels).map((r: any, i: number) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <Field2 label="Skill"><input value={r.skill} onChange={(e) => updArr(profile, setProfile, 'skillLevels', i, { skill: e.target.value })} className={inputCls} /></Field2>
                    <Field2 label="Level"><Select value={r.level} onChange={(v) => updArr(profile, setProfile, 'skillLevels', i, { level: v })} options={['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((v) => ({ value: v, label: v }))} /></Field2>
                    <Field2 label="Years"><input value={r.years} onChange={(e) => updArr(profile, setProfile, 'skillLevels', i, { years: e.target.value })} className={inputCls} placeholder="e.g. 4" /></Field2>
                    <div className="flex items-end"><button type="button" onClick={() => delArr(profile, setProfile, 'skillLevels', i)} className="text-[11px] font-bold text-red-600 underline pb-3">Remove</button></div>
                  </div>
                ))}
                {asArray(profile.skillLevels).length === 0 && <div className="text-slate-500 font-medium">Add skills with level and experience.</div>}
              </Section>

              {/* Certifications */}
              <Section title="Certifications" action={<AddBtn onClick={() => setProfile({ ...profile, certList: [...asArray(profile.certList), { ...blankCert }] })} label="+ Add certification" />}>
                {asArray(profile.certList).map((r: any, i: number) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <Field2 label="Name *"><input value={r.name} onChange={(e) => updArr(profile, setProfile, 'certList', i, { name: e.target.value })} className={inputCls} /></Field2>
                    <Field2 label="Issuer *"><input value={r.issuer} onChange={(e) => updArr(profile, setProfile, 'certList', i, { issuer: e.target.value })} className={inputCls} /></Field2>
                    <Field2 label="Issue date">
                      <ModernDatePicker
                        value={r.issueDate || ''}
                        onChange={(v) => updArr(profile, setProfile, 'certList', i, { issueDate: v })}
                        mode="month-year"
                        placeholder="Issue date"
                      />
                    </Field2>
                    <Field2 label="Expiry (if applicable)">
                      <ModernDatePicker
                        value={r.expiryDate || ''}
                        onChange={(v) => updArr(profile, setProfile, 'certList', i, { expiryDate: v })}
                        mode="month-year"
                        placeholder="Expiry date"
                      />
                    </Field2>
                    <div className="sm:col-span-2 flex justify-end"><button type="button" onClick={() => delArr(profile, setProfile, 'certList', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button></div>
                  </div>
                ))}
                {asArray(profile.certList).length === 0 && <div className="text-slate-500 font-medium">No certifications yet.</div>}
              </Section>

              {/* Projects */}
              <Section title="Projects & Portfolio" action={<AddBtn onClick={() => setProfile({ ...profile, projectList: [...asArray(profile.projectList), { ...blankProj }] })} label="+ Add project" />}>
                {asArray(profile.projectList).map((r: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field2 label="Name *"><input value={r.name} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { name: e.target.value })} className={inputCls} /></Field2>
                      <Field2 label="Your role"><input value={r.role} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { role: e.target.value })} className={inputCls} /></Field2>
                      <Field2 label="Stack"><input value={r.stack} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { stack: e.target.value })} className={inputCls} /></Field2>
                      <div className="grid grid-cols-2 gap-3">
                        <Field2 label="Start">
                          <ModernDatePicker
                            value={r.startDate || ''}
                            onChange={(v) => updArr(profile, setProfile, 'projectList', i, { startDate: v })}
                            mode="month-year"
                            placeholder="Start date"
                          />
                        </Field2>
                        <Field2 label="End">
                          <ModernDatePicker
                            value={r.endDate || ''}
                            onChange={(v) => updArr(profile, setProfile, 'projectList', i, { endDate: v })}
                            mode="month-year"
                            allowPresent
                            placeholder="End date"
                          />
                        </Field2>
                      </div>
                    </div>
                    <Field2 label="Description"><textarea rows={2} value={r.description} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { description: e.target.value })} className={inputCls} /></Field2>
                    <div className="flex justify-end"><button type="button" onClick={() => delArr(profile, setProfile, 'projectList', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button></div>
                  </div>
                ))}
                {asArray(profile.projectList).length === 0 && <div className="text-slate-500 font-medium">No projects yet.</div>}
              </Section>

              {/* Preferences */}
              <Section title="Job Preferences">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field2 label="Preferred roles"><input value={profile.jobPreferences?.roles || ''} onChange={(e) => setProfile({ ...profile, jobPreferences: { ...profile.jobPreferences, roles: e.target.value } })} className={inputCls} /></Field2>
                  <Field2 label="Preferred locations"><input value={profile.jobPreferences?.locations || ''} onChange={(e) => setProfile({ ...profile, jobPreferences: { ...profile.jobPreferences, locations: e.target.value } })} className={inputCls} /></Field2>
                  <Field2 label="Employment types"><input value={profile.employmentTypes} onChange={(e) => setProfile({ ...profile, employmentTypes: e.target.value, jobPreferences: { ...profile.jobPreferences, employmentTypes: e.target.value } })} className={inputCls} placeholder="Full-time / Contract" /></Field2>
                  <Field2 label="Work arrangement"><Select value={profile.workArrangement} onChange={(v) => setProfile({ ...profile, workArrangement: v, jobPreferences: { ...profile.jobPreferences, workArrangement: v } })} placeholder="Select…" options={[{ value: 'remote', label: 'Remote' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'onsite', label: 'Onsite' }]} /></Field2>
                  <Field2 label="Availability"><input value={profile.availability} onChange={(e) => setProfile({ ...profile, availability: e.target.value, jobPreferences: { ...profile.jobPreferences, availability: e.target.value } })} className={inputCls} placeholder="e.g. Immediate / 30 days" /></Field2>
                  <Field2 label="Notice period"><input value={profile.noticePeriod} onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })} className={inputCls} /></Field2>
                </div>
              </Section>

              {/* Compensation */}
              <Section title="Compensation">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field2 label="Expected compensation *"><input required value={profile.expectedCtc} onChange={(e) => { setProfile({ ...profile, expectedCtc: e.target.value }); profileForm.setField('expectedCtc', e.target.value); }} onBlur={() => profileForm.setTouchedField('expectedCtc')} className={inputCls} placeholder="e.g. 3600000" /></Field2>
                  {profileForm.errorFor('expectedCtc') && <p className="text-xs text-red-600 font-bold mt-1 ml-2">{profileForm.errorFor('expectedCtc')}</p>}
                  <Field2 label="Currency"><Select value={profile.currency || 'INR'} onChange={(v) => setProfile({ ...profile, currency: v })} options={['INR', 'USD', 'AED', 'EUR', 'GBP', 'SGD'].map((v) => ({ value: v, label: v }))} /></Field2>
                  <Field2 label="Pay period"><Select value={profile.payPeriod || 'annual'} onChange={(v) => setProfile({ ...profile, payPeriod: v })} options={[{ value: 'annual', label: 'Annual' }, { value: 'monthly', label: 'Monthly' }]} /></Field2>
                </div>
                <Field2 label="Current compensation (optional — restricted visibility)"><input value={profile.currentCtc} onChange={(e) => setProfile({ ...profile, currentCtc: e.target.value })} className={inputCls} placeholder="Shared only with vetted employers" /></Field2>
              </Section>

              {/* Resume */}
              <Section title="Resume">
                {profile.resumeRef ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between gap-2 flex-wrap">
                    <span>Resume on file • v{profile.resumeVersion || 1} • uploaded {fmtDate(profile.resumeUploadedAt)}</span>
                    <button type="button" onClick={() => navigate('/candidate/docs')} className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold">Manage in Documents</button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between gap-2 flex-wrap">
                    <span>No resume linked yet.</span>
                    <button type="button" onClick={() => navigate('/candidate/docs')} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold">Upload in Documents</button>
                  </div>
                )}
              </Section>

              {/* Links */}
              <Section title="Links">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field2 label="Portfolio URL"><input type="url" value={profile.portfolio} onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })} className={inputCls} /></Field2>
                  <Field2 label="Professional profile (LinkedIn)"><input type="url" value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} className={inputCls} /></Field2>
                  <Field2 label="GitHub"><input type="url" value={profile.github || ''} onChange={(e) => setProfile({ ...profile, github: e.target.value })} className={inputCls} /></Field2>
                  <Field2 label="Code / work samples"><input type="url" value={profile.codeSamples || ''} onChange={(e) => setProfile({ ...profile, codeSamples: e.target.value })} className={inputCls} /></Field2>
                </div>
              </Section>

              {/* Privacy */}
              <Section title="Privacy">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field2 label="Profile visibility"><Select value={profile.visibility} onChange={(v) => setProfile({ ...profile, visibility: v })} options={[{ value: 'standard', label: 'Standard' }, { value: 'open', label: 'Open to offers' }, { value: 'private', label: 'Private' }, { value: 'anonymous', label: 'Anonymous search' }]} /></Field2>
                  <div className="flex items-end pb-1"><button type="button" onClick={() => navigate('/candidate/privacy')} className="text-[11px] font-bold text-blue-600 underline">Consent & communication preferences →</button></div>
                </div>
              </Section>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="px-6 py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2">
                  <Save size={15} /> Save & View Profile
                </button>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ))}

        {/* ============ CURATED JOBS (§7.4) ============ */}
        {currentTab === 'jobs' && (
          <CandidateJobsView
            jobs={jobs}
            loading={jobsLoading}
            appliedJobIds={appliedJobIds}
            savedJobIds={savedIds}
            candidateProfile={profile}
            onNavigate={navigate}
            onApply={handleApplyJob}
            onToggleSave={toggleSave}
          />
        )}

        {/* ============ JOB DETAIL ROUTE (§7.4) ============ */}
        {currentTab === 'jobDetail' && (
          <JobDetailPage
            job={detailJob}
            loading={detailLoading}
            applied={detailJob ? appliedJobIds.includes(detailJob.id) : false}
            saved={detailJob ? savedIds.includes(detailJob.id) : false}
            candidateProfile={profile}
            allJobs={jobs}
            onBack={() => navigate('/candidate/jobs')}
            onApply={async (jobId, _notes) => {
              await handleApplyJob(jobId);
            }}
            onToggleSave={toggleSave}
            onNavigate={navigate}
          />
        )}

        {/* ============ ACTIVE APPLICATIONS (§7.6) ============ */}
        {currentTab === 'applications' && (
          <CandidateApplicationsView
            applications={myApplications}
            loading={false}
            onNavigate={navigate}
            onWithdraw={async (appId) => {
              try {
                const res = await applicationsApi.withdraw(appId);
                const updated = (res as { data?: any })?.data;
                setMyApplications((prev) => prev.map((a) => (a.id === appId ? updated || { ...a, stage: 'Withdrawn' } : a)));
              } catch (err) {
                console.warn('Withdraw error:', err);
              }
            }}
          />
        )}

        {/* ============ APPLICATION DETAIL ROUTE (§7.6) ============ */}
        {currentTab === 'appDetail' && (
          appDetailLoading ? (
            <InlineLoading message="Loading application details…" />
          ) : !appDetail ? (
            <EmptyState title="Application not found" message="It may have been withdrawn or removed." />
          ) : (
            <CandidateAppDetailView
              app={appDetail}
              loading={appDetailLoading}
              onNavigate={navigate}
              onBack={() => navigate('/candidate/applications')}
              onOpenChat={(appId) => navigate(`/candidate/applications/${appId}/chat`)}
              onWithdraw={async (appId, reason) => {
                try {
                  const res = await applicationsApi.withdraw(appId, reason);
                  const updated = (res as { data?: any })?.data;
                  setAppDetail(updated || { ...appDetail, stage: 'Withdrawn' });
                  setMyApplications((prev) => prev.map((a) => (a.id === appId ? updated || { ...a, stage: 'Withdrawn' } : a)));
                } catch (err) {
                  console.warn('Withdraw notice:', err);
                }
              }}
              onReschedule={async (interviewId, reason) => {
                try {
                  const res = await interviewsApi.reschedule(interviewId, { reason });
                  const updated = (res as { data?: any })?.data;
                  setInterviews((prev) => prev.map((x) => (x.id === interviewId ? updated || x : x)));
                  if (appDetail.nextInterview?.id === interviewId) {
                    setAppDetail({ ...appDetail, nextInterview: updated || appDetail.nextInterview });
                  }
                } catch (err) {
                  console.warn('Reschedule notice:', err);
                }
              }}
            />
          )
        )}

        {/* ============ APP CHAT ROUTE (§7.8) ============ */}
        {currentTab === 'appChat' && (
          <div className="space-y-4">
            <button type="button" onClick={() => navigate(`/candidate/applications/${routeParam}`)} className="text-[11px] font-bold text-blue-600 underline">← Back to application</button>
            <CandidateMessagesView key={routeParam} initialAppId={routeParam} userEmail={userEmail} onNavigate={navigate} />
          </div>
        )}

        {/* ============ UPCOMING INTERVIEWS (§7.7) ============ */}
        {currentTab === 'interviews' && (
          <CandidateInterviewsView
            interviews={myInterviews}
            loading={false}
            userEmail={userEmail}
            onNavigate={navigate}
            onConfirm={async (interviewId) => {
              try {
                const res = await interviewsApi.reschedule(interviewId, { status: 'Scheduled', reason: 'Candidate confirmed attendance' });
                const updated = (res as { data?: any })?.data;
                setInterviews((prev) => prev.map((x) => (x.id === interviewId ? updated || x : x)));
              } catch (err) {
                console.warn('Confirm interview error:', err);
              }
            }}
            onReschedule={async (interviewId, reason) => {
              try {
                const res = await interviewsApi.reschedule(interviewId, { reason });
                const updated = (res as { data?: any })?.data;
                setInterviews((prev) => prev.map((x) => (x.id === interviewId ? updated || x : x)));
              } catch (err) {
                console.warn('Reschedule error:', err);
              }
            }}
          />
        )}

        {/* ============ SAVED JOBS (§7.5) ============ */}
        {currentTab === 'saved' && (
          <CandidateSavedJobsView
            savedJobs={savedJobsEnriched}
            loading={false}
            onNavigate={navigate}
            onRemove={(jobId) => toggleSave(jobId)}
            onApply={(jobId) => handleApplyJob(jobId)}
          />
        )}

        {/* ============ OFFERS & JOINING (§7) ============ */}
        {currentTab === 'offers' && (
          <CandidateOffersView
            offers={offersMine}
            loading={offersLoading}
            onNavigate={navigate}
            onRespond={async (offerId, decision, reason) => {
              await respondOffer(offerId, decision, reason);
            }}
          />
        )}

        {currentTab === 'timesheets' && (
          <CandidateTimesheetsView />
        )}
        {currentTab === 'messages' && (
          <CandidateMessagesView
            userEmail={userEmail}
            onNavigate={navigate}
          />
        )}
        {currentTab === 'docs' && (
          <CandidateDocumentsView
            userEmail={userEmail}
          />
        )}
        {currentTab === 'privacy' && (
          <CandidatePrivacyView
            userEmail={userEmail}
          />
        )}
        {currentTab === 'security' && (
          <CandidateSecurityView
            userEmail={userEmail}
          />
        )}
        {currentTab === 'notifications' && (
          <CandidateNotificationsView
            onNavigate={navigate}
          />
        )}
        {currentTab === 'settings' && (
          <CandidateSettingsView
            userEmail={userEmail}
            onNavigate={navigate}
          />
        )}



      </div>
    </PortalShell>
  );
}

/* ---------- small building blocks (same table/card/action language) ---------- */
function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
        {action}
      </div>
      {children}
    </div>
  );
}
function Field2({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={labelCls}>{label}</label>{children}</div>;
}
function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] cursor-pointer">{label}</button>;
}

function updArr(profile: any, setProfile: (v: any) => void, key: string, i: number, patch: any) {
  const rows = asArray(profile[key]).map((r: any, j: number) => (j === i ? { ...r, ...patch } : r));
  setProfile({ ...profile, [key]: rows });
}
function delArr(profile: any, setProfile: (v: any) => void, key: string, i: number) {
  const rows = asArray(profile[key]).filter((_: any, j: number) => j !== i);
  setProfile({ ...profile, [key]: rows });
}
