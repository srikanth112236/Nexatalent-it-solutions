import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  X,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Zap,
  Building,
  Mail,
  FileText,
  Download,
  ExternalLink,
  RefreshCw,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { atsApi, apiClient } from '../../../shared/enterprise/phaseApi';
import { InlineLoading } from '../../../shared/ui/DataState';
import { PdfResumeViewerModal } from '../../../shared/ui/PdfResumeViewerModal';

export function parseCandidateSkills(raw: any): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((s) => (typeof s === 'string' ? s.trim() : String(s || '').trim()))
      .filter((s) => Boolean(s) && s.length > 0);
  }
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw
      .split(/[,|•\n]/)
      .map((s) => s.trim())
      .filter((s) => Boolean(s) && s.length > 0);
  }
  return [];
}

export function AtsCandidateCrmView() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [targetJobId, setTargetJobId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [minExp, setMinExp] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showGuide, setShowGuide] = useState(false);

  // Candidate 360 Drawer State
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [candidateDetail, setCandidateDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'resume' | 'notes' | 'activity'>('overview');

  // Embedded Resume Viewer inside Drawer
  const [embeddedResumeUrl, setEmbeddedResumeUrl] = useState<string>('');
  const [embeddedResumeLoading, setEmbeddedResumeLoading] = useState(false);
  const [embeddedResumeError, setEmbeddedResumeError] = useState('');

  // Standalone Fullscreen Resume Modal
  const [resumePreview, setResumePreview] = useState<{ applicationId?: string; leadId?: string; candidateId?: string; title?: string; filename?: string } | null>(null);

  // Shortlisting action feedback
  const [attachingId, setAttachingId] = useState<string | null>(null);
  const [attachFeedback, setAttachFeedback] = useState<string | null>(null);

  // Evaluation Notes
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
    location: 'Bengaluru, India',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: 'Immediate / 30 Days',
  });
  const [dupWarning, setDupWarning] = useState<string | null>(null);
  const [createSaving, setCreateSaving] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');

  // 1. Load candidates from API
  const loadCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (skillFilter.trim()) params.set('skills', skillFilter.trim());
      if (minExp) params.set('minExp', minExp);
      params.set('pageSize', '100');

      const res: any = await atsApi.candidates(`?${params.toString()}`);
      const list = res?.data?.items || res?.data || [];
      setCandidates(list);

      // Keep detail synced if candidate is currently open in drawer
      if (selectedCandidate) {
        const updated = list.find((c: any) => c.id === selectedCandidate.id);
        if (updated) setSelectedCandidate(updated);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Load active jobs for mandate evaluation
  useEffect(() => {
    (async () => {
      try {
        const res: any = await atsApi.jobs('?pageSize=50');
        const list = res?.data?.items || res?.data || [];
        setJobs(list);
      } catch { /* noop */ }
    })();
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [q, skillFilter, minExp]);

  // Load embedded resume stream when drawer opens or tab switches to 'resume'
  useEffect(() => {
    if (!selectedCandidate) {
      if (embeddedResumeUrl) {
        URL.revokeObjectURL(embeddedResumeUrl);
        setEmbeddedResumeUrl('');
      }
      return;
    }

    if (drawerTab === 'resume' && !embeddedResumeUrl && !embeddedResumeLoading) {
      loadEmbeddedResume(selectedCandidate);
    }
  }, [selectedCandidate, drawerTab]);

  const loadEmbeddedResume = async (cand: any) => {
    setEmbeddedResumeLoading(true);
    setEmbeddedResumeError('');
    try {
      const blob: Blob = await apiClient.getBlob(`/api/v1/ats/candidates/${cand.id}/resume`);
      if (embeddedResumeUrl) URL.revokeObjectURL(embeddedResumeUrl);
      const url = URL.createObjectURL(blob);
      setEmbeddedResumeUrl(url);
    } catch (err: any) {
      setEmbeddedResumeError(err?.message || 'Could not stream resume document.');
    } finally {
      setEmbeddedResumeLoading(false);
    }
  };

  // Algorithmic ATS match calculator for CRM profiles against selected mandate
  const evaluateCandidateMatch = (cand: any, job: any) => {
    if (!job) return { score: 0, tier: 'LOW', isEligible: false, matchedSkills: [] as string[], missingSkills: [] as string[] };
    const candSkills = parseCandidateSkills(cand.skills).map((s) => s.toLowerCase());
    const mustHave: string[] = (job.mustHaveSkills && job.mustHaveSkills.length > 0) ? job.mustHaveSkills : (job.skills || []).slice(0, 4);

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const req of mustHave) {
      const r = req.toLowerCase();
      if (candSkills.some((s: string) => s.includes(r) || r.includes(s))) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    const skillScore = mustHave.length > 0 ? (matchedSkills.length / mustHave.length) * 40 : 40;
    const reqExp = job.minExperienceYears || 3;
    const exp = Number(cand.experienceYears || 3);
    const expScore = exp >= reqExp ? 25 : exp >= reqExp * 0.7 ? 18 : Math.max(5, Math.round((exp / reqExp) * 20));

    let titleScore = 10;
    const h = String(cand.headline || cand.roleTitle || cand.currentTitle || '').toLowerCase();
    const t = String(job.title || '').toLowerCase();
    if (h && t && (h.includes(t) || t.includes(h))) titleScore = 15;
    else if (['developer', 'engineer', 'architect', 'lead', 'full stack', 'devops', 'backend', 'frontend'].some((kw) => h.includes(kw) && t.includes(kw))) titleScore = 13;

    const total = Math.min(100, Math.round(skillScore + expScore + titleScore + 18));
    const threshold = job.autoShortlistThreshold || 75;

    return {
      score: total,
      tier: (total >= 75 ? 'HIGH' : total >= 50 ? 'MEDIUM' : 'LOW') as 'HIGH' | 'MEDIUM' | 'LOW',
      isEligible: total >= threshold,
      matchedSkills,
      missingSkills,
    };
  };

  const handleAttachAndShortlist = async (cand: any) => {
    if (!targetJobId) return;
    setAttachingId(cand.id);
    try {
      await atsApi.createApplication({
        jobId: targetJobId,
        candidateEmail: cand.email,
        candidateName: cand.name,
        phone: cand.phone,
        source: 'Recruiter CRM Sourcing',
      });
      setAttachFeedback(`⚡ Candidate ${cand.name} attached & shortlisted for ${selectedJob?.title || targetJobId}!`);
      setTimeout(() => setAttachFeedback(null), 5000);
      loadCandidates();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Could not shortlist candidate');
    } finally {
      setAttachingId(null);
    }
  };

  const openCandidate360 = async (cand: any, tab: 'overview' | 'resume' | 'notes' | 'activity' = 'overview') => {
    setSelectedCandidate(cand);
    setDrawerTab(tab);
    setDetailLoading(true);
    try {
      const res: any = await atsApi.candidate360(cand.id);
      setCandidateDetail(res?.data || cand);
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
            location: 'Bengaluru, India',
            currentCtc: '',
            expectedCtc: '',
            noticePeriod: 'Immediate / 30 Days',
          });
        }, 1200);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to create candidate profile');
    } finally {
      setCreateSaving(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === targetJobId);
  const activeFiltersCount = (q ? 1 : 0) + (targetJobId ? 1 : 0) + (skillFilter ? 1 : 0) + (minExp ? 1 : 0);

  // Qualified count for selected job
  const qualifiedCount = selectedJob
    ? candidates.filter((c) => evaluateCandidateMatch(c, selectedJob).isEligible).length
    : 0;

  return (
    <div className="space-y-5">
      {/* 1. TOP STATS KPI BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Talent Pool</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{candidates.length} Profiles</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0265FF] flex items-center justify-center font-bold">
            <User size={18} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Mandate</span>
            <div className="text-xs font-black text-slate-900 mt-1 truncate max-w-[130px]">
              {selectedJob ? selectedJob.title : 'None Selected'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building size={18} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mandate Qualified</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">
              {selectedJob ? `${qualifiedCount} Candidates` : '—'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Immediate Notice</span>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {candidates.filter((c) => /immediate|15|30/i.test(c.noticePeriod || '')).length} Candidates
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* 2. SOURCING BEST PRACTICE GUIDE (COLLAPSIBLE) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">How to Get 5x Faster Sourcing Responses from this Database</h4>
              <p className="text-xs text-slate-300 font-medium">Follow this 3-step recruiter workflow to match, verify, and shortlist candidates in seconds</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            {showGuide ? <><ChevronUp size={14} /> Hide Guide</> : <><ChevronDown size={14} /> View Playbook</>}
          </button>
        </div>

        {showGuide && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <div className="font-extrabold text-sky-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/30 flex items-center justify-center text-[10px] text-white">1</span>
                Target Mandate Assessment
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Select an open requisition in the dropdown. The engine calculates dynamic ATS match scores across all profiles based on required skills & experience.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] text-white">2</span>
                1-Click Fast Shortlist
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Look for candidates tagged with <strong className="text-emerald-400">🟢 Qualified (≥75%)</strong>. Click <strong>"⚡ Shortlist"</strong> to instantly link them to the active hiring pipeline.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <div className="font-extrabold text-purple-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px] text-white">3</span>
                Embedded PDF & History
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Click <strong>"Inspect Profile"</strong> to review past companies timeline, candidate summary, and embedded verified PDF resume without downloading.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. SEARCH & SOURCING CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <User size={18} className="text-[#0265FF]" /> Candidate CRM Master Talent Pool
            </h3>
            <p className="text-xs text-slate-500 font-medium">Search, filter, evaluate, and inspect candidate profiles across all sourcing channels</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid size={14} /> Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Dense Table View"
              >
                <List size={14} /> Table
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setShowCreateModal(true); setDupWarning(null); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Plus size={14} /> Add Candidate Profile
            </button>
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">{error}</div>}

        {attachFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{attachFeedback}</span>
            </div>
            <button type="button" onClick={() => setAttachFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Search Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search candidate name, role, company, skills, email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={targetJobId}
              onChange={(e) => setTargetJobId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold outline-none focus:ring-2 focus:ring-[#0265FF] bg-blue-50/70 text-[#0265FF] truncate"
            >
              <option value="">🎯 Select Target Mandate for ATS Matching</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} (Req: {j.minExperienceYears || 3}+y &bull; Threshold: {j.autoShortlistThreshold || 75}%)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0265FF] bg-slate-50 text-slate-700"
            >
              <option value="">All Skills</option>
              <option value="React">React.js</option>
              <option value="Node">Node.js</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Golang">Golang (Go)</option>
              <option value="Python">Python</option>
              <option value="AWS">AWS</option>
              <option value="Docker">Docker & K8s</option>
              <option value="MongoDB">MongoDB</option>
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
              <option value="8">8+ Years</option>
            </select>
          </div>
        </div>

        {/* 4. ACTIVE SEARCH & EVALUATION CRITERIA RIBBON */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Sourcing Criteria:</span>
            {targetJobId && selectedJob && (
              <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-[#0265FF] font-extrabold flex items-center gap-1">
                🎯 Mandate: {selectedJob.title}
                <button type="button" onClick={() => setTargetJobId('')} className="hover:text-blue-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {q && (
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center gap-1">
                🔍 "{q}"
                <button type="button" onClick={() => setQ('')} className="hover:text-slate-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {skillFilter && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center gap-1 border border-emerald-200">
                ⚡ Skill: {skillFilter}
                <button type="button" onClick={() => setSkillFilter('')} className="hover:text-emerald-950">
                  <X size={12} />
                </button>
              </span>
            )}
            {minExp && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold flex items-center gap-1 border border-amber-200">
                💼 Exp: &ge;{minExp} Years
                <button type="button" onClick={() => setMinExp('')} className="hover:text-amber-950">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={() => { setQ(''); setTargetJobId(''); setSkillFilter(''); setMinExp(''); }}
              className="text-[11px] text-red-600 hover:text-red-800 font-extrabold underline ml-auto cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* 5. CANDIDATE LIST / CARDS */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 shadow-sm">
          <InlineLoading message="Loading candidate master database & ATS profiles…" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 shadow-sm text-center space-y-3">
          <User size={36} className="mx-auto text-slate-300" />
          <h4 className="text-base font-extrabold text-slate-900">No Candidates Found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No talent profiles match your current search and filter criteria. Try clearing some filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((cand) => {
            const match = selectedJob ? evaluateCandidateMatch(cand, selectedJob) : null;
            const initials = (cand.name || 'Candidate')
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={cand.id}
                className={`bg-white rounded-3xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${
                  match && match.isEligible
                    ? 'border-emerald-300 ring-2 ring-emerald-100'
                    : 'border-slate-200/90 hover:border-blue-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm ${
                        match && match.isEligible
                          ? 'bg-emerald-600'
                          : match && match.score >= 50
                          ? 'bg-amber-500'
                          : 'bg-slate-800'
                      }`}>
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#0265FF] transition truncate">
                          {cand.name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 truncate flex items-center gap-1 mt-0.5">
                          <Building size={11} className="text-slate-400 shrink-0" />
                          {cand.currentCompany || cand.headline || 'Tech Professional'}
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge (if mandate selected) */}
                    {match ? (
                      <div
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black border flex items-center gap-1 shrink-0 ${
                          match.isEligible
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : match.score >= 50
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title={match.isEligible ? 'Mandate Qualified' : 'Under Threshold'}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${match.isEligible ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {match.score}% {match.isEligible && 'Pass'}
                      </div>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {cand.experienceYears ? `${cand.experienceYears}y exp` : '3-5y'}
                      </span>
                    )}
                  </div>

                  {/* Metadata & Contact */}
                  <div className="text-xs text-slate-500 font-medium space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{cand.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <MapPin size={11} className="text-slate-400 shrink-0" />
                        {cand.location || 'Bengaluru, India'}
                      </span>
                      <span className="text-slate-500 font-mono">
                        Notice: {cand.noticePeriod || '30d'}
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(() => {
                      const skillsList = parseCandidateSkills(cand.skills);
                      const displayList = skillsList.length > 0 ? skillsList : ['React.js', 'Node.js'];
                      return displayList.slice(0, 4).map((s: string, idx: number) => {
                        const isMatch = match?.matchedSkills.some((m) => m.toLowerCase().includes(s.toLowerCase()));
                        return (
                          <span
                            key={`${s}-${idx}`}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                              isMatch
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {s}
                          </span>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    {cand.applicationsCount > 0 ? (
                      <span className="text-[#0265FF] font-extrabold">{cand.applicationsCount} app(s)</span>
                    ) : (
                      <span>Talent Pool</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* 1-Click Shortlist Button */}
                    {targetJobId && (
                      <button
                        type="button"
                        disabled={attachingId === cand.id}
                        onClick={() => handleAttachAndShortlist(cand)}
                        title="Shortlist & Fast-track candidate to selected mandate"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm transition cursor-pointer disabled:opacity-50"
                      >
                        <Zap size={11} className="fill-current text-amber-300" />
                        <span>{attachingId === cand.id ? 'Linking…' : 'Shortlist'}</span>
                      </button>
                    )}

                    {/* Preview PDF Resume */}
                    <button
                      type="button"
                      onClick={() => {
                        setResumePreview({
                          candidateId: cand.id,
                          leadId: cand.id,
                          title: `${cand.name} — Resume`,
                          filename: cand.resumeName || `${cand.name}-Resume.pdf`,
                        });
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Preview PDF Resume"
                    >
                      <FileText size={13} className="text-red-500" />
                    </button>

                    {/* Inspect Profile */}
                    <button
                      type="button"
                      onClick={() => openCandidate360(cand, 'overview')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                    >
                      Inspect Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DENSE TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Candidate & Current Role</th>
                  <th className="py-3.5 px-4">Contact & Location</th>
                  {selectedJob && <th className="py-3.5 px-4">Mandate Match</th>}
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Notice Period</th>
                  <th className="py-3.5 px-4">Key Skills</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((cand) => {
                  const match = selectedJob ? evaluateCandidateMatch(cand, selectedJob) : null;
                  return (
                    <tr
                      key={cand.id}
                      className="hover:bg-blue-50/30 transition group cursor-pointer"
                      onClick={() => openCandidate360(cand, 'overview')}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 group-hover:text-[#0265FF] transition">
                          {cand.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {cand.currentCompany || cand.headline || 'Software Engineer'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-600 text-[11px]">{cand.email}</div>
                        <div className="text-[10px] text-slate-400">{cand.location || 'India'}</div>
                      </td>

                      {selectedJob && (
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black border inline-flex items-center gap-1 ${
                            match?.isEligible
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : match && match.score >= 50
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {match?.score}% {match?.isEligible && 'Pass'}
                          </span>
                        </td>
                      )}

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {cand.experienceYears ? `${cand.experienceYears}y exp` : '3-5y'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {cand.noticePeriod || 'Immediate / 30d'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {parseCandidateSkills(cand.skills).join(', ') || 'React, Node'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {targetJobId && (
                            <button
                              type="button"
                              onClick={() => handleAttachAndShortlist(cand)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Shortlist to Mandate"
                            >
                              <Zap size={11} className="text-amber-300 fill-current" /> Shortlist
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setResumePreview({
                                candidateId: cand.id,
                                leadId: cand.id,
                                title: `${cand.name} — Resume`,
                                filename: cand.resumeName || 'Resume.pdf',
                              });
                            }}
                            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                            title="Preview Resume"
                          >
                            <FileText size={13} className="text-red-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openCandidate360(cand, 'overview')}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] cursor-pointer"
                          >
                            Inspect
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
      {/* 🚀 UPGRADED CANDIDATE 360° PROFILE & EMBEDDED RESUME DRAWER               */}
      {/* ========================================================================= */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6 text-white shrink-0 relative">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
                title="Close Drawer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 pr-10">
                <div className="w-14 h-14 rounded-2xl bg-[#0265FF] flex items-center justify-center font-black text-xl text-white shadow-lg shrink-0">
                  {(selectedCandidate.name || 'C')
                    .split(' ')
                    .map((w: string) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-extrabold text-white truncate">{selectedCandidate.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      Master Profile
                    </span>
                  </div>
                  <p className="text-xs text-sky-300 font-semibold mt-0.5 flex items-center gap-1.5 truncate">
                    <Building size={12} />
                    {selectedCandidate.currentCompany || selectedCandidate.headline || 'Software Engineer'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    {selectedCandidate.email} {selectedCandidate.phone && `• ${selectedCandidate.phone}`}
                  </p>
                </div>
              </div>

              {/* Fast Shortlist Action in Drawer Header */}
              {targetJobId && selectedJob && (
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-400">Match for {selectedJob.title}:</span>
                    <span className="ml-2 font-black text-emerald-400">
                      {evaluateCandidateMatch(selectedCandidate, selectedJob).score}% Fit
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAttachAndShortlist(selectedCandidate)}
                    disabled={attachingId === selectedCandidate.id}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Zap size={13} /> 1-Click Shortlist
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Sub-Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setDrawerTab('overview')}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  drawerTab === 'overview'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <User size={14} /> Overview & Experience
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('resume')}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  drawerTab === 'resume'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText size={14} className="text-red-500" /> Embedded PDF Resume
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('notes')}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  drawerTab === 'notes'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare size={14} /> Notes ({candidateNotes.length})
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('activity')}
                className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  drawerTab === 'activity'
                    ? 'border-[#0265FF] text-[#0265FF] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Clock size={14} /> Activity ({candidateActivity.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {/* TAB 1: OVERVIEW & EXPERIENCE */}
              {drawerTab === 'overview' && (
                <div className="space-y-5">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Experience</span>
                      <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.experienceYears || 3} Years</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                      <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.location || 'India'}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Notice Period</span>
                      <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.noticePeriod || 'Immediate'}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Expected CTC</span>
                      <p className="font-extrabold text-slate-900 mt-0.5">{selectedCandidate.expectedCtc || 'Competitive'}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={13} className="text-[#0265FF]" /> Executive Profile Summary
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {selectedCandidate.summary ||
                        `${selectedCandidate.name} has ${selectedCandidate.experienceYears || 3}+ years of industry engineering experience in building robust web applications and resilient backend services.`}
                    </p>
                  </div>

                  {/* Companies & Work Experience */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building size={14} className="text-[#0265FF]" /> Professional Work Experience & Companies
                    </h4>

                    {selectedCandidate.experiences && selectedCandidate.experiences.length > 0 ? (
                      <div className="space-y-2.5">
                        {selectedCandidate.experiences.map((exp: any, idx: number) => {
                          const comp = typeof exp === 'string' ? exp : (exp.company || exp.companyName || 'Company');
                          const title = typeof exp === 'string' ? selectedCandidate.headline : (exp.title || exp.role || 'Software Engineer');
                          const duration = typeof exp === 'string' ? '' : (exp.duration || exp.period || '');
                          const desc = typeof exp === 'string' ? '' : (exp.description || exp.summary || '');

                          return (
                            <div key={idx} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <h6 className="text-xs font-extrabold text-slate-900">{title}</h6>
                                {duration && <span className="text-[10px] font-mono text-slate-400">{duration}</span>}
                              </div>
                              <div className="text-xs font-bold text-[#0265FF]">{comp}</div>
                              {desc && <p className="text-xs text-slate-600">{desc}</p>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <h6 className="text-xs font-extrabold text-slate-900">{selectedCandidate.headline || 'Full Stack Developer'}</h6>
                          <span className="text-[10px] font-mono text-slate-400">Present</span>
                        </div>
                        <div className="text-xs font-bold text-[#0265FF]">
                          {selectedCandidate.currentCompany || 'Vedasynk Technologies'}
                        </div>
                        <p className="text-xs text-slate-600">
                          Full-stack system engineering, microservices integration, and scalable UI application delivery.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Skills Matrix */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Technical Skills Matrix
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(() => {
                        const skills = parseCandidateSkills(selectedCandidate.skills);
                        const list = skills.length > 0 ? skills : ['React.js', 'Node.js', 'TypeScript'];
                        return list.map((sk: string, idx: number) => (
                          <span key={`${sk}-${idx}`} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold">
                            {sk}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Application History */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Application History ({candidateDetail?.applications?.length || 0})
                    </h4>
                    {detailLoading ? (
                      <p className="text-xs text-slate-400 italic">Loading applications…</p>
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
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                              {app.stage}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: EMBEDDED PDF RESUME */}
              {drawerTab === 'resume' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-red-500" />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {selectedCandidate.resumeName || `${selectedCandidate.name}-Resume.pdf`}
                        </div>
                        <div className="text-[10px] text-slate-400">Official Candidate CV Stream</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => loadEmbeddedResume(selectedCandidate)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white transition flex items-center gap-1 cursor-pointer"
                        title="Reload Document"
                      >
                        <RefreshCw size={12} /> Reload
                      </button>

                      {embeddedResumeUrl && (
                        <a
                          href={embeddedResumeUrl}
                          download={selectedCandidate.resumeName || `${selectedCandidate.name}-Resume.pdf`}
                          className="px-3 py-1.5 rounded-xl bg-[#0265FF] text-white text-xs font-bold hover:bg-blue-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download size={13} /> Download PDF
                        </a>
                      )}

                      {embeddedResumeUrl && (
                        <a
                          href={embeddedResumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
                          title="Open Fullscreen"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Frame */}
                  <div className="h-[520px] rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative shadow-inner">
                    {embeddedResumeLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                        <InlineLoading message="Streaming candidate resume PDF..." />
                      </div>
                    ) : embeddedResumeError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2 bg-white">
                        <AlertTriangle size={32} className="text-amber-500 mx-auto" />
                        <h5 className="text-sm font-bold text-slate-800">Resume Stream Unavailable</h5>
                        <p className="text-xs text-slate-500 max-w-sm">{embeddedResumeError}</p>
                        <button
                          type="button"
                          onClick={() => loadEmbeddedResume(selectedCandidate)}
                          className="px-3 py-1.5 rounded-xl bg-[#0265FF] text-white text-xs font-bold mt-2"
                        >
                          Retry Stream
                        </button>
                      </div>
                    ) : embeddedResumeUrl ? (
                      <iframe
                        src={embeddedResumeUrl}
                        title="Candidate Resume"
                        className="w-full h-full border-none"
                      />
                    ) : null}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES */}
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
                        className="px-4 py-2 rounded-xl bg-[#0265FF] text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
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

              {/* TAB 4: ACTIVITY */}
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

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
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
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText size={13} className="text-red-500" /> Popout Fullscreen Viewer
              </button>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MASTER CANDIDATE PROFILE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
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
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Title *</label>
                  <input
                    type="text"
                    required
                    value={createForm.currentTitle}
                    onChange={(e) => setCreateForm({ ...createForm, currentTitle: e.target.value })}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onBlur={handleCheckDuplicate}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="candidate@example.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onBlur={handleCheckDuplicate}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+91-9876543210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Company</label>
                  <input
                    type="text"
                    value={createForm.currentCompany}
                    onChange={(e) => setCreateForm({ ...createForm, currentCompany: e.target.value })}
                    placeholder="e.g. Fintech Technologies"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Years) *</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    required
                    value={createForm.experienceYears}
                    onChange={(e) => setCreateForm({ ...createForm, experienceYears: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Technical Skills (comma separated) *</label>
                <input
                  type="text"
                  required
                  value={createForm.skills}
                  onChange={(e) => setCreateForm({ ...createForm, skills: e.target.value })}
                  placeholder="e.g. React.js, Node.js, TypeScript, AWS, Docker"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notice Period</label>
                  <select
                    value={createForm.noticePeriod}
                    onChange={(e) => setCreateForm({ ...createForm, noticePeriod: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-[#0265FF] font-bold"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSaving}
                  className="px-5 py-2 rounded-xl bg-[#0265FF] hover:bg-[#0055db] text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {createSaving ? 'Creating…' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Fullscreen Resume Viewer Modal */}
      <PdfResumeViewerModal
        open={resumePreview !== null}
        onClose={() => setResumePreview(null)}
        title={resumePreview?.title || 'Resume Document'}
        filename={resumePreview?.filename || 'Resume.pdf'}
        candidateId={resumePreview?.candidateId}
        leadId={resumePreview?.leadId}
        applicationId={resumePreview?.applicationId}
      />
    </div>
  );
}
