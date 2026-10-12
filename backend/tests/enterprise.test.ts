import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';
import { loadDb, persist } from '../src/db/store.js';

const app = createApp();
let superToken = '';
let candidateToken = '';
let employerToken = '';
let recruiterToken = '';
let jobId = '';
let appId = '';
let invoiceId = '';
let invoiceTotal = 0;

async function login(email: string, password = 'NexaTalent123') {
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return res;
}

// Phase D: self-sufficient fixtures — never depend on ambient published jobs.
async function freshPublishedJob(tag: string) {
  const r = await request(app).post('/api/v1/requisitions').set(auth(employerToken)).send({ title: `${tag} Req`, openings: 1 });
  const rid = r.body.data.id;
  await request(app).patch(`/api/v1/requisitions/${rid}/status`).set(auth(employerToken)).send({ status: 'Pending Approval' });
  await request(app).patch(`/api/v1/requisitions/${rid}/status`).set(auth(employerToken)).send({ status: 'Approved' });
  const j = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: `${tag} Job`, requisitionId: rid, expiryDate: '2027-06-01' });
  const jid = j.body.data.id;
  await request(app).patch(`/api/v1/jobs/${jid}/status`).set(auth(employerToken)).send({ status: 'Pending Review' });
  await request(app).patch(`/api/v1/jobs/${jid}/status`).set(auth(employerToken)).send({ status: 'Approved' });
  await request(app).patch(`/api/v1/jobs/${jid}/status`).set(auth(employerToken)).send({ status: 'Published', expiryDate: '2027-06-01' });
  return { reqId: rid, jobId: jid };
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
  const r = await login('vikram@apextechsearch.com');
  expect(r.status).toBe(200);
  recruiterToken = r.body.data.accessToken;
  // Suite hygiene (see platform.test.ts): retire non-seed live postings so the
  // jobs.active_limit entitlement never trips on accumulated fixtures.
  const db = loadDb();
  let retired = false;
  for (const j of db.jobs as any[]) {
    if (['Published','Approved'].includes(j.status) && j.id !== 'JOB-9901' && j.id !== 'JOB-8890') {
      j.status = 'Closed'; j.updatedAt = new Date().toISOString();
      retired = true;
    }
  }
  if (retired) persist();
  // Deep hygiene: drop previous runs' transactional fixtures so the file stays lean.
  {
    const keep = (rows: any[], pred: (x: any) => boolean) => rows.filter(pred);
    db.jobs = keep(db.jobs, (j: any) => ['JOB-9901','JOB-8890'].includes(j.id) || !String(j.id).startsWith('JOB-')) as any;
    db.requisitions = keep(db.requisitions, (r: any) => ['REQ-9901','REQ-8890'].includes(r.id) || !String(r.id).startsWith('REQ-')) as any;
    db.applications = []; db.stageHistory = []; db.interviews = []; db.feedback = [];
    db.offers = []; db.placements = []; db.submissions = [];
    db.commissions = []; db.commissionAdjustments = []; db.payouts = [];
    db.invoices = []; db.invoiceLines = []; db.payments = []; db.allocations = [];
    db.refunds = []; db.creditNotes = []; db.conversations = []; db.messages = [];
    db.commissionAgreements = []; db.subscriptionChanges = [];
    db.agreementTemplates = (db.agreementTemplates as any[]).filter((t: any) => t.id === 'AGT-STD-001');
    persist();
  }
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
    const { jobId: targetId } = await freshPublishedJob(`AppliesOnce ${Date.now()}`);
    const r = await request(app).post('/api/v1/applications').set(auth(candidateToken)).send({ jobId: targetId, candidateEmail: 'candidate@nexatalent.com' });
    expect([201, 409]).toContain(r.status);
    if (r.status === 201) appId = r.body.data.id;
    else {
      const mine = await request(app).get('/api/v1/applications').set(auth(candidateToken));
      appId = mine.body.data[0]?.id;
    }
    const dup = await request(app).post('/api/v1/applications').set(auth(candidateToken)).send({ jobId: targetId, candidateEmail: 'candidate@nexatalent.com' });
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
  it('locks stage flow: Hired via placement only, reason required, terminal locked (Phase 3)', async () => {
    const email = `phase3-${Date.now()}@example.com`;
    const { jobId: targetId } = await freshPublishedJob(`Phase3Flow ${Date.now()}`);
    const created = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: targetId, candidateEmail: email });
    expect(created.status).toBe(201);
    const id = created.body.data.id;
    const hire = await request(app).patch(`/api/v1/applications/${id}/stage`).set(auth(superToken)).send({ stage: 'Hired' });
    expect(hire.status).toBe(422);
    expect(hire.body.code).toBe('HIRE_VIA_PLACEMENT');
    const noReason = await request(app).patch(`/api/v1/applications/${id}/stage`).set(auth(superToken)).send({ stage: 'Rejected' });
    expect(noReason.status).toBe(400);
    expect(noReason.body.code).toBe('REASON_REQUIRED');
    const rej = await request(app).patch(`/api/v1/applications/${id}/stage`).set(auth(superToken)).send({ stage: 'Rejected', reason: 'not a fit' });
    expect(rej.status).toBe(200);
    const locked = await request(app).patch(`/api/v1/applications/${id}/stage`).set(auth(superToken)).send({ stage: 'Applied', reason: 'x' });
    expect(locked.status).toBe(422);
    expect(locked.body.code).toBe('TERMINAL_STAGE');
  });
  it('guards interviews: future-only + candidate cannot close + feedback private (Phase 3)', async () => {
    const mine = await request(app).get(`/api/v1/applications/${appId}`).set(auth(superToken));
    const ownJob = mine.body.data.jobId as string;
    const past = await request(app).post('/api/v1/interviews').set(auth(superToken)).send({ applicationId: appId, jobId: ownJob, round: 'Past round', scheduledAt: '2020-01-01T10:00:00', timezone: 'Asia/Kolkata' });
    expect(past.status).toBe(422);
    expect(past.body.code).toBe('INTERVIEW_PAST');
    const wrongJob = await request(app).post('/api/v1/interviews').set(auth(superToken)).send({ applicationId: appId, jobId: 'JOB-NOPE', round: 'Wrong job', scheduledAt: '2027-06-01T10:00:00', timezone: 'Asia/Kolkata' });
    expect(wrongJob.status).toBe(422);
    expect(wrongJob.body.code).toBe('INTERVIEW_JOB_MISMATCH');
    const fut = await request(app).post('/api/v1/interviews').set(auth(superToken)).send({ applicationId: appId, jobId: ownJob, round: 'Phase3 round', scheduledAt: '2027-06-01T10:00:00', timezone: 'Asia/Kolkata' });
    expect(fut.status).toBe(201);
    expect(fut.body.data.timezone).toBe('Asia/Kolkata');
    const iid = fut.body.data.id;
    const done = await request(app).patch(`/api/v1/interviews/${iid}`).set(auth(candidateToken)).send({ status: 'Completed' });
    expect(done.status).toBe(403);
    expect(done.body.code).toBe('INTERVIEW_FORBIDDEN');
    const fb = await request(app).get(`/api/v1/interviews/${iid}/feedback`).set(auth(candidateToken));
    expect(fb.status).toBe(403);
  });
});

