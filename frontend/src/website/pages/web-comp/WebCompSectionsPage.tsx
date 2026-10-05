import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Search, ArrowUp, Sparkles, Hash } from 'lucide-react';

import * as S1 from '../../components/web-comp/WcModularSections1';
import * as S2 from '../../components/web-comp/WcModularSections2';
import * as S3 from '../../components/web-comp/WcModularSections3';
import * as S4 from '../../components/web-comp/WcModularSections4';

import {
  RecHiringMadeEasy,
  RecShapingLandscape,
  RecSmartPersonalization,
  RecExpertDesigned,
  RecCuriosityCreativity,
  RecPersadoCards,
  RecCurrentOpenings,
  RecBuildSkills,
  RecCraftingGrowth,
  RecSeamlessIntegration
} from '../../components/web-comp/WcRecruiterSections';

import {
  WsHowWeWork,
  WsBrandingConcepts,
  WsWorkflow,
  WsWorkWithUs,
  WsSeamlessHiring,
  WsComprehensiveCare,
  WsWhatWeDo,
  WsBenefits,
  WsCoreFeatures,
  WsExpertServices,
  WsApartAcademy,
  WsTestimonials,
  WsExploreTalent,
  WsStatsBento,
  ScrollProgressBar
} from '../../components/web-comp/WcSections';

interface SectionMeta {
  id: string;
  name: string;
  category: 'Bento & Features' | 'Workflows & Process' | 'Stats & ROI' | 'Talent & Dossiers' | 'GCC Corridors' | 'Pricing & Plans' | 'Trust & Security' | 'FAQs & Support' | 'CTAs & Banners' | 'Code & DevX' | 'Comparisons' | 'Legacy Showcase';
  Component: React.ComponentType;
}

