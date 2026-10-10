import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(here, '..', '..', 'data');
const DB_FILE = join(DATA_DIR, 'nexatalent.db.json');

export interface DbShape {
  users: any[]; roles: any[]; permissions: any[]; userRoles: any[];
  organizations: any[]; companyProfiles: any[]; agencyProfiles: any[];
  branches: any[]; memberships: any[]; verifications: any[];
  candidateProfiles: any[]; experiences: any[]; educations: any[];
  skills: any[]; candidateSkills: any[]; certifications: any[];
  documents: any[]; consents: any[];
  requisitions: any[]; jobs: any[]; jobSkills: any[]; jobAssignments: any[];
  applications: any[]; stageHistory: any[];
  interviews: any[]; feedback: any[];
  conversations: any[]; messages: any[];
  talentPools: any[]; talentPoolMembers: any[]; savedJobs: any[];
  offers: any[]; placements: any[];
  plans: any[]; planVersions: any[]; entitlements: any[];
  subscriptions: any[]; subscriptionChanges: any[]; usageLedger: any[];
  invoices: any[]; invoiceLines: any[]; payments: any[]; allocations: any[];
  refunds: any[]; creditNotes: any[];
  commissionAgreements: any[]; commissions: any[]; commissionAdjustments: any[];
  feeSlabs: any[]; agreementTemplates: any[]; invoiceReminders: any[];
  payouts: any[]; reconciliations: any[];
  leads: any[]; leadActivities: any[]; opportunities: any[]; targets: any[];
  tasks: any[]; proposals: any[]; meetings: any[]; timesheets: any[]; submissions: any[];
  notifications: any[]; notificationPrefs: any[];
  campaigns: any[]; campaignRecipients: any[]; campaignEvents: any[];
  assignments: any[]; outbox: any[]; idempotency: any[];
  supportTickets: any[];
  candidateInfoRequests: any[];
  privacyRequests: any[];
  auditLogs: any[]; sessions: any[]; passwordResets: any[]; settings: any;
  // legacy compat mirrors
  jobsLegacy: any[]; candidatesLegacy: any[]; tenantsLegacy: any[];
  contractors: any[]; compliance: any[]; credentials: any[];
}

