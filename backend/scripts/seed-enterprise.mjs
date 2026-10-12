// Enterprise mega-seed v2: WIPE + FRESH, 50 companies, every tab loaded.
// - 50 companies: 38 verified Approved (76%), 5 Pending, 3 Invited, 2 Rejected, 2 Suspended
// - Full §6.4 profile fields (GSTIN, reg no, addresses, contacts, sales owner...)
// - 35 direct-hire + 15 contract companies (CMP36-50): contract chain
//   company -> NexaTalent -> candidate (contractors, timesheets, staffing invoices, contractor payouts)
// - Exact commercials: Junior 8.33 / Mid 8.33-10 / Senior 10-12 / Leadership 12-15 / Bulk negotiated,
//   30-day payment from joining, 18% GST extra, 90-day replacement, 90-day ownership
// - Per-company audit logs (Activity + Audit Log tabs), sales world, engagement world
// Usage: node scripts/seed-enterprise.mjs  (run from backend/)
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(here, '..', 'data');
const DB_FILE = join(DATA_DIR, 'nexatalent.db.json');

const NUM_COMPANIES = 50;
const JOBS_PER_COMPANY = 20;
const APPS_PER_JOB = 50;
const NUM_CANDIDATES = 2500;
const SEED_PASSWORD = 'NexaTalent123';
const CONTRACT_FROM = 36; // CMP36-50 are contract-staffing companies

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261011);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pad2 = (n) => String(n).padStart(2, '0');
const pad4 = (n) => String(n).padStart(4, '0');

const now = new Date().toISOString();
const NOW_MS = new Date('2026-10-11T00:00:00.000Z').getTime();
const addDays = (iso, d) => new Date(new Date(iso).getTime() + d * 864e5).toISOString();

console.log('Reading current DB for reference collections...');
const current = JSON.parse(readFileSync(DB_FILE, 'utf8'));
const skillsRef = current.skills?.length ? current.skills : [{ id: 'SKL-100', name: 'React', category: 'Technology' }];
const rolesRef = current.roles?.length ? current.roles : [{ id: 'superadmin', name: 'superadmin', scope: 'platform', system: true, createdAt: now }];
const agreementTemplatesRef = current.agreementTemplates?.length ? current.agreementTemplates : [];
// Exact commercial fee table (spec: Standard Placement Terms)
const feeSlabsExact = [
  { hiringType: 'Junior IT roles', rateMin: 8.33, rateMax: 8.33, note: '8.33% of annual CTC', updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Mid-level IT roles', rateMin: 8.33, rateMax: 10, note: '8.33%–10% of annual CTC', updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Senior / niche technology roles', rateMin: 10, rateMax: 12, note: '10%–12% of annual CTC', updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Leadership / executive search', rateMin: 12, rateMax: 15, note: '12%–15% or a negotiated retained fee', retainedAllowed: true, updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Bulk hiring', rateMin: 0, rateMax: 0, note: 'Negotiated rate based on volume', negotiated: true, updatedAt: now, updatedBy: 'seed' },
];
const settingsRef = { ...(current.settings || { jwtAccessTokenTtl: '15m', jwtRefreshTokenTtl: '7d' }), payrollRules: { standardHours: 160, overtimeMultiplier: 1.5, payoutPercent: 82, taxRate: 18 } };
const OWNERSHIP = 'Candidate ownership rests with the introducing party for 90 days from submission; the client hires only introduced candidates through the platform.';
const DUPLICATES = 'Duplicate profiles are rejected; the earliest valid submission owns the candidate.';
const CANCELLATION = 'Either party may cancel with written notice; fees already triggered remain payable.';
const REPLACEMENT = (d) => `Free replacement within ${d} days of joining under the defined conditions.`;

const bak = join(DATA_DIR, `nexatalent.db.json.bak-${Date.now()}`);
copyFileSync(DB_FILE, bak);
console.log('Backup written:', bak);

console.log('Hashing seed password once (reused for all users)...');
const pwHash = await bcrypt.hash(SEED_PASSWORD, 10);

const firstNames = ['Aarav','Ananya','Arjun','Diya','Ishaan','Kavya','Krishna','Meera','Nikhil','Priya','Rahul','Riya','Rohan','Sanya','Siddharth','Sneha','Varun','Vikram','Aditi','Kiran','Pooja','Rajesh','Neha','Amit','Farhan','Zoya','Imran','Divya','Karthik','Lakshmi','Manish','Naina','Om','Pavan','Ritu','Sahil','Tanvi','Uday','Yash','Shreya','Abhishek','Deepak','Gauri','Harish','Jyoti','Kunal','Mohan','Nandini','Pranav','Radhika'];
const lastNames = ['Sharma','Verma','Iyer','Nair','Gupta','Mehta','Reddy','Khan','Patel','Singh','Das','Kulkarni','Joshi','Chopra','Agarwal','Bose','Chauhan','Desai','Eswaran','Fernandez','Ghosh','Hegde','Jain','Kaur','Lal','Menon','Nambiar','Oberoi','Pillai','Rao','Saxena','Trivedi','Upadhyay','Vyas','Yadav','Zaidi','Mishra','Pande','Rathi','Sethi'];
const cities = ['Bengaluru, Karnataka','Hyderabad, Telangana','Mumbai, Maharashtra','Chennai, Tamil Nadu','Pune, Maharashtra','Delhi NCR','Kolkata, West Bengal','Ahmedabad, Gujarat','Remote - India','Jaipur, Rajasthan'];
const industries = ['SaaS','Fintech','HealthTech','E-commerce','EdTech','Logistics','Cybersecurity','Cloud Infrastructure','AI/ML','Digital Banking'];
const coPrefixes = ['Tech','Cloud','Data','Fin','Health','Edu','Logi','Cyber','Agro','Retail','Pay','Soft','Info','Neo','Hyper','Quantum','Bright','Swift','Prime','Apex'];
const coSuffixes = ['Stack','Scale','Labs','Systems','Works','Hub','Forge','Nest','Verse','Grid','Line','Point','Soft','Ware','lytics','genics','wise','craft','mind','byte'];
const jobRoles = [
  ['Senior React Frontend Engineer','Frontend','React'], ['Node.js Backend Engineer','Backend','Node.js'],
  ['Fullstack Engineer (MERN)','Engineering','MongoDB'], ['DevOps Engineer (AWS/K8s)','Cloud & DevOps','AWS'],
  ['Data Engineer (Spark/SQL)','Data & AI','SQL'], ['ML Engineer (LLM/NLP)','Data & AI','Machine Learning'],
  ['QA Automation Engineer','Engineering','QA Automation'], ['Mobile Engineer (Flutter)','Engineering','Flutter'],
  ['Cloud Security Architect','Cloud & DevOps','Cloud Security'], ['Java Microservices Engineer','Engineering','Java'],
  ['Python Django Developer','Engineering','Django'], ['Go Backend Engineer','Engineering','Go'],
  ['UI/UX Designer','Design','UI Design'], ['Product Manager','Product','Agile'],
  ['Site Reliability Engineer','Cloud & DevOps','Site Reliability Engineering'], ['Data Analyst (Power BI)','Data & AI','Power BI'],
  ['Cybersecurity Analyst','Security','Cybersecurity'], ['Support Engineer (SaaS)','Support','Technical Support'],
  ['B2B Sales Executive','Sales','B2B Sales'], ['Talent Acquisition Specialist','HR','Talent Acquisition'],
];
const stagesPerJob = [
  ...Array(10).fill('Applied'),
  ...Array(4).fill('Screening'), ...Array(4).fill('Under Review'), ...Array(7).fill('Shortlisted'),
  ...Array(6).fill('Interview Scheduled'), ...Array(4).fill('Interview Completed'),
  ...Array(5).fill('Offer'), ...Array(3).fill('Hired'),
  ...Array(5).fill('Rejected'), ...Array(2).fill('Withdrawn'),
];
// hiringType rotation per job -> exact slab rates
const hiringPlan = [
  ['Junior IT roles', 8.33], ['Mid-level IT roles', 9], ['Mid-level IT roles', 10],
  ['Senior / niche technology roles', 11], ['Senior / niche technology roles', 12],
  ['Leadership / executive search', 13], ['Bulk hiring', 6],
];
// verification mix: 38 Approved + 5 Pending + 3 Invited + 2 Rejected + 2 Suspended
const verifFor = (c) => {
  if (c <= 38) return { verificationStatus: 'Approved', accountStatus: 'Active', status: 'Active', verified: true };
  if (c <= 43) return { verificationStatus: 'Pending', accountStatus: 'Verification Pending', status: 'Active', verified: false };
  if (c <= 46) return { verificationStatus: 'Pending', accountStatus: 'Invited', status: 'Invited', verified: false };
  if (c <= 48) return { verificationStatus: 'Rejected', accountStatus: 'Rejected', status: 'Inactive', verified: false };
  return { verificationStatus: 'Approved', accountStatus: 'Suspended', status: 'Suspended', verified: true };
};

