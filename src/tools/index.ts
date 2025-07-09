/* eslint-disable no-case-declarations */
/* eslint-disable unused-imports/no-unused-vars */

import type { AgentUserConfig } from '../config/env';
import type { MessageSender } from '../telegram/utils/send';
import type { FuncTool, MediaToolResultContent, ResourceToolResultContent, TextToolResultContent, ToolHandler, ToolResult, ToolResultType } from './types';

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

export function executeTool(toolName: string, env: Record<string, any>, _config: AgentUserConfig) {
    if (tools[toolName].func) {
        return async (args: any) => {
            const startTime = Date.now();
            const result = await tools[toolName].func!(args, env, _config);
            return { ...result, time: ((Date.now() - startTime) / 1e3).toFixed(1) };
        };
    }
    return async (args: any): Promise<{ content: unknown; time: string; error?: string }> => {
        let signal;
        if (ENV.TOOL_TIMEOUT > 0) {
            signal = AbortSignal.timeout(ENV.TOOL_TIMEOUT * 1000);
        }
        let filledPayload = JSON.stringify(tools[toolName].payload)
            .replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
                const [key, ...defaultValue] = p1.split('=');
                return args[key] || defaultValue.join('=') || match;
            });

        (tools[toolName].required || []).forEach((key: string) => {
            if (!env[key]) {
                throw new Error(`Missing required key: ${key}`);
            }
            let secret = env[key];
            // if secret is array, choose one randomly
            if (Array.isArray(secret)) {
                secret = secret[Math.floor(Math.random() * secret.length)];
            }
            filledPayload = filledPayload.replace(`{{${key}}}`, secret);
        });
        // Remove the remaining {{...}}
        filledPayload = filledPayload.replace(/\{\{.*?\}\}/g, '');

        const { url, method, headers, body } = JSON.parse(filledPayload);
        const startTime = Date.now();
        log.info(`tool request start, url: ${url}`);
        let result: any = await fetch(url, {
            method: method || 'GET',
            headers: headers || {},
            body: body ? JSON.stringify(body) : undefined,
            signal,
        });
        log.info(`tool request end, status: ${result.status}`);
        if (!result.ok) {
            const text = await result.text();
            log.error(`Tool call error: ${result.statusText} ${text}`);
            return { content: [{ type: 'text', text: `Tool call error: ${result.statusText} ${text}` }], time: ((Date.now() - startTime) / 1e3).toFixed(1), error: result.statusText };
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
        return { content: [{ type: 'text', text: result }], time: ((Date.now() - startTime) / 1e3).toFixed(1) };
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
            log.info(`local tools: ${Object.keys(localTools)}`);
            Object.assign(tools, localTools);
        }
        toolsInitialized = true;
    })();

    return toolsPromise;
}

export async function validTools(config: AgentUserConfig) {
    const env: Record<string, any> = Object.assign({}, ENV.PLUGINS_ENV, { ...(config.JINA_API_KEY && { JINA_API_KEY: config.JINA_API_KEY[Math.floor(Math.random() * config.JINA_API_KEY.length)] }) });
    const activeToolAlias = config.USE_TOOLS.filter(t => Object.keys(tools).includes(t));
    const mcpTools = await getMcp();
    const activeMcpTools = Object.entries(mcpTools)
        .filter(([tname, _]) => config.USE_MCP.includes(tname))
        .reduce((acc: Record<string, any>, [_, t]) => {
            acc = { ...acc, ...t };
            return acc;
        }, {});

    // real tool name, not the key name
    const useTools = Object.entries(tools)
        .filter(([tname, _]) => activeToolAlias.includes(tname))
        .reduce((acc: Record<string, any>, [name, t]) => {
            acc[t.schema.name] = tool({
                description: t.schema.description,
                inputSchema: jsonSchema(t.schema.parameters as any),
                execute: executeTool(name, env, config) as any,
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

export async function sendToolResult(toolResult: ToolResult[], sender: MessageSender, config: AgentUserConfig) {
    // clear message id for extra message
    const record = {
        message_id: sender.context.message_id,
        sentMessageIds: sender.context.sentMessageIds,
    };
    const clearMessageId = () => {
        console.log('clear message id');
        sender.context.message_id = null;
        sender.context.sentMessageIds = [];
    };
    const collect: { type: ToolResultType; data: Array<Omit<ToolResult['content'][number], 'type'>> }[] = [];
    let index = 0;
    const content = toolResult.map(r => r.content).flat();
    for (const { type, ...result } of content) {
        if (collect[index]?.type === undefined) {
            collect[index] = { type, data: [result] };
        } else if (collect[index]?.type !== type) {
            collect[++index] = { type, data: [result] };
        } else {
            collect[index].data.push(result);
        }
    }
    const sendStatus = [];
    let sendResp: Response | null = null;
    for (const { type, data } of collect) {
        switch (type) {
            case 'image':
                const imageData = await base64OrUrlToBlob(data as MediaToolResultContent[]);
                // 文件数据获取缓慢
                // stepFinish发送tool tip未进行等待，文件数据获取时间大于tool tip响应时间，则消息会刷新message_id
                clearMessageId();
                sendResp = await sendImages({
                    raw: imageData,
                    caption: (data as MediaToolResultContent[]).map(d => d.text),
                }, ENV.SEND_IMAGE_AS_FILE, sender, config);

                break;
            case 'video':
                const videoData = await base64OrUrlToBlob(data as MediaToolResultContent[]);
                clearMessageId();
                sendResp = await sender.sendMediaGroup(videoData.map((d, i) => ({
                    type: 'video',
                    media: '',
                    caption: (data as MediaToolResultContent[])[i].text,
                    parse_mode: ENV.DEFAULT_PARSE_MODE as any,
                })), videoData.map(data => new File([data], 'video.mp4', { type: 'video/mp4' })));

                break;
            case 'audio':
                const audioData = await base64OrUrlToBlob(data as MediaToolResultContent[]);
                clearMessageId();
                const resp = await Promise.all(audioData.map((d, i) => sender.sendVoice(d, (data as MediaToolResultContent[])[i].text)));
                sendStatus.push(resp.map(r => r.statusText).join(', '));
                break;

            case 'resource':
                clearMessageId();
                sendResp = await sender.sendRichText((data as ResourceToolResultContent[]).map(d => d.resource.text).join('\n'));
                break;
            case 'text':
            default:
                clearMessageId();
                if (!data.some((d: any) => d.is_error)) {
                    sendResp = await sender.sendRichText((data as TextToolResultContent[]).map(d => d.text).join('\n'));
                }
                break;
        }
        sendResp && sendStatus.push(sendResp.statusText);
    }
    log.info(`tool result send status: ${sendStatus.join(', ')}`);
    // recover messgae id
    sender.context.message_id = record.message_id;
    sender.context.sentMessageIds = record.sentMessageIds;
}
async function base64OrUrlToBlob(data: MediaToolResultContent[]): Promise<Blob[]> {
    const mediaType = data[0].data_type ?? 'url';
    if (mediaType === 'url') {
        return Promise.all(data.map(v => fetch(v.data as string).then(r => r.blob())));
    } else if (mediaType === 'base64') {
        return Promise.all(data.map(v => new Blob([Buffer.from(v.data as string, 'base64')], { type: v.mimeType })));
    }
    return data.map(d => d.data as Blob);
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
        p.pattern = p?.pattern?.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
            const [key, ...defaultValue] = p1.split('=');
            return args[key] || defaultValue.join('=') || match;
        });
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
