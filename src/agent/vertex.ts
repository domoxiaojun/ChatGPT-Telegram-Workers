import type { ImageModelV3 } from '@ai-sdk/provider';
import type { UserModelMessage } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, GeneratedImage, GoogleVertexImageModelId, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { createVertex } from '@ai-sdk/google-vertex';
import { generateImage } from 'ai';  // 使用新的正式 API，不再是 experimental
import { Logger } from '../log';
import { handleUrl } from './google';
import { createLlmModel } from './llm';
import { warpLLMParams } from './model_middleware';
import { requestChatCompletionsV2 } from './request';

class VertexBase {
    readonly name = 'vertex';
    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.VERTEX_PROJECT_ID && context.VERTEX_CREDENTIALS?.client_email && context.VERTEX_CREDENTIALS?.private_key);
    };

    readonly model = (ctx: AgentUserConfig, params?: LLMChatRequestParams): string => {
        const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : 'text';
        switch (msgType) {
            case 'image':
                return ctx.VERTEX_VISION_MODEL;
            case 'file':
            default:
                return ctx.VERTEX_CHAT_MODEL;
        }
    };
}

export class Vertex extends VertexBase implements ChatAgent {
    readonly modelKey = 'VERTEX_CHAT_MODEL';

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const userMessage = handleUrl(params.messages.at(-1) as UserModelMessage);
        const model = await createLlmModel(this.model(context, userMessage), context);
        return requestChatCompletionsV2(await warpLLMParams({
            model,
            messages: params.messages,
            cache: params.cache,
        }, context), onStream);
    };
}

export class VertexImage extends VertexBase implements ImageAgent {
    readonly modelKey = 'VERTEX_IMAGE_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.VERTEX_IMAGE_MODEL;
    };

    @Logger
    request = async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const {
            n = 1,
            radio: aspectRatio = '16:9',
            referenceImages,
            mask,
            // 新增的高级编辑参数
            editMode,
            maskMode,
            maskDilation,
            negativePrompt,
            baseSteps,
        } = extraParams || {};

        // 智能选择模型：
        // - 有 referenceImages 或 mask = 编辑模式 -> 必须用 imagen-3.0-capability-001
        // - 纯生成 -> 使用配置的模型（可以是 imagen-4.0-fast-generate-001）
        const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
        const modelId = isEditMode
            ? 'imagen-3.0-capability-001'  // 编辑：强制使用支持编辑的模型
            : this.model(context);          // 生成：使用配置的模型

        // Build prompt: support both text-only and image editing
        const generatePrompt = referenceImages && referenceImages.length > 0
            ? { text: prompt, images: referenceImages, ...(mask && { mask }) }
            : prompt;

        // Build provider options
        const providerOptions: any = {
            vertex: {
                aspectRatio,
                // personGeneration: 'allow_adult',
                safetyFilterLevel: 'none',
            },
        };

        // 如果是编辑模式（有 referenceImages），添加编辑选项
        if (referenceImages && referenceImages.length > 0) {
            providerOptions.vertex.edit = {
                // 默认使用 INPAINT_INSERTION 模式
                mode: editMode || 'EDIT_MODE_INPAINT_INSERTION',
                // 如果提供了 mask，使用 USER_PROVIDED，否则使用 DEFAULT
                maskMode: maskMode || (mask ? 'MASK_MODE_USER_PROVIDED' : undefined),
                // 可选的 mask dilation（推荐 0.01）
                ...(maskDilation !== undefined && { maskDilation }),
                // 可选的 baseSteps（35-75，越高质量越好）
                ...(baseSteps !== undefined && { baseSteps }),
            };
        }

        // 添加 negative prompt（如果提供）
        if (negativePrompt) {
            providerOptions.vertex.negativePrompt = negativePrompt;
        }

        const { images } = await generateImage({
            model: createVertex({
                project: context.VERTEX_PROJECT_ID!,
                location: context.VERTEX_LOCATION,
                googleAuthOptions: {
                    credentials: context.VERTEX_CREDENTIALS,
                },
            }).image(modelId as GoogleVertexImageModelId) as unknown as ImageModelV3,
            prompt: generatePrompt,
            n,
            providerOptions,
            maxRetries: 0,
        });
        return this.render(images, prompt);
    };

    readonly render = async (result: Response | GeneratedImage[] | string[], prompt: string): Promise<ImageResult> => {
        const images = result as GeneratedImage[];
        if (images.length === 0) {
            throw new Error(`Data is invalid: ${JSON.stringify(images)}`);
        }
        return {
            raw: images.map(({ uint8Array }) => new Blob([Buffer.from(uint8Array)], { type: 'image/png' })),
            text: prompt,
        };
    };
}
