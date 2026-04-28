# 本地和Docker部署

本指南涵盖ChatGPT Telegram Workers机器人的本地开发和Docker部署选项。

## 📋 目录

- [Docker快速开始](#docker快速开始)
- [配置](#配置)
- [Docker部署](#docker部署)
- [本地开发](#本地开发)
- [Docker Compose](#docker-compose)
- [生产环境配置](#生产环境配置)
- [故障排除](#故障排除)

## 🚀 Docker快速开始

### 前置要求

- 已安装Docker和Docker Compose
- 从[@BotFather](https://t.me/BotFather)获取的Telegram机器人令牌
- OpenAI API密钥（或其他AI提供商密钥）

### 一键安装

```bash
# 克隆仓库
git clone https://github.com/SzeMeng76/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers

# 复制示例配置
cp docker-compose.yaml.example docker-compose.yaml
cp config.json.example config.json
cp wrangler.toml.example wrangler.toml

# 编辑配置
nano config.json  # 添加机器人令牌和API密钥
nano wrangler.toml # 添加环境变量

# 启动机器人
docker-compose up -d
```

## ⚙️ 配置

### 1. 服务器配置 (`config.json`)

在项目根目录创建`config.json`文件：

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

**配置选项：**

| 字段 | 描述 | 选项 |
|------|------|------|
| `database.type` | 数据库类型 | `memory`, `local`, `sqlite`, `redis` |
| `database.path` | 数据库文件路径 | local/sqlite的路径 |
| `server.hostname` | 服务器绑定地址 | Docker使用`0.0.0.0` |
| `server.port` | 服务器端口 | `8787`（Docker必需） |
| `server.baseURL` | 公共URL | webhook模式必需 |
| `proxy` | HTTP代理 | 可选代理服务器 |
| `mode` | 运行模式 | `webhook`, `polling` |

### 2. 环境变量 (`wrangler.toml`)

`wrangler.toml`文件包含所有环境变量：

```toml
name = "chatgpt-telegram-workers"
compatibility_date = "2024-01-01"

[vars]
# 必需配置
TELEGRAM_AVAILABLE_TOKENS = "your_bot_token_here"
OPENAI_API_KEY = "your_openai_key_here"

# 基础配置
LANGUAGE = "zh-cn"
AI_CHAT_PROVIDER = "openai"
CHAT_WHITE_LIST = "user_id1,user_id2"

# 群组设置
GROUP_CHAT_BOT_ENABLE = "true"
CHAT_GROUP_WHITE_LIST = "group_id1,group_id2"

# 高级功能
USE_TOOLS = '["duckduckgo", "image_gen"]'
ENABLE_INTELLIGENT_MODEL = "false"
MAX_HISTORY_LENGTH = "10"

# 可选：多AI提供商
ANTHROPIC_API_KEY = "your_anthropic_key"
GOOGLE_API_KEY = "your_google_key"
```

## 🐳 Docker部署

### 方法1：使用预构建镜像

```bash
# 拉取最新镜像
docker pull szemeng76/chatgpt-telegram-workers:latest

# 运行容器并挂载卷
docker run -d \
  --name chatgpt-telegram-bot \
  -p 8787:8787 \
  -v $(pwd)/config.json:/app/config.json:ro \
  -v $(pwd)/wrangler.toml:/app/config.toml:ro \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  szemeng76/chatgpt-telegram-workers:latest
```

### 方法2：从源码构建

```bash
# 构建镜像
docker build -t chatgpt-telegram-workers:latest .

# 或使用npm脚本快速构建
npm run build:docker

# 运行容器
docker run -d \
  --name chatgpt-telegram-bot \
  -p 8787:8787 \
  -v $(pwd)/config.json:/app/config.json:ro \
  -v $(pwd)/wrangler.toml:/app/config.toml:ro \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  chatgpt-telegram-workers:latest
```

### Docker运行选项说明

| 选项 | 描述 |
|------|------|
| `-d` | 后台运行（分离模式） |
| `--name` | 容器名称，便于管理 |
| `-p 8787:8787` | 端口映射（主机:容器） |
| `-v $(pwd)/config.json:/app/config.json:ro` | 挂载配置文件（只读） |
| `-v $(pwd)/wrangler.toml:/app/config.toml:ro` | 挂载环境变量文件（只读） |
| `-v $(pwd)/data:/app/data` | 挂载数据目录以持久化 |
| `--restart unless-stopped` | 自动重启策略 |

## 🔧 本地开发

### 前置要求

- Node.js 18+ 和 npm
- Git

### 设置

```bash
# 克隆并安装
git clone https://github.com/SzeMeng76/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers
npm install

# 配置
cp config.json.example config.json
cp wrangler.toml.example wrangler.toml
# 编辑配置文件设置您的配置

# 开发模式运行
npm run start:local
```

### 开发脚本

```bash
# 启动开发服务器
npm run start:local

# 构建本地部署版本
npm run build:local

# 启动构建版本
CONFIG_PATH=./config.json TOML_PATH=./wrangler.toml npm run start:dist

# 运行测试
npm test

# 代码检查
npm run lint
```

### 本地开发环境变量

```bash
export CONFIG_PATH=./config.json
export TOML_PATH=./wrangler.toml
npm run start:local
```

## 📦 Docker Compose

### 基础设置

创建`docker-compose.yaml`：

```yaml
version: '3.8'

services:
  chatgpt-telegram-bot:
    image: szemeng76/chatgpt-telegram-workers:latest
    # 或从源码构建：
    # build: .
    container_name: chatgpt-telegram-workers
    ports:
      - "8787:8787"
    volumes:
      - ./config.json:/app/config.json:ro
      - ./wrangler.toml:/app/config.toml:ro
      - ./data:/app/data
      - ./tool:/app/tool:ro  # 可选：自定义工具
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    # 可选：资源限制
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Redis高级配置

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

使用Redis时，更新您的`config.json`：

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

### 运行Docker Compose

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 更新并重启
docker-compose pull
docker-compose up -d
```

## 🏭 生产环境配置

### 推荐的生产配置

**config.json：**
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

**wrangler.toml：**
```toml
[vars]
# 生产设置
TELEGRAM_AVAILABLE_TOKENS = "your_production_bot_tokens"
OPENAI_API_KEY = "your_openai_keys"
LANGUAGE = "zh-cn"

# 安全设置
CHAT_WHITE_LIST = "authorized_user_ids"
CHAT_GROUP_WHITE_LIST = "authorized_group_ids"
LOCK_USER_CONFIG_KEYS = "OPENAI_API_BASE,ANTHROPIC_API_BASE"

# 性能设置
MAX_HISTORY_LENGTH = "5"
STREAM_MODE = "true"
AUTO_TRIM_HISTORY = "true"

# 日志设置
LOG_LEVEL = "info"
DEBUG_MODE = "false"
```

### 生产部署检查清单

- [ ] 使用webhook模式以获得更好性能
- [ ] 设置Redis进行持久化存储
- [ ] 配置适当的日志记录
- [ ] 设置监控和健康检查
- [ ] 使用环境密钥保存API密钥
- [ ] 配置反向代理（nginx/caddy）
- [ ] 设置SSL/TLS证书
- [ ] 配置备份策略
- [ ] 设置资源限制
- [ ] 配置日志轮转

### 反向代理设置（Nginx）

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

## 🛠️ 自定义工具

### 本地工具文件

在`/app/tool`目录下挂载自定义工具：

```bash
# 目录结构
./tool/
├── weather.json      # JSON工具定义
├── calculator.ts     # TypeScript工具
└── translator.js     # JavaScript工具
```

**TypeScript工具示例 (`tool/echo.ts`)：**

```typescript
export default {
  schema: {
    name: 'echo',
    description: '回显输入的文本',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: '要回显的文本',
        },
      },
      required: ['text'],
    },
  },
  func: async (args: { text: string }) => {
    return `回显: ${args.text}`;
  },
  prompt: '回显一些内容',
  extra_params: { temperature: 0.7 },
  not_send_to_ai: false,
};
```

## 🐛 故障排除

### 常见问题

<details>
<summary><strong>容器无法启动</strong></summary>

**检查日志：**
```bash
docker logs chatgpt-telegram-workers
```

**常见原因：**
- 配置文件中的JSON格式无效
- 缺少必需的环境变量
- 端口冲突
- 挂载卷的权限问题

</details>

<details>
<summary><strong>机器人收不到消息</strong></summary>

**webhook模式：**
1. 确保`baseURL`可从互联网访问
2. 检查webhook是否已设置：访问`https://your-domain.com/init`
3. 验证SSL证书有效

**轮询模式：**
1. 检查网络连接
2. 验证机器人令牌正确
3. 检查是否被限速

</details>

<details>
<summary><strong>数据库/存储问题</strong></summary>

**本地数据库：**
- 检查文件权限
- 确保卷挂载正确
- 检查磁盘空间

**Redis：**
- 验证Redis连接
- 检查Redis日志：`docker logs chatgpt-redis`
- 确保Redis可从机器人容器访问

</details>

<details>
<summary><strong>性能问题</strong></summary>

**解决方案：**
1. 使用Redis而不是本地文件存储
2. 减少`MAX_HISTORY_LENGTH`
3. 禁用不必要的工具
4. 对多机器人使用轮询模式
5. 增加容器内存限制

</details>

### 调试模式

在`wrangler.toml`中启用调试：

```toml
[vars]
DEBUG_MODE = "true"
DEV_MODE = "true"
LOG_LEVEL = "debug"
```

### 健康检查

在docker-compose中添加健康检查：

```yaml
services:
  chatgpt-telegram-bot:
    # ... 其他配置
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8787/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 监控

**基础日志监控：**
```bash
# 跟踪日志
docker-compose logs -f

# 检查容器统计
docker stats chatgpt-telegram-workers
```

**高级监控：**
- 设置Prometheus + Grafana
- 使用容器监控工具
- 监控API使用和成本
- 设置错误告警

---

## 📚 下一步

1. **扩容**: 使用负载均衡器处理多个实例
2. **监控**: 设置适当的日志记录和监控
3. **安全**: 实施适当的安全措施
4. **备份**: 设置自动备份
5. **更新**: 创建更新自动化工作流程

更多高级配置请参见[配置指南](CONFIG.md)。
