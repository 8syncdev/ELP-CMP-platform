import crypto from 'crypto';
import { MY_INFO } from '../../constants/my-info';

/** Số lần lặp lại quá trình băm để tăng độ bảo mật */
const ITERATIONS = 310000;

/** Độ dài của khóa được tạo ra (bytes) */
const KEYLEN = 64;

/** Thuật toán băm được sử dụng */
const DIGEST = 'sha512';

/** Thời gian hết hạn của token (giây) */
const TOKEN_EXPIRATION = {
    ACCESS: 24 * 60 * 60 * 30, // 30 ngày
    REFRESH: 24 * 60 * 60 * 30 * 3 // 3 tháng
    // Test development
    // ACCESS: 60,
    // REFRESH: 60 * 7
};

/** Loại token */
type TokenType = 'ACCESS' | 'REFRESH';

/** 
 * Hàm băm mật khẩu sử dụng crypto
 * @param password Mật khẩu cần băm
 * @returns Chuỗi chứa salt và hash được nối với nhau bởi dấu ':'
 */
export async function hashPassword(password?: string): Promise<string> {
    if (!password) {
        throw new Error("Password is required");
    }

    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
    return `${salt}:${hash}`;
}

/**
 * Hàm xác thực mật khẩu bằng cách so sánh với hash đã lưu
 * @param password Mật khẩu cần xác thực
 * @param storedHash Chuỗi hash đã lưu trữ (định dạng: salt:hash)
 * @returns true nếu mật khẩu khớp, false nếu không khớp
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
    return hash === verifyHash;
}

/** Khóa bí mật dùng để ký JWT */
const secret = process.env.JWT_SECRET || "8syncdev1910200427122003";

/** Interface cơ bản cho dữ liệu người dùng */
interface UserData {
    userId: string;
    username: string;
    full_name?: string;
}

/** Interface cho JWT Payload */
interface JWTPayload {
    // Thông tin người dùng
    userId: string;
    username: string;
    full_name?: string;

    // Thông tin JWT
    iat: number;
    exp: number;
    jti: string;
    iss: string;
    aud: string;

    type: TokenType;  // Thêm trường type
}

/** Kết quả trả về khi verify token */
interface TokenVerifyResult {
    userId: string;
    username: string;
    full_name?: string;
    exp: number;
}

/** Kết quả khi tạo token */
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

/**
 * Tạo cặp access token và refresh token cho người dùng
 * @param userData Thông tin người dùng
 * @returns Cặp token mới
 */
export function generateTokenPair(userData: UserData): TokenPair {
    const generateSpecificToken = (type: TokenType) => {
        const header = {
            alg: 'HS512' as const,
            typ: 'JWT' as const
        };

        const payload: JWTPayload = {
            userId: userData.userId,
            username: userData.username,
            full_name: userData.full_name,
            type: type,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION[type],
            jti: crypto.randomBytes(16).toString('hex'),
            iss: MY_INFO.slug,
            aud: MY_INFO.slug
        };

        const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url');
        const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

        const signature = crypto
            .createHmac('sha512', secret)
            .update(`${headerBase64}.${payloadBase64}`)
            .digest('base64url');

        return `${headerBase64}.${payloadBase64}.${signature}`;
    };

    return {
        accessToken: generateSpecificToken('ACCESS'),
        refreshToken: generateSpecificToken('REFRESH')
    };
}

/**
 * Tạo token mới từ refresh token
 * @param refreshToken Refresh token hiện tại
 * @returns Cặp token mới
 * @throws Error nếu refresh token không hợp lệ hoặc đã hết hạn
 */
export function refreshTokenPair(refreshToken: string): TokenPair {
    const payload = verifyToken(refreshToken);

    // Kiểm tra có phải là refresh token không
    if (payload.type !== 'REFRESH') {
        throw new Error('Invalid refresh token');
    }

    // Tạo cặp token mới
    const userData: UserData = {
        userId: payload.userId,
        username: payload.username,
        full_name: payload.full_name
    };

    return generateTokenPair(userData);
}

/**
 * Xác thực và giải mã JWT token
 * @param token JWT token cần xác thực
 * @returns Object chứa thông tin người dùng (sub và username)
 * @throws Error nếu token không hợp lệ hoặc đã hết hạn
 */
export function verifyToken(token: string): TokenVerifyResult & { type: TokenType } {
    const [headerBase64, payloadBase64, signature] = token.split('.');

    const verifySignature = crypto
        .createHmac('sha512', secret)
        .update(`${headerBase64}.${payloadBase64}`)
        .digest('base64url');

    if (signature !== verifySignature) {
        throw new Error("Invalid token signature");
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString()) as JWTPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Token đã hết hạn");
    }

    return {
        userId: payload.userId,
        username: payload.username,
        full_name: payload.full_name,
        exp: payload.exp,
        type: payload.type
    };
}

export type { UserData, JWTPayload, TokenVerifyResult, TokenPair, TokenType };
