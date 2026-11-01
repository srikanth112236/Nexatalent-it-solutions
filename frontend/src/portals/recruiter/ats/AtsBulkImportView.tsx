import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Trash2, RefreshCw, Briefcase } from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';

interface StagedCandidate {
  id: string;
  filename: string;
  fileRef: string;
  fullName: string;
  email: string;
  phone: string;
  totalExperienceYears: number;
  skills: string[];
  location: string;
  currentTitle: string;
  isDuplicate: boolean;
  duplicateReason?: string;
  parsing: boolean;
  error?: string;
}

export function AtsBulkImportView({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const [stagedFiles, setStagedFiles] = useState<StagedCandidate[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [targetJobId, setTargetJobId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res: any = await atsApi.jobs('?pageSize=50');
        const list = res?.data?.items || res?.data || [];
        setJobs(list);
        if (list.length > 0) setTargetJobId(list[0].id);
      } catch { /* best-effort */ }
    })();
  }, []);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    for (const file of fileArray) {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
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

      // Read file as base64
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
                  fileRef: res?.data?.fileRef || '',
                  fullName: ext?.fullName || item.fullName,
                  email: ext?.email || '',
                  phone: ext?.phone || '',
                  totalExperienceYears: ext?.totalExperienceYears || 3,
                  skills: ext?.skills || [],
                  location: ext?.location || 'India',
                  currentTitle: ext?.currentTitle || 'Professional',
                  isDuplicate: !!res?.data?.isDuplicate,
                  duplicateReason: res?.data?.duplicateReason,
                  parsing: false,
                };
              }
              return item;
            })
          );
        } catch (err: any) {
          setStagedFiles((prev) =>
            prev.map((item) => (item.id === tempId ? { ...item, parsing: false, error: err?.message || 'Parse failed' } : item))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-1">
        <h3 className="text-base font-extrabold text-slate-900">Bulk Resume Import & Parsing Staging</h3>
        <p className="text-xs text-slate-500 font-medium">
          Upload batches of resumes (PDF, DOC, DOCX). The asynchronous parser automatically extracts candidate details for review before committing.
        </p>
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
            Drop candidate resumes here, or <label className="text-[#0265FF] hover:underline cursor-pointer">browse files<input type="file" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} /></label>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Supports PDF, DOC, DOCX up to 5 MB per document</p>
        </div>
      </div>

      {/* Target Job Assignment & Actions */}
      {stagedFiles.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Briefcase size={16} className="text-[#0265FF]" />
            <div className="space-y-0.5">
              <label htmlFor="ats-bulk-job-select" className="text-xs font-bold text-slate-700">Apply batch to job mandate:</label>
              <select
                id="ats-bulk-job-select"
                value={targetJobId}
                onChange={(e) => setTargetJobId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF]"
              >
                <option value="">Do not attach to a job (add to Talent Pool only)</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
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
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Parsed Candidates Review Table ({stagedFiles.length})
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Verify or edit extracted details before committing</span>
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
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stagedFiles.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 min-w-[150px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate max-w-[140px]">
                        <FileText size={13} className="text-[#0265FF] shrink-0" />
                        <span className="truncate">{c.filename}</span>
                      </div>
                      {c.parsing && (
                        <span className="text-[10px] text-blue-600 font-bold animate-pulse">Extracting text...</span>
                      )}
                      {c.isDuplicate && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold mt-0.5">
                          <AlertTriangle size={10} /> Duplicate ({c.duplicateReason})
                        </span>
                      )}
                      {c.error && (
                        <span className="text-[10px] text-red-600 font-bold">{c.error}</span>
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
                        onChange={(e) => updateCandidateField(c.id, 'totalExperienceYears', parseInt(e.target.value, 10) || 0)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 w-16 outline-none focus:ring-1 focus:ring-[#0265FF]"
                      />
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <input
                        type="text"
                        value={Array.isArray(c.skills) ? c.skills.join(', ') : c.skills}
                        onChange={(e) => updateCandidateField(c.id, 'skills', e.target.value.split(',').map((s) => s.trim()))}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 w-48 outline-none focus:ring-1 focus:ring-[#0265FF] truncate"
                      />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeStaged(c.id)}
                        className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
