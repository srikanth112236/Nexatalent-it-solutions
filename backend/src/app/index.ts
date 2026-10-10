import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { loadDb, uid, nowIso, audit, persist } from '../db/store.js';
import { authRouter } from '../routes/auth.js';
import { recruitmentRouter } from '../routes/recruitment.js';
import { messagingRouter } from '../routes/messaging.js';
import { commercialRouter } from '../routes/commercial.js';
import { salesRouter } from '../routes/sales.js';
import { directoryRouter } from '../routes/directory.js';
import { extendedRouter } from '../routes/extended.js';
import { requireAuth, ctxOf, tenantOf, ROLE_PERMISSIONS } from '../middleware/rbac.js';

function pick<T extends Record<string, unknown>>(obj: unknown, keys: string[]): T {
  const out: Record<string, unknown> = {};
  if (obj && typeof obj === 'object') {
    for (const k of keys) {
      const v = (obj as Record<string, unknown>)[k];
      if (v !== undefined) out[k] = v;
    }
  }
  return out as T;
}

export function createApp(): Express {
  const app = express();
  loadDb();

  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-Requested-With', 'X-Provider-Signature'],
    optionsSuccessStatus: 204,
  }));
  app.use(express.json({
    limit: '2mb',
    verify: (req: any, _res, buf) => { req.rawBody = buf; },
  }));
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimit({ windowMs: 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'nexatalent-backend-api', environment: config.env, phases: ['core','experience','monetization','sales-agency','hardening'], version: '2.0.0' });
  });
  app.get('/api/v1', (_req, res) => {
    res.json({ version: '2.0.0', message: 'NexaTalent Enterprise Recruitment API — all 5 phases', modules: ['auth','directory','recruitment','messaging','commercial','sales','reports','notifications'] });
  });

  // ---- New modular enterprise API ----
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1', recruitmentRouter);
  app.use('/api/v1', messagingRouter);
  app.use('/api/v1', commercialRouter);
  app.use('/api/v1', salesRouter);
  app.use('/api/v1', directoryRouter);
  app.use('/api/v1', extendedRouter);

  // ---- Legacy bridges (old frontend keeps working) ----
  app.get('/api/v1/candidates', requireAuth(['recruiter','employer','superadmin','company_admin','company_recruiter','internal_recruiter','agency_admin','employee','operations_admin','support_admin']), (req: Request, res: Response) => {
    const ctx = ctxOf(req);
    const canSee = (ROLE_PERMISSIONS[ctx.role] || []).includes('view_sensitive_fields');
    const rows = loadDb().candidateProfiles.map((c: any) => {
      if (canSee) return c;
      const { phone, currentCtc, ...rest } = c;
      return { ...rest, email: c.email ? String(c.email).replace(/(^.).*(@.*$)/, '$1***$2') : c.email, phone: phone ? '**********' : phone, currentCtc: currentCtc ? 'Restricted' : currentCtc };
    });
    res.json({ success: true, data: rows });
  });
  // Compat: legacy Kanban moves candidate stage directly (ATS history lives on applications).
  app.patch('/api/v1/candidates/:id/stage', requireAuth(['employer','superadmin','recruiter','company_admin','agency_admin','employee','operations_admin']), (req: Request, res: Response) => {
    const db = loadDb();
    const cand: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
    if (!cand) return res.status(404).json({ success: false, message: 'Candidate not found.' });
    const ctx = ctxOf(req);
    const from = cand.stage;
    cand.stage = String(req.body.stage || from);
    cand.evaluatorNotes = req.body.notes ?? cand.evaluatorNotes;
    cand.updatedAt = nowIso();
    audit(ctx.email, `CANDIDATE_STAGE:${cand.id} ${from}->${cand.stage}`, ctx.tenantId, 'candidate', cand.id, req.ip); persist();
    res.json({ success: true, data: cand });
  });
  app.post('/api/v1/candidates', requireAuth(['recruiter','employer','superadmin','agency_admin','employee','operations_admin']), (req: Request, res: Response) => {
    const db = loadDb();
    const b: any = req.body || {};
    if (!b.name || !b.email) return res.status(400).json({ success: false, message: 'Candidate name and email are required.' });
    const row = { id: uid('CND'), status: 'Active', stage: b.stage || 'Applied', createdAt: nowIso(), ...pick<any>(req.body, ['name', 'email', 'phone', 'headline', 'roleTitle', 'experienceYears', 'location', 'country', 'contactPrefs', 'summary', 'objectives', 'education', 'skills', 'certifications', 'projects', 'preferences', 'currentCtc', 'expectedCtc', 'payPeriod', 'noticePeriod', 'resumeRef', 'links', 'visibility', 'stage', 'jobId', 'jobTitle', 'submittedBy', 'sourceType']) };
    db.candidateProfiles.unshift(row);
    audit(ctxOf(req).email, `CANDIDATE_PROFILE_SUBMITTED:${row.id}`, ctxOf(req).tenantId, 'candidate', row.id, req.ip); persist();
    res.status(201).json({ success: true, data: row });
  });
  app.get('/api/v1/agencies', requireAuth(), (_req: Request, res: Response) => {
    res.json({ success: true, data: loadDb().agencyProfiles });
  });
  app.get('/api/v1/crm', requireAuth(['employee','superadmin','sales_admin','sales_manager','operations_admin']), (_req: Request, res: Response) => {
    res.json({ success: true, data: loadDb().leads.map((l: any) => ({ id: l.id, clientName: l.companyName, accountOwner: l.owner, activeReqs: 0, contactEmail: l.email })) });
  });
  app.get('/api/v1/contractors', requireAuth(), (_req: Request, res: Response) => res.json({ success: true, data: loadDb().contractors }));
  app.post('/api/v1/contractors', requireAuth(['vendor','superadmin','agency_admin']), (req: Request, res: Response) => {
    const db = loadDb();
    const { name, skillset, clientName, hourlyRate } = req.body || {};
    if (!name || !skillset) return res.status(400).json({ success: false, message: 'name + skillset required.' });
    const row = { id: uid('CTR'), name: String(name), skillset: String(skillset), clientName: clientName ? String(clientName) : '', hourlyRate: hourlyRate || '', status: 'Active Deployed', startDate: nowIso().slice(0, 10) };
    db.contractors.unshift(row); audit(ctxOf(req).email, `CONTRACTOR_DEPLOYED:${row.id}`, ctxOf(req).tenantId, 'contractor', row.id, req.ip); persist();
    res.status(201).json({ success: true, data: row });
  });
  app.get('/api/v1/compliance', requireAuth(), (_req: Request, res: Response) => res.json({ success: true, data: (loadDb() as any).compliance || [] }));
  app.post('/api/v1/compliance', requireAuth(), (req: Request, res: Response) => {
    const db: any = loadDb();
    db.compliance ||= [];
    const row = { id: uid('CPL'), status: 'Pending Review', createdAt: nowIso(), ...(req.body || {}) };
    if (!row.title) return res.status(400).json({ success: false, message: 'title required.' });
    db.compliance.unshift(row); persist();
    res.status(201).json({ success: true, data: row });
  });
  // Old candidate profile/apply/company shapes → delegate to new store
  app.put('/api/v1/candidate/profile', requireAuth(['candidate','superadmin']), (req: Request, res: Response) => {
    const db = loadDb(); const b: any = req.body || {};
    if (!b.email) return res.status(400).json({ success: false, message: 'email required.' });
    const patch = pick<any>(req.body, ['name', 'email', 'phone', 'headline', 'roleTitle', 'experienceYears', 'location', 'country', 'contactPrefs', 'summary', 'objectives', 'education', 'skills', 'certifications', 'projects', 'preferences', 'employmentTypes', 'workArrangement', 'availability', 'currentCtc', 'expectedCtc', 'payPeriod', 'noticePeriod', 'resumeRef', 'resumeVersion', 'links', 'portfolio', 'linkedin', 'visibility', 'consentMarketing']);
    let p: any = db.candidateProfiles.find((x: any) => String(x.email).toLowerCase() === String(b.email).toLowerCase());
    if (!p) { p = { id: uid('CND'), status: 'Active', createdAt: nowIso(), ...patch }; db.candidateProfiles.unshift(p); }
    else Object.assign(p, patch, { updatedAt: nowIso() });
    audit(b.email, 'CANDIDATE_PROFILE_UPDATED', 'TNT-CANDIDATE', 'candidate', p.id, req.ip); persist();
    res.json({ success: true, data: p });
  });
  app.get('/api/v1/candidate/profile', requireAuth(), (req: Request, res: Response) => {
    const email = String(req.query.email || '').toLowerCase();
    const p: any = loadDb().candidateProfiles.find((x: any) => String(x.email).toLowerCase() === email);
    if (!p) return res.status(404).json({ success: false, message: 'No profile yet.' });
    res.json({ success: true, data: p });
  });
  app.get('/api/v1/candidate/applications', requireAuth(), (req: Request, res: Response) => {
    const email = String(req.query.email || '').toLowerCase();
    const rows = loadDb().applications.filter((a: any) => String(a.candidateEmail).toLowerCase() === email);
    res.json({ success: true, data: rows });
  });
  app.put('/api/v1/company', requireAuth(['employer','superadmin','company_admin']), (req: Request, res: Response) => {
    const db = loadDb(); const t = tenantOf(req); const b: any = req.body || {};
    if (!b.legalName && !b.name) return res.status(400).json({ success: false, message: 'legalName required.' });
    const patch = pick<any>(req.body, ['legalName', 'displayName', 'entityType', 'industry', 'subIndustry', 'companySize', 'website', 'description', 'countryOfIncorporation', 'registrationNumber', 'gstin', 'taxIds', 'registeredAddress', 'headquarters', 'operatingLocations', 'logoRef', 'primaryContactName', 'primaryContactDesignation', 'businessEmail', 'businessPhone', 'billingContact', 'financeEmail', 'hqLocation', 'employeeCount', 'domain', 'techStack']);
    let p: any = db.companyProfiles.find((x: any) => x.tenantId === t || x.orgId === t);
    if (!p) { p = { id: uid('COM'), tenantId: t, orgId: t, createdAt: nowIso(), ...patch }; db.companyProfiles.unshift(p); }
    else Object.assign(p, patch, { updatedAt: nowIso() });
    audit(ctxOf(req).email, 'COMPANY_PROFILE_UPDATED', t, 'company', p.id, req.ip); persist();
    res.json({ success: true, data: p });
  });
  app.get('/api/v1/company', requireAuth(['employer','superadmin','company_admin']), (req: Request, res: Response) => {
    const t = String(req.query.tenant || req.headers['x-tenant-id'] || tenantOf(req));
    const p: any = loadDb().companyProfiles.find((x: any) => x.tenantId === t || x.orgId === t);
    if (!p) return res.status(404).json({ success: false, message: 'No company profile yet.' });
    res.json({ success: true, data: p });
  });

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API route not found.' });
  });
  app.use(errorHandler);
  return app;
}
