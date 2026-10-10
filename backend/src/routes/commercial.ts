import { Router, Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, requirePermission, ctxOf, tenantOf } from '../middleware/rbac.js';
import { invoiceSchema, paymentSchema, commissionAgreementSchema, agreementTemplateSchema, feeSlabSchema, paginate, paged } from '../validate/schemas.js';
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
commercialRouter.get('/plans/:id/versions', requireAuth(['superadmin','platform_owner','finance_admin']), (req, res) => {
  res.json({ success: true, data: loadDb().planVersions.filter((v: any) => v.planId === req.params.id) });
});
commercialRouter.post('/plans/:id/new-version', requireAuth(['superadmin','platform_owner']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const db = loadDb(); const p: any = db.plans.find((x: any) => x.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Plan not found.' });
  if (p.status === 'Archived') return res.status(422).json({ success: false, message: 'Archived plans cannot be versioned. Clone into a new plan instead.' });
  const b: any = req.body || {};
  db.planVersions.unshift({ id: uid('PLV'), planId: p.id, version: p.version || 1, snapshot: { ...p }, createdAt: nowIso(), by: ctxOf(req).email });
  if (b.price !== undefined) p.price = Number(b.price);
  if (b.interval) p.interval = String(b.interval);
  if (b.entitlements && typeof b.entitlements === 'object') p.entitlements = b.entitlements;
  if (b.status && ['Active','Archived'].includes(b.status)) p.status = b.status;
  p.version = (p.version || 1) + 1; p.updatedAt = nowIso();
  audit(ctxOf(req).email, `PLAN_VERSIONED:${p.id}:v${p.version}`, 'TNT-GLOBAL', 'plan', p.id, req.ip); persist();
  res.status(201).json({ success: true, data: p });
});
commercialRouter.patch('/plans/:id/archive', requireAuth(['superadmin','platform_owner']), requirePermission('manage_billing'), (req, res) => {
  const db = loadDb(); const p: any = db.plans.find((x: any) => x.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Plan not found.' });
  if ((db.subscriptions as any[]).some((s) => s.planId === p.id && ['Trial','Active','Past Due','Grace Period'].includes(s.status)) && !req.body.force) {
    return res.status(422).json({ success: false, message: 'Active subscriptions still reference this plan. Pass force:true to archive anyway (existing terms are snapshotted).' });
  }
  p.status = 'Archived'; p.updatedAt = nowIso();
  audit(ctxOf(req).email, `PLAN_ARCHIVED:${p.id}`, 'TNT-GLOBAL', 'plan', p.id, req.ip); persist();
  res.json({ success: true, data: p });
});
commercialRouter.get('/subscriptions', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().subscriptions as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((s) => s.orgId === ctx.tenantId);
  res.json({ success: true, data: rows });
});
commercialRouter.post('/subscriptions', requireAuth(['superadmin','platform_owner','employer','company_admin']), (req: Request, res: Response) => {
  const { orgId, planId, discount, autoRenew } = req.body || {};
  if (!orgId || !planId) return res.status(400).json({ success: false, message: 'orgId + planId required.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && orgId !== ctx.tenantId) return res.status(403).json({ success: false, message: 'You can only subscribe your own organization.' });
  const db = loadDb(); const plan: any = db.plans.find((p: any) => p.id === planId);
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
  if (plan.status === 'Archived') return res.status(422).json({ success: false, message: 'Plan is archived. Pick an active plan version.' });
  const sub = { id: uid('SUB'), orgId, planId, planVersion: plan.version || 1, planSnapshot: { ...plan }, status: 'Trial', startDate: nowIso(), trialEnd: new Date(Date.now() + 14 * 864e5).toISOString(), renewalDate: new Date(Date.now() + 30 * 864e5).toISOString(), price: plan.price, currency: plan.currency || 'INR', discount: Number(discount || 0), autoRenew: autoRenew !== false, createdAt: nowIso() };
  db.subscriptions.unshift(sub);
  db.subscriptionChanges.unshift({ id: uid('SUBC'), subscriptionId: sub.id, change: 'created', createdAt: nowIso() });
  audit(ctxOf(req).email, `SUBSCRIPTION_CREATED:${sub.id}`, orgId, 'subscription', sub.id, req.ip); persist();
  emit('subscription.activated', sub, orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: sub });
});
commercialRouter.post('/subscriptions/:id/change-plan', requireAuth(['superadmin','platform_owner','finance_admin','employer','company_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const s: any = db.subscriptions.find((x: any) => x.id === req.params.id);
  if (!s) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role) && s.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  const { planId, reason } = req.body || {};
  const plan: any = db.plans.find((p: any) => p.id === planId);
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
  if (plan.status === 'Archived') return res.status(422).json({ success: false, message: 'Cannot move to an archived plan.' });
  const from = `${s.planId}:v${s.planVersion}`;
  s.planId = plan.id; s.planVersion = plan.version || 1; s.planSnapshot = { ...plan };
  s.price = plan.price; s.currency = plan.currency || 'INR'; s.updatedAt = nowIso();
  db.subscriptionChanges.unshift({ id: uid('SUBC'), subscriptionId: s.id, change: `plan ${from} -> ${plan.id}:v${s.planVersion}`, reason: reason || '', by: ctx.email, createdAt: nowIso() });
  audit(ctx.email, `SUBSCRIPTION_PLAN:${s.id} ${from}->${plan.id}`, s.orgId, 'subscription', s.id, req.ip); persist();
  res.json({ success: true, data: s });
});
commercialRouter.patch('/subscriptions/:id/renewal', requireAuth(['superadmin','platform_owner','finance_admin','employer','company_admin']), (req, res) => {
  const db = loadDb(); const s: any = db.subscriptions.find((x: any) => x.id === req.params.id);
  if (!s) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role) && s.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  if (req.body.autoRenew !== undefined) s.autoRenew = !!req.body.autoRenew;
  if (req.body.discount !== undefined) s.discount = Math.max(0, Number(req.body.discount) || 0);
  s.updatedAt = nowIso();
  db.subscriptionChanges.unshift({ id: uid('SUBC'), subscriptionId: s.id, change: 'renewal-settings', reason: req.body.reason || '', by: ctx.email, createdAt: nowIso() });
  audit(ctx.email, `SUBSCRIPTION_RENEWAL:${s.id}`, s.orgId, 'subscription', s.id, req.ip); persist();
  res.json({ success: true, data: s });
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

// ---- Invoices (Draft → Issued, immutable after issue §6.10) ----
function withOverdue(inv: any): any {
  const overdue = Number(inv.balance || 0) > 0 && inv.dueDate && new Date(inv.dueDate) < new Date() && !['Paid','Void','Credited','Draft'].includes(inv.status);
  const daysOverdue = overdue ? Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 864e5) : 0;
  return { ...inv, overdue: !!overdue, daysOverdue };
}
commercialRouter.get('/invoices', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().invoices as any[];
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role)) rows = rows.filter((i) => i.orgId === ctx.tenantId);
  rows = rows.map(withOverdue);
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.get('/invoices/:id/document', requireAuth(), (req, res) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role) && inv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const org: any = db.organizations.find((o: any) => o.id === inv.orgId);
  const agreement: any = inv.agreementId ? db.commissionAgreements.find((a: any) => a.id === inv.agreementId) : null;
  const paymentTermsDays = inv.paymentTermsDays ?? agreement?.paymentTermsDays ?? 30;
  const replacementDays = agreement?.replacementDays ?? 90;
  res.json({ success: true, data: {
    ...withOverdue(inv),
    lines: db.invoiceLines.filter((l: any) => l.invoiceId === inv.id),
    organization: org ? { id: org.id, legalName: org.legalName, displayName: org.displayName, gstin: org.gstin, billingContact: org.billingContact, financeEmail: org.financeEmail } : null,
    payments: db.payments.filter((p: any) => p.invoiceId === inv.id),
    creditNotes: db.creditNotes.filter((c: any) => c.invoiceId === inv.id),
    agreement: agreement ? { id: agreement.id, hiringType: agreement.hiringType, rate: agreement.rate, feeModel: agreement.feeModel, trigger: agreement.trigger, companyAccepted: agreement.companyAccepted } : null,
    terms: {
      paymentTermsDays,
      paymentNote: `Payable within ${paymentTermsDays} days of the candidate's joining date.`,
      replacementNote: inv.replacementNote || `Free replacement within ${replacementDays} days of joining under the defined conditions.`,
      gstNote: 'GST charged extra as applicable on the taxable value.',
      ownershipNote: agreement?.ownershipClause || 'Candidate ownership rests with the introducing party for 90 days from submission.',
      duplicateNote: agreement?.duplicatePolicy || 'Duplicate profiles are rejected; the earliest valid submission owns the candidate.',
    },
    reminders: (db.invoiceReminders as any[]).filter((r: any) => r.invoiceId === inv.id),
  } });
});
// ---- Invoice reminders (due-soon + overdue → superadmin/finance notifications) ----
commercialRouter.get('/invoice-reminders', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().invoiceReminders as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((r) => r.orgId === ctx.tenantId);
  res.json({ success: true, data: rows.slice(0, 200) });
});
commercialRouter.post('/invoice-reminders/run', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req, res) => {
  const db = loadDb(); const today = nowIso().slice(0, 10);
  const open = (db.invoices as any[]).map(withOverdue).filter((i: any) => Number(i.balance || 0) > 0 && ['Issued', 'Partially Paid'].includes(i.status));
  const sent: any[] = [];
  for (const inv of open) {
    const dueMs = new Date(inv.dueDate).getTime();
    if (!Number.isFinite(dueMs)) continue;
    const days = Math.floor((dueMs - Date.now()) / 864e5);
    const kind = days < 0 ? 'overdue' : (days <= 7 ? 'due-soon' : null);
    if (!kind) continue;
    if (!claimIdempotency(`invoice-reminder:${inv.id}:${today}`)) continue;
    const body = kind === 'overdue'
      ? `OVERDUE ${-days}d: invoice ${inv.number || inv.id} (${inv.orgId}) balance ₹${inv.balance}, due ${String(inv.dueDate).slice(0, 10)}.`
      : `Due in ${days}d: invoice ${inv.number || inv.id} (${inv.orgId}) balance ₹${inv.balance}, due ${String(inv.dueDate).slice(0, 10)}.`;
    db.notifications.unshift({ id: uid('NOTIF'), recipient: 'superadmin', kind: 'invoice-reminder', body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: 'TNT-GLOBAL' });
    const log = { id: uid('INVR'), invoiceId: inv.id, number: inv.number, orgId: inv.orgId, kind, daysOverdue: kind === 'overdue' ? -days : 0, daysToDue: kind === 'due-soon' ? days : null, balance: inv.balance, sentAt: nowIso(), by: ctxOf(req).email };
    (db.invoiceReminders as any[]).unshift(log); sent.push(log);
    audit(ctxOf(req).email, `INVOICE_REMINDER_${kind.toUpperCase()}:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip);
  }
  if ((db.invoiceReminders as any[]).length > 500) (db.invoiceReminders as any[]).length = 500;
  persist();
  res.json({ success: true, data: { sent: sent.length, reminders: sent } });
});
commercialRouter.post('/invoices', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const { draft, ...body } = req.body || {};
  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const db = loadDb();
  const subtotal = parsed.data.lines.reduce((a, l) => a + l.qty * l.unit, 0);
  const tax = +((subtotal - parsed.data.discount) * parsed.data.taxRate / 100).toFixed(2);
  const total = +(subtotal - parsed.data.discount + tax).toFixed(2);
  const isDraft = draft === true;
  const inv = { id: uid('INV'), number: `INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(4, '0')}`, ...parsed.data, subtotal, tax, total, amountPaid: 0, balance: total, status: isDraft ? 'Draft' : 'Issued', issueDate: isDraft ? null : nowIso(), createdAt: nowIso(), createdBy: ctxOf(req).email };
  db.invoices.unshift(inv);
  parsed.data.lines.forEach((l) => db.invoiceLines.unshift({ id: uid('INVL'), invoiceId: inv.id, ...l }));
  audit(ctxOf(req).email, isDraft ? `INVOICE_DRAFTED:${inv.id}` : `INVOICE_ISSUED:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip); persist();
  res.status(201).json({ success: true, data: withOverdue(inv) });
});
commercialRouter.put('/invoices/:id', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  if (inv.status !== 'Draft') return res.status(422).json({ success: false, message: `Only Draft invoices can be edited (current: ${inv.status}).` });
  const parsed = invoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const subtotal = parsed.data.lines.reduce((a, l) => a + l.qty * l.unit, 0);
  const tax = +((subtotal - parsed.data.discount) * parsed.data.taxRate / 100).toFixed(2);
  Object.assign(inv, parsed.data, { subtotal, tax, total: +(subtotal - parsed.data.discount + tax).toFixed(2), updatedAt: nowIso() });
  inv.balance = +(inv.total - (inv.amountPaid || 0)).toFixed(2);
  db.invoiceLines = db.invoiceLines.filter((l: any) => l.invoiceId !== inv.id);
  parsed.data.lines.forEach((l) => db.invoiceLines.unshift({ id: uid('INVL'), invoiceId: inv.id, ...l }));
  audit(ctxOf(req).email, `INVOICE_DRAFT_EDITED:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip); persist();
  res.json({ success: true, data: withOverdue(inv) });
});
commercialRouter.post('/invoices/:id/issue', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req, res) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  if (inv.status !== 'Draft') return res.status(422).json({ success: false, message: `Only Draft invoices can be issued (current: ${inv.status}).` });
  inv.status = 'Issued'; inv.issueDate = nowIso(); inv.issuedBy = ctxOf(req).email;
  audit(ctxOf(req).email, `INVOICE_ISSUED:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip); persist();
  res.json({ success: true, data: withOverdue(inv) });
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

// ---- Fee slabs by hiring type (commercial policy, superadmin/finance owned) ----
function slabFor(db: any, hiringType?: string): any {
  return (db.feeSlabs as any[]).find((s: any) => s.hiringType === hiringType) || null;
}
commercialRouter.get('/fee-slabs', requireAuth(), (_req, res) => {
  res.json({ success: true, data: loadDb().feeSlabs });
});
commercialRouter.put('/fee-slabs', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const list = req.body?.slabs;
  if (!Array.isArray(list) || list.length === 0) return res.status(400).json({ success: false, message: 'slabs[] required.' });
  for (const s of list) {
    const parsed = feeSlabSchema.safeParse(s);
    if (!parsed.success) return res.status(400).json({ success: false, message: `Invalid slab for ${s?.hiringType || 'unknown'}.`, errors: parsed.error.flatten() });
    if (!parsed.data.negotiated && parsed.data.rateMin > parsed.data.rateMax) return res.status(400).json({ success: false, message: `rateMin > rateMax for ${parsed.data.hiringType}.` });
  }
  const db = loadDb();
  db.feeSlabs = list.map((s: any) => ({ ...s, updatedAt: nowIso(), updatedBy: ctxOf(req).email }));
  audit(ctxOf(req).email, 'FEE_SLABS_UPDATED', 'TNT-GLOBAL', 'commercial', 'fee-slabs', req.ip); persist();
  res.json({ success: true, data: db.feeSlabs });
});
function checkSlabRate(db: any, hiringType: string, feeModel: string, rate: number): string | null {
  if (feeModel !== 'percentage') return null;
  const slab = slabFor(db, hiringType);
  if (!slab || slab.negotiated) return null;
  if (rate < Number(slab.rateMin) || rate > Number(slab.rateMax)) return `Rate ${rate}% is outside the ${hiringType} slab (${slab.rateMin}%–${slab.rateMax}%).`;
  return null;
}