const SECTIONS: SectionMeta[] = [
  // 100 Modular Sections
  { id: 'sec-1', name: 'SEC-001 — Dribbble Bento Grid Features', category: 'Bento & Features', Component: S1.Sec1BentoFeatures },
  { id: 'sec-2', name: 'SEC-002 — 4-Step Process Timeline', category: 'Workflows & Process', Component: S1.Sec2ProcessTimeline },
  { id: 'sec-3', name: 'SEC-003 — Statistics & ROI Metrics Grid', category: 'Stats & ROI', Component: S1.Sec3StatsMetricsGrid },
  { id: 'sec-4', name: 'SEC-004 — Vetted Candidate Dossier Cards', category: 'Talent & Dossiers', Component: S1.Sec4TalentCardsGrid },
  { id: 'sec-5', name: 'SEC-005 — GCC Regional Hub Corridors', category: 'GCC Corridors', Component: S1.Sec5GccHubCorridors },
  { id: 'sec-6', name: 'SEC-006 — Client Logo Marquee Wall', category: 'Trust & Security', Component: S1.Sec6ClientLogosMarquee },
  { id: 'sec-7', name: 'SEC-007 — Featured CTO Testimonial Quote', category: 'Trust & Security', Component: S1.Sec7TestimonialCarousel },
  { id: 'sec-8', name: 'SEC-008 — Tech Stack Matrix', category: 'Code & DevX', Component: S1.Sec8TechStackMatrix },
  { id: 'sec-9', name: 'SEC-009 — Interactive Pricing & Savings Estimator', category: 'Pricing & Plans', Component: S1.Sec9InteractivePricingCalculator },
  { id: 'sec-10', name: 'SEC-010 — Enterprise Security Shield Grid', category: 'Trust & Security', Component: S1.Sec10SecurityShield },
  { id: 'sec-11', name: 'SEC-011 — Interactive FAQ Accordion', category: 'FAQs & Support', Component: S1.Sec11FaqAccordion },
  { id: 'sec-12', name: 'SEC-012 — Full-Width Gradient CTA Banner', category: 'CTAs & Banners', Component: S1.Sec12CtaGradientBanner },
  { id: 'sec-13', name: 'SEC-013 — Code Vetting Terminal Logs', category: 'Code & DevX', Component: S1.Sec13CodeVettingTerminal },
  { id: 'sec-14', name: 'SEC-014 — Versus Comparison Table', category: 'Comparisons', Component: S1.Sec14VersusComparisonTable },
  { id: 'sec-15', name: 'SEC-015 — Company Core Values Grid', category: 'Bento & Features', Component: S1.Sec15CompanyValuesGrid },
  { id: 'sec-16', name: 'SEC-016 — Candidate Video Preview Pill', category: 'Talent & Dossiers', Component: S1.Sec16CandidateVideoPill },
  { id: 'sec-17', name: 'SEC-017 — Feature Split Layout Image Right', category: 'Bento & Features', Component: S1.Sec17FeatureSplitImageRight },
  { id: 'sec-18', name: 'SEC-018 — Programmatic Sourcing Code Left', category: 'Code & DevX', Component: S1.Sec18FeatureSplitImageLeft },
  { id: 'sec-19', name: 'SEC-019 — Integration Bento Cards', category: 'Bento & Features', Component: S1.Sec19BentoGridLight2 },
  { id: 'sec-20', name: 'SEC-020 — Numbered Step Onboarding Cards', category: 'Workflows & Process', Component: S1.Sec20StepNumberCards },
  { id: 'sec-21', name: 'SEC-021 — 60% Payroll Cost Arbitrage Banner', category: 'Stats & ROI', Component: S1.Sec21RoiStatsHighlight },
  { id: 'sec-22', name: 'SEC-022 — Dev Tools Integration Grid', category: 'Code & DevX', Component: S1.Sec22IntegrationGrid },
  { id: 'sec-23', name: 'SEC-023 — 100% Satisfaction Guarantee Pledge', category: 'Trust & Security', Component: S1.Sec23ExecutivePledgeBox },
  { id: 'sec-24', name: 'SEC-024 — Micro Customer Testimonials', category: 'Trust & Security', Component: S1.Sec24MicroTestimonialsGrid },
  { id: 'sec-25', name: 'SEC-025 — Quick Submit Light CTA Box', category: 'CTAs & Banners', Component: S1.Sec25FinalCtaLight },

  { id: 'sec-26', name: 'SEC-026 — Bento Real-Time Telemetry', category: 'Bento & Features', Component: S2.Sec26BentoMetricsRadar },
  { id: 'sec-27', name: 'SEC-027 — Vertical Step Pipeline', category: 'Workflows & Process', Component: S2.Sec27WorkflowVerticalSteps },
  { id: 'sec-28', name: 'SEC-028 — Candidate Dossier Card', category: 'Talent & Dossiers', Component: S2.Sec28TalentDossierPreview },
  { id: 'sec-29', name: 'SEC-029 — GCC City Interactive Selector', category: 'GCC Corridors', Component: S2.Sec29GccCitySelector },
  { id: 'sec-30', name: 'SEC-030 — 3-Tier Pricing Card Grid', category: 'Pricing & Plans', Component: S2.Sec30PricingCards3Tier },
  { id: 'sec-31', name: 'SEC-031 — Two-Column Enterprise FAQ', category: 'FAQs & Support', Component: S2.Sec31FaqTwoColumn },
  { id: 'sec-32', name: 'SEC-032 — Security & SOC2 Checklist', category: 'Trust & Security', Component: S2.Sec32SecurityComplianceList },
  { id: 'sec-33', name: 'SEC-033 — CTA Split with Quick Form', category: 'CTAs & Banners', Component: S2.Sec33CtaSplitWithForm },
  { id: 'sec-34', name: 'SEC-034 — Code Snippet vs Traditional Recruiting', category: 'Code & DevX', Component: S2.Sec34CodeSnippetVsAgency },
  { id: 'sec-35', name: 'SEC-035 — Pre-Built Engineering Pods', category: 'Talent & Dossiers', Component: S2.Sec35TeamPodsShowcase },
  { id: 'sec-36', name: 'SEC-036 — 6-Tile Platform Features', category: 'Bento & Features', Component: S2.Sec36FeatureGrid6Tiles },
  { id: 'sec-37', name: 'SEC-037 — High Impact Stat Counter', category: 'Stats & ROI', Component: S2.Sec37StatsBigNumbers },
  { id: 'sec-38', name: 'SEC-038 — Video Testimonial Grid', category: 'Trust & Security', Component: S2.Sec38TestimonialVideoGrid },
  { id: 'sec-39', name: 'SEC-039 — Tech Stack Pill Filter Cloud', category: 'Code & DevX', Component: S2.Sec39TechStackFilterList },
  { id: 'sec-40', name: 'SEC-040 — Detailed Platform Comparison Matrix', category: 'Comparisons', Component: S2.Sec40ComparisonMatrixGrid },
  { id: 'sec-41', name: 'SEC-041 — Engineering Quality Manifesto', category: 'Bento & Features', Component: S2.Sec41ValuesManifesto },
  { id: 'sec-42', name: 'SEC-042 — Bento Glass Glow Card', category: 'Bento & Features', Component: S2.Sec42BentoGlassGlow },
  { id: 'sec-43', name: 'SEC-043 — Linear Step Progress Cards', category: 'Workflows & Process', Component: S2.Sec43StepCardsLinear },
  { id: 'sec-44', name: 'SEC-044 — Live Candidate Availability Ticker', category: 'Talent & Dossiers', Component: S2.Sec44CandidateAvailabilityTicker },
  { id: 'sec-45', name: 'SEC-045 — GCC Regional Talent Stats', category: 'GCC Corridors', Component: S2.Sec45GccRegionalStats },
  { id: 'sec-46', name: 'SEC-046 — Monthly vs Annual Pricing Toggle', category: 'Pricing & Plans', Component: S2.Sec46PricingMonthlyToggle },
  { id: 'sec-47', name: 'SEC-047 — Searchable FAQ Box', category: 'FAQs & Support', Component: S2.Sec47FaqSearchable },
  { id: 'sec-48', name: 'SEC-048 — IP Assignment & Protection Clause', category: 'Trust & Security', Component: S2.Sec48SecurityIpOwnership },
  { id: 'sec-49', name: 'SEC-049 — Dark Accent CTA Banner', category: 'CTAs & Banners', Component: S2.Sec49CtaFullWidthDarkAccents },
  { id: 'sec-50', name: 'SEC-050 — Code Benchmark Top 1% Pass', category: 'Code & DevX', Component: S2.Sec50CodeEvaluationBench },

  { id: 'sec-51', name: 'SEC-051 — Bento Architectural Grid', category: 'Bento & Features', Component: S3.Sec51BentoArchitectural },
  { id: 'sec-52', name: 'SEC-052 — Interactive Process Journey Tabs', category: 'Workflows & Process', Component: S3.Sec52ProcessInteractiveTabs },
  { id: 'sec-53', name: 'SEC-053 — Talent Pool Growth Stats', category: 'Stats & ROI', Component: S3.Sec53StatsGrowthChart },
  { id: 'sec-54', name: 'SEC-054 — Verified Tech Skill Chips', category: 'Code & DevX', Component: S3.Sec54TalentSkillChipsGrid },
  { id: 'sec-55', name: 'SEC-055 — GCC Offshore Hub Benefits', category: 'GCC Corridors', Component: S3.Sec55GccOffshoreHubBenefits },
  { id: 'sec-56', name: 'SEC-056 — 6-Column Client Logo Wall', category: 'Trust & Security', Component: S3.Sec56ClientLogoGrid6Col },
  { id: 'sec-57', name: 'SEC-057 — Big Serif Editorial Quote', category: 'Trust & Security', Component: S3.Sec57TestimonialQuoteBigType },
  { id: 'sec-58', name: 'SEC-058 — Tech Domain Selector', category: 'Code & DevX', Component: S3.Sec58TechCategorySelector },
  { id: 'sec-59', name: 'SEC-059 — Custom Squad Quote Builder', category: 'Pricing & Plans', Component: S3.Sec59PricingCustomQuoteBuilder },
  { id: 'sec-60', name: 'SEC-060 — Security Audit Terminal Log', category: 'Trust & Security', Component: S3.Sec60SecurityAuditLogWidget },
  { id: 'sec-61', name: 'SEC-061 — FAQ Card Stack', category: 'FAQs & Support', Component: S3.Sec61FaqAccordionCards },
  { id: 'sec-62', name: 'SEC-062 — Pill Shaped Gradient CTA', category: 'CTAs & Banners', Component: S3.Sec62CtaGradientGlowPill },
  { id: 'sec-63', name: 'SEC-063 — Dual Theme Code Comparison', category: 'Code & DevX', Component: S3.Sec63CodeTerminalDarkLightSplit },
  { id: 'sec-64', name: 'SEC-064 — Platform Checkmark Grid', category: 'Comparisons', Component: S3.Sec64ComparisonCheckmarkGrid },
  { id: 'sec-65', name: 'SEC-065 — Global Engineering Culture', category: 'Bento & Features', Component: S3.Sec65CulturePhotosGrid },
  { id: 'sec-66', name: 'SEC-066 — Bento Hover Card', category: 'Bento & Features', Component: S3.Sec66BentoHoverPerspective },
  { id: 'sec-67', name: 'SEC-067 — 4-Block Numbered Process', category: 'Workflows & Process', Component: S3.Sec67ProcessNumberedGrid },
  { id: 'sec-68', name: 'SEC-068 — Candidate Skill Match Radar', category: 'Talent & Dossiers', Component: S3.Sec68CandidateMatchRadarCard },
  { id: 'sec-69', name: 'SEC-069 — GCC Timezone Overlap Clock', category: 'GCC Corridors', Component: S3.Sec69GccTimezoneMapWidget },
  { id: 'sec-70', name: 'SEC-070 — Custom Enterprise Plan Showcase', category: 'Pricing & Plans', Component: S3.Sec70PricingEnterpriseCustom },
  { id: 'sec-71', name: 'SEC-071 — FAQ Support Help Block', category: 'FAQs & Support', Component: S3.Sec71FaqContactSupportBox },
  { id: 'sec-72', name: 'SEC-072 — Enterprise Certification Grid', category: 'Trust & Security', Component: S3.Sec72SecurityCertificationGrid },
  { id: 'sec-73', name: 'SEC-073 — Talent Newsletter Box', category: 'CTAs & Banners', Component: S3.Sec73CtaNewsletterMini },
  { id: 'sec-74', name: 'SEC-074 — CI/CD Vetting Pipeline', category: 'Code & DevX', Component: S3.Sec74CodePipelineSteps },
  { id: 'sec-75', name: 'SEC-075 — Annual Savings Breakdown', category: 'Stats & ROI', Component: S3.Sec75ComparisonSavingsBarChart },

  { id: 'sec-76', name: 'SEC-076 — Neo-Brutalist Bento Card', category: 'Bento & Features', Component: S4.Sec76BentoBrutalistLight },
  { id: 'sec-77', name: 'SEC-077 — Chevron Stepper Bar', category: 'Workflows & Process', Component: S4.Sec77ProcessChevronStepper },
  { id: 'sec-78', name: 'SEC-078 — Verified Background Check Shield', category: 'Trust & Security', Component: S4.Sec78TalentVerificationBadgeCard },
  { id: 'sec-79', name: 'SEC-079 — GCC Talent Density Map', category: 'GCC Corridors', Component: S4.Sec79GccTalentDensityMap },
  { id: 'sec-80', name: 'SEC-080 — 14-Day Guarantee Shield', category: 'Pricing & Plans', Component: S4.Sec80PricingTrialGuaranteeBanner },
  { id: 'sec-81', name: 'SEC-081 — Categorized FAQ Tabs', category: 'FAQs & Support', Component: S4.Sec81FaqCategoryTabs },
  { id: 'sec-82', name: 'SEC-082 — Data Privacy & Encryption', category: 'Trust & Security', Component: S4.Sec82SecurityDataPrivacyShield },
  { id: 'sec-83', name: 'SEC-083 — Floating Badge CTA', category: 'CTAs & Banners', Component: S4.Sec83CtaFloatingBadgeContainer },
  { id: 'sec-84', name: 'SEC-084 — AI Conversational Prompt Box', category: 'Code & DevX', Component: S4.Sec84CodeAiPromptMatcher },
  { id: 'sec-85', name: 'SEC-085 — Feature Matrix Checklist', category: 'Comparisons', Component: S4.Sec85ComparisonFeatureTable },
  { id: 'sec-86', name: 'SEC-086 — Values Icon Pill Grid', category: 'Bento & Features', Component: S4.Sec86ValuesIconPillGrid },
  { id: 'sec-87', name: 'SEC-087 — Dribbble Glassmorphism UI', category: 'Bento & Features', Component: S4.Sec87BentoGlassmorphismCards },
  { id: 'sec-88', name: 'SEC-088 — Vertical Dotted Timeline', category: 'Workflows & Process', Component: S4.Sec88ProcessTimelineVerticalDots },
  { id: 'sec-89', name: 'SEC-089 — Candidate of the Week Dossier', category: 'Talent & Dossiers', Component: S4.Sec89CandidateFeaturedDossierCard },
  { id: 'sec-90', name: 'SEC-090 — Offshore Pod Structure Diagram', category: 'GCC Corridors', Component: S4.Sec90GccOffshorePodStructure },
  { id: 'sec-91', name: 'SEC-091 — Transparent Billing Fee Card', category: 'Pricing & Plans', Component: S4.Sec91PricingTransparentBreakdown },
  { id: 'sec-92', name: 'SEC-092 — Expand All FAQ Toggle', category: 'FAQs & Support', Component: S4.Sec92FaqExpandAllToggle },
  { id: 'sec-93', name: 'SEC-093 — Employer of Record Compliance', category: 'Trust & Security', Component: S4.Sec93SecurityEorCompliance },
  { id: 'sec-94', name: 'SEC-094 — Minimalist Centered CTA', category: 'CTAs & Banners', Component: S4.Sec94CtaMinimalistCentered },
  { id: 'sec-95', name: 'SEC-095 — Real-Time Test Output Log', category: 'Code & DevX', Component: S4.Sec95CodeLiveTestOutput },
  { id: 'sec-96', name: 'SEC-096 — Role Cost Savings Table', category: 'Comparisons', Component: S4.Sec96ComparisonCostCalculatorTable },
  { id: 'sec-97', name: 'SEC-097 — Global Talent Corridor Text Block', category: 'GCC Corridors', Component: S4.Sec97CultureGlobalCorridors },
  { id: 'sec-98', name: 'SEC-098 — Asymmetric 3-Tile Bento', category: 'Bento & Features', Component: S4.Sec98BentoAsymmetricGrid },
  { id: 'sec-99', name: 'SEC-099 — 24h Fast Track Badge', category: 'Workflows & Process', Component: S4.Sec99ProcessFastTrackBadge },
  { id: 'sec-100', name: 'SEC-100 — Grand Final Platform CTA Showcase', category: 'CTAs & Banners', Component: S4.Sec100FinalGrandShowcaseCta },

  // Legacy Showcase Components
  { id: 'ws-how-we-work', name: 'Legacy — How We Work', category: 'Legacy Showcase', Component: WsHowWeWork },
  { id: 'ws-branding', name: 'Legacy — Branding Concepts', category: 'Legacy Showcase', Component: WsBrandingConcepts },
  { id: 'ws-workflow', name: 'Legacy — Workflow', category: 'Legacy Showcase', Component: WsWorkflow },
  { id: 'ws-work-with-us', name: 'Legacy — Work With Us', category: 'Legacy Showcase', Component: WsWorkWithUs },
  { id: 'ws-seamless', name: 'Legacy — Seamless Hiring', category: 'Legacy Showcase', Component: WsSeamlessHiring },
  { id: 'ws-comprehensive', name: 'Legacy — Comprehensive Care', category: 'Legacy Showcase', Component: WsComprehensiveCare },
  { id: 'ws-what-we-do', name: 'Legacy — What We Do', category: 'Legacy Showcase', Component: WsWhatWeDo },
  { id: 'ws-benefits', name: 'Legacy — Benefits', category: 'Legacy Showcase', Component: WsBenefits },
  { id: 'ws-core-features', name: 'Legacy — Core Features', category: 'Legacy Showcase', Component: WsCoreFeatures },
  { id: 'ws-expert-services', name: 'Legacy — Expert Services', category: 'Legacy Showcase', Component: WsExpertServices },
  { id: 'ws-apart-academy', name: 'Legacy — Apart Academy', category: 'Legacy Showcase', Component: WsApartAcademy },
  { id: 'ws-testimonials', name: 'Legacy — Testimonials', category: 'Legacy Showcase', Component: WsTestimonials },
  { id: 'ws-explore-talent', name: 'Legacy — Explore Talent', category: 'Legacy Showcase', Component: WsExploreTalent },
  { id: 'ws-stats-bento', name: 'Legacy — Stats Bento', category: 'Legacy Showcase', Component: WsStatsBento },
  { id: 'rec-hiring-made-easy', name: 'Recruiter — Hiring Made Easy', category: 'Legacy Showcase', Component: RecHiringMadeEasy },
  { id: 'rec-shaping-landscape', name: 'Recruiter — Shaping Landscape', category: 'Legacy Showcase', Component: RecShapingLandscape },
  { id: 'rec-smart-personalization', name: 'Recruiter — Smart Personalization', category: 'Legacy Showcase', Component: RecSmartPersonalization },
  { id: 'rec-expert-designed', name: 'Recruiter — Expert Designed', category: 'Legacy Showcase', Component: RecExpertDesigned },
  { id: 'rec-curiosity-creativity', name: 'Recruiter — Curiosity & Creativity', category: 'Legacy Showcase', Component: RecCuriosityCreativity },
  { id: 'rec-persado-cards', name: 'Recruiter — Persado Cards', category: 'Legacy Showcase', Component: RecPersadoCards },
  { id: 'rec-current-openings', name: 'Recruiter — Current Openings', category: 'Legacy Showcase', Component: RecCurrentOpenings },
  { id: 'rec-build-skills', name: 'Recruiter — Build Skills', category: 'Legacy Showcase', Component: RecBuildSkills },
  { id: 'rec-crafting-growth', name: 'Recruiter — Crafting Growth', category: 'Legacy Showcase', Component: RecCraftingGrowth },
  { id: 'rec-seamless-integration', name: 'Recruiter — Seamless Integration', category: 'Legacy Showcase', Component: RecSeamlessIntegration },
];

