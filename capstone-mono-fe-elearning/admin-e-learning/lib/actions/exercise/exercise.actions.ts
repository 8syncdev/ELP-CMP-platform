'use server';

import { API_BACKEND_URL, BEARER_TOKEN } from '../const.actions';
import { get, post, put, del, configGetAPI } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    ExerciseDto,
    ExerciseResponse,
    CreateExerciseDto,
    UpdateExerciseDto,
    ExerciseFilterTime
} from './exercise.type';
import { getAuthTokens } from '../cookie.actions';

/**
 * Đếm tổng số bài tập
 */
export async function countExercises(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/exercises/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Lấy tất cả bài tập với phân trang
 */
export async function getExercises(page: number = 1, size: number = 10, search: string = ''): Promise<ExerciseResponse> {
    let url = `${API_BACKEND_URL}/exercises?page=${page}&size=${size}`;

    // Thêm tham số tìm kiếm nếu có
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await get<ExerciseResponse>(url);

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài tập theo ID
 */
export async function getExercise(id: number): Promise<ExerciseResponse> {
    const response = await get<ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo bài tập mới
 */
export async function createExercise(data: CreateExerciseDto): Promise<ExerciseResponse> {
    const response = await post<CreateExerciseDto, ExerciseResponse>(
        `${API_BACKEND_URL}/exercises`,
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
 * Cập nhật bài tập
 */
export async function updateExercise(id: number, data: UpdateExerciseDto): Promise<ExerciseResponse> {
    const response = await put<UpdateExerciseDto, ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/${id}`,
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
 * Xóa bài tập
 */
export async function deleteExercise(id: number): Promise<ExerciseResponse> {
    const response = await del<ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài tập theo tiêu đề
 */
export async function getExercisesByTitle(
    page: number = 1,
    size: number = 10,
    title: string,
    filterTime: ExerciseFilterTime = "all"
): Promise<ExerciseResponse> {
    const response = await get<ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/title?page=${page}&size=${size}&title=${title}&filterTime=${filterTime}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài tập theo tags
 */
export async function getExercisesByTags(
    page: number = 1,
    size: number = 10,
    tags: string[],
    filterTime: ExerciseFilterTime = "all"
): Promise<ExerciseResponse> {
    const response = await post<{ tags: string[] }, ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/tags?page=${page}&size=${size}&filterTime=${filterTime}`,
        { tags }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài tập theo tiêu đề và tags
 */
export async function getExercisesByTitleAndTags(
    page: number = 1,
    size: number = 10,
    title: string,
    tags: string[],
    filterTime: ExerciseFilterTime = "all"
): Promise<ExerciseResponse> {
    const response = await post<{ title: string, tags: string[] }, ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/title/tags?page=${page}&size=${size}&filterTime=${filterTime}`,
        { title, tags }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài tập theo slug của khóa học
 */
export async function getExercisesByCourseSlug(
    page: number = 1,
    size: number = 10,
    slug: string,
    filterTime: ExerciseFilterTime = "all"
): Promise<ExerciseResponse> {
    const response = await get<ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/course/${slug}?page=${page}&size=${size}&filterTime=${filterTime}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài tập theo slug
 */
export async function getExerciseBySlug(slug: string): Promise<ExerciseResponse> {
    const token = await getAuthTokens();
    const config = await configGetAPI()
    const response = await get<ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/slug/${slug}`,
        {
            headers: {
                Authorization: `${BEARER_TOKEN} ${token.accessToken}`
            },
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
 * Lấy bài tập theo độ khó
 */
export async function getExercisesByDifficulty(
    page: number = 1,
    size: number = 10,
    difficulty: string,
    filterTime: ExerciseFilterTime = "all"
): Promise<ExerciseResponse> {
    const response = await get<ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/difficulty/${difficulty}?page=${page}&size=${size}&filterTime=${filterTime}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}


/**
 * Lấy bài tập theo tiêu đề, tags và độ khó
 */
export async function getExercisesByCombinedTitleTagsDifficulty(
    page: number = 1,
    size: number = 10,
    title: string,
    tags: string[],
    difficulty: string,
    filterTime: ExerciseFilterTime = "all"
): Promise<ExerciseResponse> {
    const response = await post<{ page: number, size: number, title: string, tags: string[], difficulty: string, filterTime: ExerciseFilterTime }, ExerciseResponse>(
        `${API_BACKEND_URL}/exercises/combined`,
        { page, size, title, tags, difficulty, filterTime }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}


