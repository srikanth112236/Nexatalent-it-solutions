import { useState } from 'react';
import { Search, Download, X } from 'lucide-react';

/** Shared enterprise CRUD primitives — Indeed/Naukri-grade table UX. */

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n');
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[], columns: string[]) {
  const blob = new Blob([toCsv(rows, columns)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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

export function CrudToolbar({ search, onSearch, searchPh, status, onStatus, statuses, onExport, onCreate, createLabel }: {
  search: string; onSearch: (v: string) => void; searchPh: string;
  status?: string; onStatus?: (v: string) => void; statuses?: string[];
  onExport?: () => void; onCreate?: () => void; createLabel?: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
      <div className="relative flex-1 min-w-0">
        <Search size={14} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text" value={search} onChange={(e) => onSearch(e.target.value)} placeholder={searchPh}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
        />
      </div>
      {statuses && (
        <select value={status || ''} onChange={(e) => onStatus?.(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none">
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      )}
      <div className="flex items-center gap-2 shrink-0">
        {onExport && (
          <button type="button" onClick={onExport} title="Export filtered rows to CSV"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5">
            <Download size={14} /> Export
          </button>
        )}
        {onCreate && (
          <button type="button" onClick={onCreate}
            className="px-4 py-2 rounded-xl bg-[#087BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md whitespace-nowrap">
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
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`w-full ${width} h-full bg-white shadow-2xl overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-slate-900 truncate">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close details"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 shrink-0"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-5">{children}</div>
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

export function useSelectable() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const clear = () => setSelected(new Set());
  return { selected, toggle, clear, count: selected.size };
}