function seed(): DbShape {
  const now = new Date().toISOString();
  return {
    users: [
      { id: 'USR-101', name: 'Super Admin', email: 'superadmin@nexatalent.com', role: 'superadmin', tenantId: 'TNT-GLOBAL', status: 'Active', employeeId: 'NT-001', department: 'Platform', designation: 'Super Admin', branch: 'HQ', lastLogin: now },
      { id: 'USR-102', name: 'Aditi Sharma', email: 'aditi@fintechscaleops.io', role: 'employer', tenantId: 'TNT-9011', status: 'Active', employeeId: 'CL-011', department: 'HR', designation: 'Company Admin', branch: 'Bengaluru', lastLogin: now },
      { id: 'USR-103', name: 'Kiran Sharma', email: 'kiran@nexatalent.com', role: 'employee', tenantId: 'TNT-GLOBAL', status: 'Active', employeeId: 'NT-014', department: 'Operations', designation: 'Operations Admin', branch: 'HQ', lastLogin: now },
      { id: 'USR-104', name: 'Vikram Malhotra', email: 'vikram@apextechsearch.com', role: 'recruiter', tenantId: 'TNT-AGENCY-01', status: 'Active', employeeId: 'AG-007', department: 'Recruitment', designation: 'Internal Recruiter', branch: 'Mumbai', lastLogin: now },
      { id: 'USR-105', name: 'Rajesh Verma', email: 'rajesh@techsolutionsvendor.com', role: 'vendor', tenantId: 'TNT-VENDOR-05', status: 'Active', employeeId: 'VN-003', department: 'Staffing', designation: 'Agency Admin', branch: 'Bengaluru', lastLogin: now },
      { id: 'USR-106', name: 'Siddharth Nair', email: 'candidate@nexatalent.com', role: 'candidate', tenantId: 'TNT-CANDIDATE', status: 'Active', employeeId: '', department: '', designation: '', branch: '', lastLogin: now },
    ],
    roles: ['platform_owner','superadmin','operations_admin','finance_admin','sales_admin','support_admin','company_admin','hiring_manager','company_recruiter','internal_recruiter','bda','sales_manager','candidate','agency_admin','agency_recruiter','finance_staff','employee','employer','recruiter','vendor'].map((r) => ({ id: r, name: r })),
    permissions: ['view','create','edit','archive','delete','approve','reject','suspend','restore','assign','export','manage_billing','manage_permissions','view_sensitive_fields','reconcile','refund','adjust_commission'].map((p) => ({ id: p })),
    userRoles: [],
    organizations: [
      { id: 'TNT-9011', legalName: 'Fintech ScaleOps Technologies Ltd', displayName: 'Fintech ScaleOps', plan: 'Enterprise Custom', seats: '24 / 50', status: 'Active', verificationStatus: 'Approved', accountStatus: 'Active', createdDate: '2024-01-15' },
      { id: 'TNT-9012', legalName: 'HealthCloud Systems Ltd', displayName: 'HealthCloud', plan: 'Growth Tier', seats: '10 / 10', status: 'Active', verificationStatus: 'Approved', accountStatus: 'Active', createdDate: '2024-03-20' },
      { id: 'TNT-GLOBAL', legalName: 'NexaTalent Platform', displayName: 'NexaTalent', plan: 'Platform', seats: '-', status: 'Active', verificationStatus: 'Approved', accountStatus: 'Active', createdDate: '2021-01-01' },
    ],
    companyProfiles: [],
    agencyProfiles: [
      { id: 'AGC-101', legalName: 'Apex Tech Search Pvt Ltd', displayName: 'Apex Tech Search', type: 'Recruitment Agency', specialties: 'Engineering, Product', locations: 'Bengaluru, Mumbai', status: 'Verified Partner', verificationStatus: 'Approved', accountStatus: 'Active', tenantId: 'TNT-AGENCY-01', contactName: 'Vikram Malhotra', contactEmail: 'vikram@apextechsearch.com', commercialModel: 'percentage', agreementStatus: 'Signed', recruiterCount: 1, createdAt: now },
      { id: 'VND-201', legalName: 'Global TechSolutions Staffing Ltd', displayName: 'Global TechSolutions Vendor', type: 'Contingent Staffing Vendor', specialties: 'Cloud, Security', locations: 'Hyderabad, Remote', status: 'Active SOW', verificationStatus: 'Approved', accountStatus: 'Active', tenantId: 'TNT-VENDOR-05', contactName: 'Rajesh Verma', contactEmail: 'rajesh@techsolutionsvendor.com', commercialModel: 'percentage', agreementStatus: 'Signed', recruiterCount: 1, createdAt: now },
    ],
    branches: [
      { id: 'BR-01', orgId: 'TNT-9011', name: 'Bengaluru HQ', city: 'Bengaluru', status: 'Active' },
      { id: 'BR-02', orgId: 'TNT-9011', name: 'Mumbai Branch', city: 'Mumbai', status: 'Active' },
    ],
    memberships: [], verifications: [],
    candidateProfiles: [
      { id: 'CND-9041', name: 'Siddharth Nair', email: 'siddharth.nair@devtech.io', roleTitle: 'Senior Fullstack Systems Architect', experienceYears: 8, location: 'Bengaluru, Karnataka', currentCtc: 2800000, expectedCtc: 3800000, noticePeriod: '15 Days', matchScore: 96, stage: 'Ops Vetted', jobId: 'REQ-9901', submittedBy: 'Apex Tech Search', sourceType: 'Agency', status: 'Active', visibility: 'standard', createdAt: now },
      { id: 'CND-9042', name: 'Ananya Deshpande', email: 'ananya.d@cloudsec.net', roleTitle: 'AWS Cloud Security Architect', experienceYears: 9, location: 'Hyderabad, Telangana', currentCtc: 3200000, expectedCtc: 4200000, noticePeriod: '30 Days', matchScore: 94, stage: 'Tech Round', jobId: 'REQ-8890', submittedBy: 'Global TechSolutions Vendor', sourceType: 'Vendor', status: 'Active', visibility: 'standard', createdAt: now },
    ],
    experiences: [], educations: [],
    skills: ['React','Node.js','TypeScript','Python','AWS','GCP','Azure','Kubernetes','Docker','PostgreSQL','MongoDB','Java','Spring Boot','Go','Rust','React Native','Flutter','Swift','Kotlin','Angular','Vue.js','Django','Flask','.NET','C#','PHP','Laravel','Ruby on Rails','Salesforce','SAP','Data Engineering','Machine Learning','DevOps','Terraform','CI/CD','GraphQL','REST','Microservices','System Design','Agile','QA Automation','Selenium','Cypress'].map((name, i) => ({ id: `SKL-${100 + i}`, name, category: 'Technology', createdAt: now })),
    candidateSkills: [], certifications: [],
    documents: [], consents: [],
    requisitions: [
      { id: 'REQ-9901', orgId: 'TNT-9011', title: 'Senior React / Node Fullstack Architect', department: 'Core Engineering', status: 'Sourcing', openings: 3, employmentType: 'Full-time', location: 'Bengaluru / Hybrid', branch: 'Bengaluru HQ', hiringManager: 'aditi@fintechscaleops.io', recruiter: 'kiran@nexatalent.com', experienceMin: 6, experienceMax: 10, deadline: '2027-02-01T00:00:00.000Z', budgetMin: 3500000, budgetMax: 4500000, currency: 'INR', createdAt: now },
      { id: 'REQ-8890', orgId: 'TNT-9011', title: 'Senior AWS Cloud Security Lead', department: 'Infra Security', status: 'Sourcing', openings: 2, employmentType: 'Contract', location: 'Bengaluru / Hybrid', branch: 'Bengaluru HQ', hiringManager: 'aditi@fintechscaleops.io', recruiter: 'kiran@nexatalent.com', experienceMin: 7, experienceMax: 12, deadline: '2027-02-01T00:00:00.000Z', budgetMin: 3000, budgetMax: 3500, currency: 'INR', payPeriod: 'hourly', createdAt: now },
    ],
    jobs: [
      { id: 'JOB-9901', requisitionId: 'REQ-9901', orgId: 'TNT-9011', title: 'Senior React / Node Fullstack Architect', description: 'Enterprise fintech fullstack role.', status: 'Published', visibility: 'public', location: 'Bengaluru / Hybrid', employmentType: 'Full-time', salaryMin: 3500000, salaryMax: 4500000, currency: 'INR', applicantsCount: 12, startDate: now, expiryDate: '2027-03-01T00:00:00.000Z', assignedAgencies: ['Apex Tech Search'], assignedVendors: ['Global TechSolutions Vendor'], createdAt: now },
      { id: 'JOB-8890', requisitionId: 'REQ-8890', orgId: 'TNT-9011', title: 'Senior AWS Cloud Security Lead', description: 'Cloud security lead.', status: 'Published', visibility: 'public', location: 'Bengaluru / Hybrid', employmentType: 'Contract', salaryMin: 3000, salaryMax: 3500, currency: 'INR', applicantsCount: 5, startDate: now, expiryDate: '2027-03-01T00:00:00.000Z', assignedAgencies: [], assignedVendors: ['Global TechSolutions Vendor'], createdAt: now },
    ],
    jobSkills: [], jobAssignments: [],
    applications: [], stageHistory: [],
    interviews: [
      { id: 'INT-301', applicationId: 'APP-SEED-1', jobId: 'JOB-9901', candidateName: 'Siddharth Nair', candidateEmail: 'siddharth.nair@devtech.io', jobTitle: 'Senior React / Node Fullstack Architect', companyId: 'TNT-9011', round: 'Technical Architecture Deep Dive', scheduledAt: '2026-10-10T08:30:00.000Z', timezone: 'Asia/Kolkata', mode: 'video', meetingLink: 'https://meet.google.com/nxa-tech-eval', status: 'Scheduled', createdAt: now },
    ],
    feedback: [],
    conversations: [], messages: [],
    talentPools: [], talentPoolMembers: [], savedJobs: [],
    offers: [], placements: [],
    plans: [
      { id: 'PLAN-GROWTH', name: 'Growth', target: 'company', interval: 'monthly', price: 14999, currency: 'INR', status: 'Active', version: 1, entitlements: { 'jobs.create': true, 'jobs.active_limit': 10, 'candidates.search': true, 'candidates.profile_view': 200, 'candidates.contact_unlock': 50, 'outreach.send': true, 'outreach.monthly_limit': 1000, 'talent_pool.create': true, 'analytics.advanced': false }, createdAt: now },
      { id: 'PLAN-ENTERPRISE', name: 'Enterprise Custom', target: 'company', interval: 'monthly', price: 49999, currency: 'INR', status: 'Active', version: 1, entitlements: { 'jobs.create': true, 'jobs.active_limit': 100, 'candidates.search': true, 'candidates.profile_view': 5000, 'candidates.contact_unlock': 1000, 'outreach.send': true, 'outreach.monthly_limit': 20000, 'talent_pool.create': true, 'analytics.advanced': true }, createdAt: now },
    ],
    planVersions: [], entitlements: [],
    subscriptions: [
      { id: 'SUB-9011', orgId: 'TNT-9011', planId: 'PLAN-ENTERPRISE', planVersion: 1, status: 'Active', startDate: '2026-01-01', renewalDate: '2027-01-01', price: 49999, currency: 'INR', autoRenew: true, createdAt: now },
    ],
    subscriptionChanges: [], usageLedger: [],
    invoices: [], invoiceLines: [], payments: [], allocations: [],
    refunds: [], creditNotes: [],
    commissionAgreements: [], commissions: [], commissionAdjustments: [],
    feeSlabs: [
      { hiringType: 'Junior IT roles', rateMin: 8.33, rateMax: 8.33, note: '8.33% of annual CTC', updatedAt: now, updatedBy: 'seed' },
      { hiringType: 'Mid-level IT roles', rateMin: 8.33, rateMax: 10, note: '8.33%–10% of annual CTC', updatedAt: now, updatedBy: 'seed' },
      { hiringType: 'Senior / niche technology roles', rateMin: 10, rateMax: 12, note: '10%–12% of annual CTC', updatedAt: now, updatedBy: 'seed' },
      { hiringType: 'Leadership / executive search', rateMin: 12, rateMax: 15, note: '12%–15% or a negotiated retained fee', retainedAllowed: true, updatedAt: now, updatedBy: 'seed' },
      { hiringType: 'Bulk hiring', rateMin: 0, rateMax: 0, note: 'Negotiated rate based on volume', negotiated: true, updatedAt: now, updatedBy: 'seed' },
    ],
    agreementTemplates: [standardTemplate(now)], invoiceReminders: [],
    payouts: [], reconciliations: [],
    leads: [
      { id: 'LEAD-001', contactName: 'Rohit Shetty', companyName: 'AutoLogistics AI Global', email: 'careers@autologistics.ai', stage: 'Qualified', owner: 'kiran@nexatalent.com', value: 850000, currency: 'INR', nextFollowUp: '2026-10-12', createdAt: now },
    ],
    leadActivities: [], opportunities: [], targets: [],
    tasks: [
      { id: 'TSK-701', title: 'Complete candidate vetting interview for Siddharth Nair', client: 'Fintech ScaleOps Technologies Ltd', priority: 'High', dueDate: 'Today, 5:00 PM', status: 'Pending', owner: 'kiran@nexatalent.com' },
      { id: 'TSK-702', title: 'Verify AWS Security certification for Ananya Deshpande', client: 'Fintech ScaleOps Technologies Ltd', priority: 'High', dueDate: 'Today, 6:30 PM', status: 'Pending', owner: 'kiran@nexatalent.com' },
    ],
    proposals: [], meetings: [], timesheets: [], submissions: [],
    notifications: [], notificationPrefs: [],
    campaigns: [], campaignRecipients: [], campaignEvents: [],
    assignments: [], outbox: [], idempotency: [],
    supportTickets: [],
    candidateInfoRequests: [],
    privacyRequests: [],
    auditLogs: [
      { id: 'AUD-1001', timestamp: now, actor: 'system', action: 'SYSTEM_BOOTSTRAP', resource: 'system', recordId: '-', tenantId: 'TNT-GLOBAL', ipAddress: '127.0.0.1' },
    ],
    sessions: [], passwordResets: [],
    settings: { jwtAccessTokenTtl: '15m', jwtRefreshTokenTtl: '7d', rateLimitingPolicy: '100/min', tenantIsolation: 'strict', cors: 'enabled', encryption: 'AES-256-GCM' },
    jobsLegacy: [], candidatesLegacy: [], tenantsLegacy: [],
    contractors: [
      { id: 'CTR-801', name: 'Rajesh Verma', skillset: 'Senior Java Microservices Architect', clientName: 'Fintech ScaleOps Technologies Ltd', hourlyRate: 2800, currency: 'INR', startDate: '2025-11-01', status: 'Active Deployed', slaScore: '99.4%' },
    ],
    compliance: [],
    credentials: [],
  };
}

