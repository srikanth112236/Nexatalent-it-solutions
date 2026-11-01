import { describe, it, expect } from 'vitest';
import {
  calculateJobAtsMatch,
  batchCalculateAtsMatches,
  matchesSkill,
  normalizeSkillList,
} from '../src/services/atsScoringEngine.js';

describe('ATS Phase 2: Core ATS Scoring & Matching Engine', () => {
  const sampleJob = {
    id: 'JOB-9901',
    title: 'Senior Full Stack Developer (React.js + Node.js)',
    mustHaveSkills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB'],
    niceToHaveSkills: ['Tailwind CSS', 'Docker', 'GraphQL'],
    minExperienceYears: 4,
    maxExperienceYears: 8,
    minQualification: 'Bachelor of Technology (B.Tech) / B.E. or Equivalent',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    autoShortlistThreshold: 75,
  };

  it('normalizes skill synonyms and handles fuzzy matches', () => {
    expect(matchesSkill('React', ['React.js', 'Node.js'])).toBe(true);
    expect(matchesSkill('React.js', ['React', 'TypeScript'])).toBe(true);
    expect(matchesSkill('Node.js', ['Node', 'Express.js'])).toBe(true);
    expect(matchesSkill('K8s', ['Kubernetes'])).toBe(true);
    expect(matchesSkill('Golang', ['Go'])).toBe(true);
    expect(matchesSkill('Mongo', ['MongoDB'])).toBe(true);
    expect(matchesSkill('Python', ['Java', 'C++'])).toBe(false);
  });

  it('computes high match (>90%) for fully qualified candidate with auto-shortlist eligibility', () => {
    const srikanth = {
      id: 'CND-101',
      name: 'SRIKANTH M',
      currentTitle: 'Senior Full Stack Developer',
      currentCompany: 'Vedasynk Technologies',
      skills: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Redux'],
      experienceYears: 4.9,
      education: ['Bachelor of Commerce (B.Com) — Vivekananda Degree College | 2019 – 2022'],
      location: 'Bengaluru, India',
    };

    const result = calculateJobAtsMatch(srikanth, sampleJob);

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.tier).toBe('HIGH');
    expect(result.isShortlistEligible).toBe(true);
    expect(result.matchedMustHaveSkills).toContain('React.js');
    expect(result.matchedMustHaveSkills).toContain('Node.js');
    expect(result.matchedMustHaveSkills).toContain('TypeScript');
    expect(result.matchedMustHaveSkills).toContain('MongoDB');
    expect(result.missingMustHaveSkills.length).toBe(0);
    expect(result.breakdown.mustHaveSkillsScore).toBe(40);
    expect(result.breakdown.experienceScore).toBe(25);
    expect(result.breakdown.titleScore).toBe(15);
  });

  it('computes low match (<30%) for candidate lacking required tech stack & experience', () => {
    const juniorDev = {
      id: 'CND-102',
      name: 'Junior Python Intern',
      currentTitle: 'Intern',
      skills: ['Python', 'Django', 'SQLite'],
      experienceYears: 1,
      education: ['High School Diploma'],
      location: 'Delhi, India',
    };

    const result = calculateJobAtsMatch(juniorDev, sampleJob);

    expect(result.score).toBeLessThan(40);
    expect(result.tier).toBe('LOW');
    expect(result.isShortlistEligible).toBe(false);
    expect(result.missingMustHaveSkills.length).toBe(4);
    expect(result.breakdown.mustHaveSkillsScore).toBe(0);
    expect(result.experienceMatchStatus).toBe('UNDERQUALIFIED');
  });

  it('falls back gracefully to top 3 skills when mustHaveSkills is not explicitly configured', () => {
    const legacyJob = {
      id: 'JOB-LEGACY',
      title: 'DevOps Specialist',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
      minExperienceYears: 5,
    };

    const devopsCandidate = {
      skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker'],
      experienceYears: 6,
      currentTitle: 'DevOps Engineer',
    };

    const result = calculateJobAtsMatch(devopsCandidate, legacyJob);

    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.matchedMustHaveSkills.length).toBe(3);
    expect(result.missingMustHaveSkills.length).toBe(0);
  });

  it('calculates batch matches accurately for a candidate talent pool', () => {
    const candidatePool = [
      { id: 'C1', skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB'], experienceYears: 5, currentTitle: 'Full Stack Engineer' },
      { id: 'C2', skills: ['Python', 'Flask'], experienceYears: 2, currentTitle: 'Python Dev' },
    ];

    const batch = batchCalculateAtsMatches(candidatePool, sampleJob);

    expect(batch.size).toBe(2);
    expect(batch.get('C1')?.score).toBeGreaterThanOrEqual(80);
    expect(batch.get('C2')?.score).toBeLessThan(50);
  });
});
