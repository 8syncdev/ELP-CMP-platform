'use server';

import { API_BACKEND_URL } from '../const.actions';
import { get, post, put, del } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    EnrollmentDto,
    EnrollmentResponse,
    CreateEnrollmentDto,
    UpdateEnrollmentDto
} from './enrollment.type';
import { getAuthTokens } from '../cookie.actions';
import { BEARER_TOKEN } from '../const.actions';

/**
 * Đếm tổng số đăng ký khóa học
 */
export async function countEnrollments(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/enrollments/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Lấy tất cả đăng ký khóa học
 */
export async function getEnrollments(): Promise<EnrollmentResponse> {
    const response = await get<EnrollmentResponse>(
        `${API_BACKEND_URL}/enrollments`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy thông tin đăng ký khóa học theo ID
 */
export async function getEnrollment(id: number): Promise<EnrollmentResponse> {
    const response = await get<EnrollmentResponse>(
        `${API_BACKEND_URL}/enrollments/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo đăng ký khóa học mới
 */
export async function createEnrollment(data: CreateEnrollmentDto): Promise<EnrollmentResponse> {
    const response = await post<CreateEnrollmentDto, EnrollmentResponse>(
        `${API_BACKEND_URL}/enrollments`,
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
 * Cập nhật thông tin đăng ký khóa học
 */
export async function updateEnrollment(id: number, data: UpdateEnrollmentDto): Promise<EnrollmentResponse> {
    const response = await put<UpdateEnrollmentDto, EnrollmentResponse>(
        `${API_BACKEND_URL}/enrollments/${id}`,
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
 * Xóa đăng ký khóa học
 */
export async function deleteEnrollment(id: number): Promise<EnrollmentResponse> {
    const response = await del<EnrollmentResponse>(
        `${API_BACKEND_URL}/enrollments/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Kiểm tra đăng ký khóa học theo slug
 */
export async function checkEnrollmentByCourseSlug(courseSlug: string): Promise<EnrollmentResponse> {
    const token = await getAuthTokens();
    const response = await get<EnrollmentResponse>(
        `${API_BACKEND_URL}/enrollments/check/${courseSlug}`,
        {
            headers: {
                "Authorization": `${BEARER_TOKEN} ${token.accessToken}`
            }
        }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

