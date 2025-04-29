import { createContext, useContext, useEffect, useState } from 'react';
import { Message, Conversation } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { CHAT_POLICIES } from '../constants/policies';

interface UsageInfo {
    expiresIn: number;
    startDate: Date;
}


interface ChatContextType {
    messages: Message[];
    policy: keyof typeof CHAT_POLICIES;
    usageInfo: UsageInfo;
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    setPolicy: (policy: keyof typeof CHAT_POLICIES) => void;
    setUsageInfo: (info: UsageInfo) => void;
    clearHistory: () => void;
    conversations: Record<string, Conversation>;
    activeConversationId: string | null;
    createNewConversation: () => void;
    setActiveConversation: (id: string) => void;
    deleteConversation: (id: string) => void;
    deleteAllConversations: () => void;
    updateLastMessage: (message: Message) => void;
    showPolicySelector: boolean;
    expiresIn: string;
    apiKey: string;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({
    children,
    initialPolicy = 'normal',
    expiresIn = '2025-02-07T14:30:00.000Z',
    showPolicySelector = true,
    apiKey = 'apiKey'
}: {
    children: React.ReactNode;
    initialPolicy?: keyof typeof CHAT_POLICIES;
    expiresIn?: string;
    showPolicySelector?: boolean;
    apiKey?: string;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Record<string, Conversation>>({});
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [policy, setPolicy] = useState<keyof typeof CHAT_POLICIES>(initialPolicy);
    const [usageInfo, setUsageInfo] = useState<UsageInfo>({
        expiresIn: new Date(expiresIn).getTime(),
        startDate: new Date()
    });

    // Khôi phục dữ liệu khi mount
    useEffect(() => {
        const saved = loadFromStorage();
        if (saved) {
            setConversations(saved.conversations);

            // Khôi phục conversation active
            if (saved.activeConversationId && saved.conversations[saved.activeConversationId]) {
                setActiveConversationId(saved.activeConversationId);
            } else {
                const lastConversation = Object.values(saved.conversations)
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
                if (lastConversation) {
                    setActiveConversationId(lastConversation.id);
                }
            }

            // Luôn ưu tiên sử dụng initialPolicy nếu không có policy được lưu
            setPolicy(saved.policy || initialPolicy);

            // Khôi phục usage info
            const savedUsageInfo = localStorage.getItem('chat_usage_info');
            if (savedUsageInfo) {
                setUsageInfo(JSON.parse(savedUsageInfo));
            }
        } else {
            // Nếu không có dữ liệu được lưu, sử dụng initialPolicy
            setPolicy(initialPolicy);
        }
    }, [initialPolicy]);

    // Lưu usage info khi có thay đổi
    useEffect(() => {
        localStorage.setItem('chat_usage_info', JSON.stringify(usageInfo));
    }, [usageInfo]);

    // Tự động tạo conversation mới nếu không có
    useEffect(() => {
        if (Object.keys(conversations).length === 0) {
            createNewConversation();
        }
    }, [conversations]);

    // Lưu state vào storage khi có thay đổi
    useEffect(() => {
        saveToStorage({
            conversations,
            activeConversationId,
            policy
        });
    }, [conversations, activeConversationId, policy]);

    const addMessage = (message: Message) => {
        if (!activeConversationId) return;

        setConversations(prev => {
            const conversation = prev[activeConversationId];
            if (!conversation) return prev;

            const oldestAllowed = new Date();
            oldestAllowed.setDate(oldestAllowed.getDate() - CHAT_POLICIES[policy].historyDays);

            const validMessages = conversation.messages.filter(m =>
                new Date(m.timestamp) > oldestAllowed
            );

            const updatedConversation: Conversation = {
                ...conversation,
                messages: [...validMessages, message],
                updatedAt: new Date().toISOString(),
                title: message.role === 'user' ? message.content.slice(0, 30) : conversation.title
            };

            const newState = {
                ...prev,
                [activeConversationId]: updatedConversation
            };

            queueMicrotask(() => {
                saveToStorage({
                    conversations: newState,
                    activeConversationId,
                    policy
                });
            });

            return newState;
        });
    };

    const clearHistory = () => {
        setMessages([]);
        saveToStorage({
            conversations: {},
            activeConversationId: null,
            policy
        });
    };

    const createNewConversation = () => {
        const id = Date.now().toString();
        const newConversation: Conversation = {
            id,
            title: `Cuộc trò chuyện ${Object.keys(conversations).length + 1}`,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setConversations(prev => ({
            ...prev,
            [id]: newConversation
        }));
        setActiveConversationId(id);
    };

    const deleteConversation = (id: string) => {
        setConversations(prev => {
            const next = { ...prev };
            delete next[id];

            // Nếu xóa conversation hiện tại
            if (activeConversationId === id) {
                const remainingIds = Object.keys(next);
                // Nếu còn conversation khác thì chuyển sang conversation đầu tiên
                if (remainingIds.length > 0) {
                    setActiveConversationId(remainingIds[0]);
                } else {
                    // Nếu không còn conversation nào thì tạo mới
                    createNewConversation();
                }
            }
            return next;
        });
    };

    const setActiveConversation = (id: string) => {
        if (conversations[id]) {
            setActiveConversationId(id);
        }
    };

    const deleteAllConversations = () => {
        setConversations({});
        createNewConversation();
    };

    const updateLastMessage = (message: Message) => {
        if (!activeConversationId) return;

        setConversations(prev => {
            const conversation = prev[activeConversationId];
            if (!conversation) return prev;

            const messages = [...conversation.messages];
            messages[messages.length - 1] = message;

            return {
                ...prev,
                [activeConversationId]: {
                    ...conversation,
                    messages,
                    updatedAt: new Date().toISOString()
                }
            };
        });
    };

    const setUsageInfoWithStorage = (info: UsageInfo) => {
        setUsageInfo(info);
        localStorage.setItem('chat_usage_info', JSON.stringify(info));
    };

    return (
        <ChatContext.Provider value={{
            messages,
            policy,
            usageInfo,
            addMessage,
            setMessages,
            setPolicy,
            setUsageInfo: setUsageInfoWithStorage,
            clearHistory,
            conversations,
            activeConversationId,
            createNewConversation,
            setActiveConversation,
            deleteConversation,
            deleteAllConversations,
            updateLastMessage,
            showPolicySelector,
            expiresIn,
            apiKey
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat phải được sử dụng trong ChatProvider');
    }
    return context;
} 