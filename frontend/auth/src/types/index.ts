export type UserRole = 'superadmin' | 'employee' | 'recruiter' | 'employer' | 'candidate';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roles: UserRole[];
  permissions: string[];
  token: string;
}

export const ROLE_DEFAULT_REDIRECTS: Record<UserRole, string> = {
  superadmin: 'http://localhost:3002',
  employee: 'http://localhost:3003',
  recruiter: 'http://localhost:3004',
  employer: 'http://localhost:3005',
  candidate: 'http://localhost:3006',
};
