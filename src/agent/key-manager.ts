/**
 * API Key Manager - 简化版 Key 轮换与冷却管理
 *
 * 功能：
 * - 多 Key 轮换（Round-Robin by lastUsed）
 * - 失败自动冷却（指数退避）
 * - 限流感知
 * - 支持单 Key 和多 Key
 */

export interface KeyState {
    key: string;
    lastUsed: number;
    errorCount: number;
    cooldownUntil?: number;
    lastError?: string;
}

export type FailureReason = 'rate_limit' | 'auth' | 'billing' | 'timeout' | 'unknown';

// 内存存储：provider -> KeyState[]
const keyStates: Map<string, KeyState[]> = new Map();

/**
 * 计算冷却时间（指数退避）
 * 1st: 1min, 2nd: 5min, 3rd: 25min, 4th+: 60min (1h cap)
 */
function calculateCooldownMs(errorCount: number, reason: FailureReason): number {
    // 计费错误使用更长的冷却时间
    if (reason === 'billing') {
        // 5h -> 10h -> 20h -> 24h (cap)
        const hours = Math.min(24, 5 * Math.pow(2, Math.max(0, errorCount - 1)));
        return hours * 60 * 60 * 1000;
    }

    // 其他错误：1min -> 5min -> 25min -> 60min (cap)
    const normalized = Math.max(1, errorCount);
    return Math.min(
        60 * 60 * 1000, // 1 hour max
        60 * 1000 * Math.pow(5, Math.min(normalized - 1, 3)),
    );
}

/**
 * 初始化 provider 的 key 状态
 */
function initKeyStates(provider: string, keys: string[]): KeyState[] {
    if (!keyStates.has(provider)) {
        keyStates.set(provider, keys.map(key => ({
            key,
            lastUsed: 0,
            errorCount: 0,
        })));
    } else {
        // 同步新增/移除的 keys
        const existing = keyStates.get(provider)!;
        const existingKeys = new Set(existing.map(s => s.key));
        const newKeys = new Set(keys);

        // 添加新 keys
        for (const key of keys) {
            if (!existingKeys.has(key)) {
                existing.push({ key, lastUsed: 0, errorCount: 0 });
            }
        }

        // 移除已删除的 keys
        const filtered = existing.filter(s => newKeys.has(s.key));
        keyStates.set(provider, filtered);
    }

    return keyStates.get(provider)!;
}

/**
 * 检查 key 是否在冷却中
 */
function isInCooldown(state: KeyState): boolean {
    return state.cooldownUntil ? Date.now() < state.cooldownUntil : false;
}

/**
 * 选择最佳 API Key
 * - 跳过冷却中的 key
 * - Round-robin by lastUsed（最久未用的优先）
 * - 如果所有 key 都在冷却，选择最快恢复的
 */
export function selectKey(provider: string, keys: string | string[] | null): string | null {
    // 处理空值
    if (!keys) return null;

    // 单 key 直接返回
    const keyArray = Array.isArray(keys) ? keys : [keys];
    if (keyArray.length === 0) return null;
    if (keyArray.length === 1) return keyArray[0];

    // 初始化状态
    const states = initKeyStates(provider, keyArray);

    // 分离可用和冷却中的 keys
    const available: KeyState[] = [];
    const inCooldown: KeyState[] = [];

    for (const state of states) {
        if (isInCooldown(state)) {
            inCooldown.push(state);
        } else {
            available.push(state);
        }
    }

    let selected: KeyState;

    if (available.length > 0) {
        // Round-robin: 选择 lastUsed 最早的
        available.sort((a, b) => a.lastUsed - b.lastUsed);
        selected = available[0];
    } else {
        // 所有 key 都在冷却，选择最快恢复的
        inCooldown.sort((a, b) => (a.cooldownUntil || 0) - (b.cooldownUntil || 0));
        selected = inCooldown[0];
    }

    // 更新 lastUsed
    selected.lastUsed = Date.now();

    return selected.key;
}

/**
 * 标记 key 使用成功 - 重置错误计数
 */
export function markKeySuccess(provider: string, key: string): void {
    const states = keyStates.get(provider);
    if (!states) return;

    const state = states.find(s => s.key === key);
    if (state) {
        state.errorCount = 0;
        state.cooldownUntil = undefined;
        state.lastError = undefined;
    }
}

/**
 * 标记 key 失败 - 设置冷却时间
 */
export function markKeyFailure(provider: string, key: string, reason: FailureReason): void {
    const states = keyStates.get(provider);
    if (!states) return;

    const state = states.find(s => s.key === key);
    if (state) {
        state.errorCount++;
        state.cooldownUntil = Date.now() + calculateCooldownMs(state.errorCount, reason);
        state.lastError = reason;
    }
}

/**
 * 从错误消息判断失败原因
 */
export function classifyError(error: Error | string): FailureReason {
    const message = typeof error === 'string' ? error.toLowerCase() : (error.message || '').toLowerCase();

    // Rate limit
    if (message.includes('rate limit') ||
        message.includes('rate_limit') ||
        message.includes('too many requests') ||
        message.includes('429')) {
        return 'rate_limit';
    }

    // Auth errors
    if (message.includes('invalid api key') ||
        message.includes('incorrect api key') ||
        message.includes('authentication') ||
        message.includes('unauthorized') ||
        message.includes('401') ||
        message.includes('403')) {
        return 'auth';
    }

    // Billing errors
    if (message.includes('billing') ||
        message.includes('quota') ||
        message.includes('exceeded') ||
        message.includes('insufficient') ||
        message.includes('credit') ||
        message.includes('payment')) {
        return 'billing';
    }

    // Timeout
    if (message.includes('timeout') ||
        message.includes('timed out') ||
        message.includes('econnreset') ||
        message.includes('etimedout')) {
        return 'timeout';
    }

    return 'unknown';
}

/**
 * 获取 provider 的 key 状态（用于调试/监控）
 */
export function getKeyStats(provider: string): KeyState[] | undefined {
    return keyStates.get(provider);
}

/**
 * 清除 provider 的所有 key 状态
 */
export function clearKeyStates(provider?: string): void {
    if (provider) {
        keyStates.delete(provider);
    } else {
        keyStates.clear();
    }
}

/**
 * 获取所有 provider 的状态摘要
 */
export function getAllKeyStats(): Record<string, { total: number; available: number; inCooldown: number }> {
    const result: Record<string, { total: number; available: number; inCooldown: number }> = {};

    for (const [provider, states] of keyStates) {
        const available = states.filter(s => !isInCooldown(s)).length;
        result[provider] = {
            total: states.length,
            available,
            inCooldown: states.length - available,
        };
    }

    return result;
}
