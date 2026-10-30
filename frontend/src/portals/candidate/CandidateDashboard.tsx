import {
  Briefcase,
  Calendar,
  Sparkles,
  Clock,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  FileText,
  ShieldCheck,
  Bookmark,
  ChevronRight,
  Award,
  Zap,
  AlertCircle,
  Video,
  Download,
  Flame,
  Compass,
  Bell,
  History,
} from 'lucide-react';

export interface CandidateDashboardProps {
  profile: any;
  matchScore: number;
  onboardingDone: boolean;
  myApplications: any[];
  interviews: any[];
  recommended: Array<{ job: any; match: number }>;
  recentJobs: Array<{ id: string; title: string; at: string; job?: any }>;
  savedIds: string[];
  updates: any[];
  unreadCount: number;
  notifPreview?: any[];
  toggleSave: (jobId: string) => Promise<void>;
  navigate: (path: string) => void;
  fmtDate: (val: any) => string;
  fmtDateTime: (val: any) => string;
  safeMeetLink: (url: string) => string | null;
}

export function CandidateDashboard({
  profile,
  matchScore,
  onboardingDone,
  myApplications,
  interviews,
  recommended,
  recentJobs,
  savedIds,
  updates,
  unreadCount,
  notifPreview = [],
  toggleSave,
  navigate,
  fmtDate,
  fmtDateTime,
  safeMeetLink,
}: CandidateDashboardProps) {
  // Extract candidate data
  const candidateName = profile?.name || profile?.email?.split('@')[0] || 'Candidate';
  const headline = profile?.headline || profile?.roleTitle || 'Tech Professional';
  const location = profile?.location || profile?.country || 'Remote / Worldwide';
  const targetRole = profile?.jobPreferences?.roles || profile?.roleTitle || 'Open to Opportunities';
  const workMode = profile?.workArrangement || profile?.jobPreferences?.workArrangement || 'Remote / Hybrid';
  const expectedCtc = profile?.expectedCtc || profile?.jobPreferences?.expectedCtc || 'Competitive';
  const noticePeriod = profile?.noticePeriod || profile?.jobPreferences?.availability || 'Immediate / 30 Days';

  // Compute application stage breakdown
  const inReviewApps = myApplications.filter(
    (a) => !['Interview', 'Interviewing', 'Offer Issued', 'Offer', 'Selected', 'Hired', 'Rejected', 'Withdrawn'].includes(a.stage)
  );
  const interviewApps = myApplications.filter((a) =>
    ['Interview', 'Interviewing', 'Technical Round', 'Client Interview', 'Assessment'].includes(a.stage)
  );
  const offerApps = myApplications.filter((a) =>
    ['Offer Issued', 'Offer', 'Selected', 'Hired'].includes(a.stage)
  );

  // Filter scheduled interviews
  const upcomingInterviews = interviews.filter((i) =>
    ['Scheduled', 'Rescheduled', 'Confirmed'].includes(i.status)
  );
  const nextInterview = upcomingInterviews.length > 0 ? upcomingInterviews[0] : null;

  // Pipeline stages
  const pipelineStages = [
    { label: 'Applied', count: myApplications.length, color: 'bg-blue-500' },
    { label: 'Shortlisted', count: inReviewApps.length, color: 'bg-indigo-500' },
    { label: 'Interviewing', count: interviewApps.length, color: 'bg-amber-500' },
    { label: 'Offer / Placement', count: offerApps.length, color: 'bg-emerald-500' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Onboarding Incomplete Alert Banner */}
      {!onboardingDone && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border border-amber-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-950">
                Your Candidate Profile is not fully activated
              </h4>
              <p className="text-xs text-amber-800/90 font-medium mt-0.5">
                Complete your 9-step verified profile to unlock AI matching with verified hiring companies.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/candidate/onboarding')}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Finish Onboarding</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Hero Welcome & Candidate Readiness Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl shadow-slate-900/10 border border-slate-700/50">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Identity & Bio */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#087BFF] to-indigo-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-white/20">
                {getInitials(candidateName) || 'NX'}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center"
                title="Active Candidate Profile"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {candidateName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>Open to Work</span>
                </span>
                {profile?.resumeRef && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>CV Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl line-clamp-1">
                {headline}
              </p>

              {/* Status Chips */}
              <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] text-slate-300">
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <MapPin size={12} className="text-blue-400" />
                  <span>{location}</span>
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Briefcase size={12} className="text-indigo-400" />
                  <span className="truncate max-w-[150px]">{targetRole}</span>
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Clock size={12} className="text-amber-400" />
                  <span>{workMode}</span>
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <DollarSign size={12} className="text-emerald-400" />
                  <span>{expectedCtc}</span>
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Clock size={12} className="text-sky-300" />
                  <span>Notice: {noticePeriod}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Profile Strength & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Profile Strength
                </div>
                <div className="text-lg font-black text-white">{matchScore}% Complete</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-400"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% ${matchScore}%, 0 ${matchScore}%)`,
                  }}
                />
                <span className="text-[11px] font-black text-white">{matchScore}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/candidate/jobs')}
                className="px-4 py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Compass size={14} />
                <span>Explore Jobs</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/candidate/profile')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Career KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Applications */}
        <button
          type="button"
          onClick={() => navigate('/candidate/applications')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400/80 transition text-left group cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Applications
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#087BFF] flex items-center justify-center group-hover:scale-105 transition">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{myApplications.length}</div>
          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-500">
            <span className="text-blue-600 font-bold">{inReviewApps.length} in review</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{interviewApps.length} interview</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#087BFF]">
            <span>View pipeline</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
          </div>
        </button>

        {/* Metric 2: Interviews */}
        <button
          type="button"
          onClick={() => navigate('/candidate/interviews')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400/80 transition text-left group cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Interviews
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{upcomingInterviews.length}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500 truncate">
            {nextInterview ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Video size={12} />
                <span>Next: {nextInterview.companyName || 'Scheduled'}</span>
              </span>
            ) : (
              <span>None scheduled today</span>
            )}
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Interview Schedule</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
          </div>
        </button>

        {/* Metric 3: AI Matched Jobs */}
        <button
          type="button"
          onClick={() => navigate('/candidate/jobs')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-400/80 transition text-left group cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Curated Matches
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <Flame size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{recommended.length}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-indigo-700 font-bold">
            <Sparkles size={12} />
            <span>
              {recommended.length > 0 ? `Top match: ${recommended[0].match}%` : 'Matches your skills'}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>Browse matches</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
          </div>
        </button>

        {/* Metric 4: Offers & Saved */}
        <button
          type="button"
          onClick={() => navigate(offerApps.length > 0 ? '/candidate/offers' : '/candidate/saved')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-400/80 transition text-left group cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Offers & Saved
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <Award size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {offerApps.length > 0 ? `${offerApps.length} Offer` : savedIds.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-500">
            <span className="text-emerald-700 font-bold">{offerApps.length} received</span>
            <span>•</span>
            <span>{savedIds.length} bookmarked</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>{offerApps.length > 0 ? 'Review offers' : 'Saved roles'}</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
          </div>
        </button>
      </div>

      {/* Pipeline Stage Visual Progress */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Zap size={16} className="text-[#087BFF]" />
              <span>Application Journey Pipeline</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Live status tracking across all verified hiring stages
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/candidate/applications')}
            className="text-xs font-bold text-[#087BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Applications</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {pipelineStages.map((stage) => (
            <div
              key={stage.label}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
            >
              <div>
                <div className="text-[11px] font-bold text-slate-500">{stage.label}</div>
                <div className="text-lg font-black text-slate-900">{stage.count}</div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recommended Jobs & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Curated Job Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#087BFF] flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    AI Matched Jobs For You
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Prioritized based on your verified tech stack & preferences
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/candidate/jobs')}
                className="text-xs font-bold text-[#087BFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all ({recommended.length})</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {recommended.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Compass size={32} className="mx-auto text-slate-300" />
                <h4 className="text-xs font-bold text-slate-700">No match results yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add more skills and experience to your profile to let our matching algorithm connect you with top openings.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/candidate/profile')}
                  className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Update Skills
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recommended.slice(0, 4).map(({ job, match }) => {
                  const isSaved = savedIds.includes(job.id);
                  const isApplied = myApplications.some((a) => a.jobId === job.id);

                  return (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                            className="font-extrabold text-slate-900 text-sm hover:text-[#087BFF] transition text-left cursor-pointer truncate"
                          >
                            {job.title}
                          </button>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold shrink-0">
                            {match > 0 ? `${match}% Match` : 'Skill Fit'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Building2 size={12} className="text-slate-400" />
                            <span>{job.companyName || 'Confidential Employer'}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            <span>{job.location || 'Remote'}</span>
                          </span>
                          {job.salaryRange && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold">{job.salaryRange}</span>
                            </>
                          )}
                        </div>

                        {job.requiredSkills && (
                          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                            {String(job.requiredSkills)
                              .split(',')
                              .slice(0, 3)
                              .map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600"
                                >
                                  {s.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => toggleSave(job.id)}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            isSaved
                              ? 'bg-blue-50 border-blue-200 text-[#087BFF]'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title={isSaved ? 'Remove Bookmark' : 'Save Job'}
                        >
                          <Bookmark size={14} className={isSaved ? 'fill-[#087BFF]' : ''} />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                            isApplied
                              ? 'bg-slate-200 text-slate-600 cursor-default'
                              : 'bg-slate-900 hover:bg-[#087BFF] text-white shadow-xs'
                          }`}
                        >
                          {isApplied ? 'Applied' : 'Apply Now'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Applications Quick Peek */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Recent Applications
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tracking employer reviews and live progression
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/candidate/applications')}
                className="text-xs font-bold text-[#087BFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all ({myApplications.length})</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {myApplications.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs font-medium">
                You haven't submitted any applications yet. Explore matched jobs above to get started.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myApplications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {app.jobTitle || 'Role'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {app.companyName || 'Company'} • Applied {fmtDate(app.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-[10px]">
                        {app.stage || 'In Review'}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/candidate/applications/${app.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Schedule, Resume Hub, Notifications & Updates */}
        <div className="space-y-4">
          {/* Notifications Quick Bar */}
          <button
            type="button"
            onClick={() => navigate('/candidate/notifications')}
            className="w-full p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#087BFF] flex items-center justify-center">
                <Bell size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Notifications</h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {notifPreview.length > 0 ? notifPreview[0].body?.slice(0, 35) + '...' : 'System & recruiter updates'}
                </p>
              </div>
            </div>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-[#087BFF] text-white font-black text-[10px]">
                {unreadCount} New
              </span>
            ) : (
              <ChevronRight size={14} className="text-slate-400" />
            )}
          </button>

          {/* Upcoming Interview Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Video size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Next Interview</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Meeting schedule</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/candidate/interviews')}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Schedule
              </button>
            </div>

            {nextInterview ? (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">
                      {nextInterview.title || 'Technical Interview'}
                    </h5>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {nextInterview.companyName}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px]">
                    {nextInterview.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Clock size={13} className="text-amber-600" />
                  <span>{fmtDateTime(nextInterview.scheduledAt)}</span>
                </div>

                {nextInterview.meetingLink && safeMeetLink(nextInterview.meetingLink) && (
                  <a
                    href={safeMeetLink(nextInterview.meetingLink) || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Video size={13} />
                    <span>Join Video Meeting</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center py-5 space-y-1">
                <Calendar size={24} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">No interviews today</p>
                <p className="text-[11px] text-slate-500">
                  When recruiters schedule calls, meeting links will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Resume & Documents Hub */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Resume & CV</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Stored in Azure Blob</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/candidate/docs')}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Manage
              </button>
            </div>

            {profile?.resumeRef ? (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-xs text-slate-800 truncate">
                      Candidate Resume v{profile.resumeVersion || 1}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Uploaded {fmtDate(profile.resumeUploadedAt || new Date().toISOString())}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`/api/v1/documents/${profile.resumeRef}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate('/candidate/docs')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition"
                  >
                    <span>Replace</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                <AlertCircle size={18} className="mx-auto text-amber-600" />
                <p className="text-xs font-bold text-amber-900">No resume attached</p>
                <button
                  type="button"
                  onClick={() => navigate('/candidate/docs')}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs"
                >
                  Upload CV Now
                </button>
              </div>
            )}
          </div>

          {/* Recently Viewed Jobs */}
          {recentJobs.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <History size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Recently Viewed</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Browsing history</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/candidate/jobs')}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  All
                </button>
              </div>
              <div className="space-y-1.5">
                {recentJobs.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => navigate(`/candidate/jobs/${r.id}`)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition text-xs flex items-center justify-between text-slate-700 font-semibold truncate group"
                  >
                    <span className="truncate group-hover:text-[#087BFF] transition">{r.title}</span>
                    <ChevronRight size={13} className="text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Real-Time Application Timeline Updates */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Activity Timeline</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Stage audit log</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Live</span>
            </div>

            {updates.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400 font-medium">
                No recent activity. Stage transitions will log here.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {updates.slice(0, 4).map((u, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => navigate(`/candidate/applications/${u.appId}`)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 text-xs transition"
                  >
                    <div className="font-extrabold text-slate-800 truncate">{u.jobTitle}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span>{u.from}</span> →{' '}
                      <span className="font-bold text-[#087BFF]">{u.to}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {fmtDate(u.createdAt)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
