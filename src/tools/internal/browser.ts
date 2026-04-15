/**
 * 浏览器自动化工具
 *
 * 支持多种后端：
 * 1. Browserless.io（云端）- 支持多 API Key 轮询
 * 2. Playwright（本地/Docker）- 需要完整镜像
 * 3. 回退到简单的 fetch（最基本）
 *
 * 功能：
 * - 导航到网页
 * - 截图
 * - 点击元素
 * - 填写表单
 * - 等待元素
 * - 执行 JavaScript
 *
 * API Key 轮询：
 * - 支持多个 Browserless API Key
 * - 自动轮询使用，分散配额
 * - 单个 Key 失败时自动切换
 */

import type { AgentUserConfig } from '../../config/env';
import type { ToolResult } from '../types';
import { log } from '../../log/logger';
import { ENV } from '../../config/env';

/**
 * 浏览器后端类型
 */
type BrowserBackend = 'playwright' | 'browserless' | 'fetch';

/**
 * 浏览器会话
 */
interface BrowserSession {
    id: string;
    backend: BrowserBackend;
    url: string;
    createdAt: number;
}

/**
 * 浏览器操作结果
 */
interface BrowserResult {
    success: boolean;
    content?: string;
    screenshot?: string; // base64
    error?: string;
    url?: string;
}

// 会话管理（简单的内存存储）
const sessions = new Map<string, BrowserSession>();

// API Key 轮询状态
let currentKeyIndex = 0;
const keyUsageCount = new Map<string, number>();
const keyFailureCount = new Map<string, number>();

/**
 * 获取 Browserless API Keys（支持多个）
 */
function getBrowserlessApiKeys(config: AgentUserConfig): string[] {
    const keys: string[] = [];

    // 支持多种配置方式
    // 1. 单个 Key
    if (config.BROWSERLESS_API_KEY) {
        keys.push(config.BROWSERLESS_API_KEY);
    }

    // 2. 多个 Key（逗号分隔）
    if (config.BROWSERLESS_API_KEYS) {
        const multiKeys = config.BROWSERLESS_API_KEYS.split(',')
            .map((k: string) => k.trim())
            .filter((k: string) => k.length > 0);
        keys.push(...multiKeys);
    }

    // 3. 数组格式（JSON）
    if (config.BROWSERLESS_API_KEY_LIST) {
        try {
            const listKeys = JSON.parse(config.BROWSERLESS_API_KEY_LIST);
            if (Array.isArray(listKeys)) {
                keys.push(...listKeys.filter(k => typeof k === 'string' && k.length > 0));
            }
        } catch (e) {
            log.warn('[BROWSER] Failed to parse BROWSERLESS_API_KEY_LIST:', e);
        }
    }

    // 去重
    return [...new Set(keys)];
}

/**
 * 获取下一个可用的 API Key（轮询策略）
 */
function getNextApiKey(config: AgentUserConfig): string | null {
    const keys = getBrowserlessApiKeys(config);

    if (keys.length === 0) {
        return null;
    }

    if (keys.length === 1) {
        return keys[0];
    }

    // 轮询策略：跳过失败次数过多的 Key
    const maxFailures = 3;
    let attempts = 0;
    const maxAttempts = keys.length * 2;

    while (attempts < maxAttempts) {
        const key = keys[currentKeyIndex % keys.length];
        currentKeyIndex++;
        attempts++;

        const failures = keyFailureCount.get(key) || 0;
        if (failures < maxFailures) {
            // 记录使用次数
            keyUsageCount.set(key, (keyUsageCount.get(key) || 0) + 1);
            log.info(`[BROWSER] Using API Key #${currentKeyIndex % keys.length + 1} (used ${keyUsageCount.get(key)} times, ${failures} failures)`);
            return key;
        }

        log.warn(`[BROWSER] Skipping API Key #${currentKeyIndex % keys.length + 1} (too many failures: ${failures})`);
    }

    // 所有 Key 都失败了，重置失败计数并返回第一个
    log.warn('[BROWSER] All API Keys have failures, resetting failure counts');
    keyFailureCount.clear();
    return keys[0];
}

