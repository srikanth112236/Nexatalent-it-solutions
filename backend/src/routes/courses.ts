import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { loadDb, persist, uid, nowIso, audit } from '../db/store.js';
import { requireAuth, ctxOf } from '../middleware/rbac.js';

export const coursesRouter = Router();

const courseLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
});

const COURSE_ADMINS = ['superadmin', 'platform_owner', 'operations_admin'];
const LEAD_VIEWERS = [
  'superadmin',
  'platform_owner',
  'operations_admin',
  'sales_admin',
  'sales_manager',
  'employee',
  'bda',
];

const EDUCATION_OPTIONS = ['Graduate', 'Final-year student', 'Working professional', 'Other'] as const;
const MODE_OPTIONS = ['Offline – Bengaluru', 'Online'] as const;
const LEAD_STAGES = ['New', 'Counselled', 'Demo Scheduled', 'Enrolled', 'Follow-up', 'Dropped'] as const;

function slugify(s: string): string {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function formatInr(amount: number): string {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) return '₹0';
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function normalizePhone(raw: string): string {
  return String(raw || '').replace(/[^\d+]/g, '').slice(0, 20);
}

// ---- Public: list published courses ----
coursesRouter.get('/courses-public', (_req: Request, res: Response) => {
  const db = loadDb();
  const rows = ((db.courses || []) as any[])
    .filter((c) => !c.deleted && c.status !== 'Draft')
    .sort((a, b) => Number(a.sortOrder ?? 99) - Number(b.sortOrder ?? 99));
  res.json({ success: true, data: rows });
});

// ---- Public: submit course enquiry lead (mandatory 4 fields + course binding) ----
coursesRouter.post('/course-leads', courseLeadLimiter, (req: Request, res: Response) => {
  const b: any = req.body || {};
  const studentName = String(b.studentName || '').trim().slice(0, 120);
  const mobileRaw = String(b.mobileNumber || '').trim();
  const digits = mobileRaw.replace(/\D/g, '');
  const educationBackground = String(b.educationBackground || '').trim();
  const preferredTrainingMode = String(b.preferredTrainingMode || '').trim();
  const courseRef = String(b.courseId || b.courseSlug || '').trim();
  const notes = String(b.notes || '').trim().slice(0, 1000);
  const sourcePage = String(b.sourcePage || '/courses').trim().slice(0, 200);

  if (studentName.length < 2) {
    return res.status(400).json({ success: false, message: 'Student name is required (at least 2 characters).' });
  }
  if (digits.length < 10 || digits.length > 15) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
  }
  if (!EDUCATION_OPTIONS.includes(educationBackground as any)) {
    return res.status(400).json({ success: false, message: 'Please select a valid education background.' });
  }
  if (!MODE_OPTIONS.includes(preferredTrainingMode as any)) {
    return res.status(400).json({ success: false, message: 'Please select a preferred training mode.' });
  }

  const db = loadDb();
  const courses = (db.courses || []) as any[];
  const matchedCourse =
    courses.find((c) => !c.deleted && (c.id === courseRef || c.slug === courseRef || c.shortName === courseRef)) ||
    courses.find((c) => !c.deleted && c.status !== 'Draft');

  if (!matchedCourse) {
    return res.status(400).json({ success: false, message: 'Please select a valid course.' });
  }

  if (!Array.isArray(db.courseLeads)) db.courseLeads = [];
  const normalizedPhone = normalizePhone(mobileRaw);
  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const dup = db.courseLeads.find(
    (l: any) =>
      !l.deleted &&
      l.courseId === matchedCourse.id &&
      normalizePhone(l.mobileNumber).slice(-10) === digits.slice(-10) &&
      new Date(l.createdAt || 0).getTime() > dayAgo,
  );

  if (dup) {
    return res.status(200).json({
      success: true,
      code: 'COURSE_LEAD_DUPLICATE',
      message: `Your enquiry for ${matchedCourse.shortName || matchedCourse.title} is already registered. Our academic counsellor will reach out shortly.`,
      data: dup,
    });
  }

  const ts = nowIso();
  const lead = {
    id: uid('CLEAD'),
    courseId: matchedCourse.id,
    courseSlug: matchedCourse.slug,
    courseShortName: matchedCourse.shortName || matchedCourse.title,
    courseTitle: matchedCourse.title,
    studentName,
    mobileNumber: normalizedPhone || mobileRaw,
    educationBackground,
    preferredTrainingMode,
    stage: 'New',
    counsellorOwner: '',
    notes,
    sourcePage,
    activities: [
      {
        id: uid('CACT'),
        type: 'enquiry',
        notes: `Enquired for ${matchedCourse.shortName || matchedCourse.title} (${preferredTrainingMode} · ${educationBackground})`,
        actor: 'student',
        createdAt: ts,
      },
    ],
    createdAt: ts,
    updatedAt: ts,
  };

  db.courseLeads.unshift(lead);
  audit('website', `COURSE_LEAD_RECEIVED:${lead.id}`, 'TNT-GLOBAL', 'courseLead', lead.id, req.ip, {
    courseId: matchedCourse.id,
    courseShortName: lead.courseShortName,
  });
  persist();

  res.status(201).json({
    success: true,
    message: `Thank you ${studentName}! Your enquiry for ${lead.courseShortName} has been received.`,
    data: lead,
  });
});

