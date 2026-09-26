import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Cpu, Code2, Database, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const LightRadialExpansion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Radial Expansion & Collapse Timeline on Scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 30%',
          end: 'bottom 70%',
          scrub: 1,
        },
      });

      // Expand 4 satellites radially outward
      tl.fromTo('.radial-node-top', { y: 0, opacity: 0, scale: 0.5 }, { y: -130, opacity: 1, scale: 1, duration: 1 }, 0)
        .fromTo('.radial-node-bottom', { y: 0, opacity: 0, scale: 0.5 }, { y: 130, opacity: 1, scale: 1, duration: 1 }, 0)
        .fromTo('.radial-node-left', { x: 0, opacity: 0, scale: 0.5 }, { x: -220, opacity: 1, scale: 1, duration: 1 }, 0)
        .fromTo('.radial-node-right', { x: 0, opacity: 0, scale: 0.5 }, { x: 220, opacity: 1, scale: 1, duration: 1 }, 0)
        .fromTo('.radial-ring', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0);
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
        overflow: 'hidden',
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
            Pattern 32 & 33 · Radial Expansion & Collapse
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Multi-Signal Calibration Orbit
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Scroll down to watch skills, system concurrency, and domain intelligence expand radially from the central matching core.
          </p>
        </div>

        {/* Orbit Visualization Arena */}
        <div
          style={{
            position: 'relative',
            height: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Radial Expanding Ring */}
          <div
            className="radial-ring"
            style={{
              position: 'absolute',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              border: '2px dashed #cbd5e1',
              pointerEvents: 'none',
            }}
          />

          {/* Central Match Engine Core */}
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 45px rgba(37, 99, 235, 0.4)',
              zIndex: 10,
              position: 'relative',
            }}
          >
            <Cpu size={32} />
            <span style={{ fontSize: '0.875rem', fontWeight: 900, marginTop: '0.35rem' }}>CORE</span>
            <span style={{ fontSize: '0.625rem', opacity: 0.85, textTransform: 'uppercase' }}>Match Engine</span>
          </div>

          {/* Satellite Node Top: Architecture Skills */}
          <div
            className="radial-node-top"
            style={{
              position: 'absolute',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem 1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              zIndex: 5,
            }}
          >
            <Code2 size={18} color="#2563eb" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>System Architecture</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Raft, Paxos, eBPF</div>
            </div>
          </div>

          {/* Satellite Node Bottom: Compensation & Notice */}
          <div
            className="radial-node-bottom"
            style={{
              position: 'absolute',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem 1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              zIndex: 5,
            }}
          >
            <Shield size={18} color="#16a34a" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>Escrow Warranty</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>90-Day Protection</div>
            </div>
          </div>

          {/* Satellite Node Left: Industry Domain */}
          <div
            className="radial-node-left"
            style={{
              position: 'absolute',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem 1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              zIndex: 5,
            }}
          >
            <Database size={18} color="#7c3aed" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>FinTech & HFT</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Sub-microsecond</div>
            </div>
          </div>

          {/* Satellite Node Right: Speed to Offer */}
          <div
            className="radial-node-right"
            style={{
              position: 'absolute',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1rem 1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              zIndex: 5,
            }}
          >
            <Zap size={18} color="#ea580c" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>48h Shortlist SLA</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Contractually Backed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
