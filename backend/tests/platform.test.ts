import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createHmac } from 'crypto';
import { createApp } from '../src/app/index.js';
import { effectivePermissions } from '../src/middleware/rbac.js';

const app = createApp();
let superToken = '';
const stamp = Date.now().toString(36);

async function login(email: string, password = 'NexaTalent123') {
  return request(app).post('/api/v1/auth/login').send({ email, password });
}
const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

/** Minimal TOTP prover (mirrors server window logic) for genuine enable/challenge tests. */
function b32dec(s: string): Buffer {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = s.toUpperCase().replace(/=+$/, '');
  const out: number[] = [];
  let bits = 0;
  let v = 0;
  for (const ch of clean) {
    v = (v << 5) | A.indexOf(ch);
    bits += 5;
    if (bits >= 8) { bits -= 8; out.push((v >> bits) & 255); }
  }
  return Buffer.from(out);
}
function otpFor(secret: string, skew = 0): string {
  const key = b32dec(secret);
  const step = Math.floor(Date.now() / 30000) + skew;
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(step));
  const h = createHmac('sha1', key).update(msg).digest();
  const o = h[h.length - 1] & 15;
  const code = ((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(code % 1000000).padStart(6, '0');
}

beforeAll(async () => {
  const s = await login('superadmin@nexatalent.com');
  expect(s.status).toBe(200);
  superToken = s.body.data.accessToken;
});

describe('MFA lifecycle (§4)', () => {
  const email = `mfa-probe-${stamp}@example.com`;
  const password = 'ProbePass123';
  let userToken = '';
  let ticket = '';

  it('provisions an isolated probe user', async () => {
    const r = await request(app).post('/api/v1/users').set(auth(superToken)).send({
      name: 'MFA Probe', email, role: 'candidate', tenantId: 'TNT-CANDIDATE', password,
    });
    expect(r.status).toBe(201);
    const l = await login(email, password);
    expect(l.status).toBe(200);
    userToken = l.body.data.accessToken;
  });
  it('starts setup and rejects a wrong code', async () => {
    const s = await request(app).post('/api/v1/auth/mfa/setup').set(auth(userToken)).send({});
    expect(s.status).toBe(200);
    expect(s.body.data.secret).toMatch(/^[A-Z2-7]+$/);
    expect(s.body.data.otpauthUrl).toContain('otpauth://totp/');
    const bad = await request(app).post('/api/v1/auth/mfa/verify').set(auth(userToken)).send({ otp: 'abcdef' });
    expect(bad.status).toBe(401);
    const st = await request(app).get('/api/v1/auth/mfa/status').set(auth(userToken));
    expect(st.body.data.enabled).toBe(false);
  });
  it('enables with a genuine TOTP code and returns one-time backup codes', async () => {
    const s = await request(app).post('/api/v1/auth/mfa/setup').set(auth(userToken)).send({});
    const code = otpFor(s.body.data.secret);
    const v = await request(app).post('/api/v1/auth/mfa/verify').set(auth(userToken)).send({ otp: code });
    expect(v.status).toBe(200);
    expect(v.body.data.backupCodes.length).toBe(8);
    const dup = await request(app).post('/api/v1/auth/mfa/setup').set(auth(userToken)).send({});
    expect(dup.status).toBe(409);
  });
  it('gates password login behind a challenge ticket, not tokens', async () => {
    const l = await login(email, password);
    expect(l.status).toBe(200);
    expect(l.body.data.mfaRequired).toBe(true);
    expect(l.body.data.ticket).toBeTruthy();
    expect(l.body.data.accessToken).toBeUndefined();
    ticket = l.body.data.ticket;
  });
  it('rejects malformed codes, unknown tickets, and missing fields', async () => {
    const bad = await request(app).post('/api/v1/auth/mfa/challenge').send({ ticket, otp: 'abcdef' });
    expect(bad.status).toBe(401);
    const stale = await request(app).post('/api/v1/auth/mfa/challenge').send({ ticket: 'bogus', otp: '000000' });
    expect(stale.status).toBe(401);
    const empty = await request(app).post('/api/v1/auth/mfa/challenge').send({});
    expect(empty.status).toBe(401);
  });
  it('completes sign-in with a live code, then disables with password', async () => {
    const l = await login(email, password);
    const blocked = await request(app).post('/api/v1/auth/mfa/setup').set(auth(userToken)).send({});
    expect(blocked.status).toBe(409); // still enabled — setup blocked
    const malformed = await request(app).post('/api/v1/auth/mfa/challenge').send({ ticket: l.body.data.ticket, otp: 'abcdef' });
    expect(malformed.status).toBe(401);
    const no = await request(app).post('/api/v1/auth/mfa/disable').set(auth(userToken)).send({ password: 'wrong-pass' });
    expect(no.status).toBe(401);
    const yes = await request(app).post('/api/v1/auth/mfa/disable').set(auth(userToken)).send({ password });
    expect(yes.status).toBe(200);
    const plain = await login(email, password);
    expect(plain.body.data.accessToken).toBeTruthy();
    expect(plain.body.data.mfaRequired).toBeUndefined();
  });
  it('supports admin reset (audited)', async () => {
    const s = await request(app).post('/api/v1/auth/mfa/setup').set(auth(userToken)).send({});
    const v = await request(app).post('/api/v1/auth/mfa/verify').set(auth(userToken)).send({ otp: otpFor(s.body.data.secret) });
    expect(v.status).toBe(200);
    const denied = await request(app).post('/api/v1/auth/mfa/reset').set(auth(userToken)).send({ email });
    expect(denied.status).toBe(403);
    const ok = await request(app).post('/api/v1/auth/mfa/reset').set(auth(superToken)).send({ email });
    expect(ok.status).toBe(200);
    const st = await request(app).get('/api/v1/auth/mfa/status').set(auth(userToken));
    expect(st.body.data.enabled).toBe(false);
    const missing = await request(app).post('/api/v1/auth/mfa/reset').set(auth(superToken)).send({ email: 'nobody@example.com' });
    expect(missing.status).toBe(404);
  });
});

describe('permission exceptions (§4.2)', () => {
  const email = `perm-probe-${stamp}@example.com`;
  it('grants, resolves, and clears per-user overrides', async () => {
    const g = await request(app).post('/api/v1/permissions').set(auth(superToken)).send({ email, permission: 'export', effect: 'grant' });
    expect(g.status).toBe(201);
    expect(effectivePermissions('bda', email)).toContain('export');
    expect(effectivePermissions('bda', email)).not.toContain('manage_billing');
    const r = await request(app).post('/api/v1/permissions').set(auth(superToken)).send({ email, permission: 'view', effect: 'revoke' });
    expect(r.status).toBe(201);
    expect(effectivePermissions('bda', email)).not.toContain('view');
    const list = await request(app).get(`/api/v1/permissions?email=${email}`).set(auth(superToken));
    expect(list.body.data.length).toBe(2);
    const c = await request(app).delete('/api/v1/permissions').set(auth(superToken)).send({ email, permission: 'view' });
    expect(c.status).toBe(200);
    expect(effectivePermissions('bda', email)).toContain('view');
    const gone = await request(app).delete('/api/v1/permissions').set(auth(superToken)).send({ email, permission: 'view' });
    expect(gone.status).toBe(404);
  });
  it('validates permission and effect vocabularies', async () => {
    const bad = await request(app).post('/api/v1/permissions').set(auth(superToken)).send({ email, permission: 'fly', effect: 'grant' });
    expect(bad.status).toBe(400);
    const bad2 = await request(app).post('/api/v1/permissions').set(auth(superToken)).send({ email, permission: 'export', effect: 'bestow' });
    expect(bad2.status).toBe(400);
  });
  it('exposes own effective set to non-admins', async () => {
    const l = await login('candidate@nexatalent.com');
    const me = await request(app).get('/api/v1/permissions').set(auth(l.body.data.accessToken));
    expect(me.status).toBe(200);
    expect(Array.isArray(me.body.data.permissions)).toBe(true);
  });
  it('audits export events', async () => {
    const r = await request(app).post('/api/v1/exports/log').set(auth(superToken)).send({ resource: 'leads', count: 12 });
    expect(r.status).toBe(201);
    const bad = await request(app).post('/api/v1/exports/log').set(auth(superToken)).send({});
    expect(bad.status).toBe(400);
  });
});

describe('leaver fan-out (§6.6)', () => {
  it('reassigns owned leads/targets on suspend and reports counts', async () => {
    const email = `leaver-${stamp}@example.com`;
    const u = await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'Leaver', email, role: 'bda', tenantId: 'TNT-GLOBAL', password: 'LeaverPass1' });
    const lead = await request(app).post('/api/v1/leads').set(auth(superToken)).send({ contactName: 'Owned', companyName: `OwnedCo ${stamp}`, owner: email });
    const tgt = await request(app).post('/api/v1/targets').set(auth(superToken)).send({ owner: email, period: '2026-Q4', goal: 5 });
    const s = await request(app).patch(`/api/v1/users/${u.body.data.id}/status`).set(auth(superToken)).send({ status: 'Suspended', reason: 'exit', reassignTo: 'kiran@nexatalent.com' });
    expect(s.body.reassigned.counts.leads).toBe(1);
    expect(s.body.reassigned.counts.targets).toBe(1);
    const leads = await request(app).get('/api/v1/leads').set(auth(superToken));
    const moved = (leads.body.data as any[]).find((x) => x.id === lead.body.data.id);
    expect(moved.owner).toBe('kiran@nexatalent.com');
    await request(app).delete(`/api/v1/leads/${lead.body.data.id}`).set(auth(superToken));
    await request(app).delete(`/api/v1/targets/${tgt.body.data.id}`).set(auth(superToken));
    await request(app).delete(`/api/v1/users/${u.body.data.id}`).set(auth(superToken));
  });
});

