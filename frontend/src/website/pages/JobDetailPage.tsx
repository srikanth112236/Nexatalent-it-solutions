import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Bookmark, 
  ChevronRight, 
  Send, 
  Upload, 
  ShieldCheck, 
  Sparkles,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Check
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { LightFinalCTAExpansion } from '../components/light-motion';

interface JobDetailModel {
  id: string;
  slug: string;
  title: string;
  department: string;
  clientType: string;
  location: string;
  workMode: 'Hybrid' | 'Remote' | 'On-site';
  exp: string;
  ctc: string;
  posted: string;
  urgency: string;
  skills: string[];
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  interviewStages: { step: string; name: string; duration: string; focus: string }[];
  vettingPhases: {
    phase: string;
    title: string;
    description: string;
    metric: string;
    metricLabel: string;
    rubricItems: string[];
  }[];
}

const JOBS_DATABASE: Record<string, JobDetailModel> = {
  'j1': {
    id: 'j1',
    slug: 'senior-cloud-devops-sre-lead',
    title: 'Senior Cloud DevOps & SRE Lead',
    department: 'Cloud Platform & Infrastructure',
    clientType: 'High-Growth US SaaS Enterprise',
    location: 'Bengaluru (Outer Ring Road) / Remote',
    workMode: 'Hybrid',
    exp: '5-9 Years',
    ctc: '₹32,00,000 - ₹48,00,000 PA',
    posted: '1 Day Ago',
    urgency: 'Immediate Joiner Preferred (Under 30 Days)',
    skills: ['Kubernetes', 'Terraform', 'AWS / GCP', 'CI/CD Pipelines', 'Prometheus', 'Golang / Python'],
    summary: 'Lead multi-cloud container orchestration and infrastructure-as-code automation for high-availability distributed microservices serving 15M+ daily active transactions.',
    responsibilities: [
      'Maintain 99.99% operational SLA availability across multi-region AWS and GCP production clusters.',
      'Architect zero-trust Kubernetes infrastructure, GitOps deployment pipelines, and automated chaos engineering drills.',
      'Optimize cloud compute expenditures via automated spot instance pools and custom autoscaling policies.',
      'Collaborate with principal developers to establish observability, memory profiling, and automated incident response.'
    ],
    requirements: [
      '5+ years experience in DevOps, SRE, or Cloud Platform Engineering operating large-scale production Kubernetes.',
      'Proficient with Terraform, Helm, ArgoCD, Prometheus, Grafana, and Linux kernel fundamentals.',
      'Proven track record with zero-downtime production deployments and SOC2 compliance automation.',
      'Bachelor’s or Master’s in Computer Science, IT, or equivalent engineering experience.'
    ],
    benefits: [
      'Top 5% market compensation with annual performance bonuses (up to 20% fixed CTC).',
      'Comprehensive health insurance (₹15 Lakhs) covering family, parents, and maternity.',
      '₹1,50,000 annual learning stipend for tech certifications and global conferences.',
      'Latest Apple MacBook Pro M3 Max hardware + ₹40,000 home office setup allowance.'
    ],
    interviewStages: [
      { step: '01', name: 'Nexa Technical Profile Calibration', duration: '30 Mins', focus: 'Candidate profile calibration & notice period validation' },
      { step: '02', name: 'Live Infrastructure Debugging & Terraform Lab', duration: '60 Mins', focus: 'K8s troubleshooting, Helm charts, and IaC design' },
      { step: '03', name: 'Multi-Cloud Architecture Deep-Dive', duration: '75 Mins', focus: 'High-availability failover, zero-trust security & DR' },
      { step: '04', name: 'VP Engineering & Executive Fit', duration: '45 Mins', focus: 'Leadership mindset, Incident response & team growth' }
    ],
    vettingPhases: [
      {
        phase: 'PHASE 01',
        title: 'Kubernetes & Multi-Cloud Graph Calibration',
        description: 'We audit production evidence across multi-region EKS/GKE clusters, Terraform module design, and infrastructure automation.',
        metric: '99.99%',
        metricLabel: 'SLA Uptime Target Benchmark',
        rubricItems: ['Multi-region K8s ingress & mesh setup', 'Terraform state management & modular IaC', 'GitOps deployment automation with ArgoCD']
      },
      {
        phase: 'PHASE 02',
        title: 'Practitioner SRE & Observability Sandbox',
        description: 'Hands-on live cluster debugging session inspecting pods memory spikes, Prometheus metrics, and automated alert routing.',
        metric: 'Sub-15m',
        metricLabel: 'MTTR Incident Recovery Target',
        rubricItems: ['Prometheus & Grafana alert thresholding', 'Chaos engineering & pod failure recovery', 'Zero-downtime blue/green deployment strategy']
      },
      {
        phase: 'PHASE 03',
        title: 'Calibrated Shortlist Delivery',
        description: 'Deliver pre-assessed DevOps contenders with mapped notice periods and compensation alignments directly into hiring portal.',
        metric: '7-12 Days',
        metricLabel: 'Average Shortlist Intake SLA',
        rubricItems: ['Direct calendar interview scheduling', 'Live stage updates through hiring dashboard', 'Notice period buyout coordination']
      },
      {
        phase: 'PHASE 04',
        title: 'Tenure & 90-Day Placement Warranty',
        description: 'Our commitment extends past joining with 30, 60, and 90-day retention check-ins and an unconditional replacement guarantee.',
        metric: '90 Days',
        metricLabel: 'Unconditional Placement Warranty',
        rubricItems: ['Joining day transition advocacy', 'Onboarding milestone check-ins', 'Rapid replacement squad on standby']
      }
    ]
  },
  'j2': {
    id: 'j2',
    slug: 'staff-backend-engineer-distributed-systems',
    title: 'Staff Backend Engineer (Distributed Systems)',
    department: 'Platform Core & FinTech Infrastructure',
    clientType: 'Series-D FinTech Unicorn',
    location: 'Bengaluru (Indiranagar)',
    workMode: 'Hybrid',
    exp: '7-12 Years',
    ctc: '₹45,00,000 - ₹62,00,000 + ESOP Grants',
    posted: '2 Days Ago',
    urgency: 'Immediate Joiner Preferred (30-day notice or less)',
    skills: ['Go / Golang', 'Distributed Consensus (Raft)', 'Kafka', 'Kubernetes', 'gRPC', 'PostgreSQL'],
    summary: 'Architect, develop, and operate high-throughput event-driven microservices processing over 25,000 requests per second with sub-50ms p99 latency.',
    responsibilities: [
      'Design fault-tolerant data pipelines guaranteeing exactly-once transaction semantics across banking partners.',
      'Mentor senior engineers on Go concurrency patterns, memory profiling, and low-latency database queries.',
      'Partner with VP of Engineering on multi-cloud zero-trust network topology and distributed tracing.'
    ],
    requirements: [
      '7+ years experience designing backend services in Go, Rust, or modern C++.',
      'Deep architectural knowledge of distributed consensus, message brokers (Kafka), and database partitioning.',
      'Bachelor’s or Master’s in Computer Science or equivalent engineering background.'
    ],
    benefits: [
      'Top 5% market compensation with liquid ESOP repurchase programs.',
      'Comprehensive family medical coverage (₹15 Lakhs).',
      'Flexible home office setup stipend and top-tier hardware.'
    ],
    interviewStages: [
      { step: '01', name: 'Profile Calibration Call', duration: '30 Mins', focus: 'Technical experience & career goals' },
      { step: '02', name: 'Live Concurrency Sandbox', duration: '60 Mins', focus: 'Go channels, goroutines, memory contention' },
      { step: '03', name: 'Distributed Systems Architecture', duration: '90 Mins', focus: 'High-throughput system design' },
      { step: '04', name: 'Executive Leadership Call', duration: '45 Mins', focus: 'Mentorship and strategic execution' }
    ],
    vettingPhases: [
      {
        phase: 'PHASE 01',
        title: 'Go Concurrency & Memory Graph Calibration',
        description: 'Semantic indexing of candidate pull requests evaluating channel synchronization, mutex contention, and GC pause minimization.',
        metric: '25,000+',
        metricLabel: 'RPS Transaction Throughput Target',
        rubricItems: ['Lockless data structures & channel patterns', 'Distributed consensus (Raft/Paxos) mechanics', 'Kafka partitioned consumer group design']
      },
      {
        phase: 'PHASE 02',
        title: 'Practitioner Systems Architecture Panel',
        description: 'Live architecture interview led by principal engineers assessing fault tolerance, partition recovery, and DB shard strategies.',
        metric: 'Sub-50ms',
        metricLabel: 'Target p99 Transaction Latency',
        rubricItems: ['Exactly-once transaction guarantees', 'gRPC protobuf interface optimization', 'PostgreSQL connection pooling & indexing']
      },
      {
        phase: 'PHASE 03',
        title: 'Calibrated Contender Shortlist',
        description: 'Receive verified candidate dossiers with verified notice period timelines and compensation expectations.',
        metric: '5-10 Days',
        metricLabel: 'Shortlist Delivery SLA',
        rubricItems: ['Synchronous interview scheduling', 'Direct portal access to debrief logs', 'Managed counter-offer navigation']
      },
      {
        phase: 'PHASE 04',
        title: 'Tenure & Placement Governance',
        description: 'Documented replacement terms and post-placement engineering integration check-ins at 30, 60, and 90 days.',
        metric: '90 Days',
        metricLabel: 'Full Placement Warranty',
        rubricItems: ['Onboarding milestone support', '90-day replacement commitment', 'Regular candidate touchpoints']
      }
    ]
  },
  'j3': {
    id: 'j3',
    slug: 'principal-ai-ml-scientist-llm-rag',
    title: 'Principal AI/ML Scientist (LLMs & RAG Architecture)',
    department: 'Applied AI & Cognitive Services',
    clientType: 'Global Enterprise SaaS Leader',
    location: 'Hyderabad (HITEC City)',
    workMode: 'Hybrid',
    exp: '8-14 Years',
    ctc: '₹55,00,000 - ₹75,00,000 + RSU Grants',
    posted: '1 Day Ago',
    urgency: 'Strategic Retained Mandate',
    skills: ['PyTorch', 'Large Language Models (LLMs)', 'Vector DBs (Milvus/Pinecone)', 'LoRA', 'LangChain', 'Python'],
    summary: 'Drive research and production deployment of domain-specific generative models and vector-based semantic retrieval engines for Fortune 500 enterprise customers.',
    responsibilities: [
      'Design and deploy retrieval-augmented generation (RAG) pipelines over multi-terabyte proprietary enterprise corpora.',
      'Implement parameter-efficient fine-tuning (PEFT/LoRA) and RLHF pipelines for specialized domain tasks.',
      'Lead AI safety, hallucination mitigation, and model evaluation benchmarks.'
    ],
    requirements: [
      'PhD or Master’s in CS, AI/ML with 5+ years post-grad industry research.',
      'Production deployment experience serving models on Triton / vLLM / TensorRT-LLM.'
    ],
    benefits: [
      'Direct US RSU equity grants valued at $80,000+ vesting over 4 years.',
      'Access to dedicated high-performance H100 GPU compute clusters.'
    ],
    interviewStages: [
      { step: '01', name: 'AI Gatekeeper Screening', duration: '30 Mins', focus: 'Research portfolio review & RAG design' },
      { step: '02', name: 'ML Deep-Dive Interview', duration: '60 Mins', focus: 'Transformers, embeddings, fine-tuning' },
      { step: '03', name: 'Production System Design', duration: '75 Mins', focus: 'vLLM latency & vector DB scaling' },
      { step: '04', name: 'Executive Vision Interview', duration: '45 Mins', focus: 'Business alignment & product roadmap' }
    ],
    vettingPhases: [
      {
        phase: 'PHASE 01',
        title: 'LLM & Vector Embedding Calibration',
        description: 'Evaluating candidate publications and code for parameter-efficient fine-tuning, embedding alignment, and vector retrieval accuracy.',
        metric: '8.4x',
        metricLabel: 'Token Serving Throughput Target',
        rubricItems: ['PyTorch model fine-tuning (LoRA / QLoRA)', 'Vector database indexing (Milvus/Pinecone)', 'Context window optimization & RAG evaluation']
      },
      {
        phase: 'PHASE 02',
        title: 'vLLM & GPU Kernel Benchmarking',
        description: 'Practitioner evaluation assessing GPU memory allocation, FlashAttention tiling, and continuous batching across H100 clusters.',
        metric: 'Sub-15ms',
        metricLabel: 'Time-to-First-Token Benchmark',
        rubricItems: ['Triton & TensorRT-LLM model serving', 'Hallucination mitigation & RLHF alignment', 'GPU shared memory & PagedAttention']
      },
      {
        phase: 'PHASE 03',
        title: 'Calibrated AI Scientist Shortlist',
        description: 'Delivery of vetted AI/ML scientists with verified notice periods and compensation expectations.',
        metric: '10-14 Days',
        metricLabel: 'Shortlist Delivery SLA',
        rubricItems: ['Interview scheduling without email friction', 'Recorded technical debriefs', 'Managed offer & equity negotiation']
      },
      {
        phase: 'PHASE 04',
        title: 'Tenure & AI Ethics Governance',
        description: 'Documented placement warranty and IP assignment escrow ensuring 100% security for corporate AI assets.',
        metric: '90 Days',
        metricLabel: 'Replacement Warranty',
        rubricItems: ['Complete IP escrow protection', 'Post-joining 90-day retention checks', 'Dedicated account leadership']
      }
    ]
  }
};

