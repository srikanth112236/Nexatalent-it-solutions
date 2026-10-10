import { useState, useEffect, useMemo, Fragment } from 'react';
import { apiClient } from '../../shared/api-client';
import { Candidate360Drawer, AgencyDrawer } from '../superadmin/SuperAdmin360';
import { ExportButton, useQueryState, useDebounced, checkRecordAction, useActionGuard, DetailDrawer, GlobalCreateModal } from './CrudKit';
import { useAuth, usePermissions } from '../../shared/auth/AuthContext';
import {
  applicationsApi, interviewsApi, chatApi, talentApi, requisitionsApi, jobsApi,
  offersPlacementsApi, billingApi, salesApi, platformApi, documentsApi, workforceApi,
} from '../../shared/enterprise/phaseApi';
import { invalidateCollections } from '../../shared/data/store';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { Modal, ConfirmDialog, RowMenu, Select, DatePicker, Field, ActionConfirm, inputCls as kitInput } from '../../shared/ui/EnterpriseKit';

/** Role-to-role sync: every successful mutation broadcasts so all portals refetch. */
export function syncAll() {
  try { invalidateCollections(); } catch { /* noop */ }
  try { window.dispatchEvent(new Event('nexa:sync')); } catch { /* noop */ }
}

function unwrapList(res: unknown): any[] {
  const d = (res as { data?: unknown })?.data;
  if (Array.isArray(d)) return d;
  const paged = (res as { data?: { data?: unknown[] } })?.data;
  if (paged && Array.isArray((paged as { data?: unknown[] }).data)) return (paged as { data: unknown[] }).data;
  return [];
}
function unwrapObj(res: unknown): any {
  return (res as { data?: unknown })?.data ?? res;
}
function errMsg(err: unknown): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    || (err as Error)?.message || 'Request failed. Try again.';
}

const inputCls = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500';
const btnPrimary = 'px-4 py-2.5 rounded-xl bg-spec-electric hover:bg-[#0069d1] text-white font-bold text-xs shadow-md cursor-pointer';
const btnDark = 'px-4 py-2.5 rounded-xl bg-spec-navy hover:bg-spec-midnight text-white font-bold text-xs shadow-md cursor-pointer';
const cardCls = 'bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4';

function PanelError({ message, onRetry, status }: { message: string; onRetry: () => void; status?: number }) {
  if (status === 403) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between gap-3" role="alert">
        <span>⛔ No permission for this data with your role. {message}</span>
        <button type="button" onClick={onRetry} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold shrink-0">Retry</button>
      </div>
    );
  }
  if (status === 404) {
    return (
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between gap-3" role="alert">
        <span>🔍 Not found. {message}</span>
        <button type="button" onClick={onRetry} className="px-3 py-1.5 rounded-lg bg-slate-700 text-white font-bold shrink-0">Retry</button>
      </div>
    );
  }
  return (
    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-3" role="alert">
      <span>{message}</span>
      <button type="button" onClick={onRetry} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold shrink-0">Retry</button>
    </div>
  );
}

export function errStatus(err: unknown): number {
  return Number((err as { response?: { status?: number } })?.response?.status || (err as { status?: number })?.status || 0);
}

/** Debounced value (§5.5) — avoids filtering/fetching on every keystroke. */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Server pagination controls (§5.2/§5.5). */
export function Pager({ page, total, pageSize, onPage }: { page: number; total: number; pageSize: number; onPage: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  if (totalPages <= 1) return null;
  const btn = 'px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] disabled:opacity-40';
  return (
    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
      <span aria-live="polite">Page {page} of {totalPages} • {total} records</span>
      <span className="flex gap-1.5">
        <button type="button" className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)}>← Prev</button>
        <button type="button" className={btn} disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next →</button>
      </span>
    </div>
  );
}

/** Accessible two-step destructive confirm (§5.4/§5.5) — replaces window.confirm. */
export function ConfirmButton({ label, confirmLabel = 'Confirm?', onConfirm, className }: { label: string; confirmLabel?: string; onConfirm: () => void | Promise<void>; className?: string }) {
  const [arming, setArming] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!arming) {
    return <button type="button" className={className} onClick={() => setArming(true)}>{label}</button>;
  }
  return (
    <span className="inline-flex items-center gap-1.5" role="alertdialog" aria-live="assertive" aria-label={confirmLabel}>
      <button
        type="button"
        disabled={busy}
        className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[11px] disabled:opacity-50"
        onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); setArming(false); } }}
      >
        {busy ? 'Working…' : confirmLabel}
      </button>
      <button type="button" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]" onClick={() => setArming(false)}>Cancel</button>
    </span>
  );
}

export const REQ_TRANSITIONS: Record<string, string[]> = {
  Draft: ['Pending Approval'], 'Pending Approval': ['Approved', 'Draft'], Approved: ['Sourcing'],
  Sourcing: ['Filled', 'On Hold', 'Cancelled'], 'On Hold': ['Sourcing', 'Cancelled'], Filled: [], Cancelled: [],
};
export const APP_STAGES = ['New', 'Applied', 'Under Review', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Offer', 'Hired', 'Rejected', 'Withdrawn', 'On Hold', 'Job Closed'];
export const LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Discovery Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurture'];

/* ---------------- Requirements workspace (§6.7) ----------------
   Internal hiring demand. Candidates never see this screen or its data —
   only Published, unexpired *jobs* leave the building. */
const REQ_ALL_COLUMNS = [
  { key: 'req', label: 'Requirement' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'openings', label: 'Openings' },
  { key: 'status', label: 'Status' },
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'ageing', label: 'Ageing' },
  { key: 'branch', label: 'Branch' },
  { key: 'manager', label: 'Hiring manager' },
  { key: 'recruiter', label: 'Recruiter' },
  { key: 'employment', label: 'Employment' },
  { key: 'experience', label: 'Experience' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'filled', label: 'Filled' },
  { key: 'created', label: 'Created' },
] as const;
const REQ_DEFAULT_COLUMNS = ['req', 'company', 'location', 'openings', 'status', 'pipeline', 'ageing'];
const REQ_COLS_KEY = 'nexa:req-columns';

function loadVisibleCols(): string[] {
  try {
    const raw = localStorage.getItem(REQ_COLS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((k) => REQ_ALL_COLUMNS.some((c) => c.key === k));
    }
  } catch { /* fall through to defaults */ }
  return [...REQ_DEFAULT_COLUMNS];
}

