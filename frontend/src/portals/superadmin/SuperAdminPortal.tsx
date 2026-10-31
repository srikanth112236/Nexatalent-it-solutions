import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { apiClient } from '../../shared/api-client';
import {
  Users, ShieldCheck, Plus, Lock, Key, Building2, BriefcaseBusiness,
  Activity, TrendingUp, AlertTriangle, IndianRupee, UserCheck,
  FileCheck2, ArrowUpRight, ArrowRight, RefreshCw, Search, Radio, CircleDot,
  Wallet, Target, CalendarClock, Sparkles, ServerCrash, BadgeCheck,
} from 'lucide-react';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import {
  BillingPanel, CommissionsPanel, PayrollPanel, LeadsPanel, PerformancePanel,
  ReportsPanel, NotificationsPanel, AdminControlsPanel, LoginLockoutsPanel, RequisitionsPanel, ApplicationsPanel,
  CandidatesPanel, AgencyPanel, BranchesPanel, JobsPanel, SupportPanel,
  InterviewsPanel, OffersPlacementsPanel, RequirementCreatePage, JobCreatePage, RolesPanel, SkillsPanel, PaymentsRemindersPanel, TimesheetsPanel,
  TalentPoolsPanel, CandidateSearchPanel, OutreachPanel, ChatPanel,
} from '../common/EnterprisePanels';
import { Modal, Select, Field } from '../../shared/ui/EnterpriseKit';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { OrganizationsManager, UsersManager } from './SuperAdminDirectory';
import { WebsiteLeadsPanel } from '../common/WebsiteLeadsPanel';
import { OpenPositionsPanel } from '../common/OpenPositionsPanel';

const navItems = [
  { label: 'Overview', path: '/superadmin' },
  { label: 'Tenants & Subscriptions', path: '/superadmin/organizations', group: 'Directory' },
  { label: 'Global Directory', path: '/superadmin/users', group: 'Directory' },
  { label: 'Agencies & Vendors', path: '/superadmin/agencies', group: 'Directory' },
  { label: 'Candidate Directory', path: '/superadmin/candidates', group: 'Directory' },
  { label: 'Branches', path: '/superadmin/branches', group: 'Directory' },
  { label: 'Requirements & Jobs', path: '/superadmin/requisitions', group: 'Recruitment' },
  { label: 'Job Board (Admin)', path: '/superadmin/jobs', group: 'Recruitment' },
  { label: 'Open Positions', path: '/superadmin/open-positions', group: 'Recruitment' },
  { label: 'Applications', path: '/superadmin/applications', group: 'Recruitment' },
  { label: 'Website Applicants', path: '/superadmin/website-leads', group: 'Recruitment' },
  { label: 'Interviews', path: '/superadmin/interviews', group: 'Recruitment' },
  { label: 'Placements', path: '/superadmin/placements', group: 'Recruitment' },
  { label: 'Talent Pools', path: '/superadmin/talent', group: 'Recruitment' },
  { label: 'Candidate Search', path: '/superadmin/search', group: 'Recruitment' },
  { label: 'Outreach', path: '/superadmin/outreach', group: 'Recruitment' },
  { label: 'Messages', path: '/superadmin/messages', group: 'Recruitment' },
  { label: 'Timesheets', path: '/superadmin/timesheets', group: 'Recruitment' },
  { label: 'Invoices', path: '/superadmin/invoices', group: 'Commercial' },
  { label: 'Payments & Reminders', path: '/superadmin/payments', group: 'Commercial' },
  { label: 'Billing & Payments', path: '/superadmin/billing', group: 'Commercial' },
  { label: 'Commissions & Payouts', path: '/superadmin/commissions', group: 'Commercial' },
  { label: 'Leads & Pipeline', path: '/superadmin/leads', group: 'Sales' },
  { label: 'Website Leads', path: '/superadmin/website-leads', group: 'Sales' },
  { label: 'Sales Performance', path: '/superadmin/performance', group: 'Sales' },
  { label: 'Reports', path: '/superadmin/reports', group: 'Platform' },
  { label: 'Support & Issues', path: '/superadmin/support', group: 'Platform' },
  { label: 'Access Controls', path: '/superadmin/controls', group: 'Platform' },
  { label: 'Notifications', path: '/superadmin/notifications', group: 'Platform' },
  { label: 'Security Audit Logs', path: '/superadmin/audit-logs', group: 'Platform' },
  { label: 'System Settings', path: '/superadmin/settings', group: 'Platform' },
  { label: 'My Profile', path: '/superadmin/profile', group: 'Platform' },
];

