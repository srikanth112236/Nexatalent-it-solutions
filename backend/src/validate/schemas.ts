import { z } from 'zod';

export const email = z.string().email().max(160);
export const money = z.number().nonnegative().max(1_000_000_000);
export const currency = z.string().default('INR');

export const registerSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email,
  password: z.string().min(8).max(128),
  companyName: z.string().max(160).optional(),
  phone: z.string().max(30).optional(),
});

/* ---------- §7.3 Candidate profile (12 sections) ---------- */
export const candidateProfileSchema = z.object({
  name: z.string().min(1).max(120),
  email,
  phone: z.string().max(30).optional(),
  headline: z.string().max(160).optional(),
  location: z.string().max(160).optional(),
  country: z.string().max(80).optional(),
  contactPrefs: z.string().max(200).optional(),
  summary: z.string().max(5000).optional(),
  objectives: z.string().max(2000).optional(),
  roleTitle: z.string().max(120).optional(),
  experienceYears: z.number().min(0).max(60).optional(),
  experience: z.array(z.object({
    employer: z.string().max(160), designation: z.string().max(120),
    employmentType: z.string().max(60).optional(), startDate: z.string().max(20).optional(),
    endDate: z.string().max(20).optional(), current: z.boolean().optional(),
    responsibilities: z.string().max(3000).optional(), achievements: z.string().max(3000).optional(),
  })).optional(),
  education: z.array(z.object({
    institution: z.string().max(160), qualification: z.string().max(120),
    specialization: z.string().max(120).optional(), startDate: z.string().max(20).optional(),
    endDate: z.string().max(20).optional(),
  })).optional(),
  skills: z.union([z.string().max(2000), z.array(z.string().max(80))]).optional(),
  certifications: z.array(z.object({
    name: z.string().max(160), issuer: z.string().max(160),
    issueDate: z.string().max(20).optional(), expiryDate: z.string().max(20).optional(),
  })).optional(),
  projects: z.array(z.object({
    name: z.string().max(160), description: z.string().max(2000).optional(),
    role: z.string().max(120).optional(), stack: z.string().max(300).optional(),
    startDate: z.string().max(20).optional(), endDate: z.string().max(20).optional(),
  })).optional(),
  preferences: z.object({
    roles: z.string().max(500).optional(), locations: z.string().max(500).optional(),
    employmentTypes: z.string().max(300).optional(), workArrangement: z.string().max(60).optional(),
    availability: z.string().max(120).optional(),
  }).optional(),
  currentCtc: z.union([z.number().nonnegative(), z.string().max(60)]).optional(),
  expectedCtc: z.union([z.number().nonnegative(), z.string().max(60)]).optional(),
  payPeriod: z.string().max(30).optional(),
  noticePeriod: z.string().max(60).optional(),
  resumeRef: z.string().max(300).optional(),
  resumeVersion: z.number().int().min(1).optional(),
  links: z.object({
    portfolio: z.string().max(300).optional(), linkedin: z.string().max(300).optional(),
    github: z.string().max(300).optional(), website: z.string().max(300).optional(),
  }).optional(),
  visibility: z.enum(['standard', 'open', 'private', 'anonymous']).default('standard'),
  consentMarketing: z.boolean().optional(),
});

/* ---------- §6.4 Company profile ---------- */
export const companyProfileSchema = z.object({
  legalName: z.string().min(1).max(200),
  displayName: z.string().max(200).optional(),
  entityType: z.string().max(80).optional(),
  industry: z.string().max(120).optional(),
  subIndustry: z.string().max(120).optional(),
  companySize: z.string().max(60).optional(),
  website: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  countryOfIncorporation: z.string().max(80).optional(),
  registrationNumber: z.string().max(80).optional(),
  gstin: z.string().max(30).optional(),
  taxIds: z.string().max(200).optional(),
  registeredAddress: z.string().max(500).optional(),
  headquarters: z.string().max(200).optional(),
  operatingLocations: z.string().max(500).optional(),
  logoRef: z.string().max(300).optional(),
  primaryContactName: z.string().max(120).optional(),
  primaryContactDesignation: z.string().max(120).optional(),
  businessEmail: z.string().email().max(160).optional(),
  businessPhone: z.string().max(30).optional(),
  billingContact: z.string().max(160).optional(),
  financeEmail: z.string().email().max(160).optional(),
  hqLocation: z.string().max(200).optional(),
  employeeCount: z.string().max(60).optional(),
  domain: z.string().max(120).optional(),
  techStack: z.string().max(500).optional(),
});

