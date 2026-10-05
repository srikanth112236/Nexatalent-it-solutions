import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatedHero,
  SplitHero,
  VideoHero,
  EmployerCandidateSwitcher,
  RecruitmentWorkflow,
  SolutionCardGrid,
  IndustryCardGrid,
  LogoMarquee,
  MetricsCounter,
  InteractiveTalentPipeline,
  PortalPreview,
  DashboardShowcase,
  CaseStudyCard,
  CaseStudyResultPanel,
  JobCard,
  FeaturedJobsCarousel,
  IndustrySpotlight,
  Testimonial,
  FAQAccordion,
  ResourceCard,
  InsightCard,
  ProcessTimeline,
  ProcessStepper,
  CTASection,
  ContactForm,
  HiringRequirementForm,
  CandidateProfileCTA,
  JobSearchInterface,
  JobFilterDrawer,
  LocationExplorer,
  IndustryExplorer,
  BeforeAfterSection,
  BentoContentGrid,
  ScrollStorySection,
  HorizontalScrollGallery,
  FloatingCTA,
  TrustSignalStrip,
  ServiceComparison,
  RecruitmentJourneyMap,
  MegaFooter,
} from '../components';

const componentCategories = [
  { id: 'all', label: 'All 40 Components' },
  { id: 'heroes', label: '1-4 Heroes & Modes' },
  { id: 'workflows', label: '5-11 Workflows & Proof' },
  { id: 'showcases', label: '12-16 Portals & Jobs' },
  { id: 'social-proof', label: '17-21 Proof & Knowledge' },
  { id: 'process-intake', label: '22-27 Process & Intake' },
  { id: 'explorers', label: '28-32 Search & Explorers' },
  { id: 'advanced-sections', label: '33-40 Advanced Bento & Journey' },
];

