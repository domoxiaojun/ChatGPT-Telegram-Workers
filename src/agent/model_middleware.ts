/* eslint-disable no-case-declarations */
/* eslint-disable unused-imports/no-unused-vars */
import type { LanguageModelV3, LanguageModelV4, LanguageModelV4CallOptions, LanguageModelV4Prompt } from '@ai-sdk/provider';
import type { ModelMessage, StepResult, TextStreamPart, ToolCallPart, ToolResultPart } from 'ai';

type LLMModel = LanguageModelV3 | LanguageModelV4;
import type { AgentUserConfig } from '../config/env';
import type { LogStruct } from '../log';
import type { ToolResult } from '../tools/types';
import type { ChatStreamTextHandler } from './types';
import {
    extractReasoningMiddleware,
    jsonSchema,
    tool as aiTool,
    wrapLanguageModel,
} from 'ai';
import { ENV } from '../config/env';
import { getLogSingleton, log } from '../log';
import { SEGMENTATION_MARK } from '../telegram/utils/md2tgmd';
import { getTools, sendToolResult, validTools } from '../tools';
import githubRepoReader from '../tools/internal/github_repo_reader';
import { createLlmModel } from './llm';

type Writeable<T> = { -readonly [P in keyof T as P extends 'modelId' ? P : never]: T[P] };
export interface MessageInfo {
    content: string;
    // reasoning: string;
    occured_error?: boolean;
};

const PROVIDER_ONLY_TOOLS = new Set([
    'google_search',
    'url_context',
    'code_execution',
    'google_maps',
    'file_search',
    'enterprise_web_search',
    'vertex_rag_store',
    'web_search',
    'web_fetch',
    'x_search',
    'code_interpreter',
    'image_generation',
    'mcp',
]);

function shouldUseToolModel(activeTools: string[]): boolean {
    return activeTools.length > 0 && activeTools.every(name => !PROVIDER_ONLY_TOOLS.has(name));
}

function getMessageTextContent(content: unknown): string {
    if (typeof content === 'string') {
        return content;
    }
    if (!Array.isArray(content)) {
        return '';
    }

    return content
        .map((part: any) => {
            if (!part || typeof part !== 'object') {
                return '';
            }
            if (typeof part.text === 'string') {
                return part.text;
            }
            if (typeof part.content === 'string') {
                return part.content;
            }
            return '';
        })
        .filter(Boolean)
        .join('\n');
}

