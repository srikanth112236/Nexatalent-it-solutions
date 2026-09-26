import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Sparkles, 
  ArrowUp, 
  Zap, 
  CheckCircle2, 
  Code2
} from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import all 66 light-theme modern components
import {
  LightHeroZoomReveal,
  LightHeroParallaxImage,
  LightLogoTicker,
  LightMetricsCounter,
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
  LightBeforeAfterMatrix,
  LightBentoArchitecture,
  LightJobMandatesSearch,
  LightJobCardShowcase,
  LightFeaturedJobsCarousel,
  LightCaseStudyMaster,
  LightCaseStudyResultSplit,
  LightIndustryPracticeGrid,
  LightIndustrySpotlight,
  LightLocationExplorer,
  LightCandidateProfileDrop,
  LightHiringIntakeForm,
  LightDirectContactSection,
  LightFAQAccordion,
  LightSalaryResourceCard,
  LightEditorialInsightCard,
  LightServiceTierComparison,
  LightTrustSignalStrip,
  SignatureTalentRadar,
  SignatureGCCFlightPath,
  SignatureCodeVettingTerminal,
  SignatureLiquidTiltDeck,
  SignatureCompensationHeatmap,
  SignatureInteractiveTimelineDial,
  SignatureTalentComparisonSlider,
  SignatureHiringSquadBuilder,
  SignatureParticleTextMorph,
  SignatureExecutivePledgeShield,
  CorridorVettingTunnel,
  CorridorGCCPipeline,
  CorridorTechVault,
  ParallaxMultiLayerSplit,
  ParallaxDepthFloatMatrix,
  HorizontalCardsRail,
  HorizontalMandateShowcase,
  OneSideStickySplitMilestones,
  OneSideStickyFeatureStack,
  TwoSectionDualStickyConvergence,
  TwoSectionDualStickyComparison,
  VerticalParallaxCaseStudy,
  VerticalParallaxTalentArb,
  StickyPinAccordionReveal,
  PinnedCircularProgressReveal,
  DualPinnedConvergenceShowcase,
  PinnedOrbitalHologramDial,
  PinnedRadialHexagonRadar,
  PinnedSpeedometerGauge,
  ParallaxIsometricCityRamp,
  ParallaxFloatingCodeHologram,
  ParallaxWaveformSounding,
  SignatureMagneticCursorDeck,
  SignatureMorphingShapeSVG,
  SignatureSplitTextScramble,
  SignatureInteractiveFlipCards,
  SignatureStickyCurvedPath,
  SignatureStickySpotlightAccordion,
  SignatureLiveArbitrageMatrixSlider,
  SignatureVolumetricCubeStack,
  FullScreenDualPinnedConvergenceHolo,
  FullScreenDualPinnedConvergenceVault,
  FullScreenDualPinnedConvergenceMatrix,
  FullScreenDualPinnedConvergencePrism,
  FullScreenVerticalParallaxMesh,
  FullScreenVerticalParallaxConstellation,
  FullScreenVerticalParallaxAtmosphere,
  FullScreenVerticalParallaxDeepOcean,
  FullScreenHorizontalParallaxRail,
  FullScreenHorizontalParallaxInfiniteCampus,
  FullScreenHorizontalParallaxTimelineMatrix,
  FullScreenSplitConvergenceHero,
  FullScreenSplitDivergenceExecutive,
  FullScreenSplitConvergenceBilateralCode,
  FullScreenSplitDivergenceTalentArb,
  FullScreenHorizontalSplitCurtain,
  FullScreenVerticalSplitCurtain,
  FullScreenHorizontalSplitCurtainLaser,
  FullScreenVerticalSplitCurtainAperture,
  FullScreenDiagonalCurtainConvergence,
  LightFinalCTAExpansion,
} from '../components/light-motion';

interface SectionBannerProps {
  index: number;
  id: string;
  name: string;
  tech: string;
  description: string;
  isSpecial?: boolean;
}

const LightSectionDivider: React.FC<SectionBannerProps> = ({ id }) => (
  <div id={id} className="sr-only" aria-hidden="true" />
);

