'use client';

import { useState } from 'react';
import { useChat } from '../contexts/chat-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { VoiceToText } from './voice-to-text';
import { continueConversation } from '@/server/chat-ai.actions';
import { readStreamableValue } from 'ai/rsc';
import { shouldCreateNewChat, isConversationLimitReached } from '../utils/chat';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CHAT_POLICIES } from '../constants/policies';
import { cn } from '@/lib/utils';

export function ChatInput() {
    const {
        conversations,
        activeConversationId,
        createNewConversation,
        addMessage,
        policy,
        updateLastMessage,
        expiresIn,
        apiKey
    } = useChat();
    const [input, setInput] = useState('');
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const currentConversation = activeConversationId ? conversations[activeConversationId] : null;
    const currentPolicy = CHAT_POLICIES[policy];
    const isLimitReached = currentConversation ?
        isConversationLimitReached(currentConversation, currentPolicy.maxMessages) :
        false;

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        try {
            // Đảm bảo luôn có conversation active
            let currentConversationId = activeConversationId;
            if (!currentConversationId || !conversations[currentConversationId] ||
                shouldCreateNewChat(conversations[currentConversationId])) {
                createNewConversation();
                // Lấy ID conversation mới từ context sau khi tạo
                currentConversationId = Object.keys(conversations)[Object.keys(conversations).length - 1];
            }

            // Tạo và thêm tin nhắn người dùng
            const userMessage = {
                role: 'user' as const,
                content: input.trim(),
                timestamp: new Date()
            };
            addMessage(userMessage);
            setInput('');

            // Tạo tin nhắn AI trống và thêm vào ngay
            const assistantMessage = {
                role: 'assistant' as const,
                content: '',
                timestamp: new Date()
            };
            addMessage(assistantMessage);

            // Gọi API và xử lý stream
            const { newMessage } = await continueConversation(
                [...(conversations[currentConversationId]?.messages || []), userMessage],
                policy,
                apiKey
            );

            // Cập nhật nội dung tin nhắn AI theo stream
            let streamContent = '';
            for await (const chunk of readStreamableValue(newMessage)) {
                streamContent += chunk;
                updateLastMessage({
                    ...assistantMessage,
                    content: streamContent
                });
            }

        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
            addMessage({
                role: 'assistant',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
                timestamp: new Date()
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {isLimitReached && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Đã đạt giới hạn tin nhắn. Vui lòng tạo cuộc trò chuyện mới.
                    </AlertDescription>
                </Alert>
            )}

            {isVoiceActive && (
                <VoiceToText
                    onTranscript={(text) => setInput(text)}
                    disabled={isLimitReached}
                />
            )}

            <div className="flex items-end gap-2">
                <div className="flex-1">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            isLoading ? "Đang xử lý..." :
                                isLimitReached ? "Đã đạt giới hạn tin nhắn" :
                                    "Nhập tin nhắn..."
                        }
                        className={cn(
                            "min-h-[5rem] resize-none",
                            isLoading && "opacity-70"
                        )}
                        disabled={isLoading || isLimitReached}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !isLimitReached) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <Button
                        size="icon"
                        onClick={() => setIsVoiceActive(!isVoiceActive)}
                        variant={isVoiceActive ? "secondary" : "ghost"}
                        disabled={isLoading || isLimitReached}
                        className={cn(
                            "transition-colors duration-200",
                            isLoading && "opacity-50"
                        )}
                    >
                        <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        onClick={handleSubmit}
                        disabled={isLoading || isLimitReached}
                        className={cn(
                            "bg-primary hover:bg-primary/90 transition-colors duration-200",
                            isLoading && "animate-pulse"
                        )}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Send className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
} 