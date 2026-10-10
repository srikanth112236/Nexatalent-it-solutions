import { Router, Request, Response } from 'express';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, requirePermission, ctxOf } from '../middleware/rbac.js';
import { paginate, paged } from '../validate/schemas.js';

export const extendedRouter = Router();
const UPLOAD_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data', 'uploads');
function ensureUploadDir() { if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true }); }

const PLATFORM = ['superadmin', 'platform_owner'];

/* ---------------- Skills taxonomy (§14.2) ---------------- */
extendedRouter.get('/skills', requireAuth(), (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  let rows = loadDb().skills as any[];
  if (q) rows = rows.filter((s) => String(s.name).toLowerCase().includes(q));
  res.json({ success: true, data: rows.slice(0, 100) });
});
extendedRouter.post('/skills', requireAuth(['superadmin', 'platform_owner', 'operations_admin', 'employee']), (req: Request, res: Response) => {
  const { name, category } = req.body || {};
  if (!name || !String(name).trim()) return res.status(400).json({ success: false, message: 'Skill name required.' });
  const db = loadDb();
  const dup = db.skills.find((s: any) => String(s.name).toLowerCase() === String(name).toLowerCase());
  if (dup) return res.status(409).json({ success: false, message: 'Skill already exists.', data: dup });
  const row = { id: uid('SKL'), name: String(name).trim(), category: category ? String(category) : 'Technology', createdAt: nowIso(), by: ctxOf(req).email };
  db.skills.unshift(row); persist();
  res.status(201).json({ success: true, data: row });
});

