import { ReactNode, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../../website/components/Logo';
import {
  User, LogOut, ShieldCheck, Building2, Menu, X, ChevronsLeft, ChevronsRight, ChevronDown,
  Bell, Search, LayoutDashboard, Briefcase, Kanban, Users, UserCheck, CalendarClock,
  FileText, FileCheck2, UploadCloud, BarChart3, CreditCard, Clock, TrendingUp,
  MessageSquare, Send, Shield, Lock, HelpCircle, Settings, ScrollText, Sparkles,
  CircleDot, Award, ArrowRight
} from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { clearSession, getTenantId, getUserEmail, getActiveRole, getRefreshToken } from '../../shared/auth/session';
import { useAuth } from '../../shared/auth/AuthContext';
import { directoryApi } from '../../shared/enterprise/phaseApi';
import { Select } from '../../shared/ui/EnterpriseKit';

export interface PortalNavItem {
  label: string;
  path: string;
  /** Section group — items sharing a group render under one collapsible header. */
  group?: string;
  icon?: any;
}

interface PortalShellProps {
  portalTitle: string;
  portalRole: string;
  navItems: PortalNavItem[];
  children: ReactNode;
}

const GROUPS_KEY = 'nexa:sidebar-open-group';
const NONE = '__none';

const KNOWN_TENANT_NAMES: Record<string, string> = {
  'TNT-9011': 'Fintech ScaleOps Technologies',
  'TNT-9012': 'HealthCloud Systems Ltd',
  'TNT-GLOBAL': 'NexaTalent Platform Operations',
  'TNT-AGENCY-01': 'Apex Tech Search Partners',
  'TNT-VENDOR-05': 'Quantum Staffing Solutions',
};

function getNavIcon(label: string, path: string) {
  const l = label.toLowerCase();
  const p = path.toLowerCase();
  if (l.includes('dashboard') || l.includes('overview') || p === '/superadmin' || p === '/employer' || p === '/recruiter' || p === '/candidate') return LayoutDashboard;
  if (l.includes('kanban') || l.includes('pipeline')) return Kanban;
  if (l.includes('applicant') || l.includes('candidate crm')) return UserCheck;
  if (l.includes('candidates') || l.includes('directory') || l.includes('users') || l.includes('team')) return Users;
  if (l.includes('talent pool') || l.includes('talent') || l.includes('curated')) return Award;
  if (l.includes('mandate') || l.includes('job') || l.includes('positions') || l.includes('posting')) return Briefcase;
  if (l.includes('requisition') || l.includes('requirement')) return FileText;
  if (l.includes('interview') || l.includes('scorecard') || l.includes('schedule')) return CalendarClock;
  if (l.includes('placement') || l.includes('offer')) return FileCheck2;
  if (l.includes('import') || l.includes('resume')) return UploadCloud;
  if (l.includes('analytic') || l.includes('report') || l.includes('performance')) return BarChart3;
  if (l.includes('invoice') || l.includes('billing') || l.includes('commercial') || l.includes('payment') || l.includes('commission')) return CreditCard;
  if (l.includes('timesheet')) return Clock;
  if (l.includes('lead') || l.includes('sales')) return TrendingUp;
  if (l.includes('message') || l.includes('chat')) return MessageSquare;
  if (l.includes('outreach')) return Send;
  if (l.includes('tenant') || l.includes('organization') || l.includes('agency') || l.includes('branch') || l.includes('company')) return Building2;
  if (l.includes('notification')) return Bell;
  if (l.includes('audit') || l.includes('security') || l.includes('privacy')) return Shield;
  if (l.includes('control') || l.includes('lockout')) return Lock;
  if (l.includes('support')) return HelpCircle;
  if (l.includes('setting') || l.includes('profile')) return Settings;
  if (l.includes('cv') || l.includes('document') || l.includes('doc')) return ScrollText;
  if (l.includes('onboarding')) return Sparkles;
  return CircleDot;
}

function loadOpenGroup(): string | null {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    return typeof raw === 'string' && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

export function PortalShell({ portalTitle, portalRole, navItems, children }: PortalShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Esc closes mobile drawer for keyboard users.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileNavOpen]);

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('nexa:sidebar-collapsed') === '1'; } catch { return false; }
  });
  const [manualGroup, setManualGroup] = useState<string | null>(loadOpenGroup);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      try { localStorage.setItem('nexa:sidebar-collapsed', v ? '0' : '1'); } catch { /* noop */ }
      return !v;
    });
  };

  const toggleGroup = (group: string, isOpen: boolean) => {
    const next = isOpen ? NONE : group;
    setManualGroup(next);
    try { localStorage.setItem(GROUPS_KEY, next); } catch { /* noop */ }
  };

  const { user: authUser } = useAuth();
  const effectiveRole = authUser?.role || getActiveRole() || '';
  const activeTenantId = authUser?.tenantId || getTenantId() || 'TNT-9011';
  const userEmail = getUserEmail() || `${portalRole || 'user'}@nexatalent.com`;
  const safeNavItems = Array.isArray(navItems) ? navItems : [];
  const fallbackPath = safeNavItems[0]?.path || '/login';
  const roleInitial = (portalRole || 'U').charAt(0).toUpperCase();

  const isPlatformRole = ['superadmin', 'platform_owner', 'operations_admin', 'employee'].includes(effectiveRole);
  const [tenantOptions, setTenantOptions] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res: any = await directoryApi.tenants();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        setTenantOptions(list.map((t: any) => ({ id: t.id, label: `${t.displayName || t.legalName || t.id}` })));
      } catch { setTenantOptions([]); }
    })();
  }, []);

  const tenantDisplayName = useMemo(() => {
    const match = tenantOptions.find((t) => t.id === activeTenantId);
    if (match) return match.label;
    return KNOWN_TENANT_NAMES[activeTenantId] || (activeTenantId.startsWith('TNT-') ? activeTenantId : `Org ${activeTenantId}`);
  }, [tenantOptions, activeTenantId]);

  const switchTenant = (tid: string) => {
    if (!tid || tid === activeTenantId) return;
    try { localStorage.setItem('nexatalent_tenant_id', tid); } catch { /* noop */ }
    window.location.reload();
  };

  /* ---- Header Notifications ---- */
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const res: any = await apiClient.get('/api/v1/notifications');
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      setNotifications(list);
      const unread = list.filter((n: any) => n.status !== 'read').length;
      setUnreadCount(unread);
    } catch {
      // non-blocking
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, location.pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await apiClient.post('/api/v1/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
    } catch {
      // non-blocking
    }
  };

  /* ---- Command Palette (⌘K) ---- */
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
      if (e.key === 'Escape' && commandOpen) {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [commandOpen]);

  useEffect(() => {
    if (commandOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 50);
    } else {
      setCommandQuery('');
    }
  }, [commandOpen]);

  const filteredCommands = useMemo(() => {
    if (!commandQuery.trim()) return safeNavItems.slice(0, 8);
    const q = commandQuery.toLowerCase();
    return safeNavItems.filter((i) => i.label.toLowerCase().includes(q) || (i.group && i.group.toLowerCase().includes(q)));
  }, [safeNavItems, commandQuery]);

  const isActiveItem = (item: PortalNavItem) =>
    location.pathname === item.path || (item.path !== fallbackPath && location.pathname.startsWith(item.path));

  const groups = useMemo(() => {
    const map = new Map<string | null, PortalNavItem[]>();
    for (const item of safeNavItems) {
      const groupKey = item.group ?? null;
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }
      map.get(groupKey)!.push(item);
    }
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  }, [safeNavItems]);

  const activeGroup = useMemo(() => {
    for (const g of groups) {
      if (g.items.some((i) => isActiveItem(i))) return g.name;
    }
    return groups[0]?.name ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, location.pathname]);

  const mountedPath = useRef<string | null>(null);
  useEffect(() => {
    if (mountedPath.current === null) {
      mountedPath.current = location.pathname;
      return;
    }
    if (location.pathname !== mountedPath.current) {
      mountedPath.current = location.pathname;
      setManualGroup(null);
    }
  }, [location.pathname]);

  const openGroup = manualGroup === NONE ? null : manualGroup ?? activeGroup;

  const handleSignOut = async () => {
    try {
      await apiClient.post('/api/v1/auth/logout', {
        email: userEmail,
        tenantId: activeTenantId,
        reason: 'USER_SIGN_OUT',
        refreshToken: getRefreshToken(),
      });
    } catch (err) {
      console.warn('Logout API call notice:', (err as any)?.response?.status ?? 'network');
    } finally {
      clearSession();
      const targetLogin = portalRole && ['recruiter', 'employer', 'superadmin', 'employee', 'vendor', 'candidate'].includes(portalRole)
        ? `/${portalRole}/login?reason=sign_out`
        : '/login?reason=sign_out';
      navigate(targetLogin, { replace: true });
    }
  };

  const renderLink = (item: PortalNavItem, iconMode: boolean) => {
    const isActive = isActiveItem(item);
    const IconComponent = item.icon || getNavIcon(item.label, item.path);

    if (iconMode) {
      return (
        <div key={item.path} className="group relative flex justify-center py-1">
          <Link
            to={item.path}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => setMobileNavOpen(false)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
              isActive
                ? 'bg-[#0B5FD9] text-white shadow-[0_8px_18px_-6px_rgba(8,123,255,0.7)]'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <IconComponent size={18} />
          </Link>
          {/* Tooltip on hover */}
          <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 hidden group-hover:flex items-center z-50">
            <div className="whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl">
              {item.label}
              {item.group && <span className="ml-1.5 opacity-60 text-[10px]">({item.group})</span>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        title={item.label}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => setMobileNavOpen(false)}
        className={`group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-150 ${
          isActive
            ? 'bg-[#EAF3FF] text-[#0B5FD9] font-bold shadow-[0_8px_20px_-10px_rgba(8,123,255,0.4)]'
            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
        }`}
      >
        <IconComponent
          size={16}
          className={`shrink-0 transition-colors ${
            isActive ? 'text-[#0B5FD9]' : 'text-slate-400 group-hover:text-slate-700'
          }`}
        />
        <span className="truncate text-xs">{item.label}</span>
      </Link>
    );
  };

  const renderGroups = (iconMode: boolean) => (
    <div className={iconMode ? 'space-y-1' : 'space-y-1.5'}>
      {groups.map((g) => {
        if (g.name === null) {
          return (
            <div key="__root" className={iconMode ? 'space-y-1' : 'space-y-px'}>
              {g.items.map((item) => renderLink(item, iconMode))}
            </div>
          );
        }
        const open = openGroup === g.name;
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
              onClick={() => toggleGroup(g.name as string, open)}
              aria-expanded={open}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                open ? 'text-[#0B5FD9]' : 'text-slate-400 hover:text-[#0B5FD9] hover:bg-slate-100/70'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {hasActive && <span className="h-1.5 w-1.5 rounded-full bg-[#0B5FD9]" aria-hidden="true" />}
                {g.name}
              </span>
              <ChevronDown
                size={12}
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
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden cursor-default"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar — fixed full height on desktop with its own scroll; drawer on mobile */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-white/95 backdrop-blur-md border-r border-slate-200/90 flex flex-col shadow-[4px_0_24px_-12px_rgba(7,27,58,0.15)] shrink-0 transform transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${collapsed ? 'lg:w-[76px] w-[280px]' : 'w-[280px]'} ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand — pinned */}
        <div className={`px-4 pt-4 pb-3 border-b border-slate-100 shrink-0 ${collapsed ? 'lg:px-0 lg:flex lg:justify-center' : ''}`}>
          <Link to="/" className="inline-block" aria-label="NexaTalent home">
            {collapsed ? (
              <span className="hidden lg:inline-flex w-11 h-11 rounded-2xl bg-gradient-to-br from-[#071B3A] to-[#0B2548] text-white font-extrabold text-lg items-center justify-center shadow-[0_10px_24px_-10px_rgba(7,27,58,0.7)]" aria-hidden="true">N</span>
            ) : (
              <Logo height={34} />
            )}
          </Link>
          <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0B5FD9] border border-blue-100 ${collapsed ? 'lg:hidden' : ''}`}>
            <Building2 size={12} className="text-[#0B5FD9]" />
            <span className="truncate max-w-[190px]">{portalTitle}</span>
          </div>
        </div>

        {/* Navigation — scrolling region */}
        <nav data-lenis-prevent className={`sidebar-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 py-3 ${collapsed ? 'lg:px-1.5' : ''}`} aria-label="Workspace sections">
          {renderGroups(collapsed)}
        </nav>

        {/* User card — pinned */}
        <div className={`p-2.5 border-t border-slate-100 bg-slate-50/60 shrink-0 ${collapsed ? 'lg:px-1.5' : ''}`}>
          <div className={`flex items-center gap-2 mb-2 px-1 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B5FD9] to-[#35A7FF] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_8px_16px_-8px_rgba(8,123,255,0.7)]" title={userEmail}>
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
            className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50/60 font-bold text-xs transition-all cursor-pointer ${collapsed ? 'lg:px-0' : ''}`}
          >
            <LogOut size={14} />
            <span className={collapsed ? 'lg:hidden' : ''}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navigation Header */}
        <header className="sticky top-0 z-20 min-h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-2 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <button
              type="button"
              className="hidden lg:inline-flex p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
            >
              {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </button>
            <span className="hidden sm:inline text-xs font-bold text-slate-400">Workspace</span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <h2 className="text-sm font-extrabold text-slate-900 truncate">{portalTitle}</h2>

            {/* Human-readable Organization / Tenant Badge */}
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
              <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              <span className="truncate max-w-[180px]" title={tenantDisplayName}>
                {tenantDisplayName}
              </span>
              <span className="text-[10px] text-emerald-600/80 font-mono font-semibold">({activeTenantId})</span>
            </div>

            {isPlatformRole && tenantOptions.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 ml-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Act as</span>
                <Select
                  value={activeTenantId}
                  onChange={switchTenant}
                  ariaLabel="Act as — switch active company tenant"
                  options={tenantOptions.map((t) => ({ value: t.id, label: `${t.label} (${t.id})` }))}
                  searchable
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
            {/* Quick Command Palette Button */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-500 transition-all cursor-pointer shadow-2xs"
              title="Quick search (Ctrl+K or ⌘K)"
            >
              <Search size={14} className="text-slate-400" />
              <span className="font-medium text-[11px]">Jump to...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500">⌘K</kbd>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen((v) => !v)}
                aria-label="View notifications"
                className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors hover:bg-slate-50 flex items-start gap-2.5 ${
                            n.status !== 'read' ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-blue-600"
                            style={{ opacity: n.status !== 'read' ? 1 : 0 }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 font-medium leading-relaxed line-clamp-2">{n.body}</p>
                            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="capitalize font-semibold text-slate-500">{n.kind || 'Notice'}</span>
                              <span>•</span>
                              <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      to={`/${portalRole || 'employer'}/notifications`}
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Portal Role Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-700 shadow-2xs">
              <User size={14} className="text-[#0B5FD9]" />
              <span className="capitalize truncate max-w-[120px]">{portalRole} Workspace</span>
            </div>

            <Link to="/" className="hidden sm:inline font-bold text-slate-500 hover:text-[#0B5FD9] transition-colors">
              ← Website
            </Link>
          </div>
        </header>

        {/* Command Palette Spotlight Modal */}
        {commandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
            <div
              className="fixed inset-0"
              onClick={() => setCommandOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  ref={commandInputRef}
                  type="text"
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="Jump to a workspace page or tool..."
                  className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
                <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
                  ESC
                </kbd>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No matching workspace views found
                  </div>
                ) : (
                  filteredCommands.map((item) => {
                    const Icon = item.icon || getNavIcon(item.label, item.path);
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => {
                          setCommandOpen(false);
                          navigate(item.path);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 hover:text-[#0B5FD9] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-[#0B5FD9] flex items-center justify-center shrink-0 transition-colors">
                            <Icon size={16} />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B5FD9] truncate">
                              {item.label}
                            </div>
                            {item.group && (
                              <div className="text-[10px] text-slate-400">
                                {item.group}
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-[#0B5FD9] shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 p-3 sm:p-5 w-full">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
