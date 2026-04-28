# Migration Guide

This guide helps you upgrade from previous versions of ChatGPT Telegram Workers to the latest version. Please follow the appropriate section based on your current version.

## 📋 Table of Contents

- [Version Overview](#version-overview)
- [Migrating from v1.x to v2.0.0](#migrating-from-v1x-to-v200)
- [Migrating from v1.8.x to v1.9.0](#migrating-from-v18x-to-v190)
- [Common Migration Issues](#common-migration-issues)
- [Rollback Instructions](#rollback-instructions)

---

## 🎯 Version Overview

### Breaking Changes Summary

| From Version | To Version | Breaking Changes | Migration Complexity |
|--------------|------------|------------------|---------------------|
| v1.x | v2.0.0 | **Major** - Complete rewrite | 🔴 High |
| v1.8.x | v1.9.0 | Minor - Plugin system | 🟡 Medium |
| v1.7.x | v1.8.0 | Role system removal | 🟡 Medium |
| v1.6.x | v1.7.0 | Worker AI API changes | 🟠 Low-Medium |

---

## 🚀 Migrating from v1.x to v2.0.0

### ⚠️ Critical: This is a Major Rewrite

Version 2.0.0 represents a complete architectural overhaul. **This is not a simple update** - it requires careful planning and configuration migration.

### Pre-Migration Checklist

- [ ] **Backup Configuration**: Export all current settings
- [ ] **Document Custom Changes**: Note any modifications you've made
- [ ] **Prepare Downtime**: Plan for service interruption during migration
- [ ] **Test Environment**: Set up staging environment for testing
- [ ] **Dependencies**: Ensure all required services (Redis, etc.) are ready

### Step 1: Backup Current Setup

```bash
# Backup your current configuration
cp wrangler.toml wrangler.toml.backup
cp -r dist/ dist.backup/

# Export KV data (if using Cloudflare Workers)
wrangler kv:bulk get --binding=DATABASE --preview false > kv_backup.json

# Backup environment variables
wrangler secret list > secrets_backup.txt
```

### Step 2: Update Configuration Format

#### 2.1 Environment Variables Migration

**Old Format (v1.x)**:
```toml
# wrangler.toml (v1.x)
[vars]
TELEGRAM_AVAILABLE_TOKENS = "token1,token2"
OPENAI_API_KEY = "sk-..."
SYSTEM_INIT_MESSAGE = "You are a helpful assistant"
```

**New Format (v2.0.0)**:
```toml
# wrangler.toml (v2.0.0)
[vars]
# Telegram Configuration
TELEGRAM_AVAILABLE_TOKENS = "token1,token2"
TELEGRAM_BOT_NAME = "@your_bot"

# AI Provider Configuration
OPENAI_API_KEY = "sk-..."
ANTHROPIC_API_KEY = "sk-ant-..."
GOOGLE_API_KEY = "..."

# System Configuration
SYSTEM_INIT_MESSAGE = "You are a helpful assistant"
AI_CHAT_PROVIDER = "openai"  # Default chat provider
USE_TOOLS = "duckduckgo,jina_reader"  # Optional: enable local tools
```

#### 2.2 Configuration File Migration

Create new `config.json` file:

```json
{
  "mode": "webhook",
  "webhook": {
    "url": "https://your-domain.com",
    "secret": "your-webhook-secret"
  },
  "telegram": {
    "botNames": ["@your_bot"],
    "enableGroupMode": true,
    "enableInlineQuery": true
  },
  "ai": {
    "defaultProvider": "openai",
    "providers": {
      "openai": {
        "model": "gpt-4-turbo-preview",
        "enableFunctionCalling": true
      },
      "anthropic": {
        "model": "claude-3-sonnet-20240229"
      }
    }
  },
  "features": {
    "enableMCP": true,
    "enableStreaming": true,
    "enableImageInput": true
  }
}
```

### Step 3: Migrate Custom Commands

#### Role System → Custom Commands

**Old (v1.x)**: Role-based system
```javascript
// Old role configuration
const roles = {
  "assistant": "You are a helpful assistant",
  "translator": "You are a translator",
  "coder": "You are a coding assistant"
};
```

**New (v2.0.0)**: Custom commands system
```json
{
  "customCommands": {
    "/assistant": {
      "description": "General purpose assistant",
      "systemMessage": "You are a helpful assistant",
      "provider": "openai"
    },
    "/translate": {
      "description": "Translation assistant",
      "systemMessage": "You are a professional translator",
      "provider": "anthropic"
    },
    "/code": {
      "description": "Coding assistant",
      "systemMessage": "You are a coding assistant",
      "provider": "openai",
      "enableFunctionCalling": true,
      "tools": ["code_interpreter"]
    }
  }
}
```

### Step 4: Update Deployment Configuration

#### 4.1 Docker Deployment

**New Dockerfile structure**:
```dockerfile
# Multi-stage build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 8787
CMD ["npm", "start"]
```

#### 4.2 Vercel Configuration

**New vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/adapter/vercel/index.js",
      "use": "@vercel/node",
      "config": {
        "maxDuration": 30
      }
    }
  ],
  "routes": [
    {
      "src": "/telegram",
      "dest": "/src/adapter/vercel/index.js"
    }
  ]
}
```

### Step 5: Database Migration

#### KV Data Structure Changes

**Old Structure**:
```
user:123456 = "simple string data"
chat:123456 = "chat history string"
```

**New Structure**:
```json
{
  "user:123456": {
    "settings": {...},
    "preferences": {...},
    "usage": {...}
  },
  "chat:123456": {
    "messages": [...],
    "context": {...},
    "metadata": {...}
  }
}
```

**Migration Script**:
```javascript
// migration-script.js
async function migrateKVData() {
  const oldData = await KV.list();
  
  for (const key of oldData.keys) {
    const oldValue = await KV.get(key.name);
    
    if (key.name.startsWith('user:')) {
      const newValue = {
        settings: JSON.parse(oldValue || '{}'),
        preferences: {},
        usage: { tokens: 0, requests: 0 }
      };
      await KV.put(key.name, JSON.stringify(newValue));
    }
    
    if (key.name.startsWith('chat:')) {
      const newValue = {
        messages: JSON.parse(oldValue || '[]'),
        context: {},
        metadata: { version: '2.0.0' }
      };
      await KV.put(key.name, JSON.stringify(newValue));
    }
  }
}
```

### Step 6: Deploy and Test

```bash
# 1. Deploy to staging first
npm run build
npm run deploy:staging

# 2. Test basic functionality
curl -X POST "https://your-staging-url.com/telegram" \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "/start"}}'

