'use server';

import { API_BACKEND_URL } from '../const.actions';
import { get, post, put, del, configGetAPI } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    BlogDto,
    BlogResponse,
    CreateBlogDto,
    UpdateBlogDto,
} from './blog.type';

/**
 * Đếm tổng số bài viết
 */
export async function countBlogs(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/blogs/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Lấy tất cả bài viết
 */
export async function getBlogs(page: number = 1, limit: number = 10, search: string = ''): Promise<BlogResponse> {
    const response = await get<BlogResponse>(
        `${API_BACKEND_URL}/blogs?page=${page}&size=${limit}&search=${search}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Lấy bài viết theo ID
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
 * Tạo bài viết mới
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
 * Cập nhật bài viết
 */
export async function updateBlog(id: number, data: UpdateBlogDto): Promise<BlogResponse> {
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
 * Xóa bài viết
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

/**
 * Lấy bài viết theo slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogResponse> {
    const config = await configGetAPI()
    const response = await get<BlogResponse>(
        `${API_BACKEND_URL}/blogs/slug/${slug}`,
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
