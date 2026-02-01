import type { RouterRequest } from '../utils/router';
import { ENV } from '../config/env';
import { getStats } from '../utils/stats';

// Simple token authentication
function checkAuth(request: RouterRequest): boolean {
    const authToken = ENV.ADMIN_TOKEN || process.env.ADMIN_TOKEN;
    if (!authToken) {
        return true; // No token set, allow access
    }

    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        || new URL(request.url).searchParams.get('token');

    return token === authToken;
}

export async function apiStats(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Get botId from query parameter or use first available token
        const botId = new URL(request.url).searchParams.get('botId')
            || ENV.TELEGRAM_AVAILABLE_TOKENS[0]?.split(':')[0]
            || 'default';
        const stats = getStats(botId);

        return new Response(JSON.stringify({
            totalUsers: stats.totalUsers || 0,
            totalGroups: stats.totalGroups || 0,
            totalMessages: stats.totalMessages || 0,
            todayMessages: stats.todayMessages || 0,
            timestamp: Date.now(),
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({
            error: (e as Error).message,
            totalUsers: 0,
            totalGroups: 0,
            totalMessages: 0,
            todayMessages: 0,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
