/**
 * 子代理委托系统
 *
 * 允许主代理生成隔离的子代理处理并行任务
 * 灵感来源：Hermes Agent 的 delegate_tool.py
 *
 * 核心特性：
 * - 隔离的上下文：每个子代理有独立的对话历史
 * - 并行执行：支持多个任务同时处理
 * - 工具限制：子代理不能递归委托
 * - 结果聚合：只返回最终摘要，不污染父代理上下文
 */

import type { AgentUserConfig } from '../config/env';
import type { ChatAgent, HistoryItem, LLMChatParams } from './types';
import { loadChatLLM } from '.';
import { log } from '../log/logger';

/**
 * 子代理任务定义
 */
export interface DelegateTask {
    // 任务目标（必需）
    goal: string;
    // 任务上下文（可选）
    context?: string;
    // 使用的工具集（可选，默认继承父代理）
    tools?: string[];
    // 最大迭代次数（可选）
    maxIterations?: number;
}

/**
 * 子代理执行结果
 */
export interface DelegateResult {
    // 任务索引
    taskIndex: number;
    // 执行状态
    status: 'completed' | 'failed' | 'interrupted';
    // 结果摘要
    summary: string;
    // 错误信息（如果失败）
    error?: string;
    // API 调用次数
    apiCalls: number;
    // 执行时长（秒）
    durationSeconds: number;
    // 使用的模型
    model?: string;
    // Token 使用情况
    tokens?: {
        input: number;
        output: number;
    };
}

/**
 * 子代理配置
 */
export interface DelegateConfig {
    // 最大并发子代理数量
    maxConcurrent: number;
    // 默认最大迭代次数
    defaultMaxIterations: number;
    // 是否启用
    enabled: boolean;
    // 子代理使用的模型（可选，默认使用便宜的模型）
    model?: string;
}

/**
 * 子代理委托器
 */
export class DelegateAgent {
    private config: DelegateConfig;
    private parentConfig: AgentUserConfig;
    private delegateDepth: number;

    // 最大委托深度（防止递归）
    private static readonly MAX_DEPTH = 2;

    // 被阻止的工具（子代理不能使用）
    private static readonly BLOCKED_TOOLS = new Set([
        'delegate_task', // 不能递归委托
        'send_message', // 不能发送消息
    ]);

    constructor(
        parentConfig: AgentUserConfig,
        delegateDepth: number = 0,
        config: Partial<DelegateConfig> = {}
    ) {
        this.parentConfig = parentConfig;
        this.delegateDepth = delegateDepth;
        this.config = {
            maxConcurrent: config.maxConcurrent ?? 3,
            defaultMaxIterations: config.defaultMaxIterations ?? 20,
            enabled: config.enabled ?? true,
            model: config.model,
        };
    }

    /**
     * 检查是否可以委托
     */
    canDelegate(): boolean {
        if (!this.config.enabled) {
            return false;
        }
        if (this.delegateDepth >= DelegateAgent.MAX_DEPTH) {
            log.warn(`[DELEGATE] Max delegation depth ${DelegateAgent.MAX_DEPTH} reached`);
            return false;
        }
        return true;
    }

    /**
     * 委托单个任务
     */
    async delegateTask(task: DelegateTask): Promise<DelegateResult> {
        if (!this.canDelegate()) {
            throw new Error('Cannot delegate: depth limit reached or delegation disabled');
        }

        log.info(`[DELEGATE] Starting single task: ${task.goal.slice(0, 50)}...`);

        const results = await this.delegateTasks([task]);
        return results[0];
    }

    /**
     * 委托多个任务（并行执行）
     */
    async delegateTasks(tasks: DelegateTask[]): Promise<DelegateResult[]> {
        if (!this.canDelegate()) {
            throw new Error('Cannot delegate: depth limit reached or delegation disabled');
        }

        if (tasks.length === 0) {
            throw new Error('No tasks provided');
        }

        if (tasks.length > this.config.maxConcurrent) {
            throw new Error(
                `Too many tasks: ${tasks.length} provided, but max concurrent is ${this.config.maxConcurrent}`
            );
        }

        log.info(`[DELEGATE] Starting ${tasks.length} task(s) in parallel`);

        const startTime = Date.now();

        // 并行执行所有任务
        const results = await Promise.all(
            tasks.map((task, index) => this.runSingleChild(task, index))
        );

        const totalDuration = (Date.now() - startTime) / 1000;
        log.info(`[DELEGATE] All tasks completed in ${totalDuration.toFixed(2)}s`);

        return results;
    }