const db = {
  users: [], roles: rolesRef, permissions: current.permissions?.length ? current.permissions : [],
  userRoles: [], organizations: [], companyProfiles: [], agencyProfiles: [],
  branches: [], memberships: [], verifications: [],
  candidateProfiles: [], experiences: [], educations: [],
  skills: skillsRef, candidateSkills: [], certifications: [],
  documents: [], consents: [],
  requisitions: [], jobs: [], jobSkills: [], jobAssignments: [],
  applications: [], stageHistory: [],
  interviews: [], feedback: [],
  conversations: [], messages: [],
  talentPools: [], talentPoolMembers: [], savedJobs: [],
  offers: [], placements: [],
  plans: [], planVersions: [], entitlements: [],
  subscriptions: [], subscriptionChanges: [], usageLedger: [],
  invoices: [], invoiceLines: [], payments: [], allocations: [],
  refunds: [], creditNotes: [],
  commissionAgreements: [], commissions: [], commissionAdjustments: [],
  feeSlabs: feeSlabsExact, agreementTemplates: agreementTemplatesRef, invoiceReminders: [],
  payouts: [], reconciliations: [], payrollRuns: [],
  leads: [], leadActivities: [], opportunities: [], targets: [],
  tasks: [], proposals: [], meetings: [], timesheets: [], submissions: [],
  notifications: [], notificationPrefs: [], mailOutbox: [],
  campaigns: [], campaignRecipients: [], campaignEvents: [],
  assignments: [], outbox: [], idempotency: [],
  supportTickets: [], candidateInfoRequests: [], privacyRequests: [],
  auditLogs: [], sessions: [], passwordResets: [], settings: settingsRef,
  jobsLegacy: [], candidatesLegacy: [], tenantsLegacy: [],
  contractors: [], compliance: [], credentials: [],
};

db.plans = [
  { id: 'PLAN-GROWTH', name: 'Growth', target: 'company', interval: 'monthly', price: 14999, currency: 'INR', status: 'Active', version: 1, entitlements: { 'jobs.create': true, 'jobs.active_limit': 25, 'candidates.search': true }, createdAt: now },
  { id: 'PLAN-ENTERPRISE', name: 'Enterprise Custom', target: 'company', interval: 'monthly', price: 49999, currency: 'INR', status: 'Active', version: 1, entitlements: { 'jobs.create': true, 'jobs.active_limit': 100, 'candidates.search': true, 'analytics.advanced': true }, createdAt: now },
];

db.organizations.push({ id: 'TNT-GLOBAL', legalName: 'NexaTalent Platform', displayName: 'NexaTalent', plan: 'Platform', seats: '-', status: 'Active', verificationStatus: 'Approved', accountStatus: 'Active', createdDate: '2021-01-01' });
db.users.push({ id: 'USR-101', name: 'Super Admin', email: 'superadmin@nexatalent.com', role: 'superadmin', tenantId: 'TNT-GLOBAL', status: 'Active', employeeId: 'NT-001', department: 'Platform', designation: 'Super Admin', branch: 'HQ', lastLogin: now });
db.credentials.push({ userId: 'USR-101', email: 'superadmin@nexatalent.com', passwordHash: pwHash, algo: 'bcrypt' });

const internalTeam = [
  ['operations@nexatalent.com', 'internal_recruiter', 'Ops Recruiter Lead'],
  ['recruiter2@nexatalent.com', 'internal_recruiter', 'Ops Recruiter'],
  ['bda1@nexatalent.com', 'bda', 'BDA North'], ['bda2@nexatalent.com', 'bda', 'BDA South'],
  ['finance@nexatalent.com', 'finance_admin', 'Finance Admin'],
];
internalTeam.forEach(([email, role, name], i) => {
  const id = `USR-NT-${pad2(i + 1)}`;
  db.users.push({ id, name, email, role, tenantId: 'TNT-GLOBAL', status: 'Active', lastLogin: now });
  db.credentials.push({ userId: id, email: email.toLowerCase(), passwordHash: pwHash, algo: 'bcrypt' });
});

// ---------- 5 recruitment agencies — full clean profiles (no dashes) ----------
// Realistic Indian agency identities: CIN, GSTIN, PAN, address, website, phones.
const agencySeed = [
  { n: 1, legal: 'TalentBridge Staffing Solutions Pvt Ltd', display: 'Agency Partner 1 · TalentBridge', owner: 'Rohit Iyer', email: 'agency1@nexatalent.demo', phone: '+91-80-41120011', city: 'Bengaluru, Karnataka', addr: '4th Floor, Prestige Towers, Residency Rd, Bengaluru 560025', web: 'https://talentbridge.example.com', cin: 'CIN-U74999KA2019PTC121101', gstin: '29AABCT1011A1Z5', pan: 'PAN-AABCT1011F', spec: 'Engineering, Product', loc: 'Bengaluru, Mumbai', model: 'percentage', mgr: 'operations@nexatalent.com' },
  { n: 2, legal: 'HireNest Consulting Pvt Ltd', display: 'Agency Partner 2 · HireNest', owner: 'Sneha Kulkarni', email: 'agency2@nexatalent.demo', phone: '+91-80-41120022', city: 'Mumbai, Maharashtra', addr: 'Level 8, Trade Center, BKC, Mumbai 400051', web: 'https://hirenest.example.com', cin: 'CIN-U74999MH2020PTC122102', gstin: '27AABCH1022B1Z5', pan: 'PAN-AABCH1022G', spec: 'Engineering, Product, Design', loc: 'Bengaluru, Mumbai, Pune', model: 'percentage', mgr: 'operations@nexatalent.com' },
  { n: 3, legal: 'SkillKart Talent Partners Pvt Ltd', display: 'Agency Partner 3 · SkillKart', owner: 'Arjun Menon', email: 'agency3@nexatalent.demo', phone: '+91-80-41120033', city: 'Hyderabad, Telangana', addr: 'Plot 12, Financial District, Hyderabad 500032', web: 'https://skillkart.example.com', cin: 'CIN-U74999TG2021PTC123103', gstin: '36AABCS1033C1Z5', pan: 'PAN-AABCS1033H', spec: 'Engineering, Data & AI', loc: 'Hyderabad, Bengaluru, Remote - India', model: 'percentage', mgr: 'bda1@nexatalent.com' },
  { n: 4, legal: 'PeopleFirst Search Pvt Ltd', display: 'Agency Partner 4 · PeopleFirst', owner: 'Divya Nair', email: 'agency4@nexatalent.demo', phone: '+91-80-41120044', city: 'Chennai, Tamil Nadu', addr: '2nd Floor, Guindy Industrial Estate, Chennai 600032', web: 'https://peoplefirst.example.com', cin: 'CIN-U74999TN2018PTC124104', gstin: '33AABCP1044D1Z5', pan: 'PAN-AABCP1044J', spec: 'Product, Sales, HR', loc: 'Chennai, Bengaluru', model: 'fixed', mgr: 'bda2@nexatalent.com' },
  { n: 5, legal: 'TechHire India Pvt Ltd', display: 'Agency Partner 5 · TechHire', owner: 'Karan Shah', email: 'agency5@nexatalent.demo', phone: '+91-80-41120055', city: 'Pune, Maharashtra', addr: 'Tower B, Hinjewadi Phase 2, Pune 411057', web: 'https://techhire.example.com', cin: 'CIN-U74999MH2019PTC125105', gstin: '27AABCT1055E1Z5', pan: 'PAN-AABCT1055K', spec: 'Cloud & DevOps, Security', loc: 'Pune, Remote - India', model: 'percentage', mgr: 'operations@nexatalent.com' },
];
for (const ag of agencySeed) {
  const a = ag.n;
  const tenant = `TNT-AGENCY-${pad2(a)}`;
  const agencyId = `AGC-${100 + a}`;
  db.agencyProfiles.push({
    id: agencyId, legalName: ag.legal, displayName: ag.display,
    type: 'Recruitment Agency', entityType: 'Private Limited',
    specialties: ag.spec, locations: ag.loc,
    status: 'Verified Partner', verificationStatus: 'Approved', accountStatus: 'Active',
    tenantId: tenant,
    contactName: ag.owner, contactEmail: ag.email, contactPhone: ag.phone,
    country: 'India', registrationNumber: ag.cin, taxIds: `${ag.gstin} / ${ag.pan}`,
    website: ag.web, address: ag.addr,
    commercialModel: ag.model, agreementStatus: 'Signed', recruiterCount: 4,
    accountManager: ag.mgr,
    verificationHistory: [
      { from: 'Pending', to: 'Approved', at: '2026-02-08T10:00:00.000Z', by: 'superadmin@nexatalent.com', reason: `GSTIN + ${ag.cin} verified against MCA records; MSA signed.` },
    ],
    createdAt: now,
  });
  const uid = `USR-AG-${pad2(a)}`;
  db.users.push({ id: uid, name: ag.owner, email: ag.email, role: 'agency_admin', tenantId: tenant, status: 'Active', lastLogin: now });
  db.credentials.push({ userId: uid, email: ag.email.toLowerCase(), passwordHash: pwHash, algo: 'bcrypt' });
  // agency recruiter logins
  const rid = `USR-AG-${pad2(a)}-R1`;
  const remail = `arec${a}@nexatalent.demo`;
  db.users.push({ id: rid, name: `Agency Recruiter ${a}`, email: remail, role: 'agency_recruiter', tenantId: tenant, status: 'Active', lastLogin: now });
  db.credentials.push({ userId: rid, email: remail.toLowerCase(), passwordHash: pwHash, algo: 'bcrypt' });
  // per-agency audit trail so Audit Log tab is never empty
  [
    ['system', 'AGENCY_ONBOARDED', tenant, 'agency', agencyId, 0],
    [ag.email, 'AGENCY_PROFILE_COMPLETED', tenant, 'agency', agencyId, 1],
    ['superadmin@nexatalent.com', 'AGENCY_VERIFIED', tenant, 'agency', agencyId, 2],
    [ag.mgr, 'AGENCY_AGREEMENT_SIGNED', tenant, 'commission_agreement', `AGR-${agencyId}-01`, 3],
    [remail, 'AGENCY_JOB_ASSIGNED', tenant, 'job', `JOB-CMP01-0${a}`, 5],
    [remail, 'CANDIDATE_SUBMITTED', tenant, 'submission', 'bulk', 6],
  ].forEach(([actor, action, tnt, resource, recordId, off], k) => {
    db.auditLogs.push({ id: `AUD-${agencyId}-${pad2(k + 1)}`, timestamp: addDays('2026-02-08T09:00:00.000Z', a + Number(off)), actor, action, resource, recordId, tenantId: tnt, ipAddress: '127.0.0.1' });
  });
  // countersign record: one commission agreement per agency so Agreements tab is loaded
  db.commissionAgreements.push({ id: `AGR-${agencyId}-01`, status: 'Signed', agencyId, orgId: tenant, companyAccepted: true, acceptedAt: '2026-02-09T00:00:00.000Z', acceptedBy: ag.email, effectiveDate: '2026-02-09T00:00:00.000Z', createdAt: now, createdBy: 'superadmin@nexatalent.com', hiringType: 'Senior / niche technology roles', feeModel: 'percentage', rate: 11, basisType: 'annual_ctc', contractMonths: 12, autoApprove: false, trigger: 'Joined', paymentTermsDays: 30, replacementDays: 90, gstApplicable: true, ownershipClause: OWNERSHIP, duplicatePolicy: DUPLICATES, cancellationTerms: CANCELLATION, replacementTerms: REPLACEMENT(90) });
}

