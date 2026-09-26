export interface EmployerJob {
  id: string;
  title: string;
  department: string;
  submissionsCount: number;
  interviewsCount: number;
  status: 'Draft' | 'Active' | 'Closed';
}

export interface CandidateSubmission {
  id: string;
  candidateName: string;
  jobTitle: string;
  submittedAt: string;
  status: 'Under Review' | 'Interview Requested' | 'Rejected' | 'Offer Extended';
  rating: number;
}
