import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '../../components/Logo';

/**
 * Sticky floating-pill navbar — plain links only (no dropdown menus).
 * Clicking Solutions / Industries goes straight to the full pages.
 */
export function V2Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0265FF] via-[#00C48C] to-[#0265FF]" aria-hidden />
      <div className="border-b border-slate-100 bg-white/90 px-3 pt-3 backdrop-blur-md sm:px-6">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-black/5 bg-white py-2.5 pl-5 pr-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <Link to="/" aria-label="NexaTalent home" className="shrink-0">
            <Logo height={34} />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 text-[13px] font-semibold text-slate-800 lg:flex">
            <Link to="/about" className="transition-colors hover:text-[#0265FF]">About</Link>
            <Link to="/solutions" className="transition-colors hover:text-[#0265FF]">Solutions</Link>
            <Link to="/industries" className="transition-colors hover:text-[#0265FF]">Industries</Link>
            <Link to="/jobs" className="transition-colors hover:text-[#0265FF]">Jobs</Link>
            <Link to="/insights" className="transition-colors hover:text-[#0265FF]">Insights</Link>
            <Link to="/employers" className="transition-colors hover:text-[#0265FF]">For Employers</Link>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              aria-label="Search jobs"
              onClick={() => navigate('/jobs')}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
            >
              <Search size={18} />
            </button>
            <Link to="/jobs" className="rounded-full border border-slate-300 px-5 py-2.5 text-[13px] font-bold transition-colors hover:border-slate-950">
              For Candidates
            </Link>
            <Link to="/contact" className="rounded-full bg-slate-950 px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0265FF]">
              Contact us
            </Link>
          </div>

          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="v2-mobile-menu"
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0265FF] lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {open && (
          <div id="v2-mobile-menu" className="mx-auto mt-2 max-w-6xl rounded-3xl border border-slate-200 bg-white p-4 shadow-xl lg:hidden">
            {[
              { to: '/about', label: 'About' },
              { to: '/solutions', label: 'Solutions' },
              { to: '/industries', label: 'Industries' },
              { to: '/jobs', label: 'Jobs' },
              { to: '/insights', label: 'Insights' },
              { to: '/employers', label: 'For Employers' },
              { to: '/jobs', label: 'For Candidates' },
              { to: '/contact', label: 'Contact us' },
              { to: '/login', label: 'Sign in' },
            ].map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50"
              >
                {l.label} <ChevronDown size={14} className="-rotate-90 text-slate-400" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
