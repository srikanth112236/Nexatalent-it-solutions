import { Router, Request, Response } from 'express';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, ctxOf, tenantOf, maskCandidate } from '../middleware/rbac.js';
import { requisitionSchema, jobSchema, applicationStage, interviewSchema, paginate, paged } from '../validate/schemas.js';
import { emit } from '../events/bus.js';
import { evaluate, consumeQuota } from '../domain/entitlements.js';

export const recruitmentRouter = Router();

const REQ_FLOW: Record<string, string[]> = { Draft: ['Pending Approval'], 'Pending Approval': ['Approved','Draft'], Approved: ['Sourcing'], Sourcing: ['Filled','On Hold','Cancelled'], 'On Hold': ['Sourcing','Cancelled'], Filled: [], Cancelled: [] };
const JOB_FLOW: Record<string, string[]> = { Draft: ['Pending Review'], 'Pending Review': ['Approved','Draft'], Approved: ['Published'], Published: ['Paused','Closed'], Paused: ['Published','Closed'], Closed: ['Archived'], Archived: [] };

// ---- Requisitions ----
recruitmentRouter.get('/requisitions', requireAuth(), (req, res) => {
  const t = tenantOf(req); const { page, pageSize, q, status } = paginate.parse(req.query);
  let rows = loadDb().requisitions as any[];
  if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctxOf(req).role)) rows = rows.filter((r) => r.orgId === t);
  if (status) rows = rows.filter((r) => r.status === status);
  if (q) rows = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(String(q).toLowerCase()));
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
recruitmentRouter.post('/requisitions', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const parsed = requisitionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const ctx = ctxOf(req); const t = tenantOf(req);
  const rec = { id: uid('REQ'), orgId: t, hiringManager: ctx.email, ...parsed.data, createdAt: nowIso(), createdBy: ctx.email };
  loadDb().requisitions.unshift(rec);
  audit(ctx.email, `REQUISITION_CREATED:${rec.id}`, t, 'requisition', rec.id, req.ip); persist();
  res.status(201).json({ success: true, data: rec });
});
recruitmentRouter.put('/requisitions/:id', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const r: any = db.requisitions.find((x: any) => x.id === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role) && r.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  if (!['Draft','Pending Approval'].includes(r.status) && !['superadmin','platform_owner'].includes(ctx.role)) return res.status(422).json({ success: false, message: `Only Draft/Pending Approval can be edited (current: ${r.status}).` });
  const b: any = req.body || {};
  for (const k of ['title','department','category','location','openings','employmentType','priority','description','experienceMin','experienceMax','budgetMin','budgetMax','hiringManager','recruiter']) {
    if (b[k] !== undefined) r[k] = b[k];
  }
  r.updatedAt = nowIso();
  audit(ctx.email, `REQUISITION_EDITED:${r.id}`, r.orgId, 'requisition', r.id, req.ip); persist();
  res.json({ success: true, data: r });
});
recruitmentRouter.delete('/requisitions/:id', requireAuth(['employer','superadmin','platform_owner','company_admin','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const i = db.requisitions.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const r: any = db.requisitions[i];
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && r.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  if (!['Draft','Cancelled'].includes(r.status) && !['superadmin','platform_owner'].includes(ctx.role)) return res.status(422).json({ success: false, message: `Only Draft/Cancelled can be deleted (current: ${r.status}). Cancel first.` });
  const linkedJobs = (db.jobs as any[]).filter((j) => j.requisitionId === r.id);
  if (linkedJobs.length > 0 && !['superadmin','platform_owner'].includes(ctx.role)) return res.status(422).json({ success: false, message: 'Requisition has linked jobs. Cancel them first.' });
  const [removed] = db.requisitions.splice(i, 1);
  audit(ctx.email, `REQUISITION_DELETED:${r.id}`, r.orgId, 'requisition', r.id, req.ip); persist();
  res.json({ success: true, data: removed });
});
recruitmentRouter.patch('/requisitions/:id/status', requireAuth(), (req: Request, res: Response) => {
  const db = loadDb(); const r: any = db.requisitions.find((x: any) => x.id === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role) && r.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const next = String(req.body.status);
  if (!(REQ_FLOW[r.status] || []).includes(next)) return res.status(422).json({ success: false, message: `Invalid transition ${r.status} → ${next}. Allowed: ${(REQ_FLOW[r.status] || []).join(', ') || 'none'}` });
  r.status = next; r.updatedAt = nowIso();
  audit(ctx.email, `REQUISITION_STATUS:${r.id}->${next}`, r.orgId, 'requisition', r.id, req.ip); persist();
  res.json({ success: true, data: r });
});

// ---- Jobs ----
recruitmentRouter.get('/jobs', requireAuth(), (req, res) => {
  const { page, pageSize, q, status } = paginate.parse(req.query);
  const db = loadDb();
  const ctx = ctxOf(req);
  let rows = db.jobs as any[];
  const mine = String(req.query.mine || '');
  if (mine) { const t = tenantOf(req); rows = rows.filter((j) => j.orgId === t); }
  else if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role)) {
    // Non-platform roles discover only published, non-private jobs (drafts stay hidden).
    rows = rows.filter((j) => j.status === 'Published' && j.visibility !== 'private');
  }
  if (status) rows = rows.filter((j) => j.status === status);
  if (q) { const s = String(q).toLowerCase(); rows = rows.filter((j) => `${j.title} ${j.description} ${j.location}`.toLowerCase().includes(s)); }
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
// Public discovery — only eligible jobs (§7.4)
recruitmentRouter.get('/jobs-public', (req, res) => {
  const now = new Date();
  const rows = (loadDb().jobs as any[]).filter((j) => j.status === 'Published' && j.visibility !== 'private' && (!j.expiryDate || new Date(j.expiryDate) > now));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
recruitmentRouter.post('/jobs', requireAuth(['employer','superadmin','company_admin','hiring_manager']), (req: Request, res: Response) => {
  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const ctx = ctxOf(req); const t = tenantOf(req);
  try { evaluate(t, 'jobs.create'); } catch (e: any) { return res.status(e.status || 403).json({ success: false, message: e.message, code: e.code }); }
  const active = (loadDb().jobs as any[]).filter((j) => j.orgId === t && ['Published','Approved'].includes(j.status)).length;
  try { evaluate(t, 'jobs.active_limit', active + 1 > 0 ? 0 : 0); } catch (e: any) { return res.status(e.status || 403).json({ success: false, message: e.message }); }
  const job = { id: uid('JOB'), orgId: t, applicantsCount: 0, ...parsed.data, createdAt: nowIso(), createdBy: ctx.email };
  loadDb().jobs.unshift(job);
  consumeQuota(t, ctx.email, 'jobs.create', 0, job.id, `job-create:${job.id}`);
  audit(ctx.email, `JOB_CREATED:${job.id}`, t, 'job', job.id, req.ip); persist();
  emit('job.published', job, t, ctx.email);
  res.status(201).json({ success: true, data: job });
});
recruitmentRouter.put('/jobs/:id', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const j: any = db.jobs.find((x: any) => x.id === req.params.id);
  if (!j) return res.status(404).json({ success: false, message: 'Job not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && j.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Job not found.' });
  const b: any = req.body || {};
  for (const k of ['title','description','location','employmentType','workArrangement','salaryMin','salaryMax','visibility','expiryDate','requiredSkills','preferredSkills','qualifications','assignedAgencies','assignedVendors']) {
    if (b[k] !== undefined) j[k] = b[k];
  }
  j.updatedAt = nowIso();
  audit(ctx.email, `JOB_EDITED:${j.id}`, j.orgId, 'job', j.id, req.ip); persist();
  res.json({ success: true, data: j });
});
recruitmentRouter.patch('/jobs/:id/status', requireAuth(['employer','superadmin','company_admin','hiring_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const j: any = db.jobs.find((x: any) => x.id === req.params.id);
  if (!j) return res.status(404).json({ success: false, message: 'Job not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && j.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Job not found.' });
  const next = String(req.body.status);
  if (!(JOB_FLOW[j.status] || []).includes(next)) return res.status(422).json({ success: false, message: `Invalid transition ${j.status} → ${next}` });
  j.status = next; j.updatedAt = nowIso();
  audit(ctx.email, `JOB_STATUS:${j.id}->${next}`, j.orgId, 'job', j.id, req.ip); persist();
  if (next === 'Published') emit('job.published', j, j.orgId, ctx.email);
  res.json({ success: true, data: j });
});

// ---- Candidate search (tiered disclosure §8.5) ----
recruitmentRouter.get('/candidates/search', requireAuth(['employer','superadmin','company_admin','company_recruiter','internal_recruiter','recruiter','employee','operations_admin']), (req: Request, res: Response) => {
  const ctx = ctxOf(req); const t = tenantOf(req);
  try { evaluate(t, 'candidates.search'); } catch (e: any) { return res.status(e.status || 403).json({ success: false, message: e.message, code: e.code, upgrade: true }); }
  const { page, pageSize, q } = paginate.parse(req.query);
  const tier = String(req.query.tier || 'preview'); // preview | full | contact
  if (tier !== 'preview') {
    try { evaluate(t, tier === 'contact' ? 'candidates.contact_unlock' : 'candidates.profile_view'); } catch (e: any) { return res.status(e.status || 403).json({ success: false, message: e.message, code: e.code, upgrade: true }); }
  }
  let rows = loadDb().candidateProfiles as any[];
  if (q) { const s = String(q).toLowerCase(); rows = rows.filter((c) => `${c.name} ${c.roleTitle} ${c.location}`.toLowerCase().includes(s)); }
  const canSee = ctx.permissions.includes('view_sensitive_fields');
  rows = rows.map((c) => {
    if (tier === 'preview') { const { phone, currentCtc, email, ...rest } = c; return { ...rest, email: undefined, contactLocked: true }; }
    if (tier === 'full') return maskCandidate(c, canSee);
    consumeQuota(t, ctx.email, 'candidates.contact_unlock', 1, c.id, `unlock:${t}:${c.id}:${ctx.email}`);
    return c;
  });
  res.json({ success: true, tier, ...paged(rows, page, pageSize) });
});

// ---- Applications (ATS §8.8) ----
recruitmentRouter.get('/applications', requireAuth(), (req, res) => {
  const ctx = ctxOf(req);
  let rows = loadDb().applications as any[];
  if (ctx.role === 'candidate') rows = rows.filter((a) => String(a.candidateEmail).toLowerCase() === ctx.email.toLowerCase());
  else if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role)) rows = rows.filter((a) => a.orgId === ctx.tenantId);
  const { page, pageSize, status } = paginate.parse(req.query);
  if (status) rows = rows.filter((a) => a.stage === status);
  if (req.query.jobId) rows = rows.filter((a) => a.jobId === req.query.jobId);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
recruitmentRouter.post('/applications', requireAuth(['candidate','superadmin','agency_recruiter','agency_admin','recruiter','vendor']), (req: Request, res: Response) => {
  const { jobId, candidateEmail } = req.body || {};
  if (!jobId || !candidateEmail) return res.status(400).json({ success: false, message: 'jobId + candidateEmail required.' });
  const db = loadDb();
  const job: any = db.jobs.find((j: any) => j.id === jobId);
  if (!job || job.status !== 'Published' || (job.expiryDate && new Date(job.expiryDate) <= new Date())) return res.status(422).json({ success: false, message: 'Job is not accepting applications.' });
  const key = `${jobId}::${String(candidateEmail).toLowerCase()}`;
  if (db.applications.find((a: any) => a.key === key)) return res.status(409).json({ success: false, message: 'Already applied to this job.' });
  const ctx = ctxOf(req);
  if (ctx.role === 'candidate' && String(candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(403).json({ success: false, message: 'Apply as yourself only.' });
  const app = { id: uid('APP'), key, jobId, jobTitle: job.title, orgId: job.orgId, requisitionId: job.requisitionId, candidateEmail, stage: 'Applied', source: ctx.role, createdAt: nowIso(), updatedAt: nowIso() };
  db.applications.unshift(app);
  db.stageHistory.unshift({ id: uid('STG'), applicationId: app.id, from: '-', to: 'Applied', actor: ctx.email, createdAt: nowIso() });
  job.applicantsCount = (job.applicantsCount || 0) + 1;
  audit(ctx.email, `APPLICATION_SUBMITTED:${app.id}`, job.orgId, 'application', app.id, req.ip); persist();
  emit('application.stage', { ...app }, job.orgId, ctx.email);
  const { key: _k, ...pub } = app;
  res.status(201).json({ success: true, data: pub });
});
recruitmentRouter.patch('/applications/:id/stage', requireAuth(['employer','superadmin','company_admin','hiring_manager','company_recruiter','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role) && a.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Application not found.' });
  const parsed = applicationStage.safeParse(req.body.stage);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid stage.' });
  const from = a.stage; a.stage = parsed.data; a.updatedAt = nowIso();
  if (req.body.reason) a.stageReason = String(req.body.reason);
  db.stageHistory.unshift({ id: uid('STG'), applicationId: a.id, from, to: a.stage, actor: ctx.email, reason: req.body.reason || '', createdAt: nowIso() });
  audit(ctx.email, `APPLICATION_STAGE:${a.id} ${from}->${a.stage}`, a.orgId, 'application', a.id, req.ip); persist();
  emit('application.stage', { ...a }, a.orgId, ctx.email);
  res.json({ success: true, data: a });
});

// ---- Interviews + feedback ----
recruitmentRouter.get('/interviews', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().interviews as any[];
  if (ctx.role === 'candidate') rows = rows.filter((i) => String(i.candidateEmail).toLowerCase() === ctx.email.toLowerCase());
  else if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role)) rows = rows.filter((i) => i.companyId === ctx.tenantId || i.orgId === ctx.tenantId);
  res.json({ success: true, data: rows });
});
recruitmentRouter.post('/interviews', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const parsed = interviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const db = loadDb(); const ctx = ctxOf(req);
  const app: any = db.applications.find((a: any) => a.id === parsed.data.applicationId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!['superadmin','platform_owner'].includes(ctx.role) && app.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Application not found.' });
  const iv = { id: uid('INT'), ...parsed.data, candidateEmail: app.candidateEmail, candidateName: app.candidateName || app.candidateEmail, companyId: app.orgId, orgId: app.orgId, status: 'Scheduled', createdAt: nowIso() };
  db.interviews.unshift(iv);
  app.stage = 'Interview Scheduled'; app.updatedAt = nowIso();
  db.stageHistory.unshift({ id: uid('STG'), applicationId: app.id, from: 'Shortlisted', to: 'Interview Scheduled', actor: ctx.email, createdAt: nowIso() });
  audit(ctx.email, `INTERVIEW_SCHEDULED:${iv.id}`, app.orgId, 'interview', iv.id, req.ip); persist();
  emit('interview.scheduled', { ...iv, applicationId: app.id }, app.orgId, ctx.email);
  res.status(201).json({ success: true, data: iv });
});
recruitmentRouter.post('/interviews/:id/feedback', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee']), (req: Request, res: Response) => {
  const db = loadDb(); const iv: any = db.interviews.find((x: any) => x.id === req.params.id);
  if (!iv) return res.status(404).json({ success: false, message: 'Interview not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner','employee','operations_admin'].includes(ctx.role) && iv.companyId !== ctx.tenantId && iv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Interview not found.' });
  const rating = Number(req.body.rating);
  if (req.body.rating !== undefined && !(rating >= 1 && rating <= 5)) return res.status(400).json({ success: false, message: 'rating must be 1-5.' });
  const fb = { id: uid('FB'), interviewId: iv.id, rating: req.body.rating === undefined ? undefined : rating, notes: String(req.body.notes || '').slice(0, 2000), by: ctx.email, createdAt: nowIso() };
  db.feedback.unshift(fb);
  audit(ctx.email, `INTERVIEW_FEEDBACK:${iv.id}`, iv.companyId || iv.orgId, 'interview', iv.id, req.ip); persist();
  res.status(201).json({ success: true, data: fb });
});
recruitmentRouter.get('/interviews/:id/feedback', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const iv: any = db.interviews.find((x: any) => x.id === req.params.id);
  if (!iv) return res.status(404).json({ success: false, message: 'Interview not found.' });
  if (!['superadmin','platform_owner','employee','operations_admin'].includes(ctx.role) && iv.companyId !== ctx.tenantId && iv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Interview not found.' });
  res.json({ success: true, data: db.feedback.filter((f: any) => f.interviewId === iv.id) });
});

// ---- Offers & placements ----
recruitmentRouter.post('/offers', requireAuth(['employer','superadmin','company_admin','hiring_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const { applicationId, ctc, currency, joinDate } = req.body || {};
  const app: any = db.applications.find((a: any) => a.id === applicationId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!['superadmin','platform_owner'].includes(ctxOf(req).role) && app.orgId !== ctxOf(req).tenantId) return res.status(404).json({ success: false, message: 'Application not found.' });
  const offer = { id: uid('OFF'), applicationId, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail, ctc: Number(ctc || 0), currency: currency || 'INR', joinDate, status: 'Issued', createdAt: nowIso() };
  db.offers.unshift(offer); app.stage = 'Offer'; app.updatedAt = nowIso();
  audit(ctxOf(req).email, `OFFER_ISSUED:${offer.id}`, app.orgId, 'offer', offer.id, req.ip); persist();
  emit('application.stage', { ...app, stage: 'Offer' }, app.orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: offer });
});
recruitmentRouter.post('/placements', requireAuth(['employer','superadmin','company_admin','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const { applicationId, joinDate, feeBasis } = req.body || {};
  const app: any = db.applications.find((a: any) => a.id === applicationId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!['superadmin','platform_owner'].includes(ctxOf(req).role) && app.orgId !== ctxOf(req).tenantId) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (db.placements.find((p: any) => p.applicationId === applicationId)) return res.status(409).json({ success: false, message: 'Placement already recorded.' });
  const pl = { id: uid('PLC'), applicationId, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail, joinDate: joinDate || nowIso(), feeBasis: Number(feeBasis || 0), status: 'Joined', createdAt: nowIso() };
  db.placements.unshift(pl); app.stage = 'Hired'; app.updatedAt = nowIso();
  audit(ctxOf(req).email, `PLACEMENT_JOINED:${pl.id}`, app.orgId, 'placement', pl.id, req.ip); persist();
  emit('placement.joined', { placementId: pl.id, applicationId, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail, stage: 'Hired' }, app.orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: pl });
});
recruitmentRouter.get('/placements', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().placements as any[];
  if (!['superadmin','platform_owner','operations_admin','employee','finance_admin'].includes(ctx.role)) rows = rows.filter((p) => p.orgId === ctx.tenantId);
  res.json({ success: true, data: rows });
});

