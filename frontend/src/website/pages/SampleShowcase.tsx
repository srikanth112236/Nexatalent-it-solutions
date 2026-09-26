import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, ArrowUp, Activity, CheckCircle2 } from 'lucide-react';
import {
  AnimatedHero,
  SplitHero,
  VideoHero,
  EmployerCandidateSwitcher,
  RecruitmentWorkflow,
  SolutionCardGrid,
  IndustryCardGrid,
  LogoMarquee,
  MetricsCounter,
  InteractiveTalentPipeline,
  PortalPreview,
  DashboardShowcase,
  CaseStudyCard,
  CaseStudyResultPanel,
  JobCard,
  FeaturedJobsCarousel,
  IndustrySpotlight,
  Testimonial,
  FAQAccordion,
  ResourceCard,
  InsightCard,
  ProcessTimeline,
  ProcessStepper,
  CTASection,
  ContactForm,
  HiringRequirementForm,
  CandidateProfileCTA,
  JobSearchInterface,
  JobFilterDrawer,
  LocationExplorer,
  IndustryExplorer,
  BeforeAfterSection,
  BentoContentGrid,
  ScrollStorySection,
  HorizontalScrollGallery,
  FloatingCTA,
  TrustSignalStrip,
  ServiceComparison,
  RecruitmentJourneyMap,
  MegaFooter,
} from '../components';
import {
  LightHeroZoomReveal,
  LightHeroParallaxImage,
  LightStackedCards,
  LightTwoColumnPinnedStory,
  LightHorizontalStory,
  LightProgressiveWorkflow,
  LightInteractiveNetwork,
  LightDashboardAssembly,
  LightCardExpandSection,
  LightPerspectiveCorridor,
  LightCurtainReveal,
  LightSplitScreenConvergence,
  LightRadialExpansion,
  LightTextToInterface,
  LightBlurTransition,
  LightDataHumanTransformation,
  LightScrollSnappingStory,
  LightBackgroundGridSpotlight,
  LightMagneticCardAccordion,
  LightFinalCTAExpansion,
} from '../components/light-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SectionHeaderProps {
  number: string;
  name: string;
  engine: string;
  description: string;
}

