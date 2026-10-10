import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { CheckCircle2, Search, Video, Save, Calendar, FileCheck, Award } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { applicationsApi, talentApi, jobsApi, interviewsApi, platformApi } from '../../shared/enterprise/phaseApi';
import { ChatPanel, SavedJobsPanel, NotificationsPanel, syncAll, ConfirmButton, DocumentsPanel, ConsentPanel } from '../common/EnterprisePanels';
import { Modal, Select, Field } from '../../shared/ui/EnterpriseKit';
import { getUserEmail } from '../../shared/auth/session';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const navItems = [
  { label: 'Career Dashboard', path: '/candidate' },
  { label: 'My Profile & CV', path: '/candidate/profile' },
  { label: 'Curated Jobs', path: '/candidate/jobs' },
  { label: 'Active Applications', path: '/candidate/applications' },
  { label: 'Upcoming Interviews', path: '/candidate/interviews' },
  { label: 'Saved Jobs', path: '/candidate/saved' },
  { label: 'Messages', path: '/candidate/messages' },
  { label: 'Documents', path: '/candidate/docs' },
  { label: 'Privacy', path: '/candidate/privacy' },
  { label: 'Documents & Offers', path: '/candidate/documents' },
  { label: 'Notifications', path: '/candidate/notifications' },
];

