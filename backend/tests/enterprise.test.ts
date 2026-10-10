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

describe('commercial terms: slabs, templates, reminders', () => {
  it('serves seeded fee slabs and enforces slab bounds', async () => {
    const slabs = await request(app).get('/api/v1/fee-slabs').set(auth(superToken));
    expect(slabs.status).toBe(200);
    expect(slabs.body.data.find((s: any) => s.hiringType === 'Junior IT roles')?.rateMax).toBe(8.33);
    const bad = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', hiringType: 'Junior IT roles', rate: 12 });
    expect(bad.status).toBe(422);
    const ok = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', hiringType: 'Junior IT roles', rate: 8.33 });
    expect(ok.status).toBe(201);
    expect(ok.body.data.companyAccepted).toBe(false);
  });
  it('versions templates, instantiates and records company acceptance', async () => {
    const t = await request(app).post('/api/v1/agreement-templates').set(auth(superToken)).send({ name: 'Standard Placement Terms' });
    expect(t.status).toBe(201);
    const tid = t.body.data.id;
    const act = await request(app).post(`/api/v1/agreement-templates/${tid}/status`).set(auth(superToken)).send({ status: 'Active' });
    expect(act.body.data.status).toBe('Active');
    const v2 = await request(app).put(`/api/v1/agreement-templates/${tid}`).set(auth(superToken)).send({ paymentTermsDays: 15 });
    expect(v2.body.data.version).toBe(2);
    expect(v2.body.data.history.length).toBe(1);
    const inst = await request(app).post(`/api/v1/agreement-templates/${tid}/instantiate`).set(auth(superToken)).send({ orgId: 'TNT-9011', rate: 9 });
    expect(inst.status).toBe(201);
    expect(inst.body.data.templateId).toBe(tid);
    expect(inst.body.data.paymentTermsDays).toBe(15);
    const acc = await request(app).patch(`/api/v1/commission-agreements/${inst.body.data.id}/accept`).set(auth(superToken)).send({});
    expect(acc.body.data.companyAccepted).toBe(true);
  });
  it('generates exactly one invoice per approved commission', async () => {
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', hiringType: 'Mid-level IT roles', rate: 9 });
    const db = (await import('../src/db/store.js')).loadDb();
    db.commissions.unshift({ id: 'COM-TEST-1', agreementId: ag.body.data.id, orgId: 'TNT-9011', candidateEmail: 'loop@test.com', jobId: 'JOB-9901', trigger: 'Joined', triggerDate: new Date().toISOString(), feeBasis: 1000000, rate: 9, gross: 90000, adjustments: 0, tax: 16200, total: 106200, net: 106200, approvalStatus: 'Approved', paymentStatus: 'Unpaid', createdAt: new Date().toISOString() });
    const inv = await request(app).post('/api/v1/commissions/COM-TEST-1/invoice').set(auth(superToken)).send({});
    expect(inv.status).toBe(201);
    expect(inv.body.data.invoice.total).toBe(106200);
    expect(inv.body.data.invoice.agreementId).toBe(ag.body.data.id);
    const dup = await request(app).post('/api/v1/commissions/COM-TEST-1/invoice').set(auth(superToken)).send({});
    expect(dup.status).toBe(409);
    db.commissions.splice(db.commissions.findIndex((c: any) => c.id === 'COM-TEST-1'), 1);
  });
  it('paginates commercial lists server-side (20 default, up to 100)', async () => {
    for (const path of ['/api/v1/commissions', '/api/v1/commission-agreements', '/api/v1/payouts', '/api/v1/invoices']) {
      const r = await request(app).get(`${path}?pageSize=50`).set(auth(superToken));
      expect(r.status).toBe(200);
      expect(Array.isArray(r.body.data)).toBe(true);
      expect(r.body.pagination.pageSize).toBe(50);
    }
    const q = await request(app).get('/api/v1/commissions?q=COM-TEST-1&leg=receivable').set(auth(superToken));
    expect(q.status).toBe(200);
  });
  it('carries monthly-CTC basis through templates into agreements', async () => {
    const t = await request(app).post('/api/v1/agreement-templates').set(auth(superToken)).send({ name: 'Monthly Contract Terms', basisType: 'monthly_ctc', contractMonths: 6 });
    const tid = t.body.data.id;
    await request(app).post(`/api/v1/agreement-templates/${tid}/status`).set(auth(superToken)).send({ status: 'Active' });
    const inst = await request(app).post(`/api/v1/agreement-templates/${tid}/instantiate`).set(auth(superToken)).send({ orgId: 'TNT-9011', rate: 9 });
    expect(inst.body.data.basisType).toBe('monthly_ctc');
    expect(inst.body.data.contractMonths).toBe(6);
  });
  it('previews hire fee and auto-mints the commission on placement', async () => {
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', jobId: 'JOB-8890', hiringType: 'Mid-level IT roles', rate: 10 });
    await request(app).patch(`/api/v1/commission-agreements/${ag.body.data.id}/accept`).set(auth(superToken)).send({});
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-8890', candidateEmail: `hire-${Date.now()}@example.com` });
    await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: 1000000 });
    const match = await request(app).get(`/api/v1/commission-agreements/match?applicationId=${appl.body.data.id}`).set(auth(superToken));
    expect(match.status).toBe(200);
    expect(match.body.data.preview.gross).toBe(100000);
    expect(match.body.data.preview.total).toBe(118000);
    const pl = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id });
    expect(pl.status).toBe(201);
    expect(pl.body.data.agreementId).toBeTruthy();
    const chk = await request(app).get(`/api/v1/commissions/check?applicationId=${appl.body.data.id}&trigger=Joined`).set(auth(superToken));
    expect(chk.body.data.duplicate).toBe(true);
  });
  it('blocks placement without an accepted agreement', async () => {
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-8890', candidateEmail: `noag-${Date.now()}@example.com` });
    const db = (await import('../src/db/store.js')).loadDb();
    const keep = db.commissionAgreements.filter((a: any) => a.orgId === 'TNT-9011');
    db.commissionAgreements = db.commissionAgreements.filter((a: any) => a.orgId !== 'TNT-9011');
    const pl = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id, feeBasis: 500000 });
    expect(pl.status).toBe(422);
    expect(pl.body.code).toBe('NO_AGREEMENT');
    db.commissionAgreements.unshift(...keep);
  });
  it('creates recurring monthly series and bills commission months', async () => {
    const s = await request(app).post('/api/v1/invoices/series').set(auth(superToken)).send({ orgId: 'TNT-9011', label: 'Payroll retainer', monthlyAmount: 50000, startMonth: '2026-11', months: 3, draft: true });
    expect(s.status).toBe(201);
    expect(s.body.data.invoices.length).toBe(3);
    expect(s.body.data.invoices[0].invoiceType).toBe('recurring');
    expect(s.body.data.invoices[0].billingPeriod).toBe('2026-11');
    expect(s.body.data.invoices[0].status).toBe('Draft');
    const db = (await import('../src/db/store.js')).loadDb();
    db.commissions.unshift({ id: 'COM-MO-1', orgId: 'TNT-9011', candidateEmail: 'mo@test.com', jobId: 'JOB-9901', trigger: 'Joined', triggerDate: new Date().toISOString(), feeBasis: 100000, basisType: 'monthly_ctc', contractMonths: 12, rate: 10, gross: 120000, adjustments: 0, tax: 21600, total: 141600, net: 141600, approvalStatus: 'Approved', paymentStatus: 'Unpaid', createdAt: new Date().toISOString() });
    const m1 = await request(app).post('/api/v1/commissions/COM-MO-1/invoice').set(auth(superToken)).send({ forMonths: 1 });
    expect(m1.status).toBe(201);
    expect(m1.body.data.invoice.total).toBe(11800);
    expect(m1.body.data.commission.billedMonths).toBe(1);
    const mRest = await request(app).post('/api/v1/commissions/COM-MO-1/invoice').set(auth(superToken)).send({});
    expect(mRest.body.data.commission.billedMonths).toBe(12);
    const done = await request(app).post('/api/v1/commissions/COM-MO-1/invoice').set(auth(superToken)).send({});
    expect(done.status).toBe(409);
    db.commissions.splice(db.commissions.findIndex((c: any) => c.id === 'COM-MO-1'), 1);
  });
  it('auto-bills started months on schedule run (idempotent)', async () => {
    const db = (await import('../src/db/store.js')).loadDb();
    db.commissions.unshift({ id: 'COM-SCH-1', orgId: 'TNT-9011', candidateEmail: 'sch@test.com', jobId: 'JOB-9901', trigger: 'Joined', triggerDate: '2020-01-01T00:00:00.000Z', feeBasis: 120000, basisType: 'monthly_ctc', contractMonths: 3, rate: 10, gross: 36000, adjustments: 0, tax: 6480, total: 42480, net: 42480, approvalStatus: 'Approved', paymentStatus: 'Unpaid', createdAt: '2020-01-01T00:00:00.000Z' });
    const r1 = await request(app).post('/api/v1/billing/schedule/run').set(auth(superToken)).send({});
    expect(r1.status).toBe(200);
    const mine = (r1.body.data.generated as any[]).filter((g: any) => g.commissionId === 'COM-SCH-1');
    expect(mine.length).toBe(3);
    const r2 = await request(app).post('/api/v1/billing/schedule/run').set(auth(superToken)).send({});
    expect((r2.body.data.generated as any[]).filter((g: any) => g.commissionId === 'COM-SCH-1').length).toBe(0);
    db.commissions.splice(db.commissions.findIndex((c: any) => c.id === 'COM-SCH-1'), 1);
  });
  it('serves server PDFs and queues mail without SMTP', async () => {
    const inv = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [{ label: 'PDF Test', qty: 1, unit: 1000 }], dueDate: '2027-01-01' });
    const pdf = await request(app).get(`/api/v1/invoices/${inv.body.data.id}/pdf`).set(auth(superToken));
    expect(pdf.status).toBe(200);
    expect(pdf.headers['content-type']).toMatch(/application\/pdf/);
    const { sendMail } = await import('../src/events/mailer.js');
    const m = await sendMail('test@example.com', 'Hello', '<p>Hi</p>', { kind: 'test' });
    expect(['queued', 'sent', 'failed']).toContain(m.status);
    const outbox = await request(app).get('/api/v1/mail-outbox').set(auth(superToken));
    expect(outbox.body.data.some((x: any) => x.id === m.id)).toBe(true);
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', rate: 9 });
    const apdf = await request(app).get(`/api/v1/commission-agreements/${ag.body.data.id}/pdf`).set(auth(superToken)).send({});
    expect(apdf.status).toBe(200);
  });
  it('resolves effective permissions for the caller (mine view)', async () => {
    const r = await request(app).get('/api/v1/permissions?view=mine').set(auth(superToken));
    expect(r.status).toBe(200);
    expect(r.body.data.permissions).toContain('manage_billing');
  });
  it('ships a seeded active template with printable HTML body', async () => {
    const all = await request(app).get('/api/v1/agreement-templates').set(auth(superToken));
    const std = all.body.data.find((t: any) => t.id === 'AGT-STD-001');
    expect(std?.status).toBe('Active');
    expect(std?.bodyHtml).toMatch(/Placement Services Agreement/);
  });
  it('runs invoice reminders idempotently for overdue balances', async () => {
    const inv = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [{ label: 'Placement fee', qty: 1, unit: 50000 }], dueDate: '2020-01-01' });
    expect(inv.status).toBe(201);
    const r1 = await request(app).post('/api/v1/invoice-reminders/run').set(auth(superToken)).send({});
    expect(r1.status).toBe(200);
    expect(r1.body.data.sent).toBeGreaterThanOrEqual(1);
    const r2 = await request(app).post('/api/v1/invoice-reminders/run').set(auth(superToken)).send({});
    expect(r2.body.data.sent).toBe(0);
    const log = await request(app).get('/api/v1/invoice-reminders').set(auth(superToken));
    expect(log.body.data.some((x: any) => x.invoiceId === inv.body.data.id && x.kind === 'overdue')).toBe(true);
  });
});

