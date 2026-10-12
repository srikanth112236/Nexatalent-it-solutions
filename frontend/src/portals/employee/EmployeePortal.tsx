import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { platformApi, salesApi } from '../../shared/enterprise/phaseApi';
import { syncAll } from '../common/EnterprisePanels';
import { LeadsPanel, PerformancePanel, NotificationsPanel, PayrollPanel } from '../common/EnterprisePanels';
import { WebsiteLeadsPanel } from '../common/WebsiteLeadsPanel';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { Select } from '../../shared/ui/EnterpriseKit';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';

const navItems = [
  { label: 'Overview', path: '/employee' },
  { label: 'CRM & Accounts', path: '/employee/crm', group: 'Delivery' },
  { label: 'Recruitment Tasks', path: '/employee/tasks', group: 'Delivery' },
  { label: 'Quarterly Targets', path: '/employee/targets', group: 'Delivery' },
  { label: 'Payroll', path: '/employee/payroll', group: 'Delivery' },
  { label: 'Sales Leads Pipeline', path: '/employee/leads', group: 'Sales' },
  { label: 'Website Leads', path: '/employee/website-leads', group: 'Sales' },
  { label: 'Activities', path: '/employee/activities', group: 'Sales' },
  { label: 'Sales Performance', path: '/employee/performance', group: 'Sales' },
  { label: 'Delivery Reports', path: '/employee/reports', group: 'Workspace' },
  { label: 'Security', path: '/employee/security', group: 'Workspace' },
  { label: 'Notifications', path: '/employee/notifications', group: 'Workspace' },
  { label: 'Settings', path: '/employee/settings', group: 'Workspace' },
];

