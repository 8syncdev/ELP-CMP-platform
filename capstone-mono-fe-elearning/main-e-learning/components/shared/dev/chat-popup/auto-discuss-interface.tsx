'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Play, MessageSquare, Loader2, RefreshCw, Pause, Trash2,
    SearchIcon, FileTextIcon, BookOpenIcon, GraduationCapIcon, HelpCircleIcon,
    CheckCircle2, XCircle, BrainIcon, ChevronDown, ChevronUp, AlertTriangle,
    RotateCw, ServerIcon, PowerIcon, AlertCircle, Zap, ZapOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMP } from '@/providers/cmp-context';
import {
    meetingWithTeacher,
    studentAskTeacher,
    searchGoogle,
    getContentFromUrl,
    summarizeText,
    searchGoogleWithRetry,
    getContentFromUrlWithRetry,
    summarizeTextWithRetry,
    meetingWithTeacherWithRetry,
    studentAskTeacherWithRetry
} from '@/lib/actions/cmp';
import { ChatMessage as ChatMessageType, WorkflowState, WorkflowStep } from '@/lib/actions/cmp/cmp.types';
import { ChatMessage } from './chat-message';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/shared/dev/mdx/mdx';
import { Progress } from '@/components/ui/progress';
import { WorkflowProgress, WorkflowStepProps } from './workflow-progress';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Global state for storing search results between renders
let globalSearchUrls: string[] = [];
let globalSummaries: Array<{ url: string, summary: string }> = [];

// Type definition to help TypeScript understand our setState functions
type SetWorkflowStateFunction = React.Dispatch<React.SetStateAction<WorkflowState | null>>;

