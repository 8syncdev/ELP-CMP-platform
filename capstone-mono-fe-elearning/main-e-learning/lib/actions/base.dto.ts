export type DataResponse = {
    /** Indicates if the request was successful */
    success: boolean;
    /** Error message if the request was not successful */
    message?: string;
    /** The result of the request */
    result?: any;
    /** Pagination information */
    pagination?: Paginated;
}

export type Paginated = {
    /** Total number of results */
    count: number;
    /** Number of results per page */
    pageSize: number;
    /** Total number of pages */
    totalPages: number;
    /** Current page number */
    current: number;
}

declare const __validate: unique symbol;

export type Min<N extends number> = {
    [__validate]: {
        minValue: N;
    };
};

export type Max<N extends number> = {
    [__validate]: {
        maxValue: N;
    };
};

export type MinLen<N extends number> = {
    [__validate]: {
        minLen: N;
    };
};

export type MaxLen<N extends number> = {
    [__validate]: {
        maxLen: N;
    };
};

export type MatchesRegexp<S extends string> = {
    [__validate]: {
        matchesRegexp: S;
    };
};

export type StartsWith<S extends string> = {
    [__validate]: {
        startsWith: S;
    };
};

export type EndsWith<S extends string> = {
    [__validate]: {
        endsWith: S;
    };
};

export type IsEmail = {
    [__validate]: {
        isEmail: true;
    };
};

export type IsURL = {
    [__validate]: {
        isURL: true;
    };
};
