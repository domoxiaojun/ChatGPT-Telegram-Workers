/**
 * 委托工具 - 允许 AI 委托任务给子代理
 */

import type { AgentUserConfig } from '../../config/env';
import type { ToolResult } from '../types';
import type { DelegateTask } from '../../agent/delegate_agent';
import { createDelegateAgent, DelegateAgent } from '../../agent/delegate_agent';
import { log } from '../../log/logger';

/**
 * 执行委托任务
 */
async function executeDelegateTask(
    args: {
        goal?: string;
        context?: string;
        tasks?: Array<{ goal: string; context?: string; maxIterations?: number }>;
        maxIterations?: number;
    },
    env: Record<string, any>,
    config: AgentUserConfig
): Promise<ToolResult> {
    try {
        // 创建委托代理
        const delegateAgent = createDelegateAgent(config, 0);

        // 检查是否可以委托
        if (!delegateAgent.canDelegate()) {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        error: '无法委托：已达到深度限制或委托已禁用',
                    }),
                }],
            };
        }

        // 规范化为任务列表
        let taskList: DelegateTask[];

        if (args.tasks && Array.isArray(args.tasks)) {
            // 批量模式
            taskList = args.tasks.map(t => ({
                goal: t.goal,
                context: t.context,
                maxIterations: t.maxIterations || args.maxIterations,
            }));
        } else if (args.goal && args.goal.trim()) {
            // 单任务模式
            taskList = [
                {
                    goal: args.goal,
                    context: args.context,
                    maxIterations: args.maxIterations,
                },
            ];
        } else {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        error: '提供 \'goal\'（单任务）或 \'tasks\'（批量）',
                    }),
                }],
            };
        }

        // 验证任务
        for (let i = 0; i < taskList.length; i++) {
            if (!taskList[i].goal.trim()) {
                return {
                    content: [{
                        type: 'text',
                        text: JSON.stringify({
                            error: `任务 ${i} 缺少 'goal'`,
                        }),
                    }],
                };
            }
        }

        log.info(`[DELEGATE TOOL] Executing ${taskList.length} task(s)`);

        // 执行任务
        const results = await delegateAgent.delegateTasks(taskList);

        // 返回格式化的结果
        const response = {
            results: results.map(r => ({
                taskIndex: r.taskIndex,
                status: r.status,
                summary: r.summary,
                error: r.error,
                apiCalls: r.apiCalls,
                durationSeconds: r.durationSeconds,
                model: r.model,
                tokens: r.tokens,
            })),
            totalTasks: results.length,
            successCount: results.filter(r => r.status === 'completed').length,
            failedCount: results.filter(r => r.status === 'failed').length,
        };

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(response, null, 2),
            }],
        };
    } catch (error) {
        log.error('[DELEGATE TOOL] Error:', error);
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    error: error instanceof Error ? error.message : String(error),
                }),
            }],
        };
    }
}

export default {
    schema: {
        name: 'delegate_task',
        description: `生成一个或多个子代理来处理隔离上下文中的任务。每个子代理都有自己的对话、工具集。只返回最终摘要 - 中间工具结果不会进入你的上下文窗口。

两种模式（'goal' 或 'tasks' 之一是必需的）：
1. 单任务：提供 'goal'（+ 可选的 context）
2. 批量（并行）：提供 'tasks' 数组，最多 3 个项目。所有任务并发运行，结果一起返回。

何时使用 delegate_task：
- 需要推理的子任务（调试、代码审查、研究综合）
- 会用中间数据淹没你的上下文的任务
- 并行独立工作流（同时研究 A 和 B）

何时不使用（改用这些）：
- 不需要推理的机械多步骤工作 -> 直接调用工具
- 单个工具调用 -> 直接调用工具
- 需要用户交互的任务 -> 子代理不能与用户交互

重要：
- 子代理没有你的对话记忆。通过 'context' 字段传递所有相关信息（文件路径、错误消息、约束）。
- 子代理不能：递归委托、用户交互、发送消息。
- 每个子代理都有自己的独立会话。
- 结果始终作为数组返回，每个任务一个条目。`,
        parameters: {
            type: 'object',
            properties: {
                goal: {
                    type: 'string',
                    description: '子代理应该完成什么。要具体且自包含 - 子代理对你的对话历史一无所知。',
                },
                context: {
                    type: 'string',
                    description: '子代理需要的背景信息：文件路径、错误消息、项目结构、约束。你越具体，子代理表现越好。',
                },
                tasks: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            goal: {
                                type: 'string',
                                description: '任务目标',
                            },
                            context: {
                                type: 'string',
                                description: '任务特定的上下文',
                            },
                            maxIterations: {
                                type: 'number',
                                description: '此任务的最大迭代次数（默认：20）',
                            },
                        },
                        required: ['goal'],
                    },
                    description: '批量模式：并行运行的任务（限制 3 个）。每个任务都有自己的子代理和隔离的上下文。提供时，顶级 goal/context 将被忽略。',
                },
                maxIterations: {
                    type: 'number',
                    description: '每个子代理的最大工具调用轮次（默认：20）。仅为简单任务设置更低的值。',
                },
            },
            required: [],
        },
    },
    func: executeDelegateTask,
};

