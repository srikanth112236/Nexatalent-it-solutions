import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Search, 
  CheckCircle2
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { 
  LightInsightsHeroBanner,
  LightEditorialInsightCard, 
  LightSalaryResourceCard, 
  HorizontalCardsRail, 
  LightMetricsCounter, 
  LightFinalCTAExpansion,
  LightTwoColumnPinnedStory,
  SignatureCompensationHeatmap,
  SignatureLiveArbitrageMatrixSlider,
  LightStackedCards,
  ParallaxMultiLayerSplit,
  PinnedSpeedometerGauge,
  LightDirectContactSection,
  FullScreenHorizontalParallaxEditorialScroll,
  LightBentoArchitecture,
  SignatureExecutivePledgeShield
} from '../components/light-motion';
import {
  CtaDownloadGccCompReport,
  AboutSecurityComplianceVault,
  FaqAccordionInteractiveSearch
} from '../components/sample-library';

export const INSIGHTS_ARTICLES = [
  {
    slug: 'india-tech-salary-guide-2026',
    title: 'India Technology Compensation & Equity Benchmark Report 2026',
    category: 'Salary Guides',
    tag: 'Flagship Research',
    readTime: '12 Min Read',
    date: 'September 2026',
    author: 'Nexa Research & Advisory',
    excerpt: 'Comprehensive ground-truth analysis of 30,000+ verified engineering offers across Bengaluru, Hyderabad, and Pune. Discover median CTC, ESOP pools, and retention bonuses.',
    highlights: ['Senior Backend median up 18%', 'Generative AI skill premium hits 35%', 'Notice buyout frequency in Tier-1 product firms']
  },
  {
    slug: 'gcc-setup-playbook-india',
    title: 'The Fortune 500 GCC Playbook: Zero-to-100 Offshore Engineers in 90 Days',
    category: 'GCC Reports',
    tag: 'Enterprise Playbook',
    readTime: '15 Min Read',
    date: 'August 2026',
    author: 'GCC Advisory Practice',
    excerpt: 'A practical institutional blueprint for global CIOs establishing technical delivery hubs in India. Covers STPI/SEZ structuring, local leadership hiring, and 60% cost arbitrage.',
    highlights: ['Grade leveling matrices', 'Bengaluru vs Hyderabad cost comparison', 'Minimizing Day-0 dropout rates']
  },
  {
    slug: 'distributed-systems-interview-blueprint',
    title: 'Vetting Staff Engineers: The System Design & Concurrency Evaluation Rubric',
    category: 'Engineering Playbooks',
    tag: 'Technical Hiring',
    readTime: '9 Min Read',
    date: 'September 2026',
    author: 'Principal Technical Evaluator',
    excerpt: 'Why traditional LeetCode puzzles fail to evaluate distributed systems competence. A practical 4-stage scorecard for evaluating Raft, cache coherence, and live kernel tuning.',
    highlights: ['Live coding evaluation frameworks', 'System design interview rubrics', 'Assessing architectural trade-offs']
  },
  {
    slug: 'preventing-offer-shopping-attrition',
    title: 'Eliminating the 40% Offer Dropout Phenomenon in Indian Tech Hiring',
    category: 'Market Trends',
    tag: 'Talent Operations',
    readTime: '8 Min Read',
    date: 'July 2026',
    author: 'Talent Acquisition Team',
    excerpt: 'Actionable tactics to achieve a 94%+ joining ratio. Learn how high-touch engagement, candidate transparency, and proactive counter-offer analysis secure top talent.',
    highlights: ['Candidate pre-boarding rituals', 'Counter-offer risk indicators', 'Contractual buyouts management']
  },
  {
    slug: 'fintech-ultra-low-latency-talent-landscape',
    title: 'The High-Frequency Trading & FinTech Talent Landscape in India',
    category: 'Market Trends',
    tag: 'Domain Spotlight',
    readTime: '11 Min Read',
    date: 'August 2026',
    author: 'Quant & FinTech Practice',
    excerpt: 'An insider look into the talent density of C++20, FPGA, and low-latency systems engineers in Mumbai, Gurugram, and Bengaluru.',
    highlights: ['Microsecond latency skill premiums', 'Trading desk compensation dynamics', 'Regulatory compliance vetting']
  },
  {
    slug: 'rpo-vs-contingency-recruitment-economics',
    title: 'RPO vs. Contingent Staffing: The CFO Guide to Engineering Hiring Economics',
    category: 'Salary Guides',
    tag: 'Financial Advisory',
    readTime: '10 Min Read',
    date: 'September 2026',
    author: 'Financial Advisory Lead',
    excerpt: 'When should enterprise engineering teams switch from transactional recruiters to embedded talent acquisition? Auditable math on 45% cost savings.',
    highlights: ['Cost-per-hire breakdown', 'Internal recruiter capacity models', 'Long-term agency spend audit']
  }
];

