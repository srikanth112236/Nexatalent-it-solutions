import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Clock, 
  Calendar, 
  User, 
  ChevronRight, 
  Download, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { INSIGHTS_ARTICLES } from './InsightsPage';
import { 
  LightEditorialInsightCard, 
  LightSalaryResourceCard, 
  LightMetricsCounter, 
  LightTwoColumnPinnedStory,
  LightFinalCTAExpansion
} from '../components/light-motion';

export function ArticleDetailPage() {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = INSIGHTS_ARTICLES.find((a) => a.slug === articleSlug) || INSIGHTS_ARTICLES[0];

  useEffect(() => {
    let raf = 0;
    const refresh = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    };
    raf = requestAnimationFrame(() => {
      refresh();
      window.addEventListener('load', refresh);
      const t = window.setTimeout(refresh, 500);
      return () => window.clearTimeout(t);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, [articleSlug]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'clip',
        overflowY: 'visible',
        isolation: 'isolate',
        backgroundColor: '#ffffff',
      }}
    >
      {/* SEO & Article Schema */}
      <SeoHead
        title={`${article.title} | NexaTalent IT Solutions Insights`}
        description={article.excerpt}
        keywords={`${article.title}, ${article.category}, tech salary India, engineering hiring report`}
        canonical={`/insights/${articleSlug || 'article'}`}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt,
          "author": {
            "@type": "Organization",
            "name": article.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "NexaTalent IT Solutions",
            "url": "https://nexatalent.in"
          },
          "datePublished": "2026-08-15"
        }}
      />

      <SiteNavbar />

      {/* Hero Header */}
      <section style={{ 
        position: 'relative', 
        paddingTop: '8rem', 
        paddingBottom: '4rem', 
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/insights" style={{ color: '#64748B', textDecoration: 'none' }}>Insights</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#4361EE', fontWeight: 600 }}>{article.category}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', backgroundColor: '#EEF2FF', color: '#4361EE', fontSize: '0.8rem', fontWeight: 700 }}>
              {article.tag}
            </span>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>
              {article.category}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#0B132B',
            lineHeight: 1.2,
            marginBottom: '1.5rem'
          }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', color: '#64748B', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} color="#4361EE" />
              <span>{article.author}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} />
              <span>{article.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} />
              <span>{article.readTime}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Article Editorial Body */}
      <article style={{ padding: '4rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Executive Takeaways Box */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B132B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#4361EE" />
            <span>Executive Summary & Key Takeaways</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {article.highlights.map((h) => (
              <div key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.5, fontWeight: 600 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Long-form Content */}
        <div style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <p>
            {article.excerpt} In modern technology organizations, competitive advantage is governed entirely by the velocity with which high-performing engineering squads are identified, calibrated, and deployed.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginTop: '1rem' }}>
            1. The Structural Shift in Talent Calibration
          </h2>
          <p>
            Historically, recruitment relied heavily on keyword matching and tenure markers. Today, top-tier engineering mandates demand deep evaluation of distributed consensus primitives, production incident response maturity, and low-latency cache locality. Generalist recruiting agencies continue to see 40%+ dropout rates because their screeners cannot calibrate architectural capabilities.
          </p>

          <div style={{
            padding: '1.75rem',
            backgroundColor: '#EEF2FF',
            borderLeft: '4px solid #4361EE',
            borderRadius: '0 12px 12px 0',
            margin: '1.5rem 0'
          }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1E1B4B', fontStyle: 'italic', margin: 0 }}>
              "Vetting must take place before candidate dossiers reach hiring managers. When candidate pre-qualification includes hands-on architectural design checks, the offer-to-joiner conversion rate escalates from 58% to over 94%."
            </p>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginTop: '1rem' }}>
            2. Ground-Truth Compensation Reality
          </h2>
          <p>
            Our benchmark data indicates a distinct bifurcation between conventional IT services bands and product-engineering compensation structures. Tier-1 product organizations across Bengaluru and Hyderabad are actively bidding for Staff and Principal backend engineers with compensation envelopes scaling 30-40% higher than median industry benchmarks.
          </p>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B132B', marginTop: '1rem' }}>
            3. Institutional Recommendations
          </h2>
          <p>
            To protect product roadmaps against multi-month vacancies, enterprise leaders should transition from transactional staffing to calibrated pod sourcing. Establishing transparent cost-plus terms and proactive candidate buffering eliminates the friction of long notice periods.
          </p>
        </div>

        {/* Download Full PDF Whitepaper Card */}
        <div style={{
          backgroundColor: '#0B132B',
          borderRadius: '20px',
          padding: '2.5rem',
          color: '#ffffff',
          marginTop: '3.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Full Research Whitepaper Available
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>Download the Unabridged 48-Page PDF Report</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.25rem' }}>Includes complete compensation percentiles and GCC setup checklists.</div>
          </div>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              backgroundColor: '#4361EE',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            <Download size={16} />
            <span>Request Full PDF</span>
          </Link>
        </div>

      </article>

      {/* Animated Light-Motion Sections from SampleShowcase */}
      <LightEditorialInsightCard />
      <LightSalaryResourceCard />
      <LightMetricsCounter />
      <LightTwoColumnPinnedStory />
      <LightFinalCTAExpansion />

      <SiteFooter />
    </div>
  );
}
