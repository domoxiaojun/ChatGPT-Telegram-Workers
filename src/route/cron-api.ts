import type { RouterRequest } from '../utils/router';
import { ENV } from '../config/env';
import { addTask, getTaskById, loadAllTasks, removeTask, scheduleSingleTask, unscheduleSingleTask, updateTask, validateCronExpression, validateTimezone } from '../cron';

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
        const { cronExpr, timezone, prompt, chatId, botToken, botName, chatType, userId } = body;

        if (!cronExpr || !prompt || !chatId || !botToken) {
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
