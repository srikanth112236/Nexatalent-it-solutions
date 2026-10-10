import { UserRole } from '../types';

export const USER_ROLES: Record<string, UserRole> = {
  SUPERADMIN: 'superadmin',
  EMPLOYEE: 'employee',
  RECRUITER: 'recruiter',
  EMPLOYER: 'employer',
  VENDOR: 'vendor',
  CANDIDATE: 'candidate',
} as const;

export const ROLE_DEFAULT_REDIRECTS: Record<UserRole, string> = {
  superadmin: '/superadmin',
  employee: '/employee',
  recruiter: '/recruiter',
  employer: '/employer',
  vendor: '/vendor',
  candidate: '/candidate',
};

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'nexatalent_access_token',
  REFRESH_TOKEN: 'nexatalent_refresh_token',
  USER_SESSION: 'nexatalent_user_session',
  ACTIVE_ROLE: 'nexatalent_active_role',
  ACTIVE_TENANT_ID: 'nexatalent_tenant_id',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER_CANDIDATE: '/api/v1/auth/register/candidate',
    REGISTER_EMPLOYER: '/api/v1/auth/register/employer',
    REGISTER_RECRUITER: '/api/v1/auth/register/recruiter',
    REGISTER_VENDOR: '/api/v1/auth/register/vendor',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
  },
  JOBS: '/api/v1/jobs',
  CANDIDATES: '/api/v1/candidates',
  EMPLOYERS: '/api/v1/employers',
  VENDORS: '/api/v1/vendors',
  ATS: '/api/v1/ats',
  INTERVIEWS: '/api/v1/interviews',
  CRM: '/api/v1/crm',
  NOTIFICATIONS: '/api/v1/notifications',
  DOCUMENTS: '/api/v1/documents',
} as const;
