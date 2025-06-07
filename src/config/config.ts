import type { LogLevelType } from './types';
import prompts_default from '../utils/others/prompt';
// -- 只能通过环境变量覆盖的配置 --
export class EnvironmentConfig {
    // 多语言支持
    LANGUAGE = 'zh-cn';
    // 检查更新的分支
    UPDATE_BRANCH = 'master';
    // Chat Complete API Timeout, scale: seconds
    CHAT_COMPLETE_API_TIMEOUT = 0;
    // Total Duration Limit, scale: seconds, default 30 minutes
    CHAT_TOTAL_DURATION_LIMIT = 60 * 30;
    // tool timeout, scale: seconds
    TOOL_TIMEOUT = 0;
    // -- Telegram 相关 --
    //
    // Telegram API Domain
    TELEGRAM_API_DOMAIN = 'https://api.telegram.org';
    // 允许访问的Telegram Token， 设置时以逗号分隔
    TELEGRAM_AVAILABLE_TOKENS: string[] = [];
    // 默认消息模式
    DEFAULT_PARSE_MODE = 'MarkdownV2';
    // 最小stream模式消息间隔，小于等于0则不限制 单位：ms
    TELEGRAM_MIN_STREAM_INTERVAL = 0;
    // 图片尺寸偏移 0为第一位，-1为最后一位, 越靠后的图片越大。PS: 图片过大可能导致token消耗过多，或者workers超时或内存不足
    // 默认选择次高质量的图片
    TELEGRAM_PHOTO_SIZE_OFFSET = -2;
    // 向LLM优先传递图片方式：url, base64
    TELEGRAM_IMAGE_TRANSFER_MODE = 'url';

    // --  权限相关 --
    //
    // 允许所有人使用
    I_AM_A_GENEROUS_PERSON = false;
    // 白名单
    CHAT_WHITE_LIST: string[] = [];
    // 用户配置
    LOCK_USER_CONFIG_KEYS = [
        // 默认为API BASE 防止被替换导致token 泄露
        'OPENAI_API_BASE',
        'GOOGLE_API_BASE',
        'MISTRAL_API_BASE',
        'COHERE_API_BASE',
        'ANTHROPIC_API_BASE',
        'AZURE_COMPLETIONS_API',
        'AZURE_DALLE_API',
        'GOOGLE_API_BASE',
        'VERTEX_CREDENTIALS',
        'OAILIKE_API_BASE',
        'XAI_API_BASE',
    ];

    // -- 群组相关 --
    //
    // 允许访问的Telegram Token 对应的Bot Name， 设置时以逗号分隔
    TELEGRAM_BOT_NAME: string[] = [];
    // 群组白名单
    CHAT_GROUP_WHITE_LIST: string[] = [];
    // 群组机器人开关
    GROUP_CHAT_BOT_ENABLE = true;
    // 群组机器人共享模式,关闭后，一个群组只有一个会话和配置。开启的话群组的每个人都有自己的会话上下文
    GROUP_CHAT_BOT_SHARE_MODE = true;

    // -- 历史记录相关 --
    //
    // 是否自动裁剪历史记录
    AUTO_TRIM_HISTORY = true;
    // Image占位符: 当此环境变量存在时，则历史记录中的图片将被替换为此占位符
    HISTORY_IMAGE_PLACEHOLDER: string | null = '[A IMAGE]';

    // -- 特性开关 --
    //
    // 隐藏部分命令按钮
    HIDE_COMMAND_BUTTONS: string[] = [];
    // 禁用部分命令
    BLOCK_COMMANDS: string[] = [];
    // 显示快捷回复按钮
    SHOW_REPLY_BUTTON = false;
    // 额外引用消息开关
    EXTRA_MESSAGE_CONTEXT = false;
    // 禁用内置工具
    BLOCK_TOOLS: string[] = [];
    // 禁用Agent
    BLOCK_AGENTS: string[] = [];

    // -------------

