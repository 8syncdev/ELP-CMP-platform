import { DataResponse } from '../base.dto';

// Request Types
// class QueryRequest(BaseModel):
//     query: str
//     start_num: Optional[int] = 0
//     num_results: Optional[int] = 5
export interface QueryRequest {
    query: string;
    start_num?: number;
    num_results?: number;
}

export interface UrlRequest {
    url: string;
}

export interface TextRequest {
    text: string;
}

export interface QuestionRequest {
    question: string;
}

// Response Type
export interface ActionResponse extends DataResponse {
    result?: string | string[];
}

// Chat Message Types
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'loading';
    content: string;
    timestamp: number;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

// Workflow Types
export interface WorkflowStep {
    type: 'search' | 'content' | 'summary' | 'teacher' | 'student';
    status: 'pending' | 'loading' | 'complete' | 'error';
    data?: any;
    error?: string;
}

export interface WorkflowState {
    steps: WorkflowStep[];
    currentStep: number;
    question: string;
    isComplete: boolean;
}

// Feature Types
export type CMPFeature = 'summarize' | 'chat' | 'autoDiscuss'; 