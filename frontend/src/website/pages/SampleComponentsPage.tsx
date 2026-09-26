import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUp,
  CheckCircle2
} from 'lucide-react';

import {
  // Navbars
  NavbarMegaMenuGlass,
  NavbarMinimalSlideHover,
  NavbarExecutiveCommandPill,
  NavbarSplitBrandCorporate,
  NavbarDevOpsTerminalBar,

  // Footers
  FooterGlobalEnterpriseMega,
  FooterAsymmetricBento,
  FooterMonolithicDarkEcho,
  FooterFloatingDualTier,
  FooterArchitecturalDirectory,

  // About Us
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

  // Details & Services
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

  // Jobs & Recruiting
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

  // Case Studies
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

  // Pricing & CTAs
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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'all', label: 'All 60 Components', count: 60 },
    { id: 'navbars', label: '5 Navbars', count: 5 },
    { id: 'footers', label: '5 Footers', count: 5 },
    { id: 'about', label: '10 About Us & Architecture', count: 10 },
    { id: 'details', label: '10 Details & Services', count: 10 },
    { id: 'jobs', label: '10 Jobs & Careers', count: 10 },
    { id: 'cases', label: '10 Case Studies & Proof', count: 10 },
    { id: 'pricing', label: '10 Pricing & CTAs', count: 10 },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Header Banner */}
      <header className="bg-white border-b border-slate-200 py-16 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>NexaScale & NexaTalent Modular Component Architecture • 60 Live Sections</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Complete Responsive Design System & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
              60 Modular Website Components
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Tailored specifically for NexaScale GCC business architecture, executive search, candidate pipelines, and enterprise institutional proof.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>5 Distinct Navbars</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>5 Distinct Footers</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>50 Full Page Sections</span>
            </span>
          </div>
        </div>
      </header>

      {/* Sticky Category Navigator */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-500 hidden md:block shrink-0">
            Route: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600">/sample-components</code>
          </div>
        </div>
      </div>

      {/* Components Feed Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* Category A: 5 Navbars */}
        {(activeCategory === 'all' || activeCategory === 'navbars') && (
          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Category A: 5 Distinct Navbars</h3>
                <p className="text-xs text-slate-500">Mega-menus on hover, minimal sliding underline, executive command pill, split corporate, and devops terminal styles.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">5 Components</span>
            </div>

            <NavbarMegaMenuGlass />
            <NavbarMinimalSlideHover />
            <NavbarExecutiveCommandPill />
            <NavbarSplitBrandCorporate />
            <NavbarDevOpsTerminalBar />
          </div>
        )}

        {/* Category B: 5 Footers */}
        {(activeCategory === 'all' || activeCategory === 'footers') && (
          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Category B: 5 Distinct Footers</h3>
                <p className="text-xs text-slate-500">Multi-hub mega footer, bento timezone grid, dark monolithic echo, elevated floating dual-tier, and architectural directory.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-100 text-purple-800">5 Components</span>
            </div>

            <FooterGlobalEnterpriseMega />
            <FooterAsymmetricBento />
            <FooterMonolithicDarkEcho />
            <FooterFloatingDualTier />
            <FooterArchitecturalDirectory />
          </div>
        )}

        {/* Category C: 10 About Us & Business Architecture */}
        {(activeCategory === 'all' || activeCategory === 'about') && (
          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Category C: 10 About Us & NexaScale Architecture Sections</h3>
                <p className="text-xs text-slate-500">Manifesto hero, 3-pillar blueprint, executive leadership bento, geospatial radar, evolution timeline, ethos, pedigree matrix, and arbitrage story.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">10 Components</span>
            </div>

            <AboutHeroManifesto />
            <AboutBusinessArchitectureBlueprint />
            <AboutExecutiveLeadershipBento />
            <AboutGlobalFootprintRadar />
            <AboutCompanyTimelineEvolution />
            <AboutValuesCoreEthos />
            <AboutEngineeringPedigreeMatrix />
            <AboutGccEconomicArbitrageStory />
            <AboutSecurityComplianceVault />
            <AboutCultureAndWorkplaceShowcase />
          </div>
        )}

        {/* Category D: 10 Details & Services */}
        {(activeCategory === 'all' || activeCategory === 'details') && (
          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Category D: 10 Detail, Solution & Service Deep-Dives</h3>
                <p className="text-xs text-slate-500">Turnkey pod configurator, executive search playbook, 72-hour contract burst, 5-stage vetting funnel, SLA guarantees, AI/quant guilds, and EOR payroll.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-100 text-indigo-800">10 Components</span>
            </div>

            <DetailGccTurnkeyPodConfigurator />
            <DetailExecutiveSearchPlaybook />
            <DetailContractStaffingScaleEngine />
            <DetailTechnicalVettingFunnel />
            <DetailServiceLevelGuaranteeSla />
            <DetailCloudAndAiSpecialization />
            <DetailFintechAndLowLatencyGuild />
            <DetailComplianceAndPayrollOutsourcing />
            <DetailMigrationAndRebadgingBlueprint />
            <DetailInteractiveFeatureComparisonTable />
          </div>
        )}

        {/* Category E: 10 Jobs & Careers */}
        {(activeCategory === 'all' || activeCategory === 'jobs') && (
          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Category E: 10 Jobs, Recruiting & Candidate Experience Sections</h3>
                <p className="text-xs text-slate-500">Job filter deck, confidential mandates, PPP salary calculator, 21-day interview roadmap, talent bench spotlight, recruiter dashboard, and $5k referral engine.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-100 text-teal-800">10 Components</span>
            </div>

            <JobsInteractiveSearchFilterDeck />
            <JobsFeaturedMandatesCarousel />
            <JobsSalaryAndArbitrageCalculator />
            <JobsInterviewProcessRoadmap />
            <JobsTalentBenchSpotlight />
            <JobsCandidatePerksAndWorkspaceGrid />
            <JobsRecruiterHiringDashboardPreview />
            <JobsReferralEngineAndRewards />
            <JobsCandidateCareerConcierge />
            <JobsQuickApplicationDrawerModal />
          </div>
        )}

        {/* Category F: 10 Case Studies & Proof */}
        {(activeCategory === 'all' || activeCategory === 'cases') && (
          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Category F: 10 Enterprise Case Studies & Institutional Proof</h3>
                <p className="text-xs text-slate-500">Enterprise scale cards, quant latency case, clinical AI compliance, filterable case grid, video testimonials, savings graph visual, and maturity ladder.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-800">10 Components</span>
            </div>

            <CaseStudyEnterpriseScaleMetricCard />
            <CaseStudyFintechLatencyReduction />
            <CaseStudyHealthcareAiCompliance />
            <CaseStudyInteractiveMetricFilter />
            <CaseStudyVideoTestimonialBento />
            <CaseStudyCostSavingsGraphVisual />
            <CaseStudyBeforeAfterTeamComparison />
            <CaseStudyClientLogoWallTicker />
            <CaseStudyGccMaturityFramework />
            <CaseStudyExecutiveQuoteHighlight />
          </div>
        )}

        {/* Category G: 10 Pricing, FAQs & CTAs */}
        {(activeCategory === 'all' || activeCategory === 'pricing') && (
          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Category G: 10 Pricing, ROI Calculators, FAQs & Interactive CTAs</h3>
                <p className="text-xs text-slate-500">Transparent tier cards, GCC ROI simulator, open-book cost-plus breakdown, searchable FAQ accordion, IP notice, calendar booking, and terminal wire.</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800">10 Components</span>
            </div>

            <PricingTransparentTierCards />
            <PricingGccRoiCostSimulator />
            <PricingCostPlusTransparencyBreakdown />
            <FaqAccordionInteractiveSearch />
            <FaqLegalIpSecurityNotice />
            <CtaExecutiveStrategyBooking />
            <CtaTalentBenchReserveDrawer />
            <CtaDownloadGccCompReport />
            <CtaDualActionPortalGateway />
            <CtaInteractiveNewsletterTerminal />
          </div>
        )}

      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-slate-900 text-white shadow-2xl hover:bg-blue-600 transition-all cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 NexaTalent Component Catalog • 60 Unique Modular Sections Verified
          </div>
          <div className="flex items-center gap-4 text-blue-600">
            <a href="/sample" className="hover:underline">View 120 Motion Sections</a>
            <span>•</span>
            <a href="/" className="hover:underline">Return to Home</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
