import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Shared production chrome (all versions): split-brand navbar,
// floating dual-tier CTA band, architectural directory footer.
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import {
  DetailContractStaffingScaleEngine,
  DetailInteractiveFeatureComparisonTable,
} from '../components/sample-library';
import { Hero07VerticalFilmstripParallax } from '../components/hero-collection';
import {
  LightDashboardAssembly,
  LightPerspectiveCorridor,
  FullScreenSplitDivergenceExecutive,
  FullScreenDualPinnedConvergenceHolo,
  FullScreenVerticalParallaxMesh,
  LightSplitScreenConvergence,
  HorizontalCardsRail,
  OneSideStickySplitMilestones,
  PinnedCircularProgressReveal,
  LightServiceTierComparison,
  LightBeforeAfterMatrix,
  LightEditorialInsightCard,
  LightDirectContactSection,
} from '../components/light-motion';

// V3 journey — exactly the 16 requested sections, in order:
// filmstrip hero → dashboard assembly → corridor → divergence executive →
// holo launchpad → volumetric strata → staffing engine → convergence &
// divergence → GCC rail → comparison table → sticky milestones → radial
// dial → engagement tiers → operating-system advantage → thought
// leadership → advisory intake.
const V3_DESIGN: React.FC[] = [
  Hero07VerticalFilmstripParallax,
  LightDashboardAssembly,
  LightPerspectiveCorridor,
  FullScreenSplitDivergenceExecutive,
  FullScreenDualPinnedConvergenceHolo,
  FullScreenVerticalParallaxMesh,
  DetailContractStaffingScaleEngine,
  LightSplitScreenConvergence,
  HorizontalCardsRail,
  DetailInteractiveFeatureComparisonTable,
  OneSideStickySplitMilestones,
  PinnedCircularProgressReveal,
  LightServiceTierComparison,
  LightBeforeAfterMatrix,
  LightEditorialInsightCard,
  LightDirectContactSection,
];

/**
 * HomePageV3 — cinematic full-screen journey.
 * V1 (/) = dark pinned convergence spectacle.
 * V2 (/v2) = light editorial conversion story.
 * V3 (/v3, /home-v3) = filmstrip → corridors → divergence → holo →
 * strata → engine → rails → dials → tiers → intake, with obsidian
 * command-pill navbar and monolithic dark footer.
 */
export function HomePageV3() {
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

      {V3_DESIGN.map((Section, i) => (
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
