import { DataResponse, Paginated } from "../../utils";
import {
    MinLen,
    MaxLen,
    Min,
} from "encore.dev/validate"

// Role
export interface RoleDto {
    id: number & (Min<1>);
    name: string & (MinLen<1> & MaxLen<255>);
    description: string & (MinLen<1> & MaxLen<500>);
}

export interface CreateRoleDto extends Omit<RoleDto, "id"> { }

export interface UpdateRoleDto extends Partial<RoleDto> { }

export interface RoleResponse extends Omit<DataResponse, "result"> {
    result?: RoleDto[] | RoleDto;
    pagination?: Paginated;
}

// User Role

export interface UserRoleDto {
    userId: number & (Min<1>);
    roleId: number & (Min<1>);
}

export interface CreateUserRoleDto extends UserRoleDto { }

export interface UpdateUserRoleDto extends Partial<UserRoleDto> { }

export interface UserRoleResponse extends Omit<DataResponse, "result"> {
    result?: UserRoleDto[] | UserRoleDto;
    pagination?: Paginated;
}

export type RoleName = "admin" | "user" | string;
