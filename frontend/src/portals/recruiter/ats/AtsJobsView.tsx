import { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Search,
  CheckCircle2,
  MapPin,
  IndianRupee,
  ArrowRight,
  Edit3,
  Layers,
  X,
  Target,
  Zap,
} from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';

export function AtsJobsView({ onNavigatePipeline }: { onNavigatePipeline?: (jobId: string) => void }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Job Details & Stages Drawer
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [stagesList, setStagesList] = useState<any[]>([]);
  const [editingStages, setEditingStages] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [stagesSaving, setStagesSaving] = useState(false);

  // Create Job Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');
  const [createForm, setCreateForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    experienceLevel: '4–8 Years',
    salaryMin: '1800000',
    salaryMax: '3200000',
    openings: '1',
    skills: 'React.js, Node.js, TypeScript, MongoDB, Docker',
    mustHaveSkills: 'React.js, Node.js, TypeScript',
    niceToHaveSkills: 'Tailwind CSS, Docker, GraphQL',
    minExperienceYears: '4',
    maxExperienceYears: '8',
    minQualification: 'Bachelor of Technology (B.Tech) / B.E. or Graduate Equivalent',
    autoShortlistThreshold: 75,
    autoShortlistMode: 'assisted',
    description: 'Looking for a Senior Full Stack Developer to build high-performance cloud applications.',
    responsibilities: '• Design full-stack web applications with React.js and Node.js\n• Build and scale REST APIs and microservices\n• Lead architectural reviews, error-boundary design, and code quality',
    requirements: '• 4+ years hands-on React.js and Node.js experience\n• Strong knowledge of TypeScript, MongoDB, REST APIs\n• Clean code and agile sprint leadership',
  });

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (statusFilter) params.set('status', statusFilter);
      params.set('pageSize', '50');

      const res: any = await atsApi.jobs(`?${params.toString()}`);
      const list = res?.data?.items || res?.data || [];
      setJobs(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load jobs list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [q, statusFilter]);

  const openJobDetails = async (job: any) => {
    setSelectedJob(job);
    setJobDetailsLoading(true);
    setEditingStages(false);
    try {
      const res: any = await atsApi.jobDetails(job.id);
      if (res?.data) setSelectedJob(res.data);
      setStagesList(res?.data?.stages || []);
    } catch {
      setStagesList([]);
    } finally {
      setJobDetailsLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) return;
    setCreateSaving(true);
    setCreateSuccess('');
    try {
      const res: any = await atsApi.createJob({
        ...createForm,
        skills: createForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        mustHaveSkills: createForm.mustHaveSkills.split(',').map((s) => s.trim()).filter(Boolean),
        niceToHaveSkills: createForm.niceToHaveSkills.split(',').map((s) => s.trim()).filter(Boolean),
        minExperienceYears: Number(createForm.minExperienceYears) || 3,
        maxExperienceYears: Number(createForm.maxExperienceYears) || 7,
        minQualification: createForm.minQualification,
        autoShortlistThreshold: Number(createForm.autoShortlistThreshold) || 75,
        autoShortlistMode: createForm.autoShortlistMode,
        responsibilities: createForm.responsibilities.split('\n').filter(Boolean),
        requirements: createForm.requirements.split('\n').filter(Boolean),
        openings: Number(createForm.openings) || 1,
        salaryMin: Number(createForm.salaryMin) || 0,
        salaryMax: Number(createForm.salaryMax) || 0,
      });

      if (res?.data) {
        setCreateSuccess('Job requisition & ATS qualification profile published successfully!');
        setJobs([res.data, ...jobs]);
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess('');
        }, 1200);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to create job mandate');
    } finally {
      setCreateSaving(false);
    }
  };

  const handleSaveStages = async () => {
    if (!selectedJob) return;
    setStagesSaving(true);
    try {
      const res: any = await atsApi.saveJobStages(selectedJob.id, stagesList);
      if (res?.data) {
        setStagesList(res.data);
        setEditingStages(false);
        alert('Recruitment stages updated successfully!');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to update stages');
    } finally {
      setStagesSaving(false);
    }
  };

  const addCustomStage = () => {
    if (!newStageName.trim()) return;
    const newStage = {
      name: newStageName.trim(),
      order: stagesList.length + 1,
      type: 'interview',
      color: 'blue',
      slaDays: 3,
    };
    setStagesList([...stagesList, newStage]);
    setNewStageName('');
  };

  const removeStage = (idx: number) => {
    setStagesList(stagesList.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* HEADER & FILTER BAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Job Requisitions & ATS Mandates</h3>
            <p className="text-xs text-slate-500 font-medium">
              Manage job positions, ATS qualification criteria, auto-shortlist threshold gates, and custom recruitment pipelines.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>Post New Mandate</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by job title, department, location, or requisition ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0265FF]"
          >
            <option value="">All Statuses</option>
            <option value="Published">Published / Active</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl">
          {error}
        </div>
      )}

      {/* JOBS GRID */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium bg-white rounded-3xl border border-slate-200/80">
          Loading ATS job mandates…
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <Briefcase size={32} className="mx-auto text-slate-300" />
          <p>No job requisitions found matching your filter.</p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-50 text-[#0265FF] font-bold text-xs hover:bg-blue-100"
          >
            Create Your First Job Mandate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                    {job.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : job.status === 'Draft'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {job.status || 'Published'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">{job.title}</h4>
                  <span className="text-[11px] font-semibold text-slate-400">{job.department || 'Engineering'}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span>{job.location || 'India'} ({job.workMode || 'Hybrid'})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee size={12} className="text-slate-400 shrink-0" />
                    <span>₹{((job.salaryMin || 1800000) / 100000).toFixed(0)}–{((job.salaryMax || 3200000) / 100000).toFixed(0)} LPA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-slate-400 shrink-0" />
                    <span className="font-extrabold text-[#0265FF]">{job.totalApplicants || job.applicantsCount || 0} Total Applicants</span>
                  </div>
                </div>

                {/* ATS Threshold Gate Badge */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <Target size={12} className="text-[#0265FF]" /> ATS Shortlist Gate:
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-[#0265FF] font-black border border-blue-200">
                    ≥ {job.autoShortlistThreshold || 75}% Score
                  </span>
                </div>

                {/* Must-Have Skills tags */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                    Must-Have Criteria:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(job.mustHaveSkills || (Array.isArray(job.skills) ? job.skills.slice(0, 3) : ['React', 'Node.js'])).map((s: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openJobDetails(job)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => onNavigatePipeline ? onNavigatePipeline(job.id) : null}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  <span>Pipeline</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JOB DETAILS & CONFIGURABLE STAGES DRAWER */}
      {selectedJob && (
        <div className="fixed inset-0 z-[80] flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl p-6 overflow-y-auto space-y-6 border-l border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0265FF] border border-blue-200">
                  {selectedJob.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedJob.title}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedJob.department} • {selectedJob.location} • {selectedJob.workMode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Applicants</span>
                <p className="text-base font-black text-[#0265FF] mt-0.5">{selectedJob.totalApplicants || selectedJob.applicantsCount || 0}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Open Positions</span>
                <p className="text-base font-black text-slate-900 mt-0.5">{selectedJob.openings || 1}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Experience Bounds</span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {selectedJob.minExperienceYears || 3}–{selectedJob.maxExperienceYears || 7} Yrs
                </p>
              </div>
            </div>

            {/* ATS MATCHING PROFILE BOX */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Target size={14} className="text-[#0265FF]" />
                  <span>ATS Candidate Qualification & Shortlist Profile</span>
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0265FF] font-black text-xs">
                  Target: ≥ {selectedJob.autoShortlistThreshold || 75}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Mandatory Must-Have Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedJob.mustHaveSkills || ['React.js', 'Node.js', 'TypeScript']).map((s: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedJob.niceToHaveSkills && selectedJob.niceToHaveSkills.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Secondary (Nice-to-Have) Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.niceToHaveSkills.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-white text-slate-700 font-semibold text-[11px] border border-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-100/60">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Minimum Degree</span>
                    <span className="font-bold text-slate-800">{selectedJob.minQualification || 'Bachelor of Technology (B.Tech) / B.E.'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Shortlist Gate Mode</span>
                    <span className="font-bold text-[#0265FF] flex items-center gap-1">
                      <Zap size={11} /> {selectedJob.autoShortlistMode === 'automatic' ? 'Autonomous Shortlist' : 'Assisted 1-Click Shortlist'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description & Requirements */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Job Description & Responsibilities</h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                <p className="font-semibold">{selectedJob.description}</p>
                {Array.isArray(selectedJob.responsibilities) && selectedJob.responsibilities.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-1">Key Responsibilities:</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {selectedJob.responsibilities.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(selectedJob.requirements) && selectedJob.requirements.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-1">Requirements & Qualifications:</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {selectedJob.requirements.map((rq: string, idx: number) => (
                        <li key={idx}>{rq}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* CONFIGURABLE RECRUITMENT STAGES */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Layers size={14} className="text-[#0265FF]" /> Configurable Pipeline Stages
                  </h4>
                  <p className="text-[11px] text-slate-500">Custom stages, order and SLA days for this requisition</p>
                </div>
                {!editingStages ? (
                  <button
                    type="button"
                    onClick={() => setEditingStages(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <Edit3 size={12} /> Edit Stages
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveStages}
                    disabled={stagesSaving}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-xs font-bold text-white shadow cursor-pointer"
                  >
                    {stagesSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                )}
              </div>

              {jobDetailsLoading ? (
                <p className="text-xs text-slate-400 italic">Loading stages configuration…</p>
              ) : (
                <div className="space-y-2">
                  {stagesList.map((st, idx) => (
                    <div
                      key={st.id || idx}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0265FF] font-black text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-extrabold text-slate-900">{st.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2 font-mono">SLA: {st.slaDays || 3}d</span>
                        </div>
                      </div>
                      {editingStages && (
                        <button
                          type="button"
                          onClick={() => removeStage(idx)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {editingStages && (
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        placeholder="Add stage name (e.g. System Design Round)..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                      />
                      <button
                        type="button"
                        onClick={addCustomStage}
                        disabled={!newStageName.trim()}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                      >
                        Add Stage
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Direct Link to Pipeline */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedJob(null);
                  if (onNavigatePipeline) onNavigatePipeline(selectedJob.id);
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Open Interactive Pipeline Kanban</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST NEW MANDATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Post New ATS Job Mandate</h3>
                <p className="text-xs text-slate-500">Configure mandate specifications, qualification bounds, and auto-shortlist threshold gates.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {createSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} /> {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Developer (React.js + Node.js)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={createForm.department}
                    onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={createForm.workMode}
                    onChange={(e) => setCreateForm({ ...createForm, workMode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Salary (INR)</label>
                  <input
                    type="number"
                    value={createForm.salaryMin}
                    onChange={(e) => setCreateForm({ ...createForm, salaryMin: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Salary (INR)</label>
                  <input
                    type="number"
                    value={createForm.salaryMax}
                    onChange={(e) => setCreateForm({ ...createForm, salaryMax: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
              </div>

              {/* ATS QUALIFICATION PROFILE BOX */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Target size={14} className="text-[#0265FF]" />
                    <span>ATS Matching Criteria & Shortlisting Gate</span>
                  </h4>
                  <span className="text-[11px] font-bold text-[#0265FF]">Automatic Candidate Scoring</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <span>Mandatory (Must-Have) Skills *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.mustHaveSkills}
                      onChange={(e) => setCreateForm({ ...createForm, mustHaveSkills: e.target.value })}
                      placeholder="e.g. React.js, Node.js, TypeScript, MongoDB"
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Determines 40% of candidate ATS score</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Secondary (Nice-to-Have) Skills
                    </label>
                    <input
                      type="text"
                      value={createForm.niceToHaveSkills}
                      onChange={(e) => setCreateForm({ ...createForm, niceToHaveSkills: e.target.value })}
                      placeholder="e.g. Tailwind CSS, Docker, GraphQL"
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-[#0265FF]"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Secondary bonus match points</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Min Exp (Yrs)</label>
                    <input
                      type="number"
                      min={0}
                      value={createForm.minExperienceYears}
                      onChange={(e) => setCreateForm({ ...createForm, minExperienceYears: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Max Exp (Yrs)</label>
                    <input
                      type="number"
                      min={0}
                      value={createForm.maxExperienceYears}
                      onChange={(e) => setCreateForm({ ...createForm, maxExperienceYears: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Min Degree / Education</label>
                    <select
                      value={createForm.minQualification}
                      onChange={(e) => setCreateForm({ ...createForm, minQualification: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                    >
                      <option value="Bachelor of Technology (B.Tech) / B.E. or Graduate Equivalent">B.Tech / B.E. or Any Graduate</option>
                      <option value="Bachelor of Computer Applications (BCA) / MCA">BCA / MCA</option>
                      <option value="Bachelor of Commerce (B.Com) / BBA">B.Com / BBA</option>
                      <option value="Master of Technology (M.Tech) / M.S.">M.Tech / M.S. or Higher</option>
                      <option value="Any Graduate / Diploma">Any Graduate / Diploma</option>
                    </select>
                  </div>
                </div>

                {/* Auto Shortlist Slider & Gate Selection */}
                <div className="p-3 bg-white rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1">
                      <Target size={13} className="text-[#0265FF]" />
                      <span>Auto-Shortlist Score Threshold:</span>
                      <span className="text-[#0265FF] font-black">{createForm.autoShortlistThreshold}%</span>
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={95}
                      step={5}
                      value={createForm.autoShortlistThreshold}
                      onChange={(e) => setCreateForm({ ...createForm, autoShortlistThreshold: parseInt(e.target.value, 10) })}
                      className="w-48 accent-[#0265FF] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Shortlist Trigger Mode</label>
                    <select
                      value={createForm.autoShortlistMode}
                      onChange={(e) => setCreateForm({ ...createForm, autoShortlistMode: e.target.value })}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                    >
                      <option value="assisted">Assisted (Highlight + 1-Click Shortlist)</option>
                      <option value="automatic">Automatic (Move to Shortlist Instantly)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Description & Overview</label>
                <textarea
                  rows={2}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Responsibilities (one per line)</label>
                <textarea
                  rows={2}
                  value={createForm.responsibilities}
                  onChange={(e) => setCreateForm({ ...createForm, responsibilities: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Requirements (one per line)</label>
                <textarea
                  rows={2}
                  value={createForm.requirements}
                  onChange={(e) => setCreateForm({ ...createForm, requirements: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createSaving}
                  className="w-full py-3 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {createSaving ? 'Publishing Mandate…' : 'Publish Requisition & ATS Criteria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
