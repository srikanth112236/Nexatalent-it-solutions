import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { AskNexaAiHeroSearch, JobsForMeAiStream } from '../components/ai-engines';
import {
  JobsInteractiveSearchFilterDeck,
  JobsFeaturedMandatesCarousel,
  JobsSalaryAndArbitrageCalculator,
  JobsTalentBenchSpotlight,
  JobsInterviewProcessRoadmap,
  JobsQuickApplicationDrawerModal,
  JobsCandidateCareerConcierge,
  JobsCandidatePerksAndWorkspaceGrid,
  JobsReferralEngineAndRewards,
  FaqAccordionInteractiveSearch
} from '../components/sample-library';

import {
  HorizontalMandateShowcase,
  SignatureLiveArbitrageMatrixSlider,
  LightJobCardShowcase,
  PinnedSpeedometerGauge,
  LightTwoColumnPinnedStory,
  ParallaxDepthFloatMatrix,
  SignatureInteractiveTimelineDial,
  LightFeaturedJobsCarousel,
  SignatureExecutivePledgeShield,
  LightDirectContactSection
} from '../components/light-motion';

export function JobsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || searchParams.get('role') || searchParams.get('location') || '';
  const [activeQuery, setActiveQuery] = useState<string>(initialSearch);

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

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans relative overflow-x-clip">
      {/* SEO & Meta Tags */}
      <SeoHead
        title="Explore Tech, GCC & AI Leadership Jobs | Nexa Talent IT Solutions"
        description="Search active job openings across Bengaluru, Hyderabad, Pune, Gurgaon, London, and remote. Specializing in AI/ML, Full Stack, Cloud, DevOps, Low-Latency FinTech, and GCC executive roles with transparent CTC benchmarks."
        keywords="tech jobs Bangalore, GCC careers India, AI ML engineer jobs, high-paying tech jobs, software engineering jobs Hyderabad, Pune IT hiring"
        canonical="/jobs"
      />

      {/* 1. Global Navbar */}
      <SiteNavbar />

      {/* 2. Light Premier AI Requisition Parser & Tech Hub Hero */}
      <AskNexaAiHeroSearch onSearchQueryChange={(q) => setActiveQuery(q)} />

      {/* 3. Horizontal Mandates Showcase */}
      <HorizontalMandateShowcase />

      {/* 4. Interactive Search & Multi-Filter Deck (Real-time Filtered) */}
      <JobsInteractiveSearchFilterDeck searchQueryProp={activeQuery} />

      {/* 5. "Jobs For Me" Tailored AI Stream */}
      <JobsForMeAiStream />

      {/* 6. Signature Live Arbitrage Matrix Slider */}
      <SignatureLiveArbitrageMatrixSlider />

      {/* 7. Featured Mandates Carousel */}
      <JobsFeaturedMandatesCarousel />

      {/* 8. Curated Job Card Showcase */}
      <LightJobCardShowcase />

      {/* 9. Featured Jobs Interactive Carousel */}
      <LightFeaturedJobsCarousel />

      {/* 10. Salary & Arbitrage Percentile Calculator */}
      <JobsSalaryAndArbitrageCalculator />

      {/* 11. Pinned Speedometer Gauge */}
      <PinnedSpeedometerGauge />

      {/* 12. Talent Bench Spotlight for Immediate Joiners */}
      <JobsTalentBenchSpotlight />

      {/* 13. Two Column Pinned Story */}
      <LightTwoColumnPinnedStory />

      {/* 14. Interview Process Roadmap */}
      <JobsInterviewProcessRoadmap />

      {/* 15. Parallax Depth Float Matrix */}
      <ParallaxDepthFloatMatrix />

      {/* 16. Signature Interactive Timeline Dial */}
      <SignatureInteractiveTimelineDial />

      {/* 17. Executive Candidate Protection & Ethical Hiring Shield */}
      <SignatureExecutivePledgeShield />

      {/* 18. 1-Click Quick Application Modal Component */}
      <JobsQuickApplicationDrawerModal />

      {/* 19. Candidate Career Concierge Advocate */}
      <JobsCandidateCareerConcierge />

      {/* 20. Candidate Perks & Tech Stack Grid */}
      <JobsCandidatePerksAndWorkspaceGrid />

      {/* 21. Peer Referral & Joining Rewards */}
      <JobsReferralEngineAndRewards />

      {/* 22. Career & Offer FAQs */}
      <FaqAccordionInteractiveSearch />

      {/* 23. Candidate Talent Desk & Footer */}
      <LightDirectContactSection />
      <SiteFooter />
    </div>
  );
}