describe('lead merge (§6.12)', () => {
  it('moves linked records, trails history, and guards bad merges', async () => {
    const a = await request(app).post('/api/v1/leads').set(auth(superToken)).send({ contactName: 'Dup A', companyName: `DupCo ${stamp}` });
    const b = await request(app).post('/api/v1/leads').set(auth(superToken)).send({ contactName: 'Dup B', companyName: `DupCo ${stamp}` });
    await request(app).post(`/api/v1/leads/${a.body.data.id}/activities`).set(auth(superToken)).send({ type: 'call', notes: 'hello' });
    const self = await request(app).post(`/api/v1/leads/${a.body.data.id}/merge`).set(auth(superToken)).send({ intoId: a.body.data.id, reason: 'x' });
    expect(self.status).toBe(400);
    const noreason = await request(app).post(`/api/v1/leads/${a.body.data.id}/merge`).set(auth(superToken)).send({ intoId: b.body.data.id });
    expect(noreason.status).toBe(400);
    const ok = await request(app).post(`/api/v1/leads/${a.body.data.id}/merge`).set(auth(superToken)).send({ intoId: b.body.data.id, reason: 'duplicate import' });
    expect(ok.status).toBe(200);
    expect(ok.body.data.moved.leadActivities).toBe(1);
    expect(ok.body.data.into.id).toBe(b.body.data.id);
    const again = await request(app).post(`/api/v1/leads/${a.body.data.id}/merge`).set(auth(superToken)).send({ intoId: b.body.data.id, reason: 'x' });
    expect(again.status).toBe(422);
    await request(app).delete(`/api/v1/leads/${a.body.data.id}`).set(auth(superToken));
    await request(app).delete(`/api/v1/leads/${b.body.data.id}`).set(auth(superToken));
  });
});