const AutoDiscussInterface = () => {
    const {
        currentSession,
        addMessage,
        createSession,
        workflowState,
        setWorkflowState,
        updateWorkflowStep,
        resetWorkflow,
        clearMessages,
        serverStatus,
        startServerStatusCheck,
        stopServerStatusCheck
    } = useCMP();

    const [topic, setTopic] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [iterations, setIterations] = useState(3);
    const [currentIteration, setCurrentIteration] = useState(0);
    const [stepStartTimes, setStepStartTimes] = useState<Record<string, number>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchStartIndex, setSearchStartIndex] = useState(0);
    const [workflowCollapsed, setWorkflowCollapsed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shouldCancelOperation, setShouldCancelOperation] = useState(false);
    const [stepProgress, setStepProgress] = useState<Record<string, number>>({});
    const [flowDirection, setFlowDirection] = useState<'up' | 'down'>('up');

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentSession?.messages]);

    // Function to get icon for step type
    const getStepIcon = (stepType: string, status: string) => {
        if (status === 'loading') return <Loader2 className="h-4 w-4 animate-spin" />;
        if (status === 'complete') return <CheckCircle2 className="h-4 w-4" />;
        if (status === 'error') return <AlertTriangle className="h-4 w-4 text-destructive" />;

        switch (stepType) {
            case 'search': return <SearchIcon className="h-4 w-4" />;
            case 'summary': return <BookOpenIcon className="h-4 w-4" />;
            case 'teacher': return <GraduationCapIcon className="h-4 w-4" />;
            case 'student': return <HelpCircleIcon className="h-4 w-4" />;
            default: return <FileTextIcon className="h-4 w-4" />;
        }
    };

    // Function to get step description
    const getStepDescription = (stepType: string) => {
        switch (stepType) {
            case 'search': return 'Tìm kiếm thông tin trên Google';
            case 'summary': return 'Tóm tắt thông tin từ các nguồn';
            case 'teacher': return 'Giáo viên đưa ra phản hồi';
            case 'student': return 'Sinh viên đặt câu hỏi tiếp theo';
            default: return 'Đang xử lý';
        }
    };

    // Simulate delay for better UX
    const simulateDelay = async () => {
        const delay = Math.floor(Math.random() * 500) + 1000; // 3-6 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
    };

    // Initialize workflow
    const initializeWorkflow = () => {
        if (!topic.trim()) return;

        // Create session if none exists
        if (!currentSession) {
            createSession();
        }

        // Add system message
        addMessage(`🚀 Bắt đầu thảo luận tự động về chủ đề: "${topic}"`, 'system');

        // Initialize workflow state
        updateWorkflowStateWithCallback(() => ({
            steps: [
                { type: 'search', status: 'pending', data: null },
                { type: 'summary', status: 'pending', data: null },
                { type: 'teacher', status: 'pending', data: null },
                { type: 'student', status: 'pending', data: null }
            ],
            currentStep: 0,
            question: topic,
            isComplete: false
        }));

        // Reset step timers
        setStepStartTimes({});
        setCurrentIteration(1);
        setIsRunning(true);
    };

    // Create a type-safe wrapper for setWorkflowState to avoid TypeScript errors
    const updateWorkflowStateWithCallback = (callback: (prevState: WorkflowState | null) => WorkflowState | null) => {
        // @ts-ignore - TypeScript doesn't understand React's setState correctly here
        setWorkflowState(callback);
    };

    // Run workflow
    useEffect(() => {
        if (!workflowState || !isRunning) return;

        runWorkflow();
    }, [workflowState, isRunning, currentIteration]);

    // Toggle running state
    const toggleRunning = () => {
        if (!workflowState) {
            initializeWorkflow();
        } else {
            setIsRunning(!isRunning);

            if (!isRunning) {
                // Resuming
                addMessage(`▶️ Tiếp tục thảo luận tự động...`, 'system');
                setShouldCancelOperation(false);

                // We need to continue from where we left off
                runWorkflow();
            } else {
                // Pausing
                addMessage(`⏸️ Thảo luận tự động tạm dừng`, 'system');
                setShouldCancelOperation(true);
            }
        }
    };

    // Reset workflow
    const handleReset = () => {
        if (isRunning) {
            setIsRunning(false);
        }

        setShouldCancelOperation(true);
        resetWorkflow();
        setTopic('');
        setCurrentIteration(0);
        setStepStartTimes({});
        setSearchStartIndex(0); // Reset search start index

        // Add reset message if there's a session
        if (currentSession) {
            addMessage(`🔄 Thảo luận tự động đã được làm mới`, 'system');
        }
    };

    // Calculate progress percentage
    const calculateProgress = () => {
        if (!workflowState) return 0;

        const totalSteps = workflowState.steps.length * iterations;
        const completedSteps = workflowState.steps.filter(step => step.status === 'complete').length +
            (currentIteration - 1) * workflowState.steps.length;

        return Math.round((completedSteps / totalSteps) * 100);
    };

    // Calculate step elapsed time
    const getStepElapsedTime = (stepType: string) => {
        const startTime = stepStartTimes[stepType];
        if (!startTime) return '';

        const step = workflowState?.steps.find(s => s.type === stepType);

        // If step is not loading, return completion time
        if (step?.status !== 'loading') {
            // Calculate the time it took to complete
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            return `(${elapsedSeconds}s)`;
        }

        // For loading steps, show ongoing time
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        return `(${elapsedSeconds}s)`;
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 500, damping: 30 }
        }
    };

    // Create a separate runWorkflow function that can be called from toggleRunning
    const runWorkflow = async () => {
        try {
            // Check if we're already processing or workflow has been cancelled
            if (!isRunning || shouldCancelOperation) return;

            // Get current step information
            const currentStepIndex = workflowState?.currentStep || 0;
            const currentStep = workflowState?.steps[currentStepIndex];

            // Skip if step is not pending
            if (!currentStep || currentStep.status !== 'pending') {
                console.log(`Step ${currentStep?.type} is not pending (${currentStep?.status}), skipping.`);
                return;
            }

            // Mark step as loading using the callback form of setState which gets latest state
            updateWorkflowStateWithCallback((prevState) => {
                if (!prevState) return prevState;

                const updatedSteps = [...prevState.steps];
                updatedSteps[currentStepIndex] = {
                    ...updatedSteps[currentStepIndex],
                    status: 'loading'
                };

                return {
                    ...prevState,
                    steps: updatedSteps
                };
            });

            // Record start time for this step
            setStepStartTimes(prev => ({
                ...prev,
                [currentStep.type]: Date.now()
            }));

            // Wait a tick to ensure state updates are processed
            await new Promise(resolve => setTimeout(resolve, 50));

            // Check for cancellation after any await
            if (shouldCancelOperation) {
                throw new Error('Thao tác đã bị hủy');
            }

            // Process step based on type
            switch (currentStep.type) {
                case 'search':
                    // Add loading message
                    addMessage(`🔍 Đang tìm kiếm thông tin về "${workflowState.question}"...`, 'system');

                    try {
                        // Execute search with short delay for testing
                        await controlledTimeout(Math.floor(Math.random() * 500) + 1000);

                        // Append current year to question for more relevant results
                        const currentYear = new Date().getFullYear();
                        const queryWithYear = `${workflowState.question} ${currentYear}`;

                        // Use the searchGoogleWithRetry function with retry callback for better UX
                        const searchResponse = await searchGoogleWithRetry(
                            queryWithYear,
                            searchStartIndex,
                            5,
                            (attempt: number, error: unknown, delay: number) => {
                                console.log(`Retrying search (${attempt}): ${error}, waiting ${delay}ms`);
                                addMessage(`⚠️ Đang thử lại lần ${attempt}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`, 'system');
                            }
                        );

                        console.log('Full search response:', JSON.stringify(searchResponse, null, 2));

                        // Update search start for next iteration
                        setSearchStartIndex(prev => prev + 10);

                        // Make sure we properly handle the API response
                        if (!searchResponse.success) {
                            throw new Error(searchResponse.message || 'Không thể tìm kiếm thông tin');
                        }

                        // Ensure result exists and has content
                        if (!searchResponse.result) {
                            throw new Error('Không nhận được kết quả tìm kiếm');
                        }

                        // Extract URLs from the response and save locally
                        const searchResultUrls = searchResponse.result && searchResponse.result.length > 0
                            ? Array.isArray(searchResponse.result)
                                ? searchResponse.result
                                : [searchResponse.result]
                            : [];

                        // Check if we have URLs to process
                        if (searchResultUrls.length === 0) {
                            throw new Error('Không tìm thấy URL nào từ kết quả tìm kiếm');
                        }

                        // Store URLs in global variable to access in other steps
                        globalSearchUrls = [...searchResultUrls];
                        console.log('Stored search URLs globally:', globalSearchUrls);

                        // Update step with normal approach
                        updateWorkflowStep(currentStepIndex, {
                            status: 'complete',
                            data: searchResultUrls
                        });

                        // Format message with markdown links
                        const sourceMessage = `### 🔍 Tìm thấy ${searchResultUrls.length} nguồn thông tin liên quan:
${searchResultUrls.map((url, index) => `${index + 1}. [${url.split('/')[2]}](${url})`).join('\n')}`;

                        addMessage(sourceMessage, 'system');
                    } catch (error) {
                        console.error('Search error:', error);
                        updateWorkflowStep(currentStepIndex, {
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Lỗi không xác định khi tìm kiếm'
                        });
                        throw error; // Re-throw to be caught by the main try-catch
                    }
                    break;

                case 'summary':
                    // Add loading message
                    addMessage(`📝 Đang tóm tắt thông tin từ các nguồn...`, 'system');

                    try {
                        // Use global URLs from search step
                        const urlsToProcess = globalSearchUrls.length > 0 ? globalSearchUrls : [];
                        console.log('Using URLs from global store:', urlsToProcess);

                        if (urlsToProcess.length === 0) {
                            // Fallback to retrieving from workflow state
                            const searchStep = workflowState.steps.find(step => step.type === 'search');
                            console.log('Search step data from state:', searchStep);

                            if (!searchStep || searchStep.status !== 'complete' || !searchStep.data) {
                                console.error('Search step data not available:', searchStep);
                                throw new Error('Không có dữ liệu tìm kiếm. Vui lòng thử lại.');
                            }

                            // If we have data from workflow state and it's an array
                            if (Array.isArray(searchStep.data)) {
                                urlsToProcess.push(...searchStep.data);
                            }
                        }

                        console.log('Processing URLs:', urlsToProcess.length > 0 ? urlsToProcess : 'None found');

                        if (urlsToProcess.length === 0) {
                            throw new Error('Không có URL để xử lý');
                        }

                        // Process each URL individually for better performance
                        const summaries: Array<{ url: string, summary: string }> = [];

                        for (let i = 0; i < urlsToProcess.length; i++) {
                            const url = urlsToProcess[i];
                            // Add message for current URL processing
                            addMessage(`🔗 Đang xử lý nguồn thông tin ${i + 1}/${urlsToProcess.length}: ${url}`, 'system');

                            // Shorter delay for content processing
                            await controlledTimeout(Math.floor(Math.random() * 500) + 1000);

                            try {
                                // Get content with retry mechanism
                                const contentResponse = await getContentFromUrlWithRetry(
                                    url,
                                    (attempt, error, delay) => {
                                        console.log(`Retrying content fetch (${attempt}): ${error}, waiting ${delay}ms`);
                                        addMessage(`⚠️ Đang thử lại lấy nội dung lần ${attempt}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`, 'system');
                                    }
                                );

                                if (contentResponse.success && contentResponse.result) {
                                    const content = typeof contentResponse.result === 'string'
                                        ? contentResponse.result
                                        : JSON.stringify(contentResponse.result);

                                    // Summarize this content
                                    addMessage(`📄 Đang tóm tắt nội dung từ nguồn ${i + 1}...`, 'system');

                                    // Shorter delay for summarization
                                    await controlledTimeout(Math.floor(Math.random() * 500) + 1000);

                                    // Call summarizeText API with retry mechanism
                                    const summaryResponse = await summarizeTextWithRetry(
                                        content,
                                        (attempt, error, delay) => {
                                            console.log(`Retrying summarization (${attempt}): ${error}, waiting ${delay}ms`);
                                            addMessage(`⚠️ Đang thử lại tóm tắt lần ${attempt}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`, 'system');
                                        }
                                    );

                                    if (summaryResponse.success && summaryResponse.result) {
                                        const summary = typeof summaryResponse.result === 'string'
                                            ? summaryResponse.result
                                            : JSON.stringify(summaryResponse.result);

                                        summaries.push({
                                            url,
                                            summary
                                        });

                                        // Show individual summary
                                        addMessage(`✅ Tóm tắt từ nguồn ${i + 1}: ${url.split('/')[2]}\n\n${summary}`, 'system');
                                    } else {
                                        addMessage(`⚠️ Không thể tóm tắt nội dung từ nguồn ${i + 1}: ${summaryResponse.message || 'Lỗi không xác định'}`, 'system');
                                    }
                                } else {
                                    addMessage(`⚠️ Không thể lấy nội dung từ nguồn ${i + 1}: ${contentResponse.message || 'Lỗi không xác định'}`, 'system');
                                }
                            } catch (urlError) {
                                console.error(`Error processing URL ${url}:`, urlError);
                                addMessage(`⚠️ Lỗi khi xử lý nguồn ${i + 1}: ${urlError instanceof Error ? urlError.message : 'Lỗi không xác định'}`, 'system');
                                // Continue with next URL instead of failing completely
                            }
                        }

                        if (summaries.length === 0) {
                            throw new Error('Không thể tóm tắt bất kỳ nguồn thông tin nào');
                        }

                        // Store summaries in global variable for teacher step
                        globalSummaries = [...summaries];
                        console.log('Stored summaries globally:', globalSummaries);

                        // Update step with summaries
                        updateWorkflowStep(currentStepIndex, {
                            status: 'complete',
                            data: summaries
                        });

                        // Show summary completion
                        addMessage(`### 📝 Đã hoàn thành tóm tắt từ ${summaries.length}/${urlsToProcess.length} nguồn thông tin.`, 'system');
                    } catch (error) {
                        console.error('Summary error:', error);
                        updateWorkflowStep(currentStepIndex, {
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Lỗi không xác định khi tóm tắt'
                        });
                        throw error; // Re-throw to be caught by the main try-catch
                    }
                    break;

                case 'teacher':
                    // Add loading message for teacher response
                    addMessage(`👨‍🏫 Giáo viên đang phân tích thông tin và chuẩn bị câu trả lời...`, 'system');

                    try {
                        // Get summaries from global variable
                        const teacherSummaries = globalSummaries.length > 0 ? globalSummaries : [];

                        if (teacherSummaries.length === 0) {
                            // Try to get from workflow state if global variable is empty
                            const summaryStep = workflowState.steps.find(step => step.type === 'summary');

                            if (!summaryStep || summaryStep.status !== 'complete' || !summaryStep.data) {
                                console.error('Summary step data not available:', summaryStep);
                                throw new Error('Không có dữ liệu tóm tắt. Vui lòng thử lại.');
                            }

                            // If we have data from workflow state
                            if (Array.isArray(summaryStep.data)) {
                                teacherSummaries.push(...summaryStep.data);
                            }
                        }

                        if (teacherSummaries.length === 0) {
                            throw new Error('Không có dữ liệu tóm tắt để phân tích');
                        }

                        // Combine summaries for teacher prompt
                        let combinedSummary = '';
                        if (teacherSummaries.length > 0) {
                            combinedSummary = teacherSummaries.map((item, index) =>
                                `Nguồn ${index + 1} (${item.url.split('/')[2]}):\n${item.summary}`
                            ).join('\n\n');
                        }

                        // Build prompt for teacher
                        const teacherPrompt = `Câu hỏi: ${workflowState.question}\n\nTóm tắt thông tin:\n${combinedSummary}`;

                        // Delay for teacher response
                        await controlledTimeout(Math.floor(Math.random() * 500) + 1000);

                        // Call the teacher API with the prompt
                        const teacherResponse = await meetingWithTeacherWithRetry(
                            teacherPrompt,
                            (attempt: number, error: unknown, delay: number) => {
                                console.log(`Retrying teacher response (${attempt}): ${error}, waiting ${delay}ms`);
                                addMessage(`⚠️ Đang thử lại lấy phản hồi từ giáo viên lần ${attempt}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`, 'system');
                            }
                        );

                        if (!teacherResponse.success || !teacherResponse.result) {
                            throw new Error(teacherResponse.message || 'Không thể nhận phản hồi từ giáo viên');
                        }

                        // Format the response
                        const teacherResult = typeof teacherResponse.result === 'string'
                            ? teacherResponse.result
                            : JSON.stringify(teacherResponse.result);

                        // Update step status
                        updateWorkflowStep(currentStepIndex, {
                            status: 'complete',
                            data: teacherResult
                        });

                        // Add teacher message (using emoji to trigger MessageWave animation)
                        addMessage(`👨‍🏫 ${teacherResult}`, 'assistant');
                    } catch (error) {
                        console.error('Teacher error:', error);
                        updateWorkflowStep(currentStepIndex, {
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Lỗi không xác định khi nhận phản hồi từ giáo viên'
                        });
                        throw error; // Re-throw to be caught by the main try-catch
                    }
                    break;

                case 'student':
                    // Add loading message for student response
                    addMessage(`👩‍🎓 Sinh viên đang suy nghĩ câu hỏi tiếp theo...`, 'system');

                    try {
                        // Delay for student response
                        await controlledTimeout(Math.floor(Math.random() * 500) + 1000);

                        // Call the student API
                        const studentResponse = await studentAskTeacherWithRetry(
                            workflowState.question,
                            (attempt: number, error: unknown, delay: number) => {
                                console.log(`Retrying student question (${attempt}): ${error}, waiting ${delay}ms`);
                                addMessage(`⚠️ Đang thử lại tạo câu hỏi tiếp theo lần ${attempt}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`, 'system');
                            }
                        );

                        if (!studentResponse.success || !studentResponse.result) {
                            throw new Error(studentResponse.message || 'Không thể tạo câu hỏi tiếp theo');
                        }

                        // Format the response
                        const studentResult = typeof studentResponse.result === 'string'
                            ? studentResponse.result
                            : JSON.stringify(studentResponse.result);

                        // Update step status
                        updateWorkflowStep(currentStepIndex, {
                            status: 'complete',
                            data: studentResult
                        });

                        // Add student message (using emoji to trigger MessageWave animation)
                        addMessage(`👩‍🎓 ${studentResult}`, 'user');

                        // Update question for next iteration
                        if (workflowState) {
                            // Use our helper function for type safety
                            updateWorkflowStateWithCallback((prevState) => {
                                if (!prevState) return prevState;
                                return {
                                    ...prevState,
                                    question: studentResult
                                };
                            });
                        }
                    } catch (error) {
                        console.error('Student error:', error);
                        updateWorkflowStep(currentStepIndex, {
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Lỗi không xác định khi tạo câu hỏi tiếp theo'
                        });
                        throw error; // Re-throw to be caught by the main try-catch
                    }
                    break;
            }

            // Move to next step
            updateWorkflowStateWithCallback((prevState) => {
                if (!prevState) return prevState;

                if (prevState.currentStep < prevState.steps.length - 1) {
                    return {
                        ...prevState,
                        currentStep: prevState.currentStep + 1
                    };
                } else {
                    // All steps completed for this iteration
                    // Check if we need to start a new iteration (should be < iterations, not <=)
                    if (currentIteration < iterations) {
                        // Set up next iteration - note that currentIteration is 1-based (starts at 1)
                        setCurrentIteration(prev => prev + 1);

                        // Add iteration message
                        addMessage(`--- Bắt đầu vòng thảo luận ${currentIteration + 1}/${iterations} ---`, 'system');

                        // Reset steps for next iteration
                        return {
                            ...prevState,
                            steps: prevState.steps.map((step: WorkflowStep) => ({ ...step, status: 'pending' as const })),
                            currentStep: 0
                        };
                    } else {
                        // All iterations completed
                        setIsRunning(false);

                        // Add completion message
                        addMessage(`✨ Thảo luận tự động hoàn thành sau ${currentIteration} vòng tương tác`, 'system');

                        return prevState;
                    }
                }
            });

        } catch (error) {
            // Handle cancellation error specially
            if (error instanceof Error && error.message === 'Thao tác đã bị hủy') {
                console.log('Operation cancelled by user');
                setIsRunning(false);
                return;
            }

            // Get current step index
            const currentStepIndex = workflowState?.currentStep || 0;

            // Update step status to error using callback form
            updateWorkflowStateWithCallback((prevState) => {
                if (!prevState) return prevState;

                const updatedSteps = [...prevState.steps];
                updatedSteps[currentStepIndex] = {
                    ...updatedSteps[currentStepIndex],
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : 'Lỗi không xác định'
                };

                const newState = {
                    ...prevState,
                    steps: updatedSteps
                };

                return newState;
            });

            // Add error message
            addMessage(`❌ Đã xảy ra lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`, 'system');

            // Stop workflow
            setIsRunning(false);
        }
    };

    // Add a utility function to check for cancellation and throw if needed
    const checkCancellation = () => {
        if (shouldCancelOperation) {
            throw new Error('Thao tác đã bị hủy');
        }
    };

    // Helper for controlled timeouts (used throughout the delay operations)
    const controlledTimeout = (ms: number) => {
        return new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => resolve(), ms);

            // Check for cancellation every 100ms
            const interval = setInterval(() => {
                if (shouldCancelOperation) {
                    clearTimeout(timer);
                    clearInterval(interval);
                    reject(new Error('Thao tác đã bị hủy'));
                }
            }, 100);

            // Make sure to clear the interval when the timer resolves
            setTimeout(() => clearInterval(interval), ms + 10);
        });
    };

    // Update all setTimeout calls in the process functions to use controlledTimeout
    // In the function calls, replace:
    // await new Promise(resolve => setTimeout(resolve, time));
    // with:
    // await controlledTimeout(time);

    // Add a function to check if workflow is actively processing
    const isActivelyProcessing = () => {
        return isRunning && !shouldCancelOperation;
    };

    // Function to retry a failed step
    const retryStep = async (stepIndex: number) => {
        if (!workflowState) return;

        // Reset the step status to pending
        updateWorkflowStateWithCallback((prevState) => {
            if (!prevState) return prevState;

            const updatedSteps = [...prevState.steps];
            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                status: 'pending',
                error: undefined
            };

            return {
                ...prevState,
                steps: updatedSteps,
                currentStep: stepIndex
            };
        });

        // Start running from this step
        if (!isRunning) {
            addMessage(`🔄 Đang thử lại bước "${getStepDescription(workflowState.steps[stepIndex].type)}"...`, 'system');
            setIsRunning(true);
        }
    };

    // Add a proper clear messages handler
    const handleClearMessages = useCallback(() => {
        if (clearMessages) {
            clearMessages();
        }
        resetWorkflow();
        setIsRunning(false);
        setTopic('');
        setCurrentIteration(0);
        setSearchStartIndex(0);
    }, [clearMessages, resetWorkflow]);

    // Add a function to check if any step has an error
    const hasWorkflowError = useCallback(() => {
        return workflowState?.steps.some(step => step.status === 'error') || false;
    }, [workflowState]);

    // Add a function to find the first error step
    const getFirstErrorStep = useCallback(() => {
        return workflowState?.steps.findIndex(step => step.status === 'error') || -1;
    }, [workflowState]);

    // Add a function to restart the workflow from the first error step
    const restartFromFirstError = useCallback(() => {
        const errorStepIndex = getFirstErrorStep();
        if (errorStepIndex >= 0) {
            retryStep(errorStepIndex);
        }
    }, [getFirstErrorStep, retryStep]);

    // Calculate step progress (for better visual feedback)
    const updateStepProgress = (stepType: string, progress: number | ((prev: Record<string, number>) => number)) => {
        if (typeof progress === 'function') {
            setStepProgress(prev => ({
                ...prev,
                [stepType]: Math.min(progress(prev), 100)
            }));
        } else {
            setStepProgress(prev => ({
                ...prev,
                [stepType]: Math.min(progress, 100)
            }));
        }
    };

    // Reset step progress when changing steps
    useEffect(() => {
        if (workflowState?.currentStep !== undefined) {
            const currentStep = workflowState.steps[workflowState.currentStep];
            if (currentStep) {
                updateStepProgress(currentStep.type, 0);

                // Start progress animation for loading steps
                if (currentStep.status === 'loading') {
                    const interval = setInterval(() => {
                        setStepProgress(prev => {
                            const currentProgress = prev[currentStep.type] || 0;
                            // Gradually increase to 95% to show progress, but not completion
                            return {
                                ...prev,
                                [currentStep.type]: Math.min(currentProgress + Math.random() * 5, 95)
                            };
                        });
                    }, 800);

                    return () => clearInterval(interval);
                }
            }
        }
    }, [workflowState?.currentStep, workflowState?.steps]);

    // Update progress to 100% when step completes
    useEffect(() => {
        if (workflowState?.steps) {
            workflowState.steps.forEach(step => {
                if (step.status === 'complete') {
                    updateStepProgress(step.type, 100);
                }
            });
        }
    }, [workflowState?.steps]);

    // Toggle flow direction to show animation flow direction
    const toggleFlowDirection = () => {
        setFlowDirection(prev => prev === 'up' ? 'down' : 'up');
    };

    // Add dynamic backgrounds based on workflow state
    const getBackgroundStyle = () => {
        if (!workflowState) return 'bg-card/80';

        if (shouldCancelOperation) return 'bg-amber-50/70 dark:bg-amber-900/20';

        if (isActivelyProcessing()) {
            // Different background for different steps
            const currentStep = workflowState.steps[workflowState.currentStep];
            if (!currentStep) return 'bg-blue-50/70 dark:bg-blue-900/20';

            switch (currentStep.type) {
                case 'search': return 'bg-blue-50/70 dark:bg-blue-900/20';
                case 'summary': return 'bg-green-50/70 dark:bg-green-900/20';
                case 'teacher': return 'bg-purple-50/70 dark:bg-purple-900/20';
                case 'student': return 'bg-amber-50/70 dark:bg-amber-900/20';
                default: return 'bg-blue-50/70 dark:bg-blue-900/20';
            }
        }

        return 'bg-card/80';
    };

    // Compute progress indicator color based on step type
    const getProgressColor = (stepType: string) => {
        switch (stepType) {
            case 'search': return 'bg-blue-500';
            case 'summary': return 'bg-green-500';
            case 'teacher': return 'bg-purple-500';
            case 'student': return 'bg-amber-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Controls Panel */}
            <motion.div
                className={`p-3 border-b border-border/40 ${getBackgroundStyle()} backdrop-blur-sm transition-colors duration-500`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="flex justify-between items-center mb-2">
                    <motion.h3
                        className="text-xs font-medium text-foreground flex items-center gap-1.5"
                        variants={itemVariants}
                    >
                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                        Thảo luận tự động
                    </motion.h3>

                    <div className="flex items-center gap-2">
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

                            {/* Tooltip with more details */}
                            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 
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

                        {currentSession?.messages && currentSession.messages.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearMessages}
                                className="h-7 text-xs text-muted-foreground hover:text-destructive flex gap-1 items-center py-0 px-2"
                            >
                                <Trash2 className="h-3 w-3" />
                                Xóa tất cả
                            </Button>
                        )}
                    </div>
                </motion.div>

                {!workflowState && (
                    <motion.div variants={itemVariants}>
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-foreground mb-1">
                                Chủ đề thảo luận
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Nhập chủ đề hoặc câu hỏi..."
                                className="w-full p-2 border border-border/60 rounded-lg bg-card/60 dark:bg-card/60 text-foreground dark:text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                disabled={isRunning}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-foreground mb-1">
                                Số vòng thảo luận: {iterations}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={iterations}
                                onChange={(e) => setIterations(parseInt(e.target.value))}
                                className="w-full h-1.5"
                                disabled={isRunning}
                            />
                        </div>
                    </motion.div>
                )}

                {workflowState && (
                    <motion.div
                        className="mb-3"
                        variants={itemVariants}
                    >
                        <Collapsible
                            open={!workflowCollapsed}
                            onOpenChange={(isOpen) => setWorkflowCollapsed(!isOpen)}
                            className={`w-full border rounded-lg p-2 bg-background/50 backdrop-blur-sm border-border/40 ${isActivelyProcessing() ? 'shadow-md shadow-primary/10' : ''
                                } transition-all duration-300`}
                        >
                            <CollapsibleTrigger className="flex w-full justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <BrainIcon className={`h-3.5 w-3.5 text-primary ${isActivelyProcessing() ? 'animate-pulse' : ''}`} />
                                    <span className="font-medium text-xs">
                                        Tiến độ - Vòng {currentIteration}/{iterations}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={calculateProgress()}
                                        className={`w-20 h-1.5 ${isActivelyProcessing() ? 'animate-pulse' : ''}`}
                                    />
                                    {workflowCollapsed ?
                                        <ChevronDown className="h-3.5 w-3.5" /> :
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    }
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                                <WorkflowProgress
                                    steps={workflowState.steps.map((step, index) => ({
                                        id: step.type,
                                        name: getStepDescription(step.type),
                                        description: step.status === 'loading' ?
                                            step.type === 'search' ? 'Đang tìm kiếm thông tin trên Google...' :
                                                step.type === 'summary' ? 'Đang tóm tắt thông tin từ các nguồn...' :
                                                    step.type === 'teacher' ? 'Giáo viên đang soạn câu trả lời...' :
                                                        'Sinh viên đang nghĩ câu hỏi tiếp theo...' : '',
                                        icon: getStepIcon(step.type, step.status),
                                        status: step.status === 'pending' ? 'idle' : step.status,
                                        isActive: index === workflowState.currentStep,
                                        error: step.error,
                                        elapsedTime: getStepElapsedTime(step.type),
                                        progress: stepProgress[step.type] || 0,
                                        progressColor: getProgressColor(step.type),
                                        onRetry: step.status === 'error' ? () => retryStep(index) : undefined
                                    }))}
                                    progress={calculateProgress()}
                                    iteration={currentIteration}
                                    totalIterations={iterations}
                                    flowDirection={flowDirection}
                                    onToggleDirection={toggleFlowDirection}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    </motion.div>
                )}

                {/* Error indicator */}
                {hasWorkflowError() && (
                    <motion.div
                        className="mt-1 mb-2 p-2 border border-red-300 dark:border-red-800 bg-red-50/80 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-300 text-xs"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="font-medium">Đã xảy ra lỗi trong quá trình xử lý</span>
                        </div>
                        <p className="text-xs mb-1.5">
                            {workflowState?.steps.find(step => step.status === 'error')?.error ||
                                'Một bước trong quy trình đã thất bại. Vui lòng thử lại.'}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2 py-0"
                                onClick={restartFromFirstError}
                            >
                                <RotateCw className="h-3 w-3 mr-1.5" />
                                Thử lại từ bước lỗi
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2 py-0"
                                onClick={handleReset}
                            >
                                <RefreshCw className="h-3 w-3 mr-1.5" />
                                Bắt đầu lại
                            </Button>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="flex space-x-2"
                    variants={itemVariants}
                >
                    <button
                        onClick={toggleRunning}
                        disabled={(!topic.trim() && !workflowState) || (shouldCancelOperation)}
                        className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-sm flex items-center justify-center ${(!topic.trim() && !workflowState) || (shouldCancelOperation)
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : isActivelyProcessing()
                                ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white hover:from-orange-700 hover:to-red-800 shadow-md shadow-orange-500/20'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-sm'
                            } transition-all duration-300`}
                    >
                        {isActivelyProcessing() ? (
                            <>
                                <Pause className="h-4 w-4 mr-1.5 animate-pulse" />
                                Tạm dừng
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-1.5" />
                                {workflowState ? 'Tiếp tục' : 'Bắt đầu'}
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={shouldCancelOperation}
                        className={`py-1.5 px-3 rounded-lg font-medium text-sm ${shouldCancelOperation
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            } flex items-center justify-center transition-colors duration-300`}
                    >
                        <RefreshCw className={`h-4 w-4 mr-1.5 ${shouldCancelOperation ? 'animate-spin' : ''}`} />
                        {shouldCancelOperation ? 'Đang hủy...' : 'Làm mới'}
                    </button>
                </motion.div>
            </motion.div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background/50">
                <AnimatePresence>
                    {currentSession?.messages && currentSession.messages.length > 0 ? (
                        currentSession.messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className={isActivelyProcessing() ? 'transition-all' : ''}
                            >
                                {message.role === 'system' ? (
                                    <div className="flex justify-center my-2 animate-fade-in">
                                        <div className="bg-blue-100/30 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg py-1.5 px-2.5 border border-blue-200/40 dark:border-blue-800/40 max-w-[92%] shadow-sm text-xs">
                                            <MarkdownRenderer
                                                content={message.content}
                                                className="px-0 py-0 border-0 shadow-none text-xs"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <ChatMessage
                                        message={message.content}
                                        isIncoming={message.role === 'assistant'}
                                        avatarFallback={message.role === 'assistant' ? 'AI' : 'U'}
                                        avatarUrl={message.role === 'assistant' ? '/ai-avatar.png' : '/user-avatar.png'}
                                        isProcessing={isActivelyProcessing() && message.id === currentSession.messages[currentSession.messages.length - 1].id}
                                    />
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center h-full"
                        >
                            <div className="text-center text-gray-500 dark:text-gray-400 p-6 rounded-xl bg-gray-50/80 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800/30 backdrop-blur-sm shadow-sm">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800/80 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-sm font-medium mb-1">Thảo luận tự động</p>
                                <p className="text-xs max-w-[250px]">Khám phá kiến thức với hệ thống thảo luận tự động. Nhập chủ đề của bạn để bắt đầu.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default AutoDiscussInterface; 