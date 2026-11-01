import { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Clock,
  MessageSquare,
  History,
  Briefcase,
  X,
  Sparkles,
  Check,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';
import { PdfResumeViewerModal } from '../../../shared/ui/PdfResumeViewerModal';

export function AtsApplicantsView() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [sortBy, setSortBy] = useState<'score_desc' | 'newest' | 'oldest'>('score_desc');
  const [scoreDrawerCandidate, setScoreDrawerCandidate] = useState<any | null>(null);

  // Selected Candidate / App modals
  const [resumePreview, setResumePreview] = useState<{ applicationId?: string; candidateId?: string; leadId?: string; title?: string; filename?: string } | null>(null);
  const [noteApp, setNoteApp] = useState<any | null>(null);
  const [notesList, setNotesList] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  const [historyApp, setHistoryApp] = useState<any | null>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Stage change modal
  const [movingApp, setMovingApp] = useState<any | null>(null);
  const [nextStage, setNextStage] = useState('');
  const [moveReason, setMoveReason] = useState('');
  const [moveSaving, setMoveSaving] = useState(false);

  // 1. Load jobs for selector
  useEffect(() => {
    (async () => {
      try {
        const res: any = await atsApi.jobs('?pageSize=50');
        const list = res?.data?.items || res?.data || [];
        setJobs(list);
      } catch { /* noop */ }
    })();
  }, []);

  // 2. Load applicants from pipeline
  const loadApplicants = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedJobId) params.set('jobId', selectedJobId);
      if (stageFilter) params.set('stage', stageFilter);
      if (q.trim()) params.set('q', q.trim());
      params.set('pageSize', '100');

      const res: any = await atsApi.applications(`?${params.toString()}`);
      const list = res?.data || res?.items || [];
      setApplicants(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [selectedJobId, stageFilter, q]);

  // Filtered and sorted applicants
  const filtered = applicants
    .filter((a) => {
      if (stageFilter && a.stage !== stageFilter) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        const match = `${a.candidateName || ''} ${a.candidateEmail || ''} ${a.phone || ''} ${a.jobTitle || ''}`.toLowerCase();
        if (!match.includes(s)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score_desc') {
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      return 0;
    });

  const openNotes = async (app: any) => {
    setNoteApp(app);
    setNewNote('');
    setNotesLoading(true);
    try {
      const res: any = await atsApi.notes(app.applicationId || app.id);
      setNotesList(res?.data || []);
    } catch {
      setNotesList([]);
    } finally {
      setNotesLoading(false);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteApp || !newNote.trim()) return;
    try {
      await atsApi.addNote(noteApp.applicationId || noteApp.id, newNote.trim());
      setNewNote('');
      const res: any = await atsApi.notes(noteApp.applicationId || noteApp.id);
      setNotesList(res?.data || []);
    } catch (err: any) {
      alert(`Note failed: ${err?.message || err}`);
    }
  };

  const openHistory = async (app: any) => {
    setHistoryApp(app);
    setHistoryLoading(true);
    try {
      const res: any = await atsApi.applicationHistory(app.applicationId || app.id);
      setHistoryList(res?.data || []);
    } catch {
      setHistoryList([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleStageChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingApp || !nextStage) return;
    setMoveSaving(true);
    try {
      await atsApi.moveStage(movingApp.applicationId || movingApp.id, nextStage, moveReason);
      setMovingApp(null);
      setMoveReason('');
      loadApplicants();
    } catch (err: any) {
      alert(`Stage update failed: ${err?.message || err}`);
    } finally {
      setMoveSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Job Applicants View</h3>
            <p className="text-xs text-slate-500 font-medium">Review, screen, move stages and evaluate applicants across requisitions</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {filtered.length} matching applicants
          </span>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search candidate name, email, phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 text-slate-700 truncate"
            >
              <option value="">All Job Mandates</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.id} — {j.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 text-slate-700"
            >
              <option value="">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Technical Round">Technical Round</option>
              <option value="Client Interview">Client Interview</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold outline-none focus:ring-2 focus:ring-[#0265FF] bg-blue-50/70 text-[#0265FF]"
            >
              <option value="score_desc">⚡ Sort: Highest ATS Match Score</option>
              <option value="newest">📅 Sort: Newest Applications</option>
              <option value="oldest">⏳ Sort: Longest in Pipeline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 shadow-sm">
          <InlineLoading message="Loading candidate applications…" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center space-y-2">
          <Briefcase size={32} className="mx-auto text-slate-400" />
          <h4 className="text-base font-extrabold text-slate-900">No Applicants Found</h4>
          <p className="text-xs text-slate-500">There are no candidates matching your current filter in this mandate.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Target Mandate</th>
                  <th className="py-3.5 px-4">ATS Match</th>
                  <th className="py-3.5 px-4">Recruitment Stage</th>
                  <th className="py-3.5 px-4">Experience & Skills</th>
                  <th className="py-3.5 px-4">Stage Age</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cand) => (
                  <tr key={cand.id || cand.applicationId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{cand.candidateName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{cand.candidateEmail}</div>
                      {cand.phone && <div className="text-[10px] text-slate-400">{cand.phone}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{cand.jobTitle || 'Tech Mandate'}</div>
                      <div className="text-[10px] text-slate-400">{cand.jobId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => setScoreDrawerCandidate(cand)}
                        title="Click to view 5-Pillar ATS breakdown"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border transition hover:scale-105 cursor-pointer ${
                          (cand.matchScore ?? 0) >= 75
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : (cand.matchScore ?? 0) >= 50
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{cand.matchScore ?? 0}%</span>
                        {cand.isShortlistEligible && (
                          <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-200 text-emerald-950 font-black">
                            Pass
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-[#0265FF] border border-blue-200">
                        {cand.stage}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-semibold">{cand.experienceYears ? `${cand.experienceYears}y exp` : (cand.experience || '3-5y')}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {Array.isArray(cand.skills) ? cand.skills.join(', ') : (cand.skills || 'Tech Talent')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-500 font-mono flex items-center gap-1">
                        <Clock size={11} className="text-slate-400" />
                        {cand.daysInStage} days
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {(cand.hasResume || cand.resumeRef) && (
                          <button
                            type="button"
                            onClick={() => {
                              setResumePreview({
                                applicationId: cand.applicationId || cand.id,
                                candidateId: cand.candidateId || cand.id,
                                leadId: cand.leadId,
                                title: `${cand.candidateName || cand.name} — Resume`,
                                filename: cand.resumeName || 'Resume.pdf',
                              });
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-[#0265FF] hover:bg-blue-100 border border-blue-200 cursor-pointer"
                            title="Preview PDF CV"
                          >
                            <Eye size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setMovingApp(cand);
                            setNextStage(cand.stage);
                            setMoveReason('');
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                        >
                          Move Stage
                        </button>
                        <button
                          type="button"
                          onClick={() => openHistory(cand)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          title="View Stage Transition History"
                        >
                          <History size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openNotes(cand)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          title="Recruiter Notes"
                        >
                          <MessageSquare size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOVE STAGE MODAL */}
      {movingApp && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200 space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">
              Move Candidate Stage
            </h4>
            <p className="text-xs text-slate-500">
              Update {movingApp.candidateName}'s recruitment stage. An audit log will be appended.
            </p>

            <form onSubmit={handleStageChange} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Stage *</label>
                <select
                  value={nextStage}
                  onChange={(e) => setNextStage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-[#0265FF]"
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="Client Interview">Client Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason / Feedback Notes</label>
                <textarea
                  rows={2}
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  placeholder="e.g. Cleared technical interview with high ratings..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMovingApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={moveSaving}
                  className="px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold shadow-md cursor-pointer"
                >
                  {moveSaving ? 'Moving…' : 'Update Stage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAGE HISTORY MODAL */}
      {historyApp && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Stage Transition Audit History</h4>
                <p className="text-xs text-slate-500 font-medium">{historyApp.candidateName}</p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryApp(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {historyLoading ? (
                <p className="text-xs text-slate-400 italic text-center py-4">Loading transition logs...</p>
              ) : historyList.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No stage transitions recorded yet.</p>
              ) : (
                historyList.map((h: any) => (
                  <div key={h.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-extrabold text-slate-900">
                      <span>{h.from} → <strong className="text-[#0265FF]">{h.to}</strong></span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {h.createdAt ? new Date(h.createdAt).toLocaleDateString('en-IN') : ''}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">By: {h.actor}</div>
                    {h.reason && (
                      <div className="text-slate-700 bg-white p-2 rounded-xl border border-slate-200 mt-1 font-medium">
                        "{h.reason}"
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      {noteApp && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Recruiter Evaluation Notes</h4>
                <p className="text-xs text-slate-500 font-medium">{noteApp.candidateName}</p>
              </div>
              <button
                type="button"
                onClick={() => setNoteApp(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {notesLoading ? (
                <p className="text-xs text-slate-400 italic text-center py-4">Loading notes...</p>
              ) : notesList.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No notes added yet.</p>
              ) : (
                notesList.map((n: any) => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{n.authorName || n.authorEmail}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN') : ''}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={addNote} className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add screening feedback or note..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#0265FF]"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="px-4 py-2 rounded-xl bg-[#0265FF] text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Candidate ATS Score Breakdown Drawer / Modal */}
      {scoreDrawerCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md ${
                  (scoreDrawerCandidate.matchScore ?? 0) >= 75
                    ? 'bg-emerald-600'
                    : (scoreDrawerCandidate.matchScore ?? 0) >= 50
                    ? 'bg-amber-500'
                    : 'bg-slate-500'
                }`}>
                  {scoreDrawerCandidate.matchScore ?? 0}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {scoreDrawerCandidate.candidateName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      scoreDrawerCandidate.matchTier === 'HIGH' || (scoreDrawerCandidate.matchScore ?? 0) >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : scoreDrawerCandidate.matchTier === 'MEDIUM' || (scoreDrawerCandidate.matchScore ?? 0) >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {scoreDrawerCandidate.matchTier || 'TIER'} MATCH
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {scoreDrawerCandidate.candidateEmail} &bull; Mandate: <strong className="text-slate-800">{scoreDrawerCandidate.jobTitle || scoreDrawerCandidate.jobId}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setScoreDrawerCandidate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Threshold & Qualification */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              scoreDrawerCandidate.isShortlistEligible || (scoreDrawerCandidate.matchScore ?? 0) >= 75
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2.5">
                {scoreDrawerCandidate.isShortlistEligible || (scoreDrawerCandidate.matchScore ?? 0) >= 75 ? (
                  <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-slate-400 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold">
                    {scoreDrawerCandidate.isShortlistEligible || (scoreDrawerCandidate.matchScore ?? 0) >= 75
                      ? 'Qualified for Shortlisting'
                      : 'Under Mandatory Qualification Threshold'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Mandate Target Threshold: 75% Match
                  </p>
                </div>
              </div>

              {scoreDrawerCandidate.stage !== 'Shortlisted' && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await atsApi.moveStage(scoreDrawerCandidate.id || scoreDrawerCandidate.applicationId, 'Shortlisted', 'Shortlisted via ATS Applicants Review');
                      setScoreDrawerCandidate(null);
                      loadApplicants();
                    } catch (err: any) {
                      alert(`Failed to move: ${err?.message || err}`);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm cursor-pointer"
                >
                  Move to Shortlisted
                </button>
              )}
            </div>

            {/* 5-Pillar Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0265FF]" /> 5-Pillar Algorithmic Scoring Breakdown
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>1. Mandatory Skills Fit</span>
                    <span className="font-mono text-[#0265FF]">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.mustHaveSkillsScore ?? (scoreDrawerCandidate.matchScore ? Math.round((scoreDrawerCandidate.matchScore * 0.4)) : 0)} / 40 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0265FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (((scoreDrawerCandidate.atsMatch?.breakdown?.mustHaveSkillsScore ?? (scoreDrawerCandidate.matchScore ? Math.round((scoreDrawerCandidate.matchScore * 0.4)) : 0)) / 40) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>2. Experience Alignment</span>
                    <span className="font-mono text-emerald-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.experienceScore ?? (scoreDrawerCandidate.matchScore ? Math.round((scoreDrawerCandidate.matchScore * 0.25)) : 0)} / 25 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (((scoreDrawerCandidate.atsMatch?.breakdown?.experienceScore ?? (scoreDrawerCandidate.matchScore ? Math.round((scoreDrawerCandidate.matchScore * 0.25)) : 0)) / 25) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>3. Role & Title Fit</span>
                    <span className="font-mono text-purple-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.titleScore ?? 12} / 15 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.titleScore ?? 12) / 15) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>4. Education Fit</span>
                    <span className="font-mono text-amber-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.educationScore ?? 8} / 10 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.educationScore ?? 8) / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>5. Secondary Skills & Location Fit</span>
                    <span className="font-mono text-teal-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.niceToHaveScore ?? 7} / 10 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.niceToHaveScore ?? 7) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Matched skills */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <h5 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Check size={13} /> Matched Must-Have Skills ({scoreDrawerCandidate.atsMatch?.matchedMustHaveSkills?.length || (Array.isArray(scoreDrawerCandidate.skills) ? scoreDrawerCandidate.skills.length : 0)})
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {(scoreDrawerCandidate.atsMatch?.matchedMustHaveSkills || (Array.isArray(scoreDrawerCandidate.skills) ? scoreDrawerCandidate.skills : [])).map((sk: string) => (
                    <span key={sk} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <Check size={11} className="text-emerald-600" /> {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setScoreDrawerCandidate(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded PDF Resume Viewer Modal */}
      <PdfResumeViewerModal
        open={resumePreview !== null}
        onClose={() => setResumePreview(null)}
        title={resumePreview?.title || 'Resume Document'}
        filename={resumePreview?.filename || 'Resume.pdf'}
        applicationId={resumePreview?.applicationId}
        candidateId={resumePreview?.candidateId}
        leadId={resumePreview?.leadId}
      />
    </div>
  );
}
