import type { RouterRequest } from '../utils/router';
import { ENV } from '../config/env';
import { getStats } from '../utils/stats';
import { logManager } from './log-manager';

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
            <button class="tab active" onclick="switchTab('logs', event)">📋 Logs</button>
            <button class="tab" onclick="switchTab('config', event)">⚙️ Config</button>
            <button class="tab" onclick="switchTab('cron', event)">⏰ Cron Tasks</button>
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
                <h4 style="margin-bottom: 10px;">User Settings (per chat)</h4>
                <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Configure settings for specific chats. These override global environment variables.</p>

                <div style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 15px;">
                    <h5 style="margin: 0 0 10px 0;">Add/Update Setting</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <input type="text" id="config-chat-id" placeholder="Chat ID (e.g., 123456789)" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;">
                        <select id="config-key" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">Select setting...</option>
                            <optgroup label="General">
                                <option value="AI_CHAT_PROVIDER">AI_CHAT_PROVIDER</option>
                                <option value="AI_IMAGE_PROVIDER">AI_IMAGE_PROVIDER</option>
                                <option value="AI_ASR_PROVIDER">AI_ASR_PROVIDER</option>
                                <option value="AI_TTS_PROVIDER">AI_TTS_PROVIDER</option>
                                <option value="SYSTEM_INIT_MESSAGE">SYSTEM_INIT_MESSAGE</option>
                                <option value="MAX_HISTORY_LENGTH">MAX_HISTORY_LENGTH</option>
                                <option value="CHAT_MODEL">CHAT_MODEL</option>
                                <option value="VISION_MODEL">VISION_MODEL</option>
                                <option value="IMAGE_MODEL">IMAGE_MODEL</option>
                                <option value="CURRENT_MODE">CURRENT_MODE</option>
                                <option value="TIMEZONE">TIMEZONE</option>
                            </optgroup>
                            <optgroup label="OpenAI">
                                <option value="OPENAI_CHAT_MODEL">OPENAI_CHAT_MODEL</option>
                                <option value="OPENAI_VISION_MODEL">OPENAI_VISION_MODEL</option>
                                <option value="OPENAI_TTS_MODEL">OPENAI_TTS_MODEL</option>
                                <option value="OPENAI_TTS_VOICE">OPENAI_TTS_VOICE</option>
                                <option value="OPENAI_TTS_PROMPT">OPENAI_TTS_PROMPT</option>
                                <option value="OPENAI_TTS_EXTRA_PARAMS">OPENAI_TTS_EXTRA_PARAMS</option>
                                <option value="OPENAI_STT_MODEL">OPENAI_STT_MODEL</option>
                                <option value="OPENAI_API_BASE">OPENAI_API_BASE</option>
                                <option value="OPENAI_API_EXTRA_PARAMS">OPENAI_API_EXTRA_PARAMS</option>
                                <option value="OPENAI_EMBEDDING_MODEL">OPENAI_EMBEDDING_MODEL</option>
                                <option value="OPENAI_REASONING_EFFORT">OPENAI_REASONING_EFFORT</option>
                                <option value="USE_OPENAI_BUILDIN">USE_OPENAI_BUILDIN</option>
                                <option value="OPENAI_IMAGE_MODEL">OPENAI_IMAGE_MODEL</option>
                            </optgroup>
                            <optgroup label="Google/Gemini">
                                <option value="GOOGLE_CHAT_MODEL">GOOGLE_CHAT_MODEL</option>
                                <option value="GOOGLE_VISION_MODEL">GOOGLE_VISION_MODEL</option>
                                <option value="GOOGLE_IMAGE_MODEL">GOOGLE_IMAGE_MODEL</option>
                                <option value="GOOGLE_TTS_MODEL">GOOGLE_TTS_MODEL</option>
                                <option value="GOOGLE_TTS_VOICE">GOOGLE_TTS_VOICE</option>
                                <option value="GOOGLE_TTS_PROMPT">GOOGLE_TTS_PROMPT</option>
                                <option value="GOOGLE_TTS_EXTRA_PARAMS">GOOGLE_TTS_EXTRA_PARAMS</option>
                                <option value="GOOGLE_API_BASE">GOOGLE_API_BASE</option>
                                <option value="GOOGLE_API_EXTRA_PARAMS">GOOGLE_API_EXTRA_PARAMS</option>
                                <option value="GOOGLE_EMBEDDING_MODEL">GOOGLE_EMBEDDING_MODEL</option>
                                <option value="USE_GOOGLE_BUILDIN">USE_GOOGLE_BUILDIN</option>
                                <option value="GOOGLE_MAPS_MODEL">GOOGLE_MAPS_MODEL</option>
                            </optgroup>
                            <optgroup label="Anthropic">
                                <option value="ANTHROPIC_CHAT_MODEL">ANTHROPIC_CHAT_MODEL</option>
                                <option value="ANTHROPIC_VISION_MODEL">ANTHROPIC_VISION_MODEL</option>
                                <option value="ANTHROPIC_API_BASE">ANTHROPIC_API_BASE</option>
                                <option value="ANTHROPIC_API_EXTRA_PARAMS">ANTHROPIC_API_EXTRA_PARAMS</option>
                                <option value="USE_ANTHROPIC_BUILDIN">USE_ANTHROPIC_BUILDIN</option>
                            </optgroup>
                            <optgroup label="XAI (Grok)">
                                <option value="XAI_CHAT_MODEL">XAI_CHAT_MODEL</option>
                                <option value="XAI_VISION_MODEL">XAI_VISION_MODEL</option>
                                <option value="XAI_IMAGE_MODEL">XAI_IMAGE_MODEL</option>
                                <option value="XAI_API_BASE">XAI_API_BASE</option>
                                <option value="XAI_API_EXTRA_PARAMS">XAI_API_EXTRA_PARAMS</option>
                                <option value="USE_XAI_BUILDIN">USE_XAI_BUILDIN</option>
                            </optgroup>
                            <optgroup label="Cohere">
                                <option value="COHERE_CHAT_MODEL">COHERE_CHAT_MODEL</option>
                                <option value="COHERE_API_BASE">COHERE_API_BASE</option>
                            </optgroup>
                            <optgroup label="Mistral">
                                <option value="MISTRAL_CHAT_MODEL">MISTRAL_CHAT_MODEL</option>
                                <option value="MISTRAL_API_BASE">MISTRAL_API_BASE</option>
                            </optgroup>
                            <optgroup label="Azure">
                                <option value="AZURE_CHAT_MODEL">AZURE_CHAT_MODEL</option>
                                <option value="AZURE_IMAGE_MODEL">AZURE_IMAGE_MODEL</option>
                                <option value="AZURE_COMPLETIONS_API">AZURE_COMPLETIONS_API</option>
                                <option value="AZURE_DALLE_API">AZURE_DALLE_API</option>
                            </optgroup>
                            <optgroup label="Fish Audio">
                                <option value="FISH_TTS_VOICE">FISH_TTS_VOICE</option>
                            </optgroup>
                            <optgroup label="OAI-Like / Custom">
                                <option value="OAILIKE_CHAT_MODEL">OAILIKE_CHAT_MODEL</option>
                                <option value="OAILIKE_VISION_MODEL">OAILIKE_VISION_MODEL</option>
                                <option value="OAILIKE_IMAGE_MODEL">OAILIKE_IMAGE_MODEL</option>
                                <option value="OAILIKE_API_BASE">OAILIKE_API_BASE</option>
                                <option value="OAILIKE_API_KEY">OAILIKE_API_KEY</option>
                                <option value="OAILIKE_API_EXTRA_PARAMS">OAILIKE_API_EXTRA_PARAMS</option>
                                <option value="OAILIKE_EMBEDDING_MODEL">OAILIKE_EMBEDDING_MODEL</option>
                                <option value="OAILIKE_RERANK_MODEL">OAILIKE_RERANK_MODEL</option>
                                <option value="OAILIKE_STT_MODEL">OAILIKE_STT_MODEL</option>
                                <option value="OAILIKE_TTS_MODEL">OAILIKE_TTS_MODEL</option>
                                <option value="OAILIKE_TTS_VOICE">OAILIKE_TTS_VOICE</option>
                                <option value="OAILIKE_TTS_EXTRA_PARAMS">OAILIKE_TTS_EXTRA_PARAMS</option>
                                <option value="OAILIKE_IMAGE_SIZE">OAILIKE_IMAGE_SIZE</option>
                                <option value="USE_OAILIKE_RELAY_TOOLS">USE_OAILIKE_RELAY_TOOLS</option>
                            </optgroup>
                            <optgroup label="Vertex AI">
                                <option value="VERTEX_CHAT_MODEL">VERTEX_CHAT_MODEL</option>
                                <option value="VERTEX_VISION_MODEL">VERTEX_VISION_MODEL</option>
                                <option value="VERTEX_IMAGE_MODEL">VERTEX_IMAGE_MODEL</option>
                                <option value="VERTEX_PROJECT_ID">VERTEX_PROJECT_ID</option>
                                <option value="VERTEX_LOCATION">VERTEX_LOCATION</option>
                            </optgroup>
                            <optgroup label="DALL-E">
                                <option value="DALL_E_MODEL">DALL_E_MODEL</option>
                                <option value="DALL_E_IMAGE_SIZE">DALL_E_IMAGE_SIZE</option>
                                <option value="DALL_E_IMAGE_QUALITY">DALL_E_IMAGE_QUALITY</option>
                                <option value="DALL_E_IMAGE_STYLE">DALL_E_IMAGE_STYLE</option>
                            </optgroup>
                            <optgroup label="Workers AI">
                                <option value="WORKERS_CHAT_MODEL">WORKERS_CHAT_MODEL</option>
                                <option value="WORKERS_IMAGE_MODEL">WORKERS_IMAGE_MODEL</option>
                            </optgroup>
                            <optgroup label="Tools & Functions">
                                <option value="USE_TOOLS">USE_TOOLS</option>
                                <option value="USE_MCP">USE_MCP</option>
                                <option value="TOOL_MODEL">TOOL_MODEL</option>
                                <option value="FUNCTION_REPLY_ASAP">FUNCTION_REPLY_ASAP</option>
                            </optgroup>
                            <optgroup label="Model Parameters">
                                <option value="CHAT_TEMPERATURE">CHAT_TEMPERATURE</option>
                                <option value="MAX_TOKENS">MAX_TOKENS</option>
                            </optgroup>
                            <optgroup label="Text & Audio Output">
                                <option value="TEXT_OUTPUT">TEXT_OUTPUT</option>
                                <option value="TEXT_HANDLE_TYPE">TEXT_HANDLE_TYPE</option>
                                <option value="AUDIO_OUTPUT">AUDIO_OUTPUT</option>
                                <option value="AUDIO_HANDLE_TYPE">AUDIO_HANDLE_TYPE</option>
                                <option value="AUDIO_CONTAINS_TEXT">AUDIO_CONTAINS_TEXT</option>
                            </optgroup>
                            <optgroup label="Advanced">
                                <option value="MAPPING_KEY">MAPPING_KEY</option>
                                <option value="MAPPING_VALUE">MAPPING_VALUE</option>
                                <option value="RERANK_AGENT">RERANK_AGENT</option>
                            </optgroup>
                        </select>
                    </div>
                    <input type="text" id="config-value" placeholder="Value" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;">
                    <button onclick="saveUserConfig()" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Setting</button>
                </div>

                <div id="user-config">Loading...</div>
            </div>
            <div>
                <h4 style="margin-bottom: 10px;">Environment Variables (read-only)</h4>
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
        const urlToken = new URLSearchParams(window.location.search).get('token');

        function switchTab(tabName, event) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            if (event && event.target) {
                event.target.classList.add('active');
            }
            const tabElement = document.getElementById(tabName + '-tab');
            if (tabElement) {
                tabElement.classList.add('active');
            }
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
                const url = '/api/stats' + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                const stats = await response.json();
                document.getElementById('total-users').textContent = stats.totalUsers || 0;
                document.getElementById('total-groups').textContent = stats.totalGroups || 0;
                document.getElementById('total-messages').textContent = stats.totalMessages || 0;
                document.getElementById('today-messages').textContent = stats.todayMessages || 0;
                document.getElementById('today-date').textContent = new Date().toLocaleDateString();
            } catch (e) {
                console.error('Failed to load stats:', e);
                document.getElementById('total-users').textContent = 'Error';
                document.getElementById('total-groups').textContent = 'Error';
                document.getElementById('total-messages').textContent = 'Error';
                document.getElementById('today-messages').textContent = 'Error';
            }
        }
        setInterval(updateUptime, 1000);
        updateUptime();
        loadStats();
        setInterval(loadStats, 5000);

        // Initialize logs
        setTimeout(() => {
            const now = new Date().toLocaleTimeString();
            document.getElementById('log-output').innerHTML =
                '<div class="log-line"><span class="log-time">[' + now + ']</span> <span class="log-level info">INFO</span> Dashboard initialized</div>' +
                '<div class="log-line"><span class="log-time">[' + now + ']</span> <span class="log-level info">INFO</span> Monitoring active</div>';
        }, 500);

        // Load cron tasks
        async function loadCronTasks() {
            try {
                const url = '/api/cron' + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                const data = await response.json();
                const tasks = data.tasks || [];

                const container = document.getElementById('cron-list');
                if (tasks.length === 0) {
                    container.innerHTML = '<p style="color: #999;">No cron tasks yet</p>';
                    return;
                }

                const table = document.createElement('table');
                table.style.cssText = 'width: 100%; border-collapse: collapse;';

                const headerRow = document.createElement('tr');
                headerRow.style.borderBottom = '2px solid #e5e5e5';
                ['Status', 'Chat/User', 'Schedule', 'Prompt', 'Actions'].forEach(text => {
                    const th = document.createElement('th');
                    th.textContent = text;
                    th.style.cssText = 'text-align: left; padding: 10px;';
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);

                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.style.borderBottom = '1px solid #f0f0f0';

                    const statusCell = document.createElement('td');
                    statusCell.textContent = task.enabled ? '✅' : '⏸️';
                    statusCell.style.padding = '10px';
                    row.appendChild(statusCell);

                    const chatInfoCell = document.createElement('td');
                    const chatTypeIcon = task.chatType === 'private' ? '👤' : '👥';
                    const chatInfo = chatTypeIcon + ' ' + task.chatId + (task.userId ? ' (User: ' + task.userId + ')' : '');
                    chatInfoCell.textContent = chatInfo;
                    chatInfoCell.style.cssText = 'padding: 10px; font-family: monospace; font-size: 12px;';
                    row.appendChild(chatInfoCell);

                    const scheduleCell = document.createElement('td');
                    scheduleCell.textContent = task.cronExpr + ' (' + task.timezone + ')';
                    scheduleCell.style.cssText = 'padding: 10px; font-family: monospace; font-size: 12px;';
                    row.appendChild(scheduleCell);

                    const promptCell = document.createElement('td');
                    promptCell.textContent = task.prompt.length > 50 ? task.prompt.substring(0, 50) + '...' : task.prompt;
                    promptCell.style.padding = '10px';
                    row.appendChild(promptCell);

                    const actionsCell = document.createElement('td');
                    actionsCell.style.padding = '10px';

                    const toggleBtn = document.createElement('button');
                    toggleBtn.textContent = task.enabled ? 'Disable' : 'Enable';
                    toggleBtn.style.cssText = 'margin-right: 5px; padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;';
                    toggleBtn.onclick = () => toggleCronTask(task.id, !task.enabled);
                    actionsCell.appendChild(toggleBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.style.cssText = 'padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;';
                    deleteBtn.onclick = () => deleteCronTask(task.id);
                    actionsCell.appendChild(deleteBtn);

                    row.appendChild(actionsCell);
                    table.appendChild(row);
                });

                container.innerHTML = '';
                container.appendChild(table);
            } catch (e) {
                console.error('Failed to load cron tasks:', e);
                document.getElementById('cron-list').innerHTML = '<p style="color: #ef4444;">Failed to load tasks: ' + e.message + '</p>';
            }
        }

        async function toggleCronTask(id, enabled) {
            try {
                const url = '/api/cron/' + id + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ enabled })
                });
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                loadCronTasks();
            } catch (e) {
                alert('Failed to update task: ' + e.message);
            }
        }

        async function deleteCronTask(id) {
            if (!confirm('Are you sure you want to delete this task?')) return;
            try {
                const url = '/api/cron/' + id + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
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

        // Load environment variables
        async function loadEnvVars() {
            try {
                const url = '/api/env' + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                const data = await response.json();
                const envVars = data.envVars || {};

                const container = document.getElementById('env-vars');
                if (Object.keys(envVars).length === 0) {
                    container.innerHTML = '<p style="color: #999;">No environment variables found</p>';
                    return;
                }

                let html = '<table style="width: 100%; border-collapse: collapse;">';
                html += '<tr style="border-bottom: 2px solid #e5e5e5;"><th style="text-align: left; padding: 10px; width: 30%;">Variable</th><th style="text-align: left; padding: 10px;">Value</th></tr>';

                Object.keys(envVars).sort().forEach(key => {
                    html += '<tr style="border-bottom: 1px solid #f0f0f0;">';
                    html += '<td style="padding: 10px; font-family: monospace; font-weight: bold; vertical-align: top;">' + key + '</td>';

                    // Format value for display
                    let displayValue = envVars[key];
                    try {
                        // Try to parse as JSON for pretty printing
                        const parsed = JSON.parse(displayValue);
                        displayValue = '<pre style="margin: 0; white-space: pre-wrap; word-break: break-word;">' + JSON.stringify(parsed, null, 2) + '</pre>';
                    } catch (e) {
                        // Not JSON, display as-is
                        displayValue = '<span style="word-break: break-all;">' + String(displayValue) + '</span>';
                    }

                    html += '<td style="padding: 10px; font-family: monospace;">' + displayValue + '</td>';
                    html += '</tr>';
                });

                html += '</table>';
                container.innerHTML = html;
            } catch (e) {
                console.error('Failed to load env vars:', e);
                document.getElementById('env-vars').innerHTML = '<p style="color: #ef4444;">Failed to load environment variables: ' + e.message + '</p>';
            }
        }

        loadEnvVars();

        // Load user configs
        async function loadUserConfigs() {
            try {
                const url = '/api/user-configs' + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                const data = await response.json();
                const configs = data.configs || {};

                const container = document.getElementById('user-config');

                if (Object.keys(configs).length === 0) {
                    container.innerHTML = '<div style="background: #f0f7ff; border: 1px solid #b3d9ff; border-radius: 4px; padding: 15px;">' +
                        '<p style="margin: 0 0 10px 0;"><strong>ℹ️ No User Settings Yet</strong></p>' +
                        '<p style="margin: 0; font-size: 14px;">Use <code>/set</code> command in Telegram to configure settings.</p>' +
                        '<p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Example: <code>/set -AI_CHAT_PROVIDER openai</code></p>' +
                        '</div>';
                    return;
                }

                let html = '<div style="max-height: 400px; overflow-y: auto;">';
                Object.keys(configs).sort().forEach(key => {
                    const chatId = key.replace('user_config:', '');
                    const config = configs[key];
                    html += '<details style="margin-bottom: 10px; border: 1px solid #e5e5e5; border-radius: 4px; padding: 10px;">';
                    html += '<summary style="cursor: pointer; font-weight: bold; font-family: monospace;">Chat ID: ' + chatId + '</summary>';
                    html += '<pre style="margin-top: 10px; background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">' + JSON.stringify(config, null, 2) + '</pre>';
                    html += '</details>';
                });
                html += '</div>';
                container.innerHTML = html;
            } catch (e) {
                console.error('Failed to load user configs:', e);
                document.getElementById('user-config').innerHTML = '<p style="color: #ef4444;">Failed to load: ' + e.message + '</p>';
            }
        }

        loadUserConfigs();

        // Save user config
        async function saveUserConfig() {
            try {
                const chatId = document.getElementById('config-chat-id').value.trim();
                const key = document.getElementById('config-key').value;
                const value = document.getElementById('config-value').value.trim();

                if (!chatId || !key || !value) {
                    alert('Please fill in all fields');
                    return;
                }

                const url = '/api/user-config' + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chatId: chatId,
                        config: { [key]: value }
                    })
                });

                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }

                const data = await response.json();
                alert('Setting saved successfully!');

                // Clear form
                document.getElementById('config-chat-id').value = '';
                document.getElementById('config-key').value = '';
                document.getElementById('config-value').value = '';

                // Reload configs
                loadUserConfigs();
            } catch (e) {
                alert('Failed to save setting: ' + e.message);
            }
        }

        // Load logs
        async function loadLogs() {
            try {
                const url = '/api/logs' + (urlToken ? '?token=' + urlToken : '');
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                const data = await response.json();
                const logs = data.logs || [];

                const container = document.getElementById('log-output');
                if (logs.length === 0) {
                    container.innerHTML = '<div class="log-line">No logs yet</div>';
                    return;
                }

                let html = '';
                logs.slice(-50).forEach(log => {
                    const time = new Date(log.timestamp).toLocaleTimeString();
                    const levelClass = log.level;
                    html += '<div class="log-line">';
                    html += '<span class="log-time">[' + time + ']</span> ';
                    html += '<span class="log-level ' + levelClass + '">' + log.level.toUpperCase() + '</span> ';
                    html += log.message;
                    html += '</div>';
                });
                container.innerHTML = html;
                container.scrollTop = container.scrollHeight;
            } catch (e) {
                console.error('Failed to load logs:', e);
            }
        }

        loadLogs();
        setInterval(loadLogs, 3000);
    </script>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

