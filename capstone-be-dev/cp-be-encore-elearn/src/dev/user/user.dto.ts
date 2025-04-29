import { DataResponse, Paginated } from "../../utils";
import {
    MinLen,
    MaxLen,
    Min,
} from "encore.dev/validate"

export interface UsersDto {
    id: number & (Min<1>);
    username: string & (MinLen<5> & MaxLen<100>);
    password: string & (MinLen<8> & MaxLen<100>);
    phone: string & (MaxLen<100>);
    email: string & (MaxLen<100>);
    full_name: string & (MaxLen<100>);
    avatar: string & (MaxLen<1000>);
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
    is_deleted: boolean;
    is_blocked: boolean;
    is_suspended: boolean;
    expired_at: Date;
}

export interface CreateUsersDto extends Omit<UsersDto, "id" | "created_at" | "updated_at" | "is_active" | "is_deleted" | "is_blocked" | "is_suspended" | "expired_at" | "phone" | "email" | "full_name" | "avatar"> { }

export interface UpdateUsersDto extends Partial<UsersDto> { }

export interface UsersResponse extends Omit<DataResponse, "result"> {
    result?: UsersDto[] | UsersDto;
    pagination?: Paginated;
}
