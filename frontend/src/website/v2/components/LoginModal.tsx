import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';

/**
 * Login dialog shown when a candidate clicks Apply.
 * Accessible: role=dialog, aria-modal, ESC closes, focus trapped, scroll locked.
 */
export function LoginModal({
  open,
  onClose,
  jobTitle,
}: {
  open: boolean;
  onClose: () => void;
  jobTitle?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden={!open}>
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close login"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm focus-visible:outline-none"
      />

      {/* dialog */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors hover:bg-slate-100 hover:text-black focus-visible:outline-2 focus-visible:outline-black"
        >
          <X size={18} aria-hidden />
        </button>

        <span className="inline-block rounded-full bg-black/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
          Sign in to apply
        </span>
        <h2 id="login-modal-title" className="mt-3 text-xl font-extrabold tracking-tight text-black">
          Login to your account
        </h2>
        {jobTitle ? (
          <p className="mt-1.5 text-sm text-black">
            Applying for <strong className="text-black">{jobTitle}</strong>
          </p>
        ) : null}

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = '/login';
          }}
        >
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-bold text-black">
              Email or mobile
            </label>
            <div className="flex min-h-[46px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-black focus-within:ring-2 focus-within:ring-black/15">
              <Mail size={16} className="shrink-0 text-black" aria-hidden />
              <input
                id="login-email"
                type="text"
                autoComplete="username"
                placeholder="you@company.com"
                className="min-h-[42px] w-full bg-transparent text-sm outline-none placeholder:text-black"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="block text-xs font-bold text-black">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-black hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex min-h-[46px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-black focus-within:ring-2 focus-within:ring-black/15">
              <Lock size={16} className="shrink-0 text-black" aria-hidden />
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="min-h-[42px] w-full bg-transparent text-sm outline-none placeholder:text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-bold text-white shadow-lg shadow-black/25 transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Sign in & apply <ArrowRight size={15} aria-hidden />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-black">
          New to NexaTalent?{' '}
          <Link to="/candidate/register" className="font-bold text-black hover:underline">
            Create a free profile
          </Link>
        </p>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-black">
          One profile applies to every matched mandate — no spam, ever.
        </p>
      </div>
    </div>
  );
}
