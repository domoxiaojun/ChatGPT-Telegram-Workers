# 迁移指南

本指南帮助您从 ChatGPT Telegram Workers 的旧版本升级到最新版本。请根据您当前的版本选择相应的部分。

## 📋 目录

- [版本概述](#版本概述)
- [从 v1.x 迁移到 v2.0.0](#从-v1x-迁移到-v200)
- [从 v1.8.x 迁移到 v1.9.0](#从-v18x-迁移到-v190)
- [常见迁移问题](#常见迁移问题)
- [回滚说明](#回滚说明)

---

## 🎯 版本概述

### 破坏性更改汇总

| 起始版本 | 目标版本 | 破坏性更改 | 迁移复杂度 |
|---------|----------|------------|-----------|
| v1.x | v2.0.0 | **重大** - 完全重写 | 🔴 高 |
| v1.8.x | v1.9.0 | 轻微 - 插件系统 | 🟡 中等 |
| v1.7.x | v1.8.0 | 角色系统移除 | 🟡 中等 |
| v1.6.x | v1.7.0 | Worker AI API 更改 | 🟠 中低 |

---

## 🚀 从 v1.x 迁移到 v2.0.0

### ⚠️ 重要：这是一次重大重写

版本 2.0.0 代表了完整的架构改革。**这不是简单的更新** - 需要仔细规划和配置迁移。

### 迁移前检查清单

- [ ] **备份配置**：导出所有当前设置
- [ ] **记录自定义更改**：记录您所做的任何修改
- [ ] **准备停机时间**：规划迁移期间的服务中断
- [ ] **测试环境**：设置预发布环境进行测试
- [ ] **依赖项**：确保所有必需的服务（Redis等）已就绪

### 步骤 1：备份当前设置

```bash
# 备份当前配置
cp wrangler.toml wrangler.toml.backup
cp -r dist/ dist.backup/

# 导出 KV 数据（如果使用 Cloudflare Workers）
wrangler kv:bulk get --binding=DATABASE --preview false > kv_backup.json

# 备份环境变量
wrangler secret list > secrets_backup.txt
```

### 步骤 2：更新配置格式

#### 2.1 环境变量迁移

**旧格式 (v1.x)**：
```toml
# wrangler.toml (v1.x)
[vars]
TELEGRAM_AVAILABLE_TOKENS = "token1,token2"
OPENAI_API_KEY = "sk-..."
SYSTEM_INIT_MESSAGE = "你是一个有用的助手"
```

**新格式 (v2.0.0)**：
```toml
# wrangler.toml (v2.0.0)
[vars]
# Telegram 配置
TELEGRAM_AVAILABLE_TOKENS = "token1,token2"
TELEGRAM_BOT_NAME = "@your_bot"

# AI 提供商配置
OPENAI_API_KEY = "sk-..."
ANTHROPIC_API_KEY = "sk-ant-..."
GOOGLE_API_KEY = "..."

# 系统配置
SYSTEM_INIT_MESSAGE = "你是一个有用的助手"
AI_CHAT_PROVIDER = "openai"  # 默认聊天提供商
USE_TOOLS = "duckduckgo,jina_reader"  # 可选：启用本地工具
```

#### 2.2 配置文件迁移

创建新的 `config.json` 文件：

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

### 步骤 3：迁移自定义命令

#### 角色系统 → 自定义命令

**旧版 (v1.x)**：基于角色的系统
```javascript
// 旧角色配置
const roles = {
  "assistant": "你是一个有用的助手",
  "translator": "你是一个翻译助手",
  "coder": "你是一个编程助手"
};
```

**新版 (v2.0.0)**：自定义命令系统
```json
{
  "customCommands": {
    "/assistant": {
      "description": "通用助手",
      "systemMessage": "你是一个有用的助手",
      "provider": "openai"
    },
    "/translate": {
      "description": "翻译助手",
      "systemMessage": "你是一个专业翻译",
      "provider": "anthropic"
    },
    "/code": {
      "description": "编程助手",
      "systemMessage": "你是一个编程助手",
      "provider": "openai",
      "enableFunctionCalling": true,
      "tools": ["code_interpreter"]
    }
  }
}
```

### 步骤 4：更新部署配置

#### 4.1 Docker 部署

**新的 Dockerfile 结构**：
```dockerfile
# 多阶段构建
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

#### 4.2 Vercel 配置

**新的 vercel.json**：
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

### 步骤 5：数据库迁移

#### KV 数据结构更改

**旧结构**：
```
user:123456 = "简单字符串数据"
chat:123456 = "聊天历史字符串"
```

**新结构**：
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

**迁移脚本**：
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

### 步骤 6：部署和测试

```bash
# 1. 首先部署到预发布环境
npm run build
npm run deploy:staging

# 2. 测试基本功能
curl -X POST "https://your-staging-url.com/telegram" \
  -H "Content-Type: application/json" \
  -d '{"message": {"text": "/start"}}'

# 3. 测试 AI 提供商
# 发送测试消息验证每个 AI 提供商是否正常工作

# 4. 部署到生产环境
npm run deploy:production

# 5. 更新 webhook URL
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-new-domain.com/telegram"
```

### 步骤 7：迁移后验证

- [ ] **机器人响应**：测试基本 `/start` 命令
- [ ] **AI 提供商**：测试不同的 AI 提供商
- [ ] **自定义命令**：验证自定义命令是否工作
- [ ] **群聊**：测试群组功能
- [ ] **函数调用**：测试工具集成
- [ ] **图片处理**：测试图片输入（如果启用）
- [ ] **性能**：监控响应时间
- [ ] **错误处理**：检查错误日志

---

## 🔧 从 v1.8.x 迁移到 v1.9.0

### 插件系统介绍

版本 1.9.0 引入了可扩展性的插件系统。

### 迁移步骤

#### 1. 检查自定义修改
```bash
# 检查可能与插件冲突的自定义代码
git diff v1.8.0..HEAD -- src/
```

#### 2. 启用插件系统
```toml
# wrangler.toml
[vars]
ENABLE_PLUGINS = "true"
PLUGIN_REGISTRY_URL = "https://plugins.chatgpt-telegram-workers.com"
```

#### 3. 安装所需插件
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

#### 4. 测试插件功能
```bash
# 测试天气插件
echo "纽约的天气怎么样？" | ./test-bot.sh

# 测试计算器插件
echo "计算 2 + 2 * 3" | ./test-bot.sh
```

---

## 🚨 常见迁移问题

### 问题 1：函数超时
**问题**：新版本在处理复杂请求时超时
**解决方案**：增加超时限制并优化处理
```json
{
  "timeout": 30000,
  "enableStreaming": true
}
```

### 问题 2：内存限制超出
**问题**：v2.0.0 内存使用量较高
**解决方案**：优化缓存并使用外部数据库
```json
{
  "cache": {
    "provider": "redis",
    "maxSize": "100MB"
  }
}
```

### 问题 3：AI 提供商认证
**问题**：新的认证格式无法识别
**解决方案**：更新 API 密钥格式
```bash
# 旧格式
OPENAI_API_KEY=sk-...

# 新格式 - 确保正确转义
OPENAI_API_KEY="sk-..."
```

### 问题 4：数据库连接错误
**问题**：KV/Redis 连接问题
**解决方案**：验证连接字符串和权限
```javascript
// 测试连接
async function testConnections() {
  try {
    await KV.get('test');
    console.log('KV 连接正常');
  } catch (error) {
    console.error('KV 连接失败:', error);
  }
}
```

---

## 🔄 回滚说明

### 紧急回滚到 v1.x

如果迁移失败需要立即回滚：

#### 1. 快速回滚
```bash
# 恢复之前的部署
wrangler publish --compatibility-date 2023-11-01 dist.backup/index.js

# 恢复配置
cp wrangler.toml.backup wrangler.toml

# 恢复 KV 数据
wrangler kv:bulk put --binding=DATABASE kv_backup.json
```

#### 2. 恢复 Webhook
```bash
# 将 webhook 更新为旧 URL
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-old-domain.workers.dev/telegram"
```

#### 3. 验证回滚
- 测试基本机器人功能
- 检查错误日志
- 监控 24 小时

### 计划回滚流程

如果您在测试后想要回滚：

1. **沟通**：通知用户计划维护
2. **导出数据**：备份测试期间创建的任何新数据
3. **回滚**：按照紧急回滚步骤
4. **监控**：确保稳定性
5. **计划**：解决迁移尝试中发现的问题

---

## 📞 支持

### 获取帮助

- 📖 **文档**：[完整文档](../README.md)
- 🐛 **问题**：[GitHub Issues](https://github.com/TBXark/ChatGPT-Telegram-Workers/issues)
- 💬 **社区**：[GitHub Discussions](https://github.com/TBXark/ChatGPT-Telegram-Workers/discussions)

### 迁移支持检查清单

在寻求帮助之前，确保您已经：

- [ ] 按照迁移指南逐步操作
- [ ] 备份了当前配置
- [ ] 在预发布环境中测试
- [ ] 检查了错误日志
- [ ] 验证了所有前置条件

### 报告迁移问题

报告问题时，请包含：

1. **当前版本**：您要迁移的起始版本
2. **目标版本**：您要迁移到的版本
3. **部署平台**：Cloudflare Workers、Vercel、Docker 等
4. **错误消息**：完整的错误日志
5. **配置**：清理后的配置文件
6. **已尝试步骤**：您已经尝试过的操作

---

**⚠️ 重要**：请花时间进行迁移。版本 2.0.0 是一个重大升级，显著改善了功能，但需要仔细关注迁移过程。如有疑问，请先在预发布环境中彻底测试。
