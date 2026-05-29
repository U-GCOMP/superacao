export class HttpError extends Error {
    constructor(
        public status: number,
        public body: unknown,
        message?: string
    ) {
        super(message ?? `HTTP Error ${status}`);
    }
}

export class HttpClient {
    private static instance: HttpClient;

    private constructor() {}

    public static getInstance(): HttpClient {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    private baseUrl: string = 'http://localhost:3000';

    async get<T>(endpoint: string, token?: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {
                    Authorization: `Bearer ${token}`
                }),
            }
        });

        if (!response.ok) {
            const error = await response.json();

            throw new HttpError(
                response.status,
                error,
                response.statusText
            );
        }
        return response.json();
    }

    async post<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {
                    Authorization: `Bearer ${token}`
                })
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();

            throw new HttpError(
                response.status,
                error,
                response.statusText
            );
        }

        return response.json();
    }
}
