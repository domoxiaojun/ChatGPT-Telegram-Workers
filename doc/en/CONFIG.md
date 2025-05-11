# Configuration

It is recommended to fill in environment variables in the Workers configuration interface instead of directly modifying variables in the JS code.

## KV configuration

| KEY      | Description                                                                                                       |
|:---------|-------------------------------------------------------------------------------------------------------------------|
| DATABASE | First, create a KV. When creating it, the name can be arbitrary, but when binding it, it must be set as DATABASE. |

## System Configuration

The configuration that is common to each user can only be configured and filled in through the Workers configuration interface or toml, and it is not supported to modify it by sending messages through Telegram.

> `array string`:  An empty string in the array indicates that no value has been set. If a value needs to be set, it should be set as `'value1,value2'`, with multiple values separated by commas.

### Basic configuration

| KEY                       | Name                      | Default  | Description                               |
|---------------------------|---------------------------|----------|-------------------------------------------|
| LANGUAGE                  | Language                  | `zh-cn`  | Menu language                             |
| UPDATE_BRANCH             | Update branch             | `master` | Check the branch for updates              |
| CHAT_COMPLETE_API_TIMEOUT | Chat complete API timeout | `0`      | Timeout for AI conversation API (seconds) |

### Telegram configuration

| KEY                       | Name                           | Default                                    | Description                                                                                                   |
|---------------------------|--------------------------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| TELEGRAM_API_DOMAIN       | Telegram API Domain            | `https://api.telegram.org/`                | Telegram API domain                                                                                           |
| TELEGRAM_AVAILABLE_TOKENS | Available Telegram tokens.     | `''`(array string)                         | Telegram Tokens allowed to access, separated by commas when setting.                                          |
| DEFAULT_PARSE_MODE        | Default parsing mode.          | `Markdown`                                 | Default message parsing mode.                                                                                 |
| I_AM_A_GENEROUS_PERSON    | Allow everyone to use.         | `false`                                    | Is it allowed for everyone to use?                                                                            |
| CHAT_WHITE_LIST           | Chat whitelist                 | `''`(array string)                         | Allowed Chat ID Whitelist                                                                                     |
| LOCK_USER_CONFIG_KEYS     | Locked user configuration key. | The default value is the URL for all APIs. | Configuration key to prevent token leakage caused by replacement.                                             |
| TELEGRAM_BOT_NAME         | Telegram bot name              | `''`(array string)                         | The Bot Name corresponding to the Telegram Token that is allowed to access, separated by commas when setting. |
| CHAT_GROUP_WHITE_LIST     | Group whitelist                | `''`(array string)                         | Allowed group ID whitelist.                                                                                   |
| GROUP_CHAT_BOT_ENABLE     | Whether to enable group bots.  | `true`                                     | Whether to enable group robots.                                                                               |
| GROUP_CHAT_BOT_SHARE_MODE | Group robot sharing mode       | `true`                                     | After opening, people in the same group use the same chat context.                                            |

> IMPORTANT: You must add the group ID to the whitelist `CHAT_GROUP_WHITE_LIST` to use it, otherwise anyone can add your bot to the group and consume your quota.

> IMPORTANT: Due to Telegram's privacy and security policies, if your group is a public group or has more than 2000 members, please set the bot as an `administrator`, otherwise the bot will not respond to chat messages with `@bot`.

> IMPORTANT: You must set `/setprivacy` to `Disable` in botfather, otherwise the bot will not respond to chat messages with `@bot`.

#### Lock configuration `LOCK_USER_CONFIG_KEYS`

> IMPORTANT: If you encounter the error "Key XXX is locked", it means that your configuration is locked and needs to be unlocked before modification.

The default value of `LOCK_USER_CONFIG_KEYS` is the BASE URL of all APIs. In order to prevent users from replacing the API BASE URL and causing token leakage, the BASE URL of all APIs is locked by default. If you want to unlock the BASE URL of a certain API, you can remove it from `LOCK_USER_CONFIG_KEYS`.
`LOCK_USER_CONFIG_KEYS` is a string array with a default value is 

