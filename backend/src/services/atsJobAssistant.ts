/**
 * NexaTalent AI Job Assistant & Requisition Intelligence Engine
 * Parses raw Job Descriptions (text or PDF/DOCX) into structured ATS criteria
 * and produces a comprehensive "Recruiter Playbook" highlighting core focus areas,
 * red/green flags, boolean sourcing queries, and screening questions.
 */

import { extractTextFromBuffer, validateResumeBuffer, SKILLS_TAXONOMY_MAP } from './atsResumeParser.js';

export interface RecruiterScreeningQuestion {
  question: string;
  category: 'technical' | 'architecture' | 'ownership' | 'troubleshooting' | 'domain';
  rationale: string;
  goodAnswerSignals: string[];
  redFlagSignals: string[];
}

export interface RecruiterBriefing {
  roleHeadline: string;
  marketContext: string;
  targetCandidatePersona: string;
  candidatePersona?: {
    archetype: string;
    summary: string;
    seniorityBand: string;
    traits: string[];
  };
  booleanSearchQuery?: string;
  coreFocusAreas: {
    area: string;
    importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    whatToProbe: string;
    priority?: 'High' | 'Medium';
    technicalDepthVerification?: string;
  }[];
  redFlags: string[];
  greenFlags: string[];
  sourcingPlaybook: {
    booleanSearchString: string;
    alternativeTitles: string[];
    targetIndustriesAndCompanies: string[];
    highYieldKeywords: string[];
  };
  screeningQuestions: RecruiterScreeningQuestion[];
}

export interface JobAnalysisResult {
  title: string;
  department: string;
  location: string;
  workMode: 'Hybrid' | 'Remote' | 'On-site';
  minExperienceYears: number;
  maxExperienceYears: number;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  openings: number;
  skills: string[];
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  minQualification: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  autoShortlistThreshold: number;
  autoShortlistMode: 'assisted' | 'automatic';
  briefing: RecruiterBriefing;
  source: 'ai_llm' | 'rule_engine';
}

