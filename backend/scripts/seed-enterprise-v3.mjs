// Enterprise mega-seed v3: WIPE + FRESH, 100 companies, every tab loaded, fully synced.
// - 100 companies: 80 direct hire + 20 contract staffing (CMP81-100)
//   verification: 76 Approved + 10 Pending + 5 Invited + 4 Rejected + 5 Suspended
// - Full §6.4 profile fields (GSTIN, reg no, addresses, contacts, sales owner...)
// - 5 requisitions per company (500) -> 25 jobs per company (2500), every job linked
// - 12 applications per job (~30k), full stage coverage incl. Rejected/Withdrawn
// - 5000 candidates, 10 agencies + 10 recruiter logins, 5 vendors
// - Direct + contract commissions (receivable/payable legs), invoices Paid/Partial/Overdue,
//   reconciled payments, agency + contractor payouts, payroll runs (Sep closed / Oct open)
// - Talent pools 2/company, conversations on Scheduled interviews, leads pipeline, audit trails
// Usage: node scripts/seed-enterprise-v3.mjs  (run from backend/)
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(here, '..', 'data');
const DB_FILE = join(DATA_DIR, 'nexatalent.db.json');

const NUM_COMPANIES = 100;
const REQS_PER_COMPANY = 5;
const JOBS_PER_COMPANY = 25;
const APPS_PER_JOB = 12;
const NUM_CANDIDATES = 5000;
const NUM_AGENCIES = 10;
const NUM_VENDORS = 5;
const SEED_PASSWORD = 'NexaDemo2026!';
const CONTRACT_FROM = 81; // CMP81-100 are contract-staffing companies

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261015);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pad2 = (n) => String(n).padStart(2, '0');
const pad3 = (n) => String(n).padStart(3, '0');
const pad4 = (n) => String(n).padStart(4, '0');
const pad5 = (n) => String(n).padStart(5, '0');

const now = new Date().toISOString();
const NOW_MS = new Date('2026-10-11T00:00:00.000Z').getTime();
const addDays = (iso, d) => new Date(new Date(iso).getTime() + d * 864e5).toISOString();

