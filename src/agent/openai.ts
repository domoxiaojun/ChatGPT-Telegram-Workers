import type { ImageModelV3 } from '@ai-sdk/provider';
import type { UserModelMessage } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { ASRAgent, ChatAgent, ChatStreamTextHandler, GeneratedImage, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage, TTSAgent } from './types';
import { createOpenAI } from '@ai-sdk/openai';
import { generateImage } from 'ai';
import { log, withLogger } from '../log';
import { base64StringToBlob } from '../utils/image';
import { requestText2Image } from './image';
import { selectKey } from './key-manager';
import { createLlmModel } from './llm';
import { warpLLMParams } from './model_middleware';
import { requestChatCompletionsV2 } from './request';

export class OpenAIBase {
    readonly name = 'openai';
    readonly enable = (context: AgentUserConfig): boolean => {
        return context.OPENAI_API_KEY.length > 0;
    };

    apikey = (context: AgentUserConfig): string => {
        return selectKey('openai', context.OPENAI_API_KEY) || '';
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

export class OpenAIImage extends OpenAIBase implements ImageAgent {
    readonly modelKey = 'OPENAI_IMAGE_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.OPENAI_IMAGE_MODEL;
    };

    request = withLogger(async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const {
            n = extraParams?.quantity ?? context.OPENAI_IMAGE_N,
            referenceImages,
            mask,
        } = extraParams || {};

        const modelId = extraParams?.model || context.OPENAI_IMAGE_MODEL;

        const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
        const actualSize = resolveOpenAIImageSize(context, extraParams || {});
        const openAIImageOptions = buildOpenAIImageOptions(context, extraParams || {});

        if (isEditMode) {
            const generatePrompt = referenceImages && referenceImages.length > 0
                ? { text: prompt, images: referenceImages, ...(mask && { mask }) }
                : prompt;

            const { images } = await generateImage({
                model: createOpenAI({
                    apiKey: this.apikey(context),
                    baseURL: context.OPENAI_API_BASE,
                }).image(modelId) as unknown as ImageModelV3,
                prompt: generatePrompt,
                n,
                size: actualSize as any,
                ...(Object.keys(openAIImageOptions).length > 0
                    ? { providerOptions: { openai: openAIImageOptions } }
                    : {}),
            });

            return {
                raw: images.map(img => new Blob([Buffer.from(img.uint8Array)], { type: 'image/png' })),
                text: prompt,
            };
        }

        const url = `${context.OPENAI_API_BASE}/images/generations`;
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apikey(context)}`,
        };
        const body: any = {
            prompt,
            n,
            model: modelId,
            size: actualSize,
        };
        Object.assign(body, toOpenAIImageRequestOptions(openAIImageOptions), context.OPENAI_IMAGE_EXTRA_PARAMS);
        return requestText2Image(url, header, body, this.render);
    });

    readonly render = renderImage;
}

function buildOpenAIImageOptions(context: AgentUserConfig, extraParams: Record<string, any>): Record<string, any> {
    const outputFormat = extraParams.outputFormat ?? extraParams.output_format ?? context.OPENAI_IMAGE_OUTPUT_FORMAT;
    const outputCompression = extraParams.outputCompression ?? extraParams.output_compression ?? context.OPENAI_IMAGE_OUTPUT_COMPRESSION;
    const inputFidelity = extraParams.inputFidelity ?? extraParams.input_fidelity ?? context.OPENAI_IMAGE_INPUT_FIDELITY;
    const quality = extraParams.quality ?? context.OPENAI_IMAGE_QUALITY;
    const moderation = extraParams.moderation ?? context.OPENAI_IMAGE_MODERATION;

    return removeUndefinedValues({
        background: extraParams.background ?? context.OPENAI_IMAGE_BACKGROUND,
        inputFidelity,
        moderation,
        outputCompression,
        outputFormat,
        quality,
    });
}

function resolveOpenAIImageSize(context: AgentUserConfig, extraParams: Record<string, any>): string {
    const size = extraParams.size ?? context.OPENAI_IMAGE_SIZE;
    if (typeof size === 'string' && size !== '' && size !== 'auto') {
        return normalizeOpenAIImageSize(size);
    }
    const ratio = extraParams.ratio ?? extraParams.radio;
    if (ratio && ratio !== 'auto') {
        return aspectRatioToOpenAIImageSize(ratio);
    }
    return size || 'auto';
}

function normalizeOpenAIImageSize(size: string): string {
    if (size === '1792x1024')
        return '1536x1024';
    if (size === '1024x1792')
        return '1024x1536';
    return size;
}

function aspectRatioToOpenAIImageSize(ratio: string): string {
    switch (ratio) {
        case '16:9':
        case '3:2':
        case 'landscape':
            return '1536x1024';
        case '9:16':
        case '2:3':
        case 'portrait':
            return '1024x1536';
        case '1:1':
        case 'square':
        default:
            return '1024x1024';
    }
}

function toOpenAIImageRequestOptions(options: Record<string, any>): Record<string, any> {
    return removeUndefinedValues({
        background: options.background,
        input_fidelity: options.inputFidelity,
        output_compression: options.outputCompression,
        output_format: options.outputFormat,
        moderation: options.moderation,
        quality: options.quality,
    });
}

function removeUndefinedValues<T extends Record<string, any>>(value: T): T {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

export class OpenAIASR extends OpenAIBase implements ASRAgent {
    readonly modelKey = 'OPENAI_STT_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.OPENAI_STT_MODEL;
    };

    request = withLogger(async (audio: Blob, context: AgentUserConfig): Promise<string> => {
        const url = `${context.OPENAI_API_BASE}/audio/transcriptions`;
        const header = {
            Authorization: `Bearer ${this.apikey(context)}`,
            Accept: 'application/json',
        };
        const formData = new FormData();
        formData.append('file', audio, 'audio.ogg');
        formData.append('model', context.OPENAI_STT_MODEL);
        if (context.OPENAI_STT_EXTRA_PARAMS) {
            Object.entries(context.OPENAI_STT_EXTRA_PARAMS).forEach(([k, v]) => {
                formData.append(k, String(v));
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
    });
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
    if (Array.isArray(response)) {
        const image_type = typeof response[0] === 'string' ? 'url' : 'raw';
        const data = image_type === 'url'
            ? response as string[]
            : response.map(img => new Blob([Buffer.from((img as GeneratedImage).uint8Array)], { type: 'image/png' }));
        return { [image_type]: data, text: prompt };
    }

    const resp = response as Response;
    if (!resp.ok) {
        throw new Error(await formatImageApiError(resp));
    }

    const respTextClone = resp.clone();
    const respJson = await resp.json().catch(async () => {
        const contentType = resp.headers.get('content-type') || '';
        const bodyText = await readResponseText(respTextClone);
        const responseType = contentType.includes('application/json') ? 'invalid JSON' : 'non-JSON';
        throw new Error(`Image API returned ${responseType} response (${formatResponseStatus(resp)}): ${sanitizeResponseText(bodyText) || 'empty response body'}`);
    });
    if (respJson.error?.message) {
        throw new Error(respJson.error.message);
    }

    if (!Array.isArray(respJson.data) || respJson.data.length === 0) {
        throw new Error(`Image API response missing image data: ${sanitizeResponseText(JSON.stringify(respJson))}`);
    }

    const image_type = respJson.data?.[0]?.b64_json ? 'b64' : 'url';
    let data: (string | Blob)[] = [];
    respJson.data?.forEach(({ url, b64_json }: { url: string; b64_json: string }) => data.push(url ?? (b64_json)));
    if (image_type === 'b64') {
        data = await Promise.all(data.map(b64_json => base64StringToBlob(b64_json as string)));
    }
    return { [image_type === 'b64' ? 'raw' : 'url']: data, text: prompt };
};

async function formatImageApiError(resp: Response): Promise<string> {
    const bodyText = await readResponseText(resp);
    const jsonError = parseJsonErrorMessage(bodyText);
    const cloudflareHost = extractCloudflareHost(bodyText);
    const host = cloudflareHost || extractHost(resp.url);
    const hostPart = host ? ` from ${host}` : '';

    if (isGatewayTimeout(resp, bodyText)) {
        return [
            `Image API upstream timeout (${formatResponseStatus(resp)}${hostPart}).`,
            'The configured image API endpoint or proxy did not return before the gateway timed out.',
            'Check AI_IMAGE_PROVIDER and OPENAI_API_BASE/OAILIKE_API_BASE, and confirm the upstream supports /images/generations.',
            jsonError || sanitizeResponseText(bodyText),
        ].filter(Boolean).join(' ');
    }

    const detail = jsonError || sanitizeResponseText(bodyText) || 'empty response body';
    return `Image API request failed (${formatResponseStatus(resp)}${hostPart}): ${detail}`;
}

async function readResponseText(resp: Response): Promise<string> {
    try {
        return await resp.text();
    } catch (error: any) {
        return `failed to read response body: ${error?.message || String(error)}`;
    }
}

function formatResponseStatus(resp: Response): string {
    return `${resp.status} ${resp.statusText || 'Unknown'}`.trim();
}

function parseJsonErrorMessage(text: string): string | null {
    try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.error === 'string') {
            return parsed.error;
        }
        if (typeof parsed?.error?.message === 'string') {
            return parsed.error.message;
        }
        if (typeof parsed?.message === 'string') {
            return parsed.message;
        }
    } catch {
        return null;
    }
    return null;
}

function isGatewayTimeout(resp: Response, bodyText: string): boolean {
    const normalizedText = bodyText.toLowerCase();
    return resp.status === 504
        || normalizedText.includes('gateway time-out')
        || normalizedText.includes('gateway timeout')
        || (resp.status >= 500 && normalizedText.includes('cloudflare'));
}

function extractCloudflareHost(text: string): string | null {
    const match = text.match(/id=["']cf-host-status["'][\s\S]*?<span[^>]*>\s*([^<]+?)\s*<\/span>/i);
    return match?.[1]?.trim() || null;
}

function extractHost(url: string): string | null {
    try {
        return new URL(url).host;
    } catch {
        return null;
    }
}

function sanitizeResponseText(text: string, maxLength = 500): string {
    return text
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#38;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}