```
OPENAI_API_BASE,GOOGLE_API_BASE,MISTRAL_API_BASE,COHERE_API_BASE,ANTHROPIC_API_BASE,AZURE_COMPLETIONS_API,AZURE_DALLE_API
```

### History configuration

| KEY                | Name                                  | Default | Description                                                   |
|--------------------|---------------------------------------|---------|---------------------------------------------------------------|
| AUTO_TRIM_HISTORY  | Automatic trimming of message history | `true`  | Automatically trim messages to avoid the 4096 character limit |
| MAX_HISTORY_LENGTH | Maximum length of message history     | `12`    | Maximum number of message history entries to keep             |

### Feature configuration

| KEY                          | Name                              | Default                                         | Description                                                                                                                                                                                                                                                                                             |
|------------------------------|-----------------------------------|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| HIDE_COMMAND_BUTTONS         | Hide command buttons              | `''`(array string)                              | After modification, you need to re-init                                                                                                                                                                                                                                                                 |
| SHOW_REPLY_BUTTON            | Show quick reply buttons          | `false`                                         | Whether to show quick reply buttons                                                                                                                                                                                                                                                                     |
| EXTRA_MESSAGE_CONTEXT        | Extra message context             | `false`                                         | The referenced message will also be included in the context                                                                                                                                                                                                                                             |
| STREAM_MODE                  | Stream mode                       | `true`                                          | Typewriter mode                                                                                                                                                                                                                                                                                         |
| SAFE_MODE                    | Safe mode                         | `true`                                          | After modification, you need to re-init                                                                                                                                                                                                                                                                 |
| DEBUG_MODE                   | Debug mode                        | `false`                                         | After modification, you need to re-init                                                                                                                                                                                                                                                                 |
| DEV_MODE                     | Development mode                  | `false`                                         | After modification, you need to re-init                                                                                                                                                                                                                                                                 |
| SUPPORT_FORMAT               | Supported formats                 | `text,photo,voice,image,sticker` (array string) | Supported formats                                                                                                                                                                                                                                                                                       |
| ENABLE_FILE                  | Support files                     | `true`                                          | Support files                                                                                                                                                                                                                                                                                           |
| IGNORE_TEXT_PREFIX           | Ignore message prefix             | `''`(array string)                              | Ignore message prefix, if empty, do not ignore                                                                                                                                                                                                                                                          |
| HIDE_MIDDLE_MESSAGE          | Hide middle message               | `false`                                         | Hide middle message                                                                                                                                                                                                                                                                                     |
| CHAT_TRIGGER_PREFIX          | Chat trigger prefix               | `''`(string)                                    | Chat trigger prefix, will trigger bot and remove trigger word                                                                                                                                                                                                                                           |
| CALL_INFO                    | Show call info                    | `true`                                          | Show call info                                                                                                                                                                                                                                                                                          |
| TELEGRAPH_NUM_LIMIT          | Telegraph send limit              | `-1` (number)                                   | If less than or equal to 0, or less than the length limit, do not send telegraph, otherwise send                                                                                                                                                                                                        |
| TELEGRAPH_SCOPE              | Telegraph send scope              | `['group', 'supergroup']` (array string)        | Optional values `group, supergroup, private`                                                                                                                                                                                                                                                            |
| TELEGRAPH_AUTHOR_URL         | Telegraph author url              | `''`(string)                                    | Telegraph author url                                                                                                                                                                                                                                                                                    |
| DISABLE_WEB_PREVIEW          | Disable web preview               | `false`                                         | Disable web preview                                                                                                                                                                                                                                                                                     |
| EXPIRED_TIME                 | Message expiration time           | `-1` (number)                                   | Message expiration time, unit: minutes, After enabling, messages will be automatically deleted based on their expiration time.                                                                                                                                                                          |
| CRON_CHECK_TIME              | Cron check time                   | `''`(string)                                    | Cron check time, format: `*/10 0-2,6-23 * * *`                                                                                                                                                                                                                                                          |
| SCHEDULE_GROUP_DELETE_TYPE   | Group schedule delete type        | `['tip']` (array string)                        | Optional values `tip, chat`                                                                                                                                                                                                                                                                             |
| SCHEDULE_PRIVATE_DELETE_TYPE | Private chat schedule delete type | `['tip']` (array string)                        | Optional values `tip, chat`                                                                                                                                                                                                                                                                             |
| SEND_IMAGE_AS_FILE           | Send image as file                | `false`                                         | Send image as file                                                                                                                                                                                                                                                                                      |
| PPLX_COOKIE                  | Perplexity cookie                 | `null` (string)                                 | Perplexity cookie                                                                                                                                                                                                                                                                                       |
| LOG_LEVEL                    | Log level                         | `info` (string)                                 | Log level                                                                                                                                                                                                                                                                                               |
| QSTASH_TOKEN                 | qstash token                      | `null` (string)                                 | qstash token                                                                                                                                                                                                                                                                                            |
| QSTASH_PUBLISH_URL           | qstash publish url                | `null` (string)                                 | qstash publish url                                                                                                                                                                                                                                                                                      |
| QSTASH_TRIGGER_PREFIX        | qstash trigger prefix             | `null` (string)                                 | qstash trigger prefix                                                                                                                                                                                                                                                                                   |
| QSTASH_TIMEOUT               | qstash timeout                    | `15m` (string)                                  | qstash timeout                                                                                                                                                                                                                                                                                          |
| INLINE_QUERY_SEND_INTERVAL   | Inline query send interval        | `2000` (number)                                 | Inline query send interval, unit: milliseconds                                                                                                                                                                                                                                                          |
| INLINE_QUERY_SHOW_INFO       | Inline query show info            | `false`                                         | Whether to display information when using inline mode to chat with AI                                                                                                                                                                                                                                   |
| STORE_MEDIA_MESSAGE          | Store media message               | `false`                                         | Store media message, when true, will store media message, reply media message will insert all media messages as context, to solve the problem that only one image can be received when replying to multiple images                                                                                      |
| STORE_TEXT_CHUNK_MESSAGE     | Store text chunk message          | `false`                                         | Store text chunk message, when the message is too long, it will be automatically split and stored, reply will insert text chunk message as context                                                                                                                                                      |
| AUDIO_TEXT_FORMAT            | Audio text format                 | `undefined`                                     | Audio text format                                                                                                                                                                                                                                                                                       |
| ADD_QUOTE_LIMIT              | Add quote limit                   | `-1` (number)                                   | Add quote limit, when the limit is exceeded (greater than 0), the message will be converted to a quote                                                                                                                                                                                                  |
| ADD_QUOTE_SCOPE              | Add quote scope                   | `['group', 'supergroup']` (array string)        | Add quote scope                                                                                                                                                                                                                                                                                         |
| QUOTE_EXPANDABLE             | Quote expandable                  | `false`                                         | Quote expandable, will convert all quote marks to expandable marks                                                                                                                                                                                                                                      |
| LOG_POSITION_ON_TOP          | Log position on top               | `true`                                          | Log position on top, false is bottom                                                                                                                                                                                                                                                                    |
| STORE_HISTORY_LENGTH         | Store history length              | `64` (number)                                   | Store history length                                                                                                                                                                                                                                                                                    |
| FILE_SIZE_LIMIT              | File size limit                   | `-1` (number)                                   | File size limit                                                                                                                                                                                                                                                                                         |
| CALLBACK_QUERY_RC            | Callback query row and column     | `7x2` (string)                                  | Callback query row and column, format: `rowxcolumn`                                                                                                                                                                                                                                                     |
| ENVS_VARIABLES               | Envs variables                    | `[]` (array string)                             | Envs variables                                                                                                                                                                                                                                                                                          |
| CALLBACK_MENU                | Callback menu                     | `[]` (array string)                             | Callback menu, optional values: 'AI_CHAT_PROVIDER', 'AI_IMAGE_PROVIDER', 'AI_TTS_PROVIDER', 'AI_ASR_PROVIDER', 'USE_TOOLS', 'USE_MCP', 'USE_OAILIKE_RELAY_TOOLS', 'CHAT_MODEL', 'IMAGE_MODEL', 'VISION_MODEL', 'TOOL_MODEL', 'ENVS', 'RERANK_AGENT' |
| MESSAGE_COMPATIBLE           | Message compatible                | `true`                                          | Message compatible, when true, will convert tool_call/tool_result messages to user messages, and add tool definitions to system messages                                                                                                                                                                |
| ENABLE_SEARCH_SOURCE         | Display search source            | `true`                                          | Whether to display search source                                                                                                                                                                                                                                                                        |