export function JobDetailPage() {
  const { jobSlug } = useParams<{ jobSlug: string }>();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeVettingPhase, setActiveVettingPhase] = useState(0);

  // Form Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate Joiner (0-15 Days)');
  const [currentCtc, setCurrentCtc] = useState('');
  const [expectedCtc, setExpectedCtc] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [appReferenceId, setAppReferenceId] = useState('');

  // Lookup target job mandate or fallback to j1
  const lookupKey = (jobSlug && JOBS_DATABASE[jobSlug.toLowerCase()]) ? jobSlug.toLowerCase() : 'j1';
  const job = JOBS_DATABASE[lookupKey];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [jobSlug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const randomRef = `NEXA-APP-${Math.floor(10000 + Math.random() * 90000)}`;
      setAppReferenceId(randomRef);
      setSubmitted(true);
    }, 700);
  };

  const currentVetting = job.vettingPhases[activeVettingPhase] || job.vettingPhases[0];

  // Other related jobs
  const relatedJobs = Object.values(JOBS_DATABASE).filter((j) => j.id !== job.id);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans relative overflow-x-clip">
      {/* SEO Head */}
      <SeoHead
        title={`${job.title} | Nexa Talent IT Solutions`}
        description={`${job.title} in ${job.location}. CTC: ${job.ctc}. Required skills: ${job.skills.slice(0, 4).join(', ')}. Apply directly via Nexa Talent IT Solutions.`}
        keywords={`${job.title}, ${job.skills.join(', ')}, ${job.location}, Nexa Talent IT Solutions`}
        canonical={`/jobs/${job.id}`}
      />

      {/* Global Navbar */}
      <SiteNavbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-6 lg:px-16 bg-[#FAF8F5] border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-[#0265FF] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <Link to="/jobs" className="hover:text-[#0265FF] transition-colors">Jobs & Mandates</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-[#0265FF] font-bold">{job.title}</span>
          </div>

          {/* Department & Urgency Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider">
              {job.department}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
              {job.clientType}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold uppercase tracking-wider">
              {job.urgency}
            </span>
          </div>

          {/* Job Title & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0265FF]" />
                  <span>{job.location} ({job.workMode})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0265FF]" />
                  <span>{job.exp} Experience</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>{job.ctc}</span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  saved ? 'bg-blue-50 border-blue-300 text-[#0265FF]' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
                title={saved ? 'Mandate Saved' : 'Save Mandate'}
              >
                <Bookmark className="w-5 h-5" fill={saved ? '#0265FF' : 'none'} />
              </button>

              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="px-8 py-4 rounded-2xl bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-sm shadow-[0_10px_30px_rgba(2,101,255,0.25)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Apply for this Mandate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Details Body */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-slate-900">Role Overview & Objective</h2>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                {job.summary}
              </p>
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-slate-900">Required Technical Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Key Responsibilities & Deliverables</h3>
              <div className="space-y-3">
                {job.responsibilities.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#0265FF] shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-800 leading-relaxed font-semibold">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Candidate Experience & Qualifications</h3>
              <div className="space-y-3">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-800 leading-relaxed font-semibold">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Process Roadmap */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-slate-200 space-y-6 shadow-xs">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#0265FF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                  TRANSPARENT PROCESS
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">4-Stage Candidate Evaluation Process</h3>
              </div>

              <div className="space-y-3">
                {job.interviewStages.map((stg) => (
                  <div key={stg.step} className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0265FF] font-black flex items-center justify-center text-sm shrink-0">
                        {stg.step}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{stg.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Focus: {stg.focus}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                      {stg.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Express Apply Card */}
            <div className="p-8 rounded-3xl bg-white border-2 border-[#0265FF] shadow-xl shadow-blue-500/10 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0265FF] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>DIRECT CANDIDATE DESK</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Apply for this Mandate</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Applications are reviewed directly by our senior practice leaders. Zero candidate fees.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Express Application (60s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Confidential & Direct Engagement</span>
              </div>
            </div>

            {/* Approved Benefits Box */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 space-y-4 shadow-xs">
              <h4 className="font-extrabold text-base text-slate-900">Approved Compensation & Perks</h4>
              <div className="space-y-3 text-xs text-slate-700 font-medium">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Desk Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">PRACTICE LEAD CONTACT</span>
              <div className="space-y-2 text-xs font-semibold text-slate-800">
                <div className="font-bold text-sm text-slate-900">Nexa Talent IT Solutions Executive Desk</div>
                <div className="text-slate-600">Email: <a href="mailto:ceo@nexatalentitsolution.com" className="text-[#0265FF] font-bold">ceo@nexatalentitsolution.com</a></div>
                <div className="text-slate-600">Hotline: <a href="tel:+917019696166" className="text-slate-900 font-bold">+91 70196 96166</a></div>
                <div className="text-slate-500 text-[11px] pt-1">Corporate HQ: Skyline Icon, Marol, Andheri East, Mumbai 400059</div>
              </div>
            </div>

          </div>

        </div>

        {/* ============================================================================
         * DYNAMIC JOB-SPECIFIC VETTING METHODOLOGY SECTION
         * ============================================================================ */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF8F5] border border-slate-200 space-y-8 shadow-xs">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>RIGOROUS MANDATE VETTING METHODOLOGY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Deterministic Candidate Evaluation for {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Our practitioner evaluation framework customized specifically for {job.department} hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Interactive Phase Selector */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-[#0265FF] text-white px-2.5 py-1 rounded-md">
                  {currentVetting.phase}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ● ACTIVE FOCUS ({activeVettingPhase + 1}/4)
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {job.vettingPhases.map((v, idx) => (
                  <button
                    key={v.phase}
                    type="button"
                    onClick={() => setActiveVettingPhase(idx)}
                    className={`w-full p-3.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      activeVettingPhase === idx
                        ? 'bg-blue-50 text-[#0265FF] border border-blue-200 shadow-xs'
                        : 'bg-[#FAF8F5] text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{idx + 1}. {v.title}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-500">Phase Metric SLA</div>
                <div className="text-2xl font-black text-[#0265FF]">{currentVetting.metric}</div>
                <div className="text-xs font-bold text-emerald-700">✓ {currentVetting.metricLabel}</div>
              </div>
            </div>

            {/* Right Detailed Phase Rubric */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 space-y-5 shadow-sm">
              <div>
                <span className="text-xs font-extrabold text-[#0265FF] uppercase tracking-wider block mb-1">
                  {currentVetting.phase} EVALUATION CONSOLE
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{currentVetting.title}</h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentVetting.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block">Vetting Verification Criteria:</span>
                {currentVetting.rubricItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0265FF] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================================
         * DYNAMIC RELATED MANDATES SECTION
         * ============================================================================ */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              EXPLORE SIMILAR MANDATES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Related Retained Mandates in {job.department}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedJobs.map((rel) => (
              <div key={rel.id} className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 space-y-4 hover:border-[#0265FF] hover:shadow-xl transition-all shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0265FF] border border-blue-200">
                      {rel.urgency}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{rel.clientType}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg">{rel.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#0265FF]" />
                      {rel.location}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <IndianRupee size={14} className="text-emerald-600" />
                      {rel.ctc}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {rel.skills.slice(0, 3).map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold">Exp: {rel.exp}</span>
                  <Link
                    to={`/jobs/${rel.id}`}
                    className="px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer text-decoration-none"
                  >
                    <span>View Mandate Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Final Executive CTA Expansion Surface */}
      <LightFinalCTAExpansion />

      {/* Interactive Resume Upload & Candidate Details Application Drawer / Modal */}
      <AnimatePresence>
        {applyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative my-8"
            >
              {submitted ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                      ● APPLICATION DISPATCHED & VERIFIED
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">Application Received!</h3>
                    <div className="text-xs font-mono font-bold text-[#0265FF] bg-blue-50 py-1 px-3 rounded-lg inline-block border border-blue-200">
                      Ref ID: {appReferenceId}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-left text-xs text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-900">What happens next?</p>
                    <p>1. Our senior practice recruiters will review your resume for <strong>{job.title}</strong>.</p>
                    <p>2. If shortlisted, you will receive an invitation for Stage-1 technical calibration within 24 to 48 hours.</p>
                    <p className="text-slate-500 pt-1 border-t border-slate-200">Direct Desk: <strong className="text-slate-900">ceo@nexatalentitsolution.com</strong> | Phone: <strong className="text-slate-900">+91 70196 96166</strong></p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setApplyModalOpen(false);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#0265FF] text-white font-bold text-sm shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#0265FF] uppercase tracking-wider block mb-0.5">
                        DIRECT MANDATE APPLICATION
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900">{job.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApplyModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Candidate Form */}
                  <form onSubmit={handleApplicationSubmit} className="space-y-4 text-xs">
                    
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <User size={13} className="text-[#0265FF]" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-[#0265FF] focus:bg-white transition-all text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <Mail size={13} className="text-[#0265FF]" />
                          <span>Email Address *</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul@domain.com"
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-[#0265FF] focus:bg-white transition-all text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <Phone size={13} className="text-[#0265FF]" />
                          <span>Phone / WhatsApp *</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-[#0265FF] focus:bg-white transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <Calendar size={13} className="text-[#0265FF]" />
                          <span>Notice Period *</span>
                        </label>
                        <select
                          value={noticePeriod}
                          onChange={(e) => setNoticePeriod(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-[#0265FF] focus:bg-white transition-all text-xs"
                        >
                          <option>Immediate / Serving Notice</option>
                          <option>15 - 30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <IndianRupee size={13} className="text-[#0265FF]" />
                          <span>Current CTC</span>
                        </label>
                        <input
                          type="text"
                          value={currentCtc}
                          onChange={(e) => setCurrentCtc(e.target.value)}
                          placeholder="e.g. ₹28 LPA"
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-[#0265FF] focus:bg-white transition-all text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <IndianRupee size={13} className="text-emerald-600" />
                          <span>Expected CTC</span>
                        </label>
                        <input
                          type="text"
                          value={expectedCtc}
                          onChange={(e) => setExpectedCtc(e.target.value)}
                          placeholder="e.g. ₹38 LPA"
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-[#0265FF] focus:bg-white transition-all text-xs"
                        />
                      </div>
                    </div>

                    {/* Drag & Drop File Upload */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <FileText size={13} className="text-[#0265FF]" />
                        <span>Upload Resume (PDF / DOCX) *</span>
                      </label>

                      <label className="relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0265FF] bg-[#FAF8F5] hover:bg-blue-50/50 transition-all cursor-pointer">
                        <input
                          type="file"
                          required
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-6 h-6 text-[#0265FF] mb-1.5" />
                        <span className="font-bold text-slate-800">
                          {resumeFile ? resumeFile.name : 'Click to Upload or Drag & Drop Resume'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Selected` : 'PDF, DOCX up to 10MB'}
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isSubmitting ? (
                        <span>Encrypting & Dispatching Application...</span>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Submit Application to Executive Desk</span>
                        </>
                      )}
                    </button>
                  </form>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}
