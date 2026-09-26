import { AUTH_STORAGE_KEYS } from '../constants';
export class ApiError extends Error {
    statusCode;
    errors;
    constructor(message, statusCode, errors) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
export class ApiClient {
    baseUrl;
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }
    setBaseUrl(url) {
        this.baseUrl = url;
    }
    getAuthToken() {
        if (typeof window === 'undefined')
            return null;
        return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    }
    async request(endpoint, options = {}) {
        const { params, headers = {}, ...customConfig } = options;
        let url = `${this.baseUrl}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }
        const defaultHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        const token = this.getAuthToken();
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        const config = {
            ...customConfig,
            headers: {
                ...defaultHeaders,
                ...headers,
            },
        };
        try {
            const response = await fetch(url, config);
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : await response.text();
            if (!response.ok) {
                const errorData = data;
                throw new ApiError(errorData.message || `Request failed with status ${response.status}`, response.status, errorData.errors);
            }
            return data;
        }
        catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            const message = err instanceof Error ? err.message : 'Unknown network error';
            throw new ApiError(message, 500);
        }
    }
    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    post(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    put(endpoint, body, options) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}
export const apiClient = new ApiClient();
//# sourceMappingURL=index.js.map