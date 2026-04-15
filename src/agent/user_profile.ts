/**
 * 用户画像系统
 *
 * 跨会话记住用户的偏好、习惯和常用功能
 * 灵感来源：Hermes Agent 的用户建模系统
 *
 * 功能：
 * - 语言偏好
 * - 常用工具
 * - 沟通风格
 * - 时区
 * - 自定义备注
 */

import type { AgentUserConfig } from '../config/env';
import { ENV } from '../config/env';
import { log } from '../log/logger';

/**
 * 用户画像数据结构
 */
export interface UserProfile {
    // 语言偏好
    language?: 'zh' | 'en' | 'auto';
    // 常用工具列表
    preferredTools?: string[];
    // 沟通风格（简洁/详细）
    communicationStyle?: 'concise' | 'detailed' | 'balanced';
    // 时区
    timezone?: string;
    // 自定义备注（AI 的观察）
    customNotes?: string;
    // 最后更新时间
    lastUpdated: number;
    // 交互次数
    interactionCount?: number;
}

/**
 * 用户画像管理器
 */
export class UserProfileManager {
    private chatId: string;
    private botId: number;
    private profileKey: string;

    constructor(chatId: string | number, botId: number) {
        this.chatId = String(chatId);
        this.botId = botId;
        this.profileKey = `user_profile:${this.chatId}:${this.botId}`;
    }

    /**
     * 获取用户画像
     */
    async getProfile(): Promise<UserProfile | null> {
        try {
            const data = await ENV.DATABASE.get(this.profileKey);
            if (!data) {
                return null;
            }
            return JSON.parse(data) as UserProfile;
        } catch (error) {
            log.error('[USER_PROFILE] Failed to get profile:', error);
            return null;
        }
    }

    /**
     * 保存用户画像
     */
    async saveProfile(profile: UserProfile): Promise<boolean> {
        try {
            profile.lastUpdated = Date.now();
            await ENV.DATABASE.put(this.profileKey, JSON.stringify(profile));
            log.info(`[USER_PROFILE] Saved profile for ${this.chatId}`);
            return true;
        } catch (error) {
            log.error('[USER_PROFILE] Failed to save profile:', error);
            return false;
        }
    }

    /**
     * 更新用户画像（部分更新）
     */
    async updateProfile(updates: Partial<UserProfile>): Promise<boolean> {
        try {
            const current = await this.getProfile() || {
                lastUpdated: Date.now(),
                interactionCount: 0,
            };

            const updated: UserProfile = {
                ...current,
                ...updates,
                lastUpdated: Date.now(),
            };

            return await this.saveProfile(updated);
        } catch (error) {
            log.error('[USER_PROFILE] Failed to update profile:', error);
            return false;
        }
    }

    /**
     * 增加交互计数
     */
    async incrementInteraction(): Promise<void> {
        try {
            const profile = await this.getProfile();
            if (profile) {
                profile.interactionCount = (profile.interactionCount || 0) + 1;
                await this.saveProfile(profile);
            }
        } catch (error) {
            log.error('[USER_PROFILE] Failed to increment interaction:', error);
        }
    }

    /**
     * 删除用户画像
     */
    async deleteProfile(): Promise<boolean> {
        try {
            await ENV.DATABASE.delete(this.profileKey);
            log.info(`[USER_PROFILE] Deleted profile for ${this.chatId}`);
            return true;
        } catch (error) {
            log.error('[USER_PROFILE] Failed to delete profile:', error);
            return false;
        }
    }

    /**
     * 生成系统提示注入文本
     */
    async generateSystemPrompt(): Promise<string> {
        const profile = await this.getProfile();
        if (!profile) {
            return '';
        }

        const parts: string[] = ['# User Profile'];

        if (profile.language) {
            const langMap = {
                zh: 'Chinese (中文)',
                en: 'English',
                auto: 'Auto-detect',
            };
            parts.push(`- Preferred Language: ${langMap[profile.language]}`);
        }

        if (profile.communicationStyle) {
            const styleMap = {
                concise: 'Concise (brief and to the point)',
                detailed: 'Detailed (comprehensive explanations)',
                balanced: 'Balanced (moderate detail)',
            };
            parts.push(`- Communication Style: ${styleMap[profile.communicationStyle]}`);
        }

        if (profile.preferredTools && profile.preferredTools.length > 0) {
            parts.push(`- Frequently Used Tools: ${profile.preferredTools.join(', ')}`);
        }

        if (profile.timezone) {
            parts.push(`- Timezone: ${profile.timezone}`);
        }

        if (profile.customNotes) {
            parts.push(`\nNotes about this user:\n${profile.customNotes}`);
        }

        if (profile.interactionCount && profile.interactionCount > 0) {
            parts.push(`\n(Total interactions: ${profile.interactionCount})`);
        }

        return parts.join('\n');
    }

    /**
     * 从用户配置推断偏好
     */
    static inferFromConfig(config: AgentUserConfig): Partial<UserProfile> {
        const inferred: Partial<UserProfile> = {};

        // 推断语言偏好
        if (config.LANGUAGE) {
            if (config.LANGUAGE.includes('zh')) {
                inferred.language = 'zh';
            } else if (config.LANGUAGE.includes('en')) {
                inferred.language = 'en';
            }
        }

        // 推断常用工具
        if (config.USE_TOOLS && config.USE_TOOLS.length > 0) {
            inferred.preferredTools = config.USE_TOOLS;
        }

        return inferred;
    }
}

/**
 * 创建用户画像管理器
 */
export function createUserProfileManager(chatId: string | number, botId: number): UserProfileManager {
    return new UserProfileManager(chatId, botId);
}
