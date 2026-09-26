export interface JobListing {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  department: string;
  salaryRange?: string;
  description: string;
  postedAt: string;
}

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
}

export interface IndustryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
}