## User configuration

Each user's custom configuration can only be modified by sending a message through Telegram. The message format is `/setenv KEY=VALUE`. User configurations have a higher priority than system configurations. If you want to delete a configuration, please use `/delenv KEY`. To set variables in batches, please use `/setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}`.

### General configuration

| KEY                          | Name                           | Default                                    | Description                                                                                                   |
|------------------------------|--------------------------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| TELEGRAM_API_DOMAIN          | Telegram API Domain            | `https://api.telegram.org/`                | Telegram API domain                                                                                           |
| TELEGRAM_AVAILABLE_TOKENS    | Available Telegram tokens.     | `''`(array string)                         | Telegram Tokens allowed to access, separated by commas when setting.                                          |
| DEFAULT_PARSE_MODE           | Default parsing mode.          | `Markdown`                                 | Default message parsing mode                                                                                  |
| I_AM_A_GENEROUS_PERSON       | Allow everyone to use.         | `false`                                    | Is it allowed for everyone to use?                                                                            |
| CHAT_WHITE_LIST              | Chat whitelist                 | `''`(array string)                         | Allowed Chat ID Whitelist                                                                                     |
| LOCK_USER_CONFIG_KEYS        | Locked user configuration key. | The default value is the URL for all APIs. | Configuration key to prevent token leakage caused by replacement.                                             |
| TELEGRAM_BOT_NAME            | Telegram bot name              | `''`(array string)                         | The Bot Name corresponding to the Telegram Token that is allowed to access, separated by commas when setting. |
| CHAT_GROUP_WHITE_LIST        | 群组白名单                     | `''`(array string)                         | 允许使用的群组ID白名单                                                                                        |
| GROUP_CHAT_BOT_ENABLE        | Group chat bot enable          | `true`                                     | Whether to enable group chat bot                                                                              |
| GROUP_CHAT_BOT_SHARE_MODE    | Group chat bot share mode      | `true`                                     | After opening, people in the same group use the same chat context                                             |
| CHAT_TOTAL_DURATION_LIMIT    | Chat total duration limit      | `30 * 60`                                  | Chat total duration limit, unit: seconds                                                                      |
| TELEGRAM_MIN_STREAM_INTERVAL | Telegram min stream interval   | `0`                                        | Telegram min stream interval, unit: milliseconds                                                              |
| TELEGRAM_PHOTO_SIZE_OFFSET   | Telegram photo size offset     | `-2`                                       | Telegram photo size offset, unit: pixels                                                                      |
| TELEGRAM_IMAGE_TRANSFER_MODE | Telegram image transfer mode   | `url`                                      | Telegram image transfer mode, optional values: `url, base64`                                                  |

