# ChatGPT Telegram Workers

[![Build and Push Docker Image](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/actions/workflows/build-docker.yml/badge.svg)](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/actions/workflows/build-docker.yml)

<p align="center">
    <br> <a href="README.md">English</a> | 中文
</p>

<p align="center">
    <em>功能强大的多AI提供商Telegram机器人，支持灵活的部署选项</em>
</p>

## 📚 项目简介

这是一个经过重大重构的ChatGPT Telegram机器人项目，支持多种AI服务提供商，具有丰富的功能特性和灵活的部署选项。

### 🌟 核心特性

**🤖 多AI提供商支持**
- OpenAI (GPT-3.5, GPT-4, GPT-4o等)
- Azure OpenAI
- Anthropic Claude
- Google Gemini & Vertex AI
- xAI Grok
- Mistral AI
- Cohere
- Cloudflare Workers AI
- 以及更多兼容OpenAI API的服务

**🛠️ 强大功能**
- **函数调用**: 内置多种工具函数，支持通过环境变量添加自定义函数
- **图像生成**: 支持DALL-E、Google图像生成、Kling AI等
- **语音处理**: 支持TTS(文字转语音)和ASR(语音识别)
- **实时流式输出**: 优化的消息发送机制，几乎零延迟
- **智能模型切换**: 根据对话内容自动调整使用的AI模型
- **内联查询**: 支持Telegram内联消息功能
- **插件系统**: 可自定义插件，支持模板插值
- **MCP支持**: 集成Model Context Protocol

**💬 对话增强**
- **多语言支持**: 中文、英文、葡萄牙语等
- **自定义触发词**: 可配置机器人响应关键词
- **消息替换**: 支持自定义替换规则，简化环境变量修改
- **长文本处理**: 智能分割超长文本，支持Telegraph和文件输出
- **引用消息合并**: 自动处理回复消息
- **群组管理**: 智能群组响应，支持@提及检测

**🔧 管理功能**
- **多命令支持**: `/set`, `/settings`, `/history`, `/model`等
- **用户配置**: 个性化设置，支持多用户配置
- **白名单/黑名单**: 精细的访问控制
- **消息定时删除**: 自动清理不同类型的消息
- **使用统计**: 显示模型名称、使用时间等信息

### 🚀 部署方式

支持多种部署方式，满足不同需求：

#### Docker部署 (推荐)
```bash
# 使用Docker Compose
docker-compose up -d

# 或直接使用Docker
docker run -d \
  --name chatgpt-telegram-workers \
  -p 8787:8787 \
  -v ./config.json:/app/config.json:ro \
  -v ./wrangler.toml:/app/config.toml:ro \
  chatgpt-telegram-workers:latest
```

#### Cloudflare Workers
```bash
npm run build
npm run deploy:dist
```

#### Vercel
```bash
npm run build:vercel
npm run deploy:vercel
```

#### 本地开发
```bash
npm install
npm run start:local
```

### 📦 项目结构

```
src/
├── adapter/          # 适配器层 (Vercel, Local等)
├── agent/           # AI服务代理
│   ├── openai.ts    # OpenAI集成
│   ├── anthropic.ts # Anthropic集成
│   ├── google.ts    # Google AI集成
│   └── ...          # 其他AI服务
├── config/          # 配置管理
├── telegram/        # Telegram API处理
│   ├── handler/     # 消息处理器
│   ├── command/     # 命令处理
│   └── utils/       # 工具函数
├── tools/           # 工具函数系统
│   ├── internal/    # 内置工具
│   └── external/    # 外部工具配置
├── plugins/         # 插件系统
├── mcp/            # MCP协议支持
└── utils/          # 通用工具
```

### ⚙️ 配置说明

项目使用环境变量进行配置，支持以下配置方式：

1. **环境变量**: 直接设置环境变量
2. **config.json**: 本地配置文件
3. **wrangler.toml**: Cloudflare Workers配置

主要配置项：
- `TELEGRAM_AVAILABLE_TOKENS`: Telegram机器人令牌
- `OPENAI_API_KEY`: OpenAI API密钥
- `ANTHROPIC_API_KEY`: Anthropic API密钥
- `GOOGLE_API_KEY`: Google API密钥
- 更多配置请参考 [配置文档](./doc/cn/CONFIG.md)

### 🔍 技术栈

- **框架**: TypeScript + Vite
- **AI SDK**: [@ai-sdk](https://www.npmjs.com/package/ai) 统一AI接口
- **部署**: Cloudflare Workers / Vercel / Docker
- **API**: Telegram Bot API
- **工具**: ESLint, Vitest

### 📖 文档

- [配置说明](./doc/cn/CONFIG.md)
- [部署指南](./doc/cn/DEPLOY.md)
- [本地开发](./doc/cn/LOCAL.md)
- [平台部署](./doc/cn/PLATFORM.md)
- [更新日志](./doc/cn/CHANGELOG.md)

### ⚠️ 重要说明

- 由于使用AI SDK，CPU时间消耗较大，不适合Cloudflare Worker免费版（限制10ms）
- 推荐使用Docker部署，采用轮询模式
- Webhook模式最大运行时间60秒

### 🔄 主要修改内容

相较于原项目，本版本包含以下重大改进：

- **全面升级**: 除WorkerAI外全部切换为AI SDK
- **增强显示**: 增加模型名称、使用时间等信息显示
- **函数调用**: 内置多个函数，支持环境变量扩展
- **新增AI服务**: 添加Vertex AI等多个AI代理
- **自定义功能**: 支持自定义触发词和替换词
- **命令丰富**: 新增`/set`、`/settings`、`/history`等命令
- **图像生成**: 通过函数调用支持多种图像生成服务
- **渲染优化**: MarkdownV2实时渲染，代码块特殊优化
- **文本处理**: 超长文本智能分割和渲染
- **群组优化**: 自定义域名折叠，防止长文本干扰
- **媒体支持**: 多种媒体发送方式和TTS/ASR支持
- **流畅发送**: 优化消息发送机制，几乎零延迟
- **定时清理**: 支持不同类型消息的定时删除
- **多图支持**: 支持多张图片读取和处理
- **智能调整**: 智能模型切换和内联消息支持
- **搜索增强**: 支持GPT-4o-search等搜索模型
- **输出选择**: 支持Telegraph和文本文件输出
- **思考折叠**: 支持模型thinking内容折叠

### 🤝 贡献

欢迎提交Issue和Pull Request。在贡献代码前，请确保：

1. 代码符合项目规范 (`npm run lint`)
2. 通过所有测试 (`npm test`)
3. 更新相关文档

### 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

### 🙏 致谢

- 感谢原项目 [ChatGPT-Telegram-Workers](https://github.com/adolphnov/ChatGPT-Telegram-Workers) 提供的基础架构
- 感谢 [JetBrains](https://www.jetbrains.com/?from=tbxark) 提供的开源开发许可证
- 感谢所有贡献者的支持

### 🔗 相关项目

- [cloudflare-worker-adapter](https://github.com/TBXark/cloudflare-worker-adapter) - 简单的Cloudflare Worker适配器
- [telegram-bot-api-types](https://github.com/TBXark/telegram-bot-api-types) - Telegram Bot API SDK

---

**如果这个项目对你有帮助，请给个⭐️！**