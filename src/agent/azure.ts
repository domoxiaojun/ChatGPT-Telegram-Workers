import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, CompletionData, ImageAgent, ImageResult, LLMChatParams } from './types';
import { Log } from '../extra/log/logDecortor';
import { requestText2Image } from './chat';
import { renderOpenAIMessage } from './openai';
import { requestChatCompletions } from './request';

class AzureBase {
    readonly name = 'azure';
    readonly modelFromURI = (uri: string | null): string => {
        if (!uri) {
            return '';
        }
        try {
            const url = new URL(uri);
            return url.pathname.split('/')[3];
        } catch {
            return uri;
        }
    };
}

export class AzureChatAI extends AzureBase implements ChatAgent {
    readonly modelKey = 'AZURE_COMPLETIONS_API';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.AZURE_API_KEY && context.AZURE_COMPLETIONS_API);
    };

    readonly model = (ctx: AgentUserConfig) => {
        return this.modelFromURI(ctx.AZURE_COMPLETIONS_API);
    };

    @Log
    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<CompletionData> => {
        const { prompt, history } = params;
        const url = context.AZURE_COMPLETIONS_API;
        if (!url || !context.AZURE_API_KEY) {
            throw new Error('Azure Completions API is not set');
        }
        const header = {
            'Content-Type': 'application/json',
            'api-key': context.AZURE_API_KEY,
        };

        const messages = [...(history || [])];
        if (prompt) {
            messages.unshift({ role: context.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
        }

        const body = {
            ...context.OPENAI_API_EXTRA_PARAMS,
            messages: await Promise.all(messages.map(renderOpenAIMessage)),
            stream: onStream != null,
        };

        return requestChatCompletions(url, header, body, onStream);
    };
}

export class AzureImageAI extends AzureBase implements ImageAgent {
    readonly modelKey = 'AZURE_DALLE_API';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.AZURE_API_KEY && context.AZURE_DALLE_API);
    };

    readonly model = (ctx: AgentUserConfig) => {
        return this.modelFromURI(ctx.AZURE_DALLE_API);
    };

    readonly request = async (prompt: string, context: AgentUserConfig): Promise<ImageResult> => {
        const url = context.AZURE_DALLE_API;
        if (!url || !context.AZURE_API_KEY) {
            throw new Error('Azure DALL-E API is not set');
        }
        const header = {
            'Content-Type': 'application/json',
            'api-key': context.AZURE_API_KEY,
        };
        const body = {
            prompt,
            n: 1,
            size: context.DALL_E_IMAGE_SIZE,
            style: context.DALL_E_IMAGE_STYLE,
            quality: context.DALL_E_IMAGE_QUALITY,
        };
        const validSize = ['1792x1024', '1024x1024', '1024x1792'];
        if (!validSize.includes(body.size)) {
            body.size = '1024x1024';
        }
        return requestText2Image(url, header, body, this.render);
    };

    render = async (response: Response): Promise<ImageResult> => {
        const resp = await response.json();
        if (resp.error?.message) {
            throw new Error(resp.error.message);
        }
        return {
            type: 'image',
            url: resp?.data?.map((i: { url: any }) => i?.url),
            text: resp?.data?.[0]?.revised_prompt || '',
        };
    };
}