export function WebCompSectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const filteredSections = SECTIONS.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-neutral-900 font-sans">
      <ScrollProgressBar />

      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-50 bg-neutral-950/95 text-white backdrop-blur border-b border-neutral-800 px-6 py-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center text-neutral-950 font-black text-sm shadow-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                NEXATALENT IT SOLUTIONS INTERNAL SECTIONS <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono">100 MODULAR SECTIONS</span>
              </h1>
              <p className="text-[11px] text-neutral-400">Complete Pinterest & Dribbble inspired internal section library for NexaTalent IT Solutions pages</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search Section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Jump Jumper Select */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const target = document.getElementById(e.target.value);
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-lg bg-neutral-900 border border-neutral-800 py-1.5 px-3 text-xs text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value="">Jump to Section...</option>
                {SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mx-auto max-w-7xl pt-3 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            'All',
            'Bento & Features',
            'Workflows & Process',
            'Stats & ROI',
            'Talent & Dossiers',
            'GCC Corridors',
            'Pricing & Plans',
            'Trust & Security',
            'FAQs & Support',
            'CTAs & Banners',
            'Code & DevX',
            'Comparisons',
            'Legacy Showcase'
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-neutral-950 shadow'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat} {cat === 'All' ? `(${SECTIONS.length})` : ''}
            </button>
          ))}
        </div>
      </header>

      {/* Sections Showcase */}
      <main className="divide-y divide-neutral-200/80">
        {filteredSections.map((item) => {
          const { id, name, category, Component } = item;
          return (
            <div key={id} id={id} className="relative group scroll-mt-28">
              {/* Sticky Bar for Section Label */}
              <div className="sticky top-[108px] z-40 bg-neutral-900/90 text-white backdrop-blur border-y border-neutral-800 px-6 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                    <Hash size={12} /> {id.toUpperCase()}
                  </span>
                  <span className="font-bold text-neutral-200">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] text-neutral-400 border border-neutral-700">
                    {category}
                  </span>
                </div>
              </div>

              {/* Render Section Component */}
              <Component />
            </div>
          );
        })}
      </main>

      {/* Scroll to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-neutral-900 text-white p-3.5 shadow-2xl hover:bg-emerald-600 transition-all focus:outline-none border border-neutral-700"
        title="Scroll to Top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
