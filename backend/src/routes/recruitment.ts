import { Router, Request, Response } from 'express';
import { loadDb, persist, uid, nowIso, audit, pushHistory } from '../db/store.js';
import { requireAuth, ctxOf, tenantOf, maskCandidate } from '../middleware/rbac.js';
import { requisitionSchema, jobSchema, applicationStage, interviewSchema, paginate, paged } from '../validate/schemas.js';
import { emit } from '../events/bus.js';
import { evaluate, consumeQuota } from '../domain/entitlements.js';
import { requirementRollup, jobCounts, checkTransition, publicJob, notify } from '../domain/pipeline.js';
import { syncCandidateLeads } from './sales.js';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { downloadFile, isBlobStorageConfigured, DEFAULT_CONTAINER } from '../storage/blob.js';
const UPLOAD_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data', 'uploads');

export const recruitmentRouter = Router();

const REQ_FLOW: Record<string, string[]> = { Draft: ['Pending Approval'], 'Pending Approval': ['Approved','Draft'], Approved: ['Sourcing'], Sourcing: ['Filled','On Hold','Cancelled'], 'On Hold': ['Sourcing','Cancelled'], Filled: [], Cancelled: [] };
const JOB_FLOW: Record<string, string[]> = { Draft: ['Pending Review'], 'Pending Review': ['Approved','Draft'], Approved: ['Published'], Published: ['Paused','Closed'], Paused: ['Published','Closed'], Closed: ['Archived'], Archived: [] };
// Extended edges (permission-gated): unpublish + authorized reopen. All other
// edges keep their existing behavior.
const EXTENDED_JOB_FLOW: Record<string, string[]> = {
  ...JOB_FLOW,
  Published: [...JOB_FLOW.Published, 'Approved'],
  Closed: [...JOB_FLOW.Closed, 'Published', 'Paused'],
};
// Platform-wide readers (no tenant filter). `employee` is tenant-scoped on purpose:
// an internal ops user sees the tenant they are acting on, never every tenant at once.
const PLATFORM_ROLES = ['superadmin','platform_owner','operations_admin'];
const AGENCY_ROLES = ['recruiter','agency_recruiter','agency_admin','vendor'];
/** Internal ops staff: see their acting tenant's records in every state, nothing beyond it. */
const TENANT_STAFF_ROLES = ['employee'];

/** Agency-scoped application linkage (§9/§10.1): an agency user may act on
 *  applications their agency submitted (submission match on job + candidate).
 *  Candidate ownership stays non-blocking — no locks are enforced anywhere. */
function agencyLinkedAppIds(db: any, ctx: any): Set<string> {
  const ids = new Set<string>();
  const subs = (db.submissions as any[] || []).filter((s: any) =>
    s.agencyId === ctx.tenantId || String(s.submittedBy || '').toLowerCase() === ctx.email.toLowerCase());
  const agencyName = (db.organizations as any[] || []).find((o: any) => o.id === ctx.tenantId)?.displayName || 'Apex Tech Search';

  for (const a of (db.applications as any[] || [])) {
    const hit = subs.some((s: any) => s.jobId === a.jobId &&
      String(s.candidateEmail || '').toLowerCase() === String(a.candidateEmail || '').toLowerCase());
    if (hit) {
      ids.add(a.id);
      continue;
    }
    const job = (db.jobs as any[] || []).find((j: any) => j.id === a.jobId || j.slug === a.jobId);
    if (job) {
      const assigned = (job.assignedAgencies || []).some((ag: string) =>
        ag === agencyName || ag === ctx.tenantId || ag.toLowerCase().includes('apex')
      );
      if (assigned) {
        ids.add(a.id);
        continue;
      }
    }
    if (a.source === 'Website') {
      ids.add(a.id);
    }
  }
  return ids;
}
function canSeeApplication(db: any, ctx: any, a: any, tenant?: string): boolean {
  if (PLATFORM_ROLES.includes(ctx.role)) return true;
  if (a.orgId === (tenant || ctx.tenantId)) return true;
  if (AGENCY_ROLES.includes(ctx.role)) return agencyLinkedAppIds(db, ctx).has(a.id);
  // Phase 5: platform recruiters work what is assigned to them (lead or supporting).
  if (ctx.role === 'internal_recruiter') return appAssignedTo(db, a, emailOf(ctx));
  return false;
}

/** Phase D: plan allowance for numeric entitlements (live counts, not ledger rows). */
function activeGrant(orgId: string, key: string): number | boolean | undefined {
  const db = loadDb();
  const sub = (db.subscriptions as any[]).filter((s: any) => s.orgId === orgId).find((s: any) => s.status === 'Active')
    || (db.subscriptions as any[]).find((s: any) => s.orgId === orgId);
  if (!sub) return undefined;
  const plan = (db.plans as any[]).find((p: any) => p.id === sub.planId);
  return plan?.entitlements?.[key];
}
function emailOf(ctx: any): string {
  return String(ctx.email || '').toLowerCase();
}
function reqAssignedTo(req: any, email: string): boolean {
  if (!req || !email) return false;
  if (String(req.recruiter || '').toLowerCase() === email) return true;
  const sup = (req.supportingRecruiters || []) as unknown[];
  return sup.some((s) => String(s).toLowerCase() === email);
}
function jobAssignedTo(db: any, job: any, email: string): boolean {
  if (!job || !email) return false;
  if (!job.requisitionId) return false;
  const r = (db.requisitions as any[]).find((x: any) => x.id === job.requisitionId);
  return r ? reqAssignedTo(r, email) : false;
}
function appAssignedTo(db: any, app: any, email: string): boolean {
  if (!app || !email) return false;
  const job = (db.jobs as any[]).find((j: any) => j.id === app.jobId);
  if (job && jobAssignedTo(db, job, email)) return true;
  if (app.requisitionId) {
    const r = (db.requisitions as any[]).find((x: any) => x.id === app.requisitionId);
    if (r && reqAssignedTo(r, email)) return true;
  }
  return false;
}

