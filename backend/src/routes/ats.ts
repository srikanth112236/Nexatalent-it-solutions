import { Router, Request, Response } from 'express';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadDb, persist, uid, nowIso, audit, pushHistory } from '../db/store.js';
import { requireAuth, ctxOf, tenantOf } from '../middleware/rbac.js';
import { paginate, paged } from '../validate/schemas.js';
import { emit } from '../events/bus.js';
import { parseResumeText, extractTextFromBuffer } from '../services/atsResumeParser.js';
import { uploadFile, downloadFile, isBlobStorageConfigured, DEFAULT_CONTAINER } from '../storage/blob.js';

export const atsRouter = Router();

const UPLOAD_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data', 'uploads');
function ensureUploadDir() { if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true }); }

export const DEFAULT_STAGES = [
  { id: 'applied', name: 'Applied', order: 1, type: 'screening', color: 'blue', slaDays: 2 },
  { id: 'shortlisted', name: 'Shortlisted', order: 2, type: 'screening', color: 'indigo', slaDays: 3 },
  { id: 'tech_round', name: 'Technical Round', order: 3, type: 'interview', color: 'purple', slaDays: 5 },
  { id: 'client_interview', name: 'Client Interview', order: 4, type: 'interview', color: 'amber', slaDays: 4 },
  { id: 'offer', name: 'Offer', order: 5, type: 'offer', color: 'emerald', slaDays: 3 },
  { id: 'hired', name: 'Hired', order: 6, type: 'hired', color: 'teal', slaDays: 0 },
  { id: 'rejected', name: 'Rejected', order: 7, type: 'rejected', color: 'red', slaDays: 0 },
];

const ATS_ROLES = [
  'recruiter', 'agency_admin', 'agency_recruiter', 'internal_recruiter',
  'superadmin', 'platform_owner', 'operations_admin', 'employer', 'company_admin', 'company_recruiter', 'employee'
];

// Helper: Normalize phone for deduplication
function normalizePhone(p: string): string {
  if (!p) return '';
  const digits = String(p).replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function resolveMime(filename: string): string {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (ext === 'doc') return 'application/msword';
  return 'application/pdf';
}

// =========================================================================
// 1. ATS DASHBOARD OVERVIEW METRICS
// =========================================================================
atsRouter.get('/dashboard', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 3600 * 1000);

  let jobs = (db.jobs as any[]).filter((j) => !j.deleted);
  const apps = (db.applications as any[]);
  const candidates = (db.candidateProfiles as any[]);

  // Agency / Recruiter scoping
  if (['recruiter', 'agency_admin', 'agency_recruiter'].includes(ctx.role)) {
    const agencyName = (db.organizations as any[]).find((o: any) => o.id === ctx.tenantId)?.displayName || 'Apex Tech Search';
    jobs = jobs.filter((j) => (j.assignedAgencies || []).some((ag: string) => ag === agencyName || ag.toLowerCase().includes('apex') || ag === ctx.tenantId));
  }

  const activeJobs = jobs.filter((j) => j.status === 'Published');
  const jobIds = new Set(jobs.map((j) => j.id).concat(jobs.map((j) => j.slug).filter(Boolean)));
  const scopedApps = apps.filter((a) => jobIds.has(a.jobId) || a.source === 'Website');

  const offersCount = scopedApps.filter((a) => ['Offer', 'Selected'].includes(a.stage)).length;
  const hiredCount = scopedApps.filter((a) => a.stage === 'Hired').length;
  const recentAppsCount = scopedApps.filter((a) => new Date(a.createdAt || 0) >= weekStart).length;

  const interviewsThisWeek = (db.interviews as any[]).filter((i: any) => {
    if (!i.scheduledAt) return false;
    const t = new Date(i.scheduledAt).getTime();
    return t >= weekStart.getTime() && t <= (now.getTime() + 7 * 24 * 3600 * 1000);
  }).length;

  // Pipeline stage distribution
  const stageBreakdown: Record<string, number> = {};
  for (const s of ['Applied', 'Shortlisted', 'Technical Round', 'Client Interview', 'Offer', 'Hired', 'Rejected']) {
    stageBreakdown[s] = scopedApps.filter((a) => a.stage === s).length;
  }

  res.json({
    success: true,
    data: {
      activeJobsCount: activeJobs.length,
      totalJobsCount: jobs.length,
      totalCandidatesCount: candidates.length,
      activeApplicationsCount: scopedApps.length,
      recentApplicationsWeek: recentAppsCount,
      interviewsThisWeek,
      offersCount,
      hiredCount,
      stageBreakdown,
      recentActivity: (db.stageHistory as any[]).slice(0, 10).map((h: any) => {
        const app = apps.find((x: any) => x.id === h.applicationId);
        return {
          id: h.id,
          applicationId: h.applicationId,
          candidateName: app?.candidateName || app?.candidateEmail || 'Candidate',
          jobTitle: app?.jobTitle || app?.jobId || 'Job Mandate',
          from: h.from,
          to: h.to,
          actor: h.actor,
          timestamp: h.createdAt,
        };
      }),
    },
  });
});

// =========================================================================
// 2. ATS JOB REQUISITIONS & JOB DESCRIPTIONS
// =========================================================================
atsRouter.get('/jobs', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const { page, pageSize, q, status } = paginate.parse(req.query);

  let rows = (db.jobs as any[]).filter((j) => !j.deleted);

  if (['recruiter', 'agency_admin', 'agency_recruiter'].includes(ctx.role)) {
    const agencyName = (db.organizations as any[]).find((o: any) => o.id === ctx.tenantId)?.displayName || 'Apex Tech Search';
    rows = rows.filter((j) => (j.assignedAgencies || []).some((ag: string) => ag === agencyName || ag.toLowerCase().includes('apex') || ag === ctx.tenantId));
  }

  if (status) rows = rows.filter((j) => j.status === status);
  if (q) {
    const s = String(q).toLowerCase();
    rows = rows.filter((j) => `${j.title || ''} ${j.id || ''} ${j.location || ''} ${j.department || ''}`.toLowerCase().includes(s));
  }

  const apps = (db.applications as any[]);
  const enriched = rows.map((j) => {
    const jobApps = apps.filter((a) => a.jobId === j.id || (j.slug && a.jobId === j.slug));
    const stageCounts: Record<string, number> = {};
    for (const a of jobApps) {
      stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1;
    }
    return {
      ...j,
      totalApplicants: jobApps.length,
      stageCounts,
    };
  });

  res.json({ success: true, ...paged(enriched, page, pageSize) });
});