// ---------- 50 companies ----------
console.log('Seeding 50 companies (38 verified)...');
const gstStates = ['29', '27', '36', '33', '06', '09', '19', '24'];
for (let c = 1; c <= NUM_COMPANIES; c++) {
  const tag = pad2(c);
  const name = `${pick(coPrefixes)}${pick(coSuffixes)} ${pick(industries)} ${tag}`;
  const orgId = `TNT-CMP${tag}`;
  const v = verifFor(c);
  const isContract = c >= CONTRACT_FROM;
  const industry = industries[c % industries.length];
  const city = pick(cities);
  const contact = `${pick(firstNames)} ${pick(lastNames)}`;
  db.organizations.push({
    id: orgId, legalName: `${name} Pvt Ltd`, displayName: name,
    entityType: 'Private Limited', industry, subIndustry: pick(['Enterprise SaaS', 'Platform', 'Services', 'Products']),
    companySize: pick(['51-200', '201-500', '501-1000']), website: `https://cmp${tag}.example.com`,
    description: `${name} is a ${industry} company hiring engineering, product and go-to-market talent via NexaTalent. Hiring model: ${isContract ? 'contract staffing' : 'direct hire'}.`,
    countryOfIncorporation: 'India', registrationNumber: `CIN-U72900KA2020PTC13${tag}01`,
    gstin: `${pick(gstStates)}AAKCS${tag}01${tag}Z5`, taxIds: `PAN-AAKCS${tag}01F`,
    registeredAddress: `${100 + c} Residency Rd, ${city}`, headquarters: city, operatingLocations: `${city}; Remote - India`,
    primaryContactName: contact, primaryContactDesignation: 'Head of Talent', primaryContact: contact,
    businessEmail: `hr@cmp${tag}.demo`, businessPhone: `+91-80-41${tag}01${tag}`,
    billingContact: `${pick(firstNames)} ${pick(lastNames)}`, financeEmail: `finance@cmp${tag}.demo`,
    salesOwner: c % 2 ? 'bda1@nexatalent.com' : 'bda2@nexatalent.com',
    accountManager: 'operations@nexatalent.com',
    hiringModel: isContract ? 'contract' : 'direct',
    plan: c % 3 === 0 ? 'Growth' : 'Enterprise Custom', seats: '12 / 50',
    status: v.status, verificationStatus: v.verificationStatus, accountStatus: v.accountStatus,
    verifiedAt: v.verified ? '2026-02-10T10:00:00.000Z' : null, verifiedBy: v.verified ? 'superadmin@nexatalent.com' : null,
    suspendReason: v.accountStatus === 'Suspended' ? 'Pending dues review — access limited per suspension policy.' : null,
    closeReason: null, createdDate: '2025-06-01',
  });
  db.companyProfiles.push({ id: `CMP-${tag}`, orgId, displayName: name, industry, size: '201-500', status: 'Active', createdAt: now });
  db.branches.push({ id: `BR-CMP${tag}-01`, orgId, name: `${name} HQ`, city, status: 'Active' });
  db.branches.push({ id: `BR-CMP${tag}-02`, orgId, name: `${name} Branch`, city: pick(cities), status: 'Active' });
  // verification record (directory verifications collection)
  db.verifications.push({ id: `VER-CMP${tag}`, orgId, status: v.verificationStatus, verifiedAt: v.verified ? '2026-02-10T10:00:00.000Z' : null, verifiedBy: v.verified ? 'superadmin@nexatalent.com' : null, documents: v.verified ? ['GST certificate', 'PAN card', 'Incorporation certificate'] : ['GST certificate (pending review)'], createdAt: now });
  const trio = [
    [`admin@cmp${tag}.demo`, 'company_admin', `${name} Admin`],
    [`hm@cmp${tag}.demo`, 'hiring_manager', `${name} HM`],
    [`rec@cmp${tag}.demo`, 'company_recruiter', `${name} Recruiter`],
  ];
  trio.forEach(([email, role, uname]) => {
    const uid = `USR-CMP${tag}-${role === 'company_admin' ? 'ADM' : role === 'hiring_manager' ? 'HM' : 'REC'}`;
    db.users.push({ id: uid, name: uname, email, role, tenantId: orgId, status: 'Active', lastLogin: now });
    db.credentials.push({ userId: uid, email: email.toLowerCase(), passwordHash: pwHash, algo: 'bcrypt' });
  });
  // NO-SUBSCRIPTION MODEL (v3): revenue is placement-fee only.
  // Keep 1 static subscription master row per org for reference; zero subscription invoices.
  const planId = c % 3 === 0 ? 'PLAN-GROWTH' : 'PLAN-ENTERPRISE';
  const price = planId === 'PLAN-GROWTH' ? 14999 : 49999;
  db.subscriptions.push({ id: `SUB-CMP${tag}`, orgId, planId, planVersion: 1, status: 'Active', startDate: '2026-01-01', renewalDate: '2027-01-01', price, currency: 'INR', autoRenew: true, createdAt: now });
  // usage ledger: platform activity consumption (not billing)
  [['candidates.search', 42], ['candidates.profile_view', 18], ['candidates.contact_unlock', 6]].forEach(([ent, qty], k) => {
    db.usageLedger.push({ id: `USG-CMP${tag}-${k}`, orgId, entitlement: ent, qty, billingPeriod: '2026-10', createdAt: now });
  });
  // per-company audit trail (Activity + Audit Log tabs)
  const auditSeed = [
    ['system', 'COMPANY_REGISTERED', orgId, 'organization', orgId],
    [v.verified ? 'superadmin@nexatalent.com' : 'bda1@nexatalent.com', v.verified ? 'COMPANY_VERIFIED' : 'COMPANY_SUBMITTED_FOR_VERIFICATION', orgId, 'organization', orgId],
    ['superadmin@nexatalent.com', 'AGREEMENT_SIGNED', orgId, 'commission_agreement', `AGR-CMP${tag}-01`],
    [`admin@cmp${tag}.demo`, 'BRANCH_ADDED', orgId, 'branch', `BR-CMP${tag}-01`],
    [`hm@cmp${tag}.demo`, 'REQUISITION_APPROVED', orgId, 'requisition', `REQ-CMP${tag}-01`],
    [`admin@cmp${tag}.demo`, 'JOB_PUBLISHED', orgId, 'job', `JOB-CMP${tag}-01`],
    [`rec@cmp${tag}.demo`, 'CANDIDATE_SHORTLISTED', orgId, 'application', 'bulk'],
    [`rec@cmp${tag}.demo`, 'INTERVIEW_SCHEDULED', orgId, 'interview', 'bulk'],
    [`hm@cmp${tag}.demo`, 'OFFER_ISSUED', orgId, 'offer', 'bulk'],
    [`hm@cmp${tag}.demo`, 'PLACEMENT_JOINED', orgId, 'placement', 'bulk'],
    ['finance@nexatalent.com', 'COMMISSION_APPROVED', orgId, 'commission', 'bulk'],
    ['finance@nexatalent.com', 'INVOICE_ISSUED', orgId, 'invoice', 'bulk'],
    ['finance@nexatalent.com', 'PAYMENT_RECONCILED', orgId, 'payment', 'bulk'],
  ];
  auditSeed.forEach(([actor, action, tenant, resource, recordId], k) => {
    db.auditLogs.push({ id: `AUD-CMP${tag}-${pad2(k + 1)}`, timestamp: addDays('2026-02-01T09:00:00.000Z', c + k * 9), actor, action, resource, recordId, tenantId: tenant, ipAddress: '127.0.0.1' });
  });
}
db.auditLogs.push({ id: 'AUD-SEED-1', timestamp: now, actor: 'system', action: 'ENTERPRISE_SEED_V2_50x20x50', resource: 'system', recordId: '-', tenantId: 'TNT-GLOBAL', ipAddress: '127.0.0.1' });

