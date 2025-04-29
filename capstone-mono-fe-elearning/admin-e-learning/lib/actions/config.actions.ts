'use server';


type HttpResponse<T> = {
    data: T | null;
    error: string | null;
    status: number;
};

type FetchConfig = {
    revalidate?: number;
    tags?: string[];
}

/**
 * GET request with caching options
 */
export async function get<T>(
    url: string,
    options: RequestInit = {},
    config: FetchConfig = {
        // revalidate: 60 * 60
    } // 1 hour
): Promise<HttpResponse<T>> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options,
            next: config
        });

        const data = await response.json();

        return {
            data,
            error: null,
            status: response.status
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
        };
    }
}

/**
 * POST request
 */
export async function post<T, U>(
    url: string,
    body: T,
    options: RequestInit = {}
): Promise<HttpResponse<U>> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(body),
            ...options,
            cache: 'no-store'
        });

        const data = await response.json();

        return {
            data,
            error: null,
            status: response.status
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
        };
    }
}

/**
 * PUT request
 */
export async function put<T, U>(
    url: string,
    body: T,
    options: RequestInit = {}
): Promise<HttpResponse<U>> {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(body),
            ...options,
            cache: 'no-store'
        });

        const data = await response.json();

        return {
            data,
            error: null,
            status: response.status
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
        };
    }
}

/**
 * PATCH request
 */
export async function patch<T, U>(
    url: string,
    body: T,
    options: RequestInit = {}
): Promise<HttpResponse<U>> {
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(body),
            ...options,
            cache: 'no-store'
        });

        const data = await response.json();

        return {
            data,
            error: null,
            status: response.status
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
        };
    }
}

/**
 * DELETE request
 */
export async function del<T>(
    url: string,
    options: RequestInit = {}
): Promise<HttpResponse<T>> {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options,
            cache: 'no-store'
        });

        const data = await response.json();

        return {
            data,
            error: null,
            status: response.status
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
        };
    }
}

export const configGetAPI = async (): Promise<RequestInit> => {
    const type_product = process.env.DEPLOYMENT
    if (type_product === "dev") {
        return {
            cache: 'no-store'
        }
    }
    return {
        next: {
            revalidate: 60 * 60 * 6 // 6 hours
        }
    }
}