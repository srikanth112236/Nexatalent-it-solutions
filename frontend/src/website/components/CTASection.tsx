import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CTASectionProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  highlights?: string[];
}

export const CTASection: React.FC<CTASectionProps> = ({
  badge = 'Ready to Transform Your Engineering Bench?',
  title = 'Lock in Your First Elite Tech Shortlist in Under 72 Hours',
  description = 'Join over 120+ VC-backed unicorns and enterprise engineering leaders who trust NexaTalent for precision hiring.',
  primaryCtaText = 'Initiate Enterprise Search',
  primaryCtaLink = '/contact',
  secondaryCtaText = 'Browse Active Mandates',
  secondaryCtaLink = '/jobs',
  highlights = [
    'Zero upfront retainers for qualifying roles',
    'Guaranteed 90-day replacement warranty',
    'Pre-calibrated senior engineers only',
  ],
}) => {
  return (
    <section
      style={{
        padding: '5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.95) 70%)',
          padding: '4rem 2.5rem',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
        }}
      >
        {/* Glow ambient background spot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'var(--color-primary-400)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} />
            {badge}
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              maxWidth: '850px',
              margin: '0 auto 1.25rem auto',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '650px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            <Link
              to={primaryCtaLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                padding: '0.875rem 1.875rem',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)',
              }}
            >
              <span>{primaryCtaText}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to={secondaryCtaLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                padding: '0.875rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              <span>{secondaryCtaText}</span>
            </Link>
          </div>

          {/* Bullet Highlights */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {highlights.map((h, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
