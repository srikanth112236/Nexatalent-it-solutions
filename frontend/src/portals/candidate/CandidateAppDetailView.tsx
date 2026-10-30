import React, { useState } from 'react';
import { 
  ArrowLeft, Building2, Calendar, Clock, 
  MessageSquare, Video, AlertCircle, 
  Check, Copy, ExternalLink, ShieldAlert,
  Award, Sparkles, ChevronRight, UserCheck
} from 'lucide-react';

interface StageHistoryItem {
  id: string;
  from: string;
  to: string;
  actor?: string;
  actorName?: string;
  reason?: string;
  createdAt: string;
}

interface InterviewItem {
  id: string;
  round?: string;
  scheduledAt?: string;
  timezone?: string;
  mode?: string;
  meetingLink?: string;
  status?: string;
  venue?: string;
  instructions?: string;
}

interface ApplicationDetailData {
  id: string;
  jobId: string;
  jobTitle: string;
  orgId?: string;
  companyName?: string;
  requisitionId?: string;
  candidateEmail?: string;
  stage: string;
  stageReason?: string;
  source?: string;
  createdAt: string;
  appliedAt?: string;
  updatedAt?: string;
  jobClosed?: boolean;
  history?: StageHistoryItem[];
  interviews?: InterviewItem[];
  nextInterview?: InterviewItem | null;
  job?: {
    id?: string;
    title?: string;
    description?: string;
    responsibilities?: string;
    requiredSkills?: string;
    preferredSkills?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    location?: string;
    employmentType?: string;
    workArrangement?: string;
  } | null;
}

interface CandidateAppDetailViewProps {
  app: ApplicationDetailData;
  loading?: boolean;
  onBack: () => void;
  onOpenChat: (appId: string) => void;
  onWithdraw: (appId: string, reason?: string) => Promise<void>;
  onReschedule: (interviewId: string, reason: string) => Promise<void>;
  onNavigate?: (path: string) => void;
  onUploadDoc?: (file: File) => Promise<void>;
}

const STAGES = [
  { name: 'Applied', key: 'applied', desc: 'Application received & verified' },
  { name: 'Screening', key: 'screening', desc: 'Resume & credentials review' },
  { name: 'Interview', key: 'interview', desc: 'Technical & leadership rounds' },
  { name: 'Offer', key: 'offer', desc: 'Formal offer extended' },
  { name: 'Hired', key: 'hired', desc: 'Offer accepted & onboarded' },
];