    // Whether to read files
    /**
     * @deprecated Use a higher granularity parameter SUPPORT_FORMAT.
     */
    ENABLE_FILE = true;
    // Supported file formats: text, photo, voice, audio, video(based on model support), document(send image、audio、text as file), sticker(gif, jpg, png, webp, webm as video)
    SUPPORT_FORMAT: string[] = ['text', 'photo', 'voice', 'audio', 'image'];
    // In group chats, the reply object is the trigger object by default, and when enabled, it is prioritized as the object to be replied to
    ENABLE_REPLY_TO_MENTION = false;
    // Ignore messages starting with specified text
    IGNORE_TEXT_PREFIX = '';
    // When multiple processes, whether to hide intermediate step information
    HIDE_MIDDLE_MESSAGE = false;
    /**
     * Replace words, and will force trigger bot { ':n': '/new', ':g3': '/gpt3', ':g4': '/gpt4'}
     * @deprecated, use CHAT_TRIGGER_SUFFIX and COMMAND_TRIGGERS instead
     */
    CHAT_MESSAGE_TRIGGER = {};
    // Chat trigger prefix, it will trigger group message and be deleted
    CHAT_TRIGGER_PREFIX = '';
    /**
     * Ask AI to call function times
     * @deprecated
     */
    FUNC_LOOP_TIMES = 1;
    // Show call info
    CALL_INFO = true;
    /**
     * func call Maximum number of concurrent calls after each successful hit
     * @deprecated
     */
    CON_EXEC_FUN_NUM = 1;
    // When the length reaches the set value, the group will send a telegraph article. If less than 0, it will not be sent
    TELEGRAPH_NUM_LIMIT = -1;
    // Telegraph scope
    TELEGRAPH_SCOPE: string[] = ['group', 'supergroup'];
    // Telegraph author link; The author of the article is currently the robot ID, and if not set, it is anonymous
    TELEGRAPH_AUTHOR_URL = '';
    // Disable link preview
    DISABLE_WEB_PREVIEW = false;
    // Message expired time, scale: minute
    EXPIRED_TIME = -1;
    // Schedule check time use cron expression, for example '*/10 0-2,6-23 * * *' means every ten minutes from 0 to 2 and from 6 to 23
    CRON_CHECK_TIME = '';
    // Schedule group delete type tip dialog:tip and chat dialog:chat
    SCHEDULE_GROUP_DELETE_TYPE = ['tip'];
    // Schedule private delete type command dialog:command and chat dialog:chat
    SCHEDULE_PRIVATE_DELETE_TYPE = ['tip'];

    /**
     * All complete api timeout
     * @deprecated
     */
    ALL_COMPLETE_API_TIMEOUT = 180;
    /**
     * Function call timeout
     * @deprecated
     */
    FUNC_TIMEOUT = 15;
    // Send pictures via files format
    SEND_IMAGE_AS_FILE: boolean = false;
    // Perplexity cookie
    PPLX_COOKIE: string | null = null;
    // Log level
    LOG_LEVEL: LogLevelType = 'info';

    // -------------

    // -- 模式开关 --
    //
    // 使用流模式
    STREAM_MODE = true;
    // 安全模式 异步模式（polling, 异步webhook）下可关闭
    SAFE_MODE = true;
    // 调试模式
    DEBUG_MODE = false;
    // 开发模式
    DEV_MODE = false;

    QSTASH_URL = 'https://qstash.upstash.io';
    // qstash token
    QSTASH_TOKEN = '';
    // qstash callback url, your telegram bot webhook domain
    QSTASH_PUBLISH_URL = '';
    // qstash trigger prefix
    QSTASH_TRIGGER_PREFIX = '';
    // qstash timeout
    // free account max timeout 15m
    QSTASH_TIMEOUT = '15m';

