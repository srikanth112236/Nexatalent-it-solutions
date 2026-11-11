import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app/index.js';

const app = createApp();
let superToken = '';
let candidateToken = '';

beforeAll(async () => {
  const s = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'superadmin@nexatalent.com', password: 'NexaTalent123' });
  superToken = s.body.data.accessToken;

  const c = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'candidate@nexatalent.com', password: 'NexaTalent123' });
  candidateToken = c.body.data.accessToken;
});

const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

describe('Nexa Courses & Course Leads API', () => {
  it('lists all 6 seeded published courses publicly', async () => {
    const res = await request(app).get('/api/v1/courses-public');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const names = res.body.data.map((c: any) => c.shortName);
    expect(names).toEqual(
      expect.arrayContaining([
        'Java Full Stack',
        'MERN Stack',
        'MEAN Stack',
        'Python Full Stack',
        'Power BI',
        'Data Analyst',
      ]),
    );
  });

  it('validates mandatory student enquiry fields and tags leads to the enrolled course', async () => {
    const invalid = await request(app).post('/api/v1/course-leads').send({
      courseId: 'CRS-JAVA-FS',
      studentName: 'A',
      mobileNumber: '123',
      educationBackground: 'Graduate',
      preferredTrainingMode: 'Online',
    });
    expect(invalid.status).toBe(400);

    const uniqueMobile = `98${Math.floor(10000000 + Math.random() * 89999999)}`;
    const created = await request(app).post('/api/v1/course-leads').send({
      courseId: 'CRS-MERN-FS',
      studentName: 'Rohan Kulkarni',
      mobileNumber: uniqueMobile,
      educationBackground: 'Final-year student',
      preferredTrainingMode: 'Offline – Bengaluru',
      sourcePage: '/courses/mern-stack',
    });
    expect(created.status).toBe(201);
    expect(created.body.data.courseId).toBe('CRS-MERN-FS');
    expect(created.body.data.courseShortName).toBe('MERN Stack');
    expect(created.body.data.stage).toBe('New');

    const leadId = created.body.data.id;

    // Candidate role cannot view course leads
    const forbidden = await request(app).get('/api/v1/course-leads').set(auth(candidateToken));
    expect(forbidden.status).toBe(403);

    // SuperAdmin views leads grouped by course and updates counselling stage
    const list = await request(app)
      .get('/api/v1/course-leads?courseId=CRS-MERN-FS')
      .set(auth(superToken));
    expect(list.status).toBe(200);
    expect(list.body.data.some((l: any) => l.id === leadId)).toBe(true);
    expect(list.body.summary.total).toBeGreaterThanOrEqual(1);

    const patched = await request(app)
      .patch(`/api/v1/course-leads/${leadId}`)
      .set(auth(superToken))
      .send({
        stage: 'Counselled',
        counsellorOwner: 'superadmin@nexatalent.com',
        addNote: 'Explained MERN syllabus and batch timing.',
      });
    expect(patched.status).toBe(200);
    expect(patched.body.data.stage).toBe('Counselled');
    expect(patched.body.data.activities.length).toBeGreaterThanOrEqual(2);

    // Cleanup test lead
    const del = await request(app).delete(`/api/v1/course-leads/${leadId}`).set(auth(superToken));
    expect(del.status).toBe(200);
  });

  it('allows superadmin to edit a course and reflects updates on public endpoint', async () => {
    const adminList = await request(app).get('/api/v1/courses').set(auth(superToken));
    expect(adminList.status).toBe(200);
    const java = adminList.body.data.find((c: any) => c.id === 'CRS-JAVA-FS');
    expect(java).toBeTruthy();

    const updated = await request(app)
      .put(`/api/v1/courses/${java.id}`)
      .set(auth(superToken))
      .send({ admissionsBadge: 'Admissions Open – Bengaluru & Online (Weekend + Weekday)' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.admissionsBadge).toContain('Weekend + Weekday');

    // Restore original badge
    await request(app)
      .put(`/api/v1/courses/${java.id}`)
      .set(auth(superToken))
      .send({ admissionsBadge: java.admissionsBadge });
  });
});
