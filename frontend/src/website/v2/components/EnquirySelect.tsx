import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface EnquirySelectProps {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  /** Open the menu upward (for selects near the bottom of a scrollable card). */
  openUp?: boolean;
  labelClassName?: string;
}

/**
 * Shared modern dropdown for every website lead form — one design, one behaviour.
 * Custom button + animated chevron + elevated option menu; closes on
 * outside-click, Escape or scroll. Bottom-row menus open upward (openUp).
 */
export function EnquirySelect({
  id,
  label,
  optional = false,
  value,
  onChange,
  options,
  openUp = false,
  labelClassName = 'mb-1.5 block text-[11px] font-bold text-black',
}: EnquirySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // NOTE: no scroll-to-close — the menu is anchored to its button so it
    // travels with the page, and closing on scroll made the options
    // impossible to scroll through.
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}{' '}
        {optional && <span className="font-medium text-black/50">Optional</span>}
      </label>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          onClick={() => setOpen((o) => !o)}
          className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-left text-[13px] font-semibold text-black shadow-sm outline-none transition-all ${
            open
              ? 'border-black ring-2 ring-black/15'
              : 'border-neutral-200 hover:border-black/50 hover:shadow focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/15'
          }`}
        >
          <span className="truncate">{value}</span>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
              open ? 'bg-black text-white' : 'bg-neutral-100 text-black'
            }`}
          >
            <ChevronDown
              size={13}
              strokeWidth={3}
              aria-hidden
              className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
        {open && (
          <ul
            role="listbox"
            aria-label={label}
            className={`absolute z-30 max-h-60 w-full overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] ${
              openUp ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {options.map((o) => {
              const selected = o === value;
              return (
                <li key={o} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-black ${
                      selected ? 'bg-neutral-100 font-bold text-black' : 'font-medium text-black/80 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                        selected ? 'bg-black text-white' : 'bg-neutral-100 text-transparent'
                      }`}
                    >
                      <Check size={12} strokeWidth={3.5} aria-hidden />
                    </span>
                    <span className="truncate">{o}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
