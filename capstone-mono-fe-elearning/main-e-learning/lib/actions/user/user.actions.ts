'use server';

import { API_BACKEND_URL, BEARER_TOKEN } from '../const.actions';
import { get, post, put, del, configGetAPI } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    UsersDto,
    UsersResponse,
    CreateUsersDto,
    UpdateUsersDto,
} from './user.type';
import { getAuthTokens } from '../cookie.actions';

/**
 * Đếm tổng số người dùng
 */
export async function countUsers(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/users/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Lấy tất cả người dùng
 */
export async function getUsers(page: number = 1, size: number = 10, search: string = ''): Promise<UsersResponse> {
    const response = await get<UsersResponse>(
        `${API_BACKEND_URL}/users?page=${page}&size=${size}&search=${search}`,
        {
            cache: 'no-store'
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
 * Lấy người dùng theo ID
 */
export async function getUser(id: number): Promise<UsersResponse> {
    const response = await get<UsersResponse>(
        `${API_BACKEND_URL}/users/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo người dùng mới
 */
export async function createUser(data: CreateUsersDto): Promise<UsersResponse> {
    const response = await post<CreateUsersDto, UsersResponse>(
        `${API_BACKEND_URL}/users`,
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
 * Cập nhật người dùng
 */
export async function updateUser(id: number, data: UpdateUsersDto): Promise<UsersResponse> {
    const response = await put<UpdateUsersDto, UsersResponse>(
        `${API_BACKEND_URL}/users/${id}`,
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
 * Xóa người dùng
 */
export async function deleteUser(id: number): Promise<UsersResponse> {
    const response = await del<UsersResponse>(
        `${API_BACKEND_URL}/users/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}



/**
 * Xác thực mật khẩu người dùng
 */
export async function verifyUserPassword(username: string, password: string): Promise<DataResponse> {
    const response = await post<{ username: string, password: string }, DataResponse>(
        `${API_BACKEND_URL}/users/verify-password`,
        { username, password }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}

/**
 * Lấy thông tin người dùng từ token
 */
export async function getUserByToken(): Promise<DataResponse> {
    const tokens = await getAuthTokens();
    if (!tokens.accessToken) {
        return {
            success: false,
            message: 'Unauthorized',
            result: undefined
        }
    }

    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/users/token`,
        {
            headers: {
                Authorization: `${BEARER_TOKEN} ${tokens.accessToken}`
            }
        }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}
