'use server';

import { API_BACKEND_URL, BEARER_TOKEN } from '../const.actions';
import { get, post, put, del } from '../config.actions';
import { DataResponse } from '../base.dto';
import {
    RoleDto,
    RoleResponse,
    CreateRoleDto,
    UpdateRoleDto,
    UserRoleDto,
    UserRoleResponse,
    CreateUserRoleDto,
    RoleName,
    UpdateUserRoleDto
} from './role.type';
import { getAuthTokens } from '../cookie.actions';

/**
 * Đếm tổng số vai trò
 */
export async function countRoles(): Promise<DataResponse> {
    const response = await get<DataResponse>(
        `${API_BACKEND_URL}/roles/count`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result
    }
}

/**
 * Lấy tất cả vai trò
 */
export async function getRoles(page: number = 1, size: number = 10, search: string = ''): Promise<RoleResponse> {
    const response = await get<RoleResponse>(
        `${API_BACKEND_URL}/roles?page=${page}&size=${size}&search=${search}`,
        {
            cache: "no-store"
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
 * Lấy vai trò theo ID
 */
export async function getRole(id: number): Promise<RoleResponse> {
    const response = await get<RoleResponse>(
        `${API_BACKEND_URL}/roles/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo vai trò mới
 */
export async function createRole(data: CreateRoleDto): Promise<RoleResponse> {
    const response = await post<CreateRoleDto, RoleResponse>(
        `${API_BACKEND_URL}/roles`,
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
 * Cập nhật vai trò
 */
export async function updateRole(id: number, data: UpdateRoleDto): Promise<RoleResponse> {
    const response = await put<UpdateRoleDto, RoleResponse>(
        `${API_BACKEND_URL}/roles/${id}`,
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
 * Xóa vai trò
 */
export async function deleteRole(id: number): Promise<RoleResponse> {
    const response = await del<RoleResponse>(
        `${API_BACKEND_URL}/roles/${id}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

// User Role

/**
 * Lấy tất cả vai trò người dùng
 */
export async function getUserRoles(page: number = 1, size: number = 10, search: string = ''): Promise<UserRoleResponse> {
    const response = await get<UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles?page=${page}&size=${size}&search=${search}`,
        {
            cache: "no-store"
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
 * Tạo vai trò người dùng mới
 */
export async function createUserRole(data: CreateUserRoleDto): Promise<UserRoleResponse> {
    const response = await post<CreateUserRoleDto, UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles`,
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
 * Cập nhật vai trò người dùng
 */
export async function updateUserRole(userId: number, roleId: number, data: UpdateUserRoleDto): Promise<UserRoleResponse> {
    const response = await put<UpdateUserRoleDto, UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles/${userId}/${roleId}`,
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
 * Xóa vai trò người dùng
 */
export async function deleteUserRole(userId: number, roleId: number): Promise<UserRoleResponse> {
    const response = await del<UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles/${userId}/${roleId}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Kiểm tra vai trò người dùng
 */
export async function checkUserRole(userId: number, roleId: number): Promise<UserRoleResponse> {
    const response = await get<UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles/check/${userId}/${roleId}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Kiểm tra vai trò theo tên
 */
export async function checkRole(userId: number, roleName: RoleName): Promise<UserRoleResponse> {
    const response = await get<UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles/check/${userId}?roleName=${roleName}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Kiểm tra vai trò admin của người dùng hiện tại
 */
export async function checkRoleAdmin(): Promise<UserRoleResponse> {
    const tokens = await getAuthTokens();
    if (!tokens.accessToken) {
        return {
            success: false,
            message: 'Unauthorized',
            result: undefined
        }
    }

    const response = await get<UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles/check/admin`,
        {
            headers: {
                Authorization: `${BEARER_TOKEN} ${tokens.accessToken}`
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

/**
 * Lấy tất cả vai trò của người dùng theo ID
 * Ví dụ:
 * {"userId":21}
 * [{"description":"Người dùng thông thường","id":2,"name":"user"}]
 */
export async function getAllRolesByUserId(userId: number): Promise<RoleResponse> {
    const response = await get<RoleResponse>(
        `${API_BACKEND_URL}/user-roles/all/${userId}`
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Tạo vai trò cho người dùng
 * Ví dụ:
 * {"userId":21,"roleNames":["admin"]}
 * {"message":"User roles created successfully","success":true}
 */
export async function createRolesForUser(userId: number, roleNames: RoleName[]): Promise<UserRoleResponse> {
    const response = await post<{ roleNames: RoleName[] }, UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles/create/${userId}`,
        { roleNames }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

/**
 * Xóa vai trò của người dùng
 * Ví dụ:
 * {"userId":21,"roleNames":["user"]}
 * {"message":"User roles deleted successfully","success":true}
 */
export async function deleteRolesForUser(userId: number, roleNames: RoleName[]): Promise<UserRoleResponse> {
    const response = await post<{ roleNames: RoleName[] }, UserRoleResponse>(
        `${API_BACKEND_URL}/user-roles/delete/${userId}`,
        { roleNames }
    );

    return {
        success: response.data?.success || false,
        message: response.data?.message || undefined,
        result: response.data?.result,
        pagination: response.data?.pagination
    };
}