### OpenAI

| KEY                     | Name                    | Default                     |
|-------------------------|-------------------------|-----------------------------|
| OPENAI_API_KEY          | OpenAI API Key          | `''`(array string)          |
| OPENAI_CHAT_MODEL       | OpenAI Model            | `gpt-4o-mini`               |
| OPENAI_API_BASE         | OpenAI API BASE         | `https://api.openai.com/v1` |
| OPENAI_API_EXTRA_PARAMS | OpenAI API Extra Params | `{}`                        |
| DALL_E_MODEL            | DALL-E model name.      | `dall-e-2`                  |
| DALL_E_IMAGE_SIZE       | DALL-E Image size       | `512x512`                   |
| DALL_E_IMAGE_QUALITY    | DALL-E Image quality    | `standard`                  |
| DALL_E_IMAGE_STYLE      | DALL-E Image style      | `vivid`                     |

### Azure OpenAI

> AZURE_COMPLETIONS_API `https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/chat/completions?api-version=VERSION_NAME`

> AZURE_DALLE_API `https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/images/generations?api-version=VERSION_NAME`

| KEY                   | Name                  | Default |
|-----------------------|-----------------------|---------|
| AZURE_API_KEY         | Azure API Key         | `null`  |
| AZURE_COMPLETIONS_API | Azure Completions API | `null`  |
| AZURE_DALLE_API       | Azure DallE API       | `null`  |

