import { useState, useEffect } from 'react';
import {
  Briefcase,
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
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Compass,
  FileText,
  RotateCw,
  Upload,
  ChevronLeft,
  Tag,
  CheckCheck,
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
  const [drawerTab, setDrawerTab] = useState<'details' | 'playbook'>('details');
  const [playbookGenerating, setPlaybookGenerating] = useState(false);
  const [copiedBoolean, setCopiedBoolean] = useState(false);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [stagesList, setStagesList] = useState<any[]>([]);
  const [editingStages, setEditingStages] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [stagesSaving, setStagesSaving] = useState(false);

  // In-Page AI Requisition Studio State ('list' or 'studio')
  const [viewMode, setViewMode] = useState<'list' | 'studio'>('list');
  const [newMustSkill, setNewMustSkill] = useState('');
  const [newNiceSkill, setNewNiceSkill] = useState('');
  const [copiedStudioBoolean, setCopiedStudioBoolean] = useState(false);
  const [jdInputText, setJdInputText] = useState('');
  const [jdAnalyzing, setJdAnalyzing] = useState(false);
  const [aiBriefingPreview, setAiBriefingPreview] = useState<any | null>(null);
  const [createdBriefing, setCreatedBriefing] = useState<any | null>(null);
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
    setDrawerTab('details');
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

  const handleAnalyzeJd = async (rawText?: string, base64Data?: string, filename?: string) => {
    const textToSend = rawText !== undefined ? rawText : jdInputText;
    if (!textToSend.trim() && !base64Data) {
      alert('Please enter or paste a Job Description, or upload a JD document.');
      return;
    }
    setJdAnalyzing(true);
    try {
      const res: any = await atsApi.analyzeJd({
        rawText: textToSend,
        base64Data,
        filename,
      });
      if (res?.data) {
        const d = res.data;
        setAiBriefingPreview(d.briefing);
        setCreatedBriefing(d.briefing);
        setCreateForm({
          title: d.title || createForm.title,
          department: d.department || createForm.department,
          location: d.location || createForm.location,
          workMode: d.workMode || createForm.workMode,
          experienceLevel: d.experienceLevel || `${d.minExperienceYears}–${d.maxExperienceYears} Years`,
          salaryMin: String(d.salaryMin || createForm.salaryMin),
          salaryMax: String(d.salaryMax || createForm.salaryMax),
          openings: String(d.openings || 1),
          skills: (d.skills || []).join(', '),
          mustHaveSkills: (d.mustHaveSkills || []).join(', '),
          niceToHaveSkills: (d.niceToHaveSkills || []).join(', '),
          minExperienceYears: String(d.minExperienceYears || 4),
          maxExperienceYears: String(d.maxExperienceYears || 8),
          minQualification: d.minQualification || createForm.minQualification,
          autoShortlistThreshold: d.autoShortlistThreshold || 75,
          autoShortlistMode: d.autoShortlistMode || 'assisted',
          description: d.description || createForm.description,
          responsibilities: (d.responsibilities || []).map((r: string) => `• ${r}`).join('\n'),
          requirements: (d.requirements || []).map((r: string) => `• ${r}`).join('\n'),
        });
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to analyze Job Description.');
    } finally {
      setJdAnalyzing(false);
    }
  };

  const handleGenerateJobPlaybook = async (job: any) => {
    if (!job) return;
    setPlaybookGenerating(true);
    try {
      const textToAnalyze = [
        `Job Title: ${job.title || ''}`,
        `Department: ${job.department || 'Engineering'}`,
        `Location: ${job.location || 'Pune, India'}`,
        `Work Mode: ${job.workMode || 'Hybrid'}`,
        job.description ? `Overview: ${job.description}` : '',
        Array.isArray(job.requirements) && job.requirements.length > 0 ? `Requirements:\n${job.requirements.join('\n')}` : '',
        Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? `Responsibilities:\n${job.responsibilities.join('\n')}` : '',
        Array.isArray(job.mustHaveSkills) && job.mustHaveSkills.length > 0 ? `Must-Have Skills: ${job.mustHaveSkills.join(', ')}` : '',
        Array.isArray(job.niceToHaveSkills) && job.niceToHaveSkills.length > 0 ? `Secondary Skills: ${job.niceToHaveSkills.join(', ')}` : '',
      ].filter(Boolean).join('\n\n');

      const res: any = await atsApi.analyzeJd({ rawText: textToAnalyze });
      if (res?.data?.briefing) {
        const briefing = res.data.briefing;
        await atsApi.updateJob(job.id, { briefing });
        setSelectedJob({ ...job, briefing });
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, briefing } : j)));
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to generate Recruiter Playbook');
    } finally {
      setPlaybookGenerating(false);
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
        briefing: createdBriefing || null,
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
          setViewMode('list');
          setCreateSuccess('');
          setCreatedBriefing(null);
          setAiBriefingPreview(null);
          setJdInputText('');
        }, 1200);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to create job mandate');
    } finally {
      setCreateSaving(false);
    }
  };

  // Skill Helpers & Sample Presets for Studio Mode
  const mustSkillsList = createForm.mustHaveSkills
    ? createForm.mustHaveSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const niceSkillsList = createForm.niceToHaveSkills
    ? createForm.niceToHaveSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleRemoveMustSkill = (skillToRemove: string) => {
    const updated = mustSkillsList.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase());
    setCreateForm((prev) => ({ ...prev, mustHaveSkills: updated.join(', ') }));
  };

  const handleAddMustSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (mustSkillsList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewMustSkill('');
      return;
    }
    const updated = [...mustSkillsList, trimmed];
    setCreateForm((prev) => ({ ...prev, mustHaveSkills: updated.join(', ') }));
    setNewMustSkill('');
  };

  const handleRemoveNiceSkill = (skillToRemove: string) => {
    const updated = niceSkillsList.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase());
    setCreateForm((prev) => ({ ...prev, niceToHaveSkills: updated.join(', ') }));
  };

  const handleAddNiceSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (niceSkillsList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewNiceSkill('');
      return;
    }
    const updated = [...niceSkillsList, trimmed];
    setCreateForm((prev) => ({ ...prev, niceToHaveSkills: updated.join(', ') }));
    setNewNiceSkill('');
  };

  const loadSampleJd = (type: 'fullstack' | 'devops' | 'data') => {
    if (type === 'fullstack') {
      const text = `Position: Senior Full Stack Developer
Location: Bengaluru, India (Hybrid)
Experience: 5 to 9 Years
Salary: 24,00,000 - 38,00,000 INR

About the Role:
We are looking for a Senior Full Stack Engineer to lead the architecture and development of our next-generation cloud services.

Key Requirements:
• 5+ years of production experience in React.js, TypeScript, and Node.js
• Deep experience with Google Cloud Platform (GCP) or AWS cloud architecture
• Hands-on familiarity with Golang, PostgreSQL, Docker, and Microservices
• Strong knowledge of REST APIs, event-driven architecture, and caching (Redis)
• Minimum B.Tech / B.E. in Computer Science or related degree

Responsibilities:
• Architect, build, and deploy low-latency, scalable web applications
• Optimize database performance and implement robust CI/CD deployment pipelines
• Partner with product managers and cross-functional engineering teams
• Mentor mid-level engineers and conduct technical code reviews`;
      setJdInputText(text);
      handleAnalyzeJd(text);
    } else if (type === 'devops') {
      const text = `Position: Lead DevOps & Cloud SRE Engineer
Location: Pune, India (Hybrid)
Experience: 6 to 10 Years
Salary: 28,00,000 - 45,00,000 INR

Responsibilities & Requirements:
• Hands-on mastery of Kubernetes (GKE / EKS), Docker containerization, and Helm
• Deep Infrastructure-as-Code experience with Terraform and Ansible
• Architect multi-region cloud networks on AWS and GCP with 99.99% SLA
• Build resilient CI/CD pipelines using GitHub Actions, GitLab CI, and ArgoCD
• Implement observability and metrics monitoring using Prometheus, Grafana, and Datadog
• Education: B.Tech / B.E. in Computer Science or Information Technology`;
      setJdInputText(text);
      handleAnalyzeJd(text);
    } else {
      const text = `Position: Senior Data Engineer
Location: Hyderabad, India (Remote)
Experience: 4 to 8 Years
Salary: 22,00,000 - 36,00,000 INR

Mandatory Requirements:
• 4+ years building large-scale data platforms using Python, PySpark, and SQL
• Deep experience with Snowflake or Databricks data lakehouse architectures
• Workflow orchestration using Apache Airflow and dbt
• Real-time stream processing with Apache Kafka or Google Cloud Pub/Sub
• Experience designing dimensional data models, ETL pipelines, and data quality tests`;
      setJdInputText(text);
      handleAnalyzeJd(text);
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

  if (viewMode === 'studio') {
    const activeBriefing = createdBriefing || aiBriefingPreview;

    return (
      <div className="space-y-6 pb-20 animate-fadeIn">
        {/* STUDIO TOP NAVIGATION BAR */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-4 z-30 backdrop-blur-md bg-white/95">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <ChevronLeft size={16} />
              <span>Back to Mandates</span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-900">
                  AI Requisition Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-100 to-indigo-100 text-[#0265FF]">
                  Collaborative Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Autonomous JD Parsing • 5-Pillar ATS Criteria Gate • Internal Recruiter Sourcing Playbook
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setJdInputText('');
                setAiBriefingPreview(null);
                setCreatedBriefing(null);
                setCreateForm({
                  title: '',
                  department: 'Engineering',
                  location: 'Bengaluru, India',
                  workMode: 'Hybrid',
                  experienceLevel: '4–8 Years',
                  salaryMin: '1800000',
                  salaryMax: '3200000',
                  openings: '1',
                  skills: '',
                  mustHaveSkills: '',
                  niceToHaveSkills: '',
                  minExperienceYears: '4',
                  maxExperienceYears: '8',
                  minQualification: 'Bachelor of Technology (B.Tech) / B.E. or Graduate Equivalent',
                  autoShortlistThreshold: 75,
                  autoShortlistMode: 'assisted',
                  description: '',
                  responsibilities: '',
                  requirements: '',
                });
              }}
              className="px-3.5 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition cursor-pointer"
            >
              Reset Form
            </button>

            <button
              type="button"
              onClick={handleCreateJob}
              disabled={createSaving || !createForm.title.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#0265FF] hover:bg-[#0055db] text-white font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 size={15} />
              <span>{createSaving ? 'Publishing Mandate…' : 'Publish Requisition'}</span>
            </button>
          </div>
        </div>

        {createSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{createSuccess}</span>
          </div>
        )}

        {/* HERO JD INTAKE COCKPIT */}
        <div className="bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 rounded-3xl border border-blue-200/90 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0265FF] to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">AI Job Assistant: Auto-Populate from JD</h4>
                <p className="text-xs text-slate-500">
                  Paste any job description, upload a document, or load a sample mandate. AI extracts clean titles, deduplicates skills, and builds the recruiter playbook.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Quick-Load Samples:</span>
              <button
                type="button"
                onClick={() => loadSampleJd('fullstack')}
                className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-[11px] font-bold shadow-xs cursor-pointer"
              >
                ⚡ Full Stack
              </button>
              <button
                type="button"
                onClick={() => loadSampleJd('devops')}
                className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-[11px] font-bold shadow-xs cursor-pointer"
              >
                ⚡ DevOps
              </button>
              <button
                type="button"
                onClick={() => loadSampleJd('data')}
                className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-[11px] font-bold shadow-xs cursor-pointer"
              >
                ⚡ Data Eng
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              rows={5}
              value={jdInputText}
              onChange={(e) => setJdInputText(e.target.value)}
              placeholder="Paste raw JD text here (or drop LinkedIn / Naukri mandate text with requirements, experience & responsibilities)..."
              className="w-full p-4 rounded-2xl border border-blue-200 bg-white font-medium text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF] resize-y placeholder:text-slate-400 shadow-inner"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer shadow-xs transition">
                  <Upload size={14} className="text-[#0265FF]" />
                  <span>Upload Document (.pdf, .docx, .txt)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = reader.result as string;
                          const b64 = result.includes(',') ? result.split(',')[1] : result;
                          handleAnalyzeJd('', b64, file.name);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {jdInputText && (
                  <button
                    type="button"
                    onClick={() => setJdInputText('')}
                    className="px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                  >
                    Clear Text
                  </button>
                )}
              </div>

              <button
                type="button"
                disabled={jdAnalyzing || (!jdInputText.trim() && !createForm.description)}
                onClick={() => handleAnalyzeJd(jdInputText.trim() || createForm.description)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0265FF] to-indigo-600 hover:from-[#0055db] hover:to-indigo-700 text-white font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {jdAnalyzing ? <RotateCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{jdAnalyzing ? 'Analyzing JD & Building Intelligence…' : '✨ Analyze & Populate Studio'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI EXTRACTION STATUS BAR (IF ANALYZED) */}
        {activeBriefing && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200/90 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Check size={14} />
              </div>
              <div>
                <span className="font-extrabold text-emerald-900 block">AI Intelligence Extracted & Curated</span>
                <span className="text-[11px] text-emerald-700">Canonical title, deduplicated skill cloud, and recruiter playbook populated</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-slate-800 font-bold">
                🎯 Title: <span className="text-[#0265FF]">{createForm.title}</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-slate-800 font-bold">
                ⭐ {mustSkillsList.length} Must-Have Skills
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-slate-800 font-bold">
                🛡️ Shortlist Gate: ≥{createForm.autoShortlistThreshold}%
              </span>
            </div>
          </div>
        )}

        {/* 2-COLUMN COLLABORATIVE STUDIO WORKSPACE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: AI RECRUITER PLAYBOOK & SOURCING INTELLIGENCE (5 cols) */}
          <div className="xl:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Compass size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">AI Recruiter Sourcing Playbook</h4>
                    <p className="text-[11px] text-slate-500">Internal recruiter guidance, probing criteria & interview questions</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700">
                  Playbook
                </span>
              </div>

              {!activeBriefing ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <Lightbulb size={28} className="mx-auto text-amber-500" />
                  <h5 className="text-xs font-bold text-slate-800">Recruiter Playbook Pending Analysis</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Once you paste a JD or load a sample above and click <strong>Analyze & Populate</strong>, the AI engine will construct:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-left text-[11px] text-slate-600 pt-1">
                    <div className="p-2 bg-white rounded-xl border border-slate-200">👤 Target Candidate Persona</div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">🔍 Sourcing Focus Areas</div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">🚩 Red vs Green Flags</div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">🔎 Boolean Search Syntax</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Persona Card */}
                  {(activeBriefing.candidatePersona || activeBriefing.targetCandidatePersona) && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/60 border border-indigo-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Target Candidate Persona</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                          {activeBriefing.candidatePersona?.seniorityBand || (createForm.minExperienceYears >= '5' ? 'Senior' : 'Mid-Level')}
                        </span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 text-sm">
                        {activeBriefing.candidatePersona?.archetype || activeBriefing.roleHeadline || createForm.title || 'Technical Specialist'}
                      </h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {activeBriefing.candidatePersona?.summary || activeBriefing.targetCandidatePersona}
                      </p>
                      {activeBriefing.candidatePersona?.traits && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {activeBriefing.candidatePersona.traits.map((trait: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/80 border border-indigo-200/60 text-slate-700 text-[10px] font-semibold">
                              ✓ {trait}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Core Focus Areas */}
                  {activeBriefing.coreFocusAreas && activeBriefing.coreFocusAreas.length > 0 && (
                    <div className="space-y-2.5">
                      <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        <Target size={13} className="text-[#0265FF]" />
                        <span>Core Recruiter Probing Areas</span>
                      </h5>
                      <div className="space-y-2">
                        {activeBriefing.coreFocusAreas.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{item.area}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                (item.priority || item.importance) === 'High' || (item.priority || item.importance) === 'CRITICAL'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {item.priority || (item.importance === 'CRITICAL' ? 'High' : 'Medium')} Priority
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              <strong className="text-slate-800">What to Probe:</strong> {item.whatToProbe}
                            </p>
                            {(item.technicalDepthVerification || item.goodAnswerSignals) && (
                              <p className="text-[11px] text-indigo-900/80 bg-indigo-50/50 p-2 rounded-xl">
                                <strong>Depth Check:</strong> {item.technicalDepthVerification || (Array.isArray(item.goodAnswerSignals) ? item.goodAnswerSignals.join('; ') : '')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red & Green Flags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Green Flags */}
                    {activeBriefing.greenFlags && (
                      <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>Green Flags (Top 5%)</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-emerald-950 font-medium">
                          {activeBriefing.greenFlags.map((flag: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-emerald-600 font-bold shrink-0">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Red Flags */}
                    {activeBriefing.redFlags && (
                      <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <AlertTriangle size={11} className="text-amber-600" />
                          <span>Red Flags (Sourcing Alerts)</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-amber-950 font-medium">
                          {activeBriefing.redFlags.map((flag: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-amber-600 font-bold shrink-0">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Boolean Search Query */}
                  {(activeBriefing.booleanSearchQuery || activeBriefing.sourcingPlaybook?.booleanSearchString) && (
                    <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Optimized Boolean String (LinkedIn / Naukri)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const queryToCopy = activeBriefing.booleanSearchQuery || activeBriefing.sourcingPlaybook?.booleanSearchString || '';
                            navigator.clipboard.writeText(queryToCopy);
                            setCopiedStudioBoolean(true);
                            setTimeout(() => setCopiedStudioBoolean(false), 2000);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 transition cursor-pointer"
                        >
                          {copiedStudioBoolean ? <CheckCheck size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          <span>{copiedStudioBoolean ? 'Copied!' : 'Copy String'}</span>
                        </button>
                      </div>
                      <pre className="font-mono text-[10px] text-blue-300 whitespace-pre-wrap break-all p-2 bg-slate-950/70 rounded-xl leading-relaxed">
                        {activeBriefing.booleanSearchQuery || activeBriefing.sourcingPlaybook?.booleanSearchString}
                      </pre>
                    </div>
                  )}

                  {/* Screening Questions */}
                  {activeBriefing.screeningQuestions && activeBriefing.screeningQuestions.length > 0 && (
                    <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block">
                        Knockout Telephone Screen Questions (Under 5 Mins)
                      </span>
                      <ol className="space-y-2 text-[11px] text-slate-700">
                        {activeBriefing.screeningQuestions.map((q: any, idx: number) => {
                          const qText = typeof q === 'string' ? q : q?.question || '';
                          const qRationale = typeof q === 'object' ? q?.rationale : null;
                          return (
                            <li key={idx} className="space-y-0.5">
                              <div className="flex items-start gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-slate-900">{qText}</span>
                              </div>
                              {qRationale && (
                                <p className="text-[10px] text-slate-500 pl-5.5 italic">Rationale: {qRationale}</p>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: REQUISITION SPECIFICATIONS & 5-PILLAR ATS ENGINE (7 cols) */}
          <div className="xl:col-span-7 space-y-5">
            <form onSubmit={handleCreateJob} className="space-y-5 text-xs">
              {/* CARD 1: GENERAL SPECIFICATIONS */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0265FF] flex items-center justify-center font-bold">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Requisition Specifications</h4>
                      <p className="text-[11px] text-slate-500">Core mandate details, headcount, and budget compensation</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                    Step 1 of 2
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Clean Job Title *</label>
                    <input
                      type="text"
                      required
                      value={createForm.title}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      placeholder="e.g. Senior Full Stack Developer"
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-900 text-sm outline-none focus:ring-2 focus:ring-[#0265FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
                      <select
                        value={createForm.workMode}
                        onChange={(e) => setCreateForm({ ...createForm, workMode: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-[#0265FF]"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Open Positions</label>
                      <input
                        type="number"
                        min={1}
                        value={createForm.openings}
                        onChange={(e) => setCreateForm({ ...createForm, openings: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Min Salary (INR / CTC)</label>
                      <input
                        type="number"
                        value={createForm.salaryMin}
                        onChange={(e) => setCreateForm({ ...createForm, salaryMin: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Salary (INR / CTC)</label>
                      <input
                        type="number"
                        value={createForm.salaryMax}
                        onChange={(e) => setCreateForm({ ...createForm, salaryMax: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: 5-PILLAR ATS MATCHING ENGINE & SHORTLIST GATE */}
              <div className="bg-white rounded-3xl border border-blue-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Target size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">5-Pillar ATS Qualification Gate</h4>
                      <p className="text-[11px] text-slate-500">
                        Weights: Mandatory Skills (40%), Experience (25%), Secondary Skills (15%), Education (10%), Titles (10%)
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0265FF]">
                    Scoring Engine
                  </span>
                </div>

                <div className="space-y-4">
                  {/* MANDATORY SKILLS TAG CLOUD */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Tag size={13} className="text-[#0265FF]" />
                        <span>Mandatory (Must-Have) Skills *</span>
                        <span className="text-[10px] text-slate-400 font-mono">({mustSkillsList.length} skills)</span>
                      </label>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        Determines 40% of ATS score
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                        {mustSkillsList.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMustSkill(skill)}
                              className="hover:bg-blue-700 rounded-full p-0.5 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        {mustSkillsList.length === 0 && (
                          <span className="text-slate-400 text-xs italic">No mandatory skills added yet.</span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-slate-200/70">
                        <input
                          type="text"
                          value={newMustSkill}
                          onChange={(e) => setNewMustSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMustSkill(newMustSkill);
                            }
                          }}
                          placeholder="Type a must-have skill & press Enter (e.g. React.js, Golang, GCP)..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddMustSkill(newMustSkill)}
                          disabled={!newMustSkill.trim()}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECONDARY SKILLS TAG CLOUD */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Tag size={13} className="text-indigo-600" />
                        <span>Secondary (Nice-to-Have) Skills</span>
                        <span className="text-[10px] text-slate-400 font-mono">({niceSkillsList.length} skills)</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Determines 15% bonus match
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                        {niceSkillsList.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveNiceSkill(skill)}
                              className="hover:bg-indigo-200 rounded-full p-0.5 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        {niceSkillsList.length === 0 && (
                          <span className="text-slate-400 text-xs italic">No secondary skills added.</span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-slate-200/70">
                        <input
                          type="text"
                          value={newNiceSkill}
                          onChange={(e) => setNewNiceSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNiceSkill(newNiceSkill);
                            }
                          }}
                          placeholder="Type a nice-to-have skill & press Enter (e.g. Docker, GraphQL, Kubernetes)..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddNiceSkill(newNiceSkill)}
                          disabled={!newNiceSkill.trim()}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-900 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EXPERIENCE & EDUCATION GATES */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Min Experience (Years)</label>
                      <input
                        type="number"
                        min={0}
                        value={createForm.minExperienceYears}
                        onChange={(e) => setCreateForm({ ...createForm, minExperienceYears: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Experience (Years)</label>
                      <input
                        type="number"
                        min={0}
                        value={createForm.maxExperienceYears}
                        onChange={(e) => setCreateForm({ ...createForm, maxExperienceYears: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Minimum Degree / Education</label>
                      <select
                        value={createForm.minQualification}
                        onChange={(e) => setCreateForm({ ...createForm, minQualification: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      >
                        <option value="Bachelor of Technology (B.Tech) / B.E. or Graduate Equivalent">B.Tech / B.E. or Any Graduate</option>
                        <option value="Bachelor of Computer Applications (BCA) / MCA">BCA / MCA</option>
                        <option value="Bachelor of Commerce (B.Com) / BBA">B.Com / BBA</option>
                        <option value="Master of Technology (M.Tech) / M.S.">M.Tech / M.S. or Higher</option>
                        <option value="Any Graduate / Diploma">Any Graduate / Diploma</option>
                      </select>
                    </div>
                  </div>

                  {/* THRESHOLD SLIDER & TRIGGER MODE */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <label className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                          <Target size={14} className="text-[#0265FF]" />
                          <span>Auto-Shortlist Score Threshold:</span>
                        </label>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#0265FF] text-white">
                          ≥ {createForm.autoShortlistThreshold}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={95}
                        step={5}
                        value={createForm.autoShortlistThreshold}
                        onChange={(e) => setCreateForm({ ...createForm, autoShortlistThreshold: parseInt(e.target.value, 10) })}
                        className="w-56 accent-[#0265FF] cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        {createForm.autoShortlistThreshold >= 80
                          ? '🔥 High Selectivity: Only elite matches qualify automatically'
                          : createForm.autoShortlistThreshold >= 70
                          ? '⭐ Balanced Gate: Solid qualification with healthy candidate volume'
                          : '⚡ Permissive Gate: Wider net for high-demand specialized skills'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block text-xs">Shortlist Trigger Mode</label>
                      <select
                        value={createForm.autoShortlistMode}
                        onChange={(e) => setCreateForm({ ...createForm, autoShortlistMode: e.target.value })}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold shadow-xs"
                      >
                        <option value="assisted">Assisted (Highlight + 1-Click Shortlist)</option>
                        <option value="automatic">Automatic (Move to Pipeline Instantly)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: CLEANED OVERVIEW, RESPONSIBILITIES & REQUIREMENTS */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Requisition Copy & Cleaned Text</h4>
                      <p className="text-[11px] text-slate-500">Filtered of hashtags, agency boilerplate, and social sharing noise</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                    Clean Copy
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Job Description & Overview</label>
                    <textarea
                      rows={3}
                      value={createForm.description}
                      onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Key Responsibilities (one per line)</label>
                    <textarea
                      rows={4}
                      value={createForm.responsibilities}
                      onChange={(e) => setCreateForm({ ...createForm, responsibilities: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mandatory Requirements (one per line)</label>
                    <textarea
                      rows={4}
                      value={createForm.requirements}
                      onChange={(e) => setCreateForm({ ...createForm, requirements: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#0265FF]"
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM ACTION BAR */}
              <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-4 z-20">
                <div className="text-xs text-slate-600 font-medium">
                  Ready to post <strong className="text-slate-900">{createForm.title || 'Untitled Mandate'}</strong> with{' '}
                  <span className="text-[#0265FF] font-bold">{mustSkillsList.length} Must-Have Skills</span> and threshold ≥{' '}
                  <span className="text-[#0265FF] font-bold">{createForm.autoShortlistThreshold}%</span>.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createSaving || !createForm.title.trim()}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#0265FF] hover:bg-[#0055db] text-white font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    <span>{createSaving ? 'Publishing Mandate…' : 'Publish Requisition & ATS Criteria'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => setViewMode('studio')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0265FF] to-indigo-600 hover:from-[#0055db] hover:to-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
          >
            <Sparkles size={14} />
            <span>AI Requisition Studio</span>
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
            onClick={() => setViewMode('studio')}
            className="px-4 py-2 rounded-xl bg-blue-50 text-[#0265FF] font-bold text-xs hover:bg-blue-100 cursor-pointer"
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

            {/* DRAWER VIEW TABS */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setDrawerTab('details')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  drawerTab === 'details' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Overview & Pipeline Stages
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('playbook')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  drawerTab === 'playbook' ? 'bg-white text-[#0265FF] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles size={13} className="text-[#0265FF]" />
                <span>Recruiter Playbook & Focus Areas</span>
                {selectedJob.briefing && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            </div>

            {drawerTab === 'playbook' ? (
              <div className="space-y-4">
                {!selectedJob.briefing ? (
                  <div className="p-6 bg-gradient-to-br from-blue-50/70 to-indigo-50/60 rounded-3xl border border-blue-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 text-[#0265FF] flex items-center justify-center mx-auto shadow-sm">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Generate AI Recruiter Sourcing Playbook</h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                        Analyze this mandate’s requirements to automatically generate core technical focus areas, red/green flags, LinkedIn Boolean search strings, and knockout screening interview questions.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={playbookGenerating}
                      onClick={() => handleGenerateJobPlaybook(selectedJob)}
                      className="px-5 py-2.5 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {playbookGenerating ? <RotateCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      <span>{playbookGenerating ? 'Analyzing Mandate with AI…' : '✨ Generate Recruiter Playbook'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    {/* Persona & Market Context */}
                    <div className="p-4 bg-slate-900 text-white rounded-3xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                          <Compass size={11} /> Target Persona
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ATS AI Briefing</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{selectedJob.briefing.roleHeadline}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{selectedJob.briefing.targetCandidatePersona}</p>
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <strong className="text-slate-200">Market Context:</strong> {selectedJob.briefing.marketContext}
                      </div>
                    </div>

                    {/* Core Focus Areas */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <Lightbulb size={14} className="text-amber-500" />
                        <span>Core Technical Focus Areas (What Recruiters Must Probe)</span>
                      </h4>
                      <div className="space-y-2">
                        {(selectedJob.briefing.coreFocusAreas || []).map((area: any, idx: number) => (
                          <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 text-xs">{area.area}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                area.importance === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                                area.importance === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {area.importance}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{area.whatToProbe}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Red Flags & Green Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-red-50/70 rounded-2xl border border-red-200 space-y-2">
                        <h5 className="font-black text-red-900 text-[11px] uppercase tracking-wide flex items-center gap-1">
                          <AlertTriangle size={13} className="text-red-600" /> Disqualifying Red Flags
                        </h5>
                        <ul className="space-y-1 text-[11px] text-red-950">
                          {(selectedJob.briefing.redFlags || []).map((rf: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-red-600 font-bold shrink-0">•</span>
                              <span>{rf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                        <h5 className="font-black text-emerald-900 text-[11px] uppercase tracking-wide flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-600" /> Standout Green Flags
                        </h5>
                        <ul className="space-y-1 text-[11px] text-emerald-950">
                          {(selectedJob.briefing.greenFlags || []).map((gf: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold shrink-0">•</span>
                              <span>{gf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* LinkedIn Boolean Search Playbook */}
                    {selectedJob.briefing.sourcingPlaybook && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                            <Compass size={14} className="text-[#0265FF]" /> LinkedIn & Sourcing Boolean Search String
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedJob.briefing.sourcingPlaybook.booleanSearchString);
                              setCopiedBoolean(true);
                              setTimeout(() => setCopiedBoolean(false), 2000);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shadow-sm cursor-pointer"
                          >
                            {copiedBoolean ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            <span>{copiedBoolean ? 'Copied!' : 'Copy Query'}</span>
                          </button>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[10px] text-slate-800 break-words leading-relaxed select-all">
                          {selectedJob.briefing.sourcingPlaybook.booleanSearchString}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Target Hubs:</span>
                          {(selectedJob.briefing.sourcingPlaybook.targetIndustriesAndCompanies || []).map((t: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200/60">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Knockout Screening Interview Questions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText size={14} className="text-[#0265FF]" /> Knockout Screening Interview Questions (Phone Screen)
                      </h4>
                      <div className="space-y-2.5">
                        {(selectedJob.briefing.screeningQuestions || []).map((q: any, idx: number) => {
                          const qText = typeof q === 'string' ? q : q?.question || '';
                          const qCat = typeof q === 'object' ? q?.category : 'Screening';
                          const qRationale = typeof q === 'object' ? q?.rationale : null;
                          return (
                            <div key={idx} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-black text-slate-900 text-xs">
                                  {idx + 1}. {qText}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[9px] uppercase shrink-0">
                                  {qCat}
                                </span>
                              </div>
                              {qRationale && (
                                <p className="text-[10px] text-slate-500 italic"><strong className="text-slate-700 not-italic">Rationale:</strong> {qRationale}</p>
                              )}
                              {q.goodAnswerSignals && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[10px]">
                                  <div className="p-2 bg-emerald-50/60 rounded-xl text-emerald-950">
                                    <span className="font-bold text-emerald-800 block mb-0.5">✓ Good Answer Signals:</span>
                                    <ul className="space-y-0.5">
                                      {(q.goodAnswerSignals || []).map((s: string, sIdx: number) => (
                                        <li key={sIdx}>• {s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="p-2 bg-red-50/60 rounded-xl text-red-950">
                                    <span className="font-bold text-red-800 block mb-0.5">✗ Red Flag Signals:</span>
                                    <ul className="space-y-0.5">
                                      {(q.redFlagSignals || []).map((r: string, rIdx: number) => (
                                        <li key={rIdx}>• {r}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
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
            </>
            )}

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

    </div>
  );
}