// ---- Requisitions ----
recruitmentRouter.get('/requisitions', requireAuth(), (req, res) => {
  const db = loadDb();
  const t = tenantOf(req); const { page, pageSize, q, status } = paginate.parse(req.query);
  const ctx = ctxOf(req);
  let rows = db.requisitions as any[];
  if (ctx.role === 'internal_recruiter') {
    // Phase 5: My Requirements — assigned to me as lead or supporting recruiter.
    const me = emailOf(ctx);
    rows = rows.filter((r) => reqAssignedTo(r, me));
  } else if (!PLATFORM_ROLES.includes(ctx.role)) rows = rows.filter((r) => r.orgId === t);
  else if (req.query.orgId) rows = rows.filter((r) => r.orgId === req.query.orgId);
  if (status) rows = rows.filter((r) => r.status === status);
  if (q) rows = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(String(q).toLowerCase()));
  // Rollups run over the COMPLETE filtered set — pagination slices rows, never math.
  const enriched = rows.map((r) => ({ ...r, rollup: requirementRollup(db, r) }));
  res.json({ success: true, ...paged(enriched, page, pageSize) });
});
// Phase 2: single requirement with live rollup — avoids full-list scans from drawers.
recruitmentRouter.get('/requisitions/:id', requireAuth(), (req, res) => {
  const db = loadDb(); const r: any = db.requisitions.find((x: any) => x.id === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && r.orgId !== tenantOf(req)) {
    // Phase 5: assigned recruiters may open their own requirements across tenants.
    if (!(ctx.role === 'internal_recruiter' && reqAssignedTo(r, emailOf(ctx)))) {
      return res.status(404).json({ success: false, message: 'Requisition not found.' });
    }
  }
  res.json({ success: true, data: { ...r, rollup: requirementRollup(db, r) } });
});
recruitmentRouter.post('/requisitions', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const parsed = requisitionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const ctx = ctxOf(req);
  const db = loadDb();
  // Cross-tenant creation: only all-tenant roles may target another company by orgId.
  const requestedOrg = String((req.body as any)?.orgId || (req.body as any)?.tenantId || '').trim();
  let t = tenantOf(req);
  if (requestedOrg && (PLATFORM_ROLES.includes(ctx.role) || requestedOrg === t)) {
    if (db.organizations.some((o: any) => o.id === requestedOrg) || db.agencyProfiles.some((a: any) => a.tenantId === requestedOrg)) {
      t = requestedOrg;
    }
  }
  const rec = { id: uid('REQ'), orgId: t, hiringManager: ctx.email, ...parsed.data, createdAt: nowIso(), createdBy: ctx.email };
  // Keep orgId authoritative (don't let the body override the resolved tenant).
  rec.orgId = t;
  loadDb().requisitions.unshift(rec);
  audit(ctx.email, `REQUISITION_CREATED:${rec.id}`, t, 'requisition', rec.id, req.ip); persist();
  // Notify the target company when a platform actor creates it on their behalf.
  if (t !== ctx.tenantId && !['employer','company_admin','hiring_manager'].includes(ctx.role)) {
    notify(loadDb(), `company:${t}`, 'requisition', `A new requirement "${rec.title}" was created for your company by ${ctx.email}.`, t);
    persist();
  }
  res.status(201).json({ success: true, data: rec });
});
recruitmentRouter.put('/requisitions/:id', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const r: any = db.requisitions.find((x: any) => x.id === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && r.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  if (!['Draft','Pending Approval'].includes(r.status) && !['superadmin','platform_owner'].includes(ctx.role)) return res.status(422).json({ success: false, message: `Only Draft/Pending Approval can be edited (current: ${r.status}).` });
  const b: any = req.body || {};
  for (const k of ['title','department','category','location','branch','openings','employmentType','priority','description','responsibilities','requiredSkills','preferredSkills','qualifications','benefits','experienceMin','experienceMax','budgetMin','budgetMax','currency','payPeriod','deadline','hiringManager','recruiter']) {
    if (b[k] !== undefined) r[k] = b[k];
  }
  if (b.supportingRecruiters !== undefined && Array.isArray(b.supportingRecruiters)) {
    r.supportingRecruiters = b.supportingRecruiters.map((x: unknown) => String(x)).filter(Boolean).slice(0, 10);
  }
  r.updatedAt = nowIso();
  audit(ctx.email, `REQUISITION_EDITED:${r.id}`, r.orgId, 'requisition', r.id, req.ip); persist();
  res.json({ success: true, data: r });
});
// Assign lead + supporting recruiters (§10.1) — no status gate (assignment is not an edit).
// Records owner, date and reassignment history; candidate ownership elsewhere stays non-blocking.
recruitmentRouter.post('/requisitions/:id/assign', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const r: any = db.requisitions.find((x: any) => x.id === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && r.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const b: any = req.body || {};
  const to = b.recruiter !== undefined ? String(b.recruiter) : r.recruiter;
  const supporting = Array.isArray(b.supportingRecruiters)
    ? b.supportingRecruiters.map((x: unknown) => String(x)).filter(Boolean).slice(0, 10)
    : r.supportingRecruiters || [];
  const from = r.recruiter || null;
  r.recruiter = to; r.supportingRecruiters = supporting;
  r.assignedAt = nowIso();
  if (from !== to || JSON.stringify(r.supportingRecruiters) !== JSON.stringify(supporting)) {
    r.assignmentHistory = [...(r.assignmentHistory || []), { from, to, supporting, by: ctx.email, at: nowIso() }];
  }
  r.updatedAt = nowIso();
  audit(ctx.email, `REQUISITION_ASSIGNED:${r.id} ${from || '-'}->${to || '-'}`, r.orgId, 'requisition', r.id, req.ip); persist();
  res.json({ success: true, data: r });
});
recruitmentRouter.delete('/requisitions/:id', requireAuth(['employer','superadmin','platform_owner','company_admin','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const i = db.requisitions.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const r: any = db.requisitions[i];
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && r.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Requisition not found.' });
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
  if (!PLATFORM_ROLES.includes(ctx.role) && r.orgId !== tenantOf(req)) {
    if (!(ctx.role === 'internal_recruiter' && reqAssignedTo(r, emailOf(ctx)))) {
      return res.status(404).json({ success: false, message: 'Requisition not found.' });
    }
  }
  const next = String(req.body.status);
  if (!(REQ_FLOW[r.status] || []).includes(next)) return res.status(422).json({ success: false, code: 'INVALID_TRANSITION', message: `Invalid transition ${r.status} → ${next}. Allowed: ${(REQ_FLOW[r.status] || []).join(', ') || 'none'}` });
  if (next === 'Filled') {
    // Phase 2: Filled = confirmed hires assigned to openings, not merely "selected".
    const rollup = requirementRollup(db, r);
    if (rollup.openingsFilled < Number(r.openings || 0)) {
      return res.status(422).json({ success: false, code: 'OPENINGS_NOT_FILLED', message: `Cannot mark Filled: ${rollup.openingsFilled}/${r.openings} openings have confirmed joined placements. Record joining first.` });
    }
  }
  const from = r.status;
  r.status = next; r.updatedAt = nowIso();
  if (req.body.reason) r.statusReason = String(req.body.reason).slice(0, 1000);
  r.history = [...(r.history || []), { from, to: next, by: ctx.email, reason: req.body.reason || '', at: nowIso() }];
  if (r.history.length > 200) r.history = r.history.slice(-200);
  audit(ctx.email, `REQUISITION_STATUS:${r.id} ${from}->${next}`, r.orgId, 'requisition', r.id, req.ip, { before: from, after: next, reason: req.body.reason || '' }); persist();
  res.json({ success: true, data: r });
});

// ---- Jobs ----
// Ownership is evaluated against the tenant this request is acting on, so an
// employee who switched company sees that company's drafts — and nobody else's.
const isOwner = (req: Request, ctx: any, j: any) => PLATFORM_ROLES.includes(ctx.role) || j.orgId === tenantOf(req);
recruitmentRouter.get('/jobs', requireAuth(), (req, res) => {
  const { page, pageSize, q, status } = paginate.parse(req.query);
  const db = loadDb();
  const ctx = ctxOf(req);
  let rows = db.jobs as any[];
  const mine = String(req.query.mine || '');
  if (mine && ctx.role === 'internal_recruiter') {
    // Phase 5: My Jobs — explicitly assigned via the parent requirement.
    const me = emailOf(ctx);
    rows = rows.filter((j) => jobAssignedTo(db, j, me));
  } else if (mine) { const t = tenantOf(req); rows = rows.filter((j) => j.orgId === t); }
  else if (ctx.role === 'internal_recruiter') {
    // Assigned mandates first-class; all published stay discoverable for sourcing.
    const me = emailOf(ctx);
    rows = rows
      .filter((j) => jobAssignedTo(db, j, me) || (j.status === 'Published' && j.visibility !== 'private'))
      .map((j) => ({ ...j, assignedToMe: jobAssignedTo(db, j, me) }));
  } else if (['employer', 'company_admin', 'hiring_manager', 'company_recruiter'].includes(ctx.role)) {
    // Company roles see their own jobs in every state (Draft … Archived) so they can
    // manage a posting end-to-end — including ones created for them by the platform.
    const t = tenantOf(req);
    rows = rows.filter((j) => j.orgId === t);
  } else if (TENANT_STAFF_ROLES.includes(ctx.role)) {
    // Internal ops: full visibility for the company being acted on, drafts included.
    const t = tenantOf(req);
    rows = rows.filter((j) => j.orgId === t);
  } else if (!PLATFORM_ROLES.includes(ctx.role)) {
    // Non-platform roles discover only published, non-private jobs (drafts stay hidden).
    rows = rows.filter((j) => j.status === 'Published' && j.visibility !== 'private');
  } else if (req.query.orgId) rows = rows.filter((j) => j.orgId === req.query.orgId);
  if (req.query.requisitionId) rows = rows.filter((j) => j.requisitionId === req.query.requisitionId);
  if (status) rows = rows.filter((j) => j.status === status);
  // §7.4 candidate filters (all optional, combined with AND).
  const has = (v: unknown) => v !== undefined && String(v).trim() !== '';
  if (has(req.query.skills)) {
    const want = String(req.query.skills).toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
    rows = rows.filter((j) => { const hay = `${j.requiredSkills || ''} ${j.preferredSkills || ''}`.toLowerCase(); return want.every((w) => hay.includes(w)); });
  }
  if (has(req.query.company)) { const s = String(req.query.company).toLowerCase(); rows = rows.filter((j) => `${(j as any).companyName || ''}`.toLowerCase().includes(s)); }
  if (has(req.query.industry)) { const s = String(req.query.industry).toLowerCase(); rows = rows.filter((j) => `${(j as any).industry || ''}`.toLowerCase().includes(s)); }
  if (has(req.query.location)) { const s = String(req.query.location).toLowerCase(); rows = rows.filter((j) => `${j.location || ''}`.toLowerCase().includes(s)); }
  if (has(req.query.experience)) { const n = Number(req.query.experience); if (Number.isFinite(n)) rows = rows.filter((j) => Number((j as any).experienceMin ?? (j as any).experienceYears ?? 0) <= n && n <= Number((j as any).experienceMax ?? (j as any).experienceYears ?? 99)); }
  if (has(req.query.employmentType)) rows = rows.filter((j) => String(j.employmentType || '').toLowerCase() === String(req.query.employmentType).toLowerCase());
  if (has(req.query.workArrangement)) rows = rows.filter((j) => String((j as any).workArrangement || '').toLowerCase() === String(req.query.workArrangement).toLowerCase());
  if (has(req.query.salaryMin) || has(req.query.salaryMax)) {
    const lo = has(req.query.salaryMin) ? Number(req.query.salaryMin) : -Infinity;
    const hi = has(req.query.salaryMax) ? Number(req.query.salaryMax) : Infinity;
    rows = rows.filter((j) => { const a = Number(j.salaryMin ?? 0); const b = Number((j as any).salaryMax ?? j.salaryMin ?? 0); return a <= hi && b >= lo; });
  }
  if (has(req.query.postedAfter)) { const t = new Date(String(req.query.postedAfter)).getTime(); if (Number.isFinite(t)) rows = rows.filter((j) => new Date((j as any).createdAt || 0).getTime() >= t); }
  if (has(req.query.qualifications)) { const s = String(req.query.qualifications).toLowerCase(); rows = rows.filter((j) => `${(j as any).qualifications || ''}`.toLowerCase().includes(s)); }
  // §7.4: non-platform roles never see expired jobs in search (no-expiry jobs still pass).
  if (!PLATFORM_ROLES.includes(ctx.role)) {
    const now = new Date();
    rows = rows.filter((j) => !(j as any).expiryDate || new Date((j as any).expiryDate) > now);
  }
  if (q) { const s = String(q).toLowerCase(); rows = rows.filter((j) => `${j.title} ${j.description} ${j.location}`.toLowerCase().includes(s)); }
  // Counts over the complete set; non-owners receive the public allowlist only.
  const enriched = rows.map((j) => {
    const counts = jobCounts(db, j);
    const full = { ...j, counts, acceptingApplications: counts.acceptingApplications };
    return isOwner(req, ctx, j) ? full : { ...publicJob(j), counts, acceptingApplications: counts.acceptingApplications };
  });
  res.json({ success: true, ...paged(enriched, page, pageSize) });
});
// Public discovery — only eligible jobs, public allowlist only (§6.7 privacy)

function enrichJobRecord(db: any, j: any) {
  if (!j) return j;
  const companyFallback = j.companyName || (j.orgId ? (db.companyProfiles?.find((cp: any) => cp.orgId === j.orgId)?.companyName || db.organizations?.find((o: any) => o.id === j.orgId)?.displayName) : null) || 'Fintech ScaleOps';
  const title = j.title || 'Senior Software Engineer';
  const description = j.description || `${companyFallback} is seeking a high-performing ${title} to join our core engineering operations. In this role, you will design, build, and optimize enterprise-grade software solutions, architect robust distributed cloud services, and collaborate across multidisciplinary product squads to deliver seamless digital experiences.`;
  const responsibilities = j.responsibilities || '• Design, develop, and maintain high-availability services and scalable cloud architectures.\n• Collaborate with cross-functional product, design, and engineering teams to define and ship high-impact features.\n• Write clean, testable, and maintainable code adhering to modern engineering best practices and design patterns.\n• Optimize application performance, throughput, and database latency across production workloads.\n• Participate in code reviews, architectural discussions, and technical mentoring.';
  const requiredSkills = j.requiredSkills || 'TypeScript, React, Node.js, PostgreSQL, Docker, Cloud Architecture (Azure/AWS), REST APIs';
  const preferredSkills = j.preferredSkills || 'Kubernetes, GraphQL, Redis, CI/CD Pipelines, Microservices Architecture, Distributed Systems';
  const qualifications = j.qualifications || '• Bachelor’s or Master’s degree in Computer Science, Software Engineering, or related technical discipline.\n• 4+ years of professional full-lifecycle software development experience.\n• Strong problem-solving abilities, communication skills, and collaborative team mindset.';
  const selectionProcess = j.selectionProcess || '1. Initial Recruiter Screening & Profile Alignment (30 mins)\n2. Technical Deep-Dive & Live Problem Solving (60 mins)\n3. System Design & Architecture Discussion (60 mins)\n4. Leadership & Culture Conversation (45 mins)';
  
  return {
    ...j,
    title,
    companyName: companyFallback,
    location: j.location || 'Bengaluru, India (Hybrid)',
    employmentType: j.employmentType || 'Full-time',
    workArrangement: j.workArrangement || 'hybrid',
    salaryMin: j.salaryMin || 2800000,
    salaryMax: j.salaryMax || 4200000,
    currency: j.currency || 'INR',
    experienceMin: j.experienceMin ?? 4,
    experienceMax: j.experienceMax ?? 8,
    department: j.department || 'Engineering & Platform Infrastructure',
    industry: j.industry || 'Fintech & Enterprise Software',
    description,
    responsibilities,
    requiredSkills,
    preferredSkills,
    qualifications,
    selectionProcess,
  };
}

recruitmentRouter.get('/jobs-public', (req, res) => {
  const now = new Date();
  const db = loadDb();
  const rows = (db.jobs as any[]).filter((j) => j.status === 'Published' && j.visibility !== 'private' && (!j.expiryDate || new Date(j.expiryDate) > now));
  const { page, pageSize } = paginate.parse(req.query);
  const enriched = rows.map((j) => ({ ...publicJob(j), counts: jobCounts(db, j), acceptingApplications: true }));
  res.json({ success: true, ...paged(enriched, page, pageSize) });
});
// Phase 7: public job detail — eligible published/non-expired only, allowlisted, non-disclosing.
recruitmentRouter.get('/jobs-public/:id', (req, res) => {
  const now = new Date();
  const db = loadDb();
  const j: any = (db.jobs as any[]).find((x: any) => x.id === req.params.id);
  if (!j || j.status !== 'Published' || j.visibility === 'private' || (j.expiryDate && new Date(j.expiryDate) <= now)) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  const companyFallback = j.companyName || (j.orgId ? (db.companyProfiles.find((cp: any) => cp.orgId === j.orgId)?.companyName || db.organizations.find((o: any) => o.id === j.orgId)?.displayName) : null) || 'Fintech ScaleOps';
  const enrichedJob = { ...j, companyName: companyFallback };
  res.json({ success: true, data: { ...publicJob(enrichedJob), counts: jobCounts(db, enrichedJob), acceptingApplications: true } });
});
recruitmentRouter.post('/jobs', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const ctx = ctxOf(req);
  const db0 = loadDb();
  const requestedOrg = String((req.body as any)?.orgId || (req.body as any)?.tenantId || '').trim();
  let t = tenantOf(req);
  if (requestedOrg && (PLATFORM_ROLES.includes(ctx.role) || requestedOrg === t)) {
    if (db0.organizations.some((o: any) => o.id === requestedOrg) || db0.agencyProfiles.some((a: any) => a.tenantId === requestedOrg)) {
      t = requestedOrg;
    }
  }
  try { evaluate(t, 'jobs.create'); } catch (e: any) { return res.status(e.status || 403).json({ success: false, message: e.message, code: e.code }); }
  // Phase D: the active-job cap counts live postings, not ledger rows.
  const active = loadDb().jobs.filter((j: any) => j.orgId === t && ['Published','Approved'].includes(j.status)).length;
  const grant = activeGrant(t, 'jobs.active_limit');
  if (typeof grant === 'number' && active >= grant) {
    return res.status(429).json({ success: false, code: 'QUOTA_EXHAUSTED', message: `'jobs.active_limit': ${active}/${grant} live postings used. Close or archive one first.` });
  }
  const job = { id: uid('JOB'), orgId: t, applicantsCount: 0, ...parsed.data, createdAt: nowIso(), createdBy: ctx.email };
  job.orgId = t;
  loadDb().jobs.unshift(job);
  consumeQuota(t, ctx.email, 'jobs.create', 0, job.id, `job-create:${job.id}`);
  audit(ctx.email, `JOB_CREATED:${job.id}`, t, 'job', job.id, req.ip); persist();
  if (t !== ctx.tenantId && !['employer','company_admin','hiring_manager'].includes(ctx.role)) {
    notify(loadDb(), `company:${t}`, 'job', `A new job posting "${job.title}" was created for your company by ${ctx.email}.`, t);
    persist();
  }
  emit('job.published', job, t, ctx.email);
  res.status(201).json({ success: true, data: job });
});
// Explicit request-changes: Pending Approval → Draft with a mandatory note,
// notifying the hiring manager (distinct from a silent status move).
recruitmentRouter.post('/requisitions/:id/request-changes', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const r: any = db.requisitions.find((x: any) => x.id === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && r.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Requisition not found.' });
  if (r.status !== 'Pending Approval') return res.status(422).json({ success: false, message: `Request-changes applies to requisitions in Pending Approval (current: ${r.status}).` });
  const note = String(req.body?.note || '').trim();
  if (!note) return res.status(400).json({ success: false, message: 'A change note is required and is sent to the hiring manager.' });
  r.status = 'Draft'; r.updatedAt = nowIso();
  r.changeRequests = [...(r.changeRequests || []), { note: note.slice(0, 2000), by: ctx.email, at: nowIso() }];
  r.changeNote = note.slice(0, 2000);
  if (r.hiringManager) notify(db, r.hiringManager, 'requisition', `Changes requested on ${r.id} (${r.title}): ${note.slice(0, 140)}`, r.orgId);
  if (r.recruiter) notify(db, r.recruiter, 'requisition', `Changes requested on ${r.id} (${r.title}): ${note.slice(0, 140)}`, r.orgId);
  audit(ctx.email, `REQUISITION_CHANGES_REQUESTED:${r.id}`, r.orgId, 'requisition', r.id, req.ip); persist();
  res.json({ success: true, data: r });
});
recruitmentRouter.put('/jobs/:id', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const j: any = db.jobs.find((x: any) => x.id === req.params.id);
  if (!j) return res.status(404).json({ success: false, message: 'Job not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && j.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Job not found.' });
  const b: any = req.body || {};
  // Phase B: assignments must name real agencies/vendors — typos previously orphaned mandates.
  // Validated BEFORE the live edit lock so invalid input always fails fast (UNKNOWN_AGENCY).
  for (const k of ['assignedAgencies','assignedVendors']) {
    if (b[k] !== undefined) {
      const names = (Array.isArray(b[k]) ? b[k] : String(b[k]).split(',')).map((x: unknown) => String(x).trim()).filter(Boolean);
      const known = new Set([
        ...(db.agencyProfiles as any[]).flatMap((a: any) => [a.tenantId, a.displayName, a.legalName, a.contactEmail].filter(Boolean).map((s: string) => String(s).toLowerCase())),
        ...(db.users as any[]).filter((u: any) => ['agency_admin','agency_recruiter','recruiter','vendor'].includes(u.role)).map((u: any) => String(u.email).toLowerCase()),
      ]);
      const bad = names.filter((n: string) => {
        const nl = n.toLowerCase();
        return ![...known].some((k: string) => k === nl || (k.length >= 4 && nl.length >= 4 && (k.includes(nl) || nl.includes(k))));
      });
      if (bad.length > 0) return res.status(422).json({ success: false, code: 'UNKNOWN_AGENCY', message: `Unknown agency/vendor: ${bad.join(', ')}. Use a verified agency name, tenant or email.` });
      b[k] = names;
    }
  }
  // Live edit lock: once Published, field edits are frozen for company roles —
  // pause (stops pipeline) or close the posting instead. Platform may correct with audit.
  // Visibility has its own explicit error code; a pure expiryDate change is an
  // operational edit (shorten/extend a live posting) and stays allowed.
  if (j.status === 'Published' && !['superadmin','platform_owner'].includes(ctx.role)) {
    if (b.visibility !== undefined && b.visibility !== j.visibility) {
      return res.status(422).json({ success: false, code: 'VISIBILITY_LOCKED', message: `Visibility cannot be edited while ${j.status}. Pause or close the posting instead.` });
    }
    const keys = Object.keys(b).filter((k) => b[k] !== undefined);
    const onlyExpiry = keys.length > 0 && keys.every((k) => k === 'expiryDate');
    if (!onlyExpiry) {
      return res.status(422).json({ success: false, code: 'EDIT_LOCKED', message: `Job is live (Published) — editing is locked. Pause it to stop the pipeline, or close it.` });
    }
  }
  for (const k of ['title','description','location','employmentType','workArrangement','salaryMin','salaryMax','visibility','expiryDate','requiredSkills','preferredSkills','qualifications','assignedAgencies','assignedVendors']) {
    if (b[k] !== undefined) j[k] = b[k];
  }
  j.updatedAt = nowIso();
  audit(ctx.email, `JOB_EDITED:${j.id}`, j.orgId, 'job', j.id, req.ip); persist();
  res.json({ success: true, data: j });
});
recruitmentRouter.patch('/jobs/:id/status', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const j: any = db.jobs.find((x: any) => x.id === req.params.id);
  if (!j) return res.status(404).json({ success: false, message: 'Job not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && j.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Job not found.' });
  const next = String(req.body.status);
  const reason = req.body.reason;
  try {
    const unpublish = j.status === 'Published' && next === 'Approved';
    const reopen = j.status === 'Closed' && (next === 'Published' || next === 'Paused');
    if (unpublish || reopen) {
      // Privileged edges: unpublish + authorized reopen. Never bypass guards.
      checkTransition({ permissions: ctx.permissions, from: j.status, to: next, flow: EXTENDED_JOB_FLOW, permission: 'approve', reason, needReason: true });
      if (reopen) {
        const exp = req.body.expiryDate ?? j.expiryDate;
        if (!exp || !(new Date(exp) > new Date())) {
          return res.status(422).json({ success: false, message: 'Cannot reopen: set a future expiryDate. Reopening must never bypass the expiry guard.', code: 'EXPIRY_REQUIRED' });
        }
        if (req.body.expiryDate) j.expiryDate = req.body.expiryDate;
      }
    } else {
      checkTransition({ permissions: ctx.permissions, from: j.status, to: next, flow: JOB_FLOW });
    }
    if (next === 'Published') {
      // Publish guards: approved parent, real openings, future expiry.
      // Phase 2: requisitionId is mandatory — a Job must link to a Requirement.
      const reqId = j.requisitionId || req.body.requisitionId;
      if (!reqId) return res.status(422).json({ success: false, message: `Cannot publish: job ${j.id} has no linked requirement (requisitionId). Link it first.`, code: 'REQUIREMENT_MISSING' });
      if (req.body.requisitionId && !j.requisitionId) j.requisitionId = String(req.body.requisitionId);
      const r: any = db.requisitions.find((x: any) => x.id === j.requisitionId);
      if (!r) return res.status(422).json({ success: false, message: `Cannot publish: linked requirement ${j.requisitionId} was not found.`, code: 'REQUIREMENT_MISSING' });
      // A reopen from Closed is an authorized restore: the parent was auto-closed
      // when the last live job closed (see sync below), so allow it and restore.
      if (!['Approved','Sourcing'].includes(r.status) && !(reopen && r.status === 'Closed')) return res.status(422).json({ success: false, message: `Cannot publish: parent requirement ${r.id} is ${r.status}. Approve it first.`, code: 'REQUIREMENT_NOT_APPROVED' });
      if (!(Number(r.openings) > 0)) return res.status(422).json({ success: false, message: `Cannot publish: parent requirement ${r.id} has no openings.`, code: 'NO_OPENINGS' });
      const exp = req.body.expiryDate ?? j.expiryDate;
      if (exp && !(new Date(exp) > new Date())) return res.status(422).json({ success: false, message: 'Cannot publish: expiry date is in the past. Set a future date.', code: 'EXPIRY_PAST' });
      if (req.body.expiryDate) j.expiryDate = req.body.expiryDate;
    }
  } catch (e: any) {
    return res.status(e.status || 422).json({ success: false, message: e.message, code: e.code });
  }
  // Pause / Close change the pipeline for everyone — a reason is mandatory and audited.
  if ((next === 'Paused' || next === 'Closed') && !String(reason || '').trim()) {
    return res.status(400).json({ success: false, code: 'REASON_REQUIRED', message: `A reason is required to ${next.toLowerCase()} this job and is recorded in the audit log.` });
  }
  const from = j.status;
  j.status = next; j.updatedAt = nowIso();
  j.acceptingApplications = (next === 'Published');
  if (reason) j.statusReason = String(reason).slice(0, 1000);
  j.history = [...(j.history || []), { from, to: next, by: ctx.email, reason: reason ? String(reason).slice(0, 1000) : '', at: nowIso() }];
  if (j.history.length > 200) j.history = j.history.slice(-200);
  audit(ctx.email, `JOB_STATUS:${j.id} ${from}->${next}`, j.orgId, 'job', j.id, req.ip, { before: from, after: next, reason: reason ? String(reason).slice(0, 1000) : '' });
  const note = (recipient: string, body: string) => notify(db, recipient, 'job', body, j.orgId);
  note(`company:${j.orgId}`, `Job ${j.id} (${j.title}) ${from} → ${next}${reason ? ` — ${String(reason).slice(0, 200)}` : ''}.`);
  note('superadmin', `Job ${j.id} ${from} → ${next} by ${ctx.email}.`);
  // Close cascade: every open application ends as Job Closed (candidates notified).
  let closedApps = 0;
  if (next === 'Closed') {
    for (const a of (db.applications as any[]).filter((x: any) => x.jobId === j.id && !TERMINAL_STAGES.includes(x.stage))) {
      const prev = a.stage;
      a.stage = 'Job Closed'; a.updatedAt = nowIso(); a.stageReason = String(reason || 'Requirement closed');
      pushHistory(db.stageHistory, { id: uid('STG'), applicationId: a.id, from: prev, to: 'Job Closed', actor: ctx.email, reason: String(reason || 'Requirement closed'), createdAt: nowIso() });
      if (a.candidateEmail) notify(db, a.candidateEmail, 'application', `Your application for ${j.title} is closed: ${String(reason || 'requirement closed').slice(0, 200)}.`, j.orgId);
      closedApps += 1;
    }
    if (closedApps > 0) audit(ctx.email, `JOB_CLOSE_CASCADE:${j.id}:${closedApps}`, j.orgId, 'application', j.id, req.ip);
  }
  // Requisition sync: publishing sources the parent; closing the last live job closes it.
  if (j.requisitionId) {
    const parent: any = db.requisitions.find((x: any) => x.id === j.requisitionId);
    if (parent) {
      if (next === 'Published' && parent.status === 'Approved') { parent.status = 'Sourcing'; parent.updatedAt = nowIso(); }
      if (next === 'Closed' || next === 'Archived') {
        const siblings = (db.jobs as any[]).filter((x: any) => x.requisitionId === parent.id && x.id !== j.id && ['Published', 'Paused', 'Approved'].includes(x.status));
        if (siblings.length === 0 && parent.status !== 'Closed') { parent.status = 'Closed'; parent.updatedAt = nowIso(); parent.closeReason = `Last live job ${j.id} ${next.toLowerCase()}`; }
      }
      if (from === 'Closed' && next === 'Published' && parent.status === 'Closed') { parent.status = 'Sourcing'; parent.updatedAt = nowIso(); }
    }
  }
  persist();
  if (next === 'Published') emit('job.published', j, j.orgId, ctx.email);
  res.json({ success: true, data: { ...j, closedApplications: next === 'Closed' ? closedApps : undefined } });
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
  // Keyword search: every whitespace-separated token must match somewhere in
  // name / title / location / skills — only genuinely matching candidates return.
  if (q) {
    const toks = String(q).toLowerCase().split(/\s+/).map((t) => t.trim()).filter(Boolean);
    rows = rows.filter((c) => {
      const hay = `${c.name || ''} ${c.roleTitle || ''} ${c.location || ''} ${c.skills || ''} ${(c as any).primaryTechStack || ''}`.toLowerCase();
      return toks.every((t) => hay.includes(t));
    });
  }
  // §8.5 structured filters (all optional, AND-combined).
  const has = (v: unknown) => v !== undefined && String(v).trim() !== '';
  const anyOf = (v: unknown): string[] => String(v).toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
  // Multi-select sends comma-joined values — a candidate matches ANY of them.
  if (has(req.query.designation)) { const want = anyOf(req.query.designation); rows = rows.filter((c) => { const h = `${c.roleTitle || ''}`.toLowerCase(); return want.some((w) => h.includes(w)); }); }
  if (has(req.query.skills)) {
    const want = String(req.query.skills).toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
    rows = rows.filter((c) => { const hay = `${c.skills || ''} ${(c as any).primaryTechStack || ''}`.toLowerCase(); return want.every((w) => hay.includes(w)); });
  }
  if (has(req.query.expMin)) { const n = Number(req.query.expMin); if (Number.isFinite(n)) rows = rows.filter((c) => Number(c.experienceYears ?? 0) >= n); }
  if (has(req.query.expMax)) { const n = Number(req.query.expMax); if (Number.isFinite(n)) rows = rows.filter((c) => Number(c.experienceYears ?? 99) <= n); }
  if (has(req.query.location)) { const want = anyOf(req.query.location); rows = rows.filter((c) => { const h = `${c.location || ''} ${c.country || ''}`.toLowerCase(); return want.some((w) => h.includes(w)); }); }
  if (has(req.query.availability)) { const s = String(req.query.availability).toLowerCase(); rows = rows.filter((c) => `${c.availability || ''} ${c.noticePeriod || ''}`.toLowerCase().includes(s)); }
  if (has(req.query.resume)) rows = rows.filter((c) => !!(c as any).resumeRef === (String(req.query.resume) !== 'no'));
  const canSee = ctx.permissions.includes('view_sensitive_fields');
  rows = rows.map((c) => {
    if (tier === 'preview') { const { phone, currentCtc, expectedCtc, noticePeriod, email, skills, ...rest } = c; return { ...rest, email: undefined, contactLocked: true }; }
    if (tier === 'full') return maskCandidate(c, canSee);
    // P1-5: contact tier requires explicit sensitive grant — quota alone is not enough.
    if (!canSee) return maskCandidate(c, false);
    consumeQuota(t, ctx.email, 'candidates.contact_unlock', 1, c.id, `unlock:${t}:${c.id}:${ctx.email}`);
    return c;
  });
  res.json({ success: true, tier, ...paged(rows, page, pageSize) });
});

