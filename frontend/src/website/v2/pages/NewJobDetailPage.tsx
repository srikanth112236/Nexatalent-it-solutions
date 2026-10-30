import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin,
  Wallet,
  Clock,
  Briefcase,
  Building2,
  Monitor,
  ChevronRight,
  Check,
  ArrowRight,
  ArrowLeft,
  Users,
  ShieldCheck,
  TrendingUp,
  Bookmark,
  Mail,
  Zap,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { LoginModal } from '../components/LoginModal';
import { CareersApplyModal } from '../components/CareersApplyModal';
import { SectionLabel } from '../components/ui';
import { SeoHead } from '../../components/SeoHead';
import { V2_JOBS, getV2Job, type V2Job } from '../data/jobs';
import { fetchLiveJob, isLiveJobSlug } from '../lib/liveJobs';
import { JobDetailPage as LegacyJobDetailPage } from '../../pages/JobDetailPage';

/** Industry context keyed by domain — compact market facts for the detail sidebar/section. */
const INDUSTRY: Record<string, { blurb: string; median: string; demand: string; note: string }> = {
  'Cloud & Enterprise': {
    blurb: 'Cloud-native enterprise platforms, microservices architecture, and large-scale data processing solutions across India tech hubs.',
    median: 'Competitive CTC',
    demand: 'Very high',
    note: 'Golang + React + GCP full-stack skillsets command high premiums; immediate joiners prioritized.',
  },
  'SaaS & Product': {
    blurb: 'Product engineering organisations building multi-tenant platforms for global customers — the most competitive talent market in India, led by Bengaluru and Hyderabad.',
    median: '₹24–40 LPA (mid-senior IC)',
    demand: 'Very high',
    note: 'Staff+ premiums of 30–40% over services benchmarks; AI skills add ~35%.',
  },
  'BFSI & FinTech': {
    blurb: 'Banks, capital-markets technology and regulated fintechs hiring across risk, core banking, payments and trading infrastructure.',
    median: '₹18–35 LPA (engineering)',
    demand: 'High',
    note: 'HFT and quant desks pay top-decile packages; compliance skills stay scarce.',
  },
  GCC: {
    blurb: 'Global capability centres scaling India delivery for headquarters — platform, product and shared-services mandates with global stakeholder exposure.',
    median: '₹22–38 LPA (engineering)',
    demand: 'Very high',
    note: 'GCC build-outs are driving the largest single-year demand spike since 2021.',
  },
  'Retail & E-commerce': {
    blurb: 'Marketplaces and D2C platforms hiring for supply chain, pricing, personalisation and fulfilment technology.',
    median: '₹20–36 LPA',
    demand: 'Moderate–high',
    note: 'Experimentation and causal-inference profiles command a clear premium.',
  },
  'Communication & Media': {
    blurb: 'Telecom equipment vendors, operators and media-tech companies building 5G cores, OSS/BSS and streaming platforms.',
    median: '₹22–34 LPA',
    demand: 'Moderate',
    note: 'Protocol and network-function specialists remain structurally undersupplied.',
  },
  Manufacturing: {
    blurb: 'Automotive, industrial and electronics firms investing in embedded software, ADAS and Industry 4.0 platforms.',
    median: '₹18–30 LPA',
    demand: 'Moderate–high',
    note: 'AUTOSAR and functional-safety experience is the key scarcity driver.',
  },
  'Healthcare & Life Sciences': {
    blurb: 'Health-tech platforms, hospital networks and pharma-tech companies modernising on interoperability standards.',
    median: '₹16–30 LPA',
    demand: 'Moderate',
    note: 'FHIR and clinical-terminology skills are rare and well paid on contract.',
  },
};