// ---- Commissions & payouts (separate ledgers §6.11/§9.5) ----
commercialRouter.post('/commission-agreements', requireAuth(['superadmin','platform_owner','finance_admin','employer','company_admin']), (req: Request, res: Response) => {
  const parsed = commissionAgreementSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const db = loadDb();
  const slabErr = checkSlabRate(db, parsed.data.hiringType, parsed.data.feeModel, parsed.data.rate);
  if (slabErr) return res.status(422).json({ success: false, message: slabErr });
  const ag = { id: uid('AGR'), status: 'Approved', companyAccepted: false, acceptedAt: null, acceptedBy: null, effectiveDate: nowIso(), createdAt: nowIso(), createdBy: ctxOf(req).email, ...parsed.data };
  db.commissionAgreements.unshift(ag); audit(ctxOf(req).email, `COMMISSION_AGREEMENT:${ag.id}`, ag.orgId, 'commission', ag.id, req.ip); persist();
  res.status(201).json({ success: true, data: ag });
});
commercialRouter.patch('/commission-agreements/:id/accept', requireAuth(['superadmin','platform_owner','employer','company_admin','finance_admin']), (req, res) => {
  const db = loadDb(); const ag: any = db.commissionAgreements.find((a: any) => a.id === req.params.id);
  if (!ag) return res.status(404).json({ success: false, message: 'Agreement not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role) && ag.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Agreement not found.' });
  if (ag.companyAccepted) return res.status(422).json({ success: false, message: 'Agreement already accepted by the company.' });
  ag.companyAccepted = true; ag.acceptedAt = nowIso(); ag.acceptedBy = ctx.email;
  audit(ctx.email, `COMMISSION_AGREEMENT_ACCEPTED:${ag.id}`, ag.orgId, 'commission', ag.id, req.ip); persist();
  res.json({ success: true, data: ag });
});

