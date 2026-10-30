const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'nexatalent.db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const email = 'candidate@nexatalent.com';
const userId = 'USR-106';

// 1. UPDATE USER
const u = db.users.find(x => x.email === email);
if (u) {
  u.name = 'Siddharth Nair';
  u.fullName = 'Siddharth Nair';
  u.emailVerified = true;
  u.status = 'Active';
}

// 2. CANDIDATE PROFILE
let cp = db.candidateProfiles.find(x => x.email === email || x.userId === userId);
if (!cp) {
  cp = { id: 'CND-CANDIDATE-01', email, userId };
  db.candidateProfiles.unshift(cp);
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

// 3. APPLICATIONS
if (!db.applications) db.applications = [];
db.applications = db.applications.filter(a => a.candidateEmail !== email && a.candidateId !== userId);

const seededApps = [
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
];

db.applications.unshift(...seededApps);

// 4. INTERVIEWS
if (!db.interviews) db.interviews = [];
db.interviews = db.interviews.filter(i => i.candidateEmail !== email && i.candidateId !== userId);

const seededInterviews = [
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
];

db.interviews.unshift(...seededInterviews);

// 5. SAVED JOBS
if (!db.savedJobs) db.savedJobs = [];
db.savedJobs = db.savedJobs.filter(s => s.candidateEmail !== email && s.userId !== userId);

const seededSaved = [
  {
    id: 'SAVE-CAND-01',
    key: 'JOB-MVSZJZML2746::' + email,
    jobId: 'JOB-MVSZJZML2746',
    candidateEmail: email,
    userId,
    createdAt: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'SAVE-CAND-02',
    key: 'JOB-MVSZJYBO1613::' + email,
    jobId: 'JOB-MVSZJYBO1613',
    candidateEmail: email,
    userId,
    createdAt: '2026-10-21T11:30:00.000Z'
  },
  {
    id: 'SAVE-CAND-03',
    key: 'JOB-9901::' + email,
    jobId: 'JOB-9901',
    candidateEmail: email,
    userId,
    createdAt: '2026-10-23T14:15:00.000Z'
  },
  {
    id: 'SAVE-CAND-04',
    key: 'JOB-8890::' + email,
    jobId: 'JOB-8890',
    candidateEmail: email,
    userId,
    createdAt: '2026-10-25T09:45:00.000Z'
  }
];

db.savedJobs.unshift(...seededSaved);

// 6. OFFERS
if (!db.offers) db.offers = [];
db.offers = db.offers.filter(o => o.candidateEmail !== email);

const seededOffers = [
  {
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
  }
];

db.offers.unshift(...seededOffers);

// 7. DOCUMENTS
if (!db.documents) db.documents = [];
db.documents = db.documents.filter(d => d.ownerEmail !== email && d.candidateEmail !== email);

const seededDocs = [
  {
    id: 'DOC-RESUME-01',
    name: 'Siddharth_Nair_Executive_CV_2026.pdf',
    mime: 'application/pdf',
    size: 64280,
    version: 3,
    kind: 'resume',
    ownerEmail: email,
    candidateEmail: email,
    orgId: 'TNT-CANDIDATE',
    uploadedAt: '2026-10-25T10:00:00.000Z',
    uploadedBy: email,
    status: 'Verified',
    verifiedAt: '2026-10-25T11:00:00.000Z'
  },
  {
    id: 'DOC-OFFER-CAND-01',
    name: 'Formal_Appointment_Letter_FintechScaleOps_42LPA.pdf',
    mime: 'application/pdf',
    size: 142800,
    version: 1,
    kind: 'offer_letter',
    ownerEmail: email,
    candidateEmail: email,
    orgId: 'TNT-9011',
    uploadedAt: '2026-10-27T16:30:00.000Z',
    uploadedBy: 'aditi@fintechscaleops.io',
    status: 'Signed & Executed'
  },
  {
    id: 'DOC-NDA-01',
    name: 'Client_Confidentiality_NDA_FintechScaleOps.pdf',
    mime: 'application/pdf',
    size: 88400,
    version: 1,
    kind: 'compliance',
    ownerEmail: email,
    candidateEmail: email,
    orgId: 'TNT-9011',
    uploadedAt: '2026-10-20T12:00:00.000Z',
    uploadedBy: email,
    status: 'Verified'
  },
  {
    id: 'DOC-ID-01',
    name: 'Government_KYC_Proof_Aadhaar_PAN.pdf',
    mime: 'application/pdf',
    size: 45200,
    version: 1,
    kind: 'kyc',
    ownerEmail: email,
    candidateEmail: email,
    orgId: 'TNT-CANDIDATE',
    uploadedAt: '2026-10-18T07:10:00.000Z',
    uploadedBy: email,
    status: 'Verified'
  },
  {
    id: 'DOC-EXP-01',
    name: 'Service_Relieving_Letter_Razorpay.pdf',
    mime: 'application/pdf',
    size: 110500,
    version: 1,
    kind: 'experience_letter',
    ownerEmail: email,
    candidateEmail: email,
    orgId: 'TNT-CANDIDATE',
    uploadedAt: '2026-10-18T07:12:00.000Z',
    uploadedBy: email,
    status: 'Verified'
  },
  {
    id: 'DOC-DEGREE-01',
    name: 'BTech_Degree_Certificate_NITK_Surathkal.pdf',
    mime: 'application/pdf',
    size: 180200,
    version: 1,
    kind: 'education_certificate',
    ownerEmail: email,
    candidateEmail: email,
    orgId: 'TNT-CANDIDATE',
    uploadedAt: '2026-10-18T07:15:00.000Z',
    uploadedBy: email,
    status: 'Verified'
  }
];

db.documents.unshift(...seededDocs);

// 8. CONVERSATIONS & MESSAGES
if (!db.conversations) db.conversations = [];
if (!db.messages) db.messages = [];
db.conversations = db.conversations.filter(c => c.candidateEmail !== email && c.candidateId !== email);
db.messages = db.messages.filter(m => m.sender !== email && !(m.conversationId && m.conversationId.startsWith('CNV-CAND-')));

const conv1 = {
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
};

const conv2 = {
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
};

db.conversations.unshift(conv1, conv2);

const msgs = [
  {
    id: 'MSG-CAND-101',
    conversationId: 'CNV-CAND-01',
    sender: 'aditi@fintechscaleops.io',
    senderName: 'Aditi Sharma',
    body: 'Hi Siddharth, congratulations on clearing the first round! We were very impressed by your Redis concurrency examples.',
    createdAt: '2026-10-26T10:15:00.000Z'
  },
  {
    id: 'MSG-CAND-102',
    conversationId: 'CNV-CAND-01',
    sender: email,
    senderName: 'Siddharth Nair',
    body: 'Thank you Aditi! I really enjoyed discussing the distributed idempotency challenges.',
    createdAt: '2026-10-26T10:30:00.000Z'
  },
  {
    id: 'MSG-CAND-103',
    conversationId: 'CNV-CAND-01',
    sender: 'aditi@fintechscaleops.io',
    senderName: 'Aditi Sharma',
    body: 'I have scheduled our Round 2 Architecture Deep Dive for tomorrow at 2:30 PM via Google Meet.',
    createdAt: '2026-10-28T15:45:00.000Z'
  },
  {
    id: 'MSG-CAND-104',
    conversationId: 'CNV-CAND-01',
    sender: email,
    senderName: 'Siddharth Nair',
    body: 'Looking forward to our technical deep dive session tomorrow at 2:30 PM!',
    createdAt: '2026-10-28T16:00:00.000Z'
  },
  {
    id: 'MSG-CAND-201',
    conversationId: 'CNV-CAND-02',
    sender: 'vikram@apextechsearch.com',
    senderName: 'Vikram Malhotra',
    body: 'Hello Siddharth, great news! The executive committee has formally approved your offer for the Senior DevOps & Cloud role.',
    createdAt: '2026-10-27T16:45:00.000Z'
  },
  {
    id: 'MSG-CAND-202',
    conversationId: 'CNV-CAND-02',
    sender: 'vikram@apextechsearch.com',
    senderName: 'Vikram Malhotra',
    body: 'I have attached the formal appointment letter with ₹42 LPA total CTC. Please review!',
    createdAt: '2026-10-27T17:15:00.000Z'
  }
];

db.messages.unshift(...msgs);

// 9. NOTIFICATIONS
if (!db.notifications) db.notifications = [];
db.notifications = db.notifications.filter(n => n.recipient !== email);

const seededNotifs = [
  {
    id: 'NOTIF-CAND-01',
    recipient: email,
    kind: 'offer',
    body: '🎉 Formal Offer Extended: Fintech ScaleOps extended an offer of ₹42,00,000 / year for Senior DevOps & Cloud Infrastructure Architect.',
    channel: 'in-app',
    status: 'queued',
    createdAt: '2026-10-27T16:30:00.000Z',
    tenantId: 'TNT-9011'
  },
  {
    id: 'NOTIF-CAND-02',
    recipient: email,
    kind: 'interview',
    body: '📅 Interview Scheduled: Round 2 Technical Architecture Deep Dive with Aditi Sharma on Oct 30, 2026 at 2:30 PM.',
    channel: 'in-app',
    status: 'queued',
    createdAt: '2026-10-26T12:00:00.000Z',
    tenantId: 'TNT-9011'
  },
  {
    id: 'NOTIF-CAND-03',
    recipient: email,
    kind: 'timesheet',
    body: '✅ Timesheet Approved: Week 42 (42 hours, ₹1,17,600) was approved by Aditi Sharma.',
    channel: 'in-app',
    status: 'queued',
    createdAt: '2026-10-20T11:15:00.000Z',
    tenantId: 'TNT-9011'
  },
  {
    id: 'NOTIF-CAND-04',
    recipient: email,
    kind: 'application',
    body: '🚀 Application Update: Your application for Senior Full Stack Cloud Engineer moved to Interview Scheduled.',
    channel: 'in-app',
    status: 'queued',
    createdAt: '2026-10-18T14:00:00.000Z',
    tenantId: 'TNT-9011'
  }
];

db.notifications.unshift(...seededNotifs);

// 10. CONSENTS
if (!db.consents) db.consents = [];
db.consents = db.consents.filter(c => c.email !== email);
db.consents.unshift({
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

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully seeded 100% complete data for candidate@nexatalent.com across ALL routes!');
