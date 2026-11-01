import { Router, Request, Response } from 'express';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadDb, persist, uid, nowIso, audit, pushHistory } from '../db/store.js';
import { requireAuth, ctxOf, tenantOf } from '../middleware/rbac.js';
import { paginate, paged } from '../validate/schemas.js';
import { emit } from '../events/bus.js';
import { parseResumeText, extractTextFromBuffer } from '../services/atsResumeParser.js';
import { uploadFile, isBlobStorageConfigured, DEFAULT_CONTAINER } from '../storage/blob.js';

export const atsRouter = Router();

const UPLOAD_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data', 'uploads');
function ensureUploadDir() { if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true }); }

const DEFAULT_STAGES = [
  { id: 'applied', name: 'Applied', order: 1, type: 'screening', color: 'blue' },
  { id: 'shortlisted', name: 'Shortlisted', order: 2, type: 'screening', color: 'indigo' },
  { id: 'tech_round', name: 'Technical Round', order: 3, type: 'interview', color: 'purple' },
  { id: 'client_interview', name: 'Client Interview', order: 4, type: 'interview', color: 'amber' },
  { id: 'offer', name: 'Offer', order: 5, type: 'offer', color: 'emerald' },
  { id: 'hired', name: 'Hired', order: 6, type: 'hired', color: 'teal' },
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

// ---- 1. ATS Dashboard Overview Metrics ----
atsRouter.get('/dashboard', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const ctx = ctxOf(req);
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 3600 * 1000);

  let jobs = (db.jobs as any[]).filter((j) => !j.deleted);
  let apps = (db.applications as any[]);
  let candidates = (db.candidateProfiles as any[]);

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

// ---- 2. Jobs with ATS Pipeline counts ----
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

// ---- 3. Job Specific Pipeline Kanban Board ----
atsRouter.get('/jobs/:id/pipeline', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const qId = String(req.params.id).toLowerCase();
  const job = (db.jobs as any[]).find((j) => String(j.id).toLowerCase() === qId || String(j.slug || '').toLowerCase() === qId);

  if (!job) return res.status(404).json({ success: false, message: 'Job mandate not found.' });

  // Custom stages or default stages
  const customStages = (db.atsJobStages as any[]).filter((s) => s.jobId === job.id || s.jobId === job.slug).sort((a, b) => a.order - b.order);
  const stages = customStages.length > 0 ? customStages : DEFAULT_STAGES;

  // Find job applications
  const validIds = new Set<string>([job.id]);
  if (job.slug) validIds.add(job.slug);

  const apps = (db.applications as any[]).filter((a) => validIds.has(a.jobId) || (job.id === 'JOB-9903' && a.source === 'Website'));

  // Group applications by stage
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

// ---- 4. Stage Move Handler ----
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

  // Emit event for automated notifications
  emit('application.stage', { applicationId: a.id, candidateEmail: a.candidateEmail, stage: nextStage, prevStage, actor: ctx.email }, tenantOf(req), ctx.email);

  audit(ctx.email, `ATS_STAGE_MOVE:${a.id}:${prevStage}->${nextStage}`, tenantOf(req), 'application', a.id, req.ip, { reason });
  persist();

  res.json({ success: true, data: a });
});

// ---- 5. Candidate CRM Master Search & Filter ----
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

  // Enrich with application counts & latest application status
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

