# 配置

推荐在Workers配置界面填写环境变量， 而不是直接修改js代码中的变量

## KV配置

| KEY      | 特殊说明                                                     |
|:---------|----------------------------------------------------------|
| DATABASE | 先新建KV，新建的时候名字随意，然后绑定的时候必须设定为DATABASE |

## 系统配置

为每个用户通用的配置，只能在Workers配置界面或者toml中配置填写，不支持通过Telegram发送消息来修改。

> `array string`: 数组为空字符串，表示没有设置值，如果需要设置值，设置为`'value1,value2'`，多个值用逗号分隔。

### 基础配置

| KEY                       | 名称            | 默认值   | 描述                    |
|---------------------------|---------------|----------|-----------------------|
| LANGUAGE                  | 语言            | `zh-cn`  | 设置语言                |
| UPDATE_BRANCH             | 更新分支        | `master` | 检查更新的分支          |
| CHAT_COMPLETE_API_TIMEOUT | 聊天完成API超时 | `0`      | AI对话API的超时时间（秒） |

### Telegram配置

| KEY                          | 名称               | 默认值                      | 描述                                                    |
|------------------------------|------------------|-----------------------------|-------------------------------------------------------|
| TELEGRAM_API_DOMAIN          | Telegram API域名   | `https://api.telegram.org/` | Telegram API的域名                                      |
| TELEGRAM_AVAILABLE_TOKENS    | 可用的Telegram令牌 | `''`(array string)          | 允许访问的Telegram Token，设置时以逗号分隔               |
| DEFAULT_PARSE_MODE           | 默认解析模式       | `Markdown`                  | 默认消息解析模式                                        |
| I_AM_A_GENEROUS_PERSON       | 允许所有人使用     | `false`                     | 是否允许所有人使用                                      |
| CHAT_WHITE_LIST              | 聊天白名单         | `''`(array string)          | 允许使用的聊天ID白名单                                  |
| LOCK_USER_CONFIG_KEYS        | 锁定的用户配置键   | 默认值为所有API的URL        | 防止被替换导致token泄露的配置键                         |
| TELEGRAM_BOT_NAME            | Telegram机器人名称 | `''`(array string)          | 允许访问的Telegram Token对应的Bot Name，设置时以逗号分隔 |
| CHAT_GROUP_WHITE_LIST        | 群组白名单         | `''`(array string)          | 允许使用的群组ID白名单                                  |
| GROUP_CHAT_BOT_ENABLE        | 群组机器人开关     | `true`                      | 是否启用群组机器人                                      |
| GROUP_CHAT_BOT_SHARE_MODE    | 群组机器人共享模式 | `true`                      | 开启后同个群组的人使用同一个聊天上下文                  |
| CHAT_TOTAL_DURATION_LIMIT    | 聊天总时长限制     | `30 * 60`                   | 聊天总时长限制， 单位：秒                                 |
| TELEGRAM_MIN_STREAM_INTERVAL | 最小流间隔         | `0`                         | 最小流间隔， 单位：毫秒                                   |
| TELEGRAM_PHOTO_SIZE_OFFSET   | 图片尺寸偏移       | `-2`                        | 图片尺寸偏移， 单位：像素                                 |
| TELEGRAM_IMAGE_TRANSFER_MODE | 图片传输模式       | `url`                       | 图片传输模式， 可选值：`url, base64`                      |


> IMPORTANT: 必须把群ID加到白名单`CHAT_GROUP_WHITE_LIST`才能使用, 否则任何人都可以把你的机器人加到群组中，然后消耗你的配额。

> IMPORTANT: 受限TG的隐私安全策略，如果你的群组是公开群组或超过2000人，请将机器人设置为`管理员`，否则机器人无法响应`@机器人`的聊天消息。

> IMPORTANT: 必须在botfather中设置`/setprivacy`为`Disable`，否则机器人无法响应`@机器人`的聊天消息。

#### 锁定配置 `LOCK_USER_CONFIG_KEYS`

> IMPORTANT: 如果你遇到`Key XXX is locked`的错误，说明你的配置被锁定了，需要解锁才能修改。

