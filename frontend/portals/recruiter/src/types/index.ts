export interface CandidateSummary {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  stage: 'Sourced' | 'Screened' | 'Interview' | 'Offered';
  experienceYears: number;
}

export interface RecruiterJob {
  id: string;
  title: string;
  client: string;
  activeCandidates: number;
  status: 'Open' | 'Interviewing' | 'Closed';
}
