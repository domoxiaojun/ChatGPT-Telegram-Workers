/* eslint-disable no-case-declarations */
/* eslint-disable unused-imports/no-unused-vars */
import type { LanguageModelV1ToolCallPart, LanguageModelV1ToolResultPart } from '@ai-sdk/provider';
import type { CoreMessage, CoreUserMessage, LanguageModelV1, LanguageModelV1CallOptions, LanguageModelV1Middleware, LanguageModelV1Prompt, StepResult, TextStreamPart, ToolResultPart } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { LogStruct } from '../log';
import type { ToolResult } from '../tools/types';
import type { ChatStreamTextHandler } from './types';
import {
    extractReasoningMiddleware,
} from 'ai';
import { ENV } from '../config/env';
import { getLogSingleton, log } from '../log';
import { getTools, sendToolResult, validTools } from '../tools';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export interface MessageInfo {
    content: string;
    // reasoning: string;
    occured_error?: boolean;
};

export async function AIMiddleware({ config, activeTools, onStream, toolChoice, messageInfo, chatModel }: { config: AgentUserConfig; activeTools: string[]; onStream: ChatStreamTextHandler | null; toolChoice: ToolChoice[] | []; messageInfo: MessageInfo; chatModel: string }): Promise<LanguageModelV1Middleware & { onChunk: (data: any) => void; onStepFinish: (data: StepResult<any>) => void; onFinish?: (data: any) => void }> {
    let step = 0;
    let rawSystemPrompt: string | undefined;
    const extractReasoning = extractReasoningMiddleware({ tagName: 'think' });
    const tools = await getTools();
    let hasRecordFirstChunkTime = false;
    let record: LogStruct;
    return {
        wrapGenerate: async ({ doGenerate, params, model }) => {
            warpModel(model, config, activeTools, (params.mode as any).toolChoice, chatModel);
            log.info(`modelId: ${model.modelId}`);
            record = getLogSingleton(config, step);
            recordModelLog({ config, model, record });
            const result = await extractReasoning.wrapGenerate!({ doGenerate: () => doGenerate(), doStream: () => model.doStream(params), params, model });
            log.debug(`generate result: ${JSON.stringify(result)}`);
            return result;
        },

        wrapStream: async ({ doStream, params, model }) => {
            warpModel(model, config, activeTools, (params.mode as any).toolChoice, chatModel);
            log.info(`modelId: ${model.modelId}`);
            record = getLogSingleton(config, step);
            recordModelLog({ config, model, record });
            if (params.prompt.at(-1)?.role === 'tool') {
                const toolResults = params.prompt.at(-1)?.content as unknown as LanguageModelV1ToolResultPart[];
                await handleToolResult({ tools, toolResults, onStream, config });
            }
            return extractReasoning.wrapStream!({ doStream: () => doStream(), doGenerate: () => model.doGenerate(params), params, model });
        },

        transformParams: async ({ type, params }) => {
            log.info(`start ${type} call`);
            if (!rawSystemPrompt) {
                rawSystemPrompt = params.prompt.find(i => i.role === 'system')?.content;
            }
            if (toolChoice.length > 0 && step < toolChoice.length && params.mode.type === 'regular') {
                params.mode.toolChoice = toolChoice[step] as any;
                log.info(`toolChoice changed: ${JSON.stringify(toolChoice[step])}`);
                params.mode.tools = params.mode.tools?.filter(i => activeTools.includes(i.name));
            }
            warpMessages(params, tools, activeTools, rawSystemPrompt);

            return params;
        },

        onChunk: ({ chunk }: { chunk: Extract<TextStreamPart<any>, { type: 'reasoning' | 'tool-call' | 'tool-call-streaming-start' | 'tool-call-delta' | 'tool-result' | 'step-start' | 'step-finish' }> }) => {
            if (!hasRecordFirstChunkTime) {
                record.first_chunk_time = Date.now() - record.start_time;
                hasRecordFirstChunkTime = true;
            }
            if (chunk.type === 'tool-call') {
                onStream?.send(`${messageInfo.content.trimEnd()}\n` + `tool call start: \`${chunk.toolName}\``);
                log.info(`start tool: ${chunk.toolName}`);
            }
        },

        onStepFinish: async ({ text, toolResults, usage, request, response, finishReason }: StepResult<any>) => {
            log.info('llm request end');
            log.debug('step text:', text);
            log.debug('step raw request:', request);
            // log.debug('step raw response:', response);

            // record end time
            record.end_time = Date.now();

            // record tool call detail4
            if (toolResults.length > 0) {
                const func_logs = toolResults.map(({ toolName, args, result }) => ({
                    name: toolName,
                    arguments: Object.values(args),
                    ...(result.error && { error: result.error }),
                    ...(result.time && { time: result.time }),
                }));

                // record function log
                record.functions.push(...func_logs);

                // delete time
                // ai sdk无api能调整函数结果，但内部记录stepMessages， result未做深拷贝 由此可以直接对数据直接进行修改
                toolResults.forEach(({ result }) => result.time && (delete result.time));

                log.info(`tool details: ${JSON.stringify(func_logs, null, 2)}`);
                log.debug(`tool results: ${JSON.stringify(toolResults, null, 2)}`);

                const toolNames = [...new Set(toolResults.map(i => i.toolName))];
                log.info(`finish tools: ${toolNames}`);
                onStream?.send(`${messageInfo.content}\n` + `finish tools: \`${toolNames}\``);
            }

            // record token
            if (usage && !Number.isNaN(usage.promptTokens) && !Number.isNaN(usage.completionTokens)) {
                record.tokens = {
                    prompt: usage.promptTokens,
                    completion: usage.completionTokens,
                    // reasoning: usage.reasoningTokens,
                    // cached: usage.cachedTokens,
                };
                log.info(`tokens: ${JSON.stringify(usage)}`);
            } else {
                log.warn('usage is none');
            }

            // reset tool message status
            hasRecordFirstChunkTime = false;
            step++;
        },
        // onFinish: async (result: any) => {
        //     log.debug(`onFinish: ${JSON.stringify(result)}`);
        // },
    };
}

