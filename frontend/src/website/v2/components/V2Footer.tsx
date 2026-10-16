import { Link } from 'react-router-dom';
import { Mail, PhoneCall, MapPin } from 'lucide-react';
import { Logo } from '../../components/Logo';

/**
 * Pure-white footer shared by every public page — 100% white background,
 * black text only.
 * Copy follows the NexaTalent vision: Your Talent | Our Technology | A Better Tomorrow.
 */
const COLS: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
  {
    title: 'Solutions',
    links: [
      { label: 'All Solutions', to: '/solutions' },
      { label: 'Permanent Recruitment', to: '/solutions/permanent-hiring' },
      { label: 'Contract Staffing', to: '/solutions/contract-staffing' },
      { label: 'Executive Search', to: '/solutions/executive-search' },
    ],
  },
  {
    title: 'Talent',
    links: [
      { label: 'Find Jobs', to: '/jobs' },
      { label: 'For Employers', to: '/employers' },
      { label: 'Vendor Empanelment', to: '/partners' },
      { label: 'Sign In', to: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Industries', to: '/industries' },
      { label: 'Case Studies', to: '/case-studies' },
      { label: 'Insights', to: '/insights' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

export function V2Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-black" aria-label="Footer">
      {/* CTA band — white, vision-led */}
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Your Trusted Technology & Talent Partner</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">Connect the right talent with the right organization.</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/employers" className="inline-flex min-h-[44px] items-center rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-black">
              Hire Talent
            </Link>
            <Link to="/jobs" className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-300 px-6 py-2.5 text-xs font-bold text-black hover:border-black focus-visible:outline-2 focus-visible:outline-black">
              Join Talent Network
            </Link>
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-5">
        <div className="col-span-2 space-y-3">
          <Logo height={36} />
          <p className="text-xs font-bold uppercase tracking-widest text-black">Your Talent | Our Technology | A Better Tomorrow</p>
          <p className="max-w-xs text-xs leading-relaxed text-black">
            Nexa Talent IT Solutions Pvt. Ltd. — technology recruitment and staffing across IT, contract and executive talent.
          </p>
          <ul className="space-y-1.5 text-xs text-black">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-black" aria-hidden /> Andheri East, Mumbai 400059</li>
            <li><a href="tel:+917019696166" className="flex items-center gap-2 hover:text-black"><PhoneCall size={14} className="text-black" aria-hidden /> +91 70196 96166</a></li>
            <li><a href="mailto:info@nexatalentitsolutions.com" className="flex items-center gap-2 hover:text-black"><Mail size={14} className="text-black" aria-hidden /> info@nexatalentitsolutions.com</a></li>
          </ul>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="text-xs font-black uppercase tracking-widest text-black">{c.title}</h3>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="text-sm text-black hover:text-black focus-visible:outline-2 focus-visible:outline-black">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-neutral-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-black sm:flex-row sm:px-6">
          <span>© 2026 Nexa Talent IT Solutions Pvt. Ltd.</span>
          <span className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link to="/privacy-policy" className="hover:text-black">Privacy</Link>
            <Link to="/terms" className="hover:text-black">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-black">Cookies</Link>
            <Link to="/accessibility" className="hover:text-black">Accessibility</Link>
            <Link to="/data-protection" className="hover:text-black">Data Protection</Link>
            <Link to="/disclaimer" className="hover:text-black">Disclaimer</Link>
            <Link to="/contact" className="hover:text-black">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
