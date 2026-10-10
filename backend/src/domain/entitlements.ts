import { loadDb, persist, uid, nowIso } from '../db/store.js';

/** Entitlement evaluation §12.2 (8 steps). Throws 402/403 with upgrade hint. */
export function evaluate(orgId: string, key: string, qty = 1): { allowed: true; remaining: number } {
  const db = loadDb();
  const sub = db.subscriptions.find((s: any) => s.orgId === orgId && ['Active','Trial','Grace Period'].includes(s.status))
    || db.subscriptions.find((s: any) => s.orgId === orgId);
  if (!sub) {
    const err: any = new Error('No active subscription. Please subscribe to continue.');
    err.status = 402; err.code = 'SUBSCRIPTION_REQUIRED'; throw err;
  }
  const plan = db.plans.find((p: any) => p.id === sub.planId);
  const allowance = plan?.entitlements?.[key];
  if (allowance === false || allowance === undefined) {
    const err: any = new Error(`Feature '${key}' is not included in plan '${plan?.name || sub.planId}'. Upgrade required.`);
    err.status = 403; err.code = 'ENTITLEMENT_LOCKED'; throw err;
  }
  if (typeof allowance === 'number') {
    const period = new Date().toISOString().slice(0, 7);
    const used = db.usageLedger.filter((u: any) => u.orgId === orgId && u.entitlement === key && u.period === period && !u.reversed).reduce((a: number, u: any) => a + Number(u.qty || 0), 0);
    if (used + qty > allowance) {
      const err: any = new Error(`Quota exhausted for '${key}': ${used}/${allowance} used. Upgrade or wait for reset.`);
      err.status = 429; err.code = 'QUOTA_EXHAUSTED'; throw err;
    }
    return { allowed: true, remaining: allowance - used - qty };
  }
  return { allowed: true, remaining: -1 };
}

/** Concurrency-safe quota reservation with idempotency key (§12.3). */
export function consumeQuota(orgId: string, userEmail: string, entitlement: string, qty: number, resourceRef: string, idemKey: string): void {
  const db = loadDb();
  if (db.idempotency.find((x: any) => x.key === idemKey)) return; // safe retry
  evaluate(orgId, entitlement, qty);
  db.idempotency.unshift({ key: idemKey, createdAt: nowIso() });
  db.usageLedger.unshift({ id: uid('USE'), orgId, userEmail, entitlement, resourceRef, qty, period: new Date().toISOString().slice(0, 7), idempotencyKey: idemKey, createdAt: nowIso() });
  persist();
}

export function usageSummary(orgId: string): any {
  const db = loadDb();
  const sub = db.subscriptions.find((s: any) => s.orgId === orgId);
  const plan = db.plans.find((p: any) => p.id === sub?.planId);
  const period = new Date().toISOString().slice(0, 7);
  const out: any = {};
  for (const [k, v] of Object.entries((plan?.entitlements || {}) as Record<string, any>)) {
    if (typeof v === 'number') {
      const used = db.usageLedger.filter((u: any) => u.orgId === orgId && u.entitlement === k && u.period === period && !u.reversed).reduce((a: number, u: any) => a + Number(u.qty || 0), 0);
      out[k] = { used, limit: v, remaining: v - used, period };
    } else out[k] = { enabled: !!v };
  }
  return { plan: plan?.name, subscription: sub?.status, period, usage: out };
}
