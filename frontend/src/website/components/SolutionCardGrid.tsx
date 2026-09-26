import React from 'react';
import { Link } from 'react-router-dom';

const solutions = [
  {
    slug: 'permanent-hiring',
    title: 'Permanent Hiring',
    desc: 'Full-lifecycle technical recruitment for mission-critical core team additions.',
    tag: 'Core Teams',
  },
  {
    slug: 'contract-staffing',
    title: 'Contract Staffing',
    desc: 'Agile specialist deployment for high-priority sprints, migrations, and tech roadmaps.',
    tag: 'Flexible Staffing',
  },
  {
    slug: 'executive-search',
    title: 'Executive Search',
    desc: 'Discrete leadership placement for CTOs, VPs of Engineering, and Heads of Product.',
    tag: 'Executive',
  },
  {
    slug: 'gcc-hiring',
    title: 'GCC & Global Tech Hubs',
    desc: 'Building and scaling dedicated Global Capability Centers with complete governance.',
    tag: 'Enterprise Scale',
  },
  {
    slug: 'volume-hiring',
    title: 'Volume Hiring & Ramp-Ups',
    desc: 'High-throughput cohort recruiting maintaining strict bar-raiser standards.',
    tag: 'Scale',
  },
  {
    slug: 'talent-advisory',
    title: 'Talent Market Advisory',
    desc: 'Compensation calibration, tech stack availability analysis, and competitor benchmarking.',
    tag: 'Intelligence',
  },
];

export const SolutionCardGrid: React.FC = () => {
  return (
    <section style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hiring Capabilities
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, marginTop: '0.5rem' }}>
            Tailored Solutions for Every Growth Horizon
          </h2>
        </div>
        <Link to="/solutions" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
          Explore All Solutions &rarr;
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {solutions.map((sol) => (
          <Link
            key={sol.slug}
            to={`/solutions/${sol.slug}`}
            style={{
              padding: '2.5rem',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {sol.tag}
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', margin: '0.75rem 0 0.5rem 0' }}>
                {sol.title}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                {sol.desc}
              </p>
            </div>
            <div style={{ marginTop: '2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>View Engagement Model</span>
              <span>&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
