import { Router, Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, requirePermission, ctxOf, tenantOf } from '../middleware/rbac.js';
import { invoiceSchema, paymentSchema, commissionAgreementSchema, paginate, paged } from '../validate/schemas.js';
import { emit, claimIdempotency } from '../events/bus.js';
import { usageSummary, evaluate, consumeQuota } from '../domain/entitlements.js';

export const commercialRouter = Router();

// ---- Plans & subscriptions ----
commercialRouter.get('/plans', requireAuth(), (_req, res) => {
  res.json({ success: true, data: loadDb().plans });
});
commercialRouter.post('/plans', requireAuth(['superadmin','platform_owner']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const { name, target, interval, price, currency, entitlements, status } = req.body || {};
  if (!name || price === undefined) return res.status(400).json({ success: false, message: 'name + price required.' });
  const p = { id: uid('PLAN'), name: String(name), target: target || 'company', interval: interval || 'monthly', price: Number(price), currency: currency || 'INR', entitlements: entitlements && typeof entitlements === 'object' ? entitlements : {}, version: 1, status: status === 'Archived' ? 'Archived' : 'Active', createdAt: nowIso() };
  loadDb().plans.unshift(p); audit(ctxOf(req).email, `PLAN_CREATED:${p.id}`, 'TNT-GLOBAL', 'plan', p.id, req.ip); persist();
  res.status(201).json({ success: true, data: p });
});
commercialRouter.get('/subscriptions', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().subscriptions as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((s) => s.orgId === ctx.tenantId);
  res.json({ success: true, data: rows });
});
commercialRouter.post('/subscriptions', requireAuth(['superadmin','platform_owner','employer','company_admin']), (req: Request, res: Response) => {
  const { orgId, planId } = req.body || {};
  if (!orgId || !planId) return res.status(400).json({ success: false, message: 'orgId + planId required.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && orgId !== ctx.tenantId) return res.status(403).json({ success: false, message: 'You can only subscribe your own organization.' });
  const db = loadDb(); const plan: any = db.plans.find((p: any) => p.id === planId);
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
  const sub = { id: uid('SUB'), orgId, planId, planVersion: plan.version || 1, planSnapshot: { ...plan }, status: 'Trial', startDate: nowIso(), trialEnd: new Date(Date.now() + 14 * 864e5).toISOString(), renewalDate: new Date(Date.now() + 30 * 864e5).toISOString(), price: plan.price, currency: plan.currency || 'INR', autoRenew: true, createdAt: nowIso() };
  db.subscriptions.unshift(sub);
  db.subscriptionChanges.unshift({ id: uid('SUBC'), subscriptionId: sub.id, change: 'created', createdAt: nowIso() });
  audit(ctxOf(req).email, `SUBSCRIPTION_CREATED:${sub.id}`, orgId, 'subscription', sub.id, req.ip); persist();
  emit('subscription.activated', sub, orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: sub });
});
commercialRouter.patch('/subscriptions/:id/status', requireAuth(['superadmin','platform_owner','finance_admin']), (req, res) => {
  const db = loadDb(); const s: any = db.subscriptions.find((x: any) => x.id === req.params.id);
  if (!s) return res.status(404).json({ success: false, message: 'Not found.' });
  const allowed = ['Trial','Active','Renewal Due','Past Due','Grace Period','Suspended','Cancelled','Expired'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: `Status must be one of ${allowed.join(', ')}` });
  s.status = req.body.status; s.updatedAt = nowIso();
  db.subscriptionChanges.unshift({ id: uid('SUBC'), subscriptionId: s.id, change: s.status, reason: req.body.reason || '', createdAt: nowIso() });
  audit(ctxOf(req).email, `SUBSCRIPTION_STATUS:${s.id}->${s.status}`, s.orgId, 'subscription', s.id, req.ip); persist();
  res.json({ success: true, data: s });
});
commercialRouter.get('/usage', requireAuth(), (req, res) => {
  res.json({ success: true, data: usageSummary(tenantOf(req)) });
});