function normalizeTriggerValue(value: unknown): string {
    return String(value ?? '')
        .trim()
        .replace(/^['"]|['"]$/g, '')
        .trim()
        .toLowerCase();
}

function stripGroupContextLines(text: string): string {
    return text
        .split('\n')
        .filter((line) => {
            const trimmed = line.trimStart();
            return !trimmed.startsWith('[Group Chat Context]')
                && !trimmed.startsWith('=== Recent Group Messages ===')
                && !trimmed.startsWith('=== End of Recent Messages ===');
        })
        .join('\n')
        .trim();
}

function getOpenAIWebSearchTriggerParts(text: string): { promptText: string; referenceText: string } {
    const cleanedText = stripGroupContextLines(text);
    const quoteIndex = cleanedText.search(/\n\s*>/);
    if (quoteIndex < 0) {
        return { promptText: cleanedText.trim(), referenceText: '' };
    }

    return {
        promptText: cleanedText.slice(0, quoteIndex).trim(),
        referenceText: cleanedText
            .slice(quoteIndex)
            .split('\n')
            .map(line => line.replace(/^\s*>\s?/, ''))
            .join('\n')
            .trim(),
    };
}

function hasUrl(text: string): boolean {
    return /(?:https?:\/\/|www\.)[^\s<>"')]+/i.test(text);
}

function hasReferencedUrlIntent(text: string): boolean {
    return /(url|网址|链接|网页|网站|页面|正文|文章|报道|帖子|推文|tweet|打开|读取|读一下|看一下|看下|看看|总结|概括|分析|讲什么|说什么|怎么回事)/i.test(text);
}

export function shouldEnableOpenAIWebSearch(context: AgentUserConfig, currentUserText: string): boolean {
    if (!context.OPENAI_ENABLE_WEB_SEARCH) {
        return false;
    }

    const mode = normalizeTriggerValue(context.OPENAI_WEB_SEARCH_TRIGGER_MODE || 'model');
    if (mode === 'model') {
        log.info('[warpLLMParams] OpenAI web_search enabled by trigger mode: model');
        return true;
    }

    const { promptText, referenceText } = getOpenAIWebSearchTriggerParts(currentUserText);
    const promptLower = promptText.toLowerCase();
    const referenceLower = referenceText.toLowerCase();
    const combinedLower = [promptLower, referenceLower].filter(Boolean).join('\n');
    if (!combinedLower) {
        return false;
    }

    const negativeTriggers = ['不要搜索', '不用搜索', '别搜索', '无需搜索', '不要搜', '不用搜', '别搜', '不要联网', '不用联网'];
    if (negativeTriggers.some(trigger => promptLower.includes(trigger))) {
        return false;
    }

    const prefixes = context.OPENAI_WEB_SEARCH_TRIGGER_PREFIXES || [];
    const matchedPrefix = prefixes.find((prefix) => {
        const normalized = normalizeTriggerValue(prefix);
        return normalized && promptLower.startsWith(normalized);
    });
    if (matchedPrefix) {
        log.info(`[warpLLMParams] OpenAI web_search enabled by trigger prefix: ${matchedPrefix}`);
        return true;
    }

    if (mode === 'prefix') {
        return false;
    }

    if (hasUrl(promptText)) {
        log.info('[warpLLMParams] OpenAI web_search enabled by URL in current message');
        return true;
    }

    if (hasUrl(referenceText) && hasReferencedUrlIntent(promptText)) {
        log.info('[warpLLMParams] OpenAI web_search enabled by URL in replied/quoted message');
        return true;
    }

    const keywords = context.OPENAI_WEB_SEARCH_TRIGGER_KEYWORDS || [];
    const matchedKeyword = keywords.find((keyword) => {
        const normalized = normalizeTriggerValue(keyword);
        return normalized && promptLower.includes(normalized);
    });
    if (matchedKeyword) {
        log.info(`[warpLLMParams] OpenAI web_search enabled by trigger keyword: ${matchedKeyword}`);
        return true;
    }
    return false;
}

export async function AIMiddleware({ config, activeTools, onStream, toolChoice, messageInfo, chatModel }: { config: AgentUserConfig; activeTools: string[]; onStream: ChatStreamTextHandler | null; toolChoice: ToolChoice[] | []; messageInfo: MessageInfo; chatModel: string }): Promise<Record<string, ((...args: any[]) => any)>> {
    let step = 0;
    let rawSystemPrompt: string | undefined;
    const extractReasoning = extractReasoningMiddleware({ tagName: 'think' });
    const tools = await getTools();
    let hasRecordFirstChunkTime = false;
    let record: LogStruct;
    let currentModel: LLMModel;
    const toolStartTimes = new Map<string, number>();
    const sentVisibleToolResultIds = new Set<string>();
    if (onStream && !onStream.flushPendingVisibleToolResults) {
        onStream.pendingVisibleToolResults = [];
        onStream.flushPendingVisibleToolResults = async (caption?: string) => {
            const pendingResults = onStream.pendingVisibleToolResults || [];
            if (pendingResults.length === 0) {
                return new Response('ok');
            }
            const sender = onStream.sender;
            if (!sender) {
                return new Response('ok');
            }
            onStream.pendingVisibleToolResults = [];
            const results = caption ? withFirstImageCaption(pendingResults, caption) : pendingResults;
            await sendToolResult(results, sender, config);
            onStream.visibleToolResultSent = true;
            onStream.clearHeartbeat?.();
            return new Response('ok');
        };
    }
    const sendToolStartTip = (toolName: string) => {
        if (ENV.HIDE_MIDDLE_MESSAGE) {
            return;
        }
        const sender = onStream?.sender as any;
        const hasEditableMessage = !!sender?.context?.inline_message_id
            || (Array.isArray(sender?.context?.sentMessageIds) && sender.context.sentMessageIds.length > 0);
        if (!hasEditableMessage) {
            return;
        }
        onStream?.send(`${messageInfo.content.trimEnd()}\n\n` + `tool call start: \`${toolName}\``);
    };
    // chunk内容修改导致收集的message一并修改，暂恢复原think处理逻辑
    // const thinkingTag = '>`Thinking\\.\\.\\.`';
    // let thinkingStart = false;
    // const chunkWrapper = (data: TextStreamPart<any>) => {
    //     switch (data.type) {
    //         case 'reasoning':
    //             if (!ENV.SHOW_THINKING_TEXT) {
    //                 data.text = '';
    //                 break;
    //             }
    //             if (!thinkingStart) {
    //                 thinkingStart = true;
    //                 // thinking转为引用
    //                 data.text = `${thinkingTag}\n>${data.text.replace(/\n/g, '\n>')}`;
    //                 break;
    //             }
    //             data.text = data.text.replace(/\n/g, '\n>');
    //             break;
    //         case 'text':
    //             if (!thinkingStart)
    //                 break;
    //             thinkingStart = false;
    //             const thinkingTime = ((Date.now() - record!.start_time) / 1e3).toFixed(1);
    //             messageInfo.content = messageInfo.content
    //                 .replace(thinkingTag, `>\`Thought for ${thinkingTime} seconds\``)
    //                 .replace(/(\n>)*$/g, '');
    //             data.text = `\n>✹\n${SEGMENTATION_MARK}\n${data.text}`;
    //             break;
    //         case 'tool-call':
    //             onStream?.send(`${messageInfo.content.trimEnd()}\n\n` + `tool call start: \`${data.toolName}\``);
    //             log.info(`start tool: ${data.toolName}`);
    //             break;
    //     }
    // };

    return {
        prepareStepPre: (middleware: any) => async ({ model, stepNumber, steps }: { model: LLMModel; stepNumber: number; steps: StepResult<any, any>[] }) => {
            currentModel = model;
            if (shouldUseToolModel(activeTools)) {
                const targetModel = config.TOOL_MODEL || chatModel;

                currentModel = wrapLanguageModel({
                    model: await createLlmModel(targetModel, config) as any,
                    middleware,
                }) as any;
            }
            record = getLogSingleton({ config });
            // record model log
            recordModelLog({ config, model: currentModel, record });
            // google已支持youtube url以及内部文件url，但未支持其他外部url
            if (currentModel.provider.startsWith('google') && model.modelId.startsWith('gemini-2')) {
                currentModel.supportedUrls = {
                    '*': [/^https:\/\/generativelanguage.googleapis.com\/v1beta\/files\/.*$/, /^https?:\/\/(youtu\.be|www\.youtube\.com)\/.+/],
                };
            }

            return {
                model: currentModel,
            };
        },

        wrapGenerate: async ({ doGenerate, params, model }: { doGenerate: () => Promise<any>; params: any; model: LLMModel }) => {
            return extractReasoning.wrapGenerate!({ doGenerate, doStream: () => model.doStream(params), params, model } as any);
        },

        wrapStream: async ({ doStream, params, model }: { doStream: () => Promise<any>; params: any; model: LLMModel }) => {
            return extractReasoning.wrapStream!({ doStream, doGenerate: () => model.doGenerate(params), params, model } as any);
        },

        transformParams: async ({ type, params }: { type: 'generate' | 'stream'; params: LanguageModelV4CallOptions }) => {
            log.info(`start ${type} call`);

            // transform tool choice
            if (activeTools.length > 0 && toolChoice.length > 0 && step < toolChoice.length) {
                const toolChoiceItem = toolChoice[step] as any;
                log.info(`toolChoice changed: ${JSON.stringify(toolChoiceItem)}`);
                params.toolChoice = toolChoiceItem;
            }
            // tool result as message
            if (params.prompt.at(-1)?.role === 'tool') {
                log.info(`detect last message is tool result, handle tool result`);
                const toolResults = params.prompt.at(-1)?.content as unknown as ToolResultPart[];
                await handleToolResult({ tools, toolResults, onStream, config, sentVisibleToolResultIds });
                log.debug(`last tool result: ${JSON.stringify(toolResults, null, 2)}`);
            }
            if (!rawSystemPrompt) {
                rawSystemPrompt = params.prompt.find((i: any) => i.role === 'system')?.content as string;
            }
            // warp messages
            const isResponseApi = currentModel.provider.endsWith('.responses');
            warpMessages(params, tools, activeTools, isResponseApi, rawSystemPrompt);
            return params;
        },

        onChunk: ({ chunk }: { chunk: TextStreamPart<any> }) => {
            if (!hasRecordFirstChunkTime) {
                record.first_chunk_time = Date.now() - record.start_time;
                hasRecordFirstChunkTime = true;
            }
            // chunkWrapper(chunk);
            if (chunk.type === 'tool-call') {
                const toolCallId = (chunk as any).toolCallId || chunk.toolName;
                toolStartTimes.set(toolCallId, Date.now());
                sendToolStartTip(chunk.toolName);
                log.info(`start tool: ${chunk.toolName}`);
            }
        },

        onStepFinish: async ({ text, toolResults, usage, request, response, finishReason }: StepResult<any, any>) => {
            log.info('llm request end');
            log.info(`[onStepFinish] text: "${text}", text length: ${text?.length || 0}, toolResults count: ${toolResults.length}`);
            log.debug('step raw request:', request);
            // log.debug('step raw response:', response);

            // record end time
            record.end_time = Date.now();

            // Send tool results to user (image_generation, code_execution, etc.)
            if (toolResults.length > 0) {
                // Deduplicate by toolCallId to avoid processing same tool multiple times
                const uniqueResults = toolResults.filter((result: any, index: number, self: any[]) =>
                    index === self.findIndex((r: any) => r.toolCallId === result.toolCallId)
                );

                if (uniqueResults.length < toolResults.length) {
                    log.warn(`Deduplicated ${toolResults.length - uniqueResults.length} duplicate tool calls`);
                }

                await handleToolResult({ tools, toolResults: uniqueResults as any, onStream, config, sentVisibleToolResultIds });
            }

            // record tool call detail4
            if (toolResults.length > 0) {
                const func_logs = toolResults.map(({ toolCallId, toolName, input, output }: { toolCallId?: string; toolName: string; input: any; output: any }) => {
                    // Handle different output formats
                    // Provider tools (Anthropic/Google/xAI/OpenAI) may have different output structures
                    const hasContent = output && typeof output === 'object' && 'content' in output;
                    const hasValue = output && typeof output === 'object' && 'value' in output;
                    const hasResult = output && typeof output === 'object' && 'result' in output;

                    let hasError = false;
                    if (hasContent && Array.isArray(output.content)) {
                        hasError = output.content.some((i: any) => i.is_error);
                    } else if (hasValue && Array.isArray(output.value?.content)) {
                        hasError = output.value.content.some((i: any) => i.type === 'error');
                    }

                    // For OpenAI image_generation tool, input is empty object by design
                    // The actual prompt is generated by the AI model itself
                    const inputValues = Object.values(input as any);
                    const hasInput = inputValues.length > 0;

                    // Safe preview of result field
                    let resultPreview;
                    if (hasResult && output?.result != null) {
                        if (typeof output.result === 'string' && output.result.length > 0) {
                            resultPreview = output.result.length > 50
                                ? `${output.result.substring(0, 50)}...`
                                : output.result;
                        } else if (typeof output.result !== 'string') {
                            resultPreview = output.result;
                        }
                    }

                    const startedAt = toolStartTimes.get(toolCallId || toolName);
                    const time = output?.time ?? (startedAt ? ((Date.now() - startedAt) / 1e3).toFixed(1) : undefined);

                    return {
                        name: toolName,
                        ...(hasInput && { args: inputValues }),
                        ...(resultPreview && { result_preview: resultPreview }),
                        ...(hasError && { error: 'Tool execution error' }),
                        ...(time && { time }),
                    };
                });

                // record function log
                record.functions.push(...func_logs);

                // delete time
                // ai sdk无api能调整函数结果，但内部记录stepMessages， result未做深拷贝 由此可以直接对数据直接进行修改
                toolResults.forEach(({ output }: any) => output?.time && (delete output.time));

                log.info(`tool details: ${JSON.stringify(func_logs, null, 2)}`);
                log.debug(`tool results: ${JSON.stringify(toolResults, null, 2)}`);

                const toolNames = [...new Set(toolResults.map((i: any) => i.toolName))];
                log.info(`finish tools: ${toolNames}`);
            }

            // text content is already accumulated during streaming in request.ts
            // For Google/Anthropic/xAI server-side tools, no additional handling needed here
            if (text && text.trim()) {
                log.info(`Final response text length: ${text.length}`);
            }

            // record token
            if (usage && usage.inputTokens && usage.outputTokens) {
                record.tokens = {
                    prompt: usage.inputTokens,
                    completion: usage.outputTokens,
                    reasoning: usage.reasoningTokens,
                    cached: usage.cachedInputTokens,
                };
                log.info(`tokens: ${JSON.stringify(usage)}`);
            } else {
                log.warn('usage is none');
            }

            // reset tool message status
            hasRecordFirstChunkTime = false;
            step++;
        },
    };
}

function stripInternalMarks(content: any): any {
    const cleanText = (text: string): string => {
        return text
            // Remove SEGMENTATION_MARK
            .replace(new RegExp(`${SEGMENTATION_MARK}\\n?`, 'g'), '')
            // Remove sources section (>sources:\n>...) to prevent model from mimicking
            .replace(/\n*>sources:\n(?:>.*(?:\n|$))*/gi, '')
            // Remove xAI internal render tags (e.g. [grok:render ...><argument ...>)
            .replace(/\[grok:render\b[^\]]*>[\s\S]*?(?:<\/argument>\s*)+/gi, '');
    };

    if (typeof content === 'string') {
        return cleanText(content);
    }
    if (Array.isArray(content)) {
        return content.map((part: any) => {
            if (part.type === 'text' && typeof part.text === 'string') {
                return { ...part, text: cleanText(part.text) };
            }
            return part;
        });
    }
    return content;
}

function warpMessages(params: LanguageModelV4CallOptions, allTools: Record<string, any>, activeTools: string[], isResponseApi: boolean, rawSystemPrompt: string | undefined) {
    const { prompt: messages, tools } = params;

    const getSystemContent = () => {
        let systemContent = rawSystemPrompt ?? '';
        // 插入工具prompt
        // 注意：不要在 system prompt 中提到 Google/Anthropic 等 provider 工具
        // 因为这会导致模型错误地将服务端工具当作客户端工具来调用
        const directToolPrompts: Record<string, any> = {
            [githubRepoReader.schema.name]: githubRepoReader,
        };
        const clientSideTools = activeTools.filter(name => !PROVIDER_ONLY_TOOLS.has(name));

        if (clientSideTools.length > 0) {
            systemContent += `\nYou can consider using the following tools:\n${clientSideTools.map(name =>
                `### ${name}\n- desc: ${(allTools[name] || directToolPrompts[name])?.schema?.description || ''} \n${(allTools[name] || directToolPrompts[name])?.prompt || ''}`,
            ).join('\n\n')}`
            + `\n\n${clientSideTools.map((name) => {
                const prompt = (allTools[name] || directToolPrompts[name])?.prompt;
                return prompt && `## For tool \`${name}\`, you should follow these rules:\n - ${prompt}`;
            })
                .join('\n')}`;
        }
        return systemContent ?? 'You are a helpful assistant';
    };

    const trimMessages = (messages: ModelMessage[]) => {
        const modifiedMessages: any[] = [];
        for (const [i, message] of messages.entries()) {
            switch (message.role) {
                case 'system':
                    modifiedMessages.push({
                        role: 'system',
                        content: getSystemContent(),
                    });
                    continue;
                case 'assistant':
                    if (Array.isArray(message.content) && message.content.every(i => i.type !== 'tool-call')) {
                        modifiedMessages.push({
                            ...message,
                            content: stripInternalMarks(message.content),
                        });
                    }
                    continue;
                case 'tool':
                    const preMessage = messages[i - 1];
                    // if (i > 0 && isResponseApi && messages[i - 1].content)
                    let text = '';
                    const toolNames: Set<string> = new Set();
                    for (const toolResultPart of message.content) {
                        const { toolCallId, toolName, output } = toolResultPart as ToolResultPart;
                        toolNames.add(toolName);
                        let toolArgs = 'UNKNOWN';
                        if (preMessage?.role === 'assistant' && (preMessage?.content as any[])?.some(i => i.type === 'tool-call')) {
                            toolArgs = JSON.stringify((preMessage?.content as ToolCallPart[])?.find(i => i.toolCallId === toolCallId)?.input) || 'UNKNOWN';
                        }
                        // Handle different output types
                        const arrayResult = (output.type === 'execution-denied') ? { error: output.reason || 'Execution denied' } : ('value' in output ? output.value : output);
                        text += `#### [tool \`${toolName}\` invoke detail]\n - args: ${toolArgs}\n - result:\n${JSON.stringify(arrayResult)}\n\n`;
                    }
                    text = `### Please use the following retrieved data to answer my question:\n${text}`;
                    modifiedMessages.push({
                        role: 'user',
                        content: [{ type: 'text', text }],
                    });
                    continue;
                case 'user':
                    modifiedMessages.push(message);
                    continue;
            }
        }
        return modifiedMessages;
    };

    if (tools && activeTools.length === 0) {
        tools.length = 0;
    }
    if (ENV.MESSAGE_COMPATIBLE) {
        params.prompt = trimMessages(messages);
    } else {
        const systemMessage = messages[0].role === 'system' ? messages[0] : undefined;
        if (systemMessage) {
            systemMessage.content = getSystemContent();
            params.prompt.shift();
        }
        // Strip internal marks from all assistant messages
        for (const message of params.prompt) {
            if (message.role === 'assistant') {
                message.content = stripInternalMarks(message.content);
            }
        }
        // if the first message is tool call, inject a user message to use the tool to avoid gemini error
        const firstMessage = params.prompt[0];
        const firstIsToolCall = Array.isArray(firstMessage?.content) && firstMessage?.content.some((c: any) => c.type === 'tool-call');
        if (firstIsToolCall) {
            params.prompt.unshift({
                role: 'user',
                content: [{ type: 'text', text: 'Use the tool to answer my question.' }],
            });
        }
        systemMessage && params.prompt.unshift(systemMessage);
    }
    // 处理 Responses API stateless 历史。不要把 store=false 下不可复用的服务端 item id 发回上游。
    isResponseApi && (params.prompt = handleResponseApiMessage(params.prompt as LanguageModelV4Prompt));
}