    FISH_REFERENCE_IDS: Record<string, string> = {
        '丁真': '54a5170264694bfc8e9ad98df7bd89c3',
        '雷军': '4462fa28f3824bff808a94a6075570e5',
        '小明剑魔': '4f77d5137e15401b96617895a2275923',
        '央视配音': '59cb5986671546eaa6ca8ae6f29f6d22',
        '麦当劳': '4066d617322e41abb30ed70eaeaf273f',
        '赛马娘': '0eb38bc974e1459facca38b359e13511',
        '郑翔洲': '63393102cf1248849477da56ee5dc3ae',
        '蔡徐坤': 'e4642e5edccd4d9ab61a69e82d4f8a14',
        '女大学生': '5c353fdb312f4888836a9a5680099ef0',
        '董宇辉': '8f454f665d214e4284ba05f703b63960',
        '黑手': 'f7561ff309bd4040a59f1e600f4f4338',
        '奶龙(效果最好的一个)': '3d1cb00d75184099992ddbaf0fdd7387',
        '陶矜': 'acb16651a5e14be89b7826a2e24687cd',
        '邓紫琪': '3b55b3d84d2f453a98d8ca9bb24182d6',
        '郭德纲': '4914b8e04e2148118c91f322d409ccc6',
        '毕业季温情女学生': 'a1417155aa234890aab4a18686d12849',
        '女主播': '57eab548c7ed4ddc974c4c153cb015b2',
        '影视解说': 'b4bdf5dc66004241a21ff2df165bf442',
        '麦克阿瑟': '405736979e244634914add64e37290b0',
        '甜美女主播': 'e752df7d20cd4576af9a207520349a33',
        '男科医生': '610ab13942834060ba4f3fbd1ca94aa6',
        '台灣彭總 新聲2025': '9f3de3329541472d9b16f9ac2c345351',
        '懒羊羊': '131c6b3a889543139680d8b3aa26b98d',
        '骚气御姐音': 'f44181a3d6d444beae284ad585a1af37',
        '刘德华': 'cb03a4a3ff6a4784b319cde85a07e31c',
    };

    // Only relax /set command temporarily modifies permissions
    RELAX_AUTH_KEYS: string[] = [];
    // inline query send interval
    INLINE_QUERY_SEND_INTERVAL = 2000;
    // inline query show info
    INLINE_QUERY_SHOW_INFO = false;
    // If true, will store media group file id
    STORE_MEDIA_MESSAGE: boolean = false;
    // If true, will store text chunk when message separated to multiple chunks
    STORE_TEXT_CHUNK_MESSAGE: boolean = false;
    // Audio text format
    AUDIO_TEXT_FORMAT: undefined | 'spoiler' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'pre' = undefined;
    // when message length exceeds this value, the message will be set as quotation, with QUOTE_EXPANDABLE set to true to expand the message, set -1 to disable
    ADD_QUOTE_LIMIT = -1;
    // Fold message scope, support group supergroup private
    ADD_QUOTE_SCOPE: string[] = ['group', 'supergroup'];

    // If true, will expand the quote message; log always be expandable
    QUOTE_EXPANDABLE = false;
    // whether log position on top, default is true
    LOG_POSITION_ON_TOP = true;

    // Store history message length
    STORE_HISTORY_LENGTH = 64;
    // File size limit, when enabled folding, the file size limit is effective
    FILE_SIZE_LIMIT = -1;
    // inline keyboard callback row count x column count
    CALLBACK_QUERY_RC = '7x2';
    // envs variables, in the callback query, if it is empty, all variables will be displayed;
    // otherwise, only the set variables will be shown.
    ENVS_VARIABLES = [];
    // callback menu, if it is empty, all options will be displayed.
    // options: 'AI_CHAT_PROVIDER', 'AI_IMAGE_PROVIDER', 'AI_TTS_PROVIDER', 'AI_ASR_PROVIDER', 'USE_TOOLS', 'USE_MCP', 'USE_OAILIKE_RELAY_TOOLS', 'CHAT_MODEL', 'IMAGE_MODEL', 'VISION_MODEL', 'TOOL_MODEL', 'ENVS', 'RERANK_AGENT'
    CALLBACK_MENU = [];

    // Whether to transform  tool_call/tool_result message to user message
    MESSAGE_COMPATIBLE = true;
    // whether to display search source
    ENABLE_SEARCH_SOURCE = true;
    // Whether to show thinking text
    SHOW_THINKING_TEXT = true;

