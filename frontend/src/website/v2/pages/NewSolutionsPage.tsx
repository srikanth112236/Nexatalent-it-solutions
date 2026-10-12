import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Users,
  Timer,
  Code2,
  Target,
  Layers,
  UserCog,
  Globe,
  Network,
  BadgeCheck,
  Play,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { getServiceDetail } from '../data/serviceDetails';

/** Nine NexaTalent delivery services — reference-style light SaaS layout, blue palette. */
const NINE_SERVICES = [
  { slug: 'permanent-recruitment', icon: Users, title: 'Permanent Recruitment', desc: 'Direct full-time hiring for technology, engineering, corporate and leadership roles with replacement guarantees.' },
  { slug: 'contract-staffing', icon: Timer, title: 'Contract Staffing', desc: 'Time-bound, project-based workforce with payroll, statutory compliance and single-window invoicing.' },
  { slug: 'it-staff-augmentation', icon: Code2, title: 'IT Staff Augmentation', desc: 'Pre-vetted engineers deployed in 72 hours for capacity spikes, agile squads and specialised skills.' },
  { slug: 'executive-search', icon: Target, title: 'Executive Search', desc: 'Confidential search for CXO, VP Engineering, Director and Head-level technology leadership mandates.' },
  { slug: 'bulk-hiring', icon: Layers, title: 'Bulk & Volume Hiring', desc: 'Structured sourcing drives and batch interview coordination for 10–100+ role expansions.' },
  { slug: 'rpo-embedded-ta', icon: UserCog, title: 'RPO & Embedded TA', desc: 'Recruiters embedded inside your talent team with SLA-backed delivery and transparent reporting.' },
  { slug: 'gcc-talent-solutions', icon: Globe, title: 'GCC Talent Solutions', desc: 'Turnkey offshore engineering pods — talent pipelines, cost-plus modelling and Day-0 setup advisory.' },
  { slug: 'vendor-empanelment', icon: Network, title: 'Vendor Empanelment', desc: 'Partner network for sub-vendors and staffing firms delivering reliable IT and non-IT talent together.' },
  { slug: 'background-verification', icon: BadgeCheck, title: 'Background Verification', desc: 'Audit-ready checks — identity, employment, education and court records before every joining.' },
];

const HERO_CHECKS = ['No fee to start a mandate', '72-hr first shortlist', '90-day replacement cover'];

const SECTORS = ['BFSI', 'GCC', 'SaaS', 'Manufacturing', 'Retail', 'Healthcare', 'Logistics'];

const SCALE_CHECKS = [
  'Scalable from 1 hire to 100+',
  'Audit-ready compliance on every deputation',
  'SLA-backed shortlists in 72 hours',
  'Dedicated domain pod & account lead',
];

function ArrowButton({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#0265FF] py-1.5 pl-6 pr-1.5 text-sm font-bold text-white shadow-lg shadow-[#0265FF]/25 transition-all hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
    >
      {label}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0265FF] transition-transform group-hover:translate-x-0.5">
        <ArrowRight size={15} aria-hidden />
      </span>
    </Link>
  );
}

