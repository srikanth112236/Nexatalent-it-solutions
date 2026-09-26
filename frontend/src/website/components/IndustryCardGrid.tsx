import React from 'react';
import { Link } from 'react-router-dom';

const industries = [
  { slug: 'technology', name: 'Cloud & Deep Tech', roles: 'Architects, Distributed Systems, ML Engineers' },
  { slug: 'bfsi', name: 'BFSI & Fintech', roles: 'Trading Systems, Risk Engineers, Core Banking' },
  { slug: 'healthcare', name: 'HealthTech & Bio', roles: 'Bioinformatics, HIPAA Compliance, Devices' },
  { slug: 'gcc', name: 'Global Capability Centers', roles: 'Offshore Engineering Hubs, Site Reliability' },
  { slug: 'manufacturing', name: 'Smart Manufacturing', roles: 'IoT, Supply Chain Engineering, Industrial Automation' },
  { slug: 'retail', name: 'E-Commerce & Retail', roles: 'High-Throughput Platforms, Payment Gateways' },
];

export const IndustryCardGrid: React.FC = () => {
  return (
    <section style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sector Specialization
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: '0.5rem 0 1rem 0' }}>
          Deep Domain Expertise Across Key Verticals
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Our specialist recruiters speak your technology stack and understand your industry's specific compliance constraints.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {industries.map((ind) => (
          <Link
            key={ind.slug}
            to={`/industries/${ind.slug}`}
            style={{
              padding: '2rem',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              {ind.name}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Key Mandates: <span style={{ color: 'var(--color-text)' }}>{ind.roles}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
