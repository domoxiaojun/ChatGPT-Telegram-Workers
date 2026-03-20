import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, GeneratedImage, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { createXai } from '@ai-sdk/xai';
import { experimental_generateVideo as generateVideo, generateImage } from 'ai';
import { withLogger } from '../log';
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
        return ctx.XAI_IMAGE_MODEL || 'grok-imagine-image';
    };

    request = withLogger(async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const {
            n = 1,
            referenceImages,
            aspectRatio,
        } = extraParams || {};

        const xaiClient = createXai({
            apiKey: selectKey('xai', context.XAI_API_KEY) || undefined,
            baseURL: context.XAI_API_BASE,
        });

        // 支持图片编辑（Image-to-Image）
        if (referenceImages && referenceImages.length > 0) {
            const result = await generateImage({
                model: xaiClient.image(this.model(context)),
                prompt: {
                    text: prompt,
                    images: referenceImages,
                },
                n,
                ...(aspectRatio && { aspectRatio }),
            });

            const revisedPrompt = (result.providerMetadata?.xai?.images as any)?.[0]?.revisedPrompt;
            return this.render(result.images, revisedPrompt || prompt);
        }

        // 文本到图片生成（Text-to-Image）
        const result = await generateImage({
            model: xaiClient.image(this.model(context)),
            prompt,
            n,
            ...(aspectRatio && { aspectRatio }),
        });

        const revisedPrompt = (result.providerMetadata?.xai?.images as any)?.[0]?.revisedPrompt;
        return this.render(result.images, revisedPrompt || prompt);
    });

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
