/* eslint-disable no-case-declarations */
import type { LanguageModelV3 } from '@ai-sdk/provider';
import type { ModelMessage, StepResult, TextStreamPart } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { MessageInfo, ToolChoice } from './model_middleware';
import type { ChatStreamTextHandler, OpenAIFuncCallData, ResponseMessage } from './types';
import { generateText, stepCountIs, streamText, TypeValidationError, wrapLanguageModel } from 'ai';
import { ENV } from '../config/env';
import { log } from '../log';
import { SEGMENTATION_MARK } from '../telegram/utils/md2tgmd';
import { AIMiddleware, metaDataExtractor } from './model_middleware';
import { Stream } from './stream';

export interface SseChatCompatibleOptions {
    streamBuilder?: (resp: Response, controller: AbortController) => Stream;
    contentExtractor?: (data: object) => string | null;
    fullContentExtractor?: (data: object) => string | null;
    functionCallExtractor?: (data: object, call_list: any[]) => void;
    fullFunctionCallExtractor?: (data: object) => OpenAIFuncCallData[] | null;
    errorExtractor?: (data: object) => string | null;
}

function fixOpenAICompatibleOptions(options: SseChatCompatibleOptions | null): SseChatCompatibleOptions {
    options = options || {};
    options.streamBuilder = options.streamBuilder || function (r, c) {
        return new Stream(r, c);
    };
    options.contentExtractor = options.contentExtractor || function (d: any) {
        return d?.choices?.[0]?.delta?.content;
    };
    options.fullContentExtractor = options.fullContentExtractor || function (d: any) {
        return d.choices?.[0]?.message.content;
    };
    options.functionCallExtractor
        = options.functionCallExtractor
            || function (d: any, call_list: OpenAIFuncCallData[]) {
                const chunk = d?.choices?.[0]?.delta?.tool_calls;
                if (!Array.isArray(chunk))
                    return;
                for (const a of chunk) {
                    if (!Object.hasOwn(a, 'index')) {
                        throw new Error(`The function chunk don't have index: ${JSON.stringify(chunk)}`);
                    }
                    if (a?.type === 'function') {
                        call_list[a.index] = { id: a.id, type: a.type, function: a.function };
                    } else {
                        call_list[a.index].function.arguments += a.function.arguments;
                    }
                }
            };
    options.fullFunctionCallExtractor
        = options.fullFunctionCallExtractor
            || function (d: any) {
                return d?.choices?.[0]?.message?.tool_calls;
            };
    options.errorExtractor = options.errorExtractor || function (d: any) {
        return d.error?.message;
    };
    return options;
}

export function isJsonResponse(resp: Response): boolean {
    return resp.headers.get('content-type')?.includes('json') || false;
}

export function isEventStreamResponse(resp: Response): boolean {
    const types = ['application/stream+json', 'text/event-stream'];
    const content = resp.headers.get('content-type') || '';
    for (const type of types) {
        if (content.includes(type)) {
            return true;
        }
    }
    return false;
}

type OnResult = ((result: any) => Promise<any>) | null;

export async function requestChatCompletions(url: string, header: Record<string, string>, body: any, onStream: ChatStreamTextHandler | null, onResult: OnResult = null, options: SseChatCompatibleOptions | null = null): Promise<string> {
    const controller = new AbortController();
    const { signal } = controller;
    const messageInfo: MessageInfo = {
        content: '',
        occured_error: false,
    };

    let timeoutID = null;
    if (ENV.CHAT_COMPLETE_API_TIMEOUT > 0 && !body?.model?.includes('o1')) {
        timeoutID = setTimeout(() => controller.abort(), ENV.CHAT_COMPLETE_API_TIMEOUT * 1e3);
    }

    log.info('start request llm');

    log.debug('request url, headers, body', url, header, body);
    const resp = await fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body),
        signal,
    });

    clearTimeoutID(timeoutID);

    options = fixOpenAICompatibleOptions(options);

    if (onStream && resp.ok && isEventStreamResponse(resp)) {
        const stream = options.streamBuilder?.(resp, controller);
        if (!stream) {
            throw new Error('Stream builder error');
        }
        return streamHandler(stream, options.contentExtractor!, onStream, messageInfo);
    }

    if (!isJsonResponse(resp)) {
        throw new Error(resp.statusText);
    }

    const result = await resp.json();

    if (!result) {
        throw new Error('Empty response');
    }

    if (options.errorExtractor?.(result)) {
        throw new Error(options.errorExtractor?.(result) || 'Unknown error');
    }

    try {
        await onResult?.(result);
        return options.fullContentExtractor?.(result) || '';
    } catch (e) {
        console.error(e);
        throw new Error(JSON.stringify(result));
    }
}

