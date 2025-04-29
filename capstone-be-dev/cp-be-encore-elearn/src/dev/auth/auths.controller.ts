import { api } from "encore.dev/api";
import { AuthService } from "./auths.service";
import { AuthDataDto, AuthResponse, AuthsDto, TokenResponse } from "./auths.dto";
import { DataResponse } from "../../utils";
import { getMyAuthData } from "./auths.handler";

export const login = api(
    { expose: true, method: "POST", path: "/auth/login" },
    async (data: AuthsDto): Promise<TokenResponse> => {
        return await AuthService.login(data);
    }
);

export const refresh = api(
    { expose: true, method: "POST", path: "/auth/refresh" },
    async ({ refreshToken }: { refreshToken: string }): Promise<TokenResponse> => {
        return await AuthService.refresh(refreshToken);
    }
);

export const getUserInfo = api(
    { expose: true, method: "POST", path: "/auth/user-info" },
    async (): Promise<AuthResponse> => {
        const myAuth = getMyAuthData();
        if (!myAuth) {
            return {
                success: false,
                message: "Token không hợp lệ",
                result: undefined
            };
        }
        return { success: true, result: myAuth };
    }
);

export const verifyTokenUser = api(
    { expose: true, method: "POST", path: "/auth/verify-token" },
    async ({ token }: { token: string }): Promise<DataResponse> => {
        return await AuthService.verifyToken(token);
    }
);
