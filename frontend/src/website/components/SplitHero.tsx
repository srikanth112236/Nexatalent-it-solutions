import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../../shared/primitives';

export interface SplitHeroProps {
  tagline?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const SplitHero: React.FC<SplitHeroProps> = ({
  tagline = 'Human Rigor + Systematic Scale',
  title = 'The Intelligent Hiring Engine for Modern Engineering Teams',
  description = 'Eliminate recruitment noise with pre-assessed, validated technology specialists delivered straight into your pipeline with zero agency friction.',
  ctaText = 'Start Hiring Campaign',
  ctaLink = '/employers',
}) => {
  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
        {/* Left Column: Copy */}
        <div>
          <Badge variant="accent" style={{ marginBottom: '1.25rem' }}>{tagline}</Badge>
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              color: '#ffffff',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            {description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to={ctaLink} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg">{ctaText} &rarr;</Button>
            </Link>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg">How We Verify</Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Aceternity-style Interactive Glassmorphism Card */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--color-border)',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-20%',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 700 }}>
                NT
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Candidate Quality Index</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Verified Pipeline Match</div>
              </div>
            </div>
            <Badge variant="success">98.2% Accuracy</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>Architecture & Cloud Systems</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Top 2%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>Production Incident Leadership</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Top 5%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
