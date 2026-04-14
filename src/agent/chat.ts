/* eslint-disable unused-imports/no-unused-vars */
import type { ModelMessage } from 'ai';
import type { WorkerContext } from '../config/context';
import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, ChatStreamTextHandler, HistoryItem, HistoryModifier, LLMChatParams, LLMChatRequestParams, ResponseMessage } from './types';
import { loadChatLLM } from '.';
import { ENV } from '../config/env';
import { log } from '../log/logger';
import { ContextCompressor } from './context_compressor';

// 全局上下文压缩器实例（每个会话一个）
const compressorCache = new Map<string, ContextCompressor>();

/**
 * 获取或创建上下文压缩器
 */
function getContextCompressor(historyKey: string, context: AgentUserConfig): ContextCompressor {
    if (!compressorCache.has(historyKey)) {
        const compressor = new ContextCompressor({
            enabled: context.ENABLE_CONTEXT_COMPRESSION,
            thresholdPercent: context.CONTEXT_COMPRESSION_THRESHOLD,
            protectFirstN: context.CONTEXT_COMPRESSION_PROTECT_HEAD,
            tailTokenBudget: context.CONTEXT_COMPRESSION_TAIL_BUDGET,
            summaryTargetRatio: context.CONTEXT_COMPRESSION_SUMMARY_RATIO,
        });
        compressorCache.set(historyKey, compressor);
    }
    return compressorCache.get(historyKey)!;
}

export async function loadHistory(key: string, length: number): Promise<HistoryItem[]> {
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

    const trimHistory = (list: HistoryItem[], maxLength: number) => {
        // 历史记录超出长度需要裁剪, 小于0不裁剪
        if (maxLength >= 0 && list.length > maxLength) {
            list = list.splice(list.length - maxLength);
        }
        return list;
    };

    // 裁剪
    if (ENV.AUTO_TRIM_HISTORY) {
        history = trimHistory(history, length);
        // 裁剪开始的tool result 以避免报错
        // let validStart = 0;
        // for (const h of history) {
        //     if (h.role === 'tool') {
        //         validStart++;
        //         continue;
        //     }
        //     break;
        // }
        // history = history.slice(validStart);
    }

    return history;
}

