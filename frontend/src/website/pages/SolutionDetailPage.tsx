import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Clock,
  Lock,
  FileText
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import {
  LightServiceTierComparison,
  LightTwoColumnPinnedStory,
  OneSideStickyFeatureStack,
  LightFAQAccordion,
  LightFinalCTAExpansion
} from '../components/light-motion';
import { solutionStages, solutionRubrics, solutionFaqs } from '../v2/data/detailSections';

export interface RoleItem {
  title: string;
  exp: string;
  turnaround: string;
  skills: string[];
}

export interface SolutionDetailData {
  title: string;
  tagline: string;
  badge: string;
  problem: string;
  audience: string;
  approach: string;
  capabilities: string[];
  process: { step: string; title: string; desc: string }[];
  roles: RoleItem[];
  sla: string;
  pricing: string;
  metrics: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
}

export function stripNumberPrefix(title: string): string {
  return title.replace(/^\s*\d+\s*[.)\-–:]*\s*/, '').trim();
}

export const SOLUTIONS_DETAIL_MAP: Record<string, SolutionDetailData> = {
  'permanent-hiring': {
    title: 'Permanent Recruitment & Direct Sourcing',
    tagline: 'High-retention lateral talent for core engineering & technology leadership roles.',
    badge: 'DIRECT FULL-TIME HIRING SLA',
    problem: 'Companies suffer from high candidate drop-out rates, endless screening of unvetted profiles, and 90+ day fill times for critical full-time engineering roles.',
    audience: 'Scale-ups, enterprise software companies, and product firms needing long-term technical talent.',
    approach: 'Three-stage technical qualification (algorithmic screen, architectural deep-dive, culture match) with high-touch offer advisory and candidate retention tracking.',
    capabilities: [
      'Full-lifecycle lateral talent acquisition across IC3 to Principal & Architect levels',
      'Proprietary candidate intelligence network with pre-validated compensation benchmarks',
      'Dual-vetted technical dossiers including verified code repositories & project track records',
      'Offer decline mitigation with continuous counter-offer buffering',
      'Standard 90-day unconditional candidate replacement guarantee on all placements'
    ],
    process: [
      { step: '01', title: 'Requisition Calibration', desc: 'Deep-dive with hiring managers to define tech stack, deliverables, and scorecards.' },
      { step: '02', title: 'Targeted Sourcing', desc: 'Direct outreach into passive talent pools across tier-1 product organizations.' },
      { step: '03', title: 'Technical Gatekeeper Screen', desc: 'Hands-on code evaluation or architectural screening prior to submission.' },
      { step: '04', title: 'Shortlist Presentation', desc: 'Presentation of 3-5 pre-screened candidate dossiers within 72 hours.' },
      { step: '05', title: 'Offer Closure & Joining', desc: 'Pre-boarding engagement ensuring zero-day dropouts and 94%+ joining predictability.' }
    ],
    roles: [
      { title: 'Staff / Principal Software Engineer', exp: '8-14 Yrs', turnaround: '72 Hrs Shortlist', skills: ['Java / Go / Rust', 'Distributed Systems', 'Microservices Architecture'] },
      { title: 'Lead Full-Stack Architect', exp: '7-12 Yrs', turnaround: '48 Hrs Shortlist', skills: ['React / Next.js', 'Node.js / TypeScript', 'GraphQL', 'AWS'] },
      { title: 'Senior Cloud & DevOps Engineer', exp: '5-10 Yrs', turnaround: '72 Hrs Shortlist', skills: ['Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Python'] },
      { title: 'Engineering Director / VP Tech', exp: '12-20 Yrs', turnaround: '7 Days Shortlist', skills: ['Org Scaling', 'Technical Roadmap', 'Budgeting & Mentorship'] }
    ],
    sla: 'First calibrated shortlist delivered in 72 hours; average role closure in 18 calendar days.',
    pricing: 'Success-based commercial terms with 90-day replacement safeguard.',
    metrics: [
      { value: '94.8%', label: 'Offer Acceptance Rate' },
      { value: '18 Days', label: 'Average Time-to-Fill' },
      { value: '96.2%', label: '1-Year Candidate Retention' },
      { value: '72 Hrs', label: 'First Shortlist SLA' }
    ],
    faqs: [
      { q: 'How does your 90-day replacement guarantee work?', a: 'If a placed candidate resigns or is terminated for cause within 90 days, we assign our rapid-response sourcing squad to fill the position at no additional fee.' },
      { q: 'How do you verify candidate skills before submission?', a: 'Our in-house technical evaluators conduct live coding evaluations and system architecture reviews tailored to your requisition.' }
    ]
  },
  'contract-staffing': {
    title: 'Contract Staffing & Agile Staff Augmentation',
    tagline: 'Rapid deployment of pre-vetted senior engineering contractors on flexible terms.',
    badge: 'FLEXIBLE CAPACITY & PAYROLL COMPLIANCE',
    problem: 'Lengthy hiring cycles delay critical product sprints, while rigid full-time headcounts restrict project-based agility.',
    audience: 'Engineering leadership needing immediate surge capacity, project migration teams, or specialized contract expertise.',
    approach: 'Pre-vetted active contractor bench ready for deployment within 5 business days with automated statutory compliance and payroll handling.',
    capabilities: [
      'Rapid deployment within 5-7 business days from pre-vetted active contractor bench',
      'Full statutory compliance: PF, ESI, professional tax, and GST payroll governance',
      'Flexible engagement models: T&M (Time & Material), Monthly Retainer, or SOW milestone pods',
      'Contract-to-hire transition pathways without conversion penalty fees after 6 months',
      'Dedicated delivery manager oversight for timesheet alignment and SLA tracking'
    ],
    process: [
      { step: '01', title: 'Sprint SOW Definition', desc: 'Define tech stack requirements, project duration (3-12 months), and milestone deliverables.' },
      { step: '02', title: 'Instant Bench Matching', desc: 'Extract immediately available contractors from our pre-screened talent bench.' },
      { step: '03', title: 'Client Technical Interview', desc: 'Single-round evaluation and verification with your engineering lead.' },
      { step: '04', title: 'Day-1 Remote / Onsite Onboarding', desc: 'Hardware provisioning, NDA execution, and system access clearance managed smoothly.' }
    ],
    roles: [
      { title: 'Senior Contract Full-Stack Developer', exp: '5-9 Yrs', turnaround: '5 Days Deployment', skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'] },
      { title: 'Agile DevOps & SRE Specialist', exp: '6-11 Yrs', turnaround: '5 Days Deployment', skills: ['AWS / GCP', 'Kubernetes', 'Helm', 'Ansible'] },
      { title: 'QA Automation Contract Specialist', exp: '4-8 Yrs', turnaround: '3 Days Deployment', skills: ['Selenium', 'Cypress', 'Playwright', 'Java / Python'] },
      { title: 'Data Pipeline Engineering Contractor', exp: '5-10 Yrs', turnaround: '5 Days Deployment', skills: ['PySpark', 'Snowflake', 'Kafka', 'Airflow'] }
    ],
    sla: 'Deployment in 5-7 business days; 24-hour contractor swap SLA if deliverables fall short.',
    pricing: 'Transparent monthly cost-plus rate cards with itemized billable hours and zero hidden overheads.',
    metrics: [
      { value: '5 Days', label: 'Average Deployment SLA' },
      { value: '99.1%', label: 'Statutory Compliance Score' },
      { value: '88%', label: 'Contract-to-Hire Conversion' },
      { value: '350+', label: 'Active Contractors Deployed' }
    ],
    faqs: [
      { q: 'What happens if a contractor does not fit our team?', a: 'We offer a 2-week risk-free trial period and a 24-hour replacement SLA for contract resources.' },
      { q: 'Can we convert contract staff to full-time employees?', a: 'Yes, after 6 months of contract tenure, clients can convert contractors to full-time at zero conversion penalty.' }
    ]
  },
  'gcc-hiring': {
    title: 'Turnkey GCC Engineering Pods',
    tagline: 'End-to-end talent infrastructure for Global Capability Centers (GCC) in India.',
    badge: 'OFFSHORE R&D BOT MODEL',
    problem: 'Multinational enterprises entering India struggle with zero local employer brand, compliance hurdles, and slow hiring of 50-200 engineers.',
    audience: 'Global CIOs, CTOs, and GCC Site Leaders establishing or expanding high-performance technology hubs in Bengaluru, Hyderabad, or Pune.',
    approach: 'Complete Build-Operate-Transfer (BOT) or Turnkey Pod model delivering core architecture, leadership, and operational scale in 75 days.',
    capabilities: [
      'Turnkey staffing of complete agile pods: 1 Tech Lead, 3 Senior Devs, 1 QA, 1 DevOps Specialist',
      'Market compensation benchmarks & location strategy advisory across Tier-1 India tech hubs',
      'Employer brand amplification in India tech community before official center launch',
      'Comprehensive workspace, hardware procurement, and regulatory incubation support',
      'Dedicated GCC program management office (PMO) with live burn-down velocity reports'
    ],
    process: [
      { step: '01', title: 'Charter & Pod Blueprinting', desc: 'Design organizational topology, grade matrices, and team budget envelopes.' },
      { step: '02', title: 'Anchor Leadership Hiring', desc: 'Recruit GCC Site Leaders, Engineering Directors, and Principal System Architects.' },
      { step: '03', title: 'Pod Wave Sourcing', desc: 'Simultaneous hiring waves deploying 20-50 verified engineers per month.' },
      { step: '04', title: 'Operational Alignment', desc: 'Syncing agile workflows, IP security protocols, and global headquarters culture.' }
    ],
    roles: [
      { title: 'GCC Site Managing Director', exp: '15-22 Yrs', turnaround: '21 Days Shortlist', skills: ['Center Operations', 'GCC Incubation', 'P&L Ownership'] },
      { title: 'Turnkey Engineering Pod Lead', exp: '9-14 Yrs', turnaround: '10 Days Pod Live', skills: ['Architecture', 'Agile Delivery', 'Tech Governance'] },
      { title: 'GCC Senior Backend Developer', exp: '5-9 Yrs', turnaround: '7 Days Deployment', skills: ['Java / Spring Boot', 'Microservices', 'Kafka'] },
      { title: 'Offshore Security & DevOps Lead', exp: '7-12 Yrs', turnaround: '7 Days Deployment', skills: ['SOC-2 Compliance', 'Cloud Security', 'Kubernetes'] }
    ],
    sla: 'First operational pod live within 30 days; full 50-engineer center staffed in 90 days.',
    pricing: 'Milestone-based program retainer + cost-plus headcount model with performance incentives.',
    metrics: [
      { value: '62%', label: 'Cost Arbitrage vs US/EU HQ' },
      { value: '30 Days', label: 'First Operational Pod SLA' },
      { value: '14+', label: 'GCC Centers Established' },
      { value: '97.4%', label: 'Leadership Retention' }
    ],
    faqs: [
      { q: 'Can Nexa Talent IT Solutions manage legal entity setup for our India GCC?', a: 'We partner with corporate law and tax advisory firms to provide turnkey entity setup alongside talent hiring.' },
      { q: 'What is the typical cost arbitrage for an India GCC?', a: 'Clients typically achieve 60-70% total operational cost reduction compared to equivalent US/European engineering teams.' }
    ]
  },
  'executive-search': {
    title: 'Executive & Leadership Search',
    tagline: 'Confidential, retained search for CTOs, VPs of Engineering, and GCC Site Directors.',
    badge: 'CONFIDENTIAL C-SUITE MANDATE',
    problem: 'Standard recruiters lack the credibility and strategic depth to access passive C-suite and VP-level technology leaders.',
    audience: 'Boards of Directors, Venture Capital / Private Equity firms, and Enterprise CEOs seeking transformative technology leadership.',
    approach: 'Partner-led executive search with detailed market mapping, 360-degree leadership vetting, and executive compensation structuring.',
    capabilities: [
      'Discreet, confidential market mapping across top-tier product and technology enterprises',
      'Partner-only search execution — no delegation to junior recruitment associates',
      '360-degree leadership references covering board members, peers, and direct reports',
      'Complex executive compensation structuring: ESOPs, RSUs, retention bonuses, and buyouts',
      '12-month executive onboarding advisory ensuring strategic alignment and retention'
    ],
    process: [
      { step: '01', title: 'Confidential Briefing', desc: 'Aligning with Board and CEO on strategic mandate, company trajectory, and leadership DNA.' },
      { step: '02', title: 'Exhaustive Market Mapping', desc: 'Mapping the top 100 leaders across relevant industry domains and regional hubs.' },
      { step: '03', title: 'Partner Vetting', desc: 'In-depth strategic interviews evaluating business acumen, engineering vision, and cultural impact.' },
      { step: '04', title: 'Shortlist Presentation', desc: 'Presenting comprehensive 360-degree profiles and strategic work samples.' },
      { step: '05', title: 'Negotiation & Integration', desc: 'Navigating long notice periods, buyouts, and equity structuring.' }
    ],
    roles: [
      { title: 'Chief Technology Officer (CTO)', exp: '16-25 Yrs', turnaround: '21 Days Shortlist', skills: ['Global Tech Strategy', 'Scale-up Architecture', 'Board Advisory'] },
      { title: 'Vice President of Engineering', exp: '14-20 Yrs', turnaround: '14 Days Shortlist', skills: ['Org Scale 200+', 'Engineering Delivery', 'Budgeting'] },
      { title: 'Chief Information Security Officer (CISO)', exp: '12-18 Yrs', turnaround: '14 Days Shortlist', skills: ['Enterprise Security', 'SOC2 / ISO27001', 'Zero Trust'] },
      { title: 'Head of Infrastructure & SRE', exp: '12-18 Yrs', turnaround: '14 Days Shortlist', skills: ['Cloud Infra', 'Multi-Region High Availability', 'FinOps'] }
    ],
    sla: 'Comprehensive leadership shortlist within 21 days; final closure within 60 days.',
    pricing: 'Retained executive search model with milestone triggers and 1-year replacement warranty.',
    metrics: [
      { value: '98%', label: 'Search Completion Rate' },
      { value: '21 Days', label: 'Leadership Shortlist SLA' },
      { value: '98.5%', label: '2-Year CXO Retention' },
      { value: '180+', label: 'Executive Leaders Placed' }
    ],
    faqs: [
      { q: 'Is executive search conducted confidentially?', a: 'Yes. All market mapping and candidate approaches are protected under strict non-disclosure agreements.' }
    ]
  },
  'recruitment-process-support': {
    title: 'RPO & Embedded TA Support',
    tagline: 'Dedicated talent acquisition teams scaling your internal hiring capacity.',
    badge: 'EXTENDED RECRUITMENT CAPACITY',
    problem: 'Internal HR teams get overwhelmed during rapid hiring surges, leading to high agency spend and chaotic candidate experiences.',
    audience: 'Fast-scaling tech companies hiring 50+ roles annually looking to optimize recruitment overheads.',
    approach: 'Co-branded embedded recruiters, AI candidate matching tools, and optimized applicant workflows inside your ATS.',
    capabilities: [
      'Dedicated on-site or remote recruiters integrated directly into your Slack and ATS',
      'End-to-end candidate lifecycle: sourcing, screening, scheduling, and onboarding',
      'ATS workflow configuration (Greenhouse, Lever, Workday) and pipeline analytics',
      'Employer brand advocacy in the candidate market under your company banner',
      'Significant reduction in cost-per-hire (typically 40-50% savings vs contingent agencies)'
    ],
    process: [
      { step: '01', title: 'Talent Audit & ATS Sync', desc: 'Review historical pipelines, time-to-hire metrics, and integrate with your ATS.' },
      { step: '02', title: 'Deploy Dedicated Pod', desc: 'Embed certified technical recruiters and sourcers dedicated exclusively to your brand.' },
      { step: '03', title: 'Pipeline Ramp-up', desc: 'Establish continuous weekly interview slates and automated candidate tracking.' }
    ],
    roles: [
      { title: 'Embedded Senior Tech Recruiter', exp: '5-9 Yrs', turnaround: '10 Days Onboarding', skills: ['ATS Mastery', 'Senior Sourcing', 'Interview Calibration'] },
      { title: 'Technical Sourcing Specialist', exp: '3-6 Yrs', turnaround: '7 Days Onboarding', skills: ['GitHub / LinkedIn Mining', 'Passive Talent Engagement'] },
      { title: 'Candidate Experience Coordinator', exp: '2-5 Yrs', turnaround: '5 Days Onboarding', skills: ['Schedule Optimization', 'Candidate Ops', 'ATS Admin'] },
      { title: 'RPO Account Delivery Director', exp: '10-15 Yrs', turnaround: '10 Days Onboarding', skills: ['SLA Governance', 'Cost-per-hire Optimization', 'Reporting'] }
    ],
    sla: 'Full RPO pod embedded and active in 10 business days; 35% time-to-fill reduction guaranteed.',
    pricing: 'Predictable monthly management retainer plus low flat success fee per closed role.',
    metrics: [
      { value: '45%', label: 'Cost-Per-Hire Reduction' },
      { value: '38%', label: 'Faster Time-to-Fill' },
      { value: '91%', label: 'Candidate CSAT Score' },
      { value: '10 Days', label: 'RPO Pod Deployment' }
    ],
    faqs: [
      { q: 'Will the recruiters represent our brand or Nexa Talent IT Solutions?', a: 'In an RPO model, our embedded recruiters represent your company exclusively using your email domain and ATS.' }
    ]
  },
  'bulk-hiring': {
    title: 'Bulk & Volume Sourcing Drives',
    tagline: 'Structured hiring drives deploying 20 to 100+ engineers with automated screening.',
    badge: 'RAPID SCALE CAMPAIGNS',
    problem: 'Hiring dozens of software engineers for expansion strains internal interviewers and leads to inconsistent quality.',
    audience: 'IT services leaders, fintech platforms, and customer engineering organizations scaling large technical workforces.',
    approach: 'Structured sourcing drives, weekend hiring sprints, and centralized proctored coding assessments.',
    capabilities: [
      'Weekend mega-hiring drives processing 100+ pre-assessed candidates in 48 hours',
      'Customized automated proctored coding assessments on HackerRank/Codility',
      'Logistics and offer coordination managed from screening to joining day',
      'Standardized behavioral and technical scorecards ensuring uniform talent bar',
      'Joining assurance programs to counter multiple simultaneous offers'
    ],
    process: [
      { step: '01', title: 'Assessment Calibration', desc: 'Design automated coding challenges calibrated to your exact junior-to-mid tier requirements.' },
      { step: '02', title: 'Mega Sourcing Drive', desc: 'Engage 1,000+ candidates across regional tech institutions and lateral talent pools.' },
      { step: '03', title: 'Weekend Super-Day', desc: 'Structured parallel interview panels closing 20-50 offers in a single weekend.' }
    ],
    roles: [
      { title: 'Lateral Software Engineer (SDE II)', exp: '3-6 Yrs', turnaround: 'Weekend Drive', skills: ['Java / Python', 'REST APIs', 'SQL'] },
      { title: 'Frontend Developer (React)', exp: '2-5 Yrs', turnaround: 'Weekend Drive', skills: ['React', 'JavaScript', 'CSS/Tailwind'] },
      { title: 'QA Automation Engineer', exp: '3-6 Yrs', turnaround: 'Weekend Drive', skills: ['Selenium', 'Java', 'API Testing'] },
      { title: 'Cloud Operations Engineer', exp: '2-5 Yrs', turnaround: 'Weekend Drive', skills: ['AWS Basics', 'Linux', 'Shell Scripting'] }
    ],
    sla: '20-50 validated offers released in under 3 weeks with 85%+ joining ratio.',
    pricing: 'Volume-tiered fee structures with bulk rate economics and joining-linked fee schedules.',
    metrics: [
      { value: '85%+', label: 'Batch Joining Ratio' },
      { value: '48 Hrs', label: 'Weekend Drive Closure' },
      { value: '10,000+', label: 'Annual Volume Hires' },
      { value: '35%', label: 'Lower Cost vs Single Hires' }
    ],
    faqs: [
      { q: 'How do you prevent offer dropouts in volume hiring?', a: 'We implement daily pre-joining candidate touchpoints, engagement sessions, and automated backup pipelining.' }
    ]
  },
  'niche-specialist': {
    title: 'Niche & Specialist Tech Search',
    tagline: 'Targeted outreach and validation for hard-to-find, rare technical skill sets.',
    badge: 'RARE SKILL SOURCING',
    problem: 'Hard-to-find skills (Low-Latency C++, AI/LLM Kernel Engineers, FPGA, eBPF) are rarely available on public job boards.',
    audience: 'Hedge funds, AI labs, semiconductor firms, and deep-tech platforms.',
    approach: 'Proactive talent mapping and direct engagement with passive specialists, backed by hands-on technical validation.',
    capabilities: [
      'Deep passive talent mapping across specialized GitHub, arXiv, and developer communities',
      'Technical assessment by domain experts before client presentation',
      'Market rate intelligence for scarce skills to prevent misaligned offers',
      'Confidential outreach preserving client discretion in sensitive markets'
    ],
    process: [
      { step: '01', title: 'Niche Mapping', desc: 'Identify every qualified specialist within target geographies.' },
      { step: '02', title: 'Direct Headhunting', desc: 'Discreet, personalized engagement highlighting mandate impact.' },
      { step: '03', title: 'Technical Screen', desc: 'Domain expert review of code quality and architectural depth.' }
    ],
    roles: [
      { title: 'Low-Latency C++ HFT Systems Lead', exp: '6-12 Yrs', turnaround: '5 Days Shortlist', skills: ['C++20/23', 'Kernel Bypass', 'Lock-free Queues'] },
      { title: 'Generative AI Kernel & LLM Specialist', exp: '5-10 Yrs', turnaround: '5 Days Shortlist', skills: ['PyTorch', 'vLLM', 'CUDA', 'FlashAttention'] },
      { title: 'FPGA Hardware Acceleration Engineer', exp: '6-12 Yrs', turnaround: '7 Days Shortlist', skills: ['Verilog / VHDL', 'AMD Xilinx', 'Tick-to-trade'] },
      { title: 'Kernel Security & eBPF Architect', exp: '7-13 Yrs', turnaround: '7 Days Shortlist', skills: ['eBPF', 'C / Rust', 'Linux Kernel', 'Zero Trust'] }
    ],
    sla: 'Shortlist of 3 verified specialists within 5 business days.',
    pricing: 'Retained or milestone-based specialist fee structure.',
    metrics: [
      { value: '92%', label: 'Specialist Match Rate' },
      { value: '5 Days', label: 'Shortlist SLA' },
      { value: '95%', label: 'Offer Acceptance' },
      { value: '100%', label: 'Verified Code Evaluation' }
    ],
    faqs: [
      { q: 'What domain areas qualify as niche specialist search?', a: 'Low-latency C++, FPGA, AI/LLM internal frameworks, kernel eBPF, Rust distributed systems, and quantum/VLSI engineering.' }
    ]
  },
  'talent-advisory': {
    title: 'Talent Advisory & Compensation Benchmarking',
    tagline: 'Data-driven market intelligence, salary benchmarking, and organizational design.',
    badge: 'STRATEGIC TALENT ADVISORY',
    problem: 'Engineering leaders lack ground-truth compensation data and realistic hiring feasibility metrics before budgeting new expansion initiatives.',
    audience: 'CEOs, CFOs, CHROs, and Investors planning new engineering centers or restructuring legacy technology units.',
    approach: 'Data-driven talent intelligence reports based on live offer records, attrition trends, and regional tech cluster analytics.',
    capabilities: [
      'Comprehensive compensation benchmarks across Tier-1/2 tech hubs in India',
      'Tech stack availability analysis: identifying highest density locations for specific engineering skills',
      'Competitor talent mapping: attrition flows and recruitment poaching analysis',
      'Organizational leveling frameworks aligning US/EU grades with India tech brackets',
      'Diversity and inclusion recruitment blueprints'
    ],
    process: [
      { step: '01', title: 'Scope Definition', desc: 'Identify target roles, locations, and competitor benchmark groups.' },
      { step: '02', title: 'Data Aggregation & Analysis', desc: 'Mine our database of real-world offer letters and compensation structures.' },
      { step: '03', title: 'Executive Report Delivery', desc: 'Present actionable insights with clear budget models and hiring feasibility matrices.' }
    ],
    roles: [
      { title: 'India Compensation & Leveling Study', exp: 'Custom Scope', turnaround: '10 Days', skills: ['Salary Bands', 'Equity Benchmarks', 'Grade Leveling'] },
      { title: 'GCC Location Feasibility Analysis', exp: 'Custom Scope', turnaround: '10 Days', skills: ['Bengaluru vs Hyd vs Pune', 'Talent Density', 'Real Estate'] },
      { title: 'Competitor Attrition & Intelligence', exp: 'Custom Scope', turnaround: '7 Days', skills: ['Poaching Radar', 'Notice Period Trends', 'Counter-offers'] },
      { title: 'Engineering Org Topology Blueprint', exp: 'Custom Scope', turnaround: '10 Days', skills: ['Pod Ratios', 'Span of Control', 'Career Pathing'] }
    ],
    sla: 'Comprehensive custom talent advisory report delivered in 10 business days.',
    pricing: 'Fixed project advisory fee or bundled into enterprise recruitment agreements.',
    metrics: [
      { value: '30,000+', label: 'Offer Data Points Analyzed' },
      { value: '98%', label: 'Compensation Accuracy' },
      { value: '10 Days', label: 'Report Turnaround' },
      { value: '40+', label: 'Advisory Engagements' }
    ],
    faqs: [
      { q: 'Where do you source your salary benchmark data?', a: 'Our data comes from verified offer letters, candidate compensation disclosures, and real-time placement records updated weekly.' }
    ]
  }
};

const SLUG_ALIASES: Record<string, string> = {
  'permanent': 'permanent-hiring',
  'direct-hire': 'permanent-hiring',
  'contract': 'contract-staffing',
  'staff-augmentation': 'contract-staffing',
  'augmentation': 'contract-staffing',
  'gcc-pods': 'gcc-hiring',
  'turnkey-gcc': 'gcc-hiring',
  'executive': 'executive-search',
  'leadership-search': 'executive-search',
  'rpo': 'recruitment-process-support',
  'embedded-ta': 'recruitment-process-support',
  'volume-hiring': 'bulk-hiring',
  'bulk-sourcing': 'bulk-hiring',
  'niche-tech': 'niche-specialist',
  'specialist-search': 'niche-specialist',
  'advisory': 'talent-advisory'
};

export function SolutionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const targetKey = slug ? (SOLUTIONS_DETAIL_MAP[slug] ? slug : SLUG_ALIASES[slug]) : undefined;
  const data = targetKey ? SOLUTIONS_DETAIL_MAP[targetKey] : undefined;

  useEffect(() => {
    let raf = 0;
    const refresh = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    };
    raf = requestAnimationFrame(() => {
      refresh();
      window.addEventListener('load', refresh);
      const t = window.setTimeout(refresh, 500);
      return () => window.clearTimeout(t);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, [slug]);

  if (!data) {
    return <Navigate to="/solutions" replace />;
  }

  const displayTitle = stripNumberPrefix(data.title);

  return (
    <div className="bg-white min-h-screen text-black font-sans relative overflow-x-clip">
      {/* SEO & Meta Tags */}
      <SeoHead
        title={`${displayTitle} | NexaTalent IT Solutions`}
        description={`${data.tagline} ${data.approach} SLA: ${data.sla}`}
        keywords={`${displayTitle}, ${data.badge}, NexaTalent IT Solutions, IT staffing India`}
        canonical={`/solutions/${slug}`}
      />

      {/* Site Header */}
      <SiteNavbar />

      {/* ============================================================================
       * HERO / BANNER — premium gradient, breadcrumb, badge, trust row + clear CTAs
       * ============================================================================ */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white pt-28 pb-14 px-6 lg:px-16">
        <div className="relative max-w-6xl mx-auto space-y-6">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-black">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={14} className="text-black" aria-hidden />
            <Link to="/solutions" className="hover:text-black transition-colors">Solutions</Link>
            <ChevronRight size={14} className="text-black" aria-hidden />
            <span className="text-black font-bold">{displayTitle}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.14em] shadow-sm"
          >
            <Sparkles size={14} className="text-white" aria-hidden />
            <span>{data.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-black tracking-tight leading-[1.08] max-w-4xl"
          >
            {displayTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-base sm:text-xl text-black max-w-3xl font-normal leading-relaxed"
          >
            {data.tagline}
          </motion.p>

          {/* trust row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-black">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-black" aria-hidden /> NDA-protected delivery</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} className="text-black" aria-hidden /> {data.sla.split(';')[0]}</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-black" aria-hidden /> 90-day replacement cover</span>
          </div>

          {/* Action CTAs — clear English labels */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <Link
              to="/employers"
              className="group inline-flex min-h-[52px] items-center gap-2 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm px-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <span>Get My Talent Shortlist</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-[52px] items-center rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-sm px-8 border border-neutral-300 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-black"
            >
              Talk to a Hiring Expert
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ============================================================================
       * SLA METRICS TELEMETRY STRIP (CLEAN WHITE BG)
       * ============================================================================ */}
      <section className="py-8 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {data.metrics.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-black">{m.value}</div>
              <div className="text-xs font-semibold text-black mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================================
       * SECTION 2: PROBLEM vs APPROACH vs TARGET AUDIENCE CARDS
       * ============================================================================ */}
      <section className="py-16 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-black inline-block">
                THE CHALLENGE
              </span>
              <h3 className="text-lg font-extrabold text-black">Industry Problem</h3>
              <p className="text-xs text-black leading-relaxed font-normal">
                {data.problem}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-black space-y-3 shadow-xs">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-black inline-block">
                NEXA TALENT METHOD
              </span>
              <h3 className="text-lg font-extrabold text-black">Our Strategic Approach</h3>
              <p className="text-xs text-black leading-relaxed font-normal">
                {data.approach}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-neutral-300 inline-block">
                TARGET PROFILE
              </span>
              <h3 className="text-lg font-extrabold text-black">Ideal Client Profile</h3>
              <p className="text-xs text-black leading-relaxed font-normal">
                {data.audience}
              </p>
            </div>
          </div>

          {/* Solution Capabilities Checklist */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black">
                DELIVERABLE SPECIFICATIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                Solution Capabilities & Core Deliverables
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-black leading-relaxed">
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* NEW SECTION 1: TARGET ROLES & SOURCING PROFILES MATRIX */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black">
                TALENT COVERAGE MATRIX
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                Typical Engineering Roles & Sourcing Profiles
              </h2>
              <p className="text-xs sm:text-sm text-black">
                Pre-calibrated candidate pools actively sourced under this delivery model.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.roles.map((r, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 flex flex-col justify-between shadow-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-black bg-white px-2.5 py-0.5 rounded-full border border-black">
                        {r.exp}
                      </span>
                      <span className="text-[10px] font-bold text-black flex items-center gap-1">
                        <Clock size={12} />
                        {r.turnaround}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-black">{r.title}</h4>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-black block">Key Skill Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {r.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-neutral-200 text-black">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Stage Execution Process Flow */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black">
                DISCIPLINED EXECUTION
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                Step-by-Step Delivery Workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {data.process.map((p) => (
                <div key={p.step} className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-2 relative shadow-xs">
                  <span className="text-2xl font-extrabold text-black block">{p.step}</span>
                  <h4 className="font-extrabold text-sm text-black">{p.title}</h4>
                  <p className="text-xs text-black leading-relaxed font-normal">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NEW SECTION 2: COMPARATIVE ADVANTAGE MATRIX */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-black uppercase tracking-wider bg-white px-3.5 py-1.5 rounded-full border border-black shadow-xs">
                WHY NEXA TALENT IT SOLUTIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                Institutional Advantage & Service Benchmark
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-base sm:text-[15px]">
                <thead>
                  <tr className="border-b-2 border-neutral-300 text-black font-extrabold">
                    <th className="py-4 px-4 font-black">Evaluation Metric</th>
                    <th className="py-4 px-4 text-black font-black bg-neutral-100 rounded-t-xl border-x border-neutral-300">
                      Nexa Talent IT Solutions
                    </th>
                    <th className="py-4 px-4 text-neutral-600 font-bold">Traditional Agencies</th>
                    <th className="py-4 px-4 text-neutral-600 font-bold">In-House TA Only</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-black">
                  <tr>
                    <td className="py-4 px-4 font-bold text-black">Average Time-to-Fill</td>
                    <td className="py-4 px-4 font-black text-black bg-neutral-100/80 border-x border-neutral-300">
                      5 - 18 Days
                    </td>
                    <td className="py-4 px-4 text-neutral-700">45 - 90 Days</td>
                    <td className="py-4 px-4 text-neutral-700">60+ Days</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-black">Technical Pre-Screening</td>
                    <td className="py-4 px-4 font-black text-black bg-neutral-100/80 border-x border-neutral-300">
                      Practitioner Code Vetting
                    </td>
                    <td className="py-4 px-4 text-neutral-700">Keyword Resume Matching</td>
                    <td className="py-4 px-4 text-neutral-700">General Recruiter Screen</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-black">Candidate Replacement Guarantee</td>
                    <td className="py-4 px-4 font-black text-black bg-neutral-100/80 border-x border-neutral-300">
                      90-Day Unconditional
                    </td>
                    <td className="py-4 px-4 text-neutral-700">30 Days or None</td>
                    <td className="py-4 px-4 text-neutral-700">N/A (Sunk Cost)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-black">Statutory & Labor Compliance</td>
                    <td className="py-4 px-4 font-black text-black bg-neutral-100/80 border-x border-neutral-300">
                      100% PF, ESI, GST Governed
                    </td>
                    <td className="py-4 px-4 text-neutral-700">Varies / Partial</td>
                    <td className="py-4 px-4 text-neutral-700">Internal HR Overhead</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-black">Cost Transparency</td>
                    <td className="py-4 px-4 font-black text-black bg-neutral-100/80 border-x border-neutral-300 rounded-b-xl">
                      Cost-Plus Clear Billing
                    </td>
                    <td className="py-4 px-4 text-neutral-700">Markups (30-50%)</td>
                    <td className="py-4 px-4 text-neutral-700">Fixed Overhead</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* NEW SECTION 3: ENTERPRISE RISK GOVERNANCE & COMPLIANCE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-extrabold text-base text-black">90-Day Replacement Safeguard</h4>
              <p className="text-xs text-black leading-relaxed font-normal">
                Complete replacement warranty backed by dedicated rapid-response sourcing squads for any candidate attrition within 90 days.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <h4 className="font-extrabold text-base text-black">100% IP Escrow & NDA Protection</h4>
              <p className="text-xs text-black leading-relaxed font-normal">
                Strict non-disclosure protocols and legal assignment ensuring all code, IP, and proprietary assets belong 100% to your enterprise.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <h4 className="font-extrabold text-base text-black">Zero Candidate Fee Integrity</h4>
              <p className="text-xs text-black leading-relaxed font-normal">
                Nexa Talent IT Solutions operates under a strict zero-candidate-fee code of ethics. Candidates are never charged recruitment fees.
              </p>
            </div>
          </div>

          {/* SLA & Commercial Terms Card */}
          <div className="p-8 rounded-3xl bg-white border border-black grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                <Clock size={16} />
                <span>COMMITTED SLA</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                {data.sla}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>COMMERCIAL STRUCTURE</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                {data.pricing}
              </p>
            </div>

            <div className="flex justify-start md:justify-end">
              <Link
                to="/employers"
                className="px-6 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Get Pricing & Proposal</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================================
       * LIGHT MOTION ANIMATED SECTIONS (CLEAN LIGHT THEME)
       * ============================================================================ */}
      <LightServiceTierComparison />
      <LightTwoColumnPinnedStory
        eyebrow={`${displayTitle} — Vetting Methodology`}
        title={`How we vet ${displayTitle} talent`}
        sub={`Our ${data.process.length}-phase delivery workflow for ${displayTitle.toLowerCase()} — every stage measured against ${data.metrics[0].label.toLowerCase()}.`}
        stages={solutionStages(data)}
      />
      <OneSideStickyFeatureStack
        eyebrow={`${displayTitle} — Evaluation Engine`}
        title={`Sourcing Profiles & Evaluation Console`}
        sub={`Live sourcing profiles actively maintained under this delivery model — ${data.roles.length} role tracks with ${data.roles[0]?.turnaround.toLowerCase() || 'rapid'} first shortlists.`}
        cards={solutionRubrics(data)}
      />
      <LightFAQAccordion
        eyebrow={`${displayTitle} — Answers`}
        title={`FAQs on ${displayTitle}`}
        sub={data.tagline}
        items={solutionFaqs(data)}
      />
      <LightFinalCTAExpansion
        pill={data.badge}
        title={`Hire for ${displayTitle} — starting this week`}
        headline={`Calibrated ${displayTitle} profiles in days, not months`}
        sub={`${data.tagline} ${data.sla}`}
      />

      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
}
