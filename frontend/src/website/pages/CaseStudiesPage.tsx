import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import {
  CaseStudyClientLogoWallTicker,
  CaseStudyEnterpriseScaleMetricCard,
  CaseStudyBeforeAfterTeamComparison,
  CaseStudyCostSavingsGraphVisual,
  CaseStudyFintechLatencyReduction,
  CaseStudyHealthcareAiCompliance,
  CaseStudyGccMaturityFramework,
  CaseStudyInteractiveMetricFilter,
  CaseStudyVideoTestimonialBento,
  CaseStudyExecutiveQuoteHighlight,
  DetailServiceLevelGuaranteeSla,
  FaqAccordionInteractiveSearch,
  CtaDownloadGccCompReport
} from '../components/sample-library';
// High-End Animated Motion Components
import {
  LightCaseStudiesHeroBanner,
  LightCaseStudyMaster,
  LightCaseStudyResultSplit,
  VerticalParallaxCaseStudy,
  LightBeforeAfterMatrix,
  SignatureTalentComparisonSlider,
  PinnedCircularProgressReveal,
  HorizontalCardsRail,
  LightDirectContactSection
} from '../components/light-motion';

export function CaseStudiesPage() {
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
        title="Client Case Studies & Hiring Impact Reports | NexaTalent IT Solutions"
        description="Explore how enterprise clients, GCCs, and high-growth FinTech scale-ups reduced hiring time by 60%, saved ₹4.2Cr in recruitment spend, and achieved 94%+ retention."
        keywords="recruitment case studies, GCC setup success stories, tech hiring ROI, engineering team scaling, IT staffing benchmarks India"
        canonical="/case-studies"
      />

      {/* 1. Global Navbar */}
      <SiteNavbar />

      {/* 2. Light Premier AI Talent Agency Case Studies Hero Banner */}
      <LightCaseStudiesHeroBanner />

      {/* 3. Verified Client Logo Ticker */}
      <div id="featured-case-studies">
        <CaseStudyClientLogoWallTicker />
      </div>

      {/* 4. Animated SampleShowcase Section 1: Master Case Study Deck */}
      <LightCaseStudyMaster />

      {/* 5. Enterprise Scale Metric Card */}
      <CaseStudyEnterpriseScaleMetricCard />

      {/* 6. Animated SampleShowcase Section 2: Case Study Result Split */}
      <LightCaseStudyResultSplit />

      {/* 7. Before vs After Team Velocity Comparison */}
      <CaseStudyBeforeAfterTeamComparison />

      {/* 8. Animated SampleShowcase Section 3: Vertical Parallax Case Study */}
      <VerticalParallaxCaseStudy />

      {/* 9. Quantified Cost Savings Graph */}
      <CaseStudyCostSavingsGraphVisual />

      {/* 10. Flagship Fintech Latency Reduction Study */}
      <CaseStudyFintechLatencyReduction />

      {/* 11. Animated SampleShowcase Section 4: Quantitative Before & After Matrix */}
      <LightBeforeAfterMatrix />

      {/* 12. Healthcare AI & HIPAA Compliance Case Study */}
      <CaseStudyHealthcareAiCompliance />

      {/* 13. Animated SampleShowcase Section 5: Signature Talent Comparison Slider */}
      <SignatureTalentComparisonSlider />

      {/* 14. GCC Maturity & Engineering Arbitrage Framework */}
      <CaseStudyGccMaturityFramework />

      {/* 15. Animated SampleShowcase Section 6: Circular Progress Reveal */}
      <PinnedCircularProgressReveal />

      {/* 16. Animated SampleShowcase Section 7: Horizontal Benchmark Cards Rail */}
      <HorizontalCardsRail />

      {/* 17. Interactive Industry Metric Filter */}
      <CaseStudyInteractiveMetricFilter />

      {/* 17. Executive Video Testimonial Bento */}
      <CaseStudyVideoTestimonialBento />

      {/* 18. Client VP & CTO Quote Highlights */}
      <CaseStudyExecutiveQuoteHighlight />

      {/* 19. Service Level Agreement Guarantees */}
      <DetailServiceLevelGuaranteeSla />

      {/* 20. Enterprise Proof FAQs */}
      <FaqAccordionInteractiveSearch />

      {/* 21. Download GCC Compensation & Case Benchmark Report */}
      <CtaDownloadGccCompReport />

      {/* 22. Footer */}
      <LightDirectContactSection />
      <SiteFooter />
    </div>
  );
}