// ---- Talent pools + saved jobs ----
recruitmentRouter.get('/talent-pools', requireAuth(['employer','superadmin','company_admin','company_recruiter']), (req, res) => {
  const t = tenantOf(req); res.json({ success: true, data: (loadDb().talentPools as any[]).filter((p) => p.orgId === t || ['superadmin'].includes(ctxOf(req).role)) });
});
recruitmentRouter.post('/talent-pools', requireAuth(['employer','superadmin','company_admin']), (req: Request, res: Response) => {
  const t = tenantOf(req);
  try { evaluate(t, 'talent_pool.create'); } catch (e: any) { return res.status(e.status || 403).json({ success: false, message: e.message }); }
  const pool = { id: uid('POOL'), orgId: t, name: req.body.name || 'Untitled pool', description: req.body.description || '', owner: ctxOf(req).email, createdAt: nowIso() };
  loadDb().talentPools.unshift(pool); persist();
  res.status(201).json({ success: true, data: pool });
});
function poolOf(db: any, req: any, ctx: any): any {
  const p: any = db.talentPools.find((x: any) => x.id === req.params.id);
  if (!p) return null;
  if (!['superadmin','platform_owner'].includes(ctx.role) && p.orgId !== ctx.tenantId) return null;
  return p;
}
recruitmentRouter.post('/talent-pools/:id/members', requireAuth(['employer','superadmin','company_admin']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  if (!poolOf(db, req, ctx)) return res.status(404).json({ success: false, message: 'Pool not found.' });
  if (!req.body.candidateId) return res.status(400).json({ success: false, message: 'candidateId required.' });
  const m = { id: uid('TPM'), poolId: req.params.id, candidateId: req.body.candidateId, addedBy: ctx.email, createdAt: nowIso() };
  db.talentPoolMembers.unshift(m); persist(); res.status(201).json({ success: true, data: m });
});
recruitmentRouter.get('/saved-jobs', requireAuth(['candidate','superadmin']), (req, res) => {
  const ctx = ctxOf(req);
  res.json({ success: true, data: (loadDb().savedJobs as any[]).filter((s) => s.candidateEmail === ctx.email || ctx.role === 'superadmin') });
});
recruitmentRouter.post('/saved-jobs', requireAuth(['candidate','superadmin']), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const key = `${req.body.jobId}::${ctx.email.toLowerCase()}`;
  if (db.savedJobs.find((s: any) => s.key === key)) return res.status(409).json({ success: false, message: 'Already saved.' });
  const row = { id: uid('SAVE'), key, jobId: req.body.jobId, candidateEmail: ctx.email, createdAt: nowIso() };
  db.savedJobs.unshift(row); persist();
  const { key: _k, ...pub } = row; res.status(201).json({ success: true, data: pub });
});
recruitmentRouter.delete('/saved-jobs/:jobId', requireAuth(['candidate','superadmin']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const i = db.savedJobs.findIndex((s: any) => s.jobId === req.params.jobId && s.candidateEmail === ctx.email);
  if (i < 0) return res.status(404).json({ success: false, message: 'Not found.' });
  db.savedJobs.splice(i, 1); persist(); res.json({ success: true, message: 'Removed.' });
});