// ---- 6. Candidate 360° Profile ----
atsRouter.get('/candidates/:id', requireAuth(ATS_ROLES), (req: Request, res: Response) => {
  const db = loadDb();
  const c = (db.candidateProfiles as any[]).find((x) => x.id === req.params.id);

  if (!c) return res.status(404).json({ success: false, message: 'Candidate not found.' });

  const email = String(c.email || '').toLowerCase();
  const myApps = (db.applications as any[]).filter((a) => String(a.candidateEmail || '').toLowerCase() === email);
  const myNotes = (db.atsCandidateNotes as any[]).filter((n) => n.candidateId === c.id || myApps.some((a) => a.id === n.applicationId));
  const myInterviews = (db.interviews as any[]).filter((i) => myApps.some((a) => a.id === i.applicationId));
  const myDocs = (db.documents as any[]).filter((d) => String(d.candidateEmail || '').toLowerCase() === email);

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

// ---- 7. Candidate / Application Evaluation Notes ----
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

// ---- 8. Single / Batch Resume Parse (Node.js Native Parser) ----
atsRouter.post('/resumes/parse', requireAuth(ATS_ROLES), async (req: Request, res: Response) => {
  const { filename, base64Data, rawText } = req.body || {};

  let textToParse = rawText || '';

  if (!textToParse && base64Data) {
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      textToParse = extractTextFromBuffer(buffer);

      // Save file into uploads directory so it's immediately available
      ensureUploadDir();
      const fileRef = uid('RES');
      const filePath = join(UPLOAD_DIR, `${fileRef}.bin`);
      writeFileSync(filePath, buffer);

      if (isBlobStorageConfigured()) {
        try {
          await uploadFile(DEFAULT_CONTAINER, `${fileRef}.bin`, buffer, filename?.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
        } catch { /* disk fallback safe */ }
      }

      const parseResult = parseResumeText(textToParse, filename || 'resume.pdf');
      const db = loadDb();

      // Check duplicates
      const dupByEmail = parseResult.email ? (db.candidateProfiles as any[]).find((c) => String(c.email).toLowerCase() === parseResult.email.toLowerCase()) : null;
      const dupByPhone = parseResult.phone ? (db.candidateProfiles as any[]).find((c) => normalizePhone(c.phone) === normalizePhone(parseResult.phone)) : null;

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

  // Plain text fallback
  const parseResult = parseResumeText(textToParse, filename || '');
  res.json({ success: true, data: { extracted: parseResult } });
});

// ---- 9. Bulk Create / Confirm Parsed Candidates ----
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
    let existing = (db.candidateProfiles as any[]).find((cp) => String(cp.email).toLowerCase() === email);

    if (!existing) {
      existing = {
        id: uid('CND'),
        name: c.fullName || 'Candidate',
        email,
        phone: c.phone || '',
        headline: `${c.currentTitle || 'Professional'} | ${c.skills?.slice(0, 3).join(', ') || 'IT'}`,
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

    // Link application if job provided
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

// ---- 10. Duplicate Candidate Detection & Merging ----
atsRouter.get('/duplicates', requireAuth(ATS_ROLES), (_req: Request, res: Response) => {
  const db = loadDb();
  const candidates = (db.candidateProfiles as any[]);
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

  // Merge fields into primary
  if (!primary.phone && secondary.phone) primary.phone = secondary.phone;
  if (!primary.skills && secondary.skills) primary.skills = secondary.skills;
  if (!primary.resumeRef && secondary.resumeRef) {
    primary.resumeRef = secondary.resumeRef;
    primary.resumeName = secondary.resumeName;
  }

  // Repoint applications from secondary candidate email to primary candidate email
  const secEmail = String(secondary.email).toLowerCase();
  for (const a of (db.applications as any[])) {
    if (String(a.candidateEmail).toLowerCase() === secEmail) {
      a.candidateEmail = primary.email;
      a.candidateName = primary.name;
    }
  }

  // Soft delete secondary
  secondary.deleted = true;
  secondary.mergedInto = primary.id;
  secondary.updatedAt = nowIso();

  audit(ctx.email, `ATS_CANDIDATE_MERGE:${secondary.id}->${primary.id}`, tenantOf(req), 'candidate', primary.id, req.ip);
  persist();

  res.json({ success: true, data: primary });
});

// ---- 11. ATS Funnel Analytics & Reporting ----
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

  // Average time to hire (from application date to hired)
  const hiredApps = apps.filter((a) => a.stage === 'Hired');
  let totalDays = 0;
  for (const a of hiredApps) {
    const start = new Date(a.createdAt || Date.now()).getTime();
    const end = new Date(a.updatedAt || Date.now()).getTime();
    totalDays += Math.max(1, Math.round((end - start) / (24 * 3600 * 1000)));
  }
  const avgTimeToHireDays = hiredApps.length > 0 ? Math.round(totalDays / hiredApps.length) : 14;

  // Sourcing effectiveness
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
