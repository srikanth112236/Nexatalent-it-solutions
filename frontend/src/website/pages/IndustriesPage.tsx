import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Landmark, 
  Stethoscope, 
  Factory, 
  ShoppingBag, 
  BriefcaseBusiness, 
  Globe2, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Car,
  Radio,
  Plane,
  Sun,
  Gamepad2,
  BookOpen,
  Truck,
  Activity,
  Shield
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { 
  LightIndustryPracticeGrid, 
  LightIndustrySpotlight, 
  SignatureCompensationHeatmap, 
  HorizontalCardsRail, 
  LightMetricsCounter,
  LightFinalCTAExpansion,
  LightTwoColumnPinnedStory,
  CorridorTechVault,
  LightBeforeAfterMatrix,
  PinnedRadialHexagonRadar,
  ParallaxMultiLayerSplit,
  PinnedSpeedometerGauge,
  SignatureExecutivePledgeShield,
  LightDirectContactSection
} from '../components/light-motion';
import { Hero11SwissGridDataLens } from '../components/hero-collection';
import {
  CaseStudyClientLogoWallTicker,
  DetailFintechAndLowLatencyGuild,
  DetailCloudAndAiSpecialization,
  DetailGccTurnkeyPodConfigurator,
  FaqAccordionInteractiveSearch,
  CtaExecutiveStrategyBooking
} from '../components/sample-library';

