import { useState, useEffect, useRef, useId } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { apiClient } from '../api-client';
import { inputCls } from './EnterpriseKit';

/* Shared search UX (§5): typeahead suggestions after 2 chars, skills
 * multi-select backed by the skills taxonomy, collapsible filter panels
 * for listing pages (tables keep inline search), and one compact DataTable
 * so every portal renders data the same enterprise way. */

function useDebounced(value: string, ms: number): string {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Typeahead text input. Suggestions appear after `minChars` (default 2)
 *  with a match count; full keyboard support (up/down/enter/esc). */
export function SearchSuggest({ value, onChange, fetchSuggestions, placeholder, ariaLabel, minChars = 2 }: {
  value: string;
  onChange: (v: string) => void;
  fetchSuggestions: (q: string) => Promise<string[]> | string[];
  placeholder?: string;
  ariaLabel?: string;
  minChars?: number;
}) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const dq = useDebounced(value, 200);

  useEffect(() => {
    const q = dq.trim();
    if (q.length < minChars) { setItems([]); setOpen(false); return; }
    let live = true;
    setLoading(true);
    Promise.resolve()
      .then(() => fetchSuggestions(q))
      .then((rows) => {
        if (!live) return;
        setItems((Array.isArray(rows) ? rows : []).filter(Boolean).slice(0, 8));
        setOpen(true);
        setHi(-1);
      })
      .catch(() => { if (live) { setItems([]); setOpen(false); } })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [dq, minChars, fetchSuggestions]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (s: string) => {
    onChange(s);
    setOpen(false);
    setHi(-1);
  };

  return (
    <div ref={boxRef} className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { if (items.length > 0) setOpen(true); }}
        onKeyDown={(e) => {
          if (!open || items.length === 0) {
            if (e.key === 'Escape') (e.target as HTMLInputElement).blur();
            return;
          }
          if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => (h + 1) % items.length); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => (h - 1 + items.length) % items.length); }
          else if (e.key === 'Enter' && hi >= 0) { e.preventDefault(); pick(items[hi]); }
          else if (e.key === 'Escape') setOpen(false);
        }}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={hi >= 0 ? `${listId}-opt-${hi}` : undefined}
        autoComplete="off"
        className={inputCls + ' bg-white'}
      />
      {open && items.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {items.map((s, i) => (
            <li key={`${s}-${i}`} id={`${listId}-opt-${i}`} role="option" aria-selected={i === hi}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                onMouseEnter={() => setHi(i)}
                className={`w-full text-left px-3 py-2 text-xs font-semibold truncate ${i === hi ? 'bg-blue-50 text-[#0B5FD9]' : 'text-slate-700'}`}
              >
                {s}
              </button>
            </li>
          ))}
          <li className="px-3 py-1.5 text-[10px] font-bold text-slate-400 border-t border-slate-100" aria-hidden="true">
            {items.length} match{items.length === 1 ? '' : 'es'}{loading ? '…' : ''}
          </li>
        </ul>
      )}
    </div>
  );
}

/** Skill names from the taxonomy API (paged or plain shapes both handled). */
export async function fetchSkillSuggestions(q: string): Promise<string[]> {
  try {
    const res = (await apiClient.get(`/api/v1/skills?q=${encodeURIComponent(q)}&page=1&pageSize=20`)) as { data?: any };
    const body = res?.data as any;
    const rows = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    const names = rows.map((r: any) => String(r?.name || '')).filter(Boolean);
    const ql = q.toLowerCase();
    const starts = names.filter((n: string) => n.toLowerCase().startsWith(ql));
    const rest = names.filter((n: string) => !n.toLowerCase().startsWith(ql));
    return [...starts, ...rest];
  } catch {
    return [];
  }
}

