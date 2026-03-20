import type { AgentUserConfig } from '../config/env';
import type { SseChatCompatibleOptions } from './request';
import type { ChatAgent, ChatStreamTextHandler, ImageAgent, ImageResult, LLMChatParams, ResponseMessage } from './types';
import { withLogger } from '../log';
import { base64StringToBlob } from '../utils/image';
import { isJsonResponse, requestChatCompletions } from './request';

class WorkerBase {
    readonly name = 'workers';
    readonly run = async (model: string, body: any, id: string, token: string): Promise<Response> => {
        return await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`,
            {
                headers: { Authorization: `Bearer ${token}` },
                method: 'POST',
                body: JSON.stringify(body),
            },
        );
    };

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.CLOUDFLARE_ACCOUNT_ID && context.CLOUDFLARE_TOKEN);
    };
}

export class WorkersChat extends WorkerBase implements ChatAgent {
    readonly modelKey = 'WORKERS_CHAT_MODEL';

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.WORKERS_CHAT_MODEL;
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> => {
        const { messages, prompt } = params;
        const id = context.CLOUDFLARE_ACCOUNT_ID;
        const token = context.CLOUDFLARE_TOKEN;
        const model = context.WORKERS_CHAT_MODEL;
        const url = `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`;
        const header = {
            Authorization: `Bearer ${token}`,
        };

        const reqMessages = messages.map((raw) => {
            return {
                role: raw.role,
                content: raw.content,
            };
        });
        if (prompt) {
            reqMessages.unshift({ role: 'system', content: prompt });
        }

        const body = {
            messages: reqMessages,
            stream: onStream !== null,
        };

        const options: SseChatCompatibleOptions = {};
        options.contentExtractor = function (data: any) {
            return data?.response;
        };
        options.fullContentExtractor = function (data: any) {
            return data?.result?.response;
        };
        options.errorExtractor = function (data: any) {
            return data?.errors?.[0]?.message;
        };
        const text = await requestChatCompletions(url, header, body, onStream, null, options);
        return {
            messages: [
                {
                    role: 'assistant',
                    content: text,
                },
            ],
            content: text,
        };
    };
}

export class WorkersImage extends WorkerBase implements ImageAgent {
    readonly modelKey = 'WORKERS_IMAGE_MODEL';

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.WORKERS_IMAGE_MODEL;
    };

    readonly request = withLogger(async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const id = context.CLOUDFLARE_ACCOUNT_ID;
        const token = context.CLOUDFLARE_TOKEN;
        if (!id || !token) {
            throw new Error('Cloudflare account ID or token is not set');
        }
        const raw = await this.run(context.WORKERS_IMAGE_MODEL, { prompt, ...extraParams }, id, token);
        if (isJsonResponse(raw)) {
            const { result } = await raw.json();
            const image = result?.image;
            if (typeof image !== 'string') {
                throw new TypeError('Invalid image response');
            }
            return { raw: [await base64StringToBlob(image)] };
        }
        return { raw: [await raw.blob()], text: prompt };
    });
}