function warpModel(model: LLMModel, config: AgentUserConfig, activeTools: string[], toolChoice: ToolChoice, chatModel: string) {
    const mutableModel = model as Writeable<LLMModel>;
    const effectiveModel = (activeTools.length > 0 && toolChoice?.type !== 'none') ? (config.TOOL_MODEL || chatModel) : chatModel;
    if (effectiveModel !== mutableModel.modelId) {
        let newModel: LLMModel | undefined;
        mutableModel.modelId = newModel?.modelId ?? effectiveModel;
    }
}

export async function warpLLMParams({ messages, model, cache }: { messages: ModelMessage[]; model: LLMModel; cache?: string[] }, context: AgentUserConfig) {
    const allTools = await getTools();
    const userMessage = messages.findLast(m => m.role === 'user')!;
    // support text message and text part
    const userText = getMessageTextContent(userMessage.content);
    let { tools = {}, activeToolAlias = [] } = await validTools(context);

    let activeTools = activeToolAlias.map((t: string) => allTools[t]?.schema?.name || t) || [];

    // Google Server-Side Tools Support
    // Google tools are executed on Google servers and need to be added separately
    if (model.provider.startsWith('google') || model.provider.startsWith('vertex')) {
        const { google } = await import('@ai-sdk/google');

        // Check if this is Gemini 3 model (supports tool combination)
        const isGemini3 = model.modelId.startsWith('gemini-3');

        const googleNativeTools = [
            context.GOOGLE_ENABLE_GOOGLE_SEARCH && 'googleSearch',
            context.GOOGLE_ENABLE_CODE_EXECUTION && 'codeExecution',
            context.GOOGLE_ENABLE_URL_CONTEXT && 'urlContext',
            context.GOOGLE_ENABLE_GOOGLE_MAPS && 'googleMaps',
            context.GOOGLE_ENABLE_FILE_SEARCH && 'fileSearch',
            context.GOOGLE_ENABLE_ENTERPRISE_WEB_SEARCH && 'enterpriseWebSearch',
        ].filter(Boolean) as string[];

        for (const toolName of googleNativeTools) {
            switch (toolName) {
                case 'googleSearch': {
                    // Build Google Search configuration with new features
                    const searchConfig: any = {};

                    // Configure search types (web and/or image search)
                    const searchTypes: any = {};
                    if (context.GOOGLE_SEARCH_ENABLE_WEB_SEARCH) {
                        searchTypes.webSearch = {};
                    }
                    if (context.GOOGLE_SEARCH_ENABLE_IMAGE_SEARCH) {
                        searchTypes.imageSearch = {};
                    }
                    if (Object.keys(searchTypes).length > 0) {
                        searchConfig.searchTypes = searchTypes;
                    }

                    // Configure time range filter if provided
                    if (context.GOOGLE_SEARCH_TIME_RANGE_FILTER.startTime && context.GOOGLE_SEARCH_TIME_RANGE_FILTER.endTime) {
                        searchConfig.timeRangeFilter = {
                            startTime: context.GOOGLE_SEARCH_TIME_RANGE_FILTER.startTime,
                            endTime: context.GOOGLE_SEARCH_TIME_RANGE_FILTER.endTime,
                        };
                    }

                    tools.google_search = google.tools.googleSearch(searchConfig);
                    activeTools.push('google_search');
                    break;
                }
                case 'codeExecution':
                    tools.code_execution = google.tools.codeExecution({});
                    activeTools.push('code_execution');
                    break;
                case 'urlContext':
                    tools.url_context = google.tools.urlContext({});
                    activeTools.push('url_context');
                    break;
                case 'googleMaps':
                    // Google Maps only supported on Gemini 2.x models
                    // Skip if current model doesn't support it to avoid API errors
                    if (model.modelId.startsWith('gemini-2') || model.modelId.startsWith('gemini-3')) {
                        tools.google_maps = google.tools.googleMaps({});
                        activeTools.push('google_maps');
                    } else {
                        log.info(`[warpLLMParams] Google Maps not supported on ${model.modelId}, skipping. Switch to gemini-2.x or gemini-3.x to enable Maps.`);
                    }
                    break;
                case 'fileSearch':
                    if (context.GOOGLE_FILE_SEARCH_STORES.length > 0) {
                        tools.file_search = google.tools.fileSearch({
                            fileSearchStoreNames: context.GOOGLE_FILE_SEARCH_STORES,
                            topK: context.GOOGLE_FILE_SEARCH_TOP_K,
                            ...(context.GOOGLE_FILE_SEARCH_METADATA_FILTER && {
                                metadataFilter: context.GOOGLE_FILE_SEARCH_METADATA_FILTER,
                            }),
                        });
                        activeTools.push('file_search');
                    } else {
                        log.warn('[warpLLMParams] fileSearch enabled but GOOGLE_FILE_SEARCH_STORES is empty');
                    }
                    break;
                case 'enterpriseWebSearch':
                    tools.enterprise_web_search = google.tools.enterpriseWebSearch({});
                    activeTools.push('enterprise_web_search');
                    break;
            }
        }

        // Google Maps and Code Execution cannot be used together (Google API limitation)
        // This is a server-side restriction that applies to all Gemini versions
        if (activeTools.includes('google_maps') && activeTools.includes('code_execution')) {
            log.warn('[warpLLMParams] Google Maps and Code Execution cannot be used together (Google API restriction). Removing Code Execution.');
            delete tools.code_execution;
            activeTools = activeTools.filter(t => t !== 'code_execution');
        }

        // Code Execution does not support audio/video file types
        // Supported: .png, .jpeg, .csv, .xml, .cpp, .java, .py, .js, .ts
        if (activeTools.includes('code_execution') && Array.isArray(userMessage.content)) {
            const hasUnsupportedFile = userMessage.content.some((part: any) =>
                part.type === 'file' && part.mediaType && (part.mediaType.startsWith('audio/') || part.mediaType.startsWith('video/')),
            );
            if (hasUnsupportedFile) {
                log.warn('[warpLLMParams] Code Execution does not support audio/video files. Removing Code Execution.');
                delete tools.code_execution;
                activeTools = activeTools.filter(t => t !== 'code_execution');
            }
        }

        if (activeTools.length > 0) {
            log.info(`[warpLLMParams] Google server-side tools enabled: ${activeTools.join(', ')}`);
        }
    }

    // xAI Server-Side Tools Support (Responses API only)
    // xAI provider tools are only supported by the Responses API, not Chat API
    // Chat API should use searchParameters instead
    if (model.provider === 'xai.responses') {
        // xAI Responses API only supports images, not audio/video
        // Filter out unsupported media types and replace with text description
        if (Array.isArray(userMessage.content)) {
            const hasUnsupportedMedia = userMessage.content.some((part: any) =>
                part.type === 'file' && part.mediaType &&
                (part.mediaType.startsWith('audio/') || part.mediaType.startsWith('video/'))
            );

            if (hasUnsupportedMedia) {
                log.warn('[warpLLMParams] xAI Responses API does not support audio/video. Converting to text description.');
                userMessage.content = userMessage.content.map((part: any) => {
                    if (part.type === 'file' && part.mediaType) {
                        if (part.mediaType.startsWith('video/')) {
                            return {
                                type: 'text',
                                text: '[User sent a video/animated sticker. Note: xAI cannot view video content - only static images are supported. Please ask the user to describe it or send a static image instead.]'
                            };
                        }
                        if (part.mediaType.startsWith('audio/')) {
                            return {
                                type: 'text',
                                text: '[User sent an audio file. Note: xAI cannot process audio - only images are supported. Please ask the user to provide a text transcript or description.]'
                            };
                        }
                    }
                    return part;
                });
            }
        }
        const { webSearch, xSearch, codeExecution, xaiTools } = await import('@ai-sdk/xai');

        if (context.XAI_ENABLE_WEB_SEARCH) {
            const webSearchConfig: any = {};
            if (context.XAI_WEB_SEARCH_ALLOWED_DOMAINS.length > 0) {
                webSearchConfig.allowedDomains = context.XAI_WEB_SEARCH_ALLOWED_DOMAINS.slice(0, 5);
            }
            if (context.XAI_WEB_SEARCH_EXCLUDED_DOMAINS.length > 0) {
                webSearchConfig.excludedDomains = context.XAI_WEB_SEARCH_EXCLUDED_DOMAINS.slice(0, 5);
            }
            if (context.XAI_WEB_SEARCH_IMAGE_UNDERSTANDING) {
                webSearchConfig.enableImageUnderstanding = true;
            }
            tools.web_search = webSearch(webSearchConfig);
            activeTools.push('web_search');
        }

        if (context.XAI_ENABLE_X_SEARCH) {
            const xSearchConfig: any = {};
            if (context.XAI_X_SEARCH_ALLOWED_HANDLES.length > 0) {
                xSearchConfig.allowedXHandles = context.XAI_X_SEARCH_ALLOWED_HANDLES.slice(0, 10);
            }
            if (context.XAI_X_SEARCH_EXCLUDED_HANDLES.length > 0) {
                xSearchConfig.excludedXHandles = context.XAI_X_SEARCH_EXCLUDED_HANDLES.slice(0, 10);
            }
            if (context.XAI_X_SEARCH_IMAGE_UNDERSTANDING) {
                xSearchConfig.enableImageUnderstanding = true;
            }
            if (context.XAI_X_SEARCH_VIDEO_UNDERSTANDING) {
                xSearchConfig.enableVideoUnderstanding = true;
            }
            tools.x_search = xSearch(xSearchConfig);
            activeTools.push('x_search');
        }

        if (context.XAI_ENABLE_CODE_EXECUTION) {
            tools.code_execution = codeExecution();
            activeTools.push('code_execution');
        }

        // File Search - 文件向量搜索（需要预先在 xAI 创建 collections）
        if (context.XAI_ENABLE_FILE_SEARCH) {
            if (context.XAI_FILE_SEARCH_VECTOR_STORES.length > 0) {
                // 动态检测 fileSearch 是否可用（@ai-sdk/xai 3.0.40+）
                // 当前类型定义未覆盖 fileSearch，运行时按函数存在性判断。
                const fileSearchFn = (xaiTools as any)?.fileSearch;
                if (typeof fileSearchFn === 'function') {
                    const fileSearchConfig: any = {
                        vectorStoreIds: context.XAI_FILE_SEARCH_VECTOR_STORES,
                    };
                    if (context.XAI_FILE_SEARCH_MAX_RESULTS > 0) {
                        fileSearchConfig.maxNumResults = context.XAI_FILE_SEARCH_MAX_RESULTS;
                    }
                    tools.file_search = fileSearchFn(fileSearchConfig);
                    activeTools.push('file_search');
                } else {
                    log.warn('[warpLLMParams] xAI fileSearch not available - requires @ai-sdk/xai 3.0.40+, please run: bun update @ai-sdk/xai');
                }
            } else {
                log.warn('[warpLLMParams] xAI fileSearch enabled but XAI_FILE_SEARCH_VECTOR_STORES is empty');
            }
        }

        log.info(`[warpLLMParams] xAI server-side tools enabled: ${activeTools.filter(t => ['web_search', 'x_search', 'code_execution', 'file_search'].includes(t)).join(', ')}`);
    }

    // Anthropic Server-Side Tools Support
    // Anthropic provider tools (web_fetch, web_search, code_execution)
    if (model.provider === 'anthropic.messages') {
        const { anthropicTools } = await import('@ai-sdk/anthropic/internal');

        // Web Fetch tool - 获取网页内容
        if (context.ANTHROPIC_ENABLE_WEB_FETCH) {
            const webFetchConfig: any = {
                maxUses: context.ANTHROPIC_WEB_FETCH_MAX_USES,
            };
            if (context.ANTHROPIC_WEB_FETCH_ALLOWED_DOMAINS.length > 0) {
                webFetchConfig.allowedDomains = context.ANTHROPIC_WEB_FETCH_ALLOWED_DOMAINS;
            }
            if (context.ANTHROPIC_WEB_FETCH_BLOCKED_DOMAINS.length > 0) {
                webFetchConfig.blockedDomains = context.ANTHROPIC_WEB_FETCH_BLOCKED_DOMAINS;
            }
            if (context.ANTHROPIC_WEB_FETCH_ENABLE_CITATIONS) {
                webFetchConfig.citations = { enabled: true };
            }
            if (context.ANTHROPIC_WEB_FETCH_MAX_CONTENT_TOKENS) {
                webFetchConfig.maxContentTokens = context.ANTHROPIC_WEB_FETCH_MAX_CONTENT_TOKENS;
            }
            tools.web_fetch = anthropicTools.webFetch_20250910(webFetchConfig);
            activeTools.push('web_fetch');
        }

        // Web Search tool - 网页搜索
        if (context.ANTHROPIC_ENABLE_WEB_SEARCH) {
            const webSearchConfig: any = {
                maxUses: context.ANTHROPIC_WEB_SEARCH_MAX_USES,
            };
            if (context.ANTHROPIC_WEB_SEARCH_ALLOWED_DOMAINS.length > 0) {
                webSearchConfig.allowedDomains = context.ANTHROPIC_WEB_SEARCH_ALLOWED_DOMAINS;
            }
            if (context.ANTHROPIC_WEB_SEARCH_BLOCKED_DOMAINS.length > 0) {
                webSearchConfig.blockedDomains = context.ANTHROPIC_WEB_SEARCH_BLOCKED_DOMAINS;
            }
            if (context.ANTHROPIC_WEB_SEARCH_USER_LOCATION) {
                webSearchConfig.userLocation = context.ANTHROPIC_WEB_SEARCH_USER_LOCATION;
            }
            tools.web_search = anthropicTools.webSearch_20250305(webSearchConfig);
            activeTools.push('web_search');
        }

        // Code Execution tool - 代码执行（Python + Bash）
        // 动态找最新版本：取所有 codeExecution_YYYYMMDD 中日期最大的
        if (context.ANTHROPIC_ENABLE_CODE_EXECUTION) {
            const codeExecKey = Object.keys(anthropicTools)
                .filter(k => /^codeExecution_\d{8}$/.test(k))
                .sort()
                .at(-1);
            if (codeExecKey) {
                tools.code_execution = (anthropicTools as any)[codeExecKey]();
                activeTools.push('code_execution');
            }
        }

        if (context.ANTHROPIC_ENABLE_WEB_FETCH || context.ANTHROPIC_ENABLE_WEB_SEARCH || context.ANTHROPIC_ENABLE_CODE_EXECUTION) {
            log.info(`[warpLLMParams] Anthropic server-side tools enabled: ${activeTools.filter(t => ['web_fetch', 'web_search', 'code_execution'].includes(t)).join(', ')}`);
        }
    }

    // OpenAI Server-Side Tools Support (Responses API only)
    // OpenAI provider tools (web_search, code_interpreter, file_search)
    if (model.provider === 'openai.responses') {
        const { openai } = await import('@ai-sdk/openai');
        const openaiTools = openai.tools;

        // Web Search tool - 网页搜索
        if (shouldEnableOpenAIWebSearch(context, userText)) {
            const webSearchConfig: any = {
                externalWebAccess: context.OPENAI_WEB_SEARCH_EXTERNAL_ACCESS,
                searchContextSize: context.OPENAI_WEB_SEARCH_CONTEXT_SIZE,
            };

            if (context.OPENAI_WEB_SEARCH_ALLOWED_DOMAINS.length > 0) {
                webSearchConfig.filters = {
                    allowedDomains: context.OPENAI_WEB_SEARCH_ALLOWED_DOMAINS,
                };
            }

            if (context.OPENAI_WEB_SEARCH_USER_LOCATION) {
                // 解析位置格式：支持 "City, Country" 或 "latitude,longitude"
                const location = context.OPENAI_WEB_SEARCH_USER_LOCATION.trim();
                const parts = location.split(',').map(s => s.trim());

                // 检查是否为坐标格式（两个数字）
                const isCoordinates = parts.length === 2 && !Number.isNaN(Number(parts[0])) && !Number.isNaN(Number(parts[1]));

                if (!isCoordinates && parts.length >= 1) {
                    // 文本格式："City, Country" 或 "Country"
                    webSearchConfig.userLocation = {
                        type: 'approximate' as const,
                        ...(parts.length >= 2 && { city: parts[0], country: parts[1] }),
                        ...(parts.length === 1 && { country: parts[0] }),
                    };
                }
                // 坐标格式暂不支持（OpenAI API 不支持经纬度）
            }

            tools.web_search = openaiTools.webSearch(webSearchConfig);
            activeTools.push('web_search');
        } else if (context.OPENAI_ENABLE_WEB_SEARCH) {
            log.info(`[warpLLMParams] OpenAI web_search skipped by trigger mode: ${context.OPENAI_WEB_SEARCH_TRIGGER_MODE || 'model'}`);
        }

        // GitHub repository reader - OpenAI Responses 专属函数工具，不通过 USE_TOOLS 启用
        if (context.OPENAI_ENABLE_GITHUB_REPO_READER) {
            tools.github_repo_reader = aiTool({
                description: githubRepoReader.schema.description,
                inputSchema: jsonSchema(githubRepoReader.schema.parameters as any),
                execute: async (args: any) => {
                    const startTime = Date.now();
                    const result = await githubRepoReader.func!(args, {}, context);
                    return { ...result, time: ((Date.now() - startTime) / 1e3).toFixed(1) };
                },
            });
            activeTools.push(githubRepoReader.schema.name);
        }

        // Code Interpreter tool - Python 代码执行
        if (context.OPENAI_ENABLE_CODE_INTERPRETER) {
            const config = context.OPENAI_CODE_INTERPRETER_CONTAINER
                ? { container: context.OPENAI_CODE_INTERPRETER_CONTAINER }
                : {};
            tools.code_interpreter = openaiTools.codeInterpreter(config);
            activeTools.push('code_interpreter');
        }

        // File Search tool - 文件向量搜索
        if (context.OPENAI_ENABLE_FILE_SEARCH) {
            if (context.OPENAI_FILE_SEARCH_VECTOR_STORES.length > 0) {
                const fileSearchConfig: any = {
                    vectorStoreIds: context.OPENAI_FILE_SEARCH_VECTOR_STORES,
                    maxNumResults: context.OPENAI_FILE_SEARCH_MAX_RESULTS,
                };

                if (context.OPENAI_FILE_SEARCH_SCORE_THRESHOLD > 0) {
                    fileSearchConfig.ranking = {
                        scoreThreshold: context.OPENAI_FILE_SEARCH_SCORE_THRESHOLD,
                    };
                }

                tools.file_search = openaiTools.fileSearch(fileSearchConfig);
                activeTools.push('file_search');
            }
        }

        // Image Generation tool - 图片生成 (GPT-5.1+)
        if (context.OPENAI_ENABLE_IMAGE_GENERATION) {
            const imageGenConfig: any = {
                background: context.OPENAI_IMAGE_BACKGROUND,
                inputFidelity: context.OPENAI_IMAGE_INPUT_FIDELITY,
                model: context.OPENAI_IMAGE_MODEL,
                moderation: context.OPENAI_IMAGE_MODERATION === 'auto' ? 'auto' : undefined,
                outputCompression: context.OPENAI_IMAGE_OUTPUT_COMPRESSION,
                outputFormat: context.OPENAI_IMAGE_OUTPUT_FORMAT,
                partialImages: context.OPENAI_IMAGE_PARTIAL_IMAGES,
                quality: context.OPENAI_IMAGE_QUALITY,
                size: context.OPENAI_IMAGE_SIZE,
            };

            tools.image_generation = openaiTools.imageGeneration(Object.fromEntries(Object.entries(imageGenConfig).filter(([, value]) => value !== undefined)));
            activeTools.push('image_generation');
        }

        // MCP tool - Model Context Protocol
        if (context.OPENAI_ENABLE_MCP) {
            // MCP 需要 serverLabel 和 (serverUrl 或 connectorId)
            if (context.OPENAI_MCP_SERVER_LABEL && (context.OPENAI_MCP_SERVER_URL || context.OPENAI_MCP_CONNECTOR_ID)) {
                const mcpConfig: any = {
                    serverLabel: context.OPENAI_MCP_SERVER_LABEL,
                };

                // 服务器URL或连接器ID
                if (context.OPENAI_MCP_SERVER_URL) {
                    mcpConfig.serverUrl = context.OPENAI_MCP_SERVER_URL;
                }
                if (context.OPENAI_MCP_CONNECTOR_ID) {
                    mcpConfig.connectorId = context.OPENAI_MCP_CONNECTOR_ID;
                }

                // 可选配置
                if (context.OPENAI_MCP_SERVER_DESCRIPTION) {
                    mcpConfig.serverDescription = context.OPENAI_MCP_SERVER_DESCRIPTION;
                }

                if (context.OPENAI_MCP_ALLOWED_TOOLS.length > 0) {
                    if (context.OPENAI_MCP_ALLOWED_TOOLS_READ_ONLY) {
                        mcpConfig.allowedTools = {
                            readOnly: true,
                            toolNames: context.OPENAI_MCP_ALLOWED_TOOLS,
                        };
                    } else {
                        mcpConfig.allowedTools = context.OPENAI_MCP_ALLOWED_TOOLS;
                    }
                }

                if (context.OPENAI_MCP_AUTHORIZATION) {
                    mcpConfig.authorization = context.OPENAI_MCP_AUTHORIZATION;
                }

                if (Object.keys(context.OPENAI_MCP_HEADERS).length > 0) {
                    mcpConfig.headers = context.OPENAI_MCP_HEADERS;
                }

                // requireApproval 配置
                if (context.OPENAI_MCP_REQUIRE_APPROVAL === 'always') {
                    mcpConfig.requireApproval = 'always';
                } else if (context.OPENAI_MCP_APPROVAL_TOOL_NAMES.length > 0) {
                    mcpConfig.requireApproval = {
                        never: {
                            toolNames: context.OPENAI_MCP_APPROVAL_TOOL_NAMES,
                        },
                    };
                } else {
                    mcpConfig.requireApproval = 'never';
                }

                tools.mcp = openaiTools.mcp(mcpConfig);
                activeTools.push('mcp');
            }
        }

        if (context.OPENAI_ENABLE_WEB_SEARCH || context.OPENAI_ENABLE_GITHUB_REPO_READER || context.OPENAI_ENABLE_CODE_INTERPRETER || context.OPENAI_ENABLE_FILE_SEARCH || context.OPENAI_ENABLE_IMAGE_GENERATION || context.OPENAI_ENABLE_MCP) {
            log.info(`[warpLLMParams] OpenAI tools enabled: ${activeTools.filter(t => ['web_search', 'github_repo_reader', 'code_interpreter', 'file_search', 'image_generation', 'mcp'].includes(t)).join(', ')}`);
        }
    }

    // If using xAI Responses API built-in tools, clear custom tools (keep xAI tools)
    // This prevents conflicts as xAI Responses API doesn't support mixing provider tools with custom tools
    const hasXaiTools = context.XAI_ENABLE_WEB_SEARCH || context.XAI_ENABLE_X_SEARCH || context.XAI_ENABLE_CODE_EXECUTION || context.XAI_ENABLE_FILE_SEARCH;
    if (model.provider === 'xai.responses' && hasXaiTools) {
        // Clear only custom tools from validTools, keep xAI server-side tools
        const xaiToolKeys = Object.keys(tools).filter(k =>
            k === 'web_search' || k === 'x_search' || k === 'code_execution' || k === 'file_search'
        );
        const xaiTools = xaiToolKeys.reduce((acc: Record<string, any>, key) => {
            acc[key] = tools[key];
            return acc;
        }, {});

        activeTools = xaiToolKeys;
        tools = xaiTools;
        log.info(`[warpLLMParams] xAI tools enabled, clearing custom tools. Active tools: ${xaiToolKeys.join(', ')}`);
    }

    // Gemini 3 supports combining Google built-in tools with custom function calling
    const hasGoogleNativeTools = context.GOOGLE_ENABLE_GOOGLE_SEARCH
        || context.GOOGLE_ENABLE_CODE_EXECUTION
        || context.GOOGLE_ENABLE_URL_CONTEXT
        || context.GOOGLE_ENABLE_GOOGLE_MAPS
        || context.GOOGLE_ENABLE_FILE_SEARCH
        || context.GOOGLE_ENABLE_ENTERPRISE_WEB_SEARCH;
    const hasGoogleTools = (model.provider.startsWith('google') || model.provider.startsWith('vertex')) && hasGoogleNativeTools;

    // If using Google built-in tools on non-Gemini-3 models, clear custom tools (keep Google tools only)
    // Note: isGemini3 is defined earlier in the Google tools section
    if (hasGoogleTools && model.modelId && !model.modelId.startsWith('gemini-3')) {
        // Clear only custom tools from validTools, keep Google server-side tools
        const googleToolKeys = Object.keys(tools).filter(k =>
            k.startsWith('google_') || k.startsWith('enterprise_') ||
            k === 'code_execution' || k === 'url_context' || k === 'file_search'
        );
        const googleTools = googleToolKeys.reduce((acc: Record<string, any>, key) => {
            acc[key] = tools[key];
            return acc;
        }, {});

        activeTools = googleToolKeys;
        tools = googleTools;
        // only use first system message and last user message
        // params.messages = [params.messages.find(p => p.role === 'system')!, params.messages.findLast(p => p.role === 'user')!];
    }
    // Gemini 3 can use both Google tools and custom tools together.
    // For Gemini 3, tools object already contains both Google tools and custom tools merged above.

    let toolChoice;
    if (activeToolAlias.length > 0 && userText) {
        const choiceResult = await wrapToolChoice(activeToolAlias, userText);
        if (Array.isArray(userMessage.content)) {
            userMessage.content.find(c => c.type === 'text')!.text = choiceResult.message;
        } else {
            userMessage.content = choiceResult.message;
        }
        toolChoice = choiceResult.toolChoices;
    }

    log.info(`[warpLLMParams] activeTools: ${activeTools}`);

    return {
        model,
        messages,
        cache,
        tools,
        activeTools,
        toolChoice,
        context,
    };
}

