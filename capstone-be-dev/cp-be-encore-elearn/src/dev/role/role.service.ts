import { db } from "./db/role.db";
import { roleTable, userRolesTable } from "./db/role.schema";
import {
    RoleDto,
    RoleResponse,
    CreateRoleDto,
    UpdateRoleDto,
    UserRoleDto,
    CreateUserRoleDto,
    UserRoleResponse,
    UpdateUserRoleDto,
    RoleName
} from "./role.dto";
import { count, sql, eq, asc, and, inArray, ilike, or } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";

export const RoleService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(roleTable)) as number
        };
    },

    findOne: async (id: number): Promise<RoleResponse> => {
        const [role] = await db.select()
            .from(roleTable)
            .where(eq(roleTable.id, id))
            .limit(1);

        if (!role) {
            return {
                success: false,
                message: "Role not found"
            };
        }

        return {
            success: true,
            result: role as RoleDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<RoleResponse> => {
        const offset = getOffset(page, size);
        const total = (await RoleService.count()).result as number;

        const whereCondition = search
            ? or(
                ilike(roleTable.name, `%${search}%`),
                ilike(roleTable.description, `%${search}%`)
            )
            : undefined;

        const results = await db.select()
            .from(roleTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(roleTable.id));

        return {
            success: true,
            result: results as RoleDto[],
            pagination: paginatedData({ page, size, count: search ? results.length : total })
        };
    },

    create: async (data: CreateRoleDto): Promise<RoleResponse> => {
        const [role] = await db.insert(roleTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: role as RoleDto
        };
    },

    update: async (id: number, data: UpdateRoleDto): Promise<RoleResponse> => {
        const [role] = await db.update(roleTable)
            .set(data)
            .where(eq(roleTable.id, id))
            .returning();

        if (!role) {
            return {
                success: false,
                message: "Role not found"
            };
        }

        return {
            success: true,
            result: role as RoleDto
        };
    },

    delete: async (id: number): Promise<RoleResponse> => {
        const [role] = await db.delete(roleTable)
            .where(eq(roleTable.id, id))
            .returning();

        if (!role) {
            return {
                success: false,
                message: "Role not found"
            };
        }

        return {
            success: true,
            message: "Role deleted successfully"
        };
    },
};



export const UserRoleService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(userRolesTable)) as number
        };
    },

    findOne: async (userId: number, roleId: number): Promise<UserRoleResponse> => {
        const [userRole] = await db.select()
            .from(userRolesTable)
            .where(and(eq(userRolesTable.userId, userId), eq(userRolesTable.roleId, roleId)))
            .limit(1);

        if (!userRole) {
            return {
                success: false,
                message: "User role not found"
            };
        }

        return {
            success: true,
            result: userRole as UserRoleDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<UserRoleResponse> => {
        const offset = getOffset(page, size);
        const total = (await UserRoleService.count()).result as number;

        const parsedSearch = Number(search);

        const whereCondition = search
            ? or(
                eq(userRolesTable.userId, parsedSearch),
                eq(userRolesTable.roleId, parsedSearch)
            )
            : undefined;

        const results = await db.select()
            .from(userRolesTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(userRolesTable.userId));

        return {
            success: true,
            result: results as UserRoleDto[],
            pagination: paginatedData({ page, size, count: search ? results.length : total })
        };
    },

    create: async (data: CreateUserRoleDto): Promise<UserRoleResponse> => {
        const [userRole] = await db.insert(userRolesTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: userRole as UserRoleDto
        };
    },

    delete: async (userId: number, roleId: number): Promise<UserRoleResponse> => {
        const [userRole] = await db.delete(userRolesTable)
            .where(and(eq(userRolesTable.userId, userId), eq(userRolesTable.roleId, roleId)))
            .returning();

        return {
            success: true,
            message: "User role deleted successfully"
        };
    },

    update: async (userId: number, roleId: number, data: UpdateUserRoleDto): Promise<UserRoleResponse> => {
        const [userRole] = await db.update(userRolesTable)
            .set(data)
            .where(and(eq(userRolesTable.userId, userId), eq(userRolesTable.roleId, roleId)))
            .returning();

        return {
            success: true,
            result: userRole as UserRoleDto
        };
    },
    checkUserRole: async (userId: number, roleId: number): Promise<UserRoleResponse> => {
        const [userRole] = await db.select()
            .from(userRolesTable)
            .where(and(eq(userRolesTable.userId, userId), eq(userRolesTable.roleId, roleId)))
            .limit(1);

        if (!userRole) {
            return {
                success: false,
                message: "User role not found"
            };
        }

        return {
            success: true,
            result: userRole as UserRoleDto
        };
    },
    checkRole: async (userId: number, roleName: RoleName): Promise<UserRoleResponse> => {
        let roleId: number = 0;

        if (roleName === "admin") {
            roleId = 1;
        } else if (roleName === "user") {
            roleId = 2;
        } else {
            return {
                success: false,
                message: "Role name is invalid"
            };
        }

        const [userRole] = await db.select()
            .from(userRolesTable)
            .where(and(eq(userRolesTable.userId, userId), eq(userRolesTable.roleId, roleId)))
            .limit(1);

        if (!userRole) {
            return {
                success: false,
                message: "User role not found"
            };
        }

        return {
            success: true,
            result: userRole as UserRoleDto
        };
    },

    getAllRolesByUserId: async (userId: number): Promise<RoleResponse> => {
        const results = await db.select()
            .from(userRolesTable)
            .where(eq(userRolesTable.userId, userId));

        const allRoles = (await RoleService.findAll()).result as RoleDto[];


        return {
            success: true,
            result: allRoles.filter(role => results.some(userRole => userRole.roleId === role.id))
        };
    },

    createRolesForUser: async (userId: number, roleNames: RoleName[]): Promise<UserRoleResponse> => {
        const allRoles = (await RoleService.findAll()).result as RoleDto[];

        const results = await db.insert(userRolesTable)
            .values(allRoles.filter(role => roleNames.includes(role.name)).map(role => ({ userId, roleId: role.id })))
            .returning();

        if (results.length === 0) {
            return {
                success: false,
                message: "User roles not created"
            };
        }
        return {
            success: true,
            message: "User roles created successfully"
        };
    },

    deleteRolesForUser: async (userId: number, roleNames: RoleName[]): Promise<UserRoleResponse> => {
        const allRoles = (await RoleService.findAll()).result as RoleDto[];
        const roleIds = allRoles.filter(role => (roleNames.includes(role.name))).map(role => role.id);

        const results = await db.delete(userRolesTable)
            .where(and(eq(userRolesTable.userId, userId), inArray(userRolesTable.roleId, roleIds)))
            .returning();

        if (results.length === 0) {
            return {
                success: false,
                message: "User roles not deleted"
            };
        }

        return {
            success: true,
            message: "User roles deleted successfully"
        };
    }
}




