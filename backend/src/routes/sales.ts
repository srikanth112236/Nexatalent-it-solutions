import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadDb, persist, uid, nowIso, audit, pushHistory } from '../db/store.js';
import { notify } from '../domain/pipeline.js';
import { requireAuth, ctxOf } from '../middleware/rbac.js';
import { leadSchema, paginate, paged } from '../validate/schemas.js';
import { uploadFile, downloadFile, isBlobStorageConfigured, DEFAULT_CONTAINER } from '../storage/blob.js';

export const salesRouter = Router();
// Phase 7: public enquiries are rate-limited and never trust client owner/status.
const enquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

// Careers / candidate resumes land in the shared uploads dir (same as documents).
const UPLOAD_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data', 'uploads');
function ensureUploadDir() { if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true }); }
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

// ---- Public business enquiry → lead (no auth; server sets owner/status) ----
salesRouter.post('/enquiries', enquiryLimiter, (req: Request, res: Response) => {
  const b: any = req.body || {};
  const contactName = String(b.contactName || '').trim();
  const companyName = String(b.companyName || '').trim();
  const workEmail = String(b.workEmail || b.email || '').trim().toLowerCase();
  const message = String(b.message || '').trim();
  if (!contactName) return res.status(400).json({ success: false, message: 'Contact name is required.' });
  if (!companyName) return res.status(400).json({ success: false, message: 'Company name is required.' });
  if (!/.+@.+\..+/.test(workEmail)) return res.status(400).json({ success: false, message: 'Valid work email is required.' });
  if (message.length < 10) return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });
  const db = loadDb();
  // Idempotent within 24h on the same email+company — never double-create.
  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const dup = (db.leads as any[]).find((l: any) =>
    String(l.email || '').toLowerCase() === workEmail &&
    String(l.companyName || '').toLowerCase() === companyName.toLowerCase() &&
    new Date(l.createdAt || 0).getTime() > dayAgo);
  if (dup) return res.status(200).json({ success: true, code: 'ENQUIRY_DUPLICATE', message: 'Enquiry already received — our team will follow up.', data: { id: dup.id } });
  // Optional public resume (Careers / candidate applications): validated like documents,
  // stored server-side and linked onto the lead for the hiring desk.
  let resumeRef: string | null = null;
  let resumeName = '';
  let resumeSize = 0;
  if (b.resumeBase64) {
    const name = String(b.resumeName || 'resume').slice(0, 160);
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) return res.status(400).json({ success: false, message: 'Resume must be a PDF, DOC or DOCX file.' });
    let buf: Buffer;
    try { buf = Buffer.from(String(b.resumeBase64), 'base64'); } catch { return res.status(400).json({ success: false, message: 'Invalid resume file.' }); }
    if (buf.length === 0 || buf.length > MAX_RESUME_BYTES) return res.status(413).json({ success: false, message: 'Resume must be under 5 MB.' });
    const magicOk =
      (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) ||
      (buf[0] === 0xd0 && buf[1] === 0xcf) ||
      (buf[0] === 0x50 && buf[1] === 0x4b);
    if (!magicOk) return res.status(415).json({ success: false, message: 'Resume file content does not match its type.' });
    ensureUploadDir();
    resumeRef = uid('RES');
    writeFileSync(join(UPLOAD_DIR, `${resumeRef}.bin`), buf);
    if (isBlobStorageConfigured()) {
      const ext = (name.split('.').pop() || 'pdf').toLowerCase();
      const mime = ext === 'doc' ? 'application/msword' : ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf';
      uploadFile(DEFAULT_CONTAINER, `${resumeRef}.bin`, buf, mime).catch((err) => {
        console.warn('[BlobStorage] Async resume upload failed for lead', err);
      });
    }
    resumeName = name;
    resumeSize = buf.length;
  }
  const lead = {
    id: uid('LEAD'), contactName, companyName, email: workEmail,
    phone: String(b.phone || '').slice(0, 30),
    website: String(b.website || '').slice(0, 160),
    industry: String(b.industry || '').slice(0, 80),
    enquiryType: ['employer', 'candidate', 'partner'].includes(b.enquiryType) ? b.enquiryType : 'employer',
    service: String(b.service || '').slice(0, 120),
    enquiryTopic: String(b.enquiryTopic || b.topic || '').slice(0, 120),
    preferredOffice: String(b.preferredOffice || b.office || '').slice(0, 120),
    budgetRange: String(b.budgetRange || b.budget || '').slice(0, 80),
    timeline: String(b.timeline || '').slice(0, 80),
    formName: String(b.formName || '').slice(0, 80),
    sourcePage: String(b.sourcePage || '').slice(0, 200),
    resumeRef, resumeName, resumeSize,
    notes: message.slice(0, 4000),
    consent: b.consent === true,
    source: 'Website', stage: 'New', priority: 'Medium', owner: '',
    createdAt: nowIso(), history: [{ stage: 'New', at: nowIso() }],
  };
  db.leads.unshift(lead);
  db.leadActivities.unshift({ id: uid('LACT'), leadId: lead.id, type: 'enquiry', outcome: 'received', notes: `Website enquiry from ${contactName} @ ${companyName}.${resumeRef ? ` Resume: ${resumeName}.` : ''}`, owner: '', createdAt: nowIso() });
  audit('website', `ENQUIRY_RECEIVED:${lead.id}`, 'TNT-GLOBAL', 'lead', lead.id, req.ip); persist();
  res.status(201).json({ success: true, data: { id: lead.id } });
});
const LEAD_FLOW: Record<string, string[]> = { New: ['Contacted','Lost'], Contacted: ['Qualified','Lost','Nurture'], Qualified: ['Discovery Scheduled','Lost'], 'Discovery Scheduled': ['Proposal Sent','Lost'], 'Proposal Sent': ['Negotiation','Lost'], Negotiation: ['Won','Lost','Nurture'], Won: [], Lost: ['New'], Nurture: ['Contacted'] };

