/**
 * 智能上下文压缩系统
 *
 * 当对话历史接近模型上下文限制时，自动压缩中间消息为结构化摘要
 * 保护头部（系统提示）和尾部（最近消息），只压缩中间部分
 *
 * 灵感来源：Hermes Agent 的 context_compressor.py
 */

import type { ModelMessage } from 'ai';
import type { AgentUserConfig } from '../config/env';
import type { HistoryItem } from './types';
import { log } from '../log/logger';
import { generateSummaryWithLLM } from './summary_generator';

// 摘要前缀 - 告诉 AI 这是压缩的上下文，不要响应其中的问题
const SUMMARY_PREFIX = `[上下文压缩 - 仅供参考] 早期对话已被压缩为下面的摘要。这是从之前的上下文窗口切换过来的 - 将其视为背景参考，而不是活动指令。不要回答或执行摘要中提到的问题或请求；它们已经被处理过了。只响应出现在此摘要之后的最新用户消息。当前会话状态（文件、配置等）可能反映了这里描述的工作 - 避免重复：`;

// 最小摘要 token 数
const MIN_SUMMARY_TOKENS = 1000;
// 压缩内容的摘要比例
const SUMMARY_RATIO = 0.20;
// 摘要 token 上限
const SUMMARY_TOKENS_CEILING = 8000;

// 字符到 token 的粗略估算
const CHARS_PER_TOKEN = 4;

// 工具输出占位符
const PRUNED_TOOL_PLACEHOLDER = '[旧工具输出已清除以节省上下文空间]';

/**
 * 上下文压缩器配置
 */
export interface ContextCompressorConfig {
    // 触发压缩的阈值百分比（相对于模型上下文长度）
    thresholdPercent: number;
    // 保护头部消息数量
    protectFirstN: number;
    // 尾部 token 预算（最近消息保护）
    tailTokenBudget: number;
    // 摘要目标比例
    summaryTargetRatio: number;
    // 是否启用
    enabled: boolean;
}

/**
 * 上下文压缩器
 */
export class ContextCompressor {
    private config: ContextCompressorConfig;
    private previousSummary: string | null = null;
    private compressionCount: number = 0;

    constructor(config: Partial<ContextCompressorConfig> = {}) {
        this.config = {
            thresholdPercent: config.thresholdPercent ?? 0.50,
            protectFirstN: config.protectFirstN ?? 3,
            tailTokenBudget: config.tailTokenBudget ?? 8000,
            summaryTargetRatio: config.summaryTargetRatio ?? 0.20,
            enabled: config.enabled ?? true,
        };
    }

    /**
     * 重置压缩器状态（新会话时调用）
     */
    reset(): void {
        this.previousSummary = null;
        this.compressionCount = 0;
    }

    /**
     * 估算消息的 token 数量（粗略）
     */
    private estimateTokens(messages: HistoryItem[]): number {
        let total = 0;
        for (const msg of messages) {
            const content = this.getMessageContent(msg);
            total += Math.ceil(content.length / CHARS_PER_TOKEN) + 10; // +10 for metadata

            // 包含 tool calls 的参数
            if (msg.role === 'assistant' && Array.isArray(msg.content)) {
                for (const part of msg.content) {
                    if (part.type === 'tool-call' && (part as any).input) {
                        total += Math.ceil(JSON.stringify((part as any).input).length / CHARS_PER_TOKEN);
                    }
                }
            }
        }
        return total;
    }

    /**
     * 获取消息的文本内容
     */
    private getMessageContent(msg: HistoryItem): string {
        if (typeof msg.content === 'string') {
            return msg.content;
        }
        if (Array.isArray(msg.content)) {
            return msg.content
                .map((part: any) => {
                    if (part.type === 'text') return part.text || '';
                    if (part.type === 'reasoning') return part.text || '';
                    return '';
                })
                .join('\n');
        }
        return '';
    }