// ---------- 2500 candidates ----------
console.log('Seeding 2500 candidates...');
const candEmails = [];
const candNames = {};
const skillNames = skillsRef.map((s) => s.name);
const eduPool = [
  ['IIT Delhi', 'B.Tech', 'Computer Science'], ['NIT Trichy', 'B.E', 'Electronics'], ['BITS Pilani', 'M.Tech', 'Software Engineering'],
  ['Anna University', 'B.E', 'Computer Science'], ['Mumbai University', 'MCA', 'Computer Applications'], ['IIIT Hyderabad', 'M.Tech', 'Data Science'],
];
const certPool = [
  ['AWS Solutions Architect', 'Amazon'], ['CKA: Kubernetes Administrator', 'CNCF'], ['Terraform Associate', 'HashiCorp'],
  ['PMP', 'PMI'], ['Scrum Master (PSM I)', 'Scrum.org'], ['Google Data Analytics', 'Google'],
];
for (let i = 1; i <= NUM_CANDIDATES; i++) {
  const id = `CND-${pad4(i)}`;
  const name = `${pick(firstNames)} ${pick(lastNames)}`;
  const email = `candidate${i}@nexatalent.demo`;
  candEmails.push(email); candNames[email] = name;
  const exp = 1 + Math.floor(rand() * 12);
  const ctc = 400000 + Math.floor(rand() * 4000000);
  const cSkills = [pick(skillNames), pick(skillNames), pick(skillNames)];
  const [jrTitle, jrDept, jrCore] = pick(jobRoles);
  const loc = pick(cities);
  const headline = `${jrTitle} | ${exp}y | ${jrCore} | ${loc.split(',')[0]}`;
  const [eduInst, eduQual, eduField] = pick(eduPool);
  const eduYear = String(2012 + Math.floor(rand() * 12));
  const employer1 = `${pick(coPrefixes)} ${pick(coSuffixes)}`;
  const employer0 = `${pick(coPrefixes)} Systems`;
  const cur = i % 4 !== 0; // 75% currently employed
  const startY = 2026 - exp, midY = 2026 - Math.max(1, Math.floor(exp / 2));
  // Full §6.3 profile — every drawer tab reads from these fields (no dashes).
  db.candidateProfiles.push({
    id, name, email, phone: `+91-98${String(10000000 + Math.floor(rand() * 89999999))}`,
    headline, roleTitle: jrTitle, experienceYears: exp, location: loc,
    preferredLocation: i % 3 === 0 ? 'Remote - India' : loc, country: 'India',
    contactPrefs: i % 2 ? 'Email + phone, 10am-7pm IST' : 'Email preferred',
    currentCtc: ctc, expectedCtc: Math.round(ctc * 1.3), payPeriod: 'annual',
    noticePeriod: pick(['Immediate', '15 Days', '30 Days', '60 Days']),
    availability: cur ? 'Employed — serving notice as above' : 'Immediately available',
    source: i % 3 === 0 ? 'agency' : i % 3 === 1 ? 'direct' : 'referral',
    sourceType: i % 3 === 0 ? 'Agency' : 'Direct',
    submittedBy: i % 3 === 0 ? `arec${1 + (i % 5)}@nexatalent.demo` : 'self-apply',
    assignedRecruiter: i % 3 === 0 ? `arec${1 + (i % 5)}@nexatalent.demo` : `rec@cmp${pad2(1 + (i % 50))}.demo`,
    summary: `${name} is a ${jrTitle} with ${exp} years across ${jrDept}. Ships ${jrCore}-heavy systems at ${employer1}; rated ${60 + Math.floor(rand() * 40)}/100 on role fit.`,
    objectives: `Next: senior ${jrDept} scope in ${loc.split(',')[0]} / remote; target +30% comp growth.`,
    education: `${eduQual} (${eduField}), ${eduInst} — ${eduYear}`,
    skills: cSkills.join(', '),
    matchScore: 60 + Math.floor(rand() * 40), stage: 'Active',
    status: 'Active', visibility: 'standard',
    resumeRef: `resumes/${id}.pdf`, resumeVersion: 2,
    createdAt: now, updatedAt: now,
  });
  const cUid = `USR-CND-${pad4(i)}`;
  db.users.push({ id: cUid, name, email, role: 'candidate', tenantId: 'TNT-CANDIDATE', status: 'Active', lastLogin: now });
  db.credentials.push({ userId: cUid, email: email.toLowerCase(), passwordHash: pwHash, algo: 'bcrypt' });
  // Two experience rows (current + previous) with real dates for the timeline tab.
  db.experiences.push({ id: `EXP-${pad4(i)}-1`, candidateEmail: email, employer: employer1, designation: jrTitle, years: Math.max(1, exp - 2), startDate: `${midY}-04-01`, endDate: null, current: cur, createdAt: now });
  db.experiences.push({ id: `EXP-${pad4(i)}-0`, candidateEmail: email, employer: employer0, designation: `Junior ${jrTitle}`, years: Math.min(exp, 2), startDate: `${startY}-06-01`, endDate: `${midY}-03-31`, current: false, createdAt: now });
  db.educations.push({ id: `EDU-${pad4(i)}`, candidateEmail: email, institution: eduInst, qualification: eduQual, field: eduField, year: eduYear, score: `${7 + (i % 3)}.${(i * 7) % 10} CGPA`, createdAt: now });
  cSkills.forEach((s, k) => db.candidateSkills.push({ id: `CSK-${pad4(i)}-${k}`, candidateEmail: email, skill: s, level: pick(['Intermediate', 'Advanced', 'Expert']) }));
  if (i % 3 === 0) { const [cn, ci] = pick(certPool); db.certifications.push({ id: `CERT-${pad4(i)}`, candidateEmail: email, name: cn, issuer: ci, year: '2024', createdAt: now }); }
  // Dual-shaped document row (candidateEmail + ownerEmail + display fields) + version history.
  db.documents.push({ id: `DOC-${pad4(i)}`, candidateEmail: email, ownerEmail: email, email, name: `${id}-resume.pdf`, kind: 'resume', mime: 'application/pdf', ref: `resumes/${id}.pdf`, version: 2, uploadedAt: now, createdAt: now });
  if (i % 5 === 0) db.documents.push({ id: `DOC-${pad4(i)}-ID`, candidateEmail: email, ownerEmail: email, email, name: `${id}-id-proof.pdf`, kind: 'id_proof', mime: 'application/pdf', ref: `docs/${id}-id.pdf`, version: 1, uploadedAt: now, createdAt: now });
  // Placement-grade consent for every candidate (dual-shaped keys for the API filter).
  db.consents.push({ id: `CON-${pad4(i)}`, candidateEmail: email, email, purpose: 'placement-processing', status: 'granted', marketing: i % 4 === 0, visibility: 'standard', withdrawn: false, withdrawnAt: null, createdAt: now });
}