    /**
     * 运行单个子代理
     */
    private async runSingleChild(
        task: DelegateTask,
        taskIndex: number
    ): Promise<DelegateResult> {
        const startTime = Date.now();

        try {
            // 构建子代理的系统提示
            const systemPrompt = this.buildChildSystemPrompt(task);

            // 创建子代理配置
            const childConfig = this.buildChildConfig(task);

            // 加载子代理
            const childAgent = loadChatLLM(childConfig);
            if (!childAgent) {
                throw new Error('Failed to load child agent');
            }

            log.info(`[DELEGATE-${taskIndex}] Child agent created with model: ${childAgent.model(childConfig)}`);

            // 构建子代理的消息
            const messages: HistoryItem[] = [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: task.goal,
                },
            ];

            // 执行子代理
            const llmParams: LLMChatParams = {
                messages,
                cache: [],
            };

            const result = await childAgent.request(llmParams, childConfig, null);

            const duration = (Date.now() - startTime) / 1000;
            const summary = result.content || '';

            log.info(`[DELEGATE-${taskIndex}] Completed in ${duration.toFixed(2)}s`);

            return {
                taskIndex,
                status: 'completed',
                summary,
                apiCalls: 1, // 简化：只计算一次 API 调用
                durationSeconds: duration,
                model: childAgent.model(childConfig),
                tokens: {
                    input: 0, // TODO: 实际 token 计数
                    output: 0,
                },
            };
        } catch (error) {
            const duration = (Date.now() - startTime) / 1000;
            log.error(`[DELEGATE-${taskIndex}] Failed:`, error);

            return {
                taskIndex,
                status: 'failed',
                summary: '',
                error: error instanceof Error ? error.message : String(error),
                apiCalls: 0,
                durationSeconds: duration,
            };
        }
    }

    /**
     * 构建子代理的系统提示
     */
    private buildChildSystemPrompt(task: DelegateTask): string {
        const parts: string[] = [
            '你是一个专注的子代理，负责处理特定的委托任务。',
            '',
            `你的任务：\n${task.goal}`,
        ];

        if (task.context && task.context.trim()) {
            parts.push(`\n上下文：\n${task.context}`);
        }

        parts.push(
            '\n使用可用的工具完成此任务。完成后，提供清晰简洁的摘要：',
            '- 你做了什么',
            '- 你发现或完成了什么',
            '- 你创建或修改了哪些文件',
            '- 遇到的任何问题',
            '',
            '要彻底但简洁 - 你的响应将作为摘要返回给父代理。'
        );

        return parts.join('\n');
    }

    /**
     * 构建子代理配置
     */
    private buildChildConfig(task: DelegateTask): AgentUserConfig {
        const childConfig = { ...this.parentConfig };

        // 使用更便宜的模型（如果配置了）
        if (this.config.model) {
            const provider = childConfig.AI_CHAT_PROVIDER;
            const modelKey = `${provider.toUpperCase()}_CHAT_MODEL`;
            childConfig[modelKey] = this.config.model;
        } else {
            // 自动选择便宜的模型
            const provider = childConfig.AI_CHAT_PROVIDER;
            if (provider === 'google') {
                childConfig.GOOGLE_CHAT_MODEL = 'gemini-2.5-flash-lite';
            } else if (provider === 'openai') {
                childConfig.OPENAI_CHAT_MODEL = 'gpt-4o-mini';
            } else if (provider === 'anthropic') {
                childConfig.ANTHROPIC_CHAT_MODEL = 'claude-haiku-4-5';
            } else if (provider === 'xai') {
                childConfig.XAI_CHAT_MODEL = 'grok-4.1-fast';
            }
        }

        // 限制历史长度（子代理不需要长历史）
        childConfig.MAX_HISTORY_LENGTH = 5;

        // 禁用上下文压缩（子代理对话很短）
        childConfig.ENABLE_CONTEXT_COMPRESSION = false;

        // 设置最大迭代次数
        if (task.maxIterations) {
            // TODO: 添加迭代限制配置
        }

        return childConfig;
    }

    /**
     * 格式化结果为文本
     */
    static formatResults(results: DelegateResult[]): string {
        if (results.length === 1) {
            const result = results[0];
            if (result.status === 'completed') {
                return result.summary;
            } else {
                return `任务失败：${result.error || '未知错误'}`;
            }
        }

        // 多任务结果
        const lines: string[] = [`完成了 ${results.length} 个任务：\n`];

        for (const result of results) {
            const icon = result.status === 'completed' ? '✓' : '✗';
            const duration = result.durationSeconds.toFixed(2);

            lines.push(`${icon} 任务 ${result.taskIndex + 1} (${duration}s):`);

            if (result.status === 'completed') {
                lines.push(result.summary);
            } else {
                lines.push(`  失败：${result.error || '未知错误'}`);
            }

            lines.push('');
        }

        return lines.join('\n');
    }
}

/**
 * 创建委托代理实例
 */
export function createDelegateAgent(
    parentConfig: AgentUserConfig,
    delegateDepth: number = 0
): DelegateAgent {
    return new DelegateAgent(parentConfig, delegateDepth, {
        enabled: parentConfig.ENABLE_DELEGATE_AGENT ?? true,
        maxConcurrent: parentConfig.DELEGATE_MAX_CONCURRENT ?? 3,
        defaultMaxIterations: parentConfig.DELEGATE_MAX_ITERATIONS ?? 20,
        model: parentConfig.DELEGATE_MODEL,
    });
}
