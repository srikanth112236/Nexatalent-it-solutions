import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Building2, Calendar, Search, ChevronRight, 
  MessageSquare, Video, 
  Sparkles, X
} from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  orgId?: string;
  companyName?: string;
  stage: string;
  stageReason?: string;
  source?: string;
  createdAt: string;
  appliedAt?: string;
  updatedAt?: string;
  nextInterview?: {
    id?: string;
    round?: string;
    scheduledAt?: string;
    mode?: string;
    meetingLink?: string;
  } | null;
  job?: {
    title?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    workArrangement?: string;
    employmentType?: string;
  } | null;
}

interface CandidateApplicationsViewProps {
  applications: Application[];
  loading?: boolean;
  onNavigate: (path: string) => void;
  onWithdraw?: (appId: string) => void;
}

const STAGE_ORDER = ['Applied', 'Screening', 'Interview Scheduled', 'Offer', 'Hired'];

export const CandidateApplicationsView: React.FC<CandidateApplicationsViewProps> = ({
  applications,
  loading = false,
  onNavigate,
  onWithdraw: _onWithdraw,
}) => {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'interview' | 'review' | 'offer' | 'closed'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase().trim();
      const matchSearch = 
        !q || 
        app.jobTitle?.toLowerCase().includes(q) || 
        app.companyName?.toLowerCase().includes(q) || 
        app.id.toLowerCase().includes(q) ||
        app.stage?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedFilter === 'interview') {
        return /interview/i.test(app.stage) || !!app.nextInterview;
      }
      if (selectedFilter === 'offer') {
        return /offer|selected|hired/i.test(app.stage);
      }
      if (selectedFilter === 'review') {
        return /applied|screening|review|shortlist/i.test(app.stage) && !/interview/i.test(app.stage);
      }
      if (selectedFilter === 'closed') {
        return /rejected|withdrawn|closed/i.test(app.stage);
      }
      return true;
    });
  }, [applications, search, selectedFilter]);

  const counts = useMemo(() => {
    const total = applications.length;
    const interview = applications.filter((a) => /interview/i.test(a.stage) || !!a.nextInterview).length;
    const review = applications.filter((a) => /applied|screening|review|shortlist/i.test(a.stage) && !/interview/i.test(a.stage)).length;
    const offer = applications.filter((a) => /offer|selected|hired/i.test(a.stage)).length;
    return { total, interview, review, offer };
  }, [applications]);

  const fmtDate = (d?: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const getStageBadge = (stage: string) => {
    const s = stage.toLowerCase();
    if (s.includes('hired') || s.includes('selected')) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    }
    if (s.includes('offer')) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    }
    if (s.includes('interview')) {
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' };
    }
    if (s.includes('review') || s.includes('screening') || s.includes('shortlist')) {
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
    }
    if (s.includes('rejected') || s.includes('withdrawn')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
    }
    return { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  };

  const getProgressIndex = (stage: string) => {
    const s = stage.toLowerCase();
    if (s.includes('hired')) return 4;
    if (s.includes('offer') || s.includes('selected')) return 3;
    if (s.includes('interview')) return 2;
    if (s.includes('screen') || s.includes('shortlist') || s.includes('review')) return 1;
    return 0; // Applied
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles size={13} className="text-indigo-400" />
              Live Candidate Recruitment Pipeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Active Applications</h1>
            <p className="text-sm text-indigo-200/80 max-w-xl font-medium">
              Monitor your hiring progression, upcoming interview rounds, and real-time status across all active positions.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-white">{counts.total}</div>
              <div className="text-[11px] text-indigo-200 font-bold uppercase tracking-wider">Total</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-blue-400">{counts.review}</div>
              <div className="text-[11px] text-indigo-200 font-bold uppercase tracking-wider">In Review</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-indigo-400">{counts.interview}</div>
              <div className="text-[11px] text-indigo-200 font-bold uppercase tracking-wider">Interviews</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-emerald-400">{counts.offer}</div>
              <div className="text-[11px] text-indigo-200 font-bold uppercase tracking-wider">Offers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({counts.total})
          </button>
          <button
            onClick={() => setSelectedFilter('interview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'interview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Interviews ({counts.interview})
          </button>
          <button
            onClick={() => setSelectedFilter('review')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'review'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            In Review ({counts.review})
          </button>
          <button
            onClick={() => setSelectedFilter('offer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'offer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Offers ({counts.offer})
          </button>
        </div>

        {/* Search & Layout Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search role, company or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087BFF] focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Empty State */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-xs font-bold text-slate-600">Loading your applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Briefcase size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">No applications found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || selectedFilter !== 'all'
                ? 'Try resetting your search query or switching filter tabs.'
                : 'You have not submitted any applications yet. Explore open mandates and apply today!'}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/candidate/jobs')}
              className="px-5 py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Browse Open Jobs →
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Modern Cards Grid */
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const badge = getStageBadge(app.stage);
            const progress = getProgressIndex(app.stage);
            const company = app.companyName || 'Fintech ScaleOps';
            const initials = company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

            return (
              <div
                key={app.id}
                className="group p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Stage colored corner accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none ${badge.bg}`} />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Role, Company & Meta */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-700 font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {initials}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onNavigate(`/candidate/applications/${app.id}`)}
                          className="font-extrabold text-slate-900 text-base hover:text-[#087BFF] text-left transition-colors truncate"
                        >
                          {app.jobTitle}
                        </button>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                          {app.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium flex-wrap">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Building2 size={13} className="text-slate-400" />
                          {company}
                        </span>
                        <span>•</span>
                        <span>Applied {fmtDate(app.appliedAt || app.createdAt)}</span>
                        {app.job?.location && (
                          <>
                            <span>•</span>
                            <span>{app.job.location}</span>
                          </>
                        )}
                        {app.job?.salaryMin && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              ₹{(app.job.salaryMin / 100000).toFixed(1)}L - ₹{((app.job.salaryMax || app.job.salaryMin) / 100000).toFixed(1)}L
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stage Badge & 5-Step Progress */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${badge.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
                        {app.stage}
                      </span>
                    </div>

                    {/* Step Pip Tracker */}
                    <div className="flex items-center gap-1">
                      {STAGE_ORDER.map((st, i) => {
                        const isDone = i < progress;
                        const isCurrent = i === progress;
                        return (
                          <div key={st} className="flex items-center gap-1">
                            <div
                              title={`${st}: ${isCurrent ? 'Current' : isDone ? 'Completed' : 'Upcoming'}`}
                              className={`h-2 rounded-full transition-all ${
                                isCurrent
                                  ? 'w-6 bg-indigo-600 ring-2 ring-indigo-200'
                                  : isDone
                                  ? 'w-3 bg-emerald-500'
                                  : 'w-2 bg-slate-200'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Upcoming Interview Callout Banner (if applicable) */}
                {app.nextInterview && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Video size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                          <span>Upcoming Round:</span>
                          <span className="text-indigo-700">{app.nextInterview.round || 'Technical Interview'}</span>
                        </div>
                        <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {fmtDate(app.nextInterview.scheduledAt)}
                          </span>
                          <span>•</span>
                          <span>Video Meeting</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('/candidate/interviews')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Video size={13} /> Join / Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Updated {fmtDate(app.updatedAt || app.createdAt)}
                    {app.stageReason && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        Note: {app.stageReason}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate(`/candidate/applications/${app.id}/chat`)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      Chat
                    </button>

                    <button
                      onClick={() => onNavigate(`/candidate/applications/${app.id}`)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      View Details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Modern Data Table */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-4 px-6">Role & Employer</th>
                  <th className="py-4 px-6">Stage</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Next Event</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const badge = getStageBadge(app.stage);
                  const company = app.companyName || 'Fintech ScaleOps';
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-slate-900 text-sm">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {company} • <span className="font-mono text-slate-400">{app.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {app.stage}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-600">
                        {fmtDate(app.appliedAt || app.createdAt)}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {app.nextInterview ? (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold inline-flex items-center gap-1">
                            <Video size={12} />
                            {app.nextInterview.round || 'Interview'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => onNavigate(`/candidate/applications/${app.id}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#087BFF] text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          Open →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