/** Standard company ↔ platform placement terms (seeded document, editable in-app). */
function standardTemplate(now: string): any {
  return {
    id: 'AGT-STD-001', name: 'Standard Placement Terms', version: 1, status: 'Active', history: [],
    paymentTermsDays: 30, replacementDays: 90,
    gstNote: 'GST charged extra as applicable.',
    ownershipClause: 'Candidate ownership rests with the introducing party for 90 days from submission; the client hires only introduced candidates through the platform.',
    duplicatePolicy: 'Duplicate profiles are rejected; the earliest valid submission owns the candidate.',
    cancellationTerms: 'Either party may cancel with written notice; fees already triggered remain payable.',
    bodyHtml: [
      '<h2>Placement Services Agreement</h2>',
      '<p>Between <strong>NexaTalent IT Solutions</strong> (“Platform”) and <strong>{{company_name}}</strong> (“Company”), effective <strong>{{date}}</strong>.</p>',
      '<h3>1. Scope</h3>',
      '<p>Platform shall source, screen and submit candidates for the Company’s hiring requirements published on NexaTalent.</p>',
      '<h3>2. Commercials</h3>',
      '<table border="1" cellpadding="6" cellspacing="0" width="100%"><tr><th>Hiring type</th><th>Fee (% of annual CTC)</th></tr><tr><td>Junior IT roles</td><td>8.33%</td></tr><tr><td>Mid-level IT roles</td><td>8.33%–10%</td></tr><tr><td>Senior / niche technology roles</td><td>10%–12%</td></tr><tr><td>Leadership / executive search</td><td>12%–15% or negotiated retained fee</td></tr><tr><td>Bulk hiring</td><td>Negotiated rate based on volume</td></tr></table>',
      '<p>Agreed rate for this engagement: <strong>{{rate_percent}}%</strong> of annual CTC ({{hiring_type}}).</p>',
      '<h3>3. Payment</h3>',
      '<p>Fees are payable within <strong>{{payment_days}} days</strong> of the candidate’s joining date. {{gst_note}}</p>',
      '<h3>4. Replacement</h3>',
      '<p>Platform offers a free replacement within <strong>{{replacement_days}} days</strong> of joining, subject to the defined conditions (resignation or termination for non-performance, prompt written notice by the Company).</p>',
      '<h3>5. Candidate ownership</h3>',
      '<p>{{ownership}}</p>',
      '<h3>6. Duplicates &amp; cancellations</h3>',
      '<p>{{duplicates}}</p><p>{{cancellation}}</p>',
      '<h3>7. Signatures</h3>',
      '<table border="0" cellpadding="6" cellspacing="0" width="100%"><tr><td>For Platform:<br/><br/>___________________<br/>Authorised signatory</td><td>For Company:<br/><br/>___________________<br/>Authorised signatory</td></tr></table>',
    ].join('\n'),
    createdBy: 'seed', createdAt: now,
  };
}
let db: DbShape | null = null;