function warpMessages(params: LanguageModelV1CallOptions, tools: Record<string, any>, activeTools: string[], rawSystemPrompt: string | undefined) {
    const { prompt: messages, mode } = params;

    const getSystemContent = () => {
        let systemContent = rawSystemPrompt ?? '';
        // 插入工具prompt
        if (activeTools.length > 0) {
            systemContent += `\nYou can consider using the following tools:\n${activeTools.map(name =>
                `### ${name}\n- desc: ${tools[name]?.schema?.description || ''} \n${tools[name]?.prompt || ''}`,
            ).join('\n\n')}`
            + `\n\n${activeTools.map(name => tools[name]?.prompt && `## For tool \`${name}\`, you should follow these rules:\n - ${tools[name]?.prompt}`)
                .join('\n')}`;
        }
        return systemContent ?? 'You are a helpful assistant';
    };

    const trimMessages = (messages: LanguageModelV1Prompt) => {
        const modifiedMessages: LanguageModelV1Prompt = [];
        for (const [i, message] of messages.entries()) {
            switch (message.role) {
                case 'system':
                    modifiedMessages.push({
                        role: 'system',
                        content: getSystemContent(),
                    });
                    continue;
                case 'assistant':
                    if (message.content.every(i => i.type !== 'tool-call')) {
                        modifiedMessages.push(message);
                    }
                    continue;
                case 'tool':
                    let text = '';
                    const toolNames: Set<string> = new Set();
                    for (const toolResultPart of message.content) {
                        const { toolCallId, toolName, result: { content }, content: arrayResult } = toolResultPart as LanguageModelV1ToolResultPart & { result: { content: unknown } };
                        toolNames.add(toolName);
                        let toolArgs = 'UNKNOWN';
                        if (messages[i - 1]?.role === 'assistant' && (messages[i - 1]?.content as any[])?.some(i => i.type === 'tool-call')) {
                            toolArgs = JSON.stringify((messages[i - 1]?.content as LanguageModelV1ToolCallPart[])?.find(i => i.toolCallId === toolCallId)?.args) || 'UNKNOWN';
                        }
                        text += `#### [tool \`${toolName}\` invoke detail]\n - args: ${toolArgs}\n - result:\n${JSON.stringify(content || arrayResult)}\n\n`;
                    }
                    text = `### Please use the following retrieved data to answer user's question:\n${text}`;
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

    if (activeTools.length === 0) {
        (mode as any).tools = undefined;
    }
    if (ENV.MESSAGE_COMPATIBLE) {
        params.prompt = trimMessages(messages);
    } else {
        const systemMessage = messages.find(i => i.role === 'system');
        if (systemMessage) {
            systemMessage.content = getSystemContent();
        }
    }
}

function warpModel(model: LanguageModelV1, config: AgentUserConfig, activeTools: string[], toolChoice: ToolChoice, chatModel: string) {
    const mutableModel = model as Writeable<LanguageModelV1>;
    const effectiveModel = (activeTools.length > 0 && toolChoice?.type !== 'none') ? (config.TOOL_MODEL || chatModel) : chatModel;
    if (effectiveModel !== mutableModel.modelId) {
        let newModel: LanguageModelV1 | undefined;
        // Not support cross-provider functionality.
        // if (effectiveModel.includes(':')) {
        //     newModel = await createLlmModel(effectiveModel, config);
        //     // mutableModel.provider = newModel.provider;
        //     mutableModel.specificationVersion = newModel.specificationVersion;
        //     mutableModel.doStream = newModel.doStream;
        //     mutableModel.doGenerate = newModel.doGenerate;
        // }
        mutableModel.modelId = newModel?.modelId ?? effectiveModel;
    }
}