export type ToolChoice = { type: 'auto' | 'none' | 'required' } | { type: 'tool'; toolName: string };

async function wrapToolChoice(activeToolAlias: string[], message: string): Promise<{
    message: string;
    toolChoices: ToolChoice[] | [];
}> {
    const tool_prefix = '/t-';
    const tools = await getTools();
    let text = message.trim();
    const choices = ['auto', 'none', 'required', ...activeToolAlias];
    const toolChoices = [];
    while (true) {
        const toolAlias = choices.find(t => text.startsWith(`${tool_prefix}${t}`)) || '';
        if (toolAlias) {
            text = text.substring(tool_prefix.length + toolAlias.length).trim();
            const choice = ['auto', 'none', 'required'].includes(toolAlias)
                ? { type: toolAlias as 'auto' | 'none' | 'required' }
                : { type: 'tool', toolName: tools[toolAlias].schema.name };
            toolChoices.push(choice);
        } else {
            break;
        }
    }

    log.info(`All RealtoolChoices: ${JSON.stringify(toolChoices)}`);

    return {
        message: text,
        toolChoices: toolChoices as ToolChoice[],
    };
}

function trimActiveTools(activeTools: string[], toolNames: string[]) {
    return activeTools.length > 0 ? activeTools.filter(name => !toolNames.includes(name)) : [];
}

