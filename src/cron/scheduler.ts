import type * as Telegram from 'telegram-bot-api-types';
import type { ScheduledTask } from 'node-cron';
import type { LLMChatRequestParams } from '../agent/types';
import type { CronTask } from './types';
import { schedule, validate } from 'node-cron';
import { MiddleContext, ShareContext, WorkerContext } from '../config/context';
import { ENV } from '../config/env';
import { log } from '../log/logger';
import { createTelegramBotAPI } from '../telegram/api';
import { chatWithLLM } from '../telegram/handler/chat';
import { loadAllTasks, updateTask } from './store';

const scheduledJobs: Map<string, ScheduledTask> = new Map();

export async function initCronScheduler(): Promise<void> {
    if (!ENV.DATABASE) {
        log.warn('Database not available, cron scheduler disabled');
        return;
    }

    try {
        const tasks = await loadAllTasks();
        log.info(`Loading ${tasks.length} cron tasks`);

        for (const task of tasks) {
            if (task.enabled) {
                scheduleSingleTask(task);
            }
        }

        log.info(`Cron scheduler initialized with ${scheduledJobs.size} active jobs`);
    } catch (e) {
        log.error('Failed to initialize cron scheduler:', (e as Error).message);
    }
}

export function scheduleSingleTask(task: CronTask): boolean {
    try {
        // Validate cron expression
        if (!validate(task.cronExpr)) {
            log.error(`Invalid cron expression for task ${task.id}: ${task.cronExpr}`);
            return false;
        }

        // Validate bot token is available
        if (!ENV.TELEGRAM_AVAILABLE_TOKENS.includes(task.botToken)) {
            log.error(`Bot token not available for task ${task.id}`);
            return false;
        }

        // Remove existing job if any
        unscheduleSingleTask(task.id);

        // Schedule new job
        const job = schedule(task.cronExpr, async () => {
            await executeCronTask(task);
        }, {
            timezone: task.timezone,
        });

        scheduledJobs.set(task.id, job);
        log.info(`Scheduled cron task ${task.id}: "${task.prompt.substring(0, 30)}..." at ${task.cronExpr} (${task.timezone})`);
        return true;
    } catch (e) {
        log.error(`Failed to schedule task ${task.id}:`, (e as Error).message);
        return false;
    }
}

export function unscheduleSingleTask(taskId: string): boolean {
    const job = scheduledJobs.get(taskId);
    if (job) {
        job.stop();
        scheduledJobs.delete(taskId);
        log.info(`Unscheduled cron task ${taskId}`);
        return true;
    }
    return false;
}

async function executeCronTask(task: CronTask): Promise<void> {
    log.info(`Executing cron task ${task.id}: "${task.prompt.substring(0, 50)}..."`);

    try {
        // Get current time in task's timezone
        const now = new Date();
        const localTime = now.toLocaleString('en-US', {
            timeZone: task.timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        // Build prompt with timezone-aware time context
        const promptWithTime = `[Current time: ${localTime} (${task.timezone})]\n\n${task.prompt}`;

        // Build fake Telegram message
        const fakeMessage: Telegram.Message = {
            message_id: 0,
            date: Math.floor(Date.now() / 1000),
            chat: {
                id: task.chatId,
                type: task.chatType as 'private' | 'group' | 'supergroup' | 'channel',
            },
            from: task.userId
                ? {
                      id: task.userId,
                      is_bot: false,
                      first_name: 'Cron',
                  }
                : undefined,
            text: promptWithTime,
        };

        // Create context
        const shareContext = new ShareContext(task.botToken, fakeMessage);
        const middleContext = new MiddleContext();
        middleContext.messageInfo = { type: 'text' };

        const context = await WorkerContext.from(shareContext, middleContext);

        // Build params for LLM request
        const params: LLMChatRequestParams = {
            role: 'user',
            content: promptWithTime,
        };

        // Execute chat with LLM
        const response = await chatWithLLM(fakeMessage, params, context, null);

        // Schedule message deletion if EXPIRED_TIME is set
        if (ENV.EXPIRED_TIME > 0 && response instanceof Response) {
            await scheduleMessageDeletionForCron(task, response, context);
        }

        // Update last run time
        await updateTask(task.id, { lastRunAt: Date.now() });

        log.info(`Cron task ${task.id} completed successfully`);
    } catch (e) {
        log.error(`Cron task ${task.id} failed:`, (e as Error).message);
        // Optionally send error message to chat
        try {
            const api = createTelegramBotAPI(task.botToken);
            await api.sendMessage({
                chat_id: task.chatId,
                text: `⚠️ Cron task failed: ${(e as Error).message.substring(0, 200)}`,
            });
        } catch (sendError) {
            log.error(`Failed to send error notification:`, (sendError as Error).message);
        }
    }
}

export function validateCronExpression(expr: string): boolean {
    return validate(expr);
}

export function validateTimezone(tz: string): boolean {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch {
        return false;
    }
}

export function getScheduledJobsCount(): number {
    return scheduledJobs.size;
}

/**
 * Schedule message deletion for cron task messages
 * This function directly stores message IDs to the database for scheduled deletion
 * to avoid WeakMap garbage collection issues with fake messages
 */
async function scheduleMessageDeletionForCron(
    task: CronTask,
    response: Response,
    context: WorkerContext,
): Promise<void> {
    try {
        const botName = context.SHARE_CONTEXT?.botName;
        if (!botName) {
            log.warn('Cannot schedule deletion: Bot name not found');
            return;
        }

        // Parse response to get message IDs
        const responseData = await response.clone().json() as any;
        const sentMessageIds: number[] = [];

        if (Array.isArray(responseData.result)) {
            // Multiple messages (media group)
            sentMessageIds.push(...responseData.result.map((r: any) => r.message_id).filter(Boolean));
        } else if (responseData.result?.message_id) {
            // Single message
            sentMessageIds.push(responseData.result.message_id);
        }

        if (sentMessageIds.length === 0) {
            log.info('No message IDs to schedule for deletion');
            return;
        }

        // Check if we should schedule deletion for this chat type
        const isGroup = ['group', 'supergroup'].includes(task.chatType);
        const shouldSchedule = (isGroup && ENV.SCHEDULE_GROUP_DELETE_TYPE.includes('chat'))
            || (!isGroup && ENV.SCHEDULE_PRIVATE_DELETE_TYPE.includes('chat'));

        if (!shouldSchedule) {
            log.info(`Skipping deletion schedule: chat type ${task.chatType} not configured for 'chat' message deletion`);
            return;
        }

        // Store to database for scheduled deletion
        const scheduleDeleteKey = context.SHARE_CONTEXT.scheduleDeteleKey;
        const scheduledData = JSON.parse((await ENV.DATABASE.get(scheduleDeleteKey)) || '{}');

        if (!scheduledData[botName]) {
            scheduledData[botName] = {};
        }
        if (!scheduledData[botName][task.chatId]) {
            scheduledData[botName][task.chatId] = [];
        }

        const offsetInMilliseconds = ENV.EXPIRED_TIME * 60 * 1000;
        scheduledData[botName][task.chatId].push({
            id: sentMessageIds,
            ttl: Date.now() + offsetInMilliseconds,
        });

        await ENV.DATABASE.put(scheduleDeleteKey, JSON.stringify(scheduledData));
        log.info(`[CRON DELETION] Scheduled deletion for chat ${task.chatId}, message ids: ${sentMessageIds.join(', ')}, TTL: ${ENV.EXPIRED_TIME} minutes`);
    } catch (e) {
        log.error(`Failed to schedule message deletion for cron task:`, (e as Error).message);
    }
}