`LOCK_USER_CONFIG_KEYS`的默认值为所有API的BASE URL。为了防止用户替换API BASE URL导致token泄露，所以默认情况下会锁定所有API的BASE URL。如果你想解锁某个API的BASE URL，可以将其从`LOCK_USER_CONFIG_KEYS`中删除。
`LOCK_USER_CONFIG_KEYS`是一个字符串数组，默认值为：

```
OPENAI_API_BASE,GOOGLE_API_BASE,MISTRAL_API_BASE,COHERE_API_BASE,ANTHROPIC_API_BASE,AZURE_COMPLETIONS_API,AZURE_DALLE_API
```

### 历史记录配置

| KEY                       | 名称               | 默认值      | 描述                               |
|---------------------------|------------------|-------------|----------------------------------|
| AUTO_TRIM_HISTORY         | 自动裁剪历史记录   | `true`      | 为避免4096字符限制，自动裁剪消息    |
| MAX_HISTORY_LENGTH        | 最大历史记录长度   | `20`        | 保留的最大历史记录条数             |
| HISTORY_IMAGE_PLACEHOLDER | 历史记录图片占位符 | `[A IMAGE]` | 历史记录中的图片将被替换为此占位符 |

### 特性开关

| KEY                          | 名称                  | 默认值                                          | 描述                                                                                                                                                                                                                                                                                      |
|------------------------------|-----------------------|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| HIDE_COMMAND_BUTTONS         | 隐藏命令按钮          | `''`(array string)                              | 修改后需要重新init                                                                                                                                                                                                                                                                        |
| SHOW_REPLY_BUTTON            | 显示快捷回复按钮      | `false`                                         | 是否显示快捷回复按钮                                                                                                                                                                                                                                                                      |
| EXTRA_MESSAGE_CONTEXT        | 额外消息上下文        | `false`                                         | 引用的消息也会假如上下文                                                                                                                                                                                                                                                                  |
| STREAM_MODE                  | 流模式                | `true`                                          | 打字机模式                                                                                                                                                                                                                                                                                |
| SAFE_MODE                    | 安全模式              | `true`                                          | 开启后会保存最新一条消息的ID                                                                                                                                                                                                                                                              |
| DEBUG_MODE                   | 调试模式              | `false`                                         | 开启后会保存最新一条消息                                                                                                                                                                                                                                                                  |
| DEV_MODE                     | 开发模式              | `false`                                         | 开启后会展示更多调试信息                                                                                                                                                                                                                                                                  |
| SUPPORT_FORMAT               | 支持的格式            | `text,photo,voice,image,sticker` (array string) | 支持的格式                                                                                                                                                                                                                                                                                |
| ENABLE_FILE                  | 支持文件              | `true`                                          | 支持文件                                                                                                                                                                                                                                                                                  |
| IGNORE_TEXT_PREFIX           | 忽略的消息前缀        | `''`(array string)                              | 忽略的消息前缀， 为空则不忽略                                                                                                                                                                                                                                                              |
| HIDE_MIDDLE_MESSAGE          | 隐藏中间消息          | `false`                                         | 隐藏中间消息                                                                                                                                                                                                                                                                              |
| CHAT_TRIGGER_PREFIX          | 聊天触发前缀          | `''`(string)                                    | 聊天触发前缀， 会触发bot并将触发词移除                                                                                                                                                                                                                                                     |
| CALL_INFO                    | 显示调用信息          | `true`                                          | 显示调用信息                                                                                                                                                                                                                                                                              |
| TELEGRAPH_NUM_LIMIT          | telegraph 发送限制    | `-1` (number)                                   | 小于等于0，或小于长度限制时不发送 telegraph， 超过则发送                                                                                                                                                                                                                                    |
| TELEGRAPH_SCOPE              | telegraph 发送范围    | `['group', 'supergroup']` (array string)        | 可选值 `group, supergroup, private`                                                                                                                                                                                                                                                       |
| TELEGRAPH_AUTHOR_URL         | telegraph 作者链接    | `''`(string)                                    | telegraph作者链接                                                                                                                                                                                                                                                                         |
| DISABLE_WEB_PREVIEW          | 禁用链接预览          | `false`                                         | 禁用链接预览                                                                                                                                                                                                                                                                              |
| EXPIRED_TIME                 | 消息过期时间          | `-1` (number)                                   | 消息过期时间， 单位：分钟, 开启后将根据消息过期时间定时删除消息                                                                                                                                                                                                                             |
| CRON_CHECK_TIME              | 定时检查时间          | `''`(string)                                    | 定时检查时间， 格式为`*/10 0-2,6-23 * * *`                                                                                                                                                                                                                                                 |
| SCHEDULE_GROUP_DELETE_TYPE   | 群组定时删除类型      | `['tip']` (array string)                        | 可选值 `tip, chat`                                                                                                                                                                                                                                                                        |
| SCHEDULE_PRIVATE_DELETE_TYPE | 私聊定时删除类型      | `['tip']` (array string)                        | 可选值 `tip, chat`                                                                                                                                                                                                                                                                        |
| SEND_IMAGE_AS_FILE           | 以文件形式发送图片    | `false`                                         | 以文件发送图片                                                                                                                                                                                                                                                                            |
| PPLX_COOKIE                  | perplexity cookie     | `null` (string)                                 | perplexity cookie                                                                                                                                                                                                                                                                         |
| LOG_LEVEL                    | 日志级别              | `info` (string)                                 | 日志级别                                                                                                                                                                                                                                                                                  |
| QSTASH_TOKEN                 | qstash token          | `null` (string)                                 | qstash token                                                                                                                                                                                                                                                                              |
| QSTASH_PUBLISH_URL           | qstash publish url    | `null` (string)                                 | qstash publish url                                                                                                                                                                                                                                                                        |
| QSTASH_TRIGGER_PREFIX        | qstash trigger prefix | `null` (string)                                 | qstash trigger prefix                                                                                                                                                                                                                                                                     |
| QSTASH_TIMEOUT               | qstash timeout        | `15m` (string)                                  | qstash timeout                                                                                                                                                                                                                                                                            |
| INLINE_QUERY_SEND_INTERVAL   | 内联查询发送间隔      | `2000` (number)                                 | 内联查询发送间隔， 单位：毫秒                                                                                                                                                                                                                                                               |
| INLINE_QUERY_SHOW_INFO       | 内联查询显示信息      | `false`                                         | 通过内联模式与AI对话时是否显示信息                                                                                                                                                                                                                                                        |
| STORE_MEDIA_MESSAGE          | 存储媒体消息          | `false`                                         | 存储媒体消息，当为true时，会存储媒体消息， 回复媒体消息会将媒体消息全部插入作为上下文，以解决多张图片回复时，只能接收一张的问题                                                                                                                                                                |
| STORE_TEXT_CHUNK_MESSAGE     | 存储文本块消息        | `false`                                         | 存储文本块消息， 当消息过长时，会自动拆分存储， 回复时会将文本块消息插入作为上下文                                                                                                                                                                                                           |
| AUDIO_TEXT_FORMAT            | 音频文本格式          | `undefined`                                     | 音频文本格式                                                                                                                                                                                                                                                                              |
| ADD_QUOTE_LIMIT              | 添加引用限制          | `-1` (number)                                   | 添加引用限制， 当超过限制（大于0）时，会将消息转为引用                                                                                                                                                                                                                                        |
| ADD_QUOTE_SCOPE              | 添加引用范围          | `['group', 'supergroup']` (array string)        | 添加引用范围                                                                                                                                                                                                                                                                              |
| QUOTE_EXPANDABLE             | 引用可折叠            | `false`                                         | 引用可折叠，会将所有引用标记转为可折叠标记                                                                                                                                                                                                                                                 |
| LOG_POSITION_ON_TOP          | 日志位置在顶部        | `true`                                          | 日志位置在顶部, false 为底部                                                                                                                                                                                                                                                              |
| STORE_HISTORY_LENGTH         | 存储历史记录长度      | `64` (number)                                   | 存储历史记录长度                                                                                                                                                                                                                                                                          |
| FILE_SIZE_LIMIT              | 文件大小限制          | `-1` (number)                                   | 文件大小限制                                                                                                                                                                                                                                                                              |
| CALLBACK_QUERY_RC            | 回调查询行数          | `7x2` (string)                                  | 回调查询行数， 格式为`行数x列数`                                                                                                                                                                                                                                                           |
| ENVS_VARIABLES               | 环境变量              | `[]` (array string)                             | 环境变量                                                                                                                                                                                                                                                                                  |
| CALLBACK_MENU                | 回调菜单              | `[]` (array string)                             | 回调菜单， 可选值 `AI_CHAT_PROVIDER`, 'AI_IMAGE_PROVIDER', 'AI_TTS_PROVIDER', 'AI_ASR_PROVIDER', 'USE_TOOLS', 'USE_MCP', 'USE_OAILIKE_RELAY_TOOLS', 'CHAT_MODEL', 'IMAGE_MODEL', 'VISION_MODEL', 'TOOL_MODEL', 'ENVS', 'RERANK_AGENT' |
| MESSAGE_COMPATIBLE           | 消息兼容              | `true`                                          | 消息兼容, 当为true时，会将tool_call/tool_result消息转换为user消息，同时在system message中添加tool定义                                                                                                                                                                                       |
| ENABLE_SEARCH_SOURCE         | 显示搜索源            | `true`                                          | 是否显示搜索源                                                                                                                                                                                                                                                                                |




