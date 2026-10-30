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
    // Legacy compat + custom proxy headers (handles Azure Static Web Apps proxying)
    const header = String(
      req.headers['x-access-token'] ||
      req.headers['x-nexa-authorization'] ||
      req.headers['x-authorization'] ||
      req.headers.authorization ||
      ''
    );
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : header.trim();
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    if (token.startsWith('NEXA-')) {
      const sess = loadDb().sessions.find((s: any) => s.accessToken === token);
      if (!sess) return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
      if (sess.createdAt && Date.now() - new Date(sess.createdAt).getTime() > 24 * 3600 * 1000) {
        return res.status(401).json({ success: false, message: 'Legacy session expired. Please sign in again.' });
      }
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
      // Immediate revocation: logout/revoke-all writes the token's jti to the
      // sessions table, so a signed access token stops working without waiting
      // for its 15-minute TTL.
      if ((claims as any).jti) {
        const revoked = loadDb().sessions.some((s: any) => s.revokedJti === (claims as any).jti);
        if (revoked) return res.status(401).json({ success: false, message: 'Session revoked. Please sign in again.' });
      }
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

/**
 * Roles that may read across every tenant with no scope filter.
 * `employee` is deliberately NOT here: an internal ops employee is a tenant
 * operator, scoped to the tenant they are currently acting on (X-Tenant-ID).
 */
export const ALL_TENANT_ROLES = ['superadmin', 'platform_owner', 'operations_admin'] as const;

export function isAllTenant(role: string): boolean {
  return (ALL_TENANT_ROLES as readonly string[]).includes(role);
}

/**
 * Active tenant for this request. Platform roles may select any tenant through
 * the "Act as" switcher (X-Tenant-ID). Everyone else is pinned to the tenant
 * baked into their token — the client claim is never trusted.
 */
export function tenantOf(req: Request): string {
  const ctx = (req as any).auth as AuthCtx | undefined;
  const header = String(req.headers['x-tenant-id'] || (req.query as any).tenant || (req.body as any)?.tenantId || '');
  if (!ctx) return header;
  if (isAllTenant(ctx.role) || ctx.role === 'employee') {
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

/**
 * Phase 1 — finance deny-by-default (new spec §3.3).
 * Roles here cannot read finance ledgers (commissions/invoices/payouts/payments,
 * agreements, fee slabs, adjustments, reconciliation) unless they hold an
 * explicit finance grant (manage_billing / reconcile / adjust_commission / refund).
 * Server is authoritative; UI hiding is secondary.
 */
export const FINANCE_BLOCKED_ROLES = [
  'recruiter',
  'bda',
  'sales_admin',
  'sales_manager',
  'agency_recruiter',
  'support_admin',
  'internal_recruiter',
  'candidate',
] as const;
// Platform delivery staff see finance RECORDS (read-only) so timesheets/payroll stay
// synced across the suite. Mutations still require manage_billing (finance/superadmin).
// Deny-by-default (§3.3): everyone else — including internal_recruiter and candidate —
// is refused at the gate; a finance grant is required to read these ledgers.
export const FINANCE_VIEWERS = [
  'superadmin', 'platform_owner', 'finance_admin', 'finance_staff',
  'operations_admin',
] as const;

const FINANCE_GRANTS = ['manage_billing', 'reconcile', 'adjust_commission', 'refund'];

export function denyFinanceUnlessGranted(req: Request, res: Response, next: NextFunction) {
  const ctx = (req as any).auth as AuthCtx | undefined;
  if (!ctx) return res.status(401).json({ success: false, message: 'Authentication required.' });
  const blocked = (FINANCE_BLOCKED_ROLES as readonly string[]).includes(ctx.role);
  if (!blocked) return next();
  const granted = ctx.permissions.some((p) => FINANCE_GRANTS.includes(p));
  if (granted) return next();
  return res.status(403).json({
    success: false,
    code: 'FINANCE_FORBIDDEN',
    message: `Role '${ctx.role}' cannot access finance records. Ask a finance-authorized admin for access.`,
  });
}
