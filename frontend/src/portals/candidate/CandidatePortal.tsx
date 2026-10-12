import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { CheckCircle2, Search, Video, Save, Calendar } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { applicationsApi, talentApi, jobsApi, interviewsApi, platformApi, documentsApi, offersPlacementsApi } from '../../shared/enterprise/phaseApi';
import { ChatPanel, NotificationsPanel, syncAll, ConfirmButton, DocumentsPanel, ConsentPanel, TimesheetsPanel } from '../common/EnterprisePanels';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { Select, Field } from '../../shared/ui/EnterpriseKit';
import { SearchSuggest, SkillsMultiSelect, FilterPanel, DataTable } from '../../shared/ui/SearchKit';
import { getUserEmail } from '../../shared/auth/session';
import { EmptyState, ErrorState, InlineLoading } from '../../shared/ui/DataState';
import { safeMeetLink } from '../../shared/utils';

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
const TERMINAL_STAGES = ['Hired', 'Withdrawn', 'Rejected', 'Job Closed'];

type Tab =
  | 'dashboard' | 'onboarding' | 'profile' | 'jobs' | 'jobDetail' | 'applications'
  | 'appDetail' | 'appChat' | 'interviews' | 'saved' | 'offers' | 'timesheets' | 'messages'
  | 'docs' | 'privacy' | 'security' | 'notifications';

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
  if (seg[0] === 'saved' || seg[0] === 'saved-jobs' || seg[0] === 'liked-jobs') return { tab: 'saved', param: '' };
  if (seg[0] === 'offers') return { tab: 'offers', param: '' };
  if (seg[0] === 'timesheets') return { tab: 'timesheets', param: '' };
  if (seg[0] === 'messages' || seg[0] === 'chat') return { tab: 'messages', param: '' };
  if (seg[0] === 'docs' || seg[0] === 'documents') return { tab: 'docs', param: '' };
  if (seg[0] === 'privacy' || seg[0] === 'settings') return { tab: 'privacy', param: '' };
  if (seg[0] === 'security') return { tab: 'security', param: '' };
  if (seg[0] === 'notifications') return { tab: 'notifications', param: '' };
  return { tab: 'dashboard', param: '' };
}