// ---------- jobs + funnel ----------
console.log('Seeding 1000 requisitions + 1000 jobs + 50,000 applications...');
let appSeq = 0, intSeq = 0, offSeq = 0, plcSeq = 0, comSeq = 0, invSeq = 0, subSeq = 0, ctrSeq = 0, tshSeq = 0;
let invoiceCounter = 1000;
const convApps = []; // Interview Scheduled apps for chat seeding
for (let c = 1; c <= NUM_COMPANIES; c++) {
  const tag = pad2(c);
  const orgId = `TNT-CMP${tag}`;
  const isContract = c >= CONTRACT_FROM;
  for (let j = 1; j <= JOBS_PER_COMPANY; j++) {
    const jtag = pad2(j);
    const [title, dept, coreSkill] = jobRoles[(c + j) % jobRoles.length];
    const reqId = `REQ-CMP${tag}-${jtag}`;
    const jobId = `JOB-CMP${tag}-${jtag}`;
    const [hiringType, rate] = hiringPlan[(c + j) % hiringPlan.length];
    const expMin = 2 + ((c + j) % 5), expMax = expMin + 3;
    let salMin, salMax, payPeriod, empType;
    if (isContract) {
      empType = 'Contract'; payPeriod = 'hourly';
      salMin = 1200 + ((c * 7 + j * 13) % 20) * 100; salMax = Math.round(salMin * 1.6);
    } else {
      empType = 'Full-time'; payPeriod = 'annual';
      salMin = 800000 + ((c * 7 + j * 13) % 20) * 150000; salMax = Math.round(salMin * 1.5);
    }
    const reqStatus = j % 10 === 0 ? 'Draft' : j % 10 === 9 ? 'Closed' : j % 5 === 4 ? 'Sourcing' : 'Approved';
    const jobStatus = j % 10 === 0 ? 'Draft' : j % 10 === 9 ? 'Closed' : 'Published';
    db.requisitions.push({ id: reqId, orgId, title: `${title} [${tag}/${jtag}]`, department: dept, status: reqStatus, openings: 1 + ((c + j) % 4), employmentType: empType, location: pick(cities), branch: `BR-CMP${tag}-01`, hiringManager: `hm@cmp${tag}.demo`, recruiter: `rec@cmp${tag}.demo`, experienceMin: expMin, experienceMax: expMax, deadline: '2027-03-01T00:00:00.000Z', budgetMin: salMin, budgetMax: salMax, currency: 'INR', payPeriod, hiringModel: isContract ? 'contract' : 'direct', createdAt: now });
    db.jobs.push({ id: jobId, requisitionId: reqId, orgId, title: `${title} [${tag}/${jtag}]`, description: `${title} role at company ${tag} (${isContract ? 'contract staffing' : 'direct hire'}). Stack: ${coreSkill}.`, status: jobStatus, visibility: 'public', location: pick(cities), employmentType: empType, payPeriod, salaryMin: salMin, salaryMax: salMax, currency: 'INR', experienceMin: expMin, experienceMax: expMax, requiredSkills: coreSkill, applicantsCount: APPS_PER_JOB, startDate: now, expiryDate: '2027-04-01T00:00:00.000Z', assignedAgencies: [`AGC-${101 + ((c + j) % 5)}`], hiringModel: isContract ? 'contract' : 'direct', createdAt: now });
    db.jobSkills.push({ id: `JSK-CMP${tag}-${jtag}`, jobId, skill: coreSkill });

    const agrId = `AGR-CMP${tag}-${jtag}`;
    db.commissionAgreements.push({ id: agrId, status: 'Approved', companyAccepted: true, acceptedAt: '2026-03-01T00:00:00.000Z', acceptedBy: `admin@cmp${tag}.demo`, effectiveDate: '2026-03-01T00:00:00.000Z', createdAt: now, createdBy: 'superadmin@nexatalent.com', orgId, jobId, hiringType, feeModel: 'percentage', rate, basisType: isContract ? 'monthly_ctc' : 'annual_ctc', contractMonths: 12, autoApprove: false, trigger: 'Joined', paymentTermsDays: 30, replacementDays: 90, gstApplicable: true, ownershipClause: OWNERSHIP, duplicatePolicy: DUPLICATES, cancellationTerms: CANCELLATION, replacementTerms: REPLACEMENT(90) });

    const base = ((c - 1) * JOBS_PER_COMPANY + (j - 1)) * 37;
    for (let k = 0; k < APPS_PER_JOB; k++) {
      const candIdx = (base + k * 53) % NUM_CANDIDATES;
      const email = candEmails[candIdx];
      const stage = stagesPerJob[k];
      appSeq++;
      const appId = `APP-${String(appSeq).padStart(5, '0')}`;
      db.applications.push({ id: appId, key: `${jobId}::${email}`, jobId, jobTitle: `${title} [${tag}/${jtag}]`, orgId, requisitionId: reqId, candidateEmail: email, candidateName: candNames[email], stage, source: k % 3 === 0 ? 'agency' : 'direct', createdAt: now, updatedAt: now });
      db.stageHistory.push({ id: `STG-${String(appSeq).padStart(5, '0')}`, applicationId: appId, from: 'Applied', to: stage, actor: `rec@cmp${tag}.demo`, createdAt: now });
      if (k % 3 === 0) {
        subSeq++;
        db.submissions.push({ id: `SUBM-${String(subSeq).padStart(5, '0')}`, agencyId: `AGC-${101 + ((c + j + k) % 5)}`, jobId, orgId, candidateEmail: email, resumeRef: `resumes/CND-${pad4(candIdx + 1)}.pdf`, consentEvidence: 'agency-consent-ref', status: stage === 'Rejected' ? 'Rejected' : stage === 'Hired' ? 'Joined' : 'Under Review', submittedBy: `arec${1 + ((c + j + k) % 5)}@nexatalent.demo`, createdAt: now });
      }
      if (stage === 'Interview Scheduled' || stage === 'Interview Completed') {
        const rounds = stage === 'Interview Completed' ? 2 : 1;
        for (let r = 1; r <= rounds; r++) {
          intSeq++;
          db.interviews.push({ id: `INT-${String(intSeq).padStart(5, '0')}`, applicationId: appId, jobId, round: `Round ${r}`, scheduledAt: `2026-11-${pad2(1 + ((intSeq + c) % 27))}T10:00:00`, timezone: 'Asia/Kolkata', mode: r % 2 ? 'video' : 'onsite', candidateEmail: email, candidateName: candNames[email], companyId: orgId, orgId, status: stage === 'Interview Completed' ? 'Completed' : 'Scheduled', createdAt: now });
        }
        if (stage === 'Interview Completed') db.feedback.push({ id: `FDB-${String(intSeq).padStart(5, '0')}`, applicationId: appId, rating: 3 + ((intSeq + k) % 3), notes: 'Seed feedback: technically strong.', createdAt: now });
        if (stage === 'Interview Scheduled' && convApps.length < 500) convApps.push({ appId, jobId, orgId, email });
      }
      if (stage === 'Offer' || stage === 'Hired') {
        offSeq++;
        const ctcOffer = salMin + Math.floor(rand() * (salMax - salMin));
        const offStatus = stage === 'Hired' ? 'Accepted' : offSeq % 9 === 0 ? 'Declined' : 'Issued';
        db.offers.push({ id: `OFF-${String(offSeq).padStart(5, '0')}`, applicationId: appId, jobId, orgId, candidateEmail: email, ctc: ctcOffer, currency: 'INR', payPeriod, status: offStatus, createdAt: now });
      }
      // cancelled interviews for filter coverage (1 per job)
      if (k === APPS_PER_JOB - 1) {
        intSeq++;
        db.interviews.push({ id: `INT-${String(intSeq).padStart(5, '0')}`, applicationId: appId, jobId, round: 'Round 1', scheduledAt: '2026-11-05T10:00:00', timezone: 'Asia/Kolkata', mode: 'video', candidateEmail: email, candidateName: candNames[email], companyId: orgId, orgId, status: 'Cancelled', createdAt: now });
      }
      if (stage === 'Hired') {
        plcSeq++;
        const plcId = `PLC-${String(plcSeq).padStart(5, '0')}`;
        const feeBasis = isContract ? Math.round(salMin * 160) : salMin + Math.floor(rand() * (salMax - salMin));
        const joinDate = addDays('2026-08-01T00:00:00.000Z', (plcSeq * 7) % 55); // Aug-Oct 2026
        const dueDate = addDays(joinDate, 30).slice(0, 10); // payable within 30 days of joining
        db.placements.push({ id: plcId, applicationId: appId, jobId, orgId, candidateEmail: email, candidateName: candNames[email], joinDate, feeBasis, agreementId: agrId, hiringModel: isContract ? 'contract' : 'direct', status: 'Joined', createdAt: now });
        comSeq++;
        const comId = `COM-${String(comSeq).padStart(5, '0')}`;
        const gross = Math.round(feeBasis * (rate / 100));
        const tax = Math.round(gross * 0.18); // GST extra as applicable
        invoiceCounter++;
        const invId = `INV-${invoiceCounter}`;
        const invTotal = gross + tax;
        const bucket = comSeq % 10;
        const paid = bucket < 6, partial = bucket === 6;
        const overdue = !paid && !partial && dueDate < '2026-10-11';
        const invStatus = paid ? 'Paid' : partial ? 'Partially Paid' : overdue ? 'Overdue' : 'Issued';
        const amtPaid = paid ? invTotal : partial ? Math.round(invTotal / 2) : 0;
        db.commissions.push({ id: comId, agreementId: agrId, placementId: plcId, applicationId: appId, jobId, orgId, agencyId: k % 3 === 0 ? `AGC-${101 + ((c + j + k) % 5)}` : null, candidateEmail: email, trigger: 'Joined', triggerDate: joinDate, triggerEvidence: `placement:${plcId}`, feeBasis, basisType: isContract ? 'monthly_ctc' : 'annual_ctc', contractMonths: 12, rate, feeModel: 'percentage', hiringType, agreementSnapshot: { hiringType, rate, feeModel: 'percentage', basisType: isContract ? 'monthly_ctc' : 'annual_ctc', contractMonths: 12, trigger: 'Joined', paymentTermsDays: 30, replacementDays: 90 }, gross, adjustments: 0, tax, total: invTotal, net: invTotal, approvalStatus: 'Approved', paymentStatus: paid ? 'Paid' : 'Unpaid', createdAt: now, approvedAt: now, approvedBy: 'finance@nexatalent.com', invoiceId: invId, invoiceIds: [invId], billedMonths: 1 });
        db.invoices.push({ id: invId, number: `INV-2026-${invoiceCounter}`, orgId, lines: [{ label: `Placement fee (${hiringType}) - ${email}`, qty: 1, unit: gross }], discount: 0, taxRate: 18, dueDate, invoiceType: isContract ? 'contract_placement' : 'placement', subtotal: gross, tax, total: invTotal, amountPaid: amtPaid, balance: invTotal - amtPaid, status: invStatus, issueDate: joinDate, createdAt: now, createdBy: 'finance@nexatalent.com', commissionId: comId });
        db.invoiceLines.push({ id: `INVL-${invoiceCounter}`, invoiceId: invId, label: 'Placement fee', qty: 1, unit: gross });
        if (amtPaid > 0) {
          invSeq++;
          const payId = `PAY-${String(invSeq).padStart(5, '0')}`;
          db.payments.push({ id: payId, orgId, invoiceId: invId, amount: amtPaid, provider: 'seed', status: 'succeeded', transactionDate: addDays(joinDate, 20), createdAt: now });
          db.allocations.push({ id: `ALC-${String(invSeq).padStart(5, '0')}`, invoiceId: invId, paymentId: payId, amount: amtPaid, createdAt: now });
        } else {
          db.invoiceReminders.push({ id: `RMD-${String(comSeq).padStart(5, '0')}`, invoiceId: invId, orgId, channel: 'email', status: 'queued', dueDate, createdAt: now });
        }
        if (k % 3 === 0) db.payouts.push({ id: `PO-${String(plcSeq).padStart(5, '0')}`, type: 'agency_payout', commissionId: comId, agencyId: `AGC-${101 + ((c + j + k) % 5)}`, orgId, amount: Math.round(gross * 0.7), status: paid ? 'Processed' : 'Payable', createdAt: now });
        // CONTRACT CHAIN: company -> NexaTalent -> candidate
        if (isContract) {
          ctrSeq++;
          const ctrId = `CTR-${String(ctrSeq).padStart(4, '0')}`;
          const hourly = salMin + ((ctrSeq * 37) % (salMax - salMin));
          db.contractors.push({ id: ctrId, name: candNames[email], candidateEmail: email, skillset: title, clientName: `CMP${tag}`, clientTenant: orgId, vendorTenant: `TNT-AGENCY-${pad2(1 + ((c + j) % 5))}`, placementId: plcId, hourlyRate: hourly, currency: 'INR', startDate: joinDate.slice(0, 10), status: 'Active Deployed', slaScore: `${(97 + (ctrSeq % 3)).toFixed(1)}%`, createdAt: now });
          ['2026-09', '2026-10'].forEach((period) => {
            tshSeq++;
            const hrs = 160 + ((tshSeq * 13) % 25);
            // Sep = closed month (vendor-submitted, Approved → billed in payroll run).
            // Oct = OPEN month (candidate files their own hours → employer approves → payroll runs live).
            const closed = period === '2026-09';
            db.timesheets.push({ id: `TSH-${String(tshSeq).padStart(5, '0')}`, contractorId: ctrId, contractorName: candNames[email], clientName: `CMP${tag}`, clientTenant: orgId, vendorTenant: `TNT-AGENCY-${pad2(1 + ((c + j) % 5))}`, period, hours: hrs, hourlyRate: hourly, billableAmount: hrs * hourly, notes: `${period} staffing`, status: closed ? 'Approved' : 'Submitted', submittedBy: closed ? `arec${1 + ((c + j) % 5)}@nexatalent.demo` : email, reviewedBy: closed ? `hm@cmp${tag}.demo` : undefined, reviewedAt: closed ? now : undefined, createdAt: now });
          });
        }
      }
    }
  }
  if (c % 10 === 0) console.log(`  ... ${c}/50 companies done (apps: ${db.applications.length})`);
}

