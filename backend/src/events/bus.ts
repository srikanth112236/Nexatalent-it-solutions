import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';

/** Outbox event (§11). Persisted so no event is lost on crash. */
export function emit(type: string, payload: any, tenantId = 'TNT-GLOBAL', actor = 'system'): void {
  const db = loadDb();
  db.outbox.unshift({ id: uid('EVT'), type, payload, tenantId, actor, status: 'pending', attempts: 0, createdAt: nowIso() });
  if (db.outbox.length > 2000) db.outbox.length = 2000;
  // Synchronous in-process consumers (idempotent by design)
  try { consume(type, payload, tenantId, actor); } catch (e) { markFailed(type, String(e)); }
  persist();
}

function markFailed(type: string, err: string): void {
  const db = loadDb();
  const e = db.outbox.find((x: any) => x.type === type && x.status === 'pending');
  if (e) { e.status = 'failed'; e.error = err; e.attempts += 1; }
}

function consume(type: string, p: any, tenantId: string, actor: string): void {
  const db = loadDb();
  const done = (_t: string) => { const e = db.outbox.find((x: any) => x.type === type && x.status === 'pending'); if (e) { e.status = 'done'; } };
  switch (type) {
    case 'interview.scheduled': {
      // Auto-enable eligible chat (§7.8 / §13)
      const convId = 'CONV-' + String(p.applicationId).slice(-6);
      if (!db.conversations.find((c: any) => c.applicationId === p.applicationId)) {
        db.conversations.unshift({ id: convId, applicationId: p.applicationId, jobId: p.jobId, companyId: p.companyId || tenantId, candidateId: p.candidateEmail, status: 'active', createdAt: nowIso(), lastMessageAt: nowIso() });
        db.messages.unshift({ id: uid('MSG'), conversationId: convId, sender: 'system', type: 'system', body: `Interview ${p.round} scheduled for ${p.scheduledAt}. Chat enabled.`, createdAt: nowIso() });
      }
      notify(p.candidateEmail, 'interview', `Interview scheduled: ${p.round} @ ${p.scheduledAt}`, tenantId);
      notifyCompany(p.companyId || tenantId, `Interview scheduled for application ${p.applicationId}`);
      done(type); break;
    }
    case 'application.stage': {
      notify(p.candidateEmail, 'application', `Your application moved to: ${p.stage}`, tenantId);
      if (['Selected','Offer','Hired'].includes(p.stage)) evaluateCommission(p);
      done(type); break;
    }
    case 'placement.joined': {
      evaluateCommission({ ...p, stage: 'Hired' });
      done(type); break;
    }
    case 'payment.confirmed': {
      const inv = db.invoices.find((i: any) => i.id === p.invoiceId);
      if (inv) { inv.amountPaid = Math.min(inv.total, (inv.amountPaid || 0) + p.amount); inv.balance = +(inv.total - inv.amountPaid).toFixed(2); inv.status = inv.balance <= 0 ? 'Paid' : 'Partially Paid'; }
      done(type); break;
    }
    case 'commission.approved': {
      // Creates receivable + payable legs separately (§6.11)
      notifyCompany(tenantId, `Commission ${p.id || ''} approved — ₹${p.total || p.net || 0}.`);
      notifySuper(`Commission ${p.id || ''} approved (${tenantId}) — ₹${p.total || p.net || 0}.`);
      done(type); break;
    }
    default: done(type);
  }
  audit(actor, `EVENT:${type}`, tenantId, 'event', type, '127.0.0.1');
}

function trim<T>(arr: T[], cap: number): void {
  if (arr.length > cap) arr.length = cap;
}
function notify(recipient: string, kind: string, body: string, tenantId: string): void {
  const db = loadDb();
  db.notifications.unshift({ id: uid('NOTIF'), recipient, kind, body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId });
  trim(db.notifications, 2000);
}