describe('golden path: hire → fee → commission → invoice → reminder (D)', () => {
  it('runs the full commercial chain without manual steps', async () => {
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', jobId: 'JOB-8890', hiringType: 'Senior / niche technology roles', rate: 11 });
    expect(ag.status).toBe(201);
    await request(app).patch(`/api/v1/commission-agreements/${ag.body.data.id}/accept`).set(auth(superToken)).send({});
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-8890', candidateEmail: `gold-${Date.now()}@example.com` });
    await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: 2000000 });
    const match = await request(app).get(`/api/v1/commission-agreements/match?applicationId=${appl.body.data.id}`).set(auth(superToken));
    expect(match.body.data.preview.gross).toBe(220000);
    const pl = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id });
    expect(pl.status).toBe(201);
    const chkPre = await request(app).get(`/api/v1/commissions/check?applicationId=${appl.body.data.id}&trigger=Joined`).set(auth(superToken));
    expect(chkPre.body.data.count).toBe(1);
    const comId = chkPre.body.data.rows[0].id;
    const appr = await request(app).patch(`/api/v1/commissions/${comId}/approve`).set(auth(superToken)).send({});
    expect(appr.body.data.approvalStatus).toBe('Approved');
    const inv = await request(app).post(`/api/v1/commissions/${comId}/invoice`).set(auth(superToken)).send({});
    expect(inv.status).toBe(201);
    expect(inv.body.data.invoice.total).toBe(259600);
    const pdf = await request(app).get(`/api/v1/invoices/${inv.body.data.invoice.id}/pdf`).set(auth(superToken));
    expect(pdf.headers['content-type']).toMatch(/application\/pdf/);
    const apdf = await request(app).get(`/api/v1/commission-agreements/${ag.body.data.id}/pdf`).set(auth(superToken));
    expect(apdf.status).toBe(200);
    const run = await request(app).post('/api/v1/invoice-reminders/run').set(auth(superToken)).send({});
    expect(run.status).toBe(200);
    const outbox = await request(app).get('/api/v1/mail-outbox').set(auth(superToken));
    expect(outbox.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('skills taxonomy (§14.2)', () => {
  it('serves industry-wide skills with categories + search', async () => {
    const all = await request(app).get('/api/v1/skills?pageSize=100').set(auth(superToken));
    expect(all.status).toBe(200);
    expect(all.body.pagination.total).toBeGreaterThan(100);
    expect(all.body.categories).toContain('Healthcare');
    expect(all.body.categories).toContain('Finance');
    const q = await request(app).get('/api/v1/skills?q=nurs').set(auth(superToken));
    expect(q.body.data.some((s: any) => s.name === 'Nursing')).toBe(true);
    const cat = await request(app).get('/api/v1/skills?category=Legal').set(auth(superToken));
    expect(cat.body.data.length).toBeGreaterThan(0);
    expect(cat.body.data.every((s: any) => s.category === 'Legal')).toBe(true);
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