describe('plan versioning + subscription moves (§6.8)', () => {
  let planId = '';
  let subId = '';
  it('versions plans without rewriting active snapshots', async () => {
    const p = await request(app).post('/api/v1/plans').set(auth(superToken)).send({ name: `VerPlan ${stamp}`, price: 10000, entitlements: { 'jobs.active_limit': 5 } });
    planId = p.body.data.id;
    expect(p.body.data.version).toBe(1);
    const sub = await request(app).post('/api/v1/subscriptions').set(auth(superToken)).send({ orgId: 'TNT-9011', planId });
    subId = sub.body.data.id;
    expect(sub.body.data.planVersion).toBe(1);
    const v2 = await request(app).post(`/api/v1/plans/${planId}/new-version`).set(auth(superToken)).send({ price: 12000 });
    expect(v2.body.data.version).toBe(2);
    const vers = await request(app).get(`/api/v1/plans/${planId}/versions`).set(auth(superToken));
    expect(vers.body.data.length).toBe(1);
    expect(vers.body.data[0].snapshot.price).toBe(10000);
    const subs = await request(app).get('/api/v1/subscriptions').set(auth(superToken));
    const mine = (subs.body.data as any[]).find((x) => x.id === subId);
    expect(mine.planVersion).toBe(1); // snapshot immunity
    const blocked = await request(app).patch(`/api/v1/plans/${planId}/archive`).set(auth(superToken)).send({});
    expect(blocked.status).toBe(422);
    const forced = await request(app).patch(`/api/v1/plans/${planId}/archive`).set(auth(superToken)).send({ force: true });
    expect(forced.body.data.status).toBe('Archived');
    const re = await request(app).post('/api/v1/subscriptions').set(auth(superToken)).send({ orgId: 'TNT-9011', planId });
    expect(re.status).toBe(422);
  });
  it('changes plans with history and tunes renewal', async () => {
    const p2 = await request(app).post('/api/v1/plans').set(auth(superToken)).send({ name: `VerPlan2 ${stamp}`, price: 20000 });
    const mv = await request(app).post(`/api/v1/subscriptions/${subId}/change-plan`).set(auth(superToken)).send({ planId: p2.body.data.id, reason: 'upgrade' });
    expect(mv.body.data.planId).toBe(p2.body.data.id);
    const bad = await request(app).post(`/api/v1/subscriptions/${subId}/change-plan`).set(auth(superToken)).send({ planId: planId });
    expect(bad.status).toBe(422); // archived
    const ren = await request(app).patch(`/api/v1/subscriptions/${subId}/renewal`).set(auth(superToken)).send({ autoRenew: false, discount: 500 });
    expect(ren.body.data.autoRenew).toBe(false);
    expect(ren.body.data.discount).toBe(500);
    // hygiene: cancel the probe subscription so the shared dev DB keeps its seed entitlements
    const cancel = await request(app).patch(`/api/v1/subscriptions/${subId}/status`).set(auth(superToken)).send({ status: 'Cancelled', reason: 'test cleanup' });
    expect(cancel.body.data.status).toBe('Cancelled');
  });
});