export const INDUSTRIES_DATA = [
  {
    slug: 'technology',
    title: 'Technology & SaaS',
    tagline: 'Hyper-scale engineering, distributed systems & AI/ML architecture',
    icon: Cpu,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '4,800+ Hires', avgSla: '12 Days', retention: '96.2%' },
    description: 'We recruit core engineering leaders and individual contributors across backend infrastructure, cloud-native architecture, LLM engineering, and platform scale.',
    roles: ['Staff Backend Engineer (Go / Java / Rust)', 'Distributed Systems Architect', 'Principal AI/ML Scientist', 'Head of Engineering (SaaS)', 'Cloud DevOps / SRE Lead'],
    challenges: 'High offer-drop ratios (40%+ industry average), aggressive compensation bidding, and vetting deep architectural competence.',
    nexaSolution: 'NexaTalent IT Solutions pre-evaluates system design through live coding sandboxes and leverages high-touch engagement to deliver an 88% offer-acceptance rate.'
  },
  {
    slug: 'bfsi',
    title: 'BFSI & FinTech',
    tagline: 'Ultra-low latency trading, core banking modernization & regulatory compliance',
    icon: Landmark,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '2,900+ Hires', avgSla: '14 Days', retention: '94.8%' },
    description: 'Specialized hiring for high-frequency trading (HFT) firms, global investment banks, payment gateways, and neo-banking platforms.',
    roles: ['Low-Latency C++ Trading Systems Dev', 'Payment Gateway Security Architect', 'Quantitative Risk Analyst', 'Core Banking (Temenos/Finacle) Specialist', 'FinTech Chief Technology Officer'],
    challenges: 'Stringent compliance vetting, microsecond latency engineering requirements, and intense non-compete barriers.',
    nexaSolution: 'Proprietary vetting for multi-threaded systems engineering and rigorous background verification prior to first interview submission.'
  },
  {
    slug: 'healthcare',
    title: 'Healthcare & Life Sciences',
    tagline: 'HIPAA-compliant platforms, clinical AI, and medical device software',
    icon: Stethoscope,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,750+ Hires', avgSla: '16 Days', retention: '95.4%' },
    description: 'Placing specialized software engineering and data science professionals within digital health platforms, genomics, and telemedicine leaders.',
    roles: ['Health Informatics Director', 'FHIR / HL7 Integration Engineer', 'Bioinformatics Data Scientist', 'Medical Device Firmware Lead', 'HIPAA Cloud Security Architect'],
    challenges: 'Domain-specific regulatory expertise (FDA/HIPAA/GDPR Health), limited dual-skilled engineering pools.',
    nexaSolution: 'Dedicated healthcare recruiting pod with certified medical informatics talent networks.'
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing & Industrial IoT',
    tagline: 'Industry 4.0, embedded firmware, SCADA, and smart robotics automation',
    icon: Factory,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,400+ Hires', avgSla: '18 Days', retention: '93.7%' },
    description: 'Empowering automotive OEMs, semiconductor manufacturers, and smart factories with hardware-adjacent software leaders.',
    roles: ['Embedded C/C++ Autosar Developer', 'SCADA & Industrial IoT Architect', 'Robotics Vision Engineer', 'Supply Chain Digital Twin Specialist', 'Hardware Integration QA Lead'],
    challenges: 'Niche hardware-software intersection skills, onsite plant coordination, specialized engineering protocols.',
    nexaSolution: 'Regional sourcing across industrial clusters in Pune, Chennai, and Bengaluru with hands-on lab verification.'
  },
  {
    slug: 'retail',
    title: 'Retail, E-Commerce & Supply Chain',
    tagline: 'High-concurrency checkout engines, warehouse robotics & omnichannel tech',
    icon: ShoppingBag,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '2,200+ Hires', avgSla: '11 Days', retention: '94.1%' },
    description: 'Delivering elastic scaling talent for rapid delivery apps, omnichannel retail empires, and multi-tier logistics platforms.',
    roles: ['High-Concurrency Checkout Architect', 'Warehouse Automation Tech Lead', 'Dynamic Pricing Data Scientist', 'Search & Recommendation ML Engineer', 'Mobile Commerce Principal'],
    challenges: 'Seasonal demand surges, high-scale traffic peaks (Big Billion Days / Black Friday resilience), fast burnout.',
    nexaSolution: 'Elastic hiring squads able to deploy 20-50 verified engineers within 30-day mandate timelines.'
  },
  {
    slug: 'professional-services',
    title: 'Professional Services & Consulting',
    tagline: 'Management consulting, Big-4 digital transformations & technology advisory',
    icon: BriefcaseBusiness,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '3,100+ Hires', avgSla: '15 Days', retention: '92.9%' },
    description: 'Staffing enterprise strategy firms, systems integrators, and elite technology consulting practices with client-facing architects.',
    roles: ['Enterprise Cloud Transformation Director', 'Strategy & Architecture Partner', 'SAP S/4HANA Program Lead', 'Cybersecurity Advisory Specialist', 'Digital Workplace Solutions Architect'],
    challenges: 'Dual bar: executive boardroom communication combined with hands-on technical architecture.',
    nexaSolution: 'Behavioral and stakeholder consulting assessment panels prior to client endorsement.'
  },
  {
    slug: 'gcc',
    title: 'Global Capability Centers (GCC)',
    tagline: 'Turnkey offshore engineering hubs, center-of-excellence setup & cost arbitrage',
    icon: Globe2,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '5,500+ Hires', avgSla: '10 Days', retention: '97.4%' },
    description: 'Building complete offshore engineering pods from Day 0 for Fortune 500 multinationals establishing or scaling their India GCCs.',
    roles: ['GCC Managing Director / Site Leader', 'Core Platform Pod (1 Architect + 4 Senior + 2 QA)', 'Offshore People Operations Lead', 'Security & Compliance Officer', 'Staff Product Manager (Global Ownership)'],
    challenges: 'Day-0 employer branding in India, rapid hiring of 50-200 specialized engineers without quality dilution, and cultural alignment.',
    nexaSolution: 'Complete turnkey hiring model covering talent pipeline, cost-plus compensation modeling, office setup advisory, and SLA-backed staffing pods.'
  },
  {
    slug: 'automotive',
    title: 'Automotive & Autonomous Mobility',
    tagline: 'AUTOSAR adaptive stacks, ADAS computer vision & connected EV platforms',
    icon: Car,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,250+ Hires', avgSla: '15 Days', retention: '95.1%' },
    description: 'Sourcing software engineers for autonomous vehicle perception, battery management systems, and next-gen infotainment.',
    roles: ['AUTOSAR Embedded Architect', 'ADAS Perception ML Engineer', 'EV Battery Management System (BMS) Lead', 'Infotainment Android Automotive Dev', 'Functional Safety (ISO 26262) Specialist'],
    challenges: 'Strict ISO 26262 functional safety compliance requirements and shortage of specialized automotive C++ engineers.',
    nexaSolution: 'NexaTalent IT Solutions maintains dedicated talent pools of certified AUTOSAR and ISO 26262 embedded engineers.'
  },
  {
    slug: 'telecom',
    title: 'Telecommunications & 5G Edge',
    tagline: 'OpenRAN architecture, cloud-native packet cores & 5G MEC edge computing',
    icon: Radio,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,600+ Hires', avgSla: '14 Days', retention: '93.8%' },
    description: 'Staffing telecom equipment vendors, Tier-1 operators, and satellite broadband providers with cloud-native network engineers.',
    roles: ['5G Core Network Protocol Engineer', 'OpenRAN Software Developer', 'MEC Edge Computing Architect', 'DPDK / SR-IOV Performance Lead', 'Network Function Virtualization (NFV) Dev'],
    challenges: 'Complex kernel-level networking, DPDK packet acceleration demands, and rapid protocol evolution.',
    nexaSolution: 'Hands-on network lab testing and protocol verification prior to candidate submission.'
  },
  {
    slug: 'aerospace',
    title: 'Aerospace & Defense Technology',
    tagline: 'DO-178C avionics software, real-time embedded Linux & satellite systems',
    icon: Plane,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '850+ Hires', avgSla: '20 Days', retention: '98.0%' },
    description: 'Recruiting safety-critical software engineers for defense contractors, satellite constellations, and commercial avionics.',
    roles: ['DO-178C Flight Control Software Engineer', 'Satellite Telemetry & Command Developer', 'Real-Time Embedded RTOS Specialist', 'Radar Signal Processing Lead', 'Guidance & Navigation Systems (GNC) Engineer'],
    challenges: 'High security clearance requirements, zero-fault tolerance, and specialized RTOS expertise.',
    nexaSolution: 'Vetted pipeline of security-cleared defense tech talent with proven DO-178C compliance records.'
  },
  {
    slug: 'energy',
    title: 'Energy, Utilities & CleanTech',
    tagline: 'Smart grid telemetry, renewable energy analytics & carbon tracking software',
    icon: Sun,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,100+ Hires', avgSla: '16 Days', retention: '94.5%' },
    description: 'Building software engineering and IoT teams for renewable power operators, smart grid utilities, and ESG software startups.',
    roles: ['Smart Grid Telemetry Architect', 'Renewable Forecasting Data Scientist', 'SCADA Energy Management Specialist', 'Carbon Accounting Software Lead', 'Utility IoT Firmware Engineer'],
    challenges: 'Geographically dispersed infrastructure, legacy SCADA protocol integration, and real-time sensor streams.',
    nexaSolution: 'Cross-functional engineering pods combining cloud data architecture with IoT embedded domain experience.'
  },
  {
    slug: 'media',
    title: 'Media, Gaming & Streaming Tech',
    tagline: 'Unreal Engine 5, WebRTC low-latency streaming & cloud gaming infrastructure',
    icon: Gamepad2,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,950+ Hires', avgSla: '12 Days', retention: '93.5%' },
    description: 'Providing graphics programmers, video pipeline engineers, and game server architects to AAA studios and streaming media platforms.',
    roles: ['Unreal Engine 5 Graphics Programmer', 'WebRTC Video Pipeline Lead', 'Game Server Infrastructure Architect', 'Anti-Cheat Security Engineer', '3D Asset Pipeline Tools Developer'],
    challenges: 'High-frequency rendering optimization, global CDN latency minimization, and intense crunch culture retention risks.',
    nexaSolution: 'Targeted sourcing from AAA game studios and high-throughput video streaming platforms with retention guarantees.'
  },
  {
    slug: 'edtech',
    title: 'EdTech & Digital Learning',
    tagline: 'Interactive video platforms, adaptive AI tutoring & global LMS engines',
    icon: BookOpen,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,500+ Hires', avgSla: '13 Days', retention: '92.4%' },
    description: 'Scaling engineering teams for global learning management platforms, gamified education apps, and AI tutoring systems.',
    roles: ['Adaptive AI Tutoring ML Lead', 'Real-Time Video Classroom Engineer', 'EdTech Product Architect', 'Gamification UX/UI Principal', 'Global LMS Scalability Engineer'],
    challenges: 'Managing massive concurrency during school hours and engaging digital-first learners.',
    nexaSolution: 'Pre-vetted frontend and real-time streaming talent experienced in scaling to 10M+ active learners.'
  },
  {
    slug: 'logistics',
    title: 'Logistics & Express Freight',
    tagline: 'Dynamic route optimization, fleet IoT telemetry & automated warehousing',
    icon: Truck,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,800+ Hires', avgSla: '14 Days', retention: '95.0%' },
    description: 'Sourcing logistics tech leaders for 3PL providers, last-mile delivery platforms, and international freight aggregators.',
    roles: ['Route Optimization Operations Research Lead', 'Fleet Telemetry IoT Architect', 'Warehouse Management System (WMS) Lead', 'Cross-Border Freight Tech Principal', 'Last-Mile Delivery Backend Lead'],
    challenges: 'Complex graph optimization algorithms, offline mobile sync in remote locations, and real-time GPS tracking.',
    nexaSolution: 'Sourcing specialized operations research PhDs and high-concurrency backend developers.'
  },
  {
    slug: 'pharma',
    title: 'Pharma & BioTech Data Systems',
    tagline: 'AI drug discovery pipelines, LIMS data management & clinical trial platforms',
    icon: Activity,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '920+ Hires', avgSla: '17 Days', retention: '97.1%' },
    description: 'Placing computational biologists, LIMS software architects, and clinical data pipeline engineers for global pharma R&D hubs.',
    roles: ['Computational Biology ML Scientist', 'LIMS Enterprise System Architect', 'Clinical Trial Data Pipeline Lead', '21 CFR Part 11 Compliance Engineer', 'Genomic Data Platform Architect'],
    challenges: 'Strict FDA 21 CFR Part 11 compliance regulations and rarity of dual bio-computing skill sets.',
    nexaSolution: 'Specialized biotech talent scouts connecting global pharma R&D labs with top-tier computational talent.'
  },
  {
    slug: 'insurtech',
    title: 'InsurTech & Risk Analytics',
    tagline: 'Automated policy underwriting engines, claims vision AI & actuarial data models',
    icon: Shield,
    color: '#0265FF',
    bgLight: '#EFF6FF',
    metrics: { placed: '1,350+ Hires', avgSla: '15 Days', retention: '94.6%' },
    description: 'Delivering engineering talent to digital insurance carriers, underwriting automation platforms, and claims AI startups.',
    roles: ['Underwriting Automation ML Architect', 'Claims Document Computer Vision Lead', 'Actuarial Data Engineering Specialist', 'Core Policy Engine Developer', 'InsurTech Security & Compliance Officer'],
    challenges: 'Legacy insurance core migration and complex regulatory multi-state compliance.',
    nexaSolution: 'Pre-screened software talent with direct experience modernizing legacy core insurance stacks.'
  }
];

