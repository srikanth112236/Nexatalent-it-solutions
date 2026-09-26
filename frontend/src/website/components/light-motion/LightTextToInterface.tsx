import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, CheckCircle2, User, Star, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const LightTextToInterface: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline transforming text into interactive UI interface
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 40%',
          end: 'bottom 60%',
          scrub: 1,
        },
      });

      // Text compresses and fades
      tl.to('.transforming-text-block', { opacity: 0.2, scale: 0.9, duration: 1 }, 0)
        // UI fragments snap together into profile card
        .fromTo('.ui-fragment-card', { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1 }, 0.3)
        .fromTo('.ui-fragment-bar-1', { width: '0%' }, { width: '96%', duration: 0.8 }, 0.6)
        .fromTo('.ui-fragment-bar-2', { width: '0%' }, { width: '92%', duration: 0.8 }, 0.7)
        .fromTo('.ui-fragment-bar-3', { width: '0%' }, { width: '98%', duration: 0.8 }, 0.8)
        .fromTo('.ui-fragment-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, 0.9);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
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
            Pattern 34 & 35 · Text to Interface Transformation & Fragment Assembly
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            From Semantic Words to Live Calibrated Interface
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Scroll down to watch raw technical criteria transform dynamically into an assembled candidate scorecard.
          </p>
        </div>

        {/* Transformation Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            textAlign: 'left',
          }}
        >
          {/* Left: Input Text Block */}
          <div
            className="transforming-text-block"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Input: Plain Language Mandate
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              "We need a <span style={{ color: '#2563eb', fontWeight: 700 }}>Staff Distributed SRE</span> who has written production{' '}
              <span style={{ color: '#7c3aed', fontWeight: 700 }}>Rust</span>, managed multi-region{' '}
              <span style={{ color: '#0891b2', fontWeight: 700 }}>Kubernetes</span> clusters with zero downtime, and holds deep{' '}
              <span style={{ color: '#16a34a', fontWeight: 700 }}>eBPF tracing</span> experience."
            </div>
            <div style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
              ↓ NexaTalent parses semantic tokens & concurrency invariants
            </div>
          </div>

          {/* Right: Assembled UI Interface Card */}
          <div
            className="ui-fragment-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '2px solid #2563eb',
              padding: '2.5rem',
              boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Candidate NT-9824</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <MapPin size={13} />
                    <span>Bangalore · Ex-FAANG SRE Lead · 8 Yrs</span>
                  </div>
                </div>
              </div>

              <div
                className="ui-fragment-badge"
                style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#059669',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Star size={13} fill="#059669" />
                <span>98.6% Calibration</span>
              </div>
            </div>

            {/* Assembled Skill Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Rust / Concurrency Limits</span>
                  <span style={{ color: '#2563eb' }}>96%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className="ui-fragment-bar-1" style={{ height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Distributed K8s & Mesh</span>
                  <span style={{ color: '#0891b2' }}>92%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className="ui-fragment-bar-2" style={{ height: '100%', backgroundColor: '#0891b2', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>eBPF Tracing & Observability</span>
                  <span style={{ color: '#16a34a' }}>98%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className="ui-fragment-bar-3" style={{ height: '100%', backgroundColor: '#16a34a', borderRadius: '4px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#059669', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>Available for 48h Shortlist Interview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