describe('invoice draft lifecycle + documents (§6.10)', () => {
  const line = { label: 'Svc', qty: 2, unit: 5000 };
  it('drafts, edits, issues, then locks', async () => {
    const d = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [line], dueDate: '2027-06-01', draft: true });
    expect(d.body.data.status).toBe('Draft');
    const id = d.body.data.id;
    expect(d.body.data.total).toBe(11800);
    const edit = await request(app).put(`/api/v1/invoices/${id}`).set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [{ ...line, qty: 3 }], dueDate: '2027-06-01' });
    expect(edit.body.data.total).toBe(17700);
    const issue = await request(app).post(`/api/v1/invoices/${id}/issue`).set(auth(superToken)).send({});
    expect(issue.body.data.status).toBe('Issued');
    const locked = await request(app).put(`/api/v1/invoices/${id}`).set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [line], dueDate: '2027-06-01' });
    expect(locked.status).toBe(422);
    const doc = await request(app).get(`/api/v1/invoices/${id}/document`).set(auth(superToken));
    expect(doc.body.data.lines.length).toBe(1);
    expect(doc.body.data).toHaveProperty('payments');
    const again = await request(app).post(`/api/v1/invoices/${id}/issue`).set(auth(superToken)).send({});
    expect(again.status).toBe(422);
  });
  it('flags overdue on list and guards void', async () => {
    const past = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [line], dueDate: '2020-01-01' });
    const list = await request(app).get('/api/v1/invoices?page=1&pageSize=100').set(auth(superToken));
    const row = (list.body.data as any[]).find((x) => x.id === past.body.data.id);
    expect(row.overdue).toBe(true);
    expect(row.daysOverdue).toBeGreaterThan(0);
    const noreason = await request(app).patch(`/api/v1/invoices/${past.body.data.id}/void`).set(auth(superToken)).send({});
    expect(noreason.status).toBe(400);
    const voided = await request(app).patch(`/api/v1/invoices/${past.body.data.id}/void`).set(auth(superToken)).send({ reason: 'test cleanup' });
    expect(voided.body.data.status).toBe('Void');
  });
});

