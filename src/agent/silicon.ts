import type { AgentUserConfig } from '../config/env';
import { Log } from '../extra/log/logDecortor';
import type { ChatAgent, ChatStreamTextHandler, CompletionData, HistoryItem, ImageAgent, ImageResult, LLMChatParams } from './types';
import { requestChatCompletions } from './request';
import { requestText2Image } from './chat';
import { renderOpenAIMessage } from './openai';

class SiliconBase {
    readonly name = 'silicon';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!context.MISTRAL_API_KEY;
    };
}

export class Silicon extends SiliconBase implements ChatAgent {
    readonly modelKey = 'SILICON_CHAT_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!context.SILICON_API_KEY;
    };

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.SILICON_CHAT_MODEL;
    };

    private render = async (item: HistoryItem): Promise<any> => {
        return renderOpenAIMessage(item);
    };

    @Log
    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<CompletionData> => {
        const { prompt, history, extra_params } = params;
        const url = `${context.SILICON_API_BASE}/chat/completions`;
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.SILICON_API_KEY}`,
        };

        const messages = [...(history || [])];

        if (prompt) {
            if (messages[0]?.role === 'tool') {
                messages.shift();
            }
            messages.unshift({ role: context.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
        }

        const body: Record<string, any> = {
            model: context.SILICON_CHAT_MODEL,
            messages: await Promise.all(messages.map(this.render)),
            ...(context.ENABLE_SHOWTOKEN && { stream_options: { include_usage: true } }),
            stream: !!onStream,
            ...extra_params,
        };

        return requestChatCompletions(url, header, body, onStream);
    };
}

export class SiliconImage extends SiliconBase implements ImageAgent {
    readonly modelKey = 'SILICON_IMAGE_MODEL';

    model = (ctx: AgentUserConfig): string => {
        return ctx.SILICON_IMAGE_MODEL;
    };

    @Log
    request = async (prompt: string, context: AgentUserConfig): Promise<ImageResult> => {
        const url = `${context.SILICON_API_BASE}/image/generations`;
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.SILICON_API_KEY}`,
        };
        const body: any = {
            prompt,
            image_size: context.SILICON_IMAGE_SIZE,
            model: context.SILICON_IMAGE_MODEL,
            // num_inference_steps: 10,
            batch_size: 4,
            ...context.SILICON_EXTRA_PARAMS,
        };
        return requestText2Image(url, header, body, this.render);
    };

    render = async (response: Response): Promise<ImageResult> => {
        if (response.status !== 200)
            return { type: 'image', message: await response.text() };
        const resp = await response.json();
        if (resp.message) {
            return { type: 'image', message: resp.message };
        }
        return { type: 'image', url: (await resp?.images)?.map((i: { url: any }) => i?.url) };
    };
}
