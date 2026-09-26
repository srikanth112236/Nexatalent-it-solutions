import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{ padding: '6rem 2rem 4rem 2rem', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 1rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--color-primary, #3b82f6)',
          fontSize: '0.825rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}>
          <span>✦</span> Next-Gen Recruitment Infrastructure
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          margin: '0 auto 1.5rem auto',
        }}>
          Precision Hiring Powered by Human Expertise & Intelligent Systems
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--color-text-muted, #94a3b8)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
        }}>
          NexaTalent bridges enterprise hiring demand with verified high-caliber talent across tech, finance, and global GCC operations.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/employers"
            style={{
              padding: '0.875rem 1.75rem',
              backgroundColor: 'var(--color-primary, #3b82f6)',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Request Specialist Talent
          </Link>
          <Link
            to="/jobs"
            style={{
              padding: '0.875rem 1.75rem',
              backgroundColor: 'var(--color-surface, #111726)',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: '1px solid var(--color-border, #1e293b)',
            }}
          >
            Explore Open Roles
          </Link>
        </div>
      </section>

      {/* Dual Value Proposition Section */}
      <section style={{ maxWidth: '1280px', margin: '2rem auto 6rem auto', padding: '0 2rem', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div style={{
            padding: '2.5rem',
            backgroundColor: 'var(--color-surface, #111726)',
            borderRadius: '16px',
            border: '1px solid var(--color-border, #1e293b)',
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-accent, #06b6d4)', textTransform: 'uppercase' }}>
              For Employers & GCC Leaders
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.75rem 0 1rem 0' }}>
              Scale Without Compromise
            </h3>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Access vetted candidate pools with validated competencies, salary benchmarks, and immediate availability. Full visibility from qualification to onboarding.
            </p>
            <Link to="/employer" style={{ color: 'var(--color-primary, #3b82f6)', fontWeight: 600, fontSize: '0.9rem' }}>
              Open Employer Workspace &rarr;
            </Link>
          </div>

          <div style={{
            padding: '2.5rem',
            backgroundColor: 'var(--color-surface, #111726)',
            borderRadius: '16px',
            border: '1px solid var(--color-border, #1e293b)',
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-success, #10b981)', textTransform: 'uppercase' }}>
              For High-Impact Candidates
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.75rem 0 1rem 0' }}>
              Elevate Your Career Trajectory
            </h3>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Direct access to leadership mandates and senior engineering opportunities at top tech innovators and high-growth enterprises.
            </p>
            <Link to="/candidate" style={{ color: 'var(--color-primary, #3b82f6)', fontWeight: 600, fontSize: '0.9rem' }}>
              Access Candidate Hub &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
