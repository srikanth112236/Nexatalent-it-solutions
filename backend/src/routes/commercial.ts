import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { createHmac, timingSafeEqual } from 'crypto';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, requirePermission, ctxOf, tenantOf, denyFinanceUnlessGranted, FINANCE_VIEWERS, isAllTenant } from '../middleware/rbac.js';
import { invoiceSchema, paymentSchema, commissionAgreementSchema, agreementTemplateSchema, feeSlabSchema, invoiceSeriesSchema, paginate, paged } from '../validate/schemas.js';
import { emit, claimIdempotency } from '../events/bus.js';
import { mailConfigured } from '../events/mailer.js';
import PDFDocument from 'pdfkit';
import { usageSummary, evaluate, consumeQuota } from '../domain/entitlements.js';

export const commercialRouter = Router();

// P5: server-side HTML strip for stored templates (mirrors frontend sanitizeHtml).
function stripHtml(html: string): string {
  let s = String(html || '');
  s = s.replace(/<script[\s\S]*?<\/script\s*>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style\s*>/gi, '');
  s = s.replace(/<\/?(iframe|object|embed|link|meta|base|form|input|button|textarea|select|option)\b[^>]*>/gi, '');
  s = s.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  return s.slice(0, 50000);
}

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
// Campaign detail: recipients + events + delivery stats (§8.7)
commercialRouter.get('/outreach/:id', requireAuth(), (req, res) => {
  const db = loadDb(); const t = tenantOf(req); const ctx = ctxOf(req);
  const camp: any = db.campaigns.find((c: any) => c.id === req.params.id);
  if (!camp) return res.status(404).json({ success: false, message: 'Campaign not found.' });
  if (!['superadmin','platform_owner'].includes(ctx.role) && camp.orgId !== t) return res.status(404).json({ success: false, message: 'Campaign not found.' });
  const recipients = (db.campaignRecipients as any[]).filter((r: any) => r.campaignId === camp.id);
  const events = (db.campaignEvents as any[]).filter((e: any) => e.campaignId === camp.id);
  const byStatus: Record<string, number> = {};
  for (const r of recipients) byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  res.json({ success: true, data: { ...camp, recipients: recipients.slice(0, 200), events: events.slice(0, 200), stats: { total: recipients.length, ...byStatus } } });
});
// Retry failed recipients (idempotent — already-queued addresses are skipped) (§8.7)
commercialRouter.post('/outreach/:id/retry', requireAuth(['employer','company_admin','company_recruiter','superadmin']), (req: Request, res: Response) => {
  const db = loadDb(); const t = tenantOf(req); const ctx = ctxOf(req);
  const camp: any = db.campaigns.find((c: any) => c.id === req.params.id);
  if (!camp) return res.status(404).json({ success: false, message: 'Campaign not found.' });
  if (!['superadmin','platform_owner'].includes(ctx.role) && camp.orgId !== t) return res.status(404).json({ success: false, message: 'Campaign not found.' });
  let requeued = 0;
  for (const r of (db.campaignRecipients as any[]).filter((x: any) => x.campaignId === camp.id && x.status === 'Failed')) {
    const key = `outreach:${camp.id}:${r.email}:retry`;
    if (claimIdempotency(key)) {
      try { consumeQuota(t, ctx.email, 'outreach.monthly_limit', 1, camp.id, key + ':quota'); } catch { continue; }
      r.status = 'Queued'; r.retriedAt = nowIso();
      db.campaignEvents.unshift({ id: uid('CMPE'), campaignId: camp.id, email: r.email, event: 'retry-queued', createdAt: nowIso() });
      requeued += 1;
    }
  }
  camp.status = 'Sent';
  audit(ctx.email, `OUTREACH_RETRY:${camp.id}x${requeued}`, camp.orgId, 'campaign', camp.id, req.ip); persist();
  res.json({ success: true, data: { ...camp, requeued } });
});

// ---- Invoices (Draft → Issued, immutable after issue §6.10) ----
function withOverdue(inv: any): any {
  const overdue = Number(inv.balance || 0) > 0 && inv.dueDate && new Date(inv.dueDate) < new Date() && !['Paid','Void','Credited','Draft'].includes(inv.status);
  const daysOverdue = overdue ? Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 864e5) : 0;
  return { ...inv, overdue: !!overdue, daysOverdue };
}
commercialRouter.get('/invoices', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().invoices as any[];
  if (!(FINANCE_VIEWERS as readonly string[]).includes(ctx.role)) rows = rows.filter((i) => i.orgId === ctx.tenantId);
  rows = rows.map(withOverdue);
  const q = String(req.query.q || '').toLowerCase();
  if (q) rows = rows.filter((i) => `${i.id} ${i.number} ${i.orgId} ${i.status} ${i.agreementId || ''}`.toLowerCase().includes(q));
  const status = String(req.query.status || '');
  if (status) rows = rows.filter((i) => (status === 'Overdue' ? !!i.overdue : i.status === status));
  // `view` = saved searches the UI offers as sub-menus (all | open | overdue | paid | draft | void).
  const view = String(req.query.view || '');
  if (view === 'open') rows = rows.filter((i) => Number(i.balance || 0) > 0 && ['Issued', 'Partially Paid'].includes(i.status));
  else if (view === 'overdue') rows = rows.filter((i) => !!i.overdue);
  else if (view === 'paid') rows = rows.filter((i) => i.status === 'Paid');
  else if (view === 'draft') rows = rows.filter((i) => i.status === 'Draft');
  else if (view === 'void') rows = rows.filter((i) => ['Void', 'Credited'].includes(i.status));
  const type = String(req.query.type || '');
  if (type) rows = rows.filter((i) => (i.invoiceType || 'one_time') === type);
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.get('/invoices/:id/document', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
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
  // P1-5: redact bodies for non-finance, paginate (was uncapped 200 slice).
  const canSeeBody = ['superadmin', 'platform_owner', 'finance_admin'].includes(ctx.role) || (ctx.permissions || []).includes('view_sensitive_fields');
  rows = rows.map((m: any) => (canSeeBody ? m : { ...m, html: m.html ? String(m.html).slice(0, 200) + '…[redacted]' : m.html, subject: m.subject }));
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
  const total = rows.length;
  return res.json({ success: true, data: rows.slice((page - 1) * pageSize, page * pageSize), pagination: { page, pageSize, total }, configured: mailConfigured() });
});
// ---- Server-generated PDFs (pdfkit, matches frontend HTML design) ----
function drawInvoiceHeader(pdf: any, d: any, pageWidth: number) {
  // Dark header band
  pdf.fillColor('#0A192F').rect(0, 0, pageWidth, 90).fill();
  pdf.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold').text('NexaTalent IT Solutions', 48, 22);
  pdf.fillColor('#94A3B8').fontSize(10).font('Helvetica').text('Talent acquisition services • GST invoicing', 48, 44);
  pdf.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text('TAX INVOICE', pageWidth - 120, 22, { align: 'right' });
  pdf.fillColor('#94A3B8').fontSize(10).font('Helvetica').text(d.number || d.id, pageWidth - 120, 44, { align: 'right' });
}