console.log('Reading current DB for reference collections (fresh file OK if missing)...');
let current = {};
try {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  current = JSON.parse(readFileSync(DB_FILE, 'utf8'));
} catch {
  console.log('No usable DB file — using built-in reference defaults.');
  current = {};
}
const skillsRef = current.skills?.length ? current.skills : [{ id: 'SKL-100', name: 'React', category: 'Technology' }];
const rolesRef = current.roles?.length ? current.roles : [{ id: 'superadmin', name: 'superadmin', scope: 'platform', system: true, createdAt: now }];
const agreementTemplatesRef = current.agreementTemplates?.length ? current.agreementTemplates : [];
const feeSlabsExact = [
  { hiringType: 'Junior IT roles', rateMin: 8.33, rateMax: 8.33, note: '8.33% of annual CTC', updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Mid-level IT roles', rateMin: 8.33, rateMax: 10, note: '8.33%–10% of annual CTC', updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Senior / niche technology roles', rateMin: 10, rateMax: 12, note: '10%–12% of annual CTC', updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Leadership / executive search', rateMin: 12, rateMax: 15, note: '12%–15% or a negotiated retained fee', retainedAllowed: true, updatedAt: now, updatedBy: 'seed' },
  { hiringType: 'Bulk hiring', rateMin: 0, rateMax: 0, note: 'Negotiated rate based on volume', negotiated: true, updatedAt: now, updatedBy: 'seed' },
];

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
// 12-application stage spread per job: full funnel incl. terminal wins
const stagesPerJob12 = [
  'Applied','Applied','Applied','Screening','Under Review','Shortlisted',
  'Shortlisted','Interview Scheduled','Interview Scheduled','Interview Completed','Offer','Hired',
];
const hiringPlan = [
  ['Junior IT roles', 8.33], ['Mid-level IT roles', 9], ['Mid-level IT roles', 10],
  ['Senior / niche technology roles', 11], ['Senior / niche technology roles', 12],
  ['Leadership / executive search', 13], ['Bulk hiring', 6],
];
// verification mix for 100: 76 Approved + 10 Pending + 5 Invited + 4 Rejected + 5 Suspended
const verifFor = (c) => {
  if (c <= 76) return { verificationStatus: 'Approved', accountStatus: 'Active', status: 'Active', verified: true };
  if (c <= 86) return { verificationStatus: 'Pending', accountStatus: 'Verification Pending', status: 'Active', verified: false };
  if (c <= 91) return { verificationStatus: 'Pending', accountStatus: 'Invited', status: 'Invited', verified: false };
  if (c <= 95) return { verificationStatus: 'Rejected', accountStatus: 'Rejected', status: 'Inactive', verified: false };
  return { verificationStatus: 'Approved', accountStatus: 'Suspended', status: 'Suspended', verified: true };
};

const bak = join(DATA_DIR, `nexatalent.db.json.bak-${Date.now()}`);
if (existsSync(DB_FILE)) { copyFileSync(DB_FILE, bak); console.log('Backup written:', bak); }
else console.log('No existing DB file — seeding from scratch (no backup needed).');

console.log('Hashing seed password once (reused for all users)...');
const pwHash = await bcrypt.hash(SEED_PASSWORD, 10);

const OWNERSHIP = 'Candidate ownership rests with the introducing party for 90 days from submission; the client hires only introduced candidates through the platform.';
const DUPLICATES = 'Duplicate profiles are rejected; the earliest valid submission owns the candidate.';
const CANCELLATION = 'Either party may cancel with written notice; fees already triggered remain payable.';
const REPLACEMENT = (d) => `Free replacement within ${d} days of joining under the defined conditions.`;
const settingsRef = { ...(current.settings || { jwtAccessTokenTtl: '15m', jwtRefreshTokenTtl: '7d' }), payrollRules: { standardHours: 160, overtimeMultiplier: 1.5, payoutPercent: 82, taxRate: 18 } };

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

// ---------- 10 recruitment agencies ----------
const agencySeed = [
  { n: 1, legal: 'TalentBridge Staffing Solutions Pvt Ltd', display: 'Agency Partner 1 · TalentBridge', owner: 'Rohit Iyer', email: 'agency1@nexatalent.demo', phone: '+91-80-41120011', city: 'Bengaluru, Karnataka', addr: '4th Floor, Prestige Towers, Residency Rd, Bengaluru 560025', web: 'https://talentbridge.example.com', cin: 'CIN-U74999KA2019PTC121101', gstin: '29AABCT1011A1Z5', pan: 'PAN-AABCT1011F', spec: 'Engineering, Product', loc: 'Bengaluru, Mumbai', model: 'percentage', mgr: 'operations@nexatalent.com' },
  { n: 2, legal: 'HireNest Consulting Pvt Ltd', display: 'Agency Partner 2 · HireNest', owner: 'Sneha Kulkarni', email: 'agency2@nexatalent.demo', phone: '+91-80-41120022', city: 'Mumbai, Maharashtra', addr: 'Level 8, Trade Center, BKC, Mumbai 400051', web: 'https://hirenest.example.com', cin: 'CIN-U74999MH2020PTC122102', gstin: '27AABCH1022B1Z5', pan: 'PAN-AABCH1022G', spec: 'Engineering, Product, Design', loc: 'Bengaluru, Mumbai, Pune', model: 'percentage', mgr: 'operations@nexatalent.com' },
  { n: 3, legal: 'SkillKart Talent Partners Pvt Ltd', display: 'Agency Partner 3 · SkillKart', owner: 'Arjun Menon', email: 'agency3@nexatalent.demo', phone: '+91-80-41120033', city: 'Hyderabad, Telangana', addr: 'Plot 12, Financial District, Hyderabad 500032', web: 'https://skillkart.example.com', cin: 'CIN-U74999TG2021PTC123103', gstin: '36AABCS1033C1Z5', pan: 'PAN-AABCS1033H', spec: 'Engineering, Data & AI', loc: 'Hyderabad, Bengaluru, Remote - India', model: 'percentage', mgr: 'bda1@nexatalent.com' },
  { n: 4, legal: 'PeopleFirst Search Pvt Ltd', display: 'Agency Partner 4 · PeopleFirst', owner: 'Divya Nair', email: 'agency4@nexatalent.demo', phone: '+91-80-41120044', city: 'Chennai, Tamil Nadu', addr: '2nd Floor, Guindy Industrial Estate, Chennai 600032', web: 'https://peoplefirst.example.com', cin: 'CIN-U74999TN2018PTC124104', gstin: '33AABCP1044D1Z5', pan: 'PAN-AABCP1044J', spec: 'Product, Sales, HR', loc: 'Chennai, Bengaluru', model: 'fixed', mgr: 'bda2@nexatalent.com' },
  { n: 5, legal: 'TechHire India Pvt Ltd', display: 'Agency Partner 5 · TechHire', owner: 'Karan Shah', email: 'agency5@nexatalent.demo', phone: '+91-80-41120055', city: 'Pune, Maharashtra', addr: 'Tower B, Hinjewadi Phase 2, Pune 411057', web: 'https://techhire.example.com', cin: 'CIN-U74999MH2019PTC125105', gstin: '27AABCT1055E1Z5', pan: 'PAN-AABCT1055K', spec: 'Cloud & DevOps, Security', loc: 'Pune, Remote - India', model: 'percentage', mgr: 'operations@nexatalent.com' },
  { n: 6, legal: 'NexaForce Recruitment Pvt Ltd', display: 'Agency Partner 6 · NexaForce', owner: 'Vikram Rao', email: 'agency6@nexatalent.demo', phone: '+91-80-41120066', city: 'Bengaluru, Karnataka', addr: '3rd Floor, MG Road, Bengaluru 560001', web: 'https://nexaforce.example.com', cin: 'CIN-U74999KA2021PTC126106', gstin: '29AABCN1066F1Z5', pan: 'PAN-AABCN1066F', spec: 'Engineering, Data & AI', loc: 'Bengaluru, Hyderabad', model: 'percentage', mgr: 'bda1@nexatalent.com' },
  { n: 7, legal: 'TalentKart Consulting Pvt Ltd', display: 'Agency Partner 7 · TalentKart', owner: 'Pooja Hegde', email: 'agency7@nexatalent.demo', phone: '+91-80-41120077', city: 'Delhi NCR', addr: 'Cyber Hub, Gurugram 122002', web: 'https://talentkart.example.com', cin: 'CIN-U74999DL2020PTC127107', gstin: '06AABCT1077G1Z5', pan: 'PAN-AABCT1077G', spec: 'Product, Design', loc: 'Delhi NCR, Remote - India', model: 'percentage', mgr: 'bda2@nexatalent.com' },
  { n: 8, legal: 'HireWave Solutions Pvt Ltd', display: 'Agency Partner 8 · HireWave', owner: 'Imran Zaidi', email: 'agency8@nexatalent.demo', phone: '+91-80-41120088', city: 'Mumbai, Maharashtra', addr: 'Andheri East, Mumbai 400069', web: 'https://hirewave.example.com', cin: 'CIN-U74999MH2021PTC128108', gstin: '27AABCH1088H1Z5', pan: 'PAN-AABCH1088H', spec: 'Engineering, Sales', loc: 'Mumbai, Pune', model: 'fixed', mgr: 'operations@nexatalent.com' },
  { n: 9, legal: 'SkillBridge Partners Pvt Ltd', display: 'Agency Partner 9 · SkillBridge', owner: 'Nandini Pillai', email: 'agency9@nexatalent.demo', phone: '+91-80-41120099', city: 'Chennai, Tamil Nadu', addr: 'OMR, Chennai 600096', web: 'https://skillbridge.example.com', cin: 'CIN-U74999TN2022PTC129109', gstin: '33AABCS1099J1Z5', pan: 'PAN-AABCS1099J', spec: 'Cloud & DevOps, Data & AI', loc: 'Chennai, Remote - India', model: 'percentage', mgr: 'bda1@nexatalent.com' },
  { n: 10, legal: 'TalentEdge Search Pvt Ltd', display: 'Agency Partner 10 · TalentEdge', owner: 'Rajesh Khanna', email: 'agency10@nexatalent.demo', phone: '+91-80-41120110', city: 'Jaipur, Rajasthan', addr: 'Malviya Nagar, Jaipur 302017', web: 'https://talentedge.example.com', cin: 'CIN-U74999RJ2021PTC130110', gstin: '09AABCT1100K1Z5', pan: 'PAN-AABCT1100K', spec: 'Engineering, HR', loc: 'Jaipur, Delhi NCR', model: 'percentage', mgr: 'bda2@nexatalent.com' },
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
  const rid = `USR-AG-${pad2(a)}-R1`;
  const remail = `arec${a}@nexatalent.demo`;
  db.users.push({ id: rid, name: `Agency Recruiter ${a}`, email: remail, role: 'agency_recruiter', tenantId: tenant, status: 'Active', lastLogin: now });
  db.credentials.push({ userId: rid, email: remail.toLowerCase(), passwordHash: pwHash, algo: 'bcrypt' });
  [
    ['system', 'AGENCY_ONBOARDED', tenant, 'agency', agencyId, 0],
    [ag.email, 'AGENCY_PROFILE_COMPLETED', tenant, 'agency', agencyId, 1],
    ['superadmin@nexatalent.com', 'AGENCY_VERIFIED', tenant, 'agency', agencyId, 2],
    [ag.mgr, 'AGENCY_AGREEMENT_SIGNED', tenant, 'commission_agreement', `AGR-${agencyId}-01`, 3],
    [remail, 'AGENCY_JOB_ASSIGNED', tenant, 'job', `JOB-CMP${pad2(a)}-01`, 5],
    [remail, 'CANDIDATE_SUBMITTED', tenant, 'submission', 'bulk', 6],
  ].forEach(([actor, action, tnt, resource, recordId, off], k) => {
    db.auditLogs.push({ id: `AUD-${agencyId}-${pad2(k + 1)}`, timestamp: addDays('2026-02-08T09:00:00.000Z', a + Number(off)), actor, action, resource, recordId, tenantId: tnt, ipAddress: '127.0.0.1' });
  });
  db.commissionAgreements.push({ id: `AGR-${agencyId}-01`, status: 'Signed', agencyId, orgId: tenant, companyAccepted: true, acceptedAt: '2026-02-09T00:00:00.000Z', acceptedBy: ag.email, effectiveDate: '2026-02-09T00:00:00.000Z', createdAt: now, createdBy: 'superadmin@nexatalent.com', hiringType: 'Senior / niche technology roles', feeModel: 'percentage', rate: 11, basisType: 'annual_ctc', contractMonths: 12, autoApprove: false, trigger: 'Joined', paymentTermsDays: 30, replacementDays: 90, gstApplicable: true, ownershipClause: OWNERSHIP, duplicatePolicy: DUPLICATES, cancellationTerms: CANCELLATION, replacementTerms: REPLACEMENT(90) });
}

// ---------- 100 companies ----------
console.log('Seeding 100 companies (76 verified)...');
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
  const planId = c % 3 === 0 ? 'PLAN-GROWTH' : 'PLAN-ENTERPRISE';
  const price = planId === 'PLAN-GROWTH' ? 14999 : 49999;
  db.subscriptions.push({ id: `SUB-CMP${tag}`, orgId, planId, planVersion: 1, status: 'Active', startDate: '2026-01-01', renewalDate: '2027-01-01', price, currency: 'INR', autoRenew: true, createdAt: now });
  [['candidates.search', 42], ['candidates.profile_view', 18], ['candidates.contact_unlock', 6]].forEach(([ent, qty], k) => {
    db.usageLedger.push({ id: `USG-CMP${tag}-${k}`, orgId, entitlement: ent, qty, billingPeriod: '2026-10', createdAt: now });
  });
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
db.auditLogs.push({ id: 'AUD-SEED-1', timestamp: now, actor: 'system', action: 'ENTERPRISE_SEED_V3_100x25x12', resource: 'system', recordId: '-', tenantId: 'TNT-GLOBAL', ipAddress: '127.0.0.1' });

// ---------- 5000 candidates ----------
console.log('Seeding 5000 candidates...');
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
  const cur = i % 4 !== 0;
  const startY = 2026 - exp, midY = 2026 - Math.max(1, Math.floor(exp / 2));
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
    submittedBy: i % 3 === 0 ? `arec${1 + (i % NUM_AGENCIES)}@nexatalent.demo` : 'self-apply',
    assignedRecruiter: i % 3 === 0 ? `arec${1 + (i % NUM_AGENCIES)}@nexatalent.demo` : `rec@cmp${pad2(1 + (i % NUM_COMPANIES))}.demo`,
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
  db.experiences.push({ id: `EXP-${pad4(i)}-1`, candidateEmail: email, employer: employer1, designation: jrTitle, years: Math.max(1, exp - 2), startDate: `${midY}-04-01`, endDate: null, current: cur, createdAt: now });
  db.experiences.push({ id: `EXP-${pad4(i)}-0`, candidateEmail: email, employer: employer0, designation: `Junior ${jrTitle}`, years: Math.min(exp, 2), startDate: `${startY}-06-01`, endDate: `${midY}-03-31`, current: false, createdAt: now });
  db.educations.push({ id: `EDU-${pad4(i)}`, candidateEmail: email, institution: eduInst, qualification: eduQual, field: eduField, year: eduYear, score: `${7 + (i % 3)}.${(i * 7) % 10} CGPA`, createdAt: now });
  cSkills.forEach((s, k) => db.candidateSkills.push({ id: `CSK-${pad4(i)}-${k}`, candidateEmail: email, skill: s, level: pick(['Intermediate', 'Advanced', 'Expert']) }));
  if (i % 3 === 0) { const [cn, ci] = pick(certPool); db.certifications.push({ id: `CERT-${pad4(i)}`, candidateEmail: email, name: cn, issuer: ci, year: '2024', createdAt: now }); }
  db.documents.push({ id: `DOC-${pad4(i)}`, candidateEmail: email, ownerEmail: email, email, name: `${id}-resume.pdf`, kind: 'resume', mime: 'application/pdf', ref: `resumes/${id}.pdf`, version: 2, uploadedAt: now, createdAt: now });
  if (i % 5 === 0) db.documents.push({ id: `DOC-${pad4(i)}-ID`, candidateEmail: email, ownerEmail: email, email, name: `${id}-id-proof.pdf`, kind: 'id_proof', mime: 'application/pdf', ref: `docs/${id}-id.pdf`, version: 1, uploadedAt: now, createdAt: now });
  db.consents.push({ id: `CON-${pad4(i)}`, candidateEmail: email, email, purpose: 'placement-processing', status: 'granted', marketing: i % 4 === 0, visibility: 'standard', withdrawn: false, withdrawnAt: null, createdAt: now });
  if (i % 1000 === 0) console.log(`  ... ${i}/${NUM_CANDIDATES} candidates`);
}

