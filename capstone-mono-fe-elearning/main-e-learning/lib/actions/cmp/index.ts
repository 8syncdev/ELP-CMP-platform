'use server';

import { get, post } from '../config.actions';
import {
    ActionResponse,
    QueryRequest,
    UrlRequest,
    TextRequest,
    QuestionRequest
} from './cmp.types';

import { CMP_API_URL } from '../const.actions';

/**
 * Search Google with a query
 */
export async function searchGoogle(query: string, start_num: number = 0, num_results: number = 10): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QueryRequest, ActionResponse>(
            `${CMP_API_URL}/search-google`,
            { query, start_num, num_results }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    });
}

/**
 * Search Google with a query and retry callback for UI updates
 */
export async function searchGoogleWithRetry(
    query: string,
    start_num: number = 0,
    num_results: number = 10,
    onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QueryRequest, ActionResponse>(
            `${CMP_API_URL}/search-google`,
            { query, start_num, num_results }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    }, { onRetry });
}

/**
 * Get content from a specific URL
 */
export async function getContentFromUrl(url: string): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<UrlRequest, ActionResponse>(
            `${CMP_API_URL}/get-content-from-url`,
            { url }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    });
}

/**
 * Get content from a specific URL with retry callback for UI updates
 */
export async function getContentFromUrlWithRetry(
    url: string,
    onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<UrlRequest, ActionResponse>(
            `${CMP_API_URL}/get-content-from-url`,
            { url }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    }, { onRetry });
}

/**
 * Summarize text content
 */
export async function summarizeText(text: string): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<TextRequest, ActionResponse>(
            `${CMP_API_URL}/summarize`,
            { text }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    });
}

/**
 * Summarize text content with retry callback for UI updates
 */
export async function summarizeTextWithRetry(
    text: string,
    onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<TextRequest, ActionResponse>(
            `${CMP_API_URL}/summarize`,
            { text }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    }, { onRetry });
}

/**
 * Ask teacher with a question
 */
export async function askTeacher(question: string): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QuestionRequest, ActionResponse>(
            `${CMP_API_URL}/ask-teacher`,
            { question }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    });
}

/**
 * Ask teacher with a question with retry callback for UI updates
 */
export async function askTeacherWithRetry(
    question: string,
    onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QuestionRequest, ActionResponse>(
            `${CMP_API_URL}/ask-teacher`,
            { question }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    }, { onRetry });
}

/**
 * Meeting with teacher
 */
export async function meetingWithTeacher(question: string): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QuestionRequest, ActionResponse>(
            `${CMP_API_URL}/meeting-with-teacher`,
            { question }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    });
}

/**
 * Meeting with teacher with retry callback for UI updates
 */
export async function meetingWithTeacherWithRetry(
    question: string,
    onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QuestionRequest, ActionResponse>(
            `${CMP_API_URL}/meeting-with-teacher`,
            { question }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    }, { onRetry });
}

/**
 * Student ask teacher a question
 */
export async function studentAskTeacher(question: string): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QuestionRequest, ActionResponse>(
            `${CMP_API_URL}/student-ask-teacher`,
            { question }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    });
}

/**
 * Student ask teacher a question with retry callback for UI updates
 */
