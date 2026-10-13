import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Clock, Calendar, User, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { V2Navbar } from '../components/V2Navbar';
import { V2Footer } from '../components/V2Footer';
import { SeoHead } from '../../components/SeoHead';
import { ALL_POSTS, getV2Post, type V2Post } from '../data/posts';
import { INSIGHTS_ARTICLES } from '../../pages/InsightsPage';

/**
 * Clean, minimal article detail — content + takeaways + related/recent insights only.
 * No heavy interactive sections; new V2 navbar.
 */

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tag: string;
  readTime: string;
  date: string;
  author: string;
  highlights: string[];
  image?: string;
};

function resolveArticle(slug?: string): Article {
  const v2 = getV2Post(slug);
  if (v2) return v2;
  const legacy = INSIGHTS_ARTICLES.find((a) => a.slug === slug);
  if (legacy) return legacy;
  return ALL_POSTS[0];
}

function coverOf(a: Article) {
  return a.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70';
}

/** Well-written body sections derived from the article's own takeaways. */
function bodySections(a: Article) {
  const [h1, h2, h3] = a.highlights;
  return [
    {
      heading: h1,
      paras: [
        `${a.excerpt} The market data behind this is consistent across our recent mandates: teams that treat hiring as a designed process — calibrated scorecards, structured loops and honest compensation conversations — convert far more candidates than teams improvising per requisition.`,
        `Practically, this means agreeing on the bar before sourcing begins. Hiring managers and recruiters should align on must-haves versus nice-to-haves, the evidence each interview stage will collect, and the decision rule when opinions split. That single habit removes most of the drift that stretches technology roles for weeks.`,
      ],
    },
    {
      heading: h2,
      paras: [
        `Execution is where most strategies quietly fail. Weekly pipeline reviews, dated candidate feedback and a named owner per stage keep momentum honest — when a role stalls, you can see exactly which stage broke rather than discovering it a month later.`,
        `For ${a.category.toLowerCase()} mandates specifically, we recommend a simple scoreboard: qualified profiles per week, interview-to-offer ratio, offer-accept rate and days-in-stage. Four numbers, reviewed every week, are enough to steer the search without drowning in dashboards.`,
      ],
    },
    {
      heading: h3,
      paras: [
        `Measurement closes the loop. Track time-to-fill, offer-acceptance and 90-day retention for every mandate, then feed what you learn back into the next scorecard. Over two or three cycles this compounding is what separates teams that hire predictably from teams that gamble.`,
        `If you want a second set of eyes on your approach, our practice leads run a free mandate review — a 30-minute teardown of your scorecard, comp band and interview plan against current market data.`,
      ],
    },
  ];
}

export function NewArticleDetailPage() {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = resolveArticle(articleSlug);

  const related = ALL_POSTS.filter((p) => p.slug !== article.slug && p.category === article.category).slice(0, 3);
  const recent = ALL_POSTS.filter((p) => p.slug !== article.slug && !related.some((r) => r.slug === p.slug)).slice(0, 3);
  const sections = bodySections(article);

  const card = (p: V2Post) => (
    <article key={p.slug} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md">
      <span className="w-fit rounded-full bg-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
        {p.category}
      </span>
      <h3 className="mt-3 text-sm font-extrabold leading-snug tracking-tight text-black">
        <Link to={`/insights/${p.slug}`} className="hover:text-black hover:underline focus-visible:outline-2 focus-visible:outline-black">
          {p.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-black line-clamp-3">{p.excerpt}</p>
      <div className="mt-4 flex items-center justify-between text-[11px] text-black">
        <time>{p.date}</time>
        <span className="inline-flex items-center gap-1 font-bold text-black">
          Read <ArrowRight size={12} aria-hidden />
        </span>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <SeoHead
        title={`${article.title} | NexaTalent Insights`}
        description={article.excerpt}
        keywords={`${article.title}, ${article.category}, tech salary India, engineering hiring report`}
        canonical={`/insights/${articleSlug || 'article'}`}
      />
      <V2Navbar />
      <main id="main-content">
        {/* ===== ARTICLE HEADER ===== */}
        <article>
          <header className="border-b border-neutral-200 px-4 pb-10 pt-10 sm:px-6 sm:pt-12">
            <div className="mx-auto max-w-3xl">
              {/* breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-black">
                <Link to="/" className="hover:text-black">Home</Link>
                <ChevronRight size={12} aria-hidden />
                <Link to="/insights" className="hover:text-black">Insights</Link>
                <ChevronRight size={12} aria-hidden />
                <span className="font-bold text-black">{article.category}</span>
              </nav>

              {/* tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-black px-3 py-1 text-[11px] font-bold text-white">{article.tag}</span>
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-bold text-black">
                  {article.category}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold leading-[1.15] tracking-tight text-black sm:text-4xl">
                {article.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-black">{article.excerpt}</p>

              {/* meta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-black">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-black" aria-hidden />
                  <span className="font-semibold text-black">{article.author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} aria-hidden /> <time>{article.date}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} aria-hidden /> {article.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* cover */}
          <div className="px-4 pt-8 sm:px-6">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-neutral-200">
              <img
                src={coverOf(article)}
                alt=""
                aria-hidden
                className="aspect-[16/10] w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* takeaways */}
          <div className="px-4 pt-8 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl border border-black/20 bg-white p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-black">Key takeaways</h2>
              <ul className="mt-4 space-y-3">
                {article.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm font-semibold leading-relaxed text-black">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-black" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* body */}
          <div className="px-4 pb-4 pt-10 sm:px-6">
            <div className="mx-auto max-w-3xl space-y-10">
              {sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="text-xl font-extrabold tracking-tight text-black sm:text-2xl">{s.heading}</h2>
                  {s.paras.map((p, i) => (
                    <p key={i} className="mt-4 text-[15px] leading-[1.8] text-black">{p}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="px-4 py-10 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="text-base font-extrabold text-black">Hiring against this market?</h2>
                <p className="mt-1 text-sm text-black">Get a free mandate review with a practice lead.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/employers"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-black px-5 text-xs font-bold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Start your mandate <ArrowRight size={13} aria-hidden />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-300 bg-white px-5 text-xs font-bold text-black hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Talk to an expert
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* ===== RELATED INSIGHTS ===== */}
        {related.length > 0 ? (
          <section aria-label="Related insights" className="border-t border-neutral-200 px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-extrabold tracking-tight text-black sm:text-xl">Related insights</h2>
                <Link to="/insights" className="text-xs font-bold text-black hover:underline">
                  View all →
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(card)}</div>
            </div>
          </section>
        ) : null}

        {/* ===== RECENT INSIGHTS ===== */}
        <section aria-label="Recent insights" className="border-t border-neutral-200 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-extrabold tracking-tight text-black sm:text-xl">Recent insights</h2>
              <Link to="/insights" className="text-xs font-bold text-black hover:underline">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{recent.map(card)}</div>
          </div>
        </section>

        {/* back */}
        <div className="border-t border-neutral-200 px-4 py-8 text-center sm:px-6">
          <Link
            to="/insights"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-black hover:text-black focus-visible:outline-2 focus-visible:outline-black"
          >
            <ArrowLeft size={15} aria-hidden /> Back to all insights
          </Link>
        </div>
      </main>
      <V2Footer />
    </div>
  );
}
