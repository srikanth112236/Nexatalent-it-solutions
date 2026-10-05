import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface CorridorMilestone {
  step: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  accent: string;
}

const milestones: CorridorMilestone[] = [
  {
    step: 'CORRIDOR DEPTH 01',
    title: 'Input: Calibration Rubric',
    subtitle: 'Locking production-grade architecture rubrics with Engineering Directors.',
    metric: '100%',
    metricLabel: 'Standardized Objective Rubrics',
    accent: '#2563eb',
  },
  {
    step: 'CORRIDOR DEPTH 02',
    title: 'Traverse: Semantic Vector Sieve',
    subtitle: 'Extracting true production builders across 45,000+ indexed tech leaders.',
    metric: '< 3.5%',
    metricLabel: 'Candidate Sieve Acceptance Rate',
    accent: '#0891b2',
  },
  {
    step: 'CORRIDOR DEPTH 03',
    title: 'Output: 48h Shortlist SLA Delivery',
    subtitle: 'Delivering calibrated contenders directly into your encrypted client portal.',
    metric: '48h',
    metricLabel: 'Contractually Guaranteed SLA',
    accent: '#16a34a',
  },
];

export const LightPerspectiveCorridor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !corridorRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.corridor-depth-card');

    const ctx = gsap.context(() => {
      // Perspective corridor Z-axis animation on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1500',
          pin: true,
          scrub: 1,
        },
      });

      cards.forEach((card, idx) => {
        tl.to(card, {
          scale: 1 + idx * 0.15,
          opacity: idx === cards.length - 1 ? 1 : 0.2,
          y: -50 * idx,
          ease: 'power1.inOut',
          duration: 1,
        }, idx * 0.4);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        color: 'var(--nt-ink, #0f172a)',
        padding: '5rem 2rem',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        perspective: '1200px',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
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
            <Compass size={14} />
            P01, P02 & P03 Perspective Corridor & Depth Tunnel Pattern
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)' }}>
            Traversing the Depth of Candidate Calibration
          </h2>
          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Scroll down to advance through the perspective corridor from input rubrics to verified 48-hour shortlist delivery.
          </p>
        </div>

        {/* 3D Corridor Cards Track */}
        <div
          ref={corridorRef}
          style={{
            position: 'relative',
            height: '420px',
            maxWidth: '780px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {milestones.map((m, idx) => (
            <div
              key={m.step}
              className="corridor-depth-card"
              style={{
                position: 'absolute',
                width: '100%',
                backgroundColor: 'var(--nt-surface, #ffffff)',
                borderRadius: '28px',
                border: `2px solid ${m.accent}`,
                padding: '3rem 2.5rem',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.1)',
                transformOrigin: 'center center',
                zIndex: idx + 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: m.accent, letterSpacing: '0.05em' }}>
                  {m.step}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: `${m.accent}12`,
                    color: m.accent,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                  }}
                >
                  Verified Progression
                </span>
              </div>

              <h3 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
                {m.title}
              </h3>

              <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 2rem auto' }}>
                {m.subtitle}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--nt-surface-2, #f8fafc)',
                  borderRadius: '16px',
                  border: '1px solid var(--nt-border, #e2e8f0)',
                  padding: '1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: m.accent, lineHeight: 1 }}>
                    {m.metric}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)', fontWeight: 600, marginTop: '0.25rem' }}>
                    {m.metricLabel}
                  </div>
                </div>

                <div style={{ textAlign: 'left', borderLeft: '1px solid #cbd5e1', paddingLeft: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.8125rem', fontWeight: 700 }}>
                    <CheckCircle2 size={16} />
                    <span>Quality Calibrated</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--nt-muted, #64748b)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    <Shield size={14} />
                    <span>Escrow Warranty Insured</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <div style={{ marginTop: '3.5rem' }}>
          <Link
            to="/employers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.35)',
            }}
          >
            <span>Launch Mandate via Corridor Engine</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
