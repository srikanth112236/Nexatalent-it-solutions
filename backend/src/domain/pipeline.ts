import { nowIso } from '../db/store.js';

/**
 * Hiring-pipeline rollups + transition validation (§6.7).
 *
 * Counting rules (see SPEC-MATRIX):
 * - All rollups run over COMPLETE in-memory collections, never paginated
 *   subsets — pagination applies only to returned rows.
 * - openingsFilled = min(openings, distinct candidates with a Joined
 *   placement across the linked jobs), deduplicated by candidate email.
 *   Raw "Hired" stages without a placement record do not count.
 */

export type Funnel = { applied: number; screening: number; interview: number; offer: number; hired: number };

const EMPTY_FUNNEL: Funnel = { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0 };

export function funnelBucket(stage: string): keyof Funnel | null {
  switch (stage) {
    case 'New':
    case 'Applied':
      return 'applied';
    case 'Under Review':
    case 'Screening':
    case 'Shortlisted':
      return 'screening';
    case 'Interview Scheduled':
    case 'Interview Completed':
      return 'interview';
    case 'Selected':
    case 'Offer':
      return 'offer';
    case 'Hired':
      return 'hired';
    default:
      return null; // Withdrawn, Rejected, On Hold, Job Closed — outside the funnel
  }
}

export interface JobCounts extends Funnel {
  applications: number;
  interviews: number;
  acceptingApplications: boolean;
}

export function jobCounts(db: any, job: any, now = new Date()): JobCounts {
  const apps = (db.applications as any[]).filter((a) => a.jobId === job.id);
  const funnel: Funnel = { ...EMPTY_FUNNEL };
  for (const a of apps) {
    const b = funnelBucket(a.stage);
    if (b) funnel[b] += 1;
  }
  const interviews = (db.interviews as any[]).filter((i) => i.jobId === job.id).length;
  const open = job.status === 'Published' && (!job.expiryDate || new Date(job.expiryDate) > now);
  return { ...funnel, applications: apps.length, interviews, acceptingApplications: open };
}

export interface RequirementRollup extends Funnel {
  applications: number;
  interviews: number;
  placements: number;
  openingsFilled: number;
  ageingDays: number;
  linkedJobs: Array<{ id: string; title: string; status: string; counts: JobCounts }>;
}

export function requirementRollup(db: any, req: any): RequirementRollup {
  const jobs = (db.jobs as any[]).filter((j) => j.requisitionId === req.id);
  const funnel: Funnel = { ...EMPTY_FUNNEL };
  const hiredEmails = new Set<string>();
  let interviews = 0;
  const linkedJobs = jobs.map((j) => {
    const counts = jobCounts(db, j);
    funnel.applied += counts.applied;
    funnel.screening += counts.screening;
    funnel.interview += counts.interview;
    funnel.offer += counts.offer;
    funnel.hired += counts.hired;
    interviews += counts.interviews;
    for (const p of db.placements as any[]) {
      if (p.jobId === j.id && p.status === 'Joined' && p.candidateEmail) {
        hiredEmails.add(String(p.candidateEmail).toLowerCase());
      }
    }
    return { id: j.id, title: j.title, status: j.status, counts };
  });
  const placements = hiredEmails.size;
  const openingsFilled = Math.min(Number(req.openings || 0), placements);
  const ageingDays = Math.max(0, Math.round((Date.now() - new Date(req.createdAt).getTime()) / 864e5) || 0);
  return {
    ...funnel,
    applications: funnel.applied + funnel.screening + funnel.interview + funnel.offer + funnel.hired,
    interviews,
    placements,
    openingsFilled,
    ageingDays,
    linkedJobs,
  };
}

/** Explicit transition gate: role/tenant/permission/current-status/reason checked server-side. */
export function checkTransition(opts: {
  permissions: string[];
  from: string;
  to: string;
  flow: Record<string, string[]>;
  permission?: string;
  reason?: string;
  needReason?: boolean;
}): void {
  if (opts.permission && !opts.permissions.includes(opts.permission)) {
    const err: any = new Error(`This transition requires the '${opts.permission}' permission.`);
    err.status = 403; err.code = 'TRANSITION_FORBIDDEN'; throw err;
  }
  if (!(opts.flow[opts.from] || []).includes(opts.to)) {
    const err: any = new Error(`Invalid transition ${opts.from} → ${opts.to}. Allowed: ${(opts.flow[opts.from] || []).join(', ') || 'none'}.`);
    err.status = 422; err.code = 'INVALID_TRANSITION'; throw err;
  }
  if (opts.needReason && !String(opts.reason || '').trim()) {
    const err: any = new Error('A reason is required for this transition and is recorded in the audit log.');
    err.status = 400; err.code = 'REASON_REQUIRED'; throw err;
  }
}

/** Explicit public-field allowlist for candidate-facing job payloads (§6.7 privacy).
 *  Anything not listed here (owner tenant, agency assignments, createdBy,
 *  internal counters) can never leak to candidates, no matter the shape. */
export const PUBLIC_JOB_FIELDS = [
  'id', 'title', 'description', 'responsibilities', 'requiredSkills', 'preferredSkills',
  'qualifications', 'experienceMin', 'experienceMax', 'location', 'employmentType',
  'workArrangement', 'salaryMin', 'salaryMax', 'currency', 'salaryDisclosure',
  'visibility', 'startDate', 'expiryDate', 'companyName', 'department',
  'applicantsCount', 'status',
] as const;

export function publicJob(job: any): any {
  const out: Record<string, unknown> = {};
  for (const k of PUBLIC_JOB_FIELDS) {
    if (job[k] !== undefined) out[k] = job[k];
  }
  const now = new Date();
  out.acceptingApplications = job.status === 'Published' && (!job.expiryDate || new Date(job.expiryDate) > now);
  return out;
}

export function notify(db: any, recipient: string, kind: string, body: string, tenantId: string): void {
  db.notifications.unshift({ id: `NOTIF-${Date.now().toString(36).toUpperCase()}`, recipient, kind, body, channel: 'in-app', status: 'queued', createdAt: nowIso(), tenantId });
  if (db.notifications.length > 2000) db.notifications.length = 2000;
}