// ---- Applications (ATS §8.8) ----
recruitmentRouter.get('/applications', requireAuth(), (req, res) => {
  const ctx = ctxOf(req);
  const db = loadDb();
  syncCandidateLeads(db);
  let rows = db.applications as any[];
  if (ctx.role === 'candidate') rows = rows.filter((a) => String(a.candidateEmail).toLowerCase() === ctx.email.toLowerCase());
  else if (ctx.role === 'internal_recruiter') rows = rows.filter((a) => appAssignedTo(db, a, emailOf(ctx)));
  else if (AGENCY_ROLES.includes(ctx.role)) { const ids = agencyLinkedAppIds(db, ctx); rows = rows.filter((a) => ids.has(a.id)); }
  else if (!PLATFORM_ROLES.includes(ctx.role)) rows = rows.filter((a) => a.orgId === tenantOf(req));
  const { page, pageSize, status, q } = paginate.parse(req.query);
  if (status) rows = rows.filter((a) => a.stage === status);
  if (q) { const s = String(q).toLowerCase(); rows = rows.filter((a) => `${a.id} ${a.jobTitle || ''} ${a.candidateEmail || ''}`.toLowerCase().includes(s)); }
  if (req.query.jobId) {
    const qJob = String(req.query.jobId).toLowerCase();
    const matchedJob = (db.jobs as any[] || []).find((j: any) => String(j.id).toLowerCase() === qJob || String(j.slug || '').toLowerCase() === qJob);
    const validJobIds = new Set<string>([qJob]);
    if (matchedJob) {
      if (matchedJob.id) validJobIds.add(String(matchedJob.id).toLowerCase());
      if (matchedJob.slug) validJobIds.add(String(matchedJob.slug).toLowerCase());
    }
    rows = rows.filter((a) => validJobIds.has(String(a.jobId || '').toLowerCase()));
  }
  if (req.query.requisitionId) rows = rows.filter((a) => a.requisitionId === req.query.requisitionId);
  const enrichedApps = rows.map((a) => {
    const companyName = a.companyName || (a.orgId ? (db.companyProfiles?.find((cp: any) => cp.orgId === a.orgId)?.companyName || db.organizations?.find((o: any) => o.id === a.orgId)?.displayName) : null) || 'Fintech ScaleOps';
    const interviews = (db.interviews as any[] || []).filter((i: any) => i.applicationId === a.id);
    const nextInterview = interviews.filter((i: any) => ['Scheduled','Rescheduled'].includes(i.status)).sort((x: any, y: any) => String(x.scheduledAt || '').localeCompare(String(y.scheduledAt || '')))[0] || null;
    const jobRaw = (db.jobs as any[] || []).find((j: any) => j.id === a.jobId || j.slug === a.jobId);
    const hasResume = !!(a.resumeRef || a.leadId || (db.leads as any[] || []).some((l: any) => l.resumeRef && String(l.email || '').toLowerCase() === String(a.candidateEmail || '').toLowerCase()));
    return {
      ...a,
      companyName,
      nextInterview,
      job: jobRaw ? enrichJobRecord(db, jobRaw) : null,
      hasResume,
      resumeUrl: hasResume ? `/api/v1/applications/${a.id}/resume` : null,
    };
  });
  res.json({ success: true, ...paged(enrichedApps, page, pageSize) });
});
recruitmentRouter.post('/applications', requireAuth(['candidate','superadmin','agency_recruiter','agency_admin','recruiter','vendor','internal_recruiter','employee']), (req: Request, res: Response) => {
  const { jobId, candidateEmail } = req.body || {};
  if (!jobId || !candidateEmail) return res.status(400).json({ success: false, message: 'jobId + candidateEmail required.' });
  const db = loadDb();
  const job: any = db.jobs.find((j: any) => j.id === jobId);
  if (!job || job.status !== 'Published' || (job.expiryDate && new Date(job.expiryDate) <= new Date())) return res.status(422).json({ success: false, message: 'Job is not accepting applications.' });
  const key = `${jobId}::${String(candidateEmail).toLowerCase()}`;
  if (db.applications.find((a: any) => a.key === key)) return res.status(409).json({ success: false, code: 'APPLICATION_ALREADY_EXISTS', message: 'Already applied to this job.' });
  const ctx = ctxOf(req);
  if (ctx.role === 'candidate' && String(candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(403).json({ success: false, message: 'Apply as yourself only.' });
  // Phase 5: platform recruiters attach only to assigned mandates.
  if (ctx.role === 'internal_recruiter' && !jobAssignedTo(db, job, emailOf(ctx))) {
    return res.status(403).json({ success: false, code: 'JOB_NOT_ASSIGNED', message: 'Attach candidates only to requirements assigned to you.' });
  }
  const app = { id: uid('APP'), key, jobId, jobTitle: job.title, orgId: job.orgId, requisitionId: job.requisitionId, candidateEmail, stage: 'Applied', source: ctx.role, createdAt: nowIso(), updatedAt: nowIso() };
  db.applications.unshift(app);
  pushHistory(db.stageHistory, { id: uid('STG'), applicationId: app.id, from: '-', to: 'Applied', actor: ctx.email, createdAt: nowIso() });
  job.applicantsCount = (job.applicantsCount || 0) + 1;
  audit(ctx.email, `APPLICATION_SUBMITTED:${app.id}`, job.orgId, 'application', app.id, req.ip); persist();
  emit('application.stage', { ...app }, job.orgId, ctx.email);
  const { key: _k, ...pub } = app;
  res.status(201).json({ success: true, data: pub });
});
// Phase 3: explicit application flow — no arbitrary writes, terminal states locked.
// Hired is placement-only (POST /placements mints it). Rejected/Withdrawn/On Hold/Job Closed need a reason.
const APPLICATION_FLOW: Record<string, string[]> = {
  New: ['Applied', 'Under Review', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Offer', 'Selected', 'Rejected', 'Withdrawn', 'On Hold'],
  Applied: ['Under Review', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Offer', 'Selected', 'Rejected', 'Withdrawn', 'On Hold'],
  'Under Review': ['Screening', 'Shortlisted', 'Interview Scheduled', 'Offer', 'Selected', 'Rejected', 'Withdrawn', 'On Hold'],
  Screening: ['Shortlisted', 'Interview Scheduled', 'Offer', 'Selected', 'Rejected', 'Withdrawn', 'On Hold'],
  Shortlisted: ['Interview Scheduled', 'Interview Completed', 'Offer', 'Selected', 'Rejected', 'Withdrawn', 'On Hold'],
  'Interview Scheduled': ['Interview Completed', 'Rejected', 'Withdrawn', 'On Hold'],
  'Interview Completed': ['Selected', 'Offer', 'Shortlisted', 'Rejected', 'Withdrawn', 'On Hold'],
  Selected: ['Offer', 'Rejected', 'Withdrawn', 'On Hold'],
  Offer: ['Selected', 'Rejected', 'Withdrawn', 'On Hold'],
  'On Hold': ['Applied', 'Under Review', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Withdrawn'],
  Hired: [],
  Withdrawn: [],
  Rejected: [],
  'Job Closed': [],
};
const TERMINAL_STAGES = ['Hired', 'Withdrawn', 'Rejected', 'Job Closed'];
const REASON_REQUIRED_STAGES = ['Rejected', 'Withdrawn', 'On Hold', 'Job Closed'];
recruitmentRouter.patch('/applications/:id/stage', requireAuth(['employer','superadmin','company_admin','hiring_manager','company_recruiter','employee','operations_admin','internal_recruiter','recruiter','agency_recruiter','agency_admin','vendor']), (req: Request, res: Response) => {
  const db = loadDb(); const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  const ctx = ctxOf(req);
  if (!canSeeApplication(db, ctx, a, tenantOf(req))) return res.status(404).json({ success: false, message: 'Application not found.' });
  const parsed = applicationStage.safeParse(req.body.stage);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid stage.' });
  const from = a.stage; const to = parsed.data;
  if (to === 'Hired') return res.status(422).json({ success: false, code: 'HIRE_VIA_PLACEMENT', message: 'Hired comes only from Record joining (POST /placements) with an accepted agreement and fee basis — it cannot be set directly.' });
  if (TERMINAL_STAGES.includes(from)) return res.status(422).json({ success: false, code: 'TERMINAL_STAGE', message: `${from} applications are terminal — reopen explicitly to continue.` });
  // Pipeline freeze: paused/closed jobs stop all movement except candidate withdrawal.
  const frozenJob = a.jobId ? db.jobs.find((x: any) => x.id === a.jobId) : null;
  if (frozenJob && ['Paused', 'Closed'].includes(frozenJob.status) && !['Withdrawn', 'Job Closed'].includes(to)) {
    return res.status(422).json({ success: false, code: 'PIPELINE_FROZEN', message: `Pipeline is frozen — job ${frozenJob.id} is ${frozenJob.status}. Resume it to continue, or withdraw.` });
  }
  if (from === to) return res.status(422).json({ success: false, code: 'INVALID_TRANSITION', message: `Already in stage ${from}.` });
  if (!(APPLICATION_FLOW[from] || []).includes(to)) return res.status(422).json({ success: false, code: 'INVALID_TRANSITION', message: `Invalid transition ${from} → ${to}. Allowed: ${(APPLICATION_FLOW[from] || []).join(', ') || 'none'}.` });
  if (REASON_REQUIRED_STAGES.includes(to) && !String(req.body.reason || '').trim()) return res.status(400).json({ success: false, code: 'REASON_REQUIRED', message: `A reason is required to move to ${to} and is recorded in the audit log.` });
  a.stage = to; a.updatedAt = nowIso();
  if (req.body.reason) a.stageReason = String(req.body.reason);
  pushHistory(db.stageHistory, { id: uid('STG'), applicationId: a.id, from, to: a.stage, actor: ctx.email, reason: req.body.reason || '', createdAt: nowIso() });
  audit(ctx.email, `APPLICATION_STAGE:${a.id} ${from}->${a.stage}`, a.orgId, 'application', a.id, req.ip, { before: from, after: a.stage, reason: req.body.reason || '' }); persist();
  emit('application.stage', { ...a }, a.orgId, ctx.email);
  res.json({ success: true, data: a });
});

// ---- Interviews + feedback ----
recruitmentRouter.get('/interviews', requireAuth(), (req, res) => {
  const db = loadDb();
  const ctx = ctxOf(req);   let rows = db.interviews as any[];
  if (ctx.role === 'candidate') {
    rows = rows.filter((i) => String(i.candidateEmail).toLowerCase() === ctx.email.toLowerCase());
    // Phase C: candidate-safe projection — logistics for them, never panel identities.
    rows = rows.map((i: any) => {
      const app = (db.applications as any[] || []).find((a: any) => a.id === i.applicationId);
      const jobRaw = (db.jobs as any[] || []).find((j: any) => j.id === (i.jobId || app?.jobId));
      const job = jobRaw ? enrichJobRecord(db, jobRaw) : null;
      const companyName = job?.companyName || (job?.orgId ? (db.companyProfiles?.find((cp: any) => cp.orgId === job.orgId)?.companyName || db.organizations?.find((o: any) => o.id === job.orgId)?.displayName) : null) || 'Fintech ScaleOps';
      return {
        id: i.id, applicationId: i.applicationId, jobId: i.jobId || app?.jobId,
        round: i.round || i.roundName || 'Technical Round', scheduledAt: i.scheduledAt, timezone: i.timezone || 'Asia/Kolkata', mode: i.mode || 'video',
        meetingLink: i.meetingLink || i.meetLink || 'https://meet.google.com/nex-atal-ent', venue: i.venue, instructions: i.instructions,
        status: i.status || 'Scheduled', confirmationStatus: i.confirmationStatus,
        candidateName: i.candidateName, jobTitle: i.jobTitle || job?.title || app?.jobTitle || 'Senior Software Engineer',
        companyName,
        job,
      };
    });
  }
  else if (ctx.role === 'internal_recruiter') {
    const me = emailOf(ctx);
    const ids = new Set((db.applications as any[]).filter((a) => appAssignedTo(db, a, me)).map((a) => a.id));
    rows = rows.filter((i) => ids.has(i.applicationId));
  }
  else if (AGENCY_ROLES.includes(ctx.role)) { const ids = agencyLinkedAppIds(db, ctx); rows = rows.filter((i) => ids.has(i.applicationId)); }
  else if (!PLATFORM_ROLES.includes(ctx.role)) { const t = tenantOf(req); rows = rows.filter((i) => i.companyId === t || i.orgId === t); }
  if (req.query.requisitionId) {
    const appReq = new Map((db.applications as any[]).map((a: any) => [a.id, a.requisitionId]));
    rows = rows.filter((i) => appReq.get(i.applicationId) === req.query.requisitionId);
  }
  if (req.query.jobId) rows = rows.filter((i) => i.jobId === req.query.jobId);
  // Phase E: server paging (was: full-array dump, client-sliced).
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
// Phase E: single-query overdue-feedback count (replaces per-row N+1 fan-outs).
recruitmentRouter.get('/interviews/feedback-pending', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  let rows = db.interviews as any[];
  if (ctx.role === 'candidate') rows = rows.filter((i) => String(i.candidateEmail).toLowerCase() === ctx.email.toLowerCase());
  else if (ctx.role === 'internal_recruiter') {
    const me = emailOf(ctx);
    const ids = new Set((db.applications as any[]).filter((a) => appAssignedTo(db, a, me)).map((a) => a.id));
    rows = rows.filter((i) => ids.has(i.applicationId));
  }
  else if (AGENCY_ROLES.includes(ctx.role)) { const ids = agencyLinkedAppIds(db, ctx); rows = rows.filter((i) => ids.has(i.applicationId)); }
  else if (!PLATFORM_ROLES.includes(ctx.role)) { const t = tenantOf(req); rows = rows.filter((i) => i.companyId === t || i.orgId === t); }
  const done = rows.filter((i) => i.status === 'Completed');
  const fbIds = new Set((db.feedback as any[]).map((f: any) => f.interviewId));
  res.json({ success: true, data: { pending: done.filter((i) => !fbIds.has(i.id)).length, completed: done.length } });
});
recruitmentRouter.post('/interviews', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin','internal_recruiter','recruiter','agency_recruiter','agency_admin','vendor']), (req: Request, res: Response) => {
  const parsed = interviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed.', errors: parsed.error.flatten() });
  const db = loadDb(); const ctx = ctxOf(req);
  const app: any = db.applications.find((a: any) => a.id === parsed.data.applicationId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!canSeeApplication(db, ctx, app, tenantOf(req))) return res.status(404).json({ success: false, message: 'Application not found.' });
  // Phase D: the interview must belong to the application's own job.
  if (parsed.data.jobId !== app.jobId) {
    return res.status(422).json({ success: false, code: 'INTERVIEW_JOB_MISMATCH', message: `Interview job ${parsed.data.jobId} does not match application job ${app.jobId}.` });
  }
  // Frozen pipeline: no new interviews while the job is paused/closed.
  const ivJob: any = db.jobs.find((x: any) => x.id === app.jobId);
  if (ivJob && ivJob.status !== 'Published') {
    return res.status(422).json({ success: false, code: 'PIPELINE_FROZEN', message: `Cannot schedule — job ${ivJob.id} is ${ivJob.status}. Resume it first.` });
  }
  // Phase 3: timezone-safe scheduling — start must be in the future.
  const at = new Date(parsed.data.scheduledAt).getTime();
  if (!Number.isFinite(at) || at <= Date.now() - 60 * 1000) return res.status(422).json({ success: false, code: 'INTERVIEW_PAST', message: 'Interview must be scheduled in the future.' });
  const iv = { id: uid('INT'), ...parsed.data, candidateEmail: app.candidateEmail, candidateName: app.candidateName || app.candidateEmail, companyId: app.orgId, orgId: app.orgId, status: 'Scheduled', createdAt: nowIso() };
  db.interviews.unshift(iv);
  app.stage = 'Interview Scheduled'; app.updatedAt = nowIso();
  pushHistory(db.stageHistory, { id: uid('STG'), applicationId: app.id, from: 'Shortlisted', to: 'Interview Scheduled', actor: ctx.email, createdAt: nowIso() });
  audit(ctx.email, `INTERVIEW_SCHEDULED:${iv.id}`, app.orgId, 'interview', iv.id, req.ip); persist();
  emit('interview.scheduled', { ...iv, applicationId: app.id }, app.orgId, ctx.email);
  res.status(201).json({ success: true, data: iv });
});
recruitmentRouter.post('/interviews/:id/feedback', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin','internal_recruiter','recruiter','agency_recruiter','agency_admin','vendor']), (req: Request, res: Response) => {
  const db = loadDb(); const iv: any = db.interviews.find((x: any) => x.id === req.params.id);
  if (!iv) return res.status(404).json({ success: false, message: 'Interview not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && iv.companyId !== tenantOf(req) && iv.orgId !== tenantOf(req)) {
    if (ctx.role === 'internal_recruiter') {
      const app: any = db.applications.find((a: any) => a.id === iv.applicationId);
      if (!app || !appAssignedTo(db, app, emailOf(ctx))) return res.status(404).json({ success: false, message: 'Interview not found.' });
    } else if (!(AGENCY_ROLES.includes(ctx.role) && agencyLinkedAppIds(db, ctx).has(iv.applicationId))) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }
  }
  const rating = Number(req.body.rating);
  if (req.body.rating !== undefined && !(rating >= 1 && rating <= 5)) return res.status(400).json({ success: false, message: 'rating must be 1-5.' });
  // Enterprise scorecard: per-dimension 1-5 scores + hiring recommendation + strengths/gaps.
  let dimensions: Record<string, number> | undefined;
  if (req.body.dimensions !== undefined) {
    if (typeof req.body.dimensions !== 'object' || Array.isArray(req.body.dimensions)) return res.status(400).json({ success: false, message: 'dimensions must be an object of criterion to 1-5.' });
    const entries = Object.entries(req.body.dimensions).slice(0, 6);
    dimensions = {};
    for (const [k, v] of entries) {
      const n = Number(v);
      if (String(k).length > 40 || !(n >= 1 && n <= 5)) return res.status(400).json({ success: false, message: `dimension "${String(k).slice(0, 40)}" must be 1-5.` });
      dimensions[String(k).slice(0, 40)] = n;
    }
  }
  const recommendation = req.body.recommendation === undefined || req.body.recommendation === '' ? undefined : String(req.body.recommendation);
  if (recommendation && !['Strong hire', 'Hire', 'Hold', 'No hire'].includes(recommendation)) return res.status(400).json({ success: false, message: 'recommendation must be Strong hire|Hire|Hold|No hire.' });
  const fb = {
    id: uid('FB'), interviewId: iv.id, rating: req.body.rating === undefined ? undefined : rating,
    dimensions, recommendation,
    strengths: String(req.body.strengths || '').slice(0, 1000) || undefined,
    gaps: String(req.body.gaps || '').slice(0, 1000) || undefined,
    notes: String(req.body.notes || '').slice(0, 2000), by: ctx.email, createdAt: nowIso(),
  };
  db.feedback.unshift(fb);
  audit(ctx.email, `INTERVIEW_FEEDBACK:${iv.id}`, iv.companyId || iv.orgId, 'interview', iv.id, req.ip); persist();
  res.status(201).json({ success: true, data: fb });
});
recruitmentRouter.get('/interviews/:id/feedback', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin','internal_recruiter','recruiter','agency_recruiter','agency_admin','vendor']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const iv: any = db.interviews.find((x: any) => x.id === req.params.id);
  if (!iv) return res.status(404).json({ success: false, message: 'Interview not found.' });
  if (!PLATFORM_ROLES.includes(ctx.role) && iv.companyId !== tenantOf(req) && iv.orgId !== tenantOf(req)) {
    if (ctx.role === 'internal_recruiter') {
      const app: any = db.applications.find((a: any) => a.id === iv.applicationId);
      if (!app || !appAssignedTo(db, app, emailOf(ctx))) return res.status(404).json({ success: false, message: 'Interview not found.' });
    } else if (!(AGENCY_ROLES.includes(ctx.role) && agencyLinkedAppIds(db, ctx).has(iv.applicationId))) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }
  }
  res.json({ success: true, data: db.feedback.filter((f: any) => f.interviewId === iv.id) });
});
// Phase 6.3: calendar download — same visibility as the interview itself, .ics for any client.
recruitmentRouter.get('/interviews/:id/ics', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const iv: any = db.interviews.find((x: any) => x.id === req.params.id);
  if (!iv) return res.status(404).json({ success: false, message: 'Interview not found.' });
  if (ctx.role === 'candidate' && String(iv.candidateEmail || '').toLowerCase() !== String(ctx.email).toLowerCase()) {
    return res.status(404).json({ success: false, message: 'Interview not found.' });
  }
  if (ctx.role !== 'candidate' && !PLATFORM_ROLES.includes(ctx.role) && iv.companyId !== tenantOf(req) && iv.orgId !== tenantOf(req)) {
    if (ctx.role === 'internal_recruiter') {
      const app: any = db.applications.find((a: any) => a.id === iv.applicationId);
      if (!app || !appAssignedTo(db, app, emailOf(ctx))) return res.status(404).json({ success: false, message: 'Interview not found.' });
    } else if (!(AGENCY_ROLES.includes(ctx.role) && agencyLinkedAppIds(db, ctx).has(iv.applicationId))) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }
  }
  const startRaw = iv.scheduledAt || iv.date || iv.createdAt;
  const start = new Date(startRaw);
  const dt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date((Number.isFinite(start.getTime()) ? start.getTime() : Date.now()) + 60 * 60 * 1000);
  const esc = (s: string) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n').slice(0, 500);
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NexaTalent//Interviews//EN', 'BEGIN:VEVENT', `UID:${iv.id}@nexatalent`, `DTSTAMP:${dt(new Date())}`, `DTSTART:${dt(Number.isFinite(start.getTime()) ? start : new Date())}`, `DTEND:${dt(end)}`, `SUMMARY:${esc(`Interview — ${iv.round || iv.jobTitle || iv.applicationId || iv.id}`)}`, `DESCRIPTION:${esc(`${iv.mode || ''} ${iv.meetingLink || iv.meetLink || iv.venue || ''} ${iv.instructions || ''}`.trim())}`, `LOCATION:${esc(iv.mode === 'video' ? (iv.meetingLink || iv.meetLink || 'Video') : (iv.venue || ''))}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', `attachment; filename="interview-${iv.id}.ics"`);
  res.send(ics);
});

