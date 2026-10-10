import { AUTH_STORAGE_KEYS } from '../constants';
import type { UserRole } from '../types';

const ALL_KEYS = [
  AUTH_STORAGE_KEYS.ACCESS_TOKEN,
  AUTH_STORAGE_KEYS.REFRESH_TOKEN,
  AUTH_STORAGE_KEYS.ACTIVE_ROLE,
  AUTH_STORAGE_KEYS.ACTIVE_TENANT_ID,
  AUTH_STORAGE_KEYS.USER_SESSION,
  'user_email',
] as const;

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ||
    sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  );
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
}

export function getActiveRole(): UserRole | null {
  if (typeof window === 'undefined') return null;
  const r = localStorage.getItem(AUTH_STORAGE_KEYS.ACTIVE_ROLE);
  if (r === 'superadmin' || r === 'employee' || r === 'recruiter' || r === 'employer' || r === 'vendor' || r === 'candidate') {
    return r;
  }
  return null;
}

export function getTenantId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACTIVE_TENANT_ID);
}

export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_email');
}

/** Best-effort JWT expiry check. Opaque demo tokens (NEXA-*) are treated as non-expiring but still require server /me validation. */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.exp === 'number') {
      return Date.now() / 1000 >= payload.exp - 30;
    }
    return false;
  } catch {
    return false;
  }
}

export interface PersistedSession {
  accessToken: string;
  refreshToken?: string;
  role: UserRole;
  tenantId?: string;
  email?: string;
}

export function persistSession(s: PersistedSession) {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, s.accessToken);
  if (s.refreshToken) localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, s.refreshToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_ROLE, s.role);
  if (s.tenantId) localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_TENANT_ID, s.tenantId);
  if (s.email) localStorage.setItem('user_email', s.email);
}

/** Clears every auth-related key in both storages. Single source of truth for logout. */
export function clearSession() {
  if (typeof window === 'undefined') return;
  for (const k of ALL_KEYS) {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  }
}
