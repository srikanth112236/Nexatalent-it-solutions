import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalShell } from '../common/PortalShell';
import { CheckCircle2, Compass, Loader2 } from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { platformApi, salesApi } from '../../shared/enterprise/phaseApi';
import {
  ApplicationsPanel,
  CandidatesPanel,
  InterviewsPanel,
  JobCreatePage,
  JobsPanel,
  LeadsPanel,
  NotificationsPanel,
  PayrollPanel,
  PerformancePanel,
  RequirementCreatePage,
  RequisitionsPanel,
  syncAll,
} from '../common/EnterprisePanels';
import { WebsiteLeadsPanel } from '../common/WebsiteLeadsPanel';
import { MfaPanel } from '../../auth/components/MfaPanel';
import { Select } from '../../shared/ui/EnterpriseKit';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { usePortalSync } from '../../shared/data/store';
import { getUserEmail } from '../../shared/auth/session';
import { EmployeeDashboard } from './EmployeeDashboard';
import { EmployeeCrmPanel } from './EmployeeCrmPanel';
import { EmployeeSettingsPanel } from './EmployeeSettingsPanel';

const navItems = [
  { label: 'Overview', path: '/employee' },
  { label: 'CRM & Accounts', path: '/employee/crm', group: 'Delivery' },
  { label: 'My Requirements', path: '/employee/requisitions', group: 'Delivery' },
  { label: 'Mandate Jobs', path: '/employee/jobs', group: 'Delivery' },
  { label: 'Candidate Pipeline', path: '/employee/applications', group: 'Delivery' },
  { label: 'Candidate Search', path: '/employee/candidates', group: 'Delivery' },
  { label: 'Interviews', path: '/employee/interviews', group: 'Delivery' },
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

const TITLES: Record<string, string> = {
  overview: 'Overview',
  crm: 'CRM & Accounts',
  requisitions: 'My Requirements',
  'requisitions-new': 'New Requirement',
  jobs: 'Mandate Jobs',
  'jobs-new': 'New Job',
  applications: 'Candidate Pipeline',
  candidates: 'Candidate Search',
  interviews: 'Interviews',
  tasks: 'Recruitment Tasks',
  targets: 'Quarterly Targets',
  payroll: 'Payroll',
  leads: 'Sales Leads Pipeline',
  'website-leads': 'Website Leads',
  activities: 'Activities',
  performance: 'Sales Performance',
  reports: 'Delivery Reports',
  security: 'Security',
  notifications: 'Notifications',
  settings: 'Settings',
};

const SUBTITLES: Record<string, string> = {
  crm: 'The clients you own and the leads feeding them.',
  requisitions: 'Roles your clients have signed off on.',
  jobs: 'Published mandates accepting applications.',
  applications: 'Every candidate moving through your mandates.',
  candidates: 'Search the agency-wide candidate pool.',
  interviews: 'Schedules, panel feedback and outcomes.',
  tasks: 'Your delivery checklist — toggle to complete.',
  targets: 'Won versus goal, per owner and period.',
  activities: 'Calls, meetings, proposals and follow-ups.',
  settings: 'Profile, notifications and session security.',
};

function resolveTab(pathname: string): string {
  const path = pathname.replace(/\/+$/, '') || '/employee';
  if (path === '/employee') return 'overview';
  const rest = path.slice('/employee'.length); // e.g. "/requisitions/new"
  const segments = rest.split('/').filter(Boolean);
  if (segments.length === 0) return 'overview';

  // Exact two-segment creators first, so /requisitions/new never falls back
  // to the list panel (it used to render "My Requirements" instead of the form).
  if (segments[0] === 'requisitions' && segments[1] === 'new') return 'requisitions-new';
  if (segments[0] === 'jobs' && segments[1] === 'new') return 'jobs-new';

  const root = segments[0];
  const known = new Set([
    'crm', 'requisitions', 'jobs', 'applications', 'candidates', 'interviews', 'tasks',
    'targets', 'payroll', 'leads', 'website-leads', 'activities', 'performance',
    'reports', 'security', 'notifications', 'settings',
  ]);
  if (known.has(root)) return root;
  return 'notfound';
}

function displayName(email: string): string {
  const local = String(email || '').split('@')[0] || '';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export function EmployeePortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = resolveTab(location.pathname);

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
  const [crmSummary, setCrmSummary] = useState<{ accounts: number; openReqs: number }>({ accounts: 0, openReqs: 0 });

  const fetchTasks = useCallback(async () => {
    try {
      const res: any = await apiClient.get<any[]>('/api/v1/tasks');
      const rows = Array.isArray(res?.data) ? res.data : Array.isArray((res?.data as any)?.data) ? (res.data as any).data : [];
      setTasks(rows);
    } catch {
      setTasks([]);
    }
  }, []);

  const fetchCrm = useCallback(async () => {
    try {
      const res: any = await apiClient.get<any>('/api/v1/crm');
      const body = res?.data ?? res;
      const rows: any[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
      const accounts = Array.isArray(body?.accounts) ? body.accounts : rows.filter((r) => r.kind !== 'lead');
      setCrmSummary({
        accounts: (body?.summary?.accounts ?? accounts.length) || 0,
        openReqs: body?.summary?.openReqs ?? accounts.reduce((n: number, a: any) => n + (Number(a.activeReqs) || 0), 0),
      });
    } catch {
      setCrmSummary({ accounts: 0, openReqs: 0 });
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await Promise.all([fetchTasks(), fetchCrm()]);
      setIsLoading(false);
    })();
  }, [fetchTasks, fetchCrm]);

  // Any portal mutation re-fetches the shared lists.
  usePortalSync(() => { fetchTasks(); fetchCrm(); });

  /* ---------- unified activities feed ---------- */
  useEffect(() => {
    if (currentTab !== 'activities') return;
    (async () => {
      setActLoading(true);
      try {
        const sp = new URLSearchParams({ page: '1', pageSize: '50' });
        if (actKind) sp.set('kind', actKind);
        const res: any = await salesApi.activitiesFeed(`?${sp.toString()}`);
        // The API answers {success, data:[…]}; unwrap once, never twice.
        const body = res?.data ?? res;
        setActivities(Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : []);
      } catch {
        setActivities([]);
      } finally {
        setActLoading(false);
      }
    })();
  }, [currentTab, actKind]);

  /* ---------- sales targets with live progress ---------- */
  useEffect(() => {
    if (currentTab !== 'targets') return;
    (async () => {
      setTargetsLoading(true);
      try {
        const res = await salesApi.targets();
        const rows = ((res as { data?: any[] })?.data || []) as any[];
        setSalesTargets(rows);
        const owners = [...new Set(rows.map((t) => t.owner).filter(Boolean))];
        const prog: Record<string, any> = {};
        await Promise.all(owners.map(async (o) => {
          try {
            const p = await salesApi.performance(`?owner=${encodeURIComponent(String(o))}`);
            prog[String(o)] = (p as { data?: any })?.data || null;
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
      const created = (await platformApi.createTask({
        title: taskForm.title.trim(),
        client: taskForm.client.trim(),
        dueDate: taskForm.dueDate || undefined,
        priority: taskForm.priority,
      })) as { data?: any };
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
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const prev = tasks;
    const newStatus = task?.status === 'Completed' ? 'Pending' : 'Completed';
    setTasks(prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await apiClient.patch(`/api/v1/tasks/${taskId}`, { status: newStatus });
      syncAll();
    } catch {
      setTasks(prev);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);
  const totalOpenReqs = crmSummary.openReqs;
  const userEmail = getUserEmail() || '';
  const userName = displayName(userEmail);

  const showPageHeader = currentTab !== 'overview' && currentTab !== 'notfound';

  return (
    <PortalShell portalTitle="Internal Employee Portal" portalRole="employee" navItems={navItems}>
      <div className="mx-auto max-w-[1200px] space-y-4">
        {showPageHeader && (
          <div className="flex flex-wrap items-end justify-between gap-2 px-1">
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                {TITLES[currentTab] || 'Workspace'}
              </h1>
              {SUBTITLES[currentTab] && (
                <p className="mt-0.5 text-xs font-medium text-slate-500">{SUBTITLES[currentTab]}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-0.5">{crmSummary.accounts} clients</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5">{totalOpenReqs} open reqs</span>
            </div>
          </div>
        )}

        {/* ---------------- overview ---------------- */}
        {currentTab === 'overview' && <EmployeeDashboard userName={userName} />}

        {/* ---------------- new requirement / job (full-page creators) ---------------- */}
        {currentTab === 'requisitions-new' && <RequirementCreatePage base="/employee" />}
        {currentTab === 'jobs-new' && <JobCreatePage base="/employee" />}

        {/* ---------------- CRM ---------------- */}
        {currentTab === 'crm' && <EmployeeCrmPanel />}

        {/* ---------------- recruitment tasks ---------------- */}
        {currentTab === 'tasks' && (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Daily candidate vetting &amp; delivery tasks</h3>
                <p className="text-xs font-medium text-slate-500">
                  {pendingTasks.length} open · {completedTasks.length} completed · {completionRate}% done
                </p>
              </div>
              <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <form onSubmit={createTask} className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-5">
              <input
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Task title *"
                aria-label="Task title"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#0B5FD9] sm:col-span-2"
              />
              <input
                value={taskForm.client}
                onChange={(e) => setTaskForm({ ...taskForm, client: e.target.value })}
                placeholder="Client"
                aria-label="Client"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#0B5FD9]"
              />
              <input
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                type="date"
                aria-label="Due date"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#0B5FD9]"
              />
              <div className="flex gap-2">
                <Select
                  value={taskForm.priority}
                  onChange={(v) => setTaskForm({ ...taskForm, priority: v })}
                  ariaLabel="Priority"
                  options={['High', 'Medium', 'Low'].map((v) => ({ value: v, label: v }))}
                />
                <button
                  type="submit"
                  disabled={taskBusy || !taskForm.title.trim()}
                  className="shrink-0 rounded-xl bg-[#0B5FD9] px-4 py-2 text-xs font-extrabold text-white disabled:opacity-50"
                >
                  {taskBusy ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
                </button>
              </div>
            </form>

            {isLoading ? (
              <InlineLoading message="Loading tasks…" />
            ) : tasks.length === 0 ? (
              <EmptyState title="No tasks assigned" message="Vetting and delivery tasks will appear here." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {tasks.map((task) => {
                  const done = task.status === 'Completed';
                  const overdue = task.dueDate && String(task.dueDate).slice(0, 10) < new Date().toISOString().slice(0, 10);
                  return (
                    <li key={task.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id)}
                          aria-label={done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as complete`}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                            done ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white text-transparent hover:border-slate-400'
                          }`}
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <div className="min-w-0">
                          <div className={`truncate text-sm font-extrabold ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {task.title}
                          </div>
                          <div className={`mt-0.5 truncate text-[11px] font-semibold ${overdue && !done ? 'text-red-700' : 'text-slate-500'}`}>
                            {task.client ? `${task.client} · ` : ''}
                            {task.dueDate ? `${overdue && !done ? 'Overdue' : 'Due'} ${String(task.dueDate).slice(0, 10)}` : 'No due date'}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${
                          task.priority === 'High'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-slate-200 bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.priority || 'Medium'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* ---------------- targets ---------------- */}
        {currentTab === 'targets' && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Sales targets &amp; attainment</h3>
                <p className="text-xs font-medium text-slate-500">Live wins versus goal per owner. Edit targets under Sales Performance.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs">
                <div className="text-sm font-extrabold text-slate-900">Task attainment</div>
                <div className="font-mono font-bold text-[#0B5FD9]">
                  {completedTasks.length} / {tasks.length} ({completionRate}%)
                </div>
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
                    <div key={t.id} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-extrabold text-slate-900">{t.owner} · {t.period}</div>
                        <div className="text-xs font-bold text-slate-600">
                          Goal <span className="font-mono">{goal}</span>
                          {won !== null && <> · Won <span className="font-mono text-emerald-700">{won}</span></>}
                        </div>
                      </div>
                      {pct === null ? (
                        <div className="text-[11px] font-medium text-slate-500">Progress unavailable for this owner/period.</div>
                      ) : (
                        <div>
                          <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-700">
                            <span>Attainment</span>
                            <span className="font-mono text-[#0B5FD9]">{pct}%</span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
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

        {/* ---------------- reports ---------------- */}
        {currentTab === 'reports' && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Account &amp; delivery analytics</h3>
              <p className="text-xs font-medium text-slate-500">Operational metrics computed from live CRM and task data.</p>
            </div>

            {isLoading ? (
              <InlineLoading message="Loading analytics…" />
            ) : (
              <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
                <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="font-bold uppercase text-slate-500">Managed accounts</div>
                  <div className="text-3xl font-extrabold text-slate-900">{crmSummary.accounts}</div>
                  <div className="font-bold text-emerald-700">{totalOpenReqs} open requisitions</div>
                </div>
                <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="font-bold uppercase text-slate-500">Task completion rate</div>
                  <div className="text-3xl font-extrabold text-slate-900">{completionRate}%</div>
                  <div className="font-bold text-[#0B5FD9]">{pendingTasks.length} tasks pending</div>
                </div>
                <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="font-bold uppercase text-slate-500">Workload assigned</div>
                  <div className="text-3xl font-extrabold text-slate-900">{tasks.length}</div>
                  <div className="font-bold text-emerald-700">{completedTasks.length} completed</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- activities ---------------- */}
        {currentTab === 'activities' && (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Sales activity timeline</h3>
                <p className="text-xs font-medium text-slate-500">Calls, touches, meetings and proposals — newest first, with outcomes and follow-ups.</p>
              </div>
              <Select
                value={actKind}
                onChange={setActKind}
                ariaLabel="Activity kind"
                options={[
                  { value: '', label: 'All kinds' },
                  { value: 'activity', label: 'Activities' },
                  { value: 'meeting', label: 'Meetings' },
                  { value: 'proposal', label: 'Proposals' },
                ]}
              />
            </div>
            {actLoading ? (
              <InlineLoading message="Loading activities…" />
            ) : activities.length === 0 ? (
              <EmptyState title="No activity yet" message="Log lead touches, book meetings or create proposals — they land here." />
            ) : (
              <div className="space-y-2">
                {activities.map((a) => (
                  <div key={`${a.kind}-${a.id}`} className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-extrabold text-slate-900">{a.title}</div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          a.kind === 'meeting'
                            ? 'border-blue-200 bg-blue-50 text-[#0B5FD9]'
                            : a.kind === 'proposal'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-100 text-slate-700'
                        }`}
                      >
                        {a.kind}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-600">
                      {a.leadName} · {String(a.at || '').slice(0, 16).replace('T', ' ')} · Owner: {a.owner || '—'}
                    </div>
                    {(a.outcome || a.notes) && (
                      <div className="text-xs text-slate-600">
                        {a.outcome && <strong>{a.outcome} — </strong>}
                        {a.notes}
                      </div>
                    )}
                    {(a.nextAction || a.followUp) && (
                      <div className="text-[11px] font-bold text-amber-800">
                        Next: {a.nextAction || '—'}
                        {a.followUp ? ` · Follow up ${String(a.followUp).slice(0, 10)}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- enterprise panels ---------------- */}
        {currentTab === 'requisitions' && <RequisitionsPanel />}
        {currentTab === 'jobs' && <JobsPanel />}
        {currentTab === 'applications' && <ApplicationsPanel />}
        {currentTab === 'candidates' && <CandidatesPanel />}
        {currentTab === 'interviews' && <InterviewsPanel />}
        {currentTab === 'payroll' && <PayrollPanel />}
        {currentTab === 'leads' && <LeadsPanel />}
        {currentTab === 'website-leads' && <WebsiteLeadsPanel />}
        {currentTab === 'performance' && <PerformancePanel />}
        {currentTab === 'security' && <MfaPanel />}
        {currentTab === 'notifications' && <NotificationsPanel />}
        {currentTab === 'settings' && <EmployeeSettingsPanel />}

        {/* ---------------- unknown employee route ---------------- */}
        {currentTab === 'notfound' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Compass size={22} />
            </div>
            <h1 className="mt-3 text-lg font-extrabold text-slate-900">This page isn&apos;t part of your workspace</h1>
            <p className="mx-auto mt-1 max-w-md text-xs font-medium text-slate-500">
              <span className="font-mono">{location.pathname}</span> doesn&apos;t match any employee section. Pick a destination below.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/employee', { replace: true })}
                className="rounded-xl bg-[#071B3A] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#0B2548]"
              >
                Back to overview
              </button>
              <button
                type="button"
                onClick={() => navigate('/employee/requisitions', { replace: true })}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
              >
                My requirements
              </button>
              <button
                type="button"
                onClick={() => navigate('/employee/tasks', { replace: true })}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
              >
                My tasks
              </button>
            </div>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
