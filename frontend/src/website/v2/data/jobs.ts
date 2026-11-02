/** NexaTalent public job board — full mandate data for detail pages. */

export type V2Job = {
  slug: string;
  title: string;
  category: string;
  type: string;
  posted: string;
  salary: string;
  location: string;
  domain: string;
  premium: boolean;
  experience: string;
  workMode: string;
  department: string;
  clientType: string;
  summary: string;
  aboutCompany: string;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  interviewStages: { name: string; duration: string; focus: string }[];
  noticePeriod?: string;
  openings?: number;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  applyInstructions?: string[];
};

export const V2_JOBS: V2Job[] = [
  {
    slug: 'full-stack-developer-golang-react-gcp',
    title: 'Full Stack Developer | Golang + React.js + GCP + BigQuery',
    category: 'Engineering',
    type: 'Permanent',
    posted: 'Just now',
    salary: '',
    location: 'Pune',
    domain: 'Cloud & Enterprise',
    premium: true,
    experience: '6–7 yrs',
    workMode: 'Hybrid',
    department: 'Full Stack & Cloud Engineering',
    clientType: 'Enterprise Cloud & Scalable Product Engineering',
    noticePeriod: 'Immediate Joiners Only',
    openings: 1,
    contactEmail: 'info@nexatalentitsolutions.com',
    contactPhone: '+91 70196 96166',
    contactWhatsapp: '+91 9036227317',
    summary:
      'We are looking for a highly skilled Full Stack Developer with strong hands-on experience in backend development, frontend technologies, cloud platforms, and scalable product engineering using Golang, React.js, GCP, and BigQuery. ⚡ IMPORTANT: Immediate joiners only.',
    aboutCompany:
      'NexaTalent IT Solutions is hiring for a high-impact engineering team based in Pune, India. The team designs and delivers resilient, cloud-native enterprise products, distributed microservices in Go, modern interactive React interfaces, and large-scale data processing engines on GCP & BigQuery.',
    skills: [
      'Golang (Go)',
      'React.js',
      'Google Cloud Platform (GCP)',
      'Google BigQuery',
      'REST APIs',
      'Microservices',
      'Distributed Systems',
      'JavaScript / TypeScript',
      'SQL & Database Concepts',
      'CI/CD & Cloud Deployment',
      'Docker & Kubernetes',
      'Cloud Run',
      'GKE',
      'Pub/Sub',
      'Cloud Storage',
      'Cloud SQL',
      'Cloud Functions',
      'System Design & Scalable Architecture',
      'DevOps & Production Support',
      'Agile / Scrum',
    ],
    responsibilities: [
      'Design, develop, and maintain scalable full-stack applications using Golang and React.js.',
      'Build robust backend services, REST APIs, and microservices.',
      'Develop responsive, user-friendly web applications.',
      'Implement data solutions using Google BigQuery.',
      'Deploy and manage applications on Google Cloud Platform.',
      'Own features throughout the complete Product Development Life Cycle (PDLC).',
      'Gather business requirements and translate them into technical solutions.',
      'Collaborate directly with customers and cross-functional teams.',
      'Drive technical solutions from conception to production.',
      'Troubleshoot production issues and optimize performance, scalability, and reliability.',
      'Contribute to code reviews, system design, and architecture discussions.',
    ],
    requirements: [
      'Experience: 6–7 Years of full-stack engineering experience.',
      'Golang (Go) – Strong backend development expertise, REST APIs, and microservices.',
      'React.js – Advanced frontend development experience with JavaScript / TypeScript.',
      'Google Cloud Platform (GCP) – Cloud deployment, configuration, and production operations.',
      'Google BigQuery – Implementing data solutions, SQL, and database concepts.',
      'REST APIs, Microservices & Distributed Systems architecture.',
      'CI/CD & Cloud Deployment automation.',
      'Excellent problem-solving and analytical skills.',
      'Strong system design and architectural understanding.',
      'Experience in customer interaction and requirement gathering.',
      'Ability to independently drive technical requirements and deliver solutions.',
      'Confidence in handling challenging technical interviews.',
      '⚡ IMPORTANT: Immediate joiners only. Candidates must have strong hands-on technical expertise and be available to join immediately.',
    ],
    niceToHave: [
      'Docker & Kubernetes container orchestration.',
      'GCP services: Cloud Run, GKE, Pub/Sub, Cloud Storage, Cloud SQL, Cloud Functions.',
      'System Design & Scalable Architecture for high-throughput production workloads.',
      'DevOps, Monitoring, Logging & Production Support.',
      'Agile / Scrum methodologies.',
    ],
    benefits: [
      'Hybrid work mode in Pune with high-trust engineering culture',
      'Direct ownership of enterprise-grade cloud-native platforms',
      'Comprehensive health coverage and performance incentives',
      'Fast-track interview process with immediate offer rollout for qualified joiners',
    ],
    interviewStages: [
      { name: 'Profile Screen & Alignment', duration: '30 min', focus: 'Role fit, Go + React background, notice period & immediate availability' },
      { name: 'Technical & System Design', duration: '60 min', focus: 'Golang microservices, React state, GCP & BigQuery architecture' },
      { name: 'Leadership & Feature Ownership', duration: '45 min', focus: 'Product lifecycle, customer collaboration, problem solving' },
      { name: 'Offer & Expedited Onboarding', duration: '24–48 hrs', focus: 'Expedited onboarding and immediate joining' },
    ],
    applyInstructions: [
      'Email Subject: Full Stack Developer – Pune – 6–7 Years',
      'Relevant Technical Experience (Golang, React.js, GCP, BigQuery)',
      'Current Location (Pune / Hybrid)',
      'Availability to join (Immediate joiners only)',
    ],
  },
  {
    slug: 'full-stack-developer-golang-react',
    title: 'Full Stack Developer | Golang + React.js + GCP',
    category: 'Engineering',
    type: 'Permanent',
    posted: 'Recent',
    salary: '',
    location: 'Pune',
    domain: 'Cloud & Enterprise',
    premium: true,
    experience: '6–7 yrs',
    workMode: 'Hybrid',
    department: 'Full Stack & Cloud Engineering',
    clientType: 'Enterprise Cloud & Data Solutions',
    noticePeriod: 'Immediate Joiners or Within 1 Week',
    openings: 1,
    contactEmail: 'info@nexatalentitsolutions.com',
    contactPhone: '+91 70196 96166',
    contactWhatsapp: '+91 9036227317',
    summary:
      'We are looking for an experienced Full Stack Developer with strong expertise in Golang, React.js, Google Cloud Platform (GCP), and BigQuery to develop scalable, cloud-native applications and enterprise-grade solutions. Priority for immediate joiners and candidates who can join within 1 week / 7 days.',
    aboutCompany:
      'NexaTalent IT Solutions is hiring for a high-impact engineering team based in Pune, India. The team designs and delivers resilient, cloud-native enterprise products, distributed microservices in Go, modern interactive React interfaces, and large-scale data processing engines on GCP & BigQuery.',
    skills: [
      'Golang (Go)',
      'React.js',
      'Google Cloud Platform (GCP)',
      'BigQuery',
      'REST APIs',
      'Microservices',
      'Distributed Systems',
      'JavaScript / TypeScript',
      'HTML / CSS',
      'SQL',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'System Design',
      'Cloud Run',
      'GKE',
      'Cloud Functions',
    ],
    responsibilities: [
      'Design and develop scalable full-stack applications using Go and React.js.',
      'Build robust APIs, microservices, and cloud-based data solutions on GCP.',
      'Translate business requirements into high-performance technical specifications and scalable system architectures.',
      'Collaborate with customers, product managers, architects, QA, and DevOps teams across the engineering lifecycle.',
      'Drive features through the complete Product Development Life Cycle (PDLC) from conception to production deployment.',
      'Troubleshoot production issues, ensure high availability, and optimize application latency and database performance.',
    ],
    requirements: [
      '6–7 years of professional full-stack development experience with Golang and React.js.',
      'Strong hands-on expertise in Golang (Go), building REST APIs, microservices, and distributed systems.',
      'Proficiency in React.js, JavaScript/TypeScript, modern HTML/CSS, and state management.',
      'Practical production experience with Google Cloud Platform (GCP) (Cloud Run, GKE, Cloud Functions).',
      'Hands-on experience with BigQuery, SQL, and large-scale data processing pipelines.',
      'Experience with containerization and orchestration using Docker, Kubernetes, and automated CI/CD pipelines.',
      'Excellent problem-solving, system design, scalability, and analytical skills.',
      '⚡ IMPORTANT: Immediate joiners or candidates who can join within 1 week / 7 days (Top Priority).',
    ],
    niceToHave: [
      'Strong customer interaction and stakeholder management capabilities.',
      'Ability to independently own features from conception to production.',
      'Performance tuning and query optimization for high-volume BigQuery datasets.',
      'Experience with cloud monitoring, logging, and distributed tracing in GCP.',
    ],
    benefits: [
      'Hybrid work mode in Pune with collaborative engineering culture',
      'Direct ownership of enterprise-grade cloud-native platforms',
      'Comprehensive health coverage and performance incentives',
      'Fast-track interview process with immediate offer rollout for qualified joiners',
    ],
    interviewStages: [
      { name: 'Profile Screen & Alignment', duration: '30 min', focus: 'Role fit, Go + React background, notice period & immediate availability' },
      { name: 'Technical & System Design', duration: '60 min', focus: 'Golang microservices, React state, GCP & BigQuery architecture' },
      { name: 'Leadership & Feature Ownership', duration: '45 min', focus: 'Product lifecycle, stakeholder collaboration, problem solving' },
      { name: 'Offer & Expedited Onboarding', duration: '48 hrs', focus: 'Expedited 1-week joining' },
    ],
    applyInstructions: [
      'Total Experience',
      'Relevant Experience in Go, React.js, GCP & BigQuery',
      'Current Location (Pune / Hybrid)',
      'Notice Period / Earliest Joining Date (Immediate or within 1 week)',
    ],
  },
];

export function getV2Job(slug?: string) {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().replace(/\/$/, '').trim();
  
  // Direct match
  const found = V2_JOBS.find((j) => j.slug.toLowerCase() === clean);
  if (found) return found;

  // Aliases for Pune Golang jobs
  if (
    clean === 'full-stack-developer-golang-react' ||
    clean === 'full-stack-developer-golang-react-gcp-1' ||
    clean === 'full-stack-developer-golang-react-pune' ||
    clean === 'job-golang-react-01'
  ) {
    return V2_JOBS.find((j) => j.slug === 'full-stack-developer-golang-react');
  }

  if (
    clean === 'full-stack-developer-golang-react-gcp' ||
    clean === 'full-stack-developer-golang-react-gcp-bigquery' ||
    clean === 'job-golang-react-pune'
  ) {
    return V2_JOBS.find((j) => j.slug === 'full-stack-developer-golang-react-gcp');
  }

  return undefined;
}
