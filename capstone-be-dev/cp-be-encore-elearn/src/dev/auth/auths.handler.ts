import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { verifyToken } from "./auths.utils";
import { AuthDataDto } from "./auths.dto";
import { UsersDto, UsersService } from "../user";
import { getAuthData } from "encore.dev/internal/codegen/auth";

interface AuthParams {
    authorization: Header<"Authorization">;
}


const TOKEN_TYPE_ALLOW = ["8syncdev", "8syncdev-admin"];

export const myAuthHandler = authHandler<AuthParams, AuthDataDto>(
    async (params) => {
        const headerToken = params.authorization;

        if (!headerToken) {
            throw APIError.unauthenticated("Token không được cung cấp");
        }

        const [typeToken, token] = headerToken.split(" ");
        if (!TOKEN_TYPE_ALLOW.includes(typeToken)) {
            throw APIError.unauthenticated("Token không được hỗ trợ");
        }

        try {
            const { userId, username, full_name, exp, type } = verifyToken(token);

            if (type !== "ACCESS") {
                throw APIError.unauthenticated("Token không phải là token truy cập");
            }
            const user = await UsersService.findOne(Number(userId));
            if (!user) {
                throw APIError.unauthenticated("Người dùng không tồn tại");
            }
            const userData = user.result as UsersDto;

            if (userData.is_active === false) {
                throw APIError.unauthenticated("Tài khoản đã bị khóa");
            }
            if (userData.is_deleted === true) {
                throw APIError.unauthenticated("Tài khoản đã bị xóa");
            }
            if (userData.is_suspended === true) {
                throw APIError.unauthenticated("Tài khoản đã bị tạm dừng");
            }
            if (userData.is_blocked === true) {
                throw APIError.unauthenticated("Tài khoản đã bị chặn");
            }
            // console.log(userData)
            return {
                userID: userData.id.toString(),
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                full_name: userData?.full_name?.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), // Chuyen doi khong dau
                exp: exp
            }
        } catch (error) {
            throw APIError.unauthenticated("Token không hợp lệ");
        }
    }
)

export const mygw = new Gateway({
    authHandler: myAuthHandler,
})

export const getMyAuthData = getAuthData<AuthDataDto>;
