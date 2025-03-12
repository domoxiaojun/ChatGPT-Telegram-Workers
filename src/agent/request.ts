import type { CoreMessage, LanguageModelV1, StepResult, TextStreamPart, ToolCallPart, ToolResultPart } from 'ai';
import type { ToolChoice } from '.';
import type { AgentUserConfig } from '../config/env';
import type { MessageInfo } from './model_middleware';
import type { ChatStreamTextHandler, OpenAIFuncCallData, ResponseMessage } from './types';
import { generateText, streamText, TypeValidationError, wrapLanguageModel } from 'ai';
import { createLlmModel } from '.';
import { ENV } from '../config/env';
import { log } from '../log/logger';
import { manualRequestTool } from '../tools';
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

export async function streamHandler(stream: AsyncIterable<any>, contentExtractor: (data: any) => string | null, onStream: ChatStreamTextHandler, messageInfo: MessageInfo, errorReferencer: boolean[] = [false]): Promise<string> {
    log.info(`start handle stream`);

    let lengthDelta = 0;
    let updateStep = 5;
    let lastChunk = '';
    const maxLength = 10_000;

    try {
        for await (const part of stream) {
            const textPart = contentExtractor(part);
            if (textPart === null || textPart === '') {
                continue;
            }
            // 已有delta + 上次chunk的长度
            lengthDelta += lastChunk.length;
            // 当前内容为上次迭代后的数据 （减少一次迭代）
            messageInfo.content += lastChunk;
            // 更新chunk
            lastChunk = textPart;

            if (lastChunk && lengthDelta > updateStep) {
                lengthDelta = 0;
                updateStep = Math.min(updateStep + 40, maxLength);
                onStream.send(`${messageInfo.content.trimEnd()}●`);
            }
        }
        messageInfo.content += lastChunk;
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
        errorReferencer[0] = true;
    }

    return messageInfo.content;
}

export async function requestChatCompletionsV2({ model, messages, tools, activeTools, toolChoice, context, cache }: { model: LanguageModelV1; toolModel?: LanguageModelV1; prompt?: string; messages: CoreMessage[]; tools?: any; activeTools?: string[]; toolChoice?: ToolChoice[] | undefined; context: AgentUserConfig; cache?: string[] }, onStream: ChatStreamTextHandler | null): Promise<{ messages: ResponseMessage[]; content: string }> {
    // 引入多轮对话 拼接提示
    const messageInfo: MessageInfo = {
        content: cache?.join() ?? '',
    };
    const middleware = AIMiddleware({
        config: context,
        activeTools: activeTools || [],
        onStream,
        toolChoice: toolChoice || [],
        chatModel: model.modelId,
        messageInfo,
    });
    const hander_params = {
        model: wrapLanguageModel({
            model: activeTools?.length ? await createLlmModel(context.TOOL_MODEL, context) : model,
            middleware,
        }),
        messages,
        maxSteps: context.MAX_STEPS,
        experimental_continueSteps: context.CONTINUE_STEP,
        maxRetries: context.MAX_RETRIES,
        temperature: (activeTools?.length || 0) > 0 ? context.FUNCTION_CALL_TEMPERATURE : context.CHAT_TEMPERATURE,
        tools,
        maxTokens: context.MAX_TOKENS,
        activeTools,
        onStepFinish: middleware.onStepFinish as (data: StepResult<any>) => void,
    };
    let responseMessages: ResponseMessage[] = [];
    let contentFull = '';
    const errorReferencer = [false];

    if (onStream !== null /* && params.model.modelId !== 'gpt-4o-audio-preview' */) {
        // const stream = streamText({ ...hander_params, ...mockParams(middleware) });
        const stream = streamText({
            ...hander_params,
            onChunk: middleware.onChunk as (data: any) => void,
        });
        const contentExtractor = (() => {
            let thinkingStart = false;
            let thinkingEnd = false;
            let thinkingStartTime: undefined | number;
            const thinkingTag = '>`Thinking\\.\\.\\.`';
            return (data: TextStreamPart<any>) => {
                switch (data.type) {
                    case 'reasoning':
                        if (!thinkingStart) {
                            thinkingStart = true;
                            thinkingStartTime = Date.now();
                            // thinking转为引用
                            return `${thinkingTag}\n>${data.textDelta.replace(/\n/g, '\n>')}`;
                        }
                        return data.textDelta.replace(/\n/g, '\n>');
                    case 'text-delta':
                    case 'step-finish':
                    case 'finish':
                        if (thinkingStart && !thinkingEnd) {
                            thinkingEnd = true;
                            const thinkingTime = ((Date.now() - thinkingStartTime!) / 1e3).toFixed(1);
                            messageInfo.content = messageInfo.content
                                .replace(thinkingTag, `>\`Thought for ${thinkingTime} seconds\``);
                            return `\n>✹\n${data.type === 'text-delta' ? data.textDelta : ''}`;
                        }
                        return data.type === 'text-delta' ? data.textDelta : '';
                    case 'error':
                        throw data.error;
                    default:
                        return '';
                }
            };
        })();

        contentFull = await streamHandler(stream.fullStream, contentExtractor, onStream, messageInfo, errorReferencer);
        responseMessages = errorReferencer[0] ? [{ role: 'assistant', content: contentFull }] : (await stream.response).messages;
        contentFull = errorReferencer[0] ? contentFull : metaDataExtractor(await stream.providerMetadata, model.provider, contentFull);
    } else {
        const result = await generateText(hander_params);
        contentFull = `${result.reasoning ? `>\`Thinking\`\n>${result.reasoning.replace(/\n/g, '\n>')}\n\n` : ''}${result.text}`;
        responseMessages = result.response.messages;
        contentFull = metaDataExtractor(await result.providerMetadata, model.provider, contentFull);
    }
    try {
        // when last message is tool, avoid ai message not sent complete
        const lastMessageContent = responseMessages.at(-1)?.content;
        if (contentFull.trim() !== '' && Array.isArray(lastMessageContent) && (lastMessageContent as (ToolCallPart | ToolResultPart)[]).some(c => c.type === 'tool-call') && onStream) {
            await onStream.end?.(contentFull);
        }
        await manualRequestTool(responseMessages, context);
    } catch (e) {
        if (contentFull.trim() === '') {
            throw e;
        }
        log.error((e as Error).message, (e as Error).stack);
        responseMessages.push({
            role: 'tool',
            content: [{
                type: 'tool-result',
                toolCallId: 'tool-call-id',
                toolName: 'tool-name',
                result: {
                    result: `\`\`\`Error\n${(e as Error).message}\n\`\`\``,
                },
            }],
        });
    }

    return {
        messages: responseMessages.map(({ role, content }) => {
            if (role === 'tool') {
                content.forEach((i) => {
                    if (i.type === 'tool-result') {
                        i.result = (i.result as { result: any }).result;
                    }
                });
            }
            return { role, content };
        }) as ResponseMessage[],
        content: contentFull,
    };
}