// ---- Offers & placements ----
// Candidate-scoped offer inbox (§7 offers): own offers enriched with job + placement status.
recruitmentRouter.get('/offers/mine', requireAuth(['candidate','superadmin']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  let rows = db.offers as any[];
  if (ctx.role === 'candidate') {
    rows = rows.filter((o: any) => String(o.candidateEmail || '').toLowerCase() === ctx.email.toLowerCase());
  }
  const data = rows.map((o: any) => {
    const job: any = (db.jobs as any[]).find((j) => j.id === o.jobId) || null;
    const app: any = (db.applications as any[]).find((a) => a.id === o.applicationId) || null;
    const placement: any = (db.placements as any[]).find((p) => p.applicationId === o.applicationId) || null;
    return {
      ...o,
      job: job
        ? { id: job.id, title: job.title, companyName: job.companyName, location: job.location, employmentType: job.employmentType }
        : { id: o.jobId, title: app?.jobTitle || '', companyName: '', location: '', employmentType: '' },
      application: app ? { id: app.id, stage: app.stage, jobTitle: app.jobTitle } : null,
      placement: placement ? { id: placement.id, status: placement.status, joinDate: placement.joinDate } : null,
    };
  }).sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)));
  res.json({ success: true, data });
});
// Candidate accept / decline an offer (audited, notified; history preserved).
recruitmentRouter.post('/offers/:id/respond', requireAuth(['candidate','superadmin']), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const offer: any = db.offers.find((o: any) => o.id === req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found.' });
  if (ctx.role === 'candidate' && String(offer.candidateEmail || '').toLowerCase() !== ctx.email.toLowerCase()) {
    return res.status(404).json({ success: false, message: 'Offer not found.' });
  }
  const decision = String(req.body?.decision || '').toLowerCase();
  if (!['accepted','declined'].includes(decision)) {
    return res.status(400).json({ success: false, message: "decision must be 'accepted' or 'declined'." });
  }
  if (['Accepted','Declined'].includes(offer.status)) {
    return res.status(409).json({ success: false, message: `Offer already ${offer.status}.` });
  }
  const reason = String(req.body?.reason || '').slice(0, 1000);
  offer.status = decision === 'accepted' ? 'Accepted' : 'Declined';
  offer.respondedAt = nowIso();
  if (reason) offer.responseReason = reason;
  const app: any = db.applications.find((a: any) => a.id === offer.applicationId);
  if (app && decision === 'accepted' && app.stage !== 'Hired') {
    const from = app.stage;
    app.stage = 'Selected'; app.updatedAt = nowIso();
    app.history = [...(app.history || []), { from, to: 'Selected', by: ctx.email, reason: 'Offer accepted by candidate', at: nowIso() }];
    emit('application.stage', { ...app, stage: 'Selected' }, app.orgId, ctx.email);
  }
  db.notifications.unshift({ id: uid('NOTIF'), recipient: `company:${offer.orgId}`, kind: 'offer', body: `Offer ${offer.id} ${offer.status.toLowerCase()} by ${offer.candidateEmail}${reason ? `: ${reason}` : ''}`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: offer.orgId });
  db.notifications.unshift({ id: uid('NOTIF'), recipient: offer.candidateEmail, kind: 'offer', body: `You ${offer.status.toLowerCase()} offer ${offer.id}${app?.jobTitle ? ` (${app.jobTitle})` : ''}.`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: offer.orgId });
  audit(ctx.email, `OFFER_${offer.status.toUpperCase()}:${offer.id}`, offer.orgId, 'offer', offer.id, req.ip); persist();
  res.json({ success: true, data: offer });
});
recruitmentRouter.post('/offers', requireAuth(['employer','superadmin','company_admin','hiring_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const { applicationId, ctc, currency, joinDate, offerLetterMode, offerLetterRef, payPeriod } = req.body || {};
  const app: any = db.applications.find((a: any) => a.id === applicationId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!['superadmin','platform_owner'].includes(ctxOf(req).role) && app.orgId !== ctxOf(req).tenantId) return res.status(404).json({ success: false, message: 'Application not found.' });
  // Frozen pipeline: no new offers while the job is paused/closed.
  const offJob: any = db.jobs.find((x: any) => x.id === app.jobId);
  if (offJob && offJob.status !== 'Published') {
    return res.status(422).json({ success: false, code: 'PIPELINE_FROZEN', message: `Cannot offer — job ${offJob.id} is ${offJob.status}. Resume it first.` });
  }
  // Phase D: one open offer at a time, real money, real dates.
  if (ctc !== undefined && !(Number(ctc) >= 0)) return res.status(400).json({ success: false, message: 'CTC must be zero or a positive amount.' });
  if (joinDate !== undefined && Number.isNaN(Date.parse(joinDate))) return res.status(400).json({ success: false, message: 'Invalid joinDate.' });
  // Guided offer-letter flow: generated (NexaTalent template) or uploaded (company letterhead).
  const mode = offerLetterMode === 'uploaded' ? 'uploaded' : 'generated';
  if (mode === 'uploaded' && !String(offerLetterRef || '').trim()) return res.status(400).json({ success: false, message: 'Uploaded letter needs a file reference (filename).' });
  const open = (db.offers as any[]).find((o: any) => o.applicationId === applicationId && o.status === 'Issued');
  if (open) return res.status(409).json({ success: false, code: 'OFFER_EXISTS', message: `An open offer (${open.id}) already exists for this application. Withdraw it first.` });
  const offer = { id: uid('OFF'), applicationId, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail, ctc: Number(ctc || 0), currency: currency || 'INR', payPeriod: String(payPeriod || 'annual').slice(0, 20), joinDate, status: 'Issued', offerLetterMode: mode, offerLetterRef: mode === 'uploaded' ? String(offerLetterRef).slice(0, 300) : null, createdAt: nowIso() };
  db.offers.unshift(offer); app.stage = 'Offer'; app.updatedAt = nowIso();
  audit(ctxOf(req).email, `OFFER_ISSUED:${offer.id}`, app.orgId, 'offer', offer.id, req.ip); persist();
  emit('application.stage', { ...app, stage: 'Offer' }, app.orgId, ctxOf(req).email);
  res.status(201).json({ success: true, data: offer });
});
// Phase 1.5: employer-scoped offer inbox + withdraw (unblocks re-issue after 409 OFFER_EXISTS).
recruitmentRouter.get('/offers', requireAuth(['employer','superadmin','company_admin','hiring_manager','company_recruiter','internal_recruiter','operations_admin','employee']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  let rows = db.offers as any[];
  if (!PLATFORM_ROLES.includes(ctx.role)) {
    const t = tenantOf(req);
    rows = rows.filter((o: any) => o.orgId === t);
  }
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
recruitmentRouter.post('/offers/:id/withdraw', requireAuth(['employer','superadmin','company_admin','hiring_manager']), (req: Request, res: Response) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const offer: any = db.offers.find((o: any) => o.id === req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found.' });
  if (!['superadmin','platform_owner'].includes(ctx.role) && offer.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Offer not found.' });
  if (offer.status !== 'Issued') return res.status(409).json({ success: false, message: 'Only Issued offers can be withdrawn.' });
  const reason = String(req.body?.reason || '').slice(0, 1000);
  if (!reason.trim()) return res.status(400).json({ success: false, message: 'Withdraw reason required (audit).' });
  offer.status = 'Withdrawn'; offer.withdrawnAt = nowIso(); offer.withdrawReason = reason.trim(); offer.withdrawnBy = ctx.email;
  const app: any = db.applications.find((a: any) => a.id === offer.applicationId);
  if (app && app.stage === 'Offer') {
    app.stage = 'Selected'; app.updatedAt = nowIso();
    app.history = [...(app.history || []), { from: 'Offer', to: 'Selected', by: ctx.email, reason: 'Offer withdrawn', at: nowIso() }];
  }
  db.notifications.unshift({ id: uid('NOTIF'), recipient: offer.candidateEmail, kind: 'offer', body: 'Offer withdrawn', channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: offer.orgId });
  audit(ctx.email, 'OFFER_WITHDRAWN:' + offer.id, offer.orgId, 'offer', offer.id, req.ip); persist();
  res.json({ success: true, data: offer });
});
recruitmentRouter.post('/placements', requireAuth(['employer','superadmin','company_admin','employee','operations_admin','internal_recruiter']), async (req: Request, res: Response) => {
  const db = loadDb(); const { applicationId, joinDate, feeBasis } = req.body || {};
  const app: any = db.applications.find((a: any) => a.id === applicationId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!['superadmin','platform_owner'].includes(ctxOf(req).role) && app.orgId !== ctxOf(req).tenantId) {
    // Phase 5: assigned recruiters coordinate joining on their own mandates.
    if (!(ctxOf(req).role === 'internal_recruiter' && appAssignedTo(db, app, emailOf(ctxOf(req))))) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
  }
  if (db.placements.find((p: any) => p.applicationId === applicationId)) return res.status(409).json({ success: false, message: 'Placement already recorded.' });
  // Frozen pipeline: joining completes only on live jobs.
  const plcJob: any = db.jobs.find((x: any) => x.id === app.jobId);
  if (plcJob && plcJob.status !== 'Published') {
    return res.status(422).json({ success: false, code: 'PIPELINE_FROZEN', message: `Cannot place — job ${plcJob.id} is ${plcJob.status}. Resume it first.` });
  }
  const { matchAgreement } = await import('./commercial.js');
  const agreement = matchAgreement(db, app);
  if (!agreement) return res.status(422).json({ success: false, code: 'NO_AGREEMENT', message: 'No accepted commercial agreement covers this hire. Ask your NexaTalent manager to activate one before recording the joining.' });
  const offer: any = db.offers.filter((o: any) => o.applicationId === app.id).sort((x: any, y: any) => String(y.createdAt).localeCompare(String(x.createdAt)))[0] || null;
  const basis = Number(feeBasis || 0) || Number(offer?.ctc || 0);
  if (!(basis > 0)) return res.status(422).json({ success: false, code: 'NO_BASIS', message: 'Fee basis required: enter the annual CTC (or monthly CTC for contract hires).', agreementId: agreement.id });
  const pl = { id: uid('PLC'), applicationId, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail, joinDate: joinDate || nowIso(), feeBasis: basis, agreementId: agreement.id, status: 'Joined', createdAt: nowIso() };
  db.placements.unshift(pl); app.stage = 'Hired'; app.updatedAt = nowIso();
  audit(ctxOf(req).email, `PLACEMENT_JOINED:${pl.id}`, app.orgId, 'placement', pl.id, req.ip); persist();
  emit('placement.joined', { placementId: pl.id, applicationId, jobId: app.jobId, orgId: app.orgId, candidateEmail: app.candidateEmail, feeBasis: basis, stage: 'Hired' }, app.orgId, ctxOf(req).email);
  // Straight-through billing for trusted agreements: approve + first invoice immediately.
  // P0-2: auto-approve is a finance side-effect — only runs when the agreement
  // explicitly opts in AND the caller is finance-privileged. Employers without
  // manage_billing leave commissions Pending for finance review.
  let autoInvoice: any = null;
  const callerRole = ctxOf(req).role;
  const canAutoBill = ['superadmin', 'platform_owner', 'finance_admin'].includes(callerRole);
  if (agreement.autoApprove && canAutoBill) {
    const { invoiceForCommission } = await import('./commercial.js');
    for (const com of (db.commissions as any[]).filter((x: any) => x.applicationId === applicationId && x.approvalStatus === 'Pending')) {
      com.approvalStatus = 'Approved'; com.approvedAt = nowIso(); com.approvedBy = 'system:auto-approve';
      audit('system:auto-approve', `COMMISSION_APPROVED:${com.id}`, com.orgId, 'commission', com.id, req.ip);
      emit('commission.approved', com, com.orgId, 'system:auto-approve');
      try {
        const out = invoiceForCommission(db, com, undefined, 'system:auto-approve');
        autoInvoice = autoInvoice || out.invoice;
      } catch { /* billing guard left a clear error on the commission instead */ }
    }
    persist();
  }
  db.notifications.unshift({ id: uid('NOTIF'), recipient: app.candidateEmail, kind: 'placement', body: `You joined ${app.jobId} — congratulations!`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: app.orgId });
  db.notifications.unshift({ id: uid('NOTIF'), recipient: `company:${app.orgId}`, kind: 'placement', body: `Placement ${pl.id}: ${app.candidateEmail} joined ${app.jobId} (fee basis ₹${basis.toLocaleString('en-IN')})${autoInvoice ? ` — invoice ${autoInvoice.number || autoInvoice.id} generated automatically` : ' — approve the commission to bill'}.`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: app.orgId });
  db.notifications.unshift({ id: uid('NOTIF'), recipient: 'superadmin', kind: 'placement', body: `Placement ${pl.id} (${app.orgId}): ${app.candidateEmail} → ${app.jobId}${autoInvoice ? `, auto-invoiced ${autoInvoice.number || autoInvoice.id}` : ''}.`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: 'TNT-GLOBAL' });
  persist();
  res.status(201).json({ success: true, data: { ...pl, agreementId: agreement.id, autoInvoiced: autoInvoice ? autoInvoice.id : null } });
});
recruitmentRouter.get('/placements/:id/offer-letter', requireAuth(), (req, res) => {
  const db = loadDb();
  const pl: any = db.placements.find((x: any) => x.id === req.params.id);
  if (!pl) return res.status(404).json({ success: false, message: 'Placement not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && ctx.role !== 'finance_admin' && pl.orgId !== tenantOf(req)) {
    // Candidates may view their own joining letter; everyone else needs org scope.
    if (!(ctx.role === 'candidate' && String(pl.candidateEmail || '').toLowerCase() === ctx.email.toLowerCase())) {
      return res.status(404).json({ success: false, message: 'Placement not found.' });
    }
  }
  const app: any = db.applications.find((a: any) => a.id === pl.applicationId) || null;
  const job: any = db.jobs.find((j: any) => j.id === pl.jobId) || null;
  const org: any = db.organizations.find((o: any) => o.id === pl.orgId) || null;
  const offer: any = db.offers.filter((o: any) => o.applicationId === pl.applicationId).sort((x: any, y: any) => String(y.createdAt).localeCompare(String(x.createdAt)))[0] || null;
  const cand: any = db.candidateProfiles.find((c: any) => String(c.email || '').toLowerCase() === String(pl.candidateEmail || '').toLowerCase()) || null;
  const ag: any = pl.agreementId ? db.commissionAgreements.find((a: any) => a.id === pl.agreementId) : null;
  // Phase C: candidates get their joining letter, never the commercial rate card.
  const forCandidate = ctx.role === 'candidate';
  res.json({ success: true, data: {
    placement: pl,
    candidate: cand ? { name: cand.name, email: cand.email, roleTitle: cand.roleTitle } : { name: '', email: pl.candidateEmail, roleTitle: '' },
    job: job ? { id: job.id, title: job.title, location: job.location, employmentType: job.employmentType } : { id: pl.jobId, title: app?.jobTitle || '', location: '', employmentType: '' },
    organization: org ? { id: org.id, legalName: org.legalName, displayName: org.displayName } : { id: pl.orgId, legalName: pl.orgId, displayName: pl.orgId },
    offer: offer ? { id: offer.id, ctc: offer.ctc, currency: offer.currency || 'INR', payPeriod: offer.payPeriod || 'annual', joinDate: offer.joinDate, status: offer.status, offerLetterMode: offer.offerLetterMode || 'generated', offerLetterRef: offer.offerLetterRef || null } : null,
    terms: forCandidate
      ? { paymentTermsDays: ag?.paymentTermsDays ?? 30, replacementDays: ag?.replacementDays ?? 90, hiringType: '', rate: null }
      : { paymentTermsDays: ag?.paymentTermsDays ?? 30, replacementDays: ag?.replacementDays ?? 90, hiringType: ag?.hiringType || '', rate: ag?.rate ?? null },
    generatedAt: nowIso(),
  } });
});
recruitmentRouter.get('/placements', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); const db = loadDb(); let rows = db.placements as any[];
  if (!PLATFORM_ROLES.includes(ctx.role) && ctx.role !== 'finance_admin') {
    if (['agency_admin','agency_recruiter','recruiter','vendor'].includes(ctx.role)) {
      // Phase C: agencies see placements attributed to their own submissions.
      const keys = new Set(((db as any).submissions as any[] || [])
        .filter((s: any) => s.agencyId === ctx.tenantId || String(s.submittedBy || '').toLowerCase() === ctx.email.toLowerCase())
        .map((s: any) => `${s.jobId}::${String(s.candidateEmail || '').toLowerCase()}`));
      rows = rows.filter((p: any) => keys.has(`${p.jobId}::${String(p.candidateEmail || '').toLowerCase()}`));
    } else {
      const t = tenantOf(req);
      rows = rows.filter((p) => p.orgId === t);
    }
  }
  // Phase E: server paging (was: unbounded array).
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
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
// Shortlist a pool member into the ATS pipeline: creates the application (Applied)
// on a live job and links it back to the member. Frozen jobs refuse.
recruitmentRouter.post('/talent-pools/:id/members/:memberId/shortlist', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','company_recruiter','employee','operations_admin']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const pool: any = poolOf(db, req, ctx);
  if (!pool) return res.status(404).json({ success: false, message: 'Pool not found.' });
  const m: any = db.talentPoolMembers.find((x: any) => x.id === req.params.memberId && x.poolId === req.params.id);
  if (!m) return res.status(404).json({ success: false, message: 'Member not found.' });
  const jobId = String(req.body?.jobId || '');
  if (!jobId) return res.status(400).json({ success: false, message: 'jobId required.' });
  const job: any = db.jobs.find((j: any) => j.id === jobId);
  if (!job || (!PLATFORM_ROLES.includes(ctx.role) && job.orgId !== tenantOf(req))) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  if (job.status !== 'Published' || (job.expiryDate && new Date(job.expiryDate) <= new Date())) {
    return res.status(422).json({ success: false, code: 'PIPELINE_FROZEN', message: `Job ${job.id} is ${job.status} — resume it to shortlist.` });
  }
  const key = String(m.candidateId || m.candidateEmail || '').toLowerCase();
  const cand: any = db.candidateProfiles.find((x: any) => x.id === m.candidateId || String(x.email || '').toLowerCase() === key);
  if (!cand) return res.status(422).json({ success: false, code: 'PROFILE_MISSING', message: 'Member profile is no longer on file — cannot shortlist.' });
  const appKey = `${jobId}::${String(cand.email).toLowerCase()}`;
  const dup: any = db.applications.find((a: any) => a.key === appKey);
  if (dup) return res.status(409).json({ success: false, code: 'APPLICATION_EXISTS', message: 'Candidate already in pipeline for this job.', applicationId: dup.id });
  const app = { id: uid('APP'), key: appKey, jobId, jobTitle: job.title, orgId: job.orgId, requisitionId: job.requisitionId, candidateEmail: cand.email, candidateName: cand.name, stage: 'Applied', source: `pool:${pool.id}:${m.id}`, poolId: pool.id, createdAt: nowIso(), updatedAt: nowIso() };
  db.applications.unshift(app);
  pushHistory(db.stageHistory, { id: uid('STG'), applicationId: app.id, from: '-', to: 'Applied', actor: ctx.email, reason: `Shortlisted from pool ${pool.id}`, createdAt: nowIso() });
  job.applicantsCount = (job.applicantsCount || 0) + 1;
  m.applicationId = app.id; m.updatedAt = nowIso();
  audit(ctx.email, `POOL_SHORTLISTED:${m.id}->${app.id}`, pool.orgId, 'talent-pool', m.id, req.ip);
  notify(db, `company:${pool.orgId}`, 'talent-pool', `Pool member ${cand.name} shortlisted to ${jobId} (${app.id}).`, pool.orgId);
  persist();
  const { key: _k, ...pub } = app;
  res.status(201).json({ success: true, data: { application: pub, member: m } });
});
recruitmentRouter.get('/saved-jobs', requireAuth(['candidate','superadmin']), (req, res) => {
  const ctx = ctxOf(req);
  const db = loadDb();
  const rows = (db.savedJobs as any[]).filter((s) => s.candidateEmail === ctx.email || ctx.role === 'superadmin');
  const now = new Date();
  const data = rows.map((s) => {
    const job: any = (db.jobs as any[]).find((j) => j.id === s.jobId) || null;
    const counts = job ? jobCounts(db, job) : null;
    const closed = job
      ? job.status === 'Closed' || (job.expiryDate ? new Date(job.expiryDate) <= now : false)
      : false;
    const applied = (db.applications as any[]).some(
      (a) => a.jobId === s.jobId && String(a.candidateEmail || '').toLowerCase() === String(s.candidateEmail || '').toLowerCase(),
    );
    return {
      ...s,
      job: job ? { ...publicJob(job), counts, acceptingApplications: counts?.acceptingApplications ?? false } : null,
      jobMissing: !job,
      closed,
      applied,
    };
  });
  res.json({ success: true, data });
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

// ---- Job detail (§7.4, public allowlist for non-owners) ----
recruitmentRouter.get('/jobs/:id', requireAuth(), (req, res) => {
  const db = loadDb();
  const j: any = db.jobs.find((x: any) => x.id === req.params.id);
  if (!j) return res.status(404).json({ success: false, message: 'Job not found.' });
  const ctx = ctxOf(req);
  const assigned = ctx.role === 'internal_recruiter' && jobAssignedTo(db, j, emailOf(ctx));
  const owner = PLATFORM_ROLES.includes(ctx.role) || j.orgId === tenantOf(req) || assigned;
  if (!owner && !(j.status === 'Published' && j.visibility !== 'private')) return res.status(404).json({ success: false, message: 'Job not found.' });
  const counts = jobCounts(db, j);
  const companyFallback = j.companyName || (j.orgId ? (db.companyProfiles.find((cp: any) => cp.orgId === j.orgId)?.companyName || db.organizations.find((o: any) => o.id === j.orgId)?.displayName) : null) || 'Fintech ScaleOps';
  const enrichedJob = { ...j, companyName: companyFallback };
  if (!owner) return res.json({ success: true, data: { ...publicJob(enrichedJob), counts, acceptingApplications: counts.acceptingApplications } });
  res.json({ success: true, data: { ...enrichedJob, counts, acceptingApplications: counts.acceptingApplications } });
});

// ---- Interview reschedule / cancel (history preserved, §11) ----
recruitmentRouter.patch('/interviews/:id', requireAuth(['employer','superadmin','company_admin','hiring_manager','employee','operations_admin','internal_recruiter','candidate','recruiter','agency_recruiter','agency_admin','vendor']), (req: Request, res: Response) => {
  const db = loadDb(); const iv: any = db.interviews.find((x: any) => x.id === req.params.id);
  if (!iv) return res.status(404).json({ success: false, message: 'Interview not found.' });
  const ctx = ctxOf(req);
  if (ctx.role === 'candidate' && String(iv.candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Interview not found.' });
  if (ctx.role === 'internal_recruiter') {
    const app: any = db.applications.find((a: any) => a.id === iv.applicationId);
    if (!app || !appAssignedTo(db, app, emailOf(ctx))) return res.status(404).json({ success: false, message: 'Interview not found.' });
  }
  if (['employer','company_admin','hiring_manager'].includes(ctx.role) && iv.companyId !== ctx.tenantId && iv.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Interview not found.' });
  if (AGENCY_ROLES.includes(ctx.role) && !agencyLinkedAppIds(db, ctx).has(iv.applicationId)) return res.status(404).json({ success: false, message: 'Interview not found.' });
  const { scheduledAt, status, reason } = req.body || {};
  if (status && !['Scheduled', 'Rescheduled', 'Completed', 'Cancelled', 'No-show'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });
  // Phase 3: candidates may only confirm/decline or propose a new time — never close out interviews or edit logistics.
  if (ctx.role === 'candidate') {
    const staffOnly = ['round', 'roundName', 'mode', 'interviewer', 'panel', 'meetingLink', 'meetLink', 'venue', 'instructions', 'notes'];
    if (staffOnly.some((k) => req.body[k] !== undefined)) return res.status(403).json({ success: false, code: 'INTERVIEW_FORBIDDEN', message: 'Candidates can only confirm attendance or propose a new time.' });
    if (status && ['Completed', 'Cancelled', 'No-show'].includes(status)) return res.status(403).json({ success: false, code: 'INTERVIEW_FORBIDDEN', message: 'Only hiring staff can mark interviews completed, cancelled or no-show.' });
  }
  if (scheduledAt) {
    const at = new Date(scheduledAt).getTime();
    if (!Number.isFinite(at) || at <= Date.now() - 60 * 1000) return res.status(422).json({ success: false, code: 'INTERVIEW_PAST', message: 'Rescheduled time must be in the future.' });
  }
  const prev = iv.status;
  if (scheduledAt) iv.scheduledAt = scheduledAt;
  if (status) iv.status = status;
  else if (scheduledAt) iv.status = 'Rescheduled';
  // Editable logistics (§8.8): panel, link, venue, mode, round, instructions, confirmation.
  // meetLink/meetingLink are mirrored — readers accept either field.
  for (const k of ['round', 'roundName', 'mode', 'interviewer', 'panel', 'meetingLink', 'meetLink', 'venue', 'instructions', 'notes', 'timezone', 'confirmationStatus', 'cancellationReason']) {
    if (req.body[k] !== undefined) iv[k] = req.body[k];
  }
  if (iv.meetingLink && !iv.meetLink) iv.meetLink = iv.meetingLink;
  if (iv.meetLink && !iv.meetingLink) iv.meetingLink = iv.meetLink;
  if (status === 'Cancelled' && reason) iv.cancellationReason = String(reason).slice(0, 1000);
  iv.history = [...(iv.history || []), { from: prev, to: iv.status, at: nowIso(), by: ctx.email, reason: reason || '' }];
  if (iv.history.length > 200) iv.history = iv.history.slice(-200);
  db.notifications.unshift({ id: uid('NOTIF'), recipient: ctx.role === 'candidate' ? `company:${iv.companyId}` : iv.candidateEmail, kind: 'interview', body: `Interview ${iv.id} ${prev} → ${iv.status}${reason ? `: ${reason}` : ''}`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: iv.companyId || iv.orgId });
  audit(ctx.email, `INTERVIEW_${iv.status.toUpperCase()}:${iv.id}`, iv.companyId || iv.orgId, 'interview', iv.id, req.ip); persist();
  // P6: candidate-safe projection on PATCH (was full iv with panel/interviewer internals).
  if (ctx.role === 'candidate') {
    const { id, applicationId, jobId, round, scheduledAt, timezone, mode, venue, instructions, status: st, confirmationStatus, candidateName, jobTitle } = iv;
    return res.json({ success: true, data: { id, applicationId, jobId, round, scheduledAt, timezone, mode, meetingLink: iv.meetingLink || iv.meetLink, venue, instructions, status: st, confirmationStatus, candidateName, jobTitle } });
  }
  res.json({ success: true, data: iv });
});

// ---- Single application (§7.6 detail page) ----
recruitmentRouter.get('/applications/:id', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (ctx.role === 'candidate' && String(a.candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!PLATFORM_ROLES.includes(ctx.role) && ctx.role !== 'candidate' && a.orgId !== tenantOf(req) && !(AGENCY_ROLES.includes(ctx.role) && agencyLinkedAppIds(db, ctx).has(a.id))) return res.status(404).json({ success: false, message: 'Application not found.' });
  const history = db.stageHistory.filter((h: any) => h.applicationId === a.id);
  const interviews = (db.interviews as any[]).filter((i: any) => i.applicationId === a.id);
  const nextInterview = interviews.filter((i: any) => ['Scheduled','Rescheduled'].includes(i.status)).sort((x: any, y: any) => String(x.scheduledAt || '').localeCompare(String(y.scheduledAt || '')))[0] || null;
  const conv: any = db.conversations.find((c: any) => c.applicationId === a.id) || null;
  const job: any = db.jobs.find((j: any) => j.id === a.jobId) || null;
  const companyName = a.companyName || (a.orgId ? (db.companyProfiles?.find((cp: any) => cp.orgId === a.orgId)?.companyName || db.organizations?.find((o: any) => o.id === a.orgId)?.displayName) : null) || 'Fintech ScaleOps';
  const enrichedJob = job ? enrichJobRecord(db, job) : null;
  const hasResume = !!(a.resumeRef || a.leadId || (db.leads as any[] || []).some((l: any) => l.resumeRef && String(l.email || '').toLowerCase() === String(a.candidateEmail || '').toLowerCase()));
  res.json({
    success: true,
    data: {
      ...a,
      companyName,
      job: enrichedJob,
      history,
      interviews,
      nextInterview,
      conversation: conv ? { id: conv.id, status: conv.status } : null,
      jobClosed: job ? job.status === 'Closed' || (job.expiryDate && new Date(job.expiryDate) <= new Date()) : false,
      hasResume,
      resumeUrl: hasResume ? `/api/v1/applications/${a.id}/resume` : null,
    }
  });
});

// ---- Application Resume Download / Preview ----
recruitmentRouter.get('/applications/:id/resume', requireAuth(), async (req, res) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const a: any = (db.applications as any[]).find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!canSeeApplication(db, ctx, a)) return res.status(403).json({ success: false, message: 'Access denied.' });

  let resumeRef = a.resumeRef;
  let resumeName = a.resumeName || 'resume.pdf';

  if (!resumeRef && a.leadId) {
    const l = (db.leads as any[] || []).find((x: any) => x.id === a.leadId);
    if (l && l.resumeRef) {
      resumeRef = l.resumeRef;
      if (l.resumeName) resumeName = l.resumeName;
    }
  }

  if (!resumeRef && a.candidateEmail) {
    const email = String(a.candidateEmail).toLowerCase();
    const l = (db.leads as any[] || []).find((x: any) => String(x.email || '').toLowerCase() === email && x.resumeRef);
    if (l) {
      resumeRef = l.resumeRef;
      if (l.resumeName) resumeName = l.resumeName;
    } else {
      const doc = (db.documents as any[] || []).find((d: any) => String(d.candidateEmail || d.ownerEmail || '').toLowerCase() === email && (d.ref || d.id));
      if (doc) {
        resumeRef = doc.ref || doc.id;
        if (doc.name) resumeName = doc.name;
      }
    }
  }

  if (!resumeRef) {
    return res.status(404).json({ success: false, message: 'No resume attached to this application.' });
  }

  try {
    let buf: Buffer;
    const localPath = join(UPLOAD_DIR, `${resumeRef}.bin`);
    if (existsSync(localPath)) {
      buf = readFileSync(localPath);
    } else if (isBlobStorageConfigured()) {
      buf = await downloadFile(DEFAULT_CONTAINER, `${resumeRef}.bin`);
    } else {
      return res.status(410).json({ success: false, message: 'Resume file no longer available.' });
    }
    const ext = (String(resumeName || '').split('.').pop() || 'pdf').toLowerCase();
    const mime = ext === 'doc' ? 'application/msword' : ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf';
    res.setHeader('Content-Type', mime);
    const safeName = String(resumeName || 'resume.pdf').replace(/["\r\n\\]/g, '').slice(0, 160) || 'resume.pdf';
    const isInline = req.query.view === 'true' || req.query.inline === 'true';
    res.setHeader('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${safeName}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(buf);
  } catch {
    res.status(410).json({ success: false, message: 'Resume file no longer available.' });
  }
});

// ---- Application stage history (read timeline, §8.8) ----
recruitmentRouter.get('/applications/:id/history', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (ctx.role === 'candidate' && String(a.candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!PLATFORM_ROLES.includes(ctx.role) && a.orgId !== tenantOf(req) && !(AGENCY_ROLES.includes(ctx.role) && agencyLinkedAppIds(db, ctx).has(a.id))) return res.status(404).json({ success: false, message: 'Application not found.' });
  res.json({ success: true, data: db.stageHistory.filter((h: any) => h.applicationId === a.id) });
});

// ---- Reopen a terminal application (explicit authorized workflow) ----
recruitmentRouter.post('/applications/:id/reopen', requireAuth(['employer','superadmin','company_admin','hiring_manager','company_recruiter','employee','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  const ctx = ctxOf(req);
  if (!PLATFORM_ROLES.includes(ctx.role) && a.orgId !== tenantOf(req)) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (!['Withdrawn','Rejected'].includes(a.stage)) return res.status(422).json({ success: false, message: `Only Withdrawn/Rejected applications can be reopened (current: ${a.stage}).` });
  const target = String(req.body?.target || 'Applied');
  if (!['Applied','Shortlisted'].includes(target)) return res.status(400).json({ success: false, message: 'Reopen target must be Applied or Shortlisted.' });
  const reason = String(req.body?.reason || '').trim();
  if (!reason) return res.status(400).json({ success: false, message: 'A reopen reason is required and is recorded in the audit log.' });
  const from = a.stage; a.stage = target; a.updatedAt = nowIso();
  pushHistory(db.stageHistory, { id: uid('STG'), applicationId: a.id, from, to: target, actor: ctx.email, reason, createdAt: nowIso() });
  const conv: any = db.conversations.find((c: any) => c.applicationId === a.id);
  if (conv && conv.status === 'closed') { conv.status = 'active'; conv.closedReason = ''; conv.reopenedAt = nowIso(); }
  audit(ctx.email, `APPLICATION_REOPENED:${a.id} ${from}->${target}`, a.orgId, 'application', a.id, req.ip); persist();
  res.json({ success: true, data: a });
});

// ---- Candidate withdraws application (§7.6) ----
recruitmentRouter.post('/applications/:id/withdraw', requireAuth(['candidate','superadmin']), (req: Request, res: Response) => {
  const db = loadDb(); const a: any = db.applications.find((x: any) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });
  const ctx = ctxOf(req);
  if (ctx.role === 'candidate' && String(a.candidateEmail).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Application not found.' });
  if (['Hired', 'Withdrawn'].includes(a.stage)) return res.status(422).json({ success: false, message: `Cannot withdraw from stage ${a.stage}.` });
  const from = a.stage; a.stage = 'Withdrawn'; a.updatedAt = nowIso();
  pushHistory(db.stageHistory, { id: uid('STG'), applicationId: a.id, from, to: 'Withdrawn', actor: ctx.email, reason: req.body?.reason || '', createdAt: nowIso() });
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
// Phase 6.2: pool delete — empty pools are removed, pools with members archive instead.
recruitmentRouter.delete('/talent-pools/:id', requireAuth(['employer','superadmin','company_admin']), (req, res) => {
  const db = loadDb(); const p: any = db.talentPools.find((x: any) => x.id === req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Pool not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && p.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Pool not found.' });
  const members = db.talentPoolMembers.filter((m: any) => m.poolId === p.id);
  if (members.length > 0) {
    p.status = 'Archived'; p.updatedAt = nowIso();
    audit(ctx.email, `TALENT_POOL_ARCHIVED:${p.id}`, p.orgId, 'talent-pool', p.id, req.ip); persist();
    return res.json({ success: true, data: p, message: `Pool has ${members.length} member(s) — archived instead of deleted.` });
  }
  db.talentPools.splice(db.talentPools.findIndex((x: any) => x.id === p.id), 1);
  audit(ctx.email, `TALENT_POOL_DELETED:${p.id}`, p.orgId, 'talent-pool', p.id, req.ip); persist();
  res.json({ success: true, data: p });
});
// Phase 6.2: bulk shortlist — shortlists many pool members to one live job, per-member results.
recruitmentRouter.post('/talent-pools/:id/shortlist-bulk', requireAuth(['employer','superadmin','platform_owner','company_admin','hiring_manager','company_recruiter','employee','operations_admin']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const pool: any = poolOf(db, req, ctx);
  if (!pool) return res.status(404).json({ success: false, message: 'Pool not found.' });
  const memberIds: string[] = Array.isArray(req.body?.memberIds) ? req.body.memberIds.map(String) : [];
  const jobId = String(req.body?.jobId || '');
  if (memberIds.length === 0 || !jobId) return res.status(400).json({ success: false, message: 'memberIds[] + jobId required.' });
  if (memberIds.length > 50) return res.status(400).json({ success: false, message: 'Max 50 members per bulk shortlist.' });
  const job: any = db.jobs.find((j: any) => j.id === jobId);
  if (!job || (!PLATFORM_ROLES.includes(ctx.role) && job.orgId !== tenantOf(req))) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  if (job.status !== 'Published' || (job.expiryDate && new Date(job.expiryDate) <= new Date())) {
    return res.status(422).json({ success: false, code: 'PIPELINE_FROZEN', message: `Job ${job.id} is ${job.status} — resume it to shortlist.` });
  }
  const results: any[] = [];
  for (const mid of memberIds) {
    const m: any = db.talentPoolMembers.find((x: any) => x.id === mid && x.poolId === pool.id);
    if (!m) { results.push({ memberId: mid, status: 'error', message: 'Member not found.' }); continue; }
    const key = String(m.candidateId || m.candidateEmail || '').toLowerCase();
    const cand: any = db.candidateProfiles.find((x: any) => x.id === m.candidateId || String(x.email || '').toLowerCase() === key);
    if (!cand) { results.push({ memberId: mid, status: 'error', message: 'Profile no longer on file.' }); continue; }
    const appKey = `${jobId}::${String(cand.email).toLowerCase()}`;
    const dup: any = db.applications.find((a: any) => a.key === appKey);
    if (dup) { results.push({ memberId: mid, status: 'duplicate', message: 'Already in pipeline.', applicationId: dup.id }); continue; }
    const app = { id: uid('APP'), key: appKey, jobId, jobTitle: job.title, orgId: job.orgId, requisitionId: job.requisitionId, candidateEmail: cand.email, candidateName: cand.name, stage: 'Applied', source: `pool:${pool.id}:${m.id}`, poolId: pool.id, createdAt: nowIso(), updatedAt: nowIso() };
    db.applications.unshift(app);
    pushHistory(db.stageHistory, { id: uid('STG'), applicationId: app.id, from: '-', to: 'Applied', actor: ctx.email, reason: `Bulk shortlisted from pool ${pool.id}`, createdAt: nowIso() });
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    m.applicationId = app.id; m.updatedAt = nowIso();
    results.push({ memberId: mid, status: 'created', message: cand.email, applicationId: app.id });
  }
  audit(ctx.email, `POOL_BULK_SHORTLIST:${pool.id}:${results.filter((r) => r.status === 'created').length}`, pool.orgId, 'talent-pool', pool.id, req.ip);
  persist();
  res.status(201).json({ success: true, data: { results, summary: { total: results.length, created: results.filter((r) => r.status === 'created').length, duplicates: results.filter((r) => r.status === 'duplicate').length, errors: results.filter((r) => r.status === 'error').length } } });
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
  const db = loadDb();
  if (!poolOf(db, req, ctxOf(req))) return res.status(404).json({ success: false, message: 'Pool not found.' });
  // Enrich with a tier-safe candidate snapshot so pool rows render names/roles
  // even when only an ID was stored (no contact fields — tier model applies).
  const data = db.talentPoolMembers.filter((m: any) => m.poolId === req.params.id).map((m: any) => {
    const key = String(m.candidateId || m.candidateEmail || '').toLowerCase();
    const c: any = (db.candidateProfiles as any[]).find((x: any) => x.id === m.candidateId ||
      String(x.email || '').toLowerCase() === String(m.candidateId || '').toLowerCase() ||
      (key && String(x.email || '').toLowerCase() === key)) || null;
    return { ...m, candidate: c ? { id: c.id, name: c.name, roleTitle: c.roleTitle, experienceYears: c.experienceYears ?? null, location: c.location || null, skills: c.skills || null, stage: c.stage || null } : null };
  });
  res.json({ success: true, data });
});
