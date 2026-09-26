import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ROLE_DEFAULT_REDIRECTS, UserRole } from '@nexatalent/shared';

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('candidate');

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = ROLE_DEFAULT_REDIRECTS[selectedRole];
    alert(`Logged in as ${selectedRole}. Navigating to ${targetUrl}`);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '5rem auto', padding: '2.5rem', backgroundColor: '#111726', borderRadius: '16px', border: '1px solid #1e293b', color: '#f8fafc' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sign In to NexaTalent</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Enter your credentials to access your designated workspace</p>
      </div>

      <form onSubmit={handleMockLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#cbd5e1' }}>Select Target Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
          >
            <option value="candidate">Candidate Portal</option>
            <option value="employer">Employer Portal</option>
            <option value="recruiter">Recruiter Workspace</option>
            <option value="employee">Internal Employee Portal</option>
            <option value="superadmin">Super Admin Console</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#cbd5e1' }}>Email Address</label>
          <input
            type="email"
            defaultValue="user@example.com"
            required
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#cbd5e1' }}>Password</label>
          <input
            type="password"
            defaultValue="password123"
            required
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '0.875rem', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}
        >
          Sign In
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
        <Link to="/forgot-password" style={{ color: '#3b82f6', textDecoration: 'none' }}>Forgot password?</Link>
      </div>
    </div>
  );
}

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}
