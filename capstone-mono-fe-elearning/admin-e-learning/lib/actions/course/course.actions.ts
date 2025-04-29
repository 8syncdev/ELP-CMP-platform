'use server';

import { API_BACKEND_URL } from '../const.actions';
import { get, post, put, del, configGetAPI } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    CourseDto,
    CourseResponse,
    CreateCourseDto,
    UpdateCourseDto,
} from './course.type';

/**
 * Get total number of courses
 */
export async function countCourses(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/courses/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Get all courses
 */
export async function getCourses(page: number = 1, limit: number = 10, search: string = ''): Promise<CourseResponse> {
    const response = await get<CourseResponse>(
        `${API_BACKEND_URL}/courses?page=${page}&size=${limit}&search=${search}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Get course by ID
 */
export async function getCourse(id: number): Promise<CourseResponse> {
    const response = await get<CourseResponse>(
        `${API_BACKEND_URL}/courses/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Create new course
 */
export async function createCourse(data: CreateCourseDto): Promise<CourseResponse> {
    const response = await post<CreateCourseDto, CourseResponse>(
        `${API_BACKEND_URL}/courses`,
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
 * Update course
 */
export async function updateCourse(id: number, data: UpdateCourseDto): Promise<CourseResponse> {
    const response = await put<UpdateCourseDto, CourseResponse>(
        `${API_BACKEND_URL}/courses/${id}`,
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
 * Delete course
 */
export async function deleteCourse(id: number): Promise<CourseResponse> {
    const response = await del<CourseResponse>(
        `${API_BACKEND_URL}/courses/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy khóa học theo slug
 */
export async function getCourseBySlug(slug: string): Promise<CourseResponse> {
    const config = await configGetAPI()
    const response = await get<CourseResponse>(
        `${API_BACKEND_URL}/courses/slug/${slug}`,
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
 * Lấy danh sách khóa học theo loại
 */
export async function getCoursesByType(
    type: string,
    page: number = 1,
    size: number = 10,
    search: string = ''
): Promise<CourseResponse> {
    const config = await configGetAPI()
    const response = await get<CourseResponse>(
        `${API_BACKEND_URL}/courses/type/${type}?page=${page}&size=${size}&search=${search}`,
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
