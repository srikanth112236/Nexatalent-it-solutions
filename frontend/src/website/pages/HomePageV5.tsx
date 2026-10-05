import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Shared production chrome (all versions): split-brand navbar,
// floating dual-tier CTA band, architectural directory footer.
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import {
  AboutBusinessArchitectureBlueprint,
  AboutCultureAndWorkplaceShowcase,
} from '../components/sample-library';
import {
 
  HorizontalCardsRail,
  HorizontalMandateShowcase,
  SignatureCompensationHeatmap,
  FullScreenSplitDivergenceExecutive,
  FullScreenDualPinnedConvergenceMatrix,
  ParallaxMultiLayerSplit,
  ParallaxDepthFloatMatrix,
  LightIndustryPracticeGrid,
  FullScreenSplitDivergenceTalentArb,
  FullScreenHorizontalSplitCurtain,
  FullScreenVerticalSplitCurtain,
  FullScreenHorizontalSplitCurtainLaser,
  FullScreenVerticalSplitCurtainAperture,
  LightHorizontalStory,
  OneSideStickySplitMilestones,
  OneSideStickyFeatureStack,
  LightStackedCards,
  LightTwoColumnPinnedStory,
  LightCaseStudyResultSplit,
  LightServiceTierComparison,
  LightIndustrySpotlight,
} from '../components/light-motion';

// V5 journey — exactly the 16 requested sections, in order:
// multi-layer parallax → metric constellation → practice grid →
// architecture blueprint → GCC rail → mandates rail → heatmap →
// horizontal story → sticky milestones → sticky terminal → culture →
// stacked cards → timeline story → challenge/solution → tiers → fintech.
const V5_DESIGN: React.FC[] = [
  FullScreenHorizontalSplitCurtain, // Pattern 17 horizontal curtain
  FullScreenVerticalSplitCurtain, // Pattern 18 vertical curtain
  FullScreenHorizontalSplitCurtainLaser, // Pattern 17 laser incision
  FullScreenVerticalSplitCurtainAperture, // Pattern 18 aperture blind
  ParallaxDepthFloatMatrix,
  ParallaxMultiLayerSplit,
  LightIndustryPracticeGrid,
  FullScreenSplitDivergenceExecutive, // Pattern 20 divergence executive
  FullScreenDualPinnedConvergenceMatrix, // demand-supply matrix
  FullScreenSplitDivergenceTalentArb, // Pattern 20 talent arbitrage
  AboutBusinessArchitectureBlueprint,
  HorizontalCardsRail,
  HorizontalMandateShowcase,
  
  SignatureCompensationHeatmap,
  LightHorizontalStory,
  OneSideStickySplitMilestones,
  OneSideStickyFeatureStack,
  AboutCultureAndWorkplaceShowcase,
  LightStackedCards,
  LightTwoColumnPinnedStory,
  LightCaseStudyResultSplit,
  LightServiceTierComparison,
  LightIndustrySpotlight,
];

/**
 * HomePageV5 — parallax + rails + sticky-pin practice journey.
 * V1 (/) = dark pinned convergence spectacle.
 * V2 (/v2) = light editorial conversion story.
 * V3 (/v3) = cinematic filmstrip/divergence journey.
 * V4 (/v4) = prism curtain → strata → rails → iris journey.
 * V5 (/v5, /home-v5) = depth parallax → constellation → practice →
 * rails → heatmap → stickies → culture → tiers → fintech, with
 * split-brand corporate navbar and asymmetric bento footer.
 */
export function HomePageV5() {
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

      {V5_DESIGN.map((Section, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            zIndex: i + 1,
            isolation: 'isolate',
            overflowX: 'clip',
            overflowY: 'visible',
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