// Single Job Details
atsRouter.get('/jobs/:id', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const qId = String(req.params.id).toLowerCase();
  const job = (db.jobs as any[]).find((j) => String(j.id).toLowerCase() === qId || String(j.slug || '').toLowerCase() === qId);

  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  const customStages = (db.atsJobStages as any[]).filter((s) => s.jobId === job.id || s.jobId === job.slug).sort((a, b) => a.order - b.order);
  const stages = customStages.length > 0 ? customStages : DEFAULT_STAGES;

  const validIds = new Set<string>([job.id]);
  if (job.slug) validIds.add(job.slug);
  const jobApps = (db.applications as any[]).filter((a) => validIds.has(a.jobId) || (job.id === 'JOB-9903' && a.source === 'Website'));

  const stageCounts: Record<string, number> = {};
  for (const a of jobApps) {
    stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1;
  }

  res.json({
    success: true,
    data: {
      ...job,
      stages,
      applicantsCount: jobApps.length,
      stageCounts,
    },
  });
});

// Create ATS Job Requisition
atsRouter.post('/jobs', requireAuth(['superadmin', 'agency_admin', 'company_admin', 'internal_recruiter']), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const b = req.body || {};

  if (!b.title || !b.title.trim()) {
    return res.status(400).json({ success: false, message: 'Job title is required.' });
  }

  const id = uid('JOB');
  const slug = String(b.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id.toLowerCase().slice(-4);

  const job = {
    id,
    slug,
    title: String(b.title).trim(),
    department: b.department || 'Engineering',
    location: b.location || 'Pune, India',
    workMode: b.workMode || 'Hybrid',
    experienceLevel: b.experienceLevel || '6–7 Years',
    salaryMin: b.salaryMin ? Number(b.salaryMin) : 1800000,
    salaryMax: b.salaryMax ? Number(b.salaryMax) : 3200000,
    currency: b.currency || 'INR',
    openings: b.openings ? Number(b.openings) : 1,
    status: b.status || 'Published',
    description: b.description || '',
    responsibilities: b.responsibilities || [],
    requirements: b.requirements || [],
    skills: Array.isArray(b.skills) ? b.skills : String(b.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    benefits: b.benefits || [],
    assignedAgencies: b.assignedAgencies || ['Apex Tech Search'],
    assignedRecruiters: b.assignedRecruiters || [ctx.email],
    orgId: b.orgId || ctx.tenantId || 'TNT-9011',
    applicantsCount: 0,
    createdBy: ctx.email,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  db.jobs.unshift(job);

  // If custom stages provided, initialize them
  if (Array.isArray(b.stages) && b.stages.length > 0) {
    for (let i = 0; i < b.stages.length; i++) {
      const st = b.stages[i];
      db.atsJobStages.push({
        id: uid('STG'),
        jobId: job.id,
        name: st.name || `Stage ${i + 1}`,
        order: i + 1,
        type: st.type || 'screening',
        color: st.color || 'blue',
        slaDays: st.slaDays || 3,
        createdAt: nowIso(),
      });
    }
  }

  audit(ctx.email, `ATS_JOB_CREATED:${job.id}`, job.orgId, 'job', job.id, req.ip);
  persist();

  res.status(201).json({ success: true, data: job });
});

// Update ATS Job Requisition
atsRouter.put('/jobs/:id', requireAuth(['superadmin', 'agency_admin', 'company_admin', 'internal_recruiter', 'recruiter']), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const qId = String(req.params.id).toLowerCase();
  const job = (db.jobs as any[]).find((j) => String(j.id).toLowerCase() === qId || String(j.slug || '').toLowerCase() === qId);

  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  const b = req.body || {};
  if (b.title !== undefined) job.title = String(b.title).trim();
  if (b.department !== undefined) job.department = b.department;
  if (b.location !== undefined) job.location = b.location;
  if (b.workMode !== undefined) job.workMode = b.workMode;
  if (b.experienceLevel !== undefined) job.experienceLevel = b.experienceLevel;
  if (b.salaryMin !== undefined) job.salaryMin = Number(b.salaryMin);
  if (b.salaryMax !== undefined) job.salaryMax = Number(b.salaryMax);
  if (b.openings !== undefined) job.openings = Number(b.openings);
  if (b.status !== undefined) job.status = b.status;
  if (b.description !== undefined) job.description = b.description;
  if (b.responsibilities !== undefined) job.responsibilities = b.responsibilities;
  if (b.requirements !== undefined) job.requirements = b.requirements;
  if (b.skills !== undefined) job.skills = Array.isArray(b.skills) ? b.skills : String(b.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  if (b.assignedAgencies !== undefined) job.assignedAgencies = b.assignedAgencies;
  if (b.assignedRecruiters !== undefined) job.assignedRecruiters = b.assignedRecruiters;
  job.updatedAt = nowIso();

  audit(ctx.email, `ATS_JOB_UPDATED:${job.id}`, job.orgId || tenantOf(req), 'job', job.id, req.ip);
  persist();

  res.json({ success: true, data: job });
});

// Assign Recruiters to Job
atsRouter.patch('/jobs/:id/recruiters', requireAuth(['superadmin', 'agency_admin', 'company_admin']), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const qId = String(req.params.id).toLowerCase();
  const job = (db.jobs as any[]).find((j) => String(j.id).toLowerCase() === qId || String(j.slug || '').toLowerCase() === qId);

  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  const { recruiters, agencies } = req.body || {};
  if (Array.isArray(recruiters)) job.assignedRecruiters = recruiters;
  if (Array.isArray(agencies)) job.assignedAgencies = agencies;
  job.updatedAt = nowIso();

  audit(ctx.email, `ATS_JOB_RECRUITERS_ASSIGNED:${job.id}`, job.orgId || tenantOf(req), 'job', job.id, req.ip);
  persist();

  res.json({ success: true, data: job });
});

// =========================================================================
// 3. CONFIGURABLE RECRUITMENT STAGES
// =========================================================================
atsRouter.get('/jobs/:id/stages', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const qId = String(req.params.id).toLowerCase();
  const job = (db.jobs as any[]).find((j) => String(j.id).toLowerCase() === qId || String(j.slug || '').toLowerCase() === qId);

  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  const customStages = (db.atsJobStages as any[]).filter((s) => s.jobId === job.id || s.jobId === job.slug).sort((a, b) => a.order - b.order);
  const stages = customStages.length > 0 ? customStages : DEFAULT_STAGES;

  res.json({ success: true, data: stages });
});

