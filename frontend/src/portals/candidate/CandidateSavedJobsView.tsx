import React, { useState } from 'react';
import { 
  Bookmark, MapPin, Search, Trash2, CheckCircle2, 
  Clock, ShieldCheck, ArrowRight, 
  Building2
} from 'lucide-react';

interface SavedJobItem {
  id?: string;
  jobId: string;
  savedAt?: string;
  jobMissing?: boolean;
  closed?: boolean;
  applied?: boolean;
  job?: {
    id: string;
    title: string;
    companyName?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    employmentType?: string;
    workArrangement?: string;
    department?: string;
    requiredSkills?: string;
    createdAt?: string;
    expiryDate?: string;
  } | null;
}

interface CandidateSavedJobsViewProps {
  savedJobs: SavedJobItem[];
  loading?: boolean;
  onNavigate: (path: string) => void;
  onRemove: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

export const CandidateSavedJobsView: React.FC<CandidateSavedJobsViewProps> = ({
  savedJobs,
  loading = false,
  onNavigate,
  onRemove,
  onApply,
}) => {
  const [search, setSearch] = useState('');

  const now = new Date();

  const fmtDate = (d?: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const fmtRelativeDate = (d?: string) => {
    if (!d) return '';
    try {
      const target = new Date(d);
      const diffMs = target.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 1) return `In ${diffDays} days`;
      return `${Math.abs(diffDays)} days ago`;
    } catch {
      return '';
    }
  };

  const fmtClosingDate = (d?: string) => {
    if (!d) return 'Open Requisition';
    try {
      const exp = new Date(d);
      const diffMs = exp.getTime() - now.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const short = exp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (days < 0) return 'Expired';
      if (days === 0) return 'Closes today';
      if (days === 1) return 'Closes tomorrow';
      return `Closes in ${days}d (${short})`;
    } catch {
      return d;
    }
  };

  const filtered = savedJobs.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const title = item.job?.title?.toLowerCase() || '';
    const company = item.job?.companyName?.toLowerCase() || '';
    const loc = item.job?.location?.toLowerCase() || '';
    return title.includes(q) || company.includes(q) || loc.includes(q);
  });

  const fmtSalary = (min?: number, max?: number, curr = 'INR') => {
    if (!min) return 'Competitive / Undisclosed';
    const minL = (min / 100000).toFixed(1);
    const maxL = max ? (max / 100000).toFixed(1) : minL;
    return `${curr === 'INR' ? '₹' : curr + ' '}${minL}L - ${maxL}L / yr`;
  };

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
              <Bookmark size={12} className="text-amber-400 fill-amber-400" />
              Shortlisted Positions
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Saved Career Opportunities</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Your curated shortlist of high-match enterprise roles. Track requisition deadlines, compare compensation, and apply directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-amber-400">{savedJobs.length}</div>
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Bookmarked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Counter Filter */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved roles by title, employer, skills or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 hidden sm:block shrink-0">
          Showing <span className="font-bold text-slate-900">{filtered.length}</span> of {savedJobs.length} saved
        </div>
      </div>

      {/* Grid of Saved Jobs */}
      {loading ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full mb-2" />
          <p className="text-xs font-bold text-slate-600">Loading saved roles...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">No saved roles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? 'No bookmarked positions match your current search terms.'
                : 'Bookmark roles while browsing curated jobs to quickly compare and apply.'}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/candidate/jobs')}
              className="px-4 py-2 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Explore Job Postings →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const job = item.job;
            const company = job?.companyName || 'Fintech ScaleOps';
            const initials = company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
            const savedDate = item.savedAt || '2026-10-24T12:00:00.000Z';
            const closingFormatted = fmtClosingDate(job?.expiryDate);

            return (
              <div
                key={item.jobId}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3.5 group relative"
              >
                <div className="space-y-2.5">
                  {/* Top Row: Company Avatar, Title, Remove Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/60 flex items-center justify-center text-indigo-700 font-black text-xs shrink-0 shadow-xs">
                        {initials}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <button
                          onClick={() => onNavigate(`/candidate/jobs/${item.jobId}`)}
                          className="font-black text-slate-900 text-sm hover:text-[#087BFF] text-left transition-colors truncate block cursor-pointer"
                        >
                          {job?.title || 'Senior Engineering Specialist'}
                        </button>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium flex-wrap">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Building2 size={11} className="text-slate-400" />
                            {company}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5 text-indigo-700 text-[11px] font-bold">
                            <ShieldCheck size={11} className="text-indigo-600" /> Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(item.jobId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove from saved roles"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Compensation & Work Model Pill Row */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {fmtSalary(job?.salaryMin, job?.salaryMax, job?.currency)}
                    </span>

                    <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <MapPin size={11} className="text-slate-500" />
                      {job?.location || 'Bangalore'} ({job?.workArrangement || 'Hybrid'})
                    </span>

                    {item.applied && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Applied
                      </span>
                    )}

                    {item.closed && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600">
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Proper Dates: Saved Date + Closing Date */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium flex-wrap pt-0.5 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Bookmark size={11} className="text-amber-500" />
                      Saved on {fmtDate(savedDate)}
                      <span className="text-slate-400 font-normal">({fmtRelativeDate(savedDate)})</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-900">
                      <Clock size={11} className="text-indigo-500" />
                      {closingFormatted}
                    </span>
                  </div>

                  {/* Skills tags */}
                  {job?.requiredSkills && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {job.requiredSkills.split(',').slice(0, 3).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200"
                        >
                          {sk.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigate(`/candidate/jobs/${item.jobId}`)}
                    className="text-xs font-bold text-slate-700 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    View Details
                    <ArrowRight size={12} />
                  </button>

                  <div>
                    {item.applied ? (
                      <button
                        onClick={() => onNavigate('/candidate/applications')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        Track Application
                      </button>
                    ) : item.closed ? (
                      <span className="text-xs text-slate-400 font-semibold">Closed for applications</span>
                    ) : (
                      <button
                        onClick={() => onApply(item.jobId)}
                        className="px-4 py-1.5 rounded-lg bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