function recordModelLog({ config, model, record }: { config: AgentUserConfig; model: LLMModel; record: LogStruct }) {
    log.info(`provider: ${model.provider}, modelId: ${model.modelId} `);
    record.start_time = Date.now();
    record.model = model.modelId;
    if (config.ENABLE_ALIAS) {
        const mappedModel = config.MAPPING_VALUE.split('|').map(i => i.split(':')).find(([_, value]) => value === model.modelId);
        record.model = mappedModel?.[0] ?? model.modelId;
    }
}

export function metaDataExtractor(metadata: any, provider: string, content: string, options?: { streamSources?: Array<{ url: string; title: string }>; responseMessages?: any[] }) {
    if (!ENV.ENABLE_SEARCH_SOURCE) {
        return content;
    }

    switch (provider) {
        case 'google.generative-ai':
        case 'google.vertex.chat':
        {
            const { groundingChunks, webSearchQueries, groundingSupports } = metadata?.google?.groundingMetadata || {};
            if (!groundingChunks) {
                return content;
            }

            // const insertTextByByteIndex = (text: string, byteIndex: number, text2Insert: string) => {
            //     const encoder = new TextEncoder();
            //     const decoder = new TextDecoder();
            //     const bytes = encoder.encode(text);
            //     const newBytes = new Uint8Array([...bytes.slice(0, byteIndex), ...encoder.encode(text2Insert), ...bytes.slice(byteIndex)]);
            //     return decoder.decode(newBytes);
            // };

            const addSupportSource = (content: string) => {
                const maxSources = 10; // Limit sources to prevent Telegram rate limiting
                const sources = groundingChunks
                    ?.slice(0, maxSources) // Only take first N sources
                    ?.map((chunk: any, i: number) => {
                        const web = chunk?.web as { title?: string; uri?: string } | undefined;
                        const maps = chunk?.maps as { title?: string; uri?: string; placeId?: string; text?: string } | undefined;
                        const uri = web?.uri ?? maps?.uri ?? '#';
                        const title = web?.title ?? maps?.title;
                        return `[\\[${i + 1}\\]](${uri})`;
                    })
                    .join(' ');

                // const sortedGroundingSupports = (groundingSupports as any[]).sort((a, b) => b.segment.endIndex - a.segment.endIndex);
                if (groundingSupports && Array.isArray(groundingSupports)) {
                    for (const { segment, groundingChunkIndices } of groundingSupports) {
                        const tag = groundingChunkIndices?.map((i: number) => i + 1).join(', ');
                        // const tag = groundingChunkIndices?.map((i: number) => `[[${i + 1}\\]](${groundingChunks[i].web.uri})`).join('');
                        // content = insertTextByByteIndex(content, segment.endIndex, tag);
                        content = content.replace(segment.text, `$&[${tag}]`);
                    }
                }
                return `${content.trimEnd()}\n\n>sources:\n>${sources}`;
                // return `${content}\n## Sources:\n${sources}\n## Search Query:\n${webSearchQueries || ''}`;
                // return content;
            };

            return addSupportSource(content);
        }
        case 'oailike':
        {
            if ((metadata?.pplx?.citations ?? []).length > 0) {
                const replacer = (content: string, urls: string[]) => {
                    for (const [i, url] of Object.entries(urls)) {
                        content = content.replace(new RegExp(`\\[(${+i + 1})\\]`, 'g'), `[\\[$1\\]](${url})`);
                    }
                    return content;
                };
                return replacer(content, metadata?.pplx?.citations);
            }
            if ((metadata?.openai?.citations ?? []).length > 0) {
                const sources = metadata?.openai?.citations?.map(({ url_citation: { title, url } }: { url_citation: { title: string; url: string } }, i: number) => `[\\[${i + 1}\\]](${url})`).join(' ');
                return sources ? `${content.trimEnd()}\n\n>sources:\n>${sources}` : content;
            }
            return content;
        }
        case 'openai.chat':
        case 'openai.responses':
        case 'xai.chat':
        case 'xai.responses':
        {
            // Handle OpenAI/xAI sources from both stream mode and non-stream mode
            let sources: Array<{ url: string; title: string }> = [];

            // Stream mode: sources collected via 'source' events
            if (options?.streamSources && options.streamSources.length > 0) {
                sources = options.streamSources;
            }
            // Non-stream mode: extract sources from response messages
            else if (options?.responseMessages) {
                for (const message of options.responseMessages) {
                    if (message.role === 'assistant' && Array.isArray(message.content)) {
                        for (const part of message.content) {
                            if (part.type === 'source' && part.sourceType === 'url') {
                                sources.push({ url: part.url, title: part.title || part.url });
                            }
                        }
                    }
                }
            }

            if (sources.length === 0) {
                return content;
            }

            const maxSources = 10;

            // 创建 URL 到索引的映射
            const urlToIndex = new Map<string, number>();
            sources.slice(0, maxSources).forEach((source, i) => {
                urlToIndex.set(source.url, i + 1);
            });

            // Google 风格：文本中只保留 [1] 标记，移除内联链接
            let cleanedContent = content;
            for (const [url, index] of urlToIndex) {
                const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                cleanedContent = cleanedContent.replace(
                    new RegExp(`\\[\\[\\d+\\]\\]\\(${escapedUrl}\\)`, 'g'),
                    `[${index}]`,
                );
            }

            // 底部显示可点击链接: [1] [2] 格式
            const formattedSources = sources
                .slice(0, maxSources)
                .map((source, i) => `[\\[${i + 1}\\]](${source.url})`)
                .join(' ');

            return `${cleanedContent.trimEnd()}\n\n>sources:\n>${formattedSources}`;
        }
        default:
            return content;
    }
}