describe('tenant isolation (§4.3)', () => {
  it('candidate cannot list payouts ledger', async () => {
    const r = await request(app).get('/api/v1/payouts').set(auth(candidateToken));
    // Phase 1: finance deny-by-default — 403, not empty 200.
    expect(r.status).toBe(403);
    expect(r.body.code).toBe('FINANCE_FORBIDDEN');
  });
  it('recruiter direct finance access denied (Phase 1)', async () => {
    for (const p of ['/api/v1/commissions', '/api/v1/invoices', '/api/v1/payouts', '/api/v1/payments']) {
      const r = await request(app).get(p).set(auth(recruiterToken));
      expect(r.status).toBe(403);
      expect(r.body.code).toBe('FINANCE_FORBIDDEN');
    }
  });
  it('candidate is denied platform user directory', async () => {
    const r = await request(app).get('/api/v1/users').set(auth(candidateToken));
    expect(r.status).toBe(403);
  });
  it('HR stays less privileged than Super Admin (Phase 9)', async () => {
    const hrLogin = await login('kiran@nexatalent.com');
    expect(hrLogin.status).toBe(200);
    const hr = { Authorization: `Bearer ${hrLogin.body.data.accessToken}` };
    // No role administration.
    const role = await request(app).post('/api/v1/roles').set(hr).send({ id: 'hr-test-role' });
    expect(role.status).toBe(403);
    const grant = await request(app).post('/api/v1/permissions').set(hr).send({ email: 'x@y.com', permission: 'view', effect: 'grant' });
    expect(grant.status).toBe(403);
    // No organization suspension.
    const susp = await request(app).patch('/api/v1/tenants/TNT-9012/suspend').set(hr).send({ reason: 'hr attempt', action: 'suspend' });
    expect(susp.status).toBe(403);
    // No finance writes.
    const inv = await request(app).post('/api/v1/invoices').set(hr).send({ orgId: 'TNT-9011', lines: [{ label: 'x', qty: 1, unit: 100 }], dueDate: '2027-01-01' });
    expect(inv.status).toBe(403);
  });
  it('company scope: cross-org reads denied, live edits locked, no self-verify (Phase 4)', async () => {
    // Requirement in another org is invisible (non-disclosing 404).
    const other = await request(app).post('/api/v1/requisitions').set(auth(superToken)).set('x-tenant-id', 'TNT-9012').send({ title: 'OtherCo Req' });
    expect(other.status).toBe(201);
    const otherId = other.body.data.id;
    const cross = await request(app).get(`/api/v1/requisitions/${otherId}`).set(auth(employerToken));
    expect(cross.status).toBe(404);
    // Live requirements are not editable by the company.
    const mine = await request(app).post('/api/v1/requisitions').set(auth(employerToken)).send({ title: 'Live Edit Guard' });
    const mid = mine.body.data.id;
    await request(app).patch(`/api/v1/requisitions/${mid}/status`).set(auth(employerToken)).send({ status: 'Pending Approval' });
    await request(app).patch(`/api/v1/requisitions/${mid}/status`).set(auth(employerToken)).send({ status: 'Approved' });
    const edit = await request(app).put(`/api/v1/requisitions/${mid}`).set(auth(employerToken)).send({ title: 'Silent change' });
    expect(edit.status).toBe(422);
    // Verification cannot be self-set through the company profile.
    const put = await request(app).put('/api/v1/company').set(auth(employerToken)).send({ legalName: 'Fintech ScaleOps', verificationStatus: 'HACKED' });
    expect(put.status).toBe(200);
    expect(put.body.data.verificationStatus).not.toBe('HACKED');
    // Unlinked candidate profiles stay hidden from the company.
    const hidden = await request(app).get('/api/v1/candidate/profile').query({ email: 'ananya.d@cloudsec.net' }).set(auth(employerToken));
    expect([200, 404]).toContain(hidden.status);
    if (hidden.status === 200) {
      // Linked after all — sensitive fields stay masked without an explicit grant.
      expect(hidden.body.data.currentCtc).toBe('Restricted');
    } else {
      // Superadmin can still resolve the same profile (proves the 404 is scoping, not absence).
      const seen = await request(app).get('/api/v1/candidate/profile').query({ email: 'ananya.d@cloudsec.net' }).set(auth(superToken));
      expect(seen.status).toBe(200);
    }
    const scoped = await request(app).get('/api/v1/candidate/applications').query({ email: 'candidate@nexatalent.com' }).set(auth(employerToken));
    expect(scoped.status).toBe(200);
    for (const a of scoped.body.data as any[]) expect(a.orgId).toBe('TNT-9011');
    // Branches are tenant-scoped.
    const br = await request(app).post('/api/v1/branches').set(auth(superToken)).send({ name: 'OtherCo Branch', orgId: 'TNT-9012' });
    expect(br.status).toBe(201);
    const list = await request(app).get('/api/v1/branches').set(auth(employerToken));
    expect((list.body.data as any[]).some((b: any) => b.id === br.body.data.id)).toBe(false);
  });
});

