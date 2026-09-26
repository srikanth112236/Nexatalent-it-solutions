import { Routes, Route } from 'react-router-dom';
import { WebsiteRoutes } from '../website/routes/WebsiteRoutes';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { SuperAdminPortal } from '../portals/superadmin/SuperAdminPortal';
import { EmployeePortal } from '../portals/employee/EmployeePortal';
import { RecruiterPortal } from '../portals/recruiter/RecruiterPortal';
import { EmployerPortal } from '../portals/employer/EmployerPortal';
import { CandidatePortal } from '../portals/candidate/CandidatePortal';
import { DesignSystemShowcase } from '../shared/design-system/DesignSystemShowcase';

export function AppRoutes() {
  return (
    <Routes>
      {/* Living Design System Showcase */}
      <Route path="/design-system" element={<DesignSystemShowcase />} />
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
