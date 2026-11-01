import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';

const app = createApp();
let adminToken = '';

beforeAll(async () => {
  const res = await request(app).post('/api/v1/auth/login').send({
    email: 'superadmin@nexatalent.com',
    password: 'NexaTalent123',
  });
  adminToken = res.body.data.accessToken;
});

describe('ATS Website Application Direct Routing (Bypassing Sales Leads)', () => {
  it('routes website candidate application directly to ATS Candidates & Applications, NOT sales leads', async () => {
    const candidateEmail = `direct.ats.${Date.now()}@example.com`;

    // 1. Candidate submits on website job page
    const enquiryRes = await request(app)
      .post('/api/v1/enquiries')
      .send({
        contactName: 'Direct Web Candidate',
        companyName: 'Candidate interest — Senior Full Stack Engineer (JOB-9901)',
        workEmail: candidateEmail,
        phone: '+91-9988776655',
        enquiryType: 'candidate',
        formName: 'Careers',
        jobId: 'JOB-9901',
        message: 'Role: Senior Full Stack Engineer · Experience: 5 yrs · Notice period: 15 days · Current CTC: 20 LPA',
      });

    expect(enquiryRes.status).toBe(201);
    expect(enquiryRes.body.success).toBe(true);
    expect(enquiryRes.body.isCandidateApplication).toBe(true);
    expect(enquiryRes.body.data.applicationId).toBeDefined();

    // 2. Check Sales Leads — candidate application MUST NOT be in db.leads
    const leadsRes = await request(app)
      .get('/api/v1/leads')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(leadsRes.status).toBe(200);
    const inLeads = (leadsRes.body.data || leadsRes.body.items || []).some(
      (l: any) => String(l.email).toLowerCase() === candidateEmail.toLowerCase()
    );
    expect(inLeads).toBe(false);

    // 3. Check ATS Applications — MUST exist with calculated match score
    const appsRes = await request(app)
      .get('/api/v1/ats/applications')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(appsRes.status).toBe(200);
    const appRecord = (appsRes.body.data || appsRes.body.items || []).find(
      (a: any) => String(a.candidateEmail).toLowerCase() === candidateEmail.toLowerCase()
    );
    expect(appRecord).toBeDefined();
    expect(appRecord.candidateName).toBe('Direct Web Candidate');
    expect(appRecord.source).toBe('Website Careers');
    expect(typeof appRecord.matchScore).toBe('number');
    expect(appRecord.matchScore).toBeGreaterThan(0);

    // 4. Check ATS Candidate CRM — MUST exist in candidateProfiles
    const candRes = await request(app)
      .get(`/api/v1/ats/candidates?q=${candidateEmail}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(candRes.status).toBe(200);
    const candRecord = (candRes.body.data?.items || candRes.body.data || []).find(
      (c: any) => String(c.email).toLowerCase() === candidateEmail.toLowerCase()
    );
    expect(candRecord).toBeDefined();
    expect(candRecord.name).toBe('Direct Web Candidate');
    expect(candRecord.source).toBe('Website Careers');
  });

  it('keeps genuine employer business enquiries in sales leads', async () => {
    const employerEmail = `business.client.${Date.now()}@acmehire.io`;

    const enquiryRes = await request(app)
      .post('/api/v1/enquiries')
      .send({
        contactName: 'Talent Acquisition VP',
        companyName: 'Acme Enterprise Tech',
        workEmail: employerEmail,
        phone: '+91-9876543210',
        enquiryType: 'employer',
        formName: 'Contact Us',
        message: 'Looking to hire a contract-to-hire team of 10 Golang & React senior developers.',
      });

    expect(enquiryRes.status).toBe(201);
    expect(enquiryRes.body.isCandidateApplication).toBeFalsy();

    // Verify it IS present in sales leads
    const leadsRes = await request(app)
      .get('/api/v1/leads')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(leadsRes.status).toBe(200);
    const inLeads = (leadsRes.body.data || leadsRes.body.items || []).some(
      (l: any) => String(l.email).toLowerCase() === employerEmail.toLowerCase()
    );
    expect(inLeads).toBe(true);
  });
});