// ---- Job detail (§7.4) ----
recruitmentRouter.get('/jobs/:id', requireAuth(), (req, res) => {
  const j: any = loadDb().jobs.find((x: any) => x.id === req.params.id);
  if (!j) return res.status(404).json({ success: false, message: 'Job not found.' });
  const ctx = ctxOf(req);
  const owner = ['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role) || j.orgId === ctx.tenantId;
  if (!owner && !(j.status === 'Published' && j.visibility !== 'private')) return res.status(404).json({ success: false, message: 'Job not found.' });
  const now = new Date();
  const open = j.status === 'Published' && (!j.expiryDate || new Date(j.expiryDate) > now);
  res.json({ success: true, data: { ...j, acceptingApplications: open } });
});

// ---- Interview reschedule / cancel (history preserved, §11) ----
recruitmentRouter.patch('/interviews/:id', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin','candidate']), (req: Request, res: Response) => {
  const db = loadDb(); const iv: any = db.interviews.find((x: any) => x.id === req.params.id);
  if (!iv) return res.status(404).json({ success: false, message: 'Interview not found.' });
  const ctx = ctxOf(req);
  if (ctx.role === 'candidate' && String(iv.candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Interview not found.' });
  if (['employer','company_admin','hiring_manager'].includes(ctx.role) && iv.companyId !== ctx.tenantId && iv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Interview not found.' });
  const { scheduledAt, status, reason } = req.body || {};
  if (status && !['Scheduled', 'Rescheduled', 'Completed', 'Cancelled'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });
  const prev = iv.status;
  if (scheduledAt) iv.scheduledAt = scheduledAt;
  if (status) iv.status = status;
  else if (scheduledAt) iv.status = 'Rescheduled';
  iv.history = [...(iv.history || []), { from: prev, to: iv.status, at: nowIso(), by: ctx.email, reason: reason || '' }];
  db.notifications.unshift({ id: uid('NOTIF'), recipient: ctx.role === 'candidate' ? `company:${iv.companyId}` : iv.candidateEmail, kind: 'interview', body: `Interview ${iv.id} ${prev} → ${iv.status}${reason ? `: ${reason}` : ''}`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: iv.companyId || iv.orgId });
  audit(ctx.email, `INTERVIEW_${iv.status.toUpperCase()}:${iv.id}`, iv.companyId || iv.orgId, 'interview', iv.id, req.ip); persist();
  res.json({ success: true, data: iv });
});

// ---- Application stage history (read timeline, §8.8) ----
recruitmentRouter.get('/applications/:id/history', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (ctx.role === 'candidate' && String(a.candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!['superadmin','platform_owner','operations_admin','employee'].includes(ctx.role) && a.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Application not found.' });
  res.json({ success: true, data: db.stageHistory.filter((h: any) => h.applicationId === a.id) });
});

// ---- Candidate withdraws application (§7.6) ----
recruitmentRouter.post('/applications/:id/withdraw', requireAuth(['candidate','superadmin']), (req: Request, res: Response) => {
  const db = loadDb(); const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  const ctx = ctxOf(req);
  if (ctx.role === 'candidate' && String(a.candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (['Hired', 'Withdrawn'].includes(a.stage)) return res.status(422).json({ success: false, message: `Cannot withdraw from stage ${a.stage}.` });
  const from = a.stage; a.stage = 'Withdrawn'; a.updatedAt = nowIso();
  db.stageHistory.unshift({ id: uid('STG'), applicationId: a.id, from, to: 'Withdrawn', actor: ctx.email, reason: req.body?.reason || '', createdAt: nowIso() });
  const conv: any = db.conversations.find((c: any) => c.applicationId === a.id);
  if (conv) { conv.status = 'closed'; conv.closedReason = 'candidate_withdrew'; }
  audit(ctx.email, `APPLICATION_WITHDRAWN:${a.id}`, a.orgId, 'application', a.id, req.ip); persist();
  res.json({ success: true, data: a });
});

// ---- Talent pool edit / archive / remove member ----
recruitmentRouter.patch('/talent-pools/:id', requireAuth(['employer','superadmin','company_admin']), (req, res) => {
  const db = loadDb(); const p: any = db.talentPools.find((x: any) => x.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Pool not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && p.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Pool not found.' });
  const { name, description, status, tags } = req.body || {};
  if (name) p.name = String(name);
  if (description !== undefined) p.description = String(description);
  if (tags !== undefined) p.tags = tags;
  if (status && ['Active', 'Archived'].includes(status)) p.status = status;
  p.updatedAt = nowIso();
  audit(ctx.email, `TALENT_POOL_UPDATED:${p.id}`, p.orgId, 'talent-pool', p.id, req.ip); persist();
  res.json({ success: true, data: p });
});
recruitmentRouter.delete('/talent-pools/:id/members/:memberId', requireAuth(['employer','superadmin','company_admin']), (req, res) => {
  const db = loadDb();
  if (!poolOf(db, req, ctxOf(req))) return res.status(404).json({ success: false, message: 'Pool not found.' });
  const i = db.talentPoolMembers.findIndex((m: any) => m.id === req.params.memberId && m.poolId === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Member not found.' });
  db.talentPoolMembers.splice(i, 1); persist();
  res.json({ success: true, message: 'Member removed.' });
});
recruitmentRouter.get('/talent-pools/:id/members', requireAuth(['employer','superadmin','company_admin','company_recruiter']), (req, res) => {
  if (!poolOf(loadDb(), req, ctxOf(req))) return res.status(404).json({ success: false, message: 'Pool not found.' });
  res.json({ success: true, data: loadDb().talentPoolMembers.filter((m: any) => m.poolId === req.params.id) });
});
