import { Router, Request, Response } from 'express';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, requirePermission, ctxOf, tenantOf, ALL_ROLES, PERMISSIONS, effectivePermissions } from '../middleware/rbac.js';
import { paginate, paged } from '../validate/schemas.js';

export const directoryRouter = Router();

// Tenants/organizations
directoryRouter.get('/tenants', requireAuth(['superadmin','platform_owner','operations_admin','employee']), (_req, res) => {
  res.json({ success: true, data: loadDb().organizations });
});
directoryRouter.post('/tenants', requireAuth(['superadmin','platform_owner']), (req: Request, res: Response) => {
  const org = { id: uid('TNT'), status: 'Invited', verificationStatus: 'Pending', accountStatus: 'Invited', createdDate: nowIso().slice(0, 10), ...req.body };
  loadDb().organizations.unshift(org); audit(ctxOf(req).email, `TENANT_PROVISIONED:${org.id}`, org.id, 'organization', org.id, req.ip); persist();
  res.status(201).json({ success: true, data: org });
});
directoryRouter.patch('/tenants/:id/verify', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  const db = loadDb(); const o: any = db.organizations.find((x: any) => x.id === req.params.id);
  if (!o) return res.status(404).json({ success: false, message: 'Not found.' });
  o.verificationStatus = req.body.decision === 'reject' ? 'Rejected' : 'Approved';
  if (o.verificationStatus === 'Approved' && o.accountStatus === 'Invited') o.accountStatus = 'Active';
  o.verifiedAt = nowIso(); o.verifiedBy = ctxOf(req).email;
  audit(ctxOf(req).email, `COMPANY_VERIFIED:${o.id}:${o.verificationStatus}`, o.id, 'organization', o.id, req.ip); persist();
  res.json({ success: true, data: o });
});
directoryRouter.patch('/tenants/:id', requireAuth(['superadmin','platform_owner']), (req, res) => {
  const db = loadDb(); const o: any = db.organizations.find((x: any) => x.id === req.params.id);
  if (!o) return res.status(404).json({ success: false, message: 'Not found.' });
  const b: any = req.body || {};
  for (const k of ['legalName','displayName','entityType','industry','subIndustry','companySize','website','description','countryOfIncorporation','registrationNumber','gstin','taxIds','registeredAddress','headquarters','operatingLocations','logoUrl','primaryContact','primaryContactDesignation','businessEmail','businessPhone','billingContact','financeEmail','plan','seats','accountManager','salesOwner']) {
    if (b[k] !== undefined) o[k] = b[k];
  }
  o.updatedAt = nowIso(); o.updatedBy = ctxOf(req).email;
  audit(ctxOf(req).email, `TENANT_EDITED:${o.id}`, o.id, 'organization', o.id, req.ip); persist();
  res.json({ success: true, data: o });
});
directoryRouter.delete('/tenants/:id', requireAuth(['superadmin','platform_owner']), requirePermission('delete'), (req, res) => {
  const db = loadDb(); const i = db.organizations.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Not found.' });
  const o: any = db.organizations[i];
  const hasDeps = (db.jobs as any[]).some((j) => j.orgId === o.id) || (db.invoices as any[]).some((x) => x.orgId === o.id) || (db.applications as any[]).some((a) => a.orgId === o.id) || (db.placements as any[]).some((p) => p.orgId === o.id);
  if (hasDeps && req.query.force !== 'close') {
    o.accountStatus = 'Closed'; o.closedAt = nowIso(); o.closeReason = String((req.body as any)?.reason || req.query.reason || 'admin-closed');
    audit(ctxOf(req).email, `TENANT_CLOSED:${o.id}`, o.id, 'organization', o.id, req.ip); persist();
    return res.json({ success: true, data: o, message: 'Organization has dependent records — closed instead of deleted.' });
  }
  const [removed] = db.organizations.splice(i, 1);
  audit(ctxOf(req).email, `TENANT_DELETED:${o.id}`, o.id, 'organization', o.id, req.ip); persist();
  res.json({ success: true, data: removed });
});
directoryRouter.patch('/tenants/:id/suspend', requireAuth(['superadmin','platform_owner']), requirePermission('suspend'), (req, res) => {
  const db = loadDb(); const o: any = db.organizations.find((x: any) => x.id === req.params.id);
  if (!o) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!req.body.reason) return res.status(400).json({ success: false, message: 'Suspension reason required.' });
  o.accountStatus = req.body.action === 'reactivate' ? 'Active' : 'Suspended';
  o.suspendReason = req.body.reason; o.suspendedAt = nowIso();
  // Revoke all sessions belonging to this tenant so suspension takes effect now.
  if (o.accountStatus !== 'Active') {
    const emails = new Set(loadDb().users.filter((u: any) => u.tenantId === o.id).map((u: any) => String(u.email).toLowerCase()));
    db.sessions = db.sessions.filter((s: any) => !emails.has(String(s.email).toLowerCase()));
  }
  audit(ctxOf(req).email, `COMPANY_${o.accountStatus.toUpperCase()}:${o.id}`, o.id, 'organization', o.id, req.ip); persist();
  res.json({ success: true, data: o });
});

// Company 360° — the 15 spec tabs served from one audited read
directoryRouter.get('/tenants/:id/360', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  const db = loadDb(); const o: any = db.organizations.find((x: any) => x.id === req.params.id);
  if (!o) return res.status(404).json({ success: false, message: 'Not found.' });
  const id = o.id;
  const jobs = (db.jobs as any[]).filter((j) => j.orgId === id);
  const invoices = (db.invoices as any[]).filter((i) => i.orgId === id).slice(0, 100);
  const commissions = (db.commissions as any[]).filter((x) => x.orgId === id);
  res.json({ success: true, data: {
    organization: o,
    verification: { status: o.verificationStatus || 'Pending', verifiedAt: o.verifiedAt || null, verifiedBy: o.verifiedBy || null, reason: o.suspendReason || null },
    users: (db.users as any[]).filter((u) => u.tenantId === id),
    branches: (db.branches as any[]).filter((b) => b.orgId === id),
    requisitions: (db.requisitions as any[]).filter((r) => r.orgId === id).slice(0, 200),
    jobs: jobs.slice(0, 200),
    applications: (db.applications as any[]).filter((a) => a.orgId === id).slice(0, 200),
    interviews: (db.interviews as any[]).filter((i) => i.companyId === id || i.orgId === id).slice(0, 200),
    subscriptions: (db.subscriptions as any[]).filter((s) => s.orgId === id),
    invoices,
    payments: (db.payments as any[]).filter((p) => p.orgId === id).slice(0, 100),
    commissions: commissions.slice(0, 200),
    payouts: (db.payouts as any[]).filter((p) => commissions.some((c) => c.id === p.commissionId)).slice(0, 100),
    activity: (db.auditLogs as any[]).filter((l) => l.tenantId === id).slice(0, 100),
    computed: {
      activeJobs: jobs.filter((j) => j.status === 'Published').length,
      outstanding: invoices.reduce((a: number, i: any) => a + Number(i.balance || 0), 0),
      commissionsDue: commissions.filter((c: any) => c.approvalStatus === 'Approved' && c.paymentStatus !== 'Paid').length,
    },
  } });
});

