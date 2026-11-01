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
} from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';

interface StagedCandidate {
  id: string;
  parseId?: string;
  filename: string;
  fileRef: string;
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
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  searchTokens?: string[];
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

  // Review modal state
  const [reviewCandidate, setReviewCandidate] = useState<StagedCandidate | null>(null);

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
                  currentCtc: ext?.currentCtc || '',
                  expectedCtc: ext?.expectedCtc || '',
                  noticePeriod: ext?.noticePeriod || 'Immediate',
                  searchTokens: ext?.searchTokens || [],
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
  };

  const updateCandidateField = (id: string, field: string, val: any) => {
    setStagedFiles((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [field]: val } : x))
    );
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
              Multi-format text extraction (PDF, DOC, DOCX), taxonomy skill categorization, search indexing, and recruiter review.
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
                    Verify or edit extracted details before committing to Master CRM
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">File / Status</th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Extracted Skills</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {stagedFiles.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 min-w-[160px]">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate max-w-[150px]">
                            <FileText size={13} className="text-[#0265FF] shrink-0" />
                            <span className="truncate">{c.filename}</span>
                          </div>
                          {c.parsing && (
                            <span className="text-[10px] text-blue-600 font-bold animate-pulse">
                              Extracting text...
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
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 w-36 outline-none focus:ring-1 focus:ring-[#0265FF]"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="email"
                            value={c.email}
                            placeholder="email@example.com"
                            onChange={(e) => updateCandidateField(c.id, 'email', e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 w-44 outline-none focus:ring-1 focus:ring-[#0265FF]"
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
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 w-16 outline-none focus:ring-1 focus:ring-[#0265FF]"
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
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 w-48 outline-none focus:ring-1 focus:ring-[#0265FF] truncate"
                          />
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setReviewCandidate(c)}
                              title="Detailed Review & Overrides"
                              className="p-1.5 rounded-lg bg-blue-50 text-[#0265FF] hover:bg-blue-100 transition-colors"
                            >
                              <Sliders size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeStaged(c.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={13} />
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

      {/* Recruiter Review & Overrides Modal */}
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
              <button
                type="button"
                onClick={() => setReviewCandidate(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
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
                  onChange={(e) =>
                    setReviewCandidate({ ...reviewCandidate, currentCompany: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
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
                <div className="flex flex-wrap gap-1">
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

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
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
      )}
    </div>
  );
}
