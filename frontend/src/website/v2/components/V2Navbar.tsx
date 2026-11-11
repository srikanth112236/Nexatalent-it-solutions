import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '../../components/Logo';

/**
 * Sticky floating-pill navbar — single-row links with whitespace-nowrap so items never wrap onto 2 lines.
 */
export function V2Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50">
      <div className="border-b border-neutral-100 bg-white/90 px-3 pt-3 backdrop-blur-md sm:px-6">
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full border border-black/5 bg-white py-2.5 pl-4 pr-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:pl-5">
          <Link to="/" aria-label="NexaTalent home" className="shrink-0">
            <Logo height={32} />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-3 text-[12px] font-semibold text-black lg:flex xl:gap-5 xl:text-[13px]"
          >
            <Link
              to="/ai-platform"
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-bold text-black transition-colors hover:opacity-70"
            >
              <span>AI Platform</span>
              <span className="rounded-full bg-black px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                AI
              </span>
            </Link>
            <Link to="/about" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              About
            </Link>
            <Link to="/solutions" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              Solutions
            </Link>
            <Link to="/courses" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              Courses
            </Link>
            <Link to="/industries" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              Industries
            </Link>
            <Link to="/jobs" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              Jobs
            </Link>
            <Link to="/careers" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              Careers
            </Link>
            <Link to="/insights" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              Insights
            </Link>
            <Link to="/employers" className="shrink-0 whitespace-nowrap transition-colors hover:text-black">
              For Employers
            </Link>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              aria-label="Search jobs"
              onClick={() => navigate('/jobs')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
            >
              <Search size={17} />
            </button>
            <Link
              to="/careers"
              className="shrink-0 whitespace-nowrap rounded-full border border-neutral-300 px-4 py-2 text-[12px] font-bold transition-colors hover:border-black xl:px-5 xl:py-2.5 xl:text-[13px]"
            >
              For Candidates
            </Link>
            <Link
              to="/contact"
              className="shrink-0 whitespace-nowrap rounded-full bg-black px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-neutral-800 xl:px-5 xl:py-2.5 xl:text-[13px]"
            >
              Contact us
            </Link>
          </div>

          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="v2-mobile-menu"
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-black lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {open && (
          <div
            id="v2-mobile-menu"
            className="mx-auto mt-2 max-w-7xl rounded-3xl border border-neutral-200 bg-white p-4 shadow-xl lg:hidden"
          >
            {[
              { to: '/ai-platform', label: 'AI Platform (Ecosystem)' },
              { to: '/about', label: 'About' },
              { to: '/solutions', label: 'Solutions' },
              { to: '/courses', label: 'Nexa Courses' },
              { to: '/industries', label: 'Industries' },
              { to: '/jobs', label: 'Jobs' },
              { to: '/careers', label: 'Careers' },
              { to: '/insights', label: 'Insights' },
              { to: '/employers', label: 'For Employers' },
              { to: '/careers', label: 'For Candidates' },
              { to: '/contact', label: 'Contact us' },
              { to: '/login', label: 'Sign in' },
            ].map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-black hover:bg-neutral-50"
              >
                {l.label} <ChevronDown size={14} className="-rotate-90 text-black" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