// Users (+suspend/reactivate with reassignment note)
directoryRouter.get('/users', requireAuth(['superadmin','platform_owner','operations_admin','sales_admin']), (req, res) => {
  const db = loadDb();
  const { page, pageSize, q } = paginate.parse(req.query);
  let rows = db.users as any[];
  if (q) rows = rows.filter((u) => JSON.stringify(u).toLowerCase().includes(String(q).toLowerCase()));
  // never leak password hashes or MFA secrets — expose only the enabled flag
  rows = rows.map((u) => {
    const { ...safe } = u;
    const cred: any = db.credentials.find((c: any) => c.userId === u.id);
    return { ...safe, mfaEnabled: !!cred?.mfaEnabled };
  });
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
directoryRouter.post('/users', requireAuth(['superadmin','platform_owner']), requirePermission('assign'), async (req: Request, res: Response) => {
  const { name, email, role, tenantId, password, phone, startDate, endDate } = req.body || {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ success: false, message: 'Valid email required.' });
  if (!password || String(password).length < 8) return res.status(400).json({ success: false, message: '8-char password required.' });
  if (!tenantId) return res.status(400).json({ success: false, message: 'tenantId required.' });
  const db = loadDb();
  if (db.users.some((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase())) return res.status(409).json({ success: false, message: 'Exists.' });
  const { hashPassword } = await import('../auth/password.js');
  const user = { id: uid('USR'), name: name || email.split('@')[0], email, role: role || 'employer', tenantId, status: 'Active', invitationStatus: 'Pending', invitedAt: nowIso(), phone: phone || '', startDate: startDate || '', endDate: endDate || '', lastLogin: 'Never' };
  db.users.unshift(user);
  db.credentials.push({ userId: user.id, email: String(email).toLowerCase(), passwordHash: await hashPassword(String(password)), algo: 'bcrypt' });
  audit(ctxOf(req).email, `USER_CREATED:${user.email}`, user.tenantId, 'user', user.id, req.ip); persist();
  res.status(201).json({ success: true, data: user });
});
// Edit user directory record with audit (§6.6)
directoryRouter.put('/users/:id', requireAuth(['superadmin','platform_owner']), requirePermission('assign'), (req: Request, res: Response) => {
  const db = loadDb(); const u: any = db.users.find((x: any) => x.id === req.params.id);
  if (!u) return res.status(404).json({ success: false, message: 'Not found.' });
  const patch = req.body || {};
  for (const k of ['name', 'phone', 'employeeId', 'department', 'designation', 'branch', 'reportingManager', 'role', 'startDate', 'endDate']) {
    if (patch[k] !== undefined) (u as any)[k] = patch[k];
  }
  u.updatedAt = nowIso();
  const cred: any = db.credentials.find((c: any) => c.userId === u.id);
  if (cred && patch.role && ALL_ROLES.includes(patch.role)) { cred.role = patch.role; u.role = patch.role; }
  audit(ctxOf(req).email, `USER_EDITED:${u.email}`, u.tenantId, 'user', u.id, req.ip); persist();
  res.json({ success: true, data: u });
});
directoryRouter.delete('/users/:id', requireAuth(['superadmin','platform_owner']), requirePermission('delete'), (req, res) => {
  const db = loadDb(); const i = db.users.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Not found.' });
  const u: any = db.users[i];
  if (u.role === 'superadmin' || u.role === 'platform_owner') return res.status(422).json({ success: false, message: 'Platform admin accounts cannot be deleted. Suspend instead.' });
  u.status = 'Deleted'; u.statusAt = nowIso(); u.statusReason = String((req.body as any)?.reason || req.query.reason || 'admin-deleted');
  db.sessions = db.sessions.filter((s: any) => s.email !== u.email);
  audit(ctxOf(req).email, `USER_DELETED:${u.email}`, u.tenantId, 'user', u.id, req.ip); persist();
  res.json({ success: true, data: u });
});
// Assigned work per user (§6.6 — companies/jobs/leads + pipeline ownership)
directoryRouter.get('/users/:id/assignments', requireAuth(['superadmin','platform_owner','operations_admin','sales_admin']), (req, res) => {
  const db = loadDb(); const u: any = db.users.find((x: any) => x.id === req.params.id);
  if (!u) return res.status(404).json({ success: false, message: 'Not found.' });
  const em = String(u.email).toLowerCase();
  const is = (v: unknown) => String(v || '').toLowerCase() === em;
  const pick = (rows: any[], pred: (r: any) => boolean, map: (r: any) => any) => rows.filter(pred).slice(0, 20).map(map);
  const org = db.organizations.find((o: any) => o.id === u.tenantId);
  res.json({ success: true, data: {
    companies: org ? [{ id: org.id, name: org.displayName || org.legalName, role: u.role }] : [],
    jobs: pick(db.jobs as any[], (j) => is(j.createdBy) || is(j.hiringManager), (j) => ({ id: j.id, title: j.title, status: j.status })),
    requisitions: pick(db.requisitions as any[], (r) => is(r.createdBy) || is(r.hiringManager) || is(r.recruiter), (r) => ({ id: r.id, title: r.title, status: r.status })),
    leads: pick(db.leads as any[], (l) => is(l.owner), (l) => ({ id: l.id, companyName: l.companyName, stage: l.stage })),
    candidates: pick(db.candidateProfiles as any[], (c) => is(c.assignedRecruiter) || is(c.submittedBy), (c) => ({ id: c.id, name: c.name, stage: c.stage })),
    tasks: pick(db.tasks as any[], (t) => is(t.owner), (t) => ({ id: t.id, title: t.title, status: t.status })),
    interviews: pick(db.interviews as any[], (i) => is(i.interviewer), (i) => ({ id: i.id, candidateName: i.candidateName, status: i.status })),
    targets: pick(db.targets as any[], (t) => is(t.owner), (t) => ({ id: t.id, title: t.period, status: '' })),
    opportunities: pick(db.opportunities as any[], (o) => is(o.owner), (o) => ({ id: o.id, title: o.title, stage: o.stage })),
    meetings: pick(db.meetings as any[], (m) => is(m.owner), (m) => ({ id: m.id, title: m.title, status: '' })),
    counts: {
      companies: org ? 1 : 0,
      jobs: (db.jobs as any[]).filter((j) => is(j.createdBy) || is(j.hiringManager)).length,
      requisitions: (db.requisitions as any[]).filter((r) => is(r.createdBy) || is(r.hiringManager) || is(r.recruiter)).length,
      leads: (db.leads as any[]).filter((l) => is(l.owner)).length,
      candidates: (db.candidateProfiles as any[]).filter((c) => is(c.assignedRecruiter) || is(c.submittedBy)).length,
      tasks: (db.tasks as any[]).filter((t) => is(t.owner)).length,
      interviews: (db.interviews as any[]).filter((i) => is(i.interviewer)).length,
      targets: (db.targets as any[]).filter((t) => is(t.owner)).length,
      opportunities: (db.opportunities as any[]).filter((o) => is(o.owner)).length,
      meetings: (db.meetings as any[]).filter((m) => is(m.owner)).length,
    },
  } });
});
directoryRouter.patch('/users/:id/status', requireAuth(['superadmin','platform_owner']), requirePermission('suspend'), (req, res) => {
  const db = loadDb(); const u: any = db.users.find((x: any) => x.id === req.params.id);
  if (!u) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!req.body.reason) return res.status(400).json({ success: false, message: 'Reason required (actor+timestamp recorded).' });
  u.status = req.body.status === 'Active' ? 'Active' : 'Suspended';
  u.statusReason = req.body.reason; u.statusAt = nowIso();
  // revoke sessions (JWT short-lived; refresh revoked)
  db.sessions = db.sessions.filter((s: any) => s.email !== u.email);
  // Leaver fan-out (§6.6): reassign open work when a successor is named
  const counts: Record<string, number> = {};
  const to = String(req.body.reassignTo || '').trim();
  if (to && u.status !== 'Active') {
    const touch = (coll: any[], ownerKey = 'owner') => {
      let n = 0;
      for (const r of coll) {
        if (String((r as any)[ownerKey] || '').toLowerCase() === u.email.toLowerCase()) { (r as any)[ownerKey] = to; (r as any).reassignedAt = nowIso(); n++; }
      }
      return n;
    };
    counts.leads = touch(db.leads);
    counts.tasks = touch(db.tasks);
    counts.targets = touch(db.targets);
    counts.opportunities = touch(db.opportunities);
    counts.meetings = touch(db.meetings);
    counts.interviews = touch(db.interviews, 'interviewer');
    counts.requisitions = touch(db.requisitions, 'recruiter');
    counts.candidates = touch(db.candidateProfiles, 'assignedRecruiter');
    u.reassignedTo = to;
  }
  audit(ctxOf(req).email, `USER_${u.status.toUpperCase()}:${u.email}`, u.tenantId, 'user', u.id, req.ip); persist();
  res.json({ success: true, data: u, reassigned: to ? { to, counts } : null });
});
// Permission exceptions (§4.2) — explicit per-user grant/revoke over the role template
directoryRouter.get('/permissions', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); const db = loadDb();
  if (['superadmin','platform_owner'].includes(ctx.role)) {
    let rows = db.userRoles as any[];
    if (req.query.email) rows = rows.filter((o) => String(o.email).toLowerCase() === String(req.query.email).toLowerCase());
    return res.json({ success: true, data: rows });
  }
  res.json({ success: true, data: { email: ctx.email, permissions: effectivePermissions(ctx.role, ctx.email) } });
});
directoryRouter.post('/permissions', requireAuth(['superadmin','platform_owner']), requirePermission('manage_permissions'), (req, res) => {
  const { email, permission, effect } = req.body || {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ success: false, message: 'Valid email required.' });
  if (!PERMISSIONS.includes(permission)) return res.status(400).json({ success: false, message: `permission must be one of ${PERMISSIONS.join(', ')}` });
  if (!['grant','revoke'].includes(effect)) return res.status(400).json({ success: false, message: 'effect must be grant|revoke.' });
  const db = loadDb();
  db.userRoles = (db.userRoles as any[]).filter((o) => !(String(o.email).toLowerCase() === String(email).toLowerCase() && o.permission === permission));
  const row = { id: uid('PERM'), email: String(email).toLowerCase(), permission, effect, by: ctxOf(req).email, createdAt: nowIso() };
  db.userRoles.unshift(row);
  audit(ctxOf(req).email, `PERMISSION_${effect.toUpperCase()}:${email}:${permission}`, 'TNT-GLOBAL', 'permission', row.id, req.ip); persist();
  res.status(201).json({ success: true, data: row });
});
directoryRouter.delete('/permissions', requireAuth(['superadmin','platform_owner']), requirePermission('manage_permissions'), (req, res) => {
  const { email, permission } = (req.body || {}) as Record<string, string>;
  const db = loadDb();
  const i = (db.userRoles as any[]).findIndex((o) => String(o.email).toLowerCase() === String(email || '').toLowerCase() && o.permission === permission);
  if (i < 0) return res.status(404).json({ success: false, message: 'Exception not found.' });
  const [removed] = (db.userRoles as any[]).splice(i, 1);
  audit(ctxOf(req).email, `PERMISSION_CLEARED:${email}:${permission}`, 'TNT-GLOBAL', 'permission', removed.id, req.ip); persist();
  res.json({ success: true, data: removed });
});
// Export audit trail (§4.3 — every CSV export is actor-stamped)
directoryRouter.post('/exports/log', requireAuth(), (req, res) => {
  const { resource, count } = req.body || {};
  if (!resource) return res.status(400).json({ success: false, message: 'resource required.' });
  const ctx = ctxOf(req);
  audit(ctx.email, `EXPORT:${resource}x${Number(count || 0)}`, ctx.tenantId, 'export', String(resource), req.ip); persist();
  res.status(201).json({ success: true, message: 'Logged.' });
});

