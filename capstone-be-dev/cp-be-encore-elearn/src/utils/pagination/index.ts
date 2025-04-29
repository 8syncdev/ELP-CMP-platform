import { PaginatedParams, Paginated } from "../dto";


/**
 * Calculates the offset for pagination based on the page number and page size.
 * 
 * @param page - The current page number (1-indexed).
 * @param size - The number of items per page.
 * @returns The calculated offset for the SQL query.
 * 
 * @example
 * // Returns 0 (first page)
 * getOffset(1, 10)
 * 
 * @example
 * // Returns 20 (third page)
 * getOffset(3, 10)
 */
export const getOffset = (page: number, size: number): number => {
    return size * (page - 1);
};

export const paginatedData = (params: PaginatedParams): Paginated => {
    const totalPages = Math.ceil(params.count / params.size);

    return {
        count: params.count,
        pageSize: params.size,
        totalPages: totalPages,
        current: params.page
    };
};