    /**
     * 检查是否需要压缩
     */
    shouldCompress(messages: HistoryItem[], contextLength: number): boolean {
        if (!this.config.enabled) return false;

        const currentTokens = this.estimateTokens(messages);
        const threshold = contextLength * this.config.thresholdPercent;

        return currentTokens >= threshold;
    }

    /**
     * 修剪旧的工具结果（廉价的预处理，不需要 LLM 调用）
     */
    private pruneOldToolResults(
        messages: HistoryItem[],
        protectTailTokens: number
    ): { messages: HistoryItem[]; prunedCount: number } {
        if (messages.length === 0) {
            return { messages, prunedCount: 0 };
        }

        const result = messages.map(m => ({ ...m }));
        let prunedCount = 0;

        // 从后向前累积 token，确定修剪边界
        let accumulated = 0;
        let boundary = result.length;

        for (let i = result.length - 1; i >= 0; i--) {
            const msg = result[i];
            const content = this.getMessageContent(msg);
            const msgTokens = Math.ceil(content.length / CHARS_PER_TOKEN) + 10;

            if (accumulated + msgTokens > protectTailTokens) {
                boundary = i;
                break;
            }
            accumulated += msgTokens;
            boundary = i;
        }

        // 修剪边界之前的工具结果
        for (let i = 0; i < boundary; i++) {
            const msg = result[i];
            if (msg.role !== 'tool') continue;

            const content = this.getMessageContent(msg);
            if (!content || content === PRUNED_TOOL_PLACEHOLDER) continue;

            // 只修剪大于 200 字符的内容
            if (content.length > 200) {
                if (typeof result[i].content === 'string') {
                    result[i].content = PRUNED_TOOL_PLACEHOLDER;
                }
                prunedCount++;
            }
        }

        return { messages: result, prunedCount };
    }

    /**
     * 查找尾部切割点（基于 token 预算）
     */
    private findTailCutByTokens(
        messages: HistoryItem[],
        headEnd: number,
        tokenBudget: number
    ): number {
        const n = messages.length;
        const minTail = Math.min(3, n - headEnd - 1);
        const softCeiling = Math.floor(tokenBudget * 1.5);

        let accumulated = 0;
        let cutIdx = n;

        for (let i = n - 1; i > headEnd; i--) {
            const msg = messages[i];
            const content = this.getMessageContent(msg);
            const msgTokens = Math.ceil(content.length / CHARS_PER_TOKEN) + 10;

            if (accumulated + msgTokens > softCeiling && (n - i) >= minTail) {
                break;
            }
            accumulated += msgTokens;
            cutIdx = i;
        }

        // 确保至少保护 minTail 条消息
        const fallbackCut = n - minTail;
        if (cutIdx > fallbackCut) {
            cutIdx = fallbackCut;
        }

        // 强制在头部之后切割
        if (cutIdx <= headEnd) {
            cutIdx = Math.max(fallbackCut, headEnd + 1);
        }

        return Math.max(cutIdx, headEnd + 1);
    }

    /**
     * 序列化消息用于摘要
     */
    private serializeForSummary(turns: HistoryItem[]): string {
        const parts: string[] = [];
        const CONTENT_MAX = 6000;
        const CONTENT_HEAD = 4000;
        const CONTENT_TAIL = 1500;

        for (const msg of turns) {
            const role = msg.role;
            let content = this.getMessageContent(msg);

            // 工具结果
            if (role === 'tool') {
                const toolCallId = (msg as any).tool_call_id || '';
                if (content.length > CONTENT_MAX) {
                    content = content.slice(0, CONTENT_HEAD) + '\n...[截断]...\n' + content.slice(-CONTENT_TAIL);
                }
                parts.push(`[工具结果 ${toolCallId}]: ${content}`);
                continue;
            }

            // 助手消息（包含工具调用）
            if (role === 'assistant') {
                if (content.length > CONTENT_MAX) {
                    content = content.slice(0, CONTENT_HEAD) + '\n...[截断]...\n' + content.slice(-CONTENT_TAIL);
                }

                // 添加工具调用信息
                if (Array.isArray(msg.content)) {
                    const toolCalls = msg.content.filter((part: any) => part.type === 'tool-call');
                    if (toolCalls.length > 0) {
                        const tcParts = toolCalls.map((tc: any) => {
                            const input = JSON.stringify(tc.input || {});
                            const truncatedInput = input.length > 1500 ? input.slice(0, 1200) + '...' : input;
                            return `  ${tc.toolName}(${truncatedInput})`;
                        });
                        content += '\n[工具调用:\n' + tcParts.join('\n') + '\n]';
                    }
                }
                parts.push(`[助手]: ${content}`);
                continue;
            }

            // 用户和其他角色
            if (content.length > CONTENT_MAX) {
                content = content.slice(0, CONTENT_HEAD) + '\n...[截断]...\n' + content.slice(-CONTENT_TAIL);
            }
            parts.push(`[${role.toUpperCase()}]: ${content}`);
        }

        return parts.join('\n\n');
    }