// Monthly payroll chain (contract cos): Sep = CLOSED run (invoice + payouts + payrollRun linked),
// Oct = OPEN (Submitted timesheets only — approve + run payroll live in the app).
for (let c = CONTRACT_FROM; c <= NUM_COMPANIES; c++) {
  const tag = pad2(c), orgId = `TNT-CMP${tag}`;
  const period = '2026-09';
  invoiceCounter++;
  const invId = `INV-${invoiceCounter}`;
  const sepTs = db.timesheets.filter((t) => t.clientTenant === orgId && t.period === period);
  const sub = sepTs.reduce((s, t) => s + Number(t.billableAmount || 0), 0);
  const tax = Math.round(sub * 0.18), tot = sub + tax;
  const paid = c % 3 !== 0;
  const runId = `PR-CMP${tag}-202609`;
  const poId = `PO-CTR-${tag}-${period}`;
  const inv = { id: invId, number: `INV-2026-${invoiceCounter}`, orgId, payrollRunId: runId, invoiceType: 'contract_staffing', billingPeriod: period, lines: [{ label: `Contract staffing ${period} - consolidated timesheets`, qty: 1, unit: sub }], discount: 0, taxRate: 18, dueDate: '2026-10-15', subtotal: sub, tax, total: tot, amountPaid: paid ? tot : 0, balance: paid ? 0 : tot, status: paid ? 'Paid' : 'Overdue', issueDate: `${period}-30T00:00:00.000Z`, createdAt: now, createdBy: 'finance@nexatalent.com' };
  db.invoices.push(inv);
  db.invoiceLines.push({ id: `INVL-${invoiceCounter}`, invoiceId: invId, label: 'Contract staffing', qty: 1, unit: sub });
  if (paid) {
    invSeq++;
    const payId = `PAY-${String(invSeq).padStart(5, '0')}`;
    db.payments.push({ id: payId, orgId, invoiceId: invId, amount: tot, provider: 'seed', status: 'succeeded', transactionDate: `${period}-28T00:00:00.000Z`, createdAt: now });
    db.allocations.push({ id: `ALC-${String(invSeq).padStart(5, '0')}`, invoiceId: invId, paymentId: payId, amount: tot, createdAt: now });
  }
  // NexaTalent -> contractors payout batch for the month
  const payoutTotal = Math.round(sub * 0.82);
  db.payouts.push({ id: poId, type: 'contractor_payout', payrollRunId: runId, orgId, period, amount: payoutTotal, status: paid ? 'Processed' : 'Payable', settlementDate: paid ? `${period}-29T00:00:00.000Z` : undefined, createdAt: now, by: 'finance@nexatalent.com' });
  for (const t of sepTs) t.payrollRunId = runId;
  db.payrollRuns.push({ id: runId, orgId, period, timesheetIds: sepTs.map((t) => t.id), subtotal: sub, tax, total: tot, payoutTotal, invoiceId: invId, payoutIds: [poId], status: paid ? 'Settled' : 'Issued', runBy: 'finance@nexatalent.com', createdAt: now, settledAt: paid ? `${period}-29T00:00:00.000Z` : undefined });
  db.auditLogs.push({ id: `AUD-CMP${tag}-PR`, timestamp: `${period}-30T09:00:00.000Z`, actor: 'finance@nexatalent.com', action: 'PAYROLL_RUN', resource: 'payroll', recordId: runId, tenantId: orgId, ipAddress: '127.0.0.1' });
}

