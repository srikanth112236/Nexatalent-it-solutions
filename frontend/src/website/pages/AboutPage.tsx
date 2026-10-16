import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Star } from 'lucide-react';
import { V2Footer } from '../v2/components/V2Footer';
import { V2Navbar } from '../v2/components/V2Navbar';
import { SeoHead } from '../components/SeoHead';

/* White background · black text/buttons · full-color images · no overlays
   Type synced with site scale (section-title tokens + 15px body). */

function Dot() {
  return <span className="inline-block h-[7px] w-[7px] rounded-full bg-black" />;
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">
      <Dot /> {children}
    </p>
  );
}

/* Shared 85% container */
const SHELL = 'mx-auto w-[85%] max-w-[1200px]';

const CAPABILITIES: Array<{ n: string; title: string; desc: string }> = [
  { n: '01', title: 'IT & Tech Recruitment', desc: 'Role-specific hiring across software, cloud, data, AI and cybersecurity.' },
  { n: '02', title: 'Permanent Staffing', desc: 'End-to-end full-time hiring with screening and replacement cover.' },
  { n: '03', title: 'Contract Staffing', desc: 'Flexible engineers for immediate bandwidth and project peaks.' },
  { n: '04', title: 'RPO & Embedded TA', desc: 'Recruiters embedded inside your team with SLA-backed delivery and transparent reporting.' },
  { n: '05', title: 'Executive Search', desc: 'Confidential search for CTO, VP, Director and Head roles.' },
  { n: '06', title: 'Bulk & Volume Hiring', desc: 'Batch drives and pipelines for high-volume expansion.' },
  { n: '07', title: 'GCC & Offshore Pods', desc: 'Dedicated pods for GCCs and global capability centres.' },
  { n: '08', title: 'AI-Assisted Screening', desc: 'Skills benchmarking plus expert human panels per shortlist.' },
  { n: '09', title: 'Vendor Empanelment', desc: 'Dependable sub-vendor and delivery partnerships.' },
  { n: '10', title: 'Interview Coordination', desc: 'Scheduling, feedback loops and offer alignment end-to-end.' },
  { n: '11', title: 'Onboarding & Joining', desc: 'Offer, documentation and joining follow-up, low drop-offs.' },
  { n: '12', title: 'Retention & Success', desc: 'Post-joining check-ins, upskilling and engagement.' },
];

const CHECKS: Array<{ title: string; desc: string }> = [
  { title: 'Talent-first hiring mindset', desc: 'Every shortlist blends stack depth with delivery context.' },
  { title: 'Outcome-driven hiring solutions', desc: 'Measured on joining ratio and retention, not CV volume.' },
  { title: 'Modern screening capabilities', desc: 'Structured evaluations, live discussions, portfolio checks.' },
  { title: 'Deep expertise across stacks', desc: 'Specialist recruiters across 12+ practices.' },
  { title: 'Agile and scalable delivery models', desc: 'From one specialist to full pods — scale on demand.' },
  { title: 'Focus on measurable business impact', desc: 'Clear SLAs from day one, tracked through joining.' },
  { title: 'Innovation that evolves with hiring science', desc: 'AI-assisted matching paired with human judgement.' },
];

const HUBS = [
  {
    tag: 'India',
    city: 'Bengaluru',
    country: 'India',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=700&q=80',
    addr: 'Outer Ring Road, Bellandur, Bengaluru, KA 560103, India',
  },
  {
    tag: 'GCC · UAE',
    city: 'Dubai',
    country: 'UAE',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80',
    addr: 'Dubai Silicon Oasis, DDP, Dubai, United Arab Emirates',
  },
  {
    tag: 'USA',
    city: 'New York',
    country: 'United States',
    img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=700&q=80',
    addr: '418 Broadway, 2nd Floor, New York, NY 10013, United States',
  },
];

