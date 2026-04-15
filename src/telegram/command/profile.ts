/**
 * 用户画像命令处理器
 */

import type * as Telegram from 'telegram-bot-api-types';
import type { WorkerContext } from '../../config/context';
import type { MessageSender } from '../utils/send';
import type { CommandHandler, ScopeType } from './types';
import { createUserProfileManager } from '../../agent/user_profile';
import { ENV } from '../../config/env';
import { log } from '../../log/logger';
import { escape } from '../utils/md2tgmd';
import { COMMAND_AUTH_CHECKER } from './system';

/**
 * /profile 命令 - 查看和管理用户画像
 */
export class ProfileCommandHandler implements CommandHandler {
    command = '/profile';
    scopes: ScopeType[] = ['all_private_chats', 'all_group_chats', 'all_chat_administrators'];
    needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;

    handle = async (message: Telegram.Message, subcommand: string, context: WorkerContext, sender: MessageSender): Promise<Response> => {
        // 从 chatHistoryKey 提取正确的 ID，与 chat.ts 逻辑一致
        const keyParts = context.SHARE_CONTEXT.chatHistoryKey.split(':');
        const chatId = keyParts[1]; // chat_id
        const botId = context.SHARE_CONTEXT.botId;
        const fromId = keyParts[3]; // from_id (如果存在)

        // 构建 profile key
        let profileId = chatId;
        if (fromId) {
            profileId = `${chatId}:${botId}:${fromId}`;
        } else {
            profileId = `${chatId}:${botId}`;
        }

        const profileManager = createUserProfileManager(profileId, 0);

        // 解析子命令
        const args = subcommand.trim().split(/\s+/);
        const action = args[0]?.toLowerCase();

        try {
            switch (action) {
                case 'set':
                    return await this.handleSet(args.slice(1), profileManager, sender);
                case 'clear':
                    return await this.handleClear(profileManager, sender);
                case 'delete':
                    return await this.handleDelete(profileManager, sender);
                case '':
                case 'show':
                default:
                    return await this.handleShow(profileManager, sender);
            }
        } catch (error) {
            log.error('[PROFILE_COMMAND] Error:', error);
            return sender.sendPlainText(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    /**
     * 显示用户画像
     */
    private async handleShow(profileManager: any, sender: MessageSender): Promise<Response> {
        const profile = await profileManager.getProfile();

        if (!profile) {
            return sender.sendPlainText(
                '📋 User Profile\n\n'
                + 'No profile data yet. Use `/profile set` to configure your preferences.\n\n'
                + 'Available settings:\n'
                + '• `/profile set language zh|en` - Set language preference\n'
                + '• `/profile set style concise|detailed|balanced` - Set communication style\n'
                + '• `/profile set timezone Asia/Shanghai` - Set timezone\n'
                + '• `/profile set notes <text>` - Add custom notes\n'
                + '• `/profile clear` - Clear all settings\n'
                + '• `/profile delete` - Delete profile'
            );
        }

        const lines: string[] = ['📋 *User Profile*\n'];

        if (profile.language) {
            const langMap: Record<string, string> = {
                zh: '🇨🇳 Chinese',
                en: '🇺🇸 English',
                auto: '🌐 Auto-detect',
            };
            lines.push(`*Language:* ${langMap[profile.language] || profile.language}`);
        }

        if (profile.communicationStyle) {
            const styleMap: Record<string, string> = {
                concise: '📝 Concise',
                detailed: '📚 Detailed',
                balanced: '⚖️ Balanced',
            };
            lines.push(`*Style:* ${styleMap[profile.communicationStyle] || profile.communicationStyle}`);
        }

        if (profile.preferredTools && profile.preferredTools.length > 0) {
            lines.push(`*Preferred Tools:* ${profile.preferredTools.join(', ')}`);
        }

        if (profile.timezone) {
            lines.push(`*Timezone:* ${profile.timezone}`);
        }

        if (profile.customNotes) {
            lines.push(`\n*Notes:*\n${escape(profile.customNotes)}`);
        }

        if (profile.interactionCount) {
            lines.push(`\n_Total interactions: ${profile.interactionCount}_`);
        }

        const lastUpdated = new Date(profile.lastUpdated).toLocaleString();
        lines.push(`\n_Last updated: ${lastUpdated}_`);

        return sender.sendRichText(lines.join('\n'), 'MarkdownV2');
    }

    /**
     * 设置用户画像
     */
    private async handleSet(args: string[], profileManager: any, sender: MessageSender): Promise<Response> {
        if (args.length < 2) {
            return sender.sendPlainText(
                'Usage: /profile set <key> <value>\n\n'
                + 'Available keys:\n'
                + '• language: zh, en, auto\n'
                + '• style: concise, detailed, balanced\n'
                + '• timezone: e.g., Asia/Shanghai, America/New_York\n'
                + '• notes: custom text (rest of the message)'
            );
        }

        const key = args[0].toLowerCase();
        const value = args.slice(1).join(' ');

        const updates: Record<string, any> = {};

        switch (key) {
            case 'language':
            case 'lang':
                if (!['zh', 'en', 'auto'].includes(value)) {
                    return sender.sendPlainText('❌ Invalid language. Use: zh, en, or auto');
                }
                updates.language = value;
                break;

            case 'style':
            case 'communication':
                if (!['concise', 'detailed', 'balanced'].includes(value)) {
                    return sender.sendPlainText('❌ Invalid style. Use: concise, detailed, or balanced');
                }
                updates.communicationStyle = value;
                break;

            case 'timezone':
            case 'tz':
                // 简单验证时区格式
                if (!value.includes('/')) {
                    return sender.sendPlainText('❌ Invalid timezone format. Example: Asia/Shanghai');
                }
                updates.timezone = value;
                break;

            case 'notes':
            case 'note':
                updates.customNotes = value;
                break;

            default:
                return sender.sendPlainText(`❌ Unknown key: ${key}`);
        }

        const success = await profileManager.updateProfile(updates);

        if (success) {
            return sender.sendPlainText(`✅ Profile updated: ${key} = ${value}`);
        } else {
            return sender.sendPlainText('❌ Failed to update profile');
        }
    }

    /**
     * 清空用户画像设置
     */
    private async handleClear(profileManager: any, sender: MessageSender): Promise<Response> {
        const success = await profileManager.saveProfile({
            lastUpdated: Date.now(),
            interactionCount: 0,
        });

        if (success) {
            return sender.sendPlainText('✅ Profile cleared');
        } else {
            return sender.sendPlainText('❌ Failed to clear profile');
        }
    }

    /**
     * 删除用户画像
     */
    private async handleDelete(profileManager: any, sender: MessageSender): Promise<Response> {
        const success = await profileManager.deleteProfile();

        if (success) {
            return sender.sendPlainText('✅ Profile deleted');
        } else {
            return sender.sendPlainText('❌ Failed to delete profile');
        }
    }
}
