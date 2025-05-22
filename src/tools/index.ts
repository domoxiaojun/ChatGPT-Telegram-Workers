/* eslint-disable unused-imports/no-unused-vars */

import type { ToolCallPart, ToolResultPart } from 'ai';
import type { ImageResult, ResponseMessage } from '../agent/types';
import type { AgentUserConfig } from '../config/env';
import type { MessageSender } from '../telegram/utils/send';
import type { FuncTool, ToolHandler } from './types';

import { jsonSchema, tool } from 'ai';
import { ENV } from '../config/env';
import { log } from '../log/logger';
import { getMcp } from '../mcp';
import { interpolate } from '../plugins/interpolate';
import { sendImages } from '../telegram/handler/chat';
import { isCfWorker } from '../telegram/utils/tg_utils';
import externalTools from './external';
import internalTools from './internal';
import { processHtmlText, webCrawler } from './internal/web';
import { getLocalTools } from './local';

export * from './external';
export * from './internal';

const tools = {
    ...externalTools,
    ...internalTools,
} as unknown as Record<string, FuncTool>;

export function executeTool(toolName: string) {
    return async (args: any): Promise<{ content: unknown; time: string; error?: string }> => {
        let signal;
        if (ENV.TOOL_TIMEOUT > 0) {
            signal = AbortSignal.timeout(ENV.TOOL_TIMEOUT * 1000);
        }
        let filledPayload = JSON.stringify(tools[toolName].payload)
            .replace(/\{\{([^}]+)\}\}/g, (match, p1) => args[p1] || match);

        (tools[toolName].required || []).forEach((key: string) => {
            if (!ENV.PLUGINS_ENV[key]) {
                throw new Error(`Missing required key: ${key}`);
            }
            let secret = ENV.PLUGINS_ENV[key];
            // if secret is array, choose one randomly
            if (Array.isArray(secret)) {
                secret = secret[Math.floor(Math.random() * secret.length)];
            }
            filledPayload = filledPayload.replace(`{{${key}}}`, secret);
        });
        // Remove the remaining {{...}}
        filledPayload = filledPayload.replace(/\{\{.*?\}\}/g, '');

        const parsedPayload = JSON.parse(filledPayload);
        const startTime = Date.now();
        log.info(`tool request start, url: ${parsedPayload.url}`);
        let result: any = await fetch(parsedPayload.url, {
            method: parsedPayload.method || 'GET',
            headers: parsedPayload.headers || {},
            body: parsedPayload.body ? JSON.stringify(parsedPayload.body) : undefined,
            signal,
        });
        log.info(`tool request end`);
        if (!result.ok) {
            const text = await result.text();
            log.error(`Tool call error: ${result.statusText} ${text}`);
            return { content: `Tool call error: ${result.statusText}`, time: ((Date.now() - startTime) / 1e3).toFixed(1), error: result.statusText };
        }
        try {
            result = await result.clone().json();
        } catch (e) {
            result = await result.text();
        }

        const middleHandler = async (data: any) => {
            let result = data;
            const handler = JSON.parse(JSON.stringify(tools[toolName]?.handler || '')) as ToolHandler;
            handler && injectPatterns(handler, args);
            switch (handler?.type) {
                case 'template':
                    result = processHtmlText(handler.patterns || [], interpolate(handler.data, data));
                    break;
                case 'webclean':
                    result = processHtmlText(handler.patterns || [], typeof data !== 'string' ? JSON.stringify(data) : data as any);
                    break;
            }
            if (tools[toolName].webcrawler) {
                result = await webCrawler(tools[toolName].webcrawler, result);
            }
            return result;
        };

        result = await middleHandler(result);

        // if (tools[toolName].next_tool) {
        //     const next_tool_alias = tools[toolName].next_tool;
        //     return executeTool(next_tool_alias)(result, options);
        // }
        return { content: result, time: ((Date.now() - startTime) / 1e3).toFixed(1) };
    };
}

let toolsInitialized = false;
let toolsPromise: Promise<void> | null = null;

export async function initializeTools() {
    if (toolsPromise) {
        return toolsPromise;
    }

    blockTool();

    toolsPromise = (async () => {
        console.log('external tools:', Object.keys(ENV.PLUGINS_FUNCTION));
        await Promise.all(Object.keys(ENV.PLUGINS_FUNCTION).map(async (plugin) => {
            let template = ENV.PLUGINS_FUNCTION[plugin];
            if (template.startsWith('http')) {
                template = await fetch(template).then(r => r.text());
            }
            try {
                tools[plugin] = JSON.parse(template.trim());
            } catch (e) {
                log.error(`Plugin ${plugin} is invalid`);
            }
        }));
        if (!isCfWorker) {
            const localTools = await getLocalTools();
            console.log('local tools:', Object.keys(localTools));
            Object.assign(tools, localTools);
        }
        toolsInitialized = true;
    })();

    return toolsPromise;
}