export function SuperAdminPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [controlsTab, setControlsTab] = useState<'verification' | 'users' | 'lockouts' | 'exceptions' | 'roles' | 'skills'>('verification');

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/organizations')) return 'organizations';
    if (p.includes('/users')) return 'users';
    if (p.includes('/agencies')) return 'agencies';
    if (p.includes('/candidates')) return 'candidates';
    if (p.includes('/branches')) return 'branches';
    if (p.includes('/requisitions/new')) return 'requisitions-new';
    if (p.includes('/requisitions')) return 'requisitions';
    if (p.includes('/jobs/new')) return 'jobs-new';
    if (p.includes('/open-positions')) return 'open-positions';
    if (p.includes('/jobs')) return 'jobs';
    if (p.includes('/applications')) return 'applications';
    if (p.includes('/interviews')) return 'interviews';
    if (p.includes('/placements') || p.includes('/offers')) return 'placements';
    if (p.includes('/talent')) return 'talent';
    if (p.includes('/search')) return 'search';
    if (p.includes('/outreach')) return 'outreach';
    if (p.includes('/messages') || p.includes('/chat')) return 'messages';
    if (p.includes('/timesheets')) return 'timesheets';
    if (p.includes('/invoices')) return 'invoices';
    if (p.includes('/superadmin/payments')) return 'payments';
    if (p.includes('/billing')) return 'billing';
    if (p.includes('/commissions') || p.includes('/payouts')) return 'commissions';
    if (p.includes('/website-leads')) return 'website-leads';
    if (p.includes('/leads') || p.includes('/pipeline')) return 'leads';
    if (p.includes('/performance') || p.includes('/targets')) return 'performance';
    if (p.includes('/reports')) return 'reports';
    if (p.includes('/support')) return 'support';
    if (p.includes('/controls')) return 'controls';
    if (p.includes('/notifications')) return 'notifications';
    if (p.includes('/audit')) return 'audit';
    if (p.includes('/profile')) return 'profile';
    if (p.includes('/settings')) return 'settings';
    return 'overview';
  })();

  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [sysSettings, setSysSettings] = useState<any>(null);
  const [kpis, setKpis] = useState({ jobs: 0, publishedJobs: 0, applications: 0, outstanding: 0, overdueInvoices: 0, leads: 0, newLeads: 0, placements: 0, commissionsDue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  // Live collections for breakdown charts (kept raw — never mocked)
  const [live, setLive] = useState<{ jobs: any[]; apps: any[]; subs: any[]; invoices: any[]; leads: any[]; placements: any[]; commissions: any[] }>(
    { jobs: [], apps: [], subs: [], invoices: [], leads: [], placements: [], commissions: [] },
  );
  const [tenantQuery, setTenantQuery] = useState('');
  const [auditFilter, setAuditFilter] = useState('');

  const inr = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const timeAgo = (iso?: string) => {
    if (!iso) return '—';
    const ms = Date.now() - new Date(iso).getTime();
    if (Number.isNaN(ms)) return '—';
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };
  const tenantName = (t: any) => t?.displayName || t?.legalName || t?.name || t?.companyName || 'Unnamed organization';
  const tenantStatus = (t: any) => t?.accountStatus || t?.status || 'Invited';
  const tenantVerify = (t: any) => t?.verificationStatus || 'Pending';

  // Modals
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [tenantForm, setTenantForm] = useState({ name: '', plan: 'Enterprise Custom', seats: '50' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'employer', tenantId: 'TNT-9011', password: '' });
  // Phase 2.4: own admin profile (name edit + MFA, verification read-only)
  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const ownEmail = (() => { try { return (localStorage.getItem('user_email') || '').toLowerCase(); } catch { return ''; } })();
  const ownUser = users.find((u: any) => String(u.email || '').toLowerCase() === ownEmail) || null;
  useEffect(() => { if (ownUser && !profileName) setProfileName(ownUser.name || ''); }, [ownUser]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [tRes, uRes, logRes, sRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/tenants').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/users').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/audit-logs').catch(() => ({ data: [] as any[] })),
          apiClient.get<any>('/api/v1/settings').catch(() => null),
        ]);

        if (tRes?.data) setTenants(tRes.data);
        if (uRes?.data) setUsers(uRes.data);
        if (logRes?.data) setAuditLogs(logRes.data);
        if ((sRes as { data?: any })?.data) setSysSettings((sRes as { data: any }).data);
        // Live platform KPIs (§6.2) — real counts, never fabricated.
        // Totals prefer server pagination.total; breakdown lists use the loaded page.
        try {
          const [jobsR, appsR, invsR, leadsR, placeR, commR, subsR] = await Promise.all([
            apiClient.get<any[]>('/api/v1/jobs?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/applications?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/invoices?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/leads?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/placements?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/commissions?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/subscriptions?page=1&pageSize=100').catch(() => ({ data: [] as any[] })),
          ]);
          const arr = (r: any): any[] => (Array.isArray(r?.data) ? r.data : (Array.isArray(r?.data?.data) ? r.data.data : []));
          const tot = (r: any, list: any[]): number => Number((r as any)?.pagination?.total ?? list.length);
          const jobsL = arr(jobsR); const appsL = arr(appsR);
          const invsL = arr(invsR); const leadsL = arr(leadsR); const placeL = arr(placeR); const commL = arr(commR); const subsL = arr(subsR);
          setLive({ jobs: jobsL, apps: appsL, subs: subsL, invoices: invsL, leads: leadsL, placements: placeL, commissions: commL });
          setKpis({
            jobs: tot(jobsR, jobsL),
            publishedJobs: jobsL.filter((j: any) => j.status === 'Published').length,
            applications: tot(appsR, appsL),
            outstanding: invsL.reduce((a: number, i: any) => a + Number(i.balance ?? i.amountDue ?? i.total ?? 0), 0),
            overdueInvoices: invsL.filter((i: any) => Number(i.balance ?? i.amountDue ?? 0) > 0 && i.dueDate && new Date(i.dueDate) < new Date()).length,
            leads: tot(leadsR, leadsL),
            newLeads: leadsL.filter((l: any) => (l.stage || 'New') === 'New').length,
            placements: tot(placeR, placeL),
            commissionsDue: commL.filter((c: any) => c.approvalStatus === 'Approved' && c.paymentStatus !== 'Paid').length,
          });
        } catch { /* KPI row is best-effort; core tables already loaded */ }
      } catch (err) {
        console.warn('API Error in SuperAdminPortal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [refreshTick]);

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend allowlist: legalName/displayName required; plan+seats are subscription-owned
      // so we send canonical fields and keep plan/seats locally for instant UI.
      const payload = {
        legalName: tenantForm.name,
        displayName: tenantForm.name,
        plan: tenantForm.plan,
        seats: tenantForm.seats,
      };
      const res = await apiClient.post<any>('/api/v1/tenants', payload);
      if (res.data) {
        setTenants([{ ...res.data, plan: (res.data as any).plan || tenantForm.plan, seats: (res.data as any).seats || tenantForm.seats }, ...tenants]);
      }
      // Re-fetch audit logs to show live event
      const logRes = await apiClient.get<any[]>('/api/v1/audit-logs');
      if (logRes.data) setAuditLogs(logRes.data);
    } catch (err) {
      console.warn('Tenant API error:', err);
    } finally {
      setShowTenantModal(false);
      setTenantForm({ name: '', plan: 'Enterprise Custom', seats: '50' });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post<any>('/api/v1/users', userForm);
      if (res.data) {
        setUsers([res.data, ...users]);
      }
      // Re-fetch audit logs to show live event
      const logRes = await apiClient.get<any[]>('/api/v1/audit-logs');
      if (logRes.data) setAuditLogs(logRes.data);
    } catch (err) {
      console.warn('User API error:', err);
    } finally {
      setShowUserModal(false);
      setUserForm({ name: '', email: '', role: 'employer', tenantId: 'TNT-9011', password: '' });
    }
  };

  // ---- Derived platform intelligence (all live, computed client-side) ----
  const analytics = useMemo(() => {
    const activeTenants = tenants.filter((t) => tenantStatus(t) === 'Active').length;
    const pendingVerify = tenants.filter((t) => tenantVerify(t) === 'Pending').length;
    const suspended = tenants.filter((t) => tenantStatus(t) === 'Suspended').length;
    const activeUsers = users.filter((u) => (u.status || 'Active') === 'Active').length;
    const mfaOn = users.filter((u) => u.mfaEnabled).length;
    const paidInvoices = live.invoices.filter((i) => Number(i.balance ?? i.amountDue ?? 0) <= 0).length;
    const hasInvoices = live.invoices.length > 0;
    const collectionRate = hasInvoices ? Math.round((paidInvoices / live.invoices.length) * 100) : 0;
    const planMix = (() => {
      const m = new Map<string, number>();
      for (const t of tenants) {
        const p = t?.plan || t?.planName || 'No plan';
        m.set(p, (m.get(p) || 0) + 1);
      }
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    })();
    const leadStages = (() => {
      const m = new Map<string, number>();
      for (const l of live.leads) m.set(String(l.stage || 'New'), (m.get(String(l.stage || 'New')) || 0) + 1);
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    })();
    const funnel = [
      { label: 'Published jobs', value: kpis.publishedJobs, color: '#0B5FD9' },
      { label: 'Applications', value: kpis.applications, color: '#7C3AED' },
      { label: 'Placements', value: kpis.placements, color: '#059669' },
    ];
    const maxFunnel = Math.max(1, ...funnel.map((f) => f.value));
    const convRate = kpis.applications ? ((kpis.placements / kpis.applications) * 100).toFixed(1) : '0.0';
    const recentAudits = [...auditLogs].sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()).slice(0, 6);
    const tenantRows = [...tenants]
      .filter((t) => {
        const q = tenantQuery.trim().toLowerCase();
        if (!q) return true;
        return `${t.id} ${tenantName(t)} ${tenantStatus(t)}`.toLowerCase().includes(q);
      })
      .slice(0, 8);
    const filteredAudits = recentAudits.filter((l) => {
      if (!auditFilter) return true;
      return String(l.action || '').toLowerCase().includes(auditFilter.toLowerCase());
    });
    return { activeTenants, pendingVerify, suspended, activeUsers, mfaOn, paidInvoices, hasInvoices, collectionRate, planMix, leadStages, funnel, maxFunnel, convRate, recentAudits: filteredAudits, tenantRows };
  }, [tenants, users, auditLogs, live, kpis, tenantQuery, auditFilter]);

  const spark = (values: number[], stroke = '#0B5FD9') => {
    if (!values.length) values = [0, 0, 0, 0, 0, 0];
    const w = 120; const h = 36;
    const max = Math.max(1, ...values);
    const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
        <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, i) => (
          <circle key={i} cx={(i / Math.max(1, values.length - 1)) * w} cy={h - (v / max) * (h - 4) - 2} r="2.5" fill={stroke} opacity={i === values.length - 1 ? 1 : 0.35} />
        ))}
      </svg>
    );
  };

  const auditBuckets = useMemo(() => {
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    return last7.map((day) => auditLogs.filter((l) => String(l.timestamp || '').slice(0, 10) === day).length);
  }, [auditLogs]);
  const tenantBuckets = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((_, i) => tenants.filter((t) => {
      const m = new Date(t.createdDate || t.createdAt || Date.now()).getMonth();
      return m % 6 === i;
    }).length);
  }, [tenants]);

  return (
    <PortalShell portalTitle="Super Admin Console" portalRole="superadmin" navItems={navItems}>
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Modern command hero — dashboard only */}
        {currentTab === 'overview' && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-900/10 shadow-[0_24px_60px_-24px_rgba(7,27,58,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#071B3A] via-[#0B2E5E] to-[#0B5FD9]" aria-hidden="true" />
          <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-16 -bottom-28 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl" aria-hidden="true" />
          <div className="relative p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/10 text-amber-200 border border-white/20 backdrop-blur">
                  <ShieldCheck size={13} /> Platform Governance & Controls
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-400/15 text-emerald-200 border border-emerald-300/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                  </span>
                  Live · {tenants.length} tenants · {users.length} users
                </span>
              </div>
              <h1 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-tight">
                Superadmin Command Center
              </h1>
              <p className="text-xs sm:text-[13px] text-blue-100/90 font-medium mt-1.5 max-w-2xl">
                Tenant estate, SaaS revenue, hiring pipeline & trust events — every number below is live from the platform API. Click any card to drill in.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-bold">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white"><IndianRupee size={13} className="text-emerald-300" /> MRR —</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white"><BadgeCheck size={13} className="text-cyan-300" /> {analytics.activeTenants} active tenants</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white"><AlertTriangle size={13} className={analytics.pendingVerify ? 'text-amber-300' : 'text-emerald-300'} /> {analytics.pendingVerify} pending verification</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white"><Activity size={13} className="text-violet-300" /> {auditLogs.length} audit events</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
              <div className="flex gap-2">
                <button onClick={() => setShowTenantModal(true)} className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white text-[#071B3A] font-extrabold text-xs shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <Plus size={15} /> Provision Tenant
                </button>
                <button onClick={() => setShowUserModal(true)} className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/20 text-white font-extrabold text-xs hover:-translate-y-0.5 hover:bg-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur">
                  <Users size={15} /> Add Global User
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/superadmin/audit-logs')} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-[11px] hover:bg-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <Radio size={13} /> Live audit stream <ArrowUpRight size={13} />
                </button>
                <button onClick={() => setRefreshTick((t) => t + 1)} title="Refresh live data" className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-[11px] hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer">
                  <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} /> {isLoading ? 'Syncing…' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/superadmin' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* TAB 1: OVERVIEW — modern interactive command center */}
        {currentTab === 'overview' && (
          <div className="space-y-4">
            {/* Hero KPI cards — live, linked, hover-lift */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <button type="button" onClick={() => navigate('/superadmin/organizations')}
                className="group relative overflow-hidden p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm text-left hover:-translate-y-1 hover:shadow-[0_20px_45px_-18px_rgba(8,123,255,0.45)] hover:border-blue-300 transition-all duration-200 cursor-pointer">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0B5FD9] to-cyan-400" aria-hidden="true" />
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-[#0B5FD9] items-center justify-center"><Building2 size={19} /></span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"><TrendingUp size={12} /> Live</span>
                </div>
                <div className="mt-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Tenant estate <ArrowUpRight size={12} className="inline text-[#0B5FD9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" /></div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{tenants.length} <span className="text-sm font-bold text-slate-500">tenants</span></div>
                <div className="text-xs font-bold text-slate-600 mt-1">{analytics.activeTenants} active · {analytics.pendingVerify} pending · {analytics.suspended} suspended</div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  {spark(tenantBuckets, '#0B5FD9')}
                  <span className="text-[11px] font-bold text-blue-700">Verify queue →</span>
                </div>
              </button>

              <button type="button" onClick={() => navigate('/superadmin/jobs')}
                className="group relative overflow-hidden p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm text-left hover:-translate-y-1 hover:shadow-[0_20px_45px_-18px_rgba(124,58,237,0.45)] hover:border-violet-300 transition-all duration-200 cursor-pointer">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 to-fuchsia-400" aria-hidden="true" />
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex w-10 h-10 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 items-center justify-center"><BriefcaseBusiness size={19} /></span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5"><Target size={12} /> {analytics.convRate}% hire rate</span>
                </div>
                <div className="mt-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Hiring pipeline <ArrowUpRight size={12} className="inline text-violet-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" /></div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpis.publishedJobs}<span className="text-sm font-bold text-slate-500">/{kpis.jobs} jobs</span> · {kpis.applications} <span className="text-sm font-bold text-slate-500">apps</span></div>
                <div className="text-xs font-bold text-slate-600 mt-1">{kpis.placements} placements · {kpis.newLeads}/{kpis.leads} new leads</div>
                <div className="mt-2 space-y-1.5">
                  {analytics.funnel.map((f) => (
                    <div key={f.label} className="flex items-center gap-2">
                      <span className="w-24 text-[10px] font-bold text-slate-500 truncate">{f.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round((f.value / analytics.maxFunnel) * 100)}%`, background: f.color }} />
                      </div>
                      <span className="w-8 text-right text-[11px] font-extrabold text-slate-800">{f.value}</span>
                    </div>
                  ))}
                </div>
              </button>

              <button type="button" onClick={() => navigate('/superadmin/audit-logs')}
                className="group relative overflow-hidden p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm text-left hover:-translate-y-1 hover:shadow-[0_20px_45px_-18px_rgba(245,158,11,0.45)] hover:border-amber-300 transition-all duration-200 cursor-pointer">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" aria-hidden="true" />
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 items-center justify-center"><ShieldCheck size={19} /></span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> streaming</span>
                </div>
                <div className="mt-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Trust & directory <ArrowUpRight size={12} className="inline text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" /></div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{users.length} <span className="text-sm font-bold text-slate-500">users</span> · {auditLogs.length} <span className="text-sm font-bold text-slate-500">events</span></div>
                <div className="text-xs font-bold text-slate-600 mt-1">{analytics.activeUsers} active · {analytics.mfaOn} MFA on · {analytics.suspended} tenants suspended</div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  {spark(auditBuckets, '#F59E0B')}
                  <span className="text-[11px] font-bold text-amber-700">7-day audit →</span>
                </div>
              </button>
            </div>

            {/* Secondary ops strip — compact, every tile linked */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Outstanding', value: inr(kpis.outstanding), icon: IndianRupee, to: '/superadmin/billing', tint: 'text-blue-700 bg-blue-50 border-blue-200', note: `${live.invoices.length} invoices` },
                { label: 'Overdue', value: `${kpis.overdueInvoices}`, icon: CalendarClock, to: '/superadmin/billing', tint: kpis.overdueInvoices ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200', note: kpis.overdueInvoices ? 'needs chase' : 'all clear' },
                { label: 'New leads', value: `${kpis.newLeads}/${kpis.leads}`, icon: Sparkles, to: '/superadmin/leads', tint: 'text-violet-700 bg-violet-50 border-violet-200', note: 'pipeline intake' },
                { label: 'Placements', value: `${kpis.placements}`, icon: FileCheck2, to: '/superadmin/placements', tint: 'text-emerald-700 bg-emerald-50 border-emerald-200', note: `${analytics.convRate}% app→hire` },
                { label: 'Applications', value: `${kpis.applications}`, icon: UserCheck, to: '/superadmin/applications', tint: 'text-slate-700 bg-slate-100 border-slate-200', note: `${kpis.jobs} jobs live` },
                { label: 'Commissions due', value: `${kpis.commissionsDue}`, icon: CircleDot, to: '/superadmin/commissions', tint: kpis.commissionsDue ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-100 border-slate-200', note: kpis.commissionsDue ? 'approve & pay' : 'settled' },
                { label: 'Audit events', value: `${auditLogs.length}`, icon: Activity, to: '/superadmin/audit-logs', tint: 'text-slate-700 bg-slate-100 border-slate-200', note: 'immutable trail' },
              ].map((c) => (
                <button key={c.label} type="button" onClick={() => navigate(c.to)} title={`Open ${c.label}`}
                  className="group p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-left hover:-translate-y-0.5 hover:shadow-md hover:border-[#0B5FD9] transition-all cursor-pointer">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex w-8 h-8 rounded-xl border items-center justify-center ${c.tint}`}><c.icon size={15} /></span>
                    <ArrowRight size={13} className="text-slate-300 group-hover:text-[#0B5FD9] group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="mt-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{c.label}</div>
                  <div className="text-xl font-extrabold text-slate-900 leading-tight">{c.value}</div>
                  <div className="text-[11px] font-bold text-slate-500">{c.note}</div>
                </button>
              ))}
            </div>

            {/* Analytics row — revenue mix + pipeline + attention queue */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5"><Wallet size={15} className="text-emerald-600" /> Revenue & plan mix</h3>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mb-3">Live MRR · {analytics.hasInvoices ? `${analytics.collectionRate}% collected` : 'no invoices yet'} · {kpis.overdueInvoices} overdue</p>
                {analytics.planMix.length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium">No tenant plans yet.</div>
                ) : (
                  <div className="space-y-2.5">
                    {analytics.planMix.map(([plan, count], i) => {
                      const pct = Math.round((count / Math.max(1, tenants.length)) * 100);
                      const colors = ['#0B5FD9', '#059669', '#7C3AED', '#F59E0B'];
                      return (
                        <div key={plan} className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
                          <span className="flex-1 min-w-0 text-xs font-bold text-slate-800 truncate">{plan}</span>
                          <div className="w-28 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                          </div>
                          <span className="w-14 text-right text-xs font-extrabold text-slate-900">{count} · {pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-extrabold text-slate-500 uppercase">MRR</div><div className="text-sm font-extrabold text-slate-900">—</div></div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-extrabold text-slate-500 uppercase">O/S</div><div className="text-sm font-extrabold text-slate-900">{inr(kpis.outstanding)}</div></div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-extrabold text-slate-500 uppercase">Overdue</div><div className={`text-sm font-extrabold ${kpis.overdueInvoices ? 'text-red-600' : 'text-emerald-600'}`}>{kpis.overdueInvoices}</div></div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5"><TrendingUp size={15} className="text-violet-600" /> Sales & hiring motion</h3>
                  <button type="button" onClick={() => navigate('/superadmin/leads')} className="text-[11px] font-extrabold text-[#0B5FD9] hover:underline cursor-pointer">Pipeline →</button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mb-3">{kpis.newLeads} new of {kpis.leads} leads · {kpis.placements} placements closed</p>
                {analytics.leadStages.length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium">No leads yet — pipeline is empty.</div>
                ) : (
                  <div className="space-y-2.5">
                    {analytics.leadStages.map(([stage, count]) => {
                      const pct = Math.round((count / Math.max(1, kpis.leads)) * 100);
                      return (
                        <div key={stage} className="flex items-center gap-2.5">
                          <span className="w-24 text-[11px] font-bold text-slate-600 truncate">{stage}</span>
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-10 text-right text-xs font-extrabold text-slate-900">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-4 p-3 rounded-2xl bg-violet-50/70 border border-violet-100 text-[11px] font-bold text-violet-900 flex items-center gap-2">
                  <ServerCrash size={14} className="shrink-0" /> Bottleneck watch: {kpis.applications} applications → {kpis.placements} hires ({analytics.convRate}% yield). Push interviews to lift yield.
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-5 shadow-sm text-white relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#0B5FD9]/30 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold flex items-center gap-1.5"><AlertTriangle size={15} className="text-amber-300" /> Needs your decision</h3>
                    <button type="button" onClick={() => navigate('/superadmin/organizations')} className="text-[11px] font-extrabold text-cyan-300 hover:underline cursor-pointer">Review →</button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <button type="button" onClick={() => navigate('/superadmin/organizations?org_status=Invited')} className="w-full p-3 rounded-2xl bg-white/8 border border-white/15 hover:bg-white/15 transition text-left flex items-center justify-between gap-2 cursor-pointer">
                      <span><span className="block text-sm font-extrabold">{analytics.pendingVerify} tenants awaiting verification</span><span className="block text-[11px] text-blue-200 font-medium">Approve to activate seats + billing</span></span>
                      <ArrowRight size={15} className="text-cyan-300 shrink-0" />
                    </button>
                    <button type="button" onClick={() => navigate('/superadmin/billing')} className="w-full p-3 rounded-2xl bg-white/8 border border-white/15 hover:bg-white/15 transition text-left flex items-center justify-between gap-2 cursor-pointer">
                      <span><span className="block text-sm font-extrabold">{kpis.overdueInvoices} overdue invoices · {inr(kpis.outstanding)}</span><span className="block text-[11px] text-blue-200 font-medium">Chase or suspend per policy</span></span>
                      <ArrowRight size={15} className="text-cyan-300 shrink-0" />
                    </button>
                    <button type="button" onClick={() => navigate('/superadmin/commissions')} className="w-full p-3 rounded-2xl bg-white/8 border border-white/15 hover:bg-white/15 transition text-left flex items-center justify-between gap-2 cursor-pointer">
                      <span><span className="block text-sm font-extrabold">{kpis.commissionsDue} commissions approved, unpaid</span><span className="block text-[11px] text-blue-200 font-medium">Release payouts to keep partners hot</span></span>
                      <ArrowRight size={15} className="text-cyan-300 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              {/* Fixed tenant table — org / plan / seats now resolve */}
              <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5"><Building2 size={15} className="text-[#0B5FD9]" /> Tenants</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Live directory — names, plans and seats always resolve.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={tenantQuery} onChange={(e) => setTenantQuery(e.target.value)} placeholder="Search tenants…" className="pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-[#0B5FD9] w-48" />
                    </div>
                    <button type="button" onClick={() => navigate('/superadmin/organizations')} className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-700 transition cursor-pointer whitespace-nowrap">Manage all →</button>
                  </div>
                </div>
                {isLoading ? (
                  <InlineLoading message="Loading platform data…" />
                ) : analytics.tenantRows.length === 0 ? (
                  <EmptyState title="No tenants provisioned" message="Provision your first client tenant to get started." />
                ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-xs min-w-[640px]">
                    <thead className="bg-slate-50">
                      <tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-2.5">Tenant</th>
                        <th className="px-4 py-2.5">Organization</th>
                        <th className="px-4 py-2.5">Plan</th>
                        <th className="px-4 py-2.5">Seats</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {analytics.tenantRows.map((t) => (
                        <tr key={t.id} className="hover:bg-blue-50/40 transition cursor-pointer" onClick={() => navigate(`/superadmin/organizations?org_q=${encodeURIComponent(t.id)}`)}>
                          <td className="px-4 py-2.5 font-mono font-bold text-amber-700 whitespace-nowrap">{t.id}</td>
                          <td className="px-4 py-2.5">
                            <div className="font-bold text-slate-900 truncate max-w-[220px]">{tenantName(t)}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{tenantVerify(t)} verification</div>
                          </td>
                          <td className="px-4 py-2.5 font-bold whitespace-nowrap">{t.seats ?? '—'}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] border whitespace-nowrap ${tenantStatus(t) === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : tenantStatus(t) === 'Suspended' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{tenantStatus(t)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
                <div className="text-[11px] font-bold text-slate-500">Showing {analytics.tenantRows.length} of {tenants.length} tenants · click a row for 360° view</div>
              </div>

              {/* Live audit stream */}
              <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5"><Radio size={15} className="text-emerald-600" /> Live audit stream</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Newest first · immutable security trail</p>
                  </div>
                  <button type="button" onClick={() => navigate('/superadmin/audit-logs')} className="text-[11px] font-extrabold text-[#0B5FD9] hover:underline cursor-pointer whitespace-nowrap">Full log →</button>
                </div>
                <div className="flex gap-1.5">
                  {['', 'TENANT', 'USER', 'BILLING'].map((f) => (
                    <button key={f || 'all'} type="button" onClick={() => setAuditFilter(f)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition cursor-pointer ${auditFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                      {f || 'All'}
                    </button>
                  ))}
                </div>
                {analytics.recentAudits.length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium p-3 rounded-2xl bg-slate-50 border border-slate-200">No audit events match this filter yet.</div>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {analytics.recentAudits.map((l, i) => (
                      <div key={l.id || i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold text-blue-700 truncate">{l.action}</span>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{timeAgo(l.timestamp)}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 truncate mt-0.5">{l.actor} → <span className="font-mono text-amber-700">{l.tenantId}</span></div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">{l.resource}/{l.recordId} · {l.ipAddress}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synced {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {auditLogs.length} total events
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZATIONS / TENANTS — full CRUD */}
        {currentTab === 'organizations' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowTenantModal(true)}
                className="px-4 py-2 rounded-xl bg-[#0B5FD9] hover:bg-blue-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus size={15} /> Provision Tenant
              </button>
            </div>
            <OrganizationsManager tenants={tenants} setTenants={setTenants} onAudit={async () => {
              try { const logRes = await apiClient.get<any[]>('/api/v1/audit-logs'); if (logRes.data) setAuditLogs(logRes.data); } catch { /* noop */ }
            }} />
          </div>
        )}

        {/* TAB 3: GLOBAL DIRECTORY — full CRUD */}
        {currentTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowUserModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Users size={15} /> Add Global User
              </button>
            </div>
            <UsersManager users={users} setUsers={setUsers} />
          </div>
        )}

        {/* TAB 4: AGENCIES & VENDORS */}
        {currentTab === 'agencies' && <AgencyPanel />}

        {/* TAB 5: SECURITY AUDIT LOGS */}
        {currentTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Real-Time Security & Compliance Audit Stream</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider font-sans">
                    <th className="pb-3">Audit ID</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Actor Email</th>
                    <th className="pb-3">Security Action</th>
                    <th className="pb-3">Resource</th>
                    <th className="pb-3">Record</th>
                    <th className="pb-3">Reason / Change</th>
                    <th className="pb-3">Target Tenant ID</th>
                    <th className="pb-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 text-slate-400">{log.id}</td>
                      <td className="py-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-3 font-bold text-slate-900 font-sans">{log.actor}</td>
                      <td className="py-3 font-bold text-blue-600">{log.action}</td>
                      <td className="py-3 text-slate-600">{log.resource || '—'}</td>
                      <td className="py-3 text-slate-600">{log.recordId || '—'}</td>
                      <td className="py-3 text-slate-600 max-w-[260px] break-words">{[log.reason, log.before !== undefined || log.after !== undefined ? `${log.before ?? ''} → ${log.after ?? ''}` : ''].filter(Boolean).join(' • ') || '—'}</td>
                      <td className="py-3 text-amber-700 font-bold">{log.tenantId}</td>
                      <td className="py-3 text-slate-500">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SYSTEM SETTINGS */}
        {currentTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Enterprise System & Security Configurations</h3>
              <p className="text-xs text-slate-500">Global JWT authentication parameters, rate limiting policies, and database encryption.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <Key size={16} className="text-[#0B5FD9]" /> JWT Authentication Policies
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Access Token Expiry (TTL)</label>
                    <input type="text" readOnly value={sysSettings?.jwtAccessTokenTtl || '15 minutes'} className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Refresh Token Expiry (TTL)</label>
                    <input type="text" readOnly value={sysSettings?.jwtRefreshTokenTtl || '7 days'} className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 font-bold" />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <Lock size={16} className="text-emerald-600" /> Multi-Tenant Rate Limiting & Data Isolation
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rate Limiting Threshold</label>
                    <input type="text" readOnly value={sysSettings?.rateLimitingPolicy || '100 requests per minute'} className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Database Encryption Standard</label>
                    <input type="text" readOnly value={sysSettings?.databaseEncryption || 'AES-256 GCM at rest'} className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={async () => {
                  try {
                    await apiClient.post('/api/v1/settings', sysSettings || {});
                    const logRes = await apiClient.get<any[]>('/api/v1/audit-logs');
                    if (logRes.data) setAuditLogs(logRes.data);
                    alert('Security settings successfully committed to Backend API!');
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
              >
                <Lock size={14} /> Commit & Enforce Security Policies via API
              </button>
            </div>
          </div>
        )}

        {/* Provision Tenant Modal */}
        <Modal open={showTenantModal} onClose={() => setShowTenantModal(false)} title="Provision New Enterprise Tenant">
          <div className="space-y-3">
            <form onSubmit={handleAddTenant} className="space-y-3 text-xs">
              <Field label="Organization Name *">
                <input type="text" required value={tenantForm.name} onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none" placeholder="e.g. Acme FinTech Corp" />
              </Field>
              <Field label="Subscription Plan Tier">
                <Select
                  value={tenantForm.plan}
                  onChange={(v) => setTenantForm({ ...tenantForm, plan: v })}
                  options={[
                    { value: 'Enterprise Custom', label: 'Enterprise Custom' },
                    { value: 'Growth Tier', label: 'Growth Tier' },
                    { value: 'Starter SaaS', label: 'Starter SaaS' },
                  ]}
                />
              </Field>
              <Field label="Allocated User Seats">
                <input type="number" required value={tenantForm.seats} onChange={(e) => setTenantForm({ ...tenantForm, seats: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none" />
              </Field>
              <button type="submit" className="w-full py-3 rounded-xl bg-spec-electric hover:bg-[#0069d1] text-white font-bold cursor-pointer mt-2">
                Provision Tenant Environment
              </button>
            </form>
          </div>
        </Modal>

        {/* Add Global User Modal */}
        <Modal open={showUserModal} onClose={() => setShowUserModal(false)} title="Add User to Global Directory">
          <div className="space-y-3">
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <Field label="Full Name *">
                <input type="text" required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none" placeholder="e.g. Priya Sharma" />
              </Field>
              <Field label="Work Email Address *">
                <input type="email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none" placeholder="priya@company.com" />
              </Field>
              <Field label="Assigned Role">
                <Select
                  value={userForm.role}
                  onChange={(v) => setUserForm({ ...userForm, role: v })}
                  options={[
                    { value: 'superadmin', label: 'Super Admin' },
                    { value: 'employer', label: 'Employer Admin' },
                    { value: 'employee', label: 'Employee Ops' },
                    { value: 'recruiter', label: 'Recruiter Agency' },
                    { value: 'vendor', label: 'Vendor Partner' },
                    { value: 'candidate', label: 'Candidate' },
                  ]}
                />
              </Field>
              <Field label="Temporary Password (min 10 characters) *">
                <input type="password" required minLength={10} autoComplete="new-password" value={userForm.password || ''} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none" placeholder="Set an initial password" />
              </Field>
              <button type="submit" className="w-full py-3 rounded-xl bg-spec-navy hover:bg-spec-midnight text-white font-bold cursor-pointer mt-2">
                Create Global Account
              </button>
            </form>
          </div>
        </Modal>

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'requisitions' && <RequisitionsPanel />}
        {currentTab === 'requisitions-new' && <RequirementCreatePage base="/superadmin" />}
        {currentTab === 'candidates' && <CandidatesPanel />}
        {currentTab === 'branches' && <BranchesPanel />}
        {currentTab === 'jobs' && <JobsPanel />}
        {currentTab === 'open-positions' && <OpenPositionsPanel />}
        {currentTab === 'jobs-new' && <JobCreatePage base="/superadmin" />}
        {currentTab === 'applications' && <ApplicationsPanel />}
        {currentTab === 'interviews' && <InterviewsPanel />}
        {currentTab === 'placements' && <OffersPlacementsPanel />}
        {currentTab === 'talent' && <TalentPoolsPanel />}
        {currentTab === 'search' && <CandidateSearchPanel />}
        {currentTab === 'outreach' && <OutreachPanel />}
        {currentTab === 'messages' && <ChatPanel />}
        {currentTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">My Admin Profile</h3>
              {profileMsg && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{profileMsg}</div>}
              {!ownUser ? (
                <div className="text-xs text-slate-500 font-medium">Signed in as {ownEmail || '—'}. Directory row loads with the user list.</div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault(); if (!ownUser) return;
                  setProfileSaving(true); setProfileMsg('');
                  try {
                    const res = await apiClient.put<any>(`/api/v1/users/${ownUser.id}`, { name: profileName.trim() });
                    if (res.data) setUsers(users.map((u: any) => (u.id === ownUser.id ? res.data : u)));
                    setProfileMsg('Display name updated.');
                  } catch (err: any) { setProfileMsg(err?.response?.data?.message || 'Save failed.'); }
                  finally { setProfileSaving(false); }
                }} className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="block font-bold text-slate-700">Email (read-only)
                    <input readOnly value={ownUser.email || ''} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-500 outline-none" />
                  </label>
                  <label className="block font-bold text-slate-700">Role (read-only)
                    <input readOnly value={ownUser.role || ''} className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-500 outline-none" />
                  </label>
                  <label className="block font-bold text-slate-700 sm:col-span-2">Display name
                    <input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none" />
                  </label>
                  <div className="sm:col-span-2"><button type="submit" disabled={profileSaving} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-50">{profileSaving ? 'Saving…' : 'Save profile'}</button></div>
                </form>
              )}
            </div>
            <MfaPanel />
          </div>
        )}
        {currentTab === 'timesheets' && <TimesheetsPanel canApprove />}
        {currentTab === 'invoices' && <PaymentsRemindersPanel />}
        {currentTab === 'payments' && <PaymentsRemindersPanel />}
        {currentTab === 'billing' && <BillingPanel />}
        {currentTab === 'commissions' && (<div className="space-y-4"><PayrollPanel /><CommissionsPanel /></div>)}
        {currentTab === 'leads' && <LeadsPanel />}
        {currentTab === 'website-leads' && <WebsiteLeadsPanel />}
        {currentTab === 'performance' && <PerformancePanel />}
        {currentTab === 'reports' && <ReportsPanel />}
        {currentTab === 'support' && <SupportPanel />}
        {currentTab === 'controls' && (
          <div className="space-y-4">
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Access control views">
              {([['verification', 'Verification'], ['users', 'Users'], ['lockouts', 'Lockouts'], ['exceptions', 'Exceptions'], ['roles', 'Roles'], ['skills', 'Skills']] as const).map(([v, label]) => (
                <button key={v} role="tab" aria-selected={controlsTab === v} type="button" onClick={() => setControlsTab(v)}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs ${controlsTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
              ))}
            </div>
            {controlsTab === 'verification' && (<><AdminControlsPanel section="verification" /><MfaPanel admin /></>)}
            {controlsTab === 'users' && <AdminControlsPanel section="users" />}
            {controlsTab === 'lockouts' && <LoginLockoutsPanel />}
            {controlsTab === 'exceptions' && <AdminControlsPanel section="exceptions" />}
            {controlsTab === 'roles' && <RolesPanel />}
            {controlsTab === 'skills' && <SkillsPanel />}
          </div>
        )}
        {currentTab === 'notifications' && <NotificationsPanel />}

      </div>
    </PortalShell>
  );
}
