import { Router, Request, Response } from 'express';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, ctxOf } from '../middleware/rbac.js';
import { leadSchema, paginate, paged } from '../validate/schemas.js';

export const salesRouter = Router();
const LEAD_FLOW: Record<string, string[]> = { New: ['Contacted','Lost'], Contacted: ['Qualified','Lost','Nurture'], Qualified: ['Discovery Scheduled','Lost'], 'Discovery Scheduled': ['Proposal Sent','Lost'], 'Proposal Sent': ['Negotiation','Lost'], Negotiation: ['Won','Lost','Nurture'], Won: [], Lost: ['New'], Nurture: ['Contacted'] };

// ---- Leads ----
salesRouter.get('/leads', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager','operations_admin']), (req, res) => {
  const { page, pageSize, q, status } = paginate.parse(req.query);
  let rows = loadDb().leads as any[];
  if (['bda','employee'].includes(ctxOf(req).role)) rows = rows.filter((l) => !l.owner || l.owner === ctxOf(req).email);
  if (status) rows = rows.filter((l) => l.stage === status);
  if (q) rows = rows.filter((l) => JSON.stringify(l).toLowerCase().includes(String(q).toLowerCase()));
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
  if (!l) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const b: any = req.body || {};
  for (const k of ['contactName','designation','email','phone','companyName','website','industry','companySize','location','source','service','hiringNeed','openings','value','budget','closeDate','priority','owner','team','branch','nextFollowUp','notes']) {
    if (b[k] !== undefined) l[k] = b[k];
  }
  l.updatedAt = nowIso();
  audit(ctxOf(req).email, `LEAD_EDITED:${l.id}`, 'TNT-GLOBAL', 'lead', l.id, req.ip); persist();
  res.json({ success: true, data: l });
});
salesRouter.delete('/leads/:id', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager']), (req, res) => {
  const db = loadDb(); const i = db.leads.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const l: any = db.leads[i];
  if (l.stage === 'Won') return res.status(422).json({ success: false, message: 'Won leads cannot be deleted (audit). Mark Lost instead.' });
  const [removed] = db.leads.splice(i, 1);
  audit(ctxOf(req).email, `LEAD_DELETED:${l.id}`, 'TNT-GLOBAL', 'lead', l.id, req.ip); persist();
  res.json({ success: true, data: removed });
});
salesRouter.patch('/leads/:id/stage', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const l: any = db.leads.find((x: any) => x.id === req.params.id);
  if (!l) return res.status(404).json({ success: false, message: 'Lead not found.' });
  const next = String(req.body.stage);
  if (!(LEAD_FLOW[l.stage] || []).includes(next)) return res.status(422).json({ success: false, message: `Invalid ${l.stage} → ${next}` });
  if (next === 'Lost' && !req.body.reason) return res.status(400).json({ success: false, message: 'Lost reason required.' });
  l.stage = next; (l.history ||= []).push({ stage: next, at: nowIso(), reason: req.body.reason || '' });
  db.leadActivities.unshift({ id: uid('LACT'), leadId: l.id, type: 'stage', outcome: next, notes: req.body.reason || '', owner: ctxOf(req).email, createdAt: nowIso() });
  audit(ctxOf(req).email, `LEAD_STAGE:${l.id}->${next}`, 'TNT-GLOBAL', 'lead', l.id, req.ip); persist();
  res.json({ success: true, data: l });
});
salesRouter.post('/leads/:id/activities', requireAuth(['superadmin','platform_owner','sales_admin','employee','bda','sales_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const act = { id: uid('LACT'), leadId: req.params.id, type: req.body.type || 'call', outcome: req.body.outcome || '', notes: String(req.body.notes || '').slice(0, 4000), nextAction: req.body.nextAction || '', followUp: req.body.followUp || '', owner: ctxOf(req).email, createdAt: nowIso() };
  db.leadActivities.unshift(act); persist();
  res.status(201).json({ success: true, data: act });
});
salesRouter.get('/leads/:id/activities', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager','employee','bda']), (req, res) => {
  res.json({ success: true, data: loadDb().leadActivities.filter((a: any) => a.leadId === req.params.id) });
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
  if (db.organizations.find((o: any) => o.legalName === l.companyName)) return res.status(409).json({ success: false, message: 'Organization already exists (duplicate prevented).' });
  const org = { id: uid('TNT'), legalName: l.companyName, displayName: l.companyName, status: 'Invited', verificationStatus: 'Pending', accountStatus: 'Invited', leadId: l.id, createdDate: nowIso().slice(0, 10) };
  db.organizations.unshift(org);
  l.stage = 'Won'; (l.history ||= []).push({ stage: 'Won', at: nowIso(), orgId: org.id });
  // Won conversions mint a linked opportunity so pipeline value survives the handoff.
  db.opportunities.unshift({ id: uid('OPP'), leadId: l.id, orgId: org.id, title: `${l.companyName} opportunity`, value: Number(l.value || 0), currency: 'INR', stage: 'Won', owner: l.owner, createdAt: nowIso() });
  audit(ctxOf(req).email, `LEAD_CONVERTED:${l.id}->${org.id}`, org.id, 'lead', l.id, req.ip); persist();
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
salesRouter.get('/performance', requireAuth(['superadmin','platform_owner','sales_admin','sales_manager','employee']), (_req, res) => {
  const db = loadDb();
  const by = (s: string) => db.leads.filter((l: any) => l.stage === s).length;
  const won = by('Won'), total = db.leads.length || 1;
  // Response-time: hours from lead creation to first touch (activity/meeting/proposal/opportunity).
  const touches: Record<string, number> = {};
  for (const [coll, key] of [['leadActivities', 'leadId'], ['meetings', 'leadId'], ['proposals', 'leadId'], ['opportunities', 'leadId']] as const) {
    for (const t of (db[coll] as any[] || [])) {
      const id = (t as any)[key]; const at = new Date((t as any).createdAt).getTime();
      if (id && Number.isFinite(at) && (touches[id] === undefined || at < touches[id])) touches[id] = at;
    }
  }
  let respSum = 0; let respN = 0;
  for (const l of db.leads as any[]) {
    const born = new Date(l.createdAt).getTime(); const first = touches[l.id];
    if (Number.isFinite(born) && first !== undefined && first >= born) { respSum += (first - born) / 36e5; respN += 1; }
  }
  res.json({ success: true, data: { leadsAssigned: total, qualified: by('Qualified'), proposals: by('Proposal Sent'), won, lost: by('Lost'), conversionRate: +(won / total).toFixed(3), pipelineValue: db.leads.reduce((a: number, l: any) => a + Number(l.value || 0), 0), overdueFollowups: db.leads.filter((l: any) => l.nextFollowUp && new Date(l.nextFollowUp) < new Date()).length, avgResponseHrs: respN > 0 ? +(respSum / respN).toFixed(1) : 0, respondedLeads: respN } });
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
  if (!assigned) return res.status(403).json({ success: false, message: 'Job not assigned to your agency.' });
  // Duplicate / ownership window: 90 days
  const windowMs = 90 * 864e5;
  const dup = db.submissions.find((s: any) => s.jobId === jobId && String(s.candidateEmail).toLowerCase() === String(candidateEmail).toLowerCase() && Date.now() - new Date(s.createdAt).getTime() < windowMs);
  const existingApp = db.applications.find((a: any) => a.jobId === jobId && String(a.candidateEmail).toLowerCase() === String(candidateEmail).toLowerCase());
  const row = { id: uid('SUBM'), agencyId: ctx.tenantId, jobId, orgId: job.orgId, candidateEmail, resumeRef: resumeRef || '', consentEvidence: consent || '', status: dup || existingApp ? 'Duplicate-Review' : 'Submitted', duplicateOf: dup?.id || existingApp?.id || null, submittedBy: ctx.email, createdAt: nowIso() };
  db.submissions.unshift(row); audit(ctx.email, `SUBMISSION:${row.id}:${row.status}`, job.orgId, 'submission', row.id, req.ip); persist();
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
