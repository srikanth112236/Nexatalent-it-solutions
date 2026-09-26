import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const LightScrollSnappingStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Color transformation on scroll (Pattern 43)
      gsap.to(containerRef.current, {
        backgroundColor: '#eff6ff',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            Pattern 42 & 43 · Scroll Snapping & Progressive Color Transformation
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Seamless Environmental Progression
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Notice the subtle background atmospheric shift from pure crisp white into soft trust azure as you scroll through our key metrics.
          </p>
        </div>

        {/* Story Snapshot Trio */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Zap size={20} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>
              48 Hours
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.75rem' }}>
              First Shortlist SLA
            </h4>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
              Receive 3 to 5 interview-ready engineering candidates within 48 hours of mandate configuration.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>
              90 Days
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#059669', marginBottom: '0.75rem' }}>
              Escrow Replacement Guarantee
            </h4>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
              Unconditional warranty on every placement. Immediate priority escalation at zero extra cost.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={20} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>
              94.8%
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.75rem' }}>
              Offer Acceptance Ratio
            </h4>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
              Rigorous pre-closing alignment ensures almost zero offer drop-off or counter-offer leakage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
