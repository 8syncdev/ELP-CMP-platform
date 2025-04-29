'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/chat-context';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatWelcome } from './chat-welcome';
import { getSession } from '@/server/cookie.actions';
import { ChatQuestionsDropdown } from './chat-questions-dropdown';

export function ChatInterface() {
    const { conversations, activeConversationId } = useChat();
    const currentConversation = activeConversationId ? conversations[activeConversationId] : null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b shrink-0">
                <h2 className="text-lg font-semibold truncate max-w-[15rem] md:max-w-[20rem] lg:max-w-[30rem]">
                    {currentConversation?.title || 'Cuộc trò chuyện mới'}
                </h2>
                {currentConversation && currentConversation.messages.length > 0 && (
                    <ChatQuestionsDropdown />
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                <ScrollArea className="h-full p-4">
                    {(!currentConversation || currentConversation.messages.length === 0) ? (
                        <ChatWelcome />
                    ) : (
                        <div className="space-y-4">
                            {currentConversation.messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    message={message}
                                    isLoading={index === currentConversation.messages.length - 1 &&
                                        message.role === 'assistant' &&
                                        !message.content}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            <div className="p-4 border-t mt-auto shrink-0">
                <ChatInput />
            </div>
        </div>
    );
} 