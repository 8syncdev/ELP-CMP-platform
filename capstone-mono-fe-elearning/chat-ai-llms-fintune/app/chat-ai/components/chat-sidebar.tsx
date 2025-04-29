'use client';

import { useChat } from '../contexts/chat-context';
import { ChatPolicySelector } from './chat-policy-selector';
import { ChatUsageInfo } from './chat-usage-info';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Trash2, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, startOfWeek, isWithinInterval, subWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChatExpire } from './chat-expire';
import { UpgradeBanner } from './upgrade-banner';
import { getConversationMessagesLeft } from '../utils/chat';
import { CHAT_POLICIES } from '../constants/policies';
import { MY_INFO } from '@/constants/my-info';

export function ChatSidebar() {
    const {
        conversations,
        activeConversationId,
        createNewConversation,
        setActiveConversation,
        deleteConversation,
        deleteAllConversations,
        showPolicySelector,
        expiresIn,
        policy
    } = useChat();

    const groupConversationsByWeek = () => {
        const sortedConversations = Object.values(conversations)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        const groups: Record<string, typeof sortedConversations> = {};

        sortedConversations.forEach(conversation => {
            const date = new Date(conversation.updatedAt);
            const weekStart = startOfWeek(date, { locale: vi });
            const weekKey = format(weekStart, 'yyyy-MM-dd');

            if (!groups[weekKey]) {
                groups[weekKey] = [];
            }
            groups[weekKey].push(conversation);
        });

        return groups;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold mb-4">{MY_INFO.company}</h1>
                <Button
                    variant="default"
                    className="w-full justify-start gap-2"
                    onClick={createNewConversation}
                >
                    <Plus className="h-4 w-4" />
                    Cuộc trò chuyện mới
                </Button>
                <div className="mt-4">
                    {showPolicySelector && <ChatPolicySelector />}
                    <ChatUsageInfo />
                    <div className="mt-4">
                        <ChatExpire expireDate={expiresIn} />
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-2 min-h-[200px]">
                <div className="space-y-6 py-4">
                    {Object.entries(groupConversationsByWeek()).map(([weekKey, conversations]) => {
                        const weekStart = new Date(weekKey);
                        const isCurrentWeek = isWithinInterval(new Date(), {
                            start: weekStart,
                            end: new Date()
                        });

                        return (
                            <div key={weekKey} className="space-y-2">
                                <h3 className="px-2 text-xs font-medium text-muted-foreground">
                                    {isCurrentWeek
                                        ? 'Tuần này'
                                        : format(weekStart, "'Tuần' w, MMMM yyyy", { locale: vi })}
                                </h3>

                                {conversations.map((conversation) => (
                                    <motion.div
                                        key={conversation.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="relative group"
                                    >
                                        <Button
                                            variant={activeConversationId === conversation.id ? "secondary" : "ghost"}
                                            className="w-full justify-start gap-2 pr-16 h-auto py-2"
                                            onClick={() => setActiveConversation(conversation.id)}
                                        >
                                            <MessageSquare className="h-4 w-4 shrink-0" />
                                            <div className="flex flex-col items-start gap-1 overflow-hidden">
                                                <span className="truncate max-w-[150px] font-medium">
                                                    {conversation.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(conversation.updatedAt), 'HH:mm')}
                                                    {policy && CHAT_POLICIES[policy as keyof typeof CHAT_POLICIES].maxMessages !== -1 && (
                                                        <span className="ml-2">
                                                            ({getConversationMessagesLeft(conversation, CHAT_POLICIES[policy as keyof typeof CHAT_POLICIES].maxMessages)} tin nhắn còn lại)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => deleteConversation(conversation.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <ScrollArea className="max-h-[200px]">
                <div className="p-4 border-t space-y-4">
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        onClick={deleteAllConversations}
                    >
                        <Trash2 className="h-4 w-4" />
                        Xóa tất cả cuộc trò chuyện
                    </Button>

                    <UpgradeBanner />
                </div>
            </ScrollArea>
        </div>
    );
} 