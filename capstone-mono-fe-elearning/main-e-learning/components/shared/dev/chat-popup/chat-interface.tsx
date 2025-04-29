'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Send, Loader2, Trash2, SearchIcon, FileTextIcon, LinkIcon, SparklesIcon,
    BookOpenIcon, GraduationCapIcon, BrainIcon, HelpCircleIcon, CheckCircle2,
    InfoIcon, X, MessageCircle, ServerIcon, PowerIcon, AlertCircle, RefreshCw,
    Zap, ZapOff
} from 'lucide-react';
import { useCMP } from '@/providers/cmp-context';
import {
    searchGoogle,
    getContentFromUrl,
    summarizeText,
    askTeacher,
    meetingWithTeacher,
    studentAskTeacher,
    searchGoogleWithRetry,
    getContentFromUrlWithRetry,
    summarizeTextWithRetry,
    askTeacherWithRetry
} from '@/lib/actions/cmp'; // searchGoogle -> getContentFromUrl -> summarizeText -> askTeacher
import { ChatMessage as ChatMessageType } from '@/lib/actions/cmp/cmp.types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ChatMessage } from './chat-message';
import MarkdownRenderer from '@/components/shared/dev/mdx/mdx';
import { Progress, RetryingProgress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface SearchResult {
    link?: string;
    title?: string;
    snippet?: string;
    [key: string]: any;
}

type WorkflowStep = {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    status: 'idle' | 'loading' | 'retrying' | 'complete' | 'error';
    retryCount?: number;
    result?: any;
    error?: string;
};

const DeepModeExplainer = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-card/95 rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto border border-border/40">
                <div className="p-3 border-b border-border/40 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-foreground flex items-center">
                        <SparklesIcon className="h-4 w-4 mr-1.5 text-primary" />
                        Chế độ Deep là gì?
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-3 space-y-3">
                    <p className="text-xs text-foreground">
                        Chế độ <strong>Deep</strong> cho phép trợ lý AI tìm kiếm và phân tích thông tin từ Internet để trả lời câu hỏi của bạn chính xác hơn.
                    </p>

                    <div className="bg-muted/60 p-2.5 rounded-md">
                        <h4 className="text-xs font-medium mb-1.5">Quy trình làm việc:</h4>
                        <ol className="text-xs space-y-1.5">
                            <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full h-4 w-4 flex items-center justify-center mr-1.5 shrink-0 text-[10px]">1</span>
                                <span>Tìm kiếm thông tin liên quan trên Google</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full h-4 w-4 flex items-center justify-center mr-1.5 shrink-0 text-[10px]">2</span>
                                <span>Trích xuất nội dung từ các trang web</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full h-4 w-4 flex items-center justify-center mr-1.5 shrink-0 text-[10px]">3</span>
                                <span>Tóm tắt thông tin thu thập được</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full h-4 w-4 flex items-center justify-center mr-1.5 shrink-0 text-[10px]">4</span>
                                <span>Phân tích và trả lời dựa trên thông tin đã tổng hợp</span>
                            </li>
                        </ol>
                    </div>

                    <div className="bg-yellow-100/60 dark:bg-yellow-900/30 p-2.5 rounded-md text-xs">
                        <div className="flex items-center text-yellow-800 dark:text-yellow-200 mb-1 font-medium">
                            <InfoIcon className="h-3.5 w-3.5 mr-1" />
                            Lưu ý
                        </div>
                        <p className="text-yellow-700 dark:text-yellow-300">
                            Chế độ này có thể mất nhiều thời gian hơn để trả lời, nhưng sẽ cung cấp thông tin cập nhật và chính xác hơn.
                        </p>
                    </div>
                </div>
                <div className="p-3 border-t border-border/40 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium"
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatInterface = () => {
    const {
        currentSession,
        addMessage,
        createSession,
        clearMessages,
        isDeepMode,
        setIsDeepMode,
        serverStatus,
        startServerStatusCheck,
        stopServerStatusCheck
    } = useCMP();

    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState<string>('');
    const [iterationCount, setIterationCount] = useState(0);
    const [currentIteration, setCurrentIteration] = useState(0);
    const [showModeInfo, setShowModeInfo] = useState(false);
    const [showDeepModeExplainer, setShowDeepModeExplainer] = useState(false);

    // Check if user has seen explainer
    useEffect(() => {
        const hasSeenExplainer = localStorage.getItem('cmp-seen-deep-explainer');
        if (!hasSeenExplainer && isDeepMode) {
            setShowDeepModeExplainer(true);
        }
    }, [isDeepMode]);

    // Toggle deep mode and show explainer if first time
    const toggleDeepMode = (value: boolean) => {
        setIsDeepMode(value);

        if (value && localStorage.getItem('cmp-seen-deep-explainer') !== 'true') {
            setShowDeepModeExplainer(true);
        }
    };

    // Mark explainer as seen
    const closeDeepModeExplainer = () => {
        setShowDeepModeExplainer(false);
        localStorage.setItem('cmp-seen-deep-explainer', 'true');
    };

    // Workflow steps
    const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
        {
            id: 'search',
            name: 'Tìm kiếm thông tin',
            description: 'Đang tìm kiếm thông tin trên Google...',
            icon: <SearchIcon className="h-4 w-4" />,
            status: 'idle'
        },
        {
            id: 'content',
            name: 'Trích xuất nội dung',
            description: 'Đang lấy nội dung từ các liên kết...',
            icon: <FileTextIcon className="h-4 w-4" />,
            status: 'idle'
        },
        {
            id: 'summary',
            name: 'Tóm tắt nội dung',
            description: 'Đang tóm tắt thông tin...',
            icon: <BookOpenIcon className="h-4 w-4" />,
            status: 'idle'
        },
        {
            id: 'teacher',
            name: 'Phản hồi của giáo viên',
            description: 'Giáo viên đang soạn câu trả lời...',
            icon: <GraduationCapIcon className="h-4 w-4" />,
            status: 'idle'
        },
        {
            id: 'student',
            name: 'Câu hỏi tiếp theo',
            description: 'Sinh viên đang nghĩ câu hỏi tiếp theo...',
            icon: <HelpCircleIcon className="h-4 w-4" />,
            status: 'idle'
        }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Calculate workflow progress percentage
    const calculateProgress = () => {
        if (!isProcessing) return 0;
        const totalSteps = workflowSteps.length;
        const completedSteps = workflowSteps.filter(step => step.status === 'complete').length;

        // Count retrying or loading steps as partial progress
        const inProgressSteps = workflowSteps.filter(step =>
            step.status === 'loading' || step.status === 'retrying'
        ).length;

        // Each in-progress step counts as 0.5 of a completed step
        return Math.round(((completedSteps + (inProgressSteps * 0.5)) / totalSteps) * 100);
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentSession?.messages, workflowSteps]);

    // Reset workflow steps
    const resetWorkflowSteps = () => {
        setWorkflowSteps(prev => prev.map(step => ({
            ...step,
            status: 'idle',
            result: undefined,
            error: undefined
        })));
    };

    // Update step status
    const updateStepStatus = (stepId: string, status: WorkflowStep['status'], result?: any, error?: string) => {
        setWorkflowSteps(prev => prev.map(step =>
            step.id === stepId
                ? { ...step, status, result, error }
                : step
        ));
    };

    // Get active step
    const getActiveStep = () => {
        const loadingStep = workflowSteps.find(step => step.status === 'loading');
        if (loadingStep) return loadingStep;

        const idleStep = workflowSteps.find(step => step.status === 'idle');
        return idleStep || workflowSteps[workflowSteps.length - 1];
    };

    // Execute the multi-step workflow for deep questions
    const executeWorkflow = async (question: string, deepMode = false) => {
        setIsProcessing(true);
        setActiveQuestion(question);

        try {
            // If not in deep mode, use the direct question approach
            if (!deepMode) {
                return executeDirectQuestion(question);
            }

            // Start deep mode workflow
            // Step 1: Search Google
            updateStepStatus('search', 'loading');
            addMessage(`### 🔍 Tìm kiếm thông tin
Đang tìm kiếm thông tin từ Google cho câu hỏi: **${question}**...`, 'system');

            try {
                const searchResult = await searchGoogleWithRetry(
                    question,
                    0,
                    10,
                    (attempt: number, error: unknown, delay: number) => {
                        // Update UI to show retry status
                        updateStepStatus('search', 'retrying', null, `Đang thử lại (${attempt}/5)`);
                        addMessage(`**🔄 Thử lại tìm kiếm (lần ${attempt}/5)**...`, 'system');
                    }
                );

                if (!searchResult.success || !searchResult.result) {
                    updateStepStatus('search', 'error', null, searchResult.message || 'Không tìm thấy kết quả');
                    addMessage(`### ❌ Lỗi tìm kiếm
Không tìm thấy kết quả phù hợp cho câu hỏi của bạn. Đang chuyển sang trả lời trực tiếp.`, 'system');

                    // Fall back to direct teacher response if search fails
                    return executeDirectQuestion(question);
                }

                // Successfully found search results - simplified approach from auto-discuss-interface.tsx
                updateStepStatus('search', 'complete', searchResult.result);

                // Extract search result URLs - simplified approach but with proper type assertions
                const searchResults = searchResult.result && searchResult.result.length > 0
                    ? (Array.isArray(searchResult.result)
                        ? searchResult.result
                        : [searchResult.result])
                    : [];

                // Format search results with markdown links
                const resultCount = searchResults.length;

                // Format sources as a markdown list
                let sourceMessage = `### ✅ Tìm thấy ${resultCount} nguồn thông tin liên quan:
`;

                if (resultCount > 0) {
                    searchResults.forEach((result, index: number) => {
                        let link = '';
                        let title = `Kết quả ${index + 1}`;

                        // Handle string URLs
                        if (typeof result === 'string') {
                            link = result;
                            title = result.split('/').pop() || title;
                        }
                        // Handle object with properties
                        else {
                            const resultObj = result as unknown as Record<string, any>;
                            if (resultObj.link && typeof resultObj.link === 'string') {
                                link = resultObj.link;
                            }
                            if (resultObj.title && typeof resultObj.title === 'string') {
                                title = resultObj.title;
                            } else if (link) {
                                title = link.split('/').pop() || title;
                            }
                        }

                        sourceMessage += `${index + 1}. [${title}](${link})\n`;
                    });
                }

                addMessage(sourceMessage, 'system');

                // Check if we have URLs to process
                if (searchResults.length === 0) {
                    updateStepStatus('content', 'error', null, 'Không có URL để trích xuất nội dung');
                    addMessage(`### ❌ Lỗi trích xuất
Không có URL để trích xuất nội dung. Đang chuyển sang trả lời trực tiếp.`, 'system');
                    return executeDirectQuestion(question);
                }

                // Step 2: Get content from URLs
                updateStepStatus('content', 'loading');

                // Safely get the URL from the first result with explicit type assertions
                const firstResult = searchResults.length > 0 ? searchResults[0] : null;
                let sourceUrl = '';
                let sourceTitle = 'nguồn';

                if (firstResult) {
                    if (typeof firstResult === 'string') {
                        sourceUrl = firstResult;
                        sourceTitle = firstResult.split('/').pop() || 'nguồn';
                    } else {
                        // Safely access potentially existing properties
                        const resultObj = firstResult as unknown as Record<string, any>;
                        if (resultObj.link && typeof resultObj.link === 'string') {
                            sourceUrl = resultObj.link;
                        }
                        if (resultObj.title && typeof resultObj.title === 'string') {
                            sourceTitle = resultObj.title;
                        } else if (sourceUrl) {
                            sourceTitle = sourceUrl.split('/').pop() || 'nguồn';
                        }
                    }
                }

                addMessage(`### 📄 Trích xuất nội dung
Đang lấy nội dung từ nguồn: ${sourceTitle}`, 'system');

                try {
                    // Only use the first URL for now, safely extract it
                    const contentResult = await getContentFromUrlWithRetry(
                        sourceUrl,
                        (attempt: number, error: unknown, delay: number) => {
                            // Update UI to show retry status
                            updateStepStatus('content', 'retrying', null, `Đang thử lại (${attempt}/5)`);
                            addMessage(`**🔄 Đang thử lại trích xuất nội dung (lần ${attempt}/5)**...`, 'system');
                        }
                    );

                    if (!contentResult.success || !contentResult.result) {
                        updateStepStatus('content', 'error', null, contentResult.message || 'Không thể trích xuất nội dung');
                        addMessage(`### ❌ Lỗi trích xuất
Không thể trích xuất nội dung từ trang web. Đang chuyển sang trả lời trực tiếp.`, 'system');
                        return executeDirectQuestion(question);
                    }

                    const content = contentResult.result;
                    updateStepStatus('content', 'complete', content);
                    addMessage(`### ✅ Trích xuất thành công
Đã lấy được nội dung từ trang web.`, 'system');

                    // Step 3: Summarize content
                    updateStepStatus('summary', 'loading');
                    addMessage(`### 📝 Tóm tắt nội dung
Đang tóm tắt thông tin đã trích xuất...`, 'system');

                    const summaryResult = await summarizeTextWithRetry(
                        typeof content === 'string' ? content : JSON.stringify(content),
                        (attempt: number, error: unknown, delay: number) => {
                            // Update UI to show retry status
                            updateStepStatus('summary', 'retrying', null, `Đang thử lại (${attempt}/5)`);
                            addMessage(`**🔄 Đang thử lại tóm tắt nội dung (lần ${attempt}/5)**...`, 'system');
                        }
                    );

                    if (!summaryResult.success || !summaryResult.result) {
                        updateStepStatus('summary', 'error', null, summaryResult.message || 'Không thể tóm tắt nội dung');
                        addMessage(`### ⚠️ Lưu ý
Không thể tóm tắt nội dung. Sẽ sử dụng toàn bộ nội dung để phân tích.`, 'system');
                    }

                    const summary = summaryResult.success && summaryResult.result
                        ? summaryResult.result
                        : content;

                    updateStepStatus('summary', 'complete', summary);

                    if (summaryResult.success) {
                        addMessage(`### ✅ Tóm tắt thành công
Đã tóm tắt thông tin quan trọng từ nguồn.`, 'system');
                    }

                    // Step 4: Ask teacher with the content/summary
                    updateStepStatus('teacher', 'loading');
                    addMessage(`### 👨‍🏫 Phân tích thông tin
Giáo viên đang phân tích thông tin để trả lời câu hỏi của bạn...`, 'system');

                    // Combine original question with summary/content
                    const enrichedQuestion = `Câu hỏi: ${question}\n\nThông tin tham khảo: ${summary}`;

                    try {
                        const teacherResponse = await askTeacherWithRetry(
                            enrichedQuestion,
                            (attempt: number, error: unknown, delay: number) => {
                                // Update UI to show retry status
                                updateStepStatus('teacher', 'retrying', null, `Đang thử lại (${attempt}/5)`);
                                addMessage(`**🔄 Giáo viên đang thử lại (lần ${attempt}/5)**...`, 'system');
                            }
                        );

                        if (!teacherResponse.success || !teacherResponse.result) {
                            updateStepStatus('teacher', 'error', null, teacherResponse.message || 'Không thể nhận phản hồi từ giáo viên');
                            addMessage(`### ❌ Lỗi phản hồi
${teacherResponse.message || 'Không thể nhận phản hồi từ giáo viên'}`, 'system');
                            setIsProcessing(false);
                            return;
                        }

                        const teacherResult = typeof teacherResponse.result === 'string'
                            ? teacherResponse.result
                            : JSON.stringify(teacherResponse.result);

                        updateStepStatus('teacher', 'complete', teacherResult);

                        // Display teacher response as markdown instead of using MessageWave
                        addMessage(teacherResult, 'assistant');
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
                        updateStepStatus('teacher', 'error', null, errorMessage);
                        addMessage(`### ❌ Lỗi phản hồi
${errorMessage}`, 'system');
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
                    updateStepStatus('content', 'error', null, errorMessage);
                    addMessage(`### ❌ Lỗi trích xuất
${errorMessage}. Đang chuyển sang trả lời trực tiếp.`, 'system');
                    return executeDirectQuestion(question);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
                updateStepStatus('search', 'error', null, errorMessage);
                addMessage(`### ❌ Lỗi tìm kiếm
${errorMessage}. Đang chuyển sang trả lời trực tiếp.`, 'system');
                return executeDirectQuestion(question);
            }
        } catch (error) {
            addMessage(`### ❌ Lỗi không xác định
${error instanceof Error ? error.message : 'Lỗi xử lý yêu cầu'}`, 'system');
        } finally {
            setIsProcessing(false);
        }
    };

    // Direct question workflow - simple path
    const executeDirectQuestion = async (question: string) => {
        setIsProcessing(true);
        setActiveQuestion(question);

        try {
            // Simple workflow - straight to teacher
            updateStepStatus('teacher', 'loading');
            addMessage(`### 👨‍🏫 Đang chuẩn bị trả lời
Giáo viên đang xử lý câu hỏi của bạn...`, 'system');

            // Simulate realistic delay (5-10s)
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 1000));

            try {
                // Call teacher API directly
                const teacherResponse = await askTeacherWithRetry(
                    question,
                    (attempt: number, error: unknown, delay: number) => {
                        // Update UI to show retry status
                        updateStepStatus('teacher', 'retrying', null, `Đang thử lại (${attempt}/5)`);
                        addMessage(`**🔄 Giáo viên đang thử lại (lần ${attempt}/5)**...`, 'system');
                    }
                );

                if (!teacherResponse.success || !teacherResponse.result) {
                    updateStepStatus('teacher', 'error', null, teacherResponse.message || 'Không thể nhận phản hồi từ giáo viên');
                    addMessage(`### ❌ Lỗi phản hồi
${teacherResponse.message || 'Không thể nhận phản hồi từ giáo viên'}`, 'system');
                    setIsProcessing(false);
                    return;
                }

                const teacherResult = typeof teacherResponse.result === 'string'
                    ? teacherResponse.result
                    : JSON.stringify(teacherResponse.result);

                updateStepStatus('teacher', 'complete', teacherResult);

                // Display teacher response directly without emoji prefix
                addMessage(teacherResult, 'assistant');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
                updateStepStatus('teacher', 'error', null, errorMessage);
                addMessage(`### ❌ Lỗi phản hồi
${errorMessage}`, 'system');
            }
        } catch (error) {
            addMessage(`### ❌ Lỗi không xác định
${error instanceof Error ? error.message : 'Lỗi xử lý yêu cầu'}`, 'system');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isProcessing) return;

        // Create session if none exists
        if (!currentSession) {
            createSession();
        }

        // Add user message
        addMessage(input, 'user');

        // Start workflow
        const userQuestion = input;
        setInput('');

        // Execute workflow with the selected mode (deep or regular)
        await executeWorkflow(userQuestion, isDeepMode);
    };

    // Function to handle clearing messages
    const handleClearMessages = () => {
        clearMessages();
        resetWorkflowSteps();
        setIsProcessing(false);
        setActiveQuestion('');
        setIterationCount(0);
        setCurrentIteration(0);
    };

    // Render workflow progress
    const renderWorkflowProgress = () => {
        if (!isProcessing && !workflowSteps.some(step => step.status === 'complete')) return null;

        const activeStep = getActiveStep();
        const progressPercent = calculateProgress();
        const hasRetryingSteps = workflowSteps.some(step => step.status === 'retrying');

        return (
            <div className="bg-muted/30 rounded-lg p-3 border border-border my-3 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium flex items-center">
                        <BrainIcon className="h-4 w-4 mr-2 text-primary" />
                        Quá trình xử lý
                    </h4>
                    {currentIteration > 0 && (
                        <span className="text-xs text-muted-foreground">
                            Vòng {currentIteration}/{iterationCount}
                        </span>
                    )}
                </div>

                {hasRetryingSteps ? (
                    <RetryingProgress value={progressPercent} className="h-1.5 mb-3" />
                ) : (
                    <Progress value={progressPercent} className="h-1.5 mb-3" />
                )}

                <div className="space-y-2 text-sm">
                    {workflowSteps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-md transition-all duration-300",
                                step.status === 'loading' && "bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 animate-pulse",
                                step.status === 'retrying' && "bg-amber-100/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 animate-pulse",
                                step.status === 'complete' && "text-green-700 dark:text-green-300",
                                step.status === 'error' && "text-red-700 dark:text-red-300",
                                step.id === activeStep.id && "border-l-2 border-primary pl-2"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-full",
                                step.status === 'loading' && "animate-pulse text-blue-500",
                                step.status === 'retrying' && "animate-pulse text-amber-500",
                                step.status === 'complete' && "text-green-500",
                                step.status === 'error' && "text-red-500",
                                step.status === 'idle' && "text-gray-400"
                            )}>
                                {step.status === 'loading' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : step.status === 'retrying' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : step.status === 'complete' ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    step.icon
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-xs">{step.name}</div>
                                {step.status === 'loading' && (
                                    <div className="text-xs opacity-80">{step.description}</div>
                                )}
                                {step.status === 'retrying' && (
                                    <div className="text-xs opacity-80">{step.error || 'Đang thử lại...'}</div>
                                )}
                                {step.status === 'error' && (
                                    <div className="text-xs text-red-500">{step.error || 'Đã xảy ra lỗi'}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Header with clear button */}
            <div className="border-b border-border/40 p-2 flex justify-between items-center bg-card/80 backdrop-blur-sm">
                <h3 className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5 text-primary" />
                    Tin nhắn
                </h3>
                <div className="flex items-center gap-2">
                    {/* Server status indicator */}
                    <div
                        className="group relative flex items-center gap-1 text-xs text-muted-foreground transition-colors py-1 px-2 rounded-md"
                        title={serverStatus.isAvailable ? "Máy chủ AI sẵn sàng" : "Máy chủ AI đang khởi động"}
                    >
                        <div className="relative">
                            <ServerIcon size={12} className={cn(
                                "transition-colors",
                                serverStatus.isChecking ? "text-amber-500 animate-pulse" :
                                    serverStatus.isAvailable ? "text-green-500" : "text-rose-500 animate-pulse"
                            )} />
                            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-background"
                                style={{
                                    backgroundColor: serverStatus.isChecking
                                        ? '#f59e0b' // amber
                                        : serverStatus.isAvailable
                                            ? '#10b981' // green
                                            : '#f43f5e', // rose/red
                                }}
                            ></span>
                        </div>
                        <span className="text-[10px]">
                            {serverStatus.isAvailable ?
                                <span className="text-green-500 flex items-center gap-1">
                                    <Zap size={10} className="animate-pulse" />
                                    Máy chủ sẵn sàng
                                </span> :
                                <span className="text-amber-500 flex items-center gap-1">
                                    <Loader2 size={10} className="animate-spin" />
                                    Đang khởi động
                                </span>
                            }
                        </span>

                        {/* Tooltip with details */}
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

                    {/* Clear messages button (if it exists) */}
                    {currentSession?.messages && currentSession.messages.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearMessages}
                            className="h-7 text-xs text-muted-foreground hover:text-destructive flex gap-1 items-center py-0 px-2"
                            disabled={isProcessing}
                        >
                            <Trash2 className="h-3 w-3" />
                            Xóa tất cả
                        </Button>
                    )}
                </div>
            </div>

            {/* Workflow Progress */}
            <div className="px-3 pt-1">
                {renderWorkflowProgress()}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {currentSession?.messages && currentSession.messages.length > 0 ? (
                    currentSession.messages.filter(msg => msg.role !== 'loading').map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "animate-slide-in-bottom [animation-fill-mode:backwards]",
                                message.role === 'system' && "animate-pulse-light"
                            )}
                            style={{
                                animationDelay: '100ms'
                            }}
                        >
                            {message.role === 'loading' ? (
                                <div className="flex justify-start">
                                    <div className="bg-muted/80 text-muted-foreground rounded-lg p-2 border border-border/60 max-w-[85%] shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                            <span className="text-primary font-medium animate-pulse flex gap-1 text-xs">
                                                <span>{message.content}</span>
                                                <span className="inline-flex">
                                                    <span className="animate-bounce delay-100">.</span>
                                                    <span className="animate-bounce delay-200">.</span>
                                                    <span className="animate-bounce delay-300">.</span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : message.role === 'system' ? (
                                <div className="flex justify-center my-2 animate-fade-in">
                                    <div className="bg-muted/60 text-muted-foreground rounded-lg py-1.5 px-2.5 border border-border/40 max-w-[92%] shadow-sm">
                                        <MarkdownRenderer
                                            content={message.content}
                                            className="px-0 py-0 border-0 shadow-none text-xs"
                                        />
                                    </div>
                                </div>
                            ) : (
                                // Use ChatMessage component for all user/assistant messages
                                <div className={cn(
                                    'flex items-start gap-2 animate-fade-in',
                                    message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse',
                                )}>
                                    <Avatar className="w-8 h-8 mt-0.5 border-2 shadow-md"
                                        style={{
                                            borderColor: message.role === 'assistant' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'
                                        }}
                                    >
                                        <AvatarImage src={message.role === 'assistant' ? '/ai-avatar.png' : '/user-avatar.png'} alt="Avatar" />
                                        <AvatarFallback className={cn(
                                            "flex items-center justify-center text-xs",
                                            message.role === 'assistant' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                                        )}>
                                            {message.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className={cn(
                                        'relative rounded-lg max-w-[85%] shadow-sm transition-all duration-300 p-2.5',
                                        message.role === 'assistant'
                                            ? 'bg-secondary/80 text-secondary-foreground'
                                            : 'bg-primary/80 text-primary-foreground'
                                    )}>
                                        {/* Message Pointer */}
                                        <div className={cn(
                                            "absolute top-3 w-2 h-2 rotate-45",
                                            message.role === 'assistant'
                                                ? "-left-1 bg-secondary/80"
                                                : "-right-1 bg-primary/80"
                                        )}></div>

                                        {/* Use MarkdownRenderer for all messages */}
                                        <MarkdownRenderer
                                            content={message.content}
                                            className={cn(
                                                "px-0 py-0 border-0 shadow-none text-sm",
                                                message.role === 'assistant' ? 'text-secondary-foreground' : 'text-primary-foreground'
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <p className="text-sm font-medium">Chào mừng đến với Trợ lý AI</p>
                            <p className="text-xs">Hãy đặt câu hỏi để bắt đầu</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-border/40 p-3 bg-card/70 backdrop-blur-sm">
                <div className="flex flex-col space-y-1.5 mb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <span className="text-xs text-muted-foreground flex items-center gap-1"
                                    onMouseEnter={() => setShowModeInfo(true)}
                                    onMouseLeave={() => setShowModeInfo(false)}>
                                    Chế độ:
                                    <HelpCircleIcon className="h-3 w-3 cursor-help" />
                                </span>

                                {showModeInfo && (
                                    <div className="absolute bottom-full mb-1.5 left-0 w-60 p-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md border border-border z-50">
                                        <div className="font-medium mb-1 text-[11px]">Hai chế độ hỏi:</div>
                                        <div className="mb-1 text-[11px]"><strong>• Thường:</strong> Trả lời dựa trên kiến thức sẵn có của AI.</div>
                                        <div className="text-[11px]"><strong>• Deep:</strong> Tìm kiếm và phân tích thông tin từ Internet trước khi trả lời.</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => toggleDeepMode(false)}
                                    className={cn(
                                        "text-[11px] px-2 py-0.5 rounded-l-md border-y border-l",
                                        !isDeepMode
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                    )}
                                    disabled={isProcessing}
                                >
                                    Thường
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleDeepMode(true)}
                                    className={cn(
                                        "text-[11px] px-2 py-0.5 rounded-r-md border-y border-r",
                                        isDeepMode
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                    )}
                                    disabled={isProcessing}
                                >
                                    <span className="flex items-center gap-1">
                                        <SparklesIcon className="h-2.5 w-2.5" />
                                        Deep
                                    </span>
                                </button>
                            </div>
                        </div>
                        {isDeepMode && (
                            <div className="text-[10px] text-muted-foreground flex items-center">
                                <SearchIcon className="h-2.5 w-2.5 mr-1" />
                                <span>Tìm kiếm & phân tích</span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isDeepMode ? "Nhập câu hỏi để tìm kiếm..." : "Nhập tin nhắn..."}
                        disabled={isProcessing}
                        rows={1}
                        className="min-h-[45px] resize-none rounded-lg px-3 py-2 border-border/60 focus-visible:ring-primary text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (input.trim() && !isProcessing) {
                                    handleSubmit(e);
                                }
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isProcessing}
                        className={cn(
                            "rounded-full h-9 w-9",
                            (!input.trim() || isProcessing)
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>

            {/* Deep Mode Explainer Modal */}
            {showDeepModeExplainer && <DeepModeExplainer onClose={closeDeepModeExplainer} />}
        </div>
    );
};

export default ChatInterface; 