export function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
  }, []);

  const categories = ['All', 'Salary Guides', 'GCC Reports', 'Engineering Playbooks', 'Market Trends'];

  const filtered = INSIGHTS_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
      {/* SEO & Meta Tags */}
      <SeoHead
        title="Tech Hiring Insights, Salary Guides & GCC Playbooks | NexaTalent IT Solutions"
        description="Ground-truth compensation reports, tech hiring playbooks, and GCC market research based on 30,000+ verified engineering offers in Bengaluru, Hyderabad, and Pune."
        keywords="India tech salary guide 2026, GCC setup playbook India, distributed systems hiring rubric, tech compensation benchmarks, recruiter market reports"
        canonical="/insights"
      />

      {/* 1. Global Navbar */}
      <SiteNavbar />

      {/* 2. Light Premier Research & Insights Hero Banner */}
      <LightInsightsHeroBanner />

      {/* 3. Flagship Research Library & Articles Filter Desk */}
      <section id="research-library" style={{ 
        position: 'relative', 
        paddingTop: '8rem', 
        paddingBottom: '4.5rem', 
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
              color: '#3730A3',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}
          >
            <BookOpen size={15} />
            <span>Nexa Intelligence & Research Desk</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0B132B',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}
          >
            Engineering Talent <span style={{ color: '#4361EE' }}>Intelligence & Reports</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#475569',
              maxWidth: '820px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6
            }}
          >
            Real-world compensation benchmarks, GCC scaling strategies, and technical hiring scorecards published by NexaTalent IT Solutions’s executive recruiters and advisory leads.
          </motion.p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1.25rem' }} />
            <input
              type="text"
              placeholder="Search reports, salary guides, playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 3rem',
                borderRadius: '14px',
                border: '1px solid #CBD5E1',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          {/* Newsletter Subscription Strip */}
          <div className="mt-8 max-w-2xl mx-auto p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div>
              <div className="text-xs font-bold text-blue-900">Subscribe to Monthly Talent Intelligence</div>
              <div className="text-[11px] text-slate-600">Join 14,000+ VPs of Engineering & CHROs receiving ground-truth compensation data.</div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Nexa Talent Intelligence Insights!'); }} className="flex gap-2 w-full sm:w-auto">
              <input type="email" required placeholder="work@company.com" className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 flex-1 sm:w-48" />
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">Join</button>
            </form>
          </div>

        </div>
      </section>

      {/* Main Articles Stream with Category Filter */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: selectedCategory === c ? '2px solid #4361EE' : '1px solid #E2E8F0',
                backgroundColor: selectedCategory === c ? '#EEF2FF' : '#ffffff',
                color: selectedCategory === c ? '#4361EE' : '#64748B',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Article Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {filtered.map((art) => (
            <div
              key={art.slug}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4361EE', backgroundColor: '#EEF2FF', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                    {art.tag}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <Clock size={12} />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                  {art.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {art.excerpt}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {art.highlights.map((h) => (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#334155' }}>
                      <CheckCircle2 size={14} color="#10B981" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1.25rem',
                borderTop: '1px solid #F1F5F9'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{art.date}</span>
                <Link
                  to={`/insights/${art.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#4361EE',
                    textDecoration: 'none'
                  }}
                >
                  <span>Read Full Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 4. Interactive Regional Compensation Heatmap */}
      <SignatureCompensationHeatmap />

      {/* 5. Deep-Dive Editorial Insight Card */}
      <LightEditorialInsightCard />

      {/* 6. Downloadable Salary & Budgeting Resource Card */}
      <LightSalaryResourceCard />

      {/* 7. Live Currency & Global Tech Arbitrage Slider */}
      <SignatureLiveArbitrageMatrixSlider />

      {/* 8. Research Benchmark Cards Rail */}
      <HorizontalCardsRail />

      {/* 9. Stacked Future Hiring Trend Cards */}
      <LightStackedCards />

      {/* 10. Two-Column Pinned Research Methodology Story */}
      <LightTwoColumnPinnedStory />

      {/* 11. Full-Screen Horizontal Parallax Editorial Scroll */}
      <FullScreenHorizontalParallaxEditorialScroll />

      {/* 12. Multi-Layer Specialization Parallax */}
      <ParallaxMultiLayerSplit />

      {/* 13. Research Bento Architecture */}
      <LightBentoArchitecture />

      {/* 14. Research Telemetry & Data Counter */}
      <LightMetricsCounter />

      {/* 15. Market Hiring Velocity Index Speedometer */}
      <PinnedSpeedometerGauge />

      {/* 16. Security, Compliance & Data Governance Vault */}
      <AboutSecurityComplianceVault />

      {/* 17. Research Ethics & Integrity Pledge Shield */}
      <SignatureExecutivePledgeShield />

      {/* 18. Download Annual Compensation Benchmark Report CTA */}
      <CtaDownloadGccCompReport />

      {/* 19. Research & Salary FAQs */}
      <FaqAccordionInteractiveSearch />

      {/* 20. Final Insight CTA Expansion */}
      <LightFinalCTAExpansion />

      {/* 21. Research Advisory Desk */}
      <LightDirectContactSection />

      {/* 22. Site Footer */}
      <SiteFooter />
    </div>
  );
}
