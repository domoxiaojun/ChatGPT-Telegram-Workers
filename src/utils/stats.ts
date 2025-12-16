/**
 * 统计模块（内存存储版本）
 * 记录 Bot 使用情况
 * Docker 重启后统计数据会重置
 */

import type { WorkerContextBase } from '../config/context';

export interface StatsData {
    totalUsers: number;
    totalGroups: number;
    totalMessages: number;
    todayMessages: number;
}

// 内存存储
class StatsStore {
    private users: Set<string> = new Set();
    private groups: Set<string> = new Set();
    private totalMessages = 0;
    private dailyMessages: Map<string, number> = new Map();

    addUser(userId: string): void {
        this.users.add(userId);
    }

    addGroup(groupId: string): void {
        this.groups.add(groupId);
    }

    incrementMessage(): void {
        this.totalMessages++;
    }

    incrementDailyMessage(): void {
        const today = new Date().toISOString().split('T')[0];
        const current = this.dailyMessages.get(today) || 0;
        this.dailyMessages.set(today, current + 1);
    }

    getStats(): StatsData {
        const today = new Date().toISOString().split('T')[0];
        return {
            totalUsers: this.users.size,
            totalGroups: this.groups.size,
            totalMessages: this.totalMessages,
            todayMessages: this.dailyMessages.get(today) || 0,
        };
    }

    // 清理过期的日统计（保留最近7天）
    cleanOldDailyStats(): void {
        const today = new Date();
        const keepDays = 7;
        const oldestDate = new Date(today.getTime() - keepDays * 24 * 60 * 60 * 1000);
        const oldestDateStr = oldestDate.toISOString().split('T')[0];

        for (const [date] of this.dailyMessages) {
            if (date < oldestDateStr) {
                this.dailyMessages.delete(date);
            }
        }
    }
}

// 全局统计存储实例（按 botId 分组）
const statsStores: Map<string, StatsStore> = new Map();

function getStatsStore(botId: string): StatsStore {
    if (!statsStores.has(botId)) {
        statsStores.set(botId, new StatsStore());
    }
    return statsStores.get(botId)!;
}

/**
 * 记录使用者活动
 * @param context - 上下文对象
 */
export async function recordUserActivity(context: WorkerContextBase, message: any): Promise<void> {
    try {
        const chatId = message?.chat?.id;
        const speakerId = message?.from?.id;
        const chatType = message?.chat?.type;
        const botId = context.SHARE_CONTEXT.botId;

        if (!chatId || !botId) {
            return;
        }

        const store = getStatsStore(String(botId));

        // 1. 记录使用者
        if (speakerId) {
            store.addUser(String(speakerId));
        }

        // 2. 记录群组
        if (chatType === 'group' || chatType === 'supergroup') {
            store.addGroup(String(chatId));
        }

        // 3. 增加总消息数
        store.incrementMessage();

        // 4. 增加今日消息数
        store.incrementDailyMessage();

        // 定期清理旧数据（每100条消息清理一次）
        if (store.getStats().totalMessages % 100 === 0) {
            store.cleanOldDailyStats();
        }
    }
    catch (e) {
        // 统计失败不影响主要功能
        console.error('Stats recording error:', e);
    }
}

/**
 * 取得统计资料
 * @param botId - Bot ID
 * @returns 统计资料
 */
export function getStats(botId: string): StatsData {
    try {
        const store = getStatsStore(botId);
        return store.getStats();
    }
    catch (e) {
        console.error('Stats retrieval error:', e);
        return {
            totalUsers: 0,
            totalGroups: 0,
            totalMessages: 0,
            todayMessages: 0,
        };
    }
}

/**
 * 重置统计数据（可选功能）
 * @param botId - Bot ID
 */
export function resetStats(botId: string): void {
    statsStores.delete(botId);
}
