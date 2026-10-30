import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Building2, MapPin, Search, Bookmark, 
  CheckCircle2, Sparkles, Calendar, Clock, ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface JobItem {
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
  experienceMin?: number;
  experienceMax?: number;
  createdAt?: string;
  expiryDate?: string;
  acceptingApplications?: boolean;
}

interface CandidateJobsViewProps {
  jobs: JobItem[];
  loading?: boolean;
  appliedJobIds: string[];
  savedJobIds: string[];
  candidateProfile?: any;
  onNavigate: (path: string) => void;
  onApply: (jobId: string) => void;
  onToggleSave: (jobId: string) => void;
}

export const CandidateJobsView: React.FC<CandidateJobsViewProps> = ({
  jobs,
  loading = false,
  appliedJobIds = [],
  savedJobIds = [],
  onNavigate,
  onApply,
  onToggleSave,
}) => {
  const [search, setSearch] = useState('');
  const [selectedPill, setSelectedPill] = useState<'all' | 'remote' | 'hybrid' | 'high_salary' | 'saved'>('all');

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        j.title?.toLowerCase().includes(q) ||
        j.companyName?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.requiredSkills?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedPill === 'remote') {
        return /remote/i.test(j.workArrangement || '') || /remote/i.test(j.location || '');
      }
      if (selectedPill === 'hybrid') {
        return /hybrid/i.test(j.workArrangement || '') || /hybrid/i.test(j.location || '');
      }
      if (selectedPill === 'high_salary') {
        return (j.salaryMin || 0) >= 3000000;
      }
      if (selectedPill === 'saved') {
        return savedJobIds.includes(j.id);
      }
      return true;
    });
  }, [jobs, search, selectedPill, savedJobIds]);

  const fmtSalary = (min?: number, max?: number, curr = 'INR') => {
    if (!min) return 'Competitive / Undisclosed';
    const minL = (min / 100000).toFixed(1);
    const maxL = max ? (max / 100000).toFixed(1) : minL;
    return `${curr === 'INR' ? '₹' : curr + ' '}${minL}L - ${maxL}L / yr`;
  };

  const fmtRelativeDate = (d?: string) => {
    if (!d) return 'Recently posted';
    try {
      const dt = new Date(d);
      const diffMs = Date.now() - dt.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'Posted today';
      if (diffDays === 1) return 'Posted yesterday';
      if (diffDays < 7) return `Posted ${diffDays} days ago`;
      return `Posted on ${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } catch {
      return 'Recently posted';
    }
  };

  const fmtClosingDate = (d?: string) => {
    if (!d) return 'Open until filled';
    try {
      const dt = new Date(d);
      const diffDays = Math.ceil((dt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const formatted = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (diffDays > 0 && diffDays <= 30) {
        return `Closes in ${diffDays}d (${formatted})`;
      }
      return `Closing: ${formatted}`;
    } catch {
      return 'Open until filled';
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] font-bold text-[11px] mb-1">
            <Sparkles size={12} /> Curated Tech Roles
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Curated Job Postings
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Verified enterprise engineering and architecture mandates matching your credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-lg font-black text-slate-900">{filteredJobs.length}</span>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Roles</span>
          </div>
        </div>
      </div>

      {/* Compact Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedPill('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPill === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            All Roles
          </button>
          <button
            type="button"
            onClick={() => setSelectedPill('remote')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPill === 'remote'
                ? 'bg-[#087BFF] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            Remote
          </button>
          <button
            type="button"
            onClick={() => setSelectedPill('hybrid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPill === 'hybrid'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            Hybrid
          </button>
          <button
            type="button"
            onClick={() => setSelectedPill('high_salary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPill === 'high_salary'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            ₹30L+ CTC
          </button>
          <button
            type="button"
            onClick={() => setSelectedPill('saved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPill === 'saved'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            Saved ({savedJobIds.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, skills or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#087BFF] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Compact Job Cards List */}
      {loading ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin w-7 h-7 border-3 border-[#087BFF] border-t-transparent rounded-full mb-2" />
          <p className="text-xs font-bold text-slate-600">Loading active opportunities…</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
          <Briefcase size={26} className="text-slate-400 mx-auto" />
          <h3 className="text-sm font-extrabold text-slate-900">No jobs match your filter</h3>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or clear the filter pills.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const isSaved = savedJobIds.includes(job.id);
            const company = job.companyName || 'Fintech ScaleOps';
            const initials = company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

            return (
              <div
                key={job.id}
                className="p-4 sm:p-4.5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group"
              >
                {/* Left Info Column */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#087BFF] font-black text-xs shadow-2xs group-hover:scale-105 transition-transform">
                    {initials}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/candidate/jobs/${job.id}`)}
                        className="font-extrabold text-slate-900 text-sm hover:text-[#087BFF] text-left transition-colors truncate cursor-pointer"
                      >
                        {job.title}
                      </button>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {fmtSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <ShieldCheck size={11} className="text-blue-600" /> Verified Employer
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" />
                        {company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {job.location || 'Bengaluru, India'}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{job.workArrangement || 'Hybrid'}</span>
                      {job.experienceMin != null && (
                        <>
                          <span>•</span>
                          <span>{job.experienceMin}+ Yrs Exp</span>
                        </>
                      )}
                    </div>

                    {/* Date Row (Posted & Closing) */}
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2.5 pt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock size={11} className="text-slate-400" />
                        {fmtRelativeDate(job.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600 font-semibold">
                        <Calendar size={11} className="text-amber-500" />
                        {fmtClosingDate(job.expiryDate)}
                      </span>
                      {job.requiredSkills && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-sm text-slate-500">
                            <strong>Skills:</strong> {job.requiredSkills}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => onToggleSave(job.id)}
                    title={isSaved ? 'Remove from saved' : 'Save job'}
                    className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Bookmark size={14} className={isSaved ? 'fill-amber-600 text-amber-600' : ''} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate(`/candidate/jobs/${job.id}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                  >
                    Details
                  </button>

                  {isApplied ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-600" /> Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApply(job.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-black text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>1-Click Apply</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
