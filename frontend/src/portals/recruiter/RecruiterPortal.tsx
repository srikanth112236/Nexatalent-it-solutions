import { PortalShell } from '../common/PortalShell';

const navItems = [
  { label: 'Pipeline Overview', path: '/recruiter' },
  { label: 'Jobs & Mandates', path: '/recruiter/jobs' },
  { label: 'Talent Pool Search', path: '/recruiter/talent-pool' },
  { label: 'ATS Stages', path: '/recruiter/ats' },
  { label: 'Interviews Scheduled', path: '/recruiter/interviews' },
];

export function RecruiterPortal() {
  return (
    <PortalShell portalTitle="Recruiter Workspace" portalRole="recruiter" navItems={navItems}>
      <div style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Recruitment Pipeline & Candidate Delivery
        </h1>
        <p style={{ color: 'var(--color-text-muted, #94a3b8)', marginBottom: '2rem' }}>
          Screen candidates, advance stages, coordinate client interviews, and manage requisitions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Assigned Jobs</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>12</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Pipeline</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary, #3b82f6)' }}>64 Candidates</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Interviews This Week</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success, #10b981)' }}>18</div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
