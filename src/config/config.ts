import type { FuncTool } from '../extra/tools/types';
import type { FlowStruct, LogLevelType } from './types';
import prompts_default from '../extra/prompt';
import tools_default from '../extra/tools';
// -- 只能通过环境变量覆盖的配置 --
export class EnvironmentConfig {
    // 多语言支持
    LANGUAGE = 'zh-cn';
    // 检查更新的分支
    UPDATE_BRANCH = 'master';
    // Chat Complete API Timeout
    CHAT_COMPLETE_API_TIMEOUT = 0;

    // -- Telegram 相关 --
    //
    // Telegram API Domain
    TELEGRAM_API_DOMAIN = 'https://api.telegram.org';
    // 允许访问的Telegram Token， 设置时以逗号分隔
    TELEGRAM_AVAILABLE_TOKENS: string[] = [];
    // 默认消息模式
    DEFAULT_PARSE_MODE = 'Markdown';
    // 最小stream模式消息间隔，小于等于0则不限制
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
        'GOOGLE_COMPLETIONS_API',
        'MISTRAL_API_BASE',
        'COHERE_API_BASE',
        'ANTHROPIC_API_BASE',
        'AZURE_COMPLETIONS_API',
        'AZURE_DALLE_API',
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
    // 为了避免4096字符限制，将消息删减
    AUTO_TRIM_HISTORY = true;
    // 最大历史记录长度
    MAX_HISTORY_LENGTH = 20;
    // 最大消息长度
    MAX_TOKEN_LENGTH = -1;
    // Image占位符: 当此环境变量存在时，则历史记录中的图片将被替换为此占位符
    HISTORY_IMAGE_PLACEHOLDER: string | null = '[A IMAGE]';

    // -- 特性开关 --
    //
    // 隐藏部分命令按钮
    HIDE_COMMAND_BUTTONS: string[] = [];
    // 显示快捷回复按钮
    SHOW_REPLY_BUTTON = false;
    // 额外引用消息开关
    EXTRA_MESSAGE_CONTEXT = false;

    // -------------

    // 是否读取文件
    ENABLE_FILE = true;
    // 群聊中回复对象默认为触发对象，开启时优先为被回复的对象
    ENABLE_REPLY_TO_MENTION = false;
    // 忽略指定文本开头的消息
    IGNORE_TEXT = '';
    // 多流程时, 是否隐藏中间步骤信息
    HIDE_MIDDLE_MESSAGE = false;
    // 替换词，同时会强制触发bot { ':n': '/new', ':g3': '/gpt3', ':g4': '/gpt4'}
    CHAT_MESSAGE_TRIGGER = {};
    TOOLS: Record<string, FuncTool> = tools_default;
    // 询问AI调用function的次数
    FUNC_LOOP_TIMES = 1;
    // 显示调用信息
    CALL_INFO = true;
    // func call 每次成功命中后最多并发次数
    CON_EXEC_FUN_NUM = 1;
    // 当长度到达设置值时群组将发送telegraph文章 小于0时不发送
    TELEGRAPH_NUM_LIMIT = -1;
    // 发文的作者链接; 发文作者目前为机器人ID, 未设置时为anonymous
    TELEGRAPH_AUTHOR_URL = '';
    // 关闭链接预览
    DISABLE_WEB_PREVIEW = false;
    // 消息过期时间, 单位: 分钟
    EXPIRED_TIME = -1;
    // 任务扫描周期 使用cron 表达式, 例如 '*/10 0-2,6-23 * * *' 表示每天0-2点，6-23点，每十分钟执行一次定时任务
    CRON_CHECK_TIME = '';
    // 定时删除群组消息的类型 提示信息:tip 普通对话:chat
    SCHEDULE_GROUP_DELETE_TYPE = ['tip'];
    // 定时删除私人消息的类型 命令对话:command与普通对话:chat
    SCHEDULE_PRIVATE_DELETE_TYPE = ['tip'];

    // 对话总时长时间限制
    ALL_COMPLETE_API_TIMEOUT = 180;
    // 函数调用超时时间
    FUNC_TIMEOUT = 15;
    // 存储消息白名单
    STORE_MESSAGE_WHITELIST: number[] = [];
    // 存储消息条数
    STORE_MESSAGE_NUM = 0;
    // DROPS_OPENAI_PARAMS = { 'o1-mini,o1-preview': 'max_tokens,temperature,stream' };
    DROPS_OPENAI_PARAMS: Record<string, string> = {};
    //  以文件方式发送图片
    SEND_IMAGE_FILE: boolean = false;
    // Perplexity cookie
    PPLX_COOKIE: string | null = null;
    // 日志级别
    LOG_LEVEL: LogLevelType = 'info';

    // -------------

    // -- 模式开关 --
    //
    // 使用流模式
    STREAM_MODE = true;
    // 安全模式
    SAFE_MODE = true;
    // 调试模式
    DEBUG_MODE = false;
    // 开发模式
    DEV_MODE = false;
    // 是否发送初始化消息
    SEND_INIT_MESSAGE = true;
}

// -- 通用配置 --
export class AgentShareConfig {
    // AI提供商: auto, openai, azure, workers, gemini, mistral
    AI_PROVIDER = 'auto';
    // AI图片提供商: auto, openai, azure, workers
    AI_IMAGE_PROVIDER = 'auto';
    // 全局默认初始化消息
    SYSTEM_INIT_MESSAGE: string | null = null;
    // 全局默认初始化消息角色
    SYSTEM_INIT_MESSAGE_ROLE = 'system';
}