// Branches
directoryRouter.get('/branches', requireAuth(), (req, res) => {
  const t = tenantOf(req); const ctx = ctxOf(req);
  let rows = loadDb().branches as any[];
  if (!['superadmin','platform_owner'].includes(ctx.role)) rows = rows.filter((b) => b.orgId === t);
  res.json({ success: true, data: rows });
});
directoryRouter.post('/branches', requireAuth(['employer','company_admin','superadmin','platform_owner']), (req: Request, res: Response) => {
  const { name, city, orgId } = req.body || {};
  if (!name) return res.status(400).json({ success: false, message: 'Branch name required.' });
  const ctx = ctxOf(req);
  const owner = ['superadmin','platform_owner'].includes(ctx.role) && orgId ? String(orgId) : tenantOf(req);
  const b = { id: uid('BR'), orgId: owner, name: String(name), city: city ? String(city) : '', status: 'Active', createdAt: nowIso() };
  loadDb().branches.unshift(b);
  audit(ctx.email, `BRANCH_CREATED:${b.id}`, owner, 'branch', b.id, req.ip); persist();
  res.status(201).json({ success: true, data: b });
});
directoryRouter.put('/branches/:id', requireAuth(['employer','company_admin','superadmin','platform_owner']), (req: Request, res: Response) => {
  const db = loadDb(); const b: any = db.branches.find((x: any) => x.id === req.params.id);
  if (!b) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && b.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  const body: any = req.body || {};
  for (const k of ['name','city','status']) if (body[k] !== undefined) b[k] = body[k];
  b.updatedAt = nowIso();
  audit(ctx.email, `BRANCH_EDITED:${b.id}`, b.orgId, 'branch', b.id, req.ip); persist();
  res.json({ success: true, data: b });
});
directoryRouter.delete('/branches/:id', requireAuth(['employer','company_admin','superadmin','platform_owner']), (req, res) => {
  const db = loadDb(); const i = db.branches.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Not found.' });
  const b: any = db.branches[i];
  const ctx = ctxOf(req);
  if (!['superadmin','platform_owner'].includes(ctx.role) && b.orgId !== ctx.tenantId) return res.status(404).json({ success: false, message: 'Not found.' });
  const [removed] = db.branches.splice(i, 1);
  audit(ctx.email, `BRANCH_DELETED:${b.id}`, b.orgId, 'branch', b.id, req.ip); persist();
  res.json({ success: true, data: removed });
});
// Support / account-issue tickets (§6.1 Platform → Support)
const TICKET_FLOW: Record<string, string[]> = { Open: ['In Progress','Closed'], 'In Progress': ['Resolved','Closed'], Resolved: ['Closed','In Progress'], Closed: [] };
directoryRouter.get('/support-tickets', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().supportTickets as any[];
  if (!['superadmin','platform_owner','operations_admin','support_admin'].includes(ctx.role)) rows = rows.filter((t) => t.orgId === ctx.tenantId || t.requester === ctx.email);
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
directoryRouter.post('/support-tickets', requireAuth(), (req: Request, res: Response) => {
  const { subject, category, priority, body } = req.body || {};
  if (!subject || !body) return res.status(400).json({ success: false, message: 'subject + body required.' });
  const ctx = ctxOf(req);
  const t = { id: uid('SUP'), orgId: ctx.tenantId, requester: ctx.email, subject: String(subject).slice(0, 160), category: category ? String(category) : 'Account', priority: ['Low','Medium','High'].includes(priority) ? priority : 'Medium', body: String(body).slice(0, 4000), status: 'Open', notes: [], createdAt: nowIso() };
  loadDb().supportTickets.unshift(t);
  audit(ctx.email, `SUPPORT_OPENED:${t.id}`, ctx.tenantId, 'support', t.id, req.ip); persist();
  res.status(201).json({ success: true, data: t });
});
directoryRouter.patch('/support-tickets/:id', requireAuth(['superadmin','platform_owner','operations_admin','support_admin']), (req, res) => {
  const db = loadDb(); const t: any = db.supportTickets.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Not found.' });
  const ctx = ctxOf(req); const body: any = req.body || {};
  if (body.status && !(TICKET_FLOW[t.status] || []).includes(body.status)) return res.status(422).json({ success: false, message: `Invalid transition ${t.status} → ${body.status}.` });
  if (body.status) t.status = body.status;
  if (body.assignee !== undefined) t.assignee = body.assignee;
  if (body.note) (t.notes ||= []).unshift({ by: ctx.email, text: String(body.note).slice(0, 2000), at: nowIso() });
  t.updatedAt = nowIso();
  audit(ctx.email, `SUPPORT_UPDATED:${t.id}->${t.status}`, t.orgId, 'support', t.id, req.ip); persist();
  res.json({ success: true, data: t });
});

// Candidate directory (admin) — masked unless permitted, enriched with counts
const COMPLETENESS_FIELDS = ['name','email','phone','headline','roleTitle','experienceYears','location','country','currentCtc','expectedCtc','noticePeriod','skills','summary','education','availability'];
export function completenessOf(c: any): number {
  if (!c) return 0;
  const filled = COMPLETENESS_FIELDS.filter((f) => String(c[f] ?? '').trim() !== '').length;
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
}
directoryRouter.get('/directory/candidates', requireAuth(['superadmin','platform_owner','operations_admin','support_admin']), (req, res) => {
  const db = loadDb();
  const canSee = ctxOf(req).permissions.includes('view_sensitive_fields');
  const q = req.query as Record<string, string>;
  const appCounts: Record<string, number> = {};
  const latestStage: Record<string, { stage: string; at: string }> = {};
  for (const a of db.applications as any[]) {
    const k = String(a.candidateEmail || '').toLowerCase();
    if (!k) continue;
    appCounts[k] = (appCounts[k] || 0) + 1;
    const at = String(a.updatedAt || a.createdAt || '');
    if (!latestStage[k] || at >= latestStage[k].at) latestStage[k] = { stage: a.stage, at };
  }
  const lastInterview: Record<string, string> = {};
  for (const i of db.interviews as any[]) {
    const k = String(i.candidateEmail || '').toLowerCase();
    const at = String(i.scheduledAt || i.createdAt || '');
    if (k && (!lastInterview[k] || at >= lastInterview[k])) lastInterview[k] = at;
  }
  let rows = (db.candidateProfiles as any[]).map((c) => {
    const base = canSee ? c : { ...c, phone: '**********', currentCtc: 'Restricted' };
    const email = String(c.email || '').toLowerCase();
    const stamps = [c.updatedAt, c.createdAt, latestStage[email]?.at, lastInterview[email]].filter(Boolean).map(String);
    const lastActivity = stamps.length ? stamps.sort()[stamps.length - 1] : null;
    return {
      ...base,
      applicationCount: appCounts[email] || 0,
      completeness: completenessOf(c),
      lastActivity,
      registrationDate: c.createdAt ? String(c.createdAt).slice(0, 10) : null,
      recruiter: c.assignedRecruiter || c.submittedBy || null,
      source: c.source || c.sourceType || null,
      latestStage: latestStage[email]?.stage || null,
    };
  });
  // Spec §6.3 filters — all server-side
  if (q.status) rows = rows.filter((c) => String(c.status || 'Active') === q.status);
  if (q.skills) { const s = q.skills.toLowerCase(); rows = rows.filter((c) => String(Array.isArray(c.skills) ? c.skills.join(' ') : (c.skills || '')).toLowerCase().includes(s)); }
  if (q.expMin !== undefined && q.expMin !== '') rows = rows.filter((c) => Number(c.experienceYears || 0) >= Number(q.expMin));
  if (q.expMax !== undefined && q.expMax !== '') rows = rows.filter((c) => Number(c.experienceYears || 0) <= Number(q.expMax));
  if (q.location) { const s = q.location.toLowerCase(); rows = rows.filter((c) => `${c.location || ''} ${c.preferredLocation || ''} ${c.country || ''}`.toLowerCase().includes(s)); }
  if (q.completeness === 'lt50') rows = rows.filter((c) => c.completeness < 50);
  else if (q.completeness === 'btw50_80') rows = rows.filter((c) => c.completeness >= 50 && c.completeness <= 80);
  else if (q.completeness === 'gt80') rows = rows.filter((c) => c.completeness > 80);
  if (q.stage) rows = rows.filter((c) => c.latestStage === q.stage);
  if (q.registeredFrom) rows = rows.filter((c) => String(c.createdAt || '') >= q.registeredFrom);
  if (q.registeredTo) rows = rows.filter((c) => String(c.createdAt || '') <= q.registeredTo + 'T23:59:59');
  if (q.source) { const s = q.source.toLowerCase(); rows = rows.filter((c) => String(c.source || c.sourceType || '').toLowerCase().includes(s)); }
  if (q.recruiter) { const s = q.recruiter.toLowerCase(); rows = rows.filter((c) => `${c.assignedRecruiter || ''} ${c.submittedBy || ''}`.toLowerCase().includes(s)); }
  if (q.q) { const s = q.q.toLowerCase(); rows = rows.filter((c) => `${c.id} ${c.name} ${c.email} ${c.roleTitle}`.toLowerCase().includes(s)); }
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
// Candidate 360° — the 12 spec tabs served from one audited read
directoryRouter.get('/directory/candidates/:id/360', requireAuth(['superadmin','platform_owner','operations_admin','candidate']), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const c: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  if (ctx.role === 'candidate' && String(c.email).toLowerCase() !== ctx.email.toLowerCase()) return res.status(404).json({ success: false, message: 'Not found.' });
  const canSee = ctx.permissions.includes('view_sensitive_fields') || ctx.role === 'candidate';
  const email = String(c.email || '').toLowerCase();
  const apps = (db.applications as any[]).filter((a) => String(a.candidateEmail).toLowerCase() === email);
  const appIds = new Set(apps.map((a) => a.id));
  res.json({ success: true, data: {
    profile: canSee ? { ...c, completeness: completenessOf(c) } : { ...c, phone: '**********', currentCtc: 'Restricted', completeness: completenessOf(c) },
    completeness: completenessOf(c),
    applications: apps.slice(0, 200),
    stageHistory: (db.stageHistory as any[]).filter((h) => appIds.has(h.applicationId)).slice(0, 200),
    interviews: (db.interviews as any[]).filter((i) => String(i.candidateEmail || '').toLowerCase() === email).slice(0, 200),
    documents: (db.documents as any[]).filter((d) => String(d.ownerEmail || '').toLowerCase() === email).map(({ ...d }) => d).slice(0, 100),
    consents: (db.consents as any[]).filter((x) => String(x.email).toLowerCase() === email),
    infoRequests: (db.candidateInfoRequests as any[]).filter((r) => r.candidateId === c.id).slice(0, 100),
    deletionRequests: (db.privacyRequests as any[]).filter((r) => r.candidateId === c.id).slice(0, 100),
    activity: (db.auditLogs as any[]).filter((l) => l.recordId === c.id || String(l.actor).toLowerCase() === email).slice(0, 100),
  } });
});

// Candidate directory admin edit + account status (suspend/block/restore)
directoryRouter.put('/directory/candidates/:id', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  const db = loadDb(); const c: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  const b: any = req.body || {};
  for (const k of ['name','email','phone','headline','roleTitle','experienceYears','location','preferredLocation','country','currentCtc','expectedCtc','noticePeriod','skills','summary','education','certifications','visibility','stage','assignedRecruiter','source']) {
    if (b[k] !== undefined) c[k] = b[k];
  }
  c.updatedAt = nowIso();
  audit(ctxOf(req).email, `CANDIDATE_EDITED:${c.id}`, 'TNT-GLOBAL', 'candidate', c.id, req.ip); persist();
  res.json({ success: true, data: c });
});
directoryRouter.patch('/directory/candidates/:id/status', requireAuth(['superadmin','platform_owner']), requirePermission('suspend'), (req, res) => {
  const db = loadDb(); const c: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!req.body.reason) return res.status(400).json({ success: false, message: 'Reason required.' });
  const s = String(req.body.status);
  if (!['Active','Suspended','Blocked'].includes(s)) return res.status(400).json({ success: false, message: 'Status must be Active|Suspended|Blocked.' });
  const from = c.status; c.status = s; c.statusReason = String(req.body.reason); c.statusAt = nowIso();
  if (req.body.reviewDate) c.statusReviewDate = String(req.body.reviewDate).slice(0, 10);
  else delete c.statusReviewDate;
  // Revoke candidate sessions where suspension must take effect immediately
  let sessionsRevoked = 0;
  if (s !== 'Active' && c.email) {
    const before = db.sessions.length;
    db.sessions = db.sessions.filter((x: any) => String(x.email).toLowerCase() !== String(c.email).toLowerCase());
    sessionsRevoked = before - db.sessions.length;
  }
  audit(ctxOf(req).email, `CANDIDATE_${s.toUpperCase()}:${c.id} ${from}->${s}`, 'TNT-GLOBAL', 'candidate', c.id, req.ip); persist();
  res.json({ success: true, data: c, sessionsRevoked });
});
// Soft delete (status Deleted) + guarded permanent deletion (§6.3)
directoryRouter.delete('/directory/candidates/:id', requireAuth(['superadmin','platform_owner']), requirePermission('delete'), (req, res) => {
  const db = loadDb(); const c: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  if (c.status === 'Deleted') return res.status(409).json({ success: false, message: 'Candidate already soft-deleted. Use permanent deletion to purge.' });
  const reason = String((req.body as any)?.reason || req.query.reason || '');
  if (!reason) return res.status(400).json({ success: false, message: 'Deletion reason required.' });
  c.status = 'Deleted'; c.statusReason = reason; c.statusAt = nowIso(); c.visibility = 'private'; c.updatedAt = nowIso();
  audit(ctxOf(req).email, `CANDIDATE_DELETED:${c.id}`, 'TNT-GLOBAL', 'candidate', c.id, req.ip); persist();
  res.json({ success: true, data: c });
});
directoryRouter.delete('/directory/candidates/:id/permanent', requireAuth(['superadmin','platform_owner']), requirePermission('delete'), (req, res) => {
  const db = loadDb(); const i = db.candidateProfiles.findIndex((x: any) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: 'Not found.' });
  const c: any = db.candidateProfiles[i];
  if (c.status !== 'Deleted') return res.status(422).json({ success: false, message: 'Soft-delete first. Permanent purge requires status Deleted.' });
  const email = String(c.email || '').toLowerCase();
  const blockers: string[] = [];
  const nApps = (db.applications as any[]).filter((a) => String(a.candidateEmail).toLowerCase() === email).length;
  const nIvs = (db.interviews as any[]).filter((x) => String(x.candidateEmail).toLowerCase() === email).length;
  const nPlc = (db.placements as any[]).filter((x) => String(x.candidateEmail).toLowerCase() === email).length;
  const nCom = (db.commissions as any[]).filter((x) => String(x.candidateEmail).toLowerCase() === email).length;
  if (nApps) blockers.push(`${nApps} application(s)`);
  if (nIvs) blockers.push(`${nIvs} interview(s)`);
  if (nPlc) blockers.push(`${nPlc} placement(s)`);
  if (nCom) blockers.push(`${nCom} commission record(s)`);
  if (blockers.length > 0) return res.status(422).json({ success: false, message: `Legally required records preserved: ${blockers.join(', ')}. Use anonymized deletion request instead.` });
  const [removed] = db.candidateProfiles.splice(i, 1);
  db.documents = (db.documents as any[]).filter((d) => String(d.ownerEmail || '').toLowerCase() !== email);
  // Consents + audit trail are preserved as deletion evidence.
  audit(ctxOf(req).email, `CANDIDATE_PURGED:${c.id}`, 'TNT-GLOBAL', 'candidate', c.id, req.ip); persist();
  res.json({ success: true, data: { id: removed.id } });
});
// Information requests (§6.3 — ask the candidate for more data, tracked)
directoryRouter.get('/directory/candidates/:id/info-requests', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  if (!loadDb().candidateProfiles.some((x: any) => x.id === req.params.id)) return res.status(404).json({ success: false, message: 'Not found.' });
  res.json({ success: true, data: (loadDb().candidateInfoRequests as any[]).filter((r) => r.candidateId === req.params.id) });
});
directoryRouter.post('/directory/candidates/:id/info-requests', requireAuth(['superadmin','platform_owner','operations_admin']), (req: Request, res: Response) => {
  const db = loadDb(); const c: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  const { message } = req.body || {};
  if (!message || !String(message).trim()) return res.status(400).json({ success: false, message: 'message required.' });
  const row = { id: uid('INFO'), candidateId: c.id, email: c.email, message: String(message).slice(0, 2000), status: 'Open', by: ctxOf(req).email, createdAt: nowIso() };
  db.candidateInfoRequests.unshift(row);
  db.notifications.unshift({ id: uid('NOTIF'), recipient: c.email, kind: 'info-request', body: `NexaTalent needs more information: ${String(message).slice(0, 140)}`, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId: 'TNT-GLOBAL' });
  audit(ctxOf(req).email, `CANDIDATE_INFO_REQUESTED:${c.id}`, 'TNT-GLOBAL', 'candidate', c.id, req.ip); persist();
  res.status(201).json({ success: true, data: row });
});
directoryRouter.patch('/directory/candidates/:id/info-requests/:reqId', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  const db = loadDb();
  const r: any = (db.candidateInfoRequests as any[]).find((x) => x.id === req.params.reqId && x.candidateId === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Not found.' });
  const s = String(req.body.status);
  if (!['Open','Responded','Closed'].includes(s)) return res.status(400).json({ success: false, message: 'Status must be Open|Responded|Closed.' });
  r.status = s; r.updatedAt = nowIso();
  audit(ctxOf(req).email, `CANDIDATE_INFO_${s.toUpperCase()}:${r.candidateId}`, 'TNT-GLOBAL', 'candidate', r.candidateId, req.ip); persist();
  res.json({ success: true, data: r });
});
// Privacy deletion requests (§6.3 — approve anonymizes PII, preserves financial/audit records)
directoryRouter.get('/directory/candidates/:id/deletion-requests', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  if (!loadDb().candidateProfiles.some((x: any) => x.id === req.params.id)) return res.status(404).json({ success: false, message: 'Not found.' });
  res.json({ success: true, data: (loadDb().privacyRequests as any[]).filter((r) => r.candidateId === req.params.id) });
});
directoryRouter.post('/directory/candidates/:id/deletion-request', requireAuth(['superadmin','platform_owner']), (req: Request, res: Response) => {
  const db = loadDb(); const c: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  const { reason } = req.body || {};
  if (!reason || !String(reason).trim()) return res.status(400).json({ success: false, message: 'reason required.' });
  if ((db.privacyRequests as any[]).some((r) => r.candidateId === c.id && r.status === 'Pending')) {
    return res.status(409).json({ success: false, message: 'A deletion request is already pending for this candidate.' });
  }
  const row = { id: uid('PRV'), candidateId: c.id, email: c.email, type: 'deletion', reason: String(reason).slice(0, 2000), status: 'Pending', by: ctxOf(req).email, createdAt: nowIso() };
  db.privacyRequests.unshift(row);
  audit(ctxOf(req).email, `CANDIDATE_DELETION_REQUESTED:${c.id}`, 'TNT-GLOBAL', 'candidate', c.id, req.ip); persist();
  res.status(201).json({ success: true, data: row });
});
directoryRouter.patch('/directory/candidates/:id/deletion-requests/:reqId', requireAuth(['superadmin','platform_owner']), (req, res) => {
  const db = loadDb();
  const r: any = (db.privacyRequests as any[]).find((x) => x.id === req.params.reqId && x.candidateId === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Not found.' });
  if (r.status !== 'Pending') return res.status(422).json({ success: false, message: `Request already ${r.status}.` });
  const decision = String(req.body.decision);
  if (!['approve','reject'].includes(decision)) return res.status(400).json({ success: false, message: 'decision must be approve|reject.' });
  const ctx = ctxOf(req);
  r.status = decision === 'approve' ? 'Approved' : 'Rejected';
  r.decidedBy = ctx.email; r.decidedAt = nowIso(); r.note = String(req.body.note || '').slice(0, 1000);
  let anonymized: any = null;
  if (decision === 'approve') {
    const c: any = db.candidateProfiles.find((x: any) => x.id === r.candidateId);
    if (c) {
      // Anonymize direct identifiers; keep email + IDs so applications, interviews,
      // placements, commissions and audit history stay lawfully linked.
      c.name = 'Deleted User';
      c.phone = ''; c.headline = ''; c.location = ''; c.preferredLocation = ''; c.country = '';
      c.summary = ''; c.objectives = ''; c.skills = ''; c.education = ''; c.certifications = '';
      c.projects = ''; c.links = {}; c.resumeRef = ''; c.currentCtc = ''; c.expectedCtc = '';
      c.visibility = 'private'; c.status = 'Deleted'; c.statusReason = `deletion-request ${r.id}`; c.statusAt = nowIso();
      c.anonymizedAt = nowIso(); c.updatedAt = nowIso();
      anonymized = { id: c.id, status: c.status };
      const con: any = db.consents.find((x: any) => String(x.email).toLowerCase() === String(c.email).toLowerCase());
      if (con) { con.marketing = false; con.withdrawn = true; con.withdrawnAt = nowIso(); }
    }
  }
  audit(ctx.email, `CANDIDATE_DELETION_${r.status.toUpperCase()}:${r.candidateId}`, 'TNT-GLOBAL', 'candidate', r.candidateId, req.ip); persist();
  res.json({ success: true, data: { request: r, anonymized } });
});
// Audit logs with filters
directoryRouter.get('/audit-logs', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  let rows = loadDb().auditLogs as any[];
  if (req.query.actor) rows = rows.filter((l) => String(l.actor).includes(String(req.query.actor)));
  if (req.query.action) rows = rows.filter((l) => String(l.action).includes(String(req.query.action)));
  const { page, pageSize } = paginate.parse(req.query);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});

