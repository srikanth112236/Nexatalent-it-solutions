import { Router, Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, requirePermission, ctxOf, tenantOf } from '../middleware/rbac.js';
import { invoiceSchema, paymentSchema, commissionAgreementSchema, agreementTemplateSchema, feeSlabSchema, invoiceSeriesSchema, paginate, paged } from '../validate/schemas.js';
import { emit, claimIdempotency } from '../events/bus.js';
import { mailConfigured } from '../events/mailer.js';
import PDFDocument from 'pdfkit';
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
  const q = String(req.query.q || '').toLowerCase();
  if (q) rows = rows.filter((i) => `${i.id} ${i.number} ${i.orgId} ${i.status} ${i.agreementId || ''}`.toLowerCase().includes(q));
  const status = String(req.query.status || '');
  if (status) rows = rows.filter((i) => (status === 'Overdue' ? !!i.overdue : i.status === status));
  const type = String(req.query.type || '');
  if (type) rows = rows.filter((i) => (i.invoiceType || 'one_time') === type);
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.get('/invoices/:id/document', requireAuth(), (req, res) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role) && inv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  res.json({ success: true, data: buildInvoiceDocument(db, inv) });
});
function buildInvoiceDocument(db: any, inv: any): any {
  const org: any = db.organizations.find((o: any) => o.id === inv.orgId);
  const agreement: any = inv.agreementId ? db.commissionAgreements.find((a: any) => a.id === inv.agreementId) : null;
  const paymentTermsDays = inv.paymentTermsDays ?? agreement?.paymentTermsDays ?? 30;
  const replacementDays = agreement?.replacementDays ?? 90;
  return {
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
  };
}
// ---- Mail outbox (queued/sent/failed email log) ----
commercialRouter.get('/mail-outbox', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().mailOutbox as any[] || [];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((m) => m.orgId === ctx.tenantId);
  res.json({ success: true, data: rows.slice(0, 200), configured: mailConfigured() });
});
// ---- Server-generated PDFs (pdfkit, no browser needed) ----
commercialRouter.get('/invoices/:id/pdf', requireAuth(), (req, res) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role) && inv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const d = buildInvoiceDocument(db, inv);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${d.number || d.id}.pdf"`);
  const pdf = new PDFDocument({ margin: 48, info: { Title: `Tax Invoice ${d.number || d.id}` } });
  pdf.pipe(res);
  pdf.fontSize(18).text('NexaTalent IT Solutions — TAX INVOICE');
  pdf.moveDown(0.5).fontSize(10).text(`${d.number || d.id} • Issued ${String(d.issueDate || d.createdAt || '').slice(0, 10)} • Due ${String(d.dueDate || '').slice(0, 10)} • ${d.status}${d.overdue ? ` • ${d.daysOverdue}d OVERDUE` : ''}`);
  pdf.moveDown().fontSize(11).text(`Billed to: ${d.billingEntity || d.organization?.legalName || d.orgId}${d.taxIds || d.organization?.gstin ? ` (GSTIN: ${d.taxIds || d.organization?.gstin})` : ''}`);
  if (d.billingAddress) pdf.fontSize(9).text(d.billingAddress);
  if (d.billingPeriod) pdf.fontSize(9).text(`Billing period: ${d.billingPeriod}`);
  if (d.subscriptionId) pdf.fontSize(9).text(`Subscription/service: ${d.subscriptionId}`);
  pdf.fontSize(9).text(`Currency: ${d.currency || 'INR'}`);
  if (d.agreement) pdf.fontSize(10).text(`Agreement ${d.agreement.id} • ${d.agreement.hiringType} @ ${d.agreement.rate}%`);
  pdf.moveDown();
  for (const l of d.lines || []) pdf.fontSize(10).text(`${l.label} — qty ${l.qty} × ₹${l.unit} = ₹${(l.qty * l.unit).toLocaleString('en-IN')}`);
  pdf.moveDown().fontSize(11)
    .text(`Subtotal: ₹${d.subtotal}`).text(`Discount: ₹${d.discount}`)
    .text(`Tax (GST @ ${d.taxRate ?? 18}%): ₹${d.tax}`).text(`Total: ₹${d.total}`)
    .text(`Paid: ₹${d.amountPaid}`).text(`Balance: ₹${d.balance}`);
  pdf.moveDown().fontSize(9).fillColor('#475569')
    .text(d.terms.paymentNote).text(d.terms.replacementNote).text(d.terms.gstNote);
  pdf.fillColor('#000000');
  pdf.end();
});
commercialRouter.get('/commission-agreements/:id/pdf', requireAuth(), (req, res) => {
  const db = loadDb(); const ag: any = db.commissionAgreements.find((a: any) => a.id === req.params.id);
  if (!ag) return res.status(404).json({ success: false, message: 'Agreement not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role) && ag.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Agreement not found.' });
  const tpl: any = (db.agreementTemplates as any[]).find((t: any) => t.id === ag.templateId) || (db.agreementTemplates as any[]).find((t: any) => t.id === 'AGT-STD-001');
  const org: any = db.organizations.find((o: any) => o.id === ag.orgId);
  const filled = fillAgreementHtml(tpl, ag, org);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="Agreement-${ag.id}.pdf"`);
  const pdf = new PDFDocument({ margin: 48, info: { Title: `Agreement ${ag.id}` } });
  pdf.pipe(res);
  for (const block of filled) {
    if (block.h) pdf.fontSize(13).text(block.t, { underline: false });
    else pdf.fontSize(10).text(block.t);
    pdf.moveDown(0.4);
  }
  pdf.end();
});
function fillAgreementHtml(tpl: any, ag: any, org: any): Array<{ h?: boolean; t: string }> {
  const map: Record<string, string> = {
    company_name: org?.displayName || org?.legalName || ag.orgId,
    date: new Date().toISOString().slice(0, 10),
    hiring_type: ag.hiringType || tpl?.hiringType || '',
    rate_percent: ag.rate !== undefined ? String(ag.rate) : '',
    payment_days: String(ag.paymentTermsDays ?? tpl?.paymentTermsDays ?? 30),
    replacement_days: String(ag.replacementDays ?? tpl?.replacementDays ?? 90),
    gst_note: tpl?.gstNote || 'GST charged extra as applicable.',
    ownership: ag.ownershipClause || tpl?.ownershipClause || '',
    duplicates: ag.duplicatePolicy || tpl?.duplicatePolicy || '',
    cancellation: ag.cancellationTerms || tpl?.cancellationTerms || '',
    template_name: tpl?.name || '',
  };
  let html = String(tpl?.bodyHtml || '');
  for (const [k, v] of Object.entries(map)) html = html.split(`{{${k}}}`).join(String(v));
  if (!html) {
    html = `<h2>Placement Services Agreement — ${ag.id}</h2><p>Rate ${ag.rate}% of ${ag.hiringType}.</p><p>${map.ownership}</p><p>${map.duplicates}</p><p>${map.cancellation}</p>`;
  }
  return html.replace(/<\/(h[1-6]|p|li|tr)>/gi, '\n').replace(/<li>/gi, '• ').replace(/<[^>]+>/g, '').split('\n').map((s) => s.trim()).filter(Boolean)
    .map((t) => (/^(Placement Services Agreement|Agreement|1\.|2\.|3\.|4\.|5\.|6\.|7\.)/.test(t) && t.length < 80 ? { h: true, t } : { t }));
}
// ---- Invoice reminders (due-soon + overdue → superadmin/finance notifications) ----
commercialRouter.get('/invoice-reminders', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().invoiceReminders as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((r) => r.orgId === ctx.tenantId);
  res.json({ success: true, data: rows.slice(0, 200) });
});
commercialRouter.post('/invoice-reminders/run', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req, res) => {
  const db = loadDb(); const today = nowIso().slice(0, 10);
  let open = (db.invoices as any[]).map(withOverdue).filter((i: any) => Number(i.balance || 0) > 0 && ['Issued', 'Partially Paid'].includes(i.status));
  const only = Array.isArray(req.body?.invoiceIds) ? new Set(req.body.invoiceIds.map(String)) : null;
  if (only) open = open.filter((i: any) => only.has(i.id));
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
  if (sent.length > 0) {
    const lines = sent.map((s: any) => `<li>[${s.kind}] ${s.number || s.invoiceId} • ${s.orgId} • ₹${s.balance}</li>`).join('');
    import('../events/mailer.js').then(({ sendMail }) => sendMail(
      'superadmin@nexatalent.com',
      `Payment reminders: ${sent.length} invoice(s) need attention`,
      `<p>${sent.length} invoice(s) overdue or due within 7 days:</p><ul>${lines}</ul>`,
      { kind: 'invoice-reminder-digest' },
    ).catch(() => {}));
  }
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
  audit(ctxOf(req).email, `INVOICE_ISSUED:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip, { before: 'Draft', after: 'Issued', total: inv.total, balance: inv.balance }); persist();
  const org: any = db.organizations.find((o: any) => o.id === inv.orgId);
  const financeTo = org?.financeEmail || org?.billingContact;
  if (financeTo && String(financeTo).includes('@')) {
    import('../events/mailer.js').then(({ sendMail }) => sendMail(
      String(financeTo),
      `Tax invoice ${inv.number || inv.id} — ₹${inv.total} due ${String(inv.dueDate).slice(0, 10)}`,
      `<p>Dear ${org?.displayName || inv.orgId},</p><p>Invoice <strong>${inv.number || inv.id}</strong> for <strong>₹${inv.total}</strong> is due by ${String(inv.dueDate).slice(0, 10)}. Balance: ₹${inv.balance}.</p>`,
      { kind: 'invoice-issued', orgId: inv.orgId, refId: inv.id },
    ).catch(() => {}));
  }
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
commercialRouter.get('/refunds', requireAuth(['superadmin','platform_owner','finance_admin']), (req, res) => {
  let rows = loadDb().refunds as any[];
  const qq = String(req.query.q || '').toLowerCase();
  if (qq) rows = rows.filter((r) => `${r.id} ${r.paymentId} ${r.invoiceId} ${r.status}`.toLowerCase().includes(qq));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
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
  const qq = String(req.query.q || '').toLowerCase();
  if (qq) rows = rows.filter((p) => `${p.id} ${p.invoiceId} ${p.orgId} ${p.status}`.toLowerCase().includes(qq));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
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
  t.history.unshift({ version: t.version, terms: { hiringType: t.hiringType, rateMin: t.rateMin, rateMax: t.rateMax, basisType: t.basisType, contractMonths: t.contractMonths, paymentTermsDays: t.paymentTermsDays, replacementDays: t.replacementDays, gstNote: t.gstNote, ownershipClause: t.ownershipClause, duplicatePolicy: t.duplicatePolicy, cancellationTerms: t.cancellationTerms, bodyHtml: t.bodyHtml }, by: ctxOf(req).email, at: nowIso() });
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
  const { orgId, jobId, agencyId, hiringType, feeModel, rate, fixedFee, trigger, basisType, contractMonths, autoApprove } = req.body || {};
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
    basisType: basisType || t.basisType || 'annual_ctc', contractMonths: Number(contractMonths || t.contractMonths || 12),
    autoApprove: autoApprove === true,
    trigger: trigger || 'Joined', paymentTermsDays: t.paymentTermsDays ?? 30, replacementDays: t.replacementDays ?? 90,
    gstApplicable: true, replacementTerms: `Free replacement within ${t.replacementDays ?? 90} days of joining under the defined conditions.`,
    ownershipClause: t.ownershipClause, duplicatePolicy: t.duplicatePolicy, cancellationTerms: t.cancellationTerms,
    templateId: t.id, templateVersion: t.version,
    effectiveDate: nowIso(), createdAt: nowIso(), createdBy: ctx.email,
  };
  db.commissionAgreements.unshift(ag); audit(ctx.email, `COMMISSION_AGREEMENT_FROM_TEMPLATE:${ag.id}<-${t.id}v${t.version}`, orgId, 'commission', ag.id, req.ip); persist();
  res.status(201).json({ success: true, data: ag });
});
/** Agreement resolution for a hire: job-specific agreement wins, else the org-wide default. Must be Approved + company-accepted. */
export function matchAgreement(db: any, app: { orgId?: string; jobId?: string }): any {
  const org = (db.commissionAgreements as any[]).filter((a: any) => a.orgId === app.orgId && a.status === 'Approved' && a.companyAccepted && !a.agencyId);
  return org.find((a: any) => a.jobId && app.jobId && a.jobId === app.jobId) || org.find((a: any) => !a.jobId) || null;
}
export function feePreview(agreement: any, feeBasis: number): any {
  const basisType = agreement.basisType === 'monthly_ctc' ? 'monthly_ctc' : 'annual_ctc';
  const months = basisType === 'monthly_ctc' ? Number(agreement.contractMonths || 12) : 1;
  const gross = agreement.feeModel === 'fixed' ? Number(agreement.fixedFee || 0) : +(Number(feeBasis || 0) * months * Number(agreement.rate || 0) / 100).toFixed(2);
  const tax = +(gross * 18 / 100).toFixed(2);
  return { basisType, months, feeBasis: Number(feeBasis || 0), rate: agreement.rate, gross, tax, total: +(gross + tax).toFixed(2), paymentTermsDays: agreement.paymentTermsDays ?? 30, replacementDays: agreement.replacementDays ?? 90 };
}
// Fee math preview for a hire: which agreement applies + computed fee. Drives the company Hire confirm.
commercialRouter.get('/commission-agreements/match', requireAuth(['employer','superadmin','company_admin','hiring_manager','finance_admin','employee','operations_admin']), (req, res) => {
  const db = loadDb();
  const app: any = db.applications.find((a: any) => a.id === req.query.applicationId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin','employee','operations_admin'].includes(ctx.role) && app.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Application not found.' });
  const agreement = matchAgreement(db, app);
  if (!agreement) return res.status(422).json({ success: false, code: 'NO_AGREEMENT', message: 'No accepted commercial agreement covers this hire. Ask your NexaTalent manager to activate one before recording the joining.' });
  const offer: any = db.offers.filter((o: any) => o.applicationId === app.id).sort((x: any, y: any) => String(y.createdAt).localeCompare(String(x.createdAt)))[0] || null;
  const feeBasis = Number(req.query.feeBasis || 0) || Number(offer?.ctc || 0);
  if (!(feeBasis > 0)) return res.status(422).json({ success: false, code: 'NO_BASIS', message: 'No CTC on record for this application. Enter the fee basis (annual CTC, or monthly CTC for contract hires).', agreement });
  res.json({ success: true, data: { application: { id: app.id, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail }, agreement, offer: offer ? { id: offer.id, ctc: offer.ctc } : null, preview: feePreview(agreement, feeBasis) } });
});
commercialRouter.get('/commission-agreements', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().commissionAgreements as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((a) => a.orgId === ctx.tenantId);
  const q = String(req.query.q || '').toLowerCase();
  if (q) rows = rows.filter((a) => `${a.id} ${a.orgId} ${a.hiringType || ''} ${a.status || ''}`.toLowerCase().includes(q));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.get('/commissions', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().commissions as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((c) => c.orgId === ctx.tenantId || c.agencyId === ctx.tenantId);
  const q = String(req.query.q || '').toLowerCase();
  if (q) rows = rows.filter((c) => `${c.id} ${c.orgId} ${c.agencyId || ''} ${c.candidateEmail || ''} ${c.jobId || ''}`.toLowerCase().includes(q));
  const leg = String(req.query.leg || '');
  if (leg === 'receivable') rows = rows.filter((c) => !c.agencyId);
  if (leg === 'payable') rows = rows.filter((c) => !!c.agencyId);
  const approval = String(req.query.approval || '');
  if (approval) rows = rows.filter((c) => c.approvalStatus === approval);
  const summary = {
    receivable: rows.filter((c) => !c.agencyId).reduce((a, c) => a + Number(c.total || c.net || 0), 0),
    payable: rows.filter((c) => !!c.agencyId).reduce((a, c) => a + Number(c.total || c.net || 0), 0),
    count: rows.length,
  };
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, summary, ...paged(rows, page, pageSize) });
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
  audit(ctxOf(req).email, `COMMISSION_APPROVED:${c.id}`, c.orgId, 'commission', c.id, req.ip, { before: 'Pending', after: 'Approved', gross: c.gross, total: c.total }); persist();
  emit('commission.approved', c, c.orgId, ctxOf(req).email);
  res.json({ success: true, data: c });
});
/** Mint invoice(s) for a commission slice. Returns { commission, invoice } or throws { status, message }. */
export function invoiceForCommission(db: any, c: any, take: number | undefined, by: string): { commission: any; invoice: any } {
  const fail = (status: number, message: string): never => { throw { status, message }; };
  if (c.approvalStatus !== 'Approved') fail(422, `Only Approved commissions can be invoiced (current: ${c.approvalStatus}).`);
  const monthsTotal = c.basisType === 'monthly_ctc' ? Number(c.contractMonths || 12) : 1;
  const billed = Number(c.billedMonths || 0);
  const n = take !== undefined ? Number(take) : (monthsTotal - billed);
  if (!(n > 0) || billed >= monthsTotal) fail(409, c.invoiceId && monthsTotal === 1 ? `Invoice ${c.invoiceId} already generated for this commission.` : `All ${monthsTotal} month(s) already billed for this commission.`);
  if (monthsTotal === 1 && c.invoiceId) fail(409, `Invoice ${c.invoiceId} already generated for this commission.`);
  const ag: any = c.agreementId ? db.commissionAgreements.find((a: any) => a.id === c.agreementId) : null;
  const termsDays = Number(ag?.paymentTermsDays || 30);
  const base = new Date(c.triggerDate || c.createdAt).getTime();
  const dueDate = new Date((Number.isFinite(base) ? base : Date.now()) + termsDays * 864e5).toISOString().slice(0, 10);
  const monthly = c.basisType === 'monthly_ctc';
  const slice = monthly ? n / monthsTotal : 1;
  const unit = +(Number(c.gross || 0) * slice).toFixed(2);
  const gross = unit;
  const basisLabel = monthly
    ? `₹${Number(c.feeBasis || 0).toLocaleString('en-IN')}/mo × ${n} mo (month ${billed + 1}${n > 1 ? `–${billed + n}` : ''} of ${monthsTotal})`
    : `₹${Number(c.feeBasis || 0).toLocaleString('en-IN')}`;
  const tax = +(gross * 18 / 100).toFixed(2);
  const total = +(gross + tax).toFixed(2);
  const inv = {
    id: uid('INV'), number: `INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(4, '0')}`,
    orgId: c.orgId, agreementId: c.agreementId || undefined, paymentTermsDays: termsDays,
    invoiceType: monthly ? 'monthly' : 'one_time',
    lines: [{ label: `Placement fee — ${c.candidateEmail || c.applicationId || ''} (${c.jobId || ''}) @ ${c.rate || ag?.rate || 0}% of ${basisLabel}`, qty: 1, unit }],
    discount: 0, taxRate: 18, subtotal: gross, tax, total, amountPaid: 0, balance: total,
    status: 'Issued', issueDate: nowIso(), dueDate, currency: 'INR', createdAt: nowIso(), createdBy: by,
    replacementNote: ag?.replacementTerms || undefined,
  };
  db.invoices.unshift(inv);
  db.invoiceLines.unshift({ id: uid('INVL'), invoiceId: inv.id, label: inv.lines[0].label, qty: 1, unit: gross });
  if (!c.invoiceId) c.invoiceId = inv.id;
  c.invoiceIds = [...(c.invoiceIds || (c.invoiceId ? [c.invoiceId] : [])), inv.id].filter((v, ix, a) => a.indexOf(v) === ix);
  c.billedMonths = billed + n;
  audit(by, `COMMISSION_INVOICED:${c.id}->${inv.id}`, c.orgId, 'commission', c.id, '127.0.0.1'); persist();
  return { commission: c, invoice: withOverdue(inv) };
}
commercialRouter.post('/commissions/:id/invoice', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const db = loadDb(); const c: any = db.commissions.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Commission not found.' });
  try {
    const out = invoiceForCommission(db, c, req.body?.forMonths, ctxOf(req).email);
    audit(ctxOf(req).email, `COMMISSION_INVOICED_API:${c.id}`, c.orgId, 'commission', c.id, req.ip); persist();
    res.status(201).json({ success: true, data: out });
  } catch (e: any) {
    res.status(e?.status || 500).json({ success: false, message: e?.message || 'Failed.' });
  }
});
// ---- Monthly auto-billing scheduler: bill started-but-unbilled months + issue due series drafts ----
commercialRouter.post('/billing/schedule/run', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), async (req, res) => {
  const db = loadDb(); const by = ctxOf(req).email;
  const generated: any[] = []; const issued: any[] = [];
  for (const c of db.commissions as any[]) {
    if (c.approvalStatus !== 'Approved' || c.basisType !== 'monthly_ctc') continue;
    const monthsTotal = Number(c.contractMonths || 12);
    let billed = Number(c.billedMonths || 0);
    while (billed < monthsTotal) {
      const base = new Date(c.triggerDate || c.createdAt).getTime();
      const monthStart = new Date(Number.isFinite(base) ? base : Date.now());
      monthStart.setMonth(monthStart.getMonth() + billed);
      if (monthStart.getTime() > Date.now()) break;
      try {
        const out = invoiceForCommission(db, c, 1, `scheduler:${by}`);
        generated.push({ commissionId: c.id, invoiceId: out.invoice.id, month: billed + 1, total: out.invoice.total });
        billed = Number(c.billedMonths || 0);
      } catch { break; }
    }
  }
  const ym = nowIso().slice(0, 7);
  for (const inv of db.invoices as any[]) {
    if (inv.status === 'Draft' && inv.billingPeriod && inv.billingPeriod <= ym) {
      inv.status = 'Issued'; inv.issueDate = nowIso(); inv.issuedBy = `scheduler:${by}`;
      issued.push({ invoiceId: inv.id, number: inv.number, billingPeriod: inv.billingPeriod });
      audit(by, `SCHEDULE_ISSUED:${inv.id}`, inv.orgId, 'invoice', inv.id, req.ip);
    }
  }
  persist();
  const { sendMail } = await import('../events/mailer.js');
  const body = `Billing schedule run: ${generated.length} monthly invoice(s) generated, ${issued.length} series draft(s) issued.`;
  db.notifications.unshift({ id: uid('NOTIF'), recipient: 'superadmin', kind: 'billing-schedule', body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: 'TNT-GLOBAL' });
  await sendMail('superadmin@nexatalent.com', `Billing schedule: ${generated.length} generated, ${issued.length} issued`, `<p>${body}</p>`, { kind: 'billing-schedule' });
  audit(by, `BILLING_SCHEDULE_RUN:+${generated.length}/~${issued.length}`, 'TNT-GLOBAL', 'billing', 'schedule', req.ip); persist();
  res.json({ success: true, data: { generated, issued } });
});
// ---- Recurring/monthly invoice series for companies ----
commercialRouter.post('/invoices/series', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const parsed = invoiceSeriesSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const d = parsed.data;
  const db = loadDb();
  const recId = uid('REC');
  const created: any[] = [];
  for (let ix = 0; ix < d.months; ix += 1) {
    const dt = new Date(`${d.startMonth}-01T00:00:00.000Z`);
    dt.setUTCMonth(dt.getUTCMonth() + ix);
    const y = dt.getUTCFullYear(); const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const lastDay = new Date(Date.UTC(y, dt.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
    const subtotal = Number(d.monthlyAmount);
    const tax = +((subtotal - d.discount) * d.taxRate / 100).toFixed(2);
    const total = +(subtotal - d.discount + tax).toFixed(2);
    const inv = {
      id: uid('INV'), number: `INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(4, '0')}`,
      orgId: d.orgId, agreementId: d.agreementId, paymentTermsDays: d.paymentTermsDays,
      invoiceType: d.months > 1 ? 'recurring' : 'monthly', recurrenceId: recId, recurrenceIndex: ix + 1, recurrenceTotal: d.months,
      billingPeriod: `${y}-${m}`,
      lines: [{ label: `${d.label} — ${y}-${m} (${ix + 1}/${d.months})`, qty: 1, unit: subtotal }],
      discount: d.discount, taxRate: d.taxRate, subtotal, tax, total, amountPaid: 0, balance: total,
      status: d.draft ? 'Draft' : 'Issued', issueDate: d.draft ? null : nowIso(), dueDate: lastDay,
      currency: 'INR', createdAt: nowIso(), createdBy: ctxOf(req).email,
    };
    db.invoices.unshift(inv);
    db.invoiceLines.unshift({ id: uid('INVL'), invoiceId: inv.id, label: inv.lines[0].label, qty: 1, unit: subtotal });
    created.push(inv);
  }
  audit(ctxOf(req).email, `INVOICE_SERIES:${recId}:${created.length}mo`, d.orgId, 'invoice', recId, req.ip); persist();
  res.status(201).json({ success: true, data: { recurrenceId: recId, invoices: created.map(withOverdue) } });
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
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.get('/reconciliation', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  const db = loadDb();
  const totalInvoiced = db.invoices.reduce((a: number, i: any) => a + Number(i.total || 0), 0);
  const totalPaid = db.payments.reduce((a: number, p: any) => a + Number(p.amount || 0), 0);
  res.json({ success: true, data: { totalInvoiced, totalPaid, outstanding: +(totalInvoiced - totalPaid).toFixed(2), invoices: db.invoices.length, payments: db.payments.length } });
});