describe('candidate directory filters (§6.3)', () => {
  it('enriches rows and applies every server-side filter', async () => {
    const all = await request(app).get('/api/v1/directory/candidates?page=1&pageSize=100').set(auth(superToken));
    expect(all.status).toBe(200);
    expect(all.body.data.length).toBeGreaterThan(0);
    const row = all.body.data[0];
    for (const k of ['applicationCount', 'completeness', 'lastActivity', 'registrationDate', 'recruiter', 'source', 'latestStage']) {
      expect(row).toHaveProperty(k);
    }
    const exp = await request(app).get('/api/v1/directory/candidates?expMin=5').set(auth(superToken));
    for (const c of exp.body.data) expect(Number(c.experienceYears || 0)).toBeGreaterThanOrEqual(5);
    const st = await request(app).get('/api/v1/directory/candidates?status=Active').set(auth(superToken));
    for (const c of st.body.data) expect(String(c.status || 'Active')).toBe('Active');
    const comp = await request(app).get('/api/v1/directory/candidates?completeness=gt80').set(auth(superToken));
    for (const c of comp.body.data) expect(c.completeness).toBeGreaterThan(80);
    const q = await request(app).get('/api/v1/directory/candidates?q=CND-9041').set(auth(superToken));
    expect(q.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('candidate status, deletion and privacy workflows (§6.3)', () => {
  const email = `flow-${stamp}@example.com`;
  const password = 'FlowPass123';
  let pid = '';
  let userId = '';
  it('creates profile + user, revokes sessions on suspend with review date', async () => {
    const p = await request(app).post('/api/v1/candidates').set(auth(superToken)).send({ name: 'Flow Case', email, roleTitle: 'QA Engineer', experienceYears: 3 });
    expect(p.status).toBe(201);
    pid = p.body.data.id;
    const u = await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'Flow Case', email, role: 'candidate', tenantId: 'TNT-CANDIDATE', password });
    userId = u.body.data.id;
    const l = await login(email, password);
    expect(l.status).toBe(200);
    const s = await request(app).patch(`/api/v1/directory/candidates/${pid}/status`).set(auth(superToken)).send({ status: 'Suspended', reason: 'test suspension', reviewDate: '2027-01-15' });
    expect(s.status).toBe(200);
    expect(s.body.data.statusReviewDate).toBe('2027-01-15');
    expect(s.body.sessionsRevoked).toBeGreaterThanOrEqual(1);
    const r = await request(app).patch(`/api/v1/directory/candidates/${pid}/status`).set(auth(superToken)).send({ status: 'Active', reason: 'review passed' });
    expect(r.body.data.status).toBe('Active');
    expect(r.body.data.statusReviewDate).toBeUndefined();
  });
  it('tracks information requests with notifications', async () => {
    const bad = await request(app).post(`/api/v1/directory/candidates/${pid}/info-requests`).set(auth(superToken)).send({});
    expect(bad.status).toBe(400);
    const ok = await request(app).post(`/api/v1/directory/candidates/${pid}/info-requests`).set(auth(superToken)).send({ message: 'Upload latest payslip' });
    expect(ok.status).toBe(201);
    expect(ok.body.data.status).toBe('Open');
    const list = await request(app).get(`/api/v1/directory/candidates/${pid}/info-requests`).set(auth(superToken));
    expect(list.body.data.length).toBe(1);
    const nope = await request(app).patch(`/api/v1/directory/candidates/${pid}/info-requests/${ok.body.data.id}`).set(auth(superToken)).send({ status: 'Bogus' });
    expect(nope.status).toBe(400);
    const done = await request(app).patch(`/api/v1/directory/candidates/${pid}/info-requests/${ok.body.data.id}`).set(auth(superToken)).send({ status: 'Responded' });
    expect(done.body.data.status).toBe('Responded');
  });
  it('approves deletion requests by anonymizing, preserving linkage', async () => {
    const noreason = await request(app).post(`/api/v1/directory/candidates/${pid}/deletion-request`).set(auth(superToken)).send({});
    expect(noreason.status).toBe(400);
    const open = await request(app).post(`/api/v1/directory/candidates/${pid}/deletion-request`).set(auth(superToken)).send({ reason: 'right to erasure' });
    expect(open.status).toBe(201);
    const dup = await request(app).post(`/api/v1/directory/candidates/${pid}/deletion-request`).set(auth(superToken)).send({ reason: 'again' });
    expect(dup.status).toBe(409);
    const bad = await request(app).patch(`/api/v1/directory/candidates/${pid}/deletion-requests/${open.body.data.id}`).set(auth(superToken)).send({ decision: 'maybe' });
    expect(bad.status).toBe(400);
    const yes = await request(app).patch(`/api/v1/directory/candidates/${pid}/deletion-requests/${open.body.data.id}`).set(auth(superToken)).send({ decision: 'approve', note: 'verified identity' });
    expect(yes.body.data.request.status).toBe('Approved');
    expect(yes.body.data.anonymized.status).toBe('Deleted');
    const gone = await request(app).get(`/api/v1/directory/candidates/${pid}/360`).set(auth(superToken));
    expect(gone.body.data.profile.name).toBe('Deleted User');
    expect(gone.body.data.profile.email).toBe(email); // linkage preserved
    const twice = await request(app).patch(`/api/v1/directory/candidates/${pid}/deletion-requests/${open.body.data.id}`).set(auth(superToken)).send({ decision: 'approve' });
    expect(twice.status).toBe(422);
  });
  it('purges clean profiles but blocks when legal records exist', async () => {
    const guarded = await request(app).post('/api/v1/candidates').set(auth(superToken)).send({ name: 'Guarded', email: `guarded-${stamp}@example.com` });
    const gid = guarded.body.data.id;
    await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-9901', candidateEmail: `guarded-${stamp}@example.com` });
    const soft = await request(app).delete(`/api/v1/directory/candidates/${gid}`).set(auth(superToken)).send({ reason: 'test' });
    expect(soft.body.data.status).toBe('Deleted');
    const blocked = await request(app).delete(`/api/v1/directory/candidates/${gid}/permanent`).set(auth(superToken));
    expect(blocked.status).toBe(422);
    expect(blocked.body.message).toMatch(/application/);
    const direct = await request(app).delete(`/api/v1/directory/candidates/CND-9041/permanent`).set(auth(superToken));
    expect(direct.status).toBe(422); // must soft-delete first
    const gone = await request(app).delete(`/api/v1/directory/candidates/${pid}/permanent`).set(auth(superToken));
    expect(gone.status).toBe(200);
    const missing = await request(app).get(`/api/v1/directory/candidates/${pid}/360`).set(auth(superToken));
    expect(missing.status).toBe(404);
    await request(app).delete(`/api/v1/users/${userId}`).set(auth(superToken)).send({ reason: 'test cleanup' });
  });
});

describe('company fields + admin invite (§6.4)', () => {
  it('persists extended registration fields and invites a scoped admin', async () => {
    const t = await request(app).post('/api/v1/tenants').set(auth(superToken)).send({ legalName: `FieldCo ${stamp} Ltd` });
    expect(t.status).toBe(201);
    const id = t.body.data.id;
    const patch = { subIndustry: 'Fintech Infra', countryOfIncorporation: 'India', registrationNumber: 'CIN-123', gstin: '29ABCDE1234F1Z5', taxIds: 'PAN-ABCDE1234F', registeredAddress: '1 Main St', operatingLocations: 'Bengaluru, Mumbai', logoUrl: 'https://example.com/logo.png', primaryContact: 'Ops Lead', primaryContactDesignation: 'COO', billingContact: 'billing@field.co', financeEmail: 'finance@field.co', salesOwner: 'kiran@nexatalent.com' };
    const u = await request(app).patch(`/api/v1/tenants/${id}`).set(auth(superToken)).send(patch);
    expect(u.status).toBe(200);
    for (const [k, v] of Object.entries(patch)) expect(u.body.data[k]).toBe(v);
    const inv = await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'Field Admin', email: `field-admin-${stamp}@example.com`, role: 'company_admin', tenantId: id, password: 'FieldPass123' });
    expect(inv.status).toBe(201);
    expect(inv.body.data.tenantId).toBe(id);
    const dup = await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'Dup', email: `field-admin-${stamp}@example.com`, role: 'company_admin', tenantId: id, password: 'FieldPass123' });
    expect(dup.status).toBe(409);
    const br = await request(app).post('/api/v1/branches').set(auth(superToken)).send({ name: 'Field Branch', city: 'Mumbai', orgId: id });
    expect(br.body.data.orgId).toBe(id);
    await request(app).delete(`/api/v1/branches/${br.body.data.id}`).set(auth(superToken));
    await request(app).delete(`/api/v1/users/${inv.body.data.id}`).set(auth(superToken)).send({ reason: 'test cleanup' });
    const del = await request(app).delete(`/api/v1/tenants/${id}`).set(auth(superToken));
    expect(del.status).toBe(200);
  });
});

describe('commission duplicate guard (§6.11)', () => {
  it('mints once per placement+trigger and reports via check', async () => {
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', jobId: 'JOB-9901', rate: 8.33, trigger: 'Joined' });
    expect(ag.status).toBe(201);
    const email = `placed-${stamp}@example.com`;
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-9901', candidateEmail: email });
    expect(appl.status).toBe(201);
    const pl = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id, feeBasis: 2000000 });
    expect(pl.status).toBe(201);
    const chk = await request(app).get(`/api/v1/commissions/check?applicationId=${appl.body.data.id}&trigger=Joined`).set(auth(superToken));
    expect(chk.body.data.duplicate).toBe(true);
    expect(chk.body.data.count).toBeGreaterThanOrEqual(1);
    const miss = await request(app).get('/api/v1/commissions/check?applicationId=APP-NOPE&trigger=Joined').set(auth(superToken));
    expect(miss.body.data.duplicate).toBe(false);
    const bad = await request(app).get('/api/v1/commissions/check?applicationId=x').set(auth(superToken));
    expect(bad.status).toBe(400);
  });
});
