export interface CourseModuleItem {
  icon: string;
  title: string;
  topics: string;
}

export interface CourseRoadmapStep {
  step: number;
  title: string;
  summary: string;
}

export interface CourseScheduleRow {
  label: string;
  value: string;
}

export interface CourseInstalmentRow {
  label: string;
  amount: string;
}

export interface CourseItem {
  id: string;
  slug: string;
  shortName: string;
  eyebrow: string;
  title: string;
  category: string;
  status: 'Published' | 'Draft';
  admissionsBadge: string;
  summary: string;
  heroImage: string;
  fee: number;
  feeDisplay: string;
  duration: string;
  trainingMode: string;
  classSchedule: string;
  roadmapHeading: string;
  curriculumModules: CourseModuleItem[];
  roadmap: CourseRoadmapStep[];
  scheduleDetails: CourseScheduleRow[];
  studentBenefits: string[];
  instalments: CourseInstalmentRow[];
  feeNote: string;
  sortOrder: number;
  leadCount?: number;
  updatedAt?: string;
}

export interface CourseLeadActivity {
  id: string;
  type: string;
  notes: string;
  actor: string;
  createdAt: string;
}

export interface CourseLeadItem {
  id: string;
  courseId: string;
  courseSlug: string;
  courseShortName: string;
  courseTitle: string;
  studentName: string;
  mobileNumber: string;
  educationBackground: 'Graduate' | 'Final-year student' | 'Working professional' | 'Other';
  preferredTrainingMode: 'Offline – Bengaluru' | 'Online';
  stage: 'New' | 'Counselled' | 'Demo Scheduled' | 'Enrolled' | 'Follow-up' | 'Dropped';
  counsellorOwner?: string;
  notes?: string;
  sourcePage?: string;
  activities?: CourseLeadActivity[];
  createdAt: string;
  updatedAt?: string;
}

export const EDUCATION_BACKGROUNDS = [
  'Graduate',
  'Final-year student',
  'Working professional',
  'Other',
] as const;

export const TRAINING_MODES = ['Offline – Bengaluru', 'Online'] as const;

export const COURSE_LEAD_STAGES = [
  'New',
  'Counselled',
  'Demo Scheduled',
  'Enrolled',
  'Follow-up',
  'Dropped',
] as const;

const DEFAULT_BENEFITS = [
  '100% placement support & hiring network drives',
  'Industry-level live instructor-led training',
  'Industry-led real-time project experience',
  'Hands-on daily coding practice & code reviews',
  'Structured course materials and assignments',
  'Resume building & GitHub portfolio setup',
  '1-on-1 mock technical interviews',
  'Course completion certificate',
];

const DEFAULT_FEE_NOTE =
  'Illustrative instalment plan. Confirm GST treatment and applicable taxes before publishing.';

