import { Link } from 'react-router-dom';
import { Mail, PhoneCall, MapPin } from 'lucide-react';
import { Logo } from '../../components/Logo';

/**
 * Pure-white footer for the v2 homepage — replaces the shared beige
 * MinimalOutlineFooter (bg-[#FAF8F5]) so the page reads 100% white.
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
    <footer className="border-t border-slate-200 bg-white text-slate-900" aria-label="Footer">
      {/* CTA band — white, vision-led */}
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0265FF]">Your Trusted Technology & Talent Partner</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">Connect the right talent with the right organization.</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/employers" className="inline-flex min-h-[44px] items-center rounded-full bg-slate-950 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-[#0265FF]">
              Hire Talent
            </Link>
            <Link to="/jobs" className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 px-6 py-2.5 text-xs font-bold hover:border-slate-950 focus-visible:outline-2 focus-visible:outline-[#0265FF]">
              Join Talent Network
            </Link>
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-5">
        <div className="col-span-2 space-y-3">
          <Logo height={36} />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Talent | Our Technology | A Better Tomorrow</p>
          <p className="max-w-xs text-xs leading-relaxed text-slate-600">
            Nexa Talent IT Solutions Pvt. Ltd. — technology recruitment and staffing across IT, contract and executive talent.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-[#0265FF]" aria-hidden /> Andheri East, Mumbai 400059</li>
            <li><a href="tel:+917019696166" className="flex items-center gap-2 hover:text-[#0265FF]"><PhoneCall size={14} className="text-[#0265FF]" aria-hidden /> +91 70196 96166</a></li>
            <li><a href="mailto:info@nexatalentitsolutions.com" className="flex items-center gap-2 hover:text-[#0265FF]"><Mail size={14} className="text-[#0265FF]" aria-hidden /> info@nexatalentitsolutions.com</a></li>
          </ul>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{c.title}</h3>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="text-sm text-slate-700 hover:text-[#0265FF] focus-visible:outline-2 focus-visible:outline-[#0265FF]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>© 2026 Nexa Talent IT Solutions Pvt. Ltd.</span>
          <span className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-900">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-900">Terms</Link>
            <Link to="/contact" className="hover:text-slate-900">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
