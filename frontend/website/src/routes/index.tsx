import { Routes, Route, Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Public Website Foundation
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.15 }}>
          NexaTalent
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '640px' }}>
          A modern recruitment and talent solutions platform connecting businesses, recruiters, and candidates.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ padding: '1.75rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Employers</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Scale your team with verified specialist talent and real-time candidate pipeline visibility.
          </p>
          <a href="/employers" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            Explore Employer Solutions &rarr;
          </a>
        </div>

        <div style={{ padding: '1.75rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Candidates</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Access curated career opportunities across high-growth engineering, product, and leadership roles.
          </p>
          <a href="/jobs" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            Browse Open Roles &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 — Page Not Found</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>The page you requested does not exist.</p>
      <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Return to Homepage</Link>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