export function EmployeePortal() {
  const location = useLocation();

  const currentTab = (() => {
    const p = location.pathname;
    if (p.includes('/crm')) return 'crm';
    if (p.includes('/tasks')) return 'tasks';
    if (p.includes('/targets')) return 'targets';
    if (p.includes('/payroll')) return 'payroll';
    if (p.includes('/website-leads')) return 'website-leads';
    if (p.includes('/leads') || p.includes('/pipeline')) return 'leads';
    if (p.includes('/activities')) return 'activities';
    if (p.includes('/performance')) return 'performance';
    if (p.includes('/security')) return 'security';
    if (p.includes('/notifications') || p.includes('/settings')) return 'notifications';
    if (p.includes('/reports')) return 'reports';
    return 'overview';
  })();

  const [crmAccounts, setCrmAccounts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [actKind, setActKind] = useState('');
  const [actLoading, setActLoading] = useState(false);
  const [salesTargets, setSalesTargets] = useState<any[]>([]);
  const [targetProgress, setTargetProgress] = useState<Record<string, any>>({});
  const [targetsLoading, setTargetsLoading] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', client: '', dueDate: '', priority: 'Medium' });
  const [taskBusy, setTaskBusy] = useState(false);

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

  /* ---------- unified activities feed (§10.2) ---------- */
  useEffect(() => {
    if (currentTab !== 'activities') return;
    (async () => {
      setActLoading(true);
      try {
        const sp = new URLSearchParams({ page: '1', pageSize: '50' });
        if (actKind) sp.set('kind', actKind);
        const res = await salesApi.activitiesFeed(`?${sp.toString()}`);
        const body = (res as { data?: any })?.data as any;
        setActivities(Array.isArray(body?.data) ? body.data : []);
      } catch {
        setActivities([]);
      } finally {
        setActLoading(false);
      }
    })();
  }, [currentTab, actKind]);

  /* ---------- sales targets with live progress (won vs goal) ---------- */
  useEffect(() => {
    if (currentTab !== 'targets') return;
    (async () => {
      setTargetsLoading(true);
      try {
        const res = await salesApi.targets();
        const rows = (((res as { data?: any[] })?.data || []) as any[]);
        setSalesTargets(rows);
        const owners = [...new Set(rows.map((t) => t.owner).filter(Boolean))];
        const prog: Record<string, any> = {};
        await Promise.all(owners.map(async (o) => {
          try {
            const p = await salesApi.performance(`?owner=${encodeURIComponent(o)}`);
            prog[o] = (p as { data?: any })?.data || null;
          } catch { /* best-effort */ }
        }));
        setTargetProgress(prog);
      } catch {
        setSalesTargets([]);
      } finally {
        setTargetsLoading(false);
      }
    })();
  }, [currentTab]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    setTaskBusy(true);
    try {
      const created = (await platformApi.createTask({ title: taskForm.title.trim(), client: taskForm.client.trim(), dueDate: taskForm.dueDate || undefined, priority: taskForm.priority })) as { data?: any };
      if (created?.data) setTasks((x) => [created.data, ...x]);
      setTaskForm({ title: '', client: '', dueDate: '', priority: 'Medium' });
      syncAll();
    } catch (err) {
      console.warn('Task create notice:', err);
    } finally {
      setTaskBusy(false);
    }
  };

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
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Top Header — dashboard only */}
        {currentTab === 'overview' && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#087BFF] border border-blue-200 mb-2">
              <ShieldCheck size={14} /> Internal Ops Delivery Team
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
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
          <h2 className="text-base font-extrabold text-slate-900">{navItems.find((n) => location.pathname === n.path)?.label || navItems.filter((n) => n.path !== '/employee' && location.pathname.startsWith(n.path)).sort((a, b) => b.path.length - a.path.length)[0]?.label || navItems[0].label}</h2>
        </div>

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {isLoading ? (
              <InlineLoading message="Loading workspace…" />
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Client Accounts</div>
                <div className="text-3xl font-extrabold text-slate-900">{crmAccounts.length} Clients</div>
                <div className="text-xs font-bold text-[#087BFF]">{totalOpenReqs} Open Requisitions</div>
              </div>
              <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks Due Today</div>
                <div className="text-3xl font-extrabold text-slate-900">{pendingTasks.length} Pending</div>
                <div className="text-xs font-bold text-amber-600">{completedTasks.length} Completed</div>
              </div>
              <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Completion</div>
                <div className="text-3xl font-extrabold text-slate-900">{completionRate}% Done</div>
                <div className="text-xs font-bold text-emerald-600">{tasks.length} Total Tasks</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
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
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
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
                    <th className="pb-2">Account ID</th>
                    <th className="pb-2">Client Organization</th>
                    <th className="pb-2">Industry Domain</th>
                    <th className="pb-2">Account Owner</th>
                    <th className="pb-2">Open Requisitions</th>
                    <th className="pb-2">SLA Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {crmAccounts.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 font-mono font-bold text-slate-500">{c.id}</td>
                      <td className="py-2 font-bold text-slate-900">{c.clientName}</td>
                      <td className="py-2">{c.industry}</td>
                      <td className="py-2 text-slate-600">{c.accountOwner}</td>
                      <td className="py-2 font-bold text-[#087BFF]">{c.activeReqs} Reqs</td>
                      <td className="py-2"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">{c.slaHealth}</span></td>
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
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Daily Candidate Vetting & Delivery Tasks</h3>
            <form onSubmit={createTask} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title *" aria-label="Task title" className="sm:col-span-2 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <input value={taskForm.client} onChange={(e) => setTaskForm({ ...taskForm, client: e.target.value })} placeholder="Client" aria-label="Client" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <input value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} type="date" aria-label="Due date" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
              <div className="flex gap-2">
                <Select value={taskForm.priority} onChange={(v) => setTaskForm({ ...taskForm, priority: v })} ariaLabel="Priority" options={['High', 'Medium', 'Low'].map((v) => ({ value: v, label: v }))} />
                <button type="submit" disabled={taskBusy} className="px-4 py-2 rounded-xl bg-[#087BFF] text-white font-bold text-xs disabled:opacity-50 shrink-0">Add</button>
              </div>
            </form>
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

        {/* TAB 4: SALES TARGETS (live: won vs goal per owner) */}
        {currentTab === 'targets' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Sales Targets & Attainment</h3>
                <p className="text-xs text-slate-500">Live wins vs goal per owner. Set or edit targets under Sales Performance.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-extrabold text-slate-900 text-sm">Task attainment (delivery)</div>
                <div className="font-mono text-[#087BFF] font-bold">{completedTasks.length} / {tasks.length} ({completionRate}%)</div>
              </div>
            </div>

            {targetsLoading ? (
              <InlineLoading message="Loading targets…" />
            ) : salesTargets.length === 0 ? (
              <EmptyState title="No sales targets" message="Managers set owner/period/goal targets — progress appears here automatically." />
            ) : (
            <div className="space-y-3">
              {salesTargets.map((t) => {
                const perf = targetProgress[t.owner];
                const won = perf ? Number(perf.won || 0) : null;
                const goal = Number(t.goal || 0);
                const pct = won === null || goal <= 0 ? null : Math.min(100, Math.round((won / goal) * 100));
                return (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-extrabold text-slate-900 text-sm">{t.owner} • {t.period}</div>
                      <div className="text-xs font-bold text-slate-600">Goal <span className="font-mono">{goal}</span>{won !== null && <> • Won <span className="font-mono text-emerald-700">{won}</span></>}</div>
                    </div>
                    {pct === null ? (
                      <div className="text-[11px] text-slate-500 font-medium">Progress unavailable for this owner/period.</div>
                    ) : (
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>Attainment</span>
                          <span className="text-[#087BFF] font-mono">{pct}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

        {/* TAB 5: DELIVERY REPORTS */}
        {currentTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
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

        {/* TAB: UNIFIED ACTIVITIES FEED (§10.2) */}
        {currentTab === 'activities' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Sales Activity Timeline</h3>
                <p className="text-xs text-slate-500">Calls, touches, meetings and proposals — newest first, with outcomes and follow-ups.</p>
              </div>
              <Select value={actKind} onChange={setActKind} ariaLabel="Activity kind" options={[{ value: '', label: 'All kinds' }, { value: 'activity', label: 'Activities' }, { value: 'meeting', label: 'Meetings' }, { value: 'proposal', label: 'Proposals' }]} />
            </div>
            {actLoading ? (
              <InlineLoading message="Loading activities…" />
            ) : activities.length === 0 ? (
              <EmptyState title="No activity yet" message="Log lead touches, book meetings or create proposals — they land here." />
            ) : (
            <div className="space-y-2">
              {activities.map((a) => (
                <div key={`${a.kind}-${a.id}`} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-extrabold text-slate-900 text-sm">{a.title}</div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${a.kind === 'meeting' ? 'bg-blue-50 text-[#087BFF] border-blue-200' : a.kind === 'proposal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>{a.kind}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{a.leadName} • {String(a.at || '').slice(0, 16).replace('T', ' ')} • Owner: {a.owner || '—'}</div>
                  {(a.outcome || a.notes) && <div className="text-xs text-slate-600">{a.outcome && <strong>{a.outcome} — </strong>}{a.notes}</div>}
                  {(a.nextAction || a.followUp) && <div className="text-[11px] text-amber-700 font-bold">Next: {a.nextAction || '—'}{a.followUp ? ` • Follow up ${String(a.followUp).slice(0, 10)}` : ''}</div>}
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* ENTERPRISE: new phase modules */}
        {currentTab === 'payroll' && <PayrollPanel />}
        {currentTab === 'leads' && <LeadsPanel />}
        {currentTab === 'website-leads' && <WebsiteLeadsPanel />}
        {currentTab === 'performance' && <PerformancePanel />}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}

      </div>
    </PortalShell>
  );
}