async function handleToolResult({ tools, toolResults, onStream, config, sentVisibleToolResultIds }: { tools: Record<string, any>; toolResults: ToolResultPart[]; onStream: ChatStreamTextHandler | null; config: AgentUserConfig; sentVisibleToolResultIds?: Set<string> }) {
    // Custom tools with send_type === 'message'
    const message_tool = Object.values(tools).filter(({ send_type }) => send_type === 'message').map(({ schema: { name } }) => name);

    // Provider tools that should send messages (OpenAI image_generation, Google/Anthropic code execution, xAI MCP, etc.)
    const provider_message_tools = ['image_generation', 'code_execution', 'code_interpreter', 'mcp'];

    const need_send_result: ToolResult[] = [];
    const sentResults: ToolResultPart[] = [];
    const sentResultIds: string[] = [];
    for (const [index, result] of toolResults.entries()) {
        const { output, toolName } = result;
        const shouldSend = message_tool.includes(toolName) || provider_message_tools.includes(toolName);
        if (!shouldSend) {
            continue;
        }

        const resultId = getVisibleToolResultId(result, index);
        if (sentVisibleToolResultIds?.has(resultId)) {
            replaceVisibleToolOutput(output, toolName);
            continue;
        }

        const visibleResult = extractVisibleToolResult(output, toolName);
        if (visibleResult) {
            need_send_result.push(visibleResult);
            sentResults.push(result);
            sentResultIds.push(resultId);
        }
    }
    if (need_send_result.length > 0) {
        const sender = onStream?.sender;
        const tool_names = toolResults.map(i => i.toolName).filter(name => message_tool.includes(name) || provider_message_tools.includes(name));
        log.info(`start send tool result: ${tool_names.join(', ')}`);
        // TODO: 非流式模式下，无法直接发送工具结果
        if (!sender) {
            return;
        }
        if (isImageOnlyToolResults(need_send_result) && onStream?.flushPendingVisibleToolResults) {
            onStream.pendingVisibleToolResults = [
                ...(onStream.pendingVisibleToolResults || []),
                ...need_send_result,
            ];
            onStream.visibleToolResultSent = true;
            onStream.clearHeartbeat?.();
            sentResultIds.forEach(resultId => sentVisibleToolResultIds?.add(resultId));
            sentResults.forEach(({ output, toolName }) => replaceVisibleToolOutput(output, toolName));
            return;
        }
        await sendToolResult(need_send_result, sender, config);
        onStream.visibleToolResultSent = true;
        onStream.clearHeartbeat?.();
        sentResultIds.forEach(resultId => sentVisibleToolResultIds?.add(resultId));
        // Unable to modify the response message anymore due to:
        // https://github.com/vercel/ai/blob/42fcd32dd81e5071a864943dbdcd4be69a8cae8c/packages/ai/core/generate-text/generate-text.ts#L488
        sentResults.forEach(({ output, toolName }) => replaceVisibleToolOutput(output, toolName));
    }
}

