import { Routes, Route } from 'react-router-dom';
import { WebsiteRoutes } from '../website/routes/WebsiteRoutes';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { SuperAdminPortal } from '../portals/superadmin/SuperAdminPortal';
import { EmployeePortal } from '../portals/employee/EmployeePortal';
import { RecruiterPortal } from '../portals/recruiter/RecruiterPortal';
import { EmployerPortal } from '../portals/employer/EmployerPortal';
import { CandidatePortal } from '../portals/candidate/CandidatePortal';
import { DesignSystemShowcase } from '../shared/design-system/DesignSystemShowcase';
import { ComponentPlayground } from '../shared/primitives/ComponentPlayground';
import { WebsiteComponentsCatalog } from '../website/pages/WebsiteComponentsCatalog';
import { SampleShowcase } from '../website/pages/SampleShowcase';
import { SampleComponentsPage } from '../website/pages/SampleComponentsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Living Design System & Component Catalog */}
      <Route path="/design-system" element={<DesignSystemShowcase />} />
      <Route path="/components" element={<ComponentPlayground />} />
      <Route path="/website-components" element={<WebsiteComponentsCatalog />} />
      <Route path="/sample" element={<SampleShowcase />} />
      <Route path="/sample-components" element={<SampleComponentsPage />} />
      <Route path="/sample-compoements" element={<SampleComponentsPage />} />
      {/* 1. Dedicated Authentication Routes */}
      <Route path="/login/*" element={<AuthRoutes />} />
      <Route path="/forgot-password/*" element={<AuthRoutes />} />
      <Route path="/candidate/register" element={<AuthRoutes />} />
      <Route path="/employer/register" element={<AuthRoutes />} />

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