/**
 * 记录 API Key 使用结果
 */
function recordApiKeyResult(key: string, success: boolean) {
    if (success) {
        // 成功时重置失败计数
        keyFailureCount.set(key, 0);
    } else {
        // 失败时增加失败计数
        keyFailureCount.set(key, (keyFailureCount.get(key) || 0) + 1);
    }
}

/**
 * 获取 API Key 使用统计
 */
function getApiKeyStats(config: AgentUserConfig): string {
    const keys = getBrowserlessApiKeys(config);
    if (keys.length === 0) {
        return 'No API Keys configured';
    }

    const stats = keys.map((key, index) => {
        const masked = key.slice(0, 8) + '...' + key.slice(-4);
        const usage = keyUsageCount.get(key) || 0;
        const failures = keyFailureCount.get(key) || 0;
        return `Key #${index + 1} (${masked}): ${usage} uses, ${failures} failures`;
    });

    return stats.join('\n');
}

/**
 * 检测可用的浏览器后端
 */
function detectBrowserBackend(config: AgentUserConfig): BrowserBackend {
    // 检查是否在 Cloudflare Workers 环境
    if (typeof navigator !== 'undefined' && navigator.userAgent?.includes('Cloudflare-Workers')) {
        // Workers 环境，只能使用云端或 fetch
        if (getBrowserlessApiKeys(config).length > 0) {
            return 'browserless';
        }
        return 'fetch';
    }

    // 本地/Docker 环境
    if (getBrowserlessApiKeys(config).length > 0) {
        return 'browserless';
    }

    // TODO: 检查 Playwright 是否已安装
    // 暂时回退到 fetch
    return 'fetch';
}

/**
 * 使用 Playwright 导航（本地）
 */