function cleanRoleTitle(raw: string, expYears = 4): string {
  let t = raw.replace(/\r?\n/g, ' ').replace(/^[#*•\-\s]+/, '').trim();

  // Strip marketing or call-to-action prefixes
  t = t.replace(/^(?:we\s+are\s+looking\s+for|looking\s+for|hiring\s+for|opening\s+for|urgently\s+hiring|urgently\s+required|required|seeking)\s+(?:an?\s+)?/i, '');
  t = t.replace(/^(?:an?\s+)?(?:experienced|passionate|dynamic|skilled|talented|rockstar|ninja)\s+/i, '');

  // Truncate at connectors/prepositions: with, having, for, in, to, who, -, |, •
  t = t.replace(/\s+(?:with\s+strong|with|having|who\s+has|to\s+join|in\s+our|for\s+our|at\s+our|serving|available).*$/i, '');
  t = t.replace(/[:–—\-|,.]+$/, '').trim();

  // Canonical role matching
  const canonicalRoles = [
    'Full Stack Developer', 'Full Stack Engineer', 'Fullstack Developer', 'Fullstack Engineer',
    'Backend Developer', 'Backend Engineer', 'Frontend Developer', 'Frontend Engineer',
    'DevOps Engineer', 'Cloud Architect', 'Platform Engineer', 'Site Reliability Engineer',
    'Data Engineer', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer',
    'QA Automation Engineer', 'Software Development Engineer in Test', 'SDET',
    'Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer',
    'Security Engineer', 'Solutions Architect', 'Technical Lead', 'Engineering Manager',
    'Product Manager', 'Scrum Master', 'Business Analyst'
  ];

  for (const cr of canonicalRoles) {
    if (new RegExp(`\\b${cr.replace(/\s+/g, '\\s+')}\\b`, 'i').test(raw)) {
      let prefix = '';
      if (/\b(?:principal|staff)\b/i.test(raw)) prefix = 'Principal ';
      else if (/\b(?:lead|tech\s+lead)\b/i.test(raw)) prefix = 'Lead ';
      else if (/\b(?:senior|sr\.?)\b/i.test(raw) || expYears >= 5) prefix = 'Senior ';
      return `${prefix}${cr}`;
    }
  }

  // Capitalize properly
  if (t.length >= 3 && t.length <= 50) {
    return t.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return expYears >= 5 ? 'Senior Software Engineer' : 'Software Engineer';
}

function canonicalizeSkill(skill: string): string {
  const s = skill.toLowerCase().trim();
  if (s === 'react' || s === 'reactjs') return 'React.js';
  if (s === 'node' || s === 'nodejs') return 'Node.js';
  if (s === 'express' || s === 'expressjs') return 'Express.js';
  if (s === 'go') return 'Golang';
  if (s === 'next' || s === 'nextjs') return 'Next.js';
  if (s === 'vue' || s === 'vuejs') return 'Vue.js';
  if (s === 'tailwind') return 'Tailwind CSS';
  if (s === 'postgres') return 'PostgreSQL';
  if (s === 'mongo') return 'MongoDB';
  if (s === 'k8s') return 'Kubernetes';
  if (s === 'gcp') return 'GCP (Google Cloud)';
  if (s === 'aws') return 'AWS';
  return skill;
}

function isNoisyLine(line: string): boolean {
  const l = line.toLowerCase().trim();
  if (!l) return true;
  if (l.includes('#hiring') || l.includes('#jobs') || l.includes('#immediate') || l.includes('#techhiring') || l.includes('#fullstack')) return true;
  if (/^#\w+/.test(l)) return true;
  if (line.split('#').length > 3) return true;
  if (l.includes('know someone who fits') || l.includes('tag them') || l.includes('share this opportunity')) return true;
  if (l.includes('priority for immediate joiners') || l.includes('available to join within')) return true;
  if (l.includes('dm me') || l.includes('send your cv') || l.includes('send your resume') || l.includes('apply at') || l.includes('reach out to')) return true;
  if (l.includes('candidates available to join')) return true;
  return false;
}

/**
 * Extracts clean structured information from raw text using deep heuristics & taxonomy.
 */
export function extractJobDetailsHeuristically(rawText: string, filename = ''): JobAnalysisResult {
  const cleanText = (rawText || '').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Experience Years
  let minExp = 4;
  let maxExp = 8;
  const expMatch1 = cleanText.match(/(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i);
  const expMatch2 = cleanText.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+relevant)?\s+experience/i);

  if (expMatch1) {
    minExp = Math.round(parseFloat(expMatch1[1]));
    maxExp = Math.round(parseFloat(expMatch1[2]));
  } else if (expMatch2) {
    minExp = Math.round(parseFloat(expMatch2[1]));
    maxExp = Math.max(minExp + 3, minExp + 4);
  }

  // 2. Role Title extraction
  let title = '';
  const titlePatterns = [
    /(?:Job Title|Position|Role|Designation)\s*[:–-]\s*([^\n\r]+)/i,
    /(?:Hiring For|Looking for|Opening for)\s+(?:a\s+|an\s+)?([^\n\r]+)/i,
  ];
  for (const pat of titlePatterns) {
    const m = cleanText.match(pat);
    if (m && m[1].trim().length >= 3) {
      title = cleanRoleTitle(m[1], minExp);
      break;
    }
  }

  if (!title) {
    for (let i = 0; i < Math.min(6, lines.length); i++) {
      const line = lines[i];
      if (
        /(?:Engineer|Developer|Architect|Lead|Manager|Specialist|Analyst|Scientist|Consultant|Administrator|Designer)/i.test(line) &&
        line.length <= 60 &&
        !line.includes(':') &&
        !line.includes('@') &&
        !isNoisyLine(line)
      ) {
        title = cleanRoleTitle(line, minExp);
        break;
      }
    }
  }

  if (!title && filename) {
    const base = filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const stripped = base.replace(/job|description|jd|req|requirement|spec/gi, '').trim();
    if (stripped.length >= 3) title = cleanRoleTitle(stripped, minExp);
  }
  if (!title) title = cleanRoleTitle(cleanText.slice(0, 100), minExp);

  // 3. Department extraction
  let department = 'Engineering';
  if (/devops|sre|cloud|infrastructure|platform/i.test(cleanText)) department = 'DevOps & Cloud Platform';
  else if (/data|analytics|etl|pipeline|bigquery|bi\b/i.test(cleanText)) department = 'Data & Analytics';
  else if (/qa|quality|test|automation\s+eng/i.test(cleanText)) department = 'Quality Assurance';
  else if (/product|ux|ui|design/i.test(cleanText)) department = 'Product & Design';
  else if (/security|infosec|cyber/i.test(cleanText)) department = 'Cybersecurity';
  else if (/sales|account\s+exec|bda|bde/i.test(cleanText)) department = 'Sales & Revenue';

  // 4. Work Mode & Location
  let workMode: 'Hybrid' | 'Remote' | 'On-site' = 'Hybrid';
  if (/\b(?:fully\s+remote|100%\s+remote|remote\s+first|work\s+from\s+home|wfh)\b/i.test(cleanText)) {
    workMode = 'Remote';
  } else if (/\b(?:on-?site|in-?office|work\s+from\s+office|wfo)\b/i.test(cleanText)) {
    workMode = 'On-site';
  }

  let location = 'Bengaluru, India';
  const cities = ['Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Noida', 'Gurugram', 'Gurgaon', 'Chennai', 'Kolkata', 'Kochi', 'Remote'];
  for (const c of cities) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(cleanText)) {
      location = c === 'Bangalore' ? 'Bengaluru, India' : c === 'Remote' ? 'Remote, India' : `${c}, India`;
      break;
    }
  }

  // 5. Salary Benchmark Estimation
  let salaryMin = 1800000;
  let salaryMax = 3200000;
  const salaryMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(?:LPA|lakhs?|lac)/i);
  if (salaryMatch) {
    salaryMin = Math.round(parseFloat(salaryMatch[1]) * 100000);
    salaryMax = Math.round(parseFloat(salaryMatch[2]) * 100000);
  } else {
    // Dynamic benchmark based on experience level
    if (minExp <= 2) {
      salaryMin = 600000;
      salaryMax = 1200000;
    } else if (minExp <= 5) {
      salaryMin = 1400000;
      salaryMax = 2400000;
    } else if (minExp <= 8) {
      salaryMin = 2200000;
      salaryMax = 3600000;
    } else {
      salaryMin = 3500000;
      salaryMax = 5500000;
    }
  }

  // 6. Skills extraction against categorized taxonomy
  const textLower = cleanText.toLowerCase();
  const detectedSkills: { skill: string; category: string; count: number }[] = [];

  for (const [cat, skills] of Object.entries(SKILLS_TAXONOMY_MAP)) {
    for (const skill of skills) {
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'gi');
      const matches = textLower.match(regex);
      if (matches && matches.length > 0) {
        detectedSkills.push({ skill, category: cat, count: matches.length });
      }
    }
  }

  // Sort skills by occurrence frequency & deduplicate canonical forms (e.g. React vs React.js)
  detectedSkills.sort((a, b) => b.count - a.count);
  const rawDetected = Array.from(new Set(detectedSkills.map((s) => s.skill)));
  const allDetected = Array.from(new Set(rawDetected.map(canonicalizeSkill)));

  let mustHaveSkills = allDetected.slice(0, 4);
  let niceToHaveSkills = allDetected.slice(4, 9);

  // Check if JD explicitly states Must-Have / Required skills
  const mustMatch = cleanText.match(/(?:Must\s+Have|Mandatory|Required\s+Skills|Key\s+Skills)\s*[:–-]?\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  if (mustMatch) {
    const rawSection = mustMatch[1];
    const explicit = allDetected.filter((s) => new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawSection));
    if (explicit.length > 0) {
      mustHaveSkills = explicit.slice(0, 5);
      niceToHaveSkills = allDetected.filter((s) => !mustHaveSkills.includes(s)).slice(0, 5);
    }
  }

  if (mustHaveSkills.length === 0) {
    mustHaveSkills = ['TypeScript', 'Node.js', 'React.js'];
    niceToHaveSkills = ['Docker', 'AWS', 'MongoDB'];
  }

  // 7. Education Requirement
  let minQualification = 'Bachelor of Technology (B.Tech) / B.E. in Computer Science or Graduate Equivalent';
  if (/master|m\.?tech|mca|m\.?sc/i.test(cleanText)) {
    minQualification = 'Master of Technology (M.Tech) / MCA or Bachelor of Engineering';
  } else if (/mba/i.test(cleanText)) {
    minQualification = 'MBA / Post Graduate Degree';
  }

  // 8. Responsibilities & Requirements Extraction (Filter out social hashtags and recruiter marketing noise)
  const responsibilities: string[] = [];
  const requirements: string[] = [];

  const respMatch = cleanText.match(/(?:Responsibilities|Key\s+Responsibilities|What\s+You'll\s+Do|Role\s+Overview)([\s\S]*?)(?=\n\s*(?:Requirements|Qualifications|What\s+We're\s+Looking\s+For|Skills|Benefits)\b|$)/i);
  if (respMatch) {
    const respLines = respMatch[1].split('\n').map((l) => l.trim()).filter(Boolean);
    for (const l of respLines) {
      if (isNoisyLine(l)) continue;
      if (/^[•\-*]/.test(l) || l.length > 25) {
        responsibilities.push(l.replace(/^[•\-*\d.]+\s*/, '').trim());
      }
    }
  }

  const reqMatch = cleanText.match(/(?:Requirements|Qualifications|What\s+You\s+Need|Must\s+Have)([\s\S]*?)(?=\n\s*(?:Benefits|Perks|About\s+Us|What\s+We\s+Offer)\b|$)/i);
  if (reqMatch) {
    const reqLines = reqMatch[1].split('\n').map((l) => l.trim()).filter(Boolean);
    for (const l of reqLines) {
      if (isNoisyLine(l)) continue;
      if (/^[•\-*]/.test(l) || l.length > 25) {
        requirements.push(l.replace(/^[•\-*\d.]+\s*/, '').trim());
      }
    }
  }

  if (responsibilities.length === 0) {
    responsibilities.push(`Architect, develop, and maintain production-ready systems using ${mustHaveSkills.join(', ')}.`);
    responsibilities.push('Lead system design discussions, API contracts, and high-availability architecture.');
    responsibilities.push('Collaborate cross-functionally with Product, QA, and DevOps to deliver resilient features.');
  }

  if (requirements.length === 0) {
    requirements.push(`${minExp}+ years hands-on production experience in ${mustHaveSkills.slice(0, 3).join(', ')}.`);
    requirements.push(`Strong engineering fundamentals in data structures, microservices, and database performance.`);
    requirements.push(`Demonstrated ability to own end-to-end features in high-throughput agile environments.`);
  }

  const cleanOverview = lines
    .filter((l) => !isNoisyLine(l) && !l.toLowerCase().includes('job title:') && !l.toLowerCase().includes('hiring for'))
    .slice(0, 6)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 9. Craft the Comprehensive Recruiter Briefing ("Recruiter Playbook")
  const primaryStack = mustHaveSkills.slice(0, 3).join(', ');
  const secondaryStack = niceToHaveSkills.slice(0, 3).join(', ');

  const coreFocusAreas: RecruiterBriefing['coreFocusAreas'] = [
    {
      area: `Hands-on Depth in ${primaryStack}`,
      importance: 'CRITICAL',
      whatToProbe: `Verify the candidate actively authored code and solved concurrency/scaling issues, rather than just executing maintenance or minor bug fixes.`,
    },
    {
      area: `Architecture & Microservices Design`,
      importance: 'CRITICAL',
      whatToProbe: `Ask candidate how their services communicate (gRPC, REST, Kafka events) and how they handled failures, distributed transactions, or data consistency.`,
    },
    {
      area: `Secondary Ecosystem Fit (${secondaryStack || 'Cloud & Tooling'})`,
      importance: 'HIGH',
      whatToProbe: `Verify practical working exposure to secondary tools without treating lack of a minor tool as an immediate disqualifier.`,
    },
    {
      area: `Data Layer Optimization & Scalability`,
      importance: 'HIGH',
      whatToProbe: `Ask for concrete query optimization stories: indexing strategies, connection pooling, cache invalidation (Redis), or sharding.`,
    },
    {
      area: `Cloud Deployment & DevOps Hygiene`,
      importance: 'MEDIUM',
      whatToProbe: `Probe CI/CD familiarity: did they write Dockerfiles, configure Kubernetes manifests, or manage Terraform scripts, or rely on a separate Ops team?`,
    },
  ];

  const redFlags: string[] = [
    `Lists ${mustHaveSkills[0] || 'primary technologies'} on resume but struggles to explain basic event loop/concurrency or memory management on screening calls.`,
    `Short tenures (< 8 months) across multiple past companies with vague descriptions of personal contribution.`,
    `Only has experience with monolithic boilerplate code and has never debugged a production outage or latency spike.`,
    `Over-reliance on UI wrappers or third-party managed services without understanding underlying protocol and failure states.`,
  ];

  const greenFlags: string[] = [
    `Can immediately quote high-scale metrics: requests per second, payload size, database query latency reductions (e.g. "p99 reduced from 800ms to 45ms").`,
    `Strong code hygiene: writes unit tests (Jest, Go test, PyTest), designs idempotent endpoints, and adheres to strict Git branching/PR review workflows.`,
    `Has directly executed a cloud migration or microservice decoupling in a past company.`,
    `Clear, articulate communicator who translates technical trade-offs into business impact easily.`,
  ];

  // Sourcing Boolean Query
  const titleVariants = [
    title,
    `Senior ${title.replace(/Senior|Lead|Staff/i, '').trim()}`,
    `${mustHaveSkills[0] || 'Software'} Engineer`,
    `${mustHaveSkills[0] || 'Backend'} Developer`,
  ].filter(Boolean);

  const booleanSearchString = `(${titleVariants.map((t) => `"${t}"`).join(' OR ')}) AND (${mustHaveSkills.map((s) => `"${s}"`).join(' AND ')}) AND (${location.split(',')[0]} OR Remote)`;

  const screeningQuestions: RecruiterScreeningQuestion[] = [
    {
      question: `In your current project with ${mustHaveSkills[0] || 'your core stack'}, what was the most difficult scalability or latency bottleneck you personally resolved?`,
      category: 'troubleshooting',
      rationale: `Filters out theoretical candidates from hands-on builders who own real production systems.`,
      goodAnswerSignals: [
        'Explains the root cause (e.g. unindexed join, memory leak, blocked event loop, synchronous network hop).',
        'Describes measurement tools used (APM, pprof, Datadog, Grafana, Chrome DevTools).',
        'Quotes measurable before-and-after performance metrics.',
      ],
      redFlagSignals: [
        'Vague answer like "I optimized the code" or "DevOps resolved it".',
        'Cannot explain how they identified the bottleneck.',
      ],
    },
    {
      question: `How do you design APIs and services to ensure fault tolerance and zero data loss when downstream dependencies fail?`,
      category: 'architecture',
      rationale: `Validates distributed system thinking and resilient design fundamentals.`,
      goodAnswerSignals: [
        'Mentions circuit breakers, retry queues with exponential backoff, dead-letter queues (DLQ), and idempotent keys.',
        'Explains asynchronous message processing and fallback graceful degradation.',
      ],
      redFlagSignals: [
        'Assumes networks and downstream servers never fail.',
        'No concept of circuit breakers, timeouts, or retries.',
      ],
    },
    {
      question: `Walk me through your unit testing and CI/CD workflow from git push to production deployment.`,
      category: 'ownership',
      rationale: `Checks production maturity and engineering standards.`,
      goodAnswerSignals: [
        'Explains automated pipeline (linting, test coverage, Docker build, canary/blue-green deployments).',
        'Believes in test-driven development or comprehensive automated test suites.',
      ],
      redFlagSignals: [
        'Mentions manual FTP / SSH deployments or skipping tests before pushing to main.',
      ],
    },
    {
      question: `What is your current notice period, flexibility on joining date, and expected compensation?`,
      category: 'domain',
      rationale: `Crucial operational hygiene for internal recruiters to prevent late-stage dropouts.`,
      goodAnswerSignals: [
        'Clear buyout policy, official notice period (30 days or less preferred), and realistic market expectations.',
      ],
      redFlagSignals: [
        'Serving 90 days notice with zero flexibility or holding 5 counteroffers simultaneously.',
      ],
    },
  ];

  const targetPersonaStr = `Mid-to-Senior level specialist with ${minExp}–${maxExp} years delivering resilient cloud-native applications in fast-paced product environments.`;

  const briefing: RecruiterBriefing = {
    roleHeadline: `${title} (${workMode} - ${location})`,
    marketContext: `High-demand talent pool. Candidates with deep ${primaryStack} proficiency command high market leverage; screen tightly for hands-on production ownership.`,
    targetCandidatePersona: targetPersonaStr,
    candidatePersona: {
      archetype: title,
      summary: targetPersonaStr,
      seniorityBand: minExp >= 7 ? 'Principal / Lead' : minExp >= 5 ? 'Senior' : 'Mid-Level',
      traits: ['Hands-on engineering depth', 'Distributed systems design', 'Production ownership & clean testing'],
    },
    booleanSearchQuery: booleanSearchString,
    coreFocusAreas,
    redFlags,
    greenFlags,
    sourcingPlaybook: {
      booleanSearchString,
      alternativeTitles: Array.from(new Set(titleVariants)),
      targetIndustriesAndCompanies: ['B2B SaaS Unicorns', 'FinTech & Neobanks', 'High-Scale E-Commerce', 'Product Engineering Centers'],
      highYieldKeywords: [...mustHaveSkills, ...niceToHaveSkills, 'Microservices', 'Distributed Systems', 'High Availability'],
    },
    screeningQuestions,
  };

  return {
    title,
    department,
    location,
    workMode,
    minExperienceYears: minExp,
    maxExperienceYears: maxExp,
    experienceLevel: `${minExp}–${maxExp} Years`,
    salaryMin,
    salaryMax,
    currency: 'INR',
    openings: 1,
    skills: allDetected.length > 0 ? allDetected : [...mustHaveSkills, ...niceToHaveSkills],
    mustHaveSkills,
    niceToHaveSkills,
    minQualification,
    description: cleanOverview || cleanText.slice(0, 800).replace(/\s+/g, ' ').trim(),
    responsibilities,
    requirements,
    autoShortlistThreshold: 75,
    autoShortlistMode: 'assisted',
    briefing,
    source: 'rule_engine',
  };
}

