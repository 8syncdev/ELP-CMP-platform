'use server';

import { API_BACKEND_URL } from '../const.actions';
import { get, post, put, del } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    SubmissionDto,
    SubmissionResponse,
    CreateSubmissionDto,
    UpdateSubmissionDto,
    CreateSubmissionRequest,
    RunTestCodeRequest,
    TestsStatus
} from './submission.type';

/**
 * Đếm tổng số bài nộp
 */
export async function countSubmissions(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/submissions/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Lấy tất cả bài nộp
 */
export async function getSubmissions(): Promise<SubmissionResponse> {
    const response = await get<SubmissionResponse>(
        `${API_BACKEND_URL}/submissions`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài nộp theo ID
 */
export async function getSubmission(id: number): Promise<SubmissionResponse> {
    const response = await get<SubmissionResponse>(
        `${API_BACKEND_URL}/submissions/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo bài nộp mới
 */
export async function createSubmission(data: CreateSubmissionDto): Promise<SubmissionResponse> {
    const response = await post<CreateSubmissionDto, SubmissionResponse>(
        `${API_BACKEND_URL}/submissions`,
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
 * Cập nhật bài nộp
 */
export async function updateSubmission(id: number, data: UpdateSubmissionDto): Promise<SubmissionResponse> {
    const response = await put<UpdateSubmissionDto, SubmissionResponse>(
        `${API_BACKEND_URL}/submissions/${id}`,
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
 * Xóa bài nộp
 */
export async function deleteSubmission(id: number): Promise<SubmissionResponse> {
    const response = await del<SubmissionResponse>(
        `${API_BACKEND_URL}/submissions/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo bài nộp thông qua dịch vụ bên ngoài
 */
export async function createSubmissionExternalService(data: CreateSubmissionRequest): Promise<SubmissionResponse> {
    const response = await post<CreateSubmissionRequest, SubmissionResponse>(
        `${API_BACKEND_URL}/submissions/external`,
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
 * Chạy thử code
 */
export async function runTestCode(data: RunTestCodeRequest): Promise<DataResponse> {
    const response = await post<RunTestCodeRequest, DataResponse>(
        `${API_BACKEND_URL}/submissions/run-test-code`,
        data
    );

    // console.log(data)
    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result as TestsStatus,
    };
}
