import { Routes, Route, Link } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';

function RegisterPlaceholder({ title, role }: { title: string; role: string }) {
  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '2.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '16px', border: '1px solid var(--color-border, #1e293b)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Create your verified account for {role}.
      </p>
      <Link to="/login" style={{ color: 'var(--color-primary, #3b82f6)', fontWeight: 600 }}>
        &larr; Back to Sign In
      </Link>
    </div>
  );
}

export function AuthRoutes() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg, #090d16)' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/candidate/login" element={<LoginPage />} />
        <Route path="/employer/login" element={<LoginPage />} />
        <Route path="/recruiter/login" element={<LoginPage />} />
        <Route path="/employee/login" element={<LoginPage />} />
        <Route path="/candidate/register" element={<RegisterPlaceholder title="Candidate Registration" role="Candidate Talent Hub" />} />
        <Route path="/employer/register" element={<RegisterPlaceholder title="Employer Registration" role="Employer Hiring Workspace" />} />
        <Route path="/forgot-password" element={<RegisterPlaceholder title="Reset Password" role="Account Recovery" />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
