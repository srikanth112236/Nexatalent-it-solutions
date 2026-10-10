import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { apiClient } from '../../shared/api-client';
import { Users, ShieldCheck, Plus, Lock, Key } from 'lucide-react';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import {
  SubscriptionsPanel, BillingPanel, CommissionsPanel, LeadsPanel, PerformancePanel,
  ReportsPanel, NotificationsPanel, AdminControlsPanel, RequisitionsPanel, ApplicationsPanel,
  CandidatesPanel, AgencyPanel, BranchesPanel, JobsPanel, SupportPanel,
  InterviewsPanel, OffersPlacementsPanel,
} from '../common/EnterprisePanels';
import { Modal, Select, Field } from '../../shared/ui/EnterpriseKit';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { OrganizationsManager, UsersManager } from './SuperAdminDirectory';

const navItems = [
  { label: 'Overview', path: '/superadmin' },
  { label: 'Tenants & Subscriptions', path: '/superadmin/organizations', group: 'Directory' },
  { label: 'Global Directory', path: '/superadmin/users', group: 'Directory' },
  { label: 'Agencies & Vendors', path: '/superadmin/agencies', group: 'Directory' },
  { label: 'Candidate Directory', path: '/superadmin/candidates', group: 'Directory' },
  { label: 'Branches', path: '/superadmin/branches', group: 'Directory' },
  { label: 'Requisitions & Jobs', path: '/superadmin/requisitions', group: 'Recruitment' },
  { label: 'Job Board (Admin)', path: '/superadmin/jobs', group: 'Recruitment' },
  { label: 'Applications', path: '/superadmin/applications', group: 'Recruitment' },
  { label: 'Interviews', path: '/superadmin/interviews', group: 'Recruitment' },
  { label: 'Placements', path: '/superadmin/placements', group: 'Recruitment' },
  { label: 'Subscriptions & Plans', path: '/superadmin/subscriptions', group: 'Commercial' },
  { label: 'Billing & Payments', path: '/superadmin/billing', group: 'Commercial' },
  { label: 'Commissions & Payouts', path: '/superadmin/commissions', group: 'Commercial' },
  { label: 'Leads & Pipeline', path: '/superadmin/leads', group: 'Sales' },
  { label: 'Sales Performance', path: '/superadmin/performance', group: 'Sales' },
  { label: 'Reports', path: '/superadmin/reports', group: 'Platform' },
  { label: 'Support & Issues', path: '/superadmin/support', group: 'Platform' },
  { label: 'Access Controls', path: '/superadmin/controls', group: 'Platform' },
  { label: 'Notifications', path: '/superadmin/notifications', group: 'Platform' },
  { label: 'Security Audit Logs', path: '/superadmin/audit-logs', group: 'Platform' },
  { label: 'System Settings', path: '/superadmin/settings', group: 'Platform' },
];

