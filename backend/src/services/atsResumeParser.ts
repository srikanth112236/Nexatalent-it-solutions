/**
 * NexaTalent ATS Native Resume Parser & Text Extractor Service
 * High-performance, zero-cost, asynchronous parsing in native Node.js.
 * Supports PDF (Mozilla pdf.js engine), DOC, DOCX and text documents.
 */

import { createRequire } from 'module';
import zlib from 'zlib';

const require = createRequire(import.meta.url);
let pdfParse: any = null;
try {
  // Use direct lib path to bypass pdf-parse's top-level index.js debug test harness
  pdfParse = require('pdf-parse/lib/pdf-parse.js');
} catch (err) {
  console.warn('[atsResumeParser] pdf-parse library failed to load:', err);
}

export interface SkillsByCategory {
  backend: string[];
  frontend: string[];
  cloudDevOps: string[];
  database: string[];
  architecture: string[];
  qaTesting: string[];
}

export interface WorkExperienceEntry {
  company: string;
  role: string;
  duration?: string;
  highlights?: string[];
}

export interface ProjectEntry {
  name: string;
  role?: string;
  technologies?: string;
  highlights?: string[];
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
  summary?: string;
  workHistory?: WorkExperienceEntry[];
  projects?: ProjectEntry[];
  coreStrengths?: string[];
  education: string[];
  noticePeriod: string;
  currentCtc: string;
  expectedCtc: string;
  linkedinUrl?: string;
  portfolioSites?: string[];
  confidenceScore: number;
  searchTokens: string[];
  rawTextPreview: string;
}

// Categorized Skills Taxonomy
export const SKILLS_TAXONOMY_MAP = {
  backend: [
    'Golang', 'Go', 'Node.js', 'Express.js', 'Express', 'Python', 'Java', 'Spring Boot', 'Django', 'FastAPI',
    'Flask', 'C#', '.NET', 'C++', 'Ruby', 'Ruby on Rails', 'PHP', 'Laravel', 'Rust', 'gRPC', 'REST APIs', 'JWT', 'RBAC'
  ],
  frontend: [
    'React.js', 'React', 'TypeScript', 'JavaScript', 'Next.js', 'Vue.js', 'Angular',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Tailwind', 'Redux', 'GraphQL', 'React Native', 'Flutter', 'Swift', 'Kotlin',
    'Material UI', 'Ant Design', 'Framer Motion', 'GSAP', 'SCSS', 'Axios'
  ],
  cloudDevOps: [
    'GCP', 'Google Cloud', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'GKE', 'Cloud Run',
    'Cloud Functions', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Linux', 'DevOps', 'Git', 'GitHub', 'Vite', 'Webpack', 'Postman', 'Figma', 'Agile'
  ],
  database: [
    'MongoDB', 'Mongoose', 'BigQuery', 'Snowflake', 'PostgreSQL', 'MySQL', 'Redis', 'Kafka',
    'Elasticsearch', 'DynamoDB', 'SQL', 'NoSQL', 'Cassandra', 'Data Engineering', 'ETL'
  ],
  architecture: [
    'Microservices', 'Distributed Systems', 'System Design', 'Scalability',
    'High Availability', 'Event-Driven Architecture', 'Cloud Architecture'
  ],
  qaTesting: [
    'Unit Testing', 'Jest', 'Cypress', 'Selenium', 'Playwright', 'TDD', 'Integration Testing'
  ],
};

export const ALL_SKILLS = Array.from(new Set(Object.values(SKILLS_TAXONOMY_MAP).flat()));

const DEGREE_PATTERNS = [
  /\b(?:Bachelor|Master)\s+of\s+[A-Za-z\s]+(?:\s*\([^)]+\))?/i,
  /\bB\.?Tech(?:\s+in\s+[A-Za-z\s]+)?/i,
  /\bM\.?Tech(?:\s+in\s+[A-Za-z\s]+)?/i,
  /\b(?:B\.E\.|B\.E\b|Bachelor of Engineering)(?:\s+in\s+[A-Za-z\s]+)?/i,
  /\b(?:M\.E\.|M\.E\b|Master of Engineering)(?:\s+in\s+[A-Za-z\s]+)?/i,
  /\bB\.?Sc(?:\s+in\s+[A-Za-z\s]+)?/i,
  /\bM\.?Sc(?:\s+in\s+[A-Za-z\s]+)?/i,
  /\bBCA\b/i,
  /\bMCA\b/i,
  /\bMBA(?:\s+in\s+[A-Za-z\s]+)?/i,
  /\bBBA\b/i,
  /\bB\.?Com(?:\s*\([^)]+\))?/i,
  /\bM\.?Com(?:\s*\([^)]+\))?/i,
  /\bPh\.?D\b/i,
  /\bDiploma\s+(?:in\s+[^,\n|]+)/i,
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
 * Uses Mozilla pdf.js engine via pdf-parse to decode FlateDecode streams accurately.
 */
