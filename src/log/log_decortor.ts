import type { Message } from 'telegram-bot-api-types';
import type { CompletionData } from '../agent/types';
import type { WorkerContext } from '../config/context';
import type { AgentUserConfig } from '../config/env';

export const logSingleton = new WeakMap<AgentUserConfig, LogStruct[]>();
export const tagMessageIds = new WeakMap<Message, Set<number>>();

export function Logger(
    value: any,
    context: ClassFieldDecoratorContext | ClassMethodDecoratorContext,
): any {
    if (context.kind === 'field') {
        const configIndex = 1; // config 的索引
        return function (initialValue: any) {
            if (typeof initialValue !== 'function')
                return initialValue;

            return async function (this: any, ...args: any[]) {
                const config: AgentUserConfig = args[configIndex];
                const log = getLogSingleton({ config });
                log.model = args[0]?.model || this.model(config, args[0]);
                log.start_time = Date.now();
                const result: CompletionData = await initialValue.apply(this, args);
                log.end_time = Date.now();

                if (result.usage) {
                    log.tokens = {
                        prompt: result.usage.prompt_tokens,
                        completion: result.usage.completion_tokens,
                    };
                }
                return result;
            };
        };
    }

    if (context.kind === 'method' && typeof value === 'function') {
        return async function (this: { context: WorkerContext }, ...args: any[]) {
            const config: AgentUserConfig = this.context.USER_CONFIG;
            const log = getLogSingleton({ config });
            log.start_time = Date.now();
            const result = await value.apply(this, args);
            log.end_time = Date.now();
            return result;
        };
    }

    return value;
}

export function withLogger<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    const configIndex = 1;
    return async function (this: any, ...args: any[]) {
        const config: AgentUserConfig = args[configIndex];
        const log = getLogSingleton({ config });
        log.model = args[0]?.model || this.model?.(config, args[0]);
        log.start_time = Date.now();
        const result = await fn.apply(this, args);
        log.end_time = Date.now();
        if (result?.usage) {
            log.tokens = {
                prompt: result.usage.prompt_tokens,
                completion: result.usage.completion_tokens,
            };
        }
        return result;
    } as T;
}

export function getLogSingleton({ config, init = true }: { config: AgentUserConfig; init?: boolean }): LogStruct {
    const initLog: LogStruct = {
        model: '',
        functions: [],
        start_time: Number.NaN,
        end_time: undefined,
        first_chunk_time: null,
    };
    if (!logSingleton.has(config)) {
        logSingleton.set(config, []);
    }
    if (init) {
        logSingleton.get(config)!.push(initLog);
    }
    return logSingleton.get(config)!.at(-1)!;
}

// 获取日志
export function getLog(context: AgentUserConfig, { onlyModel = false, isParagraph = false }: { onlyModel?: boolean; isParagraph?: boolean } = {}) {
    if (!context.ENABLE_SHOWINFO && !isParagraph)
        return '';
    const logs = logSingleton.get(context);
    if (!logs)
        return '';
    if (onlyModel) {
        return logs.map(log => log.model).join(', ') || 'UNKNOWN';
    }
    const logList: string[] = [];
    const show = {
        model: context.SHOW_PARTS.includes('model'),
        model_time: context.SHOW_PARTS.includes('model_time'),
        token: context.SHOW_PARTS.includes('token'),
        tool: context.SHOW_PARTS.includes('tool'),
        tool_time: context.SHOW_PARTS.includes('tool_time'),
        first_chunk_time: context.SHOW_PARTS.includes('first_chunk_time'),
    };
    for (const log of logs) {
        let logStr = '';
        if (show.model) {
            logStr += log.model;
        }
        if (show.first_chunk_time && log.first_chunk_time) {
            logStr += ` [${log.first_chunk_time}ms]`;
        }
        if (show.model_time) {
            logStr += ` ${(((log.end_time ?? Date.now()) - log.start_time) / 1e3).toFixed(1)}s`;
        }

        // tool
        if (log.functions.length > 0 && show.tool) {
            logStr += '\n';
            logStr += log.functions.map(({ name, args, error, time }) => {
                const argsStr = args ? JSON.stringify(args) : '[]';
                return `${name}: ${argsStr.substring(0, 80)} ${time}s ${error ? `\n[ERROR: ${error}]` : ''}`;
            }).join('\n');
        }

        logList.push(logStr);
    }

    if (show.token && logs.some(log => log.tokens)) {
        logList.push(`${logs.map(({ tokens }) => {
            if (!tokens)
                return '-';
            let tokenStr = '';
            if (tokens?.prompt)
                tokenStr += tokens.prompt;
            if (tokens?.completion)
                tokenStr += `,${tokens.completion}`;
            if (tokens?.reasoning)
                tokenStr += `,*${tokens.reasoning}`;
            if (tokens?.cached)
                tokenStr += `,-${tokens.cached}`;
            return tokenStr;
        }).join('|')}`);
    }

    return isParagraph
        ? logList.filter(Boolean).join(' ')
        : logList.filter(Boolean).flatMap(i => i.split('\n')).map(i => `>\`${i}\``).join('\n');
}

export function clearLog(context: AgentUserConfig) {
    logSingleton.delete(context);
}

export interface LogStruct {
    model: string;
    functions: { name: string; args: any; error?: string; time: number }[];
    tokens?: { prompt: number; completion: number; reasoning?: number; cached?: number };
    start_time: number;
    end_time?: number;
    first_chunk_time?: number | null;
}
