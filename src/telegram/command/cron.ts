import type * as Telegram from 'telegram-bot-api-types';
import type { WorkerContext } from '../../config/context';
import type { MessageSender } from '../utils/send';
import type { CommandHandler, ScopeType } from './types';
import type { CronTask } from '../../cron/types';
import {
    addTask,
    getTasksForChat,
    removeTask,
    scheduleSingleTask,
    unscheduleSingleTask,
    updateTask,
    validateCronExpression,
    validateTimezone,
} from '../../cron';
import { ENV } from '../../config/env';
import { log } from '../../log/logger';
import { COMMAND_AUTH_CHECKER } from './system';

export class CronCommandHandler implements CommandHandler {
    command = '/cron';
    scopes: ScopeType[] = ['all_private_chats', 'all_chat_administrators'];
    needAuth = COMMAND_AUTH_CHECKER.default;

    handle = async (message: Telegram.Message, subcommand: string, context: WorkerContext, sender: MessageSender): Promise<Response> => {
        const parts = subcommand.trim().split(/\s+/);
        const action = parts[0]?.toLowerCase() || 'help';

        try {
            switch (action) {
                case 'list':
                    return this.handleList(message, sender);
                case 'add':
                    return this.handleAdd(message, subcommand.substring(4).trim(), context, sender);
                case 'del':
                case 'delete':
                case 'remove':
                    return this.handleRemove(parts[1], message, sender);
                case 'on':
                case 'enable':
                    return this.handleToggle(parts[1], true, message, sender);
                case 'off':
                case 'disable':
                    return this.handleToggle(parts[1], false, message, sender);
                case 'help':
                default:
                    return this.showHelp(sender);
            }
        } catch (e) {
            log.error('Cron command error:', (e as Error).message);
            return sender.sendPlainText(`Error: ${(e as Error).message}`);
        }
    };

    private async handleList(message: Telegram.Message, sender: MessageSender): Promise<Response> {
        const tasks = await getTasksForChat(message.chat.id);

        if (tasks.length === 0) {
            return sender.sendPlainText('No scheduled tasks for this chat.');
        }

        let msg = '📅 *Scheduled Tasks:*\n\n';
        for (const task of tasks) {
            const status = task.enabled ? '✅' : '⏸️';
            const lastRun = task.lastRunAt
                ? new Date(task.lastRunAt).toLocaleString('zh-CN', { timeZone: task.timezone })
                : 'Never';
            msg += `${status} \`${task.id.substring(0, 8)}\`\n`;
            msg += `   ⏰ \`${task.cronExpr}\` \\(${task.timezone}\\)\n`;
            msg += `   📝 ${this.escapeMarkdown(task.prompt.substring(0, 50))}${task.prompt.length > 50 ? '\\.\\.\\.' : ''}\n`;
            msg += `   🕐 Last: ${this.escapeMarkdown(lastRun)}\n\n`;
        }

        return sender.sendRichText(msg, 'MarkdownV2');
    }

