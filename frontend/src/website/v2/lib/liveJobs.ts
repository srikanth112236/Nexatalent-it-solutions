import type { V2Job } from '../data/jobs';

const API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || 'http://52.176.21.187:5000';

/** Raw public job shape from GET /api/v1/jobs-public. */
export interface PublicJobApi {
  id: string;
  title: string;
  description?: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  qualifications?: string[];
  experienceMin?: number;
  experienceMax?: number;
  location?: string;
  employmentType?: string;
  workArrangement?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  expiryDate?: string;
  companyName?: string;
  department?: string;
  applicantsCount?: number;
  industry?: string;
  createdAt?: string;
  acceptingApplications?: boolean;
  [k: string]: any;
}

function inferCategory(text: string): string {
  const t = text.toLowerCase();
  if (/\b(data|ai|ml|machine learning|analytics|scientist|llm)\b/.test(t)) return 'Data & AI';
  if (/\b(vp|head|director|chief|cxo|cto|lead|principal|staff engineer|manager)\b/.test(t)) return 'Leadership';
  if (/\b(operations|support|admin|coordinator|operations analyst)\b/.test(t)) return 'Operations';
  return 'Engineering';
}

function formatSalary(min?: number, max?: number): string {
  const lpa = (n: number) => (n >= 100000 ? `${Math.round(n / 100000)} LPA` : `${n.toLocaleString('en-IN')}`);
  if (min && max) return `₹${lpa(min)} – ${lpa(max)}`;
  if (min) return `From ₹${lpa(min)}`;
  if (max) return `Up to ₹${lpa(max)}`;
  return 'As per market standards';
}

function relativePosted(iso?: string): string {
  if (!iso) return 'Recently';
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} mo ago`;
}

/** Map an API public job into the rich V2Job card/detail shape. */
export function mapPublicJobToV2(p: PublicJobApi): V2Job {
  const skills = [...(p.requiredSkills || []), ...(p.preferredSkills || [])].slice(0, 10);
  const exp =
    p.experienceMin != null || p.experienceMax != null
      ? `${p.experienceMin ?? 0}–${p.experienceMax ?? 10} yrs`
      : 'Experience as per role';
  return {
    slug: p.id,
    title: p.title || 'Open position',
    category: inferCategory(`${p.title} ${skills.join(' ')}`),
    type: p.employmentType || 'Full-time',
    posted: relativePosted(p.createdAt),
    salary: formatSalary(p.salaryMin, p.salaryMax),
    location: p.location || 'India',
    domain: p.industry || 'GCC',
    premium: false,
    experience: exp,
    workMode: p.workArrangement ? p.workArrangement[0].toUpperCase() + p.workArrangement.slice(1) : 'On-site',
    department: p.department || 'Technology',
    clientType: p.companyName || 'Enterprise client',
    summary:
      p.description?.slice(0, 220) ||
      `Open position at ${p.companyName || 'our client'} — apply via NexaTalent.`,
    aboutCompany:
      p.companyName
        ? `${p.companyName} is hiring through NexaTalent's verified mandate network.`
        : 'Enterprise mandate delivered through NexaTalent.',
    skills: skills.length ? skills : ['As per job description'],
    responsibilities: p.responsibilities?.length ? p.responsibilities : (p.description ? [p.description.slice(0, 400)] : ['As per job description']),
    requirements: p.qualifications?.length ? p.qualifications : skills.length ? skills : ['As per job description'],
    niceToHave: p.preferredSkills?.length ? p.preferredSkills : [],
    benefits: ['As per client policy'],
    interviewStages: [
      { name: 'Application review', duration: '48 hrs', focus: 'Profile & skill fit' },
      { name: 'Client interview', duration: '1 round', focus: 'Technical / functional' },
      { name: 'Offer', duration: '3–5 days', focus: 'Negotiation & joining' },
    ],
  };
}

/** Fetch live open positions from the backend (status=Published, non-expired). */
export async function fetchLiveJobs(pageSize = 50): Promise<V2Job[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/jobs-public?page=1&pageSize=${pageSize}`);
    if (!res.ok) return [];
    const body = (await res.json().catch(() => null)) as any;
    const list: PublicJobApi[] = Array.isArray(body?.data) ? body.data : Array.isArray(body?.data?.data) ? body.data.data : [];
    return list.map(mapPublicJobToV2);
  } catch {
    return [];
  }
}

/** Fetch a single live job by JOB- id. Returns null when not found. */
export async function fetchLiveJob(id: string): Promise<V2Job | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/jobs-public/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const body = (await res.json().catch(() => null)) as any;
    const data: PublicJobApi | undefined = body?.data?.id ? body.data : body?.data?.data;
    if (!data?.id) return null;
    return mapPublicJobToV2(data);
  } catch {
    return null;
  }
}

export function isLiveJobSlug(slug?: string): boolean {
  return /^JOB-/i.test(slug || '');
}