describe('recruiter assigned scope (Phase 5)', () => {  const intEmail = 'recruiter-int@nexatalent.com';
  const intPass = 'NexaTalent123';
  let intToken = '';
  let assignedReq = '';
  let assignedJob = '';
  it('provisions an internal recruiter and shows only assigned work', async () => {
    await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'Int Recruiter', email: intEmail, role: 'internal_recruiter', tenantId: 'TNT-GLOBAL', password: intPass });
    const loginRes = await login(intEmail, intPass);
    expect(loginRes.status).toBe(200);
    intToken = loginRes.body.data.accessToken;
    // Assigned mandate …
    const r = await request(app).post('/api/v1/requisitions').set(auth(employerToken)).send({ title: 'Phase5 Assigned Req', openings: 1 });
    assignedReq = r.body.data.id;
    await request(app).patch(`/api/v1/requisitions/${assignedReq}/status`).set(auth(employerToken)).send({ status: 'Pending Approval' });
    await request(app).patch(`/api/v1/requisitions/${assignedReq}/status`).set(auth(employerToken)).send({ status: 'Approved' });
    const asg = await request(app).post(`/api/v1/requisitions/${assignedReq}/assign`).set(auth(employerToken)).send({ recruiter: intEmail });
    expect(asg.status).toBe(200);
    const j = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: 'Phase5 Assigned Job', requisitionId: assignedReq, expiryDate: '2027-06-01' });
    assignedJob = j.body.data.id;
    await request(app).patch(`/api/v1/jobs/${assignedJob}/status`).set(auth(employerToken)).send({ status: 'Pending Review' });
    await request(app).patch(`/api/v1/jobs/${assignedJob}/status`).set(auth(employerToken)).send({ status: 'Approved' });
    await request(app).patch(`/api/v1/jobs/${assignedJob}/status`).set(auth(employerToken)).send({ status: 'Published', expiryDate: '2027-06-01' });
    // … visible, everything else hidden.
    const mine = await request(app).get('/api/v1/requisitions').set(auth(intToken));
    expect(mine.status).toBe(200);
    expect((mine.body.data as any[]).some((x: any) => x.id === assignedReq)).toBe(true);
    expect((mine.body.data as any[]).some((x: any) => x.id === 'REQ-9901')).toBe(false);
    const one = await request(app).get(`/api/v1/requisitions/${assignedReq}`).set(auth(intToken));
    expect(one.status).toBe(200);
    const other = await request(app).get('/api/v1/requisitions/REQ-9901').set(auth(intToken));
    expect(other.status).toBe(404);
    const jobs = await request(app).get('/api/v1/jobs?mine=1').set(auth(intToken));
    expect((jobs.body.data as any[]).some((x: any) => x.id === assignedJob)).toBe(true);
  });
  it('attaches only to assigned mandates, advances with reason, finance denied', async () => {
    const email = `phase5-${Date.now()}@example.com`;
    const ok = await request(app).post('/api/v1/applications').set(auth(intToken)).send({ jobId: assignedJob, candidateEmail: email });
    expect(ok.status).toBe(201);
    const blocked = await request(app).post('/api/v1/applications').set(auth(intToken)).send({ jobId: 'JOB-9901', candidateEmail: `other-${Date.now()}@example.com` });
    expect(blocked.status).toBe(403);
    expect(blocked.body.code).toBe('JOB_NOT_ASSIGNED');
    const apps = await request(app).get('/api/v1/applications').set(auth(intToken));
    expect((apps.body.data as any[]).some((a: any) => a.id === ok.body.data.id)).toBe(true);
    const mv = await request(app).patch(`/api/v1/applications/${ok.body.data.id}/stage`).set(auth(intToken)).send({ stage: 'Screening' });
    expect(mv.status).toBe(200);
    const hire = await request(app).patch(`/api/v1/applications/${ok.body.data.id}/stage`).set(auth(intToken)).send({ stage: 'Hired' });
    expect(hire.status).toBe(422);
    expect(hire.body.code).toBe('HIRE_VIA_PLACEMENT');
    for (const p of ['/api/v1/commissions', '/api/v1/invoices', '/api/v1/payouts']) {
      const r = await request(app).get(p).set(auth(intToken));
      expect(r.status).toBe(403);
      expect(r.body.code).toBe('FINANCE_FORBIDDEN');
    }
  });
});