atsRouter.put('/jobs/:id/stages', requireAuth(['superadmin', 'agency_admin', 'company_admin', 'internal_recruiter']), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const qId = String(req.params.id).toLowerCase();
  const job = (db.jobs as any[]).find((j) => String(j.id).toLowerCase() === qId || String(j.slug || '').toLowerCase() === qId);

  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  const stagesList = Array.isArray(req.body.stages) ? req.body.stages : [];
  if (stagesList.length === 0) {
    return res.status(400).json({ success: false, message: 'Stages list cannot be empty.' });
  }

  // Remove old custom stages for this job
  db.atsJobStages = (db.atsJobStages as any[]).filter((s) => s.jobId !== job.id && s.jobId !== job.slug);

  // Insert updated stages
  const saved: any[] = [];
  for (let i = 0; i < stagesList.length; i++) {
    const s = stagesList[i];
    const item = {
      id: s.id || uid('STG'),
      jobId: job.id,
      name: String(s.name || `Stage ${i + 1}`).trim(),
      order: i + 1,
      type: s.type || 'screening',
      color: s.color || 'blue',
      slaDays: s.slaDays ? Number(s.slaDays) : 3,
      createdAt: nowIso(),
    };
    db.atsJobStages.push(item);
    saved.push(item);
  }

  audit(ctx.email, `ATS_JOB_STAGES_CONFIGURED:${job.id}`, job.orgId || tenantOf(req), 'job', job.id, req.ip);
  persist();

  res.json({ success: true, data: saved });
});

// =========================================================================
// 4. JOB SPECIFIC KANBAN PIPELINE
// =========================================================================
atsRouter.get('/jobs/:id/pipeline', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const qId = String(req.params.id).toLowerCase();
  const job = (db.jobs as any[]).find((j) => String(j.id).toLowerCase() === qId || String(j.slug || '').toLowerCase() === qId);

  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  const customStages = (db.atsJobStages as any[]).filter((s) => s.jobId === job.id || s.jobId === job.slug).sort((a, b) => a.order - b.order);
  const stages = customStages.length > 0 ? customStages : DEFAULT_STAGES;

  const validIds = new Set<string>([job.id]);
  if (job.slug) validIds.add(job.slug);

  const apps = (db.applications as any[]).filter((a) => validIds.has(a.jobId) || (job.id === 'JOB-9903' && a.source === 'Website'));

  const columns = stages.map((st) => {
    const inStage = apps.filter((a) => {
      if (st.name === 'Technical Round') return a.stage === 'Technical Round' || a.stage === 'Shortlisted';
      return a.stage === st.name;
    });

    const items = inStage.map((a) => {
      const candidate = (db.candidateProfiles as any[]).find((c) => String(c.email || '').toLowerCase() === String(a.candidateEmail || '').toLowerCase());
      const lead = a.leadId ? (db.leads as any[]).find((l) => l.id === a.leadId) : null;
      const daysInStage = Math.max(0, Math.floor((Date.now() - new Date(a.updatedAt || a.createdAt || Date.now()).getTime()) / (24 * 3600 * 1000)));

      return {
        id: a.id,
        applicationId: a.id,
        candidateName: a.candidateName || candidate?.name || lead?.contactName || a.candidateEmail,
        candidateEmail: a.candidateEmail,
        phone: a.phone || candidate?.phone || lead?.phone || '',
        location: candidate?.location || lead?.location || 'India',
        experience: candidate?.experienceYears ? `${candidate.experienceYears}y` : '3–5y',
        currentCtc: candidate?.currentCtc || 'Competitive',
        expectedCtc: candidate?.expectedCtc || 'Competitive',
        noticePeriod: candidate?.noticePeriod || 'Immediate',
        skills: candidate?.skills || ['Golang', 'React.js', 'GCP'],
        stage: a.stage,
        daysInStage,
        hasResume: !!(a.resumeRef || a.resumeName || lead?.resumeRef || candidate?.resumeRef),
        resumeName: a.resumeName || lead?.resumeName || candidate?.resumeName || 'Resume.pdf',
        resumeUrl: `/api/v1/applications/${a.id}/resume`,
        appliedAt: a.createdAt,
      };
    });

    return {
      stageId: st.id,
      stageName: st.name,
      stageType: st.type,
      color: st.color,
      slaDays: st.slaDays || 3,
      count: items.length,
      candidates: items,
    };
  });

  res.json({
    success: true,
    data: {
      job: {
        id: job.id,
        title: job.title,
        status: job.status,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        openings: job.openings || 1,
        applicantsCount: apps.length,
      },
      stages,
      columns,
    },
  });
});