function clearTimeoutID(timeoutID: any) {
    if (timeoutID)
        clearTimeout(timeoutID);
}

export async function streamHandler(stream: AsyncIterable<any>, contentExtractor: (data: any) => string | null, onStream: ChatStreamTextHandler, messageInfo: MessageInfo): Promise<string> {
    let lengthDelta = 0;
    let updateStep = 5;
    const maxLength = 10_000;

    try {
        for await (const part of stream) {
            const textPart = contentExtractor(part);
            if (textPart === null || textPart === undefined || textPart === '') {
                continue;
            }
            // 已有delta + chunk的长度
            lengthDelta += textPart.length;
            messageInfo.content += textPart;

            if (lengthDelta > updateStep) {
                lengthDelta = 0;
                updateStep = Math.min(updateStep + 40, maxLength);
                onStream.send(`${messageInfo.content.trimEnd()}●`);
            }
        }
    } catch (e) {
        if (messageInfo.content === '') {
            throw e;
        }
        console.error((e as Error).message, (e as Error).stack);
        let content: string | undefined;
        if (e instanceof TypeValidationError) {
            content = (e.value as any)?.choices?.[0]?.delta?.content;
        }
        messageInfo.content += (content ?? `\n\n\`\`\`Error\n${(e as Error).message}\n\`\`\``);
        messageInfo.occured_error = true;
    }

    return messageInfo.content;
}

function appendStreamSources(content: string, sources: Array<{ url: string; title: string }>): string {
    if (!sources || sources.length === 0) {
        return content;
    }

    const maxSources = 10; // 限制显示数量，防止 Telegram 限流

    // 创建 URL 到索引的映射
    const urlToIndex = new Map<string, number>();
    sources.slice(0, maxSources).forEach((source, i) => {
        urlToIndex.set(source.url, i + 1);
    });

    // Google 风格：文本中只保留 [1] 标记，移除内联链接
    // 将文本中的 [[N]](url) 替换为 [N]
    let cleanedContent = content;
    for (const [url, index] of urlToIndex) {
        // 转义 URL 中的特殊字符用于正则表达式
        const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // 替换 [[任意数字]](url) 为 [index]
        cleanedContent = cleanedContent.replace(
            new RegExp(`\\[\\[\\d+\\]\\]\\(${escapedUrl}\\)`, 'g'),
            `[${index}]`
        );
    }

    // 底部显示 [[1]](url) [[2]](url) 格式的完整链接
    const formattedSources = sources
        .slice(0, maxSources)
        .map((source, i) => `[[${i + 1}\\]](${source.url})`)
        .join('\x20');

    return `${cleanedContent.trimEnd()}\n\n>sources:\n>${formattedSources}`;
}

