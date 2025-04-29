
export interface Paginated {
    /** Total number of results */
    count: number;
    /** Number of results per page */
    pageSize: number;
    /** Total number of pages */
    totalPages: number;
    /** Current page number */
    current: number;
}

export interface PaginatedParams {
    size: number;
    page: number;
    count: number;
};
export interface DataResponse {
    /** Indicates if the request was successful */
    success: boolean;
    /** Error message if the request was not successful */
    message?: string;
    /** The result of the request */
    result?: any;
    /** Pagination data */
    pagination?: Paginated;
}