    // TODO: override command auth, key is command, value is auth role, support: 'creator', 'administrator', null
    // COMMAND_AUTH_OVERRIDE: Record<string, string[]> = {
    //     '/tts': ['creator', 'administrator'],
    // };
}

// -- 通用配置 --
export class AgentShareConfig {
    // AI提供商: openai, anthropic, azure, workers, google, vertex, mistral, xai, oailike
    AI_CHAT_PROVIDER = 'openai';
    // AI图片提供商: openai, azure, workers
    AI_IMAGE_PROVIDER = 'openai';
    // AI ASR 提供商: openai, oailike
    AI_ASR_PROVIDER = 'openai';
    // AI TTS 提供商: openai, oailike
    AI_TTS_PROVIDER = 'openai';
    // 全局默认初始化消息
    SYSTEM_INIT_MESSAGE: string | null = null;
}

// -- Open AI 配置 --
export class OpenAIConfig {
    // OpenAI API Key
    OPENAI_API_KEY: string[] = [];
    // OpenAI Model
    OPENAI_CHAT_MODEL = 'gpt-4o-mini';
    // OpenAI API BASE ``
    OPENAI_API_BASE = 'https://api.openai.com/v1';
    // OpenAI API Extra Params, key is model name prefix, separated by commas; value is extra Params, support path(camelCase), split by '.'
    // for example: OPENAI_API_EXTRA_PARAMS = { 'gpt-4o-mini,gpt-4o-2024-08-06': { 'temperature': 0.5 } };
    OPENAI_API_EXTRA_PARAMS: Record<string, Record<string, any>> = {};
    // OpenAI STT Model
    OPENAI_STT_MODEL = 'whisper-1';
    // OpenAI Vision Model
    OPENAI_VISION_MODEL = 'gpt-4o-mini';
    // OpenAI TTS Model
    OPENAI_TTS_MODEL = 'tts-1';
    // OpenAI TTS Extra Params
    OPENAI_TTS_EXTRA_PARAMS: Record<string, Record<string, any>> = {};

    OPENAI_TTS_VOICE = 'alloy';
    /**
     * OpenAI need transform model
     * @deprecated
     */
    OPENAI_NEED_TRANSFORM_MODEL: string[] = ['o1-mini-all', 'o1-mini-preview-all'];
    OPENAI_EMBEDDING_MODEL = 'text-embedding-3-small';

    /**
     * OpenAI Reasoning Effort, only for starts with 'o1'
     * reasoning_effort: 'low', 'medium', 'high'
     * @deprecated use OPENAI_API_EXTRA_PARAMS instead
     */
    OPENAI_REASONING_EFFORT: 'low' | 'medium' | 'high' | undefined = undefined;
    OPENAI_MODELS = [];
    OPENAI_MODELS_API = '/models';
    OPENAI_TTS_PROMPT = '';
}

// -- DALLE 配置 --
export class DalleAIConfig {
    // DALL-E的模型名称
    DALL_E_MODEL = 'dall-e-3';
    // DALL-E图片尺寸
    DALL_E_IMAGE_SIZE = '1024x1024';
    // DALL-E图片质量
    DALL_E_IMAGE_QUALITY = 'standard';
    // DALL-E图片风格
    DALL_E_IMAGE_STYLE = 'vivid';
}

// -- AZURE 配置 --
export class AzureConfig {
    // Azure API Key
    AZURE_API_KEY: string | null = null;
    // Azure Completions API
    // https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/chat/completions?api-version=VERSION_NAME
    AZURE_COMPLETIONS_API: string | null = null;
    // Azure DallE API
    // https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/images/generations?api-version=VERSION_NAME
    AZURE_DALLE_API: string | null = null;
    AZURE_MODELS = [];
    AZURE_MODELS_API = '';
}

