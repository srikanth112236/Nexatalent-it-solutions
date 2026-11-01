import { useState, useEffect } from 'react';
import { Search, Filter, Eye, MapPin, X } from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';
import { PdfResumeViewerModal } from '../../../shared/ui/PdfResumeViewerModal';

export function AtsCandidateCrmView() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [minExp, setMinExp] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [candidateDetail, setCandidateDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [resumePreview, setResumePreview] = useState<{ applicationId?: string; leadId?: string; title?: string; filename?: string } | null>(null);

  const loadCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (skillFilter.trim()) params.set('skills', skillFilter.trim());
      if (minExp) params.set('minExp', minExp);

      const res: any = await atsApi.candidates(`?${params.toString()}`);
      const list = res?.data?.items || res?.data || [];
      setCandidates(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [q, skillFilter, minExp]);

  const openCandidate360 = async (cand: any) => {
    setSelectedCandidate(cand);
    setDetailLoading(true);
    try {
      const res: any = await atsApi.candidate360(cand.id);
      setCandidateDetail(res?.data || cand);
    } catch {
      setCandidateDetail(cand);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Candidate CRM Master Database</h3>
            <p className="text-xs text-slate-500 font-medium">Search, filter and inspect talent pool profiles across all sources</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            {candidates.length} talent profiles
          </span>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search candidate name, email, skills, phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 text-slate-700"
            >
              <option value="">All Technologies / Skills</option>
              <option value="Golang">Golang (Go)</option>
              <option value="React">React.js</option>
              <option value="Python">Python</option>
              <option value="GCP">GCP / Cloud</option>
              <option value="AWS">AWS</option>
              <option value="Node.js">Node.js</option>
              <option value="Java">Java / Spring Boot</option>
              <option value="Docker">Docker & Kubernetes</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 text-slate-700"
            >
              <option value="">Min Experience</option>
              <option value="1">1+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
              <option value="8">8+ years</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 shadow-sm">
          <InlineLoading message="Searching candidate database…" />
        </div>
      )}

      {!loading && candidates.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
          <h4 className="text-sm font-extrabold text-slate-800">No matching candidates found</h4>
          <p className="text-xs text-slate-400">Try adjusting your skill filter or search terms.</p>
        </div>
      )}

      {/* Candidates Data Table */}
      {!loading && candidates.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-4 py-3.5">Experience & Skills</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Notice & CTC</th>
                  <th className="px-4 py-3.5">Active Mandate</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => openCandidate360(c)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-900 text-xs">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.email}</div>
                      {c.phone && <div className="text-[10px] text-slate-400">{c.phone}</div>}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-bold text-slate-800 text-xs">
                        {c.experienceYears ? `${c.experienceYears} Years Exp` : '3–5 Years'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {c.skills || c.headline || 'Software Engineering'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <MapPin size={12} className="text-slate-400" />
                        {c.location || 'India'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{c.noticePeriod || 'Immediate'}</div>
                      <div className="text-[10px] text-slate-500">Exp: {c.expectedCtc || 'Competitive'}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      {c.currentActiveJob ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 truncate block max-w-[170px]">
                            {c.currentActiveJob}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            {c.currentStage || 'Applied'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Available in pool</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {c.resumeRef && (
                          <button
                            type="button"
                            onClick={() => {
                              setResumePreview({
                                leadId: c.id,
                                title: `${c.name} — Resume`,
                                filename: c.resumeName || 'Resume.pdf',
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0265FF] font-bold text-[11px] border border-blue-200 transition-colors"
                          >
                            <Eye size={12} />
                            <span>Preview CV</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openCandidate360(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-200 transition-colors"
                        >
                          360° Profile
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

      {/* Candidate 360° Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto space-y-5 border-l border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0265FF] border border-blue-200">
                  Candidate Profile
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedCandidate.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedCandidate.email} • {selectedCandidate.phone || 'No phone'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Resume Action Bar */}
            {selectedCandidate.resumeRef && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedCandidate.resumeName || 'Candidate Resume (PDF)'}
                  </div>
                  <div className="text-[10px] text-slate-500">Attached applicant document</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResumePreview({
                      leadId: selectedCandidate.id,
                      title: `${selectedCandidate.name} — Resume`,
                      filename: selectedCandidate.resumeName || 'Resume.pdf',
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow transition-colors shrink-0"
                >
                  <Eye size={13} /> Open PDF Viewer
                </button>
              </div>
            )}

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Experience</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.experienceYears || '3–5'} Years</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.location || 'India'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Notice Period</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.noticePeriod || 'Immediate'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Expected CTC</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.expectedCtc || 'Competitive'}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Key Technical Skills</h4>
              <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {selectedCandidate.skills || selectedCandidate.headline || 'Golang, React.js, GCP'}
              </p>
            </div>

            {/* Application History */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Applications History</h4>
              {detailLoading ? (
                <p className="text-xs text-slate-400 italic">Loading application history…</p>
              ) : (!candidateDetail?.applications || candidateDetail.applications.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No job applications submitted yet.</p>
              ) : (
                <div className="space-y-2">
                  {candidateDetail.applications.map((app: any) => (
                    <div key={app.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-slate-900">{app.jobTitle || app.jobId}</div>
                        <div className="text-[10px] text-slate-400">Applied {app.createdAt?.slice(0, 10)}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                        {app.stage}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
        leadId={resumePreview?.leadId}
      />
    </div>
  );
}