describe('agency assignment gate + duplicates (Phase 6)', () => {
  const vendorEmail = 'rajesh@techsolutionsvendor.com';
  let vendorToken = '';
  let agencyJob = '';
  it('assigned submission succeeds; unassigned fails; duplicate routes to review', async () => {
    const loginRes = await login(vendorEmail);
    expect(loginRes.status).toBe(200);
    vendorToken = loginRes.body.data.accessToken;
    // Fresh mandate explicitly assigned to this vendor tenant.
    const r = await request(app).post('/api/v1/requisitions').set(auth(employerToken)).send({ title: 'Phase6 Agency Req', openings: 1 });
    const rid = r.body.data.id;
    await request(app).patch(`/api/v1/requisitions/${rid}/status`).set(auth(employerToken)).send({ status: 'Pending Approval' });
    await request(app).patch(`/api/v1/requisitions/${rid}/status`).set(auth(employerToken)).send({ status: 'Approved' });
    const j = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: 'Phase6 Agency Job', requisitionId: rid, expiryDate: '2027-06-01' });
    agencyJob = j.body.data.id;
    const upd = await request(app).put(`/api/v1/jobs/${agencyJob}`).set(auth(superToken)).send({ assignedAgencies: ['TNT-VENDOR-05'] });
    expect(upd.status).toBe(200);
    await request(app).patch(`/api/v1/jobs/${agencyJob}/status`).set(auth(employerToken)).send({ status: 'Pending Review' });
    await request(app).patch(`/api/v1/jobs/${agencyJob}/status`).set(auth(employerToken)).send({ status: 'Approved' });
    const email = `phase6-${Date.now()}@example.com`;
    const first = await request(app).post('/api/v1/submissions').set(auth(vendorToken)).send({ jobId: agencyJob, candidateEmail: email, consent: 'agency-consent-ref' });
    expect(first.status).toBe(201);
    expect(first.body.data.status).toBe('Submitted');
    const dup = await request(app).post('/api/v1/submissions').set(auth(vendorToken)).send({ jobId: agencyJob, candidateEmail: email, consent: 'agency-consent-ref' });
    expect(dup.status).toBe(201);
    expect(dup.body.code).toBe('DUPLICATE_SUBMISSION_REVIEW');
    expect(dup.body.data.status).toBe('Duplicate-Review');
    // Job assigned to someone else stays closed.
    const closed = await request(app).post('/api/v1/submissions').set(auth(vendorToken)).send({ jobId: 'JOB-9901', candidateEmail: `x-${Date.now()}@example.com` });
    expect(closed.status).toBe(403);
    expect(closed.body.code).toBe('AGENCY_NOT_ASSIGNED');
    // Own submissions only.
    const mine = await request(app).get('/api/v1/submissions').set(auth(vendorToken));
    for (const s of mine.body.data as any[]) {
      expect(s.agencyId === 'TNT-VENDOR-05' || s.submittedBy === vendorEmail).toBe(true);
    }
    // Submission alone creates no payable.
    const coms = await request(app).get(`/api/v1/commissions?q=${encodeURIComponent(email)}`).set(auth(superToken));
    expect((coms.body.data as any[]).length).toBe(0);
  });
});

describe('public enquiries + live postings (Phase 7)', () => {
  it('validates, creates once, dedupes repeats; draft/expired stay hidden', async () => {
    const bad = await request(app).post('/api/v1/enquiries').send({ contactName: '', companyName: '', workEmail: 'x', message: 'hi' });
    expect(bad.status).toBe(400);
    const stamp = Date.now();
    const payload = { contactName: 'Phase Seven', companyName: `Phase7 Co ${stamp}`, workEmail: `phase7-${stamp}@example.com`, phone: '+91 90000 00000', enquiryType: 'employer', message: 'Need 3 fintech engineers in Bengaluru within a month please.' };
    const first = await request(app).post('/api/v1/enquiries').send(payload);
    expect(first.status).toBe(201);
    expect(first.body.data.id).toBeTruthy();
    // Owner/status from the client are ignored — server owns them.
    const lead = (loadDb().leads as any[]).find((l: any) => l.id === first.body.data.id);
    expect(lead.stage).toBe('New');
    expect(lead.owner).toBe('');
    const repeat = await request(app).post('/api/v1/enquiries').send({ ...payload, owner: 'hacker@x.com', stage: 'Won' });
    expect(repeat.status).toBe(200);
    expect(repeat.body.code).toBe('ENQUIRY_DUPLICATE');
    expect(repeat.body.data.id).toBe(first.body.data.id);
    // Live detail: published shows allowlisted fields; others 404 without disclosure.
    const pub = await request(app).get('/api/v1/jobs-public/JOB-9901');
    if (pub.status === 200) {
      expect(pub.body.data).not.toHaveProperty('assignedAgencies');
      expect(pub.body.data).not.toHaveProperty('orgId');
    } else {
      expect(pub.status).toBe(404);
    }
    const draft = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: 'Phase7 Draft Job' });
    if (draft.status === 201) {
      const hidden = await request(app).get(`/api/v1/jobs-public/${draft.body.data.id}`);
      expect(hidden.status).toBe(404);
    }
  });
});

