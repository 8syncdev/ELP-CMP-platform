'use client';

import { useChat } from '../contexts/chat-context';
import { CHAT_POLICIES } from '../constants/policies';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Info, MessageSquare } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDaysRemaining } from '../utils/date';

export function ChatUsageInfo() {
    const { policy, conversations, activeConversationId, expiresIn } = useChat();
    const currentPolicy = CHAT_POLICIES[policy];
    const currentConversation = activeConversationId ? conversations[activeConversationId] : null;

    // Chỉ tính số tin nhắn của conversation hiện tại
    const totalUserMessages = currentConversation
        ? currentConversation.messages.filter(m => m.role === 'user').length
        : 0;

    // Tính số tin nhắn còn lại cho conversation hiện tại
    const messagesLeft = currentPolicy.maxMessages === -1
        ? '∞'
        : Math.max(0, currentPolicy.maxMessages - totalUserMessages);

    // Tính phần trăm đã sử dụng cho conversation hiện tại
    const percentUsed = currentPolicy.maxMessages === -1
        ? 0
        : Math.min(100, (totalUserMessages / currentPolicy.maxMessages) * 100);

    return (
        <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant={policy === 'vip' ? 'default' : 'secondary'}>
                        {currentPolicy.name}
                    </Badge>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="space-y-2 p-1">
                                    <p>Thông tin gói {currentPolicy.name}:</p>
                                    <ul className="text-sm list-disc list-inside">
                                        <li>Số tin nhắn tối đa mỗi lần chat: {currentPolicy.maxMessages === -1 ? 'Không giới hạn' : currentPolicy.maxMessages}</li>
                                        <li>Token tối đa: {currentPolicy.maxTokens}</li>
                                        <li>Lưu trữ: {currentPolicy.historyDays} ngày</li>
                                        <li>Tính năng voice: {currentPolicy.voiceEnabled ? 'Có' : 'Không'}</li>
                                    </ul>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className="text-sm space-y-2">
                <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                    </span>
                    {currentConversation
                        ? `Số tin nhắn còn lại cho cuộc trò chuyện này: ${messagesLeft}`
                        : 'Chưa có cuộc trò chuyện nào'}
                    . Độ dài tối đa mỗi phản hồi là: {currentPolicy.maxTokens} kí tự. Chính sách này có thể được nâng cấp nếu cần thiết.
                </p>
                <div className="flex justify-between items-center text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Đã sử dụng:
                    </span>
                    <span>{totalUserMessages} tin nhắn</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Còn lại:
                    </span>
                    <span>{messagesLeft} tin nhắn</span>
                </div>
            </div>

            {currentPolicy.maxMessages !== -1 && (
                <div className="space-y-1">
                    <Progress value={percentUsed} className="h-2" />
                    <div className="text-xs text-right text-muted-foreground">
                        {percentUsed.toFixed(1)}%
                    </div>
                </div>
            )}

            <div className="text-xs text-muted-foreground mt-2">
                Hết hạn sau: {getDaysRemaining(new Date(expiresIn).getTime())} ngày
            </div>
        </div>
    );
} 