/**
 * NexaTalent ATS Native Resume Parser & Text Extractor Service
 * High-performance, zero-cost, asynchronous parsing in native Node.js.
 * Supports PDF, DOC, DOCX and text documents.
 */

import zlib from 'zlib';

export interface SkillsByCategory {
  backend: string[];
  frontend: string[];
  cloudDevOps: string[];
  database: string[];
  architecture: string[];
  qaTesting: string[];
}

export interface ParsedResumeResult {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  totalExperienceYears: number;
  experienceString: string;
  skills: string[];
  skillsByCategory: SkillsByCategory;
  currentCompany: string;
  currentTitle: string;
  education: string[];
  noticePeriod: string;
  currentCtc: string;
  expectedCtc: string;
  confidenceScore: number;
  searchTokens: string[];
  rawTextPreview: string;
}

// Categorized Skills Taxonomy
export const SKILLS_TAXONOMY_MAP = {
  backend: [
    'Golang', 'Go', 'Node.js', 'Python', 'Java', 'Spring Boot', 'Django', 'FastAPI',
    'Flask', 'C#', '.NET', 'C++', 'Ruby', 'Ruby on Rails', 'PHP', 'Laravel', 'Rust', 'gRPC'
  ],
  frontend: [
    'React.js', 'React', 'TypeScript', 'JavaScript', 'Next.js', 'Vue.js', 'Angular',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'GraphQL', 'React Native', 'Flutter', 'Swift', 'Kotlin'
  ],
  cloudDevOps: [
    'GCP', 'Google Cloud', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'GKE', 'Cloud Run',
    'Cloud Functions', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Linux', 'DevOps'
  ],
  database: [
    'BigQuery', 'Snowflake', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka',
    'Elasticsearch', 'DynamoDB', 'SQL', 'NoSQL', 'Cassandra', 'Data Engineering', 'ETL'
  ],
  architecture: [
    'Microservices', 'Distributed Systems', 'System Design', 'REST APIs', 'Scalability',
    'High Availability', 'Event-Driven Architecture', 'Cloud Architecture'
  ],
  qaTesting: [
    'Unit Testing', 'Jest', 'Cypress', 'Selenium', 'Playwright', 'TDD', 'Integration Testing'
  ],
};

export const ALL_SKILLS = Array.from(new Set(Object.values(SKILLS_TAXONOMY_MAP).flat()));

const DEGREE_PATTERNS = [
  /\bB\.?Tech(?:\s*\(?[^,\n)]+\)?)?/i,
  /\bM\.?Tech(?:\s*\(?[^,\n)]+\)?)?/i,
  /\bB\.?E\.?(?:\s*\(?[^,\n)]+\)?)?/i,
  /\bM\.?E\.?(?:\s*\(?[^,\n)]+\)?)?/i,
  /\bB\.?S\.?c?(?:\s*\(?[^,\n)]+\)?)?/i,
  /\bM\.?S\.?c?(?:\s*\(?[^,\n)]+\)?)?/i,
  /\bBCA\b/i,
  /\bMCA\b/i,
  /\bMBA(?:\s*\(?[^,\n)]+\)?)?/i,
  /\bBBA\b/i,
  /\bB\.?Com\b/i,
  /\bM\.?Com\b/i,
  /\bPh\.?D\b/i,
  /\bDiploma\s+(?:in\s+[^,\n]+)/i,
];

const CITIES = [
  'Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Noida', 'Gurgaon',
  'Gurugram', 'Chennai', 'Kolkata', 'Ahmedabad', 'Kochi', 'Chandigarh', 'Jaipur', 'Indore',
  'Coimbatore', 'Remote', 'India',
];

/**
 * Validates the file buffer magic bytes for PDF, DOC, DOCX.
 */
export function validateResumeBuffer(buffer: Buffer): { valid: boolean; format: 'pdf' | 'docx' | 'doc' | 'text'; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { valid: false, format: 'text', error: 'File buffer is empty.' };
  }
  if (buffer.length > 10 * 1024 * 1024) {
    return { valid: false, format: 'text', error: 'File size exceeds 10 MB limit.' };
  }
  // PDF: %PDF
  if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { valid: true, format: 'pdf' };
  }
  // DOCX: PK\x03\x04
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return { valid: true, format: 'docx' };
  }
  // DOC: \xD0\xCF\x11\xE0
  if (buffer.length >= 4 && buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0) {
    return { valid: true, format: 'doc' };
  }
  // Text fallback
  const sample = buffer.slice(0, 100).toString('utf-8');
  if (/[\x20-\x7E\r\n\t]{10,}/.test(sample)) {
    return { valid: true, format: 'text' };
  }
  return { valid: false, format: 'text', error: 'Unsupported file format. Please upload PDF, DOC, or DOCX files.' };
}

