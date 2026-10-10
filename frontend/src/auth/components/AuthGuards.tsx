import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';
import { getAccessToken, getActiveRole, getTenantId, isTokenExpired } from '../../shared/auth/session';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const token = getAccessToken();

  // Presence + structural expiry check. Full server validation happens on
  // first API call (401 → refresh → redirect) and via AuthProvider /me boot.
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  // Role is bound at login to the server-issued session (persistSession).
  // It is still client-readable, so the backend MUST re-enforce roles per API.
  const activeRole = getActiveRole() || 'candidate';

  if (!allowedRoles.includes(activeRole)) {
    const defaultRedirect = ROLE_DEFAULT_REDIRECTS[activeRole] || '/login';
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
}

interface TenantGuardProps {
  children: ReactNode;
}

export function TenantGuard({ children }: TenantGuardProps) {
  const tenantId = getTenantId();

  // Secure default: block rendering until a tenant context exists.
  // Tenant is assigned by the server at login — never silently injected here.
  if (!tenantId) {
    return <Navigate to="/login?reason=tenant_missing" replace />;
  }

  return <>{children}</>;
}
