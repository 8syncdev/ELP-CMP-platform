import { CHAT_POLICIES } from '../constants/policies';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export type PolicyType = keyof typeof CHAT_POLICIES;

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

export interface ChatHistory {
    conversations: Record<string, Conversation>;
    activeConversationId: string | null;
    policy: PolicyType;
} 