// ---------- engagement world ----------
// interview-only chat: 500 conversations on Interview Scheduled apps
convApps.forEach((ca, i) => {
  const convId = `CON-${String(i + 1).padStart(4, '0')}`;
  db.conversations.push({ id: convId, applicationId: ca.appId, jobId: ca.jobId, companyId: ca.orgId, orgId: ca.orgId, candidateId: ca.email, candidateEmail: ca.email, candidateName: candNames[ca.email], status: 'active', createdAt: now, lastMessageAt: now });
  const compTag = ca.orgId.slice(-2);
  [['candidate', ca.email, `Hello, confirming my availability for the scheduled interview.`],
   ['company', `rec@cmp${compTag}.demo`, `Thanks for confirming. The panel link and agenda are shared. Good luck!`],
   ['candidate', ca.email, `Thank you! I have noted the time slot.`]].forEach(([role, sender, body], m) => {
    db.messages.push({ id: `MSG-${String(i * 3 + m + 1).padStart(5, '0')}`, conversationId: convId, sender, senderRole: role, type: 'text', body, deliveryStatus: 'delivered', createdAt: now });
  });
});
// talent pools: 1 per company + 5 members
for (let c = 1; c <= NUM_COMPANIES; c++) {
  const tag = pad2(c), orgId = `TNT-CMP${tag}`;
  const poolId = `POOL-CMP${tag}`;
  db.talentPools.push({ id: poolId, orgId, name: `${tag} Bench - Engineering`, description: 'Shortlisted + hired bench', owner: `rec@cmp${tag}.demo`, createdAt: now });
  for (let m = 0; m < 5; m++) {
    const email = candEmails[(c * 41 + m * 97) % NUM_CANDIDATES];
    db.talentPoolMembers.push({ id: `TPM-CMP${tag}-${m}`, poolId, candidateEmail: email, candidateName: candNames[email], addedBy: `rec@cmp${tag}.demo`, createdAt: now });
  }
}
// saved jobs: 300
for (let s = 0; s < 300; s++) {
  const email = candEmails[(s * 7) % NUM_CANDIDATES];
  const cc = pad2(1 + (s % 50)), jj = pad2(1 + ((s * 3) % 20));
  db.savedJobs.push({ id: `SAV-${String(s + 1).padStart(4, '0')}`, candidateEmail: email, jobId: `JOB-CMP${cc}-${jj}`, createdAt: now });
}
// notifications: bounded 1500 (placement + interview + application)
for (let n = 0; n < 1500; n++) {
  const email = candEmails[(n * 11) % NUM_CANDIDATES];
  const kind = n % 3 === 0 ? 'placement' : n % 3 === 1 ? 'interview' : 'application';
  const cc = pad2(1 + (n % 50));
  db.notifications.push({ id: `NOTIF-${String(n + 1).padStart(5, '0')}`, recipient: n % 4 === 0 ? `company:TNT-CMP${cc}` : email, kind, body: `Seed ${kind} update for ${email}`, channel: 'in-app', status: n % 5 === 0 ? 'read' : 'queued', createdAt: now, tenantId: `TNT-CMP${cc}` });
}
// outreach campaigns: 20 + recipients + events
for (let c = 1; c <= 20; c++) {
  const tag = pad2(c), orgId = `TNT-CMP${tag}`;
  const campId = `CMP-N-${pad2(c)}`;
  db.campaigns.push({ id: campId, orgId, name: `Oct outreach ${tag}`, jobId: `JOB-CMP${tag}-01`, status: c % 4 === 0 ? 'Queued' : 'Sent', createdAt: now });
  for (let r = 0; r < 5; r++) {
    const email = candEmails[(c * 31 + r * 53) % NUM_CANDIDATES];
    db.campaignRecipients.push({ id: `CR-${campId}-${r}`, campaignId: campId, candidateEmail: email, status: 'sent', createdAt: now });
    db.campaignEvents.push({ id: `CE-${campId}-${r}`, campaignId: campId, recipientId: `CR-${campId}-${r}`, event: r % 3 === 0 ? 'opened' : 'delivered', createdAt: now });
  }
}
// sales world: 75 leads + activities, 40 opportunities, 30 proposals, 60 meetings, 4 targets, 150 tasks
const leadStages = ['New', 'Contacted', 'Qualified', 'Discovery Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurture'];
for (let l = 1; l <= 75; l++) {
  const stage = leadStages[l % leadStages.length];
  const owned = l % 2 ? 'bda1@nexatalent.com' : 'bda2@nexatalent.com';
  const linked = l <= 50 ? `TNT-CMP${pad2(l <= 50 ? ((l - 1) % 50) + 1 : 1)}` : null;
  const lid = `LEAD-${String(l).padStart(3, '0')}`;
  db.leads.push({ id: lid, contactName: `${pick(firstNames)} ${pick(lastNames)}`, companyName: l <= 50 ? `Seed account ${l}` : `Prospect ${l} ${pick(industries)}`, email: `lead${l}@example.com`, stage, owner: owned, value: 200000 + ((l * 53000) % 1800000), currency: 'INR', nextFollowUp: addDays('2026-10-11T00:00:00.000Z', (l % 14) + 1).slice(0, 10), orgId: linked, createdAt: now });
  [0, 1].forEach((a) => db.leadActivities.push({ id: `LA-${lid}-${a}`, leadId: lid, type: a ? 'follow-up' : 'call', outcome: a ? 'Interested' : 'Connected', notes: `Seed activity ${a} for ${lid}`, owner: owned, createdAt: now }));
  if (l <= 40) db.opportunities.push({ id: `OPP-${String(l).padStart(3, '0')}`, leadId: lid, orgId: linked, stage: stage === 'Won' ? 'Closed Won' : 'Open', value: 200000 + ((l * 53000) % 1800000), currency: 'INR', owner: owned, createdAt: now });
  if (l <= 30) db.proposals.push({ id: `PRP-${String(l).padStart(3, '0')}`, leadId: lid, orgId: linked, title: `Staffing proposal ${l}`, value: 300000 + ((l * 71000) % 1500000), currency: 'INR', status: l % 3 === 0 ? 'Sent' : l % 3 === 1 ? 'Accepted' : 'Draft', owner: owned, createdAt: now });
}
for (let m = 1; m <= 60; m++) {
  db.meetings.push({ id: `MTG-${String(m).padStart(3, '0')}`, leadId: `LEAD-${String(((m - 1) % 75) + 1).padStart(3, '0')}`, title: `Discovery call ${m}`, date: addDays('2026-10-11T00:00:00.000Z', (m % 20) - 5), outcome: m % 4 === 0 ? 'No-show' : 'Held', owner: m % 2 ? 'bda1@nexatalent.com' : 'bda2@nexatalent.com', createdAt: now });
}
[['bda1@nexatalent.com', 'Q4 pipeline', 50], ['bda2@nexatalent.com', 'Q4 pipeline', 50], ['bda1@nexatalent.com', 'Q4 revenue', 2000000], ['bda2@nexatalent.com', 'Q4 revenue', 2000000]].forEach(([owner, title, target], i) => {
  db.targets.push({ id: `TGT-${i + 1}`, owner, title, target, period: '2026-Q4', createdAt: now });
});
for (let t = 1; t <= 150; t++) {
  const cc = pad2(1 + (t % 50));
  db.tasks.push({ id: `TSK-${String(t + 700).padStart(4, '0')}`, title: `Seed follow-up ${t} for CMP${cc}`, client: `CMP${cc}`, priority: t % 3 === 0 ? 'High' : 'Medium', dueDate: addDays('2026-10-11T00:00:00.000Z', (t % 10) - 3).slice(0, 10), status: t % 4 === 0 ? 'Done' : 'Pending', owner: t % 2 ? 'operations@nexatalent.com' : `rec@cmp${cc}.demo`, createdAt: now });
}
// v3: vendor logins (staffing partners in the superadmin->vendor->company chain) — full clean profiles
const vendorSeed = [
  { n: 1, legal: 'CloudServe Staffing India Pvt Ltd', display: 'Staffing Vendor 1 · CloudServe', owner: 'Meera Krishnan', phone: '+91-40-41120311', addr: 'Plot 8, HITEC City, Hyderabad 500081', web: 'https://cloudserve.example.com' },
  { n: 2, legal: 'SecureStack Vendors Pvt Ltd', display: 'Staffing Vendor 2 · SecureStack', owner: 'Farhan Qureshi', phone: '+91-40-41120322', addr: 'Level 5, Cyber Towers, Hyderabad 500081', web: 'https://securestack.example.com' },
  { n: 3, legal: 'RemoteCrew Solutions Pvt Ltd', display: 'Staffing Vendor 3 · RemoteCrew', owner: 'Anita Desai', phone: '+91-40-41120333', addr: 'Banjara Hills Rd 12, Hyderabad 500034', web: 'https://remotecrew.example.com' },
];
for (const v of vendorSeed) {
  const vnd = v.n;
  const tenant = `TNT-VENDOR-${pad2(vnd)}`;
  const vid = `VND-${200 + vnd}`;
  db.agencyProfiles.push({ id: vid, legalName: v.legal, displayName: v.display, type: 'Contingent Staffing Vendor', entityType: 'Private Limited', specialties: 'Cloud, Security', locations: 'Hyderabad, Remote - India', status: 'Active SOW', verificationStatus: 'Approved', accountStatus: 'Active', tenantId: tenant, contactName: v.owner, contactEmail: `vendor${vnd}@nexatalent.demo`, contactPhone: v.phone, country: 'India', registrationNumber: `CIN-U74999TG2020PTC130${vnd}01`, taxIds: `36AABCS20${vnd}1F1Z5 / PAN-AABCS20${vnd}1F`, website: v.web, address: v.addr, commercialModel: 'percentage', agreementStatus: 'Signed', recruiterCount: 3, accountManager: 'operations@nexatalent.com', verificationHistory: [{ from: 'Pending', to: 'Approved', at: '2026-02-08T10:00:00.000Z', by: 'superadmin@nexatalent.com', reason: 'SOW + GSTIN verified; staffing MSA countersigned.' }], createdAt: now });
  const vUid = `USR-VND-${pad2(vnd)}`;
  db.users.push({ id: vUid, name: v.owner, email: `vendor${vnd}@nexatalent.demo`, role: 'vendor', tenantId: tenant, status: 'Active', lastLogin: now });
  db.credentials.push({ userId: vUid, email: `vendor${vnd}@nexatalent.demo`, passwordHash: pwHash, algo: 'bcrypt' });
  db.auditLogs.push({ id: `AUD-${vid}-01`, timestamp: '2026-02-08T09:00:00.000Z', actor: 'system', action: 'AGENCY_ONBOARDED', resource: 'agency', recordId: vid, tenantId: tenant, ipAddress: '127.0.0.1' });
  db.auditLogs.push({ id: `AUD-${vid}-02`, timestamp: '2026-02-08T10:00:00.000Z', actor: 'superadmin@nexatalent.com', action: 'AGENCY_VERIFIED', resource: 'agency', recordId: vid, tenantId: tenant, ipAddress: '127.0.0.1' });
}
// finance extras: credit notes, refunds, commission adjustments (placement-linked, NO subscription refs)
for (let x = 1; x <= 10; x++) {
  const cc = pad2(x);
  const invRef = db.invoices.find((i) => i.orgId === `TNT-CMP${cc}`)?.id || `INV-100${x}`;
  const payRef = db.payments.find((p) => p.orgId === `TNT-CMP${cc}`)?.id || `PAY-000${x}`;
  db.creditNotes.push({ id: `CN-${pad2(x)}`, orgId: `TNT-CMP${cc}`, invoiceId: invRef, amount: 2000 + x * 100, reason: 'Goodwill adjustment', status: x % 3 === 0 ? 'Applied' : 'Issued', createdAt: now });
  db.commissionAdjustments.push({ id: `ADJ-${pad2(x)}`, commissionId: `COM-${String(x * 7).padStart(5, '0')}`, amount: -500, reason: 'Volume goodwill', createdBy: 'finance@nexatalent.com', createdAt: now });
  if (x <= 5) db.refunds.push({ id: `REF-${pad2(x)}`, orgId: `TNT-CMP${cc}`, paymentId: payRef, amount: 1000 * x, status: 'succeeded', createdAt: now });
  db.reconciliations.push({ id: `REC-${pad2(x)}`, orgId: `TNT-CMP${cc}`, invoiceId: invRef, status: x % 2 ? 'Reconciled' : 'Pending', reconciledBy: 'finance@nexatalent.com', createdAt: now });
}
// v3: zero-empty-data fillers — every remaining tab/API gets rows
{
  const tStates = ['Open', 'In Progress', 'Resolved', 'Closed'];
  for (let s = 1; s <= 40; s++) {
    const cc = pad2(1 + (s % 50));
    db.supportTickets.push({ id: `SUP-${String(s).padStart(3, '0')}`, orgId: `TNT-CMP${cc}`, subject: `Seed issue ${s} for CMP${cc}`, description: 'Seeded support ticket covering all states.', status: tStates[s % 4], priority: s % 3 === 0 ? 'High' : 'Medium', requester: `admin@cmp${cc}.demo`, assignee: 'operations@nexatalent.com', createdAt: now, updatedAt: now });
  }
  for (let n = 1; n <= 20; n++) {
    const email = candEmails[(n * 37) % NUM_CANDIDATES];
    const cid = `CND-${pad4((n * 37) % NUM_CANDIDATES + 1)}`;
    db.candidateInfoRequests.push({ id: `CIR-${pad2(n)}`, candidateId: cid, candidateEmail: email, email, candidateName: candNames[email], requester: 'operations@nexatalent.com', by: 'operations@nexatalent.com', message: n % 2 ? 'Please upload your latest payslip + ID proof for verification.' : 'Please confirm your notice period and earliest joining date.', status: n % 3 === 0 ? 'Responded' : n % 3 === 1 ? 'Open' : 'Closed', createdAt: now });
    db.privacyRequests.push({ id: `PRV-${pad2(n)}`, candidateId: cid, candidateEmail: email, email, candidateName: candNames[email], type: n % 2 ? 'export' : 'delete', reason: n % 2 ? 'Candidate requested a copy of personal data.' : 'Right-to-erasure verification sample.', status: n % 4 === 0 ? 'Completed' : n % 4 === 1 ? 'Pending' : 'Approved', by: 'operations@nexatalent.com', decidedBy: n % 4 === 1 ? null : 'superadmin@nexatalent.com', decidedAt: n % 4 === 1 ? null : now, createdAt: now });
    db.notificationPrefs.push({ id: `NP-${pad2(n)}`, userEmail: email, channel: 'in-app', enabled: true, createdAt: now });
  }
  for (let c = 1; c <= 15; c++) {
    const tag = pad2(c + 35);
    db.compliance.push({ id: `CPL-${pad2(c)}`, orgId: `TNT-CMP${tag}`, docType: c % 2 ? 'NDA' : 'SOW', status: c % 3 === 0 ? 'Expiring' : 'Verified', expiryDate: '2027-01-01', createdAt: now });
  }
}

