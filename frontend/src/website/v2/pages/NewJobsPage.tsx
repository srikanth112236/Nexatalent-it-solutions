import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Clock, Wallet, ArrowRight, Briefcase, ArrowUpRight, Radio } from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { V2_JOBS, type V2Job } from '../data/jobs';
import { fetchLiveJobs } from '../lib/liveJobs';

const LOCATIONS = [
  { city: 'Bengaluru', note: 'SaaS, AI & GCC pods', openings: 12 },
  { city: 'Hyderabad', note: 'GCC & platform teams', openings: 8 },
  { city: 'Mumbai', note: 'BFSI, HFT & media', openings: 6 },
  { city: 'Pune', note: 'Automotive & manufacturing', openings: 5 },
];

const CATEGORIES = ['All Roles', 'Engineering', 'Data & AI', 'Leadership', 'Operations'];
const LOCATIONS_FILTER = ['Anywhere', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Remote'];

/** Live open positions (Published in superadmin) merged ahead of curated showcase roles. */
function useAllJobs(): V2Job[] {
  const [live, setLive] = useState<V2Job[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchLiveJobs(50).then((jobs) => {
      if (!cancelled) setLive(jobs);
    });
    return () => { cancelled = true; };
  }, []);
  return useMemo(() => {
    const liveSlugs = new Set(live.map((j) => j.slug));
    return [...live, ...V2_JOBS.filter((j) => !liveSlugs.has(j.slug))];
  }, [live]);
}

