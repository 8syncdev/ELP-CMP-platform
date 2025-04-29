import { api, APIError } from "encore.dev/api";
import { RoleService, UserRoleService } from "./role.service";
import {
    RoleDto,
    RoleResponse,
    CreateRoleDto,
    UpdateRoleDto,
    CreateUserRoleDto,
    UserRoleResponse,
    RoleName,
    UpdateUserRoleDto
} from "./role.dto";
import { DataResponse } from "../../utils";
import { getMyAuthData } from "../auth";

export const countRoles = api(
    { expose: true, method: "GET", path: "/roles/count" },
    async (): Promise<DataResponse> => {
        return await RoleService.count();
    }
)

export const getRoles = api(
    { expose: true, method: "GET", path: "/roles" },
    async ({ page = 1, size = 10, search = "" }: { page?: number, size?: number, search?: string }): Promise<RoleResponse> => {
        return await RoleService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)

export const getRole = api(
    { expose: true, method: "GET", path: "/roles/:id" },
    async ({ id }: { id: number }): Promise<RoleResponse> => {
        return await RoleService.findOne(id);
    }
)

export const createRole = api(
    { expose: true, method: "POST", path: "/roles" },
    async (body: CreateRoleDto): Promise<RoleResponse> => {
        return await RoleService.create(body);
    }
)

export const updateRole = api(
    { expose: true, method: "PUT", path: "/roles/:id" },
    async (body: UpdateRoleDto): Promise<RoleResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await RoleService.update(body.id, body);
    }
)

export const deleteRole = api(
    { expose: true, method: "DELETE", path: "/roles/:id" },
    async ({ id }: { id: number }): Promise<RoleResponse> => {
        return await RoleService.delete(id);
    }
)


// User Role
export const getUserRoles = api(
    { expose: true, method: "GET", path: "/user-roles" },
    async ({ page = 1, size = 10, search = "" }: { page?: number, size?: number, search?: string }): Promise<UserRoleResponse> => {
        return await UserRoleService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)


export const createUserRole = api(
    { expose: true, method: "POST", path: "/user-roles" },
    async (body: CreateUserRoleDto): Promise<UserRoleResponse> => {
        return await UserRoleService.create(body);
    }
)

export const updateUserRole = api(
    { expose: true, method: "PUT", path: "/user-roles/:userId/:roleId" },
    async (body: UpdateUserRoleDto): Promise<UserRoleResponse> => {
        console.log(body);
        return await UserRoleService.update(Number(body.userId), Number(body.roleId), body);
    }
)

export const deleteUserRole = api(
    { expose: true, method: "DELETE", path: "/user-roles/:userId/:roleId" },
    async ({ userId, roleId }: { userId: number, roleId: number }): Promise<UserRoleResponse> => {
        return await UserRoleService.delete(userId, roleId);
    }
)

export const checkUserRole = api(
    { expose: true, method: "GET", path: "/user-roles/check/:userId/:roleId" },
    async ({ userId, roleId }: { userId: number, roleId: number }): Promise<UserRoleResponse> => {
        return await UserRoleService.checkUserRole(userId, roleId);
    }
)

export const checkRole = api(
    { expose: true, method: "GET", path: "/user-roles/check/:userId" },
    async ({ userId, roleName }: { userId: number, roleName: RoleName }): Promise<UserRoleResponse> => {
        return await UserRoleService.checkRole(userId, roleName);
    }
)


export const checkRoleAdmin = api(
    { expose: true, method: "GET", path: "/user-roles/check/admin" },
    async (): Promise<UserRoleResponse> => {
        const data = getMyAuthData();
        if (!data) {
            return {
                success: false,
                message: "User not found"
            };
        }
        return await UserRoleService.checkRole(Number(data.userID), "admin");
    }
)

export const getAllRolesByUserId = api(
    { expose: true, method: "GET", path: "/user-roles/all/:userId" },
    async ({ userId }: { userId: number }): Promise<RoleResponse> => {
        return await UserRoleService.getAllRolesByUserId(userId);
    }
)

export const createRolesForUser = api(
    { expose: true, method: "POST", path: "/user-roles/create/:userId" },
    async ({ userId, roleNames }: { userId: number, roleNames: RoleName[] }): Promise<UserRoleResponse> => {
        return await UserRoleService.createRolesForUser(userId, roleNames);
    }
)

export const deleteRolesForUser = api(
    { expose: true, method: "POST", path: "/user-roles/delete/:userId" },
    async ({ userId, roleNames }: { userId: number, roleNames: RoleName[] }): Promise<UserRoleResponse> => {
        // console.log(userId, roleNames);
        return await UserRoleService.deleteRolesForUser(userId, roleNames);
    }
)