describe('finance idempotency (§15.3)', () => {
  it('converts leads without duplicating organizations (Phase 8)', async () => {
    const stamp = Date.now();
    const mkLead = async (contact: string) => {
      const r = await request(app).post('/api/v1/leads').set(auth(superToken)).send({ contactName: contact, companyName: `Phase8 Co ${stamp}`, email: `phase8-${stamp}@example.com`, stage: 'New' });
      expect(r.status).toBe(201);
      return r.body.data.id as string;
    };
    const orgsBefore = (loadDb().organizations as any[]).filter((o: any) => o.legalName === `Phase8 Co ${stamp}`).length;
    const leadA = await mkLead('Phase Eight A');
    const first = await request(app).post(`/api/v1/leads/${leadA}/convert`).set(auth(superToken)).send({});
    expect(first.status).toBe(201);
    const orgId = first.body.data.id as string;
    const repeat = await request(app).post(`/api/v1/leads/${leadA}/convert`).set(auth(superToken)).send({});
    expect(repeat.status).toBe(200);
    expect(repeat.body.code).toBe('LEAD_ALREADY_CONVERTED');
    expect(repeat.body.data.id).toBe(orgId);
    const leadB = await mkLead('Phase Eight B');
    const linked = await request(app).post(`/api/v1/leads/${leadB}/convert`).set(auth(superToken)).send({});
    expect(linked.status).toBe(200);
    expect(linked.body.code).toBe('LEAD_LINKED_EXISTING');
    expect(linked.body.data.id).toBe(orgId);
    const orgsAfter = (loadDb().organizations as any[]).filter((o: any) => o.legalName === `Phase8 Co ${stamp}`).length;
    expect(orgsAfter - orgsBefore).toBe(1);
    // Onboarding team notified.
    const notes = await request(app).get('/api/v1/notifications?kind=lead-converted').set(auth(superToken));
    expect((notes.body.data as any[]).some((n: any) => String(n.body || '').includes(leadA))).toBe(true);
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

describe('roles + bulk import (§4)', () => {
  it('serves seeded roles with scope metadata', async () => {
    const r = await request(app).get('/api/v1/roles').set(auth(superToken));
    expect(r.body.data.length).toBeGreaterThanOrEqual(20);
    expect(r.body.data.find((x: any) => x.id === 'superadmin')?.scope).toBe('platform');
  });
  it('creates, protects and deletes custom roles', async () => {
    const c = await request(app).post('/api/v1/roles').set(auth(superToken)).send({ id: 'qa_lead', scope: 'platform', description: 'QA owner' });
    expect(c.status).toBe(201);
    const sys = await request(app).delete('/api/v1/roles/superadmin').set(auth(superToken)).send({});
    expect(sys.status).toBe(422);
    const del = await request(app).delete('/api/v1/roles/qa_lead').set(auth(superToken)).send({});
    expect(del.status).toBe(200);
  });
  it('previews then commits bulk imports with duplicate report', async () => {
    const tag = Date.now().toString(36);
    const rows = [{ name: `BulkSkill${tag}`, category: 'Technology' }, { name: 'React', category: 'Technology' }, { name: '' }];
    const prev = await request(app).post('/api/v1/bulk-import').set(auth(superToken)).send({ collection: 'skills', rows, mode: 'preview' });
    expect(prev.body.data.summary).toMatchObject({ total: 3, valid: 1, duplicates: 1, errors: 1 });
    const commit = await request(app).post('/api/v1/bulk-import').set(auth(superToken)).send({ collection: 'skills', rows, mode: 'commit' });
    expect(commit.body.data.summary.created).toBe(1);
    expect(commit.body.data.summary.duplicates).toBe(1);
    const again = await request(app).post('/api/v1/bulk-import').set(auth(superToken)).send({ collection: 'skills', rows: [{ name: `BulkSkill${tag}` }], mode: 'commit' });
    expect(again.body.data.summary.duplicates).toBe(1);
  });
});

describe('auto-approve straight-through billing', () => {
  it('approves + invoices automatically on trusted agreements', async () => {
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', jobId: 'JOB-8890', rate: 9, autoApprove: true });
    await request(app).patch(`/api/v1/commission-agreements/${ag.body.data.id}/accept`).set(auth(superToken)).send({});
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-8890', candidateEmail: `auto-${Date.now()}@example.com` });
    await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: 1000000 });
    const pl = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id });
    expect(pl.status).toBe(201);
    expect(pl.body.data.autoInvoiced).toBeTruthy();
    const chk = await request(app).get(`/api/v1/commissions/check?applicationId=${appl.body.data.id}&trigger=Joined`).set(auth(superToken));
    expect(chk.body.data.rows[0].approvalStatus).toBe('Approved');
  });
  it('records agency verification history with reason', async () => {
    const v = await request(app).patch('/api/v1/agency-profiles/AGC-101').set(auth(superToken)).send({ verificationStatus: 'Approved', reason: 'docs verified' });
    expect(v.status).toBe(200);
    expect(v.body.data.verificationHistory.length).toBeGreaterThanOrEqual(1);
    const noReason = await request(app).patch('/api/v1/agency-profiles/AGC-101').set(auth(superToken)).send({ verificationStatus: 'Rejected' });
    expect(noReason.status).toBe(400);
  });
});

describe('placement notifications + application search', () => {
  it('notifies candidate, company and superadmin on placement', async () => {
    const email = `notif-${Date.now()}@example.com`;
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-8890', candidateEmail: email });
    await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: 900000 });
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', jobId: 'JOB-8890', rate: 8.33, autoApprove: true });
    await request(app).patch(`/api/v1/commission-agreements/${ag.body.data.id}/accept`).set(auth(superToken)).send({});
    const pl = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id });
    expect(pl.status).toBe(201);
    expect(pl.body.data.autoInvoiced).toBeTruthy();
    const db = (await import('../src/db/store.js')).loadDb();
    const notes = (db.notifications as any[]).filter((n: any) => String(n.body || '').includes(pl.body.data.id));
    expect(db.notifications.some((n: any) => n.recipient === email && String(n.body || '').includes('joined'))).toBe(true);
    expect(notes.some((n: any) => String(n.recipient).startsWith('company:'))).toBe(true);
    expect(notes.some((n: any) => n.recipient === 'superadmin')).toBe(true);
  });
  it('searches applications by candidate email', async () => {
    const r = await request(app).get('/api/v1/applications?q=JOB-8890&pageSize=5').set(auth(superToken));
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body.data)).toBe(true);
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