export const FALLBACK_COURSES: CourseItem[] = [
  {
    id: 'CRS-JAVA-FS',
    slug: 'java-full-stack',
    shortName: 'Java Full Stack',
    eyebrow: 'JAVA FULL STACK DEVELOPER PROGRAM',
    title: 'Become a Java Full Stack Developer',
    category: 'Full Stack Development',
    status: 'Published',
    admissionsBadge: 'Admissions Open – Bengaluru & Online',
    summary:
      'Learn industry-relevant programming skills with practical training, real-time projects and career guidance.',
    heroImage:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    fee: 40000,
    feeDisplay: '₹40,000',
    duration: '4 Months',
    trainingMode: 'Online + Offline',
    classSchedule: '5 Days / Week',
    roadmapHeading: '4-month course structure',
    curriculumModules: [
      {
        icon: 'java',
        title: 'Core Java & Advanced Java',
        topics: 'OOP, Collections, Exception Handling, Multithreading, JDBC',
      },
      {
        icon: 'spring',
        title: 'Spring Boot & Hibernate',
        topics: 'REST APIs, Spring MVC, JPA, Hibernate',
      },
      {
        icon: 'database',
        title: 'Database Management',
        topics: 'SQL, MySQL, Database Design',
      },
      {
        icon: 'frontend',
        title: 'Frontend Development',
        topics: 'HTML, CSS, JavaScript, React Basics',
      },
      {
        icon: 'tools',
        title: 'Developer Tools',
        topics: 'Git, GitHub, Maven, Postman, Deployment Basics',
      },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Month 1 – Core Java',
        summary: 'Java fundamentals, OOP concepts, Arrays, Strings, Collections and coding exercises.',
      },
      {
        step: 2,
        title: 'Month 2 – Advanced Java & Database',
        summary: 'JDBC, Servlets basics, SQL, MySQL and Hibernate.',
      },
      {
        step: 3,
        title: 'Month 3 – Spring Boot & Full Stack',
        summary: 'Spring Boot, REST APIs, HTML, CSS, JavaScript and React basics.',
      },
      {
        step: 4,
        title: 'Month 4 – Live Project & Interview Preparation',
        summary:
          'Real-time project, GitHub portfolio, resume preparation, mock interviews and deployment.',
      },
    ],
    scheduleDetails: [
      { label: 'Duration', value: '4 months' },
      { label: 'Classes', value: 'Monday–Friday' },
      { label: 'Daily class', value: '2 hours' },
      { label: 'Weekly training', value: '10 hours' },
      { label: 'Practical sessions', value: 'Included' },
      { label: 'Projects', value: '2 industry-oriented projects' },
      { label: 'Mode', value: 'Online / Classroom' },
    ],
    studentBenefits: [...DEFAULT_BENEFITS],
    instalments: [
      { label: 'Registration', amount: '₹5,000' },
      { label: 'First instalment', amount: '₹15,000' },
      { label: 'Second instalment', amount: '₹10,000' },
      { label: 'Final instalment', amount: '₹10,000' },
    ],
    feeNote: DEFAULT_FEE_NOTE,
    sortOrder: 1,
  },
  {
    id: 'CRS-MERN-FS',
    slug: 'mern-stack',
    shortName: 'MERN Stack',
    eyebrow: 'MERN FULL STACK DEVELOPER PROGRAM',
    title: 'Become a MERN Stack Developer',
    category: 'Full Stack Development',
    status: 'Published',
    admissionsBadge: 'Admissions Open – Bengaluru & Online',
    summary:
      'Master MongoDB, Express.js, React and Node.js through production-grade web architecture, real-time projects and interview prep.',
    heroImage:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    fee: 38000,
    feeDisplay: '₹38,000',
    duration: '4 Months',
    trainingMode: 'Online + Offline',
    classSchedule: '5 Days / Week',
    roadmapHeading: '4-month course structure',
    curriculumModules: [
      {
        icon: 'frontend',
        title: 'Modern JavaScript & TypeScript',
        topics: 'ES6+, Async/Await, DOM, Closures, TypeScript Essentials',
      },
      {
        icon: 'react',
        title: 'React.js & State Architecture',
        topics: 'Hooks, Context, React Router, Redux Toolkit, Tailwind CSS',
      },
      {
        icon: 'node',
        title: 'Node.js & Express.js APIs',
        topics: 'RESTful Services, JWT Auth, Middleware, Error Handling, RBAC',
      },
      {
        icon: 'database',
        title: 'MongoDB & Mongoose ODM',
        topics: 'Schema Modelling, Aggregation Pipelines, Indexing, Atlas',
      },
      {
        icon: 'tools',
        title: 'Testing & Cloud Deployment',
        topics: 'Git, GitHub, Postman, Docker Basics, CI/CD & Cloud Hosting',
      },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Month 1 – Web Foundations & Modern JS',
        summary: 'HTML5, CSS3, Responsive UI, JavaScript ES6+, DOM manipulation and Git workflows.',
      },
      {
        step: 2,
        title: 'Month 2 – React.js Frontend Engineering',
        summary: 'Component patterns, Hooks, React Router, state management and API integration.',
      },
      {
        step: 3,
        title: 'Month 3 – Node.js, Express & MongoDB',
        summary: 'REST APIs, JWT authentication, MongoDB schemas, aggregations and security best practices.',
      },
      {
        step: 4,
        title: 'Month 4 – Capstone & Placement Readiness',
        summary: 'End-to-end SaaS capstone project, cloud deployment, resume clinic and mock interviews.',
      },
    ],
    scheduleDetails: [
      { label: 'Duration', value: '4 months' },
      { label: 'Classes', value: 'Monday–Friday' },
      { label: 'Daily class', value: '2 hours' },
      { label: 'Weekly training', value: '10 hours' },
      { label: 'Practical sessions', value: 'Included' },
      { label: 'Projects', value: '2 full-stack web applications' },
      { label: 'Mode', value: 'Online / Classroom' },
    ],
    studentBenefits: [...DEFAULT_BENEFITS],
    instalments: [
      { label: 'Registration', amount: '₹5,000' },
      { label: 'First instalment', amount: '₹13,000' },
      { label: 'Second instalment', amount: '₹10,000' },
      { label: 'Final instalment', amount: '₹10,000' },
    ],
    feeNote: DEFAULT_FEE_NOTE,
    sortOrder: 2,
  },
  {
    id: 'CRS-MEAN-FS',
    slug: 'mean-stack',
    shortName: 'MEAN Stack',
    eyebrow: 'MEAN FULL STACK DEVELOPER PROGRAM',
    title: 'Become a MEAN Stack Developer',
    category: 'Full Stack Development',
    status: 'Published',
    admissionsBadge: 'Admissions Open – Bengaluru & Online',
    summary:
      'Build enterprise-grade web applications with MongoDB, Express.js, Angular & TypeScript, and Node.js backed by practical mentoring.',
    heroImage:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    fee: 38000,
    feeDisplay: '₹38,000',
    duration: '4 Months',
    trainingMode: 'Online + Offline',
    classSchedule: '5 Days / Week',
    roadmapHeading: '4-month course structure',
    curriculumModules: [
      {
        icon: 'frontend',
        title: 'TypeScript & Modern Web UI',
        topics: 'TypeScript OOP, Interfaces, Generics, HTML5, SCSS, Responsive Design',
      },
      {
        icon: 'angular',
        title: 'Angular Framework',
        topics: 'Components, Services, RxJS Observables, Reactive Forms, Guards',
      },
      {
        icon: 'node',
        title: 'Node.js & Express Backend',
        topics: 'REST APIs, JWT Authentication, Role Guards, Validation',
      },
      {
        icon: 'database',
        title: 'MongoDB Database',
        topics: 'Collections, Indexing, Aggregation, Data Modelling',
      },
      {
        icon: 'tools',
        title: 'Enterprise Tooling',
        topics: 'Git, GitHub, Angular CLI, Postman, Cloud Deployment',
      },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Month 1 – JavaScript, TypeScript & UI',
        summary: 'Semantic HTML, SCSS, ES6+, strict TypeScript and component-oriented thinking.',
      },
      {
        step: 2,
        title: 'Month 2 – Angular & RxJS Mastery',
        summary: 'Modules, standalone components, dependency injection, routing, RxJS and forms.',
      },
      {
        step: 3,
        title: 'Month 3 – Node.js, Express & MongoDB',
        summary: 'Scalable API design, Mongoose models, auth tokens and Angular-to-API integration.',
      },
      {
        step: 4,
        title: 'Month 4 – Live Enterprise Project & Interviews',
        summary: 'Enterprise dashboard capstone, production build, GitHub portfolio and mock panels.',
      },
    ],
    scheduleDetails: [
      { label: 'Duration', value: '4 months' },
      { label: 'Classes', value: 'Monday–Friday' },
      { label: 'Daily class', value: '2 hours' },
      { label: 'Weekly training', value: '10 hours' },
      { label: 'Practical sessions', value: 'Included' },
      { label: 'Projects', value: '2 enterprise MEAN projects' },
      { label: 'Mode', value: 'Online / Classroom' },
    ],
    studentBenefits: [...DEFAULT_BENEFITS],
    instalments: [
      { label: 'Registration', amount: '₹5,000' },
      { label: 'First instalment', amount: '₹13,000' },
      { label: 'Second instalment', amount: '₹10,000' },
      { label: 'Final instalment', amount: '₹10,000' },
    ],
    feeNote: DEFAULT_FEE_NOTE,
    sortOrder: 3,
  },
  {
    id: 'CRS-PYTHON-FS',
    slug: 'python-full-stack',
    shortName: 'Python Full Stack',
    eyebrow: 'PYTHON FULL STACK DEVELOPER PROGRAM',
    title: 'Become a Python Full Stack Developer',
    category: 'Full Stack Development',
    status: 'Published',
    admissionsBadge: 'Admissions Open – Bengaluru & Online',
    summary:
      'Gain hands-on fluency in Python, Django/FastAPI, PostgreSQL and React to build scalable backend services and modern web apps.',
    heroImage:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    fee: 36000,
    feeDisplay: '₹36,000',
    duration: '4 Months',
    trainingMode: 'Online + Offline',
    classSchedule: '5 Days / Week',
    roadmapHeading: '4-month course structure',
    curriculumModules: [
      {
        icon: 'python',
        title: 'Core & Advanced Python',
        topics: 'Data Structures, OOP, Decorators, Generators, File Handling',
      },
      {
        icon: 'api',
        title: 'Django & FastAPI Backend',
        topics: 'MVT Architecture, Django REST Framework, FastAPI, Auth & Permissions',
      },
      {
        icon: 'database',
        title: 'SQL & PostgreSQL',
        topics: 'Relational Schema Design, ORM Queries, Joins, Indexing',
      },
      {
        icon: 'frontend',
        title: 'Frontend Engineering',
        topics: 'HTML5, CSS3, JavaScript, React Basics, API Consumption',
      },
      {
        icon: 'tools',
        title: 'Developer & Cloud Tools',
        topics: 'Git, GitHub, Pytest, Postman, Linux & Deployment Basics',
      },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Month 1 – Core Python & Problem Solving',
        summary: 'Python syntax, data structures, OOP, comprehensions and algorithmic practice.',
      },
      {
        step: 2,
        title: 'Month 2 – SQL, PostgreSQL & Django',
        summary: 'Database design, SQL queries, Django models, templates and ORM workflows.',
      },
      {
        step: 3,
        title: 'Month 3 – DRF, FastAPI & React',
        summary: 'Building secured REST APIs with DRF/FastAPI and integrating React user interfaces.',
      },
      {
        step: 4,
        title: 'Month 4 – Live Project & Interview Prep',
        summary: 'Production full-stack deployment, automated testing, resume review and mock interviews.',
      },
    ],
    scheduleDetails: [
      { label: 'Duration', value: '4 months' },
      { label: 'Classes', value: 'Monday–Friday' },
      { label: 'Daily class', value: '2 hours' },
      { label: 'Weekly training', value: '10 hours' },
      { label: 'Practical sessions', value: 'Included' },
      { label: 'Projects', value: '2 industry-oriented projects' },
      { label: 'Mode', value: 'Online / Classroom' },
    ],
    studentBenefits: [...DEFAULT_BENEFITS],
    instalments: [
      { label: 'Registration', amount: '₹5,000' },
      { label: 'First instalment', amount: '₹11,000' },
      { label: 'Second instalment', amount: '₹10,000' },
      { label: 'Final instalment', amount: '₹10,000' },
    ],
    feeNote: DEFAULT_FEE_NOTE,
    sortOrder: 4,
  },
  {
    id: 'CRS-POWER-BI',
    slug: 'power-bi',
    shortName: 'Power BI',
    eyebrow: 'MICROSOFT POWER BI & BI ANALYTICS PROGRAM',
    title: 'Become a Power BI & BI Specialist',
    category: 'Data & Analytics',
    status: 'Published',
    admissionsBadge: 'Admissions Open – Bengaluru & Online',
    summary:
      'Transform raw business data into executive-ready interactive dashboards using Power Query, DAX modelling, SQL and Power BI Service.',
    heroImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    fee: 22000,
    feeDisplay: '₹22,000',
    duration: '2.5 Months',
    trainingMode: 'Online + Offline',
    classSchedule: '5 Days / Week',
    roadmapHeading: '2.5-month course structure',
    curriculumModules: [
      {
        icon: 'bi',
        title: 'Power Query & ETL Pipelines',
        topics: 'Data Connectors, Cleaning, Merging, Appending, M Language Basics',
      },
      {
        icon: 'database',
        title: 'Data Modelling & Star Schema',
        topics: 'Fact & Dimension Tables, Cardinality, Relationships, SQL Integration',
      },
      {
        icon: 'chart',
        title: 'DAX Formulas & Time Intelligence',
        topics: 'Calculated Columns, Measures, CALCULATE, YTD/MTD, KPI Metrics',
      },
      {
        icon: 'frontend',
        title: 'Executive Dashboard Design',
        topics: 'Visual Storytelling, Drill-through, Bookmarks, Row-Level Security',
      },
      {
        icon: 'tools',
        title: 'Power BI Service & Governance',
        topics: 'Workspaces, Scheduled Refresh, Gateways, Report Publishing',
      },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Month 1 – Data Prep, SQL & Star Schema',
        summary: 'SQL querying fundamentals, Power Query transformations and clean relational data models.',
      },
      {
        step: 2,
        title: 'Month 2 – DAX & Interactive Dashboards',
        summary: 'Advanced DAX measures, time intelligence, custom visuals and finance/sales KPI reports.',
      },
      {
        step: 3,
        title: 'Weeks 9–10 – Live BI Capstone & Interviews',
        summary: 'Power BI Service publishing, RLS setup, portfolio dashboards and BI mock interviews.',
      },
    ],
    scheduleDetails: [
      { label: 'Duration', value: '2.5 months' },
      { label: 'Classes', value: 'Monday–Friday' },
      { label: 'Daily class', value: '2 hours' },
      { label: 'Weekly training', value: '10 hours' },
      { label: 'Practical sessions', value: 'Included' },
      { label: 'Projects', value: '3 business BI dashboards' },
      { label: 'Mode', value: 'Online / Classroom' },
    ],
    studentBenefits: [...DEFAULT_BENEFITS],
    instalments: [
      { label: 'Registration', amount: '₹4,000' },
      { label: 'First instalment', amount: '₹10,000' },
      { label: 'Final instalment', amount: '₹8,000' },
    ],
    feeNote: DEFAULT_FEE_NOTE,
    sortOrder: 5,
  },
  {
    id: 'CRS-DATA-ANALYST',
    slug: 'data-analyst',
    shortName: 'Data Analyst',
    eyebrow: 'INDUSTRY DATA ANALYST CERTIFICATION PROGRAM',
    title: 'Become a Job-Ready Data Analyst',
    category: 'Data & Analytics',
    status: 'Published',
    admissionsBadge: 'Admissions Open – Bengaluru & Online',
    summary:
      'Learn SQL, Advanced Excel, Python data analysis and Power BI dashboards through real-world business case studies and interview coaching.',
    heroImage:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    fee: 30000,
    feeDisplay: '₹30,000',
    duration: '3 Months',
    trainingMode: 'Online + Offline',
    classSchedule: '5 Days / Week',
    roadmapHeading: '3-month course structure',
    curriculumModules: [
      {
        icon: 'chart',
        title: 'Advanced Excel & Business Statistics',
        topics: 'XLOOKUP, Pivot Tables, Power Pivot, Descriptive & Inferential Stats',
      },
      {
        icon: 'database',
        title: 'SQL & Relational Databases',
        topics: 'Joins, CTEs, Window Functions, Subqueries, MySQL / PostgreSQL',
      },
      {
        icon: 'python',
        title: 'Python for Data Analysis',
        topics: 'NumPy, Pandas, Data Cleaning, Exploratory Data Analysis, Matplotlib',
      },
      {
        icon: 'bi',
        title: 'Power BI & Data Storytelling',
        topics: 'Power Query, DAX Measures, Interactive KPI Dashboards',
      },
      {
        icon: 'tools',
        title: 'Analytics Case Studies & Tools',
        topics: 'GitHub Portfolio, Jupyter Notebooks, Business Case Presentations',
      },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Month 1 – Excel, Statistics & SQL',
        summary: 'Spreadsheet automation, business metrics, SQL queries, joins and window functions.',
      },
      {
        step: 2,
        title: 'Month 2 – Python (Pandas) & Power BI',
        summary: 'Data wrangling with Pandas, EDA notebooks, DAX modelling and executive dashboards.',
      },
      {
        step: 3,
        title: 'Month 3 – Domain Capstones & Placement Prep',
        summary: 'E-commerce/BFSI analytics capstones, portfolio building, SQL tests and mock interviews.',
      },
    ],
    scheduleDetails: [
      { label: 'Duration', value: '3 months' },
      { label: 'Classes', value: 'Monday–Friday' },
      { label: 'Daily class', value: '2 hours' },
      { label: 'Weekly training', value: '10 hours' },
      { label: 'Practical sessions', value: 'Included' },
      { label: 'Projects', value: '3 domain analytics projects' },
      { label: 'Mode', value: 'Online / Classroom' },
    ],
    studentBenefits: [...DEFAULT_BENEFITS],
    instalments: [
      { label: 'Registration', amount: '₹5,000' },
      { label: 'First instalment', amount: '₹10,000' },
      { label: 'Second instalment', amount: '₹8,000' },
      { label: 'Final instalment', amount: '₹7,000' },
    ],
    feeNote: DEFAULT_FEE_NOTE,
    sortOrder: 6,
  },
];
