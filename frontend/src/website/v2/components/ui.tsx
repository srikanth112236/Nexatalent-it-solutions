import { Link } from 'react-router-dom';

/** Shared white-theme primitives for v2 — full white page, hairline dividers separate sections. */
export const V2_CREAM = '#FFFFFF';

/**
 * Compact section heading.
 * Uses role=heading instead of <h2> because global CSS forces `section h2`
 * to the large --section-title-size with !important.
 */
export function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      role="heading"
      aria-level={2}
      className={`text-[13px] font-extrabold uppercase tracking-wider text-black ${className}`}
    >
      {children}
    </p>
  );
}

export function SectionHead({ eyebrow, title, sub, dark = false }: { eyebrow?: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow ? (
        <span
          className={`mb-3 inline-block rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
            dark ? 'border-white/20 bg-white/10 text-white' : 'border-black/25 bg-white text-black'
          }`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2 className={`text-2xl font-extrabold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-black'}`}>{title}</h2>
      {sub ? <p className={`mt-3 text-sm leading-relaxed ${dark ? 'text-neutral-300' : 'text-black'}`}>{sub}</p> : null}
    </div>
  );
}

export function PillButton({ to, label, variant = 'dark' }: { to: string; label: string; variant?: 'dark' | 'light' | 'outline' }) {
  const cls =
    variant === 'dark'
      ? 'bg-black text-white hover:bg-neutral-800'
      : variant === 'light'
        ? 'bg-white text-black hover:bg-neutral-100'
        : 'border border-neutral-300 bg-white text-black hover:bg-neutral-100';
  return (
    <Link
      to={to}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${cls}`}
    >
      {label}
    </Link>
  );
}

export function CreamSection({ id, children, label }: { id?: string; children: React.ReactNode; dark?: boolean; label?: string }) {
  return (
    <section
      id={id}
      aria-label={label}
      className="border-t border-neutral-100 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
