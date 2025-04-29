import { db } from "./db/users.db";
import { usersTable } from "./db/users.schema";
import {
    UsersDto,
    UsersResponse,
    CreateUsersDto,
    UpdateUsersDto
} from "./user.dto";
import { count, sql, eq, asc, or, ilike } from 'drizzle-orm';
import { DataResponse, extractMDX, getOffset, paginatedData } from "../../utils";
import { hashPassword, verifyPassword } from '../auth/auths.utils';

export const UsersService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(usersTable)) as number
        };
    },

    findOne: async (id: number): Promise<UsersResponse> => {
        const [users] = await db.select()
            .from(usersTable)
            .where(eq(usersTable.id, id))
            .limit(1);

        if (!users) {
            return {
                success: false,
                message: "Users not found"
            };
        }

        return {
            success: true,
            result: users as UsersDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<UsersResponse> => {
        const offset = getOffset(page, size);
        const total = (await UsersService.count()).result as number;

        const whereCondition = search
            ? or(
                ilike(usersTable.username, `%${search}%`),
                ilike(usersTable.phone, `%${search}%`),
                ilike(usersTable.email, `%${search}%`),
                ilike(usersTable.full_name, `%${search}%`)
            )
            : undefined;

        const results = await db
            .select()
            .from(usersTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(usersTable.id));



        return {
            success: true,
            result: results as UsersDto[],
            pagination: paginatedData({ page, size, count: search ? results.length : total })
        };
    },

    create: async (data: CreateUsersDto): Promise<UsersResponse> => {
        const hashedPassword = await hashPassword(data.password);

        const [users] = await db.insert(usersTable)
            .values({
                ...data,
                password: hashedPassword,
            })
            .returning();

        return {
            success: true,
            result: users as UsersDto
        };
    },

    update: async (id: number, data: UpdateUsersDto): Promise<UsersResponse> => {
        const [existingUser] = await db.select()
            .from(usersTable)
            .where(eq(usersTable.id, id))
            .limit(1);

        if (!existingUser) {
            return {
                success: false,
                message: "Users not found"
            };
        }

        const updateData = {
            username: data.username || existingUser.username,
            password: data.password ? await hashPassword(data.password) : existingUser.password,
            phone: data.phone ?? existingUser.phone,
            email: data.email ?? existingUser.email,
            full_name: data.full_name ?? existingUser.full_name,
            avatar: data.avatar ?? existingUser.avatar,
            is_active: data.is_active ?? existingUser.is_active,
            is_blocked: data.is_blocked ?? existingUser.is_blocked,
            is_suspended: data.is_suspended ?? existingUser.is_suspended,
            is_deleted: data.is_deleted ?? existingUser.is_deleted
        };

        const [users] = await db.update(usersTable)
            .set(updateData)
            .where(eq(usersTable.id, id))
            .returning();

        return {
            success: true,
            result: users as UsersDto
        };
    },

    delete: async (id: number): Promise<UsersResponse> => {
        const [users] = await db.delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();

        if (!users) {
            return {
                success: false,
                message: "Users not found"
            };
        }

        return {
            success: true,
            message: "Users deleted successfully"
        };
    },

    verifyUserPassword: async (username: string, password: string): Promise<DataResponse> => {
        const [user] = await db.select()
            .from(usersTable)
            .where(eq(usersTable.username, username))
            .limit(1);

        if (!user) {
            return {
                success: false,
                message: "Users not found"
            };
        }

        const isPasswordValid = await verifyPassword(password, user.password);

        return {
            success: true,
            result: isPasswordValid,
            message: isPasswordValid ? "Password is valid" : "Password is invalid"
        };
    },

    findByUsername: async (username: string): Promise<UsersResponse> => {
        const [users] = await db.select()
            .from(usersTable)
            .where(eq(usersTable.username, username))
            .limit(1);

        if (!users) {
            return {
                success: false,
                message: "Users not found"
            };
        }

        return {
            success: true,
            result: users as UsersDto
        };
    }
};

export default UsersService;
