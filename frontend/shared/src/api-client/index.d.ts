import { ApiResponse } from '../types';
export declare class ApiError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>;
    constructor(message: string, statusCode: number, errors?: Record<string, string[]>);
}
export interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}
export declare class ApiClient {
    private baseUrl;
    constructor(baseUrl?: string);
    setBaseUrl(url: string): void;
    private getAuthToken;
    request<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
    get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
    post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
    put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
    delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}
export declare const apiClient: ApiClient;
//# sourceMappingURL=index.d.ts.map