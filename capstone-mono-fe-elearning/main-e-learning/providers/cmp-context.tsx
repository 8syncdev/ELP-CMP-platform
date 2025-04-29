'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    ChatMessage,
    ChatSession,
    WorkflowState,
    WorkflowStep,
    CMPFeature
} from '@/lib/actions/cmp/cmp.types';

// Context Type
interface CMPContextType {
    // Chat Sessions
    sessions: ChatSession[];
    currentSession: ChatSession | null;
    createSession: () => void;
    selectSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;

    // Messages
    addMessage: (content: string, role: ChatMessage['role']) => void;
    updateMessage: (messageId: string, content: string) => void;
    clearMessages: () => void;

    // UI State
    isChatOpen: boolean;
    activeFeature: CMPFeature;
    setIsChatOpen: (isOpen: boolean) => void;
    setActiveFeature: (feature: CMPFeature) => void;

    // Chat Settings
    isDeepMode: boolean;
    setIsDeepMode: (isDeep: boolean) => void;

    // Workflow
    workflowState: WorkflowState | null;
    setWorkflowState: (state: WorkflowState | null) => void;
    updateWorkflowStep: (index: number, step: Partial<WorkflowStep>) => void;
    resetWorkflow: () => void;

    // Server status
    serverStatus: {
        isChecking: boolean;
        isAvailable: boolean;
        message: string;
        lastChecked: number | null;
    };
    checkServerStatus: () => Promise<boolean>;
    startServerStatusCheck: () => void;
    stopServerStatusCheck: () => void;
}

// Default Context
const CMPContext = createContext<CMPContextType>({
    sessions: [],
    currentSession: null,
    createSession: () => { },
    selectSession: () => { },
    deleteSession: () => { },
    addMessage: () => { },
    updateMessage: () => { },
    clearMessages: () => { },
    isChatOpen: false,
    activeFeature: 'chat',
    setIsChatOpen: () => { },
    setActiveFeature: () => { },
    isDeepMode: true,
    setIsDeepMode: () => { },
    workflowState: null,
    setWorkflowState: () => { },
    updateWorkflowStep: () => { },
    resetWorkflow: () => { },
    serverStatus: {
        isChecking: false,
        isAvailable: false,
        message: 'Server status unknown',
        lastChecked: null,
    },
    checkServerStatus: async () => false,
    startServerStatusCheck: () => { },
    stopServerStatusCheck: () => { }
});