export const WebsiteComponentsCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Catalog Header */}
      <header
        style={{
          padding: '2.5rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--color-primary-400)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                PHASE 4 COMPLETE
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                40 / 40 Aceternity & 21st.dev Components Active
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              NexaTalent IT Solutions Living Website Component Library
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              to="/components"
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              Primitives (Phase 3)
            </Link>
            <Link
              to="/design-system"
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              Design Tokens (Phase 2)
            </Link>
            <Link
              to="/"
              style={{
                fontSize: '0.875rem',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary)',
                fontWeight: 600,
              }}
            >
              Home Page
            </Link>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div
          style={{
            maxWidth: '1300px',
            margin: '1.5rem auto 0 auto',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}
        >
          {componentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: '9999px',
                border: activeCategory === cat.id ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: activeCategory === cat.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: activeCategory === cat.id ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Catalog Content */}
      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* GROUP 1: Heroes & Switches (1 - 4) */}
        {(activeCategory === 'all' || activeCategory === 'heroes') && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                Group 01 · Components 1 to 4
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Hero Banners & Audience Switchers</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* 1. AnimatedHero */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  01. AnimatedHero (Aceternity grid rays, badge, fluid type, metric strip)
                </div>
                <AnimatedHero />
              </div>

              {/* 2. SplitHero */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  02. SplitHero (Dual-column with interactive talent quality scorecard card)
                </div>
                <SplitHero />
              </div>

              {/* 3. VideoHero */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  03. VideoHero (Video preview container with modal play state)
                </div>
                <VideoHero />
              </div>

              {/* 4. EmployerCandidateSwitcher */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  04. EmployerCandidateSwitcher (Pill switcher toggle between employer and candidate modes)
                </div>
                <EmployerCandidateSwitcher />
              </div>
            </div>
          </div>
        )}

        {/* GROUP 2: Workflows & Proof (5 - 11) */}
        {(activeCategory === 'all' || activeCategory === 'workflows') && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                Group 02 · Components 5 to 11
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Workflows, Pipelines & Proof Grids</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* 5. RecruitmentWorkflow */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  05. RecruitmentWorkflow (6-stage interactive protocol)
                </div>
                <RecruitmentWorkflow />
              </div>

              {/* 6. SolutionCardGrid */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  06. SolutionCardGrid (Hiring solutions grid)
                </div>
                <SolutionCardGrid />
              </div>

              {/* 7. IndustryCardGrid */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  07. IndustryCardGrid (Sector specialization grid)
                </div>
                <IndustryCardGrid />
              </div>

              {/* 8. LogoMarquee */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  08. LogoMarquee (Continuous ticker marquee)
                </div>
                <LogoMarquee />
              </div>

              {/* 9. MetricsCounter */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  09. MetricsCounter (Key metrics proof strip)
                </div>
                <MetricsCounter />
              </div>

              {/* 10. InteractiveTalentPipeline */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  10. InteractiveTalentPipeline (Interactive funnel qualification pipeline)
                </div>
                <InteractiveTalentPipeline />
              </div>

              {/* 11. PortalPreview */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  11. PortalPreview (Multi-role portal preview card)
                </div>
                <PortalPreview />
              </div>
            </div>
          </div>
        )}

        {/* GROUP 3: Showcases, Case Studies & Jobs (12 - 16) */}
        {(activeCategory === 'all' || activeCategory === 'showcases') && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                Group 03 · Components 12 to 16
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Showcases, Case Studies & Live Jobs</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* 12. DashboardShowcase */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  12. DashboardShowcase (Interactive HUD mockup with SLA metrics)
                </div>
                <DashboardShowcase />
              </div>

              {/* 13. CaseStudyCard */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  13. CaseStudyCard (Quantified outcome card with metrics)
                </div>
                <div style={{ maxWidth: '480px' }}>
                  <CaseStudyCard
                    client="AlphaFin Global"
                    industry="Fintech & High Frequency Trading"
                    headline="Scaling an India GCC from 0 to 45 Senior Staff Engineers in 75 Days"
                    metrics={[
                      { label: 'Hires Closed', value: '45' },
                      { label: 'Time-to-Hire', value: '18 Days' },
                      { label: 'Retention at 12M', value: '98%' },
                    ]}
                    featured={true}
                  />
                </div>
              </div>

              {/* 14. CaseStudyResultPanel */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  14. CaseStudyResultPanel (Executive case outcome split panel)
                </div>
                <CaseStudyResultPanel />
              </div>

              {/* 15. JobCard */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  15. JobCard (Individual verified mandate card)
                </div>
                <div style={{ maxWidth: '420px' }}>
                  <JobCard
                    id="sample-1"
                    title="Principal Distributed Systems Architect"
                    company="OmniCloud Global"
                    location="Bangalore · Hybrid"
                    type="Full-Time"
                    salary="₹70L - ₹95L + Equity"
                    experience="9+ Years"
                    tags={['Rust', 'Distributed DB', 'Raft', 'eBPF']}
                    postedAt="1 day ago"
                    featured={true}
                    urgent={true}
                  />
                </div>
              </div>

              {/* 16. FeaturedJobsCarousel */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  16. FeaturedJobsCarousel (Category-filtered mandate carousel)
                </div>
                <FeaturedJobsCarousel />
              </div>
            </div>
          </div>
        )}

        {/* GROUP 4: Social Proof & Knowledge (17 - 21) */}
        {(activeCategory === 'all' || activeCategory === 'social-proof') && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                Group 04 · Components 17 to 21
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Proof, Testimonials & Knowledge Artifacts</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* 17. IndustrySpotlight */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  17. IndustrySpotlight (Deep dive into vertical practice capabilities)
                </div>
                <IndustrySpotlight />
              </div>

              {/* 18. Testimonial */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  18. Testimonial (Verified engineering leadership and candidate quotes)
                </div>
                <Testimonial />
              </div>

              {/* 19. FAQAccordion */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  19. FAQAccordion (Searchable FAQ accordion with instant query filter)
                </div>
                <FAQAccordion />
              </div>

              {/* 20. ResourceCard */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  20. ResourceCard (Gated download card for reports and salary playbooks)
                </div>
                <div style={{ maxWidth: '420px' }}>
                  <ResourceCard
                    id="salary-index-2026"
                    title="2026 India & US Tech Compensation Benchmark Report"
                    type="Salary Benchmark Guide"
                    description="Comprehensive compensation ranges, stock equity formulas, and notice period buyouts across 45,000 verified data points."
                    pages={48}
                    format="PDF"
                    downloadsCount="4,800+ Downloads"
                  />
                </div>
              </div>

              {/* 21. InsightCard */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  21. InsightCard (Editorial engineering thought leadership article card)
                </div>
                <div style={{ maxWidth: '420px' }}>
                  <InsightCard
                    id="why-gccs-fail"
                    title="Why 65% of Engineering GCCs Stumble in Year One (And How to Fix It)"
                    excerpt="Key architectural and operational traps multinational enterprises fall into when establishing engineering hubs in Bangalore and Hyderabad."
                    category="GCC Strategy"
                    author={{ name: 'Vikramaditya Sharma', role: 'Head of GCC Advisory' }}
                    readTime="7 min read"
                    date="Sep 2026"
                    featured={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GROUP 5: Process, Stepper & Intake Forms (22 - 27) */}
        {(activeCategory === 'all' || activeCategory === 'process-intake') && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                Group 05 · Components 22 to 27
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Process Timelines, Steppers & Intake Forms</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* 22. ProcessTimeline */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  22. ProcessTimeline (Deterministic SLA milestone timeline)
                </div>
                <ProcessTimeline />
              </div>

              {/* 23. ProcessStepper */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  23. ProcessStepper (Interactive multi-step engagement stepper)
                </div>
                <ProcessStepper />
              </div>

              {/* 24. CTASection */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  24. CTASection (Aceternity neon-glow conversion banner)
                </div>
                <CTASection />
              </div>

              {/* 25. ContactForm */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  25. ContactForm (Direct Practice Lead priority intake)
                </div>
                <ContactForm />
              </div>

              {/* 26. HiringRequirementForm */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  26. HiringRequirementForm (Interactive mandate configurator with 48h SLA)
                </div>
                <HiringRequirementForm />
              </div>

              {/* 27. CandidateProfileCTA */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  27. CandidateProfileCTA (Interactive candidate resume dropzone & privacy charter)
                </div>
                <CandidateProfileCTA />
              </div>
            </div>
          </div>
        )}

        {/* GROUP 6: Search & Explorers (28 - 32) */}
        {(activeCategory === 'all' || activeCategory === 'explorers') && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                Group 06 · Components 28 to 32
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Search Interface, Drawers & Hub Explorers</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* 28. JobSearchInterface */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  28. JobSearchInterface (Live role search bar with quick filters)
                </div>
                <JobSearchInterface
                  onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
                  totalRolesCount={312}
                />
              </div>

              {/* 29. JobFilterDrawer trigger */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  29. JobFilterDrawer (Interactive slideover filter modal)
                </div>
                <button
                  onClick={() => setFilterDrawerOpen(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Open Job Filter Drawer Preview
                </button>
                <JobFilterDrawer
                  isOpen={filterDrawerOpen}
                  onClose={() => setFilterDrawerOpen(false)}
                />
              </div>

              {/* 30. LocationExplorer */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  30. LocationExplorer (Global tech hubs, comp benchmarks & active roles)
                </div>
                <LocationExplorer />
              </div>

              {/* 31. IndustryExplorer */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  31. IndustryExplorer (Industry practice matrices & SLA turnaround metrics)
                </div>
                <IndustryExplorer />
              </div>

              {/* 32. BeforeAfterSection */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  32. BeforeAfterSection (Conventional Agency vs NexaTalent IT Solutions Operating System)
                </div>
                <BeforeAfterSection />
              </div>
            </div>
          </div>
        )}

        {/* GROUP 7: Advanced Bento & Journey (33 - 40) */}
        {(activeCategory === 'all' || activeCategory === 'advanced-sections') && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                Group 07 · Components 33 to 40
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Advanced Bento Grids, Galleries & Footers</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* 33. BentoContentGrid */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  33. BentoContentGrid (Aceternity 4-cell asymmetric bento layout)
                </div>
                <BentoContentGrid />
              </div>

              {/* 34. ScrollStorySection */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  34. ScrollStorySection (Progressive storytelling narrative with reactive metrics)
                </div>
                <ScrollStorySection />
              </div>

              {/* 35. HorizontalScrollGallery */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  35. HorizontalScrollGallery (Snap-scrolling card gallery with controls)
                </div>
                <HorizontalScrollGallery />
              </div>

              {/* 36. FloatingCTA */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  36. FloatingCTA (Docked bottom SLA action bar)
                </div>
                <FloatingCTA headline="Need 3 verified Principal Engineers this week?" />
              </div>

              {/* 37. TrustSignalStrip */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  37. TrustSignalStrip (SOC2, ISO 27001, 90-day warranty indicators)
                </div>
                <TrustSignalStrip />
              </div>

              {/* 38. ServiceComparison */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  38. ServiceComparison (3-tier transparent engagement models)
                </div>
                <ServiceComparison />
              </div>

              {/* 39. RecruitmentJourneyMap */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  39. RecruitmentJourneyMap (Synchronous dual-track employer vs candidate roadmap)
                </div>
                <RecruitmentJourneyMap />
              </div>

              {/* 40. MegaFooter */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.8125rem', fontWeight: 700 }}>
                  40. MegaFooter (5-column enterprise footer with newsletter & live SLA status)
                </div>
                <MegaFooter />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
