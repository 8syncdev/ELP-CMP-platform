'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatSidebar } from './chat-sidebar';
import { ChatInterface } from './chat-interface';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function ChatLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-screen flex">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: isSidebarOpen ? 0 : -300 }}
                className="w-80 border-r bg-muted/30 relative z-20"
            >
                <ChatSidebar />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-[-1rem] z-30 bg-muted"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="flex-1 flex flex-col overflow-hidden"
                animate={{
                    marginLeft: isSidebarOpen ? '0' : '-300px'
                }}
            >
                <ChatInterface />
            </motion.div>
        </div>
    );
} 