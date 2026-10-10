import { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Check } from 'lucide-react';

/* Compact field wrapper for modal forms */
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-slate-500 font-medium mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-spec-electric focus:ring-2 focus:ring-spec-electric/20';

/* Compact modal — CRUD lives here. Fixed overlay, never disturbs layout. */
export function Modal({ open, onClose, title, subtitle, children, wide }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; wide?: boolean;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  // Stable callback ref: inline onClose props must NOT re-trigger this effect
  // on every keystroke (that re-stole focus into the dialog mid-typing).
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move keyboard focus into the dialog ONCE on open only (§5.5) — and only
    // when focus isn't already inside (never rip it away mid-typing).
    let t: ReturnType<typeof setTimeout> | undefined;
    if (dialogRef.current && !dialogRef.current.contains(document.activeElement)) {
      t = setTimeout(() => {
        if (dialogRef.current && !dialogRef.current.contains(document.activeElement)) dialogRef.current.focus();
      }, 30);
    }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; if (t) clearTimeout(t); };
  }, [open ]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="absolute inset-0 bg-spec-navy/60 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} tabIndex={-1} className={`relative bg-white rounded-3xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[88vh] flex flex-col border border-spec-border outline-none`}>
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h3 id={titleId} className="text-base font-extrabold text-spec-charcoal">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto" data-lenis-prevent>{children}</div>
      </div>
    </div>
  );
}

/* Destructive confirmation in a modal, optional reason capture */
export function ConfirmDialog({ open, title, body, confirmLabel = 'Delete', requireReason, onConfirm, onCancel }: {
  open: boolean; title: string; body: string; confirmLabel?: string; requireReason?: string;
  onConfirm: (reason?: string) => void | Promise<void>; onCancel: () => void;
}) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (open) { setReason(''); setError(''); setBusy(false); } }, [open ]);
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-3">
        <p className="text-xs text-slate-600 font-medium">{body}</p>
        {requireReason && (
          <Field label={requireReason}>
            <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} placeholder="Reason (recorded in audit log)" />
          </Field>
        )}
        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold" role="alert">{error}</div>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
          <button
            type="button"
            disabled={busy || (!!requireReason && !reason.trim())}
            onClick={async () => {
              setBusy(true); setError('');
              try { await onConfirm(requireReason ? reason.trim() : undefined); onCancel(); }
              catch (e) { setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || (e as Error)?.message || 'Failed. Try again.'); }
              finally { setBusy(false); }
            }}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50"
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* Global consequential-action confirmation (§Action System).
   Fixed anatomy everywhere: why allowed → numbered steps → consequences +
   locks → reason (when required) → confirm. Server re-validates everything. */