export function RequisitionsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState({ title: '', department: '', category: '', location: '', branch: '', openings: 1, employmentType: 'Full-time', priority: 'Medium', description: '', responsibilities: '', requiredSkills: '', preferredSkills: '', qualifications: '', budgetMin: '', budgetMax: '', currency: 'INR', payPeriod: 'annual', benefits: '', recruiter: '', experienceMin: '', experienceMax: '', deadline: '' });
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showCols, setShowCols] = useState(false);
  const [visibleCols, setVisibleCols] = useState<string[]>(loadVisibleCols);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadError, setLoadError] = useState(0);
  const [q, setQ] = useQueryState('req_q');
  const [statusF, setStatusF] = useQueryState('req_status');
  const [orgF, setOrgF] = useQueryState('req_org');
  const dq = useDebounced(q);
  const { user } = useAuth();
  const perms = usePermissions();
  const privileged = !!user && ['superadmin', 'platform_owner'].includes(user.role);
  const can = (p: string) => perms === null || perms.includes(p);
  const guard = (r: any, action: string) => checkRecordAction('requirement', r, action, { privileged, can });
  const [pipelineFor, setPipelineFor] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [decideFor, setDecideFor] = useState<{ row: any; action: 'approve' | 'reject' | 'changes' } | null>(null);
    const [assignFor, setAssignFor] = useState<any[]>([]);
  const [assignEmail, setAssignEmail] = useState('');
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, any[] | null>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const emptyForm = { title: '', department: '', category: '', location: '', branch: '', openings: 1, employmentType: 'Full-time', priority: 'Medium', description: '', responsibilities: '', requiredSkills: '', preferredSkills: '', qualifications: '', budgetMin: '', budgetMax: '', currency: 'INR', payPeriod: 'annual', benefits: '', recruiter: '', experienceMin: '', experienceMax: '', deadline: '' };
  const pageSize = 10;

  const buildParams = (p: number) => {
    const sp = new URLSearchParams({ page: String(p), pageSize: String(pageSize) });
    if (statusF) sp.set('status', statusF);
    if (orgF) sp.set('orgId', orgF);
    if (dq.trim()) sp.set('q', dq.trim());
    return sp.toString();
  };
  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      const res: any = await requisitionsApi.list(`?${buildParams(p)}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total ?? unwrapList(res).length));
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      directoryApi.tenants().then((t: any) => setOrgs(unwrapList(t))).catch(() => { /* company filter is best-effort */ });
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page, statusF, orgF, dq ]);
  useEffect(() => { try { localStorage.setItem(REQ_COLS_KEY, JSON.stringify(visibleCols)); } catch { /* noop */ } }, [visibleCols]);

  const refreshRow = (updated: any) => {
    setRows((r) => r.map((x) => (x.id === updated.id ? updated : x)));
    setPipelineFor((d: any) => (d && d.id === updated.id ? updated : d));
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.title.trim()) return;
    setBusy(true);
    try {
      const created = unwrapObj(await requisitionsApi.create({
        ...form,
        openings: Number(form.openings) || 1,
        experienceMin: form.experienceMin === '' ? undefined : Number(form.experienceMin),
        experienceMax: form.experienceMax === '' ? undefined : Number(form.experienceMax),
        budgetMin: form.budgetMin === '' ? undefined : Number(form.budgetMin),
        budgetMax: form.budgetMax === '' ? undefined : Number(form.budgetMax),
        deadline: form.deadline || undefined,
        recruiter: form.recruiter.trim() || undefined,
        branch: form.branch.trim() || undefined,
      }));
      if (created?.id) { setRows((r) => [created, ...r]); setTotal((t) => t + 1); }
      setForm(emptyForm);
      setShowCreate(false);
      setOk('Requirement created as Draft.');
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const transition = async (id: string, status: string, reason?: string) => {
    try {
      const updated = unwrapObj(await requisitionsApi.setStatus(id, status, reason));
      if (updated?.id) refreshRow(updated);
      setOk(`${id} → ${status}.`); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editing) return;
    setBusy(true); setError('');
    try {
      const updated = unwrapObj(await requisitionsApi.update(editing.id, { ...editing, openings: Number(editing.openings) || 1 }));
      if (updated?.id) refreshRow(updated);
      setEditing(null); setOk('Requirement updated.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDelete = async () => {
    if (!deleteFor) return;
    setBusy(true); setError('');
    try {
      await requisitionsApi.remove(deleteFor.id);
      setRows((r) => r.filter((x) => x.id !== deleteFor.id));
      setDeleteFor(null); setOk('Requirement deleted.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const toggleExpand = async (r: any) => {
    if (expanded[r.id] !== undefined) {
      setExpanded((m) => { const n = { ...m }; delete n[r.id]; return n; });
      return;
    }
    setExpanded((m) => ({ ...m, [r.id]: null }));
    try {
      const res: any = await jobsApi.list(`?requisitionId=${r.id}&page=1&pageSize=50`);
      setExpanded((m) => ({ ...m, [r.id]: unwrapList(res) }));
    } catch (e) { setError(errMsg(e)); setExpanded((m) => { const n = { ...m }; delete n[r.id]; return n; }); }
  };
  const openAssign = async (targets: any[]) => {
    setAssignFor(targets); setAssignEmail('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const res: any = await directoryApi.users();
      const all = unwrapList(res);
      setRecruiters(all.filter((u: any) => ['internal_recruiter', 'company_recruiter', 'employee', 'operations_admin'].includes(u.role) && u.status === 'Active'));
    } catch (e) { setError(errMsg(e)); }
  };
  const doAssign = async () => {
    if (assignFor.length === 0 || !assignEmail.trim()) return;
    setBusy(true); setError('');
    try {
      for (const r of assignFor) {
        const updated = unwrapObj(await requisitionsApi.update(r.id, { recruiter: assignEmail.trim() }));
        if (updated?.id) refreshRow(updated);
      }
      setAssignFor([]); setOk(`Recruiter assigned to ${assignFor.length} requirement(s).`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doBulkApprove = async () => {
    const eligible = rows.filter((r) => selected.has(r.id) && r.status === 'Pending Approval');
    if (eligible.length === 0) { setError('Bulk approve applies to Pending Approval rows only.'); return; }
    setBusy(true); setError('');
    try {
      for (const r of eligible) {
        const updated = unwrapObj(await requisitionsApi.setStatus(r.id, 'Approved'));
        if (updated?.id) refreshRow(updated);
      }
      setSelected(new Set()); setOk(`${eligible.length} requirement(s) approved.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const toggleSelect = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleSelectPage = () => {
    const ids = rows.map((r) => r.id);
    const all = ids.every((id) => selected.has(id));
    setSelected((s) => { const n = new Set(s); if (all) ids.forEach((id) => n.delete(id)); else ids.forEach((id) => n.add(id)); return n; });
  };

  const funnel = (r: any) => r.rollup || { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0, applications: 0, interviews: 0, placements: 0, openingsFilled: 0, ageingDays: 0, linkedJobs: [] };
  const ageingTone = (r: any) => {
    const d = funnel(r).ageingDays;
    const open = !['Filled', 'Cancelled'].includes(r.status);
    if (!open) return null;
    if (d > 30) return { label: `${d}d — breaching`, cls: 'bg-red-50 text-red-700 border-red-200' };
    if (d > 14) return { label: `${d}d — watch`, cls: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: `${d}d`, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  };
  const cellFor = (r: any, key: string): React.ReactNode => {
    const f = funnel(r);
    switch (key) {
      case 'req': return (<><div className="font-bold text-slate-900">{r.title}</div><div className="font-mono text-[11px] text-slate-500">{r.id}</div></>);
      case 'company': return <span className="font-mono font-bold text-amber-700">{r.orgId}</span>;
      case 'location': return r.location || r.city || '—';
      case 'openings': return <span className="font-bold">{r.openings || 1} <span className="text-slate-400 font-medium">({f.openingsFilled} filled)</span></span>;
      case 'status': return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{r.status}</span>;
      case 'pipeline': return (
        <span className="inline-flex items-center gap-1 font-bold" title={`Applied ${f.applied} → Screening ${f.screening} → Interview ${f.interview} → Offer ${f.offer} → Hired ${f.hired}`}>
          <span className="text-slate-700">{f.applications} apps</span>
          <span className="text-slate-300">→</span>
          <span className="text-emerald-700">{f.hired} hired</span>
        </span>
      );
      case 'ageing': { const a = ageingTone(r); return a ? <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${a.cls}`}>{a.label}</span> : <span className="text-slate-400">—</span>; }
      case 'branch': return r.branch || '—';
      case 'manager': return r.hiringManager || '—';
      case 'recruiter': return r.recruiter || <span className="text-amber-600 font-bold">Unassigned</span>;
      case 'employment': return r.employmentType || '—';
      case 'experience': return (r.experienceMin !== undefined || r.experienceMax !== undefined) ? `${r.experienceMin ?? '—'}–${r.experienceMax ?? '—'}y` : '—';
      case 'interviews': return <span className="font-bold">{f.interviews}</span>;
      case 'filled': return <span className="font-bold">{f.openingsFilled}/{r.openings || 1}</span>;
      case 'created': return <span className="text-slate-500">{String(r.createdAt || '').slice(0, 10) || '—'}</span>;
      default: return '—';
    }
  };
  const reqMenuFor = (r: any) => (
    <RowMenu items={[
      { label: 'Open pipeline', onSelect: () => setPipelineFor(r) },
      ...(guard(r, 'edit').allowed ? [{ label: 'Edit…', onSelect: () => setEditing({ ...r }) }] : []),
      ...(r.status === 'Pending Approval' ? [
        { label: 'Approve', onSelect: () => { setDecideFor({ row: r, action: 'approve' }); } },
        { label: 'Reject…', danger: true, onSelect: () => { setDecideFor({ row: r, action: 'reject' }); } },
        { label: 'Request changes…', onSelect: () => { setDecideFor({ row: r, action: 'changes' }); } },
      ] : []),
      ...(REQ_TRANSITIONS[r.status] || []).filter((s) => !(['Approved', 'Cancelled', 'Draft'].includes(s) && r.status === 'Pending Approval')).map((s) => ({ label: `Move to ${s}`, onSelect: () => transition(r.id, s) })),
      { label: 'Assign recruiter…', onSelect: () => openAssign([r]) },
      ...(guard(r, 'delete').allowed ? [{ label: 'Delete…', danger: true, onSelect: () => setDeleteFor(r) }] : []),
    ]} />
  );
  const cols = REQ_ALL_COLUMNS.filter((c) => visibleCols.includes(c.key));

  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-extrabold text-slate-900">Requirements — internal hiring demand</h3>
        <p className="text-xs text-slate-500 font-medium">One requirement → many job postings. Candidates never see this screen; only Published, unexpired jobs leave the building.</p>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page)} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1"><input className={inputCls} placeholder="Search ID, title, department, manager…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="flex gap-2">
          <div className="w-44 shrink-0">
            <Select value={statusF} onChange={setStatusF} ariaLabel="Requirement status filter" placeholder="All statuses"
              options={[{ value: '', label: 'All statuses' }, ...['Draft', 'Pending Approval', 'Approved', 'Sourcing', 'On Hold', 'Filled', 'Cancelled'].map((s) => ({ value: s, label: s }))]} />
          </div>
          {orgs.length > 0 && (
            <div className="w-48 shrink-0">
              <Select value={orgF} onChange={setOrgF} ariaLabel="Company filter" placeholder="All companies"
                options={[{ value: '', label: 'All companies' }, ...orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id}` }))]} />
            </div>
          )}
          <div className="relative shrink-0">
            <button type="button" onClick={() => setShowCols((v) => !v)} aria-expanded={showCols} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs h-full">Columns ▾</button>
            {showCols && (
              <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-0.5 max-h-72 overflow-y-auto" data-lenis-prevent>
                {REQ_ALL_COLUMNS.map((c) => (
                  <label key={c.key} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={visibleCols.includes(c.key)} onChange={() => setVisibleCols((v) => v.includes(c.key) ? v.filter((k) => k !== c.key) : [...v, c.key])} className="w-3.5 h-3.5 accent-[#087BFF]" />
                    {c.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <ExportButton filename="requirements.csv" rows={rows} columns={['id', 'title', 'orgId', 'department', 'location', 'branch', 'hiringManager', 'recruiter', 'employmentType', 'experienceMin', 'experienceMax', 'openings', 'status', 'createdAt']} />
          <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New requirement</button>
        </div>
      </div>
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold" role="toolbar" aria-label="Bulk actions">
          <span className="text-blue-900">{selected.size} selected</span>
          <button type="button" disabled={busy} onClick={doBulkApprove} className="px-3 py-1.5 rounded-lg bg-[#087BFF] text-white disabled:opacity-50">Approve eligible</button>
          <button type="button" onClick={() => openAssign(rows.filter((r) => selected.has(r.id)))} className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-800">Assign recruiter…</button>
          <ExportButton filename="requirements-selected.csv" rows={rows.filter((r) => selected.has(r.id))} columns={['id', 'title', 'orgId', 'openings', 'status']} label="Export selected" />
          <button type="button" onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg text-slate-500">Clear</button>
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New requirement" subtitle="Internal demand — Draft → Pending Approval → Approved → Sourcing" wide>
        <form onSubmit={create} className="space-y-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Basics</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Field label="Requirement title *"><input className={kitInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior QA Automation Engineer" /></Field></div>
              <Field label="Department"><input className={kitInput} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Field>
              <Field label="Category"><input className={kitInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
              <Field label="Location"><input className={kitInput} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
              <Field label="Branch"><input className={kitInput} value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="e.g. Bengaluru HQ" /></Field>
              <Field label="Employment type"><input className={kitInput} value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} /></Field>
              <Field label="Priority"><Select value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={['Low', 'Medium', 'High', 'Critical'].map((p) => ({ value: p, label: p }))} /></Field>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Role details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Field label="Role description"><input className={kitInput} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Responsibilities, must-haves…" /></Field></div>
              <div className="sm:col-span-2"><Field label="Responsibilities"><textarea rows={2} className={kitInput} value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} placeholder="Day-to-day scope…" /></Field></div>
              <Field label="Required skills (comma separated)"><input className={kitInput} value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} placeholder="React, Node.js, AWS" /></Field>
              <Field label="Preferred skills"><input className={kitInput} value={form.preferredSkills} onChange={(e) => setForm({ ...form, preferredSkills: e.target.value })} /></Field>
              <div className="sm:col-span-2"><Field label="Qualifications"><input className={kitInput} value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} placeholder="Degree, certifications…" /></Field></div>
              <Field label="Min experience (yrs)"><input className={kitInput} type="number" min={0} value={form.experienceMin} onChange={(e) => setForm({ ...form, experienceMin: e.target.value })} /></Field>
              <Field label="Max experience (yrs)"><input className={kitInput} type="number" min={0} value={form.experienceMax} onChange={(e) => setForm({ ...form, experienceMax: e.target.value })} /></Field>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Compensation</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Min budget / CTC"><input className={kitInput} type="number" min={0} value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} /></Field>
              <Field label="Max budget / CTC"><input className={kitInput} type="number" min={0} value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} /></Field>
              <Field label="Currency"><Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={['INR', 'USD', 'EUR', 'GBP', 'AED'].map((c) => ({ value: c, label: c }))} /></Field>
              <Field label="Pay period"><Select value={form.payPeriod} onChange={(v) => setForm({ ...form, payPeriod: v })} options={[{ value: 'annual', label: 'Annual' }, { value: 'monthly', label: 'Monthly' }, { value: 'hourly', label: 'Hourly' }]} /></Field>
              <div className="sm:col-span-2"><Field label="Benefits"><input className={kitInput} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Insurance, ESOPs, hybrid…" /></Field></div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Timeline & ownership</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Openings"><input className={kitInput} type="number" min={1} value={form.openings} onChange={(e) => setForm({ ...form, openings: Number(e.target.value) })} /></Field>
              <Field label="Target deadline"><DatePicker value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} ariaLabel="Target deadline" /></Field>
              <div className="sm:col-span-2"><Field label="Recruiter (email)"><input className={kitInput} value={form.recruiter} onChange={(e) => setForm({ ...form, recruiter: e.target.value })} placeholder="recruiter@company.com" /></Field></div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 mt-1">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs mt-3">Cancel</button>
            <button className={`${btnPrimary} mt-3`} disabled={busy || !form.title.trim()}>{busy ? 'Creating…' : 'Create requirement'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading requirements…" /> : rows.length === 0 ? (
        <EmptyState title="No requirements" message="Create the first hiring requirement to start the approval flow." />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {rows.map((r) => {
            const f = funnel(r);
            return (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{r.title}</div>
                  <div className="font-mono text-[11px] text-slate-500">{r.id} • {r.openings || 1} opening(s) • {f.openingsFilled} filled</div>
                </div>
                {reqMenuFor(r)}
              </div>
              <div><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{r.status}</span></div>
              <div className="font-bold text-slate-700">{f.applications} apps → {f.hired} hired</div>
              <div className="text-slate-600 font-medium">{r.department || '—'} • {r.location || '—'}</div>
            </div>
            );
          })}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[980px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-2 py-3 w-8"><input type="checkbox" aria-label="Select page" checked={rows.length > 0 && rows.every((r) => selected.has(r.id))} onChange={toggleSelectPage} className="w-3.5 h-3.5 accent-[#087BFF]" /></th>
              <th className="px-2 py-3 w-8" aria-label="Expand" />
              {cols.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <Fragment key={r.id}>
                <tr className="hover:bg-slate-50/70">
                  <td className="px-2 py-3"><input type="checkbox" aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="w-3.5 h-3.5 accent-[#087BFF]" /></td>
                  <td className="px-2 py-3">
                    <button type="button" onClick={() => toggleExpand(r)} aria-expanded={expanded[r.id] !== undefined} aria-label={expanded[r.id] !== undefined ? 'Collapse linked jobs' : 'Expand linked jobs'} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 font-bold">
                      {expanded[r.id] !== undefined ? '▾' : '▸'}
                    </button>
                  </td>
                  {cols.map((c) => <td key={c.key} className="px-4 py-3">{cellFor(r, c.key)}</td>)}
                  <td className="px-4 py-3"><div className="flex justify-end">{reqMenuFor(r)}</div></td>
                </tr>
                {(() => { const linked = expanded[r.id]; return linked !== undefined && (
                  <tr key={`${r.id}-jobs`} className="bg-blue-50/40">
                    <td colSpan={cols.length + 3} className="px-8 py-2">
                      {linked === null ? <InlineLoading message="Loading linked jobs…" /> : linked.length === 0 ? (
                        <span className="text-[11px] text-slate-500 font-medium">No job postings yet under this requirement.</span>
                      ) : (
                        <div className="space-y-1 py-1">
                          {linked.map((j: any) => (
                            <div key={j.id} className="flex items-center justify-between gap-2 text-[11px] font-semibold">
                              <span className="truncate"><span className="font-mono text-slate-500">{j.id}</span> • <strong>{j.title}</strong></span>
                              <span className="flex items-center gap-2 shrink-0">
                                <span className="text-slate-500">{j.applicantsCount ?? 0} apps</span>
                                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold">{j.status}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ); })()}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      {pipelineFor && <RequirementPipeline reqId={pipelineFor.id} onClose={() => { setPipelineFor(null); load(page); }}
        onDecide={(row, action) => setDecideFor({ row, action })}
        onEdit={(row) => setEditing({ ...row })} onAssign={(rows) => openAssign(rows)} onDelete={(row) => setDeleteFor(row)} />}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit requirement — ${editing?.id || ''}`} subtitle="Only Draft / Pending Approval can be edited" wide>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Title"><input className={kitInput} value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field></div>
          <Field label="Department"><input className={kitInput} value={editing?.department || ''} onChange={(e) => setEditing({ ...editing, department: e.target.value })} /></Field>
          <Field label="Location"><input className={kitInput} value={editing?.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
          <Field label="Branch"><input className={kitInput} value={editing?.branch || ''} onChange={(e) => setEditing({ ...editing, branch: e.target.value })} /></Field>
          <Field label="Recruiter (email)"><input className={kitInput} value={editing?.recruiter || ''} onChange={(e) => setEditing({ ...editing, recruiter: e.target.value })} /></Field>
          <Field label="Openings"><input className={kitInput} type="number" min={1} value={editing?.openings || 1} onChange={(e) => setEditing({ ...editing, openings: Number(e.target.value) })} /></Field>
          <Field label="Priority"><Select value={editing?.priority || 'Medium'} onChange={(v) => setEditing({ ...editing, priority: v })} options={['Low', 'Medium', 'High', 'Critical'].map((p) => ({ value: p, label: p }))} /></Field>
          <Field label="Min experience"><input className={kitInput} type="number" min={0} value={editing?.experienceMin ?? ''} onChange={(e) => setEditing({ ...editing, experienceMin: e.target.value === '' ? undefined : Number(e.target.value) })} /></Field>
          <Field label="Max experience"><input className={kitInput} type="number" min={0} value={editing?.experienceMax ?? ''} onChange={(e) => setEditing({ ...editing, experienceMax: e.target.value === '' ? undefined : Number(e.target.value) })} /></Field>
          <Field label="Deadline"><DatePicker value={String(editing?.deadline || '').slice(0, 10)} onChange={(v) => setEditing({ ...editing, deadline: v })} ariaLabel="Target deadline" /></Field>
          <Field label="Min budget / CTC"><input className={kitInput} type="number" min={0} value={editing?.budgetMin ?? ''} onChange={(e) => setEditing({ ...editing, budgetMin: e.target.value === '' ? undefined : Number(e.target.value) })} /></Field>
          <Field label="Max budget / CTC"><input className={kitInput} type="number" min={0} value={editing?.budgetMax ?? ''} onChange={(e) => setEditing({ ...editing, budgetMax: e.target.value === '' ? undefined : Number(e.target.value) })} /></Field>
          <Field label="Currency"><Select value={editing?.currency || 'INR'} onChange={(v) => setEditing({ ...editing, currency: v })} options={['INR', 'USD', 'EUR', 'GBP', 'AED'].map((c) => ({ value: c, label: c }))} /></Field>
          <Field label="Pay period"><Select value={editing?.payPeriod || 'annual'} onChange={(v) => setEditing({ ...editing, payPeriod: v })} options={[{ value: 'annual', label: 'Annual' }, { value: 'monthly', label: 'Monthly' }, { value: 'hourly', label: 'Hourly' }]} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><input className={kitInput} value={editing?.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Responsibilities"><textarea rows={2} className={kitInput} value={editing?.responsibilities || ''} onChange={(e) => setEditing({ ...editing, responsibilities: e.target.value })} /></Field></div>
          <Field label="Required skills"><input className={kitInput} value={editing?.requiredSkills || ''} onChange={(e) => setEditing({ ...editing, requiredSkills: e.target.value })} /></Field>
          <Field label="Preferred skills"><input className={kitInput} value={editing?.preferredSkills || ''} onChange={(e) => setEditing({ ...editing, preferredSkills: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Qualifications"><input className={kitInput} value={editing?.qualifications || ''} onChange={(e) => setEditing({ ...editing, qualifications: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Benefits"><input className={kitInput} value={editing?.benefits || ''} onChange={(e) => setEditing({ ...editing, benefits: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy} onClick={saveEdit} className={btnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </Modal>
      <ActionConfirm open={decideFor !== null} onCancel={() => setDecideFor(null)}
        title={decideFor?.action === 'approve' ? `Approve ${decideFor?.row.id || ''}` : decideFor?.action === 'reject' ? `Reject ${decideFor?.row.id || ''}` : `Request changes — ${decideFor?.row.id || ''}`}
        subtitle={`${decideFor?.row.title || ''} • currently ${decideFor?.row.status || ''}`}
        why={['Requirement is in Pending Approval', 'You are deciding as an authorized reviewer']}
        steps={decideFor?.action === 'approve'
          ? ['Status moves to Approved', 'Hiring manager and recruiter are notified', 'Jobs can now be published under it']
          : decideFor?.action === 'reject'
            ? ['Status moves to Cancelled with your reason', 'Hiring manager is notified', 'Record stays auditable; delete allowed once linked jobs are cleared']
            : ['Status moves back to Draft', 'Your note is stored in history and sent to the hiring manager', 'Record can be resubmitted after rework']}
        locks={decideFor?.action === 'approve'
          ? ['Approved requirements lock editing for non-platform roles']
          : decideFor?.action === 'reject'
            ? ['Cancelled requirements accept no further transitions']
            : ['Sourcing cannot start until re-approved']}
        requireReason={decideFor?.action !== 'approve'} reasonLabel={decideFor?.action === 'reject' ? 'Rejection reason *' : 'Change note *'}
        confirmLabel={decideFor?.action === 'approve' ? 'Approve' : decideFor?.action === 'reject' ? 'Reject' : 'Send for rework'}
        tone={decideFor?.action === 'reject' ? 'danger' : 'primary'}
        onConfirm={async (reason) => {
          if (!decideFor) return;
          const { row, action } = decideFor;
          if (action === 'approve') await transition(row.id, 'Approved');
          else if (action === 'reject') await transition(row.id, 'Cancelled', reason);
          else {
            const updated = unwrapObj(await requisitionsApi.requestChanges(row.id, (reason || '').trim()));
            if (updated?.id) refreshRow(updated);
            setOk(`${row.id} sent back to Draft with change note.`); syncAll();
          }
          setDecideFor(null);
        }} />
      <Modal open={assignFor.length > 0} onClose={() => setAssignFor([])} title={`Assign recruiter — ${assignFor.length} requirement(s)`} subtitle="Workload shows open requirements already owned">
        <div className="space-y-2 max-h-64 overflow-y-auto" data-lenis-prevent>
          {recruiters.length === 0 && <div className="text-[11px] text-slate-500 font-medium">No active recruiters found.</div>}
          {recruiters.map((u) => {
            const load = rows.filter((r) => r.recruiter === u.email && !['Filled', 'Cancelled'].includes(r.status)).length;
            return (
              <button key={u.id} type="button" onClick={() => setAssignEmail(u.email)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${assignEmail === u.email ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200'}`}>
                <span className="truncate">{u.name} • <span className="text-slate-500">{u.email}</span></span>
                <span className={`shrink-0 ${load > 5 ? 'text-red-600' : 'text-emerald-600'}`}>{load} open</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <button type="button" onClick={() => setAssignFor([])} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
          <button type="button" disabled={busy || !assignEmail.trim()} onClick={doAssign} className={btnPrimary}>{busy ? 'Assigning…' : 'Assign'}</button>
        </div>
      </Modal>
      <ActionConfirm open={deleteFor !== null} onCancel={() => setDeleteFor(null)}
        title={`Delete ${deleteFor?.id || ''}`}
        subtitle={deleteFor?.title || ''}
        why={['Requirement is in Draft / Cancelled', `No linked job postings (${deleteFor?.rollup?.linkedJobs?.length ?? 0} found)`]}
        steps={['Record is removed permanently', 'An audit entry is preserved']}
        consequences={['Linked jobs must already be cleared — the server re-checks this']}
        confirmLabel="Delete permanently" tone="danger" onConfirm={doDelete} />
    </div>
  );
}

/* ---------------- Requirement pipeline drawer ---------------- */
const FUNNEL_STEPS = ['applied', 'screening', 'interview', 'offer', 'hired'] as const;
const FUNNEL_LABELS: Record<string, string> = { applied: 'Applied', screening: 'Screening', interview: 'Interview', offer: 'Offer', hired: 'Hired' };

export function RequirementPipeline({ reqId, onClose, onDecide, onEdit, onAssign, onDelete }: {
  reqId: string; onClose: () => void;
  onDecide: (row: any, action: 'approve' | 'reject' | 'changes') => void;
  onEdit: (row: any) => void; onAssign: (rows: any[]) => void; onDelete: (row: any) => void;
}) {
  const [data, setData] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const gApprove = useActionGuard('requirement', data, 'approve');
  const gEdit = useActionGuard('requirement', data, 'edit');
  const gDelete = useActionGuard('requirement', data, 'delete');
  const gAssign = useActionGuard('requirement', data, 'assign');
  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const [rRes, iRes] = await Promise.all([
          requisitionsApi.list(`?page=1&pageSize=100`),
          interviewsApi.list(`?requisitionId=${reqId}`),
        ]);
        const row = unwrapList(rRes).find((r: any) => r.id === reqId);
        if (!row) throw new Error('Requirement no longer exists.');
        setData(row);
        setInterviews(unwrapList(iRes).filter((i: any) => ['Scheduled', 'Rescheduled'].includes(i.status)).slice(0, 10));
      } catch (e) { setError(errMsg(e)); }
      finally { setLoading(false); }
    })();
  }, [reqId]);
  const f = data?.rollup || { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0, applications: 0, interviews: 0, openingsFilled: 0, ageingDays: 0, linkedJobs: [] };
  const max = Math.max(1, f.applied);
  const lockNotes = [
    !gApprove.allowed && gApprove.reason,
    !gEdit.allowed && gEdit.reason,
    !gDelete.allowed && gDelete.reason,
  ].filter(Boolean) as string[];
  return (
    <DetailDrawer title={data?.title || reqId} subtitle={`${reqId} • ${data?.status || ''} • ${f.openingsFilled}/${data?.openings || 1} filled`} onClose={onClose} width="max-w-4xl">
      {loading ? <InlineLoading message="Loading pipeline…" /> : error ? (
        <PanelError message={error} onRetry={() => window.location.reload()} />
      ) : (
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200" role="toolbar" aria-label="Requirement actions">
            {gApprove.allowed && <button type="button" onClick={() => onDecide(data, 'approve')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">Approve</button>}
            {gApprove.allowed && <button type="button" onClick={() => onDecide(data, 'reject')} className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold">Reject…</button>}
            {gApprove.allowed && <button type="button" onClick={() => onDecide(data, 'changes')} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold">Request changes…</button>}
            {gEdit.allowed && <button type="button" onClick={() => onEdit(data)} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold">Edit…</button>}
            {gAssign.allowed && <button type="button" onClick={() => onAssign([data])} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold">Assign recruiter…</button>}
            {gDelete.allowed && <button type="button" onClick={() => onDelete(data)} className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 font-bold">Delete…</button>}
            {lockNotes.length > 0 && (
              <div className="w-full space-y-1 pt-1 border-t border-slate-200">
                {lockNotes.map((n) => <div key={n} className="text-[11px] font-bold text-amber-700">🔒 {n}</div>)}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[['Owner', data?.hiringManager || '—'], ['Recruiter', data?.recruiter || 'Unassigned'], ['Deadline', String(data?.deadline || '').slice(0, 10) || '—']].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 truncate">{String(v ?? '—')}</div></div>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Role profile</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[['Department / Category', [data?.department, data?.category].filter(Boolean).join(' • ') || '—'], ['Location / Branch', [data?.location, data?.branch].filter(Boolean).join(' • ') || '—'], ['Employment', data?.employmentType || '—'], ['Experience', (data?.experienceMin !== undefined || data?.experienceMax !== undefined) ? `${data?.experienceMin ?? '—'}–${data?.experienceMax ?? '—'} yrs` : '—'], ['Budget', (data?.budgetMin || data?.budgetMax) ? `${data?.currency || 'INR'} ${data?.budgetMin ?? '—'}–${data?.budgetMax ?? '—'} ${data?.payPeriod || ''}` : '—'], ['Priority', data?.priority || '—']].map(([k, v]) => (
                <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1">{String(v ?? '—')}</div></div>
              ))}
              {[['Description', data?.description], ['Responsibilities', data?.responsibilities], ['Required skills', data?.requiredSkills], ['Preferred skills', data?.preferredSkills], ['Qualifications', data?.qualifications], ['Benefits', data?.benefits]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k as string} className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-medium mt-1 whitespace-pre-wrap">{String(v)}</div></div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Hiring funnel — live counts</div>
            <div className="flex items-stretch gap-1" role="img" aria-label={`Funnel: ${FUNNEL_STEPS.map((s) => `${FUNNEL_LABELS[s]} ${f[s]}`).join(', ')}`}>
              {FUNNEL_STEPS.map((s, i) => (
                <div key={s} className="flex-1 min-w-0">
                  <div className="text-center font-extrabold text-sm">{f[s]}</div>
                  <div className={`h-2 rounded-full ${f[s] > 0 ? 'bg-[#087BFF]' : 'bg-slate-200'}`} style={{ opacity: 0.45 + (0.55 * f[s]) / max }} />
                  <div className="text-center text-[10px] font-bold text-slate-500 mt-1 truncate">{FUNNEL_LABELS[s]}</div>
                  {i < FUNNEL_STEPS.length - 1 && <div className="hidden" />}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Linked jobs ({(f.linkedJobs || []).length})</div>
            {(f.linkedJobs || []).length === 0 ? <div className="text-[11px] text-slate-500">No postings yet.</div> : (
              <div className="space-y-1.5">
                {f.linkedJobs.map((j: any) => (
                  <div key={j.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0"><div className="font-bold truncate">{j.title}</div><div className="font-mono text-[10px] text-slate-500">{j.id}</div></div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold">{j.counts.applications} apps → {j.counts.hired} hired</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-[10px]">{j.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Upcoming interviews ({interviews.length})</div>
            {interviews.length === 0 ? <div className="text-[11px] text-slate-500">None scheduled.</div> : (
              <div className="space-y-1.5">
                {interviews.map((iv: any) => (
                  <div key={iv.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold">
                    {iv.candidateName || iv.candidateEmail} • {iv.round || ''} • {String(iv.scheduledAt || '').slice(0, 16).replace('T', ' ')}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Activity</div>
            <div className="space-y-1.5">
              {[...(data?.changeRequests || []).map((c: any) => ({ at: c.at, text: `Changes requested by ${c.by}: ${c.note}` })), ...(data?.history || []).map((h: any) => ({ at: h.at, text: `${h.from} → ${h.to} by ${h.by}${h.reason ? `: ${h.reason}` : ''}` }))].reverse().slice(0, 20).map((e: any, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">{e.text} <span className="text-slate-400">• {String(e.at || '').slice(0, 16).replace('T', ' ')}</span></div>
              ))}
              {((data?.changeRequests || []).length === 0 && (data?.history || []).length === 0) && <div className="text-[11px] text-slate-500">No recorded transitions yet.</div>}
            </div>
          </div>
        </div>
      )}
    </DetailDrawer>
  );
}

/* ---------------- Phase 1/2: Applications (ATS) ---------------- */
export function ApplicationsPanel({ compact = false }: { compact?: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedFilter, setAppliedFilter] = useQueryState('app_stage');
  const [filter, setFilter] = useState(appliedFilter);
  const [reason, setReason] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [withdrawId, setWithdrawId] = useState('');
  const [loadError, setLoadError] = useState(0);
  const [q, setQ] = useQueryState('app_q');
  const dqApp = useDebounced(q);
  const [detail, setDetail] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [reopenFor, setReopenFor] = useState<any>(null);
  const [reopenTarget, setReopenTarget] = useState('Applied');
  const pageSize = 10;

  const load = async (p = page, f = appliedFilter) => {
    setLoading(true); setError('');
    try {
      const res: any = await applicationsApi.list(`?page=${p}&pageSize=${pageSize}${f ? `&status=${encodeURIComponent(f)}` : ''}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page, appliedFilter); }, [page, appliedFilter]);

  const move = async (id: string, stage: string) => {
    try {
      const updated = unwrapObj(await applicationsApi.setStage(id, stage, reason || undefined));
      setRows((r) => r.map((x) => (x.id === id ? updated : x)));
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const withdraw = async (id: string, reasonText?: string) => {
    try {
      const updated = unwrapObj(await applicationsApi.withdraw(id, reasonText || reason || undefined));
      setRows((r) => r.map((x) => (x.id === id ? updated : x)));
      if (detail?.id === id && updated?.id) setDetail(updated);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const reopen = async (app: any, target: string, reasonText?: string) => {
    const updated = unwrapObj(await applicationsApi.reopen(app.id, target, reasonText || ''));
    setRows((r) => r.map((x) => (x.id === app.id ? updated : x)));
    if (detail?.id === app.id && updated?.id) setDetail(updated);
    const hRes: any = await apiClient.get(`/api/v1/applications/${app.id}/history`).catch(() => null);
    const h = (hRes as { data?: any[] })?.data || [];
    if (detail?.id === app.id && Array.isArray(h)) setHistory(h);
    setReopenFor(null);
    syncAll();
  };

  const filteredApps = rows.filter((a) => !dqApp.trim() || `${a.id} ${a.jobTitle} ${a.candidateEmail}`.toLowerCase().includes(dqApp.toLowerCase()));
  const openDetail = async (a: any) => {
    setDetail(a); setHistory([]);
    try {
      const res: any = await apiClient.get(`/api/v1/applications/${a.id}/history`);
      const h = (res as { data?: any[] })?.data || [];
      setHistory(Array.isArray(h) ? h : []);
    } catch { setHistory([]); }
  };
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Application Pipeline — View / Move / Withdraw / Export</h3>
          <div className="flex gap-2 items-center">
            <div style={{ width: 170 }}>
              <Select value={filter} onChange={setFilter} ariaLabel="Filter by stage" placeholder="All stages" options={[{ value: '', label: 'All stages' }, ...APP_STAGES.map((s) => ({ value: s, label: s }))]} />
            </div>
            <button type="button" className={btnDark} onClick={() => { setPage(1); setAppliedFilter(filter); }}>Filter</button>
            <ExportButton filename="applications.csv" rows={filteredApps} columns={['id', 'jobTitle', 'jobId', 'candidateEmail', 'stage']} />
          </div>
        </div>
        <input className={inputCls} placeholder="Search job title, candidate email, application ID…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page, appliedFilter)} />}
      {!compact && (
        <input className={inputCls} placeholder="Reason / note attached to next stage move (required when rejecting)" value={reason} onChange={(e) => setReason(e.target.value)} />
      )}
      {loading ? <InlineLoading message="Loading applications…" /> : filteredApps.length === 0 ? (
        <EmptyState title="No applications" message="Applications appear here once candidates apply or agencies submit." />
      ) : (
        <div className="space-y-2">
          {filteredApps.map((a) => {
            const moves = ['Shortlisted', 'Interview Scheduled', 'Offer', 'Hired', 'Rejected', 'Withdrawn', 'On Hold'].filter((s) => s !== a.stage).slice(0, 5);
            const canWithdraw = !['Hired', 'Withdrawn', 'Rejected'].includes(a.stage);
            return (
            <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 text-sm truncate">{a.jobTitle || a.jobId}</div>
                <div className="text-xs text-slate-500 font-medium">{a.id} • {a.candidateEmail} • <strong className="text-blue-600">{a.stage}</strong> • applied {String(a.createdAt || '').slice(0, 10) || '—'}</div>
              </div>
              <RowMenu items={[
                { label: 'View + history', onSelect: () => openDetail(a) },
                ...moves.map((s) => ({ label: `Move to ${s}`, onSelect: () => move(a.id, s) })),
                ...(canWithdraw ? [{ label: 'Withdraw application', danger: true, onSelect: () => setWithdrawId(a.id) }] : []),
                ...(checkRecordAction('application', a, 'reopen', {}).allowed ? [{ label: 'Reopen…', onSelect: () => { setReopenFor(a); setReopenTarget('Applied'); } }] : []),
              ]} />
            </div>
            );
          })}
        </div>
      )}
      <ConfirmDialog
        open={withdrawId !== ''}
        title="Withdraw application"
        body="The stage moves to Withdrawn, the interview chat closes, and the full history is preserved. Continue?"
        confirmLabel="Withdraw"
        requireReason="Reason (optional)"
        onConfirm={async (reasonText) => {
          await withdraw(withdrawId, reasonText || reason || undefined);
          setWithdrawId('');
        }}
        onCancel={() => setWithdrawId('')}
      />
      <ActionConfirm
        open={reopenFor !== null}
        onCancel={() => setReopenFor(null)}
        title={`Reopen ${reopenFor?.id || ''}`}
        subtitle={`${reopenFor?.jobTitle || ''} • ${reopenFor?.candidateEmail || ''}`}
        why={[`Application is currently ${reopenFor?.stage || ''} (terminal)`, 'Reopening returns it to an active stage — history is preserved']}
        steps={[`Move back to ${reopenTarget}`, 'Closed interview chat reopens automatically', 'Event recorded with actor + timestamp']}
        consequences={['Candidate becomes visible in the active pipeline again']}
        extra={<Field label="Reopen to"><Select value={reopenTarget} onChange={setReopenTarget} options={['Applied', 'Shortlisted'].map((v) => ({ value: v, label: v }))} /></Field>}
        requireReason
        reasonLabel="Reopen reason *"
        confirmLabel={`Reopen to ${reopenTarget}`}
        tone="dark"
        onConfirm={async (r) => { if (reopenFor) await reopen(reopenFor, reopenTarget, r); }}
      />
      <Modal open={detail !== null} onClose={() => setDetail(null)} title={`${detail?.jobTitle || detail?.jobId || ''}`} subtitle={`${detail?.id || ''} • ${detail?.candidateEmail || ''} • ${detail?.stage || ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Application', detail?.id], ['Job', `${detail?.jobTitle || ''} (${detail?.jobId || ''})`], ['Candidate', detail?.candidateEmail], ['Stage', detail?.stage], ['Source', detail?.source], ['Updated', String(detail?.updatedAt || '').slice(0, 10)]].map(([k, v]) => (
            <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
          ))}
        </div>
        {checkRecordAction('application', detail, 'reopen', {}).allowed && (
          <button type="button" onClick={() => { setReopenFor(detail); setReopenTarget('Applied'); }} className="px-4 py-2 rounded-xl bg-spec-navy text-white font-bold text-xs w-fit">Reopen application…</button>
        )}
        <div className="text-xs font-extrabold pt-1">Stage history ({history.length})</div>
        {history.length === 0 ? <div className="text-[11px] text-slate-500">No history rows yet.</div> : history.map((h: any) => (
          <div key={h.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">{h.from} → <strong>{h.to}</strong> • by {h.actor} • <span className="text-slate-500">{String(h.createdAt || '').slice(0, 16).replace('T', ' ')}</span>{h.reason ? <div className="text-slate-600">{h.reason}</div> : null}</div>
        ))}
      </Modal>
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
    </div>
  );
}

/* ---------------- Phase 2: Interviews ---------------- */
export function InterviewsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState(0);
  const [form, setForm] = useState({ applicationId: '', jobId: '', round: 'Technical Round 1', date: '', hour: '10', minute: '00', mode: 'video', interviewer: '', meetingLink: '', venue: '', instructions: '' });
  const [busy, setBusy] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [resched, setResched] = useState({ id: '', date: '', hour: '10', minute: '00', reason: '' });
  const [cancelId, setCancelId] = useState('');
  const emptyForm = { applicationId: '', jobId: '', round: 'Technical Round 1', date: '', hour: '10', minute: '00', mode: 'video', interviewer: '', meetingLink: '', venue: '', instructions: '' };
  const HOURS = Array.from({ length: 24 }, (_, h) => ({ value: `${h}`.padStart(2, '0'), label: `${h}`.padStart(2, '0') }));
  const MINUTES = ['00', '15', '30', '45'].map((m) => ({ value: m, label: m }));

  const load = async () => {
    setLoading(true); setError('');
    try { setRows(unwrapList(await interviewsApi.list())); }
    catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const schedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicationId.trim() || !form.jobId.trim() || !form.date) { setError('Application, job and date are required.'); return; }
    setBusy(true);
    try {
      const created = unwrapObj(await interviewsApi.schedule({ ...form, scheduledAt: `${form.date}T${form.hour}:${form.minute}:00`, timezone: 'Asia/Kolkata' }));
      if (created?.id) setRows((r) => [created, ...r]);
      setForm(emptyForm);
      setShowSchedule(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const confirmReschedule = async (id: string) => {
    if (!resched.date) { setError('Pick a new date.'); return; }
    try {
      const u = unwrapObj(await interviewsApi.reschedule(id, { scheduledAt: `${resched.date}T${resched.hour}:${resched.minute}:00`, reason: resched.reason || undefined }));
      setRows((r) => r.map((x) => (x.id === id ? u : x))); setResched({ id: '', date: '', hour: '10', minute: '00', reason: '' }); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };

  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Interviews — Schedule & Track</h3>
        <button type="button" onClick={() => setShowSchedule(true)} className={btnPrimary}>+ Schedule</button>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={load} />}
      <Modal open={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule interview" subtitle="Scheduling auto-enables the application chat">
        <form onSubmit={schedule} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Application ID *"><input className={kitInput} value={form.applicationId} onChange={(e) => setForm({ ...form, applicationId: e.target.value })} /></Field>
          <Field label="Job ID *"><input className={kitInput} value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })} /></Field>
          <Field label="Round"><input className={kitInput} value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} /></Field>
          <Field label="Mode"><Select value={form.mode} onChange={(v) => setForm({ ...form, mode: v })} options={[{ value: 'video', label: 'Video' }, { value: 'phone', label: 'Phone' }, { value: 'onsite', label: 'Onsite' }]} /></Field>
          <Field label="Date *"><DatePicker value={form.date} onChange={(v) => setForm({ ...form, date: v })} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Hour"><Select value={form.hour} onChange={(v) => setForm({ ...form, hour: v })} options={HOURS} /></Field>
            <Field label="Minute"><Select value={form.minute} onChange={(v) => setForm({ ...form, minute: v })} options={MINUTES} /></Field>
          </div>
          <Field label="Interviewer"><input className={kitInput} value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} /></Field>
          <Field label="Meeting link"><input className={kitInput} value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} /></Field>
          <Field label="Venue (onsite)"><input className={kitInput} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Field>
          <div><Field label="Instructions"><input className={kitInput} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowSchedule(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy}>{busy ? 'Scheduling…' : 'Schedule interview'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading interviews…" /> : rows.length === 0 ? (
        <EmptyState title="No interviews" message="Scheduled interviews appear here; scheduling auto-enables application chat." />
      ) : (
        <div className="space-y-2">
          {rows.map((i) => (
            <div key={i.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{i.round} — {i.candidateName || i.candidateEmail}</div>
                  <div className="text-xs text-slate-500 font-medium">{i.id} • App {i.applicationId} • {i.scheduledAt} • <strong className="text-emerald-600">{i.status}</strong></div>
                </div>
                <div className="flex items-center gap-2">
                  <RowMenu items={[
                    ...(i.meetingLink ? [{ label: 'Join meeting', onSelect: () => window.open(i.meetingLink, '_blank', 'noopener') }] : []),
                    ...(['Scheduled', 'Rescheduled'].includes(i.status) ? [
                      { label: 'Reschedule', onSelect: () => setResched({ id: i.id, date: '', hour: '10', minute: '00', reason: '' }) },
                      { label: 'Cancel interview', danger: true, onSelect: () => setCancelId(i.id) },
                    ] : []),
                  ]} />
                </div>
              </div>
              {resched.id === i.id && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-white border border-slate-200">
                  <DatePicker value={resched.date} onChange={(v) => setResched({ ...resched, date: v })} ariaLabel="New date" />
                  <Select value={resched.hour} onChange={(v) => setResched({ ...resched, hour: v })} ariaLabel="Hour" options={HOURS} />
                  <input className={inputCls} placeholder="Reason" value={resched.reason} onChange={(e) => setResched({ ...resched, reason: e.target.value })} />
                  <button type="button" className={btnDark} onClick={() => confirmReschedule(i.id)}>Confirm move</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={cancelId !== ''}
        title="Cancel interview"
        body="The interview is marked Cancelled with history preserved, and both sides are notified. Continue?"
        confirmLabel="Cancel interview"
        requireReason="Reason"
        onConfirm={async (reasonText) => {
          const u = unwrapObj(await interviewsApi.reschedule(cancelId, { status: 'Cancelled', reason: reasonText || 'cancelled' }));
          setRows((r) => r.map((x) => (x.id === cancelId ? u : x)));
          setCancelId('');
          setResched({ id: '', date: '', hour: '10', minute: '00', reason: '' });
          syncAll();
        }}
        onCancel={() => setCancelId('')}
      />
    </div>
  );
}

/* ---------------- Phase 2: Interview-only chat ---------------- */

/* ---------------- Phase 2: Interview-only chat ---------------- */
export function ChatPanel() {
  const [appId, setAppId] = useState('');
  const [convs, setConvs] = useState<any[]>([]);
  const [active, setActive] = useState('');
  const [msgs, setMsgs] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState(0);

  const find = async () => {
    setLoading(true); setError('');
    try { setConvs(unwrapList(await chatApi.conversations(appId ? appId.trim() : undefined))); }
    catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  const open = async (id: string) => {
    setActive(id); setError('');
    try {
      const thread = unwrapObj(await chatApi.thread(id));
      setMsgs(thread?.messages || []);
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); setMsgs([]); }
  };
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!draft.trim() || !active) return;
    try {
      const m = unwrapObj(await chatApi.send(active, draft.trim()));
      if (m?.id) setMsgs((x) => [...x, m]);
      setDraft('');
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };

  return (
    <div className={cardCls}>
      <h3 className="text-base font-extrabold text-slate-900">Application Messages (interview-gated)</h3>
      {error && <PanelError message={error} status={loadError} onRetry={() => active ? open(active) : find()} />}
      <div className="flex gap-2">
        <input className={inputCls} placeholder="Application ID to find its conversation (blank = mine)" value={appId} onChange={(e) => setAppId(e.target.value)} />
        <button type="button" className={btnDark} onClick={find}>Find</button>
      </div>
      {loading ? <InlineLoading message="Loading conversations…" /> : convs.length === 0 ? (
        <EmptyState title="No conversations" message="Chat unlocks after an interview is scheduled for an application." />
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {convs.map((c) => (
            <button key={c.id} type="button" onClick={() => open(c.id)} className={`px-3 py-1.5 rounded-lg font-bold text-[11px] border ${active === c.id ? 'bg-[#087BFF] text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'}`}>{c.id}</button>
          ))}
        </div>
      )}
      {active !== '' && (
        <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          {msgs.length === 0 && <div className="text-xs text-slate-500 font-medium">No messages yet.</div>}
          {msgs.map((m) => (
            <div key={m.id} className="text-xs"><strong>{m.sender}:</strong> {m.body}</div>
          ))}
          <form onSubmit={send} className="flex gap-2">
            <input className={inputCls} placeholder="Write a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className={btnPrimary}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------------- Phase 2: Saved jobs ---------------- */
export function SavedJobsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try { setRows(unwrapList(await talentApi.saved())); }
    catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const unsave = async (jobId: string) => {
    try { await talentApi.unsave(jobId); setRows((r) => r.filter((x) => x.jobId !== jobId)); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <h3 className="text-base font-extrabold text-slate-900">Saved Jobs</h3>
      {error && <PanelError message={error} onRetry={load} />}
      {loading ? <InlineLoading message="Loading saved jobs…" /> : rows.length === 0 ? (
        <EmptyState title="Nothing saved" message="Save jobs from the listings to build your shortlist." />
      ) : (
        <div className="space-y-2">
          {rows.map((s) => (
            <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="font-extrabold text-slate-900 text-sm">{s.jobId}</div>
              <button type="button" onClick={() => unsave(s.jobId)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Phase 2: Talent pools ---------------- */
export function TalentPoolsPanel() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [member, setMember] = useState({ poolId: '', candidateId: '' });
  const [openPool, setOpenPool] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [removeMember, setRemoveMember] = useState<{ poolId: string; memberId: string; label: string } | null>(null);
  const [loadError, setLoadError] = useState(0);
  const load = async () => {
    setLoading(true); setError('');
    try { setPools(unwrapList(await talentApi.pools())); }
    catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim()) return;
    try {       const p = unwrapObj(await talentApi.createPool({ name: name.trim() })); if (p?.id) setPools((x) => [p, ...x]); setName(''); setShowCreate(false); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const add = async (e: React.FormEvent) => {
    e.preventDefault(); if (!member.poolId || !member.candidateId) return;
      try { await talentApi.addMember(member.poolId, member.candidateId); setMember({ poolId: '', candidateId: '' }); setShowAdd(false); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Talent Pools</h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowAdd(true)} className={btnDark}>+ Add member</button>
          <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New pool</button>
        </div>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load()} />}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New talent pool">
        <form onSubmit={create} className="space-y-3">
          <Field label="Pool name *"><input className={kitInput} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Senior Backend — Q4" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Create pool</button>
          </div>
        </form>
      </Modal>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add pool member">
        <form onSubmit={add} className="space-y-3">
          <Field label="Pool ID *"><input className={kitInput} value={member.poolId} onChange={(e) => setMember({ ...member, poolId: e.target.value })} /></Field>
          <Field label="Candidate ID *"><input className={kitInput} value={member.candidateId} onChange={(e) => setMember({ ...member, candidateId: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnDark}>Add member</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading pools…" /> : pools.length === 0 ? (
        <EmptyState title="No pools" message="Create a talent pool to group shortlisted candidates." />
      ) : (
        <div className="space-y-2">{pools.map((p) => (
          <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between gap-2">
              <span className="min-w-0 truncate">{p.name} <span className="text-slate-500 font-mono">({p.id})</span> {p.status === 'Archived' && <span className="text-amber-600">(archived)</span>}</span>
              <RowMenu items={[
                { label: openPool === p.id ? 'Hide members' : 'View members', onSelect: async () => {
                  try { setMembers(unwrapList(await talentApi.poolMembers(p.id))); setOpenPool(openPool === p.id ? '' : p.id); }
                  catch (e) { setError(errMsg(e)); }
                } },
                ...(p.status !== 'Archived' ? [{ label: 'Archive pool', onSelect: async () => {
                  try { const u = unwrapObj(await talentApi.editPool(p.id, { status: 'Archived' })); setPools((x) => x.map((y) => (y.id === p.id ? u : y))); syncAll(); }
                  catch (e) { setError(errMsg(e)); }
                } }] : []),
              ]} />
            </div>
            {openPool === p.id && (
              <div className="space-y-1.5">
                {members.length === 0 && <div className="text-[11px] text-slate-500 font-medium">No members yet.</div>}
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                    <span className="truncate">{m.candidateId}</span>
                    <RowMenu label="Member actions" items={[{ label: 'Remove member', danger: true, onSelect: () => setRemoveMember({ poolId: p.id, memberId: m.id, label: m.candidateId }) }]} />
                  </div>
                ))}
              </div>
            )}
      <ConfirmDialog
        open={removeMember !== null}
        title="Remove pool member"
        body={`Remove ${removeMember?.label || 'this candidate'} from the pool?`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (!removeMember) return;
          await talentApi.removeMember(removeMember.poolId, removeMember.memberId);
          setMembers((x) => x.filter((y) => y.id !== removeMember.memberId));
          setRemoveMember(null);
          syncAll();
        }}
        onCancel={() => setRemoveMember(null)}
      />
          </div>
        ))}</div>
      )}
    </div>
  );
}

/* ---------------- Phase 2: Candidate search (tiered) ---------------- */
export function CandidateSearchPanel() {
  const [q, setQ] = useQueryState('talent_q');
  const [tier, setTier] = useState('preview');
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState<any[]>([]);
  const debouncedQ = useDebouncedValue(q, 500);
  const search = async (term = debouncedQ) => {
    setLoading(true); setError('');
    try { setRows(unwrapList(await talentApi.search(tier, term))); }
    catch (e) { setError(errMsg(e)); setRows([]); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    if (debouncedQ.trim().length >= 2) search(debouncedQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, tier]);
  useEffect(() => {
    (async () => {
      try { setSkills(unwrapList(await documentsApi.skills())); }
      catch { /* suggestions best-effort */ }
    })();
  }, []);
  return (
    <div className={cardCls}>
      <h3 className="text-base font-extrabold text-slate-900">Candidate Search (subscription-tiered)</h3>
      {error && <PanelError message={error} onRetry={() => search()} />}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 12).map((s: any) => (
            <button key={s.id} type="button" onClick={() => { setQ(s.name); search(s.name); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-spec-electric hover:text-spec-electric">
              {s.name}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); search(q); }} className="flex flex-col sm:flex-row gap-2">
        <input className={inputCls} placeholder="Keyword, title, location…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div style={{ maxWidth: 190 }}>
          <Select value={tier} onChange={setTier} ariaLabel="Access tier" options={[{ value: 'preview', label: 'Preview' }, { value: 'full', label: 'Full profile' }, { value: 'contact', label: 'Contact unlock' }]} />
        </div>
        <button className={btnPrimary}>Search</button>
      </form>
      {loading ? <InlineLoading message="Searching…" /> : rows.length === 0 ? (
        <EmptyState title="No results yet" message="Run a search. Locked tiers explain the upgrade path instead of leaking data." />
      ) : (
        <div className="space-y-2">{rows.map((c) => (
          <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="font-extrabold text-slate-900 text-sm">{c.name || c.roleTitle} {c.contactLocked && <span className="text-amber-600 text-[11px]">(contact locked)</span>}</div>
            <div className="text-xs text-slate-500 font-medium">{c.roleTitle} • {c.experienceYears}y • {c.location} • {c.email || 'email hidden'}</div>
          </div>
        ))}</div>
      )}
    </div>
  );
}

/* ---------------- Phase 2/3: Offers & placements ---------------- */
export function OffersPlacementsPanel() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [offer, setOffer] = useState({ applicationId: '', ctc: '', joinDate: '' });
  const [place, setPlace] = useState({ applicationId: '', joinDate: '', feeBasis: '' });
  const [showOffer, setShowOffer] = useState(false);
  const [showPlace, setShowPlace] = useState(false);
  const load = async () => {
    try { setPlacements(unwrapList(await offersPlacementsApi.placements())); }
    catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const issue = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    try {
      await offersPlacementsApi.offer({ applicationId: offer.applicationId, ctc: Number(offer.ctc) || 0, joinDate: offer.joinDate });
      setOk('Offer issued.'); setOffer({ applicationId: '', ctc: '', joinDate: '' });
      setShowOffer(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const mark = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    try {
      const p = unwrapObj(await offersPlacementsApi.place(place.applicationId, place.joinDate || undefined, Number(place.feeBasis) || 0));
      if (p?.id) setPlacements((x) => [p, ...x]);
      setOk('Placement recorded — commission engine evaluated.'); setPlace({ applicationId: '', joinDate: '', feeBasis: '' });
      setShowPlace(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Offers & Placements</h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowPlace(true)} className={btnDark}>Record joining</button>
          <button type="button" onClick={() => setShowOffer(true)} className={btnPrimary}>Issue offer</button>
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <Modal open={showOffer} onClose={() => setShowOffer(false)} title="Issue offer">
        <form onSubmit={issue} className="space-y-3">
          <Field label="Application ID *"><input className={kitInput} value={offer.applicationId} onChange={(e) => setOffer({ ...offer, applicationId: e.target.value })} /></Field>
          <Field label="CTC (annual)"><input className={kitInput} type="number" value={offer.ctc} onChange={(e) => setOffer({ ...offer, ctc: e.target.value })} /></Field>
          <Field label="Joining date"><DatePicker value={offer.joinDate} onChange={(v) => setOffer({ ...offer, joinDate: v })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowOffer(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Issue offer</button>
          </div>
        </form>
      </Modal>
      <Modal open={showPlace} onClose={() => setShowPlace(false)} title="Record joining" subtitle="Triggers the commission engine">
        <form onSubmit={mark} className="space-y-3">
          <Field label="Application ID *"><input className={kitInput} value={place.applicationId} onChange={(e) => setPlace({ ...place, applicationId: e.target.value })} /></Field>
          <Field label="Joining date"><DatePicker value={place.joinDate} onChange={(v) => setPlace({ ...place, joinDate: v })} /></Field>
          <Field label="Fee basis amount"><input className={kitInput} type="number" value={place.feeBasis} onChange={(e) => setPlace({ ...place, feeBasis: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowPlace(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnDark}>Record joining</button>
          </div>
        </form>
      </Modal>
      {placements.length > 0 && (
        <div className="space-y-2">{placements.map((p) => (
          <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">{p.id} • {p.candidateEmail} • joined {String(p.joinDate).slice(0, 10)}</div>
        ))}</div>
      )}
    </div>
  );
}

/* ---------------- Phase 3: Outreach ---------------- */
export function OutreachPanel() {
  const [camps, setCamps] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState({ name: '', subject: '', template: '', recipients: '' });
  const [busy, setBusy] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const load = async () => {
    try { setCamps(unwrapList(await billingApi.campaigns())); }
    catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    const recipients = form.recipients.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!recipients.length) { setError('Add at least one recipient email.'); return; }
    setBusy(true);
    try {
      const c = unwrapObj(await billingApi.outreach({ ...form, recipients }));
      if (c?.id) setCamps((x) => [c, ...x]);
      setOk(`Campaign queued to ${recipients.length} recipient(s) — quota deducted idempotently.`);
      setForm({ name: '', subject: '', template: '', recipients: '' });
      setShowCompose(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Email Outreach (quota-guarded)</h3>
        <button type="button" onClick={() => setShowCompose(true)} className={btnPrimary}>+ New campaign</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <Modal open={showCompose} onClose={() => setShowCompose(false)} title="New outreach campaign" subtitle="Quota is checked and deducted idempotently">
        <form onSubmit={send} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Campaign name"><input className={kitInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Subject"><input className={kitInput} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Template"><input className={kitInput} value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Recipients" hint="One email per line"><textarea className={kitInput} rows={3} value={form.recipients} onChange={(e) => setForm({ ...form, recipients: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowCompose(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy}>{busy ? 'Queueing…' : 'Queue campaign'}</button>
          </div>
        </form>
      </Modal>
      {camps.length > 0 && <div className="space-y-2">{camps.map((c) => (
        <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">{c.name} • {c.total} recipient(s) • {c.status}</div>
      ))}</div>}
    </div>
  );
}

/* ---------------- Phase 3: Billing ---------------- */
export function BillingPanel() {
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [pay, setPay] = useState({ invoiceId: '', amount: '' });
  const [refund, setRefund] = useState({ paymentId: '', amount: '', reason: '' });
  const [showPay, setShowPay] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [refundConfirm, setRefundConfirm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invForm, setInvForm] = useState({ orgId: '', label: 'Subscription — monthly', qty: '1', unit: '', discount: '', taxRate: '18', dueDate: '', draft: false });
  const [recon, setRecon] = useState<any>(null);
  const [docFor, setDocFor] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const [q, setQ] = useQueryState('bill_q');
  const [voidFor, setVoidFor] = useState<any>(null);
  const [voidReason, setVoidReason] = useState('');
  const [creditFor, setCreditFor] = useState<any>(null);
  const [creditForm, setCreditForm] = useState({ amount: '', reason: '' });
  const load = async () => {
    setError('');
    try {
      const [u, i, p, r, rec] = await Promise.all([
        billingApi.usage().catch(() => null), billingApi.invoices().catch(() => null), billingApi.payments().catch(() => null), billingApi.refunds().catch(() => null), billingApi.reconciliation().catch(() => null),
      ]);
      if (u) setUsage(unwrapObj(u)); if (i) setInvoices(unwrapList(i)); if (p) setPayments(unwrapList(p)); if (r) setRefunds(unwrapList(r));
      if (rec) setRecon(unwrapObj(rec));
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const payNow = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    try {
      const key = `ui-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      await billingApi.pay(pay.invoiceId, Number(pay.amount), key);
      setOk('Payment recorded and reconciled.'); setPay({ invoiceId: '', amount: '' }); setShowPay(false); load();
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const doRefund = async () => {
    setError(''); setOk('');
    if (!refund.paymentId || !refund.amount) { setError('Payment ID + amount required.'); return; }
    try {
      const r = unwrapObj(await billingApi.refund(refund.paymentId, Number(refund.amount), refund.reason || 'requested'));
      if (r?.id) setRefunds((x) => [r, ...x]);
      setOk('Refund processed — ledger updated.'); setRefund({ paymentId: '', amount: '', reason: '' }); setShowRefund(false); load(); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    if (!invForm.orgId.trim() || !invForm.unit || !invForm.dueDate) { setError('Organization + unit price + due date are required.'); return; }
    try {
      const created = unwrapObj(await billingApi.createInvoice({ orgId: invForm.orgId.trim(), dueDate: invForm.dueDate, discount: Number(invForm.discount) || 0, taxRate: Number(invForm.taxRate) || 0, draft: invForm.draft, lines: [{ label: invForm.label, qty: Number(invForm.qty) || 1, unit: Number(invForm.unit) }] }));
      if (created?.id) setInvoices((x) => [created, ...x]);
      setInvForm({ orgId: '', label: 'Subscription — monthly', qty: '1', unit: '', discount: '', taxRate: '18', dueDate: '', draft: false }); setShowInvoice(false);
      setOk(invForm.draft ? 'Draft invoice saved — issue it when ready.' : 'Invoice issued (immutable — amend via credit note).'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const issueInvoice = async (id: string) => {
    try {
      const u = unwrapObj(await billingApi.issueInvoice(id));
      setInvoices((x) => x.map((i) => (i.id === id ? { ...i, ...(u?.id ? u : { status: 'Issued' }) } : i)));
      setOk('Invoice issued.'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const openDocument = async (inv: any) => {
    setDocFor(inv); setDoc(null);
    try { setDoc(unwrapObj(await billingApi.invoiceDocument(inv.id))); }
    catch (e) { setError(errMsg(e)); }
  };
  const doVoid = async () => {
    if (!voidFor || !voidReason.trim()) { setError('Void reason is required.'); return; }
    try {
      const u = unwrapObj(await billingApi.voidInvoice(voidFor.id, voidReason.trim()));
      setInvoices((x) => x.map((i) => (i.id === voidFor.id ? { ...i, ...(u?.id ? u : { status: 'Void' }) } : x)));
      setVoidFor(null); setVoidReason(''); setOk('Invoice voided.'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const doCredit = async () => {
    if (!creditFor || !creditForm.amount) return;
    try {
      await billingApi.creditNote(creditFor.id, Number(creditForm.amount), creditForm.reason || 'adjustment');
      setCreditFor(null); setCreditForm({ amount: '', reason: '' }); load(); setOk('Credit note issued — balance adjusted.'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const filteredInv = invoices.filter((i) => !q.trim() || `${i.id} ${i.number} ${i.orgId} ${i.status}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Billing — Invoices / Payments / Refunds / Credits</h3>
          <div className="flex gap-2">
            <ExportButton filename="invoices.csv" rows={filteredInv} columns={['id', 'number', 'orgId', 'total', 'balance', 'status']} />
            <button type="button" onClick={() => setShowInvoice(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">+ Invoice</button>
            <button type="button" onClick={() => setShowRefund(true)} className={btnDark}>Refund</button>
            <button type="button" onClick={() => setShowPay(true)} className={btnPrimary}>Record payment</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search invoice ID, number, org, status…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {recon && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[['Invoiced', `₹${Number(recon.totalInvoiced || 0).toLocaleString('en-IN')}`], ['Paid', `₹${Number(recon.totalPaid || 0).toLocaleString('en-IN')}`], ['Outstanding', `₹${Number(recon.outstanding || 0).toLocaleString('en-IN')}`], ['Docs', `${recon.invoices || 0} inv / ${recon.payments || 0} pay`]].map(([k, v]) => (
            <div key={k as string} className="p-3 rounded-2xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="text-base font-extrabold mt-0.5">{v}</div></div>
          ))}
        </div>
      )}
      <Modal open={showInvoice} onClose={() => setShowInvoice(false)} title="New invoice" subtitle="Drafts are editable; issued invoices are immutable (void/credit only)">
        <form onSubmit={createInvoice} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Organization ID *"><input className={kitInput} value={invForm.orgId} onChange={(e) => setInvForm({ ...invForm, orgId: e.target.value })} placeholder="TNT-9011" /></Field>
          <Field label="Due date *"><DatePicker value={invForm.dueDate} onChange={(v) => setInvForm({ ...invForm, dueDate: v })} /></Field>
          <div className="sm:col-span-2"><Field label="Line label"><input className={kitInput} value={invForm.label} onChange={(e) => setInvForm({ ...invForm, label: e.target.value })} /></Field></div>
          <Field label="Qty"><input className={kitInput} type="number" min={1} value={invForm.qty} onChange={(e) => setInvForm({ ...invForm, qty: e.target.value })} /></Field>
          <Field label="Unit price (₹) *"><input className={kitInput} type="number" value={invForm.unit} onChange={(e) => setInvForm({ ...invForm, unit: e.target.value })} /></Field>
          <Field label="Discount (₹)"><input className={kitInput} type="number" min={0} value={invForm.discount} onChange={(e) => setInvForm({ ...invForm, discount: e.target.value })} /></Field>
          <Field label="Tax rate %"><input className={kitInput} type="number" min={0} max={100} value={invForm.taxRate} onChange={(e) => setInvForm({ ...invForm, taxRate: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex items-center gap-2 text-xs font-bold text-slate-700">
            <input id="inv-draft" type="checkbox" checked={invForm.draft} onChange={(e) => setInvForm({ ...invForm, draft: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="inv-draft">Save as Draft (editable, issue later)</label>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowInvoice(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">{invForm.draft ? 'Save draft' : 'Issue invoice'}</button>
          </div>
        </form>
      </Modal>
      <Modal open={docFor !== null} onClose={() => { setDocFor(null); setDoc(null); }} title={`Invoice ${doc?.number || docFor?.number || docFor?.id || ''}`} subtitle="Printable document — totals, payments, credits">
        {!doc ? <InlineLoading message="Loading document…" /> : (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
              <div className="font-extrabold text-sm">{doc.organization?.legalName || doc.orgId}</div>
              <div className="text-slate-300">{doc.organization?.gstin ? `GSTIN ${doc.organization.gstin} • ` : ''}{doc.billingPeriod || ''}</div>
              <div className="text-slate-300">Due {String(doc.dueDate || '').slice(0, 10)} • <strong className="text-white">{doc.status}</strong>{doc.overdue ? ` • ${doc.daysOverdue}d overdue` : ''}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase text-[10px]"><th className="px-3 py-2">Item</th><th className="px-3 py-2">Qty</th><th className="px-3 py-2 text-right">Unit</th><th className="px-3 py-2 text-right">Amount</th></tr></thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(doc.lines || []).map((l: any) => (
                    <tr key={l.id}><td className="px-3 py-2">{l.label}</td><td className="px-3 py-2">{l.qty}</td><td className="px-3 py-2 text-right">₹{l.unit}</td><td className="px-3 py-2 text-right">₹{(l.qty * l.unit).toLocaleString('en-IN')}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{doc.subtotal}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>− ₹{doc.discount}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>₹{doc.tax}</span></div>
              <div className="flex justify-between text-sm"><span>Total</span><span>₹{doc.total}</span></div>
              <div className="flex justify-between text-emerald-700"><span>Paid</span><span>₹{doc.amountPaid}</span></div>
              <div className="flex justify-between"><span>Balance</span><span>₹{doc.balance}</span></div>
            </div>
            {(doc.payments || []).length > 0 && <div className="text-slate-600 font-medium">Payments: {(doc.payments || []).map((p: any) => `${p.id} ₹${p.amount}`).join(' • ')}</div>}
            {(doc.creditNotes || []).length > 0 && <div className="text-slate-600 font-medium">Credits: {(doc.creditNotes || []).map((c: any) => `${c.id} ₹${c.amount}`).join(' • ')}</div>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => window.print()} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Print / Save PDF</button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={voidFor !== null} onClose={() => setVoidFor(null)} title={`Void ${voidFor?.number || voidFor?.id || ''}?`} subtitle="Paid/Credited/Void invoices cannot be voided — use a credit note.">
        <div className="space-y-3">
          <Field label="Void reason *"><textarea rows={3} className={kitInput} value={voidReason} onChange={(e) => setVoidReason(e.target.value)} placeholder="e.g. Duplicate billing — finance approval" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setVoidFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" onClick={doVoid} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs">Void invoice</button>
          </div>
        </div>
      </Modal>
      <Modal open={creditFor !== null} onClose={() => setCreditFor(null)} title={`Credit note — ${creditFor?.number || creditFor?.id || ''}`}>
        <div className="space-y-3">
          <Field label="Amount (₹) *"><input className={kitInput} type="number" value={creditForm.amount} onChange={(e) => setCreditForm({ ...creditForm, amount: e.target.value })} /></Field>
          <Field label="Reason"><input className={kitInput} value={creditForm.reason} onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setCreditFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" onClick={doCredit} className={btnDark}>Issue credit note</button>
          </div>
        </div>
      </Modal>
      <Modal open={showPay} onClose={() => setShowPay(false)} title="Record payment" subtitle="Idempotency key auto-generated per submission">
        <form onSubmit={payNow} className="space-y-3">
          <Field label="Invoice ID *"><input className={kitInput} value={pay.invoiceId} onChange={(e) => setPay({ ...pay, invoiceId: e.target.value })} /></Field>
          <Field label="Amount *"><input className={kitInput} type="number" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowPay(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Record payment</button>
          </div>
        </form>
      </Modal>
      <Modal open={showRefund} onClose={() => setShowRefund(false)} title="Process refund" subtitle="Adjusts payment status and invoice balance">
        <div className="space-y-3">
          <Field label="Payment ID *"><input className={kitInput} value={refund.paymentId} onChange={(e) => setRefund({ ...refund, paymentId: e.target.value })} /></Field>
          <Field label="Amount *"><input className={kitInput} type="number" value={refund.amount} onChange={(e) => setRefund({ ...refund, amount: e.target.value })} /></Field>
          <Field label="Reason"><input className={kitInput} value={refund.reason} onChange={(e) => setRefund({ ...refund, reason: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowRefund(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button type="button" onClick={() => setRefundConfirm(true)} className={btnDark}>Review refund</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        open={refundConfirm}
        title="Confirm refund"
        body={`Refund ₹${refund.amount || 0} against payment ${refund.paymentId || '—'}? The ledger and invoice balance update immediately.`}
        confirmLabel="Process refund"
        onConfirm={async () => { await doRefund(); setRefundConfirm(false); }}
        onCancel={() => setRefundConfirm(false)}
      />
      {usage && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
          Plan: {usage.plan} • Subscription: {usage.subscription} • Period: {usage.period}
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(usage.usage || {}).map(([k, v]: [string, any]) => (
              <div key={k} className="p-2 rounded-xl bg-white border border-slate-200">{k}: {v.limit !== undefined ? `${v.used}/${v.limit} (left ${v.remaining})` : 'enabled'}</div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-700">Invoices ({filteredInv.length}/{invoices.length}) — Void / Credit</div>
          {filteredInv.map((i) => {
            const overdue = Number(i.balance || 0) > 0 && i.dueDate && new Date(i.dueDate) < new Date() && !['Paid', 'Void', 'Credited'].includes(i.status);
            return (
            <div key={i.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold flex items-center justify-between gap-2">
                <span className="truncate">{i.number || i.id} • ₹{i.total} • bal ₹{i.balance} • {i.status}{overdue ? ' • OVERDUE' : ''}</span>
                <RowMenu items={[
                  { label: 'View document', onSelect: () => openDocument(i) },
                  ...(i.status === 'Draft' ? [{ label: 'Issue now', onSelect: () => issueInvoice(i.id) }] : []),
                  { label: 'Void…', danger: true, onSelect: () => { setVoidFor(i); setVoidReason(''); } },
                  { label: 'Credit note…', onSelect: () => { setCreditFor(i); setCreditForm({ amount: '', reason: '' }); } },
                ]} />
              </div>
              <div className="text-slate-500 font-medium">
                issued {String(i.issueDate || i.createdAt || '').slice(0, 10)} • due {String(i.dueDate || '').slice(0, 10)} • sub ₹{i.subtotal} − disc ₹{i.discount} + tax ₹{i.tax}
                {Array.isArray(i.lines) && i.lines.length > 0 && ` • ${i.lines.length} line(s): ${i.lines.map((l: any) => `${l.label}×${l.qty}`).join(', ')}`}
              </div>
            </div>
            );
          })}
          {filteredInv.length === 0 && <div className="text-xs text-slate-500">No invoices match.</div>}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-700">Payments ({payments.length})</div>
          {payments.map((p) => (
            <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold">{p.id} • ₹{p.amount} • {p.status}{p.refundedAmount ? ` • refunded ₹${p.refundedAmount}` : ''}</div>
              <div className="text-slate-500 font-medium">{p.method || ''}{p.provider ? ` via ${p.provider}` : ''}{p.reference ? ` • ref ${p.reference}` : ''} • {String(p.transactionDate || p.createdAt || '').slice(0, 10)}</div>
            </div>
          ))}
          {payments.length === 0 && <div className="text-xs text-slate-500">No payments.</div>}
          {refunds.length > 0 && (
            <>
              <div className="text-xs font-extrabold text-slate-700 pt-2">Refunds ({refunds.length})</div>
              {refunds.map((r) => (
                <div key={r.id} className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold">{r.id} • payment {r.paymentId} • ₹{r.amount} • {r.status}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Phase 3: Subscriptions (admin) — full CRUD ---------------- */
export function SubscriptionsPanel() {
  const [plans, setPlans] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [sub, setSub] = useState({ orgId: '', planId: '' });
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [planForm, setPlanForm] = useState({ name: '', price: '', interval: 'monthly', target: 'company' });
  const [detail, setDetail] = useState<any>(null);
  const [detailHistory, setDetailHistory] = useState<any[]>([]);
  const [q, setQ] = useQueryState('sub_q');
  const [versionsFor, setVersionsFor] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [versionForm, setVersionForm] = useState({ price: '', interval: 'monthly', entitlements: '' });
  const [changeFor, setChangeFor] = useState<any>(null);
  const [changePlanId, setChangePlanId] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [renewalFor, setRenewalFor] = useState<any>(null);
  const [renewalForm, setRenewalForm] = useState({ autoRenew: 'true', discount: '' });
  const load = async () => {
    setError('');
    try { setPlans(unwrapList(await billingApi.plans())); setSubs(unwrapList(await billingApi.subscriptions())); }
    catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault(); if (!sub.orgId || !sub.planId) return;
    try {       const s = unwrapObj(await billingApi.subscribe(sub.orgId, sub.planId)); if (s?.id) setSubs((x) => [s, ...x]); setSub({ orgId: '', planId: '' }); setShowSubscribe(false); setOk('Subscription created (Trial). Terms snapshotted.'); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault(); if (!planForm.name.trim() || !planForm.price) return;
    try {
      const p = unwrapObj(await billingApi.createPlan({ name: planForm.name.trim(), price: Number(planForm.price), interval: planForm.interval, target: planForm.target }));
      if (p?.id) setPlans((x) => [p, ...x]);
      setPlanForm({ name: '', price: '', interval: 'monthly', target: 'company' }); setShowPlan(false); setOk('Plan created (v1).'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const setStatus = async (id: string, status: string) => {
    try { const u = unwrapObj(await billingApi.setSubscription(id, status, status === 'Cancelled' ? 'admin-console' : undefined)); setSubs((x) => x.map((s) => (s.id === id ? u : s))); setOk(`${id} → ${status}.`); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const openVersions = async (p: any) => {
    setVersionsFor(p); setVersions([]); setVersionForm({ price: String(p.price ?? ''), interval: p.interval || 'monthly', entitlements: JSON.stringify(p.entitlements || {}, null, 2) });
    try { setVersions(unwrapList(await billingApi.planVersions(p.id))); }
    catch (e) { setError(errMsg(e)); }
  };
  const saveVersion = async (e: React.FormEvent) => {
    e.preventDefault(); if (!versionsFor) return;
    let ent: Record<string, unknown> | undefined;
    if (versionForm.entitlements.trim()) {
      try { ent = JSON.parse(versionForm.entitlements); }
      catch { setError('Entitlements must be valid JSON (object).'); return; }
    }
    try {
      const u = unwrapObj(await billingApi.newPlanVersion(versionsFor.id, { price: Number(versionForm.price), interval: versionForm.interval, entitlements: ent }));
      setPlans((x) => x.map((pl) => (pl.id === versionsFor.id ? { ...pl, ...(u?.id ? u : {}) } : x)));
      setVersionsFor(null); load(); setOk(`Plan ${versionsFor.id} → v${(u as any)?.version || 'next'} (old terms snapshotted).`); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const archivePlan = async (p: any) => {
    try {
      await billingApi.archivePlan(p.id);
      setPlans((x) => x.map((pl) => (pl.id === p.id ? { ...pl, status: 'Archived' } : pl))); setOk(`Plan ${p.id} archived.`); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const doChangePlan = async () => {
    if (!changeFor || !changePlanId) return;
    try {
      const u = unwrapObj(await billingApi.changePlan(changeFor.id, changePlanId, changeReason || undefined));
      setSubs((x) => x.map((s) => (s.id === changeFor.id ? { ...s, ...(u?.id ? u : {}) } : x)));
      setChangeFor(null); setChangePlanId(''); setChangeReason(''); setOk('Plan changed — history recorded.'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const saveRenewal = async () => {
    if (!renewalFor) return;
    try {
      const u = unwrapObj(await billingApi.renewalSettings(renewalFor.id, { autoRenew: renewalForm.autoRenew === 'true', discount: Number(renewalForm.discount) || 0 }));
      setSubs((x) => x.map((s) => (s.id === renewalFor.id ? { ...s, ...(u?.id ? u : {}) } : x)));
      setRenewalFor(null); setOk('Renewal settings saved.'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const openDetail = async (s: any) => {
    setDetail(s); setDetailHistory([]);
    try {
      const res: any = await apiClient.get('/api/v1/subscription-changes');
      const all = unwrapList(res).filter((c: any) => c.subscriptionId === s.id);
      setDetailHistory(all);
    } catch { /* history best-effort */ }
  };
  const filteredSubs = subs.filter((s) => !q.trim() || `${s.id} ${s.orgId} ${s.planId} ${s.status}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Plans & Subscriptions — Create / View / Suspend / Cancel / Export</h3>
          <div className="flex gap-2">
            <ExportButton filename="subscriptions.csv" rows={filteredSubs} columns={['id', 'orgId', 'planId', 'status', 'renewalDate']} />
            <button type="button" onClick={() => setShowPlan(true)} className={btnDark}>+ New plan</button>
            <button type="button" onClick={() => setShowSubscribe(true)} className={btnPrimary}>+ Subscribe org</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search subscription ID, org, plan, status…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="text-xs font-extrabold text-slate-700">Plans ({plans.length}) — versions are immutable snapshots</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {plans.map((p) => (
          <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold flex items-center justify-between gap-2">
              <span className="truncate">{p.name} • ₹{p.price}/{p.interval} • v{p.version} • {p.status}</span>
              <RowMenu items={[
                { label: 'Versions + new version…', onSelect: () => openVersions(p) },
                ...(p.status !== 'Archived' ? [{ label: 'Archive plan…', danger: true, onSelect: () => archivePlan(p) }] : []),
              ]} />
            </div>
            <div className="text-slate-500 font-medium">{p.id} • target: {p.target || 'company'}</div>
            {p.entitlements && (
              <div className="flex flex-wrap gap-1 pt-1">
                {Object.entries(p.entitlements as Record<string, unknown>).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-[11px]">{k}: {String(v)}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal open={showSubscribe} onClose={() => setShowSubscribe(false)} title="Subscribe organization" subtitle="Plan terms are snapshotted at subscribe time">
        <form onSubmit={subscribe} className="space-y-3">
          <Field label="Organization ID *"><input className={kitInput} value={sub.orgId} onChange={(e) => setSub({ ...sub, orgId: e.target.value })} placeholder="e.g. TNT-9011" /></Field>
          <Field label="Plan ID *">
            <Select value={sub.planId} onChange={(v) => setSub({ ...sub, planId: v })} placeholder="Choose plan" options={plans.map((p) => ({ value: p.id, label: `${p.name} — ₹${p.price}/${p.interval}` }))} />
          </Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowSubscribe(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Subscribe</button>
          </div>
        </form>
      </Modal>
      <Modal open={showPlan} onClose={() => setShowPlan(false)} title="New subscription plan" subtitle="Versioned v1 — edits never rewrite active subscriptions">
        <form onSubmit={createPlan} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Plan name *"><input className={kitInput} value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="e.g. Growth Annual" /></Field></div>
          <Field label="Price (₹) *"><input className={kitInput} type="number" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} /></Field>
          <Field label="Interval"><Select value={planForm.interval} onChange={(v) => setPlanForm({ ...planForm, interval: v })} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annual', label: 'Annual' }]} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowPlan(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className={btnDark}>Create plan</button>
          </div>
        </form>
      </Modal>
      <div className="space-y-2">{filteredSubs.map((s) => (
        <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
          <div className="text-xs font-bold min-w-0 truncate">{s.id} • {s.orgId} • {s.planId} v{s.planVersion} • <strong className="text-blue-600">{s.status}</strong> • ₹{s.price}{s.discount ? ` − ₹${s.discount}` : ''} • {s.autoRenew ? 'auto' : 'manual'} • renews {String(s.renewalDate || '').slice(0, 10)}</div>
          <RowMenu items={[
            { label: 'View terms + history', onSelect: () => openDetail(s) },
            { label: 'Change plan…', onSelect: () => { setChangeFor(s); setChangePlanId(''); setChangeReason(''); } },
            { label: 'Renewal settings…', onSelect: () => { setRenewalFor(s); setRenewalForm({ autoRenew: s.autoRenew === false ? 'false' : 'true', discount: String(s.discount || '') }); } },
            ...['Trial', 'Active', 'Renewal Due', 'Past Due', 'Grace Period', 'Suspended', 'Cancelled', 'Expired'].filter((x) => x !== s.status).slice(0, 6).map((x) => ({ label: `Set ${x}`, danger: x === 'Cancelled', onSelect: () => setStatus(s.id, x) })),
          ]} />
        </div>
      ))}</div>
      <Modal open={versionsFor !== null} onClose={() => setVersionsFor(null)} title={`Plan versions — ${versionsFor?.name || ''}`} subtitle="Edits mint a new version; active subscriptions keep their snapshot">
        <div className="space-y-3">
          {versions.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No prior versions — this is v{versionsFor?.version || 1}.</div> : versions.map((v: any) => (
            <div key={v.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">v{v.version} • ₹{v.snapshot?.price} • by {v.by} • {String(v.createdAt || '').slice(0, 10)}</div>
          ))}
          <form onSubmit={saveVersion} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-200">
            <Field label="New price (₹)"><input className={kitInput} type="number" value={versionForm.price} onChange={(e) => setVersionForm({ ...versionForm, price: e.target.value })} /></Field>
            <Field label="Interval"><Select value={versionForm.interval} onChange={(v) => setVersionForm({ ...versionForm, interval: v })} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annual', label: 'Annual' }]} /></Field>
            <div className="sm:col-span-2"><Field label="Entitlements JSON (object)"><textarea rows={4} className={`${kitInput} font-mono`} value={versionForm.entitlements} onChange={(e) => setVersionForm({ ...versionForm, entitlements: e.target.value })} /></Field></div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setVersionsFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Close</button>
              <button className={btnDark}>Mint new version</button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal open={changeFor !== null} onClose={() => setChangeFor(null)} title={`Change plan — ${changeFor?.id || ''}`} subtitle="Old terms stay snapshotted in history">
        <div className="space-y-3">
          <Field label="New plan"><Select value={changePlanId} onChange={setChangePlanId} placeholder="Choose plan" options={plans.filter((p) => p.status !== 'Archived').map((p) => ({ value: p.id, label: `${p.name} v${p.version} — ₹${p.price}/${p.interval}` }))} /></Field>
          <Field label="Reason"><input className={kitInput} value={changeReason} onChange={(e) => setChangeReason(e.target.value)} placeholder="e.g. Upgrade at renewal" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setChangeFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={!changePlanId} onClick={doChangePlan} className={btnPrimary}>Change plan</button>
          </div>
        </div>
      </Modal>
      <Modal open={renewalFor !== null} onClose={() => setRenewalFor(null)} title={`Renewal settings — ${renewalFor?.id || ''}`}>
        <div className="space-y-3">
          <Field label="Auto-renew"><Select value={renewalForm.autoRenew} onChange={(v) => setRenewalForm({ ...renewalForm, autoRenew: v })} options={[{ value: 'true', label: 'On' }, { value: 'false', label: 'Off' }]} /></Field>
          <Field label="Discount (₹)"><input className={kitInput} type="number" min={0} value={renewalForm.discount} onChange={(e) => setRenewalForm({ ...renewalForm, discount: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setRenewalFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" onClick={saveRenewal} className={btnDark}>Save</button>
          </div>
        </div>
      </Modal>
      <Modal open={detail !== null} onClose={() => setDetail(null)} title={`${detail?.id || ''}`} subtitle={`${detail?.orgId || ''} • ${detail?.planId || ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Status', detail?.status], ['Plan version', detail?.planVersion], ['Price', detail?.price], ['Discount', detail?.discount || 0], ['Currency', detail?.currency], ['Start', String(detail?.startDate || '').slice(0, 10)], ['Renewal', String(detail?.renewalDate || '').slice(0, 10)], ['Auto-renew', String(detail?.autoRenew)], ['Trial end', String(detail?.trialEnd || '').slice(0, 10)]].map(([k, v]) => (
            <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1">{String(v ?? '—')}</div></div>
          ))}
        </div>
        <div className="text-xs font-extrabold pt-2">Upgrade / downgrade history ({detailHistory.length})</div>
        {detailHistory.length === 0 ? <div className="text-[11px] text-slate-500">No changes recorded.</div> : detailHistory.map((h: any) => (
          <div key={h.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"><strong>{h.change}</strong> • {h.by || ''} • <span className="text-slate-500">{String(h.createdAt || '').slice(0, 16).replace('T', ' ')}</span>{h.reason ? <div>{h.reason}</div> : null}</div>
        ))}
      </Modal>
    </div>
  );
}

/* ---------------- Phase 3/4: Commissions & payouts ---------------- */
export function CommissionsPanel() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ orgId: '', jobId: '', rate: '8.33', trigger: 'Joined' });
  const [showAgreement, setShowAgreement] = useState(false);
  const [payoutId, setPayoutId] = useState('');
  const [adjustFor, setAdjustFor] = useState<any>(null);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [adjustForm, setAdjustForm] = useState({ amount: '', reason: '' });
  const [loadError, setLoadError] = useState(0);
  const load = async () => {
    setError('');
    try {
      setAgreements(unwrapList(await billingApi.agreements()));
      setCommissions(unwrapList(await billingApi.commissions()));
      setPayouts(unwrapList(await billingApi.payouts()));
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.orgId) return;
    try {
      const a = unwrapObj(await billingApi.createAgreement({ orgId: form.orgId, jobId: form.jobId || undefined, rate: Number(form.rate) || 8.33, trigger: form.trigger }));
      if (a?.id) setAgreements((x) => [a, ...x]);
      setForm({ orgId: '', jobId: '', rate: '8.33', trigger: 'Joined' });
      setShowAgreement(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const approve = async (id: string) => {
    try { const u = unwrapObj(await billingApi.approveCommission(id)); setCommissions((x) => x.map((c) => (c.id === id ? u : c))); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const payout = async (id: string) => {
    try { const p = unwrapObj(await billingApi.payout(id)); if (p?.id) { setPayouts((x) => [p, ...x]); load(); } syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const [cq, setCq] = useQueryState('com_q');
  const [leg, setLeg] = useQueryState('com_leg');
  const [dupMsg, setDupMsg] = useState('');
  const checkDup = async (c: any) => {
    setDupMsg('');
    try {
      const key = c.placementId || c.applicationId;
      const res: any = await billingApi.checkDuplicate(`?trigger=${encodeURIComponent(c.trigger || '')}&${c.applicationId ? `applicationId=${c.applicationId}` : `placementId=${key}`}${c.agreementId ? `&agreementId=${c.agreementId}` : ''}`);
      const d = (res as { data?: any })?.data;
      setDupMsg(d?.duplicate ? `Duplicate guard: ${d.count} record(s) share placement+trigger (e.g. ${d.rows.map((r: any) => r.id).join(', ')}). New payouts are blocked by idempotency.` : 'No duplicate for this placement + trigger.');
    } catch (e) { setDupMsg(errMsg(e)); }
  };
  const legOf = (c: any) => (c.agencyId ? 'payable' : 'receivable');
  const filteredComms = commissions.filter((c) => {
    if (leg && legOf(c) !== leg) return false;
    return !cq.trim() || `${c.id} ${c.orgId} ${c.agencyId} ${c.approvalStatus}`.toLowerCase().includes(cq.toLowerCase());
  });
  const recvTotal = commissions.filter((c) => legOf(c) === 'receivable').reduce((a: number, c: any) => a + Number(c.total || c.net || 0), 0);
  const payTotal = commissions.filter((c) => legOf(c) === 'payable').reduce((a: number, c: any) => a + Number(c.total || c.net || 0), 0);
  const stageOf = (c: any): number => {
    if (c.paymentStatus === 'Paid') return 5;
    if (c.approvalStatus === 'Approved') return 4;
    if (Number(c.adjustments || 0) !== 0) return 3;
    if (c.triggerDate || c.placementId) return 2;
    if (c.agreementId) return 1;
    return 0;
  };
  const STAGES = ['Agreement', 'Triggered', 'Adjusted', 'Approved', 'Invoiced', 'Reconciled'];
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Commissions — Agreements → Approve → Adjust → Payout / Export</h3>
          <div className="flex gap-2">
            <ExportButton filename="commissions.csv" rows={filteredComms} columns={['id', 'orgId', 'agencyId', 'gross', 'total', 'approvalStatus', 'paymentStatus']} />
            <button type="button" onClick={() => setShowAgreement(true)} className={btnPrimary}>+ New agreement</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200"><div className="text-[10px] font-bold text-blue-700 uppercase">Company receivable</div><div className="text-base font-extrabold">₹{recvTotal.toLocaleString('en-IN')}</div></div>
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200"><div className="text-[10px] font-bold text-purple-700 uppercase">Agency payable</div><div className="text-base font-extrabold">₹{payTotal.toLocaleString('en-IN')}</div></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <input className={`${inputCls} flex-1`} placeholder="Search commission ID, org, agency, status…" value={cq} onChange={(e) => setCq(e.target.value)} />
          <div className="w-full lg:w-44 shrink-0">
            <Select value={leg} onChange={setLeg} ariaLabel="Ledger filter" placeholder="Both ledgers"
              options={[{ value: '', label: 'Both ledgers' }, { value: 'receivable', label: 'Receivable only' }, { value: 'payable', label: 'Payable only' }]} />
          </div>
        </div>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={load} />}
      {dupMsg && <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">{dupMsg}</div>}
      <Modal open={showAgreement} onClose={() => setShowAgreement(false)} title="New commission agreement" subtitle="Trigger is evaluated automatically on placement">
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Organization ID *"><input className={kitInput} value={form.orgId} onChange={(e) => setForm({ ...form, orgId: e.target.value })} /></Field>
          <Field label="Job ID (optional)"><input className={kitInput} value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })} /></Field>
          <Field label="Rate %"><input className={kitInput} type="number" step="0.01" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} /></Field>
          <Field label="Trigger"><Select value={form.trigger} onChange={(v) => setForm({ ...form, trigger: v })} options={[{ value: 'Joined', label: 'Joined' }, { value: 'Offer Accepted', label: 'Offer Accepted' }]} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowAgreement(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Create agreement</button>
          </div>
        </form>
      </Modal>
      <div className="text-xs font-extrabold text-slate-700">Agreements ({agreements.length})</div>
      {agreements.map((a) => (
        <div key={a.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">{a.id} • {a.orgId} • {a.rate}% • trigger {a.trigger} • {a.status}</div>
      ))}
      <div className="text-xs font-extrabold text-slate-700">Commissions ({filteredComms.length}/{commissions.length})</div>
      {filteredComms.length === 0 && <EmptyState title="No commissions yet" message="Placement triggers auto-create commission records from approved agreements." />}
      {filteredComms.map((c) => {
        const stage = stageOf(c);
        return (
        <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate">{c.id} • {c.agencyId || c.orgId} • trig {c.trigger || '—'} • gross ₹{c.gross} • total ₹{c.total || c.net} • {c.approvalStatus}/{c.paymentStatus}</span>
            <RowMenu items={[
              ...(c.approvalStatus !== 'Approved' ? [{ label: 'Approve commission', onSelect: () => approve(c.id) }] : []),
              ...(c.approvalStatus === 'Approved' && c.paymentStatus !== 'Paid' ? [{ label: 'Process payout', onSelect: () => setPayoutId(c.id) }] : []),
              { label: 'Verify uniqueness…', onSelect: () => checkDup(c) },
              { label: 'Adjustments', onSelect: async () => {
                setAdjustFor(c); setAdjustForm({ amount: '', reason: '' });
                try { setAdjustments(unwrapList(await workforceApi.adjustments(c.id))); }
                catch (e) { setError(errMsg(e)); }
              } },
            ]} />
          </div>
          <div className="flex items-center gap-1" aria-label={`Lifecycle: ${STAGES[stage]}`}>
            {STAGES.map((s, i) => (
              <span key={s} className="flex items-center gap-1 flex-1">
                <span className={`h-1.5 rounded-full flex-1 ${i <= stage ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              </span>
            ))}
            <span className="text-[10px] text-slate-500 ml-1">{STAGES[stage]}</span>
          </div>
        </div>
        );
      })}
      <div className="text-xs font-extrabold text-slate-700">Payouts ({payouts.length})</div>
      {payouts.map((p) => (
        <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">{p.id} • ₹{p.amount} • {p.status}</div>
      ))}
      <ConfirmDialog
        open={payoutId !== ''}
        title="Process payout"
        body={`Pay out this approved commission (${payoutId})? This moves money and is recorded in both ledgers.`}
        confirmLabel="Process payout"
        onConfirm={async () => { await payout(payoutId); setPayoutId(''); }}
        onCancel={() => setPayoutId('')}
      />
      <Modal open={adjustFor !== null} onClose={() => setAdjustFor(null)} title={`Adjustments — ${adjustFor?.id || ''}`} subtitle="Adjustments recompute gross, tax and total">
        <div className="space-y-3">
          {adjustments.length === 0 && <div className="text-[11px] text-slate-500 font-medium">No adjustments yet.</div>}
          {adjustments.map((a) => (
            <div key={a.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">
              {a.amount >= 0 ? '+' : ''}₹{a.amount} • {a.reason || 'no reason'} • by {a.by}
            </div>
          ))}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!adjustFor || !adjustForm.amount) return;
              try {
                const created = unwrapObj(await workforceApi.adjustCommission(adjustFor.id, Number(adjustForm.amount), adjustForm.reason));
                if (created?.id) setAdjustments((x) => [created, ...x]);
                setAdjustForm({ amount: '', reason: '' });
                load(); syncAll();
              } catch (e) { setError(errMsg(e)); }
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200"
          >
            <input className={kitInput} type="number" step="0.01" placeholder="Amount (±)" value={adjustForm.amount} onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })} />
            <input className={kitInput} placeholder="Reason" value={adjustForm.reason} onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} />
            <button className={btnDark}>Add adjustment</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- Phase 4: Leads ---------------- */
export function LeadsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState(0);
  const [form, setForm] = useState({ contactName: '', companyName: '', email: '', phone: '', industry: '', source: '', priority: 'Medium', nextFollowUp: '', value: '', notes: '', consent: '' });
  const [mergeFor, setMergeFor] = useState<any>(null);
  const [mergeTarget, setMergeTarget] = useState('');
  const [mergeReason, setMergeReason] = useState('');
  const [mergeQ, setMergeQ] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [convertId, setConvertId] = useState('');
  const [meetingLead, setMeetingLead] = useState<any>(null);
  const [meetingForm, setMeetingForm] = useState({ title: 'Follow-up meeting', date: '', hour: '10', minute: '00', outcome: '', notes: '', nextAction: '', followUp: '' });
  const [proposalLead, setProposalLead] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalForm, setProposalForm] = useState({ title: '', amount: '', validUntil: '' });
  const [oppLead, setOppLead] = useState<any>(null);
  const [oppValue, setOppValue] = useState('');
  const [q, setQ] = useQueryState('lead_q');
  const dqLead = useDebounced(q);
  const [editing, setEditing] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const pageSize = 10;
  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      const res: any = await salesApi.leads(`?page=${p}&pageSize=${pageSize}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page ]);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.contactName.trim() || !form.companyName.trim()) return;
    setBusy(true);
    try {
      const l = unwrapObj(await salesApi.createLead({ ...form, value: Number(form.value) || undefined }));
      if (l?.id) setRows((x) => [l, ...x]);
      setForm({ contactName: '', companyName: '', email: '', phone: '', industry: '', source: '', priority: 'Medium', nextFollowUp: '', value: '', notes: '', consent: '' });
      setShowCreate(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const move = async (id: string, stage: string) => {
    if (stage === 'Lost' && !reason.trim()) { setError('A lost reason is required.'); return; }
    try { const u = unwrapObj(await salesApi.setLeadStage(id, stage, reason || undefined)); setRows((x) => x.map((l) => (l.id === id ? u : l))); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const convert = async (id: string) => {
    try { await salesApi.convert(id); load(); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const filteredLeads = rows.filter((l) => !dqLead.trim() || `${l.id} ${l.contactName} ${l.companyName} ${l.email}`.toLowerCase().includes(dqLead.toLowerCase()));
  const saveLeadEdit = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const updated = unwrapObj(await salesApi.updateLead(editing.id, { contactName: editing.contactName, companyName: editing.companyName, email: editing.email, phone: editing.phone, value: Number(editing.value) || undefined, nextFollowUp: editing.nextFollowUp, notes: editing.notes, owner: editing.owner }));
      setRows((x) => x.map((r) => (r.id === editing.id ? { ...r, ...(updated?.id ? updated : editing) } : r)));
      setEditing(null); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doLeadDelete = async () => {
    if (!deleteFor) return;
    setBusy(true);
    try { await salesApi.deleteLead(deleteFor.id); setRows((x) => x.filter((r) => r.id !== deleteFor.id)); setDeleteFor(null); syncAll(); }
    catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doMerge = async () => {
    if (!mergeFor || !mergeTarget || !mergeReason.trim()) { setError('Target lead + merge reason are required.'); return; }
    setBusy(true);
    try {
      const res = unwrapObj(await salesApi.merge(mergeFor.id, mergeTarget, mergeReason.trim()));
      setRows((x) => x.map((r) => (r.id === mergeFor.id ? { ...r, mergedInto: mergeTarget, stage: 'Lost' } : r)));
      setMergeFor(null); setOkMerge(`Merged into ${mergeTarget} — ${(res as any)?.moved ? Object.values((res as any).moved).reduce((a: number, n: unknown) => a + Number(n || 0), 0) : 0} linked records moved.`);
      load(); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const [okMerge, setOkMerge] = useState('');
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Lead Pipeline — View / Edit / Convert / Delete</h3>
          <div className="flex gap-2">
            <ExportButton filename="leads.csv" rows={filteredLeads} columns={['id', 'contactName', 'companyName', 'email', 'stage', 'value', 'owner']} />
            <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New lead</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search contact, company, email, ID…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page)} />}
      {okMerge && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{okMerge}</div>}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New lead" subtitle="New → Contacted → Qualified → … → Won / Lost">
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Contact name *"><input className={kitInput} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></Field>
          <Field label="Company *"><input className={kitInput} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Field>
          <Field label="Email"><input className={kitInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><input className={kitInput} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Industry"><input className={kitInput} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Field>
          <Field label="Lead source"><input className={kitInput} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></Field>
          <Field label="Priority"><Select value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={['Low', 'Medium', 'High'].map((p) => ({ value: p, label: p }))} /></Field>
          <Field label="Next follow-up"><DatePicker value={form.nextFollowUp} onChange={(v) => setForm({ ...form, nextFollowUp: v })} /></Field>
          <Field label="Deal value"><input className={kitInput} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
          <div><Field label="Notes"><input className={kitInput} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Communication consent / lawful basis" hint="Required for outreach — e.g. 'opt-in via website form, 2026-10-01'"><input className={kitInput} value={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.value })} placeholder="How did this contact consent to outreach?" /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy}>Add lead</button>
          </div>
        </form>
      </Modal>
      <input className={inputCls} placeholder="Lost reason (required when marking Lost)" value={reason} onChange={(e) => setReason(e.target.value)} />
      {loading ? <InlineLoading message="Loading leads…" /> : filteredLeads.length === 0 ? (
        <EmptyState title="No leads" message="Add the first sales lead to start the pipeline." />
      ) : (
        <div className="space-y-2">{filteredLeads.map((l) => (
          <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-extrabold text-slate-900 text-sm">{l.contactName} — {l.companyName}{l.mergedInto ? <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px]">merged → {l.mergedInto}</span> : null}</div>
              <div className="text-xs text-slate-500 font-medium">{l.id} • <strong className="text-blue-600">{l.stage}</strong> • ₹{l.value || 0} • owner {l.owner}</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <RowMenu label={`Actions for ${l.id}`} items={[
                { label: 'View 360°', onSelect: async () => { setDetail(l); try { setActivities(unwrapList(await salesApi.activities(l.id))); } catch { setActivities([]); } } },
                { label: 'Edit lead…', onSelect: () => setEditing({ ...l }) },
                ...LEAD_STAGES.filter((s) => s !== l.stage).map((s) => ({ label: `Move to ${s}`, onSelect: () => move(l.id, s) })),
                { label: 'Log meeting', onSelect: () => { setMeetingLead(l); setMeetingForm({ title: 'Follow-up meeting', date: '', hour: '10', minute: '00', outcome: '', notes: '', nextAction: '', followUp: '' }); } },
                { label: 'Proposals', onSelect: async () => { setProposalLead(l); setProposalForm({ title: '', amount: '', validUntil: '' }); try { setProposals(unwrapList(await salesApi.proposals(l.id))); } catch (e) { setError(errMsg(e)); } } },
                { label: 'New opportunity', onSelect: () => { setOppLead(l); setOppValue(String(l.value || '')); } },
                { label: 'Convert to company', onSelect: () => setConvertId(l.id) },
                ...(l.stage !== 'Won' && !l.mergedInto ? [{ label: 'Merge duplicates…', onSelect: () => { setMergeFor(l); setMergeTarget(''); setMergeReason(''); setMergeQ(''); } }] : []),
                { label: 'Delete…', danger: true, onSelect: () => setDeleteFor(l) },
              ]} />
            </div>
          </div>
        ))}</div>
      )}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      <ConfirmDialog
        open={convertId !== ''}
        title="Convert lead to company"
        body="A new organization is provisioned from this lead and the lead is marked Won with history preserved. Continue?"
        confirmLabel="Convert"
        onConfirm={async () => { await convert(convertId); setConvertId(''); }}
        onCancel={() => setConvertId('')}
      />
      <Modal open={mergeFor !== null} onClose={() => setMergeFor(null)} title={`Merge duplicates — ${mergeFor?.id || ''}`} subtitle="Activities, meetings, proposals and opportunities move to the surviving lead. The duplicate is marked Lost with a merge trail.">
        <div className="space-y-3">
          <Field label="Search surviving lead"><input className={kitInput} value={mergeQ} onChange={(e) => setMergeQ(e.target.value)} placeholder="Type contact or company…" /></Field>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {rows.filter((r) => r.id !== mergeFor?.id && !r.mergedInto && (!mergeQ.trim() || `${r.contactName} ${r.companyName}`.toLowerCase().includes(mergeQ.toLowerCase()))).slice(0, 8).map((r) => (
              <button key={r.id} type="button" onClick={() => setMergeTarget(r.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-bold ${mergeTarget === r.id ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200'}`}>
                {r.contactName} — {r.companyName} • {r.id} • {r.stage}
              </button>
            ))}
          </div>
          <Field label="Merge reason *"><input className={kitInput} value={mergeReason} onChange={(e) => setMergeReason(e.target.value)} placeholder="e.g. Same company, duplicate import" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setMergeFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !mergeTarget || !mergeReason.trim()} onClick={doMerge} className={btnPrimary}>{busy ? 'Merging…' : 'Merge leads'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={meetingLead !== null} onClose={() => setMeetingLead(null)} title={`Log meeting — ${meetingLead?.companyName || ''}`} subtitle="Writes a meeting + activity row with outcome and follow-up">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!meetingLead || !meetingForm.date) { setError('Pick a date.'); return; }
            try {
              await salesApi.createMeeting({ leadId: meetingLead.id, title: meetingForm.title, at: `${meetingForm.date}T${meetingForm.hour}:${meetingForm.minute}:00`, outcome: meetingForm.outcome, notes: meetingForm.notes, nextAction: meetingForm.nextAction, followUp: meetingForm.followUp });
              setMeetingLead(null); syncAll();
            } catch (e) { setError(errMsg(e)); }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <Field label="Title"><input className={kitInput} value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })} /></Field>
          <Field label="Outcome"><input className={kitInput} value={meetingForm.outcome} onChange={(e) => setMeetingForm({ ...meetingForm, outcome: e.target.value })} placeholder="e.g. Demo done, wants pricing" /></Field>
          <Field label="Date *"><DatePicker value={meetingForm.date} onChange={(v) => setMeetingForm({ ...meetingForm, date: v })} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Hour"><Select value={meetingForm.hour} onChange={(v) => setMeetingForm({ ...meetingForm, hour: v })} options={Array.from({ length: 24 }, (_, h) => ({ value: `${h}`.padStart(2, '0'), label: `${h}`.padStart(2, '0') }))} /></Field>
            <Field label="Minute"><Select value={meetingForm.minute} onChange={(v) => setMeetingForm({ ...meetingForm, minute: v })} options={['00', '15', '30', '45'].map((m) => ({ value: m, label: m }))} /></Field>
          </div>
          <div className="sm:col-span-2"><Field label="Notes"><input className={kitInput} value={meetingForm.notes} onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })} /></Field></div>
          <Field label="Next action"><input className={kitInput} value={meetingForm.nextAction} onChange={(e) => setMeetingForm({ ...meetingForm, nextAction: e.target.value })} /></Field>
          <Field label="Follow-up date"><DatePicker value={meetingForm.followUp} onChange={(v) => setMeetingForm({ ...meetingForm, followUp: v })} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setMeetingLead(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Log meeting</button>
          </div>
        </form>
      </Modal>
      <Modal open={proposalLead !== null} onClose={() => setProposalLead(null)} title={`Proposals — ${proposalLead?.companyName || ''}`}>
        <div className="space-y-3">
          {proposals.length === 0 && <div className="text-[11px] text-slate-500 font-medium">No proposals yet.</div>}
          {proposals.map((p) => (
            <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
              <span className="truncate">{p.title} • ₹{p.amount} • {p.status}</span>
              <RowMenu label="Proposal actions" items={['Sent', 'Accepted', 'Rejected'].filter((s) => s !== p.status).map((s) => ({ label: `Mark ${s}`, danger: s === 'Rejected', onSelect: async () => {
                try { const u = unwrapObj(await salesApi.setProposalStatus(p.id, s)); setProposals((x) => x.map((y) => (y.id === p.id ? u : y))); syncAll(); }
                catch (e) { setError(errMsg(e)); }
              } }))} />
            </div>
          ))}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!proposalLead || !proposalForm.title.trim()) return;
              try {
                const created = unwrapObj(await salesApi.createProposal({ leadId: proposalLead.id, title: proposalForm.title.trim(), amount: Number(proposalForm.amount) || 0, validUntil: proposalForm.validUntil || undefined }));
                if (created?.id) setProposals((x) => [created, ...x]);
                setProposalForm({ title: '', amount: '', validUntil: '' });
                syncAll();
              } catch (e) { setError(errMsg(e)); }
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200"
          >
            <input className={kitInput} placeholder="Proposal title *" value={proposalForm.title} onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })} />
            <input className={kitInput} type="number" placeholder="Amount" value={proposalForm.amount} onChange={(e) => setProposalForm({ ...proposalForm, amount: e.target.value })} />
            <button className={btnDark}>Add proposal</button>
          </form>
        </div>
      </Modal>
      <Modal open={oppLead !== null} onClose={() => setOppLead(null)} title={`New opportunity — ${oppLead?.companyName || ''}`}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!oppLead) return;
            try {
              await salesApi.createOpportunity({ leadId: oppLead.id, value: Number(oppValue) || 0 });
              setOppLead(null); syncAll();
            } catch (e) { setError(errMsg(e)); }
          }}
          className="space-y-3"
        >
          <Field label="Value (₹)"><input className={kitInput} type="number" value={oppValue} onChange={(e) => setOppValue(e.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOppLead(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Create opportunity</button>
          </div>
        </form>
      </Modal>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit lead — ${editing?.id || ''}`} subtitle="Audited edit">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Contact name"><input className={kitInput} value={editing?.contactName || ''} onChange={(e) => setEditing({ ...editing, contactName: e.target.value })} /></Field>
          <Field label="Company"><input className={kitInput} value={editing?.companyName || ''} onChange={(e) => setEditing({ ...editing, companyName: e.target.value })} /></Field>
          <Field label="Email"><input className={kitInput} value={editing?.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
          <Field label="Phone"><input className={kitInput} value={editing?.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Field>
          <Field label="Deal value"><input className={kitInput} type="number" value={editing?.value || ''} onChange={(e) => setEditing({ ...editing, value: e.target.value })} /></Field>
          <Field label="Owner"><input className={kitInput} value={editing?.owner || ''} onChange={(e) => setEditing({ ...editing, owner: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy} onClick={saveLeadEdit} className={btnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={detail !== null} onClose={() => setDetail(null)} title={`${detail?.contactName || ''} — ${detail?.companyName || ''}`} subtitle={`${detail?.id || ''} • ${detail?.stage || ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Email', detail?.email], ['Phone', detail?.phone], ['Industry', detail?.industry], ['Source', detail?.source], ['Value', detail?.value], ['Owner', detail?.owner], ['Next follow-up', detail?.nextFollowUp], ['Consent basis', detail?.consent], ['Notes', detail?.notes]].map(([k, v]) => (
            <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
          ))}
        </div>
        <div className="text-xs font-extrabold pt-2">Activity timeline ({activities.length})</div>
        {activities.length === 0 ? <div className="text-[11px] text-slate-500">No activities logged.</div> : activities.slice(0, 8).map((a: any) => (
          <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"><strong>{a.type}</strong> • {a.outcome || '—'} • <span className="text-slate-500">{String(a.createdAt || '').slice(0, 10)}</span><div className="text-slate-600">{a.notes || ''}</div></div>
        ))}
      </Modal>
      <ConfirmDialog open={deleteFor !== null} onCancel={() => setDeleteFor(null)} title={`Delete lead ${deleteFor?.id || ''}?`} body="Won leads cannot be deleted (audit). Other leads are removed permanently." confirmLabel="Delete" onConfirm={doLeadDelete} />
    </div>
  );
}

/* ---------------- Phase 4: Performance ---------------- */

/* ---------------- Phase 4: Performance ---------------- */
export function PerformancePanel() {
  const [kpi, setKpi] = useState<any>(null);
  const [targets, setTargets] = useState<any[]>([]);
  const [opps, setOpps] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ owner: '', period: '', goal: '' });
  const [showTarget, setShowTarget] = useState(false);
  const [editingTargetState, setEditingTargetState] = useState('');
  const load = async () => {
    setError('');
    try { setKpi(unwrapObj(await salesApi.performance())); setTargets(unwrapList(await salesApi.targets())); setOpps(unwrapList(await salesApi.opportunities())); }
    catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.owner) return;
    try {
      if (editingTargetState) {
        const u = unwrapObj(await salesApi.updateTarget(editingTargetState, { ...form, goal: Number(form.goal) || 0 }));
        setTargets((x) => x.map((t) => (t.id === editingTargetState ? { ...t, ...(u?.id ? u : form) } : t)));
      } else {
        const t = unwrapObj(await salesApi.createTarget({ ...form, goal: Number(form.goal) || 0 })); if (t?.id) setTargets((x) => [t, ...x]);
      }
      setForm({ owner: '', period: '', goal: '' }); setEditingTargetState(''); setShowTarget(false); syncAll();
    }
    catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Sales Performance & Targets</h3>
        <button type="button" onClick={() => { setForm({ owner: '', period: '', goal: '' }); setEditingTargetState(''); setShowTarget(true); }} className={btnDark}>+ Set target</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {kpi ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[['Assigned', kpi.leadsAssigned], ['Qualified', kpi.qualified], ['Won', kpi.won], ['Lost', kpi.lost], ['Conversion', `${(Number(kpi.conversionRate || 0) * 100).toFixed(1)}%`], ['Pipeline ₹', kpi.pipelineValue], ['Proposals', kpi.proposals], ['Overdue follow-ups', kpi.overdueFollowups]].map(([k, v]) => (
            <div key={k as string} className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><div className="text-[11px] font-bold text-slate-500">{k}</div><div className="text-xl font-extrabold">{String(v)}</div></div>
          ))}
        </div>
      ) : <InlineLoading message="Loading performance…" />}
      <Modal open={showTarget} onClose={() => setShowTarget(false)} title="Set sales target">
        <form onSubmit={create} className="space-y-3">
          <Field label="Owner email *"><input className={kitInput} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></Field>
          <Field label="Period (e.g. 2026-Q4)"><input className={kitInput} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></Field>
          <Field label="Goal"><input className={kitInput} type="number" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowTarget(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnDark}>Set target</button>
          </div>
        </form>
      </Modal>
      <div className="text-xs font-extrabold text-slate-700">Targets ({targets.length}) — Edit / Delete</div>
      {targets.length === 0 && <div className="text-[11px] text-slate-500 font-medium">No targets set. Targets drive BDA accountability.</div>}
      {targets.map((t) => (
        <div key={t.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
          <span className="truncate">{t.owner} • {t.period} • goal {t.goal}</span>
          <RowMenu label={`Target ${t.id}`} items={[
            { label: 'Edit…', onSelect: () => { setForm({ owner: t.owner || '', period: t.period || '', goal: String(t.goal || '') }); setEditingTargetState(t.id); setShowTarget(true); } },
            { label: 'Delete', danger: true, onSelect: async () => { try { await salesApi.deleteTarget(t.id); setTargets((x) => x.filter((y) => y.id !== t.id)); syncAll(); } catch (e) { setError(errMsg(e)); } } },
          ]} />
        </div>
      ))}
      <div className="text-xs font-extrabold text-slate-700 pt-1">Opportunities ({opps.length})</div>
      {opps.length === 0 && <div className="text-[11px] text-slate-500 font-medium">No opportunities yet — create one from a lead.</div>}
      {opps.map((o) => (
        <div key={o.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
          <span className="truncate">{o.title} • ₹{o.value} • <strong className="text-blue-600">{o.stage}</strong></span>
          <RowMenu label="Opportunity actions" items={['Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'].filter((s) => s !== o.stage).map((s) => ({ label: `Move to ${s}`, danger: s === 'Lost', onSelect: async () => {
            try { const u = unwrapObj(await salesApi.setOpportunityStage(o.id, s)); setOpps((x) => x.map((y) => (y.id === o.id ? u : y))); syncAll(); }
            catch (e) { setError(errMsg(e)); }
          } }))} />
        </div>
      ))}
    </div>
  );
}

/* ---------------- Phase 4: Submissions ---------------- */
export function SubmissionsPanel({ canReview = false }: { canReview?: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ jobId: '', candidateEmail: '', consent: '' });
  const [busy, setBusy] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      const res: any = await salesApi.submissions(`?page=${p}&pageSize=${pageSize}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || 0));
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.jobId.trim() || !form.candidateEmail.trim()) return;
    setBusy(true);
    try {
      const s = unwrapObj(await salesApi.submit(form));
      if (s?.id) setRows((x) => [s, ...x]);
      setForm({ jobId: '', candidateEmail: '', consent: '' });
      setShowSubmit(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const review = async (id: string, status: string) => {
    try { const u = unwrapObj(await salesApi.setSubmission(id, status)); setRows((x) => x.map((s) => (s.id === id ? u : s))); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Agency Submissions {canReview ? '& Review' : ''}</h3>
        <button type="button" onClick={() => setShowSubmit(true)} className={btnPrimary}>+ Submit candidate</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      <Modal open={showSubmit} onClose={() => setShowSubmit(false)} title="Submit candidate" subtitle="Duplicates route to review — never auto-rejected">
        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <Field label="Job ID *"><input className={kitInput} value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })} /></Field>
          <Field label="Candidate email *"><input className={kitInput} value={form.candidateEmail} onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })} /></Field>
          <Field label="Consent evidence ref" hint="Authorization proof for this submission"><input className={kitInput} value={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowSubmit(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy}>{busy ? 'Submitting…' : 'Submit candidate'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading submissions…" /> : rows.length === 0 ? (
        <EmptyState title="No submissions" message="Agency submissions appear here; duplicates route to Duplicate-Review, never auto-reject." />
      ) : (
        <div className="space-y-2">{rows.map((s) => (
          <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 text-sm truncate">{s.candidateEmail} → {s.jobId}</div>
              <div className="text-xs text-slate-500 font-medium">{s.id} • <strong className={s.status === 'Duplicate-Review' ? 'text-amber-600' : 'text-blue-600'}>{s.status}</strong>{s.duplicateOf ? ` • possible duplicate of ${s.duplicateOf}` : ''}</div>
            </div>
            {canReview && (
              <RowMenu items={['Under Review', 'Shortlisted', 'Rejected', 'Withdrawn'].filter((x) => x !== s.status).map((x) => ({ label: `Mark ${x}`, danger: x === 'Rejected', onSelect: () => review(s.id, x) }))} />
            )}
          </div>
        ))}        </div>
      )}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
    </div>
  );
}

/* ---------------- Timesheets (vendor submit → employer approve) ---------------- */
export function TimesheetsPanel({ canApprove = false }: { canApprove?: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [review, setReview] = useState<{ id: string; decision: 'approve' | 'reject' } | null>(null);
  const [form, setForm] = useState({ contractorId: '', period: '', hours: '', notes: '' });
  const pageSize = 10;
  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      const res: any = await workforceApi.timesheets(`?page=${p}&pageSize=${pageSize}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || 0));
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page ]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contractorId.trim() || !form.period.trim() || !(Number(form.hours) > 0)) return;
    try {
      const created = unwrapObj(await workforceApi.submitTimesheet({ ...form, hours: Number(form.hours) }));
      if (created?.id) setRows((r) => [created, ...r]);
      setForm({ contractorId: '', period: '', hours: '', notes: '' });
      setShowSubmit(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Timesheets</h3>
        <button type="button" onClick={() => setShowSubmit(true)} className={btnPrimary}>+ Submit timesheet</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      <Modal open={showSubmit} onClose={() => setShowSubmit(false)} title="Submit timesheet" subtitle="Submitted → Approved / Rejected, one decision only">
        <form onSubmit={submit} className="space-y-3">
          <Field label="Contractor ID *"><input className={kitInput} value={form.contractorId} onChange={(e) => setForm({ ...form, contractorId: e.target.value })} /></Field>
          <Field label="Period *"><input className={kitInput} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="e.g. 2026-10-W2" /></Field>
          <Field label="Hours *"><input className={kitInput} type="number" min={1} value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></Field>
          <Field label="Notes"><input className={kitInput} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowSubmit(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Submit</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading timesheets…" /> : rows.length === 0 ? (
        <EmptyState title="No timesheets" message="Submitted timesheets appear here for review." />
      ) : (
        <div className="space-y-2">
          {rows.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 text-sm truncate">{t.contractorName || t.contractorId} • {t.hours}h • {t.period}</div>
                <div className="text-xs text-slate-500 font-medium">{t.id} • <strong className={t.status === 'Approved' ? 'text-emerald-600' : t.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}>{t.status}</strong>{t.reviewedBy ? ` • by ${t.reviewedBy}` : ''}</div>
              </div>
              {canApprove && t.status === 'Submitted' && (
                <RowMenu label="Review timesheet" items={[
                  { label: 'Approve', onSelect: () => setReview({ id: t.id, decision: 'approve' }) },
                  { label: 'Reject', danger: true, onSelect: () => setReview({ id: t.id, decision: 'reject' }) },
                ]} />
              )}
            </div>
          ))}
        </div>
      )}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      <ConfirmDialog
        open={review !== null}
        title={review?.decision === 'approve' ? 'Approve timesheet' : 'Reject timesheet'}
        body={review?.decision === 'approve' ? 'Approve these hours for billing?' : 'Reject these hours? The vendor sees your note.'}
        confirmLabel={review?.decision === 'approve' ? 'Approve' : 'Reject'}
        requireReason={review?.decision === 'reject' ? 'Reason' : undefined}
        onConfirm={async (note) => {
          if (!review) return;
          const updated = unwrapObj(await workforceApi.reviewTimesheet(review.id, review.decision, note));
          setRows((r) => r.map((x) => (x.id === review.id ? updated : x)));
          setReview(null);
          syncAll();
        }}
        onCancel={() => setReview(null)}
      />
    </div>
  );
}

/* ---------------- Phase 4/5: Reports ---------------- */
const REPORTS = ['candidate-pipeline', 'requisition-ageing', 'receivables', 'commission-liabilities', 'sales-pipeline', 'recruiter-workload'];
export function ReportsPanel() {
  const [name, setName] = useState('candidate-pipeline');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const run = async () => {
    setLoading(true); setError('');
    try { setReport(unwrapObj(await platformApi.report(name))); }
    catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { run(); }, []);
  return (
    <div className={cardCls}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Operational Reports</h3>
        <div className="flex gap-2 items-center">
          <div style={{ width: 220 }}>
            <Select value={name} onChange={(v) => { setName(v); }} ariaLabel="Report" placeholder="Choose report" options={REPORTS.map((r) => ({ value: r, label: r }))} />
          </div>
          <button type="button" className={btnDark} onClick={run}>Run</button>
        </div>
      </div>
      {error && <PanelError message={error} onRetry={run} />}
      {loading ? <InlineLoading message="Running report…" /> : report ? (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="font-bold text-slate-500">Definition: {report.definition} • generated {report.generatedAt} • {report.freshness}</div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800">{JSON.stringify(report.data, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- Phase 5: Notifications ---------------- */
export function NotificationsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [prefs, setPrefs] = useState<any>({ inApp: true, email: true });
  const [error, setError] = useState('');
  const load = async () => {
    setError('');
    try { setRows(unwrapList(await platformApi.notifications())); const p = unwrapList(await platformApi.prefs()); if (p[0]) setPrefs(p[0]); }
    catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const save = async () => {
    try { await platformApi.savePrefs(prefs); } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <h3 className="text-base font-extrabold text-slate-900">Notifications & Preferences</h3>
      {error && <PanelError message={error} onRetry={load} />}
      <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
        <input type="checkbox" checked={!!prefs.inApp} onChange={(e) => setPrefs({ ...prefs, inApp: e.target.checked })} /> In-app
        <input type="checkbox" checked={!!prefs.email} onChange={(e) => setPrefs({ ...prefs, email: e.target.checked })} className="ml-3" /> Email
        <button type="button" className={btnDark} onClick={save}>Save</button>
      </label>
      {rows.length === 0 ? <EmptyState title="No notifications" message="Stage changes, interviews, payments and chat events land here." /> : (
        <div className="space-y-2">{rows.slice(0, 30).map((n) => (
          <div key={n.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
            <span><strong>[{n.kind}]</strong> {n.body} <span className="text-slate-500">• {n.status}</span></span>
            {n.status !== 'read' && (
              <button type="button" className="text-[11px] font-bold text-blue-600 underline shrink-0" onClick={async () => {
                try { await platformApi.markRead(n.id); setRows((x) => x.map((y) => (y.id === n.id ? { ...y, status: 'read' } : y))); }
                catch (e) { setError(errMsg(e)); }
              }}>Mark read</button>
            )}
          </div>
        ))}</div>
      )}
    </div>
  );
}

/* ---------------- SuperAdmin: candidate directory (§6.3, full) ---------------- */
export function CandidatesPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useQueryState('cand_q');
  const [status, setStatus] = useQueryState('cand_status');
  const [fSkills, setFSkills] = useQueryState('cand_skills');
  const [fExpMin, setFExpMin] = useQueryState('cand_expmin');
  const [fExpMax, setFExpMax] = useQueryState('cand_expmax');
  const [fLocation, setFLocation] = useQueryState('cand_loc');
  const [fComp, setFComp] = useQueryState('cand_comp');
  const [fStage, setFStage] = useQueryState('cand_stage');
  const [fFrom, setFFrom] = useQueryState('cand_from');
  const [fTo, setFTo] = useQueryState('cand_to');
  const [fSource, setFSource] = useQueryState('cand_src');
  const [fRecruiter, setFRecruiter] = useQueryState('cand_rec');
  const dq = useDebounced(q);
  const dSkills = useDebounced(fSkills);
  const dLocation = useDebounced(fLocation);
  const dSource = useDebounced(fSource);
  const dRecruiter = useDebounced(fRecruiter);
  const advActive = [fSkills, fExpMin, fExpMax, fLocation, fComp, fStage, fFrom, fTo, fSource, fRecruiter].some((v) => String(v || '').trim() !== '');
  const [showAdv, setShowAdv] = useState(advActive);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', roleTitle: '', experienceYears: '', location: '', preferredLocation: '', currentCtc: '', expectedCtc: '', noticePeriod: '', skills: '', visibility: 'standard', assignedRecruiter: '', source: '' });
  const [statusFor, setStatusFor] = useState<any>(null);
  const [statusForm, setStatusForm] = useState({ status: 'Suspended', reason: '', reviewDate: '' });
  const [busy, setBusy] = useState(false);
  const [infoFor, setInfoFor] = useState<any>(null);
  const [infoMsg, setInfoMsg] = useState('');
  const [delFor, setDelFor] = useState<any>(null);
  const [delReason, setDelReason] = useState('');
  const [purgeFor, setPurgeFor] = useState<any>(null);
  const [delReqFor, setDelReqFor] = useState<any>(null);
  const [delReqReason, setDelReqReason] = useState('');
  const pageSize = 10;
  const params = useMemo(() => {
    const sp = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) sp.set('status', status);
    if (dq.trim()) sp.set('q', dq.trim());
    if (dSkills.trim()) sp.set('skills', dSkills.trim());
    if (fExpMin !== '') sp.set('expMin', fExpMin);
    if (fExpMax !== '') sp.set('expMax', fExpMax);
    if (dLocation.trim()) sp.set('location', dLocation.trim());
    if (fComp) sp.set('completeness', fComp);
    if (fStage) sp.set('stage', fStage);
    if (fFrom) sp.set('registeredFrom', fFrom);
    if (fTo) sp.set('registeredTo', fTo);
    if (dSource.trim()) sp.set('source', dSource.trim());
    if (dRecruiter.trim()) sp.set('recruiter', dRecruiter.trim());
    return sp.toString();
  }, [page, status, dq, dSkills, fExpMin, fExpMax, dLocation, fComp, fStage, fFrom, fTo, dSource, dRecruiter]);
  const load = async (qs: string) => {
    setLoading(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const res: any = await directoryApi.candidatesDirectory(`?${qs}`);
      setRows(unwrapList(res));
      setTotal(Number((res as { pagination?: { total?: number } })?.pagination?.total ?? unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(params); }, [params]);
  const resetPage = () => setPage(1);
  const clearAdv = () => {
    setFSkills(''); setFExpMin(''); setFExpMax(''); setFLocation(''); setFComp('');
    setFStage(''); setFFrom(''); setFTo(''); setFSource(''); setFRecruiter(''); resetPage();
  };
  const openEdit = (c: any) => {
    setEditing(c);
    setEditForm({ name: c.name || '', phone: c.phone || '', roleTitle: c.roleTitle || '', experienceYears: String(c.experienceYears ?? ''), location: c.location || '', preferredLocation: c.preferredLocation || '', currentCtc: String(c.currentCtc ?? ''), expectedCtc: String(c.expectedCtc ?? ''), noticePeriod: c.noticePeriod || '', skills: Array.isArray(c.skills) ? c.skills.join(', ') : (c.skills || ''), visibility: c.visibility || 'standard', assignedRecruiter: c.assignedRecruiter || '', source: c.source || c.sourceType || '' });
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editing) return;
    setBusy(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const res: any = await directoryApi.updateCandidate(editing.id, { ...editForm, experienceYears: Number(editForm.experienceYears) || undefined });
      const updated = (res as { data?: any })?.data || res;
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...x, ...(updated?.id ? updated : editForm) } : x)));
      setEditing(null); setOk(`Candidate ${editing.id} updated (audited).`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doStatus = async () => {
    if (!statusFor || !statusForm.reason.trim()) { setError('Reason is required for suspend/block/restore.'); return; }
    setBusy(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const res: any = await directoryApi.setCandidateStatus(statusFor.id, statusForm.status, statusForm.reason.trim(), statusForm.reviewDate || undefined);
      const updated = (res as { data?: any })?.data;
      const revoked = (res as { sessionsRevoked?: number })?.sessionsRevoked || 0;
      setRows((r) => r.map((x) => (x.id === statusFor.id ? { ...x, ...(updated || { status: statusForm.status }) } : x)));
      setStatusFor(null); setOk(`Candidate ${statusFor.id} → ${statusForm.status}${revoked ? ` (${revoked} session(s) revoked)` : ''}.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDelete = async () => {
    if (!delFor || !delReason.trim()) { setError('Deletion reason is required.'); return; }
    setBusy(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      await directoryApi.deleteCandidate(delFor.id, delReason.trim());
      setRows((r) => r.map((x) => (x.id === delFor.id ? { ...x, status: 'Deleted' } : x)));
      setDelFor(null); setDelReason(''); setOk(`Candidate ${delFor.id} soft-deleted (recoverable via purge or restore).`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doPurge = async () => {
    if (!purgeFor) return;
    setBusy(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      await directoryApi.purgeCandidate(purgeFor.id, 'purged after soft-delete review');
      setRows((r) => r.filter((x) => x.id !== purgeFor.id));
      setPurgeFor(null); setOk(`Candidate ${purgeFor.id} permanently purged. Consents + audit preserved.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doInfoRequest = async () => {
    if (!infoFor || !infoMsg.trim()) { setError('A message is required.'); return; }
    setBusy(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      await directoryApi.requestInfo(infoFor.id, infoMsg.trim());
      setInfoFor(null); setInfoMsg(''); setOk(`Information requested from ${infoFor.id} (candidate notified).`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDeletionRequest = async () => {
    if (!delReqFor || !delReqReason.trim()) { setError('A reason is required.'); return; }
    setBusy(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      await directoryApi.requestDeletion(delReqFor.id, delReqReason.trim());
      setDelReqFor(null); setDelReqReason(''); setOk(`Deletion request opened for ${delReqFor.id} — decide it in the 360° Admin tab.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const candidateColumns = ['id', 'name', 'email', 'phone', 'roleTitle', 'experienceYears', 'preferredLocation', 'recruiter', 'source', 'latestStage', 'completeness', 'applicationCount', 'lastActivity', 'registrationDate', 'visibility', 'status'];
  const pill = (s: string) => {
    const tone = s === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s === 'Suspended' || s === 'Blocked' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200';
    return <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${tone}`}>{s || 'Active'}</span>;
  };
  const menuFor = (c: any) => (
    <RowMenu items={[
      { label: 'View 360°', onSelect: () => setDetail(c) },
      { label: 'Edit profile', onSelect: () => openEdit(c) },
      { label: 'Suspend / Block / Restore…', onSelect: () => { setStatusFor(c); setStatusForm({ status: 'Suspended', reason: '', reviewDate: '' }); } },
      { label: 'Request information…', onSelect: () => { setInfoFor(c); setInfoMsg(''); } },
      { label: 'Deletion request…', onSelect: () => { setDelReqFor(c); setDelReqReason(''); } },
      ...(c.status === 'Deleted'
        ? [{ label: 'Purge permanently…', danger: true, onSelect: () => setPurgeFor(c) }]
        : [{ label: 'Delete (soft)…', danger: true, onSelect: () => { setDelFor(c); setDelReason(''); } }]),
    ]} />
  );
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-extrabold text-slate-900">Candidate Directory — View / Edit / Suspend / Request / Export</h3>
        <p className="text-xs text-slate-500 font-medium">Phone/CTC masked unless your role grants sensitive-field access. {total} record(s) match. All changes are audited.</p>
      </div>
      {error && <PanelError message={error} onRetry={() => load(params)} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1"><input className={inputCls} placeholder="Search ID, name, email, title…" value={q} onChange={(e) => { setQ(e.target.value); resetPage(); }} /></div>
        <div className="flex gap-2">
          <div className="w-36 shrink-0">
            <Select value={status} onChange={(v) => { setStatus(v); resetPage(); }} ariaLabel="Account status" placeholder="All statuses"
              options={[{ value: '', label: 'All statuses' }, ...['Active', 'Suspended', 'Blocked', 'Deleted'].map((s) => ({ value: s, label: s }))]} />
          </div>
          <button type="button" onClick={() => setShowAdv((v) => !v)} aria-expanded={showAdv} className={`px-4 py-2 rounded-xl border font-bold text-xs whitespace-nowrap ${showAdv || advActive ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-700'}`}>
            Filters{advActive ? ' •' : ''} {showAdv ? '▴' : '▾'}
          </button>
          <ExportButton filename="candidates.csv" rows={rows} columns={candidateColumns} />
        </div>
      </div>
      {showAdv && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <input className={kitInput} placeholder="Skills…" value={fSkills} aria-label="Skills filter" onChange={(e) => { setFSkills(e.target.value); resetPage(); }} />
          <input className={kitInput} placeholder="Location…" value={fLocation} aria-label="Location filter" onChange={(e) => { setFLocation(e.target.value); resetPage(); }} />
          <div className="flex gap-2">
            <input className={kitInput} type="number" min={0} placeholder="Min yrs" value={fExpMin} aria-label="Minimum experience" onChange={(e) => { setFExpMin(e.target.value); resetPage(); }} />
            <input className={kitInput} type="number" min={0} placeholder="Max yrs" value={fExpMax} aria-label="Maximum experience" onChange={(e) => { setFExpMax(e.target.value); resetPage(); }} />
          </div>
          <Select value={fComp} onChange={(v) => { setFComp(v); resetPage(); }} ariaLabel="Profile completeness" placeholder="Any completeness"
            options={[{ value: '', label: 'Any completeness' }, { value: 'lt50', label: 'Under 50%' }, { value: 'btw50_80', label: '50–80%' }, { value: 'gt80', label: 'Over 80%' }]} />
          <Select value={fStage} onChange={(v) => { setFStage(v); resetPage(); }} ariaLabel="Application stage" placeholder="Any stage"
            options={[{ value: '', label: 'Any stage' }, ...APP_STAGES.map((s) => ({ value: s, label: s }))]} />
          <input className={kitInput} placeholder="Source…" value={fSource} aria-label="Source filter" onChange={(e) => { setFSource(e.target.value); resetPage(); }} />
          <input className={kitInput} placeholder="Recruiter…" value={fRecruiter} aria-label="Recruiter filter" onChange={(e) => { setFRecruiter(e.target.value); resetPage(); }} />
          <div className="flex gap-2">
            <div className="flex-1 min-w-0"><DatePicker value={fFrom} onChange={(v) => { setFFrom(v); resetPage(); }} ariaLabel="Registered from" placeholder="From date" /></div>
            <div className="flex-1 min-w-0"><DatePicker value={fTo} onChange={(v) => { setFTo(v); resetPage(); }} ariaLabel="Registered to" placeholder="To date" /></div>
          </div>
          <div className="col-span-2 lg:col-span-4 flex justify-end">
            <button type="button" onClick={clearAdv} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Clear all filters</button>
          </div>
        </div>
      )}
      {loading ? <InlineLoading message="Loading candidates…" /> : rows.length === 0 ? (
        <EmptyState title="No candidates match" message="Adjust search or filters." />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {rows.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{c.name || '—'}</div>
                  <div className="font-mono text-[11px] text-slate-500">{c.id}</div>
                </div>
                {menuFor(c)}
              </div>
              <div className="text-slate-600 font-medium truncate">{c.roleTitle || '—'} • {c.experienceYears ?? '—'}y • {c.completeness ?? '—'}%</div>
              <div className="flex flex-wrap items-center gap-1.5">{pill(c.status || 'Active')}<span className="text-slate-500 font-bold">{c.applicationCount ?? 0} apps</span></div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[1500px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Skills</th><th className="px-4 py-3">Profile</th><th className="px-4 py-3">Apps</th><th className="px-4 py-3">Preferred location</th><th className="px-4 py-3">Recruiter</th><th className="px-4 py-3">Last activity</th><th className="px-4 py-3">Registered</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{c.name || '—'}</div><div className="font-mono text-[11px] text-slate-500">{c.id}</div></td>
                  <td className="px-4 py-3"><div>{c.email || '—'}</div><div className="text-slate-500">{c.phone || '—'}</div></td>
                  <td className="px-4 py-3">{c.roleTitle || '—'} • {c.experienceYears ?? '—'}y</td>
                  <td className="px-4 py-3 max-w-[200px]"><div className="truncate" title={Array.isArray(c.skills) ? c.skills.join(', ') : (c.skills || '')}>{Array.isArray(c.skills) ? c.skills.join(', ') : (c.skills || '—')}</div></td>
                  <td className="px-4 py-3 font-bold text-emerald-700">{c.completeness ?? '—'}{c.completeness !== undefined ? '%' : ''}</td>
                  <td className="px-4 py-3 font-bold text-blue-700">{c.applicationCount ?? '—'}</td>
                  <td className="px-4 py-3">{c.preferredLocation || c.location || '—'}</td>
                  <td className="px-4 py-3">{c.recruiter || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{c.lastActivity ? String(c.lastActivity).slice(0, 10) : '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{c.registrationDate || '—'}</td>
                  <td className="px-4 py-3">{pill(c.status || 'Active')}</td>
                  <td className="px-4 py-3"><div className="flex justify-end">{menuFor(c)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      {detail && (
        <Candidate360Drawer candidateId={detail.id} onClose={() => { setDetail(null); load(params); }} />
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit candidate — ${editing?.id || ''}`} subtitle="Audited edit">
        <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name"><input className={kitInput} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Field>
          <Field label="Phone"><input className={kitInput} value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></Field>
          <Field label="Designation"><input className={kitInput} value={editForm.roleTitle} onChange={(e) => setEditForm({ ...editForm, roleTitle: e.target.value })} /></Field>
          <Field label="Experience (yrs)"><input className={kitInput} type="number" value={editForm.experienceYears} onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })} /></Field>
          <Field label="Location"><input className={kitInput} value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /></Field>
          <Field label="Preferred location"><input className={kitInput} value={editForm.preferredLocation} onChange={(e) => setEditForm({ ...editForm, preferredLocation: e.target.value })} placeholder="Preferred work location" /></Field>
          <Field label="Assigned recruiter"><input className={kitInput} value={editForm.assignedRecruiter} onChange={(e) => setEditForm({ ...editForm, assignedRecruiter: e.target.value })} placeholder="Name or email" /></Field>
          <Field label="Source"><input className={kitInput} value={editForm.source} onChange={(e) => setEditForm({ ...editForm, source: e.target.value })} placeholder="e.g. Referral, Portal, Agency" /></Field>
          <Field label="Visibility"><Select value={editForm.visibility} onChange={(v) => setEditForm({ ...editForm, visibility: v })} options={['standard', 'open', 'private', 'anonymous'].map((v) => ({ value: v, label: v }))} /></Field>
          <Field label="Current CTC"><input className={kitInput} value={editForm.currentCtc} onChange={(e) => setEditForm({ ...editForm, currentCtc: e.target.value })} /></Field>
          <Field label="Expected CTC"><input className={kitInput} value={editForm.expectedCtc} onChange={(e) => setEditForm({ ...editForm, expectedCtc: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Skills (comma separated)"><input className={kitInput} value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy} className={btnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>
      <Modal open={statusFor !== null} onClose={() => setStatusFor(null)} title={`Account status — ${statusFor?.id || ''}`} subtitle="Reason is mandatory and audited; suspend/block revokes sessions">
        <div className="space-y-3">
          <Field label="Status"><Select value={statusForm.status} onChange={(v) => setStatusForm({ ...statusForm, status: v })} options={['Active', 'Suspended', 'Blocked'].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="Reason *"><textarea rows={3} className={kitInput} value={statusForm.reason} onChange={(e) => setStatusForm({ ...statusForm, reason: e.target.value })} placeholder="e.g. Fake profile — support ticket SUP-88" /></Field>
          <Field label="Review / expiry date (optional)" hint="When this suspension must be reviewed"><DatePicker value={statusForm.reviewDate} onChange={(v) => setStatusForm({ ...statusForm, reviewDate: v })} ariaLabel="Review date" placeholder="No expiry" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setStatusFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !statusForm.reason.trim()} onClick={doStatus} className={btnDark}>{busy ? 'Working…' : 'Confirm'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={infoFor !== null} onClose={() => setInfoFor(null)} title={`Request information — ${infoFor?.name || infoFor?.id || ''}`} subtitle="The candidate is notified in-app; the request is tracked">
        <div className="space-y-3">
          <Field label="What do you need? *"><textarea rows={3} className={kitInput} value={infoMsg} onChange={(e) => setInfoMsg(e.target.value)} placeholder="e.g. Please upload your latest payslip for BGV" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setInfoFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !infoMsg.trim()} onClick={doInfoRequest} className={btnPrimary}>{busy ? 'Sending…' : 'Send request'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={delFor !== null} onClose={() => setDelFor(null)} title={`Soft-delete ${delFor?.name || delFor?.id || ''}?`} subtitle="Recoverable: status → Deleted, profile hidden. Purge or restore afterwards.">
        <div className="space-y-3">
          <Field label="Deletion reason *"><textarea rows={3} className={kitInput} value={delReason} onChange={(e) => setDelReason(e.target.value)} placeholder="e.g. Duplicate test profile" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDelFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !delReason.trim()} onClick={doDelete} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Working…' : 'Soft-delete'}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={purgeFor !== null} onCancel={() => setPurgeFor(null)} title={`Permanently purge ${purgeFor?.id || ''}?`} body="Allowed only with zero applications, interviews, placements and commissions. Consents + audit trail are preserved. This cannot be undone." confirmLabel="Purge permanently" onConfirm={doPurge} />
      <Modal open={delReqFor !== null} onClose={() => setDelReqFor(null)} title={`Deletion request — ${delReqFor?.name || delReqFor?.id || ''}`} subtitle="Approval anonymizes PII but preserves financial + audit records">
        <div className="space-y-3">
          <Field label="Reason *"><textarea rows={3} className={kitInput} value={delReqReason} onChange={(e) => setDelReqReason(e.target.value)} placeholder="e.g. Candidate invoked right-to-erasure via support" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDelReqFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !delReqReason.trim()} onClick={doDeletionRequest} className={btnPrimary}>{busy ? 'Opening…' : 'Open request'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- Documents: upload / download (§7.1) ---------------- */
export function DocumentsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<{ name: string; mime: string; data: string } | null>(null);
  const load = async () => {
    setLoading(true); setError('');
    try { setRows(unwrapList(await documentsApi.list())); }
    catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const pick = async (f: File | undefined) => {
    if (!f) { setFile(null); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    const buf = await f.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    setFile({ name: f.name, mime: f.type || 'application/pdf', data: btoa(binary) });
  };
  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Choose a file first.'); return; }
    setBusy(true);
    try {
      const created = unwrapObj(await documentsApi.upload({ ...file, kind: 'resume' }));
      if (created?.id) setRows((r) => [created, ...r]);
      setFile(null); setShowUpload(false); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Documents & Resume</h3>
        <button type="button" onClick={() => setShowUpload(true)} className={btnPrimary}>+ Upload</button>
      </div>
      <div className="text-[11px] font-bold text-slate-500">PDF/DOC/DOCX/PNG/JPG up to 5 MB. Latest resume links to your profile automatically.</div>
      {error && <PanelError message={error} onRetry={load} />}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload document">
        <form onSubmit={upload} className="space-y-3">
          <Field label="File *"><input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => pick(e.target.files?.[0])} className="w-full text-xs font-semibold text-slate-700" /></Field>
          {file && <div className="text-[11px] font-bold text-slate-600">{file.name} • {file.mime}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy || !file}>{busy ? 'Uploading…' : 'Upload'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading documents…" /> : rows.length === 0 ? (
        <EmptyState title="No documents" message="Upload your resume to attach it to applications." />
      ) : (
        <div className="space-y-2">
          {rows.map((d) => (
            <div key={d.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
              <span className="truncate">{d.name} • v{d.version} • {(Number(d.size || 0) / 1024).toFixed(0)} KB • {String(d.uploadedAt).slice(0, 10)}</span>
              <RowMenu label="Document actions" items={[{ label: 'Download', onSelect: () => window.open(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000'}${documentsApi.downloadUrl(d.id)}`, '_blank', 'noopener') }]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Consent center (§15.2) ---------------- */
export function ConsentPanel() {
  const [_consent, setConsent] = useState<any>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [visibility, setVisibility] = useState('standard');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const load = async () => {
    setError('');
    try {
      const rows = unwrapList(await documentsApi.consents());
      const c = rows[0] || null;
      setConsent(c);
      if (c) { setMarketing(!!c.marketing); setVisibility(c.visibility || 'standard'); }
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const save = async () => {
    setError(''); setOk('');
    try {
      const updated = unwrapObj(await documentsApi.saveConsents({ marketing, visibility }));
      setConsent(updated); setOk('Preferences saved.'); syncAll();
      try {
        const gtag = (window as any).gtag;
        if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: marketing ? 'granted' : 'denied' });
      } catch { /* analytics bridge best-effort */ }
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Privacy & Consent</h3>
        <button type="button" onClick={save} className={btnPrimary}>Save preferences</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Marketing communications
      </label>
      <div style={{ maxWidth: 280 }}>
        <Field label="Profile visibility">
          <Select value={visibility} onChange={setVisibility} options={[{ value: 'standard', label: 'Standard' }, { value: 'open', label: 'Open to offers' }, { value: 'private', label: 'Private' }, { value: 'anonymous', label: 'Anonymous search' }]} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            try {
              const blob = new Blob([JSON.stringify(unwrapObj(await documentsApi.exportData()), null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'nexatalent-data-export.json'; a.click();
              URL.revokeObjectURL(url);
            } catch (e) { setError(errMsg(e)); }
          }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs"
        >
          Export my data (JSON)
        </button>
        <button type="button" onClick={() => setShowWithdraw(true)} className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs">Withdraw consent</button>
      </div>
      <ConfirmDialog
        open={showWithdraw}
        title="Withdraw consent"
        body="Marketing stops and your profile switches to private. Applications and financial records are preserved as required."
        confirmLabel="Withdraw"
        onConfirm={async () => { const u = unwrapObj(await documentsApi.withdrawConsents()); setConsent(u); setMarketing(false); setVisibility('private'); setShowWithdraw(false); syncAll(); }}
        onCancel={() => setShowWithdraw(false)}
      />
    </div>
  );
}

/* ---------------- Agency directory (§6.5/§9.1) ---------------- */
const blankAgency: Record<string, string> = { legalName: '', displayName: '', entityType: '', country: '', registrationNumber: '', taxIds: '', website: '', address: '', contactName: '', contactEmail: '', contactPhone: '', specialties: '', locations: '', recruiterCount: '', tenantId: '', accountManager: '', commercialModel: '', agreementStatus: 'Draft' };

export function AgencyPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useQueryState('ag_q');
  const [status, setStatus] = useQueryState('ag_status');
  const [verification, setVerification] = useQueryState('ag_ver');
  const dq = useDebounced(q);
  const [showAdv, setShowAdv] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ ...blankAgency });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [suspendFor, setSuspendFor] = useState<any>(null);
  const [suspendForm, setSuspendForm] = useState({ action: 'Suspended', reason: '' });
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [delReason, setDelReason] = useState('');
  const [inviteFor, setInviteFor] = useState<any>(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'agency_recruiter', password: '' });
  const [busy, setBusy] = useState(false);
  const pageSize = 10;
  const params = useMemo(() => {
    const sp = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) sp.set('status', status);
    if (verification) sp.set('verification', verification);
    if (dq.trim()) sp.set('q', dq.trim());
    return sp.toString();
  }, [page, status, verification, dq]);
  const load = async (qs: string) => {
    setLoading(true); setError('');
    try {
      const res: any = await workforceApi.agencies(`?${qs}`);
      setRows(unwrapList(res));
      setTotal(Number((res as { pagination?: { total?: number } })?.pagination?.total ?? unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(params); }, [params]);
  const resetPage = () => setPage(1);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.legalName.trim()) return;
    setBusy(true);
    try {
      const created = unwrapObj(await workforceApi.createAgency({ ...form, recruiterCount: Number(form.recruiterCount) || 0 }));
      if (created?.id) { setRows((r) => [created, ...r]); setTotal((t) => t + 1); }
      setForm({ ...blankAgency });
      setShowCreate(false); setOk('Agency onboarded (verification Pending).'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const openEdit = (a: any) => {
    setEditing(a);
    const next: Record<string, string> = {};
    for (const k of Object.keys(blankAgency)) next[k] = a[k] === undefined || a[k] === null ? '' : String(a[k]);
    setForm(next);
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editing) return;
    setBusy(true); setError('');
    try {
      const updated = unwrapObj(await workforceApi.updateAgency(editing.id, { ...form, recruiterCount: Number(form.recruiterCount) || 0 }));
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...x, ...(updated?.id ? updated : form) } : x)));
      setEditing(null); setOk(`Agency ${editing.id} updated (audited).`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doVerify = async (a: any, decision: 'approve' | 'reject') => {
    try {
      const u = unwrapObj(await workforceApi.updateAgency(a.id, { verificationStatus: decision === 'approve' ? 'Approved' : 'Rejected' }));
      setRows((r) => r.map((x) => (x.id === a.id ? { ...x, ...(u?.id ? u : {}) } : x)));
      setOk(`Agency ${a.id} verification ${decision === 'approve' ? 'approved' : 'rejected'}.`); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const doSuspend = async () => {
    if (!suspendFor || !suspendForm.reason.trim()) { setError('Reason is required (audit).'); return; }
    setBusy(true); setError('');
    try {
      const res: any = await workforceApi.updateAgency(suspendFor.id, { accountStatus: suspendForm.action, reason: suspendForm.reason.trim() });
      const updated = (res as { data?: any })?.data || res;
      const revoked = (res as { sessionsRevoked?: number })?.sessionsRevoked || 0;
      setRows((r) => r.map((x) => (x.id === suspendFor.id ? { ...x, ...(updated?.id ? updated : { accountStatus: suspendForm.action }) } : x)));
      setSuspendFor(null); setOk(`Agency ${suspendFor.id} → ${suspendForm.action}${revoked ? ` (${revoked} session(s) revoked)` : ''}.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDelete = async () => {
    if (!deleteFor || !delReason.trim()) { setError('Closure reason is required.'); return; }
    setBusy(true); setError('');
    try {
      const res: any = await workforceApi.deleteAgency(deleteFor.id, delReason.trim());
      const updated = (res as { data?: any })?.data;
      if (updated && updated.accountStatus === 'Closed') {
        setRows((r) => r.map((x) => (x.id === deleteFor.id ? { ...x, ...updated } : x)));
        setOk(`Agency ${deleteFor.id} has live work — closed instead of deleted.`);
      } else {
        setRows((r) => r.filter((x) => x.id !== deleteFor.id)); setTotal((t) => Math.max(0, t - 1));
        setOk(`Agency ${deleteFor.id} deleted.`);
      }
      setDeleteFor(null); setDelReason(''); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doInvite = async (e: React.FormEvent) => {
    e.preventDefault(); if (!inviteFor) return;
    if (!inviteForm.email.trim() || inviteForm.password.length < 8) { setError('Valid email + 8-char temporary password required.'); return; }
    setBusy(true); setError('');
    try {
      await workforceApi.inviteAgencyUser(inviteFor.id, { name: inviteForm.name.trim(), email: inviteForm.email.trim(), role: inviteForm.role, password: inviteForm.password });
      setInviteFor(null); setInviteForm({ name: '', email: '', role: 'agency_recruiter', password: '' });
      setOk(`Recruiter invited to ${inviteFor.id}.`); load(params); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const agencyColumns = ['id', 'legalName', 'displayName', 'contactName', 'contactEmail', 'contactPhone', 'specialties', 'locations', 'recruiterCount', 'verificationStatus', 'agreementStatus', 'commercialModel', 'accountStatus', 'accountManager', 'assignments', 'submissions', 'placements', 'payoutBalance'];
  const menuFor = (a: any) => (
    <RowMenu label="Agency actions" items={[
      { label: 'View 360°', onSelect: () => setDetail(a) },
      { label: 'Edit details', onSelect: () => openEdit(a) },
      { label: 'Invite recruiter…', onSelect: () => { setInviteFor(a); setInviteForm({ name: '', email: '', role: 'agency_recruiter', password: '' }); } },
      ...((a.verificationStatus === 'Pending') ? [
        { label: 'Verify — Approve', onSelect: () => doVerify(a, 'approve') },
        { label: 'Verify — Reject', danger: true, onSelect: () => doVerify(a, 'reject') },
      ] : []),
      { label: a.accountStatus === 'Suspended' ? 'Reactivate…' : 'Suspend…', danger: a.accountStatus !== 'Suspended', onSelect: () => { setSuspendFor(a); setSuspendForm({ action: a.accountStatus === 'Suspended' ? 'Active' : 'Suspended', reason: '' }); } },
      { label: 'Close / Delete…', danger: true, onSelect: () => { setDeleteFor(a); setDelReason(''); } },
    ]} />
  );
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-extrabold text-slate-900">Agency Directory — Onboard / Verify / Assign / Review</h3>
        <p className="text-xs text-slate-500 font-medium">{total} record(s) match. Assignments, submissions, placements and payout balance are computed live.</p>
      </div>
      {error && <PanelError message={error} onRetry={() => load(params)} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1"><input className={inputCls} placeholder="Search ID, name, contact, specialty…" value={q} onChange={(e) => { setQ(e.target.value); resetPage(); }} /></div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowAdv((v) => !v)} aria-expanded={showAdv} className={`px-4 py-2 rounded-xl border font-bold text-xs whitespace-nowrap ${showAdv || status || verification ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-700'}`}>
            Filters {(status || verification) ? '•' : ''} {showAdv ? '▴' : '▾'}
          </button>
          <ExportButton filename="agencies.csv" rows={rows} columns={agencyColumns} />
          <button type="button" onClick={() => { setForm({ ...blankAgency }); setShowCreate(true); }} className={btnPrimary}>+ Onboard agency</button>
        </div>
      </div>
      {showAdv && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex-1 min-w-0">
            <Select value={status} onChange={(v) => { setStatus(v); resetPage(); }} ariaLabel="Account status" placeholder="All statuses"
              options={[{ value: '', label: 'All statuses' }, ...['Invited', 'Active', 'Suspended', 'Closed'].map((s) => ({ value: s, label: s }))]} />
          </div>
          <div className="flex-1 min-w-0">
            <Select value={verification} onChange={(v) => { setVerification(v); resetPage(); }} ariaLabel="Verification" placeholder="Any verification"
              options={[{ value: '', label: 'Any verification' }, ...['Pending', 'Approved', 'Rejected'].map((s) => ({ value: s, label: s }))]} />
          </div>
          <button type="button" onClick={() => { setStatus(''); setVerification(''); resetPage(); }} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs shrink-0">Clear</button>
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Onboard agency" subtitle="Starts at verification Pending / account Invited" wide>
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Legal name *"><input required className={kitInput} value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} /></Field>
          <Field label="Display name"><input className={kitInput} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></Field>
          <Field label="Entity type"><input className={kitInput} value={form.entityType} onChange={(e) => setForm({ ...form, entityType: e.target.value })} /></Field>
          <Field label="Country"><input className={kitInput} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label="Registration number"><input className={`${kitInput} font-mono`} value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} /></Field>
          <Field label="Tax IDs"><input className={kitInput} value={form.taxIds} onChange={(e) => setForm({ ...form, taxIds: e.target.value })} /></Field>
          <Field label="Website"><input className={kitInput} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Field>
          <Field label="Address"><input className={kitInput} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
          <Field label="Contact name"><input className={kitInput} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></Field>
          <Field label="Contact email"><input type="email" className={kitInput} value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></Field>
          <Field label="Contact phone"><input type="tel" className={kitInput} value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></Field>
          <Field label="Recruiter count"><input className={kitInput} type="number" min={0} value={form.recruiterCount} onChange={(e) => setForm({ ...form, recruiterCount: e.target.value })} /></Field>
          <Field label="Specialties"><input className={kitInput} value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="Engineering, Product" /></Field>
          <Field label="Locations served"><input className={kitInput} value={form.locations} onChange={(e) => setForm({ ...form, locations: e.target.value })} /></Field>
          <Field label="Login tenant ID (for invites)"><input className={`${kitInput} font-mono`} value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} placeholder="TNT-AGENCY-__" /></Field>
          <Field label="Account manager"><input className={kitInput} value={form.accountManager} onChange={(e) => setForm({ ...form, accountManager: e.target.value })} /></Field>
          <Field label="Agreement status"><Select value={form.agreementStatus} onChange={(v) => setForm({ ...form, agreementStatus: v })} options={['Draft', 'Sent', 'Signed', 'Expired'].map((s) => ({ value: s, label: s }))} /></Field>
          <div><Field label="Commercial model"><input className={kitInput} value={form.commercialModel} onChange={(e) => setForm({ ...form, commercialModel: e.target.value })} placeholder="e.g. 8.33% CTC, 90-day replacement" /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button disabled={busy || !form.legalName.trim()} className={btnPrimary}>{busy ? 'Onboarding…' : 'Onboard'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading agencies…" /> : rows.length === 0 ? (
        <EmptyState title="No agencies match" message="Adjust filters or onboard the first recruitment partner." />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {rows.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{a.displayName || a.legalName}</div>
                  <div className="font-mono text-[11px] text-slate-500">{a.id}</div>
                </div>
                {menuFor(a)}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{a.verificationStatus}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px]">{a.accountStatus}</span>
              </div>
              <div className="text-slate-600 font-medium">{a.assignments ?? 0} jobs • {a.submissions ?? 0} subs • {a.placements ?? 0} placed • bal ₹{a.payoutBalance ?? 0}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[1380px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Agency</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Specialties</th><th className="px-4 py-3">Verification</th><th className="px-4 py-3">Agreement</th><th className="px-4 py-3">Account</th><th className="px-4 py-3">Work</th><th className="px-4 py-3">Payout due</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {rows.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{a.displayName || a.legalName}</div><div className="font-mono text-[11px] text-slate-500">{a.id} • {a.recruiterCount || 0} recruiters</div></td>
                  <td className="px-4 py-3"><div>{a.contactName || '—'}</div><div className="text-slate-500 text-[11px]">{a.contactEmail || ''} {a.contactPhone || ''}</div></td>
                  <td className="px-4 py-3 max-w-[200px]"><div className="truncate" title={`${a.specialties || ''} — ${a.locations || ''}`}>{a.specialties || '—'}</div><div className="text-slate-500 text-[11px] truncate">{a.locations || ''}</div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{a.verificationStatus}</span></td>
                  <td className="px-4 py-3"><div>{a.agreementStatus || '—'}</div><div className="text-slate-500 text-[11px] max-w-[160px] truncate" title={a.commercialModel}>{a.commercialModel || ''}</div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px]">{a.accountStatus}</span><div className="text-slate-500 text-[11px]">{a.accountManager || ''}</div></td>
                  <td className="px-4 py-3 font-bold">{a.assignments ?? '—'} jobs • {a.submissions ?? '—'} subs • {a.placements ?? '—'} placed</td>
                  <td className="px-4 py-3 font-bold text-purple-700">₹{Number(a.payoutBalance || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><div className="flex justify-end">{menuFor(a)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      {detail && <AgencyDrawer agencyId={detail.id} onClose={() => { setDetail(null); load(params); }} />}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit agency — ${editing?.id || ''}`} subtitle="Audited edit" wide>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Display name"><input className={kitInput} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></Field>
          <Field label="Entity type"><input className={kitInput} value={form.entityType} onChange={(e) => setForm({ ...form, entityType: e.target.value })} /></Field>
          <Field label="Country"><input className={kitInput} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label="Registration number"><input className={`${kitInput} font-mono`} value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} /></Field>
          <Field label="Tax IDs"><input className={kitInput} value={form.taxIds} onChange={(e) => setForm({ ...form, taxIds: e.target.value })} /></Field>
          <Field label="Website"><input className={kitInput} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Address"><input className={kitInput} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field></div>
          <Field label="Contact name"><input className={kitInput} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></Field>
          <Field label="Contact email"><input type="email" className={kitInput} value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></Field>
          <Field label="Contact phone"><input type="tel" className={kitInput} value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></Field>
          <Field label="Recruiter count"><input className={kitInput} type="number" min={0} value={form.recruiterCount} onChange={(e) => setForm({ ...form, recruiterCount: e.target.value })} /></Field>
          <Field label="Specialties"><input className={kitInput} value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} /></Field>
          <Field label="Locations served"><input className={kitInput} value={form.locations} onChange={(e) => setForm({ ...form, locations: e.target.value })} /></Field>
          <Field label="Login tenant ID"><input className={`${kitInput} font-mono`} value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} /></Field>
          <Field label="Account manager"><input className={kitInput} value={form.accountManager} onChange={(e) => setForm({ ...form, accountManager: e.target.value })} /></Field>
          <Field label="Agreement status"><Select value={form.agreementStatus} onChange={(v) => setForm({ ...form, agreementStatus: v })} options={['Draft', 'Sent', 'Signed', 'Expired'].map((s) => ({ value: s, label: s }))} /></Field>
          <div><Field label="Commercial model"><input className={kitInput} value={form.commercialModel} onChange={(e) => setForm({ ...form, commercialModel: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy} onClick={saveEdit} className={btnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={suspendFor !== null} onClose={() => setSuspendFor(null)} title={`${suspendForm.action === 'Active' ? 'Reactivate' : 'Suspend'} — ${suspendFor?.displayName || suspendFor?.id || ''}`} subtitle="Reason is mandatory. Suspending revokes member sessions.">
        <div className="space-y-3">
          <Field label="Action"><Select value={suspendForm.action} onChange={(v) => setSuspendForm({ ...suspendForm, action: v })} options={[{ value: 'Suspended', label: 'Suspend' }, { value: 'Active', label: 'Reactivate' }]} /></Field>
          <Field label="Reason *"><textarea rows={3} className={kitInput} value={suspendForm.reason} onChange={(e) => setSuspendForm({ ...suspendForm, reason: e.target.value })} placeholder="e.g. Contract breach — legal ticket LEG-12" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setSuspendFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !suspendForm.reason.trim()} onClick={doSuspend} className={btnDark}>{busy ? 'Working…' : 'Confirm'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={deleteFor !== null} onClose={() => setDeleteFor(null)} title={`Close / delete ${deleteFor?.displayName || deleteFor?.id || ''}?`} subtitle="Live assignments, pending submissions or unpaid payouts close the agency instead of deleting it.">
        <div className="space-y-3">
          <Field label="Reason *"><textarea rows={3} className={kitInput} value={delReason} onChange={(e) => setDelReason(e.target.value)} placeholder="e.g. Contract ended by mutual agreement" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDeleteFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !delReason.trim()} onClick={doDelete} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs disabled:opacity-50">{busy ? 'Working…' : 'Close / Delete'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={inviteFor !== null} onClose={() => setInviteFor(null)} title={`Invite recruiter — ${inviteFor?.displayName || inviteFor?.id || ''}`} subtitle={inviteFor?.tenantId ? `Scoped to tenant ${inviteFor.tenantId}` : 'Link a login tenant first (edit agency).'}>
        <form onSubmit={doInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name"><input className={kitInput} value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} /></Field>
          <Field label="Work email *"><input type="email" required className={kitInput} value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} /></Field>
          <Field label="Role"><Select value={inviteForm.role} onChange={(v) => setInviteForm({ ...inviteForm, role: v })} options={[{ value: 'agency_admin', label: 'Agency Admin' }, { value: 'agency_recruiter', label: 'Agency Recruiter' }]} /></Field>
          <Field label="Temporary password (8+ chars) *"><input type="password" required minLength={8} autoComplete="new-password" className={kitInput} value={inviteForm.password} onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setInviteFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy} className={btnPrimary}>{busy ? 'Inviting…' : 'Invite recruiter'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const ALL_PERMISSIONS = ['view','create','edit','archive','delete','approve','reject','suspend','restore','assign','export','manage_billing','manage_permissions','view_sensitive_fields','reconcile','refund','adjust_commission'];

/* ---------------- Phase 5: Admin controls ---------------- */export function AdminControlsPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState<{ title: string; body: string; confirm: string; run: () => unknown } | null>(null);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [excForm, setExcForm] = useState({ email: '', permission: 'export', effect: 'grant' });
  const load = async () => {
    setError('');
    try {
      const { directoryApi, permissionsApi } = await import('../../shared/enterprise/phaseApi');
      setUsers(unwrapList(await directoryApi.users()));
      setTenants(unwrapList(await directoryApi.tenants()));
      setExceptions(unwrapList(await permissionsApi.all()));
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const act = async (fn: Promise<unknown>) => {
    try { await fn; load(); } catch (e) { setError(errMsg(e)); }
  };
  const confirm = (title: string, body: string, confirmLabel: string, run: () => unknown) => setPending({ title, body, confirm: confirmLabel, run });
  const saveException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excForm.email.trim()) return;
    try {
      const { permissionsApi } = await import('../../shared/enterprise/phaseApi');
      const created = unwrapObj(await permissionsApi.grant(excForm.email.trim(), excForm.permission, excForm.effect as 'grant' | 'revoke'));
      if (created?.id) setExceptions((x) => [created, ...x.filter((o) => !(o.email === created.email && o.permission === created.permission))]);
      setExcForm({ email: '', permission: 'export', effect: 'grant' }); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const clearException = async (o: any) => {
    try {
      const { permissionsApi } = await import('../../shared/enterprise/phaseApi');
      await permissionsApi.clear(o.email, o.permission);
      setExceptions((x) => x.filter((y) => y.id !== o.id)); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <h3 className="text-base font-extrabold text-slate-900">Verification, Suspension & Access Control</h3>
      {error && <PanelError message={error} onRetry={load} />}
      <input className={inputCls} placeholder="Reason (recorded with actor + timestamp — required)" value={reason} onChange={(e) => setReason(e.target.value)} />
      <div className="text-xs font-extrabold text-slate-700">Companies — verify / suspend / reactivate</div>
      <div className="space-y-2">{tenants.map((t) => (
        <OrgRow key={t.id} t={t} reason={reason} act={act} confirm={confirm} />
      ))}</div>
      <div className="text-xs font-extrabold text-slate-700">Users — suspend / reactivate (revokes sessions)</div>
      <div className="space-y-2">{users.map((u) => (
        <UserRow key={u.id} u={u} reason={reason} act={act} confirm={confirm} />
      ))}</div>
      <div className="text-xs font-extrabold text-slate-700">Permission exceptions — explicit grant/revoke over role templates (§4.2)</div>
      <form onSubmit={saveException} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <input className={kitInput} placeholder="user@company.com *" value={excForm.email} onChange={(e) => setExcForm({ ...excForm, email: e.target.value })} />
        <Select value={excForm.permission} onChange={(v) => setExcForm({ ...excForm, permission: v })} options={ALL_PERMISSIONS.map((p) => ({ value: p, label: p }))} />
        <Select value={excForm.effect} onChange={(v) => setExcForm({ ...excForm, effect: v })} options={[{ value: 'grant', label: 'Grant' }, { value: 'revoke', label: 'Revoke' }]} />
        <button className={btnDark}>Save exception</button>
      </form>
      {exceptions.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No exceptions — every account runs on its role template.</div> : (
        <div className="space-y-2">{exceptions.map((o) => (
          <div key={o.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
            <span className="truncate">{o.email} • <strong className={o.effect === 'grant' ? 'text-emerald-600' : 'text-red-600'}>{o.effect}</strong> • {o.permission} • by {o.by}</span>
            <button type="button" onClick={() => clearException(o)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] shrink-0">Clear</button>
          </div>
        ))}</div>
      )}
      <ConfirmDialog
        open={pending !== null}
        title={pending?.title || 'Confirm'}
        body={pending?.body || ''}
        confirmLabel={pending?.confirm || 'Confirm'}
        onConfirm={async () => { if (pending) await pending.run(); setPending(null); }}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

function OrgRow({ t, reason, act, confirm }: { t: any; reason: string; act: (p: Promise<unknown>) => void; confirm: (title: string, body: string, label: string, run: () => unknown) => void }) {
  const [api, setApi] = useState<any>(null);
  useEffect(() => { import('../../shared/enterprise/phaseApi').then((m) => setApi(m.directoryApi)); }, []);
  if (!api) return null;
  return (
    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
      <span className="min-w-0 truncate">{t.id} • {t.legalName || t.name} • verification <strong>{t.verificationStatus}</strong> • account <strong>{t.accountStatus}</strong></span>
      <RowMenu label="Organization actions" items={[
        { label: 'Verify organization', onSelect: () => act(api.verifyTenant(t.id, 'approve')) },
        { label: 'Reject verification', danger: true, onSelect: () => confirm('Reject verification', `Reject verification for ${t.legalName || t.name}?`, 'Reject', () => act(api.verifyTenant(t.id, 'reject'))) },
        { label: 'Suspend organization', danger: true, onSelect: () => confirm('Suspend organization', `Suspend ${t.legalName || t.name}? All member sessions are revoked immediately.`, 'Suspend', () => act(reason ? api.suspendTenant(t.id, reason) : Promise.reject(new Error('Enter a reason first.')))) },
        { label: 'Reactivate organization', onSelect: () => act(api.suspendTenant(t.id, reason || 'reactivated', 'reactivate')) },
      ]} />
    </div>
  );
}

function UserRow({ u, reason, act, confirm }: { u: any; reason: string; act: (p: Promise<unknown>) => void; confirm: (title: string, body: string, label: string, run: () => unknown) => void }) {
  const [api, setApi] = useState<any>(null);
  useEffect(() => { import('../../shared/enterprise/phaseApi').then((m) => setApi(m.directoryApi)); }, []);
  if (!api) return null;
  return (
    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
      <span className="min-w-0 truncate">{u.email} • {u.role} • <strong>{u.status}</strong></span>
      <RowMenu label="User actions" items={u.status === 'Active'
        ? [{ label: 'Suspend user', danger: true, onSelect: () => confirm('Suspend user', `Suspend ${u.email}? Sessions are revoked immediately.`, 'Suspend', () => act(reason ? api.setUserStatus(u.id, 'Suspended', reason) : Promise.reject(new Error('Enter a reason first.')))) }]
        : [{ label: 'Reactivate user', onSelect: () => act(api.setUserStatus(u.id, 'Active', reason || 'reactivated')) }]} />
    </div>
  );
}

/* ---------------- Branches (§6.4/§3.4) — full CRUD ---------------- */
export function BranchesPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useQueryState('br_q');
  const [form, setForm] = useState({ name: '', city: '', orgId: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const load = async () => {
    setLoading(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      setRows(unwrapList(await directoryApi.branches()));
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.name.trim()) return;
    setBusy(true);
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const created = unwrapObj(await directoryApi.createBranch({ name: form.name.trim(), city: form.city.trim(), orgId: form.orgId.trim() || undefined }));
      if (created?.id) setRows((r) => [created, ...r]);
      setForm({ name: '', city: '', orgId: '' }); setShowCreate(false); setOk('Branch created.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const updated = unwrapObj(await directoryApi.updateBranch(editing.id, { name: editing.name, city: editing.city, status: editing.status }));
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...x, ...(updated?.id ? updated : editing) } : x)));
      setEditing(null); setOk('Branch updated.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDelete = async () => {
    if (!deleteFor) return;
    setBusy(true);
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      await directoryApi.deleteBranch(deleteFor.id);
      setRows((r) => r.filter((x) => x.id !== deleteFor.id)); setDeleteFor(null); setOk('Branch deleted.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const filtered = rows.filter((b) => !q.trim() || `${b.id} ${b.name} ${b.city} ${b.orgId}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Branches — Create / Edit / Delete / Export</h3>
          <div className="flex gap-2">
            <ExportButton filename="branches.csv" rows={filtered} columns={['id', 'orgId', 'name', 'city', 'status']} />
            <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New branch</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search branch, city, org…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New branch" subtitle="Scoped to an organization">
        <form onSubmit={create} className="space-y-3">
          <Field label="Branch name *"><input className={kitInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mumbai Branch" /></Field>
          <Field label="City"><input className={kitInput} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
          <Field label="Organization ID (admin only — blank = own org)"><input className={kitInput} value={form.orgId} onChange={(e) => setForm({ ...form, orgId: e.target.value })} placeholder="TNT-9011" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy || !form.name.trim()} className={btnPrimary}>{busy ? 'Creating…' : 'Create branch'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading branches…" /> : filtered.length === 0 ? (
        <EmptyState title="No branches" message="Create the first branch office." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Branch</th><th className="px-4 py-3">City</th><th className="px-4 py-3">Organization</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{b.name}</div><div className="font-mono text-[11px] text-slate-500">{b.id}</div></td>
                  <td className="px-4 py-3">{b.city || '—'}</td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-700">{b.orgId}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">{b.status}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end"><RowMenu items={[
                    { label: 'Edit…', onSelect: () => setEditing({ ...b }) },
                    { label: 'Delete…', danger: true, onSelect: () => setDeleteFor(b) },
                  ]} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit branch — ${editing?.id || ''}`}>
        <div className="space-y-3">
          <Field label="Branch name"><input className={kitInput} value={editing?.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
          <Field label="City"><input className={kitInput} value={editing?.city || ''} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></Field>
          <Field label="Status"><Select value={editing?.status || 'Active'} onChange={(v) => setEditing({ ...editing, status: v })} options={['Active', 'Closed'].map((s) => ({ value: s, label: s }))} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy} onClick={saveEdit} className={btnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={deleteFor !== null} onCancel={() => setDeleteFor(null)} title={`Delete branch ${deleteFor?.name || ''}?`} body="Branches with requisitions referencing them should be closed, not deleted. Continue?" confirmLabel="Delete" onConfirm={doDelete} />
    </div>
  );
}

export const JOB_TRANSITIONS: Record<string, string[]> = {
  Draft: ['Pending Review'], 'Pending Review': ['Approved', 'Draft'], Approved: ['Published'],
  Published: ['Paused', 'Closed'], Paused: ['Published', 'Closed'], Closed: ['Archived'], Archived: [],
};

/* ---------------- Admin Jobs (§6.7) — list + detail + pipeline + assign ---------------- */
export function JobsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useQueryState('job_q');
  const [statusF, setStatusF] = useQueryState('job_status');
  const [orgF, setOrgF] = useQueryState('job_org');
  const dqJob = useDebounced(q);
  const [detail, setDetail] = useState<any>(null);
  const [pipeline, setPipeline] = useState<{ apps: any[]; interviews: any[] }>({ apps: [], interviews: [] });
  const [detailReq, setDetailReq] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [pubFor, setPubFor] = useState<{ job: any; to: string } | null>(null);
  const [pubReason, setPubReason] = useState('');
  const [pubExpiry, setPubExpiry] = useState('');
  const [moveFor, setMoveFor] = useState<{ job: any; to: string } | null>(null);
  const [view, setView] = useQueryState('job_view');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobForm, setJobForm] = useState({ orgId: '', title: '', requisitionId: '', location: '', employmentType: 'Full-time', salaryMin: '', salaryMax: '', expiryDate: '', visibility: 'public', description: '' });
  const [busy, setBusy] = useState(false);
  const load = async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page: '1', pageSize: '100' });
      if (orgF) params.set('orgId', orgF);
      setRows(unwrapList(await jobsApi.list(`?${params.toString()}`)));
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      directoryApi.tenants().then((t: any) => setOrgs(unwrapList(t))).catch(() => { /* company filter best-effort */ });
    }
    catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [orgF]);
  const openDetail = async (j: any) => {
    setDetail(j); setPipeline({ apps: [], interviews: [] }); setDetailReq(null);
    try {
      const [aRes, iRes] = await Promise.all([
        applicationsApi.list(`?jobId=${j.id}&page=1&pageSize=100`).catch(() => null),
        interviewsApi.list(`?jobId=${j.id}`).catch(() => null),
      ]);
      setPipeline({ apps: unwrapList(aRes), interviews: unwrapList(iRes) });
      if (j.requisitionId) {
        const rRes: any = await requisitionsApi.list(`?page=1&pageSize=100`).catch(() => null);
        const req = unwrapList(rRes).find((r: any) => r.id === j.requisitionId);
        if (req) setDetailReq(req);
      }
    } catch { /* pipeline is best-effort */ }
  };
  const doCreateJob = async () => {
    if (!jobForm.title.trim()) return;
    setBusy(true); setError('');
    try {
      const payload: any = {
        title: jobForm.title.trim(),
        requisitionId: jobForm.requisitionId.trim() || undefined,
        location: jobForm.location.trim() || undefined,
        employmentType: jobForm.employmentType,
        salaryMin: jobForm.salaryMin === '' ? undefined : Number(jobForm.salaryMin),
        salaryMax: jobForm.salaryMax === '' ? undefined : Number(jobForm.salaryMax),
        expiryDate: jobForm.expiryDate || undefined,
        visibility: jobForm.visibility,
        description: jobForm.description.trim() || undefined,
      };
      if (jobForm.orgId) payload.tenantId = jobForm.orgId;
      const created = unwrapObj(await jobsApi.create(payload));
      if (created?.id) { setRows((r) => [created, ...r]); setShowCreateJob(false); setJobForm({ orgId: '', title: '', requisitionId: '', location: '', employmentType: 'Full-time', salaryMin: '', salaryMax: '', expiryDate: '', visibility: 'public', description: '' }); setOk('Job posting created as Draft.'); syncAll(); }
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const transition = async (id: string, status: string, reason?: string, expiryDate?: string) => {
    try {
      const updated = unwrapObj(await jobsApi.setStatus(id, status, reason, expiryDate));
      setRows((r) => r.map((x) => (x.id === id ? { ...x, ...(updated?.id ? updated : { status }) } : x)));
      if (detail?.id === id) setDetail((d: any) => ({ ...d, ...(updated?.id ? updated : { status }) }));
      setOk(`${id} → ${status}.`); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const doPublishAction = async () => {
    if (!pubFor) return;
    if (pubFor.to !== 'Published' && !pubReason.trim()) { setError('A reason is required for unpublish / reopen — it is audited.'); return; }
    setBusy(true); setError('');
    try {
      await transition(pubFor.job.id, pubFor.to, pubReason.trim() || undefined, pubExpiry || undefined);
      setPubFor(null); setPubReason(''); setPubExpiry('');
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const payload = { ...editing, assignedAgencies: String(editing.assignedAgencies || '').split(',').map((s: string) => s.trim()).filter(Boolean), assignedVendors: String(editing.assignedVendors || '').split(',').map((s: string) => s.trim()).filter(Boolean) };
      const updated = unwrapObj(await jobsApi.update(editing.id, payload));
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...x, ...(updated?.id ? updated : editing) } : x)));
      setEditing(null); setOk('Job updated.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const filtered = rows.filter((j) => {
    if (statusF && j.status !== statusF) return false;
    if (!dqJob.trim()) return true;
    return `${j.id} ${j.title} ${j.orgId} ${j.location}`.toLowerCase().includes(dqJob.toLowerCase());
  });
  const pubNeedsForm = (j: any, to: string) => to === 'Published' || (j.status === 'Published' && to === 'Approved') || (j.status === 'Closed' && (to === 'Published' || to === 'Paused'));
  const dropMove = (j: any, to: string) => {
    if (to === j.status) return;
    const legal = [...(JOB_TRANSITIONS[j.status] || []), ...(j.status === 'Published' ? ['Approved'] : []), ...(j.status === 'Closed' ? ['Published', 'Paused'] : [])];
    if (!legal.includes(to)) { setError(`Invalid transition ${j.status} → ${to} for ${j.id}.`); return; }
    if (pubNeedsForm(j, to)) { setPubFor({ job: j, to }); setPubReason(''); setPubExpiry(String(j.expiryDate || '').slice(0, 10)); }
    else setMoveFor({ job: j, to });
  };
  const jobMenuFor = (j: any) => (
    <RowMenu items={[
      { label: 'View + pipeline', onSelect: () => openDetail(j) },
      { label: 'Edit…', onSelect: () => setEditing({ ...j, assignedAgencies: (j.assignedAgencies || []).join(', '), assignedVendors: (j.assignedVendors || []).join(', ') }) },
      ...(JOB_TRANSITIONS[j.status] || []).map((s) => (
        pubNeedsForm(j, s)
          ? { label: `${s === 'Published' ? 'Publish' : s}…`, onSelect: () => { setPubFor({ job: j, to: s }); setPubReason(''); setPubExpiry(String(j.expiryDate || '').slice(0, 10)); } }
          : { label: `Move to ${s}…`, onSelect: () => setMoveFor({ job: j, to: s }) }
      )),
      ...(j.status === 'Published' ? [{ label: 'Unpublish…', danger: true, onSelect: () => { setPubFor({ job: j, to: 'Approved' }); setPubReason(''); setPubExpiry(''); } }] : []),
      ...(j.status === 'Closed' ? [
        { label: 'Reopen as Published…', onSelect: () => { setPubFor({ job: j, to: 'Published' }); setPubReason(''); setPubExpiry(String(j.expiryDate || '').slice(0, 10)); } },
        { label: 'Reopen as Paused…', onSelect: () => { setPubFor({ job: j, to: 'Paused' }); setPubReason(''); setPubExpiry(String(j.expiryDate || '').slice(0, 10)); } },
      ] : []),
    ]} />
  );
  const MOVE_COPY: Record<string, { steps: string[]; consequences: string[] }> = {
    Paused: { steps: ['Status moves to Paused', 'Recorded with actor and timestamp'], consequences: ['Posting leaves candidate results while paused', 'Existing applications stay readable'] },
    Closed: { steps: ['Status moves to Closed', 'Recorded with actor and timestamp'], consequences: ['New applications are blocked', 'Reopen later needs approve permission, a reason and a future expiry'] },
    Archived: { steps: ['Status moves to Archived', 'Recorded with actor and timestamp'], consequences: ['Terminal state — no further transitions ever'] },
    Approved: { steps: ['Status moves to Approved', 'Recorded with actor and timestamp'], consequences: ['Eligible for publication once guards pass'] },
    Published: { steps: ['Status moves to Published', 'Recorded with actor and timestamp'], consequences: ['Becomes visible to eligible candidates'] },
  };
  const pubCopy: Record<string, { title: string; rules: string[] }> = {
    Published: { title: 'Publish job', rules: ['Parent requirement must be Approved or Sourcing', 'Requirement must have openings left', 'Expiry must be a future date (set below if empty)'] },
    Approved: { title: 'Unpublish job', rules: ['Removes the posting from candidate results immediately', 'Requires the approve permission + a recorded reason'] },
    Paused: { title: 'Reopen as Paused', rules: ['Requires the approve permission + a recorded reason', 'A future expiry date is mandatory'] },
  };
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-extrabold text-slate-900">Job Board — public postings</h3>
        <p className="text-xs text-slate-500 font-medium">Only Published, unexpired postings reach candidates. Unpublish removes them instantly; reopening needs a future expiry.</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5" role="tablist" aria-label="Jobs view">
              {(['table', 'kanban'] as const).map((v) => (
                <button key={v} role="tab" aria-selected={(view || 'table') === v} type="button" onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs capitalize ${((view || 'table') === v) ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{v}</button>
              ))}
            </div>
            <div className="text-xs font-bold text-slate-500">{filtered.length} posting(s) shown</div>
          </div>
          <div className="flex gap-2">
            <ExportButton filename="jobs.csv" rows={filtered} columns={['id', 'requisitionId', 'title', 'orgId', 'location', 'employmentType', 'status', 'expiryDate']} />
            <button type="button" onClick={() => setShowCreateJob(true)} className={btnPrimary}>+ New job</button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <input className={`${inputCls} flex-1`} placeholder="Search ID, title, org, location…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="w-full lg:w-44 shrink-0">
            <Select value={statusF} onChange={setStatusF} ariaLabel="Job status filter" placeholder="All statuses"
              options={[{ value: '', label: 'All statuses' }, ...['Draft', 'Pending Review', 'Approved', 'Published', 'Paused', 'Closed', 'Archived'].map((s) => ({ value: s, label: s }))]} />
          </div>
          {orgs.length > 0 && (
            <div className="w-full lg:w-48 shrink-0">
              <Select value={orgF} onChange={setOrgF} ariaLabel="Company filter" placeholder="All companies"
                options={[{ value: '', label: 'All companies' }, ...orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id}` }))]} />
            </div>
          )}
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {loading ? <InlineLoading message="Loading jobs…" /> : filtered.length === 0 ? (
        <EmptyState title="No jobs" message="Published requisitions become jobs here." />
      ) : (view || 'table') === 'kanban' ? (
        <JobsKanban jobs={filtered} onOpen={openDetail} onDropMove={dropMove} />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {filtered.map((j) => (
            <div key={j.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{j.title}</div>
                  <div className="font-mono text-[11px] text-slate-500">{j.id} • {j.applicantsCount ?? 0} applicants</div>
                </div>
                {jobMenuFor(j)}
              </div>
              <div><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{j.status}</span></div>
              <div className="text-slate-600 font-medium">{j.orgId} • {j.location || '—'}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[980px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Job</th><th className="px-4 py-3">Requisition</th><th className="px-4 py-3">Org / Location</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Applicants</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{j.title}</div><div className="font-mono text-[11px] text-slate-500">{j.id}</div></td>
                  <td className="px-4 py-3 font-mono">{j.requisitionId || '—'}</td>
                  <td className="px-4 py-3"><div className="font-mono font-bold text-amber-700">{j.orgId}</div><div className="text-slate-500">{j.location || '—'}</div></td>
                  <td className="px-4 py-3">{j.employmentType || '—'}</td>
                  <td className="px-4 py-3 font-bold">{j.applicantsCount ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{String(j.expiryDate || '').slice(0, 10) || '—'}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{j.status}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end">{jobMenuFor(j)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      {detail && (
        <DetailDrawer title={detail.title} subtitle={`${detail.id} • req ${detail.requisitionId || '—'} • ${detail.status}`} onClose={() => setDetail(null)} width="max-w-4xl">
          <JobDrawerActions job={detail} requirement={detailReq} onDone={(u) => { setDetail((d: any) => (d && d.id === u.id ? u : d)); setRows((r) => r.map((x) => (x.id === u.id ? u : x))); }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[['Organization', detail.orgId], ['Location', detail.location], ['Employment', detail.employmentType], ['Arrangement', detail.workArrangement], ['Salary', detail.salaryMin ? `₹${detail.salaryMin}–₹${detail.salaryMax}` : (detail.budgetRange || '—')], ['Visibility', detail.visibility], ['Skills', [detail.requiredSkills, detail.preferredSkills].filter(Boolean).join(' • ') || '—'], ['Qualifications', detail.qualifications || '—'], ['Applicants', detail.counts?.applications ?? detail.applicantsCount], ['Hired', detail.counts?.hired ?? '—'], ['Expiry', String(detail.expiryDate || '').slice(0, 10)], ['Accepting applications', detail.counts ? (detail.counts.acceptingApplications ? 'Yes' : 'No') : '—'], ['Status reason', detail.statusReason || '—'], ['Agencies', (detail.assignedAgencies || []).join(', ')], ['Vendors', (detail.assignedVendors || []).join(', ')]].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—') || '—'}</div></div>
            ))}
            <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">Description</div><div className="font-medium mt-1 whitespace-pre-wrap">{detail.description || '—'}</div></div>
            {detailReq && (
              <div className="sm:col-span-2 p-3 rounded-2xl bg-blue-50/60 border border-blue-200">
                <div className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider">Parent requirement</div>
                <div className="font-bold mt-1">{detailReq.title} <span className="font-mono text-slate-500">• {detailReq.id} • {detailReq.status} • {detailReq.openings || 1} opening(s)</span></div>
              </div>
            )}
          </div>
          <div className="text-xs font-extrabold pt-2">Pipeline — {pipeline.apps.length} applications, {pipeline.interviews.length} interviews</div>
          {pipeline.apps.length === 0 ? <div className="text-[11px] text-slate-500">No applications for this job yet.</div> : pipeline.apps.slice(0, 10).map((a: any) => (
            <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">{a.candidateEmail} • <strong>{a.stage}</strong></div>
          ))}
          {(detail.history || []).length > 0 && (
            <>
              <div className="text-xs font-extrabold pt-2">Status history</div>
              <div className="space-y-1.5">
                {detail.history.slice(0, 20).map((h: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium">{h.from} → <strong>{h.to}</strong> • {h.by}{h.reason ? ` • ${h.reason}` : ''} <span className="text-slate-400">• {String(h.at || '').slice(0, 16).replace('T', ' ')}</span></div>
                ))}
              </div>
            </>
          )}
        </DetailDrawer>
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit job — ${editing?.id || ''}`} subtitle="Agency/vendor assignment controls who can submit">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Title"><input className={kitInput} value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field></div>
          <Field label="Location"><input className={kitInput} value={editing?.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
          <Field label="Employment type"><input className={kitInput} value={editing?.employmentType || ''} onChange={(e) => setEditing({ ...editing, employmentType: e.target.value })} /></Field>
          <Field label="Visibility"><Select value={editing?.visibility || 'public'} onChange={(v) => setEditing({ ...editing, visibility: v })} options={['public', 'private', 'assigned'].map((v) => ({ value: v, label: v }))} /></Field>
          <Field label="Expiry date"><DatePicker value={String(editing?.expiryDate || '').slice(0, 10)} onChange={(v) => setEditing({ ...editing, expiryDate: v })} /></Field>
          <div className="sm:col-span-2"><Field label="Assigned agencies (comma separated — blank = open to all)"><input className={kitInput} value={editing?.assignedAgencies || ''} onChange={(e) => setEditing({ ...editing, assignedAgencies: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Assigned vendors (comma separated)"><input className={kitInput} value={editing?.assignedVendors || ''} onChange={(e) => setEditing({ ...editing, assignedVendors: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy} onClick={saveEdit} className={btnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={pubFor !== null} onClose={() => setPubFor(null)}
        title={`${pubCopy[pubFor?.to || 'Published']?.title || 'Change publication'} — ${pubFor?.job.id || ''}`}
        subtitle="Server-enforced guards apply; violations return a plain-language reason.">
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium space-y-1">
            {(pubCopy[pubFor?.to || 'Published']?.rules || []).map((r) => <div key={r}>• {r}</div>)}
          </div>
          {(pubFor?.to === 'Published') && (
            <Field label="Expiry date (must be future)"><DatePicker value={pubExpiry} onChange={setPubExpiry} ariaLabel="Expiry date" /></Field>
          )}
          {pubFor?.to !== 'Published' && (
            <Field label="Reason *"><textarea rows={3} className={kitInput} value={pubReason} onChange={(e) => setPubReason(e.target.value)} placeholder="e.g. Role frozen for Q1 — hiring-manager request" /></Field>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setPubFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || (pubFor?.to !== 'Published' && !pubReason.trim())} onClick={doPublishAction} className={btnPrimary}>{busy ? 'Working…' : 'Confirm'}</button>
          </div>
        </div>
      </Modal>
      <ActionConfirm open={moveFor !== null} onCancel={() => setMoveFor(null)}
        title={`Move ${moveFor?.job.id || ''} → ${moveFor?.to || ''}`}
        subtitle={moveFor?.job.title || ''}
        why={[`Posting is currently ${moveFor?.job.status || ''}`, 'Transition is within the allowed job lifecycle']}
        steps={['Status changes immediately', 'Move is recorded with actor and timestamp']}
        consequences={(MOVE_COPY[moveFor?.to || '']?.consequences || []).concat(moveFor?.to === 'Closed' ? ['Reopening later needs approval, a reason and a future expiry'] : [])}
        confirmLabel={`Move to ${moveFor?.to || ''}`} tone="dark"
        onConfirm={async () => { if (moveFor) { await transition(moveFor.job.id, moveFor.to); setMoveFor(null); } }} />
      <GlobalCreateModal open={showCreateJob} onClose={() => setShowCreateJob(false)} title="New job posting" subtitle="Starts as Draft — publish from the board once approved" wide submitLabel="Create job"
        onSubmit={doCreateJob}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Job title *"><input className={kitInput} value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior React Developer" /></Field></div>
          {orgs.length > 0 && <Field label="Organization *"><Select value={jobForm.orgId} onChange={(v) => setJobForm({ ...jobForm, orgId: v })} placeholder="Choose company" options={orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id}` }))} /></Field>}
          <Field label="Requirement ID (links demand)"><input className={`${kitInput} font-mono`} value={jobForm.requisitionId} onChange={(e) => setJobForm({ ...jobForm, requisitionId: e.target.value })} placeholder="REQ-…" /></Field>
          <Field label="Location"><input className={kitInput} value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} /></Field>
          <Field label="Employment type"><Select value={jobForm.employmentType} onChange={(v) => setJobForm({ ...jobForm, employmentType: v })} options={['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => ({ value: t, label: t }))} /></Field>
          <Field label="Min salary (₹)"><input className={kitInput} type="number" min={0} value={jobForm.salaryMin} onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })} /></Field>
          <Field label="Max salary (₹)"><input className={kitInput} type="number" min={0} value={jobForm.salaryMax} onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })} /></Field>
          <Field label="Expiry date"><DatePicker value={jobForm.expiryDate} onChange={(v) => setJobForm({ ...jobForm, expiryDate: v })} ariaLabel="Expiry date" /></Field>
          <Field label="Visibility"><Select value={jobForm.visibility} onChange={(v) => setJobForm({ ...jobForm, visibility: v })} options={['public', 'private', 'assigned'].map((v) => ({ value: v, label: v }))} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><textarea rows={2} className={kitInput} value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} /></Field></div>
        </div>
      </GlobalCreateModal>
    </div>
  );
}

/* ---------------- Job drawer action bar (guards visible, locks explained) ---------------- */
export function JobDrawerActions({ job, requirement, onDone }: { job: any; requirement?: any; onDone: (updated: any) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<{ to: string; needReason: boolean; needExpiry: boolean } | null>(null);
  const [expiry, setExpiry] = useState('');
  const g = (action: string) => checkRecordAction('job', job, action, { context: requirement ? { requirement } : undefined });
  const run = async (to: string, r?: string, exp?: string) => {
    setBusy(true); setError('');
    try {
      const updated = unwrapObj(await jobsApi.setStatus(job.id, to, r, exp));
      if (updated?.id) onDone(updated);
      setConfirm(null); setExpiry('');
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const buttons: Array<{ label: string; to: string; primary?: boolean; danger?: boolean }> = [];
  if (job.status === 'Approved') buttons.push({ label: 'Publish…', to: 'Published', primary: true });
  if (job.status === 'Published') { buttons.push({ label: 'Pause', to: 'Paused' }); buttons.push({ label: 'Close…', to: 'Closed' }); buttons.push({ label: 'Unpublish…', to: 'Approved', danger: true }); }
  if (job.status === 'Paused') { buttons.push({ label: 'Republish…', to: 'Published', primary: true }); buttons.push({ label: 'Close…', to: 'Closed' }); }
  if (job.status === 'Closed') { buttons.push({ label: 'Reopen as Published…', to: 'Published', primary: true }); buttons.push({ label: 'Reopen as Paused…', to: 'Paused' }); }
  const locks = ['publish', 'unpublish', 'reopen', 'pause', 'close', 'archive'].map((a) => g(a)).filter((x) => !x.allowed).map((x) => x.reason);
  const openConfirm = (to: string) => {
    const needReason = to !== 'Published' || job.status === 'Closed';
    const needExpiry = to === 'Published';
    if (!needReason && !needExpiry) { run(to); return; }
    setConfirm({ to, needReason, needExpiry });
    setExpiry(String(job.expiryDate || '').slice(0, 10));
  };
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200" role="toolbar" aria-label="Job actions">
      {buttons.map((b) => (
        <button key={b.label} type="button" disabled={busy} onClick={() => openConfirm(b.to)}
          className={`px-4 py-2 rounded-xl font-bold text-xs disabled:opacity-50 ${b.primary ? 'bg-[#087BFF] text-white' : b.danger ? 'bg-white border border-red-200 text-red-600' : 'bg-white border border-slate-200'}`}>{b.label}</button>
      ))}
      {locks.length > 0 && (
        <div className="w-full space-y-1 pt-1 border-t border-slate-200">
          {locks.slice(0, 4).map((n) => <div key={n} className="text-[11px] font-bold text-amber-700">🔒 {n}</div>)}
        </div>
      )}
      {error && <div className="w-full p-2 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[11px] font-bold">{error}</div>}
      <ActionConfirm open={confirm !== null} onCancel={() => setConfirm(null)}
        title={`${confirm?.to === 'Published' && job.status !== 'Closed' ? 'Publish' : confirm?.to} ${job.id}`}
        subtitle={job.title}
        why={[`Posting is currently ${job.status}`, requirement ? `Parent requirement ${requirement.id} is ${requirement.status}` : 'Parent requirement checks run on confirm']}
        steps={[`Status moves to ${confirm?.to}`, 'Move recorded with actor and timestamp', confirm?.to === 'Published' ? 'Posting becomes visible to eligible candidates' : 'Posting leaves candidate results']}
        locks={confirm?.to === 'Approved' ? ['Unpublished postings accept no applications'] : confirm?.to === 'Published' && job.status === 'Closed' ? ['Reopening never bypasses the expiry guard'] : []}
        requireReason={confirm?.needReason} confirmLabel="Confirm"
        extra={confirm?.needExpiry ? (
          <Field label="Expiry date (must be future) *"><DatePicker value={expiry} onChange={setExpiry} ariaLabel="Expiry date" /></Field>
        ) : undefined}
        onConfirm={async (r) => {
          if (confirm?.needExpiry && !(new Date(expiry) > new Date())) throw new Error('Set a future expiry date first.');
          await run(confirm!.to, r, confirm?.needExpiry ? (expiry || undefined) : undefined);
        }} />
    </div>
  );
}

/* ---------------- Jobs Kanban (drop opens confirmation, never writes directly) ---------------- */
const KANBAN_ORDER = ['Draft', 'Pending Review', 'Approved', 'Published', 'Paused', 'Closed', 'Archived'];

export function JobsKanban({ jobs, onOpen, onDropMove }: { jobs: any[]; onOpen: (j: any) => void; onDropMove: (j: any, to: string) => void }) {
  const [dragId, setDragId] = useState<string | null>(null);
  const cols = KANBAN_ORDER.map((s) => ({ status: s, items: jobs.filter((j) => j.status === s) }));
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-3" data-lenis-prevent>
      <div className="flex gap-3 min-w-[1180px]">
        {cols.map((c) => (
          <div key={c.status} className="flex-1 min-w-[220px] rounded-2xl bg-white border border-slate-200 p-2 space-y-2"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const j = jobs.find((x) => x.id === dragId);
              setDragId(null);
              if (j && c.status !== j.status) onDropMove(j, c.status);
            }}>
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">{c.status}</span>
              <span className="text-[11px] font-extrabold text-slate-400">{c.items.length}</span>
            </div>
            {c.items.slice(0, 20).map((j) => (
              <div key={j.id} draggable onDragStart={() => setDragId(j.id)}
                onClick={() => onOpen(j)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(j); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 cursor-grab active:cursor-grabbing space-y-1" title="Open details (drop onto a column to move with confirmation)">
                <div className="font-extrabold text-xs text-slate-900 truncate">{j.title}</div>
                <div className="font-mono text-[10px] text-slate-500">{j.id}</div>
                <div className="text-[11px] font-bold text-slate-600">{j.counts?.applications ?? j.applicantsCount ?? 0} apps → {j.counts?.hired ?? 0} hired</div>
                <div className="text-[10px] font-bold text-slate-400">exp {String(j.expiryDate || '').slice(0, 10) || '—'}</div>
              </div>
            ))}
            {c.items.length > 20 && <div className="text-[10px] text-slate-400 font-bold px-1">+{c.items.length - 20} more — refine filters</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Support / Account issues (§6.1 Platform) ---------------- */
const TICKET_TRANSITIONS: Record<string, string[]> = { Open: ['In Progress', 'Closed'], 'In Progress': ['Resolved', 'Closed'], Resolved: ['Closed', 'In Progress'], Closed: [] };
export function SupportPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useQueryState('sup_q');
  const [statusF, setStatusF] = useQueryState('sup_status');
  const [form, setForm] = useState({ subject: '', category: 'Account', priority: 'Medium', body: '' });
  const [showOpen, setShowOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const load = async () => {
    setLoading(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      setRows(unwrapList(await directoryApi.supportTickets('?page=1&pageSize=100')));
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const open = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.subject.trim() || !form.body.trim()) return;
    setBusy(true);
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const created = unwrapObj(await directoryApi.openTicket(form));
      if (created?.id) setRows((r) => [created, ...r]);
      setForm({ subject: '', category: 'Account', priority: 'Medium', body: '' }); setShowOpen(false); setOk('Ticket opened.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const update = async (id: string, patch: any) => {
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const updated = unwrapObj(await directoryApi.updateTicket(id, patch));
      setRows((r) => r.map((x) => (x.id === id ? { ...x, ...(updated?.id ? updated : patch) } : x)));
      if (detail?.id === id) setDetail((d: any) => ({ ...d, ...(updated?.id ? updated : patch) }));
      setNote(''); setOk('Ticket updated.'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const filtered = rows.filter((t) => {
    if (statusF && t.status !== statusF) return false;
    if (!q.trim()) return true;
    return `${t.id} ${t.subject} ${t.requester} ${t.orgId}`.toLowerCase().includes(q.toLowerCase());
  });
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Support & Account Issues — Open / Triage / Resolve</h3>
          <div className="flex gap-2">
            <ExportButton filename="support.csv" rows={filtered} columns={['id', 'subject', 'requester', 'orgId', 'priority', 'status']} />
            <button type="button" onClick={() => setShowOpen(true)} className={btnPrimary}>+ Open ticket</button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <input className={`${inputCls} flex-1`} placeholder="Search ID, subject, requester, org…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="w-full lg:w-44 shrink-0">
            <Select value={statusF} onChange={setStatusF} ariaLabel="Ticket status filter" placeholder="All statuses"
              options={[{ value: '', label: 'All statuses' }, ...['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => ({ value: s, label: s }))]} />
          </div>
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <Modal open={showOpen} onClose={() => setShowOpen(false)} title="Open support ticket" subtitle="Account, billing, access and data issues">
        <form onSubmit={open} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Subject *"><input className={kitInput} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Cannot access billing invoices" /></Field></div>
          <Field label="Category"><Select value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={['Account', 'Billing', 'Access', 'Data', 'Other'].map((c) => ({ value: c, label: c }))} /></Field>
          <Field label="Priority"><Select value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={['Low', 'Medium', 'High'].map((p) => ({ value: p, label: p }))} /></Field>
          <div className="sm:col-span-2"><Field label="Describe the issue *"><textarea rows={4} className={kitInput} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowOpen(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button disabled={busy} className={btnPrimary}>{busy ? 'Opening…' : 'Open ticket'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading tickets…" /> : filtered.length === 0 ? (
        <EmptyState title="No tickets" message="Support and account issues land here." />
      ) : (
        <div className="space-y-2">{filtered.map((t) => (
          <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-extrabold text-slate-900 text-sm">{t.subject}</div>
              <div className="text-xs text-slate-500 font-medium">{t.id} • {t.requester} • {t.orgId} • <strong className="text-blue-600">{t.status}</strong> • {t.priority} priority</div>
            </div>
            <RowMenu items={[
              { label: 'View + notes', onSelect: () => { setDetail(t); setNote(''); } },
              ...(TICKET_TRANSITIONS[t.status] || []).map((s) => ({ label: `Move to ${s}`, onSelect: () => update(t.id, { status: s }) })),
            ]} />
          </div>
        ))}</div>
      )}
      <Modal open={detail !== null} onClose={() => setDetail(null)} title={detail?.subject || ''} subtitle={`${detail?.id || ''} • ${detail?.requester || ''} • ${detail?.status || ''}`}>
        <p className="text-xs text-slate-700 whitespace-pre-wrap p-3 rounded-xl bg-slate-50 border border-slate-200">{detail?.body}</p>
        <div className="text-xs font-extrabold">Staff notes ({(detail?.notes || []).length})</div>
        {(detail?.notes || []).length === 0 ? <div className="text-[11px] text-slate-500">No notes yet.</div> : (detail.notes || []).map((n: any, i: number) => (
          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"><strong>{n.by}</strong> • <span className="text-slate-500">{String(n.at || '').slice(0, 16).replace('T', ' ')}</span><div>{n.text}</div></div>
        ))}
        <div className="flex gap-2">
          <input className={`${kitInput} flex-1`} placeholder="Add a staff note…" value={note} onChange={(e) => setNote(e.target.value)} />
          <button type="button" disabled={!note.trim()} onClick={() => update(detail.id, { note: note.trim() })} className={btnDark}>Add note</button>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- Public jobs (paged compat) ---------------- */
export function usePublicJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try { setJobs(unwrapList(await jobsApi.public())); }
      catch { setJobs([]); }
      finally { setLoading(false); }
    })();
  }, []);
  return { jobs, loading };
}
