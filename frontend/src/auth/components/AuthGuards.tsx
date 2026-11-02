import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '../../shared/types';
import { ROLE_DEFAULT_REDIRECTS } from '../../shared/constants';
import { getAccessToken, getActiveRole, getTenantId, isTokenExpired } from '../../shared/auth/session';
import { useAuth } from '../../shared/auth/AuthContext';
import { InlineLoading } from '../../shared/ui/DataState';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const token = getAccessToken();

  // Presence + structural expiry check. Full server validation happens on
  // first API call (401 → refresh → redirect) and via AuthProvider /me boot.
  if (!token || isTokenExpired(token)) {
    const segment = location.pathname.split('/')[1];
    const targetLogin = ['recruiter', 'employer', 'superadmin', 'employee', 'vendor', 'candidate'].includes(segment)
      ? `/${segment}/login`
      : '/login';
    return <Navigate to={targetLogin} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading, refreshProfile } = useAuth();
  const location = useLocation();
  const token = getAccessToken();

  // If a valid unexpired token exists in storage but React auth user state hasn't resolved yet,
  // trigger refreshProfile rather than bouncing to /login immediately.
  useEffect(() => {
    if (!user && token && !isTokenExpired(token)) {
      refreshProfile();
    }
  }, [user, token, refreshProfile]);

  if (isLoading || (!user && token && !isTokenExpired(token))) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <InlineLoading message="Verifying your access…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Send the caller to the workspace their *server* role actually owns.
    const defaultRedirect = ROLE_DEFAULT_REDIRECTS[user.role] || '/login';
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

/** Kept for callers that only need the cached hint (never for access decisions). */
export function cachedRoleOrNull(): UserRole | null {
  return getActiveRole();
}
