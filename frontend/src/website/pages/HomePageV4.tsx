import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Shared production chrome (all versions): split-brand navbar,
// floating dual-tier CTA band, architectural directory footer.
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import {
  AboutEngineeringPedigreeMatrix,
  DetailMigrationAndRebadgingBlueprint,
  DetailCloudAndAiSpecialization,
} from '../components/sample-library';
import { Hero03QuantumH100Cinema, Hero07VerticalFilmstripParallax } from '../components/hero-collection';
import {
  FullScreenHorizontalSplitCurtainPrismBeams,
  FullScreenVerticalParallaxMesh,
  VerticalParallaxCaseStudy,
  FullScreenHorizontalParallaxRail,
  OneSideStickySplitMilestones,
  OneSideStickyFeatureStack,
  ParallaxIsometricCityRamp,
  FullScreenDualPinnedConvergenceIrisAperture,
  FullScreenSplitDivergenceTalentArb,
  DualPinnedConvergenceShowcase,
  StickyPinAccordionReveal,
  LightPerspectiveCorridor,
} from '../components/light-motion';

// V4 journey — exactly the 15 requested sections, in order:
// prism curtain → mesh strata → 75-day story → multi-track rail → sticky
// milestones → sticky terminal → pedigree matrix → migration blueprint →
// campus ramp → iris aperture → cloud/AI guild → talent arbitrage →
// launchpad configurator → accordion unfold → directory footer section.
const V4_DESIGN: React.FC[] = [
  Hero03QuantumH100Cinema,
  Hero07VerticalFilmstripParallax,
  LightPerspectiveCorridor,
  FullScreenHorizontalSplitCurtainPrismBeams,
  FullScreenVerticalParallaxMesh,
  VerticalParallaxCaseStudy,
  FullScreenHorizontalParallaxRail,
  OneSideStickySplitMilestones,
  OneSideStickyFeatureStack,
  AboutEngineeringPedigreeMatrix,
  DetailMigrationAndRebadgingBlueprint,
  ParallaxIsometricCityRamp,
  FullScreenDualPinnedConvergenceIrisAperture,
  DetailCloudAndAiSpecialization,
  FullScreenSplitDivergenceTalentArb,
  DualPinnedConvergenceShowcase,
  StickyPinAccordionReveal,
];

/**
 * HomePageV4 — parallax + rails + sticky-pin journey.
 * V1 (/) = dark pinned convergence spectacle.
 * V2 (/v2) = light editorial conversion story.
 * V3 (/v3) = cinematic filmstrip/divergence journey.
 * V4 (/v4, /home-v4) = prism curtain → strata → rails → stickies →
 * pedigree → ramp → iris → arbitrage → launchpad → accordion, with
 * DevOps terminal navbar and floating dual-tier footer.
 */
export function HomePageV4() {
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

      {V4_DESIGN.map((Section, i) => (
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