const ComponentHeader: React.FC<SectionHeaderProps> = ({ number, name, engine, description }) => (
  <div
    style={{
      padding: '1.25rem 2rem',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      zIndex: 10,
      position: 'relative',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
      <span
        style={{
          fontSize: '0.8125rem',
          fontWeight: 800,
          fontFamily: 'monospace',
          color: 'var(--color-primary-400)',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {number}
      </span>
      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          {name}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0 0 0' }}>
          {description}
        </p>
      </div>
    </div>

    <span
      style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.12)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
      }}
    >
      <Activity size={12} />
      {engine}
    </span>
  </div>
);

export const SampleShowcase: React.FC = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    // Refresh ScrollTrigger calculations after initial paint to ensure all sticky/pinned offsets calculate accurately
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', position: 'relative' }}>
      {/* Top Hero / Meta Banner */}
      <section
        style={{
          padding: '5rem 2rem 4rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.18) 0%, rgba(10, 15, 29, 0.95) 75%)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={15} />
            NexaTalent Complete Animation & Motion System Showcase
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            All 40 Animated Components
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '780px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            Pure, unconstrained sequential presentation powered by <strong>Framer Motion</strong>,{' '}
            <strong>GSAP ScrollTrigger</strong> pinned storytelling, <strong>Lenis</strong> smooth scrolling, and{' '}
            <strong>Aceternity</strong>-grade dark design aesthetics.
          </motion.p>

          {/* Engine Highlights Strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              padding: '1.25rem 2rem',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>Lenis Smooth Scroll Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>Framer Motion 13 Spring & Stagger</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>GSAP ScrollTrigger Pin & Horizontal Scrub</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <Layers size={16} color="var(--color-primary-400)" />
              <span style={{ color: 'var(--color-primary-400)', fontWeight: 700 }}>40/40 Components Operational</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sequential Pure Component Presentation Flow */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* =========================================================================
            PART 1: NEW SIGNATURE MOTION SHORTLIST (COMPLETE LIGHTER THEME SET)
            ========================================================================= */}
        <div style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #e2e8f0', padding: '4rem 2rem 3rem 2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            PART 1 · COMPLETE LIGHTER THEME SUITE
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            Shortlist Motion Patterns in Modern Light Theme
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '720px', margin: '0.5rem auto 0 auto' }}>
            A complete set of new, modern, and unique components implementing C01–C10 Core, S01–S10 Signature, and P01–P10 Premium patterns in clean executive light styling.
          </p>
        </div>

        {/* 1. LightHeroZoomReveal (Patterns 13 & 14: Center Zoom & Focus -> Peripheral Reveal) */}
        <section id="light-hero">
          <LightHeroZoomReveal />
        </section>

        {/* 2. LightHeroParallaxImage (Hero Parallax Sections & Parallax Image Scrolling) */}
        <section id="light-hero-parallax">
          <LightHeroParallaxImage />
        </section>

        {/* 3. LightCurtainReveal (Patterns 17 & 18: Horizontal & Vertical Curtain Reveals) */}
        <section id="light-curtain">
          <LightCurtainReveal />
        </section>

        {/* 4. LightSplitScreenConvergence (Patterns 19 & 20: Split-Screen Convergence & Divergence) */}
        <section id="light-split-screen">
          <LightSplitScreenConvergence />
        </section>

        {/* 5. LightStackedCards (Patterns 22 & C08: Card Collapse / Stacked Cards on Scroll) */}
        <section id="light-stacked-cards">
          <LightStackedCards />
        </section>

        {/* 6. LightTwoColumnPinnedStory (Patterns 23 & 24: One-Side Sticky Scroll Pin & Visual Transforms) */}
        <section id="light-pinned-story">
          <LightTwoColumnPinnedStory />
        </section>

        {/* 7. LightHorizontalStory (Patterns 40 & 41: Horizontal Full View Section on Scroll & Vertical-Horizontal-Vertical) */}
        <section id="light-horizontal-story">
          <LightHorizontalStory />
        </section>

        {/* 8. LightProgressiveWorkflow (Patterns 28 & 29: Progressive Workflow Build & Dynamic SVG Line Drawing) */}
        <section id="light-progressive-workflow">
          <LightProgressiveWorkflow />
        </section>

        {/* 9. LightInteractiveNetwork (Patterns 30 & 31: Node Activation & Orbiting Information) */}
        <section id="light-interactive-network">
          <LightInteractiveNetwork />
        </section>

        {/* 10. LightRadialExpansion (Patterns 32 & 33: Radial Expansion & Radial Collapse) */}
        <section id="light-radial-expansion">
          <LightRadialExpansion />
        </section>

        {/* 11. LightTextToInterface (Patterns 34 & 35: Text to Interface Transformation & UI Fragment Assembly) */}
        <section id="light-text-interface">
          <LightTextToInterface />
        </section>

        {/* 12. LightBlurTransition (Patterns 36 & 37: Progressive Blur to Sharp & Section Blur Transition) */}
        <section id="light-blur-transition">
          <LightBlurTransition />
        </section>

        {/* 13. LightDataHumanTransformation (Patterns 38 & 39: Image to Data & Data to Human Transformation) */}
        <section id="light-data-human">
          <LightDataHumanTransformation />
        </section>

        {/* 14. LightScrollSnappingStory (Patterns 42 & 43: Scroll Snapping Story & Progress Color Transformation) */}
        <section id="light-scroll-snapping">
          <LightScrollSnappingStory />
        </section>

        {/* 15. LightBackgroundGridSpotlight (Patterns 44 & 45: Background Grid Transformation & Cursor Spotlight Follow) */}
        <section id="light-grid-spotlight">
          <LightBackgroundGridSpotlight />
        </section>

        {/* 16. LightMagneticCardAccordion (Patterns 46, 47, 48 & 49: Magnetic Cards, Hover Expand & Accordion Visual Transforms) */}
        <section id="light-magnetic-accordion">
          <LightMagneticCardAccordion />
        </section>

        {/* 17. LightDashboardAssembly (Patterns 25, 26, 27: Scroll-Scrubbed Dashboard Assembly & Disassembly) */}
        <section id="light-dashboard-assembly">
          <LightDashboardAssembly />
        </section>

        {/* 18. LightCardExpandSection (Pattern 21: Card Expansion to Full Section) */}
        <section id="light-card-expand">
          <LightCardExpandSection />
        </section>

        {/* 19. LightPerspectiveCorridor (Patterns 15 & 16: Perspective Corridor & Depth Tunnel / Z-Axis Scroll) */}
        <section id="light-perspective-corridor">
          <LightPerspectiveCorridor />
        </section>

        {/* 20. LightFinalCTAExpansion (Pattern 50: Final CTA Radial & Scale Expansion) */}
        <section id="light-final-cta">
          <LightFinalCTAExpansion />
        </section>

        {/* =========================================================================
            PART 2: COMPLETE 40-COMPONENT PRODUCTION CATALOG
            ========================================================================= */}
        <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '2px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '4rem 2rem 3rem 2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'var(--color-primary-400)', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            <Layers size={14} />
            PART 2 · COMPLETE 40-COMPONENT PRODUCTION CATALOG
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
            All 40 Aceternity & 21st.dev Website Components
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', maxWidth: '720px', margin: '0.5rem auto 0 auto' }}>
            Continuous scroll flow of every production component with dedicated motion tags and real-time interaction states.
          </p>
        </div>

        {/* 01. AnimatedHero */}
        <section id="c-01">
          <ComponentHeader
            number="01 / 40"
            name="AnimatedHero"
            engine="Framer Motion + Radial Ambient Glow"
            description="Breathing grid rays, spring badge entrance, staggered headline words & magnetic CTA buttons"
          />
          <AnimatedHero />
        </section>

        {/* 02. SplitHero */}
        <section id="c-02">
          <ComponentHeader
            number="02 / 40"
            name="SplitHero"
            engine="Framer Motion 3D Tilt Card + Dynamic Progress Bars"
            description="Split view with mouse-tracking perspective tilt card and live calibrated scorecards"
          />
          <SplitHero />
        </section>

        {/* 03. VideoHero */}
        <section id="c-03">
          <ComponentHeader
            number="03 / 40"
            name="VideoHero"
            engine="Framer Motion Ripple Waves + Scale Hover"
            description="High-production video container with pulsing radial play wave rings and lightbox state"
          />
          <VideoHero />
        </section>

        {/* 04. EmployerCandidateSwitcher */}
        <section id="c-04">
          <ComponentHeader
            number="04 / 40"
            name="EmployerCandidateSwitcher"
            engine="Framer Motion layoutId + AnimatePresence Swap"
            description="Shared element slider pill transitioning context between Employer and Candidate portals"
          />
          <EmployerCandidateSwitcher />
        </section>

        {/* 05. RecruitmentWorkflow */}
        <section id="c-05">
          <ComponentHeader
            number="05 / 40"
            name="RecruitmentWorkflow"
            engine="Framer Motion Staggered Cards + layoutId Glow Beam"
            description="6-stage verified engineering recruitment protocol with active node highlight"
          />
          <RecruitmentWorkflow />
        </section>

        {/* 06. SolutionCardGrid */}
        <section id="c-06">
          <ComponentHeader
            number="06 / 40"
            name="SolutionCardGrid"
            engine="Framer Motion Staggered Cascade + Spring Lift Hover"
            description="Modular technical engagement models with responsive spring hover physics"
          />
          <SolutionCardGrid />
        </section>

        {/* 07. IndustryCardGrid */}
        <section id="c-07">
          <ComponentHeader
            number="07 / 40"
            name="IndustryCardGrid"
            engine="3D Cursor Perspective Tilt + Alternating Slide Entrance"
            description="Sector practices with dynamic cursor position tracking and animated bouncy badges"
          />
          <IndustryCardGrid />
        </section>

        {/* 08. LogoMarquee */}
        <section id="c-08">
          <ComponentHeader
            number="08 / 40"
            name="LogoMarquee"
            engine="High-Performance CSS Keyframes Ticker + Blur Entrance"
            description="Dual counter-scrolling infinite client marquee with micro scale interactions"
          />
          <LogoMarquee />
        </section>

        {/* 09. MetricsCounter */}
        <section id="c-09">
          <ComponentHeader
            number="09 / 40"
            name="MetricsCounter"
            engine="requestAnimationFrame Counting Engine + Glassmorphic Glow"
            description="Viewport-triggered progressive number counting from 0 to target with tabular alignment"
          />
          <MetricsCounter />
        </section>

        {/* 10. InteractiveTalentPipeline */}
        <section id="c-10">
          <ComponentHeader
            number="10 / 40"
            name="InteractiveTalentPipeline"
            engine="GSAP ScrollTrigger + Framer Motion layoutId Slider"
            description="Progressive 5-stage qualification pipeline with animated stroke lines and step highlights"
          />
          <InteractiveTalentPipeline />
        </section>

        {/* 11. PortalPreview */}
        <section id="c-11">
          <ComponentHeader
            number="11 / 40"
            name="PortalPreview"
            engine="Framer Motion layoutId Switcher + AnimatePresence Content Swap"
            description="Interactive preview of Employer, Candidate, and Recruiter workspaces with magnetic CTA"
          />
          <PortalPreview />
        </section>

        {/* 12. DashboardShowcase */}
        <section id="c-12">
          <ComponentHeader
            number="12 / 40"
            name="DashboardShowcase"
            engine="Perspective 3D Window Entrance + Breathing Pulse Indicators"
            description="Browser HUD mockup displaying live candidate SLA telemetry and pipeline metrics"
          />
          <DashboardShowcase />
        </section>

        {/* 13. CaseStudyCard */}
        <section id="c-13" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="13 / 40"
            name="CaseStudyCard"
            engine="Framer Motion whileInView Entrance + Micro-Stagger"
            description="Data-dense case outcome card featuring quantified delivery benchmarks and tags"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <CaseStudyCard
              client="AlphaFin Global HFT"
              industry="FinTech & Low Latency Trading"
              headline="Scaling an India GCC from 0 to 45 Senior Staff Engineers in 75 Days"
              metrics={[
                { label: 'Hires Closed', value: '45' },
                { label: 'Time-to-Hire', value: '18 Days' },
                { label: 'Retention at 12M', value: '98%' },
              ]}
              featured={true}
            />
            <CaseStudyCard
              client="Hyperscale AI Labs"
              industry="Generative AI & LLM Systems"
              headline="Building an Elite 12-Person Distributed Inference Systems Pod"
              metrics={[
                { label: 'LLM Scientists', value: '12' },
                { label: 'SLA Delivery', value: '48h' },
                { label: 'Acceptance Rate', value: '94%' },
              ]}
              featured={false}
            />
          </div>
        </section>

        {/* 14. CaseStudyResultPanel */}
        <section id="c-14">
          <ComponentHeader
            number="14 / 40"
            name="CaseStudyResultPanel"
            engine="Dual Column Lateral Slide Entrance + Scaled Checkmarks"
            description="Executive split analysis comparing client technical challenge to deployed squad solution"
          />
          <CaseStudyResultPanel />
        </section>

        {/* 15. JobCard */}
        <section id="c-15" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="15 / 40"
            name="JobCard"
            engine="Spring Elevation + Magnetic Apply + whileTap Bookmark"
            description="Verified technical mandate card with priority badges and animated tags"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <JobCard
              id="mandate-01"
              title="Principal Distributed Systems Architect"
              company="OmniCloud Global"
              location="Bangalore · Hybrid"
              type="Full-Time"
              salary="₹70L - ₹95L + Equity"
              experience="9+ Years"
              tags={['Rust', 'Distributed DB', 'Raft', 'eBPF']}
              postedAt="1 day ago"
              featured={true}
              urgent={true}
            />
            <JobCard
              id="mandate-02"
              title="Staff Machine Learning Platform Lead"
              company="Foundry Neural Systems"
              location="Hyderabad · Hybrid"
              type="Full-Time"
              salary="₹65L - ₹85L + Equity"
              experience="7+ Years"
              tags={['vLLM', 'CUDA', 'Distributed PyTorch', 'Kubernetes']}
              postedAt="3 hours ago"
              featured={true}
              urgent={false}
            />
          </div>
        </section>

        {/* 16. FeaturedJobsCarousel */}
        <section id="c-16">
          <ComponentHeader
            number="16 / 40"
            name="FeaturedJobsCarousel"
            engine="Directional AnimatePresence + Category layoutId Pill"
            description="Filterable job mandate carousel with directional slide transitions and interactive arrows"
          />
          <FeaturedJobsCarousel />
        </section>

        {/* 17. IndustrySpotlight */}
        <section id="c-17">
          <ComponentHeader
            number="17 / 40"
            name="IndustrySpotlight"
            engine="Two-Column Lateral Reveal + Animated Metric Counters"
            description="Deep dive into specialized engineering verticals with checklist cascades and live metrics"
          />
          <IndustrySpotlight />
        </section>

        {/* 18. Testimonial */}
        <section id="c-18">
          <ComponentHeader
            number="18 / 40"
            name="Testimonial"
            engine="Sequential Star Pop + Custom Typewriter Text Reveal"
            description="Verified enterprise leader quotes with magnetic hover elevation and sequential star fills"
          />
          <Testimonial />
        </section>

        {/* 19. FAQAccordion */}
        <section id="c-19">
          <ComponentHeader
            number="19 / 40"
            name="FAQAccordion"
            engine="Framer Motion Height: auto + Spring Rotating Chevrons"
            description="Searchable enterprise hiring FAQ with instantaneous query filtering and border glow"
          />
          <FAQAccordion />
        </section>

        {/* 20. ResourceCard */}
        <section id="c-20" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="20 / 40"
            name="ResourceCard"
            engine="Framer Motion Spring Lift + Viewport Download Counter"
            description="Gated technical salary playbooks and market benchmark research artifacts"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <ResourceCard
              id="report-01"
              title="2026 India & US Tech Compensation Benchmark Report"
              type="Salary Benchmark Guide"
              description="Comprehensive compensation ranges, stock equity formulas, and notice period buyouts across 45,000 verified data points."
              pages={48}
              format="PDF"
              downloadsCount="4,800+ Downloads"
            />
            <ResourceCard
              id="report-02"
              title="The India GCC Playbook: Zero to 100 Engineers"
              type="Architectural Guide"
              description="Step-by-step roadmap for multinational tech companies establishing turnkey engineering hubs in Bangalore and Hyderabad."
              pages={64}
              format="PDF"
              downloadsCount="3,200+ Downloads"
            />
          </div>
        </section>

        {/* 21. InsightCard */}
        <section id="c-21" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="21 / 40"
            name="InsightCard"
            engine="Framer Motion whileInView Entrance + Animated Arrow Translate"
            description="Editorial thought leadership cards featuring author bio and read-time badges"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <InsightCard
              id="article-01"
              title="Why 65% of Engineering GCCs Stumble in Year One (And How to Fix It)"
              excerpt="Key architectural and operational traps multinational enterprises fall into when establishing engineering hubs in Bangalore."
              category="GCC Strategy"
              author={{ name: 'Vikramaditya Sharma', role: 'Head of GCC Advisory' }}
              readTime="7 min read"
              date="Sep 2026"
              featured={true}
            />
            <InsightCard
              id="article-02"
              title="The End of Keyword-Based Recruiting: Enter Semantic Calibrations"
              excerpt="Why resume keyword matching fails in distributed systems and how vector embeddings identify true senior engineering talent."
              category="AI & Screening"
              author={{ name: 'Dr. Ananya Ray', role: 'Lead Talent Intelligence' }}
              readTime="5 min read"
              date="Sep 2026"
              featured={false}
            />
          </div>
        </section>

        {/* 22. ProcessTimeline */}
        <section id="c-22">
          <ComponentHeader
            number="22 / 40"
            name="ProcessTimeline"
            engine="GSAP ScrollTrigger Progressive Node Reveal + Drawing SVG Line"
            description="Deterministic SLA milestone timeline drawing a glowing connection stroke on scroll"
          />
          <ProcessTimeline />
        </section>

        {/* 23. ProcessStepper */}
        <section id="c-23">
          <ComponentHeader
            number="23 / 40"
            name="ProcessStepper"
            engine="Directional AnimatePresence + Spring Width Progress Fill"
            description="Interactive client engagement stepper with animated status bar and numbered step bubbles"
          />
          <ProcessStepper />
        </section>

        {/* 24. CTASection */}
        <section id="c-24">
          <ComponentHeader
            number="24 / 40"
            name="CTASection"
            engine="Aceternity Radial Glow + Staggered Word Reveal + Parallax Shift"
            description="Conversion banner with breathing background radial beams and magnetic action buttons"
          />
          <CTASection />
        </section>

        {/* 25. ContactForm */}
        <section id="c-25" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="25 / 40"
            name="ContactForm"
            engine="3D Perspective Entrance + Focus Ring Expansion + Bouncy Checkmark"
            description="Direct Practice Lead priority intake form with interactive field feedback"
          />
          <div style={{ marginTop: '2rem' }}>
            <ContactForm />
          </div>
        </section>

        {/* 26. HiringRequirementForm */}
        <section id="c-26" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="26 / 40"
            name="HiringRequirementForm"
            engine="Multi-Step AnimatePresence + Progress Fill + Glow Submit State"
            description="Interactive technical mandate configurator backed by 48-hour shortlist SLA"
          />
          <div style={{ marginTop: '2rem' }}>
            <HiringRequirementForm />
          </div>
        </section>

        {/* 27. CandidateProfileCTA */}
        <section id="c-27">
          <ComponentHeader
            number="27 / 40"
            name="CandidateProfileCTA"
            engine="Orbital Blob Background + Drag & Drop Upload + Magnetic Buttons"
            description="Confidential career representation intake with interactive resume dropzone"
          />
          <CandidateProfileCTA />
        </section>

        {/* 28. JobSearchInterface */}
        <section id="c-28" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="28 / 40"
            name="JobSearchInterface"
            engine="layoutId Sliding Pill Selector + Staggered Filter Tags"
            description="Real-time role search interface with quick filters and trigger for filter drawer"
          />
          <div style={{ marginTop: '2rem' }}>
            <JobSearchInterface
              onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
              totalRolesCount={312}
            />
          </div>
        </section>

        {/* 29. JobFilterDrawer trigger & interactive drawer */}
        <section id="c-29" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <ComponentHeader
            number="29 / 40"
            name="JobFilterDrawer"
            engine="AnimatePresence Backdrop Fade + Slide-in Drawer from Right"
            description="Interactive slide-out filter drawer with multi-criteria checkboxes and reset actions"
          />
          <div style={{ padding: '3rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', marginTop: '2rem' }}>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              }}
            >
              Open Interactive Filter Drawer Preview
            </button>
            <JobFilterDrawer
              isOpen={filterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
            />
          </div>
        </section>

        {/* 30. LocationExplorer */}
        <section id="c-30">
          <ComponentHeader
            number="30 / 40"
            name="LocationExplorer"
            engine="Staggered Grid Reveal + layoutId Card Border Glow + Bouncing Pins"
            description="Global tech hubs analysis with median senior compensation bands and active mandates"
          />
          <LocationExplorer />
        </section>

        {/* 31. IndustryExplorer */}
        <section id="c-31">
          <ComponentHeader
            number="31 / 40"
            name="IndustryExplorer"
            engine="Framer Motion whileInView Stagger + Animated Closure Days Counter"
            description="Specialized domain matrices showcasing average turnaround days and frequent placements"
          />
          <IndustryExplorer />
        </section>

        {/* 32. BeforeAfterSection */}
        <section id="c-32">
          <ComponentHeader
            number="32 / 40"
            name="BeforeAfterSection"
            engine="Opposite Side Lateral Columns + Pulsing Neon Standard Glow"
            description="Conventional agencies vs NexaTalent Operating System comparison matrix"
          />
          <BeforeAfterSection />
        </section>

        {/* 33. BentoContentGrid */}
        <section id="c-33">
          <ComponentHeader
            number="33 / 40"
            name="BentoContentGrid"
            engine="Aceternity Asymmetric Bento Grid + 3D Card Hover Rotations"
            description="4-cell modular architectural showcase with terminal command simulation"
          />
          <BentoContentGrid />
        </section>

        {/* 34. ScrollStorySection */}
        <section id="c-34">
          <ComponentHeader
            number="34 / 40"
            name="ScrollStorySection"
            engine="GSAP ScrollTrigger Pinned Narrative Progression"
            description="Section pins on scroll as chapters smoothly advance and cross-fade stats on the right"
          />
          <ScrollStorySection />
        </section>

        {/* 35. HorizontalScrollGallery */}
        <section id="c-35">
          <ComponentHeader
            number="35 / 40"
            name="HorizontalScrollGallery"
            engine="GSAP ScrollTrigger Vertical-to-Horizontal Scrub Gallery"
            description="Pins vertically and translates horizontally across key architectural engineering disciplines"
          />
          <HorizontalScrollGallery />
        </section>

        {/* 36. FloatingCTA */}
        <section id="c-36" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <ComponentHeader
            number="36 / 40"
            name="FloatingCTA"
            engine="Scroll Detection + AnimatePresence Slide-Up + Breathing Glow"
            description="Docked bottom quick action bar with SLA guarantee and dismiss animation"
          />
          <FloatingCTA headline="Need 3 verified Principal Engineers this week?" />
        </section>

        {/* 37. TrustSignalStrip */}
        <section id="c-37">
          <ComponentHeader
            number="37 / 40"
            name="TrustSignalStrip"
            engine="Framer Motion whileInView Stagger + Bouncy Icon Entrance"
            description="SOC-2, ISO 27001, 90-day warranty, and 48-hour SLA proof strip"
          />
          <TrustSignalStrip />
        </section>

        {/* 38. ServiceComparison */}
        <section id="c-38">
          <ComponentHeader
            number="38 / 40"
            name="ServiceComparison"
            engine="Staggered Tier Entrance + Bouncy Recommended Badge + Checklist Cascade"
            description="Transparent 3-tier engagement model comparison (Contingent, Retained, GCC Squad)"
          />
          <ServiceComparison />
        </section>

        {/* 39. RecruitmentJourneyMap */}
        <section id="c-39">
          <ComponentHeader
            number="39 / 40"
            name="RecruitmentJourneyMap"
            engine="GSAP ScrollTrigger Progressive Milestone Pinned Reveal"
            description="Synchronous dual-track roadmap aligning employer hiring milestones with candidate care"
          />
          <RecruitmentJourneyMap />
        </section>

        {/* 40. MegaFooter */}
        <section id="c-40">
          <ComponentHeader
            number="40 / 40"
            name="MegaFooter"
            engine="Staggered Column Entrance + Focus Expand + Pulsing System Health"
            description="Enterprise 5-column navigation footer with newsletter intake and ISO/SLA verification"
          />
          <MegaFooter />
        </section>

      </div>

      {/* Floating Scroll To Top Action */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '2rem',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-primary-400)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 800,
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};