export async function warpLLMParams(params: { messages: CoreMessage[]; model: LanguageModelV1; cache?: string[] }, context: AgentUserConfig) {
    const tools = await getTools();

    const messages = params.messages.at(-1) as CoreUserMessage;
    let tool = typeof messages.content === 'string'
        ? await validTools(context)
        : undefined;

    const activeTools = tool?.activeToolAlias.map((t: string) => tools[t]?.schema?.name || t) || [];
    // if vertex use search grounding, do not use other tools
    if (params.model.provider.startsWith('google') && (context.SEARCH_GROUNDING || context.USE_GOOGLE_BUILDIN.length > 0)) {
        activeTools.length = 0;
        tool = undefined;
        // only use first system message and last user message
        // params.messages = [params.messages.find(p => p.role === 'system')!, params.messages.findLast(p => p.role === 'user')!];
    }

    let toolChoice;
    if (tool?.activeToolAlias && tool?.activeToolAlias.length > 0) {
        const userMessageIsString = typeof messages.content === 'string';
        const choiceResult = await wrapToolChoice(tool?.activeToolAlias, userMessageIsString ? messages.content as string : '');
        userMessageIsString && (messages.content = choiceResult.message);
        toolChoice = choiceResult.toolChoices;
    }

    log.info(`[warpLLMParams] activeTools: ${activeTools}`);

    return {
        model: params.model,
        messages: params.messages,
        cache: params.cache,
        tools: tool?.tools,
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

function recordModelLog({ config, model, record }: { config: AgentUserConfig; model: LanguageModelV1; record: LogStruct }) {
    log.info(`provider: ${model.provider}, modelId: ${model.modelId} `);
    record.start_time = Date.now();
    record.model = model.modelId;
    if (config.ENABLE_ALIAS) {
        const mappedModel = config.MAPPING_VALUE.split('|').map(i => i.split(':')).find(([_, value]) => value === model.modelId);
        record.model = mappedModel?.[0] ?? model.modelId;
    }
}

export function metaDataExtractor(metadata: any, provider: string, content: string) {
    if (!metadata || !ENV.ENABLE_SEARCH_SOURCE) {
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
                const sources = groundingChunks
                    ?.map((chunk: any, i: number) => {
                        const web = chunk?.web as { title?: string; uri?: string } | undefined;
                        return `[[${i + 1}\\]](${web?.uri ?? '#'})`;
                    })
                    .join('\x20');

                // const sortedGroundingSupports = (groundingSupports as any[]).sort((a, b) => b.segment.endIndex - a.segment.endIndex);
                for (const { segment, groundingChunkIndices } of groundingSupports) {
                    const tag = groundingChunkIndices?.map((i: number) => i + 1).join(', ');
                    // const tag = groundingChunkIndices?.map((i: number) => `[[${i + 1}\\]](${groundingChunks[i].web.uri})`).join('');
                    // content = insertTextByByteIndex(content, segment.endIndex, tag);
                    content = content.replace(segment.text, `$&[${tag}]`);
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
                        content = content.replace(new RegExp(`\\[(${+i + 1})\\]`, 'g'), `[[$1\\]](${url})`);
                    }
                    return content;
                };
                return replacer(content, metadata?.pplx?.citations);
            }
            if ((metadata?.openai?.citations ?? []).length > 0) {
                const sources = metadata?.openai?.citations?.map(({ url_citation: { title, url } }: { url_citation: { title: string; url: string } }) => `- [${`${title.length > 40 ? `${title.slice(0, 40)}...` : title}`}](${url})`).join('\n>');
                return sources ? `${content.trimEnd()}\n\n>sources:\n>${sources}` : content;
            }
            return content;
        }
        default:
            return content;
    }
}

async function handleToolResult({ tools, toolResults, onStream, config }: { tools: Record<string, any>; toolResults: ToolResultPart[]; onStream: ChatStreamTextHandler | null; config: AgentUserConfig }) {
    const message_tool = Object.values(tools).filter(({ send_type }) => send_type === 'message').map(({ schema: { name } }) => name);
    const need_send_result: ToolResult[] = [];
    for (const { result, toolName } of toolResults) {
        if (message_tool.includes(toolName)) {
            need_send_result.push(result as ToolResult);
        }
    }
    if (need_send_result.length > 0) {
        const sender = onStream?.sender;
        // TODO: 非流式模式下，无法直接发送工具结果
        sender && await sendToolResult(need_send_result, sender, config);
        need_send_result.forEach((result) => {
            result.content = [{ type: 'text', text: 'data has been sent to user.' }];
        });
    }
}
