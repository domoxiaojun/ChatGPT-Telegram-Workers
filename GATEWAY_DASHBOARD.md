# Gateway Dashboard

## Overview

The Gateway Dashboard provides a web-based control panel for monitoring and managing your ChatGPT-Telegram-Worker bot. It features a responsive design that works on both desktop and mobile devices.

## Features

### Real-time Monitoring
- Bot status and uptime tracking
- Usage statistics (total users, groups, messages)
- Today's message count with date display

### Live Logs
- Real-time log streaming
- Color-coded log levels (info, error)
- Auto-scroll with timestamp display
- Maximum 500 log lines retained

### User Configuration Management
- View all user configurations by Chat ID
- Display configuration keys and values
- Delete individual configuration items
- Internal fields (like DEFINE_KEYS) are hidden automatically
- Empty configurations are not displayed

### Cron Task Management
- View all scheduled tasks with details
- Add new tasks with simplified format: `ChatID | Time/Cron [Timezone] Prompt`
- Examples:
  - `123456 | 09:00 Daily report` (uses default timezone)
  - `123456 | 09:00 Asia/Tokyo Morning news` (custom timezone)
  - `123456 | 0 9 * * * Asia/Shanghai Daily report` (full cron expression)
- Enable/disable tasks with toggle button
- Delete tasks
- Display task status (enabled/disabled), cron expression, timezone, and prompt

### Environment Variables Display
- View all environment variable keys
- Organized display with system information

## Access

### URL

Access the dashboard at: `http://your-ip:8787/admin`

For custom domain access, configure a reverse proxy (e.g., Nginx, Caddy) to forward requests to port 8787.

### Authentication

Set the `ADMIN_TOKEN` environment variable to enable authentication:

```bash
# In docker-compose.yml or .env
ADMIN_TOKEN=your-secret-token-here
```

Then access with token:
- URL parameter: `http://your-ip:8787/admin?token=your-secret-token-here`
- Authorization header: `Authorization: Bearer your-secret-token-here`

If `ADMIN_TOKEN` is not set, the dashboard is accessible without authentication (not recommended for production).

## API Endpoints

### Dashboard

#### GET /admin
Returns the dashboard HTML page.

### Statistics

#### GET /api/stats
Returns JSON statistics:
```json
{
  "totalUsers": 100,
  "totalGroups": 20,
  "totalMessages": 5000,
  "todayMessages": 150,
  "todayDate": "2026-02-02"
}
```

### User Configuration

#### GET /api/user-configs
Returns all user configurations:
```json
{
  "user_config:123456": {
    "AI_CHAT_PROVIDER": "openai",
    "CHAT_MODEL": "gpt-4"
  }
}
```

#### DELETE /api/user-config/:chatId/:key
Delete a specific configuration key for a user.

### Cron Tasks

#### GET /api/cron
Returns all cron tasks:
```json
[
  {
    "id": "uuid",
    "chatId": "123456",
    "cronExpr": "0 9 * * *",
    "timezone": "Asia/Shanghai",
    "prompt": "Daily report",
    "enabled": true,
    "createdAt": 1234567890
  }
]
```

#### POST /api/cron
Create a new cron task:
```json
{
  "chatId": "123456",
  "args": "09:00 Daily report"
}
```

Or with full parameters:
```json
{
  "chatId": "123456",
  "cronExpr": "0 9 * * *",
  "timezone": "Asia/Shanghai",
  "prompt": "Daily report",
  "botToken": "optional"
}
```

#### PATCH /api/cron/:id
Update a cron task (enable/disable):
```json
{
  "enabled": false
}
```

#### DELETE /api/cron/:id
Delete a cron task.

## Mobile Support

The dashboard is fully responsive and optimized for mobile devices:
- Adaptive grid layout (2 columns on tablet, 1 column on phone)
- Touch-friendly buttons and controls
- Readable font sizes on small screens
- Scrollable log container with reduced height

## Security

- Always set `ADMIN_TOKEN` in production
- Use HTTPS in production
- Consider IP whitelisting at firewall level
- Rotate tokens regularly
- User configurations containing sensitive data are HTML-escaped to prevent XSS