// ---- Outreach (quota-guarded §8.7) ----
commercialRouter.post('/outreach', requireAuth(['employer','company_admin','company_recruiter','superadmin']), (req: Request, res: Response) => {
  const ctx = ctxOf(req); const t = tenantOf(req);
  const recipients: string[] = req.body.recipients || [];
  if (!recipients.length) return res.status(400).json({ success: false, message: 'recipients[] required.' });
  try {
    evaluate(t, 'outreach.send');
  } catch (e: any) { return res.status(e.status || 403).json({ success: false, message: e.message, code: e.code }); }
  const db = loadDb();
  const camp = { id: uid('CMP'), orgId: t, name: req.body.name || 'Untitled campaign', subject: req.body.subject || '', template: req.body.template || '', status: 'Queued', total: recipients.length, createdAt: nowIso(), createdBy: ctx.email };
  db.campaigns.unshift(camp);
  recipients.forEach((email: string) => {
    const key = `outreach:${camp.id}:${email}`;
    if (claimIdempotency(key)) {
      consumeQuota(t, ctx.email, 'outreach.monthly_limit', 1, camp.id, key + ':quota');
      db.campaignRecipients.unshift({ id: uid('CMPR'), campaignId: camp.id, email, status: 'Queued', createdAt: nowIso() });
      db.campaignEvents.unshift({ id: uid('CMPE'), campaignId: camp.id, email, event: 'queued', createdAt: nowIso() });
    }
  });
  camp.status = 'Sent';
  audit(ctx.email, `OUTREACH_SENT:${camp.id}x${recipients.length}`, t, 'campaign', camp.id, req.ip); persist();
  res.status(201).json({ success: true, data: camp });
});
commercialRouter.get('/outreach', requireAuth(), (req, res) => {
  const t = tenantOf(req); const ctx = ctxOf(req);
  let rows = loadDb().campaigns as any[];
  if (!['superadmin','platform_owner'].includes(ctx.role)) rows = rows.filter((c) => c.orgId === t);
  res.json({ success: true, data: rows });
});

// ---- Invoices (immutable after issue §6.10) ----
commercialRouter.get('/invoices', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().invoices as any[];
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role)) rows = rows.filter((i) => i.orgId === ctx.tenantId);
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.post('/invoices', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const parsed = invoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const db = loadDb();
  const subtotal = parsed.data.lines.reduce((a, l) => a + l.qty * l.unit, 0);
  const tax = +((subtotal - parsed.data.discount) * parsed.data.taxRate / 100).toFixed(2);
  const total = +(subtotal - parsed.data.discount + tax).toFixed(2);
  const inv = { id: uid('INV'), number: `INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(4, '0')}`, ...parsed.data, subtotal, tax, total, amountPaid: 0, balance: total, status: 'Issued', issueDate: nowIso(), createdAt: nowIso(), createdBy: ctxOf(req).email };
  db.invoices.unshift(inv);
  parsed.data.lines.forEach((l) => db.invoiceLines.unshift({ id: uid('INVL'), invoiceId: inv.id, ...l }));
  audit(ctxOf(req).email, `INVOICE_ISSUED:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip); persist();
  res.status(201).json({ success: true, data: inv });
});
commercialRouter.patch('/invoices/:id/void', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req, res) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  if (!req.body.reason) return res.status(400).json({ success: false, message: 'Void reason required.' });
  if (['Paid','Void','Credited'].includes(inv.status)) return res.status(422).json({ success: false, message: `Cannot void ${inv.status} invoice. Use credit note.` });
  inv.status = 'Void'; inv.voidReason = String(req.body.reason); inv.voidedAt = nowIso(); inv.voidedBy = ctxOf(req).email;
  audit(ctxOf(req).email, `INVOICE_VOID:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip); persist();
  res.json({ success: true, data: inv });
});
// ---- Refunds (tracked separately from lifecycle, §6.8) ----
commercialRouter.get('/refunds', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  res.json({ success: true, data: loadDb().refunds });
});
commercialRouter.post('/refunds', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('refund'), (req: Request, res: Response) => {
  const db = loadDb();
  const { paymentId, amount, reason } = req.body || {};
  const pay: any = db.payments.find((p: any) => p.id === paymentId);
  if (!pay) return res.status(404).json({ success: false, message: 'Payment not found.' });
  const amt = Number(amount || 0);
  if (!(amt > 0) || amt > Number(pay.amount || 0)) return res.status(400).json({ success: false, message: 'Invalid refund amount.' });
  if (!claimIdempotency(`refund:${paymentId}:${amt}:${reason || ''}`)) return res.status(200).json({ success: true, message: 'Duplicate ignored (idempotent).' });
  const refund = { id: uid('RFD'), paymentId, invoiceId: pay.invoiceId, orgId: pay.orgId, amount: amt, reason: reason || '', status: 'processed', createdAt: nowIso(), by: ctxOf(req).email };
  db.refunds.unshift(refund);
  pay.refundedAmount = Number(pay.refundedAmount || 0) + amt;
  pay.status = pay.refundedAmount >= Number(pay.amount) ? 'refunded' : 'partially_refunded';
  const inv: any = db.invoices.find((i: any) => i.id === pay.invoiceId);
  if (inv) { inv.amountPaid = Math.max(0, Number(inv.amountPaid || 0) - amt); inv.balance = +(Number(inv.total) - inv.amountPaid).toFixed(2); if (inv.balance > 0 && inv.status === 'Paid') inv.status = 'Partially Paid'; }
  audit(ctxOf(req).email, `REFUND_PROCESSED:${refund.id}`, pay.orgId, 'refund', refund.id, req.ip); persist();
  res.status(201).json({ success: true, data: refund });
});

