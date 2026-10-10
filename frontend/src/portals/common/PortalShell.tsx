import { ReactNode, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CandidateInspectionDrawer } from './CandidateInspectionDrawer';
import { Logo } from '../../website/components/Logo';
import { User, LogOut, ShieldCheck, Building2, Menu, X, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { clearSession, getTenantId, getUserEmail } from '../../shared/auth/session';

export interface PortalNavItem {
  label: string;
  path: string;
  /** Section group — items sharing a group render under one collapsible header. */
  group?: string;
}

interface PortalShellProps {
  portalTitle: string;
  portalRole: string;
  navItems: PortalNavItem[];
  children: ReactNode;
}

const GROUPS_KEY = 'nexa:sidebar-closed-groups';

function loadClosedGroups(): string[] {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((g) => typeof g === 'string') : [];
  } catch {
    return [];
  }
}

export function PortalShell({ portalTitle, portalRole, navItems, children }: PortalShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('nexa:sidebar-collapsed') === '1'; } catch { return false; }
  });
  const [closedGroups, setClosedGroups] = useState<string[]>(loadClosedGroups);
  const toggleCollapsed = () => {
    setCollapsed((v) => {
      try { localStorage.setItem('nexa:sidebar-collapsed', v ? '0' : '1'); } catch { /* noop */ }
      return !v;
    });
  };
  const toggleGroup = (group: string) => {
    setClosedGroups((prev) => {
      const next = prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group];
      try { localStorage.setItem(GROUPS_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  };
  const activeTenantId = getTenantId() || 'TNT-9011';
  const userEmail = getUserEmail() || `${portalRole || 'user'}@nexatalent.com`;
  const safeNavItems = Array.isArray(navItems) ? navItems : [];
  const fallbackPath = safeNavItems[0]?.path || '/login';
  const roleInitial = (portalRole || 'U').charAt(0).toUpperCase();

  const isActiveItem = (item: PortalNavItem) =>
    location.pathname === item.path || (item.path !== fallbackPath && location.pathname.startsWith(item.path));

  const groups = useMemo(() => {
    const out: Array<{ name: string | null; items: PortalNavItem[] }> = [];
    for (const item of safeNavItems) {
      const last = out[out.length - 1];
      if (last && last.name === (item.group ?? null)) last.items.push(item);
      else out.push({ name: item.group ?? null, items: [item] });
    }
    return out;
  }, [safeNavItems]);

  const activeGroup = useMemo(() => {
    for (const g of groups) {
      if (g.items.some((i) => isActiveItem(i))) return g.name;
    }
    return groups[0]?.name ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, location.pathname]);

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

  const renderLink = (item: PortalNavItem, iconMode: boolean) => {
    const isActive = isActiveItem(item);
    const initial = item.label.charAt(0).toUpperCase();
    return (
      <Link
        key={item.path}
        to={item.path}
        title={item.label}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => setMobileNavOpen(false)}
        className={
          iconMode
            ? 'flex justify-center px-0 py-2.5'
            : 'group relative flex items-center gap-1 rounded-xl pl-3 pr-2.5 py-2 text-[12.5px] transition-all duration-150'
        }
      >
        {iconMode ? (
          <span
            aria-hidden="true"
            className={`inline-flex w-9 h-9 rounded-xl font-extrabold text-[13px] items-center justify-center transition-all duration-150 ${
              isActive
                ? 'bg-[#087BFF] text-white shadow-[0_10px_24px_-8px_rgba(8,123,255,0.65)]'
                : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#087BFF]'
            }`}
          >
            {initial}
          </span>
        ) : (
          <>
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-all duration-150 ${
                isActive ? 'bg-[#087BFF] shadow-[0_0_12px_rgba(8,123,255,0.8)]' : 'bg-transparent group-hover:bg-slate-200'
              }`}
            />
            <span
              className={`flex-1 rounded-lg px-2.5 py-2 transition-all duration-150 ${
                isActive
                  ? 'bg-[#EAF3FF] text-[#0B5FD9] font-extrabold shadow-[0_10px_24px_-12px_rgba(8,123,255,0.55)]'
                  : 'text-slate-600 font-semibold group-hover:bg-slate-100 group-hover:text-slate-900'
              }`}
            >
              {item.label}
            </span>
          </>
        )}
      </Link>
    );
  };

  const renderGroups = (iconMode: boolean) => (
    <div className={iconMode ? 'space-y-1' : 'space-y-3'}>
      {groups.map((g) => {
        if (g.name === null) {
          return (
            <div key="__root" className={iconMode ? 'space-y-1' : 'space-y-0.5'}>
              {g.items.map((item) => renderLink(item, iconMode))}
            </div>
          );
        }
        const open = !closedGroups.includes(g.name) || g.name === activeGroup;
        const hasActive = g.items.some((i) => isActiveItem(i));
        if (iconMode) {
          return (
            <div key={g.name} className="space-y-1 pt-1">
              <div className="mx-auto h-px w-8 bg-slate-200" aria-hidden="true" />
              {g.items.map((item) => renderLink(item, true))}
            </div>
          );
        }
        return (
          <section key={g.name} aria-label={g.name}>
            <button
              type="button"
              onClick={() => toggleGroup(g.name as string)}
              aria-expanded={open}
              className="flex w-full items-center justify-between px-3 pb-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-slate-400 hover:text-[#087BFF] transition-colors"
            >
              <span className="flex items-center gap-1.5">
                {hasActive && <span className="h-1.5 w-1.5 rounded-full bg-[#087BFF]" aria-hidden="true" />}
                {g.name}
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
                aria-hidden="true"
              />
            </button>
            <div
              className={`grid transition-all duration-200 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="space-y-0.5 pb-0.5">{g.items.map((item) => renderLink(item, false))}</div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );

  return (
      <div className="min-h-screen flex bg-[#F4F7FB] text-slate-900 font-sans">

        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar — fixed full height on desktop with its own scroll; drawer on mobile */}
        <aside className={`fixed inset-y-0 left-0 z-40 bg-white/95 backdrop-blur border-r border-slate-200/90 flex flex-col shadow-[4px_0_24px_-12px_rgba(7,27,58,0.15)] shrink-0 transform transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${collapsed ? 'lg:w-[76px] w-[280px]' : 'w-[280px]'} ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Brand — pinned */}
          <div className={`px-5 pt-5 pb-4 border-b border-slate-100 shrink-0 ${collapsed ? 'lg:px-0 lg:flex lg:justify-center' : ''}`}>
            <Link to="/" className="inline-block" aria-label="NexaTalent home">
              {collapsed ? (
                <span className="hidden lg:inline-flex w-11 h-11 rounded-2xl bg-gradient-to-br from-[#071B3A] to-[#0B2548] text-white font-extrabold text-lg items-center justify-center shadow-[0_10px_24px_-10px_rgba(7,27,58,0.7)]" aria-hidden="true">N</span>
              ) : (
                <Logo height={34} />
              )}
            </Link>
            <div className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0B5FD9] border border-blue-100 ${collapsed ? 'lg:hidden' : ''}`}>
              <Building2 size={12} className="text-[#087BFF]" />
              <span className="truncate max-w-[190px]">{portalTitle}</span>
            </div>
          </div>

          {/* Navigation — the only scrolling region in the sidebar */}
          <nav className={`sidebar-scroll flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 ${collapsed ? 'lg:px-2' : ''}`} aria-label="Workspace sections">
            {renderGroups(collapsed)}
          </nav>

          {/* User card — pinned */}
          <div className={`p-3.5 border-t border-slate-100 bg-slate-50/60 shrink-0 ${collapsed ? 'lg:px-2' : ''}`}>
            <div className={`flex items-center gap-2.5 mb-2.5 px-1 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#087BFF] to-[#35A7FF] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_8px_16px_-8px_rgba(8,123,255,0.7)]" title={userEmail}>
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
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/60 font-bold text-xs transition-all cursor-pointer ${collapsed ? 'lg:px-0' : ''}`}
            >
              <LogOut size={14} />
              <span className={collapsed ? 'lg:hidden' : ''}>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace — the page scrolls here */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">

          {/* Top Navigation Header */}
          <header className="sticky top-0 z-20 min-h-16 bg-white/90 backdrop-blur border-b border-slate-200/90 px-4 sm:px-8 py-2 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Toggle navigation"
                aria-expanded={mobileNavOpen}
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
                <User size={14} className="text-[#087BFF]" />
                <span className="capitalize">{portalRole} Workspace</span>
              </div>

              <Link to="/" className="font-bold text-slate-500 hover:text-[#087BFF] transition-colors">
                ← Public Website
              </Link>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 p-6 sm:p-8 w-full">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Candidate Inspection Drawer Component */}
        <CandidateInspectionDrawer />
      </div>
  );
}
