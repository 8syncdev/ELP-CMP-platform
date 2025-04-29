'use server';

import { API_BACKEND_URL } from '../const.actions';
import { post } from '../config.actions';
import { AuthsDto, TokenResponse, AuthResponse } from './auth.type';
import { getAuthTokens } from '../cookie.actions';

const BEARER_TOKEN = '8syncdev'

/**
 * Đăng nhập người dùng
 */
export async function login(data: AuthsDto): Promise<TokenResponse> {
    const response = await post<AuthsDto, TokenResponse>(
        `${API_BACKEND_URL}/auth/login`,
        data
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}

/**
 * Làm mới token
 */
export async function refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await post<{ refreshToken: string }, TokenResponse>(
        `${API_BACKEND_URL}/auth/refresh`,
        { refreshToken }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}

/**
 * Lấy thông tin người dùng hiện tại
 */
export async function getUserInfo(): Promise<AuthResponse> {
    const tokens = await getAuthTokens()
    if (!tokens.accessToken) {
        return {
            success: false,
            message: 'Unauthorized',
            result: undefined
        }
    }
    const response = await post<void, AuthResponse>(
        `${API_BACKEND_URL}/auth/user-info`,
        undefined,
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

/**
 * Xác thực token (internal use)
 */
export async function verifyToken(token: string): Promise<AuthResponse> {
    const response = await post<{ token: string }, AuthResponse>(
        `${API_BACKEND_URL}/auth/verify-token`,
        { token },
        {
            headers: {
                Authorization: `${BEARER_TOKEN} ${token}`
            }
        }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}
