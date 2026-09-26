import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ServiceTier {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  pricing: string;
  idealFor: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

export interface ServiceComparisonProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  tiers?: ServiceTier[];
}

export const ServiceComparison: React.FC<ServiceComparisonProps> = ({
  badge = 'Engagement Architecture',
  title = 'Tailored Engagement Models for Every Growth Stage',
  subtitle = 'Transparent, SLA-backed service tiers designed for rapid hiring velocity and zero-risk scalability.',
  tiers = [
    {
      id: 'contingent',
      name: 'Precision Search',
      tagline: 'High-velocity technical hiring with zero upfront financial commitment.',
      pricing: 'Success-Based Fee',
      idealFor: 'Mid to Senior & Staff Engineers (1 - 5 roles)',
      features: [
        'Guaranteed 48 to 72-hour calibrated shortlist',
        'Senior technical architect candidate screening',
        '90-Day unconditional replacement guarantee',
        'Access to proprietary passive candidate bench',
        'Real-time client portal tracking & analytics',
      ],
      ctaText: 'Start Contingent Search',
      ctaLink: '/employers?model=contingent',
      popular: false,
    },
    {
      id: 'retained',
      name: 'Retained Executive Search',
      badge: 'Highest Priority SLA',
      tagline: 'Dedicated confidential search for VP, Director, and C-Suite technology leadership.',
      pricing: 'Retained Milestone Fee',
      idealFor: 'CTOs, VPs of Eng, Head of AI, Site Directors',
      features: [
        'Dedicated Senior Partner leading the search exclusively',
        'Comprehensive 360-degree market talent mapping',
        'Forensic background, compensation & reputational vetting',
        '180-Day extended replacement warranty',
        'Custom compensation & equity structuring advisory',
      ],
      ctaText: 'Retain Executive Partner',
      ctaLink: '/employers?model=retained',
      popular: true,
    },
    {
      id: 'gcc-pod',
      name: 'Turnkey GCC Squad Buildout',
      tagline: 'Rapid incubation of high-output engineering teams in Bangalore, Hyderabad, or Pune.',
      pricing: 'Structured Sprint Model',
      idealFor: 'US/EU companies building India Tech Hubs (10 - 50+ roles)',
      features: [
        'Complete pod buildout (Site Lead + Tech Leads + Engineers)',
        'Local legal entity, payroll & compliance guidance',
        'Turnkey office location & IT infrastructure assistance',
        'Standardized technical calibration across all hires',
        'Dedicated 3-recruiter squad working exclusively on site setup',
      ],
      ctaText: 'Consult on GCC Setup',
      ctaLink: '/employers?model=gcc',
      popular: false,
    },
  ],
}) => {
  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 0 auto' }}>
            {subtitle}
          </p>
        </div>

        {/* 3-Column Tier Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                borderRadius: 'var(--radius-2xl)',
                backgroundColor: 'var(--color-surface)',
                border: tier.popular ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: tier.popular ? '0 15px 35px rgba(59, 130, 246, 0.25)' : 'var(--shadow-md)',
              }}
            >
              {tier.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    padding: '0.25rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tier.badge || 'Recommended'}
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  {tier.name}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {tier.tagline}
                </p>

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                    Pricing Structure
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-400)', marginTop: '0.25rem' }}>
                    {tier.pricing}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    Best for: {tier.idealFor}
                  </div>
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                      <Check size={16} color="var(--color-primary-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={tier.ctaLink}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: tier.popular ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                  border: tier.popular ? 'none' : '1px solid var(--color-border)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{tier.ctaText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
