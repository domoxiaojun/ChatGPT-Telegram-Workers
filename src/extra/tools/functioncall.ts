/* eslint-disable antfu/if-newline */
import type { ParseMode } from 'telegram-bot-api-types';
import type { ChatAgent, ChatStreamTextHandler, CompletionData, HistoryItem, LLMChatParams, MessageAssistantFunction, MessageTool } from '../../agent/types';
import type { WorkerContext } from '../../config/context';
import type { MessageSender } from '../../telegram/utils/send';
import type { SchemaData } from './external/types';
import { OpenAI } from '../../agent/openai';
import { ENV } from '../../config/env';
import { OnStreamHander } from '../../telegram/handler/chat';
import { getLog, Log } from '../log/logDecortor';
import tools_settings from '../prompt/tools.js';

interface FunctionCallResult {
    id: string;
    name: string;
    args: Record<string, any>;
}

interface ToolStruct {
    type: string;
    function: SchemaData;
    strict: boolean;
}

export function getValidToolStructs(tools: string[]): Record<string, ToolStruct> {
    return tools
        .filter(tool => tool in ENV.TOOLS)
        .reduce((acc, tool) => {
            acc[tool] = {
                type: 'function',
                function: ENV.TOOLS[tool].schema,
                strict: true,
            };
            return acc;
        }, {} as Record<string, ToolStruct>);
}

export class FunctionCall {
    context: WorkerContext;
    vaildTools: Record<string, ToolStruct>;
    history: HistoryItem[];
    agent: ChatAgent;
    sender: MessageSender | null;
    usedTools: Set<string> = new Set();

    constructor(context: WorkerContext, vaildTools: Record<string, ToolStruct>, history: HistoryItem[] = [], sender: MessageSender | null = null, agent: ChatAgent = new OpenAI('tool')) {
        this.context = context;
        this.vaildTools = vaildTools;
        this.history = history;
        this.agent = agent;
        this.sender = sender;
    }

    validCalls(tool_calls: any[]): FunctionCallResult[] {
        return tool_calls.filter(i => i.function.name in this.vaildTools).map(func => ({
            id: func.id,
            name: func.function.name,
            args: JSON.parse(func.function.arguments),
        }));
    }

    async call(params: Record<string, any>, onStream: ChatStreamTextHandler | null): Promise<CompletionData> {
        return this.agent.request(params as LLMChatParams, this.context.USER_CONFIG, onStream);
    }

    @Log
    async exec(func: FunctionCallResult, env: Record<string, string>): Promise<string> {
        const controller = new AbortController();
        const { signal } = controller;
        const timeoutId = ENV.FUNC_TIMEOUT > 0 ? setTimeout(() => controller.abort(), ENV.FUNC_TIMEOUT * 1e3) : null;
        const { name, args } = func;
        if (ENV.TOOLS[name]?.need) {
            args[ENV.TOOLS[name].need] = env[ENV.TOOLS[name].need];
        }
        const content = await ENV.TOOLS[name].func(args, signal) || '';
        if (timeoutId) clearTimeout(timeoutId);
        return content;
    }

    async run(): Promise<any> {
        let FUNC_LOOP_TIMES = ENV.FUNC_LOOP_TIMES;
        const ASAP = this.context.USER_CONFIG.FUNCTION_REPLY_ASAP;
        const onStream = ENV.STREAM_MODE && this.sender ? OnStreamHander(this.sender, this.context) : null;
        const INTERNAL_ENV = this.extractInternalEnv(['JINA_API_KEY']);

        while (FUNC_LOOP_TIMES !== 0 && this.usedTools.size < Object.keys(this.vaildTools).length) {
            const params = this.trimParams(ASAP);
            let llm_resp: CompletionData | null = null;
            try {
                llm_resp = await this.call(params, onStream);
            } catch (e) {
                return this.sender?.sendPlainText(`Error: ${(e as Error).message}`);
            }

            if (!llm_resp?.tool_calls || llm_resp.tool_calls.length === 0) {
                if (ASAP && llm_resp) {
                    await this.sendStreamResponse(llm_resp, onStream);
                    this.history.push(...trimMessage(llm_resp));
                }
                return llm_resp;
            } else {
                llm_resp.tool_calls = llm_resp.tool_calls.slice(0, ENV.CON_EXEC_FUN_NUM);
            }
            const llm_data = this.paramsExtract(llm_resp);
            if (llm_data.length === 0) return llm_resp;

            this.history.push(...trimMessage(llm_resp) as MessageTool[]);
            llm_data.forEach(i => this.usedTools.add(i.name));

            const func_result = await Promise.all(llm_data.map(i => this.exec(i, INTERNAL_ENV)));
            this.history.push(...trimMessage(llm_resp, func_result));
            FUNC_LOOP_TIMES--;
        }
    }

    private trimParams(limitToken: boolean): Record<string, any> {
        const unusedTools = Object.keys(this.vaildTools).filter(tool => !this.usedTools.has(tool));
        const toolPrompts = unusedTools
            .map(tool => `##${tool}\n\n###${this.vaildTools[tool].function.description}`)
            .join('\n\n');

        const params = {
            history: this.history,
            prompt: tools_settings.default.prompt + toolPrompts,
            extra_params: {
                tools: unusedTools.map(tool => this.vaildTools[tool]),
                tool_choice: 'auto',
                ...tools_settings.default.extra_params,
            },
        };
        if (limitToken && params.extra_params.max_tokens) {
            delete params.extra_params.max_tokens;
        }
        return params;
    }

    private extractInternalEnv(keys: string[]): Record<string, any> {
        return keys.reduce((acc, key) => {
            acc[key] = this.context.USER_CONFIG[key];
            return acc;
        }, {} as Record<string, any>);
    }

    private async sendStreamResponse(llm_resp: CompletionData, onStream: ChatStreamTextHandler | null): Promise<void> {
        if (onStream) {
            const nextTime = onStream.nextEnableTime?.() ?? 0;
            if (nextTime > Date.now()) {
                await new Promise(resolve => setTimeout(resolve, nextTime - Date.now()));
            }
            await onStream(llm_resp.content, true);
        } else if (this.sender) {
            await this.sender.sendRichText(`${getLog(this.context.USER_CONFIG)}\n${llm_resp.content}`, ENV.DEFAULT_PARSE_MODE as ParseMode, 'chat');
        }
        // console.log('stream resp:\n', llm_resp.content);
    }

    paramsExtract(llm_resp: CompletionData): FunctionCallResult[] {
        return this.validCalls(llm_resp?.tool_calls || []);
    }
}

function trimMessage(llm_content: CompletionData, func_result?: string[]): MessageTool[] | MessageAssistantFunction[] {
    if (!func_result) {
        return [{ role: 'assistant', content: llm_content.content, tool_calls: llm_content.tool_calls }] as MessageAssistantFunction[];
    }
    return func_result.map((content, index) => ({
        content,
        name: llm_content.tool_calls![index].function.name,
        role: 'tool',
        tool_call_id: llm_content.tool_calls![index].id,
    })) as MessageTool[];
}
