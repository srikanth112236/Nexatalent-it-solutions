import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, Briefcase, CalendarClock, CheckCircle2, ChevronRight, Circle,
  ClipboardList, Plus, Search, Sparkles, Target, Users, Building2, Activity,
  AlertTriangle, Loader2, RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../shared/api-client';
import { applicationsApi, interviewsApi, jobsApi, requisitionsApi } from '../../shared/enterprise/phaseApi';
import { getTenantId } from '../../shared/auth/session';
import { usePortalSync } from '../../shared/data/store';
import { EmptyState } from '../../shared/ui/DataState';

/* ------------------------------------------------------------------ types */
type Row = Record<string, any>;

interface DashboardData {
  requisitions: Row[];
  jobs: Row[];
  applications: Row[];
  interviews: Row[];
  crm: { accounts: Row[]; leads: Row[]; summary?: Record<string, number> };
  tasks: Row[];
  activity: Row[];
}

const EMPTY: DashboardData = {
  requisitions: [], jobs: [], applications: [], interviews: [],
  crm: { accounts: [], leads: [] }, tasks: [], activity: [],
};

const OPEN_REQ = ['Approved', 'Sourcing', 'Pending Approval'];
const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Offer', 'Hired'];

function listOf(res: any): Row[] {
  const body = res?.data ?? res;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

function crmOf(res: any): DashboardData['crm'] {
  const body = res?.data ?? res ?? {};
  const rows: Row[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
  return {
    accounts: Array.isArray(body?.accounts) ? body.accounts : rows.filter((r) => r.kind === 'account'),
    leads: Array.isArray(body?.leads) ? body.leads : rows.filter((r) => r.kind === 'lead'),
    summary: body?.summary,
  };
}

const today = () => new Date().toISOString().slice(0, 10);

function initials(name?: string): string {
  const s = String(name || '').trim();
  if (!s) return '—';
  return s.split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
}

/* ------------------------------------------------------------------ atoms */
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />;
}

function KpiCard({
  label, value, hint, tone, icon, onClick, bar,
}: {
  label: string; value: string; hint: string;
  tone: 'blue' | 'violet' | 'emerald' | 'amber';
  icon: React.ReactNode; onClick: () => void; bar?: number;
}) {
  const tones: Record<string, { ring: string; chip: string; bar: string }> = {
    blue: { ring: 'group-hover:border-[#0B5FD9]/40', chip: 'bg-blue-50 text-[#0B5FD9] border-blue-100', bar: 'bg-[#0B5FD9]' },
    violet: { ring: 'group-hover:border-violet-400/40', chip: 'bg-violet-50 text-violet-700 border-violet-100', bar: 'bg-violet-600' },
    emerald: { ring: 'group-hover:border-emerald-400/40', chip: 'bg-emerald-50 text-emerald-700 border-emerald-100', bar: 'bg-emerald-600' },
    amber: { ring: 'group-hover:border-amber-400/50', chip: 'bg-amber-50 text-amber-800 border-amber-100', bar: 'bg-amber-500' },
  };
  const t = tones[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${t.ring} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5FD9] focus-visible:ring-offset-2`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">{label}</span>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border ${t.chip}`}>{icon}</span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</span>
        <ArrowUpRight size={15} className="mb-1 text-slate-300 group-hover:text-slate-600 transition-colors" />
      </div>
      <div className="mt-1 text-[11px] font-semibold text-slate-500">{hint}</div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${t.bar} transition-all duration-500`} style={{ width: `${Math.max(4, Math.min(100, bar ?? 0))}%` }} />
      </div>
    </button>
  );
}

function SectionCard({
  title, subtitle, action, children, className = '',
}: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm ${className}`}>
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold text-slate-900 truncate">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------- dashboard */
export function EmployeeDashboard({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickTask, setQuickTask] = useState('');
  const [quickBusy, setQuickBusy] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const [req, jobs, apps, ivs, crm, tasks, acts] = await Promise.all([
        requisitionsApi.list('?page=1&pageSize=200').catch(() => null),
        jobsApi.list('?page=1&pageSize=200').catch(() => null),
        applicationsApi.list('?page=1&pageSize=200').catch(() => null),
        interviewsApi.list('?page=1&pageSize=100').catch(() => null),
        apiClient.get<any>('/api/v1/crm').catch(() => null),
        apiClient.get<any>('/api/v1/tasks').catch(() => null),
        apiClient.get<any>('/api/v1/activities?page=1&pageSize=8').catch(() => null),
      ]);
      setData({
        requisitions: listOf(req),
        jobs: listOf(jobs),
        applications: listOf(apps),
        interviews: listOf(ivs),
        crm: crmOf(crm),
        tasks: listOf(tasks),
        activity: listOf(acts),
      });
    } catch (err: any) {
      setError(err?.message || 'Could not load your workspace.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  usePortalSync(load);

  const todayStr = today();

  const stats = useMemo(() => {
    const openReqs = data.requisitions.filter((r) => OPEN_REQ.includes(r.status));
    const pendingApproval = data.requisitions.filter((r) => r.status === 'Pending Approval');
    const liveJobs = data.jobs.filter((j) => j.status === 'Published');
    const activeApps = data.applications.filter((a) => !['Rejected', 'Withdrawn', 'Hired'].includes(a.stage));
    const hired = data.applications.filter((a) => a.stage === 'Hired');
    const pendingTasks = data.tasks.filter((t) => t.status !== 'Completed');
    const completedTasks = data.tasks.filter((t) => t.status === 'Completed');
    const dueToday = pendingTasks.filter((t) => t.dueDate && String(t.dueDate).slice(0, 10) <= todayStr);
    const overdue = pendingTasks.filter((t) => t.dueDate && String(t.dueDate).slice(0, 10) < todayStr);
    const scheduled = data.interviews.filter((i) => ['Scheduled', 'Rescheduled'].includes(i.status));
    const upcoming = scheduled
      .filter((i) => i.scheduledAt && new Date(i.scheduledAt).getTime() >= Date.now() - 36e5)
      .sort((a, b) => String(a.scheduledAt).localeCompare(String(b.scheduledAt)))
      .slice(0, 4);
    const conversion = data.applications.length ? Math.round((hired.length / data.applications.length) * 100) : 0;
    return {
      openReqs, pendingApproval, liveJobs, activeApps, hired, pendingTasks, completedTasks,
      dueToday, overdue, upcoming, scheduled, conversion,
      accounts: data.crm.accounts.length,
      leads: data.crm.leads.length,
      completionRate: data.tasks.length ? Math.round((completedTasks.length / data.tasks.length) * 100) : 0,
    };
  }, [data, todayStr]);

  const funnel = useMemo(() => {
    const counts = PIPELINE_STAGES.map((stage) => ({
      stage,
      count: data.applications.filter((a) => a.stage === stage).length,
    }));
    const max = Math.max(1, ...counts.map((c) => c.count));
    return { counts, max };
  }, [data.applications]);

  const attention = useMemo(() => {
    const items: Array<{ id: string; title: string; why: string; tone: 'amber' | 'red' | 'blue'; to: string }> = [];
    for (const r of stats.pendingApproval) {
      items.push({ id: r.id, title: r.title || r.id, why: 'Awaiting approval', tone: 'amber', to: `/employee/requisitions` });
    }
    for (const j of data.jobs) {
      if (j.status !== 'Published') continue;
      const apps = data.applications.filter((a) => a.jobId === j.id).length;
      if (apps === 0) items.push({ id: j.id, title: j.title || j.id, why: 'Published · no applicants yet', tone: 'blue', to: '/employee/jobs' });
    }
    for (const t of stats.overdue) {
      items.push({ id: t.id, title: t.title, why: `Task overdue${t.client ? ` · ${t.client}` : ''}`, tone: 'red', to: '/employee/tasks' });
    }
    return items.slice(0, 5);
  }, [stats.pendingApproval, stats.overdue, data.jobs, data.applications]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const toggleTask = async (task: Row) => {
    const next = task.status === 'Completed' ? 'Pending' : 'Completed';
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === task.id ? { ...t, status: next } : t)) }));
    try {
      await apiClient.patch(`/api/v1/tasks/${task.id}`, { status: next });
    } catch {
      setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)) }));
    }
  };

  const addQuickTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    setQuickBusy(true);
    try {
      const res = await apiClient.post<any>('/api/v1/tasks', { title: quickTask.trim(), priority: 'Medium' });
      const created = res?.data ?? res;
      if (created?.id) setData((d) => ({ ...d, tasks: [created, ...d.tasks] }));
      setQuickTask('');
      setShowQuick(false);
    } catch {
      /* keep the input so nothing is lost */
    } finally {
      setQuickBusy(false);
    }
  };

  const tenantId = getTenantId() || '—';

  return (
    <div className="space-y-4">
      {/* ---------------- hero ---------------- */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#071B3A] via-[#0B2548] to-[#0B5FD9] p-5 sm:p-6 text-white shadow-[0_18px_40px_-24px_rgba(7,27,58,0.8)]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles size={12} /> Ops &amp; Delivery Workspace
              <span className="mx-1 h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
              {tenantId}
            </div>
            <h1 className="mt-2.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {greeting}, {userName || 'there'}.
            </h1>
            <p className="mt-1 max-w-xl text-xs sm:text-[13px] font-medium text-blue-100/90">
              {stats.openReqs.length} open requirement{stats.openReqs.length === 1 ? '' : 's'} ·{' '}
              {stats.activeApps.length} candidate{stats.activeApps.length === 1 ? '' : 's'} in play ·{' '}
              {stats.dueToday.length} task{stats.dueToday.length === 1 ? '' : 's'} due today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/employee/requisitions/new')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-extrabold text-[#071B3A] shadow-sm transition hover:bg-blue-50"
            >
              <Plus size={14} /> New requirement
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee/jobs/new')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-white/20"
            >
              <Briefcase size={14} /> New job
            </button>
            <button
              type="button"
              onClick={() => setShowQuick((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-white/20"
            >
              <ClipboardList size={14} /> Log task
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee/candidates')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-white/20"
            >
              <Search size={14} /> Find talent
            </button>
          </div>
        </div>

        {showQuick && (
          <form onSubmit={addQuickTask} className="relative mt-4 flex flex-col gap-2 rounded-2xl bg-white/10 p-3 sm:flex-row sm:items-center">
            <label htmlFor="quick-task" className="sr-only">New task title</label>
            <input
              id="quick-task"
              autoFocus
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              placeholder="What needs doing? e.g. Screen 5 React profiles for Acme"
              className="w-full flex-1 rounded-xl border border-white/20 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              type="submit"
              disabled={quickBusy || !quickTask.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-[#071B3A] disabled:opacity-50"
            >
              {quickBusy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add task
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
          <span className="inline-flex items-center gap-2"><AlertTriangle size={14} /> {error}</span>
          <button type="button" onClick={load} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 font-extrabold text-red-700 border border-red-200">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* ---------------- KPI strip ---------------- */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[116px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            label="Open requirements"
            value={String(stats.openReqs.length)}
            hint={`${stats.pendingApproval.length} awaiting approval`}
            tone="blue"
            icon={<Target size={15} />}
            bar={Math.min(100, stats.openReqs.length * 12)}
            onClick={() => navigate('/employee/requisitions')}
          />
          <KpiCard
            label="Live mandates"
            value={String(stats.liveJobs.length)}
            hint={`${data.jobs.length} job${data.jobs.length === 1 ? '' : 's'} in total`}
            tone="violet"
            icon={<Briefcase size={15} />}
            bar={data.jobs.length ? (stats.liveJobs.length / data.jobs.length) * 100 : 0}
            onClick={() => navigate('/employee/jobs')}
          />
          <KpiCard
            label="Candidates in play"
            value={String(stats.activeApps.length)}
            hint={`${stats.hired.length} hired · ${stats.conversion}% conversion`}
            tone="emerald"
            icon={<Users size={15} />}
            bar={stats.conversion}
            onClick={() => navigate('/employee/applications')}
          />
          <KpiCard
            label="Tasks due"
            value={String(stats.dueToday.length)}
            hint={stats.overdue.length ? `${stats.overdue.length} overdue` : `${stats.completionRate}% completion rate`}
            tone={stats.overdue.length ? 'amber' : 'blue'}
            icon={<ClipboardList size={15} />}
            bar={stats.completionRate}
            onClick={() => navigate('/employee/tasks')}
          />
        </div>
      )}

      {/* ---------------- main grid ---------------- */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <SectionCard
            title="Hiring pipeline"
            subtitle="Live applications by stage — click a stage to open the board"
            action={
              <button
                type="button"
                onClick={() => navigate('/employee/applications')}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-extrabold text-slate-700 hover:bg-slate-50"
              >
                Open board <ChevronRight size={12} />
              </button>
            }
          >
            {loading ? (
              <div className="space-y-2">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8" />)}</div>
            ) : data.applications.length === 0 ? (
              <EmptyState title="No applications yet" message="Candidates landing in your mandates will show up here." />
            ) : (
              <div className="space-y-2">
                {funnel.counts.map(({ stage, count }) => {
                  const pct = Math.round((count / funnel.max) * 100);
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => navigate(`/employee/applications?app_stage=${encodeURIComponent(stage)}`)}
                      className="group flex w-full items-center gap-3 rounded-xl px-1.5 py-1 text-left transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5FD9]"
                      aria-label={`${stage}: ${count} candidate${count === 1 ? '' : 's'} — open pipeline`}
                    >
                      <span className="w-[132px] shrink-0 truncate text-[11px] font-bold text-slate-600 group-hover:text-slate-900">{stage}</span>
                      <span className="relative h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
                        <span
                          className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-[#0B5FD9] to-[#35A7FF] transition-all duration-500 group-hover:from-[#071B3A] group-hover:to-[#0B5FD9]"
                          style={{ width: `${Math.max(count > 0 ? 8 : 0, pct)}%` }}
                        />
                      </span>
                      <span className="w-8 shrink-0 text-right font-mono text-xs font-extrabold text-slate-900">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Needs your attention"
            subtitle="Approvals, silent mandates and overdue work"
            action={
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-100">
                {attention.length} item{attention.length === 1 ? '' : 's'}
              </span>
            }
          >
            {loading ? (
              <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-11" />)}</div>
            ) : attention.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-3">
                <CheckCircle2 size={18} className="text-emerald-700" />
                <div>
                  <div className="text-xs font-extrabold text-emerald-900">All clear</div>
                  <div className="text-[11px] font-medium text-emerald-800/80">No approvals waiting, no silent mandates, nothing overdue.</div>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {attention.map((item) => (
                  <li key={`${item.id}-${item.why}`}>
                    <button
                      type="button"
                      onClick={() => navigate(item.to)}
                      className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-left transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5FD9]"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          item.tone === 'red' ? 'bg-red-500' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-[#0B5FD9]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-extrabold text-slate-900">{item.title}</span>
                        <span className="block truncate text-[11px] font-medium text-slate-500">{item.why}</span>
                      </span>
                      <ChevronRight size={14} className="shrink-0 text-slate-300" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard
            title="Today"
            subtitle={`${stats.pendingTasks.length} open task${stats.pendingTasks.length === 1 ? '' : 's'} · ${stats.upcoming.length} upcoming interview${stats.upcoming.length === 1 ? '' : 's'}`}
            action={
              <button
                type="button"
                onClick={() => setShowQuick(true)}
                aria-label="Add a task"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Plus size={14} />
              </button>
            }
          >
            {loading ? (
              <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : (
              <div className="space-y-3">
                <ul className="space-y-1.5">
                  {(stats.dueToday.length ? stats.dueToday : stats.pendingTasks).slice(0, 5).map((t) => {
                    const done = t.status === 'Completed';
                    const overdue = t.dueDate && String(t.dueDate).slice(0, 10) < todayStr;
                    return (
                      <li key={t.id} className="flex items-start gap-2 rounded-lg px-1 py-1">
                        <button
                          type="button"
                          onClick={() => toggleTask(t)}
                          aria-label={done ? `Mark "${t.title}" as pending` : `Mark "${t.title}" as complete`}
                          className={`mt-0.5 shrink-0 rounded-md ${done ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                          {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className={`truncate text-xs font-bold ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</div>
                          <div className={`text-[10px] font-semibold ${overdue ? 'text-red-700' : 'text-slate-500'}`}>
                            {t.client ? `${t.client} · ` : ''}
                            {t.dueDate ? `${overdue ? 'Overdue' : 'Due'} ${String(t.dueDate).slice(0, 10)}` : 'No due date'}
                            {t.priority === 'High' && <span className="ml-1.5 rounded bg-red-50 px-1 py-0.5 text-red-700">High</span>}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  {stats.pendingTasks.length === 0 && (
                    <li className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-[11px] font-semibold text-slate-500">
                      Nothing open — enjoy the clear runway.
                    </li>
                  )}
                </ul>

                {stats.upcoming.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      <CalendarClock size={12} /> Upcoming interviews
                    </div>
                    <ul className="space-y-1.5">
                      {stats.upcoming.map((i) => (
                        <li key={i.id}>
                          <button
                            type="button"
                            onClick={() => navigate('/employee/interviews')}
                            className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-slate-50"
                          >
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B5FD9] text-[10px] font-extrabold">
                              {initials(i.candidateName || i.candidateEmail)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[11px] font-bold text-slate-900">{i.candidateName || i.candidateEmail || 'Candidate'}</span>
                              <span className="block truncate text-[10px] font-semibold text-slate-500">
                                {i.scheduledAt ? new Date(i.scheduledAt).toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                {i.jobTitle ? ` · ${i.jobTitle}` : ''}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Client accounts"
            subtitle="Live mandates and follow-up health"
            action={
              <button
                type="button"
                onClick={() => navigate('/employee/crm')}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-extrabold text-slate-700 hover:bg-slate-50"
              >
                All <ChevronRight size={12} />
              </button>
            }
          >
            {loading ? (
              <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-9" />)}</div>
            ) : data.crm.accounts.length === 0 ? (
              <p className="py-3 text-center text-[11px] font-semibold text-slate-500">No client accounts assigned yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {data.crm.accounts.slice(0, 4).map((a) => {
                  const overdue = a.slaHealth === 'Follow-up overdue';
                  return (
                    <li key={a.id} className="flex items-center gap-2 rounded-lg px-1 py-1">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-[10px] font-extrabold">
                        {initials(a.clientName)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-bold text-slate-900">{a.clientName || a.id}</span>
                        <span className="block truncate text-[10px] font-semibold text-slate-500">{a.industry || 'Client account'}</span>
                      </span>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${overdue ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                        {overdue ? 'At risk' : `${a.activeReqs || 0} req`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>

      {/* ---------------- activity ---------------- */}
      <SectionCard
        title="Recent activity"
        subtitle="Calls, meetings, proposals and pipeline movement"
        action={
          <button
            type="button"
            onClick={() => navigate('/employee/activities')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-extrabold text-slate-700 hover:bg-slate-50"
          >
            Full timeline <ChevronRight size={12} />
          </button>
        }
      >
        {loading ? (
          <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-9" />)}</div>
        ) : data.activity.length === 0 ? (
          <EmptyState title="No activity recorded" message="Log a call or book a meeting and it will appear here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.activity.slice(0, 6).map((a) => (
              <li key={`${a.kind}-${a.id}`} className="flex items-start gap-3 py-2">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Activity size={12} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-slate-900">{a.title || a.kind}</span>
                  <span className="block truncate text-[11px] font-medium text-slate-500">
                    {a.leadName ? `${a.leadName} · ` : ''}
                    {a.at ? String(a.at).slice(0, 16).replace('T', ' ') : ''}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-extrabold capitalize text-slate-600">
                  {a.kind}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2 text-[10px] font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5"><Building2 size={12} /> Tenant {tenantId} · scoped to the company you are acting on</span>
        <span>Data refreshes automatically after every change</span>
      </div>
    </div>
  );
}