function initialsOf(s: string) {
  return s
    .split(/[\s&-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/** Premium, compact job detail — company + industry context, one-step no-login apply. */
export function NewJobDetailPage() {
  const { jobSlug } = useParams<{ jobSlug: string }>();
  const live = isLiveJobSlug(jobSlug);
  const staticJob = live ? null : getV2Job(jobSlug);
  const [liveJob, setLiveJob] = useState<V2Job | null>(null);
  const [liveLoading, setLiveLoading] = useState(live);
  const [loginOpen, setLoginOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!live || !jobSlug) return;
    let cancelled = false;
    fetchLiveJob(jobSlug).then((j) => {
      if (!cancelled) {
        setLiveJob(j);
        setLiveLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [live, jobSlug]);

  const job = staticJob ?? liveJob;

  if (liveLoading) {
    return (
      <div className="min-h-screen bg-white font-sans text-black antialiased">
        <V2Navbar />
        <main id="main-content" className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-sm font-semibold text-black">Loading open position…</p>
        </main>
        <V2Footer />
      </div>
    );
  }

  if (!job) return <LegacyJobDetailPage />;

  const industry = INDUSTRY[job.domain] ?? {
    blurb: 'High-growth technology segment with strong demand for specialised engineering talent across India.',
    median: '₹18–35 LPA',
    demand: 'High',
    note: 'Specialised skills command clear premiums over generalist bands.',
  };
  const peerOpenings = V2_JOBS.filter((j) => j.domain === job.domain).length;
  const similar = V2_JOBS.filter((j) => j.slug !== job.slug && j.domain === job.domain)
    .concat(V2_JOBS.filter((j) => j.slug !== job.slug && j.domain !== job.domain))
    .slice(0, 5);

  const facts: [string, string][] = [
    ['Experience', job.experience],
    ['Location', job.location],
    ['Work mode', job.workMode],
    ['Employment', job.type],
    ['Department', job.department],
    ...(job.noticePeriod ? [['Notice period', job.noticePeriod]] as [string, string][] : []),
    ...(job.openings ? [['Open positions', `${job.openings} opening`]] as [string, string][] : []),
    ['Posted', job.posted],
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title={`${job.title} — ${job.location} | NexaTalent Jobs`}
        description={job.summary}
        keywords={`${job.title}, ${job.location} jobs, ${job.domain}, NexaTalent`}
        canonical={`/jobs/${job.slug}`}
      />
      <V2Navbar />
      <main id="main-content" className="pb-20 lg:pb-0">
        {/* ===== COMPANY HEADER CARD ===== */}
        <section className="border-b border-neutral-200 px-4 pt-6 sm:px-6" aria-label="Job header">
          <div className="mx-auto max-w-5xl">
            {/* breadcrumb — compact */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[11px] text-black">
              <Link to="/" className="hover:text-black">Home</Link>
              <ChevronRight size={10} aria-hidden />
              <Link to="/jobs" className="hover:text-black">Jobs</Link>
              <ChevronRight size={10} aria-hidden />
              <span className="font-semibold text-black">{job.domain}</span>
            </nav>

            <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-4">
                  {/* company avatar */}
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-black text-white shadow-md"
                    style={{ background: '#000' }}
                    aria-hidden
                  >
                    {initialsOf(job.clientType)}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-black">{job.clientType}</span>
                      <span className="flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                        <ShieldCheck size={10} aria-hidden /> Verified mandate
                      </span>
                    </div>

                    <h1 className="mt-1.5 text-[22px] font-extrabold leading-tight tracking-tight text-black sm:text-[28px]">
                      {job.title}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12px] text-black">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-black" aria-hidden /> {job.location}</span>
                      <span className="h-1 w-1 rounded-full bg-black" aria-hidden />
                      <span className="flex items-center gap-1"><Monitor size={12} className="text-black" aria-hidden /> {job.workMode}</span>
                      <span className="h-1 w-1 rounded-full bg-black" aria-hidden />
                      <span className="flex items-center gap-1"><Briefcase size={12} className="text-black" aria-hidden /> {job.experience}</span>
                      <span className="h-1 w-1 rounded-full bg-black" aria-hidden />
                      <span className="flex items-center gap-1"><Clock size={12} className="text-black" aria-hidden /> {job.posted}</span>
                    </div>

                    {/* compact fact pills */}
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      <li className="rounded-md bg-black px-2.5 py-1 text-[11px] font-bold text-white">{job.type}</li>
                      <li className="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-black">{job.department}</li>
                      {job.premium ? (
                        <li className="rounded-md bg-black px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white">Premium</li>
                      ) : null}
                    </ul>
                  </div>
                </div>

                {/* actions */}
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSaved((s) => !s)}
                    aria-pressed={saved}
                    aria-label={saved ? 'Saved' : 'Save job'}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      saved ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-black hover:border-neutral-300 hover:text-black'
                    }`}
                  >
                    <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden />
                  </button>
                  <button
                    onClick={() => setApplyOpen(true)}
                    className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-xl bg-black py-1.5 pl-5 pr-1.5 text-[13px] font-bold text-white shadow-md shadow-black/10 transition-all hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Apply Now
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition-transform group-hover:translate-x-0.5">
                      <ArrowRight size={14} aria-hidden />
                    </span>
                  </button>
                </div>
              </div>

              {/* salary strip */}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-black/15 bg-white px-4 py-3">
                <span className="flex items-center gap-2">
                  <Wallet size={15} className="text-black" aria-hidden />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black">Compensation</span>
                  <span className="text-[15px] font-black tabular-nums text-black">{job.salary}</span>
                </span>
                <span className="hidden h-4 w-px bg-black sm:block" aria-hidden />
                <span className="text-[11px] font-semibold text-black">
                  Market note: <span className="text-black">{industry.note}</span>
                </span>
              
              {job.noticePeriod ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold">
                    <Zap size={16} className="shrink-0 text-amber-600" aria-hidden />
                    <span>Hiring Notice: <span className="font-extrabold text-black">{job.noticePeriod}</span></span>
                  </div>
                  {job.contactWhatsapp ? (
                    <a
                      href={'https://wa.me/' + job.contactWhatsapp.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Hi, I am interested in the ' + job.title + ' role.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-extrabold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <MessageCircle size={13} aria-hidden /> Quick Chat on WhatsApp
                    </a>
                  ) : null}
                </div>
              ) : null}

</div>

              {/* skills */}
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <li key={s} className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-black">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== BODY ===== */}
        <div className="px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
            {/* main */}
            <div className="min-w-0 space-y-8">
              <section aria-label="About the role">
                <SectionLabel>About the role</SectionLabel>
                <p className="mt-2.5 text-[13.5px] leading-[1.75] text-black">{job.summary}</p>
              </section>

              <div className="h-px bg-neutral-200" aria-hidden />

              <section aria-label="About the company">
                <SectionLabel className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-black" aria-hidden /> About the company
                </SectionLabel>
                <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-extrabold text-black">{job.clientType}</span>
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-black ring-1 ring-neutral-200">
                      {job.domain}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-black">{job.aboutCompany}</p>
                  <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ['Industry', job.domain],
                      ['Team', job.department],
                      ['Mode', job.workMode],
                      ['Hired via', 'NexaTalent'],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-white p-2.5 ring-1 ring-neutral-200">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-black">{k}</p>
                        <p className="mt-0.5 truncate text-[11px] font-bold text-black">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="h-px bg-neutral-200" aria-hidden />

              <section aria-label="Responsibilities">
                <SectionLabel>Responsibilities</SectionLabel>
                <ul className="mt-3 space-y-2">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[13px] leading-relaxed text-black">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black">
                        <Check size={10} className="text-white" strokeWidth={3} aria-hidden />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-label="Requirements">
                <SectionLabel>Requirements</SectionLabel>
                <ul className="mt-3 space-y-2">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[13px] leading-relaxed text-black">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black">
                        <Check size={10} className="text-white" strokeWidth={3} aria-hidden />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              {job.niceToHave.length > 0 ? (
                <section aria-label="Nice to have">
                <SectionLabel>Nice to have</SectionLabel>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {job.niceToHave.map((n) => (
                      <li key={n} className="rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-black">
                        {n}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="h-px bg-neutral-200" aria-hidden />

              <section aria-label="Benefits">
                <SectionLabel>Benefits & perks</SectionLabel>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {job.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-[12.5px] font-semibold text-black">
                      <Check size={13} className="mt-0.5 shrink-0 text-black" strokeWidth={3} aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="h-px bg-neutral-200" aria-hidden />

              <section aria-label="Interview process">
                <SectionLabel>Interview process</SectionLabel>
                <ol className="mt-3 space-y-2">
                  {job.interviewStages.map((s, i) => (
                    <li key={s.name} className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black text-[10px] font-black text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2.5">
                          <h3 className="text-[12.5px] font-extrabold text-black">{s.name}</h3>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-black">
                            <Clock size={9} aria-hidden /> {s.duration}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-black">{s.focus}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="h-px bg-neutral-200" aria-hidden />

              
              <div className="h-px bg-neutral-200" aria-hidden />

              <section aria-label="How to apply" className="rounded-2xl border-2 border-black bg-neutral-50 p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
                    <Mail size={16} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-black text-black">How to Apply</h3>
                    <p className="text-[11.5px] font-bold uppercase tracking-wider text-black/60">Fast-track direct application</p>
                  </div>
                </div>

                <p className="mt-3.5 text-[13px] leading-relaxed text-black">
                  Interested candidates can apply directly with their resume or reach our hiring team with the following details:
                </p>

                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px] font-semibold text-black">
                  {(job.applyInstructions ?? [
                    'Total Experience',
                    'Relevant Experience in Go, React.js, GCP & BigQuery',
                    'Current CTC',
                    'Expected CTC',
                    'Notice Period / Earliest Joining Date',
                    'Current Location',
                  ]).map((item) => (
                    <li key={item} className="flex items-center gap-2 rounded-lg bg-white border border-neutral-200 px-3 py-2">
                      <Check size={13} className="text-black shrink-0" strokeWidth={3} aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => setApplyOpen(true)}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-black px-5 text-[12.5px] font-extrabold text-white shadow hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-black"
                  >
                    Apply Now — No Login <ArrowRight size={14} aria-hidden />
                  </button>

                  <a
                    href={'mailto:' + (job.contactEmail || 'info@nexatalentitsolutions.com') + '?subject=' + encodeURIComponent('Application for ' + job.title)}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-[12.5px] font-bold text-black hover:border-black"
                  >
                    <Mail size={14} aria-hidden /> {job.contactEmail || 'info@nexatalentitsolutions.com'}
                  </a>

                  {job.contactWhatsapp ? (
                    <a
                      href={'https://wa.me/' + job.contactWhatsapp.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Hi, I am interested in applying for ' + job.title + ' role.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-emerald-600 px-4 text-[12.5px] font-bold text-white hover:bg-emerald-700 shadow-sm"
                    >
                      <MessageCircle size={14} aria-hidden /> WhatsApp: {job.contactWhatsapp}
                    </a>
                  ) : null}

                  {job.contactPhone ? (
                    <a
                      href={'tel:' + job.contactPhone.replace(/[^0-9+]/g, '')}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-[12.5px] font-bold text-black hover:border-black"
                    >
                      <Phone size={14} aria-hidden /> Call: {job.contactPhone}
                    </a>
                  ) : null}
                </div>
              </section>

              {/* INDUSTRY SNAPSHOT */}
              <section aria-label="Industry snapshot">
                <SectionLabel className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-black" aria-hidden /> {job.domain} — market snapshot
                </SectionLabel>
                <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="text-[13px] leading-relaxed text-black">{industry.blurb}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      ['Median band', industry.median],
                      ['Demand', industry.demand],
                      ['Open roles (ours)', `${peerOpenings} live`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-white p-3 ring-1 ring-neutral-200">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-black">{k}</p>
                        <p className="mt-1 text-[12px] font-extrabold leading-snug text-black">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* ===== SIDEBAR ===== */}
            <aside className="lg:sticky lg:top-24 lg:h-fit lg:self-start" aria-label="Job snapshot">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <SectionLabel className="text-[11px]">At a glance</SectionLabel>
                <dl className="mt-3.5 space-y-0">
                  {facts.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3 border-b border-neutral-200 py-2.5 last:border-0">
                      <dt className="flex items-center gap-1.5 text-[11px] font-semibold text-black">
                        {k === 'Location' ? <MapPin size={11} aria-hidden /> : k === 'Work mode' ? <Monitor size={11} aria-hidden /> : <Briefcase size={11} aria-hidden />}
                        {k}
                      </dt>
                      <dd className="text-right text-[11.5px] font-bold text-black">{v}</dd>
                    </div>
                  ))}
                </dl>

                <button
                  onClick={() => setApplyOpen(true)}
                  className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-black text-[13px] font-bold text-white shadow-md shadow-black/10 transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Apply Now — No Login <ArrowRight size={14} aria-hidden />
                </button>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="mt-2.5 flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 text-[11.5px] font-bold text-black hover:border-neutral-300 focus-visible:outline-2 focus-visible:outline-black"
                >
                  Sign in to track applications
                </button>
                <Link
                  to="/jobs"
                  className="mt-2.5 flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-neutral-200 text-[11.5px] font-bold text-black hover:border-neutral-300 hover:text-black focus-visible:outline-2 focus-visible:outline-black"
                >
                  <ArrowLeft size={12} aria-hidden /> All jobs
                </Link>
              </div>

              {/* recruiter card */}
              <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <SectionLabel className="text-[11px]">Talk to a recruiter</SectionLabel>
                <p className="mt-2 text-[12px] leading-relaxed text-black">
                  Questions on comp, process or this team? A practice lead responds within one business day.
                </p>
                <Link
                  to="/contact"
                  className="mt-3 flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-black/30 bg-white text-[11.5px] font-bold text-black hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-black"
                >
                  <Mail size={12} aria-hidden /> Contact practice lead
                </Link>
              </div>

              {/* similar jobs */}
              <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <SectionLabel className="text-[11px]">Similar roles</SectionLabel>
                <ul className="mt-3">
                  {similar.map((s) => (
                    <li key={s.slug} className="border-b border-neutral-200 py-2.5 last:border-0">
                      <Link to={`/jobs/${s.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-black">
                        <h3 className="text-[12px] font-extrabold leading-snug text-black group-hover:text-black">
                          {s.title}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-black">
                          <Users size={9} aria-hidden /> {s.location} · {s.salary}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>

        {/* mobile sticky apply bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-extrabold text-black">{job.title}</p>
              <p className="text-[11px] font-bold text-black">{job.salary}</p>
            </div>
            <button
              onClick={() => setApplyOpen(true)}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-black px-6 text-[13px] font-bold text-white shadow-md shadow-black/10 hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Apply Now <ArrowRight size={14} aria-hidden />
            </button>
          </div>
        </div>
      </main>
      <V2Footer />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} jobTitle={job.title} />
      {applyOpen && (
        <CareersApplyModal
          jobTitle={job.title}
          jobSlug={job.slug}
          sourcePage={`/jobs/${job.slug}`}
          onClose={() => setApplyOpen(false)}
        />
      )}
    </div>
  );
}