// Notifications + prefs + delivery log
directoryRouter.get('/notifications', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().notifications as any[];
  if (!['superadmin','platform_owner'].includes(ctx.role)) rows = rows.filter((n) => n.recipient === ctx.email || String(n.recipient).includes(ctx.tenantId));
  res.json({ success: true, data: rows.slice(0, 100) });
});
directoryRouter.get('/notifications/prefs', requireAuth(), (req, res) => {
  res.json({ success: true, data: (loadDb().notificationPrefs as any[]).filter((p) => p.email === ctxOf(req).email) });
});
directoryRouter.put('/notifications/prefs', requireAuth(), (req, res) => {
  const db = loadDb(); const me = ctxOf(req).email;
  const row = { id: uid('NP'), email: me, inApp: req.body.inApp !== false, emailCh: req.body.email !== false, updatedAt: nowIso() };
  const i = db.notificationPrefs.findIndex((p: any) => p.email === me);
  if (i >= 0) db.notificationPrefs[i] = { ...db.notificationPrefs[i], ...row };
  else db.notificationPrefs.unshift(row);
  persist(); res.json({ success: true, data: row });
});
directoryRouter.patch('/notifications/:id/read', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const n: any = db.notifications.find((x: any) => x.id === req.params.id);
  if (!n) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!['superadmin','platform_owner'].includes(ctx.role) && n.recipient !== ctx.email && !String(n.recipient).includes(ctx.tenantId)) return res.status(404).json({ success: false, message: 'Not found.' });
  n.status = 'read'; n.readAt = nowIso(); persist();
  res.json({ success: true, data: n });
});

