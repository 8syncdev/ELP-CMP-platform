import { DataResponse } from "../base.dto";

/** Interface cơ bản cho dữ liệu người dùng */
export interface AuthsDto {
    username: string;
    password: string;
}

export interface AuthDataDto {
    userID: string;
    username: string;
    full_name?: string;
    email?: string;
    phone?: string;
    exp?: number;
}

export interface TokenDto {
    accessToken: string;
    refreshToken: string;
}

export interface TokenResponse extends Omit<DataResponse, "result"> {
    result?: TokenDto;
}

export interface AuthResponse extends Omit<DataResponse, "result"> {
    result?: AuthDataDto;
}