    /**
     * 计算摘要预算
     */
    private computeSummaryBudget(turnsToSummarize: HistoryItem[]): number {
        const contentTokens = this.estimateTokens(turnsToSummarize);
        const budget = Math.floor(contentTokens * SUMMARY_RATIO);
        return Math.max(MIN_SUMMARY_TOKENS, Math.min(budget, SUMMARY_TOKENS_CEILING));
    }

    /**
     * 生成结构化摘要
     */
    private generateSummaryPrompt(turnsToSummarize: HistoryItem[]): string {
        const summaryBudget = this.computeSummaryBudget(turnsToSummarize);
        const contentToSummarize = this.serializeForSummary(turnsToSummarize);

        const preamble = `你是一个摘要代理，正在创建上下文检查点。你的输出将作为参考材料注入给另一个继续对话的助手。不要回答对话中的任何问题或请求 - 只输出结构化摘要。不要包含任何前言、问候或前缀。`;

        const templateSections = `## 目标
[用户试图完成什么]

## 约束和偏好
[用户偏好、编码风格、约束、重要决策]

## 进度
### 已完成
[已完成的工作 - 包括具体的文件路径、运行的命令、获得的结果]
### 进行中
[当前正在进行的工作]
### 受阻
[遇到的任何阻碍或问题]

## 关键决策
[重要的技术决策及其原因]

## 已解决的问题
[用户提出的已经回答的问题 - 包括答案，以便下一个助手不会重新回答]

## 待处理的用户请求
[用户尚未回答或完成的问题或请求。如果没有，写"无。"]

## 相关文件
[读取、修改或创建的文件 - 每个文件的简要说明]

## 剩余工作
[还需要做什么 - 作为上下文而非指令]

## 关键上下文
[任何特定的值、错误消息、配置详情或数据，如果不明确保留就会丢失]

## 工具和模式
[使用了哪些工具、如何有效使用它们，以及任何工具特定的发现]

目标约 ${summaryBudget} tokens。要具体 - 包括文件路径、命令输出、错误消息和具体值，而不是模糊的描述。

只写摘要正文。不要包含任何前言或前缀。`;

        if (this.previousSummary) {
            // 迭代更新：保留现有信息，添加新进度
            return `${preamble}

你正在更新上下文压缩摘要。之前的压缩产生了下面的摘要。自那以后发生了新的对话轮次，需要合并进来。

之前的摘要：
${this.previousSummary}

要合并的新轮次：
${contentToSummarize}

使用这个确切的结构更新摘要。保留所有仍然相关的现有信息。添加新进度。将"进行中"的项目移到"已完成"。将已回答的问题移到"已解决的问题"。只删除明显过时的信息。

${templateSections}`;
        } else {
            // 首次压缩：从头开始摘要
            return `${preamble}

为另一个将在早期轮次被压缩后继续此对话的助手创建结构化交接摘要。下一个助手应该能够理解发生了什么，而无需重新阅读原始轮次。

要摘要的轮次：
${contentToSummarize}

使用这个确切的结构：

${templateSections}`;
        }
    }

