import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { ALL_POSTS, FEATURED_POST, V2_CATEGORIES, POSTS_PER_PAGE } from '../data/posts';

export function NewInsightsPage() {
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (category === 'All' ? ALL_POSTS : ALL_POSTS.filter((p) => p.category === category)),
    [category],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);

  const changePage = (p: number) => {
    setPage(p);
    document.getElementById('recent-posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pickCategory = (c: string) => {
    setCategory(c);
    setPage(1);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title="Insights & Hiring Research — NexaTalent"
        description="Salary benchmarks, GCC playbooks, offer-dropout research and engineering interview rubrics from NexaTalent's hiring practice."
        keywords="tech salary India 2026, GCC playbook, offer dropout hiring, engineering interview rubric, RPO economics"
        canonicalPath="/insights"
      />
      <V2Navbar />
      <main id="main-content">
        {/* FEATURED HERO — full-bleed card */}
        <section className="px-4 pt-6 sm:px-6 sm:pt-8" aria-label="Featured article">
          <Link
            to={`/insights/${FEATURED_POST.slug}`}
            className="group relative block overflow-hidden rounded-3xl focus-visible:outline-2 focus-visible:outline-black"
          >
            <img
              src={FEATURED_POST.image}
              alt=""
              aria-hidden
              className="aspect-[16/10] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/60" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
              <span className="text-xs font-semibold tracking-wide text-white/90">Featured</span>
              <h1 className="mt-2 max-w-3xl text-2xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
                {FEATURED_POST.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{FEATURED_POST.excerpt}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/75">
                <span>{FEATURED_POST.author}</span>
                <span aria-hidden>•</span>
                <time>{FEATURED_POST.date}</time>
              </div>
            </div>
            <span className="absolute right-6 top-1/2 hidden -tranneutral-y-1/2 text-white/90 transition-transform duration-300 group-hover:tranneutral-x-1.5 lg:block" aria-hidden>
              <ArrowRight size={36} strokeWidth={1.5} />
            </span>
          </Link>
        </section>

        {/* RECENT POSTS + PAGINATION */}
        <section id="recent-posts" aria-label="Recent blog posts" className="px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-black sm:text-2xl">Recent blog posts</h2>
                <p className="mt-1 text-sm text-black">
                  {filtered.length} article{filtered.length === 1 ? '' : 's'} · Page {current} of {totalPages}
                </p>
              </div>
              {/* Category filter */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {V2_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => pickCategory(c)}
                    aria-pressed={category === c}
                    className={`min-h-[36px] rounded-full border px-4 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      category === c
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 bg-white text-black hover:border-neutral-300 hover:text-black'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((p) => (
                <article key={p.slug} className="flex flex-col">
                  <Link
                    to={`/insights/${p.slug}`}
                    className="overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-black"
                    tabIndex={-1}
                    aria-hidden
                  >
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </Link>
                  <span className="mt-4 w-fit rounded-full bg-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {p.category}
                  </span>
                  <h3 className="mt-2 text-base font-extrabold leading-snug tracking-tight text-black">
                    <Link to={`/insights/${p.slug}`} className="hover:text-black hover:underline focus-visible:outline-2 focus-visible:outline-black">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-black">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-black">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[9px] font-black text-white" aria-hidden>
                      {p.author.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                    <span>{p.author}</span>
                    <span aria-hidden>•</span>
                    <time>{p.date}</time>
                  </div>
                </article>
              ))}
            </div>

            {pagePosts.length === 0 ? (
              <p className="mt-12 text-center text-sm text-black">No posts in this category yet.</p>
            ) : null}

            {/* PAGINATION */}
            {totalPages > 1 ? (
              <nav aria-label="Blog pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => changePage(current - 1)}
                  disabled={current === 1}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-black transition-colors hover:border-neutral-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <ChevronLeft size={15} aria-hidden /> Prev
                </button>

                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    aria-current={p === current ? 'page' : undefined}
                    className={`inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      p === current
                        ? 'bg-black text-white'
                        : 'border border-neutral-200 bg-white text-black hover:border-neutral-300 hover:text-black'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => changePage(current + 1)}
                  disabled={current === totalPages}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-black transition-colors hover:border-neutral-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Next <ChevronRight size={15} aria-hidden />
                </button>
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <V2Footer />
    </div>
  );
}