// ---- Admin: list all courses + lead counts ----
coursesRouter.get('/courses', requireAuth(LEAD_VIEWERS), (_req: Request, res: Response) => {
  const db = loadDb();
  const leads = ((db.courseLeads || []) as any[]).filter((l) => !l.deleted);
  const countByCourse: Record<string, number> = {};
  for (const l of leads) {
    countByCourse[l.courseId] = (countByCourse[l.courseId] || 0) + 1;
  }
  const rows = ((db.courses || []) as any[])
    .filter((c) => !c.deleted)
    .sort((a, b) => Number(a.sortOrder ?? 99) - Number(b.sortOrder ?? 99))
    .map((c) => ({ ...c, leadCount: countByCourse[c.id] || 0 }));
  res.json({ success: true, data: rows });
});

// ---- Admin: create course ----
coursesRouter.post('/courses', requireAuth(COURSE_ADMINS), (req: Request, res: Response) => {
  const b: any = req.body || {};
  const title = String(b.title || '').trim();
  const shortName = String(b.shortName || title).trim();
  if (!title || title.length < 3) {
    return res.status(400).json({ success: false, message: 'Course title is required.' });
  }

  const db = loadDb();
  if (!Array.isArray(db.courses)) db.courses = [];
  const slug = slugify(b.slug || shortName || title) || uid('course').toLowerCase();
  const feeNum = Number(b.fee ?? 0);
  const ts = nowIso();

  const course = {
    id: uid('CRS'),
    slug,
    shortName: shortName.slice(0, 60),
    eyebrow: String(b.eyebrow || `${shortName.toUpperCase()} PROGRAM`).slice(0, 120),
    title: title.slice(0, 160),
    category: String(b.category || 'Full Stack Development').slice(0, 80),
    status: b.status === 'Draft' ? 'Draft' : 'Published',
    admissionsBadge: String(b.admissionsBadge || 'Admissions Open – Bengaluru & Online').slice(0, 120),
    summary: String(b.summary || '').slice(0, 600),
    heroImage: String(
      b.heroImage ||
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    ).slice(0, 500),
    fee: Number.isFinite(feeNum) ? feeNum : 0,
    feeDisplay: String(b.feeDisplay || formatInr(feeNum)).slice(0, 40),
    duration: String(b.duration || '4 Months').slice(0, 60),
    trainingMode: String(b.trainingMode || 'Online + Offline').slice(0, 80),
    classSchedule: String(b.classSchedule || '5 Days / Week').slice(0, 80),
    roadmapHeading: String(b.roadmapHeading || 'Course structure').slice(0, 120),
    curriculumModules: Array.isArray(b.curriculumModules) ? b.curriculumModules : [],
    roadmap: Array.isArray(b.roadmap) ? b.roadmap : [],
    scheduleDetails: Array.isArray(b.scheduleDetails) ? b.scheduleDetails : [],
    studentBenefits: Array.isArray(b.studentBenefits) ? b.studentBenefits : [],
    instalments: Array.isArray(b.instalments) ? b.instalments : [],
    feeNote: String(
      b.feeNote ||
        'Illustrative instalment plan. Confirm GST treatment and applicable taxes before publishing.',
    ).slice(0, 400),
    sortOrder: Number.isFinite(Number(b.sortOrder)) ? Number(b.sortOrder) : db.courses.length + 1,
    createdAt: ts,
    updatedAt: ts,
  };

  db.courses.push(course);
  audit(ctxOf(req).email, `COURSE_CREATED:${course.id}`, 'TNT-GLOBAL', 'course', course.id, req.ip);
  persist();
  res.status(201).json({ success: true, data: course });
});