// Reports (§6.14) with definitions + freshness
directoryRouter.get('/reports/:name', requireAuth(['superadmin','platform_owner','operations_admin','finance_admin','sales_admin','employee']), (req, res) => {
  const db = loadDb(); const name = req.params.name;
  const defs: Record<string, any> = {
    'candidate-pipeline': { definition: 'Count of application records by stage (unique applications).', data: stageCounts(db.applications) },
    'requisition-ageing': { definition: 'Open requisitions by days since creation.', data: db.requisitions.filter((r: any) => ['Sourcing','Approved'].includes(r.status)).map((r: any) => ({ id: r.id, title: r.title, daysOpen: Math.max(0, Math.round((Date.now() - new Date(r.createdAt).getTime()) / 864e5)) })) },
    'receivables': { definition: 'Invoices with balance>0 and past due date = overdue.', data: db.invoices.map((i: any) => ({ id: i.id, number: i.number, balance: i.balance, status: i.balance > 0 && new Date(i.dueDate) < new Date() ? 'Overdue' : i.status })) },
    'commission-liabilities': { definition: 'Approved commissions not yet settled.', data: db.commissions.filter((c: any) => c.approvalStatus === 'Approved' && c.paymentStatus !== 'Paid') },
    'sales-pipeline': { definition: 'Leads by stage with pipeline value.', data: stageCounts(db.leads.map((l: any) => ({ stage: l.stage }))) },
    'recruiter-workload': { definition: 'Open applications + interviews per org.', data: { openApplications: db.applications.filter((a: any) => !['Hired','Rejected','Withdrawn'].includes(a.stage)).length, scheduledInterviews: db.interviews.filter((i: any) => i.status === 'Scheduled').length } },
    'interview-offer': { definition: 'Scheduled (non-cancelled) interviews vs offers issued = interview-to-offer conversion.', data: interviewOffer(db) },
    'offer-joining': { definition: 'Offers issued vs placements joined = offer-to-joining conversion + avg days offer to joining.', data: offerJoining(db) },
    'company-hiring': { definition: 'Per-organization funnel: requisitions, published jobs, applications, placements.', data: companyHiring(db) },
    'subscription-revenue': { definition: 'Subscriptions by status/plan with contracted monthly value (price minus discount, live non-ended subscriptions).', data: subscriptionRevenue(db) },
    'agency-performance': { definition: 'Per-agency verification, submissions and signed agreements.', data: agencyPerformance(db) },
    'duplicates': { definition: 'Candidate emails and job+candidate pairs appearing more than once.', data: duplicates(db) },
  };
  const r = defs[name];
  if (!r) return res.status(404).json({ success: false, message: 'Unknown report. Try candidate-pipeline|requisition-ageing|receivables|commission-liabilities|sales-pipeline|recruiter-workload|interview-offer|offer-joining|company-hiring|subscription-revenue|agency-performance|duplicates' });
  res.json({ success: true, data: { ...r, generatedAt: nowIso(), freshness: 'live' } });
});
function stageCounts(rows: any[]): any {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.stage] = (m[r.stage] || 0) + 1;
  return m;
}
// ---- Derived reports (§6.14): computed live from source collections, never stored ----
function interviewOffer(db: any): any {
  const byStatus: Record<string, number> = {};
  for (const i of db.interviews as any[]) byStatus[i.status] = (byStatus[i.status] || 0) + 1;
  const scheduled = (db.interviews as any[]).filter((i: any) => i.status !== 'Cancelled').length;
  const offersIssued = (db.offers as any[]).length;
  return { byStatus, scheduledInterviews: scheduled, offersIssued, conversionRate: scheduled > 0 ? +(offersIssued / scheduled).toFixed(3) : 0 };
}
function offerJoining(db: any): any {
  const offers = db.offers as any[]; const placements = db.placements as any[];
  const offerByApp: Record<string, any> = {};
  for (const o of offers) if (!offerByApp[o.applicationId]) offerByApp[o.applicationId] = o;
  let matched = 0; let daySum = 0;
  for (const p of placements) {
    const o = offerByApp[p.applicationId];
    if (o && o.createdAt && p.joinDate) {
      const d = (new Date(p.joinDate).getTime() - new Date(o.createdAt).getTime()) / 864e5;
      if (Number.isFinite(d) && d >= 0) { matched += 1; daySum += d; }
    }
  }
  return { offersIssued: offers.length, placementsJoined: placements.length, conversionRate: offers.length > 0 ? +(placements.length / offers.length).toFixed(3) : 0, avgDaysOfferToJoin: matched > 0 ? +((daySum / matched).toFixed(1)) : 0, matchedPairs: matched };
}
function companyHiring(db: any): any {
  return (db.organizations as any[])
    .filter((o: any) => o.id !== 'TNT-GLOBAL')
    .map((o: any) => ({
      orgId: o.id, name: o.displayName || o.legalName,
      requisitions: (db.requisitions as any[]).filter((r: any) => r.orgId === o.id).length,
      publishedJobs: (db.jobs as any[]).filter((j: any) => j.orgId === o.id && j.status === 'Published').length,
      applications: (db.applications as any[]).filter((a: any) => a.orgId === o.id).length,
      placements: (db.placements as any[]).filter((p: any) => p.orgId === o.id).length,
    }));
}
function subscriptionRevenue(db: any): any {
  const live = (db.subscriptions as any[]).filter((s: any) => !['Cancelled', 'Expired'].includes(s.status));
  const byStatus: Record<string, number> = {}; const byPlan: Record<string, { count: number; contractedMonthly: number }> = {};
  let total = 0;
  for (const s of live) {
    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
    const val = Math.max(0, Number(s.price || 0) - Number(s.discount || 0));
    total += val;
    const p = byPlan[s.planId] || { count: 0, contractedMonthly: 0 };
    p.count += 1; p.contractedMonthly += val; byPlan[s.planId] = p;
  }
  return { liveSubscriptions: live.length, byStatus, byPlan, contractedMonthly: total };
}
function agencyPerformance(db: any): any {
  return (db.agencyProfiles as any[]).map((a: any) => ({
    id: a.id, name: a.displayName || a.legalName, verificationStatus: a.verificationStatus, accountStatus: a.accountStatus,
    submissions: ((db as any).submissions as any[] || []).filter((s: any) => (a.tenantId && s.agencyId === a.tenantId) || (s.submittedBy && a.contactEmail && String(s.submittedBy).toLowerCase() === String(a.contactEmail).toLowerCase())).length,
    agreements: (db.commissionAgreements as any[]).filter((x: any) => (a.tenantId && (x.agencyId === a.tenantId || x.orgId === a.tenantId))).length,
  }));
}
function duplicates(db: any): any {
  const byEmail: Record<string, string[]> = {};
  for (const c of db.candidateProfiles as any[]) {
    const e = String(c.email || '').toLowerCase().trim();
    if (!e) continue;
    byEmail[e] = byEmail[e] || []; byEmail[e].push(c.id);
  }
  const byApp: Record<string, string[]> = {};
  for (const a of db.applications as any[]) {
    const k = `${a.jobId}|${String(a.candidateEmail || '').toLowerCase().trim()}`;
    byApp[k] = byApp[k] || []; byApp[k].push(a.id);
  }
  return {
    candidateEmails: Object.entries(byEmail).filter(([, ids]) => ids.length > 1).map(([email, ids]) => ({ email, ids, count: ids.length })),
    applications: Object.entries(byApp).filter(([, ids]) => ids.length > 1).map(([key, ids]) => { const [jobId, candidateEmail] = key.split('|'); return { jobId, candidateEmail, ids, count: ids.length }; }),
  };
}

