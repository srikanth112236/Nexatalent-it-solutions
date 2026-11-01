import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, User, Plus, Star, CheckCircle2, AlertTriangle, Download, X, Search } from 'lucide-react';
import { interviewsApi, atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';

export function AtsInterviewCalendarView() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Schedule Interview Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [scheduleForm, setScheduleForm] = useState({
    jobId: '',
    applicationId: '',
    round: 'Technical Round 1 (Golang + Architecture)',
    scheduledAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
    timezone: 'Asia/Kolkata',
    mode: 'video' as 'video' | 'phone' | 'onsite',
    meetingLink: 'https://meet.google.com/nex-atal-ent',
    interviewer: 'Tech Lead / Hiring Architect',
  });

  // Submit Feedback Modal
  const [feedbackInterview, setFeedbackInterview] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(4);
  const [recommendation, setRecommendation] = useState<string>('Hire');
  const [strengths, setStrengths] = useState('');
  const [gaps, setGaps] = useState('');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const loadInterviews = async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await interviewsApi.list('?pageSize=50');
      const list = res?.data?.items || res?.data || [];
      setInterviews(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load interviews list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
    (async () => {
      try {
        const res: any = await atsApi.jobs('?pageSize=50');
        const list = res?.data?.items || res?.data || [];
        setJobs(list);
        if (list.length > 0) {
          setScheduleForm((prev) => ({ ...prev, jobId: list[0].id }));
          loadJobApplicants(list[0].id);
        }
      } catch { /* noop */ }
    })();
  }, []);

  const loadJobApplicants = async (jobId: string) => {
    try {
      const res: any = await atsApi.jobPipeline(jobId);
      if (res?.data?.columns) {
        const all: any[] = [];
        for (const col of res.data.columns) {
          for (const cand of col.candidates) {
            all.push(cand);
          }
        }
        setApplicants(all);
        if (all.length > 0) {
          setScheduleForm((prev) => ({ ...prev, applicationId: all[0].applicationId || all[0].id }));
        }
      }
    } catch {
      setApplicants([]);
    }
  };

  const handleJobChange = (jobId: string) => {
    setScheduleForm((prev) => ({ ...prev, jobId }));
    loadJobApplicants(jobId);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.applicationId || !scheduleForm.jobId) return;
    setScheduleSaving(true);
    setScheduleError('');
    setScheduleSuccess('');

    try {
      const res: any = await interviewsApi.schedule({
        ...scheduleForm,
        scheduledAt: new Date(scheduleForm.scheduledAt).toISOString(),
      });
      if (res?.data) {
        setScheduleSuccess('Interview scheduled and calendar invite generated!');
        loadInterviews();
        setTimeout(() => {
          setShowScheduleModal(false);
          setScheduleSuccess('');
        }, 1200);
      }
    } catch (err: any) {
      setScheduleError(err?.response?.data?.message || err?.message || 'Failed to schedule interview.');
    } finally {
      setScheduleSaving(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInterview) return;
    setFeedbackSaving(true);
    setFeedbackSuccess('');

    try {
      const res: any = await interviewsApi.feedback(feedbackInterview.id, {
        rating,
        recommendation,
        strengths: strengths.trim() || undefined,
        gaps: gaps.trim() || undefined,
        notes: feedbackNotes.trim(),
      });
      if (res?.data) {
        setFeedbackSuccess('Interview scorecard and feedback submitted!');
        loadInterviews();
        setTimeout(() => {
          setFeedbackInterview(null);
          setFeedbackSuccess('');
          setStrengths('');
          setGaps('');
          setFeedbackNotes('');
        }, 1200);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to submit feedback.');
    } finally {
      setFeedbackSaving(false);
    }
  };

  const filtered = interviews.filter((iv) => {
    if (statusFilter && iv.status !== statusFilter) return false;
    if (q.trim()) {
      const s = q.toLowerCase();
      const match = `${iv.candidateName || ''} ${iv.candidateEmail || ''} ${iv.round || ''} ${iv.jobTitle || ''}`.toLowerCase();
      if (!match.includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Quick Action */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Interview Calendar & Scorecards</h3>
            <p className="text-xs text-slate-500 font-medium">Manage candidate interview rounds, send calendar invitations, and record hiring scorecards</p>
          </div>
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} /> Schedule Interview
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">{error}</div>}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search candidate name, email, round name, interviewer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled / Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews Grid / List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 shadow-sm">
          <InlineLoading message="Loading scheduled interviews…" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center space-y-2">
          <Calendar size={32} className="mx-auto text-slate-400" />
          <h4 className="text-base font-extrabold text-slate-900">No Interviews Scheduled</h4>
          <p className="text-xs text-slate-500">Schedule a round for shortlisted candidates or adjust search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((iv) => (
            <div
              key={iv.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{iv.round}</span>
                    <h4 className="text-sm font-black text-slate-900 truncate mt-0.5">{iv.candidateName}</h4>
                    <p className="text-xs text-slate-500 font-medium truncate">{iv.candidateEmail}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      iv.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-[#0265FF] border border-blue-200'
                    }`}
                  >
                    {iv.status || 'Scheduled'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Clock size={13} className="text-[#0265FF] shrink-0" />
                    <span>{iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString('en-IN') : 'Scheduled'}</span>
                  </div>
                  {iv.meetingLink && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Video size={13} className="text-slate-400 shrink-0" />
                      <a
                        href={iv.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0265FF] hover:underline font-mono truncate"
                      >
                        {iv.meetingLink}
                      </a>
                    </div>
                  )}
                  {iv.interviewer && (
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-slate-400 shrink-0" />
                      <span>Interviewer: <strong>{iv.interviewer}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => interviewsApi.downloadIcs(iv.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  <Download size={12} />
                  <span>ICS Invite</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackInterview(iv)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  <Star size={12} className="text-amber-400" />
                  <span>Submit Scorecard</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-slate-900">Schedule Candidate Interview</h3>
            <p className="text-xs text-slate-500">Pick candidate application, round details and generate video meeting link.</p>

            {scheduleError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" /> {scheduleError}
              </div>
            )}

            {scheduleSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" /> {scheduleSuccess}
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Mandate *</label>
                <select
                  value={scheduleForm.jobId}
                  onChange={(e) => handleJobChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.id} — {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Application *</label>
                <select
                  value={scheduleForm.applicationId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, applicationId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                >
                  {applicants.length === 0 ? (
                    <option value="">No applicants in this mandate</option>
                  ) : (
                    applicants.map((a) => (
                      <option key={a.applicationId || a.id} value={a.applicationId || a.id}>
                        {a.candidateName} ({a.candidateEmail})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Round *</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.round}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, round: e.target.value })}
                  placeholder="e.g. Technical Round 1 (Golang & System Design)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleForm.scheduledAt}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode</label>
                  <select
                    value={scheduleForm.mode}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, mode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  >
                    <option value="video">Google Meet / Video</option>
                    <option value="phone">Phone Screen</option>
                    <option value="onsite">On-site Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Video Meeting Link</label>
                <input
                  type="url"
                  value={scheduleForm.meetingLink}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interviewer Name / Panel</label>
                <input
                  type="text"
                  value={scheduleForm.interviewer}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
                  placeholder="e.g. Lead Architect, VP Engineering"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={scheduleSaving || applicants.length === 0}
                  className="w-full py-3 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {scheduleSaving ? 'Scheduling…' : 'Schedule Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT FEEDBACK & SCORECARD MODAL */}
      {feedbackInterview && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setFeedbackInterview(null)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{feedbackInterview.round}</span>
              <h3 className="text-lg font-black text-slate-900">{feedbackInterview.candidateName}</h3>
              <p className="text-xs text-slate-500">Record hiring scorecard and technical evaluation notes.</p>
            </div>

            {feedbackSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} /> {feedbackSuccess}
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overall Rating (1–5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  >
                    <option value={5}>5 Stars — Exceptional</option>
                    <option value={4}>4 Stars — Strong Performance</option>
                    <option value={3}>3 Stars — Meets Requirements</option>
                    <option value={2}>2 Stars — Below Expectations</option>
                    <option value={1}>1 Star — Strong Reject</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hiring Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  >
                    <option value="Strong hire">Strong hire</option>
                    <option value="Hire">Hire</option>
                    <option value="Hold">Hold</option>
                    <option value="No hire">No hire</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Technical Strengths</label>
                <textarea
                  rows={2}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g. In-depth understanding of Golang concurrency patterns, clean microservices architecture..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gaps / Improvement Areas</label>
                <textarea
                  rows={2}
                  value={gaps}
                  onChange={(e) => setGaps(e.target.value)}
                  placeholder="e.g. Needs deeper BigQuery optimization experience..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Evaluation Notes</label>
                <textarea
                  rows={2}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Additional observations, candidate demeanor, CTC negotiation readiness..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={feedbackSaving}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {feedbackSaving ? 'Saving Scorecard…' : 'Submit Evaluation Scorecard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
