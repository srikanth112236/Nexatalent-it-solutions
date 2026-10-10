import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { CandidateRegisterPage } from '../pages/CandidateRegisterPage';
import { EmployerRegisterPage } from '../pages/EmployerRegisterPage';
import { RecruiterRegisterPage } from '../pages/RecruiterRegisterPage';
import { VendorRegisterPage } from '../pages/VendorRegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

export function AuthRoutes() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg, #090d16)' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/candidate/login" element={<LoginPage />} />
        <Route path="/employer/login" element={<LoginPage />} />
        <Route path="/recruiter/login" element={<LoginPage />} />
        <Route path="/vendor/login" element={<LoginPage />} />
        <Route path="/employee/login" element={<LoginPage />} />
        <Route path="/superadmin/login" element={<LoginPage />} />
        <Route path="/candidate/register" element={<CandidateRegisterPage />} />
        <Route path="/employer/register" element={<EmployerRegisterPage />} />
        <Route path="/recruiter/register" element={<RecruiterRegisterPage />} />
        <Route path="/vendor/register" element={<VendorRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
