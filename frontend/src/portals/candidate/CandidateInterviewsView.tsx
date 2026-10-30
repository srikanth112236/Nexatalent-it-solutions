import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, ExternalLink, 
  CheckCircle2, Sparkles, 
  ShieldCheck, User, FileText,
  ChevronRight, MessageSquare
} from 'lucide-react';

interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  round?: string;
  roundName?: string;
  scheduledAt?: string;
  timezone?: string;
  mode?: string;
  meetingLink?: string;
  venue?: string;
  instructions?: string;
  status?: string;
  confirmationStatus?: string;
  candidateName?: string;
  jobTitle?: string;
  companyName?: string;
  interviewerName?: string;
  history?: any[];
  job?: any;
}

interface CandidateInterviewsViewProps {
  interviews: Interview[];
  loading?: boolean;
  userEmail: string;
  onNavigate: (path: string) => void;
  onConfirm: (interviewId: string) => Promise<void>;
  onReschedule: (interviewId: string, reason: string) => Promise<void>;
}

export const CandidateInterviewsView: React.FC<CandidateInterviewsViewProps> = ({
  interviews,
  loading = false,
  userEmail,
  onNavigate,
  onConfirm,
  onReschedule,
}) => {
  const [filter, setFilter] = useState<'upcoming' | 'all' | 'completed'>('upcoming');
  const [reschedId, setReschedId] = useState<string | null>(null);
  const [reschedReason, setReschedReason] = useState('');
  const [reschedBusy, setReschedBusy] = useState(false);
  const [confirmBusyId, setConfirmBusyId] = useState<string | null>(null);

  const now = new Date();

  const fmtDateObj = (d?: string) => {
    if (!d) return { month: 'TBD', day: '—', weekday: '', full: '—', time: '—', relative: '' };
    try {
      const dt = new Date(d);
      const diffMs = dt.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      
      let relative = '';
      if (diffDays === 0) relative = 'Today';
      else if (diffDays === 1) relative = 'Tomorrow';
      else if (diffDays === -1) relative = 'Yesterday';
      else if (diffDays > 1) relative = `In ${diffDays} days`;
      else relative = `${Math.abs(diffDays)} days ago`;

      return {
        month: dt.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: dt.getDate(),
        weekday: dt.toLocaleDateString('en-US', { weekday: 'short' }),
        full: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        time: dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        relative,
      };
    } catch {
      return { month: 'TBD', day: '—', weekday: '', full: d, time: '—', relative: '' };
    }
  };

  const filtered = interviews.filter((iv) => {
    const isPast = iv.scheduledAt ? new Date(iv.scheduledAt) < now : false;
    const isCompleted = iv.status === 'Completed' || (isPast && iv.status !== 'Scheduled');
    if (filter === 'upcoming') return !isCompleted && iv.status !== 'Cancelled';
    if (filter === 'completed') return isCompleted;
    return true;
  });

  const upcomingCount = interviews.filter((iv) => {
    const isPast = iv.scheduledAt ? new Date(iv.scheduledAt) < now : false;
    return !isPast && iv.status === 'Scheduled';
  }).length;

  const confirmedCount = interviews.filter((iv) => iv.confirmationStatus === 'Confirmed').length;

  const handleConfirmAttendance = async (id: string) => {
    setConfirmBusyId(id);
    try {
      await onConfirm(id);
    } finally {
      setConfirmBusyId(null);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!reschedId || !reschedReason.trim()) return;
    setReschedBusy(true);
    try {
      await onReschedule(reschedId, reschedReason.trim());
      setReschedId(null);
      setReschedReason('');
    } finally {
      setReschedBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles size={12} className="text-indigo-400" />
              Interview Command Center
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Scheduled Evaluation Rounds</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Join live Google Meet sessions, confirm your attendance, review technical prep instructions, and track upcoming evaluations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-indigo-400">{upcomingCount}</div>
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Upcoming</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-emerald-400">{confirmedCount}</div>
              <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Confirmed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Action */}
      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Rounds ({interviews.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="text-[11px] font-semibold text-slate-500 hidden sm:block">
          All slots synchronized to <span className="font-bold text-slate-800">Asia/Kolkata (IST)</span>
        </div>
      </div>

      {/* Main Grid: Interviews List & Preparation Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3.5">
          {loading ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
              <div className="inline-block animate-spin w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full mb-2" />
              <p className="text-xs font-bold text-slate-600">Loading scheduled rounds...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Calendar size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">No interviews found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filter === 'upcoming'
                  ? 'You have no pending video rounds scheduled right now.'
                  : 'No interview records match this category.'}
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const dt = fmtDateObj(item.scheduledAt);
              const company = item.companyName || 'Fintech ScaleOps';
              const confirmed = item.confirmationStatus === 'Confirmed' || (item.history || []).some(
                (h: any) => String(h.by || '').toLowerCase() === userEmail.toLowerCase() && /confirm/i.test(String(h.reason || ''))
              );

              return (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 relative overflow-hidden group space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                    {/* Date Block & Main Specs */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Modern High-Contrast Calendar Tile */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-indigo-50 via-white to-slate-100 border border-indigo-200/80 flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <div className="text-[10px] font-black text-indigo-600 tracking-wider">
                          {dt.month}
                        </div>
                        <div className="text-lg font-black text-slate-900 leading-none mt-0.5">
                          {dt.day}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          {dt.weekday}
                        </div>
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-slate-900 text-sm sm:text-base">
                            {item.round || item.roundName || 'Technical Interview Round'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {item.status || 'Scheduled'}
                          </span>
                          {confirmed ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 size={10} /> Confirmed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Awaiting Confirmation
                            </span>
                          )}
                        </div>

                        {/* Relative Badge & Role info */}
                        <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">{company}</span>
                          <span>•</span>
                          <span className="text-slate-700">{item.jobTitle || 'Senior Software Engineer'}</span>
                        </div>

                        {/* Proper Dates Display */}
                        <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium flex-wrap pt-0.5">
                          <span className="flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            <Clock size={12} className="text-indigo-600" />
                            {dt.full} at {dt.time} ({item.timezone || 'IST'})
                          </span>
                          {dt.relative && (
                            <span className="text-indigo-700 font-bold text-[11px] bg-indigo-50 px-2 py-0.5 rounded">
                              ● {dt.relative}
                            </span>
                          )}
                          {item.interviewerName && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <User size={11} className="text-slate-400" />
                              Interviewer: <strong className="text-slate-800">{item.interviewerName}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Join / Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <a
                        href={item.meetingLink || 'https://meet.google.com/nex-atal-ent'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Video size={13} />
                        Join Google Meet
                        <ExternalLink size={10} />
                      </a>

                      {!confirmed && item.status === 'Scheduled' && (
                        <button
                          onClick={() => handleConfirmAttendance(item.id)}
                          disabled={confirmBusyId === item.id}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-all cursor-pointer"
                          title="Confirm your presence"
                        >
                          {confirmBusyId === item.id ? 'Confirming...' : 'Confirm'}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setReschedId(item.id);
                          setReschedReason('');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                        title="Request alternative time"
                      >
                        Reschedule
                      </button>

                      {item.applicationId && (
                        <button
                          onClick={() => onNavigate(`/candidate/applications/${item.applicationId}`)}
                          className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                          title="View Application Details"
                        >
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interview Focus Instructions / Notes */}
                  {item.instructions && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                      <FileText size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 mr-1">Preparation Note:</span>
                        {item.instructions}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar: Interview Preparation Guide */}
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-white rounded-2xl border border-indigo-200 shadow-xs space-y-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={18} />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-900">Virtual Interview Readiness</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ensure top technical and environmental presentation for high evaluation scores.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">Verify audio/mic and webcam 10 mins ahead</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">Have system design diagrams & architecture ready to share</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">Use a quiet environment with wired or stable Wi-Fi</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => onNavigate('/candidate/applications')}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-[#087BFF] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare size={13} />
                Message Recruiter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {reschedId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          onClick={() => setReschedId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900">Request Reschedule</h4>
              <button
                onClick={() => setReschedId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide your conflict details or proposed replacement time slots. The talent acquisition team will adjust the calendar invite accordingly.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reason & Suggested Alternative Slots *
              </label>
              <textarea
                rows={4}
                value={reschedReason}
                onChange={(e) => setReschedReason(e.target.value)}
                placeholder="e.g. Prior travel commitment on this date. Any slot on Friday after 2:00 PM IST works perfectly."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReschedId(null)}
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
    </div>
  );
};