/**
 * Demo seed guard: the bundled seed contains sample people/orgs for local
 * development. Set DEMO_SEED=off in production and provision via the API.
 */
function emptyDb(): DbShape {
  const s = seed();
  (Object.keys(s) as (keyof DbShape)[]).forEach((k) => {
    if (Array.isArray((s as any)[k])) (s as any)[k] = [];
  });
  return s;
}

export function loadDb(): DbShape {
  if (db) return db;
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    if (existsSync(DB_FILE)) {
      const raw = readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      const fresh = seed();
      db = { ...fresh, ...parsed };
      // Backfill reference collections for DBs created before they were seeded.
      if ((db!.skills || []).length === 0) db!.skills = fresh.skills;
      if ((db!.agencyProfiles || []).length === 0) db!.agencyProfiles = fresh.agencyProfiles;
      if (!Array.isArray((db as any).candidateInfoRequests)) (db as any).candidateInfoRequests = [];
      if (!Array.isArray((db as any).privacyRequests)) (db as any).privacyRequests = [];
      // Backfill the standard agreement template for DBs seeded before it existed.
      if (Array.isArray((db as any).agreementTemplates) && !(db as any).agreementTemplates.find((t: any) => t.id === 'AGT-STD-001')) {
        (db as any).agreementTemplates.unshift(standardTemplate(new Date().toISOString()));
      }
      // Backfill filterable requirement fields on older requisitions.
      for (const r of (db!.requisitions as any[])) {
        const ref = (fresh.requisitions as any[]).find((f) => f.id === r.id);
        if (ref) for (const k of ['branch', 'recruiter', 'hiringManager', 'experienceMin', 'experienceMax', 'deadline']) {
          if (r[k] === undefined || r[k] === '') r[k] = ref[k];
        }
      }
      // Backfill login-tenant links + new columns on seed agencies.
      for (const a of (db!.agencyProfiles as any[])) {
        const ref = (fresh.agencyProfiles as any[]).find((f) => f.id === a.id);
        if (ref) for (const k of ['tenantId', 'contactName', 'contactEmail', 'commercialModel', 'agreementStatus', 'recruiterCount']) {
          if (a[k] === undefined || a[k] === '' || a[k] === 0) a[k] = ref[k];
        }
      }
      persist();
      return db!;
    }
  } catch { /* fall through to seed */ }
  db = process.env.DEMO_SEED === 'off' ? emptyDb() : seed();
  persist();
  return db!;
}

export function persist(): void {
  try {
    if (!db) return;
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch { /* never crash on persist */ }
}

export function collection<T = any>(name: keyof DbShape): T[] {
  const d = loadDb();
  const c: any = (d as any)[name];
  if (Array.isArray(c)) return c as T[];
  return [];
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296).toString(36).toUpperCase().padEnd(2, 'X')}`;
}

export function nowIso(): string { return new Date().toISOString(); }

export function audit(actor: string, action: string, tenantId: string, resource = '-', recordId = '-', ip = '127.0.0.1', meta: any = {}): void {
  const d = loadDb();
  d.auditLogs.unshift({ id: uid('AUD'), timestamp: nowIso(), actor, action, resource, recordId, tenantId, ipAddress: ip, ...meta });
  if (d.auditLogs.length > 5000) d.auditLogs.length = 5000;
  persist();
}