// -- Workers 配置 --
export class WorkersConfig {
    // Cloudflare Account ID
    CLOUDFLARE_ACCOUNT_ID: string | null = null;
    // Cloudflare Token
    CLOUDFLARE_TOKEN: string | null = null;
    // Text Generation Model
    WORKERS_CHAT_MODEL = '@cf/mistral/mistral-7b-instruct-v0.1 ';
    // Text-to-Image Model
    WORKERS_IMAGE_MODEL = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
    WORKERS_MODELS = [];

    // https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai/models/search
    WORKERS_MODELS_API = '';
}

// -- Gemini 配置 --
export class GeminiConfig {
    // Google Gemini API Key
    GOOGLE_API_KEY: string | null = null;
    // Google Gemini API: Cloudflare AI gateway: https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/google-ai-studio/v1/models
    GOOGLE_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
    // Google Gemini Model
    GOOGLE_CHAT_MODEL = 'gemini-2.0-flash';
    // Google Gemini Vision Model
    GOOGLE_VISION_MODEL = 'gemini-2.0-flash';
    // Google Gemini Image Model
    GOOGLE_IMAGE_MODEL = 'gemini-2.0-flash-exp';
    // Google Embedding Model
    GOOGLE_EMBEDDING_MODEL = 'text-embedding-004';
    // Google API Extra Params, key is model name prefix, separated by commas; value is extra Params, support path(camelCase), split by '.'
    // for example: GOOGLE_API_EXTRA_PARAMS = { 'gemini-2.0-flash,gemini-2.5-flash': { 'generationConfig.temperature': 0.5 } };
    // GOOGLE_API_EXTRA_PARAMS: Record<string, Record<string, any>> = {
    //     'gemini-2.5-flash': {
    //         'generationConfig.thinkingConfig': {
    //             includeThoughts: false,
    //             thinkingBudget: 0,
    //         },
    //     },
    // };

    GOOGLE_API_EXTRA_PARAMS: Record<string, Record<string, any>> = {};
    GOOGLE_MODELS = [];
    GOOGLE_MODELS_API = '/models';
    GOOGLE_BUILDIN = ['googleSearch', 'codeExecution', 'urlContext'];
    USE_GOOGLE_BUILDIN: string[] = [];
    GOOGLE_TTS_MODEL = 'gemini-2.5-flash-preview-tts';
    // available voices: https://ai.google.dev/gemini-api/docs/speech-generation#voices
    GOOGLE_TTS_VOICE = 'Zephyr';
    GOOGLE_TTS_PROMPT = '';
    // It is mutually exclusive with GOOGLE_TTS_VOICE
    GOOGLE_TTS_EXTRA_PARAMS: Record<string, any> = {
    //     multi_speaker_voice_config: {
    //         speaker_voice_configs: [
    //             {
    //                 speaker: 'Speaker1',
    //                 voice_config: {
    //                     prebuilt_voice_config: {
    //                         voice_name: 'Kore',
    //                     },
    //                 },
    //             },
    //             {
    //                 speaker: 'Speaker2',
    //                 voice_config: {
    //                     prebuilt_voice_config: {
    //                         voice_name: 'Puck',
    //                     },
    //                 },
    //             },
    //         ],
    //     },
    //     language_code: 'en-US',
    };
}

// -- Mistral 配置 --
export class MistralConfig {
    // mistral api key
    MISTRAL_API_KEY: string | null = null;
    // mistral api base
    MISTRAL_API_BASE = 'https://api.mistral.ai/v1';
    // mistral api model
    MISTRAL_CHAT_MODEL = 'mistral-tiny';
    MISTRAL_MODELS = [];
    MISTRAL_MODELS_API = '/models';
}

// -- Cohere 配置 --
export class CohereConfig {
    // cohere api key
    COHERE_API_KEY: string | null = null;
    // cohere api base
    COHERE_API_BASE = 'https://api.cohere.com/v1';
    // cohere api model
    COHERE_CHAT_MODEL = 'command-r-plus';
    COHERE_MODELS = [];
    COHERE_MODELS_API = '/models';
}

