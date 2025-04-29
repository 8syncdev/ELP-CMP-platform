'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Message } from '@/server/chat-ai.actions';

interface ChatContextType {
    messages: Message[];
    addMessage: (message: Message) => void;
    clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Load messages from localStorage on mount
        const saved = localStorage.getItem('chat-history');
        if (saved) {
            setMessages(JSON.parse(saved));
        }
    }, []);

    const addMessage = (message: Message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
        localStorage.setItem('chat-history', JSON.stringify(newMessages));
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem('chat-history');
    };

    return (
        <ChatContext.Provider value={{ messages, addMessage, clearHistory }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
}; 