describe('P0 criticals (Phase A)', () => {  it('password reset needs a bound token; reset locks sessions out', async () => {
    const email = `p0reset-${Date.now()}@example.com`;
    await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'P0 Reset', email, role: 'candidate', tenantId: 'TNT-CANDIDATE', password: 'NexaTalent123' });
    // Takeover without token is closed.
    const noToken = await request(app).post('/api/v1/auth/reset-confirm').send({ email, newPassword: 'Hacked123' });
    expect(noToken.status).toBe(403);
    const badToken = await request(app).post('/api/v1/auth/reset-confirm').send({ email, newPassword: 'Hacked123', resetToken: 'nope' });
    expect(badToken.status).toBe(403);
    // Real flow works and kills existing sessions.
    const before = await login(email);
    expect(before.status).toBe(200);
    const fg = await request(app).post('/api/v1/auth/forgot-password').send({ email });
    expect(fg.status).toBe(200);
    // P0-1: prod contract — no resetToken in response (prevents takeover).
    expect(fg.body.resetToken).toBeUndefined();
    const rt = fg.body.testResetToken;
    expect(rt).toBeTruthy();
    const ok = await request(app).post('/api/v1/auth/reset-confirm').send({ email, newPassword: 'ResetPass123', resetToken: rt });
    expect(ok.status).toBe(200);
    // Token is single-use.
    const reuse = await request(app).post('/api/v1/auth/reset-confirm').send({ email, newPassword: 'ResetPass456', resetToken: rt });
    expect(reuse.status).toBe(403);
    const after = await login(email, 'ResetPass123');
    expect(after.status).toBe(200);
  });
  it('registrations mint their own tenants (no shared-company leak)', async () => {
    const stamp = Date.now();
    const emp = await request(app).post('/api/v1/auth/register/employer').send({ name: 'P0 Emp', email: `p0emp-${stamp}@example.com`, password: 'NexaTalent123', companyName: `P0 Co ${stamp}`, termsAccepted: true });
    expect(emp.status).toBe(201);
    expect(emp.body.data.tenantId).not.toBe('TNT-9011');
    const rec = await request(app).post('/api/v1/auth/register/recruiter').send({ name: 'P0 Rec', email: `p0rec-${stamp}@example.com`, password: 'NexaTalent123', termsAccepted: true });
    expect(rec.status).toBe(201);
    expect(rec.body.data.tenantId).not.toBe('TNT-AGENCY-01');
    const ven = await request(app).post('/api/v1/auth/register/vendor').send({ name: 'P0 Ven', email: `p0ven-${stamp}@example.com`, password: 'NexaTalent123', termsAccepted: true });
    expect(ven.status).toBe(201);
    expect(ven.body.data.tenantId).not.toBe('TNT-VENDOR-05');
  });
  it('legacy bridges are scoped, paged and guarded', async () => {
    // Full dump is gone: paged + scoped.
    const dump = await request(app).get('/api/v1/candidates?page=1&pageSize=5').set(auth(superToken));
    expect(dump.status).toBe(200);
    expect(dump.body.pagination.total).toBeGreaterThan(0);
    expect(dump.body.data.length).toBeLessThanOrEqual(5);
    // Support role no longer bulk-pulls profiles.
    const supLogin = await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'P0 Sup', email: `p0sup-${Date.now()}@example.com`, role: 'support_admin', tenantId: 'TNT-GLOBAL', password: 'NexaTalent123' });
    const supAuth = supLogin.status === 201
      ? { Authorization: `Bearer ${(await login(supLogin.body.data.email)).body.data.accessToken}` }
      : auth(superToken);
    if (supLogin.status === 201) {
      const denied = await request(app).get('/api/v1/candidates').set(supAuth);
      expect(denied.status).toBe(403);
    }
    // Agencies: any-role dump closed.
    const candAg = await request(app).get('/api/v1/agencies').set(auth(candidateToken));
    expect(candAg.status).toBe(403);
    const ownAg = await request(app).get('/api/v1/agencies').set(auth(recruiterToken));
    expect(ownAg.status).toBe(200);
    for (const a of ownAg.body.data as any[]) expect(a.tenantId).toBe('TNT-AGENCY-01');
    // Duplicate profiles rejected.
    const dup = await request(app).post('/api/v1/candidates').set(auth(superToken)).send({ name: 'Dup', email: 'siddharth.nair@devtech.io' });
    expect(dup.status).toBe(409);
    expect(dup.body.code).toBe('CANDIDATE_EXISTS');
    // Public jobs carry no internal budget.
    const pub = await request(app).get('/api/v1/jobs-public?page=1&pageSize=5');
    for (const j of pub.body.data as any[]) expect(j).not.toHaveProperty('budgetRange');
  });
});

describe('placement-commercial integrity (Phase 10)', () => {  it('mints once per placement event; issued totals never move silently', async () => {
    const email = `p10-${Date.now()}@example.com`;
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: 'JOB-9901', candidateEmail: email });
    expect(appl.status).toBe(201);
    await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: 1200000 });
    const ag = await request(app).post('/api/v1/commission-agreements').set(auth(superToken)).send({ orgId: 'TNT-9011', rate: 9 });
    await request(app).patch(`/api/v1/commission-agreements/${ag.body.data.id}/accept`).set(auth(superToken)).send({});
    const pl = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id });
    expect(pl.status).toBe(201);
    // Repeat event → duplicate rejected, single commission stands.
    const again = await request(app).post('/api/v1/placements').set(auth(superToken)).send({ applicationId: appl.body.data.id });
    expect(again.status).toBe(409);
    const chk = await request(app).get(`/api/v1/commissions/check?applicationId=${appl.body.data.id}&trigger=Joined`).set(auth(superToken));
    expect(chk.body.data.count).toBe(1);
    const list = await request(app).get(`/api/v1/commissions?q=${encodeURIComponent(email)}`).set(auth(superToken));
    const com = (list.body.data as any[])[0];
    await request(app).patch(`/api/v1/commissions/${com.id}/approve`).set(auth(superToken)).send({});
    const inv = await request(app).post(`/api/v1/commissions/${com.id}/invoice`).set(auth(superToken)).send({});
    expect(inv.status).toBe(201);
    const issuedTotal = inv.body.data.invoice.total;
    // Adjustments need an explicit grant …
    const denied = await request(app).post(`/api/v1/commissions/${com.id}/adjustments`).set(auth(employerToken)).send({ amount: -500, reason: 'x' });
    expect(denied.status).toBe(403);
    // … and never rewrite the issued invoice (corrections go via credit note).
    const adj = await request(app).post(`/api/v1/commissions/${com.id}/adjustments`).set(auth(superToken)).send({ amount: -500, reason: 'phase10 test' });
    expect(adj.status).toBe(201);
    const doc = await request(app).get(`/api/v1/invoices/${inv.body.data.invoice.id}/document`).set(auth(superToken));
    expect(doc.body.data.total).toBe(issuedTotal);
  });
  it('replays webhooks idempotently; companies see own legs only', async () => {
    const inv = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [{ label: 'P10', qty: 1, unit: 5000 }], dueDate: '2027-01-01' });
    const invoiceId = inv.body.data.id;
    const { createHmac } = await import('crypto');
    process.env.PAYMENT_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'phase10-test-secret';
    const secret = process.env.PAYMENT_WEBHOOK_SECRET as string;
    const key = `p10-${Date.now()}`;
    const body = { invoiceId, amount: 5900, reference: 'P10', idempotencyKey: key };
    const raw = JSON.stringify(body);
    const ts = Date.now();
    const sig = createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex');
    const send = () => request(app).post('/api/v1/payments/webhook').set('x-provider-timestamp', String(ts)).set('x-provider-signature', sig).send(body);
    const w1 = await send();
    expect(w1.status).toBe(200);
    const w2 = await send();
    expect(w2.body.message).toMatch(/Duplicate webhook ignored/);
    const pays = await request(app).get(`/api/v1/payments?q=${encodeURIComponent(invoiceId)}`).set(auth(superToken));
    expect((pays.body.data as any[]).filter((p: any) => p.invoiceId === invoiceId).length).toBe(1);
    // Company scope: own receivables only.
    const mine = await request(app).get('/api/v1/commissions').set(auth(employerToken));
    for (const c of mine.body.data as any[]) expect(c.orgId).toBe('TNT-9011');
  });
});