commercialRouter.get('/credit-notes', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  res.json({ success: true, data: loadDb().creditNotes });
});
commercialRouter.get('/allocations', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  res.json({ success: true, data: loadDb().allocations });
});
commercialRouter.get('/subscription-changes', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  res.json({ success: true, data: loadDb().subscriptionChanges });
});
commercialRouter.get('/usage-ledger', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  res.json({ success: true, data: loadDb().usageLedger.slice(0, 200) });
});
commercialRouter.post('/credit-notes', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('refund'), (req: Request, res: Response) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.body.invoiceId);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const cn = { id: uid('CN'), invoiceId: inv.id, amount: Number(req.body.amount || 0), reason: req.body.reason || '', createdAt: nowIso(), by: ctxOf(req).email };
  db.creditNotes.unshift(cn);
  inv.balance = Math.max(0, +(inv.balance - cn.amount).toFixed(2));
  if (inv.balance === 0) inv.status = 'Credited';
  audit(ctxOf(req).email, `CREDIT_NOTE:${cn.id}`, inv.orgId, 'invoice', inv.id, req.ip); persist();
  res.status(201).json({ success: true, data: cn });
});

// ---- Payments (webhook-verified, idempotent §6.9/§15.3) ----
commercialRouter.get('/payments', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().payments as any[];
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role)) rows = rows.filter((p) => p.orgId === ctx.tenantId);
  res.json({ success: true, data: rows });
});
commercialRouter.post('/payments', requireAuth(), (req: Request, res: Response) => {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  if (!claimIdempotency(`pay:${parsed.data.idempotencyKey}`)) return res.status(200).json({ success: true, message: 'Duplicate ignored (idempotent).' });
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === parsed.data.invoiceId);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role) && inv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const pay = { id: uid('PAY'), orgId: inv.orgId, status: 'succeeded', transactionDate: nowIso(), ...parsed.data, createdAt: nowIso() };
  db.payments.unshift(pay);
  db.allocations.unshift({ id: uid('ALC'), paymentId: pay.id, invoiceId: inv.id, amount: parsed.data.amount, createdAt: nowIso() });
  audit(ctxOf(req).email, `PAYMENT_CONFIRMED:${pay.id}`, inv.orgId, 'payment', pay.id, req.ip); persist();
  emit('payment.confirmed', { invoiceId: inv.id, amount: parsed.data.amount }, inv.orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: pay });
});
commercialRouter.post('/payments/webhook', (req: Request, res: Response) => {
  // HMAC verification: signature = hex(hmac_sha256(secret, `${timestamp}.${rawBody}`)).
  // Rejects missing secrets, stale timestamps (>5 min skew), and bad signatures
  // with timing-safe comparison. Legacy plain-secret header no longer accepted.
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ success: false, message: 'Webhook receiver not configured.' });
  const ts = Number(req.headers['x-provider-timestamp'] || 0);
  const sig = String(req.headers['x-provider-signature'] || '');
  if (!ts || Math.abs(Date.now() - ts) > 5 * 60 * 1000) {
    return res.status(401).json({ success: false, message: 'Stale or missing webhook timestamp.' });
  }
  const raw: Buffer = (req as any).rawBody || Buffer.from(JSON.stringify(req.body || {}));
  const expected = createHmac('sha256', secret).update(`${ts}.${raw.toString('utf8')}`).digest('hex');
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(401).json({ success: false, message: 'Invalid webhook signature.' });
  }
  const { invoiceId, amount, reference, idempotencyKey } = req.body || {};
  if (!invoiceId || !amount || !idempotencyKey) return res.status(400).json({ success: false, message: 'invoiceId+amount+idempotencyKey required.' });
  if (!claimIdempotency(`webhook:${idempotencyKey}`)) return res.json({ success: true, message: 'Duplicate webhook ignored.' });
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === invoiceId);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const pay = { id: uid('PAY'), orgId: inv.orgId, invoiceId, amount: Number(amount), provider: 'webhook', reference, status: 'succeeded', transactionDate: nowIso(), createdAt: nowIso() };
  db.payments.unshift(pay);
  db.allocations.unshift({ id: uid('ALC'), paymentId: pay.id, invoiceId: inv.id, amount: Number(amount), createdAt: nowIso(), source: 'webhook' });
  audit('payment-provider', `PAYMENT_WEBHOOK:${pay.id}`, inv.orgId, 'payment', pay.id, req.ip); persist();
  emit('payment.confirmed', { invoiceId, amount: Number(amount) }, inv.orgId, 'payment-provider');
  res.json({ success: true, data: pay });
});

