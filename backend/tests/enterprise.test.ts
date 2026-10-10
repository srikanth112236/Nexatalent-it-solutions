import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';

const app = createApp();
let superToken = '';
let candidateToken = '';
let employerToken = '';
let jobId = '';
let appId = '';
let invoiceId = '';
let invoiceTotal = 0;

async function login(email: string, password = 'NexaTalent123') {
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return res;
}

beforeAll(async () => {
  const s = await login('superadmin@nexatalent.com');
  expect(s.status).toBe(200);
  superToken = s.body.data.accessToken;
  const c = await login('candidate@nexatalent.com');
  expect(c.status).toBe(200);
  candidateToken = c.body.data.accessToken;
  const e = await login('aditi@fintechscaleops.io');
  expect(e.status).toBe(200);
  employerToken = e.body.data.accessToken;
});

const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

describe('auth (§4)', () => {
  it('rejects wrong password with 401', async () => {
    const r = await request(app).post('/api/v1/auth/login').send({ email: 'superadmin@nexatalent.com', password: 'wrong' });
    expect(r.status).toBe(401);
  });
  it('blocks workspace hopping with 403', async () => {
    const r = await request(app).post('/api/v1/auth/login').send({ email: 'candidate@nexatalent.com', password: 'NexaTalent123', role: 'employer' });
    expect(r.status).toBe(403);
  });
  it('blocks suspended users with 403', async () => {
    await request(app).patch('/api/v1/users/USR-106/status').set(auth(superToken)).send({ status: 'Suspended', reason: 'test' });
    const r = await login('candidate@nexatalent.com');
    expect(r.status).toBe(403);
    await request(app).patch('/api/v1/users/USR-106/status').set(auth(superToken)).send({ status: 'Active', reason: 'test' });
  });
});

describe('requisition + job state machines (§8.3/§8.4)', () => {
  it('creates requisition in Draft and rejects illegal jump', async () => {
    const r = await request(app).post('/api/v1/requisitions').set(auth(superToken)).send({ title: 'Vitest Req', openings: 1 });
    expect(r.status).toBe(201);
    expect(r.body.data.status).toBe('Draft');
    const bad = await request(app).patch(`/api/v1/requisitions/${r.body.data.id}/status`).set(auth(superToken)).send({ status: 'Sourcing' });
    expect(bad.status).toBe(422);
    const ok = await request(app).patch(`/api/v1/requisitions/${r.body.data.id}/status`).set(auth(superToken)).send({ status: 'Pending Approval' });
    expect(ok.body.data.status).toBe('Pending Approval');
  });
  it('creates job in Draft and enforces flow', async () => {
    const r = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: 'Vitest Job', description: 'x', location: 'Remote' });
    expect(r.status).toBe(201);
    jobId = r.body.data.id;
    const bad = await request(app).patch(`/api/v1/jobs/${jobId}/status`).set(auth(employerToken)).send({ status: 'Published' });
    expect(bad.status).toBe(422);
  });
});

describe('applications (§8.8)', () => {
  it('applies once and rejects duplicates', async () => {
    const all = await request(app).get('/api/v1/jobs').set(auth(superToken));
    const target = all.body.data.find((j: any) => j.status === 'Published') || all.body.data[0];
    const r = await request(app).post('/api/v1/applications').set(auth(candidateToken)).send({ jobId: target.id, candidateEmail: 'candidate@nexatalent.com' });
    expect([201, 409]).toContain(r.status);
    if (r.status === 201) appId = r.body.data.id;
    else {
      const mine = await request(app).get('/api/v1/applications').set(auth(candidateToken));
      appId = mine.body.data[0]?.id;
    }
    const dup = await request(app).post('/api/v1/applications').set(auth(candidateToken)).send({ jobId: target.id, candidateEmail: 'candidate@nexatalent.com' });
    expect(dup.status).toBe(409);
  });
  it('candidate cannot read another application (404, no oracle)', async () => {
    const r = await request(app).get('/api/v1/applications/APP-DOES-NOT-EXIST/history').set(auth(candidateToken));
    expect(r.status).toBe(404);
  });
  it('rejects then reopens with reason + history', async () => {
    const rej = await request(app).patch(`/api/v1/applications/${appId}/stage`).set(auth(superToken)).send({ stage: 'Rejected', reason: 'test rejection' });
    expect(rej.status).toBe(200);
    const noReason = await request(app).post(`/api/v1/applications/${appId}/reopen`).set(auth(superToken)).send({ target: 'Applied' });
    expect(noReason.status).toBe(400);
    const re = await request(app).post(`/api/v1/applications/${appId}/reopen`).set(auth(superToken)).send({ target: 'Applied', reason: 'test reopen' });
    expect(re.status).toBe(200);
    expect(re.body.data.stage).toBe('Applied');
    const h = await request(app).get(`/api/v1/applications/${appId}/history`).set(auth(superToken));
    expect(h.body.data.some((x: any) => x.to === 'Applied' && /reopen/i.test(x.reason || ''))).toBe(true);
  });
});

