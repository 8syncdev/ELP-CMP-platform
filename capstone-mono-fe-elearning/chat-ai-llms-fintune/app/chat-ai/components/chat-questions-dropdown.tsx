'use client';

import { useChat } from '../contexts/chat-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquareText, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export function ChatQuestionsDropdown() {
    const { conversations, activeConversationId } = useChat();
    const currentConversation = activeConversationId ? conversations[activeConversationId] : null;

    if (!currentConversation) return null;

    const userQuestions = currentConversation.messages
        .map((msg, globalIndex) => ({
            msg,
            globalIndex
        }))
        .filter(({ msg }) => msg.role === 'user')
        .map(({ msg, globalIndex }) => ({
            id: `msg-${globalIndex}`,
            content: msg.content
        }));

    if (userQuestions.length === 0) return null;

    const scrollToMessage = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                element.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 1000);
            }, 100);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 w-full md:w-auto"
                >
                    <MessageSquareText className="h-4 w-4" />
                    Câu hỏi đã hỏi
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
                <ScrollArea className="h-[300px]">
                    {userQuestions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <DropdownMenuItem asChild>
                                <a
                                    href={`#${question.id}`}
                                    className="flex items-start gap-2 p-2 cursor-pointer group"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToMessage(question.id);
                                    }}
                                >
                                    <span className="font-mono text-xs text-muted-foreground mt-1 shrink-0">
                                        #{index + 1}
                                    </span>
                                    <span className="flex-1 text-sm max-w-[200px] truncate group-hover:text-clip group-hover:whitespace-normal">
                                        {question.content}
                                    </span>
                                </a>
                            </DropdownMenuItem>
                        </motion.div>
                    ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 