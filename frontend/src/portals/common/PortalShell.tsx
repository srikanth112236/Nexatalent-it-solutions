import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CandidateInspectionDrawer } from './CandidateInspectionDrawer';
import { Logo } from '../../website/components/Logo';
import { User, LogOut, ShieldCheck, Building2, Menu, X, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { clearSession, getTenantId, getUserEmail } from '../../shared/auth/session';

interface PortalShellProps {
  portalTitle: string;
  portalRole: string;
  navItems: Array<{ label: string; path: string }>;
  children: ReactNode;
}

export function PortalShell({ portalTitle, portalRole, navItems, children }: PortalShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('nexa:sidebar-collapsed') === '1'; } catch { return false; }
  });
  const toggleCollapsed = () => {
    setCollapsed((v) => {
      try { localStorage.setItem('nexa:sidebar-collapsed', v ? '0' : '1'); } catch { /* noop */ }
      return !v;
    });
  };
  const activeTenantId = getTenantId() || 'TNT-9011';
  const userEmail = getUserEmail() || `${portalRole || 'user'}@nexatalent.com`;
  const safeNavItems = Array.isArray(navItems) ? navItems : [];
  const fallbackPath = safeNavItems[0]?.path || '/login';
  const roleInitial = (portalRole || 'U').charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await apiClient.post('/api/v1/auth/logout', {
        email: userEmail,
        tenantId: activeTenantId,
        reason: 'USER_SIGN_OUT',
      });
    } catch (err) {
      console.warn('Logout API call notice:', err);
    } finally {
      clearSession();
      navigate('/login', { replace: true });
    }
  };

  return (
      <div className="min-h-screen flex bg-[#FAF8F5] text-slate-900 font-sans">

        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Clean Light Sidebar — collapsible on desktop, drawer on mobile */}
        <aside className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/90 flex flex-col justify-between shadow-sm shrink-0 transform transition-all duration-200 lg:static lg:translate-x-0 ${collapsed ? 'lg:w-20 w-64' : 'w-64'} ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            {/* Header Brand */}
            <div className={`p-6 border-b border-slate-100 ${collapsed ? 'lg:p-4' : ''}`}>
              <Link to="/" className="inline-block">
                <Logo height={32} />
              </Link>
              <div className={`text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mt-2 flex items-center gap-1 ${collapsed ? 'lg:hidden' : ''}`}>
                <Building2 size={13} className="text-spec-electric" /> {portalTitle}
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="p-4 space-y-1" aria-label="Workspace sections">
              {safeNavItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== fallbackPath && location.pathname.startsWith(item.path));
                const initial = item.label.charAt(0).toUpperCase();
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    onClick={() => setMobileNavOpen(false)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${collapsed ? 'lg:px-0 lg:py-3 lg:flex lg:justify-center' : 'block'} ${
                      isActive
                        ? 'bg-spec-navy text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
                    {collapsed && <span className="hidden lg:inline-flex w-8 h-8 rounded-lg bg-spec-navy/5 text-spec-navy font-extrabold items-center justify-center" aria-hidden="true">{initial}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Sign Out Card */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5 mb-3 px-1">
              <div className="w-8 h-8 rounded-full bg-spec-electric/10 text-spec-electric font-bold text-xs flex items-center justify-center shrink-0" title={userEmail}>
                {roleInitial}
              </div>
              <div className={`overflow-hidden ${collapsed ? 'lg:hidden' : ''}`}>
                <div className="text-xs font-extrabold text-slate-900 capitalize truncate">{portalRole} Account</div>
                <div className="text-[10px] font-medium text-slate-500 font-mono truncate">{userEmail}</div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              title="Sign Out via API"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-100/80 font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span className={collapsed ? 'lg:hidden' : ''}>Sign Out via API</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navigation Header */}
          <header className="min-h-16 bg-white border-b border-slate-200/90 px-4 sm:px-8 py-2 flex items-center justify-between gap-3 shadow-xs flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              <button
                type="button"
                className="hidden lg:inline-flex p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                onClick={toggleCollapsed}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
              >
                {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
              </button>
              <span className="hidden sm:inline text-xs font-bold text-slate-500">Workspace</span>
              <span className="hidden sm:inline text-slate-300">/</span>
              <h2 className="text-sm font-extrabold text-slate-900 truncate">{portalTitle}</h2>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-700 hidden md:inline-flex items-center gap-1">
                <ShieldCheck size={12} /> {activeTenantId} Authenticated
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-700">
                <User size={14} className="text-spec-electric" />
                <span className="capitalize">{portalRole} Workspace</span>
              </div>

              <Link to="/" className="font-bold text-slate-500 hover:text-spec-electric transition-colors">
                ← Public Website
              </Link>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Candidate Inspection Drawer Component */}
        <CandidateInspectionDrawer />
      </div>
  );
}
