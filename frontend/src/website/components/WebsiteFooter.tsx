import { Link } from 'react-router-dom';

export function WebsiteFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border, #1e293b)',
      backgroundColor: 'var(--color-surface, #111726)',
      padding: '4rem 2rem 2rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Nexa<span style={{ color: 'var(--color-primary, #3b82f6)' }}>Talent</span>
            </div>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Enterprise recruitment technology platform delivering verified specialist talent across global engineering and leadership hubs.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Solutions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--color-text-muted, #94a3b8)' }}>
              <Link to="/solutions/permanent-hiring">Permanent Hiring</Link>
              <Link to="/solutions/contract-staffing">Contract Staffing</Link>
              <Link to="/solutions/executive-search">Executive Search</Link>
              <Link to="/solutions/gcc-hiring">GCC & Tech Hubs</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Portals & Access
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--color-text-muted, #94a3b8)' }}>
              <Link to="/candidate">Candidate Hub</Link>
              <Link to="/employer">Employer Workspace</Link>
              <Link to="/recruiter">Recruiter Console</Link>
              <Link to="/employee">Internal Employee Portal</Link>
              <Link to="/superadmin">Super Admin Console</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Contact & Trust
            </h4>
            <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              support@nexatalent.com<br />
              Enterprise Security & GDPR Compliant
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border-subtle, #141c2e)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', color: 'var(--color-text-muted, #94a3b8)' }}>
          <p>© {new Date().getFullYear()} NexaTalent Platform Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