export async function vaildTools(tools_config: string[], mcp_config: string[]) {
    const activeToolAlias = tools_config.filter(t => Object.keys(tools).includes(t));
    const mcpTools = await getMcp();
    const activeMcpTools = Object.entries(mcpTools)
        .filter(([tname, _]) => mcp_config.includes(tname))
        .reduce((acc: Record<string, any>, [_, t]) => {
            acc = { ...acc, ...t };
            return acc;
        }, {});

    // real tool name, not the key name
    const useTools = Object.entries(tools)
        .filter(([tname, _]) => activeToolAlias.includes(tname))
        .reduce((acc: Record<string, any>, [name, t]) => {
            const execute = (t.buildin || t.func) ? t.func : executeTool(name) as any;
            acc[t.schema.name] = tool({
                description: t.schema.description,
                parameters: jsonSchema(t.schema.parameters as any),
                execute: t.not_send_to_ai ? undefined : execute,
            });
            return acc;
        }, {});
    // return useTools;
    // tools key name
    return {
        tools: { ...useTools, ...activeMcpTools },
        activeToolAlias: [...activeToolAlias, ...Object.keys(activeMcpTools)],
    };
}

export async function manualRequestTool(messages: ResponseMessage[], config: AgentUserConfig) {
    if (messages.at(-1)?.role === 'tool') {
        throw new Error('Maximum steps reached, please increase the number of steps to get the answer');
    }
    const isToolCallResponse = messages.at(-1)?.role === 'assistant'
        && Array.isArray(messages.at(-1)?.content)
        && (messages.at(-1)?.content as (ToolCallPart | ToolResultPart)[]).some(c => c.type === 'tool-call');
    if (!isToolCallResponse) {
        return;
    }

    const toolCallResult = messages.at(-1)?.content as ToolCallPart[];
    messages.push({
        role: 'tool',
        content: [],
    });
    await Promise.all(toolCallResult.filter(c => c.type === 'tool-call').map(async (c) => {
        const tool_func = tools[c.toolName].func || executeTool(c.toolName);
        if (!tool_func) {
            throw new Error(`Tool ${c.toolName} not found`);
        }
        const toolResult = await tool_func(c.args as any, {}, config);
        (messages.at(-1)?.content as ToolResultPart[]).push({
            type: 'tool-result',
            toolCallId: c.toolCallId,
            toolName: c.toolName,
            result: toolResult,
        });
    }));
}

export async function sendToolResult(toolResult: ToolResultPart[], sender: MessageSender, config: AgentUserConfig) {
    const isError = toolResult.some(r => r.isError);
    const resultType = isError ? 'text' : tools[toolResult.at(-1)?.toolName || '']?.result_type || 'text';
    const result = toolResult.map(r => r.result) as { content: string | ImageResult }[];
    switch (resultType) {
        case 'text':
            // clear message id for extra message
            sender.context.message_id = null;
            sender.context.sentMessageIds.length = 0;
            return sender.sendRichText((result as { content: string }[]).map(r => r.content).join('\n'));
        case 'image': {
            const images = (result as { content: ImageResult }[]).map(r => r.content).flat();
            const type = images.some(r => r.raw) ? 'raw' : 'url';
            return sendImages({
                type: 'image',
                [type]: images.map(r => r.url || r.raw).flat(),
                caption: images.map(r => r.text ?? ''),
            }, ENV.SEND_IMAGE_AS_FILE, sender, config);
        }
        default:
            break;
    }
}

function injectPatterns(handler: ToolHandler, args: Record<string, string>) {
    const { dynamic_patterns } = handler;
    if (!dynamic_patterns) {
        return;
    }
    if (!handler.patterns) {
        handler.patterns = [];
    }
    for (const p of dynamic_patterns) {
        p.pattern = p?.pattern?.replace(/\{\{([^}]+)\}\}/g, (match, p1) => args[p1] || match);
        handler.patterns.push(p);
    }
    log.debug(JSON.stringify(handler.patterns, null, 2));
}

export async function getTools() {
    if (!toolsInitialized) {
        await initializeTools();
    }
    return tools;
}

// initializeTools().catch(console.error);

function blockTool() {
    // 禁用内置工具
    Object.keys(tools).forEach((t) => {
        if (ENV.BLOCK_TOOLS.includes(t)) {
            delete tools[t];
        }
    });
}
