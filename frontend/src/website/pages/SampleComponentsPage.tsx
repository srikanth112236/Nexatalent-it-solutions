import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowUp,
  CheckCircle2,
  Compass,
  Layout,
  Menu,
  FileText,
  Briefcase,
  Layers,
  DollarSign
} from 'lucide-react';

import {
  // Navbars (1-5)
  NavbarMegaMenuGlass,
  NavbarMinimalSlideHover,
  NavbarExecutiveCommandPill,
  NavbarSplitBrandCorporate,
  NavbarDevOpsTerminalBar,

  // Footers (6-10)
  FooterGlobalEnterpriseMega,
  FooterAsymmetricBento,
  FooterMonolithicDarkEcho,
  FooterFloatingDualTier,
  FooterArchitecturalDirectory,

  // About Us & Architecture (11-20)
  AboutHeroManifesto,
  AboutBusinessArchitectureBlueprint,
  AboutExecutiveLeadershipBento,
  AboutGlobalFootprintRadar,
  AboutCompanyTimelineEvolution,
  AboutValuesCoreEthos,
  AboutEngineeringPedigreeMatrix,
  AboutGccEconomicArbitrageStory,
  AboutSecurityComplianceVault,
  AboutCultureAndWorkplaceShowcase,

  // Details & Services (21-30)
  DetailGccTurnkeyPodConfigurator,
  DetailExecutiveSearchPlaybook,
  DetailContractStaffingScaleEngine,
  DetailTechnicalVettingFunnel,
  DetailServiceLevelGuaranteeSla,
  DetailCloudAndAiSpecialization,
  DetailFintechAndLowLatencyGuild,
  DetailComplianceAndPayrollOutsourcing,
  DetailMigrationAndRebadgingBlueprint,
  DetailInteractiveFeatureComparisonTable,

  // Jobs & Recruiting (31-40)
  JobsInteractiveSearchFilterDeck,
  JobsFeaturedMandatesCarousel,
  JobsSalaryAndArbitrageCalculator,
  JobsInterviewProcessRoadmap,
  JobsTalentBenchSpotlight,
  JobsCandidatePerksAndWorkspaceGrid,
  JobsRecruiterHiringDashboardPreview,
  JobsReferralEngineAndRewards,
  JobsCandidateCareerConcierge,
  JobsQuickApplicationDrawerModal,

  // Case Studies & Proof (41-50)
  CaseStudyEnterpriseScaleMetricCard,
  CaseStudyFintechLatencyReduction,
  CaseStudyHealthcareAiCompliance,
  CaseStudyInteractiveMetricFilter,
  CaseStudyVideoTestimonialBento,
  CaseStudyCostSavingsGraphVisual,
  CaseStudyBeforeAfterTeamComparison,
  CaseStudyClientLogoWallTicker,
  CaseStudyGccMaturityFramework,
  CaseStudyExecutiveQuoteHighlight,

  // Pricing & CTAs (51-60)
  PricingTransparentTierCards,
  PricingGccRoiCostSimulator,
  PricingCostPlusTransparencyBreakdown,
  FaqAccordionInteractiveSearch,
  FaqLegalIpSecurityNotice,
  CtaExecutiveStrategyBooking,
  CtaTalentBenchReserveDrawer,
  CtaDownloadGccCompReport,
  CtaDualActionPortalGateway,
  CtaInteractiveNewsletterTerminal,
} from '../components/sample-library';

