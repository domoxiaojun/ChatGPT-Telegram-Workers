# Local & Docker Deployment

This guide covers local development and Docker deployment options for the ChatGPT Telegram Workers bot.

## 📋 Table of Contents

- [Quick Start with Docker](#quick-start-with-docker)
- [Configuration](#configuration)
- [Docker Deployment](#docker-deployment)
- [Local Development](#local-development)
- [Docker Compose](#docker-compose)
- [Production Setup](#production-setup)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Telegram bot token from [@BotFather](https://t.me/BotFather)
- OpenAI API key (or other AI provider keys)

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/SzeMeng76/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers

# Copy example configs
cp docker-compose.yaml.example docker-compose.yaml
cp config.json.example config.json
cp wrangler.toml.example wrangler.toml

# Edit your configuration
nano config.json  # Add your bot token and API keys
nano wrangler.toml # Add environment variables

# Start the bot
docker-compose up -d
```

## ⚙️ Configuration

### 1. Server Configuration (`config.json`)

Create a `config.json` file in the project root:

```json
{
  "database": {
    "type": "local",
    "path": "/app/data.json"
  },
  "server": {
    "hostname": "0.0.0.0",
    "port": 8787,
    "baseURL": "https://your-domain.com"
  },
  "proxy": "http://127.0.0.1:7890",
  "mode": "polling"
}
```

**Configuration Options:**

| Field | Description | Options |
|-------|-------------|---------|
| `database.type` | Database type | `memory`, `local`, `sqlite`, `redis` |
| `database.path` | Database file path | Path for local/sqlite |
| `server.hostname` | Server bind address | `0.0.0.0` for Docker |
| `server.port` | Server port | `8787` (required for Docker) |
| `server.baseURL` | Public URL | Required for webhook mode |
| `proxy` | HTTP proxy | Optional proxy server |
| `mode` | Operation mode | `webhook`, `polling` |

### 2. Environment Variables (`wrangler.toml`)

The `wrangler.toml` file contains all environment variables:

```toml
name = "chatgpt-telegram-workers"
compatibility_date = "2024-01-01"

[vars]
# Required
TELEGRAM_AVAILABLE_TOKENS = "your_bot_token_here"
OPENAI_API_KEY = "your_openai_key_here"

# Basic Configuration
LANGUAGE = "en"
AI_CHAT_PROVIDER = "openai"
CHAT_WHITE_LIST = "user_id1,user_id2"

# Group Settings
GROUP_CHAT_BOT_ENABLE = "true"
CHAT_GROUP_WHITE_LIST = "group_id1,group_id2"

# Advanced Features
USE_TOOLS = '["duckduckgo", "image_gen"]'
ENABLE_INTELLIGENT_MODEL = "false"
MAX_HISTORY_LENGTH = "10"

# Optional: Multiple AI Providers
ANTHROPIC_API_KEY = "your_anthropic_key"
GOOGLE_API_KEY = "your_google_key"
```

## 🐳 Docker Deployment

### Method 1: Using Pre-built Image

```bash
# Pull the latest image
docker pull szemeng76/chatgpt-telegram-workers:latest

# Run with volume mounts
docker run -d \
  --name chatgpt-telegram-bot \
  -p 8787:8787 \
  -v $(pwd)/config.json:/app/config.json:ro \
  -v $(pwd)/wrangler.toml:/app/config.toml:ro \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  szemeng76/chatgpt-telegram-workers:latest
```

### Method 2: Build from Source

```bash
# Build the image
docker build -t chatgpt-telegram-workers:latest .

# Or use npm script for faster build
npm run build:docker

# Run the container
docker run -d \
  --name chatgpt-telegram-bot \
  -p 8787:8787 \
  -v $(pwd)/config.json:/app/config.json:ro \
  -v $(pwd)/wrangler.toml:/app/config.toml:ro \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  chatgpt-telegram-workers:latest
```

### Docker Run Options Explained

| Option | Description |
|--------|-------------|
| `-d` | Run in detached mode (background) |
| `--name` | Container name for easy management |
| `-p 8787:8787` | Port mapping (host:container) |
| `-v $(pwd)/config.json:/app/config.json:ro` | Mount config file (read-only) |
| `-v $(pwd)/wrangler.toml:/app/config.toml:ro` | Mount environment variables (read-only) |
| `-v $(pwd)/data:/app/data` | Mount data directory for persistence |
| `--restart unless-stopped` | Auto-restart policy |

## 🔧 Local Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

```bash
# Clone and install
git clone https://github.com/SzeMeng76/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers
npm install

# Configure
cp config.json.example config.json
cp wrangler.toml.example wrangler.toml
# Edit configuration files with your settings

# Run in development mode
npm run start:local
```

### Development Scripts

```bash
# Start development server
npm run start:local

# Build for local deployment
npm run build:local

# Start built version
CONFIG_PATH=./config.json TOML_PATH=./wrangler.toml npm run start:dist

# Run tests
npm test

# Lint code
npm run lint
```

### Environment Variables for Local Development

```bash
export CONFIG_PATH=./config.json
export TOML_PATH=./wrangler.toml
npm run start:local
```

## 📦 Docker Compose

### Basic Setup

Create `docker-compose.yaml`:

```yaml
version: '3.8'

services:
  chatgpt-telegram-bot:
    image: szemeng76/chatgpt-telegram-workers:latest
    # Or build from source:
    # build: .
    container_name: chatgpt-telegram-workers
    ports:
      - "8787:8787"
    volumes:
      - ./config.json:/app/config.json:ro
      - ./wrangler.toml:/app/config.toml:ro
      - ./data:/app/data
      - ./tool:/app/tool:ro  # Optional: custom tools
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    # Optional: resource limits
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Advanced Setup with Redis

```yaml
version: '3.8'

services:
  chatgpt-telegram-bot:
    image: szemeng76/chatgpt-telegram-workers:latest
    container_name: chatgpt-telegram-workers
    ports:
      - "8787:8787"
    volumes:
      - ./config.json:/app/config.json:ro
      - ./wrangler.toml:/app/config.toml:ro
      - ./tool:/app/tool:ro
    restart: unless-stopped
    depends_on:
      - redis
    environment:
      - NODE_ENV=production

  redis:
    image: redis:7-alpine
    container_name: chatgpt-redis
    volumes:
      - redis_data:/data
    restart: unless-stopped
    command: redis-server --appendonly yes

volumes:
  redis_data:
```

For Redis, update your `config.json`:

```json
{
  "database": {
    "type": "redis",
    "url": "redis://redis:6379"
  },
  "server": {
    "hostname": "0.0.0.0",
    "port": 8787
  },
  "mode": "polling"
}
```

### Running Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update and restart
docker-compose pull
docker-compose up -d
```

## 🏭 Production Setup

### Recommended Production Configuration

**config.json:**
```json
{
  "database": {
    "type": "redis",
    "url": "redis://localhost:6379"
  },
  "server": {
    "hostname": "0.0.0.0",
    "port": 8787,
    "baseURL": "https://your-bot-domain.com"
  },
  "mode": "webhook"
}
```

**wrangler.toml:**
```toml
[vars]
# Production settings
TELEGRAM_AVAILABLE_TOKENS = "your_production_bot_tokens"
OPENAI_API_KEY = "your_openai_keys"
LANGUAGE = "en"

# Security
CHAT_WHITE_LIST = "authorized_user_ids"
CHAT_GROUP_WHITE_LIST = "authorized_group_ids"
LOCK_USER_CONFIG_KEYS = "OPENAI_API_BASE,ANTHROPIC_API_BASE"

# Performance
MAX_HISTORY_LENGTH = "5"
STREAM_MODE = "true"
AUTO_TRIM_HISTORY = "true"

# Logging
LOG_LEVEL = "info"
DEBUG_MODE = "false"
```

### Production Deployment Checklist

- [ ] Use webhook mode for better performance
- [ ] Set up Redis for persistent storage
- [ ] Configure proper logging
- [ ] Set up monitoring and health checks
- [ ] Use environment secrets for API keys
- [ ] Configure reverse proxy (nginx/caddy)
- [ ] Set up SSL/TLS certificates
- [ ] Configure backup strategy
- [ ] Set resource limits
- [ ] Configure log rotation

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name your-bot-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-bot-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8787;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🛠️ Custom Tools

### Local Tool Files

Mount custom tools under `/app/tool` directory:

```bash
# Directory structure
./tool/
├── weather.json      # JSON tool definition
├── calculator.ts     # TypeScript tool
└── translator.js     # JavaScript tool
```

**Example TypeScript tool (`tool/echo.ts`):**

```typescript
export default {
  schema: {
    name: 'echo',
    description: 'Echo back the input text',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text to echo back',
        },
      },
      required: ['text'],
    },
  },
  func: async (args: { text: string }) => {
    return `Echo: ${args.text}`;
  },
  prompt: 'echo something',
  extra_params: { temperature: 0.7 },
  not_send_to_ai: false,
};
```

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>Container won't start</strong></summary>

**Check logs:**
```bash
docker logs chatgpt-telegram-workers
```

**Common causes:**
- Invalid JSON in config files
- Missing required environment variables
- Port conflicts
- Permission issues with mounted volumes

</details>

<details>
<summary><strong>Bot not receiving messages</strong></summary>

**For webhook mode:**
1. Ensure `baseURL` is accessible from internet
2. Check if webhook is set: visit `https://your-domain.com/init`
3. Verify SSL certificate is valid

**For polling mode:**
1. Check internet connectivity
2. Verify bot token is correct
3. Check for rate limiting

</details>

<details>
<summary><strong>Database/storage issues</strong></summary>

**Local database:**
- Check file permissions
- Ensure volume mount is correct
- Check disk space

**Redis:**
- Verify Redis connection
- Check Redis logs: `docker logs chatgpt-redis`
- Ensure Redis is accessible from bot container

</details>

<details>
<summary><strong>Performance issues</strong></summary>

**Solutions:**
1. Use Redis instead of local file storage
2. Reduce `MAX_HISTORY_LENGTH`
3. Disable unnecessary tools
4. Use polling mode for multiple bots
5. Increase container memory limits

</details>

### Debug Mode

Enable debugging in `wrangler.toml`:

```toml
[vars]
DEBUG_MODE = "true"
DEV_MODE = "true"
LOG_LEVEL = "debug"
```

### Health Checks

Add health check to docker-compose:

```yaml
services:
  chatgpt-telegram-bot:
    # ... other config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8787/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Monitoring

**Basic monitoring with logs:**
```bash
# Follow logs
docker-compose logs -f

# Check container stats
docker stats chatgpt-telegram-workers
```

**Advanced monitoring:**
- Set up Prometheus + Grafana
- Use container monitoring tools
- Monitor API usage and costs
- Set up alerting for errors

---

## 📚 Next Steps

1. **Scale up**: Use load balancer for multiple instances
2. **Monitor**: Set up proper logging and monitoring
3. **Secure**: Implement proper security measures
4. **Backup**: Set up automated backups
5. **Update**: Create update automation workflow

For more advanced configurations, see the [Configuration Guide](CONFIG.md).
