'use server';

import { API_BACKEND_URL, BEARER_TOKEN } from '../const.actions';
import { get, post, put, del, configGetAPI } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    LessonDto,
    LessonResponse,
    CreateLessonDto,
    UpdateLessonDto,
    ChaptersByCourseSlugResponse,
    CreateLessonCourseDto,
    LessonCourseResponse,
    UpdateLessonCourseDto,
} from './lesson.type';
import { getAuthTokens } from '../cookie.actions';

/**
 * Đếm tổng số bài học
 */
export async function countLessons(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/lessons/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Lấy tất cả bài học
 */
export async function getLessons(page: number = 1, size: number = 10, search: string = ''): Promise<LessonResponse> {
    let url = `${API_BACKEND_URL}/lessons?page=${page}&size=${size}`;

    // Thêm tham số tìm kiếm nếu có
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await get<LessonResponse>(url);

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài học theo ID
 */
export async function getLesson(id: number): Promise<LessonResponse> {
    const response = await get<LessonResponse>(
        `${API_BACKEND_URL}/lessons/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo bài học mới
 */
export async function createLesson(data: CreateLessonDto): Promise<LessonResponse> {
    const response = await post<CreateLessonDto, LessonResponse>(
        `${API_BACKEND_URL}/lessons`,
        data
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Cập nhật bài học
 */
export async function updateLesson(id: number, data: UpdateLessonDto): Promise<LessonResponse> {
    const response = await put<UpdateLessonDto, LessonResponse>(
        `${API_BACKEND_URL}/lessons/${id}`,
        data
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Xóa bài học
 */
export async function deleteLesson(id: number): Promise<LessonResponse> {
    const response = await del<LessonResponse>(
        `${API_BACKEND_URL}/lessons/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài học theo slug
 */
export async function getLessonBySlug(slug: string): Promise<LessonResponse> {
    const config = await configGetAPI()
    const header = await getAuthTokens()
    const response = await get<LessonResponse>(
        `${API_BACKEND_URL}/lessons/slug/${slug}`,
        {
            ...config,
            headers: {
                Authorization: `${BEARER_TOKEN} ${header.accessToken}`
            }
        }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
    };
}

/**
 * Lấy danh sách chương của khóa học theo courseSlug
 */
export async function getChaptersByCoursesSlug(
    courseSlug: string,
    page: number = 1,
    size: number = 10
): Promise<DataResponse> {
    const config = await configGetAPI()
    const response = await get<ChaptersByCourseSlugResponse>(
        `${API_BACKEND_URL}/lessons/chapters/${courseSlug}?page=${page}&size=${size}`,
        {
            ...config
        }
    );
    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy danh sách bài học của chương theo chapterSlug
 */
export async function getLessonsByChapterSlug(
    chapterSlug: string,
    page: number = 1,
    size: number = 10
): Promise<LessonResponse> {
    const config = await configGetAPI()
    const response = await get<LessonResponse>(
        `${API_BACKEND_URL}/lessons/chapter/${chapterSlug}?page=${page}&size=${size}`,
        {
            ...config
        }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo liên kết giữa bài học và khóa học
 */
export async function createLessonCourse(data: CreateLessonCourseDto): Promise<LessonCourseResponse> {
    const response = await post<CreateLessonCourseDto, LessonCourseResponse>(
        `${API_BACKEND_URL}/lesson-courses`,
        data
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy tất cả liên kết giữa bài học và khóa học
 */
export async function getLessonCourses(page: number = 1, size: number = 10, search: string = ''): Promise<LessonCourseResponse> {
    let url = `${API_BACKEND_URL}/lesson-courses?page=${page}&size=${size}`;

    // Thêm tham số tìm kiếm nếu có
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await get<LessonCourseResponse>(url);

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy liên kết giữa bài học và khóa học theo ID bài học và ID khóa học
 */
export async function getLessonCourse(lessonId: number, courseId: number): Promise<LessonCourseResponse> {
    const response = await get<LessonCourseResponse>(
        `${API_BACKEND_URL}/lesson-courses/${lessonId}/${courseId}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Cập nhật liên kết giữa bài học và khóa học
 */
export async function updateLessonCourse(lessonId: number, courseId: number, data: UpdateLessonCourseDto): Promise<LessonCourseResponse> {
    const response = await put<UpdateLessonCourseDto, LessonCourseResponse>(
        `${API_BACKEND_URL}/lesson-courses/${lessonId}/${courseId}`,
        data
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Xóa liên kết giữa bài học và khóa học
 */
export async function deleteLessonCourse(lessonId: number, courseId: number): Promise<LessonCourseResponse> {
    const response = await del<LessonCourseResponse>(
        `${API_BACKEND_URL}/lesson-courses/${lessonId}/${courseId}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy tất cả liên kết bài học theo ID khóa học
 */
export async function getLessonCoursesByCourseId(courseId: number, page: number = 1, size: number = 10): Promise<LessonCourseResponse> {
    const response = await get<LessonCourseResponse>(
        `${API_BACKEND_URL}/lesson-courses/course/${courseId}?page=${page}&size=${size}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy tất cả liên kết khóa học theo ID bài học
 */
export async function getLessonCoursesByLessonId(lessonId: number, page: number = 1, size: number = 10): Promise<LessonCourseResponse> {
    const response = await get<LessonCourseResponse>(
        `${API_BACKEND_URL}/lesson-courses/lesson/${lessonId}?page=${page}&size=${size}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}