// Settings + tasks + company profile + contractors/compliance (compat)
directoryRouter.get('/settings', requireAuth(['superadmin','platform_owner']), (_req, res) => res.json({ success: true, data: loadDb().settings }));
directoryRouter.post('/settings', requireAuth(['superadmin','platform_owner']), (req, res) => {
  const db = loadDb(); db.settings = { ...db.settings, ...req.body };
  audit(ctxOf(req).email, 'PLATFORM_SECURITY_SETTINGS_UPDATED', 'TNT-GLOBAL', 'settings', '-', req.ip); persist();
  res.json({ success: true, data: db.settings });
});
directoryRouter.get('/tasks', requireAuth(), (req, res) => {
  const ctx = ctxOf(req); let rows = loadDb().tasks as any[];
  if (['employee','bda'].includes(ctx.role)) rows = rows.filter((t) => !t.owner || t.owner === ctx.email);
  res.json({ success: true, data: rows });
});
directoryRouter.patch('/tasks/:id', requireAuth(), (req, res) => {
  const db = loadDb(); const ctx = ctxOf(req);
  const t: any = db.tasks.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Not found.' });
  if (!['superadmin','platform_owner','operations_admin'].includes(ctx.role) && t.owner && t.owner !== ctx.email) return res.status(404).json({ success: false, message: 'Not found.' });
  if (req.body.status && !['Pending','In Progress','Completed','Cancelled'].includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid status.' });
  t.status = req.body.status || t.status; t.updatedAt = nowIso(); persist(); res.json({ success: true, data: t });
});