/**
 * Native Node.js DOCX text extraction by decompressing word/document.xml.
 */
function extractDocxText(buffer: Buffer): string {
  try {
    let offset = 0;
    while (offset < buffer.length - 30) {
      if (buffer[offset] === 0x50 && buffer[offset + 1] === 0x4b && buffer[offset + 2] === 0x03 && buffer[offset + 3] === 0x04) {
        const compMethod = buffer.readUInt16LE(offset + 8);
        const compSize = buffer.readUInt32LE(offset + 18);
        const fnameLen = buffer.readUInt16LE(offset + 26);
        const extraLen = buffer.readUInt16LE(offset + 28);
        const fname = buffer.slice(offset + 30, offset + 30 + fnameLen).toString('utf-8');
        const dataOffset = offset + 30 + fnameLen + extraLen;

        if (fname === 'word/document.xml' && dataOffset + compSize <= buffer.length) {
          const compData = buffer.slice(dataOffset, dataOffset + compSize);
          let xmlStr = '';
          if (compMethod === 8) {
            xmlStr = zlib.inflateRawSync(compData).toString('utf-8');
          } else if (compMethod === 0) {
            xmlStr = compData.toString('utf-8');
          }
          if (xmlStr) {
            const matches = [...xmlStr.matchAll(/<w:t[^>]*>(.*?)<\/w:t>/g)].map((m) => m[1]);
            if (matches.length > 0) return matches.join(' ');
          }
        }
        offset = dataOffset + compSize;
      } else {
        offset++;
      }
    }
  } catch { /* fallback */ }
  return buffer.toString('utf-8').replace(/[^\x20-\x7E\t\r\n]+/g, ' ');
}

/**
 * Universal buffer text extractor for PDF, DOC, DOCX and TXT files.
 */
