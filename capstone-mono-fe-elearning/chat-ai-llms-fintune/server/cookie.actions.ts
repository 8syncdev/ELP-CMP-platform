'use server';

import { cookies } from 'next/headers';

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

// Set authentication token
export async function setCookieToken(token: string, options?: CookieOptions) {
    const defaultOptions: CookieOptions = {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        ...options
    };

    await setCookie('token', token, defaultOptions);
}

// Get authentication token
export async function getCookieToken() {
    const token = await getCookie('token');
    return token?.value;
}

// Remove authentication token
export async function removeToken() {
    await deleteCookie('token');
}

const SESSION_COOKIE = 'chat_session';
const SESSION_DURATION = 24 * 60 * 60; // 24 giờ

export async function getSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE);
    return sessionId?.value;
}

export async function createSession() {
    const cookieStore = await cookies();
    // Tạo session ID mới với timestamp
    const sessionId = `session_${Date.now()}`;

    cookieStore.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION,
        path: '/'
    });

    return sessionId;
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

// Kiểm tra và tạo session mới nếu cần
export async function ensureSession() {
    let sessionId = await getSession();

    // Luôn tạo session mới nếu không có hoặc đã hết hạn
    if (!sessionId) {
        sessionId = await createSession();
    }

    return sessionId;
}