export function IndustriesPage() {
  const [activeSlug, setActiveSlug] = useState('technology');

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
  }, []);

  const activeIndustry = INDUSTRIES_DATA.find((i) => i.slug === activeSlug) || INDUSTRIES_DATA[0];

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
        title="16 Industry Practice Verticals & Tech Solutions | NexaTalent IT Solutions"
        description="Domain-specialized recruitment practices for Technology & SaaS, BFSI & FinTech, Healthcare, Manufacturing & IoT, Retail & E-Commerce, Global In-House GCCs, Automotive, Telecom, Aerospace, Energy, and Media."
        keywords="FinTech recruitment, SaaS hiring, healthcare IT staffing, IoT engineering recruitment, GCC vertical hiring, enterprise IT talent India, NexaTalent IT Solutions"
        canonical="/industries"
      />

      <SiteNavbar />

      {/* Swiss Grid Data Lens Hero Archetype */}
      <Hero11SwissGridDataLens />

      {/* Enterprise Client Logo Ticker */}
      <CaseStudyClientLogoWallTicker />

      {/* Hero Header */}
      <section style={{ 
        position: 'relative', 
        paddingTop: '8rem', 
        paddingBottom: '4.5rem', 
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#0265FF',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}
          >
            <TrendingUp size={15} />
            <span>Vertical Specialization & Sector-Specific Practices</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0B132B',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}
          >
            Specialized Talent Across <span style={{ color: '#0265FF' }}>16 Core Industries</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#475569',
              maxWidth: '820px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6
            }}
          >
            Generalist recruiters fail when hiring deep tech or regulatory-bound professionals. NexaTalent IT Solutions deploys dedicated domain practice leads who understand your tech stack, compliance hurdles, and salary realities.
          </motion.p>
        </div>
      </section>


      {/* Interactive Vertical Practice Navigator */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.5rem' }}>
            Explore Sector Capabilities & Delivery Models
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Click an industry below to inspect roles placed, market challenges, and our tailored sourcing solutions.
          </p>
        </div>

        {/* Tab Strip */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2.5rem',
          scrollbarWidth: 'none'
        }}>
          {INDUSTRIES_DATA.map((ind) => {
            const Icon = ind.icon;
            const isActive = activeSlug === ind.slug;
            return (
              <button
                key={ind.slug}
                onClick={() => setActiveSlug(ind.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: isActive ? `2px solid ${ind.color}` : '1px solid #E2E8F0',
                  backgroundColor: isActive ? ind.bgLight : '#ffffff',
                  color: isActive ? ind.color : '#334155',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Icon size={18} color={ind.color} />
                <span>{ind.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Detail Spotlight Card */}
        <motion.div
          key={activeIndustry.slug}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.06)',
            padding: '2.5rem',
            marginBottom: '4rem'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            
            {/* Left: Overview & Placed Roles */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: activeIndustry.bgLight,
                  color: activeIndustry.color
                }}>
                  <activeIndustry.icon size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B' }}>{activeIndustry.title}</h3>
                  <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{activeIndustry.tagline}</div>
                </div>
              </div>

              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>
                {activeIndustry.description}
              </p>

              {/* Metrics Pill Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem',
                backgroundColor: '#F8FAFC',
                padding: '1.25rem',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                marginBottom: '2rem'
              }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: activeIndustry.color }}>{activeIndustry.metrics.placed}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Placements</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B' }}>{activeIndustry.metrics.avgSla}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Avg. Shortlist SLA</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>{activeIndustry.metrics.retention}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>1-Year Retention</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B132B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                  Frequently Staffed Roles
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeIndustry.roles.map((role) => (
                    <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
                      <CheckCircle2 size={16} color={activeIndustry.color} />
                      <span style={{ fontWeight: 600 }}>{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={`/industries/${activeIndustry.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: activeIndustry.color,
                  textDecoration: 'none'
                }}
              >
                <span>View Full {activeIndustry.title} Vertical Practice Spec</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: Sector Hiring Challenges & Nexa Solution */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '1.75rem',
                borderRadius: '16px'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.5rem' }}>
                  The Sector Hiring Challenge
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#B91C1C', lineHeight: 1.6 }}>
                  {activeIndustry.challenges}
                </p>
              </div>

              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                padding: '1.75rem',
                borderRadius: '16px'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', marginBottom: '0.5rem' }}>
                  How NexaTalent IT Solutions Solves It
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#15803D', lineHeight: 1.6 }}>
                  {activeIndustry.nexaSolution}
                </p>
              </div>

              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '1.75rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B132B' }}>Need tailored talent in {activeIndustry.title}?</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Submit a requisition or book an advisory slot with the practice lead.</div>
                </div>
                <Link
                  to="/employers"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: activeIndustry.color,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Submit Requirement</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 5. 6-Card Interactive Practice Grid */}
      <LightIndustryPracticeGrid />

      {/* 6. 3D Perspective Tech Vault Corridor */}
      <CorridorTechVault />

      {/* 7. Industry Spotlight Deep Dive */}
      <LightIndustrySpotlight />

      {/* 8. Sector Compensation Heatmap */}
      <SignatureCompensationHeatmap />

      {/* 9. Specialized FinTech & Low Latency Systems Guild */}
      <DetailFintechAndLowLatencyGuild />

      {/* 10. Quantitative Before & After Matrix */}
      <LightBeforeAfterMatrix />

      {/* 11. Cloud & Generative AI Practice Guild */}
      <DetailCloudAndAiSpecialization />

      {/* 12. Two-Column Pinned Vetting Story */}
      <LightTwoColumnPinnedStory />

      {/* 13. Industry Case Rail */}
      <HorizontalCardsRail />

      {/* 14. Pinned Radial Hexagon Radar */}
      <PinnedRadialHexagonRadar />

      {/* 15. Animated SampleShowcase Section 7: Parallax Multi-Layer Split */}
      <ParallaxMultiLayerSplit />

      {/* 16. GCC Turnkey Pod Configurator */}
      <DetailGccTurnkeyPodConfigurator />

      {/* 17. Animated SampleShowcase Section 8: Pinned Speedometer Gauge */}
      <PinnedSpeedometerGauge />

      {/* 18. Executive Quality Pledge Shield */}
      <SignatureExecutivePledgeShield />

      {/* 19. Sector Hiring Metrics Counter */}
      <LightMetricsCounter />

      {/* 20. Sector Practice FAQs */}
      <FaqAccordionInteractiveSearch />

      {/* 21. Advisory Booking */}
      <CtaExecutiveStrategyBooking />

      {/* 22. Direct Contact Desk */}
      <LightDirectContactSection />

      {/* 23. Final CTA & Footer */}
      <LightFinalCTAExpansion />
      <SiteFooter />
    </div>
  );
}
