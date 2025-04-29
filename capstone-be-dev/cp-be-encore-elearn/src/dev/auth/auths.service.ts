import { generateTokenPair, verifyPassword, refreshTokenPair, verifyToken } from "./auths.utils";
import { UsersDto, UsersService } from "../user";
import {
    AuthDataDto,
    TokenDto,
    AuthResponse,
    TokenResponse,
    AuthsDto
} from "./auths.dto";
import { DataResponse } from "../../utils";

export const AuthService = {
    /**
     * Xử lý đăng nhập
     */
    login: async (data: AuthsDto): Promise<TokenResponse> => {
        // Tìm user theo username
        const user = await UsersService.findByUsername(data.username);

        if (!user.success || !user.result) {
            return {
                success: false,
                message: "Tài khoản không tồn tại"
            };
        }

        const userData = user.result as UsersDto;

        // Verify password
        const isValidPassword = await verifyPassword(data.password, userData.password);
        if (!isValidPassword) {
            return {
                success: false,
                message: "Mật khẩu không chính xác"
            };
        }

        // Tạo token pair
        const tokens = generateTokenPair({
            userId: userData.id.toString(),
            username: userData.username,
            full_name: userData.full_name
        });

        return {
            success: true,
            result: tokens
        };
    },

    /**
     * Refresh token
     */
    refresh: async (refreshToken: string): Promise<TokenResponse> => {
        try {
            const newTokens = refreshTokenPair(refreshToken);
            return {
                success: true,
                result: newTokens
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "Lỗi không xác định"
            };
        }
    },

    verifyToken: async (token: string): Promise<DataResponse> => {
        const authData = verifyToken(token);
        return {
            success: true,
            result: authData
        };
    }
};


