/**
 * 摘要生成器 - 使用辅助 LLM 生成上下文摘要
 */

import type { AgentUserConfig } from '../config/env';
import type { HistoryItem } from './types';
import { loadChatLLM } from '.';
import { log } from '../log/logger';

/**
 * 使用 LLM 生成摘要
 * 使用快速、便宜的模型（如 GPT-3.5 或 Claude Haiku）
 */
export async function generateSummaryWithLLM(
    prompt: string,
    maxTokens: number,
    context: AgentUserConfig
): Promise<string | null> {
    try {
        // 创建一个临时配置，使用更便宜的模型进行摘要
        const summaryContext = { ...context };

        // 优先使用便宜的模型
        // 你可以添加一个专门的配置项 SUMMARY_MODEL
        // 这里我们尝试使用 GPT-3.5 或当前配置的模型
        const originalProvider = summaryContext.AI_CHAT_PROVIDER;
        const originalModel = summaryContext[`${originalProvider.toUpperCase()}_CHAT_MODEL`];

        // 尝试使用更便宜的模型（基于 2026 年最新定价）
        if (originalProvider === 'openai') {
            // GPT-4o-mini: $0.15/$0.60 per million tokens
            summaryContext.OPENAI_CHAT_MODEL = 'gpt-4o-mini';
        } else if (originalProvider === 'anthropic') {
            // Claude Haiku 4.5: $1/$5 per million tokens
            summaryContext.ANTHROPIC_CHAT_MODEL = 'claude-haiku-4-5';
        } else if (originalProvider === 'google') {
            // Gemini 2.5 Flash-Lite: $0.075/$0.30 per million tokens (最便宜！)
            summaryContext.GOOGLE_CHAT_MODEL = 'gemini-2.5-flash-lite';
        } else if (originalProvider === 'xai') {
            // Grok 4.1 Fast: $0.20/$0.50 per million tokens
            summaryContext.XAI_CHAT_MODEL = 'grok-4.1-fast';
        }
        // 其他提供商使用默认模型

        const agent = loadChatLLM(summaryContext);
        if (!agent) {
            log.error('[SUMMARY GENERATOR] No agent available for summary generation');
            return null;
        }

        log.info(`[SUMMARY GENERATOR] Using ${summaryContext.AI_CHAT_PROVIDER} for summary generation`);

        const messages: HistoryItem[] = [
            {
                role: 'user',
                content: prompt,
            },
        ];

        const result = await agent.request(
            {
                messages,
                cache: [],
            },
            summaryContext,
            null // 不需要流式输出
        );

        const summary = result.content.trim();

        if (!summary) {
            log.error('[SUMMARY GENERATOR] Empty summary generated');
            return null;
        }

        log.info(`[SUMMARY GENERATOR] Summary generated successfully (${summary.length} chars)`);
        return summary;
    } catch (error) {
        log.error('[SUMMARY GENERATOR] Failed to generate summary:', error);
        return null;
    }
}
