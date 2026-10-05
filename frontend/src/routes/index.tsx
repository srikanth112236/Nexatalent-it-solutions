import { Routes, Route } from 'react-router-dom';
import { WebsiteRoutes } from '../website/routes/WebsiteRoutes';
import { LoginPage } from '../auth/pages/LoginPage';
import { CandidateRegisterPage } from '../auth/pages/CandidateRegisterPage';
import { EmployerRegisterPage } from '../auth/pages/EmployerRegisterPage';
import { ForgotPasswordPage } from '../auth/pages/ForgotPasswordPage';

import { SuperAdminPortal } from '../portals/superadmin/SuperAdminPortal';
import { EmployeePortal } from '../portals/employee/EmployeePortal';
import { RecruiterPortal } from '../portals/recruiter/RecruiterPortal';
import { EmployerPortal } from '../portals/employer/EmployerPortal';
import { CandidatePortal } from '../portals/candidate/CandidatePortal';

import { DesignSystemShowcase } from '../shared/design-system/DesignSystemShowcase';
import { ComponentPlayground } from '../shared/primitives/ComponentPlayground';
import { WebCompIndexPage } from '../website/pages/web-comp/WebCompIndexPage';
import { WebCompHerosPage } from '../website/pages/web-comp/WebCompHerosPage';
import { WebCompSectionsPage } from '../website/pages/web-comp/WebCompSectionsPage';
import { WebCompPortalPage } from '../website/pages/web-comp/WebCompPortalPage';
import { WebCompAboutPage } from '../website/pages/web-comp/WebCompAboutPage';
import { WebCompAceternityPage } from '../website/pages/web-comp/WebCompAceternityPage';
import { WebCompPrimePage } from '../website/pages/web-comp/WebCompPrimePage';
import { WebCompHeros2Page } from '../website/pages/web-comp/WebCompHeros2Page';
import { WebsiteComponentsCatalog } from '../website/pages/WebsiteComponentsCatalog';
import { SampleShowcase } from '../website/pages/SampleShowcase';
import { SampleComponentsPage } from '../website/pages/SampleComponentsPage';
import { AllShowcase } from '../website/pages/AllShowcase';

export function AppRoutes() {
  return (
    <Routes>
      {/* Living Design System & Component Catalog */}
      <Route path="/web-comp" element={<WebCompIndexPage />} />
      <Route path="/web-comp/heros" element={<WebCompHerosPage />} />
      <Route path="/web-comp/heros2" element={<WebCompHeros2Page />} />
      <Route path="/web-comp/heros-2" element={<WebCompHeros2Page />} />
      <Route path="/web-comp/sections" element={<WebCompSectionsPage />} />
      <Route path="/web-comp/portal" element={<WebCompPortalPage />} />
      <Route path="/web-comp/about" element={<WebCompAboutPage />} />
      <Route path="/web-comp/aceternity" element={<WebCompAceternityPage />} />
      <Route path="/web-comp/prime" element={<WebCompPrimePage />} />
      <Route path="/design-system" element={<DesignSystemShowcase />} />
      <Route path="/components" element={<ComponentPlayground />} />
      <Route path="/website-components" element={<WebsiteComponentsCatalog />} />
      <Route path="/sample" element={<SampleShowcase />} />
      <Route path="/sample-components" element={<SampleComponentsPage />} />
      <Route path="/sample-compoements" element={<SampleComponentsPage />} />
      <Route path="/all" element={<AllShowcase />} />
      <Route path="/all-components" element={<AllShowcase />} />

      {/* 1. Dedicated Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/*" element={<LoginPage />} />
      <Route path="/candidate/login" element={<LoginPage />} />
      <Route path="/employer/login" element={<LoginPage />} />
      <Route path="/recruiter/login" element={<LoginPage />} />
      <Route path="/employee/login" element={<LoginPage />} />
      
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/forgot-password/*" element={<ForgotPasswordPage />} />
      
      <Route path="/candidate/register" element={<CandidateRegisterPage />} />
      <Route path="/employer/register" element={<EmployerRegisterPage />} />
      <Route path="/register" element={<CandidateRegisterPage />} />
      <Route path="/register/candidate" element={<CandidateRegisterPage />} />
      <Route path="/register/employer" element={<EmployerRegisterPage />} />

      {/* 2. Dedicated Multi-Role Protected Portal Routes */}
      <Route path="/superadmin/*" element={<SuperAdminPortal />} />
      <Route path="/employee/*" element={<EmployeePortal />} />
      <Route path="/recruiter/*" element={<RecruiterPortal />} />
      <Route path="/employer/*" element={<EmployerPortal />} />
      <Route path="/candidate/*" element={<CandidatePortal />} />

      {/* 3. Public Website Routes (Catch-all for marketing, SEO, jobs, solutions) */}
      <Route path="/*" element={<WebsiteRoutes />} />
    </Routes>
  );
}
