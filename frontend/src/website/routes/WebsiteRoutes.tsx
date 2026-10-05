import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { HomePageV2 } from '../pages/HomePageV2';
import { HomePageV3 } from '../pages/HomePageV3';
import { HomePageV4 } from '../pages/HomePageV4';
import { HomePageV5 } from '../pages/HomePageV5';
import { EmployersPage } from '../pages/EmployersPage';
import { CandidatesPage } from '../pages/CandidatesPage';
import { PartnersPage } from '../pages/PartnersPage';
import { JobsPage } from '../pages/JobsPage';
import { SolutionsPage } from '../pages/SolutionsPage';
import { CaseStudiesPage } from '../pages/CaseStudiesPage';
import { AboutPage } from '../pages/AboutPage';

// New Spec-Compliant Pages
import { ContactPage } from '../pages/ContactPage';
import { IndustriesPage } from '../pages/IndustriesPage';
import { WhyNexaPage } from '../pages/WhyNexaPage';
import { SolutionDetailPage } from '../pages/SolutionDetailPage';
import { IndustryDetailPage } from '../pages/IndustryDetailPage';
import { JobDetailPage } from '../pages/JobDetailPage';
import { CaseStudyDetailPage } from '../pages/CaseStudyDetailPage';
import { InsightsPage } from '../pages/InsightsPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage';
import { LegalPage } from '../pages/LegalPage';

export function WebsiteRoutes() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <main style={{ flex: 1 }}>
        <Routes>
          {/* 1. Main Homepage — HomePageV5 set as default */}
          <Route path="/" element={<HomePageV5 />} />
          <Route path="/v1" element={<HomePage />} />
          <Route path="/home-v1" element={<HomePage />} />

          {/* 2. Core Employer & Client Pages */}
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/employer" element={<EmployersPage />} />
          <Route path="/hire-talent" element={<EmployersPage />} />
          <Route path="/request-talent" element={<EmployersPage />} />
          <Route path="/why-nexatalent" element={<WhyNexaPage />} />

          {/* 3. Solutions Suite (Overview + Dynamic Slugs) */}
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/solutions/:slug" element={<SolutionDetailPage />} />

          {/* 4. Industries Suite (Overview + Dynamic Slugs) */}
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/:slug" element={<IndustryDetailPage />} />

          {/* 5. Candidates & Career Services Suite */}
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidate" element={<CandidatesPage />} />
          <Route path="/career-services" element={<CandidatesPage />} />
          <Route path="/candidate-resources" element={<CandidatesPage />} />

          {/* 6. Jobs Board & Single Job Detail Mandates */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobSlug" element={<JobDetailPage />} />

          {/* 7. Partner / Vendor Empanelment */}
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/partner" element={<PartnersPage />} />
          <Route path="/vendor" element={<PartnersPage />} />
          <Route path="/vendors" element={<PartnersPage />} />
          <Route path="/vendor-empanelment" element={<PartnersPage />} />

          {/* 8. Authority, Proof & Insights Engine */}
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:caseStudySlug" element={<CaseStudyDetailPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:articleSlug" element={<ArticleDetailPage />} />
          <Route path="/guides" element={<InsightsPage />} />
          <Route path="/reports" element={<InsightsPage />} />

          {/* 10. Company & Direct Contact */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* 11. Legal & Compliance Suite */}
          <Route path="/privacy-policy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/cookie-policy" element={<LegalPage />} />
          <Route path="/accessibility" element={<LegalPage />} />
          <Route path="/data-protection" element={<LegalPage />} />
          <Route path="/disclaimer" element={<LegalPage />} />

          {/* 12. Alternate Homepage Design Showcases */}
          <Route path="/v2" element={<HomePageV2 />} />
          <Route path="/home-v2" element={<HomePageV2 />} />
          <Route path="/v3" element={<HomePageV3 />} />
          <Route path="/home-v3" element={<HomePageV3 />} />
          <Route path="/v4" element={<HomePageV4 />} />
          <Route path="/home-v4" element={<HomePageV4 />} />
          <Route path="/v5" element={<HomePageV5 />} />
          <Route path="/home-v5" element={<HomePageV5 />} />
        </Routes>
      </main>
    </div>
  );
}
