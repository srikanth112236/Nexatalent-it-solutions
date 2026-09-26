import { Routes, Route, Navigate } from 'react-router-dom';
import { SuperAdminPortal } from '../superadmin/SuperAdminPortal';
import { EmployeePortal } from '../employee/EmployeePortal';
import { RecruiterPortal } from '../recruiter/RecruiterPortal';
import { EmployerPortal } from '../employer/EmployerPortal';
import { CandidatePortal } from '../candidate/CandidatePortal';

export function PortalRoutes() {
  return (
    <Routes>
      <Route path="/superadmin/*" element={<SuperAdminPortal />} />
      <Route path="/employee/*" element={<EmployeePortal />} />
      <Route path="/recruiter/*" element={<RecruiterPortal />} />
      <Route path="/employer/*" element={<EmployerPortal />} />
      <Route path="/candidate/*" element={<CandidatePortal />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