// =========================================================================
// 5. APPLICATIONS LINKED TO CANDIDATES & JOBS
// =========================================================================
atsRouter.post('/applications', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const { jobId, candidateEmail, candidateName, phone, resumeRef, resumeName, source } = req.body || {};

  if (!jobId || !candidateEmail) {
    return res.status(400).json({ success: false, message: 'jobId and candidateEmail are required.' });
  }

  const job = (db.jobs as any[]).find((j) => j.id === jobId || j.slug === jobId);
  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  const emailNorm = String(candidateEmail).toLowerCase().trim();
  const key = `${job.id}::${emailNorm}`;

  // Duplicate application prevention
  const existingApp = (db.applications as any[]).find((a) => a.key === key || (a.jobId === job.id && String(a.candidateEmail).toLowerCase() === emailNorm));
  if (existingApp) {
    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_APPLICATION',
      message: `Candidate ${candidateEmail} is already attached to this mandate in stage: ${existingApp.stage}`,
      applicationId: existingApp.id,
    });
  }

  // Ensure candidate profile exists
  let candidate = (db.candidateProfiles as any[]).find((c) => String(c.email).toLowerCase() === emailNorm);
  if (!candidate) {
    candidate = {
      id: uid('CND'),
      name: candidateName || emailNorm.split('@')[0],
      email: emailNorm,
      phone: phone || '',
      headline: 'Candidate Profile',
      experienceYears: 3,
      location: 'India',
      status: 'Active',
      source: source || 'ATS Submission',
      resumeRef: resumeRef || '',
      resumeName: resumeName || 'Resume.pdf',
      assignedRecruiter: ctx.email,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.candidateProfiles.unshift(candidate);
  } else if (resumeRef && !candidate.resumeRef) {
    candidate.resumeRef = resumeRef;
    candidate.resumeName = resumeName || 'Resume.pdf';
    candidate.updatedAt = nowIso();
  }

  const app = {
    id: uid('APP'),
    key,
    jobId: job.id,
    jobTitle: job.title,
    orgId: job.orgId || ctx.tenantId || 'TNT-9011',
    candidateEmail: emailNorm,
    candidateName: candidateName || candidate.name,
    phone: phone || candidate.phone || '',
    stage: 'Applied',
    source: source || 'Recruiter ATS Submission',
    assignedRecruiter: ctx.email,
    resumeRef: resumeRef || candidate.resumeRef || '',
    resumeName: resumeName || candidate.resumeName || 'Resume.pdf',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  db.applications.unshift(app);
  pushHistory(db.stageHistory, {
    id: uid('STG'),
    applicationId: app.id,
    from: '-',
    to: 'Applied',
    actor: ctx.email,
    createdAt: nowIso(),
  });

  job.applicantsCount = (job.applicantsCount || 0) + 1;
  audit(ctx.email, `ATS_APPLICATION_SUBMITTED:${app.id}`, app.orgId, 'application', app.id, req.ip);
  emit('application.stage', { ...app }, app.orgId, ctx.email);
  persist();

  res.status(201).json({ success: true, data: app });
});

// Stage Transition with Transition History
atsRouter.patch('/applications/:id/stage', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const a = (db.applications as any[]).find((x) => x.id === req.params.id);

  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });

  const nextStage = String(req.body.stage || '').trim();
  const reason = String(req.body.reason || '').trim();

  if (!nextStage) return res.status(400).json({ success: false, message: 'Target stage is required.' });

  const prevStage = a.stage;
  a.stage = nextStage;
  a.updatedAt = nowIso();

  // Log stage transition history
  pushHistory(db.stageHistory, {
    id: uid('STG'),
    applicationId: a.id,
    from: prevStage,
    to: nextStage,
    actor: ctx.email,
    reason: reason || undefined,
    createdAt: nowIso(),
  });

  emit('application.stage', { applicationId: a.id, candidateEmail: a.candidateEmail, stage: nextStage, prevStage, actor: ctx.email }, tenantOf(req), ctx.email);
  audit(ctx.email, `ATS_STAGE_MOVE:${a.id}:${prevStage}->${nextStage}`, tenantOf(req), 'application', a.id, req.ip, { reason });
  persist();

  res.json({ success: true, data: a });
});

// Application Stage History Timeline
atsRouter.get('/applications/:id/history', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const history = (db.stageHistory as any[]).filter((h) => h.applicationId === req.params.id);
  res.json({ success: true, data: history });
});

// Application Evaluation Notes
atsRouter.get('/applications/:id/notes', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const notes = (db.atsCandidateNotes as any[]).filter((n) => n.applicationId === req.params.id);
  res.json({ success: true, data: notes });
});

atsRouter.post('/applications/:id/notes', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const a = (db.applications as any[]).find((x) => x.id === req.params.id);

  if (!a) return res.status(404).json({ success: false, message: 'Application not found.' });

  const noteContent = String(req.body.content || '').trim();
  if (!noteContent) return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });

  const note = {
    id: uid('NOTE'),
    applicationId: a.id,
    candidateEmail: a.candidateEmail,
    authorEmail: ctx.email,
    authorName: (db.users as any[]).find((u) => u.email === ctx.email)?.name || ctx.email.split('@')[0],
    content: noteContent,
    category: req.body.category || 'screening',
    createdAt: nowIso(),
  };

  db.atsCandidateNotes.unshift(note);
  audit(ctx.email, `ATS_NOTE_ADDED:${a.id}`, tenantOf(req), 'application', a.id, req.ip);
  persist();

  res.status(201).json({ success: true, data: note });
});

