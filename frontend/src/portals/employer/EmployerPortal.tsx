import { PortalShell } from '../common/PortalShell';

const navItems = [
  { label: 'Hiring Overview', path: '/employer' },
  { label: 'Company Profile', path: '/employer/company' },
  { label: 'Active Requirements', path: '/employer/requirements' },
  { label: 'Candidate Shortlists', path: '/employer/candidates' },
  { label: 'Interviews & Feedback', path: '/employer/interviews' },
  { label: 'Hiring Reports', path: '/employer/reports' },
];

export function EmployerPortal() {
  return (
    <PortalShell portalTitle="Employer Workspace" portalRole="employer" navItems={navItems}>
      <div style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Employer Hiring Intelligence
        </h1>
        <p style={{ color: 'var(--color-text-muted, #94a3b8)', marginBottom: '2rem' }}>
          Submit requisitions, review qualified shortlists, and submit interview feedback in real-time.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Open Positions</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>7</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Shortlisted Candidates</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary, #3b82f6)' }}>22</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Offers Accepted</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success, #10b981)' }}>3</div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
