import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Building2, 
  Quote, 
  ChevronRight
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { 
  LightCaseStudyMaster, 
  LightCaseStudyResultSplit, 
  LightMetricsCounter, 
  LightTwoColumnPinnedStory,
  LightFinalCTAExpansion
} from '../components/light-motion';

const CASE_STUDIES_DB: Record<string, {
  title: string;
  client: string;
  industry: string;
  badge: string;
  headlineMetric: string;
  headlineMetricLabel: string;
  context: string;
  challenge: string;
  requirement: string;
  approach: string;
  execution: { phase: string; title: string; desc: string }[];
  results: { metric: string; label: string; desc: string }[];
  quote: { text: string; author: string; title: string; company: string };
}> = {
  'fintech': {
    title: 'Fintech HFT Platform: Scaling Ultra-Low Latency Core Pod in 21 Days',
    client: 'Leading Tier-1 Quant Trading & Execution Firm',
    industry: 'BFSI & FinTech',
    badge: 'Mission-Critical Direct Sourcing',
    headlineMetric: '21 Days',
    headlineMetricLabel: 'Complete 8-Engineer Core Pod Deployed',
    context: 'The client was migrating from legacy monolithic exchange gateways to a distributed FPGA and C++20 microsecond matching engine in Mumbai and Singapore.',
    challenge: 'Previous recruitment partners spent 4 months presenting candidates with generic Java/C# backgrounds who consistently failed kernel bypass (Solarflare OpenOnload) and cache-locality design interviews.',
    requirement: '8 Elite Systems Engineers (Staff C++ Specialists, Low-Latency Network Architects, FPGA Acceleration Engineers) with immediate or 30-day notice periods.',
    approach: 'NexaTalent IT Solutions deployed its specialized Quant & HFT practice pod, executing targeted algorithmic benchmarks and concurrency stress-tests before presenting candidates to the CTO.',
    execution: [
      { phase: 'Week 1', title: 'Calibration & Sandboxing', desc: 'Reverse-engineered the client’s p99 latency evaluation questions into a live memory-alignment assessment.' },
      { phase: 'Week 2', title: 'Targeted Passive Sourcing', desc: 'Engaged 32 passive systems engineers across telecom infrastructure and proprietary trading desks.' },
      { phase: 'Week 3', title: 'Offer Closure & Buyout Management', desc: 'Negotiated complex notice period buyouts and sign-on incentives for all 8 accepted offers.' }
    ],
    results: [
      { metric: '100%', label: 'Offer-to-Joiner Ratio', desc: '8 offers released, 8 engineers joined with zero dropouts.' },
      { metric: '14 Days', label: 'First Shortlist Turnaround', desc: 'Calibrated candidate dossiers delivered within 2 weeks of mandate kickoff.' },
      { metric: '98.5%', label: 'Technical Pass Rate', desc: '11 candidates interviewed by client, 8 cleared final bar.' },
      { metric: '₹1.8 Cr', label: 'Saved in Agency Fragmentation', desc: 'Consolidated under single master service agreement with performance SLA.' }
    ],
    quote: {
      text: 'NexaTalent IT Solutions was the first recruitment partner who genuinely understood cache hierarchies and lock-free concurrency. Their vetting saved our engineering leadership over 60 hours of wasted interview loops.',
      author: 'Sameer Kulkarni',
      title: 'Chief Technology Officer',
      company: 'Apex Quant Execution Labs'
    }
  },
  'gcc': {
    title: 'Fortune 100 HealthTech: Turnkey Setup of 60-Engineer India GCC',
    client: 'Global Medical Devices & Software Conglomerate',
    industry: 'Healthcare & Life Sciences',
    badge: 'Turnkey GCC Establishment',
    headlineMetric: '60 Hires',
    headlineMetricLabel: 'Full Engineering Pods Operational in 75 Days',
    context: 'A US healthcare enterprise required a premier Indian technology center to own FDA-compliant cloud PACS imaging and clinical AI platforms.',
    challenge: 'Zero existing India legal entity, no local employer brand recognition, and a strict 90-day board mandate to have functional software development pods active.',
    requirement: '1 GCC Managing Director, 4 Engineering Directors, 40 Full-Stack & Cloud Engineers, 10 Medical QA/SDETs, and 5 Cloud DevOps leads.',
    approach: 'Turnkey Build-Operate-Transfer (BOT) staffing model. NexaTalent IT Solutions established co-branded recruitment hackathons and deployed dedicated on-site talent squads.',
    execution: [
      { phase: 'Days 1-15', title: 'Entity Setup & Anchor Leadership', desc: 'Partnered with legal advisory for STPI/SEZ clearance while hiring the GCC Site Director.' },
      { phase: 'Days 16-45', title: 'Simultaneous Sourcing Sprints', desc: 'Executed 3 weekend evaluation drives screening 400+ medical informatics engineers.' },
      { phase: 'Days 46-75', title: 'Staggered Onboarding Waves', desc: 'Provisioned enterprise hardware, security badges, and managed day-1 orientation.' }
    ],
    results: [
      { metric: '60/60', label: 'Headcount Fulfilled', desc: 'Completed 100% of board target 15 days ahead of schedule.' },
      { metric: '64%', label: 'Operating Cost Arbitrage', desc: 'Achieved sustainable cost optimization compared to headquarters dev spend.' },
      { metric: '96.6%', label: '1-Year Center Retention', desc: 'Lowest attrition in client’s global engineering footprint.' },
      { metric: 'Zero', label: 'Compliance Infractions', desc: 'Full adherence to ISO 13485 and HIPAA personnel security protocols.' }
    ],
    quote: {
      text: 'NexaTalent IT Solutions acted as our operational founders on the ground in Bengaluru. They didn’t just hire talent—they built the technical culture of our fastest-growing global tech center.',
      author: 'Dr. Marcus Vance',
      title: 'Global VP of Digital Systems',
      company: 'BioHealth Technologies Inc.'
    }
  },
  'health-ai': {
    title: 'Healthcare & GenAI Labs: Assembly of 18 LLM Fine-Tuning Researchers',
    client: 'HIPAA-Compliant Medical AI Pioneer',
    industry: 'Artificial Intelligence & HealthTech',
    badge: 'Specialized AI Squad Deployment',
    headlineMetric: '18 Researchers',
    headlineMetricLabel: 'Deployed in 36 Hours Sourcing Window',
    context: 'The client was building clinical LLM assistants requiring PyTorch, CUDA kernel optimization, and HIPAA-compliant data pipelines.',
    challenge: 'Scarcity of candidate talent with both deep neural network architecture experience and healthcare regulatory understanding.',
    requirement: '18 GenAI Practitioners, Senior Machine Learning Engineers, and NLP Data Scientists.',
    approach: 'NexaTalent IT Solutions tapped into its proprietary pre-vetted AI practitioner graph and conducted 3-stage RAG evaluation benchmarks.',
    execution: [
      { phase: 'Sprint 1', title: 'Deep Sourcing & Benchmark', desc: 'Engaged 45 pre-evaluated AI researchers across premier Indian tech institutions.' },
      { phase: 'Sprint 2', title: 'Live Code Sandbox', desc: 'Evaluated prompt engineering, LoRA fine-tuning, and CUDA memory management.' },
      { phase: 'Sprint 3', title: 'Rapid Squad Onboarding', desc: 'Completed contract closures and HIPAA compliance orientation.' }
    ],
    results: [
      { metric: '96%', label: 'Offer Acceptance Rate', desc: 'High conversion due to calibrated compensation positioning.' },
      { metric: '36 Hours', label: 'First Candidate Delivery', desc: 'Rapid response time for niche AI skills.' },
      { metric: '100%', label: 'HIPAA Compliance Index', desc: 'Zero data security or compliance infractions.' },
      { metric: '₹2.1 Cr', label: 'Saved in Search Costs', desc: 'Audited Cost-Plus margin terms.' }
    ],
    quote: {
      text: 'Finding LLM researchers with real PyTorch & CUDA experience was impossible until NexaTalent stepped in. Their 3-stage vetting saved us months of screening.',
      author: 'Dr. Aris Thorne',
      title: 'Chief AI Architect',
      company: 'MedGenAI Labs'
    }
  },
  'fintech-latency-turnaround': {
    title: 'Fintech HFT Platform: Scaling Ultra-Low Latency Core Pod in 21 Days',
    client: 'Leading Tier-1 Quant Trading & Execution Firm',
    industry: 'BFSI & FinTech',
    badge: 'Mission-Critical Direct Sourcing',
    headlineMetric: '21 Days',
    headlineMetricLabel: 'Complete 8-Engineer Core Pod Deployed',
    context: 'The client was migrating from legacy monolithic exchange gateways to a distributed FPGA and C++20 microsecond matching engine in Mumbai and Singapore.',
    challenge: 'Previous recruitment partners spent 4 months presenting candidates with generic Java/C# backgrounds who consistently failed kernel bypass (Solarflare OpenOnload) and cache-locality design interviews.',
    requirement: '8 Elite Systems Engineers (Staff C++ Specialists, Low-Latency Network Architects, FPGA Acceleration Engineers) with immediate or 30-day notice periods.',
    approach: 'NexaTalent IT Solutions deployed its specialized Quant & HFT practice pod, executing targeted algorithmic benchmarks and concurrency stress-tests before presenting candidates to the CTO.',
    execution: [
      { phase: 'Week 1', title: 'Calibration & Sandboxing', desc: 'Reverse-engineered the client’s p99 latency evaluation questions into a live memory-alignment assessment.' },
      { phase: 'Week 2', title: 'Targeted Passive Sourcing', desc: 'Engaged 32 passive systems engineers across telecom infrastructure and proprietary trading desks.' },
      { phase: 'Week 3', title: 'Offer Closure & Buyout Management', desc: 'Negotiated complex notice period buyouts and sign-on incentives for all 8 accepted offers.' }
    ],
    results: [
      { metric: '100%', label: 'Offer-to-Joiner Ratio', desc: '8 offers released, 8 engineers joined with zero dropouts.' },
      { metric: '14 Days', label: 'First Shortlist Turnaround', desc: 'Calibrated candidate dossiers delivered within 2 weeks of mandate kickoff.' },
      { metric: '98.5%', label: 'Technical Pass Rate', desc: '11 candidates interviewed by client, 8 cleared final bar.' },
      { metric: '₹1.8 Cr', label: 'Saved in Agency Fragmentation', desc: 'Consolidated under single master service agreement with performance SLA.' }
    ],
    quote: {
      text: 'NexaTalent IT Solutions was the first recruitment partner who genuinely understood cache hierarchies and lock-free concurrency. Their vetting saved our engineering leadership over 60 hours of wasted interview loops.',
      author: 'Sameer Kulkarni',
      title: 'Chief Technology Officer',
      company: 'Apex Quant Execution Labs'
    }
  },
  'gcc-turnkey-bengaluru': {
    title: 'Fortune 100 HealthTech: Turnkey Setup of 60-Engineer India GCC',
    client: 'Global Medical Devices & Software Conglomerate',
    industry: 'Healthcare & Life Sciences',
    badge: 'Turnkey GCC Establishment',
    headlineMetric: '60 Hires',
    headlineMetricLabel: 'Full Engineering Pods Operational in 75 Days',
    context: 'A US healthcare enterprise required a premier Indian technology center to own FDA-compliant cloud PACS imaging and clinical AI platforms.',
    challenge: 'Zero existing India legal entity, no local employer brand recognition, and a strict 90-day board mandate to have functional software development pods active.',
    requirement: '1 GCC Managing Director, 4 Engineering Directors, 40 Full-Stack & Cloud Engineers, 10 Medical QA/SDETs, and 5 Cloud DevOps leads.',
    approach: 'Turnkey Build-Operate-Transfer (BOT) staffing model. NexaTalent IT Solutions established co-branded recruitment hackathons and deployed dedicated on-site talent squads.',
    execution: [
      { phase: 'Days 1-15', title: 'Entity Setup & Anchor Leadership', desc: 'Partnered with legal advisory for STPI/SEZ clearance while hiring the GCC Site Director.' },
      { phase: 'Days 16-45', title: 'Simultaneous Sourcing Sprints', desc: 'Executed 3 weekend evaluation drives screening 400+ medical informatics engineers.' },
      { phase: 'Days 46-75', title: 'Staggered Onboarding Waves', desc: 'Provisioned enterprise hardware, security badges, and managed day-1 orientation.' }
    ],
    results: [
      { metric: '60/60', label: 'Headcount Fulfilled', desc: 'Completed 100% of board target 15 days ahead of schedule.' },
      { metric: '64%', label: 'Operating Cost Arbitrage', desc: 'Achieved sustainable cost optimization compared to headquarters dev spend.' },
      { metric: '96.6%', label: '1-Year Center Retention', desc: 'Lowest attrition in client’s global engineering footprint.' },
      { metric: 'Zero', label: 'Compliance Infractions', desc: 'Full adherence to ISO 13485 and HIPAA personnel security protocols.' }
    ],
    quote: {
      text: 'NexaTalent IT Solutions acted as our operational founders on the ground in Bengaluru. They didn’t just hire talent—they built the technical culture of our fastest-growing global tech center.',
      author: 'Dr. Marcus Vance',
      title: 'Global VP of Digital Systems',
      company: 'BioHealth Technologies Inc.'
    }
  }
};

