import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Shared production chrome (all versions): split-brand navbar,
// floating dual-tier CTA band, architectural directory footer.
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import {
  CaseStudyClientLogoWallTicker,
  AboutGccEconomicArbitrageStory,
  DetailTechnicalVettingFunnel,
  DetailGccTurnkeyPodConfigurator,
  DetailServiceLevelGuaranteeSla,
  JobsInteractiveSearchFilterDeck,
  JobsFeaturedMandatesCarousel,
  CaseStudyFintechLatencyReduction,
  CaseStudyExecutiveQuoteHighlight,
  PricingGccRoiCostSimulator,
  FaqAccordionInteractiveSearch,
  CtaExecutiveStrategyBooking,
} from '../components/sample-library';
import { GlyphPortalHero } from '../components/hero-collection';
import {
  LightMetricsCounter,
  SignatureGCCFlightPath,
  CorridorVettingTunnel,
  LightProgressiveWorkflow,
  HorizontalMandateShowcase,
  VerticalParallaxCaseStudy,
  SignatureLiveArbitrageMatrixSlider,
  FullScreenVerticalParallaxTopographicContour,
  FullScreenVerticalParallaxQuantumWave,
  FullScreenDualPinnedConvergenceOrbitalRings,
  SignatureParticleTextMorph,
  FullScreenHorizontalParallaxEditorialScroll,
} from '../components/light-motion';

// Curated V2 narrative — 1 hero + 13 best sections, zero overlap with V1's
// FullScreen pinned spectacle. New design: light editorial → proof →
// practice → product → numbers → jobs → cases → commercial → convert.
const V2_DESIGN: React.FC[] = [
  GlyphPortalHero, // portal — scroll through the monumental N into the story
  CaseStudyClientLogoWallTicker, // trust — client proof strip
  CorridorVettingTunnel, // scroll — cinematic tunnel into the vetting story
  AboutGccEconomicArbitrageStory, // why — GCC value narrative
  LightMetricsCounter, // numbers — animated proof rhythm
  LightProgressiveWorkflow, // scroll — step-by-step process reveal
  DetailTechnicalVettingFunnel, // practice — how talent is vetted
  DetailGccTurnkeyPodConfigurator, // product — interactive pod builder
  SignatureGCCFlightPath, // signature — brand flight-path moment
  FullScreenDualPinnedConvergenceOrbitalRings, // showstopper — gyroscopic rings converge on launch core
  JobsInteractiveSearchFilterDeck, // jobs — live search experience
  HorizontalMandateShowcase, // scroll — horizontal mandates rail
  JobsFeaturedMandatesCarousel, // mandates — featured roles
  VerticalParallaxCaseStudy, // scroll — parallax case-study bridge
  CaseStudyFintechLatencyReduction, // proof — flagship case study
  CaseStudyExecutiveQuoteHighlight, // voice — client testimonial
  FullScreenVerticalParallaxQuantumWave, // scroll — ambient quantum vista
  FullScreenVerticalParallaxTopographicContour, // scroll — visual breather
  SignatureLiveArbitrageMatrixSlider, // scroll — interactive arbitrage slider
  PricingGccRoiCostSimulator, // commercial — interactive ROI math
  DetailServiceLevelGuaranteeSla, // reversal — SLA guarantee
  FullScreenHorizontalParallaxEditorialScroll, // scroll — editorial run-in
  FaqAccordionInteractiveSearch, // objections — searchable FAQ
  SignatureParticleTextMorph, // interactive — particle text finale
  CtaExecutiveStrategyBooking, // convert — strategy booking finale
];

/**
 * HomePageV2 — curated landing page, complete new design vs V1.
 * V1 (/) = dark FullScreen pinned convergence spectacle.
 * V2 (/v2, /home-v2) = light editorial conversion story: full mega-menu
 * navbar, ivory serif hero, scroll-animated corridors + rails + parallax
 * woven between proof → practice → product → jobs → cases → ROI →
 * guarantee → FAQ → booking, enterprise mega footer.
 */
export function HomePageV2() {
  useEffect(() => {
    const t1 = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    }, 400);
    const t2 = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    }, 1200);
    const onResize = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      id="main-content"
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'clip',
        overflowY: 'visible',
        isolation: 'isolate',
        backgroundColor: 'var(--nt-surface, #ffffff)',
      }}
    >
      <SiteNavbar />

      {V2_DESIGN.map((Section, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            zIndex: i + 1,
            isolation: 'isolate',
            overflow: 'clip',
            width: '100%',
            maxWidth: '100vw',
            backgroundColor: 'var(--nt-surface, #ffffff)',
          }}
        >
          <Section />
        </div>
      ))}

      <SiteFooter />
    </div>
  );
}
