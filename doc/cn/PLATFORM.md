# 支持的部署平台

本指南涵盖ChatGPT Telegram Workers机器人的所有支持部署平台，包含详细说明和平台特定注意事项。

## 📋 平台概览

| 平台 | 难度 | 成本 | 性能 | 适用场景 |
|------|------|------|------|----------|
| [Docker](#docker-推荐) | ⭐⭐ | 免费/付费 | ⭐⭐⭐⭐⭐ | 生产环境、重度使用 |
| [Cloudflare Workers](#cloudflare-workers) | ⭐ | 免费/付费 | ⭐⭐ | 轻度使用、初学者 |
| [Vercel](#vercel) | ⭐⭐ | 免费/付费 | ⭐⭐⭐ | 无服务器、中度使用 |
| [Railway](#railway) | ⭐⭐ | 付费 | ⭐⭐⭐⭐ | 简单Docker部署 |
| [Render](#render) | ⭐⭐ | 免费/付费 | ⭐⭐⭐ | 简单云部署 |
| [Koyeb](#koyeb) | ⭐⭐ | 免费/付费 | ⭐⭐⭐ | 全球边缘部署 |

## 🐳 Docker (推荐)

**最适合**: 生产环境、重度使用、完全控制

### 优势
- ✅ 无CPU时间限制
- ✅ 完整功能支持
- ✅ 易于扩展和监控
- ✅ 兼容任何云提供商
- ✅ 完全隔离和安全

### 快速开始
```bash
docker pull szemeng76/chatgpt-telegram-workers:latest
docker run -d \
  --name chatgpt-telegram-bot \
  -p 8787:8787 \
  -v $(pwd)/config.json:/app/config.json:ro \
  -v $(pwd)/wrangler.toml:/app/config.toml:ro \
  szemeng76/chatgpt-telegram-workers:latest
```

**📖 完整指南**: [Docker部署文档](LOCAL.md)

---

## ☁️ Cloudflare Workers

**最适合**: 初学者、轻度使用、无服务器

### 优势
- ✅ 有免费版本
- ✅ 全球边缘网络
- ✅ 部署简单
- ✅ 内置KV存储

### 限制
- ⚠️ CPU时间限制（免费10ms，付费30s）
- ⚠️ 不适合AI SDK（高CPU使用）
- ⚠️ 执行时间限制60s

### 快速部署
[![部署到Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SzeMeng76/ChatGPT-Telegram-Workers)

**📖 完整指南**: [Cloudflare Workers部署](DEPLOY.md)

---

## ▲ Vercel

**最适合**: 无服务器部署、中度使用

### 优势
- ✅ 免费版本限制宽松
- ✅ 自动扩容
- ✅ 内置分析
- ✅ GitHub集成

### 限制
- ⚠️ 需要外部数据库（Redis/PostgreSQL）
- ⚠️ 函数超时限制
- ⚠️ 冷启动延迟

### 快速部署
[![使用Vercel部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SzeMeng76/ChatGPT-Telegram-Workers&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,VERCEL_DOMAIN,TELEGRAM_AVAILABLE_TOKENS&project-name=chatgpt-telegram-workers&repository-name=ChatGPT-Telegram-Workers)

### 手动设置
```bash
npm install -g vercel
npm install
npm run build:vercel
npm run prepare:vercel  # 转换wrangler.toml到Vercel环境变量
vercel deploy --prod
```

**必需环境变量：**
```bash
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
VERCEL_DOMAIN=your-app.vercel.app
TELEGRAM_AVAILABLE_TOKENS=your_bot_tokens
OPENAI_API_KEY=your_openai_key
```

**📖 完整指南**: [Vercel部署](VERCEL.md)

---

## 🚂 Railway

**最适合**: 托管基础设施的简单Docker部署

### 优势
- ✅ 简单Docker部署
- ✅ 自动HTTPS
- ✅ 内置监控
- ✅ GitHub集成

### 快速部署
[![在Railway上部署](https://railway.app/button.svg)](https://railway.app/template/chatgpt-telegram-workers)

### 手动设置
1. 连接GitHub仓库到Railway
2. 从`wrangler.toml`添加环境变量
3. 自动部署

**预估成本**: 根据使用情况约$5-20/月

---

## 🎨 Render

**最适合**: 有免费版本的简单云部署

### 优势
- ✅ 有免费版本
- ✅ 从Git自动部署
- ✅ 内置SSL
- ✅ 易于使用

### 设置说明

1. **创建Web服务**
   - 连接GitHub仓库
   - 选择"Docker"环境
   - 设置构建命令：`docker build -t app .`
   - 设置启动命令：`docker run -p 10000:8787 app`

2. **环境变量**
   从`wrangler.toml`文件添加所有变量

3. **配置**
   创建`render.yaml`：
   ```yaml
   services:
     - type: web
       name: chatgpt-telegram-workers
       env: docker
       plan: free
       buildCommand: docker build -t app .
       startCommand: docker run -p 10000:8787 app
       envVars:
         - key: TELEGRAM_AVAILABLE_TOKENS
           value: your_bot_token
         - key: OPENAI_API_KEY
           value: your_openai_key
   ```

**免费版限制**: 每月750小时，15分钟不活动后休眠

---

## 🌐 Koyeb

**最适合**: 自动扩容的全球边缘部署

### 优势
- ✅ 全球边缘位置
- ✅ 有免费版本
- ✅ 自动扩容
- ✅ 内置负载均衡

### 快速部署
[![部署到Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=chatgpt-telegram-workers&type=docker&image=szemeng76/chatgpt-telegram-workers:latest
&instance_type=free&instances_min=0&autoscaling_sleep_idle_delay=300&ports=8787%3Bhttp%3B%2F&env%5BTELEGRAM_AVAILABLE_TOKENS%5D=&env%5BOPENAI_API_KEY%5D=)

### 手动设置

**Webhook模式：**
1. 创建服务 → Web服务 → Docker
2. 镜像：`szemeng76/chatgpt-telegram-workers:latest`
3. 添加环境变量
4. 设置端口：`8787`
5. 部署并复制公共URL
6. 用URL更新`config.json`并重新部署

**轮询模式（推荐）：**
1. 创建服务 → Worker → Docker
2. 镜像：`szemeng76/chatgpt-telegram-workers:latest`
3. 设置`config.json`模式为`polling`
4. 无需域名

---

## 🔧 平台特定配置

### Docker Compose（任何云提供商）
```yaml
version: '3.8'
services:
  chatgpt-telegram-bot:
    image: szemeng76/chatgpt-telegram-workers:latest
    ports:
      - "8787:8787"
    volumes:
      - ./config.json:/app/config.json:ro
      - ./wrangler.toml:/app/config.toml:ro
    restart: unless-stopped
```

### Kubernetes部署
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatgpt-telegram-workers
spec:
  replicas: 1
  selector:
    matchLabels:
      app: chatgpt-telegram-workers
  template:
    metadata:
      labels:
        app: chatgpt-telegram-workers
    spec:
      containers:
      - name: bot
        image: szemeng76/chatgpt-telegram-workers:latest
        ports:
        - containerPort: 8787
        env:
        - name: TELEGRAM_AVAILABLE_TOKENS
          value: "your_bot_token"
        - name: OPENAI_API_KEY
          value: "your_openai_key"
```

---

## 🏗️ 平台迁移指南

### 从Cloudflare Workers到Docker
1. 导出KV数据（如需要）
2. 创建`config.json`和`wrangler.toml`
3. 选择Docker平台并部署
4. 如使用webhook模式，更新webhook URL

### 从Vercel到Docker
1. 导出环境变量到`wrangler.toml`
2. 创建带数据库设置的`config.json`
3. 如需要，迁移数据库数据
4. 部署Docker容器

---

## 📊 平台比较

### 性能比较
| 平台 | 冷启动 | 并发用户 | AI SDK支持 | 数据库 |
|------|--------|----------|------------|--------|
| Docker | 无 | 高 | ✅ 完整 | 任意 |
| Cloudflare Workers | ~10ms | 中等 | ❌ 有限 | 仅KV |
| Vercel | ~100-500ms | 中等 | ✅ 完整 | 外部 |
| Railway | ~30s | 高 | ✅ 完整 | 内置 |
| Render | ~30s | 中等 | ✅ 完整 | 外部 |
| Koyeb | ~30s | 中等 | ✅ 完整 | 外部 |

### 成本比较（月费）
| 平台 | 免费版 | 付费计划 | 说明 |
|------|--------|----------|------|
| Docker (VPS) | $0-5 | $5-50+ | 取决于提供商 |
| Cloudflare Workers | $0 | $5+ | CPU时间限制 |
| Vercel | $0 | $20+ | 函数调用次数 |
| Railway | $0 | $5+ | 基于使用量 |
| Render | $0 | $7+ | 实例小时数 |
| Koyeb | $0 | $5+ | 实例小时数 |

---

## 🎯 部署建议

### 初学者
1. **开始使用**: Cloudflare Workers（如果轻度使用）
2. **升级到**: 需要时在Railway/Render上使用Docker

### 生产环境
1. **推荐**: VPS/云上的Docker（DigitalOcean、AWS、GCP）
2. **替代方案**: Railway或Render托管解决方案

### 企业级
1. **推荐**: Kubernetes集群
2. **替代方案**: 带负载均衡器的Docker Swarm

---

## 🔍 按平台故障排除

### Cloudflare Workers问题
- **CPU超时**: 切换到Docker部署
- **内存限制**: 减少历史长度，禁用工具
- **KV写入限制**: 禁用调试模式

### Vercel问题
- **函数超时**: 使用更小的模型，减少处理
- **冷启动**: 考虑保持函数温暖
- **数据库连接**: 使用连接池

### Docker问题
- **容器崩溃**: 检查日志，验证配置文件
- **网络问题**: 验证端口映射和防火墙
- **性能**: 增加内存限制，使用Redis

---

## 📚 其他资源

- [配置指南](CONFIG.md) - 详细配置选项
- [本地开发](LOCAL.md) - Docker和本地设置
- [GitHub Actions](ACTION.md) - 自动化部署

**需要帮助选择平台？** 考虑您的：
- **使用量**: 高 → Docker，中等 → Vercel/Railway，低 → Cloudflare
- **技术水平**: 初学者 → Cloudflare/Railway，高级 → Docker
- **预算**: 免费 → Cloudflare/Vercel，付费 → Railway/Docker
- **功能需求**: 完整功能 → Docker，基础功能 → Cloudflare