import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, UserCheck, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const LightSplitScreenConvergence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Split Screen Convergence & Divergence Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1600',
          pin: true,
          scrub: 1,
        },
      });

      // Convergence: Sides move toward center
      tl.to('.split-left-panel', { xPercent: 50, opacity: 0.2, duration: 1 }, 0)
        .to('.split-right-panel', { xPercent: -50, opacity: 0.2, duration: 1 }, 0)
        .fromTo('.unified-converged-core', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0.5)
        // Divergence: Separates into two specialized pathways
        .to('.unified-converged-core', { scale: 0.9, opacity: 0.8, duration: 0.6 }, 1.5)
        .fromTo('.divergence-track-left', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 1.8)
        .fromTo('.divergence-track-right', { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 1.8);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface-2, #f8fafc)',
        color: 'var(--nt-ink, #0f172a)',
        padding: '5rem 2rem',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            Pattern 19 & 20 · Split-Screen Convergence & Divergence
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)' }}>
            Two Sides of the Market, One Unified OS
          </h2>
          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Watch employer hiring demands and candidate career aspirations converge into our synchronized talent platform.
          </p>
        </div>

        {/* Convergence Stage Wrapper */}
        <div style={{ position: 'relative', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Left Panel: Employer Demand */}
          <div
            className="split-left-panel"
            style={{
              position: 'absolute',
              left: '4%',
              width: '44%',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              borderRadius: '24px',
              border: '1px solid var(--nt-border, #e2e8f0)',
              padding: '2.5rem',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
              <Building2 size={18} />
              <span>EMPLOYER ECOSYSTEM</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
              High-Velocity Technical Mandates
            </h3>
            <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              48-hour shortlist SLAs, pre-vetted concurrency architecture scorecards, and zero unmanaged agency black boxes.
            </p>
          </div>

          {/* Right Panel: Candidate Ambition */}
          <div
            className="split-right-panel"
            style={{
              position: 'absolute',
              right: '4%',
              width: '44%',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              borderRadius: '24px',
              border: '1px solid var(--nt-border, #e2e8f0)',
              padding: '2.5rem',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
              <UserCheck size={18} />
              <span>CANDIDATE ADVOCACY</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
              Confidential Career Representation
            </h3>
            <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              100% privacy, top-tier compensation benchmarking, equity upside analysis, and direct introductions to CTOs.
            </p>
          </div>

          {/* Central Converged Core */}
          <div
            className="unified-converged-core"
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '650px',
              width: '100%',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              borderRadius: '28px',
              border: '2px solid #2563eb',
              padding: '3rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 25px 60px -12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
              <Zap size={14} />
              SYNCHRONOUS RESOLUTION
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
              The NexaTalent IT Solutions Operating System
            </h3>
            <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Aligning client velocity with candidate ambitions into a calibrated, deterministic matching infrastructure.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/employers"
                className="divergence-track-left"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                <span>For Employers</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/jobs"
                className="divergence-track-right"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                <span>For Candidates</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', color: 'var(--nt-muted, #64748b)', fontSize: '0.8125rem' }}>
              <ShieldCheck size={16} color="#16a34a" />
              <span>94.8% Offer Acceptance Rate across 1,800+ placements</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
