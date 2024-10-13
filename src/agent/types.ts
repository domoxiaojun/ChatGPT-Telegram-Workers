import type { AgentUserConfig } from '../config/env';
import type { UnionData } from '../telegram/utils/utils';

export interface HistoryItem {
    role: string;
    content: string;
    images?: string[] | null;
    tool_calls?: OpenAIFuncCallData[];
    name?: string;
    tool_call_id?: string;
}
export interface OpenAIFuncCallData {
    // index: number;
    id: string;
    type: 'function';
    function: {
        name?: string;
        arguments?: string;
    };
};

export interface HistoryModifierResult {
    history: HistoryItem[];
    message: string | null;
}

export interface CompletionData {
    content: string;
    tool_calls?: OpenAIFuncCallData[] | any[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface MessageBase {
    role: string;
    content: string;
}

export type MessageAssistantFunction = MessageBase & {
    tool_calls: OpenAIFuncCallData[];
};

export type MessageTool = MessageBase & {
    name: string;
    tool_call_id: string;
};

export type HistoryModifier = (history: HistoryItem[], message: string | null) => HistoryModifierResult;

export interface ChatStreamTextHandler {
    (text: string, isEnd?: boolean): Promise<any>;
    nextEnableTime?: () => number | null;
}

export interface LLMChatRequestParams {
    message: string;
    images?: string[];
    audio?: Blob[];
    extra_params?: Record<string, any>;
}

export interface LLMChatParams extends LLMChatRequestParams {
    prompt?: string | null;
    history?: HistoryItem[];
    extra_params?: Record<string, any>;
}

export type ChatAgentRequest = (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null) => Promise<CompletionData>;

export interface ChatAgent {
    name: string;
    modelKey: string;
    enable: (context: AgentUserConfig) => boolean;
    request: ChatAgentRequest;
    model: (ctx: AgentUserConfig) => string;
}

export type ImageAgentRequest = (prompt: string, context: AgentUserConfig) => Promise<ImageResult>;

export interface ImageAgent {
    name: string;
    modelKey: string;
    enable: (context: AgentUserConfig) => boolean;
    request: ImageAgentRequest;
    model: (ctx: AgentUserConfig) => string;
    render?: (response: Response) => Promise<ImageResult>;
}

export interface ImageResult extends UnionData {
    type: 'image';
    message?: string;
    caption?: string;
}

export type AudioAgentRequest = (audio: Blob, context: AgentUserConfig, file_name: string) => Promise<UnionData>;

export interface AudioAgent {
    name: string;
    modelKey: string;
    enable: (context: AgentUserConfig) => boolean;
    request: AudioAgentRequest;
    model: (ctx: AgentUserConfig) => string;
}

export type Image2ImageAgentRequest = (message: any, context: AgentUserConfig) => Promise<string | string[] | Blob>;

export interface Image2ImageAgent {
    name: string;
    modelKey: string;
    enable: (context: AgentUserConfig) => boolean;
    request: Image2ImageAgentRequest;
    model: (ctx: AgentUserConfig) => string;
}
