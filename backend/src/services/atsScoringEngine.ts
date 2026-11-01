/**
 * NexaTalent ATS Job Match Scoring & Auto-Shortlisting Engine
 * Deterministic, weighted 5-pillar matching algorithm evaluating candidates
 * against structured job criteria (Must-have skills, Experience, Title, Education, Location).
 */

export interface JobRequirements {
  id?: string;
  title: string;
  skills?: string[];
  mustHaveSkills?: string[];
  niceToHaveSkills?: string[];
  minExperienceYears?: number;
  maxExperienceYears?: number;
  minQualification?: string;
  requiredLocation?: string[] | string;
  location?: string;
  workMode?: string;
  autoShortlistThreshold?: number;
  autoShortlistMode?: 'assisted' | 'automatic';
}

export interface CandidateEvaluationData {
  id?: string;
  name?: string;
  email?: string;
  skills?: string[] | string;
  experienceYears?: number;
  totalExperienceYears?: number;
  currentTitle?: string;
  roleTitle?: string;
  headline?: string;
  currentCompany?: string;
  education?: string[] | string;
  location?: string;
  workHistory?: { company: string; role: string; duration?: string; highlights?: string[] }[];
  searchTokens?: string[];
}

export interface AtsScoreBreakdown {
  mustHaveSkillsScore: number; // max 40
  experienceScore: number;     // max 25
  titleScore: number;          // max 15
  educationScore: number;      // max 10
  bonusFitScore: number;       // max 10
}

export interface AtsMatchResult {
  score: number; // 0–100
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  isShortlistEligible: boolean;
  threshold: number;
  breakdown: AtsScoreBreakdown;
  matchedMustHaveSkills: string[];
  missingMustHaveSkills: string[];
  matchedNiceToHaveSkills: string[];
  missingNiceToHaveSkills: string[];
  experienceMatchStatus: 'EXACT_RANGE' | 'SLIGHTLY_BELOW' | 'UNDERQUALIFIED' | 'OVERQUALIFIED';
  titleMatchStatus: 'DIRECT_MATCH' | 'RELATED_MATCH' | 'NO_MATCH';
  educationMatchStatus: 'QUALIFIED' | 'PARTIAL' | 'UNSPECIFIED';
  locationMatchStatus: 'COMPATIBLE' | 'REMOTE_FRIENDLY' | 'RELOCATION_REQUIRED';
  explanation: string;
}

// Common skill synonyms dictionary for fuzzy matching
const SYNONYMS: Record<string, string[]> = {
  react: ['react.js', 'reactjs', 'react native'],
  'react.js': ['react', 'reactjs'],
  node: ['node.js', 'nodejs'],
  'node.js': ['node', 'nodejs'],
  express: ['express.js', 'expressjs'],
  'express.js': ['express', 'expressjs'],
  ts: ['typescript'],
  typescript: ['ts'],
  js: ['javascript'],
  javascript: ['js'],
  golang: ['go'],
  go: ['golang'],
  k8s: ['kubernetes'],
  kubernetes: ['k8s'],
  postgres: ['postgresql'],
  postgresql: ['postgres'],
  mongo: ['mongodb', 'mongoose'],
  mongodb: ['mongo', 'mongoose'],
  aws: ['amazon web services'],
  gcp: ['google cloud', 'google cloud platform'],
  tailwind: ['tailwind css', 'tailwindcss'],
  'tailwind css': ['tailwind', 'tailwindcss'],
  rest: ['rest api', 'rest apis', 'restful'],
  'rest apis': ['rest', 'rest api', 'restful'],
  graphql: ['gql'],
  next: ['next.js', 'nextjs'],
  'next.js': ['next', 'nextjs'],
};

/**
 * Normalizes skill strings by removing symbols and whitespaces.
 */
