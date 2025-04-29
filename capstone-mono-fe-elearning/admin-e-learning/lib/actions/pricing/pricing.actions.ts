'use server';

import { API_BACKEND_URL } from '../const.actions';
import { get, post, put, del, configGetAPI } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    PricingDto,
    PricingResponse,
    CreatePricingDto,
    UpdatePricingDto,
    PricingUserDto,
    PricingUserResponse,
    CreatePricingUserDto,
    UpdatePricingUserDto
} from './pricing.type';

/**
 * Get total number of pricings
 */
export async function countPricings(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/pricings/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}

/**
 * Get all pricings
 */
export async function getPricings(page: number = 1, limit: number = 10, search: string = ''): Promise<PricingResponse> {
    const response = await get<PricingResponse>(
        `${API_BACKEND_URL}/pricings?page=${page}&size=${limit}&search=${search}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Get pricing by ID
 */
export async function getPricing(id: number): Promise<PricingResponse> {
    const response = await get<PricingResponse>(
        `${API_BACKEND_URL}/pricings/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Create new pricing
 */
export async function createPricing(data: CreatePricingDto): Promise<PricingResponse> {
    const response = await post<CreatePricingDto, PricingResponse>(
        `${API_BACKEND_URL}/pricings`,
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
 * Update pricing
 */
export async function updatePricing(id: number, data: UpdatePricingDto): Promise<PricingResponse> {
    const response = await put<UpdatePricingDto, PricingResponse>(
        `${API_BACKEND_URL}/pricings/${id}`,
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
 * Delete pricing
 */
export async function deletePricing(id: number): Promise<PricingResponse> {
    const response = await del<PricingResponse>(
        `${API_BACKEND_URL}/pricings/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/* Pricing User Actions */

/**
 * Get total number of pricing users
 */
export async function countPricingUsers(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/pricing-users/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}

/**
 * Get pricing users by pricing ID
 */
export async function getPricingUsersByPricingId(
    pricingId: number,
    page?: number,
    size?: number
): Promise<PricingUserResponse> {
    const response = await get<PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/pricing/${pricingId}${page ? `?page=${page}` : ''}${size ? `&size=${size}` : ''}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Get pricing users for authenticated user
 */
export async function getPricingUsersByUserAuth(
    page: number = 1,
    size: number = 10
): Promise<PricingUserResponse> {
    const config = await configGetAPI();
    const response = await get<PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/user?page=${page}&size=${size}`,
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
 * Get pricing users by user ID
 */
export async function getPricingUsersByUserId(
    userId: number,
    page: number = 1,
    size: number = 10
): Promise<PricingUserResponse> {
    const response = await get<PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/user/${userId}?page=${page}&size=${size}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Get specific pricing user
 */
export async function getPricingUser(
    pricingId: number,
    userId: number
): Promise<PricingUserResponse> {
    const response = await get<PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/${pricingId}/${userId}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Create pricing user for authenticated user
 */
export async function createPricingUserAuth(
    data: CreatePricingUserDto
): Promise<PricingUserResponse> {
    const config = await configGetAPI();
    const response = await post<CreatePricingUserDto, PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users`,
        data,
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
 * Create pricing user with specific user ID
 */
export async function createPricingUserId(
    pricingId: number,
    userId: number
): Promise<PricingUserResponse> {
    const response = await post<{ pricing_id: number, user_id: number }, PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-user-id`,
        { pricing_id: pricingId, user_id: userId }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Update pricing user
 */
export async function updatePricingUser(
    pricingId: number,
    userId: number,
    data: UpdatePricingUserDto
): Promise<PricingUserResponse> {
    const response = await put<UpdatePricingUserDto, PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/${pricingId}/${userId}`,
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
 * Update pricing user for authenticated user
 */
export async function updatePricingUserAuth(
    pricingId: number,
    data: UpdatePricingUserDto
): Promise<PricingUserResponse> {
    const config = await configGetAPI();
    const response = await put<UpdatePricingUserDto, PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/${pricingId}`,
        data,
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
 * Delete pricing user
 */
export async function deletePricingUser(
    pricingId: number,
    userId: number
): Promise<PricingUserResponse> {
    const response = await del<PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/${pricingId}/${userId}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Delete pricing user for authenticated user
 */
export async function deletePricingUserAuth(
    pricingId: number
): Promise<PricingUserResponse> {
    const config = await configGetAPI();
    const response = await del<PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/${pricingId}`,
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
 * Get all pricing users
 */
export async function getAllPricingUsers(
    page: number = 1,
    size: number = 10,
    search: string = ""
): Promise<PricingUserResponse> {
    const response = await get<PricingUserResponse>(
        `${API_BACKEND_URL}/pricing-users/all?page=${page}&size=${size}&search=${search}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

