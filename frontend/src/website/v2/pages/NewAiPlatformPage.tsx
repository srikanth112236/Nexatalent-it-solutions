import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Briefcase,
  FileText,
  Search,
  ArrowRight,
  ChevronRight,
  Check,
  RotateCcw,
  Scale,
  Server,
  Zap,
  Workflow,
  FileCheck,
  Fingerprint,
  Mic,
  MessageSquare,
  AlertCircle,
  Copy,
  Calendar,
  UserCheck,
  Clock,
  TrendingUp,
  Percent,
  Network,
  Play,
  Lock,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';

// ==========================================
// MOCK DATA & SIMULATOR PRESETS
// ==========================================

const SAMPLE_ROLES = [
  {
    id: 'lead-fullstack',
    title: 'Lead Full-Stack Architect',
    dept: 'Engineering',
    exp: '7-10 Years',
    salary: '₹32 - 45 LPA',
    location: 'Bengaluru / Hybrid',
    skills: ['React', 'Node.js', 'Go', 'Kubernetes', 'PostgreSQL', 'System Design'],
    jdSnippet:
      'We are looking for a Lead Full-Stack Architect to drive microservices modernization, low-latency API architecture, and cloud infrastructure scalability. You will collaborate with product directors and mentor a 12-engineer squad.',
  },
  {
    id: 'staff-ai-engineer',
    title: 'Staff GenAI & LLM Engineer',
    dept: 'AI & Data Platforms',
    exp: '5-8 Years',
    salary: '₹38 - 55 LPA',
    location: 'Hyderabad / Remote',
    skills: ['Python', 'PyTorch', 'LangChain', 'pgvector', 'RAG Pipelines', 'FastAPI'],
    jdSnippet:
      'Architect and deploy high-throughput enterprise GenAI applications, vector retrieval pipelines, and specialized domain agent swarms. Strong focus on deterministic evaluation and DPDP-compliant guardrails.',
  },
  {
    id: 'devops-lead',
    title: 'Principal Cloud & Platform SRE',
    dept: 'Infrastructure',
    exp: '8-12 Years',
    salary: '₹35 - 50 LPA',
    location: 'Pune / Mumbai',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Prometheus', 'Chaos Engineering', 'FinOps'],
    jdSnippet:
      'Own end-to-end multi-region reliability, infrastructure-as-code automation, zero-trust security postures, and cost-optimization for high-frequency transaction workloads.',
  },
];

const SAMPLE_CANDIDATE = {
  name: 'Vikramaditya S. Joshi',
  currentRole: 'Senior Staff Software Engineer',
  currentCompany: 'Tier-1 FinTech Unicorn',
  experience: '8.4 Years',
  location: 'Bengaluru (Willing to relocate)',
  noticePeriod: '15 Days (Serving Notice)',
  expectedCtc: '₹40 LPA',
  currentCtc: '₹32 LPA',
  parsedSkills: [
    { name: 'React / Next.js', confidence: 98, level: 'Expert' },
    { name: 'Node.js & Go Microservices', confidence: 95, level: 'Expert' },
    { name: 'Kubernetes & Docker', confidence: 92, level: 'Advanced' },
    { name: 'PostgreSQL & Redis Caching', confidence: 94, level: 'Advanced' },
    { name: 'Distributed System Design', confidence: 96, level: 'Expert' },
    { name: 'Kafka Event Streaming', confidence: 88, level: 'Proficient' },
  ],
  matchScores: {
    skillsMatch: 96,
    experienceCalibrated: 93,
    noticeAvailability: 99,
    compensationFit: 91,
    overallScore: 94,
  },
  gaps: [
    { text: 'FastAPI / Python is secondary (primarily Go & Node)', severity: 'Low', mitigatedBy: 'Deep polyglot backend fundamentals' },
  ],
  duplicateStatus: {
    isUnique: true,
    hashMatch: 'None',
    submissionConflict: 'Verified original submission (NexaTalent Direct Sourcing)',
  },
};