export async function studentAskTeacherWithRetry(
    question: string,
    onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<ActionResponse> {
    return withRetry(async () => {
        const response = await post<QuestionRequest, ActionResponse>(
            `${CMP_API_URL}/student-ask-teacher`,
            { question }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || undefined,
            result: response.data?.result
        };
    }, { onRetry });
}

// Enhanced utility function for retrying API calls with exponential backoff
/**
 * Utility function to retry a function with exponential backoff
 * @param fn Function to retry
 * @param options Configuration options for retry behavior
 */
async function withRetry<T>(
    fn: () => Promise<T>,
    options?: {
        maxRetries?: number;
        baseDelay?: number;
        maxDelay?: number;
        retryStatusCodes?: number[];
        onRetry?: (attempt: number, error: unknown, delay: number) => void;
        shouldRetry?: (error: unknown) => boolean;
        onRateLimit?: (retryAfter: number, attempt: number) => void;
    }
): Promise<T> {
    const {
        maxRetries = 5,
        baseDelay = 1000,
        maxDelay = 30000,
        retryStatusCodes = [408, 429, 500, 502, 503, 504],
        onRetry,
        shouldRetry,
        onRateLimit
    } = options || {};

    let lastError: unknown;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check for rate limit (429) errors specifically to provide better handling
            const isRateLimit = (error as any)?.status === 429;
            if (isRateLimit && onRateLimit) {
                // Get 'Retry-After' header if available (in seconds)
                let retryAfter = 60; // Default to 60 seconds if not specified
                if ((error as any)?.headers?.get) {
                    const retryHeader = (error as any).headers.get('Retry-After');
                    if (retryHeader) {
                        retryAfter = parseInt(retryHeader, 10);
                    }
                }

                // Call the special rate limit handler
                onRateLimit(retryAfter, attempt + 1);
            }

            // Check if we should retry based on custom logic or HTTP status codes
            const shouldRetryError = shouldRetry
                ? shouldRetry(error)
                : (
                    // Default retry logic - retry on network errors or specific status codes
                    (error as any)?.name === 'FetchError' ||
                    ((error as any)?.status && retryStatusCodes.includes((error as any).status))
                );

            if (!shouldRetryError) {
                throw error; // Don't retry if this type of error shouldn't be retried
            }

            // Calculate delay with exponential backoff and jitter
            // Formula: min(maxDelay, baseDelay * 2^attempt + random jitter)
            const exponentialDelay = baseDelay * Math.pow(2, attempt);
            const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
            const delay = Math.min(maxDelay, exponentialDelay + jitter);

            // For rate limit errors, respect the Retry-After header if available
            const adjustedDelay = isRateLimit && (error as any)?.headers?.get ?
                Math.max(
                    delay,
                    parseInt((error as any).headers.get('Retry-After') || '0', 10) * 1000
                ) : delay;

            // Call the onRetry callback if provided
            if (onRetry) {
                onRetry(attempt + 1, error, adjustedDelay);
            } else {
                // Default logging
                console.log(`API call failed (attempt ${attempt + 1}/${maxRetries}). Retrying in ${Math.round(adjustedDelay)}ms...`);
                console.error(`Error details:`, error);
            }

            // Wait before next retry
            await new Promise(resolve => setTimeout(resolve, adjustedDelay));
        }
    }

    // If we get here, all retries failed
    throw lastError;
}

/**
 * Gets content from the CMP API with enhanced rate limit handling
 * @param endpoint API endpoint to call
 * @param params Query parameters
 * @param options Additional options for the API call
 */
export async function getContentWithRateLimitHandling(
    endpoint: string,
    params: Record<string, string> = {},
    options?: {
        maxRetries?: number;
        onRateLimitHit?: (retryAfter: number, attempt: number) => void;
        onProgress?: (status: string) => void;
    }
) {
    const { maxRetries = 8, onRateLimitHit, onProgress } = options || {};

    // Build query string
    const queryParams = new URLSearchParams(params).toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}${queryParams ? `?${queryParams}` : ''}`;

    try {
        // Notify that request is starting
        onProgress?.('Starting request...');

        const response = await withRetry(
            () => fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(process.env.NEXT_PUBLIC_API_KEY && { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }),
                },
                cache: 'no-store',
            }),
            {
                maxRetries,
                baseDelay: 2000, // Start with 2 seconds
                maxDelay: 60000, // Maximum 1 minute delay between retries
                onRetry: (attempt, error, delay) => {
                    onProgress?.(`Request failed. Retrying (${attempt}/${maxRetries}) in ${Math.round(delay / 1000)}s...`);
                },
                onRateLimit: (retryAfter, attempt) => {
                    onProgress?.(`Rate limit reached. Will retry in ${retryAfter} seconds (attempt ${attempt}/${maxRetries})`);
                    if (onRateLimitHit) {
                        onRateLimitHit(retryAfter, attempt);
                    }
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        onProgress?.('Request successful, processing data...');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching content with rate limit handling:', error);
        onProgress?.(`Error: ${(error as Error).message || 'Unknown error'}`);
        throw error;
    }
}

/**
 * Pings the AI server to check if it's alive and potentially wake it up
 * @returns Promise with the server status
 */
export async function pingAIServer(): Promise<{
    success: boolean;
    message: string;
    isAvailable: boolean;
}> {
    try {
        const start = performance.now();
        const response = await fetch(`${CMP_API_URL.split('/cmp-actions')[0]}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const responseTime = Math.round(performance.now() - start);

        if (response.ok) {
            return {
                success: true,
                message: `Server is online (${responseTime}ms)`,
                isAvailable: true,
            };
        } else {
            return {
                success: false,
                message: `Server responded with error: ${response.status}`,
                isAvailable: false,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error connecting to server',
            isAvailable: false,
        };
    }
}