async function navigateWithPlaywright(url: string): Promise<BrowserResult> {
    try {
        // TODO: 实现 Playwright 集成
        // 需要安装: bun add playwright
        // 需要初始化: bunx playwright install chromium

        log.warn('[BROWSER] Playwright not implemented yet, falling back to fetch');
        return navigateWithFetch(url);
    } catch (error) {
        log.error('[BROWSER] Playwright error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * 使用 Browserless.io 导航（云端）
 */
async function navigateWithBrowserless(url: string, config: AgentUserConfig): Promise<BrowserResult> {
    const apiKey = getNextApiKey(config);
    if (!apiKey) {
        log.error('[BROWSER] No Browserless API key available');
        return {
            success: false,
            error: 'BROWSERLESS_API_KEY not configured',
        };
    }

    try {
        const browserlessUrl = config.BROWSERLESS_URL || 'https://chrome.browserless.io';

        // 使用 Browserless 的 content API
        const response = await fetch(`${browserlessUrl}/content?token=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                waitFor: 2000, // 等待 2 秒让页面加载
            }),
        });

        if (!response.ok) {
            recordApiKeyResult(apiKey, false);
            throw new Error(`Browserless API error: ${response.statusText}`);
        }

        const content = await response.text();
        recordApiKeyResult(apiKey, true);

        return {
            success: true,
            content,
            url,
        };
    } catch (error) {
        log.error('[BROWSER] Browserless error:', error);
        recordApiKeyResult(apiKey, false);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * 使用简单的 fetch 导航（回退方案）
 */
async function navigateWithFetch(url: string): Promise<BrowserResult> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const content = await response.text();

        return {
            success: true,
            content,
            url,
        };
    } catch (error) {
        log.error('[BROWSER] Fetch error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * 导航到网页
 */
async function browserNavigate(
    args: { url: string; waitFor?: number },
    env: Record<string, any>,
    config: AgentUserConfig
): Promise<ToolResult> {
    try {
        const { url, waitFor } = args;

        if (!url || !url.startsWith('http')) {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: 'Invalid URL. Must start with http:// or https://',
                    }),
                }],
            };
        }

        log.info(`[BROWSER] Navigating to: ${url}`);

        const backend = detectBrowserBackend(config);
        log.info(`[BROWSER] Using backend: ${backend}`);

        let result: BrowserResult;

        switch (backend) {
            case 'playwright':
                result = await navigateWithPlaywright(url);
                break;
            case 'browserless':
                result = await navigateWithBrowserless(url, config);
                break;
            case 'fetch':
            default:
                result = await navigateWithFetch(url);
                break;
        }

        // 提取页面文本内容（简化版）
        if (result.success && result.content) {
            // 移除 HTML 标签，只保留文本
            const textContent = result.content
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // 限制长度
            const maxLength = 8000;
            const truncated = textContent.length > maxLength
                ? textContent.slice(0, maxLength) + '...[truncated]'
                : textContent;

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: true,
                        url: result.url,
                        content: truncated,
                        backend,
                        note: textContent.length > maxLength
                            ? `Content truncated from ${textContent.length} to ${maxLength} characters`
                            : undefined,
                    }, null, 2),
                }],
            };
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2),
            }],
        };
    } catch (error) {
        log.error('[BROWSER] Navigate error:', error);
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : String(error),
                }),
            }],
        };
    }
}

/**
 * 截图（需要 Playwright 或 Browserless）
 */
async function browserScreenshot(
    args: { url: string; fullPage?: boolean },
    env: Record<string, any>,
    config: AgentUserConfig
): Promise<ToolResult> {
    try {
        const { url, fullPage = false } = args;

        const backend = detectBrowserBackend(config);

        if (backend === 'fetch') {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: 'Screenshot requires Playwright or Browserless backend. Current backend: fetch',
                        hint: 'Set BROWSERLESS_API_KEY to use cloud screenshot, or install Playwright for local screenshots',
                    }),
                }],
            };
        }

        // TODO: 实现截图功能
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: 'Screenshot not implemented yet',
                }),
            }],
        };
    } catch (error) {
        log.error('[BROWSER] Screenshot error:', error);
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : String(error),
                }),
            }],
        };
    }
}

export default {
    navigate: {
        schema: {
            name: 'browser_navigate',
            description: `导航到网页并获取内容。支持多种后端：
- Playwright（本地/Docker）：功能最强大，支持 JavaScript 渲染
- Browserless（云端）：适合 Cloudflare Workers 部署
- Fetch（回退）：简单的 HTTP 请求，不支持 JavaScript

使用场景：
- 获取动态网页内容（需要 JavaScript 渲染）
- 访问需要等待加载的页面
- 比 webFetch 更强大的网页抓取

注意：
- 当前实现使用 fetch 作为回退方案
- 要启用完整功能，需要配置 BROWSERLESS_API_KEY 或安装 Playwright`,
            parameters: {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        description: '要访问的网页 URL（必须以 http:// 或 https:// 开头）',
                    },
                    waitFor: {
                        type: 'number',
                        description: '等待页面加载的时间（毫秒），默认 2000ms',
                    },
                },
                required: ['url'],
            },
        },
        func: browserNavigate,
    },
    screenshot: {
        schema: {
            name: 'browser_screenshot',
            description: `对网页进行截图。

需要：Playwright（本地）或 Browserless（云端）

使用场景：
- 捕获网页的视觉外观
- 验证页面渲染
- 生成网页预览

注意：需要配置 BROWSERLESS_API_KEY 或安装 Playwright`,
            parameters: {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        description: '要截图的网页 URL',
                    },
                    fullPage: {
                        type: 'boolean',
                        description: '是否截取整个页面（默认 false，只截取可见区域）',
                    },
                },
                required: ['url'],
            },
        },
        func: browserScreenshot,
    },
};
