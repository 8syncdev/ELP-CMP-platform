'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ExerciseDto, ExerciseResponse, getExercisesByTitleAndTags, getExercisesByDifficulty, getExercisesByTags, getExercisesByTitle, getExercises, getExercisesByCombinedTitleTagsDifficulty } from '@/lib/actions/exercise';
import { Paginated } from '@/lib/actions/base.dto';
import { ExerciseFilterTime } from '@/lib/actions/exercise';

// Cache key
const CACHE_KEY = {
    EXERCISES: (title: string, tags: string[], difficulty: string) =>
        `exercises_${title}_${tags.join('_')}_${difficulty}`,
};

// LocalStorage keys
const STORAGE_KEYS = {
    CURRENT_PAGE: 'exercise_current_page',
    CURRENT_FILTER: 'exercise_current_filter'
};

interface ExerciseContextType {
    exercises: ExerciseDto[];
    isLoading: boolean;
    pagination: Paginated | null;
    currentFilter: {
        title: string;
        tags: string[];
        difficulty: string;
        filterTime: ExerciseFilterTime;
    };
    currentPage: number;
    setFilter: (filter: {
        title?: string;
        tags?: string[];
        difficulty?: string;
        filterTime?: ExerciseFilterTime;
    }) => void;
    handlePageChange: (page: number) => Promise<void>;
    resetToInitial: () => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children, initialData }: { children: React.ReactNode, initialData?: ExerciseDto[] }) {
    const getInitialState = () => {
        if (typeof window !== 'undefined') {
            const savedPage = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
            const savedFilter = localStorage.getItem(STORAGE_KEYS.CURRENT_FILTER);
            return {
                currentPage: savedPage ? parseInt(savedPage) : 1,
                currentFilter: savedFilter ? JSON.parse(savedFilter) : {
                    title: '',
                    tags: [],
                    difficulty: '',
                    filterTime: 'all' as ExerciseFilterTime
                }
            };
        }
        return {
            currentPage: 1,
            currentFilter: {
                title: '',
                tags: [],
                difficulty: '',
                filterTime: 'all' as ExerciseFilterTime
            }
        };
    };

    const initialState = getInitialState();
    const [exercises, setExercises] = useState<ExerciseDto[]>(initialData || []);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<Paginated | null>(null);
    const [currentPage, setCurrentPage] = useState(initialState.currentPage);
    const [currentFilter, setCurrentFilter] = useState(initialState.currentFilter);

    // Cache để lưu trữ dữ liệu
    const cache = useRef<Map<string, any>>(new Map());

    // Lưu state vào localStorage khi thay đổi
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, currentPage.toString());
            localStorage.setItem(STORAGE_KEYS.CURRENT_FILTER, JSON.stringify(currentFilter));
        }
    }, [currentPage, currentFilter]);

    const fetchExercises = useCallback(async (
        page: number = 1,
        size: number = 10,
        filter = currentFilter
    ) => {
        const cacheKey = CACHE_KEY.EXERCISES(filter.title, filter.tags, filter.difficulty);
        const pageCacheKey = `${cacheKey}_page_${page}_${filter.filterTime}`;

        if (cache.current.has(pageCacheKey)) {
            const cachedData = cache.current.get(pageCacheKey);
            setExercises(cachedData.result);
            setPagination(cachedData.pagination);
            setCurrentPage(page);
            return;
        }

        setIsLoading(true);
        try {
            const response = await getExercisesByCombinedTitleTagsDifficulty(
                page,
                size,
                filter.title,
                filter.tags,
                filter.difficulty,
                filter.filterTime
            );

            if (response.success && response.result) {
                setExercises(Array.isArray(response.result) ? response.result : [response.result]);
                setPagination(response.pagination || null);
                setCurrentPage(page);

                cache.current.set(pageCacheKey, {
                    result: response.result,
                    pagination: response.pagination
                });
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentFilter]);

    const setFilter = useCallback((filter: {
        title?: string;
        tags?: string[];
        difficulty?: string;
        filterTime?: ExerciseFilterTime;
    }) => {
        const newFilter = {
            ...currentFilter,
            ...filter
        };
        setCurrentFilter(newFilter);
        setCurrentPage(1);
        fetchExercises(1, 10, newFilter);
    }, [currentFilter, fetchExercises]);

    const handlePageChange = useCallback(async (page: number) => {
        setCurrentPage(page);
        await fetchExercises(page, 10, currentFilter);
    }, [fetchExercises, currentFilter]);

    const resetToInitial = useCallback(() => {
        setExercises(initialData || []);
        setCurrentFilter({
            title: '',
            tags: [],
            difficulty: '',
            filterTime: 'all'
        });
        setPagination(null);
        setCurrentPage(1);
        cache.current.clear();
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
            localStorage.removeItem(STORAGE_KEYS.CURRENT_FILTER);
        }
        fetchExercises(1, 10, {
            title: '',
            tags: [],
            difficulty: '',
            filterTime: 'all'
        });
    }, [initialData, fetchExercises]);

    // Khôi phục dữ liệu khi component mount
    useEffect(() => {
        if (initialState.currentPage > 1 || Object.values(initialState.currentFilter).some(v => v)) {
            fetchExercises(initialState.currentPage, 10, initialState.currentFilter);
        }
    }, []);

    return (
        <ExerciseContext.Provider value={{
            exercises,
            isLoading,
            pagination,
            currentFilter,
            currentPage,
            setFilter,
            handlePageChange,
            resetToInitial,
        }}>
            {children}
        </ExerciseContext.Provider>
    );
}

export const useExercise = () => {
    const context = useContext(ExerciseContext);
    if (context === undefined) {
        throw new Error('useExercise phải được sử dụng trong ExerciseProvider');
    }
    return context;
}; 