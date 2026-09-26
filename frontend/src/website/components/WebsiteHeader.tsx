import { Link } from 'react-router-dom';

export function WebsiteHeader() {
  return (
    <header style={{
      borderBottom: '1px solid var(--color-border, #1e293b)',
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Nexa<span style={{ color: 'var(--color-primary, #3b82f6)' }}>Talent</span>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted, #94a3b8)' }}>
            <Link to="/solutions" style={{ transition: 'color 0.2s' }}>Solutions</Link>
            <Link to="/industries" style={{ transition: 'color 0.2s' }}>Industries</Link>
            <Link to="/jobs" style={{ transition: 'color 0.2s' }}>Jobs</Link>
            <Link to="/employers" style={{ transition: 'color 0.2s' }}>For Employers</Link>
            <Link to="/candidates" style={{ transition: 'color 0.2s' }}>For Candidates</Link>
            <Link to="/case-studies" style={{ transition: 'color 0.2s' }}>Case Studies</Link>
            <Link to="/design-system" style={{ color: 'var(--color-primary, #3b82f6)' }}>Design System</Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/login"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              color: '#ffffff',
            }}
          >
            Sign In
          </Link>
          <Link
            to="/candidate/register"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.5rem 1.125rem',
              backgroundColor: 'var(--color-primary, #3b82f6)',
              color: '#ffffff',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
            }}
          >
            Join Talent Network
          </Link>
        </div>
      </div>
    </header>
  );
}