// ---- Admin: update course ----
coursesRouter.put('/courses/:id', requireAuth(COURSE_ADMINS), (req: Request, res: Response) => {
  const db = loadDb();
  const c: any = (db.courses || []).find((x: any) => x.id === req.params.id && !x.deleted);
  if (!c) return res.status(404).json({ success: false, message: 'Course not found.' });

  const b: any = req.body || {};
  const scalarFields = [
    'slug',
    'shortName',
    'eyebrow',
    'title',
    'category',
    'status',
    'admissionsBadge',
    'summary',
    'heroImage',
    'feeDisplay',
    'duration',
    'trainingMode',
    'classSchedule',
    'roadmapHeading',
    'feeNote',
  ];
  for (const k of scalarFields) {
    if (b[k] !== undefined) c[k] = String(b[k]).trim();
  }
  if (b.fee !== undefined) {
    const feeNum = Number(b.fee);
    if (Number.isFinite(feeNum) && feeNum >= 0) {
      c.fee = feeNum;
      if (!b.feeDisplay) c.feeDisplay = formatInr(feeNum);
    }
  }
  if (b.sortOrder !== undefined && Number.isFinite(Number(b.sortOrder))) {
    c.sortOrder = Number(b.sortOrder);
  }
  if (Array.isArray(b.curriculumModules)) c.curriculumModules = b.curriculumModules;
  if (Array.isArray(b.roadmap)) c.roadmap = b.roadmap;
  if (Array.isArray(b.scheduleDetails)) c.scheduleDetails = b.scheduleDetails;
  if (Array.isArray(b.studentBenefits)) c.studentBenefits = b.studentBenefits;
  if (Array.isArray(b.instalments)) c.instalments = b.instalments;

  c.updatedAt = nowIso();
  audit(ctxOf(req).email, `COURSE_UPDATED:${c.id}`, 'TNT-GLOBAL', 'course', c.id, req.ip);
  persist();
  res.json({ success: true, data: c });
});

// ---- Admin: delete (soft) course ----
coursesRouter.delete('/courses/:id', requireAuth(COURSE_ADMINS), (req: Request, res: Response) => {
  const db = loadDb();
  const c: any = (db.courses || []).find((x: any) => x.id === req.params.id && !x.deleted);
  if (!c) return res.status(404).json({ success: false, message: 'Course not found.' });
  c.deleted = true;
  c.updatedAt = nowIso();
  audit(ctxOf(req).email, `COURSE_DELETED:${c.id}`, 'TNT-GLOBAL', 'course', c.id, req.ip);
  persist();
  res.json({ success: true, data: { id: c.id, deleted: true } });
});

