import { useState, useEffect } from 'react';
import { apiClient } from '../../shared/api-client';
import {
  applicationsApi, interviewsApi, chatApi, talentApi, requisitionsApi, jobsApi,
  offersPlacementsApi, billingApi, salesApi, platformApi, documentsApi, workforceApi,
} from '../../shared/enterprise/phaseApi';
import { invalidateCollections } from '../../shared/data/store';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { Modal, ConfirmDialog, RowMenu, Select, DatePicker, Field, inputCls as kitInput } from '../../shared/ui/EnterpriseKit';

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

/* ---------------- Phase 1: Requisitions — full CRUD ---------------- */
export function RequisitionsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState({ title: '', department: '', category: '', location: '', openings: 1, employmentType: 'Full-time', priority: 'Medium', description: '' });
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadError, setLoadError] = useState(0);
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const emptyForm = { title: '', department: '', category: '', location: '', openings: 1, employmentType: 'Full-time', priority: 'Medium', description: '' };
  const pageSize = 10;

  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      const res: any = await requisitionsApi.list(`?page=${p}&pageSize=${pageSize}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page ]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.title.trim()) return;
    setBusy(true);
    try {
      const created = unwrapObj(await requisitionsApi.create({ ...form, openings: Number(form.openings) || 1 }));
      if (created?.id) setRows((r) => [created, ...r]);
      setForm(emptyForm);
      setShowCreate(false);
      setOk('Requisition created as Draft.');
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const transition = async (id: string, status: string) => {
    try {
      const updated = unwrapObj(await requisitionsApi.setStatus(id, status));
      setRows((r) => r.map((x) => (x.id === id ? (updated?.id ? updated : { ...x, status }) : x)));
      setOk(`${id} → ${status}.`); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editing) return;
    setBusy(true); setError('');
    try {
      const updated = unwrapObj(await requisitionsApi.update(editing.id, { ...editing, openings: Number(editing.openings) || 1 }));
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...x, ...(updated?.id ? updated : editing) } : x)));
      setEditing(null); setOk('Requisition updated.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doDelete = async () => {
    if (!deleteFor) return;
    setBusy(true); setError('');
    try {
      await requisitionsApi.remove(deleteFor.id);
      setRows((r) => r.filter((x) => x.id !== deleteFor.id));
      setDeleteFor(null); setOk('Requisition deleted.'); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  const filtered = rows.filter((r) => {
    if (statusF && r.status !== statusF) return false;
    if (!q.trim()) return true;
    return `${r.id} ${r.title} ${r.department}`.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-extrabold text-slate-900">Job Requisitions — View / Edit / Approve / Delete</h3>
        <p className="text-xs text-slate-500 font-medium">Draft → Pending Approval → Approved → Sourcing → Filled. Edit allowed in Draft/Pending; delete in Draft/Cancelled.</p>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page)} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1"><input className={inputCls} placeholder="Search ID, title, department…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="flex gap-2">
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none">
            <option value="">All statuses</option>{['Draft', 'Pending Approval', 'Approved', 'Sourcing', 'On Hold', 'Filled', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="button" onClick={async () => { const { downloadCsv } = await import('./CrudKit'); downloadCsv('requisitions.csv', filtered, ['id', 'title', 'department', 'openings', 'status']); }} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export</button>
          <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New requisition</button>
        </div>
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New requisition" subtitle="Draft → Pending Approval → Approved → Sourcing">
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Requisition title *"><input className={kitInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior QA Automation Engineer" /></Field></div>
          <Field label="Department"><input className={kitInput} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Field>
          <Field label="Category"><input className={kitInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
          <Field label="Location"><input className={kitInput} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Employment type"><input className={kitInput} value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} /></Field>
          <Field label="Openings"><input className={kitInput} type="number" min={1} value={form.openings} onChange={(e) => setForm({ ...form, openings: Number(e.target.value) })} /></Field>
          <Field label="Priority"><Select value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={['Low', 'Medium', 'High', 'Critical'].map((p) => ({ value: p, label: p }))} /></Field>
          <div className="sm:col-span-2"><Field label="Role description"><input className={kitInput} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Responsibilities, must-haves…" /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy || !form.title.trim()}>{busy ? 'Creating…' : 'Create requisition'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading requisitions…" /> : filtered.length === 0 ? (
        <EmptyState title="No requisitions" message="Create the first hiring requisition to start the approval flow." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs min-w-[820px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Requisition</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Openings</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{r.title}</div><div className="font-mono text-[11px] text-slate-500">{r.id}</div></td>
                  <td className="px-4 py-3">{r.department || '—'}</td>
                  <td className="px-4 py-3 font-bold">{r.openings || 1}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{r.status}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end"><RowMenu items={[
                    { label: 'View details', onSelect: () => setDetail(r) },
                    { label: 'Edit…', onSelect: () => setEditing({ ...r }) },
                    ...(REQ_TRANSITIONS[r.status] || []).map((s) => ({ label: `Move to ${s}`, onSelect: () => transition(r.id, s) })),
                    { label: 'Delete…', danger: true, onSelect: () => setDeleteFor(r) },
                  ]} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager page={page} total={total || filtered.length} pageSize={pageSize} onPage={setPage} />
      {detail && (
        <Modal open onClose={() => setDetail(null)} title={detail.title} subtitle={`${detail.id} • ${detail.status}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[['Department', detail.department], ['Category', detail.category], ['Location', detail.location], ['Employment', detail.employmentType], ['Openings', detail.openings], ['Priority', detail.priority], ['Hiring manager', detail.hiringManager], ['Recruiter', detail.recruiter]].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1">{String(v ?? '—')}</div></div>
            ))}
            <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">Description</div><div className="font-medium mt-1 whitespace-pre-wrap">{detail.description || '—'}</div></div>
          </div>
        </Modal>
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit — ${editing?.id || ''}`} subtitle="Only Draft / Pending Approval can be edited">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Title"><input className={kitInput} value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field></div>
          <Field label="Department"><input className={kitInput} value={editing?.department || ''} onChange={(e) => setEditing({ ...editing, department: e.target.value })} /></Field>
          <Field label="Location"><input className={kitInput} value={editing?.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
          <Field label="Openings"><input className={kitInput} type="number" min={1} value={editing?.openings || 1} onChange={(e) => setEditing({ ...editing, openings: Number(e.target.value) })} /></Field>
          <Field label="Priority"><Select value={editing?.priority || 'Medium'} onChange={(v) => setEditing({ ...editing, priority: v })} options={['Low', 'Medium', 'High', 'Critical'].map((p) => ({ value: p, label: p }))} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><input className={kitInput} value={editing?.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy} onClick={saveEdit} className={btnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={deleteFor !== null} onCancel={() => setDeleteFor(null)} title={`Delete ${deleteFor?.id || ''}?`} body="Only Draft/Cancelled requisitions can be deleted. Linked jobs block deletion." confirmLabel="Delete" onConfirm={doDelete} />
    </div>
  );
}

/* ---------------- Phase 1/2: Applications (ATS) ---------------- */
export function ApplicationsPanel({ compact = false }: { compact?: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [reason, setReason] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [withdrawId, setWithdrawId] = useState('');
  const [loadError, setLoadError] = useState(0);
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
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
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };

  const filteredApps = rows.filter((a) => !q.trim() || `${a.id} ${a.jobTitle} ${a.candidateEmail}`.toLowerCase().includes(q.toLowerCase()));
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
            <button type="button" onClick={async () => { const { downloadCsv } = await import('./CrudKit'); downloadCsv('applications.csv', filteredApps, ['id', 'jobTitle', 'jobId', 'candidateEmail', 'stage']); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export</button>
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
                <div className="text-xs text-slate-500 font-medium">{a.id} • {a.candidateEmail} • <strong className="text-blue-600">{a.stage}</strong></div>
              </div>
              <RowMenu items={[
                { label: 'View + history', onSelect: () => openDetail(a) },
                ...moves.map((s) => ({ label: `Move to ${s}`, onSelect: () => move(a.id, s) })),
                ...(canWithdraw ? [{ label: 'Withdraw application', danger: true, onSelect: () => setWithdrawId(a.id) }] : []),
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
      <Modal open={detail !== null} onClose={() => setDetail(null)} title={`${detail?.jobTitle || detail?.jobId || ''}`} subtitle={`${detail?.id || ''} • ${detail?.candidateEmail || ''} • ${detail?.stage || ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Application', detail?.id], ['Job', `${detail?.jobTitle || ''} (${detail?.jobId || ''})`], ['Candidate', detail?.candidateEmail], ['Stage', detail?.stage], ['Source', detail?.source], ['Updated', String(detail?.updatedAt || '').slice(0, 10)]].map(([k, v]) => (
            <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
          ))}
        </div>
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
  const [q, setQ] = useState('');
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
  const [invForm, setInvForm] = useState({ orgId: '', label: 'Subscription — monthly', qty: '1', unit: '', dueDate: '' });
  const [q, setQ] = useState('');
  const [voidFor, setVoidFor] = useState<any>(null);
  const [voidReason, setVoidReason] = useState('');
  const [creditFor, setCreditFor] = useState<any>(null);
  const [creditForm, setCreditForm] = useState({ amount: '', reason: '' });
  const load = async () => {
    setError('');
    try {
      const [u, i, p, r] = await Promise.all([
        billingApi.usage().catch(() => null), billingApi.invoices().catch(() => null), billingApi.payments().catch(() => null), billingApi.refunds().catch(() => null),
      ]);
      if (u) setUsage(unwrapObj(u)); if (i) setInvoices(unwrapList(i)); if (p) setPayments(unwrapList(p)); if (r) setRefunds(unwrapList(r));
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
      const created = unwrapObj(await billingApi.createInvoice({ orgId: invForm.orgId.trim(), dueDate: invForm.dueDate, lines: [{ label: invForm.label, qty: Number(invForm.qty) || 1, unit: Number(invForm.unit) }] }));
      if (created?.id) setInvoices((x) => [created, ...x]);
      setInvForm({ orgId: '', label: 'Subscription — monthly', qty: '1', unit: '', dueDate: '' }); setShowInvoice(false);
      setOk('Invoice issued (immutable — amend via credit note).'); syncAll();
    } catch (e) { setError(errMsg(e)); }
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
            <button type="button" onClick={async () => { const { downloadCsv } = await import('./CrudKit'); downloadCsv('invoices.csv', filteredInv, ['id', 'number', 'orgId', 'total', 'balance', 'status']); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export</button>
            <button type="button" onClick={() => setShowInvoice(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">+ Invoice</button>
            <button type="button" onClick={() => setShowRefund(true)} className={btnDark}>Refund</button>
            <button type="button" onClick={() => setShowPay(true)} className={btnPrimary}>Record payment</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search invoice ID, number, org, status…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <Modal open={showInvoice} onClose={() => setShowInvoice(false)} title="Issue invoice" subtitle="Immutable once issued — corrections via void or credit note">
        <form onSubmit={createInvoice} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Organization ID *"><input className={kitInput} value={invForm.orgId} onChange={(e) => setInvForm({ ...invForm, orgId: e.target.value })} placeholder="TNT-9011" /></Field>
          <Field label="Due date *"><DatePicker value={invForm.dueDate} onChange={(v) => setInvForm({ ...invForm, dueDate: v })} /></Field>
          <div className="sm:col-span-2"><Field label="Line label"><input className={kitInput} value={invForm.label} onChange={(e) => setInvForm({ ...invForm, label: e.target.value })} /></Field></div>
          <Field label="Qty"><input className={kitInput} type="number" min={1} value={invForm.qty} onChange={(e) => setInvForm({ ...invForm, qty: e.target.value })} /></Field>
          <Field label="Unit price (₹) *"><input className={kitInput} type="number" value={invForm.unit} onChange={(e) => setInvForm({ ...invForm, unit: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowInvoice(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Issue invoice</button>
          </div>
        </form>
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
          {filteredInv.map((i) => (
            <div key={i.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold flex items-center justify-between gap-2">
                <span className="truncate">{i.number || i.id} • ₹{i.total} • bal ₹{i.balance} • {i.status}</span>
                <RowMenu items={[
                  { label: 'Void…', danger: true, onSelect: () => { setVoidFor(i); setVoidReason(''); } },
                  { label: 'Credit note…', onSelect: () => { setCreditFor(i); setCreditForm({ amount: '', reason: '' }); } },
                ]} />
              </div>
              <div className="text-slate-500 font-medium">
                issued {String(i.issueDate || i.createdAt || '').slice(0, 10)} • due {String(i.dueDate || '').slice(0, 10)} • sub ₹{i.subtotal} − disc ₹{i.discount} + tax ₹{i.tax}
                {Array.isArray(i.lines) && i.lines.length > 0 && ` • ${i.lines.length} line(s): ${i.lines.map((l: any) => `${l.label}×${l.qty}`).join(', ')}`}
              </div>
            </div>
          ))}
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
  const [q, setQ] = useState('');
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
  const filteredSubs = subs.filter((s) => !q.trim() || `${s.id} ${s.orgId} ${s.planId} ${s.status}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Plans & Subscriptions — Create / View / Suspend / Cancel / Export</h3>
          <div className="flex gap-2">
            <button type="button" onClick={async () => { const { downloadCsv } = await import('./CrudKit'); downloadCsv('subscriptions.csv', filteredSubs, ['id', 'orgId', 'planId', 'status', 'renewalDate']); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export</button>
            <button type="button" onClick={() => setShowPlan(true)} className={btnDark}>+ New plan</button>
            <button type="button" onClick={() => setShowSubscribe(true)} className={btnPrimary}>+ Subscribe org</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search subscription ID, org, plan, status…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {plans.map((p) => (
          <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold">{p.name} • ₹{p.price}/{p.interval} • v{p.version} • {p.status}</div>
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
          <div className="text-xs font-bold min-w-0 truncate">{s.id} • {s.orgId} • {s.planId} • <strong className="text-blue-600">{s.status}</strong> • renews {String(s.renewalDate || '').slice(0, 10)}</div>
          <RowMenu items={[
            { label: 'View terms', onSelect: () => setDetail(s) },
            ...['Trial', 'Active', 'Renewal Due', 'Past Due', 'Grace Period', 'Suspended', 'Cancelled', 'Expired'].filter((x) => x !== s.status).slice(0, 6).map((x) => ({ label: `Set ${x}`, danger: x === 'Cancelled', onSelect: () => setStatus(s.id, x) })),
          ]} />
        </div>
      ))}</div>
      <Modal open={detail !== null} onClose={() => setDetail(null)} title={`${detail?.id || ''}`} subtitle={`${detail?.orgId || ''} • ${detail?.planId || ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[['Status', detail?.status], ['Plan version', detail?.planVersion], ['Price', detail?.price], ['Currency', detail?.currency], ['Start', String(detail?.startDate || '').slice(0, 10)], ['Renewal', String(detail?.renewalDate || '').slice(0, 10)], ['Auto-renew', String(detail?.autoRenew)], ['Trial end', String(detail?.trialEnd || '').slice(0, 10)]].map(([k, v]) => (
            <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1">{String(v ?? '—')}</div></div>
          ))}
        </div>
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
  const [cq, setCq] = useState('');
  const filteredComms = commissions.filter((c) => !cq.trim() || `${c.id} ${c.orgId} ${c.agencyId} ${c.approvalStatus}`.toLowerCase().includes(cq.toLowerCase()));
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Commissions — Agreements → Approve → Adjust → Payout / Export</h3>
          <div className="flex gap-2">
            <button type="button" onClick={async () => { const { downloadCsv } = await import('./CrudKit'); downloadCsv('commissions.csv', filteredComms, ['id', 'orgId', 'agencyId', 'gross', 'total', 'approvalStatus', 'paymentStatus']); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export</button>
            <button type="button" onClick={() => setShowAgreement(true)} className={btnPrimary}>+ New agreement</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search commission ID, org, agency, status…" value={cq} onChange={(e) => setCq(e.target.value)} />
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={load} />}
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
      {filteredComms.map((c) => (
        <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
          <span className="min-w-0 truncate">{c.id} • gross ₹{c.gross} • total ₹{c.total || c.net} • {c.approvalStatus}/{c.paymentStatus}</span>
          <RowMenu items={[
            ...(c.approvalStatus !== 'Approved' ? [{ label: 'Approve commission', onSelect: () => approve(c.id) }] : []),
            ...(c.approvalStatus === 'Approved' && c.paymentStatus !== 'Paid' ? [{ label: 'Process payout', onSelect: () => setPayoutId(c.id) }] : []),
            { label: 'Adjustments', onSelect: async () => {
              setAdjustFor(c); setAdjustForm({ amount: '', reason: '' });
              try { setAdjustments(unwrapList(await workforceApi.adjustments(c.id))); }
              catch (e) { setError(errMsg(e)); }
            } },
          ]} />
        </div>
      ))}
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
  const [form, setForm] = useState({ contactName: '', companyName: '', email: '', phone: '', industry: '', source: '', priority: 'Medium', nextFollowUp: '', value: '', notes: '' });
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
  const [q, setQ] = useState('');
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
      setForm({ contactName: '', companyName: '', email: '', phone: '', industry: '', source: '', priority: 'Medium', nextFollowUp: '', value: '', notes: '' });
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
  const filteredLeads = rows.filter((l) => !q.trim() || `${l.id} ${l.contactName} ${l.companyName} ${l.email}`.toLowerCase().includes(q.toLowerCase()));
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
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Lead Pipeline — View / Edit / Convert / Delete</h3>
          <div className="flex gap-2">
            <button type="button" onClick={async () => { const { downloadCsv } = await import('./CrudKit'); downloadCsv('leads.csv', filteredLeads, ['id', 'contactName', 'companyName', 'email', 'stage', 'value', 'owner']); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Export</button>
            <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New lead</button>
          </div>
        </div>
        <input className={inputCls} placeholder="Search contact, company, email, ID…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page)} />}
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
              <div className="font-extrabold text-slate-900 text-sm">{l.contactName} — {l.companyName}</div>
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
          {[['Email', detail?.email], ['Phone', detail?.phone], ['Industry', detail?.industry], ['Source', detail?.source], ['Value', detail?.value], ['Owner', detail?.owner], ['Next follow-up', detail?.nextFollowUp], ['Notes', detail?.notes]].map(([k, v]) => (
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

/* ---------------- SuperAdmin: candidate directory (§6.3) ---------------- */
export function CandidatesPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', roleTitle: '', experienceYears: '', location: '', currentCtc: '', expectedCtc: '', noticePeriod: '', skills: '', visibility: 'standard' });
  const [statusFor, setStatusFor] = useState<any>(null);
  const [statusForm, setStatusForm] = useState({ status: 'Suspended', reason: '' });
  const [busy, setBusy] = useState(false);
  const pageSize = 10;
  const debouncedQ = useDebouncedValue(q, 400);
  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      const res: any = await directoryApi.candidatesDirectory(`?page=${p}&pageSize=${pageSize}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || res?.pagination?.totalPages ? Number(res?.pagination?.total || unwrapList(res).length) : unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page ]);
  useEffect(() => { setPage(1); }, [debouncedQ]);
  const filtered = rows.filter((c) => {
    if (status && String(c.status || 'Active') !== status) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return `${c.name} ${c.email} ${c.roleTitle} ${c.location} ${c.id}`.toLowerCase().includes(s);
  });
  const openEdit = (c: any) => {
    setEditing(c);
    setEditForm({ name: c.name || '', phone: c.phone || '', roleTitle: c.roleTitle || '', experienceYears: String(c.experienceYears ?? ''), location: c.location || '', currentCtc: String(c.currentCtc ?? ''), expectedCtc: String(c.expectedCtc ?? ''), noticePeriod: c.noticePeriod || '', skills: Array.isArray(c.skills) ? c.skills.join(', ') : (c.skills || ''), visibility: c.visibility || 'standard' });
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
      const res: any = await directoryApi.setCandidateStatus(statusFor.id, statusForm.status, statusForm.reason.trim());
      const updated = (res as { data?: any })?.data;
      setRows((r) => r.map((x) => (x.id === statusFor.id ? { ...x, ...(updated || { status: statusForm.status }) } : x)));
      setStatusFor(null); setOk(`Candidate ${statusFor.id} → ${statusForm.status}.`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const exportCsv = async () => {
    const { downloadCsv } = await import('./CrudKit');
    downloadCsv('candidates.csv', filtered, ['id', 'name', 'email', 'phone', 'roleTitle', 'experienceYears', 'location', 'status']);
  };
  const pill = (s: string) => {
    const tone = s === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s === 'Suspended' || s === 'Blocked' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200';
    return <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${tone}`}>{s || 'Active'}</span>;
  };
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-extrabold text-slate-900">Candidate Directory — View / Edit / Suspend / Export</h3>
        <p className="text-xs text-slate-500 font-medium">Phone/CTC masked unless your role grants sensitive-field access. All edits and status changes are audited.</p>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1"><input className={inputCls} placeholder="Search name, email, title, location, ID…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none">
            <option value="">All statuses</option>{['Active', 'Suspended', 'Blocked'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="button" onClick={exportCsv} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs hover:bg-slate-50">Export</button>
        </div>
      </div>
      {loading ? <InlineLoading message="Loading candidates…" /> : filtered.length === 0 ? (
        <EmptyState title="No candidates" message="Registered candidate profiles appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs min-w-[960px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{c.name || '—'}</div><div className="font-mono text-[11px] text-slate-500">{c.id}</div></td>
                  <td className="px-4 py-3"><div>{c.email || '—'}</div><div className="text-slate-500">{c.phone || '—'}</div></td>
                  <td className="px-4 py-3">{c.roleTitle || '—'} • {c.experienceYears ?? '—'}y</td>
                  <td className="px-4 py-3">{c.location || '—'}</td>
                  <td className="px-4 py-3">{pill(c.status || 'Active')}</td>
                  <td className="px-4 py-3"><div className="flex justify-end"><RowMenu items={[
                    { label: 'View profile', onSelect: () => setDetail(c) },
                    { label: 'Edit profile', onSelect: () => openEdit(c) },
                    { label: 'Suspend / Block / Restore…', onSelect: () => { setStatusFor(c); setStatusForm({ status: 'Suspended', reason: '' }); } },
                  ]} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager page={page} total={total || filtered.length} pageSize={pageSize} onPage={setPage} />
      {detail && (
        <Modal open onClose={() => setDetail(null)} title={detail.name || detail.id} subtitle={`${detail.id} • ${detail.email || ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[['Email', detail.email], ['Phone', detail.phone], ['Designation', detail.roleTitle], ['Experience', detail.experienceYears], ['Location', detail.location], ['Current CTC', detail.currentCtc], ['Expected CTC', detail.expectedCtc], ['Notice', detail.noticePeriod], ['Skills', Array.isArray(detail.skills) ? detail.skills.join(', ') : detail.skills], ['Visibility', detail.visibility], ['Status', detail.status]].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => { openEdit(detail); setDetail(null); }} className={btnPrimary}>Edit profile</button>
          </div>
        </Modal>
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit candidate — ${editing?.id || ''}`} subtitle="Audited edit">
        <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name"><input className={kitInput} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Field>
          <Field label="Phone"><input className={kitInput} value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></Field>
          <Field label="Designation"><input className={kitInput} value={editForm.roleTitle} onChange={(e) => setEditForm({ ...editForm, roleTitle: e.target.value })} /></Field>
          <Field label="Experience (yrs)"><input className={kitInput} type="number" value={editForm.experienceYears} onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })} /></Field>
          <Field label="Location"><input className={kitInput} value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /></Field>
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
      <Modal open={statusFor !== null} onClose={() => setStatusFor(null)} title={`Account status — ${statusFor?.id || ''}`} subtitle="Reason is mandatory and audited">
        <div className="space-y-3">
          <Field label="Status"><Select value={statusForm.status} onChange={(v) => setStatusForm({ ...statusForm, status: v })} options={['Active', 'Suspended', 'Blocked'].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="Reason *"><textarea rows={3} className={kitInput} value={statusForm.reason} onChange={(e) => setStatusForm({ ...statusForm, reason: e.target.value })} placeholder="e.g. Fake profile — support ticket SUP-88" /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setStatusFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !statusForm.reason.trim()} onClick={doStatus} className={btnDark}>{busy ? 'Working…' : 'Confirm'}</button>
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
export function AgencyPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ legalName: '', displayName: '', contactName: '', contactEmail: '', specialties: '', locations: '', commercialModel: '' });
  const load = async () => {
    setLoading(true); setError('');
    try { setRows(unwrapList(await workforceApi.agencies())); }
    catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.legalName.trim()) return;
    try {
      const created = unwrapObj(await workforceApi.createAgency(form));
      if (created?.id) setRows((r) => [created, ...r]);
      setForm({ legalName: '', displayName: '', contactName: '', contactEmail: '', specialties: '', locations: '', commercialModel: '' });
      setShowCreate(false); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const update = async (id: string, body: any) => {
    try { const u = unwrapObj(await workforceApi.updateAgency(id, body)); setRows((r) => r.map((x) => (x.id === id ? u : x))); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Agency Directory — Onboard & Verify</h3>
        <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ Onboard agency</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Onboard agency">
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Legal name *"><input className={kitInput} value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} /></Field>
          <Field label="Display name"><input className={kitInput} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></Field>
          <Field label="Contact name"><input className={kitInput} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></Field>
          <Field label="Contact email"><input className={kitInput} value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></Field>
          <Field label="Specialties"><input className={kitInput} value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} /></Field>
          <Field label="Locations served"><input className={kitInput} value={form.locations} onChange={(e) => setForm({ ...form, locations: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Commercial model"><input className={kitInput} value={form.commercialModel} onChange={(e) => setForm({ ...form, commercialModel: e.target.value })} placeholder="e.g. 8.33% CTC, 90-day replacement" /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Onboard</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading agencies…" /> : rows.length === 0 ? (
        <EmptyState title="No agencies" message="Onboard the first recruitment partner." />
      ) : (
        <div className="space-y-2">
          {rows.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 text-sm truncate">{a.displayName || a.legalName}</div>
                <div className="text-xs text-slate-500 font-medium">{a.id} • verification <strong>{a.verificationStatus}</strong> • account <strong>{a.accountStatus}</strong> • {a.specialties || '—'}</div>
              </div>
              <RowMenu label="Agency actions" items={[
                { label: 'Approve verification', onSelect: () => update(a.id, { verificationStatus: 'Approved' }) },
                { label: 'Reject verification', danger: true, onSelect: () => update(a.id, { verificationStatus: 'Rejected' }) },
                { label: 'Suspend agency', danger: true, onSelect: () => update(a.id, { accountStatus: 'Suspended', reason: 'suspended by admin' }) },
                { label: 'Reactivate agency', onSelect: () => update(a.id, { accountStatus: 'Active' }) },
              ]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Phase 5: Admin controls ---------------- */export function AdminControlsPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState<{ title: string; body: string; confirm: string; run: () => unknown } | null>(null);
  const load = async () => {
    setError('');
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      setUsers(unwrapList(await directoryApi.users()));
      setTenants(unwrapList(await directoryApi.tenants()));
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const act = async (fn: Promise<unknown>) => {
    try { await fn; load(); } catch (e) { setError(errMsg(e)); }
  };
  const confirm = (title: string, body: string, confirmLabel: string, run: () => unknown) => setPending({ title, body, confirm: confirmLabel, run });
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
