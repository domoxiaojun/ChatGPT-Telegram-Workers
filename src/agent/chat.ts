import type { WorkerContext } from '../config/context';
import { ENV } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, CompletionData, HistoryItem, HistoryModifier, ImageResult, LLMChatRequestParams } from './types';

/**
 * @returns {(function(string): number)}
 */
function tokensCounter(): (text: string) => number {
    return (text) => {
        return text.length;
    };
}

export async function loadHistory(key: string): Promise<HistoryItem[]> {
    // 加载历史记录
    let history = [];
    try {
        history = JSON.parse(await ENV.DATABASE.get(key));
    } catch (e) {
        console.error(e);
    }
    if (!history || !Array.isArray(history)) {
        history = [];
    }

    const counter = tokensCounter();

    const trimHistory = (list: HistoryItem[], initLength: number, maxLength: number, maxToken: number) => {
    // 历史记录超出长度需要裁剪, 小于0不裁剪
        if (maxLength >= 0 && list.length > maxLength) {
            list = list.splice(list.length - maxLength);
        }
        // 处理token长度问题, 小于0不裁剪
        if (maxToken > 0) {
            let tokenLength = initLength;
            for (let i = list.length - 1; i >= 0; i--) {
                const historyItem = list[i];
                let length = 0;
                if (historyItem.content) {
                    length = counter(historyItem.content);
                } else {
                    historyItem.content = '';
                }
                // 如果最大长度超过maxToken,裁剪history
                tokenLength += length;
                if (tokenLength > maxToken) {
                    list = list.splice(i + 1);
                    break;
                }
            }
        }
        return list;
    };

    // 裁剪
    if (ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH > 0) {
        history = trimHistory(history, 0, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
    }

    return history;
}

export type StreamResultHandler = (text: string) => Promise<any>;

export async function requestCompletionsFromLLM(params: LLMChatRequestParams, context: WorkerContext, agent: ChatAgent, modifier: HistoryModifier | null, onStream: ChatStreamTextHandler | null): Promise<CompletionData> {
    let history = context.MIDDEL_CONTEXT.history;
    if (modifier) {
        const modifierData = modifier(history, params.message || null);
        history = modifierData.history;
        params.message = modifierData.message || '';
    }

    const extra_params = params.extra_params || {};
    let prompt = context.USER_CONFIG.SYSTEM_INIT_MESSAGE;
    if (extra_params.prompt) {
        prompt = context.USER_CONFIG.PROMPT[extra_params.prompt] || extra_params.prompt;
    }

    const llmParams = {
        message: params.message,
        images: params.images,
        prompt,
        model: extra_params.model,
        history,
    };
    const answer = await agent.request(llmParams, context.USER_CONFIG, onStream);
    context.MIDDEL_CONTEXT.history.push({ role: 'assistant', ...answer });
    return answer;
}

export async function requestText2Image(url: string, headers: Record<string, any>, body: any, render: (arg: Response) => Promise<ImageResult>) {
    console.log('start generate image.');
    const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
    const result = await render(resp);
    if (result.message) {
        throw new Error(result.message);
    }
    return result;
}

// function renderPic2PicResult(context: { USER_CONFIG: { AI_IMAGE_PROVIDER: any } }, resp: { images: any[]; message: any }) {
//     switch (context.USER_CONFIG.AI_IMAGE_PROVIDER) {
//         case 'silicon':
//             return { type: 'image', url: resp?.images?.map((i: { url: any }) => i?.url), message: resp.message };
//     }
// }
