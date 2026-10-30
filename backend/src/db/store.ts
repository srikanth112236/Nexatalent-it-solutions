import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'fs';
import { randomBytes } from 'crypto';
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
  payouts: any[]; reconciliations: any[]; payrollRuns: any[];
  leads: any[]; leadActivities: any[]; opportunities: any[]; targets: any[];
  tasks: any[]; proposals: any[]; meetings: any[]; timesheets: any[]; submissions: any[];
  notifications: any[]; notificationPrefs: any[]; mailOutbox: any[];
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
      { id: 'USR-101', name: 'Super Admin', email: 'superadmin@nexatalent.com', role: 'superadmin', tenantId: 'TNT-GLOBAL', status: 'Active', employeeId: 'NT-001', department: 'Platform', designation: 'Super Admin', branch: 'HQ', lastLogin: now, emailVerified: true },
      { id: 'USR-102', name: 'Aditi Sharma', email: 'aditi@fintechscaleops.io', role: 'employer', tenantId: 'TNT-9011', status: 'Active', employeeId: 'CL-011', department: 'HR', designation: 'Company Admin', branch: 'Bengaluru', lastLogin: now, emailVerified: true },
      { id: 'USR-103', name: 'Kiran Sharma', email: 'kiran@nexatalent.com', role: 'employee', tenantId: 'TNT-GLOBAL', status: 'Active', employeeId: 'NT-014', department: 'Operations', designation: 'Operations Admin', branch: 'HQ', lastLogin: now, emailVerified: true },
      { id: 'USR-104', name: 'Vikram Malhotra', email: 'vikram@apextechsearch.com', role: 'recruiter', tenantId: 'TNT-AGENCY-01', status: 'Active', employeeId: 'AG-007', department: 'Recruitment', designation: 'Internal Recruiter', branch: 'Mumbai', lastLogin: now, emailVerified: true },
      { id: 'USR-105', name: 'Rajesh Verma', email: 'rajesh@techsolutionsvendor.com', role: 'vendor', tenantId: 'TNT-VENDOR-05', status: 'Active', employeeId: 'VN-003', department: 'Staffing', designation: 'Agency Admin', branch: 'Bengaluru', lastLogin: now, emailVerified: true },
      { id: 'USR-106', name: 'Siddharth Nair', email: 'candidate@nexatalent.com', role: 'candidate', tenantId: 'TNT-CANDIDATE', status: 'Active', employeeId: '', department: '', designation: '', branch: '', lastLogin: now, emailVerified: true },
    ],
    roles: seedRoles(now),
    permissions: ['view','create','edit','archive','delete','approve','reject','suspend','restore','assign','export','manage_billing','manage_permissions','view_sensitive_fields','reconcile','refund','adjust_commission'].map((p) => ({ id: p })),
    userRoles: [],
    organizations: [
      { id: 'TNT-9011', legalName: 'Fintech ScaleOps Technologies Ltd', displayName: 'Fintech ScaleOps', plan: 'Enterprise Custom', seats: '24 / 50', status: 'Active', verificationStatus: 'Approved', accountStatus: 'Active', createdDate: '2024-01-15' },
      { id: 'TNT-9012', legalName: 'HealthCloud Systems Ltd', displayName: 'HealthCloud', plan: 'Growth Tier', seats: '10 / 10', status: 'Active', verificationStatus: 'Approved', accountStatus: 'Active', createdDate: '2024-03-20' },
      { id: 'TNT-GLOBAL', legalName: 'NexaTalent Platform', displayName: 'NexaTalent', plan: 'Platform', seats: '-', status: 'Active', verificationStatus: 'Approved', accountStatus: 'Active', createdDate: '2021-01-01' },
    ],
    companyProfiles: [],
    agencyProfiles: [
      { id: 'AGC-101', legalName: 'Apex Tech Search Pvt Ltd', displayName: 'Apex Tech Search', type: 'Recruitment Agency', entityType: 'Private Limited', specialties: 'Engineering, Product', locations: 'Bengaluru, Mumbai', status: 'Verified Partner', verificationStatus: 'Approved', accountStatus: 'Active', tenantId: 'TNT-AGENCY-01', contactName: 'Vikram Malhotra', contactEmail: 'vikram@apextechsearch.com', contactPhone: '+91-80-41120011', country: 'India', registrationNumber: 'CIN-U74999KA2019PTC121101', taxIds: '29AABCT1011A1Z5 / PAN-AABCT1011F', website: 'https://apextechsearch.example.com', address: 'Prestige Towers, Residency Rd, Bengaluru 560025', commercialModel: 'percentage', agreementStatus: 'Signed', recruiterCount: 1, accountManager: 'operations@nexatalent.com', verificationHistory: [{ from: 'Pending', to: 'Approved', at: now, by: 'superadmin@nexatalent.com', reason: 'GSTIN + CIN verified; MSA signed.' }], createdAt: now },
      { id: 'VND-201', legalName: 'Global TechSolutions Staffing Ltd', displayName: 'Global TechSolutions Vendor', type: 'Contingent Staffing Vendor', entityType: 'Private Limited', specialties: 'Cloud, Security', locations: 'Hyderabad, Remote - India', status: 'Active SOW', verificationStatus: 'Approved', accountStatus: 'Active', tenantId: 'TNT-VENDOR-05', contactName: 'Rajesh Verma', contactEmail: 'rajesh@techsolutionsvendor.com', contactPhone: '+91-40-41120311', country: 'India', registrationNumber: 'CIN-U74999TG2020PTC130101', taxIds: '36AABCS2011F1Z5 / PAN-AABCS2011F', website: 'https://techsolutionsvendor.example.com', address: 'HITEC City, Hyderabad 500081', commercialModel: 'percentage', agreementStatus: 'Signed', recruiterCount: 1, accountManager: 'operations@nexatalent.com', verificationHistory: [{ from: 'Pending', to: 'Approved', at: now, by: 'superadmin@nexatalent.com', reason: 'SOW + GSTIN verified.' }], createdAt: now },
    ],
    branches: [
      { id: 'BR-01', orgId: 'TNT-9011', name: 'Bengaluru HQ', city: 'Bengaluru', status: 'Active' },
      { id: 'BR-02', orgId: 'TNT-9011', name: 'Mumbai Branch', city: 'Mumbai', status: 'Active' },
    ],
    memberships: [], verifications: [],
    candidateProfiles: [
      { id: 'CND-9041', name: 'Siddharth Nair', email: 'siddharth.nair@devtech.io', phone: '+91-9820011223', headline: 'Senior Fullstack Systems Architect | 8y | React/Node | Bengaluru', roleTitle: 'Senior Fullstack Systems Architect', experienceYears: 8, location: 'Bengaluru, Karnataka', preferredLocation: 'Bengaluru / Remote - India', country: 'India', contactPrefs: 'Email + phone, 10am-7pm IST', currentCtc: 2800000, expectedCtc: 3800000, payPeriod: 'annual', noticePeriod: '15 Days', availability: 'Employed — serving 15-day notice', source: 'agency', sourceType: 'Agency', submittedBy: 'Apex Tech Search', assignedRecruiter: 'vikram@apextechsearch.com', summary: 'Fullstack architect, 8y across fintech. Leads React/Node platform squads; 96/100 role fit.', objectives: 'Next: staff/principal scope in Bengaluru / remote.', education: 'B.Tech (Computer Science), IIT Delhi — 2016', skills: 'React, Node.js, AWS', matchScore: 96, stage: 'Ops Vetted', jobId: 'REQ-9901', status: 'Active', visibility: 'standard', resumeRef: 'resumes/CND-9041.pdf', resumeVersion: 2, createdAt: now, updatedAt: now },
      { id: 'CND-9042', name: 'Ananya Deshpande', email: 'ananya.d@cloudsec.net', phone: '+91-9820022334', headline: 'AWS Cloud Security Architect | 9y | Cloud Security | Hyderabad', roleTitle: 'AWS Cloud Security Architect', experienceYears: 9, location: 'Hyderabad, Telangana', preferredLocation: 'Hyderabad / Remote - India', country: 'India', contactPrefs: 'Email preferred', currentCtc: 3200000, expectedCtc: 4200000, payPeriod: 'annual', noticePeriod: '30 Days', availability: 'Employed — serving 30-day notice', source: 'vendor', sourceType: 'Vendor', submittedBy: 'Global TechSolutions Vendor', assignedRecruiter: 'rajesh@techsolutionsvendor.com', summary: 'Cloud security architect, 9y across infra. Zero-trust AWS estates; 94/100 role fit.', objectives: 'Next: security lead scope, contract-friendly.', education: 'M.Tech (Security), IIIT Hyderabad — 2015', skills: 'AWS, Cloud Security, Terraform', matchScore: 94, stage: 'Tech Round', jobId: 'REQ-8890', status: 'Active', visibility: 'standard', resumeRef: 'resumes/CND-9042.pdf', resumeVersion: 1, createdAt: now, updatedAt: now },
    ],
    experiences: [
      { id: 'EXP-9041-1', candidateEmail: 'siddharth.nair@devtech.io', employer: 'Fintech ScaleOps', designation: 'Senior Fullstack Systems Architect', years: 5, startDate: '2021-04-01', endDate: null, current: true, createdAt: now },
      { id: 'EXP-9041-0', candidateEmail: 'siddharth.nair@devtech.io', employer: 'Devtech Labs', designation: 'Fullstack Engineer', years: 3, startDate: '2018-06-01', endDate: '2021-03-31', current: false, createdAt: now },
      { id: 'EXP-9042-1', candidateEmail: 'ananya.d@cloudsec.net', employer: 'CloudSec Systems', designation: 'AWS Cloud Security Architect', years: 6, startDate: '2020-02-01', endDate: null, current: true, createdAt: now },
    ],
    educations: [
      { id: 'EDU-9041', candidateEmail: 'siddharth.nair@devtech.io', institution: 'IIT Delhi', qualification: 'B.Tech', field: 'Computer Science', year: '2016', score: '8.4 CGPA', createdAt: now },
      { id: 'EDU-9042', candidateEmail: 'ananya.d@cloudsec.net', institution: 'IIIT Hyderabad', qualification: 'M.Tech', field: 'Security', year: '2015', score: '8.9 CGPA', createdAt: now },
    ],
    skills: seedSkills(now),
    candidateSkills: [
      { id: 'CSK-9041-0', candidateEmail: 'siddharth.nair@devtech.io', skill: 'React', level: 'Expert' },
      { id: 'CSK-9041-1', candidateEmail: 'siddharth.nair@devtech.io', skill: 'Node.js', level: 'Expert' },
      { id: 'CSK-9041-2', candidateEmail: 'siddharth.nair@devtech.io', skill: 'AWS', level: 'Advanced' },
      { id: 'CSK-9042-0', candidateEmail: 'ananya.d@cloudsec.net', skill: 'AWS', level: 'Expert' },
      { id: 'CSK-9042-1', candidateEmail: 'ananya.d@cloudsec.net', skill: 'Cloud Security', level: 'Expert' },
    ],
    certifications: [
      { id: 'CERT-9041', candidateEmail: 'siddharth.nair@devtech.io', name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2023', createdAt: now },
      { id: 'CERT-9042', candidateEmail: 'ananya.d@cloudsec.net', name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2022', createdAt: now },
    ],
    documents: [
      { id: 'DOC-9041', candidateEmail: 'siddharth.nair@devtech.io', ownerEmail: 'siddharth.nair@devtech.io', name: 'CND-9041-resume.pdf', kind: 'resume', mime: 'application/pdf', ref: 'resumes/CND-9041.pdf', version: 2, uploadedAt: now, createdAt: now },
      { id: 'DOC-9042', candidateEmail: 'ananya.d@cloudsec.net', ownerEmail: 'ananya.d@cloudsec.net', name: 'CND-9042-resume.pdf', kind: 'resume', mime: 'application/pdf', ref: 'resumes/CND-9042.pdf', version: 1, uploadedAt: now, createdAt: now },
    ],
    consents: [
      { id: 'CON-9041', candidateEmail: 'siddharth.nair@devtech.io', email: 'siddharth.nair@devtech.io', purpose: 'placement-processing', status: 'granted', marketing: true, visibility: 'standard', withdrawn: false, createdAt: now },
      { id: 'CON-9042', candidateEmail: 'ananya.d@cloudsec.net', email: 'ananya.d@cloudsec.net', purpose: 'placement-processing', status: 'granted', marketing: false, visibility: 'standard', withdrawn: false, createdAt: now },
    ],
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
    payouts: [], reconciliations: [], payrollRuns: [],
    leads: [
      { id: 'LEAD-001', contactName: 'Rohit Shetty', companyName: 'AutoLogistics AI Global', email: 'careers@autologistics.ai', stage: 'Qualified', owner: 'kiran@nexatalent.com', value: 850000, currency: 'INR', nextFollowUp: '2026-10-12', createdAt: now },
    ],
    leadActivities: [], opportunities: [], targets: [],
    tasks: [
      { id: 'TSK-701', title: 'Complete candidate vetting interview for Siddharth Nair', client: 'Fintech ScaleOps Technologies Ltd', priority: 'High', dueDate: 'Today, 5:00 PM', status: 'Pending', owner: 'kiran@nexatalent.com' },
      { id: 'TSK-702', title: 'Verify AWS Security certification for Ananya Deshpande', client: 'Fintech ScaleOps Technologies Ltd', priority: 'High', dueDate: 'Today, 6:30 PM', status: 'Pending', owner: 'kiran@nexatalent.com' },
    ],
    proposals: [], meetings: [], timesheets: [], submissions: [],
    notifications: [], notificationPrefs: [], mailOutbox: [],
    campaigns: [], campaignRecipients: [], campaignEvents: [],
    assignments: [], outbox: [], idempotency: [],
    supportTickets: [],
    candidateInfoRequests: [],
    privacyRequests: [],
    auditLogs: [
      { id: 'AUD-1001', timestamp: now, actor: 'system', action: 'SYSTEM_BOOTSTRAP', resource: 'system', recordId: '-', tenantId: 'TNT-GLOBAL', ipAddress: '127.0.0.1' },
    ],
    sessions: [], passwordResets: [],
    settings: { jwtAccessTokenTtl: '15m', jwtRefreshTokenTtl: '7d', rateLimitingPolicy: '100/min', tenantIsolation: 'strict', cors: 'enabled', encryption: 'AES-256-GCM', payrollRules: { standardHours: 160, overtimeMultiplier: 1.5, payoutPercent: 82, taxRate: 18 } },
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
/** Platform roles with scope + purpose (§4). Permissions mirror the rbac template; edits take effect via effectivePermissions. */
function seedRoles(now: string): any[] {
  const defs: Array<[string, string, string]> = [
    ['platform_owner', 'platform', 'Full platform ownership. Sees and does everything.'],
    ['superadmin', 'platform', 'Day-to-day platform administration across all tenants.'],
    ['operations_admin', 'platform', 'Recruitment operations: requisitions, jobs, interviews, placements.'],
    ['finance_admin', 'platform', 'Billing, invoices, refunds, commissions and payouts.'],
    ['sales_admin', 'platform', 'Leads, opportunities and sales pipeline management.'],
    ['support_admin', 'platform', 'Support tickets and account assistance.'],
    ['company_admin', 'company', 'Company workspace owner: hiring, billing, users.'],
    ['hiring_manager', 'company', 'Approves requisitions, interviews and offers.'],
    ['company_recruiter', 'company', 'Runs sourcing, pipelines and scheduling.'],
    ['internal_recruiter', 'platform', 'Platform-side recruiter working mandates.'],
    ['bda', 'platform', 'Business development: prospects and lead conversion.'],
    ['sales_manager', 'platform', 'Owns targets, pricing and deal approvals.'],
    ['candidate', 'candidate', 'Job seeker: profile, applications, interviews.'],
    ['agency_admin', 'agency', 'Agency owner: mandates, submissions, commissions.'],
    ['agency_recruiter', 'agency', 'Agency recruiter: submissions and pipeline.'],
    ['finance_staff', 'platform', 'Read-mostly finance support (no refunds/payouts).'],
    ['employee', 'platform', 'Legacy alias of operations staff.'],
    ['employer', 'company', 'Legacy alias of company hiring user.'],
    ['recruiter', 'agency', 'Legacy alias of agency recruiter.'],
    ['vendor', 'agency', 'Staffing vendor: contractors, timesheets, SOW.'],
  ];
  return defs.map(([id, scope, description]) => ({ id, name: id, scope, description, system: true, createdAt: now }));
}
function seedSkills(now: string): any[] {
  const pairs: Array<[string, string]> = [
    ['React','Technology'],['Node.js','Technology'],['TypeScript','Technology'],['Python','Technology'],['Java','Technology'],['Spring Boot','Technology'],['Go','Technology'],['Rust','Technology'],['.NET','Technology'],['C#','Technology'],['PHP','Technology'],['Laravel','Technology'],['Ruby on Rails','Technology'],['Swift','Technology'],['Kotlin','Technology'],['Flutter','Technology'],['React Native','Technology'],['Angular','Technology'],['Vue.js','Technology'],['Django','Technology'],['Flask','Technology'],
    ['Data Engineering','Data & AI'],['Machine Learning','Data & AI'],['Deep Learning','Data & AI'],['NLP','Data & AI'],['Computer Vision','Data & AI'],['MLOps','Data & AI'],['Data Analysis','Data & AI'],['SQL','Data & AI'],['Power BI','Data & AI'],['Tableau','Data & AI'],['Excel Modelling','Data & AI'],['Statistics','Data & AI'],['A/B Testing','Data & AI'],['Prompt Engineering','Data & AI'],['Data Warehousing','Data & AI'],['ETL','Data & AI'],
    ['AWS','Cloud & DevOps'],['GCP','Cloud & DevOps'],['Azure','Cloud & DevOps'],['Kubernetes','Cloud & DevOps'],['Docker','Cloud & DevOps'],['Terraform','Cloud & DevOps'],['CI/CD','Cloud & DevOps'],['Linux Administration','Cloud & DevOps'],['Site Reliability Engineering','Cloud & DevOps'],['Cloud Security','Cloud & DevOps'],['Network Administration','Cloud & DevOps'],['VMware','Cloud & DevOps'],
    ['Microservices','Technology'],['System Design','Technology'],['GraphQL','Technology'],['REST','Technology'],['PostgreSQL','Technology'],['MongoDB','Technology'],['Redis','Technology'],['Kafka','Technology'],['Elasticsearch','Technology'],['Salesforce','Technology'],['SAP','Technology'],['ServiceNow','Technology'],['Workday','Technology'],['Oracle ERP','Technology'],['DevOps','Technology'],['Agile','Technology'],['QA Automation','Technology'],['Selenium','Technology'],['Cypress','Technology'],['Playwright','Technology'],['Performance Testing','Technology'],['Cybersecurity','Technology'],['Penetration Testing','Technology'],['Blockchain','Technology'],['Embedded Systems','Technology'],['IoT','Technology'],
    ['Nursing','Healthcare'],['Patient Care','Healthcare'],['Medical Coding','Healthcare'],['Pharmacy','Healthcare'],['Physiotherapy','Healthcare'],['Radiology','Healthcare'],['Lab Technology','Healthcare'],['Clinical Research','Healthcare'],['Healthcare Administration','Healthcare'],['Medical Transcription','Healthcare'],['Nutrition & Dietetics','Healthcare'],['Emergency Care','Healthcare'],
    ['Financial Accounting','Finance'],['Tally','Finance'],['GST Compliance','Finance'],['Auditing','Finance'],['Investment Banking','Finance'],['Equity Research','Finance'],['Risk Management','Finance'],['Credit Analysis','Finance'],['Payroll Processing','Finance'],['Budgeting & Forecasting','Finance'],['Chartered Accountancy','Finance'],['Company Secretaryship','Finance'],['Insurance Underwriting','Finance'],['Actuarial Science','Finance'],
    ['AutoCAD','Engineering'],['Mechanical Design','Engineering'],['Electrical Wiring','Engineering'],['Civil Estimation','Engineering'],['Structural Analysis','Engineering'],['HVAC','Engineering'],['Plumbing Design','Engineering'],['Quality Assurance','Engineering'],['Six Sigma','Engineering'],['Lean Manufacturing','Engineering'],['CNC Programming','Engineering'],['Welding','Engineering'],
    ['B2B Sales','Sales'],['Lead Generation','Sales'],['Cold Calling','Sales'],['Negotiation','Sales'],['Account Management','Sales'],['Channel Sales','Sales'],['Enterprise Sales','Sales'],['Salesforce CRM','Sales'],['HubSpot','Sales'],['Inside Sales','Sales'],
    ['Digital Marketing','Marketing'],['SEO','Marketing'],['SEM','Marketing'],['Social Media Marketing','Marketing'],['Content Writing','Marketing'],['Email Marketing','Marketing'],['Brand Management','Marketing'],['Market Research','Marketing'],['Public Relations','Marketing'],['Event Management','Marketing'],['Video Editing','Marketing'],['Copywriting','Marketing'],
    ['Talent Acquisition','HR'],['Payroll Management','HR'],['Employee Relations','HR'],['Performance Management','HR'],['HR Compliance','HR'],['Compensation & Benefits','HR'],['Training & Development','HR'],['HR Analytics','HR'],
    ['Supply Chain Management','Operations'],['Inventory Management','Operations'],['Warehouse Operations','Operations'],['Procurement','Operations'],['Vendor Management','Operations'],['Logistics Planning','Operations'],['Last-mile Delivery','Operations'],['Fleet Management','Operations'],['Customs Clearance','Operations'],
    ['UI Design','Design'],['UX Research','Design'],['Figma','Design'],['Adobe Photoshop','Design'],['Adobe Illustrator','Design'],['Motion Graphics','Design'],['Product Design','Design'],['Design Systems','Design'],
    ['Corporate Law','Legal'],['Contract Drafting','Legal'],['Litigation','Legal'],['Intellectual Property','Legal'],['Compliance Management','Legal'],['Paralegal Support','Legal'],
    ['Customer Support','Support'],['Technical Support','Support'],['Chat Support','Support'],['Voice Process','Support'],['Customer Success','Support'],['Helpdesk Management','Support'],
    ['Teaching','Education'],['Curriculum Design','Education'],['E-learning Development','Education'],['Academic Counselling','Education'],
    ['Hotel Management','Hospitality'],['Food & Beverage Service','Hospitality'],['Housekeeping Operations','Hospitality'],['Front Office','Hospitality'],['Travel Planning','Hospitality'],
    ['Site Supervision','Construction'],['Quantity Surveying','Construction'],['Safety Compliance','Construction'],
  ];
  return pairs.map(([name, category], i) => ({ id: `SKL-${100 + i}`, name, category, createdAt: now }));
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
      else {
        // Merge newer taxonomy entries by name (keeps custom-added skills).
        const have = new Set((db!.skills as any[]).map((s: any) => String(s.name).toLowerCase()));
        for (const s of (fresh.skills as any[])) {
          if (!have.has(String(s.name).toLowerCase())) { (db!.skills as any[]).push(s); have.add(String(s.name).toLowerCase()); }
        }
      }
      if ((db!.agencyProfiles || []).length === 0) db!.agencyProfiles = fresh.agencyProfiles;
      if (!Array.isArray((db as any).candidateInfoRequests)) (db as any).candidateInfoRequests = [];
      if (!Array.isArray((db as any).privacyRequests)) (db as any).privacyRequests = [];
      // Backfill the standard agreement template for DBs seeded before it existed.
      if (Array.isArray((db as any).agreementTemplates) && !(db as any).agreementTemplates.find((t: any) => t.id === 'AGT-STD-001')) {
        (db as any).agreementTemplates.unshift(standardTemplate(new Date().toISOString()));
      }
      // Backfill platform payroll rules (timesheet → payroll math) for older DBs.
      if (db && typeof (db as any).settings === 'object' && !(db as any).settings.payrollRules) {
        (db as any).settings.payrollRules = { standardHours: 160, overtimeMultiplier: 1.5, payoutPercent: 82, taxRate: 18 };
      }
      // Backfill filterable requirement fields on older requisitions.
      for (const r of (db!.requisitions as any[])) {
        const ref = (fresh.requisitions as any[]).find((f) => f.id === r.id);
        if (ref) for (const k of ['branch', 'recruiter', 'hiringManager', 'experienceMin', 'experienceMax', 'deadline']) {
          if (r[k] === undefined || r[k] === '') r[k] = ref[k];
        }
      }
      // Backfill commercial columns on older agreements (slabs, basis, terms).
      for (const a of (db!.commissionAgreements as any[])) {
        if (a.hiringType === undefined) a.hiringType = 'Mid-level IT roles';
        if (a.basisType === undefined) a.basisType = 'annual_ctc';
        if (a.contractMonths === undefined) a.contractMonths = 12;
        if (a.paymentTermsDays === undefined) a.paymentTermsDays = 30;
        if (a.replacementDays === undefined) a.replacementDays = 90;
        if (a.gstApplicable === undefined) a.gstApplicable = true;
        if (a.companyAccepted === undefined) { a.companyAccepted = false; a.acceptedAt = null; a.acceptedBy = null; }
        if (!a.ownershipClause) a.ownershipClause = 'Candidate ownership rests with the introducing party for 90 days from submission; the client hires only introduced candidates through the platform.';
        if (!a.duplicatePolicy) a.duplicatePolicy = 'Duplicate profiles are rejected; the earliest valid submission owns the candidate.';
        if (!a.cancellationTerms) a.cancellationTerms = 'Either party may cancel with written notice; fees already triggered remain payable.';
        if (!a.replacementTerms) a.replacementTerms = `Free replacement within ${a.replacementDays ?? 90} days of joining under the defined conditions.`;
      }
      // Backfill role metadata (scope/description/system) on older role rows.
      for (const r of (fresh.roles as any[])) {
        const cur: any = (db!.roles as any[]).find((x: any) => x.id === r.id);
        if (!cur) (db!.roles as any[]).push(r);
        else for (const k of ['scope', 'description', 'system']) if (cur[k] === undefined) cur[k] = (r as any)[k];
      }
      // Backfill login-tenant links + new columns on seed agencies.
      for (const a of (db!.agencyProfiles as any[])) {
        const ref = (fresh.agencyProfiles as any[]).find((f) => f.id === a.id);
        if (ref) for (const k of ['tenantId', 'contactName', 'contactEmail', 'commercialModel', 'agreementStatus', 'recruiterCount']) {
          if (a[k] === undefined || a[k] === '' || a[k] === 0) a[k] = ref[k];
        }
      }
      // Backfill contractor deployment & timesheets for candidate@nexatalent.com
      if (!Array.isArray((db as any).contractors)) (db as any).contractors = [];
      const hasCandContractor = (db as any).contractors.some((c: any) => c.candidateEmail === 'candidate@nexatalent.com');
      if (!hasCandContractor) {
        (db as any).contractors.unshift({
          id: 'CTR-CAND-01',
          candidateId: 'USR-106',
          candidateEmail: 'candidate@nexatalent.com',
          name: 'Siddharth Nair',
          roleTitle: 'Lead Fullstack Cloud Engineer',
          skillset: 'React 19, TypeScript, Node.js, AWS Cloud, Distributed Architecture',
          clientName: 'Fintech ScaleOps Technologies Ltd',
          clientTenant: 'TNT-9011',
          vendorTenant: 'TNT-VENDOR-05',
          managerName: 'Aditi Sharma',
          managerEmail: 'aditi@fintechscaleops.io',
          managerDesignation: 'VP of Engineering',
          hourlyRate: 2800,
          currency: 'INR',
          startDate: '2026-08-01',
          endDate: '2027-07-31',
          status: 'Active Deployed',
          slaScore: '99.8%',
          billingCycle: 'Weekly (Mon - Sun)',
          payoutTerms: 'Net-15 Direct Payout',
          sowNumber: 'SOW-FSO-2026-881',
          workLocation: 'Bengaluru / Hybrid',
          projectCode: 'FSO-CORE-NEOBANK-V3',
          standardHoursPerWeek: 40
        });
      }
      if (!Array.isArray((db as any).timesheets)) (db as any).timesheets = [];
      const hasCandTs = (db as any).timesheets.some((t: any) => t.contractorId === 'CTR-CAND-01');
      if (!hasCandTs) {
        (db as any).timesheets.unshift(
          {
            id: 'TSH-CAND-W43',
            contractorId: 'CTR-CAND-01',
            contractorName: 'Siddharth Nair',
            clientName: 'Fintech ScaleOps Technologies Ltd',
            clientTenant: 'TNT-9011',
            vendorTenant: 'TNT-VENDOR-05',
            period: '2026-10',
            weekLabel: 'Week 43 (Oct 19 – Oct 25, 2026)',
            hours: 40,
            hourlyRate: 2800,
            billableAmount: 112000,
            project: 'Neobank Core Ledger & Reconciliation Webhooks',
            notes: 'Completed Redis idempotency pipeline and unit tests with 98% coverage.',
            dailyBreakdown: [
              { day: 'Mon', date: '2026-10-19', hours: 8, task: 'Designed Redis distributed lock architecture' },
              { day: 'Tue', date: '2026-10-20', hours: 8, task: 'Built settlement event listener service' },
              { day: 'Wed', date: '2026-10-21', hours: 8, task: 'Integration testing with NPCI sandbox' },
              { day: 'Thu', date: '2026-10-22', hours: 8, task: 'Benchmarked transaction throughput (2.4k TPS)' },
              { day: 'Fri', date: '2026-10-23', hours: 8, task: 'Sprint review with VP Engineering and PR merge' },
              { day: 'Sat', date: '2026-10-24', hours: 0, task: 'Weekend off' },
              { day: 'Sun', date: '2026-10-25', hours: 0, task: 'Weekend off' }
            ],
            status: 'Submitted',
            submittedBy: 'candidate@nexatalent.com',
            createdAt: '2026-10-26T09:30:00.000Z'
          },
          {
            id: 'TSH-CAND-W42',
            contractorId: 'CTR-CAND-01',
            contractorName: 'Siddharth Nair',
            clientName: 'Fintech ScaleOps Technologies Ltd',
            clientTenant: 'TNT-9011',
            vendorTenant: 'TNT-VENDOR-05',
            period: '2026-10',
            weekLabel: 'Week 42 (Oct 12 – Oct 18, 2026)',
            hours: 42,
            hourlyRate: 2800,
            billableAmount: 117600,
            project: 'AWS ECS Cluster Autoscaling & Zero-Downtime Rollouts',
            notes: 'Deployed Terraform modules for multi-AZ ECS Fargate rollout.',
            dailyBreakdown: [
              { day: 'Mon', date: '2026-10-12', hours: 8, task: 'Provisioned staging VPC peering' },
              { day: 'Tue', date: '2026-10-13', hours: 9, task: 'Configured CloudWatch custom metrics alerts (1h OT)' },
              { day: 'Wed', date: '2026-10-14', hours: 8, task: 'Migrated API services to Docker multi-stage build' },
              { day: 'Thu', date: '2026-10-15', hours: 9, task: 'Chaos engineering drills on payment worker (1h OT)' },
              { day: 'Fri', date: '2026-10-16', hours: 8, task: 'Documentation and staging sign-off' },
              { day: 'Sat', date: '2026-10-17', hours: 0, task: 'Weekend off' },
              { day: 'Sun', date: '2026-10-18', hours: 0, task: 'Weekend off' }
            ],
            status: 'Approved',
            submittedBy: 'candidate@nexatalent.com',
            createdAt: '2026-10-19T09:00:00.000Z',
            reviewedBy: 'aditi@fintechscaleops.io',
            reviewedAt: '2026-10-20T11:15:00.000Z',
            reviewNote: 'Outstanding architectural execution and delivery ahead of schedule. Approved.'
          },
          {
            id: 'TSH-CAND-W41',
            contractorId: 'CTR-CAND-01',
            contractorName: 'Siddharth Nair',
            clientName: 'Fintech ScaleOps Technologies Ltd',
            clientTenant: 'TNT-9011',
            vendorTenant: 'TNT-VENDOR-05',
            period: '2026-10',
            weekLabel: 'Week 41 (Oct 05 – Oct 11, 2026)',
            hours: 40,
            hourlyRate: 2800,
            billableAmount: 112000,
            project: 'Auth0 to Self-Hosted Keycloak / OAuth2 Migration',
            notes: 'Completed token exchange protocol and user session migration.',
            status: 'Approved',
            submittedBy: 'candidate@nexatalent.com',
            createdAt: '2026-10-12T09:10:00.000Z',
            reviewedBy: 'aditi@fintechscaleops.io',
            reviewedAt: '2026-10-13T10:30:00.000Z',
            reviewNote: 'Verified against staging test reports. Fully approved.'
          },
          {
            id: 'TSH-CAND-SEP26',
            contractorId: 'CTR-CAND-01',
            contractorName: 'Siddharth Nair',
            clientName: 'Fintech ScaleOps Technologies Ltd',
            clientTenant: 'TNT-9011',
            vendorTenant: 'TNT-VENDOR-05',
            period: '2026-09',
            weekLabel: 'September 2026 Full Month Consolidated',
            hours: 160,
            hourlyRate: 2800,
            billableAmount: 448000,
            project: 'Fintech ScaleOps Platform Foundations',
            notes: 'Completed Q3 deliverables including payment gateway failover and observability telemetry.',
            status: 'Approved',
            submittedBy: 'candidate@nexatalent.com',
            createdAt: '2026-09-30T17:00:00.000Z',
            reviewedBy: 'aditi@fintechscaleops.io',
            reviewedAt: '2026-10-01T10:00:00.000Z',
            reviewNote: 'Month close approved and queued for payroll release.'
          }
        );
      }
      // Backfill complete candidate suite for candidate@nexatalent.com
      seedCandidateDemoSuite(db);
      persist();
      return db!;
    }
  } catch { /* fall through to seed */ }
  // P0-1: production defaults to EMPTY (no demo PII/superadmin). Seed only when
  // explicitly requested with DEMO_SEED=on (dev: DEMO_SEED unset still seeds).
  const isProd = (process.env.NODE_ENV || 'development') === 'production';
  const demoOff = process.env.DEMO_SEED === 'off' || (isProd && process.env.DEMO_SEED !== 'on');
  db = demoOff ? emptyDb() : seed();
  persist();
  return db!;
}

