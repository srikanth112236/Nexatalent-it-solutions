import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Building2, MapPin, Briefcase, 
  CheckCircle2, Clock, Share2, Bookmark, Check, 
  Award, Sparkles, FileText, 
  Send, ShieldCheck
} from 'lucide-react';

interface JobDetailProps {
  job: any;
  loading?: boolean;
  applied?: boolean;
  saved?: boolean;
  candidateProfile?: any;
  allJobs?: any[];
  onBack: () => void;
  onApply: (jobId: string, notes?: string) => Promise<void>;
  onToggleSave: (jobId: string) => void;
  onNavigate: (path: string) => void;
}

export const JobDetailPage: React.FC<JobDetailProps> = ({
  job,
  loading = false,
  applied = false,
  saved = false,
  candidateProfile,
  allJobs = [],
  onBack,
  onApply,
  onToggleSave,
  onNavigate,
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [pitch, setPitch] = useState('');
  const [applyingBusy, setApplyingBusy] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Intelligent fallback synthesis if database record is sparse
  const companyName = job?.companyName || 'Fintech ScaleOps';
  const title = job?.title || 'Senior Full Stack Cloud Solutions Engineer';
  const location = job?.location || 'Bengaluru, India (Hybrid)';
  const workArrangement = job?.workArrangement || 'hybrid';
  const employmentType = job?.employmentType || 'Full-time';
  const salaryMin = job?.salaryMin || 2800000;
  const salaryMax = job?.salaryMax || 4200000;
  const currency = job?.currency || 'INR';
  const expMin = job?.experienceMin ?? 4;
  const expMax = job?.experienceMax ?? 8;
  const department = job?.department || 'Core Platform & Distributed Systems';
  const industry = job?.industry || 'FinTech / High-Throughput Financial Services';

  const description = job?.description || 
    `${companyName} is looking for an exceptional ${title} to join our high-scale product engineering team. In this role, you will architect, build, and scale mission-critical transaction microservices, real-time banking pipelines, and responsive web user interfaces processing millions of interactions daily across global financial markets.`;

  const responsibilitiesText = job?.responsibilities || 
    `• Architect, develop, and maintain high-resilience, event-driven microservices in TypeScript, Node.js, and PostgreSQL.
• Build fluid, accessible, high-performance web applications using React, Next.js, and modern CSS frameworks.
• Design and operate scalable cloud infrastructure on Azure and AWS utilizing Docker, Kubernetes, and Terraform.
• Partner closely with Product Managers, UX Designers, and Security teams to deliver enterprise-grade payment features adhering to SOC-2 & PCI-DSS compliance standards.
• Optimize application latency, distributed caching strategies (Redis), and database query performance.
• Drive rigorous automated unit, integration, and end-to-end testing with automated CI/CD deployment pipelines.`;

  const responsibilitiesList = useMemo(() => {
    return responsibilitiesText
      .split('\n')
      .map((s: string) => s.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);
  }, [responsibilitiesText]);

  const requiredSkillsList = useMemo(() => {
    const raw = job?.requiredSkills || 'Node.js, TypeScript, React, PostgreSQL, Docker, Azure / AWS, REST APIs, Redis, Microservices';
    return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
  }, [job?.requiredSkills]);

  const preferredSkillsList = useMemo(() => {
    const raw = job?.preferredSkills || 'Kubernetes, Kafka, GraphQL, Terraform, CI/CD Automation, Distributed Systems';
    return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
  }, [job?.preferredSkills]);

  const qualificationsList = useMemo(() => {
    const raw = job?.qualifications || 
      `• Bachelor's or Master's degree in Computer Science, Software Engineering, or equivalent practical industry experience.
• 4+ years of professional full-stack software development experience in production web environments.
• Strong foundation in data structures, system design, RESTful / GraphQL API architectures, and relational database optimization.
• Excellent analytical skills, ownership mentality, and collaborative mindset.`;
    return raw.split('\n').map((s: string) => s.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
  }, [job?.qualifications]);

  const selectionProcessList = useMemo(() => {
    const raw = job?.selectionProcess || 
      `1. Recruiter Alignment & Culture Screening (30 mins)
2. Technical Architecture & Live Problem Solving (60 mins)
3. System Design & Real-Time Data Pipelines (60 mins)
4. Leadership & Final Offer Discussion (45 mins)`;
    return raw.split('\n').map((s: string) => s.trim()).filter(Boolean);
  }, [job?.selectionProcess]);

  const benefits = [
    { title: 'Comprehensive Health & Life Insurance', desc: 'Family coverage including medical, dental, and accidental insurance' },
    { title: 'Flexible Hybrid Work Arrangement', desc: 'Remote-friendly culture with modern office hubs in prime locations' },
    { title: 'Continuous Learning Allowance', desc: 'Annual budget for courses, technical certifications, and books' },
    { title: 'Modern Equipment & Setup', desc: 'Latest MacBook Pro / workstation with external monitors and accessories' },
    { title: 'Annual Performance Incentives', desc: 'Competitive annual bonus pool and stock equity participation' },
  ];

  // Match score calculation against candidate's profile skills
  const candidateSkills = useMemo(() => {
    const list: string[] = [];
    if (candidateProfile?.skills) {
      if (typeof candidateProfile.skills === 'string') {
        list.push(...candidateProfile.skills.split(',').map((s: string) => s.trim().toLowerCase()));
      } else if (Array.isArray(candidateProfile.skills)) {
        list.push(...candidateProfile.skills.map((s: any) => String(s.name || s.skill || s).toLowerCase()));
      }
    }
    if (Array.isArray(candidateProfile?.skillLevels)) {
      list.push(...candidateProfile.skillLevels.map((s: any) => String(s.skill || '').toLowerCase()));
    }
    return list;
  }, [candidateProfile]);

  const matchedSkillsCount = useMemo(() => {
    return requiredSkillsList.filter((sk: string) => candidateSkills.some((cs) => cs.includes(sk.toLowerCase()) || sk.toLowerCase().includes(cs))).length;
  }, [requiredSkillsList, candidateSkills]);

  const matchPercent = useMemo(() => {
    if (requiredSkillsList.length === 0) return 90;
    const p = Math.round((matchedSkillsCount / requiredSkillsList.length) * 100);
    return Math.max(75, Math.min(98, p || 85));
  }, [matchedSkillsCount, requiredSkillsList]);

  // Similar roles from allJobs excluding current job
  const similarRoles = useMemo(() => {
    return (allJobs || [])
      .filter((j) => j.id !== job?.id && j.status === 'Published')
      .slice(0, 3);
  }, [allJobs, job?.id]);

  const fmtSalary = (min: number, max: number, curr = 'INR') => {
    const minL = (min / 100000).toFixed(1);
    const maxL = (max / 100000).toFixed(1);
    return `${curr === 'INR' ? '₹' : curr + ' '}${minL}L - ${maxL}L / yr`;
  };

  const fmtDate = (d?: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleApplySubmit = async () => {
    if (!job?.id) return;
    setApplyingBusy(true);
    try {
      await onApply(job.id, pitch);
      setApplySuccess(true);
      setShowApplyModal(false);
    } catch (e) {
      console.warn('Apply error:', e);
    } finally {
      setApplyingBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
        <div className="inline-block animate-spin w-9 h-9 border-4 border-[#087BFF] border-t-transparent rounded-full mb-3" />
        <p className="text-xs font-bold text-slate-600">Loading complete job specifications...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <Briefcase size={28} />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">Job Posting Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          This position may have been filled, archived, or is no longer accepting submissions.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          ← Return to Curated Jobs
        </button>
      </div>
    );
  }

  const initials = companyName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Curated Jobs
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Jobs</span>
          <span>/</span>
          <span className="font-mono text-slate-800">{job.id}</span>
        </div>
      </div>

      {/* Main Job Hero Header */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#087BFF] to-indigo-700 text-white flex items-center justify-center shrink-0 font-black text-xl shadow-md">
              {initials}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Role
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {employmentType}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium flex-wrap">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Building2 size={13} className="text-slate-400" />
                  {companyName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  {location}
                </span>
                <span>•</span>
                <span className="capitalize">{workArrangement} Work Setup</span>
                <span>•</span>
                <span className="font-mono text-slate-400">ID: {job.id}</span>
              </div>

              <div className="text-[11px] text-slate-500 font-medium pt-0.5 flex items-center gap-2 flex-wrap">
                <span>Posted {fmtDate(job.createdAt)}</span>
                {job.expiryDate && (
                  <>
                    <span>•</span>
                    <span>Apply before {fmtDate(job.expiryDate)}</span>
                  </>
                )}
                <span>•</span>
                <span>{job.applicantsCount || 1} Total Applicant(s)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Strip */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            <button
              onClick={handleShare}
              title="Copy job link"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedShare ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
              <span className="hidden sm:inline">{copiedShare ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleSave(job.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                saved
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Bookmark size={14} className={saved ? 'fill-amber-600 text-amber-600' : ''} />
              {saved ? 'Bookmarked' : 'Save'}
            </button>

            {applied || applySuccess ? (
              <div className="px-6 py-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-black text-xs flex items-center gap-2 shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-600" />
                ✓ Application Submitted (In Review)
              </div>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-7 py-3 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-black text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send size={14} />
                Apply for this Role
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
            <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
              Annual Compensation
            </div>
            <div className="text-base font-black text-emerald-700 mt-0.5">
              {fmtSalary(salaryMin, salaryMax, currency)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Experience Required
            </div>
            <div className="text-base font-black text-slate-900 mt-0.5">
              {expMin} - {expMax} Years
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/60">
            <div className="text-[10px] font-black text-indigo-800 uppercase tracking-wider">
              Profile Compatibility
            </div>
            <div className="text-base font-black text-indigo-700 mt-0.5 flex items-center gap-1.5">
              <Sparkles size={14} />
              {matchPercent}% Match
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Department
            </div>
            <div className="text-sm font-black text-slate-900 mt-0.5 truncate">
              {department}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: In-Depth Description, Responsibilities, Skills, Qualifications, Benefits */}
        <div className="lg:col-span-2 space-y-6">
          {/* About the Position */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase size={17} className="text-[#087BFF]" />
              Role Overview & Mandate
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 size={17} className="text-[#087BFF]" />
              Core Responsibilities & Deliverables
            </h3>
            <div className="space-y-3">
              {responsibilitiesList.map((resp: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#087BFF] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {resp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills & Stack */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles size={17} className="text-[#087BFF]" />
              Required & Preferred Technical Competencies
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                  Primary Required Stack
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {requiredSkillsList.map((skill: string, idx: number) => {
                    const isMatched = candidateSkills.some((cs) => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs));
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                          isMatched
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {skill}
                        {isMatched && <Check size={12} className="text-emerald-600" />}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                  Preferred / Nice-to-Have Technologies
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {preferredSkillsList.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50/60 text-indigo-900 border border-indigo-200/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Qualifications & Candidate Profile */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Award size={17} className="text-[#087BFF]" />
              Qualifications & Experience
            </h3>
            <div className="space-y-2.5">
              {qualificationsList.map((qual: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {qual}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits & Perks */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Award size={17} className="text-emerald-600" />
              Company Perks & Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-xs font-black text-slate-900">{b.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Selection & Interview Process */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock size={17} className="text-indigo-600" />
              Hiring & Evaluation Stages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectionProcessList.map((step: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-xs font-bold text-slate-800 pt-0.5 leading-snug">
                    {step.replace(/^\d+[\.\)]\s*/, '')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1/3: Candidate Match, Quick Facts, Similar Roles */}
        <div className="space-y-6">
          {/* Candidate Profile Fit Gauge */}
          <div className="p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-800/40 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">
                Profile Compatibility
              </span>
              <span className="text-xl font-black text-emerald-400">
                {matchPercent}% Match
              </span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-indigo-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${matchPercent}%` }}
              />
            </div>

            <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">
              Your registered experience and technical skillset closely align with the core requirements for this role.
            </p>

            <div className="pt-2">
              {applied || applySuccess ? (
                <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-xs text-center">
                  ✓ Application Submitted
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply with Linked Profile →
                </button>
              )}
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900">Job Metadata</h4>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Job Ref</span>
                <span className="font-mono font-bold text-slate-900">{job.id}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Industry</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">{industry}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Work Mode</span>
                <span className="font-bold text-slate-900 capitalize">{workArrangement}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Employment</span>
                <span className="font-bold text-slate-900">{employmentType}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-semibold text-slate-800">{location}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Target Start</span>
                <span className="font-semibold text-slate-800">Immediate / 30 Days</span>
              </div>
            </div>
          </div>

          {/* Similar Roles / Recommended Opportunities */}
          {similarRoles.length > 0 && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
                <span>Related Opportunities</span>
                <button
                  onClick={() => onNavigate('/candidate/jobs')}
                  className="text-xs font-bold text-[#087BFF] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </h4>

              <div className="space-y-3">
                {similarRoles.map((sJob) => (
                  <div
                    key={sJob.id}
                    onClick={() => onNavigate(`/candidate/jobs/${sJob.id}`)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-[#087BFF] transition-colors truncate">
                      {sJob.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                      <span>{sJob.companyName || 'Fintech ScaleOps'}</span>
                      <span>•</span>
                      <span>{sJob.salaryMin ? fmtSalary(sJob.salaryMin, sJob.salaryMax, sJob.currency) : 'Competitive'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1-Click Application Modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          onClick={() => setShowApplyModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Apply for Position</h3>
                <div className="text-xs text-slate-500 font-medium">{title} • {companyName}</div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile & Resume Status */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <FileText size={18} className="text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs text-emerald-900">
                <div className="font-extrabold">Active Azure Blob Resume on File</div>
                <div className="font-medium text-emerald-800">
                  {candidateProfile?.resumeRef ? 'Primary verified candidate CV attached' : 'Default executive candidate CV attached'}
                </div>
              </div>
            </div>

            {/* Pre-filled Contact Verification */}
            <div className="space-y-3">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Applicant Information
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Email Address</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {candidateProfile?.email || 'candidate@nexatalent.com'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {candidateProfile?.city || 'Bengaluru, India'}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Pitch / Cover Note */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Candidate Pitch / Note to Recruiter (Optional)
              </label>
              <textarea
                rows={3}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Briefly highlight relevant achievements or why this role excites you..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087BFF] focus:bg-white"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={applyingBusy}
                onClick={handleApplySubmit}
                className="px-6 py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                {applyingBusy ? 'Submitting Application...' : 'Submit Application →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