function isImageOnlyToolResults(results: ToolResult[]): boolean {
    const content = results.flatMap(result => result.content);
    return content.length > 0 && content.every(item => item.type === 'image');
}

function withFirstImageCaption(results: ToolResult[], caption: string): ToolResult[] {
    let captionApplied = false;
    return results.map(result => ({
        content: result.content.map((item) => {
            if (!captionApplied && item.type === 'image') {
                captionApplied = true;
                return { ...item, text: caption };
            }
            return item;
        }) as ToolResult['content'],
    }));
}

function getVisibleToolResultId(result: ToolResultPart, index: number): string {
    return `${(result as any).toolCallId || `${result.toolName}:${index}`}:${result.toolName}`;
}

function extractVisibleToolResult(output: any, toolName: string): ToolResult | null {
    if (!output || output.type === 'execution-denied') {
        return null;
    }
    if ('value' in output && output.value?.content) {
        return { content: output.value.content };
    }
    if ('result' in output && typeof output.result === 'string' && output.result.trim()) {
        if (toolName !== 'image_generation') {
            return { content: [{ type: 'text', text: output.result }] };
        }
        return {
            content: [{
                type: 'image',
                text: '',
                data_type: 'base64',
                data: output.result,
                mimeType: 'image/png',
            }],
        };
    }
    return null;
}

