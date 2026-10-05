import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SampleShowcase } from './SampleShowcase';
import { SampleComponentsPage } from './SampleComponentsPage';

/**
 * AllShowcase — the final clubbed route: EVERYTHING from /sample
 * (20 heroes + 120+ scroll-animated motion sections) followed by
 * EVERYTHING from /sample-components (5 navbars, 5 footers, 50 static
 * enterprise sections), rendered back-to-back on one page.
 * Live at /all (alias /all-components).
 */
export function AllShowcase() {
  useEffect(() => {
    const t1 = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    }, 600);
    const t2 = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    }, 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
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
        isolation: 'isolate',
        backgroundColor: 'var(--nt-surface, #ffffff)',
      }}
    >
      {/* Part 1 — all /sample animated sections */}
      <div style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}>
        <SampleShowcase />
      </div>
      {/* Part 2 — all /sample-components static sections */}
      <div style={{ position: 'relative', isolation: 'isolate', overflow: 'clip' }}>
        <SampleComponentsPage />
      </div>
    </div>
  );
}