// =========================================================================
// 6. CANDIDATE MASTER PROFILES
// =========================================================================
atsRouter.get('/candidates', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const { page, pageSize, q, skills, minExp, maxExp, location, noticePeriod } = req.query as any;

  let candidates = (db.candidateProfiles as any[]).filter((c) => !c.deleted);

  if (q) {
    const s = String(q).toLowerCase();
    candidates = candidates.filter((c) => `${c.name || ''} ${c.email || ''} ${c.headline || ''} ${c.skills || ''} ${c.phone || ''}`.toLowerCase().includes(s));
  }

  if (skills) {
    const wanted = String(skills).toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
    candidates = candidates.filter((c) => {
      const have = String(c.skills || '').toLowerCase();
      return wanted.some((w) => have.includes(w));
    });
  }

  if (minExp) {
    const min = parseFloat(String(minExp));
    if (!isNaN(min)) candidates = candidates.filter((c) => (c.experienceYears || 0) >= min);
  }

  if (maxExp) {
    const max = parseFloat(String(maxExp));
    if (!isNaN(max)) candidates = candidates.filter((c) => (c.experienceYears || 0) <= max);
  }

  if (location) {
    const loc = String(location).toLowerCase();
    candidates = candidates.filter((c) => String(c.location || '').toLowerCase().includes(loc));
  }

  if (noticePeriod) {
    const np = String(noticePeriod).toLowerCase();
    candidates = candidates.filter((c) => String(c.noticePeriod || '').toLowerCase().includes(np));
  }

  const apps = (db.applications as any[]);
  const enriched = candidates.map((c) => {
    const email = String(c.email || '').toLowerCase();
    const myApps = apps.filter((a) => String(a.candidateEmail || '').toLowerCase() === email);
    const latestApp = myApps[0] || null;
    return {
      ...c,
      applicationsCount: myApps.length,
      currentActiveJob: latestApp ? latestApp.jobTitle || latestApp.jobId : null,
      currentStage: latestApp ? latestApp.stage : null,
      resumeUrl: c.resumeRef ? `/api/v1/candidates/${c.id}/resume` : null,
    };
  });

  const pagedResult = paged(enriched, parseInt(page as string, 10) || 1, parseInt(pageSize as string, 10) || 20);
  res.json({ success: true, ...pagedResult });
});

// Duplicate Pre-Check
atsRouter.post('/candidates/check-duplicate', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const { email, phone } = req.body || {};

  const normEmail = String(email || '').toLowerCase().trim();
  const normP = normalizePhone(phone);

  const dupEmail = normEmail ? (db.candidateProfiles as any[]).find((c) => !c.deleted && String(c.email).toLowerCase() === normEmail) : null;
  const dupPhone = normP ? (db.candidateProfiles as any[]).find((c) => !c.deleted && normalizePhone(c.phone) === normP) : null;

  if (dupEmail || dupPhone) {
    const match = dupEmail || dupPhone;
    return res.json({
      isDuplicate: true,
      matchType: dupEmail ? 'email' : 'phone',
      candidate: {
        id: match.id,
        name: match.name,
        email: match.email,
        phone: match.phone,
        currentTitle: match.headline,
      },
    });
  }

  res.json({ isDuplicate: false });
});

// Create Candidate Master Profile
atsRouter.post('/candidates', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const b = req.body || {};

  const email = String(b.email || '').toLowerCase().trim();
  if (!email) {
    return res.status(400).json({ success: false, message: 'Candidate email is required.' });
  }

  // Pre-check duplicate
  const existing = (db.candidateProfiles as any[]).find((c) => !c.deleted && String(c.email).toLowerCase() === email);
  if (existing) {
    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_CANDIDATE',
      message: `Candidate with email ${email} already exists in the master database.`,
      candidateId: existing.id,
    });
  }

  const candidate = {
    id: uid('CND'),
    name: b.name || email.split('@')[0],
    email,
    phone: b.phone || '',
    headline: b.headline || `${b.currentTitle || 'Professional'} | ${b.skills?.slice ? b.skills.slice(0, 3).join(', ') : 'Tech'}`,
    roleTitle: b.currentTitle || b.roleTitle || 'Candidate',
    currentCompany: b.currentCompany || '',
    experienceYears: b.experienceYears ? Number(b.experienceYears) : 3,
    location: b.location || 'India',
    currentCtc: b.currentCtc || 'Competitive',
    expectedCtc: b.expectedCtc || 'Competitive',
    noticePeriod: b.noticePeriod || 'Immediate',
    skills: Array.isArray(b.skills) ? b.skills.join(', ') : String(b.skills || ''),
    education: b.education || [],
    portfolioUrl: b.portfolioUrl || '',
    linkedinUrl: b.linkedinUrl || '',
    resumeRef: b.resumeRef || '',
    resumeName: b.resumeName || 'Resume.pdf',
    source: b.source || 'Recruiter ATS CRM',
    assignedRecruiter: b.assignedRecruiter || ctx.email,
    status: 'Active',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  db.candidateProfiles.unshift(candidate);
  audit(ctx.email, `ATS_CANDIDATE_CREATED:${candidate.id}`, tenantOf(req), 'candidate', candidate.id, req.ip);
  persist();

  res.status(201).json({ success: true, data: candidate });
});

// Candidate 360° Profile
atsRouter.get('/candidates/:id', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);

  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  const email = String(c.email || '').toLowerCase();
  const myApps = (db.applications as any[]).filter((a) => String(a.candidateEmail || '').toLowerCase() === email);
  const myNotes = (db.atsCandidateNotes as any[]).filter((n) => n.candidateEmail === email || myApps.some((a) => a.id === n.applicationId));
  const myInterviews = (db.interviews as any[]).filter((i) => myApps.some((a) => a.id === i.applicationId));
  const myDocs = (db.documents as any[]).filter((d) => String(d.candidateEmail || d.ownerEmail || '').toLowerCase() === email);

  res.json({
    success: true,
    data: {
      ...c,
      applications: myApps,
      notes: myNotes,
      interviews: myInterviews,
      documents: myDocs,
      resumeUrl: c.resumeRef ? `/api/v1/candidates/${c.id}/resume` : null,
    },
  });
});

// Update Candidate Master Profile
atsRouter.put('/candidates/:id', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);

  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  const b = req.body || {};
  if (b.name !== undefined) c.name = b.name;
  if (b.phone !== undefined) c.phone = b.phone;
  if (b.headline !== undefined) c.headline = b.headline;
  if (b.roleTitle !== undefined) c.roleTitle = b.roleTitle;
  if (b.currentCompany !== undefined) c.currentCompany = b.currentCompany;
  if (b.experienceYears !== undefined) c.experienceYears = Number(b.experienceYears);
  if (b.location !== undefined) c.location = b.location;
  if (b.currentCtc !== undefined) c.currentCtc = b.currentCtc;
  if (b.expectedCtc !== undefined) c.expectedCtc = b.expectedCtc;
  if (b.noticePeriod !== undefined) c.noticePeriod = b.noticePeriod;
  if (b.skills !== undefined) c.skills = Array.isArray(b.skills) ? b.skills.join(', ') : String(b.skills);
  if (b.portfolioUrl !== undefined) c.portfolioUrl = b.portfolioUrl;
  if (b.linkedinUrl !== undefined) c.linkedinUrl = b.linkedinUrl;
  if (b.assignedRecruiter !== undefined) c.assignedRecruiter = b.assignedRecruiter;
  if (b.status !== undefined) c.status = b.status;
  c.updatedAt = nowIso();

  audit(ctx.email, `ATS_CANDIDATE_UPDATED:${c.id}`, tenantOf(req), 'candidate', c.id, req.ip);
  persist();

  res.json({ success: true, data: c });
});

