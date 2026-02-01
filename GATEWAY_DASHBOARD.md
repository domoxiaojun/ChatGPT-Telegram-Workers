# Gateway Dashboard

## Overview

The Gateway Dashboard provides a web-based control panel for monitoring and managing your ChatGPT-Telegram-Worker bot.

## Features

- **Real-time Monitoring**
  - Bot status and uptime
  - Request statistics (total and daily)
  - Active chat count

- **Live Logs** (Coming soon)
  - Real-time log streaming via WebSocket
  - Filter by log level

- **Configuration Management** (Coming soon)
  - Manage whitelist/blacklist
  - Update environment variables

- **Cron Task Management** (Coming soon)
  - View all scheduled tasks
  - Add/edit/delete tasks
  - Enable/disable tasks

## Access

### URL

Access the dashboard at: `http://your-server:8787/admin`

### Authentication

Set the `ADMIN_TOKEN` environment variable to enable authentication:

```bash
# In docker-compose.yml or .env
ADMIN_TOKEN=your-secret-token-here
```

Then access with token:
- URL parameter: `http://your-server:8787/admin?token=your-secret-token-here`
- Authorization header: `Authorization: Bearer your-secret-token-here`

If `ADMIN_TOKEN` is not set, the dashboard is accessible without authentication (not recommended for production).

## API Endpoints

### GET /admin
Returns the dashboard HTML page.

### GET /api/stats
Returns JSON statistics:
```json
{
  "totalRequests": 1234,
  "todayRequests": 56,
  "activeChats": 12,
  "timestamp": 1234567890
}
```

## Security

- Always set `ADMIN_TOKEN` in production
- Use HTTPS in production
- Consider IP whitelisting at firewall level
- Rotate tokens regularly
