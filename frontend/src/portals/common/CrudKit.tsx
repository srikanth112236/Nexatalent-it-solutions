import { useEffect, useRef, useState } from 'react';

/** Debounced value (§5.5): filter on this, render the raw input immediately. */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** URL-persisted filter state (§5.5): survives reload, back-nav and drawer open/close. */
export function useQueryState(key: string, initial = ''): [string, (v: string) => void] {
  const [val, setVal] = useState(() => {
    try { return new URLSearchParams(window.location.search).get(key) || initial; }
    catch { return initial; }
  });
  const set = (v: string) => {
    setVal(v);
    try {
      const url = new URL(window.location.href);
      if (v) url.searchParams.set(key, v); else url.searchParams.delete(key);
      window.history.replaceState(null, '', url.toString());
    } catch { /* non-browser (tests) */ }
  };
  return [val, set];
}
import { Search, Download, X } from 'lucide-react';
import { useAuth, useCan, usePermissions } from '../../shared/auth/AuthContext';
import { permissionsApi } from '../../shared/enterprise/phaseApi';
import { Modal, Select } from '../../shared/ui/EnterpriseKit';

/** Shared enterprise CRUD primitives — Indeed/Naukri-grade table UX. */

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const esc = (v: unknown) => {
    let s = v === null || v === undefined ? '' : String(v);
    // P3: formula-injection guard — prefix = + - @ with single quote.
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n']/.test(s) && !s.startsWith("'") ? `"${s.replace(/"/g, '""')}"` : (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  };
  // P3: BOM so Excel opens UTF-8 correctly.
  return `\uFEFF${[columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n')}`;
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[], columns: string[]) {
  const blob = new Blob([toCsv(rows, columns)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    // P3: Firefox requires the anchor in DOM for click() to work.
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

const pillTones: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hired: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Suspended: 'bg-red-50 text-red-700 border-red-200',
  Blocked: 'bg-red-50 text-red-700 border-red-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Lost: 'bg-red-50 text-red-700 border-red-200',
  Overdue: 'bg-red-50 text-red-700 border-red-200',
  Void: 'bg-red-50 text-red-700 border-red-200',
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  'Past Due': 'bg-amber-50 text-amber-800 border-amber-200',
  'On Hold': 'bg-amber-50 text-amber-800 border-amber-200',
  Paused: 'bg-amber-50 text-amber-800 border-amber-200',
};

export function StatusPill({ value }: { value: unknown }) {
  const s = String(value ?? '—');
  const tone = pillTones[s] || 'bg-slate-100 text-slate-700 border-slate-200';
  return <span className={`inline-block px-2.5 py-0.5 rounded-full border font-bold text-[11px] whitespace-nowrap ${tone}`}>{s}</span>;
}

export interface SuggestItem {
  key: string; title: string; meta?: string; status?: unknown;
  /** Exact filter text applied on pick. Defaults to `key` when omitted. */
  query?: string;
}

function HiText({ text, q }: { text: string; q: string }) {
  const query = q.trim();
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark className="bg-amber-200/70 text-inherit rounded-sm px-px">{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}</>;
}

/**
 * Search input with live suggestions: once ≥2 characters are typed, a compact
 * modern dropdown shows matching records (status-dot + highlight + pill).
 * Picking a suggestion narrows the list to just that record.
 */
export function SearchSuggest({ value, onChange, onPick, placeholder, items, minChars = 2, maxItems = 7, ariaLabel }: {
  value: string; onChange: (v: string) => void; onPick: (item: SuggestItem) => void;
  placeholder: string; items: SuggestItem[]; minChars?: number; maxItems?: number; ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const q = value.trim();
  const matches = q.length >= minChars
    ? items.filter((it) => `${it.title} ${it.meta || ''} ${it.key}`.toLowerCase().includes(q.toLowerCase())).slice(0, maxItems)
    : [];
  useEffect(() => { setHi(0); }, [q]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open ]);
  const pick = (it: SuggestItem) => { setOpen(false); onPick(it); };
  return (
    <div ref={boxRef} className="relative flex-1 min-w-0">
      <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
      <input
        type="text" value={value} placeholder={placeholder} role="combobox" aria-expanded={open && matches.length > 0} aria-autocomplete="list" aria-label={ariaLabel}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && matches.length > 0) { e.preventDefault(); setOpen(true); setHi((h) => (h + 1) % matches.length); }
          else if (e.key === 'ArrowUp' && matches.length > 0) { e.preventDefault(); setHi((h) => (h - 1 + matches.length) % matches.length); }
          else if (e.key === 'Enter' && open && matches.length > 0) { e.preventDefault(); pick(matches[Math.min(hi, matches.length - 1)]); }
          else if (e.key === 'Escape') { setOpen(false); }
        }}
        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
      />
      {value && (
        <button type="button" aria-label="Clear search" onClick={() => { onChange(''); setOpen(false); }}
          className="absolute right-2 top-2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70">
          <X size={13} />
        </button>
      )}
      {open && q.length >= minChars && (
        <div role="listbox" aria-label="Search suggestions"
          className="absolute z-30 left-0 right-0 mt-1.5 rounded-xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {matches.length > 0 ? `Suggestions • ${matches.length}` : 'No matches'}
            </span>
            <span className="text-[10px] font-bold text-slate-300">↑↓ + Enter</span>
          </div>
          {matches.length === 0 ? (
            <div className="px-3 pb-2.5 text-[11px] font-medium text-slate-500">Keep typing or press Enter to filter by text.</div>
          ) : (
            <ul className="p-1.5 pt-0.5 space-y-1 max-h-72 overflow-y-auto">
              {matches.map((it, i) => {
                const tone = drawerTone(it.status);
                return (
                  <li key={it.key} role="option" aria-selected={i === hi}>
                    <button type="button" onMouseEnter={() => setHi(i)} onClick={() => pick(it)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left text-xs transition ${i === hi ? `${tone.card} shadow-[0_1px_2px_rgba(15,23,42,0.06)]` : 'bg-white border-transparent hover:bg-slate-50'}`}>
                      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full shrink-0 ${tone.dot}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-slate-900 text-[12px] leading-4 truncate"><HiText text={it.title} q={q} /></span>
                        {it.meta ? <span className="block text-[10px] text-slate-500 font-medium leading-4 truncate"><HiText text={it.meta} q={q} /></span> : null}
                      </span>
                      {it.status ? <StatusPill value={it.status} /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export interface SuggestConfig {
  items: any[];
  getTitle: (x: any) => string;
  getMeta?: (x: any) => string | undefined;
  getStatus?: (x: any) => unknown;
  getQuery: (x: any) => string;
  maxItems?: number;
}

export function CrudToolbar({ search, onSearch, searchPh, status, onStatus, statuses, exportProps, onCreate, createLabel, suggest }: {
  search: string; onSearch: (v: string) => void; searchPh: string;
  status?: string; onStatus?: (v: string) => void; statuses?: string[];
  exportProps?: { filename: string; rows: Record<string, unknown>[]; columns: string[] };
  onCreate?: () => void; createLabel?: string;
  suggest?: SuggestConfig;
}) {
  const suggestItems: SuggestItem[] = (suggest?.items || []).map((x: any, i: number) => ({
    key: String(x?.id ?? x?.key ?? i),
    title: suggest!.getTitle(x),
    meta: suggest!.getMeta?.(x),
    status: suggest!.getStatus?.(x),
    query: suggest!.getQuery(x),
  }));
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
      {suggest ? (
        <SearchSuggest value={search} onChange={onSearch} placeholder={searchPh} maxItems={suggest.maxItems}
          items={suggestItems}
          onPick={(it) => onSearch(it.query ?? it.key)} />
      ) : (
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text" value={search} onChange={(e) => onSearch(e.target.value)} placeholder={searchPh}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
          />
        </div>
      )}
      {statuses && (
        <div className="w-full lg:w-44 shrink-0">
          <Select value={status || ''} onChange={(v) => onStatus?.(v)} ariaLabel="Status filter" placeholder="All statuses"
            options={[{ value: '', label: 'All statuses' }, ...statuses.map((s) => ({ value: s, label: s }))]} />
        </div>
      )}
      <div className="flex items-center gap-2 shrink-0">
        {exportProps && (
          <ExportButton filename={exportProps.filename} rows={exportProps.rows} columns={exportProps.columns} />
        )}
        {onCreate && (
          <button type="button" onClick={onCreate}
            className="px-4 py-2 rounded-xl bg-[#0B5FD9] hover:bg-blue-600 text-white font-bold text-xs shadow-md whitespace-nowrap">
            {createLabel || '+ New'}
          </button>
        )}
      </div>
    </div>
  );
}

export function DetailDrawer({ title, subtitle, onClose, children, width = 'max-w-2xl' }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; width?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="drawer-root" role="dialog" aria-modal="true" aria-label={title}>
      <div className="drawer-dim" onClick={onClose} aria-hidden="true" />
      {/* Panel is viewport-pinned; the body below is the ONLY scroller, so
          long content always scrolls inside the drawer and wheel gestures
          never leak to the page behind. Width stays configurable. */}
      <div className={`drawer-panel ${width}`} onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-slate-900 truncate">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close details"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 shrink-0"><X size={16} /></button>
        </div>
        {/* data-lenis-prevent: global smooth-scroll must not steal wheel gestures here */}
        <div data-testid="drawer-scroll" data-lenis-prevent className="drawer-scroll">
          <div className="px-6 py-5 space-y-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function KeyValues({ data }: { data: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      {data.map(([k, v]) => (
        <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
          <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{k}</dt>
          <dd className="font-bold text-slate-900 mt-1 break-words">{v ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer list system — modern compact cards for ALL detail drawers.    */
/* Status-differentiated lighter backgrounds + minimal shadow; 50 rows  */
/* initially, then infinite-scroll / Load-more pagination.             */
/* ------------------------------------------------------------------ */

type DrawerTone = { card: string; dot: string };

const SUCCESS = new Set(['Active', 'Approved', 'Published', 'Paid', 'Won', 'Hired', 'Selected', 'Shortlisted', 'Signed', 'Responded', 'Verified', 'Completed', 'Confirmed', 'Placed', 'On', 'Enabled', 'Grant']);
const DANGER = new Set(['Suspended', 'Blocked', 'Rejected', 'Lost', 'Overdue', 'Void', 'Failed', 'Deleted', 'Withdrawn', 'Expired', 'Unpaid', 'Revoked', 'Revoke', 'Off', 'Closed']);
const WARNING = new Set(['Pending', 'On Hold', 'Paused', 'Past Due', 'Under Review', 'Open', 'Invited', 'Trialing', 'Due', 'Missing']);
const INFO = new Set(['New', 'In Progress', 'Sourcing', 'Scheduled', 'Sent', 'Submitted', 'Partially Paid', 'Interview']);

export function drawerTone(status: unknown): DrawerTone {
  const s = String(status ?? '').trim();
  if (SUCCESS.has(s)) return { card: 'bg-emerald-50/60 border-emerald-200/70 hover:border-emerald-300', dot: 'bg-emerald-500' };
  if (DANGER.has(s)) return { card: 'bg-red-50/60 border-red-200/70 hover:border-red-300', dot: 'bg-red-500' };
  if (WARNING.has(s)) return { card: 'bg-amber-50/60 border-amber-200/70 hover:border-amber-300', dot: 'bg-amber-500' };
  if (INFO.has(s)) return { card: 'bg-blue-50/60 border-blue-200/70 hover:border-blue-300', dot: 'bg-blue-500' };
  return { card: 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300', dot: 'bg-slate-300' };
}

/** Single compact row card. Title + meta left, pill/actions right. */
export function DrawerCard({ status, title, meta, right, children, mono }: {
  status?: unknown; title: React.ReactNode; meta?: React.ReactNode;
  right?: React.ReactNode; children?: React.ReactNode; mono?: boolean;
}) {
  const tone = drawerTone(status);
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2 rounded-xl border text-xs shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:shadow-[0_2px_10px_rgba(15,23,42,0.08)] hover:-translate-y-[1px] transition ${tone.card}`}>
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${tone.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className={`font-bold text-slate-900 text-[13px] leading-5 truncate ${mono ? 'font-mono' : ''}`}>{title}</div>
            {meta ? <div className="text-[11px] text-slate-500 font-medium leading-4 mt-0.5 break-words">{meta}</div> : null}
          </div>
          {right ? <div className="shrink-0 flex items-center gap-1.5 ml-2">{right}</div> : null}
        </div>
        {children ? <div className="mt-1.5">{children}</div> : null}
      </div>
    </div>
  );
}

/** Paginated list: first 50 rows, then infinite-scroll + Load-more. */
export function DrawerList({ items, empty, render, getStatus, initialCount = 50, step = 50, label }: {
  items: any[]; empty: string; render: (x: any, i: number) => React.ReactNode;
  getStatus?: (x: any) => unknown; initialCount?: number; step?: number; label?: string;
}) {
  const [visible, setVisible] = useState(initialCount);
  const sentinel = useRef<HTMLDivElement | null>(null);
  useEffect(() => { setVisible(initialCount); }, [items.length, initialCount]);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || visible >= items.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setVisible((v) => Math.min(v + step, items.length));
    }, { rootMargin: '240px' });
    io.observe(el);
    return () => io.disconnect();
  }, [visible, items.length, step]);
  if (items.length === 0) return <div className="text-[11px] text-slate-500 font-medium p-3 rounded-xl bg-slate-50 border border-slate-200">{empty}</div>;
  const shown = items.slice(0, visible);
  void getStatus;
  return (
    <div>
      {label ? (
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{label}</span>
          <span className="text-[10px] font-bold text-slate-400">Showing {shown.length} of {items.length}</span>
        </div>
      ) : null}
      <div className="space-y-1.5">{shown.map(render)}</div>
      <div ref={sentinel} aria-hidden="true" className="h-1" />
      {visible < items.length ? (
        <div className="pt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500">Showing {shown.length} of {items.length}</span>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => setVisible((v) => Math.min(v + step, items.length))}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:bg-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
              Load more ↓
            </button>
            <button type="button" onClick={() => setVisible(items.length)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-700">
              Show all ({items.length})
            </button>
          </div>
        </div>
      ) : items.length > initialCount ? (
        <div className="pt-1.5 text-[11px] font-bold text-slate-400">All {items.length} shown • scroll to review</div>
      ) : null}
    </div>
  );
}

/** Permission-gated CSV export (§4.3): hidden without `export`, every download audit-logged. */
export function ExportButton({ filename, rows, columns, label = 'Export' }: {
  filename: string; rows: Record<string, unknown>[]; columns: string[]; label?: string;
}) {
  const canExport = useCan('export');
  if (!canExport) return null;
  return (
    <button
      type="button" title="Export filtered rows to CSV"
      onClick={() => {
        downloadCsv(filename, rows, columns);
        permissionsApi.logExport(filename.replace(/\.csv$/, ''), rows.length, { columns }).catch(() => { /* audit best-effort */ });
      }}
      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
    >
      <Download size={14} /> {label}
    </button>
  );
}

/** Global create dialog: one look, one behavior, reusable for any entity. */
export function GlobalCreateModal({ open, onClose, title, subtitle, submitLabel = 'Create', busy, error, onSubmit, children, wide }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  submitLabel?: string; busy?: boolean; error?: string;
  onSubmit: () => void | Promise<void>; children: React.ReactNode; wide?: boolean;
}) {
  const [working, setWorking] = useState(false);
  const [localError, setLocalError] = useState('');
  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle} wide={wide}>
      <div className="space-y-4 text-xs">
        {children}
        {(localError || error) && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-bold" role="alert">{localError || error}</div>}
        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 mt-1">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs mt-3">Cancel</button>
          <button
            type="button"
            disabled={busy || working}
            onClick={async () => {
              setWorking(true); setLocalError('');
              try { await onSubmit(); }
              catch (e) { setLocalError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || (e as Error)?.message || 'Failed. Try again.'); }
              finally { setWorking(false); }
            }}
            className="px-6 py-2.5 rounded-xl bg-[#0B5FD9] hover:bg-blue-600 text-white font-bold text-xs shadow-md disabled:opacity-50 mt-3"
          >
            {(busy || working) ? 'Creating…' : submitLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export interface ActionGuard {
  allowed: boolean;
  reason: string;
}

const PRIVILEGED = ['superadmin', 'platform_owner'];

/** Pure record/permission rule check — safe to call per row. Deny-by-default:
 *  the server re-validates everything. Unknown states default to denied. */
export function checkRecordAction(kind: 'requirement' | 'job' | 'application', record: any, action: string, opts: { privileged?: boolean; can?: (p: string) => boolean; context?: { requirement?: any } }): ActionGuard {
  const privileged = !!opts.privileged;
  const can = opts.can || (() => true);
  if (!record) return { allowed: false, reason: 'Record not loaded yet.' };

  if (kind === 'requirement') {
    const st = record.status;
    switch (action) {
      case 'approve':
      case 'reject':
      case 'changes':
        if (st !== 'Pending Approval') return { allowed: false, reason: `Only requirements in Pending Approval can be decided (current: ${st || 'unknown'}).` };
        return { allowed: true, reason: '' };
      case 'edit':
        if (!privileged && !['Draft', 'Pending Approval'].includes(st)) return { allowed: false, reason: `Only Draft / Pending Approval can be edited (current: ${st}).` };
        return { allowed: true, reason: '' };
      case 'delete': {
        if (!privileged && !['Draft', 'Cancelled'].includes(st)) return { allowed: false, reason: `Only Draft / Cancelled can be deleted (current: ${st}). Cancel first.` };
        const linked = record.rollup?.linkedJobs?.length ?? 0;
        if (linked > 0 && !privileged) return { allowed: false, reason: `Has ${linked} linked job posting(s) — cancel them first.` };
        return { allowed: true, reason: '' };
      }
      case 'assign':
        return can('assign') ? { allowed: true, reason: '' } : { allowed: false, reason: `Requires the 'assign' permission.` };
      default:
        return { allowed: false, reason: `Unknown action '${action}' — denied by default.` };
    }
  }
  if (kind === 'job') {
    const st = record.status;
    switch (action) {
      case 'publish': {
        if (st !== 'Approved') return { allowed: false, reason: `Only Approved postings can be published (current: ${st}).` };
        const req = opts.context?.requirement;
        if (req && !['Approved', 'Sourcing'].includes(req.status)) return { allowed: false, reason: `Parent requirement ${req.id} is ${req.status} — approve it first.` };
        if (req && !(Number(req.openings) > 0)) return { allowed: false, reason: `Parent requirement ${req.id} has no openings left.` };
        return { allowed: true, reason: '' };
      }
      case 'unpublish':
        if (st !== 'Published') return { allowed: false, reason: `Only Published postings can be unpublished (current: ${st}).` };
        if (!can('approve')) return { allowed: false, reason: `Requires the 'approve' permission.` };
        return { allowed: true, reason: '' };
      case 'reopen':
        if (st !== 'Closed') return { allowed: false, reason: `Only Closed postings can be reopened (current: ${st}).` };
        if (!can('approve')) return { allowed: false, reason: `Requires the 'approve' permission.` };
        return { allowed: true, reason: '' };
      case 'pause':
        if (!['Published'].includes(st)) return { allowed: false, reason: `Only Published postings can be paused (current: ${st}).` };
        return { allowed: true, reason: '' };
      case 'close':
        if (!['Published', 'Paused'].includes(st)) return { allowed: false, reason: `Only Published / Paused postings can be closed (current: ${st}).` };
        return { allowed: true, reason: '' };
      case 'archive':
        if (st !== 'Closed') return { allowed: false, reason: `Only Closed postings can be archived (current: ${st}).` };
        return { allowed: true, reason: '' };
      case 'edit':
        return { allowed: true, reason: '' };
      default:
        return { allowed: false, reason: `Unknown action '${action}' — denied by default.` };
    }
  }
  // application
  const stage = record.stage;
  switch (action) {
    case 'move':
      if (['Hired', 'Withdrawn', 'Rejected'].includes(stage)) return { allowed: false, reason: `${stage} applications are terminal — reopen explicitly to continue.` };
      return { allowed: true, reason: '' };
    case 'withdraw':
      if (['Hired', 'Withdrawn'].includes(stage)) return { allowed: false, reason: `Cannot withdraw from stage ${stage}.` };
      return { allowed: true, reason: '' };
    case 'reopen':
      if (!['Withdrawn', 'Rejected'].includes(stage)) return { allowed: false, reason: `Only Withdrawn / Rejected applications can be reopened (current: ${stage}).` };
      return { allowed: true, reason: '' };
    default:
      return { allowed: false, reason: `Unknown action '${action}' — denied by default.` };
  }
}

/** Hook wrapper: resolves role + permissions once, then delegates. */
export function useActionGuard(kind: 'requirement' | 'job' | 'application', record: any, action: string, context?: { requirement?: any }): ActionGuard {
  const perms = usePermissions();
  const { user } = useAuth();
  return checkRecordAction(kind, record, action, {
    privileged: !!user && PRIVILEGED.includes(user.role),
    // P2-8: fail-closed while permissions load (was perms===null|| => allowed).
    can: (p: string) => !!perms && perms.includes(p),
    context,
  });
}

export function useSelectable() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const clear = () => setSelected(new Set());
  return { selected, toggle, clear, count: selected.size };
}
