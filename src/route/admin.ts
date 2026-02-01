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

export async function adminDashboard(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response('Unauthorized', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Bearer' },
        });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gateway Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header h1 { font-size: 24px; margin-bottom: 5px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card h3 { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
        .card .value { font-size: 32px; font-weight: bold; color: #667eea; }
        .card .label { font-size: 12px; color: #999; margin-top: 5px; }
        .status { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
        .status.online { background: #10b981; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e5e5e5; }
        .tab { padding: 10px 20px; cursor: pointer; border: none; background: none; font-size: 14px; color: #666; border-bottom: 2px solid transparent; margin-bottom: -2px; }
        .tab.active { color: #667eea; border-bottom-color: #667eea; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .log-container { background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 12px; max-height: 500px; overflow-y: auto; }
        .log-line { margin-bottom: 5px; }
        .log-time { color: #858585; }
        .log-level { font-weight: bold; }
        .log-level.info { color: #4fc3f7; }
        .log-level.error { color: #ef5350; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Gateway Dashboard</h1>
        <p>ChatGPT-Telegram-Worker Control Panel</p>
    </div>
    <div class="container">
        <div class="grid">
            <div class="card">
                <h3>Status</h3>
                <div class="value"><span class="status online"></span>Online</div>
                <div class="label" id="uptime">Loading...</div>
            </div>
            <div class="card">
                <h3>Total Users</h3>
                <div class="value" id="total-users">-</div>
                <div class="label">All time</div>
            </div>
            <div class="card">
                <h3>Total Groups</h3>
                <div class="value" id="total-groups">-</div>
                <div class="label">All time</div>
            </div>
            <div class="card">
                <h3>Total Messages</h3>
                <div class="value" id="total-messages">-</div>
                <div class="label">All time</div>
            </div>
            <div class="card">
                <h3>Today's Messages</h3>
                <div class="value" id="today-messages">-</div>
                <div class="label" id="today-date">-</div>
            </div>
        </div>
        <div class="tabs">
            <button class="tab active" onclick="switchTab('logs')">📋 Logs</button>
            <button class="tab" onclick="switchTab('config')">⚙️ Config</button>
            <button class="tab" onclick="switchTab('cron')">⏰ Cron Tasks</button>
        </div>
        <div id="logs-tab" class="tab-content active card">
            <h3>Real-time Logs</h3>
            <div class="log-container" id="log-output">
                <div class="log-line">Connecting to log stream...</div>
            </div>
        </div>
        <div id="config-tab" class="tab-content card">
            <h3>Configuration</h3>
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">Whitelist</h4>
                <textarea id="whitelist" rows="5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;"></textarea>
                <button onclick="saveWhitelist()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Whitelist</button>
            </div>
            <div>
                <h4 style="margin-bottom: 10px;">Environment Variables</h4>
                <div id="env-vars">Loading...</div>
            </div>
        </div>
        <div id="cron-tab" class="tab-content card">
            <h3>Cron Tasks</h3>
            <button onclick="showAddCronModal()" style="margin-bottom: 15px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">➕ Add Task</button>
            <div id="cron-list">Loading...</div>
        </div>
    </div>
    <script>
        const startTime = Date.now();
        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById(tab + '-tab').classList.add('active');
        }
        function updateUptime() {
            const elapsed = Date.now() - startTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            let uptime = '';
            if (days > 0) uptime += days + 'd ';
            if (hours % 24 > 0) uptime += (hours % 24) + 'h ';
            if (minutes % 60 > 0) uptime += (minutes % 60) + 'm ';
            uptime += (seconds % 60) + 's';
            document.getElementById('uptime').textContent = 'Uptime: ' + uptime;
        }
        async function loadStats() {
            try {
                const token = new URLSearchParams(window.location.search).get('token');
                const url = '/api/stats' + (token ? '?token=' + token : '');
                const response = await fetch(url);
                const stats = await response.json();
                document.getElementById('total-users').textContent = stats.totalUsers || 0;
                document.getElementById('total-groups').textContent = stats.totalGroups || 0;
                document.getElementById('total-messages').textContent = stats.totalMessages || 0;
                document.getElementById('today-messages').textContent = stats.todayMessages || 0;
                document.getElementById('today-date').textContent = new Date().toLocaleDateString();
            } catch (e) {
                console.error('Failed to load stats:', e);
            }
        }
        setInterval(updateUptime, 1000);
        updateUptime();
        loadStats();
        setInterval(loadStats, 5000);
        setTimeout(() => {
            document.getElementById('log-output').innerHTML =
                '<div class="log-line"><span class="log-time">[' + new Date().toLocaleTimeString() + ']</span> <span class="log-level info">INFO</span> Dashboard loaded</div>' +
                '<div class="log-line"><span class="log-time">[' + new Date().toLocaleTimeString() + ']</span> <span class="log-level info">INFO</span> WebSocket log streaming coming soon...</div>';
        }, 500);

        // Load cron tasks
        async function loadCronTasks() {
            try {
                const token = new URLSearchParams(window.location.search).get('token');
                const url = '/api/cron' + (token ? '?token=' + token : '');
                const response = await fetch(url);
                const data = await response.json();
                const tasks = data.tasks || [];

                if (tasks.length === 0) {
                    document.getElementById('cron-list').innerHTML = '<p style="color: #999;">No cron tasks yet</p>';
                    return;
                }

                let html = '<table style="width: 100%; border-collapse: collapse;">';
                html += '<tr style="border-bottom: 2px solid #e5e5e5;"><th style="text-align: left; padding: 10px;">Status</th><th style="text-align: left; padding: 10px;">Schedule</th><th style="text-align: left; padding: 10px;">Prompt</th><th style="text-align: left; padding: 10px;">Actions</th></tr>';

                tasks.forEach(task => {
                    const status = task.enabled ? '✅' : '⏸️';
                    const promptPreview = task.prompt.length > 50 ? task.prompt.substring(0, 50) + '...' : task.prompt;
                    html += '<tr style="border-bottom: 1px solid #f0f0f0;">';
                    html += '<td style="padding: 10px;">' + status + '</td>';
                    html += '<td style="padding: 10px; font-family: monospace; font-size: 12px;">' + task.cronExpr + ' (' + task.timezone + ')</td>';
                    html += '<td style="padding: 10px;">' + promptPreview + '</td>';
                    html += '<td style="padding: 10px;"><button onclick="toggleCronTask(\'' + task.id + '\', ' + !task.enabled + ')" style="margin-right: 5px; padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">' + (task.enabled ? 'Disable' : 'Enable') + '</button><button onclick="deleteCronTask(\'' + task.id + '\')" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button></td>';
                    html += '</tr>';
                });

                html += '</table>';
                document.getElementById('cron-list').innerHTML = html;
            } catch (e) {
                console.error('Failed to load cron tasks:', e);
                document.getElementById('cron-list').innerHTML = '<p style="color: #ef4444;">Failed to load tasks</p>';
            }
        }

        async function toggleCronTask(id, enabled) {
            try {
                const token = new URLSearchParams(window.location.search).get('token');
                const url = '/api/cron/' + id + (token ? '?token=' + token : '');
                await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ enabled })
                });
                loadCronTasks();
            } catch (e) {
                alert('Failed to update task: ' + e.message);
            }
        }

        async function deleteCronTask(id) {
            if (!confirm('Are you sure you want to delete this task?')) return;
            try {
                const token = new URLSearchParams(window.location.search).get('token');
                const url = '/api/cron/' + id + (token ? '?token=' + token : '');
                await fetch(url, { method: 'DELETE' });
                loadCronTasks();
            } catch (e) {
                alert('Failed to delete task: ' + e.message);
            }
        }

        function showAddCronModal() {
            const cronExpr = prompt('Cron expression (e.g., 0 9 * * * for daily at 9:00):');
            if (!cronExpr) return;
            const timezone = prompt('Timezone (e.g., Asia/Singapore):', 'Asia/Shanghai');
            if (!timezone) return;
            const prompt = prompt('Prompt for AI:');
            if (!prompt) return;
            alert('Note: This is a simplified UI. Use /cron command in Telegram for full functionality.');
        }

        loadCronTasks();
    </script>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
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