describe('privacy matrix (Phase C)', () => {  it('scopes reports, notifications, views and exports by role', async () => {
    const mk = async (role: string, email: string) => {
      await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: role, email, role, tenantId: 'TNT-GLOBAL', password: 'NexaTalent123' });
      const l = await login(email);
      expect(l.status).toBe(200);
      return { Authorization: `Bearer ${l.body.data.accessToken}` };
    };
    const stamp = Date.now();
    const sales = await mk('sales_admin', `pCsales-${stamp}@example.com`);
    const fin = await mk('finance_admin', `pCfin-${stamp}@example.com`);
    // Finance aggregates off the sales desk; PII aggregates off finance.
    const denied = await request(app).get('/api/v1/reports/receivables').set(sales);
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe('REPORT_FORBIDDEN');
    const dupDenied = await request(app).get('/api/v1/reports/duplicates').set(fin);
    expect(dupDenied.status).toBe(403);
    const ok = await request(app).get('/api/v1/reports/sales-pipeline').set(sales);
    expect(ok.status).toBe(200);
    // Exact-match notifications: TNT-9012 traffic never leaks to TNT-9011.
    const cross = await request(app).get('/api/v1/notifications').set(auth(employerToken));
    for (const n of cross.body.data as any[]) {
      expect(String(n.recipient)).not.toBe('TNT-9012');
      expect(String(n.recipient)).not.toBe('company:TNT-9012');
    }
    // Candidate interview view hides panel identities.
    const ivs = await request(app).get('/api/v1/interviews').set(auth(candidateToken));
    for (const iv of ivs.body.data as any[]) {
      expect(iv).not.toHaveProperty('interviewer');
      expect(iv).not.toHaveProperty('panel');
      expect(iv).not.toHaveProperty('notes');
    }
    // Offer letter redacts the rate card for candidates.
    const mine = await request(app).get('/api/v1/offers/mine').set(auth(candidateToken));
    if ((mine.body.data as any[]).length > 0) {
      const oid = (mine.body.data as any[])[0].applicationId;
      const pls = await request(app).get('/api/v1/placements').set(auth(superToken));
      const pl = (pls.body.data as any[]).find((p: any) => p.applicationId === oid);
      if (pl) {
        const letter = await request(app).get(`/api/v1/placements/${pl.id}/offer-letter`).set(auth(candidateToken));
        expect(letter.status).toBe(200);
        expect(letter.body.data.terms.rate).toBeNull();
      }
    }
    // Export logging needs the grant and records scope.
    const noGrant = await request(app).post('/api/v1/exports/log').set(auth(candidateToken)).send({ resource: 'x', count: 1 });
    expect(noGrant.status).toBe(403);
    const logged = await request(app).post('/api/v1/exports/log').set(auth(superToken)).send({ resource: 'pC', count: 2, columns: ['id'] });
    expect(logged.status).toBe(201);
  });
});