function replaceVisibleToolOutput(output: any, toolName: string) {
    if (!output || output.type === 'execution-denied') {
        return;
    }
    const hasError = 'value' in output
        && ((output.value as any)?.content ?? []).some((i: any) => i.type === 'error' || i.is_error);
    if (hasError) {
        return;
    }
    if ('value' in output) {
        output.value = { content: [{ type: 'text', text: 'Data has been sent to user already.' }] };
    } else if ('result' in output) {
        output.result = toolName === 'image_generation'
            ? 'Image has been sent to user already.'
            : 'Data has been sent to user already.';
    }
}

function handleResponseApiMessage(messages: LanguageModelV4Prompt) {
    // Issue: When the message contains inference messages, tool calls and tool results do not contain ref_id.
    // https://github.com/vercel/ai/issues/7099
    // temporary fix: remove reasoning text
    const sanitizedMessages = sanitizeOpenAIResponsePrompt(messages);
    for (const message of sanitizedMessages) {
        if (message.role === 'assistant' && Array.isArray(message.content)) {
            // 移除所有reasoning text
            message.content = message.content.filter(i => i.type !== 'reasoning');
            // 下一条消息不是tool时，移除 reasoning
            // const nextNotTool = messages[i + 1]?.role !== 'tool';
            // nextNotTool && (message.content = message.content.filter(i => i.type !== 'reasoning'));
        }
        // if (message.role === 'tool') {
        //     const prev = messages[i - 1];
        //     // 不是assistant 或者 不包含reasoning
        //     const occurErr = prev?.role !== 'assistant' || !Array.isArray(prev?.content) || !prev?.content.find(i => i.type === 'reasoning');
        //     if (occurErr) {
        //         throw new Error('Please clear history to avoid response api error.');
        //     }
        // }
    }
    return sanitizedMessages.filter((message: any) => {
        if (message.role !== 'assistant' || !Array.isArray(message.content)) {
            return true;
        }
        return message.content.length > 0;
    });
}

export function sanitizeOpenAIResponsePrompt(messages: LanguageModelV4Prompt): LanguageModelV4Prompt {
    return sanitizeOpenAIResponseValue(messages) as LanguageModelV4Prompt;
}

const OPENAI_RESPONSE_REFERENCE_KEYS = new Set(['id', 'item_id', 'itemId']);

function sanitizeOpenAIResponseValue(value: any): any {
    if (Array.isArray(value)) {
        return value
            .map(item => sanitizeOpenAIResponseValue(item))
            .filter(item => item !== undefined);
    }

    if (!isPlainObject(value)) {
        return value;
    }

    if (isOpenAIResponseItemReference(value)) {
        return undefined;
    }

    const sanitized: Record<string, any> = {};
    for (const [key, childValue] of Object.entries(value)) {
        if (shouldDropOpenAIResponseReferenceProperty(key, childValue)) {
            continue;
        }

        const nextValue = sanitizeOpenAIResponseValue(childValue);
        if (nextValue === undefined) {
            continue;
        }
        if ((key === 'providerOptions' || key === 'openai') && isEmptyPlainObject(nextValue)) {
            continue;
        }
        sanitized[key] = nextValue;
    }

    return sanitized;
}

function isOpenAIResponseItemReference(value: Record<string, any>): boolean {
    return value.type === 'item_reference' && isOpenAIResponseItemId(value.id);
}

function shouldDropOpenAIResponseReferenceProperty(key: string, value: unknown): boolean {
    return OPENAI_RESPONSE_REFERENCE_KEYS.has(key) && isOpenAIResponseItemId(value);
}

function isOpenAIResponseItemId(value: unknown): boolean {
    return typeof value === 'string' && /^(msg|rs|fc|ws|fs|ci|ig|mcp|item)_[A-Za-z0-9]/.test(value);
}

function isEmptyPlainObject(value: unknown): boolean {
    return isPlainObject(value) && Object.keys(value).length === 0;
}

function isPlainObject(value: unknown): value is Record<string, any> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}