### Workers

| KEY                   | Name                  | Default                                        |
|-----------------------|-----------------------|------------------------------------------------|
| CLOUDFLARE_ACCOUNT_ID | Cloudflare Account ID | `null`                                         |
| CLOUDFLARE_TOKEN      | Cloudflare Token      | `null`                                         |
| WORKERS_CHAT_MODEL    | Text Generation Model | `@cf/mistral/mistral-7b-instruct-v0.1 `        |
| WORKERS_IMAGE_MODEL   | Text-to-Image Model   | `@cf/stabilityai/stable-diffusion-xl-base-1.0` |

### Gemini

| KEY               | Name                  | Default                                                    |
|-------------------|-----------------------|------------------------------------------------------------|
| GOOGLE_API_KEY    | Google Gemini API Key | `null`                                                     |
| GOOGLE_API_BASE   | Google Gemini API     | `https://generativelanguage.googleapis.com/v1beta/models/` |
| GOOGLE_CHAT_MODEL | Google Gemini Model   | `gemini-pro`                                               |

> Cloudflare Workers currently do not support accessing Gemini.

### Mistral

| KEY                | Name              | Default                     |
|--------------------|-------------------|-----------------------------|
| MISTRAL_API_KEY    | Mistral API Key   | `null`                      |
| MISTRAL_API_BASE   | Mistral API Base  | `https://api.mistral.ai/v1` |
| MISTRAL_CHAT_MODEL | Mistral API Model | `mistral-tiny`              |

### Cohere

| KEY               | Name             | Default                     |
|-------------------|------------------|-----------------------------|
| COHERE_API_KEY    | Cohere API Key   | `null`                      |
| COHERE_API_BASE   | Cohere API Base  | `https://api.cohere.com/v1` |
| COHERE_CHAT_MODEL | Cohere API Model | `command-r-plus`            |

### Anthropic

| KEY                  | Name                | Default                        |
|----------------------|---------------------|--------------------------------|
| ANTHROPIC_API_KEY    | Anthropic API Key   | `null`                         |
| ANTHROPIC_API_BASE   | Anthropic API Base  | `https://api.anthropic.com/v1` |
| ANTHROPIC_CHAT_MODEL | Anthropic API Model | `claude-3-haiku-20240307`      |

## 额外配置

