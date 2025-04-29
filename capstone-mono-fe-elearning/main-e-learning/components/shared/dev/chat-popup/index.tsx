'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    X,
    Minimize2,
    Maximize2,
    Maximize,
    Minimize,
    PanelLeft,
    FileText,
    RefreshCw,
    MessageSquare,
    BookOpenIcon,
    BrainIcon,
    ServerIcon,
    PowerIcon,
    AlertCircle,
    Loader2,
    Zap,
    ZapOff
} from 'lucide-react';
import { useCMP } from '@/providers/cmp-context';
import ChatInterface from './chat-interface';
import SummarizerInterface from './summarizer-interface';
import AutoDiscussInterface from './auto-discuss-interface';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const ChatPopup = () => {
    const {
        isChatOpen,
        setIsChatOpen,
        activeFeature,
        setActiveFeature,
        serverStatus,
        checkServerStatus,
        startServerStatusCheck,
        stopServerStatusCheck
    } = useCMP();

    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tabIndicatorStyle, setTabIndicatorStyle] = useState({ left: '0%', width: '33.333%' });

    // Handle toggle chat open/close
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        if (isMinimized && !isChatOpen) {
            setIsMinimized(false);
        }
    };

    // Handle minimize/maximize
    const toggleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMinimized(!isMinimized);
    };

    // Handle fullscreen toggle
    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullscreen(!isFullscreen);
    };

    // Render different interfaces based on active feature
    const renderInterface = () => {
        if (isMinimized) return null;

        switch (activeFeature) {
            case 'summarize':
                return <SummarizerInterface />;
            case 'autoDiscuss':
                return <AutoDiscussInterface />;
            case 'chat':
            default:
                return <ChatInterface />;
        }
    };

    // Function to handle feature switch with animation
    const handleFeatureChange = (feature: typeof activeFeature, index: number) => {
        setActiveFeature(feature);
        setTabIndicatorStyle({
            left: `${index * 33.333}%`,
            width: '33.333%'
        });
    };

    // Get dimensions and positions
    const getDimensions = () => {
        if (isMinimized) return { width: 'w-[300px]', height: 'h-[50px]' };

        if (isFullscreen) {
            return { width: 'w-screen', height: 'h-screen' };
        }

        // Normal size (taller by default)
        return { width: 'w-[550px]', height: 'h-[85vh] max-h-[900px]' };
    };

    const getPositions = () => {
        if (isFullscreen) {
            return 'fixed inset-0';
        }
        return 'fixed bottom-4 right-4';
    };

    const { width, height } = getDimensions();
    const positions = getPositions();

    return (
        <>
            {/* Chat Button (when chat is closed) */}
            {!isChatOpen && (
                <Button
                    className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-primary/90 to-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl z-50 transition-all duration-300 hover:scale-105 hover:shadow-primary/30 animate-fade-in group overflow-hidden"
                    onClick={toggleChat}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center">
                        <MessageCircle size={22} className="animate-pulse" />
                        <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></span>
                    </div>
                </Button>
            )}

            {/* Chat Window */}
            {isChatOpen && (
                <div
                    className={`${positions} ${width} ${height} rounded-xl bg-card/95 shadow-2xl overflow-hidden z-50 border border-border/60 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-md animate-slide-up`}
                >
                    {/* Header */}
                    <div className="p-3 bg-gradient-to-r from-primary/90 to-primary/80 text-primary-foreground flex items-center justify-between cursor-pointer backdrop-blur-md border-b border-white/10"
                        onClick={isMinimized ? toggleChat : undefined}>
                        <div className="flex items-center">
                            <MessageCircle size={18} className="mr-2 animate-bounce" />
                            <h3 className="font-semibold text-primary-foreground text-sm">Trợ lý AI</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleFullscreen}
                                            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20 p-1 rounded-full transition-transform duration-200 hover:scale-110"
                                        >
                                            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="end" className="text-xs py-1 px-2">
                                        <p>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleMinimize}
                                            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20 p-1 rounded-full transition-transform duration-200 hover:scale-110"
                                        >
                                            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="end" className="text-xs py-1 px-2">
                                        <p>{isMinimized ? 'Mở rộng' : 'Thu gọn'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleChat}
                                            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20 p-1 rounded-full transition-transform duration-200 hover:scale-110"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="end" className="text-xs py-1 px-2">
                                        <p>Đóng</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Feature Tabs */}
                    {!isMinimized && (
                        <div className="flex border-b border-border/40 bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 py-1.5">
                            {/* Animated Tab Indicator */}
                            <div
                                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-primary/90 to-primary/70 transition-all duration-500 ease-in-out"
                                style={{
                                    left: tabIndicatorStyle.left,
                                    width: tabIndicatorStyle.width
                                }}
                            />

                            <Button
                                variant="ghost"
                                className={`flex-1 py-1.5 text-xs font-medium rounded-none transition-all duration-300 ${activeFeature === 'chat'
                                    ? 'text-primary bg-accent/30'
                                    : 'text-foreground/90 hover:text-primary hover:bg-accent/20'
                                    }`}
                                onClick={() => handleFeatureChange('chat', 0)}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <MessageCircle className={`h-3.5 w-3.5 ${activeFeature === 'chat' ? 'text-primary animate-bounce' : ''}`} />
                                    <span>Trò chuyện</span>
                                </div>
                            </Button>
                            <Button
                                variant="ghost"
                                className={`flex-1 py-1.5 text-xs font-medium rounded-none transition-all duration-300 ${activeFeature === 'summarize'
                                    ? 'text-primary bg-accent/30'
                                    : 'text-foreground/90 hover:text-primary hover:bg-accent/20'
                                    }`}
                                onClick={() => handleFeatureChange('summarize', 1)}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <FileText className={`h-3.5 w-3.5 ${activeFeature === 'summarize' ? 'text-primary animate-pulse' : ''}`} />
                                    <span>Tóm tắt</span>
                                </div>
                            </Button>
                            <Button
                                variant="ghost"
                                className={`flex-1 py-1.5 text-xs font-medium rounded-none transition-all duration-300 ${activeFeature === 'autoDiscuss'
                                    ? 'text-primary bg-accent/30'
                                    : 'text-foreground/90 hover:text-primary hover:bg-accent/20'
                                    }`}
                                onClick={() => handleFeatureChange('autoDiscuss', 2)}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <RefreshCw className={`h-3.5 w-3.5 ${activeFeature === 'autoDiscuss' ? 'text-primary animate-spin' : ''}`} />
                                    <span>Thảo luận tự động</span>
                                </div>
                            </Button>
                        </div>
                    )}

                    {/* Content */}
                    <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out bg-card/60 backdrop-blur-sm ${!isMinimized ? 'animate-fade-in' : ''}`}>
                        {!isMinimized && (
                            <div className="h-full relative">
                                {renderInterface()}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Welcome Tooltip */}
            {!isChatOpen && (
                <div className="fixed bottom-20 right-4 max-w-[220px] bg-card/95 text-card-foreground p-3 rounded-lg shadow-lg border border-primary/20 animate-scale-in-center z-50 animate-pulse-light backdrop-blur-sm">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                                <MessageCircle size={14} className="text-primary" />
                            </div>
                            <p className="text-xs font-medium">Trợ lý AI</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Chào bạn! Bạn cần giúp đỡ gì hôm nay? Nhấn vào nút để bắt đầu trò chuyện.</p>
                    </div>
                    <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-card/95 border-r border-b border-primary/20 transform rotate-45 backdrop-blur-sm"></div>
                </div>
            )}

            {/* Server Status Indicator */}
            <div className="flex items-center gap-2 p-3 border-t border-border/60">
                <div className="ml-2 flex items-center">
                    <div className="relative">
                        <div
                            className="group relative p-1.5 rounded-full transition-colors"
                            title={serverStatus.isAvailable ? "AI Server Online" : "AI Server Starting"}
                        >
                            <ServerIcon
                                size={14}
                                className={cn(
                                    "transition-colors",
                                    serverStatus.isChecking ? "text-amber-500 animate-pulse" :
                                        serverStatus.isAvailable ? "text-green-500" : "text-muted-foreground"
                                )}
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background z-10
                                group-hover:scale-110 transition-transform
                                animate-in zoom-in-50 duration-300"
                                style={{
                                    backgroundColor: serverStatus.isChecking
                                        ? '#f59e0b' // amber
                                        : serverStatus.isAvailable
                                            ? '#10b981' // green
                                            : '#f43f5e' // rose/red
                                }}
                            ></span>

                            {/* Show status tooltip on hover */}
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                hidden group-hover:block z-20 p-2 bg-popover/95 backdrop-blur-sm 
                                text-popover-foreground shadow-md rounded-lg border border-border/30
                                whitespace-nowrap text-xs w-max min-w-[150px]">
                                <div className="flex items-center gap-1.5">
                                    {serverStatus.isChecking ? (
                                        <Loader2 size={12} className="animate-spin text-amber-500" />
                                    ) : serverStatus.isAvailable ? (
                                        <Zap size={12} className="text-green-500" />
                                    ) : (
                                        <ZapOff size={12} className="text-rose-500" />
                                    )}
                                    <span>
                                        {serverStatus.isChecking ? 'Đang kiểm tra máy chủ...' :
                                            serverStatus.isAvailable ? 'Máy chủ đã khởi động' : 'Máy chủ đang khởi động'}
                                    </span>
                                </div>
                                {serverStatus.message && (
                                    <p className="mt-1 text-xs text-muted-foreground border-t border-border/20 pt-1">
                                        {serverStatus.message}
                                    </p>
                                )}
                                {serverStatus.lastChecked && (
                                    <p className="mt-1 text-[10px] text-muted-foreground opacity-70">
                                        Kiểm tra gần nhất: {new Date(serverStatus.lastChecked).toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <span className="ml-2 text-xs">
                        {serverStatus.isAvailable ?
                            <span className="text-green-500 flex items-center gap-1">
                                <Zap size={10} className="animate-pulse" />
                                Máy chủ AI đã sẵn sàng
                            </span> :
                            <span className="text-amber-500 flex items-center gap-1">
                                <Loader2 size={10} className="animate-spin" />
                                Đang khởi động máy chủ AI
                            </span>
                        }
                    </span>
                </div>
            </div>
        </>
    );
};

export default ChatPopup; 