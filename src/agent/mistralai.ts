import type { AgentUserConfig } from '../config/env';
import { Log } from '../extra/log/logDecortor';
import type { ChatAgent, ChatStreamTextHandler, CompletionData, HistoryItem, LLMChatParams } from './types';
import { requestChatCompletions } from './request';

export class Mistral implements ChatAgent {
    readonly name = 'mistral';
    readonly modelKey = 'MISTRAL_CHAT_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.MISTRAL_API_KEY);
    };

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.MISTRAL_CHAT_MODEL;
    };

    private render = (item: HistoryItem): any => {
        return {
            role: item.role,
            content: item.content,
        };
    };

    @Log
    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<CompletionData> => {
        const { prompt, history } = params;
        const url = `${context.MISTRAL_API_BASE}/chat/completions`;
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.MISTRAL_API_KEY}`,
        };

        const messages = [...(history || [])];
        if (prompt) {
            messages.unshift({ role: context.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
        }

        const body = {
            model: context.MISTRAL_CHAT_MODEL,
            messages: messages.map(this.render),
            stream: onStream != null,
        };

        return requestChatCompletions(url, header, body, onStream);
    };
}
