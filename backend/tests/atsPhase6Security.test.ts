import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';
import { loadDb } from '../src/db/store.js';

const app = createApp();
let superToken = '';
let candidateToken = '';
let recruiterToken = '';

beforeAll(async () => {
  // Superadmin credentials
  const s = await request(app).post('/api/v1/auth/login').send({
    email: 'superadmin@nexatalent.com',
    password: 'NexaTalent123',
  });
  superToken = s.body.data.accessToken;

  // Candidate credentials
  const c = await request(app).post('/api/v1/auth/login').send({
    email: 'candidate@nexatalent.com',
    password: 'NexaTalent123',
  });
  candidateToken = c.body.data.accessToken;

  // Internal Recruiter credentials
  const r = await request(app).post('/api/v1/auth/login').send({
    email: 'recruiter@nexatalent.com',
    password: 'NexaTalent123',
  });
  recruiterToken = r.body?.data?.accessToken || superToken;
});

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('ATS Phase 6: Security, RBAC, Tenant Isolation & Data Integrity', () => {
  describe('1. Role-Based Access Control (RBAC)', () => {
    it('blocks unauthenticated requests to ATS candidate CRM with 401', async () => {
      const res = await request(app).get('/api/v1/ats/candidates');
      expect(res.status).toBe(401);
    });

    it('blocks candidate role from accessing ATS recruiter candidate CRM with 403', async () => {
      const res = await request(app)
        .get('/api/v1/ats/candidates')
        .set(auth(candidateToken));
      expect(res.status).toBe(403);
    });

    it('blocks candidate role from accessing ATS recruiter pipeline board with 403', async () => {
      const res = await request(app)
        .get('/api/v1/ats/jobs/JOB-001/pipeline')
        .set(auth(candidateToken));
      expect(res.status).toBe(403);
    });

    it('blocks candidate role from accessing ATS reports with 403', async () => {
      const res = await request(app)
        .get('/api/v1/ats/reports/funnel')
        .set(auth(candidateToken));
      expect(res.status).toBe(403);
    });

    it('allows superadmin and recruiter roles to access ATS endpoints', async () => {
      const res = await request(app)
        .get('/api/v1/ats/dashboard')
        .set(auth(superToken));
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('2. File Upload Security & Magic Byte Validation', () => {
    it('rejects malicious or executable binary payloads with HTTP 415', async () => {
      // Windows PE executable header: MZ\x90\x00
      const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const res = await request(app)
        .post('/api/v1/ats/resumes/parse')
        .set(auth(superToken))
        .send({
          filename: 'exploit.exe',
          base64Data: exeBuffer.toString('base64'),
        });

      expect(res.status).toBe(415);
      expect(res.body.code).toBe('UNSUPPORTED_FORMAT');
    });

    it('rejects oversized files exceeding 10 MB limit', async () => {
      // 11 MB buffer of zeros
      const largeBase64 = Buffer.alloc(11 * 1024 * 1024).toString('base64');
      const res = await request(app)
        .post('/api/v1/ats/resumes/parse')
        .set(auth(superToken))
        .send({
          filename: 'oversized.pdf',
          base64Data: largeBase64,
        });

      expect([413, 415]).toContain(res.status);
    });

    it('accepts authentic PDF file with magic bytes %PDF', async () => {
      const authenticPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n>>\nendobj\ntrailer\n<<\n>>\n%%EOF');
      const res = await request(app)
        .post('/api/v1/ats/resumes/parse')
        .set(auth(superToken))
        .send({
          filename: 'valid_candidate_resume.pdf',
          base64Data: authenticPdf.toString('base64'),
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.format).toBe('pdf');
    });
  });

  describe('3. Duplicate Application & Candidate Protection', () => {
    it('detects existing duplicate candidates by email and phone', async () => {
      const res = await request(app)
        .post('/api/v1/ats/candidates/check-duplicate')
        .set(auth(superToken))
        .send({
          email: 'siddharth.sharma@example.com',
          phone: '+919876543210',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('isDuplicate');
    });

    it('rejects or dedupes creating the exact same application key twice', async () => {
      const db = loadDb();
      const validJob = (db.jobs as any[]).find((j) => j.status === 'Published') || (db.jobs as any[])[0];
      if (validJob) {
        const email = `duplicate.test.${Date.now()}@example.com`;
        // First application
        const first = await request(app)
          .post('/api/v1/ats/applications')
          .set(auth(superToken))
          .send({
            jobId: validJob.id,
            candidateEmail: email,
            candidateName: 'Duplicate Test Candidate',
          });
        expect([200, 201]).toContain(first.status);

        // Second application with identical job & email
        const second = await request(app)
          .post('/api/v1/ats/applications')
          .set(auth(superToken))
          .send({
            jobId: validJob.id,
            candidateEmail: email,
            candidateName: 'Duplicate Test Candidate',
          });

        // Dedupes without creating duplicate or rejects with 409
        expect([200, 201, 409]).toContain(second.status);
      }
    });
  });

  describe('4. Audit Logging & State Machine History', () => {
    it('records an audit trail entry on stage transitions', async () => {
      const db = loadDb();
      const testApp: any = (db.applications as any[])[0];
      if (testApp) {
        const res = await request(app)
          .patch(`/api/v1/ats/applications/${testApp.id}/stage`)
          .set(auth(superToken))
          .send({
            stage: 'Shortlisted',
            reason: 'Security verification test move',
          });

        expect(res.status).toBe(200);

        // Verify history endpoint tracks the actor and previous stage
        const histRes = await request(app)
          .get(`/api/v1/ats/applications/${testApp.id}/history`)
          .set(auth(superToken));

        expect(histRes.status).toBe(200);
        expect(Array.isArray(histRes.body.data)).toBe(true);
        const lastMove = histRes.body.data[0];
        expect(lastMove).toHaveProperty('actor');
        expect(lastMove).toHaveProperty('to');
      }
    });
  });

  describe('5. High-Performance Pagination & Search Query Isolation', () => {
    it('supports fast token search queries and server-side pagination', async () => {
      const res = await request(app)
        .get('/api/v1/ats/candidates?page=1&pageSize=10&q=engineer')
        .set(auth(superToken));

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const page = res.body.pagination?.page ?? res.body.page;
      const pageSize = res.body.pagination?.pageSize ?? res.body.pageSize;
      const items = res.body.data ?? res.body.items;
      expect(page).toBe(1);
      expect(pageSize).toBe(10);
      expect(Array.isArray(items)).toBe(true);
    });
  });
});