export function extractTextFromBuffer(buffer: Buffer, formatHint?: string): string {
  try {
    const validation = validateResumeBuffer(buffer);
    const format = formatHint || validation.format;

    if (format === 'docx') {
      const docxText = extractDocxText(buffer);
      if (docxText && docxText.length > 50) return docxText;
    }

    const raw = buffer.toString('utf-8');

    // PDF specific character stream & Tj run extractor
    if (format === 'pdf' || buffer.slice(0, 5).toString('ascii').startsWith('%PDF')) {
      const pdfTextTokens: string[] = [];
      const textMatches = raw.match(/\(([^()]{2,100})\)\s*Tj/g) || [];
      for (const m of textMatches) {
        const str = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '').trim();
        if (str && str.length > 1) pdfTextTokens.push(str);
      }
      if (pdfTextTokens.length > 15) {
        return pdfTextTokens.join(' ');
      }
      return raw.replace(/[^\x20-\x7E\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');
    }

    // DOC / binary text run extractor
    if (format === 'doc') {
      return raw.replace(/[^\x20-\x7E\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');
    }

    return raw;
  } catch {
    return buffer.toString('utf-8');
  }
}

/**
 * Structured resume text parser extracting metadata, skills matrix and search tokens.
 */
export function parseResumeText(text: string, filename = ''): ParsedResumeResult {
  const cleanText = (text || '').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Email extraction
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = cleanText.match(emailRegex);
  const email = emailMatch ? emailMatch[1].toLowerCase().trim() : '';

  // 2. Phone extraction (Indian + international phone patterns)
  const phoneRegex = /(?:(?:\+?91[\s.-]?)?0?)?([6-9]\d{4}[\s.-]?\d{5})/g;
  let phone = '';
  const phoneMatch = phoneRegex.exec(cleanText);
  if (phoneMatch) {
    phone = phoneMatch[0].replace(/[^\d+]/g, '');
    if (!phone.startsWith('+91') && phone.length === 10) phone = `+91 ${phone}`;
  }

  // 3. Name extraction
  let fullName = '';
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    if (
      lower.includes('curriculum') ||
      lower.includes('resume') ||
      lower.includes('cv') ||
      lower.includes('@') ||
      lower.includes('page ') ||
      lower.includes('http') ||
      lower.length > 50 ||
      lower.length < 2
    ) {
      continue;
    }
    if (/^[A-Za-z\s.'-]+$/.test(line) && line.split(' ').length <= 4) {
      fullName = line.trim();
      break;
    }
  }
  if (!fullName && filename) {
    const base = filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const stripped = base.replace(/resume|cv|profile|latest/gi, '').trim();
    if (stripped.length >= 2) fullName = stripped;
  }
  if (!fullName) fullName = email ? email.split('@')[0].replace(/[._]/g, ' ') : 'Candidate';

  // 4. Experience extraction
  let totalExperienceYears = 0;
  let expStr = '3–5 yrs';

  const expMatch1 = cleanText.match(/(?:Total\s+)?Experience\s*[:–-]?\s*(\d+(?:\.\d+)?)\s*(?:[-–to]+\s*(\d+(?:\.\d+)?))?\s*(?:years?|yrs?)/i);
  const expMatch2 = cleanText.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+relevant)?\s+experience/i);

  if (expMatch1) {
    totalExperienceYears = parseFloat(expMatch1[1]);
    expStr = expMatch1[2] ? `${expMatch1[1]}–${expMatch1[2]} yrs` : `${expMatch1[1]} yrs`;
  } else if (expMatch2) {
    totalExperienceYears = parseFloat(expMatch2[1]);
    expStr = `${expMatch2[1]} yrs`;
  } else {
    const genericExp = cleanText.match(/Experience:\s*([^·\n]+)/i);
    if (genericExp) {
      expStr = genericExp[1].trim();
      const num = parseInt(expStr, 10);
      if (!isNaN(num)) totalExperienceYears = num;
    }
  }

  // 5. Categorized Skills extraction
  const textLower = cleanText.toLowerCase();
  const skillsByCategory: SkillsByCategory = {
    backend: [],
    frontend: [],
    cloudDevOps: [],
    database: [],
    architecture: [],
    qaTesting: [],
  };

  const matchedSkills: string[] = [];

  for (const [cat, skills] of Object.entries(SKILLS_TAXONOMY_MAP)) {
    for (const skill of skills) {
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
      if (regex.test(textLower)) {
        (skillsByCategory as any)[cat].push(skill);
        matchedSkills.push(skill);
      }
    }
  }

  const uniqueSkills = Array.from(new Set(matchedSkills));

  // 6. Education extraction
  const education: string[] = [];
  for (const degRegex of DEGREE_PATTERNS) {
    const degMatch = cleanText.match(degRegex);
    if (degMatch && !education.includes(degMatch[0].trim())) {
      education.push(degMatch[0].trim());
    }
  }

  // 7. Location extraction
  let location = 'India';
  for (const city of CITIES) {
    const cityRegex = new RegExp(`\\b${city}\\b`, 'i');
    if (cityRegex.test(cleanText)) {
      location = city === 'Bangalore' ? 'Bengaluru, India' : `${city}, India`;
      break;
    }
  }

  // 8. Notice Period & CTC
  let noticePeriod = 'Immediate / 30 Days';
  const noticeMatch = cleanText.match(/Notice\s*Period\s*[:–-]?\s*([^·\n,\r]+)/i);
  if (noticeMatch) noticePeriod = noticeMatch[1].trim();

  let currentCtc = 'Competitive';
  const currCtcMatch = cleanText.match(/Current\s*(?:CTC|Salary)?\s*[:–-]?\s*([^·\n,\r]+)/i);
  if (currCtcMatch) currentCtc = currCtcMatch[1].trim();

  let expectedCtc = 'Competitive';
  const expCtcMatch = cleanText.match(/Expected\s*(?:CTC|Salary)?\s*[:–-]?\s*([^·\n,\r]+)/i);
  if (expCtcMatch) expectedCtc = expCtcMatch[1].trim();

  // 9. Current Title & Company
  let currentTitle = uniqueSkills.slice(0, 2).join(' / ') + ' Professional';
  let currentCompany = '';
  const compMatch = cleanText.match(/(?:\b(?:current\s+)?company\b|\bworking at\b|\bcurrently at\b|\bat\b)\s*[:–-]?\s*([A-Z][A-Za-z0-9\s&]{2,30}(?:Ltd|Pvt|Inc|Technologies|Solutions|Software|Services)?)/i);
  if (compMatch) currentCompany = compMatch[1].trim();

  // 10. Search indexing tokens
  const locationTokens = location.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const searchTokens = Array.from(
    new Set([
      fullName.toLowerCase(),
      email.toLowerCase(),
      location.toLowerCase(),
      ...locationTokens,
      ...uniqueSkills.map((s) => s.toLowerCase()),
      ...education.map((e) => e.toLowerCase()),
      currentTitle.toLowerCase(),
      currentCompany.toLowerCase(),
    ].filter(Boolean))
  );

  // 11. Confidence Scoring
  let score = 20;
  if (email) score += 25;
  if (phone) score += 20;
  if (uniqueSkills.length > 0) score += 20;
  if (totalExperienceYears > 0) score += 10;
  if (education.length > 0) score += 5;
  const confidenceScore = Math.min(100, score);

  return {
    fullName,
    email,
    phone,
    location,
    totalExperienceYears,
    experienceString: expStr,
    skills: uniqueSkills,
    skillsByCategory,
    currentCompany,
    currentTitle,
    education,
    noticePeriod,
    currentCtc,
    expectedCtc,
    confidenceScore,
    searchTokens,
    rawTextPreview: cleanText.slice(0, 500).replace(/\s+/g, ' ').trim(),
  };
}