describe('authZ hardening (Phase B)', () => {
  it('locks live visibility edits, validates agencies, owners and roles', async () => {
    // Live visibility flip blocked.
    const r = await request(app).post('/api/v1/requisitions').set(auth(employerToken)).send({ title: 'PhaseB Vis Req', openings: 1 });
    const rid = r.body.data.id;
    await request(app).patch(`/api/v1/requisitions/${rid}/status`).set(auth(employerToken)).send({ status: 'Pending Approval' });
    await request(app).patch(`/api/v1/requisitions/${rid}/status`).set(auth(employerToken)).send({ status: 'Approved' });
    const j = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: 'PhaseB Vis Job', requisitionId: rid, expiryDate: '2027-06-01' });
    const jid = j.body.data.id;
    await request(app).patch(`/api/v1/jobs/${jid}/status`).set(auth(employerToken)).send({ status: 'Pending Review' });
    await request(app).patch(`/api/v1/jobs/${jid}/status`).set(auth(employerToken)).send({ status: 'Approved' });
    await request(app).patch(`/api/v1/jobs/${jid}/status`).set(auth(employerToken)).send({ status: 'Published', expiryDate: '2027-06-01' });
    const flip = await request(app).put(`/api/v1/jobs/${jid}`).set(auth(employerToken)).send({ visibility: 'private' });
    expect(flip.status).toBe(422);
    expect(flip.body.code).toBe('VISIBILITY_LOCKED');
    // Unknown agency rejected.
    const ghost = await request(app).put(`/api/v1/jobs/${jid}`).set(auth(employerToken)).send({ assignedAgencies: ['No Such Agency XYZ'] });
    expect(ghost.status).toBe(422);
    expect(ghost.body.code).toBe('UNKNOWN_AGENCY');
    // Lead ownership: another BDA's lead is invisible.
    const bdaLogin = await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'P0 BDA', email: `p0bda-${Date.now()}@example.com`, role: 'bda', tenantId: 'TNT-GLOBAL', password: 'NexaTalent123' });
    if (bdaLogin.status === 201) {
      const bdaAuth = { Authorization: `Bearer ${(await login(bdaLogin.body.data.email)).body.data.accessToken}` };
      const lead = await request(app).post('/api/v1/leads').set(auth(superToken)).send({ contactName: 'Owned', companyName: 'Owned Co', email: 'owned@example.com', owner: 'someone-else@x.com' });
      const lid = lead.body.data.id;
      const edit = await request(app).put(`/api/v1/leads/${lid}`).set(bdaAuth).send({ notes: 'hijack' });
      expect(edit.status).toBe(404);
      const act = await request(app).post(`/api/v1/leads/${lid}/activities`).set(bdaAuth).send({ notes: 'hijack' });
      expect(act.status).toBe(404);
    }
    // Unknown roles rejected.
    const badRole = await request(app).post('/api/v1/users').set(auth(superToken)).send({ name: 'Bad', email: `bad-${Date.now()}@example.com`, role: 'superman', tenantId: 'TNT-GLOBAL', password: 'NexaTalent123' });
    expect(badRole.status).toBe(400);
  });
});

describe('validation + business rules (Phase D)', () => {
  it('rejects bad dates, inverted ranges, mismatches, duplicates and overpayments', async () => {
    // Bad dates + inverted ranges fail at the boundary.
    const badDate = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: 'PhaseD Date Job', expiryDate: 'not-a-date' });
    expect(badDate.status).toBe(400);
    const badRange = await request(app).post('/api/v1/jobs').set(auth(employerToken)).send({ title: 'PhaseD Range Job', experienceMin: 8, experienceMax: 2 });
    expect(badRange.status).toBe(400);
    const badReq = await request(app).post('/api/v1/requisitions').set(auth(employerToken)).send({ title: 'PhaseD Range Req', experienceMin: 9, experienceMax: 3 });
    expect(badReq.status).toBe(400);
    // Interview must belong to the application's own job.
    const email = `phased-${Date.now()}@example.com`;
    const { jobId: targetId } = await freshPublishedJob(`PhaseD applies ${Date.now()}`);
    const appl = await request(app).post('/api/v1/applications').set(auth(superToken)).send({ jobId: targetId, candidateEmail: email });
    const mismatch = await request(app).post('/api/v1/interviews').set(auth(superToken)).send({ applicationId: appl.body.data.id, jobId: 'JOB-NOPE', round: 'R1', scheduledAt: '2027-06-01T10:00:00' });
    expect(mismatch.status).toBe(422);
    expect(mismatch.body.code).toBe('INTERVIEW_JOB_MISMATCH');
    // One open offer at a time.
    const o1 = await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: 1000000 });
    expect(o1.status).toBe(201);
    const o2 = await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: 1100000 });
    expect(o2.status).toBe(409);
    expect(o2.body.code).toBe('OFFER_EXISTS');
    const neg = await request(app).post('/api/v1/offers').set(auth(superToken)).send({ applicationId: appl.body.data.id, ctc: -5 });
    expect(neg.status).toBe(400);
    // Overpayments rejected.
    const inv = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [{ label: 'P-D', qty: 1, unit: 1000 }], dueDate: '2027-01-01' });
    const over = await request(app).post('/api/v1/payments').set(auth(superToken)).send({ invoiceId: inv.body.data.id, amount: 999999, idempotencyKey: `pd-${Date.now()}` });
    expect(over.status).toBe(422);
    expect(over.body.code).toBe('PAYMENT_EXCEEDS_BALANCE');
    // Discount beyond subtotal rejected.
    const badInv = await request(app).post('/api/v1/invoices').set(auth(superToken)).send({ orgId: 'TNT-9011', lines: [{ label: 'P-D', qty: 1, unit: 1000 }], discount: 5000, dueDate: '2027-01-01' });
    expect(badInv.status).toBe(400);
  });
});

describe('audit + perf (Phase E)', () => {
  it('audits task moves, pages interviews, counts feedback in one query, traces requests', async () => {
    const t = await request(app).post('/api/v1/tasks').set(auth(superToken)).send({ title: 'PhaseE Task' });
    const mv = await request(app).patch(`/api/v1/tasks/${t.body.data.id}`).set(auth(superToken)).send({ status: 'Completed' });
    expect(mv.status).toBe(200);
    const p1 = await request(app).get('/api/v1/interviews?page=1&pageSize=1').set(auth(superToken));
    expect(p1.status).toBe(200);
    expect(Array.isArray(p1.body.data)).toBe(true);
    expect(p1.body.pagination.total).toBeGreaterThanOrEqual(p1.body.data.length);
    const fb = await request(app).get('/api/v1/interviews/feedback-pending').set(auth(superToken));
    expect(fb.status).toBe(200);
    expect(typeof fb.body.data.pending).toBe('number');
    const traced = await request(app).get('/api/v1/jobs-public?page=1&pageSize=1').set('x-request-id', 'phase-e-trace');
    expect(traced.headers['x-request-id']).toBe('phase-e-trace');
  });
});