// ---- Leads ----
salesRouter.get('/leads', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager','operations_admin']), (req, res) => {
  const { page, pageSize, q, status } = paginate.parse(req.query);
  let rows = (loadDb().leads as any[]).filter((l) => !l.deleted);
  if (['bda','employee'].includes(ctxOf(req).role)) rows = rows.filter((l) => !l.owner || l.owner === ctxOf(req).email);
  if (status) rows = rows.filter((l) => l.stage === status);
  if (q) { const s = String(q).toLowerCase(); rows = rows.filter((l) => `${l.id || ''} ${l.contactName || ''} ${l.companyName || ''} ${l.email || ''} ${l.stage || ''} ${l.owner || ''}`.toLowerCase().includes(s)); }
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
salesRouter.post('/leads', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager']), (req: Request, res: Response) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const lead = { id: uid('LEAD'), ...parsed.data, owner: parsed.data.owner || ctxOf(req).email, createdAt: nowIso(), history: [{ stage: parsed.data.stage || 'New', at: nowIso() }] };
  loadDb().leads.unshift(lead); audit(ctxOf(req).email, `LEAD_CREATED:${lead.id}`, 'TNT-GLOBAL', 'lead', lead.id, req.ip); persist();
  res.status(201).json({ success: true, data: lead });
});
salesRouter.put('/leads/:id', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const l: any = db.leads.find((x: any) => x.id === req.params.id);
  if (!l || l.deleted) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const ctx = ctxOf(req);
  // Phase B: ownership — BDA/employee edit owned leads only; managers+admins anywhere.
  if (['bda','employee'].includes(ctx.role) && l.owner && l.owner !== ctx.email) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }
  const b: any = req.body || {};
  // P2-8: BDA/employee cannot reassign ownership to hide/transfer pipeline.
  const BLOCK_REASSIGN = ['bda', 'employee'].includes(ctx.role) ? ['owner', 'team', 'branch'] : [];
  for (const k of ['contactName','designation','email','phone','companyName','website','industry','companySize','location','source','service','enquiryTopic','preferredOffice','budgetRange','timeline','hiringNeed','openings','value','budget','closeDate','priority','owner','team','branch','nextFollowUp','notes']) {
    if (b[k] !== undefined && !BLOCK_REASSIGN.includes(k)) l[k] = b[k];
  }
  l.updatedAt = nowIso();
  audit(ctxOf(req).email, `LEAD_EDITED:${l.id}`, 'TNT-GLOBAL', 'lead', l.id, req.ip); persist();
  res.json({ success: true, data: l });
});
salesRouter.delete('/leads/:id', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager']), (req, res) => {
  const db = loadDb(); const l: any = db.leads.find((x: any) => x.id === req.params.id);
  if (!l || l.deleted) return res.status(404).json({ success: false, message: 'Lead not found.' });
  if (l.stage === 'Won') return res.status(422).json({ success: false, message: 'Won leads cannot be deleted (audit). Mark Lost instead.' });
  const reason = String((req.body as any)?.reason || req.query.reason || 'admin-delete (no reason supplied)').slice(0, 500);
  // P2-8: soft-delete preserves pipeline evidence; hard splice removed.
  l.deleted = true; l.deletedAt = nowIso(); l.deleteReason = reason; l.deletedBy = ctxOf(req).email;
  audit(ctxOf(req).email, `LEAD_DELETED:${l.id}`, 'TNT-GLOBAL', 'lead', l.id, req.ip, { reason }); persist();
  res.json({ success: true, data: { id: l.id, deleted: true } });
});
salesRouter.patch('/leads/:id/stage', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const l: any = db.leads.find((x: any) => x.id === req.params.id);
  if (!l) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const next = String(req.body.stage);
  if (!(LEAD_FLOW[l.stage] || []).includes(next)) return res.status(422).json({ success: false, message: `Invalid ${l.stage} → ${next}` });
  if (next === 'Lost' && !req.body.reason) return res.status(400).json({ success: false, message: 'Lost reason required.' });
  const from = l.stage;
  l.stage = next; (l.history ||= []).push({ stage: next, at: nowIso(), reason: req.body.reason || '' });
  db.leadActivities.unshift({ id: uid('LACT'), leadId: l.id, type: 'stage', outcome: next, notes: req.body.reason || '', owner: ctxOf(req).email, createdAt: nowIso() });
  audit(ctxOf(req).email, `LEAD_STAGE:${l.id}->${next}`, 'TNT-GLOBAL', 'lead', l.id, req.ip, { before: from, after: next, reason: req.body.reason || '' }); persist();
  res.json({ success: true, data: l });
});
salesRouter.post('/leads/:id/activities', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager']), (req: Request, res: Response) => {
  const db = loadDb();
  const lead: any = db.leads.find((x: any) => x.id === req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const ctx = ctxOf(req);
  if (['bda','employee'].includes(ctx.role) && lead.owner && lead.owner !== ctx.email) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }
  const act = { id: uid('LACT'), leadId: req.params.id, type: req.body.type || 'call', outcome: req.body.outcome || '', notes: String(req.body.notes || '').slice(0, 4000), nextAction: req.body.nextAction || '', followUp: req.body.followUp || '', owner: ctxOf(req).email, createdAt: nowIso() };
  db.leadActivities.unshift(act);
  audit(ctx.email, `LEAD_ACTIVITY:${lead.id}:${act.type}`, 'TNT-GLOBAL', 'lead', lead.id, req.ip); persist();
  res.status(201).json({ success: true, data: act });
});
salesRouter.get('/leads/:id/activities', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager','employee','bda']), (req, res) => {
  res.json({ success: true, data: loadDb().leadActivities.filter((a: any) => a.leadId === req.params.id) });
});
// ---- Lead resume download (Careers / candidate applications; hiring desk only) ----
salesRouter.get('/leads/:id/resume', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager','employee','bda','operations_admin']), async (req, res) => {
  const l: any = loadDb().leads.find((x: any) => x.id === req.params.id);
  if (!l || !l.resumeRef) return res.status(404).json({ success: false, message: 'No resume on this lead.' });
  const ctx = ctxOf(req);
  if (['bda','employee'].includes(ctx.role) && l.owner && l.owner !== ctx.email) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }
  try {
    let buf: Buffer;
    const localPath = join(UPLOAD_DIR, `${l.resumeRef}.bin`);
    if (existsSync(localPath)) {
      buf = readFileSync(localPath);
    } else if (isBlobStorageConfigured()) {
      buf = await downloadFile(DEFAULT_CONTAINER, `${l.resumeRef}.bin`);
    } else {
      return res.status(410).json({ success: false, message: 'Resume file no longer available.' });
    }
    const ext = (String(l.resumeName || '').split('.').pop() || 'pdf').toLowerCase();
    const mime = ext === 'doc' ? 'application/msword' : ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf';
    res.setHeader('Content-Type', mime);
    const safeName = String(l.resumeName || 'resume').replace(/["\r\n\\]/g, '').slice(0, 160) || 'resume';
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(buf);
  } catch { res.status(410).json({ success: false, message: 'Resume file no longer available.' }); }
});
salesRouter.post('/leads/:id/merge', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager']), (req: Request, res: Response) => {
  const db = loadDb();
  const src: any = db.leads.find((x: any) => x.id === req.params.id);
  const dst: any = db.leads.find((x: any) => x.id === req.body?.intoId);
  if (!src || !dst) return res.status(404).json({ success: false, message: 'Source and target leads required.' });
  if (src.id === dst.id) return res.status(400).json({ success: false, message: 'Cannot merge a lead into itself.' });
  if (src.stage === 'Won' || dst.stage === 'Won') return res.status(422).json({ success: false, message: 'Won leads are audit-protected and cannot be merged.' });
  if (src.mergedInto || dst.mergedInto) return res.status(422).json({ success: false, message: 'Already-merged leads cannot be merged again.' });
  if (!req.body?.reason) return res.status(400).json({ success: false, message: 'Merge reason required.' });
  const moved: Record<string, number> = {};
  for (const [coll, key] of [['leadActivities','leadId'],['meetings','leadId'],['proposals','leadId'],['opportunities','leadId']] as const) {
    let n = 0;
    for (const r of (db as any)[coll] as any[]) {
      if (r[key] === src.id) { r[key] = dst.id; n++; }
    }
    moved[coll] = n;
  }
  (dst.history ||= []).push({ stage: dst.stage, at: nowIso(), mergedFrom: src.id, reason: req.body.reason });
  (src.history ||= []).push({ stage: src.stage, at: nowIso(), mergedInto: dst.id, reason: req.body.reason });
  src.mergedInto = dst.id; src.stage = 'Lost'; src.mergedAt = nowIso();
  db.leadActivities.unshift({ id: uid('LACT'), leadId: dst.id, type: 'merge', outcome: 'merged', notes: `Merged ${src.id} (${src.contactName} @ ${src.companyName}) into ${dst.id}. ${req.body.reason}`.slice(0, 4000), owner: ctxOf(req).email, createdAt: nowIso() });
  audit(ctxOf(req).email, `LEAD_MERGED:${src.id}->${dst.id}`, 'TNT-GLOBAL', 'lead', src.id, req.ip); persist();
  res.json({ success: true, data: { into: dst, moved } });
});
salesRouter.post('/leads/:id/convert', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const l: any = db.leads.find((x: any) => x.id === req.params.id);
  if (!l) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const onboard = (orgId: string, orgName: string) => {
    // Phase 8: onboarding team (ops + platform) learns about every conversion.
    const team = (db.users as any[])
      .filter((u: any) => ['operations_admin', 'employee', 'superadmin', 'platform_owner'].includes(u.role) && String(u.status || 'Active') === 'Active')
      .slice(0, 10);
    for (const u of team) {
      db.notifications.unshift({ id: uid('NOTIF'), recipient: u.email, kind: 'lead-converted', body: `Lead ${l.id} (${l.companyName}) converted → organization ${orgId} (${orgName}). Review verification.`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: orgId });
    }
  };
  const ensureOpportunity = (orgId: string) => {
    if (!(db.opportunities as any[]).some((o: any) => o.leadId === l.id)) {
      db.opportunities.unshift({ id: uid('OPP'), leadId: l.id, orgId, title: `${l.companyName} opportunity`, value: Number(l.value || 0), currency: 'INR', stage: 'Won', owner: l.owner, createdAt: nowIso() });
    }
  };
  // Phase 8: retry-safe — an existing organization is linked, never duplicated.
  const existing: any = db.organizations.find((o: any) => String(o.legalName || '').toLowerCase() === String(l.companyName || '').toLowerCase());
  if (existing) {
    const already = (existing as any).leadId === l.id && l.stage === 'Won';
    l.stage = 'Won'; (l.history ||= []).push({ stage: 'Won', at: nowIso(), orgId: existing.id });
    ensureOpportunity(existing.id);
    audit(ctxOf(req).email, `LEAD_CONVERTED:${l.id}->${existing.id}`, existing.id, 'lead', l.id, req.ip); persist();
    onboard(existing.id, existing.displayName || existing.legalName);
    persist();
    return res.status(200).json({ success: true, code: already ? 'LEAD_ALREADY_CONVERTED' : 'LEAD_LINKED_EXISTING', message: already ? 'Lead already converted — returning the linked organization.' : 'Organization already exists — lead linked without duplicating.', data: existing });
  }
  const org = { id: uid('TNT'), legalName: l.companyName, displayName: l.companyName, status: 'Invited', verificationStatus: 'Pending', accountStatus: 'Invited', leadId: l.id, createdDate: nowIso().slice(0, 10) };
  db.organizations.unshift(org);
  l.stage = 'Won'; (l.history ||= []).push({ stage: 'Won', at: nowIso(), orgId: org.id });
  // Won conversions mint a linked opportunity so pipeline value survives the handoff.
  db.opportunities.unshift({ id: uid('OPP'), leadId: l.id, orgId: org.id, title: `${l.companyName} opportunity`, value: Number(l.value || 0), currency: 'INR', stage: 'Won', owner: l.owner, createdAt: nowIso() });
  audit(ctxOf(req).email, `LEAD_CONVERTED:${l.id}->${org.id}`, org.id, 'lead', l.id, req.ip); persist();
  onboard(org.id, org.displayName);
  persist();
  res.status(201).json({ success: true, data: org });
});
// ---- Targets / performance ----
salesRouter.get('/targets', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().targets as any[];
  if (['bda','employee'].includes(ctx.role)) rows = rows.filter((t) => !t.owner || t.owner === ctx.email);
  res.json({ success: true, data: rows });
});
salesRouter.post('/targets', requireAuth(['superadmin','platform_owner','sales_manager','sales_admin']), (req: Request, res: Response) => {
  const { owner, period, goal } = req.body || {};
  if (!owner || !period) return res.status(400).json({ success: false, message: 'owner + period required.' });
  const t = { id: uid('TGT'), owner: String(owner), period: String(period), goal: Number(goal) || 0, createdBy: ctxOf(req).email, createdAt: nowIso() };
  loadDb().targets.unshift(t); persist(); res.status(201).json({ success: true, data: t });
});
salesRouter.put('/targets/:id', requireAuth(['superadmin','platform_owner','sales_manager','sales_admin']), (req, res) => {
  const db = loadDb(); const t: any = db.targets.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Not found.' });
  const b: any = req.body || {};
  for (const k of ['owner','period','goal']) if (b[k] !== undefined) t[k] = b[k];
  t.updatedAt = nowIso(); persist();
  res.json({ success: true, data: t });
});
salesRouter.delete('/targets/:id', requireAuth(['superadmin','platform_owner','sales_manager','sales_admin']), (req, res) => {
  const db = loadDb(); const i = db.targets.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Not found.' });
  const [removed] = db.targets.splice(i, 1); persist();
  res.json({ success: true, data: removed });
});
salesRouter.get('/performance', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager','employee','bda']), (req, res) => {
  const db = loadDb();
  const q = req.query as Record<string, string>;
  let leads = db.leads as any[];
  if (q.from) leads = leads.filter((l: any) => String(l.createdAt || '') >= String(q.from));
  if (q.to) leads = leads.filter((l: any) => String(l.createdAt || '') <= `${q.to}T23:59:59.999Z`.slice(0, 24));
  if (q.owner) leads = leads.filter((l: any) => l.owner === q.owner);
  if (q.source) leads = leads.filter((l: any) => l.source === q.source);
  if (q.service) leads = leads.filter((l: any) => l.service === q.service);
  if (q.stage) leads = leads.filter((l: any) => l.stage === q.stage);
  if (q.branch) leads = leads.filter((l: any) => l.branch === q.branch);
  const ids = new Set(leads.map((l: any) => l.id));
  const by = (s: string) => leads.filter((l: any) => l.stage === s).length;
  const won = by('Won'), total = leads.length || 1;
  // Response-time: hours from lead creation to first touch (activity/meeting/proposal/opportunity).
  const touches: Record<string, number> = {};
  for (const [coll, key] of [['leadActivities', 'leadId'], ['meetings', 'leadId'], ['proposals', 'leadId'], ['opportunities', 'leadId']] as const) {
    for (const t of (db[coll] as any[] || [])) {
      const id = (t as any)[key]; const at = new Date((t as any).createdAt).getTime();
      if (id && ids.has(id) && Number.isFinite(at) && (touches[id] === undefined || at < touches[id])) touches[id] = at;
    }
  }
  let respSum = 0; let respN = 0;
  for (const l of leads) {
    const born = new Date(l.createdAt).getTime(); const first = touches[l.id];
    if (Number.isFinite(born) && first !== undefined && first >= born) { respSum += (first - born) / 36e5; respN += 1; }
  }
  const meetings = (db.meetings as any[]).filter((m: any) => ids.has(m.leadId)).length;
  const proposals = (db.proposals as any[]).filter((p: any) => ids.has(p.leadId)).length;
  const opps = (db.opportunities as any[]).filter((o: any) => ids.has(o.leadId));
  const revenueBooked = opps.filter((o: any) => o.stage === 'Won').reduce((a: number, o: any) => a + Number(o.value || 0), 0);
  const owners = [...new Set((db.leads as any[]).map((l: any) => l.owner).filter(Boolean))].sort();
  const sources = [...new Set((db.leads as any[]).map((l: any) => l.source).filter(Boolean))].sort();
  const services = [...new Set((db.leads as any[]).map((l: any) => l.service).filter(Boolean))].sort();
  const branches = [...new Set((db.leads as any[]).map((l: any) => l.branch).filter(Boolean))].sort();
  res.json({ success: true, data: {
    leadsAssigned: total, contacted: by('Contacted'), qualified: by('Qualified'),
    meetingsBooked: meetings, proposals: proposals + by('Proposal Sent'), won, lost: by('Lost'),
    conversionRate: +(won / total).toFixed(3),
    pipelineValue: leads.reduce((a: number, l: any) => a + Number(l.value || 0), 0),
    revenueBooked,
    overdueFollowups: leads.filter((l: any) => l.nextFollowUp && new Date(l.nextFollowUp) < new Date()).length,
    avgResponseHrs: respN > 0 ? +(respSum / respN).toFixed(1) : 0, respondedLeads: respN,
    filters: { owners, sources, services, branches },
  } });
});
// ---- Unified activity feed (§10.2): lead activities + meetings + proposals, newest first ----
salesRouter.get('/activities', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager','employee','bda']), (req, res) => {
  const db: any = loadDb(); const ctx = ctxOf(req);
  const q = req.query as Record<string, string>;
  const leadById = new Map((db.leads as any[]).map((l: any) => [l.id, l]));
  const mineOnly = ['employee','bda'].includes(ctx.role) && !['superadmin','platform_owner','sales_admin','sales_manager'].includes(ctx.role);
  const visible = (owner: unknown, leadId: unknown) => {
    if (!mineOnly) return true;
    if (String(owner || '').toLowerCase() === ctx.email.toLowerCase()) return true;
    const lead: any = leadById.get(String(leadId || ''));
    return !!lead && String(lead.owner || '').toLowerCase() === ctx.email.toLowerCase();
  };
  const rows: any[] = [];
  for (const a of (db.leadActivities as any[] || [])) {
    if (!visible(a.owner, a.leadId)) continue;
    const lead: any = leadById.get(a.leadId);
    rows.push({ id: a.id, kind: 'activity', leadId: a.leadId, leadName: lead ? `${lead.contactName || ''} @ ${lead.companyName || ''}`.trim() : a.leadId, title: a.type || 'activity', outcome: a.outcome || '', notes: a.notes || '', nextAction: a.nextAction || '', followUp: a.followUp || '', owner: a.owner, at: a.createdAt, createdAt: a.createdAt });
  }
  for (const m of (db.meetings as any[] || [])) {
    if (!visible(m.owner, m.leadId)) continue;
    const lead: any = leadById.get(m.leadId);
    rows.push({ id: m.id, kind: 'meeting', leadId: m.leadId, leadName: lead ? `${lead.contactName || ''} @ ${lead.companyName || ''}`.trim() : m.leadId, title: m.title || 'Meeting', outcome: m.outcome || '', notes: m.notes || '', nextAction: m.nextAction || '', followUp: m.followUp || '', owner: m.owner, at: m.at || m.createdAt, createdAt: m.createdAt });
  }
  for (const p of (db.proposals as any[] || [])) {
    if (!visible(p.owner, p.leadId)) continue;
    const lead: any = leadById.get(p.leadId);
    rows.push({ id: p.id, kind: 'proposal', leadId: p.leadId, leadName: lead ? `${lead.contactName || ''} @ ${lead.companyName || ''}`.trim() : p.leadId, title: p.title || 'Proposal', outcome: p.status || '', notes: p.amount !== undefined ? `Amount ${p.currency || 'INR'} ${Number(p.amount || 0).toLocaleString('en-IN')}${p.validUntil ? `, valid until ${p.validUntil}` : ''}` : '', nextAction: '', followUp: '', owner: p.owner, at: p.createdAt, createdAt: p.createdAt });
  }
  let out = rows.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
  if (q.kind) out = out.filter((r) => r.kind === q.kind);
  if (q.leadId) out = out.filter((r) => r.leadId === q.leadId);
  if (q.owner) out = out.filter((r) => r.owner === q.owner);
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(out, page, pageSize) });
});
// ---- Agency submissions (§9.4) with duplicate/ownership window ----
salesRouter.get('/submissions', requireAuth(), (req, res) => {
  const { page, pageSize } = paginate.parse(req.query);
  const ctx = ctxOf(req); let rows = (loadDb() as any).submissions as any[] || [];
  if (['agency_admin','agency_recruiter','vendor','recruiter'].includes(ctx.role)) rows = rows.filter((s) => s.agencyId === ctx.tenantId || s.submittedBy === ctx.email);
  else if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role)) rows = rows.filter((s) => s.orgId === ctx.tenantId);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
