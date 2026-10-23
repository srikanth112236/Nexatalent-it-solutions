import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Users,
  Timer,
  Target,
  Gauge,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Mail,
  Briefcase,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { PillButton } from '../components/ui';

/* ---------- data ---------- */

const HERO_CHECKS = ['SLA-Backed Shortlists', '96% Offer Acceptance', 'Audit-Ready Compliance'];

const SECTORS = ['BFSI', 'GCC', 'SaaS', 'Manufacturing', 'Retail', 'Healthcare', 'Logistics'];

const FEATURES = [
  {
    title: 'Permanent Recruitment',
    desc: 'End-to-end ownership from calibrated sourcing to signed offer — measured on joins.',
    icon: Users,
    metric: '72-hr shortlist SLA',
    span: 'lg:col-span-2',
  },
  {
    title: 'Contract & Staff Augmentation',
    desc: 'Compliant contract staffing and embedded engineers scaling with your roadmap.',
    icon: Timer,
    metric: '48-hr deploy ready',
    span: 'lg:col-span-2',
  },
  {
    title: 'Executive Search',
    desc: 'Confidential, market-mapped searches for VP, Director and C-level technology leaders.',
    icon: Target,
    metric: 'Retainer-led mandates',
    span: 'lg:col-span-2',
  },
  {
    title: 'GCC & Offshore Pod Solutions',
    desc: '0→100 engineering hub builds — entity structuring, leadership hiring and pod ramp for global capability centers establishing delivery in India.',
    icon: Briefcase,
    metric: 'STPI / SEZ ready playbooks',
    span: 'lg:col-span-3',
  },
  {
    title: 'RPO & Embedded Talent Acquisition',
    desc: 'Your brand, our recruiters. Embedded TA pods with transparent SLAs, dashboards and cost-per-hire reporting that plug directly into your hiring cadence.',
    icon: Gauge,
    metric: '45% lower cost-per-hire',
    span: 'lg:col-span-3',
  },
];

const BENEFITS = [
  {
    icon: Users,
    title: 'Specialist Recruiters Only',
    desc: 'Dedicated practice leads for engineering, data, security, product and GTM — nobody generalist touches your mandate.',
  },
  {
    icon: Timer,
    title: 'Fast and Scalable',
    desc: 'From a single specialist to a 50-engineer pod in weeks, with capacity that flexes with your hiring plan.',
  },
  {
    icon: Target,
    title: 'Tailored to Your Mandate',
    desc: 'Calibrated scorecards, culture and budget fit before the first interview — not after three failed rounds.',
  },
  {
    icon: Gauge,
    title: 'Outcomes, Not Resumes',
    desc: 'We report on joins, retention and time-to-fill. Every engagement ships an auditable weekly pipeline dashboard.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Without Compromise',
    desc: 'Background verification, contracts, payroll coordination and audit-ready records on every single deputation.',
  },
];

const TAGS = [
  'SLA-Backed Delivery',
  '72-Hour Shortlists',
  'Audit-Ready Compliance',
  'Pan-India Reach',
  'Global GCC Desks',
];

const OFFICES = [
  ['Mumbai', 'Corporate HQ — Andheri East', '4th and 7th Floor, Skyline Icon, Andheri - Kurla Rd, Chimatpada, Marol, Andheri East, Mumbai, Maharashtra 400059'],
  ['Bengaluru', 'Technology hub — SaaS, AI & GCC pods', 'Engineering talent delivery for product companies and global capability centers'],
  ['Dubai', 'Enterprise delivery — GCC & global mandates', 'Support for Middle East enterprises scaling offshore engineering teams'],
];

/* ---------- page ---------- */