| KEY                       | Name                        | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                             |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MAPPING_KEY               | map keys                    | `-p:SYSTEM_INIT_MESSAGE\|-n:MAX_HISTORY_LENGTH\|-a:AI_CHAT_PROVIDER\|-ai:AI_IMAGE_PROVIDER\|-m:CHAT_MODEL\|-md:CURRENT_MODE\|-v:VISION_MODEL\|-t:OPENAI_TTS_MODEL\|-ex:OPENAI_API_EXTRA_PARAMS\|-mk:MAPPING_KEY\|-mv:MAPPING_VALUE\|-tm:TOOL_MODEL\|-tool:USE_TOOLS\|-oli:IMAGE_MODEL\|-th:TEXT_HANDLE_TYPE\|-to:TEXT_OUTPUT\|-ah:AUDIO_HANDLE_TYPE\|-ao:AUDIO_OUTPUT\|-act:AUDIO_CONTAINS_TEXT\|-as:AI_ASR_PROVIDER\|-at:AI_TTS_PROVIDER\|-ra:RERANK_AGENT\|-ew:ENABLE_WORKFLOW\|-tp:CHAT_TEMPERATURE` | map keys, seprated by `\|`                                                                                                                                                                                                                                                                                              |
| MAPPING_VALUE             | map values                  | `''`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | /set command mapping value, separated by \|, : separates multiple relationships, example: MAPPING_VALUE = "cson:claude-3-5-sonnet-20240620\|haiku:claude-3-haiku-20240307\|g4m:gpt-4o-mini\|g4:gpt-4o\|rp+:command-r-plus"                                                                                              |
| ENABLE_SHOWINFO           | show model name and time    | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Whether to display the model and time information                                                                                                                                                                                                                                                                       |
| SHOW_PARTS                | Display Information Section | `['model', 'model_time', 'token', 'tool', 'tool_time']`                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Display Information Section                                                                                                                                                                                                                                                                                             |
| USE_TOOLS                 | used tools                  | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | used tools                                                                                                                                                                                                                                                                                                              |
| USE_MCP                   | 使用MCP                     | `[]` string array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The MCP used is named after the name set in the environment variable.                                                                                                                                                                                                                                                   |
| JINA_API_KEY              | Jina API Key                | `[]` string array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Jina API Key, supports multiple                                                                                                                                                                                                                                                                                         |
| TOOL_MODEL                | Tool model                  | `''`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Tool model                                                                                                                                                                                                                                                                                                              |
| PROMPT                    | prompt                      | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Prompts, set in key-value pair format.                                                                                                                                                                                                                                                                                              |
| KLINGAI_COOKIE            | KlingAI Cookie              | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | KlingAI Cookie                                                                                                                                                                                                                                                                                                          |
| KLINGAI_IMAGE_COUNT       | KlingAI Image Count         | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | KlingAI Image Count                                                                                                                                                                                                                                                                                                     |
| KLINGAI_IMAGE_RATIO       | KlingAI Image Ratio         | `1:1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | KlingAI Image Ratio                                                                                                                                                                                                                                                                                                     |
| CHAT_TEMPERATURE          | Chat Temperature            | `undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Chat Temperature                                                                                                                                                                                                                                                                                                        |
| FUNCTION_CALL_TEMPERATURE | Function Call Temperature   | `undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Function Call Temperature                                                                                                                                                                                                                                                                                               |
| MAX_TOKENS                | Max Tokens                  | `undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Max Tokens                                                                                                                                                                                                                                                                                                              |
| MAX_STEPS                 | Max Steps                   | `3`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Max Steps                                                                                                                                                                                                                                                                                                               |
| MAX_RETRIES               | Max Retries                 | `0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Max Retries                                                                                                                                                                                                                                                                                                             |
| RERANK_AGENT              | Rerank Agent                | `google`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Rerank Agent                                                                                                                                                                                                                                                                                                            |
| JINA_RERANK_MODEL         | Jina Rerank Model           | `jina-colbert-v2`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Jina Rerank Model                                                                                                                                                                                                                                                                                                       |
| ENABLE_INTELLIGENT_MODEL  | Enable Intelligent Model    | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Enable Intelligent Model                                                                                                                                                                                                                                                                                                |
| TEXT_HANDLE_TYPE          | Text Handle Type            | `text`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Text handle type, to 'tts' or 'text' to chat with llm, or 'chat' by using audio-preview (default: text)                                                                                                                                                                                                                 |
| TEXT_OUTPUT               | Text Output                 | `text`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Text output type, 'audio' or 'text' (default: text)                                                                                                                                                                                                                                                                     |
| AUDIO_HANDLE_TYPE         | Audio Handle Type           | `stt`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Audio handle type, 'stt' or 'audio' to chat with llm, or 'chat' by using audio-preview (default: stt)                                                                                                                                                                                                                   |
| AUDIO_OUTPUT              | Audio Output                | `text`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Audio output type, 'audio' or 'text' (default: text)                                                                                                                                                                                                                                                                    |
| AUDIO_CONTAINS_TEXT       | Audio Contains Text         | `true`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Audio contains text                                                                                                                                                                                                                                                                                                     |
| DROPS_OPENAI_PARAMS       | Drops OpenAI Params         | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Drop openai params, the key is the model name, separated by commas, and the value is the parameters to be dropped, separated by commas.                                                                                                                                                                                 |
| COVER_MESSAGE_ROLE        | Cover Message Role          | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Cover message role, the key is the model name, separated by commas, and the value is overridden_role:new_role.                                                                                                                                                                                                          |
| MAX_HISTORY_LENGTH        | Max History Length          | `10`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Max History Length                                                                                                                                                                                                                                                                                                      |
| CONTINUE_STEP             | Continue Step               | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Continue Step                                                                                                                                                                                                                                                                                                           |
| MESSAGE_REPLACER             | Message replacer                  | `''`(key-value)                                 | Format: `{key: value}`, will replace key with value                                                                                                                                                                                                                                                     |
| PARAMS_MODIFIER           | Params Modifier             | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Parameter modifier; string array; separated by colons, the key is the model name, separated by commas; the value is the parameter modification value, modification values starting with '+' indicates addition, with the value after '=' and separated by '\|'; starting with '-' indicates addition indicate deletion. |
| WORKFLOW                  | Workflow                    | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Workflow                                                                                                                                                                                                                                                                                                                |
| ENABLE_ALIAS              | Enable Alias                | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Enable Alias                                                                                                                                                                                                                                                                                                            |



## Command

| Command    | Description                                                             | Example                                         |
|:-----------|:------------------------------------------------------------------------|:------------------------------------------------|
| `/help`    | Get command help.                                                       | `/help`                                         |
| `/new`     | Initiate a new conversation.                                            | `/new`                                          |
| `/start`   | Get your ID and start a new conversation.                               | `/start`                                        |
| `/img`     | Generate an image.                                                      | `/img Image Description`                        |
| `/version` | Get the current version number and determine if an update is needed.    | `/version`                                      |
| `/setenv`  | Set user configuration, see `User Configuration` for details.           | `/setenv KEY=VALUE`                             |
| `/setenvs` | Batch setting user configuration, see "User Configuration" for details. | `/setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}` |
| `/delenv`  | Delete user configuration.                                              | `/delenv KEY`                                   |
| `/system`  | View some current system information.                                   | `/system`                                       |
| `/redo`    | Edit the previous question or provide a different answer.               | `/redo Modified content.` or `/redo`            |
| `/echo`    | Echo message, only available in development mode.                       | `/echo`                                         |

## Custom command

In addition to the commands defined by the system, you can also customize shortcut commands, which can simplify some longer commands into a single word command.

Custom commands use environment variables to set `CUSTOM_COMMAND_XXX`, where XXX is the command name, such as `CUSTOM_COMMAND_azure`, and the value is the command content, such as `/setenvs {"AI_CHAT_PROVIDER": "azure"}`. This allows you to use `/azure` instead of `/setenvs {"AI_CHAT_PROVIDER": "azure"}` to quickly switch AI providers.

Here are some examples of custom commands.

| Command                | Value                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------|
| CUSTOM_COMMAND_azure   | `/setenvs {"AI_CHAT_PROVIDER": "azure"}`                                                                          |
| CUSTOM_COMMAND_workers | `/setenvs {"AI_CHAT_PROVIDER": "workers"}`                                                                        |
| CUSTOM_COMMAND_gpt3    | `/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-3.5-turbo"}`                                   |
| CUSTOM_COMMAND_gpt4    | `/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-4"}`                                           |
| CUSTOM_COMMAND_cn2en   | `/setenvs {"SYSTEM_INIT_MESSAGE": "You are a translator. Please translate everything I say below into English."}` |