## 用户配置

每个用户的自定义配置，只能通过Telegram发送消息来修改，消息格式为`/setenv KEY=VALUE`, 用户配置的优先级比系统配置的更高。如果想删除配置，请使用`/delenv KEY`。 批量设置变量请使用`/setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}`

### 通用配置

| KEY                 | 名称               | 默认值               | 描述                                                                              |
|---------------------|------------------|----------------------|---------------------------------------------------------------------------------|
| AI_CHAT_PROVIDER    | AI提供商           | `auto`               | 可选值 `auto, openai, azure, workers, google, vertex, mistral, cohere, anthropic` |
| AI_IMAGE_PROVIDER   | AI图片提供商       | `auto`               | 可选值 `auto, openai, azure, workers`                                             |
| SYSTEM_INIT_MESSAGE | 全局默认初始化消息 | `你是一个得力的助手` | 根据绑定的语言自动选择默认值                                                      |

### OpenAI

| KEY                     | 名称                    | 默认值                      |
|-------------------------|-------------------------|-----------------------------|
| OPENAI_API_KEY          | OpenAI API Key          | `''`(array string)          |
| OPENAI_CHAT_MODEL       | OpenAI的模型名称        | `gpt-4o-mini`               |
| OPENAI_API_BASE         | OpenAI API BASE         | `https://api.openai.com/v1` |
| OPENAI_API_EXTRA_PARAMS | OpenAI API Extra Params | `{}`                        |
| DALL_E_MODEL            | DALL-E的模型名称        | `dall-e-2`                  |
| DALL_E_IMAGE_SIZE       | DALL-E图片尺寸          | `512x512`                   |
| DALL_E_IMAGE_QUALITY    | DALL-E图片质量          | `standard`                  |
| DALL_E_IMAGE_STYLE      | DALL-E图片风格          | `vivid`                     |