export function NewJobsPage() {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('Anywhere');
  const [category, setCategory] = useState('All Roles');
  const [tab, setTab] = useState<'latest' | 'premium'>('latest');
  const allJobs = useAllJobs();

  const counts = useMemo(() => {
    const m: Record<string, number> = { 'All Roles': allJobs.length };
    allJobs.forEach((r) => { m[r.category] = (m[r.category] || 0) + 1; });
    return m;
  }, [allJobs]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allJobs.filter((r) => {
      const matchQ = !term || `${r.title} ${r.domain} ${r.type} ${r.location} ${r.skills.join(' ')}`.toLowerCase().includes(term);
      const matchLoc = loc === 'Anywhere' || r.location === loc || (loc === 'Remote' && r.location.includes('Remote'));
      const matchCat = category === 'All Roles' || r.category === category;
      const matchTab = tab === 'premium' ? r.premium : true;
      return matchQ && matchLoc && matchCat && matchTab;
    });
  }, [allJobs, q, loc, category, tab]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <SeoHead
        title="Jobs — NexaTalent"
        description="Verified technology mandates across SaaS, BFSI, GCC and more. Free candidate registration."
        canonicalPath="/jobs"
      />
      <V2Navbar />
      <main id="main-content">
        {/* ============ HERO + SEARCH ============ */}
        <section className="relative overflow-hidden px-4 pb-14 pt-16 sm:px-6 sm:pt-20" aria-label="Job search">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 h-[440px]"
            style={{
              background:
                'radial-gradient(55% 100% at 50% 0%, rgba(2,101,255,0.12) 0%, rgba(2,101,255,0.04) 50%, rgba(255,255,255,0) 78%)',
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
              Find your{' '}
              <span className="rounded-lg bg-[#0265FF] px-3 py-0.5 text-white">dream jobs</span> in India
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Verified mandates from enterprises, GCCs and high-growth product teams. Free registration, zero
              spam — only roles matched to your profile.
            </p>

            {/* search bar */}
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pl-4 shadow-lg shadow-slate-900/5"
            >
              <Search size={17} className="shrink-0 text-slate-400" aria-hidden />
              <label htmlFor="job-q" className="sr-only">Job title or keyword</label>
              <input
                id="job-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Job title or keyword"
                className="min-h-[42px] w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <span className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />
              <label htmlFor="job-loc" className="sr-only">Location</label>
              <select
                id="job-loc"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="hidden min-h-[42px] w-40 shrink-0 cursor-pointer rounded-full bg-transparent pr-2 text-sm text-slate-600 outline-none sm:block"
              >
                {LOCATIONS_FILTER.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <button
                type="submit"
                aria-label="Search jobs"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0265FF] text-white transition-colors hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
              >
                <Search size={17} aria-hidden />
              </button>
            </form>
          </div>
        </section>

        {/* ============ RECOMMENDED JOBS ============ */}
        <section aria-label="Recommended jobs" className="border-t border-slate-100 bg-slate-50/60 px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Recommended Jobs</h2>
                <p className="mt-1 text-sm text-slate-500">Explore suggested job searches matched to open mandates</p>
              </div>
              <div className="flex gap-2" role="group" aria-label="Job feed filter">
                <button
                  onClick={() => setTab('latest')}
                  aria-pressed={tab === 'latest'}
                  className={`min-h-[40px] rounded-full px-5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF] ${
                    tab === 'latest' ? 'bg-[#0265FF] text-white shadow-md shadow-[#0265FF]/25' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Latest Jobs
                </button>
                <button
                  onClick={() => setTab('premium')}
                  aria-pressed={tab === 'premium'}
                  className={`min-h-[40px] rounded-full px-5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF] ${
                    tab === 'premium' ? 'bg-[#0265FF] text-white shadow-md shadow-[#0265FF]/25' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Premium Jobs
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
              {/* categories sidebar */}
              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Job categories">
                <h3 className="text-base font-extrabold tracking-tight text-slate-900">Job Categories</h3>
                <ul className="mt-4 divide-y divide-slate-100">
                  {CATEGORIES.map((c) => {
                    const active = category === c;
                    return (
                      <li key={c}>
                        <button
                          onClick={() => setCategory(c)}
                          aria-pressed={active}
                          className={`flex min-h-[48px] w-full items-center justify-between gap-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#0265FF] ${
                            active ? 'font-extrabold text-[#0265FF]' : 'font-semibold text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? 'bg-[#0265FF]/10 text-[#0265FF]' : 'bg-slate-100 text-slate-500'}`}>
                              <Briefcase size={13} aria-hidden />
                            </span>
                            {c}
                          </span>
                          <span className={`text-xs font-bold ${active ? 'text-[#0265FF]' : 'text-slate-400'}`}>
                            {counts[c] || 0} Opening{(counts[c] || 0) === 1 ? '' : 's'}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 rounded-xl bg-[#0265FF]/5 p-4">
                  <p className="text-xs font-bold text-slate-700">Not seeing your role?</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Register your profile — we’ll match you against new mandates daily.
                  </p>
                  <Link
                    to="/candidate/register"
                    className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#0265FF] px-4 text-xs font-bold text-white hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
                  >
                    Register free <ArrowRight size={13} aria-hidden />
                  </Link>
                </div>
              </aside>

              {/* job cards */}
              <div>
                <ul className="space-y-4">
                  {list.map((r) => (
                    <li
                      key={r.slug}
                      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                        r.premium ? 'border-amber-200' : 'border-slate-200'
                      }`}
                    >
                      <div className={`h-1 w-full ${r.premium ? 'bg-amber-400' : 'bg-[#0265FF]'}`} aria-hidden />
                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-semibold text-slate-500">
                          <span>
                            Type: <strong className="text-slate-700">{r.type}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} aria-hidden /> Posted: <strong className="text-slate-700">{r.posted}</strong>
                          </span>
                          {r.slug.startsWith('JOB-') ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-600">
                              <Radio size={10} aria-hidden /> Live
                            </span>
                          ) : null}
                          {r.premium ? (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-600">
                              Premium
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                              <Link
                                to={`/jobs/${r.slug}`}
                                className="hover:text-[#0265FF] hover:underline focus-visible:outline-2 focus-visible:outline-[#0265FF]"
                              >
                                {r.title}
                              </Link>
                            </h3>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                              <Wallet size={14} className="text-[#0265FF]" aria-hidden /> {r.salary}
                            </p>
                          </div>
                          <Link
                            to={`/jobs/${r.slug}`}
                            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 transition-colors hover:border-[#0265FF] hover:bg-[#0265FF]/5 hover:text-[#0265FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
                          >
                            View Details <ArrowUpRight size={13} aria-hidden />
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#0265FF]" aria-hidden /> {r.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0265FF]" aria-hidden />
                          {r.domain}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {list.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <p className="text-sm font-semibold text-slate-600">No matches for this search yet.</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try “Java”, “remote” or{' '}
                      <button onClick={() => { setQ(''); setLoc('Anywhere'); setCategory('All Roles'); setTab('latest'); }} className="font-bold text-[#0265FF] hover:underline">
                        reset all filters
                      </button>
                      .
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* ============ TOP LOCATIONS ============ */}
        <section aria-label="Top hiring locations" className="px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Top Hiring Locations</h2>
                <p className="mt-1 text-sm text-slate-500">Know your market — find the roles that fit your city</p>
              </div>
              <Link
                to="/candidate/register"
                className="inline-flex min-h-[42px] w-fit items-center gap-2 rounded-full bg-[#0265FF] px-5 text-xs font-bold text-white shadow-md shadow-[#0265FF]/25 hover:bg-[#0055db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
              >
                Browse all jobs <ArrowRight size={13} aria-hidden />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LOCATIONS.map((l) => (
                <button
                  key={l.city}
                  onClick={() => { setLoc(l.city); setTab('latest'); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0265FF]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0265FF]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0265FF]/10 text-[#0265FF] transition-colors group-hover:bg-[#0265FF] group-hover:text-white">
                    <MapPin size={18} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900">{l.city}</h3>
                  <p className="mt-1 text-xs text-slate-500">{l.note}</p>
                  <p className="mt-3 text-xs font-bold text-[#0265FF]">{l.openings} openings →</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </div>
  );
}
