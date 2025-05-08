/* eslint-disable no-case-declarations */
/* eslint-disable unused-imports/no-unused-vars */
import type { LanguageModelV1ToolCallPart, LanguageModelV1ToolResultPart } from '@ai-sdk/provider';
import type { CoreMessage, CoreUserMessage, LanguageModelV1, LanguageModelV1CallOptions, LanguageModelV1Middleware, LanguageModelV1Prompt, StepResult, TextStreamPart } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { ChatStreamTextHandler } from './types';
import {
    extractReasoningMiddleware,
} from 'ai';
import { ENV } from '../config/env';
import { getLogSingleton, log } from '../log';
import { getTools, vaildTools } from '../tools';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export interface MessageInfo {
    content: string;
    // reasoning: string;
};

export async function AIMiddleware({ config, activeTools, onStream, toolChoice, messageInfo, chatModel }: { config: AgentUserConfig; activeTools: string[]; onStream: ChatStreamTextHandler | null; toolChoice: ToolChoice[] | []; messageInfo: MessageInfo; chatModel: string }): Promise<LanguageModelV1Middleware & { onChunk: (data: any) => void; onStepFinish: (data: StepResult<any>, context: AgentUserConfig) => void }> {
    let startTime: number | undefined;
    let sendToolCall = false;
    let step = 0;
    let rawSystemPrompt: string | undefined;
    const extractReasoning = extractReasoningMiddleware({ tagName: 'think' });
    const tools = await getTools();
    return {
        wrapGenerate: async ({ doGenerate, params, model }) => {
            warpModel(model, config, activeTools, (params.mode as any).toolChoice, chatModel);
            log.info(`modelId: ${model.modelId}`);
            recordModelLog(config, model, activeTools, (params.mode as any).toolChoice);
            const result = await extractReasoning.wrapGenerate!({ doGenerate: () => doGenerate(), doStream: () => model.doStream(params), params, model });
            log.debug(`doGenerate result: ${JSON.stringify(result)}`);
            return result;
        },

        wrapStream: async ({ doStream, params, model }) => {
            warpModel(model, config, activeTools, (params.mode as any).toolChoice, chatModel);
            log.info(`modelId: ${model.modelId}`);
            recordModelLog(config, model, activeTools, (params.mode as any).toolChoice);
            return extractReasoning.wrapStream!({ doStream: () => doStream(), doGenerate: () => model.doGenerate(params), params, model });
        },

        transformParams: async ({ type, params }) => {
            log.info(`start ${type} call`);
            startTime = Date.now();
            if (!rawSystemPrompt) {
                rawSystemPrompt = params.prompt.find(i => i.role === 'system')?.content;
            }
            const logs = getLogSingleton(config);
            logs.ongoing.push({ name: 'chat', startTime });
            if (toolChoice.length > 0 && step < toolChoice.length && params.mode.type === 'regular') {
                params.mode.toolChoice = toolChoice[step] as any;
                log.info(`toolChoice changed: ${JSON.stringify(toolChoice[step])}`);
                params.mode.tools = params.mode.tools?.filter(i => activeTools.includes(i.name));
            }
            warpMessages(params, tools, activeTools, rawSystemPrompt);
            return params;
        },

        onChunk: ({ chunk }: { chunk: Extract<TextStreamPart<any>, { type: 'reasoning' | 'tool-call' | 'tool-call-streaming-start' | 'tool-call-delta' | 'tool-result' }> }) => {
            if (chunk.type === 'tool-call' && !sendToolCall) {
                onStream?.send(`${messageInfo.content}...\n` + `tool call will start: \`${chunk.toolName}\``);
                sendToolCall = true;
                log.info(`will start tool: ${chunk.toolName}`);
            }
        },

        onStepFinish: (data: StepResult<any>) => {
            const { text, toolResults, finishReason, usage, request, response } = data;
            const logs = getLogSingleton(config);
            log.info('llm request end');
            log.debug('step text:', text);
            log.debug('step raw request:', request);
            // log.debug('step raw response:', response);
            const time = ((Date.now() - startTime!) / 1e3).toFixed(1);
            if (toolResults.length > 0) {
                if (toolResults.find(i => i.result === '')) {
                    throw new Error('Function result is empty');
                }
                let maxFuncTime = 0;
                const func_logs = toolResults.map(({ toolName, args, result }) => {
                    result.time && logs.functionTime.push(result.time);
                    maxFuncTime = Math.max(maxFuncTime, result.time);
                    return {
                        name: toolName,
                        arguments: Object.values(args),
                        ...(result.error && { error: result.error }),
                    };
                });
                log.info(`func logs: ${JSON.stringify(func_logs, null, 2)}`);
                log.debug(`func result: ${JSON.stringify(toolResults, null, 2)}`);
                logs.functions.push(...func_logs);
                maxFuncTime && logs.tool.time.push((+time - maxFuncTime).toFixed(1));
                const toolNames = [...new Set(toolResults.map(i => i.toolName))];
                // Whether to trim used tools
                // activeTools = trimActiveTools(activeTools, toolNames);
                log.info(`finish ${toolNames}`);
                onStream?.send(`${messageInfo.content}...\n` + `finish ${toolNames}`);
            } else {
                activeTools.length > 0 && toolChoice[step]?.type !== 'none' ? logs.tool.time.push(time) : logs.chat.time.push(time);
            }

            if (usage && !Number.isNaN(usage.promptTokens) && !Number.isNaN(usage.completionTokens)) {
                logs.tokens.push(`${usage.promptTokens},${usage.completionTokens}`);
                log.info(`tokens: ${JSON.stringify(usage)}`);
            } else {
                log.warn('usage is none or not a number');
            }
            logs.ongoing = logs.ongoing.filter(i => i.startTime !== startTime);
            sendToolCall = false;
            step++;
        },
    };
}

