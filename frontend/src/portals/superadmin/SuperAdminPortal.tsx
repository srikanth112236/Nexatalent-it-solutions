import { PortalShell } from '../common/PortalShell';

const navItems = [
  { label: 'Overview', path: '/superadmin' },
  { label: 'Organizations & Tenancy', path: '/superadmin/organizations' },
  { label: 'Users & Roles', path: '/superadmin/users' },
  { label: 'Audit Logs', path: '/superadmin/audit-logs' },
  { label: 'System Settings', path: '/superadmin/settings' },
];

export function SuperAdminPortal() {
  return (
    <PortalShell portalTitle="Super Admin Console" portalRole="superadmin" navItems={navItems}>
      <div style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Platform Governance & Controls
        </h1>
        <p style={{ color: 'var(--color-text-muted, #94a3b8)', marginBottom: '2rem' }}>
          Manage multi-tenant organization access, user roles, security audits, and system configuration.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Organizations</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>48</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-success, #10b981)', marginTop: '0.25rem' }}>+6 this quarter</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Platform Users</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>1,280</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary, #3b82f6)', marginTop: '0.25rem' }}>Across 5 roles</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Audit Events (24h)</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>342</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', marginTop: '0.25rem' }}>0 critical alerts</div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