salesRouter.post('/submissions', requireAuth(['agency_admin','agency_recruiter','recruiter','vendor','superadmin']), (req: Request, res: Response) => {
  const db: any = loadDb();
  const { jobId, candidateEmail, resumeRef, consent } = req.body || {};
  if (!jobId || !candidateEmail) return res.status(400).json({ success: false, message: 'jobId + candidateEmail required.' });
  const job: any = db.jobs.find((j: any) => j.id === jobId);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
  // Assignment gate: job must be open AND (open to all agencies OR explicitly list this agency).
  // Explicit assignments are matched by agency tenant id or agency name fragment.
  const ctx = ctxOf(req);
  const listed = (job.assignedAgencies || []) as string[];
  const assigned = ['superadmin','platform_owner'].includes(ctx.role)
    || (['Published','Approved'].includes(job.status) && (listed.length === 0 || listed.some((a: string) => String(a).toLowerCase().includes(String(ctx.tenantId).toLowerCase()) || String(ctx.email).toLowerCase().includes(String(a).toLowerCase().split(' ')[0]))));
  if (!assigned) return res.status(403).json({ success: false, code: 'AGENCY_NOT_ASSIGNED', message: 'Job not assigned to your agency.' });
  // Duplicate / ownership window: 90 days
  const windowMs = 90 * 864e5;
  const dup = db.submissions.find((s: any) => s.jobId === jobId && String(s.candidateEmail).toLowerCase() === String(candidateEmail).toLowerCase() && Date.now() - new Date(s.createdAt).getTime() < windowMs);
  const existingApp = db.applications.find((a: any) => a.jobId === jobId && String(a.candidateEmail).toLowerCase() === String(candidateEmail).toLowerCase());
  const row = { id: uid('SUBM'), agencyId: ctx.tenantId, jobId, orgId: job.orgId, candidateEmail, resumeRef: resumeRef || '', consentEvidence: consent || '', status: dup || existingApp ? 'Duplicate-Review' : 'Submitted', duplicateOf: dup?.id || existingApp?.id || null, submittedBy: ctx.email, createdAt: nowIso() };
  db.submissions.unshift(row); audit(ctx.email, `SUBMISSION:${row.id}:${row.status}`, job.orgId, 'submission', row.id, req.ip); persist();
  if (row.status === 'Duplicate-Review') return res.status(201).json({ success: true, code: 'DUPLICATE_SUBMISSION_REVIEW', data: row });
  res.status(201).json({ success: true, data: row });
});
salesRouter.patch('/submissions/:id/status', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin']), (req, res) => {
  const db: any = loadDb(); const s: any = (db.submissions || []).find((x: any) => x.id === req.params.id);
  if (!s) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','employee','operations_admin'].includes(ctx.role) && s.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  s.status = req.body.status || s.status; s.updatedAt = nowIso();
  audit(ctxOf(req).email, `SUBMISSION_STATUS:${s.id}->${s.status}`, s.orgId, 'submission', s.id, req.ip); persist();
  res.json({ success: true, data: s });
});
// Accept a submission into the ATS pipeline: creates the application (Applied),
// links it back, and marks the submission Shortlisted. Frozen jobs refuse.
salesRouter.post('/submissions/:id/accept', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req, res) => {
  const db: any = loadDb();
  const s: any = (db.submissions || []).find((x: any) => x.id === req.params.id);
  if (!s) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','employee','operations_admin'].includes(ctx.role) && s.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  if (['Rejected','Withdrawn'].includes(s.status)) return res.status(422).json({ success: false, code: 'SUBMISSION_DEAD', message: `Submission is ${s.status} — cannot accept.` });
  const job: any = db.jobs.find((j: any) => j.id === s.jobId);
  if (!job) return res.status(404).json({ success: false, message: 'Linked job not found.' });
  if (job.status !== 'Published' || (job.expiryDate && new Date(job.expiryDate) <= new Date())) {
    return res.status(422).json({ success: false, code: 'PIPELINE_FROZEN', message: `Job ${job.id} is ${job.status} — resume it to accept submissions.` });
  }
  const key = `${s.jobId}::${String(s.candidateEmail).toLowerCase()}`;
  const dup: any = db.applications.find((a: any) => a.key === key);
  if (dup || s.applicationId) {
    const appId = s.applicationId || dup?.id;
    return res.status(409).json({ success: false, code: 'APPLICATION_EXISTS', message: 'Candidate already in pipeline for this job.', applicationId: appId });
  }
  const cand: any = db.candidateProfiles.find((x: any) => String(x.email || '').toLowerCase() === String(s.candidateEmail).toLowerCase());
  const app = { id: uid('APP'), key, jobId: s.jobId, jobTitle: job.title, orgId: s.orgId, requisitionId: job.requisitionId, candidateEmail: s.candidateEmail, candidateName: cand?.name || s.candidateEmail, stage: 'Applied', source: `submission:${s.id}`, submissionId: s.id, agencyId: s.agencyId, createdAt: nowIso(), updatedAt: nowIso() };
  db.applications.unshift(app);
  pushHistory(db.stageHistory, { id: uid('STG'), applicationId: app.id, from: '-', to: 'Applied', actor: ctx.email, reason: `Accepted submission ${s.id}`, createdAt: nowIso() });
  job.applicantsCount = (job.applicantsCount || 0) + 1;
  s.status = 'Shortlisted'; s.applicationId = app.id; s.updatedAt = nowIso();
  audit(ctx.email, `SUBMISSION_ACCEPTED:${s.id}->${app.id}`, s.orgId, 'submission', s.id, req.ip);
  if (s.submittedBy) notify(db, s.submittedBy, 'submission', `Submission ${s.id} accepted — ${s.candidateEmail} entered the pipeline for ${s.jobId} (${app.id}).`, s.orgId);
  notify(db, `company:${s.orgId}`, 'submission', `Submission ${s.id} accepted into pipeline (${app.id}).`, s.orgId);
  persist();
  const { key: _k, ...pub } = app;
  res.status(201).json({ success: true, data: { application: pub, submission: s } });
});