function notifySuper(body: string): void {
  const db = loadDb();
  db.notifications.unshift({ id: uid('NOTIF'), recipient: 'superadmin', kind: 'commercial', body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: 'TNT-GLOBAL' });
  trim(db.notifications, 2000);
}
function notifyCompany(companyId: string, body: string): void {
  const db = loadDb();
  db.notifications.unshift({ id: uid('NOTIF'), recipient: `company:${companyId}`, kind: 'ats', body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: companyId });
  trim(db.notifications, 2000);
}

/** Placement-triggered commission creation — dedupe by placement+trigger (§6.11). */
export function evaluateCommission(p: { placementId?: string; applicationId?: string; jobId?: string; orgId?: string; candidateEmail?: string; stage?: string }): void {
  const db = loadDb();
  const matching = db.commissionAgreements.filter((a: any) => a.orgId === p.orgId && a.status === 'Approved' && a.companyAccepted && (!a.jobId || !p.jobId || a.jobId === p.jobId));
  // One receivable per hire (job-specific company agreement wins, else the org default);
  // every matching agency agreement still mints its own payable leg.
  const company = matching.filter((a: any) => !a.agencyId);
  const picked = company.find((a: any) => a.jobId && p.jobId && a.jobId === p.jobId) || company.find((a: any) => !a.jobId);
  const agreements = [...(picked ? [picked] : []), ...matching.filter((a: any) => a.agencyId)];
  for (const a of agreements) {
    const trigger: string = a.trigger || 'Joined';
    const fired = (trigger === 'Joined' && (p.stage === 'Hired' || p.stage === 'Joined')) || (trigger === 'Offer Accepted' && ['Offer','Selected'].includes(p.stage || ''));
    if (!fired) continue;
    const key = `${p.applicationId || p.placementId}::${trigger}::${a.id}`;
    if (db.idempotency.find((x: any) => x.key === key)) continue;
    const basis = Number((p as any).feeBasis || (a as any).feeBasis || (a as any).fixedFee || 100000);
    const basisType = (a as any).basisType === 'monthly_ctc' ? 'monthly_ctc' : 'annual_ctc';
    const months = basisType === 'monthly_ctc' ? Number((a as any).contractMonths || 12) : 1;
    const gross = a.feeModel === 'fixed' ? Number(a.fixedFee || 0) : +(basis * months * Number(a.rate || 8.33) / 100).toFixed(2);
    db.idempotency.unshift({ key, createdAt: nowIso() });
    trim(db.idempotency, 5000);
    db.commissions.unshift({ id: uid('COM'), agreementId: a.id, placementId: p.placementId || p.applicationId, applicationId: p.applicationId || null, jobId: p.jobId, orgId: p.orgId, agencyId: (a as any).agencyId || null, candidateEmail: p.candidateEmail, trigger, triggerDate: nowIso(), triggerEvidence: `placement:${p.placementId || p.applicationId}`, feeBasis: basis, basisType, contractMonths: months, rate: a.rate, feeModel: a.feeModel || 'percentage', agreementSnapshot: { hiringType: a.hiringType, rate: a.rate, feeModel: a.feeModel || 'percentage', basisType, contractMonths: months, trigger, paymentTermsDays: a.paymentTermsDays ?? 30, replacementDays: a.replacementDays ?? 90 }, gross, adjustments: 0, tax: +(gross * 0.18).toFixed(2), total: +(gross * 1.18).toFixed(2), net: +(gross * 1.18).toFixed(2), approvalStatus: 'Pending', paymentStatus: 'Unpaid', createdAt: nowIso() });
  }
}

/** Idempotency guard for payments/quota/notifications (§11.3). */
export function claimIdempotency(key: string): boolean {
  const db = loadDb();
  if (db.idempotency.find((x: any) => x.key === key)) return false;
  db.idempotency.unshift({ key, createdAt: nowIso() });
  trim(db.idempotency, 5000);
  return true;
}
