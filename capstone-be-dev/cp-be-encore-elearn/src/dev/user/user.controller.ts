import { api, APIError } from "encore.dev/api";
import { UsersService } from "./user.service";
import {
    UsersDto,
    UsersResponse,
    CreateUsersDto,
    UpdateUsersDto
} from "./user.dto";
import { DataResponse } from "../../utils";
import { getAuthData } from "~encore/auth";

export const countUsers = api(
    { expose: true, method: "GET", path: "/users/count" },
    async (): Promise<DataResponse> => {
        return await UsersService.count();
    }
)

export const getUsers = api(
    { expose: true, method: "GET", path: "/users" },
    async ({ page, size, search = "" }: { page: number, size: number, search: string }): Promise<UsersResponse> => {
        return await UsersService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)

export const getUser = api(
    { expose: true, method: "GET", path: "/users/:id" },
    async ({ id }: { id: number }): Promise<UsersResponse> => {
        return await UsersService.findOne(id);
    }
)

export const createUser = api(
    { expose: true, method: "POST", path: "/users" },
    async (body: CreateUsersDto): Promise<UsersResponse> => {
        return await UsersService.create(body);
    }
)

export const updateUser = api(
    { expose: true, method: "PUT", path: "/users/:id" },
    async (body: UpdateUsersDto): Promise<UsersResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Users not found"
            };
        }
        return await UsersService.update(body.id, body);
    }
)

export const deleteUser = api(
    { expose: true, method: "DELETE", path: "/users/:id" },
    async ({ id }: { id: number }): Promise<UsersResponse> => {
        return await UsersService.delete(id);
    }
)


export const verifyUserPassword = api(
    { expose: true, method: "POST", path: "/users/verify-password" },
    async ({ username, password }: { username: string, password: string }): Promise<DataResponse> => {
        return await UsersService.verifyUserPassword(username, password);
    }
)

export const getUserByToken = api(
    { expose: true, method: "GET", path: "/users/token", auth: true },
    async (): Promise<DataResponse> => {
        const data = getAuthData();
        console.log(data)
        return {
            success: true,
            result: data
        };
    }
)

