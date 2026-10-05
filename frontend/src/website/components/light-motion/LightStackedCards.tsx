import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface SolutionCardData {
  id: string;
  step: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  stat: string;
  statLabel: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  accentColor: string;
}

const solutionCards: SolutionCardData[] = [
  {
    id: 'contingent-precision',
    step: '01 / ENGAGEMENT PILLAR',
    badge: 'High Velocity Search',
    title: 'Precision Contingent Search',
    tagline: 'Zero financial exposure until candidate successfully completes onboarding.',
    description: 'Specialized senior engineering search delivering calibrated, pre-screened contenders through a structured calibration window.',
    highlights: [
      'Architect-led technical code and system design screening',
      'Direct interview calendar synchronization with hiring teams',
      'Defined replacement terms backed by dedicated squad',
    ],
    stat: 'Calibrated',
    statLabel: 'Shortlist Delivery Flow',
    ctaText: 'Explore Contingent Model',
    ctaLink: '/employers?model=contingent',
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
    accentColor: '#16a34a',
  },
  {
    id: 'retained-executive',
    step: '02 / ENGAGEMENT PILLAR',
    badge: 'Confidential Executive',
    title: 'Retained Technology Leadership Search',
    tagline: 'Exclusive, discreet searches for VP Engineering, CTO, and Head of AI.',
    description: 'Comprehensive talent mapping across established technology employers and venture-backed platforms. Senior partner leads calibration from inception to offer closure.',
    highlights: [
      'Practitioner debriefs and structured compensation vetting',
      'Confidential outreach preserving client market posture',
      'Defined executive tenure terms & board reporting package',
    ],
    stat: 'Partner-Led',
    statLabel: 'Retained Search Motion',
    ctaText: 'Retain Partner Practice',
    ctaLink: '/employers?model=retained',
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
    accentColor: '#2563eb',
  },
  {
    id: 'gcc-turnkey',
    step: '03 / ENGAGEMENT PILLAR',
    badge: 'Global Scale Hub',
    title: 'Turnkey India GCC Squad Buildout',
    tagline: 'Incubate engineering hubs across major Indian technology corridors.',
    description: 'Planned assembly of full-stack engineering pods including Site Directors, Engineering Managers, and Staff Leads with standardized technical rubrics.',
    highlights: [
      'Complete pod incubation (Site Lead + Core Tech Leads + Senior ICs)',
      'Local legal entity, payroll advisory, and state-of-the-art office support',
      'Dedicated 3-recruiter squad working exclusively on site setup',
    ],
    stat: 'Phased',
    statLabel: 'Team Deployment Motion',
    ctaText: 'Build Turnkey GCC',
    ctaLink: '/employers?model=gcc',
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
    accentColor: '#9333ea',
  },
  {
    id: 'screening-service',
    step: '04 / ENGAGEMENT PILLAR',
    badge: 'Technical Intelligence',
    title: 'Technical Screening as a Service (TSaaS)',
    tagline: 'Outsource technical screening to assessed senior architects.',
    description: 'Stop burning your high-value engineering team hours on resume filtering and first-round screens. Receive standardized objective rubrics with video recordings.',
    highlights: [
      'Conducted exclusively by Staff and Principal practitioners',
      'Standardized scoring across concurrency, distributed systems, and clean code',
      'Integrated directly into your ATS (Greenhouse, Lever, Ashby)',
    ],
    stat: 'Focused',
    statLabel: 'Engineering Hours Redirected',
    ctaText: 'Deploy Screening Service',
    ctaLink: '/employers?model=tsaas',
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
    accentColor: '#ea580c',
  },
];

export const LightStackedCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !cardsWrapperRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.stacked-solution-card');
    if (cards.length <= 1) return;

    // Pinning and Stacking animation on scroll
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Last card stays visible

        gsap.to(card, {
          scale: 0.92 - i * 0.03,
          yPercent: -15,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        });
      });
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
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section Header */}
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
            <Layers size={14} />
            C08 Stacked Cards on Scroll Pattern
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)' }}>
            Tailored Engagement Models That Stack to Scale
          </h2>
          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Scroll down to watch each engagement tier smoothly stack into a cohesive talent partnership.
          </p>
        </div>

        {/* Stacked Cards Container */}
        <div
          ref={cardsWrapperRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            position: 'relative',
          }}
        >
          {solutionCards.map((card, idx) => (
            <div
              key={card.id}
              className="stacked-solution-card"
              style={{
                position: 'sticky',
                top: `${100 + idx * 24}px`,
                borderRadius: '24px',
                backgroundColor: 'var(--nt-surface, #ffffff)',
                border: '1px solid var(--nt-border, #e2e8f0)',
                padding: '3rem 2.5rem',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
                background: card.bgGradient,
                transformOrigin: 'top center',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: card.accentColor, letterSpacing: '0.05em' }}>
                      {card.step}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--nt-surface, #ffffff)',
                        border: '1px solid #cbd5e1',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        color: 'var(--nt-muted, #475569)',
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                    {card.title}
                  </h3>

                  <p style={{ fontSize: '1.0625rem', fontWeight: 600, color: card.accentColor, marginBottom: '0.75rem' }}>
                    {card.tagline}
                  </p>

                  <p style={{ fontSize: '0.9375rem', color: 'var(--nt-muted, #475569)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {card.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
                    {card.highlights.map((h, hIdx) => (
                      <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--nt-ink-2, #1e293b)' }}>
                        <CheckCircle2 size={16} color={card.accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={card.ctaLink}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: card.accentColor,
                      color: '#ffffff',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Right Visual Stat Highlight */}
                <div
                  style={{
                    backgroundColor: 'var(--nt-surface, #ffffff)',
                    borderRadius: '20px',
                    border: '1px solid var(--nt-border, #e2e8f0)',
                    padding: '2.5rem',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: `${card.accentColor}15`,
                      color: card.accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto',
                    }}
                  >
                    {idx === 0 && <Zap size={28} />}
                    {idx === 1 && <ShieldCheck size={28} />}
                    {idx === 2 && <Globe size={28} />}
                    {idx === 3 && <Cpu size={28} />}
                  </div>

                  <div style={{ fontSize: '3.25rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', lineHeight: 1 }}>
                    {card.stat}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {card.statLabel}
                  </div>

                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--nt-border, #e2e8f0)', fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600 }}>
                    ✓ 100% Contractually Enforced Standard
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
