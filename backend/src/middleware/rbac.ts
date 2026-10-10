import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../auth/password.js';
import { loadDb } from '../db/store.js';

/** All 16 spec roles + 4 legacy aliases. */
export const ALL_ROLES = [
  'platform_owner','superadmin','operations_admin','finance_admin','sales_admin','support_admin',
  'company_admin','hiring_manager','company_recruiter','internal_recruiter','bda','sales_manager',
  'candidate','agency_admin','agency_recruiter','finance_staff',
  'employee','employer','recruiter','vendor',
] as const;

export const PERMISSIONS = [
  'view','create','edit','archive','delete','approve','reject','suspend','restore',
  'assign','export','manage_billing','manage_permissions','view_sensitive_fields',
  'reconcile','refund','adjust_commission',
] as const;

/** Role → permission template (§4.2). Sensitive ones granted explicitly only. */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  platform_owner: [...PERMISSIONS],
  superadmin: [...PERMISSIONS],
  operations_admin: ['view','create','edit','archive','approve','reject','suspend','restore','assign','export'],
  finance_admin: ['view','create','edit','manage_billing','reconcile','refund','export','view_sensitive_fields'],
  sales_admin: ['view','create','edit','assign','export'],
  support_admin: ['view','assign'],
  company_admin: ['view','create','edit','archive','assign','manage_billing','export'],
  hiring_manager: ['view','create','edit','approve','reject','assign'],
  company_recruiter: ['view','create','edit','assign','export'],
  internal_recruiter: ['view','create','edit','assign','export'],
  bda: ['view','create','edit','assign'],
  sales_manager: ['view','create','edit','assign','export','approve'],
  candidate: ['view','create','edit'],
  agency_admin: ['view','create','edit','assign','export'],
  agency_recruiter: ['view','create','edit'],
  finance_staff: ['view','create','edit','reconcile'],
  // legacy aliases
  employee: ['view','create','edit','archive','approve','reject','suspend','restore','assign','export'],
  employer: ['view','create','edit','archive','assign','manage_billing','export'],
  recruiter: ['view','create','edit','assign','export'],
  vendor: ['view','create','edit','assign','export'],
};

export interface AuthCtx { id: string; email: string; role: string; tenantId: string; permissions: string[] }

export function ctxOf(req: Request): AuthCtx {
  return (req as any).auth as AuthCtx;
}

/** Template permissions ± per-user exceptions (§4.2 controlled exceptions).
 *  A stored role record overrides the static template when it carries permissions. */
export function effectivePermissions(role: string, email: string): string[] {
  let template: string[] = ROLE_PERMISSIONS[role] || ['view'];
  try {
    const rec: any = (loadDb().roles as any[]).find((r: any) => r.id === role);
    if (rec && Array.isArray(rec.permissions) && rec.permissions.length > 0) template = rec.permissions;
  } catch { /* fall back to static template */ }
  const base = new Set(template);
  try {
    const db = loadDb();
    for (const o of (db.userRoles as any[]).filter((x: any) => String(x.email).toLowerCase() === String(email).toLowerCase())) {
      if (o.effect === 'grant') base.add(o.permission);
      else if (o.effect === 'revoke') base.delete(o.permission);
    }
  } catch { /* permissions must never fail closed on store errors beyond template */ }
  return [...base];
}

const PLATFORM_ROLES = ['superadmin', 'platform_owner'];

function suspended(email: string): boolean {
  const db = loadDb();
  const u = db.users.find((x: any) => String(x.email).toLowerCase() === String(email).toLowerCase());
  if (!u) return false;
  if (String(u.status).toLowerCase() !== 'active') return true;
  // Suspended/closed organization suspends access too (except platform roles).
  if (PLATFORM_ROLES.includes(u.role)) return false;
  const org = db.organizations.find((o: any) => o.id === u.tenantId);
  if (org && ['Suspended', 'Closed'].includes(String(org.accountStatus || org.status))) return true;
  return false;
}

/** Verifies real JWT, revocation, suspension. Attaches AuthCtx. */
export function requireAuth(allowedRoles?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Legacy compat: old opaque NEXA-* tokens issued before upgrade
    const header = String(req.headers.authorization || '');
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    if (token.startsWith('NEXA-')) {
      const sess = loadDb().sessions.find((s: any) => s.accessToken === token);
      if (!sess) return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
      if (suspended(sess.email)) return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
      if (allowedRoles && !allowedRoles.includes(sess.role)) {
        return res.status(403).json({ success: false, message: `Access denied for role '${sess.role}'.` });
      }
      (req as any).auth = { id: sess.userId, email: sess.email, role: sess.role, tenantId: sess.tenantId, permissions: effectivePermissions(sess.role, sess.email) };
      return next();
    }
    try {
      const claims = verifyAccess(token);
      if (!claims || claims.type !== 'access') throw new Error('bad token');
      if (suspended(claims.email)) return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
      if (allowedRoles && !allowedRoles.includes(claims.role)) {
        return res.status(403).json({ success: false, message: `Access denied for role '${claims.role}'.` });
      }
      (req as any).auth = { id: claims.sub, email: claims.email, role: claims.role, tenantId: claims.tenantId, permissions: effectivePermissions(claims.role, claims.email) };
      return next();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired token. Please sign in again.' });
    }
  };
}

/** Requires explicit permission (§4.2). */
export function requirePermission(...perms: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ctx = (req as any).auth as AuthCtx | undefined;
    if (!ctx) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const ok = perms.every((p) => ctx.permissions.includes(p));
    if (!ok) return res.status(403).json({ success: false, message: `Missing permission: ${perms.join(', ')}` });
    next();
  };
}

/** Tenant isolation: platform roles bypass; others locked to own tenant unless superadmin. */
export function tenantOf(req: Request): string {
  const ctx = (req as any).auth as AuthCtx | undefined;
  const header = String(req.headers['x-tenant-id'] || (req.query as any).tenant || (req.body as any)?.tenantId || '');
  if (!ctx) return header;
  if (['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role)) {
    return header || ctx.tenantId;
  }
  return ctx.tenantId; // ignore client claim — server is source of truth
}

/** Strip sensitive fields unless caller has view_sensitive_fields. */
export function maskCandidate<T extends Record<string, any>>(row: T, canSeeSensitive: boolean): T {
  if (canSeeSensitive) return row;
  const { phone, currentCtc, email, ...rest } = row as any;
  return { ...rest, ...(email ? { email: String(email).replace(/(^.).*(@.*$)/, '$1***$2') } : {}), phone: phone ? '**********' : undefined, currentCtc: currentCtc ? 'Restricted' : undefined } as T;
}

export function hasPerm(role: string, perm: string): boolean {
  return (ROLE_PERMISSIONS[role] || []).includes(perm);
}