// -- Open AI 配置 --
export class OpenAIConfig {
    // OpenAI API Key
    OPENAI_API_KEY: string[] = [];
    // OpenAI的模型名称
    OPENAI_CHAT_MODEL = 'gpt-4o-mini';
    // OpenAI API BASE ``
    OPENAI_API_BASE = 'https://api.openai.com/v1';
    // OpenAI API Extra Params
    OPENAI_API_EXTRA_PARAMS: Record<string, any> = {};
    // OpenAI STT 模型
    OPENAI_STT_MODEL = 'whisper-1';
    // OpenAI Vision 模型
    OPENAI_VISION_MODEL = 'gpt-4o-mini';
    // OpenAI TTS 模型
    OPENAI_TTS_MODEL = 'tts-1';
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
}

// -- Gemini 配置 --
export class GeminiConfig {
    // Google Gemini API Key
    GOOGLE_API_KEY: string | null = null;
    // Google Gemini API
    GOOGLE_COMPLETIONS_API = 'https://generativelanguage.googleapis.com/v1beta/models/';
    // Google Gemini Model
    GOOGLE_COMPLETIONS_MODEL = 'gemini-pro';
}

// -- Mistral 配置 --
export class MistralConfig {
    // mistral api key
    MISTRAL_API_KEY: string | null = null;
    // mistral api base
    MISTRAL_API_BASE = 'https://api.mistral.ai/v1';
    // mistral api model
    MISTRAL_CHAT_MODEL = 'mistral-tiny';
}

// -- Cohere 配置 --
export class CohereConfig {
    // cohere api key
    COHERE_API_KEY: string | null = null;
    // cohere api base
    COHERE_API_BASE = 'https://api.cohere.com/v1';
    // cohere api model
    COHERE_CHAT_MODEL = 'command-r-plus';
}

// -- Anthropic 配置 --
export class AnthropicConfig {
    // Anthropic api key
    ANTHROPIC_API_KEY: string | null = null;
    // Anthropic api base
    ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1';
    // Anthropic api model
    ANTHROPIC_CHAT_MODEL = 'claude-3-haiku-20240307';
}

export class SiliconConfig {
    // Silicon api key
    SILICON_API_KEY: string | null = null;
    // Silicon api base
    SILICON_API_BASE = 'https://api.siliconflow.cn/v1';
    // Silicon api model
    SILICON_CHAT_MODEL = 'deepseek-ai/DeepSeek-V2.5';
    // Silicon image model
    SILICON_IMAGE_MODEL = 'black-forest-labs/FLUX.1-schnell';
    // Silicon image size
    SILICON_IMAGE_SIZE = '1024x1024';
    // Silicon extra params
    SILICON_EXTRA_PARAMS: Record<string, any> = {};
}

export class DefineKeys {
    DEFINE_KEYS: string[] = [];
}

export class ExtraUserConfig {
    MAPPING_KEY = '-p:SYSTEM_INIT_MESSAGE|-n:MAX_HISTORY_LENGTH|-a:AI_PROVIDER|-ai:AI_IMAGE_PROVIDER|-m:CHAT_MODEL|-md:CURRENT_MODE|-v:OPENAI_VISION_MODEL|-t:OPENAI_TTS_MODEL|-ex:OPENAI_API_EXTRA_PARAMS|-mk:MAPPING_KEY|-mv:MAPPING_VALUE|-asap:FUNCTION_REPLY_ASAP|-fm:FUNCTION_CALL_MODEL|-tool:USE_TOOLS|-oli:IMAGE_MODEL';
    // /set 指令映射值  | 分隔多个关系，:分隔映射
    MAPPING_VALUE = '';
    // MAPPING_VALUE = "cson:claude-3-5-sonnet-20240620|haiku:claude-3-haiku-20240307|g4m:gpt-4o-mini|g4:gpt-4o|rp+:command-r-plus";
    // 消息中是否显示模型、时间额外信息
    ENABLE_SHOWINFO = false;
    // 消息中是否显示token信息(如果有)
    ENABLE_SHOWTOKEN = false;
    // 需要使用的函数 当前有 duckduckgo_search 和jina_reader
    // '["duckduckgo_search", "jina_reader"]'
    USE_TOOLS: string[] = [];
    JINA_API_KEY = [];
    // openai格式调用FUNCTION CALL参数
    FUNCTION_CALL_MODEL = 'gpt-4o-mini';
    FUNCTION_CALL_API_KEY = '';
    FUNCTION_CALL_BASE = '';
    // 启用FUNCTION CALL未命中函数时，开启此选项，会直接收到FUNCTION_CALL模型的回复
    FUNCTION_REPLY_ASAP = false;
    PROMPT: Record<string, string> = prompts_default;
    MODES: Record<string, FlowStruct> = {
        default: { text: {}, image: {}, audio: { workflow: [{ type: 'text' }, {}] } },
        dalle: {
            text: {
                disableHistory: true,
                disableTool: true,
                workflow: [{ agent: 'openai', model: 'gpt-4o-2024-08-06', prompt: 'dalle' }, { type: 'image' }],
            },
        },
        pk: {
            text: {
                // isParallel: true,
                disableHistory: false,
                disableTool: false,
                workflow: [{ model: 'gpt-4o-2024-08-06' }, { model: 'chatgpt-4o-latest' }],
            },
        },
    };

    CURRENT_MODE = 'default';
}
