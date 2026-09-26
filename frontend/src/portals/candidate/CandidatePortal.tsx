import { PortalShell } from '../common/PortalShell';

const navItems = [
  { label: 'Career Dashboard', path: '/candidate' },
  { label: 'My Profile & CV', path: '/candidate/profile' },
  { label: 'Curated Jobs', path: '/candidate/jobs' },
  { label: 'Active Applications', path: '/candidate/applications' },
  { label: 'Upcoming Interviews', path: '/candidate/interviews' },
  { label: 'Documents & Offers', path: '/candidate/documents' },
];

export function CandidatePortal() {
  return (
    <PortalShell portalTitle="Candidate Career Hub" portalRole="candidate" navItems={navItems}>
      <div style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Welcome Back, Talent Partner
        </h1>
        <p style={{ color: 'var(--color-text-muted, #94a3b8)', marginBottom: '2rem' }}>
          Track active mandates, application progress, and interview feedback with top hiring teams.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Applications</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>4</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Interviews Scheduled</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary, #3b82f6)' }}>2</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Profile Match Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success, #10b981)' }}>96%</div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
