export type UserRole =
  | 'superadmin' | 'platform_owner'
  | 'employee' | 'operations_admin' | 'internal_recruiter' | 'finance_admin' | 'finance_staff' | 'sales_admin' | 'sales_manager' | 'support_admin' | 'bda'
  | 'recruiter' | 'agency_admin' | 'agency_recruiter'
  | 'employer' | 'company_admin' | 'hiring_manager' | 'company_recruiter'
  | 'vendor' | 'candidate';

export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roles: UserRole[];
  permissions: string[];
  organizationId?: string;
  organizationName?: string;
  avatarUrl?: string;
}

export interface RouteDefinition {
  path: string;
  title: string;
  access: 'public' | 'authenticated';
  roles?: UserRole[];
  permission?: string;
  layout: 'website' | 'auth' | 'portal';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}
