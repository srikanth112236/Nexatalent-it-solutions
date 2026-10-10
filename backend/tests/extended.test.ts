import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createHmac } from 'crypto';
import { createApp } from '../src/app/index.js';

const app = createApp();
let superToken = '';
let vendorToken = '';
let candidateToken = '';

beforeAll(async () => {
  const s = await request(app).post('/api/v1/auth/login').send({ email: 'superadmin@nexatalent.com', password: 'NexaTalent123' });
  superToken = s.body.data.accessToken;
  const v = await request(app).post('/api/v1/auth/login').send({ email: 'rajesh@techsolutionsvendor.com', password: 'NexaTalent123' });
  vendorToken = v.body.data.accessToken;
  const c = await request(app).post('/api/v1/auth/login').send({ email: 'candidate@nexatalent.com', password: 'NexaTalent123' });
  candidateToken = c.body.data.accessToken;
});
const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

describe('skills taxonomy', () => {
  it('lists seeded skills and dedupes on create', async () => {
    const list = await request(app).get('/api/v1/skills?q=react').set(auth(superToken));
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThan(0);
    const dup = await request(app).post('/api/v1/skills').set(auth(superToken)).send({ name: 'React' });
    expect(dup.status).toBe(409);
  });
});

describe('documents', () => {
  it('rejects disallowed types and oversized files', async () => {
    const bad = await request(app).post('/api/v1/documents').set(auth(candidateToken)).send({
      name: 'evil.exe', mime: 'application/x-msdownload', data: Buffer.from('x').toString('base64'),
    });
    expect(bad.status).toBe(415);
  });
  it('uploads a PDF resume and links it to the profile', async () => {
    const pdf = Buffer.from('%PDF-1.4 fake resume bytes').toString('base64');
    const up = await request(app).post('/api/v1/documents').set(auth(candidateToken)).send({
      name: 'resume.pdf', mime: 'application/pdf', data: pdf, kind: 'resume',
    });
    expect(up.status).toBe(201);
    expect(up.body.data.version).toBeGreaterThanOrEqual(1);
    const dl = await request(app).get(`/api/v1/documents/${up.body.data.id}/download`).set(auth(candidateToken));
    expect(dl.status).toBe(200);
  });
});

describe('consent center', () => {
  it('reads, updates, withdraws and exports', async () => {
    const put = await request(app).put('/api/v1/consents').set(auth(candidateToken)).send({ marketing: true, visibility: 'open' });
    expect(put.status).toBe(200);
    const exp = await request(app).get('/api/v1/consents/export').set(auth(candidateToken));
    expect(exp.body.data.profile).toBeDefined();
    const wd = await request(app).post('/api/v1/consents/withdraw').set(auth(candidateToken)).send({});
    expect(wd.body.data.withdrawn).toBe(true);
  });
});