/* ---------- §8.3 Requisition (basic/role/location/comp/plan/assignment) ---------- */
export const requisitionSchema = z.object({
  title: z.string().min(3).max(160),
  department: z.string().max(120).optional(),
  category: z.string().max(120).optional(),
  reference: z.string().max(80).optional(),
  hiringManager: z.string().max(120).optional(),
  recruiter: z.string().max(120).optional(),
  branch: z.string().max(120).optional(),
  businessUnit: z.string().max(120).optional(),
  description: z.string().max(8000).optional(),
  responsibilities: z.string().max(8000).optional(),
  requiredSkills: z.string().max(2000).optional(),
  preferredSkills: z.string().max(2000).optional(),
  qualifications: z.string().max(2000).optional(),
  experienceMin: z.number().min(0).max(40).optional(),
  experienceMax: z.number().min(0).max(40).optional(),
  seniority: z.string().max(60).optional(),
  employmentType: z.string().max(60).optional(),
  openings: z.number().int().min(1).max(1000).default(1),
  country: z.string().max(80).optional(),
  region: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  location: z.string().max(160).optional(),
  workArrangement: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  travelRequired: z.string().max(120).optional(),
  budgetMin: money.optional(),
  budgetMax: money.optional(),
  currency: currency.optional(),
  payPeriod: z.string().max(30).optional(),
  benefits: z.string().max(2000).optional(),
  disclosure: z.string().max(60).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  targetHireDate: z.string().optional(),
  deadline: z.string().optional(),
  interviewRounds: z.number().int().min(1).max(12).optional(),
  assessments: z.string().max(1000).optional(),
  joiningTarget: z.string().optional(),
  budgetApproval: z.string().max(60).optional(),
  agencyPartners: z.array(z.string()).optional(),
  submissionRules: z.string().max(1000).optional(),
  panel: z.string().max(500).optional(),
  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Sourcing', 'Filled', 'On Hold', 'Cancelled']).default('Draft'),
});

/* ---------- §8.4 Job posting ---------- */
export const jobSchema = z.object({
  requisitionId: z.string().optional(),
  title: z.string().min(3).max(160),
  description: z.string().max(12000).optional(),
  responsibilities: z.string().max(8000).optional(),
  requiredSkills: z.string().max(2000).optional(),
  preferredSkills: z.string().max(2000).optional(),
  qualifications: z.string().max(2000).optional(),
  experienceMin: z.number().min(0).max(40).optional(),
  experienceMax: z.number().min(0).max(40).optional(),
  location: z.string().max(160).optional(),
  employmentType: z.string().max(60).optional(),
  workArrangement: z.string().max(60).optional(),
  salaryMin: money.optional(),
  salaryMax: money.optional(),
  currency: currency.optional(),
  salaryDisclosure: z.string().max(60).optional(),
  visibility: z.enum(['public', 'private', 'assigned']).default('public'),
  startDate: z.string().optional(),
  expiryDate: z.string().optional(),
  applicationQuestions: z.string().max(3000).optional(),
  requiredDocs: z.string().max(1000).optional(),
  applicationSettings: z.string().max(1000).optional(),
  status: z.enum(['Draft', 'Pending Review', 'Approved', 'Published', 'Paused', 'Closed', 'Archived']).default('Draft'),
  assignedAgencies: z.array(z.string()).optional(),
  assignedVendors: z.array(z.string()).optional(),
  // legacy compat aliases
  department: z.string().max(120).optional(),
  companyName: z.string().max(200).optional(),
  budgetRange: z.string().max(120).optional(),
  experienceRequired: z.string().max(120).optional(),
});

export const applicationStage = z.enum(['New', 'Applied', 'Under Review', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Offer', 'Hired', 'Rejected', 'Withdrawn', 'On Hold', 'Job Closed']);

/* ---------- §7.7 Interview ---------- */
export const interviewSchema = z.object({
  applicationId: z.string().min(1),
  jobId: z.string().min(1),
  round: z.string().min(1).max(120),
  scheduledAt: z.string().min(1),
  timezone: z.string().default('Asia/Kolkata'),
  mode: z.enum(['video', 'phone', 'onsite']).default('video'),
  meetingLink: z.string().max(500).optional(),
  venue: z.string().max(300).optional(),
  interviewer: z.string().max(160).optional(),
  panel: z.string().max(500).optional(),
  instructions: z.string().max(2000).optional(),
  confirmationStatus: z.enum(['Pending', 'Confirmed', 'Declined']).optional(),
  rescheduleReason: z.string().max(1000).optional(),
  cancellationReason: z.string().max(1000).optional(),
});

export const messageSchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(4000),
  type: z.enum(['text', 'attachment', 'system']).default('text'),
});

