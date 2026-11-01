import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';

const app = createApp();
let recruiterToken = '';

beforeAll(async () => {
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: 'superadmin@nexatalent.com',
    password: 'NexaTalent123',
  });
  recruiterToken = loginRes.body.data.accessToken;
});

const auth = () => ({ Authorization: `Bearer ${recruiterToken}` });

describe('ATS Phase 3: Auto-Shortlist Gating & Pipeline Progression', () => {
  let createdJobId = '';

  it('creates a job mandate with custom ATS criteria and automatic shortlist mode', async () => {
    const res = await request(app)
      .post('/api/v1/ats/jobs')
      .set(auth())
      .send({
        title: 'Senior React / Node Engineer',
        clientCompany: 'Nexaflow Labs',
        location: 'Bengaluru, India',
        workMode: 'Hybrid',
        openings: 2,
        mustHaveSkills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB'],
        niceToHaveSkills: ['Docker', 'AWS'],
        minExperienceYears: 4,
        maxExperienceYears: 8,
        minQualification: 'Bachelor Degree',
        autoShortlistThreshold: 75,
        autoShortlistMode: 'automatic',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    createdJobId = res.body.data.id;
    expect(res.body.data.autoShortlistThreshold).toBe(75);
    expect(res.body.data.autoShortlistMode).toBe('automatic');
  });

  it('automatically advances high-scoring candidate to "Shortlisted" upon application submission', async () => {
    const res = await request(app)
      .post('/api/v1/ats/applications')
      .set(auth())
      .send({
        jobId: createdJobId,
        candidateName: 'Auto Qualifier Dev',
        candidateEmail: `autoqualifier.${Date.now()}@example.com`,
        phone: '+91 9888877777',
        skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
        experienceYears: 5,
        currentTitle: 'Senior Full Stack Developer',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stage).toBe('Shortlisted');
    expect(res.body.data.matchScore).toBeGreaterThanOrEqual(75);
    expect(res.body.data.isShortlistEligible).toBe(true);
  });

  it('keeps low-scoring candidate at "Applied" stage', async () => {
    const res = await request(app)
      .post('/api/v1/ats/applications')
      .set(auth())
      .send({
        jobId: createdJobId,
        candidateName: 'Junior Python Dev',
        candidateEmail: `juniorpy.${Date.now()}@example.com`,
        phone: '+91 9777766666',
        skills: ['Python', 'Django'],
        experienceYears: 1,
        currentTitle: 'Intern',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stage).toBe('Applied');
    expect(res.body.data.matchScore).toBeLessThan(50);
    expect(res.body.data.isShortlistEligible).toBe(false);
  });

  it('serves pipeline with calculated ATS match scores and shortlistEligibleCount summary', async () => {
    const res = await request(app)
      .get(`/api/v1/ats/jobs/${createdJobId}/pipeline`)
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('summary');
    expect(res.body.data.summary).toHaveProperty('shortlistEligibleCount');
    expect(res.body.data.summary.threshold).toBe(75);

    // Verify candidate columns have ATS match properties
    const allCandidates = (res.body.data.columns || []).flatMap((c: any) => c.candidates || []);
    expect(allCandidates.length).toBeGreaterThanOrEqual(2);
    for (const c of allCandidates) {
      expect(c).toHaveProperty('matchScore');
      expect(c).toHaveProperty('matchTier');
      expect(c).toHaveProperty('isShortlistEligible');
      expect(c).toHaveProperty('atsMatch');
    }
  });

  it('executes bulk auto-shortlist for assisted mode jobs via POST /jobs/:id/auto-shortlist', async () => {
    // Create an assisted mode job
    const jobRes = await request(app)
      .post('/api/v1/ats/jobs')
      .set(auth())
      .send({
        title: 'Assisted Review Golang Dev',
        clientCompany: 'GoTech',
        mustHaveSkills: ['Go', 'PostgreSQL'],
        minExperienceYears: 3,
        autoShortlistThreshold: 70,
        autoShortlistMode: 'assisted',
      });

    const assistedJobId = jobRes.body.data.id;

    // Apply high-scoring candidate
    await request(app)
      .post('/api/v1/ats/applications')
      .set(auth())
      .send({
        jobId: assistedJobId,
        candidateName: 'Golang Expert',
        candidateEmail: `godev.${Date.now()}@example.com`,
        skills: ['Go', 'PostgreSQL', 'Docker'],
        experienceYears: 4,
        currentTitle: 'Senior Go Developer',
      });

    // In assisted mode, initial stage is Applied
    const pipelineBefore = await request(app)
      .get(`/api/v1/ats/jobs/${assistedJobId}/pipeline`)
      .set(auth());

    expect(pipelineBefore.body.data.summary.shortlistEligibleCount).toBe(1);

    // Trigger bulk auto-shortlist
    const autoRes = await request(app)
      .post(`/api/v1/ats/jobs/${assistedJobId}/auto-shortlist`)
      .set(auth())
      .send({});

    expect(autoRes.status).toBe(200);
    expect(autoRes.body.success).toBe(true);
    expect(autoRes.body.data.shortlistedCount).toBe(1);
    expect(autoRes.body.data.candidatesMoved[0].candidateName).toBe('Golang Expert');

    // Verify pipeline stage moved to Shortlisted
    const pipelineAfter = await request(app)
      .get(`/api/v1/ats/jobs/${assistedJobId}/pipeline`)
      .set(auth());

    const shortlistedCol = pipelineAfter.body.data.columns.find((c: any) => c.stageName === 'Shortlisted');
    expect(shortlistedCol).toBeDefined();
    expect(shortlistedCol.candidates.some((c: any) => c.candidateName === 'Golang Expert')).toBe(true);
  });
});