export const SampleComponentsPage: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('navbars');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Detect current section on scroll
      const sections = ['navbars', 'footers', 'about', 'details', 'jobs', 'cases', 'pricing'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navCategories = [
    { id: 'navbars', label: '1. Navbars', count: '5', icon: Menu },
    { id: 'footers', label: '2. Footers', count: '5', icon: Layout },
    { id: 'about', label: '3. About Architecture', count: '10', icon: Compass },
    { id: 'details', label: '4. Solutions & Services', count: '10', icon: Layers },
    { id: 'jobs', label: '5. Jobs & Careers', count: '10', icon: Briefcase },
    { id: 'cases', label: '6. Case Studies', count: '10', icon: FileText },
    { id: 'pricing', label: '7. Pricing & CTAs', count: '10', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Header Banner - Clean White Aesthetic */}
      <header className="bg-white border-b border-slate-200/80 pt-16 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>NexaScale & NexaTalent IT Solutions Complete Component Catalog • All 60 Live Sections</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Complete Website Components Design System <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
              All 60 Components Displayed One by One
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Every component rendered continuously with interactive mega-menus, hover dropdowns, calculators, drawers, and full enterprise architecture proof.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>5 Interactive Navbars (Mega-Menu & Hover Dropdowns)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>5 Enterprise Footers</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>50 Full Sections (No Tabs • All Visible)</span>
            </span>
          </div>
        </div>
      </header>

      {/* Sticky Anchor Quick-Jump Bar (No tabs hiding anything - just smooth scroll jump) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:inline mr-1">
              Jump To:
            </span>
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeSection === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToSection(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-500 hidden lg:flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All 60 Rendered Below</span>
          </div>
        </div>
      </div>

      {/* All 60 Components Feed (Rendered Sequentially One by One) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-24">
        
        {/* ========================================================================= */}
        {/* SECTION 1: 5 DISTINCT NAVBARS WITH MEGA MENUS & HOVER DROPDOWNS           */}
        {/* ========================================================================= */}
        <section id="navbars" className="space-y-10 scroll-mt-24">
          <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-blue-600 tracking-wider">SECTION 01 OF 07</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">5 Distinct Enterprise Navbars</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Each navbar features distinct interaction paradigms: multi-tier glass mega-menus on hover, anchored card flyouts, executive obsidian commands, split corporate entity switchers, and real-time DevOps SRE telemetry.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 shrink-0 self-start sm:self-auto">
              5 Navbars • Full Hover & Dropdowns Active
            </span>
          </div>

          <div className="space-y-12">
            {/* Navbar 1: Glass Mega-Menu */}
            <div className="space-y-2 relative z-50">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-700">Navbar Variant A · Multi-Tier Glass Mega-Menu</span>
                <span className="font-mono text-[11px] text-blue-600">Solutions, GCC Centers, Executive Search & Metrics Drawers</span>
              </div>
              <NavbarMegaMenuGlass />
            </div>

            {/* Navbar 2: Minimal Slide Hover */}
            <div className="space-y-2 relative z-40">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-700">Navbar Variant B · Minimal Slide Underline & Anchored Card Flyouts</span>
                <span className="font-mono text-[11px] text-indigo-600">Magnetic Tracker + Direct Context Dropdowns</span>
              </div>
              <NavbarMinimalSlideHover />
            </div>

            {/* Navbar 3: Executive Command Pill */}
            <div className="space-y-2 relative z-30">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-700">Navbar Variant C · Executive Command Pill</span>
                <span className="font-mono text-[11px] text-amber-600">Obsidian Theme + GCC / Leadership / Arbitrage Hover Drawers + ⌘K</span>
              </div>
              <NavbarExecutiveCommandPill />
            </div>

            {/* Navbar 4: Split-Brand Corporate */}
            <div className="space-y-2 relative z-20">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-700">Navbar Variant D · Split-Brand Corporate Multi-Entity</span>
                <span className="font-mono text-[11px] text-cyan-600">NexaTalent IT Solutions vs NexaScale Entity Switcher + Enterprise Dropdowns</span>
              </div>
              <NavbarSplitBrandCorporate />
            </div>

            {/* Navbar 5: DevOps Terminal Bar */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-700">Navbar Variant E · DevOps SRE Terminal Header</span>
                <span className="font-mono text-[11px] text-emerald-600">Live Pods Cluster, Latency Telemetry & Interactive CLI Drawers</span>
              </div>
              <NavbarDevOpsTerminalBar />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: 5 DISTINCT FOOTERS                                             */}
        {/* ========================================================================= */}
        <section id="footers" className="space-y-10 scroll-mt-24">
          <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-purple-600 tracking-wider">SECTION 02 OF 07</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">5 Distinct Enterprise Footers</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Institutional footers tailored for global compliance, multi-hub office directories, bento timezone monitors, elevated dual-tier navigation, and monolithic dark echoes.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 shrink-0 self-start sm:self-auto">
              5 Footer Designs
            </span>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">Footer 01 · Global Enterprise Mega Footer (Multi-Hub)</div>
              <FooterGlobalEnterpriseMega />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">Footer 02 · Asymmetric Bento & Timezone Monitor</div>
              <FooterAsymmetricBento />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">Footer 03 · Monolithic Dark Echo</div>
              <FooterMonolithicDarkEcho />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">Footer 04 · Floating Dual-Tier Elevated Nav</div>
              <FooterFloatingDualTier />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">Footer 05 · Architectural Directory Index</div>
              <FooterArchitecturalDirectory />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: 10 ABOUT US & BUSINESS ARCHITECTURE SECTIONS                   */}
        {/* ========================================================================= */}
        <section id="about" className="space-y-10 scroll-mt-24">
          <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-emerald-600 tracking-wider">SECTION 03 OF 07</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">10 About Us & NexaScale Architecture Sections</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Institutional manifesto, 3-pillar architectural blueprint, executive leadership bento, geospatial radar, 10-year timeline, pedigree matrix, and arbitrage story.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-auto">
              10 About Components
            </span>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">01 · About Hero Manifesto</div>
              <AboutHeroManifesto />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">02 · About Business Architecture Blueprint</div>
              <AboutBusinessArchitectureBlueprint />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">03 · About Executive Leadership Bento</div>
              <AboutExecutiveLeadershipBento />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">04 · About Global Footprint Geospatial Radar</div>
              <AboutGlobalFootprintRadar />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">05 · About Company Timeline & Evolution</div>
              <AboutCompanyTimelineEvolution />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">06 · About Values & Core Ethos</div>
              <AboutValuesCoreEthos />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">07 · About Engineering Pedigree Matrix</div>
              <AboutEngineeringPedigreeMatrix />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">08 · About GCC Economic Arbitrage Story</div>
              <AboutGccEconomicArbitrageStory />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">09 · About Security & Compliance Vault</div>
              <AboutSecurityComplianceVault />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">10 · About Culture & Workplace Showcase</div>
              <AboutCultureAndWorkplaceShowcase />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: 10 DETAILS, SOLUTIONS & SERVICES                               */}
        {/* ========================================================================= */}
        <section id="details" className="space-y-10 scroll-mt-24">
          <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-indigo-600 tracking-wider">SECTION 04 OF 07</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">10 Solution & Service Deep-Dives</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Turnkey GCC pod configurator, executive search playbook, 72-hour contract burst engine, 5-stage technical vetting funnel, SLA guarantees, and quant guild specializations.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0 self-start sm:self-auto">
              10 Service Components
            </span>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">01 · Turnkey Pod Configurator</div>
              <DetailGccTurnkeyPodConfigurator />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">02 · Executive Search Playbook</div>
              <DetailExecutiveSearchPlaybook />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">03 · Contract Staffing Scale Engine (72-Hr Burst)</div>
              <DetailContractStaffingScaleEngine />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">04 · Technical Vetting Funnel (5-Stage Rigor)</div>
              <DetailTechnicalVettingFunnel />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">05 · Service Level Guarantee SLA (90-Day Free Replacement)</div>
              <DetailServiceLevelGuaranteeSla />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">06 · Cloud Native & AI Specialization</div>
              <DetailCloudAndAiSpecialization />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">07 · Fintech & Low-Latency Guild</div>
              <DetailFintechAndLowLatencyGuild />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">08 · Compliance & Payroll Outsourcing (EOR)</div>
              <DetailComplianceAndPayrollOutsourcing />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">09 · Migration & Rebadging Blueprint</div>
              <DetailMigrationAndRebadgingBlueprint />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">10 · Interactive Feature Comparison Matrix</div>
              <DetailInteractiveFeatureComparisonTable />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: 10 JOBS, RECRUITING & CAREERS                                  */}
        {/* ========================================================================= */}
        <section id="jobs" className="space-y-10 scroll-mt-24">
          <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-teal-600 tracking-wider">SECTION 05 OF 07</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">10 Jobs, Recruiting & Candidate Experience Sections</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Interactive search filter deck, confidential mandates carousel, PPP salary calculator, 21-day interview roadmap, talent bench spotlight, and $5,000 referral engine.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 shrink-0 self-start sm:self-auto">
              10 Jobs Components
            </span>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">01 · Interactive Search Filter Deck</div>
              <JobsInteractiveSearchFilterDeck />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">02 · Featured Mandates Carousel</div>
              <JobsFeaturedMandatesCarousel />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">03 · Salary Arbitrage & PPP Calculator</div>
              <JobsSalaryAndArbitrageCalculator />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">04 · 21-Day Interview Process Roadmap</div>
              <JobsInterviewProcessRoadmap />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">05 · Talent Bench Spotlight</div>
              <JobsTalentBenchSpotlight />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">06 · Candidate Perks & Workspace Grid</div>
              <JobsCandidatePerksAndWorkspaceGrid />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">07 · Recruiter Hiring Dashboard Preview</div>
              <JobsRecruiterHiringDashboardPreview />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">08 · Referral Engine & Rewards Program</div>
              <JobsReferralEngineAndRewards />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">09 · Candidate Career Concierge</div>
              <JobsCandidateCareerConcierge />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">10 · Quick Application Modal & Drawer</div>
              <JobsQuickApplicationDrawerModal />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: 10 CASE STUDIES & INSTITUTIONAL PROOF                          */}
        {/* ========================================================================= */}
        <section id="cases" className="space-y-10 scroll-mt-24">
          <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-amber-600 tracking-wider">SECTION 06 OF 07</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">10 Enterprise Case Studies & Institutional Proof</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enterprise scale metrics, quant latency case, clinical AI compliance, interactive metric filter, video testimonials, savings visual graphs, and GCC maturity ladder.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0 self-start sm:self-auto">
              10 Case Study Components
            </span>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">01 · Enterprise Scale Metric Cards</div>
              <CaseStudyEnterpriseScaleMetricCard />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">02 · Fintech & Ultra-Low Latency Reduction Case</div>
              <CaseStudyFintechLatencyReduction />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">03 · Healthcare & Clinical AI Compliance Proof</div>
              <CaseStudyHealthcareAiCompliance />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">04 · Interactive Metric Filter Grid</div>
              <CaseStudyInteractiveMetricFilter />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">05 · Executive Video Testimonial Bento</div>
              <CaseStudyVideoTestimonialBento />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">06 · Cost Savings Graph & Cumulative Delta</div>
              <CaseStudyCostSavingsGraphVisual />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">07 · Before & After Team Velocity Comparison</div>
              <CaseStudyBeforeAfterTeamComparison />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">08 · Client Logo Wall & Marquee Ticker</div>
              <CaseStudyClientLogoWallTicker />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">09 · GCC Maturity Framework & Stage Progression</div>
              <CaseStudyGccMaturityFramework />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">10 · Executive Quote & Institutional Endorsement</div>
              <CaseStudyExecutiveQuoteHighlight />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: 10 PRICING, FAQS & INTERACTIVE CTAS                            */}
        {/* ========================================================================= */}
        <section id="pricing" className="space-y-10 scroll-mt-24">
          <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-rose-600 tracking-wider">SECTION 07 OF 07</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">10 Pricing, FAQs & High-Conversion CTAs</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Transparent tier pricing cards, GCC ROI cost simulator, open-book cost-plus breakdown, searchable FAQ, legal IP notice, and executive strategy booking drawers.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 shrink-0 self-start sm:self-auto">
              10 Pricing & CTA Components
            </span>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">01 · Transparent Pricing Tier Cards</div>
              <PricingTransparentTierCards />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">02 · GCC ROI Cost & Headcount Simulator</div>
              <PricingGccRoiCostSimulator />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">03 · Cost-Plus Open Book Transparency Breakdown</div>
              <PricingCostPlusTransparencyBreakdown />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">04 · Searchable FAQ Accordion</div>
              <FaqAccordionInteractiveSearch />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">05 · Legal IP & Security Compliance Notice</div>
              <FaqLegalIpSecurityNotice />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">06 · Executive Strategy Booking Calendar</div>
              <CtaExecutiveStrategyBooking />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">07 · Talent Bench Reservation Drawer</div>
              <CtaTalentBenchReserveDrawer />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">08 · GCC Compensation Report Download Gate</div>
              <CtaDownloadGccCompReport />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">09 · Dual-Action Portal Gateway (Client vs Candidate)</div>
              <CtaDualActionPortalGateway />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 px-1">10 · Interactive Newsletter Terminal Wire</div>
              <CtaInteractiveNewsletterTerminal />
            </div>
          </div>
        </section>

      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-slate-900 text-white shadow-2xl hover:bg-blue-600 transition-all cursor-pointer hover:scale-105"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 NexaTalent IT Solutions Component Catalog • All 60 Modular Sections Displayed Sequentially on Clean White Canvas
          </div>
          <div className="flex items-center gap-4 text-blue-600 font-medium">
            <a href="/sample" className="hover:underline">View 120 Light & Motion Sections</a>
            <span>•</span>
            <a href="/" className="hover:underline">Return to Home</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
