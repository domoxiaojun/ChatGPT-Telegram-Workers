# ChatGPT Telegram Workers

[![Build and Push Docker Image](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/actions/workflows/build-docker.yml/badge.svg)](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/actions/workflows/build-docker.yml)

<p align="center">
    <br> English | <a href="README_CN.md">中文</a>
</p>

<p align="center">
    <em>A powerful multi-AI provider Telegram bot with flexible deployment options</em>
</p>

## 📚 Overview

This is a significantly refactored ChatGPT Telegram bot project that supports multiple AI service providers, rich features, and flexible deployment options.

### 🌟 Key Features

**🤖 Multi-AI Provider Support**
- OpenAI (GPT-3.5, GPT-4, GPT-4o, etc.)
- Azure OpenAI
- Anthropic Claude
- Google Gemini & Vertex AI
- xAI Grok
- Mistral AI
- Cohere
- Cloudflare Workers AI
- And more OpenAI-compatible services

**🛠️ Powerful Capabilities**
- **Function Calling**: Built-in tool functions with support for custom functions via environment variables
- **Image Generation**: Support for DALL-E, Google Image Generation, Kling AI, etc.
- **Voice Processing**: TTS (Text-to-Speech) and ASR (Speech Recognition) support
- **Real-time Streaming**: Optimized message sending with near-zero latency
- **Intelligent Model Switching**: Automatically adjust AI models based on conversation context
- **Inline Queries**: Support for Telegram inline message functionality
- **Plugin System**: Customizable plugins with template interpolation
- **MCP Support**: Model Context Protocol integration

**💬 Chat Enhancements**
- **Multi-language Support**: Chinese, English, Portuguese, etc.
- **Custom Trigger Words**: Configurable bot response keywords
- **Message Replacement**: Custom replacement rules to simplify environment variable management
- **Long Text Processing**: Smart splitting of ultra-long text with Telegraph and file output support
- **Quote Message Merging**: Automatic handling of reply messages
- **Group Management**: Smart group responses with @mention detection

**🔧 Management Features**
- **Multiple Commands**: `/set`, `/settings`, `/history`, `/model`, etc.
- **User Configuration**: Personalized settings with multi-user support
- **Whitelist/Blacklist**: Fine-grained access control
- **Scheduled Message Deletion**: Automatic cleanup of different message types
- **Usage Statistics**: Display model names, usage time, and other information

### 🚀 Deployment Options

Multiple deployment methods to suit different needs:

#### Docker Deployment (Recommended)
```bash
# Using Docker Compose
docker-compose up -d

# Or directly with Docker
docker run -d \
  --name chatgpt-telegram-workers \
  -p 8787:8787 \
  -v ./config.json:/app/config.json:ro \
  -v ./wrangler.toml:/app/config.toml:ro \
  szemeng76/chatgpt-telegram-workers:latest
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

#### Local Development
```bash
npm install
npm run start:local
```

### 📦 Project Structure

```
src/
├── adapter/          # Adapter layer (Vercel, Local, etc.)
├── agent/           # AI service agents
│   ├── openai.ts    # OpenAI integration
│   ├── anthropic.ts # Anthropic integration
│   ├── google.ts    # Google AI integration
│   └── ...          # Other AI services
├── config/          # Configuration management
├── telegram/        # Telegram API handling
│   ├── handler/     # Message handlers
│   ├── command/     # Command processing
│   └── utils/       # Utility functions
├── tools/           # Tool function system
│   ├── internal/    # Built-in tools
│   └── external/    # External tool configurations
├── plugins/         # Plugin system
├── mcp/            # MCP protocol support
└── utils/          # Common utilities
```

### ⚙️ Configuration

The project uses environment variables for configuration, supporting multiple configuration methods:

1. **Environment Variables**: Direct environment variable settings
2. **config.json**: Local configuration file
3. **wrangler.toml**: Cloudflare Workers configuration

Key configuration options:
- `TELEGRAM_AVAILABLE_TOKENS`: Telegram bot tokens
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `GOOGLE_API_KEY`: Google API key
- For more configurations, see [Configuration Documentation](./doc/en/CONFIG.md)

### 🔍 Tech Stack

- **Framework**: TypeScript + Vite
- **AI SDK**: [@ai-sdk](https://www.npmjs.com/package/ai) for unified AI interfaces
- **Deployment**: Cloudflare Workers / Vercel / Docker
- **API**: Telegram Bot API
- **Tools**: ESLint, Vitest

### 📖 Documentation

- [Configuration Guide](./doc/en/CONFIG.md)
- [Deployment Guide](./doc/en/DEPLOY.md)
- [Local Development](./doc/en/LOCAL.md)
- [Platform Deployment](./doc/en/PLATFORM.md)
- [Changelog](./doc/en/CHANGELOG.md)

### ⚠️ Important Notes

- Due to the use of AI SDK, CPU time consumption is high, not suitable for Cloudflare Worker free tier (10ms limit)
- Docker deployment with polling mode is recommended
- Webhook mode has a maximum runtime of 60 seconds

### 🤝 Contributing

Issues and Pull Requests are welcome. Before contributing code, please ensure:

1. Code follows project standards (`npm run lint`)
2. All tests pass (`npm test`)
3. Update relevant documentation

### 📄 License

This project is open-sourced under the [MIT License](LICENSE).

### 🙏 Acknowledgments

- Thanks to the original [ChatGPT-Telegram-Workers](https://github.com/adolphnov/ChatGPT-Telegram-Workers) project for the foundational architecture
- Thanks to [JetBrains](https://www.jetbrains.com/?from=tbxark) for providing open-source development licenses
- Thanks to all contributors for their support

---

**If this project helps you, please give it a ⭐️!**