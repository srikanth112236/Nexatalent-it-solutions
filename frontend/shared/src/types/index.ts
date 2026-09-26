// Core Domain Types & Contracts

export type UserRole = 'superadmin' | 'employee' | 'recruiter' | 'employer' | 'candidate';

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

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