function warpMessages(params: LanguageModelV1CallOptions, tools: Record<string, any>, activeTools: string[], rawSystemPrompt: string | undefined) {
    const { prompt: messages, mode } = params;

    const getSystemContent = () => {
        let systemContent = rawSystemPrompt ?? '';
        // 非兼容模式插入工具prompt
        if (!ENV.MESSAGE_COMPATIBLE && activeTools.length > 0) {
            systemContent += `\nYou can consider using the following tools:\n${activeTools.map(name =>
                `### ${name}\n- desc: ${tools[name]?.schema?.description || ''} \n${tools[name]?.prompt || ''}`,
            ).join('\n\n')}`
            + `\n\n${activeTools.map(name => `## For tool \`${name}\`, you should follow these rules:\n - ${tools[name]?.prompt ?? ''}`)
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
                            toolArgs = JSON.stringify((messages[i - 1]?.content as LanguageModelV1ToolCallPart[])?.find(i => i.toolCallId === toolCallId)?.args);
                        }
                        text += `#### [tool ${toolName} with args ${toolArgs}]\nResult:\n${JSON.stringify(content || arrayResult)}\n\n`;
                    }
                    text = `${[...toolNames].map(name => `## For tool \`${name}\`, you should follow these rules:\n - ${tools[name]?.prompt ?? ''}`).join('\n')}\n### Please use the following retrieved data to answer the question:\n${text}`;
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
        messages.forEach((i: CoreMessage) => {
            if (i.role === 'tool' && i.content.some((j: any) => j.type === 'tool-result')) {
                i.content.forEach((j: any) => {
                    // 消除 time信息
                    j.result?.time && (delete j.result.time);
                });
            }
        });
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
    const tool_envs: Record<string, any> = { ...(context.JINA_API_KEY && { JINA_API_KEY: context.JINA_API_KEY[Math.floor(Math.random() * context.JINA_API_KEY.length)] }) };

    const env_prefix = 'TOOL_ENV_';
    Object.keys(context).forEach(i => i.startsWith(env_prefix) && (tool_envs[i.substring(env_prefix.length - 1)] = context[i]));

    const messages = params.messages.at(-1) as CoreUserMessage;
    let tool = typeof messages.content === 'string'
        ? await vaildTools(context.USE_TOOLS, context.USE_MCP)
        : undefined;

    const activeTools = tool?.activeToolAlias.map((t: string) => tools[t]?.schema?.name || t) || [];
    // if vertex use search grounding, do not use other tools
    if (params.model.provider === 'google-vertex' && context.SEARCH_GROUNDING) {
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

function recordModelLog(config: AgentUserConfig, model: LanguageModelV1, activeTools: string[], toolChoice: ToolChoice) {
    const logs = getLogSingleton(config);
    log.info(`provider: ${model.provider}, modelId: ${model.modelId} `);
    let modelName = model.modelId;
    if (config.ENABLE_ALIAS) {
        const mappedModel = config.MAPPING_VALUE.split('|').map(i => i.split(':')).find(([_, value]) => value === model.modelId);
        modelName = mappedModel?.[0] ?? model.modelId;
    }
    if (activeTools.length > 0 && toolChoice?.type !== 'none') {
        logs.tool.model.add(modelName);
    } else {
        logs.chat.model.add(modelName);
    }
}

export function metaDataExtractor(metadata: any, provider: string, content: string) {
    if (!metadata) {
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
                    const tag = groundingChunkIndices?.map((i: number) => `[[${i + 1}\\]](#${i + 1})`).join('');
                    // const tag = groundingChunkIndices?.map((i: number) => `[[${i + 1}\\]](${groundingChunks[i].web.uri})`).join('');
                    // content = insertTextByByteIndex(content, segment.endIndex, tag);
                    content = content.replace(segment.text, `$&${tag}`);
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