export async function requestChatCompletionsV2({ model, messages, tools, activeTools, toolChoice, context, cache }: { model: LanguageModelV3; toolModel?: LanguageModelV3; prompt?: string; messages: ModelMessage[]; tools?: any; activeTools: string[]; toolChoice?: ToolChoice[] | undefined; context: AgentUserConfig; cache?: string[] }, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> {
    // DEBUG: Log messages before sending to SDK
    log.info(`[requestChatCompletionsV2] messages before SDK: ${JSON.stringify(messages.map(m => {
        if (m.role === 'user' && Array.isArray(m.content)) {
            return { role: m.role, content: m.content.map(c => c.type === 'file' ? { type: c.type, mediaType: (c as any).mediaType } : { type: c.type }) };
        }
        return { role: m.role };
    }))}`);

    // 引入多轮对话 拼接提示
    const messageInfo: MessageInfo = {
        content: cache?.join() ?? '',
        occured_error: false,
    };
    const { prepareStepPre, onStepFinish, onChunk, ...middleware } = await AIMiddleware({
        config: context,
        activeTools,
        onStream,
        toolChoice: toolChoice || [],
        chatModel: model.modelId,
        messageInfo,
    });

    const handeredParams = await combineParams({ context, middleware, model, messages, activeTools, tools, prepareStepPre, onStepFinish, onChunk });

    let responseMessages: ResponseMessage[] = [];
    let contentFull = '';

    if (onStream !== null) {
        // const stream = streamText({ ...hander_params, ...mockParams(middleware) });
        const stream = streamText(handeredParams);
        const dataExtractor = thinkingExtractor(messageInfo);

        contentFull = await streamHandler(stream.fullStream, dataExtractor, onStream, messageInfo);
        responseMessages = messageInfo.occured_error ? [{ role: 'assistant', content: contentFull }] : (await stream.response).messages;
        contentFull = messageInfo.occured_error ? contentFull : metaDataExtractor(await stream.providerMetadata, model.provider, contentFull);

        // 附加 xAI sources (从 stream 收集的)
        if ((model.provider === 'xai.chat' || model.provider === 'xai.responses') && (messageInfo as any).sources && (messageInfo as any).sources.length > 0) {
            contentFull = appendStreamSources(contentFull, (messageInfo as any).sources);
        }

        // Handle empty response from server-side tools (Google, Anthropic, etc.)
        // When server-side tools execute, they may return tool-result in the same response
        // without generating any text. We need to make another request to get the actual response.
        const streamResponse = await stream.response;
        const hasToolResults = streamResponse.messages.some(msg =>
            msg.role === 'tool' ||
            (msg.role === 'assistant' && Array.isArray(msg.content) &&
             msg.content.some((part: any) => part.type === 'tool-call'))
        );

        if (!contentFull.trim() && hasToolResults) {
            log.warn('Empty response detected after tool execution, making follow-up request for AI response');

            // Make a follow-up request with all messages including tool results
            const followUpMessages = [...messages, ...responseMessages];
            const followUpParams = await combineParams({
                context,
                middleware,
                model,
                messages: followUpMessages,
                activeTools: [], // No tools for follow-up to avoid loops
                tools: undefined,
                prepareStepPre,
                onStepFinish,
                onChunk
            });

            const followUpStream = streamText(followUpParams);
            const followUpExtractor = thinkingExtractor(messageInfo);

            contentFull = await streamHandler(followUpStream.fullStream, followUpExtractor, onStream, messageInfo);
            const followUpResponse = await followUpStream.response;
            responseMessages = [...responseMessages, ...followUpResponse.messages];
            contentFull = metaDataExtractor(await followUpStream.providerMetadata, model.provider, contentFull);

            log.info(`Follow-up request completed, got response: ${contentFull.substring(0, 100)}...`);
        }
    } else {
        const result = await generateText(handeredParams);
        contentFull = `${result.reasoning ? `>\`Thought for several seconds\`\n>${(result.reasoningText ?? '').trim().replace(/\n/g, '\n>')}\n>✹\n` : ''}${result.text}`;
        responseMessages = result.response.messages;
        contentFull = metaDataExtractor(result.providerMetadata, model.provider, contentFull);

        // Handle empty response from server-side tools for non-streaming mode
        const hasToolResults = result.response.messages.some(msg =>
            msg.role === 'tool' ||
            (msg.role === 'assistant' && Array.isArray(msg.content) &&
             msg.content.some((part: any) => part.type === 'tool-call'))
        );

        if (!contentFull.trim() && hasToolResults) {
            log.warn('Empty response detected after tool execution (non-stream), making follow-up request');

            const followUpMessages = [...messages, ...responseMessages];
            const followUpParams = await combineParams({
                context,
                middleware,
                model,
                messages: followUpMessages,
                activeTools: [],
                tools: undefined,
                prepareStepPre,
                onStepFinish,
                onChunk
            });

            const followUpResult = await generateText(followUpParams);
            contentFull = `${followUpResult.reasoning ? `>\`Thought for several seconds\`\n>${(followUpResult.reasoningText ?? '').trim().replace(/\n/g, '\n>')}\n>✹\n` : ''}${followUpResult.text}`;
            responseMessages = [...responseMessages, ...followUpResult.response.messages];
            contentFull = metaDataExtractor(followUpResult.providerMetadata, model.provider, contentFull);

            log.info(`Follow-up request completed (non-stream), got response: ${contentFull.substring(0, 100)}...`);
        }
    }

    return { messages: responseMessages, content: contentFull };
}

function thinkingExtractor(messageInfo: MessageInfo) {
    let thinkingStart = false;
    let thinkingStartTime: undefined | number;
    let reasoningBuffer = '';
    let lastOutputTime = 0;
    const thinkingTag = ENV.EXPANDABLE_THINKING ? '**>`Thinking\.\.\.`' : '>`Thinking\.\.\.`';
    const sources: Array<{ url: string; title: string }> = [];

    // 存储 sources 到 messageInfo 以便后续处理
    (messageInfo as any).sources = sources;

    return (data: TextStreamPart<any>) => {
        switch (data.type) {
            case 'reasoning-start':
                if (!ENV.SHOW_THINKING_TEXT) {
                    return '';
                }
                if (!thinkingStart) {
                    thinkingStart = true;
                    thinkingStartTime = Date.now();
                    reasoningBuffer = '';
                    lastOutputTime = Date.now();
                    return thinkingTag;
                }
                return '';
            case 'reasoning-delta':
                if (!ENV.SHOW_THINKING_TEXT) {
                    return '';
                }
                // 积累思考文本
                reasoningBuffer += data.text;
                const now = Date.now();

                // 当积累到足够长度、遇到句末标点、或距上次输出时间超过500ms时输出
                if (reasoningBuffer.length >= 50 ||
                    /[。！？.!?]\s*$/.test(reasoningBuffer.trim()) ||
                    (now - lastOutputTime > 500 && reasoningBuffer.length >= 20)) {
                    const output = `\n>${reasoningBuffer.replace(/\n/g, '\n>')}`;
                    reasoningBuffer = '';
                    lastOutputTime = now;
                    return output;
                }
                return '';
            case 'reasoning-end':
                if (!ENV.SHOW_THINKING_TEXT) {
                    return '';
                }
                // 输出剩余的缓冲内容
                let output = '';
                if (reasoningBuffer.length > 0) {
                    output = `\n>${reasoningBuffer.replace(/\n/g, '\n>')}`;
                    reasoningBuffer = '';
                }
                return output;
            case 'text-start':
                if (!thinkingStart)
                    return '';
                thinkingStart = false;
                const thinkingTime = ((Date.now() - thinkingStartTime!) / 1e3).toFixed(1);
                messageInfo.content = messageInfo.content
                    .replace(thinkingTag, `>\`Thought for ${thinkingTime} seconds\``)
                    // remove trailing blank lines
                    .replace(/(\n>)*$/, '')
                    // three or more newlines are trimmed to 2 newlines
                    .replace(/(\n>){3,}$/g, '\n>\n>');
                return `\n>✹\n${SEGMENTATION_MARK}\n`;
            case 'text-delta':
                return data.text;
            case 'text-end':
                return '';
            case 'source':
                // xAI web_search/x_search sources
                if (ENV.ENABLE_SEARCH_SOURCE && data.sourceType === 'url') {
                    sources.push({
                        url: data.url,
                        title: data.title || data.url,
                    });
                }
                return '';
            case 'error':
                throw data.error;
            default:
                return '';
        }
    };
}

