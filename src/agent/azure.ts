import type { UserModelMessage } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, GeneratedImage, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { Logger } from '../log';
import { requestText2Image } from './image';
import { selectKey } from './key-manager';
import { createLlmModel } from './llm';
import { warpLLMParams } from './model_middleware';
import { requestChatCompletionsV2 } from './request';

export class AzureChatAI implements ChatAgent {
    readonly name = 'azure';

    readonly modelKey = 'AZURE_CHAT_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return context.AZURE_API_KEY.length > 0 && !!context.AZURE_RESOURCE_NAME && !!context.AZURE_CHAT_MODEL;
    };

    readonly model = (ctx: AgentUserConfig, params?: LLMChatRequestParams): string => {
        const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : 'text';
        switch (msgType) {
            case 'image':
                return ctx.AZURE_VISION_MODEL;
            case 'file':
            default:
                return ctx.AZURE_CHAT_MODEL;
        }
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const modelId = this.model(context, params.messages.at(-1) as UserModelMessage);
        const model = await createLlmModel(modelId, context);
        return requestChatCompletionsV2(await warpLLMParams({
            model,
            messages: params.messages,
            cache: params.cache,
        }, context), onStream);
    };
}

export class AzureImageAI implements ImageAgent {
    readonly name = 'azure';

    readonly modelKey = 'AZURE_IMAGE_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return context.AZURE_API_KEY.length > 0 && !!context.AZURE_RESOURCE_NAME && !!context.AZURE_IMAGE_MODEL;
    };

    readonly model = (ctx: AgentUserConfig) => {
        return ctx.AZURE_IMAGE_MODEL || '';
    };

    @Logger
    readonly request = async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const url = `https://${context.AZURE_RESOURCE_NAME}.openai.azure.com/openai/deployments/${context.AZURE_IMAGE_MODEL}/chat/completions?${context.AZURE_API_VERSION}`;
        const apiKey = selectKey('azure', context.AZURE_API_KEY);
        if (!url || !apiKey) {
            throw new Error('Azure DALL-E API is not set');
        }
        const header = {
            'Content-Type': 'application/json',
            'api-key': apiKey,
        };
        const { n = 1, size, style, quality } = extraParams || {};
        const body = {
            prompt,
            n,
            size: size || context.DALL_E_IMAGE_SIZE,
            style: style || context.DALL_E_IMAGE_STYLE,
            quality: quality || context.DALL_E_IMAGE_QUALITY,
        };
        const validSize = ['1792x1024', '1024x1024', '1024x1792'];
        if (!validSize.includes(body.size)) {
            body.size = '1024x1024';
        }
        return requestText2Image(url, header, body, this.render);
    };

    readonly render = async (response: Response | GeneratedImage[] | string[], prompt: string): Promise<ImageResult> => {
        const resp = await (response as Response).json();
        if (resp.error?.message) {
            throw new Error(resp.error.message);
        }
        return {
            url: resp?.data?.map((i: { url: any }) => i?.url),
            text: resp?.data?.[0]?.revised_prompt || prompt,
        };
    };
}
