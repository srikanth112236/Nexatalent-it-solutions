import { useState, useEffect } from 'react';
import { Search, Filter, Eye, MapPin, X, Plus, MessageSquare, Clock, CheckCircle2, AlertTriangle, User } from 'lucide-react';
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
  const [resumePreview, setResumePreview] = useState<{ applicationId?: string; leadId?: string; candidateId?: string; title?: string; filename?: string } | null>(null);

  // Drawer tabs & data
  const [drawerTab, setDrawerTab] = useState<'info' | 'notes' | 'activity'>('info');
  const [candidateNotes, setCandidateNotes] = useState<any[]>([]);
  const [candidateActivity, setCandidateActivity] = useState<any[]>([]);
  const [noteText, setNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState('general');
  const [noteSaving, setNoteSaving] = useState(false);

  // Create Profile Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentTitle: '',
    currentCompany: '',
    experienceYears: '3',
    skills: '',
    location: 'Pune, India',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: 'Immediate',
  });
  const [dupWarning, setDupWarning] = useState<string | null>(null);
  const [createSaving, setCreateSaving] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');

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
    setDrawerTab('info');
    setDetailLoading(true);
    try {
      const res: any = await atsApi.candidate360(cand.id);
      setCandidateDetail(res?.data || cand);
      // Fetch notes & activity in parallel
      const [notesRes, actRes]: any = await Promise.all([
        atsApi.candidateNotes(cand.id).catch(() => ({ data: [] })),
        atsApi.candidateActivity(cand.id).catch(() => ({ data: [] })),
      ]);
      setCandidateNotes(notesRes?.data || []);
      setCandidateActivity(actRes?.data || []);
    } catch {
      setCandidateDetail(cand);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedCandidate) return;
    setNoteSaving(true);
    try {
      const res: any = await atsApi.addCandidateNote(selectedCandidate.id, noteText.trim(), noteCategory);
      if (res?.data) {
        setCandidateNotes([res.data, ...candidateNotes]);
        setNoteText('');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to save note');
    } finally {
      setNoteSaving(false);
    }
  };

  const handleCheckDuplicate = async () => {
    if (!createForm.email && !createForm.phone) return;
    try {
      const res: any = await atsApi.checkDuplicate({ email: createForm.email, phone: createForm.phone });
      if (res?.data?.isDuplicate) {
        setDupWarning(`Warning: Candidate profile already exists with this ${res.data.matchType} (${res.data.candidate.name}).`);
      } else {
        setDupWarning(null);
      }
    } catch {
      setDupWarning(null);
    }
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSaving(true);
    setCreateSuccess('');
    try {
      const res: any = await atsApi.createCandidate({
        ...createForm,
        skills: createForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experienceYears: Number(createForm.experienceYears) || 3,
      });
      if (res?.data) {
        setCreateSuccess('Candidate master profile created successfully!');
        setCandidates([res.data, ...candidates]);
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess('');
          setCreateForm({
            name: '',
            email: '',
            phone: '',
            currentTitle: '',
            currentCompany: '',
            experienceYears: '3',
            skills: '',
            location: 'Pune, India',
            currentCtc: '',
            expectedCtc: '',
            noticePeriod: 'Immediate',
          });
        }, 1200);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to create candidate profile');
    } finally {
      setCreateSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Candidate CRM Master Database</h3>
            <p className="text-xs text-slate-500 font-medium">Search, filter, manage and inspect talent pool profiles across all sources</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {candidates.length} talent profiles
            </span>
            <button
              type="button"
              onClick={() => { setShowCreateModal(true); setDupWarning(null); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Plus size={14} /> Add Candidate Profile
            </button>
          </div>
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
              <option value="">Any Exp</option>
              <option value="1">1+ Years</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years</option>
              <option value="7">7+ Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
          <InlineLoading message="Loading candidate master database…" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center space-y-2">
          <User size={32} className="mx-auto text-slate-400" />
          <h4 className="text-base font-extrabold text-slate-900">No Candidates Found</h4>
          <p className="text-xs text-slate-500">Try adjusting your search terms or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">{cand.name}</h4>
                    <p className="text-xs font-semibold text-blue-600 truncate">{cand.headline || 'Software Engineer'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {cand.experienceYears ? `${cand.experienceYears}y exp` : '3–5y'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium space-y-1">
                  <div className="truncate">{cand.email}</div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{cand.location || 'India'}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {String(cand.skills || 'Golang, React')
                    .split(',')
                    .slice(0, 3)
                    .map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {s.trim()}
                      </span>
                    ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] font-bold text-slate-500">
                  {cand.applicationsCount > 0 ? (
                    <span className="text-emerald-700 font-extrabold">{cand.applicationsCount} application(s)</span>
                  ) : (
                    <span>Pool Candidate</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {cand.resumeRef && (
                    <button
                      type="button"
                      onClick={() => {
                        setResumePreview({
                          leadId: cand.id,
                          title: `${cand.name} — Resume`,
                          filename: cand.resumeName || 'Resume.pdf',
                        });
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="View PDF Resume"
                    >
                      <Eye size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openCandidate360(cand)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    Inspect Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate 360° Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto space-y-5 border-l border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0265FF] border border-blue-200">
                  Candidate Master Profile
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedCandidate.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedCandidate.email} • {selectedCandidate.phone || 'No phone'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-Tabs: Info | Notes | Activity */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDrawerTab('info')}
                className={`pb-2.5 cursor-pointer border-b-2 ${drawerTab === 'info' ? 'border-[#0265FF] text-[#0265FF]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Overview & Applications
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('notes')}
                className={`pb-2.5 cursor-pointer border-b-2 flex items-center gap-1.5 ${drawerTab === 'notes' ? 'border-[#0265FF] text-[#0265FF]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <MessageSquare size={13} /> Evaluation Notes ({candidateNotes.length})
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('activity')}
                className={`pb-2.5 cursor-pointer border-b-2 flex items-center gap-1.5 ${drawerTab === 'activity' ? 'border-[#0265FF] text-[#0265FF]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <Clock size={13} /> Activity Timeline ({candidateActivity.length})
              </button>
            </div>

            {/* TAB 1: OVERVIEW & APPLICATIONS */}
            {drawerTab === 'info' && (
              <div className="space-y-4">
                {/* Resume Action Bar */}
                {selectedCandidate.resumeRef && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {selectedCandidate.resumeName || 'Candidate Resume (PDF)'}
                      </div>
                      <div className="text-[10px] text-slate-500">Private candidate document</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumePreview({
                          candidateId: selectedCandidate.id,
                          leadId: selectedCandidate.id,
                          title: `${selectedCandidate.name} — Resume`,
                          filename: selectedCandidate.resumeName || 'Resume.pdf',
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow transition-colors shrink-0 cursor-pointer"
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
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Job Applications History</h4>
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
            )}

            {/* TAB 2: EVALUATION NOTES */}
            {drawerTab === 'notes' && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">Add Evaluation Comment</span>
                    <select
                      value={noteCategory}
                      onChange={(e) => setNoteCategory(e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                    >
                      <option value="general">General</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Technical Interview</option>
                      <option value="salary_negotiation">Salary & CTC</option>
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter recruiter assessment, feedback or CTC details..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={noteSaving || !noteText.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                    >
                      {noteSaving ? 'Saving…' : 'Post Note'}
                    </button>
                  </div>
                </form>

                <div className="space-y-2.5">
                  {candidateNotes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">No recruiter evaluation notes yet.</p>
                  ) : (
                    candidateNotes.map((n) => (
                      <div key={n.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-slate-900">{n.authorName || n.authorEmail}</span>
                          <span className="text-slate-400">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap">{n.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ACTIVITY TIMELINE */}
            {drawerTab === 'activity' && (
              <div className="space-y-3">
                {candidateActivity.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No logged activity yet.</p>
                ) : (
                  candidateActivity.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <div className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="font-extrabold text-slate-900">{act.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {act.timestamp ? new Date(act.timestamp).toLocaleString() : ''} • By {act.actor}
                        </div>
                        {act.details?.reason && (
                          <div className="text-xs text-slate-600 font-medium mt-1">
                            Reason: {act.details.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE MASTER CANDIDATE PROFILE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-slate-900">Create Candidate Master Profile</h3>
            <p className="text-xs text-slate-500">Add an executive tech candidate directly into the CRM database with duplicate validation.</p>

            {createSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} /> {createSuccess}
              </div>
            )}

            {dupWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" /> {dupWarning}
              </div>
            )}

            <form onSubmit={handleCreateCandidate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onBlur={handleCheckDuplicate}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onBlur={handleCheckDuplicate}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={createForm.experienceYears}
                    onChange={(e) => setCreateForm({ ...createForm, experienceYears: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Job Title</label>
                  <input
                    type="text"
                    value={createForm.currentTitle}
                    onChange={(e) => setCreateForm({ ...createForm, currentTitle: e.target.value })}
                    placeholder="Senior Full Stack Engineer"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Company</label>
                  <input
                    type="text"
                    value={createForm.currentCompany}
                    onChange={(e) => setCreateForm({ ...createForm, currentCompany: e.target.value })}
                    placeholder="Tech Corp"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={createForm.skills}
                  onChange={(e) => setCreateForm({ ...createForm, skills: e.target.value })}
                  placeholder="Golang, React.js, GCP, BigQuery, Docker"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notice Period</label>
                  <input
                    type="text"
                    value={createForm.noticePeriod}
                    onChange={(e) => setCreateForm({ ...createForm, noticePeriod: e.target.value })}
                    placeholder="15 Days / Immediate"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected CTC</label>
                  <input
                    type="text"
                    value={createForm.expectedCtc}
                    onChange={(e) => setCreateForm({ ...createForm, expectedCtc: e.target.value })}
                    placeholder="24 LPA"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createSaving}
                  className="w-full py-3 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {createSaving ? 'Creating Profile…' : 'Save Master Profile'}
                </button>
              </div>
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
        candidateId={resumePreview?.candidateId}
        leadId={resumePreview?.leadId}
      />
    </div>
  );
}
