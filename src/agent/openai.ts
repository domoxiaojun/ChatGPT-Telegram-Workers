import type { ImageModelV3 } from '@ai-sdk/provider';
import type { UserModelMessage } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { ASRAgent, ChatAgent, ChatStreamTextHandler, GeneratedImage, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage, TTSAgent } from './types';
import { createOpenAI } from '@ai-sdk/openai';
import { generateImage } from 'ai';
import { log, Logger } from '../log';
import { base64StringToBlob } from '../utils';
import { requestText2Image } from './image';
import { createLlmModel } from './llm';
import { warpLLMParams } from './model_middleware';
import { requestChatCompletionsV2 } from './request';

export class OpenAIBase {
    readonly name = 'openai';
    readonly enable = (context: AgentUserConfig): boolean => {
        return context.OPENAI_API_KEY.length > 0;
    };

    apikey = (context: AgentUserConfig): string => {
        const length = context.OPENAI_API_KEY.length;
        return context.OPENAI_API_KEY[Math.floor(Math.random() * length)];
    };
}

export class OpenAI extends OpenAIBase implements ChatAgent {
    readonly modelKey = 'OPENAI_CHAT_MODEL';

    readonly model = (ctx: AgentUserConfig, params?: LLMChatRequestParams): string => {
        const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : 'text';
        switch (msgType) {
            case 'image':
                return ctx.OPENAI_VISION_MODEL;
            case 'file':
                return 'gpt-4o-audio-preview';
            default:
                return ctx.OPENAI_CHAT_MODEL;
        }
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const modelId = this.model(context, params.messages.at(-1) as UserModelMessage);
        const model = await createLlmModel(modelId, context);

        return requestChatCompletionsV2(await warpLLMParams({
            model,
            messages: params.messages,
        }, context), onStream);
    };
}

export class Dalle extends OpenAIBase implements ImageAgent {
    readonly modelKey = 'DALL_E_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.DALL_E_MODEL;
    };

    @Logger
    request = async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const {
            n = 1,
            size = '1024x1024',
            style = 'vivid',
            quality = 'hd',
            referenceImages,
            mask,
        } = extraParams || {};

        const modelId = extraParams?.model || context.DALL_E_MODEL;

        // 智能选择模型：
        // - 编辑模式：只有 dall-e-2 和 gpt-image-* 支持编辑
        // - 生成模式：使用配置的模型
        const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
        const actualModel = isEditMode
            ? (modelId === 'dall-e-3' ? 'dall-e-2' : modelId)  // dall-e-3 不支持编辑，降级到 dall-e-2
            : modelId;

        // 如果是编辑模式，使用新的 AI SDK
        if (isEditMode) {
            // Build prompt
            const generatePrompt = referenceImages && referenceImages.length > 0
                ? { text: prompt, images: referenceImages, ...(mask && { mask }) }
                : prompt;

            const { images } = await generateImage({
                model: createOpenAI({
                    apiKey: this.apikey(context),
                    baseURL: context.OPENAI_API_BASE,
                }).image(actualModel) as unknown as ImageModelV3,
                prompt: generatePrompt,
                n,
                size: size as any,
            });

            return {
                raw: images.map(img => new Blob([Buffer.from(img.uint8Array)], { type: 'image/png' })),
                text: prompt,
            };
        }

        // 纯生成模式：保持原有实现
        const url = `${context.OPENAI_API_BASE}/images/generations`;
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apikey(context)}`,
        };
        const body: any = {
            prompt,
            n,
            model: actualModel,
        };
        if (body.model === 'dall-e-3') {
            body.size = size || context.DALL_E_IMAGE_SIZE;
            body.style = style || context.DALL_E_IMAGE_STYLE;
            body.quality = quality || context.DALL_E_IMAGE_QUALITY;
        }
        return requestText2Image(url, header, body, this.render);
    };

    readonly render = renderImage;
}

export class OpenAIASR extends OpenAIBase implements ASRAgent {
    readonly modelKey = 'OPENAI_STT_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.OPENAI_STT_MODEL;
    };

    @Logger
    request = async (audio: Blob, context: AgentUserConfig): Promise<string> => {
        const url = `${context.OPENAI_API_BASE}/audio/transcriptions`;
        const header = {
            Authorization: `Bearer ${this.apikey(context)}`,
            Accept: 'application/json',
        };
        const formData = new FormData();
        formData.append('file', audio, 'audio.ogg');
        formData.append('model', context.OPENAI_STT_MODEL);
        if (context.OPENAI_STT_EXTRA_PARAMS) {
            Object.entries(context.OPENAI_STT_EXTRA_PARAMS as string).forEach(([k, v]) => {
                formData.append(k, v);
            });
        }
        formData.append('response_format', 'json');
        const resp = await fetch(url, {
            method: 'POST',
            headers: header,
            body: formData,
            redirect: 'follow',
        }).then(res => res.json());

        if (!resp.text) {
            console.error(resp);
            throw new Error(JSON.stringify(resp));
        }
        log.info(`Transcription: ${resp.text}`);
        return resp.text;
    };
}

export class OpenAITTS extends OpenAIBase implements TTSAgent {
    readonly modelKey = 'OPENAI_TTS_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.OPENAI_TTS_MODEL;
    };

    request = async (text: string, context: AgentUserConfig): Promise<Blob> => {
        const url = `${context.OPENAI_API_BASE}/audio/speech`;
        const headers = {
            'Authorization': `Bearer ${this.apikey(context)}`,
            'Content-Type': 'application/json',
        };
        const resp = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: context.OPENAI_TTS_MODEL,
                input: text,
                voice: context.OPENAI_TTS_VOICE,
                response_format: 'opus',
                speed: 1,
                ...context.OPENAI_TTS_EXTRA_PARAMS,
            }),
        });
        if (resp.ok) {
            return resp.blob();
        } else {
            throw new Error(`${resp.status} ${resp.statusText}\n\n${await resp.text()}`);
        }
    };
}

export class OpenAIFM implements TTSAgent {
    readonly modelKey = 'OPENAI_TTS_MODEL';
    readonly name = 'openai-fm';

    model = (ctx: AgentUserConfig): string => {
        return `fm-${ctx.OPENAI_TTS_VOICE}`;
    };

    enable = () => true;

    request = async (text: string, context: AgentUserConfig): Promise<Blob> => {
        const url = `https://www.openai.fm/api/generate`;
        const formData = new FormData();
        formData.append('input', text);
        formData.append('prompt', context.OPENAI_TTS_PROMPT);
        formData.append('voice', context.OPENAI_TTS_VOICE);

        const resp = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        if (resp.ok) {
            return resp.blob();
        } else {
            throw new Error(`${resp.status} ${resp.statusText}\n\n${await resp.text()}`);
        }
    };
}

export async function renderImage(response: Response | GeneratedImage[] | string[], prompt: string): Promise<ImageResult> {
    const resp = response as Response;
    if (!resp.ok)
        throw new Error(await resp.text());
    const respJson = await resp.json();
    if (respJson.error?.message) {
        throw new Error(respJson.error.message);
    }
    const image_type = respJson.data?.[0]?.b64_json ? 'b64' : 'url';
    let data: (string | Blob)[] = [];
    respJson.data?.forEach(({ url, b64_json }: { url: string; b64_json: string }) => data.push(url ?? (b64_json)));
    if (image_type === 'b64') {
        data = await Promise.all(data.map(b64_json => base64StringToBlob(b64_json as string)));
    }
    return { [image_type === 'b64' ? 'raw' : 'url']: data, text: prompt };
};
