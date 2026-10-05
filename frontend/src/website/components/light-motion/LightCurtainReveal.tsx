import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, ShieldCheck, Eye, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const LightCurtainReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Horizontal Curtain Reveal (Pattern 17)
      gsap.to('.curtain-left', {
        xPercent: -100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.curtain-horizontal-container',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      gsap.to('.curtain-right', {
        xPercent: 100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.curtain-horizontal-container',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      // Vertical Curtain Reveal (Pattern 18)
      gsap.to('.curtain-top', {
        yPercent: -100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.curtain-vertical-container',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      gsap.to('.curtain-bottom', {
        yPercent: 100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.curtain-vertical-container',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="theme-light" style={{ backgroundColor: 'var(--nt-surface, #ffffff)', color: 'var(--nt-ink, #0f172a)', padding: '6rem 2rem', borderBottom: '1px solid var(--nt-border, #e2e8f0)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            Pattern 17 & 18 · Horizontal & Vertical Curtain Reveals
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)' }}>
            Unveiling Proprietary Calibration Systems
          </h2>
          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Scroll down to watch split curtains slide outward to reveal technical architecture and quantified outcomes.
          </p>
        </div>

        {/* Pattern 17: Horizontal Curtain Reveal */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>
            Pattern 17: Horizontal Split Curtain
          </div>

          <div
            className="curtain-horizontal-container"
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              minHeight: '380px',
              border: '1px solid var(--nt-border, #e2e8f0)',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
              backgroundColor: 'var(--nt-surface-2, #f8fafc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Unveiled Inner Content */}
            <div style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '780px', zIndex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Terminal size={24} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
                Semantic Vector Scoring Algorithm Unveiled
              </h3>
              <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Deep embedding matches candidates on actual concurrency code, open source pull requests, and verified system limits. 98.6% candidate alignment on first pass.
              </p>
              <Link
                to="/employers"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                <span>Deploy Vector Matching</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Left Curtain */}
            <div
              className="curtain-left"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '50.5%',
                backgroundColor: '#1e293b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '2rem',
                zIndex: 2,
                boxShadow: '10px 0 30px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700, color: '#94a3b8' }}>
                <Eye size={16} />
                <span>NexaTalent IT Solutions Guard</span>
              </div>
            </div>

            {/* Right Curtain */}
            <div
              className="curtain-right"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '50.5%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '2rem',
                zIndex: 2,
                boxShadow: '-10px 0 30px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#38bdf8' }}>
                48h SLA Protected
              </div>
            </div>
          </div>
        </div>

        {/* Pattern 18: Vertical Curtain Reveal */}
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>
            Pattern 18: Vertical Split Curtain
          </div>

          <div
            className="curtain-vertical-container"
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              minHeight: '380px',
              border: '1px solid var(--nt-border, #e2e8f0)',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Unveiled Inner Content */}
            <div style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '780px', zIndex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#065f46', marginBottom: '0.75rem' }}>
                100% Contractually Enforced 90-Day Warranty
              </h3>
              <p style={{ color: '#047857', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Every single candidate placement is insured with our unconditional 90-day replacement policy. If performance does not align, we remount search priority at zero fee.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#059669', color: '#ffffff', padding: '0.75rem 1.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9375rem' }}>
                <span>Active Warranty Charter Verified</span>
              </div>
            </div>

            {/* Top Curtain */}
            <div
              className="curtain-top"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50.5%',
                backgroundColor: '#1e293b',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '1rem',
                zIndex: 2,
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8' }}>Vertical Split Reveal</span>
            </div>

            {/* Bottom Curtain */}
            <div
              className="curtain-bottom"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50.5%',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '1rem',
                zIndex: 2,
                boxShadow: '0 -10px 30px rgba(0,0,0,0.25)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#4ade80' }}>Escrow Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
