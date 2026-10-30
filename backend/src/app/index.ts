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
import { requireAuth, ctxOf, tenantOf, maskCandidate, isAllTenant } from '../middleware/rbac.js';

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

  // This server only ever returns JSON/CSV/binary documents, so a locked-down CSP is
  // safe here. The SPA shell is served by the edge host and carries its own policy.
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'none'"],
        'base-uri': ["'none'"],
        'form-action': ["'none'"],
        'frame-ancestors': ["'none'"],
        'script-src': ["'none'"],
        'object-src': ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'no-referrer' },
  }));
  app.use(cors({
    origin: (origin, callback) => {
      // P2-9: in prod, non-browser (no origin) clients are denied unless explicitly allowed.
      if (!origin) {
        if ((process.env.NODE_ENV || '') === 'production' && process.env.ALLOW_NO_ORIGIN !== 'true') {
          return callback(new Error('CORS blocked: missing origin'));
        }
        return callback(null, true);
      }
      let parsed: URL;
      try { parsed = new URL(origin); } catch { return callback(new Error(`CORS blocked for origin: ${origin}`)); }
      // Exact host matching only — suffix/`includes` checks let
      // https://nexatalentitsolutions.com.attacker.io through.
      const host = parsed.hostname.toLowerCase();
      const isTrustedHost =
        host === 'nexatalentitsolutions.com' ||
        host === 'www.nexatalentitsolutions.com' ||
        host === 'nexatalent.com' ||
        host === 'www.nexatalent.com' ||
        host.endsWith('.azurestaticapps.net') ||
        host.endsWith('.azurewebsites.net') ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '[::1]';
      if (config.corsOrigins.includes(origin) || isTrustedHost) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Token', 'X-Nexa-Authorization', 'X-Authorization', 'X-Tenant-ID', 'X-Requested-With', 'X-Provider-Signature'],
    optionsSuccessStatus: 204,
  }));
  // Phase A: 8 MB covers ~5 MB base64 resumes; per-type/MB checks still run in routes.
  app.use(express.json({
    limit: '8mb',
    verify: (req: any, _res, buf) => { req.rawBody = buf; },
  }));
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimit({ windowMs: 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false }));
  // Phase E: request correlation — echo inbound x-request-id or mint one.
  // P1-6: sanitize reflected header (alphanumerics + dash only) to block CRLF/log injection.
  app.use((req: any, res, next) => {
    const raw = String(req.headers['x-request-id'] || '');
    const clean = /^[A-Za-z0-9-]{1,64}$/.test(raw) ? raw : uid('REQ');
    const id = raw ? clean : uid('REQ');
    req.requestId = id;
    res.setHeader('x-request-id', id);
    next();
  });

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
  // Phase A: the legacy candidate dump is scoped + paged like everything else.
  app.get('/api/v1/candidates', requireAuth(['recruiter','employer','superadmin','company_admin','company_recruiter','internal_recruiter','agency_admin','employee','operations_admin']), (req: Request, res: Response) => {
    const ctx = ctxOf(req);
    const db = loadDb();
    // Phase C: effective grants (not just the role template) decide unmasking.
    const canSee = (ctx.permissions || []).includes('view_sensitive_fields');
    let profiles = db.candidateProfiles as any[];
    if (!isAllTenant(ctx.role)) {
      // Companies/agencies (and tenant-scoped staff) resolve only candidates already
      // in the pipeline of the tenant they are acting on.
      const scope = tenantOf(req);
      const mine = new Set(
        (db.applications as any[]).filter((a: any) => a.orgId === scope).map((a: any) => String(a.candidateEmail || '').toLowerCase())
      );
      for (const s of ((db as any).submissions as any[]) || []) {
        if (s.agencyId === scope) mine.add(String(s.candidateEmail || '').toLowerCase());
      }
      profiles = profiles.filter((c: any) => mine.has(String(c.email || '').toLowerCase()));
    }
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
    const total = profiles.length;
    const rows = profiles.slice((page - 1) * pageSize, page * pageSize).map((c: any) => maskCandidate(c, canSee));
    res.json({ success: true, data: rows, pagination: { page, pageSize, total } });
  });
  // Compat: legacy Kanban moves route through the guarded application flow.
  app.patch('/api/v1/candidates/:id/stage', requireAuth(['employer','superadmin','company_admin','agency_admin','employee','operations_admin']), (req: Request, res: Response) => {
    const db = loadDb();
    const cand: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
    if (!cand) return res.status(404).json({ success: false, message: 'Candidate not found.' });
    const ctx = ctxOf(req);
    const linked = (db.applications as any[]).some((a: any) =>
      String(a.candidateEmail || '').toLowerCase() === String(cand.email || '').toLowerCase() &&
      (isAllTenant(ctx.role) || a.orgId === tenantOf(req)));
    if (!linked) return res.status(404).json({ success: false, message: 'Candidate not found.' });
    const to = String(req.body.stage || '');
    const allowed = ['Applied','Screening','Shortlisted','Interview Scheduled','Interview Completed','Selected','Offer','Hired','Rejected','Withdrawn','On Hold'];
    if (!allowed.includes(to)) return res.status(400).json({ success: false, message: `stage must be one of ${allowed.join(', ')}` });
    if (!req.body.reason && ['Rejected','Withdrawn','On Hold'].includes(to)) return res.status(400).json({ success: false, code: 'REASON_REQUIRED', message: 'A reason is required for this transition.' });
    const from = cand.stage;
    cand.stage = to;
    cand.updatedAt = nowIso();
    audit(ctx.email, `CANDIDATE_STAGE:${cand.id} ${from}->${to}`, ctx.tenantId, 'candidate', cand.id, req.ip, { before: from, after: to, reason: req.body.reason || '' }); persist();
    res.json({ success: true, data: cand });
  });
  app.post('/api/v1/candidates', requireAuth(['recruiter','employer','superadmin','agency_admin','employee','operations_admin']), (req: Request, res: Response) => {
    const db = loadDb();
    const b: any = req.body || {};
    if (!b.name || !b.email) return res.status(400).json({ success: false, message: 'Candidate name and email are required.' });
    if (db.candidateProfiles.some((c: any) => String(c.email || '').toLowerCase() === String(b.email).toLowerCase())) {
      return res.status(409).json({ success: false, code: 'CANDIDATE_EXISTS', message: 'A profile with this email already exists.' });
    }
    const row = { id: uid('CND'), status: 'Active', stage: b.stage || 'Applied', createdAt: nowIso(), ...pick<any>(req.body, ['name', 'email', 'phone', 'headline', 'roleTitle', 'experienceYears', 'location', 'country', 'contactPrefs', 'summary', 'objectives', 'education', 'skills', 'certifications', 'projects', 'preferences', 'currentCtc', 'expectedCtc', 'payPeriod', 'noticePeriod', 'resumeRef', 'links', 'visibility', 'stage', 'jobId', 'jobTitle', 'submittedBy', 'sourceType']) };
    db.candidateProfiles.unshift(row);
    audit(ctxOf(req).email, `CANDIDATE_PROFILE_SUBMITTED:${row.id}`, ctxOf(req).tenantId, 'candidate', row.id, req.ip); persist();
    res.status(201).json({ success: true, data: row });
  });
  // Phase A: agency directory is scoped — full rows for platform + own agency,
  // a directory-lite projection for hiring companies, nothing for everyone else.
  app.get('/api/v1/agencies', requireAuth(), (req: Request, res: Response) => {
    const ctx = ctxOf(req);
    const db = loadDb();
    if (isAllTenant(ctx.role)) {
      return res.json({ success: true, data: db.agencyProfiles });
    }
    if (['agency_admin','agency_recruiter','recruiter','vendor'].includes(ctx.role)) {
      return res.json({ success: true, data: db.agencyProfiles.filter((a: any) => a.tenantId === ctx.tenantId) });
    }
    if (['employer','company_admin','hiring_manager','company_recruiter'].includes(ctx.role)) {
      const names = new Set<string>();
      for (const j of db.jobs as any[]) {
        if (j.orgId !== ctx.tenantId) continue;
        for (const a of [...(j.assignedAgencies || []), ...(j.assignedVendors || [])]) names.add(String(a).toLowerCase());
      }
      const lite = db.agencyProfiles
        .filter((a: any) => names.has(String(a.displayName || '').toLowerCase()) || names.has(String(a.legalName || '').toLowerCase()))
        .map((a: any) => ({ id: a.id, name: a.displayName || a.legalName, verificationStatus: a.verificationStatus, accountStatus: a.accountStatus }));
      return res.json({ success: true, data: lite });
    }
    return res.status(403).json({ success: false, message: 'Access denied for this role.' });
  });
  app.get('/api/v1/crm', requireAuth(['employee','superadmin','sales_admin','sales_manager','operations_admin','bda']), (req: Request, res: Response) => {
    const db = loadDb();
    const ctx = ctxOf(req);
    const allTenant = isAllTenant(ctx.role);
    // Accounts = real organizations (converted clients); leads = the sales pipeline.
    // Previously this endpoint returned leads only and the UI labelled them "client
    // accounts", so a freshly converted client looked like it had vanished.
    const orgsByLead = new Map<string, string[]>();
    for (const o of db.organizations as any[]) {
      if ((o as any).leadId) {
        const arr = orgsByLead.get((o as any).leadId) || [];
        arr.push(o.id);
        orgsByLead.set((o as any).leadId, arr);
      }
    }
    const ownedLeads = (db.leads as any[]).filter((l: any) =>
      allTenant ? true : (['bda', 'employee'].includes(ctx.role) ? (!l.owner || l.owner === ctx.email) : (!l.owner || l.owner === ctx.email)));
    const ownedLeadIds = new Set(ownedLeads.map((l: any) => l.id));
    const OPEN_REQ = ['Approved', 'Sourcing', 'Pending Approval'];
    const openReqsFor = (orgId: string) => (db.requisitions as any[]).filter((r: any) => r.orgId === orgId && OPEN_REQ.includes(r.status)).length;
    const leadById = new Map(ownedLeads.map((l: any) => [l.id, l]));

    const accounts = (db.organizations as any[])
      .filter((o: any) => allTenant || ownedLeadIds.has(o.leadId) || o.id === ctx.tenantId)
      .map((o: any) => {
        const lead: any = leadById.get(o.leadId) || null;
        const activeReqs = openReqsFor(o.id);
        const overdue = lead?.nextFollowUp && new Date(lead.nextFollowUp) < new Date();
        return {
          id: o.id,
          kind: 'account' as const,
          clientName: o.displayName || o.legalName,
          accountOwner: lead?.owner || o.accountOwner || '',
          industry: o.industry || lead?.industry || '',
          stage: o.accountStatus || o.status || 'Active',
          contractStatus: o.verificationStatus || '',
          activeReqs,
          contactEmail: lead?.email || o.businessEmail || '',
          value: lead?.value ?? null,
          slaHealth: overdue ? 'Follow-up overdue' : activeReqs > 0 ? 'Hiring' : 'On Track',
          nextFollowUp: lead?.nextFollowUp || null,
          leadId: o.leadId || null,
          createdDate: o.createdDate || null,
        };
      });

    const leads = ownedLeads.map((l: any) => {
      const orgIds = orgsByLead.get(l.id) || [];
      const activeReqs = orgIds.reduce((n: number, id: string) => n + openReqsFor(id), 0);
      const overdue = l.nextFollowUp && new Date(l.nextFollowUp) < new Date();
      return {
        id: l.id,
        kind: 'lead' as const,
        clientName: l.companyName,
        accountOwner: l.owner,
        industry: l.industry || '',
        stage: l.stage || 'New',
        contractStatus: '',
        activeReqs,
        contactEmail: l.email,
        value: l.value ?? null,
        slaHealth: overdue ? 'Follow-up overdue' : (l.stage === 'Won' ? 'Won' : 'On Track'),
        nextFollowUp: l.nextFollowUp || null,
        leadId: l.id,
        createdDate: l.createdAt ? String(l.createdAt).slice(0, 10) : null,
      };
    });

    // Newest accounts first, then the live pipeline.
    const data = [...accounts, ...leads].sort((a: any, b: any) => (b.activeReqs - a.activeReqs) || String(a.clientName || '').localeCompare(String(b.clientName || '')));
    res.json({
      success: true,
      data,
      accounts,
      leads,
      summary: {
        accounts: accounts.length,
        leads: leads.length,
        openReqs: accounts.reduce((n: number, a: any) => n + a.activeReqs, 0),
        overdueFollowUps: leads.filter((l: any) => l.slaHealth === 'Follow-up overdue').length,
      },
    });
  });
  app.get('/api/v1/contractors', requireAuth(), (req: Request, res: Response) => {
    const ctx = ctxOf(req);
    // P1-5: scoped + rate-masked — BDA/sales/support have no business need.
    // Candidates see ONLY their own deployment row (own pay rate — legitimate need for timesheets).
    if (['candidate', 'bda', 'sales_admin', 'sales_manager', 'support_admin'].includes(ctx.role)) {
      if (ctx.role !== 'candidate') return res.status(403).json({ success: false, message: 'Access denied for this role.' });
      const own = loadDb().contractors.filter((c: any) => String((c as any).candidateEmail || '').toLowerCase() === String(ctx.email).toLowerCase());
      return res.json({ success: true, data: own });
    }
    const canSee = (ctx.permissions || []).includes('view_sensitive_fields');
    let rows = loadDb().contractors as any[];
    if (!isAllTenant(ctx.role) && ctx.role !== 'finance_admin') {
      const scope = tenantOf(req);
      rows = rows.filter((c: any) => !c.tenantId || c.tenantId === scope);
    }
    rows = rows.map((c: any) => (canSee ? c : { ...c, hourlyRate: 'Restricted' }));
    return res.json({ success: true, data: rows });
  });
  app.post('/api/v1/contractors', requireAuth(['vendor','superadmin','agency_admin']), (req: Request, res: Response) => {
    const db = loadDb();
    const { name, skillset, clientName, hourlyRate } = req.body || {};
    if (!name || !skillset) return res.status(400).json({ success: false, message: 'name + skillset required.' });
    const row = { id: uid('CTR'), name: String(name), skillset: String(skillset), clientName: clientName ? String(clientName) : '', hourlyRate: hourlyRate || '', status: 'Active Deployed', startDate: nowIso().slice(0, 10) };
    db.contractors.unshift(row); audit(ctxOf(req).email, `CONTRACTOR_DEPLOYED:${row.id}`, ctxOf(req).tenantId, 'contractor', row.id, req.ip); persist();
    res.status(201).json({ success: true, data: row });
  });
  app.get('/api/v1/compliance', requireAuth(), (req: Request, res: Response) => {
    const ctx = ctxOf(req);
    let rows = (loadDb() as any).compliance || [];
    // P1-5: tenant-scoped — non-platform sees own org only.
    if (!isAllTenant(ctx.role)) {
      const scope = tenantOf(req);
      rows = rows.filter((c: any) => c.orgId === scope);
    }
    return res.json({ success: true, data: rows });
  });
  app.post('/api/v1/compliance', requireAuth(), (req: Request, res: Response) => {
    const db: any = loadDb();
    db.compliance ||= [];
    // Phase A: allowlisted fields only — clients could previously overwrite id/status/timestamps.
    const b: any = req.body || {};
    if (!b.title) return res.status(400).json({ success: false, message: 'title required.' });
    const row = {
      id: uid('CPL'), status: 'Pending Review', createdAt: nowIso(),
      title: String(b.title).slice(0, 160),
      category: String(b.category || '').slice(0, 80),
      ref: String(b.ref || '').slice(0, 160),
      notes: String(b.notes || '').slice(0, 2000),
      orgId: ctxOf(req).tenantId, submittedBy: ctxOf(req).email,
    };
    db.compliance.unshift(row);
    audit(ctxOf(req).email, `COMPLIANCE_SUBMITTED:${row.id}`, ctxOf(req).tenantId, 'compliance', row.id, req.ip); persist();
    res.status(201).json({ success: true, data: row });
  });
  // Old candidate profile/apply/company shapes → delegate to new store
  app.put('/api/v1/candidate/profile', requireAuth(['candidate','superadmin']), (req: Request, res: Response) => {
    const db = loadDb(); const b: any = req.body || {};
    if (!b.email) return res.status(400).json({ success: false, message: 'email required.' });
    const ctx = ctxOf(req);
    // P1-5: IDOR fix — candidates can only write their own profile.
    if (ctx.role === 'candidate' && String(b.email).toLowerCase() !== ctx.email.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'You can only update your own profile.' });
    }
    const patch = pick<any>(req.body, ['name', 'email', 'phone', 'headline', 'roleTitle', 'experienceYears', 'location', 'country', 'contactPrefs', 'summary', 'objectives', 'education', 'educations', 'experience', 'experiences', 'skills', 'skillLevels', 'certifications', 'certList', 'projects', 'projectList', 'preferences', 'jobPreferences', 'employmentTypes', 'workArrangement', 'availability', 'currentCtc', 'expectedCtc', 'currency', 'payPeriod', 'noticePeriod', 'resumeRef', 'resumeVersion', 'resumeUploadedAt', 'links', 'portfolio', 'linkedin', 'github', 'codeSamples', 'visibility', 'consentMarketing', 'onboarding']);
    let p: any = db.candidateProfiles.find((x: any) => String(x.email).toLowerCase() === String(b.email).toLowerCase());
    if (!p) { p = { id: uid('CND'), status: 'Active', createdAt: nowIso(), ...patch }; db.candidateProfiles.unshift(p); }
    else Object.assign(p, patch, { updatedAt: nowIso() });
    audit(b.email, 'CANDIDATE_PROFILE_UPDATED', 'TNT-CANDIDATE', 'candidate', p.id, req.ip); persist();
    res.json({ success: true, data: p });
  });
  app.get('/api/v1/candidate/profile', requireAuth(), (req: Request, res: Response) => {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'email required.' });
    const ctx = ctxOf(req);
    const db = loadDb();
    const p: any = db.candidateProfiles.find((x: any) => String(x.email).toLowerCase() === email);
    if (!p) return res.status(404).json({ success: false, message: 'No profile yet.' });
    // Phase 4: scoped disclosure — self and platform pass; others need a linked
    // application in their own scope (non-disclosing 404 otherwise).
    if (ctx.role === 'candidate') {
      if (email !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'No profile yet.' });
      return res.json({ success: true, data: p });
    }
    if (isAllTenant(ctx.role) || ctx.role === 'employee') {
      const canSee = (ctx.permissions || []).includes('view_sensitive_fields');
      return res.json({ success: true, data: canSee ? p : maskCandidate(p, false) });
    }
    const linked = (db.applications as any[]).some((a: any) =>
      String(a.candidateEmail || '').toLowerCase() === email &&
      (a.orgId === ctx.tenantId || String(a.candidateEmail || '').toLowerCase() === ctx.email.toLowerCase()));
    const agencyLinked = ['agency_admin', 'agency_recruiter', 'recruiter', 'vendor'].includes(ctx.role) &&
      (db.submissions as any[]).some((s: any) => String(s.candidateEmail || '').toLowerCase() === email && (s.agencyId === ctx.tenantId || String(s.submittedBy || '').toLowerCase() === ctx.email.toLowerCase()));
    if (!linked && !agencyLinked) return res.status(404).json({ success: false, message: 'No profile yet.' });
    const canSee = (ctx.permissions || []).includes('view_sensitive_fields');
    return res.json({ success: true, data: maskCandidate(p, canSee) });
  });
  app.get('/api/v1/candidate/applications', requireAuth(), (req: Request, res: Response) => {
    const email = String(req.query.email || '').toLowerCase();
    const ctx = ctxOf(req);
    const db = loadDb();
    let rows = db.applications.filter((a: any) => String(a.candidateEmail).toLowerCase() === email);
    if (ctx.role === 'candidate') rows = rows.filter((a: any) => String(a.candidateEmail).toLowerCase() === ctx.email.toLowerCase());
    else if (!isAllTenant(ctx.role)) {
      // Phase 4: companies/agencies see only their own scope — never another tenant's rows.
      const scope = tenantOf(req);
      rows = rows.filter((a: any) => a.orgId === scope);
    }
    res.json({ success: true, data: rows });
  });
  app.put('/api/v1/company', requireAuth(['employer','superadmin','company_admin']), (req: Request, res: Response) => {
    const db = loadDb(); const t = tenantOf(req); const b: any = req.body || {};
    if (!b.legalName && !b.name) return res.status(400).json({ success: false, message: 'legalName required.' });
    if (b.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(String(b.gstin).trim())) {
      return res.status(400).json({ success: false, message: 'Invalid GSTIN format (e.g. 29AABCT1011A1Z5).' });
    }
    const patch = pick<any>(req.body, ['legalName', 'displayName', 'entityType', 'industry', 'subIndustry', 'companySize', 'website', 'description', 'countryOfIncorporation', 'registrationNumber', 'gstin', 'taxIds', 'registeredAddress', 'headquarters', 'operatingLocations', 'logoRef', 'primaryContactName', 'primaryContactDesignation', 'businessEmail', 'businessPhone', 'billingContact', 'financeEmail', 'hqLocation', 'employeeCount', 'domain', 'techStack', 'onboarding']);
    let p: any = db.companyProfiles.find((x: any) => x.tenantId === t || x.orgId === t);
    if (!p) { p = { id: uid('COM'), tenantId: t, orgId: t, createdAt: nowIso(), ...patch }; db.companyProfiles.unshift(p); }
    else Object.assign(p, patch, { updatedAt: nowIso() });
    audit(ctxOf(req).email, 'COMPANY_PROFILE_UPDATED', t, 'company', p.id, req.ip); persist();
    res.json({ success: true, data: p });
  });
  app.get('/api/v1/company', requireAuth(['employer','superadmin','company_admin']), (req: Request, res: Response) => {
    const ctx = ctxOf(req);
    // P1-5: ignore client ?tenant/X-Tenant-ID for company roles — server tenant only.
    const t = ['superadmin'].includes(ctx.role) ? String(req.query.tenant || req.headers['x-tenant-id'] || tenantOf(req)) : ctx.tenantId;
    const p: any = loadDb().companyProfiles.find((x: any) => x.tenantId === t || x.orgId === t);
    if (!p) return res.status(404).json({ success: false, message: 'No company profile yet.' });
    // §8.1: expose verification + account states separately (read-only here; SuperAdmin manages them).
    // The tenant organization record is the base layer (§6.4) so the employer
    // always sees a filled profile; explicit company-profile edits overlay it.
    const org: any = loadDb().organizations.find((o: any) => o.id === t || o.tenantId === t) || null;
    const orgBase: any = {};
    if (org) {
      for (const k of ['legalName', 'displayName', 'entityType', 'industry', 'subIndustry', 'companySize', 'website', 'description', 'countryOfIncorporation', 'registrationNumber', 'gstin', 'taxIds', 'registeredAddress', 'headquarters', 'operatingLocations', 'logoRef', 'primaryContactName', 'primaryContactDesignation', 'primaryContact', 'businessEmail', 'businessPhone', 'billingContact', 'financeEmail', 'hqLocation', 'employeeCount', 'domain', 'techStack']) {
        if (org[k] !== undefined && org[k] !== null && org[k] !== '') orgBase[k] = org[k];
      }
    }
    const merged = { ...orgBase, ...p };
    // Legacy alias: some profiles store `size` instead of `companySize`.
    if (!merged.companySize && (merged as any).size) merged.companySize = (merged as any).size;
    res.json({ success: true, data: { ...merged, verificationStatus: org?.verificationStatus || p.verificationStatus || 'Pending', accountStatus: org?.accountStatus || p.accountStatus || 'Invited' } });
  });

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API route not found.' });
  });
  app.use(errorHandler);
  return app;
}