// ---- Admin: list course leads + course-wise summary ----
coursesRouter.get('/course-leads', requireAuth(LEAD_VIEWERS), (req: Request, res: Response) => {
  const db = loadDb();
  const all = ((db.courseLeads || []) as any[]).filter((l) => !l.deleted);
  const courseFilter = String(req.query.courseId || '').trim();
  const stageFilter = String(req.query.stage || '').trim();
  const modeFilter = String(req.query.preferredTrainingMode || '').trim();
  const eduFilter = String(req.query.educationBackground || '').trim();
  const q = String(req.query.q || '').trim().toLowerCase();

  // Compute summary across all active course leads
  const byCourseMap: Record<string, { courseId: string; courseShortName: string; count: number }> = {};
  const byStage: Record<string, number> = {};
  const byMode: Record<string, number> = {};

  for (const l of all) {
    const cid = l.courseId || 'unknown';
    if (!byCourseMap[cid]) {
      byCourseMap[cid] = {
        courseId: cid,
        courseShortName: l.courseShortName || l.courseTitle || cid,
        count: 0,
      };
    }
    byCourseMap[cid].count += 1;
    const st = l.stage || 'New';
    byStage[st] = (byStage[st] || 0) + 1;
    const md = l.preferredTrainingMode || 'Online';
    byMode[md] = (byMode[md] || 0) + 1;
  }

  let rows = all;
  if (courseFilter) rows = rows.filter((l) => l.courseId === courseFilter || l.courseSlug === courseFilter);
  if (stageFilter) rows = rows.filter((l) => l.stage === stageFilter);
  if (modeFilter) rows = rows.filter((l) => l.preferredTrainingMode === modeFilter);
  if (eduFilter) rows = rows.filter((l) => l.educationBackground === eduFilter);
  if (q) {
    rows = rows.filter((l) =>
      [l.studentName, l.mobileNumber, l.courseShortName, l.courseTitle, l.educationBackground, l.preferredTrainingMode, l.notes]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }

  res.json({
    success: true,
    data: rows,
    summary: {
      total: all.length,
      byCourse: Object.values(byCourseMap).sort((a, b) => b.count - a.count),
      byStage,
      byMode,
    },
  });
});

// ---- Admin: update course lead stage / counsellor / notes ----
coursesRouter.patch('/course-leads/:id', requireAuth(LEAD_VIEWERS), (req: Request, res: Response) => {
  const db = loadDb();
  const l: any = (db.courseLeads || []).find((x: any) => x.id === req.params.id && !x.deleted);
  if (!l) return res.status(404).json({ success: false, message: 'Course lead not found.' });

  const b: any = req.body || {};
  const ctx = ctxOf(req);
  if (!Array.isArray(l.activities)) l.activities = [];

  if (b.stage !== undefined) {
    if (!LEAD_STAGES.includes(b.stage)) {
      return res.status(400).json({ success: false, message: 'Invalid lead stage.' });
    }
    if (b.stage !== l.stage) {
      const prev = l.stage;
      l.stage = b.stage;
      l.activities.unshift({
        id: uid('CACT'),
        type: 'stage',
        notes: `Stage moved ${prev} → ${b.stage}${b.activityNote ? ` · ${String(b.activityNote).slice(0, 300)}` : ''}`,
        actor: ctx.email,
        createdAt: nowIso(),
      });
    }
  }

  if (b.counsellorOwner !== undefined) {
    l.counsellorOwner = String(b.counsellorOwner).trim().slice(0, 120);
  }
  if (b.notes !== undefined) {
    l.notes = String(b.notes).trim().slice(0, 2000);
  }
  if (b.addNote && String(b.addNote).trim()) {
    l.activities.unshift({
      id: uid('CACT'),
      type: 'note',
      notes: String(b.addNote).trim().slice(0, 1000),
      actor: ctx.email,
      createdAt: nowIso(),
    });
  }

  l.updatedAt = nowIso();
  audit(ctx.email, `COURSE_LEAD_UPDATED:${l.id}`, 'TNT-GLOBAL', 'courseLead', l.id, req.ip);
  persist();
  res.json({ success: true, data: l });
});

// ---- Admin: soft-delete course lead ----
coursesRouter.delete('/course-leads/:id', requireAuth(COURSE_ADMINS), (req: Request, res: Response) => {
  const db = loadDb();
  const l: any = (db.courseLeads || []).find((x: any) => x.id === req.params.id && !x.deleted);
  if (!l) return res.status(404).json({ success: false, message: 'Course lead not found.' });
  l.deleted = true;
  l.updatedAt = nowIso();
  audit(ctxOf(req).email, `COURSE_LEAD_DELETED:${l.id}`, 'TNT-GLOBAL', 'courseLead', l.id, req.ip);
  persist();
  res.json({ success: true, data: { id: l.id, deleted: true } });
});
