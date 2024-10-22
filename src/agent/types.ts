import type { CoreAssistantMessage, CoreMessage, CoreToolMessage, CoreUserMessage } from 'ai';
import type { AgentUserConfig } from '../config/env';

export type HistoryItem = CoreMessage;

export interface HistoryModifierResult {
    history: HistoryItem[];
    message: CoreUserMessage;
}

export type HistoryModifier = (history: HistoryItem[], message: CoreUserMessage) => HistoryModifierResult;

export type ChatStreamTextHandler = (text: string) => Promise<any>;

export type LLMChatRequestParams = CoreUserMessage;

export interface LLMChatParams {
    prompt?: string;
    messages: CoreMessage[];
}

export type ResponseMessage = CoreAssistantMessage | CoreToolMessage;

export type ChatAgentRequest = (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null) => Promise<ResponseMessage[]>;

export interface ChatAgent {
    name: string;
    modelKey: string;
    enable: (context: AgentUserConfig) => boolean;
    request: ChatAgentRequest;
    model: (ctx: AgentUserConfig) => string;
}

export type ImageAgentRequest = (prompt: string, context: AgentUserConfig) => Promise<string | Blob>;

export interface ImageAgent {
    name: string;
    modelKey: string;
    enable: (context: AgentUserConfig) => boolean;
    request: ImageAgentRequest;
    model: (ctx: AgentUserConfig) => string;
}