// Provider Component
export function CMPProvider({ children }: { children: React.ReactNode }) {
    // Sessions State
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // UI State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState<CMPFeature>('chat');
    const [isDeepMode, setIsDeepMode] = useState(true);

    // Workflow State
    const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);

    // Server Status State
    const [serverStatus, setServerStatus] = useState({
        isChecking: false,
        isAvailable: false,
        message: 'Server status unknown',
        lastChecked: null as number | null,
    });
    const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

    // Current Session (derived)
    const currentSession = sessions.find(session => session.id === currentSessionId) || null;

    // Load from localStorage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('cmp-sessions');
        if (savedSessions) {
            setSessions(JSON.parse(savedSessions));
        }

        const savedSessionId = localStorage.getItem('cmp-current-session');
        if (savedSessionId) {
            setCurrentSessionId(savedSessionId);
        }

        const savedActiveFeature = localStorage.getItem('cmp-active-feature') as CMPFeature | null;
        if (savedActiveFeature) {
            setActiveFeature(savedActiveFeature);
        }

        const savedDeepMode = localStorage.getItem('cmp-deep-mode');
        if (savedDeepMode !== null) {
            setIsDeepMode(savedDeepMode === 'true');
        }
    }, []);

    // Save to localStorage when state changes
    useEffect(() => {
        localStorage.setItem('cmp-sessions', JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        if (currentSessionId) {
            localStorage.setItem('cmp-current-session', currentSessionId);
        }
    }, [currentSessionId]);

    useEffect(() => {
        localStorage.setItem('cmp-active-feature', activeFeature);
    }, [activeFeature]);

    useEffect(() => {
        localStorage.setItem('cmp-deep-mode', isDeepMode.toString());
    }, [isDeepMode]);

    // Session Management
    const createSession = () => {
        const newSession: ChatSession = {
            id: uuidv4(),
            title: `New Chat ${sessions.length + 1}`,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        setSessions(prev => [...prev, newSession]);
        setCurrentSessionId(newSession.id);
    };

    const selectSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
    };

    const deleteSession = (sessionId: string) => {
        setSessions(prev => prev.filter(session => session.id !== sessionId));

        if (currentSessionId === sessionId) {
            const remainingSessions = sessions.filter(session => session.id !== sessionId);
            setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
        }
    };

    // Message Management
    const addMessage = (content: string, role: ChatMessage['role']) => {
        if (!currentSessionId) {
            // Create a session if none exists
            const newSession: ChatSession = {
                id: uuidv4(),
                title: content.slice(0, 20) + (content.length > 20 ? '...' : ''),
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            setSessions(prev => [...prev, newSession]);
            setCurrentSessionId(newSession.id);

            // Add message to the new session
            const newMessage: ChatMessage = {
                id: uuidv4(),
                role,
                content,
                timestamp: Date.now()
            };

            setSessions(prev => prev.map(session =>
                session.id === newSession.id
                    ? {
                        ...session,
                        messages: [...session.messages, newMessage],
                        updatedAt: Date.now()
                    }
                    : session
            ));
        } else {
            // Add message to existing session
            const newMessage: ChatMessage = {
                id: uuidv4(),
                role,
                content,
                timestamp: Date.now()
            };

            setSessions(prev => prev.map(session =>
                session.id === currentSessionId
                    ? {
                        ...session,
                        messages: [...session.messages, newMessage],
                        updatedAt: Date.now()
                    }
                    : session
            ));
        }
    };

    const updateMessage = (messageId: string, content: string) => {
        if (!currentSessionId) return;

        setSessions(prev => prev.map(session =>
            session.id === currentSessionId
                ? {
                    ...session,
                    messages: session.messages.map(message =>
                        message.id === messageId
                            ? { ...message, content }
                            : message
                    ),
                    updatedAt: Date.now()
                }
                : session
        ));
    };

    // Clear all messages in the current session
    const clearMessages = () => {
        if (!currentSessionId) return;

        setSessions(prev => prev.map(session =>
            session.id === currentSessionId
                ? {
                    ...session,
                    messages: [],
                    updatedAt: Date.now()
                }
                : session
        ));
    };

    // Workflow Management
    const updateWorkflowStep = (index: number, stepUpdate: Partial<WorkflowStep>) => {
        if (!workflowState) return;

        setWorkflowState({
            ...workflowState,
            steps: workflowState.steps.map((step, i) =>
                i === index ? { ...step, ...stepUpdate } : step
            )
        });
    };

    const resetWorkflow = () => {
        setWorkflowState(null);
    };

    // Check server status
    const checkServerStatus = async () => {
        try {
            // Import pingAIServer dynamically to avoid server-side issues
            const { pingAIServer } = await import('@/lib/actions/cmp');

            setServerStatus(prev => ({ ...prev, isChecking: true }));
            const result = await pingAIServer();

            setServerStatus({
                isChecking: false,
                isAvailable: result.isAvailable,
                message: result.message,
                lastChecked: Date.now(),
            });

            return result.isAvailable;
        } catch (error) {
            setServerStatus({
                isChecking: false,
                isAvailable: false,
                message: error instanceof Error ? error.message : 'Error checking server status',
                lastChecked: Date.now(),
            });
            return false;
        }
    };

    // Start server status check - modified to continue indefinitely
    const startServerStatusCheck = () => {
        // Don't create multiple intervals
        if (statusCheckInterval) return;

        // Check immediately
        checkServerStatus();

        // Check every 4 seconds indefinitely
        const interval = setInterval(async () => {
            await checkServerStatus();
            // No longer stopping when server is available
        }, 4000);

        setStatusCheckInterval(interval);
    };

    // Stop server status check
    const stopServerStatusCheck = () => {
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
        }
    };

    // Auto-start server status check on mount
    useEffect(() => {
        startServerStatusCheck();

        // Cleanup interval on unmount
        return () => {
            if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    const contextValue: CMPContextType = {
        sessions,
        currentSession,
        createSession,
        selectSession,
        deleteSession,
        addMessage,
        updateMessage,
        clearMessages,
        isChatOpen,
        activeFeature,
        setIsChatOpen,
        setActiveFeature,
        isDeepMode,
        setIsDeepMode,
        workflowState,
        setWorkflowState,
        updateWorkflowStep,
        resetWorkflow,
        serverStatus,
        checkServerStatus,
        startServerStatusCheck,
        stopServerStatusCheck
    };

    return (
        <CMPContext.Provider value={contextValue}>
            {children}
        </CMPContext.Provider>
    );
}

// Hook
export const useCMP = () => useContext(CMPContext); 