export function CandidatePortal() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/profile')) return 'profile';
    if (p.includes('/jobs')) return 'jobs';
    if (p.includes('/applications')) return 'applications';
    if (p.includes('/interviews')) return 'interviews';
    if (p.includes('/saved')) return 'saved';
    if (p.includes('/messages') || p.includes('/chat')) return 'messages';
    if (p.includes('/docs') || p.includes('/documents')) return 'docs';
    if (p.includes('/privacy') || p.includes('/settings')) return 'privacy';
    if (p.includes('/notifications')) return 'notifications';
    if (p.includes('/documents')) return 'documents';
    return 'dashboard';
  })();

  const userEmail = getUserEmail() || '';
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  // Candidate Profile State — full §7.3 field set; starts blank, hydrates from the API.
  const [profile, setProfile] = useState({
    name: '',
    email: userEmail,
    phone: '',
    headline: '',
    roleTitle: '',
    experienceYears: '' as unknown as number,
    location: '',
    country: '',
    contactPrefs: '',
    currentCtc: '',
    expectedCtc: '',
    payPeriod: 'annual',
    noticePeriod: '',
    skills: '',
    summary: '',
    objectives: '',
    education: '',
    certifications: '',
    projects: '',
    availability: '',
    employmentTypes: '',
    workArrangement: '',
    portfolio: '',
    linkedin: '',
    resumeRef: '',
    visibility: 'standard',
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [jRes, iRes, pRes, aRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/jobs').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/interviews').catch(() => ({ data: [] as any[] })),
          userEmail
            ? apiClient.get<any>(`/api/v1/candidate/profile?email=${encodeURIComponent(userEmail)}`).catch(() => null)
            : Promise.resolve(null),
          userEmail
            ? apiClient.get<any[]>(`/api/v1/candidate/applications?email=${encodeURIComponent(userEmail)}`).catch(() => ({ data: [] as any[] }))
            : Promise.resolve({ data: [] as any[] }),
        ]);
        if (jRes?.data) setJobs(jRes.data);
        if (iRes?.data) setInterviews(iRes.data);
        const saved = (pRes as { data?: any })?.data;
        if (saved?.email) {
          setProfile((prev) => ({ ...prev, ...saved }));
          setHasProfile(true);
        }
        if (aRes?.data) setMyApplications(aRes.data);
      } catch (err) {
        console.warn('API Error in CandidatePortal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userEmail]);

  const appliedJobIds = myApplications.map((a) => a.jobId);

  // Saved jobs (unique per candidate+job) + job detail modal
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reschedInterview, setReschedInterview] = useState('');
  const [reschedReason, setReschedReason] = useState('');
  const [detailJob, setDetailJob] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await talentApi.saved();
        const rows = ((res as { data?: any[] })?.data || []) as any[];
        setSavedIds(rows.map((s) => s.jobId));
      } catch { /* saved list is best-effort */ }
      try {
        const nres = await platformApi.notifications();
        const nrows = ((nres as { data?: any[] })?.data || []) as any[];
        setUnreadCount(nrows.filter((n) => n.status !== 'read').length);
      } catch { /* notifications best-effort */ }
    })();
  }, []);

  const toggleSave = async (jobId: string) => {
    try {
      if (savedIds.includes(jobId)) {
        await talentApi.unsave(jobId);
        setSavedIds((x) => x.filter((id) => id !== jobId));
      } else {
        await talentApi.save(jobId);
        setSavedIds((x) => [jobId, ...x]);
      }
      syncAll();
    } catch (err) {
      console.warn('Save job notice:', err);
    }
  };

  const openDetail = async (jobId: string) => {
    setDetailLoading(true);
    try {
      const res = await jobsApi.detail(jobId);
      setDetailJob((res as { data?: any })?.data || null);
    } catch {
      setDetailJob(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    try {
      const res = await apiClient.put<any>('/api/v1/candidate/profile', { ...profile, email: profile.email || userEmail });
      if ((res as { data?: any })?.data) {
        setProfile((prev) => ({ ...prev, ...(res as { data: any }).data }));
      }
      setHasProfile(true);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Could not save profile. Try again.');
    }
  };

  const handleApplyJob = async (jobId: string) => {
    const email = profile.email || userEmail;
    if (!email || appliedJobIds.includes(jobId)) return;
    try {
      // Enterprise API: unique application per job+candidate, expiry-checked server-side.
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

  // Only interviews addressed to this candidate (by name or email) belong here.
  const myInterviews = interviews.filter((item) => {
    if (item.candidateEmail && userEmail) {
      return String(item.candidateEmail).toLowerCase() === userEmail.toLowerCase();
    }
    if (item.candidateName && profile.name) {
      return item.candidateName === profile.name;
    }
    return false;
  });

  // Profile completeness drives the match score — never a hardcoded 96%.
  const profileFields = [profile.name, profile.email, profile.phone, profile.headline, profile.roleTitle, profile.experienceYears, profile.location, profile.country, profile.currentCtc, profile.expectedCtc, profile.noticePeriod, profile.skills, profile.summary, profile.education, profile.availability];
  const matchScore = Math.round((profileFields.filter((f) => String(f || '').trim() !== '').length / profileFields.length) * 100);

  return (
    <PortalShell portalTitle="Candidate Career Hub" portalRole="candidate" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'dashboard' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <CheckCircle2 size={14} /> {hasProfile ? `Profile ${matchScore}% complete` : 'Complete your profile to get matched'}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome{profile.name ? `, ${profile.name.split(' ')[0]}` : ''} to Your NexaTalent Career Hub
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Track active application stages, update technical skills, schedule client interviews, and manage offer letters.
            </p>
          </div>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/candidate' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* TAB 1: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {!hasProfile && !isLoading && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between gap-3">
                <span>Your profile is empty. Complete it to get matched to jobs.</span>
                <button
                  type="button"
                  onClick={() => navigate('/candidate/profile')}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold shrink-0"
                >
                  Complete Profile
                </button>
              </div>
            )}
            {isLoading ? (
              <InlineLoading message="Loading your career data…" />
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Applications</div>
                <div className="text-3xl font-extrabold text-slate-900">{myApplications.length} Positions</div>
                <div className="text-xs font-bold text-[#087BFF]">
                  {myApplications.length === 0 ? 'No applications yet' : `${myApplications.length} Under Client Review`}
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interviews Scheduled</div>
                <div className="text-3xl font-extrabold text-slate-900">{myInterviews.length} Scheduled</div>
                <div className="text-xs font-bold text-emerald-600">
                   {myInterviews.length === 0 ? 'None scheduled yet' : `Next: ${myInterviews[0].date || myInterviews[0].scheduledAt || ''}`}
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Match Score</div>
                <div className="text-3xl font-extrabold text-slate-900">{matchScore}% Complete</div>
                <div className="text-xs font-bold text-emerald-600">Complete all sections for better matches</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Jobs</div>
                <div className="text-3xl font-extrabold text-slate-900">{savedIds.length} Saved</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unread Notifications</div>
                <div className="text-3xl font-extrabold text-slate-900">{unreadCount} New</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Visibility</div>
                <div className="text-3xl font-extrabold text-slate-900 capitalize">{profile.visibility || 'Standard'}</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Your Active Applications Status</h3>
              {myApplications.length === 0 ? (
                <EmptyState
                  title="No applications yet"
                  message="Browse curated jobs and apply in one click. Your applications will appear here."
                />
              ) : (
              <div className="space-y-3">
                {myApplications.map((app) => (
                  <div key={app.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{app.jobTitle}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{app.companyName} • Current Stage: <strong className="text-blue-600">{app.stage}</strong></div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-bold text-xs">
                      {app.stage}
                    </span>
                  </div>
                ))}
              </div>
              )}
            </div>
            </>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & CV */}
        {currentTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Candidate Technical Profile & Resume CV</h3>
                <p className="text-xs text-slate-500">Update experience, expected CTC, notice period, and core skillsets.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs">
                {matchScore}% Match {hasProfile ? 'Verified' : '— Incomplete'}
              </span>
            </div>

            {savedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Technical Profile successfully updated and synced with ATS!
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
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Email *</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Role Title *</label>
                  <input
                    type="text"
                    required
                    value={profile.roleTitle}
                    onChange={(e) => setProfile({ ...profile, roleTitle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notice Period *</label>
                  <input
                    type="text"
                    required
                    value={profile.noticePeriod}
                    onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Annual CTC *</label>
                  <input
                    type="text"
                    required
                    value={profile.currentCtc}
                    onChange={(e) => setProfile({ ...profile, currentCtc: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Annual CTC *</label>
                  <input
                    type="text"
                    required
                    value={profile.expectedCtc}
                    onChange={(e) => setProfile({ ...profile, expectedCtc: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Technical Skills *</label>
                <input
                  type="text"
                  required
                  value={profile.skills}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resume Executive Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={profile.summary}
                  onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    placeholder="e.g. Senior Fullstack Architect · React/Node"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="City, State"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (years)</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={profile.experienceYears}
                    onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value as unknown as number })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Education</label>
                  <input
                    type="text"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    placeholder="Institution — Qualification, Year"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Certifications</label>
                  <input
                    type="text"
                    value={profile.certifications}
                    onChange={(e) => setProfile({ ...profile, certifications: e.target.value })}
                    placeholder="Name — Issuer, Year"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Career Objectives</label>
                <textarea
                  rows={2}
                  value={profile.objectives}
                  onChange={(e) => setProfile({ ...profile, objectives: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Availability</label>
                  <input
                    type="text"
                    value={profile.availability}
                    onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                    placeholder="e.g. Immediate / 30 days"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Employment</label>
                  <input
                    type="text"
                    value={profile.employmentTypes}
                    onChange={(e) => setProfile({ ...profile, employmentTypes: e.target.value })}
                    placeholder="Full-time / Contract"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Arrangement</label>
                  <Select
                    value={profile.workArrangement}
                    onChange={(v) => setProfile({ ...profile, workArrangement: v })}
                    placeholder="Select…"
                    options={[
                      { value: 'remote', label: 'Remote' },
                      { value: 'hybrid', label: 'Hybrid' },
                      { value: 'onsite', label: 'Onsite' },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    value={profile.portfolio}
                    onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Profile Visibility</label>
                  <Select
                    value={profile.visibility}
                    onChange={(v) => setProfile({ ...profile, visibility: v })}
                    options={[
                      { value: 'standard', label: 'Standard' },
                      { value: 'open', label: 'Open to offers' },
                      { value: 'private', label: 'Private' },
                      { value: 'anonymous', label: 'Anonymous search' },
                    ]}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
              >
                <Save size={15} /> Save Technical Profile
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CURATED JOBS */}
        {currentTab === 'jobs' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900">AI-Matched Technical Job Opportunities</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none w-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              {jobs
                .filter(j => String(j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(j.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()))
                .map((job, idx) => {
                  const isApplied = appliedJobIds.includes(job.id);
                  const isSaved = savedIds.includes(job.id);
                  return (
                    <div key={job.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          Company: <strong>{job.companyName}</strong> • Budget: {job.budgetRange || (job.salaryMin ? `₹${job.salaryMin}–₹${job.salaryMax}` : '—')} • Location: {job.location} • {job.employmentType || ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openDetail(job.id)}
                          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => toggleSave(job.id)}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer ${isSaved ? 'bg-amber-100 text-amber-800' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                        >
                          {isSaved ? '★ Saved' : '☆ Save'}
                        </button>
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          disabled={isApplied}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : 'bg-[#087BFF] hover:bg-blue-600 text-white shadow-md'
                          }`}
                        >
                          {isApplied ? '✓ Application Submitted' : '1-Click Direct Apply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Job detail modal */}
            {(detailJob || detailLoading) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setDetailJob(null)}>
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  {detailLoading ? (
                    <InlineLoading message="Loading job details…" />
                  ) : detailJob ? (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-extrabold text-slate-900">{detailJob.title}</h4>
                          <div className="text-xs text-slate-500 font-medium">{detailJob.companyName} • {detailJob.location} • {detailJob.employmentType} • {detailJob.workArrangement || ''}</div>
                        </div>
                        <button onClick={() => setDetailJob(null)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">Close</button>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap">{detailJob.description || 'No description provided.'}</p>
                      {(detailJob.requiredSkills || detailJob.preferredSkills) && (
                        <div className="text-xs"><strong>Skills:</strong> {[detailJob.requiredSkills, detailJob.preferredSkills].filter(Boolean).join(' • ')}</div>
                      )}
                      {(detailJob.qualifications) && (
                        <div className="text-xs"><strong>Qualifications:</strong> {detailJob.qualifications}</div>
                      )}
                      <div className="text-xs font-bold text-slate-600">
                        Compensation: {detailJob.salaryMin ? `₹${detailJob.salaryMin}–₹${detailJob.salaryMax}` : (detailJob.budgetRange || 'Undisclosed')} • {detailJob.salaryDisclosure || ''}
                      </div>
                      <div className={detailJob.acceptingApplications ? 'text-xs font-bold text-emerald-600' : 'text-xs font-bold text-red-600'}>
                        {detailJob.acceptingApplications ? 'Accepting applications' : 'Not accepting applications'}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleSave(detailJob.id)}
                          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                        >
                          {savedIds.includes(detailJob.id) ? '★ Saved' : '☆ Save'}
                        </button>
                        <button
                          onClick={() => { handleApplyJob(detailJob.id); }}
                          disabled={appliedJobIds.includes(detailJob.id)}
                          className="px-5 py-2.5 rounded-xl bg-[#087BFF] text-white font-bold text-xs cursor-pointer disabled:bg-emerald-100 disabled:text-emerald-800"
                        >
                          {appliedJobIds.includes(detailJob.id) ? '✓ Application Submitted' : '1-Click Direct Apply'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <EmptyState title="Job not found" message="This posting may have been closed." />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACTIVE APPLICATIONS */}
        {currentTab === 'applications' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Active Job Application Stages</h3>
            {myApplications.length === 0 ? (
              <EmptyState
                title="No applications yet"
                message="Your job applications and their live ATS stages will appear here."
              />
            ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div key={app.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{app.jobTitle}</div>
                      <div className="text-xs text-slate-500 font-medium">{app.companyName} • Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-extrabold text-xs">
                        {app.stage}
                      </span>
                      {!['Hired', 'Withdrawn', 'Rejected', 'Job Closed'].includes(app.stage) && (
                        <ConfirmButton
                          label="Withdraw"
                          confirmLabel="Confirm withdraw?"
                          className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[11px] cursor-pointer"
                          onConfirm={async () => {
                            try {
                              const res = await applicationsApi.withdraw(app.id);
                              const updated = (res as { data?: any })?.data;
                              setMyApplications((prev) => prev.map((a) => (a.id === app.id ? updated || { ...a, stage: 'Withdrawn' } : a)));
                            } catch (err) {
                              console.warn('Withdraw notice:', err);
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-slate-200">
                    <span className="text-emerald-600">✓ Applied</span>
                    <span className={['Ops Vetted', 'Tech Round', 'Executive Round', 'Offer Issued', 'Hired'].includes(app.stage) ? 'text-emerald-600' : 'text-slate-400'}>Ops Vetted</span>
                    <span className={['Tech Round', 'Executive Round', 'Offer Issued', 'Hired'].includes(app.stage) ? 'text-emerald-600' : 'text-slate-400'}>Technical Eval</span>
                    <span className={['Offer Issued', 'Hired'].includes(app.stage) ? 'text-emerald-600' : 'text-slate-400'}>Offer Letter</span>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 5: UPCOMING INTERVIEWS */}
        {currentTab === 'interviews' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Upcoming Client Interview Schedule</h3>
            {myInterviews.length === 0 ? (
              <EmptyState
                title="No interviews scheduled"
                message="When an employer shortlists you, your interview schedule will appear here."
              />
            ) : (
            <div className="space-y-3">
              {myInterviews.map((item, idx) => (
                <div key={item.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-sm">{item.round || item.roundName}</div>
                    <div className="text-xs text-slate-600 font-medium">Role: {item.jobTitle} • Client: {item.clientName}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {item.mode ? `${item.mode} • ` : ''}{item.timezone || ''} {item.interviewer ? `• Panel: ${item.interviewer}` : ''} {item.status ? `• ${item.status}` : ''}
                    </div>
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 pt-1">
                      <Calendar size={13} /> {item.scheduledAt || item.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.meetLink && (
                      <a
                        href={item.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Video size={14} /> Join Meeting Room
                      </a>
                    )}
                    {item.id && ['Scheduled', 'Rescheduled'].includes(item.status) && (
                      <button
                        type="button"
                        onClick={() => { setReschedInterview(item.id); setReschedReason(''); }}
                        className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Request reschedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB: SAVED JOBS */}
        {currentTab === 'saved' && <SavedJobsPanel />}

        {/* TAB: MESSAGES (interview-gated chat) */}
        {currentTab === 'messages' && <ChatPanel />}

        {/* TAB: DOCUMENTS */}
        {currentTab === 'docs' && <DocumentsPanel />}

        {/* TAB: PRIVACY */}
        {currentTab === 'privacy' && <ConsentPanel />}

        {/* TAB: NOTIFICATIONS */}
        {currentTab === 'notifications' && <NotificationsPanel />}

        {/* Reschedule request modal */}
        <Modal open={reschedInterview !== ''} onClose={() => setReschedInterview('')} title="Request reschedule" subtitle="The employer sees your reason and picks a new slot">
          <div className="space-y-3">
            <Field label="Reason for the employer *">
              <textarea rows={3} value={reschedReason} onChange={(e) => setReschedReason(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" placeholder="e.g. Medical appointment at that hour — any slot after Thursday works" />
            </Field>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setReschedInterview('')} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
              <button
                type="button"
                disabled={!reschedReason.trim()}
                onClick={async () => {
                  try {
                    const res = await interviewsApi.reschedule(reschedInterview, { reason: reschedReason.trim() });
                    const updated = (res as { data?: any })?.data;
                    setInterviews((prev) => prev.map((x) => (x.id === reschedInterview ? updated || x : x)));
                    setReschedInterview('');
                  } catch (err) {
                    console.warn('Reschedule notice:', err);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-spec-navy text-white font-bold text-xs disabled:opacity-50"
              >
                Send request
              </button>
            </div>
          </div>
        </Modal>

        {/* TAB 6: DOCUMENTS & OFFERS */}
        {currentTab === 'documents' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Verified Candidate Documents & Formal Offer Letters</h3>
              <p className="text-xs text-slate-500">Access pre-cleared BGV credentials and legal offer letters.</p>
            </div>

            {(() => {
              const offers = myApplications.filter((a) => ['Offer Issued', 'Hired'].includes(a.stage));
              if (offers.length === 0) {
                return (
                  <EmptyState
                    title={hasProfile ? 'No offers yet' : 'No documents yet'}
                    message={
                      hasProfile
                        ? 'When an employer issues an offer letter, it will appear here with your BGV credentials.'
                        : 'Complete your profile and apply to jobs. Offers and verified documents will appear here.'
                    }
                  />
                );
              }
              return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <FileCheck size={20} className="text-emerald-600" />
                  <div className="font-extrabold text-slate-900 text-sm">Identity & Background Documents</div>
                  <div className="text-slate-500 font-medium">{hasProfile ? 'Profile on file' : 'Pending profile completion'}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">{hasProfile ? 'On file' : 'Pending'}</span>
              </div>

              {offers.map((offer) => (
              <div key={offer.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <Award size={20} className="text-[#087BFF]" />
                  <div className="font-extrabold text-slate-900 text-sm">Formal Employment Offer Letter</div>
                  <div className="text-slate-500 font-medium">{offer.companyName} • {offer.jobTitle}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {offer.stage}
                </span>
              </div>
              ))}
            </div>
              );
            })()}
          </div>
        )}

      </div>
    </PortalShell>
  );
}
