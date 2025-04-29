import { ChatHistory } from '../types';

const STORAGE_KEY = 'chat_history';

export function saveToStorage(data: ChatHistory): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Lỗi khi lưu vào localStorage:', error);
    }
}

export function loadFromStorage(): ChatHistory | null {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Lỗi khi đọc từ localStorage:', error);
        return null;
    }
} 