import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types';
import { AUTH_STORAGE_KEYS } from '../constants';

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor() {
    const baseURL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:5000';

    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private setupInterceptors() {
    // 1. Request Interceptor: Attach Access Token + Tenant context
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          const tenantId = localStorage.getItem(AUTH_STORAGE_KEYS.ACTIVE_TENANT_ID);
          if (tenantId && config.headers && !config.headers['X-Tenant-ID']) {
            config.headers['X-Tenant-ID'] = tenantId;
          }
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // 2. Response Interceptor: Auto-Refresh on 401 Unauthorized
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Auth endpoints own their errors (wrong password, unknown account, hoop mismatch):
        // never auto-refresh or hard-redirect on them — that wipes the login form
        // and traps the user in a login → session_expired → login loop.
        const requestUrl = String(originalRequest?.url || '');
        if (requestUrl.includes('/api/v1/auth/')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers && token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = typeof window !== 'undefined' 
            ? localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) 
            : null;

          if (!refreshToken) {
            this.isRefreshing = false;
            // No refresh token = nothing to recover (logged out, or pre-login
            // background fetch). Reject quietly WITHOUT a hard page reload —
            // otherwise logged-out screens that prefetch data reload forever.
            if (typeof window !== 'undefined') {
              localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
              localStorage.removeItem(AUTH_STORAGE_KEYS.ACTIVE_ROLE);
            }
            return Promise.reject(error);
          }

          try {
            const refreshResponse = await axios.post(
              `${this.axiosInstance.defaults.baseURL}/api/v1/auth/refresh`,
              { refreshToken }
            );

            // Backend may return ApiResponse-wrapped ({success,data:{...}}) or legacy top-level shape.
            const refreshBody = refreshResponse.data?.data ?? refreshResponse.data ?? {};
            const { accessToken, refreshToken: newRefreshToken } = refreshBody;

            if (accessToken) {
              localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
              if (newRefreshToken) {
                localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
              }

              this.processQueue(null, accessToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshErr) {
            this.processQueue(refreshErr as Error, null);
            this.clearSessionAndRedirect('refresh_failed');
            return Promise.reject(refreshErr);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private clearSessionAndRedirect(reason: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACTIVE_ROLE);
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACTIVE_TENANT_ID);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER_SESSION);
      localStorage.removeItem('user_email');
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      window.location.href = `/login?reason=${reason}`;
    }
  }

  /** Shared logout helper — clears every auth key, then redirects. */
  async logout(reason = 'sign_out') {
    this.clearSessionAndRedirect(reason);
  }

  async get<T>(endpoint: string, config?: any): Promise<ApiResponse<T>> {
    const res = await this.axiosInstance.get<ApiResponse<T>>(endpoint, config);
    return res.data;
  }

  async post<T>(endpoint: string, data?: unknown, config?: any): Promise<ApiResponse<T>> {
    const res = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data, config);
    return res.data;
  }

  async put<T>(endpoint: string, data?: unknown, config?: any): Promise<ApiResponse<T>> {
    const res = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data, config);
    return res.data;
  }

  async patch<T>(endpoint: string, data?: unknown, config?: any): Promise<ApiResponse<T>> {
    const res = await this.axiosInstance.patch<ApiResponse<T>>(endpoint, data, config);
    return res.data;
  }

  async delete<T>(endpoint: string, config?: any): Promise<ApiResponse<T>> {
    const res = await this.axiosInstance.delete<ApiResponse<T>>(endpoint, config);
    return res.data;
  }
}

export const apiClient = new ApiClient();
