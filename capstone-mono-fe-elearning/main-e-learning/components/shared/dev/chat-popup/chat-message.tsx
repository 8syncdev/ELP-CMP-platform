import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MarkdownRenderer from '@/components/shared/dev/mdx/mdx';
import { Bot, User, Loader2 } from 'lucide-react';

interface ChatMessageProps {
    message: string;
    isIncoming?: boolean;
    avatarUrl?: string;
    avatarFallback?: string;
    className?: string;
    showAvatar?: boolean;
    isProcessing?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    isIncoming = false,
    avatarUrl,
    avatarFallback = 'AI',
    className,
    showAvatar = true,
    isProcessing = false
}) => {
    const [showProcessing, setShowProcessing] = useState(false);

    // Handle processing indicator with delay to prevent flashing
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isProcessing) {
            timeout = setTimeout(() => setShowProcessing(true), 300);
        } else {
            setShowProcessing(false);
        }
        return () => clearTimeout(timeout);
    }, [isProcessing]);

    return (
        <div className={cn(
            'flex items-start gap-2',
            isIncoming ? 'flex-row' : 'flex-row-reverse',
            className
        )}>
            {showAvatar && (
                <Avatar className="w-8 h-8 mt-0.5 border-2 shadow-sm"
                    style={{
                        borderColor: isIncoming ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'
                    }}
                >
                    <AvatarImage src={avatarUrl} alt="Avatar" />
                    <AvatarFallback className={cn(
                        "flex items-center justify-center text-xs",
                        isIncoming ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}>
                        {avatarFallback ? avatarFallback : (isIncoming ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />)}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                'relative rounded-lg max-w-[85%] shadow-sm transition-all duration-300 p-2.5',
                isIncoming ? 'bg-secondary/80 text-secondary-foreground' : 'bg-primary/80 text-primary-foreground',
                isProcessing && "animate-pulse"
            )}>
                {/* Message Pointer */}
                <div className={cn(
                    "absolute top-3 w-2 h-2 rotate-45",
                    isIncoming ? "-left-1 bg-secondary/80" : "-right-1 bg-primary/80"
                )}></div>

                {/* Use MarkdownRenderer for messages */}
                <MarkdownRenderer
                    content={message}
                    className="px-0 py-0 text-sm border-0 shadow-none"
                />

                {/* Show processing indicator */}
                {showProcessing && (
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                        Đang xử lý...
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage; 