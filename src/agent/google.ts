import type { CoreUserMessage, FilePart, ImagePart, UserContent } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, GeneratedImage, ImageAgent, ImageResult, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { getLogSingleton, Logger } from '../log';
import { base64StringToBlob } from '../utils/image';
import { createLlmModel } from './llm';
import { warpLLMParams } from './model_middleware';
import { requestChatCompletionsV2 } from './request';

class GoogleBase {
    readonly name = 'google';
    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.GOOGLE_API_KEY);
    };

    readonly model = (ctx: AgentUserConfig, params?: LLMChatRequestParams): string => {
        const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : 'text';
        switch (msgType) {
            case 'image':
                return ctx.GOOGLE_VISION_MODEL;
            case 'file':
            default:
                return ctx.GOOGLE_CHAT_MODEL;
        }
    };
}

export class Google extends GoogleBase implements ChatAgent {
    readonly modelKey = 'GOOGLE_CHAT_MODEL';

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const userMessage = handleUrl(params.messages.at(-1) as CoreUserMessage);
        const model = await createLlmModel(this.model(context, userMessage), context);
        return requestChatCompletionsV2(await warpLLMParams({
            model,
            messages: params.messages,
            cache: params.cache,
        }, context), onStream);
    };
}

export class GoogleImage extends GoogleBase implements ImageAgent {
    readonly modelKey = 'GOOGLE_IMAGE_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.GOOGLE_IMAGE_MODEL;
    };

    @Logger
    request = async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        if (prompt.trim() === '') {
            throw new Error('Please provide a prompt.');
        }

        const { referenceImage } = extraParams || {};
        const url = `${context.GOOGLE_API_BASE}/models/${this.model(context)}:generateContent?key=${context.GOOGLE_API_KEY}`;
        const body = {
            contents: [{
                parts: [{
                    text: prompt,
                }],
            }],
            generation_config: {
                response_modalities: ['text', 'image'],
            },
            safety_settings: [
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
            ],
        } as any;

        if (referenceImage && referenceImage.length > 0) {
            const isUri = typeof referenceImage[0] === 'string' && referenceImage[0].startsWith('http');
            const type = isUri ? 'fileUri' : 'data';
            const dataType = isUri ? 'fileData' : 'inlineData';
            body.contents[0].parts.push(...referenceImage.map((i: any) => ({
                [dataType]: {
                    mimeType: 'image/jpeg',
                    [type]: i,
                },
            })));
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const resp = await response.text();
            throw new Error(`${response.status} ${response.statusText}\n${resp}`);
        }
        const result = await response.json();
        const data = result.candidates?.[0]?.content?.parts || [];
        if (data.length === 0) {
            throw new Error(`Data is null:\n${JSON.stringify(result)}`);
        }
        const images = data.filter((i: any) => i.inlineData !== undefined);
        const text = data.map((i: any) => i.text || '').join('');
        if (images.length === 0) {
            throw new Error(`No images found:\n${text || JSON.stringify(data)}`);
        }

        if (data.usageMetadata) {
            const log = getLogSingleton(context);
            log.chat.model.add(data.modelVersion || this.model(context));
            log.tokens.push(`${data.usageMetadata.promptTokenCount},0`);
        }
        return this.render(images, text || prompt);
    };

    readonly render = async (result: Response | GeneratedImage[] | any[], prompt: string): Promise<ImageResult> => {
        const images = result as { inlineData: { mimeType: string; data: string } }[];
        return {
            type: 'image',
            raw: await Promise.all(images.map(({ inlineData: { data } }) => base64StringToBlob(data))),
            caption: [prompt],
        };
    };
}

export function handleUrl(messages: CoreUserMessage, isVertex: boolean = false): CoreUserMessage {
    if (typeof messages.content === 'string') {
        const { data = [], text } = extractUrls(messages.content, isVertex);
        if (data.length > 0) {
            const newMessage: UserContent = [];
            newMessage.push({
                type: 'text',
                text,
            });
            data.forEach(i => newMessage.push({
                type: i.type as 'image' | 'file',
                [i.type === 'image' ? 'url' : 'data']: i.url,
                mimeType: i.mimeType,
            } as unknown as FilePart | ImagePart));
            messages.content = newMessage;
        }
    }
    return messages;
}

function extractUrls(str: string, isVertex = false): { data?: { type: string; url: string; mimeType: string }[]; text: string } {
    const supportTypes = {
        pdf: 'application/pdf',
        mp3: 'audio/mpeg',
        aac: 'audio/aac',
        flac: 'audio/flac',
        ogg: 'audio/ogg',
        wav: 'audio/wav',
        mp4: 'video/mp4',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        js: 'text/javascript',
        py: 'text/x-python',
        css: 'text/css',
        xml: 'application/xml',
        csv: 'text/csv',
        rtf: 'text/rtf',
        txt: 'text/plain',
        md: 'text/markdown',
    };
    const urlRegex = new RegExp(`https?://\\S+\\.(${Object.keys(supportTypes).join('|')})`, 'g');
    const matches = [...str.matchAll(urlRegex)];
    if (isVertex) {
        matches.push(...str.matchAll(/https?:\/\/(youtu\.be|www\.youtube\.com)\/.+/g));
    }

    return {
        data: matches.map((i) => {
            const type = i[1] as keyof typeof supportTypes;
            return {
                mimeType: supportTypes[type] || 'video/webm',
                url: i[0],
                type: supportTypes[type]?.startsWith('image') ? 'image' : 'file',
            };
        }),
        text: str.replace(urlRegex, '').trim(),
    };
}
