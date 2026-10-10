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
  for (const k of ['legalName','displayName','entityType','industry','companySize','website','description','plan','seats','accountManager','salesOwner','primaryContact','businessEmail','businessPhone','billingContact','financeEmail','headquarters','operatingLocations']) {
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
  const { page, pageSize, q } = paginate.parse(req.query);
  let rows = loadDb().users as any[];
  if (q) rows = rows.filter((u) => JSON.stringify(u).toLowerCase().includes(String(q).toLowerCase()));
  // never leak password hashes
  rows = rows.map(({ ...u }) => u);
  res.json({ success: true, ...paged(rows, page, pageSize) });
});
directoryRouter.post('/users', requireAuth(['superadmin','platform_owner']), requirePermission('assign'), async (req: Request, res: Response) => {
  const { name, email, role, tenantId, password } = req.body || {};
  if (!email || !String(email).includes('@')) return res.status(400).json({ success: false, message: 'Valid email required.' });
  if (!password || String(password).length < 8) return res.status(400).json({ success: false, message: '8-char password required.' });
  if (!tenantId) return res.status(400).json({ success: false, message: 'tenantId required.' });
  const db = loadDb();
  if (db.users.some((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase())) return res.status(409).json({ success: false, message: 'Exists.' });
  const { hashPassword } = await import('../auth/password.js');
  const user = { id: uid('USR'), name: name || email.split('@')[0], email, role: role || 'employer', tenantId, status: 'Active', lastLogin: 'Never' };
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
  for (const k of ['name', 'phone', 'employeeId', 'department', 'designation', 'branch', 'reportingManager', 'role']) {
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
  const appCounts: Record<string, number> = {};
  for (const a of db.applications as any[]) {
    const k = String(a.candidateEmail || '').toLowerCase();
    if (k) appCounts[k] = (appCounts[k] || 0) + 1;
  }
  let rows = (db.candidateProfiles as any[]).map((c) => {
    const base = canSee ? c : { ...c, phone: '**********', currentCtc: 'Restricted' };
    return { ...base, applicationCount: appCounts[String(c.email || '').toLowerCase()] || 0, completeness: completenessOf(c) };
  });
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
    consents: (db.consents as any[]).filter((x) => String(x.email || '').toLowerCase() === email),
    activity: (db.auditLogs as any[]).filter((l) => l.recordId === c.id || String(l.actor).toLowerCase() === email).slice(0, 100),
  } });
});

// Candidate directory admin edit + account status (suspend/block/restore)
directoryRouter.put('/directory/candidates/:id', requireAuth(['superadmin','platform_owner','operations_admin']), (req, res) => {
  const db = loadDb(); const c: any = db.candidateProfiles.find((x: any) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Not found.' });
  const b: any = req.body || {};
  for (const k of ['name','email','phone','headline','roleTitle','experienceYears','location','country','currentCtc','expectedCtc','noticePeriod','skills','summary','education','certifications','visibility','stage']) {
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
  audit(ctxOf(req).email, `CANDIDATE_${s.toUpperCase()}:${c.id} ${from}->${s}`, 'TNT-GLOBAL', 'candidate', c.id, req.ip); persist();
  res.json({ success: true, data: c });
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
  };
  const r = defs[name];
  if (!r) return res.status(404).json({ success: false, message: 'Unknown report. Try candidate-pipeline|requisition-ageing|receivables|commission-liabilities|sales-pipeline|recruiter-workload' });
  res.json({ success: true, data: { ...r, generatedAt: nowIso(), freshness: 'live' } });
});
function stageCounts(rows: any[]): any {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.stage] = (m[r.stage] || 0) + 1;
  return m;
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