export const CandidateAppDetailView: React.FC<CandidateAppDetailViewProps> = ({
  app,
  loading: _loading = false,
  onBack,
  onOpenChat,
  onWithdraw,
  onReschedule,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [showReschedModal, setShowReschedModal] = useState(false);
  const [reschedReason, setReschedReason] = useState('');
  const [reschedBusy, setReschedBusy] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawBusy, setWithdrawBusy] = useState(false);

  const company = app.companyName || 'Fintech ScaleOps';
  const initials = company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const fmtDate = (d?: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const fmtDateTime = (d?: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    } catch {
      return d;
    }
  };

  const fmtRelativeDate = (d?: string) => {
    if (!d) return '';
    try {
      const now = new Date();
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

  const fmtCurrency = (val?: number, curr = 'INR') => {
    if (!val) return 'Competitive';
    return `${curr === 'INR' ? '₹' : curr + ' '}${Number(val).toLocaleString('en-IN')}`;
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(app.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStageIndex = (() => {
    const s = app.stage.toLowerCase();
    if (s.includes('hired')) return 4;
    if (s.includes('offer') || s.includes('selected')) return 3;
    if (s.includes('interview')) return 2;
    if (s.includes('screen') || s.includes('shortlist') || s.includes('review')) return 1;
    return 0;
  })();

  const isOfferStage = app.stage.toLowerCase().includes('offer') || app.stage.toLowerCase().includes('selected');

  // Find completed dates for milestones from history
  const getStageDate = (stageKey: string) => {
    if (!app.history || app.history.length === 0) return null;
    const match = app.history.find((h) => h.to.toLowerCase().includes(stageKey));
    return match ? fmtDate(match.createdAt) : null;
  };

  const nextIv = app.nextInterview || (app.interviews && app.interviews.find((i) => i.status === 'Scheduled')) || null;

  const handleRescheduleSubmit = async () => {
    if (!nextIv || !reschedReason.trim()) return;
    setReschedBusy(true);
    try {
      await onReschedule(nextIv.id, reschedReason.trim());
      setShowReschedModal(false);
      setReschedReason('');
    } finally {
      setReschedBusy(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    setWithdrawBusy(true);
    try {
      await onWithdraw(app.id, withdrawReason.trim() || undefined);
      setShowWithdrawModal(false);
    } finally {
      setWithdrawBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Back Navigation & Ref Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Applications
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Reference:</span>
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-colors cursor-pointer"
            title="Click to copy ID"
          >
            {app.id}
            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-500" />}
          </button>
        </div>
      </div>

      {/* High-Impact Executive Offer Banner (when in Offer stage) */}
      {isOfferStage && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border-2 border-emerald-300/80 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Award size={24} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                    <Sparkles size={11} /> Official Offer Extended
                  </span>
                  <span className="text-xs font-bold text-emerald-950">
                    Annual Package: <strong className="text-emerald-800 text-sm font-black">₹42,00,000 / yr</strong>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Congratulations! Fintech ScaleOps has issued your formal employment offer.
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium flex-wrap pt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar size={13} className="text-emerald-600" />
                    Target Joining: Dec 01, 2026 (In 33 days)
                  </span>
                  <span>•</span>
                  <span className="text-amber-800 font-bold">
                    Response Window: Before Nov 15, 2026 • 17 days left
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate ? onNavigate('/candidate/offers') : window.location.assign('/candidate/offers')}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                Review & Accept Offer
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Application Summary Card */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shrink-0 font-black text-lg shadow-sm">
              {initials}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {app.jobTitle}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                  isOfferStage 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {app.stage}
                </span>
                {app.jobClosed && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    Requisition Closed
                  </span>
                )}
              </div>

              {/* Enhanced Dates & Employer Information */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Building2 size={13} className="text-slate-400" />
                  {company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Calendar size={12} className="text-indigo-600" />
                  Applied {fmtDate(app.appliedAt || app.createdAt)}
                  <span className="text-slate-400 font-normal">
                    ({fmtRelativeDate(app.appliedAt || app.createdAt)})
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  Updated {fmtDate(app.updatedAt || app.createdAt)}
                </span>
                {app.requisitionId && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      Req: {app.requisitionId}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenChat(app.id)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquare size={13} className="text-indigo-600" />
              Recruiter Chat
            </button>

            {app.stage !== 'Withdrawn' && app.stage !== 'Rejected' && app.stage !== 'Hired' && (
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all cursor-pointer"
              >
                Withdraw
              </button>
            )}
          </div>
        </div>

        {/* 5-Stage Modern Milestone Pipeline Tracker */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Recruitment Milestones
            </div>
            <div className="text-xs font-bold text-indigo-700">
              Stage {currentStageIndex + 1} of 5: {STAGES[currentStageIndex]?.name}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAGES.map((st, i) => {
              const isDone = i < currentStageIndex;
              const isCurrent = i === currentStageIndex;
              const milestoneDate = getStageDate(st.key);

              return (
                <div
                  key={st.name}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-200/50 shadow-xs'
                      : isDone
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isCurrent
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isDone ? <Check size={11} /> : i + 1}
                    </div>
                    <div className="font-black text-xs text-slate-900 truncate">{st.name}</div>
                  </div>
                  
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    {milestoneDate ? (
                      <span className="text-emerald-700 font-bold">✓ {milestoneDate}</span>
                    ) : (
                      st.desc
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Next Interview Highlight Box (if scheduled) */}
      {nextIv && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-800/40 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 shadow-inner">
                <Video size={20} />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-bold text-indigo-200">
                  <span>📅 Upcoming Video Round</span>
                  <span>•</span>
                  <span>{fmtRelativeDate(nextIv.scheduledAt)}</span>
                </div>
                <h3 className="text-base font-black text-white">
                  {nextIv.round || 'Technical Architecture & System Design'}
                </h3>
                <div className="flex items-center gap-3 text-xs text-indigo-200 font-medium flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-white">
                    <Calendar size={13} className="text-indigo-400" />
                    {fmtDate(nextIv.scheduledAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-indigo-400" />
                    {fmtDateTime(nextIv.scheduledAt).split(',')[1] || '02:30 PM'} ({nextIv.timezone || 'IST'})
                  </span>
                  <span>•</span>
                  <span>Mode: Video Conference (Google Meet)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={nextIv.meetingLink || 'https://meet.google.com/nex-atal-ent'}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Video size={13} />
                Join Google Meet
                <ExternalLink size={11} />
              </a>

              <button
                onClick={() => setShowReschedModal(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 font-bold text-xs border border-white/20 transition-all cursor-pointer"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Reason Note Alert (if any) */}
      {app.stageReason && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs">
          <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-amber-900">Current Stage Update:</span>
            <p className="text-amber-800 font-medium">{app.stageReason}</p>
          </div>
        </div>
      )}

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2/3): Stage History & Role Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Audit Timeline Card */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Clock size={15} className="text-indigo-600" />
                Live Application Activity & Audit Timeline
              </h3>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {(app.history || []).length} recorded milestones
              </span>
            </div>

            <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {(app.history && app.history.length > 0 ? app.history : [
                {
                  id: 'init',
                  from: '-',
                  to: app.stage,
                  actor: 'candidate@nexatalent.com',
                  actorName: 'Candidate',
                  createdAt: app.appliedAt || app.createdAt,
                  reason: 'Application submitted successfully',
                }
              ]).map((h, i) => (
                <div key={h.id || i} className="relative flex items-start gap-3 pl-8">
                  {/* Timeline Dot */}
                  <div className="absolute left-2 top-2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-600 shadow-xs ring-4 ring-indigo-50" />

                  <div className="flex-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          {h.from === '-' || h.from === 'None' ? 'Application Submitted' : `${h.from} → ${h.to}`}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {h.to}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {fmtDateTime(h.createdAt)}
                        <span className="text-slate-500 font-bold ml-1">
                          ({fmtRelativeDate(h.createdAt)})
                        </span>
                      </div>
                    </div>

                    {(h.actorName || h.actor) && (
                      <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                        <UserCheck size={11} className="text-slate-400" />
                        <span>Action by:</span>
                        <span className="font-bold text-slate-800">{h.actorName || h.actor}</span>
                      </div>
                    )}

                    {h.reason && (
                      <div className="mt-1 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 font-medium leading-relaxed">
                        <span className="font-bold text-indigo-900">Note:</span> {h.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Overview Card */}
          {app.job && (
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 size={15} className="text-indigo-600" />
                Role Specifications & Requirements
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Compensation Range</div>
                  <div className="font-black text-slate-900 mt-0.5">
                    {fmtCurrency(app.job.salaryMin, app.job.currency)} - {fmtCurrency(app.job.salaryMax, app.job.currency)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Location & Work Style</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {app.job.location || 'Bangalore'} ({app.job.workArrangement || 'Hybrid'})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Employment Type</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {app.job.employmentType || 'Full-time'}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed pt-1">
                {app.job.description || 'Core engineering and technical architecture responsibilities within our platform operations.'}
              </div>

              {app.job.responsibilities && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-black text-slate-900">Key Responsibilities:</div>
                  <div className="text-xs text-slate-600 space-y-1 whitespace-pre-line leading-relaxed">
                    {app.job.responsibilities}
                  </div>
                </div>
              )}

              {app.job.requiredSkills && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-black text-slate-900">Stack & Skills:</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {app.job.requiredSkills.split(',').map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200"
                      >
                        {sk.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (1/3): Quick Overview & Recruiter Sidebar */}
        <div className="space-y-5">
          {/* Direct Recruiter Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-white rounded-2xl border border-indigo-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare size={16} />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-900">Dedicated Recruiter Channel</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Direct questions regarding your evaluation, interview feedback, or scheduling adjustments.
              </p>
            </div>

            <button
              onClick={() => onOpenChat(app.id)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#087BFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <MessageSquare size={13} />
              Open Dedicated Chat
            </button>
          </div>

          {/* Application Metadata Specs Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider text-slate-500">
              Application Details
            </h4>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Application ID</span>
                <span className="font-mono font-bold text-slate-900">{app.id}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Company</span>
                <span className="font-bold text-slate-900">{company}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Requisition</span>
                <span className="font-mono text-slate-700">{app.requisitionId || 'REQ-CORE'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Current Stage</span>
                <span className="font-black text-indigo-700">{app.stage}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Submission Date</span>
                <span className="font-semibold text-slate-800">{fmtDate(app.appliedAt || app.createdAt)}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Days in Pipeline</span>
                <span className="font-bold text-slate-900">
                  {fmtRelativeDate(app.appliedAt || app.createdAt).replace('ago', '').trim()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showReschedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          onClick={() => setShowReschedModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900">Request Interview Reschedule</h4>
              <button
                onClick={() => setShowReschedModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide your preferred time slots or the conflict reason. The hiring coordinator will review and confirm a new calendar invite.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Alternative Windows *
              </label>
              <textarea
                rows={4}
                value={reschedReason}
                onChange={(e) => setReschedReason(e.target.value)}
                placeholder="e.g. Prior travel commitment on Oct 30. Any slot on Friday Nov 01 after 2:00 PM IST works smoothly."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReschedModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!reschedReason.trim() || reschedBusy}
                onClick={handleRescheduleSubmit}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {reschedBusy ? 'Submitting...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-rose-600">
              <ShieldAlert size={20} />
              <h4 className="text-base font-extrabold text-slate-900">Confirm Application Withdrawal</h4>
            </div>

            <p className="text-xs text-slate-500">
              Are you sure you want to withdraw your application for <strong className="text-slate-800">{app.jobTitle}</strong>? This action updates the employer and halts further interview scheduling.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reason for Withdrawal (Optional)
              </label>
              <textarea
                rows={3}
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                placeholder="e.g. Accepted another offer / Relocating / Timing not ideal"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Keep Application
              </button>

              <button
                type="button"
                disabled={withdrawBusy}
                onClick={handleWithdrawSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {withdrawBusy ? 'Withdrawing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
