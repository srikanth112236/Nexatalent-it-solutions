import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { LeadsPanel, PerformancePanel, NotificationsPanel } from '../common/EnterprisePanels';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const navItems = [
  { label: 'Overview', path: '/employee' },
  { label: 'CRM & Accounts', path: '/employee/crm', group: 'Delivery' },
  { label: 'Recruitment Tasks', path: '/employee/tasks', group: 'Delivery' },
  { label: 'Quarterly Targets', path: '/employee/targets', group: 'Delivery' },
  { label: 'Sales Leads Pipeline', path: '/employee/leads', group: 'Sales' },
  { label: 'Sales Performance', path: '/employee/performance', group: 'Sales' },
  { label: 'Delivery Reports', path: '/employee/reports', group: 'Workspace' },
  { label: 'Security', path: '/employee/security', group: 'Workspace' },
  { label: 'Notifications', path: '/employee/notifications', group: 'Workspace' },
];

export function EmployeePortal() {
  const location = useLocation();

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/crm')) return 'crm';
    if (p.includes('/tasks')) return 'tasks';
    if (p.includes('/targets')) return 'targets';
    if (p.includes('/leads') || p.includes('/pipeline')) return 'leads';
    if (p.includes('/performance')) return 'performance';
    if (p.includes('/security')) return 'security';
    if (p.includes('/notifications')) return 'notifications';
    if (p.includes('/reports')) return 'reports';
    return 'overview';
  })();

  const [crmAccounts, setCrmAccounts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [cRes, tRes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/crm').catch(() => ({ data: [] as any[] })),
          apiClient.get<any[]>('/api/v1/tasks').catch(() => ({ data: [] as any[] })),
        ]);
        if (cRes?.data) setCrmAccounts(cRes.data);
        if (tRes?.data) setTasks(tRes.data);
      } catch (err) {
        console.warn('API Error in EmployeePortal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const prev = tasks;
    const newStatus = task?.status === 'Completed' ? 'Pending' : 'Completed';
    setTasks(prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await apiClient.patch(`/api/v1/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.warn('Task patch API notice:', err);
      setTasks(prev);
    }
  };

  // All KPIs computed live from API data — no static figures.
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);
  const totalOpenReqs = crmAccounts.reduce((sum, a) => sum + (Number(a.activeReqs) || 0), 0);

  return (
    <PortalShell portalTitle="Internal Employee Portal" portalRole="employee" navItems={navItems}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#087BFF] border border-blue-200 mb-2">
              <ShieldCheck size={14} /> Internal Ops Delivery Team
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              NexaTalent Ops & Account Delivery Workspace
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Manage client account SLAs, candidate vetting workflows, recruitment tasks, and quarterly targets.
            </p>
          </div>
        </div>
        )}

        {/* Page title — spec §5.2 (sidebar owns navigation; shell owns context) */}
        <div className="px-1">
          <h2 className="text-lg font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/employee' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {isLoading ? (
              <InlineLoading message="Loading workspace…" />
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Client Accounts</div>
                <div className="text-3xl font-extrabold text-slate-900">{crmAccounts.length} Clients</div>
                <div className="text-xs font-bold text-[#087BFF]">{totalOpenReqs} Open Requisitions</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks Due Today</div>
                <div className="text-3xl font-extrabold text-slate-900">{pendingTasks.length} Pending</div>
                <div className="text-xs font-bold text-amber-600">{completedTasks.length} Completed</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Completion</div>
                <div className="text-3xl font-extrabold text-slate-900">{completionRate}% Done</div>
                <div className="text-xs font-bold text-emerald-600">{tasks.length} Total Tasks</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Active Managed Client Accounts</h3>
              {crmAccounts.length === 0 ? (
                <EmptyState title="No client accounts" message="Accounts assigned to you will appear here." />
              ) : (
              <div className="space-y-3">
                {crmAccounts.map((acc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{acc.clientName}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">Industry: {acc.industry} • Active Reqs: {acc.activeReqs}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                      {acc.slaHealth}
                    </span>
                  </div>
                ))}
              </div>
              )}
            </div>
            </>
            )}
          </div>
        )}

        {/* TAB 2: CRM & ACCOUNTS */}
        {currentTab === 'crm' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Enterprise Client Accounts Directory</h3>
            {isLoading ? (
              <InlineLoading message="Loading accounts…" />
            ) : crmAccounts.length === 0 ? (
              <EmptyState title="No accounts found" message="Client accounts synced from the server will appear here." />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Account ID</th>
                    <th className="pb-3">Client Organization</th>
                    <th className="pb-3">Industry Domain</th>
                    <th className="pb-3">Account Owner</th>
                    <th className="pb-3">Open Requisitions</th>
                    <th className="pb-3">SLA Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {crmAccounts.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-500">{c.id}</td>
                      <td className="py-3 font-bold text-slate-900">{c.clientName}</td>
                      <td className="py-3">{c.industry}</td>
                      <td className="py-3 text-slate-600">{c.accountOwner}</td>
                      <td className="py-3 font-bold text-[#087BFF]">{c.activeReqs} Reqs</td>
                      <td className="py-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">{c.slaHealth}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* TAB 3: RECRUITMENT TASKS */}
        {currentTab === 'tasks' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Daily Candidate Vetting & Delivery Tasks</h3>
            {isLoading ? (
              <InlineLoading message="Loading tasks…" />
            ) : tasks.length === 0 ? (
              <EmptyState title="No tasks assigned" message="Vetting and delivery tasks will appear here." />
            ) : (
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                        task.status === 'Completed' ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {task.status === 'Completed' && <CheckCircle2 size={14} />}
                    </button>
                    <div>
                      <div className={`font-extrabold text-slate-900 text-sm ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </div>
                      <div className="text-slate-500 font-medium mt-0.5">Client: {task.client} • Due: {task.dueDate}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 4: QUARTERLY TARGETS */}
        {currentTab === 'targets' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Quarterly Delivery Performance</h3>
              <p className="text-xs text-slate-500">Live task delivery attainment, computed from your assigned workload.</p>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading performance…" />
            ) : tasks.length === 0 ? (
              <EmptyState title="No performance data" message="Complete assigned tasks to build your quarterly record." />
            ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Task Completion Attainment</span>
                  <span className="text-[#087BFF] font-mono">{completedTasks.length} / {tasks.length} ({completionRate}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#087BFF] rounded-full" style={{ width: `${completionRate}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900 text-sm">Tasks Completed</div>
                  <div className="text-3xl font-extrabold text-emerald-600 font-mono">{completedTasks.length}</div>
                  <div className="text-slate-500">Verified delivery completions</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900 text-sm">Managed Client Accounts</div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">{crmAccounts.length} Clients</div>
                  <div className="text-slate-500">{totalOpenReqs} open requisitions</div>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* TAB 5: DELIVERY REPORTS */}
        {currentTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Account & Delivery Analytics</h3>
              <p className="text-xs text-slate-500">Operational metrics computed from live CRM and task data.</p>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading analytics…" />
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-bold uppercase">Managed Accounts</div>
                <div className="text-3xl font-extrabold text-slate-900">{crmAccounts.length}</div>
                <div className="text-emerald-600 font-bold">{totalOpenReqs} open requisitions</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-bold uppercase">Task Completion Rate</div>
                <div className="text-3xl font-extrabold text-slate-900">{completionRate}%</div>
                <div className="text-[#087BFF] font-bold">{pendingTasks.length} tasks pending</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-bold uppercase">Workload Assigned</div>
                <div className="text-3xl font-extrabold text-slate-900">{tasks.length}</div>
                <div className="text-emerald-600 font-bold">{completedTasks.length} completed</div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'leads' && <LeadsPanel />}
        {currentTab === 'performance' && <PerformancePanel />}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

      </div>
    </PortalShell>
  );
}
