import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PortalShellProps {
  portalTitle: string;
  portalRole: string;
  navItems: Array<{ label: string; path: string }>;
  children: ReactNode;
}

export function PortalShell({ portalTitle, portalRole, navItems, children }: PortalShellProps) {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg, #090d16)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--color-surface, #111726)',
        borderRight: '1px solid var(--color-border, #1e293b)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border, #1e293b)' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', textDecoration: 'none' }}>
            Nexa<span style={{ color: 'var(--color-primary, #3b82f6)' }}>Talent</span>
          </Link>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted, #94a3b8)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '0.25rem',
          }}>
            {portalTitle}
          </div>
        </div>

        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? '#ffffff' : 'var(--color-text-muted, #94a3b8)',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border, #1e293b)' }}>
          <Link
            to="/login"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '0.625rem',
              fontSize: '0.825rem',
              color: 'var(--color-danger, #ef4444)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '64px',
          borderBottom: '1px solid var(--color-border, #1e293b)',
          backgroundColor: 'var(--color-surface, #111726)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text, #f8fafc)' }}>
            Workspace / {portalTitle}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.625rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--color-primary, #3b82f6)',
              borderRadius: '9999px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textTransform: 'capitalize',
            }}>
              Role: {portalRole}
            </span>
            <Link to="/" style={{ fontSize: '0.825rem', color: 'var(--color-text-muted, #94a3b8)', textDecoration: 'none' }}>
              &larr; Public Website
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