If you are using TOML for configuration, you can use the following method:

```toml
CUSTOM_COMMAND_azure= '/setenvs {"AI_CHAT_PROVIDER": "azure"}'
CUSTOM_COMMAND_workers = '/setenvs {"AI_CHAT_PROVIDER": "workers"}'
CUSTOM_COMMAND_gpt3 = '/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-3.5-turbo"}'
CUSTOM_COMMAND_gpt4 = '/setenvs {"AI_CHAT_PROVIDER": "openai", "OPENAI_CHAT_MODEL": "gpt-4"}'
CUSTOM_COMMAND_cn2en = '/setenvs {"SYSTEM_INIT_MESSAGE": "You are a translator. Please translate everything I say below into English."}'
```

## Custom commands description

If you want to add help information for a custom command, you can use environment variables to set `COMMAND_DESCRIPTION_XXX`, where `XXX` is the name of the command, such as `COMMAND_DESCRIPTION_azure`, and the value is the description of the command, such as `Switch AI provider to Azure`. This way, you can use `/help` to view the help information for the custom command.

The following are some examples of custom command help information.

| Command                     | Value                                            |
|-----------------------------|--------------------------------------------------|
| COMMAND_DESCRIPTION_azure   | Switch AI provider to Azure.                     |
| COMMAND_DESCRIPTION_workers | Switch AI provider to Workers                    |
| COMMAND_DESCRIPTION_gpt3    | Switch AI provider to OpenAI GPT-3.5 Turbo.      |
| COMMAND_DESCRIPTION_gpt4    | Switch AI provider to OpenAI GPT-4.              |
| COMMAND_DESCRIPTION_cn2en   | Translate the conversation content into English. |

