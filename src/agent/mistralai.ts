import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, LLMChatParams, ResponseMessage } from './types';
import { createLlmModel, warpLLMParams } from '.';
import { requestChatCompletionsV2 } from './request';

export class Mistral implements ChatAgent {
    readonly name = 'mistral';
    readonly modelKey = 'MISTRAL_CHAT_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.MISTRAL_API_KEY);
    };

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.MISTRAL_CHAT_MODEL;
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const model = await createLlmModel(this.model(context), context);
        return requestChatCompletionsV2(await warpLLMParams({
            model,
            messages: params.messages,
            cache: params.cache,
        }, context), onStream);
    };

    readonly models = async (context: AgentUserConfig): Promise<string[]> => {
        const headers = {
            Authorization: `Bearer ${context.MISTRAL_API_KEY ?? ''}`,
        };
        const models = await fetch(context.MISTRAL_MODELS_API, { headers }).then(res => res.json());
        return models.data.map((model: any) => model.id);
    };
}
