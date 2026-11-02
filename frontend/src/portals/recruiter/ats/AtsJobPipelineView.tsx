import { useState, useEffect } from 'react';
import {
  Briefcase,
  Eye,
  MessageSquare,
  Clock,
  MapPin,
  AlertCircle,
  RefreshCw,
  Plus,
  History,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Check,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';
import { PdfResumeViewerModal } from '../../../shared/ui/PdfResumeViewerModal';

export function AtsJobPipelineView({ initialJobId }: { initialJobId?: string }) {
  const queryJob = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('job') : null;
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || queryJob || '');
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [movingApp, setMovingApp] = useState<{ id: string; targetStage: string } | null>(null);
  const [moveReason, setMoveReason] = useState('');
  const [resumePreview, setResumePreview] = useState<{ applicationId?: string; candidateId?: string; leadId?: string; title?: string; filename?: string } | null>(null);

  // Notes drawer
  const [noteApp, setNoteApp] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // Application Stage History Modal
  const [historyApp, setHistoryApp] = useState<any | null>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Attach Candidate Modal
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [attachForm, setAttachForm] = useState({ candidateEmail: '', candidateName: '', phone: '', source: 'Recruiter ATS' });
  const [attachSaving, setAttachSaving] = useState(false);
  const [attachError, setAttachError] = useState('');
  const [attachSuccess, setAttachSuccess] = useState('');

  // ATS Match Breakdown Drawer & Auto-Shortlist State
  const [scoreDrawerCandidate, setScoreDrawerCandidate] = useState<any | null>(null);
  const [autoShortlisting, setAutoShortlisting] = useState(false);
  const [autoShortlistMessage, setAutoShortlistMessage] = useState<string | null>(null);

  // 1. Load jobs list for the selector
  useEffect(() => {
    (async () => {
      try {
        const res: any = await atsApi.jobs('?pageSize=50');
        const list = res?.data?.items || res?.data || [];
        setJobs(list);
        if (!selectedJobId && list.length > 0) {
          setSelectedJobId(list[0].id);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load jobs list.');
      }
    })();
  }, []);

  // 2. Load pipeline whenever selectedJobId changes
  const loadPipeline = async (jobId: string) => {
    if (!jobId) return;
    setLoading(true);
    setError('');
    try {
      const res: any = await atsApi.jobPipeline(jobId);
      if (res?.data) {
        setPipelineData(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load recruitment pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      loadPipeline(selectedJobId);
    }
  }, [selectedJobId]);

  // Drag and Drop handlers
  const handleDragStart = (appId: string) => {
    setDraggedAppId(appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageName: string) => {
    if (!draggedAppId) return;
    const appId = draggedAppId;
    setDraggedAppId(null);
    setMovingApp({ id: appId, targetStage: stageName });
    setMoveReason('');
  };

  const confirmMove = async () => {
    if (!movingApp) return;
    const { id, targetStage } = movingApp;

    // Optimistic UI update so card moves immediately
    setPipelineData((prev: any) => {
      if (!prev?.columns) return prev;
      let movingCand: any = null;
      const newCols = prev.columns.map((col: any) => {
        const found = col.candidates.find((c: any) => c.id === id);
        if (found) {
          movingCand = { ...found, stage: targetStage, daysInStage: 0 };
          return {
            ...col,
            count: Math.max(0, col.count - 1),
            candidates: col.candidates.filter((c: any) => c.id !== id),
          };
        }
        return col;
      });
      if (movingCand) {
        return {
          ...prev,
          columns: newCols.map((col: any) => {
            if (col.stageName === targetStage) {
              return {
                ...col,
                count: col.count + 1,
                candidates: [movingCand, ...col.candidates],
              };
            }
            return col;
          }),
        };
      }
      return prev;
    });

    try {
      await atsApi.moveStage(id, targetStage, moveReason);
      setMovingApp(null);
      setMoveReason('');
      if (selectedJobId) loadPipeline(selectedJobId);
    } catch (err: any) {
      if (selectedJobId) loadPipeline(selectedJobId);
      alert(`Move failed: ${err?.message || err}`);
    }
  };

  const handleBulkAutoShortlist = async () => {
    if (!selectedJobId) return;
    setAutoShortlisting(true);
    setAutoShortlistMessage(null);
    try {
      const res: any = await atsApi.autoShortlistJob(selectedJobId);
      const count = res?.data?.shortlistedCount ?? res?.count ?? 0;
      setAutoShortlistMessage(`Successfully promoted ${count} qualified candidate${count === 1 ? '' : 's'} to Shortlisted!`);
      setTimeout(() => setAutoShortlistMessage(null), 5000);
      await loadPipeline(selectedJobId);
    } catch (err: any) {
      alert(`Auto-shortlist failed: ${err?.response?.data?.message || err?.message || 'Error occurred'}`);
    } finally {
      setAutoShortlisting(false);
    }
  };

  // Open Notes Drawer
  const openNotes = async (candidate: any) => {
    setNoteApp(candidate);
    setNewNote('');
    setNotesLoading(true);
    try {
      const res: any = await atsApi.notes(candidate.id);
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
      await atsApi.addNote(noteApp.id, newNote.trim());
      setNewNote('');
      const res: any = await atsApi.notes(noteApp.id);
      setNotesList(res?.data || []);
    } catch (err: any) {
      alert(`Note failed: ${err?.message || err}`);
    }
  };

  // Open Stage Transition History Timeline
  const openHistory = async (candidate: any) => {
    setHistoryApp(candidate);
    setHistoryLoading(true);
    try {
      const res: any = await atsApi.applicationHistory(candidate.id);
      setHistoryList(res?.data || []);
    } catch {
      setHistoryList([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Attach Candidate Handler
  const handleAttachCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !attachForm.candidateEmail) return;
    setAttachSaving(true);
    setAttachError('');
    setAttachSuccess('');
    try {
      const res: any = await atsApi.createApplication({
        jobId: selectedJobId,
        candidateEmail: attachForm.candidateEmail.trim(),
        candidateName: attachForm.candidateName.trim() || undefined,
        phone: attachForm.phone.trim() || undefined,
        source: attachForm.source,
      });
      if (res?.data) {
        setAttachSuccess('Candidate successfully attached to this mandate!');
        loadPipeline(selectedJobId);
        setTimeout(() => {
          setShowAttachModal(false);
          setAttachSuccess('');
          setAttachForm({ candidateEmail: '', candidateName: '', phone: '', source: 'Recruiter ATS' });
        }, 1200);
      }
    } catch (err: any) {
      setAttachError(err?.response?.data?.message || err?.message || 'Failed to attach candidate.');
    } finally {
      setAttachSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Job Mandate Selector */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Job Pipeline Kanban</h3>
          <p className="text-xs text-slate-500 font-medium">Drag-and-drop applicant cards across configurable recruitment stages</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="ats-job-select" className="text-xs font-bold text-slate-600 shrink-0">Mandate:</label>
          <select
            id="ats-job-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF] max-w-xs md:max-w-md truncate"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.totalApplicants || j.applicantsCount || 0} applicants)
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => loadPipeline(selectedJobId)}
            title="Refresh board"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setShowAttachModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Plus size={14} /> Attach Candidate
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 shadow-sm">
          <InlineLoading message="Loading recruitment pipeline Kanban board…" />
        </div>
      )}

      {!loading && error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-2">
          <AlertCircle size={28} className="mx-auto text-red-500" />
          <h4 className="text-sm font-bold text-red-800">Pipeline Error</h4>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Auto-Shortlist Feedback Message */}
      {autoShortlistMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{autoShortlistMessage}</span>
          </div>
          <button type="button" onClick={() => setAutoShortlistMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1-Click Auto-Shortlist Action Banner */}
      {!loading && !error && pipelineData?.summary && pipelineData.summary.shortlistEligibleCount > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300/80 rounded-3xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Zap size={20} className="fill-current text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  ATS Shortlist Qualification Gate
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px]">
                  Threshold: {pipelineData.summary.threshold}%
                </span>
              </div>
              <p className="text-xs text-emerald-900 font-medium mt-0.5">
                <strong className="font-extrabold text-emerald-950">{pipelineData.summary.shortlistEligibleCount}</strong> candidates meet or exceed the qualification threshold and are ready to advance to Shortlisted.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={autoShortlisting}
            onClick={handleBulkAutoShortlist}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-60"
          >
            {autoShortlisting ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Shortlisting…
              </>
            ) : (
              <>
                <Zap size={14} className="fill-current text-amber-300" /> Shortlist All {pipelineData.summary.shortlistEligibleCount} Qualified
              </>
            )}
          </button>
        </div>
      )}

      {/* Kanban Board Columns */}
      {!loading && !error && pipelineData && (
        <div className="overflow-x-auto pb-4" data-lenis-prevent>
          <div className="flex gap-4 min-w-[1200px] items-start">
            {pipelineData.columns.map((col: any, colIdx: number) => (
              <div
                key={col.stageId}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.stageName)}
                className="flex-1 min-w-[220px] max-w-[260px] bg-slate-100/70 rounded-3xl border border-slate-200 p-3 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0265FF]" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide truncate max-w-[140px]">
                      {col.stageName}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 font-extrabold text-[11px] border border-slate-200 tabular-nums">
                    {col.count}
                  </span>
                </div>

                {/* Candidate Cards Column Container */}
                <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                  {col.candidates.length === 0 ? (
                    <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <p className="text-[11px] text-slate-400 font-medium">Drop candidates here</p>
                    </div>
                  ) : (
                    col.candidates.map((c: any) => (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={() => handleDragStart(c.id)}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#0265FF] hover:shadow transition-all cursor-grab active:cursor-grabbing space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-[#0265FF] transition-colors truncate">
                              {c.candidateName}
                            </h5>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* ATS Score Gauge Badge */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setScoreDrawerCandidate(c);
                              }}
                              title="Click to view 5-Pillar ATS Match Breakdown"
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 shrink-0 cursor-pointer transition-all hover:scale-105 ${
                                (c.matchScore ?? 0) >= (pipelineData?.summary?.threshold || 75)
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : (c.matchScore ?? 0) >= 50
                                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{c.matchScore ?? 0}%</span>
                            </button>

                            {c.daysInStage >= 7 ? (
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold shrink-0 flex items-center gap-1" title="Candidate stagnant in this stage for 7+ days">
                                <AlertTriangle size={10} className="text-rose-600" /> {c.daysInStage}d
                              </span>
                            ) : c.daysInStage > 4 ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 flex items-center gap-0.5">
                                <Clock size={10} /> {c.daysInStage}d
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold tabular-nums shrink-0">
                                {c.daysInStage}d
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Badges row: Notice period & Tier */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {c.tier ? (
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                              c.tier === 'Gold' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              c.tier === 'Silver' ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                              'bg-orange-50 text-orange-800 border border-orange-200'
                            }`}>
                              ★ {c.tier}
                            </span>
                          ) : (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              (c.matchScore ?? 0) >= 85 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              (c.matchScore ?? 0) >= 70 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {(c.matchScore ?? 0) >= 85 ? '★ Top Tier' : (c.matchScore ?? 0) >= 70 ? 'Strong Fit' : 'Applicant'}
                            </span>
                          )}

                          {(c.noticePeriod || c.notice_period) && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ⏱ {c.noticePeriod || c.notice_period}
                            </span>
                          )}
                        </div>

                        <div className="space-y-0.5 text-[11px] text-slate-500 font-medium">
                          <p className="truncate flex items-center gap-1">
                            <Briefcase size={11} className="shrink-0 text-slate-400" />
                            <span>{c.experience} exp</span>
                          </p>
                          {c.location && (
                            <p className="truncate flex items-center gap-1">
                              <MapPin size={11} className="shrink-0 text-slate-400" />
                              <span>{c.location}</span>
                            </p>
                          )}
                        </div>

                        {/* Candidate Skills Pill */}
                        {Array.isArray(c.skills) && c.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {c.skills.slice(0, 3).map((sk: string) => (
                              <span key={sk} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          {c.hasResume || c.resumeRef ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setResumePreview({
                                  applicationId: c.id,
                                  candidateId: c.candidateId || c.id,
                                  leadId: c.leadId,
                                  title: `${c.candidateName} — Resume`,
                                  filename: c.resumeName || 'Resume.pdf',
                                });
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0265FF] text-[10px] font-bold border border-blue-200 transition-colors cursor-pointer"
                            >
                              <Eye size={11} />
                              <span>CV</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No CV</span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openHistory(c);
                              }}
                              title="Stage Transition History"
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <History size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openNotes(c);
                              }}
                              title="Recruiter Notes"
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <MessageSquare size={13} />
                            </button>
                            {pipelineData.columns[colIdx + 1] && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMovingApp({ id: c.id, targetStage: pipelineData.columns[colIdx + 1].stageName });
                                  setMoveReason('');
                                }}
                                title={`Advance to ${pipelineData.columns[colIdx + 1].stageName}`}
                                className="p-1 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                              >
                                <ArrowRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage Move Confirmation Modal */}
      {movingApp && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200 space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">
              Move Candidate to {movingApp.targetStage}?
            </h4>
            <p className="text-xs text-slate-500">
              The candidate will advance in the pipeline. An audit log and stage history will be recorded.
            </p>
            <div className="space-y-1">
              <label htmlFor="ats-move-reason" className="text-xs font-bold text-slate-700">Reason / Note (optional):</label>
              <textarea
                id="ats-move-reason"
                rows={2}
                value={moveReason}
                onChange={(e) => setMoveReason(e.target.value)}
                placeholder="e.g. Cleared technical assessment with strong Go/GCP feedback..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMovingApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmMove}
                className="px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE TRANSITION HISTORY MODAL */}
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

      {/* Recruiter Notes Drawer / Modal */}
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
                placeholder="Add screening feedback or candidate note..."
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

      {/* ATTACH CANDIDATE MODAL */}
      {showAttachModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Attach Candidate to Mandate</h4>
                <p className="text-xs text-slate-500">Duplicate application prevention is strictly enforced.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAttachModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {attachError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" /> {attachError}
              </div>
            )}

            {attachSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" /> {attachSuccess}
              </div>
            )}

            <form onSubmit={handleAttachCandidate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Email *</label>
                <input
                  type="email"
                  required
                  value={attachForm.candidateEmail}
                  onChange={(e) => setAttachForm({ ...attachForm, candidateEmail: e.target.value })}
                  placeholder="candidate@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Name (optional)</label>
                <input
                  type="text"
                  value={attachForm.candidateName}
                  onChange={(e) => setAttachForm({ ...attachForm, candidateName: e.target.value })}
                  placeholder="e.g. Priya Nair"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (optional)</label>
                <input
                  type="tel"
                  value={attachForm.phone}
                  onChange={(e) => setAttachForm({ ...attachForm, phone: e.target.value })}
                  placeholder="+91 90362 27317"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAttachModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={attachSaving}
                  className="px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {attachSaving ? 'Attaching…' : 'Attach to Mandate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate ATS Score Breakdown Drawer / Modal */}
      {scoreDrawerCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md ${
                  (scoreDrawerCandidate.matchScore ?? 0) >= (pipelineData?.summary?.threshold || 75)
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
                      scoreDrawerCandidate.matchTier === 'HIGH' || (scoreDrawerCandidate.matchScore ?? 0) >= (pipelineData?.summary?.threshold || 75)
                        ? 'bg-emerald-100 text-emerald-800'
                        : scoreDrawerCandidate.matchTier === 'MEDIUM' || (scoreDrawerCandidate.matchScore ?? 0) >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {scoreDrawerCandidate.matchTier || 'TIER'} MATCH
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {scoreDrawerCandidate.candidateEmail} &bull; Stage: <strong className="text-slate-800">{scoreDrawerCandidate.stage}</strong>
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

            {/* Threshold & Shortlist Qualification Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              scoreDrawerCandidate.isShortlistEligible || (scoreDrawerCandidate.matchScore ?? 0) >= (pipelineData?.summary?.threshold || 75)
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2.5">
                {scoreDrawerCandidate.isShortlistEligible || (scoreDrawerCandidate.matchScore ?? 0) >= (pipelineData?.summary?.threshold || 75) ? (
                  <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-slate-400 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold">
                    {scoreDrawerCandidate.isShortlistEligible || (scoreDrawerCandidate.matchScore ?? 0) >= (pipelineData?.summary?.threshold || 75)
                      ? 'Qualified for Auto-Shortlist'
                      : 'Under Qualification Threshold'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Mandate threshold: {pipelineData?.summary?.threshold || 75}% match
                  </p>
                </div>
              </div>

              {scoreDrawerCandidate.stage !== 'Shortlisted' && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await atsApi.moveStage(scoreDrawerCandidate.id, 'Shortlisted', 'Shortlisted via ATS Match Inspector');
                      setScoreDrawerCandidate(null);
                      if (selectedJobId) loadPipeline(selectedJobId);
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

            {/* 5-Pillar Score Breakdown Meters */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0265FF]" /> 5-Pillar Algorithmic Scoring Breakdown
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Mandatory Skills (40 pts) */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>1. Mandatory Skills Fit</span>
                    <span className="font-mono text-[#0265FF]">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.mustHaveSkillsScore ?? 0} / 40 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0265FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.mustHaveSkillsScore ?? 0) / 40) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 2. Experience Alignment (25 pts) */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>2. Experience Alignment</span>
                    <span className="font-mono text-emerald-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.experienceScore ?? 0} / 25 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.experienceScore ?? 0) / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 3. Role & Domain Title Fit (15 pts) */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>3. Role & Title Fit</span>
                    <span className="font-mono text-purple-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.titleScore ?? 0} / 15 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.titleScore ?? 0) / 15) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 4. Education Credentials (10 pts) */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>4. Education Fit</span>
                    <span className="font-mono text-amber-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.educationScore ?? 0} / 10 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.educationScore ?? 0) / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 5. Nice-to-Have & Location (10 pts) */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>5. Secondary Skills & Location Fit</span>
                    <span className="font-mono text-teal-600">
                      {scoreDrawerCandidate.atsMatch?.breakdown?.niceToHaveScore ?? 0} / 10 pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((scoreDrawerCandidate.atsMatch?.breakdown?.niceToHaveScore ?? 0) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Matched & Missing Skills Details */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <h5 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Check size={13} /> Matched Must-Have Skills ({scoreDrawerCandidate.atsMatch?.matchedMustHaveSkills?.length || 0})
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {scoreDrawerCandidate.atsMatch?.matchedMustHaveSkills?.length > 0 ? (
                    scoreDrawerCandidate.atsMatch.matchedMustHaveSkills.map((sk: string) => (
                      <span key={sk} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <Check size={11} className="text-emerald-600" /> {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No direct mandatory skills matched.</span>
                  )}
                </div>
              </div>

              {scoreDrawerCandidate.atsMatch?.missingMustHaveSkills?.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <AlertTriangle size={13} /> Missing Mandated Skills ({scoreDrawerCandidate.atsMatch.missingMustHaveSkills.length})
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {scoreDrawerCandidate.atsMatch.missingMustHaveSkills.map((sk: string) => (
                      <span key={sk} className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1">
                        <AlertTriangle size={11} className="text-amber-600" /> {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
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