export async function apiEnvVars(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Get all environment variables from ENV
        const envVars: Record<string, any> = {};
        const sensitiveKeys = ['API_KEY', 'TOKEN', 'SECRET', 'PASSWORD', 'PRIVATE'];

        for (const key in ENV) {
            if (Object.prototype.hasOwnProperty.call(ENV, key)) {
                const value = (ENV as any)[key];
                // Mask sensitive values
                const isSensitive = sensitiveKeys.some(sk => key.includes(sk));
                if (isSensitive && typeof value === 'string' && value.length > 0) {
                    envVars[key] = value.substring(0, 4) + '***' + value.substring(value.length - 4);
                } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    envVars[key] = value;
                } else if (Array.isArray(value)) {
                    envVars[key] = JSON.stringify(value);
                } else if (typeof value === 'object' && value !== null) {
                    envVars[key] = JSON.stringify(value);
                } else {
                    envVars[key] = String(value);
                }
            }
        }

        return new Response(JSON.stringify({ envVars }), {
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

export async function apiUserConfigs(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const configs: Record<string, any> = {};

        // Try to list all user_config keys
        if (ENV.DATABASE.list) {
            const keys = await ENV.DATABASE.list('user_config:');

            // Fetch each config
            for (const key of keys) {
                try {
                    const configStr = await ENV.DATABASE.get(key);
                    if (configStr && typeof configStr === 'string') {
                        configs[key] = JSON.parse(configStr);
                    }
                } catch (e) {
                    console.error(`Failed to parse config for key ${key}:`, e);
                }
            }
        }

        return new Response(JSON.stringify({ configs }), {
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

export async function apiUpdateUserConfig(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await request.json() as any;
        const { chatId, config } = body;

        if (!chatId) {
            return new Response(JSON.stringify({ error: 'Missing chatId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const configKey = `user_config:${chatId}`;

        // Get existing config
        const existingConfigStr = await ENV.DATABASE.get(configKey);
        const existingConfig = existingConfigStr ? JSON.parse(existingConfigStr) : {};

        // Merge with new config
        const updatedConfig = { ...existingConfig, ...config };

        // Save to database
        await ENV.DATABASE.put(configKey, JSON.stringify(updatedConfig));

        return new Response(JSON.stringify({ success: true, config: updatedConfig }), {
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

export async function apiLogs(request: RouterRequest): Promise<Response> {
    if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const url = new URL(request.url);
        const count = parseInt(url.searchParams.get('count') || '100');
        const logs = logManager.getRecentLogs(count);
        return new Response(JSON.stringify({ logs }), {
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