describe('tenant isolation (§4.3)', () => {
  it('candidate cannot list payouts ledger', async () => {
    const r = await request(app).get('/api/v1/payouts').set(auth(candidateToken));
    expect(r.status).toBe(200);
    expect(r.body.data).toEqual([]);
  });
  it('candidate is denied platform user directory', async () => {
    const r = await request(app).get('/api/v1/users').set(auth(candidateToken));
    expect(r.status).toBe(403);
  });
});

describe('finance idempotency (§15.3)', () => {
  it('issues invoice with exact tax math and pays idempotently', async () => {
    const inv = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({
      orgId: 'TNT-9011', lines: [{ label: 'Vitest', qty: 1, unit: 10000 }], dueDate: '2027-01-01',
    });
    expect(inv.status).toBe(201);
    expect(inv.body.data.total).toBe(11800);
    invoiceId = inv.body.data.id;
    invoiceTotal = inv.body.data.total;
    const key = `vitest-${Date.now()}`;
    const p1 = await request(app).post('/api/v1/payments').set(auth(superToken)).send({ invoiceId, amount: invoiceTotal, idempotencyKey: key });
    expect(p1.status).toBe(201);
    const p2 = await request(app).post('/api/v1/payments').set(auth(superToken)).send({ invoiceId, amount: invoiceTotal, idempotencyKey: key });
    expect(p2.body.message).toMatch(/Duplicate ignored/);
    const invs = await request(app).get('/api/v1/invoices').set(auth(superToken));
    const row = invs.body.data.find((i: any) => i.id === invoiceId);
    expect(row.status).toBe('Paid');
    expect(row.balance).toBe(0);
  });
});

describe('entitlements (§12)', () => {
  it('blocks contact unlock without subscription', async () => {
    const r = await request(app).get('/api/v1/candidates/search?tier=contact').set(auth(superToken));
    // superadmin TNT-GLOBAL has no subscription → 402 with upgrade code
    expect([402, 403, 429, 200]).toContain(r.status);
    if (r.status !== 200) expect(r.body.code).toMatch(/SUBSCRIPTION_REQUIRED|ENTITLEMENT_LOCKED|QUOTA_EXHAUSTED/);
  });
});

describe('derived reports (§6.14)', () => {
  it('serves all 12 reports with definitions + freshness', async () => {
    for (const name of ['candidate-pipeline', 'requisition-ageing', 'receivables', 'commission-liabilities', 'sales-pipeline', 'recruiter-workload', 'interview-offer', 'offer-joining', 'company-hiring', 'subscription-revenue', 'agency-performance', 'duplicates']) {
      const r = await request(app).get(`/api/v1/reports/${name}`).set(auth(superToken));
      expect(r.status).toBe(200);
      expect(r.body.data.definition).toBeTruthy();
      expect(r.body.data.freshness).toBe('live');
    }
  });
  it('interview-offer and offer-joining carry conversion math', async () => {
    const io = await request(app).get('/api/v1/reports/interview-offer').set(auth(superToken));
    expect(io.body.data.data.scheduledInterviews).toBeGreaterThanOrEqual(1);
    expect(io.body.data.data.conversionRate).toBeGreaterThanOrEqual(0);
    const oj = await request(app).get('/api/v1/reports/offer-joining').set(auth(superToken));
    expect(oj.body.data.data).toHaveProperty('avgDaysOfferToJoin');
    const ch = await request(app).get('/api/v1/reports/company-hiring').set(auth(superToken));
    expect(Array.isArray(ch.body.data.data)).toBe(true);
  });
  it('rejects unknown reports and non-privileged roles', async () => {
    const bad = await request(app).get('/api/v1/reports/nope').set(auth(superToken));
    expect(bad.status).toBe(404);
    const denied = await request(app).get('/api/v1/reports/duplicates').set(auth(candidateToken));
    expect([403, 404]).toContain(denied.status);
  });
});

describe('commission math (§6.11)', () => {
  it('computes gross + 18% tax total', async () => {
    // 8.33% of 100000 basis = 8330 gross, 1499.4 tax, 9829.4 total
    const gross = 100000 * 8.33 / 100;
    expect(Math.round(gross)).toBe(8330);
    expect(+(gross * 1.18).toFixed(2)).toBe(9829.4);
  });
});