### Azure OpenAI

> AZURE_COMPLETIONS_API `https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/chat/completions?api-version=VERSION_NAME`

> AZURE_DALLE_API `https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/images/generations?api-version=VERSION_NAME`

| KEY                   | 名称                  | 默认值 |
|-----------------------|-----------------------|--------|
| AZURE_API_KEY         | Azure API Key         | `null` |
| AZURE_COMPLETIONS_API | Azure Completions API | `null` |
| AZURE_DALLE_API       | Azure DallE API       | `null` |


### Workers

| KEY                   | 名称                  | 默认值                                         |
|-----------------------|-----------------------|------------------------------------------------|
| CLOUDFLARE_ACCOUNT_ID | Cloudflare Account ID | `null`                                         |
| CLOUDFLARE_TOKEN      | Cloudflare Token      | `null`                                         |
| WORKERS_CHAT_MODEL    | Text Generation Model | `@cf/mistral/mistral-7b-instruct-v0.1 `        |
| WORKERS_IMAGE_MODEL   | Text-to-Image Model   | `@cf/stabilityai/stable-diffusion-xl-base-1.0` |

### Gemini

cloudflare workers 暂时不支持访问

| KEY               | 名称                  | 默认值                                                     |
|-------------------|-----------------------|------------------------------------------------------------|
| GOOGLE_API_KEY    | Google Gemini API Key | `null`                                                     |
| GOOGLE_API_BASE   | Google Gemini API     | `https://generativelanguage.googleapis.com/v1beta/models/` |
| GOOGLE_CHAT_MODEL | Google Gemini Model   | `gemini-pro`                                               |