export function SuperAdminPortal() {
  const location = useLocation();

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/organizations')) return 'organizations';
    if (p.includes('/users')) return 'users';
    if (p.includes('/agencies')) return 'agencies';
    if (p.includes('/candidates')) return 'candidates';
    if (p.includes('/branches')) return 'branches';
    if (p.includes('/requisitions')) return 'requisitions';
    if (p.includes('/jobs')) return 'jobs';
    if (p.includes('/applications')) return 'applications';
    if (p.includes('/interviews')) return 'interviews';
    if (p.includes('/placements') || p.includes('/offers')) return 'placements';
    if (p.includes('/subscriptions')) return 'subscriptions';
    if (p.includes('/billing') || p.includes('/payments') || p.includes('/invoices')) return 'billing';
    if (p.includes('/commissions') || p.includes('/payouts')) return 'commissions';
    if (p.includes('/leads') || p.includes('/pipeline')) return 'leads';
    if (p.includes('/performance') || p.includes('/targets')) return 'performance';
    if (p.includes('/reports')) return 'reports';
    if (p.includes('/support')) return 'support';
    if (p.includes('/controls')) return 'controls';
    if (p.includes('/notifications')) return 'notifications';
    if (p.includes('/audit')) return 'audit';
    if (p.includes('/settings')) return 'settings';
    return 'overview';
  })();

  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [sysSettings, setSysSettings] = useState<any>(null);
  const [kpis, setKpis] = useState({ jobs: 0, publishedJobs: 0, applications: 0, subscriptions: 0, activeSubs: 0, outstanding: 0, overdueInvoices: 0, leads: 0, newLeads: 0, placements: 0, commissionsDue: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [tenantForm, setTenantForm] = useState({ name: '', plan: 'Enterprise Custom', seats: '50' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'employer', tenantId: 'TNT-9011', password: '' });

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
        // Live platform KPIs (§6.2) — real counts, never fabricated
        try {
          const [jobs, apps, subs, invs, leads, placements, commissions] = await Promise.all([
            apiClient.get<any[]>('/api/v1/jobs').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/applications').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/subscriptions').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/invoices').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/leads').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/placements').catch(() => ({ data: [] as any[] })),
            apiClient.get<any[]>('/api/v1/commissions').catch(() => ({ data: [] as any[] })),
          ]);
          const list = (r: unknown) => (Array.isArray((r as { data?: unknown })?.data) ? ((r as { data: any[] }).data) : []);
          const invoices = list(invs);
          setKpis({
            jobs: list(jobs).length,
            publishedJobs: list(jobs).filter((j) => j.status === 'Published').length,
            applications: list(apps).length,
            subscriptions: list(subs).length,
            activeSubs: list(subs).filter((s) => s.status === 'Active').length,
            outstanding: invoices.reduce((a: number, i: any) => a + Number(i.balance || 0), 0),
            overdueInvoices: invoices.filter((i: any) => Number(i.balance || 0) > 0 && i.dueDate && new Date(i.dueDate) < new Date()).length,
            leads: list(leads).length,
            newLeads: list(leads).filter((l: any) => l.stage === 'New').length,
            placements: list(placements).length,
            commissionsDue: list(commissions).filter((c: any) => c.approvalStatus === 'Approved' && c.paymentStatus !== 'Paid').length,
          });
        } catch { /* KPI row is best-effort; core tables already loaded */ }
      } catch (err) {
        console.warn('API Error in SuperAdminPortal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post<any>('/api/v1/tenants', tenantForm);
      if (res.data) {
        setTenants([res.data, ...tenants]);
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

  return (
    <PortalShell portalTitle="Super Admin Console" portalRole="superadmin" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              <ShieldCheck size={14} /> Platform Governance & Controls
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform Governance & Tenant Controls
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Manage multi-tenant isolation, SaaS subscriptions, global user directory, audit events, and security parameters.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTenantModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} /> Provision Tenant
            </button>
            <button
              onClick={() => setShowUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Users size={15} /> Add Global User
            </button>
          </div>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/superadmin' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Client Organizations</div>
                <div className="text-3xl font-extrabold text-slate-900">{tenants.length} Tenants</div>
                <div className="text-xs font-bold text-emerald-600">Tenant-scoped records</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Users</div>
                <div className="text-3xl font-extrabold text-slate-900">{users.length} Users</div>
                <div className="text-xs font-bold text-[#087BFF]">{users.length} accounts in directory</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security Audit Events</div>
                <div className="text-3xl font-extrabold text-slate-900">{auditLogs.length} Events</div>
                <div className="text-xs font-bold text-emerald-600">{auditLogs.length} events recorded</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['Published Jobs', `${kpis.publishedJobs} / ${kpis.jobs}`],
                ['Applications', `${kpis.applications}`],
                ['Active Subscriptions', `${kpis.activeSubs} / ${kpis.subscriptions}`],
                ['Outstanding Receivables', `₹${kpis.outstanding.toLocaleString('en-IN')}`],
                ['Overdue Invoices', `${kpis.overdueInvoices}`],
                ['New Leads', `${kpis.newLeads} / ${kpis.leads}`],
                ['Placements', `${kpis.placements}`],
                ['Commissions Due', `${kpis.commissionsDue}`],
              ].map(([label, value]) => (
                <div key={label} className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
                  <div className="text-2xl font-extrabold text-slate-900">{value}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Active Tenants & SaaS Subscriptions Overview</h3>
              {isLoading ? (
                <InlineLoading message="Loading platform data…" />
              ) : tenants.length === 0 ? (
                <EmptyState title="No tenants provisioned" message="Provision your first client tenant to get started." />
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3">Tenant ID</th>
                      <th className="pb-3">Organization Name</th>
                      <th className="pb-3">SaaS Plan</th>
                      <th className="pb-3">Active Seats</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {tenants.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono font-bold text-amber-700">{t.id}</td>
                        <td className="py-3 font-bold text-slate-900">{t.name}</td>
                        <td className="py-3"><span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] border border-blue-200 font-bold text-[11px]">{t.plan}</span></td>
                        <td className="py-3">{t.seats}</td>
                        <td className="py-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZATIONS / TENANTS — full CRUD */}
        {currentTab === 'organizations' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowTenantModal(true)}
                className="px-4 py-2 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
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
                  <Key size={16} className="text-[#087BFF]" /> JWT Authentication Policies
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
              <Field label="Temporary Password (min 8 characters) *">
                <input type="password" required minLength={8} autoComplete="new-password" value={userForm.password || ''} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none" placeholder="Set an initial password" />
              </Field>
              <button type="submit" className="w-full py-3 rounded-xl bg-spec-navy hover:bg-spec-midnight text-white font-bold cursor-pointer mt-2">
                Create Global Account
              </button>
            </form>
          </div>
        </Modal>

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'requisitions' && <RequisitionsPanel />}
        {currentTab === 'candidates' && <CandidatesPanel />}
        {currentTab === 'branches' && <BranchesPanel />}
        {currentTab === 'jobs' && <JobsPanel />}
        {currentTab === 'applications' && <ApplicationsPanel />}
        {currentTab === 'interviews' && <InterviewsPanel />}
        {currentTab === 'placements' && <OffersPlacementsPanel />}
        {currentTab === 'subscriptions' && <SubscriptionsPanel />}
        {currentTab === 'billing' && <BillingPanel />}
        {currentTab === 'commissions' && <CommissionsPanel />}
        {currentTab === 'leads' && <LeadsPanel />}
        {currentTab === 'performance' && <PerformancePanel />}
        {currentTab === 'reports' && <ReportsPanel />}
        {currentTab === 'support' && <SupportPanel />}
        {currentTab === 'controls' && (<div className="space-y-4"><AdminControlsPanel /><MfaPanel admin /></div>)}
        {currentTab === 'notifications' && <NotificationsPanel />}

      </div>
    </PortalShell>
  );
}