const DEFAULT_CASE_STUDY = {
  title: 'Enterprise SaaS Migration: Scaling 25 Distributed Cloud Engineers',
  client: 'Global Cloud Enterprise Platform',
  industry: 'Technology & SaaS',
  badge: 'Scale-Up Sourcing Solution',
  headlineMetric: '25 Hires',
  headlineMetricLabel: 'Scaled in 45 Calendar Days',
  context: 'The client needed to refactor a multi-tenant legacy architecture into micro-frontends and Kubernetes-native microservices.',
  challenge: 'Compounding hiring delays led to missed enterprise SLA milestones and engineering team fatigue.',
  requirement: '25 Senior Full-Stack and SRE engineers with deep Go and React experience.',
  approach: 'Dedicated RPO pod embedded inside client Slack and ATS, conducting technical screen before manager loops.',
  execution: [
    { phase: 'Phase 1', title: 'Calibration', desc: 'Mapped team topology and calibrated scoring rubrics.' },
    { phase: 'Phase 2', title: 'Rapid Sourcing', desc: 'Sourced 150+ passive engineers through proprietary tech graph.' },
    { phase: 'Phase 3', title: 'Closure', desc: 'Closed 25 offers with a 92% joiner ratio.' }
  ],
  results: [
    { metric: '92%', label: 'Offer Acceptance Rate', desc: 'Well above industry average of 60%.' },
    { metric: '45 Days', label: 'Total Project Duration', desc: 'Reduced time-to-fill by 52%.' },
    { metric: '96%', label: '1-Year Retention', desc: 'Long-term stability and high delivery velocity.' },
    { metric: '38%', label: 'Cost Savings vs Contingency', desc: 'Significant optimization in recruitment spend.' }
  ],
  quote: {
    text: 'Working with NexaTalent IT Solutions was seamless. The quality of candidate calibration was unmatched by any agency we worked with previously.',
    author: 'Ananya Roy',
    title: 'VP of Engineering',
    company: 'CloudMatrix Technologies'
  }
};