# 3. Test AI providers
# Send test messages to verify each AI provider works

# 4. Deploy to production
npm run deploy:production

# 5. Update webhook URL
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-new-domain.com/telegram"
```

### Step 7: Post-Migration Verification

- [ ] **Bot Responds**: Test basic `/start` command
- [ ] **AI Providers**: Test different AI providers
- [ ] **Custom Commands**: Verify custom commands work
- [ ] **Group Chats**: Test group functionality
- [ ] **Function Calling**: Test tool integration
- [ ] **Image Processing**: Test image input (if enabled)
- [ ] **Performance**: Monitor response times
- [ ] **Error Handling**: Check error logs

---

## 🔧 Migrating from v1.8.x to v1.9.0

### Plugin System Introduction

Version 1.9.0 introduces a plugin system for extensibility.

### Migration Steps

#### 1. Review Custom Modifications
```bash
# Check for custom code that might conflict with plugins
git diff v1.8.0..HEAD -- src/
```

#### 2. Enable Plugin System
```toml
# wrangler.toml
[vars]
ENABLE_PLUGINS = "true"
PLUGIN_REGISTRY_URL = "https://plugins.chatgpt-telegram-workers.com"
```

#### 3. Install Desired Plugins
```json
{
  "plugins": {
    "weather": {
      "enabled": true,
      "config": {
        "apiKey": "your-weather-api-key"
      }
    },
    "calculator": {
      "enabled": true
    }
  }
}
```

#### 4. Test Plugin Functionality
```bash
# Test weather plugin
echo "What's the weather in New York?" | ./test-bot.sh

# Test calculator plugin
echo "Calculate 2 + 2 * 3" | ./test-bot.sh
```

---

## 🚨 Common Migration Issues

### Issue 1: Function Timeout
**Problem**: New version times out on complex requests
**Solution**: Increase timeout limits and optimize processing
```json
{
  "timeout": 30000,
  "enableStreaming": true
}
```

### Issue 2: Memory Limit Exceeded
**Problem**: Higher memory usage in v2.0.0
**Solution**: Optimize caching and use external database
```json
{
  "cache": {
    "provider": "redis",
    "maxSize": "100MB"
  }
}
```

### Issue 3: AI Provider Authentication
**Problem**: New authentication format not recognized
**Solution**: Update API key format
```bash
# Old format
OPENAI_API_KEY=sk-...

# New format - ensure proper escaping
OPENAI_API_KEY="sk-..."
```

### Issue 4: Database Connection Errors
**Problem**: KV/Redis connection issues
**Solution**: Verify connection strings and permissions
```javascript
// Test connection
async function testConnections() {
  try {
    await KV.get('test');
    console.log('KV connection OK');
  } catch (error) {
    console.error('KV connection failed:', error);
  }
}
```

---

## 🔄 Rollback Instructions

### Emergency Rollback to v1.x

If migration fails and you need to rollback immediately:

#### 1. Quick Rollback
```bash
# Restore previous deployment
wrangler publish --compatibility-date 2023-11-01 dist.backup/index.js

# Restore configuration
cp wrangler.toml.backup wrangler.toml

# Restore KV data
wrangler kv:bulk put --binding=DATABASE kv_backup.json
```

#### 2. Restore Webhook
```bash
# Update webhook to old URL
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-old-domain.workers.dev/telegram"
```

#### 3. Verify Rollback
- Test basic bot functionality
- Check error logs
- Monitor for 24 hours

### Planned Rollback Process

If you want to rollback after testing:

1. **Communicate**: Notify users of planned maintenance
2. **Export Data**: Backup any new data created during testing
3. **Rollback**: Follow emergency rollback steps
4. **Monitor**: Ensure stability
5. **Plan**: Address issues found during migration attempt

---

## 📞 Support

### Getting Help

- 📖 **Documentation**: [Full Documentation](../README.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/TBXark/ChatGPT-Telegram-Workers/issues)
- 💬 **Community**: [GitHub Discussions](https://github.com/TBXark/ChatGPT-Telegram-Workers/discussions)

### Migration Support Checklist

Before asking for help, ensure you have:

- [ ] Followed the migration guide step by step
- [ ] Backed up your current configuration
- [ ] Tested in a staging environment
- [ ] Checked the error logs
- [ ] Verified all prerequisites are met

### Reporting Migration Issues

When reporting issues, please include:

1. **Current Version**: Version you're migrating from
2. **Target Version**: Version you're migrating to
3. **Deployment Platform**: Cloudflare Workers, Vercel, Docker, etc.
4. **Error Messages**: Full error logs
5. **Configuration**: Sanitized configuration files
6. **Steps Taken**: What you've already tried

---

**⚠️ Important**: Take your time with the migration. Version 2.0.0 is a major upgrade that significantly improves functionality, but requires careful attention to the migration process. When in doubt, test thoroughly in a staging environment first.
