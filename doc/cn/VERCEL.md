# Vercel 部署指南

本综合指南涵盖将您的 ChatGPT Telegram Workers 机器人部署到 Vercel，包括设置、配置和最佳实践。

## 📋 目录

- [概述](#概述)
- [前置条件](#前置条件)
- [快速部署](#快速部署)
- [手动部署](#手动部署)
- [配置](#配置)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)

---

## 🌟 概述

Vercel 为部署此机器人提供了出色的无服务器平台，具有以下优势：

### ✅ 优势
- **免费版本**: 个人项目有慷慨的限制
- **自动扩容**: 根据需求自动扩展
- **全球 CDN**: 全球快速响应时间
- **GitHub 集成**: 无缝 CI/CD 工作流
- **零配置**: 开箱即用
- **内置分析**: 监控性能和使用情况

### ⚠️ 限制
- **需要外部数据库**: 需要 Redis/PostgreSQL 进行持久化
- **函数超时**: 每个请求的执行时间有限
- **冷启动**: 不活动后的初始请求延迟
- **内存限制**: 每个函数 1GB RAM 限制

---

## 📋 前置条件

开始之前，确保您拥有：

1. **Vercel 账户**: 在 [vercel.com](https://vercel.com) 注册
2. **GitHub 仓库**: Fork 或克隆此仓库
3. **Redis 数据库**: 设置 [Upstash Redis](https://upstash.com)（有免费版本）
4. **Telegram 机器人**: 通过 [@BotFather](https://t.me/BotFather) 创建机器人
5. **AI 提供商密钥**: OpenAI、Anthropic 等

---

## 🚀 快速部署

### 一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SzeMeng76/ChatGPT-Telegram-Workers&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,VERCEL_DOMAIN,TELEGRAM_AVAILABLE_TOKENS&project-name=chatgpt-telegram-workers&repository-name=ChatGPT-Telegram-Workers&demo-title=ChatGPT-Telegram-Workers&demo-description=Deploy%20your%20own%20Telegram%20ChatGPT%20bot%20on%20Vercel%20with%20ease.&demo-url=https%3A%2F%2Fchatgpt-telegram-workers.vercel.app)

### 必需的环境变量

部署期间，您需要设置这些变量：

| 变量 | 描述 | 必需 |
|------|------|------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | ✅ 是 |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Token | ✅ 是 |
| `VERCEL_DOMAIN` | 您的 Vercel 应用域名 | ✅ 是 |
| `TELEGRAM_AVAILABLE_TOKENS` | Telegram 机器人令牌（逗号分隔）| ✅ 是 |
| `OPENAI_API_KEY` | OpenAI API 密钥 | ❌ 可选 |
| `ANTHROPIC_API_KEY` | Anthropic API 密钥 | ❌ 可选 |

---

## 🔧 手动部署

### 步骤 1: 安装 Vercel CLI

```bash
# 全局安装
npm install -g vercel

# 或使用 npx
npx vercel --version
```

### 步骤 2: 准备您的项目

```bash
# 克隆仓库
git clone https://github.com/SzeMeng76/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers

# 安装依赖
npm install

# 为 Vercel 构建
npm run build:vercel

# 将 wrangler.toml 转换为 Vercel 环境变量
npm run prepare:vercel
```

### 步骤 3: 配置环境

在项目根目录创建 `.env.local` 文件：

```bash
# 数据库配置
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Vercel 配置
VERCEL_DOMAIN=your-app.vercel.app

# Telegram 配置
TELEGRAM_AVAILABLE_TOKENS=bot_token_1,bot_token_2

# AI 提供商密钥
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# 可选：其他配置
NODE_ENV=production
LOG_LEVEL=info
```

### 步骤 4: 部署到 Vercel

```bash
# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod

# 或使用特定环境文件部署
vercel deploy --prod --env-file .env.local
```

---

## ⚙️ 配置

### 数据库设置（Upstash Redis）

1. **创建 Redis 数据库**:
   - 访问 [Upstash 控制台](https://console.upstash.com)
   - 创建新的 Redis 数据库
   - 选择离用户最近的区域
   - 复制 REST URL 和令牌

2. **在 Vercel 中配置 Redis**:
   ```bash
   # 设置环境变量
   vercel env add UPSTASH_REDIS_REST_URL
   vercel env add UPSTASH_REDIS_REST_TOKEN
   ```

### 自定义域名设置

1. **在 Vercel 控制台添加域名**:
   - 前往项目设置 → 域名
   - 添加您的自定义域名
   - 配置 DNS 记录

2. **更新环境变量**:
   ```bash
   vercel env add VERCEL_DOMAIN production
   # 输入：your-domain.com
   ```

### Webhook 配置

部署后，设置 Telegram webhook：

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.vercel.app/telegram"}'
```

---

## 🏗️ 高级配置

### 自定义构建配置

在项目根目录创建 `vercel.json`：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/adapter/vercel/index.js",
      "use": "@vercel/node",
      "config": {
        "maxDuration": 30,
        "memory": 1024
      }
    }
  ],
  "routes": [
    {
      "src": "/telegram",
      "dest": "/src/adapter/vercel/index.js"
    },
    {
      "src": "/health",
      "dest": "/src/adapter/vercel/health.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 环境特定配置

为预发布和生产环境创建不同配置：

```bash
# 预发布环境
vercel env add OPENAI_API_KEY preview
vercel env add REDIS_URL preview

# 生产环境
vercel env add OPENAI_API_KEY production
vercel env add REDIS_URL production
```

### 函数配置

在 `vercel.json` 中优化函数性能：

```json
{
  "functions": {
    "src/adapter/vercel/*.js": {
      "maxDuration": 30,
      "memory": 1024,
      "runtime": "nodejs18.x"
    }
  }
}
```

---

## 🔍 故障排除

### 常见问题

#### 1. 函数超时错误

**问题**: 函数在 AI 响应期间超时

**解决方案**:
```javascript
// 优化超时处理
export const config = {
  maxDuration: 30, // 免费版本允许的最大值
}

// 对长操作使用流响应
async function handleLongOperation() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}
```

#### 2. 冷启动问题

**问题**: 第一次请求响应慢

**解决方案**:
- 实施保活机制
- 使用 Vercel 的边缘函数以加快冷启动
- 优化包大小

```javascript
// 保持函数温暖
setInterval(() => {
  fetch(process.env.VERCEL_DOMAIN + '/health');
}, 5 * 60 * 1000); // 每 5 分钟
```

#### 3. Redis 连接问题

**问题**: Redis 连接过多

**解决方案**:
```javascript
// 使用连接池
import { createClient } from '@upstash/redis';

const redis = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  retry: {
    retries: 3,
    initialDelayMs: 100
  }
});

// 始终关闭连接
try {
  await redis.set('key', 'value');
} finally {
  // Redis HTTP 客户端不需要显式关闭
}
```

#### 4. 环境变量问题

**问题**: 变量未正确加载

**解决方案**:
```bash
# 检查当前环境变量
vercel env ls

# 在本地拉取环境变量
vercel env pull .env.local

# 添加缺失的变量
vercel env add VARIABLE_NAME production
```

### 调试模式

启用调试日志：

```javascript
// 在 Vercel 函数中
export default function handler(req, res) {
  if (process.env.DEBUG === 'true') {
    console.log('请求:', req.method, req.url);
    console.log('请求头:', req.headers);
    console.log('请求体:', req.body);
  }
  
  // 您的处理逻辑
}
```

---

## 🏆 最佳实践

### 性能优化

1. **包大小优化**:
   ```bash
   # 分析包大小
   npm run build:vercel -- --analyze
   
   # 使用动态导入
   const heavyLibrary = await import('./heavy-library');
   ```

2. **缓存策略**:
   ```javascript
   // 在 Redis 中缓存响应
   const cacheKey = `response:${userId}:${messageHash}`;
   const cached = await redis.get(cacheKey);
   
   if (cached) {
     return JSON.parse(cached);
   }
   
   const response = await generateResponse();
   await redis.setex(cacheKey, 3600, JSON.stringify(response));
   ```

3. **边缘函数**:
   ```javascript
   // 使用边缘运行时加快冷启动
   export const config = {
     runtime: 'edge',
   }
   ```

### 安全最佳实践

1. **环境变量**:
   - 永远不要将密钥提交到仓库
   - 为预发布/生产使用不同的密钥
   - 定期轮换密钥

2. **请求验证**:
   ```javascript
   // 验证 Telegram webhook
   import crypto from 'crypto';
   
   function validateTelegramWebhook(body, signature) {
     const hash = crypto
       .createHmac('sha256', process.env.TELEGRAM_BOT_TOKEN)
       .update(body)
       .digest('hex');
     
     return `sha256=${hash}` === signature;
   }
   ```

3. **速率限制**:
   ```javascript
   // 使用 Redis 实施速率限制
   const rateLimitKey = `rate_limit:${userId}`;
   const requests = await redis.incr(rateLimitKey);
   
   if (requests === 1) {
     await redis.expire(rateLimitKey, 60); // 1 分钟窗口
   }
   
   if (requests > 10) {
     return res.status(429).json({ error: '速率限制超出' });
   }
   ```

### 监控和分析

1. **启用 Vercel 分析**:
   ```bash
   # 安装分析包
   npm install @vercel/analytics
   ```

2. **自定义指标**:
   ```javascript
   // 跟踪自定义指标
   import { track } from '@vercel/analytics';
   
   track('message_processed', {
     userId,
     messageType,
     processingTime: Date.now() - startTime
   });
   ```

3. **健康检查**:
   ```javascript
   // 创建健康检查端点
   export default async function handler(req, res) {
     try {
       // 检查 Redis 连接
       await redis.ping();
       
       // 检查 AI 提供商
       const testResponse = await openai.models.list();
       
       res.status(200).json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         checks: {
           redis: 'ok',
           openai: 'ok'
         }
       });
     } catch (error) {
       res.status(500).json({
         status: 'unhealthy',
         error: error.message
       });
     }
   }
   ```

---

## 📚 其他资源

- [Vercel 文档](https://vercel.com/docs)
- [Vercel 函数](https://vercel.com/docs/functions)
- [Upstash Redis](https://docs.upstash.com/redis)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 🚀 后续步骤

成功部署后：

1. **监控性能**: 使用 Vercel 分析和日志
2. **设置警报**: 配置错误通知
3. **优化成本**: 监控使用情况并优化函数
4. **扩大规模**: 考虑 Pro 计划以获得更高限制
5. **自定义域名**: 为品牌设置您自己的域名

**需要帮助？** 查看我们的[故障排除部分](#故障排除)或在仓库中创建 issue。