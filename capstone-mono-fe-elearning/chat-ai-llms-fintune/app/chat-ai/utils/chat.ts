import { Conversation } from "../types";

export function shouldCreateNewChat(conversation?: Conversation): boolean {
    if (!conversation) return true;

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return false;

    const now = new Date();
    const lastMessageDate = new Date(lastMessage.timestamp);

    // Tạo trò chuyện mới nếu tin nhắn cuối cùng cách đây hơn 1 ngày
    return now.getTime() - lastMessageDate.getTime() > 24 * 60 * 60 * 1000;
}

export function isConversationLimitReached(conversation: Conversation, maxMessages: number): boolean {
    if (maxMessages === -1) return false; // VIP không giới hạn
    const userMessages = conversation.messages.filter(m => m.role === 'user').length;
    return userMessages >= maxMessages;
}

export function getConversationMessagesLeft(conversation: Conversation, maxMessages: number): number {
    if (maxMessages === -1) return -1; // VIP không giới hạn
    const userMessages = conversation.messages.filter(m => m.role === 'user').length;
    return Math.max(0, maxMessages - userMessages);
} 