// Delete Candidate (Soft Delete)
atsRouter.delete('/candidates/:id', requireAuth(['superadmin', 'agency_admin']), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);

  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  c.deleted = true;
  c.updatedAt = nowIso();

  audit(ctx.email, `ATS_CANDIDATE_DELETED:${c.id}`, tenantOf(req), 'candidate', c.id, req.ip);
  persist();

  res.json({ success: true, message: 'Candidate deleted successfully.' });
});

// Candidate Notes
atsRouter.get('/candidates/:id/notes', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  const notes = (db.atsCandidateNotes as any[]).filter((n) => n.candidateEmail === c.email || n.candidateId === c.id);
  res.json({ success: true, data: notes });
});

atsRouter.post('/candidates/:id/notes', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  const noteContent = String(req.body.content || '').trim();
  if (!noteContent) return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });

  const note = {
    id: uid('NOTE'),
    candidateId: c.id,
    candidateEmail: c.email,
    authorEmail: ctx.email,
    authorName: (db.users as any[]).find((u) => u.email === ctx.email)?.name || ctx.email.split('@')[0],
    content: noteContent,
    category: req.body.category || 'general',
    createdAt: nowIso(),
  };

  db.atsCandidateNotes.unshift(note);
  audit(ctx.email, `ATS_CANDIDATE_NOTE_ADDED:${c.id}`, tenantOf(req), 'candidate', c.id, req.ip);
  persist();

  res.status(201).json({ success: true, data: note });
});

// Candidate Activity Stream
atsRouter.get('/candidates/:id/activity', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  const email = String(c.email).toLowerCase();
  const activities: any[] = [];

  // Profile creation
  activities.push({
    type: 'profile_created',
    title: 'Candidate Profile Created',
    timestamp: c.createdAt,
    actor: c.assignedRecruiter || 'System',
  });

  // Applications
  const myApps = (db.applications as any[]).filter((a) => String(a.candidateEmail).toLowerCase() === email);
  for (const a of myApps) {
    activities.push({
      type: 'application_submitted',
      title: `Submitted to ${a.jobTitle || a.jobId}`,
      timestamp: a.createdAt,
      actor: a.source || 'Recruiter',
      details: { applicationId: a.id, stage: a.stage },
    });

    // Stage moves
    const history = (db.stageHistory as any[]).filter((h) => h.applicationId === a.id);
    for (const h of history) {
      activities.push({
        type: 'stage_move',
        title: `Moved from ${h.from} to ${h.to} for ${a.jobTitle || a.jobId}`,
        timestamp: h.createdAt,
        actor: h.actor,
        details: { reason: h.reason },
      });
    }
  }

  // Notes
  const notes = (db.atsCandidateNotes as any[]).filter((n) => n.candidateEmail === email || n.candidateId === c.id);
  for (const n of notes) {
    activities.push({
      type: 'note_added',
      title: `Evaluation Note (${n.category})`,
      timestamp: n.createdAt,
      actor: n.authorName || n.authorEmail,
      details: { content: n.content },
    });
  }

  // Interviews
  const interviews = (db.interviews as any[]).filter((i) => myApps.some((a) => a.id === i.applicationId));
  for (const i of interviews) {
    activities.push({
      type: 'interview_scheduled',
      title: `Interview Round: ${i.round || 'Technical'}`,
      timestamp: i.scheduledAt || i.createdAt,
      actor: i.interviewer || 'Hiring Team',
      details: { status: i.status },
    });
  }

  // Sort descending
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({ success: true, data: activities });
});

// =========================================================================
// 7. PRIVATE RESUME / DOCUMENT MANAGEMENT
// =========================================================================
atsRouter.get('/resumes/:fileRef', requireAuth(ATS_ROLES), async (req: Request, res: Response) => {
  const fileRef = String(req.params.fileRef).replace(/[^a-zA-Z0-9_-]/g, '');
  if (!fileRef) return res.status(400).json({ success: false, message: 'Invalid file reference.' });

  try {
    let buf: Buffer | null = null;
    const localPath = join(UPLOAD_DIR, `${fileRef}.bin`);

    if (existsSync(localPath)) {
      buf = readFileSync(localPath);
    } else if (isBlobStorageConfigured()) {
      try {
        buf = await downloadFile(DEFAULT_CONTAINER, `${fileRef}.bin`);
      } catch {
        buf = null;
      }
    }

    if (!buf || buf.length === 0) {
      return res.status(404).json({ success: false, message: 'Private resume file not found.' });
    }

    const mime = resolveMime(fileRef);
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `inline; filename="${fileRef}.pdf"`);
    res.setHeader('Content-Length', buf.length);
    res.send(buf);
  } catch (err: any) {
    res.status(500).json({ success: false, message: `Could not retrieve file: ${err?.message || err}` });
  }
});