// ---- Agreement templates (company ↔ platform, versioned) ----
commercialRouter.get('/agreement-templates', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().agreementTemplates as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((t) => t.status === 'Active' && (!t.orgId || t.orgId === ctx.tenantId));
  res.json({ success: true, data: rows });
});
commercialRouter.post('/agreement-templates', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const parsed = agreementTemplateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const db = loadDb();
  const t = { id: uid('AGT'), version: 1, status: 'Draft', history: [], createdBy: ctxOf(req).email, createdAt: nowIso(), ...parsed.data };
  db.agreementTemplates.unshift(t); audit(ctxOf(req).email, `AGREEMENT_TEMPLATE:${t.id}`, t.orgId || 'TNT-GLOBAL', 'commercial', t.id, req.ip); persist();
  res.status(201).json({ success: true, data: t });
});
commercialRouter.put('/agreement-templates/:id', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const db = loadDb(); const t: any = db.agreementTemplates.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Template not found.' });
  if (t.status === 'Archived') return res.status(422).json({ success: false, message: 'Archived templates are immutable.' });
  const parsed = agreementTemplateSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const { name, orgId, ...terms } = parsed.data as any;
  t.history.unshift({ version: t.version, terms: { hiringType: t.hiringType, rateMin: t.rateMin, rateMax: t.rateMax, paymentTermsDays: t.paymentTermsDays, replacementDays: t.replacementDays, gstNote: t.gstNote, ownershipClause: t.ownershipClause, duplicatePolicy: t.duplicatePolicy, cancellationTerms: t.cancellationTerms }, by: ctxOf(req).email, at: nowIso() });
  if (name !== undefined) t.name = name;
  if (orgId !== undefined) t.orgId = orgId;
  Object.assign(t, terms);
  t.version += 1; t.updatedAt = nowIso();
  audit(ctxOf(req).email, `AGREEMENT_TEMPLATE_V${t.version}:${t.id}`, t.orgId || 'TNT-GLOBAL', 'commercial', t.id, req.ip); persist();
  res.json({ success: true, data: t });
});
commercialRouter.post('/agreement-templates/:id/status', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req, res) => {
  const db = loadDb(); const t: any = db.agreementTemplates.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Template not found.' });
  const to = String(req.body?.status || '');
  if (!['Draft', 'Active', 'Archived'].includes(to)) return res.status(400).json({ success: false, message: 'status must be Draft|Active|Archived.' });
  t.status = to; t.updatedAt = nowIso();
  audit(ctxOf(req).email, `AGREEMENT_TEMPLATE_${to.toUpperCase()}:${t.id}`, t.orgId || 'TNT-GLOBAL', 'commercial', t.id, req.ip); persist();
  res.json({ success: true, data: t });
});
commercialRouter.post('/agreement-templates/:id/instantiate', requireAuth(['superadmin','platform_owner','finance_admin','employer','company_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const t: any = db.agreementTemplates.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Template not found.' });
  if (t.status !== 'Active') return res.status(422).json({ success: false, message: `Only Active templates can be instantiated (current: ${t.status}).` });
  const { orgId, jobId, agencyId, hiringType, feeModel, rate, fixedFee, trigger } = req.body || {};
  if (!orgId) return res.status(400).json({ success: false, message: 'orgId required.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role) && orgId !== ctx.tenantId) return res.status(403).json({ success: false, message: 'Cannot instantiate for another organization.' });
  const ht = hiringType || t.hiringType || 'Mid-level IT roles';
  const model = feeModel || 'percentage';
  const r = rate !== undefined ? Number(rate) : (t.rateMin !== undefined && t.rateMax !== undefined ? (t.rateMin === t.rateMax ? t.rateMin : (t.rateMin + t.rateMax) / 2) : 8.33);
  const slabErr = checkSlabRate(db, ht, model, r);
  if (slabErr) return res.status(422).json({ success: false, message: slabErr });
  const ag = {
    id: uid('AGR'), status: 'Approved', companyAccepted: false, acceptedAt: null, acceptedBy: null,
    orgId, jobId, agencyId, hiringType: ht, feeModel: model, rate: r, fixedFee,
    trigger: trigger || 'Joined', paymentTermsDays: t.paymentTermsDays ?? 30, replacementDays: t.replacementDays ?? 90,
    gstApplicable: true, replacementTerms: `Free replacement within ${t.replacementDays ?? 90} days of joining under the defined conditions.`,
    ownershipClause: t.ownershipClause, duplicatePolicy: t.duplicatePolicy, cancellationTerms: t.cancellationTerms,
    templateId: t.id, templateVersion: t.version,
    effectiveDate: nowIso(), createdAt: nowIso(), createdBy: ctx.email,
  };
  db.commissionAgreements.unshift(ag); audit(ctx.email, `COMMISSION_AGREEMENT_FROM_TEMPLATE:${ag.id}<-${t.id}v${t.version}`, orgId, 'commission', ag.id, req.ip); persist();
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
// Duplicate-trigger diagnostic (§6.11): would this placement+trigger mint a duplicate?
commercialRouter.get('/commissions/check', requireAuth(), (req, res) => {
  const { applicationId, placementId, trigger, agreementId } = req.query as Record<string, string>;
  if (!trigger || (!applicationId && !placementId)) return res.status(400).json({ success: false, message: 'trigger + applicationId|placementId required.' });
  const db = loadDb();
  const rows = (db.commissions as any[]).filter((c) =>
    (applicationId ? (c.placementId === applicationId || c.applicationId === applicationId) : c.placementId === placementId) &&
    c.trigger === trigger && (!agreementId || c.agreementId === agreementId));
  res.json({ success: true, data: { duplicate: rows.length > 0, count: rows.length, rows: rows.map((c) => ({ id: c.id, agreementId: c.agreementId, approvalStatus: c.approvalStatus, paymentStatus: c.paymentStatus })) } });
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
