import { useState, useEffect } from 'react';
import { Briefcase, Eye, MessageSquare, Clock, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';
import { PdfResumeViewerModal } from '../../../shared/ui/PdfResumeViewerModal';

export function AtsJobPipelineView({ initialJobId }: { initialJobId?: string }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || '');
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [movingApp, setMovingApp] = useState<{ id: string; targetStage: string } | null>(null);
  const [moveReason, setMoveReason] = useState('');
  const [resumePreview, setResumePreview] = useState<{ applicationId?: string; title?: string; filename?: string } | null>(null);
  const [noteApp, setNoteApp] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

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
    try {
      await atsApi.moveStage(movingApp.id, movingApp.targetStage, moveReason);
      setMovingApp(null);
      setMoveReason('');
      if (selectedJobId) loadPipeline(selectedJobId);
    } catch (err: any) {
      alert(`Move failed: ${err?.message || err}`);
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

  return (
    <div className="space-y-5">
      {/* Top Header & Job Mandate Selector */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Job Pipeline Kanban</h3>
          <p className="text-xs text-slate-500 font-medium">Drag-and-drop applicant cards across recruitment stages</p>
        </div>

        <div className="flex items-center gap-2">
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
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
          >
            <RefreshCw size={15} />
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

      {/* Kanban Board Columns */}
      {!loading && !error && pipelineData && (
        <div className="overflow-x-auto pb-4" data-lenis-prevent>
          <div className="flex gap-4 min-w-[1200px] items-start">
            {pipelineData.columns.map((col: any) => (
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
                          <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-[#0265FF] transition-colors truncate">
                            {c.candidateName}
                          </h5>
                          {c.daysInStage > 4 ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 flex items-center gap-0.5">
                              <Clock size={10} /> {c.daysInStage}d
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold tabular-nums shrink-0">
                              {c.daysInStage}d
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
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                          {c.hasResume ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setResumePreview({
                                  applicationId: c.id,
                                  title: `${c.candidateName} — Resume`,
                                  filename: c.resumeName || 'Resume.pdf',
                                });
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0265FF] text-[10px] font-bold border border-blue-200 transition-colors"
                            >
                              <Eye size={11} />
                              <span>Preview CV</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No resume</span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openNotes(c);
                            }}
                            title="Recruiter Notes"
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <MessageSquare size={13} />
                          </button>
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
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmMove}
                className="px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md"
              >
                Confirm Move
              </button>
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
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                ✕
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
                className="px-4 py-2 rounded-xl bg-[#0265FF] text-white font-bold text-xs disabled:opacity-50"
              >
                Add
              </button>
            </form>
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
      />
    </div>
  );
}
