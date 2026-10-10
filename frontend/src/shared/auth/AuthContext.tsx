import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../constants';
import type { UserRole } from '../types';
import { clearSession, getAccessToken, getActiveRole, getTenantId, getUserEmail, isTokenExpired, persistSession } from './session';

export interface AuthUser {
  id?: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: { email: string; password: string; role: UserRole }) => Promise<void>;
  logout: (reason?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeLoginResponse(res: any): { accessToken: string; refreshToken?: string; user: AuthUser; fallback: boolean } | null {
  // Supports both ApiResponse-wrapped ({success,data:{...}}) and legacy top-level ({accessToken,...}) shapes.
  const body = res?.data && (res.data.accessToken || res.data.user) ? res.data : res;
  const accessToken: string | undefined = body?.accessToken || body?.token;
  if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') return null;
  const role = (body?.user?.role || getActiveRole() || 'candidate') as UserRole;
  const user: AuthUser = {
    id: body?.user?.id,
    email: body?.user?.email || getUserEmail() || '',
    role,
    tenantId: body?.user?.tenantId || getTenantId() || undefined,
  };
  return { accessToken, refreshToken: body?.refreshToken, user, fallback: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token || isTokenExpired(token)) {
      clearSession();
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.AUTH.ME);
      const me = (res as any)?.data || res;
      if (me?.email || me?.role) {
        setUser({
          id: me.id,
          email: me.email || getUserEmail() || '',
          role: (me.role || getActiveRole() || 'candidate') as UserRole,
          tenantId: me.tenantId || getTenantId() || undefined,
        });
      } else {
        // /me unavailable but token present — keep lightweight session from storage
        const role = getActiveRole();
        const email = getUserEmail();
        if (role && email) setUser({ email, role, tenantId: getTenantId() || undefined });
        else setUser(null);
      }
    } catch {
      // Backend unreachable: do NOT fabricate a session. Keep existing storage-based session
      // only if it was previously validated; otherwise force re-login.
      const role = getActiveRole();
      const email = getUserEmail();
      if (role && email && user) {
        // keep current user
      } else if (!user) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login: AuthContextValue['login'] = useCallback(async ({ email, password, role }) => {
    // Throws on failure — callers must surface the error. NEVER fabricate a token here.
    const res = await apiClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, { email, password, role });
    const parsed = normalizeLoginResponse(res);
    if (!parsed) {
      throw new Error('Invalid credentials or server response. Please try again.');
    }
    persistSession({
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      role: (parsed.user.role || role) as UserRole,
      tenantId: parsed.user.tenantId,
      email: parsed.user.email || email,
    });
    clearPermissionsCache();
    setUser({ ...parsed.user, email: parsed.user.email || email, role: (parsed.user.role || role) as UserRole });
  }, []);

  const logout: AuthContextValue['logout'] = useCallback(async (reason) => {
    const email = getUserEmail();
    const tenantId = getTenantId();
    try {
      if (getAccessToken()) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { email, tenantId, reason: reason || 'USER_SIGN_OUT' });
      }
    } catch {
      // Server logout best-effort; local session is always cleared below.
    } finally {
      clearSession();
      clearPermissionsCache();
      setUser(null);
      try {
        await apiClient.logout(reason || 'sign_out');
      } catch {
        window.location.href = '/login';
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user || (!isLoading && !!getAccessToken() && !isTokenExpired(getAccessToken())), isLoading, login, logout, refreshProfile }),
    [user, isLoading, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

let permsCache: { email: string; permissions: string[] } | null = null;

/** Effective server-resolved permissions (§4.2 template ± exceptions). Null while loading. */
export function usePermissions(): string[] | null {
  const { isAuthenticated } = useAuth();
  const [perms, setPerms] = useState<string[] | null>(permsCache?.permissions || null);
  useEffect(() => {
    if (!isAuthenticated) { setPerms(null); return; }
    let live = true;
    (async () => {
      try {
        const res: any = await apiClient.get<any>('/api/v1/permissions');
        const body = (res as { data?: any })?.data ?? res;
        const list: string[] = Array.isArray(body?.permissions) ? body.permissions : [];
        permsCache = { email: body?.email || '', permissions: list };
        if (live) setPerms(list);
      } catch {
        if (live) setPerms([]);
      }
    })();
    return () => { live = false; };
  }, [isAuthenticated]);
  return perms;
}

/** Gate UI affordances on an explicit permission. Hides (never disables-ambiguously) when lacking. */
export function useCan(permission: string): boolean {
  const perms = usePermissions();
  if (perms === null) return false;
  return perms.includes(permission);
}

export function clearPermissionsCache() {
  permsCache = null;
}