export async function requestCompletionsFromLLM(params: LLMChatRequestParams | null, context: WorkerContext, agent: ChatAgent, modifier: HistoryModifier | null, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> {
    let history = context.MIDDLE_CONTEXT.history;
    const historyDisable = ENV.STORE_HISTORY_LENGTH <= 0;
    if (modifier) {
        const modifierData = modifier(history, params);
        history = modifierData.history;
        params = modifierData.message;
    }
    if (params === null) {
        throw new Error('Message is null');
    }

    const trimer = (list: HistoryItem[], maxLength: number) => {
        // 裁剪超出上下文长度的历史消息
        if (list.length > 0 && list.length > maxLength) {
            list = list.slice(list.length - maxLength);
        }

        // 裁剪开始的tool result 以避免报错
        let validStart = 0;
        for (const h of list) {
            if (h.role === 'tool') {
                validStart++;
                continue;
            }
            break;
        }
        return list.slice(validStart);
    };

    // 裁剪历史记录
    let trimmedHistory = trimer(history, context.USER_CONFIG.MAX_HISTORY_LENGTH);

    // 智能上下文压缩
    if (context.USER_CONFIG.ENABLE_CONTEXT_COMPRESSION) {
        const compressor = getContextCompressor(
            context.SHARE_CONTEXT.chatHistoryKey,
            context.USER_CONFIG
        );

        // 获取当前模型的上下文长度
        // 这里使用一个合理的默认值，你可以根据实际模型调整
        const contextLength = getModelContextLength(context.USER_CONFIG);

        // 检查是否需要压缩
        if (compressor.shouldCompress(trimmedHistory, contextLength)) {
            log.info('[CONTEXT COMPRESSION] Triggering intelligent context compression');
            trimmedHistory = await compressor.compress(
                trimmedHistory,
                contextLength,
                context.USER_CONFIG
            );
        }
    }

    // 注入群组缓存（如果存在）
    // 群组缓存应该在裁剪后注入，避免被 trimer 裁剪掉
    const groupChatCache = (context.MIDDLE_CONTEXT as any).groupChatCache;
    if (groupChatCache) {
        // 查找第一个非 system 消息的位置
        let insertIndex = 0;
        for (let i = 0; i < trimmedHistory.length; i++) {
            if (trimmedHistory[i].role !== 'system') {
                insertIndex = i;
                break;
            }
        }

        // 在第一个非 system 消息之前插入群组缓存
        trimmedHistory.splice(insertIndex, 0, {
            role: 'user',
            content: `[Group Chat Context]\n${groupChatCache}`,
        });

        log.info(`[GROUP CACHE] Injected group cache into trimmed history at position ${insertIndex}`);
    }

    const messages = [...trimmedHistory, params];
    const llmParams: LLMChatParams = {
        messages: injectSystemMessage(messages, context.USER_CONFIG.SYSTEM_INIT_MESSAGE, context.USER_CONFIG.TIMEZONE),
        cache: [],
    };
    const answer = await workflow(agent, llmParams, context.USER_CONFIG, onStream);
    const { messages: raw_messages } = answer;

    if (!historyDisable && raw_messages.at(-1)?.role === 'assistant') {
        // only push valid chat history
        history.push(params);
        // last message cannot be tool-call
        let validEnd = raw_messages.length;
        for (const m of raw_messages) {
            if (m.role === 'assistant' && Array.isArray(m.content)) {
                // ai 5.0.0-beta.9 contain too many empty reasoning content
                m.content = m.content.filter((i: any) => {
                    if (i.type === 'reasoning')
                        return i.text !== '';
                    return true;
                });
            }
        }
        // When the last message is tool call message, delete it.
        for (const m of raw_messages.toReversed()) {
            if (m.role === 'assistant' && Array.isArray(m.content) && m.content.find((i: any) => i.type === 'tool-call')) {
                validEnd--;
                continue;
            }
            break;
        }
        history.push(...raw_messages.slice(0, validEnd));
        await storeHistory(history, context);
    }
    return answer;
}

/**
 * 获取模型的上下文长度
 */
function getModelContextLength(config: AgentUserConfig): number {
    const provider = config.AI_CHAT_PROVIDER;
    const model = config[`${provider.toUpperCase()}_CHAT_MODEL`] || '';

    // 常见模型的上下文长度
    const contextLengths: Record<string, number> = {
        // OpenAI
        'gpt-4': 8192,
        'gpt-4-32k': 32768,
        'gpt-4-turbo': 128000,
        'gpt-4o': 128000,
        'gpt-4o-mini': 128000,
        'gpt-3.5-turbo': 16385,
        'gpt-3.5-turbo-16k': 16385,
        'o1': 200000,
        'o1-mini': 128000,
        'o3-mini': 200000,

        // Anthropic
        'claude-3-opus': 200000,
        'claude-3-sonnet': 200000,
        'claude-3-haiku': 200000,
        'claude-3-5-sonnet': 200000,
        'claude-3-5-haiku': 200000,

        // Google Gemini
        'gemini-pro': 32768,
        'gemini-1.5-pro': 2097152,
        'gemini-1.5-flash': 1048576,
        'gemini-2.0-flash': 1048576,
        'gemini-3-flash-preview': 1048576,  // Gemini 3 Flash Preview
        'gemini-exp': 2097152,

        // xAI
        'grok-beta': 131072,
        'grok-2': 131072,

        // Mistral
        'mistral-large': 128000,
        'mistral-medium': 32000,
        'mistral-small': 32000,

        // DeepSeek
        'deepseek-chat': 64000,
        'deepseek-reasoner': 64000,
    };

    // 尝试精确匹配
    if (contextLengths[model]) {
        return contextLengths[model];
    }

    // 尝试部分匹配
    for (const [key, length] of Object.entries(contextLengths)) {
        if (model.includes(key)) {
            return length;
        }
    }

    // 默认值
    return 128000;
}

export async function storeHistory(history: ModelMessage[], context: WorkerContext) {
    const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
    const userMessage = history.findLast(h => h.role === 'user');
    if (ENV.HISTORY_IMAGE_PLACEHOLDER && Array.isArray(userMessage?.content) && userMessage.content.length > 0) {
        userMessage.content = userMessage.content.map((c: any) => c.type === 'text' ? c.text : `[${c.type}]`).join('\n');
    }
    await ENV.DATABASE.put(historyKey, JSON.stringify(history)).catch(console.error);
    log.info(`[STORE HISTORY] DONE`);
}

async function workflow(agent: ChatAgent, llmParams: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null) {
    const question = llmParams.messages.at(-1)?.content;
    if (!context.ENABLE_WORKFLOW || typeof question !== 'string') {
        return agent.request(llmParams, context, onStream);
    }

    const key = Object.keys(context.WORKFLOW).find(key => question.startsWith(`@${key}`));
    if (!key) {
        return agent.request(llmParams, context, onStream);
    }

    llmParams.messages.at(-1)!.content = question.substring(key.length + 1).trimStart();
    const backup = { ...context };
    const updater = (context: AgentUserConfig, { agent, model, temperature, max_tokens }: { agent: string; model: string; temperature: number; max_tokens: number; next: string }) => {
        agent && (context.AI_CHAT_PROVIDER = agent);
        model && (context[`${agent.toUpperCase()}_CHAT_MODEL`] = model);
        temperature && (context.CHAT_TEMPERATURE = temperature);
        max_tokens && (context.MAX_TOKENS = max_tokens);
    };
    const renderNext = (result: string, { next }: { next: string }) => {
        llmParams.messages.pop();
        llmParams.messages.push({
            role: 'user',
            content: next.replace('{{question}}', question).replace('{{result}}', result) || `question: ${question}\nresult: ${result}`,
        });
    };

    for (const workflow of context.WORKFLOW[key]) {
        updater(context, workflow);
        const agent = loadChatLLM(context);
        if (!agent) {
            throw new Error(`Agent ${workflow.agent} not found`);
        }
        const result = await agent.request(llmParams, context, onStream);
        // 不发送给ai的消息
        if (result.messages.at(-1)?.role === 'tool') {
            return result;
        }
        // const text = extractResultText(result, llmParams);
        const stepText = result.content.slice(llmParams.cache?.join().length || 0);
        if (stepText.trim() === '') {
            throw new Error('Response is empty');
        }
        llmParams.cache!.push(`${stepText}\n▲\n`);
        await onStream?.send(result.content);
        renderNext(stepText, workflow);
    }
    Object.assign(context, backup);
    return agent.request(llmParams, context, onStream);
}

function extractResultText(result: { messages: ResponseMessage[]; content: string }, llmParams: LLMChatParams) {
    const lastMessage = result.messages.at(-1)!;
    if (Array.isArray(lastMessage.content)) {
        return lastMessage.content.map((c: any) => ['text', 'reasoning'].includes(c.type) ? (c as any).text || '' : '').join('\n')
            || result.content.slice(llmParams.cache?.join().length || 0);
    }
    return lastMessage.content;
};

export function injectSystemMessage(messages: ModelMessage[], systemMessage: string | null, timezone?: string) {
    if (systemMessage) {
        // 注入{{CURRENT_TIME}}
        const now = new Date();
        const localTime = now.toLocaleString('en-US', {
            timeZone: timezone || 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        systemMessage = systemMessage.replace('{{CURRENT_TIME}}', localTime);
        messages.unshift({
            role: 'system',
            content: systemMessage,
        });
    }
    return messages;
}
