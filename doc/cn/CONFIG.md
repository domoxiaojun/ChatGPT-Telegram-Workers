# 配置指南

本指南涵盖了ChatGPT Telegram Workers机器人的所有配置选项。推荐通过Workers配置界面设置环境变量，而不是直接修改JS代码中的变量。

## 📋 目录

- [快速设置](#快速设置)
- [存储配置](#存储配置)
- [系统配置](#系统配置)
- [AI提供商配置](#ai提供商配置)
- [用户配置](#用户配置)
- [命令](#命令)
- [高级功能](#高级功能)
- [故障排除](#故障排除)

## 🚀 快速设置

### 最小必需配置

快速开始只需要设置这些基本变量：

| 变量 | 描述 | 示例 |
|------|------|------|
| `TELEGRAM_AVAILABLE_TOKENS` | Telegram机器人令牌 | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `OPENAI_API_KEY` | OpenAI API密钥 | `sk-...` |

### 可选但推荐

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CHAT_WHITE_LIST` | 允许的用户/聊天ID | `''` (空=允许所有人) |
| `LANGUAGE` | 界面语言 | `zh-cn` |
| `AI_CHAT_PROVIDER` | 默认AI提供商 | `openai` |

## 🗄️ 存储配置

### KV数据库 (Cloudflare Workers)

| 变量 | 描述 |
|------|------|
| `DATABASE` | 创建KV命名空间并绑定为`DATABASE` |

### 替代数据库 (本地/Docker)

本地部署时在`config.json`中配置：

```json
{
  "database": {
    "type": "local",     // 选项: memory, local, sqlite, redis
    "path": "/app/data.json"
  }
}
```

## ⚙️ 系统配置

### 基础设置

| 变量 | 描述 | 默认值 | 类型 |
|------|------|--------|------|
| `LANGUAGE` | 界面语言 | `zh-cn` | `en`, `zh-cn`, `zh-hant`, `pt` |
| `UPDATE_BRANCH` | 更新检查分支 | `master` | string |
| `CHAT_COMPLETE_API_TIMEOUT` | API超时(秒) | `0` | number |
| `LOG_LEVEL` | 日志级别 | `info` | `debug`, `info`, `warn`, `error` |

### Telegram配置

| 变量 | 描述 | 默认值 | 说明 |
|------|------|--------|------|
| `TELEGRAM_API_DOMAIN` | Telegram API域名 | `https://api.telegram.org/` | 自定义端点 |
| `TELEGRAM_AVAILABLE_TOKENS` | 机器人令牌(逗号分隔) | `''` | **必需** |
| `TELEGRAM_BOT_NAME` | 机器人名称(逗号分隔) | `''` | 必须与令牌顺序匹配 |
| `DEFAULT_PARSE_MODE` | 消息解析模式 | `Markdown` | `Markdown`, `MarkdownV2`, `HTML` |
| `I_AM_A_GENEROUS_PERSON` | 允许所有人使用 | `false` | 设为`true`允许所有用户 |

### 访问控制

| 变量 | 描述 | 默认值 | 格式 |
|------|------|--------|------|
| `CHAT_WHITE_LIST` | 允许的用户/聊天ID | `''` | 逗号分隔的ID |
| `CHAT_GROUP_WHITE_LIST` | 允许的群组ID | `''` | 逗号分隔的ID |
| `GROUP_CHAT_BOT_ENABLE` | 启用群聊 | `true` | `true`/`false` |
| `GROUP_CHAT_BOT_SHARE_MODE` | 群组共享上下文 | `true` | `true`/`false` |
| `GROUP_INCLUDE_USERNAME` | 在群组消息中添加用户名前缀 | `false` | `true`/`false` |

> ⚠️ **重要**：将群组ID添加到`CHAT_GROUP_WHITE_LIST`以防止未授权使用。在大型群组(>2000成员)中设置机器人为管理员，并在BotFather中禁用隐私模式(`/setprivacy` → `Disable`)。

**群组用户名功能** (`GROUP_INCLUDE_USERNAME`):
启用后，群聊中的消息将带有发送者的标识前缀，帮助AI区分不同的发言者：
- 有用户名的用户：`@username: 消息内容`
- 无用户名的用户：`姓名: 消息内容` 或 `名字: 消息内容`

这在多人对话时特别有用，可以让AI清楚地知道是谁说了什么。

### 消息和历史设置

| 变量 | 描述 | 默认值 | 说明 |
|------|------|--------|------|
| `AUTO_TRIM_HISTORY` | 自动裁剪消息历史 | `true` | 防止4096字符限制 |
| `MAX_HISTORY_LENGTH` | 最大历史条目 | `12` | 每个用户 |
| `STREAM_MODE` | 启用流式输出 | `true` | 打字机效果 |
| `EXTRA_MESSAGE_CONTEXT` | 包含引用消息 | `false` | 从回复中添加上下文 |

## 🤖 AI提供商配置

### OpenAI

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `OPENAI_API_KEY` | API密钥(逗号分隔) | `''` |
| `OPENAI_CHAT_MODEL` | 聊天模型 | `gpt-4o-mini` |
| `OPENAI_API_BASE` | API基础URL | `https://api.openai.com/v1` |
| `OPENAI_API_EXTRA_PARAMS` | 额外参数 | `{}` |

### DALL-E (图像生成)

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `DALL_E_MODEL` | 模型名称 | `dall-e-2` |
| `DALL_E_IMAGE_SIZE` | 图像尺寸 | `512x512` |
| `DALL_E_IMAGE_QUALITY` | 图像质量 | `standard` |
| `DALL_E_IMAGE_STYLE` | 图像风格 | `vivid` |

### Azure OpenAI

| 变量 | 描述 | 格式 |
|------|------|------|
| `AZURE_API_KEY` | Azure API密钥 | String |
| `AZURE_RESOURCE_NAME` | 资源名称 | 从Azure门户获取 |
| `AZURE_CHAT_MODEL` | 部署名称 | 你的部署 |
| `AZURE_API_VERSION` | API版本 | `2024-06-01` |

### Anthropic Claude

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `ANTHROPIC_API_KEY` | API密钥 | `null` |
| `ANTHROPIC_API_BASE` | 基础URL | `https://api.anthropic.com/v1` |
| `ANTHROPIC_CHAT_MODEL` | 模型名称 | `claude-3-haiku-20240307` |

### Google Gemini

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `GOOGLE_API_KEY` | API密钥 | `null` |
| `GOOGLE_API_BASE` | 基础URL | `https://generativelanguage.googleapis.com/v1beta/models/` |
| `GOOGLE_CHAT_MODEL` | 模型名称 | `gemini-pro` |

### Google Vertex AI

| 变量 | 描述 | 说明 |
|------|------|------|
| `VERTEX_PROJECT_ID` | GCP项目ID | 必需 |
| `VERTEX_LOCATION` | 区域 | 例如：`us-central1` |
| `VERTEX_CREDENTIALS` | 服务账户JSON | Base64编码 |

### xAI Grok

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `XAI_API_KEY` | API密钥 | `null` |
| `XAI_API_BASE` | 基础URL | `https://api.x.ai/v1` |
| `XAI_CHAT_MODEL` | 模型名称 | `grok-beta` |

### Mistral AI

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `MISTRAL_API_KEY` | API密钥 | `null` |
| `MISTRAL_API_BASE` | 基础URL | `https://api.mistral.ai/v1` |
| `MISTRAL_CHAT_MODEL` | 模型名称 | `mistral-tiny` |

### Cohere

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `COHERE_API_KEY` | API密钥 | `null` |
| `COHERE_API_BASE` | 基础URL | `https://api.cohere.com/v1` |
| `COHERE_CHAT_MODEL` | 模型名称 | `command-r-plus` |

### Cloudflare Workers AI

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CLOUDFLARE_ACCOUNT_ID` | 账户ID | `null` |
| `CLOUDFLARE_TOKEN` | API令牌 | `null` |
| `WORKERS_CHAT_MODEL` | 聊天模型 | `@cf/mistral/mistral-7b-instruct-v0.1` |
| `WORKERS_IMAGE_MODEL` | 图像模型 | `@cf/stabilityai/stable-diffusion-xl-base-1.0` |

### OpenAI兼容服务

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `OPENAILIKE_API_KEY` | API密钥 | `null` |
| `OPENAILIKE_API_BASE` | 基础URL | `null` |
| `OPENAILIKE_CHAT_MODEL` | 模型名称 | `null` |

## 👤 用户配置

用户可以通过Telegram命令修改这些设置。使用`/setenv KEY=VALUE`设置单个值，或使用`/setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}`批量更新。

### 聊天配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `AI_CHAT_PROVIDER` | 当前AI提供商 | `openai` |
| `SYSTEM_INIT_MESSAGE` | 系统提示 | 根据语言自动选择 |
| `CHAT_MODEL` | 模型覆盖 | 提供商默认 |
| `MAX_HISTORY_LENGTH` | 历史长度 | `10` |
| `CHAT_TEMPERATURE` | 响应创造性 | `undefined` |
| `MAX_TOKENS` | 最大响应长度 | `undefined` |

### 高级聊天功能

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `USE_TOOLS` | 启用的工具 | `[]` |
| `USE_MCP` | 启用的MCP服务器 | `[]` |
| `TOOL_MODEL` | 工具调用模型 | `''` |
| `MAX_STEPS` | 最大工具步骤 | `3` |
| `MAX_RETRIES` | 最大重试次数 | `0` |
| `ENABLE_INTELLIGENT_MODEL` | 自动模型切换 | `false` |

### 媒体和语音

| 变量 | 描述 | 默认值 | 选项 |
|------|------|--------|------|
| `AI_IMAGE_PROVIDER` | 图像生成器 | `openai` | `openai`, `azure`, `workers`等 |
| `AI_TTS_PROVIDER` | 文字转语音 | `openai` | `openai`, `google`, `fish` |
| `AI_ASR_PROVIDER` | 语音识别 | `openai` | `openai`, `openailike` |
| `TEXT_HANDLE_TYPE` | 文本处理 | `text` | `text`, `tts`, `chat` |
| `TEXT_OUTPUT` | 文本输出格式 | `text` | `text`, `audio` |
| `AUDIO_HANDLE_TYPE` | 音频处理 | `stt` | `stt`, `audio`, `chat` |
| `AUDIO_OUTPUT` | 音频输出格式 | `text` | `text`, `audio` |

### 消息自定义

| 变量 | 描述 | 默认值 | 格式 |
|------|------|--------|------|
| `MESSAGE_REPLACER` | 文本替换 | `{}` | `{"旧": "新"}` |
| `PROMPT` | 自定义提示 | `{}` | `{"角色": "提示"}` |
| `MAPPING_KEY` | 命令快捷键 | 见下方 | 管道分隔 |
| `MAPPING_VALUE` | 快捷键值 | `''` | 管道分隔 |

默认`MAPPING_KEY`：
```
-p:SYSTEM_INIT_MESSAGE|-n:MAX_HISTORY_LENGTH|-a:AI_CHAT_PROVIDER|-ai:AI_IMAGE_PROVIDER|-m:CHAT_MODEL|-md:CURRENT_MODE|-v:VISION_MODEL|-t:OPENAI_TTS_MODEL|-ex:OPENAI_API_EXTRA_PARAMS|-mk:MAPPING_KEY|-mv:MAPPING_VALUE|-tm:TOOL_MODEL|-tool:USE_TOOLS|-oli:IMAGE_MODEL|-th:TEXT_HANDLE_TYPE|-to:TEXT_OUTPUT|-ah:AUDIO_HANDLE_TYPE|-ao:AUDIO_OUTPUT|-act:AUDIO_CONTAINS_TEXT|-as:AI_ASR_PROVIDER|-at:AI_TTS_PROVIDER|-ra:RERANK_AGENT|-ew:ENABLE_WORKFLOW|-tp:CHAT_TEMPERATURE
```

## 📋 命令

### 内置命令

| 命令 | 描述 | 用法 |
|------|------|------|
| `/help` | 显示帮助 | `/help` |
| `/new` | 开始新对话 | `/new` |
| `/start` | 获取用户ID并开始 | `/start` |
| `/img` | 生成图像 | `/img 美丽的日落` |
| `/version` | 检查版本 | `/version` |
| `/setenv` | 设置配置 | `/setenv AI_CHAT_PROVIDER=claude` |
| `/setenvs` | 批量设置配置 | `/setenvs {"CHAT_MODEL": "gpt-4"}` |
| `/delenv` | 删除配置 | `/delenv CHAT_MODEL` |
| `/system` | 显示系统信息 | `/system` |
| `/redo` | 重新生成响应 | `/redo` 或 `/redo 修改的提示` |
| `/set` | 快速设置 | `/set -a claude` |
| `/settings` | 显示当前设置 | `/settings` |
| `/history` | 显示聊天历史 | `/history` |
| `/model` | 显示/更改模型 | `/model` |

### 自定义命令

通过设置前缀为`CUSTOM_COMMAND_`的环境变量创建快捷方式：

```bash
# 环境变量
CUSTOM_COMMAND_azure='/setenvs {"AI_CHAT_PROVIDER": "azure"}'
CUSTOM_COMMAND_gpt4='/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-4"}'
CUSTOM_COMMAND_cn2en='/setenvs {"SYSTEM_INIT_MESSAGE": "你是一个翻译器。将所有内容翻译成英文。"}'

# 添加描述
COMMAND_DESCRIPTION_azure='切换到Azure OpenAI'
COMMAND_DESCRIPTION_gpt4='切换到GPT-4'
COMMAND_DESCRIPTION_cn2en='中文到英文翻译器'

# 设置命令范围
COMMAND_SCOPE_azure='all_private_chats,all_group_chats'
```

## 🔧 高级功能

### 函数调用和工具

配置工具以增强AI功能：

```bash
# 启用内置工具
USE_TOOLS='["web_search", "image_generation", "weather"]'

# 工具的外部API密钥
PLUGIN_ENV_JINA_API_KEY='your_jina_key'
PLUGIN_ENV_QWEATHER_TOKEN='your_weather_token'
```

### 自定义工具

使用环境变量创建自定义工具：

```bash
# 工具定义
PLUGIN_FUNCTION_weather='{
  "name": "weather",
  "description": "获取天气信息",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {"type": "string", "description": "城市名称"}
    }
  }
}'

# 工具环境变量
PLUGIN_ENV_WEATHER_API_KEY='your_api_key'
```

### MCP (模型上下文协议)

配置MCP服务器以扩展功能：

```bash
# 基于SSE的MCP服务器
MCP_example='{
  "type": "sse",
  "url": "https://api.example.com/mcp",
  "headers": {"Authorization": "Bearer your_token"}
}'

# HTTP MCP服务器（支持自定义请求头）
MCP_http='{
  "type": "http",
  "url": "https://api.example.com/mcp",
  "headers": {"Authorization": "Bearer your_token", "X-Custom-Header": "value"}
}'

# 本地进程MCP
MCP_local='{
  "type": "stdio",
  "command": "node",
  "args": ["server.js"],
  "cwd": "/path/to/mcp/server"
}'
```

**MCP Transport 类型：**
- **SSE (Server-Sent Events)**: 使用单向事件流，适合服务器推送场景
- **HTTP (Streamable HTTP)**: 使用 POST 发送消息、GET+SSE 接收消息，支持自定义请求头
- **stdio**: 本地进程通信，适合本地部署的 MCP 服务器

### 消息处理

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CHAT_TRIGGER_PREFIX` | 机器人触发词 | `''` |
| `IGNORE_TEXT_PREFIX` | 忽略的前缀 | `[]` |
| `TELEGRAM_MIN_STREAM_INTERVAL` | 流延迟(毫秒) | `0` |
| `ADD_QUOTE_LIMIT` | 自动引用阈值 | `-1` |
| `TELEGRAPH_NUM_LIMIT` | Telegraph阈值 | `-1` |
| `EXPIRED_TIME` | 消息过期时间(分钟) | `-1` |

### 显示选项

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `ENABLE_SHOWINFO` | 显示模型信息 | `false` |
| `SHOW_PARTS` | 显示的信息部分 | `['model', 'model_time', 'token']` |
| `CALL_INFO` | 显示API调用信息 | `true` |
| `DISABLE_WEB_PREVIEW` | 禁用链接预览 | `false` |
| `SHOW_THINKING_TEXT` | 显示 AI 推理思考过程 | `true` |
| `EXPANDABLE_THINKING` | 使用可折叠引用块显示思考文本 | `true` |
| `SEND_IMAGE_AS_FILE` | 以文件形式发送图像 | `false` |

### 调度和清理

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `CRON_CHECK_TIME` | 清理计划 | `''` |
| `SCHEDULE_GROUP_DELETE_TYPE` | 群组清理类型 | `['tip']` |
| `SCHEDULE_PRIVATE_DELETE_TYPE` | 私聊清理类型 | `['tip']` |

## 🔒 安全和配置锁定

### 锁定的配置键

为防止令牌泄露，某些键默认被锁定：

```bash
LOCK_USER_CONFIG_KEYS='OPENAI_API_BASE,GOOGLE_API_BASE,MISTRAL_API_BASE,COHERE_API_BASE,ANTHROPIC_API_BASE,AZURE_COMPLETIONS_API,AZURE_DALLE_API'
```

如果遇到"Key XXX is locked"错误，请从此列表中删除该键以解锁。

## 🐛 故障排除

### 常见问题

1. **机器人在群组中不响应**：
   - 将群组ID添加到`CHAT_GROUP_WHITE_LIST`
   - 如果群组>2000成员，设置机器人为管理员
   - 禁用隐私模式：在BotFather中`/setprivacy` → `Disable`

2. **键锁定错误**：
   - 从`LOCK_USER_CONFIG_KEYS`中删除键
   - 或使用系统配置而不是用户配置

3. **API超时**：
   - 增加`CHAT_COMPLETE_API_TIMEOUT`
   - 检查网络连接
   - 验证API密钥和端点

4. **Cloudflare Workers上CPU使用率高**：
   - 改用Docker部署
   - 减少`MAX_HISTORY_LENGTH`
   - 禁用不必要的功能

### 调试模式

启用调试以进行故障排除：

```bash
DEBUG_MODE=true
DEV_MODE=true
LOG_LEVEL=debug
```

### 获取帮助

1. 检查 [GitHub Issues](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/issues)
2. 查看 [部署指南](DEPLOY.md)
3. 加入我们的社区讨论

---

## 📝 配置示例

### 基础设置
```bash
TELEGRAM_AVAILABLE_TOKENS='123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
OPENAI_API_KEY='sk-...'
LANGUAGE='zh-cn'
CHAT_WHITE_LIST='12345678,87654321'
```

### 多提供商设置
```bash
# 多个AI提供商
OPENAI_API_KEY='sk-openai-key'
ANTHROPIC_API_KEY='sk-ant-key'
GOOGLE_API_KEY='google-key'

# 用户可以用 /setenv AI_CHAT_PROVIDER=claude 切换
```

### 高级功能
```bash
# 启用工具和MCP
USE_TOOLS='["web_search", "image_generation"]'
USE_MCP='["weather_server"]'
ENABLE_INTELLIGENT_MODEL=true

# 自定义快捷键
MAPPING_VALUE='gpt4:gpt-4o|claude:claude-3-5-sonnet-20240620|mini:gpt-4o-mini'
```

更多示例和用例，请参见[部署文档](DEPLOY.md)。