export async function extractTextFromBuffer(buffer: Buffer, formatHint?: string): Promise<string> {
  try {
    const validation = validateResumeBuffer(buffer);
    const format = formatHint || validation.format;

    // DOCX extraction
    if (format === 'docx') {
      const docxText = extractDocxText(buffer);
      if (docxText && docxText.length > 50) return docxText;
    }

    // PDF extraction via pdf-parse Mozilla pdf.js engine
    if (format === 'pdf' || (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46)) {
      if (typeof pdfParse === 'function') {
        try {
          const parsed = await pdfParse(buffer);
          if (parsed && parsed.text && parsed.text.trim().length > 30) {
            return parsed.text;
          }
        } catch {
          // fallback to character stream regex
        }
      }

      // Fallback PDF character stream & Tj run extractor
      const raw = buffer.toString('utf-8');
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
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');
    }

    return buffer.toString('utf-8');
  } catch {
    return buffer.toString('utf-8');
  }
}

/**
 * Structured resume text parser extracting comprehensive candidate profile metadata.
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
    const rawDigits = phoneMatch[0].replace(/[^\d+]/g, '');
    if (rawDigits.startsWith('+91') && rawDigits.length === 13) {
      phone = `+91 ${rawDigits.slice(3)}`;
    } else if (rawDigits.length === 10) {
      phone = `+91 ${rawDigits}`;
    } else {
      phone = rawDigits;
    }
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
      lower.length < 2 ||
      /(?:endobj|obj|stream|endstream|xref|trailer|startxref)/i.test(line)
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

  // 4. Professional Summary
  let summary = '';
  const sumMatch = cleanText.match(/(?:PROFESSIONAL\s+SUMMARY|SUMMARY|PROFILE|EXECUTIVE\s+SUMMARY)\s*[:–-]?\s*\n([\s\S]*?)(?=\n\s*(?:TECHNICAL\s+SKILLS|SKILLS|CORE\s+COMPETENCIES|EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|WORK\s+EXPERIENCE)\b)/i);
  if (sumMatch) {
    summary = sumMatch[1].split('\n').map((l) => l.trim()).filter(Boolean).join(' ');
  }

  // 5. Core Strengths
  let coreStrengths: string[] = [];
  const csMatch = cleanText.match(/Core\s*Strengths\s*[:\s-]*([\s\S]*?)(?=\n\s*(?:PROFESSIONAL\s+EXPERIENCE|WORK\s+EXPERIENCE|EXPERIENCE|TECHNICAL\s+SKILLS)\b)/i);
  if (csMatch) {
    coreStrengths = csMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ')
      .split(/[,|•]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2 && s.length < 60);
  }

  // 6. Experience extraction
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

  // 7. Work History & Companies Working Data
  const workHistory: WorkExperienceEntry[] = [];
  const expMatch = cleanText.match(/(?:PROFESSIONAL\s+EXPERIENCE|WORK\s+EXPERIENCE|WORK\s+HISTORY)([\s\S]*?)(?=\n\s*(?:FEATURED\s+PROJECT|PROJECTS|EDUCATION|PORTFOLIO|CERTIFICATIONS|AWARDS)\b)/i);
  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|Present|Current)\b/i;
  const yearRangeRegex = /\b(?:20\d\d|19\d\d)\s*[-–—to]+\s*(?:20\d\d|19\d\d|Present|Current)\b/i;

  if (expMatch) {
    const expSection = expMatch[1];
    const expLines = expSection.split('\n').map((l) => l.trim()).filter(Boolean);
    let currentEntry: WorkExperienceEntry | null = null;

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const hasCompanySeparator = line.includes('—') || line.includes('–') || line.includes('|') || line.includes(' - ');
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');

      if (hasCompanySeparator && !isBullet) {
        let parts: string[] = [];
        if (line.includes('|')) {
          parts = line.split('|').map((p) => p.trim());
        } else if (line.includes('—')) {
          parts = line.split('—').map((p) => p.trim());
        } else if (line.includes('–')) {
          parts = line.split('–').map((p) => p.trim());
        } else {
          parts = line.split(' - ').map((p) => p.trim());
        }

        const company = parts[0].replace(/^[•\-*]\s*/, '').trim();
        let role = parts[1] || '';
        let duration = '';

        if (parts.length >= 3) {
          if (dateRegex.test(parts[2]) || yearRangeRegex.test(parts[2])) {
            duration = parts[2];
          } else {
            role = parts.slice(1).join(' — ');
          }
        }

        if (!duration && i + 1 < expLines.length && (dateRegex.test(expLines[i + 1]) || yearRangeRegex.test(expLines[i + 1]))) {
          duration = expLines[i + 1];
          i++;
        }

        if (currentEntry) workHistory.push(currentEntry);

        currentEntry = {
          company,
          role,
          duration,
          highlights: [],
        };
      } else if (currentEntry && isBullet) {
        currentEntry.highlights = currentEntry.highlights || [];
        currentEntry.highlights.push(line.replace(/^[•\-*]\s*/, '').trim());
      } else if (currentEntry && !isBullet && (dateRegex.test(line) || yearRangeRegex.test(line))) {
        currentEntry.duration = line;
      } else if (currentEntry && !isBullet && currentEntry.highlights && currentEntry.highlights.length > 0) {
        currentEntry.highlights[currentEntry.highlights.length - 1] += ' ' + line;
      }
    }
    if (currentEntry) workHistory.push(currentEntry);
  }

  // 8. Categorized Skills extraction
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

  // 9. Featured Projects
  const projects: ProjectEntry[] = [];
  const projMatch = cleanText.match(/(?:FEATURED\s+PROJECT|PROJECTS|KEY\s+PROJECTS)([\s\S]*?)(?=\n\s*(?:EDUCATION|PORTFOLIO|SKILLS|CERTIFICATIONS)\b)/i);
  if (projMatch) {
    const projSection = projMatch[1];
    const pLines = projSection.split('\n').map((l) => l.trim()).filter(Boolean);
    let curProj: ProjectEntry | null = null;

    for (let i = 0; i < pLines.length; i++) {
      const l = pLines[i];
      const isBullet = l.startsWith('•') || l.startsWith('-') || l.startsWith('*');
      if (!isBullet && (l.includes('—') || l.includes('–') || l.includes('('))) {
        if (curProj) projects.push(curProj);
        let role = '';
        if (i + 1 < pLines.length && !pLines[i + 1].startsWith('•') && !pLines[i + 1].startsWith('-')) {
          role = pLines[i + 1];
          i++;
        }
        curProj = {
          name: l.replace(/^[•\-*]\s*/, '').trim(),
          role,
          highlights: [],
        };
      } else if (curProj && isBullet) {
        curProj.highlights = curProj.highlights || [];
        curProj.highlights.push(l.replace(/^[•\-*]\s*/, '').trim());
      } else if (curProj && !isBullet && curProj.highlights && curProj.highlights.length > 0) {
        curProj.highlights[curProj.highlights.length - 1] += ' ' + l;
      }
    }
    if (curProj) projects.push(curProj);
  }

  // 10. Education extraction (degree, institution & years)
  const education: string[] = [];
  const eduMatch = cleanText.match(/(?:EDUCATION|ACADEMICS)([\s\S]*?)(?=\n\s*(?:PORTFOLIO|CERTIFICATIONS|SKILLS|PROJECTS)\b|$)/i);
  if (eduMatch) {
    const eLines = eduMatch[1].split('\n').map((l) => l.trim()).filter(Boolean);
    for (const l of eLines) {
      if (/(?:Bachelor|Master|B\.?Tech|M\.?Tech|B\.?E\.|M\.?E\.|BCA|MCA|MBA|BBA|B\.?Com|M\.?Com|Ph\.?D|Diploma)/i.test(l)) {
        education.push(l.replace(/^[•\-*]\s*/, '').trim());
      }
    }
  }
  if (education.length === 0) {
    for (const degRegex of DEGREE_PATTERNS) {
      const degMatch = cleanText.match(degRegex);
      if (degMatch) {
        const val = degMatch[0].trim();
        if (!education.some((e) => e.includes(val) || val.includes(e))) {
          education.push(val);
        }
      }
    }
  }

  // 11. Location extraction
  let location = 'India';
  for (const city of CITIES) {
    const cityRegex = new RegExp(`\\b${city}\\b`, 'i');
    if (cityRegex.test(cleanText)) {
      location = city === 'Bangalore' ? 'Bengaluru, India' : `${city}, India`;
      break;
    }
  }

  // 12. Notice Period & CTC
  let noticePeriod = 'Immediate / 30 Days';
  const noticeMatch = cleanText.match(/Notice\s*Period\s*[:–-]?\s*([^·\n,\r]+)/i);
  if (noticeMatch) noticePeriod = noticeMatch[1].trim();

  let currentCtc = 'Competitive';
  const currCtcMatch = cleanText.match(/Current\s*(?:CTC|Salary)?\s*[:–-]?\s*([^·\n,\r]+)/i);
  if (currCtcMatch) currentCtc = currCtcMatch[1].trim();

  let expectedCtc = 'Competitive';
  const expCtcMatch = cleanText.match(/Expected\s*(?:CTC|Salary)?\s*[:–-]?\s*([^·\n,\r]+)/i);
  if (expCtcMatch) expectedCtc = expCtcMatch[1].trim();

  // 13. Current Title & Company
  let currentTitle = '';
  let currentCompany = '';

  // Check header lines 1-4 for candidate title
  for (let i = 1; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (/(?:Engineer|Developer|Architect|Lead|Manager|Consultant|Designer|Specialist|Analyst|Scientist|Programmer|Administrator)/i.test(line)) {
      const cleanRole = line.split('|')[0]
        .replace(/[\d+()\-–—]{7,}/g, '')
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
        .replace(/\b(Bengaluru|Bangalore|Hyderabad|Pune|Mumbai|Delhi|Noida|Gurgaon|Chennai|Remote|India|KA|MH|DL)\b.*/gi, '')
        .trim();
      if (cleanRole.length >= 3 && cleanRole.length <= 60) {
        currentTitle = cleanRole;
        break;
      }
    }
  }

  // If work history exists, sync currentCompany and currentTitle from most recent position
  if (workHistory.length > 0) {
    currentCompany = workHistory[0].company;
    if (!currentTitle || currentTitle.includes('Professional')) {
      if (workHistory[0].role) currentTitle = workHistory[0].role;
    }
  }

  // Fallback company regex
  if (!currentCompany) {
    const compMatch = cleanText.match(/(?:\b(?:current\s+)?company\b|\bworking at\b|\bcurrently at\b|\bat\b)\s*[:–-]?\s*([A-Z][A-Za-z0-9\s&]{2,30}(?:Ltd|Pvt|Inc|Technologies|Solutions|Software|Services|Consulting|Corp)?)/i);
    if (compMatch) currentCompany = compMatch[1].trim();
  }

  if (!currentTitle) {
    currentTitle = uniqueSkills.slice(0, 2).join(' / ') + ' Professional';
  }

  // 14. Links (LinkedIn & Portfolios)
  let linkedinUrl = '';
  const linkedinMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    linkedinUrl = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  const portfolioSites: string[] = [];
  const portMatch = cleanText.match(/(?:PORTFOLIO|LIVE\s+PROJECTS)([\s\S]*?)$/i);
  if (portMatch) {
    const rawPortLine = portMatch[1].split('\n').map((l) => l.trim()).filter(Boolean)[0] || '';
    if (rawPortLine.includes('|')) {
      const parts = rawPortLine.split('|').map((p) => p.trim()).filter(Boolean);
      for (const p of parts) {
        if (!p.includes('linkedin.com') && !portfolioSites.includes(p)) {
          portfolioSites.push(p);
        }
      }
    } else {
      const links = portMatch[1].match(/[a-zA-Z0-9-]+\.(?:com|in|au|app|net|io|org|co|dev)(?:\/[a-zA-Z0-9._/-]+)?/gi);
      if (links) {
        for (const l of links) {
          if (!l.includes('linkedin.com') && !portfolioSites.includes(l)) {
            portfolioSites.push(l);
          }
        }
      }
    }
  }

  // 15. Search indexing tokens
  const locationTokens = location.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const companyTokens = workHistory.map((w) => w.company.toLowerCase());
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
      ...companyTokens,
      ...coreStrengths.map((s) => s.toLowerCase()),
    ].filter(Boolean))
  );

  // 16. Confidence Scoring
  let score = 20;
  if (email) score += 20;
  if (phone) score += 15;
  if (uniqueSkills.length > 0) score += 15;
  if (workHistory.length > 0) score += 15;
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
    summary: summary || undefined,
    workHistory: workHistory.length > 0 ? workHistory : undefined,
    projects: projects.length > 0 ? projects : undefined,
    coreStrengths: coreStrengths.length > 0 ? coreStrengths : undefined,
    education,
    noticePeriod,
    currentCtc,
    expectedCtc,
    linkedinUrl: linkedinUrl || undefined,
    portfolioSites: portfolioSites.length > 0 ? portfolioSites : undefined,
    confidenceScore,
    searchTokens,
    rawTextPreview: cleanText.slice(0, 500).replace(/\s+/g, ' ').trim(),
  };
}