export function NewAiPlatformPage() {
  // Mode switcher: Dual business model
  const [businessModel, setBusinessModel] = useState<'consultancy' | 'saas'>('consultancy');

  // Interactive AI Engine Sandbox tabs
  const [engineTab, setEngineTab] = useState<'jd' | 'parser' | 'matcher' | 'interview' | 'dedup'>('matcher');
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  // Portal Switcher Tab
  const [portalTab, setPortalTab] = useState<'employer' | 'candidate' | 'vendor' | 'ats' | 'superadmin'>('employer');

  // SaaS ROI Calculator state
  const [recruiterCount, setRecruiterCount] = useState(8);
  const [hiresPerMonth, setHiresPerMonth] = useState(15);
  const [aiUsageTier, setAiUsageTier] = useState<'standard' | 'scale' | 'enterprise'>('scale');

  // Interactive Level 2 & Level 3 Human Supervision simulator
  const [governanceStage, setGovernanceStage] = useState<'ai_proposal' | 'recruiter_audit' | 'employer_decision' | 'final_offer'>('recruiter_audit');

  // Interactive AI Interview Simulator
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0);

  const selectedRole = SAMPLE_ROLES[selectedRoleIndex];

  // Pricing calculation
  const saasMonthlyCost =
    aiUsageTier === 'standard'
      ? recruiterCount * 2499 + hiresPerMonth * 400
      : aiUsageTier === 'scale'
      ? recruiterCount * 3999 + hiresPerMonth * 650
      : recruiterCount * 6499 + hiresPerMonth * 900;

  const estimatedAgencyCostSavings = Math.round(hiresPerMonth * 12 * 75000 * 0.58);

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased selection:bg-black selection:text-white">
      <SeoHead
        title="NexaTalent AI Nexus™ | Complete AI Recruitment Ecosystem & SaaS Platform"
        description="NexaTalent IT Solutions combines an AI-driven recruitment consultancy with a modern multi-tenant AI recruitment SaaS platform. Human-supervised Level 2 and Level 3 automation for enterprise hiring."
      />

      <V2Navbar />

      {/* TOP ANNOUNCEMENT TICKER (100% Pure White Background, Black Text) */}
      <div className="border-b border-neutral-200 bg-white py-2.5 px-4 text-xs font-medium text-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-black text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              Unified Platform
            </span>
            <span className="text-black">
              The Dual-Engine Hiring Model: <strong>AI Consultancy Services</strong> + <strong>Multi-Tenant B2B SaaS</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-black text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-black" /> Level 2+3 Human Supervised
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Lock size={13} className="text-black" /> Indian DPDP Act 2023 Compliant
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          HERO SECTION: 100% WHITE BACKGROUND, BLACK TYPOGRAPHY
         ======================================================== */}
      <section className="relative overflow-hidden bg-white text-black pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-neutral-200">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 shadow-xs mb-6">
              <Sparkles size={14} className="text-black" />
              <span className="text-xs font-bold uppercase tracking-widest text-black">
                Next-Generation Recruitment Technology
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-black">
              The Complete <span className="underline decoration-2 underline-offset-8">AI-Powered</span> Recruitment Ecosystem
            </h1>

            <p className="mt-5 text-base sm:text-xl text-neutral-600 font-normal leading-relaxed max-w-2xl mx-auto">
              NexaTalent IT Solutions unites an elite <strong>AI-driven recruitment consultancy</strong> with our own independent <strong>multi-tenant AI recruitment SaaS platform</strong>.
            </p>

            {/* Human-in-the-Loop Core Philosophy Callout */}
            <div className="mt-6 inline-flex items-center gap-3.5 bg-white border border-neutral-200 rounded-2xl p-4 text-left max-w-xl mx-auto shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                <Scale size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black tracking-wide uppercase">
                  Strictly Human-Supervised (Level 2 & 3 Automation)
                </h4>
                <p className="text-[12px] text-neutral-600 mt-0.5 leading-snug">
                  AI accelerates sourcing, screening, and evaluations, while human recruiters and hiring managers make 100% of final hiring decisions. Zero biometric or emotional inference.
                </p>
              </div>
            </div>

            {/* DUAL MODEL TOGGLE */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                <button
                  onClick={() => setBusinessModel('consultancy')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    businessModel === 'consultancy'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Briefcase size={16} />
                  <span>Model A: AI Recruitment Consultancy</span>
                </button>
                <button
                  onClick={() => setBusinessModel('saas')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    businessModel === 'saas'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Server size={16} />
                  <span>Model B: AI Recruitment SaaS Platform</span>
                </button>
              </div>
            </div>

            {/* DUAL MODEL DETAILS BANNER */}
            <div className="mt-4 max-w-2xl mx-auto">
              {businessModel === 'consultancy' ? (
                <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-xs sm:text-sm text-black flex items-center justify-between gap-4 shadow-xs">
                  <div className="text-left">
                    <span className="font-bold text-black block">Full-Cycle Managed Talent Delivery</span>
                    <span className="text-neutral-600">NexaTalent deploys internal AI engines to source, vet, and deliver pre-calibrated candidates with replacement warranties.</span>
                  </div>
                  <Link
                    to="/employers"
                    className="shrink-0 bg-black text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-neutral-800 transition-colors"
                  >
                    Engage Consultancy
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-xs sm:text-sm text-black flex items-center justify-between gap-4 shadow-xs">
                  <div className="text-left">
                    <span className="font-bold text-black block">Multi-Tenant Cloud Software Subscription</span>
                    <span className="text-neutral-600">Your company independently subscribes, logs in, manages candidate pipelines, and triggers AI workflows in dedicated tenant databases.</span>
                  </div>
                  <a
                    href="#saas-calculator"
                    className="shrink-0 bg-black text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-neutral-800 transition-colors"
                  >
                    View SaaS Pricing
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#interactive-sandbox"
                className="inline-flex items-center gap-2 rounded-full bg-black hover:bg-neutral-800 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all"
              >
                <Zap size={16} />
                <span>Test Live AI Engine Sandbox</span>
              </a>
              <a
                href="#portals-ecosystem"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white hover:border-black px-6 py-3.5 text-sm font-bold text-black transition-all"
              >
                <span>Explore 5 Portal Interfaces</span>
                <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* KEY PERFORMANCE METRICS BAR */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Shortlist Turnaround', value: '72 Hours', desc: 'AI-assisted calibration vs. 14 days traditional', icon: Clock },
              { label: 'Match Precision', value: '94.8%', desc: 'Explainable multidimensional scoring vectors', icon: Percent },
              { label: 'Recruiter Workload Saved', value: '65%', desc: 'Routine screening & follow-ups automated', icon: TrendingUp },
              { label: 'Decision Governance', value: '100% Human', desc: 'Level 2/3 supervised; zero AI auto-rejections', icon: ShieldCheck },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white p-5 text-left flex flex-col justify-between shadow-xs hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center">
                    <stat.icon size={16} className="text-black" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-black">{stat.value}</div>
                  <div className="text-[11px] text-neutral-600 mt-1 leading-snug">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: HUMAN-IN-THE-LOOP (LEVEL 2 + LEVEL 3 GOVERNANCE)
         ======================================================== */}
      <section className="py-16 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
              Responsible AI Architecture
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
              Human-Supervised Intelligence: Level 2 & Level 3 Together
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              We never remove human oversight from hiring. Our systems strictly operate at <strong>Level 2 (AI Assistance)</strong> and <strong>Level 3 (Conditional Automation with Mandatory Human Approval)</strong>. Consequential hiring decisions always belong to your recruiters and hiring managers.
            </p>
          </div>

          {/* Interactive Governance Flow Demonstration */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-black">Interactive 4-Stage Human Approval Workflow</h3>
                <p className="text-xs text-neutral-500">Click any step to inspect the audit log and recruiter checkpoints.</p>
              </div>
              <div className="inline-flex rounded-xl border border-neutral-200 bg-white p-1 text-xs font-semibold">
                <span className="px-3 py-1 text-black">Live Workflow Simulation</span>
              </div>
            </div>

            {/* Stepper Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
              {[
                { id: 'ai_proposal', label: '1. AI Proposal Engine', level: 'Level 2 (Assistance)', desc: 'Parses, screens, scores & drafts recommendations' },
                { id: 'recruiter_audit', label: '2. Recruiter Verification', level: 'Human Checkpoint', desc: 'Validates resume facts, notice, & verifies gaps' },
                { id: 'employer_decision', label: '3. Hiring Manager Review', level: 'Level 3 Approval', desc: 'Authorizes interview or shortlist with 1 click' },
                { id: 'final_offer', label: '4. Offer & Selection', level: '100% Human Decided', desc: 'Commercial negotiation & final hire authorization' },
              ].map((step) => {
                const isActive = governanceStage === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setGovernanceStage(step.id as any)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'border-black bg-white shadow-xs ring-1 ring-black'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-black">{step.level}</span>
                      {isActive && <CheckCircle2 size={14} className="text-black" />}
                    </div>
                    <div className="text-xs font-bold text-black">{step.label}</div>
                    <div className="text-[11px] text-neutral-500 mt-1">{step.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detail Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              {governanceStage === 'ai_proposal' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-black">
                    <Bot size={18} className="text-black" />
                    <span>Stage 1: AI Autonomous Proposal & Screening (Under Recruiter Parameters)</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    The engine indexes candidate profiles, extracts skills, analyzes GitHub/tech stack relevance, and executes vector similarity scoring. It flags potential discrepancies (e.g. overlapping employment dates or missing notice periods) and produces a non-binding shortlist recommendation.
                  </p>
                  <div className="rounded-xl bg-white border border-neutral-200 p-4 text-xs font-mono text-black">
                    <div className="text-black font-bold mb-1">AUDIT_LOG_ID: #LOG-AI-MATCH-9021</div>
                    <div>&gt; Candidate: Vikramaditya S. Joshi | Match Score: 94.2%</div>
                    <div>&gt; Action: Recommendation prepared with explainable rationale</div>
                    <div>&gt; Human Signoff Required: Recruiter must approve before forwarding to client</div>
                  </div>
                </div>
              )}

              {governanceStage === 'recruiter_audit' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-black">
                    <UserCheck size={18} className="text-black" />
                    <span>Stage 2: Recruiter Fact-Checking & Calibration</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    A dedicated human recruiter verifies candidate identity, confirms actual notice period and buy-out feasibility, checks compensation expectations against the client budget, and tests communication clarity.
                  </p>
                  <div className="rounded-xl bg-white border border-neutral-200 p-4 text-xs text-black">
                    <div className="font-bold text-black flex items-center gap-2">
                      <ShieldCheck size={16} /> Recruiter Human Verification Passed
                    </div>
                    <p className="mt-1 text-neutral-600">
                      &quot;Candidate verified on telephonic briefing. Genuine 15-day notice period confirmed with resignation letter preview. CTC expectation aligned with client bracket.&quot;
                    </p>
                  </div>
                </div>
              )}

              {governanceStage === 'employer_decision' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-black">
                    <Building2 size={18} className="text-black" />
                    <span>Stage 3: Hiring Manager Discretion & Feedback</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    The employer reviews the explainable scorecard, reads the structured technical interview summary, and exercises full discretion to accept, defer, or reject. AI never auto-rejects candidates without explicit recruiter/employer review.
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-neutral-800">
                      <Calendar size={14} /> Schedule Technical Round 1
                    </button>
                    <button className="bg-white border border-neutral-300 text-black text-xs font-bold px-4 py-2 rounded-xl hover:border-black">
                      Request Recruiter Recalibration
                    </button>
                  </div>
                </div>
              )}

              {governanceStage === 'final_offer' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-black">
                    <FileCheck size={18} className="text-black" />
                    <span>Stage 4: Final Selection, Background Check & Offer Rollout</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Offer rollouts, salary negotiations, and contract generation remain 100% human-governed. NexaTalent provides audit-ready background checks (employment, court records, education) before Day-1 joining.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-black">
                    <span className="font-bold text-black">Replacement Guarantee:</span> In consultancy mandates, all placements include NexaTalent&apos;s 90-day replacement warranty.
                  </div>
                </div>
              )}
            </div>

            {/* STRICT ETHICAL AI COMMITMENT */}
            <div className="mt-6 p-4 rounded-2xl bg-white border border-neutral-200 flex items-start gap-3">
              <AlertCircle size={18} className="text-black shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-700 leading-relaxed">
                <strong className="font-bold text-black">Zero Emotion & Biometric Inference Policy:</strong> NexaTalent AI strictly assesses technical competencies, experience, verifiable problem solving, and work history. Our system is architecturally prohibited from inferring personality, honesty, or suitability from facial expressions, accents, eye movement, or voice tone.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: LIVE INTERACTIVE AI ENGINE SANDBOX (PURE WHITE)
         ======================================================== */}
      <section id="interactive-sandbox" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
                Interactive Technology Demo
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
                The AI Recruitment Engine in Action
              </h2>
              <p className="mt-2 text-sm text-neutral-600 max-w-xl">
                Test the core modules powering both our recruitment services and SaaS software. Select any module below to inspect live simulated outputs.
              </p>
            </div>

            {/* Role Preset Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-600">Test Requisition:</span>
              <select
                value={selectedRoleIndex}
                onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
                className="bg-white border border-neutral-300 text-xs font-bold text-black rounded-xl px-3 py-2 outline-none focus:border-black"
              >
                {SAMPLE_ROLES.map((role, idx) => (
                  <option key={role.id} value={idx}>
                    {role.title} ({role.dept})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ENGINE TABS */}
          <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto pb-1 mb-8 text-xs font-bold">
            {[
              { id: 'matcher', label: '1. Explainable Match Radar', icon: BrainCircuit },
              { id: 'jd', label: '2. AI JD Generator', icon: FileText },
              { id: 'parser', label: '3. Resume Parser & Gap Engine', icon: Search },
              { id: 'interview', label: '4. AI Interview Architect', icon: MessageSquare },
              { id: 'dedup', label: '5. Cross-Vendor Dedup & Fraud Check', icon: Fingerprint },
            ].map((tab) => {
              const active = engineTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setEngineTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl border-b-2 transition-all whitespace-nowrap ${
                    active
                      ? 'border-black text-black bg-white font-black'
                      : 'border-transparent text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: EXPLAINABLE MATCH RADAR */}
          {engineTab === 'matcher' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Candidate Summary & Overall Match */}
              <div className="lg:col-span-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div>
                    <div className="text-xs font-bold uppercase text-neutral-500">Top Ranked Candidate</div>
                    <h3 className="text-lg font-extrabold text-black">{SAMPLE_CANDIDATE.name}</h3>
                    <div className="text-xs text-neutral-600">{SAMPLE_CANDIDATE.currentRole}</div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl border border-neutral-200 bg-white text-black flex flex-col items-center justify-center shadow-xs">
                    <span className="text-xl font-black text-black">{SAMPLE_CANDIDATE.matchScores.overallScore}%</span>
                    <span className="text-[9px] uppercase font-bold text-neutral-500">Match</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Notice Availability:</span>
                    <span className="font-bold text-black">{SAMPLE_CANDIDATE.noticePeriod}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Experience Calibration:</span>
                    <span className="font-bold text-black">{SAMPLE_CANDIDATE.experience} (Req: {selectedRole.exp})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Compensation Fit:</span>
                    <span className="font-bold text-black">{SAMPLE_CANDIDATE.expectedCtc} (Budget: {selectedRole.salary})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Location Status:</span>
                    <span className="font-bold text-black">{SAMPLE_CANDIDATE.location}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200 flex gap-2">
                  <button className="flex-1 bg-black text-white font-bold py-2.5 rounded-xl text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5">
                    <UserCheck size={14} /> Shortlist for Client
                  </button>
                  <button className="bg-white border border-neutral-300 font-bold px-3 py-2.5 rounded-xl text-xs text-black hover:border-black transition-colors">
                    View Full Dossier
                  </button>
                </div>
              </div>

              {/* Right Column: Explainable Scoring Dimension Breakdown */}
              <div className="lg:col-span-7 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-black">Explainable Scoring Breakdown (Auditable Logic)</h4>
                  <span className="text-[10px] bg-white border border-neutral-200 text-neutral-600 px-2 py-1 rounded font-mono">
                    Model: NexaMatch-v3.2
                  </span>
                </div>

                {/* Score Bars */}
                <div className="space-y-4">
                  {[
                    { label: 'Technical Core Stack Match', score: SAMPLE_CANDIDATE.matchScores.skillsMatch, weight: '40% weight', explanation: 'Direct production experience with React, Go, and Kubernetes matches required 100% core stack.' },
                    { label: 'Notice & Immediate Availability', score: SAMPLE_CANDIDATE.matchScores.noticeAvailability, weight: '25% weight', explanation: 'Candidate is already serving notice (15 days remaining); eliminates 90-day buy-out lag.' },
                    { label: 'Seniority & Architectural Depth', score: SAMPLE_CANDIDATE.matchScores.experienceCalibrated, weight: '20% weight', explanation: '8.4 years verified tenure in tier-1 high-throughput FinTech engineering.' },
                    { label: 'Budget & Compensation Calibrated', score: SAMPLE_CANDIDATE.matchScores.compensationFit, weight: '15% weight', explanation: 'Candidate expectation of ₹40 LPA sits comfortably within the approved ₹32-45 LPA budget.' },
                  ].map((dim, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white border border-neutral-200">
                      <div className="flex justify-between text-xs font-bold text-black mb-1">
                        <span>{dim.label} <span className="text-neutral-400 font-normal">({dim.weight})</span></span>
                        <span className="text-black font-black">{dim.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-black rounded-full transition-all duration-700"
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-snug">{dim.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI JD GENERATOR */}
          {engineTab === 'jd' && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-4 mb-6 gap-3">
                <div>
                  <h4 className="text-base font-bold text-black">AI-Generated Enterprise Job Description</h4>
                  <p className="text-xs text-neutral-500">Generated in 1.4 seconds with real-time Indian tech compensation benchmarking</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-white text-black text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
                    <Check size={13} /> DPDP & Non-Discriminatory Checked
                  </span>
                  <button className="bg-white border border-neutral-300 hover:border-black text-black text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    <Copy size={13} /> Copy JD
                  </button>
                </div>
              </div>

              <div className="space-y-6 text-sm text-black">
                <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 block">Position</span>
                      <strong className="text-black">{selectedRole.title}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Recommended Experience</span>
                      <strong className="text-black">{selectedRole.exp}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Market Benchmarked CTC</span>
                      <strong className="text-black font-bold">{selectedRole.salary}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Target Location</span>
                      <strong className="text-black">{selectedRole.location}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-black text-xs uppercase tracking-wider mb-2">Role Overview</h5>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-white p-4 rounded-xl border border-neutral-200">
                    {selectedRole.jdSnippet}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-black text-xs uppercase tracking-wider mb-2">Core Technical Competencies (Must-Have vs. Good-to-Have)</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                      <div className="text-xs font-bold text-black mb-2">Primary Hard Skills (Mandatory 85%+ Match)</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.skills.slice(0, 4).map((sk) => (
                          <span key={sk} className="bg-white border border-neutral-300 text-black text-xs px-2.5 py-1 rounded-lg font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                      <div className="text-xs font-bold text-black mb-2">Secondary / Scalability Factors</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.skills.slice(4).concat(['Domain Mentorship', 'CI/CD Pipelines']).map((sk) => (
                          <span key={sk} className="bg-white border border-neutral-200 text-neutral-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESUME PARSER & GAP ENGINE */}
          {engineTab === 'parser' && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
                <div>
                  <h4 className="text-base font-bold text-black">Automated Resume Parsing & Skill Extraction</h4>
                  <p className="text-xs text-neutral-500">Supports PDF, DOCX, Scanned OCR resumes with multi-layer semantic structuring</p>
                </div>
                <span className="text-xs font-bold text-black bg-white border border-neutral-200 px-3 py-1 rounded-full">
                  Extracted in 820ms
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Extracted Structured JSON */}
                <div className="rounded-2xl border border-neutral-200 bg-white text-black p-4 font-mono text-[11px] overflow-x-auto">
                  <div className="text-neutral-500 mb-2">// Structured Entity Graph Output</div>
                  <pre className="text-black font-semibold">
{`{
  "candidate_id": "NX-IND-2026-902",
  "full_name": "${SAMPLE_CANDIDATE.name}",
  "total_exp_years": 8.4,
  "verified_employment": [
    { "role": "Senior Staff Eng", "company": "Tier-1 Unicorn", "duration_months": 38 },
    { "role": "Senior Dev", "company": "Global Product Org", "duration_months": 42 }
  ],
  "notice_period_days": 15,
  "resignation_proof_status": "VERIFIED_DOC_ATTACHED",
  "dpdp_consent_granted": true,
  "dpdp_consent_timestamp": "2026-11-04T12:00:00Z"
}`}
                  </pre>
                </div>

                {/* Skills & Gap Analysis */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-black uppercase tracking-wider">Identified Skills vs. Requisition</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_CANDIDATE.parsedSkills.map((sk) => (
                      <div key={sk.name} className="p-2.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between text-xs">
                        <span className="font-semibold text-black">{sk.name}</span>
                        <span className="text-[10px] bg-white border border-neutral-200 text-black font-bold px-2 py-0.5 rounded">
                          {sk.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-white mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-black mb-1">
                      <AlertCircle size={14} className="text-black" />
                      <span>Skill & Experience Gap Analysis</span>
                    </div>
                    {SAMPLE_CANDIDATE.gaps.map((gap, i) => (
                      <div key={i} className="text-xs text-neutral-700">
                        • <strong className="text-black">{gap.text}</strong> — <span className="italic">{gap.mitigatedBy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI INTERVIEW ARCHITECT */}
          {engineTab === 'interview' && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
                <div>
                  <h4 className="text-base font-bold text-black">Role-Specific AI Technical Question Architect</h4>
                  <p className="text-xs text-neutral-500">Generates tailored scenario and architecture questions based on candidate resume + JD stack</p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-black">
                  <Mic size={14} /> Voice & Text Ready
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: '01',
                    category: 'System Architecture & High Concurrency',
                    question:
                      'Given your experience scaling microservices in Go and Node, how would you architect an idempotent payment processing gateway processing 10,000 TPS with zero duplicate charges during partial network partitions?',
                    criteria: 'Candidate should mention distributed locks (Redis Redlock), database unique constraints, outbox pattern, and Kafka partition ordering.',
                  },
                  {
                    num: '02',
                    category: 'Distributed State & Data Consistency',
                    question:
                      'In your previous role at Tier-1 Unicorn, how did you balance eventual consistency across microservices versus read-your-own-writes guarantees for users viewing real-time transaction ledgers?',
                    criteria: 'Expect answers addressing CQRS, read-replica lag mitigations, and event-driven saga orchestration.',
                  },
                  {
                    num: '03',
                    category: 'Cloud Reliability & Chaos Testing',
                    question:
                      'Describe a scenario where a production Kubernetes cluster encountered pod evictions under memory pressure. What were the exact metrics you monitored and how did you calibrate cgroup memory limits?',
                    criteria: 'Verifies real hands-on SRE experience rather than purely theoretical container usage.',
                  },
                ].map((item) => (
                  <div key={item.num} className="p-4 rounded-2xl border border-neutral-200 bg-white">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-black">{item.category}</span>
                      <span className="text-neutral-400 font-mono">Q-{item.num}</span>
                    </div>
                    <div className="text-sm font-bold text-black mb-2 leading-relaxed">&ldquo;{item.question}&rdquo;</div>
                    <div className="text-xs text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200">
                      <strong className="text-black">Scoring Benchmark:</strong> {item.criteria}
                    </div>
                  </div>
                ))}
              </div>

              {/* LIVE SIMULATED CANDIDATE SCREENING WALKTHROUGH */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h5 className="text-sm font-bold text-black">Interactive Candidate Screening Simulation</h5>
                    <p className="text-xs text-neutral-500">Candidate consent-first workflow, real-time transcription, and objective rubric scoring.</p>
                  </div>
                  {!interviewStarted ? (
                    <button
                      onClick={() => {
                        setInterviewStarted(true);
                        setInterviewStep(1);
                      }}
                      className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      <Play size={14} /> Start Screening Simulation
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setInterviewStarted(false);
                        setInterviewStep(0);
                      }}
                      className="inline-flex items-center gap-2 bg-white border border-neutral-300 text-black text-xs font-bold px-3 py-1.5 rounded-xl hover:border-black transition-colors"
                    >
                      <RotateCcw size={13} /> Reset Simulation
                    </button>
                  )}
                </div>

                {interviewStarted && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-black">
                        Simulation Step {interviewStep} of 3:
                        {interviewStep === 1 && ' Candidate Informed Consent'}
                        {interviewStep === 2 && ' AI Question & Audio Transcription'}
                        {interviewStep === 3 && ' Structured Evaluation Scorecard'}
                      </span>
                      <div className="flex gap-2">
                        {interviewStep < 3 ? (
                          <button
                            onClick={() => setInterviewStep((s) => s + 1)}
                            className="bg-black text-white text-xs px-3 py-1 rounded-lg hover:bg-neutral-800"
                          >
                            Next Step →
                          </button>
                        ) : (
                          <span className="text-black bg-white border border-neutral-200 px-2 py-0.5 rounded font-bold">Screening Completed</span>
                        )}
                      </div>
                    </div>

                    {interviewStep === 1 && (
                      <div className="p-4 bg-white rounded-xl border border-neutral-200 text-xs">
                        <div className="font-bold text-black flex items-center gap-1.5 mb-1">
                          <CheckCircle2 size={15} /> Candidate Consent Granted (DPDP Compliant)
                        </div>
                        <p className="text-neutral-600">
                          &quot;Candidate consented to voice-to-text transcription exclusively for technical competency evaluation. No facial analysis, emotion inference, or biometric profile was recorded.&quot;
                        </p>
                      </div>
                    )}

                    {interviewStep === 2 && (
                      <div className="p-4 bg-white rounded-xl border border-neutral-200 text-xs space-y-2">
                        <div className="text-neutral-500 font-mono">// Live Speech-to-Text Stream</div>
                        <div className="p-2.5 rounded-lg bg-neutral-50 text-neutral-800 italic border border-neutral-200">
                          Candidate: &quot;For our 10k TPS gateway, we generated a client-side idempotency UUID, acquired an exclusive Redis Redlock with a 500ms TTL, and wrote to an append-only transaction ledger with database uniqueness constraints before committing to Kafka...&quot;
                        </div>
                        <div className="text-[11px] text-black font-semibold flex items-center gap-1">
                          <Check size={12} /> Keywords detected: Redis Redlock, TTL, Outbox, Idempotency UUID
                        </div>
                      </div>
                    )}

                    {interviewStep === 3 && (
                      <div className="p-4 bg-white rounded-xl border border-neutral-200 text-xs space-y-2">
                        <div className="font-bold text-black flex items-center justify-between">
                          <span>Objective Evaluation: Recommended for Client Round 1</span>
                          <span className="text-black font-black text-sm">Score: 92/100</span>
                        </div>
                        <p className="text-neutral-700">
                          Strong hands-on mastery of distributed state, race-condition mitigation, and event serialization. Human recruiter recommended to proceed to technical panel interview.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CROSS-VENDOR DEDUP & FRAUD CHECK */}
          {engineTab === 'dedup' && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
                <div>
                  <h4 className="text-base font-bold text-black">Cross-Partner Duplicate & Ownership Detection</h4>
                  <p className="text-xs text-neutral-500">Prevents double-submissions, protects recruiter commission ownership, and flags ghost profiles</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-black bg-white border border-neutral-200 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} /> 100% Conflict Free
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
                  <div className="text-xs text-neutral-500">Identity Cryptographic Hash</div>
                  <div className="font-mono text-xs font-bold text-black mt-1 truncate">sha256:7f9a2b8e...c419</div>
                  <div className="text-[11px] text-black mt-1 flex items-center gap-1 font-semibold">
                    <Check size={12} /> PAN / Email / Phone Verified
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
                  <div className="text-xs text-neutral-500">Submission Ownership Period</div>
                  <div className="text-xs font-bold text-black mt-1">NexaTalent Direct (180 Days Active)</div>
                  <div className="text-[11px] text-neutral-500 mt-1">Vendor commission disputes eliminated</div>
                </div>
                <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
                  <div className="text-xs text-neutral-500">Cross-Tenant Isolation</div>
                  <div className="text-xs font-bold text-black mt-1">Dedicated Schema Partitioned</div>
                  <div className="text-[11px] text-neutral-500 mt-1">Zero data bleed between client orgs</div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-black">Verification Clearance:</strong> Candidate has no competing agency claims across active client mandates in the last 180 days.
                  </div>
                </div>
                <span className="text-neutral-500 text-[11px]">Audit Timestamp: Just Now</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          SECTION 4: COMPLETE RECRUITMENT CRM & ATS SUITE (WHITE BG)
         ======================================================== */}
      <section className="py-20 bg-white text-black border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
              Integrated CRM & ATS Engine
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
              Built-in Applicant Tracking, Pipelines & Replacement Warranty Tracking
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600">
              Replace multiple disconnected tools with one cohesive recruitment operating system. Whether you are using NexaTalent as your staffing vendor or using our SaaS platform in-house, your workflow remains synchronized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Kanban Hiring Pipeline',
                desc: 'Configurable stages: Sourced, AI Screened, Recruiter Verified, Client Review, Interview R1/R2, Offer Rollout, and Joined.',
                icon: Workflow,
                badge: 'Real-Time Sync',
              },
              {
                title: 'Vendor & Agency Allocation',
                desc: 'Assign specific requisitions to empanelled staffing vendors with customized commercial terms, candidate quotas, and SLAs.',
                icon: Users,
                badge: 'Multi-Vendor',
              },
              {
                title: 'Automated Communication Suite',
                desc: 'WhatsApp Business API and transactional email workflows for interview reminders, joining check-ins, and feedback requests.',
                icon: MessageSquare,
                badge: 'WhatsApp + Email',
              },
              {
                title: 'Offer & Joining Governance',
                desc: 'Monitor counter-offer risks, track notice period milestones week-by-week, and reduce Day-1 dropouts with automated touchpoints.',
                icon: FileCheck,
                badge: 'Dropout Protection',
              },
              {
                title: '90-Day Replacement Tracking',
                desc: 'Built-in warranty management logs joining dates, probation markers, and flags replacements automatically if early exit occurs.',
                icon: RotateCcw,
                badge: 'Audit Warranty',
              },
              {
                title: 'Deep Analytics & Bottleneck AI',
                desc: 'Identifies interview conversion friction, calculates cost-per-hire, measures recruiter efficiency, and predicts hiring timelines.',
                icon: TrendingUp,
                badge: 'Predictive Insights',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-3xl border border-neutral-200 bg-white p-6 flex flex-col justify-between hover:border-black transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-black">
                      <feature.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-white border border-neutral-200 px-2.5 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-black mb-2">{feature.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: 5 DEDICATED PORTAL WORKSPACES (WHITE BG)
         ======================================================== */}
      <section id="portals-ecosystem" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
              Connected Multi-Role Architecture
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
              5 Dedicated Workspace Portals for Every Stakeholder
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Each user type experiences a custom role-tailored dashboard with strict permission controls.
            </p>

            {/* Portal Switcher Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                { id: 'employer', label: 'Employer Portal', icon: Building2 },
                { id: 'candidate', label: 'Candidate Portal', icon: Users },
                { id: 'vendor', label: 'Vendor & Partner Portal', icon: Network },
                { id: 'ats', label: 'Recruiter ATS & CRM', icon: Workflow },
                { id: 'superadmin', label: 'Super Admin Control Plane', icon: Server },
              ].map((tab) => {
                const active = portalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPortalTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                      active
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                    }`}
                  >
                    <tab.icon size={15} className={active ? 'text-white' : 'text-neutral-500'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PORTAL PREVIEW CARDS */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-xs">
            {portalTab === 'employer' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-neutral-500">Client & Enterprise Hiring Portal</span>
                    <h3 className="text-xl font-extrabold text-black">Employer Hiring Hub</h3>
                  </div>
                  <Link
                    to="/employer/register"
                    className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800"
                  >
                    <span>Employer Registration</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Submit Requisitions</strong>
                    <p className="text-neutral-600">Upload JD documents or use AI assistant to generate role profiles with targeted salary budgets.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Pre-Calibrated Candidates</strong>
                    <p className="text-neutral-600">Review 1-click candidate dossiers with explainable scores, verified notice periods, and interview summaries.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Invoices & Agreements</strong>
                    <p className="text-neutral-600">Track placement milestone billing, credit days, SLA guarantees, and download tax invoices.</p>
                  </div>
                </div>
              </div>
            )}

            {portalTab === 'candidate' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-neutral-500">Candidate Journey</span>
                    <h3 className="text-xl font-extrabold text-black">Candidate Career Workspace</h3>
                  </div>
                  <Link
                    to="/candidate/register"
                    className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800"
                  >
                    <span>Register as Candidate</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Instant Resume Parsing</strong>
                    <p className="text-neutral-600">Drop a resume to auto-populate skills, tenure, projects, and receive tailored job recommendations.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Transparent Status Tracker</strong>
                    <p className="text-neutral-600">Track review stage in real-time — no ghosting. Receive automated interview feedback and status updates.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Privacy & Consent Controls</strong>
                    <p className="text-neutral-600">Candidate controls resume visibility, profile sharing authorization, and right to be forgotten under DPDP.</p>
                  </div>
                </div>
              </div>
            )}

            {portalTab === 'vendor' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-neutral-500">Staffing Partner Network</span>
                    <h3 className="text-xl font-extrabold text-black">Vendor Empanelment Portal</h3>
                  </div>
                  <Link
                    to="/vendor/register"
                    className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800"
                  >
                    <span>Vendor Registration</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">GST & Compliance Verification</strong>
                    <p className="text-neutral-600">Automated verification of GSTIN, company registration, and non-disclosure agreements before mandate access.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Conflict-Free Submissions</strong>
                    <p className="text-neutral-600">Instant deduplication check on candidate upload prevents cross-vendor disputes and locks submission ownership.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Commission & Payout Ledger</strong>
                    <p className="text-neutral-600">Transparent billing tracking: interview milestones, successful joining, and timely commission dispatches.</p>
                  </div>
                </div>
              </div>
            )}

            {portalTab === 'ats' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-neutral-500">Operations Command</span>
                    <h3 className="text-xl font-extrabold text-black">Recruiter ATS & Copilot Desk</h3>
                  </div>
                  <Link
                    to="/recruiter/login"
                    className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800"
                  >
                    <span>Recruiter Sign In</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">AI Talent Discovery</strong>
                    <p className="text-neutral-600">Semantic search over internal resume pools, talent networks, and authorized job board APIs.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Automated Candidate Outreach</strong>
                    <p className="text-neutral-600">Auto-draft tailored pitch emails and WhatsApp check-ins calibrated to the candidate&apos;s exact experience.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Audit Trail & Activity Log</strong>
                    <p className="text-neutral-600">Every recruiter action, feedback note, and candidate contact is logged with immutable timestamps.</p>
                  </div>
                </div>
              </div>
            )}

            {portalTab === 'superadmin' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-neutral-500">Enterprise Governance</span>
                    <h3 className="text-xl font-extrabold text-black">Super Admin & Tenant Plane</h3>
                  </div>
                  <Link
                    to="/superadmin/login"
                    className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800"
                  >
                    <span>Platform Governance</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Multi-Tenant Tenant Isolation</strong>
                    <p className="text-neutral-600">Govern separate company subscriptions, API credit allowances, and enforce strict row-level data boundaries.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">AI Model Usage & Quotas</strong>
                    <p className="text-neutral-600">Monitor token consumption across LLM providers, OCR usage, speech transcription minutes, and vendor costs.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200">
                    <strong className="block text-sm font-bold text-black mb-1">Global Security & Compliance</strong>
                    <p className="text-neutral-600">Enforce MFA, manage staff roles, audit data access logs, and oversee DPDP compliance requests.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: SAAS SUBSCRIPTION TIERS & ROI CALCULATOR (WHITE BG)
         ======================================================== */}
      <section id="saas-calculator" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
              SaaS Multi-Tenant Commercials
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
              Flexible SaaS Subscriptions for Modern Hiring Teams
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Run your internal recruitment operations on NexaTalent Cloud OS. Choose the plan that fits your headcount expansion.
            </p>
          </div>

          {/* Interactive Calculator */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 mb-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-6">
                <h4 className="text-base font-bold text-black">Interactive SaaS Pricing & ROI Estimator</h4>

                <div>
                  <div className="flex justify-between text-xs font-bold text-black mb-2">
                    <span>Recruiter & Hiring Manager Seats</span>
                    <span className="text-black text-sm">{recruiterCount} Users</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={recruiterCount}
                    onChange={(e) => setRecruiterCount(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                    <span>1 User</span>
                    <span>25 Users</span>
                    <span>50 Users</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-black mb-2">
                    <span>Monthly Requisitions / Target Hires</span>
                    <span className="text-black text-sm">{hiresPerMonth} Hires/Month</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={hiresPerMonth}
                    onChange={(e) => setHiresPerMonth(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                    <span>2 Hires</span>
                    <span>50 Hires</span>
                    <span>100 Hires</span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-black mb-2">AI Feature & Usage Tier</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', name: 'Starter AI', quota: 'Basic Matching' },
                      { id: 'scale', name: 'Pro AI Agent', quota: 'Full Screening' },
                      { id: 'enterprise', name: 'Enterprise AI', quota: 'Voice + Dedup' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setAiUsageTier(tier.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          aiUsageTier === tier.id
                            ? 'border-black bg-black text-white font-bold'
                            : 'border-neutral-200 bg-white text-black hover:border-black text-xs'
                        }`}
                      >
                        <div className="text-xs font-bold">{tier.name}</div>
                        <div className={`text-[10px] ${aiUsageTier === tier.id ? 'text-neutral-300' : 'text-neutral-500'}`}>{tier.quota}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimate Result Card */}
              <div className="lg:col-span-5 rounded-3xl bg-white border border-neutral-200 text-black p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
                    Estimated SaaS Investment
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-black">
                    ₹{saasMonthlyCost.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-neutral-500"> / month</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Billed annually with multi-seat volume discount and tenant schema isolation.
                  </p>

                  <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-700">
                      <span>Annual Estimated Agency Savings:</span>
                      <span className="font-bold text-black">₹{(estimatedAgencyCostSavings / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <div className="flex justify-between text-neutral-700">
                      <span>Turnaround Reduction:</span>
                      <span className="font-bold text-black">65% faster</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Request 14-Day Enterprise Sandbox Trial</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SaaS Plan Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter Cloud',
                price: '₹14,999',
                cadence: 'per company / month',
                desc: 'For early-stage startups and boutique teams needing smart resume parsing and applicant tracking.',
                features: [
                  'Up to 3 Recruiter Seats',
                  'AI Resume Parsing (500/mo)',
                  'Basic Explainable Matching',
                  'Standard Job Description Generator',
                  'Candidate Application Portal',
                  'Email Notification Automation',
                ],
                cta: 'Start Free Trial',
                featured: false,
              },
              {
                name: 'Professional Ecosystem',
                price: '₹34,999',
                cadence: 'per company / month',
                desc: 'For scaling companies with dedicated talent teams, active vendor empanelment, and volume hiring.',
                features: [
                  'Up to 10 Recruiter & Manager Seats',
                  'AI Resume Parsing (2,500/mo)',
                  'Full Explainable Scorecard & Gap Analysis',
                  'Autonomous Recruiter Copilot Assistant',
                  'Vendor & Partner Empanelment Portal',
                  'WhatsApp Business API Integration',
                  'Audit-Ready Replacement Tracking',
                ],
                cta: 'Choose Professional',
                featured: true,
              },
              {
                name: 'Enterprise Dedicated',
                price: 'Custom',
                cadence: 'annual enterprise license',
                desc: 'For large tech enterprises, GCCs, and staffing agencies requiring custom LLM fine-tuning and ERP hooks.',
                features: [
                  'Unlimited Recruiter & Manager Seats',
                  'Custom Embedding Models & pgvector Vault',
                  'AI Voice & Text Interview Screening Suite',
                  'Cross-Vendor Deduplication Engine',
                  'Full Multi-Tenant Database Isolation',
                  'Dedicated Account Executive & SLA',
                  'Custom ERP / HRIS Integrations',
                ],
                cta: 'Talk to Enterprise Team',
                featured: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border bg-white transition-all shadow-xs ${
                  plan.featured
                    ? 'border-black ring-2 ring-black'
                    : 'border-neutral-200 hover:border-black'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-extrabold text-black">{plan.name}</h4>
                    {plan.featured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black">{plan.price}</div>
                  <div className="text-xs text-neutral-500 mb-4">{plan.cadence}</div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-6">{plan.desc}</p>

                  <div className="space-y-2.5 border-t border-neutral-200 pt-6">
                    {plan.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 size={15} className="text-black shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to="/contact"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      plan.featured
                        ? 'bg-black text-white hover:bg-neutral-800'
                        : 'bg-white border border-neutral-300 text-black hover:border-black'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: MODULAR AI TECH STACK & INTEGRATIONS (WHITE BG)
         ======================================================== */}
      <section className="py-20 bg-white text-black border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
              Modular Architecture
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
              Vendor-Agnostic, Pluggable AI Infrastructure
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              We architected NexaTalent using modular abstraction layers. We can hot-swap underlying LLMs, vector stores, or speech models as technology evolves without rebuilding platform business logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'LLM & Agent Gateway',
                tech: 'Anthropic Claude / OpenAI / Gemini',
                role: 'Drives JD generation, semantic synthesis, candidate gap discovery, and recruiter copilot actions.',
              },
              {
                title: 'Vector Embeddings',
                tech: 'pgvector / Pinecone / Qdrant',
                role: 'High-dimensional candidate indexing for hybrid semantic + lexical search across deep resume pools.',
              },
              {
                title: 'Document AI & OCR',
                tech: 'AWS Textract / Tesseract / LayoutLM',
                role: 'Extracts tabular employment history, skill tables, and certificates from scanned PDF and DOCX files.',
              },
              {
                title: 'Audio & Speech Stack',
                tech: 'Whisper / Deepgram / Azure Speech',
                role: 'Handles voice-based screening interviews with candidate consent and structured text transcription.',
              },
              {
                title: 'Coding Evaluation',
                tech: 'Judge0 / HackerRank API / Custom Sandbox',
                role: 'Automates algorithmic and domain code tests with real-time linting, execution safety, and complexity checks.',
              },
              {
                title: 'Enterprise Communication',
                tech: 'Meta WhatsApp Business API / SendGrid',
                role: 'Automates candidate check-ins, interview confirmations, opt-out compliance, and client status decks.',
              },
              {
                title: 'Multi-Tenant Core',
                tech: 'PostgreSQL Row-Level Security (RLS)',
                role: 'Guarantees total cryptographic and database isolation so tenant records are never leaked across organizations.',
              },
              {
                title: 'DPDP Security Vault',
                tech: 'AES-256 / SHA-256 / TLS 1.3',
                role: 'Indian Digital Personal Data Protection Act compliance with automated consent revocation and candidate data purging.',
              },
            ].map((stack, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-neutral-200 bg-white flex flex-col justify-between hover:border-black transition-colors shadow-xs"
              >
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider mb-1">
                    {stack.title}
                  </div>
                  <div className="text-sm font-bold text-black mb-2">{stack.tech}</div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{stack.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: PHASED IMPLEMENTATION ROADMAP (WHITE BG)
         ======================================================== */}
      <section className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
              Phased Execution Blueprint
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
              Structured 4-Phase Engineering Rollout
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Iterative, risk-mitigated delivery schedule transitioning from core platform foundation to autonomous multi-tenant intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                phase: 'Phase 1',
                title: 'Core Platform & AI Foundation',
                duration: 'Weeks 1–4',
                deliverables: [
                  'Website upgrade with AI showcase',
                  'AI Resume Parser & Schema Extractor',
                  'Explainable Candidate-JD Matcher',
                  'Unified ATS & Kanban CRM Pipeline',
                  'Employer Enquiry & Registration flow',
                  'Admin & Recruiter Workspace Base',
                ],
                status: 'Complete in Prototype',
              },
              {
                phase: 'Phase 2',
                title: 'AI Automation & Multi-Portal',
                duration: 'Weeks 5–8',
                deliverables: [
                  'Recruiter AI Copilot Assistant',
                  'Voice & Text Screening Assistant',
                  'Candidate Self-Service Portal',
                  'Vendor Empanelment & GST Validator',
                  'WhatsApp Business API Integrations',
                  'Conflict-Free Duplicate Checker',
                ],
                status: 'Next Sprint',
              },
              {
                phase: 'Phase 3',
                title: 'Multi-Tenant SaaS Platform',
                duration: 'Weeks 9–12',
                deliverables: [
                  'Multi-Company Tenant Schemas',
                  'Subscription & Credit Billing Gateway',
                  'Usage-based Token Tracking',
                  'Client-Specific Candidate Vaults',
                  'Enterprise Role-Based Access Control',
                  'Super Admin Platform Governance',
                ],
                status: 'Scheduled',
              },
              {
                phase: 'Phase 4',
                title: 'Autonomous Scale & GCC Pods',
                duration: 'Weeks 13–16',
                deliverables: [
                  'Predictive Talent Market Analytics',
                  'Turnkey Offshore Pod Deployment',
                  'Enterprise ERP & HRIS Connectors',
                  'Dynamic Code Evaluation Sandbox',
                  'Automated Replacement Auditing',
                  'SOC 2 & ISO 27001 Certification',
                ],
                status: 'Roadmapped',
              },
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-3xl border border-neutral-200 bg-white p-6 flex flex-col justify-between hover:border-black transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-black">{p.phase}</span>
                    <span className="text-[10px] font-mono text-neutral-500 bg-white border border-neutral-200 px-2 py-0.5 rounded">
                      {p.duration}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-black mb-4">{p.title}</h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    {p.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <Check size={13} className="text-black shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-neutral-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: ENTERPRISE CALL TO ACTION (100% WHITE BG)
         ======================================================== */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-sm">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-black bg-white border border-neutral-200 px-3 py-1 rounded-full mb-4">
              Get Started Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
              Ready to Transform Your Hiring with NexaTalent AI?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Whether you need our <strong>AI Recruitment Consultancy</strong> to deliver elite engineering talent or want our <strong>AI Recruitment SaaS</strong> for your internal teams, we are ready to partner with you.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/employers"
                className="rounded-full bg-black hover:bg-neutral-800 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition-all shadow-sm"
              >
                Hire Talent via AI Consultancy
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-neutral-300 hover:border-black px-6 py-3.5 text-xs sm:text-sm font-bold text-black transition-all"
              >
                Book SaaS Platform Walkthrough
              </Link>
              <Link
                to="/careers"
                className="rounded-full bg-white border border-neutral-200 hover:border-black px-6 py-3.5 text-xs sm:text-sm font-bold text-black transition-all"
              >
                Explore Open Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <V2Footer />
    </div>
  );
}
