import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('candidate');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const destination = ROLE_DEFAULT_REDIRECTS[selectedRole] || '/';
    navigate(destination);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '2.5rem', backgroundColor: 'var(--color-surface, #111726)', borderRadius: '16px', border: '1px solid var(--color-border, #1e293b)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', textDecoration: 'none' }}>
          Nexa<span style={{ color: 'var(--color-primary, #3b82f6)' }}>Talent</span>
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>
          Account Sign In
        </h1>
        <p style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.875rem' }}>
          Select your portal destination and enter credentials
        </p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#cbd5e1' }}>
            Portal Destination
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--color-bg, #090d16)', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.875rem' }}
          >
            <option value="candidate">Candidate Career Hub (/candidate)</option>
            <option value="employer">Employer Workspace (/employer)</option>
            <option value="recruiter">Recruiter Workspace (/recruiter)</option>
            <option value="employee">Internal Employee Portal (/employee)</option>
            <option value="superadmin">Super Admin Console (/superadmin)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#cbd5e1' }}>
            Work Email
          </label>
          <input
            type="email"
            defaultValue="user@nexatalent.com"
            required
            style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--color-bg, #090d16)', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#cbd5e1' }}>
            Password
          </label>
          <input
            type="password"
            defaultValue="password123"
            required
            style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--color-bg, #090d16)', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '0.875rem', backgroundColor: 'var(--color-primary, #3b82f6)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}
        >
          Sign In to Portal
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted, #94a3b8)', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/candidate/register" style={{ color: 'var(--color-primary, #3b82f6)' }}>Register as Candidate</Link>
        <Link to="/employer/register" style={{ color: 'var(--color-primary, #3b82f6)' }}>Register Employer</Link>
      </div>
    </div>
  );
}