### Mistral

| KEY                | 名称              | 默认值                      |
|--------------------|-------------------|-----------------------------|
| MISTRAL_API_KEY    | Mistral API Key   | `null`                      |
| MISTRAL_API_BASE   | Mistral API Base  | `https://api.mistral.ai/v1` |
| MISTRAL_CHAT_MODEL | Mistral API Model | `mistral-tiny`              |

### Cohere

| KEY               | 名称             | 默认值                      |
|-------------------|------------------|-----------------------------|
| COHERE_API_KEY    | Cohere API Key   | `null`                      |
| COHERE_API_BASE   | Cohere API Base  | `https://api.cohere.com/v1` |
| COHERE_CHAT_MODEL | Cohere API Model | `command-r-plus`            |

### Anthropic

| KEY                  | 名称                | 默认值                         |
|----------------------|---------------------|--------------------------------|
| ANTHROPIC_API_KEY    | Anthropic API Key   | `null`                         |
| ANTHROPIC_API_BASE   | Anthropic API Base  | `https://api.anthropic.com/v1` |
| ANTHROPIC_CHAT_MODEL | Anthropic API Model | `claude-3-haiku-20240307`      |

## 额外配置

| KEY                       | 名称                   | 默认值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 描述                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MAPPING_KEY               | 映射键                 | `-p:SYSTEM_INIT_MESSAGE\|-n:MAX_HISTORY_LENGTH\|-a:AI_CHAT_PROVIDER\|-ai:AI_IMAGE_PROVIDER\|-m:CHAT_MODEL\|-md:CURRENT_MODE\|-v:VISION_MODEL\|-t:OPENAI_TTS_MODEL\|-ex:OPENAI_API_EXTRA_PARAMS\|-mk:MAPPING_KEY\|-mv:MAPPING_VALUE\|-tm:TOOL_MODEL\|-tool:USE_TOOLS\|-oli:IMAGE_MODEL\|-th:TEXT_HANDLE_TYPE\|-to:TEXT_OUTPUT\|-ah:AUDIO_HANDLE_TYPE\|-ao:AUDIO_OUTPUT\|-act:AUDIO_CONTAINS_TEXT\|-as:AI_ASR_PROVIDER\|-at:AI_TTS_PROVIDER\|-ra:RERANK_AGENT\|-ew:ENABLE_WORKFLOW\|-tp:CHAT_TEMPERATURE` | 映射键                                                                                                                                                                                                                                                                                                                  |
| MAPPING_VALUE             | 映射值                 | `''`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | /set command mapping value, separated by \|, : separates multiple relationships, example: MAPPING_VALUE = "cson:claude-3-5-sonnet-20240620\|haiku:claude-3-haiku-20240307\|g4m:gpt-4o-mini\|g4:gpt-4o\|rp+:command-r-plus"                                                                                              |
| ENABLE_SHOWINFO           | 显示模型和时间信息     | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 是否显示模型和时间信息                                                                                                                                                                                                                                                                                                  |
| SHOW_PARTS                | 显示信息部分           | `['model', 'model_time', 'token', 'tool', 'tool_time', 'first_chunk_time']`                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 显示信息部分                                                                                                                                                                                                                                                                                                            |
| USE_TOOLS                 | 使用工具               | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 使用工具                                                                                                                                                                                                                                                                                                                |
| USE_MCP                   | 使用MCP                | `[]` string array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 使用的MCP， 名称为环境变量中设置的名称                                                                                                                                                                                                                                                                                  |
| JINA_API_KEY              | Jina API Key           | `[]` string array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Jina API Key, 支持多个                                                                                                                                                                                                                                                                                                  |
| TOOL_MODEL                | 工具模型               | `''`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Tool model                                                                                                                                                                                                                                                                                                              |
| PROMPT                    | 提示词                 | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 提示词，以键值对的形式设置                                                                                                                                                                                                                                                                                              |
| KLINGAI_COOKIE            | KlingAI Cookie         | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | KlingAI Cookie                                                                                                                                                                                                                                                                                                          |
| KLINGAI_IMAGE_COUNT       | KlingAI 图片数量       | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | KlingAI Image Count                                                                                                                                                                                                                                                                                                     |
| KLINGAI_IMAGE_RATIO       | KlingAI 图像比例       | `1:1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | KlingAI Image Ratio                                                                                                                                                                                                                                                                                                     |
| CHAT_TEMPERATURE          | Chat 温度              | `undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Chat 温度                                                                                                                                                                                                                                                                                                               |
| FUNCTION_CALL_TEMPERATURE | 函数调用温度           | `undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Function Call Temperature                                                                                                                                                                                                                                                                                               |
| MAX_TOKENS                | 最大token              | `undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Max Tokens                                                                                                                                                                                                                                                                                                              |
| MAX_STEPS                 | 最大步数               | `3`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Max Steps                                                                                                                                                                                                                                                                                                               |
| MAX_RETRIES               | 重试次数               | `0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Max Retries                                                                                                                                                                                                                                                                                                             |
| RERANK_AGENT              | 重排服务商             | `google`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Rerank Agent                                                                                                                                                                                                                                                                                                            |
| JINA_RERANK_MODEL         | Jina 重排模型          | `jina-colbert-v2`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Jina Rerank Model                                                                                                                                                                                                                                                                                                       |
| ENABLE_INTELLIGENT_MODEL  | 开启智能模型           | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | true时开启。通过已有模型列表对输入值进行相似度比较/重排，以//开头的消息将进行识别，//c model 调整对话模型，//v model 调整图像识别模型，//t model 调整函数调用模型                                                                                                                                                       |
| TEXT_HANDLE_TYPE          | 文本处理方式           | `text`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Text handle type, to 'tts' or 'text' to chat with llm, or 'chat' by using audio-preview (default: text)                                                                                                                                                                                                                 |
| TEXT_OUTPUT               | 文字对话后输出方式     | `text`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Text output type, 'audio' or 'text' (default: text)                                                                                                                                                                                                                                                                     |
| AUDIO_HANDLE_TYPE         | 音频处理方式           | `stt`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Audio handle type, 'stt' or 'audio' to chat with llm, or 'chat' by using audio-preview (default: stt)                                                                                                                                                                                                                   |
| AUDIO_OUTPUT              | 音频消息输出方式       | `text`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Audio output type, 'audio' or 'text' (default: text)                                                                                                                                                                                                                                                                    |
| AUDIO_CONTAINS_TEXT       | 输出的音频是否包含文字 | `true`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Audio contains text                                                                                                                                                                                                                                                                                                     |
| DROPS_OPENAI_PARAMS       | 移除 OpenAI 参数       | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Drop openai params, the key is the model name, separated by commas, and the value is the parameters to be dropped, separated by commas.                                                                                                                                                                                 |
| COVER_MESSAGE_ROLE        | 覆盖消息角色           | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Cover message role, the key is the model name, separated by commas, and the value is overridden_role:new_role.                                                                                                                                                                                                          |
| MAX_HISTORY_LENGTH        | 最大历史消息长度       | `10`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Max History Length                                                                                                                                                                                                                                                                                                      |
| CONTINUE_STEP             | 持续性步骤             | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当stop reason为超出模型tokens限制时，将继续生成                                                                                                                                                                                                                                                                         |
| MESSAGE_REPLACER          | 消息替换器             | `''`(key-value)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 格式为`{key: value}`， 会将key 替换为value                                                                                                                                                                                                                                                                              |
| PARAMS_MODIFIER           | 参数调整               | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Parameter modifier; string array; separated by colons, the key is the model name, separated by commas; the value is the parameter modification value, modification values starting with '+' indicates addition, with the value after '=' and separated by '\|'; starting with '-' indicates addition indicate deletion. |
| WORKFLOW                  | Workflow               | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Workflow                                                                                                                                                                                                                                                                                                                |
| ENABLE_ALIAS              | 是否开启模型别名       | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 开启后将使用MAPPING_VALUE中的模型别名， 例如：`g4m:gpt-4o-mini`， 则将使用`g4m`作为模型名展示                                                                                                                                                                                                                           |


## 支持命令

| 命令       | 说明                               | 示例                                            |
|:-----------|:---------------------------------|:------------------------------------------------|
| `/help`    | 获取命令帮助                       | `/help`                                         |
| `/new`     | 发起新的对话                       | `/new`                                          |
| `/start`   | 获取你的ID，并发起新的对话          | `/start`                                        |
| `/img`     | 生成一张图片                       | `/img 图片描述`                                 |
| `/version` | 获取当前版本号，判断是否需要更新    | `/version`                                      |
| `/setenv`  | 设置用户配置, 详情见`用户配置`     | `/setenv KEY=VALUE`                             |
| `/setenvs` | 批量设置用户配置, 详情见`用户配置` | `/setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}` |
| `/delenv`  | 删除用户配置                       | `/delenv KEY`                                   |
| `/system`  | 查看当前一些系统信息               | `/system`                                       |
| `/redo`    | 修改上一个提问或者换一个回答       | `/redo 修改过的内容` 或者 `/redo`               |
| `/echo`    | 回显消息,仅开发模式可用            | `/echo`                                         |

## 自定义命令

除了上述系统定义的指令，你也可以自定义快捷指令， 可以将某些较长的指令简化为一个单词的指令。

自定义指令使用环境变量设置 `CUSTOM_COMMAND_XXX`，其中XXX为指令名，比如`CUSTOM_COMMAND_azure`，值为指令内容，比如`/setenvs {"AI_CHAT_PROVIDER": "azure"}`。 这样就可以使用`/azure`来代替`/setenvs {"AI_CHAT_PROVIDER": "azure"}`实现快速切换AI提供商。

下面是一些自定义指令例子

| 指令                   | 值                                                                              |
|------------------------|---------------------------------------------------------------------------------|
| CUSTOM_COMMAND_azure   | `/setenvs {"AI_CHAT_PROVIDER": "azure"}`                                        |
| CUSTOM_COMMAND_workers | `/setenvs {"AI_CHAT_PROVIDER": "workers"}`                                      |
| CUSTOM_COMMAND_gpt3    | `/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-3.5-turbo"}` |
| CUSTOM_COMMAND_gpt4    | `/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-4"}`         |
| CUSTOM_COMMAND_cn2en   | `/setenvs {"SYSTEM_INIT_MESSAGE": "你是一个翻译下面将我说的话都翻译成英文"}`    |

