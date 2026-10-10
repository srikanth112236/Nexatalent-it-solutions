import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { Building2, Plus, CheckCircle2, X, Search, FileCheck } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { SubmissionsPanel, CommissionsPanel, NotificationsPanel, TimesheetsPanel } from '../common/EnterprisePanels';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const navItems = [
  { label: 'Overview', path: '/vendor' },
  { label: 'Requisitions', path: '/vendor/requisitions' },
  { label: 'Contractor Roster', path: '/vendor/contractors' },
  { label: 'Timesheets', path: '/vendor/timesheets' },
  { label: 'Invoices & SOWs', path: '/vendor/invoices' },
  { label: 'Compliance & NDAs', path: '/vendor/compliance' },
  { label: 'Candidate Submissions', path: '/vendor/submissions' },
  { label: 'Commissions & Payouts', path: '/vendor/commissions' },
  { label: 'Security', path: '/vendor/security' },
  { label: 'Notifications', path: '/vendor/notifications' },
];

export function VendorPortal() {
  const location = useLocation();

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/requisitions')) return 'requisitions';
    if (p.includes('/contractors')) return 'contractors';
    if (p.includes('/timesheets')) return 'timesheets';
    if (p.includes('/invoices')) return 'invoices';
    if (p.includes('/compliance')) return 'compliance';
    if (p.includes('/submissions')) return 'submissions';
    if (p.includes('/commissions') || p.includes('/payouts')) return 'commissions';
    if (p.includes('/security')) return 'security';
    if (p.includes('/notifications')) return 'notifications';
    return 'overview';
  })();

  const [contractors, setContractors] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [compliance, setCompliance] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [contractorForm, setContractorForm] = useState({
    name: '',
    skillset: '',
    hourlyRate: '',
    clientName: '',
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [cRes, jRes, invRes, compRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/contractors').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/jobs').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/invoices').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/compliance').catch(() => ({ data: [] as any[] })),
        ]);
        if (cRes?.data) setContractors(cRes.data);
        if (jRes?.data) setJobs(jRes.data);
        if (invRes?.data) setInvoices(invRes.data);
        if (compRes?.data) setCompliance(compRes.data);
      } catch (err) {
        console.warn('API Error in VendorPortal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDeployContractor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!contractorForm.name.trim() || !contractorForm.skillset.trim()) {
      setSubmitError('Contractor name and skillset are required.');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await apiClient.post<any>('/api/v1/contractors', contractorForm);
      if (res.data) {
        setContractors([res.data, ...contractors]);
      }
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContractorForm({ name: '', skillset: '', hourlyRate: '', clientName: '' });
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAddModal(false);
      }, 1500);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Deployment failed. Try again.');
      setIsSubmitting(false);
    }
  };

  // KPIs computed from live server data.
  const activeContractors = contractors.filter((c) => c.status === 'Active Deployed');
  const pendingTimesheets = contractors.filter((c) => c.status === 'Timesheet Pending');
  const vendorClients = [...new Set(contractors.map((c) => c.clientName).filter(Boolean))];
  const openRequisitions = jobs.filter((j) => j.status === 'Active');

  return (
    <PortalShell portalTitle="Vendor Partner Workspace" portalRole="vendor" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
              <Building2 size={14} /> Vendor Partner Workspace
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Vendor Partner Hub
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Manage contingent labor requisitions, rate cards, SOW contractors, timesheets, and enterprise compliance.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} /> Deploy Contractor Resource
          </button>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/vendor' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deployed Contractors</div>
                <div className="text-3xl font-extrabold text-slate-900">{activeContractors.length} Deployed</div>
                <div className="text-xs font-bold text-emerald-600">{contractors.length} Total Resources</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Staffing Requisitions</div>
                <div className="text-3xl font-extrabold text-slate-900">{openRequisitions.length} Requisitions</div>
                <div className="text-xs font-bold text-purple-600">{vendorClients.length} Client Accounts</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Timesheets</div>
                <div className="text-3xl font-extrabold text-slate-900">{pendingTimesheets.length} Pending</div>
                <div className="text-xs font-bold text-amber-600">Approval SLA: 24h</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recorded Invoices</div>
                <div className="text-3xl font-extrabold text-slate-900">{invoices.length} Total</div>
                <div className="text-xs font-bold text-slate-500">{invoices.filter((i) => i.status === 'Paid').length} Paid</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Active Deployed Contractor Resources</h3>
              {isLoading ? (
                <InlineLoading message="Loading contractors…" />
              ) : contractors.length === 0 ? (
                <EmptyState title="No contractors deployed" message="Deploy your first contractor resource to get started." />
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3">Contractor Name</th>
                      <th className="pb-3">Role / Skillset</th>
                      <th className="pb-3">Client Organization</th>
                      <th className="pb-3">Bill Rate / Hr</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {contractors.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3">{c.skillset}</td>
                        <td className="py-3 font-semibold text-slate-700">{c.clientName}</td>
                        <td className="py-3 font-mono font-bold text-purple-700">{c.hourlyRate}</td>
                        <td className="py-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">{c.status}</span></td>
                      </tr>
                    ))}
                    </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REQUISITIONS */}
        {currentTab === 'requisitions' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Open Staff Augmentation Requisitions</h3>
            {isLoading ? (
              <InlineLoading message="Loading requisitions…" />
            ) : openRequisitions.length === 0 ? (
              <EmptyState title="No open requisitions" message="Employer staffing requisitions will appear here." />
            ) : (
            <div className="space-y-3">
              {openRequisitions.map((req) => (
                <div key={req.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{req.title} • {req.companyName}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      <span className="font-mono font-bold text-purple-700">{req.id}</span> • Budget: <strong className="text-purple-700">{req.budgetRange}</strong> • {req.location}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer shrink-0"
                  >
                    Deploy Contractor
                  </button>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTRACTOR ROSTER */}
        {currentTab === 'contractors' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900">Deployed Contractor Roster</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contractor or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none w-64"
                />
              </div>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading roster…" />
            ) : contractors.length === 0 ? (
              <EmptyState title="Roster is empty" message="Deployed contractors will appear in this roster." />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Contractor ID</th>
                    <th className="pb-3">Full Name</th>
                    <th className="pb-3">Role & Skillset</th>
                    <th className="pb-3">Client Account</th>
                    <th className="pb-3">Hourly Rate</th>
                    <th className="pb-3">SLA Score</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {contractors
                    .filter(c => String(c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(c.skillset || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 font-mono font-bold text-slate-500">{c.id}</td>
                        <td className="py-3 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3">{c.skillset}</td>
                        <td className="py-3 font-semibold text-slate-700">{c.clientName}</td>
                        <td className="py-3 font-mono font-bold text-purple-700">{c.hourlyRate}</td>
                        <td className="py-3 font-bold text-emerald-600">{c.slaScore}</td>
                        <td className="py-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">{c.status}</span></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* TAB 4: TIMESHEETS (real submit → approve flow) */}
        {currentTab === 'timesheets' && <TimesheetsPanel />}

        {/* TAB 5: INVOICES & SOWS */}
        {currentTab === 'invoices' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Statement of Work (SOW) Monthly Invoices</h3>
            {isLoading ? (
              <InlineLoading message="Loading invoices…" />
            ) : invoices.length === 0 ? (
              <EmptyState title="No invoices recorded" message="Invoices raised against client SOWs will appear here." />
            ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-purple-700 text-sm">{inv.invNo || inv.id}</div>
                    <div className="text-slate-600 font-medium mt-0.5">Client: <strong>{inv.client}</strong> • Period: {inv.period}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900 font-mono">{inv.amount}</div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px]">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 6: COMPLIANCE & NDAS */}
        {currentTab === 'compliance' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Enterprise Vendor Compliance & Legal NDAs</h3>
              <p className="text-xs text-slate-500">Background Verification (BGV) SLAs, Master Service Agreements (MSA), and active guarantees.</p>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading compliance…" />
            ) : compliance.length === 0 ? (
              <EmptyState title="No compliance records" message="BGV clearances, MSAs and NDA records will appear here once filed." />
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {compliance.map((rec) => (
                <div key={rec.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <FileCheck size={20} className="text-emerald-600" />
                  <div className="font-extrabold text-slate-900 text-sm">{rec.title}</div>
                  <p className="text-slate-600 font-medium">{rec.detail}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Deploy Contractor Resource Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 relative space-y-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-extrabold text-slate-900">Deploy New Contractor Resource</h3>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {submitError}
                </div>
              )}

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                  <div className="text-lg font-extrabold text-slate-900">Contractor Deployed to Client SOW!</div>
                  <p className="text-xs text-slate-600">Assigned hourly rate card linked to client billing ledger.</p>
                </div>
              ) : (
                <form onSubmit={handleDeployContractor} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contractor Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contractorForm.name}
                      onChange={(e) => setContractorForm({ ...contractorForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Role & Technical Skillset *</label>
                    <input
                      type="text"
                      required
                      value={contractorForm.skillset}
                      onChange={(e) => setContractorForm({ ...contractorForm, skillset: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hourly Bill Rate *</label>
                      <input
                        type="text"
                        required
                        value={contractorForm.hourlyRate}
                        onChange={(e) => setContractorForm({ ...contractorForm, hourlyRate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Client Account *</label>
                      <input
                        type="text"
                        required
                        value={contractorForm.clientName}
                        onChange={(e) => setContractorForm({ ...contractorForm, clientName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer mt-3"
                  >
                    {isSubmitting ? 'Deploying Resource...' : 'Submit & Deploy Resource'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'submissions' && <SubmissionsPanel />}
        {currentTab === 'commissions' && <CommissionsPanel />}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

      </div>
    </PortalShell>
  );
}