const TAB_TITLES: Record<Tab, string> = {
  dashboard: 'Career Dashboard', onboarding: 'Onboarding', profile: 'My Profile & CV',
  jobs: 'Curated Jobs', jobDetail: 'Job Detail', applications: 'Active Applications',
  appDetail: 'Application Detail', appChat: 'Application Chat', interviews: 'Upcoming Interviews',
  saved: 'Saved Jobs', offers: 'Offers & Joining', timesheets: 'My Timesheets', messages: 'Messages', docs: 'Documents',
  privacy: 'Privacy', security: 'Security', notifications: 'Notifications',
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

/* Distinct-value typeahead sources shared by job search + saved + detail. */
function uniqSorted(vals: unknown[]): string[] {
  return [...new Set(vals.map((v) => String(v ?? '').trim()).filter(Boolean))].sort().slice(0, 60);
}
function rankMatches(list: string[]) {
  return (q: string) => {
    const ql = q.trim().toLowerCase();
    if (ql.length < 2) return [];
    return [
      ...list.filter((s) => s.toLowerCase().startsWith(ql)),
      ...list.filter((s) => !s.toLowerCase().startsWith(ql) && s.toLowerCase().includes(ql)),
    ].slice(0, 8);
  };
}

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
  const [reschedInterview, setReschedInterview] = useState('');
  const [reschedReason, setReschedReason] = useState('');
  const [confirmBusy, setConfirmBusy] = useState('');
  const [offersMine, setOffersMine] = useState<any[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [letter, setLetter] = useState<any>(null);
  const [letterLoading, setLetterLoading] = useState(false);
  const [respondBusy, setRespondBusy] = useState('');

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

  /* ---------- jobs search + filters (§7.4) ---------- */
  const [filters, setFilters] = useState({
    q: '', skills: '', company: '', industry: '', location: '', experience: '', employmentType: '',
    workArrangement: '', salaryMin: '', salaryMax: '', posted: '', qualifications: '',
  });
  const [jobsLoading, setJobsLoading] = useState(false);
  const runJobSearch = async (f = filters) => {
    setJobsLoading(true);
    try {
      const sp = new URLSearchParams();
      if (f.q.trim()) sp.set('q', f.q.trim());
      if (f.skills.trim()) sp.set('skills', f.skills.trim());
      if (f.company.trim()) sp.set('company', f.company.trim());
      if (f.industry.trim()) sp.set('industry', f.industry.trim());
      if (f.location.trim()) sp.set('location', f.location.trim());
      if (f.experience !== '') sp.set('experience', f.experience);
      if (f.employmentType) sp.set('employmentType', f.employmentType);
      if (f.workArrangement) sp.set('workArrangement', f.workArrangement);
      if (f.salaryMin !== '') sp.set('salaryMin', f.salaryMin);
      if (f.salaryMax !== '') sp.set('salaryMax', f.salaryMax);
      if (f.posted) {
        const days = Number(f.posted);
        sp.set('postedAfter', new Date(Date.now() - days * 864e5).toISOString());
      }
      if (f.qualifications.trim()) sp.set('qualifications', f.qualifications.trim());
      const qs = sp.toString();
      const res = await jobsApi.list(qs ? `?${qs}` : '');
      setJobs(((res as { data?: any[] })?.data || []) as any[]);
    } catch (err) {
      console.warn('Job search notice:', err);
    } finally {
      setJobsLoading(false);
    }
  };

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
  const [docBusy, setDocBusy] = useState(false);
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

  const handleSaveProfile = async (e?: React.FormEvent, silent = false) => {
    if (e) e.preventDefault();
    setSaveError('');
    try {
      // Keep legacy string columns in sync with structured arrays for admin/directory views.
      const body = {
        ...profile,
        email: profile.email || userEmail,
        education: asArray(profile.educations).length > 0
          ? asArray(profile.educations).map((r: any) => `${r.institution} — ${r.qualification}${r.endDate ? `, ${r.endDate}` : ''}`).join('; ')
          : profile.education,
        certifications: asArray(profile.certList).length > 0
          ? asArray(profile.certList).map((r: any) => `${r.name} — ${r.issuer}${r.expiryDate ? ` (exp ${r.expiryDate})` : ''}`).join('; ')
          : profile.certifications,
        projects: asArray(profile.projectList).length > 0
          ? asArray(profile.projectList).map((r: any) => r.name).join(', ')
          : profile.projects,
        skills: asArray(profile.skillLevels).length > 0
          ? asArray(profile.skillLevels).map((r: any) => r.skill).join(', ')
          : profile.skills,
        experience: profile.experiences,
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
    return { jobId: id, job, closed, applied, jobMissing: server?.jobMissing ?? !job };
  });

  const offers = myApplications.filter((a) => ['Offer Issued', 'Offer', 'Selected', 'Hired'].includes(a.stage));

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

  const openLetter = async (placementId: string) => {
    setLetterLoading(true);
    try {
      const res = await offersPlacementsApi.offerLetter(placementId);
      setLetter((res as { data?: any })?.data || null);
    } catch {
      setLetter(null);
    } finally {
      setLetterLoading(false);
    }
  };
  const respondOffer = async (offerId: string, decision: 'accepted' | 'declined') => {
    setRespondBusy(offerId + decision);
    try {
      const res = await offersPlacementsApi.respond(offerId, decision);
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
    } finally {
      setRespondBusy('');
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

  const widgetCls = 'p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1 text-left w-full hover:border-blue-300 hover:shadow transition-all cursor-pointer';

  /* Typeahead sources (2+ chars) drawn from live listings + skills taxonomy. */
  const suggestFor = useMemo(() => {
    const titles = uniqSorted(jobs.map((j) => j.title));
    const companies = uniqSorted(jobs.map((j) => j.companyName));
    const locations = uniqSorted(jobs.map((j) => j.location));
    const industries = uniqSorted(jobs.map((j) => (j as any).industry));
    const quals = uniqSorted(jobs.flatMap((j) => String((j as any).qualifications || '').split(',')));
    const skills = uniqSorted(jobs.flatMap((j) => `${j.requiredSkills || ''},${j.preferredSkills || ''}`.split(',')));
    return {
      q: rankMatches([...titles, ...companies]),
      skills, company: rankMatches(companies), industry: rankMatches(industries),
      location: rankMatches(locations), qualifications: rankMatches(quals),
    };
  }, [jobs]);
  const skillList = useMemo(() => filters.skills.split(',').map((s) => s.trim()).filter(Boolean), [filters.skills]);

  return (
    <PortalShell portalTitle="Candidate Career Hub" portalRole="candidate" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-4">

        <div className="px-1">
          <h2 className="text-base font-extrabold text-slate-900">{TAB_TITLES[currentTab]}</h2>
        </div>

        {/* ============ DASHBOARD (§7.2 — 9 widgets, each linked) ============ */}
        {currentTab === 'dashboard' && (
          <div className="space-y-4">
            {!hasProfile && !isLoading && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between gap-3">
                <span>Your profile is empty. Complete onboarding to get matched to jobs.</span>
                <button type="button" onClick={() => navigate('/candidate/onboarding')} className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold shrink-0">Start Onboarding</button>
              </div>
            )}
            {isLoading ? (
              <InlineLoading message="Loading your career data…" />
            ) : loadError ? (
              <ErrorState message={loadError} onRetry={() => setReloadKey((k) => k + 1)} />
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button type="button" onClick={() => navigate('/candidate/profile')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Completeness</div>
                <div className="text-3xl font-extrabold text-slate-900">{matchScore}%</div>
                <div className="text-xs font-bold text-[#087BFF]">Open profile →</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/applications')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Applications</div>
                <div className="text-3xl font-extrabold text-slate-900">{myApplications.length}</div>
                <div className="text-xs font-bold text-[#087BFF]">{myApplications.length === 0 ? 'Browse jobs →' : 'View applications →'}</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/interviews')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Interviews</div>
                <div className="text-3xl font-extrabold text-slate-900">{myInterviews.filter((i) => ['Scheduled', 'Rescheduled'].includes(i.status)).length}</div>
                <div className="text-xs font-bold text-emerald-600">{myInterviews.length === 0 ? 'None scheduled yet' : 'View schedule →'}</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/jobs')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Jobs</div>
                <div className="text-3xl font-extrabold text-slate-900">{recommended.length}</div>
                <div className="text-xs font-bold text-[#087BFF]">View matches →</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/jobs')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recently Viewed Jobs</div>
                <div className="text-3xl font-extrabold text-slate-900">{recentJobs.length}</div>
                <div className="text-xs font-bold text-[#087BFF]">{recentJobs.length === 0 ? 'No views yet' : `${recentJobs[0].title} →`}</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/saved')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Jobs</div>
                <div className="text-3xl font-extrabold text-slate-900">{savedIds.length}</div>
                <div className="text-xs font-bold text-[#087BFF]">Open shortlist →</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/applications')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application Updates</div>
                <div className="text-3xl font-extrabold text-slate-900">{updates.length}</div>
                <div className="text-xs font-bold text-[#087BFF]">{updates.length === 0 ? 'No updates yet' : `${updates[0]?.to || ''} →`}</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/notifications')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</div>
                <div className="text-3xl font-extrabold text-slate-900">{unreadCount} New</div>
                <div className="text-xs font-bold text-[#087BFF]">Open inbox →</div>
              </button>
              <button type="button" onClick={() => navigate('/candidate/privacy')} className={widgetCls}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Visibility</div>
                <div className="text-3xl font-extrabold text-slate-900 capitalize">{profile.visibility || 'Standard'}</div>
                <div className="text-xs font-bold text-[#087BFF]">Privacy settings →</div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={cardCls}>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">Recommended for you</h3>
                  <button type="button" onClick={() => navigate('/candidate/jobs')} className="text-[11px] font-bold text-blue-600 underline">All jobs</button>
                </div>
                {recommended.length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium">Complete your skills to unlock recommendations.</div>
                ) : recommended.map(({ job }) => (
                  <button key={job.id} type="button" onClick={() => navigate(`/candidate/jobs/${job.id}`)} className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-left hover:border-blue-300">
                    <span className="min-w-0"><span className="block font-extrabold text-slate-900 text-sm truncate">{job.title}</span>
                    <span className="block text-xs text-slate-500 font-medium truncate">{job.companyName} • {job.location}</span></span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-[10px] shrink-0">Skills match</span>
                  </button>
                ))}
              </div>
              <div className={cardCls}>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">Latest updates</h3>
                  <button type="button" onClick={() => navigate('/candidate/notifications')} className="text-[11px] font-bold text-blue-600 underline">All notifications</button>
                </div>
                {updates.length === 0 && notifPreview.length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium">Stage changes and notifications will appear here.</div>
                ) : (
                  <div className="space-y-2">
                    {updates.slice(0, 4).map((u, i) => (
                      <button key={i} type="button" onClick={() => navigate(`/candidate/applications/${u.appId}`)} className="w-full text-left text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300">
                        <strong>{u.jobTitle}</strong>: {u.from} → <strong className="text-blue-600">{u.to}</strong> <span className="text-slate-500">• {fmtDate(u.createdAt)}</span>
                      </button>
                    ))}
                    {notifPreview.slice(0, 2).map((n) => (
                      <div key={n.id} className="text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200"><strong>[{n.kind}]</strong> {n.body}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </>)}
          </div>
        )}

        {/* ============ ONBOARDING (§7.1 — 9 sections, save progress) ============ */}
        {currentTab === 'onboarding' && (
          <OnboardingWizard profile={profile} setProfile={setProfile} hasProfile={hasProfile} onSaveSection={async (step: number) => {
            setSaveError('');
            try {
              await apiClient.put<any>('/api/v1/candidate/profile', { email: profile.email || userEmail, onboarding: { step, updatedAt: new Date().toISOString() } });
            } catch { /* progress save best-effort */ }
          }} onFinish={async () => { await handleSaveProfile(); navigate('/candidate/profile'); }} saveError={saveError} />
        )}

        {/* ============ PROFILE (§7.3 — structured) ============ */}
        {currentTab === 'profile' && (
          <div className={cardCls + ' sm:p-8'}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Candidate Profile</h3>
                <p className="text-xs text-slate-500">Source of truth for matching. Applications keep submission snapshots.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs">{matchScore}% complete</span>
            </div>
            {savedSuccess && <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2"><CheckCircle2 size={16} /> Profile saved.</div>}
            {saveError && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{saveError}</div>}
            {profileErrors.length > 0 && <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold space-y-1">{profileErrors.map((e, i) => <div key={i}>• {e}</div>)}</div>}

            <form onSubmit={(e) => { const errs = validateProfile(); setProfileErrors(errs); if (errs.length > 0) { e.preventDefault(); return; } handleSaveProfile(e); }} className="space-y-4 text-xs">
              {/* Personal */}
              <Section title="Personal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field2 label="Full Name *"><input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputCls} /></Field2>
                  <Field2 label="Primary Email *"><input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputCls} /></Field2>
                  <Field2 label="Phone"><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputCls} placeholder="+91 ..." /></Field2>
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
                        <Field2 label="Start"><input type="month" value={r.startDate} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { startDate: e.target.value })} className={inputCls} /></Field2>
                        <Field2 label="End"><input type="month" value={r.endDate} disabled={r.current} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { endDate: e.target.value })} className={inputCls} /></Field2>
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
                        <Field2 label="Start"><input type="month" value={r.startDate} onChange={(e) => updArr(profile, setProfile, 'educations', i, { startDate: e.target.value })} className={inputCls} /></Field2>
                        <Field2 label="End"><input type="month" value={r.endDate} onChange={(e) => updArr(profile, setProfile, 'educations', i, { endDate: e.target.value })} className={inputCls} /></Field2>
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
                    <Field2 label="Issue date"><input type="month" value={r.issueDate} onChange={(e) => updArr(profile, setProfile, 'certList', i, { issueDate: e.target.value })} className={inputCls} /></Field2>
                    <Field2 label="Expiry (if applicable)"><input type="month" value={r.expiryDate} onChange={(e) => updArr(profile, setProfile, 'certList', i, { expiryDate: e.target.value })} className={inputCls} /></Field2>
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
                        <Field2 label="Start"><input type="month" value={r.startDate} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { startDate: e.target.value })} className={inputCls} /></Field2>
                        <Field2 label="End"><input type="month" value={r.endDate} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { endDate: e.target.value })} className={inputCls} /></Field2>
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
                  <Field2 label="Expected compensation *"><input required value={profile.expectedCtc} onChange={(e) => setProfile({ ...profile, expectedCtc: e.target.value })} className={inputCls} placeholder="e.g. 3600000" /></Field2>
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

              <button type="submit" className="px-6 py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"><Save size={15} /> Save Profile</button>
            </form>
          </div>
        )}

        {/* ============ JOBS (§7.4 — 11 filters) ============ */}
        {currentTab === 'jobs' && (
          <div className={cardCls}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900">Job Opportunities</h3>
              <span className="text-[11px] font-bold text-slate-500">Only published, active, non-expired jobs appear here.</span>
            </div>
            <FilterPanel title="Search & filters" count={jobs.length} storageKey="nexa:candidate-jobs-filters">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              <SearchSuggest value={filters.q} onChange={(v) => setFilters({ ...filters, q: v })} fetchSuggestions={suggestFor.q} placeholder="Keyword / title" ariaLabel="Keyword" />
              <div className="col-span-2 sm:col-span-1"><SkillsMultiSelect value={skillList} onChange={(v) => setFilters({ ...filters, skills: v.join(', ') })} /></div>
              <SearchSuggest value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} fetchSuggestions={suggestFor.company} placeholder="Company" ariaLabel="Company" />
              <SearchSuggest value={filters.industry} onChange={(v) => setFilters({ ...filters, industry: v })} fetchSuggestions={suggestFor.industry} placeholder="Industry" ariaLabel="Industry" />
              <SearchSuggest value={filters.location} onChange={(v) => setFilters({ ...filters, location: v })} fetchSuggestions={suggestFor.location} placeholder="Location" ariaLabel="Location" />
              <input type="number" min={0} value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })} placeholder="Your exp. (yrs)" className={inputCls + ' bg-white'} aria-label="Experience" />
              <Select value={filters.employmentType} onChange={(v) => setFilters({ ...filters, employmentType: v })} placeholder="Employment type" ariaLabel="Employment type" options={[{ value: '', label: 'Any type' }, 'Full-time', 'Part-time', 'Contract', 'Internship'].map((v) => typeof v === 'string' ? { value: v, label: v } : v)} />
              <Select value={filters.workArrangement} onChange={(v) => setFilters({ ...filters, workArrangement: v })} placeholder="Work arrangement" ariaLabel="Work arrangement" options={[{ value: '', label: 'Any arrangement' }, { value: 'remote', label: 'Remote' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'onsite', label: 'Onsite' }]} />
              <div className="flex gap-2">
                <input value={filters.salaryMin} onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })} placeholder="Min salary" type="number" min={0} className={inputCls + ' bg-white'} aria-label="Min salary" />
                <input value={filters.salaryMax} onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })} placeholder="Max" type="number" min={0} className={inputCls + ' bg-white'} aria-label="Max salary" />
              </div>
              <Select value={filters.posted} onChange={(v) => setFilters({ ...filters, posted: v })} placeholder="Date posted" ariaLabel="Date posted" options={[{ value: '', label: 'Any time' }, { value: '1', label: 'Last 24 hours' }, { value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }]} />
              <SearchSuggest value={filters.qualifications} onChange={(v) => setFilters({ ...filters, qualifications: v })} fetchSuggestions={suggestFor.qualifications} placeholder="Qualifications" ariaLabel="Qualifications" />
              <div className="flex gap-2 col-span-2 sm:col-span-1">
                <button type="button" onClick={() => runJobSearch()} className="flex-1 px-4 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs flex items-center justify-center gap-1"><Search size={13} /> Search</button>
                <button type="button" onClick={() => { const f = { q: '', skills: '', company: '', industry: '', location: '', experience: '', employmentType: '', workArrangement: '', salaryMin: '', salaryMax: '', posted: '', qualifications: '' }; setFilters(f); runJobSearch(f); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Clear</button>
              </div>
            </div>
            </FilterPanel>
            {jobsLoading ? <InlineLoading message="Searching jobs…" /> : (
            <div className="space-y-4">
              {jobs.map((job, idx) => {
                const isApplied = appliedJobIds.includes(job.id);
                const isSaved = savedIds.includes(job.id);
                const closed = isClosed(job);
                const match = skillOverlap(job, mySkills);
                return (
                  <div key={job.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                        {match > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-[10px]">Skills match</span>}
                        {closed && <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px]">Closed</span>}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        <strong>{job.companyName || '—'}</strong> • {job.salaryMin ? `${job.salaryMin}–${job.salaryMax || job.salaryMin}` : (job.budgetRange || 'Salary undisclosed')} • {job.location || '—'} • {job.employmentType || ''}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Posted {fmtDate(job.createdAt)}{job.expiryDate ? ` • Apply by ${fmtDate(job.expiryDate)}` : ''}{job.experienceMin != null ? ` • Exp ${job.experienceMin}–${job.experienceMax ?? '+'} yrs` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => navigate(`/candidate/jobs/${job.id}`)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer">Details</button>
                      <button onClick={() => toggleSave(job.id)} className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer ${isSaved ? 'bg-amber-100 text-amber-800' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}>{isSaved ? '★ Saved' : '☆ Save'}</button>
                      <button onClick={() => handleApplyJob(job.id)} disabled={isApplied || closed} title={closed ? 'This job is closed' : ''} className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${(isApplied || closed) ? 'bg-slate-200 text-slate-500 cursor-default' : 'bg-[#087BFF] hover:bg-blue-600 text-white shadow-md'}`}>{isApplied ? '✓ Applied' : closed ? 'Closed' : 'Apply'}</button>
                    </div>
                  </div>
                );
              })}
              {jobs.length === 0 && <EmptyState title="No jobs match" message="Adjust filters and search again." />}
            </div>)}
          </div>
        )}

        {/* ============ JOB DETAIL ROUTE (§7.4) ============ */}
        {currentTab === 'jobDetail' && (
          <div className={cardCls}>
            <button type="button" onClick={() => navigate('/candidate/jobs')} className="text-[11px] font-bold text-blue-600 underline">← Back to jobs</button>
            {detailLoading ? <InlineLoading message="Loading job details…" /> : !detailJob ? (
              <EmptyState title="Job not found" message="This posting may have been closed or expired." />
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{detailJob.title}</h3>
                  <div className="text-xs text-slate-500 font-medium">{detailJob.companyName} • {detailJob.location} • {detailJob.employmentType} • {detailJob.workArrangement || ''}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">Posted {fmtDate(detailJob.createdAt)}{detailJob.expiryDate ? ` • Deadline ${fmtDate(detailJob.expiryDate)}` : ' • No deadline'} • {detailJob.acceptingApplications ? 'Accepting applications' : 'Not accepting applications'}</div>
                </div>
                <DetailRow label="Description" value={detailJob.description} />
                <DetailRow label="Responsibilities" value={detailJob.responsibilities} />
                <DetailRow label="Required skills" value={detailJob.requiredSkills} />
                <DetailRow label="Preferred skills" value={detailJob.preferredSkills} />
                <DetailRow label="Qualifications" value={detailJob.qualifications} />
                <div className="text-xs"><strong>Compensation:</strong> {detailJob.salaryMin ? `${detailJob.salaryMin}–${detailJob.salaryMax}` : (detailJob.budgetRange || 'Undisclosed')} {detailJob.salaryDisclosure ? `(${detailJob.salaryDisclosure})` : ''}</div>
                <DetailRow label="Selection process" value={detailJob.selectionProcess} />
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => toggleSave(detailJob.id)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer">{savedIds.includes(detailJob.id) ? '★ Saved' : '☆ Save'}</button>
                  <button onClick={() => handleApplyJob(detailJob.id)} disabled={appliedJobIds.includes(detailJob.id) || isClosed(detailJob) || !detailJob.acceptingApplications} className="px-5 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs cursor-pointer disabled:bg-slate-200 disabled:text-slate-500">{appliedJobIds.includes(detailJob.id) ? '✓ Applied' : 'Apply'}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ APPLICATIONS (§7.6 — table by default) ============ */}
        {currentTab === 'applications' && (
          <div className={cardCls}>
            <h3 className="text-base font-extrabold text-slate-900">Applications</h3>
            <DataTable
              rows={myApplications}
              keyOf={(app) => app.id}
              emptyTitle="No applications yet"
              emptyMessage="Browse jobs and apply — your applications and live stages appear here."
              columns={[
                { key: 'app', label: 'Application', render: (app) => (
                  <><button type="button" onClick={() => navigate(`/candidate/applications/${app.id}`)} className="font-extrabold text-slate-900 text-sm hover:text-[#087BFF] text-left">{app.jobTitle}</button>
                  <div className="text-[11px] text-slate-500 font-medium">{app.id} • {app.companyName || app.orgId || ''} • Applied {fmtDate(app.appliedAt || app.createdAt)}</div></>
                ) },
                { key: 'stage', label: 'Stage', render: (app) => (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-[11px] whitespace-nowrap">{app.stage}</span>
                ) },
                { key: 'updated', label: 'Updated', render: (app) => (
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{fmtDateTime(app.updatedAt)}</span>
                ) },
                { key: 'action', label: '', render: (app) => (
                  <button type="button" onClick={() => navigate(`/candidate/applications/${app.id}`)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px]">Open →</button>
                ) },
              ]}
            />
          </div>
        )}

        {/* ============ APPLICATION DETAIL ROUTE (§7.6) ============ */}
        {currentTab === 'appDetail' && (
          <div className={cardCls}>
            <button type="button" onClick={() => navigate('/candidate/applications')} className="text-[11px] font-bold text-blue-600 underline">← Back to applications</button>
            {appDetailLoading ? <InlineLoading message="Loading application…" /> : !appDetail ? (
              <EmptyState title="Application not found" message="It may have been withdrawn or removed." />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">{appDetail.jobTitle}</h3>
                    <div className="text-xs text-slate-500 font-medium">{appDetail.id} • {appDetail.companyName || appDetail.orgId || ''} • Applied {fmtDate(appDetail.appliedAt || appDetail.createdAt)} • Updated {fmtDateTime(appDetail.updatedAt)}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-xs">{appDetail.stage}</span>
                </div>
                {appDetail.stageReason && <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"><strong>Status note:</strong> {appDetail.stageReason}</div>}
                {appDetail.jobClosed && <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600">This job is now closed. History is preserved below; new applications are disabled.</div>}
                {appDetail.nextInterview && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <strong>Next interview:</strong> {appDetail.nextInterview.round || appDetail.nextInterview.roundName} • {fmtDateTime(appDetail.nextInterview.scheduledAt || appDetail.nextInterview.date)} {appDetail.nextInterview.mode ? `• ${appDetail.nextInterview.mode}` : ''}
                    <button type="button" onClick={() => navigate('/candidate/interviews')} className="ml-2 font-bold text-emerald-700 underline">View →</button>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2">Timeline</h4>
                  {(appDetail.history || []).length === 0 ? (
                    <div className="text-xs text-slate-500 font-medium">No timeline events yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {(appDetail.history || []).map((h: any, i: number) => (
                        <div key={h.id || i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                          <span>{h.from} → <strong className="text-blue-600">{h.to}</strong> {h.reason ? <span className="text-slate-500">• {h.reason}</span> : null}</span>
                          <span className="text-slate-500 shrink-0">{fmtDateTime(h.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {appDetail.conversation && (
                    <button type="button" onClick={() => navigate(`/candidate/applications/${appDetail.id}/chat`)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Open chat</button>
                  )}
                  <label className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                    {docBusy ? 'Uploading…' : '+ Add document'}
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 5 * 1024 * 1024) { setSaveError('File must be under 5 MB.'); return; }
                      setDocBusy(true);
                      try {
                        const buf = await f.arrayBuffer();
                        let binary = '';
                        const bytes = new Uint8Array(buf);
                        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
                        await documentsApi.upload({ name: f.name, mime: f.type || 'application/pdf', data: btoa(binary), kind: 'application-doc', applicationId: appDetail.id });
                        syncAll();
                      } catch (err) { console.warn('Doc upload notice:', err); }
                      finally { setDocBusy(false); }
                    }} />
                  </label>
                  {!TERMINAL_STAGES.includes(appDetail.stage) && (
                    <ConfirmButton label="Withdraw application" confirmLabel="Confirm withdraw?" className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold text-xs cursor-pointer" onConfirm={async () => {
                      try {
                        const res = await applicationsApi.withdraw(appDetail.id);
                        const updated = (res as { data?: any })?.data;
                        setAppDetail(updated || { ...appDetail, stage: 'Withdrawn' });
                        setMyApplications((prev) => prev.map((a) => (a.id === appDetail.id ? updated || { ...a, stage: 'Withdrawn' } : a)));
                      } catch (err) { console.warn('Withdraw notice:', err); }
                    }} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ APP CHAT ROUTE (§7.8) ============ */}
        {currentTab === 'appChat' && (
          <div className="space-y-4">
            <button type="button" onClick={() => navigate(`/candidate/applications/${routeParam}`)} className="text-[11px] font-bold text-blue-600 underline">← Back to application</button>
            <ChatPanel key={routeParam} initialAppId={routeParam} />
          </div>
        )}

        {/* ============ INTERVIEWS (§7.7 — full fields) ============ */}
        {currentTab === 'interviews' && (
          <div className={cardCls}>
            <h3 className="text-base font-extrabold text-slate-900">Interviews</h3>
            {myInterviews.length === 0 ? (
              <EmptyState title="No interviews scheduled" message="When an employer shortlists you, your interview schedule will appear here." />
            ) : (
            <div className="space-y-3">
              {myInterviews.map((item, idx) => {
                const confirmed = asArray(item.history).some((h: any) => String(h.by || '').toLowerCase() === userEmail.toLowerCase() && /confirm/i.test(String(h.reason || '')));
                const cancelEntry = asArray(item.history).find((h: any) => /cancel/i.test(String(h.to || '')));
                const app = myApplications.find((a) => a.id === item.applicationId);
                return (
                <div key={item.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-extrabold text-slate-900 text-sm">{item.round || item.roundName || 'Interview'}</div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-xs">{item.status || 'Scheduled'}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">ID {item.id} • Application {item.applicationId || '—'} • {item.jobTitle || ''} • {item.clientName || item.companyId || ''}</div>
                  <div className="text-xs text-slate-600 font-medium flex items-center gap-1"><Calendar size={13} /> {fmtDateTime(item.scheduledAt || item.date)}{item.timezone ? ` (${item.timezone})` : ''}{item.mode ? ` • ${item.mode}` : ''}</div>
                  <div className="text-xs text-slate-600 font-medium">
                    {safeMeetLink(item.meetLink) ? <span>Link: <a href={safeMeetLink(item.meetLink) as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">Join meeting</a></span> : item.venue ? <span>Venue: {item.venue}</span> : <span>No venue/link yet</span>}
                    {item.interviewer ? ` • Panel: ${item.interviewer}` : ''}
                  </div>
                  {(item.instructions || item.notes) && <div className="text-xs text-slate-600"><strong>Instructions:</strong> {item.instructions || item.notes}</div>}
                  <div className="text-xs font-bold">
                    Confirmation: {confirmed ? <span className="text-emerald-600">✓ Confirmed by you</span> : <span className="text-amber-600">Awaiting your confirmation</span>}
                  </div>
                  {cancelEntry?.reason && <div className="text-xs text-red-700 font-medium">Cancellation reason: {cancelEntry.reason}</div>}
                  {item.status === 'Completed' && <div className="text-xs text-slate-600">Outcome: shared via application stage{app ? <> (<button type="button" onClick={() => navigate(`/candidate/applications/${app.id}`)} className="text-blue-600 underline font-bold">{app.stage}</button>)</> : ''}.</div>}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {safeMeetLink(item.meetLink) && <a href={safeMeetLink(item.meetLink) as string} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"><Video size={14} /> Join Meeting Room</a>}
                    {['Scheduled', 'Rescheduled'].includes(item.status) && !confirmed && (
                      <button type="button" disabled={confirmBusy === item.id} onClick={async () => {
                        setConfirmBusy(item.id);
                        try {
                          const res = await interviewsApi.reschedule(item.id, { status: 'Scheduled', reason: 'Candidate confirmed attendance' });
                          const updated = (res as { data?: any })?.data;
                          setInterviews((prev) => prev.map((x) => (x.id === item.id ? updated || x : x)));
                        } catch (err) { console.warn('Confirm notice:', err); }
                        finally { setConfirmBusy(''); }
                      }} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer disabled:opacity-50">Confirm attendance</button>
                    )}
                    {item.id && ['Scheduled', 'Rescheduled'].includes(item.status) && (
                      <button type="button" onClick={() => { setReschedInterview(item.id); setReschedReason(''); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer">Request reschedule</button>
                    )}
                  </div>
                </div>
              ); })}
            </div>)}
          </div>
        )}

        {/* ============ SAVED (§7.5 — enriched, closed retained) ============ */}
        {currentTab === 'saved' && (
          <div className="space-y-4">
            {location.pathname.includes('liked-jobs') && (
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600">Liked jobs are merged into Save — one action powers shortlist and recommendations.</div>
            )}
            <div className={cardCls}>
              <h3 className="text-base font-extrabold text-slate-900">Saved Jobs</h3>
              <DataTable
                rows={savedJobsEnriched}
                keyOf={(s) => s.jobId}
                emptyTitle="Nothing saved"
                emptyMessage="Save jobs from the listings to build your shortlist."
                columns={[
                  { key: 'job', label: 'Job', render: (s) => (
                    <><div className="font-extrabold text-slate-900 text-sm">{s.job ? s.job.title : s.jobId}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{s.job ? `${s.job.companyName || ''} • ${s.job.location || ''}${s.job.industry ? ` • ${s.job.industry}` : ''}` : (s.jobMissing ? 'Posting unavailable (closed or removed) — retained in history' : 'Details unavailable')}</div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {s.closed && <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px]">Closed — retained in history</span>}
                      {s.applied && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Applied</span>}
                    </div></>
                  ) },
                  { key: 'actions', label: '', render: (s) => (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {s.job && <button type="button" onClick={() => navigate(`/candidate/jobs/${s.jobId}`)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">View</button>}
                      {!s.closed && !s.applied && s.job && <button type="button" onClick={() => handleApplyJob(s.jobId)} className="px-3 py-1.5 rounded-lg bg-[#087BFF] text-white font-bold text-[11px]">Apply</button>}
                      <button type="button" onClick={() => toggleSave(s.jobId)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">Remove</button>
                    </div>
                  ) },
                ]}
              />
            </div>
          </div>
        )}

        {/* ============ OFFERS & JOINING (§7 offers) ============ */}
        {currentTab === 'offers' && (
          <div className={cardCls}>
            <h3 className="text-base font-extrabold text-slate-900">Offers & Joining</h3>
            {offersLoading ? <InlineLoading message="Loading offers…" /> : offersMine.length > 0 ? (
              <div className="space-y-3">
                {offersMine.map((o) => (
                  <div key={o.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-extrabold text-slate-900 text-sm">{o.job?.title || 'Offer'} — {o.job?.companyName || ''}</div>
                      <span className={`px-3 py-1 rounded-full font-extrabold text-xs border ${o.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : o.status === 'Declined' ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-blue-50 text-[#087BFF] border-blue-200'}`}>{o.status || 'Issued'}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      CTC: <strong>{o.currency || 'INR'} {Number(o.ctc || 0).toLocaleString('en-IN')}</strong>
                      {o.joinDate ? ` • Joining: ${fmtDate(o.joinDate)}` : ''} • Issued {fmtDate(o.createdAt)}
                    </div>
                    {o.placement && <div className="text-xs text-emerald-700 font-bold">Joining recorded: {o.placement.status} • {fmtDate(o.placement.joinDate)}</div>}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {o.application?.id && <button type="button" onClick={() => navigate(`/candidate/applications/${o.application.id}`)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">Application →</button>}
                      {o.placement?.id && <button type="button" onClick={() => openLetter(o.placement.id)} disabled={letterLoading} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] disabled:opacity-50">View joining letter</button>}
                      {o.status === 'Issued' && (
                        <>
                          <button type="button" onClick={() => respondOffer(o.id, 'accepted')} disabled={respondBusy !== ''} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] disabled:opacity-50">Accept</button>
                          <button type="button" onClick={() => respondOffer(o.id, 'declined')} disabled={respondBusy !== ''} className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 font-bold text-[11px] disabled:opacity-50">Decline</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : offers.length === 0 ? (
              <EmptyState title="No offers yet" message="When an employer issues an offer, it appears here with CTC, joining date and letter." />
            ) : (
              <div className="space-y-3">
                {offers.map((o) => (
                  <button key={o.id} type="button" onClick={() => navigate(`/candidate/applications/${o.id}`)} className="w-full text-left p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300">
                    <div className="font-extrabold text-slate-900 text-sm">{o.jobTitle}</div>
                    <div className="text-xs text-slate-500 font-medium">{o.companyName || o.orgId || ''} • {o.stage} • Updated {fmtDateTime(o.updatedAt)}</div>
                  </button>
                ))}
              </div>
            )}
            {letter && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setLetter(null)}>
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-3 max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                  <h4 className="text-base font-extrabold text-slate-900">Joining Letter</h4>
                  <div className="text-xs space-y-1.5">
                    <div><strong>Candidate:</strong> {letter.candidate?.name} ({letter.candidate?.email})</div>
                    <div><strong>Role:</strong> {letter.job?.title} • {letter.job?.location} • {letter.job?.employmentType}</div>
                    <div><strong>Company:</strong> {letter.organization?.displayName || letter.organization?.legalName}</div>
                    {letter.offer && <div><strong>CTC:</strong> {letter.offer.currency} {Number(letter.offer.ctc || 0).toLocaleString('en-IN')} • <strong>Joining:</strong> {fmtDate(letter.offer.joinDate)} • <strong>Status:</strong> {letter.offer.status}</div>}
                    <div><strong>Terms:</strong> {letter.terms?.hiringType} • payment {letter.terms?.paymentTermsDays} days • replacement {letter.terms?.replacementDays} days{letter.terms?.rate != null ? ` • rate ${letter.terms.rate}%` : ''}</div>
                    <div className="text-slate-500">Generated {fmtDateTime(letter.generatedAt)} • Placement {letter.placement?.id}</div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => window.print()} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Print</button>
                    <button type="button" onClick={() => setLetter(null)} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === 'timesheets' && (
          <div className="space-y-2">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
              File monthly hours for your contract deployment here. Your employer verifies, then payroll + invoice + payout generate automatically and stay linked below.
            </div>
            <TimesheetsPanel />
          </div>
        )}
        {currentTab === 'messages' && <ChatPanel />}
        {currentTab === 'docs' && <DocumentsPanel />}
        {currentTab === 'privacy' && <ConsentPanel />}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

        {/* Reschedule modal */}
        {currentTab === 'interviews' && reschedInterview !== '' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setReschedInterview('')}>
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-base font-extrabold text-slate-900">Request reschedule</h4>
              <p className="text-xs text-slate-500">The employer sees your reason and picks a new slot.</p>
              <Field label="Reason for the employer *">
                <textarea rows={3} value={reschedReason} onChange={(e) => setReschedReason(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" placeholder="e.g. Medical appointment at that hour — any slot after Thursday works" />
              </Field>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setReschedInterview('')} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="button" disabled={!reschedReason.trim()} onClick={async () => {
                  try {
                    const res = await interviewsApi.reschedule(reschedInterview, { reason: reschedReason.trim() });
                    const updated = (res as { data?: any })?.data;
                    setInterviews((prev) => prev.map((x) => (x.id === reschedInterview ? updated || x : x)));
                    setReschedInterview('');
                  } catch (err) { console.warn('Reschedule notice:', err); }
                }} className="px-4 py-2.5 rounded-xl bg-spec-navy text-white font-bold text-xs disabled:opacity-50">Send request</button>
              </div>
            </div>
          </div>
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
function DetailRow({ label, value }: { label: string; value: unknown }) {
  if (!value || String(value).trim() === '') return null;
  return <div className="text-xs whitespace-pre-wrap"><strong>{label}:</strong> {String(value)}</div>;
}
function updArr(profile: any, setProfile: (v: any) => void, key: string, i: number, patch: any) {
  const rows = asArray(profile[key]).map((r: any, j: number) => (j === i ? { ...r, ...patch } : r));
  setProfile({ ...profile, [key]: rows });
}
function delArr(profile: any, setProfile: (v: any) => void, key: string, i: number) {
  setProfile({ ...profile, [key]: asArray(profile[key]).filter((_, j) => j !== i) });
}

/* ---------- onboarding wizard (§7.1: 9 sections, resumable) ---------- */
const OB_STEPS = ['Personal details', 'Headline & summary', 'Experience', 'Education', 'Skills & certifications', 'Projects & portfolio', 'Job preferences', 'Resume', 'Visibility & privacy'];

function OnboardingWizard({ profile, setProfile, hasProfile, onSaveSection, onFinish, saveError }: {
  profile: any; setProfile: (v: any) => void; hasProfile: boolean;
  onSaveSection: (step: number) => Promise<void>; onFinish: () => Promise<void>; saveError: string;
}) {
  const startAt = Math.min(Math.max(Number(profile?.onboarding?.step || 1), 1), 9);
  const [step, setStep] = useState(startAt);
  const [busy, setBusy] = useState(false);
  const go = async (next: number) => {
    setBusy(true);
    await onSaveSection(next);
    setStep(next);
    setBusy(false);
  };
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-slate-900">Candidate Onboarding</h3>
        <p className="text-xs text-slate-500">Progress saves automatically — leave and return anytime{hasProfile ? '' : ' (sign-in required to persist)'}.</p>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        {OB_STEPS.map((s, i) => (
          <button key={s} type="button" disabled={i + 1 > step} onClick={() => setStep(i + 1)} title={s}
            className={`h-2 flex-1 min-w-6 rounded-full ${i + 1 < step ? 'bg-emerald-500' : i + 1 === step ? 'bg-[#087BFF]' : 'bg-slate-200'}`} />
        ))}
      </div>
      <div className="text-xs font-bold text-slate-600">Step {step} of 9 — {OB_STEPS[step - 1]}</div>
      {saveError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">{saveError}</div>}

      <div className="text-xs space-y-4">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field2 label="Full name *"><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputCls} /></Field2>
            <Field2 label="Phone"><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputCls} /></Field2>
            <Field2 label="Location"><input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className={inputCls} /></Field2>
            <Field2 label="Country"><input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className={inputCls} /></Field2>
            <div className="sm:col-span-2"><Field2 label="Contact preferences"><input value={profile.contactPrefs} onChange={(e) => setProfile({ ...profile, contactPrefs: e.target.value })} className={inputCls} /></Field2></div>
          </div>
        )}
        {step === 2 && (
          <>
            <Field2 label="Professional headline"><input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} className={inputCls} /></Field2>
            <Field2 label="Professional summary"><textarea rows={3} value={profile.summary} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} className={inputCls} /></Field2>
            <Field2 label="Career objectives"><textarea rows={2} value={profile.objectives} onChange={(e) => setProfile({ ...profile, objectives: e.target.value })} className={inputCls} /></Field2>
          </>
        )}
        {step === 3 && (
          <>
            {asArray(profile.experiences).map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Field2 label="Employer"><input value={r.employer} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { employer: e.target.value })} className={inputCls} /></Field2>
                <Field2 label="Designation"><input value={r.designation} onChange={(e) => updArr(profile, setProfile, 'experiences', i, { designation: e.target.value })} className={inputCls} /></Field2>
                <div className="sm:col-span-2 flex justify-between items-center">
                  <span className="font-bold text-slate-600">{r.startDate || '?'} → {r.current ? 'Present' : r.endDate || '?'}</span>
                  <button type="button" onClick={() => delArr(profile, setProfile, 'experiences', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button>
                </div>
              </div>
            ))}
            <AddBtn onClick={() => setProfile({ ...profile, experiences: [...asArray(profile.experiences), { ...blankExp }] })} label="+ Add role" />
            <p className="text-slate-500 font-medium">Full responsibilities & achievements can be expanded later in Profile.</p>
          </>
        )}
        {step === 4 && (
          <>
            {asArray(profile.educations).map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Field2 label="Institution"><input value={r.institution} onChange={(e) => updArr(profile, setProfile, 'educations', i, { institution: e.target.value })} className={inputCls} /></Field2>
                <Field2 label="Qualification"><input value={r.qualification} onChange={(e) => updArr(profile, setProfile, 'educations', i, { qualification: e.target.value })} className={inputCls} /></Field2>
                <div className="sm:col-span-2 flex justify-end"><button type="button" onClick={() => delArr(profile, setProfile, 'educations', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button></div>
              </div>
            ))}
            <AddBtn onClick={() => setProfile({ ...profile, educations: [...asArray(profile.educations), { ...blankEdu }] })} label="+ Add education" />
          </>
        )}
        {step === 5 && (
          <>
            {asArray(profile.skillLevels).map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Field2 label="Skill"><input value={r.skill} onChange={(e) => updArr(profile, setProfile, 'skillLevels', i, { skill: e.target.value })} className={inputCls} /></Field2>
                <Field2 label="Level"><Select value={r.level} onChange={(v) => updArr(profile, setProfile, 'skillLevels', i, { level: v })} options={['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((v) => ({ value: v, label: v }))} /></Field2>
                <div className="flex items-end"><button type="button" onClick={() => delArr(profile, setProfile, 'skillLevels', i)} className="text-[11px] font-bold text-red-600 underline pb-3">Remove</button></div>
              </div>
            ))}
            <AddBtn onClick={() => setProfile({ ...profile, skillLevels: [...asArray(profile.skillLevels), { ...blankSkill }] })} label="+ Add skill" />
            <div className="pt-2 space-y-3">
              {asArray(profile.certList).map((r: any, i: number) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <Field2 label="Certification"><input value={r.name} onChange={(e) => updArr(profile, setProfile, 'certList', i, { name: e.target.value })} className={inputCls} /></Field2>
                  <Field2 label="Issuer"><input value={r.issuer} onChange={(e) => updArr(profile, setProfile, 'certList', i, { issuer: e.target.value })} className={inputCls} /></Field2>
                  <div className="sm:col-span-2 flex justify-end"><button type="button" onClick={() => delArr(profile, setProfile, 'certList', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button></div>
                </div>
              ))}
              <AddBtn onClick={() => setProfile({ ...profile, certList: [...asArray(profile.certList), { ...blankCert }] })} label="+ Add certification" />
            </div>
          </>
        )}
        {step === 6 && (
          <>
            {asArray(profile.projectList).map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Field2 label="Project"><input value={r.name} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { name: e.target.value })} className={inputCls} /></Field2>
                <Field2 label="Stack"><input value={r.stack} onChange={(e) => updArr(profile, setProfile, 'projectList', i, { stack: e.target.value })} className={inputCls} /></Field2>
                <div className="sm:col-span-2 flex justify-end"><button type="button" onClick={() => delArr(profile, setProfile, 'projectList', i)} className="text-[11px] font-bold text-red-600 underline">Remove</button></div>
              </div>
            ))}
            <AddBtn onClick={() => setProfile({ ...profile, projectList: [...asArray(profile.projectList), { ...blankProj }] })} label="+ Add project" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Field2 label="Portfolio URL"><input type="url" value={profile.portfolio} onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })} className={inputCls} /></Field2>
              <Field2 label="LinkedIn"><input type="url" value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} className={inputCls} /></Field2>
            </div>
          </>
        )}
        {step === 7 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field2 label="Preferred roles"><input value={profile.jobPreferences?.roles || ''} onChange={(e) => setProfile({ ...profile, jobPreferences: { ...profile.jobPreferences, roles: e.target.value } })} className={inputCls} /></Field2>
            <Field2 label="Preferred locations"><input value={profile.jobPreferences?.locations || ''} onChange={(e) => setProfile({ ...profile, jobPreferences: { ...profile.jobPreferences, locations: e.target.value } })} className={inputCls} /></Field2>
            <Field2 label="Employment types"><input value={profile.employmentTypes} onChange={(e) => setProfile({ ...profile, employmentTypes: e.target.value })} className={inputCls} /></Field2>
            <Field2 label="Work arrangement"><Select value={profile.workArrangement} onChange={(v) => setProfile({ ...profile, workArrangement: v })} placeholder="Select…" options={[{ value: 'remote', label: 'Remote' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'onsite', label: 'Onsite' }]} /></Field2>
            <Field2 label="Availability"><input value={profile.availability} onChange={(e) => setProfile({ ...profile, availability: e.target.value })} className={inputCls} /></Field2>
            <Field2 label="Expected compensation"><input value={profile.expectedCtc} onChange={(e) => setProfile({ ...profile, expectedCtc: e.target.value })} className={inputCls} /></Field2>
          </div>
        )}
        {step === 8 && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
            {profile.resumeRef ? `Resume linked: v${profile.resumeVersion || 1} • uploaded ${fmtDate(profile.resumeUploadedAt)}.` : 'No resume linked yet.'} Upload or replace it in <Link to="/candidate/docs" className="text-blue-600 underline font-bold">Documents</Link> — the latest resume links to your profile automatically.
          </div>
        )}
        {step === 9 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Profile visibility">
              <Select value={profile.visibility} onChange={(v) => setProfile({ ...profile, visibility: v })} options={[{ value: 'standard', label: 'Standard' }, { value: 'open', label: 'Open to offers' }, { value: 'private', label: 'Private' }, { value: 'anonymous', label: 'Anonymous search' }]} />
            </Field>
            <p className="text-slate-500 font-medium self-end">Fine-grained consent & communication preferences live under Privacy.</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <button type="button" disabled={step === 1 || busy} onClick={() => go(step - 1)} className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs disabled:opacity-50">Back</button>
        {step < 9 ? (
          <button type="button" disabled={busy} onClick={() => go(step + 1)} className="px-6 py-3 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50">{busy ? 'Saving…' : 'Save & Continue'}</button>
        ) : (
          <button type="button" disabled={busy} onClick={async () => { setBusy(true); await onSaveSection(9); await onFinish(); setBusy(false); }} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Finishing…' : 'Finish Onboarding'}</button>
        )}
      </div>
    </div>
  );
}
