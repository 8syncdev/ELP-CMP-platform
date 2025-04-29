'use server';

import { API_BACKEND_URL, BEARER_TOKEN } from '../const.actions';
import { get, post, put, del, configGetAPI } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    BlogDto,
    BlogResponse,
    CreateBlogDto,
    UpdateBlogDto
} from './blog.type';
import { getAuthTokens } from '../cookie.actions';

/**
 * Get total number of blogs
 */
export async function countBlogs(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/blogs/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    };
}

/**
 * Get all blogs with pagination and search
 */
export async function getBlogs(
    page: number = 1,
    size: number = 10,
    search: string = ""
): Promise<BlogResponse> {
    const response = await get<BlogResponse>(
        `${API_BACKEND_URL}/blogs?page=${page}&size=${size}&search=${search}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Get blog by ID
 */
export async function getBlog(id: number): Promise<BlogResponse> {
    const response = await get<BlogResponse>(
        `${API_BACKEND_URL}/blogs/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Create new blog
 */
export async function createBlog(data: CreateBlogDto): Promise<BlogResponse> {
    const response = await post<CreateBlogDto, BlogResponse>(
        `${API_BACKEND_URL}/blogs`,
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
 * Update blog
 */
export async function updateBlog(id: number, data: UpdateBlogDto): Promise<BlogResponse> {
    // Ensure id is set
    if (!id) {
        return {
            success: false,
            message: "Id is required"
        };
    }

    const response = await put<UpdateBlogDto, BlogResponse>(
        `${API_BACKEND_URL}/blogs/${id}`,
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
 * Delete blog
 */
export async function deleteBlog(id: number): Promise<BlogResponse> {
    const response = await del<BlogResponse>(
        `${API_BACKEND_URL}/blogs/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}