function drawSectionLabel(pdf: any, y: number, label: string) {
  pdf.fillColor('#475569').fontSize(9).font('Helvetica-Bold').text(label, 48, y);
  return y + 14;
}

commercialRouter.get('/invoices/:id/pdf', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role) && inv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const d = buildInvoiceDocument(db, inv);
  const pageWidth = 612; // US Letter width
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${d.number || d.id}.pdf"`);
  const pdf = new PDFDocument({ size: 'letter', margin: 0, info: { Title: `Tax Invoice ${d.number || d.id}` } });
  pdf.pipe(res);

  /* ============ HEADER BAND ============ */
  drawInvoiceHeader(pdf, d, pageWidth);

  let y = 118;

  /* ============ BILLED TO + INVOICE DETAILS (two columns) ============ */
  y = drawSectionLabel(pdf, y, 'Billed to');
  pdf.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text(d.billingEntity || d.organization?.legalName || d.orgId || 'NexaTalent Client', 48, y);
  y += 18;
  pdf.fillColor('#64748B').fontSize(8.5).font('Helvetica').text(`GSTIN not on file — collect before filing`, 48, y);
  y += 16;

  const detailsX = pageWidth - 48 - 220;
  y = drawSectionLabel(pdf, y, 'Invoice');
  const issued = String(d.issueDate || d.createdAt || '').slice(0, 10);
  const due = String(d.dueDate || '').slice(0, 10);
  pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`Issued ${issued} • Due ${due}`, detailsX, y);
  y += 14;
  pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`Status: ${d.status}${d.overdue ? ` • ${d.daysOverdue}d overdue` : ''}`, detailsX, y);
  y += 14;
  pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`Currency: ${d.currency || 'INR'}`, detailsX, y);
  y += 16;

  y = drawSectionLabel(pdf, y, 'Billing & terms');
  if (d.billingAddress) {
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(d.billingAddress, 48, y);
    y += 16;
  }
  if (d.billingPeriod) {
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`Billing period: ${d.billingPeriod}`, 48, y);
    y += 14;
  }
  if (d.subscriptionId) {
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`Subscription/service: ${d.subscriptionId}`, 48, y);
    y += 14;
  }
  if (d.agreement) {
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`Agreement ${d.agreement.id} • ${d.agreement.hiringType} @ ${d.agreement.rate}%`, 48, y);
    y += 16;
  }

  /* ============ ITEMIZED TABLE ============ */
  y += 6;
  const tableX = 48;
  const itemColX = tableX;
  const qtyColX = pageWidth - 130;
  const unitColX = pageWidth - 90;
  const amtColX = pageWidth - 48;

  pdf.fillColor('#0A192F').rect(tableX, y, pageWidth - 96, 24).fill();
  pdf.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold').text('Item', itemColX, y + 7, { width: qtyColX - itemColX - 10, align: 'left' });
  pdf.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold').text('Qty', qtyColX, y + 7, { width: unitColX - qtyColX - 10, align: 'right' });
  pdf.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold').text('Unit', unitColX, y + 7, { width: amtColX - unitColX - 10, align: 'right' });
  pdf.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold').text('Amount', amtColX, y + 7, { align: 'right' });
  y += 24;

  let lineY = y;
  for (const l of d.lines || []) {
    pdf.fillColor('#FFFFFF').rect(tableX, lineY, pageWidth - 96, 22).fill();
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(l.label || '', itemColX, lineY + 6, { width: qtyColX - itemColX - 10, align: 'left' });
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(String(l.qty || 1), qtyColX, lineY + 6, { width: unitColX - qtyColX - 10, align: 'right' });
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`₹${(l.unit || 0).toLocaleString('en-IN')}`, unitColX, lineY + 6, { width: amtColX - unitColX - 10, align: 'right' });
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold').text(`₹${((l.qty || 1) * (l.unit || 0)).toLocaleString('en-IN')}`, amtColX, lineY + 6, { align: 'right' });
    lineY += 22;
  }
  y = lineY + 10;

  /* ============ TOTALS (right column) ============ */
  const totalsX = pageWidth - 260;
  pdf.fillColor('#F1F5F9').rect(totalsX, y, 212, 150).fill();
  pdf.fillColor('#475569').fontSize(8.5).font('Helvetica-Bold').text('Amount Summary', totalsX + 14, y + 10);
  y += 30;
  const totalRows = [
    ['Subtotal', d.subtotal],
    ['Discount', -d.discount],
    [`Tax (GST @ ${d.taxRate ?? 18}%)`, d.tax],
    ['Total', d.total],
    ['Paid', d.amountPaid],
    ['Balance', d.balance],
  ];
  for (const [label, val] of totalRows) {
    const isTotal = label === 'Total';
    pdf.fillColor(isTotal ? '#0F172A' : '#64748B').fontSize(isTotal ? 10 : 8.5).font(isTotal ? 'Helvetica-Bold' : 'Helvetica').text(label, totalsX + 14, y);
    pdf.fillColor(isTotal ? '#0F172A' : '#64748B').fontSize(isTotal ? 10 : 8.5).font(isTotal ? 'Helvetica-Bold' : 'Helvetica').text(`₹${val.toLocaleString('en-IN')}`, totalsX + 14, y, { width: 190, align: 'right' });
    y += 18;
  }
  y += 10;

  /* ============ COMMERCIAL TERMS ============ */
  y = drawSectionLabel(pdf, y, 'Commercial terms');
  const terms = [
    d.terms?.paymentNote || `Payable within ${d.terms?.paymentTermsDays || 30} days of the candidate's joining date.`,
    d.terms?.replacementNote || 'Free replacement within 90 days of joining under the defined conditions.',
    d.terms?.gstNote || 'GST charged extra as applicable on the taxable value.',
    d.terms?.ownershipNote || 'Candidate ownership rests with the introducing party for 90 days from submission.',
    d.terms?.duplicateNote || 'Duplicate profiles are rejected; the earliest valid submission owns the candidate.',
  ];
  for (const t of terms) {
    if (!t) continue;
    pdf.fillColor('#0F172A').fontSize(8.5).font('Helvetica').text(`• ${t}`, 48, y, { width: pageWidth - 96 });
    y += 15;
  }

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
  const pageWidth = 612;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="Agreement-${ag.id}.pdf"`);
  const pdf = new PDFDocument({ size: 'letter', margin: 54, info: { Title: `Agreement ${ag.id}` } });
  pdf.pipe(res);

  pdf.fillColor('#0A192F').rect(0, 0, pageWidth, 70).fill();
  pdf.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold').text('Commission Agreement', 54, 22);
  pdf.fillColor('#94A3B8').fontSize(10).font('Helvetica').text(ag.orgId, 54, 44);
  pdf.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(`AGT-${ag.id}`, pageWidth - 120, 22, { align: 'right' });

  let ay = 100;
  pdf.fillColor('#475569').fontSize(9).font('Helvetica-Bold').text('Parties', 54, ay);
  ay += 14;
  pdf.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('Introducing Party (Agency)', 54, ay);
  pdf.fillColor('#64748B').fontSize(9).font('Helvetica').text(ag.orgId, 180, ay);
  ay += 14;
  pdf.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('Client (Organization)', 54, ay);
  pdf.fillColor('#64748B').fontSize(9).font('Helvetica').text(org?.legalName || org?.displayName || ag.orgId, 180, ay);
  ay += 20;

  pdf.fillColor('#475569').fontSize(9).font('Helvetica-Bold').text('Commercial Terms', 54, ay);
  ay += 14;
  const terms = [
    `Hiring type: ${ag.hiringType}`,
    `Fee model: ${ag.feeModel}`,
    `Rate: ${ag.rate}%`,
    `Basis: ${ag.basisType || 'annual_ctc'}`,
    `Contract months: ${ag.contractMonths || 12}`,
    `Trigger: ${ag.trigger || 'Joined'}`,
    `Payment terms: ${ag.paymentTermsDays || 30} days`,
    `Replacement window: ${ag.replacementDays || 90} days`,
  ];
  for (const t of terms) {
    pdf.fillColor('#0F172A').fontSize(9).font('Helvetica').text(`• ${t}`, 54, ay);
    ay += 14;
  }
  ay += 8;

  pdf.fillColor('#475569').fontSize(9).font('Helvetica-Bold').text('Agreement Body', 54, ay);
  ay += 14;
  for (const block of filled) {
    if (block.h) {
      pdf.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text(block.t, 54, ay);
      ay += 18;
    } else {
      pdf.fillColor('#0F172A').fontSize(9.5).font('Helvetica').text(block.t, 54, ay, { width: pageWidth - 108, lineGap: 2 });
      ay += 22;
    }
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
// Reminder rows exist in two shapes: seeded queue rows ({ channel, status, dueDate, createdAt })
// and runtime reminder logs ({ kind, daysOverdue, daysToDue, balance, sentAt, by }). Normalise
// both against the live invoice so the UI never has to guess (it previously rendered
// "due in undefinedd" and ₹0 for seeded rows).
function normalizeReminder(r: any, inv: any): any {
  const dueMs = new Date(r.dueDate ?? inv?.dueDate).getTime();
  const days = Number.isFinite(dueMs) ? Math.floor((dueMs - Date.now()) / 864e5) : null;
  const open = Number(inv?.balance ?? r.balance ?? 0) > 0;
  const kind = r.kind || (days === null ? 'due-soon' : days < 0 ? 'overdue' : 'due-soon');
  return {
    ...r,
    number: r.number ?? inv?.number ?? null,
    orgId: r.orgId ?? inv?.orgId ?? null,
    kind,
    daysToDue: days === null ? null : Math.max(0, days),
    daysOverdue: days === null ? 0 : Math.max(0, -days),
    dueDate: r.dueDate ?? inv?.dueDate ?? null,
    total: inv?.total ?? null,
    amountPaid: inv?.amountPaid ?? null,
    balance: inv?.balance ?? r.balance ?? 0,
    invoiceStatus: inv?.status ?? null,
    settled: !open,
    // Seeded queue rows have no send log — treat createdAt as queued-at and label the actor.
    sentAt: r.sentAt ?? r.createdAt ?? null,
    by: r.by ?? (r.channel ? `queued (${r.channel})` : 'system'),
  };
}
commercialRouter.get('/invoice-reminders', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const byId = new Map((db.invoices as any[]).map((i: any) => [i.id, i]));
  let rows = (db.invoiceReminders as any[]).map((r: any) => normalizeReminder(r, byId.get(r.invoiceId)));
  if (!(FINANCE_VIEWERS as readonly string[]).includes(ctx.role)) rows = rows.filter((r) => r.orgId === ctx.tenantId);
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q) rows = rows.filter((r) => `${r.id} ${r.number || ''} ${r.invoiceId} ${r.orgId} ${r.kind} ${r.by}`.toLowerCase().includes(q));
  const kind = String(req.query.kind || '');
  if (kind) rows = rows.filter((r) => r.kind === kind);
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
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
  const { paymentId, amount, reason, idempotencyKey } = req.body || {};
  const pay: any = db.payments.find((p: any) => p.id === paymentId);
  if (!pay) return res.status(404).json({ success: false, message: 'Payment not found.' });
  const amt = Number(amount || 0);
  if (!(amt > 0) || amt > Number(pay.amount || 0)) return res.status(400).json({ success: false, message: 'Invalid refund amount.' });
  // P0-2: cumulative over-refund guard — total refunded can never exceed payment.
  const already = Number(pay.refundedAmount || 0);
  if (already + amt > Number(pay.amount || 0) + 0.005) return res.status(422).json({ success: false, code: 'REFUND_EXCEEDS_PAYMENT', message: `Refund would exceed payment balance (already refunded ₹${already}).` });
  // P0-2: idempotency key must be caller-supplied opaque (min 12) — free-text
  // reason is audit-only and excluded so tweaking it can't bypass dedupe.
  const key = typeof idempotencyKey === 'string' && idempotencyKey.length >= 12
    ? `refund:${idempotencyKey}`
    : `refund:${paymentId}:${amt}`;
  if (!claimIdempotency(key)) return res.status(200).json({ success: true, message: 'Duplicate ignored (idempotent).' });
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
  // P2-8: validate amount + idempotency — negative/over-balance rejected, no silent floor.
  const amt = Number(req.body.amount || 0);
  if (!(amt > 0)) return res.status(400).json({ success: false, message: 'Credit amount must be positive.' });
  if (amt > Number(inv.balance || 0) + 0.005) return res.status(422).json({ success: false, code: 'CREDIT_EXCEEDS_BALANCE', message: `Credit exceeds outstanding balance of ₹${inv.balance}.` });
  const idem = typeof req.body.idempotencyKey === 'string' && req.body.idempotencyKey.length >= 12 ? `cn:${req.body.idempotencyKey}` : `cn:${inv.id}:${amt}:${String(req.body.reason || '').slice(0, 80)}`;
  if (!claimIdempotency(idem)) return res.status(200).json({ success: true, message: 'Duplicate ignored (idempotent).' });
  const cn = { id: uid('CN'), invoiceId: inv.id, amount: amt, reason: String(req.body.reason || '').slice(0, 500), createdAt: nowIso(), by: ctxOf(req).email };
  db.creditNotes.unshift(cn);
  inv.balance = Math.max(0, +(inv.balance - cn.amount).toFixed(2));
  if (inv.balance === 0) inv.status = 'Credited';
  audit(ctxOf(req).email, `CREDIT_NOTE:${cn.id}`, inv.orgId, 'invoice', inv.id, req.ip); persist();
  res.status(201).json({ success: true, data: cn });
});

// ---- Payments (webhook-verified, idempotent §6.9/§15.3) ----
commercialRouter.get('/payments', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().payments as any[];
  if (!(FINANCE_VIEWERS as readonly string[]).includes(ctx.role)) rows = rows.filter((p) => p.orgId === ctx.tenantId);
  const qq = String(req.query.q || '').toLowerCase();
  if (qq) rows = rows.filter((p) => `${p.id} ${p.invoiceId} ${p.orgId} ${p.status}`.toLowerCase().includes(qq));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.post('/payments', requireAuth(), denyFinanceUnlessGranted, (req: Request, res: Response) => {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  if (!claimIdempotency(`pay:${parsed.data.idempotencyKey}`)) return res.status(200).json({ success: true, message: 'Duplicate ignored (idempotent).' });
  const db = loadDb(); const inv: any = db.invoices.find((i: any) => i.id === parsed.data.invoiceId);
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  // Phase D: no overpayments — amounts beyond the outstanding balance are rejected.
  if (Number(parsed.data.amount) > Number(inv.balance || 0) + 0.005) {
    return res.status(422).json({ success: false, code: 'PAYMENT_EXCEEDS_BALANCE', message: `Amount exceeds the outstanding balance of ₹${inv.balance}.` });
  }
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','finance_admin','finance_staff'].includes(ctx.role) && inv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  const pay = { id: uid('PAY'), orgId: inv.orgId, status: 'succeeded', transactionDate: nowIso(), ...parsed.data, createdAt: nowIso() };
  db.payments.unshift(pay);
  db.allocations.unshift({ id: uid('ALC'), paymentId: pay.id, invoiceId: inv.id, amount: parsed.data.amount, createdAt: nowIso() });
  audit(ctxOf(req).email, `PAYMENT_CONFIRMED:${pay.id}`, inv.orgId, 'payment', pay.id, req.ip); persist();
  emit('payment.confirmed', { invoiceId: inv.id, amount: parsed.data.amount }, inv.orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: pay });
});
commercialRouter.post('/payments/webhook', rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false }), (req: Request, res: Response) => {
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
  // P0-2: same over-balance guard as manual route — webhooks can't overpay.
  if (!(Number(amount) > 0)) return res.status(400).json({ success: false, message: 'Invalid amount.' });
  if (Number(amount) > Number(inv.balance || 0) + 0.005) {
    return res.status(422).json({ success: false, code: 'PAYMENT_EXCEEDS_BALANCE', message: `Amount exceeds the outstanding balance of ₹${inv.balance}.` });
  }
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
commercialRouter.get('/fee-slabs', requireAuth(), denyFinanceUnlessGranted, (_req, res) => {
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
  const ctx = ctxOf(req);
  // P0-2: tenant isolation — company roles can only create inside their own org.
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role) && parsed.data.orgId !== ctx.tenantId) {
    return res.status(403).json({ success: false, message: 'Cannot create agreements for another organization.' });
  }
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
commercialRouter.get('/agreement-templates', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().agreementTemplates as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((t) => t.status === 'Active' && (!t.orgId || t.orgId === ctx.tenantId));
  res.json({ success: true, data: rows });
});
commercialRouter.post('/agreement-templates', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('manage_billing'), (req: Request, res: Response) => {
  const parsed = agreementTemplateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const db = loadDb();
  // P5: strip scripts/event-handlers from stored template HTML.
  const clean = { ...parsed.data } as any;
  if (typeof clean.bodyHtml === 'string') clean.bodyHtml = stripHtml(clean.bodyHtml);
  const t = { id: uid('AGT'), version: 1, status: 'Draft', history: [], createdBy: ctxOf(req).email, createdAt: nowIso(), ...clean };
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
  // P5: sanitize updated HTML fields.
  if (typeof (terms as any).bodyHtml === 'string') (terms as any).bodyHtml = stripHtml((terms as any).bodyHtml);
  for (const k of ['ownershipClause', 'duplicatePolicy', 'cancellationTerms', 'gstNote'] as const) {
    if (typeof (terms as any)[k] === 'string') (terms as any)[k] = String((terms as any)[k]).slice(0, 2000);
  }
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
  if (!isAllTenant(ctx.role) && ctx.role !== 'finance_admin' && app.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Application not found.' });
  const agreement = matchAgreement(db, app);
  if (!agreement) return res.status(422).json({ success: false, code: 'NO_AGREEMENT', message: 'No accepted commercial agreement covers this hire. Ask your NexaTalent manager to activate one before recording the joining.' });
  const offer: any = db.offers.filter((o: any) => o.applicationId === app.id).sort((x: any, y: any) => String(y.createdAt).localeCompare(String(x.createdAt)))[0] || null;
  const feeBasis = Number(req.query.feeBasis || 0) || Number(offer?.ctc || 0);
  if (!(feeBasis > 0)) return res.status(422).json({ success: false, code: 'NO_BASIS', message: 'No CTC on record for this application. Enter the fee basis (annual CTC, or monthly CTC for contract hires).', agreement });
  res.json({ success: true, data: { application: { id: app.id, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail }, agreement, offer: offer ? { id: offer.id, ctc: offer.ctc } : null, preview: feePreview(agreement, feeBasis) } });
});
commercialRouter.get('/commission-agreements', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().commissionAgreements as any[];
  if (!['superadmin','platform_owner','finance_admin'].includes(ctx.role)) rows = rows.filter((a) => a.orgId === ctx.tenantId);
  const q = String(req.query.q || '').toLowerCase();
  if (q) rows = rows.filter((a) => `${a.id} ${a.orgId} ${a.hiringType || ''} ${a.status || ''}`.toLowerCase().includes(q));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.get('/commissions', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().commissions as any[];
  if (!(FINANCE_VIEWERS as readonly string[]).includes(ctx.role)) rows = rows.filter((c) => c.orgId === ctx.tenantId || c.agencyId === ctx.tenantId);
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
commercialRouter.get('/commissions/check', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
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
  // P0-2: double-payout guard — one payout per commission, status-checked.
  if (com.paymentStatus === 'Paid' || (db.payouts as any[]).some((p: any) => p.commissionId === com.id)) {
    return res.status(409).json({ success: false, code: 'PAYOUT_EXISTS', message: 'Payout already processed for this commission.' });
  }
  if (!(Number(com.net || 0) > 0)) return res.status(422).json({ success: false, message: 'Nothing payable on this commission.' });
  const payout = { id: uid('PO'), commissionId: com.id, amount: com.net, status: 'Processed', settlementDate: nowIso(), createdAt: nowIso(), by: ctxOf(req).email };
  db.payouts.unshift(payout); com.paymentStatus = 'Paid';
  audit(ctxOf(req).email, `PAYOUT_PROCESSED:${payout.id}`, com.orgId, 'payout', payout.id, req.ip); persist();
  res.status(201).json({ success: true, data: payout });
});
commercialRouter.get('/payouts', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().payouts as any[];
  // Payouts carry the commission's org scope; non-finance roles see only their org.
  // Contractor payouts (payroll leg) carry orgId/vendorTenant/candidateEmail instead.
  if (!(FINANCE_VIEWERS as readonly string[]).includes(ctx.role)) {
    const comIds = new Set(loadDb().commissions.filter((c: any) => c.orgId === ctx.tenantId || c.agencyId === ctx.tenantId).map((c: any) => c.id));
    rows = rows.filter((p: any) => comIds.has(p.commissionId) || p.orgId === ctx.tenantId || p.vendorTenant === ctx.tenantId || String(p.candidateEmail || '').toLowerCase() === String(ctx.email).toLowerCase());
  }
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
// Phase 6.2: payout statement — printable JSON (payout + commission + agreement + invoices).
commercialRouter.get('/payouts/:id/statement', requireAuth(), denyFinanceUnlessGranted, (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const p: any = db.payouts.find((x: any) => x.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Payout not found.' });
  const com: any = p.commissionId ? db.commissions.find((c: any) => c.id === p.commissionId) : null;
  if (!(FINANCE_VIEWERS as readonly string[]).includes(ctx.role)) {
    const mine = (com && (com.orgId === ctx.tenantId || com.agencyId === ctx.tenantId)) || p.orgId === ctx.tenantId || p.vendorTenant === ctx.tenantId || String(p.candidateEmail || '').toLowerCase() === String(ctx.email).toLowerCase();
    if (!mine) return res.status(404).json({ success: false, message: 'Payout not found.' });
  }
  const ag: any = com?.agreementId ? db.commissionAgreements.find((a: any) => a.id === com.agreementId) : null;
  const invoices = com ? db.invoices.filter((i: any) => (com.invoiceIds || []).includes(i.id) || i.id === com.invoiceId) : [];
  res.json({ success: true, data: { payout: p, commission: com, agreement: ag ? { id: ag.id, hiringType: ag.hiringType, rate: ag.rate, paymentTermsDays: ag.paymentTermsDays, replacementDays: ag.replacementDays } : null, invoices: invoices.map((i: any) => ({ id: i.id, number: i.number, status: i.status, total: i.total, balance: i.balance })), generatedAt: nowIso() } });
});
// Phase 6.2: commission clawback — replacement-window recovery as a negative adjustment.
// Receivables (company) and payables (agency) stay separate legs; the adjustment recomputes both.
commercialRouter.post('/commissions/:id/clawback', requireAuth(['superadmin','platform_owner','finance_admin']), requirePermission('adjust_commission'), (req: Request, res: Response) => {
  const db = loadDb(); const c: any = db.commissions.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Commission not found.' });
  const amount = Number(req.body?.amount);
  const reason = String(req.body?.reason || '').slice(0, 1000);
  if (!reason.trim()) return res.status(400).json({ success: false, message: 'Clawback reason required (audit).' });
  if (!(amount > 0)) return res.status(400).json({ success: false, message: 'Positive clawback amount required.' });
  if (amount > Number(c.net ?? c.total ?? 0)) return res.status(422).json({ success: false, message: 'Clawback exceeds commission net.' });
  // Replacement-window guard: placement joinDate + agreement replacementDays.
  const pl: any = c.placementId ? db.placements.find((x: any) => x.id === c.placementId) : db.placements.find((x: any) => x.applicationId === c.applicationId);
  const ag: any = c.agreementId ? db.commissionAgreements.find((x: any) => x.id === c.agreementId) : null;
  const windowDays = Number(ag?.replacementDays ?? 90);
  if (pl?.joinDate && !req.body?.override) {
    const elapsed = (Date.now() - new Date(pl.joinDate).getTime()) / 864e5;
    if (elapsed > windowDays) return res.status(422).json({ success: false, code: 'WINDOW_EXPIRED', message: `Replacement window expired (${Math.floor(elapsed)}d > ${windowDays}d). Pass override:true with finance approval to proceed.` });
  }
  if (!claimIdempotency(`clawback:${c.id}:${amount}:${reason}`)) return res.status(200).json({ success: true, message: 'Duplicate ignored (idempotent).' });
  const row = { id: uid('ADJ'), commissionId: c.id, amount: -Math.round(amount * 100) / 100, reason: `CLAWBACK: ${reason.trim()}`, type: 'clawback', by: ctxOf(req).email, createdAt: nowIso() };
  db.commissionAdjustments.unshift(row);
  c.adjustments = +(Number(c.adjustments || 0) + row.amount).toFixed(2);
  const gross = +(Number(c.gross || 0) + row.amount).toFixed(2);
  c.tax = +(gross * 0.18).toFixed(2);
  c.total = +(gross * 1.18).toFixed(2);
  c.net = c.total;
  c.clawback = true;
  audit(ctxOf(req).email, `COMMISSION_CLAWBACK:${c.id}:${row.amount}`, c.orgId, 'commission', c.id, req.ip); persist();
  emit('commission.clawback', { commissionId: c.id, amount: row.amount, reason }, c.orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: { adjustment: row, commission: c } });
});
/* ---------------- Contract payroll: approved timesheets → staffing invoice + contractor payouts ----------------
   Sync chain: vendor submits → company approves → finance runs payroll (ONE run per org+period, idempotent)
   → staffing invoice (Company→NexaTalent, +18% GST) + contractor payouts @82% (NexaTalent→candidate, Payable)
   → company pays invoice → settle marks payouts Processed. Rejected timesheets are excluded. */
const PAYROLL_GUARD = [requireAuth(['superadmin', 'platform_owner', 'finance_admin']), requirePermission('manage_billing')];
// Timesheet rules: platform defaults (settings.payrollRules, superadmin-owned),
// overridable per organization (org.payrollRules, employer-set via tenant PATCH).
export function payrollRulesFor(db: any, orgId: string): { standardHours: number; overtimeMultiplier: number; payoutPercent: number; taxRate: number } {
  const d = { standardHours: 160, overtimeMultiplier: 1.5, payoutPercent: 82, taxRate: 18 };
  const org: any = db.organizations.find((o: any) => o.id === orgId);
  return { ...d, ...(db.settings?.payrollRules || {}), ...((org as any)?.payrollRules || {}) };
}
// Per-timesheet math: regular hours + overtime premium. Returns {regHrs, otHrs, amount}.
export function timesheetComputed(t: any, rules: { standardHours: number; overtimeMultiplier: number }): { regHrs: number; otHrs: number; amount: number } {
  const hours = Number(t.hours || 0);
  const rate = Number(t.hourlyRate ?? 0);
  const regHrs = Math.min(hours, rules.standardHours);
  const otHrs = Math.max(0, hours - rules.standardHours);
  const amount = +(regHrs * rate + otHrs * rate * rules.overtimeMultiplier).toFixed(2);
  return { regHrs, otHrs, amount };
}
function payrollStage(db: any, run: any): 'Issued' | 'Paid' | 'Settled' {
  const inv: any = db.invoices.find((i: any) => i.id === run.invoiceId);
  const allocated = (db.allocations as any[]).filter((a: any) => a.invoiceId === run.invoiceId).reduce((s: number, a: any) => s + Number(a.amount || 0), 0);
  const paid = inv && allocated + 0.005 >= Number(inv.total || 0);
  const payouts = (db.payouts as any[]).filter((p: any) => p.payrollRunId === run.id);
  const settled = paid && payouts.length > 0 && payouts.every((p: any) => p.status === 'Processed');
  return settled ? 'Settled' : paid ? 'Paid' : 'Issued';
}
function scopePayrollRuns(db: any, ctx: any): any[] {
  let rows = (db.payrollRuns as any[]) || [];
  if ((FINANCE_VIEWERS as readonly string[]).includes(ctx.role)) return rows;
  return rows.filter((r: any) => {
    if (r.orgId === ctx.tenantId) return true;
    const ts = (db.timesheets as any[]).filter((t: any) => (r.timesheetIds || []).includes(t.id));
    if (ts.some((t: any) => t.vendorTenant === ctx.tenantId || t.submittedBy === ctx.email)) return true;
    const po = (db.payouts as any[]).filter((p: any) => p.payrollRunId === r.id);
    return po.some((p: any) => String(p.candidateEmail || '').toLowerCase() === String(ctx.email).toLowerCase());
  });
}
commercialRouter.get('/payroll/preview', ...PAYROLL_GUARD, (req: Request, res: Response) => {
  const db = loadDb();
  const orgId = String(req.query.orgId || '');
  const period = String(req.query.period || '');
  if (!orgId || !/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) return res.status(400).json({ success: false, message: 'orgId + period (YYYY-MM) required.' });
  const billed = new Set<string>();
  for (const r of (db.payrollRuns as any[]) || []) for (const id of r.timesheetIds || []) billed.add(id);
  const open = (db.timesheets as any[]).filter((t: any) => t.orgId === orgId || t.clientTenant === orgId).filter((t: any) => t.period === period && t.status === 'Approved' && !billed.has(t.id));
  const rules = payrollRulesFor(db, orgId);
  const byContractor = new Map<string, any>();
  for (const t of open) {
    const calc = timesheetComputed(t, rules);
    const e = byContractor.get(t.contractorId) || { contractorId: t.contractorId, contractorName: t.contractorName, hours: 0, regHrs: 0, otHrs: 0, amount: 0, timesheets: 0 };
    e.hours += Number(t.hours || 0); e.regHrs += calc.regHrs; e.otHrs += calc.otHrs; e.amount = +(e.amount + calc.amount).toFixed(2); e.timesheets += 1;
    byContractor.set(t.contractorId, e);
  }
  const subtotal = +[...byContractor.values()].reduce((s: number, e: any) => s + e.amount, 0).toFixed(2);
  const tax = +(subtotal * rules.taxRate / 100).toFixed(2);
  res.json({ success: true, data: { orgId, period, rules, timesheets: open.length, contractors: [...byContractor.values()], subtotal, tax, total: +(subtotal + tax).toFixed(2), payoutTotal: +(subtotal * rules.payoutPercent / 100).toFixed(2) } });
});
export function createPayrollRun(db: any, orgId: string, period: string, by: string): { run: any; invoice: any; payoutIds: string[] } {
  const fail = (status: number, message: string, extra: any = {}): never => { throw { status, message, ...extra }; };
  if (!orgId || !/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) fail(400, 'orgId + period (YYYY-MM) required.');
  const org: any = db.organizations.find((o: any) => o.id === orgId);
  if (!org) fail(404, 'Organization not found.');
  const existing: any = ((db.payrollRuns as any[]) || []).find((r: any) => r.orgId === orgId && r.period === period);
  if (existing) fail(409, `Payroll already ran for ${orgId} ${period}.`, { run: existing });
  const billed = new Set<string>();
  for (const r of (db.payrollRuns as any[]) || []) for (const id of r.timesheetIds || []) billed.add(id);
  const open = (db.timesheets as any[]).filter((t: any) => t.orgId === orgId || t.clientTenant === orgId).filter((t: any) => t.period === period && t.status === 'Approved' && !billed.has(t.id));
  if (open.length === 0) fail(422, `No approved unbilled timesheets for ${orgId} ${period}.`);
  const rules = payrollRulesFor(db, orgId);
  const perContractor = new Map<string, any>();
  for (const t of open) {
    const calc = timesheetComputed(t, rules);
    const e = perContractor.get(t.contractorId) || { contractorId: t.contractorId, contractorName: t.contractorName, candidateEmail: '', vendorTenant: t.vendorTenant, hours: 0, regHrs: 0, otHrs: 0, amount: 0, ids: [] as string[] };
    const c: any = db.contractors.find((x: any) => x.id === t.contractorId);
    e.candidateEmail = e.candidateEmail || (c as any)?.candidateEmail || '';
    e.hours += Number(t.hours || 0); e.regHrs += calc.regHrs; e.otHrs += calc.otHrs; e.amount = +(e.amount + calc.amount).toFixed(2); e.ids.push(t.id);
    perContractor.set(t.contractorId, e);
  }
  const subtotal = +[...perContractor.values()].reduce((s: number, e: any) => s + e.amount, 0).toFixed(2);
  const tax = +(subtotal * rules.taxRate / 100).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const [y, m] = period.split('-').map(Number);
  const dueDate = new Date(Date.UTC(y, m, 0) + 15 * 864e5).toISOString().slice(0, 10);
  const runId = uid('PR');
  const payPct = rules.payoutPercent / 100;
  const inv = {
    id: uid('INV'), number: `INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(4, '0')}`,
    orgId, payrollRunId: runId, invoiceType: 'contract_staffing', billingPeriod: period,
    lines: [...perContractor.values()].map((e: any) => ({ label: `Contract staffing ${period} — ${e.contractorName} (${e.hours}h: ${e.regHrs} reg + ${e.otHrs} OT)`, qty: e.hours, unit: +(e.amount / Math.max(1, e.hours)).toFixed(2) })),
    discount: 0, taxRate: rules.taxRate, subtotal, tax, total, amountPaid: 0, balance: total,
    status: 'Issued', issueDate: nowIso(), dueDate, currency: 'INR', createdAt: nowIso(), createdBy: by,
    rules: { ...rules },
  };
  db.invoices.unshift(inv);
  db.invoiceLines.unshift({ id: uid('INVL'), invoiceId: inv.id, label: `Contract staffing ${period} — consolidated`, qty: 1, unit: subtotal });
  const payoutIds: string[] = [];
  const vendorMails = new Set<string>(); const candidateMails = new Set<string>();
  for (const e of perContractor.values()) {
    const po = {
      id: uid('PO'), type: 'contractor_payout', payrollRunId: runId, orgId, period,
      contractorId: e.contractorId, contractorName: e.contractorName, candidateEmail: e.candidateEmail,
      vendorTenant: e.vendorTenant, amount: +(e.amount * payPct).toFixed(2), status: 'Payable', createdAt: nowIso(), by,
    };
    db.payouts.unshift(po); payoutIds.push(po.id);
    for (const t of open.filter((x: any) => x.contractorId === e.contractorId)) {
      if (t.submittedBy) vendorMails.add(String(t.submittedBy).toLowerCase());
    }
    if (e.candidateEmail) candidateMails.add(String(e.candidateEmail).toLowerCase());
  }
  const run = { id: runId, orgId, period, timesheetIds: open.map((t: any) => t.id), subtotal, tax, total, payoutTotal: +[...perContractor.values()].reduce((s: number, e: any) => s + e.amount * payPct, 0).toFixed(2), invoiceId: inv.id, payoutIds, status: 'Issued', runBy: by, createdAt: nowIso(), rules: { ...rules } };
  for (const t of open) t.payrollRunId = runId;
  (db.payrollRuns as any[]).unshift(run);
  audit(by, `PAYROLL_RUN:${runId}:${orgId}:${period}`, orgId, 'payroll', runId, '127.0.0.1');
  audit(by, `PAYROLL_INVOICED:${inv.id}`, orgId, 'invoice', inv.id, '127.0.0.1');
  const notify = (recipient: string, body: string) => db.notifications.unshift({ id: uid('NOTIF'), recipient, kind: 'payroll', body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: orgId });
  notify(`company:${orgId}`, `Payroll ${period}: ${open.length} timesheet(s), staffing invoice ${inv.number} for ₹${total.toLocaleString('en-IN')} — due ${dueDate}.`);
  notify('superadmin', `Payroll run ${runId} for ${orgId} ${period}: invoice ${inv.number}, ${payoutIds.length} contractor payout(s).`);
  for (const v of vendorMails) notify(v, `Payroll ${period} for ${orgId} is issued — invoice ${inv.number}, your timesheets are billed.`);
  for (const cm of candidateMails) notify(cm, `Your ${period} pay is calculated — ₹${run.payoutTotal.toLocaleString('en-IN')} across ${payoutIds.length} payout(s), released once ${orgId} pays invoice ${inv.number}.`);
  persist();
  return { run, invoice: inv, payoutIds };
}
commercialRouter.post('/payroll/run', ...PAYROLL_GUARD, (req: Request, res: Response) => {
  const db = loadDb();
  try {
    const out = createPayrollRun(db, String(req.body?.orgId || ''), String(req.body?.period || ''), ctxOf(req).email);
    res.status(201).json({ success: true, data: { run: { ...out.run, stage: 'Issued' as const }, invoice: withOverdue(out.invoice), payouts: out.payoutIds.length } });
  } catch (e: any) {
    if (e?.status === 409 && e?.run) {
      const existing = e.run;
      return res.json({ success: true, data: { deduped: true, run: { ...existing, stage: payrollStage(db, existing) } }, message: `Payroll already ran for ${existing.orgId} ${existing.period} — returning existing run (no double billing).` });
    }
    res.status(e?.status || 500).json({ success: false, message: e?.message || 'Payroll run failed.' });
  }
});
commercialRouter.get('/payroll', requireAuth(), denyFinanceUnlessGranted, (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const rows = scopePayrollRuns(db, ctx).map((r: any) => ({ ...r, stage: payrollStage(db, r) }));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
commercialRouter.get('/payroll/:id', requireAuth(), denyFinanceUnlessGranted, (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const run: any = scopePayrollRuns(db, ctx).find((r: any) => r.id === req.params.id);
  if (!run) return res.status(404).json({ success: false, message: 'Payroll run not found.' });
  const timesheets = (db.timesheets as any[]).filter((t: any) => (run.timesheetIds || []).includes(t.id));
  const invoice: any = db.invoices.find((i: any) => i.id === run.invoiceId);
  const payouts = (db.payouts as any[]).filter((p: any) => p.payrollRunId === run.id);
  const allocated = (db.allocations as any[]).filter((a: any) => a.invoiceId === run.invoiceId).reduce((s: number, a: any) => s + Number(a.amount || 0), 0);
  // Linked placement commissions: contractors' placementIds tie monthly payroll to joining fees.
  const placementIds = new Set(timesheets.map((t: any) => (db.contractors as any[]).find((c: any) => c.id === t.contractorId)?.placementId).filter(Boolean));
  const commissions = (db.commissions as any[]).filter((c: any) => placementIds.has(c.placementId) || placementIds.has(c.applicationId));
  res.json({ success: true, data: { run: { ...run, stage: payrollStage(db, run) }, timesheets, invoice: invoice ? withOverdue(invoice) : null, allocated: +allocated.toFixed(2), payouts, commissions } });
});
commercialRouter.post('/payroll/:id/settle', ...PAYROLL_GUARD, (req: Request, res: Response) => {
  const db = loadDb(); const by = ctxOf(req).email;
  const run: any = ((db.payrollRuns as any[]) || []).find((r: any) => r.id === req.params.id);
  if (!run) return res.status(404).json({ success: false, message: 'Payroll run not found.' });
  const inv: any = db.invoices.find((i: any) => i.id === run.invoiceId);
  if (!inv) return res.status(422).json({ success: false, message: 'Linked invoice missing.' });
  const allocated = (db.allocations as any[]).filter((a: any) => a.invoiceId === inv.id).reduce((s: number, a: any) => s + Number(a.amount || 0), 0);
  const remaining = +(Number(inv.total || 0) - allocated).toFixed(2);
  if (remaining > 0.005) return res.status(422).json({ success: false, code: 'INVOICE_UNPAID', message: `Collect the company payment first — ₹${remaining.toLocaleString('en-IN')} outstanding on ${inv.number}.` });
  inv.amountPaid = Number(inv.total || 0); inv.balance = 0; inv.status = 'Paid'; inv.paidAt = nowIso();
  const payouts = (db.payouts as any[]).filter((p: any) => p.payrollRunId === run.id);
  for (const p of payouts) { p.status = 'Processed'; p.settlementDate = nowIso(); p.settledBy = by; }
  run.status = 'Settled'; run.settledAt = nowIso(); run.settledBy = by;
  audit(by, `PAYROLL_SETTLED:${run.id}`, run.orgId, 'payroll', run.id, req.ip);
  const notify = (recipient: string, body: string) => db.notifications.unshift({ id: uid('NOTIF'), recipient, kind: 'payroll', body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: run.orgId });
  notify(`company:${run.orgId}`, `Payroll ${run.period} settled — invoice ${inv.number} paid, ${payouts.length} contractor payout(s) released.`);
  for (const p of payouts) {
    if ((p as any).vendorTenant) notify(`company:${(p as any).vendorTenant}`, `Payout ${p.id} (${run.period}, ₹${Number((p as any).amount || 0).toLocaleString('en-IN')}) processed.`);
    if ((p as any).candidateEmail) notify((p as any).candidateEmail, `Your ${run.period} pay of ₹${Number((p as any).amount || 0).toLocaleString('en-IN')} is processed.`);
  }
  persist();
  res.json({ success: true, data: { run: { ...run, stage: 'Settled' as const }, payoutsSettled: payouts.length } });
});
commercialRouter.get('/reconciliation', requireAuth(['superadmin','platform_owner','finance_admin']), (_req, res) => {
  const db = loadDb();
  const totalInvoiced = db.invoices.reduce((a: number, i: any) => a + Number(i.total || 0), 0);
  const totalPaid = db.payments.reduce((a: number, p: any) => a + Number(p.amount || 0), 0);
  res.json({ success: true, data: { totalInvoiced, totalPaid, outstanding: +(totalInvoiced - totalPaid).toFixed(2), invoices: db.invoices.length, payments: db.payments.length } });
});
