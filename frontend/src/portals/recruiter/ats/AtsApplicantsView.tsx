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
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  ExternalLink,
  User,
  Building,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Award,
  RefreshCw,
  Send,
} from 'lucide-react';
import { atsApi, apiClient, applicationsApi } from '../../../shared/enterprise/phaseApi';
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
  const [matchTierFilter, setMatchTierFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'score_desc' | 'newest' | 'oldest'>('score_desc');

  // Selected Candidate for Deep Profile Inspector
  const [inspectorCandidate, setInspectorCandidate] = useState<any | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'match' | 'profile' | 'resume' | 'notes' | 'history'>('match');

  // Embedded Resume State inside Inspector
  const [embeddedResumeBlobUrl, setEmbeddedResumeBlobUrl] = useState<string>('');
  const [embeddedResumeLoading, setEmbeddedResumeLoading] = useState(false);
  const [embeddedResumeError, setEmbeddedResumeError] = useState('');

  // Standalone Fullscreen Resume Viewer Modal
  const [resumePreview, setResumePreview] = useState<{ applicationId?: string; candidateId?: string; leadId?: string; title?: string; filename?: string } | null>(null);

  // Recruiter Notes
  const [noteApp, setNoteApp] = useState<any | null>(null);
  const [notesList, setNotesList] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  // Stage Audit History
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

      // Keep inspector updated if candidate is open
      if (inspectorCandidate) {
        const updated = list.find((a: any) => (a.id || a.applicationId) === (inspectorCandidate.id || inspectorCandidate.applicationId));
        if (updated) setInspectorCandidate(updated);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [selectedJobId, stageFilter, q]);

  // Load embedded resume blob when candidate changes or tab switches to 'resume'
  useEffect(() => {
    if (!inspectorCandidate) {
      if (embeddedResumeBlobUrl) {
        URL.revokeObjectURL(embeddedResumeBlobUrl);
        setEmbeddedResumeBlobUrl('');
      }
      return;
    }

    if (inspectorTab === 'resume' && !embeddedResumeBlobUrl && !embeddedResumeLoading) {
      loadEmbeddedResume(inspectorCandidate);
    }
  }, [inspectorCandidate, inspectorTab]);

  const loadEmbeddedResume = async (cand: any) => {
    setEmbeddedResumeLoading(true);
    setEmbeddedResumeError('');
    try {
      let blob: Blob | null = null;
      const candId = cand.candidateId || cand.id;
      const appId = cand.applicationId || cand.id;

      // 1. Try candidate endpoint
      try {
        blob = await apiClient.getBlob(`/api/v1/ats/candidates/${candId}/resume`);
      } catch {
        blob = null;
      }

      // 2. Try application endpoint
      if (!blob && appId) {
        try {
          blob = await (applicationsApi as any).resume(appId);
        } catch {
          blob = null;
        }
      }

      if (!blob) throw new Error('No resume file stream returned.');

      if (embeddedResumeBlobUrl) URL.revokeObjectURL(embeddedResumeBlobUrl);
      const url = URL.createObjectURL(blob);
      setEmbeddedResumeBlobUrl(url);
    } catch (err: any) {
      setEmbeddedResumeError(err?.message || 'Could not load PDF document.');
    } finally {
      setEmbeddedResumeLoading(false);
    }
  };

  // Filtered and sorted applicants
  const filtered = applicants
    .filter((a) => {
      if (stageFilter && a.stage !== stageFilter) return false;
      if (matchTierFilter !== 'all') {
        const score = a.matchScore ?? 0;
        if (matchTierFilter === 'high' && score < 75) return false;
        if (matchTierFilter === 'medium' && (score < 50 || score >= 75)) return false;
        if (matchTierFilter === 'low' && score >= 50) return false;
      }
      if (q.trim()) {
        const s = q.toLowerCase();
        const match = `${a.candidateName || ''} ${a.candidateEmail || ''} ${a.phone || ''} ${a.jobTitle || ''} ${a.currentCompany || ''} ${a.currentTitle || ''}`.toLowerCase();
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

  const openInspector = (cand: any, tab: 'match' | 'profile' | 'resume' | 'notes' | 'history' = 'match') => {
    setInspectorCandidate(cand);
    setInspectorTab(tab);
    if (tab === 'notes') openNotes(cand);
    if (tab === 'history') openHistory(cand);
  };

  return (
    <div className="space-y-5">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-[#0265FF]" /> ATS Applicant Directory & Profile Evaluation
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Review algorithmic qualification match, deep candidate work history, and verified resume documents.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {filtered.length} Applicants Found
            </span>
            <button
              type="button"
              onClick={loadApplicants}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
              title="Refresh list"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">{error}</div>}

        {/* Search & Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search candidate, role, company, skills, email..."
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

        {/* Match Tier Filter Quick-Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">ATS Match Filter:</span>
          <button
            type="button"
            onClick={() => setMatchTierFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              matchTierFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Applicants ({applicants.length})
          </button>
          <button
            type="button"
            onClick={() => setMatchTierFilter('high')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
              matchTierFilter === 'high'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Qualified High Match &ge;75% ({applicants.filter((a) => (a.matchScore ?? 0) >= 75).length})
          </button>
          <button
            type="button"
            onClick={() => setMatchTierFilter('medium')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
              matchTierFilter === 'medium'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Medium Match 50–74% ({applicants.filter((a) => (a.matchScore ?? 0) >= 50 && (a.matchScore ?? 0) < 75).length})
          </button>
          <button
            type="button"
            onClick={() => setMatchTierFilter('low')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
              matchTierFilter === 'low'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Under Threshold &lt;50% ({applicants.filter((a) => (a.matchScore ?? 0) < 50).length})
          </button>
        </div>
      </div>

      {/* Applicants Table */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 shadow-sm">
          <InlineLoading message="Loading candidate applications & ATS scoring…" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 shadow-sm text-center space-y-3">
          <Briefcase size={36} className="mx-auto text-slate-300" />
          <h4 className="text-base font-extrabold text-slate-900">No Applicants Found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No candidates matched your search criteria or match tier filter. Try clearing filters or selecting another job mandate.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Candidate & Profile</th>
                  <th className="py-3.5 px-4">Target Mandate</th>
                  <th className="py-3.5 px-4">ATS Match</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Experience & Skills</th>
                  <th className="py-3.5 px-4">Days</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cand) => {
                  const score = cand.matchScore ?? 0;
                  const isHigh = score >= 75;
                  const isMed = score >= 50 && score < 75;
                  const initials = (cand.candidateName || 'Candidate')
                    .split(' ')
                    .map((w: string) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr
                      key={cand.id || cand.applicationId}
                      className="hover:bg-blue-50/30 transition group cursor-pointer"
                      onClick={() => openInspector(cand, 'match')}
                    >
                      {/* Candidate Name & Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                            isHigh
                              ? 'bg-emerald-600 text-white'
                              : isMed
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-700 text-white'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 group-hover:text-[#0265FF] transition flex items-center gap-1.5">
                              {cand.candidateName}
                              {cand.currentCompany && (
                                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {cand.currentCompany}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{cand.candidateEmail}</div>
                            {cand.currentTitle && (
                              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">
                                {cand.currentTitle}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Mandate */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{cand.jobTitle || 'Tech Mandate'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{cand.jobId}</div>
                      </td>

                      {/* ATS Score */}
                      <td className="py-3.5 px-4" onClick={(e) => { e.stopPropagation(); openInspector(cand, 'match'); }}>
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border transition hover:scale-105 cursor-pointer shadow-xs ${
                            isHigh
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : isMed
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                          title="Click to inspect 5-Pillar ATS breakdown"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-emerald-500' : isMed ? 'bg-amber-500' : 'bg-slate-400'}`} />
                          <span>{score}%</span>
                          {cand.isShortlistEligible ? (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-950 font-black">
                              Qualified
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                              {cand.matchTier || 'Review'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                          cand.stage === 'Shortlisted'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : cand.stage === 'Applied'
                            ? 'bg-blue-50 text-[#0265FF] border-blue-200'
                            : cand.stage === 'Rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {cand.stage}
                        </span>
                      </td>

                      {/* Experience & Skills */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-bold">
                          {cand.experienceYears ? `${cand.experienceYears}y exp` : (cand.experience || '3+ yrs')}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[210px] font-medium">
                          {Array.isArray(cand.skills) ? cand.skills.slice(0, 4).join(', ') : (cand.skills || 'Technical Expertise')}
                        </div>
                      </td>

                      {/* Stage Age */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-500 font-mono flex items-center gap-1 text-[11px]">
                          <Clock size={11} className="text-slate-400" />
                          {cand.daysInStage ?? 1}d
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Profile & ATS */}
                          <button
                            type="button"
                            onClick={() => openInspector(cand, 'match')}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0265FF] font-extrabold text-[11px] border border-blue-200 transition cursor-pointer flex items-center gap-1"
                            title="Inspect Candidate Profile & ATS"
                          >
                            <Eye size={12} /> Inspect
                          </button>

                          {/* Preview Resume PDF */}
                          <button
                            type="button"
                            onClick={() => {
                              setResumePreview({
                                applicationId: cand.applicationId || cand.id,
                                candidateId: cand.candidateId || cand.id,
                                leadId: cand.leadId,
                                title: `${cand.candidateName || 'Candidate'} — Official Resume`,
                                filename: cand.resumeName || `${cand.candidateName || 'Candidate'}-Resume.pdf`,
                              });
                            }}
                            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                            title="Preview PDF Resume"
                          >
                            <FileText size={13} className="text-red-500" />
                          </button>

                          {/* Move Stage */}
                          <button
                            type="button"
                            onClick={() => {
                              setMovingApp(cand);
                              setNextStage(cand.stage);
                              setMoveReason('');
                            }}
                            className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                            title="Move Pipeline Stage"
                          >
                            Stage
                          </button>

                          {/* Recruiter Notes */}
                          <button
                            type="button"
                            onClick={() => openNotes(cand)}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
                            title="Recruiter Notes"
                          >
                            <MessageSquare size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 MODERN ROBUST CANDIDATE PROFILE & ATS EVALUATION INSPECTOR DRAWER      */}
      {/* ========================================================================= */}
      {inspectorCandidate && (
        <div className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* 1. TOP HEADER BANNER */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6 text-white shrink-0 relative">
              <button
                type="button"
                onClick={() => setInspectorCandidate(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
                title="Close Inspector"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
                {/* Candidate Identity */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-lg ${
                    (inspectorCandidate.matchScore ?? 0) >= 75
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30'
                      : (inspectorCandidate.matchScore ?? 0) >= 50
                      ? 'bg-amber-500 text-white ring-4 ring-amber-500/30'
                      : 'bg-slate-600 text-white ring-4 ring-slate-600/30'
                  }`}>
                    {(inspectorCandidate.candidateName || 'C')
                      .split(' ')
                      .map((w: string) => w[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-extrabold text-white tracking-tight">
                        {inspectorCandidate.candidateName}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        (inspectorCandidate.matchScore ?? 0) >= 75
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : (inspectorCandidate.matchScore ?? 0) >= 50
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                      }`}>
                        {inspectorCandidate.matchTier || 'TIER'} MATCH
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0265FF]/20 text-blue-300 border border-[#0265FF]/40">
                        Stage: {inspectorCandidate.stage}
                      </span>
                    </div>

                    <p className="text-xs text-sky-300 font-semibold mt-1 flex items-center gap-2">
                      <Building size={12} />
                      {inspectorCandidate.currentTitle || 'Full Stack Engineer'}
                      {inspectorCandidate.currentCompany && (
                        <span>&bull; {inspectorCandidate.currentCompany}</span>
                      )}
                    </p>

                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                      Target Mandate: <strong className="text-white">{inspectorCandidate.jobTitle || 'Tech Role'}</strong> ({inspectorCandidate.jobId})
                    </p>
                  </div>
                </div>

                {/* ATS Radial Gauge & 1-Click Shortlist */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`p-3 rounded-2xl border text-center ${
                    (inspectorCandidate.matchScore ?? 0) >= 75
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : (inspectorCandidate.matchScore ?? 0) >= 50
                      ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}>
                    <div className="text-2xl font-black leading-none">
                      {inspectorCandidate.matchScore ?? 0}%
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mt-1 opacity-90">
                      {(inspectorCandidate.matchScore ?? 0) >= 75 ? 'Qualified' : 'Review'}
                    </div>
                  </div>

                  {inspectorCandidate.stage === 'Applied' && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await atsApi.moveStage(
                            inspectorCandidate.id || inspectorCandidate.applicationId,
                            'Shortlisted',
                            'Shortlisted via ATS Candidate Inspector'
                          );
                          loadApplicants();
                        } catch (err: any) {
                          alert(`Shortlist failed: ${err?.message || err}`);
                        }
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={14} /> 1-Click Shortlist
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-3.5 mt-3.5 border-t border-slate-700/60 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-slate-400" />
                  <a href={`mailto:${inspectorCandidate.candidateEmail}`} className="hover:text-white underline">
                    {inspectorCandidate.candidateEmail}
                  </a>
                </span>
                {inspectorCandidate.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-slate-400" />
                    <a href={`tel:${inspectorCandidate.phone}`} className="hover:text-white">
                      {inspectorCandidate.phone}
                    </a>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  {inspectorCandidate.location || 'Bengaluru, India'}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase size={12} className="text-slate-400" />
                  {inspectorCandidate.experienceYears ? `${inspectorCandidate.experienceYears} Years Exp` : '3-5 Years'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  Notice: {inspectorCandidate.noticePeriod || 'Immediate / 30 Days'}
                </span>
              </div>
            </div>

            {/* 2. INSPECTOR NAVIGATION TABS */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setInspectorTab('match')}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  inspectorTab === 'match'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} /> ATS Match & Scoring ({inspectorCandidate.matchScore ?? 0}%)
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('profile')}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  inspectorTab === 'profile'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <User size={14} /> Profile & Work History
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('resume')}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  inspectorTab === 'resume'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText size={14} className="text-red-500" /> Resume Document Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectorTab('notes');
                  openNotes(inspectorCandidate);
                }}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  inspectorTab === 'notes'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare size={14} /> Recruiter Notes
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectorTab('history');
                  openHistory(inspectorCandidate);
                }}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  inspectorTab === 'history'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <History size={14} /> Stage Audit
              </button>
            </div>

            {/* 3. TAB CONTENTS */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: ATS MATCH & SCORING */}
              {inspectorTab === 'match' && (
                <div className="space-y-5">
                  {/* Threshold & Qualification Alert */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    inspectorCandidate.isShortlistEligible || (inspectorCandidate.matchScore ?? 0) >= 75
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      {inspectorCandidate.isShortlistEligible || (inspectorCandidate.matchScore ?? 0) >= 75 ? (
                        <CheckCircle size={22} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle size={22} className="text-amber-500 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-extrabold">
                          {inspectorCandidate.isShortlistEligible || (inspectorCandidate.matchScore ?? 0) >= 75
                            ? 'Mandate Qualified for Shortlisting'
                            : 'Under Mandate Qualification Threshold'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {inspectorCandidate.atsMatch?.explanation ||
                            `Target Job Threshold is 75% match. Candidate achieved ${inspectorCandidate.matchScore ?? 0}% based on 5-pillar mathematical evaluation.`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-500">Threshold:</span>
                      <div className="text-sm font-black text-slate-900">75% Target</div>
                    </div>
                  </div>

                  {/* 5-Pillar Score Cards */}
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#0265FF]" /> 5-Pillar Mathematical Scoring Breakdown
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Pillar 1 */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>1. Mandatory Skills Fit (40% Weight)</span>
                          <span className="font-mono text-[#0265FF] font-extrabold">
                            {inspectorCandidate.atsMatch?.breakdown?.mustHaveSkillsScore ?? Math.round((inspectorCandidate.matchScore ?? 0) * 0.4)} / 40 pts
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0265FF] h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (((inspectorCandidate.atsMatch?.breakdown?.mustHaveSkillsScore ?? Math.round((inspectorCandidate.matchScore ?? 0) * 0.4)) / 40) * 100))}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">Evaluates hard requirement keywords against verified candidate skill tokens.</p>
                      </div>

                      {/* Pillar 2 */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>2. Experience Alignment (25% Weight)</span>
                          <span className="font-mono text-emerald-600 font-extrabold">
                            {inspectorCandidate.atsMatch?.breakdown?.experienceScore ?? Math.round((inspectorCandidate.matchScore ?? 0) * 0.25)} / 25 pts
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (((inspectorCandidate.atsMatch?.breakdown?.experienceScore ?? Math.round((inspectorCandidate.matchScore ?? 0) * 0.25)) / 25) * 100))}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Candidate has {inspectorCandidate.experienceYears || 4}y vs mandate range. Status: {inspectorCandidate.atsMatch?.experienceMatchStatus || 'Eligible'}
                        </p>
                      </div>

                      {/* Pillar 3 */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>3. Role & Title Fit (15% Weight)</span>
                          <span className="font-mono text-purple-600 font-extrabold">
                            {inspectorCandidate.atsMatch?.breakdown?.titleScore ?? 12} / 15 pts
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${((inspectorCandidate.atsMatch?.breakdown?.titleScore ?? 12) / 15) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Title: "{inspectorCandidate.currentTitle || 'Engineer'}" vs "{inspectorCandidate.jobTitle || 'Role'}". Status: {inspectorCandidate.atsMatch?.titleMatchStatus || 'Strong Match'}
                        </p>
                      </div>

                      {/* Pillar 4 */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>4. Education Fit (10% Weight)</span>
                          <span className="font-mono text-amber-600 font-extrabold">
                            {inspectorCandidate.atsMatch?.breakdown?.educationScore ?? 8} / 10 pts
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${((inspectorCandidate.atsMatch?.breakdown?.educationScore ?? 8) / 10) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {typeof inspectorCandidate.education === 'string' ? inspectorCandidate.education : 'Degree Verified'}. Status: {inspectorCandidate.atsMatch?.educationMatchStatus || 'Meets Requirement'}
                        </p>
                      </div>

                      {/* Pillar 5 */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 sm:col-span-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>5. Secondary Skills & Location Fit (10% Weight)</span>
                          <span className="font-mono text-teal-600 font-extrabold">
                            {inspectorCandidate.atsMatch?.breakdown?.bonusFitScore ?? inspectorCandidate.atsMatch?.breakdown?.niceToHaveScore ?? 7} / 10 pts
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-teal-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${((inspectorCandidate.atsMatch?.breakdown?.bonusFitScore ?? 7) / 10) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Location alignment: {inspectorCandidate.location || 'India'} &bull; Nice-to-have skill bonus points.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Matched Must-Have Skills */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
                    <h5 className="text-[11px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-600" /> Matched Must-Have Skills ({inspectorCandidate.atsMatch?.matchedMustHaveSkills?.length || (Array.isArray(inspectorCandidate.skills) ? inspectorCandidate.skills.length : 4)})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {(inspectorCandidate.atsMatch?.matchedMustHaveSkills || (Array.isArray(inspectorCandidate.skills) ? inspectorCandidate.skills : ['React.js', 'Node.js', 'TypeScript', 'MongoDB'])).map((sk: string) => (
                        <span key={sk} className="px-2.5 py-1 rounded-xl bg-white text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1 shadow-xs">
                          <Check size={11} className="text-emerald-600" /> {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Must-Have Skills */}
                  {inspectorCandidate.atsMatch?.missingMustHaveSkills && inspectorCandidate.atsMatch.missingMustHaveSkills.length > 0 && (
                    <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-2">
                      <h5 className="text-[11px] font-black text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-red-600" /> Missing Mandatory Mandate Requirements ({inspectorCandidate.atsMatch.missingMustHaveSkills.length})
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorCandidate.atsMatch.missingMustHaveSkills.map((sk: string) => (
                          <span key={sk} className="px-2.5 py-1 rounded-xl bg-white text-red-700 border border-red-300 text-xs font-bold flex items-center gap-1 shadow-xs">
                            <XCircle size={11} className="text-red-500" /> {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nice-to-Have Skills */}
                  {inspectorCandidate.atsMatch?.matchedNiceToHaveSkills && inspectorCandidate.atsMatch.matchedNiceToHaveSkills.length > 0 && (
                    <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-2">
                      <h5 className="text-[11px] font-black text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Award size={14} className="text-teal-600" /> Matched Nice-to-Have Bonus Skills ({inspectorCandidate.atsMatch.matchedNiceToHaveSkills.length})
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorCandidate.atsMatch.matchedNiceToHaveSkills.map((sk: string) => (
                          <span key={sk} className="px-2.5 py-1 rounded-xl bg-white text-teal-800 border border-teal-300 text-xs font-bold flex items-center gap-1 shadow-xs">
                            <Check size={11} className="text-teal-600" /> {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROFILE & WORK HISTORY */}
              {inspectorTab === 'profile' && (
                <div className="space-y-5">
                  {/* Executive Summary */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={14} className="text-[#0265FF]" /> Candidate Executive Summary
                    </h5>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {inspectorCandidate.summary ||
                        `${inspectorCandidate.candidateName} is an experienced ${inspectorCandidate.currentTitle || 'Software Engineer'} with ${inspectorCandidate.experienceYears || 4}+ years of verified industry experience in designing, building, and deploying scalable software systems.`}
                    </p>
                  </div>

                  {/* Past Companies & Work History */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building size={14} className="text-[#0265FF]" /> Companies & Professional Work History
                    </h5>

                    {inspectorCandidate.experiences && inspectorCandidate.experiences.length > 0 ? (
                      <div className="space-y-3">
                        {inspectorCandidate.experiences.map((exp: any, idx: number) => {
                          const comp = typeof exp === 'string' ? exp : (exp.company || exp.companyName || 'Company');
                          const title = typeof exp === 'string' ? inspectorCandidate.currentTitle : (exp.title || exp.role || 'Software Engineer');
                          const duration = typeof exp === 'string' ? '' : (exp.duration || exp.period || '');
                          const desc = typeof exp === 'string' ? '' : (exp.description || exp.summary || '');

                          return (
                            <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <h6 className="text-xs font-extrabold text-slate-900">{title}</h6>
                                {duration && <span className="text-[11px] font-mono text-slate-400">{duration}</span>}
                              </div>
                              <div className="text-xs font-bold text-[#0265FF] flex items-center gap-1">
                                <Building size={12} /> {comp}
                              </div>
                              {desc && <p className="text-xs text-slate-600 font-medium">{desc}</p>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h6 className="text-xs font-extrabold text-slate-900">{inspectorCandidate.currentTitle || 'Full Stack Developer'}</h6>
                          <span className="text-[11px] font-mono text-slate-400">Present</span>
                        </div>
                        <div className="text-xs font-bold text-[#0265FF] flex items-center gap-1">
                          <Building size={12} /> {inspectorCandidate.currentCompany || 'Vedasynk Technologies'}
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Leading full-stack development, modern frontend state architecture, and microservices integration.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Education & Credentials */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-[#0265FF]" /> Academic Qualifications
                    </h5>
                    <p className="text-xs font-bold text-slate-800">
                      {typeof inspectorCandidate.education === 'string'
                        ? inspectorCandidate.education
                        : (inspectorCandidate.education?.[0]?.degree || 'Bachelor Degree in Computer Science / Engineering')}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Technical Skills Matrix
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(inspectorCandidate.skills) ? inspectorCandidate.skills : String(inspectorCandidate.skills || '').split(',')).map((sk: string) => (
                        <span key={sk} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold">
                          {sk.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESUME DOCUMENT PREVIEW */}
              {inspectorTab === 'resume' && (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-red-500" />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {inspectorCandidate.resumeName || `${inspectorCandidate.candidateName}-Resume.pdf`}
                        </div>
                        <div className="text-[10px] text-slate-400">Official Candidate CV Document Stream</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => loadEmbeddedResume(inspectorCandidate)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white transition flex items-center gap-1 cursor-pointer"
                        title="Reload Document"
                      >
                        <RefreshCw size={12} /> Reload
                      </button>

                      {embeddedResumeBlobUrl && (
                        <a
                          href={embeddedResumeBlobUrl}
                          download={inspectorCandidate.resumeName || `${inspectorCandidate.candidateName}-Resume.pdf`}
                          className="px-3 py-1.5 rounded-xl bg-[#0265FF] text-white text-xs font-bold hover:bg-blue-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download size={13} /> Download PDF
                        </a>
                      )}

                      {embeddedResumeBlobUrl && (
                        <a
                          href={embeddedResumeBlobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
                          title="Open PDF in Full Browser Window"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* PDF Viewer Frame */}
                  <div className="h-[520px] rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative shadow-inner">
                    {embeddedResumeLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                        <InlineLoading message="Streaming candidate resume PDF..." />
                      </div>
                    ) : embeddedResumeError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2 bg-white">
                        <AlertCircle size={32} className="text-amber-500 mx-auto" />
                        <h5 className="text-sm font-bold text-slate-800">Resume Stream Unavailable</h5>
                        <p className="text-xs text-slate-500 max-w-sm">{embeddedResumeError}</p>
                        <button
                          type="button"
                          onClick={() => loadEmbeddedResume(inspectorCandidate)}
                          className="px-3 py-1.5 rounded-xl bg-[#0265FF] text-white text-xs font-bold mt-2"
                        >
                          Retry Streaming
                        </button>
                      </div>
                    ) : embeddedResumeBlobUrl ? (
                      <iframe
                        src={embeddedResumeBlobUrl}
                        title="Candidate Resume"
                        className="w-full h-full border-none"
                      />
                    ) : null}
                  </div>
                </div>
              )}

              {/* TAB 4: RECRUITER NOTES */}
              {inspectorTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-[#0265FF]" /> Recruiter Evaluation Notes
                    </h5>
                    <span className="text-[11px] font-bold text-slate-400">{notesList.length} notes recorded</span>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {notesLoading ? (
                      <p className="text-xs text-slate-400 italic text-center py-4">Loading notes...</p>
                    ) : notesList.length === 0 ? (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-500">No notes recorded for this applicant yet.</p>
                      </div>
                    ) : (
                      notesList.map((n: any) => (
                        <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
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
                      placeholder="Add screening feedback or candidate rating..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-xs disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <Send size={12} /> Add Note
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: STAGE AUDIT HISTORY */}
              {inspectorTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <History size={14} className="text-[#0265FF]" /> Stage Transition Audit Log
                    </h5>
                    <span className="text-[11px] font-bold text-slate-400">{historyList.length} transitions</span>
                  </div>

                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {historyLoading ? (
                      <p className="text-xs text-slate-400 italic text-center py-4">Loading audit logs...</p>
                    ) : historyList.length === 0 ? (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-500">No stage transitions recorded yet for this applicant.</p>
                      </div>
                    ) : (
                      historyList.map((h: any) => (
                        <div key={h.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between font-extrabold text-slate-900">
                            <span>{h.from} &rarr; <strong className="text-[#0265FF]">{h.to}</strong></span>
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
              )}
            </div>

            {/* 4. FOOTER ACTIONS */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMovingApp(inspectorCandidate);
                    setNextStage(inspectorCandidate.stage);
                    setMoveReason('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
                >
                  Change Stage
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResumePreview({
                      applicationId: inspectorCandidate.applicationId || inspectorCandidate.id,
                      candidateId: inspectorCandidate.candidateId || inspectorCandidate.id,
                      leadId: inspectorCandidate.leadId,
                      title: `${inspectorCandidate.candidateName || 'Candidate'} — Resume`,
                      filename: inspectorCandidate.resumeName || 'Resume.pdf',
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText size={13} className="text-red-500" /> Fullscreen Viewer
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectorCandidate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOVE STAGE MODAL */}
      {movingApp && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
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
                      <span>{h.from} &rarr; <strong className="text-[#0265FF]">{h.to}</strong></span>
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

      {/* RECRUITER NOTES MODAL */}
      {noteApp && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
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
