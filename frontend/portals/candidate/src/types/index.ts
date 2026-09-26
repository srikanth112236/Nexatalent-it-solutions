export interface CandidateApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: 'Submitted' | 'Under Review' | 'Interview Scheduled' | 'Offer Extended';
}

export interface CandidateInterviewSchedule {
  id: string;
  jobTitle: string;
  interviewerName: string;
  scheduledTime: string;
  meetingLink?: string;
  status: 'Upcoming' | 'Completed' | 'Rescheduled';
}