function clean(str: string): string {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if a candidate possesses a target skill using direct, substring, and synonym matching.
 */
export function matchesSkill(targetSkill: string, candidateSkills: string[]): boolean {
  if (!targetSkill || !candidateSkills || candidateSkills.length === 0) return false;
  const targetClean = clean(targetSkill);
  if (!targetClean) return false;

  const targetLower = targetSkill.toLowerCase().trim();
  const synonyms = SYNONYMS[targetLower] || [];
  const cleanSynonyms = synonyms.map(clean);

  for (const cs of candidateSkills) {
    const cClean = clean(cs);
    if (!cClean) continue;

    // Exact or direct match
    if (cClean === targetClean) return true;

    // Synonym match
    if (cleanSynonyms.includes(cClean)) return true;

    // Substring match with minimum character threshold (to avoid 'c' matching 'css')
    if (targetClean.length >= 4 && cClean.includes(targetClean)) return true;
    if (cClean.length >= 4 && targetClean.includes(cClean)) return true;
  }
  return false;
}

/**
 * Parses raw skill inputs into clean string arrays.
 */
export function normalizeSkillList(skillsInput: string[] | string | undefined): string[] {
  if (!skillsInput) return [];
  if (Array.isArray(skillsInput)) {
    return skillsInput.map((s) => String(s).trim()).filter(Boolean);
  }
  return String(skillsInput).split(/[,|\n]/).map((s) => s.trim()).filter(Boolean);
}

/**
 * Evaluates candidate data against a job requisition and computes the weighted ATS score.
 */
export function calculateJobAtsMatch(candidate: CandidateEvaluationData, job: JobRequirements): AtsMatchResult {
  const candidateSkills = normalizeSkillList(candidate.skills);
  const threshold = job.autoShortlistThreshold !== undefined ? job.autoShortlistThreshold : 75;

  // Derive Must-Have and Nice-to-Have skills
  let mustHave = normalizeSkillList(job.mustHaveSkills);
  let niceToHave = normalizeSkillList(job.niceToHaveSkills);

  if (mustHave.length === 0) {
    const allJobSkills = normalizeSkillList(job.skills);
    mustHave = allJobSkills.slice(0, 3);
    niceToHave = allJobSkills.slice(3);
  }

  // -------------------------------------------------------------
  // PILLAR 1: Must-Have Skills Scoring (Max 40 Points)
  // -------------------------------------------------------------
  const matchedMustHaveSkills: string[] = [];
  const missingMustHaveSkills: string[] = [];

  for (const s of mustHave) {
    if (matchesSkill(s, candidateSkills)) {
      matchedMustHaveSkills.push(s);
    } else {
      missingMustHaveSkills.push(s);
    }
  }

  const mustHaveSkillsScore = mustHave.length > 0
    ? Math.round((matchedMustHaveSkills.length / mustHave.length) * 40 * 10) / 10
    : 40;

  // -------------------------------------------------------------
  // PILLAR 2: Experience Alignment (Max 25 Points)
  // -------------------------------------------------------------
  const candExp = candidate.experienceYears !== undefined
    ? candidate.experienceYears
    : candidate.totalExperienceYears !== undefined
    ? candidate.totalExperienceYears
    : 3;

  const minExp = job.minExperienceYears !== undefined ? job.minExperienceYears : 3;
  const maxExp = job.maxExperienceYears !== undefined ? job.maxExperienceYears : Math.max(minExp + 3, 7);

  let experienceScore = 0;
  let experienceMatchStatus: AtsMatchResult['experienceMatchStatus'] = 'EXACT_RANGE';

  if (candExp >= minExp && candExp <= maxExp + 2) {
    experienceScore = 25;
    experienceMatchStatus = 'EXACT_RANGE';
  } else if (candExp >= minExp - 1 && candExp < minExp) {
    experienceScore = 18;
    experienceMatchStatus = 'SLIGHTLY_BELOW';
  } else if (candExp >= minExp - 2 && candExp < minExp - 1) {
    experienceScore = 10;
    experienceMatchStatus = 'SLIGHTLY_BELOW';
  } else if (candExp > maxExp + 2) {
    experienceScore = 20; // Highly experienced / senior
    experienceMatchStatus = 'OVERQUALIFIED';
  } else {
    experienceScore = 0;
    experienceMatchStatus = 'UNDERQUALIFIED';
  }

  // -------------------------------------------------------------
  // PILLAR 3: Role Title & Domain Alignment (Max 15 Points)
  // -------------------------------------------------------------
  const jobTitleTokens = clean(job.title);
  const candTitles: string[] = [
    candidate.currentTitle || '',
    candidate.roleTitle || '',
    candidate.headline || '',
    ...(candidate.workHistory || []).map((w) => w.role || ''),
  ].filter(Boolean);

  let titleScore = 0;
  let titleMatchStatus: AtsMatchResult['titleMatchStatus'] = 'NO_MATCH';

  const domainKeywords = [
    'fullstack', 'frontend', 'backend', 'devops', 'cloud', 'security',
    'architect', 'lead', 'developer', 'engineer', 'specialist', 'manager',
    'react', 'node', 'golang', 'python', 'java', 'sre', 'qa', 'testing'
  ];

  for (const title of candTitles) {
    const tClean = clean(title);
    if (!tClean) continue;

    if (tClean === jobTitleTokens) {
      titleScore = 15;
      titleMatchStatus = 'DIRECT_MATCH';
      break;
    }

    const hasSharedDomain = domainKeywords.some((d) => tClean.includes(d) && jobTitleTokens.includes(d));
    if (hasSharedDomain) {
      const isSeniorMatch = (tClean.includes('senior') && jobTitleTokens.includes('senior')) ||
                            (tClean.includes('lead') && jobTitleTokens.includes('lead'));
      const scoreCand = isSeniorMatch ? 15 : 12;
      if (scoreCand > titleScore) {
        titleScore = scoreCand;
        titleMatchStatus = isSeniorMatch ? 'DIRECT_MATCH' : 'RELATED_MATCH';
      }
    }
  }

  // -------------------------------------------------------------
  // PILLAR 4: Education & Qualifications Match (Max 10 Points)
  // -------------------------------------------------------------
  const eduString = Array.isArray(candidate.education)
    ? candidate.education.join(' ')
    : String(candidate.education || '');
  const eduLower = eduString.toLowerCase();

  let educationScore = 10;
  let educationMatchStatus: AtsMatchResult['educationMatchStatus'] = 'QUALIFIED';

  const techDegreeRegex = /\b(?:b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|bca|mca|b\.?sc|m\.?sc|engineering|computer\s+science|information\s+technology)\b/i;
  const anyDegreeRegex = /\b(?:bachelor|master|b\.?com|bba|m\.?com|mba|diploma|degree)\b/i;

  if (techDegreeRegex.test(eduLower)) {
    educationScore = 10;
    educationMatchStatus = 'QUALIFIED';
  } else if (anyDegreeRegex.test(eduLower)) {
    // If degree is in other discipline but candidate has 3+ years experience, grant 8/10
    educationScore = candExp >= 3 ? 8 : 6;
    educationMatchStatus = 'PARTIAL';
  } else if (!eduLower || eduLower.length < 3) {
    educationScore = candExp >= 4 ? 8 : 6;
    educationMatchStatus = 'UNSPECIFIED';
  }

  // -------------------------------------------------------------
  // PILLAR 5: Secondary Skills & Location Fit (Max 10 Points)
  // -------------------------------------------------------------
  const matchedNiceToHaveSkills: string[] = [];
  const missingNiceToHaveSkills: string[] = [];

  for (const s of niceToHave) {
    if (matchesSkill(s, candidateSkills)) {
      matchedNiceToHaveSkills.push(s);
    } else {
      missingNiceToHaveSkills.push(s);
    }
  }

  const secondaryScore = niceToHave.length > 0
    ? (matchedNiceToHaveSkills.length / niceToHave.length) * 5
    : 5;

  let locationScore = 3;
  let locationMatchStatus: AtsMatchResult['locationMatchStatus'] = 'COMPATIBLE';

  const jobLocation = (job.location || '').toLowerCase();
  const candLocation = (candidate.location || '').toLowerCase();
  const isRemoteJob = (job.workMode || '').toLowerCase().includes('remote') || jobLocation.includes('remote');

  if (isRemoteJob) {
    locationScore = 5;
    locationMatchStatus = 'REMOTE_FRIENDLY';
  } else if (jobLocation && candLocation && (candLocation.includes('bengaluru') && jobLocation.includes('bengaluru') || candLocation.includes('pune') && jobLocation.includes('pune') || candLocation.includes('hyderabad') && jobLocation.includes('hyderabad'))) {
    locationScore = 5;
    locationMatchStatus = 'COMPATIBLE';
  } else if (candLocation.includes('india') || !candLocation) {
    locationScore = 3;
    locationMatchStatus = 'COMPATIBLE';
  } else {
    locationScore = 2;
    locationMatchStatus = 'RELOCATION_REQUIRED';
  }

  const bonusFitScore = Math.min(10, Math.round((secondaryScore + locationScore) * 10) / 10);

  // -------------------------------------------------------------
  // AGGREGATE TOTAL SCORE & QUALIFICATION GATING
  // -------------------------------------------------------------
  const rawTotal = mustHaveSkillsScore + experienceScore + titleScore + educationScore + bonusFitScore;
  const score = Math.max(0, Math.min(100, Math.round(rawTotal)));

  const tier: AtsMatchResult['tier'] = score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW';

  // Candidate is eligible for auto-shortlist if score meets threshold and has at most 1 missing must-have
  const isShortlistEligible = score >= threshold && missingMustHaveSkills.length <= 1;

  // Human-readable recruiter explanation
  let explanation = '';
  if (score >= 80) {
    explanation = `High ${score}% ATS Fit — Matched ${matchedMustHaveSkills.length}/${mustHave.length} mandatory skills. Experience (${candExp}y) aligns with requisition bounds (${minExp}–${maxExp}y).`;
  } else if (score >= 60) {
    explanation = `Moderate ${score}% ATS Fit — Partially meets mandatory skills (${matchedMustHaveSkills.length}/${mustHave.length}). Missing: ${missingMustHaveSkills.join(', ') || 'None'}.`;
  } else {
    explanation = `Low ${score}% ATS Fit — Missing critical mandatory qualifications (${missingMustHaveSkills.join(', ') || 'Requirements unfulfilled'}).`;
  }

  return {
    score,
    tier,
    isShortlistEligible,
    threshold,
    breakdown: {
      mustHaveSkillsScore,
      experienceScore,
      titleScore,
      educationScore,
      bonusFitScore,
    },
    matchedMustHaveSkills,
    missingMustHaveSkills,
    matchedNiceToHaveSkills,
    missingNiceToHaveSkills,
    experienceMatchStatus,
    titleMatchStatus,
    educationMatchStatus,
    locationMatchStatus,
    explanation,
  };
}

/**
 * Calculates ATS matches in batch for multiple candidates against a job position.
 */
export function batchCalculateAtsMatches(candidates: CandidateEvaluationData[], job: JobRequirements): Map<string, AtsMatchResult> {
  const results = new Map<string, AtsMatchResult>();
  for (const c of candidates) {
    const res = calculateJobAtsMatch(c, job);
    if (c.id) {
      results.set(c.id, res);
    } else if (c.email) {
      results.set(c.email.toLowerCase(), res);
    }
  }
  return results;
}
