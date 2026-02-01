import type { RouterRequest } from '../utils/router';
import { ENV } from '../config/env';
import { addTask, getTaskById, loadAllTasks, removeTask, scheduleSingleTask, unscheduleSingleTask, updateTask, validateCronExpression, validateTimezone } from '../cron';

// Parse cron add arguments (same logic as CronCommandHandler)
function parseAddArgs(args: string, defaultTimezone: string): { cronExpr: string; timezone: string; prompt: string } {
    // Try to parse as simple time format first: HH:MM
    const timeMatch = args.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);
    if (timeMatch) {
        const hour = Number.parseInt(timeMatch[1], 10);
        const minute = Number.parseInt(timeMatch[2], 10);
        if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
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

    // Try to parse as full cron expression
    const cronParts = args.split(/\s+/);
    if (cronParts.length >= 6) {
        const potentialCron = cronParts.slice(0, 5).join(' ');
        if (validateCronExpression(potentialCron)) {
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

// Simple token authentication
function checkAuth(request: RouterRequest): boolean {
    const authToken = ENV.ADMIN_TOKEN || process.env.ADMIN_TOKEN;
    if (!authToken) {
        return true;
    }

    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        || new URL(request.url).searchParams.get('token');

    return token === authToken;
}

// GET /api/cron - List all cron tasks
export async function apiCronList(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const tasks = await loadAllTasks();
        return new Response(JSON.stringify({ tasks }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// POST /api/cron - Create new cron task
export async function apiCronCreate(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await request.json() as any;
        let { cronExpr, timezone, prompt, chatId, botToken, botName, chatType, userId, args } = body;

        if (!chatId) {
            return new Response(JSON.stringify({ error: 'Missing chatId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // If args provided, parse it (Dashboard format)
        if (args) {
            // Get user config to retrieve timezone
            const configKey = `user_config:${chatId}`;
            const configStr = await ENV.DATABASE.get(configKey);
            let userTimezone = 'Asia/Shanghai';
            if (configStr) {
                try {
                    const config = JSON.parse(configStr);
                    userTimezone = config.TIMEZONE || 'Asia/Shanghai';
                } catch (e) {
                    // Use default if parse fails
                }
            }
            const parsed = parseAddArgs(args, userTimezone);
            cronExpr = parsed.cronExpr;
            timezone = parsed.timezone;
            prompt = parsed.prompt;
        }

        // Use first available bot token if not provided
        if (!botToken) {
            botToken = ENV.TELEGRAM_AVAILABLE_TOKENS[0];
            if (!botToken) {
                return new Response(JSON.stringify({ error: 'No bot token available' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        if (!cronExpr || !prompt) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!validateCronExpression(cronExpr)) {
            return new Response(JSON.stringify({ error: 'Invalid cron expression' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!validateTimezone(timezone)) {
            return new Response(JSON.stringify({ error: 'Invalid timezone' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const task = {
            id: crypto.randomUUID(),
            chatId,
            botToken,
            botName: botName || '',
            cronExpr,
            timezone,
            prompt,
            enabled: true,
            createdAt: Date.now(),
            chatType: chatType || 'private',
            userId,
        };

        await addTask(task);
        scheduleSingleTask(task);

        return new Response(JSON.stringify({ success: true, task }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// DELETE /api/cron/:id - Delete cron task
export async function apiCronDelete(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { id } = request.params as any;
        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing task ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const task = await getTaskById(id);
        if (!task) {
            return new Response(JSON.stringify({ error: 'Task not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        unscheduleSingleTask(id);
        await removeTask(id);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// PUT /api/cron/:id - Update cron task
export async function apiCronUpdate(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { id } = request.params as any;
        const body = await request.json() as any;

        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing task ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const task = await getTaskById(id);
        if (!task) {
            return new Response(JSON.stringify({ error: 'Task not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const updates: any = {};
        if (body.enabled !== undefined) updates.enabled = body.enabled;
        if (body.cronExpr) {
            if (!validateCronExpression(body.cronExpr)) {
                return new Response(JSON.stringify({ error: 'Invalid cron expression' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            updates.cronExpr = body.cronExpr;
        }
        if (body.timezone) {
            if (!validateTimezone(body.timezone)) {
                return new Response(JSON.stringify({ error: 'Invalid timezone' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            updates.timezone = body.timezone;
        }
        if (body.prompt) updates.prompt = body.prompt;

        await updateTask(id, updates);

        unscheduleSingleTask(id);
        const updatedTask = await getTaskById(id);
        if (updatedTask && updatedTask.enabled) {
            scheduleSingleTask(updatedTask);
        }

        return new Response(JSON.stringify({ success: true, task: updatedTask }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