// ---------- requisitions + jobs + funnel ----------
console.log('Seeding 500 requisitions + 2500 jobs + ~30,000 applications...');
let appSeq = 0, intSeq = 0, offSeq = 0, plcSeq = 0, comSeq = 0, invSeq = 0, subSeq = 0, ctrSeq = 0, tshSeq = 0;
let invoiceCounter = 1000;
const convApps = [];
for (let c = 1; c <= NUM_COMPANIES; c++) {
  const tag = pad2(c);
  const orgId = `TNT-CMP${tag}`;
  const isContract = c >= CONTRACT_FROM;
  // 5 requisitions per company; req 5 is Draft on every 4th company (shows Draft state end-to-end)
  const reqIds = [];
  for (let r = 1; r <= REQS_PER_COMPANY; r++) {
    const reqId = `REQ-CMP${tag}-0${r}`;
    reqIds.push(reqId);
    const isDraftReq = (c % 4 === 0 && r === REQS_PER_COMPANY);
    const reqStatus = isDraftReq ? 'Draft' : (r % 2 === 0 ? 'Sourcing' : 'Approved');
    db.requisitions.push({ id: reqId, orgId, title: `Hiring plan ${r} [${tag}]`, department: pick(['Engineering', 'Product', 'Design', 'Data', 'Sales']), status: reqStatus, openings: 2 + ((c + r) % 5), employmentType: isContract ? 'Contract' : 'Full-time', location: pick(cities), branch: `BR-CMP${tag}-01`, hiringManager: `hm@cmp${tag}.demo`, recruiter: `rec@cmp${tag}.demo`, experienceMin: 2 + ((c + r) % 5), experienceMax: 5 + ((c + r) % 5), deadline: '2027-03-01T00:00:00.000Z', budgetMin: 800000, budgetMax: 2400000, currency: 'INR', payPeriod: isContract ? 'hourly' : 'annual', hiringModel: isContract ? 'contract' : 'direct', createdAt: now });
  }
  for (let j = 1; j <= JOBS_PER_COMPANY; j++) {
    const jtag = pad2(j);
    const [title, dept, coreSkill] = jobRoles[(c + j) % jobRoles.length];
    const reqId = reqIds[(j - 1) % REQS_PER_COMPANY];
    const reqIsDraft = (c % 4 === 0 && reqId.endsWith(`-0${REQS_PER_COMPANY}`));
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
    const jobStatus = reqIsDraft ? 'Draft' : (j % 12 === 11 ? 'Closed' : 'Published');
    db.jobs.push({ id: jobId, requisitionId: reqId, orgId, title: `${title} [${tag}/${jtag}]`, description: `${title} role at company ${tag} (${isContract ? 'contract staffing' : 'direct hire'}). Stack: ${coreSkill}.`, status: jobStatus, visibility: 'public', location: pick(cities), employmentType: empType, payPeriod, salaryMin: salMin, salaryMax: salMax, currency: 'INR', experienceMin: expMin, experienceMax: expMax, requiredSkills: coreSkill, applicantsCount: APPS_PER_JOB, startDate: now, expiryDate: '2027-04-01T00:00:00.000Z', assignedAgencies: [`AGC-${101 + ((c + j) % NUM_AGENCIES)}`], hiringModel: isContract ? 'contract' : 'direct', createdAt: now });
    db.jobSkills.push({ id: `JSK-CMP${tag}-${jtag}`, jobId, skill: coreSkill });

    const agrId = `AGR-CMP${tag}-${jtag}`;
    db.commissionAgreements.push({ id: agrId, status: 'Approved', companyAccepted: true, acceptedAt: '2026-03-01T00:00:00.000Z', acceptedBy: `admin@cmp${tag}.demo`, effectiveDate: '2026-03-01T00:00:00.000Z', createdAt: now, createdBy: 'superadmin@nexatalent.com', orgId, jobId, hiringType, feeModel: 'percentage', rate, basisType: isContract ? 'monthly_ctc' : 'annual_ctc', contractMonths: 12, autoApprove: false, trigger: 'Joined', paymentTermsDays: 30, replacementDays: 90, gstApplicable: true, ownershipClause: OWNERSHIP, duplicatePolicy: DUPLICATES, cancellationTerms: CANCELLATION, replacementTerms: REPLACEMENT(90) });

    const base = ((c - 1) * JOBS_PER_COMPANY + (j - 1)) * 37;
    for (let k = 0; k < APPS_PER_JOB; k++) {
      const candIdx = (base + k * 53) % NUM_CANDIDATES;
      const email = candEmails[candIdx];
      let stage = stagesPerJob12[k];
      if ((c + j) % 4 === 0 && k === APPS_PER_JOB - 1) stage = 'Rejected';
      if ((c + j) % 4 === 1 && k === APPS_PER_JOB - 2) stage = 'Withdrawn';
      appSeq++;
      const appId = `APP-${pad5(appSeq)}`;
      db.applications.push({ id: appId, key: `${jobId}::${email}`, jobId, jobTitle: `${title} [${tag}/${jtag}]`, orgId, requisitionId: reqId, candidateEmail: email, candidateName: candNames[email], stage, source: k % 3 === 0 ? 'agency' : 'direct', createdAt: now, updatedAt: now });
      db.stageHistory.push({ id: `STG-${pad5(appSeq)}`, applicationId: appId, from: 'Applied', to: stage, actor: `rec@cmp${tag}.demo`, createdAt: now });
      if (k % 3 === 0) {
        subSeq++;
        const agN = 101 + ((c + j + k) % NUM_AGENCIES);
        const agTenant = `TNT-AGENCY-${pad2(agN - 100)}`;
        db.submissions.push({ id: `SUBM-${pad5(subSeq)}`, agencyId: agTenant, jobId, orgId, candidateEmail: email, resumeRef: `resumes/CND-${pad4(candIdx + 1)}.pdf`, consentEvidence: 'agency-consent-ref', status: stage === 'Rejected' ? 'Rejected' : stage === 'Hired' ? 'Joined' : 'Under Review', submittedBy: `arec${1 + ((c + j + k) % NUM_AGENCIES)}@nexatalent.demo`, createdAt: now });
      }
      if (stage === 'Interview Scheduled' || stage === 'Interview Completed') {
        const rounds = stage === 'Interview Completed' ? 2 : 1;
        for (let r = 1; r <= rounds; r++) {
          intSeq++;
          db.interviews.push({ id: `INT-${pad5(intSeq)}`, applicationId: appId, jobId, round: `Round ${r}`, scheduledAt: `2026-11-${pad2(1 + ((intSeq + c) % 27))}T10:00:00`, timezone: 'Asia/Kolkata', mode: r % 2 ? 'video' : 'onsite', candidateEmail: email, candidateName: candNames[email], companyId: orgId, orgId, status: stage === 'Interview Completed' ? 'Completed' : 'Scheduled', createdAt: now });
        }
        if (stage === 'Interview Completed') db.feedback.push({ id: `FDB-${pad5(intSeq)}`, applicationId: appId, rating: 3 + ((intSeq + k) % 3), notes: 'Seed feedback: technically strong.', createdAt: now });
        if (stage === 'Interview Scheduled' && convApps.length < 1000) convApps.push({ appId, jobId, orgId, email });
      }
      if (stage === 'Offer' || stage === 'Hired') {
        offSeq++;
        const ctcOffer = salMin + Math.floor(rand() * (salMax - salMin));
        const offStatus = stage === 'Hired' ? 'Accepted' : offSeq % 9 === 0 ? 'Declined' : 'Issued';
        db.offers.push({ id: `OFF-${pad5(offSeq)}`, applicationId: appId, jobId, orgId, candidateEmail: email, ctc: ctcOffer, currency: 'INR', payPeriod, status: offStatus, createdAt: now });
      }
      if (k === APPS_PER_JOB - 1) {
        intSeq++;
        db.interviews.push({ id: `INT-${pad5(intSeq)}`, applicationId: appId, jobId, round: 'Round 1', scheduledAt: '2026-11-05T10:00:00', timezone: 'Asia/Kolkata', mode: 'video', candidateEmail: email, candidateName: candNames[email], companyId: orgId, orgId, status: 'Cancelled', createdAt: now });
      }
      if (stage === 'Hired') {
        plcSeq++;
        const plcId = `PLC-${pad5(plcSeq)}`;
        const feeBasis = isContract ? Math.round(salMin * 160) : salMin + Math.floor(rand() * (salMax - salMin));
        const joinDate = addDays('2026-08-01T00:00:00.000Z', (plcSeq * 7) % 55);
        const dueDate = addDays(joinDate, 30).slice(0, 10);
        db.placements.push({ id: plcId, applicationId: appId, jobId, orgId, candidateEmail: email, candidateName: candNames[email], joinDate, feeBasis, agreementId: agrId, hiringModel: isContract ? 'contract' : 'direct', status: 'Joined', createdAt: now });
        comSeq++;
        const comId = `COM-${pad5(comSeq)}`;
        const gross = Math.round(feeBasis * (rate / 100));
        const tax = Math.round(gross * 0.18);
        invoiceCounter++;
        const invId = `INV-${invoiceCounter}`;
        const invTotal = gross + tax;
        const bucket = comSeq % 10;
        const paid = bucket < 6, partial = bucket === 6;
        const overdue = !paid && !partial && dueDate < '2026-10-11';
        const invStatus = paid ? 'Paid' : partial ? 'Partially Paid' : overdue ? 'Overdue' : 'Issued';
        const amtPaid = paid ? invTotal : partial ? Math.round(invTotal / 2) : 0;
        const agN = 101 + ((c + j + k) % NUM_AGENCIES);
        const agTenant = `TNT-AGENCY-${pad2(agN - 100)}`;
        // Every ~3rd hire is agency-sourced so payable ledgers + payouts stay loaded.
        const agLinked = (k % 3 === 0) || ((c + j) % 3 === 0);
        if (agLinked && k % 3 !== 0) {
          subSeq++;
          db.submissions.push({ id: `SUBM-${pad5(subSeq)}`, agencyId: agTenant, jobId, orgId, candidateEmail: email, resumeRef: `resumes/CND-${pad4(candIdx + 1)}.pdf`, consentEvidence: 'agency-consent-ref', status: 'Joined', submittedBy: `arec${1 + ((c + j + k) % NUM_AGENCIES)}@nexatalent.demo`, createdAt: now });
        }
        db.commissions.push({ id: comId, agreementId: agrId, placementId: plcId, applicationId: appId, jobId, orgId, agencyId: agLinked ? agTenant : null, candidateEmail: email, trigger: 'Joined', triggerDate: joinDate, triggerEvidence: `placement:${plcId}`, feeBasis, basisType: isContract ? 'monthly_ctc' : 'annual_ctc', contractMonths: 12, rate, feeModel: 'percentage', hiringType, agreementSnapshot: { hiringType, rate, feeModel: 'percentage', basisType: isContract ? 'monthly_ctc' : 'annual_ctc', contractMonths: 12, trigger: 'Joined', paymentTermsDays: 30, replacementDays: 90 }, gross, adjustments: 0, tax, total: invTotal, net: invTotal, approvalStatus: 'Approved', paymentStatus: paid ? 'Paid' : 'Unpaid', createdAt: now, approvedAt: now, approvedBy: 'finance@nexatalent.com', invoiceId: invId, invoiceIds: [invId], billedMonths: 1 });
        db.invoices.push({ id: invId, number: `INV-2026-${invoiceCounter}`, orgId, lines: [{ label: `Placement fee (${hiringType}) - ${email}`, qty: 1, unit: gross }], discount: 0, taxRate: 18, dueDate, invoiceType: isContract ? 'contract_placement' : 'placement', subtotal: gross, tax, total: invTotal, amountPaid: amtPaid, balance: invTotal - amtPaid, status: invStatus, issueDate: joinDate, createdAt: now, createdBy: 'finance@nexatalent.com', commissionId: comId });
        db.invoiceLines.push({ id: `INVL-${invoiceCounter}`, invoiceId: invId, label: 'Placement fee', qty: 1, unit: gross });
        if (amtPaid > 0) {
          invSeq++;
          const payId = `PAY-${pad5(invSeq)}`;
          db.payments.push({ id: payId, orgId, invoiceId: invId, amount: amtPaid, provider: 'seed', status: 'succeeded', transactionDate: addDays(joinDate, 20), createdAt: now });
          db.allocations.push({ id: `ALC-${pad5(invSeq)}`, invoiceId: invId, paymentId: payId, amount: amtPaid, createdAt: now });
        } else {
          db.invoiceReminders.push({ id: `RMD-${pad5(comSeq)}`, invoiceId: invId, orgId, channel: 'email', status: 'queued', dueDate, createdAt: now });
        }
        if (agLinked) db.payouts.push({ id: `PO-${pad5(plcSeq)}`, type: 'agency_payout', commissionId: comId, agencyId: agTenant, orgId, amount: Math.round(gross * 0.7), status: paid ? 'Processed' : 'Payable', createdAt: now });
        if (isContract) {
          ctrSeq++;
          const ctrId = `CTR-${pad4(ctrSeq)}`;
          const hourly = salMin + ((ctrSeq * 37) % (salMax - salMin));
          const vTenant = `TNT-VENDOR-0${1 + ((c + j) % NUM_VENDORS)}`;
          db.contractors.push({ id: ctrId, name: candNames[email], candidateEmail: email, skillset: title, clientName: `CMP${tag}`, clientTenant: orgId, vendorTenant: vTenant, placementId: plcId, hourlyRate: hourly, currency: 'INR', startDate: joinDate.slice(0, 10), status: 'Active Deployed', slaScore: `${(97 + (ctrSeq % 3)).toFixed(1)}%`, createdAt: now });
          ['2026-09', '2026-10'].forEach((period) => {
            tshSeq++;
            const hrs = 160 + ((tshSeq * 13) % 25);
            const closed = period === '2026-09';
            db.timesheets.push({ id: `TSH-${pad5(tshSeq)}`, contractorId: ctrId, contractorName: candNames[email], clientName: `CMP${tag}`, clientTenant: orgId, vendorTenant: vTenant, period, hours: hrs, hourlyRate: hourly, billableAmount: hrs * hourly, notes: `${period} staffing`, status: closed ? 'Approved' : 'Submitted', submittedBy: closed ? `arec${1 + ((c + j) % NUM_AGENCIES)}@nexatalent.demo` : email, reviewedBy: closed ? `hm@cmp${tag}.demo` : undefined, reviewedAt: closed ? now : undefined, createdAt: now });
          });
        }
      }
    }
  }
  if (c % 10 === 0) console.log(`  ... ${c}/${NUM_COMPANIES} companies done (apps: ${db.applications.length})`);
}

