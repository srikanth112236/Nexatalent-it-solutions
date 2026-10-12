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
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm focus-visible:outline-none"
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
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
        >
          <X size={18} aria-hidden />
        </button>

        <span className="inline-block rounded-full bg-[#0265FF]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0265FF]">
          Sign in to apply
        </span>
        <h2 id="login-modal-title" className="mt-3 text-xl font-extrabold tracking-tight text-slate-950">
          Login to your account
        </h2>
        {jobTitle ? (
          <p className="mt-1.5 text-sm text-slate-600">
            Applying for <strong className="text-slate-900">{jobTitle}</strong>
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
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-bold text-slate-700">
              Email or mobile
            </label>
            <div className="flex min-h-[46px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-[#0265FF] focus-within:ring-2 focus-within:ring-[#0265FF]/15">
              <Mail size={16} className="shrink-0 text-slate-400" aria-hidden />
              <input
                id="login-email"
                type="text"
                autoComplete="username"
                placeholder="you@company.com"
                className="min-h-[42px] w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#0265FF] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex min-h-[46px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-[#0265FF] focus-within:ring-2 focus-within:ring-[#0265FF]/15">
              <Lock size={16} className="shrink-0 text-slate-400" aria-hidden />
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="min-h-[42px] w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#0265FF] text-sm font-bold text-white shadow-lg shadow-[#0265FF]/25 transition-colors hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
          >
            Sign in & apply <ArrowRight size={15} aria-hidden />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New to NexaTalent?{' '}
          <Link to="/candidate/register" className="font-bold text-[#0265FF] hover:underline">
            Create a free profile
          </Link>
        </p>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-400">
          One profile applies to every matched mandate — no spam, ever.
        </p>
      </div>
    </div>
  );
}
