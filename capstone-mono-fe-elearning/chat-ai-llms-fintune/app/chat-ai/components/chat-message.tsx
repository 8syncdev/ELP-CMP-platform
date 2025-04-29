'use client';

import { Message } from '@/server/chat-ai.actions';
import { format, isToday, isYesterday } from 'date-fns';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MarkdownRenderer } from '@/components/shared/mdx/mdx';
import { cn } from '@/lib/utils';
import { useChat } from '../contexts/chat-context';
import { CHAT_POLICIES } from '../constants/policies';
import { isConversationLimitReached } from '../utils/chat';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingIndicator } from './loading-indicator';

interface ChatMessageProps {
    message: Message & { timestamp?: Date };
    isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
    const { conversations, activeConversationId, policy } = useChat();
    const currentConversation = activeConversationId ? conversations[activeConversationId] : null;
    const currentPolicy = CHAT_POLICIES[policy];
    const isUser = message.role === 'user';

    const formatMessageTime = (date: Date) => {
        if (isToday(date)) {
            return `Hôm nay, ${format(date, 'HH:mm')}`;
        }
        if (isYesterday(date)) {
            return `Hôm qua, ${format(date, 'HH:mm')}`;
        }
        return format(date, 'dd/MM/yyyy, HH:mm');
    };

    const messageIndex = currentConversation?.messages.findIndex(
        m => m === message
    );
    const messageId = messageIndex !== undefined ? `msg-${messageIndex}` : undefined;

    return (
        <>
            <motion.div
                id={messageId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex mb-4 px-2 max-w-full",
                    isUser ? "justify-end" : "justify-start",
                    "transition-colors duration-300"
                )}
            >
                <div className={cn(
                    "flex flex-col",
                    "w-full sm:w-[85%] md:w-[75%] lg:w-[65%]"
                )}>
                    <div className="flex items-start gap-3">
                        {!isUser && (
                            <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                                <AvatarImage src="/bot-avatar.png" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                        )}

                        <div className={cn(
                            "flex-1 overflow-hidden rounded-lg p-4",
                            isUser ? "bg-primary" : "bg-muted",
                            isLoading && "min-h-[60px]"
                        )}>
                            {isLoading ? (
                                <LoadingIndicator />
                            ) : (
                                <>
                                    <MarkdownRenderer content={message.content} showCopyButton />
                                    {message.timestamp && (
                                        <motion.time
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={cn(
                                                "text-xs mt-2 block",
                                                isUser ? "text-primary-foreground/80" : "text-muted-foreground",
                                                "text-right"
                                            )}
                                        >
                                            {formatMessageTime(new Date(message.timestamp))}
                                        </motion.time>
                                    )}
                                </>
                            )}
                        </div>

                        {isUser && (
                            <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                                <AvatarImage src="/user-avatar.png" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </div>
            </motion.div>

            {currentConversation &&
                isConversationLimitReached(currentConversation, currentPolicy.maxMessages) &&
                message === currentConversation.messages[currentConversation.messages.length - 1] && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                    >
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Bạn đã đạt giới hạn {currentPolicy.maxMessages} tin nhắn cho cuộc trò chuyện này.
                                Vui lòng tạo cuộc trò chuyện mới để tiếp tục.
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}
        </>
    );
} 