/* ---------------- Documents: upload / list / download (§7.1 resume) ---------------- */
const ALLOWED_MIME = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
const MAX_DOC_BYTES = 5 * 1024 * 1024;
extendedRouter.post('/documents', requireAuth(['candidate', 'superadmin', 'agency_recruiter', 'agency_admin', 'recruiter', 'vendor', 'employer', 'company_admin']), (req: Request, res: Response) => {
  const { name, mime, data, candidateEmail, applicationId, kind } = req.body || {};
  if (!name || !mime || !data) return res.status(400).json({ success: false, message: 'name + mime + data (base64) required.' });
  if (!ALLOWED_MIME.includes(mime)) return res.status(415).json({ success: false, message: `Unsupported type. Allowed: ${ALLOWED_MIME.join(', ')}` });
  let buf: Buffer;
  try { buf = Buffer.from(String(data), 'base64'); } catch { return res.status(400).json({ success: false, message: 'Invalid base64.' }); }
  if (buf.length === 0 || buf.length > MAX_DOC_BYTES) return res.status(413).json({ success: false, message: 'File must be 1 byte – 5 MB.' });
  const ctx = ctxOf(req);
  const owner = candidateEmail ? String(candidateEmail).toLowerCase() : ctx.email.toLowerCase();
  if (ctx.role === 'candidate' && owner !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Not found.' });
  ensureUploadDir();
  const db = loadDb();
  const row = { id: uid('DOC'), name: String(name).slice(0, 160), mime, size: buf.length, version: 1, kind: kind || 'resume', ownerEmail: owner, orgId: ctx.tenantId, applicationId: applicationId || null, uploadedAt: nowIso(), uploadedBy: ctx.email };
  const prev = db.documents.filter((d: any) => d.ownerEmail === owner && d.kind === row.kind).length;
  row.version = prev + 1;
  writeFileSync(join(UPLOAD_DIR, `${row.id}.bin`), buf);
  db.documents.unshift(row);
  // link latest resume onto the profile
  if (row.kind === 'resume') {
    const p: any = db.candidateProfiles.find((x: any) => String(x.email).toLowerCase() === owner);
    if (p) { p.resumeRef = row.id; p.resumeVersion = row.version; p.updatedAt = nowIso(); }
  }
  audit(ctx.email, `DOCUMENT_UPLOADED:${row.id}`, ctx.tenantId, 'document', row.id, req.ip); persist();
  const { ...pub } = row;
  res.status(201).json({ success: true, data: pub });
});
extendedRouter.get('/documents', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().documents as any[];
  if (ctx.role === 'candidate') rows = rows.filter((d) => String(d.ownerEmail).toLowerCase() === ctx.email.toLowerCase());
  else if (![...PLATFORM, 'operations_admin', 'employee'].includes(ctx.role)) rows = rows.filter((d) => d.orgId === ctx.tenantId);
  res.json({ success: true, data: rows.map(({ ...d }) => d) });
});
extendedRouter.get('/documents/:id/download', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const d: any = db.documents.find((x: any) => x.id === req.params.id);
  if (!d) return res.status(404).json({ success: false, message: 'Not found.' });
  if (ctx.role === 'candidate' && String(d.ownerEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Not found.' });
  if (![...PLATFORM, 'operations_admin', 'employee'].includes(ctx.role) && d.orgId !== ctx.tenantId && String(d.ownerEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Not found.' });
  try {
    const buf = readFileSync(join(UPLOAD_DIR, `${d.id}.bin`));
    res.setHeader('Content-Type', d.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${String(d.name).replace(/"/g, '')}"`);
    res.send(buf);
  } catch { res.status(410).json({ success: false, message: 'File no longer available.' }); }
});

/* ---------------- Consent center (§15.2) ---------------- */
extendedRouter.get('/consents', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().consents as any[];
  if (!PLATFORM.includes(ctx.role)) rows = rows.filter((c) => String(c.email).toLowerCase() === ctx.email.toLowerCase());
  res.json({ success: true, data: rows });
});
extendedRouter.put('/consents', requireAuth(['candidate', 'superadmin']), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const email = ctx.role === 'candidate' ? ctx.email.toLowerCase() : String(req.body.email || ctx.email).toLowerCase();
  let c: any = db.consents.find((x: any) => String(x.email).toLowerCase() === email);
  if (!c) { c = { id: uid('CON'), email, createdAt: nowIso() }; db.consents.unshift(c); }
  if (req.body.marketing !== undefined) c.marketing = !!req.body.marketing;
  if (req.body.visibility) c.visibility = req.body.visibility;
  c.updatedAt = nowIso();
  const p: any = db.candidateProfiles.find((x: any) => String(x.email).toLowerCase() === email);
  if (p && c.visibility) p.visibility = c.visibility;
  audit(ctx.email, `CONSENT_UPDATED:${email}`, ctx.tenantId, 'consent', c.id, req.ip); persist();
  res.json({ success: true, data: c });
});
extendedRouter.post('/consents/withdraw', requireAuth(['candidate', 'superadmin']), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const email = ctx.role === 'candidate' ? ctx.email.toLowerCase() : String(req.body.email || ctx.email).toLowerCase();
  let c: any = db.consents.find((x: any) => String(x.email).toLowerCase() === email);
  if (!c) { c = { id: uid('CON'), email, createdAt: nowIso() }; db.consents.unshift(c); }
  c.marketing = false; c.withdrawn = true; c.withdrawnAt = nowIso(); c.updatedAt = nowIso();
  const p: any = db.candidateProfiles.find((x: any) => String(x.email).toLowerCase() === email);
  if (p) { p.visibility = 'private'; p.updatedAt = nowIso(); }
  audit(ctx.email, `CONSENT_WITHDRAWN:${email}`, ctx.tenantId, 'consent', c.id, req.ip); persist();
  res.json({ success: true, data: c });
});
extendedRouter.get('/consents/export', requireAuth(['candidate', 'superadmin']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const email = ctx.role === 'candidate' ? ctx.email.toLowerCase() : String(req.query.email || ctx.email).toLowerCase();
  res.json({
    success: true,
    data: {
      exportedAt: nowIso(),
      profile: db.candidateProfiles.find((x: any) => String(x.email).toLowerCase() === email) || null,
      applications: db.applications.filter((a: any) => String(a.candidateEmail).toLowerCase() === email),
      consents: db.consents.filter((c: any) => String(c.email).toLowerCase() === email),
      notifications: db.notifications.filter((n: any) => n.recipient === email).slice(0, 100),
    },
  });
});

/* ---------------- Opportunities (§14.4) ---------------- */
const OPP_FLOW = ['Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
extendedRouter.get('/opportunities', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager', 'employee', 'bda', 'operations_admin']), (req, res) => {
  const { page, pageSize } = paginate.parse(req.query);
  const ctx = ctxOf(req); let rows = loadDb().opportunities as any[];
  if (['bda', 'employee'].includes(ctx.role)) rows = rows.filter((o) => !o.owner || o.owner === ctx.email);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
extendedRouter.post('/opportunities', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager', 'employee', 'bda']), (req: Request, res: Response) => {
  const { leadId, title, value, stage, owner } = req.body || {};
  if (!leadId) return res.status(400).json({ success: false, message: 'leadId required.' });
  const db = loadDb();
  const lead: any = db.leads.find((l: any) => l.id === leadId);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const row = { id: uid('OPP'), leadId, title: title || `${lead.companyName} opportunity`, value: Number(value ?? lead.value ?? 0), currency: 'INR', stage: OPP_FLOW.includes(stage) ? stage : 'Qualified', owner: owner || ctxOf(req).email, createdAt: nowIso() };
  db.opportunities.unshift(row); persist();
  res.status(201).json({ success: true, data: row });
});
extendedRouter.patch('/opportunities/:id/stage', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager']), (req, res) => {
  const db = loadDb(); const o: any = db.opportunities.find((x: any) => x.id === req.params.id);
  if (!o) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!OPP_FLOW.includes(req.body.stage)) return res.status(400).json({ success: false, message: `stage must be ${OPP_FLOW.join(', ')}` });
  o.stage = req.body.stage; o.updatedAt = nowIso(); persist();
  res.json({ success: true, data: o });
});

/* ---------------- Proposals (§14.4) ---------------- */
const PROP_FLOW = ['Draft', 'Sent', 'Accepted', 'Rejected'];
extendedRouter.get('/proposals', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager', 'employee', 'bda', 'operations_admin']), (req, res) => {
  const { page, pageSize } = paginate.parse(req.query);
  let rows = loadDb().proposals as any[];
  if (req.query.leadId) rows = rows.filter((p: any) => p.leadId === req.query.leadId);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
extendedRouter.post('/proposals', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager', 'employee', 'bda']), (req: Request, res: Response) => {
  const { leadId, opportunityId, title, amount, validUntil } = req.body || {};
  if (!leadId || !title) return res.status(400).json({ success: false, message: 'leadId + title required.' });
  const row = { id: uid('PRP'), leadId, opportunityId: opportunityId || null, title: String(title), amount: Number(amount || 0), currency: 'INR', validUntil: validUntil || null, status: 'Draft', owner: ctxOf(req).email, createdAt: nowIso() };
  loadDb().proposals.unshift(row); persist();
  res.status(201).json({ success: true, data: row });
});
extendedRouter.patch('/proposals/:id/status', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager']), (req, res) => {
  const db = loadDb(); const p: any = db.proposals.find((x: any) => x.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!PROP_FLOW.includes(req.body.status)) return res.status(400).json({ success: false, message: `status must be ${PROP_FLOW.join(', ')}` });
  p.status = req.body.status; p.updatedAt = nowIso(); persist();
  res.json({ success: true, data: p });
});

/* ---------------- Meetings (§10.2 follow-ups) ---------------- */
extendedRouter.get('/meetings', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager', 'employee', 'bda', 'operations_admin']), (req, res) => {
  const { page, pageSize } = paginate.parse(req.query);
  const ctx = ctxOf(req); let rows = loadDb().meetings as any[];
  if (req.query.leadId) rows = rows.filter((m: any) => m.leadId === req.query.leadId);
  if (['bda', 'employee'].includes(ctx.role)) rows = rows.filter((m) => !m.owner || m.owner === ctx.email);
  rows = [...rows].sort((a, b) => String(a.at).localeCompare(String(b.at)));
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
extendedRouter.post('/meetings', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager', 'employee', 'bda']), (req: Request, res: Response) => {
  const { leadId, title, at, outcome, notes, nextAction, followUp } = req.body || {};
  if (!leadId || !at) return res.status(400).json({ success: false, message: 'leadId + at required.' });
  const row = { id: uid('MTG'), leadId, title: title || 'Follow-up meeting', at, outcome: outcome || '', notes: String(notes || '').slice(0, 4000), nextAction: nextAction || '', followUp: followUp || '', owner: ctxOf(req).email, createdAt: nowIso() };
  const db = loadDb(); db.meetings.unshift(row);
  db.leadActivities.unshift({ id: uid('LACT'), leadId, type: 'meeting', outcome: outcome || '', notes: `Meeting ${row.id} @ ${at}. ${notes || ''}`.slice(0, 4000), nextAction: nextAction || '', followUp: followUp || '', owner: ctxOf(req).email, createdAt: nowIso() });
  persist();
  res.status(201).json({ success: true, data: row });
});
extendedRouter.patch('/meetings/:id', requireAuth(['superadmin', 'platform_owner', 'sales_admin', 'sales_manager', 'employee', 'bda']), (req, res) => {
  const db = loadDb(); const m: any = db.meetings.find((x: any) => x.id === req.params.id);
  if (!m) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (['bda', 'employee'].includes(ctx.role) && m.owner !== ctx.email) return res.status(404).json({ success: false, message: 'Not found.' });
  for (const k of ['outcome', 'notes', 'nextAction', 'followUp', 'at', 'title']) if (req.body[k] !== undefined) m[k] = req.body[k];
  m.updatedAt = nowIso(); persist();
  res.json({ success: true, data: m });
});

/* ---------------- Timesheets (vendor submit → employer approve) ---------------- */
extendedRouter.get('/timesheets', requireAuth(), (req, res) => {
  const { page, pageSize } = paginate.parse(req.query);
  const ctx = ctxOf(req); let rows = loadDb().timesheets as any[];
  if (['vendor', 'agency_admin', 'agency_recruiter'].includes(ctx.role)) rows = rows.filter((t) => t.vendorTenant === ctx.tenantId || t.submittedBy === ctx.email);
  else if (![...PLATFORM, 'operations_admin', 'employee', 'finance_admin'].includes(ctx.role)) rows = rows.filter((t) => t.clientTenant === ctx.tenantId);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
extendedRouter.post('/timesheets', requireAuth(['vendor', 'agency_admin', 'superadmin', 'platform_owner']), (req: Request, res: Response) => {
  const { contractorId, period, hours, notes } = req.body || {};
  if (!contractorId || !period || !(Number(hours) > 0)) return res.status(400).json({ success: false, message: 'contractorId + period + hours required.' });
  const db = loadDb(); const ctx = ctxOf(req);
  const c: any = db.contractors.find((x: any) => x.id === contractorId);
  const row = { id: uid('TSH'), contractorId, contractorName: c?.name || '', clientName: c?.clientName || '', clientTenant: (c as any)?.tenantId || '', vendorTenant: ctx.tenantId, period: String(period), hours: Number(hours), notes: String(notes || '').slice(0, 1000), status: 'Submitted', submittedBy: ctx.email, createdAt: nowIso() };
  db.timesheets.unshift(row);
  audit(ctx.email, `TIMESHEET_SUBMITTED:${row.id}`, ctx.tenantId, 'timesheet', row.id, req.ip); persist();
  res.status(201).json({ success: true, data: row });
});
extendedRouter.patch('/timesheets/:id/approve', requireAuth(['employer', 'company_admin', 'superadmin', 'platform_owner', 'operations_admin', 'employee']), (req, res) => {
  const db = loadDb(); const t: any = db.timesheets.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (![...PLATFORM, 'operations_admin', 'employee'].includes(ctx.role) && t.clientTenant && t.clientTenant !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  const decision = req.body.decision === 'reject' ? 'Rejected' : 'Approved';
  if (!['Submitted'].includes(t.status)) return res.status(422).json({ success: false, message: `Already ${t.status}.` });
  t.status = decision; t.reviewedBy = ctx.email; t.reviewedAt = nowIso(); t.reviewNote = String(req.body.note || '').slice(0, 1000);
  audit(ctx.email, `TIMESHEET_${decision.toUpperCase()}:${t.id}`, t.vendorTenant, 'timesheet', t.id, req.ip); persist();
  res.json({ success: true, data: t });
});

/* ---------------- Commission adjustments (§6.11) ---------------- */
extendedRouter.get('/commissions/:id/adjustments', requireAuth(), (req, res) => {
  const db = loadDb(); const c: any = db.commissions.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (![...PLATFORM, 'finance_admin'].includes(ctx.role) && c.orgId !== ctx.tenantId && c.agencyId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  res.json({ success: true, data: db.commissionAdjustments.filter((a: any) => a.commissionId === c.id) });
});
extendedRouter.post('/commissions/:id/adjustments', requireAuth(['superadmin', 'platform_owner', 'finance_admin']), requirePermission('adjust_commission'), (req: Request, res: Response) => {
  const db = loadDb(); const c: any = db.commissions.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  const amount = Number(req.body.amount);
  if (!amount || !isFinite(amount)) return res.status(400).json({ success: false, message: 'Numeric amount required (negative = deduction).' });
  if (!claimId(`adj:${c.id}:${amount}:${req.body.reason || ''}`)) return res.status(200).json({ success: true, message: 'Duplicate ignored (idempotent).' });
  const row = { id: uid('ADJ'), commissionId: c.id, amount: amtRound(amount), reason: String(req.body.reason || ''), by: ctxOf(req).email, createdAt: nowIso() };
  db.commissionAdjustments.unshift(row);
  c.adjustments = +(Number(c.adjustments || 0) + row.amount).toFixed(2);
  const gross = +(Number(c.gross || 0) + c.adjustments).toFixed(2);
  c.tax = +(gross * 0.18).toFixed(2);
  c.total = +(gross * 1.18).toFixed(2);
  c.net = c.total;
  audit(ctxOf(req).email, `COMMISSION_ADJUSTED:${c.id}:${row.amount}`, c.orgId, 'commission', c.id, req.ip); persist();
  res.status(201).json({ success: true, data: row });
});
function claimId(key: string): boolean {
  const db = loadDb();
  if (db.idempotency.find((x: any) => x.key === key)) return false;
  db.idempotency.unshift({ key, createdAt: nowIso() });
  if (db.idempotency.length > 5000) db.idempotency.length = 5000;
  return true;
}
function amtRound(n: number): number { return Math.round(n * 100) / 100; }

/* ---------------- Agency directory (§6.5/§9.1) ---------------- */
function agencyNameKeys(a: any): string[] {
  return [a.displayName, a.legalName].filter(Boolean).map((s: string) => String(s).toLowerCase());
}
function agencyJobs(db: any, a: any): any[] {
  const keys = agencyNameKeys(a);
  if (keys.length === 0 && !a.tenantId) return [];
  return (db.jobs as any[]).filter((j) => {
    const listed = [...(j.assignedAgencies || []), ...(j.assignedVendors || [])].map((x: string) => String(x).toLowerCase());
    return listed.some((l) => keys.some((k) => l.includes(k) || k.includes(l)));
  });
}
function agencyStats(db: any, a: any): any {
  const jobs = agencyJobs(db, a);
  const subs = ((db as any).submissions as any[] || []).filter((s) => (a.tenantId && s.agencyId === a.tenantId) || (s.submittedBy && a.contactEmail && String(s.submittedBy).toLowerCase() === String(a.contactEmail).toLowerCase()));
  const pairKeys = new Set(subs.map((s) => `${s.jobId}::${String(s.candidateEmail).toLowerCase()}`));
  const placements = (db.placements as any[]).filter((p) => pairKeys.has(`${p.jobId}::${String(p.candidateEmail).toLowerCase()}`));
  const comms = (db.commissions as any[]).filter((c) => (a.tenantId && (c.agencyId === a.tenantId || c.orgId === a.tenantId)));
  const balance = comms.filter((c) => c.paymentStatus !== 'Paid').reduce((x: number, c: any) => x + Number(c.net ?? c.total ?? 0), 0);
  return {
    activeAssignments: jobs.filter((j) => ['Published', 'Approved'].includes(j.status)).length,
    assignments: jobs.length,
    submissions: subs.length,
    pendingSubmissions: subs.filter((s) => ['Submitted', 'Duplicate-Review'].includes(s.status)).length,
    placements: placements.length,
    payoutBalance: +balance.toFixed(2),
  };
}
extendedRouter.get('/agency-profiles', requireAuth(), (req, res) => {
  const db = loadDb();
  const q = req.query as Record<string, string>;
  let rows = (db.agencyProfiles as any[]).map((a) => ({ ...a, ...agencyStats(db, a) }));
  if (q.status) rows = rows.filter((a) => a.accountStatus === q.status);
  if (q.verification) rows = rows.filter((a) => a.verificationStatus === q.verification);
  if (q.q) { const s = q.q.toLowerCase(); rows = rows.filter((a) => `${a.id} ${a.legalName} ${a.displayName} ${a.contactEmail} ${a.specialties}`.toLowerCase().includes(s)); }
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
extendedRouter.post('/agency-profiles', requireAuth(['superadmin', 'platform_owner']), (req: Request, res: Response) => {
  const { legalName, displayName } = req.body || {};
  if (!legalName) return res.status(400).json({ success: false, message: 'legalName required.' });
  const b: any = req.body || {};
  const row = {
    id: uid('AGC'), legalName: String(legalName), displayName: displayName ? String(displayName) : String(legalName),
    entityType: b.entityType || '', country: b.country || '', registrationNumber: b.registrationNumber || '', taxIds: b.taxIds || '',
    website: b.website || '', address: b.address || '', contactName: b.contactName || '',
    contactEmail: b.contactEmail || '', contactPhone: b.contactPhone || '',
    specialties: b.specialties || '', locations: b.locations || '', recruiterCount: Number(b.recruiterCount || 0),
    tenantId: b.tenantId || '', accountManager: b.accountManager || '',
    verificationStatus: 'Pending', agreementStatus: 'Draft', commercialModel: b.commercialModel || '',
    accountStatus: 'Invited', createdAt: nowIso(), createdBy: ctxOf(req).email,
  };
  loadDb().agencyProfiles.unshift(row); persist();
  audit(ctxOf(req).email, `AGENCY_ONBOARDED:${row.id}`, 'TNT-GLOBAL', 'agency', row.id, req.ip); persist();
  res.status(201).json({ success: true, data: row });
});
extendedRouter.patch('/agency-profiles/:id', requireAuth(['superadmin', 'platform_owner', 'operations_admin']), (req, res) => {
  const db = loadDb(); const a: any = db.agencyProfiles.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Not found.' });
  const b: any = req.body || {};
  for (const k of ['displayName', 'entityType', 'country', 'registrationNumber', 'taxIds', 'website', 'address', 'contactName', 'contactEmail', 'contactPhone', 'specialties', 'locations', 'recruiterCount', 'commercialModel', 'agreementStatus', 'tenantId', 'accountManager']) {
    if (b[k] !== undefined) a[k] = b[k];
  }
  if (b.verificationStatus && ['Pending', 'Approved', 'Rejected'].includes(b.verificationStatus)) {
    a.verificationStatus = b.verificationStatus;
    if (b.verificationStatus === 'Approved' && a.accountStatus === 'Invited') a.accountStatus = 'Active';
  }
  let sessionsRevoked = 0;
  if (b.accountStatus && ['Invited', 'Active', 'Suspended', 'Closed'].includes(b.accountStatus)) {
    if (!b.reason && b.accountStatus !== 'Active') return res.status(400).json({ success: false, message: 'Reason required for status change.' });
    a.accountStatus = b.accountStatus; a.statusReason = b.reason || ''; a.statusAt = nowIso();
    if (b.accountStatus !== 'Active' && a.tenantId) {
      const emails = new Set(db.users.filter((u: any) => u.tenantId === a.tenantId).map((u: any) => String(u.email).toLowerCase()));
      const before = db.sessions.length;
      db.sessions = db.sessions.filter((s: any) => !emails.has(String(s.email).toLowerCase()));
      sessionsRevoked = before - db.sessions.length;
    }
  }
  a.updatedAt = nowIso();
  audit(ctxOf(req).email, `AGENCY_UPDATED:${a.id}`, 'TNT-GLOBAL', 'agency', a.id, req.ip); persist();
  res.json({ success: true, data: a, sessionsRevoked });
});
extendedRouter.delete('/agency-profiles/:id', requireAuth(['superadmin', 'platform_owner']), requirePermission('delete'), (req, res) => {
  const db = loadDb(); const i = db.agencyProfiles.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Not found.' });
  const a: any = db.agencyProfiles[i];
  const stats = agencyStats(db, a);
  const reason = String((req.body as any)?.reason || req.query.reason || '');
  if (!reason) return res.status(400).json({ success: false, message: 'Closure reason required.' });
  if (stats.activeAssignments > 0 || stats.pendingSubmissions > 0 || stats.payoutBalance > 0) {
    a.accountStatus = 'Closed'; a.statusReason = reason; a.statusAt = nowIso();
    audit(ctxOf(req).email, `AGENCY_CLOSED:${a.id}`, 'TNT-GLOBAL', 'agency', a.id, req.ip); persist();
    return res.json({ success: true, data: { ...a, ...agencyStats(db, a) }, message: 'Agency has live work or unpaid balance — closed instead of deleted.' });
  }
  const [removed] = db.agencyProfiles.splice(i, 1);
  audit(ctxOf(req).email, `AGENCY_DELETED:${a.id}`, 'TNT-GLOBAL', 'agency', a.id, req.ip); persist();
  res.json({ success: true, data: removed });
});
extendedRouter.post('/agency-profiles/:id/invite', requireAuth(['superadmin', 'platform_owner']), requirePermission('assign'), async (req: Request, res: Response) => {
  const db = loadDb(); const a: any = db.agencyProfiles.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!a.tenantId) return res.status(422).json({ success: false, message: 'Link a login tenant to this agency first (tenantId).' });
  const { name, email, role, password } = req.body || {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ success: false, message: 'Valid email required.' });
  if (!['agency_admin', 'agency_recruiter'].includes(role)) return res.status(400).json({ success: false, message: 'role must be agency_admin|agency_recruiter.' });
  if (!password || String(password).length < 8) return res.status(400).json({ success: false, message: '8-char temporary password required.' });
  if (db.users.some((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase())) return res.status(409).json({ success: false, message: 'Account exists. Use the user directory.' });
  const { hashPassword } = await import('../auth/password.js');
  const user = { id: uid('USR'), name: name || String(email).split('@')[0], email, role, tenantId: a.tenantId, status: 'Active', invitationStatus: 'Pending', invitedAt: nowIso(), lastLogin: 'Never' };
  db.users.unshift(user);
  db.credentials.push({ userId: user.id, email: String(email).toLowerCase(), passwordHash: await hashPassword(String(password)), algo: 'bcrypt' });
  a.recruiterCount = Number(a.recruiterCount || 0) + 1;
  audit(ctxOf(req).email, `AGENCY_USER_INVITED:${a.id}:${user.email}`, a.tenantId, 'agency', a.id, req.ip); persist();
  res.status(201).json({ success: true, data: user });
});
extendedRouter.get('/agency-profiles/:id/360', requireAuth(['superadmin', 'platform_owner', 'operations_admin']), (req, res) => {
  const db = loadDb(); const a: any = db.agencyProfiles.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Not found.' });
  const jobs = agencyJobs(db, a);
  const subs = ((db as any).submissions as any[] || []).filter((s) => (a.tenantId && s.agencyId === a.tenantId) || (s.submittedBy && a.contactEmail && String(s.submittedBy).toLowerCase() === String(a.contactEmail).toLowerCase()));
  const pairKeys = new Set(subs.map((s) => `${s.jobId}::${String(s.candidateEmail).toLowerCase()}`));
  const placements = (db.placements as any[]).filter((p) => pairKeys.has(`${p.jobId}::${String(p.candidateEmail).toLowerCase()}`));
  const comms = (db.commissions as any[]).filter((c) => (a.tenantId && (c.agencyId === a.tenantId || c.orgId === a.tenantId)));
  const memberEmails = new Set(db.users.filter((u: any) => a.tenantId && u.tenantId === a.tenantId).map((u: any) => String(u.email).toLowerCase()));
  res.json({ success: true, data: {
    profile: { ...a, ...agencyStats(db, a) },
    users: (db.users as any[]).filter((u) => a.tenantId && u.tenantId === a.tenantId),
    jobs: jobs.slice(0, 200),
    submissions: subs.slice(0, 200),
    placements: placements.slice(0, 200),
    agreements: (db.commissionAgreements as any[]).filter((x) => (a.tenantId && (x.agencyId === a.tenantId || x.orgId === a.tenantId))),
    commissions: comms.slice(0, 200),
    payouts: (db.payouts as any[]).filter((p) => comms.some((c) => c.id === p.commissionId)).slice(0, 100),
    activity: (db.auditLogs as any[]).filter((l) => l.recordId === a.id || memberEmails.has(String(l.actor).toLowerCase())).slice(0, 100),
  } });
});