如果你是用toml进行配置，可以使用下面的方式：

```toml
CUSTOM_COMMAND_azure= '/setenvs {"AI_CHAT_PROVIDER": "azure"}'
CUSTOM_COMMAND_workers = '/setenvs {"AI_CHAT_PROVIDER": "workers"}'
CUSTOM_COMMAND_gpt3 = '/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-3.5-turbo"}'
CUSTOM_COMMAND_gpt4 = '/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-4"}'
CUSTOM_COMMAND_cn2en = '/setenvs {"SYSTEM_INIT_MESSAGE": "你是一个翻译下面将我说的话都翻译成英文"}'
```

## 自定义指令帮助信息

如果你想为自定义指令添加帮助信息，可以使用环境变量设置 `COMMAND_DESCRIPTION_XXX`，其中`XXX`为指令名，比如`COMMAND_DESCRIPTION_azure`，值为指令描述，比如`切换AI提供商为Azure`。 这样就可以使用`/help`查看到自定义指令的帮助信息。

下面是一些自定义指令帮助信息例子

| 指令描述                    | 描述                               |
|-----------------------------|----------------------------------|
| COMMAND_DESCRIPTION_azure   | 切换AI提供商为Azure                |
| COMMAND_DESCRIPTION_workers | 切换AI提供商为Workers              |
| COMMAND_DESCRIPTION_gpt3    | 切换AI提供商为OpenAI GPT-3.5 Turbo |
| COMMAND_DESCRIPTION_gpt4    | 切换AI提供商为OpenAI GPT-4         |
| COMMAND_DESCRIPTION_cn2en   | 将对话内容翻译成英文               |

