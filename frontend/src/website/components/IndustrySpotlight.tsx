import React from 'react';
import { CheckCircle2, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface IndustrySpotlightProps {
  badge?: string;
  industryTitle?: string;
  tagline?: string;
  description?: string;
  metrics?: Array<{ label: string; value: string }>;
  rolesPlacing?: string[];
  ctaLink?: string;
  ctaText?: string;
}

export const IndustrySpotlight: React.FC<IndustrySpotlightProps> = ({
  badge = 'Vertical Focus Mandates',
  industryTitle = 'GCCs & High-Throughput Engineering Centers',
  tagline = 'Scaling Global Capability Centers in India with Zero Ramp-Up Latency',
  description = 'We help US and European product companies architect and staff world-class engineering hubs in Bangalore, Hyderabad, and Pune. From Founding Principal Engineers to Country Directors.',
  metrics = [
    { label: 'GCCs Established', value: '18+' },
    { label: 'Senior Engineers Placed', value: '1,450+' },
    { label: 'Shortlist to Offer Rate', value: '88%' },
    { label: 'Avg Joining Time', value: '26 Days' },
  ],
  rolesPlacing = [
    'Founding Tech Lead / Architect (C++20, Rust, Distributed Logs)',
    'Head of Engineering / GCC Site Leader',
    'Principal Security & Compliance Architect (SOC2, HIPAA)',
    'VP of Data Platform (Kafka, ClickHouse, Apache Iceberg)',
  ],
  ctaLink = '/industries/gcc',
  ctaText = 'Explore GCC Practice Capabilities',
}) => {
  return (
    <section
      style={{
        padding: '5rem 2rem',
        borderRadius: 'var(--radius-2xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        margin: '2rem auto',
        maxWidth: '1200px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Context & Roles */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.875rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontSize: '0.8125rem',
              color: 'var(--color-primary-400)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            <Layers size={14} />
            {badge}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              lineHeight: 1.25,
              marginBottom: '1rem',
            }}
          >
            {industryTitle}
          </h2>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-primary-400)',
              marginBottom: '1rem',
            }}
          >
            {tagline}
          </h3>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            {description}
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-tertiary)',
                marginBottom: '0.75rem',
              }}
            >
              High-Velocity Role Profiles
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {rolesPlacing.map((role, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    fontSize: '0.9375rem',
                    color: 'var(--color-text)',
                  }}
                >
                  <CheckCircle2 size={16} color="var(--color-primary-400)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to={ctaLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            }}
          >
            <span>{ctaText}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right Column: Quantitative Proof Metrics Bento Box */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.25rem',
          }}
        >
          {metrics.map((m, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(17, 23, 38, 0.7)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--color-text)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
