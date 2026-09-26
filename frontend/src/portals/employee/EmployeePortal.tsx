import { PortalShell } from '../common/PortalShell';

const navItems = [
  { label: 'Overview', path: '/employee' },
  { label: 'CRM & Accounts', path: '/employee/crm' },
  { label: 'Recruitment Tasks', path: '/employee/tasks' },
  { label: 'Quarterly Targets', path: '/employee/targets' },
  { label: 'Reports', path: '/employee/reports' },
];

export function EmployeePortal() {
  return (
    <PortalShell portalTitle="Internal Employee Portal" portalRole="employee" navItems={navItems}>
      <div style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Operations & Client Portfolio
        </h1>
        <p style={{ color: 'var(--color-text-muted, #94a3b8)', marginBottom: '2rem' }}>
          Track commercial relationships, operational tasks, and quarterly recruitment targets.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Accounts</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>14</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tasks Due Today</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-warning, #f59e0b)' }}>5</div>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '12px', border: '1px solid var(--color-border, #1e293b)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Target Attainment</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success, #10b981)' }}>84%</div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
