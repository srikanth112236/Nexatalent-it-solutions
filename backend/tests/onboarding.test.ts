import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';
import { loadDb } from '../src/db/store.js';

/**
 * Onboarding is a FIRST-TIME flow. These tests pin the contract the portals rely
 * on: registration seeds an incomplete onboarding, completing it is persisted
 * server-side, and a later profile edit never wipes the completion flag.
 */
const app = createApp();
let superToken = '';
const stamp = Date.now().toString(36);
const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

async function login(email: string, password = 'NexaTalent123') {
  return request(app).post('/api/v1/auth/login').send({ email, password });
}

beforeAll(async () => {
  const s = await login('superadmin@nexatalent.com');
  expect(s.status).toBe(200);
  superToken = s.body.data.accessToken;
});

describe('onboarding is first-time only', () => {
  it('candidate registration seeds onboarding at step 1 (not completed)', async () => {
    const email = `ob-cand-${stamp}@example.com`;
    const reg = await request(app).post('/api/v1/auth/register/candidate').send({
      name: 'OB Candidate', email, password: 'NexaTalent123', termsAccepted: true,
    });
    expect(reg.status).toBe(201);
    const p = loadDb().candidateProfiles.find((x: any) => String(x.email).toLowerCase() === email);
    expect(p).toBeTruthy();
    expect(p.onboarding?.completed).not.toBe(true);
    expect(Number(p.onboarding?.step)).toBe(1);
  });

  it('candidate completion persists across reads and later profile edits', async () => {
    const email = `ob-cand-${stamp}@example.com`;
  const token = (await login(email)).body.data.accessToken;

    // Partial progress is saved but not "done".
    const partial = await request(app).put('/api/v1/candidate/profile').set(auth(token)).send({
      email, onboarding: { step: 4, updatedAt: new Date().toISOString() },
    });
    expect(partial.status).toBe(200);
    expect(partial.body.data.onboarding.completed).not.toBe(true);

    // Finishing marks it complete with a timestamp.
    const done = await request(app).put('/api/v1/candidate/profile').set(auth(token)).send({
      email,
      onboarding: { step: 9, completed: true, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    });
    expect(done.status).toBe(200);
    expect(done.body.data.onboarding.completed).toBe(true);
    expect(done.body.data.onboarding.completedAt).toBeTruthy();

    // A later profile edit keeps the completion flag.
    const edited = await request(app).put('/api/v1/candidate/profile').set(auth(token)).send({
      email, headline: 'Senior Engineer', onboarding: done.body.data.onboarding,
    });
    expect(edited.status).toBe(200);
    expect(edited.body.data.onboarding.completed).toBe(true);

    const got = await request(app).get(`/api/v1/candidate/profile?email=${encodeURIComponent(email)}`).set(auth(token));
    expect(got.status).toBe(200);
    expect(got.body.data.onboarding.completed).toBe(true);
  });

  it('company onboarding completion persists (PUT then GET)', async () => {
    const email = `ob-emp-${stamp}@example.com`;
    const reg = await request(app).post('/api/v1/auth/register/employer').send({
      name: 'OB Employer', email, password: 'NexaTalent123', companyName: `OB Co ${stamp}`, termsAccepted: true,
    });
    expect(reg.status).toBe(201);
    const token = (await login(email)).body.data.accessToken;

    const save = await request(app).put('/api/v1/company').set(auth(token)).send({
      legalName: `OB Co ${stamp}`,
      displayName: `OB Co ${stamp}`,
      onboarding: { completed: true, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    });
    expect(save.status).toBe(200);
    expect(save.body.data.onboarding.completed).toBe(true);

    const after = await request(app).get('/api/v1/company').set(auth(token));
    expect(after.status).toBe(200);
    expect(after.body.data.onboarding.completed).toBe(true);
  });

  it('agency onboarding completion persists for agency_admin', async () => {
    const email = `ob-ag-${stamp}@example.com`;
    // Provision a tenant, then an agency_admin for it, purely through the API.
    const org = await request(app).post('/api/v1/tenants').set(auth(superToken)).send({
      legalName: `OB Agency Co ${stamp}`, displayName: `OB Agency Co ${stamp}`,
    });
    expect(org.status).toBe(201);
    const tid = org.body.data.id;

    const created = await request(app).post('/api/v1/users').set(auth(superToken)).send({
      name: 'OB Agency Admin', email, role: 'agency_admin', tenantId: tid, password: 'NexaTalent123',
    });
    expect(created.status).toBe(201);
    const ag = await request(app).post('/api/v1/agency-profiles').set(auth(superToken)).send({
      legalName: 'OB Agency', displayName: 'OB Agency', tenantId: tid, contactEmail: email,
    });
    expect(ag.status).toBe(201);
    const agId = ag.body.data.id;

    const token = (await login(email)).body.data.accessToken;
    const save = await request(app).patch(`/api/v1/agency-profiles/${agId}`).set(auth(token)).send({
      displayName: 'OB Agency',
      onboarding: { completed: true, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    });
    expect(save.status).toBe(200);
    expect(save.body.data.onboarding.completed).toBe(true);

    const list = await request(app).get('/api/v1/agency-profiles').set(auth(superToken));
    const rows = Array.isArray(list.body.data) ? list.body.data : list.body.data.data;
    const row = rows.find((a: any) => a.id === agId);
    expect(row.onboarding.completed).toBe(true);
  });
});
