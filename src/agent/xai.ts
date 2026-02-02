import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, GeneratedImage, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { createXai } from '@ai-sdk/xai';
import { generateImage } from 'ai';
import { Logger } from '../log';
import { selectKey } from './key-manager';
import { createLlmModel } from './llm';
import { warpLLMParams } from './model_middleware';
import { requestChatCompletionsV2 } from './request';

export class XAI implements ChatAgent {
    readonly name = 'xai';
    readonly modelKey = 'XAI_CHAT_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return context.XAI_API_KEY.length > 0;
    };

    readonly model = (ctx: AgentUserConfig, params?: LLMChatRequestParams): string => {
        return Array.isArray(params?.content) ? ctx.XAI_VISION_MODEL : ctx.XAI_CHAT_MODEL;
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const model = await createLlmModel(this.model(context), context);
        return requestChatCompletionsV2(await warpLLMParams({
            model,
            messages: params.messages,
            cache: params.cache,
        }, context), onStream);
    };
}

export class XAIImage implements ImageAgent {
    readonly name = 'xai';
    readonly modelKey = 'XAI_IMAGE_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return context.XAI_API_KEY.length > 0;
    };

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.XAI_IMAGE_MODEL || 'grok-2-image';
    };

    @Logger
    request = async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const {
            n = 1,
            referenceImages,
        } = extraParams || {};

        // xAI API 目前只支持文本到图片生成
        // 图片编辑功能仅在网页版可用，API 尚未提供
        if (referenceImages && referenceImages.length > 0) {
            throw new Error('xAI API does not support image editing yet. Image editing is only available on Grok web interface. Use Google, Vertex, or OpenAI for image editing.');
        }

        // 重要：xAI 不支持 size 和 aspectRatio 参数
        // 默认生成 1024x768 的图片
        // 传递 size 或 aspectRatio 会导致 IMAGE_PROCESS_FAILED 错误
        const { images } = await generateImage({
            model: createXai({
                apiKey: selectKey('xai', context.XAI_API_KEY) || undefined,
                baseURL: context.XAI_API_BASE,
            }).image(this.model(context)),
            prompt,
            n,
            // 不传递 size、aspectRatio 等参数，xAI 不支持
        });

        return this.render(images, prompt);
    };

    readonly render = async (result: Response | GeneratedImage[] | string[], prompt: string): Promise<ImageResult> => {
        const images = result as GeneratedImage[];
        if (images.length === 0) {
            throw new Error(`No images generated`);
        }
        return {
            raw: images.map(({ uint8Array }) => new Blob([Buffer.from(uint8Array)], { type: 'image/png' })),
            text: prompt,
        };
    };
}