If you are using TOML for configuration, you can use the following method:

```toml
COMMAND_DESCRIPTION_azure = 'Switch AI provider to Azure.'
COMMAND_DESCRIPTION_workers = 'Switch AI provider to Workers'
COMMAND_DESCRIPTION_gpt3 = 'Switch AI provider to OpenAI GPT-3.5 Turbo.'
COMMAND_DESCRIPTION_gpt4 = 'Switch AI provider to OpenAI GPT-4.'
COMMAND_DESCRIPTION_cn2en = 'Translate the conversation content into English.'
```

If you want to bind custom commands to the menu of Telegram, you can add the following environment variable `COMMAND_SCOPE_azure = "all_private_chats,all_group_chats,all_chat_administrators"`, so that the plugin will take effect in all private chats, group chats and groups.

## Custom TOOLS

Custom TOOLS, prefixed with `PLUGIN_FUNCTION_`, such as `PLUGIN_FUNCTION_weather`, the value is the definition of the TOOLS, such as:
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
The environment variable is prefixed with `PLUGIN_ENV_`, such as `PLUGIN_ENV_QWEATHER_TOKEN`, the value is `QWEATHER_TOKEN`, used to replace `{{QWEATHER_TOKEN}}`.

Detailed examples can be found in the [qweather](../../src/tools/external/qweather.json) file.

---

## Custom MCP

Custom MCP, environment variable prefixed with `MCP_`, such as `MCP_amap`, the value is the definition of the MCP.

### sse:
Parameter definition:
```json
{
    type: 'sse';
    url: string;
    headers?: Record<string, string>;
}
```
Example:
```json
{
    "type": "sse",
    "url": "https://mcp.amap.com/sse?key=<YOUR_API_KEY>"
}
```

### stdio:
Parameter definition:
```json
{
    type: 'stdio';
    command: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
}
```
Example:
```json
{
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@amap/amap-maps-mcp-server"],
    "env": {"AMAP_MAPS_API_KEY": "<YOUR_API_KEY>"}
}
```

You can mount local files, for example:
```json
{
    "type": "stdio",
    "command": "node",
    "args": ["server.test.ts"],
    "cwd": "src/mcp"
}
```

### stream http:
Parameter definition:
```json
{
    type: 'http';
    url: string;
}
```
Example:
```json
{
    "type": "http",
    "url": "https://example.com/mcp"
}
```
