import { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Briefcase,
  Clock,
  RotateCw,
  Sliders,
  X,
  Layers,
  Search,
  Eye,
  Building2,
  Calendar,
  FolderGit2,
  ExternalLink,
  Globe,
  Award,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';

export interface WorkHistoryEntry {
  company: string;
  role: string;
  duration?: string;
  highlights?: string[];
}

export interface ProjectEntry {
  name: string;
  role?: string;
  technologies?: string;
  highlights?: string[];
}

export interface StagedCandidate {
  id: string;
  parseId?: string;
  filename: string;
  fileRef: string;
  rawBase64?: string;
  fullName: string;
  email: string;
  phone: string;
  totalExperienceYears: number;
  skills: string[];
  skillsByCategory?: {
    backend: string[];
    frontend: string[];
    cloudDevOps: string[];
    database: string[];
    architecture: string[];
    qaTesting: string[];
  };
  education?: string[];
  location: string;
  currentCompany?: string;
  currentTitle: string;
  summary?: string;
  workHistory?: WorkHistoryEntry[];
  projects?: ProjectEntry[];
  coreStrengths?: string[];
  linkedinUrl?: string;
  portfolioSites?: string[];
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  searchTokens?: string[];
  confidenceScore?: number;
  isDuplicate: boolean;
  duplicateReason?: string;
  parsing: boolean;
  error?: string;
}

interface QueueItem {
  id: string;
  filename: string;
  fileRef: string;
  format: string;
  status: 'completed' | 'reviewed' | 'failed' | 'pending';
  createdAt: string;
  processedAt?: string;
  error?: string;
  isDuplicate?: boolean;
  duplicateReason?: string;
  extracted?: any;
}

export function AtsBulkImportView({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'queue'>('upload');
  const [stagedFiles, setStagedFiles] = useState<StagedCandidate[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [targetJobId, setTargetJobId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Queue state
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Modals state
  const [reviewCandidate, setReviewCandidate] = useState<StagedCandidate | null>(null);
  const [detailCandidate, setDetailCandidate] = useState<StagedCandidate | null>(null);

  const loadQueue = async () => {
    setLoadingQueue(true);
    try {
      const res: any = await atsApi.resumeQueue();
      setQueueItems(res?.data || []);
    } catch {
      /* best-effort */
    } finally {
      setLoadingQueue(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res: any = await atsApi.jobs('?pageSize=50');
        const list = res?.data?.items || res?.data || [];
        setJobs(list);
        if (list.length > 0) setTargetJobId(list[0].id);
      } catch {
        /* best-effort */
      }
    })();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'queue') {
      loadQueue();
    }
  }, [activeSubTab]);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    for (const file of fileArray) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const entry: StagedCandidate = {
        id: tempId,
        filename: file.name,
        fileRef: '',
        fullName: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        email: '',
        phone: '',
        totalExperienceYears: 3,
        skills: [],
        location: 'India',
        currentTitle: 'Engineer',
        isDuplicate: false,
        parsing: true,
      };

      setStagedFiles((prev) => [entry, ...prev]);

      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;

        try {
          const res: any = await atsApi.parseResume({
            filename: file.name,
            base64Data: base64,
          });

          const ext = res?.data?.extracted;
          setStagedFiles((prev) =>
            prev.map((item) => {
              if (item.id === tempId) {
                return {
                  ...item,
                  rawBase64: base64,
                  parseId: res?.data?.id,
                  fileRef: res?.data?.fileRef || '',
                  fullName: ext?.fullName || item.fullName,
                  email: ext?.email || '',
                  phone: ext?.phone || '',
                  totalExperienceYears: ext?.totalExperienceYears || 3,
                  skills: ext?.skills || [],
                  skillsByCategory: ext?.skillsByCategory,
                  education: ext?.education || [],
                  location: ext?.location || 'India',
                  currentCompany: ext?.currentCompany || '',
                  currentTitle: ext?.currentTitle || 'Professional',
                  summary: ext?.summary || '',
                  workHistory: ext?.workHistory || [],
                  projects: ext?.projects || [],
                  coreStrengths: ext?.coreStrengths || [],
                  linkedinUrl: ext?.linkedinUrl || '',
                  portfolioSites: ext?.portfolioSites || [],
                  currentCtc: ext?.currentCtc || '',
                  expectedCtc: ext?.expectedCtc || '',
                  noticePeriod: ext?.noticePeriod || 'Immediate',
                  searchTokens: ext?.searchTokens || [],
                  confidenceScore: ext?.confidenceScore || 75,
                  isDuplicate: !!res?.data?.isDuplicate,
                  duplicateReason: res?.data?.duplicateReason,
                  parsing: false,
                };
              }
              return item;
            })
          );
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || 'Parse failed';
          setStagedFiles((prev) =>
            prev.map((item) => (item.id === tempId ? { ...item, parsing: false, error: msg } : item))
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeStaged = (id: string) => {
    setStagedFiles((prev) => prev.filter((x) => x.id !== id));
    if (detailCandidate?.id === id) setDetailCandidate(null);
    if (reviewCandidate?.id === id) setReviewCandidate(null);
  };

  const updateCandidateField = (id: string, field: string, val: any) => {
    setStagedFiles((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [field]: val } : x))
    );
  };

  const handleRescanCandidate = async (candidate: StagedCandidate) => {
    if (!candidate.rawBase64) {
      alert('Original file buffer is not available in memory. Please upload the file again.');
      return;
    }
    updateCandidateField(candidate.id, 'parsing', true);
    updateCandidateField(candidate.id, 'error', undefined);

    try {
      const res: any = await atsApi.parseResume({
        filename: candidate.filename,
        base64Data: candidate.rawBase64,
      });

      const ext = res?.data?.extracted;
      if (ext) {
        setStagedFiles((prev) =>
          prev.map((item) => {
            if (item.id === candidate.id) {
              const updated: StagedCandidate = {
                ...item,
                parseId: res?.data?.id || item.parseId,
                fileRef: res?.data?.fileRef || item.fileRef,
                fullName: ext.fullName || item.fullName,
                email: ext.email || item.email,
                phone: ext.phone || item.phone,
                totalExperienceYears: ext.totalExperienceYears || item.totalExperienceYears,
                skills: ext.skills || item.skills,
                skillsByCategory: ext.skillsByCategory || item.skillsByCategory,
                education: ext.education || item.education,
                location: ext.location || item.location,
                currentCompany: ext.currentCompany || item.currentCompany,
                currentTitle: ext.currentTitle || item.currentTitle,
                summary: ext.summary || item.summary,
                workHistory: ext.workHistory || item.workHistory,
                projects: ext.projects || item.projects,
                coreStrengths: ext.coreStrengths || item.coreStrengths,
                linkedinUrl: ext.linkedinUrl || item.linkedinUrl,
                portfolioSites: ext.portfolioSites || item.portfolioSites,
                currentCtc: ext.currentCtc || item.currentCtc,
                expectedCtc: ext.expectedCtc || item.expectedCtc,
                noticePeriod: ext.noticePeriod || item.noticePeriod,
                searchTokens: ext.searchTokens || item.searchTokens,
                confidenceScore: ext.confidenceScore || item.confidenceScore,
                parsing: false,
                error: undefined,
              };
              if (detailCandidate?.id === candidate.id) setDetailCandidate(updated);
              if (reviewCandidate?.id === candidate.id) setReviewCandidate(updated);
              return updated;
            }
            return item;
          })
        );
      }
    } catch (err: any) {
      updateCandidateField(candidate.id, 'parsing', false);
      updateCandidateField(candidate.id, 'error', err?.response?.data?.message || err?.message || 'Re-scan failed');
    }
  };

  const handleBulkImport = async () => {
    if (!stagedFiles.length) return;
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const candidatesPayload = stagedFiles.map((c) => ({
        fullName: c.fullName,
        email: c.email || `${c.fullName.toLowerCase().replace(/\s+/g, '')}@applicant.local`,
        phone: c.phone,
        totalExperienceYears: c.totalExperienceYears,
        skills: c.skills,
        location: c.location,
        currentTitle: c.currentTitle,
        currentCompany: c.currentCompany,
        summary: c.summary,
        workHistory: c.workHistory,
        projects: c.projects,
        coreStrengths: c.coreStrengths,
        linkedinUrl: c.linkedinUrl,
        portfolioSites: c.portfolioSites,
        currentCtc: c.currentCtc,
        expectedCtc: c.expectedCtc,
        noticePeriod: c.noticePeriod,
        fileRef: c.fileRef,
        filename: c.filename,
      }));

      const res: any = await atsApi.bulkCreateCandidates({
        candidates: candidatesPayload,
        jobId: targetJobId || undefined,
      });

      setSuccessMsg(`Successfully imported ${res?.count || candidatesPayload.length} candidates into the ATS pipeline!`);
      setStagedFiles([]);
    } catch (err: any) {
      alert(`Import failed: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryParse = async (id: string) => {
    setRetryingId(id);
    try {
      await atsApi.retryResumeParse(id);
      await loadQueue();
    } catch (err: any) {
      alert(`Retry failed: ${err?.message || err}`);
    } finally {
      setRetryingId(null);
    }
  };

  const handleSaveOverrides = (updated: StagedCandidate) => {
    setStagedFiles((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (detailCandidate?.id === updated.id) setDetailCandidate(updated);
    if (updated.parseId) {
      atsApi.updateResumeParse(updated.parseId, {
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        totalExperienceYears: updated.totalExperienceYears,
        skills: updated.skills,
        location: updated.location,
        currentTitle: updated.currentTitle,
        currentCompany: updated.currentCompany,
        currentCtc: updated.currentCtc,
        expectedCtc: updated.expectedCtc,
        noticePeriod: updated.noticePeriod,
        summary: updated.summary,
      }).catch(() => {});
    }
    setReviewCandidate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Sub Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Resume Processing & Staging Engine</h3>
            <p className="text-xs text-slate-500 font-medium">
              Multi-format text extraction (PDF, DOC, DOCX), deep work history parsing, taxonomy skill categorization, search indexing, and recruiter review.
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0 self-start">
            <button
              type="button"
              onClick={() => setActiveSubTab('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Batch Uploader ({stagedFiles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('queue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'queue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock size={13} />
              <span>Processing Queue</span>
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('ats-pipeline')}
              className="underline text-emerald-900 hover:text-emerald-950 font-black"
            >
              Open Pipeline →
            </button>
          )}
        </div>
      )}

      {activeSubTab === 'upload' ? (
        <>
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            className="p-8 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 hover:bg-blue-50/40 hover:border-[#0265FF] transition-all text-center space-y-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#0265FF] flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
              <Upload size={22} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">
                Drop candidate resumes here, or{' '}
                <label className="text-[#0265FF] hover:underline cursor-pointer">
                  browse files
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                </label>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Supports PDF (%PDF), DOCX (OpenXML), DOC, and Text documents up to 10 MB per file
              </p>
            </div>
          </div>

          {/* Target Job Assignment & Actions */}
          {stagedFiles.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Briefcase size={16} className="text-[#0265FF]" />
                <div className="space-y-0.5">
                  <label htmlFor="ats-bulk-job-select" className="text-xs font-bold text-slate-700">
                    Apply batch to job mandate:
                  </label>
                  <select
                    id="ats-bulk-job-select"
                    value={targetJobId}
                    onChange={(e) => setTargetJobId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF]"
                  >
                    <option value="">Do not attach to a job (add to Talent Pool only)</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStagedFiles([])}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  disabled={submitting || stagedFiles.some((x) => x.parsing)}
                  onClick={handleBulkImport}
                  className="px-5 py-2.5 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Confirm & Import ({stagedFiles.length}) Candidates</span>
                </button>
              </div>
            </div>
          )}

          {/* Staged Review Table */}
          {stagedFiles.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    Parsed Candidates Review Table ({stagedFiles.length})
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Verify, preview complete work history, re-scan, or edit candidate details before committing
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">File / Status</th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Current Company</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Extracted Skills</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {stagedFiles.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 min-w-[160px]">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate max-w-[150px]">
                            <FileText size={13} className="text-[#0265FF] shrink-0" />
                            <span className="truncate">{c.filename}</span>
                          </div>
                          {c.parsing && (
                            <span className="text-[10px] text-blue-600 font-bold animate-pulse flex items-center gap-1 mt-0.5">
                              <RotateCw size={10} className="animate-spin" /> Extracting details...
                            </span>
                          )}
                          {c.isDuplicate && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold mt-0.5">
                              <AlertTriangle size={10} /> Duplicate ({c.duplicateReason})
                            </span>
                          )}
                          {c.error && (
                            <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                              {c.error}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={c.fullName}
                            onChange={(e) => updateCandidateField(c.id, 'fullName', e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 w-32 outline-none focus:ring-1 focus:ring-[#0265FF]"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={c.currentCompany || ''}
                            placeholder="Current Company"
                            onChange={(e) => updateCandidateField(c.id, 'currentCompany', e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 w-36 outline-none focus:ring-1 focus:ring-[#0265FF]"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="email"
                            value={c.email}
                            placeholder="email@example.com"
                            onChange={(e) => updateCandidateField(c.id, 'email', e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 w-40 outline-none focus:ring-1 focus:ring-[#0265FF]"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={c.phone}
                            placeholder="+91..."
                            onChange={(e) => updateCandidateField(c.id, 'phone', e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 w-28 outline-none focus:ring-1 focus:ring-[#0265FF]"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={c.totalExperienceYears}
                            onChange={(e) =>
                              updateCandidateField(c.id, 'totalExperienceYears', parseInt(e.target.value, 10) || 0)
                            }
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 w-14 outline-none focus:ring-1 focus:ring-[#0265FF]"
                          />
                        </td>

                        <td className="px-4 py-3 max-w-xs">
                          <input
                            type="text"
                            value={Array.isArray(c.skills) ? c.skills.join(', ') : c.skills}
                            onChange={(e) =>
                              updateCandidateField(
                                c.id,
                                'skills',
                                e.target.value.split(',').map((s) => s.trim())
                              )
                            }
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 w-44 outline-none focus:ring-1 focus:ring-[#0265FF] truncate"
                          />
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1. View Full Profile Details Button */}
                            <button
                              type="button"
                              onClick={() => setDetailCandidate(c)}
                              title="View Full Extracted Profile & Work History"
                              className="px-2 py-1 rounded-lg bg-blue-50 text-[#0265FF] hover:bg-blue-100 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>

                            {/* 2. Re-Scan Button */}
                            <button
                              type="button"
                              disabled={c.parsing}
                              onClick={() => handleRescanCandidate(c)}
                              title="Re-Scan Resume & Refresh Extraction"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50"
                            >
                              <RotateCw size={12} className={c.parsing ? 'animate-spin text-[#0265FF]' : ''} />
                            </button>

                            {/* 3. Detailed Overrides Modal Button */}
                            <button
                              type="button"
                              onClick={() => setReviewCandidate(c)}
                              title="Edit Details & Overrides"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            >
                              <Sliders size={12} />
                            </button>

                            {/* 4. Delete Icon Button */}
                            <button
                              type="button"
                              onClick={() => removeStaged(c.id)}
                              title="Delete Candidate"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            >
                              <Trash2 size={12} />
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
        </>
      ) : (
        /* Processing Queue & Background Logs View */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                Recent Parse & Ingestion Queue
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Live status of extracted documents, magic-byte format validation, and retry handlers
              </p>
            </div>
            <button
              type="button"
              onClick={loadQueue}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
            >
              <RotateCw size={12} className={loadingQueue ? 'animate-spin' : ''} />
              <span>Refresh Queue</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Job ID / File</th>
                  <th className="px-4 py-3">Detected Format</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Parsed Candidate</th>
                  <th className="px-4 py-3">Ingested At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {queueItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No parsed items in queue yet. Upload resumes to see live extraction status.
                    </td>
                  </tr>
                ) : (
                  queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 truncate max-w-[180px]">
                          {item.filename}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-bold text-slate-700 uppercase text-[10px]">
                          {item.format || 'pdf'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {item.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 size={11} /> Ready
                          </span>
                        )}
                        {item.status === 'reviewed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-[#0265FF] text-[10px] font-bold">
                            <CheckCircle2 size={11} /> Committed
                          </span>
                        )}
                        {item.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                            <AlertTriangle size={11} /> Failed
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">
                          {item.extracted?.fullName || '—'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.extracted?.email || '—'}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {item.status === 'failed' ? (
                          <button
                            type="button"
                            disabled={retryingId === item.id}
                            onClick={() => handleRetryParse(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <RotateCw size={11} className={retryingId === item.id ? 'animate-spin' : ''} />
                            <span>Retry</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL CANDIDATE PROFILE DETAILS MODAL (VIEW BUTTON MODAL)
          ========================================================================= */}
      {detailCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {detailCandidate.fullName}
                  </h3>
                  {detailCandidate.confidenceScore && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black flex items-center gap-1">
                      <Sparkles size={11} /> {detailCandidate.confidenceScore}% Quality Score
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="font-bold text-[#0265FF] flex items-center gap-1">
                    <Briefcase size={12} /> {detailCandidate.currentTitle}
                  </span>
                  {detailCandidate.currentCompany && (
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <Building2 size={12} className="text-slate-400" /> {detailCandidate.currentCompany}
                    </span>
                  )}
                  <span>• {detailCandidate.totalExperienceYears} Years Experience</span>
                  <span>• {detailCandidate.location}</span>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={detailCandidate.parsing}
                  onClick={() => handleRescanCandidate(detailCandidate)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Re-Scan document to refresh data"
                >
                  <RotateCw size={13} className={detailCandidate.parsing ? 'animate-spin text-[#0265FF]' : ''} />
                  <span>Re-Scan Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const c = detailCandidate;
                    setDetailCandidate(null);
                    setReviewCandidate(c);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0265FF] hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sliders size={13} />
                  <span>Edit Overrides</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeStaged(detailCandidate.id)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Delete Candidate"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDetailCandidate(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Contact & Social Links Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                <span className="font-semibold text-slate-800">{detailCandidate.email || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone</span>
                <span className="font-semibold text-slate-800">{detailCandidate.phone || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">LinkedIn</span>
                {detailCandidate.linkedinUrl ? (
                  <a
                    href={detailCandidate.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#0265FF] hover:underline flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="text-slate-400">Not specified</span>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {detailCandidate.summary && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText size={14} className="text-[#0265FF]" />
                  <span>Professional Summary</span>
                </h4>
                <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
                  {detailCandidate.summary}
                </div>
              </div>
            )}

            {/* Companies Working Data / Work History */}
            {detailCandidate.workHistory && detailCandidate.workHistory.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#0265FF]" />
                  <span>Work Experience & Company Data ({detailCandidate.workHistory.length})</span>
                </h4>
                <div className="space-y-3">
                  {detailCandidate.workHistory.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-[#0265FF]/40 transition-all space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h5 className="text-sm font-extrabold text-slate-900">{w.company}</h5>
                          <p className="text-xs font-bold text-[#0265FF]">{w.role}</p>
                        </div>
                        {w.duration && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px] self-start sm:self-auto">
                            <Calendar size={11} /> {w.duration}
                          </span>
                        )}
                      </div>
                      {w.highlights && w.highlights.length > 0 && (
                        <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-600 font-medium">
                          {w.highlights.map((h, hIdx) => (
                            <li key={hIdx} className="leading-relaxed">
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Projects */}
            {detailCandidate.projects && detailCandidate.projects.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FolderGit2 size={14} className="text-[#0265FF]" />
                  <span>Featured Projects ({detailCandidate.projects.length})</span>
                </h4>
                <div className="space-y-2.5">
                  {detailCandidate.projects.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h5 className="text-xs font-extrabold text-slate-900">{p.name}</h5>
                        {p.role && (
                          <span className="text-[11px] font-bold text-[#0265FF] bg-blue-50 px-2 py-0.5 rounded-lg">
                            {p.role}
                          </span>
                        )}
                      </div>
                      {p.highlights && p.highlights.length > 0 && (
                        <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-600 font-medium">
                          {p.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Strengths */}
            {detailCandidate.coreStrengths && detailCandidate.coreStrengths.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Award size={14} className="text-[#0265FF]" />
                  <span>Core Strengths & Competencies</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailCandidate.coreStrengths.map((cs, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs"
                    >
                      {cs}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Skills Categorized */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Layers size={14} className="text-[#0265FF]" />
                <span>Extracted Skills by Domain Taxonomy</span>
              </h4>
              {detailCandidate.skillsByCategory ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.entries(detailCandidate.skillsByCategory).map(([cat, skills]) => (
                    <div key={cat} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {cat.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(skills as string[]).length > 0 ? (
                          (skills as string[]).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-[10px] font-bold shadow-xs"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">None detected</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 font-semibold">
                  {detailCandidate.skills.join(', ')}
                </div>
              )}
            </div>

            {/* Portfolios & Live Project Links */}
            {detailCandidate.portfolioSites && detailCandidate.portfolioSites.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Globe size={14} className="text-[#0265FF]" />
                  <span>Live Portfolio & Deployed Projects</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detailCandidate.portfolioSites.map((site, idx) => (
                    <a
                      key={idx}
                      href={site.startsWith('http') ? site : `https://${site}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0265FF] border border-slate-200 font-bold text-xs inline-flex items-center gap-1 transition-all"
                    >
                      <Globe size={12} />
                      <span>{site}</span>
                      <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {detailCandidate.education && detailCandidate.education.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-[#0265FF]" />
                  <span>Education & Academic Credentials</span>
                </h4>
                <div className="space-y-1.5">
                  {detailCandidate.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-2"
                    >
                      <GraduationCap size={14} className="text-[#0265FF]" />
                      <span>{edu}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => removeStaged(detailCandidate.id)}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete Candidate</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailCandidate(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const c = detailCandidate;
                    setDetailCandidate(null);
                    setReviewCandidate(c);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Sliders size={13} />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RECRUITER REVIEW & EXTRACTION OVERRIDES MODAL (EDIT MODAL)
          ========================================================================= */}
      {reviewCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Recruiter Review & Extraction Overrides
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect taxonomy categorizations, edit candidate metadata, and preview search index
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={reviewCandidate.parsing}
                  onClick={() => handleRescanCandidate(reviewCandidate)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                  title="Re-Scan Resume"
                >
                  <RotateCw size={13} className={reviewCandidate.parsing ? 'animate-spin text-[#0265FF]' : ''} />
                  <span className="hidden sm:inline">Re-Scan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewCandidate(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={reviewCandidate.fullName}
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={reviewCandidate.email}
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={reviewCandidate.phone}
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Experience (Years)</label>
                <input
                  type="number"
                  value={reviewCandidate.totalExperienceYears}
                  onChange={(e) =>
                    setReviewCandidate({
                      ...reviewCandidate,
                      totalExperienceYears: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Title / Role</label>
                <input
                  type="text"
                  value={reviewCandidate.currentTitle}
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, currentTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Company</label>
                <input
                  type="text"
                  value={reviewCandidate.currentCompany || ''}
                  placeholder="e.g. Vedasynk Technologies"
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, currentCompany: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / City</label>
                <input
                  type="text"
                  value={reviewCandidate.location}
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, location: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notice Period</label>
                <input
                  type="text"
                  value={reviewCandidate.noticePeriod || 'Immediate'}
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, noticePeriod: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
            </div>

            {/* Professional Summary Textarea */}
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs">Professional Summary</label>
              <textarea
                rows={3}
                value={reviewCandidate.summary || ''}
                placeholder="Candidate career summary..."
                onChange={(e) =>
                  setReviewCandidate({ ...reviewCandidate, summary: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-xs leading-relaxed"
              />
            </div>

            {/* Categorized Skills Taxonomy Preview */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Layers size={13} className="text-[#0265FF]" />
                <span>Extracted Skills by Domain Taxonomy</span>
              </h4>

              {reviewCandidate.skillsByCategory ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(reviewCandidate.skillsByCategory).map(([cat, skills]) => (
                    <div key={cat} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {cat.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(skills as string[]).length > 0 ? (
                          (skills as string[]).map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[10px] font-semibold"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">None detected</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-medium">
                  {reviewCandidate.skills.join(', ') || 'No skills detected'}
                </div>
              )}
            </div>

            {/* Search Index Tokens Preview */}
            {reviewCandidate.searchTokens && reviewCandidate.searchTokens.length > 0 && (
              <div className="space-y-1 border-t border-slate-100 pt-3">
                <h5 className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Search size={12} className="text-slate-400" />
                  <span>Indexed Search Tokens (Instant ATS In-Memory Match)</span>
                </h5>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {reviewCandidate.searchTokens.map((tok) => (
                    <span
                      key={tok}
                      className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0265FF] text-[10px] font-medium"
                    >
                      {tok}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => removeStaged(reviewCandidate.id)}
                className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReviewCandidate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveOverrides(reviewCandidate)}
                  className="px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs"
                >
                  Apply Overrides
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
