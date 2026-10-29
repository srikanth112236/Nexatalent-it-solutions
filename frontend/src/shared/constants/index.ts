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
  platform_owner: '/superadmin',
  employee: '/employee',
  operations_admin: '/employee',
  internal_recruiter: '/employee',
  finance_admin: '/employee',
  finance_staff: '/employee',
  sales_admin: '/employee',
  sales_manager: '/employee',
  support_admin: '/superadmin',
  bda: '/employee',
  recruiter: '/recruiter',
  agency_admin: '/recruiter',
  agency_recruiter: '/recruiter',
  employer: '/employer',
  company_admin: '/employer',
  hiring_manager: '/employer',
  company_recruiter: '/employer',
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

export function getApiBaseUrl(): string {
  const envUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_API_BASE_URL : undefined;
  if (typeof envUrl === 'string' && envUrl.length > 0) return envUrl;
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:') {
      return '';
    }
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:5000';
    }
  }
  return '';
}

export const API_BASE_URL = getApiBaseUrl();

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
