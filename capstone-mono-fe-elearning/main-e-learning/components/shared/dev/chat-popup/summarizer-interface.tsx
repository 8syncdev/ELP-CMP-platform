'use client';

import React, { useState } from 'react';
import { FileText, Loader2, Copy, Check, Trash2, SparklesIcon, ServerIcon, PowerIcon, AlertCircle, Zap, ZapOff } from 'lucide-react';
import { summarizeText } from '@/lib/actions/cmp';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MarkdownRenderer from '@/components/shared/dev/mdx/mdx';
import { useCMP } from '@/providers/cmp-context';

const SummarizerInterface = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);

    const {
        currentSession,
        addMessage,
        createSession,
        isDeepMode,
        setIsDeepMode,
        serverStatus,
        startServerStatusCheck,
        stopServerStatusCheck
    } = useCMP();

    // Handle text change
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value.slice(0, 5000);
        setText(newText);
        setCharacterCount(newText.length);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim() || isLoading) return;

        setIsLoading(true);
        setSummary('');

        try {
            const response = await summarizeText(text);

            if (response.success && response.result) {
                setTimeout(() => {
                    setSummary(typeof response.result === 'string' ? response.result : '');
                    setIsLoading(false);
                }, 500); // Small delay for better UX
            } else {
                setSummary('Xin lỗi, tôi đã gặp lỗi khi tóm tắt văn bản của bạn.');
                setIsLoading(false);
            }
        } catch (error) {
            setSummary('Xin lỗi, tôi đã gặp lỗi khi tóm tắt văn bản của bạn.');
            setIsLoading(false);
        }
    };

    // Handle copy to clipboard
    const handleCopy = () => {
        if (!summary) return;

        navigator.clipboard.writeText(summary);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    // Clear summary
    const handleClearSummary = () => {
        setSummary('');
    };

    // Clear text
    const handleClearText = () => {
        setText('');
        setCharacterCount(0);
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Header with title and clear button */}
            <div className="border-b border-border/40 p-2 flex justify-between items-center bg-card/80 backdrop-blur-sm">
                <h3 className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Công cụ tóm tắt văn bản
                </h3>
                {summary && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSummary}
                        className="h-7 text-xs text-muted-foreground hover:text-destructive flex gap-1 items-center py-0 px-2"
                    >
                        <Trash2 className="h-3 w-3" />
                        Xóa kết quả
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <p className="text-xs text-muted-foreground animate-fade-in">
                    Dán văn bản dưới đây để tạo bản tóm tắt ngắn gọn
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col animate-slide-in-bottom [animation-fill-mode:backwards]"
                    style={{ animationDelay: '100ms' }}
                >
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-foreground mb-1">
                            Văn bản của bạn (tối đa 5000 ký tự)
                        </label>
                        <div className="relative">
                            <Textarea
                                value={text}
                                onChange={handleTextChange}
                                placeholder="Dán văn bản của bạn vào đây..."
                                disabled={isLoading}
                                className={cn(
                                    "w-full min-h-[140px] resize-none border-border/60 focus-visible:ring-primary pr-9 text-sm",
                                    isLoading && "bg-muted opacity-70"
                                )}
                            />
                            <div className="absolute top-1.5 right-1.5">
                                {text.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleClearText}
                                        className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                        disabled={isLoading}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={cn(
                                "text-[10px] mt-1",
                                characterCount > 4500 ? "text-amber-500" :
                                    characterCount > 4900 ? "text-red-500" :
                                        "text-muted-foreground"
                            )}>
                                {characterCount} / 5000 ký tự
                            </span>
                            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full w-28 mt-1">
                                <div
                                    className={cn(
                                        "h-1 rounded-full",
                                        characterCount > 4500 ? "bg-amber-500" :
                                            characterCount > 4900 ? "bg-red-500" :
                                                "bg-primary"
                                    )}
                                    style={{ width: `${Math.min(characterCount / 50, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!text.trim() || isLoading || text.length < 50}
                        className={cn(
                            "transition-all h-9 text-sm",
                            (!text.trim() || isLoading || text.length < 50) &&
                            "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Đang tóm tắt...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <SparklesIcon className="h-4 w-4 mr-2" />
                                Tóm tắt
                            </div>
                        )}
                    </Button>
                </form>

                {isLoading && (
                    <div className="mt-4 flex flex-col items-center justify-center animate-pulse-light">
                        <div className="relative w-10 h-10 mb-2">
                            <div className="absolute inset-0 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-2 border-l-2 border-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                            <div className="absolute inset-4 bg-primary rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Đang xử lý văn bản...</p>
                    </div>
                )}

                {summary && !isLoading && (
                    <Card className="mt-3 animate-scale-in-center border-primary/20 shadow-sm">
                        <CardHeader className="pb-2 pt-3 px-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm flex items-center">
                                    <SparklesIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                    Bản tóm tắt
                                </CardTitle>
                                <Button
                                    onClick={handleCopy}
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "h-7 w-7 transition-colors",
                                        isCopied && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    )}
                                    disabled={isCopied}
                                >
                                    {isCopied ? (
                                        <Check className="h-3.5 w-3.5" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="animate-fade-in px-3 py-2">
                            <MarkdownRenderer
                                content={summary}
                                className="px-0 py-0 border-0 shadow-none text-sm"
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="p-3 border-t bg-card">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                        <ServerIcon size={12} className={cn(
                            "transition-colors",
                            serverStatus.isChecking ? "text-amber-500 animate-pulse" :
                                serverStatus.isAvailable ? "text-green-500" : "text-rose-500 animate-pulse"
                        )} />
                        <h3 className="text-xs font-medium">Trạng thái máy chủ</h3>
                    </div>

                    <div
                        className="group relative flex items-center gap-1 text-xs text-muted-foreground transition-colors py-1 px-2 rounded-md"
                        title={serverStatus.isAvailable ? "Máy chủ AI sẵn sàng" : "Máy chủ AI đang khởi động"}
                    >
                        {serverStatus.isAvailable ?
                            <span className="text-green-500 flex items-center gap-1">
                                <Zap size={10} className="animate-pulse" />
                                Máy chủ AI sẵn sàng
                            </span> :
                            <span className="text-amber-500 flex items-center gap-1">
                                <Loader2 size={10} className="animate-spin" />
                                Đang khởi động máy chủ AI
                            </span>
                        }

                        <div className="absolute bottom-full mb-1 right-0 
                            hidden group-hover:block z-20 p-2 bg-popover/95 backdrop-blur-sm 
                            text-popover-foreground shadow-md rounded-lg border border-border/30
                            whitespace-nowrap text-xs w-max max-w-[200px]">
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
                                <p className="mt-1 text-[10px] text-muted-foreground border-t border-border/20 pt-1">
                                    {serverStatus.message}
                                </p>
                            )}
                            {serverStatus.lastChecked && (
                                <p className="mt-1 text-[9px] text-muted-foreground opacity-70">
                                    Kiểm tra gần nhất: {new Date(serverStatus.lastChecked).toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummarizerInterface; 