export function ActionConfirm({ open, title, subtitle, why, steps, consequences, locks, extra, requireReason, reasonLabel = 'Reason *', confirmLabel = 'Confirm', tone = 'primary', busy: busyProp, error: errorProp, onConfirm, onCancel }: {
  open: boolean; title: string; subtitle?: string;
  why?: string[]; steps?: string[]; consequences?: string[]; locks?: string[]; extra?: React.ReactNode;
  requireReason?: boolean; reasonLabel?: string; confirmLabel?: string;
  tone?: 'primary' | 'danger' | 'dark'; busy?: boolean; error?: string;
  onConfirm: (reason?: string) => void | Promise<void>; onCancel: () => void;
}) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (open) { setReason(''); setError(''); setBusy(false); } }, [open ]);
  const toneCls = tone === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : tone === 'dark'
      ? 'bg-spec-navy hover:bg-spec-midnight text-white'
      : 'bg-spec-electric hover:bg-[#0069d1] text-white';
  return (
    <Modal open={open} onClose={onCancel} title={title} subtitle={subtitle}>
      <div className="space-y-3 text-xs">
        {why && why.length > 0 && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <div className="font-extrabold text-emerald-900 text-[11px] uppercase tracking-wider">Why this is allowed now</div>
            {why.map((w) => <div key={w} className="text-emerald-900 font-medium">✓ {w}</div>)}
          </div>
        )}
        {steps && steps.length > 0 && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">What will happen</div>
            <ol className="space-y-1">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-2 text-slate-700 font-medium">
                  <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-slate-900 text-white text-[10px] font-extrabold inline-flex items-center justify-center">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {((consequences && consequences.length > 0) || (locks && locks.length > 0)) && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <div className="font-extrabold text-amber-900 text-[11px] uppercase tracking-wider">Consequences</div>
            {(consequences || []).map((c) => <div key={c} className="text-amber-900 font-medium">• {c}</div>)}
            {(locks || []).map((l) => <div key={l} className="text-amber-900 font-bold">🔒 {l}</div>)}
          </div>
        )}
        {extra}
        {requireReason && (
          <Field label={reasonLabel}>
            <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} placeholder="Recorded with actor + timestamp" />
          </Field>
        )}
        {(error || errorProp) && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold" role="alert">{error || errorProp}</div>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">Cancel</button>
          <button
            type="button"
            disabled={busy || busyProp || (!!requireReason && !reason.trim())}
            onClick={async () => {
              setBusy(true); setError('');
              try { await onConfirm(requireReason ? reason.trim() : undefined); }
              catch (e) { setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || (e as Error)?.message || 'Failed. Try again.'); }
              finally { setBusy(false); }
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs disabled:opacity-50 ${toneCls}`}
          >
            {(busy || busyProp) ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export interface MenuItem {
  label: string;
  danger?: boolean;
  onSelect: () => void;
}

/* ⋯ row actions in a body-level portal — floats above tables/cards, never shifts layout */
export function RowMenu({ items, label = 'Row actions' }: { items: MenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const estH = Math.min(items.length * 37 + 12, 320);
    const openUp = r.bottom + estH + 8 > window.innerHeight && r.top - estH - 8 > 0;
    setPos({
      top: openUp ? Math.max(8, r.top - estH - 4) : Math.min(r.bottom + 4, window.innerHeight - estH - 8),
      left: Math.max(8, Math.min(r.right - 192, window.innerWidth - 200)),
    });
  };
  useEffect(() => {
    if (!open) return;
    place();
    const onDoc = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => (h + 1) % items.length); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => (h - 1 + items.length) % items.length); }
      if (e.key === 'Enter') { e.preventDefault(); const it = items[highlight]; setOpen(false); it?.onSelect(); }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); };
  }, [open, items, highlight]);
  if (items.length === 0) return null;
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => { setHighlight(0); setOpen((v) => !v); }}
        className={`p-2 rounded-lg border font-bold transition-colors shrink-0 ${open ? 'bg-spec-navy text-white border-spec-navy' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        <MoreHorizontal size={15} />
      </button>
      {open && createPortal(
        <div ref={menuRef} role="menu" style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 200 }} className="w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5">
          {items.map((it, i) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              onMouseEnter={() => setHighlight(i)}
              onClick={() => { setOpen(false); it.onSelect(); }}
              className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors ${it.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-spec-pale'} ${highlight === i ? (it.danger ? 'bg-red-50' : 'bg-spec-pale') : ''}`}
            >
              {it.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

/* Lightweight rich-text editor — HTML in, HTML out. Used for long-form fields. */
export function RichText({ value, onChange, label, minHeight = 120 }: { value: string; onChange: (html: string) => void; label: string; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const cmd = (c: string, v?: string) => { ref.current?.focus(); document.execCommand(c, false, v); ref.current && onChange(ref.current.innerHTML); };
  return (
    <div>
      <span className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">{label}</span>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap gap-1 p-1.5 bg-slate-100 border-b border-slate-200">
          {[['H2', 'formatBlock', '<h2>'], ['H3', 'formatBlock', '<h3>'], ['B', 'bold'], ['I', 'italic'], ['U', 'underline']].map(([l, c, v]) => (
            <button key={l as string} type="button" title={l as string} onMouseDown={(e) => e.preventDefault()} onClick={() => cmd(c as string, v as string)}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-spec-electric">{l}</button>
          ))}
          {[['•', 'insertUnorderedList'], ['1.', 'insertOrderedList']].map(([l, c]) => (
            <button key={l as string} type="button" title="List" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd(c as string)}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-spec-electric">{l}</button>
          ))}
          <button type="button" title="Clear formatting" onMouseDown={(e) => e.preventDefault()} onClick={() => cmd('removeFormat')}
            className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-bold text-[11px] hover:border-spec-electric">⌫</button>
        </div>
        <div ref={ref} contentEditable suppressContentEditableWarning aria-label={label}
          className="p-3 bg-white text-xs leading-relaxed focus:outline-none min-h-[120px]"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)} />
      </div>
    </div>
  );
}

/* Shared portal-popover positioning: floats above modals/drawers/tables, never clips. */
function usePortalPos() {
  const btnRef = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const place = (estH: number, width?: number) => {
    const r = (btnRef.current as HTMLElement | null)?.getBoundingClientRect();
    if (!r) return;
    const w = width || r.width;
    const openUp = r.bottom + estH + 8 > window.innerHeight && r.top - estH - 8 > 0;
    setPos({
      top: openUp ? Math.max(8, r.top - estH - 4) : Math.min(r.bottom + 4, window.innerHeight - estH - 8),
      left: Math.max(8, Math.min(r.left, window.innerWidth - w - 8)),
      width: w,
    });
  };
  return { btnRef, pos, place };
}

/* Custom dropdown — replaces native <select> */
export function Select({ value, onChange, options, placeholder = 'Select…', ariaLabel, dark }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; ariaLabel?: string; dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const menuRef = useRef<HTMLUListElement>(null);
  const { btnRef, pos, place } = usePortalPos();
  const current = options.find((o) => o.value === value);
  useEffect(() => {
    if (!open) return;
    place(Math.min(options.length * 36 + 12, 232));
    const onDoc = (e: MouseEvent) => {
      if ((btnRef.current as HTMLElement | null)?.contains(e.target as Node)) return;
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, options.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
      if (e.key === 'Enter' && highlight >= 0) { e.preventDefault(); onChange(options[highlight].value); setOpen(false); }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); };
  }, [open, highlight, options, onChange ]);
  return (
    <>
      <button
        ref={btnRef as React.RefObject<HTMLButtonElement>}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel || placeholder}
        onClick={() => { setHighlight(Math.max(0, options.findIndex((o) => o.value === value))); setOpen((v) => !v); }}
        className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${dark ? 'bg-[#090d16] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'}`}
      >
        <span className={current ? '' : 'text-slate-500'}>{current ? current.label : placeholder}</span>
        <ChevronDown size={14} className="text-slate-500" />
      </button>
      {open && createPortal(
        <ul ref={menuRef} role="listbox" style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 200 }}
          className={`rounded-2xl border shadow-xl py-1.5 max-h-56 overflow-y-auto ${dark ? 'bg-[#111726] border-slate-700' : 'bg-white border-slate-200'}`}>
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`px-3.5 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between ${o.value === value ? 'text-spec-electric' : dark ? 'text-slate-200' : 'text-slate-700'} ${highlight === i ? (dark ? 'bg-slate-800' : 'bg-spec-pale') : ''}`}
            >
              {o.label}
              {o.value === value && <Check size={13} />}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </>
  );
}

/* Custom calendar date picker — replaces native date inputs. Value: yyyy-mm-dd. */
function toISODate(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DatePicker({ value, onChange, placeholder = 'Pick a date', ariaLabel }: {
  value: string; onChange: (iso: string) => void; placeholder?: string; ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const seed = value ? new Date(value + 'T00:00:00') : new Date();
  const [view, setView] = useState({ y: seed.getFullYear(), m: seed.getMonth() });
  const menuRef = useRef<HTMLDivElement>(null);
  const { btnRef, pos, place } = usePortalPos();
  useEffect(() => {
    if (!open) return;
    place(320, 256);
    const onDoc = (e: MouseEvent) => {
      if ((btnRef.current as HTMLElement | null)?.contains(e.target as Node)) return;
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); };
  }, [open ]);
  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const todayISO = toISODate(new Date());
  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };
  return (
    <>
      <button
        ref={btnRef as React.RefObject<HTMLButtonElement>}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel || placeholder}
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 flex items-center justify-between gap-2 hover:border-slate-300"
      >
        <span className={value ? '' : 'text-slate-500'}>{value || placeholder}</span>
        <ChevronDown size={14} className="text-slate-500" />
      </button>
      {open && createPortal(
        <div ref={menuRef} role="dialog" aria-label="Choose date" style={{ position: 'fixed', top: pos.top, left: pos.left, width: 256, zIndex: 200 }} className="bg-white rounded-2xl border border-slate-200 shadow-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><ChevronLeft size={14} /></button>
            <span className="text-xs font-extrabold text-spec-charcoal">{MONTHS[view.m]} {view.y}</span>
            <button type="button" aria-label="Next month" onClick={() => shift(1)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-extrabold text-slate-500 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (day === null) return <span key={`b${i}`} />;
              const iso = toISODate(new Date(view.y, view.m, day));
              const selected = iso === value;
              const isToday = iso === todayISO;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => { onChange(iso); setOpen(false); }}
                  className={`aspect-square rounded-lg text-[11px] font-bold transition-colors ${selected ? 'bg-spec-electric text-white' : isToday ? 'bg-spec-pale text-spec-electric border border-spec-electric/40' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { onChange(todayISO); setOpen(false); }} className="text-[11px] font-bold text-spec-electric">Today</button>
            {value && <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="text-[11px] font-bold text-slate-500">Clear</button>}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