// -- Anthropic 配置 --
export class AnthropicConfig {
    // Anthropic api key
    ANTHROPIC_API_KEY: string | null = null;
    // Anthropic api base
    ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1';
    // Anthropic api model
    ANTHROPIC_CHAT_MODEL = 'claude-3-5-haiku-20241022';
    // Anthropic vision model
    ANTHROPIC_VISION_MODEL = 'claude-3-5-haiku-20241022';
    // Anthropic API Extra Params, key is model name prefix, separated by commas; value is extra Params, support path(camelCase), split by '.'
    // for example: ANTHROPIC_API_EXTRA_PARAMS = { 'claude-3-5': { 'temperature': 0.5 } };
    ANTHROPIC_API_EXTRA_PARAMS: Record<string, Record<string, any>> = {
        'claude-3-7-sonnet': {
            temperature: 1,
            thinking: {
                type: 'enabled',
                budget_tokens: 4096,
            },
        },
    };

    ANTHROPIC_MODELS = [];
    ANTHROPIC_MODELS_API = '/models';
}

export class OpenAILikeConfig {
    // oailike api key
    OAILIKE_API_KEY: string | null = null;
    // oailike api base
    OAILIKE_API_BASE = 'https://api.openai.com/v1';
    // oailike api model
    OAILIKE_CHAT_MODEL = 'gpt-4o-mini';
    // oailike image model
    OAILIKE_IMAGE_MODEL = 'dall-e-3';
    // oailike vision model
    OAILIKE_VISION_MODEL = 'gpt-4o-mini';
    // oailike image size
    OAILIKE_IMAGE_SIZE = '1024x1024';
    // oailike embedding model
    OAILIKE_EMBEDDING_MODEL = 'text-embedding-3-small';
    // oailike rerank model
    OAILIKE_RERANK_MODEL = '';
    // oailike asr model
    OAILIKE_STT_MODEL = 'FunAudioLLM/SenseVoiceSmall';
    // oailike tts model
    OAILIKE_TTS_MODEL = 'tts-1';
    // oailike tts extra params
    OAILIKE_TTS_EXTRA_PARAMS: Record<string, Record<string, any>> = {};
    // oailike tts voice
    OAILIKE_TTS_VOICE = 'alloy';
    // OAILIKE API Extra Params, key is model name prefix, separated by commas; value is extra Params, support path(camelCase), split by '.'
    // for example: OAILIKE_API_EXTRA_PARAMS = { 'gpt-4o': { 'temperature': 0.5 } };
    OAILIKE_API_EXTRA_PARAMS: Record<string, Record<string, any>> = {};
    OAILIKE_MODELS = [];
    OAILIKE_MODELS_API = '/models';
    // oailike relay
    OAILIKE_RELAY_TOOLS: Record<string, string[]> = {
        gemini: ['googleSearch', 'codeExecution', 'urlContext'],
    };

    // use oailike relay tools, support 'googleSearch, codeExecution, urlContext'
    USE_OAILIKE_RELAY_TOOLS: string[] = [];
}

export class VertexConfig {
    // Google Project id
    VERTEX_PROJECT_ID: string | null = null;
    VERTEX_LOCATION = 'us-central1';
    // Vertex Credentials: need obtain client_email & private_key from google cloud console
    VERTEX_CREDENTIALS: Record<string, any> = {};

    // Vertex Model
    VERTEX_CHAT_MODEL = 'gemini-2.0-flash';
    // Vertex Vision Model
    VERTEX_VISION_MODEL = 'gemini-2.0-flash';
    // when use search grounding, do not use other tools at the same time, otherwise errors occur.
    SEARCH_GROUNDING = false;
    // Vertex Image Model
    VERTEX_IMAGE_MODEL = 'imagen-3.0-fast-generate-001';
    VERTEX_MODELS = [];

    // https://{service-endpoint}/v1/{parent}/models
    // Where {service-endpoint} is one of the [supported service endpoints](https://cloud.google.com/vertex-ai/docs/reference/rest#rest_endpoints).
    // parent: Required. The resource name of the Location to list the Models from. Format: projects/{project}/locations/{location}
    VERTEX_MODELS_API = '';
}

