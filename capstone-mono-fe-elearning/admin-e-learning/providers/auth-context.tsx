'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthDataDto } from '@/lib/actions/auth/auth.type';
import { getUserInfo, login, refresh, verifyToken } from '@/lib/actions/auth/auth.actions';
import { getAuthTokens, removeAuthTokens, setAuthTokens } from '@/lib/actions/cookie.actions';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: AuthDataDto | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthDataDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const logInfo = false;
    // Kiểm tra token hợp lệ và refresh nếu cần
    const checkAndRefreshToken = async () => {
        const tokens = await getAuthTokens();
        if (logInfo) {
            console.log('Tokens', tokens);
        }

        if (!tokens.accessToken) {
            if (logInfo) {
                console.log('No access token');
            }
            if (tokens.refreshToken) {
                try {
                    const refreshResponse = await refresh(tokens.refreshToken);
                    if (refreshResponse.success && refreshResponse.result) {
                        await setAuthTokens(refreshResponse.result);
                        return true;
                    }
                    await removeAuthTokens();
                    setUser(null);
                    return false;
                } catch (error) {
                    await removeAuthTokens();
                    setUser(null);
                    return false;
                }
            }
            return false;
        }

        try {
            // Verify access token với backend
            if (logInfo) {
                console.log('Verify access token');
            }
            const verifyResponse = await verifyToken(tokens.accessToken);
            if (!verifyResponse.success) {
                // Nếu access token không hợp lệ, thử refresh
                if (tokens.refreshToken) {
                    if (logInfo) {
                        console.log('Refresh token');
                    }
                    const refreshResponse = await refresh(tokens.refreshToken);
                    if (refreshResponse.success && refreshResponse.result) {
                        await setAuthTokens(refreshResponse.result);
                        return true;
                    }
                }
                await removeAuthTokens();
                setUser(null);
                return false;
            }
            return true;
        } catch (error) {
            if (logInfo) {
                console.log('Error verify access token');
            }
            if (tokens.refreshToken) {
                try {
                    const refreshResponse = await refresh(tokens.refreshToken);
                    if (refreshResponse.success && refreshResponse.result) {
                        await setAuthTokens(refreshResponse.result);
                        return true;
                    }
                } catch {
                    await removeAuthTokens();
                    setUser(null);
                }
            }
            return false;
        }
    };

    // Lấy thông tin user
    const fetchUserInfo = async () => {
        try {
            const hasValidToken = await checkAndRefreshToken();
            if (!hasValidToken) {
                setIsLoading(false);
                return;
            }

            const userResponse = await getUserInfo();
            if (userResponse.success && userResponse.result) {
                setUser(userResponse.result);
            } else {
                await removeAuthTokens();
                setUser(null);
            }
        } catch (error) {
            await removeAuthTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Đăng nhập
    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await login({ username, password });
            if (response.success && response.result) {
                await setAuthTokens(response.result);
                await fetchUserInfo();
                router.back(); // Chuyển về trang chủ sau khi đăng nhập
            } else {
                throw new Error(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Đăng xuất
    const handleLogout = async () => {
        await removeAuthTokens();
        setUser(null);
        router.push('/login');
    };

    // Refresh session
    const refreshSession = async () => {
        await fetchUserInfo();
    };

    // Kiểm tra auth state khi component mount
    useEffect(() => {
        fetchUserInfo();
    }, []);

    // Auto verify và refresh token mỗi 1 giờ
    useEffect(() => {
        const interval = setInterval(async () => {
            if (user) {
                await checkAndRefreshToken();
            }
        }, 1 * 60 * 60 * 1000); // 1 hour

        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login: handleLogin,
                logout: handleLogout,
                refreshSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook để sử dụng auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Avatar component tự động detect auth state
export function UserAvatar() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
    }

    if (!user) {
        return (
            <button
                onClick={() => router.push('/login')}
                className="text-sm font-medium"
            >
                Đăng nhập
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                className="flex items-center space-x-2"
                onClick={() => logout()}
            >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user.full_name?.[0] || user.username[0]}
                </div>
                <span className="text-sm font-medium">{user.full_name || user.username}</span>
            </button>
        </div>
    );
}