如果你是用toml进行配置，可以使用下面的方式：

```toml
COMMAND_DESCRIPTION_azure = '切换AI提供商为Azure'
COMMAND_DESCRIPTION_workers = '切换AI提供商为Workers'
COMMAND_DESCRIPTION_gpt3 = '切换AI提供商为OpenAI GPT-3.5 Turbo'
COMMAND_DESCRIPTION_gpt4 = '切换AI提供商为OpenAI GPT-4'
COMMAND_DESCRIPTION_cn2en = '将对话内容翻译成英文'
```

如果你想将自定义命令绑定到telegram的菜单中，你可以添加如下环境变量`COMMAND_SCOPE_azure = "all_private_chats,all_group_chats,all_chat_administrators"`，这样插件就会在所有的私聊，群聊和群组中生效。

## 自定义TOOL

以`PLUGIN_FUNCTION_`为前缀 例如：`PLUGIN_FUNCTION_weather`；值为TOOL的定义， 例如：
```json
{
    "name": "weather",
    "description": "获取天气信息",
    "parameters": {
        "type": "object",
        "properties": {"city": {"type": "string"}}
    }
}
```
环境变量以`PLUGIN_ENV_`为前缀， 例如：`PLUGIN_ENV_QWEATHER_TOKEN`， 值为QWEATHER_TOKEN，用于替换`{{QWEATHER_TOKEN}}`。