function seedCandidateDemoSuite(targetDb: any): void {
  if (!targetDb) return;
  const email = 'candidate@nexatalent.com';
  const userId = 'USR-106';

  // 1. User
  if (!Array.isArray(targetDb.users)) targetDb.users = [];
  let u = targetDb.users.find((x: any) => String(x.email || '').toLowerCase() === email);
  if (!u) {
    u = { id: userId, name: 'Siddharth Nair', fullName: 'Siddharth Nair', email, role: 'candidate', tenantId: 'TNT-CANDIDATE', status: 'Active', employeeId: '', department: '', designation: '', branch: '', lastLogin: new Date().toISOString(), emailVerified: true };
    targetDb.users.push(u);
  } else {
    u.name = 'Siddharth Nair';
    u.fullName = 'Siddharth Nair';
    u.emailVerified = true;
    u.status = 'Active';
  }

  // 1b. Credentials
  if (!Array.isArray(targetDb.credentials)) targetDb.credentials = [];
  const cred = targetDb.credentials.find((c: any) => String(c.email || '').toLowerCase() === email);
  const hash = '$2b$10$N/IhkmDbGF1/C3ZBfmbA2uxrI2xnOKGFe1cnruHkZbgtabdl6eO02'; // NexaTalent123
  if (!cred) {
    targetDb.credentials.push({ userId, email, passwordHash: hash, algo: 'bcrypt' });
  } else if (!cred.passwordHash) {
    cred.passwordHash = hash;
    cred.algo = 'bcrypt';
  }

  // 2. Candidate Profiles
  if (!Array.isArray(targetDb.candidateProfiles)) targetDb.candidateProfiles = [];
  let cp = targetDb.candidateProfiles.find((x: any) => String(x.email || '').toLowerCase() === email || x.userId === userId);
  if (!cp) {
    cp = { id: 'CND-CANDIDATE-01', email, userId };
    targetDb.candidateProfiles.unshift(cp);
  }
  cp.name = 'Siddharth Nair';
  cp.email = email;
  cp.phone = '+91 98450 12890';
  cp.headline = 'Lead Fullstack & Distributed Cloud Architect';
  cp.roleTitle = 'Lead Fullstack Cloud Engineer';
  cp.experienceYears = 8.5;
  cp.location = 'Bengaluru, Karnataka, India';
  cp.country = 'India';
  cp.contactPrefs = 'WhatsApp & Email';
  cp.summary = 'High-impact Lead Fullstack Engineer & Cloud Architect with 8+ years specializing in distributed Node.js/Go microservices, React 19 micro-frontends, AWS cloud native infrastructure, and high-throughput financial settlement engines. Proven track record scaling workloads to 4k+ TPS with 99.99% uptime and leading high-performing engineering squads.';
  cp.objectives = 'Seeking Principal / Lead Fullstack roles at high-growth tech platforms tackling complex distributed systems, event-driven ledger architectures, and next-generation cloud infrastructure.';
  cp.currentCtc = '₹34,00,000';
  cp.expectedCtc = '₹45,00,000';
  cp.currency = 'INR';
  cp.payPeriod = 'annual';
  cp.noticePeriod = '30 Days Notice';
  cp.availability = 'Immediate to 30 Days';
  cp.workArrangement = 'hybrid';
  cp.employmentTypes = 'Full-time, Contract to Hire';
  cp.skills = 'React 19, TypeScript, Node.js, Go, AWS ECS/Fargate, PostgreSQL, Redis, Kafka, Kubernetes, Docker, Terraform, GraphQL, System Design, CI/CD';
  cp.visibility = 'standard';
  cp.resumeRef = 'DOC-RESUME-01';
  cp.resumeVersion = 3;
  cp.resumeUploadedAt = '2026-10-25T10:00:00.000Z';
  cp.linkedin = 'https://linkedin.com/in/siddharth-nair-cloud';
  cp.github = 'https://github.com/siddharth-nair-dev';
  cp.portfolio = 'https://siddharthnair.dev';
  cp.codeSamples = 'https://github.com/siddharth-nair-dev/distributed-ledger-demo';
  cp.jobPreferences = {
    roles: 'Lead Fullstack Engineer, Distributed Systems Architect, Staff Backend Engineer',
    locations: 'Bengaluru (Bangalore), Hyderabad, Remote - India',
    employmentTypes: 'Full-time, Contract',
    workArrangement: 'hybrid',
    availability: '30 Days Notice'
  };
  cp.onboarding = {
    step: 9,
    completed: true,
    completedAt: '2026-10-18T07:07:29.000Z',
    updatedAt: new Date().toISOString()
  };
  cp.experiences = [
    {
      designation: 'Senior Staff Fullstack Architect',
      employer: 'Fintech ScaleOps Technologies Ltd',
      employmentType: 'Full-time Contract',
      startDate: 'Aug 2024',
      endDate: 'Present',
      current: true,
      location: 'Bengaluru / Hybrid',
      responsibilities: 'Architecting high-throughput neo-banking transaction settlement engine. Mentoring a squad of 12 full-stack engineers and owning AWS container infrastructure across multi-region deployments.',
      achievements: 'Engineered Redis distributed lock pipeline handling 2.4k TPS with sub-15ms latency; eliminated settlement race conditions with 100% financial idempotency.'
    },
    {
      designation: 'Lead Software Engineer',
      employer: 'Razorpay Financial Solutions',
      employmentType: 'Full-time',
      startDate: 'Mar 2021',
      endDate: 'Jul 2024',
      current: false,
      location: 'Bengaluru, India',
      responsibilities: 'Led core merchant checkout experience and recurring billing API microservices using React, Node.js, and PostgreSQL. Drove migration from monolith to Kubernetes microservices.',
      achievements: 'Decreased checkout load time by 42% (TTFB down to 180ms), processing over ₹1,200 Cr in monthly gross transaction volume.'
    },
    {
      designation: 'Senior Fullstack Developer',
      employer: 'Swiggy Core Logistics',
      employmentType: 'Full-time',
      startDate: 'Jun 2018',
      endDate: 'Feb 2021',
      current: false,
      location: 'Bengaluru, India',
      responsibilities: 'Built real-time order dispatch telemetry dashboards and rider assignment services with WebSockets, Go, and React.',
      achievements: 'Built geospatial rider clustering algorithm that reduced delivery transit times by 3.8 minutes on average during peak hours.'
    },
    {
      designation: 'Software Development Engineer',
      employer: 'Infosys Digital Labs',
      employmentType: 'Full-time',
      startDate: 'Jul 2016',
      endDate: 'May 2018',
      current: false,
      location: 'Pune, India',
      responsibilities: 'Developed enterprise web applications, REST APIs, and automated test pipelines for Fortune 500 banking clients.',
      achievements: 'Recognized with Spot Award for zero-defect delivery across 4 consecutive banking product quarterly releases.'
    }
  ];
  cp.educations = [
    {
      qualification: 'B.Tech in Computer Science & Engineering',
      institution: 'National Institute of Technology (NIT) Karnataka, Surathkal',
      specialization: 'Distributed Computing & Algorithms',
      startDate: '2012',
      endDate: '2016',
      gradYear: '2016',
      grade: '8.8 / 10 CGPA'
    },
    {
      qualification: 'Senior Secondary Certificate (Class XII - PCMB)',
      institution: 'Delhi Public School, Bangalore South',
      specialization: 'Physics, Chemistry, Mathematics, Computer Science',
      startDate: '2010',
      endDate: '2012',
      gradYear: '2012',
      grade: '96.2%'
    }
  ];
  cp.skillLevels = [
    { skill: 'React 19 & Next.js', level: 'Expert (8+ yrs)' },
    { skill: 'TypeScript & JavaScript', level: 'Expert (8+ yrs)' },
    { skill: 'Node.js & Express', level: 'Expert (8+ yrs)' },
    { skill: 'AWS Cloud & ECS/Fargate', level: 'Advanced (6+ yrs)' },
    { skill: 'PostgreSQL & Database Design', level: 'Advanced (7+ yrs)' },
    { skill: 'Redis & Caching Strategies', level: 'Advanced (6+ yrs)' },
    { skill: 'Kubernetes & Docker', level: 'Advanced (5+ yrs)' },
    { skill: 'Kafka & Event-Driven Systems', level: 'Intermediate (4+ yrs)' },
    { skill: 'Terraform & Infrastructure as Code', level: 'Intermediate (3+ yrs)' },
    { skill: 'Go (Golang)', level: 'Intermediate (3+ yrs)' }
  ];
  cp.certList = [
    {
      name: 'AWS Certified Solutions Architect – Professional (SAP-C02)',
      issuer: 'Amazon Web Services',
      year: '2024 – 2027',
      credentialId: 'AWS-PSA-9912041'
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      year: '2024 – 2027',
      credentialId: 'CKA-2400-8819'
    },
    {
      name: 'HashiCorp Certified: Terraform Associate',
      issuer: 'HashiCorp',
      year: '2023 – 2026',
      credentialId: 'HC-TA-1082'
    }
  ];
  cp.projectList = [
    {
      name: 'High-Throughput Neobank Settlement Engine',
      role: 'Lead Architect',
      description: 'Designed and deployed an event-driven ledger reconciliation engine handling 4,500 TPS with Redis distributed locking and Kafka audit logs.',
      stack: 'Node.js, TypeScript, Redis, Kafka, PostgreSQL, AWS ECS'
    },
    {
      name: 'Enterprise Micro-Frontend Application Suite',
      role: 'Principal Frontend Engineer',
      description: 'Built a modular micro-frontend architecture using Webpack 5 Module Federation and React 19, enabling 6 independent squads to deploy without monolithic coordination.',
      stack: 'React 19, TypeScript, Module Federation, Tailwind CSS, Vite'
    },
    {
      name: 'Zero-Trust API Gateway & OAuth2 Identity Broker',
      role: 'Cloud Security Lead',
      description: 'Constructed edge proxy with OAuth2/OIDC token exchange and JWT revocation caching, protecting over 40 internal microservices.',
      stack: 'Go, Envoy Proxy, Keycloak, Redis, Docker'
    }
  ];

  // 3. Applications
  if (!Array.isArray(targetDb.applications)) targetDb.applications = [];
  const hasCandApp = targetDb.applications.some((a: any) => String(a.candidateEmail || '').toLowerCase() === email);
  if (!hasCandApp) {
    targetDb.applications.unshift(
      {
        id: 'APP-MVSZJYENEFA4',
        jobId: 'JOB-MVSZJZML2746',
        jobTitle: 'Senior Full Stack Cloud Engineer (Fintech Operations)',
        companyName: 'Fintech ScaleOps',
        orgId: 'TNT-9011',
        candidateId: userId,
        candidateEmail: email,
        candidateName: 'Siddharth Nair',
        stage: 'Interview Scheduled',
        status: 'In Progress',
        matchScore: 94,
        matchReason: 'Exceptional match with React, Node.js, and AWS distributed banking experience.',
        currentSalary: 3400000,
        expectedSalary: 4500000,
        noticePeriod: '30 Days',
        resumeId: 'DOC-RESUME-01',
        appliedAt: '2026-10-15T09:30:00.000Z',
        createdAt: '2026-10-15T09:30:00.000Z',
        updatedAt: '2026-10-28T14:00:00.000Z'
      },
      {
        id: 'APP-CAND-02',
        jobId: 'JOB-MVSZJYBO1613',
        jobTitle: 'Senior DevOps & Cloud Infrastructure Architect',
        companyName: 'Fintech ScaleOps',
        orgId: 'TNT-9011',
        candidateId: userId,
        candidateEmail: email,
        candidateName: 'Siddharth Nair',
        stage: 'Offer',
        status: 'Offer Received',
        matchScore: 96,
        matchReason: 'Mastery in AWS ECS, Kubernetes, and automated zero-downtime deployments.',
        currentSalary: 3400000,
        expectedSalary: 4200000,
        noticePeriod: '30 Days',
        resumeId: 'DOC-RESUME-01',
        appliedAt: '2026-10-02T11:00:00.000Z',
        createdAt: '2026-10-02T11:00:00.000Z',
        updatedAt: '2026-10-27T16:30:00.000Z'
      },
      {
        id: 'APP-CAND-03',
        jobId: 'JOB-9901',
        jobTitle: 'Senior React / Node Fullstack Architect',
        companyName: 'Fintech ScaleOps Core',
        orgId: 'TNT-9011',
        candidateId: userId,
        candidateEmail: email,
        candidateName: 'Siddharth Nair',
        stage: 'Screening',
        status: 'Under Review',
        matchScore: 91,
        matchReason: 'Strong alignment on fullstack microservices and design systems.',
        currentSalary: 3400000,
        expectedSalary: 4400000,
        noticePeriod: '30 Days',
        resumeId: 'DOC-RESUME-01',
        appliedAt: '2026-10-22T08:15:00.000Z',
        createdAt: '2026-10-22T08:15:00.000Z',
        updatedAt: '2026-10-24T10:00:00.000Z'
      },
      {
        id: 'APP-CAND-04',
        jobId: 'JOB-8890',
        jobTitle: 'Senior AWS Cloud Security Lead',
        companyName: 'Fintech ScaleOps',
        orgId: 'TNT-9011',
        candidateId: userId,
        candidateEmail: email,
        candidateName: 'Siddharth Nair',
        stage: 'Hired',
        status: 'Closed Hired',
        matchScore: 98,
        matchReason: 'Full alignment on AWS Solutions Architect Professional and IAM security.',
        currentSalary: 3400000,
        expectedSalary: 4000000,
        noticePeriod: 'Immediate',
        resumeId: 'DOC-RESUME-01',
        appliedAt: '2026-09-05T10:00:00.000Z',
        createdAt: '2026-09-05T10:00:00.000Z',
        updatedAt: '2026-10-01T12:00:00.000Z'
      }
    );
  }

  // 3b. Stage History
  if (!Array.isArray(targetDb.stageHistory)) targetDb.stageHistory = [];
  const hasCandHist = targetDb.stageHistory.some((h: any) => h.applicationId === 'APP-CAND-02');
  if (!hasCandHist) {
    targetDb.stageHistory.unshift(
      {
        id: 'HIST-CAND-02-1',
        applicationId: 'APP-CAND-02',
        from: 'None',
        to: 'Applied',
        actor: 'candidate@nexatalent.com',
        actorName: 'Siddharth Nair',
        reason: 'Direct application submitted with Executive CV (v3)',
        createdAt: '2026-10-02T11:00:00.000Z'
      },
      {
        id: 'HIST-CAND-02-2',
        applicationId: 'APP-CAND-02',
        from: 'Applied',
        to: 'Screening',
        actor: 'kiran@nexatalent.com',
        actorName: 'Kiran Sharma (Talent Ops)',
        reason: 'Profile shortlisted: 8.5 Yrs exp in AWS ECS & Kubernetes exceeds job baseline',
        createdAt: '2026-10-08T14:30:00.000Z'
      },
      {
        id: 'HIST-CAND-02-3',
        applicationId: 'APP-CAND-02',
        from: 'Screening',
        to: 'Interview Scheduled',
        actor: 'aditi@fintechscaleops.io',
        actorName: 'Aditi Sharma (VP of Engineering)',
        reason: 'Round 1 Technical Screening completed with score 4.9/5',
        createdAt: '2026-10-18T10:00:00.000Z'
      },
      {
        id: 'HIST-CAND-02-4',
        applicationId: 'APP-CAND-02',
        from: 'Interview Scheduled',
        to: 'Offer',
        actor: 'aditi@fintechscaleops.io',
        actorName: 'Aditi Sharma (VP of Engineering)',
        reason: 'Executive hiring committee approval: Formal Offer extended at ₹42,00,000 CTC',
        createdAt: '2026-10-27T16:30:00.000Z'
      },
      {
        id: 'HIST-MVSZ-1',
        applicationId: 'APP-MVSZJYENEFA4',
        from: 'None',
        to: 'Applied',
        actor: 'candidate@nexatalent.com',
        actorName: 'Siddharth Nair',
        reason: 'Application submitted via NexaTalent Portal',
        createdAt: '2026-10-15T09:30:00.000Z'
      },
      {
        id: 'HIST-MVSZ-2',
        applicationId: 'APP-MVSZJYENEFA4',
        from: 'Applied',
        to: 'Screening',
        actor: 'aditi@fintechscaleops.io',
        actorName: 'Aditi Sharma',
        reason: 'Screening passed: Redis concurrency & high-throughput banking experience verified',
        createdAt: '2026-10-20T11:00:00.000Z'
      },
      {
        id: 'HIST-MVSZ-3',
        applicationId: 'APP-MVSZJYENEFA4',
        from: 'Screening',
        to: 'Interview Scheduled',
        actor: 'aditi@fintechscaleops.io',
        actorName: 'Aditi Sharma',
        reason: 'Round 2 Technical Deep Dive scheduled with VP of Engineering for Oct 30, 2026 at 2:30 PM',
        createdAt: '2026-10-26T12:00:00.000Z'
      }
    );
  }

  // 3c. Ensure all jobs have createdAt and expiryDate
  if (Array.isArray(targetDb.jobs)) {
    for (const j of targetDb.jobs) {
      if (!j.createdAt) j.createdAt = '2026-10-20T10:00:00.000Z';
      if (!j.expiryDate) j.expiryDate = '2026-11-20T23:59:59.000Z';
      if (!j.companyName) j.companyName = 'Fintech ScaleOps';
    }
  }

  // 4. Interviews
  if (!Array.isArray(targetDb.interviews)) targetDb.interviews = [];
  const hasCandInt = targetDb.interviews.some((i: any) => String(i.candidateEmail || '').toLowerCase() === email);
  if (!hasCandInt) {
    targetDb.interviews.unshift(
      {
        id: 'INT-CAND-01',
        applicationId: 'APP-MVSZJYENEFA4',
        jobId: 'JOB-MVSZJZML2746',
        round: 'Technical Architecture & System Design',
        roundName: 'Round 2: Technical Deep Dive',
        scheduledAt: '2026-10-30T14:30:00.000Z',
        timezone: 'Asia/Kolkata',
        mode: 'video',
        meetingLink: 'https://meet.google.com/nex-atal-ent',
        venue: 'Google Meet (Virtual)',
        instructions: 'Please be prepared to walk through your previous distributed transaction architecture, Redis concurrency locks, and high-availability database replication design.',
        status: 'Scheduled',
        confirmationStatus: 'Confirmed',
        candidateEmail: email,
        candidateName: 'Siddharth Nair',
        jobTitle: 'Senior Full Stack Cloud Engineer (Fintech Operations)',
        companyName: 'Fintech ScaleOps',
        interviewerName: 'Aditi Sharma (VP of Engineering)',
        createdAt: '2026-10-26T12:00:00.000Z'
      },
      {
        id: 'INT-CAND-02',
        applicationId: 'APP-MVSZJYENEFA4',
        jobId: 'JOB-MVSZJZML2746',
        round: 'Engineering Leadership & Culture Alignment',
        roundName: 'Round 3: Executive Culture Fit',
        scheduledAt: '2026-11-03T11:00:00.000Z',
        timezone: 'Asia/Kolkata',
        mode: 'video',
        meetingLink: 'https://meet.google.com/nex-lead-fit',
        venue: 'Google Meet (Virtual)',
        instructions: 'Conversational discussion covering squad leadership philosophy, cross-functional stakeholder management, and product roadmap prioritization.',
        status: 'Scheduled',
        confirmationStatus: 'Pending',
        candidateEmail: email,
        candidateName: 'Siddharth Nair',
        jobTitle: 'Senior Full Stack Cloud Engineer (Fintech Operations)',
        companyName: 'Fintech ScaleOps',
        interviewerName: 'Rohan Deshmukh (Head of Product)',
        createdAt: '2026-10-27T15:00:00.000Z'
      },
      {
        id: 'INT-CAND-03',
        applicationId: 'APP-CAND-02',
        jobId: 'JOB-MVSZJYBO1613',
        round: 'Screening & Cloud Architecture Assessment',
        roundName: 'Round 1: Technical Screening',
        scheduledAt: '2026-10-18T10:00:00.000Z',
        timezone: 'Asia/Kolkata',
        mode: 'video',
        meetingLink: 'https://meet.google.com/nex-arch-done',
        status: 'Completed',
        confirmationStatus: 'Confirmed',
        candidateEmail: email,
        candidateName: 'Siddharth Nair',
        jobTitle: 'Senior DevOps & Cloud Infrastructure Architect',
        companyName: 'Fintech ScaleOps',
        feedbackScore: 4.9,
        createdAt: '2026-10-14T09:00:00.000Z'
      }
    );
  }

  // 5. Saved Jobs
  if (!Array.isArray(targetDb.savedJobs)) targetDb.savedJobs = [];
  const hasCandSaved = targetDb.savedJobs.some((s: any) => String(s.candidateEmail || '').toLowerCase() === email);
  if (!hasCandSaved) {
    targetDb.savedJobs.unshift(
      { id: 'SAVE-CAND-01', key: `JOB-MVSZJZML2746::${email}`, jobId: 'JOB-MVSZJZML2746', candidateEmail: email, userId, createdAt: '2026-10-20T10:00:00.000Z' },
      { id: 'SAVE-CAND-02', key: `JOB-MVSZJYBO1613::${email}`, jobId: 'JOB-MVSZJYBO1613', candidateEmail: email, userId, createdAt: '2026-10-21T11:30:00.000Z' },
      { id: 'SAVE-CAND-03', key: `JOB-9901::${email}`, jobId: 'JOB-9901', candidateEmail: email, userId, createdAt: '2026-10-23T14:15:00.000Z' },
      { id: 'SAVE-CAND-04', key: `JOB-8890::${email}`, jobId: 'JOB-8890', candidateEmail: email, userId, createdAt: '2026-10-25T09:45:00.000Z' }
    );
  }

  // 6. Offers
  if (!Array.isArray(targetDb.offers)) targetDb.offers = [];
  const hasCandOffer = targetDb.offers.some((o: any) => String(o.candidateEmail || '').toLowerCase() === email);
  if (!hasCandOffer) {
    targetDb.offers.unshift({
      id: 'OFF-CAND-2026',
      applicationId: 'APP-CAND-02',
      jobId: 'JOB-MVSZJYBO1613',
      orgId: 'TNT-9011',
      candidateEmail: email,
      ctc: 4200000,
      fixedPay: 3600000,
      variableBonus: 600000,
      currency: 'INR',
      payPeriod: 'annual',
      joinDate: '2026-12-01',
      status: 'Extended',
      offerLetterMode: 'uploaded',
      offerLetterRef: 'DOC-OFFER-CAND-01',
      benefits: 'Comprehensive health coverage (₹15 Lakhs family floater), annual training budget (₹1.5 Lakhs), premium ergonomic remote allowance (₹75k), annual performance equity grants (RSUs).',
      notes: 'We were blown away by your architectural depth and leadership during the panel discussions. Welcome to Fintech ScaleOps!',
      expiryDate: '2026-11-15T23:59:59.000Z',
      createdAt: '2026-10-27T16:30:00.000Z'
    });
  }

  // 7. Documents
  if (!Array.isArray(targetDb.documents)) targetDb.documents = [];
  const hasCandDocs = targetDb.documents.some((d: any) => String(d.ownerEmail || '').toLowerCase() === email && d.id === 'DOC-RESUME-01');
  if (!hasCandDocs) {
    targetDb.documents.unshift(
      { id: 'DOC-RESUME-01', name: 'Siddharth_Nair_Executive_CV_2026.pdf', mime: 'application/pdf', size: 64280, version: 3, kind: 'resume', ownerEmail: email, candidateEmail: email, orgId: 'TNT-CANDIDATE', uploadedAt: '2026-10-25T10:00:00.000Z', uploadedBy: email, status: 'Verified', verifiedAt: '2026-10-25T11:00:00.000Z' },
      { id: 'DOC-WORD-RESUME-01', name: 'Siddharth_Nair_Detailed_Architecture_Profile.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 78500, version: 2, kind: 'resume', ownerEmail: email, candidateEmail: email, orgId: 'TNT-CANDIDATE', uploadedAt: '2026-10-26T14:20:00.000Z', uploadedBy: email, status: 'Verified' },
      { id: 'DOC-OFFER-CAND-01', name: 'Formal_Appointment_Letter_FintechScaleOps_42LPA.pdf', mime: 'application/pdf', size: 142800, version: 1, kind: 'offer_letter', ownerEmail: email, candidateEmail: email, orgId: 'TNT-9011', uploadedAt: '2026-10-27T16:30:00.000Z', uploadedBy: 'aditi@fintechscaleops.io', status: 'Signed & Executed' },
      { id: 'DOC-NDA-01', name: 'Client_Confidentiality_NDA_FintechScaleOps.pdf', mime: 'application/pdf', size: 88400, version: 1, kind: 'compliance', ownerEmail: email, candidateEmail: email, orgId: 'TNT-9011', uploadedAt: '2026-10-20T12:00:00.000Z', uploadedBy: email, status: 'Verified' },
      { id: 'DOC-ID-01', name: 'Government_KYC_Proof_Aadhaar_PAN.pdf', mime: 'application/pdf', size: 45200, version: 1, kind: 'kyc', ownerEmail: email, candidateEmail: email, orgId: 'TNT-CANDIDATE', uploadedAt: '2026-10-18T07:10:00.000Z', uploadedBy: email, status: 'Verified' },
      { id: 'DOC-EXP-01', name: 'Service_Relieving_Letter_Razorpay.pdf', mime: 'application/pdf', size: 110500, version: 1, kind: 'experience_letter', ownerEmail: email, candidateEmail: email, orgId: 'TNT-CANDIDATE', uploadedAt: '2026-10-18T07:12:00.000Z', uploadedBy: email, status: 'Verified' },
      { id: 'DOC-DEGREE-01', name: 'BTech_Degree_Certificate_NITK_Surathkal.pdf', mime: 'application/pdf', size: 180200, version: 1, kind: 'education_certificate', ownerEmail: email, candidateEmail: email, orgId: 'TNT-CANDIDATE', uploadedAt: '2026-10-18T07:15:00.000Z', uploadedBy: email, status: 'Verified' }
    );
  }

  // 8. Conversations & Messages
  if (!Array.isArray(targetDb.conversations)) targetDb.conversations = [];
  if (!Array.isArray(targetDb.messages)) targetDb.messages = [];
  const hasCandConv = targetDb.conversations.some((c: any) => c.candidateEmail === email || c.candidateId === email);
  if (!hasCandConv) {
    targetDb.conversations.unshift(
      {
        id: 'CNV-CAND-01',
        applicationId: 'APP-MVSZJYENEFA4',
        candidateId: email,
        candidateEmail: email,
        companyId: 'TNT-9011',
        participantEmails: [email, 'aditi@fintechscaleops.io'],
        title: 'Fintech ScaleOps – Technical Architecture Discussion',
        jobTitle: 'Senior Full Stack Cloud Engineer',
        lastMessage: 'Looking forward to our technical deep dive session tomorrow at 2:30 PM!',
        lastMessageAt: '2026-10-28T16:00:00.000Z',
        createdAt: '2026-10-26T10:00:00.000Z'
      },
      {
        id: 'CNV-CAND-02',
        applicationId: 'APP-CAND-02',
        candidateId: email,
        candidateEmail: email,
        companyId: 'TNT-9011',
        participantEmails: [email, 'vikram@apextechsearch.com'],
        title: 'Apex Tech Search – Offer Letter & ESOP Breakdown',
        jobTitle: 'Senior DevOps & Cloud Infrastructure Architect',
        lastMessage: 'I have attached the formal appointment letter with ₹42 LPA total CTC. Please review!',
        lastMessageAt: '2026-10-27T17:15:00.000Z',
        createdAt: '2026-10-25T11:00:00.000Z'
      }
    );
    targetDb.messages.unshift(
      { id: 'MSG-CAND-101', conversationId: 'CNV-CAND-01', sender: 'aditi@fintechscaleops.io', senderName: 'Aditi Sharma', body: 'Hi Siddharth, congratulations on clearing the first round! We were very impressed by your Redis concurrency examples.', createdAt: '2026-10-26T10:15:00.000Z' },
      { id: 'MSG-CAND-102', conversationId: 'CNV-CAND-01', sender: email, senderName: 'Siddharth Nair', body: 'Thank you Aditi! I really enjoyed discussing the distributed idempotency challenges.', createdAt: '2026-10-26T10:30:00.000Z' },
      { id: 'MSG-CAND-103', conversationId: 'CNV-CAND-01', sender: 'aditi@fintechscaleops.io', senderName: 'Aditi Sharma', body: 'I have scheduled our Round 2 Architecture Deep Dive for tomorrow at 2:30 PM via Google Meet.', createdAt: '2026-10-28T15:45:00.000Z' },
      { id: 'MSG-CAND-104', conversationId: 'CNV-CAND-01', sender: email, senderName: 'Siddharth Nair', body: 'Looking forward to our technical deep dive session tomorrow at 2:30 PM!', createdAt: '2026-10-28T16:00:00.000Z' },
      { id: 'MSG-CAND-201', conversationId: 'CNV-CAND-02', sender: 'vikram@apextechsearch.com', senderName: 'Vikram Malhotra', body: 'Hello Siddharth, great news! The executive committee has formally approved your offer for the Senior DevOps & Cloud role.', createdAt: '2026-10-27T16:45:00.000Z' },
      { id: 'MSG-CAND-202', conversationId: 'CNV-CAND-02', sender: 'vikram@apextechsearch.com', senderName: 'Vikram Malhotra', body: 'I have attached the formal appointment letter with ₹42 LPA total CTC. Please review!', createdAt: '2026-10-27T17:15:00.000Z' }
    );
  }

  // 9. Notifications
  if (!Array.isArray(targetDb.notifications)) targetDb.notifications = [];
  const hasCandNotifs = targetDb.notifications.some((n: any) => n.recipient === email && n.id.startsWith('NOTIF-CAND-'));
  if (!hasCandNotifs) {
    targetDb.notifications.unshift(
      { id: 'NOTIF-CAND-01', recipient: email, kind: 'offer', body: '🎉 Formal Offer Extended: Fintech ScaleOps extended an offer of ₹42,00,000 / year for Senior DevOps & Cloud Infrastructure Architect.', channel: 'in-app', status: 'queued', createdAt: '2026-10-27T16:30:00.000Z', tenantId: 'TNT-9011' },
      { id: 'NOTIF-CAND-02', recipient: email, kind: 'interview', body: '📅 Interview Scheduled: Round 2 Technical Architecture Deep Dive with Aditi Sharma on Oct 30, 2026 at 2:30 PM.', channel: 'in-app', status: 'queued', createdAt: '2026-10-26T12:00:00.000Z', tenantId: 'TNT-9011' },
      { id: 'NOTIF-CAND-03', recipient: email, kind: 'timesheet', body: '✅ Timesheet Approved: Week 42 (42 hours, ₹1,17,600) was approved by Aditi Sharma.', channel: 'in-app', status: 'queued', createdAt: '2026-10-20T11:15:00.000Z', tenantId: 'TNT-9011' },
      { id: 'NOTIF-CAND-04', recipient: email, kind: 'application', body: '🚀 Application Update: Your application for Senior Full Stack Cloud Engineer moved to Interview Scheduled.', channel: 'in-app', status: 'queued', createdAt: '2026-10-18T14:00:00.000Z', tenantId: 'TNT-9011' }
    );
  }

  // 10. Consents
  if (!Array.isArray(targetDb.consents)) targetDb.consents = [];
  const hasCandConsents = targetDb.consents.some((c: any) => c.email === email);
  if (!hasCandConsents) {
    targetDb.consents.unshift({
      id: 'CNS-CAND-01',
      email,
      dataProcessing: true,
      jobAlerts: true,
      marketingEmails: false,
      profileSharing: true,
      backgroundVerificationConsent: true,
      signedAt: '2026-10-18T07:07:29.000Z',
      updatedAt: new Date().toISOString()
    });
  }
}

export function persist(): void {
  try {
    if (!db) return;
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    // P2-9: atomic write (tmp + rename) so concurrent/crash never leaves half JSON.
    const tmp = `${DB_FILE}.tmp-${process.pid}`;
    writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
    renameSync(tmp, DB_FILE);
  } catch { /* never crash on persist */ }
}

export function collection<T = any>(name: keyof DbShape): T[] {
  const d = loadDb();
  const c: any = (d as any)[name];
  if (Array.isArray(c)) return c as T[];
  return [];
}

export function uid(prefix: string): string {
  // P2-9: crypto-random suffix (was Math.random predictable).
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`;
}

/** Phase B: bounded history — per-record timelines keep the newest 200 entries. */
export function pushHistory(arr: any[], entry: any, cap = 200): any[] {
  arr.unshift(entry);
  if (arr.length > cap) arr.length = cap;
  return arr;
}

export function nowIso(): string { return new Date().toISOString(); }

const SENSITIVE_KEYS = ['password', 'passwd', 'secret', 'token', 'apikey', 'api_key', 'authorization'];
function scrubSecrets(value: any): any {
  if (Array.isArray(value)) return value.map(scrubSecrets);
  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SENSITIVE_KEYS.some((s) => k.toLowerCase().includes(s)) ? '[redacted]' : scrubSecrets(v);
    }
    return out;
  }
  return value;
}
export function audit(actor: string, action: string, tenantId: string, resource = '-', recordId = '-', ip = '127.0.0.1', meta: any = {}): void {
  const d = loadDb();
  d.auditLogs.unshift({ id: uid('AUD'), timestamp: nowIso(), actor, action, resource, recordId, tenantId, ipAddress: ip, ...scrubSecrets(meta) });
  if (d.auditLogs.length > 5000) d.auditLogs.length = 5000;
  persist();
}