// ---- Commissions & payouts (separate ledgers §6.11/§9.5) ----
commercialRouter.post('/commission-agreements', requireAuth(['superadmin','platform_owner','finance_admin','employer','company_admin']), (req: Request, res: Response) => {
  const parsed = commissionAgreementSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const ag = { id: uid('AGR'), status: 'Approved', effectiveDate: nowIso(), createdAt: nowIso(), createdBy: ctxOf(req).email, ...parsed.data };
  loadDb().commissionAgreements.unshift(ag); audit(ctxOf(req).email, `COMMISSION_AGREEMENT:${ag.id}`, ag.orgId, 'commission', ag.id, req.ip); persist();
  res.status(201).json({ success: true, data: ag });
});
commercialRouter.get('/commission-agreements', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().commissionAgreements as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((a) => a.orgId === ctx.tenantId);
  res.json({ success: true, data: rows });
});
commercialRouter.get('/commissions', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().commissions as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((c) => c.orgId === ctx.tenantId || c.agencyId === ctx.tenantId);
  res.json({ success: true, data: rows });
});
commercialRouter.patch('/commissions/:id/approve', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('approve'), (req, res) => {
  const db = loadDb(); const c: any = db.commissions.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  c.approvalStatus = 'Approved'; c.approvedAt = nowIso(); c.approvedBy = ctxOf(req).email;
  audit(ctxOf(req).email, `COMMISSION_APPROVED:${c.id}`, c.orgId, 'commission', c.id, req.ip); persist();
  emit('commission.approved', c, c.orgId, ctxOf(req).email);
  res.json({ success: true, data: c });
});
commercialRouter.post('/payouts', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const db = loadDb(); const com: any = db.commissions.find((c: any) => c.id === req.body.commissionId);
  if (!com) return res.status(404).json({ success: false, message: 'Commission not found.' });
  if (com.approvalStatus !== 'Approved') return res.status(422).json({ success: false, message: 'Approve commission first.' });
  const payout = { id: uid('PO'), commissionId: com.id, amount: com.net, status: 'Processed', settlementDate: nowIso(), createdAt: nowIso(), by: ctxOf(req).email };
  db.payouts.unshift(payout); com.paymentStatus = 'Paid';
  audit(ctxOf(req).email, `PAYOUT_PROCESSED:${payout.id}`, com.orgId, 'payout', payout.id, req.ip); persist();
  res.status(201).json({ success: true, data: payout });
});
commercialRouter.get('/payouts', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().payouts as any[];
  // Payouts carry the commission's org scope; non-finance roles see only their org.
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role)) {
    const comIds = new Set(loadDb().commissions.filter((c: any) => c.orgId === ctx.tenantId || c.agencyId === ctx.tenantId).map((c: any) => c.id));
    rows = rows.filter((p: any) => comIds.has(p.commissionId));
  }
  res.json({ success: true, data: rows });
});
commercialRouter.get('/reconciliation', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  const db = loadDb();
  const totalInvoiced = db.invoices.reduce((a: number, i: any) => a + Number(i.total || 0), 0);
  const totalPaid = db.payments.reduce((a: number, p: any) => a + Number(p.amount || 0), 0);
  res.json({ success: true, data: { totalInvoiced, totalPaid, outstanding: +(totalInvoiced - totalPaid).toFixed(2), invoices: db.invoices.length, payments: db.payments.length } });
});
