'use client';

import { CHAT_POLICIES } from '../constants/policies';
import { ChatProvider } from '../contexts/chat-context';
import { ChatLayout } from './chat-layout';

interface ChatAIClientProps {
    showPolicySelector?: boolean;
    initialPolicy?: keyof typeof CHAT_POLICIES;
    expiresIn?: string;
    apiKey?: string;
}

export function ChatAIClient({ showPolicySelector = false, initialPolicy = 'normal', expiresIn = '2025-02-07T14:30:00.000Z', apiKey = 'apiKey' }: ChatAIClientProps) {
    return (
        <ChatProvider
            initialPolicy={initialPolicy}
            expiresIn={expiresIn}
            showPolicySelector={showPolicySelector}
            apiKey={apiKey}
        >
            <ChatLayout />
        </ChatProvider>
    );
} 