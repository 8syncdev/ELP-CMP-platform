'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Paginated } from '@/lib/actions/base.dto';
import {
    LessonDto,
    ChapterDto,
    ChaptersByCourseSlugResponse,
    LessonResponse
} from '@/lib/actions/lesson';
import { getLessonsByChapterSlug, getChaptersByCoursesSlug } from '@/lib/actions/lesson';

interface LearningContextType {
    chapters: ChapterDto[];
    currentChapter: string | null;
    lessons: LessonDto[];
    isLoadingChapters: boolean;
    isLoadingLessons: boolean;
    pagination: {
        chapters: Paginated | null;
        lessons: Paginated | null;
    };
    currentPages: { [key: string]: number };
    setCurrentPages: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    fetchChapters: (courseSlug: string, page?: number, size?: number) => Promise<void>;
    fetchLessons: (courseSlug: string, chapterSlug: string, page?: number, size?: number) => Promise<void>;
    setCurrentChapter: (chapterSlug: string) => void;
    handlePageChange: (
        type: 'chapters' | 'lessons',
        courseSlug: string,
        page: number,
        chapterSlug?: string
    ) => Promise<void>;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: React.ReactNode }) {
    const [chapters, setChapters] = useState<ChapterDto[]>([]);
    const [currentChapter, setCurrentChapter] = useState<string | null>(null);
    const [lessons, setLessons] = useState<LessonDto[]>([]);
    const [isLoadingChapters, setIsLoadingChapters] = useState(false);
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);
    const [pagination, setPagination] = useState<{
        chapters: Paginated | null;
        lessons: Paginated | null;
    }>({
        chapters: null,
        lessons: null
    });
    const [currentPages, setCurrentPages] = useState<{ [key: string]: number }>({
        chapters: 1
    });

    const chaptersCache = useRef<Map<string, { data: ChapterDto[], pagination: Paginated }>>(new Map());
    const lessonsCache = useRef<Map<string, { data: LessonDto[], pagination: Paginated }>>(new Map());

    const fetchLessons = useCallback(async (
        courseSlug: string,
        chapterSlug: string,
        page: number = 1,
        size: number = 10
    ) => {
        if (!courseSlug || !chapterSlug) return;

        const cacheKey = `${chapterSlug}_${page}`;
        setIsLoadingLessons(true);

        try {
            // Kiểm tra cache
            const cachedData = lessonsCache.current.get(cacheKey);
            if (cachedData) {
                setLessons(cachedData.data);
                setPagination(prev => ({ ...prev, lessons: cachedData.pagination }));
                setIsLoadingLessons(false);
                return;
            }

            const response = await getLessonsByChapterSlug(chapterSlug, page, size);
            if (response.success && response.result) {
                const lessonsData = Array.isArray(response.result) ? response.result : [response.result];
                setLessons(lessonsData);
                setPagination(prev => ({ ...prev, lessons: response.pagination || null }));

                // Lưu vào cache
                if (response.pagination) {
                    lessonsCache.current.set(cacheKey, {
                        data: lessonsData,
                        pagination: response.pagination
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        } finally {
            setIsLoadingLessons(false);
        }
    }, []);

    const fetchChapters = useCallback(async (
        courseSlug: string,
        page: number = 1,
        size: number = 10
    ) => {
        if (!courseSlug) return;

        const cacheKey = `${courseSlug}_${page}`;
        setIsLoadingChapters(true);

        try {
            const cachedData = chaptersCache.current.get(cacheKey);
            if (cachedData) {
                setChapters(cachedData.data);
                setPagination(prev => ({ ...prev, chapters: cachedData.pagination }));
                setIsLoadingChapters(false);
                return;
            }

            const response = await getChaptersByCoursesSlug(courseSlug, page, size);
            if (response.success && response.result) {
                setChapters(response.result);
                setPagination(prev => ({ ...prev, chapters: response.pagination || null }));

                // Lưu vào cache
                if (response.pagination) {
                    chaptersCache.current.set(cacheKey, {
                        data: response.result,
                        pagination: response.pagination
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setIsLoadingChapters(false);
        }
    }, []);

    const handlePageChange = useCallback(async (
        type: 'chapters' | 'lessons',
        courseSlug: string,
        page: number,
        chapterSlug?: string
    ) => {
        if (type === 'chapters') {
            setCurrentPages(prev => ({ ...prev, chapters: page }));
            await fetchChapters(courseSlug, page);
        } else if (type === 'lessons' && chapterSlug) {
            setCurrentPages(prev => ({ ...prev, [chapterSlug]: page }));
            await fetchLessons(courseSlug, chapterSlug, page);
        }
    }, [fetchChapters, fetchLessons]);

    return (
        <LearningContext.Provider
            value={{
                chapters,
                currentChapter,
                lessons,
                isLoadingChapters,
                isLoadingLessons,
                pagination,
                currentPages,
                setCurrentPages,
                fetchChapters,
                fetchLessons,
                setCurrentChapter,
                handlePageChange,
            }}
        >
            {children}
        </LearningContext.Provider>
    );
}

export const useLearning = () => {
    const context = useContext(LearningContext);
    if (context === undefined) {
        throw new Error('useLearning phải được sử dụng trong LearningProvider');
    }
    return context;
};