export const SampleShowcase: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Refresh GSAP ScrollTrigger after mount and layout settlement
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      data-theme="light"
      className="theme-light min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900"
    >
      
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Showcase Header */}
      <header className="relative bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-28 pb-20 px-6 border-b border-slate-200 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-200/20 via-indigo-200/20 to-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>NexaTalent Production Motion Showcase • 100 Complete Sections</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
          >
            All 100 Modern Light-Theme <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
              Animated & Parallax Sections
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Seamless production showcase: 40 core architecture components, 18 signature modules, 
            3 distinct 3D perspective depth corridors, multi-layer parallax sections, horizontal cards rails, full-screen dual pinned convergence, split curtains, and one-side & two-side sticky pin storytelling.
          </motion.p>

          {/* Key Feature Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>100 Complete Sections</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>3x 3D Depth Corridors</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Horizontal & Vertical Parallax</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>One-Side & Two-Side Sticky Pins</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 66 SEQUENTIAL SECTIONS */}
      <main className="relative">

        {/* 01: Hero Center Zoom & Content Reveal */}
        <section id="sec-01">
          <LightSectionDivider
            index={1}
            id="bar-01"
            name="Center Zoom + Content Reveal"
            tech="GSAP ScrollTrigger + Motion"
            description="Core technology visual zooms to full width revealing platform capabilities"
          />
          <LightHeroZoomReveal />
        </section>

        {/* 02: Hero Parallax Image & Depth Scrub */}
        <section id="sec-02">
          <LightSectionDivider
            index={2}
            id="bar-02"
            name="Hero Parallax Image & Depth Scrub"
            tech="GSAP Parallax Scrub"
            description="Multi-layer optical depth translation with floating metric telemetry cards"
          />
          <LightHeroParallaxImage />
        </section>

        {/* 03: Client Partnerships Infinite Speed Ticker */}
        <section id="sec-03">
          <LightSectionDivider
            index={3}
            id="bar-03"
            name="Enterprise Client Logo Marquee"
            tech="Continuous CSS GPU Transform"
            description="Infinite marquee ticker featuring Tier-1 global tech and GCC partners"
          />
          <LightLogoTicker />
        </section>

        {/* 04: Verified Placement Metrics Counter */}
        <section id="sec-04">
          <LightSectionDivider
            index={4}
            id="bar-04"
            name="Verified Scale Metrics Counter"
            tech="requestAnimationFrame Engine"
            description="Live counted quantitative achievements triggered on viewport entry"
          />
          <LightMetricsCounter />
        </section>

        {/* 05: Stacked Cards Depth Reveal */}
        <section id="sec-05">
          <LightSectionDivider
            index={5}
            id="bar-05"
            name="Stacked Cards on Scroll"
            tech="GSAP Scrub + Sticky Offset"
            description="Layered card stacking with dynamic scale and opacity attenuation"
          />
          <LightStackedCards />
        </section>

        {/* 06: One-Side Sticky Pin Timeline Scroll */}
        <section id="sec-06">
          <LightSectionDivider
            index={6}
            id="bar-06"
            name="One-Side Sticky Pin Timeline Story"
            tech="CSS Sticky + ScrollTrigger"
            description="Fixed left executive narrative while right execution milestones scroll"
          />
          <LightTwoColumnPinnedStory />
        </section>

        {/* 07: Horizontal Full View Section on Scroll */}
        <section id="sec-07">
          <LightSectionDivider
            index={7}
            id="bar-07"
            name="Horizontal Full View Section"
            tech="GSAP Horizontal Pinned Scrub"
            description="Virtual horizontal track translation transforming vertical scroll into lateral pan"
          />
          <LightHorizontalStory />
        </section>

        {/* 08: Progressive SVG Line Drawing Journey */}
        <section id="sec-08">
          <LightSectionDivider
            index={8}
            id="bar-08"
            name="Progressive SVG Line Drawing"
            tech="Framer Motion PathLength Scrub"
            description="Continuous vector stroke tracing 4 calibrated recruitment stages"
          />
          <LightProgressiveWorkflow />
        </section>

        {/* 09: Interactive Canvas Talent Network */}
        <section id="sec-09">
          <LightSectionDivider
            index={9}
            id="bar-09"
            name="Interactive Talent Node Network"
            tech="HTML5 Canvas 2D + Physics"
            description="Interactive 60fps force-directed graph connecting executive skill clusters"
          />
          <LightInteractiveNetwork />
        </section>

        {/* 10: Scroll-Scrubbed Dashboard Assembly */}
        <section id="sec-10">
          <LightSectionDivider
            index={10}
            id="bar-10"
            name="Scroll-Scrubbed Dashboard Assembly"
            tech="GSAP Staggered Assembly"
            description="Analytics UI fragments converge seamlessly from perimeter into high-fidelity console"
          />
          <LightDashboardAssembly />
        </section>

        {/* 11: Modal Card Expansion with Deep Specs */}
        <section id="sec-11">
          <LightSectionDivider
            index={11}
            id="bar-11"
            name="Full Card Expansion on Click"
            tech="Framer Motion LayoutId"
            description="Smooth morphing from grid card into high-fidelity specification modal"
          />
          <LightCardExpandSection />
        </section>

        {/* 12: 3D Perspective Depth Corridor Base */}
        <section id="sec-12">
          <LightSectionDivider
            index={12}
            id="bar-12"
            name="3D Perspective Depth Corridor (Base)"
            tech="CSS 3D Transform + Scroll Scrub"
            description="Z-space depth corridor simulating an architectural capability walkthrough"
          />
          <LightPerspectiveCorridor />
        </section>

        {/* 13: Horizontal & Vertical Curtain Reveals */}
        <section id="sec-13">
          <LightSectionDivider
            index={13}
            id="bar-13"
            name="Dual-Axis Curtain Reveal"
            tech="Clip-Path + ScrollTrigger"
            description="Symmetric mask opening unveiling strategic talent infrastructure"
          />
          <LightCurtainReveal />
        </section>

        {/* 14: Split-Screen Dual Convergence */}
        <section id="sec-14">
          <LightSectionDivider
            index={14}
            id="bar-14"
            name="Split-Screen Convergence & Divergence"
            tech="GSAP Dual Translate"
            description="Bilateral panels slide inward to lock into an integrated architecture view"
          />
          <LightSplitScreenConvergence />
        </section>

        {/* 15: Radial Orbital Node Expansion */}
        <section id="sec-15">
          <LightSectionDivider
            index={15}
            id="bar-15"
            name="Radial Expansion & Collapse"
            tech="Framer Motion Trigonometric Scatter"
            description="Central nucleus bursting into peripheral specialization nodes on trigger"
          />
          <LightRadialExpansion />
        </section>

        {/* 16: Text Specification to UI Fragment Assembly */}
        <section id="sec-16">
          <LightSectionDivider
            index={16}
            id="bar-16"
            name="Text to Interface Assembly"
            tech="Morphing DOM Fragments"
            description="Raw candidate requirements dynamically crystallize into verified UI components"
          />
          <LightTextToInterface />
        </section>

        {/* 17: Blur to Sharp Focus Transition */}
        <section id="sec-17">
          <LightSectionDivider
            index={17}
            id="bar-17"
            name="Blur to Sharp Optical Reveal"
            tech="SVG Blur Filter + Scroll"
            description="Out-of-focus background imagery resolving to pixel-crisp executive precision"
          />
          <LightBlurTransition />
        </section>

        {/* 18: Algorithmic Data to Human Executive Transformation */}
        <section id="sec-18">
          <LightSectionDivider
            index={18}
            id="bar-18"
            name="Data to Human Transformation"
            tech="Dual-State Crossfade Morph"
            description="Abstract telemetry data stream dissolving into verified leadership profile"
          />
          <LightDataHumanTransformation />
        </section>

        {/* 19: Velocity Scroll Snapping & Atmospheric Shift */}
        <section id="sec-19">
          <LightSectionDivider
            index={19}
            id="bar-19"
            name="Scroll Snapping & Atmospheric Shift"
            tech="CSS Scroll-Snap + Interpolation"
            description="Precision viewport snapping with subtle background tint modulation"
          />
          <LightScrollSnappingStory />
        </section>

        {/* 20: Interactive Grid & Cursor Spotlight Follow */}
        <section id="sec-20">
          <LightSectionDivider
            index={20}
            id="bar-20"
            name="Interactive Grid & Cursor Spotlight"
            tech="Radial Gradient Pointer Event"
            description="Aceternity-style mouse-following radiant glow illuminating underlying matrix"
          />
          <LightBackgroundGridSpotlight />
        </section>

        {/* 21: Spring-Tethered Magnetic Cards & Accordion */}
        <section id="sec-21">
          <LightSectionDivider
            index={21}
            id="bar-21"
            name="Magnetic Cards & Visual Accordion"
            tech="Physics Spring Hover + Accordion"
            description="Cursor pull deflection with accordion expansion for multi-vertical exploration"
          />
          <LightMagneticCardAccordion />
        </section>

        {/* 22: Conventional vs NexaTalent Matrix */}
        <section id="sec-22">
          <LightSectionDivider
            index={22}
            id="bar-22"
            name="Before & After Precision Matrix"
            tech="Interactive Column Comparison"
            description="Direct comparison between traditional staffing agencies and NexaTalent GCC pods"
          />
          <LightBeforeAfterMatrix />
        </section>

        {/* 23: Asymmetric 4-Cell Light Bento Grid Architecture */}
        <section id="sec-23">
          <LightSectionDivider
            index={23}
            id="bar-23"
            name="Asymmetric Bento Architecture"
            tech="CSS Grid + Stagger Entrance"
            description="Modern 4-cell layout showcasing AI matching, GCC scale, and telemetry"
          />
          <LightBentoArchitecture />
        </section>

        {/* 24: Live Search Mandate Filter with Active Pills */}
        <section id="sec-24">
          <LightSectionDivider
            index={24}
            id="bar-24"
            name="Live Mandates Search Engine"
            tech="Client-side React State Filter"
            description="Real-time text query and category filtering across open enterprise mandates"
          />
          <LightJobMandatesSearch />
        </section>

        {/* 25: Live Verified Leadership Mandate Cards */}
        <section id="sec-25">
          <LightSectionDivider
            index={25}
            id="bar-25"
            name="Verified Mandate Cards Showcase"
            tech="Interactive State + Modal Intent"
            description="Rich job mandate cards with compensation tags, tech stacks, and quick apply"
          />
          <LightJobCardShowcase />
        </section>

        {/* 26: Verified Executive Roles Interactive Carousel */}
        <section id="sec-26">
          <LightSectionDivider
            index={26}
            id="bar-26"
            name="Leadership Spotlight Carousel"
            tech="Framer Motion Drag & Navigation"
            description="Horizontal sliding carousel spotlighting confidential VP and Director roles"
          />
          <LightFeaturedJobsCarousel />
        </section>

        {/* 27: Quantified 75-Day GCC Case Study */}
        <section id="sec-27">
          <LightSectionDivider
            index={27}
            id="bar-27"
            name="GCC Turnkey Outcome Master"
            tech="Metric Cards + Quantified ROI"
            description="Documented buildout of 120-engineer capability center in 75 days"
          />
          <LightCaseStudyMaster />
        </section>

        {/* 28: Challenge vs Solution Blueprint */}
        <section id="sec-28">
          <LightSectionDivider
            index={28}
            id="bar-28"
            name="Challenge vs Solution Architecture"
            tech="Dual Column Structural Contrast"
            description="Side-by-side diagnosis of bottlenecked recruitment vs calibrated execution"
          />
          <LightCaseStudyResultSplit />
        </section>

        {/* 29: 6 Specialized Technical Domain Practice Cards */}
        <section id="sec-29">
          <LightSectionDivider
            index={29}
            id="bar-29"
            name="Specialized Vertical Practice Grid"
            tech="6-Card Responsive Grid"
            description="Deep technical domains including GenAI, Cloud Platform, Quant, and Security"
          />
          <LightIndustryPracticeGrid />
        </section>

        {/* 30: Ultra Low-Latency FinTech & HFT Deep Dive */}
        <section id="sec-30">
          <LightSectionDivider
            index={30}
            id="bar-30"
            name="Ultra Low-Latency FinTech Spotlight"
            tech="Domain Deep-Dive Feature Split"
            description="Comprehensive analysis of high-frequency trading and low-latency systems hiring"
          />
          <LightIndustrySpotlight />
        </section>

        {/* 31: Strategic Hubs Explorer (Bangalore, London, SF, Hyderabad) */}
        <section id="sec-31">
          <LightSectionDivider
            index={31}
            id="bar-31"
            name="Strategic Global Hubs Explorer"
            tech="Interactive Tabbed Location Matrix"
            description="Talent density, salary differentials, and legal entities across 4 key technology hubs"
          />
          <LightLocationExplorer />
        </section>

        {/* 32: Drag & Drop Confidential Candidate Intake with NDA */}
        <section id="sec-32">
          <LightSectionDivider
            index={32}
            id="bar-32"
            name="Confidential Candidate Profile Drop"
            tech="Drag & Drop File Upload + NDA"
            description="Secure career portal for executive engineers and directors with strict privacy"
          />
          <LightCandidateProfileDrop />
        </section>

        {/* 33: 3-Step Enterprise Mandate Configurator with SLA */}
        <section id="sec-33">
          <LightSectionDivider
            index={33}
            id="bar-33"
            name="3-Step Enterprise Hiring Configurator"
            tech="Multi-Step Interactive Form"
            description="Calibrated scope builder with immediate SLA timeline and pod size estimates"
          />
          <LightHiringIntakeForm />
        </section>

        {/* 34: Direct Practice Lead Advisory Consultation */}
        <section id="sec-34">
          <LightSectionDivider
            index={34}
            id="bar-34"
            name="Direct Practice Lead Consultation"
            tech="Advisory Booking & Direct Intake"
            description="Direct connection with senior Managing Directors without junior gatekeepers"
          />
          <LightDirectContactSection />
        </section>

        {/* 35: Searchable Enterprise FAQ with Category Filtering */}
        <section id="sec-35">
          <LightSectionDivider
            index={35}
            id="bar-35"
            name="Enterprise Knowledge & FAQ Accordion"
            tech="Smooth Height AnimatePresence"
            description="Categorized responses addressing SLAs, pricing, guarantees, and vetting rigor"
          />
          <LightFAQAccordion />
        </section>

        {/* 36: Gated 2026 Compensation Guide with Instant Preview */}
        <section id="sec-36">
          <LightSectionDivider
            index={36}
            id="bar-36"
            name="2026 Compensation Index & Benchmark"
            tech="Interactive Table + Gated PDF Lead"
            description="Real percentile benchmarks (P25 to P90) across 65+ technical specializations"
          />
          <LightSalaryResourceCard />
        </section>

        {/* 37: Thought Leadership Research & Engineering Perspectives */}
        <section id="sec-37">
          <LightSectionDivider
            index={37}
            id="bar-37"
            name="Executive Research & Perspectives"
            tech="Article Cards + Bookmark State"
            description="Technical papers on GCC structuring, LLM architect evaluations, and equity models"
          />
          <LightEditorialInsightCard />
        </section>

        {/* 38: 3-Tier Commercial Engagement Matrix */}
        <section id="sec-38">
          <LightSectionDivider
            index={38}
            id="bar-38"
            name="Commercial Models & Service Tiers"
            tech="Annual/Flexible Toggle + Pricing Grid"
            description="Contingent Search vs Retained Executive Pod vs Turnkey BOT Capability Center"
          />
          <LightServiceTierComparison />
        </section>

        {/* 39: SOC2, ISO 27001, GDPR Enterprise Compliance Standards */}
        <section id="sec-39">
          <LightSectionDivider
            index={39}
            id="bar-39"
            name="Enterprise Trust & Security Badges"
            tech="4-Pillar Compliance Grid"
            description="SOC 2 Type II, ISO 27001, GDPR compliance, and 180-day guarantee warranty"
          />
          <LightTrustSignalStrip />
        </section>

        {/* 40: 5-Axis Seniority & Competency Radar */}
        <section id="sec-40">
          <LightSectionDivider
            index={40}
            id="bar-40"
            name="5-Axis Seniority & Competency Radar"
            tech="Dynamic SVG Polygon + Springs"
            description="Multi-dimensional competency assessment across architecture, concurrency, and AI"
            isSpecial={true}
          />
          <SignatureTalentRadar />
        </section>

        {/* 41: Geo-Orbital GCC Relocation Flight Paths */}
        <section id="sec-41">
          <LightSectionDivider
            index={41}
            id="bar-41"
            name="Geo-Orbital GCC Relocation & Pod Corridors"
            tech="Animated SVG Arc + Live Arbitrage"
            description="Interactive flight paths and talent cost arbitrage between Western tech hubs and India"
            isSpecial={true}
          />
          <SignatureGCCFlightPath />
        </section>

        {/* 42: Production Code Vetting Terminal */}
        <section id="sec-42">
          <LightSectionDivider
            index={42}
            id="bar-42"
            name="Production Code Vetting Terminal"
            tech="Interactive Console + Execution Harness"
            description="High-tech terminal running lockless C++, Raft consensus, and CUDA flash-attention tests"
            isSpecial={true}
          />
          <SignatureCodeVettingTerminal />
        </section>

        {/* 43: 3D Fluid Tilt Deck & Client Proof */}
        <section id="sec-43">
          <LightSectionDivider
            index={43}
            id="bar-43"
            name="3D Fluid Tilt Deck & Executive Outcomes"
            tech="3D Spring Tilt + Specular Glare"
            description="Dynamic cursor-following tilt cards displaying verified Tier-1 client deployments"
            isSpecial={true}
          />
          <SignatureLiquidTiltDeck />
        </section>

        {/* 44: Cross-Border Compensation Heatmap Matrix */}
        <section id="sec-44">
          <LightSectionDivider
            index={44}
            id="bar-44"
            name="Cross-Border Compensation Heatmap Matrix"
            tech="Dynamic Normalized Comp Bars"
            description="Interactive compensation bands, equity splits, and purchasing-power indices"
            isSpecial={true}
          />
          <SignatureCompensationHeatmap />
        </section>

        {/* 45: Precision Velocity Timeline Dial */}
        <section id="sec-45">
          <LightSectionDivider
            index={45}
            id="bar-45"
            name="Precision Velocity Timeline Dial"
            tech="Interactive Stepper + Artifact Reveal"
            description="Scrub through Day 1 calibration to Day 75 turnkey 120-engineer center deployment"
            isSpecial={true}
          />
          <SignatureInteractiveTimelineDial />
        </section>

        {/* 46: Interactive Before/After Comparison Slider */}
        <section id="sec-46">
          <LightSectionDivider
            index={46}
            id="bar-46"
            name="Interactive Talent Velocity Slider"
            tech="Draggable Split-Screen Slider"
            description="Direct comparison between traditional staffing agencies and NexaTalent pods"
            isSpecial={true}
          />
          <SignatureTalentComparisonSlider />
        </section>

        {/* 47: Interactive Engineering Squad Architect */}
        <section id="sec-47">
          <LightSectionDivider
            index={47}
            id="bar-47"
            name="Engineering Squad Architect & Simulator"
            tech="Interactive Headcount + SLA Output"
            description="Compose engineering pods in real time with dynamic monthly burn and timeline calculation"
            isSpecial={true}
          />
          <SignatureHiringSquadBuilder />
        </section>

        {/* 48: Interactive Physics Particle Typography */}
        <section id="sec-48">
          <LightSectionDivider
            index={48}
            id="bar-48"
            name="Interactive Physics Particle Typography"
            tech="Canvas 2D Spring Particle Simulation"
            description="450+ physics particles forming dynamic headlines that repel cursor interactions"
            isSpecial={true}
          />
          <SignatureParticleTextMorph />
        </section>

        {/* 49: 4-Layer Executive Guarantee Shield */}
        <section id="sec-49">
          <LightSectionDivider
            index={49}
            id="bar-49"
            name="4-Layer Executive Guarantee Shield"
            tech="Multi-Layer Covenant Unpacking"
            description="180-day warranty, 100% IP transfer covenant, SOC 2 Type II, and escrow protections"
            isSpecial={true}
          />
          <SignatureExecutivePledgeShield />
        </section>

        {/* 50: 3D Perspective Depth Corridor - Variation 1 */}
        <section id="sec-50">
          <LightSectionDivider
            index={50}
            id="bar-50"
            name="3D Depth Corridor V1: 4-Gate Vetting Tunnel"
            tech="3D Perspective GSAP Scrub"
            description="Stepping through 4 technical vetting gates filtering out 96.5% of candidate noise"
            isSpecial={true}
          />
          <CorridorVettingTunnel />
        </section>

        {/* 51: 3D Perspective Depth Corridor - Variation 2 */}
        <section id="sec-51">
          <LightSectionDivider
            index={51}
            id="bar-51"
            name="3D Depth Corridor V2: GCC 75-Day Pipeline"
            tech="3D Perspective GSAP Scrub"
            description="From incorporation to 120 senior engineers operating with full IP autonomy in 75 days"
            isSpecial={true}
          />
          <CorridorGCCPipeline />
        </section>

        {/* 52: 3D Perspective Depth Corridor - Variation 3 */}
        <section id="sec-52">
          <LightSectionDivider
            index={52}
            id="bar-52"
            name="3D Depth Corridor V3: Deep-Tech Architectural Vault"
            tech="3D Perspective GSAP Scrub"
            description="Frontier domains: FPGA low-latency, distributed consensus Raft, and GPU vLLM kernels"
            isSpecial={true}
          />
          <CorridorTechVault />
        </section>

        {/* 53: Multi-Layer Vertical Parallax with Independent Speed Scrub */}
        <section id="sec-53">
          <LightSectionDivider
            index={53}
            id="bar-53"
            name="Multi-Layer Depth Parallax (3 Independent Speeds)"
            tech="Multi-Layer Parallax Scrub"
            description="3 distinct overlapping cards moving at 0.5x, 0.85x, and 1.25x optical scrub velocities"
            isSpecial={true}
          />
          <ParallaxMultiLayerSplit />
        </section>

        {/* 54: 3D Floating Metrics & Hologram Parallax */}
        <section id="sec-54">
          <LightSectionDivider
            index={54}
            id="bar-54"
            name="Volumetric Metric Parallax Constellation"
            tech="3D Parallax Velocity Deflection"
            description="6 floating metric cards moving at independent velocities and rotational angles on scroll"
            isSpecial={true}
          />
          <ParallaxDepthFloatMatrix />
        </section>

        {/* 55: Pinned Horizontal Rail - 5 GCC Case Studies */}
        <section id="sec-55">
          <LightSectionDivider
            index={55}
            id="bar-55"
            name="Horizontal Rail: 5 Turnkey GCC Deployments"
            tech="Pinned Horizontal GSAP Scrub"
            description="Vertical scroll triggers lateral track movement across 5 global GCC success stories"
            isSpecial={true}
          />
          <HorizontalCardsRail />
        </section>

        {/* 56: Pinned Horizontal Rail - Live Leadership Mandates */}
        <section id="sec-56">
          <LightSectionDivider
            index={56}
            id="bar-56"
            name="Horizontal Rail: Live Executive Mandates"
            tech="Pinned Horizontal GSAP Scrub"
            description="Horizontal sliding deck displaying verified open VP, Director, and Architect searches"
            isSpecial={true}
          />
          <HorizontalMandateShowcase />
        </section>

        {/* 57: One-Side Sticky Pin - Left Pinned Dashboard, Right Milestones */}
        <section id="sec-57">
          <LightSectionDivider
            index={57}
            id="bar-57"
            name="One-Side Sticky Pin: Left Dashboard, Right Milestones"
            tech="CSS Sticky Pin + ScrollTrigger"
            description="Left executive health gauge stays pinned while right side scrolls through 5 milestones"
            isSpecial={true}
          />
          <OneSideStickySplitMilestones />
        </section>

        {/* 58: One-Side Sticky Pin - Left Scrolling Rubric, Right Sticky Terminal */}
        <section id="sec-58">
          <LightSectionDivider
            index={58}
            id="bar-58"
            name="One-Side Sticky Pin: Left Rubric, Right Sticky Terminal"
            tech="CSS Sticky Pin + Reactive State"
            description="Left side scrolls through technical rubrics while right side live terminal stays pinned"
            isSpecial={true}
          />
          <OneSideStickyFeatureStack />
        </section>

        {/* 59: Two Sections Sticky Pin & Bilateral Convergence */}
        <section id="sec-59">
          <LightSectionDivider
            index={59}
            id="bar-59"
            name="Two Sections Sticky Pin: Bilateral Convergence"
            tech="Dual Pinned GSAP Convergence"
            description="Challenge and solution panels pin and slide inward to lock into center SLA blueprint"
            isSpecial={true}
          />
          <TwoSectionDualStickyConvergence />
        </section>

        {/* 60: Two Sections Sticky Pin: Sponsor & Squad Architecture */}
        <section id="sec-60">
          <LightSectionDivider
            index={60}
            id="bar-60"
            name="Two Sections Sticky Pin: Sponsor & Squad Structure"
            tech="Dual Pinned Comparison Scrub"
            description="Synchronized pinned view of executive endorsement and exact trading pod hierarchy"
            isSpecial={true}
          />
          <TwoSectionDualStickyComparison />
        </section>

        {/* 61: Vertical Parallax Section - 75-Day GCC Turnaround */}
        <section id="sec-61">
          <LightSectionDivider
            index={61}
            id="bar-61"
            name="Vertical Parallax: 75-Day GCC Scale Story"
            tech="Vertical Parallax Background Masking"
            description="Differential vertical card shifts over massive parallax background typography"
            isSpecial={true}
          />
          <VerticalParallaxCaseStudy />
        </section>

        {/* 62: Vertical Parallax Section - Cross-Border Talent Arbitrage */}
        <section id="sec-62">
          <LightSectionDivider
            index={62}
            id="bar-62"
            name="Vertical Parallax: Cross-Border Capital Arbitrage"
            tech="Vertical Parallax Speed Dampening"
            description="Watch SF, New York, London, and Bangalore comp differentials shift vertically on scroll"
            isSpecial={true}
          />
          <VerticalParallaxTalentArb />
        </section>

        {/* 63: Pinned Sticky Section with Dynamic Accordion Unfold */}
        <section id="sec-63">
          <LightSectionDivider
            index={63}
            id="bar-63"
            name="Pinned Section: Progressive Accordion Unfold"
            tech="Pinned ScrollTrigger Unfold"
            description="Screen pins while 4 successive tiers of the BOT enterprise covenant unfold dynamically"
            isSpecial={true}
          />
          <StickyPinAccordionReveal />
        </section>

        {/* 64: Pinned Interactive 360 Radial Progress Reveal */}
        <section id="sec-64">
          <LightSectionDivider
            index={64}
            id="bar-64"
            name="Pinned Section: 360° Radial Progress Dial"
            tech="Pinned SVG Radial Progress Scrub"
            description="Central 360-degree circular dial fills 0% to 100% on scroll, unlocking legal covenants"
            isSpecial={true}
          />
          <PinnedCircularProgressReveal />
        </section>

        {/* 65: Dual Pinned Bilateral Launchpad & Mandate Booking */}
        <section id="sec-65">
          <LightSectionDivider
            index={65}
            id="bar-65"
            name="Dual Pinned Section: Pod Launchpad Configurator"
            tech="Dual Pinned Scale Convergence"
            description="Bilateral clamps lock onto an interactive executive mandate intake configurator"
            isSpecial={true}
          />
          <DualPinnedConvergenceShowcase />
        </section>

        {/* 66: Pinned 360° Radial Variation 1: Gyroscopic Orbital Dial */}
        <section id="sec-66">
          <LightSectionDivider
            index={66}
            id="bar-66"
            name="Pinned 360° Radial: Gyroscopic Orbital Dial"
            tech="GSAP Pin + Orbital Trigonometry"
            description="Triple-orbital gyroscopic counter-rotating candidate vetting dial"
            isSpecial={true}
          />
          <PinnedOrbitalHologramDial />
        </section>

        {/* 67: Pinned 360° Radial Variation 2: Hexagonal Radar */}
        <section id="sec-67">
          <LightSectionDivider
            index={67}
            id="bar-67"
            name="Pinned 360° Radial: Hexagonal Caliper Radar"
            tech="GSAP Pin + Polygonal Polar Scrub"
            description="6-axis expanding hexagonal caliper telemetry radar"
            isSpecial={true}
          />
          <PinnedRadialHexagonRadar />
        </section>

        {/* 68: Pinned 360° Radial Variation 3: Precision Tachometer Gauge */}
        <section id="sec-68">
          <LightSectionDivider
            index={68}
            id="bar-68"
            name="Pinned 360° Radial: Precision Speedometer Gauge"
            tech="Dual Arc Sweep + Dynamic Needle Pin"
            description="Dual precision tachometers tracking GCC ramp speed and talent yield"
            isSpecial={true}
          />
          <PinnedSpeedometerGauge />
        </section>

        {/* 69: Vertical Parallax Variation 1: Isometric Campus Ramp */}
        <section id="sec-69">
          <LightSectionDivider
            index={69}
            id="bar-69"
            name="Vertical Parallax: 4-Tier Isometric Campus Ramp"
            tech="Multi-Speed Scroll Scrub"
            description="Isometric 4-tier capability campus stack unfolding on scroll"
            isSpecial={true}
          />
          <ParallaxIsometricCityRamp />
        </section>

        {/* 70: Vertical Parallax Variation 2: Floating Code Terminal Hologram */}
        <section id="sec-70">
          <LightSectionDivider
            index={70}
            id="bar-70"
            name="Vertical Parallax: Floating Code Hologram"
            tech="Differential Z-Axis Floating Holograms"
            description="Dual floating code terminal holograms revealing real-time AST analysis"
            isSpecial={true}
          />
          <ParallaxFloatingCodeHologram />
        </section>

        {/* 71: Vertical Parallax Variation 3: HFT Waveform Telemetry */}
        <section id="sec-71">
          <LightSectionDivider
            index={71}
            id="bar-71"
            name="Vertical Parallax: HFT Pulse Waveform Telemetry"
            tech="Audio/Quant Waveform Scroll Modulation"
            description="HFT market pulse & dynamic waveform telemetry synchronized to scroll"
            isSpecial={true}
          />
          <ParallaxWaveformSounding />
        </section>

        {/* 72: Signature Scroll Animation 1: Magnetic 3D Cursor Deck */}
        <section id="sec-72">
          <LightSectionDivider
            index={72}
            id="bar-72"
            name="Signature: Magnetic 3D Cursor Deck"
            tech="Magnetic Cursor Physics + Spring Vector"
            description="Spring-loaded 3D tilt deck with magnetic cursor attraction"
            isSpecial={true}
          />
          <SignatureMagneticCursorDeck />
        </section>

        {/* 73: Signature Scroll Animation 2: Morphing Shape SVG */}
        <section id="sec-73">
          <LightSectionDivider
            index={73}
            id="bar-73"
            name="Signature: Liquid Morphing Shape SVG"
            tech="Organic Cubic Bezier Spline Morph"
            description="Liquid morphing SVG fluid dynamics reacting to vertical scroll"
            isSpecial={true}
          />
          <SignatureMorphingShapeSVG />
        </section>

        {/* 74: Signature Scroll Animation 3: Split Text Decryption Scramble */}
        <section id="sec-74">
          <LightSectionDivider
            index={74}
            id="bar-74"
            name="Signature: Decryption Text Scramble"
            tech="Glyph Cycling & Matrix Decryption"
            description="Scroll-triggered cyberpunk textual decryption and character unscramble"
            isSpecial={true}
          />
          <SignatureSplitTextScramble />
        </section>

        {/* 75: Signature Scroll Animation 4: 3D Flip Specification Cards */}
        <section id="sec-75">
          <LightSectionDivider
            index={75}
            id="bar-75"
            name="Signature: 3D Flip Specification Cards"
            tech="180° CSS 3D Preserve-3D Flip"
            description="Interactive card flip revealing deep technical specs and metrics"
            isSpecial={true}
          />
          <SignatureInteractiveFlipCards />
        </section>

        {/* 76: Signature Scroll Animation 5: Sticky Curved Path Vector Laser */}
        <section id="sec-76">
          <LightSectionDivider
            index={76}
            id="bar-76"
            name="Signature: Sticky Curved Path Vector Beam"
            tech="Cubic Bezier PathLength Travelling Laser"
            description="Glowing vector energy pulse tracing an S-curve across pinned narrative cards"
            isSpecial={true}
          />
          <SignatureStickyCurvedPath />
        </section>

        {/* 77: Signature Scroll Animation 6: Sticky Spotlight Intelligence Accordion */}
        <section id="sec-77">
          <LightSectionDivider
            index={77}
            id="bar-77"
            name="Signature: Mouse-Following Spotlight Accordion"
            tech="Dynamic Radial Gradient Mouse Tracking"
            description="Radial spotlight illumination beam tracking cursor over talent accordions"
            isSpecial={true}
          />
          <SignatureStickySpotlightAccordion />
        </section>

        {/* 78: Signature Scroll Animation 7: Live Arbitrage Matrix Slider */}
        <section id="sec-78">
          <LightSectionDivider
            index={78}
            id="bar-78"
            name="Signature: Live Arbitrage Matrix Calculator"
            tech="Real-time Capital Arbitrage Multi-Slider"
            description="Dynamic mathematical financial model calculating multi-year GCC savings"
            isSpecial={true}
          />
          <SignatureLiveArbitrageMatrixSlider />
        </section>

        {/* 79: Signature Scroll Animation 8: Volumetric Voxel Cube Stack */}
        <section id="sec-79">
          <LightSectionDivider
            index={79}
            id="bar-79"
            name="Signature: 4-Tier Volumetric Talent Cube"
            tech="Isometric 3D Rotation + Exploded View"
            description="3D isometric voxel stack deconstructing into four enterprise layers"
            isSpecial={true}
          />
          <SignatureVolumetricCubeStack />
        </section>

        {/* 80: Full-Screen Dual Pinned Convergence 01: Holographic Launchpad */}
        <section id="sec-80">
          <LightSectionDivider index={80} id="bar-80" name="Full-Screen Dual Pinned: Holographic Launchpad" tech="Dual 100vw Bilateral Clamp" description="Full-viewport edge clamps converging on central holographic quantum pod" isSpecial={true} />
          <FullScreenDualPinnedConvergenceHolo />
        </section>

        {/* 81: Full-Screen Dual Pinned Convergence 02: Sovereign Vault */}
        <section id="sec-81">
          <LightSectionDivider index={81} id="bar-81" name="Full-Screen Dual Pinned: Sovereign Vault" tech="Bilateral Vault Hydraulic Seal" description="Two heavy sovereign security vaults converging symmetrically into ironclad core" isSpecial={true} />
          <FullScreenDualPinnedConvergenceVault />
        </section>

        {/* 82: Full-Screen Dual Pinned Convergence 03: Demand/Supply Matrix */}
        <section id="sec-82">
          <LightSectionDivider index={82} id="bar-82" name="Full-Screen Dual Pinned: Demand-Supply Matrix" tech="Bilateral Data Convergence Bridge" description="US Market Demands vs India Tech Capacity converging into quantum hiring bridge" isSpecial={true} />
          <FullScreenDualPinnedConvergenceMatrix />
        </section>

        {/* 83: Full-Screen Dual Pinned Convergence 04: Chromatic Prism */}
        <section id="sec-83">
          <LightSectionDivider index={83} id="bar-83" name="Full-Screen Dual Pinned: Chromatic Prism" tech="Dual Refractive Gate Polar Lock" description="Two crystalline refractive prism gates sliding from full viewport width to converge into central lens" isSpecial={true} />
          <FullScreenDualPinnedConvergencePrism />
        </section>

        {/* 84: Full-Screen Vertical Parallax 01: Multi-Speed Mesh Strata */}
        <section id="sec-84">
          <LightSectionDivider index={84} id="bar-84" name="Full-Screen Vertical Parallax: Mesh Strata" tech="3-Tier Differential Speed Scrub" description="Animated fluid mesh canvas with multi-speed floating glass architectural slabs" isSpecial={true} />
          <FullScreenVerticalParallaxMesh />
        </section>

        {/* 85: Full-Screen Vertical Parallax 02: Volumetric Constellation */}
        <section id="sec-85">
          <LightSectionDivider index={85} id="bar-85" name="Full-Screen Vertical Parallax: Constellation" tech="4D Celestial Field Matrix Scrub" description="Volumetric particle constellation with floating 3D talent nodes and glowing gravitational orbits" isSpecial={true} />
          <FullScreenVerticalParallaxConstellation />
        </section>

        {/* 86: Full-Screen Vertical Parallax 03: Atmospheric Depth Elevation */}
        <section id="sec-86">
          <LightSectionDivider index={86} id="bar-86" name="Full-Screen Vertical Parallax: Atmospheric Elevation" tech="Atmospheric Multi-Layer Cloud Scrub" description="Atmospheric depth layers with floating executive dossiers and speed-differentiated telemetry" isSpecial={true} />
          <FullScreenVerticalParallaxAtmosphere />
        </section>

        {/* 87: Full-Screen Vertical Parallax 04: Deep Ocean Sonar Scanner */}
        <section id="sec-87">
          <LightSectionDivider index={87} id="bar-87" name="Full-Screen Vertical Parallax: Deep Ocean Sonar" tech="Bioluminescent Sonar Pulse Scrub" description="Sub-surface passive talent scanner with multi-depth sonar rings and floating pods" isSpecial={true} />
          <FullScreenVerticalParallaxDeepOcean />
        </section>

        {/* 88: Full-Screen Horizontal Parallax 01: Multi-Track Rail */}
        <section id="sec-88">
          <LightSectionDivider index={88} id="bar-88" name="Full-Screen Horizontal Parallax: Multi-Track Rail" tech="GSAP Pinned Multi-Speed Lateral Scrub" description="Multi-track horizontal parallax rail with background text and foreground talent cards" isSpecial={true} />
          <FullScreenHorizontalParallaxRail />
        </section>

        {/* 89: Full-Screen Horizontal Parallax 02: Panoramic Campus Tour */}
        <section id="sec-89">
          <LightSectionDivider index={89} id="bar-89" name="Full-Screen Horizontal Parallax: Campus Tour" tech="Panoramic Lateral Stage Scrub" description="Panoramic tour moving horizontally across Bangalore, Hyderabad, London, and SF centers" isSpecial={true} />
          <FullScreenHorizontalParallaxInfiniteCampus />
        </section>

        {/* 90: Full-Screen Horizontal Parallax 03: 75-Day Timeline Matrix */}
        <section id="sec-90">
          <LightSectionDivider index={90} id="bar-90" name="Full-Screen Horizontal Parallax: Timeline Matrix" tech="Horizontal Chronometer Track Scrub" description="Horizontal chronometer tracking 75-day enterprise GCC ramp milestones" isSpecial={true} />
          <FullScreenHorizontalParallaxTimelineMatrix />
        </section>

        {/* 91: Full-Screen Pattern 19: Split-Screen Convergence Hero */}
        <section id="sec-91">
          <LightSectionDivider index={91} id="bar-91" name="Pattern 19: Split-Screen Convergence Hero" tech="100vw Seam Convergence" description="Left and Right screens slide together to meet at 50/50 center seam forming unified console" isSpecial={true} />
          <FullScreenSplitConvergenceHero />
        </section>

        {/* 92: Full-Screen Pattern 20: Split-Screen Divergence Executive */}
        <section id="sec-92">
          <LightSectionDivider index={92} id="bar-92" name="Pattern 20: Split-Screen Divergence Executive" tech="Bilateral Full-Width Divergence" description="Central monolithic shields diverge outward to viewport edges revealing internal talent core" isSpecial={true} />
          <FullScreenSplitDivergenceExecutive />
        </section>

        {/* 93: Full-Screen Pattern 19: Bilateral Code Review Convergence */}
        <section id="sec-93">
          <LightSectionDivider index={93} id="bar-93" name="Pattern 19: Bilateral Code Convergence" tech="Terminal Code Convergence" description="Left and Right code screens slide together into an approved pull-request pipeline" isSpecial={true} />
          <FullScreenSplitConvergenceBilateralCode />
        </section>

        {/* 94: Full-Screen Pattern 20: 4X Talent Arbitrage Divergence */}
        <section id="sec-94">
          <LightSectionDivider index={94} id="bar-94" name="Pattern 20: Talent Arbitrage Divergence" tech="Pod Symmetrical Divergence" description="Single US salary budget diverges dynamically into 4 high-performance GCC pods" isSpecial={true} />
          <FullScreenSplitDivergenceTalentArb />
        </section>

        {/* 95: Full-Screen Pattern 17: Horizontal Split Curtain */}
        <section id="sec-95">
          <LightSectionDivider index={95} id="bar-95" name="Pattern 17: Horizontal Split Curtain" tech="100vw Horizontal Metallic Parting" description="Left and right full-width metallic curtains slide outward to reveal sovereign executive cockpit" isSpecial={true} />
          <FullScreenHorizontalSplitCurtain />
        </section>

        {/* 96: Full-Screen Pattern 18: Vertical Split Curtain */}
        <section id="sec-96">
          <LightSectionDivider index={96} id="bar-96" name="Pattern 18: Vertical Split Curtain" tech="Vertical Shutter Parting" description="Top and bottom shutter panels split vertically revealing global talent radar map" isSpecial={true} />
          <FullScreenVerticalSplitCurtain />
        </section>

        {/* 97: Full-Screen Pattern 17: Laser Incision Split Curtain */}
        <section id="sec-97">
          <LightSectionDivider index={97} id="bar-97" name="Pattern 17: Laser Incision Split Curtain" tech="Laser Pulse + Horizontal Curtain Parting" description="Center laser line separates two side panels revealing high-frequency quant telemetry" isSpecial={true} />
          <FullScreenHorizontalSplitCurtainLaser />
        </section>

        {/* 98: Full-Screen Pattern 18: Vertical Aperture Shutter Blind */}
        <section id="sec-98">
          <LightSectionDivider index={98} id="bar-98" name="Pattern 18: Vertical Aperture Shutter Blind" tech="Multi-Slat 3D Aperture Rotation" description="Vertical aperture blinds rotating and sliding up/down revealing GCC leadership directory" isSpecial={true} />
          <FullScreenVerticalSplitCurtainAperture />
        </section>

        {/* 99: Full-Screen Diagonal Geometric Curtain Convergence */}
        <section id="sec-99">
          <LightSectionDivider index={99} id="bar-99" name="Diagonal Geometric Curtain Convergence" tech="Diagonal Polygon Slicing" description="Diagonal geometric curtains slicing across full screen to form diamond window" isSpecial={true} />
          <FullScreenDiagonalCurtainConvergence />
        </section>

        {/* 100: Grand Finale Scale-to-Edge Action Banner */}
        <section id="sec-100">
          <LightSectionDivider
            index={100}
            id="bar-100"
            name="Grand Finale: Scale-to-Edge Action Banner"
            tech="GSAP ScrollTrigger Edge Expand"
            description="Card container seamlessly expands to full viewport width on final scroll"
            isSpecial={true}
          />
          <LightFinalCTAExpansion />
        </section>

      </main>

      {/* Modern Light Theme Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base">
                  N
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">NexaTalent</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                The premier talent infrastructure and executive search firm for Global Capability Centers, 
                Tier-1 technology platforms, and high-growth engineering organizations.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Engineering Practices</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">AI & Machine Learning Infrastructure</li>
                <li className="hover:text-white transition-colors cursor-pointer">Ultra Low-Latency & Quant Systems</li>
                <li className="hover:text-white transition-colors cursor-pointer">Cloud Platform & Distributed Systems</li>
                <li className="hover:text-white transition-colors cursor-pointer">Enterprise Cyber & Cryptographic Security</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Talent Hubs</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Bangalore • Indiranagar & Outer Ring Rd</li>
                <li className="hover:text-white transition-colors cursor-pointer">Hyderabad • HITEC City & Financial District</li>
                <li className="hover:text-white transition-colors cursor-pointer">London • Bank & Canary Wharf</li>
                <li className="hover:text-white transition-colors cursor-pointer">San Francisco • SoMa & Silicon Valley</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Motion Engineering</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                All 100 components engineered with pure light design tokens, 60fps Framer Motion springs, and GSAP ScrollTrigger timeline pins.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400">
                <Code2 className="w-4 h-4" />
                <span>100 of 100 Sections Verified</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 NexaTalent Inc. All rights reserved. SOC 2 Type II & ISO 27001 Certified.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-300 cursor-pointer">Privacy Notice</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms of Representation</span>
              <span className="hover:text-slate-300 cursor-pointer">Security Whitepaper</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-8 right-8 z-40 p-3.5 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

    </div>
  );
};