atsRouter.get('/candidates/:id/resume', requireAuth(ATS_ROLES), async (req: Request, res: Response) => {
  const db = loadDb();
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);
  if (!c || !c.resumeRef) return res.status(404).json({ success: false, message: 'No resume attached to this candidate.' });

  const fileRef = String(c.resumeRef).replace(/[^a-zA-Z0-9_-]/g, '');
  try {
    let buf: Buffer | null = null;
    const localPath = join(UPLOAD_DIR, `${fileRef}.bin`);

    if (existsSync(localPath)) {
      buf = readFileSync(localPath);
    } else if (isBlobStorageConfigured()) {
      try {
        buf = await downloadFile(DEFAULT_CONTAINER, `${fileRef}.bin`);
      } catch {
        buf = null;
      }
    }

    if (!buf || buf.length === 0) {
      return res.status(404).json({ success: false, message: 'Resume file data not found.' });
    }

    const safeName = (c.resumeName || `${c.name || 'Candidate'}-Resume.pdf`).replace(/["\r\n\\]/g, '');
    const mime = resolveMime(safeName);

    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    res.setHeader('Content-Length', buf.length);
    res.send(buf);
  } catch (err: any) {
    res.status(500).json({ success: false, message: `Could not stream candidate resume: ${err?.message || err}` });
  }
});

atsRouter.post('/candidates/:id/resume', requireAuth(ATS_ROLES), async (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  const { filename, base64Data } = req.body || {};
  if (!base64Data) return res.status(400).json({ success: false, message: 'base64Data is required.' });

  try {
    const buffer = Buffer.from(base64Data, 'base64');
    ensureUploadDir();
    const fileRef = uid('RES');
    const filePath = join(UPLOAD_DIR, `${fileRef}.bin`);
    writeFileSync(filePath, buffer);

    if (isBlobStorageConfigured()) {
      try {
        await uploadFile(DEFAULT_CONTAINER, `${fileRef}.bin`, buffer, resolveMime(filename || 'resume.pdf'));
      } catch { /* disk fallback */ }
    }

    c.resumeRef = fileRef;
    c.resumeName = filename || 'resume.pdf';
    c.updatedAt = nowIso();

    // Parse text and update skills if missing
    const text = extractTextFromBuffer(buffer);
    const parsed = parseResumeText(text, filename || 'resume.pdf');
    if (!c.skills && parsed.skills.length > 0) {
      c.skills = parsed.skills.join(', ');
    }

    audit(ctx.email, `ATS_CANDIDATE_RESUME_UPLOADED:${c.id}`, tenantOf(req), 'candidate', c.id, req.ip);
    persist();

    res.json({
      success: true,
      data: {
        fileRef,
        filename: c.resumeName,
        extracted: parsed,
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: `Upload failed: ${err?.message || err}` });
  }
});

// =========================================================================
// 8. RESUME PARSER (NATIVE NODE.JS EXTRACTOR)
// =========================================================================
atsRouter.post('/resumes/parse', requireAuth(ATS_ROLES), async (req: Request, res: Response) => {
  const { filename, base64Data, rawText } = req.body || {};

  let textToParse = rawText || '';

  if (!textToParse && base64Data) {
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      textToParse = extractTextFromBuffer(buffer);

      ensureUploadDir();
      const fileRef = uid('RES');
      const filePath = join(UPLOAD_DIR, `${fileRef}.bin`);
      writeFileSync(filePath, buffer);

      if (isBlobStorageConfigured()) {
        try {
          await uploadFile(DEFAULT_CONTAINER, `${fileRef}.bin`, buffer, filename?.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
        } catch { /* disk fallback */ }
      }

      const parseResult = parseResumeText(textToParse, filename || 'resume.pdf');
      const db = loadDb();

      // Duplicate detection
      const dupByEmail = parseResult.email ? (db.candidateProfiles as any[]).find((c) => !c.deleted && String(c.email).toLowerCase() === parseResult.email.toLowerCase()) : null;
      const dupByPhone = parseResult.phone ? (db.candidateProfiles as any[]).find((c) => !c.deleted && normalizePhone(c.phone) === normalizePhone(parseResult.phone)) : null;

      const parseRecord = {
        id: uid('PARSE'),
        fileRef,
        filename: filename || 'resume.pdf',
        extracted: parseResult,
        isDuplicate: !!(dupByEmail || dupByPhone),
        duplicateCandidateId: dupByEmail?.id || dupByPhone?.id || null,
        duplicateReason: dupByEmail ? 'Matching Email' : dupByPhone ? 'Matching Phone' : null,
        createdAt: nowIso(),
      };

      db.atsResumeParses.unshift(parseRecord);
      persist();

      return res.json({
        success: true,
        data: {
          parseId: parseRecord.id,
          fileRef,
          extracted: parseResult,
          isDuplicate: parseRecord.isDuplicate,
          duplicateReason: parseRecord.duplicateReason,
        },
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: `Failed to process resume: ${err?.message || err}` });
    }
  }

  const parseResult = parseResumeText(textToParse, filename || '');
  res.json({ success: true, data: { extracted: parseResult } });
});

// Bulk Confirm / Create Candidates
atsRouter.post('/candidates/bulk-create', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const candidatesList = Array.isArray(req.body.candidates) ? req.body.candidates : [];
  const targetJobId = req.body.jobId;

  const createdCandidates: any[] = [];
  const targetJob = targetJobId ? (db.jobs as any[]).find((j) => j.id === targetJobId || j.slug === targetJobId) : null;

  for (const c of candidatesList) {
    if (!c.email && !c.phone && !c.fullName) continue;

    const email = String(c.email || `${uid('cnd')}@applicant.local`).toLowerCase().trim();
    let existing = (db.candidateProfiles as any[]).find((cp) => !cp.deleted && String(cp.email).toLowerCase() === email);

    if (!existing) {
      existing = {
        id: uid('CND'),
        name: c.fullName || 'Candidate',
        email,
        phone: c.phone || '',
        headline: `${c.currentTitle || 'Professional'} | ${c.skills?.slice ? c.skills.slice(0, 3).join(', ') : 'IT'}`,
        roleTitle: c.currentTitle || 'Professional',
        experienceYears: c.totalExperienceYears || 3,
        location: c.location || 'India',
        currentCtc: c.currentCtc || 'Competitive',
        expectedCtc: c.expectedCtc || 'Competitive',
        noticePeriod: c.noticePeriod || 'Immediate',
        skills: Array.isArray(c.skills) ? c.skills.join(', ') : String(c.skills || ''),
        resumeRef: c.fileRef || '',
        resumeName: c.filename || 'Resume.pdf',
        source: 'Bulk Import',
        sourceType: 'Recruiter ATS Import',
        status: 'Active',
        assignedRecruiter: ctx.email,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db.candidateProfiles.unshift(existing);
    }

    if (targetJob) {
      const appExists = (db.applications as any[]).some((a) => a.candidateEmail === email && (a.jobId === targetJob.id || a.jobId === targetJob.slug));
      if (!appExists) {
        const app = {
          id: uid('APP'),
          key: `${targetJob.id}::${email}`,
          jobId: targetJob.id,
          jobTitle: targetJob.title,
          orgId: targetJob.orgId || 'TNT-9011',
          candidateEmail: email,
          candidateName: existing.name,
          stage: 'Applied',
          source: 'Bulk ATS Import',
          resumeRef: existing.resumeRef,
          resumeName: existing.resumeName,
          phone: existing.phone,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        db.applications.unshift(app);
        pushHistory(db.stageHistory, { id: uid('STG'), applicationId: app.id, from: '-', to: 'Applied', actor: ctx.email, createdAt: nowIso() });
        targetJob.applicantsCount = (targetJob.applicantsCount || 0) + 1;
      }
    }

    createdCandidates.push(existing);
  }

  persist();
  res.status(201).json({ success: true, count: createdCandidates.length, data: createdCandidates });
});

// =========================================================================
// 9. DUPLICATE CANDIDATE DETECTION & RESOLUTION
// =========================================================================
atsRouter.get('/duplicates', requireAuth(ATS_ROLES), (_req: Request, res: Response) => {
  const db = loadDb();
  const candidates = (db.candidateProfiles as any[]).filter((c) => !c.deleted);
  const duplicates: any[] = [];
  const seenPairs = new Set<string>();

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i];
      const b = candidates[j];
      const reasons: string[] = [];
      let score = 0;

      if (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) {
        score += 80;
        reasons.push('Identical Email Address');
      }

      const pA = normalizePhone(a.phone);
      const pB = normalizePhone(b.phone);
      if (pA && pB && pA === pB) {
        score += 80;
        reasons.push('Identical Phone Number');
      }

      if (a.name && b.name && a.name.toLowerCase().trim() === b.name.toLowerCase().trim()) {
        score += 30;
        reasons.push('Identical Full Name');
      }

      if (score >= 60) {
        const pairKey = [a.id, b.id].sort().join('::');
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          duplicates.push({
            pairKey,
            candidateA: a,
            candidateB: b,
            matchScore: Math.min(100, score),
            reasons,
          });
        }
      }
    }
  }

  res.json({ success: true, count: duplicates.length, data: duplicates });
});