/** Multi-select skills input: taxonomy suggestions + chips + Enter-to-add. */
export function SkillsMultiSelect({ value, onChange, placeholder = 'Skills — type 2+ letters, Enter to add' }: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const dq = useDebounced(draft, 200);

  useEffect(() => {
    const q = dq.trim();
    if (q.length < 2) { setHints([]); setOpen(false); return; }
    let live = true;
    fetchSkillSuggestions(q).then((rows) => {
      if (!live) return;
      const picked = new Set(value.map((v) => v.toLowerCase()));
      setHints(rows.filter((r) => !picked.has(r.toLowerCase())).slice(0, 8));
      setOpen(true);
      setHi(-1);
    });
    return () => { live = false; };
  }, [dq, value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const add = (raw: string) => {
    const s = raw.trim().replace(/,+/g, '');
    if (!s) return;
    if (!value.some((v) => v.toLowerCase() === s.toLowerCase())) onChange([...value, s]);
    setDraft('');
    setHints([]);
    setOpen(false);
  };
  const remove = (s: string) => onChange(value.filter((v) => v !== s));

  return (
    <div ref={boxRef} className="relative">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1.5">
          {value.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#0B5FD9] border border-blue-200 font-bold text-[11px]">
              {s}
              <button type="button" onClick={() => remove(s)} aria-label={`Remove ${s}`} className="hover:text-red-600"><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => { if (hints.length > 0) setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && draft.trim()) {
            e.preventDefault();
            add(open && hi >= 0 && hints[hi] ? hints[hi] : draft);
          } else if (e.key === 'Backspace' && !draft && value.length > 0) {
            remove(value[value.length - 1]);
          } else if (e.key === 'ArrowDown' && open) { e.preventDefault(); setHi((h) => (h + 1) % Math.max(hints.length, 1)); }
          else if (e.key === 'ArrowUp' && open) { e.preventDefault(); setHi((h) => (h - 1 + hints.length) % Math.max(hints.length, 1)); }
          else if (e.key === 'Escape') setOpen(false);
        }}
        placeholder={placeholder}
        aria-label="Skills"
        autoComplete="off"
        className={inputCls + ' bg-white font-mono'}
      />
      {open && hints.length > 0 && (
        <ul role="listbox" className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {hints.map((s, i) => (
            <li key={s} role="option" aria-selected={i === hi}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(s)}
                onMouseEnter={() => setHi(i)}
                className={`w-full text-left px-3 py-2 text-xs font-semibold font-mono truncate ${i === hi ? 'bg-blue-50 text-[#0B5FD9]' : 'text-slate-700'}`}
              >
                + {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Collapsible filter container for listing pages (default open; optional
 *  localStorage persistence). Tables keep their inline search rows. */
export function FilterPanel({ title, count, children, defaultOpen = true, storageKey }: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  storageKey?: string;
}) {
  const [open, setOpen] = useState(() => {
    if (!storageKey) return defaultOpen;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw === null ? defaultOpen : raw === '1';
    } catch {
      return defaultOpen;
    }
  });
  const toggle = () => {
    setOpen((v) => {
      if (storageKey) {
        try { localStorage.setItem(storageKey, v ? '0' : '1'); } catch { /* noop */ }
      }
      return !v;
    });
  };
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-extrabold text-slate-700 hover:text-slate-900"
      >
        <span className="flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-[10px]">{count} shown</span>
          )}
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

/** One compact enterprise table for every portal. Columns render per row;
 *  horizontal scroll on small screens, sticky header, hover rows. */
export function DataTable<T>({ columns, rows, keyOf, emptyTitle = 'No records', emptyMessage = 'Nothing matches the current filters.' }: {
  columns: { key: string; label: string; render: (row: T) => React.ReactNode; className?: string }[];
  rows: T[];
  keyOf: (row: T, i: number) => string;
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="font-extrabold text-slate-900 text-sm">{emptyTitle}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">{emptyMessage}</div>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full text-left text-xs min-w-[640px]">
        <thead className="sticky top-0 bg-white">
          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            {columns.map((c) => (
              <th key={c.key} className={`pb-2 pr-3 whitespace-nowrap ${c.className || ''}`}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
          {rows.map((r, i) => (
            <tr key={keyOf(r, i)} className="hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className={`py-2 pr-3 align-top ${c.className || ''}`}>{c.render(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