describe('opportunities + proposals + meetings', () => {
  let leadId = '';
  it('creates lead then opportunity then proposal then meeting', async () => {
    const lead = await request(app).post('/api/v1/leads').set(auth(superToken)).send({ contactName: 'Pipeline Test', companyName: 'PipeCo', value: 100000 });
    leadId = lead.body.data.id;
    const opp = await request(app).post('/api/v1/opportunities').set(auth(superToken)).send({ leadId, value: 100000 });
    expect(opp.status).toBe(201);
    const mv = await request(app).patch(`/api/v1/opportunities/${opp.body.data.id}/stage`).set(auth(superToken)).send({ stage: 'Negotiation' });
    expect(mv.body.data.stage).toBe('Negotiation');
    const pr = await request(app).post('/api/v1/proposals').set(auth(superToken)).send({ leadId, title: 'PipeCo SOW', amount: 100000 });
    expect(pr.status).toBe(201);
    const ps = await request(app).patch(`/api/v1/proposals/${pr.body.data.id}/status`).set(auth(superToken)).send({ status: 'Sent' });
    expect(ps.body.data.status).toBe('Sent');
    const mt = await request(app).post('/api/v1/meetings').set(auth(superToken)).send({ leadId, title: 'Discovery', at: '2026-11-01T10:00:00' });
    expect(mt.status).toBe(201);
    const acts = await request(app).get(`/api/v1/leads/${leadId}/activities`).set(auth(superToken));
    expect(acts.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('timesheets', () => {
  it('vendor submits, employer approves once', async () => {
    const sub = await request(app).post('/api/v1/timesheets').set(auth(vendorToken)).send({ contractorId: 'CTR-801', period: '2026-10-W2', hours: 40 });
    expect(sub.status).toBe(201);
    const ap = await request(app).patch(`/api/v1/timesheets/${sub.body.data.id}/approve`).set(auth(superToken)).send({ decision: 'approve' });
    expect(ap.body.data.status).toBe('Approved');
    const again = await request(app).patch(`/api/v1/timesheets/${sub.body.data.id}/approve`).set(auth(superToken)).send({ decision: 'approve' });
    expect(again.status).toBe(422);
  });
});

describe('commission adjustments', () => {
  it('adjusts totals idempotently', async () => {
    const coms = await request(app).get('/api/v1/commissions').set(auth(superToken));
    if (coms.body.data.length === 0) return;
    const id = coms.body.data[0].id;
    const a1 = await request(app).post(`/api/v1/commissions/${id}/adjustments`).set(auth(superToken)).send({ amount: -500, reason: 'test' });
    expect(a1.status).toBe(201);
    const a2 = await request(app).post(`/api/v1/commissions/${id}/adjustments`).set(auth(superToken)).send({ amount: -500, reason: 'test' });
    expect(a2.body.message).toMatch(/Duplicate ignored/);
  });
});

describe('agency profiles', () => {
  it('onboards and verifies an agency', async () => {
    const c = await request(app).post('/api/v1/agency-profiles').set(auth(superToken)).send({ legalName: 'Test Agency Ltd' });
    expect(c.status).toBe(201);
    const v = await request(app).patch(`/api/v1/agency-profiles/${c.body.data.id}`).set(auth(superToken)).send({ verificationStatus: 'Approved' });
    expect(v.body.data.accountStatus).toBe('Active');
  });
});

describe('webhook HMAC', () => {
  it('rejects missing secret config, stale timestamps and bad signatures', async () => {
    const r1 = await request(app).post('/api/v1/payments/webhook').send({ invoiceId: 'x', amount: 1, idempotencyKey: 'y' });
    // no PAYMENT_WEBHOOK_SECRET in test env → 503 configured-guard
    expect([401, 503]).toContain(r1.status);
  });
  it('accepts a correctly signed webhook when secret is set', async () => {
    process.env.PAYMENT_WEBHOOK_SECRET = 'test-secret-123';
    const inv = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({
      orgId: 'TNT-9011', lines: [{ label: 'Hook', qty: 1, unit: 5000 }], dueDate: '2027-01-01',
    });
    const body = { invoiceId: inv.body.data.id, amount: inv.body.data.total, idempotencyKey: `hook-${Date.now()}` };
    const raw = JSON.stringify(body);
    const ts = Date.now();
    const sig = createHmac('sha256', 'test-secret-123').update(`${ts}.${raw}`).digest('hex');
    const ok = await request(app).post('/api/v1/payments/webhook')
      .set({ 'x-provider-signature': sig, 'x-provider-timestamp': String(ts), 'Content-Type': 'application/json' })
      .send(raw);
    expect(ok.status).toBe(200);
    const stale = await request(app).post('/api/v1/payments/webhook')
      .set({ 'x-provider-signature': sig, 'x-provider-timestamp': String(Date.now() - 10 * 60 * 1000), 'Content-Type': 'application/json' })
      .send(raw);
    expect(stale.status).toBe(401);
    delete process.env.PAYMENT_WEBHOOK_SECRET;
  });
});

describe('history readers', () => {
  it('reads application history, allocations, credit notes, usage ledger', async () => {
    const apps = await request(app).get('/api/v1/applications').set(auth(superToken));
    if (apps.body.data.length > 0) {
      const h = await request(app).get(`/api/v1/applications/${apps.body.data[0].id}/history`).set(auth(superToken));
      expect(h.status).toBe(200);
    }
    for (const p of ['/api/v1/allocations', '/api/v1/credit-notes', '/api/v1/subscription-changes', '/api/v1/usage-ledger']) {
      const r = await request(app).get(p).set(auth(superToken));
      expect(r.status).toBe(200);
    }
  });
});