export function NewAboutPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title="About Us — NexaTalent IT Solutions"
        description="NexaTalent IT Solutions connects organizations with IT, contract and executive talent. Your Talent | Our Technology | A Better Tomorrow."
        canonicalPath="/about"
      />
      <V2Navbar />
      <main id="main-content">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pt-20" aria-label="About banner">
          {/* clean white banner — no tinted panels */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[420px] opacity-70"
            style={{
              background:
                'transparent',
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[11px] font-bold text-black shadow-sm">
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                New
              </span>
              <span className="h-1 w-1 rounded-full bg-black" aria-hidden />
              Trusted IT Staffing Partner
            </span>

            <h1 className="mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-black sm:text-5xl lg:text-[3.4rem]">
              Connect the Right Talent with the Right Organization.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-black sm:text-base">
              NexaTalent IT Solutions builds high-performing technology teams for enterprises, GCCs and
              product companies — with SLA-backed delivery across India and global desks.
            </p>

            {/* check pills */}
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-black sm:text-sm">
              {HERO_CHECKS.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check size={15} className="text-black" aria-hidden strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <PillButton to="/solutions" label="Explore Solutions" variant="dark" />
              <PillButton to="/employers" label="Request Talent" variant="outline" />
            </div>

            {/* trust strip */}
            <p className="mt-12 text-xs text-black">Trusted by 400+ technology teams across India & global GCCs</p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Sectors we serve">
              {SECTORS.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-black transition-colors hover:text-black"
                >
                  <span className="h-2 w-2 rounded-sm bg-black" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ SOLUTIONS / FEATURES ============ */}
        <section aria-label="Our solutions" className="border-t border-neutral-200 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-black">What we deliver</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-black sm:text-4xl">
                Solutions Built for Every Hiring Need
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black">
                Flexible engagement models designed to scale with your roadmap — from one specialist to an
                entire offshore pod.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className={`${f.span} group flex flex-col rounded-3xl border border-neutral-200 bg-white p-6 transition-colors hover:border-black/30 hover:bg-white hover:shadow-sm`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight text-black">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black">{f.desc}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black shadow-sm ring-1 ring-neutral-200">
                      <f.icon size={18} aria-hidden />
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-neutral-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black">{f.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ BENEFITS ============ */}
        <section aria-label="Benefits" className="border-t border-neutral-200 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* left */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-black">Benefits</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-[1.15] tracking-tight text-black sm:text-4xl">
                Unlock a New Era of Talent Acquisition Excellence
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-black">
                Enterprise-grade recruitment built on specialist practices, transparent SLAs and delivery
                discipline — so your roadmap never waits on a vacancy.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <li
                    key={t}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-black"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <PillButton to="/employers" label="Start your mandate" variant="dark" />
              </div>
            </div>

            {/* right — accented list */}
            <ul className="flex flex-col">
              {BENEFITS.map((b, i) => {
                const isOpen = open === i;
                return (
                  <li key={b.title} className="border-l-2 border-neutral-200 pl-6">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex min-h-[44px] w-full items-start gap-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isOpen ? 'bg-black text-white' : 'bg-white text-black ring-1 ring-neutral-200'
                        }`}
                      >
                        <b.icon size={16} aria-hidden />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-extrabold tracking-tight text-black sm:text-base">
                          {b.title}
                        </span>
                        <span
                          className={`mt-1 block text-sm leading-relaxed text-black transition-all ${
                            isOpen ? 'max-h-40 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                          }`}
                        >
                          {b.desc}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={16}
                        className={`mt-1 shrink-0 text-black transition-transform ${isOpen ? 'rotate-90 text-black' : ''}`}
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ============ OFFICES + CONTACT ============ */}
        <section aria-label="Offices" className="border-t border-neutral-200 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-black">Where we are</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-black sm:text-4xl">
                Three hubs, one team
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {OFFICES.map(([city, role, addr]) => (
                <div key={city} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-black">{city}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-black">{role}</p>
                  <p className="mt-2 text-xs leading-relaxed text-black">{addr}</p>
                </div>
              ))}
            </div>

            <ul className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-3 text-sm text-black sm:flex-row sm:gap-8">
              <li>
                <a href="tel:+917019696166" className="flex items-center gap-2 font-semibold hover:text-black">
                  <PhoneCall size={15} className="text-black" aria-hidden /> +91 70196 96166
                </a>
              </li>
              <li>
                <a href="mailto:info@nexatalentitsolutions.com" className="flex items-center gap-2 font-semibold hover:text-black">
                  <Mail size={15} className="text-black" aria-hidden /> info@nexatalentitsolutions.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-black">
                <MapPin size={15} className="text-black" aria-hidden /> Mumbai • Bengaluru • Dubai
              </li>
            </ul>

            <div className="mt-8 text-center">
              <PillButton to="/employers" label="Partner with us" variant="dark" />
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </div>
  );
}
