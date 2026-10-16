import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, Clock, Wallet, ArrowRight, Briefcase, ArrowUpRight, Radio, Upload } from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { CareersApplyModal } from '../components/CareersApplyModal';
import { SeoHead } from '../../components/SeoHead';
import { V2_JOBS, type V2Job } from '../data/jobs';
import { fetchLiveJobs } from '../lib/liveJobs';

const LOCATIONS = [
  { city: 'Bengaluru', note: 'SaaS, AI & GCC pods', openings: 12 },
  { city: 'Hyderabad', note: 'GCC & platform teams', openings: 8 },
  { city: 'Mumbai', note: 'BFSI, HFT & media', openings: 6 },
  { city: 'Chennai', note: 'GCC, SaaS & manufacturing', openings: 7 },
  { city: 'Pune', note: 'Automotive & manufacturing', openings: 5 },
];

const CATEGORIES = ['All Roles', 'Engineering', 'Data & AI', 'Leadership', 'Operations'];
const LOCATIONS_FILTER = ['Anywhere', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Pune', 'Remote'];

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

/**
 * Careers — same board as Jobs, but every application is no-login:
 * details + resume collected in-modal and sent to Superadmin Website Leads.
 */
const CAREERS_PAGE_SIZE = 6;

export function NewCareersPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('Anywhere');
  const [category, setCategory] = useState('All Roles');
  const [tab, setTab] = useState<'latest' | 'premium'>('latest');
  const [page, setPage] = useState(1);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [applyJob, setApplyJob] = useState<V2Job | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const allJobs = useAllJobs();

  useEffect(() => {
    if (!suggestOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSuggestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSuggestOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [suggestOpen]);

  // Suggestions appear after 2+ letters — title / skill / domain matches
  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return allJobs
      .filter((r) =>
        `${r.title} ${r.domain} ${r.location} ${r.skills.join(' ')}`.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [allJobs, q]);

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

  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [q, loc, category, tab]);

  const totalPages = Math.max(1, Math.ceil(list.length / CAREERS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleJobs = list.slice((currentPage - 1) * CAREERS_PAGE_SIZE, currentPage * CAREERS_PAGE_SIZE);

  const changePage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    // Feed moves with the page — bring its top back into view on page change
    requestAnimationFrame(() => {
      document.getElementById('careers-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title="Careers — NexaTalent"
        description="Apply to verified technology roles in one step — no login needed. Attach your resume and hear back within 5 business days."
        canonicalPath="/careers"
      />
      <V2Navbar />
      <main id="main-content">
        {/* ============ HERO + SEARCH ============ */}
        {/* overflow-x-clip (not hidden) so the suggestion dropdown can float over the next section */}
        <section className="relative overflow-x-clip border-b border-neutral-200 bg-white px-4 pb-14 pt-12 sm:px-6 sm:pt-16" aria-label="Careers search">
          <div className="relative mx-auto max-w-3xl text-center">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-black/60">
              <Link to="/" className="hover:text-black">Home</Link>
              <span aria-hidden>›</span>
              <span className="font-bold text-black">Careers</span>
            </nav>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
              <Upload size={12} aria-hidden /> No login · one-step apply
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
              Careers at NexaTalent clients
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
              Verified mandates from enterprises, GCCs and high-growth product teams. Pick a role, attach
              your resume — no account, no waiting.
            </p>

            {/* search bar with live suggestions (2+ letters) */}
            <div ref={searchRef} className="relative mx-auto mt-8 max-w-xl">
            <form
              role="search"
              onSubmit={(e) => { e.preventDefault(); setSuggestOpen(false); }}
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white p-1.5 pl-4 shadow-lg shadow-black/5"
            >
              <Search size={17} className="shrink-0 text-black" aria-hidden />
              <label htmlFor="career-q" className="sr-only">Job title or keyword</label>
              <input
                id="career-q"
                value={q}
                onChange={(e) => { setQ(e.target.value); setSuggestOpen(true); }}
                onFocus={() => setSuggestOpen(true)}
                placeholder="Job title or keyword"
                autoComplete="off"
                role="combobox"
                aria-expanded={suggestOpen && suggestions.length > 0}
                aria-controls="career-suggestions"
                aria-autocomplete="list"
                className="min-h-[42px] w-full min-w-0 bg-transparent text-sm text-black outline-none placeholder:text-black/50"
              />
              <span className="hidden h-6 w-px bg-neutral-200 sm:block" aria-hidden />
              <label htmlFor="career-loc" className="sr-only">Location</label>
              <select
                id="career-loc"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="hidden min-h-[42px] w-40 shrink-0 cursor-pointer rounded-full bg-transparent pr-2 text-sm text-black outline-none sm:block"
              >
                {LOCATIONS_FILTER.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <button
                type="submit"
                aria-label="Search careers"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <Search size={17} aria-hidden />
              </button>
            </form>
            {suggestOpen && q.trim().length >= 2 && (
              <div data-lenis-prevent className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-black/10">
                {suggestions.length > 0 ? (
                  <ul id="career-suggestions" role="listbox" aria-label="Matching roles" className="max-h-72 overflow-y-auto py-1.5">
                    {suggestions.map((s) => (
                      <li key={s.slug} role="option" aria-selected={false}>
                        <button
                          type="button"
                          onClick={() => { setSuggestOpen(false); navigate(`/careers/${s.slug}`); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                            <Briefcase size={13} aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-extrabold text-black">{s.title}</span>
                            <span className="block truncate text-[11px] font-semibold text-black/60">
                              {s.location} · {s.type} · {s.salary}
                            </span>
                          </span>
                          <ArrowUpRight size={14} className="ml-auto shrink-0 text-black/40" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3.5 text-[12.5px] font-semibold text-black/60">
                    No quick matches — press Enter to filter the full list below.
                  </p>
                )}
              </div>
            )}
            </div>
          </div>
        </section>

        {/* ============ ROLES ============ */}
        <section aria-label="Open roles" className="bg-white px-4 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-black sm:text-2xl">Open Roles</h2>
                <p className="mt-0.5 text-[13px] text-black/60">Every application goes straight to our recruitment desk</p>
              </div>
              <div className="flex gap-2" role="group" aria-label="Role feed filter">
                <button
                  onClick={() => setTab('latest')}
                  aria-pressed={tab === 'latest'}
                  className={`min-h-[40px] rounded-full px-5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                    tab === 'latest' ? 'bg-black text-white shadow-md shadow-black/10' : 'border border-neutral-200 bg-white text-black hover:border-neutral-300'
                  }`}
                >
                  Latest Roles
                </button>
                <button
                  onClick={() => setTab('premium')}
                  aria-pressed={tab === 'premium'}
                  className={`min-h-[40px] rounded-full px-5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                    tab === 'premium' ? 'bg-black text-white shadow-md shadow-black/10' : 'border border-neutral-200 bg-white text-black hover:border-neutral-300'
                  }`}
                >
                  Premium Roles
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_280px]">
              {/* categories sidebar — right side, sticky; no internal overflow scroll */}
              <aside className="order-1 h-fit rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:order-2 lg:sticky lg:top-24 lg:self-start" aria-label="Role categories">
                <h3 className="text-[15px] font-extrabold tracking-tight text-black">Categories</h3>
                <ul className="mt-3 divide-y divide-neutral-200">
                  {CATEGORIES.map((c) => {
                    const active = category === c;
                    return (
                      <li key={c}>
                        <button
                          onClick={() => setCategory(c)}
                          aria-pressed={active}
                          className={`flex min-h-[44px] w-full items-center justify-between gap-3 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-black ${
                            active ? 'font-extrabold text-black' : 'font-semibold text-black/70 hover:text-black'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? 'bg-black text-white' : 'bg-white text-black ring-1 ring-neutral-200'}`}>
                              <Briefcase size={13} aria-hidden />
                            </span>
                            {c}
                          </span>
                          <span className="text-xs font-bold text-black/60">
                            {counts[c] || 0} Opening{(counts[c] || 0) === 1 ? '' : 's'}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 rounded-xl bg-neutral-100 p-4">
                  <p className="text-xs font-bold text-black">How applying works</p>
                  <p className="mt-1 text-xs leading-relaxed text-black/70">
                    One form, no account. Attach your resume and our recruiters reply within 5 business days.
                  </p>
                </div>
              </aside>

              {/* role cards — left side, moves naturally with page scroll (no overflow) */}
              <div ref={listRef} id="careers-feed" className="order-2 min-w-0 scroll-mt-28 lg:order-1">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-black/50" aria-live="polite">
                  {list.length} opening{list.length === 1 ? '' : 's'} · Page {currentPage} of {totalPages}
                </p>
                <ul className="space-y-3">
                  {visibleJobs.map((r) => (
                    <li
                      key={r.slug}
                      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                        r.premium ? 'border-black' : 'border-neutral-200'
                      }`}
                    >
                      <div className="h-0.5 w-full bg-black" aria-hidden />
                      <div className="p-4">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-black/60">
                          <span>
                            Type: <strong className="text-black">{r.type}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} aria-hidden /> Posted: <strong className="text-black">{r.posted}</strong>
                          </span>
                          {r.slug.startsWith('JOB-') ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                              <Radio size={10} aria-hidden /> Live
                            </span>
                          ) : null}
                          {r.premium ? (
                            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                              Premium
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-extrabold tracking-tight text-black">
                              <Link
                                to={`/careers/${r.slug}`}
                                className="hover:underline focus-visible:outline-2 focus-visible:outline-black"
                              >
                                {r.title}
                              </Link>
                            </h3>
                            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-black">
                              <Wallet size={13} className="text-black" aria-hidden /> {r.salary}
                            </p>
                          </div>
                          <button
                            onClick={() => setApplyJob(r)}
                            className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full bg-black px-4 text-xs font-bold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                          >
                            Apply — No Login <ArrowRight size={13} aria-hidden />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-neutral-200 bg-neutral-50/60 px-4 py-2.5 text-xs font-semibold text-black/70">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-black" aria-hidden /> {r.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden />
                          {r.domain}
                        </span>
                        <Link to={`/careers/${r.slug}`} className="ml-auto font-bold text-black hover:underline">
                          View details →
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>

                {list.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
                    <p className="text-sm font-semibold text-black">No matches for this search yet.</p>
                    <p className="mt-1 text-sm text-black/60">
                      Try “Java”, “remote” or{' '}
                      <button onClick={() => { setQ(''); setLoc('Anywhere'); setCategory('All Roles'); setTab('latest'); }} className="font-bold text-black hover:underline">
                        reset all filters
                      </button>
                      .
                    </p>
                  </div>
                ) : null}

                {totalPages > 1 ? (
                  <nav aria-label="Roles pagination" className="mt-6 flex flex-wrap items-center justify-center gap-2 pb-1">
                    <button
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-black transition-colors hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        aria-current={p === currentPage ? 'page' : undefined}
                        className={`inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                          p === currentPage
                            ? 'bg-black text-white'
                            : 'border border-neutral-200 bg-white text-black hover:border-neutral-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-black transition-colors hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Next
                    </button>
                  </nav>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* ============ TOP LOCATIONS ============ */}
        <section aria-label="Top hiring locations" className="border-t border-neutral-200 px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl">Top Hiring Locations</h2>
            <p className="mt-1 text-sm text-black/60">Know your market — find the roles that fit your city</p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {LOCATIONS.map((l) => (
                <button
                  key={l.city}
                  onClick={() => { setLoc(l.city); setTab('latest'); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="group rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-all hover:-tranneutral-y-0.5 hover:border-black hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                    <MapPin size={18} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-black">{l.city}</h3>
                  <p className="mt-1 text-xs text-black/60">{l.note}</p>
                  <p className="mt-3 text-xs font-bold text-black">{l.openings} openings →</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />

      {applyJob && (
        <CareersApplyModal
          jobTitle={applyJob.title}
          jobSlug={applyJob.slug}
          sourcePage="/careers"
          onClose={() => setApplyJob(null)}
        />
      )}
    </div>
  );
}