export class XAIConfig {
    // XAI api key
    XAI_API_KEY: string | null = null;
    // XAI api base
    XAI_API_BASE = 'https://api.x.ai/v1';
    // XAI api model
    XAI_CHAT_MODEL = 'grok-3';
    XAI_VISION_MODEL = 'grok-2-vision';
    // XAI API Extra Params, key is model name prefix, separated by commas; value is extra Params,  support path(camelCase), split by '.'
    // for example: XAI_API_EXTRA_PARAMS = { 'grok-3': { 'temperature': 0.5 } };
    XAI_API_EXTRA_PARAMS: Record<string, Record<string, any>> = {};
    XAI_MODELS = [];
    XAI_MODELS_API = '/models';
}

export class FishConfig {
    // Fish api key
    FISH_API_KEY: string | null = null;
    // Fish api base
    FISH_API_BASE = ' https://api.fish.audio/v1';
    // Fish reference id, if not set, will use tts model
    FISH_TTS_VOICE = '';
    // Fish TTS Model
    FISH_TTS_MODEL = 'speech-1.6';
    FISH_TTS_EXTRA_PARAMS: Record<string, any> = {};
}

export class DefineKeys {
    DEFINE_KEYS: string[] = [];
}

export class ExtraUserConfig {
    MAPPING_KEY = '-p:SYSTEM_INIT_MESSAGE|-n:MAX_HISTORY_LENGTH|-a:AI_CHAT_PROVIDER|-ai:AI_IMAGE_PROVIDER|-m:CHAT_MODEL|-md:CURRENT_MODE|-v:VISION_MODEL|-t:OPENAI_TTS_MODEL|-ex:OPENAI_API_EXTRA_PARAMS|-mk:MAPPING_KEY|-mv:MAPPING_VALUE|-tm:TOOL_MODEL|-tool:USE_TOOLS|-im:IMAGE_MODEL|-th:TEXT_HANDLE_TYPE|-to:TEXT_OUTPUT|-ah:AUDIO_HANDLE_TYPE|-ao:AUDIO_OUTPUT|-act:AUDIO_CONTAINS_TEXT|-as:AI_ASR_PROVIDER|-at:AI_TTS_PROVIDER|-ra:RERANK_AGENT|-ew:ENABLE_WORKFLOW|-tp:CHAT_TEMPERATURE';
    // /set command mapping value, separated by |, : separates multiple relationships
    MAPPING_VALUE = '';
    // MAPPING_VALUE = "cson:claude-3-5-sonnet-20240620|haiku:claude-3-haiku-20240307|g4m:gpt-4o-mini|g4:gpt-4o|rp+:command-r-plus";
    // Whether to show model and time information in the message
    ENABLE_SHOWINFO = false;
    // enable Show info, which parts to show, support model, model_time, token, tool, tool_time, first_chunk_time
    SHOW_PARTS = ['model', 'model_time', 'token', 'tool', 'tool_time'];
    // Function to use, currently has duckduckgo, jina_reader, icloud_price, nf_price, iap_price, currency
    //
    USE_TOOLS: string[] = [];
    USE_MCP: string[] = [];
    JINA_API_KEY: string[] = [];
    // if starts with '{agent}:' prefix, the specified agent corresponds to the chat model,
    // otherwise use the current agent and the specified model.
    // Keep empty to use the current agent chat model as function call model.
    TOOL_MODEL = '';
    PROMPT: Record<string, string> = prompts_default;
    // KlingAI Cookie
    KLINGAI_COOKIE: string[] = [];
    // KlingAI Image Count
    KLINGAI_IMAGE_COUNT = 1;
    // KlingAI Image Ratio
    KLINGAI_IMAGE_RATIO = '1:1';

