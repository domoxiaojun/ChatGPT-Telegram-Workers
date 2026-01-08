# Configuration Guide

This guide covers all configuration options for the ChatGPT Telegram Workers bot. It's recommended to set environment variables through the Workers configuration interface rather than modifying the JS code directly.

## 📋 Table of Contents

- [Quick Setup](#quick-setup)
- [Storage Configuration](#storage-configuration)
- [System Configuration](#system-configuration)
- [AI Provider Configuration](#ai-provider-configuration)
- [User Configuration](#user-configuration)
- [Commands](#commands)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Setup

### Minimum Required Configuration

To get started quickly, you only need to set these essential variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `TELEGRAM_AVAILABLE_TOKENS` | Your Telegram bot token(s) | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `OPENAI_API_KEY` | Your OpenAI API key(s) | `sk-...` |

### Optional but Recommended

| Variable | Description | Default |
|----------|-------------|---------|
| `CHAT_WHITE_LIST` | Allowed user/chat IDs | `''` (empty = allow all) |
| `LANGUAGE` | Interface language | `zh-cn` |
| `AI_CHAT_PROVIDER` | Default AI provider | `openai` |

## 🗄️ Storage Configuration

### KV Database (Cloudflare Workers)

| Variable | Description |
|----------|-------------|
| `DATABASE` | Create a KV namespace and bind it with name `DATABASE` |

### Alternative Databases (Local/Docker)

For local deployment, configure in `config.json`:

```json
{
  "database": {
    "type": "local",     // Options: memory, local, sqlite, redis
    "path": "/app/data.json"
  }
}
```

## ⚙️ System Configuration

### Basic Settings

| Variable | Description | Default | Type |
|----------|-------------|---------|------|
| `LANGUAGE` | Interface language | `zh-cn` | `en`, `zh-cn`, `zh-hant`, `pt` |
| `UPDATE_BRANCH` | Update check branch | `master` | string |
| `CHAT_COMPLETE_API_TIMEOUT` | API timeout (seconds) | `0` | number |
| `LOG_LEVEL` | Logging level | `info` | `debug`, `info`, `warn`, `error` |

### Telegram Configuration

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `TELEGRAM_API_DOMAIN` | Telegram API domain | `https://api.telegram.org/` | For custom endpoints |
| `TELEGRAM_AVAILABLE_TOKENS` | Bot tokens (comma-separated) | `''` | **Required** |
| `TELEGRAM_BOT_NAME` | Bot names (comma-separated) | `''` | Must match token order |
| `DEFAULT_PARSE_MODE` | Message parsing mode | `Markdown` | `Markdown`, `MarkdownV2`, `HTML` |
| `I_AM_A_GENEROUS_PERSON` | Allow everyone to use | `false` | Set `true` to allow all users |

### Access Control

| Variable | Description | Default | Format |
|----------|-------------|---------|--------|
| `CHAT_WHITE_LIST` | Allowed user/chat IDs | `''` | Comma-separated IDs |
| `CHAT_GROUP_WHITE_LIST` | Allowed group IDs | `''` | Comma-separated IDs |
| `GROUP_CHAT_BOT_ENABLE` | Enable group chat | `true` | `true`/`false` |
| `GROUP_CHAT_BOT_SHARE_MODE` | Share context in groups | `true` | `true`/`false` |
| `GROUP_INCLUDE_USERNAME` | Add username prefix to group messages | `false` | `true`/`false` |

> ⚠️ **Important**: Add group IDs to `CHAT_GROUP_WHITE_LIST` to prevent unauthorized usage. Set bot as admin in large groups (>2000 members) and disable privacy mode in BotFather (`/setprivacy` → `Disable`).

**Group Username Feature** (`GROUP_INCLUDE_USERNAME`):
When enabled, messages in group chats will be prefixed with the sender's identifier to help AI distinguish between different speakers:
- Users with username: `@username: message`
- Users without username: `First Last: message` or `First: message`

This is particularly useful when multiple people are having a conversation and the AI needs to track who said what.

### Message & History Settings

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `AUTO_TRIM_HISTORY` | Auto-trim message history | `true` | Prevents 4096 char limit |
| `MAX_HISTORY_LENGTH` | Max history entries | `12` | Per user |
| `STREAM_MODE` | Enable streaming output | `true` | Typewriter effect |
| `EXTRA_MESSAGE_CONTEXT` | Include quoted messages | `false` | Adds context from replies |

## 🤖 AI Provider Configuration

### OpenAI

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | API keys (comma-separated) | `''` |
| `OPENAI_CHAT_MODEL` | Chat model | `gpt-4o-mini` |
| `OPENAI_API_BASE` | API base URL | `https://api.openai.com/v1` |
| `OPENAI_API_EXTRA_PARAMS` | Extra parameters | `{}` |

### DALL-E (Image Generation)

| Variable | Description | Default |
|----------|-------------|---------|
| `DALL_E_MODEL` | Model name | `dall-e-2` |
| `DALL_E_IMAGE_SIZE` | Image size | `512x512` |
| `DALL_E_IMAGE_QUALITY` | Image quality | `standard` |
| `DALL_E_IMAGE_STYLE` | Image style | `vivid` |

### Azure OpenAI

| Variable | Description | Format |
|----------|-------------|--------|
| `AZURE_API_KEY` | Azure API key | String |
| `AZURE_RESOURCE_NAME` | Resource name | From Azure portal |
| `AZURE_CHAT_MODEL` | Deployment name | Your deployment |
| `AZURE_API_VERSION` | API version | `2024-06-01` |

### Anthropic Claude

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | API key | `null` |
| `ANTHROPIC_API_BASE` | Base URL | `https://api.anthropic.com/v1` |
| `ANTHROPIC_CHAT_MODEL` | Model name | `claude-3-haiku-20240307` |

### Google Gemini

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | API key | `null` |
| `GOOGLE_API_BASE` | Base URL | `https://generativelanguage.googleapis.com/v1beta/models/` |
| `GOOGLE_CHAT_MODEL` | Model name | `gemini-pro` |

### Google Vertex AI

| Variable | Description | Notes |
|----------|-------------|-------|
| `VERTEX_PROJECT_ID` | GCP project ID | Required |
| `VERTEX_LOCATION` | Region | e.g., `us-central1` |
| `VERTEX_CREDENTIALS` | Service account JSON | Base64 encoded |

### xAI Grok

| Variable | Description | Default |
|----------|-------------|---------|
| `XAI_API_KEY` | API key | `null` |
| `XAI_API_BASE` | Base URL | `https://api.x.ai/v1` |
| `XAI_CHAT_MODEL` | Model name | `grok-beta` |

### Mistral AI

| Variable | Description | Default |
|----------|-------------|---------|
| `MISTRAL_API_KEY` | API key | `null` |
| `MISTRAL_API_BASE` | Base URL | `https://api.mistral.ai/v1` |
| `MISTRAL_CHAT_MODEL` | Model name | `mistral-tiny` |

### Cohere

| Variable | Description | Default |
|----------|-------------|---------|
| `COHERE_API_KEY` | API key | `null` |
| `COHERE_API_BASE` | Base URL | `https://api.cohere.com/v1` |
| `COHERE_CHAT_MODEL` | Model name | `command-r-plus` |

### Cloudflare Workers AI

| Variable | Description | Default |
|----------|-------------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Account ID | `null` |
| `CLOUDFLARE_TOKEN` | API token | `null` |
| `WORKERS_CHAT_MODEL` | Chat model | `@cf/mistral/mistral-7b-instruct-v0.1` |
| `WORKERS_IMAGE_MODEL` | Image model | `@cf/stabilityai/stable-diffusion-xl-base-1.0` |

### OpenAI-Compatible Services

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAILIKE_API_KEY` | API key | `null` |
| `OPENAILIKE_API_BASE` | Base URL | `null` |
| `OPENAILIKE_CHAT_MODEL` | Model name | `null` |

## 👤 User Configuration

Users can modify these settings via Telegram commands. Use `/setenv KEY=VALUE` to set individual values or `/setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}` for batch updates.

### Chat Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `AI_CHAT_PROVIDER` | Current AI provider | `openai` |
| `SYSTEM_INIT_MESSAGE` | System prompt | Auto-selected by language |
| `CHAT_MODEL` | Model override | Provider default |
| `MAX_HISTORY_LENGTH` | History length | `10` |
| `CHAT_TEMPERATURE` | Response creativity | `undefined` |
| `MAX_TOKENS` | Max response length | `undefined` |

### Advanced Chat Features

| Variable | Description | Default |
|----------|-------------|---------|
| `USE_TOOLS` | Enabled tools | `[]` |
| `USE_MCP` | Enabled MCP servers | `[]` |
| `TOOL_MODEL` | Model for tool calls | `''` |
| `MAX_STEPS` | Max tool steps | `3` |
| `MAX_RETRIES` | Max retries | `0` |
| `ENABLE_INTELLIGENT_MODEL` | Auto model switching | `false` |

### Media & Voice

| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `AI_IMAGE_PROVIDER` | Image generator | `openai` | `openai`, `azure`, `workers`, etc. |
| `AI_TTS_PROVIDER` | Text-to-speech | `openai` | `openai`, `google`, `fish` |
| `AI_ASR_PROVIDER` | Speech recognition | `openai` | `openai`, `openailike` |
| `TEXT_HANDLE_TYPE` | Text processing | `text` | `text`, `tts`, `chat` |
| `TEXT_OUTPUT` | Text output format | `text` | `text`, `audio` |
| `AUDIO_HANDLE_TYPE` | Audio processing | `stt` | `stt`, `audio`, `chat` |
| `AUDIO_OUTPUT` | Audio output format | `text` | `text`, `audio` |

### Message Customization

| Variable | Description | Default | Format |
|----------|-------------|---------|--------|
| `MESSAGE_REPLACER` | Text replacements | `{}` | `{"old": "new"}` |
| `PROMPT` | Custom prompts | `{}` | `{"role": "prompt"}` |
| `MAPPING_KEY` | Command shortcuts | See below | Pipe-separated |
| `MAPPING_VALUE` | Shortcut values | `''` | Pipe-separated |

Default `MAPPING_KEY`:
```
-p:SYSTEM_INIT_MESSAGE|-n:MAX_HISTORY_LENGTH|-a:AI_CHAT_PROVIDER|-ai:AI_IMAGE_PROVIDER|-m:CHAT_MODEL|-md:CURRENT_MODE|-v:VISION_MODEL|-t:OPENAI_TTS_MODEL|-ex:OPENAI_API_EXTRA_PARAMS|-mk:MAPPING_KEY|-mv:MAPPING_VALUE|-tm:TOOL_MODEL|-tool:USE_TOOLS|-oli:IMAGE_MODEL|-th:TEXT_HANDLE_TYPE|-to:TEXT_OUTPUT|-ah:AUDIO_HANDLE_TYPE|-ao:AUDIO_OUTPUT|-act:AUDIO_CONTAINS_TEXT|-as:AI_ASR_PROVIDER|-at:AI_TTS_PROVIDER|-ra:RERANK_AGENT|-ew:ENABLE_WORKFLOW|-tp:CHAT_TEMPERATURE
```

## 📋 Commands

### Built-in Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/help` | Show help | `/help` |
| `/new` | Start new conversation | `/new` |
| `/start` | Get user ID and start | `/start` |
| `/img` | Generate image | `/img A beautiful sunset` |
| `/version` | Check version | `/version` |
| `/setenv` | Set configuration | `/setenv AI_CHAT_PROVIDER=claude` |
| `/setenvs` | Batch set config | `/setenvs {"CHAT_MODEL": "gpt-4"}` |
| `/delenv` | Delete configuration | `/delenv CHAT_MODEL` |
| `/system` | Show system info | `/system` |
| `/redo` | Regenerate response | `/redo` or `/redo Modified prompt` |
| `/set` | Quick settings | `/set -a claude` |
| `/settings` | Show current settings | `/settings` |
| `/history` | Show chat history | `/history` |
| `/model` | Show/change model | `/model` |

### Custom Commands

Create shortcuts by setting environment variables with prefix `CUSTOM_COMMAND_`:

```bash
# Environment Variables
CUSTOM_COMMAND_azure='/setenvs {"AI_CHAT_PROVIDER": "azure"}'
CUSTOM_COMMAND_gpt4='/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-4"}'
CUSTOM_COMMAND_cn2en='/setenvs {"SYSTEM_INIT_MESSAGE": "You are a translator. Translate everything to English."}'

# Add descriptions
COMMAND_DESCRIPTION_azure='Switch to Azure OpenAI'
COMMAND_DESCRIPTION_gpt4='Switch to GPT-4'
COMMAND_DESCRIPTION_cn2en='Chinese to English translator'

# Set command scope
COMMAND_SCOPE_azure='all_private_chats,all_group_chats'
```

## 🔧 Advanced Features

### Function Calling & Tools

Configure tools for enhanced AI capabilities:

```bash
# Enable built-in tools
USE_TOOLS='["web_search", "image_generation", "weather"]'

# External API keys for tools
PLUGIN_ENV_JINA_API_KEY='your_jina_key'
PLUGIN_ENV_QWEATHER_TOKEN='your_weather_token'
```

### Custom Tools

Create custom tools with environment variables:

```bash
# Tool definition
PLUGIN_FUNCTION_weather='{
  "name": "weather",
  "description": "Get weather information",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {"type": "string", "description": "City name"}
    }
  }
}'

# Tool environment variables
PLUGIN_ENV_WEATHER_API_KEY='your_api_key'
```

### MCP (Model Context Protocol)

Configure MCP servers for extended capabilities:

```bash
# SSE-based MCP server
MCP_example='{
  "type": "sse",
  "url": "https://api.example.com/mcp",
  "headers": {"Authorization": "Bearer your_token"}
}'

# HTTP MCP server (supports custom headers)
MCP_http='{
  "type": "http",
  "url": "https://api.example.com/mcp",
  "headers": {"Authorization": "Bearer your_token", "X-Custom-Header": "value"}
}'

# Local process MCP
MCP_local='{
  "type": "stdio",
  "command": "node",
  "args": ["server.js"],
  "cwd": "/path/to/mcp/server"
}'
```

**MCP Transport Types:**
- **SSE (Server-Sent Events)**: Uses one-way event stream, suitable for server push scenarios
- **HTTP (Streamable HTTP)**: Uses POST for sending messages and GET+SSE for receiving, supports custom headers
- **stdio**: Local process communication, suitable for locally deployed MCP servers

### Message Processing

| Variable | Description | Default |
|----------|-------------|---------|
| `CHAT_TRIGGER_PREFIX` | Trigger word for bot | `''` |
| `IGNORE_TEXT_PREFIX` | Prefixes to ignore | `[]` |
| `TELEGRAM_MIN_STREAM_INTERVAL` | Stream delay (ms) | `0` |
| `ADD_QUOTE_LIMIT` | Auto-quote threshold | `-1` |
| `TELEGRAPH_NUM_LIMIT` | Telegraph threshold | `-1` |
| `EXPIRED_TIME` | Message expiry (minutes) | `-1` |

### Display Options

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_SHOWINFO` | Show model info | `false` |
| `SHOW_PARTS` | Info sections to show | `['model', 'model_time', 'token']` |
| `CALL_INFO` | Show API call info | `true` |
| `DISABLE_WEB_PREVIEW` | Disable link previews | `false` |
| `SHOW_THINKING_TEXT` | Display AI reasoning process | `true` |
| `EXPANDABLE_THINKING` | Use collapsible blockquote for thinking | `true` |
| `SEND_IMAGE_AS_FILE` | Send images as files | `false` |

### Scheduling & Cleanup

| Variable | Description | Default |
|----------|-------------|---------|
| `CRON_CHECK_TIME` | Cleanup schedule | `''` |
| `SCHEDULE_GROUP_DELETE_TYPE` | Group cleanup types | `['tip']` |
| `SCHEDULE_PRIVATE_DELETE_TYPE` | Private cleanup types | `['tip']` |

## 🔒 Security & Configuration Lock

### Locked Configuration Keys

To prevent token leakage, certain keys are locked by default:

```bash
LOCK_USER_CONFIG_KEYS='OPENAI_API_BASE,GOOGLE_API_BASE,MISTRAL_API_BASE,COHERE_API_BASE,ANTHROPIC_API_BASE,AZURE_COMPLETIONS_API,AZURE_DALLE_API'
```

If you encounter "Key XXX is locked" errors, remove the key from this list to unlock it.

## 🐛 Troubleshooting

### Common Issues

1. **Bot not responding in groups**:
   - Add group ID to `CHAT_GROUP_WHITE_LIST`
   - Set bot as admin if group >2000 members
   - Disable privacy mode: `/setprivacy` → `Disable` in BotFather

2. **Key locked error**:
   - Remove key from `LOCK_USER_CONFIG_KEYS`
   - Or use system configuration instead of user configuration

3. **API timeout**:
   - Increase `CHAT_COMPLETE_API_TIMEOUT`
   - Check network connectivity
   - Verify API keys and endpoints

4. **High CPU usage on Cloudflare Workers**:
   - Use Docker deployment instead
   - Reduce `MAX_HISTORY_LENGTH`
   - Disable unnecessary features

### Debug Mode

Enable debugging for troubleshooting:

```bash
DEBUG_MODE=true
DEV_MODE=true
LOG_LEVEL=debug
```

### Getting Help

1. Check [GitHub Issues](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/issues)
2. Review [Deployment Guide](DEPLOY.md)
3. Join our community discussions

---

## 📝 Configuration Examples

### Basic Setup
```bash
TELEGRAM_AVAILABLE_TOKENS='123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
OPENAI_API_KEY='sk-...'
LANGUAGE='en'
CHAT_WHITE_LIST='12345678,87654321'
```

### Multi-Provider Setup
```bash
# Multiple AI providers
OPENAI_API_KEY='sk-openai-key'
ANTHROPIC_API_KEY='sk-ant-key'
GOOGLE_API_KEY='google-key'

# User can switch with /setenv AI_CHAT_PROVIDER=claude
```

### Advanced Features
```bash
# Enable tools and MCP
USE_TOOLS='["web_search", "image_generation"]'
USE_MCP='["weather_server"]'
ENABLE_INTELLIGENT_MODEL=true

# Custom shortcuts
MAPPING_VALUE='gpt4:gpt-4o|claude:claude-3-5-sonnet-20240620|mini:gpt-4o-mini'
```

For more examples and use cases, see the [deployment documentation](DEPLOY.md).