import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WebsiteRoutes } from '../website/routes/WebsiteRoutes';
import { LoginPage } from '../auth/pages/LoginPage';
import { CandidateRegisterPage } from '../auth/pages/CandidateRegisterPage';
import { EmployerRegisterPage } from '../auth/pages/EmployerRegisterPage';
import { RecruiterRegisterPage } from '../auth/pages/RecruiterRegisterPage';
import { VendorRegisterPage } from '../auth/pages/VendorRegisterPage';
import { ForgotPasswordPage } from '../auth/pages/ForgotPasswordPage';
import { NotFoundPage } from './NotFoundPage';
import { InlineLoading } from '../shared/ui/DataState';

import { PortalStateProvider } from '../portals/common/PortalStateContext';

// Code-split: each portal bundle loads only when its workspace is visited.
const SuperAdminPortal = lazy(() =>
  import('../portals/superadmin/SuperAdminPortal').then((m) => ({ default: m.SuperAdminPortal })),
);
const EmployeePortal = lazy(() =>
  import('../portals/employee/EmployeePortal').then((m) => ({ default: m.EmployeePortal })),
);
const RecruiterPortal = lazy(() =>
  import('../portals/recruiter/RecruiterPortal').then((m) => ({ default: m.RecruiterPortal })),
);
const EmployerPortal = lazy(() =>
  import('../portals/employer/EmployerPortal').then((m) => ({ default: m.EmployerPortal })),
);
const VendorPortal = lazy(() =>
  import('../portals/vendor/VendorPortal').then((m) => ({ default: m.VendorPortal })),
);
const CandidatePortal = lazy(() =>
  import('../portals/candidate/CandidatePortal').then((m) => ({ default: m.CandidatePortal })),
);

function PortalLazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<InlineLoading message="Loading workspace…" />}>{children}</Suspense>;
}
import { AuthGuard, RoleGuard } from '../auth/components/AuthGuards';
import { InactivityGuard } from '../auth/components/InactivityGuard';

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
    <PortalStateProvider>
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
        <Route path="/vendor/login" element={<LoginPage />} />
        <Route path="/employee/login" element={<LoginPage />} />
        <Route path="/superadmin/login" element={<LoginPage />} />
        
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/*" element={<ForgotPasswordPage />} />
        
        <Route path="/candidate/register" element={<CandidateRegisterPage />} />
        <Route path="/employer/register" element={<EmployerRegisterPage />} />
        <Route path="/recruiter/register" element={<RecruiterRegisterPage />} />
        <Route path="/vendor/register" element={<VendorRegisterPage />} />
        <Route path="/register" element={<CandidateRegisterPage />} />
        <Route path="/register/candidate" element={<CandidateRegisterPage />} />
        <Route path="/register/employer" element={<EmployerRegisterPage />} />
        <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
        <Route path="/register/vendor" element={<VendorRegisterPage />} />

        {/* 2. Dedicated Multi-Role Protected Portal Routes */}
        <Route
          path="/superadmin/*"
          element={
            <InactivityGuard>
              <AuthGuard>
                <RoleGuard allowedRoles={['superadmin']}>
                  <PortalLazy>
                    <SuperAdminPortal />
                  </PortalLazy>
                </RoleGuard>
              </AuthGuard>
            </InactivityGuard>
          }
        />
        <Route
          path="/employee/*"
          element={
            <InactivityGuard>
              <AuthGuard>
                <RoleGuard allowedRoles={['employee', 'superadmin']}>
                  <PortalLazy>
                    <EmployeePortal />
                  </PortalLazy>
                </RoleGuard>
              </AuthGuard>
            </InactivityGuard>
          }
        />
        <Route
          path="/recruiter/*"
          element={
            <InactivityGuard>
              <AuthGuard>
                <RoleGuard allowedRoles={['recruiter', 'superadmin']}>
                  <PortalLazy>
                    <RecruiterPortal />
                  </PortalLazy>
                </RoleGuard>
              </AuthGuard>
            </InactivityGuard>
          }
        />
        <Route
          path="/employer/*"
          element={
            <InactivityGuard>
              <AuthGuard>
                <RoleGuard allowedRoles={['employer', 'superadmin']}>
                  <PortalLazy>
                    <EmployerPortal />
                  </PortalLazy>
                </RoleGuard>
              </AuthGuard>
            </InactivityGuard>
          }
        />
        <Route
          path="/vendor/*"
          element={
            <InactivityGuard>
              <AuthGuard>
                <RoleGuard allowedRoles={['vendor', 'superadmin']}>
                  <PortalLazy>
                    <VendorPortal />
                  </PortalLazy>
                </RoleGuard>
              </AuthGuard>
            </InactivityGuard>
          }
        />
        <Route
          path="/candidate/*"
          element={
            <InactivityGuard>
              <AuthGuard>
                <RoleGuard allowedRoles={['candidate', 'superadmin']}>
                  <PortalLazy>
                    <CandidatePortal />
                  </PortalLazy>
                </RoleGuard>
              </AuthGuard>
            </InactivityGuard>
          }
        />

        <Route path="/404" element={<NotFoundPage />} />

        {/* 3. Public Website Routes (Catch-all for marketing, SEO, jobs, solutions) */}
        <Route path="/*" element={<WebsiteRoutes />} />
      </Routes>
    </PortalStateProvider>
  );
}
