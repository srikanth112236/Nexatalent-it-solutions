import { UserRole } from '../types';
export declare const USER_ROLES: Record<string, UserRole>;
export declare const ROLE_DEFAULT_REDIRECTS: Record<UserRole, string>;
export declare const AUTH_STORAGE_KEYS: {
    readonly ACCESS_TOKEN: "nexatalent_access_token";
    readonly REFRESH_TOKEN: "nexatalent_refresh_token";
    readonly USER_SESSION: "nexatalent_user_session";
    readonly ACTIVE_ROLE: "nexatalent_active_role";
};
export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/api/v1/auth/login";
        readonly REGISTER_CANDIDATE: "/api/v1/auth/register/candidate";
        readonly REGISTER_EMPLOYER: "/api/v1/auth/register/employer";
        readonly LOGOUT: "/api/v1/auth/logout";
        readonly REFRESH: "/api/v1/auth/refresh";
        readonly ME: "/api/v1/auth/me";
        readonly FORGOT_PASSWORD: "/api/v1/auth/forgot-password";
        readonly RESET_PASSWORD: "/api/v1/auth/reset-password";
    };
    readonly JOBS: "/api/v1/jobs";
    readonly CANDIDATES: "/api/v1/candidates";
    readonly EMPLOYERS: "/api/v1/employers";
    readonly ATS: "/api/v1/ats";
    readonly INTERVIEWS: "/api/v1/interviews";
    readonly CRM: "/api/v1/crm";
    readonly NOTIFICATIONS: "/api/v1/notifications";
    readonly DOCUMENTS: "/api/v1/documents";
};
//# sourceMappingURL=index.d.ts.map