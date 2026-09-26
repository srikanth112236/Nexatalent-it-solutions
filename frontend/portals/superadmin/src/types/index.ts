export interface AdminMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  tier: 'Enterprise' | 'Growth' | 'Standard';
  usersCount: number;
  status: 'Active' | 'Suspended';
}
