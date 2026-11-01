import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';

const app = createApp();
let superToken = '';

beforeAll(async () => {
  const s = await request(app).post('/api/v1/auth/login').send({ email: 'superadmin@nexatalent.com', password: 'NexaTalent123' });
  superToken = s.body.data.accessToken;
});

const auth = () => ({ Authorization: `Bearer ${superToken}` });

describe('ATS Phase 5: Automation, Reminders & Advanced Reporting', () => {
  it('serves funnel report with step conversions, drop-offs, and efficiency', async () => {
    const res = await request(app)
      .get('/api/v1/ats/reports/funnel')
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.funnelSteps)).toBe(true);
    expect(res.body.data.funnelSteps.length).toBe(7);
    expect(res.body.data.funnelSteps[0].stage).toBe('Applied');
    expect(res.body.data).toHaveProperty('overallFunnelEfficiency');
  });

  it('serves time-to-hire report with stage dwell times and benchmark', async () => {
    const res = await request(app)
      .get('/api/v1/ats/reports/time-to-hire')
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.avgTimeToHireDays).toBe('number');
    expect(Array.isArray(res.body.data.stageDwellTimes)).toBe(true);
    expect(res.body.data.stageDwellTimes[0]).toHaveProperty('avgDays');
    expect(res.body.data.stageDwellTimes[0]).toHaveProperty('benchmarkDays');
  });

  it('serves source effectiveness report with channel conversion yields', async () => {
    const res = await request(app)
      .get('/api/v1/ats/reports/sources')
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.sources)).toBe(true);
    expect(res.body.data).toHaveProperty('topSource');
    const first = res.body.data.sources[0];
    expect(first).toHaveProperty('channel');
    expect(first).toHaveProperty('interviewConversionPct');
    expect(first).toHaveProperty('conversionYieldPct');
  });

  it('serves recruiter workload & performance report', async () => {
    const res = await request(app)
      .get('/api/v1/ats/reports/recruiter-workload')
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.recruiters)).toBe(true);
    const rec = res.body.data.recruiters[0];
    expect(rec).toHaveProperty('email');
    expect(rec).toHaveProperty('assignedJobsCount');
    expect(rec).toHaveProperty('activeCandidatesCount');
    expect(rec).toHaveProperty('performanceScore');
  });

  it('serves recruiter follow-up reminders center', async () => {
    const res = await request(app)
      .get('/api/v1/ats/reminders/recruiter')
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('summary');
    expect(Array.isArray(res.body.data.staleApplications)).toBe(true);
    expect(Array.isArray(res.body.data.upcomingInterviews)).toBe(true);
    expect(Array.isArray(res.body.data.pendingFeedback)).toBe(true);
  });

  it('executes background automation sweep without errors', async () => {
    const res = await request(app)
      .post('/api/v1/ats/automation/sweep')
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('remindedInterviewsCount');
    expect(res.body.data).toHaveProperty('flaggedStaleCount');
  });
});