// Monthly payroll chain (contract cos): Sep = CLOSED run, Oct = OPEN
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
    const payId = `PAY-${pad5(invSeq)}`;
    db.payments.push({ id: payId, orgId, invoiceId: invId, amount: tot, provider: 'seed', status: 'succeeded', transactionDate: `${period}-28T00:00:00.000Z`, createdAt: now });
    db.allocations.push({ id: `ALC-${pad5(invSeq)}`, invoiceId: invId, paymentId: payId, amount: tot, createdAt: now });
  }
  const payoutTotal = Math.round(sub * 0.82);
  db.payouts.push({ id: poId, type: 'contractor_payout', payrollRunId: runId, orgId, period, amount: payoutTotal, status: paid ? 'Processed' : 'Payable', settlementDate: paid ? `${period}-29T00:00:00.000Z` : undefined, createdAt: now, by: 'finance@nexatalent.com' });
  for (const t of sepTs) t.payrollRunId = runId;
  db.payrollRuns.push({ id: runId, orgId, period, timesheetIds: sepTs.map((t) => t.id), subtotal: sub, tax, total: tot, payoutTotal, invoiceId: invId, payoutIds: [poId], status: paid ? 'Settled' : 'Issued', runBy: 'finance@nexatalent.com', createdAt: now, settledAt: paid ? `${period}-29T00:00:00.000Z` : undefined });
  db.auditLogs.push({ id: `AUD-CMP${tag}-PR`, timestamp: `${period}-30T09:00:00.000Z`, actor: 'finance@nexatalent.com', action: 'PAYROLL_RUN', resource: 'payroll', recordId: runId, tenantId: orgId, ipAddress: '127.0.0.1' });
}

