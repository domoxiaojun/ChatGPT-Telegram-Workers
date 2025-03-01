import type { CoreUserMessage } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { createLlmModel, warpLLMParams } from '.';
import { requestChatCompletionsV2 } from './request';

export class Anthropic implements ChatAgent {
    readonly name = 'anthropic';
    readonly modelKey = 'ANTHROPIC_CHAT_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.ANTHROPIC_API_KEY);
    };

    readonly model = (ctx: AgentUserConfig, params?: LLMChatRequestParams): string => {
        const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : 'text';
        switch (msgType) {
            case 'image':
                return ctx.ANTHROPIC_VISION_MODEL;
            case 'file':
            default:
                return ctx.ANTHROPIC_CHAT_MODEL;
        }
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const modelId = this.model(context, params.messages.at(-1) as CoreUserMessage);
        const model = await createLlmModel(modelId, context);
        return requestChatCompletionsV2(await warpLLMParams({
            model,
            messages: params.messages,
            cache: params.cache,
        }, context), onStream);
    };

    readonly models = async (context: AgentUserConfig): Promise<string[]> => {
        const headers = {
            'x-api-key': context.ANTHROPIC_API_KEY ?? '',
            'anthropic-version': '2023-06-01',
        };
        const result = await fetch(context.ANTHROPIC_MODELS_API, { headers });
        if (!result.ok) {
            throw new Error(`error: ${result.statusText}`);
        }
        const { models } = await result.json();
        return models.filter((model: any) => model.type === 'model').map((model: any) => model.id);
    };
}