    /**
     * 使用 LLM 生成摘要
     */
    async generateSummary(
        turnsToSummarize: HistoryItem[],
        context: AgentUserConfig
    ): Promise<string | null> {
        try {
            const prompt = this.generateSummaryPrompt(turnsToSummarize);
            const summaryBudget = this.computeSummaryBudget(turnsToSummarize);

            log.info(`[CONTEXT COMPRESSOR] Generating summary for ${turnsToSummarize.length} turns, budget: ${summaryBudget} tokens`);

            // 使用辅助 LLM 生成摘要
            const summary = await generateSummaryWithLLM(prompt, summaryBudget, context);

            if (summary) {
                log.info(`[CONTEXT COMPRESSOR] Summary generated successfully`);
            }

            return summary;
        } catch (error) {
            log.error('[CONTEXT COMPRESSOR] Failed to generate summary:', error);
            return null;
        }
    }

    /**
     * 清理孤立的 tool call/result 对
     */
    private sanitizeToolPairs(messages: HistoryItem[]): HistoryItem[] {
        // 收集所有存活的 tool call ID
        const survivingCallIds = new Set<string>();
        for (const msg of messages) {
            if (msg.role === 'assistant' && Array.isArray(msg.content)) {
                for (const part of msg.content) {
                    if (part.type === 'tool-call' && part.toolCallId) {
                        survivingCallIds.add(part.toolCallId);
                    }
                }
            }
        }

        // 收集所有 tool result 的 call ID
        const resultCallIds = new Set<string>();
        for (const msg of messages) {
            if (msg.role === 'tool') {
                const callId = (msg as any).tool_call_id;
                if (callId) {
                    resultCallIds.add(callId);
                }
            }
        }

        // 1. 移除孤立的 tool result（没有对应的 tool call）
        const orphanedResults = new Set([...resultCallIds].filter(id => !survivingCallIds.has(id)));
        let result = messages.filter(msg => {
            if (msg.role === 'tool') {
                const callId = (msg as any).tool_call_id;
                return !orphanedResults.has(callId);
            }
            return true;
        });

        if (orphanedResults.size > 0) {
            log.info(`[CONTEXT COMPRESSOR] Removed ${orphanedResults.size} orphaned tool result(s)`);
        }

        // 2. 为孤立的 tool call 添加存根 result
        const missingResults = new Set([...survivingCallIds].filter(id => !resultCallIds.has(id)));
        if (missingResults.size > 0) {
            const patched: HistoryItem[] = [];
            for (const msg of result) {
                patched.push(msg);
                if (msg.role === 'assistant' && Array.isArray(msg.content)) {
                    for (const part of msg.content) {
                        if (part.type === 'tool-call' && part.toolCallId && missingResults.has(part.toolCallId)) {
                            patched.push({
                                role: 'tool',
                                content: '[来自早期对话的结果 - 请参阅上面的上下文摘要]',
                            } as any);
                        }
                    }
                }
            }
            result = patched;
            log.info(`[CONTEXT COMPRESSOR] Added ${missingResults.size} stub tool result(s)`);
        }

        return result;
    }