/**
 * Optional LLM Enhancement: Uses Gemini or OpenAI API if configured in environment,
 * with automatic, seamless fallback to the local deterministic heuristic engine.
 */
export async function analyzeJobDescriptionWithAI(input: {
  rawText?: string;
  base64Data?: string;
  filename?: string;
  instructions?: string;
}): Promise<JobAnalysisResult> {
  let text = input.rawText || '';

  if (!text && input.base64Data) {
    try {
      const buf = Buffer.from(input.base64Data, 'base64');
      const val = validateResumeBuffer(buf);
      text = await extractTextFromBuffer(buf, val.format);
    } catch {
      text = '';
    }
  }

  if (!text || text.trim().length < 15) {
    throw new Error('Please provide job description text or upload a valid PDF/DOCX file.');
  }

  // 1. Generate base deterministic extraction
  const heuristicResult = extractJobDetailsHeuristically(text, input.filename || '');

  // 2. Check for LLM API keys for generative refinement
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const prompt = `You are NexaTalent's Principal Technical Recruitment AI. Analyze this Job Description and return a JSON object with this exact structure:
{
  "title": "string",
  "department": "string",
  "location": "string",
  "workMode": "Hybrid" | "Remote" | "On-site",
  "minExperienceYears": number,
  "maxExperienceYears": number,
  "mustHaveSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill3", "skill4"],
  "minQualification": "string",
  "salaryMin": number,
  "salaryMax": number,
  "briefing": {
    "roleHeadline": "string",
    "marketContext": "string",
    "targetCandidatePersona": "string",
    "coreFocusAreas": [
      { "area": "string", "importance": "CRITICAL" | "HIGH" | "MEDIUM", "whatToProbe": "string" }
    ],
    "redFlags": ["flag1", "flag2"],
    "greenFlags": ["flag1", "flag2"],
    "sourcingPlaybook": {
      "booleanSearchString": "string",
      "alternativeTitles": ["title1", "title2"],
      "targetIndustriesAndCompanies": ["industry1", "industry2"],
      "highYieldKeywords": ["kw1", "kw2"]
    },
    "screeningQuestions": [
      {
        "question": "string",
        "category": "technical",
        "rationale": "string",
        "goodAnswerSignals": ["string"],
        "redFlagSignals": ["string"]
      }
    ]
  }
}

JD TEXT:
${text.slice(0, 4000)}

Respond ONLY with valid JSON.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            ...heuristicResult,
            ...parsed,
            briefing: {
              ...heuristicResult.briefing,
              ...(parsed.briefing || {}),
            },
            source: 'ai_llm',
          };
        }
      }
    } catch (llmErr) {
      console.warn('[atsJobAssistant] Gemini enhancement skipped, using rule engine:', llmErr);
    }
  } else if (openAiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are NexaTalent Principal Technical Recruitment AI. Analyze the Job Description and return valid JSON with title, department, location, workMode, minExperienceYears, maxExperienceYears, mustHaveSkills, niceToHaveSkills, salaryMin, salaryMax, and briefing object.',
            },
            {
              role: 'user',
              content: text.slice(0, 4000),
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        const rawJson = data?.choices?.[0]?.message?.content;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            ...heuristicResult,
            ...parsed,
            briefing: {
              ...heuristicResult.briefing,
              ...(parsed.briefing || {}),
            },
            source: 'ai_llm',
          };
        }
      }
    } catch (llmErr) {
      console.warn('[atsJobAssistant] OpenAI enhancement skipped, using rule engine:', llmErr);
    }
  }

  // Fallback to high-accuracy deterministic rule engine
  return heuristicResult;
}