    // chat agent temperature
    CHAT_TEMPERATURE: number | undefined = undefined;
    // function call temperature
    FUNCTION_CALL_TEMPERATURE: number | undefined = undefined;
    // chat max tokens
    MAX_TOKENS: number | undefined = undefined;
    // chat agent max steps
    MAX_STEPS = 5;
    // chat agent max retries
    MAX_RETRIES = 0;
    // Rerank Agent, jina or openai or oailikeV1 or oailikeV2 or google
    // oailikeV1 means use embedding model, oailikeV2 means use rerank model to rerank
    RERANK_AGENT = 'google';
    // Jina Rerank Model
    JINA_RERANK_MODEL = 'jina-colbert-v2';
    // Whether to enable intelligent model processing
    ENABLE_INTELLIGENT_MODEL = false;
    // text handle type, to 'tts' or 'text' to chat with llm, or 'chat' by using audio-preview (default: text)
    TEXT_HANDLE_TYPE: 'tts' | 'text' | 'chat' = 'text';
    // Text output type, 'audio' or 'text' (default: text)
    TEXT_OUTPUT: 'audio' | 'text' = 'text';
    // Audio handle type, 'stt' or 'audio' to chat with llm, or 'chat' by using audio-preview (default: stt)
    AUDIO_HANDLE_TYPE: 'stt' | 'audio' | 'chat' = 'stt';
    // Audio output type, 'audio' or 'text' (default: text)
    AUDIO_OUTPUT: 'audio' | 'text' = 'text';
    // Audio contains text
    AUDIO_CONTAINS_TEXT = true;
    // Drop openai params, the key is the model name,
    // separated by commas, and the value is the parameters to be dropped, separated by commas.
    // example: DROPS_OPENAI_PARAMS = { 'o1-mini,o1-preview': 'max_tokens,temperature,stream' };
    /**
     * @deprecated Use PARAMS_MODIFIER instead
     */
    DROPS_OPENAI_PARAMS: Record<string, string> = {};
    // Cover message role, the key is the model name, separated by commas, and the value is overridden_role:new_role.
    // example: COVER_MESSAGE_ROLE = { 'o1-mini,o1-preview': 'system:user' };
    COVER_MESSAGE_ROLE: Record<string, string> = {};
    // max history length, default is 10
    MAX_HISTORY_LENGTH = 10;
    // whether to generate long text (limited by MAX_STEPS)
    CONTINUE_STEP = false;
    // message replacer, you can use it to replace message text in the middle of the message, multiple words can be replaced at the same time
    MESSAGE_REPLACER: Record<string, string> = {};
    // Parameter modifier; string array; separated by colons, the key is the model name, separated by commas;
    // the value is the parameter modification value, modification values starting with '+' indicates addition, with the value after '=' and separated by '|'; starting with '-' indicates addition indicate deletion.
    // note: not support stream option
    // for example: PARAMS_MODIFIER = ['o1-mini,o3-mini:-temperature|+max_tokens=1000'];
    // priority is higher than EXTRA_PARAMS
    PARAMS_MODIFIER: string[] = ['o1-mini,o3-mini,gpt-4o-mini-search-preview,gpt-4o-search-preview:-temperature'];
    // start with @key to trigger workflow, support agent, model, temperature, max_tokens;
    // next is the next step prompt: {{result}} is the result of the current step result, {{question}} is user input
    WORKFLOW: {
        [key: string]: {
            agent: string;
            model: string;
            temperature: number;
            max_tokens: number;
            next: string;
        }[];
    } = {
        // think: [{
        //     agent: 'oailike',
        //     model: 'deepseek-reasoner',
        //     temperature: 0.3,
        //     max_tokens: 1,
        //     next: `思考内容: {{result}}\n\n基于以上思考回答问题: {{question}}`,
        // }],
    };

    // whether to enable workflow
    ENABLE_WORKFLOW = false;
    // whether to enable model alias of mapping value
    ENABLE_ALIAS = false;
    // 音频提示词
    AUDIO_PROMPT = 'Please listen to the audio file. Identify and understand the question being asked in the audio. Then, provide a detailed explanation and answer to this question. Ensure your answer is helpful and explains the solution or information clearly.';
}
