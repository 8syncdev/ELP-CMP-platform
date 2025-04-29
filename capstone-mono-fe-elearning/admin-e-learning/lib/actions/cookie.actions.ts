'use server';

import { cookies } from 'next/headers';
import { TokenDto } from './auth/auth.type';

interface CookieOptions {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    priority?: 'low' | 'medium' | 'high';
    partitioned?: boolean;
}

// Get a single cookie by name
export async function getCookie(name: string) {
    const cookieStore = await cookies();
    return cookieStore.get(name);
}

// Get all cookies
export async function getAllCookies() {
    const cookieStore = await cookies();
    return cookieStore.getAll();
}

// Check if cookie exists
export async function hasCookie(name: string) {
    const cookieStore = await cookies();
    return cookieStore.has(name);
}

// Set a cookie with options
export async function setCookie(
    name: string,
    value: string,
    options?: CookieOptions
) {
    const cookieStore = await cookies();
    cookieStore.set(name, value, options);
}

// Delete a single cookie
export async function deleteCookie(name: string) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}

// Clear all cookies
export async function clearCookies() {
    const cookieStore = await cookies();
    const allCookies = await cookieStore.getAll();
    allCookies.forEach(cookie => {
        cookieStore.delete(cookie.name);
    });
}

// Set authentication tokens
export async function setAuthTokens(tokens: TokenDto, options?: CookieOptions) {
    const defaultOptions: CookieOptions = {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
    };

    await setCookie('access_token', tokens.accessToken, {
        ...defaultOptions,
        maxAge: 24 * 60 * 60 * 30 * Number(process.env.ACCESS_TOKEN_MAX_AGE), // 1 tháng
        ...options
    });

    await setCookie('refresh_token', tokens.refreshToken, {
        ...defaultOptions,
        maxAge: 24 * 60 * 60 * 30 * Number(process.env.REFRESH_TOKEN_MAX_AGE), // 3 tháng
        ...options
    });
}

// Get authentication tokens
export async function getAuthTokens() {
    const accessToken = await getCookie('access_token');
    const refreshToken = await getCookie('refresh_token');

    return {
        accessToken: accessToken?.value,
        refreshToken: refreshToken?.value
    };
}

// Remove authentication tokens
export async function removeAuthTokens() {
    await deleteCookie('access_token');
    await deleteCookie('refresh_token');
}

