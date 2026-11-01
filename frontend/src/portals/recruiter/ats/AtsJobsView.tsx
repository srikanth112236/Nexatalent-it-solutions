import { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, MapPin, IndianRupee, Users, X, CheckCircle2, Layers, Edit3, ArrowRight } from 'lucide-react';
import { atsApi } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';

export function AtsJobsView({ onNavigatePipeline }: { onNavigatePipeline?: (jobId: string) => void }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected job for Details Drawer
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);

  // Custom Stages Editor State
  const [editingStages, setEditingStages] = useState(false);
  const [stagesList, setStagesList] = useState<any[]>([]);
  const [newStageName, setNewStageName] = useState('');
  const [stagesSaving, setStagesSaving] = useState(false);

  // Create Job Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');
  const [createForm, setCreateForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Pune, India',
    workMode: 'Hybrid',
    experienceLevel: '6–7 Years',
    salaryMin: '1800000',
    salaryMax: '3200000',
    openings: '1',
    skills: 'Golang, React.js, GCP, BigQuery',
    description: 'Looking for a Senior Full Stack Developer to build cloud-native enterprise products.',
    responsibilities: '• Design full-stack applications with Go and React.js\n• Build microservices on GCP and BigQuery\n• Lead architectural reviews and system design',
    requirements: '• 6+ years hands-on Golang and React experience\n• Strong knowledge of GCP, Docker and Kubernetes\n• Excellent problem solving and leadership capabilities',
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
        responsibilities: createForm.responsibilities.split('\n').filter(Boolean),
        requirements: createForm.requirements.split('\n').filter(Boolean),
        openings: Number(createForm.openings) || 1,
        salaryMin: Number(createForm.salaryMin) || 0,
        salaryMax: Number(createForm.salaryMax) || 0,
      });

      if (res?.data) {
        setCreateSuccess('Job requisition created successfully!');
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
      alert(err?.response?.data?.message || err?.message || 'Failed to save stages');
    } finally {
      setStagesSaving(false);
    }
  };

  const addCustomStage = () => {
    if (!newStageName.trim()) return;
    const nextOrder = stagesList.length + 1;
    setStagesList([
      ...stagesList,
      {
        id: `custom_${Date.now()}`,
        name: newStageName.trim(),
        order: nextOrder,
        type: 'interview',
        color: 'purple',
        slaDays: 3,
      },
    ]);
    setNewStageName('');
  };

  const removeStage = (idx: number) => {
    setStagesList(stagesList.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Quick Action Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Job Requisitions & Mandates</h3>
            <p className="text-xs text-slate-500 font-medium">Manage open requisitions, job descriptions, pipeline stages and recruiter assignments</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} /> Post New Mandate
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">{error}</div>}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by job title, mandate ID, department, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="Published">Published / Live</option>
              <option value="Draft">Draft</option>
              <option value="On Hold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 shadow-sm">
          <InlineLoading message="Loading job requisitions…" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center space-y-2">
          <Briefcase size={32} className="mx-auto text-slate-400" />
          <h4 className="text-base font-extrabold text-slate-900">No Job Requisitions Found</h4>
          <p className="text-xs text-slate-500">Post a new mandate or adjust your filter query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{job.id}</span>
                    <h4 className="text-sm font-black text-slate-900 truncate mt-0.5">{job.title}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      job.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 font-medium">
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

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {Array.isArray(job.skills) &&
                    job.skills.slice(0, 3).map((s: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {s}
                      </span>
                    ))}
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
                <span className="text-[10px] font-bold text-slate-400 uppercase">Experience</span>
                <p className="text-base font-black text-slate-900 mt-0.5">{selectedJob.experienceLevel || '6–7 Yrs'}</p>
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
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-slate-900">Post New ATS Job Mandate</h3>
            <p className="text-xs text-slate-500">Configure mandate specifications, compensation bounds, requirements, and recruiter assignments.</p>

            {createSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} /> {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Developer (Golang + React)"
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={createForm.skills}
                  onChange={(e) => setCreateForm({ ...createForm, skills: e.target.value })}
                  placeholder="Golang, React.js, GCP, BigQuery, Docker"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                />
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
                  {createSaving ? 'Publishing Mandate…' : 'Publish Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