    private async handleAdd(message: Telegram.Message, args: string, context: WorkerContext, sender: MessageSender): Promise<Response> {
        if (!args) {
            return sender.sendPlainText('Usage: /cron add <time|cron_expr> [timezone] <prompt>\n\nExamples:\n/cron add 09:00 每日早报\n/cron add 0 9 * * * Asia/Tokyo Good morning!');
        }

        const { cronExpr, timezone, prompt } = this.parseAddArgs(args, context.USER_CONFIG.TIMEZONE);

        if (!prompt) {
            return sender.sendPlainText('Please provide a prompt for the AI.');
        }

        if (!validateCronExpression(cronExpr)) {
            return sender.sendPlainText(`Invalid cron expression: ${cronExpr}\n\nFormat: minute hour day month weekday\nExample: 0 9 * * * (daily at 9:00)`);
        }

        if (!validateTimezone(timezone)) {
            return sender.sendPlainText(`Invalid timezone: ${timezone}\n\nExamples: Asia/Shanghai, Asia/Tokyo, America/New_York`);
        }

        const task: CronTask = {
            id: crypto.randomUUID(),
            chatId: message.chat.id,
            botToken: context.SHARE_CONTEXT.botToken,
            botName: context.SHARE_CONTEXT.botName || '',
            cronExpr,
            timezone,
            prompt,
            enabled: true,
            createdAt: Date.now(),
            chatType: message.chat.type,
            userId: message.from?.id,
        };

        await addTask(task);
        scheduleSingleTask(task);

        return sender.sendPlainText(`✅ Task added!\n\nID: ${task.id.substring(0, 8)}\nSchedule: ${cronExpr} (${timezone})\nPrompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);
    }

    private parseAddArgs(args: string, defaultTimezone: string): { cronExpr: string; timezone: string; prompt: string } {
        // Try to parse as simple time format first: HH:MM
        const timeMatch = args.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);
        if (timeMatch) {
            const hour = Number.parseInt(timeMatch[1], 10);
            const minute = Number.parseInt(timeMatch[2], 10);
            if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
                // Check if next part is a timezone
                const remaining = timeMatch[3];
                const tzMatch = remaining.match(/^([A-Za-z_/]+)\s+(.+)$/);
                if (tzMatch && validateTimezone(tzMatch[1])) {
                    return {
                        cronExpr: `${minute} ${hour} * * *`,
                        timezone: tzMatch[1],
                        prompt: tzMatch[2].trim(),
                    };
                }
                return {
                    cronExpr: `${minute} ${hour} * * *`,
                    timezone: defaultTimezone,
                    prompt: remaining.trim(),
                };
            }
        }

        // Try to parse as full cron expression: "m h d M w" or "m h d M w timezone prompt"
        const cronParts = args.split(/\s+/);
        if (cronParts.length >= 6) {
            const potentialCron = cronParts.slice(0, 5).join(' ');
            if (validateCronExpression(potentialCron)) {
                // Check if 6th part is timezone
                if (validateTimezone(cronParts[5])) {
                    return {
                        cronExpr: potentialCron,
                        timezone: cronParts[5],
                        prompt: cronParts.slice(6).join(' ').trim(),
                    };
                }
                return {
                    cronExpr: potentialCron,
                    timezone: defaultTimezone,
                    prompt: cronParts.slice(5).join(' ').trim(),
                };
            }
        }

        // Fallback: treat as daily at 9:00
        return {
            cronExpr: '0 9 * * *',
            timezone: defaultTimezone,
            prompt: args.trim(),
        };
    }

    private async handleRemove(taskId: string | undefined, message: Telegram.Message, sender: MessageSender): Promise<Response> {
        if (!taskId) {
            return sender.sendPlainText('Usage: /cron del <task_id>\n\nUse /cron list to see task IDs.');
        }

        // Find task by partial ID match
        const tasks = await getTasksForChat(message.chat.id);
        const task = tasks.find(t => t.id.startsWith(taskId));

        if (!task) {
            return sender.sendPlainText(`Task not found: ${taskId}`);
        }

        unscheduleSingleTask(task.id);
        await removeTask(task.id);

        return sender.sendPlainText(`✅ Task deleted: ${task.id.substring(0, 8)}`);
    }

    private async handleToggle(taskId: string | undefined, enable: boolean, message: Telegram.Message, sender: MessageSender): Promise<Response> {
        if (!taskId) {
            return sender.sendPlainText(`Usage: /cron ${enable ? 'on' : 'off'} <task_id>`);
        }

        // Find task by partial ID match within this chat
        const tasks = await getTasksForChat(message.chat.id);
        const task = tasks.find(t => t.id.startsWith(taskId));

        if (!task) {
            return sender.sendPlainText(`Task not found: ${taskId}`);
        }

        await updateTask(task.id, { enabled: enable });

        if (enable) {
            scheduleSingleTask(task);
        } else {
            unscheduleSingleTask(task.id);
        }

        return sender.sendPlainText(`✅ Task ${enable ? 'enabled' : 'disabled'}: ${task.id.substring(0, 8)}`);
    }

    private showHelp(sender: MessageSender): Promise<Response> {
        const help = `📅 *Cron Command Help*

*Add a task:*
\`/cron add 09:00 每日早报\`
\`/cron add 09:00 Asia/Tokyo Good morning\\!\`
\`/cron add 0 9 \\* \\* \\* Daily summary\`

*List tasks:*
\`/cron list\`

*Delete a task:*
\`/cron del <task\\_id>\`

*Enable/Disable:*
\`/cron on <task\\_id>\`
\`/cron off <task\\_id>\`

*Cron Format:*
\`minute hour day month weekday\`
\\- \`0 9 \\* \\* \\*\` \\= Daily at 9:00
\\- \`0 9 \\* \\* 1\\-5\` \\= Weekdays at 9:00
\\- \`30 \\*/2 \\* \\* \\*\` \\= Every 2 hours at :30`;

        return sender.sendRichText(help, 'MarkdownV2');
    }

    private escapeMarkdown(text: string): string {
        return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
    }
}