详细请参考示例[qweather](../../src/tools/external/qweather.json)

### 本地TOOL

将工具文件挂载在 `/app/tool` 目录下， 在启动时会自动加载，参考 [docker compose文件](../../docker-compose.yaml)。工具需要使用的环境变量仍以 `PLUGIN_ENV_` 为前缀进行设置。
支持的文件类型：
- .json
- .ts
- .js
> 注： `ts/js`文件需要以**默认导出方式**导出工具，显式工具名为文件名。例如：`echo.ts`， 则工具名为`echo` 。支持的字段见[types.ts](../../src/tools/types.ts)。
示例：
```ts
export default {
    schema: {
        name: 'echo',
        description: 'a echo tool',
        parameters: {
            type: 'object',
            properties: {
                test: {
                    type: 'string',
                    description: `sth to echo`,
                },
            },
            required: ['test'],
        },
    },

    func: async (args: { test: string }): Promise<any> => {
        return { content: args.test, time: 0.01 };
    },

    prompt: 'You just need to echo the input',
    extra_params: { temperature: 0.7, top_p: 0.4 },
    not_send_to_ai: false,
};
```

---

## 自定义MCP

自定义MCP, 环境变量以`MCP_`为前缀， 例如 `MCP_amap`，值为MCP。

### sse：
参数定义：
```json
{
    type: 'sse';
    url: string;
    headers?: Record<string, string>;
}
```
示例：
```json
{
    "type": "sse",
    "url": "https://mcp.amap.com/sse?key=<YOUR_API_KEY>"
}
```

### stdio：
参数定义：
```json
{
    type: 'stdio';
    command: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
}
```
示例：
```json
{
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@amap/amap-maps-mcp-server"],
    "env": {"AMAP_MAPS_API_KEY": "<YOUR_API_KEY>"}
}
```

可挂载本地文件， 例如：
```json
{
    "type": "stdio",
    "command": "node",
    "args": ["server.test.ts"],
    "cwd": "src/mcp"
}
```
### stream http：
参数定义：
```json
{
    type: 'http';
    url: string;
}
```
示例：
```json
{
    "type": "http",
    "url": "https://example.com/mcp"
}
```