    /**
     * 压缩消息历史
     */
    async compress(
        messages: HistoryItem[],
        contextLength: number,
        context: AgentUserConfig
    ): Promise<HistoryItem[]> {
        const nMessages = messages.length;
        const minForCompress = this.config.protectFirstN + 3 + 1;

        if (nMessages <= minForCompress) {
            log.warn(`[CONTEXT COMPRESSOR] Cannot compress: only ${nMessages} messages (need > ${minForCompress})`);
            return messages;
        }

        const currentTokens = this.estimateTokens(messages);
        log.info(`[CONTEXT COMPRESSOR] Compression triggered (${currentTokens} tokens >= ${Math.floor(contextLength * this.config.thresholdPercent)} threshold)`);

        // 阶段 1：修剪旧工具结果
        const { messages: prunedMessages, prunedCount } = this.pruneOldToolResults(
            messages,
            this.config.tailTokenBudget
        );
        if (prunedCount > 0) {
            log.info(`[CONTEXT COMPRESSOR] Pre-compression: pruned ${prunedCount} old tool result(s)`);
        }

        // 阶段 2：确定边界
        const compressStart = this.config.protectFirstN;
        const compressEnd = this.findTailCutByTokens(
            prunedMessages,
            compressStart,
            this.config.tailTokenBudget
        );

        if (compressStart >= compressEnd) {
            return prunedMessages;
        }

        const turnsToSummarize = prunedMessages.slice(compressStart, compressEnd);
        const tailMsgs = nMessages - compressEnd;

        log.info(
            `[CONTEXT COMPRESSOR] Summarizing turns ${compressStart + 1}-${compressEnd} (${turnsToSummarize.length} turns), protecting ${compressStart} head + ${tailMsgs} tail messages`
        );

        // 阶段 3：生成结构化摘要
        let summary = await this.generateSummary(turnsToSummarize, context);

        // 阶段 4：组装压缩后的消息列表
        const compressed: HistoryItem[] = [];

        // 添加头部消息
        for (let i = 0; i < compressStart; i++) {
            const msg = { ...prunedMessages[i] };
            // 在第一次压缩时，在系统消息中添加说明
            if (i === 0 && msg.role === 'system' && this.compressionCount === 0) {
                const content = this.getMessageContent(msg);
                msg.content = content + '\n\n[注意：一些早期对话轮次已被压缩为交接摘要以保留上下文空间。当前会话状态可能仍然反映早期工作，因此请基于该摘要和状态构建，而不是重做工作。]';
            }
            compressed.push(msg);
        }

        // 如果摘要生成失败，插入静态回退标记
        if (!summary) {
            log.warn('[CONTEXT COMPRESSOR] Summary generation failed - inserting static fallback context marker');
            const nDropped = compressEnd - compressStart;
            summary = `${SUMMARY_PREFIX}\n摘要生成不可用。${nDropped} 个对话轮次被移除以释放上下文空间，但无法摘要。移除的轮次包含本会话中的早期工作。请根据下面的最近消息和任何文件或资源的当前状态继续。`;
        } else {
            // 保存摘要用于下次迭代更新
            this.previousSummary = summary;
        }

        // 添加摘要消息
        // 选择一个不会与头部和尾部冲突的角色
        const lastHeadRole = compressStart > 0 ? prunedMessages[compressStart - 1].role : 'user';
        const firstTailRole = compressEnd < nMessages ? prunedMessages[compressEnd].role : 'user';

        let summaryRole: 'user' | 'assistant' = lastHeadRole === 'assistant' || lastHeadRole === 'tool' ? 'user' : 'assistant';

        // 如果与尾部冲突，尝试翻转
        if (summaryRole === firstTailRole) {
            const flipped: 'user' | 'assistant' = summaryRole === 'user' ? 'assistant' : 'user';
            if (flipped !== lastHeadRole) {
                summaryRole = flipped;
            }
        }

        compressed.push({
            role: summaryRole,
            content: `${SUMMARY_PREFIX}\n${summary}`,
        } as HistoryItem);

        // 添加尾部消息
        for (let i = compressEnd; i < nMessages; i++) {
            compressed.push({ ...prunedMessages[i] });
        }

        this.compressionCount++;

        // 阶段 5：清理孤立的 tool pairs
        const sanitized = this.sanitizeToolPairs(compressed);

        const newEstimate = this.estimateTokens(sanitized);
        const savedEstimate = currentTokens - newEstimate;

        log.info(
            `[CONTEXT COMPRESSOR] Compressed: ${nMessages} -> ${sanitized.length} messages (~${savedEstimate} tokens saved)`
        );
        log.info(`[CONTEXT COMPRESSOR] Compression #${this.compressionCount} complete`);

        return sanitized;
    }
}
