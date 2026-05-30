import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../hooks/useAuthentication.hook";

export class AppError {
    message: string;
    error: string;
    statusCode: number;

    constructor(message: string, error: string, statusCode: number) {
        this.message = message;
        this.error = error;
        this.statusCode = statusCode;
    }
}

export class HttpClient {
    private static instance: HttpClient;

    private constructor() {}

    static clearAuthSession() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
    }

    private _getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }

    private _commonHeaders() {
        const token = this._getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
        return headers;
    }

    private async _handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            HttpClient.clearAuthSession();
        }

        if (!response.ok) {
            const error = await response.json() as AppError;
            throw new AppError(error.message, error.error, error.statusCode);
        }

        return response.json();
    }
    
    public static getInstance(): HttpClient {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    private baseUrl: string = 'http://localhost:3000';

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: this._commonHeaders()
        });
        return this._handleResponse<T>(response);
    }

    async post<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this._commonHeaders(),
            body: JSON.stringify(body)
        });
        if (response.status === 401) {
            HttpClient.clearAuthSession();
        }
        if (!response.ok) {
            const error = await response.json() as AppError;
            throw new AppError(error.message, error.error, error.statusCode);
        }
        return response.json();
    }

    async patch<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PATCH',
            headers: this._commonHeaders(),
            body: JSON.stringify(body)
        });
        if (response.status === 401) {
            HttpClient.clearAuthSession();
        }
        if (!response.ok) {
            const error = await response.json() as AppError;
            throw new AppError(error.message, error.error, error.statusCode);
        }
        return response.json();
    }
}
