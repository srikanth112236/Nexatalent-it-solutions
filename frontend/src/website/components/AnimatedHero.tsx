import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/primitives';

export interface AnimatedHeroProps {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  metrics?: Array<{ label: string; value: string }>;
}

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  badgeText = 'NexaTalent Intelligence Operating System',
  headline = 'Precision Hiring Powered by Global Tech Architecture',
  subheadline = 'Connecting venture-backed enterprises, scale-ups, and global GCC hubs with verified elite engineering and leadership talent.',
  primaryCtaText = 'Request Specialist Talent',
  primaryCtaLink = '/employers',
  secondaryCtaText = 'Browse Open Roles',
  secondaryCtaLink = '/jobs',
  metrics = [
    { label: 'Verified Engineers', value: '45,000+' },
    { label: 'Avg Sourcing Time', value: '4.2 Days' },
    { label: 'Shortlist Acceptance', value: '94%' },
  ],
}) => {
  return (
    <section
      style={{
        position: 'relative',
        padding: '7rem 2rem 5rem 2rem',
        overflow: 'hidden',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent 70%)',
      }}
    >
      {/* Background Grid Pattern (Aceternity style) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        {/* Glow Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'var(--color-primary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-glow-primary)',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
          <span>{badgeText}</span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            marginBottom: '1.5rem',
            color: '#ffffff',
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
          }}
        >
          {subheadline}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link to={primaryCtaLink} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">
              {primaryCtaText} &rarr;
            </Button>
          </Link>
          <Link to={secondaryCtaLink} style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="lg">
              {secondaryCtaText}
            </Button>
          </Link>
        </div>

        {/* Metric Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '1.5rem 2rem',
            backgroundColor: 'rgba(17, 23, 38, 0.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
          }}
        >
          {metrics.map((m, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
