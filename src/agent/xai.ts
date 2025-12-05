import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { webSearch, xSearch } from '@ai-sdk/xai';
import { createLlmModel } from './llm';
import { warpLLMParams } from './model_middleware';
import { requestChatCompletionsV2 } from './request';

export class XAI implements ChatAgent {
    readonly name = 'xai';
    readonly modelKey = 'XAI_CHAT_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.XAI_API_KEY);
    };

    readonly model = (ctx: AgentUserConfig, params?: LLMChatRequestParams): string => {
        return Array.isArray(params?.content) ? ctx.XAI_VISION_MODEL : ctx.XAI_CHAT_MODEL;
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const model = await createLlmModel(this.model(context), context);
        const wrappedParams = await warpLLMParams({
            model,
            messages: params.messages,
            cache: params.cache,
        }, context);

        // Add xAI server-side tools for Responses API
        const xaiTools = [
            webSearch(),
            xSearch(),
        ];

        return requestChatCompletionsV2({
            ...wrappedParams,
            tools: wrappedParams.tools
                ? { ...wrappedParams.tools, ...Object.fromEntries(xaiTools.map(t => [t.name, t])) }
                : Object.fromEntries(xaiTools.map(t => [t.name, t])),
        }, onStream);
    };
}