/** Light hiring-dashboard mock for the hero (reference-style product frame). */
function DashboardMock() {
  const stats = [
    ['Shortlists', '128', '+18%'],
    ['Interviews', '42', '+12%'],
    ['Offers', '12', '+4'],
    ['Joins', '9', '+2'],
  ];
  const bars = [38, 55, 42, 70, 58, 84, 66, 92, 74, 96, 80, 88];
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-70 blur-2xl"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(2,101,255,0.18) 0%, rgba(255,255,255,0) 70%)' }}
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="ml-3 text-[11px] font-bold text-slate-500">NexaTalent · Hiring Dashboard</span>
        </div>
        <div className="p-5">
          {/* stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(([label, value, delta]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-1 text-xl font-black tabular-nums text-slate-900">{value}</p>
                <p className="text-[10px] font-bold text-emerald-500">{delta}</p>
              </div>
            ))}
          </div>
          {/* chart */}
          <div className="mt-4 rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-600">Pipeline velocity</p>
              <span className="text-[10px] font-semibold text-slate-400">Last 12 weeks</span>
            </div>
            <div className="mt-3 flex h-24 items-end gap-1.5" aria-hidden>
              {bars.map((h, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-t-sm ${i >= bars.length - 3 ? 'bg-[#0265FF]' : 'bg-[#0265FF]/25'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          {/* activity */}
          <ul className="mt-4 space-y-2">
            {[
              ['Shortlist shared — Staff Backend Engineer', '2m ago'],
              ['Interview scheduled — DevOps Lead, Bengaluru', '1h ago'],
              ['Offer accepted — Data Engineer, Hyderabad', '3h ago'],
            ].map(([t, time]) => (
              <li key={t} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0265FF]" aria-hidden />
                  {t}
                </span>
                <span className="shrink-0 text-[10px] text-slate-400">{time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* floating chips */}
      <div className="absolute -left-3 top-16 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time-to-fill</p>
        <p className="text-lg font-black text-slate-900">18 days</p>
      </div>
      <div className="absolute -right-3 bottom-14 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offer accept</p>
        <p className="text-lg font-black text-[#0265FF]">96%</p>
      </div>
    </div>
  );
}

export function NewSolutionsPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const activeDetail = activeSlug ? getServiceDetail('solution', activeSlug) : undefined;
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <SeoHead
        title="Recruitment & Staffing Solutions — NexaTalent"
        description="Nine enterprise hiring solutions: permanent, contract, augmentation, executive search, bulk, RPO, GCC, vendor empanelment and background verification."
        canonicalPath="/solutions"
      />
      <V2Navbar />
      <main id="main-content">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-16" aria-label="Solutions banner">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 h-[520px]"
            style={{
              background:
                'radial-gradient(55% 100% at 65% 0%, rgba(2,101,255,0.12) 0%, rgba(2,101,255,0.04) 50%, rgba(255,255,255,0) 78%)',
            }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            {/* left */}
            <div>
              <Link
                to="/insights"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm hover:border-[#0265FF]/40 focus-visible:outline-2 focus-visible:outline-[#0265FF]"
              >
                <span className="rounded-full bg-[#0265FF] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                  New
                </span>
                Nine delivery models, one accountable team
                <ArrowRight size={12} aria-hidden />
              </Link>

              <h1 className="mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
                The All-in-One Hiring Partner for{' '}
                <span className="text-[#0265FF]">Modern Teams</span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                NexaTalent turns enterprise hiring ambition into outcomes — nine engagement models, one SLA-backed
                process from mandate to joining, for enterprises, GCCs and high-growth product companies.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ArrowButton to="/employers" label="Start your mandate" />
                <Link
                  to="/contact"
                  className="inline-flex min-h-[48px] items-center gap-2 px-2 text-sm font-bold text-slate-700 hover:text-[#0265FF] focus-visible:outline-2 focus-visible:outline-[#0265FF]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                    <Play size={13} fill="currentColor" aria-hidden />
                  </span>
                  Talk to an expert
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 sm:text-sm">
                {HERO_CHECKS.map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-[#0265FF]" strokeWidth={3} aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* right — dashboard mock */}
            <div className="lg:pl-6">
              <DashboardMock />
            </div>
          </div>
        </section>

        {/* ============ TRUST STRIP ============ */}
        <section aria-label="Industries we serve" className="border-y border-slate-100 bg-slate-50/60 px-4 py-8 sm:px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            Trusted by fast-growing teams worldwide
          </p>
          <ul className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {SECTORS.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-slate-400 transition-colors hover:text-slate-700"
              >
                <span className="h-2 w-2 rounded-sm bg-slate-300" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* ============ FEATURES GRID (nine services) ============ */}
        <section aria-label="Services" className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full border border-[#0265FF]/25 bg-[#0265FF]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#0265FF]">
                Features
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Everything You Need to <span className="text-[#0265FF]">Hire Better</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Powerful delivery models built to remove friction from every stage of your hiring workflow.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NINE_SERVICES.map((s) => (
                <article
                  key={s.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:border-[#0265FF]/30 hover:shadow-md hover:shadow-slate-900/5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0265FF]/10 text-[#0265FF] transition-colors group-hover:bg-[#0265FF] group-hover:text-white">
                    <s.icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  <button
                    type="button"
                    onClick={() => setActiveSlug(s.slug)}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-[#0265FF] hover:gap-2.5 transition-all focus-visible:outline-2 focus-visible:outline-[#0265FF]"
                  >
                    Learn more <ArrowRight size={14} aria-hidden />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SCALE / GROWTH ============ */}
        <section aria-label="Built for growth" className="border-t border-slate-100 bg-slate-50/60 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            {/* left — performance mock */}
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-slate-900">Team Performance</p>
                  <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    This month
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    ['Roles closed', '48', '+9.2%', 'text-emerald-500'],
                    ['On track', '83%', '+7.4%', 'text-emerald-500'],
                    ['Pipeline', '68%', '-4.3%', 'text-rose-500'],
                  ].map(([label, value, delta, color]) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                      <p className="mt-1 text-lg font-black tabular-nums text-slate-900">{value}</p>
                      <p className={`text-[10px] font-bold ${color}`}>{delta}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-600">Recent mandates</p>
                      <span className="text-[10px] font-bold text-[#0265FF]">View all</span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {[
                        ['Staff Backend Engineer', 'Offer stage'],
                        ['DevOps Lead', 'Interviewing'],
                        ['Data Engineer', 'Sourcing'],
                      ].map(([t, stage]) => (
                        <li key={t} className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-600">{t}</span>
                          <span className="rounded-full bg-[#0265FF]/8 px-2 py-0.5 font-bold text-[#0265FF]">{stage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-4">
                    <p className="text-[11px] font-bold text-slate-600">Delivery activity</p>
                    <div className="mt-3 flex h-20 items-end gap-1.5" aria-hidden>
                      {[44, 62, 50, 78, 60, 88, 72, 94].map((h, i) => (
                        <span
                          key={i}
                          className={`flex-1 rounded-t-sm ${i >= 5 ? 'bg-[#0265FF]' : 'bg-[#0265FF]/25'}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">Weekly shortlist output</p>
                  </div>
                </div>
              </div>
            </div>

            {/* right */}
            <div className="order-1 lg:order-2">
              <span className="inline-block rounded-full border border-[#0265FF]/25 bg-[#0265FF]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#0265FF]">
                Built for growth
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-4xl">
                Scale Your Hiring{' '}
                <span className="block text-[#0265FF]">Without Limits</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                NexaTalent grows with you. Whether you’re filling one specialist role or standing up an entire
                offshore pod, our engagement models flex to your plan.
              </p>
              <ul className="mt-6 space-y-3">
                {SCALE_CHECKS.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm font-semibold text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0265FF]/10">
                      <Check size={12} className="text-[#0265FF]" strokeWidth={3} aria-hidden />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ArrowButton to="/employers" label="Start your mandate" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
      {activeDetail && <ServiceDetailModal detail={activeDetail} onClose={() => setActiveSlug(null)} />}
    </div>
  );
}
