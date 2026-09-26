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

// Import all 40 light-theme modern components
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
  LightFinalCTAExpansion
} from '../components/light-motion';

interface SectionBannerProps {
  index: number;
  id: string;
  name: string;
  tech: string;
  description: string;
}

const LightSectionDivider: React.FC<SectionBannerProps> = ({ index, id, name, tech, description }) => (
  <div 
    id={id}
    className="w-full bg-slate-100/70 border-y border-slate-200/80 px-6 py-3.5 backdrop-blur-md sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 text-xs"
  >
    <div className="flex items-center gap-3">
      <span className="font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[11px] shadow-sm">
        {String(index).padStart(2, '0')} / 40
      </span>
      <h3 className="font-bold text-slate-800 text-sm tracking-tight m-0">
        {name}
      </h3>
      <span className="hidden md:inline text-slate-400">•</span>
      <span className="hidden md:inline text-slate-500 font-medium">
        {description}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] shadow-xs">
        <Zap className="w-3 h-3 text-blue-600" />
        {tech}
      </span>
    </div>
  </div>
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
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      
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
            <span>NexaTalent Production Motion Showcase • Complete 40 Components</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
          >
            All 40 Modern Light-Theme <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
              Animated Sections Showcase
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Pure, seamless sequential presentation with consistent typography, crisp slate-900 hierarchy, 
            Lenis smooth scrolling, one-side sticky pinned timelines, parallax hero imagery, and scrubbed storytelling.
          </motion.p>

          {/* Key Feature Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>40 Complete Sections</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Light Theme</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sticky Pinning & Parallax</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>GSAP + Lenis + Motion</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 40 SEQUENTIAL SECTIONS */}
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

        {/* 12: 3D Perspective Depth Corridor */}
        <section id="sec-12">
          <LightSectionDivider
            index={12}
            id="bar-12"
            name="3D Perspective Depth Corridor"
            tech="CSS 3D Transform + Scroll Scrub"
            description="Z-space depth corridor simulating an architectural walkthrough"
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

        {/* 40: Dynamic Full-Width Scale Final CTA */}
        <section id="sec-40">
          <LightSectionDivider
            index={40}
            id="bar-40"
            name="Final Scale-to-Edge Action Banner"
            tech="GSAP ScrollTrigger Edge Expand"
            description="Card container seamlessly expands to full viewport width on final scroll"
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
                All 40 components engineered with pure light design tokens, 60fps Framer Motion springs, and GSAP ScrollTrigger timeline pins.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400">
                <Code2 className="w-4 h-4" />
                <span>40 of 40 Sections Verified</span>
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
