import { Routes, Route, Navigate } from 'react-router-dom';
import { SuperAdminPortal } from '../superadmin/SuperAdminPortal';
import { EmployeePortal } from '../employee/EmployeePortal';
import { RecruiterPortal } from '../recruiter/RecruiterPortal';
import { EmployerPortal } from '../employer/EmployerPortal';
import { VendorPortal } from '../vendor/VendorPortal';
import { CandidatePortal } from '../candidate/CandidatePortal';
import { AuthGuard, RoleGuard } from '../../auth/components/AuthGuards';
import { InactivityGuard } from '../../auth/components/InactivityGuard';

/**
 * @deprecated Prefer the canonical guarded routes in `src/routes/index.tsx`.
 * Kept guarded (not public) so legacy imports stay secure.
 */
function guarded(allowedRoles: ('superadmin' | 'employee' | 'recruiter' | 'employer' | 'vendor' | 'candidate')[], el: React.ReactNode) {
  return (
    <InactivityGuard>
      <AuthGuard>
        <RoleGuard allowedRoles={allowedRoles}>{el}</RoleGuard>
      </AuthGuard>
    </InactivityGuard>
  );
}

export function PortalRoutes() {
  return (
    <Routes>
      <Route path="/superadmin/*" element={guarded(['superadmin'], <SuperAdminPortal />)} />
      <Route path="/employee/*" element={guarded(['employee', 'superadmin'], <EmployeePortal />)} />
      <Route path="/recruiter/*" element={guarded(['recruiter', 'superadmin'], <RecruiterPortal />)} />
      <Route path="/employer/*" element={guarded(['employer', 'superadmin'], <EmployerPortal />)} />
      <Route path="/vendor/*" element={guarded(['vendor', 'superadmin'], <VendorPortal />)} />
      <Route path="/candidate/*" element={guarded(['candidate', 'superadmin'], <CandidatePortal />)} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
