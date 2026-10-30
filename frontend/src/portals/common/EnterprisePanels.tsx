import { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import { FileText, Download, ExternalLink, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../shared/api-client';
import { Candidate360Drawer, AgencyDrawer } from '../superadmin/SuperAdmin360';
import { ExportButton, useQueryState, useDebounced, checkRecordAction, useActionGuard, DetailDrawer, SearchSuggest, DrawerCard, DrawerList, StatusPill, KeyValues, drawerTone, CrudToolbar } from './CrudKit';
import { useAuth, useCan, usePermissions } from '../../shared/auth/AuthContext';
import {
  applicationsApi, interviewsApi, chatApi, talentApi, requisitionsApi, jobsApi,
  offersPlacementsApi, billingApi, salesApi, platformApi, documentsApi, workforceApi, directoryApi,
} from '../../shared/enterprise/phaseApi';
import { invalidateCollections } from '../../shared/data/store';
import { getActiveRole } from '../../shared/auth/session';
import { EmptyState, InlineLoading } from '../../shared/ui/DataState';
import { Modal, ConfirmDialog, RowMenu, Select, DatePicker, Field, ActionConfirm, RichText, inputCls as kitInput } from '../../shared/ui/EnterpriseKit';
import { sanitizeHtml, escHtml } from '../../shared/utils';
import { bulkPublish, unpublishJob } from './jobPublish';

/** Portal base from the URL (/superadmin, /employer…) — full-page creators navigate under it. */
export function portalBase(): string {
  const seg = window.location.pathname.split('/')[1];
  return seg ? `/${seg}` : '';
}

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
const cardCls = 'bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3';

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

/** Taxonomy skill picker (§14.2) — search + category, chips, custom entries. Stores comma-separated string. */
export function SkillPicker({ value, onChange, placeholder = 'Type to search skills…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const [sugs, setSugs] = useState<any[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [cat, setCat] = useState('');
  const selected = value.split(',').map((s) => s.trim()).filter(Boolean);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r: any = await documentsApi.skills(dq.trim(), cat);
        if (!live) return;
        setSugs(unwrapList(r).slice(0, 12));
        const c = (r as { categories?: string[] })?.categories;
        if (Array.isArray(c)) setCats(c);
      } catch { if (live) setSugs([]); }
    })();
    return () => { live = false; };
  }, [dq, cat]);
  const toggle = (name: string) => {
    const has = selected.some((s) => s.toLowerCase() === name.toLowerCase());
    onChange(has ? selected.filter((s) => s.toLowerCase() !== name.toLowerCase()).join(', ') : [...selected, name].join(', '));
  };
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {selected.map((s) => (
          <button key={s} type="button" onClick={() => toggle(s)} title={`Remove ${s}`}
            className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">✕ {s}</button>
        ))}
        {selected.length === 0 && <span className="text-[11px] text-slate-400 font-medium">No skills selected</span>}
      </div>
      <div className="flex gap-1.5">
        <input className={kitInput} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Search skills" />
        {cats.length > 0 && (
          <div className="w-[130px] shrink-0">
            <Select value={cat} onChange={setCat} ariaLabel="Skill category" placeholder="All industries"
              options={[{ value: '', label: 'All industries' }, ...cats.map((c) => ({ value: c, label: c }))]} />
          </div>
        )}
      </div>
      {(sugs.length > 0 || dq.trim()) && (
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 rounded-xl bg-slate-50 border border-slate-200" data-lenis-prevent>
          {sugs.filter((s) => !selected.some((x) => x.toLowerCase() === String(s.name).toLowerCase())).map((s: any) => (
            <button key={s.id} type="button" onClick={() => toggle(s.name)} title={s.category}
              className="px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-[11px] hover:border-[#0B5FD9]">+ {s.name}</button>
          ))}
          {dq.trim() && !sugs.some((s) => String(s.name).toLowerCase() === dq.trim().toLowerCase()) && (
            <button type="button" onClick={() => toggle(dq.trim())} className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 font-bold text-[11px]">+ Use “{dq.trim()}”</button>
          )}
        </div>
      )}
    </div>
  );
}

/** Minimal CSV parser (quoted fields, CRLF) — no dependency. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = []; let cell = ''; let q = false;
  const push = () => { row.push(cell); cell = ''; };
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i += 1; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') push();
    else if (ch === '\n') { push(); rows.push(row); row = []; }
    else if (ch === '\r') { /* skip */ }
    else cell += ch;
  }
  push(); rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/** Bulk import: paste/attach CSV → server preview (valid/duplicate/error) → confirm commit. */
export function BulkImportModal({ open, onClose, title, subtitle, collection, columns, sample, onDone }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  collection: 'skills' | 'roles'; columns: string[]; sample: string; onDone?: () => void;
}) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (open) { setText(''); setPreview(null); setReport(null); setError(''); } }, [open ]);
  const toRows = () => {
    const grid = parseCsv(text);
    if (grid.length === 0) return [];
    const head = grid[0].map((h) => h.trim().toLowerCase());
    const idx = columns.map((c) => head.indexOf(c.toLowerCase()));
    if (idx.some((i) => i < 0)) return [];
    return grid.slice(1).map((r) => Object.fromEntries(columns.map((c, j) => [c, (r[idx[j]] || '').trim()])));
  };
  const run = async (mode: 'preview' | 'commit') => {
    const rows = toRows();
    if (rows.length === 0) { setError(`CSV needs a header row: ${columns.join(', ')}`); return; }
    setBusy(true); setError('');
    try {
      const { bulkApi } = await import('../../shared/enterprise/phaseApi');
      const r = unwrapObj(await bulkApi.import(collection, rows, mode));
      if (mode === 'preview') { setPreview(r); setReport(null); }
      else { setReport(r); setPreview(null); onDone?.(); }
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const pick = async (f: File | undefined) => {
    if (!f) return;
    setText(await f.text());
  };
  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle} wide>
      <div className="space-y-3 text-xs">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold cursor-pointer">Choose CSV file
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          <button type="button" onClick={() => setText(sample)} className="text-[11px] font-bold text-blue-600 underline">Load sample template</button>
          <span className="text-[11px] text-slate-500 font-medium">Header: {columns.join(', ')}</span>
        </div>
        <Field label="Paste CSV (or attach a file above)"><textarea rows={5} className={`${kitInput} font-mono`} value={text} onChange={(e) => setText(e.target.value)} placeholder={sample} /></Field>
        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-bold" role="alert">{error}</div>}
        <div className="flex justify-end gap-2">
          <button type="button" disabled={busy || !text.trim()} onClick={() => run('preview')} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold">1. Preview & dedupe check</button>
          <button type="button" disabled={busy || !preview} onClick={() => run('commit')} className={btnPrimary}>{busy ? 'Working…' : '2. Confirm import'}</button>
        </div>
        {(preview || report) && (
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {report ? `Imported: ${report.summary.created} created • ${report.summary.duplicates} duplicates skipped • ${report.summary.errors} errors` : `Preview: ${preview.summary.valid} valid • ${preview.summary.duplicates} duplicates • ${preview.summary.errors} errors`}
            </div>
            <div className="max-h-56 overflow-y-auto divide-y divide-slate-100" data-lenis-prevent>
              {((report || preview).rows || []).map((r: any, i: number) => (
                <div key={i} className="px-3 py-1.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px]">row {r.row}: {r.message}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${r.status === 'created' || r.status === 'valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.status === 'duplicate' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/** Application picker — search applications by candidate/job/ID, pick one (body portal, never clips). */
export function ApplicationPicker({ value, onChange, onPick, placeholder = 'Search candidate, job, application ID…' }: { value: string; onChange: (id: string) => void; onPick?: (app: any) => void; placeholder?: string }) {
  const [q, setQ] = useState(value);
  const dq = useDebounced(q);
  const [opts, setOpts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!dq.trim()) { setOpts([]); return; }
    let live = true;
    (async () => {
      try {
        const res: any = await applicationsApi.list(`?page=1&pageSize=8&q=${encodeURIComponent(dq.trim())}`);
        if (!live) return;
        setOpts(unwrapList(res)); setOpen(true);
        const r = inputRef.current?.getBoundingClientRect();
        if (r) setPos({ top: Math.min(r.bottom + 4, window.innerHeight - 240), left: Math.max(8, Math.min(r.left, window.innerWidth - 340)), width: Math.max(r.width, 300) });
      } catch { if (live) setOpts([]); }
    })();
    return () => { live = false; };
  }, [dq]);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [open ]);
  const chosen = value ? { id: value } : null;
  return (
    <>
      <input ref={inputRef} className={kitInput} value={q} placeholder={placeholder} aria-label="Pick application"
        onChange={(e) => { setQ(e.target.value); onChange(''); }} onFocus={() => { if (opts.length > 0) setOpen(true); }} />
      {chosen && q === value ? <div className="mt-1 text-[11px] font-bold text-emerald-700">Selected: {value}</div> : null}
      {open && opts.length > 0 && createPortal(
        <div style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 210 }} className="bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 max-h-56 overflow-y-auto" data-lenis-prevent>
          {opts.map((a: any) => (
            <button key={a.id} type="button" onClick={() => { onChange(a.id); onPick?.(a); setQ(a.id); setOpen(false); }}
              className="w-full text-left px-3.5 py-2 hover:bg-slate-50">
              <div className="text-xs font-extrabold text-slate-900">{a.jobTitle || a.jobId}</div>
              <div className="text-[11px] text-slate-500 font-medium">{a.id} • {a.candidateEmail} • <strong className="text-blue-600">{a.stage}</strong></div>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

/** Linked commercial records for a placement: commission + invoices, live. */
export function PlacementLinks({ placement }: { placement: any }) {
  const [comms, setComms] = useState<any[]>([]);
  const [invs, setInvs] = useState<any[]>([]);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [c, i] = await Promise.all([
          billingApi.commissions(`?page=1&pageSize=10&q=${encodeURIComponent(placement.applicationId || placement.id)}`).catch(() => null),
          billingApi.invoices(`?page=1&pageSize=10&q=${encodeURIComponent(placement.applicationId || '')}`).catch(() => null),
        ]);
        if (!live) return;
        setComms(unwrapList(c)); setInvs(unwrapList(i));
      } catch { /* best-effort */ }
    })();
    return () => { live = false; };
  }, [placement?.id]);
  return (
    <div className="space-y-2">
      <div className="text-xs font-extrabold text-slate-700">Commission ({comms.length})</div>
      {comms.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No commission minted yet.</div> : comms.map((c: any) => (
        <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">{c.id} • gross ₹{Number(c.gross || 0).toLocaleString('en-IN')} • {c.approvalStatus}/{c.paymentStatus}{c.invoiceId ? ` • inv ${c.invoiceId}` : ''}</div>
      ))}
      <div className="text-xs font-extrabold text-slate-700">Invoices ({invs.length})</div>
      {invs.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No invoices yet — approve the commission, then generate one.</div> : invs.map((v: any) => (
        <div key={v.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold">{v.number || v.id} • ₹{Number(v.total || 0).toLocaleString('en-IN')} • {v.status} • bal ₹{Number(v.balance || 0).toLocaleString('en-IN')}</div>
      ))}
    </div>
  );
}

/** Invoice picker — open (unpaid balance) invoices with company + balance preview. */
export function InvoicePicker({ value, onChange, placeholder = 'Search invoice number, company…' }: { value: string; onChange: (id: string, inv?: any) => void; placeholder?: string }) {
  const [q, setQ] = useState(value);
  const dq = useDebounced(q);
  const [opts, setOpts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!dq.trim()) { setOpts([]); return; }
    let live = true;
    (async () => {
      try {
        const res: any = await billingApi.invoices(`?page=1&pageSize=8&q=${encodeURIComponent(dq.trim())}`);
        if (!live) return;
        setOpts(unwrapList(res).filter((i: any) => Number(i.balance || 0) > 0 && ['Issued', 'Partially Paid'].includes(i.status)));
        setOpen(true);
        const r = inputRef.current?.getBoundingClientRect();
        if (r) setPos({ top: Math.min(r.bottom + 4, window.innerHeight - 240), left: Math.max(8, Math.min(r.left, window.innerWidth - 360)), width: Math.max(r.width, 320) });
      } catch { if (live) setOpts([]); }
    })();
    return () => { live = false; };
  }, [dq]);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [open ]);
  return (
    <>
      <input ref={inputRef} className={kitInput} value={q} placeholder={placeholder} aria-label="Pick invoice"
        onChange={(e) => { setQ(e.target.value); onChange(''); }} onFocus={() => { if (opts.length > 0) setOpen(true); }} />
      {open && opts.length > 0 && createPortal(
        <div style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 210 }} className="bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 max-h-56 overflow-y-auto" data-lenis-prevent>
          {opts.map((i: any) => (
            <button key={i.id} type="button" onClick={() => { onChange(i.id, i); setQ(i.id); setOpen(false); }}
              className="w-full text-left px-3.5 py-2 hover:bg-slate-50">
              <div className="text-xs font-extrabold text-slate-900">{i.number || i.id} • {i.orgId}</div>
              <div className="text-[11px] text-slate-500 font-medium">bal <strong>₹{Number(i.balance || 0).toLocaleString('en-IN')}</strong> of ₹{Number(i.total || 0).toLocaleString('en-IN')} • {i.status}</div>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

/** Payment picker — successful payments eligible for refund. */
export function PaymentPicker({ value, onChange, placeholder = 'Search payment, invoice…' }: { value: string; onChange: (id: string, pay?: any) => void; placeholder?: string }) {
  const [q, setQ] = useState(value);
  const dq = useDebounced(q);
  const [opts, setOpts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!dq.trim()) { setOpts([]); return; }
    let live = true;
    (async () => {
      try {
        const res: any = await billingApi.payments(`?page=1&pageSize=8&q=${encodeURIComponent(dq.trim())}`);
        if (!live) return;
        setOpts(unwrapList(res).filter((p: any) => p.status === 'succeeded'));
        setOpen(true);
        const r = inputRef.current?.getBoundingClientRect();
        if (r) setPos({ top: Math.min(r.bottom + 4, window.innerHeight - 240), left: Math.max(8, Math.min(r.left, window.innerWidth - 360)), width: Math.max(r.width, 320) });
      } catch { if (live) setOpts([]); }
    })();
    return () => { live = false; };
  }, [dq]);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [open ]);
  return (
    <>
      <input ref={inputRef} className={kitInput} value={q} placeholder={placeholder} aria-label="Pick payment"
        onChange={(e) => { setQ(e.target.value); onChange(''); }} onFocus={() => { if (opts.length > 0) setOpen(true); }} />
      {open && opts.length > 0 && createPortal(
        <div style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 210 }} className="bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 max-h-56 overflow-y-auto" data-lenis-prevent>
          {opts.map((p: any) => (
            <button key={p.id} type="button" onClick={() => { onChange(p.id, p); setQ(p.id); setOpen(false); }}
              className="w-full text-left px-3.5 py-2 hover:bg-slate-50">
              <div className="text-xs font-extrabold text-slate-900">{p.id} • ₹{Number(p.amount || 0).toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-500 font-medium">invoice {p.invoiceId} • {p.orgId}{p.refundedAmount ? ` • refunded ₹${p.refundedAmount}` : ''}</div>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
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

/** Records-per-page selector (20/50/100) paired with server pagination. */
export function PageSize({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
      Show
      <span className="w-[76px] inline-block">
        <Select value={String(value)} onChange={(v) => onChange(Number(v))} ariaLabel="Records per page"
          options={[20, 50, 100].map((n) => ({ value: String(n), label: String(n) }))} />
      </span>
      / page
    </span>
  );
}

/** Info pattern (§5): ⓘ button opening a titled explainer modal. Use beside any guarded/derived action. */
export function InfoTip({ title, body }: { title: string; body: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`About: ${title}`} title={title}
        className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-slate-200 hover:bg-[#0B5FD9] hover:text-white text-slate-600 text-[11px] font-extrabold shrink-0">i</button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <div className="text-xs text-slate-700 space-y-2 leading-relaxed">{body}</div>
      </Modal>
    </>
  );
}

/** Accessible two-step destructive confirm (§5.4/§5.5) — replaces window.confirm. */
export function ConfirmButton({ label, confirmLabel = 'Confirm?', onConfirm, className }: { label: string; confirmLabel?: string; onConfirm: () => void | Promise<void>; className?: string }) {
  const [arming, setArming] = useState(false);
  const [busy, setBusy] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  // P4: focus confirm on arm + auto-disarm after 10s so it can't stay armed.
  useEffect(() => {
    if (!arming) return;
    confirmRef.current?.focus();
    const t = setTimeout(() => setArming(false), 10000);
    return () => clearTimeout(t);
  }, [arming]);
  if (!arming) {
    return <button type="button" className={className} onClick={() => setArming(true)}>{label}</button>;
  }
  return (
    <span className="inline-flex items-center gap-1.5" role="alertdialog" aria-live="assertive" aria-label={confirmLabel}>
      <button
        ref={confirmRef}
        type="button"
        disabled={busy}
        aria-busy={busy}
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

/* ---------------- Shared: activity timeline + recruiter assignment ---------------- */
export type ActivityItem = { at?: string; title: string; meta?: React.ReactNode; tone?: 'ok' | 'info' | 'warn' | 'bad' | 'neutral' };

const ACTIVITY_TONE: Record<string, string> = {
  ok: 'bg-emerald-500', info: 'bg-blue-500', warn: 'bg-amber-500', bad: 'bg-red-500', neutral: 'bg-slate-400',
};

export function sortActivity(items: ActivityItem[]): ActivityItem[] {
  return [...items].sort((a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime()).slice(0, 60);
}

/** One timeline look for every drawer — dot + card + actor/time meta. */
export function ActivityTimeline({ items, empty = 'No activity recorded yet.' }: { items: ActivityItem[]; empty?: string }) {
  if (items.length === 0) {
    return <div className="p-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-[11px] font-semibold text-slate-500">{empty}</div>;
  }
  return (
    <ol className="relative space-y-2 pl-4">
      <span aria-hidden="true" className="absolute left-[3px] top-2 bottom-2 w-px bg-slate-200" />
      {items.map((it, i) => (
        <li key={`${it.title}-${it.at || ''}-${i}`} className="relative">
          <span aria-hidden="true" className={`absolute -left-4 top-2 w-2 h-2 rounded-full ring-2 ring-white ${ACTIVITY_TONE[it.tone || 'neutral']}`} />
          <div className="p-2.5 rounded-xl bg-white border border-slate-200">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-extrabold text-slate-900 leading-4">{it.title}</span>
              <span className="text-[10px] font-bold text-slate-400 shrink-0 tabular-nums">
                {it.at ? `${String(it.at).slice(0, 10)} ${String(it.at).slice(11, 16)}` : ''}
              </span>
            </div>
            {it.meta ? <div className="text-[11px] font-medium text-slate-500 mt-0.5 break-words">{it.meta}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Human label for audit actions such as `REQUISITION_STATUS:REQ-1 A->B`. */
export function auditLabel(action: string): string {
  const [head, tail] = String(action).split(':');
  const nice = head.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  if (!tail) return nice;
  return `${nice} • ${tail.replace(/->/g, ' → ')}`;
}

const RECRUITER_ROLES = ['internal_recruiter', 'company_recruiter', 'recruiter', 'operations_admin', 'employee', 'hiring_manager'];

/** Active assignable people for the caller's org — [] when the directory is unavailable. */
export async function loadAssignableRecruiters(): Promise<any[]> {
  try {
    const res: any = await directoryApi.users('?page=1&pageSize=200');
    return unwrapList(res).filter((u: any) => RECRUITER_ROLES.includes(u.role) && String(u.status || '').toLowerCase() === 'active');
  } catch { return []; }
}

/**
 * Shared assign-recruiter modal — used by the requirements table, the requirement
 * drawer and the job drawer. Assignment always goes through POST /requisitions/:id/assign
 * (no status gate, records owner + history); a typed email keeps it usable even when
 * the user directory returns nothing.
 */
export function AssignRecruiterModal({ open, targets, rows = [], onClose, onDone }: {
  open: boolean; targets: any[]; rows?: any[]; onClose: () => void; onDone?: (updated: any[]) => void;
}) {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setQ(''); setEmail(''); setError(''); setBusy(false);
    setLoading(true);
    let live = true;
    (async () => {
      const list = await loadAssignableRecruiters();
      if (!live) return;
      // Fallback: people already named on visible requirements — works even if the directory is restricted.
      const known = [...new Set(rows.map((r: any) => String(r?.recruiter || '').trim()).filter(Boolean))]
        .map((e: string) => ({ id: `eml:${e}`, name: e.split('@')[0], email: e, role: 'recruiter', status: 'Active' }));
      const merged = [...list, ...known.filter((k) => !list.some((l) => String(l.email || '').toLowerCase() === k.email.toLowerCase()))];
      setRecruiters(merged);
      setLoading(false);
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const workload = (em: string) => rows.filter((r: any) => String(r?.recruiter || '').toLowerCase() === em.toLowerCase() && !['Filled', 'Cancelled'].includes(r?.status)).length;
  const shown = recruiters.filter((u) => {
    const s = q.trim().toLowerCase();
    return !s || `${u.name || ''} ${u.email || ''} ${u.role || ''}`.toLowerCase().includes(s);
  });

  const run = async (value: string) => {
    setBusy(true); setError('');
    try {
      const updated: any[] = [];
      for (const r of targets) {
        const res = await requisitionsApi.assign(r.id, { recruiter: value });
        const row = unwrapObj(res);
        updated.push(row?.id ? row : { ...r, recruiter: value });
      }
      onDone?.(updated);
      onClose();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  const assign = () => {
    const v = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { setError('Enter a valid recruiter email, or pick one from the list.'); return; }
    void run(v);
  };

  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose}
      title={`Assign recruiter — ${targets.length} requirement(s)`}
      subtitle="Workload shows open requirements this person already owns">
      <div className="space-y-3">
        <div className="relative">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter recruiters by name, email or role…"
            aria-label="Filter recruiters"
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500" />
          <span aria-hidden="true" className="absolute left-2.5 top-2 text-slate-400 text-xs">⌕</span>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1.5" data-lenis-prevent>
          {loading && <InlineLoading message="Loading recruiters…" />}
          {!loading && shown.length === 0 && (
            <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-[11px] font-semibold text-slate-500">
              No active recruiters found in your organization yet — type an email below to assign.
            </div>
          )}
          {shown.map((u) => {
            const picked = email.trim().toLowerCase() === String(u.email || '').toLowerCase();
            const load = workload(String(u.email || ''));
            return (
              <button key={String(u.id)} type="button" onClick={() => setEmail(String(u.email || ''))}
                className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition ${picked ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-200' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                <span className="min-w-0">
                  <span className="block font-extrabold text-slate-900 truncate">{u.name || u.email}</span>
                  <span className="block text-[11px] font-medium text-slate-500 truncate">{u.email} • {String(u.role || '').replace(/_/g, ' ')}</span>
                </span>
                <span className={`shrink-0 px-2 py-0.5 rounded-full border font-bold text-[10px] ${load > 5 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {load} open
                </span>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1" htmlFor="assign-recruiter-email">Recruiter email</label>
          <input id="assign-recruiter-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="recruiter@company.com" list="assign-recruiter-emails"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500" />
          <datalist id="assign-recruiter-emails">
            {shown.map((u) => <option key={String(u.email)} value={String(u.email || '')} />)}
          </datalist>
          <p className="text-[10px] font-medium text-slate-400 mt-1">Lead recruiter for {targets.length === 1 ? 'this requirement' : `these ${targets.length} requirements`} — history keeps the previous owner.</p>
        </div>

        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold" role="alert">{error}</div>}

        <div className="flex flex-wrap justify-between gap-2 pt-1 border-t border-slate-100">
          <button type="button" disabled={busy} onClick={() => run('')}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs disabled:opacity-50">
            Clear assignment
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !email.trim()} onClick={assign} className={btnPrimary}>
              {busy ? 'Assigning…' : 'Assign'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function RequisitionsPanel() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);
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
  // P2-8: fail-closed while permissions load.
  const can = (p: string) => !!perms && perms.includes(p);
  const guard = (r: any, action: string) => checkRecordAction('requirement', r, action, { privileged, can });
  const [pipelineFor, setPipelineFor] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [decideFor, setDecideFor] = useState<{ row: any; action: 'approve' | 'reject' | 'changes' } | null>(null);
  const [assignFor, setAssignFor] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, any[] | null>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
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
  // Filter/search changes restart at page 1 (page turns re-run load via the effect below).
  useEffect(() => { if (page !== 1) { setPage(1); return; } load(1); }, [statusF, orgF, dq]);
  const firstReqRun = useRef(false);
  useEffect(() => { if (!firstReqRun.current) { firstReqRun.current = true; return; } load(page); }, [page]);
  useEffect(() => { try { localStorage.setItem(REQ_COLS_KEY, JSON.stringify(visibleCols)); } catch { /* noop */ } }, [visibleCols]);

  const refreshRow = (updated: any) => {
    setRows((r) => r.map((x) => (x.id === updated.id ? updated : x)));
    setPipelineFor((d: any) => (d && d.id === updated.id ? updated : d));
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
  const openAssign = (targets: any[]) => {
    const list = (targets || []).filter((t) => t?.id);
    if (list.length === 0) { setError('Select at least one requirement to assign a recruiter.'); return; }
    setAssignFor(list);
  };
  const onAssignDone = (updated: any[]) => {
    updated.forEach(refreshRow);
    setAssignFor([]);
    setOk(`Recruiter assigned to ${updated.length} requirement(s).`);
    syncAll();
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
      case 'req': return (
        <button type="button" onClick={() => setPipelineFor(r)} className="text-left group" title="Open requirement pipeline">
          <div className="font-bold text-slate-900 group-hover:text-blue-700 leading-4">{r.title}</div>
          <div className="font-mono text-[10px] text-slate-500 mt-0.5">{r.id}</div>
        </button>
      );
      case 'company': return <span className="font-mono font-bold text-amber-700">{r.orgId}</span>;
      case 'location': return r.location || r.city || '—';
      case 'openings': return <span className="font-bold">{r.openings || 1} <span className="text-slate-400 font-medium">({f.openingsFilled} filled)</span></span>;
      case 'status': return <span className={tonePill(r.status)}>{r.status}</span>;
      case 'pipeline': {
        const max = Math.max(1, f.applied);
        const step = (n: number, label: string, bg: string) => (
          <span key={label} className="flex-1 min-w-[26px]" title={`${label}: ${n}`}>
            <span className="block font-bold text-slate-800 text-[11px] leading-3">{n}</span>
            <span className="block h-1 rounded-full mt-0.5" style={{ width: `${Math.max(12, (n / max) * 100)}%`, backgroundColor: bg }} />
          </span>
        );
        return (
          <span className="inline-flex flex-col gap-1" title={`Applied ${f.applied} → Screening ${f.screening} → Interview ${f.interview} → Offer ${f.offer} → Hired ${f.hired}`}>
            <span className="flex items-end gap-1.5">
              {step(f.applied, 'Applied', '#0B5FD9')}{step(f.interview, 'Interview', '#F59E0B')}{step(f.hired, 'Hired', '#10B981')}
            </span>
            <span className="text-[10px] font-bold text-slate-500">{f.applications} apps → {f.hired} hired</span>
          </span>
        );
      }
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
  const pageStats = (() => {
    const open = rows.filter((r) => !['Filled', 'Cancelled'].includes(r.status)).length;
    const pending = rows.filter((r) => r.status === 'Pending Approval').length;
    const sourcing = rows.filter((r) => r.status === 'Sourcing').length;
    const filled = rows.filter((r) => r.status === 'Filled').length;
    const openings = rows.reduce((s, r) => s + (Number(r.openings) || 1), 0);
    const apps = rows.reduce((s, r) => s + (funnel(r).applications || 0), 0);
    return { open, pending, sourcing, filled, openings, apps };
  })();
  const chip = (label: string, value: string | number, cls = 'bg-white border-slate-200 text-slate-700') => (
    <span className={`inline-flex items-baseline gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${cls}`}>
      <span className="font-extrabold text-[12px]">{value}</span> {label}
    </span>
  );

  return (
    <div className={cardCls}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-extrabold text-slate-900">Requirements — internal hiring demand</h3>
          <p className="text-xs text-slate-500 font-medium">One requirement → many job postings. Candidates never see this screen; only Published, unexpired jobs leave the building.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5" aria-label="This page summary">
          {chip('total', total, 'bg-slate-50 border-slate-200 text-slate-700')}
          {chip('open', pageStats.open, 'bg-white border-emerald-200 text-emerald-700')}
          {chip('pending', pageStats.pending, 'bg-white border-amber-200 text-amber-800')}
          {chip('sourcing', pageStats.sourcing, 'bg-white border-blue-200 text-blue-700')}
          {chip('filled', pageStats.filled, 'bg-white border-slate-200 text-slate-600')}
          {chip('openings', pageStats.openings)}
          {chip('apps', pageStats.apps)}
        </div>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page)} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold" role="status">{ok}</div>}
      <div className="flex flex-col lg:flex-row gap-2 items-stretch">
        <div className="relative flex-1 min-w-[220px]"><SearchSuggest value={q} onChange={setQ} placeholder="Search ID, title, department, manager…"
    items={rows.map((r: any) => ({ key: String(r.id), query: String(r.id), title: String(r.title || r.id), meta: [r.id, r.department, r.location].filter(Boolean).join(' • '), status: r.status }))}
    onPick={(it) => { setQ(it.query ?? it.key); setPage(1); }} /></div>
        <div className="flex flex-wrap gap-2">
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
                    <input type="checkbox" checked={visibleCols.includes(c.key)} onChange={() => setVisibleCols((v) => v.includes(c.key) ? v.filter((k) => k !== c.key) : [...v, c.key])} className="w-3.5 h-3.5 accent-[#0B5FD9]" />
                    {c.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <ExportButton filename="requirements.csv" rows={rows} columns={['id', 'title', 'orgId', 'department', 'location', 'branch', 'hiringManager', 'recruiter', 'employmentType', 'experienceMin', 'experienceMax', 'openings', 'status', 'createdAt']} />
          <button type="button" onClick={() => navigate(`${portalBase()}/requisitions/new`)} className={btnPrimary}>+ New requirement</button>
        </div>
      </div>
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold" role="toolbar" aria-label="Bulk actions">
          <span className="text-blue-900">{selected.size} selected</span>
          <button type="button" disabled={busy} onClick={doBulkApprove} className="px-3 py-1.5 rounded-lg bg-[#0B5FD9] text-white disabled:opacity-50">Approve eligible</button>
          <button type="button" onClick={() => openAssign(rows.filter((r) => selected.has(r.id)))} className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-800">Assign recruiter…</button>
          <ExportButton filename="requirements-selected.csv" rows={rows.filter((r) => selected.has(r.id))} columns={['id', 'title', 'orgId', 'openings', 'status']} label="Export selected" />
          <button type="button" onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg text-slate-500">Clear</button>
        </div>
      )}
      {loading ? <InlineLoading message="Loading requirements…" /> : rows.length === 0 ? (
        <EmptyState title={dq.trim() ? 'No matching requirements' : 'No requirements'}
          message={dq.trim() ? `Nothing on this page matches “${dq.trim()}” — try a shorter term, a REQ id, or clear the status/company filters.` : 'Create the first hiring requirement to start the approval flow.'} />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {rows.map((r) => {
            const f = funnel(r);
            return (
            <div key={r.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <button type="button" onClick={() => setPipelineFor(r)} className="min-w-0 text-left">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{r.title}</div>
                  <div className="font-mono text-[10px] text-slate-500">{r.id} • {r.openings || 1} opening(s) • {f.openingsFilled} filled</div>
                </button>
                {reqMenuFor(r)}
              </div>
              <div><span className={tonePill(r.status)}>{r.status}</span></div>
              <div className="font-bold text-slate-700">{f.applications} apps → {f.hired} hired</div>
              <div className="text-slate-600 font-medium">{r.department || '—'} • {r.location || '—'}</div>
              <div className="text-slate-500 font-medium">{r.recruiter ? `Recruiter: ${r.recruiter}` : 'Recruiter: Unassigned'}</div>
            </div>
            );
          })}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[980px]">
            <thead className="bg-slate-50/80 backdrop-blur sticky top-0 z-10">
              <tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="px-2 py-2.5 w-8"><input type="checkbox" aria-label="Select page" checked={rows.length > 0 && rows.every((r) => selected.has(r.id))} onChange={toggleSelectPage} className="w-3.5 h-3.5 accent-[#0B5FD9]" /></th>
              <th className="px-2 py-2.5 w-8" aria-label="Expand" />
              {cols.map((c) => <th key={c.key} className="px-3 py-2.5">{c.label}</th>)}
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <Fragment key={r.id}>
                <tr className="hover:bg-slate-50/70 align-top">
                  <td className="px-2 py-2.5"><input type="checkbox" aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="w-3.5 h-3.5 accent-[#0B5FD9]" /></td>
                  <td className="px-2 py-2.5">
                    <button type="button" onClick={() => toggleExpand(r)} aria-expanded={expanded[r.id] !== undefined} aria-label={expanded[r.id] !== undefined ? 'Collapse linked jobs' : 'Expand linked jobs'} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 font-bold">
                      {expanded[r.id] !== undefined ? '▾' : '▸'}
                    </button>
                  </td>
                  {cols.map((c) => <td key={c.key} className="px-3 py-2.5">{cellFor(r, c.key)}</td>)}
                  <td className="px-3 py-2.5"><div className="flex justify-end">{reqMenuFor(r)}</div></td>
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
          <div className="sm:col-span-2"><Field label="Required skills"><SkillPicker value={editing?.requiredSkills || ''} onChange={(v) => setEditing({ ...editing, requiredSkills: v })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Preferred skills"><SkillPicker value={editing?.preferredSkills || ''} onChange={(v) => setEditing({ ...editing, preferredSkills: v })} /></Field></div>
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
      <AssignRecruiterModal open={assignFor.length > 0} targets={assignFor} rows={rows}
        onClose={() => setAssignFor([])} onDone={onAssignDone} />
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

/* ---------------- Full-page creators (portal layout: sidebar + header come from PortalShell) ---------------- */
const REQ_EMPTY = { orgId: '', title: '', department: '', category: '', location: '', branch: '', openings: 1, employmentType: 'Full-time', priority: 'Medium', description: '', responsibilities: '', requiredSkills: '', preferredSkills: '', qualifications: '', budgetMin: '', budgetMax: '', currency: 'INR', payPeriod: 'annual', benefits: '', recruiter: '', experienceMin: '', experienceMax: '', deadline: '' };

export function RequirementCreatePage({ base }: { base: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialOrgId = new URLSearchParams(location.search).get('orgId') || '';
  const [form, setForm] = useState({ ...REQ_EMPTY, orgId: initialOrgId });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [orgs, setOrgs] = useState<any[]>([]);
  const isPlatform = ['superadmin', 'platform_owner', 'operations_admin', 'employee'].includes(getActiveRole() || '');
  useEffect(() => {
    if (!isPlatform) return;
    (async () => { try { setOrgs(unwrapList(await directoryApi.tenants())); } catch { setOrgs([]); } })();
  }, [isPlatform]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.title.trim()) { setError('Title is required.'); return; }
    setBusy(true); setError('');
    try {
      await requisitionsApi.create({
        ...form, orgId: form.orgId || undefined, openings: Number(form.openings) || 1,
        experienceMin: form.experienceMin === '' ? undefined : Number(form.experienceMin),
        experienceMax: form.experienceMax === '' ? undefined : Number(form.experienceMax),
        budgetMin: form.budgetMin === '' ? undefined : Number(form.budgetMin),
        budgetMax: form.budgetMax === '' ? undefined : Number(form.budgetMax),
        deadline: form.deadline || undefined,
        recruiter: form.recruiter.trim() || undefined, branch: form.branch.trim() || undefined,
      });
      syncAll(); navigate(`${base}/requisitions`);
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">New job requirement</h3>
          <p className="text-xs text-slate-500 font-medium">Created as Draft — submit for approval from the requirements table.</p>
        </div>
        <button type="button" onClick={() => navigate(`${base}/requisitions`)} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">← Back to requirements</button>
      </div>
      {error && <PanelError message={error} onRetry={() => setError('')} />}
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isPlatform && orgs.length > 0 && (
            <div className="sm:col-span-2">
              <Field label="Company (target tenant) *"><Select value={form.orgId || ''} onChange={(v) => setForm({ ...form, orgId: v })} placeholder="Choose company"
                options={orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id} (${o.id})` }))} /></Field>
            </div>
          )}
          <div className="sm:col-span-2"><Field label="Title *"><input className={kitInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior React Engineer" /></Field></div>
          <Field label="Department"><input className={kitInput} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Field>
          <Field label="Category"><input className={kitInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
          <Field label="Location"><input className={kitInput} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Branch"><input className={kitInput} value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} /></Field>
          <Field label="Openings"><input className={kitInput} type="number" min={1} value={form.openings} onChange={(e) => setForm({ ...form, openings: Number(e.target.value) })} /></Field>
          <Field label="Employment type"><Select value={form.employmentType} onChange={(v) => setForm({ ...form, employmentType: v })} options={['Full-time', 'Part-time', 'Contract', 'Internship'].map((v) => ({ value: v, label: v }))} /></Field>
          <Field label="Priority"><Select value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={['Low', 'Medium', 'High', 'Urgent'].map((v) => ({ value: v, label: v }))} /></Field>
          <Field label="Min experience"><input className={kitInput} type="number" min={0} value={form.experienceMin} onChange={(e) => setForm({ ...form, experienceMin: e.target.value })} /></Field>
          <Field label="Max experience"><input className={kitInput} type="number" min={0} value={form.experienceMax} onChange={(e) => setForm({ ...form, experienceMax: e.target.value })} /></Field>
          <Field label="Min budget / CTC"><input className={kitInput} type="number" min={0} value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} /></Field>
          <Field label="Max budget / CTC"><input className={kitInput} type="number" min={0} value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} /></Field>
          <Field label="Currency"><Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={['INR', 'USD', 'EUR', 'GBP', 'AED'].map((c) => ({ value: c, label: c }))} /></Field>
          <Field label="Pay period"><Select value={form.payPeriod} onChange={(v) => setForm({ ...form, payPeriod: v })} options={[{ value: 'annual', label: 'Annual' }, { value: 'monthly', label: 'Monthly' }, { value: 'hourly', label: 'Hourly' }]} /></Field>
          <Field label="Deadline"><DatePicker value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} ariaLabel="Target deadline" /></Field>
          <Field label="Recruiter (email)"><input className={kitInput} value={form.recruiter} onChange={(e) => setForm({ ...form, recruiter: e.target.value })} placeholder="recruiter@company.com" /></Field>
          <div className="sm:col-span-2"><Field label="Required skills"><SkillPicker value={form.requiredSkills} onChange={(v) => setForm({ ...form, requiredSkills: v })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Preferred skills"><SkillPicker value={form.preferredSkills} onChange={(v) => setForm({ ...form, preferredSkills: v })} /></Field></div>
        </div>
        <RichText label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <RichText label="Responsibilities" value={form.responsibilities} onChange={(v) => setForm({ ...form, responsibilities: v })} />
        <RichText label="Qualifications" value={form.qualifications} onChange={(v) => setForm({ ...form, qualifications: v })} />
        <RichText label="Benefits" value={form.benefits} onChange={(v) => setForm({ ...form, benefits: v })} />
        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
          <button type="button" onClick={() => navigate(`${base}/requisitions`)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs mt-3">Cancel</button>
          <button disabled={busy || !form.title.trim()} className={`${btnPrimary} mt-3`}>{busy ? 'Creating…' : 'Create requirement'}</button>
        </div>
      </form>
    </div>
  );
}

export function JobCreatePage({ base }: { base: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialOrgId = new URLSearchParams(location.search).get('orgId') || '';
  const [form, setForm] = useState({ orgId: initialOrgId, title: '', requisitionId: '', location: '', employmentType: 'Full-time', salaryMin: '', salaryMax: '', expiryDate: '', visibility: 'public', description: '' });
  const [reqs, setReqs] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const isPlatform = ['superadmin', 'platform_owner', 'operations_admin', 'employee'].includes(getActiveRole() || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    (async () => {
      try { setReqs(unwrapList(await requisitionsApi.list('?page=1&pageSize=100'))); } catch { setReqs([]); }
      if (isPlatform) { try { setOrgs(unwrapList(await directoryApi.tenants())); } catch { setOrgs([]); } }
    })();
  }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.title.trim()) { setError('Title is required.'); return; }
    setBusy(true); setError('');
    try {
      await jobsApi.create({
        title: form.title.trim(), orgId: form.orgId.trim() || undefined, requisitionId: form.requisitionId.trim() || undefined,
        location: form.location.trim() || undefined, employmentType: form.employmentType,
        salaryMin: form.salaryMin === '' ? undefined : Number(form.salaryMin),
        salaryMax: form.salaryMax === '' ? undefined : Number(form.salaryMax),
        expiryDate: form.expiryDate || undefined, visibility: form.visibility, description: form.description || undefined,
      });
      syncAll(); navigate(`${base}/jobs`);
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">New job posting</h3>
          <p className="text-xs text-slate-500 font-medium">Created as Draft — publish it from the job board when ready.</p>
        </div>
        <button type="button" onClick={() => navigate(`${base}/jobs`)} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">← Back to jobs</button>
      </div>
      {error && <PanelError message={error} onRetry={() => setError('')} />}
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Title *"><input className={kitInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior React Engineer" /></Field></div>
          {isPlatform && orgs.length > 0 ? (
            <Field label="Company (target tenant)"><Select value={form.orgId} onChange={(v) => setForm({ ...form, orgId: v })} placeholder="Choose company (blank = own org)"
              options={[{ value: '', label: 'Own organization' }, ...orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id} (${o.id})` }))]} /></Field>
          ) : (
            <Field label="Organization ID"><input className={kitInput} value={form.orgId} onChange={(e) => setForm({ ...form, orgId: e.target.value })} placeholder="Blank = own org" /></Field>
          )}
          <Field label="Requirement"><Select value={form.requisitionId} onChange={(v) => setForm({ ...form, requisitionId: v })} placeholder="Link a requirement (optional)" options={[{ value: '', label: 'No link' }, ...reqs.map((r: any) => ({ value: r.id, label: `${r.id} — ${r.title}` }))]} /></Field>
          <Field label="Location"><input className={kitInput} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Employment type"><Select value={form.employmentType} onChange={(v) => setForm({ ...form, employmentType: v })} options={['Full-time', 'Part-time', 'Contract', 'Internship'].map((v) => ({ value: v, label: v }))} /></Field>
          <Field label="Salary min"><input className={kitInput} type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} /></Field>
          <Field label="Salary max"><input className={kitInput} type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} /></Field>
          <Field label="Expiry date"><DatePicker value={form.expiryDate} onChange={(v) => setForm({ ...form, expiryDate: v })} ariaLabel="Expiry date" /></Field>
          <Field label="Visibility"><Select value={form.visibility} onChange={(v) => setForm({ ...form, visibility: v })} options={['public', 'private', 'assigned'].map((v) => ({ value: v, label: v }))} /></Field>
        </div>
        <RichText label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} minHeight={160} />
        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
          <button type="button" onClick={() => navigate(`${base}/jobs`)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs mt-3">Cancel</button>
          <button disabled={busy || !form.title.trim()} className={`${btnPrimary} mt-3`}>{busy ? 'Creating…' : 'Create job'}</button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Requirement pipeline drawer ---------------- */
const FUNNEL_STEPS = ['applied', 'screening', 'interview', 'offer', 'hired'] as const;
const FUNNEL_LABELS: Record<string, string> = { applied: 'Applied', screening: 'Screening', interview: 'Interview', offer: 'Offer', hired: 'Hired' };

/** Shared detail-drawer primitives — one tab look, status-differentiated pills everywhere. */
const TONE_OK = new Set(['Active', 'Approved', 'Published', 'Filled', 'Hired', 'Completed', 'Selected', 'Shortlisted', 'Signed', 'Accepted', 'Joined', 'Confirmed', 'Issued', 'Paid']);
const TONE_INFO = new Set(['Pending Approval', 'Pending Review', 'Sourcing', 'Scheduled', 'Rescheduled', 'Under Review', 'Screening', 'Applied', 'Interview', 'Offer', 'In Progress', 'Open']);
const TONE_WARN = new Set(['Draft', 'Paused', 'On Hold', 'No-show', 'Partially Paid', 'Invited']);
const TONE_BAD = new Set(['Cancelled', 'Closed', 'Archived', 'Rejected', 'Withdrawn', 'Declined', 'Failed', 'Expired']);
export function tonePill(status: unknown): string {
  const s = String(status ?? '—');
  const base = 'inline-block px-2 py-0.5 rounded-full border font-bold text-[11px] whitespace-nowrap';
  if (TONE_OK.has(s)) return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
  if (TONE_INFO.has(s)) return `${base} bg-blue-50 text-blue-700 border-blue-200`;
  if (TONE_WARN.has(s)) return `${base} bg-amber-50 text-amber-800 border-amber-200`;
  if (TONE_BAD.has(s)) return `${base} bg-slate-100 text-slate-500 border-slate-200`;
  return `${base} bg-slate-100 text-slate-600 border-slate-200`;
}
export function DetailTabs({ tabs, active, onPick }: { tabs: { key: string; label: string; count?: number }[]; active: string; onPick: (k: string) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Detail sections">
      {tabs.map((t) => (
        <button key={t.key} role="tab" aria-selected={t.key === active} type="button" onClick={() => onPick(t.key)}
          className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap border ${t.key === active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
          {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
        </button>
      ))}
    </div>
  );
}
export function DetailSection({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <header className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">{title}{count !== undefined ? ` (${count})` : ''}</h4>
      </header>
      <div className="p-3.5 space-y-2">{children}</div>
    </section>
  );
}

export function RequirementPipeline({ reqId, onClose, onDecide, onEdit, onAssign, onDelete }: {
  reqId: string; onClose: () => void;
  onDecide: (row: any, action: 'approve' | 'reject' | 'changes') => void;
  onEdit: (row: any) => void; onAssign: (rows: any[]) => void; onDelete: (row: any) => void;
}) {
  const [data, setData] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const gApprove = useActionGuard('requirement', data, 'approve');
  const gEdit = useActionGuard('requirement', data, 'edit');
  const gDelete = useActionGuard('requirement', data, 'delete');
  const gAssign = useActionGuard('requirement', data, 'assign');
  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true); setError('');
      try {
        // Single-record fetch (§Phase 2) + the tenant audit trail for this requirement.
        const [rRes, iRes, aRes] = await Promise.all([
          requisitionsApi.get(reqId),
          interviewsApi.list(`?requisitionId=${reqId}`),
          directoryApi.auditLogs(`?recordId=${encodeURIComponent(reqId)}&page=1&pageSize=50`).catch(() => null),
        ]);
        if (!live) return;
        const row = unwrapObj(rRes);
        if (!row?.id) throw new Error('Requirement no longer exists.');
        setData(row);
        setInterviews(unwrapList(iRes).filter((i: any) => ['Scheduled', 'Rescheduled'].includes(i.status)).slice(0, 10));
        setLogs(aRes ? unwrapList(aRes) : []);
      } catch (e) { if (live) setError(errMsg(e)); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, [reqId]);
  const f = data?.rollup || { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0, applications: 0, interviews: 0, openingsFilled: 0, ageingDays: 0, linkedJobs: [] };
  const max = Math.max(1, f.applied);
  const lockNotes = [
    !gApprove.allowed && gApprove.reason,
    !gEdit.allowed && gEdit.reason,
    !gDelete.allowed && gDelete.reason,
  ].filter(Boolean) as string[];
  const activity = useMemo(() => {
    const items: ActivityItem[] = [];
    (data?.history || []).forEach((h: any) => items.push({ at: h.at, title: `${h.from || '—'} → ${h.to}`, meta: h.reason ? `${h.by || '—'} • ${h.reason}` : (h.by || '—'), tone: h.to === 'Cancelled' ? 'bad' : h.to === 'Approved' ? 'ok' : 'info' }));
    (data?.changeRequests || []).forEach((c: any) => items.push({ at: c.at, title: 'Changes requested', meta: `${c.by} • ${c.note}`, tone: 'warn' }));
    (data?.assignmentHistory || []).forEach((a: any) => items.push({ at: a.at, title: a.from ? 'Recruiter reassigned' : 'Recruiter assigned', meta: `${a.from || '—'} → ${a.to || '—'} by ${a.by || '—'}`, tone: 'info' }));
    // Audit rows the history above does not already cover (edits, deletes, exports…).
    logs.filter((l: any) => !/(_STATUS:|_CREATED:|_ASSIGNED:|CHANGES_REQUESTED)/.test(String(l.action)))
      .forEach((l: any) => items.push({ at: l.timestamp, title: auditLabel(String(l.action)), meta: l.actor, tone: 'neutral' }));
    if (data?.createdAt) items.push({ at: data.createdAt, title: 'Requirement created', meta: data.createdBy || '—', tone: 'info' });
    return sortActivity(items);
  }, [data, logs]);
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className={tonePill(data?.status)}>{data?.status || '—'}</span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">{reqId}</span>
            <span className="text-[11px] font-bold text-slate-500">{f.openingsFilled}/{data?.openings || 1} filled • {f.applications} apps → {f.hired} hired</span>
          </div>
          <DetailTabs tabs={[{ key: 'overview', label: 'Overview' }, { key: 'interviews', label: 'Interviews', count: interviews.length }, { key: 'activity', label: 'Activity', count: activity.length }]} active={tab} onPick={setTab} />
          {tab === 'overview' && (
            <div className="space-y-3">
              <DetailSection title="Ownership">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[['Owner', data?.hiringManager || '—'], ['Recruiter', data?.recruiter || 'Unassigned'], ['Deadline', String(data?.deadline || '').slice(0, 10) || '—']].map(([k, v]) => (
                    <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 truncate">{String(v ?? '—')}</div></div>
                  ))}
                </div>
              </DetailSection>
              <DetailSection title="Role profile">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[['Department / Category', [data?.department, data?.category].filter(Boolean).join(' • ') || '—'], ['Location / Branch', [data?.location, data?.branch].filter(Boolean).join(' • ') || '—'], ['Employment', data?.employmentType || '—'], ['Experience', (data?.experienceMin !== undefined || data?.experienceMax !== undefined) ? `${data?.experienceMin ?? '—'}–${data?.experienceMax ?? '—'} yrs` : '—'], ['Budget', (data?.budgetMin || data?.budgetMax) ? `${data?.currency || 'INR'} ${data?.budgetMin ?? '—'}–${data?.budgetMax ?? '—'} ${data?.payPeriod || ''}` : '—'], ['Priority', data?.priority || '—']].map(([k, v]) => (
                    <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1">{String(v ?? '—')}</div></div>
                  ))}
                  {[['Description', data?.description], ['Responsibilities', data?.responsibilities], ['Required skills', data?.requiredSkills], ['Preferred skills', data?.preferredSkills], ['Qualifications', data?.qualifications], ['Benefits', data?.benefits]].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k as string} className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-medium mt-1 whitespace-pre-wrap">{String(v)}</div></div>
                  ))}
                </div>
              </DetailSection>
              <DetailSection title="Hiring funnel — live counts">
                <div className="flex items-stretch gap-1" role="img" aria-label={`Funnel: ${FUNNEL_STEPS.map((s) => `${FUNNEL_LABELS[s]} ${f[s]}`).join(', ')}`}>
                  {FUNNEL_STEPS.map((s) => (
                    <div key={s} className="flex-1 min-w-0">
                      <div className="text-center font-extrabold text-sm">{f[s]}</div>
                      <div className={`h-2 rounded-full ${f[s] > 0 ? 'bg-[#0B5FD9]' : 'bg-slate-200'}`} style={{ opacity: 0.45 + (0.55 * f[s]) / max }} />
                      <div className="text-center text-[10px] font-bold text-slate-500 mt-1 truncate">{FUNNEL_LABELS[s]}</div>
                    </div>
                  ))}
                </div>
              </DetailSection>
              <DetailSection title="Linked jobs" count={(f.linkedJobs || []).length}>
                {(f.linkedJobs || []).length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No postings yet — publish a job under this requirement to start sourcing.</div> : (
                  <DrawerList items={f.linkedJobs || []} empty="" render={(j: any) => (
                    <DrawerCard key={j.id} status={j.status} title={j.title}
                      meta={<><span className="font-mono">{j.id}</span> • {j.counts.applications} apps → {j.counts.hired} hired</>}
                      right={<span className={tonePill(j.status)}>{j.status}</span>} />
                  )} />
                )}
              </DetailSection>
            </div>
          )}
          {tab === 'interviews' && (
            <DetailSection title="Upcoming interviews" count={interviews.length}>
              {interviews.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">None scheduled — schedule rounds from shortlisted applications.</div> : (
                <DrawerList items={interviews} empty="" render={(iv: any) => (
                  <DrawerCard key={iv.id} status={iv.status} title={`${iv.round || 'Interview'} — ${iv.candidateName || iv.candidateEmail || ''}`}
                    meta={<><span className="font-mono">{String(iv.scheduledAt || '').slice(0, 16).replace('T', ' ')}</span>{iv.mode ? ` • ${iv.mode}` : ''}{iv.interviewer ? ` • ${iv.interviewer}` : ''}</>}
                    right={<span className={tonePill(iv.status)}>{iv.status}</span>} />
                )} />
              )}
            </DetailSection>
          )}
          {tab === 'activity' && (
            <DetailSection title="Activity — history, assignments & audit" count={activity.length}>
              <ActivityTimeline items={activity} empty="No transitions recorded yet — approve, assign or rework to start the trail." />
            </DetailSection>
          )}
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
  const [view, setView] = useQueryState('app_view');
  const [boardRows, setBoardRows] = useState<any[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [suggestRows, setSuggestRows] = useState<any[]>([]);
  const pageSize = 10;

  /** Server-side search (§recruitment.ts q) — matches any field of the application row. */
  const buildParams = (p: number, f: string, term: string) => {
    const sp = new URLSearchParams({ page: String(p), pageSize: String(pageSize) });
    if (f) sp.set('status', f);
    if (term.trim()) sp.set('q', term.trim());
    return sp.toString();
  };
  const load = async (p = page, f = appliedFilter, term = q) => {
    setLoading(true); setError(''); setLoadError(0);
    try {
      const res: any = await applicationsApi.list(`?${buildParams(p, f, term)}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  // Search/filter changes restart at page 1; page turns reuse the same term. Debounced so typing stays cheap.
  useEffect(() => { if (page !== 1) { setPage(1); return; } load(1, appliedFilter, dqApp); }, [dqApp, appliedFilter]);
  const firstPageRun = useRef(false);
  useEffect(() => { if (!firstPageRun.current) { firstPageRun.current = true; return; } load(page, appliedFilter, dqApp); }, [page]);
  useEffect(() => {
    if ((view || 'list') !== 'board') return;
    (async () => {
      setBoardLoading(true);
      try {
        const res: any = await applicationsApi.list(`?${buildParams(1, appliedFilter, q)}`);
        setBoardRows(unwrapList(res));
      } catch (e) { setError(errMsg(e)); }
      finally { setBoardLoading(false); }
    })();
  }, [view, appliedFilter, dqApp]);
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setSuggestRows([]); return; }
    const t = setTimeout(() => {
      applicationsApi.list(`?${buildParams(1, appliedFilter, term)}`)
        .then((res: any) => setSuggestRows(unwrapList(res)))
        .catch(() => setSuggestRows([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q, appliedFilter]);

  const patchBoth = (id: string, updated: any) => {
    if (!updated?.id) return;
    setRows((r) => r.map((x) => (x.id === id ? updated : x)));
    setBoardRows((r) => r.map((x) => (x.id === id ? updated : x)));
  };
  const move = async (id: string, stage: string, reasonOverride?: string) => {
    try {
      const updated = unwrapObj(await applicationsApi.setStage(id, stage, reasonOverride ?? reason ?? undefined));
      patchBoth(id, updated);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const withdraw = async (id: string, reasonText?: string) => {
    try {
      const updated = unwrapObj(await applicationsApi.withdraw(id, reasonText || reason || undefined));
      patchBoth(id, updated);
      if (detail?.id === id && updated?.id) setDetail(updated);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const [moveFor, setMoveFor] = useState<{ app: any; to: string } | null>(null);
  const emptyOfferForm = { basic: '', hra: '', special: '', variable: '', pf: '', gratuity: '', joinDate: '' };
  const [offerForm, setOfferForm] = useState({ ...emptyOfferForm });
  const [offerOpen, setOfferOpen] = useState(false);
  const offerTotal = (f: typeof emptyOfferForm) => ['basic', 'hra', 'special', 'variable', 'pf', 'gratuity'].reduce((s, k) => s + (Number((f as any)[k]) || 0), 0);
  const [joinForm, setJoinForm] = useState({ joinDate: '', feeBasis: '' });
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinMatch, setJoinMatch] = useState<any>(null);
  const [joinBusy, setJoinBusy] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const doOffer = async () => {
    if (!detail) return;
    const ctc = offerTotal(offerForm);
    if (!(ctc > 0)) { setError('Enter a salary breakdown — Total CTC must be greater than zero.'); return; }
    const created = unwrapObj(await offersPlacementsApi.offer({ applicationId: detail.id, ctc, joinDate: offerForm.joinDate || undefined }));
    if (created?.id) {
      const next = { ...detail, stage: 'Offer', offerCtc: ctc, ctc, joinDate: offerForm.joinDate || detail.joinDate, offerStatus: 'Issued' };
      patchBoth(detail.id, next); setDetail(next);
    }
    setOfferOpen(false); setOfferForm({ ...emptyOfferForm }); syncAll();
  };
  const checkJoinFee = async () => {
    if (!detail) return;
    setJoinBusy(true);
    try {
      const m = unwrapObj(await offersPlacementsApi.matchFee(detail.id, Number(joinForm.feeBasis) || undefined));
      setJoinMatch(m);
      if (!joinForm.feeBasis && m?.preview) setJoinForm((f) => ({ ...f, feeBasis: String(m.preview.feeBasis || '') }));
    } catch (e) { setError(errMsg(e)); } finally { setJoinBusy(false); }
  };
  const doJoin = async () => {
    if (!detail) return;
    const fee = Number(joinForm.feeBasis) || 0;
    const p = unwrapObj(await offersPlacementsApi.place(detail.id, joinForm.joinDate || undefined, fee));
    if (p?.id) {
      const next = { ...detail, stage: 'Hired', feeBasis: fee, joinDate: joinForm.joinDate || detail.joinDate, offerStatus: 'Joined' };
      patchBoth(detail.id, next); setDetail(next);
    }
    setJoinOpen(false); setJoinForm({ joinDate: '', feeBasis: '' }); setJoinMatch(null); syncAll();
  };
  const dropMove = (a: any, to: string) => {
    if (to === a.stage) return;
    if (['Hired', 'Withdrawn', 'Rejected', 'Job Closed'].includes(a.stage)) { setError(`${a.stage} applications are terminal — reopen explicitly to continue.`); return; }
    // Phase 3: Offer/Hired go through their explicit in-drawer workflows (offer record + joining with agreement).
    if (to === 'Offer') { void openDetail(a); setOfferForm({ ...emptyOfferForm }); setOfferOpen(true); setJoinOpen(false); return; }
    if (to === 'Hired') { void openDetail(a); setJoinForm({ joinDate: '', feeBasis: '' }); setJoinMatch(null); setJoinOpen(true); setOfferOpen(false); return; }
    if (to === 'Withdrawn') { setWithdrawId(a.id); return; }
    setMoveFor({ app: a, to });
  };
  const reopen = async (app: any, target: string, reasonText?: string) => {
    const updated = unwrapObj(await applicationsApi.reopen(app.id, target, reasonText || ''));
    patchBoth(app.id, updated);
    if (detail?.id === app.id && updated?.id) setDetail(updated);
    const hRes: any = await apiClient.get(`/api/v1/applications/${app.id}/history`).catch(() => null);
    const h = (hRes as { data?: any[] })?.data || [];
    if (detail?.id === app.id && Array.isArray(h)) setHistory(h);
    setReopenFor(null);
    syncAll();
  };

  const filteredApps = rows.filter((a) => !dqApp.trim() || `${a.id} ${a.jobTitle} ${a.candidateEmail}`.toLowerCase().includes(dqApp.toLowerCase()));
  // Suggestions come from a debounced server search (10 rows) merged with the visible page,
  // so a pick can land on an application that is not on the current page.
  const appSuggest = (() => {
    const seen = new Set<string>();
    return [...suggestRows, ...rows]
      .filter((a: any) => {
        if (!a?.id || seen.has(a.id)) return false;
        seen.add(a.id); return true;
      })
      .slice(0, 7)
      .map((a: any) => ({
        key: String(a.id), query: String(a.id),
        title: String(a.jobTitle || a.jobId || a.id),
        meta: [a.candidateEmail, a.id].filter(Boolean).join(' • '),
        status: a.stage,
      }));
  })();
  const appMenuFor = (a: any) => {
    // Phase 3: Offer/Hired excluded from direct moves — use Issue offer / Record joining (explicit records).
    const moves = ['Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn', 'On Hold'].filter((s) => s !== a.stage).slice(0, 6);
    const canWithdraw = !['Hired', 'Withdrawn', 'Rejected'].includes(a.stage);
    return (
      <RowMenu label={`Application ${a.id}`} items={[
        { label: 'View + history', onSelect: () => openDetail(a) },
        ...(!['Hired', 'Withdrawn', 'Rejected', 'Offer'].includes(a.stage) ? [{ label: 'Issue offer…', onSelect: () => { void openDetail(a); setOfferForm({ ...emptyOfferForm }); setOfferOpen(true); setJoinOpen(false); } }] : []),
        ...(!['Hired', 'Withdrawn', 'Rejected'].includes(a.stage) ? [{ label: 'Record joining…', onSelect: () => { void openDetail(a); setJoinForm({ joinDate: '', feeBasis: '' }); setJoinMatch(null); setJoinOpen(true); setOfferOpen(false); } }] : []),
        ...moves.map((s) => ({ label: `Move to ${s}…`, onSelect: () => { if (['Hired', 'Withdrawn', 'Rejected', 'Job Closed'].includes(a.stage)) { setError(`${a.stage} applications are terminal — reopen explicitly to continue.`); return; } if (s === 'Withdrawn') { setWithdrawId(a.id); return; } setMoveFor({ app: a, to: s }); } })),
        ...(canWithdraw ? [{ label: 'Withdraw application', danger: true, onSelect: () => setWithdrawId(a.id) }] : []),
        ...(checkRecordAction('application', a, 'reopen', {}).allowed ? [{ label: 'Reopen…', onSelect: () => { setReopenFor(a); setReopenTarget('Applied'); } }] : []),
      ]} />
    );
  };
  const openDetail = async (a: any) => {
    setDetail(a); setHistory([]);
    setOfferOpen(false); setJoinOpen(false); setResumeOpen(false);
    try {
      const res: any = await applicationsApi.detail(a.id);
      const full = (res as { data?: any })?.data;
      if (full?.id) {
        setDetail(full);
        setHistory(Array.isArray(full.history) ? full.history : []);
        // Offers live in a separate record — pull the issued CTC so the
        // drawer shows it even after reload (best-effort, never blocks).
        if (['Offer', 'Hired'].includes(full.stage)) {
          try {
            const m: any = unwrapObj(await offersPlacementsApi.matchFee(full.id));
            const ctc = Number(m?.offer?.ctc || 0);
            if (ctc > 0) setDetail((d: any) => (d && d.id === full.id ? { ...d, offerCtc: ctc, ctc } : d));
          } catch { /* offer lookup is best-effort */ }
        }
        return;
      }
    } catch { /* fall through to history-only load */ }
    try {
      const res: any = await applicationsApi.history(a.id);
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
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5" role="tablist" aria-label="Applications view">
              {(['list', 'board'] as const).map((v) => (
                <button key={v} role="tab" aria-selected={(view || 'list') === v} type="button" onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs capitalize ${((view || 'list') === v) ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{v}</button>
              ))}
            </div>
            <div style={{ width: 170 }}>
              <Select value={filter} onChange={setFilter} ariaLabel="Filter by stage" placeholder="All stages" options={[{ value: '', label: 'All stages' }, ...APP_STAGES.map((s) => ({ value: s, label: s }))]} />
            </div>
            <button type="button" className={btnDark} onClick={() => { setPage(1); setAppliedFilter(filter); }}>Filter</button>
            <ExportButton filename="applications.csv" rows={filteredApps} columns={['id', 'jobTitle', 'jobId', 'candidateEmail', 'stage']} />
          </div>
        </div>
        <SearchSuggest value={q} onChange={setQ} placeholder="Search application ID, job title, candidate email…"
        items={appSuggest}
        onPick={(it) => { setQ(it.query ?? it.key); setPage(1); }} />
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page, appliedFilter, dqApp)} />}
      {!compact && (
        <input className={inputCls} placeholder="Reason / note for next move (required for Rejected, Withdrawn, On Hold)" value={reason} onChange={(e) => setReason(e.target.value)} />
      )}
      {(view || 'list') === 'board' ? (
        boardLoading ? <InlineLoading message="Loading board…" /> : boardRows.length === 0 ? (
          <EmptyState title="No applications" message="Applications appear here once candidates apply or agencies submit." />
        ) : <ApplicationsKanban apps={boardRows} onOpen={openDetail} onDropMove={dropMove} />
      ) : loading ? <InlineLoading message="Loading applications…" /> : filteredApps.length === 0 ? (
        <EmptyState title={dqApp.trim() ? 'No matching applications' : 'No applications'}
          message={dqApp.trim() ? `Nothing on this page matches “${dqApp.trim()}” — try a shorter term, an application ID, or clear the stage filter.` : 'Applications appear here once candidates apply or agencies submit.'} />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {filteredApps.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{a.jobTitle || a.jobId}</div>
                  <div className="font-mono text-[11px] text-slate-500">{a.id} • {a.candidateEmail}</div>
                </div>
                {appMenuFor(a)}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${APP_STAGE_TONE[a.stage] || APP_STAGE_TONE.New}`}>{a.stage}</span>
                <span className="text-slate-500 font-medium">applied {String(a.createdAt || '').slice(0, 10) || '—'}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Application</th><th className="px-4 py-3">Job</th><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold">{a.id}</td>
                  <td className="px-4 py-3"><div className="font-bold text-slate-900 truncate max-w-[220px]">{a.jobTitle || a.jobId}</div><div className="font-mono text-[11px] text-slate-500">{a.jobId}</div></td>
                  <td className="px-4 py-3">{a.candidateEmail}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${APP_STAGE_TONE[a.stage] || APP_STAGE_TONE.New}`}>{a.stage}</span></td>
                  <td className="px-4 py-3">{String(a.createdAt || '').slice(0, 10) || '—'}</td>
                  <td className="px-4 py-3"><div className="flex justify-end">{appMenuFor(a)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
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
        open={moveFor !== null}
        onCancel={() => setMoveFor(null)}
        title={`Move to ${moveFor?.to || ''} — ${moveFor?.app?.id || ''}`}
        subtitle={`${moveFor?.app?.jobTitle || ''} • ${moveFor?.app?.candidateEmail || ''} (currently ${moveFor?.app?.stage || ''})`}
        why={[`Application is currently ${moveFor?.app?.stage || ''}`, moveFor?.to === 'Hired' ? 'Hired is terminal — it triggers placement + commission evaluation' : `Moving to ${moveFor?.to || ''} advances the pipeline`]}
        steps={[`Stage moves to ${moveFor?.to || ''}`, 'Stage history entry with actor + timestamp', moveFor?.to === 'Hired' ? 'Placement + commission engine evaluates automatically' : 'Candidate notified in-app']}
        consequences={moveFor?.to === 'Rejected' ? ['Candidate leaves the active pipeline', 'Reopening later needs an explicit reason'] : []}
        requireReason={moveFor?.to === 'Rejected'}
        reasonLabel="Rejection reason *"
        confirmLabel={`Move to ${moveFor?.to || ''}`}
        tone={moveFor?.to === 'Rejected' ? 'danger' : 'dark'}
        onConfirm={async (r) => { if (moveFor) { await move(moveFor.app.id, moveFor.to, r); setMoveFor(null); } }}
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
      {detail && (
        <>
          <DetailDrawer title={detail.jobTitle || detail.jobId || detail.id} subtitle={`${detail.id} • ${detail.candidateEmail || ''}`} onClose={() => setDetail(null)} width="max-w-4xl">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${drawerTone(detail.stage).card}`}>
              <span aria-hidden="true" className="w-11 h-11 rounded-xl bg-slate-900 text-white font-extrabold text-base flex items-center justify-center shrink-0">
                {String(detail.candidateEmail || detail.jobTitle || '?').trim().charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-slate-900 text-sm truncate">{detail.jobTitle || detail.jobId}</div>
                <div className="text-[11px] text-slate-500 font-medium truncate">{detail.candidateEmail} • <span className="font-mono">{detail.id}</span></div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <StatusPill value={detail.stage} />
                  {detail.source ? <span className="px-2 py-0.5 rounded-full bg-white/70 border border-slate-200 font-bold text-[11px]">{detail.source}</span> : null}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {!['Hired', 'Withdrawn', 'Rejected', 'Offer'].includes(detail.stage) && (
                <button type="button" onClick={() => { setOfferOpen((v) => !v); setJoinOpen(false); }} className={`px-4 py-2.5 rounded-xl font-bold text-xs ${offerOpen ? 'bg-slate-900 text-white' : 'bg-[#0B5FD9] text-white'}`}>Issue offer…</button>
              )}
              {!['Hired', 'Withdrawn', 'Rejected'].includes(detail.stage) && (
                <button type="button" onClick={() => { setJoinOpen((v) => !v); setOfferOpen(false); if (!joinOpen) { setJoinForm({ joinDate: '', feeBasis: '' }); setJoinMatch(null); } }} className={`px-4 py-2.5 rounded-xl border font-bold text-xs ${joinOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>Record joining…</button>
              )}
              {checkRecordAction('application', detail, 'reopen', {}).allowed && (
                <button type="button" onClick={() => { setReopenFor(detail); setReopenTarget('Applied'); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Reopen application…</button>
              )}
            </div>
            {offerOpen && !['Hired', 'Withdrawn', 'Rejected', 'Offer'].includes(detail.stage) && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-slate-900">Issue offer — salary breakup (annual ₹)</div>
                  <button type="button" onClick={() => setOfferOpen(false)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Collapse</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([['basic', 'Basic pay'], ['hra', 'House rent allowance'], ['special', 'Special allowance'], ['variable', 'Variable pay / bonus'], ['pf', 'Employer PF contribution'], ['gratuity', 'Gratuity']] as const).map(([k, label]) => (
                    <Field key={k} label={`${label} (annual)`}>
                      <input className={kitInput} type="number" min={0} placeholder="₹ 0" value={(offerForm as any)[k]}
                        onChange={(e) => setOfferForm({ ...offerForm, [k]: e.target.value })} />
                    </Field>
                  ))}
                </div>
                <div className="px-4 py-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Total CTC (annual)</div>
                    <div className="text-lg font-extrabold text-emerald-900">₹{offerTotal(offerForm).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">≈ Monthly</div>
                    <div className="text-sm font-extrabold text-emerald-900">₹{Math.round(offerTotal(offerForm) / 12).toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <Field label="Joining date"><DatePicker value={offerForm.joinDate} onChange={(v) => setOfferForm({ ...offerForm, joinDate: v })} ariaLabel="Joining date" /></Field>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setOfferOpen(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
                  <button type="button" disabled={!(offerTotal(offerForm) > 0)} onClick={() => doOffer()} className="px-4 py-2.5 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs disabled:opacity-50">Issue offer</button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">The breakup sums to Total CTC — that total is issued as the offer CTC and becomes the default fee basis at joining. Application moves to Offer.</p>
              </div>
            )}
            {joinOpen && !['Hired', 'Withdrawn', 'Rejected'].includes(detail.stage) && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-slate-900">Record joining</div>
                  <button type="button" onClick={() => { setJoinOpen(false); setJoinMatch(null); }} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Collapse</button>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">Offer reference</div>
                  {(detail.offerCtc || detail.ctc)
                    ? <div className="font-extrabold text-slate-900 mt-0.5">Offer CTC ₹{Number(detail.offerCtc || detail.ctc).toLocaleString('en-IN')} — fee basis auto-fills from this.</div>
                    : <div className="font-bold text-slate-600 mt-0.5">No stored offer CTC on this record — enter the fee basis below or press Check fee to resolve it from the agreement.</div>}
                </div>
                <Field label="Joining date *"><DatePicker value={joinForm.joinDate} onChange={(v) => setJoinForm({ ...joinForm, joinDate: v })} ariaLabel="Joining date" /></Field>
                <div>
                  <Field label="Fee basis (annual ₹) — auto-filled from offer">
                    <input className={kitInput} type="number" min={0} placeholder="₹ 0" value={joinForm.feeBasis}
                      onChange={(e) => { setJoinForm({ ...joinForm, feeBasis: e.target.value }); setJoinMatch(null); }} />
                  </Field>
                  <button type="button" disabled={joinBusy} onClick={checkJoinFee} className={`${btnDark} mt-2`}>{joinBusy ? 'Checking…' : 'Check fee…'}</button>
                </div>
                {joinMatch?.preview && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold space-y-1">
                    <div>Agreement {joinMatch.agreement?.id} • {joinMatch.agreement?.hiringType} @ {joinMatch.agreement?.rate}%</div>
                    <div>Basis ₹{Number(joinMatch.preview.feeBasis).toLocaleString('en-IN')} → gross ₹{Number(joinMatch.preview.gross).toLocaleString('en-IN')} + GST = <strong>₹{Number(joinMatch.preview.total).toLocaleString('en-IN')}</strong></div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => { setJoinOpen(false); setJoinMatch(null); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
                  <button type="button" disabled={!joinForm.joinDate} onClick={doJoin} className="px-4 py-2.5 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs disabled:opacity-50">Record joining</button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Joining mints the placement, resolves the commission agreement and moves the application to Hired.</p>
              </div>
            )}
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Application profile</div>
              <KeyValues data={[
                ['Application', <span className="font-mono">{detail.id}</span>],
                ['Job', `${detail.jobTitle || ''} (${detail.jobId || ''})`],
                ['Candidate', detail.candidateEmail],
                ['Stage', <StatusPill value={detail.stage} />],
                ['Source', detail.source || '—'],
                ['Applied', detail.createdAt ? String(detail.createdAt).slice(0, 10) : '—'],
                ['Updated', detail.updatedAt ? String(detail.updatedAt).slice(0, 10) : '—'],
                ['Conversation', detail.conversation ? `${detail.conversation.id} • ${detail.conversation.status}` : '—'],
              ]} />
            </div>
            {(detail.offerCtc || detail.ctc || detail.feeBasis || detail.joinDate || ['Offer', 'Hired'].includes(detail.stage)) && (
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Offer & joining</div>
                <KeyValues data={(() => {
                  const ctc = Number(detail.offerCtc || detail.ctc || 0);
                  const fee = Number(detail.feeBasis || 0);
                  return [
                    ['Offer CTC', ctc > 0 ? `₹${ctc.toLocaleString('en-IN')} (≈ ₹${Math.round(ctc / 12).toLocaleString('en-IN')}/mo)` : '—'],
                    ['Joining date', detail.joinDate ? String(detail.joinDate).slice(0, 10) : '—'],
                    ['Fee basis', fee > 0 ? `₹${fee.toLocaleString('en-IN')}` : '—'],
                    ['Offer status', detail.offerStatus || (detail.stage === 'Offer' ? 'Issued' : detail.stage === 'Hired' ? 'Joined' : '—')],
                  ];
                })()} />
              </div>
            )}
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Resume</div>
              <DrawerCard
                title={detail.resumeName || 'Srikanth_M_Resume.pdf'}
                meta="PDF resume • static test file for now — switches to the candidate's resume automatically later."
                right={<StatusPill value="Available" />}>
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => setResumeOpen((v) => !v)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">{resumeOpen ? 'Hide preview' : 'View'}</button>
                  <a href={detail.resumeUrl || '/Srikanth_M_Resume.pdf'} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Open in new tab</a>
                  <a href={detail.resumeUrl || '/Srikanth_M_Resume.pdf'} download="Srikanth_M_Resume.pdf" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Download PDF</a>
                </div>
                {resumeOpen && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.22)]">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <FileText size={14} className="text-slate-300 shrink-0" />
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-500 text-white shrink-0">PDF</span>
                      <span className="text-[11px] font-bold text-slate-200 truncate flex-1 min-w-0">{detail.resumeName || 'Srikanth_M_Resume.pdf'}</span>
                      <a href={detail.resumeUrl || '/Srikanth_M_Resume.pdf'} target="_blank" rel="noreferrer" aria-label="Open resume in new tab"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"><ExternalLink size={14} /></a>
                      <a href={detail.resumeUrl || '/Srikanth_M_Resume.pdf'} download="Srikanth_M_Resume.pdf" aria-label="Download resume PDF"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"><Download size={14} /></a>
                      <button type="button" onClick={() => setResumeOpen(false)} aria-label="Hide resume preview"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"><X size={14} /></button>
                    </div>
                    <iframe src={`${detail.resumeUrl || '/Srikanth_M_Resume.pdf'}#zoom=page-width`} title={`Resume of ${detail.candidateEmail || detail.id}`} className="block w-full h-[62vh] bg-white" />
                  </div>
                )}
              </DrawerCard>
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Interviews ({(detail.interviews || []).length})</div>
              <DrawerList items={detail.interviews || []} empty="No interviews scheduled for this application yet."
                render={(iv: any) => (
                  <DrawerCard key={iv.id} status={iv.status} title={iv.round || iv.roundName || 'Interview'}
                    meta={[iv.scheduledAt ? String(iv.scheduledAt).slice(0, 16).replace('T', ' ') : '', iv.mode, iv.interviewer].filter(Boolean).join(' • ')}
                    right={<StatusPill value={iv.status} />} />
                )} />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Stage history ({history.length})</div>
              <DrawerList items={history} empty="No history rows yet."
                render={(h: any) => (
                  <DrawerCard key={h.id} status={h.to} title={`${h.from} → ${h.to}`}
                    meta={<>by {h.actor} • <span className="font-mono">{String(h.createdAt || '').slice(0, 16).replace('T', ' ')}</span>{h.reason ? ` • ${h.reason}` : ''}</>} />
                )} />
            </div>
          </DetailDrawer>
        </>
      )}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
    </div>
  );
}

/* ---------------- Applications Kanban (drop moves stage; terminal drops route to withdraw/reopen confirms) ---------------- */
const APP_STAGE_TONE: Record<string, string> = {
  New: 'bg-slate-100 text-slate-600 border-slate-200', Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-indigo-50 text-indigo-700 border-indigo-200', Screening: 'bg-purple-50 text-purple-700 border-purple-200',
  Shortlisted: 'bg-cyan-50 text-cyan-700 border-cyan-200', 'Interview Scheduled': 'bg-amber-50 text-amber-700 border-amber-200',
  'Interview Completed': 'bg-orange-50 text-orange-700 border-orange-200', Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Offer: 'bg-lime-50 text-lime-700 border-lime-200', Hired: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Rejected: 'bg-red-50 text-red-700 border-red-200', Withdrawn: 'bg-stone-100 text-stone-500 border-stone-200',
  'On Hold': 'bg-yellow-50 text-yellow-700 border-yellow-200', 'Job Closed': 'bg-slate-200 text-slate-600 border-slate-300',
};

export function ApplicationsKanban({ apps, onOpen, onDropMove }: { apps: any[]; onOpen: (a: any) => void; onDropMove: (a: any, to: string) => void }) {
  const [dragId, setDragId] = useState<string | null>(null);
  const cols = APP_STAGES.map((s) => ({ stage: s, items: apps.filter((a) => a.stage === s) }));
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-3" data-lenis-prevent>
      <div className="flex gap-3 min-w-[1180px] items-start">
        {cols.map((c) => (
          <div key={c.stage} className="flex-1 min-w-[200px] rounded-2xl bg-white border border-slate-200 p-2 flex flex-col max-h-[62vh]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const a = apps.find((x) => x.id === dragId);
              setDragId(null);
              if (a && c.stage !== a.stage) onDropMove(a, c.stage);
            }}>
            <div className="flex items-center justify-between px-1 pb-1.5 sticky top-0 bg-white z-10">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${APP_STAGE_TONE[c.stage] || APP_STAGE_TONE.New}`}>{c.stage}</span>
              <span className="text-[11px] font-extrabold text-slate-400">{c.items.length}</span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-0.5" data-lenis-prevent>
            {c.items.map((a) => (
              <div key={a.id} draggable onDragStart={() => setDragId(a.id)}
                onClick={() => onOpen(a)}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-grab active:cursor-grabbing hover:border-[#0B5FD9]">
                <div className="font-extrabold text-slate-900 truncate">{a.jobTitle || a.jobId}</div>
                <div className="text-slate-500 font-medium truncate">{a.candidateEmail}</div>
                <div className="font-mono text-[10px] text-slate-400">{a.id}</div>
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Phase 2: Interviews ---------------- */
const SCORECARD_DIMS = ['Technical depth', 'Problem solving', 'Communication', 'Ownership & culture'];
const RECO_TONE: Record<string, string> = {
  'Strong hire': 'bg-emerald-600 text-white border-emerald-600',
  'Hire': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Hold': 'bg-amber-50 text-amber-800 border-amber-200',
  'No hire': 'bg-red-50 text-red-700 border-red-200',
};
/** Enterprise scorecard card — overall, dimensions, recommendation, strengths/gaps. */
export function ScorecardCard({ f }: { f: any }) {
  const dims: Record<string, number> = f.dimensions || {};
  const avg = Object.values(dims).length ? (Object.values(dims).reduce((a: number, b: number) => a + Number(b), 0) / Object.values(dims).length) : null;
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-extrabold text-slate-900 text-sm">★ {f.rating ?? '—'}/5</span>
        {avg !== null ? <span className="text-[11px] font-bold text-slate-500">dims avg {avg.toFixed(1)}</span> : null}
        {f.recommendation ? <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${RECO_TONE[f.recommendation] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{f.recommendation}</span> : null}
        <span className="font-medium text-slate-500">• {f.by} • {String(f.createdAt || '').slice(0, 16).replace('T', ' ')}</span>
      </div>
      {Object.keys(dims).length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(dims).map(([k, v]) => (
            <span key={k} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-[11px]">{k}: {String(v)}/5</span>
          ))}
        </div>
      ) : null}
      {f.strengths ? <div><span className="font-extrabold text-emerald-700">Strengths — </span><span className="whitespace-pre-wrap">{f.strengths}</span></div> : null}
      {f.gaps ? <div><span className="font-extrabold text-amber-700">Gaps — </span><span className="whitespace-pre-wrap">{f.gaps}</span></div> : null}
      {f.notes && <div className="whitespace-pre-wrap text-slate-700">{f.notes}</div>}
    </div>
  );
}
/** Enterprise scorecard form — one code path for drawer tab + modal; parent syncs every list. */
export function ScorecardForm({ interviewId, onSaved, onCancel }: { interviewId: string; onSaved: (fb: any) => void; onCancel?: () => void }) {
  const [rating, setRating] = useState('4');
  const [dims, setDims] = useState<Record<string, string>>({});
  const [reco, setReco] = useState('');
  const [strengths, setStrengths] = useState('');
  const [gaps, setGaps] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const dimensions: Record<string, number> = {};
      for (const [k, v] of Object.entries(dims)) if (v !== '') dimensions[k] = Number(v);
      const created = unwrapObj(await interviewsApi.feedback(interviewId, {
        rating: Number(rating), ...(Object.keys(dimensions).length ? { dimensions } : {}),
        ...(reco ? { recommendation: reco } : {}),
        ...(strengths.trim() ? { strengths: strengths.trim() } : {}),
        ...(gaps.trim() ? { gaps: gaps.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }));
      if (created?.id) { onSaved(created); setDims({}); setReco(''); setStrengths(''); setGaps(''); setNotes(''); setRating('4'); }
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3 p-3 rounded-2xl bg-white border border-slate-200">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Field label="Overall (1–5) *"><Select value={rating} onChange={setRating} options={['1', '2', '3', '4', '5'].map((r) => ({ value: r, label: `${r} / 5` }))} /></Field>
        <Field label="Recommendation"><Select value={reco} onChange={setReco} placeholder="Choose…" options={['Strong hire', 'Hire', 'Hold', 'No hire'].map((r) => ({ value: r, label: r }))} /></Field>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCORECARD_DIMS.map((d) => (
          <Field key={d} label={d}><Select value={dims[d] || ''} onChange={(v) => setDims((m) => ({ ...m, [d]: v }))} placeholder="—" options={['1', '2', '3', '4', '5'].map((r) => ({ value: r, label: `${r}` }))} /></Field>
        ))}
      </div>
      <Field label="Strengths"><textarea rows={2} className={kitInput} value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="What stood out…" /></Field>
      <Field label="Gaps / concerns"><textarea rows={2} className={kitInput} value={gaps} onChange={(e) => setGaps(e.target.value)} placeholder="Risks, missing depth…" /></Field>
      <Field label="Overall notes"><textarea rows={2} className={kitInput} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Hire / no-hire reasoning…" /></Field>
      {error ? <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[11px] font-bold">{error}</div> : null}
      <div className="flex justify-end gap-2">
        {onCancel ? <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Close</button> : null}
        <button className={btnPrimary} disabled={busy}>{busy ? 'Saving…' : 'Record scorecard'}</button>
      </div>
    </form>
  );
}

export function InterviewsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState(0);
  const [form, setForm] = useState({ applicationId: '', jobId: '', round: 'Technical Round 1', date: '', hour: '10', minute: '00', mode: 'video', interviewer: '', panel: '', meetingLink: '', venue: '', instructions: '', timezone: 'Asia/Kolkata' });
  const [busy, setBusy] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [resched, setResched] = useState({ id: '', date: '', hour: '10', minute: '00', reason: '' });
  const [cancelId, setCancelId] = useState('');
  const [editIv, setEditIv] = useState<any>(null);
  const [editForm, setEditForm] = useState({ round: '', mode: 'video', interviewer: '', panel: '', meetingLink: '', venue: '', instructions: '', timezone: 'Asia/Kolkata', confirmationStatus: 'Pending' });
  const [fbFor, setFbFor] = useState<any>(null);
  const [fbList, setFbList] = useState<any[]>([]);
  const [detailIv, setDetailIv] = useState<any>(null);
  const [detailFb, setDetailFb] = useState<any[]>([]);
  const [detailTab, setDetailTab] = useState('overview');
  const [detailApp, setDetailApp] = useState<any>(null);
  const [detailCand, setDetailCand] = useState<any>(null);
  const [detailJob, setDetailJob] = useState<any>(null);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const openDetail = async (i: any) => {
    setDetailIv(i); setDetailTab('overview'); setDetailFb([]); setDetailApp(null); setDetailCand(null); setDetailJob(null); setConfirmComplete(false);
    try { setDetailFb(unwrapList(await interviewsApi.feedbackList(i.id))); } catch { setDetailFb([]); }
    if (i.applicationId) {
      try {
        const aRes: any = await apiClient.get(`/api/v1/applications/${i.applicationId}`).catch(() => null);
        const app = (aRes as { data?: any })?.data ?? null;
        if (app?.id) setDetailApp(app);
      } catch { /* application context is best-effort */ }
    }
    if (i.candidateEmail) {
      try {
        const cRes: any = await directoryApi.candidatesDirectory('?page=1&pageSize=100').catch(() => null);
        const found = unwrapList(cRes).find((c: any) => String(c.email || '').toLowerCase() === String(i.candidateEmail || '').toLowerCase());
        setDetailCand(found || null);
      } catch { /* candidate context is best-effort */ }
    }
    if (i.jobId) {
      try {
        const jRes: any = await jobsApi.detail(i.jobId).catch(() => null);
        const job = unwrapObj(jRes);
        setDetailJob(job?.id ? job : null);
      } catch { /* job context is best-effort */ }
    }
  };
  const pushFeedback = (fb: any, interviewId: string) => {
    if (!fb?.id) return;
    if (detailIv?.id === interviewId) setDetailFb((x) => (x.some((f) => f.id === fb.id) ? x : [fb, ...x]));
    if (fbFor?.id === interviewId) setFbList((x) => (x.some((f) => f.id === fb.id) ? x : [fb, ...x]));
    syncAll();
  };
  const [q, setQ] = useQueryState('iv_q');
  const [status, setStatus] = useQueryState('iv_status');
  const [mode, setMode] = useQueryState('iv_mode');
  const [upcoming, setUpcoming] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 40;
  const emptyForm = { applicationId: '', jobId: '', round: 'Technical Round 1', date: '', hour: '10', minute: '00', mode: 'video', interviewer: '', panel: '', meetingLink: '', venue: '', instructions: '', timezone: 'Asia/Kolkata' };
  const dq = useDebounced(q);
  const ivMenuFor = (i: any) => (
    <RowMenu label={`Interview ${i.id}`} items={[
      { label: 'View details', onSelect: () => openDetail(i) },
      ...((i.meetingLink || i.meetLink) ? [{ label: 'Join meeting', onSelect: () => window.open(i.meetingLink || i.meetLink, '_blank', 'noopener') }] : []),
      { label: 'Add to calendar (.ics)', onSelect: () => interviewsApi.downloadIcs(i.id).catch((e) => setError(errMsg(e))) },
      { label: 'Edit details…', onSelect: () => {
        setEditIv(i);
        setEditForm({ round: i.round || '', mode: i.mode || 'video', interviewer: i.interviewer || '', panel: i.panel || '', meetingLink: i.meetingLink || i.meetLink || '', venue: i.venue || '', instructions: i.instructions || '', timezone: i.timezone || 'Asia/Kolkata', confirmationStatus: i.confirmationStatus || 'Pending' });
      } },
      { label: 'Feedback / scorecard…', onSelect: () => openFeedback(i) },
      ...(['Scheduled', 'Rescheduled'].includes(i.status) ? [
        { label: 'Reschedule…', onSelect: () => { openDetail(i); setResched({ id: i.id, date: '', hour: '10', minute: '00', reason: '' }); } },
        { label: 'Mark completed', onSelect: () => setStatusOf(i.id, 'Completed') },
        { label: 'Mark no-show', onSelect: () => setStatusOf(i.id, 'No-show') },
        { label: 'Cancel interview…', danger: true, onSelect: () => setCancelId(i.id) },
      ] : []),
    ]} />
  );
  const HOURS = Array.from({ length: 24 }, (_, h) => ({ value: `${h}`.padStart(2, '0'), label: `${h}`.padStart(2, '0') }));
  const MINUTES = ['00', '15', '30', '45'].map((m) => ({ value: m, label: m }));

  const load = async () => {
    setLoading(true); setError('');
    try { setRows(unwrapList(await interviewsApi.list('?page=1&pageSize=100'))); }
    catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const schedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicationId.trim() || !form.jobId.trim() || !form.date) { setError('Application, job and date are required.'); return; }
    // Phase 3: client-side future check mirrors the server guard (server re-validates).
    if (new Date(`${form.date}T${form.hour}:${form.minute}:00`).getTime() <= Date.now()) { setError('Interview must be scheduled in the future.'); return; }
    setBusy(true);
    try {
      const created = unwrapObj(await interviewsApi.schedule({ ...form, scheduledAt: `${form.date}T${form.hour}:${form.minute}:00` }));
      if (created?.id) setRows((r) => [created, ...r]);
      setForm(emptyForm);
      setShowSchedule(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const confirmReschedule = async (id: string) => {
    if (!resched.date) { setError('Pick a new date.'); return; }
    if (new Date(`${resched.date}T${resched.hour}:${resched.minute}:00`).getTime() <= Date.now()) { setError('Rescheduled time must be in the future.'); return; }
    try {
      const u = unwrapObj(await interviewsApi.reschedule(id, { scheduledAt: `${resched.date}T${resched.hour}:${resched.minute}:00`, reason: resched.reason || undefined }));
      setRows((r) => r.map((x) => (x.id === id ? u : x)));
      if (detailIv?.id === id && u?.id) setDetailIv(u);
      setResched({ id: '', date: '', hour: '10', minute: '00', reason: '' }); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const setStatusOf = async (id: string, next: string, reason?: string) => {
    try {
      const u = unwrapObj(await interviewsApi.reschedule(id, { status: next, ...(reason ? { reason } : {}) }));
      setRows((r) => r.map((x) => (x.id === id ? u : x)));
      if (detailIv?.id === id && u?.id) setDetailIv(u);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editIv) return;
    setBusy(true);
    try {
      const u = unwrapObj(await interviewsApi.reschedule(editIv.id, { ...editForm }));
      setRows((r) => r.map((x) => (x.id === editIv.id ? u : x)));
      if (detailIv?.id === editIv.id && u?.id) setDetailIv(u);
      setEditIv(null); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const openFeedback = async (i: any) => {
    setFbFor(i); setFbList([]);
    try { setFbList(unwrapList(await interviewsApi.feedbackList(i.id))); }
    catch (e) { setError(errMsg(e)); }
  };

  const filtered = rows.filter((i) => {
    if (dq.trim()) {
      const s = dq.trim().toLowerCase();
      if (!`${i.id} ${i.candidateName || ''} ${i.candidateEmail || ''} ${i.applicationId || ''} ${i.jobId || ''}`.toLowerCase().includes(s)) return false;
    }
    if (status && i.status !== status) return false;
    if (mode && String(i.mode || '') !== mode) return false;
    if (upcoming && !['Scheduled', 'Rescheduled'].includes(i.status)) return false;
    return true;
  }).sort((a, b) => String(a.scheduledAt || '').localeCompare(String(b.scheduledAt || '')));
  const total = filtered.length;
  const pagedRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [dq, status, mode, upcoming]);

  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-base font-extrabold text-slate-900">Interviews — Schedule, Track & Score</h3>
        <button type="button" onClick={() => setShowSchedule(true)} className={btnPrimary}>+ Schedule</button>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={load} />}
      <div className="flex flex-col sm:flex-row gap-2">
        <SearchSuggest value={q} onChange={setQ} placeholder="Search candidate, application, job…" ariaLabel="Search interviews"
    items={rows.map((i: any) => ({ key: String(i.id), query: String(i.id), title: String(i.candidateName || i.candidateEmail || i.id), meta: [i.candidateEmail, i.jobId].filter(Boolean).join(' • '), status: i.status }))}
    onPick={(it) => setQ(it.query ?? it.key)} />
        <div className="w-40 shrink-0">
          <Select value={status} onChange={setStatus} ariaLabel="Status filter" placeholder="All statuses"
            options={[{ value: '', label: 'All statuses' }, ...['Scheduled', 'Rescheduled', 'Completed', 'No-show', 'Cancelled'].map((s) => ({ value: s, label: s }))]} />
        </div>
        <div className="w-32 shrink-0">
          <Select value={mode} onChange={setMode} ariaLabel="Mode filter" placeholder="Any mode"
            options={[{ value: '', label: 'Any mode' }, ...['video', 'phone', 'onsite'].map((s) => ({ value: s, label: s }))]} />
        </div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 whitespace-nowrap px-2">
          <input type="checkbox" checked={upcoming} onChange={(e) => setUpcoming(e.target.checked)} /> Upcoming only
        </label>
      </div>
      <div className="text-[11px] font-bold text-slate-500">{total} interview(s) match.</div>
      <Modal open={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule interview" subtitle="Scheduling auto-enables the application chat">
        <form onSubmit={schedule} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Candidate / application *"><ApplicationPicker value={form.applicationId} onChange={(v) => setForm({ ...form, applicationId: v })} onPick={(a) => setForm((f) => ({ ...f, jobId: a.jobId || f.jobId }))} /></Field></div>
          <Field label="Job ID *"><input className={kitInput} value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })} /></Field>
          <Field label="Round"><input className={kitInput} value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} /></Field>
          <Field label="Mode"><Select value={form.mode} onChange={(v) => setForm({ ...form, mode: v })} options={[{ value: 'video', label: 'Video' }, { value: 'phone', label: 'Phone' }, { value: 'onsite', label: 'Onsite' }]} /></Field>
          <Field label="Timezone"><Select value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} options={['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Singapore'].map((z) => ({ value: z, label: z }))} /></Field>
          <Field label="Date *"><DatePicker value={form.date} onChange={(v) => setForm({ ...form, date: v })} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Hour"><Select value={form.hour} onChange={(v) => setForm({ ...form, hour: v })} options={HOURS} /></Field>
            <Field label="Minute"><Select value={form.minute} onChange={(v) => setForm({ ...form, minute: v })} options={MINUTES} /></Field>
          </div>
          <Field label="Interviewer / panel lead"><input className={kitInput} value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} /></Field>
          <Field label="Full panel"><input className={kitInput} value={form.panel} onChange={(e) => setForm({ ...form, panel: e.target.value })} placeholder="Names, comma separated" /></Field>
          <Field label="Meeting link"><input className={kitInput} value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} /></Field>
          <Field label="Venue (onsite)"><input className={kitInput} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Instructions"><input className={kitInput} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowSchedule(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy}>{busy ? 'Scheduling…' : 'Schedule interview'}</button>
          </div>
        </form>
      </Modal>
      {loading ? <InlineLoading message="Loading interviews…" /> : filtered.length === 0 ? (
        <EmptyState title="No interviews match" message="Adjust filters, or schedule the first round for a shortlisted application." />
      ) : (<>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
          {pagedRows.map((i) => (
            <DrawerCard key={i.id} status={i.status}
              title={`${i.round || 'Interview'} — ${i.candidateName || i.candidateEmail || ''}`}
              meta={`${String(i.scheduledAt || '').slice(0, 16).replace('T', ' ') || 'Unscheduled'} • ${i.mode || ''}`}
              right={<><StatusPill value={i.status} />{ivMenuFor(i)}</>}>
              <div className="text-[11px] text-slate-500 font-medium truncate">App <span className="font-mono">{i.applicationId}</span> • {i.jobId || ''}</div>
              <div className="text-[11px] text-slate-500 font-medium truncate">{i.interviewer ? `Panel: ${i.interviewer}${i.panel ? ` + ${i.panel}` : ''}` : 'Panel TBD'}</div>
              <button type="button" onClick={() => openDetail(i)} className="mt-1.5 w-full px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-700 transition">View details →</button>
            </DrawerCard>
          ))}
        </div>
        <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      </>)}
      <Modal open={editIv !== null} onClose={() => setEditIv(null)} title={`Edit interview — ${editIv?.id || ''}`} subtitle="Panel, link, venue and instructions stay editable until completion">
        <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Round"><input className={kitInput} value={editForm.round} onChange={(e) => setEditForm({ ...editForm, round: e.target.value })} /></Field>
          <Field label="Mode"><Select value={editForm.mode} onChange={(v) => setEditForm({ ...editForm, mode: v })} options={[{ value: 'video', label: 'Video' }, { value: 'phone', label: 'Phone' }, { value: 'onsite', label: 'Onsite' }]} /></Field>
          <Field label="Interviewer / panel lead"><input className={kitInput} value={editForm.interviewer} onChange={(e) => setEditForm({ ...editForm, interviewer: e.target.value })} /></Field>
          <Field label="Full panel"><input className={kitInput} value={editForm.panel} onChange={(e) => setEditForm({ ...editForm, panel: e.target.value })} /></Field>
          <Field label="Meeting link"><input className={kitInput} value={editForm.meetingLink} onChange={(e) => setEditForm({ ...editForm, meetingLink: e.target.value })} /></Field>
          <Field label="Venue"><input className={kitInput} value={editForm.venue} onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })} /></Field>
          <Field label="Timezone"><Select value={editForm.timezone} onChange={(v) => setEditForm({ ...editForm, timezone: v })} options={['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Singapore'].map((z) => ({ value: z, label: z }))} /></Field>
          <Field label="Candidate confirmation"><Select value={editForm.confirmationStatus} onChange={(v) => setEditForm({ ...editForm, confirmationStatus: v })} options={['Pending', 'Confirmed', 'Declined'].map((s) => ({ value: s, label: s }))} /></Field>
          <div className="sm:col-span-2"><Field label="Instructions"><input className={kitInput} value={editForm.instructions} onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditIv(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>
      <Modal open={fbFor !== null} onClose={() => setFbFor(null)} title={`Scorecard — ${fbFor?.id || ''}`} subtitle={`${fbFor?.candidateName || fbFor?.candidateEmail || ''} • ${fbFor?.round || ''}`}>
        <div className="space-y-3">
          {fbList.length === 0 ? (
            <div className="text-xs text-slate-500 font-medium">No feedback recorded yet — the panel's scorecard lands here.</div>
          ) : (
            <div className="space-y-2">{fbList.map((f: any) => <ScorecardCard key={f.id} f={f} />)}</div>
          )}
          {fbFor ? <ScorecardForm interviewId={fbFor.id} onSaved={(fb) => pushFeedback(fb, fbFor.id)} onCancel={() => setFbFor(null)} /> : null}
        </div>
      </Modal>
      <ActionConfirm
        open={cancelId !== ''}
        onCancel={() => setCancelId('')}
        title={`Cancel interview ${cancelId || ''}`}
        subtitle={(() => {
          const row = rows.find((x) => x.id === cancelId);
          const appStage = detailIv?.id === cancelId && detailApp ? ` • application ${detailApp.id} at ${detailApp.stage}` : (row?.applicationId ? ` • application ${row.applicationId}` : '');
          return `${row?.round || detailIv?.round || ''} • currently ${row?.status || detailIv?.status || ''}${appStage}`;
        })()}
        why={['Interview is currently Scheduled / Rescheduled', 'Cancellation is an explicit, audited terminal step']}
        steps={['Status moves to Cancelled', 'Feedback history is preserved', 'Both sides are notified']}
        consequences={['The slot is released', 'Candidate stays in pipeline — reschedule creates a fresh round']}
        requireReason
        reasonLabel="Cancellation reason *"
        confirmLabel="Cancel interview"
        tone="danger"
        onConfirm={async (reasonText) => {
          const u = unwrapObj(await interviewsApi.reschedule(cancelId, { status: 'Cancelled', reason: reasonText || 'cancelled' }));
          setRows((r) => r.map((x) => (x.id === cancelId ? u : x)));
          if (detailIv?.id === cancelId && u?.id) setDetailIv(u);
          setCancelId('');
          setResched({ id: '', date: '', hour: '10', minute: '00', reason: '' });
          syncAll();
        }}
      />
      {detailIv && (
        <DetailDrawer title={`${detailIv.round || 'Interview'} — ${detailIv.candidateName || detailIv.candidateEmail || ''}`} subtitle={`${detailIv.id} • App ${detailIv.applicationId || '—'} • ${detailIv.jobId || ''}`} onClose={() => setDetailIv(null)} width="max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={tonePill(detailIv.status)}>{detailIv.status}</span>
            <span className="text-[11px] font-bold text-slate-500 capitalize">{detailIv.mode || ''}{detailIv.timezone ? ` • ${detailIv.timezone}` : ''}</span>
            {detailIv.confirmationStatus && detailIv.confirmationStatus !== 'Pending' ? <span className={tonePill(detailIv.confirmationStatus)}>{detailIv.confirmationStatus}</span> : null}
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">{detailIv.id}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {detailIv.meetingLink || detailIv.meetLink ? <button type="button" onClick={() => window.open(detailIv.meetingLink || detailIv.meetLink, '_blank', 'noopener')} className={btnPrimary}>Join meeting ↗</button> : null}
            {['Scheduled', 'Rescheduled'].includes(detailIv.status) && resched.id !== detailIv.id && !confirmComplete ? (<>
              <button type="button" onClick={() => setResched({ id: detailIv.id, date: '', hour: '10', minute: '00', reason: '' })} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Reschedule…</button>
              <button type="button" onClick={() => setConfirmComplete(true)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">Mark completed</button>
              <button type="button" onClick={() => setCancelId(detailIv.id)} className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 font-bold text-xs">Cancel…</button>
            </>) : null}
          </div>
          {resched.id === detailIv.id ? (
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800">Reschedule — {detailIv.id} • currently {detailIv.status}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Field label="New date *"><DatePicker value={resched.date} onChange={(v) => setResched({ ...resched, date: v })} ariaLabel="New date" /></Field>
                <Field label="Hour"><Select value={resched.hour} onChange={(v) => setResched({ ...resched, hour: v })} ariaLabel="Hour" options={HOURS} /></Field>
                <Field label="Minute"><Select value={resched.minute} onChange={(v) => setResched({ ...resched, minute: v })} ariaLabel="Minute" options={MINUTES} /></Field>
                <Field label="Reason"><input className={kitInput} placeholder="Candidate requested…" value={resched.reason} onChange={(e) => setResched({ ...resched, reason: e.target.value })} /></Field>
              </div>
              <div className="text-[11px] font-medium text-blue-900">Moves to <strong>Rescheduled</strong> — history is preserved and both sides are notified.</div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setResched({ id: '', date: '', hour: '10', minute: '00', reason: '' })} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Keep slot</button>
                <button type="button" onClick={() => confirmReschedule(detailIv.id)} className={btnDark}>Confirm move</button>
              </div>
            </div>
          ) : null}
          {confirmComplete ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">Mark completed — check the context</div>
              <div className="text-xs font-medium text-emerald-900 space-y-1">
                <div>Interview <strong className="font-mono">{detailIv.id}</strong>: <span className={tonePill(detailIv.status)}>{detailIv.status}</span> → <span className={tonePill('Completed')}>Completed</span></div>
                <div>Application <strong className="font-mono">{detailIv.applicationId || '—'}</strong> is currently at stage <strong>{detailApp?.stage || '…'}</strong>{detailFb.length === 0 ? ' • no scorecard yet — add one after completing' : ` • ${detailFb.length} scorecard(s) on file`}.</div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setConfirmComplete(false)} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Keep {detailIv.status.toLowerCase()}</button>
                <button type="button" onClick={() => { setConfirmComplete(false); setStatusOf(detailIv.id, 'Completed'); }} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">Confirm completed</button>
              </div>
            </div>
          ) : null}
          <DetailTabs tabs={[{ key: 'overview', label: 'Overview' }, { key: 'feedback', label: 'Feedback', count: detailFb.length }, { key: 'ats', label: 'ATS & Fit' }, { key: 'activity', label: 'Activity', count: (detailIv.history || []).length }]} active={detailTab} onPick={setDetailTab} />
          {detailTab === 'overview' && (
            <div className="space-y-3">
              <DetailSection title="Schedule">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[['Candidate', detailIv.candidateName || detailIv.candidateEmail || '—'], ['Application', detailIv.applicationId || '—'], ['Job', detailIv.jobId || detailIv.jobTitle || '—'], ['When', String(detailIv.scheduledAt || '').slice(0, 16).replace('T', ' ') || '—'], ['Mode', detailIv.mode || '—'], ['Venue', detailIv.venue || (detailIv.mode === 'onsite' ? '—' : 'Remote link above')], ['Timezone', detailIv.timezone || 'Asia/Kolkata'], ['Confirmation', detailIv.confirmationStatus || 'Pending']].map(([k, v]) => (
                    <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
                  ))}
                  {detailIv.meetingLink || detailIv.meetLink ? <div className="sm:col-span-2 p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs break-all"><span className="text-[10px] font-bold text-blue-800 uppercase">Meeting link </span><span className="font-mono">{detailIv.meetingLink || detailIv.meetLink}</span></div> : null}
                </div>
              </DetailSection>
              <DetailSection title="Panel & instructions">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[['Interviewer / lead', detailIv.interviewer || '—'], ['Full panel', detailIv.panel || '—']].map(([k, v]) => (
                    <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
                  ))}
                  <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">Instructions</div><div className="font-medium mt-1 whitespace-pre-wrap">{detailIv.instructions || '—'}</div></div>
                </div>
              </DetailSection>
            </div>
          )}
          {detailTab === 'feedback' && (
            <DetailSection title="Scorecards" count={detailFb.length}>
              {detailFb.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No feedback recorded yet — the panel's scorecard lands here.</div> : (
                <div className="space-y-2">{detailFb.map((x: any) => <ScorecardCard key={x.id} f={x} />)}</div>
              )}
              <ScorecardForm interviewId={detailIv.id} onSaved={(fb) => pushFeedback(fb, detailIv.id)} />
            </DetailSection>
          )}
          {detailTab === 'ats' && (
            <div className="space-y-3">
              {(() => {
                const keywords = `${detailIv.jobTitle || ''} ${detailIv.round || ''}`.toLowerCase().split(/\s+/).filter((k) => k.length >= 2);
                const a = matchAnalysis({ job: detailJob, keywords, expMin: '', expMax: '', cand: detailCand });
                const ratings = detailFb.map((x: any) => Number(x.rating)).filter((n: number) => Number.isFinite(n));
                const avgR = ratings.length ? ratings.reduce((s: number, n: number) => s + n, 0) / ratings.length : null;
                const prob = avgR !== null ? Math.round(a.score * 0.7 + (avgR / 5) * 100 * 0.3) : a.score;
                const probLabel = prob >= 80 ? 'High' : prob >= 60 ? 'Moderate' : prob >= 40 ? 'Possible' : 'Low';
                const bar = prob >= 80 ? 'bg-emerald-500' : prob >= 60 ? 'bg-blue-500' : prob >= 40 ? 'bg-amber-500' : 'bg-slate-400';
                const resumeBits: string[] = [];
                let resumeScore = 0;
                if (!detailCand) { resumeBits.push('candidate profile not on file'); }
                else {
                  if (detailCand.resumeRef) { resumeScore += 50; resumeBits.push(`resume on file (v${detailCand.resumeVersion || 1})`); }
                  else resumeBits.push('no resume uploaded');
                  const upd = new Date(detailCand.updatedAt || detailCand.createdAt || 0).getTime();
                  if (upd && Date.now() - upd < 90 * 864e5) { resumeScore += 20; resumeBits.push('fresh (90d)'); }
                  else if (upd) resumeBits.push('stale profile');
                  if (detailCand.summary) { resumeScore += 15; resumeBits.push('has summary'); }
                  const skN = Array.isArray(detailCand.skills) ? detailCand.skills.length : String(detailCand.skills || '').split(',').filter((s: string) => s.trim()).length;
                  if (skN > 0) { resumeScore += 10; resumeBits.push(`${skN} skills listed`); }
                  if (detailCand.education) { resumeScore += 5; resumeBits.push('education on file'); }
                }
                resumeScore = Math.min(100, resumeScore);
                return (
                  <div className="space-y-3">
                    <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
                      <div className={`text-3xl font-extrabold ${prob >= 80 ? 'text-emerald-300' : prob >= 60 ? 'text-blue-300' : prob >= 40 ? 'text-amber-300' : 'text-slate-300'}`}>{prob}%</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-300">{probLabel} hiring probability{avgR !== null ? ` • panel avg ${avgR.toFixed(1)}/5` : ' • ATS only, no scorecards yet'}</div>
                        <div className="mt-1.5 h-2 rounded-full bg-white/15 overflow-hidden">
                          <div className={`h-full rounded-full ${bar}`} style={{ width: `${prob}%` }} />
                        </div>
                        <div className="text-[10px] font-bold mt-1 text-slate-400">ATS 70% · panel signal 30%{avgR === null ? ' (pending)' : ''}</div>
                      </div>
                    </div>
                    <DetailSection title="Match factors">
                      <div className="space-y-1.5">
                        {a.factors.map((ft) => (
                          <div key={ft.label} className="flex items-center gap-2">
                            <span className="w-28 shrink-0 text-[11px] font-bold text-slate-600 truncate">{ft.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full bg-[#0B5FD9]" style={{ width: `${ft.max ? Math.round((ft.got / ft.max) * 100) : 0}%` }} />
                            </div>
                            <span className="w-12 shrink-0 text-right text-[11px] font-extrabold text-slate-800">{ft.got}/{ft.max}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs font-extrabold text-slate-900">{a.verdict}</div>
                    </DetailSection>
                    <DetailSection title={`Resume score — ${resumeScore}/100`}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${resumeScore}%` }} />
                        </div>
                        <span className="text-[11px] font-extrabold text-slate-800 shrink-0">{resumeScore}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-1.5">{resumeBits.join(' • ')}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">Document signal from resume metadata + profile completeness — not a parse of resume content.</div>
                    </DetailSection>
                    {(a.skillMatched.length > 0 || a.skillMissing.length > 0) && (
                      <DetailSection title={`Skill match (${a.skillMatched.length} hit)`}>
                        <div className="flex flex-wrap gap-1.5">
                          {a.skillMatched.map((t) => <span key={`m${t}`} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">✓ {t}</span>)}
                          {a.skillMissing.map((t) => <span key={`x${t}`} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[11px]">{t}</span>)}
                        </div>
                      </DetailSection>
                    )}
                    {(a.best.length > 0 || a.gaps.length > 0 || a.nextSteps.length > 0) && (
                      <DetailSection title="Fit summary">
                        {a.best.map((b) => <div key={b} className="text-xs font-bold text-emerald-800">✓ {b}</div>)}
                        {a.gaps.map((g) => <div key={g} className="text-xs font-bold text-amber-800">• {g}</div>)}
                        {a.nextSteps.map((s, i) => <div key={s} className="text-xs font-bold text-blue-800">{i + 1}. {s}</div>)}
                      </DetailSection>
                    )}
                    <DetailSection title="Related details">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {[['Candidate', detailCand ? `${detailCand.name || detailIv.candidateEmail} • ${detailCand.roleTitle || ''} • ${detailCand.experienceYears ?? '—'}y` : (detailIv.candidateName || detailIv.candidateEmail || '—')], ['Application', detailApp ? `${detailApp.id} • ${detailApp.stage}` : (detailIv.applicationId || '—')], ['Job', detailJob ? `${detailJob.title || detailJob.id} • ${detailJob.location || ''}` : (detailIv.jobId || detailIv.jobTitle || '—')], ['Round', `${detailIv.round || ''} • ${detailIv.mode || ''} • ${String(detailIv.scheduledAt || '').slice(0, 16).replace('T', ' ') || '—'}`]].map(([k, v]) => (
                          <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
                        ))}
                      </div>
                      {!detailJob && <div className="text-[10px] text-slate-400 font-medium mt-1.5">Job record not on file — scoring falls back to title keywords.</div>}
                      {!detailCand && <div className="text-[10px] text-slate-400 font-medium mt-1">Candidate profile not on file — scoring uses interview data only.</div>}
                    </DetailSection>
                  </div>
                );
              })()}
            </div>
          )}
          {detailTab === 'activity' && (
            <DetailSection title="Reschedule & status history" count={(detailIv.history || []).length}>
              {(detailIv.history || []).length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No moves recorded yet — reschedules and status changes land here with actor and reason.</div> : (
                <ol className="relative ml-1.5 border-l-2 border-slate-100 space-y-3">
                  {(detailIv.history || []).slice(-30).reverse().map((h: any, i: number) => (
                    <li key={i} className="ml-4 relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-100" />
                      <div className="text-xs font-bold text-slate-900">{h.from} → {h.to} <span className="font-medium text-slate-500">• {h.by}{h.reason ? ` • ${h.reason}` : ''}</span></div>
                      <div className="text-[11px] text-slate-400 font-mono">{String(h.at || '').slice(0, 16).replace('T', ' ')}</div>
                    </li>
                  ))}
                </ol>
              )}
            </DetailSection>
          )}
        </DetailDrawer>
      )}
    </div>
  );
}

/* ---------------- Phase 2: Interview-only chat ---------------- */

/* ---------------- Phase 2: Interview-only chat ---------------- */
export function ChatPanel({ initialAppId = '' }: { initialAppId?: string } = {}) {
  const [appId, setAppId] = useState(initialAppId);
  const [convs, setConvs] = useState<any[]>([]);
  const [active, setActive] = useState('');
  const [msgs, setMsgs] = useState<any[]>([]);
  const [threadConv, setThreadConv] = useState<any>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState(0);
  const [attBusy, setAttBusy] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [editingBody, setEditingBody] = useState('');
  const me = useMemo(() => { try { return (localStorage.getItem('user_email') || '').toLowerCase(); } catch { return ''; } }, []);

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
      setThreadConv((thread as any)?.conversation || null);
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); setMsgs([]); setThreadConv(null); }
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
  const sendAttachment = async (f: File) => {
    if (!active) return;
    if (f.size > 5 * 1024 * 1024) { setError('Attachment must be under 5 MB (PDF, DOC, DOCX, PNG, JPG).'); return; }
    setAttBusy(true); setError('');
    try {
      const buf = await f.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const up = unwrapObj(await documentsApi.upload({ name: f.name, mime: f.type || 'application/pdf', data: btoa(binary), kind: 'chat-attachment' }));
      const m = unwrapObj(await chatApi.send(active, draft.trim() || f.name, { docId: up.id, name: up.name || f.name, mime: up.mime || f.type, size: up.size || f.size }));
      if (m?.id) setMsgs((x) => [...x, m]);
      setDraft('');
      syncAll();
    } catch (e) { setError(errMsg(e)); }
    finally { setAttBusy(false); }
  };
  const saveEdit = async (id: string) => {
    if (!editingBody.trim()) return;
    try {
      const m = unwrapObj(await chatApi.edit(id, editingBody.trim()));
      if (m?.id) setMsgs((x) => x.map((row) => (row.id === id ? m : row)));
      setEditingId(''); setEditingBody('');
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { if (initialAppId) find(); }, []);

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
            <button key={c.id} type="button" onClick={() => open(c.id)} className={`px-3 py-1.5 rounded-lg font-bold text-[11px] border ${active === c.id ? 'bg-[#0B5FD9] text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'}`}>{c.id}</button>
          ))}
        </div>
      )}
      {active !== '' && (
        <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          {threadConv && (
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-medium text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1">
              <span><strong className="text-slate-800">Conversation</strong> {threadConv.id}</span>
              <span><strong className="text-slate-800">Application</strong> {threadConv.applicationId || '—'}</span>
              <span><strong className="text-slate-800">Job</strong> {threadConv.jobId || '—'}</span>
              <span><strong className="text-slate-800">Company</strong> {threadConv.companyId || '—'}</span>
              <span><strong className="text-slate-800">Candidate</strong> {threadConv.candidateId || '—'}</span>
              <span><strong className="text-slate-800">Status</strong> {threadConv.status || 'active'}</span>
              <span><strong className="text-slate-800">Created</strong> {String(threadConv.createdAt || '').slice(0, 16).replace('T', ' ') || '—'}</span>
              <span><strong className="text-slate-800">Last message</strong> {String(threadConv.lastMessageAt || '').slice(0, 16).replace('T', ' ') || '—'}</span>
              <span className="col-span-2 sm:col-span-4 text-slate-500">Retention: messages are preserved per platform policy after reschedule, cancellation or completion.</span>
            </div>
          )}
          {msgs.length === 0 && <div className="text-xs text-slate-500 font-medium">No messages yet.</div>}
          {msgs.map((m) => {
            const mine = me && String(m.sender || '').toLowerCase() === me;
            const isEditing = editingId === m.id;
            return (
              <div key={m.id} className="text-xs">
                <strong>{m.sender}:</strong>{' '}
                {isEditing ? (
                  <span className="inline-flex items-center gap-1">
                    <input className={inputCls + ' !w-48 !inline-block'} value={editingBody} onChange={(e) => setEditingBody(e.target.value)} />
                    <button type="button" onClick={() => saveEdit(m.id)} className="font-bold text-emerald-700 underline">Save</button>
                    <button type="button" onClick={() => { setEditingId(''); setEditingBody(''); }} className="font-bold text-slate-500 underline">Cancel</button>
                  </span>
                ) : (
                  <>{m.body}</>
                )}{' '}
                {m.attachment?.docId && (
                  <button type="button" onClick={() => downloadDocumentFile(m.attachment.docId, m.attachment.name).catch(() => {})} className="font-bold text-blue-600 underline">📎 {m.attachment.name}</button>
                )}{' '}
                <span className="text-slate-400">• {String(m.createdAt || '').slice(0, 16).replace('T', ' ')}{m.editedAt ? ' • edited' : ''}{m.deliveryStatus ? ` • ${m.deliveryStatus}` : ''}</span>
                {mine && !isEditing && (
                  <button type="button" onClick={() => { setEditingId(m.id); setEditingBody(m.body); }} className="ml-2 font-bold text-slate-500 underline">Edit</button>
                )}
              </div>
            );
          })}
          <form onSubmit={send} className="flex gap-2">
            <input className={inputCls} placeholder="Write a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <label className={`px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer${attBusy ? ' opacity-50' : ''}`}>
              {attBusy ? 'Uploading…' : '📎 Attach'}
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" disabled={attBusy || !active} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) sendAttachment(f); }} />
            </label>
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
            <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 text-sm">{s.job?.title || s.jobId}</div>
                <div className="text-xs text-slate-500 font-medium">
                  {s.job ? `${s.job.companyName || ''} • ${s.job.location || ''}${s.job.industry ? ` • ${s.job.industry}` : ''}` : (s.jobMissing ? 'Posting unavailable — retained in history' : s.jobId)}
                </div>
                <div className="flex gap-1 flex-wrap mt-1">
                  {s.closed && <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px]">Closed — retained</span>}
                  {s.applied && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Applied</span>}
                </div>
              </div>
              <button type="button" onClick={() => unsave(s.jobId)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Phase 2: Talent pools (cards + drawers + shortlist-to-job) ---------------- */
export function TalentPoolsPanel() {
  const navigate = useNavigate();
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'active' | 'archived'>('all');
  const [counts, setCounts] = useState<Record<string, { total: number; stale: number }>>({});
  // drawers
  const [drawerPool, setDrawerPool] = useState<any>(null);
  const [poolTab, setPoolTab] = useState<'members' | 'details' | 'analytics'>('members');
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberFilter, setMemberFilter] = useState('');
  const [memberDetail, setMemberDetail] = useState<any>(null);
  const [memberTab, setMemberTab] = useState<'profile' | 'pipeline' | 'actions'>('profile');
  const [memberApps, setMemberApps] = useState<any[]>([]);
  const [memberAppsLoading, setMemberAppsLoading] = useState(false);
  // modals
  const [name, setName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addPoolId, setAddPoolId] = useState('');
  const [addQuery, setAddQuery] = useState('');
  const [addResults, setAddResults] = useState<any[]>([]);
  const [addPick, setAddPick] = useState('');
  const [renameFor, setRenameFor] = useState<any>(null);
  const [renameName, setRenameName] = useState('');
  const [removeMember, setRemoveMember] = useState<{ poolId: string; memberId: string; label: string } | null>(null);
  const [shortlistFor, setShortlistFor] = useState<any>(null);
  const [shortlistJob, setShortlistJob] = useState('');
  const [liveJobs, setLiveJobs] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(0);
  const staleOf = (m: any) => !m.candidate;
  const load = async () => {
    setLoading(true); setError('');
    try {
      const rows = unwrapList(await talentApi.pools());
      setPools(rows);
      const map: Record<string, { total: number; stale: number }> = {};
      await Promise.all(rows.map(async (p: any) => {
        try {
          const ms = unwrapList(await talentApi.poolMembers(p.id));
          map[p.id] = { total: ms.length, stale: ms.filter(staleOf).length };
        } catch { map[p.id] = { total: 0, stale: 0 }; }
      }));
      setCounts(map);
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const openDrawer = async (p: any) => {
    setDrawerPool(p); setPoolTab('members'); setMembers([]); setMemberDetail(null); setMemberFilter('');
    setMembersLoading(true);
    try { setMembers(unwrapList(await talentApi.poolMembers(p.id))); }
    catch (e) { setError(errMsg(e)); } finally { setMembersLoading(false); }
  };
  const refreshMembers = async (poolId: string) => {
    try {
      const ms = unwrapList(await talentApi.poolMembers(poolId));
      setMembers(ms);
      setCounts((c) => ({ ...c, [poolId]: { total: ms.length, stale: ms.filter(staleOf).length } }));
      return ms;
    } catch (e) { setError(errMsg(e)); return []; }
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim()) return;
    try { const p = unwrapObj(await talentApi.createPool({ name: name.trim() })); if (p?.id) { setPools((x) => [p, ...x]); setCounts((c) => ({ ...c, [p.id]: { total: 0, stale: 0 } })); } setName(''); setShowCreate(false); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const searchCandidates = async (q: string) => {
    setAddQuery(q);
    if (q.trim().length < 2) { setAddResults([]); return; }
    try {
      const res: any = await talentApi.search('preview', q.trim());
      setAddResults(unwrapList(res).slice(0, 8));
    } catch { setAddResults([]); }
  };
  const add = async (e: React.FormEvent) => {
    e.preventDefault(); if (!addPoolId || !addPick) return;
    setBusy(true);
    try {
      await talentApi.addMember(addPoolId, addPick);
      setAddPick(''); setAddQuery(''); setAddResults([]); setShowAdd(false); setOk('Member added.');
      if (drawerPool?.id === addPoolId) refreshMembers(addPoolId);
      else load();
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doRename = async () => {
    if (!renameFor || !renameName.trim()) return;
    setBusy(true);
    try {
      const u = unwrapObj(await talentApi.editPool(renameFor.id, { name: renameName.trim() }));
      setPools((x) => x.map((y) => (y.id === renameFor.id ? { ...y, name: u?.name || renameName.trim() } : y)));
      if (drawerPool?.id === renameFor.id) setDrawerPool({ ...drawerPool, name: renameName.trim() });
      setRenameFor(null); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doArchive = async (p: any) => {
    try {
      const u = unwrapObj(await talentApi.editPool(p.id, { status: 'Archived' }));
      setPools((x) => x.map((y) => (y.id === p.id ? { ...u, status: 'Archived' } : y)));
      if (drawerPool?.id === p.id) setDrawerPool({ ...drawerPool, status: 'Archived' });
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const removeStale = async (p: any) => {
    const stale = members.filter(staleOf);
    if (stale.length === 0) return;
    setBusy(true);
    try {
      for (const m of stale) { try { await talentApi.removeMember(p.id, m.id); } catch { /* keep going */ } }
      setOk(`Removed ${stale.length} stale profile(s).`);
      refreshMembers(p.id); syncAll();
    } finally { setBusy(false); }
  };
  const startOutreach = (emails: string[], label: string) => {
    const clean = [...new Set(emails.map((e) => String(e || '').trim()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))];
    if (clean.length === 0) { setError('No usable email addresses in this selection.'); return; }
    try { localStorage.setItem('nexa_outreach_recipients', JSON.stringify(clean)); } catch { /* private mode */ }
    setOk(`${clean.length} address(es) staged for outreach — ${label}.`);
    navigate('/employer/outreach');
  };
  const openMember = async (m: any) => {
    setMemberDetail(m); setMemberTab('profile'); setMemberApps([]); setMemberAppsLoading(true);
    const email = m.candidateEmail || m.candidate?.email || '';
    if (email) {
      try {
        const res: any = await apiClient.get(`/api/v1/applications?q=${encodeURIComponent(email)}&page=1&pageSize=50`);
        setMemberApps(unwrapList(res));
      } catch { setMemberApps([]); }
    }
    setMemberAppsLoading(false);
  };
  const doShortlist = async () => {
    if (!shortlistFor || !shortlistJob) return;
    setBusy(true); setError(''); setOk('');
    try {
      const out = unwrapObj(await talentApi.shortlistMember(shortlistFor.poolId || drawerPool?.id, shortlistFor.id, shortlistJob));
      setOk(`Shortlisted to ${shortlistJob} — application ${out?.application?.id || ''} created in pipeline.`);
      setShortlistFor(null); setShortlistJob('');
      if (drawerPool) refreshMembers(drawerPool.id);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const openShortlist = async (m: any, poolId: string) => {
    setShortlistFor({ ...m, poolId }); setShortlistJob('');
    try {
      const res: any = await apiClient.get('/api/v1/jobs?page=1&pageSize=100');
      setLiveJobs(unwrapList(res).filter((j: any) => j.status === 'Published'));
    } catch { setLiveJobs([]); }
  };
  const totals = { pools: pools.length, active: pools.filter((p) => p.status !== 'Archived').length, archived: pools.filter((p) => p.status === 'Archived').length, members: Object.values(counts).reduce((s, c) => s + c.total, 0), stale: Object.values(counts).reduce((s, c) => s + c.stale, 0) };
  const visible = pools
    .filter((p) => (statusTab === 'all' || (statusTab === 'archived' ? p.status === 'Archived' : p.status !== 'Archived')))
    .filter((p) => !search.trim() || `${p.name} ${p.id}`.toLowerCase().includes(search.trim().toLowerCase()));
  const membersVisible = members.filter((m) => {
    const s = memberFilter.trim().toLowerCase();
    if (!s) return true;
    return `${m.candidate?.name || ''} ${m.candidate?.roleTitle || ''} ${m.candidate?.location || ''} ${m.candidate?.skills || ''}`.toLowerCase().includes(s);
  });
  const skillMix = (() => {
    const map = new Map<string, number>();
    for (const m of members) for (const s of String(m.candidate?.skills || '').split(/[,;|]+/)) {
      const k = s.trim(); if (k.length >= 2) map.set(k, (map.get(k) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  })();
  const poolMenuItems = (p: any) => [
    { label: 'Open pool', onSelect: () => openDrawer(p) },
    { label: 'Add member', onSelect: () => { setAddPoolId(p.id); setShowAdd(true); } },
    { label: 'Rename', onSelect: () => { setRenameFor(p); setRenameName(p.name || ''); } },
    ...(p.status !== 'Archived' ? [{ label: 'Archive pool', danger: true as const, onSelect: () => doArchive(p) }] : []),
    { label: 'Delete pool…', danger: true as const, onSelect: () => doDeletePool(p) },
  ];
  const doDeletePool = async (p: any) => {
    if (!window.confirm(`Delete pool "${p.name || p.id}"? Pools with members archive instead of deleting.`)) return;
    setBusy(true); setError(''); setOk('');
    try {
      const res: any = await talentApi.deletePool(p.id);
      const updated = (res as any)?.data || p;
      if (updated?.status === 'Archived') {
        setPools((x) => x.map((y) => (y.id === p.id ? { ...y, status: 'Archived' } : y)));
        setOk(`Pool has members — archived instead of deleted.`);
      } else {
        setPools((x) => x.filter((y) => y.id !== p.id));
        setOk(`Pool ${p.id} deleted.`);
      }
      if (drawerPool?.id === p.id) setDrawerPool(null);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const [bulkJob, setBulkJob] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {([
          ['Pools', totals.pools, ''],
          ['Active', totals.active, 'text-emerald-700'],
          ['Members', totals.members, ''],
          ['Stale', totals.stale, totals.stale > 0 ? 'text-amber-700' : 'text-slate-400'],
          ['Archived', totals.archived, 'text-slate-500'],
        ] as const).map(([label, value, tone]) => (
          <div key={label} className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <span className={`text-base font-extrabold ${tone || 'text-slate-900'}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className={cardCls}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-extrabold text-slate-900">Talent pools — bench groups, members, pipeline</h3>
              <p className="text-xs text-slate-500 font-medium">Pools are reusable talent benches. Stale members have no profile on file — clean them up.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { setAddPoolId(drawerPool?.id || pools.find((p) => p.status !== 'Archived')?.id || ''); setShowAdd(true); }} className={btnDark}>+ Add member</button>
              <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New pool</button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Pool status">
              {([[ 'all', `All (${totals.pools})` ], [ 'active', `Active (${totals.active})` ], [ 'archived', `Archived (${totals.archived})` ]] as const).map(([v, label]) => (
                <button key={v} role="tab" aria-selected={statusTab === v} type="button" onClick={() => setStatusTab(v)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap ${statusTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>
              ))}
            </div>
            <div className="flex-1 min-w-[200px] max-w-sm">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pools by name or ID…" aria-label="Search pools"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
        {error && <PanelError message={error} status={loadError} onRetry={() => load()} />}
        {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold" role="status">{ok}</div>}
        {loading ? <InlineLoading message="Loading pools…" /> : visible.length === 0 ? (
          <EmptyState title="No pools" message="Create a talent pool to group shortlisted candidates." />
        ) : (<>
          <div className="space-y-2 md:hidden">
            {visible.map((p) => {
              const c = counts[p.id] || { total: 0, stale: 0 };
              return (
                <DrawerCard key={p.id} status={p.status === 'Archived' ? 'Archived' : 'Active'}
                  title={p.name || p.id} mono
                  meta={`${c.total} member${c.total === 1 ? '' : 's'}${c.stale > 0 ? ` • ${c.stale} stale` : ''} • ${p.owner || '—'}`}
                  right={<RowMenu label={`Manage ${p.id}`} items={poolMenuItems(p)} />} />
              );
            })}
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 sticky top-0 z-10"><tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="px-3 py-2.5">Pool</th><th className="px-3 py-2.5 text-right">Members</th><th className="px-3 py-2.5 text-right">Stale</th><th className="px-3 py-2.5">Status</th><th className="px-3 py-2.5">Owner</th><th className="px-3 py-2.5">Created</th><th className="px-3 py-2.5 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((p) => {
                  const c = counts[p.id] || { total: 0, stale: 0 };
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="px-3 py-2.5">
                        <button type="button" onClick={() => openDrawer(p)} className="text-left font-bold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-spec-electric cursor-pointer" title="Open pool">{p.name || p.id}</button>
                        <div className="font-mono text-[10px] text-slate-400">{p.id}</div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-extrabold">{c.total}</td>
                      <td className={`px-3 py-2.5 text-right font-extrabold ${c.stale > 0 ? 'text-amber-700' : 'text-slate-400'}`}>{c.stale || '—'}</td>
                      <td className="px-3 py-2.5"><span className={invPill(p.status === 'Archived' ? 'Void' : 'Paid')}>{p.status === 'Archived' ? 'Archived' : 'Active'}</span></td>
                      <td className="px-3 py-2.5 font-mono">{p.owner || '—'}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{p.createdAt ? String(p.createdAt).slice(0, 10) : '—'}</td>
                      <td className="px-3 py-2.5"><div className="flex justify-end"><RowMenu label={`Manage ${p.id}`} items={poolMenuItems(p)} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>)}
      </div>

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
        <div className="space-y-3">
          <Field label="Pool *"><Select value={addPoolId} onChange={setAddPoolId} placeholder="Select pool" options={pools.filter((p) => p.status !== 'Archived').map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }))} /></Field>
          <Field label="Find candidate *"><SearchSuggest value={addQuery} onChange={searchCandidates} placeholder="Type 2+ letters of name, role or skill…"
            items={addResults.map((c: any) => ({ key: String(c.id), query: String(c.name || c.id), title: String(c.name || c.id), meta: [c.roleTitle, c.location].filter(Boolean).join(' • ') }))}
            onPick={(it) => { setAddPick(it.key); setAddQuery(it.query ?? it.key); }} /></Field>
          {addPick && <div className="text-[11px] font-bold text-emerald-700">Selected: {addQuery} ({addPick})</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !addPoolId || !addPick} onClick={add} className={btnDark}>{busy ? 'Adding…' : 'Add member'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={renameFor !== null} onClose={() => setRenameFor(null)} title={`Rename pool — ${renameFor?.id || ''}`}>
        <div className="space-y-3">
          <Field label="Pool name *"><input className={kitInput} value={renameName} onChange={(e) => setRenameName(e.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setRenameFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !renameName.trim()} onClick={doRename} className={btnPrimary}>{busy ? 'Saving…' : 'Rename'}</button>
          </div>
        </div>
      </Modal>

      {drawerPool && (
        <DetailDrawer title={drawerPool.name || drawerPool.id} subtitle={`${drawerPool.id} • ${drawerPool.status === 'Archived' ? 'archived' : 'active'}`} onClose={() => { setDrawerPool(null); setMemberDetail(null); }}>
          <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Pool details">
            {([[ 'members', `Members (${members.length})` ], [ 'details', 'Details' ], [ 'analytics', 'Analytics' ]] as const).map(([v, label]) => (
              <button key={v} role="tab" aria-selected={poolTab === v} type="button" onClick={() => setPoolTab(v)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap ${poolTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
            ))}
          </div>
          {poolTab === 'members' && (
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap items-center">
                <button type="button" onClick={() => { setAddPoolId(drawerPool.id); setShowAdd(true); }} className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-[11px] cursor-pointer">+ Add member</button>
                <button type="button" disabled={busy || members.filter(staleOf).length === 0} onClick={() => removeStale(drawerPool)} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-[11px] disabled:opacity-40 cursor-pointer">Remove stale ({members.filter(staleOf).length})</button>
                <button type="button" onClick={() => startOutreach(members.map((m) => m.candidateEmail), `pool ${drawerPool.name}`)} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-[11px] cursor-pointer">Start outreach →</button>
                {members.length > 0 && (
                  <input value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)} placeholder="Filter members…" aria-label="Filter pool members"
                    className="ml-auto px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold outline-none focus:border-blue-500 w-40" />
                )}
              </div>
              {drawerPool?.status !== 'Archived' && members.length > 0 && (
                <div className="flex gap-2 flex-wrap items-center p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                  <span className="text-[11px] font-extrabold text-slate-700">Bulk shortlist visible ({membersVisible.filter((m) => !staleOf(m) && !m.applicationId).length}) →</span>
                  <input value={bulkJob} onChange={(e) => setBulkJob(e.target.value)} placeholder="Job ID (Published)" aria-label="Bulk shortlist job" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold outline-none w-44" />
                  <button type="button" disabled={bulkBusy || !bulkJob.trim()} onClick={async () => {
                    const ids = membersVisible.filter((m) => !staleOf(m) && !m.applicationId).map((m) => m.id);
                    if (ids.length === 0) { setError('No eligible visible members (stale or already in pipeline).'); return; }
                    setBulkBusy(true); setError(''); setOk('');
                    try {
                      const out: any = await talentApi.shortlistBulk(drawerPool.id, ids.slice(0, 50), bulkJob.trim());
                      const s = out?.data?.summary || out?.summary;
                      setOk(`Bulk shortlist: ${s?.created ?? '?'} created, ${s?.duplicates ?? '?'} duplicates, ${s?.errors ?? '?'} errors.`);
                      setBulkJob(''); refreshMembers(drawerPool.id); syncAll();
                    } catch (e) { setError(errMsg(e)); } finally { setBulkBusy(false); }
                  }} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] disabled:opacity-40 cursor-pointer">{bulkBusy ? 'Shortlisting…' : 'Shortlist visible'}</button>
                </div>
              )}
              {membersLoading ? <InlineLoading message="Loading members…" /> : members.length === 0 ? (
                <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200">No members yet — add from Talent Search.</div>
              ) : membersVisible.length === 0 ? (
                <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200">No members match this filter.</div>
              ) : membersVisible.map((m) => (
                <button key={m.id} type="button" onClick={() => openMember(m)} className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 text-left cursor-pointer transition">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${staleOf(m) ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-slate-900 text-[13px] leading-5 truncate">{m.candidate?.name || 'Unknown candidate'}</span>
                    <span className="block text-[11px] text-slate-500 font-medium truncate">{m.candidate ? `${m.candidate.roleTitle || '—'} • ${m.candidate.experienceYears ?? '—'}y • ${m.candidate.location || '—'}` : 'profile no longer on file'}</span>
                  </span>
                  {m.applicationId && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0B5FD9] border border-blue-200 font-bold text-[10px] shrink-0">in pipeline</span>}
                  {staleOf(m) && <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] shrink-0">stale</span>}
                </button>
              ))}
            </div>
          )}
          {poolTab === 'details' && (
            <KeyValues data={[
              ['Pool', drawerPool.name || '—'], ['Pool ID', drawerPool.id], ['Owner', drawerPool.owner || '—'],
              ['Status', <StatusPill value={drawerPool.status || 'Active'} />],
              ['Created', drawerPool.createdAt ? String(drawerPool.createdAt).slice(0, 10) : '—'],
              ['Description', drawerPool.description || '—'],
            ]} />
          )}
          {poolTab === 'analytics' && (
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-900">Skill mix across {members.length} member(s)</div>
              {skillMix.length === 0 ? <div className="text-[11px] text-slate-500">No skill data on file.</div> : skillMix.map(([s, n]) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="w-32 text-[11px] font-bold text-slate-600 truncate">{s}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-[#0B5FD9]" style={{ width: `${Math.round((n / Math.max(1, members.length)) * 100)}%` }} /></div>
                  <span className="w-8 text-right text-[11px] font-extrabold">{n}</span>
                </div>
              ))}
            </div>
          )}
        </DetailDrawer>
      )}
      {memberDetail && (
        <DetailDrawer title={memberDetail.candidate?.name || 'Unknown candidate'} subtitle={`${memberDetail.id} • ${memberDetail.candidate?.roleTitle || 'no profile'}`} onClose={() => setMemberDetail(null)}>
          <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Member">
            {([[ 'profile', 'Profile' ], [ 'pipeline', `Pipeline (${memberApps.length})` ], [ 'actions', 'Actions' ]] as const).map(([v, label]) => (
              <button key={v} role="tab" aria-selected={memberTab === v} type="button" onClick={() => setMemberTab(v)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap ${memberTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
            ))}
          </div>
          {memberTab === 'profile' && (
            staleOf(memberDetail)
              ? <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">Profile no longer on file — remove this member or re-add from Talent Search.</div>
              : <KeyValues data={[
                ['Name', memberDetail.candidate?.name || '—'], ['Role', memberDetail.candidate?.roleTitle || '—'],
                ['Experience', memberDetail.candidate?.experienceYears != null ? `${memberDetail.candidate.experienceYears} yrs` : '—'],
                ['Location', memberDetail.candidate?.location || '—'], ['Skills', memberDetail.candidate?.skills || '—'],
                ['Stage', memberDetail.candidate?.stage || '—'],
                ['Added by', memberDetail.addedBy || '—'], ['Added on', memberDetail.createdAt ? String(memberDetail.createdAt).slice(0, 10) : '—'],
              ]} />
          )}
          {memberTab === 'pipeline' && (
            <div className="space-y-1.5">
              {memberAppsLoading ? <InlineLoading message="Loading pipeline…" /> : memberApps.length === 0 ? (
                <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border">No applications in your org yet — shortlist them to a live job.</div>
              ) : memberApps.map((a: any) => (
                <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                  <span className="font-bold truncate">{a.jobTitle || a.jobId}</span>
                  <StatusPill value={a.stage} />
                </div>
              ))}
            </div>
          )}
          {memberTab === 'actions' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500">Pool: {drawerPool?.name || memberDetail.poolId} • Added by {memberDetail.addedBy || '—'}</div>
              <div className="flex gap-2 flex-wrap">
                {!staleOf(memberDetail) && <button type="button" onClick={() => openShortlist(memberDetail, memberDetail.poolId || drawerPool?.id)} className="px-4 py-2.5 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs cursor-pointer">Shortlist to job →</button>}
                <button type="button" onClick={() => startOutreach([memberDetail.candidateEmail], memberDetail.candidate?.name || 'member')} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs cursor-pointer">Start outreach →</button>
                <button type="button" onClick={() => setRemoveMember({ poolId: memberDetail.poolId || drawerPool?.id, memberId: memberDetail.id, label: memberDetail.candidate?.name || 'member' })} className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs cursor-pointer">Remove</button>
              </div>
              {memberDetail.applicationId && <div className="text-[11px] font-bold text-blue-700">Already in pipeline: {memberDetail.applicationId}</div>}
            </div>
          )}
        </DetailDrawer>
      )}
      <Modal open={shortlistFor !== null} onClose={() => setShortlistFor(null)} title={`Shortlist to job — ${shortlistFor?.candidate?.name || ''}`} subtitle="Creates an application in the ATS pipeline (audited)">
        <div className="space-y-3">
          <Field label="Live job *"><Select value={shortlistJob} onChange={setShortlistJob} placeholder="Select a published job" options={liveJobs.map((j: any) => ({ value: j.id, label: `${j.title} (${j.id})` }))} /></Field>
          {error && <PanelError message={error} onRetry={() => setError('')} />}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShortlistFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" disabled={busy || !shortlistJob} onClick={doShortlist} className={btnPrimary}>{busy ? 'Shortlisting…' : 'Shortlist'}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        open={removeMember !== null}
        title="Remove pool member"
        body={`Remove ${removeMember?.label || 'this candidate'} from the pool?`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (!removeMember) return;
          await talentApi.removeMember(removeMember.poolId, removeMember.memberId);
          setMembers((x) => x.filter((y) => y.id !== removeMember.memberId));
          if (memberDetail?.id === removeMember.memberId) setMemberDetail(null);
          setCounts((c) => ({ ...c, [removeMember.poolId]: { total: Math.max(0, (c[removeMember.poolId]?.total || 1) - 1), stale: c[removeMember.poolId]?.stale || 0 } }));
          setRemoveMember(null);
          syncAll();
        }}
        onCancel={() => setRemoveMember(null)}
      />
    </div>
  );
}

/* ---------------- Phase 2: Candidate search (tiered) ---------------- */

/* ---------- Talent match analysis (client-side v1) — required skills 60 ·
   preferred 15 · experience 15 · location 10. Full ATS engine lands later. ---------- */
function matchTokens(v: unknown): string[] {
  const s = Array.isArray(v) ? v.join(',') : String(v || '');
  return [...new Set(s.split(/[,;|\n]+/).map((t) => t.trim().toLowerCase()).filter((t) => t.length >= 2))].slice(0, 24);
}
function matchNum(v: unknown): number | null {
  const n = typeof v === 'number' ? v : (String(v ?? '').trim() === '' ? NaN : Number(v));
  return Number.isFinite(n) ? n : null;
}
function matchAnalysis(opts: { job: any | null; keywords: string[]; expMin: string; expMax: string; cand: any }): {
  score: number; skillMatched: string[]; skillMissing: string[]; expNote: string; locNote: string; best: string[]; gaps: string[];
  factors: { label: string; got: number; max: number }[]; verdict: string; nextSteps: string[];
} {
  const { job, keywords, expMin, expMax, cand } = opts;
  const skillBits = Array.isArray(cand?.skills) ? cand.skills : [];
  const corpus = [...skillBits.map((s: unknown) => String(s)), cand?.headline, cand?.roleTitle, cand?.summary, cand?.location,
    Array.isArray(cand?.education) ? cand.education.map((e: any) => `${e.institution || ''} ${e.qualification || ''}`).join(' ') : cand?.education].filter(Boolean).join(' ').toLowerCase();
  const req = job ? matchTokens(job.requiredSkills) : keywords.map((k) => k.toLowerCase()).filter((k) => k.length >= 2);
  const pref = job ? matchTokens(job.preferredSkills) : [];
  const mReq = req.filter((t) => corpus.includes(t));
  const mPref = pref.filter((t) => corpus.includes(t));
  const reqScore = req.length ? (mReq.length / req.length) * 60 : 30;
  const prefScore = pref.length ? (mPref.length / pref.length) * 15 : 7;
  const exp = matchNum(cand?.experienceYears);
  const emin = matchNum(job ? job.experienceMin : expMin);
  const emax = matchNum(job ? job.experienceMax : expMax);
  let expScore = 7; let expNote = 'experience unknown';
  if (exp !== null) {
    const lo = emin ?? exp; const hi = emax ?? exp;
    if (exp >= lo && exp <= hi) { expScore = 15; expNote = `${exp} yrs — in range`; }
    else if (exp >= lo - 1 && exp <= hi + 1) { expScore = 9; expNote = `${exp} yrs — close`; }
    else { expScore = 4; expNote = `${exp} yrs — outside range`; }
  }
  let locScore = 5; let locNote = 'no location basis';
  const jobLoc = String(job?.location || '').trim().toLowerCase();
  const candLoc = String(cand?.location || '').toLowerCase();
  if (jobLoc && candLoc) {
    if (candLoc.includes(jobLoc) || jobLoc.includes(candLoc)) { locScore = 10; locNote = 'location match'; }
    else { locScore = 2; locNote = 'different location'; }
  } else if (keywords.length && candLoc) {
    locNote = keywords.some((k) => candLoc.includes(k.toLowerCase())) ? 'location keyword match' : 'location unknown';
    locScore = locNote === 'location keyword match' ? 10 : 5;
  }
  const missing = [...req.filter((t) => !corpus.includes(t)), ...pref.filter((t) => !corpus.includes(t))].slice(0, 12);
  const best: string[] = [];
  if (mReq.length) best.push(`${mReq.length}/${req.length || 1} key skills match`);
  if (expScore >= 15) best.push('Experience in range');
  if (locScore >= 10) best.push('Location fit');
  const gaps: string[] = [];
  if (missing.length) gaps.push(`Missing: ${missing.slice(0, 6).join(', ')}`);
  if (expScore <= 4) gaps.push(expNote);
  if (locScore <= 2) gaps.push(locNote);
  const score = Math.max(0, Math.min(100, Math.round(reqScore + prefScore + expScore + locScore)));
  const factors = [
    { label: 'Required skills', got: Math.round(reqScore), max: 60 },
    { label: 'Preferred skills', got: Math.round(prefScore), max: 15 },
    { label: 'Experience', got: expScore, max: 15 },
    { label: 'Location', got: locScore, max: 10 },
  ];
  const verdict = score >= 80 ? 'Strong fit — shortlist now'
    : score >= 60 ? 'Good fit — interview to confirm the gaps'
    : score >= 40 ? 'Partial fit — probe the gaps first'
    : 'Weak fit for this role';
  const nextSteps: string[] = [];
  if (missing.length) nextSteps.push(`Screen for: ${missing.slice(0, 4).join(', ')}`);
  if (expScore <= 9) nextSteps.push('Align on seniority and compensation expectations early');
  if (locScore <= 5) nextSteps.push('Confirm work-location fit (relocation / remote)');
  if (score >= 60) nextSteps.push('Move to a technical interview round');
  return { score, skillMatched: [...mReq, ...mPref].slice(0, 12), skillMissing: missing, expNote, locNote, best, gaps, factors, verdict, nextSteps: nextSteps.slice(0, 4) };
}

export function CandidateSearchPanel() {
  const [q, setQ] = useQueryState('talent_q');
  const [tier, setTier] = useState('preview');
  const [f, setF] = useState({ skills: '', expMin: '', expMax: '', availability: '', resume: '' });
  // Multi-select facets (single-select: availability, resume). Option lists are
  // deduplicated case-insensitively so DB repeats never show twice.
  const [selDesg, setSelDesg] = useState<string[]>([]);
  const [selSkills, setSelSkills] = useState<string[]>([]);
  const [selLoc, setSelLoc] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>('designation');
  const [desgQ, setDesgQ] = useState('');
  const [skillQ, setSkillQ] = useState('');
  const [locQ, setLocQ] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [upgrade, setUpgrade] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [pools, setPools] = useState<any[]>([]);
  const [shortPool, setShortPool] = useState('');
  const [ok, setOk] = useState('');
  // Detail drawer (tabs) + per-job match
  const [detail, setDetail] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<'profile' | 'match' | 'shortlist'>('profile');
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [matchJobId, setMatchJobId] = useState('');
  const pageSize = 40;
  const debouncedQ = useDebouncedValue(q, 500);
  const normKey = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  const toggleSel = (list: string[], setList: (v: string[]) => void, label: string) => {
    const k = normKey(label);
    setList(list.some((x) => normKey(x) === k) ? list.filter((x) => normKey(x) !== k) : [...list, label]);
  };
  const advActive = Object.values(f).some((v) => String(v).trim() !== '') || selDesg.length > 0 || selSkills.length > 0 || selLoc.length > 0;
  const clearFilters = () => {
    setF({ skills: '', expMin: '', expMax: '', availability: '', resume: '' });
    setSelDesg([]); setSelSkills([]); setSelLoc([]);
    setDesgQ(''); setSkillQ(''); setLocQ('');
  };
  const buildParams = (p: number) => {
    const sp = new URLSearchParams({ tier, page: String(p), pageSize: String(pageSize) });
    if (q.trim()) sp.set('q', q.trim());
    if (selDesg.length) sp.set('designation', selDesg.join(', '));
    const skillBits = [f.skills.trim(), selSkills.join(', ')].filter(Boolean).join(', ');
    if (skillBits) sp.set('skills', skillBits);
    if (f.expMin !== '') sp.set('expMin', f.expMin);
    if (f.expMax !== '') sp.set('expMax', f.expMax);
    if (selLoc.length) sp.set('location', selLoc.join(', '));
    if (f.availability.trim()) sp.set('availability', f.availability.trim());
    if (f.resume) sp.set('resume', f.resume);
    return `?${sp.toString()}`;
  };
  const search = async (p = 1) => {
    setLoading(true); setError(''); setUpgrade(false); setOk('');
    try {
      const res: any = await talentApi.searchFull(buildParams(p));
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total ?? unwrapList(res).length));
      setPage(p);
    } catch (e: any) {
      setRows([]);
      if (e?.response?.data?.upgrade || e?.response?.status === 403) {
        setUpgrade(true);
        setError(e?.response?.data?.message || 'This tier is locked for your plan.');
      } else setError(errMsg(e));
    } finally { setLoading(false); }
  };
  useEffect(() => {
    if (debouncedQ.trim().length >= 2 || advActive) search(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, tier]);
  useEffect(() => {
    (async () => {
      try { setSkills(unwrapList(await documentsApi.skills())); }
      catch { /* suggestions best-effort */ }
      try { setPools(unwrapList(await talentApi.pools())); }
      catch { /* pools best-effort */ }
      try { setMyJobs(unwrapList(await jobsApi.list('?page=1&pageSize=100'))); }
      catch { /* job picker best-effort */ }
    })();
  }, []);
  // Contextual facets: derived from the CURRENT search results, so
  // designation/location options always reflect the keyword/job searched.
  // Deduped case-insensitively — DB repeats never show twice.
  const facetFrom = (pick: (c: any) => unknown): { label: string; count: number }[] => {
    const m = new Map<string, { label: string; count: number }>();
    for (const c of rows) {
      const label = String(pick(c) || '').trim();
      if (!label) continue;
      const k = label.toLowerCase().replace(/\s+/g, ' ');
      const e = m.get(k);
      if (e) e.count += 1; else m.set(k, { label, count: 1 });
    }
    return [...m.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, 80);
  };
  const desgFacets = useMemo(() => facetFrom((c) => c.roleTitle), [rows]);
  const locFacets = useMemo(() => facetFrom((c) => c.location), [rows]);
  const shortlist = async () => {
    if (!detail || !shortPool) return;
    try {
      await talentApi.addMember(shortPool, detail.id);
      setOk(`${detail.name || detail.id} shortlisted to pool.`);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const openDrawer = (c: any, tab: 'profile' | 'match' | 'shortlist' = 'profile') => {
    setDetail(c); setDetailTab(tab); setOk('');
    if (tab === 'shortlist' && pools.length > 0 && !shortPool) setShortPool(pools[0]?.id || '');
  };
  const skillOpts = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of skills) {
      const label = String((s as any)?.name || '').trim();
      if (!label) continue;
      const k = label.toLowerCase().replace(/\s+/g, ' ');
      if (!m.has(k)) m.set(k, label);
    }
    return [...m.values()].sort((a, b) => a.localeCompare(b));
  }, [skills]);
  const facetGroup = (id: string, title: string, count: number, body: React.ReactNode) => (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button type="button" onClick={() => setOpenGroup(openGroup === id ? null : id)} aria-expanded={openGroup === id}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
        <span className="text-xs font-extrabold text-slate-800">{title}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          {count > 0 && <span className="px-1.5 py-0.5 rounded-full bg-[#0B5FD9] text-white font-extrabold text-[10px]">{count}</span>}
          <span className="text-slate-400 text-xs">{openGroup === id ? '▴' : '▾'}</span>
        </span>
      </button>
      {openGroup === id && <div className="p-2.5 border-t border-slate-100">{body}</div>}
    </div>
  );
  const checkRow = (label: string, checked: boolean, onToggle: () => void, count?: number) => (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onToggle} className="w-4 h-4 accent-[#0B5FD9] shrink-0" />
      <span className="flex-1 min-w-0 text-xs font-semibold text-slate-800 truncate">{label}</span>
      {count !== undefined && <span className="text-[10px] font-bold text-slate-400 shrink-0">{count}</span>}
    </label>
  );
  const facetSearch = (value: string, onChange: (v: string) => void, ph: string) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph}
      className="w-full mb-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold outline-none focus:border-blue-500" />
  );
  return (
    <div className={cardCls}>
      <h3 className="text-base font-extrabold text-slate-900">Candidate Search (subscription-tiered)</h3>
      {error && !upgrade && <PanelError message={error} onRetry={() => search(page)} />}
      {upgrade && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
          <div className="font-extrabold">🔒 {tier === 'preview' ? 'Search' : tier} tier is locked — {error}</div>
          <div className="font-medium">Filters are preserved. Upgrade your plan to unlock {tier === 'contact' ? 'contact details' : 'full profiles'}; preview results below never include hidden data.</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => search(page)} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold">Retry</button>
            <button type="button" onClick={() => { setTier('preview'); }} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-bold">Fall back to preview</button>
          </div>
        </div>
      )}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 12).map((s: any) => (
            <button key={s.id} type="button" onClick={() => { setQ(s.name); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-spec-electric hover:text-spec-electric">
              {s.name}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); search(1); }} className="flex flex-col sm:flex-row gap-2">
        <SearchSuggest value={q} onChange={setQ} placeholder="Keyword, title, location…" ariaLabel="Keyword"
          items={rows.map((c: any) => ({ key: String(c.id), query: String(c.name || c.id), title: String(c.name || c.roleTitle || c.id), meta: [c.roleTitle, c.location].filter(Boolean).join(' • ') }))}
          onPick={(it) => setQ(it.query ?? it.key)} />
        <div style={{ maxWidth: 190 }}>
          <Select value={tier} onChange={setTier} ariaLabel="Access tier" options={[{ value: 'preview', label: 'Preview' }, { value: 'full', label: 'Full profile' }, { value: 'contact', label: 'Contact unlock' }]} />
        </div>
        <button type="button" onClick={() => setFilterOpen(true)} className={`px-4 py-2 rounded-xl border font-bold text-xs whitespace-nowrap ${advActive ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-700'}`}>
          Filters{(selDesg.length + selSkills.length + selLoc.length + Object.values(f).filter((v) => String(v).trim() !== '').length) > 0 ? ` • ${selDesg.length + selSkills.length + selLoc.length + Object.values(f).filter((v) => String(v).trim() !== '').length}` : ''} ▾
        </button>
        <button className={btnPrimary}>Search</button>
      </form>
      {(selDesg.length + selSkills.length + selLoc.length > 0 || Object.values(f).some((v) => String(v).trim() !== '')) && (
        <div className="flex flex-wrap gap-1.5">
          {selDesg.map((d) => (
            <button key={`d${d}`} type="button" onClick={() => setSelDesg(selDesg.filter((x) => x !== d))} className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px] hover:bg-blue-100">{d} ✕</button>
          ))}
          {selSkills.map((s) => (
            <button key={`s${s}`} type="button" onClick={() => setSelSkills(selSkills.filter((x) => x !== s))} className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px] hover:bg-emerald-100">{s} ✕</button>
          ))}
          {selLoc.map((l) => (
            <button key={`l${l}`} type="button" onClick={() => setSelLoc(selLoc.filter((x) => x !== l))} className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-bold text-[11px] hover:bg-violet-100">{l} ✕</button>
          ))}
          {f.skills.trim() && <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px]">Skills: {f.skills.trim()}</span>}
          {(f.expMin !== '' || f.expMax !== '') && <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px]">Exp: {f.expMin || '0'}–{f.expMax || '∞'} yrs</span>}
          {f.availability.trim() && <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px]">{f.availability.trim()}</span>}
          {f.resume && <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px]">{f.resume === 'yes' ? 'Has resume' : 'No resume'}</span>}
          <button type="button" onClick={clearFilters} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500 font-bold text-[11px] hover:bg-slate-50">Clear all</button>
        </div>
      )}
      <div className="text-[11px] font-bold text-slate-500">{total} result(s) • page {page} • tier: {tier}{tier !== 'preview' ? ' (quota-checked)' : ''}</div>
      {loading ? <InlineLoading message="Searching…" /> : rows.length === 0 ? (
        <EmptyState title="No results yet" message="Run a search. Locked tiers explain the upgrade path instead of leaking data." />
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">{rows.map((c) => (
          <DrawerCard key={c.id} title={<>{c.name || c.roleTitle} {c.contactLocked && <span className="text-amber-600 text-[11px] font-bold">(contact locked)</span>}</>}
            meta={`${c.roleTitle || '—'} • ${c.experienceYears ?? '—'}y • ${c.location || '—'}`}
            right={<RowMenu label="Candidate actions" items={[
              { label: 'View full profile', onSelect: () => openDrawer(c, 'profile') },
              { label: 'Match analysis', onSelect: () => openDrawer(c, 'match') },
              ...(pools.length > 0 ? [{ label: 'Shortlist to pool…', onSelect: () => openDrawer(c, 'shortlist') }] : []),
            ]} />}>
            <div className="text-[11px] text-slate-500 font-medium truncate">{c.email || 'email hidden'}</div>
            <button type="button" onClick={() => openDrawer(c, 'profile')} className="mt-1.5 w-full px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-700 transition">View profile →</button>
          </DrawerCard>
        ))}</div>
        <Pager page={page} total={total} pageSize={pageSize} onPage={(p) => search(p)} />
        </>
      )}
      {/* Filter sidebar — small animated slide-over with accordion groups */}
      <div aria-hidden="true" onClick={() => setFilterOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-200 ${filterOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <aside role="dialog" aria-label="Candidate filters"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="shrink-0 px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Filters</div>
            <div className="text-[11px] text-slate-500 font-medium">
              {(selDesg.length + selSkills.length + selLoc.length + Object.values(f).filter((v) => String(v).trim() !== '').length) || 'No'} filters selected
            </div>
          </div>
          <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" data-lenis-prevent>
          {facetGroup('designation', 'Designation', selDesg.length, (
            <>
              {facetSearch(desgQ, setDesgQ, 'Search designations…')}
              <div className="space-y-0.5 max-h-52 overflow-y-auto">
                {desgFacets.length === 0 && <div className="text-[11px] text-slate-500 font-medium px-2 py-1.5">Run a search first — options come from the matching candidates.</div>}
                {desgFacets.filter((d) => d.label.toLowerCase().includes(desgQ.trim().toLowerCase())).map((d) => (
                  <div key={normKey(d.label)}>{checkRow(d.label, selDesg.some((x) => normKey(x) === normKey(d.label)), () => toggleSel(selDesg, setSelDesg, d.label), d.count)}</div>
                ))}
              </div>
            </>
          ))}
          {facetGroup('skills', 'Skills', selSkills.length + (f.skills.trim() ? 1 : 0), (
            <>
              {facetSearch(skillQ, setSkillQ, 'Search skills…')}
              <input value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} placeholder="Custom skills (comma separated)…"
                className="w-full mb-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold outline-none focus:border-blue-500" />
              <div className="space-y-0.5 max-h-52 overflow-y-auto">
                {skillOpts.filter((s) => s.toLowerCase().includes(skillQ.trim().toLowerCase())).map((s) => (
                  <div key={normKey(s)}>{checkRow(s, selSkills.some((x) => normKey(x) === normKey(s)), () => toggleSel(selSkills, setSelSkills, s))}</div>
                ))}
                {skillOpts.length === 0 && <div className="text-[11px] text-slate-500 font-medium px-2 py-1.5">No skills taxonomy loaded yet.</div>}
              </div>
            </>
          ))}
          {facetGroup('location', 'Location', selLoc.length, (
            <>
              {facetSearch(locQ, setLocQ, 'Search locations…')}
              <div className="space-y-0.5 max-h-52 overflow-y-auto">
                {locFacets.length === 0 && <div className="text-[11px] text-slate-500 font-medium px-2 py-1.5">Run a search first — options come from the matching candidates.</div>}
                {locFacets.filter((l) => l.label.toLowerCase().includes(locQ.trim().toLowerCase())).map((l) => (
                  <div key={normKey(l.label)}>{checkRow(l.label, selLoc.some((x) => normKey(x) === normKey(l.label)), () => toggleSel(selLoc, setSelLoc, l.label), l.count)}</div>
                ))}
              </div>
            </>
          ))}
          {facetGroup('experience', 'Experience', (f.expMin !== '' || f.expMax !== '') ? 1 : 0, (
            <div className="flex gap-2">
              <input type="number" min={0} placeholder="Min yrs" value={f.expMin} aria-label="Min experience" onChange={(e) => setF({ ...f, expMin: e.target.value })}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none" />
              <input type="number" min={0} placeholder="Max yrs" value={f.expMax} aria-label="Max experience" onChange={(e) => setF({ ...f, expMax: e.target.value })}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none" />
            </div>
          ))}
          {facetGroup('availability', 'Availability', f.availability ? 1 : 0, (
            <div className="flex flex-wrap gap-1.5">
              {['Immediate', '15 days', '30 days', '60 days', '90 days'].map((a) => (
                <button key={a} type="button" onClick={() => setF({ ...f, availability: f.availability === a ? '' : a })}
                  className={`px-2.5 py-1.5 rounded-lg border font-bold text-[11px] transition ${f.availability === a ? 'bg-[#0B5FD9] text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>{a}</button>
              ))}
            </div>
          ))}
          {facetGroup('resume', 'Resume', f.resume ? 1 : 0, (
            <div className="flex flex-wrap gap-1.5">
              {[{ v: '', l: 'Any' }, { v: 'yes', l: 'Has resume' }, { v: 'no', l: 'No resume' }].map((o) => (
                <button key={o.l} type="button" onClick={() => setF({ ...f, resume: o.v })}
                  className={`px-2.5 py-1.5 rounded-lg border font-bold text-[11px] transition ${f.resume === o.v ? 'bg-[#0B5FD9] text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>{o.l}</button>
              ))}
            </div>
          ))}
        </div>
        <div className="shrink-0 px-4 py-3 border-t border-slate-200 flex gap-2">
          <button type="button" onClick={clearFilters} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Clear all</button>
          <button type="button" onClick={() => { setFilterOpen(false); search(1); }} className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs">Show results</button>
        </div>
      </aside>
      {detail && (
        <DetailDrawer title={detail.name || detail.roleTitle || detail.id} subtitle={`${detail.roleTitle || ''} • ${detail.id}`} onClose={() => setDetail(null)} width="max-w-4xl">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${drawerTone(detail.contactLocked ? 'Pending' : 'Active').card}`}>
            <span aria-hidden="true" className="w-11 h-11 rounded-xl bg-slate-900 text-white font-extrabold text-base flex items-center justify-center shrink-0">
              {String(detail.name || detail.roleTitle || '?').trim().charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-slate-900 text-sm truncate">{detail.name || detail.roleTitle}</div>
              <div className="text-[11px] text-slate-500 font-medium truncate">
                {detail.roleTitle || '—'} • {detail.experienceYears ?? '—'}y • {detail.location || '—'} • {detail.email || 'email hidden'}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="px-2 py-0.5 rounded-full bg-white/70 border border-slate-200 font-bold text-[11px] capitalize">{tier}</span>
                {detail.contactLocked
                  ? <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">contact locked</span>
                  : <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">contact visible</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5" role="tablist" aria-label="Candidate detail">
            {([['profile', 'Profile'], ['match', 'Match analysis'], ['shortlist', 'Shortlist']] as const).map(([v, label]) => (
              <button key={v} role="tab" aria-selected={detailTab === v} type="button" onClick={() => setDetailTab(v)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-[11px] border transition ${detailTab === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
          </div>
          {detailTab === 'profile' && (
            <div className="space-y-3">
              <KeyValues data={[
                ['Contact', detail.email || (detail.contactLocked ? 'Locked — unlock via Contact tier' : '—')],
                ['Availability', detail.availability || detail.noticePeriod || '—'],
                ['Expected CTC', detail.expectedCtc || '—'],
                ['Experience', detail.experienceYears != null ? `${detail.experienceYears} yrs` : '—'],
                ['Location', detail.location || '—'],
                ['Resume', detail.resumeRef ? `On file (v${detail.resumeVersion || 1})` : 'Not uploaded'],
                ['Freshness', String(detail.updatedAt || detail.createdAt || '').slice(0, 10) || '—'],
                ['Source', detail.source || '—'],
              ]} />
              {detail.summary && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Summary</div>
                  <div className="text-xs font-medium text-slate-800 mt-1">{detail.summary}</div>
                </div>
              )}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Skills</div>
                {tier === 'preview' && !detail.skills
                  ? <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-amber-50 border border-amber-200">Skills hidden in preview tier — switch to Full profile for skill-level detail.</div>
                  : <div className="flex flex-wrap gap-1.5">{(Array.isArray(detail.skills) ? detail.skills : String(detail.skills || '').split(',')).map((s: unknown) => String(s).trim()).filter(Boolean).map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{s}</span>
                  ))}</div>}
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Education</div>
                {Array.isArray(detail.education) && detail.education.length > 0 ? (
                  <DrawerList items={detail.education} empty="No education on file."
                    render={(e: any, i: number) => (
                      <DrawerCard key={i} title={typeof e === 'string' ? e : (e.institution || 'Education')}
                        meta={typeof e === 'string' ? undefined : (`${e.qualification || ''}${e.year ? ` — ${e.year}` : ''}` || undefined)} />
                    )} />
                ) : <div className="text-[11px] text-slate-500 font-medium">{typeof detail.education === 'string' ? detail.education : 'No education on file.'}</div>}
              </div>
            </div>
          )}
          {detailTab === 'match' && (
            <div className="space-y-3">
              <div className="w-full">
                <Select value={matchJobId} onChange={setMatchJobId} ariaLabel="Match against job"
                  options={[{ value: '', label: 'Current search keywords' }, ...myJobs.map((j: any) => ({ value: j.id, label: `${j.title || j.id} (${j.id})` }))]} />
              </div>
              {(() => {
                const job = myJobs.find((j: any) => j.id === matchJobId) || null;
                const keywords = q.trim().toLowerCase().split(/\s+/).filter((k) => k.length >= 2);
                const a = matchAnalysis({ job, keywords, expMin: f.expMin, expMax: f.expMax, cand: detail });
                const bar = a.score >= 75 ? 'bg-emerald-500' : a.score >= 50 ? 'bg-amber-500' : 'bg-slate-400';
                return (
                  <div className="space-y-3">
                    <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
                      <div className={`text-3xl font-extrabold ${a.score >= 75 ? 'text-emerald-300' : a.score >= 50 ? 'text-amber-300' : 'text-slate-300'}`}>{a.score}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-300">Match score vs {job ? (job.title || job.id) : 'search keywords'}</div>
                        <div className="mt-1.5 h-2 rounded-full bg-white/15 overflow-hidden">
                          <div className={`h-full rounded-full ${bar}`} style={{ width: `${a.score}%` }} />
                        </div>
                        <div className="text-[10px] font-bold mt-1 text-slate-400">skills 60 · preferred 15 · experience 15 · location 10</div>
                      </div>
                    </div>
                    {tier === 'preview' && !detail.skills && (
                      <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-amber-50 border border-amber-200">Skill-level matching is limited in preview tier (skills hidden) — Full profile unlocks precise skill analysis.</div>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl border text-xs font-extrabold ${a.score >= 80 ? 'bg-emerald-50/70 border-emerald-200/70 text-emerald-900' : a.score >= 60 ? 'bg-blue-50/70 border-blue-200/70 text-blue-900' : a.score >= 40 ? 'bg-amber-50/70 border-amber-200/70 text-amber-900' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                      {a.verdict}
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Score factors</div>
                      <div className="space-y-1.5">
                        {a.factors.map((ft) => (
                          <div key={ft.label} className="flex items-center gap-2">
                            <span className="w-28 shrink-0 text-[11px] font-bold text-slate-600 truncate">{ft.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full bg-[#0B5FD9]" style={{ width: `${ft.max ? Math.round((ft.got / ft.max) * 100) : 0}%` }} />
                            </div>
                            <span className="w-12 shrink-0 text-right text-[11px] font-extrabold text-slate-800">{ft.got}/{ft.max}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 px-0.5">Skills ({a.skillMatched.length} matched)</div>
                      {(a.skillMatched.length > 0 || a.skillMissing.length > 0) ? (
                        <div className="flex flex-wrap gap-1.5">
                          {a.skillMatched.map((t) => <span key={`m${t}`} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">✓ {t}</span>)}
                          {a.skillMissing.map((t) => <span key={`x${t}`} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[11px]">{t}</span>)}
                        </div>
                      ) : <div className="text-[11px] text-slate-500 font-medium">No skill basis to compare — pick a job with required skills.</div>}
                    </div>
                    <KeyValues data={[
                      ['Experience', a.expNote],
                      ['Location', a.locNote],
                    ]} />
                    {a.best.length > 0 && (
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Why this fits</div>
                        {a.best.map((b) => <div key={b} className="text-xs font-bold text-emerald-900">✓ {b}</div>)}
                      </div>
                    )}
                    {a.gaps.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Gaps & suggestions</div>
                        {a.gaps.map((g) => <div key={g} className="text-xs font-bold text-amber-900">• {g}</div>)}
                      </div>
                    )}
                    {a.nextSteps.length > 0 && (
                      <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">Suggested next steps</div>
                        {a.nextSteps.map((s, i) => <div key={s} className="text-xs font-bold text-blue-900">{i + 1}. {s}</div>)}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          {detailTab === 'shortlist' && (
            <div className="space-y-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-0.5">Talent pool * — the candidate joins the selected pool</div>
              {pools.length === 0
                ? <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-slate-200">No talent pools yet — create one under Talent Pools first, then shortlist here.</div>
                : (
                  <div className="space-y-1.5">
                    {pools.map((p: any) => (
                      <button key={p.id} type="button" onClick={() => setShortPool(p.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left text-xs transition ${shortPool === p.id ? 'bg-blue-50/70 border-blue-300 shadow-[0_1px_2px_rgba(15,23,42,0.06)]' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <span aria-hidden="true" className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${shortPool === p.id ? 'border-[#0B5FD9]' : 'border-slate-300'}`}>
                          {shortPool === p.id && <span className="w-2 h-2 rounded-full bg-[#0B5FD9]" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-bold text-slate-900 truncate">{p.name}</span>
                          <span className="block text-[10px] text-slate-500 font-medium font-mono">{p.id}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setDetailTab('profile')} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Back</button>
                <button type="button" disabled={!shortPool || pools.length === 0} onClick={shortlist} className="px-4 py-2.5 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs disabled:opacity-50">Shortlist to pool</button>
              </div>
            </div>
          )}
        </DetailDrawer>
      )}
    </div>
  );
}

/* ---------------- Phase 2/3: Offers & placements ---------------- */
export function OffersPlacementsPanel() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [openOffers, setOpenOffers] = useState<any[]>([]);
  const [withdrawFor, setWithdrawFor] = useState<any>(null);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawBusy, setWithdrawBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [offer, setOffer] = useState({ applicationId: '', ctc: '', payPeriod: 'annual', joinDate: '', letterMode: 'generate' as 'generate' | 'upload', letterRef: '' });
  const [offerStep, setOfferStep] = useState(1);
  const [offerApp, setOfferApp] = useState<any>(null);
  const [offerFile, setOfferFile] = useState('');
  const [place, setPlace] = useState({ applicationId: '', joinDate: '', feeBasis: '' });
  const [placeApp, setPlaceApp] = useState<any>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [showPlace, setShowPlace] = useState(false);
  const resetOffer = () => { setOffer({ applicationId: '', ctc: '', payPeriod: 'annual', joinDate: '', letterMode: 'generate', letterRef: '' }); setOfferStep(1); setOfferApp(null); setOfferFile(''); };
  const [placeDetail, setPlaceDetail] = useState<any>(null);
  const [offerLetter, setOfferLetter] = useState<any>(null);
  const [offerLetterBusy, setOfferLetterBusy] = useState(false);
  const openOfferLetter = async (p: any) => {
    setOfferLetterBusy(true);
    try {
      const d = unwrapObj(await offersPlacementsApi.offerLetter(p.id));
      setOfferLetter(d);
    } catch (e) { setError(errMsg(e)); } finally { setOfferLetterBusy(false); }
  };
  const offerLetterHtml = (d: any) => {
    const ctc = Number(d.offer?.ctc || d.placement?.feeBasis || 0);
    const period = d.offer?.payPeriod || 'annual';
    const annual = period === 'annual' ? ctc : period === 'monthly' ? ctc * 12 : ctc * 2080;
    const basic = Math.round(annual * 0.4), hra = Math.round(basic * 0.4), flex = Math.max(0, annual - basic - hra);
    const monthly = (n: number) => `₹${Math.round(n / 12).toLocaleString('en-IN')}`;
    const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
    const PAGE = '<div style="page-break-before: always;"></div>';
    return sanitizeHtml(`
    <h2>Offer of Employment</h2>
    <p>Ref: ${escHtml(d.placement?.id || d.offer?.id || '')} &nbsp;•&nbsp; Date: ${escHtml(String(d.generatedAt || '').slice(0, 10))}</p>
    <p>Dear <strong>${escHtml(d.candidate?.name || d.candidate?.email || '')}</strong>,</p>
    <p>On behalf of <strong>${escHtml(d.organization?.legalName || '')}</strong>, we are pleased to offer you the position of <strong>${escHtml(d.job?.title || '')}</strong>${d.job?.location ? `, based at ${escHtml(d.job.location)}` : ''}. Your employment type is <strong>${escHtml(d.job?.employmentType || 'Full-time')}</strong> with an expected joining date of <strong>${escHtml(String(d.offer?.joinDate || d.placement?.joinDate || '').slice(0, 10))}</strong>.</p>
    <h3>1 &nbsp;•&nbsp; Compensation summary</h3>
    <table><tr><th>Component</th><th>Amount</th></tr>
    <tr><td>Cost to Company (${escHtml(period)})</td><td><strong>${money(ctc)} ${escHtml(period === 'annual' ? 'per annum' : `per ${period}`)}</strong></td></tr>
    ${period !== 'annual' ? `<tr><td>Annualised equivalent</td><td>${money(annual)} per annum</td></tr>` : `<tr><td>Monthly equivalent</td><td>${monthly(annual)} per month</td></tr>`}
    <tr><td>Placement ref</td><td>${escHtml(d.placement?.id || '')}</td></tr>
    <tr><td>Offer ref</td><td>${escHtml(d.offer?.id || '')}</td></tr></table>
    <p>This offer is subject to successful completion of document verification and background checks. Please confirm acceptance within 7 days of receipt.</p>
    ${PAGE}
    <h2>Annexure A — Compensation breakup (indicative, annualised)</h2>
    <table><tr><th>Head</th><th>Annual</th><th>Monthly</th></tr>
    <tr><td>Basic salary (40%)</td><td>${money(basic)}</td><td>${monthly(basic)}</td></tr>
    <tr><td>House Rent Allowance</td><td>${money(hra)}</td><td>${monthly(hra)}</td></tr>
    <tr><td>Special / flexible allowance</td><td>${money(flex)}</td><td>${monthly(flex)}</td></tr>
    <tr><td><strong>Total CTC</strong></td><td><strong>${money(annual)}</strong></td><td><strong>${monthly(annual)}</strong></td></tr></table>
    <p>Statutory deductions (PF, ESI, professional tax, TDS) apply as per prevailing law. Gratuity, where eligible, is payable per the Payment of Gratuity Act in addition to the CTC above.</p>
    ${PAGE}
    <h2>Annexure B — Role, duties &amp; working terms</h2>
    <h3>2 &nbsp;•&nbsp; Role &amp; reporting</h3>
    <p>You will perform the duties of <strong>${escHtml(d.job?.title || '')}</strong> and such other duties as may reasonably be assigned by your reporting manager. Your normal place of work is <strong>${escHtml(d.job?.location || 'as assigned')}</strong>, with remote / hybrid arrangements only where confirmed in writing.</p>
    <h3>3 &nbsp;•&nbsp; Probation &amp; working hours</h3>
    <p>• You will serve a probation period of 6 months, extendable by up to 3 months at management discretion. • Standard working hours are 9:00–18:00 IST, Monday–Friday, with reasonable additional effort during releases. • Leave accrues per company policy shared on joining.</p>
    ${PAGE}
    <h2>Annexure C — Confidentiality, IP &amp; termination</h2>
    <h3>4 &nbsp;•&nbsp; Confidentiality &amp; intellectual property</h3>
    <p>• You agree to hold all company and client confidential information in strict confidence during and after employment. • All work product, code, designs and inventions created in the course of employment vest exclusively in the company.</p>
    <h3>5 &nbsp;•&nbsp; Notice &amp; termination</h3>
    <p>• Either party may terminate confirmed employment with 30 days' written notice (15 days during probation), or salary in lieu thereof. • The company may terminate immediately for misconduct, breach of confidentiality, or failed verification. • A ${Number(d.terms?.replacementDays ?? 90)}-day replacement assurance applies to this placement under the NexaTalent commercial terms.</p>
    ${PAGE}
    <h2>Acceptance &amp; checklist</h2>
    <p>I accept the above terms and confirm my joining on <strong>${escHtml(String(d.offer?.joinDate || d.placement?.joinDate || '').slice(0, 10))}</strong>.</p>
    <p>Signature: ____________________ &nbsp;&nbsp; Name: ${escHtml(d.candidate?.name || '')} &nbsp;&nbsp; Date: __________</p>
    <h3>Documents to carry on joining day</h3>
    <p>• Photo ID + address proof • Education &amp; experience letters • Relieving letter (if applicable) • PAN + bank details for payroll</p>
    <p>For the company: ____________________ &nbsp;&nbsp; Date: __________</p>
    <div class="terms"><h3>Commercial note (internal)</h3><p>• Fees between the company and NexaTalent are governed by the commercial agreement${d.terms?.hiringType ? ` (${escHtml(d.terms.hiringType)}${d.terms?.rate !== null && d.terms?.rate !== undefined ? ` @ ${Number(d.terms.rate)}%` : ''})` : ''}. • Payment within ${Number(d.terms?.paymentTermsDays ?? 30)} days of joining.</p></div>`);
  };
  const [feeMatch, setFeeMatch] = useState<any>(null);
  const [feeBusy, setFeeBusy] = useState(false);
  const [placeConfirm, setPlaceConfirm] = useState(false);
  const checkFee = async () => {
    if (!place.applicationId.trim()) { setError('Application ID is required.'); return; }
    setFeeBusy(true); setError(''); setFeeMatch(null);
    try {
      const m = unwrapObj(await offersPlacementsApi.matchFee(place.applicationId.trim(), Number(place.feeBasis) || undefined));
      setFeeMatch(m);
      if (!place.feeBasis && m?.preview) setPlace((p) => ({ ...p, feeBasis: String(m.preview.feeBasis || '') }));
    } catch (e) { setError(errMsg(e)); } finally { setFeeBusy(false); }
  };
  const load = async () => {
    try { setPlacements(unwrapList(await offersPlacementsApi.placements())); }
    catch (e) { setError(errMsg(e)); }
    try { setOpenOffers(unwrapList(await offersPlacementsApi.offers())); }
    catch { /* candidates/agencies have no employer inbox — placements still render */ }  };
  useEffect(() => { load(); }, []);
  const offerLetterRef = () => (offer.letterRef.trim() || offerFile).trim();
  const offerValid = offer.applicationId.trim() !== '' && Number(offer.ctc) > 0 && (offer.letterMode === 'generate' || offerLetterRef() !== '');
  const doWithdraw = async () => {
    if (!withdrawFor || !withdrawReason.trim()) { setError('Withdraw reason required (audit).'); return; }
    setWithdrawBusy(true); setError('');
    try {
      await offersPlacementsApi.withdrawOffer(withdrawFor.id, withdrawReason.trim());
      setOpenOffers((x) => x.map((o) => (o.id === withdrawFor.id ? { ...o, status: 'Withdrawn' } : o)));
      setOk(`Offer ${withdrawFor.id} withdrawn — you can now issue a corrected offer.`);
      setWithdrawFor(null); setWithdrawReason('');
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setWithdrawBusy(false); }
  };
  const issue = async (e?: React.FormEvent) => {
    e?.preventDefault(); setError(''); setOk('');
    if (!offerValid) { setError(offer.applicationId.trim() === '' ? 'Pick a candidate application first.' : Number(offer.ctc) <= 0 ? 'Enter the offered CTC.' : 'Upload the company letter or switch to Generate.'); return; }
    try {
      await offersPlacementsApi.offer({
        applicationId: offer.applicationId.trim(), ctc: Number(offer.ctc) || 0, payPeriod: offer.payPeriod,
        joinDate: offer.joinDate || undefined,
        offerLetterMode: offer.letterMode === 'upload' ? 'uploaded' : 'generated',
        offerLetterRef: offer.letterMode === 'upload' ? offerLetterRef() : undefined,
      });
      setOk(`Offer issued${offer.letterMode === 'upload' ? ` with uploaded letter (${offerLetterRef()})` : ' with NexaTalent generated letter'}.`);
      resetOffer();
      setShowOffer(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const mark = async () => {
    setError(''); setOk('');
    try {
      const p = unwrapObj(await offersPlacementsApi.place(place.applicationId, place.joinDate || undefined, Number(place.feeBasis) || 0));
      if (p?.id) setPlacements((x) => [p, ...x]);
      setOk(`Placement recorded — commission auto-minted under agreement ${p?.agreementId || ''}.`);
      setPlace({ applicationId: '', joinDate: '', feeBasis: '' }); setFeeMatch(null); setPlaceApp(null);
      setShowPlace(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">Offers & Placements</h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setPlace({ applicationId: '', joinDate: '', feeBasis: '' }); setPlaceApp(null); setFeeMatch(null); setShowPlace(true); }} className={btnDark}>Record joining</button>
          <button type="button" onClick={() => { resetOffer(); setShowOffer(true); }} className={btnPrimary}>Issue offer</button>
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {openOffers.filter((o) => o.status === 'Issued').length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-700">Open offers ({openOffers.filter((o) => o.status === 'Issued').length}) — withdraw to re-issue</div>
          {openOffers.filter((o) => o.status === 'Issued').slice(0, 20).map((o) => (
            <div key={o.id} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="min-w-0">
                <span className="font-mono font-bold">{o.id}</span>
                <span className="text-slate-600 font-medium"> • {o.candidateEmail} • {o.jobId} • ₹{Number(o.ctc || 0).toLocaleString('en-IN')}</span>
              </div>
              <button type="button" onClick={() => { setWithdrawFor(o); setWithdrawReason(''); }} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold text-[11px]">Withdraw…</button>
            </div>
          ))}
        </div>
      )}
      {withdrawFor && (
        <Modal open={!!withdrawFor} onClose={() => { setWithdrawFor(null); setWithdrawReason(''); }} title={`Withdraw offer ${withdrawFor.id}`} subtitle="Frees the application for a corrected re-issue. Audited.">
          <div className="space-y-3">
            <Field label="Reason *"><input className={kitInput} value={withdrawReason} onChange={(e) => setWithdrawReason(e.target.value)} placeholder="e.g. CTC typo — re-issuing corrected letter" /></Field>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setWithdrawFor(null); setWithdrawReason(''); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
              <button type="button" disabled={withdrawBusy || !withdrawReason.trim()} onClick={doWithdraw} className={btnDark}>{withdrawBusy ? 'Withdrawing…' : 'Withdraw offer'}</button>
            </div>
          </div>
        </Modal>
      )}
      <Modal open={showOffer} onClose={() => { setShowOffer(false); resetOffer(); }} title="Issue offer" subtitle="3 steps — candidate, compensation, then the offer letter" wide>
        <div className="space-y-4">
          <ol className="flex items-center gap-1 text-[11px] font-extrabold" aria-label="Offer progress">
            {['Candidate', 'Compensation', 'Offer letter'].map((s, i) => {
              const n = i + 1; const done = offerStep > n; const cur = offerStep === n;
              return (
                <li key={s} className="flex items-center gap-1 flex-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-emerald-600 text-white' : cur ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>{done ? '✓' : n}</span>
                  <span className={cur ? 'text-slate-900' : 'text-slate-500'}>{s}</span>
                  {n < 3 ? <span className="flex-1 h-px bg-slate-200 mx-1" /> : null}
                </li>
              );
            })}
          </ol>
          {offerStep === 1 && (
            <div className="space-y-3">
              <Field label="Candidate / application *"><ApplicationPicker value={offer.applicationId} onChange={(v) => { setOffer({ ...offer, applicationId: v }); if (!v.trim()) setOfferApp(null); }} onPick={(a) => { setOfferApp(a); setOffer((o) => ({ ...o, applicationId: a.id || o.applicationId })); }} /></Field>
              {offerApp ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="font-extrabold text-slate-900">{offerApp.candidateName || offerApp.candidateEmail} <span className="font-mono font-medium text-slate-500">• {offerApp.id}</span></div>
                  <div className="font-medium text-slate-600">{offerApp.jobTitle || offerApp.jobId || ''}{offerApp.orgId ? ` • ${offerApp.orgId}` : ''}</div>
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {(offerApp.source || offerApp.sourceType || '').toLowerCase().includes('agenc') || offerApp.submittedBy
                      ? <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">Via agency{offerApp.submittedBy ? ` • ${offerApp.submittedBy}` : ''}</span>
                      : <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Direct hire</span>}
                    <span className={tonePill(offerApp.stage)}>{offerApp.stage}</span>
                  </div>
                </div>
              ) : <div className="text-[11px] text-slate-500 font-medium">Search and pick the application — agency vs direct is detected automatically.</div>}
            </div>
          )}
          {offerStep === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Offered CTC *"><input className={kitInput} type="number" min={0} value={offer.ctc} onChange={(e) => setOffer({ ...offer, ctc: e.target.value })} placeholder="e.g. 1800000" /></Field>
                <Field label="Pay period"><Select value={offer.payPeriod} onChange={(v) => setOffer({ ...offer, payPeriod: v })} options={[{ value: 'annual', label: 'Annual CTC' }, { value: 'monthly', label: 'Monthly (contract)' }, { value: 'hourly', label: 'Hourly (contract)' }]} /></Field>
                <Field label="Joining date"><DatePicker value={offer.joinDate} onChange={(v) => setOffer({ ...offer, joinDate: v })} /></Field>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 text-[11px] font-medium text-blue-900">
                Full-time → enter <strong>annual</strong> CTC. Contract / contract-to-hire → enter the <strong>monthly</strong> rate and pick Monthly above — the joining fee basis follows the same convention.
                {offer.ctc && Number(offer.ctc) > 0 ? <span className="block mt-1 font-bold">Preview: ₹{Number(offer.ctc).toLocaleString('en-IN')} {offer.payPeriod === 'annual' ? 'per annum' : `per ${offer.payPeriod}`} {offer.payPeriod === 'annual' ? `(≈ ₹${Math.round(Number(offer.ctc) / 12).toLocaleString('en-IN')}/mo)` : ''}</span> : null}
              </div>
            </div>
          )}
          {offerStep === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button type="button" onClick={() => setOffer({ ...offer, letterMode: 'generate' })}
                  className={`text-left p-3.5 rounded-2xl border-2 transition ${offer.letterMode === 'generate' ? 'border-[#0B5FD9] bg-blue-50/60' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="text-xs font-extrabold text-slate-900">✨ Generate with NexaTalent</div>
                  <div className="text-[11px] text-slate-600 font-medium mt-1">Full 5-section letter, auto-filled with candidate, role, CTC and terms. Recommended.</div>
                </button>
                <button type="button" onClick={() => setOffer({ ...offer, letterMode: 'upload' })}
                  className={`text-left p-3.5 rounded-2xl border-2 transition ${offer.letterMode === 'upload' ? 'border-[#0B5FD9] bg-blue-50/60' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="text-xs font-extrabold text-slate-900">📎 Upload company letter</div>
                  <div className="text-[11px] text-slate-600 font-medium mt-1">Direct hires on company letterhead — attach your own PDF/DOC.</div>
                </button>
              </div>
              {offer.letterMode === 'upload' ? (
                <div className="space-y-2">
                  <Field label="Letter file (PDF / DOC / DOCX) *">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setOfferFile(f.name); setOffer((o) => ({ ...o, letterRef: o.letterRef || f.name })); } }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:font-bold file:text-[11px]" />
                  </Field>
                  <div className="text-[11px] text-slate-500 font-medium">The file stays on your device — we record <strong>{offerLetterRef() || 'the filename'}</strong> as the letter reference on the offer.</div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-900">
                  The generated letter opens after issuing (Print / Save PDF, Download .doc) and stays attached to the placement.
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between gap-2 pt-1 border-t border-slate-100">
            <button type="button" onClick={() => { setShowOffer(false); resetOffer(); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs mt-3">Cancel</button>
            <div className="flex gap-2 mt-3">
              {offerStep > 1 ? <button type="button" onClick={() => setOfferStep((s) => s - 1)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">← Back</button> : null}
              {offerStep < 3
                ? <button type="button" disabled={offerStep === 1 && !offer.applicationId.trim()} onClick={() => setOfferStep((s) => s + 1)} className={btnPrimary}>Continue →</button>
                : <button type="button" disabled={!offerValid} onClick={() => issue()} className={btnPrimary}>Issue offer{offer.ctc && Number(offer.ctc) > 0 ? ` — ₹${Number(offer.ctc).toLocaleString('en-IN')}` : ''}</button>}
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={showPlace} onClose={() => { setShowPlace(false); setFeeMatch(null); setPlaceApp(null); }} title="Record joining" subtitle="Resolves the agreement, previews the fee, then mints placement + commission">
        <div className="space-y-3">
          <Field label="Candidate / application *"><ApplicationPicker value={place.applicationId} onChange={(v) => { setPlace({ ...place, applicationId: v }); setFeeMatch(null); if (!v.trim()) setPlaceApp(null); }} onPick={(a) => { setPlaceApp(a); setPlace((p) => ({ ...p, applicationId: a.id || p.applicationId })); }} /></Field>
          {placeApp ? (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-extrabold text-slate-900">{placeApp.candidateName || placeApp.candidateEmail} <span className="font-mono font-medium text-slate-500">• {placeApp.id}</span></div>
              <div className="font-medium text-slate-600">{placeApp.jobTitle || placeApp.jobId || ''}</div>
              <div className="flex gap-1.5 flex-wrap pt-0.5">
                {(placeApp.source || placeApp.sourceType || '').toLowerCase().includes('agenc') || placeApp.submittedBy
                  ? <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">Via agency</span>
                  : <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Direct hire</span>}
                <span className={tonePill(placeApp.stage)}>{placeApp.stage}</span>
              </div>
            </div>
          ) : null}
          <Field label="Joining date"><DatePicker value={place.joinDate} onChange={(v) => setPlace({ ...place, joinDate: v })} /></Field>
          <Field label="Fee basis — annual CTC, or monthly CTC for contract hires (auto-filled from offer)">
            <input className={kitInput} type="number" value={place.feeBasis} onChange={(e) => { setPlace({ ...place, feeBasis: e.target.value }); setFeeMatch(null); }} placeholder="e.g. 1800000 annual • 150000 monthly" />
          </Field>
          <button type="button" disabled={feeBusy} onClick={checkFee} className={btnDark}>{feeBusy ? 'Checking…' : 'Check fee…'}</button>
          {feeMatch?.preview && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold space-y-1">
              <div>Agreement {feeMatch.agreement?.id} • {feeMatch.agreement?.hiringType} @ {feeMatch.agreement?.rate}%{feeMatch.preview.basisType === 'monthly_ctc' ? ` • monthly × ${feeMatch.preview.months} mo` : ' • annual'}</div>
              <div>Basis ₹{Number(feeMatch.preview.feeBasis).toLocaleString('en-IN')} → gross ₹{Number(feeMatch.preview.gross).toLocaleString('en-IN')} + GST ₹{Number(feeMatch.preview.tax).toLocaleString('en-IN')} = <strong>₹{Number(feeMatch.preview.total).toLocaleString('en-IN')}</strong></div>
              <div className="font-medium text-emerald-800">Payable within {feeMatch.preview.paymentTermsDays} days of joining • {feeMatch.preview.replacementDays}-day replacement</div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowPlace(false); setFeeMatch(null); setPlaceApp(null); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button type="button" disabled={!place.applicationId.trim()} onClick={() => setPlaceConfirm(true)} className={btnDark}>Review & record joining{feeMatch?.preview ? ` — ₹${Number(feeMatch.preview.total).toLocaleString('en-IN')}` : ''}</button>
          </div>
        </div>
      </Modal>
      <ActionConfirm
        open={placeConfirm}
        onCancel={() => setPlaceConfirm(false)}
        title={`Record joining — ${place.applicationId || ''}`}
        subtitle={feeMatch?.agreement ? `${feeMatch.agreement.hiringType} @ ${feeMatch.agreement.rate}%` : 'Fee preview not checked yet'}
        why={feeMatch?.preview ? ['Covering agreement resolved and fee computed', 'Placement mints the commission automatically'] : ['Recording without a fee check — the server still validates the agreement and basis']}
        steps={['Placement recorded, application → Hired', 'Commission auto-minted from the agreement', 'Company + superadmin notified in-app', feeMatch?.agreement?.autoApprove ? 'Trusted agreement: commission auto-approved and first invoice auto-generated' : 'Finance approves the commission, then generates the invoice']}
        consequences={['Hired is terminal for the application', 'Fee becomes billable under the agreement terms']}
        confirmLabel="Record joining"
        tone="dark"
        onConfirm={async () => { await mark(); setPlaceConfirm(false); }}
      />
      <div className="text-xs font-extrabold text-slate-700">Placements ({placements.length})</div>
      {placements.length === 0 ? <div className="text-xs text-slate-500">No joinings recorded yet.</div> : (<>
        <div className="space-y-2 md:hidden">
          {placements.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{p.candidateEmail}</div>
                  <div className="font-mono text-[11px] text-slate-500">{p.id} • {p.jobId}</div>
                </div>
                <RowMenu label={`Placement ${p.id}`} items={[
                  { label: 'View detail', onSelect: () => setPlaceDetail(p) },
                  { label: 'Offer letter…', onSelect: () => openOfferLetter(p) },
                ]} />
              </div>
              <div className="font-bold text-slate-700">joined {String(p.joinDate).slice(0, 10)} • basis ₹{Number(p.feeBasis || 0).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[860px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Placement</th><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Job</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3 text-right">Fee basis</th><th className="px-4 py-3">Agreement</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {placements.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold">{p.id}</td>
                  <td className="px-4 py-3">{p.candidateEmail}</td>
                  <td className="px-4 py-3 font-mono">{p.jobId}</td>
                  <td className="px-4 py-3">{String(p.joinDate).slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right font-bold">₹{Number(p.feeBasis || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-mono">{p.agreementId || '—'}</td>
                  <td className="px-4 py-3"><div className="flex justify-end"><RowMenu label={`Placement ${p.id}`} items={[
                    { label: 'View detail', onSelect: () => setPlaceDetail(p) },
                    { label: 'Offer letter…', onSelect: () => openOfferLetter(p) },
                  ]} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      {placeDetail !== null && (
        <DetailDrawer title={`Placement ${placeDetail.id}`} subtitle={`${placeDetail.candidateEmail || ''} → ${placeDetail.jobId || ''} • joined ${String(placeDetail.joinDate || '').slice(0, 10)}`} onClose={() => setPlaceDetail(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[['Candidate', placeDetail?.candidateEmail], ['Job', placeDetail?.jobId], ['Application', placeDetail?.applicationId], ['Organization', placeDetail?.orgId], ['Joined', String(placeDetail?.joinDate || '').slice(0, 10)], ['Fee basis', `₹${Number(placeDetail?.feeBasis || 0).toLocaleString('en-IN')}`], ['Agreement', placeDetail?.agreementId || '—'], ['Auto-invoiced', placeDetail?.autoInvoiced || '—']].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
            ))}
          </div>
          <PlacementLinks placement={placeDetail} />
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" disabled={offerLetterBusy} onClick={() => openOfferLetter(placeDetail)} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">{offerLetterBusy ? 'Loading…' : 'Offer letter…'}</button>
          </div>
        </DetailDrawer>
      )}
      <Modal open={offerLetter !== null} onClose={() => setOfferLetter(null)} title={`Offer letter — ${offerLetter?.placement?.id || ''}`} subtitle={`${offerLetter?.candidate?.name || offerLetter?.candidate?.email || ''} • ${offerLetter?.job?.title || ''} • ${offerLetter?.offer?.offerLetterMode === 'uploaded' ? `Uploaded: ${offerLetter?.offer?.offerLetterRef || 'company letter'}` : 'NexaTalent generated (5 sections)'}`} wide>
        <div className="space-y-3">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs leading-relaxed max-h-[52vh] overflow-y-auto" data-lenis-prevent
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(offerLetter ? offerLetterHtml(offerLetter) : '') }} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => offerLetter && downloadDocFile(`Offer-letter-${offerLetter.placement?.id || 'placement'}`, 'Offer letter', offerLetterHtml(offerLetter))} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Download .doc (Word)</button>
            <button type="button" onClick={() => offerLetter && printHtmlDocument('Offer letter', offerLetterHtml(offerLetter))} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Print / Save PDF</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- Phase 3: Outreach ---------------- */
const OUTREACH_TEMPLATES = [
  { id: 'role-intro', name: 'Role intro — opportunity', subject: 'Exciting {{role}} opportunity at {{company}}', body: 'Hi {{name}},\n\nWe came across your profile and think you could be a strong fit for a {{role}} role we are hiring for ({{location}} • {{experience}}). Would you be open to a quick intro call this week?\n\n— {{sender}}' },
  { id: 'followup', name: 'Follow-up nudge', subject: 'Following up — {{role}} role', body: 'Hi {{name}},\n\nJust bumping my last note about the {{role}} opening. Happy to share salary band, stack and interview loop upfront if helpful.\n\n— {{sender}}' },
  { id: 'interview-invite', name: 'Interview invite', subject: 'Interview invite — {{role}} @ {{company}}', body: 'Hi {{name}},\n\nWe would love to invite you for a first conversation for {{role}}. Please share two slots that work for you and we will lock the calendar.\n\n— {{sender}}' },
  { id: 'custom', name: 'Custom (free text)', subject: '', body: '' },
];

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export function OutreachPanel() {
  const [camps, setCamps] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [quota, setQuota] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [retryBusy, setRetryBusy] = useState('');
  // list chrome — same pattern as pools / leads (tabs + search + suggest)
  const [q, setQ] = useQueryState('out_q');
  const dq = useDebounced(q);
  const [statusTab, setStatusTab] = useState<'all' | 'Queued' | 'Sent' | 'failed'>('all');
  // compose
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', template: 'role-intro' });
  const [templateBody, setTemplateBody] = useState(OUTREACH_TEMPLATES[0].body);
  const [selected, setSelected] = useState<string[]>([]);
  const [recQ, setRecQ] = useState('');
  const [manual, setManual] = useState('');
  const [pools, setPools] = useState<any[]>([]);
  const [poolPick, setPoolPick] = useState('');
  const [contacts, setContacts] = useState<{ email: string; name: string; src: string }[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  // detail drawer + tabs
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState('overview');
  const [detQ, setDetQ] = useState('');
  const [detStatus, setDetStatus] = useState('');
  const dDq = useDebounced(detQ);

  const load = async () => {
    try { setCamps(unwrapList(await billingApi.campaigns())); }
    catch (e) { setError(errMsg(e)); }
    try {
      const u: any = await billingApi.usage();
      const usage = (u as { data?: any })?.data?.usage || {};
      setQuota(usage['outreach.monthly_limit'] || usage['outreach.send'] || usage['outreach'] || null);
    } catch { /* quota best-effort */ }
  };

  const loadContacts = async () => {
    setContactsLoading(true);
    try {
      const rows = unwrapList(await talentApi.pools());
      setPools(rows);
      if (!poolPick && rows.length > 0) setPoolPick(rows.find((p: any) => p.status !== 'Archived')?.id || rows[0]?.id || '');
      const byEmail = new Map<string, { email: string; name: string; src: string }>();
      await Promise.all(rows.slice(0, 20).map(async (p: any) => {
        try {
          const ms = unwrapList(await talentApi.poolMembers(p.id));
          for (const m of ms) {
            const email = String(m.candidateEmail || m.candidate?.email || '').trim();
            if (!isEmail(email)) continue;
            const k = email.toLowerCase();
            if (!byEmail.has(k)) byEmail.set(k, { email, name: String(m.candidate?.name || m.candidate?.roleTitle || ''), src: `Pool • ${p.name || p.id}` });
          }
        } catch { /* pool best-effort */ }
      }));
      try {
        const apps = unwrapList(await applicationsApi.list('?page=1&pageSize=100'));
        for (const a of apps) {
          const email = String(a.candidateEmail || '').trim();
          if (!isEmail(email)) continue;
          const k = email.toLowerCase();
          if (!byEmail.has(k)) byEmail.set(k, { email, name: String(a.candidateName || a.jobTitle || ''), src: `Pipeline • ${a.jobTitle || a.jobId || ''}` });
        }
      } catch { /* pipeline best-effort */ }
      setContacts([...byEmail.values()].slice(0, 500));
    } catch { /* contacts best-effort */ }
    finally { setContactsLoading(false); }
  };

  useEffect(() => {
    load();
    loadContacts();
    // Pool handoff: Talent Pools stages recipient emails here, then navigates over.
    try {
      const raw = localStorage.getItem('nexa_outreach_recipients');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          const clean = [...new Set(list.map((s: any) => String(s || '').trim()).filter(isEmail))];
          setSelected(clean);
          setOk(`${clean.length} recipient(s) staged from Talent Pools — review and send.`);
          setShowCompose(true);
        }
        localStorage.removeItem('nexa_outreach_recipients');
      }
    } catch { /* handoff best-effort */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTemplatePreset = (id: string) => {
    setForm((f) => ({ ...f, template: id }));
    const t = OUTREACH_TEMPLATES.find((x) => x.id === id);
    if (t && id !== 'custom') {
      if (!form.subject.trim() && t.subject) setForm((f) => ({ ...f, subject: t.subject }));
      setTemplateBody(t.body);
    }
  };

  const addEmails = (emails: string[]) => {
    const clean = emails.map((s) => String(s || '').trim()).filter(isEmail).map((s) => s.toLowerCase());
    if (clean.length === 0) return;
    setSelected((prev) => {
      const have = new Set(prev.map((s) => s.toLowerCase()));
      const next = [...prev];
      for (const e of clean) {
        if (!have.has(e)) { have.add(e); next.push(emails.find((x) => String(x).trim().toLowerCase() === e) || e); }
      }
      return next;
    });
  };
  const removeEmail = (email: string) => setSelected((prev) => prev.filter((s) => s.toLowerCase() !== email.toLowerCase()));
  const addManual = () => {
    const bits = manual.split(/[\n,;\s]+/).map((s) => s.trim()).filter(Boolean);
    const bad = bits.filter((b) => !isEmail(b));
    if (bad.length > 0) { setError(`Invalid email(s): ${bad.slice(0, 3).join(', ')}.`); return; }
    addEmails(bits);
    setManual('');
  };
  const addPoolMembers = async () => {
    if (!poolPick) return;
    setBusy(true);
    try {
      const ms = unwrapList(await talentApi.poolMembers(poolPick));
      const emails = ms.map((m: any) => String(m.candidateEmail || m.candidate?.email || '')).filter(isEmail);
      if (emails.length === 0) { setError('No usable emails in this pool.'); return; }
      addEmails(emails);
      setOk(`Added ${emails.length} email(s) from pool.`);
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  const recMatches = (() => {
    const needle = recQ.trim().toLowerCase();
    const picked = new Set(selected.map((s) => s.toLowerCase()));
    const base = contacts.filter((c) => !picked.has(c.email.toLowerCase()));
    if (!needle) return base.slice(0, 7);
    return base.filter((c) => `${c.email} ${c.name} ${c.src}`.toLowerCase().includes(needle)).slice(0, 7);
  })();

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    const recipients = [...new Set(selected.map((s) => s.trim()).filter(Boolean))];
    if (!recipients.length) { setError('Search and select at least one recipient — or paste emails below.'); return; }
    const bad = recipients.filter((r) => !isEmail(r));
    if (bad.length > 0) { setError(`Invalid email(s): ${bad.slice(0, 3).join(', ')}.`); return; }
    if (quota?.remaining !== undefined && recipients.length > quota.remaining) { setError(`Only ${quota.remaining} outreach email(s) left in quota — remove ${recipients.length - quota.remaining} or upgrade.`); return; }
    setBusy(true);
    try {
      const tpl = form.template === 'custom' ? templateBody : `${OUTREACH_TEMPLATES.find((t) => t.id === form.template)?.name || form.template}\n\n${templateBody}`;
      const c = unwrapObj(await billingApi.outreach({ name: form.name, subject: form.subject, template: tpl, recipients }));
      if (c?.id) setCamps((x) => [c, ...x]);
      setOk(`Campaign queued to ${recipients.length} recipient(s) — quota deducted idempotently.`);
      setForm({ name: '', subject: '', template: 'role-intro' });
      setTemplateBody(OUTREACH_TEMPLATES[0].body);
      setSelected([]);
      setRecQ('');
      setManual('');
      setShowCompose(false);
      load();
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  const openDetail = async (id: string) => {
    setDetail(null); setDetailTab('overview'); setDetQ(''); setDetStatus(''); setDetailLoading(true);
    try { setDetail(unwrapObj(await billingApi.campaignDetail(id))); }
    catch (e) { setError(errMsg(e)); }
    finally { setDetailLoading(false); }
  };
  const retry = async (id: string) => {
    setRetryBusy(id);
    try {
      const updated = unwrapObj(await billingApi.retryCampaign(id));
      if (updated?.id) {
        setCamps((x) => x.map((c) => (c.id === id ? { ...c, status: updated.status } : c)));
        if (detail?.id === id) openDetail(id);
        setOk(`Requeued ${updated.requeued ?? 0} failed recipient(s).`);
        syncAll();
      }
    } catch (e) { setError(errMsg(e)); } finally { setRetryBusy(''); }
  };

  const totals = {
    camps: camps.length,
    recipients: camps.reduce((s, c) => s + Number(c.total || 0), 0),
    queued: camps.filter((c) => c.status === 'Queued').length,
    failed: camps.filter((c) => c.status === 'Failed').length,
  };
  const visible = camps
    .filter((c) => (statusTab === 'all' ? true : statusTab === 'failed' ? Number((c as any).failed ?? 0) > 0 || c.status === 'Failed' : c.status === statusTab))
    .filter((c) => !dq.trim() || `${c.name || ''} ${c.subject || ''} ${c.id || ''} ${c.status || ''}`.toLowerCase().includes(dq.trim().toLowerCase()));

  const detRecipients: any[] = detail?.recipients || [];
  const detEvents: any[] = detail?.events || [];
  const detFiltered = detRecipients.filter((r: any) => {
    if (detStatus && r.status !== detStatus) return false;
    if (!dDq.trim()) return true;
    return String(r.email || '').toLowerCase().includes(dDq.trim().toLowerCase());
  });
  const detStats = detail?.stats || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {([
          ['Campaigns', totals.camps, 'total sends'],
          ['Recipients', totals.recipients, 'emails queued'],
          ['Queued', totals.queued, 'in flight'],
          ['Need retry', totals.failed, 'failed campaigns'],
          ['Quota left', quota?.remaining ?? '—', quota ? `used ${quota.used ?? 0}/${quota.limit ?? '—'}` : 'monthly limit'],
        ] as const).map(([label, value, sub]) => (
          <div key={label} className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{label}</div>
            <div className="text-2xl font-extrabold text-slate-900">{value}</div>
            <div className="text-[11px] font-bold text-slate-500">{sub}</div>
          </div>
        ))}
      </div>

      <div className={cardCls}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Campaign status">
            {([['all', 'All'], ['Queued', 'Queued'], ['Sent', 'Sent'], ['failed', 'Needs retry']] as const).map(([v, label]) => (
              <button key={v} role="tab" aria-selected={statusTab === v} type="button" onClick={() => setStatusTab(v)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${statusTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {quota && (
              <span className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-extrabold text-slate-700 whitespace-nowrap">
                {quota.used ?? 0}/{quota.limit ?? '—'}{quota.remaining !== undefined ? ` • ${quota.remaining} left` : ''}
              </span>
            )}
            <ExportButton filename="outreach-campaigns.csv" rows={visible.map((c: any) => ({ id: c.id, name: c.name, subject: c.subject, status: c.status, total: c.total, createdAt: String(c.createdAt || '').slice(0, 10) }))} columns={['id', 'name', 'subject', 'status', 'total', 'createdAt']} />
            <button type="button" onClick={() => { setShowCompose(true); }} className={btnPrimary}>+ New campaign</button>
          </div>
        </div>

        <CrudToolbar
          search={q} onSearch={setQ} searchPh="Search campaigns by name, subject or ID…"
          suggest={{ items: camps, getTitle: (c: any) => String(c.name || c.id), getMeta: (c: any) => `${c.id} • ${c.total || 0} recipient(s)`, getStatus: (c: any) => c.status, getQuery: (c: any) => String(c.name || c.id) }}
        />

        {error && <PanelError message={error} onRetry={load} />}
        {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}

        {visible.length === 0 ? <EmptyState title="No campaigns" message={camps.length === 0 ? 'Compose your first quota-guarded outreach campaign.' : 'Nothing matches this filter — clear search or switch tabs.'} /> : (
          <div className="space-y-2">{visible.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition">
              <button type="button" onClick={() => openDetail(c.id)} className="flex-1 min-w-0 text-left cursor-pointer" title="Open delivery drawer">
                <div className="font-extrabold text-slate-900 text-sm truncate">{c.name || 'Untitled campaign'} <span className="font-mono text-[11px] text-slate-400">{c.id}</span></div>
                <div className="text-[11px] text-slate-500 font-medium truncate">{c.total || 0} recipient(s) • {String(c.createdAt || '').slice(0, 10)} • {String(c.subject || 'no subject').slice(0, 80)}</div>
              </button>
              <StatusPill value={c.status} />
              <RowMenu label={`Manage ${c.id}`} items={[
                { label: 'Open delivery drawer', onSelect: () => openDetail(c.id) },
                { label: 'Retry failed', onSelect: () => retry(c.id) },
              ]} />
            </div>
          ))}</div>
        )}
      </div>

      <Modal open={showCompose} onClose={() => setShowCompose(false)} title="New outreach campaign" subtitle="Search & select recipients — quota is checked and deducted idempotently" wide>
        <form onSubmit={send} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Campaign name *"><input className={kitInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Oct outreach 01" /></Field>
          <Field label="Subject *"><input className={kitInput} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Backend role @ Acme" /></Field>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Template *">
              <Select value={form.template} onChange={applyTemplatePreset} options={OUTREACH_TEMPLATES.map((t) => ({ value: t.id, label: t.name }))} />
            </Field>
            <div className="text-[11px] font-bold text-slate-500 self-end pb-1">Tokens: {'{{name}} {{role}} {{company}} {{location}} {{sender}}'}</div>
          </div>
          <div className="sm:col-span-2"><Field label="Template body" hint="Stored with the campaign; personalised per recipient on send"><textarea className={kitInput} rows={4} value={templateBody} onChange={(e) => setTemplateBody(e.target.value)} placeholder="Hi {{name}}, …" /></Field></div>

          <div className="sm:col-span-2 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Recipients ({selected.length})</span>
              <span className="text-[11px] font-bold text-slate-500">{contactsLoading ? 'Loading pools & pipeline…' : `${contacts.length} searchable`}{quota?.remaining !== undefined ? ` • ${quota.remaining} quota left` : ''}</span>
            </div>
            <div className="p-3.5 space-y-3">
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#0B5FD9] border border-blue-200 font-bold text-[11px]">
                      {s}
                      <button type="button" onClick={() => removeEmail(s)} aria-label={`Remove ${s}`} className="hover:text-red-600 font-extrabold">✕</button>
                    </span>
                  ))}
                  <button type="button" onClick={() => setSelected([])} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500 font-bold text-[11px]">Clear all</button>
                </div>
              )}
              <Field label="Search pools & pipeline">
                <SearchSuggest value={recQ} onChange={setRecQ} placeholder={contacts.length > 0 ? 'Type 2+ letters of name, email or pool…' : 'Loading contacts… type to filter once ready'}
                  items={contacts.map((c) => ({ key: c.email, query: c.email, title: c.name ? `${c.name} — ${c.email}` : c.email, meta: c.src, status: 'Selected' }))}
                  onPick={(it) => { addEmails([it.key]); setRecQ(''); }} />
              </Field>
              {recQ.trim().length >= 2 && recMatches.length > 0 && (
                <div className="space-y-1.5">
                  {recMatches.map((c) => (
                    <button key={c.email} type="button" onClick={() => addEmails([c.email])}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:border-blue-300 text-left transition">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-slate-900 text-xs truncate">{c.name ? `${c.name} — ` : ''}{c.email}</span>
                        <span className="block text-[10px] text-slate-500 font-medium truncate">{c.src}</span>
                      </span>
                      <span className="text-[11px] font-extrabold text-[#0B5FD9] shrink-0">+ Add</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Add whole pool">
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0"><Select value={poolPick} onChange={setPoolPick} placeholder="Select pool" options={pools.filter((p: any) => p.status !== 'Archived').map((p: any) => ({ value: p.id, label: `${p.name} (${p.id})` }))} /></div>
                    <button type="button" onClick={addPoolMembers} disabled={busy || !poolPick} className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-[11px] disabled:opacity-40 shrink-0">Add all</button>
                  </div>
                </Field>
                <Field label="Paste emails manually" hint="Comma / space / newline separated — Enter to add">
                  <div className="flex gap-2">
                    <input className={kitInput} value={manual} onChange={(e) => setManual(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addManual(); } }} placeholder="name@company.com, …" />
                    <button type="button" onClick={addManual} disabled={!manual.trim()} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-[11px] disabled:opacity-40 shrink-0">Add</button>
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {quota?.remaining !== undefined && (
            <div className="sm:col-span-2 text-[11px] font-bold text-slate-500">
              This send will consume {selected.length} of your remaining {quota.remaining} outreach email(s).
            </div>
          )}
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowCompose(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy || selected.length === 0}>{busy ? 'Queueing…' : `Queue to ${selected.length} recipient(s)`}</button>
          </div>
        </form>
      </Modal>

      {(detail !== null || detailLoading) && (
        <DetailDrawer title={detail?.name || 'Campaign'} subtitle={detail ? `${detail.id} • ${detail.status} • ${String(detail.createdAt || '').slice(0, 10)}` : 'Loading…'} onClose={() => setDetail(null)} width="max-w-4xl">
          {detailLoading ? <InlineLoading message="Loading delivery stats…" /> : detail ? (
            <div className="space-y-4 text-xs">
              <DetailTabs tabs={[
                { key: 'overview', label: 'Overview' },
                { key: 'recipients', label: 'Recipients', count: detRecipients.length },
                { key: 'activity', label: 'Activity', count: detEvents.length },
              ]} active={detailTab} onPick={setDetailTab} />
              {detailTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[['Total', detStats.total ?? detail.total ?? 0], ['Queued', detStats.Queued ?? 0], ['Sent', detStats.Sent ?? 0], ['Failed', detStats.Failed ?? 0]].map(([k, v]) => (
                      <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <div className="text-lg font-extrabold text-slate-900">{String(v)}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div>
                      </div>
                    ))}
                  </div>
                  <KeyValues data={[
                    ['Campaign', detail.name || '—'],
                    ['Status', <StatusPill value={detail.status} />],
                    ['Subject', detail.subject || '—'],
                    ['Template', <span className="whitespace-pre-wrap">{String(detail.template || '—').slice(0, 400)}</span>],
                    ['Queued by', detail.createdBy || '—'],
                    ['Date', detail.createdAt ? String(detail.createdAt).slice(0, 10) : '—'],
                  ]} />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => retry(detail.id)} disabled={retryBusy === detail.id} className={btnDark}>{retryBusy === detail.id ? 'Requeueing…' : 'Retry failed'}</button>
                  </div>
                </div>
              )}
              {detailTab === 'recipients' && (
                <div className="space-y-2">
                  <CrudToolbar search={detQ} onSearch={setDetQ} searchPh="Search recipient emails…" status={detStatus} onStatus={setDetStatus} statuses={['Queued', 'Sent', 'Failed']} />
                  <DrawerList items={detFiltered} empty="No recipients match this filter." label="Delivery"
                    render={(r: any) => (
                      <DrawerCard key={r.id} status={r.status} title={r.email} meta={r.retriedAt ? `retried ${String(r.retriedAt).slice(0, 10)}` : r.id} right={<StatusPill value={r.status} />} />
                    )} />
                </div>
              )}
              {detailTab === 'activity' && (
                <DrawerList items={detEvents} empty="No delivery events yet." label="Timeline"
                  render={(ev: any) => (
                    <DrawerCard key={ev.id} status={ev.event?.includes('fail') ? 'Failed' : ev.event?.includes('retry') ? 'Pending' : 'Sent'}
                      title={`${ev.event} — ${ev.email}`} meta={`${ev.id} • ${String(ev.createdAt || '').slice(0, 16).replace('T', ' ')}`} />
                  )} />
              )}
            </div>
          ) : <EmptyState title="Not found" message="This campaign may have been removed." />}
        </DetailDrawer>
      )}
    </div>
  );
}

/** Print only the document: isolated print window with corporate styling. */
export function printHtmlDocument(title: string, bodyHtml: string) {
  const safeTitle = String(title || 'Document').replace(/[<>&"]/g, '').slice(0, 160) || 'Document';
  const safeBody = sanitizeHtml(bodyHtml);
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>${safeTitle}</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:32px;max-width:800px;margin:0 auto;}h2{margin:0 0 4px;}h3{margin:18px 0 6px;border-bottom:2px solid #111;padding-bottom:4px;}table{border-collapse:collapse;width:100%;margin:8px 0;}th,td{border:1px solid #999;padding:6px 8px;text-align:left;font-size:13px;}th{background:#f1f5f9;}.totals{float:right;width:280px;margin-top:8px;}.totals div{display:flex;justify-content:space-between;padding:3px 0;font-size:13px;}.terms{clear:both;margin-top:16px;font-size:12px;color:#334155;}@media print{.no-print{display:none;}}</style></head><body>${safeBody}<div class="no-print" style="margin-top:24px;"><button onclick="window.print()">Print / Save PDF</button></div></body></html>`);
  w.document.close();
}

/** P5: authenticated document download — bearer attached, blob revoked. */
export async function downloadDocumentFile(id: string, name: string): Promise<void> {
  const blob = await documentsApi.downloadBlob(id);
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = String(name || id).replace(/["\r\n\\/]/g, '').slice(0, 160) || id;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

export const TEMPLATE_TOKENS = ['company_name', 'date', 'hiring_type', 'rate_percent', 'payment_days', 'replacement_days', 'gst_note', 'ownership', 'duplicates', 'cancellation', 'template_name'];

/** Fill {{tokens}} in template HTML with template terms + company context. */
export function fillTemplate(t: any, companyName?: string): string {
  const map: Record<string, string> = {
    company_name: escHtml(companyName || t?.orgId || '[Company Name]'),
    date: escHtml(new Date().toISOString().slice(0, 10)),
    hiring_type: escHtml(t?.hiringType || 'Mid-level IT roles'),
    rate_percent: escHtml(t?.rate !== undefined ? String(t.rate) : (t?.rateMin !== undefined && t?.rateMax !== undefined ? (t.rateMin === t.rateMax ? String(t.rateMin) : `${t.rateMin}–${t.rateMax}`) : '8.33–10')),
    payment_days: escHtml(String(t?.paymentTermsDays ?? 30)),
    replacement_days: escHtml(String(t?.replacementDays ?? 90)),
    gst_note: escHtml(t?.gstNote || 'GST charged extra as applicable.'),
    ownership: escHtml(t?.ownershipClause || ''),
    duplicates: escHtml(t?.duplicatePolicy || ''),
    cancellation: escHtml(t?.cancellationTerms || ''),
    template_name: escHtml(t?.name || ''),
  };
  let html = String(t?.bodyHtml || '');
  for (const [k, v] of Object.entries(map)) html = html.split(`{{${k}}}`).join(String(v));
  // P5: sanitize final HTML (template body is editor-controlled).
  return sanitizeHtml(html);
}

/** Open a server-generated PDF blob in a new tab. */
export async function openPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
  const w = window.open(url, '_blank', 'noopener');
  if (!w) {
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  }
  // P5: revoke promptly so invoice/agreement blobs don't linger in memory.
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/** Download an HTML document as a Word-compatible .doc file. */
export function downloadDocFile(filename: string, title: string, bodyHtml: string) {
  const safeTitle = String(title || 'Document').replace(/[<>&"]/g, '').slice(0, 160);
  const safeBody = sanitizeHtml(bodyHtml);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${safeTitle}</title></head><body>${safeBody}</body></html>`;
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const INV_STATUSES = ['Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Void', 'Credited'];
/** Invoice sub-menus — `view` is a server-side saved search (`/invoices?view=`). */
const INV_VIEWS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'paid', label: 'Paid' },
  { key: 'draft', label: 'Drafts' },
  { key: 'void', label: 'Void / credited' },
] as const;
const INV_STATUS_TONE: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Overdue: 'bg-red-50 text-red-700 border-red-200',
  Draft: 'bg-amber-50 text-amber-800 border-amber-200',
  Issued: 'bg-blue-50 text-blue-700 border-blue-200',
  'Partially Paid': 'bg-blue-50 text-blue-700 border-blue-200',
  Void: 'bg-slate-100 text-slate-500 border-slate-200',
  Credited: 'bg-slate-100 text-slate-500 border-slate-200',
};
function invPill(status: string): string {
  return `inline-block px-2 py-0.5 rounded-full border font-bold text-[11px] whitespace-nowrap ${INV_STATUS_TONE[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`;
}

/* ---------------- Invoices (dedicated page: table, statuses, corporate document, reminders) ---------------- */
export function InvoicesPanel() {
  const canBill = useCan('manage_billing');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loadError, setLoadError] = useState(0);
  const [q, setQ] = useQueryState('inv_q');
  const dqInv = useDebounced(q);
  const [statusF, setStatusF] = useQueryState('inv_status');
  const [invPage, setInvPage] = useState(1);
  const [invPageSize, setInvPageSize] = useQueryState('inv_ps');
  const ips = Number(invPageSize) === 50 ? 50 : Number(invPageSize) === 100 ? 100 : 20;
  const [invTotal, setInvTotal] = useState(0);
  const [typeF, setTypeF] = useQueryState('inv_type');
  const [viewF, setViewF] = useQueryState('inv_view');
  const view = (INV_VIEWS.some((v) => v.key === viewF) ? viewF : 'all') as string;
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [orgs, setOrgs] = useState<any[]>([]);
  const [showSeries, setShowSeries] = useState(false);
  const [seriesForm, setSeriesForm] = useState({ orgId: '', label: 'Monthly payroll fee', amount: '', startMonth: '', months: '12', taxRate: '18', draft: true });
  const loadOrgs = async () => {
    try {
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      setOrgs(unwrapList(await directoryApi.tenants()));
    } catch { setOrgs([]); }
  };
  const doSeries = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    if (!seriesForm.orgId || !seriesForm.amount || !/^\d{4}-\d{2}$/.test(seriesForm.startMonth) || !seriesForm.months) { setError('Company + amount + start month (YYYY-MM) + months are required.'); return; }
    try {
      const r = unwrapObj(await billingApi.createSeries({ orgId: seriesForm.orgId, label: seriesForm.label, monthlyAmount: Number(seriesForm.amount), startMonth: seriesForm.startMonth, months: Number(seriesForm.months), taxRate: Number(seriesForm.taxRate) || 0, draft: seriesForm.draft }));
      setOk(`Series created: ${(r?.invoices || []).length} monthly invoice(s).`);
      setSeriesForm({ orgId: '', label: 'Monthly payroll fee', amount: '', startMonth: '', months: '12', taxRate: '18', draft: true });
      setShowSeries(false); load(1, ips, dqInv, statusF, typeF); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const [showInvoice, setShowInvoice] = useState(false);
  const [invForm, setInvForm] = useState({ orgId: '', agreementId: '', subscriptionId: '', billingEntity: '', billingAddress: '', taxIds: '', billingPeriod: '', currency: 'INR', label: 'Placement fee', qty: '1', unit: '', discount: '', taxRate: '18', dueDate: '', draft: false });
  const [docFor, setDocFor] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const [voidFor, setVoidFor] = useState<any>(null);
  const [voidReason, setVoidReason] = useState('');
  const [creditFor, setCreditFor] = useState<any>(null);
  const [creditForm, setCreditForm] = useState({ amount: '', reason: '' });
  const [editFor, setEditFor] = useState<any>(null);
  const [editForm, setEditForm] = useState({ orgId: '', agreementId: '', subscriptionId: '', billingEntity: '', billingAddress: '', taxIds: '', billingPeriod: '', currency: 'INR', label: '', qty: '1', unit: '', discount: '', taxRate: '18', dueDate: '' });
  const openEdit = async (inv: any) => {
    setEditFor(inv);
    setEditForm({ orgId: inv.orgId || '', agreementId: inv.agreementId || '', subscriptionId: inv.subscriptionId || '', billingEntity: inv.billingEntity || '', billingAddress: inv.billingAddress || '', taxIds: inv.taxIds || '', billingPeriod: inv.billingPeriod || '', currency: inv.currency || 'INR', label: '', qty: '1', unit: '', discount: String(inv.discount || ''), taxRate: String(inv.taxRate ?? 18), dueDate: String(inv.dueDate || '').slice(0, 10) });
    try {
      const d = unwrapObj(await billingApi.invoiceDocument(inv.id)) as any;
      const l = (d?.lines || [])[0];
      if (l) setEditForm((f) => ({ ...f, label: l.label || '', qty: String(l.qty || 1), unit: String(l.unit || '') }));
    } catch { /* line prefill is best-effort */ }
  };
  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFor || !editForm.unit) return;
    try {
      const u = unwrapObj(await billingApi.editDraftInvoice(editFor.id, { orgId: editForm.orgId.trim(), agreementId: editForm.agreementId.trim() || undefined, subscriptionId: editForm.subscriptionId.trim() || undefined, billingEntity: editForm.billingEntity.trim() || undefined, billingAddress: editForm.billingAddress.trim() || undefined, taxIds: editForm.taxIds.trim() || undefined, billingPeriod: editForm.billingPeriod.trim() || undefined, currency: editForm.currency || undefined, dueDate: editForm.dueDate, discount: Number(editForm.discount) || 0, taxRate: Number(editForm.taxRate) || 0, lines: [{ label: editForm.label || 'Placement fee', qty: Number(editForm.qty) || 1, unit: Number(editForm.unit) }] }));
      setInvoices((x) => x.map((i) => (i.id === editFor.id ? { ...i, ...(u?.id ? u : {}) } : i)));
      setEditFor(null); setOk('Draft invoice updated.'); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const [dues, setDues] = useState<any>(null);
  const loadDues = async () => {
    try {
      const all = unwrapList(await billingApi.invoices('?page=1&pageSize=100&view=open'));
      const open = all.filter((i: any) => Number(i.balance || 0) > 0 && ['Issued', 'Partially Paid'].includes(i.status));
      const bucket = (pred: (d: number) => boolean) => open.filter((i: any) => { const ms = new Date(i.dueDate).getTime(); if (!Number.isFinite(ms)) return false; return pred(Math.floor((ms - Date.now()) / 864e5)); });
      const sum = (rows: any[]) => rows.reduce((a, i) => a + Number(i.balance || 0), 0);
      const od = bucket((d) => d < 0); const w7 = bucket((d) => d >= 0 && d <= 7); const m30 = bucket((d) => d > 7 && d <= 30);
      setDues({ overdue: { n: od.length, amt: sum(od) }, week: { n: w7.length, amt: sum(w7) }, month: { n: m30.length, amt: sum(m30) } });
    } catch { setDues(null); }
  };
  const [reminders, setReminders] = useState<any[]>([]);
  const [remResult, setRemResult] = useState('');
  const [remBusy, setRemBusy] = useState(false);
  const [remKind, setRemKind] = useState<'all' | 'overdue' | 'due-soon' | 'settled'>('all');
  const [remQ, setRemQ] = useState('');
  const [schedResult, setSchedResult] = useState('');
  const [schedBusy, setSchedBusy] = useState(false);
  /** Safe age label — seeded reminders used to render "due in undefinedd". */
  const remAge = (r: any) => (r.kind === 'overdue' ? `${Number(r.daysOverdue || 0)}d overdue` : `due in ${Number(r.daysToDue || 0)}d`);
  const remVisible = reminders.filter((r) => {
    if (remKind === 'settled' ? !r.settled : remKind !== 'all' && r.kind !== remKind) return false;
    const s = remQ.trim().toLowerCase();
    return !s || `${r.number || ''} ${r.invoiceId || ''} ${r.orgId || ''}`.toLowerCase().includes(s);
  });
  const remAttention = reminders.filter((r) => !r.settled && (r.kind === 'overdue' || Number(r.daysToDue ?? 99) <= 7)).length;
  const runSchedule = async () => {
    setSchedBusy(true); setSchedResult('');
    try {
      const r = unwrapObj(await billingApi.scheduleRun()) as any;
      setSchedResult(`Schedule run: ${r?.generated?.length ?? 0} monthly invoice(s) generated, ${r?.issued?.length ?? 0} series draft(s) issued.`);
      load(invPage, ips, dqInv, statusF, typeF); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setSchedBusy(false); }
  };
  const load = async (p = invPage, size = ips, qq = dqInv, st = statusF, ty = typeF) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page: String(p), pageSize: String(size) });
      if (qq.trim()) params.set('q', qq.trim());
      if (st) params.set('status', st);
      if (ty) params.set('type', ty);
      if (view && view !== 'all') params.set('view', view);
      const res: any = await billingApi.invoices(`?${params.toString()}`);
      setInvoices(unwrapList(res)); setInvTotal(Number(res?.pagination?.total || unwrapList(res).length));
      loadReminders(); loadDues(); loadOrgs(); loadViewCounts();
    }
    catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  /** One cheap total per sub-menu so the tabs always show live counts. */
  const loadViewCounts = async () => {
    try {
      const entries = await Promise.all(INV_VIEWS.map(async (v) => {
        const params = new URLSearchParams({ page: '1', pageSize: '1', view: v.key });
        if (typeF) params.set('type', typeF);
        const res: any = await billingApi.invoices(`?${params.toString()}`);
        return [v.key, Number(res?.pagination?.total || 0)] as const;
      }));
      setViewCounts(Object.fromEntries(entries));
    } catch { /* counts are cosmetic — never block the table */ }
  };
  useEffect(() => { setInvPage(1); }, [dqInv, statusF, typeF, ips, view]);
  useEffect(() => { load(invPage, ips, dqInv, statusF, typeF); }, [invPage, ips, dqInv, statusF, typeF, view]);
  const loadReminders = async () => {
    try { setReminders(unwrapList(await billingApi.invoiceReminders('?page=1&pageSize=50'))); } catch { setReminders([]); }
  };
  const runReminders = async () => {
    setRemBusy(true); setRemResult('');
    try {
      const r = unwrapObj(await billingApi.runInvoiceReminders());
      setRemResult(`Reminders sent: ${r?.sent ?? 0} (overdue + due within 7 days → superadmin).`);
      loadReminders(); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setRemBusy(false); }
  };
  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    if (!invForm.orgId.trim() || !invForm.unit || !invForm.dueDate) { setError('Organization + unit price + due date are required.'); return; }
    try {
      const created = unwrapObj(await billingApi.createInvoice({ orgId: invForm.orgId.trim(), agreementId: invForm.agreementId.trim() || undefined, subscriptionId: invForm.subscriptionId.trim() || undefined, billingEntity: invForm.billingEntity.trim() || undefined, billingAddress: invForm.billingAddress.trim() || undefined, taxIds: invForm.taxIds.trim() || undefined, billingPeriod: invForm.billingPeriod.trim() || undefined, currency: invForm.currency || undefined, dueDate: invForm.dueDate, discount: Number(invForm.discount) || 0, taxRate: Number(invForm.taxRate) || 0, draft: invForm.draft, lines: [{ label: invForm.label, qty: Number(invForm.qty) || 1, unit: Number(invForm.unit) }] }));
      if (created?.id) load(1, ips, dqInv, statusF);
      setInvForm({ orgId: '', agreementId: '', subscriptionId: '', billingEntity: '', billingAddress: '', taxIds: '', billingPeriod: '', currency: 'INR', label: 'Placement fee', qty: '1', unit: '', discount: '', taxRate: '18', dueDate: '', draft: false }); setShowInvoice(false);
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
  const docPrintHtml = (d: any) => `
    <h2>NexaTalent IT Solutions — TAX INVOICE</h2>
    <p><strong>${d.number || d.id}</strong> • Issued ${String(d.issueDate || d.createdAt || '').slice(0, 10)} • Due ${String(d.dueDate || '').slice(0, 10)} • Status: ${d.status}${d.overdue ? ` • ${d.daysOverdue}d overdue` : ''}</p>
    <p><strong>Billed to:</strong> ${d.organization?.legalName || d.orgId}${d.organization?.gstin ? ` (GSTIN: ${d.organization.gstin})` : ' (GSTIN not on file)'}</p>
    <table><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Amount</th></tr>${(d.lines || []).map((l: any) => `<tr><td>${l.label}</td><td>${l.qty}</td><td>₹${l.unit}</td><td>₹${(l.qty * l.unit).toLocaleString('en-IN')}</td></tr>`).join('')}</table>
    <div class="totals"><div><span>Subtotal</span><span>₹${d.subtotal}</span></div><div><span>Discount</span><span>− ₹${d.discount}</span></div><div><span>Tax (GST @ ${d.taxRate ?? 18}%)</span><span>₹${d.tax}</span></div><div><strong>Total</strong><span><strong>₹${d.total}</strong></span></div><div><span>Paid</span><span>₹${d.amountPaid}</span></div><div><span>Balance</span><span>₹${d.balance}</span></div></div>
    <div class="terms"><h3>Commercial terms</h3><p>• ${d.terms?.paymentNote || ''}</p><p>• ${d.terms?.replacementNote || ''}</p><p>• ${d.terms?.gstNote || ''}</p><p>• ${d.terms?.ownershipNote || ''}</p><p>• ${d.terms?.duplicateNote || ''}</p></div>`;
  const filteredInv = invoices;
  const invMenuFor = (i: any) => (
    <RowMenu label={`Invoice ${i.number || i.id}`} items={[
      { label: 'View document', onSelect: () => openDocument(i) },
      ...(canBill && i.status === 'Draft' ? [{ label: 'Edit draft…', onSelect: () => openEdit(i) }] : []),
      ...(canBill && i.status === 'Draft' ? [{ label: 'Issue now', onSelect: () => issueInvoice(i.id) }] : []),
      ...(canBill ? [
        { label: 'Void…', danger: true, onSelect: () => { setVoidFor(i); setVoidReason(''); } },
        { label: 'Credit note…', onSelect: () => { setCreditFor(i); setCreditForm({ amount: '', reason: '' }); } },
      ] : []),
    ]} />
  );
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-extrabold text-slate-900">Tax invoices — statuses, documents, reminders</h3>
            <p className="text-xs text-slate-500 font-medium">
              Issued invoices are immutable — amend with a credit note or void. {invTotal} in view.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ExportButton filename="invoices.csv" rows={filteredInv} columns={['id', 'number', 'orgId', 'agreementId', 'invoiceType', 'billingPeriod', 'subtotal', 'tax', 'total', 'amountPaid', 'balance', 'status', 'dueDate']} />
            {canBill ? <button type="button" onClick={() => setShowSeries(true)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">+ Monthly series</button> : null}
            {canBill ? <button type="button" onClick={() => setShowInvoice(true)} className={btnPrimary}>+ Invoice</button> : null}
          </div>
        </div>
        <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit max-w-full overflow-x-auto" role="tablist" aria-label="Invoice views">
          {INV_VIEWS.map((v) => (
            <button key={v.key} role="tab" aria-selected={view === v.key} type="button" onClick={() => setViewF(v.key)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${view === v.key ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              {v.label}
              {viewCounts[v.key] !== undefined && (
                <span className={`px-1.5 py-px rounded-md text-[10px] font-extrabold ${view === v.key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>{viewCounts[v.key]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1 min-w-[220px]"><SearchSuggest value={q} onChange={setQ} placeholder="Search invoice ID, number, company, agreement…"
    items={invoices.map((i: any) => ({ key: String(i.id), query: String(i.number || i.id), title: String(i.number || i.id), meta: [i.orgId, i.total != null ? `₹${i.total}` : ''].filter(Boolean).join(' • '), status: i.overdue ? 'Overdue' : i.status }))}
    onPick={(it) => { setQ(it.query ?? it.key); setInvPage(1); }} /></div>
          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-44 shrink-0">
              <Select value={statusF} onChange={setStatusF} ariaLabel="Invoice status filter" placeholder="All statuses"
                options={[{ value: '', label: 'All statuses' }, ...INV_STATUSES.map((s) => ({ value: s, label: s }))]} />
            </div>
            <div className="w-full sm:w-44 shrink-0">
              <Select value={typeF} onChange={setTypeF} ariaLabel="Invoice type filter" placeholder="All types"
                options={[{ value: '', label: 'All types' }, { value: 'one_time', label: 'One-time' }, { value: 'monthly', label: 'Monthly' }, { value: 'recurring', label: 'Recurring' }]} />
            </div>
            <PageSize value={ips} onChange={(n) => setInvPageSize(String(n))} />
          </div>
        </div>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(invPage, ips, dqInv, statusF)} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold" role="status">{ok}</div>}
      <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-amber-900">Payment reminders → superadmin</span>
            <span className={`px-2 py-0.5 rounded-full border font-bold text-[10px] ${remAttention > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              {remAttention} needing attention
            </span>
            <span className="text-amber-800 font-medium">• {reminders.length} logged</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {canBill ? <button type="button" disabled={schedBusy} onClick={runSchedule} className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">{schedBusy ? 'Running…' : 'Run billing schedule'}</button> : null}
            {canBill ? <button type="button" disabled={remBusy} onClick={runReminders} className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs disabled:opacity-50">{remBusy ? 'Sending…' : 'Send reminders now'}</button> : null}
          </div>
        </div>
        {remResult && <div className="font-bold text-emerald-700" role="status">{remResult}</div>}
        {schedResult && <div className="font-bold text-emerald-700" role="status">{schedResult}</div>}
        {reminders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg bg-white border border-amber-200 p-0.5" role="tablist" aria-label="Reminder filter">
              {([['all', 'All'], ['overdue', 'Overdue'], ['due-soon', 'Due soon'], ['settled', 'Settled']] as const).map(([v, label]) => (
                <button key={v} type="button" role="tab" aria-selected={remKind === v} onClick={() => setRemKind(v)}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] cursor-pointer whitespace-nowrap ${remKind === v ? 'bg-amber-600 text-white' : 'text-amber-800 hover:bg-amber-100'}`}>{label}</button>
              ))}
            </div>
            <input value={remQ} onChange={(e) => setRemQ(e.target.value)} placeholder="Filter invoice / company…" aria-label="Filter reminders"
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-[11px] font-semibold outline-none focus:border-amber-500 w-48" />
            <span className="text-[11px] font-bold text-amber-800">{remVisible.length} shown</span>
          </div>
        )}
        {remVisible.length === 0 ? (
          <div className="p-3 rounded-xl bg-white/60 border border-dashed border-amber-300 text-[11px] font-semibold text-amber-800">
            {reminders.length === 0
              ? 'No reminders logged yet — “Send reminders now” queues overdue and due-within-7-days notices.'
              : 'No reminders match this filter.'}
          </div>
        ) : (<>
          <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white/60 hidden md:block">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-amber-50/60"><tr className="text-amber-800 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="px-3 py-2">Reminder</th><th className="px-3 py-2">Invoice</th><th className="px-3 py-2">Company</th><th className="px-3 py-2 text-right">Balance</th><th className="px-3 py-2">Age</th><th className="px-3 py-2">Log</th>
              </tr></thead>
              <tbody className="divide-y divide-amber-100">
                {remVisible.slice(0, 12).map((r: any) => (
                  <tr key={r.id} className="text-amber-900 hover:bg-amber-50/60">
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full border font-bold text-[10px] ${r.kind === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                        {r.kind === 'overdue' ? 'overdue' : 'due-soon'}
                      </span>
                      {r.settled && <span className="ml-1.5 px-2 py-0.5 rounded-full border font-bold text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">settled</span>}
                    </td>
                    <td className="px-3 py-2 font-mono font-bold">{r.number || r.invoiceId}</td>
                    <td className="px-3 py-2 font-mono">{r.orgId || '—'}</td>
                    <td className="px-3 py-2 text-right font-extrabold">₹{Number(r.balance || 0).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 font-bold whitespace-nowrap">{remAge(r)}</td>
                    <td className="px-3 py-2 text-[11px] text-amber-800">
                      {r.sentAt ? `${String(r.sentAt).slice(0, 16).replace('T', ' ')}` : '—'}{r.by ? ` • ${r.by}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-1.5 md:hidden">
            {remVisible.slice(0, 8).map((r: any) => (
              <div key={r.id} className="p-3 rounded-xl bg-white/70 border border-amber-200 text-xs space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-amber-900">{r.number || r.invoiceId}</span>
                  <span className="flex gap-1">
                    <span className={`px-2 py-0.5 rounded-full border font-bold text-[10px] ${r.kind === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>{r.kind === 'overdue' ? 'overdue' : 'due-soon'}</span>
                    {r.settled && <span className="px-2 py-0.5 rounded-full border font-bold text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">settled</span>}
                  </span>
                </div>
                <div className="font-bold text-amber-900">{r.orgId || '—'} • bal ₹{Number(r.balance || 0).toLocaleString('en-IN')} • {remAge(r)}</div>
                <div className="text-amber-800 font-medium">{r.sentAt ? String(r.sentAt).slice(0, 16).replace('T', ' ') : '—'}{r.by ? ` • ${r.by}` : ''}</div>
              </div>
            ))}
          </div>
        </>)}
      </div>
      {dues && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200"><div className="text-[10px] font-bold text-red-700 uppercase">Overdue dues</div><div className="text-base font-extrabold">{dues.overdue.n} • ₹{dues.overdue.amt.toLocaleString('en-IN')}</div></div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200"><div className="text-[10px] font-bold text-amber-700 uppercase">Due within 7 days</div><div className="text-base font-extrabold">{dues.week.n} • ₹{dues.week.amt.toLocaleString('en-IN')}</div></div>
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200"><div className="text-[10px] font-bold text-blue-700 uppercase">Due in 8–30 days</div><div className="text-base font-extrabold">{dues.month.n} • ₹{dues.month.amt.toLocaleString('en-IN')}</div></div>
        </div>
      )}
      <Modal open={editFor !== null} onClose={() => setEditFor(null)} title={`Edit draft — ${editFor?.number || editFor?.id || ''}`} subtitle="Draft-only: issuing locks the invoice permanently">
        <form onSubmit={doEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Company *"><Select value={editForm.orgId} onChange={(v) => setEditForm({ ...editForm, orgId: v })} placeholder="Choose company" options={orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id} (${o.id})` }))} /></Field></div>
          <Field label="Agreement ID"><input className={kitInput} value={editForm.agreementId} onChange={(e) => setEditForm({ ...editForm, agreementId: e.target.value })} /></Field>
          <Field label="Subscription / service"><input className={kitInput} value={editForm.subscriptionId} onChange={(e) => setEditForm({ ...editForm, subscriptionId: e.target.value })} /></Field>
          <Field label="Billing entity"><input className={kitInput} value={editForm.billingEntity} onChange={(e) => setEditForm({ ...editForm, billingEntity: e.target.value })} /></Field>
          <Field label="Billing period"><input className={kitInput} value={editForm.billingPeriod} onChange={(e) => setEditForm({ ...editForm, billingPeriod: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Billing address"><input className={kitInput} value={editForm.billingAddress} onChange={(e) => setEditForm({ ...editForm, billingAddress: e.target.value })} /></Field></div>
          <Field label="Tax identifiers"><input className={kitInput} value={editForm.taxIds} onChange={(e) => setEditForm({ ...editForm, taxIds: e.target.value })} /></Field>
          <Field label="Currency"><Select value={editForm.currency} onChange={(v) => setEditForm({ ...editForm, currency: v })} options={['INR', 'USD', 'EUR', 'GBP', 'AED'].map((c) => ({ value: c, label: c }))} /></Field>
          <Field label="Due date *"><DatePicker value={editForm.dueDate} onChange={(v) => setEditForm({ ...editForm, dueDate: v })} /></Field>
          <div className="sm:col-span-2"><Field label="Line label"><input className={kitInput} value={editForm.label} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} /></Field></div>
          <Field label="Qty"><input className={kitInput} type="number" min={1} value={editForm.qty} onChange={(e) => setEditForm({ ...editForm, qty: e.target.value })} /></Field>
          <Field label="Unit price (₹) *"><input className={kitInput} type="number" value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} /></Field>
          <Field label="Discount (₹)"><input className={kitInput} type="number" min={0} value={editForm.discount} onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })} /></Field>
          <Field label="GST rate %"><input className={kitInput} type="number" min={0} max={100} value={editForm.taxRate} onChange={(e) => setEditForm({ ...editForm, taxRate: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Save draft</button>
          </div>
        </form>
      </Modal>
      <Modal open={showSeries} onClose={() => setShowSeries(false)} title="New monthly / recurring series" subtitle="Creates one invoice per month — each billable, payable and voidable on its own">
        <form onSubmit={doSeries} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Company *"><Select value={seriesForm.orgId} onChange={(v) => setSeriesForm({ ...seriesForm, orgId: v })} placeholder="Choose company" options={orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id} (${o.id})` }))} /></Field></div>
          <div className="sm:col-span-2"><Field label="Label"><input className={kitInput} value={seriesForm.label} onChange={(e) => setSeriesForm({ ...seriesForm, label: e.target.value })} /></Field></div>
          <Field label="Monthly amount (₹) *"><input className={kitInput} type="number" value={seriesForm.amount} onChange={(e) => setSeriesForm({ ...seriesForm, amount: e.target.value })} /></Field>
          <Field label="Start month (YYYY-MM) *"><input className={kitInput} value={seriesForm.startMonth} onChange={(e) => setSeriesForm({ ...seriesForm, startMonth: e.target.value })} placeholder="2026-11" /></Field>
          <Field label="Months (1–24) *"><input className={kitInput} type="number" min={1} max={24} value={seriesForm.months} onChange={(e) => setSeriesForm({ ...seriesForm, months: e.target.value })} /></Field>
          <Field label="GST rate %"><input className={kitInput} type="number" min={0} max={100} value={seriesForm.taxRate} onChange={(e) => setSeriesForm({ ...seriesForm, taxRate: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex items-center gap-2 text-xs font-bold text-slate-700">
            <input id="ser-draft" type="checkbox" checked={seriesForm.draft} onChange={(e) => setSeriesForm({ ...seriesForm, draft: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="ser-draft">Save as Draft (issue each month later)</label>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowSeries(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Create series</button>
          </div>
        </form>
      </Modal>
      <Modal open={showInvoice} onClose={() => setShowInvoice(false)} title="New invoice" subtitle="Drafts are editable; issued invoices are immutable (void/credit only)">
        <form onSubmit={createInvoice} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Company *"><Select value={invForm.orgId} onChange={(v) => setInvForm({ ...invForm, orgId: v })} placeholder="Choose company" options={orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id} (${o.id})` }))} /></Field></div>
          <Field label="Agreement ID (links terms)"><input className={kitInput} value={invForm.agreementId} onChange={(e) => setInvForm({ ...invForm, agreementId: e.target.value })} placeholder="AGR-…" /></Field>
          <Field label="Subscription / service"><input className={kitInput} value={invForm.subscriptionId} onChange={(e) => setInvForm({ ...invForm, subscriptionId: e.target.value })} placeholder="SUB-… (optional)" /></Field>
          <Field label="Billing entity"><input className={kitInput} value={invForm.billingEntity} onChange={(e) => setInvForm({ ...invForm, billingEntity: e.target.value })} placeholder="Legal entity billed" /></Field>
          <Field label="Billing period"><input className={kitInput} value={invForm.billingPeriod} onChange={(e) => setInvForm({ ...invForm, billingPeriod: e.target.value })} placeholder="e.g. 2026-11" /></Field>
          <div className="sm:col-span-2"><Field label="Billing address"><input className={kitInput} value={invForm.billingAddress} onChange={(e) => setInvForm({ ...invForm, billingAddress: e.target.value })} /></Field></div>
          <Field label="Tax identifiers"><input className={kitInput} value={invForm.taxIds} onChange={(e) => setInvForm({ ...invForm, taxIds: e.target.value })} placeholder="GSTIN / PAN" /></Field>
          <Field label="Currency"><Select value={invForm.currency} onChange={(v) => setInvForm({ ...invForm, currency: v })} options={['INR', 'USD', 'EUR', 'GBP', 'AED'].map((c) => ({ value: c, label: c }))} /></Field>
          <Field label="Due date *"><DatePicker value={invForm.dueDate} onChange={(v) => setInvForm({ ...invForm, dueDate: v })} /></Field>
          <div className="sm:col-span-2"><Field label="Line label"><input className={kitInput} value={invForm.label} onChange={(e) => setInvForm({ ...invForm, label: e.target.value })} /></Field></div>
          <Field label="Qty"><input className={kitInput} type="number" min={1} value={invForm.qty} onChange={(e) => setInvForm({ ...invForm, qty: e.target.value })} /></Field>
          <Field label="Unit price (₹) *"><input className={kitInput} type="number" value={invForm.unit} onChange={(e) => setInvForm({ ...invForm, unit: e.target.value })} /></Field>
          <Field label="Discount (₹)"><input className={kitInput} type="number" min={0} value={invForm.discount} onChange={(e) => setInvForm({ ...invForm, discount: e.target.value })} /></Field>
          <Field label="GST rate %"><input className={kitInput} type="number" min={0} max={100} value={invForm.taxRate} onChange={(e) => setInvForm({ ...invForm, taxRate: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex items-center gap-2 text-xs font-bold text-slate-700">
            <input id="inv2-draft" type="checkbox" checked={invForm.draft} onChange={(e) => setInvForm({ ...invForm, draft: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="inv2-draft">Save as Draft (editable, issue later)</label>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowInvoice(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">{invForm.draft ? 'Save draft' : 'Issue invoice'}</button>
          </div>
        </form>
      </Modal>
      {docFor !== null && (
      <DetailDrawer width="max-w-[85vw]" title={`Invoice ${doc?.number || docFor?.number || docFor?.id || ''}`} subtitle="Corporate tax invoice — terms, GST, payments, reminders"
        onClose={() => { setDocFor(null); setDoc(null); }}>
        {!doc ? <InlineLoading message="Loading document…" /> : (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-extrabold text-sm">NexaTalent IT Solutions</div>
                  <div className="text-slate-300">Talent acquisition services • GST invoicing</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold">TAX INVOICE</div>
                  <div className="text-slate-300 font-mono">{doc.number || doc.id}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Billed to</div>
                <div className="font-extrabold">{doc.billingEntity || doc.organization?.legalName || doc.orgId}</div>
                {doc.organization?.gstin || doc.taxIds ? <div className="font-medium">GSTIN: {doc.taxIds || doc.organization?.gstin}</div> : <div className="font-medium text-amber-700">GSTIN not on file — collect before filing</div>}
                {doc.billingAddress ? <div className="text-slate-600">{doc.billingAddress}</div> : null}
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Invoice</div>
                <div className="font-medium">Issued {String(doc.issueDate || doc.createdAt || '').slice(0, 10)} • Due {String(doc.dueDate || '').slice(0, 10)}</div>
                <div className="font-medium">Status: <span className={invPill(doc.status)}>{doc.status}</span>{doc.overdue ? ` • ${doc.daysOverdue}d overdue` : ''}</div>
                {doc.billingPeriod ? <div className="font-medium">Period: {doc.billingPeriod}</div> : null}
                {doc.subscriptionId ? <div className="font-medium">Subscription/service: {doc.subscriptionId}</div> : null}
                <div className="font-medium">Currency: {doc.currency || 'INR'}</div>
                {doc.agreement ? <div className="font-medium">Agreement {doc.agreement.id} • {doc.agreement.hiringType} @ {doc.agreement.rate}%{doc.agreement.companyAccepted ? ' • accepted' : ' • pending acceptance'}</div> : null}
              </div>
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
              <div className="flex justify-between"><span>Tax (GST @ {doc.taxRate ?? 18}% — charged extra)</span><span>₹{doc.tax}</span></div>
              <div className="flex justify-between text-sm"><span>Total</span><span>₹{doc.total}</span></div>
              <div className="flex justify-between text-emerald-700"><span>Paid</span><span>₹{doc.amountPaid}</span></div>
              <div className="flex justify-between"><span>Balance</span><span>₹{doc.balance}</span></div>
            </div>
            {(doc.payments || []).length > 0 && <div className="text-slate-600 font-medium">Payments: {(doc.payments || []).map((p: any) => `${p.id} ₹${p.amount}`).join(' • ')}</div>}
            {(doc.creditNotes || []).length > 0 && <div className="text-slate-600 font-medium">Credits: {(doc.creditNotes || []).map((c: any) => `${c.id} ₹${c.amount}`).join(' • ')}</div>}
            {doc.terms && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-medium space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Commercial terms</div>
                <div>• {doc.terms.paymentNote}</div>
                <div>• {doc.terms.replacementNote}</div>
                <div>• {doc.terms.gstNote}</div>
                <div>• {doc.terms.ownershipNote}</div>
                <div>• {doc.terms.duplicateNote}</div>
              </div>
            )}
            {(doc.reminders || []).length > 0 && <div className="text-slate-600 font-medium">Reminders sent: {(doc.reminders || []).map((r: any) => `${r.kind} ${String(r.sentAt || '').slice(0, 10)}`).join(' • ')}</div>}
            <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-white/95 backdrop-blur border-t border-slate-200 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={async () => { try { await openPdfBlob(await billingApi.invoicePdf(doc.id), `${doc.number || doc.id}.pdf`); } catch (e) { setError(errMsg(e)); } }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Download PDF (server)</button>
              <button type="button" onClick={() => printHtmlDocument(`Invoice ${doc.number || doc.id}`, docPrintHtml(doc))} className={btnDark}>Print / Save PDF</button>
            </div>
          </div>
        )}
      </DetailDrawer>
      )}
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
      {loading ? <InlineLoading message="Loading invoices…" /> : filteredInv.length === 0 ? (
        <EmptyState title="No invoices" message="Create one manually or generate it from an approved commission." />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {filteredInv.map((i) => {
            const st = i.overdue ? 'Overdue' : i.status;
            return (
            <div key={i.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{i.number || i.id}</div>
                  <div className="font-mono text-[11px] text-slate-500">{i.orgId}{i.agreementId ? ` • ${i.agreementId}` : ''}</div>
                </div>
                {invMenuFor(i)}
              </div>
              <div className="font-bold text-slate-700">{i.invoiceType === 'one_time' || !i.invoiceType ? 'One-time' : i.invoiceType === 'monthly' ? `Monthly${i.billingPeriod ? ` ${i.billingPeriod}` : ''}` : `Recurring ${i.recurrenceIndex || ''}/${i.recurrenceTotal || ''}`} • Total ₹{Number(i.total || 0).toLocaleString('en-IN')} • paid ₹{Number(i.amountPaid || 0).toLocaleString('en-IN')} • bal <strong>₹{Number(i.balance || 0).toLocaleString('en-IN')}</strong></div>
              <div className="flex flex-wrap gap-1 items-center">
                <span className={invPill(st)}>{st}</span>
                <span className="text-slate-500 font-medium">due {String(i.dueDate || '').slice(0, 10)}{i.overdue ? ` • ${i.daysOverdue}d overdue` : ''}</span>
              </div>
            </div>
            );
          })}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[1020px]">
            <thead className="bg-slate-50 sticky top-0 z-10"><tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="px-3 py-2.5">Invoice</th><th className="px-3 py-2.5">Company</th><th className="px-3 py-2.5">Agreement</th><th className="px-3 py-2.5">Type</th><th className="px-3 py-2.5 text-right">Subtotal</th><th className="px-3 py-2.5 text-right">GST</th><th className="px-3 py-2.5 text-right">Total</th><th className="px-3 py-2.5 text-right">Paid</th><th className="px-3 py-2.5 text-right">Balance</th><th className="px-3 py-2.5">Status</th><th className="px-3 py-2.5">Due</th><th className="px-3 py-2.5 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInv.map((i) => {
                const st = i.overdue ? 'Overdue' : i.status;
                return (
                <tr key={i.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-2.5">
                    <button type="button" onClick={() => openDocument(i)} className="text-left font-bold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-spec-electric cursor-pointer" title="Open invoice document">{i.number || i.id}</button>
                    <div className="font-mono text-[10px] text-slate-400">{i.id}</div>
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-amber-700">{i.orgId}</td>
                  <td className="px-3 py-2.5 font-mono">{i.agreementId || '—'}</td>
                  <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold text-[10px] whitespace-nowrap">{i.invoiceType === 'recurring' ? `Recurring ${i.recurrenceIndex || ''}/${i.recurrenceTotal || ''}` : i.invoiceType === 'monthly' ? `Monthly${i.billingPeriod ? ` ${i.billingPeriod}` : ''}` : 'One-time'}</span></td>
                  <td className="px-3 py-2.5 text-right">₹{Number(i.subtotal || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-right">₹{Number(i.tax || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-right font-bold">₹{Number(i.total || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-right text-emerald-700 font-bold">₹{Number(i.amountPaid || 0).toLocaleString('en-IN')}</td>
                  <td className={`px-3 py-2.5 text-right font-extrabold ${Number(i.balance || 0) > 0 ? 'text-red-700' : 'text-slate-400'}`}>₹{Number(i.balance || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5"><span className={invPill(st)}>{st}</span></td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{String(i.dueDate || '').slice(0, 10)}{i.overdue ? <span className="text-red-600 font-bold"> • {i.daysOverdue}d</span> : ''}</td>
                  <td className="px-3 py-2.5"><div className="flex justify-end">{invMenuFor(i)}</div></td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>)}
      <div className="flex items-center gap-2">
        <div className="flex-1"><Pager page={invPage} total={invTotal} pageSize={ips} onPage={setInvPage} /></div>
        <InfoTip title="About this pagination" body={<><p>Server-side pagination: the API returns {ips} records per page ({invTotal} total). Use Show 20/50/100 to change page size; filters apply server-side before paging.</p></>} />
      </div>
    </div>
  );
}

/* ---------------- Payments & Reminders: status tabs over open + paid invoices ---------------- */
export function PaymentsRemindersPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useQueryState('pay_tab');
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busyId, setBusyId] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try {
      const [openRes, paidRes] = await Promise.all([
        billingApi.invoices('?page=1&pageSize=100'), billingApi.invoices('?page=1&pageSize=100&status=Paid'),
      ]);
      const open = unwrapList(openRes).filter((i: any) => Number(i.balance || 0) > 0 && ['Issued', 'Partially Paid'].includes(i.status));
      const paid = unwrapList(paidRes);
      const seen = new Set(open.map((i: any) => i.id));
      setRows([...open, ...paid.filter((i: any) => !seen.has(i.id))]);
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const age = (i: any) => { const ms = new Date(i.dueDate).getTime(); if (!Number.isFinite(ms)) return null; return Math.floor((ms - Date.now()) / 864e5); };
  const bucket = (i: any): 'overdue' | 'soon' | 'upcoming' | 'paid' | 'other' => {
    if (i.status === 'Paid' || Number(i.balance || 0) <= 0) return 'paid';
    const d = age(i);
    if (d === null) return 'other';
    if (d < 0) return 'overdue';
    if (d <= 7) return 'soon';
    if (d <= 30) return 'upcoming';
    return 'other';
  };
  const counts = (k: string) => rows.filter((i) => bucket(i) === k).length;
  const active = tab || 'overdue';
  const list = rows.filter((i) => bucket(i) === active);
  const remindOne = async (id: string) => {
    setBusyId(id); setError(''); setOk('');
    try {
      const r = unwrapObj(await billingApi.runInvoiceReminders([id]));
      setOk(`Reminder sent for ${id} (${r?.sent ?? 0} notification${(r?.sent ?? 0) === 1 ? '' : 's'}).`); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusyId(''); }
  };
  const openInvoice = (id: string) => navigate(`/superadmin/invoices?inv_q=${encodeURIComponent(id)}`);
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-extrabold text-slate-900">Payments & Reminders</h3>
          <InfoTip title="How this page works" body={<><p>Open invoices grouped by payment urgency. <strong>Remind now</strong> sends one reminder (same daily idempotency as bulk runs). Use the Invoices page for documents and the Billing page to record money.</p></>} />
        </div>
        <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5" role="tablist" aria-label="Payment status">
          {([['overdue', `Overdue (${counts('overdue')})`], ['soon', `Due ≤7d (${counts('soon')})`], ['upcoming', `8–30d (${counts('upcoming')})`], ['paid', `Paid (${counts('paid')})`]] as const).map(([v, label]) => (
            <button key={v} role="tab" aria-selected={active === v} type="button" onClick={() => setTab(v)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap ${active === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
          ))}
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {loading ? <InlineLoading message="Loading payment status…" /> : list.length === 0 ? (
        <EmptyState title={`No ${active} invoices`} message="All clear in this bucket (latest 100 invoices scanned)." />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {list.map((i) => (
            <div key={i.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{i.number || i.id}</div>
                  <div className="font-mono text-[11px] text-slate-500">{i.orgId}</div>
                </div>
                <RowMenu label={`Invoice ${i.id}`} items={[
                  { label: 'Open invoice…', onSelect: () => openInvoice(i.id) },
                  ...(Number(i.balance || 0) > 0 && i.status !== 'Paid' ? [{ label: 'Remind now', onSelect: () => remindOne(i.id) }] : []),
                ]} />
              </div>
              <div className="font-bold">bal <strong>₹{Number(i.balance || 0).toLocaleString('en-IN')}</strong> of ₹{Number(i.total || 0).toLocaleString('en-IN')} • {active === 'paid' ? 'paid' : age(i) !== null && age(i)! < 0 ? `${-age(i)!}d overdue` : `due in ${age(i)}d`}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[920px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Company</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-right">Paid</th><th className="px-4 py-3 text-right">Balance</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Due / Age</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold">{i.number || i.id}</div><div className="font-mono text-[11px] text-slate-500">{i.id}</div></td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-700">{i.orgId}</td>
                  <td className="px-4 py-3 text-right">₹{Number(i.total || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-bold">₹{Number(i.amountPaid || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-extrabold">₹{Number(i.balance || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${i.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : i.overdue ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{i.status}</span></td>
                  <td className="px-4 py-3">{active === 'paid' ? String(i.updatedAt || i.issueDate || '').slice(0, 10) : `${String(i.dueDate || '').slice(0, 10)}${age(i) !== null && age(i)! < 0 ? ` (${-age(i)!}d)` : ''}`}</td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1">
                    <button type="button" onClick={() => openInvoice(i.id)} className="text-[11px] font-bold text-blue-600 underline">Open</button>
                    {Number(i.balance || 0) > 0 && i.status !== 'Paid' ? <button type="button" disabled={busyId === i.id} onClick={() => remindOne(i.id)} className="text-[11px] font-bold text-amber-700 underline disabled:opacity-50">{busyId === i.id ? 'Sending…' : 'Remind'}</button> : null}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
    </div>
  );
}

/* ---------------- Phase 3: Billing (payments / refunds / reconciliation) ---------------- */
export function BillingPanel() {
  const [payments, setPayments] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [pay, setPay] = useState({ invoiceId: '', amount: '' });
  const [payPreview, setPayPreview] = useState<any>(null);
  const [refund, setRefund] = useState({ paymentId: '', amount: '', reason: '' });
  const [refundPreview, setRefundPreview] = useState<any>(null);
  const [showPay, setShowPay] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [refundConfirm, setRefundConfirm] = useState(false);
  const [recon, setRecon] = useState<any>(null);
  const [q, setQ] = useQueryState('bill_q');
  const dqBill = useDebounced(q);
  const [payPage, setPayPage] = useState(1);
  const [payTotal, setPayTotal] = useState(0);
  const [billPs, setBillPs] = useQueryState('bill_ps');
  const bps = Number(billPs) === 50 ? 50 : Number(billPs) === 100 ? 100 : 20;
  const load = async (p = payPage, qq = dqBill) => {
    setError('');
    try {
      const params = new URLSearchParams({ page: String(p), pageSize: String(bps) });
      if (qq.trim()) params.set('q', qq.trim());
      const [pay, r, rec] = await Promise.all([
        billingApi.payments(`?${params.toString()}`).catch(() => null), billingApi.refunds(`?${params.toString()}`).catch(() => null), billingApi.reconciliation().catch(() => null),
      ]);
      if (pay) { setPayments(unwrapList(pay)); setPayTotal(Number((pay as any)?.pagination?.total || unwrapList(pay).length)); }
      if (r) setRefunds(unwrapList(r));
      if (rec) setRecon(unwrapObj(rec));
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { setPayPage(1); }, [dqBill, bps]);
  useEffect(() => { load(payPage, dqBill); }, [payPage, dqBill, bps]);
  const payNow = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setOk('');
    try {
      const key = `ui-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      await billingApi.pay(pay.invoiceId, Number(pay.amount), key);
      setOk('Payment recorded and reconciled.'); setPay({ invoiceId: '', amount: '' }); setPayPreview(null); setShowPay(false); load();
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const doRefund = async () => {
    setError(''); setOk('');
    if (!refund.paymentId || !refund.amount) { setError('Payment ID + amount required.'); return; }
    try {
      const r = unwrapObj(await billingApi.refund(refund.paymentId, Number(refund.amount), refund.reason || 'requested'));
      if (r?.id) setRefunds((x) => [r, ...x]);
      setOk('Refund processed — ledger updated.'); setRefund({ paymentId: '', amount: '', reason: '' }); setRefundPreview(null); setShowRefund(false); load(); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const filteredPay = payments;
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-extrabold text-slate-900">Billing — Payments / Refunds / Reconciliation</h3>
            <InfoTip title="How billing works" body={<><p>Payments settle invoices (idempotent — safe to retry). Refunds return money and reopen the invoice balance. Every export is permission-gated and audit-logged.</p></>} />
          </div>
          <div className="flex gap-2">
            <ExportButton filename="payments.csv" rows={filteredPay} columns={['id', 'invoiceId', 'orgId', 'amount', 'status']} />
            <button type="button" onClick={() => setShowRefund(true)} className={btnDark}>Refund</button>
            <button type="button" onClick={() => setShowPay(true)} className={btnPrimary}>Record payment</button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <SearchSuggest value={q} onChange={setQ} placeholder="Search payment ID, invoice, org, status…"
    items={payments.map((p: any) => ({ key: String(p.id), query: String(p.id), title: String(p.id), meta: [p.invoiceId, p.amount != null ? `₹${p.amount}` : ''].filter(Boolean).join(' • '), status: p.status }))}
    onPick={(it) => { setQ(it.query ?? it.key); setPayPage(1); }} />
          <div className="flex items-center gap-2">
            <PageSize value={bps} onChange={(n) => setBillPs(String(n))} />
          </div>
        </div>
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
      <Modal open={showPay} onClose={() => setShowPay(false)} title="Record payment" subtitle="Pick an open invoice — company, bill and balance load automatically. Idempotent per submission.">
        <form onSubmit={payNow} className="space-y-3">
          <Field label="Invoice (open balance) *"><InvoicePicker value={pay.invoiceId} onChange={(v, inv) => { setPayPreview(inv || null); setPay((p) => ({ invoiceId: v, amount: !v ? '' : (p.amount || (inv ? String(inv.balance || '') : '')) })); }} /></Field>
          {payPreview && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold space-y-0.5">
              <div>{payPreview.number || payPreview.id} • {payPreview.orgId} • {payPreview.status}</div>
              <div>Total ₹{Number(payPreview.total || 0).toLocaleString('en-IN')} • paid ₹{Number(payPreview.amountPaid || 0).toLocaleString('en-IN')} • bal <strong>₹{Number(payPreview.balance || 0).toLocaleString('en-IN')}</strong></div>
            </div>
          )}
          <Field label="Amount *"><input className={kitInput} type="number" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowPay(false); setPayPreview(null); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Record payment</button>
          </div>
        </form>
      </Modal>
      <Modal open={showRefund} onClose={() => setShowRefund(false)} title="Process refund" subtitle="Pick a successful payment — invoice and refundable headroom load automatically.">
        <div className="space-y-3">
          <Field label="Payment (succeeded) *"><PaymentPicker value={refund.paymentId} onChange={(v, p) => { setRefund({ ...refund, paymentId: v }); setRefundPreview(p || null); }} /></Field>
          {refundPreview && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold space-y-0.5">
              <div>{refundPreview.id} • invoice {refundPreview.invoiceId} • {refundPreview.orgId}</div>
              <div>Paid ₹{Number(refundPreview.amount || 0).toLocaleString('en-IN')}{refundPreview.refundedAmount ? ` • already refunded ₹${refundPreview.refundedAmount}` : ''} • refundable <strong>₹{(Number(refundPreview.amount || 0) - Number(refundPreview.refundedAmount || 0)).toLocaleString('en-IN')}</strong></div>
            </div>
          )}
          <Field label="Amount *"><input className={kitInput} type="number" value={refund.amount} onChange={(e) => setRefund({ ...refund, amount: e.target.value })} /></Field>
          <Field label="Reason"><input className={kitInput} value={refund.reason} onChange={(e) => setRefund({ ...refund, reason: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowRefund(false); setRefundPreview(null); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
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
      <div className="text-xs font-extrabold text-slate-700">Payments ({payTotal})</div>
      {filteredPay.length === 0 ? <div className="text-xs text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200">No payments match.</div> : (<>
        <div className="space-y-2 md:hidden">
          {filteredPay.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-extrabold text-slate-900 text-sm">{p.id} • ₹{Number(p.amount || 0).toLocaleString('en-IN')}</div>
              <div className="text-slate-500 font-medium">{p.invoiceId} • {p.orgId} • {p.status}{p.refundedAmount ? ` • refunded ₹${p.refundedAmount}` : ''}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[860px]">
            <thead className="bg-slate-50 sticky top-0 z-10"><tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="px-3 py-2.5">Payment</th><th className="px-3 py-2.5">Invoice</th><th className="px-3 py-2.5">Company</th><th className="px-3 py-2.5 text-right">Amount</th><th className="px-3 py-2.5">Method</th><th className="px-3 py-2.5">Status</th><th className="px-3 py-2.5">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPay.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-2.5 font-mono font-bold">{p.id}</td>
                  <td className="px-3 py-2.5 font-mono">{p.invoiceId}</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-amber-700">{p.orgId}</td>
                  <td className="px-3 py-2.5 text-right font-extrabold">₹{Number(p.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5">{p.method || ''}{p.provider ? ` via ${p.provider}` : ''}</td>
                  <td className="px-3 py-2.5"><span className={invPill(p.status === 'succeeded' || p.status === 'Succeeded' ? 'Paid' : p.status === 'failed' || p.status === 'Failed' ? 'Overdue' : 'Issued')}>{p.status}</span>{p.refundedAmount ? <span className="text-slate-500 font-bold"> • ref ₹{p.refundedAmount}</span> : ''}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{String(p.transactionDate || p.createdAt || '').slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Pager page={payPage} total={payTotal} pageSize={bps} onPage={setPayPage} />
      <div className="text-xs font-extrabold text-slate-700">Refunds ({refunds.length})</div>
      {refunds.length === 0 ? <div className="text-xs text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200">No refunds.</div> : (<>
        <div className="space-y-2 md:hidden">
          {refunds.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold">{r.id} • payment {r.paymentId} • ₹{r.amount} • {r.status}</div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 sticky top-0 z-10"><tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="px-3 py-2.5">Refund</th><th className="px-3 py-2.5">Payment</th><th className="px-3 py-2.5">Invoice</th><th className="px-3 py-2.5 text-right">Amount</th><th className="px-3 py-2.5">Status</th><th className="px-3 py-2.5">Reason</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {refunds.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-2.5 font-mono font-bold">{r.id}</td>
                  <td className="px-3 py-2.5 font-mono">{r.paymentId}</td>
                  <td className="px-3 py-2.5 font-mono">{r.invoiceId}</td>
                  <td className="px-3 py-2.5 text-right font-extrabold">₹{Number(r.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5"><span className={invPill(r.status === 'Succeeded' || r.status === 'succeeded' ? 'Paid' : r.status === 'Failed' || r.status === 'failed' ? 'Overdue' : 'Issued')}>{r.status}</span></td>
                  <td className="px-3 py-2.5 text-slate-600">{r.reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
    </div>
  );
}

/** Billing sub-menu workspace — Invoices / Payments & refunds. */
const BILL_VIEWS = [
  { key: 'invoices', label: 'Invoices' },
  { key: 'payments', label: 'Payments & refunds' },
] as const;
export function EmployerBillingWorkspace() {
  const [tab, setTab] = useQueryState('bill_tab');
  const active = (BILL_VIEWS.some((v) => v.key === tab) ? tab : 'invoices') as string;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-extrabold text-slate-900">Billing</h2>
          <p className="text-xs text-slate-500 font-medium">Tax invoices, payments, refunds and plan entitlements — one place, live data.</p>
        </div>
        <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5" role="tablist" aria-label="Billing sections">
          {BILL_VIEWS.map((v) => (
            <button key={v.key} type="button" role="tab" aria-selected={active === v.key} onClick={() => setTab(v.key)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap ${active === v.key ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>{v.label}</button>
          ))}
        </div>
      </div>
      {active === 'invoices' ? <InvoicesPanel /> : <BillingPanel />}
    </div>
  );
}


/* ---------------- Agreement templates: advanced HTML document editor ----------------
   Own component: template CRUD + Word-style editing + filled preview + .doc/print.
   Mounted in the Templates tab; parent passes the list + a reload callback. */
export function AgreementTemplatesPanel({ templates, onChanged }: { templates: any[]; onChanged: () => void }) {
  const canTemplates = useCan('manage_billing');
  const [error, setError] = useState('');
  const [slabs, setSlabs] = useState<any[]>([]);
  const [slabDraft, setSlabDraft] = useState<any[]>([]);
  const [showSlabs, setShowSlabs] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const rows = unwrapList(await billingApi.feeSlabs());
        setSlabs(rows); setSlabDraft(rows.map((s: any) => ({ ...s })));
      } catch { setSlabs([]); setSlabDraft([]); }
    })();
  }, []);
  const saveSlabs = async () => {
    try {
      const saved = unwrapList(await billingApi.saveFeeSlabs(slabDraft.map((s: any) => ({ hiringType: s.hiringType, rateMin: Number(s.rateMin), rateMax: Number(s.rateMax), note: s.note || '', retainedAllowed: !!s.retainedAllowed, negotiated: !!s.negotiated }))));
      setSlabs(saved); setSlabDraft(saved.map((s: any) => ({ ...s }))); setShowSlabs(false); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const emptyTpl = { name: '', orgId: '', hiringType: '', rateMin: '', rateMax: '', paymentTermsDays: '30', replacementDays: '90', gstNote: 'GST charged extra as applicable.', ownershipClause: '', duplicatePolicy: '', cancellationTerms: '' };
  const [tplForm, setTplForm] = useState(emptyTpl);
  const [editingTpl, setEditingTpl] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);
  const [tplBodySeed, setTplBodySeed] = useState('');
  const [tplPreviewHtml, setTplPreviewHtml] = useState(false);
  const [tplPreview, setTplPreview] = useState<any>(null);
  const tplBodyRef = useRef<HTMLDivElement>(null);
  const tplCmd = (cmd: string, val?: string) => { tplBodyRef.current?.focus(); document.execCommand(cmd, false, val); };
  const tplToken = (tok: string) => { tplBodyRef.current?.focus(); document.execCommand('insertHTML', false, `{{${tok}}}`); };
  const openTplCreate = () => { setTplForm(emptyTpl); setEditingTpl(''); setTplBodySeed('<h2>Agreement</h2><p>Between <strong>NexaTalent IT Solutions</strong> (“Platform”) and <strong>{{company_name}}</strong> (“Company”), effective <strong>{{date}}</strong>.</p>'); setTplPreviewHtml(false); setShowTemplate(true); };
  const openTplEdit = (t: any) => {
    setTplForm({ name: t.name, orgId: t.orgId || '', hiringType: t.hiringType || '', rateMin: t.rateMin ?? '', rateMax: t.rateMax ?? '', paymentTermsDays: String(t.paymentTermsDays ?? 30), replacementDays: String(t.replacementDays ?? 90), gstNote: t.gstNote || '', ownershipClause: t.ownershipClause || '', duplicatePolicy: t.duplicatePolicy || '', cancellationTerms: t.cancellationTerms || '' });
    setTplBodySeed(t.bodyHtml || ''); setEditingTpl(t.id); setTplPreviewHtml(false); setShowTemplate(true);
  };
  const saveTemplate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!tplForm.name.trim()) return;
    try {
      const body: any = {
        name: tplForm.name.trim(), orgId: tplForm.orgId.trim() || undefined,
        hiringType: tplForm.hiringType || undefined,
        rateMin: tplForm.rateMin === '' ? undefined : Number(tplForm.rateMin),
        rateMax: tplForm.rateMax === '' ? undefined : Number(tplForm.rateMax),
        paymentTermsDays: Number(tplForm.paymentTermsDays) || 30, replacementDays: Number(tplForm.replacementDays) || 90,
        gstNote: tplForm.gstNote, ownershipClause: tplForm.ownershipClause, duplicatePolicy: tplForm.duplicatePolicy, cancellationTerms: tplForm.cancellationTerms,
        bodyHtml: tplBodyRef.current?.innerHTML || undefined,
      };
      const saved = editingTpl ? unwrapObj(await billingApi.updateTemplate(editingTpl, body)) : unwrapObj(await billingApi.createTemplate(body));
      if (saved?.id) { onChanged(); }
      setTplForm(emptyTpl); setEditingTpl(''); setShowTemplate(false); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const tplStatus = async (id: string, status: string) => {
    try {
      await billingApi.templateStatus(id, status);
      onChanged(); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="text-xs font-extrabold text-slate-700">Agreement templates — company ↔ platform ({templates.length})</div>
          <InfoTip title="How templates work" body={<><p>A template is the <strong>master commercial document</strong> between NexaTalent and a company (global or per-company scope). Edit terms + document body; saving mints a <strong>new version</strong> with history — instantiated agreements keep their snapshot.</p><p>Use <strong>Preview / download</strong> to check the filled document, print it, or download a Word file. <strong>Activate</strong> before agreements can be created from it.</p></>} />
        </div>
        {canTemplates ? <button type="button" onClick={openTplCreate} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">+ Template</button> : null}
      </div>
      {error && <PanelError message={error} onRetry={() => setError('')} />}
      {canTemplates && (
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold">Fee slabs by hiring type (superadmin-configured)</span>
              <InfoTip title="How fee slabs work" body={<><p>Every agreement rate is validated against these slabs: Junior 8.33% · Mid 8.33–10% · Senior 10–12% · Leadership 12–15% · Bulk negotiated. Out-of-slab rates are rejected (422).</p></>} />
            </div>
            <button type="button" onClick={() => (showSlabs ? saveSlabs() : setShowSlabs(true))} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">{showSlabs ? 'Save slabs' : 'Edit slabs'}</button>
          </div>
          {showSlabs ? (
            <div className="space-y-1.5">
              {slabDraft.map((s: any, ix: number) => (
                <div key={s.hiringType} className="grid grid-cols-12 gap-1.5 items-center">
                  <div className="col-span-5 font-bold truncate">{s.hiringType}</div>
                  <input aria-label={`${s.hiringType} min`} className={kitInput} type="number" step="0.01" value={s.rateMin} onChange={(e) => setSlabDraft((d) => d.map((x, j) => (j === ix ? { ...x, rateMin: e.target.value } : x)))} />
                  <input aria-label={`${s.hiringType} max`} className={`${kitInput} col-span-2`} type="number" step="0.01" value={s.rateMax} onChange={(e) => setSlabDraft((d) => d.map((x, j) => (j === ix ? { ...x, rateMax: e.target.value } : x)))} />
                  <input aria-label={`${s.hiringType} note`} className={`${kitInput} col-span-3`} value={s.note || ''} onChange={(e) => setSlabDraft((d) => d.map((x, j) => (j === ix ? { ...x, note: e.target.value } : x)))} placeholder="Note" />
                </div>
              ))}
            </div>
          ) : (
            <div className="font-medium text-slate-600">{slabs.map((s: any) => `${s.hiringType}: ${s.negotiated ? s.note : `${s.rateMin}%–${s.rateMax}%`}`).join(' • ')}</div>
          )}
        </div>
      )}
      {templates.map((t: any) => (
        <div key={t.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
          <span className="min-w-0 truncate">{t.name} v{t.version} • {t.status}{t.orgId ? ` • ${t.orgId}` : ' • global'} • pay ≤{t.paymentTermsDays}d • repl {t.replacementDays}d{t.history?.length ? ` • ${t.history.length} prior version(s)` : ''}</span>
          <RowMenu label={`Template ${t.id}`} items={[
            { label: 'Preview / download…', onSelect: () => setTplPreview(t) },
            ...(canTemplates ? [
              { label: 'Edit / new version…', onSelect: () => openTplEdit(t) },
              ...(t.status === 'Draft' ? [{ label: 'Activate', onSelect: () => tplStatus(t.id, 'Active') }] : []),
              ...(t.status === 'Active' ? [{ label: 'Archive', danger: true, onSelect: () => tplStatus(t.id, 'Archived') }] : []),
            ] : []),
          ]} />
        </div>
      ))}
      {showTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto" data-lenis-prevent role="dialog" aria-label="Template editor">
          <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <button type="button" onClick={() => setShowTemplate(false)} className="text-xs font-bold text-blue-600 underline">← Back to templates</button>
                <h2 className="text-lg font-extrabold text-slate-900">{editingTpl ? 'Edit template (mints a new version)' : 'New agreement template'}</h2>
                <p className="text-xs text-slate-500 font-medium">Terms sync to every agreement instantiated from this template</p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">Full-page editor</span>
            </div>
        <form onSubmit={saveTemplate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="sm:col-span-2"><Field label="Template name *"><input className={kitInput} value={tplForm.name} onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })} placeholder="e.g. Standard Placement Terms — Mid-level" /></Field></div>
          <Field label="Company scope (blank = global)"><input className={kitInput} value={tplForm.orgId} onChange={(e) => setTplForm({ ...tplForm, orgId: e.target.value })} placeholder="TNT-9011" /></Field>
          <Field label="Hiring type"><Select value={tplForm.hiringType} onChange={(v) => setTplForm({ ...tplForm, hiringType: v })} placeholder="Any" options={[{ value: '', label: 'Any' }, ...['Junior IT roles', 'Mid-level IT roles', 'Senior / niche technology roles', 'Leadership / executive search', 'Bulk hiring'].map((h) => ({ value: h, label: h }))]} /></Field>
          <Field label="Rate min %"><input className={kitInput} type="number" step="0.01" value={tplForm.rateMin} onChange={(e) => setTplForm({ ...tplForm, rateMin: e.target.value })} /></Field>
          <Field label="Rate max %"><input className={kitInput} type="number" step="0.01" value={tplForm.rateMax} onChange={(e) => setTplForm({ ...tplForm, rateMax: e.target.value })} /></Field>
          <Field label="Payment within (days of joining)"><input className={kitInput} type="number" min={1} max={60} value={tplForm.paymentTermsDays} onChange={(e) => setTplForm({ ...tplForm, paymentTermsDays: e.target.value })} /></Field>
          <Field label="Replacement window (days)"><input className={kitInput} type="number" min={0} max={365} value={tplForm.replacementDays} onChange={(e) => setTplForm({ ...tplForm, replacementDays: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="GST note"><input className={kitInput} value={tplForm.gstNote} onChange={(e) => setTplForm({ ...tplForm, gstNote: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Candidate ownership"><textarea rows={2} className={kitInput} value={tplForm.ownershipClause} onChange={(e) => setTplForm({ ...tplForm, ownershipClause: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Duplicate policy"><textarea rows={2} className={kitInput} value={tplForm.duplicatePolicy} onChange={(e) => setTplForm({ ...tplForm, duplicatePolicy: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Cancellation terms"><textarea rows={2} className={kitInput} value={tplForm.cancellationTerms} onChange={(e) => setTplForm({ ...tplForm, cancellationTerms: e.target.value })} /></Field></div>
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-slate-700">Document body (Word-style) — saved as a new version</div>
              <button type="button" onClick={() => setTplPreviewHtml((v) => !v)} className="text-[11px] font-bold text-blue-600 underline">{tplPreviewHtml ? 'Back to edit' : 'Preview filled document'}</button>
            </div>
            {!tplPreviewHtml ? (
              <>
                <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
                  {[['H2', 'formatBlock', '<h2>'], ['H3', 'formatBlock', '<h3>'], ['¶', 'formatBlock', '<p>'], ['B', 'bold'], ['I', 'italic'], ['U', 'underline'], ['S', 'strikeThrough']].map(([label, cmd, val]) => (
                    <button key={label as string} type="button" title={label as string} onMouseDown={(e) => e.preventDefault()} onClick={() => tplCmd(cmd as string, val as string)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-[#0B5FD9]">{label}</button>
                  ))}
                  {[['≡L', 'justifyLeft'], ['≡C', 'justifyCenter'], ['≡R', 'justifyRight'], ['≡J', 'justifyFull']].map(([label, cmd]) => (
                    <button key={label as string} type="button" title={`Align ${label}`} onMouseDown={(e) => e.preventDefault()} onClick={() => tplCmd(cmd as string)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-[#0B5FD9]">{label}</button>
                  ))}
                  {[['• List', 'insertUnorderedList'], ['1. List', 'insertOrderedList'], ['❝', 'formatBlock', '<blockquote>'], ['―', 'insertHorizontalRule']].map(([label, cmd, val]) => (
                    <button key={label as string} type="button" title={label as string} onMouseDown={(e) => e.preventDefault()} onClick={() => tplCmd(cmd as string, val as string)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-[#0B5FD9]">{label}</button>
                  ))}
                  <select aria-label="Font size" title="Font size" className="px-1.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]" defaultValue="" onChange={(e) => { if (e.target.value) { tplCmd('fontSize', e.target.value); e.target.value = ''; } }}>
                    <option value="">A±</option>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Size {n}</option>)}
                  </select>
                  <label title="Text color" className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-bold text-[11px] cursor-pointer">A<input type="color" className="sr-only" onChange={(e) => tplCmd('foreColor', e.target.value)} /></label>
                  <label title="Highlight" className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-bold text-[11px] cursor-pointer">▮<input type="color" className="sr-only" defaultValue="#fef08a" onChange={(e) => tplCmd('hiliteColor', e.target.value)} /></label>
                  <button type="button" title="Clear formatting" onMouseDown={(e) => e.preventDefault()} onClick={() => tplCmd('removeFormat')}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-[#0B5FD9]">⌫</button>
                  <button type="button" title="Undo" onMouseDown={(e) => e.preventDefault()} onClick={() => tplCmd('undo')}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-[#0B5FD9]">↩</button>
                  <button type="button" title="Redo" onMouseDown={(e) => e.preventDefault()} onClick={() => tplCmd('redo')}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-[#0B5FD9]">↪</button>
                  <select aria-label="Insert placeholder" title="Insert placeholder" className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]" defaultValue="" onChange={(e) => { if (e.target.value) { tplToken(e.target.value); e.target.value = ''; } }}>
                    <option value="">+ {'{{field}}'}</option>
                    {TEMPLATE_TOKENS.map((tok) => <option key={tok} value={tok}>{`{{${tok}}}`}</option>)}
                  </select>
                </div>
                <div ref={tplBodyRef} contentEditable suppressContentEditableWarning
                  key={editingTpl || 'new'}
                  className="min-h-[280px] p-4 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed focus:outline-none focus:border-[#0B5FD9]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(tplBodySeed) }} />
              </>
            ) : (
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed max-h-[320px] overflow-y-auto" data-lenis-prevent
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(fillTemplate({ ...tplForm, rateMin: tplForm.rateMin === '' ? undefined : Number(tplForm.rateMin), rateMax: tplForm.rateMax === '' ? undefined : Number(tplForm.rateMax), bodyHtml: sanitizeHtml(tplBodyRef.current?.innerHTML || tplBodySeed) }, tplForm.orgId || undefined)) }} />
            )}
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowTemplate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>{editingTpl ? 'Save as new version' : 'Create template'}</button>
          </div>
        </form>
          </div>
        </div>
      )}
      <Modal open={tplPreview !== null} onClose={() => setTplPreview(null)} title={tplPreview?.name || ''} subtitle={`${tplPreview?.id || ''} • v${tplPreview?.version || ''} • ${tplPreview?.status || ''}`} wide>
        <div className="space-y-3">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs leading-relaxed max-h-[52vh] overflow-y-auto" data-lenis-prevent
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(tplPreview ? fillTemplate(tplPreview) : '') }} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => tplPreview && downloadDocFile(`${tplPreview.name || 'agreement'}-v${tplPreview.version || 1}`, tplPreview.name || 'Agreement', fillTemplate(tplPreview))} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Download .doc (Word)</button>
            <button type="button" onClick={() => tplPreview && printHtmlDocument(tplPreview.name || 'Agreement', fillTemplate(tplPreview))} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Print / Save PDF</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- Phase 3/4: Commissions & payouts ---------------- */
export function CommissionsPanel() {
  const { user } = useAuth();
  const canManageBilling = useCan('manage_billing');
  // Phase 6: agencies see payable-only ledgers; finance controls stay hidden without a grant.
  const agencyFinanceView = !!user && ['agency_admin', 'agency_recruiter', 'vendor', 'recruiter'].includes(user.role) && !canManageBilling;
  const [agreements, setAgreements] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ orgId: '', jobId: '', hiringType: 'Mid-level IT roles', rate: '8.33', trigger: 'Joined', basisType: 'annual_ctc', contractMonths: '12', paymentTermsDays: '30', replacementDays: '90', templateId: '', autoApprove: false });
  const [slabs, setSlabs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showAgreement, setShowAgreement] = useState(false);
  const [adjustFor, setAdjustFor] = useState<any>(null);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [adjustForm, setAdjustForm] = useState({ amount: '', reason: '' });
  const reloadTemplates = async () => {
    try { setTemplates(unwrapList(await billingApi.agreementTemplates())); } catch { setTemplates([]); }
  };
  const [loadError, setLoadError] = useState(0);
  const [ok, setOk] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useQueryState('com_ps');
  const ps = Number(pageSize) === 50 ? 50 : Number(pageSize) === 100 ? 100 : 20;
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<any>(null);
  const [agrPage, setAgrPage] = useState(1);
  const [agrTotal, setAgrTotal] = useState(0);
  const [payPage, setPayPage] = useState(1);
  const [payPgTotal, setPayPgTotal] = useState(0);
  const [cq, setCq] = useQueryState('com_q');
  const dqCq = useDebounced(cq);
  const [leg, setLeg] = useQueryState('com_leg');
  const [approvalF, setApprovalF] = useQueryState('com_appr');
  const [comTab, setComTab] = useQueryState('com_tab');
  const load = async (p = page, size = ps, q = dqCq, lg = leg, appr = approvalF, ap = agrPage, pp = payPage) => {
    setError('');
    try {
      const params = new URLSearchParams({ page: String(p), pageSize: String(size) });
      if (q.trim()) params.set('q', q.trim());
      if (lg) params.set('leg', lg);
      if (appr) params.set('approval', appr);
      const [agRes, comRes, payRes, slabsRes, tplRes] = await Promise.all([
        billingApi.agreements(`?page=${ap}&pageSize=20`).catch(() => null),
        billingApi.commissions(`?${params.toString()}`).catch(() => null),
        billingApi.payouts(`?page=${pp}&pageSize=20`).catch(() => null),
        billingApi.feeSlabs().catch(() => null),
        billingApi.agreementTemplates().catch(() => null),
      ]);
      if (agRes) { setAgreements(unwrapList(agRes)); setAgrTotal(Number((agRes as any)?.pagination?.total || unwrapList(agRes).length)); }
      if (comRes) { setCommissions(unwrapList(comRes)); setTotal(Number((comRes as any)?.pagination?.total || unwrapList(comRes).length)); setSummary((comRes as any)?.summary || (comRes as any)?.data?.summary || null); }
      if (payRes) { setPayouts(unwrapList(payRes)); setPayPgTotal(Number((payRes as any)?.pagination?.total || unwrapList(payRes).length)); }
      if (slabsRes) setSlabs(unwrapList(slabsRes).filter(Boolean));
      if (tplRes) setTemplates(unwrapList(tplRes));
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
  };
  useEffect(() => { setPage(1); setAgrPage(1); setPayPage(1); }, [dqCq, leg, approvalF, ps]);
  useEffect(() => { if (agencyFinanceView && !leg) setLeg('payable'); }, []);
  useEffect(() => { load(page, ps, dqCq, leg, approvalF, agrPage, payPage); }, [page, ps, dqCq, leg, approvalF, agrPage, payPage]);
  const slabOf = (hiringType: string) => slabs.find((s: any) => s.hiringType === hiringType);
  const applyTemplate = (id: string) => {
    const t = templates.find((x: any) => x.id === id);
    setForm((f) => ({ ...f, templateId: id }));
    if (!t) return;
    setForm((f) => ({
      ...f, templateId: id,
      hiringType: t.hiringType || f.hiringType,
      rate: t.rateMin !== undefined && t.rateMax !== undefined ? String(t.rateMin === t.rateMax ? t.rateMin : (t.rateMin + t.rateMax) / 2) : f.rate,
      basisType: t.basisType || f.basisType,
      contractMonths: String(t.contractMonths ?? 12),
      paymentTermsDays: String(t.paymentTermsDays ?? 30),
      replacementDays: String(t.replacementDays ?? 90),
    }));
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.orgId) return;
    try {
      const a = form.templateId
        ? unwrapObj(await billingApi.instantiateTemplate(form.templateId, { orgId: form.orgId, jobId: form.jobId || undefined, hiringType: form.hiringType, rate: Number(form.rate) || undefined, trigger: form.trigger, basisType: form.basisType, contractMonths: Number(form.contractMonths) || 12, autoApprove: form.autoApprove }))
        : unwrapObj(await billingApi.createAgreement({ orgId: form.orgId, jobId: form.jobId || undefined, hiringType: form.hiringType, rate: Number(form.rate) || 8.33, trigger: form.trigger, basisType: form.basisType, contractMonths: Number(form.contractMonths) || 12, paymentTermsDays: Number(form.paymentTermsDays) || 30, replacementDays: Number(form.replacementDays) || 90, autoApprove: form.autoApprove }));
      if (a?.id) setAgreements((x) => [a, ...x]);
      setForm({ orgId: '', jobId: '', hiringType: 'Mid-level IT roles', rate: '8.33', trigger: 'Joined', basisType: 'annual_ctc', contractMonths: '12', paymentTermsDays: '30', replacementDays: '90', templateId: '', autoApprove: false });
      setShowAgreement(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const accept = async (id: string) => {
    try {
      const u = unwrapObj(await billingApi.acceptAgreement(id));
      setAgreements((x) => x.map((a) => (a.id === id ? u : a))); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const basisText = (c: any) => c.basisType === 'monthly_ctc'
    ? `₹${Number(c.feeBasis || 0).toLocaleString('en-IN')}/mo × ${c.contractMonths || 12} mo`
    : `₹${Number(c.feeBasis || 0).toLocaleString('en-IN')} annual`;
  const [approveFor, setApproveFor] = useState<any>(null);
  const [payoutFor, setPayoutFor] = useState<any>(null);
  // Phase 6.2: clawback + payout statement
  const [clawFor, setClawFor] = useState<any>(null);
  const [clawForm, setClawForm] = useState({ amount: '', reason: '', override: false });
  const [clawBusy, setClawBusy] = useState(false);
  const [stmtFor, setStmtFor] = useState<any>(null);
  const [stmtData, setStmtData] = useState<any>(null);
  const doClawback = async () => {
    if (!clawFor || !(Number(clawForm.amount) > 0) || !clawForm.reason.trim()) { setError('Amount + reason required (audit).'); return; }
    setClawBusy(true); setError('');
    try {
      const out = unwrapObj(await billingApi.clawback(clawFor.id, Number(clawForm.amount), clawForm.reason.trim(), clawForm.override)) as any;
      const updated = out?.commission || clawFor;
      setCommissions((x) => x.map((y) => (y.id === clawFor.id ? { ...y, ...updated } : y)));
      if (commDetail?.id === clawFor.id) setCommDetail((d: any) => ({ ...d, ...updated }));
      setClawFor(null); setClawForm({ amount: '', reason: '', override: false });
      setOk(`Clawback recorded on ${clawFor.id} — ledgers recomputed.`);
      load(page, ps, dqCq, leg, approvalF, agrPage, payPage); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setClawBusy(false); }
  };
  const openStatement = async (p: any) => {
    setStmtFor(p); setStmtData(null); setError('');
    try { setStmtData(unwrapObj(await billingApi.payoutStatement(p.id))); }
    catch (e) { setError(errMsg(e)); }
  };
  const approve = async (c: any) => {
    const u = unwrapObj(await billingApi.approveCommission(c.id));
    setCommissions((x) => x.map((y) => (y.id === c.id ? { ...y, ...(u?.id ? u : { approvalStatus: 'Approved' }) } : y)));
    if (commDetail?.id === c.id) setCommDetail((d: any) => ({ ...d, approvalStatus: 'Approved' }));
    setApproveFor(null); setOk(`Commission ${c.id} approved — now billable and payable.`); syncAll();
  };
  const payout = async (c: any) => {
    const p = unwrapObj(await billingApi.payout(c.id));
    if (p?.id) {
      setCommissions((x) => x.map((y) => (y.id === c.id ? { ...y, paymentStatus: 'Paid' } : y)));
      if (commDetail?.id === c.id) setCommDetail((d: any) => ({ ...d, paymentStatus: 'Paid' }));
      load(page, ps, dqCq, leg, approvalF, agrPage, payPage);
    }
    setPayoutFor(null); setOk(`Payout ${p?.id || ''} processed for ${c.id} — both ledgers updated.`); syncAll();
  };
  const [dupInfo, setDupInfo] = useState<{ c: any; result: any } | null>(null);
  const checkDup = async (c: any) => {
    try {
      const key = c.placementId || c.applicationId;
      const res: any = await billingApi.checkDuplicate(`?trigger=${encodeURIComponent(c.trigger || '')}&${c.applicationId ? `applicationId=${c.applicationId}` : `placementId=${key}`}${c.agreementId ? `&agreementId=${c.agreementId}` : ''}`);
      setDupInfo({ c, result: (res as { data?: any })?.data || null });
    } catch (e) { setError(errMsg(e)); }
  };
  const [commDetail, setCommDetail] = useState<any>(null);
  const [agDetail, setAgDetail] = useState<any>(null);
  const [invoiceFor, setInvoiceFor] = useState<any>(null);
  const monthsLeft = (c: any) => c.basisType === 'monthly_ctc' ? Math.max(0, Number(c.contractMonths || 12) - Number(c.billedMonths || 0)) : (c.invoiceId ? 0 : 1);
  const doInvoice = async (c: any) => {
    const monthly = c.basisType === 'monthly_ctc';
    const res = unwrapObj(await billingApi.commissionInvoice(c.id, monthly ? { forMonths: 1 } : undefined)) as any;
    const updated = res?.commission || { ...c, invoiceId: res?.invoice?.id };
    setCommissions((x) => x.map((y) => (y.id === c.id ? { ...y, ...updated } : y)));
    if (commDetail?.id === c.id) setCommDetail((d: any) => ({ ...d, ...updated }));
    setInvoiceFor(null);
    setOk(`Invoice ${res?.invoice?.number || res?.invoice?.id || ''} generated from ${c.id}${monthly ? ` (month ${Number(c.billedMonths || 0) + 1} of ${c.contractMonths || 12}).` : '.'}`);
    syncAll();
  };
  const commMenuFor = (c: any) => (
    <RowMenu label={`Commission ${c.id}`} items={[
      { label: 'View detail', onSelect: () => setCommDetail(c) },
      ...(!agencyFinanceView && c.approvalStatus !== 'Approved' ? [{ label: 'Approve commission…', onSelect: () => setApproveFor(c) }] : []),
      ...(!agencyFinanceView && c.approvalStatus === 'Approved' && monthsLeft(c) > 0 ? [{ label: c.basisType === 'monthly_ctc' ? `Generate month invoice (${Number(c.billedMonths || 0) + 1}/${c.contractMonths || 12})…` : 'Generate invoice…', onSelect: () => setInvoiceFor(c) }] : []),
      ...(!agencyFinanceView && c.approvalStatus === 'Approved' && c.paymentStatus !== 'Paid' ? [{ label: 'Process payout…', onSelect: () => setPayoutFor(c) }] : []),
      ...(!agencyFinanceView ? [{ label: 'Clawback…', onSelect: () => { setClawFor(c); setClawForm({ amount: '', reason: '', override: false }); } }] : []),
      { label: 'Verify uniqueness…', onSelect: () => checkDup(c) },
      { label: 'Adjustments…', onSelect: async () => {
        setAdjustFor(c); setAdjustForm({ amount: '', reason: '' });
        try { setAdjustments(unwrapList(await workforceApi.adjustments(c.id))); }
        catch (e) { setError(errMsg(e)); }
      } },
    ]} />
  );
  const filteredComms = commissions;
  const recvTotal = Number(summary?.receivable || 0);
  const payTotal = Number(summary?.payable || 0);
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
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-extrabold text-slate-900">Commercial — Commissions, Agreements & Templates</h3>
            <InfoTip title="How commissions work" body={<><p>Companies pay NexaTalent on every hire. <strong>Receivable</strong> = company owes the platform; <strong>Payable</strong> = platform owes the agency/contractor.</p><p>Fee basis is the <strong>annual CTC</strong> for direct hires, or <strong>monthly CTC × contract months</strong> for contract/payroll hires — set per agreement. Gross = basis × rate%; GST 18% is added extra.</p><p>Flow: placement triggers a commission (Pending) → <strong>Approve</strong> → optionally <strong>Adjust</strong> → <strong>Generate invoice</strong> (once) → <strong>Process payout</strong>. Every step needs confirmation and is audited.</p></>} />
          </div>
          <div className="flex gap-2">
            <ExportButton filename="commissions.csv" rows={filteredComms} columns={['id', 'orgId', 'agencyId', 'feeBasis', 'basisType', 'rate', 'gross', 'total', 'approvalStatus', 'paymentStatus', 'invoiceId']} />
            {!agencyFinanceView && <button type="button" onClick={() => setShowAgreement(true)} className={btnPrimary}>+ New agreement</button>}
          </div>
        </div>
        <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Commercial views">
          {([['commissions', `Commissions (${total})`], ['agreements', `Agreements (${agrTotal})`], ['templates', `Templates (${templates.length})`]] as const).map(([v, label]) => (
            <button key={v} role="tab" aria-selected={(comTab || 'commissions') === v} type="button" onClick={() => setComTab(v)}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs ${((comTab || 'commissions') === v) ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
          ))}
        </div>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page, ps, dqCq, leg, approvalF, agrPage, payPage)} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {(comTab || 'commissions') === 'commissions' && (<>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200"><div className="text-[10px] font-bold text-blue-700 uppercase">Company receivable{summary ? ` (${summary.count} records)` : ''}</div><div className="text-base font-extrabold">₹{recvTotal.toLocaleString('en-IN')}</div></div>
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200"><div className="text-[10px] font-bold text-purple-700 uppercase">Agency payable</div><div className="text-base font-extrabold">₹{payTotal.toLocaleString('en-IN')}</div></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <SearchSuggest value={cq} onChange={setCq} placeholder="Search commission ID, org, agency, candidate…"
    items={commissions.map((c: any) => ({ key: String(c.id), query: String(c.id), title: String(c.id), meta: [c.orgId, c.agencyId].filter(Boolean).join(' • '), status: c.approvalStatus }))}
    onPick={(it) => { setCq(it.query ?? it.key); setPage(1); }} />
          <div className="w-full lg:w-44 shrink-0">
            <Select value={leg} onChange={setLeg} ariaLabel="Ledger filter" placeholder="Both ledgers"
              options={[{ value: '', label: 'Both ledgers' }, { value: 'receivable', label: 'Receivable only' }, { value: 'payable', label: 'Payable only' }]} />
          </div>
          <div className="w-full lg:w-44 shrink-0">
            <Select value={approvalF} onChange={setApprovalF} ariaLabel="Approval filter" placeholder="All approvals"
              options={[{ value: '', label: 'All approvals' }, { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }]} />
          </div>
          <div className="flex items-center gap-2">
            <PageSize value={ps} onChange={(n) => setPageSize(String(n))} />
          </div>
        </div>
      </>)}
      {(comTab || 'commissions') === 'templates' && (
        <AgreementTemplatesPanel templates={templates} onChanged={reloadTemplates} />
      )}
      <Modal open={showAgreement} onClose={() => setShowAgreement(false)} title="New commission agreement" subtitle="Rate is validated against the hiring-type slab; templates carry payment, replacement and GST terms">
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Field label="Agreement template (optional — fills commercial terms)"><Select value={form.templateId} onChange={applyTemplate} placeholder="Custom terms (no template)" options={[{ value: '', label: 'Custom terms (no template)' }, ...templates.filter((t: any) => t.status === 'Active').map((t: any) => ({ value: t.id, label: `${t.name} v${t.version}` }))]} /></Field></div>
          <Field label="Organization ID *"><input className={kitInput} value={form.orgId} onChange={(e) => setForm({ ...form, orgId: e.target.value })} /></Field>
          <Field label="Job ID (optional)"><input className={kitInput} value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Hiring type *"><Select value={form.hiringType} onChange={(v) => setForm({ ...form, hiringType: v })} options={['Junior IT roles', 'Mid-level IT roles', 'Senior / niche technology roles', 'Leadership / executive search', 'Bulk hiring'].map((h) => ({ value: h, label: h }))} /></Field></div>
          <Field label="Rate % of annual CTC *"><input className={kitInput} type="number" step="0.01" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} /></Field>
          <Field label="Trigger"><Select value={form.trigger} onChange={(v) => setForm({ ...form, trigger: v })} options={[{ value: 'Joined', label: 'Joined' }, { value: 'Offer Accepted', label: 'Offer Accepted' }]} /></Field>
          <Field label="Fee basis"><Select value={form.basisType} onChange={(v) => setForm({ ...form, basisType: v })} options={[{ value: 'annual_ctc', label: 'Annual CTC (direct hire)' }, { value: 'monthly_ctc', label: 'Monthly CTC (contract / payroll)' }]} /></Field>
          <Field label="Contract months (monthly basis)"><input className={kitInput} type="number" min={1} max={36} value={form.contractMonths} onChange={(e) => setForm({ ...form, contractMonths: e.target.value })} /></Field>
          <Field label="Payment within (days of joining)"><input className={kitInput} type="number" min={1} max={60} value={form.paymentTermsDays} onChange={(e) => setForm({ ...form, paymentTermsDays: e.target.value })} /></Field>
          <Field label="Replacement window (days)"><input className={kitInput} type="number" min={0} max={365} value={form.replacementDays} onChange={(e) => setForm({ ...form, replacementDays: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex items-center gap-2 text-xs font-bold text-slate-700">
            <input id="ag-auto" type="checkbox" checked={!!form.autoApprove} onChange={(e) => setForm({ ...form, autoApprove: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="ag-auto">Straight-through billing — auto-approve + auto-invoice on placement (trusted agreements only)</label>
          </div>
          <div className="sm:col-span-2 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            {(() => { const s = slabOf(form.hiringType); if (!s) return 'Slab: loading…'; if (s.negotiated) return `Slab — ${s.hiringType}: ${s.note}. Any rate allowed.`; return `Slab — ${s.hiringType}: ${s.rateMin}%–${s.rateMax}% of ${form.basisType === 'monthly_ctc' ? `monthly CTC × ${form.contractMonths || 12} months` : 'annual CTC'}. GST extra. Payment 15–30 days from joining.`; })()}
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowAgreement(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>{form.templateId ? 'Create from template' : 'Create agreement'}</button>
          </div>
        </form>
      </Modal>
      {(comTab || 'commissions') === 'agreements' && (<>
      <div className="flex items-center gap-1.5">
        <div className="text-xs font-extrabold text-slate-700">Agreements ({agrTotal})</div>
        <InfoTip title="How agreements work" body={<><p>An agreement binds a company to commercial terms: <strong>hiring type → slab rate</strong>, <strong>annual-CTC or monthly-CTC × months</strong> basis, trigger (Joined / Offer Accepted), payment window, replacement window and GST treatment.</p><p>Every placement under an approved agreement auto-mints a commission. The company must <strong>accept</strong> the agreement (tracked with actor + timestamp) before invoicing.</p></>} />
      </div>
      {agreements.length > 0 && (<>
        <div className="space-y-2 md:hidden">
          {agreements.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{a.id}</div>
                  <div className="font-mono text-[11px] text-slate-500">{a.orgId} • {a.hiringType || '—'}</div>
                </div>
                <RowMenu label={`Agreement ${a.id}`} items={[{ label: 'View detail', onSelect: () => setAgDetail(a) }, ...(!a.companyAccepted ? [{ label: 'Mark accepted', onSelect: () => accept(a.id) }] : [])]} />
              </div>
              <div className="font-bold text-slate-700">{a.rate}% • {a.basisType === 'monthly_ctc' ? `monthly × ${a.contractMonths || 12}mo` : 'annual'} • trigger {a.trigger}</div>
              <div><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${a.companyAccepted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{a.companyAccepted ? '✓ company accepted' : 'pending company acceptance'}</span></div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[1020px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Agreement</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Hiring type</th><th className="px-4 py-3 text-right">Rate</th><th className="px-4 py-3">Basis</th><th className="px-4 py-3">Trigger</th><th className="px-4 py-3">Terms</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {agreements.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{a.id}</div><div className="font-mono text-[11px] text-slate-500">{a.templateId ? `from ${a.templateId} v${a.templateVersion || ''}` : 'custom'}</div></td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-700">{a.orgId}</td>
                  <td className="px-4 py-3">{a.hiringType || '—'}</td>
                  <td className="px-4 py-3 text-right font-bold">{a.rate}%</td>
                  <td className="px-4 py-3">{a.basisType === 'monthly_ctc' ? `Monthly × ${a.contractMonths || 12}mo` : 'Annual'}</td>
                  <td className="px-4 py-3">{a.trigger}</td>
                  <td className="px-4 py-3">pay ≤{a.paymentTermsDays || 30}d • repl {a.replacementDays ?? 90}d</td>
                  <td className="px-4 py-3"><span className="font-bold">{a.status}</span><div className={`text-[11px] font-bold ${a.companyAccepted ? 'text-emerald-600' : 'text-amber-600'}`}>{a.companyAccepted ? '✓ accepted' : 'pending acceptance'}</div></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1">
                    {!a.companyAccepted ? <button type="button" onClick={() => accept(a.id)} className="text-[11px] font-bold text-blue-600 underline">Mark accepted</button> : null}
                    <RowMenu label={`Agreement ${a.id}`} items={[{ label: 'View detail', onSelect: () => setAgDetail(a) }]} />
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Pager page={agrPage} total={agrTotal} pageSize={20} onPage={setAgrPage} />
      {agDetail !== null && (
        <DetailDrawer title={`Agreement ${agDetail.id}`} subtitle={`${agDetail.orgId} • ${agDetail.hiringType || ''} @ ${agDetail.rate || ''}% • ${agDetail.status}`} onClose={() => setAgDetail(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[['Trigger', agDetail?.trigger], ['Fee basis', agDetail?.basisType === 'monthly_ctc' ? `Monthly CTC × ${agDetail?.contractMonths || 12} months (contract / payroll)` : 'Annual CTC (direct hire)'], ['Payment window', agDetail?.paymentTermsDays ? `Within ${agDetail.paymentTermsDays} days of joining` : '—'], ['Replacement', agDetail?.replacementDays !== undefined ? `${agDetail.replacementDays} days — ${agDetail?.replacementTerms || 'standard conditions'}` : '—'], ['GST', agDetail?.gstApplicable === false ? 'Not applicable' : `Extra as applicable${agDetail?.taxTreatment ? ` — ${agDetail.taxTreatment}` : ''}`], ['Ownership', agDetail?.ownershipClause || '—'], ['Duplicates', agDetail?.duplicatePolicy || '—'], ['Cancellation', agDetail?.cancellationTerms || '—'], ['Template', agDetail?.templateId ? `${agDetail.templateId} v${agDetail.templateVersion || ''}` : 'custom'], ['Company acceptance', agDetail?.companyAccepted ? `✓ by ${agDetail.acceptedBy} @ ${String(agDetail.acceptedAt || '').slice(0, 16).replace('T', ' ')}` : 'pending']].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1">{String(v ?? '—')}</div></div>
            ))}
          </div>
          <div className="text-xs font-extrabold text-slate-700 pt-1">Agreement document (filled from template)</div>
          {(() => {
            const tpl = templates.find((t: any) => t.id === agDetail?.templateId) || templates.find((t: any) => t.id === 'AGT-STD-001');
            const src = tpl?.bodyHtml
              ? { ...tpl, hiringType: agDetail?.hiringType || tpl.hiringType, rate: agDetail?.rate, paymentTermsDays: agDetail?.paymentTermsDays ?? tpl.paymentTermsDays, replacementDays: agDetail?.replacementDays ?? tpl.replacementDays, gstNote: tpl.gstNote, ownershipClause: agDetail?.ownershipClause || tpl.ownershipClause, duplicatePolicy: agDetail?.duplicatePolicy || tpl.duplicatePolicy, cancellationTerms: agDetail?.cancellationTerms || tpl.cancellationTerms, bodyHtml: tpl.bodyHtml, name: tpl.name }
              : null;
            const html = sanitizeHtml(src ? fillTemplate(src, agDetail?.orgId)
              : `<h2>Placement Services Agreement — ${escHtml(agDetail?.id)}</h2><p>Between <strong>NexaTalent IT Solutions</strong> and <strong>${escHtml(agDetail?.orgId)}</strong>.</p><p>Rate: <strong>${escHtml(agDetail?.rate)}%</strong> of ${agDetail?.basisType === 'monthly_ctc' ? `monthly CTC × ${Number(agDetail?.contractMonths || 12)} months` : 'annual CTC'} (${escHtml(agDetail?.hiringType)}). Payable within <strong>${Number(agDetail?.paymentTermsDays || 30)} days</strong> of joining. GST extra. Replacement within <strong>${Number(agDetail?.replacementDays ?? 90)} days</strong>.</p><p>${escHtml(agDetail?.ownershipClause || '')}</p><p>${escHtml(agDetail?.duplicatePolicy || '')}</p><p>${escHtml(agDetail?.cancellationTerms || '')}</p>`);
            const title = `Agreement ${agDetail?.id}`;
            return (
              <div className="space-y-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs leading-relaxed max-h-[320px] overflow-y-auto" data-lenis-prevent
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
                <div className="flex flex-wrap gap-2">
                  {!agDetail?.companyAccepted ? <button type="button" onClick={() => accept(agDetail.id)} className="px-4 py-2 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs">Mark accepted</button> : null}
                  <button type="button" onClick={async () => { try { await openPdfBlob(await billingApi.agreementPdf(agDetail.id), `Agreement-${agDetail.id}.pdf`); } catch (e) { setError(errMsg(e)); } }} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Download PDF (server)</button>
                  <button type="button" onClick={() => downloadDocFile(title, title, html)} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Download .doc</button>
                  <button type="button" onClick={() => printHtmlDocument(title, html)} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">Print / PDF</button>
                </div>
              </div>
            );
          })()}
        </DetailDrawer>
      )}
      </>)}
      {(comTab || 'commissions') === 'commissions' && (<>
      <div className="text-xs font-extrabold text-slate-700">Commissions ({total})</div>
      {filteredComms.length === 0 && <EmptyState title="No commissions yet" message="Placement triggers auto-create commission records from approved agreements." />}
      {filteredComms.length > 0 && (<>
        <div className="space-y-2 md:hidden">
          {filteredComms.map((c) => {
            const stage = stageOf(c);
            return (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{c.id}</div>
                  <div className="font-mono text-[11px] text-slate-500">{c.agencyId ? `payable → ${c.agencyId}` : `receivable ← ${c.orgId}`} • {c.candidateEmail || ''}</div>
                </div>
                {commMenuFor(c)}
              </div>
              <div className="font-bold text-slate-700">Basis {basisText(c)} × {c.rate}% = gross ₹{Number(c.gross || 0).toLocaleString('en-IN')} + GST ₹{Number(c.tax || 0).toLocaleString('en-IN')} = <strong>₹{Number(c.total || c.net || 0).toLocaleString('en-IN')}</strong></div>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{c.approvalStatus}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px]">{c.paymentStatus}</span>
                {c.invoiceId ? <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">invoiced {c.invoiceId}</span> : null}
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
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[1080px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Commission</th><th className="px-4 py-3">Leg</th><th className="px-4 py-3">Candidate</th><th className="px-4 py-3 text-right">Basis × Rate</th><th className="px-4 py-3 text-right">Gross</th><th className="px-4 py-3 text-right">GST</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComms.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{c.id}</div><div className="font-mono text-[11px] text-slate-500">trig {c.trigger || '—'}{c.invoiceId ? ` • inv ${c.invoiceId}` : ''}</div></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${c.agencyId ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{c.agencyId ? `Payable → ${c.agencyId}` : `Receivable ← ${c.orgId}`}</span></td>
                  <td className="px-4 py-3 font-medium">{c.candidateEmail || '—'}</td>
                  <td className="px-4 py-3 text-right font-mono">{basisText(c)} × {c.rate}%</td>
                  <td className="px-4 py-3 text-right font-bold">₹{Number(c.gross || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">₹{Number(c.tax || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-extrabold">₹{Number(c.total || c.net || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><span className="font-bold">{c.approvalStatus}</span><span className="text-slate-500"> / {c.paymentStatus}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end">{commMenuFor(c)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <div className="flex items-center gap-2">
        <div className="flex-1"><Pager page={page} total={total} pageSize={ps} onPage={setPage} /></div>
        <InfoTip title="About this pagination" body={<><p>Server-side pagination: the API returns {ps} records per page ({total} total). Ledger totals above always cover the full filtered set, not just this page.</p></>} />
      </div>
      <div className="text-xs font-extrabold text-slate-700">Payouts ({payPgTotal})</div>
      {payouts.map((p) => (
        <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2 flex-wrap">
          <span>{p.id} • ₹{p.amount} • {p.status}</span>
          <button type="button" onClick={() => openStatement(p)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">Statement…</button>
        </div>
      ))}
      <Pager page={payPage} total={payPgTotal} pageSize={20} onPage={setPayPage} />
      </>)}
      <ActionConfirm
        open={approveFor !== null}
        onCancel={() => setApproveFor(null)}
        title={`Approve commission ${approveFor?.id || ''}`}
        subtitle={`${approveFor?.candidateEmail || ''} • ${approveFor ? basisText(approveFor) : ''} × ${approveFor?.rate || ''}% = ₹${Number(approveFor?.gross || 0).toLocaleString('en-IN')}`}
        why={['Placement trigger fired and the record passed slab validation', 'Approval is the explicit commercial sign-off']}
        steps={['Status moves to Approved', 'Commission becomes billable (Generate invoice) and payable (Process payout)', 'Event recorded with actor + timestamp']}
        consequences={['Money movement is still gated behind payout approval', 'Adjustments remain possible after approval']}
        confirmLabel="Approve commission"
        tone="dark"
        onConfirm={async () => { if (approveFor) await approve(approveFor); }}
      />
      <ActionConfirm
        open={payoutFor !== null}
        onCancel={() => setPayoutFor(null)}
        title={`Process payout — ${payoutFor?.id || ''}`}
        subtitle={`₹${Number(payoutFor?.total || payoutFor?.net || 0).toLocaleString('en-IN')} → ${payoutFor?.agencyId || payoutFor?.orgId || ''}`}
        why={['Commission is Approved and unpaid', 'Payout settles the payable/receivable leg']}
        steps={['Payout record created with settlement date', 'Commission payment status moves to Paid', 'Both ledgers updated + audit event']}
        consequences={['This moves real money — verify bank details off-platform first', 'Reversal is a new adjustment, not a delete']}
        confirmLabel="Process payout"
        tone="dark"
        onConfirm={async () => { if (payoutFor) await payout(payoutFor); }}
      />
      <Modal open={clawFor !== null} onClose={() => setClawFor(null)} title={`Clawback — ${clawFor?.id || ''}`} subtitle="Replacement-window recovery as a negative adjustment. Receivables and payables stay separate.">
        <div className="space-y-3">
          <Field label="Clawback amount (₹) *"><input className={kitInput} type="number" min={1} value={clawForm.amount} onChange={(e) => setClawForm({ ...clawForm, amount: e.target.value })} placeholder="e.g. 50000" /></Field>
          <Field label="Reason *"><input className={kitInput} value={clawForm.reason} onChange={(e) => setClawForm({ ...clawForm, reason: e.target.value })} placeholder="e.g. Candidate exited in week 3 — 50% recovery per terms" /></Field>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <input type="checkbox" checked={clawForm.override} onChange={(e) => setClawForm({ ...clawForm, override: e.target.checked })} /> Outside replacement window — finance override
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setClawFor(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button type="button" disabled={clawBusy || !(Number(clawForm.amount) > 0) || !clawForm.reason.trim()} onClick={doClawback} className={btnDark}>{clawBusy ? 'Recording…' : 'Record clawback'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={stmtFor !== null} onClose={() => { setStmtFor(null); setStmtData(null); }} title={`Payout statement — ${stmtFor?.id || ''}`} subtitle="Printable: payout + commission + agreement + invoices">
        <div className="space-y-3">
          {!stmtData ? <InlineLoading message="Loading statement…" /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[['Payout', stmtData.payout?.id], ['Amount', `₹${Number(stmtData.payout?.amount || 0).toLocaleString('en-IN')}`], ['Status', stmtData.payout?.status], ['Settlement', String(stmtData.payout?.settlementDate || '').slice(0, 10)], ['Commission', stmtData.commission?.id || '—'], ['Candidate', stmtData.commission?.candidateEmail || '—'], ['Agreement', stmtData.agreement ? `${stmtData.agreement.hiringType} @ ${stmtData.agreement.rate}%` : '—'], ['Replacement', stmtData.agreement ? `${stmtData.agreement.replacementDays}d` : '—'], ['Invoices', (stmtData.invoices || []).map((i: any) => `${i.number || i.id} (${i.status})`).join(', ') || 'none yet']].map(([k, v]) => (
                <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => stmtData && printHtmlDocument(`Payout statement ${stmtFor?.id || ''}`, `<h2>Payout ${stmtFor?.id || ''}</h2><pre>${escHtml(JSON.stringify(stmtData, null, 2))}</pre>`)} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Print / Save PDF</button>
          </div>
        </div>
      </Modal>
      <Modal open={dupInfo !== null} onClose={() => setDupInfo(null)} title={`Uniqueness check — ${dupInfo?.c?.id || ''}`}
        subtitle={`${dupInfo?.c?.trigger || ''} • ${dupInfo?.c?.placementId || dupInfo?.c?.applicationId || ''}`}>
        <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <p><strong>What this checks:</strong> whether any other commission shares the same placement/application + trigger + agreement. The platform blocks double-minting with an idempotency key (<span className="font-mono">placement :: trigger :: agreement</span>), so a duplicate can only exist if it was created before the guard or through another agreement.</p>
          {dupInfo?.result?.duplicate
            ? <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 font-bold">Duplicate guard: {dupInfo.result.count} record(s) share placement + trigger ({(dupInfo.result.rows || []).map((r: any) => r.id).join(', ')}). Do not approve or pay twice — adjust or void instead.</div>
            : <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-bold">No duplicate for this placement + trigger — safe to approve.</div>}
        </div>
      </Modal>
      <ActionConfirm
        open={invoiceFor !== null}
        onCancel={() => setInvoiceFor(null)}
        title={`Generate invoice — ${invoiceFor?.id || ''}`}
        subtitle={`${invoiceFor?.candidateEmail || ''} • ${invoiceFor?.jobId || ''}`}
        why={['Commission is Approved', 'One invoice per commission — duplicates are blocked (409)']}
        steps={[`Invoice line: fee basis ₹${Number(invoiceFor?.feeBasis || 0).toLocaleString('en-IN')} × ${invoiceFor?.rate}%${invoiceFor?.basisType === 'monthly_ctc' ? ` — this billing run covers 1 month (month ${Number(invoiceFor?.billedMonths || 0) + 1} of ${invoiceFor?.contractMonths || 12})` : ''}`, 'GST 18% added extra, due date = trigger + payment terms', 'Commission links to the invoice id']}
        consequences={['Invoice is Issued immediately (billable)', 'Amend later via void / credit note only']}
        confirmLabel="Generate invoice"
        tone="dark"
        onConfirm={async () => { if (invoiceFor) await doInvoice(invoiceFor); }}
      />
      {commDetail !== null && (
        <DetailDrawer title={`Commission ${commDetail.id}`} subtitle={`${commDetail.agencyId ? `Payable → ${commDetail.agencyId}` : `Receivable ← ${commDetail.orgId}`} • ${commDetail.approvalStatus} / ${commDetail.paymentStatus}`} onClose={() => setCommDetail(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[['Fee basis', basisText(commDetail)], ['Billed', commDetail.basisType === 'monthly_ctc' ? `${Number(commDetail.billedMonths || 0)} of ${commDetail.contractMonths || 12} months` : (commDetail.invoiceId ? 'invoiced' : 'not billed')], ['Agreement snapshot', commDetail.agreementSnapshot ? `${commDetail.agreementSnapshot.hiringType || ''} @ ${commDetail.agreementSnapshot.rate}% • ${commDetail.agreementSnapshot.basisType === 'monthly_ctc' ? 'monthly' : 'annual'}` : (commDetail.agreementId || '—')], ['Trigger evidence', commDetail.triggerEvidence || commDetail.placementId || commDetail.applicationId || '—'], ['Invoices', [...(commDetail.invoiceIds || []), ...(!commDetail.invoiceIds && commDetail.invoiceId ? [commDetail.invoiceId] : [])].join(', ') || 'none yet'], ['Payouts / balance', (() => { const paid = payouts.filter((x: any) => x.commissionId === commDetail.id).reduce((a: number, x: any) => a + Number(x.amount || 0), 0); return paid > 0 ? `paid ₹${paid.toLocaleString('en-IN')} • bal ₹${Math.max(0, Number(commDetail.total || commDetail.net || 0) - paid).toLocaleString('en-IN')}` : 'unpaid'; })()], ['Rate', `${commDetail.rate}%`], ['Gross', `₹${Number(commDetail.gross || 0).toLocaleString('en-IN')}`], ['Adjustments', `₹${Number(commDetail.adjustments || 0).toLocaleString('en-IN')}`], ['GST (18%)', `₹${Number(commDetail.tax || 0).toLocaleString('en-IN')}`], ['Total', `₹${Number(commDetail.total || commDetail.net || 0).toLocaleString('en-IN')}`], ['Trigger', `${commDetail.trigger || '—'} @ ${String(commDetail.triggerDate || '').slice(0, 10)}`], ['Agreement', commDetail.agreementId || '—'], ['Placement / Application', commDetail.placementId || commDetail.applicationId || '—'], ['Candidate', commDetail.candidateEmail || '—'], ['Job', commDetail.jobId || '—'], ['Invoice', commDetail.invoiceId || 'not generated']].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {commDetail.approvalStatus !== 'Approved' ? <button type="button" onClick={() => setApproveFor(commDetail)} className="px-4 py-2 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs">Approve commission…</button> : null}
            {commDetail.approvalStatus === 'Approved' && monthsLeft(commDetail) > 0 ? <button type="button" onClick={() => { setInvoiceFor(commDetail); }} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">{commDetail.basisType === 'monthly_ctc' ? `Generate month invoice (${Number(commDetail.billedMonths || 0) + 1}/${commDetail.contractMonths || 12})…` : 'Generate invoice…'}</button> : null}
            {commDetail.approvalStatus === 'Approved' && commDetail.paymentStatus !== 'Paid' ? <button type="button" onClick={() => { setPayoutFor(commDetail); }} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Process payout…</button> : null}
            {!agencyFinanceView ? <button type="button" onClick={() => { setClawFor(commDetail); setClawForm({ amount: '', reason: '', override: false }); }} className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs">Clawback…</button> : null}
          </div>
        </DetailDrawer>
      )}
      <Modal open={adjustFor !== null} onClose={() => setAdjustFor(null)} title={`Adjustments — ${adjustFor?.id || ''}`} subtitle="Each entry recomputes gross → GST → total; nothing is ever edited or deleted">
        <div className="space-y-3">
          <div className="flex items-start gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            <InfoTip title="How adjustments work" body={<><p>An adjustment is a <strong>new ledger entry</strong> (positive = add-on, negative = deduction). The commission's <strong>gross, 18% GST and total recompute immediately</strong> and every entry keeps its reason + author + timestamp.</p><p>Adjustments are <strong>idempotent</strong> (same amount + reason won't double-post) and require the <strong>adjust_commission</strong> permission. Approved commissions can still be adjusted; already-generated invoices must be amended via void / credit note instead.</p></>} />
            <span>Current gross ₹{Number(adjustFor?.gross || 0).toLocaleString('en-IN')} • adjustments ₹{Number(adjustFor?.adjustments || 0).toLocaleString('en-IN')} • total ₹{Number(adjustFor?.total || adjustFor?.net || 0).toLocaleString('en-IN')}</span>
          </div>
          {adjustments.length === 0 && <div className="text-[11px] text-slate-500 font-medium">No adjustments yet.</div>}
          {(() => {
            let running = Number(adjustFor?.gross || 0) - adjustments.reduce((a: number, x: any) => a + Number(x.amount || 0), 0);
            return [...adjustments].reverse().map((a) => {
              running += Number(a.amount || 0);
              return (
                <div key={a.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between gap-2">
                  <span>{Number(a.amount) >= 0 ? '+' : ''}₹{a.amount} • {a.reason || 'no reason'} • by {a.by} • {String(a.createdAt || '').slice(0, 16).replace('T', ' ')}</span>
                  <span className="text-slate-500 shrink-0">gross → ₹{running.toLocaleString('en-IN')}</span>
                </div>
              );
            });
          })()}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!adjustFor || !adjustForm.amount || !adjustForm.reason.trim()) { setError('Adjustment amount + reason are required.'); return; }
              try {
                const created = unwrapObj(await workforceApi.adjustCommission(adjustFor.id, Number(adjustForm.amount), adjustForm.reason.trim()));
                if (created?.id) setAdjustments((x) => [created, ...x]);
                setAdjustForm({ amount: '', reason: '' });
                setOk(`Adjustment ₹${Number(created?.amount || 0).toLocaleString('en-IN')} posted — totals recomputed.`);
                load(page, ps, dqCq, leg, approvalF, agrPage, payPage); syncAll();
              } catch (e) { setError(errMsg(e)); }
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200"
          >
            <input className={kitInput} type="number" step="0.01" placeholder="Amount (±) *" value={adjustForm.amount} onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })} />
            <input className={kitInput} placeholder="Reason *" value={adjustForm.reason} onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} />
            <button className={btnDark}>Add adjustment</button>
          </form>
          {adjustForm.amount ? (
            <div className="text-[11px] font-bold text-slate-600">Projected: gross ₹{(Number(adjustFor?.gross || 0) + Number(adjustForm.amount || 0)).toLocaleString('en-IN')} → total ₹{((Number(adjustFor?.gross || 0) + Number(adjustForm.amount || 0)) * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          ) : null}
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
  const [form, setForm] = useState({ contactName: '', designation: '', companyName: '', website: '', email: '', phone: '', industry: '', companySize: '', location: '', source: '', service: '', hiringNeed: '', openings: '', budget: '', closeDate: '', priority: 'Medium', owner: '', branch: '', nextFollowUp: '', value: '', notes: '', consent: '' });
  const [view, setView] = useQueryState('lead_view');
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
  const [stageF, setStageF] = useQueryState('lead_stage');
  const [editing, setEditing] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [deleteFor, setDeleteFor] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const pageSize = 10;
  const load = async (p = page, st = stageF) => {
    setLoading(true); setError('');
    try {
      const res: any = await salesApi.leads(`?page=${p}&pageSize=${pageSize}${st ? `&status=${encodeURIComponent(st)}` : ''}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || unwrapList(res).length));
    } catch (e) { setError(errMsg(e)); setLoadError(errStatus(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { setPage(1); }, [stageF]);
  useEffect(() => { load(page, stageF); }, [page, stageF ]);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.contactName.trim() || !form.companyName.trim()) return;
    setBusy(true);
    try {
      const l = unwrapObj(await salesApi.createLead({ ...form, value: Number(form.value) || undefined, budget: Number(form.budget) || undefined, openings: Number(form.openings) || undefined }));
      if (l?.id) setRows((x) => [l, ...x]);
      setForm({ contactName: '', designation: '', companyName: '', website: '', email: '', phone: '', industry: '', companySize: '', location: '', source: '', service: '', hiringNeed: '', openings: '', budget: '', closeDate: '', priority: 'Medium', owner: '', branch: '', nextFollowUp: '', value: '', notes: '', consent: '' });
      setShowCreate(false);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const move = async (id: string, stage: string, reasonOverride?: string) => {
    const eff = reasonOverride ?? reason;
    if (stage === 'Lost' && !eff.trim()) { setError('A lost reason is required.'); return; }
    try { const u = unwrapObj(await salesApi.setLeadStage(id, stage, eff || undefined)); setRows((x) => x.map((l) => (l.id === id ? u : l))); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const convert = async (id: string) => {
    try { await salesApi.convert(id); load(); syncAll(); }
    catch (e) { setError(errMsg(e)); }
  };
  const openLeadDetail = async (l: any) => {
    setDetail(l);
    try { setActivities(unwrapList(await salesApi.activities(l.id))); } catch { setActivities([]); }
  };
  // Deep-link from Website Leads: /leads?open_lead=LEAD-xxx opens the 360° drawer
  const [openLeadParam] = useQueryState('open_lead');
  useEffect(() => {
    if (!openLeadParam) return;
    let cancelled = false;
    (async () => {
      try {
        const res: any = await salesApi.leads(`?page=1&pageSize=200&q=${encodeURIComponent(openLeadParam)}`);
        const list = unwrapList(res);
        const found = list.find((l: any) => l.id === openLeadParam) || list[0];
        if (found && !cancelled) openLeadDetail(found);
      } catch { /* lead may not exist — ignore */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openLeadParam]);
  const dropMove = (l: any, to: string) => {
    if (to === l.stage || l.mergedInto) return;
    if (to === 'Lost' && !reason.trim()) { setError('Type a lost reason in the note box first — it is recorded with the move.'); return; }
    if (to === 'Won') { setConvertId(l.id); return; }
    move(l.id, to);
  };
  const filteredLeads = rows.filter((l) => !dqLead.trim() || `${l.id} ${l.contactName} ${l.companyName} ${l.email}`.toLowerCase().includes(dqLead.toLowerCase()));
  const [leadMoveFor, setLeadMoveFor] = useState<{ lead: any; to: string } | null>(null);
  const leadMenuFor = (l: any) => (
    <RowMenu label={`Actions for ${l.id}`} items={[
      { label: 'View 360°', onSelect: () => openLeadDetail(l) },
      { label: 'Edit lead…', onSelect: () => setEditing({ ...l }) },
      ...LEAD_STAGES.filter((s) => s !== l.stage).map((s) => ({ label: `Move to ${s}…`, onSelect: () => { if (s === 'Lost' && !reason.trim()) { setError('Type a lost reason in the note box first — it is recorded with the move.'); return; } setLeadMoveFor({ lead: l, to: s }); } })),
      { label: 'Log meeting', onSelect: () => { setMeetingLead(l); setMeetingForm({ title: 'Follow-up meeting', date: '', hour: '10', minute: '00', outcome: '', notes: '', nextAction: '', followUp: '' }); } },
      { label: 'Proposals', onSelect: async () => { setProposalLead(l); setProposalForm({ title: '', amount: '', validUntil: '' }); try { setProposals(unwrapList(await salesApi.proposals(l.id))); } catch (e) { setError(errMsg(e)); } } },
      { label: 'New opportunity', onSelect: () => { setOppLead(l); setOppValue(String(l.value || '')); } },
      { label: 'Convert to company', onSelect: () => setConvertId(l.id) },
      ...(l.stage !== 'Won' && !l.mergedInto ? [{ label: 'Merge duplicates…', onSelect: () => { setMergeFor(l); setMergeTarget(''); setMergeReason(''); setMergeQ(''); } }] : []),
      { label: 'Delete…', danger: true, onSelect: () => setDeleteFor(l) },
    ]} />
  );
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
          <div className="flex gap-2 items-center">
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5" role="tablist" aria-label="Leads view">
              {(['list', 'board'] as const).map((v) => (
                <button key={v} role="tab" aria-selected={(view || 'list') === v} type="button" onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs capitalize ${((view || 'list') === v) ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{v}</button>
              ))}
            </div>
            <ExportButton filename="leads.csv" rows={filteredLeads} columns={['id', 'contactName', 'companyName', 'email', 'stage', 'value', 'owner']} />
            <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New lead</button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <SearchSuggest value={q} onChange={setQ} placeholder="Search contact, company, email, ID…"
    items={rows.map((l: any) => ({ key: String(l.id), query: String(l.id), title: String(l.contactName || l.id), meta: [l.companyName, l.email].filter(Boolean).join(' • '), status: l.stage }))}
    onPick={(it) => { setQ(it.query ?? it.key); setPage(1); }} />
          <div className="w-full lg:w-44 shrink-0">
            <Select value={stageF} onChange={setStageF} ariaLabel="Stage filter" placeholder="All stages"
              options={[{ value: '', label: 'All stages' }, ...LEAD_STAGES.map((s) => ({ value: s, label: s }))]} />
          </div>
        </div>
      </div>
      {error && <PanelError message={error} status={loadError} onRetry={() => load(page, stageF)} />}
      {okMerge && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{okMerge}</div>}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New lead" subtitle="New → Contacted → Qualified → … → Won / Lost" wide>
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Contact name *"><input className={kitInput} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></Field>
          <Field label="Designation"><input className={kitInput} value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. VP Engineering" /></Field>
          <Field label="Company *"><input className={kitInput} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Field>
          <Field label="Website"><input className={kitInput} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://…" /></Field>
          <Field label="Business email"><input className={kitInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><input className={kitInput} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Industry"><input className={kitInput} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Fintech" /></Field>
          <Field label="Company size"><Select value={form.companySize} onChange={(v) => setForm({ ...form, companySize: v })} placeholder="Select size" options={['1–10', '11–50', '51–200', '201–1000', '1000+'].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="Location"><input className={kitInput} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Lead source"><Select value={form.source} onChange={(v) => setForm({ ...form, source: v })} placeholder="Select source" options={['Website', 'Referral', 'LinkedIn', 'Cold outreach', 'Event', 'Partner', 'Other'].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="Interested service"><Select value={form.service} onChange={(v) => setForm({ ...form, service: v })} placeholder="Select service" options={['Direct hiring', 'Contract staffing', 'Payroll services', 'Executive search', 'Bulk hiring', 'Other'].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="Estimated openings"><input className={kitInput} type="number" min={0} value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Hiring need"><textarea rows={2} className={kitInput} value={form.hiringNeed} onChange={(e) => setForm({ ...form, hiringNeed: e.target.value })} placeholder="Roles, stacks, timelines…" /></Field></div>
          <Field label="Budget / deal value"><input className={kitInput} type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></Field>
          <Field label="Deal value (legacy)"><input className={kitInput} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
          <Field label="Expected close date"><DatePicker value={form.closeDate} onChange={(v) => setForm({ ...form, closeDate: v })} ariaLabel="Expected close date" /></Field>
          <Field label="Priority"><Select value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={['Low', 'Medium', 'High'].map((p) => ({ value: p, label: p }))} /></Field>
          <Field label="Owner"><input className={kitInput} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Defaults to you" /></Field>
          <Field label="Branch"><input className={kitInput} value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} /></Field>
          <Field label="Next follow-up"><DatePicker value={form.nextFollowUp} onChange={(v) => setForm({ ...form, nextFollowUp: v })} /></Field>
          <div><Field label="Notes"><input className={kitInput} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Communication consent / lawful basis" hint="Required for outreach — e.g. 'opt-in via website form, 2026-10-01'"><input className={kitInput} value={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.value })} placeholder="How did this contact consent to outreach?" /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
            <button className={btnPrimary} disabled={busy}>Add lead</button>
          </div>
        </form>
      </Modal>
      <input className={inputCls} placeholder="Lost reason (required when marking Lost)" value={reason} onChange={(e) => setReason(e.target.value)} />
      {(view || 'list') === 'board' ? (
        loading ? <InlineLoading message="Loading board…" /> : <LeadsKanban leads={filteredLeads} onOpen={(l) => openLeadDetail(l)} onDropMove={dropMove} />
      ) : loading ? <InlineLoading message="Loading leads…" /> : filteredLeads.length === 0 ? (
        <EmptyState title="No leads" message="Add the first sales lead to start the pipeline." />
      ) : (<>
        <div className="space-y-2 md:hidden">
          {filteredLeads.map((l) => (
            <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{l.contactName} — {l.companyName}</div>
                  <div className="font-mono text-[11px] text-slate-500">{l.id} • owner {l.owner || '—'}</div>
                </div>
                {leadMenuFor(l)}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${LEAD_STAGE_TONE[l.stage] || LEAD_STAGE_TONE.New}`}>{l.stage}</span>
                <span className="font-bold">₹{Number(l.value || 0).toLocaleString('en-IN')}</span>
                {l.mergedInto ? <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px]">merged → {l.mergedInto}</span> : null}
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Lead</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3 text-right">Value</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Follow-up</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{l.contactName}</div><div className="font-mono text-[11px] text-slate-500">{l.id}</div></td>
                  <td className="px-4 py-3">{l.companyName}{l.mergedInto ? <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px]">merged</span> : null}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${LEAD_STAGE_TONE[l.stage] || LEAD_STAGE_TONE.New}`}>{l.stage}</span></td>
                  <td className="px-4 py-3 text-right font-bold">₹{Number(l.value || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">{l.owner || '—'}</td>
                  <td className="px-4 py-3">{String(l.nextFollowUp || '').slice(0, 10) || '—'}</td>
                  <td className="px-4 py-3"><div className="flex justify-end">{leadMenuFor(l)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      <ActionConfirm
        open={leadMoveFor !== null}
        onCancel={() => setLeadMoveFor(null)}
        title={`Move to ${leadMoveFor?.to || ''} — ${leadMoveFor?.lead?.id || ''}`}
        subtitle={`${leadMoveFor?.lead?.contactName || ''} • ${leadMoveFor?.lead?.companyName || ''} (currently ${leadMoveFor?.lead?.stage || ''})`}
        why={[`Lead is currently ${leadMoveFor?.lead?.stage || ''}`, leadMoveFor?.to === 'Lost' ? 'Lost closes the lead with a recorded reason' : `Moving to ${leadMoveFor?.to || ''} advances the pipeline`]}
        steps={[`Stage moves to ${leadMoveFor?.to || ''}`, 'History entry with actor + timestamp']}
        consequences={leadMoveFor?.to === 'Lost' ? ['Lead leaves the active pipeline'] : []}
        requireReason={leadMoveFor?.to === 'Lost'}
        reasonLabel="Lost reason *"
        confirmLabel={`Move to ${leadMoveFor?.to || ''}`}
        tone={leadMoveFor?.to === 'Lost' ? 'danger' : 'dark'}
        onConfirm={async (r) => { if (leadMoveFor) { await move(leadMoveFor.lead.id, leadMoveFor.to, r); setLeadMoveFor(null); } }}
      />
      <ActionConfirm
        open={convertId !== ''}
        onCancel={() => setConvertId('')}
        title="Convert lead to company"
        subtitle={convertId}
        why={['Lead reached Won — conversion provisions the client organization', 'History and linked records carry over']}
        steps={['New organization created from lead data', 'Lead marked Won with conversion trail', 'Opportunities link to the new company']}
        consequences={['A duplicate organization check runs first — convert, don’t re-enter']}
        confirmLabel="Convert to company"
        tone="dark"
        onConfirm={async () => { await convert(convertId); setConvertId(''); }}
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

/* ---------------- Leads Kanban (drop moves stage; Won routes to convert, Lost needs a reason) ---------------- */
const LEAD_KANBAN_ORDER = ['New', 'Contacted', 'Qualified', 'Discovery Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurture'];
const LEAD_STAGE_TONE: Record<string, string> = {
  New: 'bg-slate-100 text-slate-600 border-slate-200', Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  Qualified: 'bg-indigo-50 text-indigo-700 border-indigo-200', 'Discovery Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  'Proposal Sent': 'bg-amber-50 text-amber-700 border-amber-200', Negotiation: 'bg-orange-50 text-orange-700 border-orange-200',
  Won: 'bg-emerald-50 text-emerald-700 border-emerald-200', Lost: 'bg-red-50 text-red-700 border-red-200', Nurture: 'bg-teal-50 text-teal-700 border-teal-200',
};

export function LeadsKanban({ leads, onOpen, onDropMove }: { leads: any[]; onOpen: (l: any) => void; onDropMove: (l: any, to: string) => void }) {
  const [dragId, setDragId] = useState<string | null>(null);
  const cols = LEAD_KANBAN_ORDER.map((s) => ({ stage: s, items: leads.filter((l) => l.stage === s) }));
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-3" data-lenis-prevent>
      <div className="flex gap-3 min-w-[1180px] items-start">
        {cols.map((c) => (
          <div key={c.stage} className="flex-1 min-w-[190px] rounded-2xl bg-white border border-slate-200 p-2 flex flex-col max-h-[62vh]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const l = leads.find((x) => x.id === dragId);
              setDragId(null);
              if (l && c.stage !== l.stage) onDropMove(l, c.stage);
            }}>
            <div className="flex items-center justify-between px-1 pb-1.5 sticky top-0 bg-white z-10">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${LEAD_STAGE_TONE[c.stage] || LEAD_STAGE_TONE.New}`}>{c.stage}</span>
              <span className="text-[11px] font-extrabold text-slate-400">{c.items.length}</span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-0.5" data-lenis-prevent>
            {c.items.map((l) => (
              <div key={l.id} draggable onDragStart={() => setDragId(l.id)}
                onClick={() => onOpen(l)}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-grab active:cursor-grabbing hover:border-[#0B5FD9]">
                <div className="font-extrabold text-slate-900 truncate">{l.contactName}</div>
                <div className="text-slate-500 font-medium truncate">{l.companyName}</div>
                <div className="font-mono text-[10px] text-slate-400">{l.id} • ₹{Number(l.value || 0).toLocaleString('en-IN')}</div>
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Phase 4: Performance ---------------- */

/* ---------------- Phase 4: Performance ---------------- */
export function PerformancePanel() {
  const navigate = useNavigate();
  const drillToLead = (leadId: string) => {
    const base = window.location.pathname.startsWith('/employee') ? '/employee' : '/superadmin';
    navigate(`${base}/leads?lead_q=${encodeURIComponent(leadId)}`);
  };
  const [leadDrawer, setLeadDrawer] = useState<any>(null);
  const [leadActs, setLeadActs] = useState<any[]>([]);
  const openLeadDrawer = async (leadId: string) => {
    setLeadDrawer({ id: leadId }); setLeadActs([]);
    try {
      const [lRes, aRes] = await Promise.all([
        salesApi.leads(`?page=1&pageSize=5&q=${encodeURIComponent(leadId)}`).catch(() => null),
        salesApi.activities(leadId).catch(() => null),
      ]);
      const found = unwrapList(lRes).find((l: any) => l.id === leadId) || unwrapList(lRes)[0] || { id: leadId };
      setLeadDrawer(found);
      setLeadActs(unwrapList(aRes));
    } catch { /* header-only fallback */ }
  };
  const [kpi, setKpi] = useState<any>(null);
  const [targets, setTargets] = useState<any[]>([]);
  const [opps, setOpps] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ owner: '', period: '', goal: '' });
  const [showTarget, setShowTarget] = useState(false);
  const [editingTargetState, setEditingTargetState] = useState('');
  const [fFrom, setFFrom] = useQueryState('perf_from');
  const [fTo, setFTo] = useQueryState('perf_to');
  const [fOwner, setFOwner] = useQueryState('perf_owner');
  const [fSource, setFSource] = useQueryState('perf_source');
  const [fService, setFService] = useQueryState('perf_service');
  const [fStage, setFStage] = useQueryState('perf_stage');
  const [fBranch, setFBranch] = useQueryState('perf_branch');
  const [drill, setDrill] = useState<{ title: string; subtitle: string; columns: string[]; rows: string[][] } | null>(null);
  const perfParams = () => {
    const sp = new URLSearchParams();
    if (fFrom) sp.set('from', fFrom);
    if (fTo) sp.set('to', fTo);
    if (fOwner) sp.set('owner', fOwner);
    if (fSource) sp.set('source', fSource);
    if (fService) sp.set('service', fService);
    if (fStage) sp.set('stage', fStage);
    if (fBranch) sp.set('branch', fBranch);
    const qs = sp.toString();
    return qs ? `?${qs}` : '';
  };
  const load = async () => {
    setError('');
    try { setKpi(unwrapObj(await salesApi.performance(perfParams()))); setTargets(unwrapList(await salesApi.targets())); setOpps(unwrapList(await salesApi.opportunities())); }
    catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, [fFrom, fTo, fOwner, fSource, fService, fStage, fBranch]);
  const drillLeads = async (title: string, stage?: string, pick?: (l: any) => boolean) => {
    try {
      const sp = new URLSearchParams({ page: '1', pageSize: '50' });
      if (stage) sp.set('status', stage);
      if (fOwner) sp.set('q', fOwner);
      const res: any = await salesApi.leads(`?${sp.toString()}`);
      const list = unwrapList(res).filter((l: any) => (!fOwner || l.owner === fOwner) && (!stage || l.stage === stage) && (!pick || pick(l)));
      setDrill({ title, subtitle: `${list.length} record(s) behind this metric`, columns: ['Lead', 'Company', 'Stage', 'Value', 'Owner'], rows: list.map((l: any) => [`${l.contactName} (${l.id})`, l.companyName, l.stage, `₹${Number(l.value || 0).toLocaleString('en-IN')}`, l.owner || '—']) });
    } catch (e) { setError(errMsg(e)); }
  };
  const drillMeetings = async () => {
    try {
      const res: any = await salesApi.meetings();
      const list = unwrapList(res).filter((m: any) => !fOwner || m.owner === fOwner).slice(0, 50);
      setDrill({ title: 'Meetings booked', subtitle: `${list.length} record(s) behind this metric`, columns: ['Meeting', 'Lead', 'When', 'Outcome'], rows: list.map((m: any) => [`${m.title} (${m.id})`, m.leadId, String(m.at || '').slice(0, 16).replace('T', ' '), m.outcome || '—']) });
    } catch (e) { setError(errMsg(e)); }
  };
  const drillProposals = async () => {
    try {
      const res: any = await salesApi.proposals();
      const list = unwrapList(res).filter((p: any) => !fOwner || p.owner === fOwner).slice(0, 50);
      setDrill({ title: 'Proposals sent', subtitle: `${list.length} record(s) behind this metric`, columns: ['Proposal', 'Lead', 'Amount', 'Status'], rows: list.map((p: any) => [`${p.title} (${p.id})`, p.leadId, `₹${Number(p.amount || 0).toLocaleString('en-IN')}`, p.status || '—']) });
    } catch (e) { setError(errMsg(e)); }
  };
  const drillRevenue = async () => {
    try {
      const res: any = await salesApi.opportunities('?page=1&pageSize=100');
      const list = unwrapList(res).filter((o: any) => o.stage === 'Won' && (!fOwner || o.owner === fOwner));
      setDrill({ title: 'Revenue booked', subtitle: `${list.length} won opportunitie(s)`, columns: ['Opportunity', 'Value', 'Owner'], rows: list.map((o: any) => [`${o.title} (${o.id})`, `₹${Number(o.value || 0).toLocaleString('en-IN')}`, o.owner || '—']) });
    } catch (e) { setError(errMsg(e)); }
  };
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <Field label="From"><DatePicker value={fFrom} onChange={setFFrom} ariaLabel="From date" /></Field>
        <Field label="To"><DatePicker value={fTo} onChange={setFTo} ariaLabel="To date" /></Field>
        <Field label="Salesperson"><Select value={fOwner} onChange={setFOwner} placeholder="All" options={[{ value: '', label: 'All' }, ...((kpi?.filters?.owners || []) as string[]).map((o: string) => ({ value: o, label: o }))]} /></Field>
        <Field label="Lead source"><Select value={fSource} onChange={setFSource} placeholder="All" options={[{ value: '', label: 'All' }, ...((kpi?.filters?.sources || []) as string[]).map((o: string) => ({ value: o, label: o }))]} /></Field>
        <Field label="Service"><Select value={fService} onChange={setFService} placeholder="All" options={[{ value: '', label: 'All' }, ...((kpi?.filters?.services || []) as string[]).map((o: string) => ({ value: o, label: o }))]} /></Field>
        <Field label="Stage"><Select value={fStage} onChange={setFStage} placeholder="All" options={[{ value: '', label: 'All' }, ...LEAD_STAGES.map((s) => ({ value: s, label: s }))]} /></Field>
        <Field label="Branch"><Select value={fBranch} onChange={setFBranch} placeholder="All" options={[{ value: '', label: 'All' }, ...((kpi?.filters?.branches || []) as string[]).map((o: string) => ({ value: o, label: o }))]} /></Field>
        <div className="flex items-end"><button type="button" onClick={() => { setFFrom(''); setFTo(''); setFOwner(''); setFSource(''); setFService(''); setFStage(''); setFBranch(''); }} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs">Clear filters</button></div>
      </div>
      {kpi ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {([
            ['Assigned', kpi.leadsAssigned, () => drillLeads('Assigned leads')],
            ['Contacted', kpi.contacted, () => drillLeads('Contacted leads', 'Contacted')],
            ['Qualified', kpi.qualified, () => drillLeads('Qualified leads', 'Qualified')],
            ['Meetings', kpi.meetingsBooked, () => drillMeetings()],
            ['Proposals', kpi.proposals, () => drillProposals()],
            ['Won', kpi.won, () => drillLeads('Won leads', 'Won')],
            ['Lost', kpi.lost, () => drillLeads('Lost leads', 'Lost')],
            ['Conversion', `${(Number(kpi.conversionRate || 0) * 100).toFixed(1)}%`, () => drillLeads('Converted (Won) leads', 'Won')],
            ['Pipeline ₹', Number(kpi.pipelineValue || 0).toLocaleString('en-IN'), () => drillLeads('Pipeline leads by value')],
            ['Revenue ₹', Number(kpi.revenueBooked || 0).toLocaleString('en-IN'), () => drillRevenue()],
            ['Avg resp.', `${kpi.avgResponseHrs ?? '—'}h`, () => drillLeads('Responded leads')],
            ['Overdue', kpi.overdueFollowups, () => drillLeads('Overdue follow-ups', undefined, (l) => !!(l.nextFollowUp && new Date(l.nextFollowUp) < new Date()))],
          ] as Array<[string, unknown, () => void]>).map(([k, v, go]) => (
            <button key={k as string} type="button" onClick={go} title={`Drill into ${k}`}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-[#0B5FD9] hover:shadow-sm transition cursor-pointer">
              <div className="text-[10px] font-bold text-slate-500 truncate">{k} <span className="text-[#0B5FD9]">→</span></div>
              <div className="text-base font-extrabold truncate">{String(v)}</div>
            </button>
          ))}
        </div>
      ) : <InlineLoading message="Loading performance…" />}
      <Modal open={drill !== null} onClose={() => setDrill(null)} title={drill?.title || ''} subtitle={drill?.subtitle || ''} wide>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              {(drill?.columns || []).map((c) => <th key={c} className="px-4 py-3">{c}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(drill?.rows || []).map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/70">{r.map((cell, j) => <td key={j} className="px-4 py-2.5 font-medium">{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        {(drill?.rows || []).length === 0 && <div className="text-xs text-slate-500">No source records behind this metric for the current filters.</div>}
      </Modal>
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
      {opps.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No opportunities yet — create one from a lead.</div> : (<>
        <div className="space-y-2 md:hidden">
          {opps.map((o) => (
            <div key={o.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{o.title}</div>
                  <div className="font-mono text-[11px] text-slate-500">{o.id}{o.leadId ? ` • ${o.leadId}` : ''}</div>
                </div>
                <button type="button" className="text-[11px] font-bold text-blue-600 underline shrink-0" onClick={() => o.leadId && openLeadDrawer(o.leadId)}>View lead</button>
              </div>
              <div className="font-bold">₹{Number(o.value || 0).toLocaleString('en-IN')} • <strong className="text-blue-600">{o.stage}</strong></div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Opportunity</th><th className="px-4 py-3 text-right">Value</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Lead</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {opps.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{o.title}</div><div className="font-mono text-[11px] text-slate-500">{o.id}</div></td>
                  <td className="px-4 py-3 text-right font-extrabold">₹{Number(o.value || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><strong className="text-blue-600">{o.stage}</strong></td>
                  <td className="px-4 py-3 font-mono">{o.leadId || '—'}</td>
                  <td className="px-4 py-3"><div className="flex justify-end items-center gap-1">
                    {o.leadId ? <button type="button" className="text-[11px] font-bold text-blue-600 underline" onClick={() => openLeadDrawer(o.leadId)}>View lead</button> : null}
                    <RowMenu label="Opportunity actions" items={['Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'].filter((s) => s !== o.stage).map((s) => ({ label: `Move to ${s}`, danger: s === 'Lost', onSelect: async () => {
                      try { const u = unwrapObj(await salesApi.setOpportunityStage(o.id, s)); setOpps((x) => x.map((y) => (y.id === o.id ? u : y))); syncAll(); }
                      catch (e) { setError(errMsg(e)); }
                    } }))} />
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      {leadDrawer !== null && (
        <DetailDrawer title={`${leadDrawer.contactName || leadDrawer.id || ''}`} subtitle={`${leadDrawer.id || ''} • ${leadDrawer.companyName || ''} • ${leadDrawer.stage || ''}`} onClose={() => setLeadDrawer(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[['Contact', leadDrawer.contactName], ['Company', leadDrawer.companyName], ['Email', leadDrawer.email], ['Phone', leadDrawer.phone], ['Stage', leadDrawer.stage], ['Value', leadDrawer.value !== undefined ? `₹${Number(leadDrawer.value || 0).toLocaleString('en-IN')}` : undefined], ['Owner', leadDrawer.owner], ['Next follow-up', leadDrawer.nextFollowUp], ['Source', leadDrawer.source], ['Industry', leadDrawer.industry], ['Notes', leadDrawer.notes]].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
            ))}
          </div>
          <div className="text-xs font-extrabold pt-1">Activity timeline ({leadActs.length})</div>
          {leadActs.length === 0 ? <div className="text-[11px] text-slate-500">No activities logged.</div> : leadActs.slice(0, 10).map((a: any) => (
            <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"><strong>{a.type}</strong> • {a.outcome || '—'} • <span className="text-slate-500">{String(a.createdAt || '').slice(0, 10)}</span><div className="text-slate-600">{a.notes || ''}</div></div>
          ))}
          <button type="button" onClick={() => { setLeadDrawer(null); drillToLead(leadDrawer.id); }} className="text-[11px] font-bold text-blue-600 underline w-fit">Open full lead workspace →</button>
        </DetailDrawer>
      )}
    </div>
  );
}

/* ---------------- Phase 4: Submissions ---------------- */
export function SubmissionsPanel({ canReview = false }: { canReview?: boolean }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'review' | 'shortlisted' | 'rejected' | 'duplicates'>('all');
  const [form, setForm] = useState({ jobId: '', candidateEmail: '', consent: '' });
  const [busy, setBusy] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'candidate' | 'review'>('overview');
  const [candProfile, setCandProfile] = useState<any>(null);
  const [candApps, setCandApps] = useState<any[]>([]);
  const [candLoading, setCandLoading] = useState(false);
  const pageSize = 20;
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
      setForm({ jobId: '', candidateEmail: '', consent: '' });
      setShowSubmit(false);
      setOk(s?.status === 'Duplicate-Review' ? 'Submitted — flagged as duplicate for review.' : 'Candidate submitted.');
      if (page === 1) load(1); else setPage(1);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const [reviewFor, setReviewFor] = useState<{ s: any; to: string } | null>(null);
  const doReview = async () => {
    if (!reviewFor) return;
    setBusy(true);
    try {
      const u = unwrapObj(await salesApi.setSubmission(reviewFor.s.id, reviewFor.to));
      setRows((x) => x.map((s) => (s.id === reviewFor.s.id ? u : s)));
      if (detail?.id === reviewFor.s.id) setDetail(u);
      setReviewFor(null); syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const doAccept = async (s: any) => {
    setBusy(true); setError(''); setOk('');
    try {
      const out = unwrapObj(await salesApi.acceptSubmission(s.id));
      const appId = (out as { application?: { id?: string } })?.application?.id;
      const upd = { ...s, status: 'Shortlisted', applicationId: appId };
      setRows((x) => x.map((r) => (r.id === s.id ? upd : r)));
      if (detail?.id === s.id) setDetail(upd);
      setOk(`Accepted into pipeline — application ${appId || ''} created.`);
      syncAll();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  const openDetail = async (s: any) => {
    setDetail(s); setDetailTab('overview'); setCandProfile(null); setCandApps([]); setCandLoading(true);
    try {
      const res: any = await talentApi.search('preview', s.candidateEmail || '');
      const list = unwrapList(res);
      setCandProfile(list.find((c: any) => String(c.email || c.id || '').toLowerCase() === String(s.candidateEmail || '').toLowerCase()) || list[0] || null);
    } catch { setCandProfile(null); }
    try {
      const res: any = await apiClient.get(`/api/v1/applications?q=${encodeURIComponent(s.candidateEmail || '')}&page=1&pageSize=50`);
      setCandApps(unwrapList(res).filter((a: any) => a.jobId === s.jobId));
    } catch { setCandApps([]); }
    setCandLoading(false);
  };
  const bucket = (s: any) => s.status === 'Shortlisted' ? 'shortlisted' : s.status === 'Rejected' ? 'rejected' : s.status === 'Duplicate-Review' ? 'duplicates' : 'review';
  const visible = rows.filter((s) => (statusTab === 'all' || bucket(s) === statusTab))
    .filter((s) => !search.trim() || `${s.candidateEmail} ${s.jobId} ${s.id} ${s.agencyId || ''}`.toLowerCase().includes(search.trim().toLowerCase()));
  const count = (b: string) => rows.filter((s) => bucket(s) === b).length;
  const scorecard = (() => {
    const map = new Map<string, { n: number; acc: number }>();
    for (const s of rows) {
      const k = s.agencyId || s.submittedBy || 'direct';
      const e = map.get(k) || { n: 0, acc: 0 };
      e.n += 1; if (['Shortlisted'].includes(s.status) || s.applicationId) e.acc += 1;
      map.set(k, e);
    }
    return [...map.entries()].map(([k, v]) => ({ agency: k, ...v, rate: Math.round((v.acc / Math.max(1, v.n)) * 100) })).sort((a, b) => b.n - a.n).slice(0, 5);
  })();
  const manageItems = (s: any) => {
    const items: { label: string; danger?: boolean; disabled?: boolean; hint?: string; onSelect: () => void }[] = [
      { label: 'View details', onSelect: () => openDetail(s) },
    ];
    if (canReview) {
      for (const x of ['Under Review', 'Shortlisted', 'Rejected', 'Withdrawn'].filter((x) => x !== s.status)) {
        items.push({ label: `Mark ${x}`, danger: x === 'Rejected', onSelect: () => setReviewFor({ s, to: x }) });
      }
      const dead = ['Rejected', 'Withdrawn'].includes(s.status);
      items.push(dead
        ? { label: 'Accept — closed', disabled: true, hint: `Submission is ${s.status}.`, onSelect: () => {} }
        : s.applicationId
          ? { label: `In pipeline (${s.applicationId})`, disabled: true, hint: 'Application already created.', onSelect: () => {} }
          : { label: 'Accept to pipeline →', onSelect: () => doAccept(s) });
    }
    return items;
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {([
          ['Total', rows.length, ''],
          ['In review', count('review'), count('review') > 0 ? 'text-amber-700' : 'text-slate-400'],
          ['Shortlisted', count('shortlisted'), 'text-emerald-700'],
          ['Rejected', count('rejected'), 'text-slate-500'],
          ['Duplicates', count('duplicates'), count('duplicates') > 0 ? 'text-amber-700' : 'text-slate-400'],
        ] as const).map(([label, value, tone]) => (
          <div key={label} className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <span className={`text-base font-extrabold ${tone || 'text-slate-900'}`}>{value}</span>
          </div>
        ))}
        <span className="text-[11px] font-bold text-slate-400 ml-1">of {total} loaded</span>
      </div>
      <div className={cardCls}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-extrabold text-slate-900">Agency submissions — review, accept, track</h3>
              <p className="text-xs text-slate-500 font-medium">Duplicates route to Duplicate-Review — never auto-rejected. Accept creates an ATS application.</p>
            </div>
            <button type="button" onClick={() => setShowSubmit(true)} className={btnPrimary}>+ Submit candidate</button>
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit max-w-full overflow-x-auto" role="tablist" aria-label="Submission status">
              {([
                ['all', `All (${rows.length})`], ['review', `In review (${count('review')})`], ['shortlisted', `Shortlisted (${count('shortlisted')})`],
                ['rejected', `Rejected (${count('rejected')})`], ['duplicates', `Duplicates (${count('duplicates')})`],
              ] as const).map(([v, label]) => (
                <button key={v} role="tab" aria-selected={statusTab === v} type="button" onClick={() => setStatusTab(v)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer whitespace-nowrap ${statusTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>
              ))}
            </div>
            <div className="flex-1 min-w-[200px] max-w-sm">
              <SearchSuggest value={search} onChange={setSearch} placeholder="Search candidate, job, agency…"
                items={visible.slice(0, 10).map((s) => ({ key: String(s.id), query: String(s.candidateEmail || s.id), title: String(s.candidateEmail || s.id), meta: [s.jobId, s.agencyId || s.submittedBy || 'direct'].filter(Boolean).join(' • '), status: s.status }))}
                onPick={(it) => { setSearch(it.query ?? it.key); setPage(1); }} />
            </div>
          </div>
        </div>
        {error && <PanelError message={error} onRetry={load} />}
        {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold" role="status">{ok}</div>}
        {scorecard.length > 1 && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Agency scorecard (current view)</div>
            <div className="flex flex-wrap gap-2">
              {scorecard.map((r) => (
                <span key={r.agency} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700">{r.agency} • {r.n} subs • {r.rate}% accepted</span>
              ))}
            </div>
          </div>
        )}
        {loading ? <InlineLoading message="Loading submissions…" /> : visible.length === 0 ? (
          <EmptyState title="No submissions" message="Agency submissions appear here; duplicates route to Duplicate-Review, never auto-reject." />
        ) : (<>
          <div className="space-y-2 md:hidden">
            {visible.map((s) => (
              <DrawerCard key={s.id} status={s.status}
                title={s.candidateEmail || s.id}
                meta={<><span className="font-mono">{s.id}</span> • {s.jobId} • {s.agencyId || s.submittedBy || 'direct'}{s.applicationId ? ' • in pipeline' : ''}</>}
                right={<>
                  <StatusPill value={s.status} />
                  <RowMenu label={`Manage ${s.id}`} items={manageItems(s)} />
                </>} />
            ))}
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
            <table className="w-full text-left text-xs min-w-[860px]">
              <thead className="bg-slate-50 sticky top-0 z-10"><tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="px-3 py-2.5">Submission</th><th className="px-3 py-2.5">Candidate</th><th className="px-3 py-2.5">Job</th><th className="px-3 py-2.5">Agency</th><th className="px-3 py-2.5">Status</th><th className="px-3 py-2.5">Submitted</th><th className="px-3 py-2.5 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="px-3 py-2.5"><span className="font-mono font-bold text-slate-700">{s.id}</span>
                      {s.applicationId && <div className="text-[10px] font-bold text-blue-700">in pipeline • {s.applicationId}</div>}
                    </td>
                    <td className="px-3 py-2.5">
                      <button type="button" onClick={() => openDetail(s)} className="text-left font-bold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-spec-electric cursor-pointer" title="View submission">{s.candidateEmail || '—'}</button>
                    </td>
                    <td className="px-3 py-2.5 font-mono">{s.jobId || '—'}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-amber-700">{s.agencyId || s.submittedBy || 'direct'}</td>
                    <td className="px-3 py-2.5"><StatusPill value={s.status} /></td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{s.createdAt ? String(s.createdAt).slice(0, 10) : '—'}</td>
                    <td className="px-3 py-2.5"><div className="flex justify-end"><RowMenu label={`Manage ${s.id}`} items={manageItems(s)} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}
        <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      </div>
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
      {detail && (
        <DetailDrawer title={`${detail.candidateEmail || detail.id}`} subtitle={`${detail.id} • ${detail.jobId} • ${detail.agencyId || detail.submittedBy || ''}`} onClose={() => setDetail(null)}>
          <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 w-fit" role="tablist" aria-label="Submission">
            {([[ 'overview', 'Overview' ], [ 'candidate', 'Candidate' ], [ 'review', 'Review & accept' ]] as const).map(([v, label]) => (
              <button key={v} role="tab" aria-selected={detailTab === v} type="button" onClick={() => setDetailTab(v)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer whitespace-nowrap ${detailTab === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{label}</button>
            ))}
          </div>
          {detailTab === 'overview' && (
            <KeyValues data={[
              ['Candidate', detail.candidateEmail || '—'], ['Job', detail.jobId || '—'], ['Agency', detail.agencyId || detail.submittedBy || '—'],
              ['Status', <StatusPill value={detail.status} />],
              ['Consent evidence', detail.consentEvidence || detail.consent || '—'],
              ['Resume', detail.resumeRef || '—'],
              ['Duplicate of', detail.duplicateOf || '—'],
              ['Pipeline application', detail.applicationId || '—'],
              ['Submitted', detail.createdAt ? String(detail.createdAt).slice(0, 10) : '—'],
            ]} />
          )}
          {detailTab === 'candidate' && (
            candLoading ? <InlineLoading message="Loading candidate…" /> : (
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-extrabold text-slate-900 text-sm">{candProfile?.name || detail.candidateEmail}</div>
                  <div className="text-slate-600 font-medium">{candProfile ? `${candProfile.roleTitle || '—'} • ${candProfile.experienceYears ?? '—'}y • ${candProfile.location || '—'}` : 'Limited preview — full profile unlocks on shortlist.'}</div>
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Applications for this job ({candApps.length})</div>
                {candApps.length === 0 ? <div className="text-[11px] text-slate-500">Not in pipeline yet — accept to create the application.</div> : candApps.map((a: any) => (
                  <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                    <span className="font-mono font-bold">{a.id}</span><StatusPill value={a.stage} />
                  </div>
                ))}
              </div>
            )
          )}
          {detailTab === 'review' && (
            <div className="space-y-2">
              {!canReview ? <div className="text-[11px] text-slate-500 font-medium">Review actions need an employer reviewer account.</div> : (
                <>
                  <button type="button" disabled={busy || !!detail.applicationId || ['Rejected', 'Withdrawn'].includes(detail.status)} onClick={() => doAccept(detail)} className="w-full py-3 rounded-xl bg-[#0B5FD9] text-white font-bold text-xs disabled:opacity-40 cursor-pointer">
                    {busy ? 'Accepting…' : detail.applicationId ? `Already in pipeline (${detail.applicationId})` : 'Accept to pipeline →'}
                  </button>
                  <div className="flex gap-2 flex-wrap">
                    {['Under Review', 'Shortlisted', 'Rejected', 'Withdrawn'].filter((x) => x !== detail.status).map((x) => (
                      <button key={x} type="button" onClick={() => setReviewFor({ s: detail, to: x })} className={`px-3 py-2 rounded-xl font-bold text-[11px] cursor-pointer ${x === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-white border border-slate-200 text-slate-700'}`}>Mark {x}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DetailDrawer>
      )}
      <ActionConfirm
        open={reviewFor !== null}
        onCancel={() => setReviewFor(null)}
        title={`Mark submission ${reviewFor?.s.id || ''} → ${reviewFor?.to || ''}`}
        subtitle={`${reviewFor?.s.candidateEmail || ''} • ${reviewFor?.s.jobId || ''}`}
        why={['Status change is audited with actor and timestamp', reviewFor?.to === 'Rejected' ? 'The agency sees the rejection reason on its submission' : 'Duplicate history is preserved either way']}
        confirmLabel={`Mark ${reviewFor?.to || ''}`}
        tone={reviewFor?.to === 'Rejected' ? 'danger' : 'primary'}
        onConfirm={doReview}
      />
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
  const [runByTs, setRunByTs] = useState<Record<string, any>>({});
  const [ownDeployments, setOwnDeployments] = useState<any[]>([]);
  const [isCandidate, setIsCandidate] = useState(false);
  const openSubmit = async () => {
    setForm({ contractorId: '', period: new Date().toISOString().slice(0, 7), hours: '', notes: '' });
    setShowSubmit(true);
    try {
      const { getActiveRole } = await import('../../shared/auth/session');
      if (getActiveRole() === 'candidate') {
        setIsCandidate(true);
        const mine = unwrapList(await workforceApi.contractors());
        setOwnDeployments(mine);
        if (mine.length === 1 && mine[0]?.id) setForm((f) => ({ ...f, contractorId: mine[0].id }));
      }
    } catch { /* manual entry fallback */ }
  };
  const pageSize = 10;
  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      const res: any = await workforceApi.timesheets(`?page=${p}&pageSize=${pageSize}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total || 0));
      try {
        const { payrollApi } = await import('../../shared/enterprise/phaseApi');
        const runs = unwrapList(await payrollApi.runs('?page=1&pageSize=100'));
        const map: Record<string, any> = {};
        for (const r of runs) for (const id of r.timesheetIds || []) map[id] = r;
        setRunByTs(map);
      } catch { setRunByTs({}); }
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
        <button type="button" onClick={openSubmit} className={btnPrimary}>+ Submit timesheet</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      <Modal open={showSubmit} onClose={() => setShowSubmit(false)} title="Submit timesheet" subtitle="Submitted → Approved / Rejected, one decision only">
        <form onSubmit={submit} className="space-y-3">
          {isCandidate && ownDeployments.length > 0 ? (
            <Field label="Deployment *"><Select value={form.contractorId} onChange={(v) => setForm({ ...form, contractorId: v })} placeholder="Select deployment" options={ownDeployments.map((c) => ({ value: c.id, label: `${c.name || c.id} • ${c.clientName || ''} • ₹${c.hourlyRate || '?'}/h` }))} /></Field>
          ) : (
            <Field label="Contractor ID *"><input className={kitInput} value={form.contractorId} onChange={(e) => setForm({ ...form, contractorId: e.target.value })} /></Field>
          )}
          <Field label="Period *"><input className={kitInput} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="YYYY-MM" /></Field>
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
                <div className="font-extrabold text-slate-900 text-sm truncate">{t.contractorName || t.contractorId} • {t.hours}h • ₹{Number(t.billableAmount ?? Number(t.hours || 0) * Number(t.hourlyRate || 0)).toLocaleString('en-IN')} • {t.period}</div>
                <div className="text-xs text-slate-500 font-medium">{t.id} • <strong className={t.status === 'Approved' ? 'text-emerald-600' : t.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}>{t.status}</strong>{t.reviewedBy ? ` • by ${t.reviewedBy}` : ''}{runByTs[t.id] ? <span className="ml-1.5 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-bold text-[10px]">Billed {runByTs[t.id].id} • {runByTs[t.id].stage || runByTs[t.id].status}</span> : null}</div>
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

/* ---------------- Contract payroll: timesheets → staffing invoice + contractor payouts ---------------- */
export function PayrollPanel() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState({ orgId: '', period: new Date().toISOString().slice(0, 7) });
  const [preview, setPreview] = useState<any>(null);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [runBusy, setRunBusy] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [settleBusy, setSettleBusy] = useState(false);
  // Run/settle are finance-only (superadmin/platform_owner/finance_admin) — everyone else gets read-only runs.
  const [canManage, setCanManage] = useState(false);
  useEffect(() => {
    import('../../shared/auth/session').then((m) => {
      setCanManage(['superadmin', 'platform_owner', 'finance_admin'].includes(m.getActiveRole() || ''));
    }).catch(() => {});
  }, []);
  const load = async () => {
    setLoading(true); setError('');
    try {
      const { payrollApi } = await import('../../shared/enterprise/phaseApi');
      setRuns(unwrapList(await payrollApi.runs('?page=1&pageSize=20')));
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const doPreview = async () => {
    if (!form.orgId.trim() || !form.period.trim()) return;
    setPreviewBusy(true); setError(''); setOk(''); setPreview(null);
    try {
      const { payrollApi } = await import('../../shared/enterprise/phaseApi');
      setPreview(unwrapObj(await payrollApi.preview(form.orgId.trim(), form.period.trim())));
    } catch (e) { setError(errMsg(e)); } finally { setPreviewBusy(false); }
  };
  const doRun = async () => {
    if (!form.orgId.trim() || !form.period.trim()) return;
    setRunBusy(true); setError(''); setOk('');
    try {
      const { payrollApi } = await import('../../shared/enterprise/phaseApi');
      const out = unwrapObj(await payrollApi.run(form.orgId.trim(), form.period.trim()));
      if (out?.run) setRuns((r) => [out.run, ...r.filter((x) => x.id !== out.run.id)]);
      setOk(out?.deduped ? `Run already existed for ${form.orgId.trim()} ${form.period.trim()} — no double billing.` : `Payroll run ${out?.run?.id} created: invoice + ${out?.payouts ?? 0} payout(s).`);
      setPreview(null);
    } catch (e) { setError(errMsg(e)); } finally { setRunBusy(false); }
  };
  const openDetail = async (id: string) => {
    setDetailId(id); setDetail(null); setError('');
    try {
      const { payrollApi } = await import('../../shared/enterprise/phaseApi');
      setDetail(unwrapObj(await payrollApi.detail(id)));
    } catch (e) { setError(errMsg(e)); }
  };
  const doSettle = async () => {
    if (!detailId) return;
    setSettleBusy(true); setError(''); setOk('');
    try {
      const { payrollApi } = await import('../../shared/enterprise/phaseApi');
      const out = unwrapObj(await payrollApi.settle(detailId));
      setOk(`Run settled — ${out?.payoutsSettled ?? 0} contractor payout(s) processed.`);
      setRuns((rs) => rs.map((x) => (x.id === detailId ? { ...x, status: 'Settled', stage: 'Settled' } : x)));
      await openDetail(detailId);
    } catch (e) { setError(errMsg(e)); } finally { setSettleBusy(false); }
  };
  const stageTone = (s: string) => s === 'Settled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s === 'Paid' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200';
  return (
    <div className={cardCls}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Contract payroll — synced billing</h3>
          <p className="text-xs text-slate-500 font-medium">Approved timesheets → staffing invoice (company pays NexaTalent) + contractor payouts @82% (NexaTalent pays candidate). One run per org + month.</p>
        </div>
        <button type="button" onClick={load} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs cursor-pointer">Refresh</button>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      {canManage && (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <input className={kitInput} placeholder="Org ID * e.g. TNT-CMP36" value={form.orgId} onChange={(e) => setForm({ ...form, orgId: e.target.value })} />
        <input className={kitInput} placeholder="Period * YYYY-MM" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
        <button type="button" disabled={previewBusy || !form.orgId.trim()} onClick={doPreview} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs disabled:opacity-40 cursor-pointer">{previewBusy ? 'Previewing…' : 'Preview'}</button>
        <button type="button" disabled={runBusy || !form.orgId.trim()} onClick={doRun} className={btnDark}>{runBusy ? 'Running…' : 'Run payroll'}</button>
      </div>
      )}
      {preview && (
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
          <div className="font-extrabold text-slate-900">Preview {preview.orgId} {preview.period} — {preview.timesheets} approved timesheet(s), {preview.contractors?.length || 0} contractor(s)</div>
          <div className="text-[11px] font-bold text-slate-600">Rules: {preview.rules?.standardHours ?? 160}h standard • OT ×{preview.rules?.overtimeMultiplier ?? 1.5} • payout {preview.rules?.payoutPercent ?? 82}% • GST {preview.rules?.taxRate ?? 18}%</div>
          <div className="space-y-1">
            {(preview.contractors || []).map((c: any) => (
              <div key={c.contractorId} className="flex items-center justify-between gap-2 text-[11px] font-bold text-slate-700">
                <span className="truncate">{c.contractorName} • {c.hours}h ({c.regHrs} reg + {c.otHrs} OT)</span>
                <span>₹{Number(c.amount || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white border border-blue-100"><div className="text-[10px] font-extrabold text-slate-500 uppercase">Subtotal</div><div className="font-extrabold">₹{Number(preview.subtotal || 0).toLocaleString('en-IN')}</div></div>
            <div className="p-2 rounded-xl bg-white border border-blue-100"><div className="text-[10px] font-extrabold text-slate-500 uppercase">GST 18%</div><div className="font-extrabold">₹{Number(preview.tax || 0).toLocaleString('en-IN')}</div></div>
            <div className="p-2 rounded-xl bg-white border border-blue-100"><div className="text-[10px] font-extrabold text-slate-500 uppercase">Invoice total</div><div className="font-extrabold">₹{Number(preview.total || 0).toLocaleString('en-IN')}</div></div>
            <div className="p-2 rounded-xl bg-white border border-blue-100"><div className="text-[10px] font-extrabold text-slate-500 uppercase">Payouts 82%</div><div className="font-extrabold">₹{Number(preview.payoutTotal || 0).toLocaleString('en-IN')}</div></div>
          </div>
        </div>
      )}
      {loading ? <InlineLoading message="Loading payroll runs…" /> : runs.length === 0 ? (
        <EmptyState title="No payroll runs" message="Run payroll for an org + month to generate the staffing invoice and contractor payouts." />
      ) : (
        <div className="space-y-2">
          {runs.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm">{r.orgId} • {r.period} <span className={`ml-1 px-2 py-0.5 rounded-full border font-bold text-[11px] ${stageTone(r.stage || r.status)}`}>{r.stage || r.status}</span></div>
                  <div className="font-mono text-[11px] text-slate-500">{r.id} • invoice ₹{Number(r.total || 0).toLocaleString('en-IN')} • payouts ₹{Number(r.payoutTotal || 0).toLocaleString('en-IN')}</div>
                </div>
                <button type="button" onClick={() => openDetail(r.id)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] cursor-pointer">Drill down</button>
              </div>
              {detailId === r.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-2">
                  {!detail ? <InlineLoading message="Loading legs…" /> : (<>
                    <div className="font-bold text-slate-700">{detail.timesheets?.length || 0} timesheet(s) → invoice {detail.invoice ? `${detail.invoice.number} (${detail.invoice.status}, balance ₹${Number(detail.invoice.balance || 0).toLocaleString('en-IN')}, allocated ₹${Number(detail.allocated || 0).toLocaleString('en-IN')})` : 'missing'}</div>
                    <div className="space-y-1.5">
                      {(detail.payouts || []).map((p: any) => (
                        <div key={p.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                          <span className="font-bold truncate">{p.contractorName} • ₹{Number(p.amount || 0).toLocaleString('en-IN')}</span>
                          <span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${p.status === 'Processed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                    {canManage && (detail.run?.stage === 'Paid' || detail.invoice?.status === 'Paid') && detail.run?.stage !== 'Settled' && (
                      <button type="button" disabled={settleBusy} onClick={doSettle} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-40 cursor-pointer">{settleBusy ? 'Settling…' : 'Settle — release contractor payouts'}</button>
                    )}
                  </>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Phase 4/5: Reports ---------------- */
const REPORTS = ['candidate-pipeline', 'requisition-ageing', 'receivables', 'commission-liabilities', 'sales-pipeline', 'recruiter-workload', 'interview-offer', 'offer-joining', 'company-hiring', 'subscription-revenue', 'agency-performance', 'duplicates'];
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
const NOTIF_KIND_OPTIONS: { key: string; label: string; hint: string }[] = [
  { key: 'application', label: 'Stage changes', hint: 'Applied, review, shortlist, reject' },
  { key: 'interview', label: 'Interviews', hint: 'Scheduled, rescheduled, cancelled' },
  { key: 'offer', label: 'Offers', hint: 'Selected, offer issued, joining' },
  { key: 'placement', label: 'Placements', hint: 'Joining confirmations' },
  { key: 'chat', label: 'Messages', hint: 'New chat messages' },
  { key: 'info_request', label: 'Info requests', hint: 'Recruiter asks for documents' },
  { key: 'billing', label: 'Billing & ATS', hint: 'Invoices, commercial updates' },
  { key: 'other', label: 'Other', hint: 'Everything else' },
];
const NOTIF_KIND_DEFAULTS: Record<string, boolean> = {
  application: true, interview: true, offer: true, placement: true, chat: true, info_request: true, billing: true, other: true,
};
export function NotificationsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [prefs, setPrefs] = useState<any>({ inApp: true, email: true, emailCh: true, kinds: { ...NOTIF_KIND_DEFAULTS } });
  const [kindFilter, setKindFilter] = useState('');
  const [savedTick, setSavedTick] = useState(0);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [mail, setMail] = useState<any[]>([]);
  const [mailConfigured, setMailConfigured] = useState<boolean | null>(null);
  const load = async () => {
    setError('');
    try {
      setRows(unwrapList(await platformApi.notifications()));
      const p = unwrapList(await platformApi.prefs());
      if (p[0]) {
        const raw = p[0] as any;
        setPrefs({
          ...raw,
          inApp: raw.inApp !== false,
          email: raw.emailCh !== undefined ? raw.emailCh : raw.email !== false,
          emailCh: raw.emailCh !== undefined ? raw.emailCh : raw.email !== false,
          kinds: { ...NOTIF_KIND_DEFAULTS, ...(raw.kinds || {}) },
        });
      }
    }
    catch (e) { setError(errMsg(e)); }
    try {
      const m: any = await billingApi.mailOutbox();
      setMail(unwrapList(m)); setMailConfigured((m as any)?.configured ?? null);
    } catch { setMail([]); }
  };
  useEffect(() => { load(); }, []);
  const save = async () => {
    setError(''); setOk('');
    try {
      const updated = unwrapObj(await platformApi.savePrefs({
        inApp: !!prefs.inApp,
        email: !!(prefs.emailCh ?? prefs.email),
        emailCh: !!(prefs.emailCh ?? prefs.email),
        kinds: prefs.kinds || {},
      }));
      if (updated?.kinds) setPrefs((x: any) => ({ ...x, kinds: { ...NOTIF_KIND_DEFAULTS, ...updated.kinds } }));
      setOk('Notification preferences saved.');
      setSavedTick((t) => t + 1);
      syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const visible = kindFilter ? rows.filter((n) => String(n.kind) === kindFilter) : rows;
  const unread = rows.filter((n) => n.status !== 'read').length;
  const kindsOn = Object.values((prefs.kinds || {}) as Record<string, boolean>).filter(Boolean).length;
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-base font-extrabold text-slate-900">Notifications & Preferences</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500">{unread} unread • {kindsOn}/{NOTIF_KIND_OPTIONS.length} kinds on</span>
          {unread > 0 && (
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px]"
              onClick={async () => {
                try { await platformApi.markAllRead(); setRows((x) => x.map((y) => ({ ...y, status: 'read' }))); syncAll(); }
                catch (e) { setError(errMsg(e)); }
              }}
            >
              Mark all read
            </button>
          )}
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div key={savedTick} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Delivery channels</div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <input type="checkbox" checked={!!prefs.inApp} onChange={(e) => setPrefs({ ...prefs, inApp: e.target.checked })} /> In-app
          <input type="checkbox" checked={!!(prefs.emailCh ?? prefs.email)} onChange={(e) => setPrefs({ ...prefs, email: e.target.checked, emailCh: e.target.checked })} className="ml-3" /> Email
          <button type="button" className={btnDark} onClick={save}>Save preferences</button>
        </label>
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 pt-1">Per-kind preferences — muted kinds are hidden from this feed</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {NOTIF_KIND_OPTIONS.map((o) => (
            <label key={o.key} className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={(prefs.kinds?.[o.key] ?? true) !== false}
                onChange={(e) => setPrefs({ ...prefs, kinds: { ...(prefs.kinds || {}), [o.key]: e.target.checked } })}
              />
              <span>
                <span className="font-bold text-slate-800">{o.label}</span>
                <span className="block text-[11px] text-slate-500 font-medium">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 font-medium">Account-security notices are always delivered and cannot be muted.</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xs font-extrabold text-slate-700">Filter by kind</div>
        <select
          aria-label="Filter notifications by kind"
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
        >
          <option value="">All kinds ({rows.length})</option>
          {Array.from(new Set(rows.map((n) => String(n.kind || 'other')))).sort().map((k) => (
            <option key={k} value={k}>{k} ({rows.filter((n) => String(n.kind) === k).length})</option>
          ))}
        </select>
        {kindFilter && (
          <button type="button" onClick={() => setKindFilter('')} className="text-[11px] font-bold text-blue-600 underline">Clear</button>
        )}
      </div>
      {visible.length === 0 ? <EmptyState title={rows.length === 0 ? 'No notifications' : `No “${kindFilter}” notifications`} message={rows.length === 0 ? 'Stage changes, interviews, payments and chat events land here.' : 'Try another kind, or unmute it in preferences above.'} /> : (
        <div className="space-y-2">{visible.slice(0, 30).map((n) => (
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
      <div className="flex items-center gap-1.5 pt-2">
        <div className="text-xs font-extrabold text-slate-700">Email outbox ({mail.length})</div>
        <InfoTip title="How email delivery works" body={<><p>Invoice and reminder emails send via SMTP (<span className="font-mono">SMTP_HOST/PORT/USER/PASS/FROM</span>). {mailConfigured ? 'SMTP is configured — emails send for real.' : 'SMTP is NOT configured — emails are queued here instead of failing, so nothing is lost.'}</p></>} />
      </div>
      {mail.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No emails yet — issuing invoices and running reminders creates entries here.</div> : (
        <div className="space-y-1.5 max-h-56 overflow-y-auto" data-lenis-prevent>
          {mail.slice(0, 30).map((m: any) => (
            <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
              <span className="min-w-0 truncate"><strong>[{m.kind}]</strong> {m.subject} → {m.to}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${m.status === 'sent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : m.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{m.status}</span>
            </div>
          ))}
        </div>
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
  const [editForm, setEditForm] = useState({ name: '', phone: '', roleTitle: '', experienceYears: '', location: '', preferredLocation: '', currentCtc: '', expectedCtc: '', noticePeriod: '', ctcType: 'annual', skills: '', visibility: 'standard', assignedRecruiter: '', source: '' });
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
    setEditForm({ name: c.name || '', phone: c.phone || '', roleTitle: c.roleTitle || '', experienceYears: String(c.experienceYears ?? ''), location: c.location || '', preferredLocation: c.preferredLocation || '', currentCtc: String(c.currentCtc ?? ''), expectedCtc: String(c.expectedCtc ?? ''), noticePeriod: c.noticePeriod || '', ctcType: c.ctcType || 'annual', skills: Array.isArray(c.skills) ? c.skills.join(', ') : (c.skills || ''), visibility: c.visibility || 'standard', assignedRecruiter: c.assignedRecruiter || '', source: c.source || c.sourceType || '' });
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
        <div className="relative flex-1"><SearchSuggest value={q} onChange={(v) => { setQ(v); resetPage(); }} placeholder="Search ID, name, email, title…"
    items={rows.map((c: any) => ({ key: String(c.id), query: String(c.email || c.id), title: String(c.name || c.email || c.id), meta: [c.email, c.roleTitle || c.title].filter(Boolean).join(' • '), status: c.status }))}
    onPick={(it) => { setQ(it.query ?? it.key); resetPage(); }} /></div>
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
      {editing !== null && (
        <DetailDrawer title={`Edit candidate — ${editing?.name || editing?.id || ''}`} subtitle={`${editing?.id || ''} • ${editing?.email || ''} • ${editing?.status || 'Active'}`} onClose={() => setEditing(null)}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[['Stage', editing?.latestStage || editing?.stage || '—'], ['Completeness', `${editing?.completeness ?? '—'}${editing?.completeness !== undefined ? '%' : ''}`], ['Applications', editing?.applicationCount ?? '—'], ['Last activity', String(editing?.lastActivity || '').slice(0, 10) || '—']].map(([k, v]) => (
              <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—')}</div></div>
            ))}
          </div>
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Identity</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Full name"><input className={kitInput} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Field>
                <Field label="Phone"><input className={kitInput} value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></Field>
                <Field label="Designation"><input className={kitInput} value={editForm.roleTitle} onChange={(e) => setEditForm({ ...editForm, roleTitle: e.target.value })} /></Field>
                <Field label="Experience (yrs)"><input className={kitInput} type="number" value={editForm.experienceYears} onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })} /></Field>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Location & sourcing</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Location"><input className={kitInput} value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /></Field>
                <Field label="Preferred location"><input className={kitInput} value={editForm.preferredLocation} onChange={(e) => setEditForm({ ...editForm, preferredLocation: e.target.value })} placeholder="Preferred work location" /></Field>
                <Field label="Assigned recruiter"><input className={kitInput} value={editForm.assignedRecruiter} onChange={(e) => setEditForm({ ...editForm, assignedRecruiter: e.target.value })} placeholder="Name or email" /></Field>
                <Field label="Source"><input className={kitInput} value={editForm.source} onChange={(e) => setEditForm({ ...editForm, source: e.target.value })} placeholder="e.g. Referral, Portal, Agency" /></Field>
                <Field label="Visibility"><Select value={editForm.visibility} onChange={(v) => setEditForm({ ...editForm, visibility: v })} options={['standard', 'open', 'private', 'anonymous'].map((v) => ({ value: v, label: v }))} /></Field>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Compensation & skills</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Current CTC"><input className={kitInput} value={editForm.currentCtc} onChange={(e) => setEditForm({ ...editForm, currentCtc: e.target.value })} /></Field>
                <Field label="Expected CTC"><input className={kitInput} value={editForm.expectedCtc} onChange={(e) => setEditForm({ ...editForm, expectedCtc: e.target.value })} /></Field>
                <Field label="CTC basis"><Select value={editForm.ctcType} onChange={(v) => setEditForm({ ...editForm, ctcType: v })} options={[{ value: 'annual', label: 'Annual CTC' }, { value: 'monthly', label: 'Monthly CTC' }]} /></Field>
                <Field label="Notice period"><Select value={editForm.noticePeriod} onChange={(v) => setEditForm({ ...editForm, noticePeriod: v })} placeholder="Select notice period" options={['Immediate Joiner', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days', 'Serving Notice', 'Garden Leave'].map((v) => ({ value: v, label: v }))} /></Field>
                <div className="sm:col-span-2"><Field label="Skills"><SkillPicker value={editForm.skills} onChange={(v) => setEditForm({ ...editForm, skills: v })} /></Field></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs mt-3">Cancel</button>
              <button disabled={busy} className={`${btnPrimary} mt-3`}>{busy ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        </DetailDrawer>
      )}
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
              <RowMenu label="Document actions" items={[
                { label: 'Download', onSelect: () => downloadDocumentFile(d.id, d.name).catch((e) => setError(errMsg(e))) },
                { label: 'Delete…', onSelect: async () => {
                  if (!window.confirm(`Delete ${d.name}? Upload a replacement afterwards if this was your active resume.`)) return;
                  try { await documentsApi.remove(d.id); setRows((r) => r.filter((x) => x.id !== d.id)); syncAll(); }
                  catch (e) { setError(errMsg(e)); }
                } },
              ]} />
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
  // Phase 5.2: self-service deletion request (approve anonymizes PII, preserves records)
  const [delReason, setDelReason] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [delMsg, setDelMsg] = useState('');
  const requestDeletion = async () => {
    if (!delReason.trim()) { setError('Tell us why (one line) — it goes to the reviewer.'); return; }
    setDelBusy(true); setError(''); setDelMsg('');
    try {
      const email = (() => { try { return localStorage.getItem('user_email') || ''; } catch { return ''; } })();
      const prof: any = await apiClient.get(`/api/v1/candidate/profile?email=${encodeURIComponent(email)}`).catch(() => null);
      const id = (prof as any)?.data?.id || (prof as any)?.data?.data?.id;
      if (!id) throw new Error('Could not resolve your profile. Ask support.');
      await directoryApi.requestDeletion(id, delReason.trim());
      setDelMsg('Deletion request sent (Pending). A platform admin reviews it; financial and audit records are preserved.');
      setDelReason('');
    } catch (e) { setError(errMsg(e)); } finally { setDelBusy(false); }
  };
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
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="text-xs font-extrabold text-slate-900">Delete my data</div>
        <p className="text-[11px] text-slate-500 font-medium">Requests full anonymization of your profile. Applications, interviews, placements and billing history stay linked as required. A request can only be filed once while pending.</p>
        {delMsg && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{delMsg}</div>}
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={delReason} onChange={(e) => setDelReason(e.target.value)} placeholder="Reason for deletion *" aria-label="Deletion reason" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none" />
          <button type="button" onClick={requestDeletion} disabled={delBusy || !delReason.trim()} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50">{delBusy ? 'Sending…' : 'Request deletion'}</button>
        </div>
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
  const [verifyFor, setVerifyFor] = useState<{ a: any; decision: 'approve' | 'reject' } | null>(null);
  const doVerify = async (reason?: string) => {
    if (!verifyFor) return;
    const { a, decision } = verifyFor;
    if (decision === 'reject' && !reason?.trim()) return;
    try {
      const u = unwrapObj(await workforceApi.updateAgency(a.id, { verificationStatus: decision === 'approve' ? 'Approved' : 'Rejected', reason: reason?.trim() || undefined }));
      setRows((r) => r.map((x) => (x.id === a.id ? { ...x, ...(u?.id ? u : {}) } : x)));
      setVerifyFor(null);
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
    if (!inviteForm.email.trim() || inviteForm.password.length < 10) { setError('Valid email + 10-char temporary password required.'); return; }
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
        { label: 'Verify — Approve', onSelect: () => setVerifyFor({ a, decision: 'approve' }) },
        { label: 'Verify — Reject', danger: true, onSelect: () => setVerifyFor({ a, decision: 'reject' }) },
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
        <div className="relative flex-1"><SearchSuggest value={q} onChange={(v) => { setQ(v); resetPage(); }} placeholder="Search ID, name, contact, specialty…"
    items={rows.map((a: any) => ({ key: String(a.id), query: String(a.id), title: String(a.displayName || a.legalName || a.id), meta: [a.contactEmail || a.email, a.specialties].filter(Boolean).join(' • '), status: a.accountStatus }))}
    onPick={(it) => { setQ(it.query ?? it.key); resetPage(); }} /></div>
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
      <ActionConfirm
        open={verifyFor !== null}
        onCancel={() => setVerifyFor(null)}
        title={`${verifyFor?.decision === 'approve' ? 'Approve' : 'Reject'} verification — ${verifyFor?.a.displayName || verifyFor?.a.id || ''}`}
        subtitle="The decision and reason are recorded with actor and timestamp."
        why={verifyFor?.decision === 'approve' ? ['Agency becomes eligible for job assignments'] : ['Agency is blocked from new assignments with a recorded reason']}
        requireReason={verifyFor?.decision === 'reject'}
        reasonLabel="Rejection reason *"
        confirmLabel={verifyFor?.decision === 'approve' ? 'Approve verification' : 'Reject verification'}
        tone={verifyFor?.decision === 'approve' ? 'primary' : 'danger'}
        onConfirm={(reason) => doVerify(reason)}
      />
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
          <Field label="Temporary password (10+ chars) *"><input type="password" required minLength={10} autoComplete="new-password" className={kitInput} value={inviteForm.password} onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })} /></Field>
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

/* ---------------- Roles directory (§4): metadata, edit, bulk import ---------------- */
export function RolesPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ id: '', scope: 'platform', description: '' });
  const [editing, setEditing] = useState<any>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [showImport, setShowImport] = useState(false);
  const load = async () => {
    setError('');
    try {
      const { rolesApi } = await import('../../shared/enterprise/phaseApi');
      setRows(unwrapList(await rolesApi.list()));
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.id.trim()) return;
    try {
      const { rolesApi } = await import('../../shared/enterprise/phaseApi');
      const r = unwrapObj(await rolesApi.create(form));
      if (r?.id) setRows((x) => [r, ...x]);
      setForm({ id: '', scope: 'platform', description: '' }); setShowCreate(false); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const saveEdit = async () => {
    if (!editing) return;
    try {
      const { rolesApi } = await import('../../shared/enterprise/phaseApi');
      const u = unwrapObj(await rolesApi.update(editing.id, { description: editing.description, scope: editing.scope, permissions: editPerms }));
      setRows((x) => x.map((r) => (r.id === editing.id ? { ...r, ...(u?.id ? u : {}) } : x)));
      setEditing(null); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const remove = async (id: string) => {
    try {
      const { rolesApi } = await import('../../shared/enterprise/phaseApi');
      await rolesApi.remove(id);
      setRows((x) => x.filter((r) => r.id !== id)); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  const filtered = rows.filter((r) => !q.trim() || `${r.id} ${r.scope} ${r.description}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-extrabold text-slate-900">Roles ({rows.length})</h3>
          <InfoTip title="How roles work" body={<><p>Every account runs on a role template. System roles ship with the platform; custom roles can be added. Editing a role's <strong>permissions rewires authorization immediately</strong> (audited) — per-user exceptions still apply on top.</p></>} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowImport(true)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Bulk import…</button>
          <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New role</button>
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      <input className={inputCls} placeholder="Search roles…" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.length === 0 ? <EmptyState title="No roles" message="Roles drive every permission check in the platform." /> : (<>
        <div className="space-y-2 md:hidden">
          {filtered.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="font-extrabold text-slate-900 text-sm font-mono">{r.id}</div>
                {r.system ? <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px]">system</span> : <RowMenu items={[{ label: 'Edit…', onSelect: () => { setEditing({ ...r }); setEditPerms(r.permissions || []); } }, { label: 'Delete…', danger: true, onSelect: () => remove(r.id) }]} />}
              </div>
              <div className="text-slate-600 font-medium">{r.scope} • {r.description || '—'}</div>
              {r.permissions ? <div className="font-mono text-[11px] text-slate-500">{r.permissions.length} explicit permissions</div> : null}
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Role</th><th className="px-4 py-3">Scope</th><th className="px-4 py-3">Purpose</th><th className="px-4 py-3">Permissions</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><span className="font-mono font-bold text-slate-900">{r.id}</span>{r.system ? <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px]">system</span> : null}</td>
                  <td className="px-4 py-3">{r.scope}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[320px]">{r.description || '—'}</td>
                  <td className="px-4 py-3 font-mono text-[11px]">{r.permissions ? `${r.permissions.length} explicit` : 'template default'}</td>
                  <td className="px-4 py-3"><div className="flex justify-end">{r.system ? <span className="text-[11px] text-slate-400 font-bold">locked</span> : <RowMenu label={`Role ${r.id}`} items={[{ label: 'Edit…', onSelect: () => { setEditing({ ...r }); setEditPerms(r.permissions || []); } }, { label: 'Delete…', danger: true, onSelect: () => remove(r.id) }]} />}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New custom role" subtitle="Starts with template-default permissions unless edited">
        <form onSubmit={create} className="space-y-3">
          <Field label="Role ID *"><input className={kitInput} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="e.g. qa_lead (lowercase, underscores)" /></Field>
          <Field label="Scope"><Select value={form.scope} onChange={(v) => setForm({ ...form, scope: v })} options={['platform', 'company', 'agency', 'candidate', 'vendor'].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="Purpose"><textarea rows={2} className={kitInput} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Create role</button>
          </div>
        </form>
      </Modal>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`Edit role — ${editing?.id || ''}`} subtitle="Permission edits rewire authorization immediately (audited)">
        <div className="space-y-3">
          <Field label="Scope"><Select value={editing?.scope || 'platform'} onChange={(v) => setEditing({ ...editing, scope: v })} options={['platform', 'company', 'agency', 'candidate', 'vendor'].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="Purpose"><textarea rows={2} className={kitInput} value={editing?.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          <div>
            <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Explicit permissions (empty = template default)</div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PERMISSIONS.map((p) => (
                <button key={p} type="button" onClick={() => setEditPerms((x) => (x.includes(p) ? x.filter((y) => y !== p) : [...x, p]))}
                  className={`px-2.5 py-1 rounded-full border font-bold text-[11px] ${editPerms.includes(p) ? 'bg-[#0B5FD9] text-white border-[#0B5FD9]' : 'bg-white text-slate-600 border-slate-200'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button type="button" onClick={saveEdit} className={btnDark}>Save role</button>
          </div>
        </div>
      </Modal>
      <BulkImportModal open={showImport} onClose={() => setShowImport(false)} title="Bulk import roles" subtitle="Preview first — duplicates are skipped, never overwritten" collection="roles" columns={['id', 'scope', 'description']} sample={'id,scope,description\nqa_lead,platform,QA owner\npartner_manager,agency,Partner channel'} onDone={load} />
    </div>
  );
}

/* ---------------- Skills taxonomy admin (§14.2) ---------------- */
export function SkillsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const dqSkill = useDebounced(q);
  const [cat, setCat] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Technology' });
  const [showImport, setShowImport] = useState(false);
  const pageSize = 20;
  const load = async (p = page, qq = dqSkill, cc = cat) => {
    setError('');
    try {
      const { documentsApi } = await import('../../shared/enterprise/phaseApi');
      const sp = new URLSearchParams({ page: String(p), pageSize: String(pageSize) });
      if (qq.trim()) sp.set('q', qq.trim());
      if (cc) sp.set('category', cc);
      const res: any = await documentsApi.skillsPaged(`?${sp.toString()}`);
      setRows(unwrapList(res)); setTotal(Number(res?.pagination?.total || unwrapList(res).length));
      const c = (res as { categories?: string[] })?.categories;
      if (Array.isArray(c)) setCats(c);
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { setPage(1); }, [dqSkill, cat]);
  useEffect(() => { load(page, dqSkill, cat); }, [page, dqSkill, cat]);
  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.name.trim()) return;
    try {
      const { documentsApi } = await import('../../shared/enterprise/phaseApi');
      const r = unwrapObj(await documentsApi.createSkill(form));
      if (r?.id) { setRows((x) => [r, ...x]); setTotal((t) => t + 1); }
      setForm({ name: '', category: 'Technology' }); setShowCreate(false); syncAll();
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-extrabold text-slate-900">Skills taxonomy ({total})</h3>
          <InfoTip title="How skills work" body={<><p>One shared taxonomy across candidates, requisitions and jobs. Search by name, filter by industry, add missing skills individually or via <strong>bulk import</strong> (duplicates are detected and skipped).</p></>} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowImport(true)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Bulk import…</button>
          <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New skill</button>
        </div>
      </div>
      {error && <PanelError message={error} onRetry={() => load(page, q, cat)} />}
      <div className="flex flex-col lg:flex-row gap-2">
        <input className={`${inputCls} flex-1`} placeholder="Search skills…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="w-full lg:w-52 shrink-0">
          <Select value={cat} onChange={setCat} ariaLabel="Industry filter" placeholder="All industries"
            options={[{ value: '', label: 'All industries' }, ...cats.map((c) => ({ value: c, label: c }))]} />
        </div>
      </div>
      {rows.length === 0 ? <EmptyState title="No skills" message="Widen the search or add the skill." /> : (<>
        <div className="space-y-2 md:hidden">
          {rows.map((s) => (
            <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-extrabold text-slate-900 text-sm truncate">{s.name}</div>
              <div className="font-mono text-[11px] text-slate-500">{s.id}</div>
              <div><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{s.category}</span></div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Skill</th><th className="px-4 py-3">Industry</th><th className="px-4 py-3">Reference</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{s.category}</span></td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{s.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
      <Pager page={page} total={total} pageSize={pageSize} onPage={setPage} />
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New skill" subtitle="Duplicates are rejected (409)">
        <form onSubmit={create} className="space-y-3">
          <Field label="Skill name *"><input className={kitInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pediatric Nursing" /></Field>
          <Field label="Industry"><input className={kitInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder={cats.slice(0, 3).join(', ') + (cats.length > 3 ? '…' : '')} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs">Cancel</button>
            <button className={btnPrimary}>Add skill</button>
          </div>
        </form>
      </Modal>
      <BulkImportModal open={showImport} onClose={() => setShowImport(false)} title="Bulk import skills" subtitle="Preview first — duplicates are skipped, never overwritten" collection="skills" columns={['name', 'category']} sample={'name,category\nPediatric Nursing,Healthcare\nWelding Inspection,Engineering'} onDone={() => load(1, '', '')} />
    </div>
  );
}

/* ---------------- Phase 5: Admin controls (sectionable for tabbed layout) ---------------- */export function AdminControlsPanel({ section = 'all' }: { section?: 'all' | 'verification' | 'users' | 'exceptions' }) {
  const show = (s: string) => section === 'all' || section === s;
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
      {(show('verification') || show('users')) && (
        <input className={inputCls} placeholder="Reason (recorded with actor + timestamp — required)" value={reason} onChange={(e) => setReason(e.target.value)} />
      )}
      {show('verification') && (<>
      <div className="text-xs font-extrabold text-slate-700">Companies — verify / suspend / reactivate ({tenants.length})</div>
      <div className="space-y-2 md:hidden">{tenants.map((t) => (
        <OrgRow key={t.id} t={t} reason={reason} act={act} confirm={confirm} />
      ))}</div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
        <table className="w-full text-left text-xs min-w-[720px]">
          <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
            <th className="px-4 py-3">Organization</th><th className="px-4 py-3">Verification</th><th className="px-4 py-3">Account</th><th className="px-4 py-3 text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t) => <OrgTableRow key={t.id} t={t} reason={reason} act={act} confirm={confirm} />)}
          </tbody>
        </table>
      </div>
      </>)}
      {show('users') && (<>
      <div className="text-xs font-extrabold text-slate-700">Users — suspend / reactivate (revokes sessions) ({users.length})</div>
      <div className="space-y-2 md:hidden">{users.map((u) => (
        <UserRow key={u.id} u={u} reason={reason} act={act} confirm={confirm} />
      ))}</div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
            <th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => <UserTableRow key={u.id} u={u} reason={reason} act={act} confirm={confirm} />)}
          </tbody>
        </table>
      </div>
      </>)}
      {show('exceptions') && (<>
      <div className="text-xs font-extrabold text-slate-700">Permission exceptions — explicit grant/revoke over role templates (§4.2)</div>
      <form onSubmit={saveException} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <input className={kitInput} placeholder="user@company.com *" value={excForm.email} onChange={(e) => setExcForm({ ...excForm, email: e.target.value })} />
        <Select value={excForm.permission} onChange={(v) => setExcForm({ ...excForm, permission: v })} options={ALL_PERMISSIONS.map((p) => ({ value: p, label: p }))} />
        <Select value={excForm.effect} onChange={(v) => setExcForm({ ...excForm, effect: v })} options={[{ value: 'grant', label: 'Grant' }, { value: 'revoke', label: 'Revoke' }]} />
        <button className={btnDark}>Save exception</button>
      </form>
      {exceptions.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No exceptions — every account runs on its role template.</div> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">User</th><th className="px-4 py-3">Effect</th><th className="px-4 py-3">Permission</th><th className="px-4 py-3">By</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {exceptions.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-bold">{o.email}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${o.effect === 'grant' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{o.effect}</span></td>
                  <td className="px-4 py-3 font-mono">{o.permission}</td>
                  <td className="px-4 py-3 text-slate-500">{o.by}</td>
                  <td className="px-4 py-3"><div className="flex justify-end"><button type="button" onClick={() => clearException(o)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Clear</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {exceptions.length > 0 && (
        <div className="space-y-2 md:hidden">{exceptions.map((o) => (
          <div key={o.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-extrabold text-slate-900 truncate">{o.email}</div>
            <div><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${o.effect === 'grant' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{o.effect} {o.permission}</span></div>
            <button type="button" onClick={() => clearException(o)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px]">Clear</button>
          </div>
        ))}</div>
      )}
      </>)}
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

/* ---------------- Login lockouts — superadmin revokes 429 throttles ---------------- */
export function LoginLockoutsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState('');
  const [confirmAll, setConfirmAll] = useState(false);
  const load = async () => {
    setError('');
    try {
      const { lockoutApi } = await import('../../shared/enterprise/phaseApi');
      setRows(unwrapList(await lockoutApi.list()));
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const unlock = async (target: string) => {
    if (!target.trim()) return;
    setBusy(target); setError(''); setOk('');
    try {
      const { lockoutApi } = await import('../../shared/enterprise/phaseApi');
      const res: any = await lockoutApi.unlock(target.trim());
      const had = (res as { data?: { hadLock?: boolean } })?.data?.hadLock;
      setOk(had ? `${target.trim()} unlocked — they can sign in again.` : `${target.trim()} had no lockout record — nothing to clear.`);
      setEmail('');
      await load();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(''); }
  };
  const unlockAll = async () => {
    setBusy('__all'); setError(''); setOk('');
    try {
      const { lockoutApi } = await import('../../shared/enterprise/phaseApi');
      const res: any = await lockoutApi.unlockAll();
      setOk(`Cleared ${(res as { data?: { cleared?: number } })?.data?.cleared ?? 0} lockout record(s).`);
      setConfirmAll(false);
      await load();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(''); }
  };
  return (
    <div className={cardCls}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Login lockouts — revoke & restore access</h3>
          <p className="text-xs text-slate-500 font-medium">10 failed attempts = 15-min 429 lock. Unlock any user of any role so they can sign in again. Every revoke is audited.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs cursor-pointer">Refresh</button>
          <button type="button" disabled={rows.length === 0 || !!busy} onClick={() => setConfirmAll(true)} className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-40 cursor-pointer">Unlock all</button>
        </div>
      </div>
      {error && <PanelError message={error} onRetry={load} />}
      {ok && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{ok}</div>}
      <form onSubmit={(e) => { e.preventDefault(); unlock(email); }} className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <input className={kitInput} placeholder="user@company.com — unlock even if not listed *" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button disabled={!email.trim() || !!busy} className={btnDark}>{busy && busy !== '__all' ? 'Unlocking…' : 'Unlock login'}</button>
      </form>
      {loading ? <InlineLoading message="Checking lockouts…" /> : rows.length === 0 ? (
        <EmptyState title="No locked accounts" message="Nobody is throttled right now — all users can sign in." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs min-w-[820px]">
            <thead className="bg-slate-50"><tr className="text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Account</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Live fails</th><th className="px-4 py-3">Wrong-password history</th><th className="px-4 py-3">Locked until</th><th className="px-4 py-3 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rows.map((r) => (
                <tr key={r.email} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3"><div className="font-bold text-slate-900">{r.email}</div><div className="font-mono text-[11px] text-slate-500">{r.tenantId} • {r.status}</div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px]">{r.role}</span></td>
                  <td className="px-4 py-3 font-extrabold text-slate-900">{r.fails}{r.mfaFails > 0 ? <span className="text-slate-500 font-bold"> (+{r.mfaFails} MFA)</span> : null}</td>
                  <td className="px-4 py-3">{r.recentFails > 0
                    ? <><div className="font-extrabold text-amber-700">{r.recentFails} failed</div><div className="font-mono text-[10px] text-slate-500">{r.lastFailure} • {r.lastFailedAt ? new Date(r.lastFailedAt).toLocaleString() : ''}</div></>
                    : <span className="text-slate-400">—</span>}</td>
                  <td className="px-4 py-3">{r.locked
                    ? <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[11px]">{r.unlocksAt ? new Date(r.unlocksAt).toLocaleTimeString() : 'locked'}</span>
                    : <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">watch</span>}</td>
                  <td className="px-4 py-3"><div className="flex justify-end"><button type="button" disabled={!!busy} onClick={() => unlock(r.email)} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] disabled:opacity-40 cursor-pointer">{busy === r.email ? 'Unlocking…' : 'Unlock'}</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={confirmAll} onCancel={() => setConfirmAll(false)} title="Unlock every throttled account?"
        body="Clears all login + MFA throttle records at once. Audited as a bulk revoke."
        confirmLabel="Unlock all" onConfirm={unlockAll} />
    </div>
  );
}

function useDirectoryApi(): any {
  const [api, setApi] = useState<any>(null);
  useEffect(() => { import('../../shared/enterprise/phaseApi').then((m) => setApi(m.directoryApi)); }, []);
  return api;
}

function orgMenuItems(t: any, reason: string, act: (p: Promise<unknown>) => void, confirm: (title: string, body: string, label: string, run: () => unknown) => void, api: any) {
  return [
    { label: 'Verify organization', onSelect: () => act(api.verifyTenant(t.id, 'approve')) },
    { label: 'Reject verification', danger: true, onSelect: () => confirm('Reject verification', `Reject verification for ${t.legalName || t.name}?`, 'Reject', () => act(api.verifyTenant(t.id, 'reject'))) },
    { label: 'Suspend organization', danger: true, onSelect: () => confirm('Suspend organization', `Suspend ${t.legalName || t.name}? All member sessions are revoked immediately.`, 'Suspend', () => act(reason ? api.suspendTenant(t.id, reason) : Promise.reject(new Error('Enter a reason first.')))) },
    { label: 'Reactivate organization', onSelect: () => act(api.suspendTenant(t.id, reason || 'reactivated', 'reactivate')) },
  ];
}

function userMenuItems(u: any, reason: string, act: (p: Promise<unknown>) => void, confirm: (title: string, body: string, label: string, run: () => unknown) => void, api: any) {
  return u.status === 'Active'
    ? [{ label: 'Suspend user', danger: true, onSelect: () => confirm('Suspend user', `Suspend ${u.email}? Sessions are revoked immediately.`, 'Suspend', () => act(reason ? api.setUserStatus(u.id, 'Suspended', reason) : Promise.reject(new Error('Enter a reason first.')))) }]
    : [{ label: 'Reactivate user', onSelect: () => act(api.setUserStatus(u.id, 'Active', reason || 'reactivated')) }];
}

function OrgRow({ t, reason, act, confirm }: { t: any; reason: string; act: (p: Promise<unknown>) => void; confirm: (title: string, body: string, label: string, run: () => unknown) => void }) {
  const api = useDirectoryApi();
  if (!api) return null;
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-extrabold text-slate-900 text-sm truncate">{t.legalName || t.name}</div>
          <div className="font-mono text-[11px] text-slate-500">{t.id}</div>
        </div>
        <RowMenu label="Organization actions" items={orgMenuItems(t, reason, act, confirm, api)} />
      </div>
      <div className="flex gap-1.5">
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{t.verificationStatus}</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px]">{t.accountStatus}</span>
      </div>
    </div>
  );
}

function OrgTableRow({ t, reason, act, confirm }: { t: any; reason: string; act: (p: Promise<unknown>) => void; confirm: (title: string, body: string, label: string, run: () => unknown) => void }) {
  const api = useDirectoryApi();
  if (!api) return null;
  return (
    <tr className="hover:bg-slate-50/70">
      <td className="px-4 py-3"><div className="font-bold text-slate-900">{t.legalName || t.name}</div><div className="font-mono text-[11px] text-slate-500">{t.id}</div></td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">{t.verificationStatus}</span></td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-[11px]">{t.accountStatus}</span></td>
      <td className="px-4 py-3"><div className="flex justify-end"><RowMenu label="Organization actions" items={orgMenuItems(t, reason, act, confirm, api)} /></div></td>
    </tr>
  );
}

function UserRow({ u, reason, act, confirm }: { u: any; reason: string; act: (p: Promise<unknown>) => void; confirm: (title: string, body: string, label: string, run: () => unknown) => void }) {
  const api = useDirectoryApi();
  if (!api) return null;
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-extrabold text-slate-900 text-sm truncate">{u.email}</div>
          <div className="font-mono text-[11px] text-slate-500">{u.role}</div>
        </div>
        <RowMenu label="User actions" items={userMenuItems(u, reason, act, confirm, api)} />
      </div>
      <div><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{u.status}</span></div>
    </div>
  );
}

function UserTableRow({ u, reason, act, confirm }: { u: any; reason: string; act: (p: Promise<unknown>) => void; confirm: (title: string, body: string, label: string, run: () => unknown) => void }) {
  const api = useDirectoryApi();
  if (!api) return null;
  return (
    <tr className="hover:bg-slate-50/70">
      <td className="px-4 py-3 font-bold">{u.email}</td>
      <td className="px-4 py-3 font-mono">{u.role}</td>
      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border font-bold text-[11px] ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{u.status}</span></td>
      <td className="px-4 py-3"><div className="flex justify-end"><RowMenu label="User actions" items={userMenuItems(u, reason, act, confirm, api)} /></div></td>
    </tr>
  );
}

/* ---------------- Branches (§6.4/§3.4) — full CRUD ---------------- */
export function BranchesPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useQueryState('br_q');
  const [orgF, setOrgF] = useQueryState('br_org');
  const [orgs, setOrgs] = useState<any[]>([]);
  const isPlatform = ['superadmin', 'platform_owner', 'operations_admin', 'employee'].includes(getActiveRole() || '');
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
      if (isPlatform) { try { setOrgs(unwrapList(await directoryApi.tenants())); } catch { setOrgs([]); } }
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
  const filtered = rows.filter((b) => {
    if (orgF && String(b.orgId) !== orgF) return false;
    if (!q.trim()) return true;
    return `${b.id} ${b.name} ${b.city} ${b.orgId}`.toLowerCase().includes(q.toLowerCase());
  });
  return (
    <div className={cardCls}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">Branches — Create / Edit / Delete / Export</h3>
          <div className="flex gap-2">
            {orgs.length > 0 && (
              <div className="w-44 shrink-0">
                <Select value={orgF} onChange={setOrgF} ariaLabel="Company filter" placeholder="All companies"
                  options={[{ value: '', label: 'All companies' }, ...orgs.map((o: any) => ({ value: o.id, label: `${o.displayName || o.legalName || o.id}` }))]} />
              </div>
            )}
            <ExportButton filename="branches.csv" rows={filtered} columns={['id', 'orgId', 'name', 'city', 'status']} />
            <button type="button" onClick={() => setShowCreate(true)} className={btnPrimary}>+ New branch</button>
          </div>
        </div>
        <SearchSuggest value={q} onChange={setQ} placeholder="Search branch, city, org…"
    items={rows.map((b: any) => ({ key: String(b.id), query: String(b.id), title: String(b.name || b.id), meta: [b.city, b.orgId].filter(Boolean).join(' • '), status: b.status }))}
    onPick={(it) => setQ(it.query ?? it.key)} />
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
      ) : (<>
        <div className="space-y-2 md:hidden">
          {filtered.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm truncate">{b.name}</div>
                  <div className="font-mono text-[11px] text-slate-500">{b.id} • {b.orgId}</div>
                </div>
                <RowMenu items={[
                  { label: 'Edit…', onSelect: () => setEditing({ ...b }) },
                  { label: 'Delete…', danger: true, onSelect: () => setDeleteFor(b) },
                ]} />
              </div>
              <div className="font-bold text-slate-700">{b.city || '—'}</div>
              <div><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">{b.status}</span></div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hidden md:block">
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
      </>)}
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
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [q, setQ] = useQueryState('job_q');
  const [statusF, setStatusF] = useQueryState('job_status');
  const [orgF, setOrgF] = useQueryState('job_org');
  const [reqF, setReqF] = useQueryState('job_req');
  const dqJob = useDebounced(q);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;
  const [detail, setDetail] = useState<any>(null);
  const [pipeline, setPipeline] = useState<{ apps: any[]; interviews: any[] }>({ apps: [], interviews: [] });
  const [detailReq, setDetailReq] = useState<any>(null);
  const [jobTab, setJobTab] = useState('overview');
  const [editing, setEditing] = useState<any>(null);
  const [pubFor, setPubFor] = useState<{ job: any; to: string } | null>(null);
  const [pubReason, setPubReason] = useState('');
  const [pubExpiry, setPubExpiry] = useState('');
  const [moveFor, setMoveFor] = useState<{ job: any; to: string } | null>(null);
  const [view, setView] = useQueryState('job_view');
  const [busy, setBusy] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMsg, setBulkMsg] = useState('');
  const load = async (p = page) => {
    setLoading(true); setError('');
    try {
      // Phase 2: server is source of truth — filters + paging in query, counts from server.
      const params = new URLSearchParams({ page: String(p), pageSize: String(pageSize) });
      if (orgF) params.set('orgId', orgF);
      if (statusF) params.set('status', statusF);
      if (reqF.trim()) params.set('requisitionId', reqF.trim());
      if (dqJob.trim()) params.set('q', dqJob.trim());
      const res: any = await jobsApi.list(`?${params.toString()}`);
      setRows(unwrapList(res));
      setTotal(Number(res?.pagination?.total ?? unwrapList(res).length));
      const { directoryApi } = await import('../../shared/enterprise/phaseApi');
      directoryApi.tenants().then((t: any) => setOrgs(unwrapList(t))).catch(() => { /* company filter best-effort */ });
    }
    catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [orgF, statusF, reqF, dqJob, page]);
  useEffect(() => { setPage(1); }, [orgF, statusF, reqF, dqJob]);
  const openDetail = async (j: any) => {
    setDetail(j); setPipeline({ apps: [], interviews: [] }); setDetailReq(null); setJobTab('overview');
    try {
      const [aRes, iRes] = await Promise.all([
        applicationsApi.list(`?jobId=${j.id}&page=1&pageSize=100`).catch(() => null),
        interviewsApi.list(`?jobId=${j.id}`).catch(() => null),
      ]);
      setPipeline({ apps: unwrapList(aRes), interviews: unwrapList(iRes) });
      if (j.requisitionId) {
        // Phase 2: single fetch with server rollup — no full-list scan.
        const rRes: any = await requisitionsApi.get(j.requisitionId).catch(() => null);
        const req = unwrapObj(rRes);
        if (req?.id) setDetailReq(req);
      }
    } catch { /* pipeline is best-effort */ }
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
  const filtered = rows;
  const pubNeedsForm = (j: any, to: string) => to === 'Published' || (j.status === 'Published' && to === 'Approved') || (j.status === 'Closed' && (to === 'Published' || to === 'Paused'));
  const dropMove = (j: any, to: string) => {
    if (to === j.status) return;
    const legal = [...(JOB_TRANSITIONS[j.status] || []), ...(j.status === 'Published' ? ['Approved'] : []), ...(j.status === 'Closed' ? ['Published', 'Paused'] : [])];
    if (!legal.includes(to)) { setError(`Invalid transition ${j.status} → ${to} for ${j.id}.`); return; }
    if (pubNeedsForm(j, to)) { setPubFor({ job: j, to }); setPubReason(''); setPubExpiry(String(j.expiryDate || '').slice(0, 10)); }
    else setMoveFor({ job: j, to });
  };
  const runBulkPublish = async (ids: string[]) => {
    if (!ids.length || bulkBusy) return;
    setBulkBusy(true); setBulkMsg('');
    const targets = ids.map((id) => rows.find((j) => j.id === id)).filter(Boolean).map((j: any) => ({ id: j.id, status: j.status }));
    const results = await bulkPublish(targets);
    const okN = results.filter((r) => r.ok).length;
    const fail = results.filter((r) => !r.ok);
    setBulkMsg(`${okN} added to open positions.${fail.length ? ` ${fail.length} failed: ${fail.map((f) => `${f.id} (${f.message})`).join('; ')}` : ''}`);
    setSelectedJobs(new Set()); setBulkBusy(false); load(page); syncAll();
  };
  const runBulkUnpublish = async (ids: string[]) => {
    if (!ids.length || bulkBusy) return;
    setBulkBusy(true); setBulkMsg('');
    const results = [];
    for (const id of ids) results.push(await unpublishJob(id));
    const okN = results.filter((r) => r.ok).length;
    const fail = results.filter((r) => !r.ok);
    setBulkMsg(`${okN} removed from open positions.${fail.length ? ` ${fail.length} failed: ${fail.map((f) => `${f.id} (${f.message})`).join('; ')}` : ''}`);
    setSelectedJobs(new Set()); setBulkBusy(false); load(page); syncAll();
  };
  const toggleJobSel = (id: string) => {
    setSelectedJobs((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const jobMenuFor = (j: any) => (
    <RowMenu items={[
      { label: 'View + pipeline', onSelect: () => openDetail(j) },
      { label: 'Edit…', onSelect: () => setEditing({ ...j, assignedAgencies: (j.assignedAgencies || []).join(', '), assignedVendors: (j.assignedVendors || []).join(', ') }) },
      ...(j.status !== 'Published' ? [{ label: 'Add to open positions…', onSelect: () => { setSelectedJobs(new Set([j.id])); void runBulkPublish([j.id]); } }] : []),
      ...(j.status === 'Published' ? [{ label: 'Remove from open positions…', onSelect: () => { setSelectedJobs(new Set([j.id])); void runBulkUnpublish([j.id]); } }] : []),
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
            <div className="text-xs font-bold text-slate-500">{total || filtered.length} posting(s) • server counts</div>
          </div>
          <div className="flex gap-2">
            <ExportButton filename="jobs.csv" rows={filtered} columns={['id', 'requisitionId', 'title', 'orgId', 'location', 'employmentType', 'status', 'expiryDate']} />
            <button type="button" onClick={() => navigate(`${portalBase()}/jobs/new`)} className={btnPrimary}>+ New job</button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <SearchSuggest value={q} onChange={setQ} placeholder="Search ID, title, org, location…"
    items={rows.map((j: any) => ({ key: String(j.id), query: String(j.id), title: String(j.title || j.id), meta: [j.orgId || j.companyName, j.location].filter(Boolean).join(' • '), status: j.status }))}
    onPick={(it) => setQ(it.query ?? it.key)} />
          <input className={`${inputCls} w-full lg:w-44 shrink-0`} placeholder="Requirement ID (REQ-…)" value={reqF} onChange={(e) => setReqF(e.target.value)} aria-label="Requirement filter" />
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
      {/* bulk open-positions bar */}
      {(view || 'table') === 'table' && (
        <div className={`flex flex-wrap items-center gap-2 rounded-xl border p-2.5 text-xs ${selectedJobs.size > 0 ? 'border-[#0265FF]/30 bg-[#0265FF]/5' : 'border-slate-200 bg-slate-50'}`}>
          <span className="font-bold text-slate-600">{selectedJobs.size} selected</span>
          <button type="button" disabled={!selectedJobs.size || bulkBusy} onClick={() => runBulkPublish([...selectedJobs])}
            className="min-h-[32px] rounded-lg bg-[#0265FF] px-3 font-bold text-white hover:bg-[#0055db] disabled:opacity-40">
            {bulkBusy ? 'Working…' : 'Add to open positions'}
          </button>
          <button type="button" disabled={!selectedJobs.size || bulkBusy} onClick={() => runBulkUnpublish([...selectedJobs])}
            className="min-h-[32px] rounded-lg border border-red-200 px-3 font-bold text-red-600 hover:bg-red-50 disabled:opacity-40">
            Remove from board
          </button>
          {selectedJobs.size > 0 && (
            <button type="button" onClick={() => setSelectedJobs(new Set())} className="min-h-[32px] px-2 font-bold text-slate-400 hover:text-slate-600">Clear</button>
          )}
          <a href={`${portalBase()}/open-positions`} className="ml-auto font-bold text-[#0265FF] hover:underline">Open Positions page →</a>
          {bulkMsg && <p className="w-full text-[11px] font-semibold text-slate-600">{bulkMsg}</p>}
        </div>
      )}
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
              <th className="px-2 py-3 w-8">
                <input type="checkbox" aria-label="Select all jobs on this page" className="h-4 w-4 accent-[#0265FF]"
                  checked={filtered.length > 0 && filtered.every((j) => selectedJobs.has(j.id))}
                  onChange={(e) => setSelectedJobs(e.target.checked ? new Set(filtered.map((j) => j.id)) : new Set())} />
              </th>
              <th className="px-4 py-3">Job</th><th className="px-4 py-3">Requisition</th><th className="px-4 py-3">Org / Location</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Applicants</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((j) => (
                <tr key={j.id} className={`hover:bg-slate-50/70 ${selectedJobs.has(j.id) ? 'bg-[#0265FF]/5' : ''}`}>
                  <td className="px-2 py-3">
                    <input type="checkbox" aria-label={`Select ${j.title}`} className="h-4 w-4 accent-[#0265FF]" checked={selectedJobs.has(j.id)} onChange={() => toggleJobSel(j.id)} />
                  </td>
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
      <div className="flex justify-end pt-1">
        <Pager page={page} total={total || filtered.length} pageSize={pageSize} onPage={setPage} />
      </div>
      {detail && (
        <DetailDrawer title={detail.title} subtitle={`${detail.id} • req ${detail.requisitionId || '—'} • ${detail.status}`} onClose={() => setDetail(null)} width="max-w-4xl">
          <JobDrawerActions job={detail} requirement={detailReq} onDone={(u) => { setDetail((d: any) => (d && d.id === u.id ? u : d)); setRows((r) => r.map((x) => (x.id === u.id ? u : x))); }} />
          <div className="flex items-center gap-2 flex-wrap">
            <span className={tonePill(detail.status)}>{detail.status}</span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">{detail.id}</span>
            <span className="text-[11px] font-bold text-slate-500">{detail.counts?.applications ?? detail.applicantsCount ?? 0} applicants → {detail.counts?.hired ?? 0} hired</span>
          </div>
          <DetailTabs tabs={[{ key: 'overview', label: 'Overview' }, { key: 'pipeline', label: 'Pipeline', count: pipeline.apps.length }, { key: 'interviews', label: 'Interviews', count: pipeline.interviews.length }, { key: 'activity', label: 'Activity', count: (detail.history || []).length }]} active={jobTab} onPick={setJobTab} />
          {jobTab === 'overview' && (
            <div className="space-y-3">
              <DetailSection title="Posting">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[['Organization', detail.orgId], ['Location', detail.location], ['Employment', detail.employmentType], ['Arrangement', detail.workArrangement], ['Salary', detail.salaryMin ? `₹${Number(detail.salaryMin).toLocaleString('en-IN')}–₹${Number(detail.salaryMax || detail.salaryMin).toLocaleString('en-IN')}` : (detail.budgetRange || '—')], ['Visibility', detail.visibility], ['Skills', [detail.requiredSkills, detail.preferredSkills].filter(Boolean).join(' • ') || '—'], ['Qualifications', detail.qualifications || '—'], ['Expiry', String(detail.expiryDate || '').slice(0, 10) || '—'], ['Accepting applications', detail.counts ? (detail.counts.acceptingApplications ? 'Yes' : 'No') : '—'], ['Status reason', detail.statusReason || '—'], ['Agencies', (detail.assignedAgencies || []).join(', ') || 'Open to all'], ['Vendors', (detail.assignedVendors || []).join(', ') || '—']].map(([k, v]) => (
                    <div key={k as string} className="p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">{k}</div><div className="font-bold mt-1 break-words">{String(v ?? '—') || '—'}</div></div>
                  ))}
                  <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200"><div className="text-[10px] font-bold text-slate-500 uppercase">Description</div><div className="font-medium mt-1 whitespace-pre-wrap">{detail.description || '—'}</div></div>
                </div>
              </DetailSection>
              {detailReq && (
                <DetailSection title="Parent requirement">
                  <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs">
                    <div className="font-bold">{detailReq.title} <span className="font-mono text-slate-500">• {detailReq.id} • {detailReq.openings || 1} opening(s)</span></div>
                    <div className="mt-1"><span className={tonePill(detailReq.status)}>{detailReq.status}</span></div>
                  </div>
                </DetailSection>
              )}
            </div>
          )}
          {jobTab === 'pipeline' && (
            <DetailSection title="Applications by stage" count={pipeline.apps.length}>
              {pipeline.apps.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No applications for this job yet.</div> : (
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {Object.entries(pipeline.apps.reduce((m: Record<string, number>, a: any) => { m[a.stage || 'Unknown'] = (m[a.stage || 'Unknown'] || 0) + 1; return m; }, {})).map(([st, n]) => (
                    <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold"><span className={tonePill(st)}>{st}</span> × {String(n)}</span>
                  ))}
                </div>
              )}
              <DrawerList items={pipeline.apps.slice(0, 50)} empty="" render={(a: any) => (
                <DrawerCard key={a.id} status={a.stage} title={a.candidateEmail || a.candidateName || a.id}
                  meta={<><span className="font-mono">{a.id}</span>{a.jobTitle ? ` • ${a.jobTitle}` : ''} • {String(a.updatedAt || a.createdAt || '').slice(0, 10)}</>}
                  right={<span className={tonePill(a.stage)}>{a.stage}</span>} />
              )} />
            </DetailSection>
          )}
          {jobTab === 'interviews' && (
            <DetailSection title="Interviews" count={pipeline.interviews.length}>
              {pipeline.interviews.length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No interviews scheduled for this job yet.</div> : (
                <DrawerList items={pipeline.interviews} empty="" render={(iv: any) => (
                  <DrawerCard key={iv.id} status={iv.status} title={`${iv.round || 'Interview'} — ${iv.candidateName || iv.candidateEmail || ''}`}
                    meta={<span className="font-mono">{String(iv.scheduledAt || '').slice(0, 16).replace('T', ' ')}{iv.mode ? ` • ${iv.mode}` : ''}</span>}
                    right={<span className={tonePill(iv.status)}>{iv.status}</span>} />
                )} />
              )}
            </DetailSection>
          )}
          {jobTab === 'activity' && (
            <DetailSection title="Status history" count={(detail.history || []).length}>
              {(detail.history || []).length === 0 ? <div className="text-[11px] text-slate-500 font-medium">No status moves recorded yet.</div> : (
                <ol className="relative ml-1.5 border-l-2 border-slate-100 space-y-3">
                  {(detail.history || []).slice(0, 30).map((h: any, i: number) => (
                    <li key={i} className="ml-4 relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-100" />
                      <div className="text-xs font-bold text-slate-900">{h.from} → {h.to} <span className="font-medium text-slate-500">• {h.by}{h.reason ? ` • ${h.reason}` : ''}</span></div>
                      <div className="text-[11px] text-slate-400 font-mono">{String(h.at || '').slice(0, 16).replace('T', ' ')}</div>
                    </li>
                  ))}
                </ol>
              )}
            </DetailSection>
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
          className={`px-4 py-2 rounded-xl font-bold text-xs disabled:opacity-50 ${b.primary ? 'bg-[#0B5FD9] text-white' : b.danger ? 'bg-white border border-red-200 text-red-600' : 'bg-white border border-slate-200'}`}>{b.label}</button>
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
const KANBAN_TONE: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-600 border-slate-200', 'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-blue-50 text-blue-700 border-blue-200', Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Paused: 'bg-orange-50 text-orange-700 border-orange-200', Closed: 'bg-stone-100 text-stone-500 border-stone-200', Archived: 'bg-slate-200 text-slate-500 border-slate-300',
};

export function JobsKanban({ jobs, onOpen, onDropMove }: { jobs: any[]; onOpen: (j: any) => void; onDropMove: (j: any, to: string) => void }) {
  const [dragId, setDragId] = useState<string | null>(null);
  const cols = KANBAN_ORDER.map((s) => ({ status: s, items: jobs.filter((j) => j.status === s) }));
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-3" data-lenis-prevent>
      <div className="flex gap-3 min-w-[1180px] items-start">
        {cols.map((c) => (
          <div key={c.status} className="flex-1 min-w-[220px] rounded-2xl bg-white border border-slate-200 p-2 flex flex-col max-h-[62vh]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const j = jobs.find((x) => x.id === dragId);
              setDragId(null);
              if (j && c.status !== j.status) onDropMove(j, c.status);
            }}>
            <div className="flex items-center justify-between px-1 pb-1.5 sticky top-0 bg-white z-10">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${KANBAN_TONE[c.status] || KANBAN_TONE.Draft}`}>{c.status}</span>
              <span className="text-[11px] font-extrabold text-slate-400">{c.items.length}</span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-0.5" data-lenis-prevent>
            {c.items.slice(0, 20).map((j) => {
              const next = [...(JOB_TRANSITIONS[j.status] || []), ...(j.status === 'Published' ? ['Approved'] : []), ...(j.status === 'Closed' ? ['Published', 'Paused'] : [])][0];
              return (
              <div key={j.id} draggable onDragStart={() => setDragId(j.id)}
                onClick={() => onOpen(j)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(j); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 cursor-grab active:cursor-grabbing space-y-1" title="Open details (drop onto a column to move with confirmation)">
                <div className="font-extrabold text-xs text-slate-900 truncate">{j.title}</div>
                <div className="font-mono text-[10px] text-slate-500">{j.id} • {j.orgId || ''}</div>
                <div className="text-[11px] font-bold text-slate-600">{j.counts?.applications ?? j.applicantsCount ?? 0} apps → {j.counts?.hired ?? 0} hired • {j.location || '—'}</div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-slate-400">exp {String(j.expiryDate || '').slice(0, 10) || '—'}</span>
                  {next ? <button type="button" title={`Advance to ${next}`} onClick={(e) => { e.stopPropagation(); onDropMove(j, next); }}
                    className="px-2 py-0.5 rounded-lg bg-[#0B5FD9] text-white text-[10px] font-extrabold hover:bg-blue-600">→ {next}</button> : null}
                </div>
              </div>
              );
            })}
            {c.items.length > 20 && <div className="text-[10px] text-slate-400 font-bold px-1">+{c.items.length - 20} more — refine filters</div>}
            </div>
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
