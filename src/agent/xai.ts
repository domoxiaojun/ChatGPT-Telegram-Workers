import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { Logger } from '../log';
import { base64StringToBlob } from '../utils';
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
        return !!(context.XAI_API_KEY);
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

        const url = `${context.XAI_API_BASE}/images/generations`;
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.XAI_API_KEY}`,
        };

        const body: any = {
            model: this.model(context),
            prompt,
            n,
        };

        // 如果有引用图片，xAI 支持图片编辑（image-to-image）
        // 根据官方文档，Aurora 支持 multimodal 输入
        if (referenceImages && referenceImages.length > 0) {
            // xAI API 支持 image 参数进行 image-to-image 生成/编辑
            body.image = referenceImages[0];  // 目前使用第一张图片
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`xAI API error: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const result = await response.json();

        // xAI 返回格式：{ data: [{ b64_json: "..." }] }
        const images = result.data || [];
        if (images.length === 0) {
            throw new Error(`No images generated: ${JSON.stringify(result)}`);
        }

        return {
            raw: await Promise.all(
                images.map(async (img: any) =>
                    base64StringToBlob(img.b64_json || img.url)
                )
            ),
            text: prompt,
        };
    };
}
