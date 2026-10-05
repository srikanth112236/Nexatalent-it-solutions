import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Award, 
  FileCheck2, 
  Clock, 
  DollarSign
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { 
  LightWhyNexaHeroBanner,
  LightBeforeAfterMatrix, 
  SignatureExecutivePledgeShield, 
  LightTrustSignalStrip, 
  SignatureTalentComparisonSlider, 
  LightMetricsCounter,
  LightTwoColumnPinnedStory,
  LightFinalCTAExpansion,
  CorridorVettingTunnel,
  ParallaxDepthFloatMatrix,
  LightBentoArchitecture,
  PinnedSpeedometerGauge,
  SignatureInteractiveTimelineDial,
  VerticalParallaxCaseStudy,
  LightDirectContactSection
} from '../components/light-motion';
import {
  DetailServiceLevelGuaranteeSla,
  PricingCostPlusTransparencyBreakdown,
  CaseStudyExecutiveQuoteHighlight,
  FaqAccordionInteractiveSearch
} from '../components/sample-library';

const PILLARS = [
  {
    icon: DollarSign,
    color: '#10B981',
    bg: '#ECFDF5',
    title: 'Transparent Commercial Terms',
    desc: 'Flexible commercial structures—percentage of CTC, contract staffing markups, and executive search retainers with zero hidden fees.'
  },
  {
    icon: FileCheck2,
    color: '#0060E6',
    bg: '#EEF2FF',
    title: 'Structured Technical Candidate Screening',
    desc: 'Never receive raw resumes. Every candidate undergoes role-specific technical evaluation, experience verification, and soft skills screening.'
  },
  {
    icon: ShieldCheck,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    title: '90-Day Replacement Support',
    desc: 'Every permanent lateral hire is backed by a 90-day replacement commitment to ensure long-term candidate success.'
  },
  {
    icon: Clock,
    color: '#F59E0B',
    bg: '#FFFBEB',
    title: 'Targeted Shortlist SLAs',
    desc: 'Our recruiters pre-screen tech talent across major India hubs—delivering qualified candidate shortlists rapidly for urgent requisitions.'
  }
];

export function WhyNexaPage() {
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
      const t1 = window.setTimeout(refresh, 400);
      const t2 = window.setTimeout(refresh, 1200);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, []);

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
        title="Why NexaTalent IT Solutions | 72h Shortlists & Cost-Plus Transparency"
        description="Discover why Fortune 500 enterprises, tech unicorns, and GCCs choose NexaTalent IT Solutions: Cost-Plus pricing transparency, 3-stage technical vetting, 90-day replacement guarantee, and 72-hour shortlist SLAs."
        keywords="why NexaTalent IT Solutions, transparent IT staffing India, 72h tech hiring SLA, engineering recruitment replacement guarantee, audited cost plus staffing"
        canonical="/why-nexatalent"
      />

      {/* 1. Global Navbar */}
      <SiteNavbar />

      {/* 2. Light Premier AI Talent Agency Hero Banner */}
      <LightWhyNexaHeroBanner />

      {/* 3. Core Enterprise Differentiation Pillars */}
      <section style={{ 
        position: 'relative', 
        paddingTop: '5rem', 
        paddingBottom: '4.5rem', 
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
              color: '#002559',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}
          >
            <Award size={15} />
            <span>The Enterprise Talent Transformation Standard</span>
          </motion.div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#002559',
            lineHeight: 1.2,
            marginBottom: '1rem'
          }}>
            Engineered For Speed. Governed For Absolute Quality.
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: '#475569',
            maxWidth: '750px',
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}>
            We replaced legacy contingency recruiting with structured talent intelligence, transparent economic models, and verifiable technical evaluations.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px rgba(0, 37, 89, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: p.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={24} color={p.color} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#002559', marginBottom: '0.75rem' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. [PINNED 1] 3D Perspective Vetting Corridor */}
      <CorridorVettingTunnel />

      {/* 5. [PINNED 2] Quantitative Before & After Matrix */}
      <LightBeforeAfterMatrix />

      {/* 6. [PINNED 3] Executive Ethics & Governance Pledge Shield */}
      <SignatureExecutivePledgeShield />

      {/* 7. [PINNED 4] Interactive Talent Comparison Slider */}
      <SignatureTalentComparisonSlider />

      {/* 8. Institutional Trust Signal Strip (ISO 27001, SOC2, DPDP) */}
      <LightTrustSignalStrip />

      {/* 9. [PINNED 5] Two-Column Pinned Sourcing Story */}
      <LightTwoColumnPinnedStory />

      {/* 10. Verified Service Level Agreements (SLA) */}
      <DetailServiceLevelGuaranteeSla />

      {/* 11. [PINNED 6] Floating Multi-Layer Depth Matrix */}
      <ParallaxDepthFloatMatrix />

      {/* 12. Verified Performance Metric Counter */}
      <LightMetricsCounter />

      {/* 13. [PINNED 7] Signature Interactive Timeline Dial */}
      <SignatureInteractiveTimelineDial />

      {/* 14. Enterprise Platform Bento Architecture */}
      <LightBentoArchitecture />

      {/* 15. Audited Cost-Plus Pricing Breakdown */}
      <PricingCostPlusTransparencyBreakdown />

      {/* 16. [PINNED 8] Shortlist Velocity Speedometer Gauge */}
      <PinnedSpeedometerGauge />

      {/* 17. Client Executive Quotes & Verifiable Proof */}
      <CaseStudyExecutiveQuoteHighlight />

      {/* 18. [PINNED 9] Vertical Parallax Case Study Showcase */}
      <VerticalParallaxCaseStudy />

      {/* 19. Institutional Proof FAQs */}
      <FaqAccordionInteractiveSearch />

      {/* 20. Direct Recruiter Hotline & Advisory Channels */}
      <LightDirectContactSection />

      {/* 21. Final Reassurance CTA */}
      <LightFinalCTAExpansion />

      {/* 22. Site Footer */}
      <SiteFooter />
    </div>
  );
}