console.log('Counts:', JSON.stringify({
  orgs: db.organizations.length, verified: db.organizations.filter((o) => o.verificationStatus === 'Approved').length,
  users: db.users.length, candidates: db.candidateProfiles.length,
  reqs: db.requisitions.length, jobs: db.jobs.length, apps: db.applications.length,
  interviews: db.interviews.length, offers: db.offers.length, placements: db.placements.length,
  contractors: db.contractors.length, timesheets: db.timesheets.length,
  agreements: db.commissionAgreements.length, commissions: db.commissions.length,
  invoices: db.invoices.length, payments: db.payments.length, payouts: db.payouts.length, payrollRuns: db.payrollRuns.length,
  convs: db.conversations.length, msgs: db.messages.length, notifs: db.notifications.length,
  leads: db.leads.length, tasks: db.tasks.length, pools: db.talentPools.length,
  audits: db.auditLogs.length,
}, null, 2));

console.log('Writing DB file...');
writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
console.log('DONE. Backup at:', bak);
console.log('Logins (all password NexaTalent123): superadmin@nexatalent.com | operations@nexatalent.com | bda1@nexatalent.com | finance@nexatalent.com | admin@cmp01.demo | hm@cmp01.demo | rec@cmp01.demo | agency1@nexatalent.demo | arec1@nexatalent.demo | vendor1@nexatalent.demo | candidate1@nexatalent.demo');