// ---------- engagement world ----------
convApps.forEach((ca, i) => {
  const convId = `CON-${pad4(i + 1)}`;
  db.conversations.push({ id: convId, applicationId: ca.appId, jobId: ca.jobId, companyId: ca.orgId, orgId: ca.orgId, candidateId: ca.email, candidateEmail: ca.email, candidateName: candNames[ca.email], status: 'active', createdAt: now, lastMessageAt: now });
  const compTag = ca.orgId.slice(-2);
  [['candidate', ca.email, `Hello, confirming my availability for the scheduled interview.`],
   ['company', `rec@cmp${compTag}.demo`, `Thanks for confirming. The panel link and agenda are shared. Good luck!`],
   ['candidate', ca.email, `Thank you! I have noted the time slot.`]].forEach(([role, sender, body], m) => {
    db.messages.push({ id: `MSG-${pad5(i * 3 + m + 1)}`, conversationId: convId, sender, senderRole: role, type: 'text', body, deliveryStatus: 'delivered', createdAt: now });
  });
});
// talent pools: 2 per company x 10 members (every member resolves to a real profile)
for (let c = 1; c <= NUM_COMPANIES; c++) {
  const tag = pad2(c), orgId = `TNT-CMP${tag}`;
  [['ENG', `${tag} Bench - Engineering`], ['PRD', `${tag} Bench - Product`]].forEach(([suffix, pname], pi) => {
    const poolId = `POOL-CMP${tag}-${suffix}`;
    db.talentPools.push({ id: poolId, orgId, name: pname, description: 'Shortlisted + hired bench', owner: `rec@cmp${tag}.demo`, createdAt: now });
    for (let m = 0; m < 10; m++) {
      const email = candEmails[(c * 41 + pi * 977 + m * 97) % NUM_CANDIDATES];
      db.talentPoolMembers.push({ id: `TPM-CMP${tag}-${suffix}-${m}`, poolId, candidateEmail: email, candidateName: candNames[email], addedBy: `rec@cmp${tag}.demo`, createdAt: now });
    }
  });
}
// saved jobs: 600
for (let s = 0; s < 600; s++) {
  const email = candEmails[(s * 7) % NUM_CANDIDATES];
  const cc = pad2(1 + (s % NUM_COMPANIES)), jj = pad2(1 + ((s * 3) % JOBS_PER_COMPANY));
  db.savedJobs.push({ id: `SAV-${pad4(s + 1)}`, candidateEmail: email, jobId: `JOB-CMP${cc}-${jj}`, createdAt: now });
}
// notifications: bounded 2000 (placement + interview + application)
for (let n = 0; n < 2000; n++) {
  const email = candEmails[(n * 11) % NUM_CANDIDATES];
  const kind = n % 3 === 0 ? 'placement' : n % 3 === 1 ? 'interview' : 'application';
  const cc = pad2(1 + (n % NUM_COMPANIES));
  db.notifications.push({ id: `NOTIF-${pad5(n + 1)}`, recipient: n % 4 === 0 ? `company:TNT-CMP${cc}` : email, kind, body: `Seed ${kind} update for ${email}`, channel: 'in-app', status: n % 5 === 0 ? 'read' : 'queued', createdAt: now, tenantId: `TNT-CMP${cc}` });
}
// outreach campaigns: 40 + recipients + events
for (let c = 1; c <= 40; c++) {
  const tag = pad2(1 + ((c - 1) % NUM_COMPANIES)), orgId = `TNT-CMP${tag}`;
  const campId = `CMP-N-${pad2(c)}`;
  db.campaigns.push({ id: campId, orgId, name: `Oct outreach ${pad2(c)}`, jobId: `JOB-CMP${tag}-01`, status: c % 4 === 0 ? 'Queued' : 'Sent', createdAt: now });
  for (let r = 0; r < 5; r++) {
    const email = candEmails[(c * 31 + r * 53) % NUM_CANDIDATES];
    db.campaignRecipients.push({ id: `CR-${campId}-${r}`, campaignId: campId, candidateEmail: email, status: 'sent', createdAt: now });
    db.campaignEvents.push({ id: `CE-${campId}-${r}`, campaignId: campId, recipientId: `CR-${campId}-${r}`, event: r % 3 === 0 ? 'opened' : 'delivered', createdAt: now });
  }
}
// sales world: 150 leads + activities, 80 opportunities, 60 proposals, 120 meetings, 6 targets, 300 tasks
const leadStages = ['New', 'Contacted', 'Qualified', 'Discovery Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurture'];
for (let l = 1; l <= 150; l++) {
  const stage = leadStages[l % leadStages.length];
  const owned = l % 2 ? 'bda1@nexatalent.com' : 'bda2@nexatalent.com';
  const linked = l <= 100 ? `TNT-CMP${pad2(((l - 1) % NUM_COMPANIES) + 1)}` : null;
  const lid = `LEAD-${pad3(l)}`;
  db.leads.push({ id: lid, contactName: `${pick(firstNames)} ${pick(lastNames)}`, companyName: l <= 100 ? `Seed account ${l}` : `Prospect ${l} ${pick(industries)}`, email: `lead${l}@example.com`, stage, owner: owned, value: 200000 + ((l * 53000) % 1800000), currency: 'INR', nextFollowUp: addDays('2026-10-11T00:00:00.000Z', (l % 14) + 1).slice(0, 10), orgId: linked, createdAt: now });
  [0, 1].forEach((a) => db.leadActivities.push({ id: `LA-${lid}-${a}`, leadId: lid, type: a ? 'follow-up' : 'call', outcome: a ? 'Interested' : 'Connected', notes: `Seed activity ${a} for ${lid}`, owner: owned, createdAt: now }));
  if (l <= 80) db.opportunities.push({ id: `OPP-${pad3(l)}`, leadId: lid, orgId: linked, stage: stage === 'Won' ? 'Closed Won' : 'Open', value: 200000 + ((l * 53000) % 1800000), currency: 'INR', owner: owned, createdAt: now });
  if (l <= 60) db.proposals.push({ id: `PRP-${pad3(l)}`, leadId: lid, orgId: linked, title: `Staffing proposal ${l}`, value: 300000 + ((l * 71000) % 1500000), currency: 'INR', status: l % 3 === 0 ? 'Sent' : l % 3 === 1 ? 'Accepted' : 'Draft', owner: owned, createdAt: now });
}
for (let m = 1; m <= 120; m++) {
  db.meetings.push({ id: `MTG-${pad3(m)}`, leadId: `LEAD-${pad3(((m - 1) % 150) + 1)}`, title: `Discovery call ${m}`, date: addDays('2026-10-11T00:00:00.000Z', (m % 20) - 5), outcome: m % 4 === 0 ? 'No-show' : 'Held', owner: m % 2 ? 'bda1@nexatalent.com' : 'bda2@nexatalent.com', createdAt: now });
}
[['bda1@nexatalent.com', 'Q4 pipeline', 50], ['bda2@nexatalent.com', 'Q4 pipeline', 50], ['bda1@nexatalent.com', 'Q4 revenue', 2000000], ['bda2@nexatalent.com', 'Q4 revenue', 2000000], ['operations@nexatalent.com', 'Q4 placements', 120], ['recruiter2@nexatalent.com', 'Q4 screenings', 400]].forEach(([owner, title, target], i) => {
  db.targets.push({ id: `TGT-${i + 1}`, owner, title, target, period: '2026-Q4', createdAt: now });
});
for (let t = 1; t <= 300; t++) {
  const cc = pad2(1 + (t % NUM_COMPANIES));
  db.tasks.push({ id: `TSK-${pad4(t + 700)}`, title: `Seed follow-up ${t} for CMP${cc}`, client: `CMP${cc}`, priority: t % 3 === 0 ? 'High' : 'Medium', dueDate: addDays('2026-10-11T00:00:00.000Z', (t % 10) - 3).slice(0, 10), status: t % 4 === 0 ? 'Done' : 'Pending', owner: t % 2 ? 'operations@nexatalent.com' : `rec@cmp${cc}.demo`, createdAt: now });
}
// 5 staffing vendors
const vendorSeed = [
  { n: 1, legal: 'CloudServe Staffing India Pvt Ltd', display: 'Staffing Vendor 1 · CloudServe', owner: 'Meera Krishnan', phone: '+91-40-41120311', addr: 'Plot 8, HITEC City, Hyderabad 500081', web: 'https://cloudserve.example.com' },
  { n: 2, legal: 'SecureStack Vendors Pvt Ltd', display: 'Staffing Vendor 2 · SecureStack', owner: 'Farhan Qureshi', phone: '+91-40-41120322', addr: 'Level 5, Cyber Towers, Hyderabad 500081', web: 'https://securestack.example.com' },
  { n: 3, legal: 'RemoteCrew Solutions Pvt Ltd', display: 'Staffing Vendor 3 · RemoteCrew', owner: 'Anita Desai', phone: '+91-40-41120333', addr: 'Banjara Hills Rd 12, Hyderabad 500034', web: 'https://remotecrew.example.com' },
  { n: 4, legal: 'FlexiStaff Contracts Pvt Ltd', display: 'Staffing Vendor 4 · FlexiStaff', owner: 'Kunal Deshmukh', phone: '+91-40-41120344', addr: 'Madhapur, Hyderabad 500081', web: 'https://flexistaff.example.com' },
  { n: 5, legal: 'GigBridge Workforce Pvt Ltd', display: 'Staffing Vendor 5 · GigBridge', owner: 'Ritu Malhotra', phone: '+91-40-41120355', addr: 'Kondapur, Hyderabad 500084', web: 'https://gigbridge.example.com' },
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
// finance extras: credit notes, refunds, commission adjustments (placement-linked)
for (let x = 1; x <= 20; x++) {
  const cc = pad2(x);
  const invRef = db.invoices.find((i) => i.orgId === `TNT-CMP${cc}`)?.id || `INV-100${x}`;
  const payRef = db.payments.find((p) => p.orgId === `TNT-CMP${cc}`)?.id || `PAY-000${x}`;
  db.creditNotes.push({ id: `CN-${pad2(x)}`, orgId: `TNT-CMP${cc}`, invoiceId: invRef, amount: 2000 + x * 100, reason: 'Goodwill adjustment', status: x % 3 === 0 ? 'Applied' : 'Issued', createdAt: now });
  db.commissionAdjustments.push({ id: `ADJ-${pad2(x)}`, commissionId: `COM-${pad5(x * 7)}`, amount: -500, reason: 'Volume goodwill', createdBy: 'finance@nexatalent.com', createdAt: now });
  if (x <= 10) db.refunds.push({ id: `REF-${pad2(x)}`, orgId: `TNT-CMP${cc}`, paymentId: payRef, amount: 1000 * x, status: 'succeeded', createdAt: now });
  db.reconciliations.push({ id: `REC-${pad2(x)}`, orgId: `TNT-CMP${cc}`, invoiceId: invRef, status: x % 2 ? 'Reconciled' : 'Pending', reconciledBy: 'finance@nexatalent.com', createdAt: now });
}
// zero-empty-data fillers: support tickets, info/privacy requests, notif prefs, compliance
{
  const tStates = ['Open', 'In Progress', 'Resolved', 'Closed'];
  for (let s = 1; s <= 80; s++) {
    const cc = pad2(1 + (s % NUM_COMPANIES));
    db.supportTickets.push({ id: `SUP-${pad3(s)}`, orgId: `TNT-CMP${cc}`, subject: `Seed issue ${s} for CMP${cc}`, description: 'Seeded support ticket covering all states.', status: tStates[s % 4], priority: s % 3 === 0 ? 'High' : 'Medium', requester: `admin@cmp${cc}.demo`, assignee: 'operations@nexatalent.com', createdAt: now, updatedAt: now });
  }
  for (let n = 1; n <= 30; n++) {
    const email = candEmails[(n * 37) % NUM_CANDIDATES];
    const cid = `CND-${pad4((n * 37) % NUM_CANDIDATES + 1)}`;
    db.candidateInfoRequests.push({ id: `CIR-${pad2(n)}`, candidateId: cid, candidateEmail: email, email, candidateName: candNames[email], requester: 'operations@nexatalent.com', by: 'operations@nexatalent.com', message: n % 2 ? 'Please upload your latest payslip + ID proof for verification.' : 'Please confirm your notice period and earliest joining date.', status: n % 3 === 0 ? 'Responded' : n % 3 === 1 ? 'Open' : 'Closed', createdAt: now });
    db.privacyRequests.push({ id: `PRV-${pad2(n)}`, candidateId: cid, candidateEmail: email, email, candidateName: candNames[email], type: n % 2 ? 'export' : 'delete', reason: n % 2 ? 'Candidate requested a copy of personal data.' : 'Right-to-erasure verification sample.', status: n % 4 === 0 ? 'Completed' : n % 4 === 1 ? 'Pending' : 'Approved', by: 'operations@nexatalent.com', decidedBy: n % 4 === 1 ? null : 'superadmin@nexatalent.com', decidedAt: n % 4 === 1 ? null : now, createdAt: now });
    db.notificationPrefs.push({ id: `NP-${pad2(n)}`, userEmail: email, channel: 'in-app', enabled: true, createdAt: now });
  }
  for (let c = 1; c <= 20; c++) {
    const tag = pad2(c + 80);
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
  leads: db.leads.length, tasks: db.tasks.length, pools: db.talentPools.length, poolMembers: db.talentPoolMembers.length,
  audits: db.auditLogs.length,
}, null, 2));

console.log('Writing DB file...');
writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
console.log('DONE. DB:', DB_FILE);
console.log('Logins (all password NexaDemo2026!): superadmin@nexatalent.com | operations@nexatalent.com | recruiter2@nexatalent.com | bda1@nexatalent.com | bda2@nexatalent.com | finance@nexatalent.com | admin@cmp01.demo | hm@cmp01.demo | rec@cmp01.demo | agency1@nexatalent.demo | arec1@nexatalent.demo | vendor1@nexatalent.demo | candidate1@nexatalent.demo');
