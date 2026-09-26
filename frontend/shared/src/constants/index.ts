import { UserRole } from '../types';

export const USER_ROLES: Record<string, UserRole> = {
  SUPERADMIN: 'superadmin',
  EMPLOYEE: 'employee',
  RECRUITER: 'recruiter',
  EMPLOYER: 'employer',
  CANDIDATE: 'candidate',
} as const;

export const ROLE_DEFAULT_REDIRECTS: Record<UserRole, string> = {
  superadmin: '/superadmin',
  employee: '/employee',
  recruiter: '/recruiter',
  employer: '/employer',
  candidate: '/candidate',
};

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'nexatalent_access_token',
  REFRESH_TOKEN: 'nexatalent_refresh_token',
  USER_SESSION: 'nexatalent_user_session',
  ACTIVE_ROLE: 'nexatalent_active_role',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER_CANDIDATE: '/api/v1/auth/register/candidate',
    REGISTER_EMPLOYER: '/api/v1/auth/register/employer',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  JOBS: '/api/v1/jobs',
  CANDIDATES: '/api/v1/candidates',
  EMPLOYERS: '/api/v1/employers',
  ATS: '/api/v1/ats',
  INTERVIEWS: '/api/v1/interviews',
  CRM: '/api/v1/crm',
  NOTIFICATIONS: '/api/v1/notifications',
  DOCUMENTS: '/api/v1/documents',
} as const;