/* ---------- §6.12 Lead ---------- */
export const leadSchema = z.object({
  contactName: z.string().min(1).max(120),
  designation: z.string().max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  companyName: z.string().min(1).max(160),
  website: z.string().max(200).optional(),
  industry: z.string().max(120).optional(),
  companySize: z.string().max(60).optional(),
  location: z.string().max(160).optional(),
  source: z.string().max(80).optional(),
  service: z.string().max(120).optional(),
  hiringNeed: z.string().max(1000).optional(),
  openings: z.number().int().min(0).max(100000).optional(),
  value: money.optional(),
  budget: money.optional(),
  currency: currency.optional(),
  closeDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  owner: z.string().optional(),
  team: z.string().max(120).optional(),
  branch: z.string().max(120).optional(),
  nextFollowUp: z.string().optional(),
  notes: z.string().max(4000).optional(),
  consent: z.string().max(200).optional(),
  stage: z.enum(['New', 'Contacted', 'Qualified', 'Discovery Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurture']).default('New'),
});

export const invoiceSchema = z.object({
  orgId: z.string().min(1),
  subscriptionId: z.string().optional(),
  billingEntity: z.string().max(200).optional(),
  billingAddress: z.string().max(500).optional(),
  taxIds: z.string().max(200).optional(),
  billingPeriod: z.string().max(60).optional(),
  lines: z.array(z.object({ label: z.string(), qty: z.number().positive(), unit: money })).min(1),
  discount: money.default(0),
  taxRate: z.number().min(0).max(100).default(18),
  dueDate: z.string().min(1),
  currency: currency.optional(),
  agreementId: z.string().optional(),
  paymentTermsDays: z.number().int().min(1).max(60).optional(),
  replacementNote: z.string().max(500).optional(),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: money,
  method: z.string().default('upi'),
  provider: z.string().default('manual'),
  reference: z.string().optional(),
  // Idempotency keys must carry enough entropy to be unguessable.
  idempotencyKey: z.string().min(12).max(120),
});

export const HIRING_TYPES = ['Junior IT roles', 'Mid-level IT roles', 'Senior / niche technology roles', 'Leadership / executive search', 'Bulk hiring'] as const;

export const commissionAgreementSchema = z.object({
  orgId: z.string().min(1),
  jobId: z.string().optional(),
  agencyId: z.string().optional(),
  hiringType: z.enum(HIRING_TYPES).default('Mid-level IT roles'),
  feeModel: z.enum(['percentage', 'fixed']).default('percentage'),
  rate: z.number().min(0).max(100).default(8.33),
  fixedFee: money.optional(),
  basisType: z.enum(['annual_ctc', 'monthly_ctc']).default('annual_ctc'),
  contractMonths: z.number().int().min(1).max(36).default(12),
  currency: currency.optional(),
  trigger: z.enum(['Offer Accepted', 'Joined']).default('Joined'),
  paymentTermsDays: z.number().int().min(1).max(60).default(30),
  replacementDays: z.number().int().min(0).max(365).default(90),
  gstApplicable: z.boolean().default(true),
  taxTreatment: z.string().max(120).optional(),
  replacementTerms: z.string().max(1000).optional(),
  ownershipClause: z.string().max(1000).optional(),
  duplicatePolicy: z.string().max(1000).optional(),
  cancellationTerms: z.string().max(1000).optional(),
  templateId: z.string().optional(),
});

export const agreementTemplateSchema = z.object({
  name: z.string().min(3).max(160),
  orgId: z.string().optional(),
  hiringType: z.enum(HIRING_TYPES).optional(),
  rateMin: z.number().min(0).max(100).optional(),
  rateMax: z.number().min(0).max(100).optional(),
  basisType: z.enum(['annual_ctc', 'monthly_ctc']).optional(),
  contractMonths: z.number().int().min(1).max(36).optional(),
  paymentTermsDays: z.number().int().min(1).max(60).default(30),
  replacementDays: z.number().int().min(0).max(365).default(90),
  gstNote: z.string().max(1000).default('GST charged extra as applicable.'),
  ownershipClause: z.string().max(2000).default('Candidate ownership rests with the introducing party for 90 days from submission; the client hires only introduced candidates through the platform.'),
  duplicatePolicy: z.string().max(2000).default('Duplicate profiles are rejected; the earliest valid submission owns the candidate.'),
  cancellationTerms: z.string().max(2000).default('Either party may cancel with written notice; fees already triggered remain payable.'),
  bodyHtml: z.string().max(60000).optional(),
});

export const feeSlabSchema = z.object({
  hiringType: z.string().min(1),
  rateMin: z.number().min(0).max(100),
  rateMax: z.number().min(0).max(100),
  note: z.string().max(300).default(''),
  retainedAllowed: z.boolean().default(false),
  negotiated: z.boolean().default(false),
});

export const paginate = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().max(160).optional(),
  status: z.string().max(60).optional(),
});

export function paged<T>(rows: T[], page: number, pageSize: number) {
  const total = rows.length;
  const data = rows.slice((page - 1) * pageSize, page * pageSize);
  return { data, pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) } };
}