export function CaseStudyDetailPage() {
  const { caseStudySlug } = useParams<{ caseStudySlug: string }>();
  const study = (caseStudySlug && CASE_STUDIES_DB[caseStudySlug]) ? CASE_STUDIES_DB[caseStudySlug] : DEFAULT_CASE_STUDY;

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
  }, [caseStudySlug]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'clip',
        overflowY: 'visible',
        isolation: 'isolate',
        backgroundColor: '#ffffff',
      }}
    >
      {/* SEO & Meta Tags */}
      <SeoHead
        title={`${study.title} | NexaTalent IT Solutions Case Study`}
        description={`${study.headlineMetric} ${study.headlineMetricLabel}. ${study.context} Learn how NexaTalent IT Solutions solved this mandate.`}
        keywords={`${study.client}, ${study.industry} hiring case study, recruitment SLA results, tech team build`}
        canonical={`/case-studies/${caseStudySlug || 'featured'}`}
      />

      <SiteNavbar />

      {/* Hero Header */}
      <section style={{ 
        position: 'relative', 
        paddingTop: '8rem', 
        paddingBottom: '4.5rem', 
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/case-studies" style={{ color: '#64748B', textDecoration: 'none' }}>Case Studies</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#4361EE', fontWeight: 600 }}>{study.client}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ padding: '0.35rem 0.85rem', borderRadius: '9999px', backgroundColor: '#EEF2FF', color: '#4361EE', fontSize: '0.8rem', fontWeight: 700 }}>
              {study.industry}
            </span>
            <span style={{ padding: '0.35rem 0.85rem', borderRadius: '9999px', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>
              {study.badge}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#0B132B',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            maxWidth: '960px'
          }}>
            {study.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4361EE' }}>{study.headlineMetric}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748B', maxWidth: '180px' }}>{study.headlineMetricLabel}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.9rem' }}>
              <Building2 size={16} />
              <span>Client: <strong>{study.client}</strong></span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Case Study Narrative */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Challenge vs Solution Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
          
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2.5rem',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.75rem' }}>
              The Operational Bottleneck
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {study.context}
            </p>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
              {study.challenge}
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '2.5rem',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4361EE', marginBottom: '0.75rem' }}>
              The NexaTalent IT Solutions Solution
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              <strong>Mandate Requirement:</strong> {study.requirement}
            </p>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
              {study.approach}
            </p>
          </div>

        </div>

        {/* Execution Phasing */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginBottom: '1.5rem', textAlign: 'center' }}>
            Execution Timeline & Delivery Milestones
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {study.execution.map((ex) => (
              <div
                key={ex.phase}
                style={{
                  backgroundColor: '#F8FAFC',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4361EE', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {ex.phase}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.6rem' }}>
                  {ex.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                  {ex.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quantifiable Results Grid */}
        <div style={{
          backgroundColor: '#0B132B',
          borderRadius: '24px',
          padding: '3rem',
          color: '#ffffff',
          marginBottom: '4rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              Auditable Business Impact & Results
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              Quantified deliverables achieved directly through our calibrated talent deployment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {study.results.map((r) => (
              <div key={r.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4361EE', marginBottom: '0.35rem' }}>
                  {r.metric}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  {r.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Testimonial Quote */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '3rem',
          position: 'relative',
          marginBottom: '4rem'
        }}>
          <Quote size={48} color="#CBD5E1" style={{ position: 'absolute', top: '2rem', right: '2rem' }} />
          <p style={{ fontSize: '1.25rem', color: '#0B132B', fontStyle: 'italic', lineHeight: 1.7, maxWidth: '850px', marginBottom: '1.5rem' }}>
            "{study.quote.text}"
          </p>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0B132B' }}>{study.quote.author}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{study.quote.title}, {study.quote.company}</div>
          </div>
        </div>

      </section>

      {/* Animated Light-Motion Sections from SampleShowcase */}
      <LightCaseStudyMaster />
      <LightCaseStudyResultSplit />
      <LightMetricsCounter />
      <LightTwoColumnPinnedStory />
      <LightFinalCTAExpansion />

      <SiteFooter />
    </div>
  );
}
