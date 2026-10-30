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
    title: 'Full Stack Developer | Golang + React.js + GCP',
    category: 'Engineering',
    type: 'Permanent',
    posted: 'Today',
    salary: 'Competitive CTC',
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
      'Notice Period: Immediate joiners or candidates who can join within 1 week / 7 days (Top Priority).',
    ],
    niceToHave: [
      'Strong customer interaction and stakeholder management capabilities.',
      'Ability to independently own features from conception to production.',
      'Performance tuning and query optimization for high-volume BigQuery datasets.',
      'Experience with cloud monitoring, logging, and distributed tracing in GCP.',
    ],
    benefits: [
      'Competitive CTC — tailored to experience, technical expertise, current CTC, and interview performance',
      'Hybrid work mode in Pune with collaborative engineering culture',
      'Direct ownership of enterprise-grade cloud-native platforms',
      'Comprehensive health coverage and performance incentives',
      'Fast-track interview process with immediate offer rollout for qualified joiners',
    ],
    interviewStages: [
      { name: 'Profile Screen & Alignment', duration: '30 min', focus: 'Role fit, Go + React background, notice period & CTC' },
      { name: 'Technical & System Design', duration: '60 min', focus: 'Golang microservices, React state, GCP & BigQuery architecture' },
      { name: 'Leadership & Feature Ownership', duration: '45 min', focus: 'Product lifecycle, stakeholder collaboration, problem solving' },
      { name: 'Offer & Expedited Onboarding', duration: '48 hrs', focus: 'Final CTC rollout and expedited 1-week joining' },
    ],
    applyInstructions: [
      'Total Experience',
      'Relevant Experience in Go, React.js, GCP & BigQuery',
      'Current CTC',
      'Expected CTC',
      'Notice Period / Earliest Joining Date',
      'Current Location',
    ],
  },
  {
    slug: 'senior-backend-engineer-java',
    title: 'Senior Backend Engineer (Java)',
    category: 'Engineering',
    type: 'Permanent',
    posted: '2 days ago',
    salary: '₹28–42 LPA',
    location: 'Bengaluru',
    domain: 'SaaS & Product',
    premium: false,
    experience: '5–8 yrs',
    workMode: 'Hybrid',
    department: 'Engineering',
    clientType: 'High-growth B2B SaaS product company',
    summary:
      'Own core service development for a multi-tenant platform serving 2M+ daily active users. You will design APIs, lead performance tuning and mentor mid-level engineers across two squads.',
    aboutCompany:
      'A product-company building workflow automation software used by enterprises across India, SEA and the Middle East. Engineering-led culture, quarterly hackathons, and a genuine buy-versus-build philosophy.',
    skills: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Redis', 'AWS'],
    responsibilities: [
      'Design and ship REST/gRPC services powering the core workflow engine.',
      'Lead performance tuning of high-throughput batch and streaming pipelines.',
      'Own service-level objectives: latency, error budgets and on-call runbooks.',
      'Review architecture decisions and mentor mid-level engineers.',
      'Partner with product to scope deliveries in two-week increments.',
    ],
    requirements: [
      '5+ years building production backend systems in Java.',
      'Strong grasp of Spring Boot, JPA and relational data modelling.',
      'Hands-on with Kafka or similar streaming platforms.',
      'Experience operating services on AWS with CI/CD pipelines.',
      'Clear written communication in distributed teams.',
    ],
    niceToHave: ['Kubernetes exposure', 'Event-sourcing patterns', 'GraphQL APIs'],
    benefits: [
      'Annual performance bonus up to 15%',
      'Hybrid work — 3 days in office',
      'Health insurance for family + parents',
      '₹1L yearly learning budget',
    ],
    interviewStages: [
      { name: 'Recruiter screen', duration: '30 min', focus: 'Role fit, compensation, notice period' },
      { name: 'Technical deep-dive', duration: '75 min', focus: 'Backend design, concurrency, SQL' },
      { name: 'System design + culture', duration: '90 min', focus: 'Scale design, ownership stories' },
    ],
  },
  {
    slug: 'react-node-pod-4-engineers',
    title: 'React + Node Pod (4 engineers)',
    category: 'Engineering',
    type: 'Contract',
    posted: '1 day ago',
    salary: '₹1.4–2.2 L/mo',
    location: 'Remote India',
    domain: 'SaaS & Product',
    premium: true,
    experience: '3–7 yrs',
    workMode: 'Remote',
    department: 'Product Engineering',
    clientType: 'US-headquartered product company, India delivery pod',
    summary:
      'A complete pod — 2 senior React engineers, 1 Node lead and 1 full-stack — for a 6-month roadmap rebuild of a customer analytics console. Fully remote with overlap to US Pacific mornings.',
    aboutCompany:
      'A US product company scaling its India delivery centre. The pod works directly with US product managers on a modern TypeScript stack with weekly demos.',
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Jest'],
    responsibilities: [
      'Rebuild a legacy analytics console into a modern React/Next.js application.',
      'Build Node.js APIs with typed contracts shared across the stack.',
      'Establish component library, testing standards and CI pipelines.',
      'Run weekly demos and directly own roadmap commitments.',
    ],
    requirements: [
      '3+ years shipping production React applications.',
      'Strong TypeScript skills across frontend and Node.',
      'Experience with REST and WebSocket-based integrations.',
      'Comfortable working US-PST overlap for 3–4 hours daily.',
    ],
    niceToHave: ['Data-visualisation experience (D3/Recharts)', 'Next.js SSR', 'Storybook'],
    benefits: [
      'Fully remote, async-first culture',
      'Direct collaboration with US product team',
      'Extension and full-time conversion options',
      'Tooling and home-office allowance',
    ],
    interviewStages: [
      { name: 'Portfolio screen', duration: '30 min', focus: 'Past projects, stack depth' },
      { name: 'Pairing session', duration: '60 min', focus: 'Real feature build with reviewer' },
      { name: 'Client final round', duration: '45 min', focus: 'Collaboration and communication' },
    ],
  },
  {
    slug: 'low-latency-cpp-developer',
    title: 'Low-Latency C++ Developer',
    category: 'Engineering',
    type: 'Permanent',
    posted: '3 days ago',
    salary: '₹55–85 LPA',
    location: 'Mumbai',
    domain: 'BFSI & FinTech',
    premium: true,
    experience: '6–10 yrs',
    workMode: 'On-site',
    department: 'Quantitative Technology',
    clientType: 'Global trading firm, Mumbai trading floor',
    summary:
      'Build and optimise order-management and market-data systems where microseconds decide P&L. Works alongside quants and traders on the trading floor.',
    aboutCompany:
      'A global systematic trading firm with a Mumbai trading floor, running low-latency strategies across equities and derivatives on co-located infrastructure.',
    skills: ['C++20', 'Linux',     'Lock-free design', 'TCP/UDP', 'GDB/perf', 'Python tooling'],
    responsibilities: [
      'Optimise hot paths in order-management and market-data handlers.',
      'Design lock-free data structures and memory-pool allocators.',
      'Profile with perf/VTune and drive microsecond-level improvements.',
      'Work with traders to prototype new execution logic.',
    ],
    requirements: [
      '6+ years of modern C++ in performance-critical systems.',
      'Deep knowledge of Linux networking and CPU cache behaviour.',
      'Experience with kernel-bypass or UDP multicast feeds is a strong plus.',
      'Rigorous, measurement-driven engineering approach.',
    ],
    niceToHave: ['FPGA exposure', 'Python for tooling', 'Exchange protocol knowledge'],
    benefits: [
      'Performance-linked bonus (annual, discretionary)',
      'Co-located trading-floor environment',
      'Relocation support within India',
      'Conference and certification budget',
    ],
    interviewStages: [
      { name: 'C++ fundamentals', duration: '60 min', focus: 'Memory model, UB, modern C++' },
      { name: 'Low-latency challenge', duration: '90 min', focus: 'Profiling and optimisation task' },
      { name: 'Trading floor panel', duration: '60 min', focus: 'Trader collaboration, pragmatism' },
    ],
  },
  {
    slug: 'vp-engineering',
    title: 'VP Engineering',
    category: 'Leadership',
    type: 'Executive',
    posted: '5 days ago',
    salary: '₹90 LPA+',
    location: 'Bengaluru',
    domain: 'SaaS & Product',
    premium: true,
    experience: '14+ yrs',
    workMode: 'Hybrid',
    department: 'Engineering Leadership',
    clientType: 'Series-C SaaS scale-up, 400+ employees',
    summary:
      'Own engineering for a 120-person org — platform, product and data. Report to the CTO, sit on the leadership team, and build the operating cadence for the next stage of scale.',
    aboutCompany:
      'A Series-C SaaS company with 400+ employees across India and the US, serving mid-market enterprises. Profitable, product-led, with a modern platform team.',
    skills: ['Org design', 'Platform strategy', 'Hiring at scale', 'SRE culture', 'Board reporting'],
    responsibilities: [
      'Set and execute engineering strategy aligned to product roadmap.',
      'Grow, structure and level a 120-person engineering organisation.',
      'Establish delivery metrics, incident response and platform reliability targets.',
      'Partner with product and GTM on pricing, packaging and enterprise readiness.',
      'Represent engineering in board and investor conversations.',
    ],
    requirements: [
      '14+ years in software engineering, 5+ leading large orgs.',
      'Track record scaling teams from ~50 to 150+ engineers.',
      'Deep experience with platform/infrastructure modernisation.',
      'Strong written and verbal executive communication.',
    ],
    niceToHave: ['Public-company experience', 'Multi-region delivery', 'Security/compliance programmes'],
    benefits: [
      'Executive compensation + significant equity',
      'Direct CTO and board exposure',
      'Leadership coaching budget',
      'Flexible hybrid arrangement',
    ],
    interviewStages: [
      { name: 'Founder conversation', duration: '45 min', focus: 'Vision fit, leadership style' },
      { name: 'Operating plan case', duration: '90 min', focus: '90-day plan presentation' },
      { name: 'Board panel', duration: '60 min', focus: 'Stakeholder management' },
    ],
  },
  {
    slug: 'devops-sre-lead',
    title: 'DevOps / SRE Lead',
    category: 'Engineering',
    type: 'Permanent',
    posted: '2 days ago',
    salary: '₹35–50 LPA',
    location: 'Hyderabad',
    domain: 'GCC',
    premium: false,
    experience: '7–11 yrs',
    workMode: 'Hybrid',
    department: 'Platform & Reliability',
    clientType: 'Fortune-500 GCC, global banking technology',
    summary:
      'Lead site-reliability engineering for a GCC platform group — Kubernetes, Terraform and observability across 200+ services with global follow-the-sun support.',
    aboutCompany:
      'The India capability centre of a Fortune-500 financial institution, owning cloud platforms and reliability engineering for global business lines.',
    skills: ['Kubernetes', 'Terraform', 'AWS/GCP', 'Prometheus/Grafana', 'Go/Python', 'Incident command'],
    responsibilities: [
      'Own SRE practice: SLOs, error budgets and blameless postmortems.',
      'Lead Kubernetes platform standardisation across application teams.',
      'Build observability stack and capacity-forecasting automation.',
      'Manage a 6-engineer SRE team with on-call rotations.',
    ],
    requirements: [
      '7+ years in DevOps/SRE with 2+ leading teams.',
      'Production Kubernetes and IaC at scale.',
      'Strong incident-command and root-cause discipline.',
      'Experience in regulated environments (audit, segregation of duties).',
    ],
    niceToHave: ['FinOps practice', 'Chaos-engineering programmes', 'ITIL familiarity'],
    benefits: [
      'Global brand, on-site flexibility',
      'Annual leadership bonus',
      'Comprehensive medical cover',
      'Sabbatical option after 4 years',
    ],
    interviewStages: [
      { name: 'Recruiter screen', duration: '30 min', focus: 'Experience and mobility' },
      { name: 'Technical panel', duration: '75 min', focus: 'Kubernetes, IaC, incident stories' },
      { name: 'Leadership round', duration: '60 min', focus: 'Team building, stakeholder management' },
    ],
  },
  {
    slug: 'data-scientist-pricing',
    title: 'Data Scientist (Pricing)',
    category: 'Data & AI',
    type: 'Contract',
    posted: '4 days ago',
    salary: '₹1.1–1.6 L/mo',
    location: 'Remote',
    domain: 'Retail & E-commerce',
    premium: false,
    experience: '4–7 yrs',
    workMode: 'Remote',
    department: 'Analytics & Experimentation',
    clientType: 'Large e-commerce marketplace',
    summary:
      'Build pricing and promotion-response models, run A/B tests at marketplace scale and hand off productionised pipelines to engineering.',
    aboutCompany:
      'One of India’s largest e-commerce marketplaces, with an analytics org that owns pricing, promotions and supply-chain forecasting.',
    skills: ['Python', 'Causal inference', 'A/B testing', 'SQL', 'dbt', 'Snowflake'],
    responsibilities: [
      'Develop elasticity and promotion-response models.',
      'Design and analyse large-scale marketplace experiments.',
      'Partner with engineering to productionise model pipelines.',
      'Present weekly pricing insights to category leaders.',
    ],
    requirements: [
      '4+ years applied data science in pricing, growth or marketplace domains.',
      'Strong causal-inference and experiment-design fundamentals.',
      'Advanced SQL and Python (pandas, scikit-learn, statsmodels).',
      'Comfortable working fully remote with async documentation.',
    ],
    niceToHave: ['Bayesian experimentation', 'Spark', 'dashboards (Looker/Metabase)'],
    benefits: [
      'Fully remote contract (12 months, extendable)',
      'High-visibility category ownership',
      'Conversion to full-time possible',
      'Flexible hours with core overlap',
    ],
    interviewStages: [
      { name: 'Stats screen', duration: '45 min', focus: 'Experiment design, probability' },
      { name: 'Case study', duration: '75 min', focus: 'Pricing case with live discussion' },
      { name: 'Hiring manager', duration: '45 min', focus: 'Stakeholder and delivery style' },
    ],
  },
  {
    slug: '5g-core-protocol-engineer',
    title: '5G Core Protocol Engineer',
    category: 'Engineering',
    type: 'Permanent',
    posted: '6 days ago',
    salary: '₹30–45 LPA',
    location: 'Bengaluru',
    domain: 'Communication & Media',
    premium: false,
    experience: '5–9 yrs',
    workMode: 'On-site',
    department: 'Telecom Engineering',
    clientType: 'Global telecom equipment vendor',
    summary:
      'Work on 5G core network functions — AMF/SMF/UPF signalling, conformance testing and standards tracking with global R&D teams.',
    aboutCompany:
      'A global telecom equipment vendor with a Bengaluru R&D centre building 5G core software deployed by tier-1 operators.',
    skills: ['5G NAS/S1AP', '3GPP Release 16/17', 'C/C++', 'Diameter/SCTP', 'Wireshark', 'Containerisation'],
    responsibilities: [
      'Develop and test 5G core network functions.',
      'Analyse protocol traces and resolve conformance failures.',
      'Track 3GPP releases and feed requirements into the roadmap.',
      'Support operator integration and field escalations.',
    ],
    requirements: [
      '5+ years in telecom protocol development.',
      'Working knowledge of 3GPP NAS, NGAP or PFCP.',
      'Strong C/C++ debugging with packet-analysis tools.',
      'Experience with conformance or interoperability testing.',
    ],
    niceToHave: ['SBA/service-based architecture', 'Cloud-native network functions', 'standards-body participation'],
    benefits: [
      'Patent-filing incentives',
      'Global standards travel',
      'Annual certification budget',
      'Hybrid after probation',
    ],
    interviewStages: [
      { name: 'Protocol screen', duration: '45 min', focus: '3GPP concepts, stack depth' },
      { name: 'Technical round', duration: '75 min', focus: 'Debugging trace-based problems' },
      { name: 'Manager round', duration: '45 min', focus: 'Delivery and collaboration' },
    ],
  },
  {
    slug: 'embedded-autosar-developer',
    title: 'Embedded Autosar Developer',
    category: 'Engineering',
    type: 'Permanent',
    posted: '1 week ago',
    salary: '₹22–34 LPA',
    location: 'Pune',
    domain: 'Manufacturing',
    premium: false,
    experience: '4–8 yrs',
    workMode: 'Hybrid',
    department: 'Embedded Systems',
    clientType: 'Tier-1 automotive supplier',
    summary:
      'Develop AUTOSAR classic-platform software for ADAS ECUs — BSW configuration, diagnostics and CAN/ETH communication stacks.',
    aboutCompany:
      'A Tier-1 automotive electronics supplier supplying ADAS and body-electronics ECUs to global OEMs, with a Pune engineering centre.',
    skills: ['AUTOSAR Classic', 'C', 'CAN/LIN', 'UDS diagnostics', 'MATLAB/Simulink', 'Vector tools'],
    responsibilities: [
      'Configure and extend AUTOSAR BSW modules (CAN, DCM, DEM, NvM).',
      'Develop and unit-test application software for ADAS ECUs.',
      'Support diagnostics (UDS/OBD) and OEM homologation testing.',
      'Collaborate with hardware and functional-safety teams.',
    ],
    requirements: [
      '4+ years embedded C development in automotive.',
      'Hands-on AUTOSAR classic-platform configuration.',
      'Experience with vector tools (CANoe/CANape) and unit testing (VectorCAST).',
      'Understanding of ISO 26262 fundamentals.',
    ],
    niceToHave: ['SOME/IP and Ethernet', 'Python automation', 'ISOBUS'],
    benefits: [
      'OEM-linked performance bonus',
      'Certification support (ASPICE/ISO 26262)',
      'Shift-adjacent flexible timings',
      'Family health cover',
    ],
    interviewStages: [
      { name: 'Embedded screen', duration: '45 min', focus: 'C, memory, RTOS basics' },
      { name: 'AUTOSAR round', duration: '60 min', focus: 'BSW modules, diagnostics' },
      { name: 'Hiring manager', duration: '45 min', focus: 'Project ownership' },
    ],
  },
  {
    slug: 'fhir-integration-engineer',
    title: 'FHIR Integration Engineer',
    category: 'Engineering',
    type: 'Contract',
    posted: '3 days ago',
    salary: '₹95K–1.3 L/mo',
    location: 'Remote',
    domain: 'Healthcare & Life Sciences',
    premium: false,
    experience: '3–6 yrs',
    workMode: 'Remote',
    department: 'Interoperability',
    clientType: 'Health-tech platform serving hospital networks',
    summary:
      'Build HL7 FHIR integrations between hospital information systems and a care-coordination platform — APIs, terminology mapping and conformance testing.',
    aboutCompany:
      'A health-tech company whose care-coordination platform is deployed across 50+ hospitals, focused on interoperability standards.',
    skills: ['HL7 FHIR R4', 'HL7 v2', 'REST APIs', 'Java/Node', 'Terminology (SNOMED/LOINC)', 'Docker'],
    responsibilities: [
      'Implement FHIR resource mappings and API integrations.',
      'Translate HL7 v2 messages into FHIR payloads.',
      'Run conformance validation and fix interoperability defects.',
      'Document interfaces for hospital IT stakeholders.',
    ],
    requirements: [
      '3+ years integrating healthcare systems (FHIR or HL7 v2).',
      'Solid API development skills in Java or Node.js.',
      'Familiarity with clinical terminologies.',
      'Comfortable working remotely with hospital stakeholders.',
    ],
    niceToHave: ['SMART on FHIR', 'GDPR/DPDP awareness', 'BlueButton/Bulk data'],
    benefits: [
      'Fully remote 12-month contract',
      'Meaningful healthcare impact',
      'Standards training funded',
      'Extension to permanent role likely',
    ],
    interviewStages: [
      { name: 'Standards screen', duration: '30 min', focus: 'FHIR/HL7 experience' },
      { name: 'Integration task', duration: '60 min', focus: 'API mapping exercise' },
      { name: 'Product round', duration: '30 min', focus: 'Stakeholder communication' },
    ],
  },
  {
    slug: 'talent-acquisition-lead-gcc',
    title: 'Talent Acquisition Lead (GCC)',
    category: 'Operations',
    type: 'Permanent',
    posted: '2 days ago',
    salary: '₹24–32 LPA',
    location: 'Hyderabad',
    domain: 'GCC',
    premium: false,
    experience: '8–12 yrs',
    workMode: 'Hybrid',
    department: 'People & Talent',
    clientType: 'New-age GCC for a European enterprise',
    summary:
      'Own end-to-end hiring for a 0→300 build-out — design the TA operating model, run leadership searches and set SLA dashboards for a new India GCC.',
    aboutCompany:
      'The India capability centre of a European enterprise, scaling from 40 to 300 engineers over 18 months across Hyderabad and Bengaluru.',
    skills: ['Tech recruiting', 'GCC build-out', 'Employer branding', 'ATS analytics', 'Stakeholder management'],
    responsibilities: [
      'Design and run the TA operating model for a rapid GCC build-out.',
      'Lead leadership and hard-to-fill engineering searches personally.',
      'Own SLA dashboards: time-to-fill, quality-of-hire, funnel health.',
      'Partner with HRBP on compensation benchmarking and offers.',
    ],
    requirements: [
      '8+ years full-cycle tech recruiting, 2+ in GCC or enterprise setups.',
      'Demonstrated leadership hiring at senior engineer+ levels.',
      'Data-literate: runs funnels from dashboards, not gut feel.',
      'Experience with modern ATS tooling.',
    ],
    niceToHave: ['Employer-brand programmes', 'Campus/early-career channels', 'Europe-facing stakeholders'],
    benefits: [
      'GCC build-out equity in the brand',
      'Direct exposure to global leadership',
      'Annual L&D allowance',
      'Hybrid work',
    ],
    interviewStages: [
      { name: 'TA deep-dive', duration: '45 min', focus: 'Sourcing philosophy, metrics' },
      { name: 'Case exercise', duration: '60 min', focus: 'Funnel-to-dashboard build-out plan' },
      { name: 'Country HR head', duration: '45 min', focus: 'Culture and stakeholder fit' },
    ],
  },
  {
    slug: 'staff-ml-engineer-llm-systems',
    title: 'Staff ML Engineer (LLM Systems)',
    category: 'Data & AI',
    type: 'Permanent',
    posted: '1 day ago',
    salary: '₹60–80 LPA',
    location: 'Bengaluru',
    domain: 'SaaS & Product',
    premium: true,
    experience: '8–12 yrs',
    workMode: 'Hybrid',
    department: 'AI Platform',
    clientType: 'Enterprise AI product company',
    summary:
      'Own the LLM platform — retrieval pipelines, evaluation harnesses and inference cost engineering — powering AI features used by 1,000+ enterprise customers.',
    aboutCompany:
      'An enterprise AI product company whose copilot features are embedded in Fortune-500 workflows, with a strong applied-research engineering culture.',
    skills: ['Python', 'LLM fine-tuning', 'RAG', 'Vector search', 'Kubernetes', 'Evaluation harnesses'],
    responsibilities: [
      'Own retrieval, chunking and reranking pipelines for enterprise RAG.',
      'Design evaluation harnesses for quality, latency and cost.',
      'Drive inference cost engineering: quantization, batching, caching.',
      'Mentor senior engineers and set ML engineering standards.',
    ],
    requirements: [
      '8+ years software/ML engineering with 2+ years on LLM applications.',
      'Production experience with vector databases and retrieval systems.',
      'Strong Python and distributed-systems fundamentals.',
      'Evidence of cost/performance optimisation at scale.',
    ],
    niceToHave: ['Fine-tuning (LoRA/QLoRA)', 'GPU inference optimisation', 'Published research'],
    benefits: [
      'Equity + performance bonus',
      'Compute budget for experiments',
      'Top-tier GPU access',
      'Conference speaking support',
    ],
    interviewStages: [
      { name: 'ML fundamentals', duration: '60 min', focus: 'Retrieval, evaluation, metrics' },
      { name: 'Systems design', duration: '75 min', focus: 'LLM platform architecture' },
      { name: 'Staff loop', duration: '60 min', focus: 'Influence, mentoring, judgement' },
    ],
  },
  {
    slug: 'assistant-manager-credit-risk',
    title: 'Assistant Manager — Credit Risk',
    category: 'Operations',
    type: 'Permanent',
    posted: '4 days ago',
    salary: '₹16–22 LPA',
    location: 'Mumbai',
    domain: 'BFSI & FinTech',
    premium: false,
    experience: '3–6 yrs',
    workMode: 'On-site',
    department: 'Risk & Compliance',
    clientType: 'Private-sector bank, wholesale credit',
    summary:
      'Support wholesale credit decisions — financial spreading, rating models, covenant tracking and RBI compliance reporting for a mid-corporate lending book.',
    aboutCompany:
      'A private-sector bank with a fast-growing wholesale banking franchise, headquartered in Mumbai with a data-driven risk function.',
    skills: ['Credit analysis', 'Financial modelling', 'RBI guidelines', 'Excel/Power BI', 'Rating models'],
    responsibilities: [
      'Prepare credit notes and financial spreads for mid-corporate exposures.',
      'Monitor covenants, ratings and early-warning indicators.',
      'Support model validation and portfolio-level risk reporting.',
      'Liaise with business heads on structuring and limits.',
    ],
    requirements: [
      '3+ years in credit risk or corporate lending.',
      'Strong financial-statement analysis skills.',
      'Working knowledge of RBI master directions.',
      'CA/MBA (finance) preferred.',
    ],
    niceToHave: ['Power BI dashboards', 'Sector research experience', 'CFA level progression'],
    benefits: [
      'Annual performance bonus',
      'Banking benefits suite',
      'Sponsored certifications',
      'Fixed annual increments',
    ],
    interviewStages: [
      { name: 'HR screen', duration: '30 min', focus: 'Experience and CTC' },
      { name: 'Technical round', duration: '60 min', focus: 'Ratio analysis, credit note case' },
      { name: 'Risk head', duration: '45 min', focus: 'Judgement and communication' },
    ],
  },
];

export function getV2Job(slug?: string) {
  return V2_JOBS.find((j) => j.slug === slug);
}
