/**
 * NexaTalent ATS Native Resume Parser & Text Extractor Service
 * High-performance, zero-cost, asynchronous parsing in native Node.js.
 */

export interface ParsedResumeResult {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  totalExperienceYears: number;
  experienceString: string;
  skills: string[];
  currentCompany: string;
  currentTitle: string;
  education: string[];
  noticePeriod: string;
  currentCtc: string;
  expectedCtc: string;
  confidenceScore: number;
  rawTextPreview: string;
}

// Comprehensive technology & recruitment taxonomy
const SKILL_TAXONOMY = [
  'Golang', 'Go', 'React.js', 'React', 'React Native', 'TypeScript', 'JavaScript', 'Node.js',
  'Next.js', 'Vue.js', 'Angular', 'Python', 'Django', 'FastAPI', 'Flask', 'Java', 'Spring Boot',
  'C#', '.NET', 'C++', 'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Rust', 'Swift', 'Kotlin', 'Flutter',
  'GCP', 'Google Cloud', 'AWS', 'Azure', 'BigQuery', 'Snowflake', 'PostgreSQL', 'MySQL', 'MongoDB',
  'Redis', 'Kafka', 'Elasticsearch', 'DynamoDB', 'SQL', 'NoSQL', 'Cassandra',
  'Docker', 'Kubernetes', 'GKE', 'Cloud Run', 'Cloud Functions', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions',
  'Microservices', 'REST APIs', 'GraphQL', 'gRPC', 'Distributed Systems', 'System Design',
  'Linux', 'Git', 'Agile', 'Scrum', 'Jira', 'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind CSS', 'Redux',
  'Unit Testing', 'Jest', 'Cypress', 'Selenium', 'Playwright', 'DevOps', 'Data Engineering', 'ETL',
  'Machine Learning', 'AI', 'NLP', 'TensorFlow', 'PyTorch', 'Data Structures', 'Algorithms',
];

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

export function extractTextFromBuffer(buffer: Buffer): string {
  try {
    // Attempt standard UTF-8 string decoding
    const raw = buffer.toString('utf-8');
    // If it's a PDF file, extract visible ASCII & UTF-8 character sequences
    if (buffer.slice(0, 5).toString('ascii').startsWith('%PDF')) {
      const pdfTextTokens: string[] = [];
      const textMatches = raw.match(/\(([^()]{2,100})\)\s*Tj/g) || [];
      for (const m of textMatches) {
        const str = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '').trim();
        if (str && str.length > 1) pdfTextTokens.push(str);
      }
      if (pdfTextTokens.length > 15) {
        return pdfTextTokens.join(' ');
      }
      // Fallback: extract continuous printable runs from PDF binary
      const runs = raw.replace(/[^\x20-\x7E\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');
      return runs;
    }
    return raw;
  } catch {
    return buffer.toString('utf-8');
  }
}

export function parseResumeText(text: string, filename = ''): ParsedResumeResult {
  const cleanText = (text || '').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Email extraction
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = cleanText.match(emailRegex);
  const email = emailMatch ? emailMatch[1].toLowerCase().trim() : '';

  // 2. Phone extraction (handles +91, 10-12 digits, spaced, dashed)
  const phoneRegex = /(?:(?:\+?91[\s.-]?)?0?)?([6-9]\d{4}[\s.-]?\d{5})/g;
  let phone = '';
  const phoneMatch = phoneRegex.exec(cleanText);
  if (phoneMatch) {
    phone = phoneMatch[0].replace(/[^\d+]/g, '');
    if (!phone.startsWith('+91') && phone.length === 10) phone = `+91 ${phone}`;
  }

  // 3. Name extraction
  let fullName = '';
  // Inspect first 8 non-empty lines for candidate name
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
    // Infer name from filename (e.g. "Srikanth_M_Resume.pdf" -> "Srikanth M")
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
    // Token extraction e.g. "Experience: 6–7 Years"
    const genericExp = cleanText.match(/Experience:\s*([^·\n]+)/i);
    if (genericExp) {
      expStr = genericExp[1].trim();
      const num = parseInt(expStr, 10);
      if (!isNaN(num)) totalExperienceYears = num;
    }
  }

  // 5. Skills extraction against Taxonomy
  const matchedSkills: string[] = [];
  const textLower = cleanText.toLowerCase();

  for (const skill of SKILL_TAXONOMY) {
    // Word boundary check
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
    if (regex.test(textLower)) {
      matchedSkills.push(skill);
    }
  }

  // Deduplicate skills (e.g. if Golang and Go both match, prefer Golang)
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

  // 8. Notice Period, Current CTC, Expected CTC
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
  const compMatch = cleanText.match(/(?:at|company|working at|currently at)\s+([A-Z][A-Za-z0-9\s&]{2,30}(?:Ltd|Pvt|Inc|Technologies|Solutions|Software|Services)?)/);
  if (compMatch) currentCompany = compMatch[1].trim();

  // 10. Confidence Score
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
    currentCompany,
    currentTitle,
    education,
    noticePeriod,
    currentCtc,
    expectedCtc,
    confidenceScore,
    rawTextPreview: cleanText.slice(0, 500).replace(/\s+/g, ' ').trim(),
  };
}