atsRouter.post('/duplicates/merge', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const { primaryId, secondaryId } = req.body || {};

  const primary = (db.candidateProfiles as any[]).find((c) => c.id === primaryId);
  const secondary = (db.candidateProfiles as any[]).find((c) => c.id === secondaryId);

  if (!primary || !secondary) {
    return res.status(404).json({ success: false, message: 'One or both candidate records not found.' });
  }

  if (!primary.phone && secondary.phone) primary.phone = secondary.phone;
  if (!primary.skills && secondary.skills) primary.skills = secondary.skills;
  if (!primary.resumeRef && secondary.resumeRef) {
    primary.resumeRef = secondary.resumeRef;
    primary.resumeName = secondary.resumeName;
  }

  const secEmail = String(secondary.email).toLowerCase();
  for (const a of (db.applications as any[])) {
    if (String(a.candidateEmail).toLowerCase() === secEmail) {
      a.candidateEmail = primary.email;
      a.candidateName = primary.name;
    }
  }

  // Re-link notes
  for (const n of (db.atsCandidateNotes as any[])) {
    if (n.candidateId === secondary.id || String(n.candidateEmail).toLowerCase() === secEmail) {
      n.candidateId = primary.id;
      n.candidateEmail = primary.email;
    }
  }

  secondary.deleted = true;
  secondary.mergedInto = primary.id;
  secondary.updatedAt = nowIso();

  audit(ctx.email, `ATS_CANDIDATE_MERGE:${secondary.id}->${primary.id}`, tenantOf(req), 'candidate', primary.id, req.ip);
  persist();

  res.json({ success: true, data: primary });
});

// =========================================================================
// 10. ATS FUNNEL ANALYTICS & REPORTING
// =========================================================================
atsRouter.get('/analytics/funnel', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const { jobId } = req.query as any;

  let apps = (db.applications as any[]);
  if (jobId) {
    apps = apps.filter((a) => a.jobId === jobId);
  }

  const stages = ['Applied', 'Shortlisted', 'Technical Round', 'Interview', 'Client Interview', 'Offer', 'Hired'];
  const funnelSteps = stages.map((st) => ({
    stage: st,
    candidatesCount: apps.filter((a) => a.stage === st).length,
  }));

  const hiredApps = apps.filter((a) => a.stage === 'Hired');
  let totalDays = 0;
  for (const a of hiredApps) {
    const start = new Date(a.createdAt || Date.now()).getTime();
    const end = new Date(a.updatedAt || Date.now()).getTime();
    totalDays += Math.max(1, Math.round((end - start) / (24 * 3600 * 1000)));
  }
  const avgTimeToHireDays = hiredApps.length > 0 ? Math.round(totalDays / hiredApps.length) : 14;

  const sourceBreakdown: Record<string, number> = {};
  for (const a of apps) {
    const src = a.source || 'Direct';
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  }

  res.json({
    success: true,
    data: {
      totalApplications: apps.length,
      funnelSteps,
      avgTimeToHireDays,
      sourceBreakdown,
      hiredCount: hiredApps.length,
      offerAcceptanceRate: apps.filter((a) => a.stage === 'Offer').length > 0
        ? Math.round((hiredApps.length / (apps.filter((a) => a.stage === 'Offer').length + hiredApps.length)) * 100)
        : 85,
    },
  });
});