async function combineParams({ context, middleware, model, messages, activeTools, tools, prepareStepPre, onStepFinish, onChunk }: { context: AgentUserConfig; middleware: any; model: LanguageModelV3; messages: ModelMessage[]; activeTools: string[]; tools: any; prepareStepPre: (middleware: (...args: any[]) => any) => any; onStepFinish: (data: StepResult<any>) => void; onChunk: (data: { chunk: TextStreamPart<any> }) => void }) {
    // Build Anthropic provider options with cache control and tool streaming
    const anthropicOptions: Record<string, any> = {
        ...context.ANTHROPIC_PROVIDER_OPTIONS,
    };

    // Add tool streaming support for Anthropic
    if (context.ANTHROPIC_ENABLE_TOOL_STREAMING !== undefined) {
        anthropicOptions.toolStreaming = context.ANTHROPIC_ENABLE_TOOL_STREAMING;
    }

    // Add structured output mode for Anthropic
    if (context.ANTHROPIC_STRUCTURED_OUTPUT_MODE && context.ANTHROPIC_STRUCTURED_OUTPUT_MODE !== 'auto') {
        anthropicOptions.structuredOutputMode = context.ANTHROPIC_STRUCTURED_OUTPUT_MODE;
    }

    const providerOptions = {
        openai: context.OPENAI_PROVIDER_OPTIONS,
        anthropic: anthropicOptions,
        google: context.GOOGLE_PROVIDER_OPTIONS,
        xai: context.XAI_PROVIDER_OPTIONS,
        'oailike.chat': context.OAILIKE_PROVIDER_OPTIONS,
    };

    // Add cache control and context management for Anthropic
    if (model.provider === 'anthropic.messages') {
        // Context Management - Clean up old tool calls to reduce context length
        if (context.ANTHROPIC_ENABLE_CONTEXT_MANAGEMENT) {
            const contextManagementConfig: any = {
                edits: [],
            };

            // Clear old tool uses
            const clearToolUsesConfig: any = {
                type: 'clear_tool_uses_20250919',
            };

            // Trigger configuration
            if (context.ANTHROPIC_CONTEXT_CLEAR_TRIGGER === 'auto') {
                // Auto mode: trigger based on tool uses count
                clearToolUsesConfig.trigger = {
                    type: 'tool_uses',
                    value: context.ANTHROPIC_CONTEXT_KEEP_RECENT + 2, // Trigger after N+2 tool uses
                };
            }
            // Manual mode: no trigger (user controls when to clear)

            // Keep recent tool uses
            if (context.ANTHROPIC_CONTEXT_KEEP_RECENT > 0) {
                clearToolUsesConfig.keep = {
                    type: 'tool_uses',
                    value: context.ANTHROPIC_CONTEXT_KEEP_RECENT,
                };
            }

            // Clear at least N tokens
            if (context.ANTHROPIC_CONTEXT_CLEAR_AT_LEAST > 0) {
                clearToolUsesConfig.clearAtLeast = {
                    type: 'input_tokens',
                    value: context.ANTHROPIC_CONTEXT_CLEAR_AT_LEAST * 1000, // Convert to tokens (assume 1k tokens per unit)
                };
            }

            // Clear tool inputs
            if (context.ANTHROPIC_CONTEXT_CLEAR_TOOL_INPUTS) {
                clearToolUsesConfig.clearToolInputs = true;
            }

            // Exclude tools
            if (context.ANTHROPIC_CONTEXT_EXCLUDE_TOOLS.length > 0) {
                clearToolUsesConfig.excludeTools = context.ANTHROPIC_CONTEXT_EXCLUDE_TOOLS;
            }

            contextManagementConfig.edits.push(clearToolUsesConfig);

            // Clear old thinking content (for reasoning models)
            if (context.ANTHROPIC_ENABLE_THINKING_CLEANUP && context.ANTHROPIC_THINKING_KEEP_RECENT > 0) {
                contextManagementConfig.edits.push({
                    type: 'clear_thinking_20250919',
                    trigger: {
                        type: 'tool_uses',
                        value: context.ANTHROPIC_THINKING_KEEP_RECENT + 1,
                    },
                    keep: {
                        type: 'tool_uses',
                        value: context.ANTHROPIC_THINKING_KEEP_RECENT,
                    },
                });
            }

            anthropicOptions.contextManagement = contextManagementConfig;
        }

        // Cache Control - Mark messages and tools as cacheable
        if (context.ANTHROPIC_ENABLE_CACHE_CONTROL) {
            // Mark system message as cacheable
            const systemMessage = messages.find(m => m.role === 'system');
            if (systemMessage && !systemMessage.providerOptions) {
                systemMessage.providerOptions = {
                    anthropic: {
                        cacheControl: { type: 'ephemeral' },
                    },
                };
            }

            // Mark tools as cacheable if tools exist
            if (tools && Object.keys(tools).length > 0) {
                // Get the last tool and mark it as cacheable
                // This follows the AI SDK pattern of caching the last tool definition
                const toolKeys = Object.keys(tools);
                const lastToolKey = toolKeys[toolKeys.length - 1];
                const lastTool = tools[lastToolKey];

                if (lastTool && typeof lastTool === 'object' && !lastTool.providerOptions) {
                    lastTool.providerOptions = {
                        anthropic: {
                            cacheControl: { type: 'ephemeral' },
                        },
                    };
                }
            }
        }
    }

    // For server-side tools (Google, Anthropic, xAI, OpenAI), we need to continue steps
    // to allow the AI to generate a response after tool execution.
    // Otherwise, the first step only contains tool calls without any text response.
    const needsContinueSteps = activeTools.some(toolName =>
        toolName === 'google_search' ||
        toolName === 'code_execution' ||
        toolName === 'url_context' ||
        toolName === 'google_maps' ||
        toolName === 'file_search' ||
        toolName === 'enterprise_web_search' ||
        toolName === 'web_search' ||
        toolName === 'x_search' ||
        toolName === 'web_fetch' ||
        toolName === 'code_interpreter' ||
        toolName === 'image_generation' ||
        toolName === 'mcp'
    );

    const finalContinueSteps = needsContinueSteps || context.CONTINUE_STEP;
    log.info(`[combineParams] activeTools: ${activeTools.join(',')}, needsContinueSteps: ${needsContinueSteps}, CONTINUE_STEP: ${context.CONTINUE_STEP}, final: ${finalContinueSteps}`);

    return {
        model: wrapLanguageModel({
            model,
            middleware,
        }),
        providerOptions,
        messages,
        experimental_continueSteps: finalContinueSteps,
        maxRetries: context.MAX_RETRIES,
        temperature: (activeTools?.length || 0) > 0 ? context.FUNCTION_CALL_TEMPERATURE : context.CHAT_TEMPERATURE,
        tools,
        maxTokens: context.MAX_TOKENS,
        activeTools,
        prepareStep: prepareStepPre(middleware),
        stopWhen: stepCountIs(context.MAX_STEPS),
        onStepFinish,
        onChunk,
        ...(ENV.CHAT_TOTAL_DURATION_LIMIT > 0 && { abortSignal: AbortSignal.timeout(ENV.CHAT_TOTAL_DURATION_LIMIT * 1e3) }),
    };
}