export function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-black font-sans antialiased overflow-x-clip">
      <SeoHead
        title="About Us | NexaTalent IT Solutions — A Trusted Talent Partner"
        description="NexaTalent IT Solutions is a trusted technology recruitment and staffing partner. Intelligence embedded across the entire hiring lifecycle."
        keywords="About NexaTalent, IT recruitment company, tech staffing partner, GCC hiring"
        canonicalPath="/about"
      />
      <V2Navbar />

      {/* ============ 1. HERO ============ */}
      <section className="bg-white pt-28 pb-10">
        <div className={`${SHELL} text-center`}>
          <Eyebrow>About NexaTalent</Eyebrow>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl font-extrabold leading-[1.08] tracking-tight text-black">
            We don&apos;t just fill roles.
            <br />
            <span className="text-black">We build engineer possibilities.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] sm:text-base leading-relaxed text-black">
            NexaTalent IT Solutions is an AI-assisted talent company helping
            enterprises hire dependable technology professionals across
            permanent, contract and leadership roles — faster and with certainty.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Start a conversation
            </Link>
            <Link
              to="/employers"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-black hover:border-black"
            >
              Explore our services
            </Link>
          </div>
        </div>

        {/* full-color images — no overlays */}
        <div className={`${SHELL} mt-10 grid grid-cols-1 gap-3 sm:grid-cols-12`}>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 sm:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"
              alt="NexaTalent office"
              className="aspect-[4/3] w-full object-cover object-center"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 sm:col-span-4">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80"
              alt="NexaTalent professionals"
              className="aspect-[4/3] w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 sm:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black">
              ● Talent-native by design
            </p>
            <p className="mt-8 text-[15px] font-semibold leading-snug text-black">
              Intelligence embedded across the entire hiring lifecycle.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 2. WHO WE ARE ============ */}
      <section className="bg-white py-14">
        <div className={`${SHELL} text-center`}>
          <Eyebrow>Who we are</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl sm:text-4xl font-extrabold leading-[1.15] tracking-tight text-black">
            A trusted talent partner for organizations navigating rapid change
          </h2>
        </div>

        <div className={`${SHELL} mt-10 grid grid-cols-1 items-start gap-8 md:grid-cols-2`}>
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80"
              alt="Team reviewing profiles"
              className="aspect-[4/3] w-full object-cover object-center"
            />
          </div>
          <div className="space-y-4 text-[15px] leading-7 text-black">
            <p>
              We partner with organizations that are navigating rapid technological
              change and need dependable engineering capacity — without the cost of
              mis-hires and long vacancies. We bring deep expertise across
              technology hiring, structured screening and onboarding success.
            </p>
            <p>
              We believe the future belongs to businesses that can combine technology,
              data and verified human capability. So we help enterprises turn hiring
              from a bottleneck into an advantage — every shortlist calibrated to
              your stack, culture and timelines.
            </p>
            <p>
              As organizations move from experimental pilots to scaled adoption, we
              bridge the gap between ambition and execution — with pre-evaluated
              engineers, transparent SLAs and retention-backed delivery.
            </p>
            <p className="border-l-2 border-black pl-4 text-base font-bold leading-relaxed text-black">
              Inspired by the industry&apos;s shift toward talent-native hiring, we embed
              intelligence across the entire talent lifecycle.
            </p>
          </div>
        </div>

        <div className={`${SHELL} mt-12 grid grid-cols-2 gap-6 md:grid-cols-4`}>
          {[
            { big: '100+', small: 'Enterprise partners with hiring delivered' },
            { big: '250+', small: 'Vetted professionals placed' },
            { big: '12+', small: 'Hiring capabilities under one roof' },
            { big: '3', small: 'Delivery hubs across regions' },
          ].map((s) => (
            <div key={s.big} className="text-left">
              <p className="text-4xl font-extrabold tracking-tight text-black">{s.big}</p>
              <p className="mt-1.5 max-w-[200px] text-[13px] leading-snug text-black">{s.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 3. WHAT WE DELIVER ============ */}
      <section className="border-y border-neutral-200 bg-white py-14">
        <div className={SHELL}>
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">
                <Dot /> What we deliver
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-black">
                Deep capability across the full talent lifecycle
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-black md:text-right">
              One partner spanning sourcing, screening and onboarding — so hiring
              never slows delivery. We take you through the gaps.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <div key={c.n} className="border-b border-neutral-200 pb-4">
                <p className="text-xs font-bold text-black">{c.n}</p>
                <h3 className="mt-1.5 text-[15px] font-bold text-black">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-black">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. VISION / MISSION / PURPOSE ============ */}
      <section className="bg-white py-16">
        <div className={`${SHELL} text-center`}>
          <Eyebrow>What drives us</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-black">
            Vision, mission, and the
            <br />
            purpose behind the work
          </h2>
        </div>
        <div className={`${SHELL} mt-10 grid grid-cols-1 gap-4 md:grid-cols-3`}>
          {[
            { t: 'Our Vision', d: 'To become a globally trusted talent corridor where enterprises deploy pre-evaluated technology teams in days, not quarters.' },
            { t: 'Our Mission', d: 'To remove hiring uncertainty by pairing structured matching with expert human panels — transparent and retention-backed.' },
            { t: 'Our Purpose', d: 'We exist to turn hiring into momentum: dependable people, honest process and measurable outcomes for every client.' },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-neutral-200 bg-white p-7 text-left shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="h-9 w-9 rounded-[10px] bg-black" />
              <h3 className="mt-4 text-base font-bold text-black">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 5. WHY US ============ */}
      <section className="bg-white py-14">
        <div className={`${SHELL} grid grid-cols-1 items-center gap-10 md:grid-cols-2`}>
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
              alt="NexaTalent team"
              className="aspect-[4/3] w-full object-cover object-center"
            />
          </div>
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">
              <Dot /> What makes us different
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-black">
              A talent partner built for outcomes
            </h2>
            <ul className="mt-6 space-y-4">
              {CHECKS.map((c) => (
                <li key={c.title} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-black" strokeWidth={3} />
                  <div>
                    <p className="text-[15px] font-bold leading-snug text-black">{c.title}</p>
                    <p className="text-sm leading-snug text-black">{c.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 6. THREE HUBS ============ */}
      <section className="bg-white pb-14">
        <div className={SHELL}>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">
                <Dot /> Global presence
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
                Three hubs, one team
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-black md:text-right">
              Across three time zones and two regions, NexaTalent works as a single
              connected team — so coverage never sleeps.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HUBS.map((h) => (
              <div key={h.city} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <img src={h.img} alt={h.city} className="aspect-[16/10] w-full object-cover object-center" loading="lazy" />
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-black">{h.tag}</p>
                  <p className="mt-1.5 text-[15px] font-extrabold text-black">
                    {h.city} <span className="font-medium text-black">{h.country}</span>
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-black">{h.addr}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-4 sm:flex-row">
            <p className="text-sm text-black">
              Prefer email? Reach us directly at{' '}
              <a href="mailto:info@nexatalentitsolutions.com" className="font-bold text-black underline underline-offset-2">
                info@nexatalentitsolutions.com →
              </a>
            </p>
            <Link
              to="/contact"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 7. CTA ============ */}
      <section className="bg-white py-14 text-center">
        <div className={`${SHELL} max-w-3xl`}>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-snug tracking-tight text-black">
            Where talent, technology, and process converge to create the next
            generation of intelligent teams.
          </h2>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Start a conversation
          </Link>
        </div>
      </section>

      {/* ============ 8. PROOF ============ */}
      <section className="border-t border-neutral-200 bg-white pb-14 pt-14">
        <div className={`${SHELL} text-center`}>
          <Eyebrow>Client proof</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-black">
            Powering hiring
            <br />
            transformation at scale
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-7">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-black text-black" />
                ))}
              </div>
              <p className="mt-4 text-[15px] font-semibold leading-relaxed text-black">
                &ldquo;NexaTalent gave us the screening rigour and shortlist speed we
                needed. Critical hires closed in days — engineers who ramped fast
                and stayed.&rdquo;
              </p>
              <Link to="/case-studies" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-black">
                Read client stories <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-7">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80"
                alt="Delivery team"
                className="aspect-[16/10] w-full rounded-xl object-cover object-center"
                loading="lazy"
              />
              <div className="mt-5 text-center">
                <Link
                  to="/contact"
                  className="inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-neutral-800"
                >
                  Contact NexaTalent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <V2Footer />
    </div>
  );
}
