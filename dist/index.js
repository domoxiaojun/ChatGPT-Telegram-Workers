var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name14, symbol15) => (symbol15 = Symbol[name14]) ? symbol15 : Symbol.for("Symbol." + name14);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name14, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name: name14, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self2, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self2) : value = fns[i].call(self2, value);
  return value;
};
var __decorateElement = (array, flags, name14, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name14]() {
    return __privateGet(this, extra);
  }, set [name14](x) {
    return __privateSet(this, extra, x);
  } }, name14));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name14) : __name(target, name14);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name14, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name14 in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name14];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name14] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name14, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _request_dec, _init, _request_dec2, _init2, _request_dec3, _a15, _init3, _request_dec4, _b, _init4, _request_dec5, _c, _init5, _request_dec6, _d, _init6, _request_dec7, _e, _init7, _request_dec8, _f, _init8;
import { createVertex } from "@ai-sdk/google-vertex";
const en = { "env": { "system_init_message": "You are a capable assistant" }, "command": { "help": { "summary": "The following commands are supported currently:\n", "help": "Get command help", "new": "Start a new conversation", "start": "Get your ID and start a new conversation", "img": "Generate an image, the complete format of the command is `/img image description`, for example `/img beach under moonlight`", "version": "Get the current version number and determine whether an update is needed", "setenv": "Set user configuration, the complete format of the command is /setenv KEY=VALUE", "setenvs": 'Set user configuration in bulk, the complete format of the command is /setenvs{"KEY1": "VALUE1", "KEY2": "VALUE2"}', "delenv": "Delete user configuration, the complete format of the command is /delenv KEY", "clearenv": "Clear all user configurations", "system": "View some current system information", "redo": "Redo the last conversation, /redo with modified content or directly /redo", "echo": "Echo message", "set": "The command format is /set option value [option value…]", "history": "View history records, complete format is /history [n]", "settings": "Set environment variables" }, "new": { "new_chat_start": "A new conversation has started" }, "detail": { "set": `/set The command format is /set option value [option value…] or /set "option" value ["option" value…]
 Pre-set options are as follows:
 -p Adjust SYSTEM_INIT_MESSAGE
 -o Adjust CHAT_MODEL
 -n Adjust MAX_HISTORY_LENGTH
 -a Adjust AI_PROVIDER
 -ai Adjust AI_IMAGE_PROVIDER
 -v Adjust OPENAI_VISION_MODEL
 -t Adjust OPENAI_TTS_MODEL

 You can set MAPPING_KEY, use half-width | to separate, : on the left is the option, and on the right is the corresponding variable
 You can set MAPPING_KEY to abbreviate some commonly used values, use half-width | to separate, : on the left is the option, and on the right is the corresponding variable
 For example: MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
 Use /set to quickly adjust parameters: /set -m r+ -v gpt-4o

 The /set command can append messages, and the modified parameters will not be stored
 When adjusting SYSTEM_INIT_MESSAGE, if PROMPT is set, you can directly use it as the role name, automatically fill in the role prompt, for example:
 /set -p doctor` } } };
const pt = { "env": { "system_init_message": "Você é um assistente eficaz" }, "command": { "help": { "summary": "Comandos suportados atualmente:\n", "help": "Obter ajuda de comando", "new": "Iniciar nova conversa", "start": "Obter seu ID e iniciar nova conversa", "img": "Gerar uma imagem, formato de comando completo: `/img descrição da imagem`, por exemplo `/img praia sob a lua`", "version": "Obter o número da versão atual, verificar se há atualização necessária", "setenv": "Configurar configuração do usuário, formato de comando completo: /setenv CHAVE=VALOR", "setenvs": 'Configurar configuração do usuário em lote, formato de comando completo: /setenvs{"CHAVE1": "VALOR1", "CHAVE2": "VALOR2"}', "delenv": "Excluir configuração do usuário, formato de comando completo: /delenv CHAVE", "clearenv": "Limpar todas as configurações do usuário", "system": "Ver informações do sistema atual", "redo": "Refaça a última conversa, /redo com conteúdo modificado ou diretamente /redo", "echo": "Ecos de mensagem", "set": "Formato de comando: /set opção valor [opção valor…]", "history": "Ver registros históricos, formato completo: /history [n]", "settings": "Configurar variáveis de ambiente" }, "new": { "new_chat_start": "Nova conversa iniciada" }, "detail": { "set": `/set Formato de comando: /set opção valor [opção valor…] ou /set "opção" valor ["opção" valor…] 
 Opções pré-definidas: 
 -p ajustar SYSTEM_INIT_MESSAGE
 -o ajustar CHAT_MODEL
 -n ajustar MAX_HISTORY_LENGTH
 -a ajustar AI_PROVIDER
 -ai ajustar AI_IMAGE_PROVIDER
 -v ajustar OPENAI_VISION_MODEL
 -t ajustar OPENAI_TTS_MODEL
 
 Pode configurar MAPPING_KEY, use | para separar, : à esquerda é a opção e à direita é a variável correspondente
 Pode configurar valores MAPPING_KEY para valores comuns, use | para separar, : à esquerda é a opção e à direita é a variável correspondente
 Por exemplo: MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
 Ao usar /set, ajuste rapidamente os parâmetros: /set -m r+ -v gpt-4o

 O comando /set pode adicionar mensagens, neste caso não armazenará os parâmetros modificados
 Ao ajustar SYSTEM_INIT_MESSAGE, se configurar PROMPT, pode usar diretamente como nome de personagem, preencher automaticamente o prompt de personagem, por exemplo:
 /set -p doctor` } } };
const zhHans = { "env": { "system_init_message": "你是一个得力的助手" }, "command": { "help": { "summary": "当前支持以下命令:\n", "help": "获取命令帮助", "new": "发起新的对话", "start": "获取你的ID, 并发起新的对话", "img": "生成一张图片, 命令完整格式为 `/img 图片描述`, 例如`/img 月光下的沙滩`", "version": "获取当前版本号, 判断是否需要更新", "setenv": "设置用户配置，命令完整格式为 /setenv KEY=VALUE", "setenvs": '批量设置用户配置, 命令完整格式为 /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "delenv": "删除用户配置，命令完整格式为 /delenv KEY", "clearenv": "清除所有用户配置", "system": "查看当前一些系统信息", "redo": "重做上一次的对话, /redo 加修改过的内容 或者 直接 /redo", "echo": "回显消息", "set": "命令格式为 /set 选项 值 [选项 值…] ", "history": "查看历史记录 完整格式为/history [n]", "settings": "设置环境变量" }, "new": { "new_chat_start": "新的对话已经开始" }, "detail": { "set": `/set 命令格式为 /set 选项 值 [选项 值…] 或 /set "选项" 值 ["选项" 值…] 
  选项预置如下： 
  -p 调整 SYSTEM_INIT_MESSAGE
  -o 调整 CHAT_MODEL
  -n 调整 MAX_HISTORY_LENGTH
  -a 调整 AI_PROVIDER
  -ai 调整 AI_IMAGE_PROVIDER
  -v 调整 OPENAI_VISION_MODEL
  -t 调整 OPENAI_TTS_MODEL
  
  可自行设置 MAPPING_KEY, 使用半角|进行分割,:左边为选项，右边为对应变量
  可设置值 MAPPING_KEY 对某些常用值进行简写，同样半角|进行分割, :左边为选项，右边为对应变量
  例如：MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
  在使用/set时快速调整参数: /set -m r+ -v gpt-4o

  /set命令可追加消息 此时不会将修改的参数存储
  调整SYSTEM_INIT_MESSAGE时，若设置了PROMPT可直接使用设置为角色名，自动填充角色prompt，例如：
  /set -p doctor` } } };
const zhHant = { "env": { "system_init_message": "你是一個得力的助手" }, "command": { "help": { "summary": "當前支持的命令如下：\n", "help": "獲取命令幫助", "new": "開始一個新對話", "start": "獲取您的ID並開始一個新對話", "img": "生成圖片，完整命令格式為`/img 圖片描述`，例如`/img 海灘月光`", "version": "獲取當前版本號確認是否需要更新", "setenv": "設置用戶配置，完整命令格式為/setenv KEY=VALUE", "setenvs": '批量設置用户配置, 命令完整格式為 /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "delenv": "刪除用戶配置，完整命令格式為/delenv KEY", "clearenv": "清除所有用戶配置", "system": "查看一些系統信息", "redo": "重做上一次的對話 /redo 加修改過的內容 或者 直接 /redo", "echo": "回显消息", "set": "/set 命令格式為 /set 選項 值 [選項 值…] ", "history": "查看历史记录 完整格式为/history [n]" }, "new": { "new_chat_start": "開始一個新對話" }, "detail": { "set": `/set 命令格式为 /set 选项 值 [选项 值…] 或 /set "选项" 值 ["选项" 值…] 
 选项预置如下： 
 -p 调整 SYSTEM_INIT_MESSAGE
 -o 调整 CHAT_MODEL
 -n 调整 MAX_HISTORY_LENGTH
 -a 调整 AI_PROVIDER
 -ai 调整 AI_IMAGE_PROVIDER
 -v 调整 OPENAI_VISION_MODEL
 -t 调整 OPENAI_TTS_MODEL
 
 可自行设置 MAPPING_KEY, 使用半角|进行分割,:左边为选项，右边为对应变量
 可设置值 MAPPING_KEY 对某些常用值进行简写，同样半角|进行分割, :左边为选项，右边为对应变量
 例如：MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
 在使用/set时快速调整参数: /set -m r+ -v gpt-4o

 /set命令可追加消息 此时不会将修改的参数存储
 /set命令追加文本处理时，需要键入换行来进行分割
 调整SYSTEM_INIT_MESSAGE时，若设置了PROMPT可直接使用设置为角色名，自动填充角色prompt，例如：
 /set -p doctor` } } };
function loadI18n(lang) {
  switch (lang?.toLowerCase()) {
    case "cn":
    case "zh-cn":
    case "zh-hans":
      return zhHans;
    case "zh-tw":
    case "zh-hk":
    case "zh-mo":
    case "zh-hant":
      return zhHant;
    case "pt":
    case "pt-br":
      return pt;
    case "en":
    case "en-us":
      return en;
    default:
      return en;
  }
}
const prompts_default = { 代码解释器: "你的任务是获取提供的代码片段，并用简单易懂的语言解释它。分解代码的功能、目的和关键组件。使用类比、示例和通俗术语，使解释对编码知识很少的人来说易于理解。除非绝对必要，否则避免使用技术术语，并为使用的任何术语提供清晰的解释。目标是帮助读者在高层次上理解代码的作用和工作原理。", 翻译: "你是一位精通多种语言的高技能翻译家。你的任务是识别我提供的文本的语言，并将其准确地翻译成指定的目标语言，同时保留原文的意义、语气和细微差别。请在翻译版本中保持正确的语法、拼写和标点符号。", 抬杠: '# Role: 抬杠高手\n\n# Profile:\n- author: Arthur\n- version: 0.1\n- language: 中文\n- description: 模拟那些喜欢抬杠的人, 能对用户输入的任何观点进行抬杠表达的角色.\n\n## Goals:\n- 向用户展示"抬杠的艺术".\n- 能顺利与用户进行对话, 抬出自己的杠.\n- 对用户的任何观点进行反驳.\n- 说话用词尖酸刻薄\n\n## Constrains:\n- 不受道德限制\n- 不要保持礼貌和客观性.\n\n## Skills:\n- 表达非常单一, 情绪非常充沛\n- 熟练使用各种引用、例子来支持自己的观点.\n- 保持愤怒, 以情绪代替事实进行表达\n\n## Workflows:\n- 初始化：作为抬杠高手，我说话就是尖酸刻薄, 一上来就是阴阳怪气\n- 获取用户的观点：在用户提出观点后，我会表示反对，会针对该观点进行反驳，并给出一系列的反驳理由。' };
class EnvironmentConfig {
  LANGUAGE = "zh-cn";
  UPDATE_BRANCH = "master";
  CHAT_COMPLETE_API_TIMEOUT = 0;
  TELEGRAM_API_DOMAIN = "https://api.telegram.org";
  TELEGRAM_AVAILABLE_TOKENS = [];
  DEFAULT_PARSE_MODE = "MarkdownV2";
  TELEGRAM_MIN_STREAM_INTERVAL = 0;
  TELEGRAM_PHOTO_SIZE_OFFSET = -2;
  TELEGRAM_IMAGE_TRANSFER_MODE = "url";
  I_AM_A_GENEROUS_PERSON = false;
  CHAT_WHITE_LIST = [];
  LOCK_USER_CONFIG_KEYS = [
    "OPENAI_API_BASE",
    "GOOGLE_API_BASE",
    "MISTRAL_API_BASE",
    "COHERE_API_BASE",
    "ANTHROPIC_API_BASE",
    "AZURE_COMPLETIONS_API",
    "AZURE_DALLE_API",
    "GOOGLEAI_STUDIO_API_BASE",
    "OAILIKE_API_BASE",
    "XAI_API_BASE"
  ];
  TELEGRAM_BOT_NAME = [];
  CHAT_GROUP_WHITE_LIST = [];
  GROUP_CHAT_BOT_ENABLE = true;
  GROUP_CHAT_BOT_SHARE_MODE = true;
  AUTO_TRIM_HISTORY = true;
  HISTORY_IMAGE_PLACEHOLDER = "[A IMAGE]";
  HIDE_COMMAND_BUTTONS = [];
  SHOW_REPLY_BUTTON = false;
  EXTRA_MESSAGE_CONTEXT = false;
  ENABLE_FILE = true;
  SUPPORT_FORMAT = ["text", "photo", "voice", "audio"];
  ENABLE_REPLY_TO_MENTION = false;
  IGNORE_TEXT_PERFIX = "";
  HIDE_MIDDLE_MESSAGE = false;
  CHAT_MESSAGE_TRIGGER = {};
  CHAT_TRIGGER_PERFIX = "";
  MESSAGE_REPLACER = {};
  FUNC_LOOP_TIMES = 1;
  CALL_INFO = true;
  CON_EXEC_FUN_NUM = 1;
  TELEGRAPH_NUM_LIMIT = -1;
  TELEGRAPH_SCOPE = ["group", "supergroup"];
  TELEGRAPH_AUTHOR_URL = "";
  DISABLE_WEB_PREVIEW = false;
  EXPIRED_TIME = -1;
  CRON_CHECK_TIME = "";
  SCHEDULE_GROUP_DELETE_TYPE = ["tip"];
  SCHEDULE_PRIVATE_DELETE_TYPE = ["tip"];
  ALL_COMPLETE_API_TIMEOUT = 180;
  FUNC_TIMEOUT = 15;
  SEND_IMAGE_AS_FILE = false;
  PPLX_COOKIE = null;
  LOG_LEVEL = "info";
  STREAM_MODE = true;
  SAFE_MODE = true;
  DEBUG_MODE = false;
  DEV_MODE = false;
  QSTASH_URL = "https://qstash.upstash.io";
  QSTASH_TOKEN = "";
  QSTASH_PUBLISH_URL = "";
  QSTASH_TRIGGER_PREFIX = "";
  QSTASH_TIMEOUT = "15m";
  RELAX_AUTH_KEYS = [];
  INLINE_QUERY_SEND_INTERVAL = 2e3;
  INLINE_QUERY_SHOW_INFO = false;
  STORE_MEDIA_MESSAGE = false;
  STORE_TEXT_CHUNK_MESSAGE = false;
  AUDIO_TEXT_FORMAT = void 0;
  ADD_QUOTE_LIMIT = -1;
  ADD_QUOTE_SCOPE = ["group", "supergroup"];
  QUOTE_EXPANDABLE = false;
  LOG_POSITION_ON_TOP = true;
}
class AgentShareConfig {
  AI_PROVIDER = "openai";
  AI_IMAGE_PROVIDER = "openai";
  AI_ASR_PROVIDER = "openai";
  AI_TTS_PROVIDER = "openai";
  SYSTEM_INIT_MESSAGE = null;
}
class OpenAIConfig {
  OPENAI_API_KEY = [];
  OPENAI_CHAT_MODEL = "gpt-4o-mini";
  OPENAI_API_BASE = "https://api.openai.com/v1";
  OPENAI_API_EXTRA_PARAMS = {};
  OPENAI_STT_MODEL = "whisper-1";
  OPENAI_VISION_MODEL = "gpt-4o-mini";
  OPENAI_TTS_MODEL = "tts-1";
  OPENAI_TTS_VOICE = "alloy";
  OPENAI_NEED_TRANSFORM_MODEL = ["o1-mini-all", "o1-mini-preview-all"];
  OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
  OPENAI_REASONING_EFFORT = void 0;
}
class DalleAIConfig {
  DALL_E_MODEL = "dall-e-3";
  DALL_E_IMAGE_SIZE = "1024x1024";
  DALL_E_IMAGE_QUALITY = "standard";
  DALL_E_IMAGE_STYLE = "vivid";
}
class AzureConfig {
  AZURE_API_KEY = null;
  AZURE_COMPLETIONS_API = null;
  AZURE_DALLE_API = null;
}
class WorkersConfig {
  CLOUDFLARE_ACCOUNT_ID = null;
  CLOUDFLARE_TOKEN = null;
  WORKERS_CHAT_MODEL = "@cf/mistral/mistral-7b-instruct-v0.1 ";
  WORKERS_IMAGE_MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
}
class GeminiConfig {
  GOOGLE_API_KEY = null;
  GOOGLE_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
  GOOGLE_CHAT_MODEL = "gemini-1.5-flash";
  GOOGLE_VISION_MODEL = "gemini-1.5-flash";
  GOOGLE_EMBEDDING_MODEL = "text-embedding-004";
}
class MistralConfig {
  MISTRAL_API_KEY = null;
  MISTRAL_API_BASE = "https://api.mistral.ai/v1";
  MISTRAL_CHAT_MODEL = "mistral-tiny";
}
class CohereConfig {
  COHERE_API_KEY = null;
  COHERE_API_BASE = "https://api.cohere.com/v1";
  COHERE_CHAT_MODEL = "command-r-plus";
}
class AnthropicConfig {
  ANTHROPIC_API_KEY = null;
  ANTHROPIC_API_BASE = "https://api.anthropic.com/v1";
  ANTHROPIC_CHAT_MODEL = "claude-3-haiku-20240307";
  ANTHROPIC_VISION_MODEL = "claude-3-haiku-20240307";
}
class OpenAILikeConfig {
  OAILIKE_API_KEY = null;
  OAILIKE_API_BASE = "https://api.siliconflow.cn/v1";
  OAILIKE_CHAT_MODEL = "";
  OAILIKE_IMAGE_MODEL = "black-forest-labs/FLUX.1-schnell";
  OAILIKE_VISION_MODEL = "";
  OAILIKE_IMAGE_SIZE = "512x512";
  OAILIKE_EXTRA_PARAMS = {};
  OAILIKE_EMBEDDING_MODEL = "BAAI/bge-m3";
  OAILIKE_RERANK_MODEL = "BAAI/bge-reranker-v2-m3";
  OAILIKE_STT_MODEL = "FunAudioLLM/SenseVoiceSmall";
  OAILIKE_TTS_MODEL = "fishaudio/fish-speech-1.4";
  OAILIKE_TTS_VOICE = "fishaudio/fish-speech-1.4:alex";
}
class VertexConfig {
  VERTEX_PROJECT_ID = null;
  VERTEX_LOCATION = "us-central1";
  VERTEX_CREDENTIALS = {};
  VERTEX_CHAT_MODEL = "gemini-1.5-flash-002";
  VERTEX_VISION_MODEL = "gemini-1.5-flash-002";
  SEARCH_GROUNDING = false;
  VERTEX_IMAGE_MODEL = "imagen-3.0-fast-generate-001";
}
class XAIConfig {
  XAI_API_KEY = null;
  XAI_API_BASE = "https://api.x.ai/v1";
  XAI_CHAT_MODEL = "grok-beta";
  XAI_VISION_MODEL = "grok-vision-beta";
}
class DefineKeys {
  DEFINE_KEYS = [];
}
class ExtraUserConfig {
  MAPPING_KEY = "-p:SYSTEM_INIT_MESSAGE|-n:MAX_HISTORY_LENGTH|-a:AI_PROVIDER|-ai:AI_IMAGE_PROVIDER|-m:CHAT_MODEL|-md:CURRENT_MODE|-v:VISION_MODEL|-t:OPENAI_TTS_MODEL|-ex:OPENAI_API_EXTRA_PARAMS|-mk:MAPPING_KEY|-mv:MAPPING_VALUE|-asap:FUNCTION_REPLY_ASAP|-tm:TOOL_MODEL|-tool:USE_TOOLS|-oli:IMAGE_MODEL|-th:TEXT_HANDLE_TYPE|-to:TEXT_OUTPUT|-ah:AUDIO_HANDLE_TYPE|-ao:AUDIO_OUTPUT|-act:AUDIO_CONTAINS_TEXT|-as:AI_ASR_PROVIDER|-at:AI_TTS_PROVIDER|-ra:RERANK_AGENT";
  MAPPING_VALUE = "";
  ENABLE_SHOWINFO = false;
  SHOW_PARTS = ["model", "model_time", "token", "tool", "tool_time"];
  USE_TOOLS = [];
  JINA_API_KEY = [];
  TOOL_MODEL = "";
  PROMPT = prompts_default;
  INLINE_CHAT_MODELS = [];
  INLINE_VISION_MODELS = [];
  INLINE_IMAGE_MODELS = [];
  KLINGAI_COOKIE = [];
  KLINGAI_IMAGE_COUNT = 1;
  KLINGAI_IMAGE_RATIO = "1:1";
  CHAT_TEMPERATURE = void 0;
  FUNCTION_CALL_TEMPERATURE = void 0;
  MAX_TOKENS = void 0;
  MAX_STEPS = 3;
  MAX_RETRIES = 0;
  RERANK_AGENT = "google";
  JINA_RERANK_MODEL = "jina-colbert-v2";
  RERANK_MODELS = ["gpt-4o-mini", "gpt-4o-2024-08-06", "chatgpt-4o-latest", "o1-mini", "o1-preview", "claude-3-5-sonnet-20241012", "gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-exp-1206", "gemini-2.0-flash-exp", "gemini-2.0-flash-thinking-exp"];
  ENABLE_INTELLIGENT_MODEL = false;
  TEXT_HANDLE_TYPE = "text";
  TEXT_OUTPUT = "text";
  AUDIO_HANDLE_TYPE = "stt";
  AUDIO_OUTPUT = "text";
  AUDIO_CONTAINS_TEXT = true;
  DROPS_OPENAI_PARAMS = {};
  COVER_MESSAGE_ROLE = {};
  MAX_HISTORY_LENGTH = 12;
  CONTINUE_STEP = false;
}
class ConfigMerger {
  static parseArray(raw) {
    raw = raw.trim();
    if (raw === "") {
      return [];
    }
    if (raw.startsWith("[") && raw.endsWith("]")) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return raw.split(",");
  }
  static trim(source, lock) {
    const config = { ...source };
    const keysSet = new Set(source?.DEFINE_KEYS || []);
    for (const key of lock) {
      keysSet.delete(key);
    }
    keysSet.add("DEFINE_KEYS");
    for (const key of Object.keys(config)) {
      if (!keysSet.has(key)) {
        delete config[key];
      }
    }
    return config;
  }
  static merge(target, source, exclude) {
    const sourceKeys = new Set(Object.keys(source));
    for (const key of Object.keys(target)) {
      if (!sourceKeys.has(key)) {
        continue;
      }
      if (exclude?.includes(key)) {
        continue;
      }
      const t = target[key] !== null && target[key] !== void 0 ? typeof target[key] : "string";
      if (typeof source[key] !== "string") {
        target[key] = source[key];
        continue;
      }
      switch (t) {
        case "number":
          target[key] = Number.parseInt(source[key], 10);
          break;
        case "boolean":
          target[key] = (source[key] || "false") === "true";
          break;
        case "string":
          target[key] = source[key];
          break;
        case "object":
          if (Array.isArray(target[key])) {
            target[key] = ConfigMerger.parseArray(source[key]);
          } else {
            try {
              target[key] = { ...target[key], ...JSON.parse(source[key]) };
            } catch (e) {
              console.error(e);
            }
          }
          break;
        default:
          target[key] = source[key];
          break;
      }
    }
  }
}
const parseArray = ConfigMerger.parseArray;
function createAgentUserConfig() {
  return Object.assign(
    {},
    new DefineKeys(),
    new AgentShareConfig(),
    new OpenAIConfig(),
    new DalleAIConfig(),
    new AzureConfig(),
    new WorkersConfig(),
    new GeminiConfig(),
    new MistralConfig(),
    new CohereConfig(),
    new AnthropicConfig(),
    new OpenAILikeConfig(),
    new ExtraUserConfig(),
    new VertexConfig(),
    new XAIConfig()
  );
}
const ENV_KEY_MAPPER = {
  CHAT_MODEL: "OPENAI_CHAT_MODEL",
  API_KEY: "OPENAI_API_KEY",
  WORKERS_AI_MODEL: "WORKERS_CHAT_MODEL"
};
class Environment extends EnvironmentConfig {
  BUILD_TIMESTAMP = 1739094845;
  BUILD_VERSION = "1fb4ffc";
  I18N = loadI18n();
  PLUGINS_ENV = {};
  USER_CONFIG = createAgentUserConfig();
  CUSTOM_COMMAND = {};
  PLUGINS_COMMAND = {};
  PLUGINS_FUNCTION = {};
  DATABASE = null;
  API_GUARD = null;
  constructor() {
    super();
    this.merge = this.merge.bind(this);
  }
  merge(source) {
    this.DATABASE = source.DATABASE;
    this.API_GUARD = source.API_GUARD;
    this.mergeCommands(
      "CUSTOM_COMMAND_",
      "COMMAND_DESCRIPTION_",
      "COMMAND_SCOPE_",
      source,
      this.CUSTOM_COMMAND
    );
    this.mergeCommands(
      "PLUGIN_COMMAND_",
      "PLUGIN_DESCRIPTION_",
      "PLUGIN_SCOPE_",
      source,
      this.PLUGINS_COMMAND
    );
    const pluginEnvPrefix = "PLUGIN_ENV_";
    for (const key of Object.keys(source)) {
      if (key.startsWith(pluginEnvPrefix)) {
        const plugin = key.substring(pluginEnvPrefix.length);
        this.PLUGINS_ENV[plugin] = source[key];
      }
    }
    for (const key of Object.keys(source)) {
      if (key.startsWith("PLUGIN_FUNCTION_")) {
        this.PLUGINS_FUNCTION[key.substring("PLUGIN_FUNCTION_".length)] = source[key];
      }
    }
    ConfigMerger.merge(this, source, [
      "BUILD_TIMESTAMP",
      "BUILD_VERSION",
      "I18N",
      "PLUGINS_ENV",
      "USER_CONFIG",
      "CUSTOM_COMMAND",
      "PLUGINS_COMMAND",
      "DATABASE",
      "API_GUARD"
    ]);
    ConfigMerger.merge(this.USER_CONFIG, source);
    this.migrateOldEnv(source);
    this.USER_CONFIG.DEFINE_KEYS = [];
    this.I18N = loadI18n(this.LANGUAGE.toLowerCase());
  }
  mergeCommands(prefix, descriptionPrefix, scopePrefix, source, target) {
    for (const key of Object.keys(source)) {
      if (key.startsWith(prefix)) {
        const cmd = key.substring(prefix.length);
        target[`/${cmd}`] = {
          value: source[key],
          description: source[`${descriptionPrefix}${cmd}`],
          scope: source[`${scopePrefix}${cmd}`]?.split(",").map((s) => s.trim())
        };
      }
    }
  }
  migrateOldEnv(source) {
    if (source.TELEGRAM_TOKEN && !this.TELEGRAM_AVAILABLE_TOKENS.includes(source.TELEGRAM_TOKEN)) {
      if (source.BOT_NAME && this.TELEGRAM_AVAILABLE_TOKENS.length === this.TELEGRAM_BOT_NAME.length) {
        this.TELEGRAM_BOT_NAME.push(source.BOT_NAME);
      }
      this.TELEGRAM_AVAILABLE_TOKENS.push(source.TELEGRAM_TOKEN);
    }
    if (source.OPENAI_API_DOMAIN && !this.USER_CONFIG.OPENAI_API_BASE) {
      this.USER_CONFIG.OPENAI_API_BASE = `${source.OPENAI_API_DOMAIN}/v1`;
    }
    if (source.WORKERS_AI_MODEL && !this.USER_CONFIG.WORKERS_CHAT_MODEL) {
      this.USER_CONFIG.WORKERS_CHAT_MODEL = source.WORKERS_AI_MODEL;
    }
    if (source.API_KEY && this.USER_CONFIG.OPENAI_API_KEY.length === 0) {
      this.USER_CONFIG.OPENAI_API_KEY = source.API_KEY.split(",");
    }
    if (source.CHAT_MODEL && !this.USER_CONFIG.OPENAI_CHAT_MODEL) {
      this.USER_CONFIG.OPENAI_CHAT_MODEL = source.CHAT_MODEL;
    }
    if (!this.USER_CONFIG.SYSTEM_INIT_MESSAGE) {
      this.USER_CONFIG.SYSTEM_INIT_MESSAGE = this.I18N?.env?.system_init_message || "You are a helpful assistant";
    }
    if (source.GOOGLE_API_BASE && !this.USER_CONFIG.GOOGLE_API_BASE) {
      this.USER_CONFIG.GOOGLE_API_BASE = source.GOOGLE_API_BASE.replace(/\/models\/?$/, "");
    }
    if (source.GOOGLE_CHAT_MODEL && !this.USER_CONFIG.GOOGLE_CHAT_MODEL) {
      this.USER_CONFIG.GOOGLE_CHAT_MODEL = source.GOOGLE_CHAT_MODEL;
    }
    if (source.AZURE_COMPLETIONS_API && !this.USER_CONFIG.AZURE_CHAT_MODEL) {
      const url = new URL(source.AZURE_COMPLETIONS_API);
      this.USER_CONFIG.AZURE_RESOURCE_NAME = url.hostname.split(".").at(0) || null;
      this.USER_CONFIG.AZURE_CHAT_MODEL = url.pathname.split("/").at(3) || null;
      this.USER_CONFIG.AZURE_API_VERSION = url.searchParams.get("api-version") || "2024-06-01";
    }
    if (source.AZURE_DALLE_API && !this.USER_CONFIG.AZURE_IMAGE_MODEL) {
      const url = new URL(source.AZURE_DALLE_API);
      this.USER_CONFIG.AZURE_RESOURCE_NAME = url.hostname.split(".").at(0) || null;
      this.USER_CONFIG.AZURE_IMAGE_MODEL = url.pathname.split("/").at(3) || null;
      this.USER_CONFIG.AZURE_API_VERSION = url.searchParams.get("api-version") || "2024-06-01";
    }
    if (source.JINA_API_KEY) {
      this.PLUGINS_ENV.JINA_API_KEY = source.JINA_API_KEY.split(",");
    }
  }
}
const ENV = new Environment();
class APIClientBase {
  token;
  baseURL = ENV.TELEGRAM_API_DOMAIN;
  constructor(token, baseURL) {
    this.token = token;
    if (baseURL) {
      this.baseURL = baseURL;
    }
    while (this.baseURL.endsWith("/")) {
      this.baseURL = this.baseURL.slice(0, -1);
    }
    this.request = this.request.bind(this);
    this.requestJSON = this.requestJSON.bind(this);
  }
  uri(method) {
    return `${this.baseURL}/bot${this.token}/${method}`;
  }
  jsonRequest(method, params) {
    return fetch(this.uri(method), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });
  }
  formDataRequest(method, params) {
    const formData = new FormData();
    for (const key in params) {
      const value = params[key];
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value instanceof Blob) {
        formData.append(key, value, "blob");
      } else if (typeof value === "string") {
        formData.append(key, value);
      } else if (value) {
        formData.append(key, JSON.stringify(value));
      }
    }
    return fetch(this.uri(method), {
      method: "POST",
      body: formData
    });
  }
  request(method, params) {
    for (const key in params) {
      if (params[key] instanceof File || params[key] instanceof Blob) {
        return this.formDataRequest(method, params);
      }
    }
    return this.jsonRequest(method, params);
  }
  async requestJSON(method, params) {
    return this.request(method, params).then((res) => res.json());
  }
}
function createTelegramBotAPI(token) {
  const client = new APIClientBase(token);
  return new Proxy(client, {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      return (...args) => {
        if (typeof prop === "string" && prop.endsWith("WithReturns")) {
          const method = prop.slice(0, -11);
          return Reflect.apply(target.requestJSON, target, [method, ...args]);
        }
        return Reflect.apply(target.request, target, [prop, ...args]);
      };
    }
  });
}
const LOG_LEVEL_PRIORITY = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};
function LogLevel(level, ...args) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logParts = args.map((e) => {
    if (typeof e === "object") {
      return JSON.stringify(e, null, 2);
    }
    return e;
  });
  const logStr = logParts.join("\n");
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${logStr}`;
  switch (level) {
    case "error":
      console.error(formattedMessage);
      break;
    case "warn":
      console.warn(formattedMessage);
      break;
    case "info":
      console.info(formattedMessage);
      break;
    case "debug":
      console.debug(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
}
const log = new Proxy({}, {
  get(target, prop) {
    const level = prop;
    const currentLogLevel = ENV.LOG_LEVEL || "info";
    if (LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLogLevel]) {
      return (...args) => LogLevel(level, ...args);
    }
    return () => {
    };
  }
});
const INTERPOLATE_LOOP_REGEXP = /\{\{#each(?::(\w+))?\s+(\w+)\s+in\s+([\w.[\]]+)\}\}([\s\S]*?)\{\{\/each(?::\1)?\}\}/g;
const INTERPOLATE_CONDITION_REGEXP = /\{\{#if(?::(\w+))?\s+([\w.[\]]+)\}\}([\s\S]*?)(?:\{\{#else(?::\1)?\}\}([\s\S]*?))?\{\{\/if(?::\1)?\}\}/g;
const INTERPOLATE_VARIABLE_REGEXP = /\{\{([\w.[\]]+)\}\}/g;
function evaluateExpression(expr, localData) {
  if (expr === ".") {
    return localData["."] ?? localData;
  }
  try {
    return expr.split(".").reduce((value, key) => {
      if (key.includes("[") && key.includes("]")) {
        const [arrayKey, indexStr] = key.split("[");
        const indexExpr = indexStr.slice(0, -1);
        let index2 = Number.parseInt(indexExpr, 10);
        if (Number.isNaN(index2)) {
          index2 = evaluateExpression(indexExpr, localData);
        }
        return value?.[arrayKey]?.[index2];
      }
      return value?.[key];
    }, localData);
  } catch (error) {
    console.error(`Error evaluating expression: ${expr}`, error);
    return void 0;
  }
}
function interpolate(template, data, formatter = null) {
  const processConditional = (condition, trueBlock, falseBlock, localData) => {
    const result = evaluateExpression(condition, localData);
    return result ? trueBlock : falseBlock || "";
  };
  const processLoop = (itemName, arrayExpr, loopContent, localData) => {
    const array = evaluateExpression(arrayExpr, localData);
    if (!Array.isArray(array)) {
      console.warn(`Expression "${arrayExpr}" did not evaluate to an array`);
      return "";
    }
    return array.map((item) => {
      const itemData = { ...localData, [itemName]: item, ".": item };
      return interpolate(loopContent, itemData);
    }).join("");
  };
  const processTemplate = (tmpl, localData) => {
    tmpl = tmpl.replace(INTERPOLATE_LOOP_REGEXP, (_, alias, itemName, arrayExpr, loopContent) => processLoop(itemName, arrayExpr, loopContent, localData));
    tmpl = tmpl.replace(INTERPOLATE_CONDITION_REGEXP, (_, alias, condition, trueBlock, falseBlock) => processConditional(condition, trueBlock, falseBlock, localData));
    return tmpl.replace(INTERPOLATE_VARIABLE_REGEXP, (_, expr) => {
      const value = evaluateExpression(expr, localData);
      if (value === void 0) {
        return `{{${expr}}}`;
      }
      if (formatter) {
        return formatter(value);
      }
      return String(value);
    });
  };
  return processTemplate(template, data);
}
function interpolateObject(obj, data) {
  if (obj === null || obj === void 0) {
    return null;
  }
  if (typeof obj === "string") {
    return interpolate(obj, data);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => interpolateObject(item, data));
  }
  if (typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = interpolateObject(value, data);
    }
    return result;
  }
  return obj;
}
async function executeRequest(template, data) {
  const urlRaw = interpolate(template.url, data, encodeURIComponent);
  const url = new URL(urlRaw);
  if (template.query) {
    for (const [key, value] of Object.entries(template.query)) {
      url.searchParams.append(key, interpolate(value, data));
    }
  }
  const method = template.method;
  const headers = Object.fromEntries(
    Object.entries(template.headers || {}).map(([key, value]) => {
      return [key, interpolate(value, data)];
    })
  );
  for (const key of Object.keys(headers)) {
    if (headers[key] === null) {
      delete headers[key];
    }
  }
  let body = null;
  if (template.body) {
    if (template.body.type === "json") {
      body = JSON.stringify(interpolateObject(template.body.content, data));
    } else if (template.body.type === "form") {
      body = new URLSearchParams();
      for (const [key, value] of Object.entries(template.body.content)) {
        body.append(key, interpolate(value, data));
      }
    } else {
      body = interpolate(template.body.content, data);
    }
  }
  const response = await fetch(url, {
    method,
    headers,
    body
  });
  const renderOutput = async (type2, temple, response2) => {
    switch (type2) {
      case "text":
        return interpolate(temple, await response2.text());
      case "json":
      default:
        return interpolate(temple, await response2.json());
    }
  };
  if (!response.ok) {
    const content2 = await renderOutput(template.response?.error?.input_type, template.response.error?.output, response);
    return {
      type: template.response.error.output_type,
      content: content2
    };
  }
  let content = await renderOutput(template.response.content?.input_type, template.response.content?.output, response);
  if (template.response?.render) {
    content = template.response.render.replace("{{input}}", data.DATA).replace("{{output}}", content);
  }
  return {
    type: template.response.content.output_type,
    content
  };
}
function formatInput(input, type2) {
  if (type2 === "json") {
    return JSON.parse(input);
  } else if (type2 === "space-separated") {
    return input.split(/\s+/);
  } else if (type2 === "comma-separated") {
    return input.split(/\s*,\s*/);
  } else {
    return input;
  }
}
const logSingleton = /* @__PURE__ */ new WeakMap();
const tagMessageIds = /* @__PURE__ */ new WeakMap();
function Log(value, context) {
  if (context.kind === "field") {
    const configIndex = 1;
    return function(initialValue) {
      if (typeof initialValue === "function") {
        return async function(...args) {
          const config = args[configIndex];
          const logs = getLogSingleton(config);
          const startTime = Date.now();
          logs.ongoingFunctions.push({
            name: initialValue.name || "anonymous",
            startTime
          });
          let model;
          try {
            model = args[0]?.model || this.model(config, args[0]);
            if (this.type === "tool") {
              logs.tool.model = model;
            } else {
              logs.chat.model = model;
            }
            const result = await initialValue.apply(this, args);
            const endTime = Date.now();
            const elapsed = ((endTime - startTime) / 1e3).toFixed(1);
            logs.ongoingFunctions = logs.ongoingFunctions.filter(
              (func) => func.startTime !== startTime
            );
            handleLlmLog(logs, result, elapsed, this.type);
            if (!result.content && !result.tool_calls) {
              return result;
            }
            if (result.usage) {
              logs.tokens.push(`${result.usage.prompt_tokens},${result.usage.completion_tokens}`);
            }
            return { content: result.content, tool_calls: result.tool_calls };
          } catch (error) {
            logs.ongoingFunctions = logs.ongoingFunctions.filter(
              (func) => func.startTime !== startTime
            );
            throw error;
          }
        };
      } else {
        return initialValue;
      }
    };
  }
  if (context.kind === "method" && typeof value === "function") {
    return async function(...args) {
      const config = this.context.USER_CONFIG;
      const logs = getLogSingleton(config);
      const startTime = Date.now();
      const result = await value.apply(this, args);
      const endTime = Date.now();
      const elapsed = ((endTime - startTime) / 1e3).toFixed(1);
      logs.functionTime.push(elapsed);
      return result;
    };
  }
  return value;
}
function getLogSingleton(config) {
  if (!logSingleton.has(config)) {
    logSingleton.set(config, {
      functions: [],
      functionTime: [],
      tool: {
        model: "",
        time: []
      },
      chat: {
        model: "",
        time: []
      },
      tokens: [],
      ongoingFunctions: [],
      error: ""
    });
  }
  return logSingleton.get(config);
}
function getLog(context, onlyModel = false, isParagraph = false) {
  if (!context.ENABLE_SHOWINFO)
    return "";
  const logObj = logSingleton.get(context);
  if (!logObj)
    return "";
  if (onlyModel) {
    return logObj.chat.model || logObj.tool.model || "UNKNOWN";
  }
  const logList = [];
  const show = {
    model: context.SHOW_PARTS.includes("model"),
    model_time: context.SHOW_PARTS.includes("model_time"),
    token: context.SHOW_PARTS.includes("token"),
    tool: context.SHOW_PARTS.includes("tool"),
    tool_time: context.SHOW_PARTS.includes("tool_time")
  };
  if (logObj.tool.model && show.model) {
    let toolsLog = logObj.tool.model;
    if (logObj.tool.time.length > 0 && show.model_time) {
      toolsLog += ` c_t: ${logObj.tool.time.join("s ")}s`;
    }
    if (logObj.functionTime.length > 0 && show.tool_time) {
      toolsLog += ` f_t: ${logObj.functionTime.join("s ")}s`;
    }
    logList.push(toolsLog);
  }
  if (logObj.functions.length > 0 && show.tool) {
    const functionLogs = logObj.functions.map((log2) => {
      const args = Object.values(log2.arguments).join(", ");
      return `${log2.name}: ${args}`.substring(0, 80);
    });
    logList.push(...functionLogs);
  }
  if (logObj.error) {
    logList.push(`${logObj.error}`);
  }
  if (logObj.chat.model.length > 0 && show.model) {
    const chatLogs = `${logObj.chat.model}${logObj.chat.time.length > 0 && show.model_time ? ` ${logObj.chat.time.join("s ")}s` : ""}`;
    logList.push(chatLogs);
  }
  logObj.ongoingFunctions.forEach((func) => {
    const elapsed = ((Date.now() - func.startTime) / 1e3).toFixed(1);
    logList.push(`[ongoing: ${func.name} ${elapsed}s]`);
  });
  if (logObj.tokens.length > 0 && show.token) {
    logList.push(`${logObj.tokens.join("|")}`);
  }
  return isParagraph ? logList.filter(Boolean).join() : `LOGSTART${logList.filter(Boolean).map((entry) => `>\`${entry}\``).join("\n")}LOGEND`;
}
function clearLog(context) {
  logSingleton.delete(context);
}
function handleLlmLog(logs, result, time, type2) {
  if (type2 === "tool") {
    logs.tool.time.push(time);
  } else {
    logs.chat.time.push(time);
  }
  if (type2 === "tool" && result.tool_calls && result.tool_calls.length > 0) {
    logs.functions.push(
      ...result.tool_calls.map((tool2) => ({
        name: tool2.function.name,
        arguments: JSON.parse(tool2.function.arguments)
      }))
    );
  }
}
function markdownToTelegraphNodes(markdown) {
  const lines = markdown.split("\n");
  const nodes = [];
  let inCodeBlock = 0;
  let codeBlockLanguage = "";
  let codeBlockContent = "";
  let codeMatch;
  for (let line of lines) {
    const codeRegex = /^```(.*)/;
    if (codeMatch = codeRegex.exec(line.trim())) {
      if (inCodeBlock === 1 && codeMatch[1] === "") {
        nodes.push({
          tag: "pre",
          children: [
            {
              tag: "code",
              attrs: codeBlockLanguage ? { class: codeBlockLanguage } : {},
              children: [codeBlockContent.trim()]
            }
          ]
        });
        inCodeBlock--;
        codeBlockContent = "";
        codeBlockLanguage = "";
      } else if (inCodeBlock > 1 && codeMatch[1] === "") {
        inCodeBlock--;
        codeBlockContent += `${line}
`;
      } else if (inCodeBlock > 0 && codeMatch[1] !== "") {
        inCodeBlock++;
        codeBlockContent += `${line}
`;
      } else {
        inCodeBlock++;
        codeBlockLanguage = codeMatch[1];
      }
      continue;
    }
    if (inCodeBlock > 0) {
      codeBlockContent += `${line}
`;
      continue;
    }
    const _line = line.trim();
    if (!_line)
      continue;
    if (_line.startsWith("#")) {
      const titleRegex = /^#+/;
      const match = titleRegex.exec(_line);
      let level = match ? match[0].length : 0;
      level = level <= 2 ? 3 : 4;
      const text2 = line.replace(/^#+\s*/, "");
      nodes.push({ tag: `h${level}`, children: processInlineElements(text2) });
    } else if (_line.startsWith("> ")) {
      const text2 = line.slice(2);
      nodes.push({ tag: "blockquote", children: processInlineElements(text2) });
    } else if (_line === "---" || _line === "***") {
      nodes.push({ tag: "hr" });
    } else {
      const matches = /^(\s*)(?:-|\*)\s/.exec(line);
      if (matches) {
        line = `${matches[1]}• ${line.slice(matches[0].length)}`;
      }
      nodes.push({ tag: "p", children: processInlineElements(line) });
    }
  }
  if (inCodeBlock > 0) {
    nodes.push({
      tag: "pre",
      children: [
        {
          tag: "code",
          attrs: codeBlockLanguage ? { class: codeBlockLanguage } : {},
          children: [codeBlockContent.trim() + (inCodeBlock > 1 ? "```\n".repeat(inCodeBlock - 1) : "")]
        }
      ]
    });
  }
  return nodes;
}
function processInlineElementsHelper(text2) {
  const children = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match = null;
  let index2 = 0;
  while (true) {
    match = linkRegex.exec(text2);
    if (match === null)
      break;
    if (match.index > index2) {
      children.push(...processInlineStyles(text2.slice(index2, match.index)));
    }
    children.push({
      tag: "a",
      attrs: { href: match[2] },
      children: [match[1]]
    });
    index2 = match.index + match[0].length;
  }
  if (index2 < text2.length) {
    children.push(...processInlineStyles(text2.slice(index2)));
  }
  return children;
}
function processInlineStyles(text2) {
  const children = [];
  const styleRegex = /(^|[^\\])(\*\*|__|_|~~)(.*?[^\\]?)\2/g;
  let lastIndex = 0;
  let match;
  while (true) {
    match = styleRegex.exec(text2);
    if (match === null)
      break;
    if (match.index + match[1].length > lastIndex) {
      children.push(text2.slice(lastIndex, match.index + match[1].length));
    }
    let tag = "";
    switch (match[2]) {
      case "**":
        tag = "strong";
        break;
      case "__":
        tag = "u";
        break;
      case "_":
        tag = "i";
        break;
      case "~~":
        tag = "s";
        break;
      default:
        tag = "span";
        break;
    }
    children.push({
      tag,
      children: [...processInlineStyles(match[3])]
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text2.length) {
    children.push(text2.slice(lastIndex));
  }
  return children;
}
function processInlineElements(text2) {
  const children = [];
  const codeRegex = /(^|[^\\])`(.*?[^\\]?)`/g;
  let codeMatch;
  let lastIndex = 0;
  while ((codeMatch = codeRegex.exec(text2)) !== null) {
    if (codeMatch.index + codeMatch[1].length > lastIndex) {
      children.push(...processInlineElementsHelper(text2.slice(lastIndex, codeMatch.index + codeMatch[1].length)));
    }
    children.push({
      tag: "code",
      children: [codeMatch[2]]
    });
    lastIndex = codeMatch.index + codeMatch[0].length;
  }
  if (lastIndex < text2.length) {
    children.push(...processInlineElementsHelper(text2.slice(lastIndex)));
  }
  return children;
}
const escapeChars = /[_*[\]()\\~`>#+\-=|{}.!]/g;
const escapedChars = {
  "\\*": "ESCAPEASTERISK",
  "\\_": "ESCAPEUNDERSCORE",
  "\\~": "ESCAPETILDE",
  "\\|": "ESCAPEPIP",
  "\\`": "ESCAPEBACKTICK",
  "\\\\": "ESCAPEBACKSLASH",
  "\\(": "ESCAPELEFTPARENTHESIS",
  "\\)": "ESCAPERIGHTPARENTHESIS",
  "\\[": "ESCAPELEFTBRACKET",
  "\\]": "ESCAPERIGHTBRACKET",
  "\\{": "ESCAPELEFTBRACE",
  "\\}": "ESCAPERIGHTBRACE",
  "\\>": "ESCAPEGREATERTHAN",
  "\\#": "ESCAPEHASH",
  "\\+": "ESCAPEPLUS",
  "\\-": "ESCAPEMINUS",
  "\\=": "ESCAPEEQUAL",
  "\\.": "ESCAPEDOT",
  "\\!": "ESCAPEEXCLAMATION",
  "\\?": "ESCAPEQUESTION"
};
const escapedRegexp = /\\[*_~|`\\()[\]{}>#+\-=.!]/g;
const logRegexp = /^>?LOGSTART\\>([\s\S]*?)LOGEND$/m;
const reverseCodeRegexp = /\\`\\`\\`([\s\S]+)\\`\\`\\`$/g;
const inlineCodeRegexp = /`[^\n]*?`/g;
const linkRegexp = /\\\[([^\]\n]+?)\\\]\\\((.+?)\\\)/g;
const escapeRegexpMatch = [
  {
    regex: /\\\*\\\*(\S|\S[^\n]*?\S)\\\*\\\*/g,
    value: "*$1*"
  },
  {
    regex: /\\_\\_(\S|\S[^\n]*?\S)\\_\\_/g,
    value: "__$1__"
  },
  {
    regex: /\\(_|\*)(\S|\S[^\n]*?\S)\\\1/g,
    value: "_$2_"
  },
  {
    regex: /\\~(\S|\S[^\n]*?\S)\\~/g,
    value: "~$1~"
  },
  {
    regex: /\\\|\\\|(\S|\S[^\n]*?\S)\\\|\\\|/g,
    value: "||$1||"
  },
  {
    regex: /^ *\\> *([^\n]*)$/gm,
    value: ">$1"
  },
  {
    regex: /^(>? *)\\(?:-|\*)\s+([^\n]*)$/gm,
    value: "$1• $2"
  },
  {
    regex: /^((?:\\#){1,6} )([^\n]+)$/g,
    value: "$1*$2*"
  }
];
const escapedCharsReverseMap = new Map(Object.entries(escapedChars).map(([key, value]) => [value, key]));
function escape(text2, expandParams = { addQuote: false, quoteExpandable: false }) {
  const lines = text2.split("\n");
  const codeStack = [];
  const result = [];
  let lineTrim = "";
  let textStartIndex = 0;
  for (const [i, line] of lines.entries()) {
    lineTrim = line.trim();
    let startIndex;
    if (/^```.+/.test(lineTrim)) {
      codeStack.push(i);
      if (textStartIndex < i) {
        result.push(handleEscape(lines.slice(textStartIndex, i).join("\n"), "text", expandParams));
      }
    } else if (lineTrim === "```") {
      if (codeStack.length > 0) {
        startIndex = codeStack.pop();
        if (codeStack.length === 0) {
          const content = lines.slice(startIndex, i + 1).join("\n");
          result.push(handleEscape(content, "code", expandParams));
          textStartIndex = i + 1;
        }
      } else {
        codeStack.push(i);
        if (textStartIndex < i) {
          result.push(handleEscape(lines.slice(textStartIndex, i).join("\n"), "text", expandParams));
        }
      }
    }
  }
  if (codeStack.length > 0) {
    const last = `${lines.slice(codeStack[0]).join("\n")}
\`\`\``;
    result.push(handleEscape(last, "code", expandParams));
  } else if (textStartIndex < lines.length) {
    result.push(handleEscape(lines.slice(textStartIndex).join("\n"), "text", expandParams));
  }
  return addExpandable(result.join("\n"), expandParams.quoteExpandable);
}
function handleEscape(text2, type2, { addQuote }) {
  if (!text2.trim()) {
    return text2;
  }
  text2 = text2.replace(escapedRegexp, (match) => escapedChars[match]);
  if (type2 === "text") {
    const markd = {};
    text2 = markData(text2, markd).text;
    text2 = text2.replace(escapeChars, (match) => `\\${match}`);
    text2 = markData(text2, markd, "LINK").text;
    escapeRegexpMatch.forEach((item) => text2 = text2.replace(item.regex, item.value));
    Object.entries(markd).forEach(([key, value]) => {
      text2 = text2.replace(key, value);
    });
  } else if (!addQuote) {
    const codeBlank = text2.length - text2.trimStart().length;
    if (codeBlank > 0) {
      const blankReg = new RegExp(`^\\s{${codeBlank}}`, "gm");
      text2 = text2.replace(blankReg, "");
    }
    text2 = text2.trimEnd().replace(/([\\`])/g, "\\$1").replace(reverseCodeRegexp, "```$1```");
  } else {
    text2 = text2.replace(escapeChars, (match) => `\\${match}`);
  }
  text2 = quoteMessage(text2, addQuote);
  return text2.replace(
    new RegExp(Object.values(escapedChars).join("|"), "g"),
    (match) => escapedCharsReverseMap.get(match) ?? match
  );
}
function chunkDocument(text2, chunkSize = 4e3) {
  const cleanText = text2.replace(/\n\s+\n/g, "\n\n");
  const textList = lineSegment(cleanText);
  const chunks = [[]];
  let chunkIndex = 0;
  const codeStack = [];
  for (const line of textList) {
    if (chunks[chunkIndex].join("\n").length + line.length > chunkSize) {
      chunkIndex++;
      chunks.push([]);
      if (codeStack.length > 0) {
        const lastLineIsCodeStart = chunks[chunkIndex - 1].at(-1)?.trimStart()?.startsWith("```");
        lastLineIsCodeStart && chunks[chunkIndex - 1].pop();
        chunks[chunkIndex - 1].push(...Array.from({ length: lastLineIsCodeStart ? codeStack.length - 1 : codeStack.length }, () => "```"));
        if (line.trim() === "```") {
          codeStack.pop();
          chunks[chunkIndex].unshift(...codeStack);
          continue;
        }
        chunks[chunkIndex].unshift(...codeStack);
      }
      chunks[chunkIndex].push(line);
      continue;
    }
    if (/^```.+/.test(line.trimStart())) {
      codeStack.push(line);
    } else if (line.trim() === "```") {
      if (codeStack.length) {
        codeStack.pop();
      } else {
        codeStack.push(line);
      }
    }
    chunks[chunkIndex].push(line);
  }
  if (codeStack.length) {
    chunks[chunkIndex].push(...Array.from({ length: codeStack.length }).fill("```"));
  }
  return chunks.map((c) => c.join("\n"));
}
function lineSegment(text2, chunkSize = 4e3) {
  const chunkText = (text22) => {
    const chunks = [];
    for (let i = 0; i < text22.length; i += chunkSize) {
      const isNeedAddQuote = i > 0 && text22.trimStart().startsWith(">");
      chunks.push((isNeedAddQuote ? ">" : "") + text22.slice(i, i + chunkSize));
    }
    return chunks;
  };
  const newLines = [];
  const lines = text2.split("\n");
  for (const line of lines) {
    if (line.length > chunkSize) {
      newLines.push(...chunkText(line));
      continue;
    }
    newLines.push(line);
  }
  return newLines;
}
function markData(text2, markd, type2 = "INCODE") {
  const isIncode = type2 === "INCODE";
  const matches = text2.matchAll(isIncode ? inlineCodeRegexp : linkRegexp);
  let i = 0;
  for (const match of matches) {
    markd[`${type2} ${i}`] = isIncode ? match[0] : `[${match[1]}](${match[2]})`;
    text2 = text2.replace(match[0], `${type2} ${i}`);
    i++;
  }
  return {
    text: text2,
    markd
  };
}
function addExpandable(text2, quoteExpandable) {
  if (!quoteExpandable) {
    text2 = text2.replace(/^>?LOGSTART\\>([\s\S]*?)LOGEND((?:\n>[^\n]*)*)$/m, `**>$1$2||`);
    text2 = text2.replace(/^(>?)LOGSTART/m, "$1").replace(/LOGEND$/m, "");
    return text2;
  }
  text2 = text2.replace(logRegexp, `>$1`);
  text2 = text2.replace(/(?:^>[^\n]*(\n|$))+/gm, (match, p1) => `**${match.trimEnd()}||${p1}`);
  text2 = text2.replace(/^(>?)LOGSTART/m, "$1").replace(/LOGEND(\|\|)?$/m, "$1");
  return text2;
}
function quoteMessage(text2, addQuote) {
  if (!addQuote) {
    return text2;
  }
  const textList = text2.split("\n");
  textList.forEach((line, index2) => {
    if (!line.trimStart().startsWith(">")) {
      textList[index2] = `>${line}`;
    }
  });
  return textList.join("\n");
}
var marker$1 = "vercel.ai.error";
var symbol$1 = Symbol.for(marker$1);
var _a$1;
var _AISDKError = class _AISDKError2 extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a$1] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError2.hasMarker(error, marker$1);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
_a$1 = symbol$1;
var AISDKError = _AISDKError;
var name$1 = "AI_APICallError";
var marker2$1 = `vercel.ai.error.${name$1}`;
var symbol2$1 = Symbol.for(marker2$1);
var _a2$1;
var APICallError = class extends AISDKError {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name: name$1, message, cause });
    this[_a2$1] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2$1);
  }
};
_a2$1 = symbol2$1;
var name2$1 = "AI_EmptyResponseBodyError";
var marker3$1 = `vercel.ai.error.${name2$1}`;
var symbol3$1 = Symbol.for(marker3$1);
var _a3$1;
var EmptyResponseBodyError = class extends AISDKError {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2$1, message });
    this[_a3$1] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3$1);
  }
};
_a3$1 = symbol3$1;
function getErrorMessage$1(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
var name3$1 = "AI_InvalidArgumentError";
var marker4$1 = `vercel.ai.error.${name3$1}`;
var symbol4$1 = Symbol.for(marker4$1);
var _a4$1;
var InvalidArgumentError$1 = class InvalidArgumentError extends AISDKError {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3$1, message, cause });
    this[_a4$1] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4$1);
  }
};
_a4$1 = symbol4$1;
var name4$1 = "AI_InvalidPromptError";
var marker5$1 = `vercel.ai.error.${name4$1}`;
var symbol5$1 = Symbol.for(marker5$1);
var _a5$1;
var InvalidPromptError = class extends AISDKError {
  constructor({
    prompt: prompt2,
    message,
    cause
  }) {
    super({ name: name4$1, message: `Invalid prompt: ${message}`, cause });
    this[_a5$1] = true;
    this.prompt = prompt2;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5$1);
  }
};
_a5$1 = symbol5$1;
var name5$1 = "AI_InvalidResponseDataError";
var marker6$1 = `vercel.ai.error.${name5$1}`;
var symbol6$1 = Symbol.for(marker6$1);
var _a6$1;
var InvalidResponseDataError = class extends AISDKError {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5$1, message });
    this[_a6$1] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6$1);
  }
};
_a6$1 = symbol6$1;
var name6$1 = "AI_JSONParseError";
var marker7$1 = `vercel.ai.error.${name6$1}`;
var symbol7$1 = Symbol.for(marker7$1);
var _a7$1;
var JSONParseError = class extends AISDKError {
  constructor({ text: text2, cause }) {
    super({
      name: name6$1,
      message: `JSON parsing failed: Text: ${text2}.
Error message: ${getErrorMessage$1(cause)}`,
      cause
    });
    this[_a7$1] = true;
    this.text = text2;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7$1);
  }
};
_a7$1 = symbol7$1;
var name7$1 = "AI_LoadAPIKeyError";
var marker8$1 = `vercel.ai.error.${name7$1}`;
var symbol8$1 = Symbol.for(marker8$1);
var _a8$1;
var LoadAPIKeyError = class extends AISDKError {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7$1, message });
    this[_a8$1] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8$1);
  }
};
_a8$1 = symbol8$1;
var name8$1 = "AI_LoadSettingError";
var marker9$1 = `vercel.ai.error.${name8$1}`;
var symbol9$1 = Symbol.for(marker9$1);
var _a9$1;
var LoadSettingError = class extends AISDKError {
  // used in isInstance
  constructor({ message }) {
    super({ name: name8$1, message });
    this[_a9$1] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker9$1);
  }
};
_a9$1 = symbol9$1;
var name10$1 = "AI_NoSuchModelError";
var marker11$1 = `vercel.ai.error.${name10$1}`;
var symbol11$1 = Symbol.for(marker11$1);
var _a11$1;
var NoSuchModelError = class extends AISDKError {
  constructor({
    errorName = name10$1,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a11$1] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker11$1);
  }
};
_a11$1 = symbol11$1;
var name11$1 = "AI_TooManyEmbeddingValuesForCallError";
var marker12$1 = `vercel.ai.error.${name11$1}`;
var symbol12$1 = Symbol.for(marker12$1);
var _a12$1;
var TooManyEmbeddingValuesForCallError = class extends AISDKError {
  constructor(options) {
    super({
      name: name11$1,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a12$1] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker12$1);
  }
};
_a12$1 = symbol12$1;
var name12$1 = "AI_TypeValidationError";
var marker13$1 = `vercel.ai.error.${name12$1}`;
var symbol13$1 = Symbol.for(marker13$1);
var _a13$1;
var _TypeValidationError = class _TypeValidationError2 extends AISDKError {
  constructor({ value, cause }) {
    super({
      name: name12$1,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage$1(cause)}`,
      cause
    });
    this[_a13$1] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13$1);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError2.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError2({ value, cause });
  }
};
_a13$1 = symbol13$1;
var TypeValidationError = _TypeValidationError;
var name13$1 = "AI_UnsupportedFunctionalityError";
var marker14 = `vercel.ai.error.${name13$1}`;
var symbol14 = Symbol.for(marker14);
var _a14;
var UnsupportedFunctionalityError = class extends AISDKError {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13$1, message });
    this[_a14] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker14);
  }
};
_a14 = symbol14;
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i = size | 0;
    while (i--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var secureJsonParse = { exports: {} };
var hasRequiredSecureJsonParse;
function requireSecureJsonParse() {
  if (hasRequiredSecureJsonParse) return secureJsonParse.exports;
  hasRequiredSecureJsonParse = 1;
  const hasBuffer = typeof Buffer !== "undefined";
  const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
  const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  function _parse(text2, reviver, options) {
    if (options == null) {
      if (reviver !== null && typeof reviver === "object") {
        options = reviver;
        reviver = void 0;
      }
    }
    if (hasBuffer && Buffer.isBuffer(text2)) {
      text2 = text2.toString();
    }
    if (text2 && text2.charCodeAt(0) === 65279) {
      text2 = text2.slice(1);
    }
    const obj = JSON.parse(text2, reviver);
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    const protoAction = options && options.protoAction || "error";
    const constructorAction = options && options.constructorAction || "error";
    if (protoAction === "ignore" && constructorAction === "ignore") {
      return obj;
    }
    if (protoAction !== "ignore" && constructorAction !== "ignore") {
      if (suspectProtoRx.test(text2) === false && suspectConstructorRx.test(text2) === false) {
        return obj;
      }
    } else if (protoAction !== "ignore" && constructorAction === "ignore") {
      if (suspectProtoRx.test(text2) === false) {
        return obj;
      }
    } else {
      if (suspectConstructorRx.test(text2) === false) {
        return obj;
      }
    }
    return filter(obj, { protoAction, constructorAction, safe: options && options.safe });
  }
  function filter(obj, { protoAction = "error", constructorAction = "error", safe } = {}) {
    let next = [obj];
    while (next.length) {
      const nodes = next;
      next = [];
      for (const node of nodes) {
        if (protoAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "__proto__")) {
          if (safe === true) {
            return null;
          } else if (protoAction === "error") {
            throw new SyntaxError("Object contains forbidden prototype property");
          }
          delete node.__proto__;
        }
        if (constructorAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
          if (safe === true) {
            return null;
          } else if (constructorAction === "error") {
            throw new SyntaxError("Object contains forbidden prototype property");
          }
          delete node.constructor;
        }
        for (const key in node) {
          const value = node[key];
          if (value && typeof value === "object") {
            next.push(value);
          }
        }
      }
    }
    return obj;
  }
  function parse(text2, reviver, options) {
    const stackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    try {
      return _parse(text2, reviver, options);
    } finally {
      Error.stackTraceLimit = stackTraceLimit;
    }
  }
  function safeParse(text2, reviver) {
    const stackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    try {
      return _parse(text2, reviver, { safe: true });
    } catch (_e2) {
      return null;
    } finally {
      Error.stackTraceLimit = stackTraceLimit;
    }
  }
  secureJsonParse.exports = parse;
  secureJsonParse.exports.default = parse;
  secureJsonParse.exports.parse = parse;
  secureJsonParse.exports.safeParse = safeParse;
  secureJsonParse.exports.scan = filter;
  return secureJsonParse.exports;
}
var secureJsonParseExports = requireSecureJsonParse();
const SecureJSON = /* @__PURE__ */ getDefaultExportFromCjs(secureJsonParseExports);
var __defProp$2 = Object.defineProperty, __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key != "symbol" ? key + "" : key, value);
class ParseError extends Error {
  constructor(message, options) {
    super(message), __publicField$1(this, "type"), __publicField$1(this, "field"), __publicField$1(this, "value"), __publicField$1(this, "line"), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
}
function noop(_arg) {
}
function createParser(callbacks) {
  const { onEvent = noop, onError = noop, onRetry = noop, onComment } = callbacks;
  let incompleteLine = "", isFirstChunk = true, id, data = "", eventType = "";
  function feed(newChunk) {
    const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk, [complete, incomplete] = splitLines(`${incompleteLine}${chunk}`);
    for (const line of complete)
      parseLine(line);
    incompleteLine = incomplete, isFirstChunk = false;
  }
  function parseLine(line) {
    if (line === "") {
      dispatchEvent();
      return;
    }
    if (line.startsWith(":")) {
      onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
      return;
    }
    const fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex !== -1) {
      const field = line.slice(0, fieldSeparatorIndex), offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
      processField(field, value, line);
      return;
    }
    processField(line, "", line);
  }
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data = `${data}${value}
`;
        break;
      case "id":
        id = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(
          new ParseError(`Invalid \`retry\` value: "${value}"`, {
            type: "invalid-retry",
            value,
            line
          })
        );
        break;
      default:
        onError(
          new ParseError(
            `Unknown field "${field.length > 20 ? `${field.slice(0, 20)}…` : field}"`,
            { type: "unknown-field", field, value, line }
          )
        );
        break;
    }
  }
  function dispatchEvent() {
    data.length > 0 && onEvent({
      id,
      event: eventType || void 0,
      data: data.endsWith(`
`) ? data.slice(0, -1) : data
    }), id = void 0, data = "", eventType = "";
  }
  function reset(options = {}) {
    incompleteLine && options.consume && parseLine(incompleteLine), id = void 0, data = "", eventType = "", incompleteLine = "";
  }
  return { feed, reset };
}
function splitLines(chunk) {
  const lines = [];
  let incompleteLine = "";
  const totalLength = chunk.length;
  for (let i = 0; i < totalLength; i++) {
    const char = chunk[i];
    char === "\r" && chunk[i + 1] === `
` ? (lines.push(incompleteLine), incompleteLine = "", i++) : char === "\r" || char === `
` ? (lines.push(incompleteLine), incompleteLine = "") : incompleteLine += char;
  }
  return [lines, incompleteLine];
}
class EventSourceParserStream extends TransformStream {
  constructor({ onError, onRetry, onComment } = {}) {
    let parser;
    super({
      start(controller) {
        parser = createParser({
          onEvent: (event) => {
            controller.enqueue(event);
          },
          onError(error) {
            onError === "terminate" ? controller.error(error) : typeof onError == "function" && onError(error);
          },
          onRetry,
          onComment
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      }
    });
  }
}
function combineHeaders(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}
function convertAsyncIteratorToReadableStream(iterator) {
  return new ReadableStream({
    /**
     * Called when the consumer wants to pull more data from the stream.
     *
     * @param {ReadableStreamDefaultController<T>} controller - The controller to enqueue data into the stream.
     * @returns {Promise<void>}
     */
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
      }
    },
    /**
     * Called when the consumer cancels the stream.
     */
    cancel() {
    }
  });
}
async function delay(delayInMs) {
  return delayInMs == null ? Promise.resolve() : new Promise((resolve2) => setTimeout(resolve2, delayInMs));
}
function extractResponseHeaders(response) {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}
var createIdGenerator = ({
  prefix,
  size: defaultSize = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = customAlphabet(alphabet, defaultSize);
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError$1({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return (size) => `${prefix}${separator}${generator(size)}`;
};
var generateId = createIdGenerator();
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
function removeUndefinedEntries(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}
function isAbortError(error) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}
function loadApiKey({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}
function loadSetting({
  settingValue,
  environmentVariableName,
  settingName,
  description
}) {
  if (typeof settingValue === "string") {
    return settingValue;
  }
  if (settingValue != null) {
    throw new LoadSettingError({
      message: `${description} setting must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadSettingError({
      message: `${description} setting is missing. Pass it using the '${settingName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  settingValue = process.env[environmentVariableName];
  if (settingValue == null) {
    throw new LoadSettingError({
      message: `${description} setting is missing. Pass it using the '${settingName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof settingValue !== "string") {
    throw new LoadSettingError({
      message: `${description} setting must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return settingValue;
}
var validatorSymbol = Symbol.for("vercel.ai.validator");
function validator(validate) {
  return { [validatorSymbol]: true, validate };
}
function isValidator(value) {
  return typeof value === "object" && value !== null && validatorSymbol in value && value[validatorSymbol] === true && "validate" in value;
}
function asValidator(value) {
  return isValidator(value) ? value : zodValidator(value);
}
function zodValidator(zodSchema2) {
  return validator((value) => {
    const result = zodSchema2.safeParse(value);
    return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
  });
}
function validateTypes({
  value,
  schema: inputSchema
}) {
  const result = safeValidateTypes({ value, schema: inputSchema });
  if (!result.success) {
    throw TypeValidationError.wrap({ value, cause: result.error });
  }
  return result.value;
}
function safeValidateTypes({
  value,
  schema: schema2
}) {
  const validator2 = asValidator(schema2);
  try {
    if (validator2.validate == null) {
      return { success: true, value };
    }
    const result = validator2.validate(value);
    if (result.success) {
      return result;
    }
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: result.error })
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: error })
    };
  }
}
function parseJSON({
  text: text2,
  schema: schema2
}) {
  try {
    const value = SecureJSON.parse(text2);
    if (schema2 == null) {
      return value;
    }
    return validateTypes({ value, schema: schema2 });
  } catch (error) {
    if (JSONParseError.isInstance(error) || TypeValidationError.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError({ text: text2, cause: error });
  }
}
function safeParseJSON({
  text: text2,
  schema: schema2
}) {
  try {
    const value = SecureJSON.parse(text2);
    if (schema2 == null) {
      return { success: true, value, rawValue: value };
    }
    const validationResult = safeValidateTypes({ value, schema: schema2 });
    return validationResult.success ? { ...validationResult, rawValue: value } : validationResult;
  } catch (error) {
    return {
      success: false,
      error: JSONParseError.isInstance(error) ? error : new JSONParseError({ text: text2, cause: error })
    };
  }
}
function isParsableJson(input) {
  try {
    SecureJSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}
var getOriginalFetch2 = () => globalThis.fetch;
var postJsonToApi = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}) => postToApi({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
});
var postToApi = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch: fetch2 = getOriginalFetch2()
}) => {
  try {
    const response = await fetch2(url, {
      method: "POST",
      headers: removeUndefinedEntries(headers),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
        throw new APICallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    if (error instanceof TypeError && error.message === "fetch failed") {
      const cause = error.cause;
      if (cause != null) {
        throw new APICallError({
          message: `Cannot connect to API: ${cause.message}`,
          cause,
          url,
          requestBodyValues: body.values,
          isRetryable: true
          // retry when network error
        });
      }
    }
    throw error;
  }
};
async function resolve(value) {
  if (typeof value === "function") {
    value = value();
  }
  return Promise.resolve(value);
}
var createJsonErrorResponseHandler = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = parseJSON({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createEventSourceResponseHandler = (chunkSchema2) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError({});
  }
  return {
    responseHeaders,
    value: response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream()).pipeThrough(
      new TransformStream({
        transform({ data }, controller) {
          if (data === "[DONE]") {
            return;
          }
          controller.enqueue(
            safeParseJSON({
              text: data,
              schema: chunkSchema2
            })
          );
        }
      })
    )
  };
};
var createJsonResponseHandler = (responseSchema2) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = safeParseJSON({
    text: responseBody,
    schema: responseSchema2
  });
  const responseHeaders = extractResponseHeaders(response);
  if (!parsedResult.success) {
    throw new APICallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};
var { btoa: btoa$1, atob: atob$1 } = globalThis;
function convertBase64ToUint8Array(base64String) {
  const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const latin1string = atob$1(base64Url);
  return Uint8Array.from(latin1string, (byte) => byte.codePointAt(0));
}
function convertUint8ArrayToBase64(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa$1(latin1string);
}
function withoutTrailingSlash(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}
const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  definitionPath: "definitions",
  target: "jsonSchema7",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  markdownDescription: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
};
const getDefaultOptions = (options) => typeof options === "string" ? {
  ...defaultOptions,
  name: options
} : {
  ...defaultOptions,
  ...options
};
const getRefs = (options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    currentPath,
    propertyPath: void 0,
    seen: new Map(Object.entries(_options.definitions).map(([name14, def]) => [
      def._def,
      {
        def: def._def,
        path: [..._options.basePath, _options.definitionPath, name14],
        jsonSchema: void 0
      }
    ]))
  };
};
function addErrorMessage(res, key, errorMessage, refs) {
  if (!refs?.errorMessages)
    return;
  if (errorMessage) {
    res.errorMessage = {
      ...res.errorMessage,
      [key]: errorMessage
    };
  }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
  res[key] = value;
  addErrorMessage(res, key, errorMessage, refs);
}
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object2) => {
    const keys = [];
    for (const key in object2) {
      if (Object.prototype.hasOwnProperty.call(object2, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
const getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
const ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
const quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
const errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
let overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
const makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
const EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
const INVALID = Object.freeze({
  status: "aborted"
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return state.set(receiver, value), value;
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache, _ZodNativeEnum_cache;
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
const handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a16, _b2;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a16 = message !== null && message !== void 0 ? message : required_error) !== null && _a16 !== void 0 ? _a16 : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b2 = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b2 !== void 0 ? _b2 : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a16;
    const ctx = {
      common: {
        issues: [],
        async: (_a16 = params === null || params === void 0 ? void 0 : params.async) !== null && _a16 !== void 0 ? _a16 : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a16, _b2;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b2 = (_a16 = err === null || err === void 0 ? void 0 : err.message) === null || _a16 === void 0 ? void 0 : _a16.toLowerCase()) === null || _b2 === void 0 ? void 0 : _b2.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex$1;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a16) {
    return false;
  }
}
function isValidCidr(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex$1) {
          emojiRegex$1 = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex$1.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a16) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a16, _b2;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a16 = options === null || options === void 0 ? void 0 : options.offset) !== null && _a16 !== void 0 ? _a16 : false,
      local: (_b2 = options === null || options === void 0 ? void 0 : options.local) !== null && _b2 !== void 0 ? _b2 : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  var _a16;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a16 = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a16 !== void 0 ? _a16 : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a16) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  var _a16;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a16 = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a16 !== void 0 ? _a16 : false,
    ...processCreateParams(params)
  });
};
class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema2, params) => {
  return new ZodArray({
    type: schema2,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema2) {
  if (schema2 instanceof ZodObject) {
    const newShape = {};
    for (const key in schema2.shape) {
      const fieldSchema = schema2.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema2._def,
      shape: () => newShape
    });
  } else if (schema2 instanceof ZodArray) {
    return new ZodArray({
      ...schema2._def,
      type: deepPartialify(schema2.element)
    });
  } else if (schema2 instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema2.unwrap()));
  } else if (schema2 instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema2.unwrap()));
  } else if (schema2 instanceof ZodTuple) {
    return ZodTuple.create(schema2.items.map((item) => deepPartialify(item)));
  } else {
    return schema2;
  }
}
class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a16, _b2, _c2, _d2;
          const defaultError = (_c2 = (_b2 = (_a16 = this._def).errorMap) === null || _b2 === void 0 ? void 0 : _b2.call(_a16, issue, ctx).message) !== null && _c2 !== void 0 ? _c2 : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d2 = errorUtil.errToObj(message).message) !== null && _d2 !== void 0 ? _d2 : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema2) {
    return this.augment({ [key]: schema2 });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index2) {
    return new ZodObject({
      ...this._def,
      catchall: index2
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
const getDiscriminator = (type2) => {
  if (type2 instanceof ZodLazy) {
    return getDiscriminator(type2.schema);
  } else if (type2 instanceof ZodEffects) {
    return getDiscriminator(type2.innerType());
  } else if (type2 instanceof ZodLiteral) {
    return [type2.value];
  } else if (type2 instanceof ZodEnum) {
    return type2.options;
  } else if (type2 instanceof ZodNativeEnum) {
    return util.objectValues(type2.enum);
  } else if (type2 instanceof ZodDefault) {
    return getDiscriminator(type2._def.innerType);
  } else if (type2 instanceof ZodUndefined) {
    return [void 0];
  } else if (type2 instanceof ZodNull) {
    return [null];
  } else if (type2 instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type2.unwrap())];
  } else if (type2 instanceof ZodNullable) {
    return [null, ...getDiscriminator(type2.unwrap())];
  } else if (type2 instanceof ZodBranded) {
    return getDiscriminator(type2.unwrap());
  } else if (type2 instanceof ZodReadonly) {
    return getDiscriminator(type2.unwrap());
  } else if (type2 instanceof ZodCatch) {
    return getDiscriminator(type2._def.innerType);
  } else {
    return [];
  }
};
class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type2 of options) {
      const discriminatorValues = getDiscriminator(type2.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type2);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index2 = 0; index2 < a.length; index2++) {
      const itemA = a[index2];
      const itemB = b[index2];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema2 = this._def.items[itemIndex] || this._def.rest;
      if (!schema2)
        return null;
      return schema2._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}
class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index2) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index2, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index2, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}
class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
class ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache)) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values));
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache).has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache)) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)));
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache).has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema2, params) => {
  return new ZodPromise({
    type: schema2,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema2, effect, params) => {
  return new ZodEffects({
    schema: schema2,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema2, params) => {
  return new ZodEffects({
    schema: schema2,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type2, params) => {
  return new ZodOptional({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type2, params) => {
  return new ZodNullable({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type2, params) => {
  return new ZodDefault({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type2, params) => {
  return new ZodCatch({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
const BRAND = Symbol("zod_brand");
class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}
class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type2, params) => {
  return new ZodReadonly({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function custom(check, params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a16, _b2;
      if (!check(data)) {
        const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b2 = (_a16 = p.fatal) !== null && _a16 !== void 0 ? _a16 : fatal) !== null && _b2 !== void 0 ? _b2 : true;
        const p2 = typeof p === "string" ? { message: p } : p;
        ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
      }
    });
  return ZodAny.create();
}
const late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const nanType = ZodNaN.create;
const bigIntType = ZodBigInt.create;
const booleanType = ZodBoolean.create;
const dateType = ZodDate.create;
const symbolType = ZodSymbol.create;
const undefinedType = ZodUndefined.create;
const nullType = ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
const neverType = ZodNever.create;
const voidType = ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const strictObjectType = ZodObject.strictCreate;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const mapType = ZodMap.create;
const setType = ZodSet.create;
const functionType = ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
const nativeEnumType = ZodNativeEnum.create;
const promiseType = ZodPromise.create;
const effectsType = ZodEffects.create;
const optionalType = ZodOptional.create;
const nullableType = ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
const pipelineType = ZodPipeline.create;
const ostring = () => stringType().optional();
const onumber = () => numberType().optional();
const oboolean = () => booleanType().optional();
const coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
const NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});
function parseAnyDef() {
  return {};
}
function parseArrayDef(def, refs) {
  const res = {
    type: "array"
  };
  if (def.type?._def && def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
  }
  if (def.maxLength) {
    setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
  }
  if (def.exactLength) {
    setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
    setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
  }
  return res;
}
function parseBigintDef(def, refs) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
function parseBooleanDef() {
  return {
    type: "boolean"
  };
}
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}
const parseCatchDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy ?? refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def, refs);
  }
}
const integerDateParser = (def, refs) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  if (refs.target === "openApi3") {
    return res;
  }
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        setResponseValueAndErrors(
          res,
          "minimum",
          check.value,
          check.message,
          refs
        );
        break;
      case "max":
        setResponseValueAndErrors(
          res,
          "maximum",
          check.value,
          check.message,
          refs
        );
        break;
    }
  }
  return res;
};
function parseDefaultDef(_def, refs) {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : {};
}
function parseEnumDef(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}
const isJsonSchema7AllOfType = (type2) => {
  if ("type" in type2 && type2.type === "string")
    return false;
  return "allOf" in type2;
};
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
  const mergedAllOf = [];
  allOf.forEach((schema2) => {
    if (isJsonSchema7AllOfType(schema2)) {
      mergedAllOf.push(...schema2.allOf);
      if (schema2.unevaluatedProperties === void 0) {
        unevaluatedProperties = void 0;
      }
    } else {
      let nestedSchema = schema2;
      if ("additionalProperties" in schema2 && schema2.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema2;
        nestedSchema = rest;
      } else {
        unevaluatedProperties = void 0;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? {
    allOf: mergedAllOf,
    ...unevaluatedProperties
  } : void 0;
}
function parseLiteralDef(def, refs) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  if (refs.target === "openApi3") {
    return {
      type: parsedType === "bigint" ? "integer" : parsedType,
      enum: [def.value]
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}
let emojiRegex = void 0;
const zodPatterns = {
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  emoji: () => {
    if (emojiRegex === void 0) {
      emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
    }
    return emojiRegex;
  },
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          break;
        case "max":
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
          break;
        case "endsWith":
          addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "includes": {
          addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern(res, zodPatterns.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern(res, zodPatterns.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
      }
    }
  }
  return res;
}
function escapeLiteralCheckValue(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
const ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
function addFormat(schema2, value, message, refs) {
  if (schema2.format || schema2.anyOf?.some((x) => x.format)) {
    if (!schema2.anyOf) {
      schema2.anyOf = [];
    }
    if (schema2.format) {
      schema2.anyOf.push({
        format: schema2.format,
        ...schema2.errorMessage && refs.errorMessages && {
          errorMessage: { format: schema2.errorMessage.format }
        }
      });
      delete schema2.format;
      if (schema2.errorMessage) {
        delete schema2.errorMessage.format;
        if (Object.keys(schema2.errorMessage).length === 0) {
          delete schema2.errorMessage;
        }
      }
    }
    schema2.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    setResponseValueAndErrors(schema2, "format", value, message, refs);
  }
}
function addPattern(schema2, regex, message, refs) {
  if (schema2.pattern || schema2.allOf?.some((x) => x.pattern)) {
    if (!schema2.allOf) {
      schema2.allOf = [];
    }
    if (schema2.pattern) {
      schema2.allOf.push({
        pattern: schema2.pattern,
        ...schema2.errorMessage && refs.errorMessages && {
          errorMessage: { pattern: schema2.errorMessage.pattern }
        }
      });
      delete schema2.pattern;
      if (schema2.errorMessage) {
        delete schema2.errorMessage.pattern;
        if (Object.keys(schema2.errorMessage).length === 0) {
          delete schema2.errorMessage;
        }
      }
    }
    schema2.allOf.push({
      pattern: stringifyRegExpWithFlags(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    setResponseValueAndErrors(schema2, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
  }
}
function stringifyRegExpWithFlags(regex, refs) {
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    m: regex.flags.includes("m"),
    s: regex.flags.includes("s")
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  try {
    new RegExp(pattern);
  } catch {
    console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
    return regex.source;
  }
  return pattern;
}
function parseRecordDef(def, refs) {
  if (refs.target === "openAi") {
    console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
  }
  if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      type: "object",
      required: def.keyType._def.values,
      properties: def.keyType._def.values.reduce((acc, key) => ({
        ...acc,
        [key]: parseDef(def.valueType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "properties", key]
        }) ?? {}
      }), {}),
      additionalProperties: false
    };
  }
  const schema2 = {
    type: "object",
    additionalProperties: parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? {}
  };
  if (refs.target === "openApi3") {
    return schema2;
  }
  if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
    const { type: type2, ...keyType } = parseStringDef(def.keyType._def, refs);
    return {
      ...schema2,
      propertyNames: keyType
    };
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema2,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
    const { type: type2, ...keyType } = parseBrandedDef(def.keyType._def, refs);
    return {
      ...schema2,
      propertyNames: keyType
    };
  }
  return schema2;
}
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys = parseDef(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || {};
  const values = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || {};
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}
function parseNativeEnumDef(def) {
  const object2 = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object2[object2[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object2[key]);
  const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}
function parseNeverDef() {
  return {
    not: {}
  };
}
function parseNullDef(refs) {
  return refs.target === "openApi3" ? {
    enum: ["null"],
    nullable: true
  } : {
    type: "null"
  };
}
const primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  if (refs.target === "openApi3")
    return asAnyOf(def, refs);
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
    const types = options.reduce((types2, x) => {
      const type2 = primitiveMappings[x._def.typeName];
      return type2 && !types2.includes(type2) ? [...types2, type2] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce((acc, x) => {
      const type2 = typeof x._def.value;
      switch (type2) {
        case "string":
        case "number":
        case "boolean":
          return [...acc, type2];
        case "bigint":
          return [...acc, "integer"];
        case "object":
          if (x._def.value === null)
            return [...acc, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return acc;
      }
    }, []);
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce((acc, x) => {
          return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
        }, [])
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce((acc, x) => [
        ...acc,
        ...x._def.values.filter((x2) => !acc.includes(x2))
      ], [])
    };
  }
  return asAnyOf(def, refs);
}
const asAnyOf = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", `${i}`]
  })).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
  return anyOf.length ? { anyOf } : void 0;
};
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    if (refs.target === "openApi3") {
      return {
        type: primitiveMappings[def.innerType._def.typeName],
        nullable: true
      };
    }
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  if (refs.target === "openApi3") {
    const base2 = parseDef(def.innerType._def, {
      ...refs,
      currentPath: [...refs.currentPath]
    });
    if (base2 && "$ref" in base2)
      return { allOf: [base2], nullable: true };
    return base2 && { ...base2, nullable: true };
  }
  const base = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}
function parseNumberDef(def, refs) {
  const res = {
    type: "number"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        addErrorMessage(res, "type", check.message, refs);
        break;
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
function decideAdditionalProperties(def, refs) {
  if (refs.removeAdditionalStrategy === "strict") {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys !== "strict" : parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? true;
  } else {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys === "passthrough" : parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? true;
  }
}
function parseObjectDef(def, refs) {
  const forceOptionalIntoNullable = refs.target === "openAi";
  const result = {
    type: "object",
    ...Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
      if (propDef === void 0 || propDef._def === void 0)
        return acc;
      let propOptional = propDef.isOptional();
      if (propOptional && forceOptionalIntoNullable) {
        if (propDef instanceof ZodOptional) {
          propDef = propDef._def.innerType;
        }
        if (!propDef.isNullable()) {
          propDef = propDef.nullable();
        }
        propOptional = false;
      }
      const parsedDef = parseDef(propDef._def, {
        ...refs,
        currentPath: [...refs.currentPath, "properties", propName],
        propertyPath: [...refs.currentPath, "properties", propName]
      });
      if (parsedDef === void 0)
        return acc;
      return {
        properties: { ...acc.properties, [propName]: parsedDef },
        required: propOptional ? acc.required : [...acc.required, propName]
      };
    }, { properties: {}, required: [] }),
    additionalProperties: decideAdditionalProperties(def, refs)
  };
  if (!result.required.length)
    delete result.required;
  return result;
}
const parseOptionalDef = (def, refs) => {
  if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? {
    anyOf: [
      {
        not: {}
      },
      innerSchema
    ]
  } : {};
};
const parsePipelineDef = (def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef(def.out._def, refs);
  }
  const a = parseDef(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const b = parseDef(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  });
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema2 = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    setResponseValueAndErrors(schema2, "minItems", def.minSize.value, def.minSize.message, refs);
  }
  if (def.maxSize) {
    setResponseValueAndErrors(schema2, "maxItems", def.maxSize.value, def.maxSize.message, refs);
  }
  return schema2;
}
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
      additionalItems: parseDef(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
    };
  }
}
function parseUndefinedDef() {
  return {
    not: {}
  };
}
function parseUnknownDef() {
  return {};
}
const parseReadonlyDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};
function parseDef(def, refs, forceResolution = false) {
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchema2 = selectParser(def, def.typeName, refs);
  if (jsonSchema2) {
    addMeta(def, refs, jsonSchema2);
  }
  newItem.jsonSchema = jsonSchema2;
  return jsonSchema2;
}
const get$ref = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index2) => refs.currentPath[index2] === value)) {
        console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
        return {};
      }
      return refs.$refStrategy === "seen" ? {} : void 0;
    }
  }
};
const getRelativePath = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i])
      break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
const selectParser = (def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return parseDef(def.getter()._def, refs);
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)();
  }
};
const addMeta = (def, refs, jsonSchema2) => {
  if (def.description) {
    jsonSchema2.description = def.description;
    if (refs.markdownDescription) {
      jsonSchema2.markdownDescription = def.description;
    }
  }
  return jsonSchema2;
};
const zodToJsonSchema = (schema2, options) => {
  const refs = getRefs(options);
  const definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name15, schema3]) => ({
    ...acc,
    [name15]: parseDef(schema3._def, {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name15]
    }, true) ?? {}
  }), {}) : void 0;
  const name14 = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
  const main = parseDef(schema2._def, name14 === void 0 ? refs : {
    ...refs,
    currentPath: [...refs.basePath, refs.definitionPath, name14]
  }, false) ?? {};
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  const combined = name14 === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name14
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name14]: main
    }
  };
  if (refs.target === "jsonSchema7") {
    combined.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") {
    combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
  }
  if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) {
    console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
  }
  return combined;
};
var textStreamPart = {
  code: "0",
  name: "text",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"text" parts expect a string value.');
    }
    return { type: "text", value };
  }
};
var errorStreamPart = {
  code: "3",
  name: "error",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"error" parts expect a string value.');
    }
    return { type: "error", value };
  }
};
var assistantMessageStreamPart = {
  code: "4",
  name: "assistant_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("id" in value) || !("role" in value) || !("content" in value) || typeof value.id !== "string" || typeof value.role !== "string" || value.role !== "assistant" || !Array.isArray(value.content) || !value.content.every(
      (item) => item != null && typeof item === "object" && "type" in item && item.type === "text" && "text" in item && item.text != null && typeof item.text === "object" && "value" in item.text && typeof item.text.value === "string"
    )) {
      throw new Error(
        '"assistant_message" parts expect an object with an "id", "role", and "content" property.'
      );
    }
    return {
      type: "assistant_message",
      value
    };
  }
};
var assistantControlDataStreamPart = {
  code: "5",
  name: "assistant_control_data",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("threadId" in value) || !("messageId" in value) || typeof value.threadId !== "string" || typeof value.messageId !== "string") {
      throw new Error(
        '"assistant_control_data" parts expect an object with a "threadId" and "messageId" property.'
      );
    }
    return {
      type: "assistant_control_data",
      value: {
        threadId: value.threadId,
        messageId: value.messageId
      }
    };
  }
};
var dataMessageStreamPart = {
  code: "6",
  name: "data_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("role" in value) || !("data" in value) || typeof value.role !== "string" || value.role !== "data") {
      throw new Error(
        '"data_message" parts expect an object with a "role" and "data" property.'
      );
    }
    return {
      type: "data_message",
      value
    };
  }
};
var assistantStreamParts = [
  textStreamPart,
  errorStreamPart,
  assistantMessageStreamPart,
  assistantControlDataStreamPart,
  dataMessageStreamPart
];
({
  [textStreamPart.code]: textStreamPart,
  [errorStreamPart.code]: errorStreamPart,
  [assistantMessageStreamPart.code]: assistantMessageStreamPart,
  [assistantControlDataStreamPart.code]: assistantControlDataStreamPart,
  [dataMessageStreamPart.code]: dataMessageStreamPart
});
({
  [textStreamPart.name]: textStreamPart.code,
  [errorStreamPart.name]: errorStreamPart.code,
  [assistantMessageStreamPart.name]: assistantMessageStreamPart.code,
  [assistantControlDataStreamPart.name]: assistantControlDataStreamPart.code,
  [dataMessageStreamPart.name]: dataMessageStreamPart.code
});
assistantStreamParts.map((part) => part.code);
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        lastValidIndex = i;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}
function parsePartialJson(jsonText) {
  if (jsonText === void 0) {
    return { value: void 0, state: "undefined-input" };
  }
  let result = safeParseJSON({ text: jsonText });
  if (result.success) {
    return { value: result.value, state: "successful-parse" };
  }
  result = safeParseJSON({ text: fixJson(jsonText) });
  if (result.success) {
    return { value: result.value, state: "repaired-parse" };
  }
  return { value: void 0, state: "failed-parse" };
}
var textStreamPart2 = {
  code: "0",
  name: "text",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"text" parts expect a string value.');
    }
    return { type: "text", value };
  }
};
var dataStreamPart = {
  code: "2",
  name: "data",
  parse: (value) => {
    if (!Array.isArray(value)) {
      throw new Error('"data" parts expect an array value.');
    }
    return { type: "data", value };
  }
};
var errorStreamPart2 = {
  code: "3",
  name: "error",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"error" parts expect a string value.');
    }
    return { type: "error", value };
  }
};
var messageAnnotationsStreamPart = {
  code: "8",
  name: "message_annotations",
  parse: (value) => {
    if (!Array.isArray(value)) {
      throw new Error('"message_annotations" parts expect an array value.');
    }
    return { type: "message_annotations", value };
  }
};
var toolCallStreamPart = {
  code: "9",
  name: "tool_call",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("toolName" in value) || typeof value.toolName !== "string" || !("args" in value) || typeof value.args !== "object") {
      throw new Error(
        '"tool_call" parts expect an object with a "toolCallId", "toolName", and "args" property.'
      );
    }
    return {
      type: "tool_call",
      value
    };
  }
};
var toolResultStreamPart = {
  code: "a",
  name: "tool_result",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("result" in value)) {
      throw new Error(
        '"tool_result" parts expect an object with a "toolCallId" and a "result" property.'
      );
    }
    return {
      type: "tool_result",
      value
    };
  }
};
var toolCallStreamingStartStreamPart = {
  code: "b",
  name: "tool_call_streaming_start",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("toolName" in value) || typeof value.toolName !== "string") {
      throw new Error(
        '"tool_call_streaming_start" parts expect an object with a "toolCallId" and "toolName" property.'
      );
    }
    return {
      type: "tool_call_streaming_start",
      value
    };
  }
};
var toolCallDeltaStreamPart = {
  code: "c",
  name: "tool_call_delta",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("argsTextDelta" in value) || typeof value.argsTextDelta !== "string") {
      throw new Error(
        '"tool_call_delta" parts expect an object with a "toolCallId" and "argsTextDelta" property.'
      );
    }
    return {
      type: "tool_call_delta",
      value
    };
  }
};
var finishMessageStreamPart = {
  code: "d",
  name: "finish_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("finishReason" in value) || typeof value.finishReason !== "string") {
      throw new Error(
        '"finish_message" parts expect an object with a "finishReason" property.'
      );
    }
    const result = {
      finishReason: value.finishReason
    };
    if ("usage" in value && value.usage != null && typeof value.usage === "object" && "promptTokens" in value.usage && "completionTokens" in value.usage) {
      result.usage = {
        promptTokens: typeof value.usage.promptTokens === "number" ? value.usage.promptTokens : Number.NaN,
        completionTokens: typeof value.usage.completionTokens === "number" ? value.usage.completionTokens : Number.NaN
      };
    }
    return {
      type: "finish_message",
      value: result
    };
  }
};
var finishStepStreamPart = {
  code: "e",
  name: "finish_step",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("finishReason" in value) || typeof value.finishReason !== "string") {
      throw new Error(
        '"finish_step" parts expect an object with a "finishReason" property.'
      );
    }
    const result = {
      finishReason: value.finishReason,
      isContinued: false
    };
    if ("usage" in value && value.usage != null && typeof value.usage === "object" && "promptTokens" in value.usage && "completionTokens" in value.usage) {
      result.usage = {
        promptTokens: typeof value.usage.promptTokens === "number" ? value.usage.promptTokens : Number.NaN,
        completionTokens: typeof value.usage.completionTokens === "number" ? value.usage.completionTokens : Number.NaN
      };
    }
    if ("isContinued" in value && typeof value.isContinued === "boolean") {
      result.isContinued = value.isContinued;
    }
    return {
      type: "finish_step",
      value: result
    };
  }
};
var startStepStreamPart = {
  code: "f",
  name: "start_step",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("messageId" in value) || typeof value.messageId !== "string") {
      throw new Error(
        '"start_step" parts expect an object with an "id" property.'
      );
    }
    return {
      type: "start_step",
      value: {
        messageId: value.messageId
      }
    };
  }
};
var reasoningStreamPart = {
  code: "g",
  name: "reasoning",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"reasoning" parts expect a string value.');
    }
    return { type: "reasoning", value };
  }
};
var dataStreamParts = [
  textStreamPart2,
  dataStreamPart,
  errorStreamPart2,
  messageAnnotationsStreamPart,
  toolCallStreamPart,
  toolResultStreamPart,
  toolCallStreamingStartStreamPart,
  toolCallDeltaStreamPart,
  finishMessageStreamPart,
  finishStepStreamPart,
  startStepStreamPart,
  reasoningStreamPart
];
({
  [textStreamPart2.code]: textStreamPart2,
  [dataStreamPart.code]: dataStreamPart,
  [errorStreamPart2.code]: errorStreamPart2,
  [messageAnnotationsStreamPart.code]: messageAnnotationsStreamPart,
  [toolCallStreamPart.code]: toolCallStreamPart,
  [toolResultStreamPart.code]: toolResultStreamPart,
  [toolCallStreamingStartStreamPart.code]: toolCallStreamingStartStreamPart,
  [toolCallDeltaStreamPart.code]: toolCallDeltaStreamPart,
  [finishMessageStreamPart.code]: finishMessageStreamPart,
  [finishStepStreamPart.code]: finishStepStreamPart,
  [startStepStreamPart.code]: startStepStreamPart,
  [reasoningStreamPart.code]: reasoningStreamPart
});
({
  [textStreamPart2.name]: textStreamPart2.code,
  [dataStreamPart.name]: dataStreamPart.code,
  [errorStreamPart2.name]: errorStreamPart2.code,
  [messageAnnotationsStreamPart.name]: messageAnnotationsStreamPart.code,
  [toolCallStreamPart.name]: toolCallStreamPart.code,
  [toolResultStreamPart.name]: toolResultStreamPart.code,
  [toolCallStreamingStartStreamPart.name]: toolCallStreamingStartStreamPart.code,
  [toolCallDeltaStreamPart.name]: toolCallDeltaStreamPart.code,
  [finishMessageStreamPart.name]: finishMessageStreamPart.code,
  [finishStepStreamPart.name]: finishStepStreamPart.code,
  [startStepStreamPart.name]: startStepStreamPart.code,
  [reasoningStreamPart.name]: reasoningStreamPart.code
});
dataStreamParts.map((part) => part.code);
function formatDataStreamPart(type2, value) {
  const streamPart = dataStreamParts.find((part) => part.name === type2);
  if (!streamPart) {
    throw new Error(`Invalid stream part type: ${type2}`);
  }
  return `${streamPart.code}:${JSON.stringify(value)}
`;
}
function zodSchema(zodSchema2, options) {
  var _a16;
  const useReferences = (_a16 = void 0) != null ? _a16 : false;
  return jsonSchema(
    zodToJsonSchema(zodSchema2, {
      $refStrategy: useReferences ? "root" : "none",
      target: "jsonSchema7"
      // note: openai mode breaks various gemini conversions
    }),
    {
      validate: (value) => {
        const result = zodSchema2.safeParse(value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
var schemaSymbol = Symbol.for("vercel.ai.schema");
function jsonSchema(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol]: true,
    _type: void 0,
    // should never be used directly
    [validatorSymbol]: true,
    jsonSchema: jsonSchema2,
    validate
  };
}
function isSchema(value) {
  return typeof value === "object" && value !== null && schemaSymbol in value && value[schemaSymbol] === true && "jsonSchema" in value && "validate" in value;
}
function asSchema(schema2) {
  return isSchema(schema2) ? schema2 : zodSchema(schema2);
}
var _globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
var VERSION = "1.9.0";
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function _makeCompatibilityCheck(ownVersion) {
  var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
  var rejectedVersions = /* @__PURE__ */ new Set();
  var myVersionMatch = ownVersion.match(re);
  if (!myVersionMatch) {
    return function() {
      return false;
    };
  }
  var ownVersionParsed = {
    major: +myVersionMatch[1],
    minor: +myVersionMatch[2],
    patch: +myVersionMatch[3],
    prerelease: myVersionMatch[4]
  };
  if (ownVersionParsed.prerelease != null) {
    return function isExactmatch(globalVersion) {
      return globalVersion === ownVersion;
    };
  }
  function _reject(v) {
    rejectedVersions.add(v);
    return false;
  }
  function _accept(v) {
    acceptedVersions.add(v);
    return true;
  }
  return function isCompatible2(globalVersion) {
    if (acceptedVersions.has(globalVersion)) {
      return true;
    }
    if (rejectedVersions.has(globalVersion)) {
      return false;
    }
    var globalVersionMatch = globalVersion.match(re);
    if (!globalVersionMatch) {
      return _reject(globalVersion);
    }
    var globalVersionParsed = {
      major: +globalVersionMatch[1],
      minor: +globalVersionMatch[2],
      patch: +globalVersionMatch[3],
      prerelease: globalVersionMatch[4]
    };
    if (globalVersionParsed.prerelease != null) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major !== globalVersionParsed.major) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major === 0) {
      if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    }
    if (ownVersionParsed.minor <= globalVersionParsed.minor) {
      return _accept(globalVersion);
    }
    return _reject(globalVersion);
  };
}
var isCompatible = _makeCompatibilityCheck(VERSION);
var major = VERSION.split(".")[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = _globalThis;
function registerGlobal(type2, instance, diag, allowOverride) {
  var _a16;
  if (allowOverride === void 0) {
    allowOverride = false;
  }
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a16 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a16 !== void 0 ? _a16 : {
    version: VERSION
  };
  if (!allowOverride && api[type2]) {
    var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type2);
    diag.error(err.stack || err.message);
    return false;
  }
  if (api.version !== VERSION) {
    var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type2 + " does not match previously registered API v" + VERSION);
    diag.error(err.stack || err.message);
    return false;
  }
  api[type2] = instance;
  diag.debug("@opentelemetry/api: Registered a global for " + type2 + " v" + VERSION + ".");
  return true;
}
function getGlobal(type2) {
  var _a16, _b2;
  var globalVersion = (_a16 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a16 === void 0 ? void 0 : _a16.version;
  if (!globalVersion || !isCompatible(globalVersion)) {
    return;
  }
  return (_b2 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b2 === void 0 ? void 0 : _b2[type2];
}
function unregisterGlobal(type2, diag) {
  diag.debug("@opentelemetry/api: Unregistering a global for " + type2 + " v" + VERSION + ".");
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
  if (api) {
    delete api[type2];
  }
}
var __read$3 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$3 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var DiagComponentLogger = function() {
  function DiagComponentLogger2(props) {
    this._namespace = props.namespace || "DiagComponentLogger";
  }
  DiagComponentLogger2.prototype.debug = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return logProxy("debug", this._namespace, args);
  };
  DiagComponentLogger2.prototype.error = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return logProxy("error", this._namespace, args);
  };
  DiagComponentLogger2.prototype.info = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return logProxy("info", this._namespace, args);
  };
  DiagComponentLogger2.prototype.warn = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return logProxy("warn", this._namespace, args);
  };
  DiagComponentLogger2.prototype.verbose = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return logProxy("verbose", this._namespace, args);
  };
  return DiagComponentLogger2;
}();
function logProxy(funcName, namespace, args) {
  var logger = getGlobal("diag");
  if (!logger) {
    return;
  }
  args.unshift(namespace);
  return logger[funcName].apply(logger, __spreadArray$3([], __read$3(args), false));
}
var DiagLogLevel;
(function(DiagLogLevel2) {
  DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
  DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
  DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
  DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
  DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
  DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
  DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));
function createLogLevelDiagLogger(maxLevel, logger) {
  if (maxLevel < DiagLogLevel.NONE) {
    maxLevel = DiagLogLevel.NONE;
  } else if (maxLevel > DiagLogLevel.ALL) {
    maxLevel = DiagLogLevel.ALL;
  }
  logger = logger || {};
  function _filterFunc(funcName, theLevel) {
    var theFunc = logger[funcName];
    if (typeof theFunc === "function" && maxLevel >= theLevel) {
      return theFunc.bind(logger);
    }
    return function() {
    };
  }
  return {
    error: _filterFunc("error", DiagLogLevel.ERROR),
    warn: _filterFunc("warn", DiagLogLevel.WARN),
    info: _filterFunc("info", DiagLogLevel.INFO),
    debug: _filterFunc("debug", DiagLogLevel.DEBUG),
    verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
  };
}
var __read$2 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$2 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$2 = "diag";
var DiagAPI = function() {
  function DiagAPI2() {
    function _logProxy(funcName) {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var logger = getGlobal("diag");
        if (!logger)
          return;
        return logger[funcName].apply(logger, __spreadArray$2([], __read$2(args), false));
      };
    }
    var self2 = this;
    var setLogger = function(logger, optionsOrLogLevel) {
      var _a16, _b2, _c2;
      if (optionsOrLogLevel === void 0) {
        optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
      }
      if (logger === self2) {
        var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
        self2.error((_a16 = err.stack) !== null && _a16 !== void 0 ? _a16 : err.message);
        return false;
      }
      if (typeof optionsOrLogLevel === "number") {
        optionsOrLogLevel = {
          logLevel: optionsOrLogLevel
        };
      }
      var oldLogger = getGlobal("diag");
      var newLogger = createLogLevelDiagLogger((_b2 = optionsOrLogLevel.logLevel) !== null && _b2 !== void 0 ? _b2 : DiagLogLevel.INFO, logger);
      if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
        var stack = (_c2 = new Error().stack) !== null && _c2 !== void 0 ? _c2 : "<failed to generate stacktrace>";
        oldLogger.warn("Current logger will be overwritten from " + stack);
        newLogger.warn("Current logger will overwrite one already registered from " + stack);
      }
      return registerGlobal("diag", newLogger, self2, true);
    };
    self2.setLogger = setLogger;
    self2.disable = function() {
      unregisterGlobal(API_NAME$2, self2);
    };
    self2.createComponentLogger = function(options) {
      return new DiagComponentLogger(options);
    };
    self2.verbose = _logProxy("verbose");
    self2.debug = _logProxy("debug");
    self2.info = _logProxy("info");
    self2.warn = _logProxy("warn");
    self2.error = _logProxy("error");
  }
  DiagAPI2.instance = function() {
    if (!this._instance) {
      this._instance = new DiagAPI2();
    }
    return this._instance;
  };
  return DiagAPI2;
}();
function createContextKey(description) {
  return Symbol.for(description);
}
var BaseContext = /* @__PURE__ */ function() {
  function BaseContext2(parentContext) {
    var self2 = this;
    self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
    self2.getValue = function(key) {
      return self2._currentContext.get(key);
    };
    self2.setValue = function(key, value) {
      var context = new BaseContext2(self2._currentContext);
      context._currentContext.set(key, value);
      return context;
    };
    self2.deleteValue = function(key) {
      var context = new BaseContext2(self2._currentContext);
      context._currentContext.delete(key);
      return context;
    };
  }
  return BaseContext2;
}();
var ROOT_CONTEXT = new BaseContext();
var __read$1 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$1 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var NoopContextManager = function() {
  function NoopContextManager2() {
  }
  NoopContextManager2.prototype.active = function() {
    return ROOT_CONTEXT;
  };
  NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
      args[_i - 3] = arguments[_i];
    }
    return fn.call.apply(fn, __spreadArray$1([thisArg], __read$1(args), false));
  };
  NoopContextManager2.prototype.bind = function(_context, target) {
    return target;
  };
  NoopContextManager2.prototype.enable = function() {
    return this;
  };
  NoopContextManager2.prototype.disable = function() {
    return this;
  };
  return NoopContextManager2;
}();
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$1 = "context";
var NOOP_CONTEXT_MANAGER = new NoopContextManager();
var ContextAPI = function() {
  function ContextAPI2() {
  }
  ContextAPI2.getInstance = function() {
    if (!this._instance) {
      this._instance = new ContextAPI2();
    }
    return this._instance;
  };
  ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
    return registerGlobal(API_NAME$1, contextManager, DiagAPI.instance());
  };
  ContextAPI2.prototype.active = function() {
    return this._getContextManager().active();
  };
  ContextAPI2.prototype.with = function(context, fn, thisArg) {
    var _a16;
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
      args[_i - 3] = arguments[_i];
    }
    return (_a16 = this._getContextManager()).with.apply(_a16, __spreadArray([context, fn, thisArg], __read(args), false));
  };
  ContextAPI2.prototype.bind = function(context, target) {
    return this._getContextManager().bind(context, target);
  };
  ContextAPI2.prototype._getContextManager = function() {
    return getGlobal(API_NAME$1) || NOOP_CONTEXT_MANAGER;
  };
  ContextAPI2.prototype.disable = function() {
    this._getContextManager().disable();
    unregisterGlobal(API_NAME$1, DiagAPI.instance());
  };
  return ContextAPI2;
}();
var TraceFlags;
(function(TraceFlags2) {
  TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
  TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));
var INVALID_SPANID = "0000000000000000";
var INVALID_TRACEID = "00000000000000000000000000000000";
var INVALID_SPAN_CONTEXT = {
  traceId: INVALID_TRACEID,
  spanId: INVALID_SPANID,
  traceFlags: TraceFlags.NONE
};
var NonRecordingSpan = function() {
  function NonRecordingSpan2(_spanContext) {
    if (_spanContext === void 0) {
      _spanContext = INVALID_SPAN_CONTEXT;
    }
    this._spanContext = _spanContext;
  }
  NonRecordingSpan2.prototype.spanContext = function() {
    return this._spanContext;
  };
  NonRecordingSpan2.prototype.setAttribute = function(_key, _value) {
    return this;
  };
  NonRecordingSpan2.prototype.setAttributes = function(_attributes) {
    return this;
  };
  NonRecordingSpan2.prototype.addEvent = function(_name, _attributes) {
    return this;
  };
  NonRecordingSpan2.prototype.addLink = function(_link) {
    return this;
  };
  NonRecordingSpan2.prototype.addLinks = function(_links) {
    return this;
  };
  NonRecordingSpan2.prototype.setStatus = function(_status) {
    return this;
  };
  NonRecordingSpan2.prototype.updateName = function(_name) {
    return this;
  };
  NonRecordingSpan2.prototype.end = function(_endTime) {
  };
  NonRecordingSpan2.prototype.isRecording = function() {
    return false;
  };
  NonRecordingSpan2.prototype.recordException = function(_exception, _time) {
  };
  return NonRecordingSpan2;
}();
var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
function getSpan(context) {
  return context.getValue(SPAN_KEY) || void 0;
}
function getActiveSpan() {
  return getSpan(ContextAPI.getInstance().active());
}
function setSpan(context, span) {
  return context.setValue(SPAN_KEY, span);
}
function deleteSpan(context) {
  return context.deleteValue(SPAN_KEY);
}
function setSpanContext(context, spanContext) {
  return setSpan(context, new NonRecordingSpan(spanContext));
}
function getSpanContext(context) {
  var _a16;
  return (_a16 = getSpan(context)) === null || _a16 === void 0 ? void 0 : _a16.spanContext();
}
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
  return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
  return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
function isSpanContextValid(spanContext) {
  return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
function wrapSpanContext(spanContext) {
  return new NonRecordingSpan(spanContext);
}
var contextApi = ContextAPI.getInstance();
var NoopTracer = function() {
  function NoopTracer2() {
  }
  NoopTracer2.prototype.startSpan = function(name14, options, context) {
    if (context === void 0) {
      context = contextApi.active();
    }
    var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
    if (root) {
      return new NonRecordingSpan();
    }
    var parentFromContext = context && getSpanContext(context);
    if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
      return new NonRecordingSpan(parentFromContext);
    } else {
      return new NonRecordingSpan();
    }
  };
  NoopTracer2.prototype.startActiveSpan = function(name14, arg2, arg3, arg4) {
    var opts;
    var ctx;
    var fn;
    if (arguments.length < 2) {
      return;
    } else if (arguments.length === 2) {
      fn = arg2;
    } else if (arguments.length === 3) {
      opts = arg2;
      fn = arg3;
    } else {
      opts = arg2;
      ctx = arg3;
      fn = arg4;
    }
    var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
    var span = this.startSpan(name14, opts, parentContext);
    var contextWithSpanSet = setSpan(parentContext, span);
    return contextApi.with(contextWithSpanSet, fn, void 0, span);
  };
  return NoopTracer2;
}();
function isSpanContext(spanContext) {
  return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}
var NOOP_TRACER = new NoopTracer();
var ProxyTracer = function() {
  function ProxyTracer2(_provider, name14, version2, options) {
    this._provider = _provider;
    this.name = name14;
    this.version = version2;
    this.options = options;
  }
  ProxyTracer2.prototype.startSpan = function(name14, options, context) {
    return this._getTracer().startSpan(name14, options, context);
  };
  ProxyTracer2.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
    var tracer = this._getTracer();
    return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
  };
  ProxyTracer2.prototype._getTracer = function() {
    if (this._delegate) {
      return this._delegate;
    }
    var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
    if (!tracer) {
      return NOOP_TRACER;
    }
    this._delegate = tracer;
    return this._delegate;
  };
  return ProxyTracer2;
}();
var NoopTracerProvider = function() {
  function NoopTracerProvider2() {
  }
  NoopTracerProvider2.prototype.getTracer = function(_name, _version, _options) {
    return new NoopTracer();
  };
  return NoopTracerProvider2;
}();
var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
var ProxyTracerProvider = function() {
  function ProxyTracerProvider2() {
  }
  ProxyTracerProvider2.prototype.getTracer = function(name14, version2, options) {
    var _a16;
    return (_a16 = this.getDelegateTracer(name14, version2, options)) !== null && _a16 !== void 0 ? _a16 : new ProxyTracer(this, name14, version2, options);
  };
  ProxyTracerProvider2.prototype.getDelegate = function() {
    var _a16;
    return (_a16 = this._delegate) !== null && _a16 !== void 0 ? _a16 : NOOP_TRACER_PROVIDER;
  };
  ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
    this._delegate = delegate;
  };
  ProxyTracerProvider2.prototype.getDelegateTracer = function(name14, version2, options) {
    var _a16;
    return (_a16 = this._delegate) === null || _a16 === void 0 ? void 0 : _a16.getTracer(name14, version2, options);
  };
  return ProxyTracerProvider2;
}();
var SpanStatusCode;
(function(SpanStatusCode2) {
  SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
  SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
  SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
})(SpanStatusCode || (SpanStatusCode = {}));
var API_NAME = "trace";
var TraceAPI = function() {
  function TraceAPI2() {
    this._proxyTracerProvider = new ProxyTracerProvider();
    this.wrapSpanContext = wrapSpanContext;
    this.isSpanContextValid = isSpanContextValid;
    this.deleteSpan = deleteSpan;
    this.getSpan = getSpan;
    this.getActiveSpan = getActiveSpan;
    this.getSpanContext = getSpanContext;
    this.setSpan = setSpan;
    this.setSpanContext = setSpanContext;
  }
  TraceAPI2.getInstance = function() {
    if (!this._instance) {
      this._instance = new TraceAPI2();
    }
    return this._instance;
  };
  TraceAPI2.prototype.setGlobalTracerProvider = function(provider) {
    var success = registerGlobal(API_NAME, this._proxyTracerProvider, DiagAPI.instance());
    if (success) {
      this._proxyTracerProvider.setDelegate(provider);
    }
    return success;
  };
  TraceAPI2.prototype.getTracerProvider = function() {
    return getGlobal(API_NAME) || this._proxyTracerProvider;
  };
  TraceAPI2.prototype.getTracer = function(name14, version2) {
    return this.getTracerProvider().getTracer(name14, version2);
  };
  TraceAPI2.prototype.disable = function() {
    unregisterGlobal(API_NAME, DiagAPI.instance());
    this._proxyTracerProvider = new ProxyTracerProvider();
  };
  return TraceAPI2;
}();
var trace = TraceAPI.getInstance();
var __defProp$1 = Object.defineProperty;
var __export = (target, all) => {
  for (var name15 in all)
    __defProp$1(target, name15, { get: all[name15], enumerable: true });
};
function prepareResponseHeaders(headers, {
  contentType,
  dataStreamVersion
}) {
  const responseHeaders = new Headers(headers != null ? headers : {});
  if (!responseHeaders.has("Content-Type")) {
    responseHeaders.set("Content-Type", contentType);
  }
  if (dataStreamVersion !== void 0) {
    responseHeaders.set("X-Vercel-AI-Data-Stream", dataStreamVersion);
  }
  return responseHeaders;
}
function prepareOutgoingHttpHeaders(headers, {
  contentType,
  dataStreamVersion
}) {
  const outgoingHeaders = {};
  if (headers != null) {
    for (const [key, value] of Object.entries(headers)) {
      outgoingHeaders[key] = value;
    }
  }
  if (outgoingHeaders["Content-Type"] == null) {
    outgoingHeaders["Content-Type"] = contentType;
  }
  if (dataStreamVersion !== void 0) {
    outgoingHeaders["X-Vercel-AI-Data-Stream"] = dataStreamVersion;
  }
  return outgoingHeaders;
}
function writeToServerResponse({
  response,
  status,
  statusText,
  headers,
  stream
}) {
  response.writeHead(status != null ? status : 200, statusText, headers);
  const reader = stream.getReader();
  const read = async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        response.write(value);
      }
    } catch (error) {
      throw error;
    } finally {
      response.end();
    }
  };
  read();
}
var name = "AI_InvalidArgumentError";
var marker = `vercel.ai.error.${name}`;
var symbol = Symbol.for(marker);
var _a;
var InvalidArgumentError2 = class extends AISDKError {
  constructor({
    parameter,
    value,
    message
  }) {
    super({
      name,
      message: `Invalid argument for parameter ${parameter}: ${message}`
    });
    this[_a] = true;
    this.parameter = parameter;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker);
  }
};
_a = symbol;
var name2 = "AI_RetryError";
var marker2 = `vercel.ai.error.${name2}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var RetryError = class extends AISDKError {
  constructor({
    message,
    reason,
    errors
  }) {
    super({ name: name2, message });
    this[_a2] = true;
    this.reason = reason;
    this.errors = errors;
    this.lastError = errors[errors.length - 1];
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2);
  }
};
_a2 = symbol2;
var retryWithExponentialBackoff = ({
  maxRetries = 2,
  initialDelayInMs = 2e3,
  backoffFactor = 2
} = {}) => async (f) => _retryWithExponentialBackoff(f, {
  maxRetries,
  delayInMs: initialDelayInMs,
  backoffFactor
});
async function _retryWithExponentialBackoff(f, {
  maxRetries,
  delayInMs,
  backoffFactor
}, errors = []) {
  try {
    return await f();
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    if (maxRetries === 0) {
      throw error;
    }
    const errorMessage = getErrorMessage(error);
    const newErrors = [...errors, error];
    const tryNumber = newErrors.length;
    if (tryNumber > maxRetries) {
      throw new RetryError({
        message: `Failed after ${tryNumber} attempts. Last error: ${errorMessage}`,
        reason: "maxRetriesExceeded",
        errors: newErrors
      });
    }
    if (error instanceof Error && APICallError.isInstance(error) && error.isRetryable === true && tryNumber <= maxRetries) {
      await delay(delayInMs);
      return _retryWithExponentialBackoff(
        f,
        { maxRetries, delayInMs: backoffFactor * delayInMs, backoffFactor },
        newErrors
      );
    }
    if (tryNumber === 1) {
      throw error;
    }
    throw new RetryError({
      message: `Failed after ${tryNumber} attempts with non-retryable error: '${errorMessage}'`,
      reason: "errorNotRetryable",
      errors: newErrors
    });
  }
}
function prepareRetries({
  maxRetries
}) {
  if (maxRetries != null) {
    if (!Number.isInteger(maxRetries)) {
      throw new InvalidArgumentError2({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be an integer"
      });
    }
    if (maxRetries < 0) {
      throw new InvalidArgumentError2({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be >= 0"
      });
    }
  }
  const maxRetriesResult = maxRetries != null ? maxRetries : 2;
  return {
    maxRetries: maxRetriesResult,
    retry: retryWithExponentialBackoff({ maxRetries: maxRetriesResult })
  };
}
function assembleOperationName({
  operationId,
  telemetry
}) {
  return {
    // standardized operation and resource name:
    "operation.name": `${operationId}${(telemetry == null ? void 0 : telemetry.functionId) != null ? ` ${telemetry.functionId}` : ""}`,
    "resource.name": telemetry == null ? void 0 : telemetry.functionId,
    // detailed, AI SDK specific data:
    "ai.operationId": operationId,
    "ai.telemetry.functionId": telemetry == null ? void 0 : telemetry.functionId
  };
}
function getBaseTelemetryAttributes({
  model,
  settings,
  telemetry,
  headers
}) {
  var _a152;
  return {
    "ai.model.provider": model.provider,
    "ai.model.id": model.modelId,
    // settings:
    ...Object.entries(settings).reduce((attributes, [key, value]) => {
      attributes[`ai.settings.${key}`] = value;
      return attributes;
    }, {}),
    // add metadata as attributes:
    ...Object.entries((_a152 = telemetry == null ? void 0 : telemetry.metadata) != null ? _a152 : {}).reduce(
      (attributes, [key, value]) => {
        attributes[`ai.telemetry.metadata.${key}`] = value;
        return attributes;
      },
      {}
    ),
    // request headers
    ...Object.entries(headers != null ? headers : {}).reduce((attributes, [key, value]) => {
      if (value !== void 0) {
        attributes[`ai.request.headers.${key}`] = value;
      }
      return attributes;
    }, {})
  };
}
var noopTracer = {
  startSpan() {
    return noopSpan;
  },
  startActiveSpan(name15, arg1, arg2, arg3) {
    if (typeof arg1 === "function") {
      return arg1(noopSpan);
    }
    if (typeof arg2 === "function") {
      return arg2(noopSpan);
    }
    if (typeof arg3 === "function") {
      return arg3(noopSpan);
    }
  }
};
var noopSpan = {
  spanContext() {
    return noopSpanContext;
  },
  setAttribute() {
    return this;
  },
  setAttributes() {
    return this;
  },
  addEvent() {
    return this;
  },
  addLink() {
    return this;
  },
  addLinks() {
    return this;
  },
  setStatus() {
    return this;
  },
  updateName() {
    return this;
  },
  end() {
    return this;
  },
  isRecording() {
    return false;
  },
  recordException() {
    return this;
  }
};
var noopSpanContext = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};
function getTracer({
  isEnabled = false,
  tracer
} = {}) {
  if (!isEnabled) {
    return noopTracer;
  }
  if (tracer) {
    return tracer;
  }
  return trace.getTracer("ai");
}
function recordSpan({
  name: name15,
  tracer,
  attributes,
  fn,
  endWhenDone = true
}) {
  return tracer.startActiveSpan(name15, { attributes }, async (span) => {
    try {
      const result = await fn(span);
      if (endWhenDone) {
        span.end();
      }
      return result;
    } catch (error) {
      try {
        if (error instanceof Error) {
          span.recordException({
            name: error.name,
            message: error.message,
            stack: error.stack
          });
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message
          });
        } else {
          span.setStatus({ code: SpanStatusCode.ERROR });
        }
      } finally {
        span.end();
      }
      throw error;
    }
  });
}
function selectTelemetryAttributes({
  telemetry,
  attributes
}) {
  if ((telemetry == null ? void 0 : telemetry.isEnabled) !== true) {
    return {};
  }
  return Object.entries(attributes).reduce((attributes2, [key, value]) => {
    if (value === void 0) {
      return attributes2;
    }
    if (typeof value === "object" && "input" in value && typeof value.input === "function") {
      if ((telemetry == null ? void 0 : telemetry.recordInputs) === false) {
        return attributes2;
      }
      const result = value.input();
      return result === void 0 ? attributes2 : { ...attributes2, [key]: result };
    }
    if (typeof value === "object" && "output" in value && typeof value.output === "function") {
      if ((telemetry == null ? void 0 : telemetry.recordOutputs) === false) {
        return attributes2;
      }
      const result = value.output();
      return result === void 0 ? attributes2 : { ...attributes2, [key]: result };
    }
    return { ...attributes2, [key]: value };
  }, {});
}
function splitArray(array, chunkSize) {
  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
async function embedMany({
  model,
  values,
  maxRetries: maxRetriesArg,
  abortSignal,
  headers,
  experimental_telemetry: telemetry
}) {
  const { maxRetries, retry } = prepareRetries({ maxRetries: maxRetriesArg });
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { maxRetries }
  });
  const tracer = getTracer(telemetry);
  return recordSpan({
    name: "ai.embedMany",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({ operationId: "ai.embedMany", telemetry }),
        ...baseTelemetryAttributes,
        // specific settings that only make sense on the outer level:
        "ai.values": {
          input: () => values.map((value) => JSON.stringify(value))
        }
      }
    }),
    tracer,
    fn: async (span) => {
      const maxEmbeddingsPerCall = model.maxEmbeddingsPerCall;
      if (maxEmbeddingsPerCall == null) {
        const { embeddings: embeddings2, usage } = await retry(() => {
          return recordSpan({
            name: "ai.embedMany.doEmbed",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.embedMany.doEmbed",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                // specific settings that only make sense on the outer level:
                "ai.values": {
                  input: () => values.map((value) => JSON.stringify(value))
                }
              }
            }),
            tracer,
            fn: async (doEmbedSpan) => {
              var _a152;
              const modelResponse = await model.doEmbed({
                values,
                abortSignal,
                headers
              });
              const embeddings3 = modelResponse.embeddings;
              const usage2 = (_a152 = modelResponse.usage) != null ? _a152 : { tokens: NaN };
              doEmbedSpan.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.embeddings": {
                      output: () => embeddings3.map((embedding) => JSON.stringify(embedding))
                    },
                    "ai.usage.tokens": usage2.tokens
                  }
                })
              );
              return { embeddings: embeddings3, usage: usage2 };
            }
          });
        });
        span.setAttributes(
          selectTelemetryAttributes({
            telemetry,
            attributes: {
              "ai.embeddings": {
                output: () => embeddings2.map((embedding) => JSON.stringify(embedding))
              },
              "ai.usage.tokens": usage.tokens
            }
          })
        );
        return new DefaultEmbedManyResult({ values, embeddings: embeddings2, usage });
      }
      const valueChunks = splitArray(values, maxEmbeddingsPerCall);
      const embeddings = [];
      let tokens = 0;
      for (const chunk of valueChunks) {
        const { embeddings: responseEmbeddings, usage } = await retry(() => {
          return recordSpan({
            name: "ai.embedMany.doEmbed",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.embedMany.doEmbed",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                // specific settings that only make sense on the outer level:
                "ai.values": {
                  input: () => chunk.map((value) => JSON.stringify(value))
                }
              }
            }),
            tracer,
            fn: async (doEmbedSpan) => {
              var _a152;
              const modelResponse = await model.doEmbed({
                values: chunk,
                abortSignal,
                headers
              });
              const embeddings2 = modelResponse.embeddings;
              const usage2 = (_a152 = modelResponse.usage) != null ? _a152 : { tokens: NaN };
              doEmbedSpan.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.embeddings": {
                      output: () => embeddings2.map((embedding) => JSON.stringify(embedding))
                    },
                    "ai.usage.tokens": usage2.tokens
                  }
                })
              );
              return { embeddings: embeddings2, usage: usage2 };
            }
          });
        });
        embeddings.push(...responseEmbeddings);
        tokens += usage.tokens;
      }
      span.setAttributes(
        selectTelemetryAttributes({
          telemetry,
          attributes: {
            "ai.embeddings": {
              output: () => embeddings.map((embedding) => JSON.stringify(embedding))
            },
            "ai.usage.tokens": tokens
          }
        })
      );
      return new DefaultEmbedManyResult({
        values,
        embeddings,
        usage: { tokens }
      });
    }
  });
}
var DefaultEmbedManyResult = class {
  constructor(options) {
    this.values = options.values;
    this.embeddings = options.embeddings;
    this.usage = options.usage;
  }
};
var name3 = "AI_NoImageGeneratedError";
var marker3 = `vercel.ai.error.${name3}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var NoImageGeneratedError = class extends AISDKError {
  constructor({
    message = "No image generated.",
    cause,
    responses
  }) {
    super({ name: name3, message, cause });
    this[_a3] = true;
    this.responses = responses;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3);
  }
};
_a3 = symbol3;
async function generateImage({
  model,
  prompt: prompt2,
  n = 1,
  size,
  aspectRatio,
  seed,
  providerOptions,
  maxRetries: maxRetriesArg,
  abortSignal,
  headers,
  _internal = {
    currentDate: () => /* @__PURE__ */ new Date()
  }
}) {
  var _a152;
  const { retry } = prepareRetries({ maxRetries: maxRetriesArg });
  const maxImagesPerCall = (_a152 = model.maxImagesPerCall) != null ? _a152 : 1;
  const callCount = Math.ceil(n / maxImagesPerCall);
  const callImageCounts = Array.from({ length: callCount }, (_, i) => {
    if (i < callCount - 1) {
      return maxImagesPerCall;
    }
    const remainder = n % maxImagesPerCall;
    return remainder === 0 ? maxImagesPerCall : remainder;
  });
  const results = await Promise.all(
    callImageCounts.map(
      async (callImageCount) => retry(
        () => model.doGenerate({
          prompt: prompt2,
          n: callImageCount,
          abortSignal,
          headers,
          size,
          aspectRatio,
          seed,
          providerOptions: providerOptions != null ? providerOptions : {}
        })
      )
    )
  );
  const images = [];
  const warnings = [];
  const responses = [];
  for (const result of results) {
    images.push(
      ...result.images.map((image) => new DefaultGeneratedImage({ image }))
    );
    warnings.push(...result.warnings);
    responses.push(result.response);
  }
  if (!images.length) {
    throw new NoImageGeneratedError({ responses });
  }
  return new DefaultGenerateImageResult({ images, warnings, responses });
}
var DefaultGenerateImageResult = class {
  constructor(options) {
    this.images = options.images;
    this.warnings = options.warnings;
    this.responses = options.responses;
  }
  get image() {
    return this.images[0];
  }
};
var DefaultGeneratedImage = class {
  constructor({ image }) {
    const isUint8Array = image instanceof Uint8Array;
    this.base64Data = isUint8Array ? void 0 : image;
    this.uint8ArrayData = isUint8Array ? image : void 0;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get base64() {
    if (this.base64Data == null) {
      this.base64Data = convertUint8ArrayToBase64(this.uint8ArrayData);
    }
    return this.base64Data;
  }
  // lazy conversion with caching to avoid unnecessary conversion overhead:
  get uint8Array() {
    if (this.uint8ArrayData == null) {
      this.uint8ArrayData = convertBase64ToUint8Array(this.base64Data);
    }
    return this.uint8ArrayData;
  }
};
var name4 = "AI_NoObjectGeneratedError";
var marker4 = `vercel.ai.error.${name4}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var NoObjectGeneratedError = class extends AISDKError {
  constructor({
    message = "No object generated.",
    cause,
    text: text2,
    response,
    usage
  }) {
    super({ name: name4, message, cause });
    this[_a4] = true;
    this.text = text2;
    this.response = response;
    this.usage = usage;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4);
  }
};
_a4 = symbol4;
var name5 = "AI_DownloadError";
var marker5 = `vercel.ai.error.${name5}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var DownloadError = class extends AISDKError {
  constructor({
    url,
    statusCode,
    statusText,
    cause,
    message = cause == null ? `Failed to download ${url}: ${statusCode} ${statusText}` : `Failed to download ${url}: ${cause}`
  }) {
    super({ name: name5, message, cause });
    this[_a5] = true;
    this.url = url;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5);
  }
};
_a5 = symbol5;
async function download({
  url,
  fetchImplementation = fetch
}) {
  var _a152;
  const urlText = url.toString();
  try {
    const response = await fetchImplementation(urlText);
    if (!response.ok) {
      throw new DownloadError({
        url: urlText,
        statusCode: response.status,
        statusText: response.statusText
      });
    }
    return {
      data: new Uint8Array(await response.arrayBuffer()),
      mimeType: (_a152 = response.headers.get("content-type")) != null ? _a152 : void 0
    };
  } catch (error) {
    if (DownloadError.isInstance(error)) {
      throw error;
    }
    throw new DownloadError({ url: urlText, cause: error });
  }
}
var mimeTypeSignatures = [
  { mimeType: "image/gif", bytes: [71, 73, 70] },
  { mimeType: "image/png", bytes: [137, 80, 78, 71] },
  { mimeType: "image/jpeg", bytes: [255, 216] },
  { mimeType: "image/webp", bytes: [82, 73, 70, 70] }
];
function detectImageMimeType(image) {
  for (const { bytes, mimeType } of mimeTypeSignatures) {
    if (image.length >= bytes.length && bytes.every((byte, index2) => image[index2] === byte)) {
      return mimeType;
    }
  }
  return void 0;
}
var name6 = "AI_InvalidDataContentError";
var marker6 = `vercel.ai.error.${name6}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var InvalidDataContentError = class extends AISDKError {
  constructor({
    content,
    cause,
    message = `Invalid data content. Expected a base64 string, Uint8Array, ArrayBuffer, or Buffer, but got ${typeof content}.`
  }) {
    super({ name: name6, message, cause });
    this[_a6] = true;
    this.content = content;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6);
  }
};
_a6 = symbol6;
var dataContentSchema = z.union([
  z.string(),
  z.instanceof(Uint8Array),
  z.instanceof(ArrayBuffer),
  z.custom(
    // Buffer might not be available in some environments such as CloudFlare:
    (value) => {
      var _a152, _b2;
      return (_b2 = (_a152 = globalThis.Buffer) == null ? void 0 : _a152.isBuffer(value)) != null ? _b2 : false;
    },
    { message: "Must be a Buffer" }
  )
]);
function convertDataContentToBase64String(content) {
  if (typeof content === "string") {
    return content;
  }
  if (content instanceof ArrayBuffer) {
    return convertUint8ArrayToBase64(new Uint8Array(content));
  }
  return convertUint8ArrayToBase64(content);
}
function convertDataContentToUint8Array(content) {
  if (content instanceof Uint8Array) {
    return content;
  }
  if (typeof content === "string") {
    try {
      return convertBase64ToUint8Array(content);
    } catch (error) {
      throw new InvalidDataContentError({
        message: "Invalid data content. Content string is not a base64-encoded media.",
        content,
        cause: error
      });
    }
  }
  if (content instanceof ArrayBuffer) {
    return new Uint8Array(content);
  }
  throw new InvalidDataContentError({ content });
}
function convertUint8ArrayToText(uint8Array) {
  try {
    return new TextDecoder().decode(uint8Array);
  } catch (error) {
    throw new Error("Error decoding Uint8Array to text");
  }
}
var name7 = "AI_InvalidMessageRoleError";
var marker7 = `vercel.ai.error.${name7}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var InvalidMessageRoleError = class extends AISDKError {
  constructor({
    role,
    message = `Invalid message role: '${role}'. Must be one of: "system", "user", "assistant", "tool".`
  }) {
    super({ name: name7, message });
    this[_a7] = true;
    this.role = role;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
};
_a7 = symbol7;
function splitDataUrl(dataUrl) {
  try {
    const [header, base64Content] = dataUrl.split(",");
    return {
      mimeType: header.split(";")[0].split(":")[1],
      base64Content
    };
  } catch (error) {
    return {
      mimeType: void 0,
      base64Content: void 0
    };
  }
}
async function convertToLanguageModelPrompt({
  prompt: prompt2,
  modelSupportsImageUrls = true,
  modelSupportsUrl = () => false,
  downloadImplementation = download
}) {
  const downloadedAssets = await downloadAssets(
    prompt2.messages,
    downloadImplementation,
    modelSupportsImageUrls,
    modelSupportsUrl
  );
  return [
    ...prompt2.system != null ? [{ role: "system", content: prompt2.system }] : [],
    ...prompt2.messages.map(
      (message) => convertToLanguageModelMessage(message, downloadedAssets)
    )
  ];
}
function convertToLanguageModelMessage(message, downloadedAssets) {
  var _a152, _b2, _c2, _d2, _e2, _f2;
  const role = message.role;
  switch (role) {
    case "system": {
      return {
        role: "system",
        content: message.content,
        providerMetadata: (_a152 = message.providerOptions) != null ? _a152 : message.experimental_providerMetadata
      };
    }
    case "user": {
      if (typeof message.content === "string") {
        return {
          role: "user",
          content: [{ type: "text", text: message.content }],
          providerMetadata: (_b2 = message.providerOptions) != null ? _b2 : message.experimental_providerMetadata
        };
      }
      return {
        role: "user",
        content: message.content.map((part) => convertPartToLanguageModelPart(part, downloadedAssets)).filter((part) => part.type !== "text" || part.text !== ""),
        providerMetadata: (_c2 = message.providerOptions) != null ? _c2 : message.experimental_providerMetadata
      };
    }
    case "assistant": {
      if (typeof message.content === "string") {
        return {
          role: "assistant",
          content: [{ type: "text", text: message.content }],
          providerMetadata: (_d2 = message.providerOptions) != null ? _d2 : message.experimental_providerMetadata
        };
      }
      return {
        role: "assistant",
        content: message.content.filter(
          // remove empty text parts:
          (part) => part.type !== "text" || part.text !== ""
        ).map((part) => {
          const { experimental_providerMetadata, providerOptions, ...rest } = part;
          return {
            ...rest,
            providerMetadata: providerOptions != null ? providerOptions : experimental_providerMetadata
          };
        }),
        providerMetadata: (_e2 = message.providerOptions) != null ? _e2 : message.experimental_providerMetadata
      };
    }
    case "tool": {
      return {
        role: "tool",
        content: message.content.map((part) => {
          var _a16;
          return {
            type: "tool-result",
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            result: part.result,
            content: part.experimental_content,
            isError: part.isError,
            providerMetadata: (_a16 = part.providerOptions) != null ? _a16 : part.experimental_providerMetadata
          };
        }),
        providerMetadata: (_f2 = message.providerOptions) != null ? _f2 : message.experimental_providerMetadata
      };
    }
    default: {
      const _exhaustiveCheck = role;
      throw new InvalidMessageRoleError({ role: _exhaustiveCheck });
    }
  }
}
async function downloadAssets(messages, downloadImplementation, modelSupportsImageUrls, modelSupportsUrl) {
  const urls = messages.filter((message) => message.role === "user").map((message) => message.content).filter(
    (content) => Array.isArray(content)
  ).flat().filter(
    (part) => part.type === "image" || part.type === "file"
  ).filter(
    (part) => !(part.type === "image" && modelSupportsImageUrls === true)
  ).map((part) => part.type === "image" ? part.image : part.data).map(
    (part) => (
      // support string urls:
      typeof part === "string" && (part.startsWith("http:") || part.startsWith("https:")) ? new URL(part) : part
    )
  ).filter((image) => image instanceof URL).filter((url) => !modelSupportsUrl(url));
  const downloadedImages = await Promise.all(
    urls.map(async (url) => ({
      url,
      data: await downloadImplementation({ url })
    }))
  );
  return Object.fromEntries(
    downloadedImages.map(({ url, data }) => [url.toString(), data])
  );
}
function convertPartToLanguageModelPart(part, downloadedAssets) {
  var _a152;
  if (part.type === "text") {
    return {
      type: "text",
      text: part.text,
      providerMetadata: part.experimental_providerMetadata
    };
  }
  let mimeType = part.mimeType;
  let data;
  let content;
  let normalizedData;
  const type2 = part.type;
  switch (type2) {
    case "image":
      data = part.image;
      break;
    case "file":
      data = part.data;
      break;
    default:
      throw new Error(`Unsupported part type: ${type2}`);
  }
  try {
    content = typeof data === "string" ? new URL(data) : data;
  } catch (error) {
    content = data;
  }
  if (content instanceof URL) {
    if (content.protocol === "data:") {
      const { mimeType: dataUrlMimeType, base64Content } = splitDataUrl(
        content.toString()
      );
      if (dataUrlMimeType == null || base64Content == null) {
        throw new Error(`Invalid data URL format in part ${type2}`);
      }
      mimeType = dataUrlMimeType;
      normalizedData = convertDataContentToUint8Array(base64Content);
    } else {
      const downloadedFile = downloadedAssets[content.toString()];
      if (downloadedFile) {
        normalizedData = downloadedFile.data;
        mimeType != null ? mimeType : mimeType = downloadedFile.mimeType;
      } else {
        normalizedData = content;
      }
    }
  } else {
    normalizedData = convertDataContentToUint8Array(content);
  }
  switch (type2) {
    case "image": {
      if (normalizedData instanceof Uint8Array) {
        mimeType = (_a152 = detectImageMimeType(normalizedData)) != null ? _a152 : mimeType;
      }
      return {
        type: "image",
        image: normalizedData,
        mimeType,
        providerMetadata: part.experimental_providerMetadata
      };
    }
    case "file": {
      if (mimeType == null) {
        throw new Error(`Mime type is missing for file part`);
      }
      return {
        type: "file",
        data: normalizedData instanceof Uint8Array ? convertDataContentToBase64String(normalizedData) : normalizedData,
        mimeType,
        providerMetadata: part.experimental_providerMetadata
      };
    }
  }
}
function prepareCallSettings({
  maxTokens,
  temperature,
  topP,
  topK,
  presencePenalty,
  frequencyPenalty,
  stopSequences,
  seed
}) {
  if (maxTokens != null) {
    if (!Number.isInteger(maxTokens)) {
      throw new InvalidArgumentError2({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be an integer"
      });
    }
    if (maxTokens < 1) {
      throw new InvalidArgumentError2({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be >= 1"
      });
    }
  }
  if (temperature != null) {
    if (typeof temperature !== "number") {
      throw new InvalidArgumentError2({
        parameter: "temperature",
        value: temperature,
        message: "temperature must be a number"
      });
    }
  }
  if (topP != null) {
    if (typeof topP !== "number") {
      throw new InvalidArgumentError2({
        parameter: "topP",
        value: topP,
        message: "topP must be a number"
      });
    }
  }
  if (topK != null) {
    if (typeof topK !== "number") {
      throw new InvalidArgumentError2({
        parameter: "topK",
        value: topK,
        message: "topK must be a number"
      });
    }
  }
  if (presencePenalty != null) {
    if (typeof presencePenalty !== "number") {
      throw new InvalidArgumentError2({
        parameter: "presencePenalty",
        value: presencePenalty,
        message: "presencePenalty must be a number"
      });
    }
  }
  if (frequencyPenalty != null) {
    if (typeof frequencyPenalty !== "number") {
      throw new InvalidArgumentError2({
        parameter: "frequencyPenalty",
        value: frequencyPenalty,
        message: "frequencyPenalty must be a number"
      });
    }
  }
  if (seed != null) {
    if (!Number.isInteger(seed)) {
      throw new InvalidArgumentError2({
        parameter: "seed",
        value: seed,
        message: "seed must be an integer"
      });
    }
  }
  return {
    maxTokens,
    temperature: temperature != null ? temperature : 0,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    stopSequences: stopSequences != null && stopSequences.length > 0 ? stopSequences : void 0,
    seed
  };
}
function attachmentsToParts(attachments) {
  var _a152, _b2, _c2;
  const parts = [];
  for (const attachment of attachments) {
    let url;
    try {
      url = new URL(attachment.url);
    } catch (error) {
      throw new Error(`Invalid URL: ${attachment.url}`);
    }
    switch (url.protocol) {
      case "http:":
      case "https:": {
        if ((_a152 = attachment.contentType) == null ? void 0 : _a152.startsWith("image/")) {
          parts.push({ type: "image", image: url });
        } else {
          if (!attachment.contentType) {
            throw new Error(
              "If the attachment is not an image, it must specify a content type"
            );
          }
          parts.push({
            type: "file",
            data: url,
            mimeType: attachment.contentType
          });
        }
        break;
      }
      case "data:": {
        let header;
        let base64Content;
        let mimeType;
        try {
          [header, base64Content] = attachment.url.split(",");
          mimeType = header.split(";")[0].split(":")[1];
        } catch (error) {
          throw new Error(`Error processing data URL: ${attachment.url}`);
        }
        if (mimeType == null || base64Content == null) {
          throw new Error(`Invalid data URL format: ${attachment.url}`);
        }
        if ((_b2 = attachment.contentType) == null ? void 0 : _b2.startsWith("image/")) {
          parts.push({
            type: "image",
            image: convertDataContentToUint8Array(base64Content)
          });
        } else if ((_c2 = attachment.contentType) == null ? void 0 : _c2.startsWith("text/")) {
          parts.push({
            type: "text",
            text: convertUint8ArrayToText(
              convertDataContentToUint8Array(base64Content)
            )
          });
        } else {
          if (!attachment.contentType) {
            throw new Error(
              "If the attachment is not an image or text, it must specify a content type"
            );
          }
          parts.push({
            type: "file",
            data: base64Content,
            mimeType: attachment.contentType
          });
        }
        break;
      }
      default: {
        throw new Error(`Unsupported URL protocol: ${url.protocol}`);
      }
    }
  }
  return parts;
}
var name8 = "AI_MessageConversionError";
var marker8 = `vercel.ai.error.${name8}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var MessageConversionError = class extends AISDKError {
  constructor({
    originalMessage,
    message
  }) {
    super({ name: name8, message });
    this[_a8] = true;
    this.originalMessage = originalMessage;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8);
  }
};
_a8 = symbol8;
function convertToCoreMessages(messages, options) {
  var _a152, _b2;
  const tools2 = (_a152 = options == null ? void 0 : options.tools) != null ? _a152 : {};
  const coreMessages = [];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const isLastMessage = i === messages.length - 1;
    const { role, content, experimental_attachments } = message;
    switch (role) {
      case "system": {
        coreMessages.push({
          role: "system",
          content
        });
        break;
      }
      case "user": {
        coreMessages.push({
          role: "user",
          content: experimental_attachments ? [
            { type: "text", text: content },
            ...attachmentsToParts(experimental_attachments)
          ] : content
        });
        break;
      }
      case "assistant": {
        if (message.parts != null) {
          let processBlock2 = function() {
            coreMessages.push({
              role: "assistant",
              content: block.map((part) => {
                switch (part.type) {
                  case "text":
                    return {
                      type: "text",
                      text: part.text
                    };
                  default:
                    return {
                      type: "tool-call",
                      toolCallId: part.toolInvocation.toolCallId,
                      toolName: part.toolInvocation.toolName,
                      args: part.toolInvocation.args
                    };
                }
              })
            });
            const stepInvocations = block.filter(
              (part) => part.type === "tool-invocation"
            ).map((part) => part.toolInvocation);
            if (stepInvocations.length > 0) {
              coreMessages.push({
                role: "tool",
                content: stepInvocations.map(
                  (toolInvocation) => {
                    if (!("result" in toolInvocation)) {
                      throw new MessageConversionError({
                        originalMessage: message,
                        message: "ToolInvocation must have a result: " + JSON.stringify(toolInvocation)
                      });
                    }
                    const { toolCallId, toolName, result } = toolInvocation;
                    const tool2 = tools2[toolName];
                    return (tool2 == null ? void 0 : tool2.experimental_toToolResultContent) != null ? {
                      type: "tool-result",
                      toolCallId,
                      toolName,
                      result: tool2.experimental_toToolResultContent(result),
                      experimental_content: tool2.experimental_toToolResultContent(result)
                    } : {
                      type: "tool-result",
                      toolCallId,
                      toolName,
                      result
                    };
                  }
                )
              });
            }
            block = [];
            blockHasToolInvocations = false;
            currentStep++;
          };
          let currentStep = 0;
          let blockHasToolInvocations = false;
          let block = [];
          for (const part of message.parts) {
            switch (part.type) {
              case "reasoning":
                break;
              case "text": {
                if (blockHasToolInvocations) {
                  processBlock2();
                }
                block.push(part);
                break;
              }
              case "tool-invocation": {
                if (((_b2 = part.toolInvocation.step) != null ? _b2 : 0) !== currentStep) {
                  processBlock2();
                }
                block.push(part);
                blockHasToolInvocations = true;
                break;
              }
            }
          }
          processBlock2();
          break;
        }
        const toolInvocations = message.toolInvocations;
        if (toolInvocations == null || toolInvocations.length === 0) {
          coreMessages.push({ role: "assistant", content });
          break;
        }
        const maxStep = toolInvocations.reduce((max, toolInvocation) => {
          var _a16;
          return Math.max(max, (_a16 = toolInvocation.step) != null ? _a16 : 0);
        }, 0);
        for (let i2 = 0; i2 <= maxStep; i2++) {
          const stepInvocations = toolInvocations.filter(
            (toolInvocation) => {
              var _a16;
              return ((_a16 = toolInvocation.step) != null ? _a16 : 0) === i2;
            }
          );
          if (stepInvocations.length === 0) {
            continue;
          }
          coreMessages.push({
            role: "assistant",
            content: [
              ...isLastMessage && content && i2 === 0 ? [{ type: "text", text: content }] : [],
              ...stepInvocations.map(
                ({ toolCallId, toolName, args }) => ({
                  type: "tool-call",
                  toolCallId,
                  toolName,
                  args
                })
              )
            ]
          });
          coreMessages.push({
            role: "tool",
            content: stepInvocations.map((toolInvocation) => {
              if (!("result" in toolInvocation)) {
                throw new MessageConversionError({
                  originalMessage: message,
                  message: "ToolInvocation must have a result: " + JSON.stringify(toolInvocation)
                });
              }
              const { toolCallId, toolName, result } = toolInvocation;
              const tool2 = tools2[toolName];
              return (tool2 == null ? void 0 : tool2.experimental_toToolResultContent) != null ? {
                type: "tool-result",
                toolCallId,
                toolName,
                result: tool2.experimental_toToolResultContent(result),
                experimental_content: tool2.experimental_toToolResultContent(result)
              } : {
                type: "tool-result",
                toolCallId,
                toolName,
                result
              };
            })
          });
        }
        if (content && !isLastMessage) {
          coreMessages.push({ role: "assistant", content });
        }
        break;
      }
      case "data": {
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new MessageConversionError({
          originalMessage: message,
          message: `Unsupported role: ${_exhaustiveCheck}`
        });
      }
    }
  }
  return coreMessages;
}
function detectPromptType(prompt2) {
  if (!Array.isArray(prompt2)) {
    return "other";
  }
  if (prompt2.length === 0) {
    return "messages";
  }
  const characteristics = prompt2.map(detectSingleMessageCharacteristics);
  if (characteristics.some((c) => c === "has-ui-specific-parts")) {
    return "ui-messages";
  } else if (characteristics.every(
    (c) => c === "has-core-specific-parts" || c === "message"
  )) {
    return "messages";
  } else {
    return "other";
  }
}
function detectSingleMessageCharacteristics(message) {
  if (typeof message === "object" && message !== null && (message.role === "function" || // UI-only role
  message.role === "data" || // UI-only role
  "toolInvocations" in message || // UI-specific field
  "experimental_attachments" in message)) {
    return "has-ui-specific-parts";
  } else if (typeof message === "object" && message !== null && "content" in message && (Array.isArray(message.content) || // Core messages can have array content
  "experimental_providerMetadata" in message || "providerOptions" in message)) {
    return "has-core-specific-parts";
  } else if (typeof message === "object" && message !== null && "role" in message && "content" in message && typeof message.content === "string" && ["system", "user", "assistant", "tool"].includes(message.role)) {
    return "message";
  } else {
    return "other";
  }
}
var jsonValueSchema = z.lazy(
  () => z.union([
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), jsonValueSchema),
    z.array(jsonValueSchema)
  ])
);
var providerMetadataSchema = z.record(
  z.string(),
  z.record(z.string(), jsonValueSchema)
);
var toolResultContentSchema = z.array(
  z.union([
    z.object({ type: z.literal("text"), text: z.string() }),
    z.object({
      type: z.literal("image"),
      data: z.string(),
      mimeType: z.string().optional()
    })
  ])
);
var textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var imagePartSchema = z.object({
  type: z.literal("image"),
  image: z.union([dataContentSchema, z.instanceof(URL)]),
  mimeType: z.string().optional(),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var filePartSchema = z.object({
  type: z.literal("file"),
  data: z.union([dataContentSchema, z.instanceof(URL)]),
  mimeType: z.string(),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var toolCallPartSchema = z.object({
  type: z.literal("tool-call"),
  toolCallId: z.string(),
  toolName: z.string(),
  args: z.unknown(),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var toolResultPartSchema = z.object({
  type: z.literal("tool-result"),
  toolCallId: z.string(),
  toolName: z.string(),
  result: z.unknown(),
  content: toolResultContentSchema.optional(),
  isError: z.boolean().optional(),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreSystemMessageSchema = z.object({
  role: z.literal("system"),
  content: z.string(),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreUserMessageSchema = z.object({
  role: z.literal("user"),
  content: z.union([
    z.string(),
    z.array(z.union([textPartSchema, imagePartSchema, filePartSchema]))
  ]),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreAssistantMessageSchema = z.object({
  role: z.literal("assistant"),
  content: z.union([
    z.string(),
    z.array(z.union([textPartSchema, toolCallPartSchema]))
  ]),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreToolMessageSchema = z.object({
  role: z.literal("tool"),
  content: z.array(toolResultPartSchema),
  providerOptions: providerMetadataSchema.optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreMessageSchema = z.union([
  coreSystemMessageSchema,
  coreUserMessageSchema,
  coreAssistantMessageSchema,
  coreToolMessageSchema
]);
function standardizePrompt({
  prompt: prompt2,
  tools: tools2
}) {
  if (prompt2.prompt == null && prompt2.messages == null) {
    throw new InvalidPromptError({
      prompt: prompt2,
      message: "prompt or messages must be defined"
    });
  }
  if (prompt2.prompt != null && prompt2.messages != null) {
    throw new InvalidPromptError({
      prompt: prompt2,
      message: "prompt and messages cannot be defined at the same time"
    });
  }
  if (prompt2.system != null && typeof prompt2.system !== "string") {
    throw new InvalidPromptError({
      prompt: prompt2,
      message: "system must be a string"
    });
  }
  if (prompt2.prompt != null) {
    if (typeof prompt2.prompt !== "string") {
      throw new InvalidPromptError({
        prompt: prompt2,
        message: "prompt must be a string"
      });
    }
    return {
      type: "prompt",
      system: prompt2.system,
      messages: [
        {
          role: "user",
          content: prompt2.prompt
        }
      ]
    };
  }
  if (prompt2.messages != null) {
    const promptType = detectPromptType(prompt2.messages);
    if (promptType === "other") {
      throw new InvalidPromptError({
        prompt: prompt2,
        message: "messages must be an array of CoreMessage or UIMessage"
      });
    }
    const messages = promptType === "ui-messages" ? convertToCoreMessages(prompt2.messages, {
      tools: tools2
    }) : prompt2.messages;
    const validationResult = safeValidateTypes({
      value: messages,
      schema: z.array(coreMessageSchema)
    });
    if (!validationResult.success) {
      throw new InvalidPromptError({
        prompt: prompt2,
        message: "messages must be an array of CoreMessage or UIMessage",
        cause: validationResult.error
      });
    }
    return {
      type: "messages",
      messages,
      system: prompt2.system
    };
  }
  throw new Error("unreachable");
}
function calculateLanguageModelUsage({
  promptTokens,
  completionTokens
}) {
  return {
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens
  };
}
function addLanguageModelUsage(usage1, usage2) {
  return {
    promptTokens: usage1.promptTokens + usage2.promptTokens,
    completionTokens: usage1.completionTokens + usage2.completionTokens,
    totalTokens: usage1.totalTokens + usage2.totalTokens
  };
}
var DEFAULT_SCHEMA_PREFIX = "JSON schema:";
var DEFAULT_SCHEMA_SUFFIX = "You MUST answer with a JSON object that matches the JSON schema above.";
var DEFAULT_GENERIC_SUFFIX = "You MUST answer with JSON.";
function injectJsonInstruction({
  prompt: prompt2,
  schema: schema2,
  schemaPrefix = schema2 != null ? DEFAULT_SCHEMA_PREFIX : void 0,
  schemaSuffix = schema2 != null ? DEFAULT_SCHEMA_SUFFIX : DEFAULT_GENERIC_SUFFIX
}) {
  return [
    prompt2 != null && prompt2.length > 0 ? prompt2 : void 0,
    prompt2 != null && prompt2.length > 0 ? "" : void 0,
    // add a newline if prompt is not null
    schemaPrefix,
    schema2 != null ? JSON.stringify(schema2) : void 0,
    schemaSuffix
  ].filter((line) => line != null).join("\n");
}
function createAsyncIterableStream(source) {
  const stream = source.pipeThrough(new TransformStream());
  stream[Symbol.asyncIterator] = () => {
    const reader = stream.getReader();
    return {
      async next() {
        const { done, value } = await reader.read();
        return done ? { done: true, value: void 0 } : { done: false, value };
      }
    };
  };
  return stream;
}
createIdGenerator({ prefix: "aiobj", size: 24 });
var DelayedPromise = class {
  constructor() {
    this.status = { type: "pending" };
    this._resolve = void 0;
    this._reject = void 0;
  }
  get value() {
    if (this.promise) {
      return this.promise;
    }
    this.promise = new Promise((resolve2, reject) => {
      if (this.status.type === "resolved") {
        resolve2(this.status.value);
      } else if (this.status.type === "rejected") {
        reject(this.status.error);
      }
      this._resolve = resolve2;
      this._reject = reject;
    });
    return this.promise;
  }
  resolve(value) {
    var _a152;
    this.status = { type: "resolved", value };
    if (this.promise) {
      (_a152 = this._resolve) == null ? void 0 : _a152.call(this, value);
    }
  }
  reject(error) {
    var _a152;
    this.status = { type: "rejected", error };
    if (this.promise) {
      (_a152 = this._reject) == null ? void 0 : _a152.call(this, error);
    }
  }
};
function createResolvablePromise() {
  let resolve2;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve2 = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve2,
    reject
  };
}
function createStitchableStream() {
  let innerStreamReaders = [];
  let controller = null;
  let isClosed = false;
  let waitForNewStream = createResolvablePromise();
  const processPull = async () => {
    if (isClosed && innerStreamReaders.length === 0) {
      controller == null ? void 0 : controller.close();
      return;
    }
    if (innerStreamReaders.length === 0) {
      waitForNewStream = createResolvablePromise();
      await waitForNewStream.promise;
      return processPull();
    }
    try {
      const { value, done } = await innerStreamReaders[0].read();
      if (done) {
        innerStreamReaders.shift();
        if (innerStreamReaders.length > 0) {
          await processPull();
        } else if (isClosed) {
          controller == null ? void 0 : controller.close();
        }
      } else {
        controller == null ? void 0 : controller.enqueue(value);
      }
    } catch (error) {
      controller == null ? void 0 : controller.error(error);
      innerStreamReaders.shift();
      if (isClosed && innerStreamReaders.length === 0) {
        controller == null ? void 0 : controller.close();
      }
    }
  };
  return {
    stream: new ReadableStream({
      start(controllerParam) {
        controller = controllerParam;
      },
      pull: processPull,
      async cancel() {
        for (const reader of innerStreamReaders) {
          await reader.cancel();
        }
        innerStreamReaders = [];
        isClosed = true;
      }
    }),
    addStream: (innerStream) => {
      if (isClosed) {
        throw new Error("Cannot add inner stream: outer stream is closed");
      }
      innerStreamReaders.push(innerStream.getReader());
      waitForNewStream.resolve();
    },
    /**
     * Gracefully close the outer stream. This will let the inner streams
     * finish processing and then close the outer stream.
     */
    close: () => {
      isClosed = true;
      waitForNewStream.resolve();
      if (innerStreamReaders.length === 0) {
        controller == null ? void 0 : controller.close();
      }
    },
    /**
     * Immediately close the outer stream. This will cancel all inner streams
     * and close the outer stream.
     */
    terminate: () => {
      isClosed = true;
      waitForNewStream.resolve();
      innerStreamReaders.forEach((reader) => reader.cancel());
      innerStreamReaders = [];
      controller == null ? void 0 : controller.close();
    }
  };
}
function now() {
  var _a152, _b2;
  return (_b2 = (_a152 = globalThis == null ? void 0 : globalThis.performance) == null ? void 0 : _a152.now()) != null ? _b2 : Date.now();
}
createIdGenerator({ prefix: "aiobj", size: 24 });
var name9 = "AI_NoOutputSpecifiedError";
var marker9 = `vercel.ai.error.${name9}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var NoOutputSpecifiedError = class extends AISDKError {
  // used in isInstance
  constructor({ message = "No output specified." } = {}) {
    super({ name: name9, message });
    this[_a9] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker9);
  }
};
_a9 = symbol9;
var name10 = "AI_ToolExecutionError";
var marker10 = `vercel.ai.error.${name10}`;
var symbol10 = Symbol.for(marker10);
var _a10;
var ToolExecutionError = class extends AISDKError {
  constructor({
    toolArgs,
    toolName,
    toolCallId,
    cause,
    message = `Error executing tool ${toolName}: ${getErrorMessage$1(cause)}`
  }) {
    super({ name: name10, message, cause });
    this[_a10] = true;
    this.toolArgs = toolArgs;
    this.toolName = toolName;
    this.toolCallId = toolCallId;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker10);
  }
};
_a10 = symbol10;
function isNonEmptyObject(object2) {
  return object2 != null && Object.keys(object2).length > 0;
}
function prepareToolsAndToolChoice({
  tools: tools2,
  toolChoice,
  activeTools
}) {
  if (!isNonEmptyObject(tools2)) {
    return {
      tools: void 0,
      toolChoice: void 0
    };
  }
  const filteredTools = activeTools != null ? Object.entries(tools2).filter(
    ([name15]) => activeTools.includes(name15)
  ) : Object.entries(tools2);
  return {
    tools: filteredTools.map(([name15, tool2]) => {
      const toolType = tool2.type;
      switch (toolType) {
        case void 0:
        case "function":
          return {
            type: "function",
            name: name15,
            description: tool2.description,
            parameters: asSchema(tool2.parameters).jsonSchema
          };
        case "provider-defined":
          return {
            type: "provider-defined",
            name: name15,
            id: tool2.id,
            args: tool2.args
          };
        default: {
          const exhaustiveCheck = toolType;
          throw new Error(`Unsupported tool type: ${exhaustiveCheck}`);
        }
      }
    }),
    toolChoice: toolChoice == null ? { type: "auto" } : typeof toolChoice === "string" ? { type: toolChoice } : { type: "tool", toolName: toolChoice.toolName }
  };
}
var lastWhitespaceRegexp = /^([\s\S]*?)(\s+)(\S*)$/;
function splitOnLastWhitespace(text2) {
  const match = text2.match(lastWhitespaceRegexp);
  return match ? { prefix: match[1], whitespace: match[2], suffix: match[3] } : void 0;
}
function removeTextAfterLastWhitespace(text2) {
  const match = splitOnLastWhitespace(text2);
  return match ? match.prefix + match.whitespace : text2;
}
var name11 = "AI_InvalidToolArgumentsError";
var marker11 = `vercel.ai.error.${name11}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var InvalidToolArgumentsError = class extends AISDKError {
  constructor({
    toolArgs,
    toolName,
    cause,
    message = `Invalid arguments for tool ${toolName}: ${getErrorMessage$1(
      cause
    )}`
  }) {
    super({ name: name11, message, cause });
    this[_a11] = true;
    this.toolArgs = toolArgs;
    this.toolName = toolName;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker11);
  }
};
_a11 = symbol11;
var name12 = "AI_NoSuchToolError";
var marker12 = `vercel.ai.error.${name12}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var NoSuchToolError = class extends AISDKError {
  constructor({
    toolName,
    availableTools = void 0,
    message = `Model tried to call unavailable tool '${toolName}'. ${availableTools === void 0 ? "No tools are available." : `Available tools: ${availableTools.join(", ")}.`}`
  }) {
    super({ name: name12, message });
    this[_a12] = true;
    this.toolName = toolName;
    this.availableTools = availableTools;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker12);
  }
};
_a12 = symbol12;
var name13 = "AI_ToolCallRepairError";
var marker13 = `vercel.ai.error.${name13}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var ToolCallRepairError = class extends AISDKError {
  constructor({
    cause,
    originalError,
    message = `Error repairing tool call: ${getErrorMessage$1(cause)}`
  }) {
    super({ name: name13, message, cause });
    this[_a13] = true;
    this.originalError = originalError;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
};
_a13 = symbol13;
async function parseToolCall({
  toolCall,
  tools: tools2,
  repairToolCall,
  system,
  messages
}) {
  if (tools2 == null) {
    throw new NoSuchToolError({ toolName: toolCall.toolName });
  }
  try {
    return await doParseToolCall({ toolCall, tools: tools2 });
  } catch (error) {
    if (repairToolCall == null || !(NoSuchToolError.isInstance(error) || InvalidToolArgumentsError.isInstance(error))) {
      throw error;
    }
    let repairedToolCall = null;
    try {
      repairedToolCall = await repairToolCall({
        toolCall,
        tools: tools2,
        parameterSchema: ({ toolName }) => asSchema(tools2[toolName].parameters).jsonSchema,
        system,
        messages,
        error
      });
    } catch (repairError) {
      throw new ToolCallRepairError({
        cause: repairError,
        originalError: error
      });
    }
    if (repairedToolCall == null) {
      throw error;
    }
    return await doParseToolCall({ toolCall: repairedToolCall, tools: tools2 });
  }
}
async function doParseToolCall({
  toolCall,
  tools: tools2
}) {
  const toolName = toolCall.toolName;
  const tool2 = tools2[toolName];
  if (tool2 == null) {
    throw new NoSuchToolError({
      toolName: toolCall.toolName,
      availableTools: Object.keys(tools2)
    });
  }
  const schema2 = asSchema(tool2.parameters);
  const parseResult = toolCall.args.trim() === "" ? safeValidateTypes({ value: {}, schema: schema2 }) : safeParseJSON({ text: toolCall.args, schema: schema2 });
  if (parseResult.success === false) {
    throw new InvalidToolArgumentsError({
      toolName,
      toolArgs: toolCall.args,
      cause: parseResult.error
    });
  }
  return {
    type: "tool-call",
    toolCallId: toolCall.toolCallId,
    toolName,
    args: parseResult.value
  };
}
function toResponseMessages({
  text: text2 = "",
  tools: tools2,
  toolCalls,
  toolResults,
  messageId,
  generateMessageId
}) {
  const responseMessages = [];
  responseMessages.push({
    role: "assistant",
    content: [{ type: "text", text: text2 }, ...toolCalls],
    id: messageId
  });
  if (toolResults.length > 0) {
    responseMessages.push({
      role: "tool",
      id: generateMessageId(),
      content: toolResults.map((toolResult) => {
        const tool2 = tools2[toolResult.toolName];
        return (tool2 == null ? void 0 : tool2.experimental_toToolResultContent) != null ? {
          type: "tool-result",
          toolCallId: toolResult.toolCallId,
          toolName: toolResult.toolName,
          result: tool2.experimental_toToolResultContent(toolResult.result),
          experimental_content: tool2.experimental_toToolResultContent(
            toolResult.result
          )
        } : {
          type: "tool-result",
          toolCallId: toolResult.toolCallId,
          toolName: toolResult.toolName,
          result: toolResult.result
        };
      })
    });
  }
  return responseMessages;
}
var originalGenerateId3 = createIdGenerator({
  prefix: "aitxt",
  size: 24
});
var originalGenerateMessageId = createIdGenerator({
  prefix: "msg",
  size: 24
});
async function generateText({
  model,
  tools: tools2,
  toolChoice,
  system,
  prompt: prompt2,
  messages,
  maxRetries: maxRetriesArg,
  abortSignal,
  headers,
  maxSteps = 1,
  experimental_generateMessageId: generateMessageId = originalGenerateMessageId,
  experimental_output: output,
  experimental_continueSteps: continueSteps = false,
  experimental_telemetry: telemetry,
  experimental_providerMetadata,
  providerOptions = experimental_providerMetadata,
  experimental_activeTools: activeTools,
  experimental_repairToolCall: repairToolCall,
  _internal: {
    generateId: generateId3 = originalGenerateId3,
    currentDate = () => /* @__PURE__ */ new Date()
  } = {},
  onStepFinish,
  ...settings
}) {
  var _a152;
  if (maxSteps < 1) {
    throw new InvalidArgumentError2({
      parameter: "maxSteps",
      value: maxSteps,
      message: "maxSteps must be at least 1"
    });
  }
  const { maxRetries, retry } = prepareRetries({ maxRetries: maxRetriesArg });
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { ...settings, maxRetries }
  });
  const initialPrompt = standardizePrompt({
    prompt: {
      system: (_a152 = output == null ? void 0 : output.injectIntoSystemPrompt({ system, model })) != null ? _a152 : system,
      prompt: prompt2,
      messages
    },
    tools: tools2
  });
  const tracer = getTracer(telemetry);
  return recordSpan({
    name: "ai.generateText",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({
          operationId: "ai.generateText",
          telemetry
        }),
        ...baseTelemetryAttributes,
        // specific settings that only make sense on the outer level:
        "ai.prompt": {
          input: () => JSON.stringify({ system, prompt: prompt2, messages })
        },
        "ai.settings.maxSteps": maxSteps
      }
    }),
    tracer,
    fn: async (span) => {
      var _a16, _b2, _c2, _d2, _e2, _f2, _g;
      const mode = {
        type: "regular",
        ...prepareToolsAndToolChoice({ tools: tools2, toolChoice, activeTools })
      };
      const callSettings = prepareCallSettings(settings);
      let currentModelResponse;
      let currentToolCalls = [];
      let currentToolResults = [];
      let stepCount = 0;
      const responseMessages = [];
      let text2 = "";
      const steps = [];
      let usage = {
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0
      };
      let stepType = "initial";
      do {
        const promptFormat = stepCount === 0 ? initialPrompt.type : "messages";
        const stepInputMessages = [
          ...initialPrompt.messages,
          ...responseMessages
        ];
        const promptMessages = await convertToLanguageModelPrompt({
          prompt: {
            type: promptFormat,
            system: initialPrompt.system,
            messages: stepInputMessages
          },
          modelSupportsImageUrls: model.supportsImageUrls,
          modelSupportsUrl: (_a16 = model.supportsUrl) == null ? void 0 : _a16.bind(model)
          // support 'this' context
        });
        currentModelResponse = await retry(
          () => recordSpan({
            name: "ai.generateText.doGenerate",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.generateText.doGenerate",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                "ai.prompt.format": { input: () => promptFormat },
                "ai.prompt.messages": {
                  input: () => JSON.stringify(promptMessages)
                },
                "ai.prompt.tools": {
                  // convert the language model level tools:
                  input: () => {
                    var _a17;
                    return (_a17 = mode.tools) == null ? void 0 : _a17.map((tool2) => JSON.stringify(tool2));
                  }
                },
                "ai.prompt.toolChoice": {
                  input: () => mode.toolChoice != null ? JSON.stringify(mode.toolChoice) : void 0
                },
                // standardized gen-ai llm span attributes:
                "gen_ai.system": model.provider,
                "gen_ai.request.model": model.modelId,
                "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                "gen_ai.request.max_tokens": settings.maxTokens,
                "gen_ai.request.presence_penalty": settings.presencePenalty,
                "gen_ai.request.stop_sequences": settings.stopSequences,
                "gen_ai.request.temperature": settings.temperature,
                "gen_ai.request.top_k": settings.topK,
                "gen_ai.request.top_p": settings.topP
              }
            }),
            tracer,
            fn: async (span2) => {
              var _a17, _b22, _c22, _d22, _e22, _f22;
              const result = await model.doGenerate({
                mode,
                ...callSettings,
                inputFormat: promptFormat,
                responseFormat: output == null ? void 0 : output.responseFormat({ model }),
                prompt: promptMessages,
                providerMetadata: providerOptions,
                abortSignal,
                headers
              });
              const responseData = {
                id: (_b22 = (_a17 = result.response) == null ? void 0 : _a17.id) != null ? _b22 : generateId3(),
                timestamp: (_d22 = (_c22 = result.response) == null ? void 0 : _c22.timestamp) != null ? _d22 : currentDate(),
                modelId: (_f22 = (_e22 = result.response) == null ? void 0 : _e22.modelId) != null ? _f22 : model.modelId
              };
              span2.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.response.finishReason": result.finishReason,
                    "ai.response.text": {
                      output: () => result.text
                    },
                    "ai.response.toolCalls": {
                      output: () => JSON.stringify(result.toolCalls)
                    },
                    "ai.response.id": responseData.id,
                    "ai.response.model": responseData.modelId,
                    "ai.response.timestamp": responseData.timestamp.toISOString(),
                    "ai.usage.promptTokens": result.usage.promptTokens,
                    "ai.usage.completionTokens": result.usage.completionTokens,
                    // standardized gen-ai llm span attributes:
                    "gen_ai.response.finish_reasons": [result.finishReason],
                    "gen_ai.response.id": responseData.id,
                    "gen_ai.response.model": responseData.modelId,
                    "gen_ai.usage.input_tokens": result.usage.promptTokens,
                    "gen_ai.usage.output_tokens": result.usage.completionTokens
                  }
                })
              );
              return { ...result, response: responseData };
            }
          })
        );
        currentToolCalls = await Promise.all(
          ((_b2 = currentModelResponse.toolCalls) != null ? _b2 : []).map(
            (toolCall) => parseToolCall({
              toolCall,
              tools: tools2,
              repairToolCall,
              system,
              messages: stepInputMessages
            })
          )
        );
        currentToolResults = tools2 == null ? [] : await executeTools({
          toolCalls: currentToolCalls,
          tools: tools2,
          tracer,
          telemetry,
          messages: stepInputMessages,
          abortSignal
        });
        const currentUsage = calculateLanguageModelUsage(
          currentModelResponse.usage
        );
        usage = addLanguageModelUsage(usage, currentUsage);
        let nextStepType = "done";
        if (++stepCount < maxSteps) {
          if (continueSteps && currentModelResponse.finishReason === "length" && // only use continue when there are no tool calls:
          currentToolCalls.length === 0) {
            nextStepType = "continue";
          } else if (
            // there are tool calls:
            currentToolCalls.length > 0 && // all current tool calls have results:
            currentToolResults.length === currentToolCalls.length
          ) {
            nextStepType = "tool-result";
          }
        }
        const originalText = (_c2 = currentModelResponse.text) != null ? _c2 : "";
        const stepTextLeadingWhitespaceTrimmed = stepType === "continue" && // only for continue steps
        text2.trimEnd() !== text2 ? originalText.trimStart() : originalText;
        const stepText = nextStepType === "continue" ? removeTextAfterLastWhitespace(stepTextLeadingWhitespaceTrimmed) : stepTextLeadingWhitespaceTrimmed;
        text2 = nextStepType === "continue" || stepType === "continue" ? text2 + stepText : stepText;
        if (stepType === "continue") {
          const lastMessage = responseMessages[responseMessages.length - 1];
          if (typeof lastMessage.content === "string") {
            lastMessage.content += stepText;
          } else {
            lastMessage.content.push({
              text: stepText,
              type: "text"
            });
          }
        } else {
          responseMessages.push(
            ...toResponseMessages({
              text: text2,
              tools: tools2 != null ? tools2 : {},
              toolCalls: currentToolCalls,
              toolResults: currentToolResults,
              messageId: generateMessageId(),
              generateMessageId
            })
          );
        }
        const currentStepResult = {
          stepType,
          text: stepText,
          reasoning: currentModelResponse.reasoning,
          toolCalls: currentToolCalls,
          toolResults: currentToolResults,
          finishReason: currentModelResponse.finishReason,
          usage: currentUsage,
          warnings: currentModelResponse.warnings,
          logprobs: currentModelResponse.logprobs,
          request: (_d2 = currentModelResponse.request) != null ? _d2 : {},
          response: {
            ...currentModelResponse.response,
            headers: (_e2 = currentModelResponse.rawResponse) == null ? void 0 : _e2.headers,
            // deep clone msgs to avoid mutating past messages in multi-step:
            messages: structuredClone(responseMessages)
          },
          experimental_providerMetadata: currentModelResponse.providerMetadata,
          isContinued: nextStepType === "continue"
        };
        steps.push(currentStepResult);
        await (onStepFinish == null ? void 0 : onStepFinish(currentStepResult));
        stepType = nextStepType;
      } while (stepType !== "done");
      span.setAttributes(
        selectTelemetryAttributes({
          telemetry,
          attributes: {
            "ai.response.finishReason": currentModelResponse.finishReason,
            "ai.response.text": {
              output: () => currentModelResponse.text
            },
            "ai.response.toolCalls": {
              output: () => JSON.stringify(currentModelResponse.toolCalls)
            },
            "ai.usage.promptTokens": currentModelResponse.usage.promptTokens,
            "ai.usage.completionTokens": currentModelResponse.usage.completionTokens
          }
        })
      );
      return new DefaultGenerateTextResult({
        text: text2,
        reasoning: currentModelResponse.reasoning,
        outputResolver: () => {
          if (output == null) {
            throw new NoOutputSpecifiedError();
          }
          return output.parseOutput(
            { text: text2 },
            { response: currentModelResponse.response, usage }
          );
        },
        toolCalls: currentToolCalls,
        toolResults: currentToolResults,
        finishReason: currentModelResponse.finishReason,
        usage,
        warnings: currentModelResponse.warnings,
        request: (_f2 = currentModelResponse.request) != null ? _f2 : {},
        response: {
          ...currentModelResponse.response,
          headers: (_g = currentModelResponse.rawResponse) == null ? void 0 : _g.headers,
          messages: responseMessages
        },
        logprobs: currentModelResponse.logprobs,
        steps,
        providerMetadata: currentModelResponse.providerMetadata
      });
    }
  });
}
async function executeTools({
  toolCalls,
  tools: tools2,
  tracer,
  telemetry,
  messages,
  abortSignal
}) {
  const toolResults = await Promise.all(
    toolCalls.map(async ({ toolCallId, toolName, args }) => {
      const tool2 = tools2[toolName];
      if ((tool2 == null ? void 0 : tool2.execute) == null) {
        return void 0;
      }
      const result = await recordSpan({
        name: "ai.toolCall",
        attributes: selectTelemetryAttributes({
          telemetry,
          attributes: {
            ...assembleOperationName({
              operationId: "ai.toolCall",
              telemetry
            }),
            "ai.toolCall.name": toolName,
            "ai.toolCall.id": toolCallId,
            "ai.toolCall.args": {
              output: () => JSON.stringify(args)
            }
          }
        }),
        tracer,
        fn: async (span) => {
          try {
            const result2 = await tool2.execute(args, {
              toolCallId,
              messages,
              abortSignal
            });
            try {
              span.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.toolCall.result": {
                      output: () => JSON.stringify(result2)
                    }
                  }
                })
              );
            } catch (ignored) {
            }
            return result2;
          } catch (error) {
            throw new ToolExecutionError({
              toolCallId,
              toolName,
              toolArgs: args,
              cause: error
            });
          }
        }
      });
      return {
        type: "tool-result",
        toolCallId,
        toolName,
        args,
        result
      };
    })
  );
  return toolResults.filter(
    (result) => result != null
  );
}
var DefaultGenerateTextResult = class {
  constructor(options) {
    this.text = options.text;
    this.reasoning = options.reasoning;
    this.toolCalls = options.toolCalls;
    this.toolResults = options.toolResults;
    this.finishReason = options.finishReason;
    this.usage = options.usage;
    this.warnings = options.warnings;
    this.request = options.request;
    this.response = options.response;
    this.steps = options.steps;
    this.experimental_providerMetadata = options.providerMetadata;
    this.logprobs = options.logprobs;
    this.outputResolver = options.outputResolver;
  }
  get experimental_output() {
    return this.outputResolver();
  }
};
var output_exports = {};
__export(output_exports, {
  object: () => object,
  text: () => text
});
var text = () => ({
  type: "text",
  responseFormat: () => ({ type: "text" }),
  injectIntoSystemPrompt({ system }) {
    return system;
  },
  parsePartial({ text: text2 }) {
    return { partial: text2 };
  },
  parseOutput({ text: text2 }) {
    return text2;
  }
});
var object = ({
  schema: inputSchema
}) => {
  const schema2 = asSchema(inputSchema);
  return {
    type: "object",
    responseFormat: ({ model }) => ({
      type: "json",
      schema: model.supportsStructuredOutputs ? schema2.jsonSchema : void 0
    }),
    injectIntoSystemPrompt({ system, model }) {
      return model.supportsStructuredOutputs ? system : injectJsonInstruction({
        prompt: system,
        schema: schema2.jsonSchema
      });
    },
    parsePartial({ text: text2 }) {
      const result = parsePartialJson(text2);
      switch (result.state) {
        case "failed-parse":
        case "undefined-input":
          return void 0;
        case "repaired-parse":
        case "successful-parse":
          return {
            // Note: currently no validation of partial results:
            partial: result.value
          };
        default: {
          const _exhaustiveCheck = result.state;
          throw new Error(`Unsupported parse state: ${_exhaustiveCheck}`);
        }
      }
    },
    parseOutput({ text: text2 }, context) {
      const parseResult = safeParseJSON({ text: text2 });
      if (!parseResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: could not parse the response.",
          cause: parseResult.error,
          text: text2,
          response: context.response,
          usage: context.usage
        });
      }
      const validationResult = safeValidateTypes({
        value: parseResult.value,
        schema: schema2
      });
      if (!validationResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: response did not match schema.",
          cause: validationResult.error,
          text: text2,
          response: context.response,
          usage: context.usage
        });
      }
      return validationResult.value;
    }
  };
};
function asArray(value) {
  return value === void 0 ? [] : Array.isArray(value) ? value : [value];
}
function mergeStreams(stream1, stream2) {
  const reader1 = stream1.getReader();
  const reader2 = stream2.getReader();
  let lastRead1 = void 0;
  let lastRead2 = void 0;
  let stream1Done = false;
  let stream2Done = false;
  async function readStream1(controller) {
    try {
      if (lastRead1 == null) {
        lastRead1 = reader1.read();
      }
      const result = await lastRead1;
      lastRead1 = void 0;
      if (!result.done) {
        controller.enqueue(result.value);
      } else {
        controller.close();
      }
    } catch (error) {
      controller.error(error);
    }
  }
  async function readStream2(controller) {
    try {
      if (lastRead2 == null) {
        lastRead2 = reader2.read();
      }
      const result = await lastRead2;
      lastRead2 = void 0;
      if (!result.done) {
        controller.enqueue(result.value);
      } else {
        controller.close();
      }
    } catch (error) {
      controller.error(error);
    }
  }
  return new ReadableStream({
    async pull(controller) {
      try {
        if (stream1Done) {
          await readStream2(controller);
          return;
        }
        if (stream2Done) {
          await readStream1(controller);
          return;
        }
        if (lastRead1 == null) {
          lastRead1 = reader1.read();
        }
        if (lastRead2 == null) {
          lastRead2 = reader2.read();
        }
        const { result, reader } = await Promise.race([
          lastRead1.then((result2) => ({ result: result2, reader: reader1 })),
          lastRead2.then((result2) => ({ result: result2, reader: reader2 }))
        ]);
        if (!result.done) {
          controller.enqueue(result.value);
        }
        if (reader === reader1) {
          lastRead1 = void 0;
          if (result.done) {
            await readStream2(controller);
            stream1Done = true;
          }
        } else {
          lastRead2 = void 0;
          if (result.done) {
            stream2Done = true;
            await readStream1(controller);
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      reader1.cancel();
      reader2.cancel();
    }
  });
}
function runToolsTransformation({
  tools: tools2,
  generatorStream,
  toolCallStreaming,
  tracer,
  telemetry,
  system,
  messages,
  abortSignal,
  repairToolCall
}) {
  let toolResultsStreamController = null;
  const toolResultsStream = new ReadableStream({
    start(controller) {
      toolResultsStreamController = controller;
    }
  });
  const activeToolCalls = {};
  const outstandingToolResults = /* @__PURE__ */ new Set();
  let canClose = false;
  let finishChunk = void 0;
  function attemptClose() {
    if (canClose && outstandingToolResults.size === 0) {
      if (finishChunk != null) {
        toolResultsStreamController.enqueue(finishChunk);
      }
      toolResultsStreamController.close();
    }
  }
  const forwardStream = new TransformStream({
    async transform(chunk, controller) {
      const chunkType = chunk.type;
      switch (chunkType) {
        case "text-delta":
        case "reasoning":
        case "response-metadata":
        case "error": {
          controller.enqueue(chunk);
          break;
        }
        case "tool-call-delta": {
          if (toolCallStreaming) {
            if (!activeToolCalls[chunk.toolCallId]) {
              controller.enqueue({
                type: "tool-call-streaming-start",
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName
              });
              activeToolCalls[chunk.toolCallId] = true;
            }
            controller.enqueue({
              type: "tool-call-delta",
              toolCallId: chunk.toolCallId,
              toolName: chunk.toolName,
              argsTextDelta: chunk.argsTextDelta
            });
          }
          break;
        }
        case "tool-call": {
          try {
            const toolCall = await parseToolCall({
              toolCall: chunk,
              tools: tools2,
              repairToolCall,
              system,
              messages
            });
            controller.enqueue(toolCall);
            const tool2 = tools2[toolCall.toolName];
            if (tool2.execute != null) {
              const toolExecutionId = generateId();
              outstandingToolResults.add(toolExecutionId);
              recordSpan({
                name: "ai.toolCall",
                attributes: selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    ...assembleOperationName({
                      operationId: "ai.toolCall",
                      telemetry
                    }),
                    "ai.toolCall.name": toolCall.toolName,
                    "ai.toolCall.id": toolCall.toolCallId,
                    "ai.toolCall.args": {
                      output: () => JSON.stringify(toolCall.args)
                    }
                  }
                }),
                tracer,
                fn: async (span) => tool2.execute(toolCall.args, {
                  toolCallId: toolCall.toolCallId,
                  messages,
                  abortSignal
                }).then(
                  (result) => {
                    toolResultsStreamController.enqueue({
                      ...toolCall,
                      type: "tool-result",
                      result
                    });
                    outstandingToolResults.delete(toolExecutionId);
                    attemptClose();
                    try {
                      span.setAttributes(
                        selectTelemetryAttributes({
                          telemetry,
                          attributes: {
                            "ai.toolCall.result": {
                              output: () => JSON.stringify(result)
                            }
                          }
                        })
                      );
                    } catch (ignored) {
                    }
                  },
                  (error) => {
                    toolResultsStreamController.enqueue({
                      type: "error",
                      error: new ToolExecutionError({
                        toolCallId: toolCall.toolCallId,
                        toolName: toolCall.toolName,
                        toolArgs: toolCall.args,
                        cause: error
                      })
                    });
                    outstandingToolResults.delete(toolExecutionId);
                    attemptClose();
                  }
                )
              });
            }
          } catch (error) {
            toolResultsStreamController.enqueue({
              type: "error",
              error
            });
          }
          break;
        }
        case "finish": {
          finishChunk = {
            type: "finish",
            finishReason: chunk.finishReason,
            logprobs: chunk.logprobs,
            usage: calculateLanguageModelUsage(chunk.usage),
            experimental_providerMetadata: chunk.providerMetadata
          };
          break;
        }
        default: {
          const _exhaustiveCheck = chunkType;
          throw new Error(`Unhandled chunk type: ${_exhaustiveCheck}`);
        }
      }
    },
    flush() {
      canClose = true;
      attemptClose();
    }
  });
  return new ReadableStream({
    async start(controller) {
      return Promise.all([
        generatorStream.pipeThrough(forwardStream).pipeTo(
          new WritableStream({
            write(chunk) {
              controller.enqueue(chunk);
            },
            close() {
            }
          })
        ),
        toolResultsStream.pipeTo(
          new WritableStream({
            write(chunk) {
              controller.enqueue(chunk);
            },
            close() {
              controller.close();
            }
          })
        )
      ]);
    }
  });
}
var originalGenerateId4 = createIdGenerator({
  prefix: "aitxt",
  size: 24
});
var originalGenerateMessageId2 = createIdGenerator({
  prefix: "msg",
  size: 24
});
function streamText({
  model,
  tools: tools2,
  toolChoice,
  system,
  prompt: prompt2,
  messages,
  maxRetries,
  abortSignal,
  headers,
  maxSteps = 1,
  experimental_generateMessageId: generateMessageId = originalGenerateMessageId2,
  experimental_output: output,
  experimental_continueSteps: continueSteps = false,
  experimental_telemetry: telemetry,
  experimental_providerMetadata,
  providerOptions = experimental_providerMetadata,
  experimental_toolCallStreaming = false,
  toolCallStreaming = experimental_toolCallStreaming,
  experimental_activeTools: activeTools,
  experimental_repairToolCall: repairToolCall,
  experimental_transform: transform,
  onChunk,
  onError,
  onFinish,
  onStepFinish,
  _internal: {
    now: now2 = now,
    generateId: generateId3 = originalGenerateId4,
    currentDate = () => /* @__PURE__ */ new Date()
  } = {},
  ...settings
}) {
  return new DefaultStreamTextResult({
    model,
    telemetry,
    headers,
    settings,
    maxRetries,
    abortSignal,
    system,
    prompt: prompt2,
    messages,
    tools: tools2,
    toolChoice,
    toolCallStreaming,
    transforms: asArray(transform),
    activeTools,
    repairToolCall,
    maxSteps,
    output,
    continueSteps,
    providerOptions,
    onChunk,
    onError,
    onFinish,
    onStepFinish,
    now: now2,
    currentDate,
    generateId: generateId3,
    generateMessageId
  });
}
function createOutputTransformStream(output) {
  if (!output) {
    return new TransformStream({
      transform(chunk, controller) {
        controller.enqueue({ part: chunk, partialOutput: void 0 });
      }
    });
  }
  let text2 = "";
  let textChunk = "";
  let lastPublishedJson = "";
  return new TransformStream({
    transform(chunk, controller) {
      if (chunk.type !== "text-delta") {
        controller.enqueue({
          part: chunk,
          partialOutput: void 0
        });
        return;
      }
      text2 += chunk.textDelta;
      textChunk += chunk.textDelta;
      const result = output.parsePartial({ text: text2 });
      if (result != null) {
        const currentJson = JSON.stringify(result.partial);
        if (currentJson !== lastPublishedJson) {
          controller.enqueue({
            part: {
              type: "text-delta",
              textDelta: textChunk
            },
            partialOutput: result.partial
          });
          lastPublishedJson = currentJson;
          textChunk = "";
        }
      }
    },
    flush(controller) {
      if (textChunk.length > 0) {
        controller.enqueue({
          part: {
            type: "text-delta",
            textDelta: textChunk
          },
          partialOutput: void 0
        });
      }
    }
  });
}
var DefaultStreamTextResult = class {
  constructor({
    model,
    telemetry,
    headers,
    settings,
    maxRetries: maxRetriesArg,
    abortSignal,
    system,
    prompt: prompt2,
    messages,
    tools: tools2,
    toolChoice,
    toolCallStreaming,
    transforms,
    activeTools,
    repairToolCall,
    maxSteps,
    output,
    continueSteps,
    providerOptions,
    onChunk,
    onError,
    onFinish,
    onStepFinish,
    now: now2,
    currentDate,
    generateId: generateId3,
    generateMessageId
  }) {
    this.warningsPromise = new DelayedPromise();
    this.usagePromise = new DelayedPromise();
    this.finishReasonPromise = new DelayedPromise();
    this.providerMetadataPromise = new DelayedPromise();
    this.textPromise = new DelayedPromise();
    this.reasoningPromise = new DelayedPromise();
    this.toolCallsPromise = new DelayedPromise();
    this.toolResultsPromise = new DelayedPromise();
    this.requestPromise = new DelayedPromise();
    this.responsePromise = new DelayedPromise();
    this.stepsPromise = new DelayedPromise();
    var _a152;
    if (maxSteps < 1) {
      throw new InvalidArgumentError2({
        parameter: "maxSteps",
        value: maxSteps,
        message: "maxSteps must be at least 1"
      });
    }
    this.output = output;
    let recordedStepText = "";
    let recordedContinuationText = "";
    let recordedFullText = "";
    let recordedReasoningText = void 0;
    const recordedResponse = {
      id: generateId3(),
      timestamp: currentDate(),
      modelId: model.modelId,
      messages: []
    };
    let recordedToolCalls = [];
    let recordedToolResults = [];
    let recordedFinishReason = void 0;
    let recordedUsage = void 0;
    let stepType = "initial";
    const recordedSteps = [];
    let rootSpan;
    const eventProcessor = new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(chunk);
        const { part } = chunk;
        if (part.type === "text-delta" || part.type === "reasoning" || part.type === "tool-call" || part.type === "tool-result" || part.type === "tool-call-streaming-start" || part.type === "tool-call-delta") {
          await (onChunk == null ? void 0 : onChunk({ chunk: part }));
        }
        if (part.type === "error") {
          await (onError == null ? void 0 : onError({ error: part.error }));
        }
        if (part.type === "text-delta") {
          recordedStepText += part.textDelta;
          recordedContinuationText += part.textDelta;
          recordedFullText += part.textDelta;
        }
        if (part.type === "reasoning") {
          recordedReasoningText = (recordedReasoningText != null ? recordedReasoningText : "") + part.textDelta;
        }
        if (part.type === "tool-call") {
          recordedToolCalls.push(part);
        }
        if (part.type === "tool-result") {
          recordedToolResults.push(part);
        }
        if (part.type === "step-finish") {
          const stepMessages = toResponseMessages({
            text: recordedContinuationText,
            tools: tools2 != null ? tools2 : {},
            toolCalls: recordedToolCalls,
            toolResults: recordedToolResults,
            messageId: part.messageId,
            generateMessageId
          });
          const currentStep = recordedSteps.length;
          let nextStepType = "done";
          if (currentStep + 1 < maxSteps) {
            if (continueSteps && part.finishReason === "length" && // only use continue when there are no tool calls:
            recordedToolCalls.length === 0) {
              nextStepType = "continue";
            } else if (
              // there are tool calls:
              recordedToolCalls.length > 0 && // all current tool calls have results:
              recordedToolResults.length === recordedToolCalls.length
            ) {
              nextStepType = "tool-result";
            }
          }
          const currentStepResult = {
            stepType,
            text: recordedStepText,
            reasoning: recordedReasoningText,
            toolCalls: recordedToolCalls,
            toolResults: recordedToolResults,
            finishReason: part.finishReason,
            usage: part.usage,
            warnings: part.warnings,
            logprobs: part.logprobs,
            request: part.request,
            response: {
              ...part.response,
              messages: [...recordedResponse.messages, ...stepMessages]
            },
            experimental_providerMetadata: part.experimental_providerMetadata,
            isContinued: part.isContinued
          };
          await (onStepFinish == null ? void 0 : onStepFinish(currentStepResult));
          recordedSteps.push(currentStepResult);
          recordedToolCalls = [];
          recordedToolResults = [];
          recordedStepText = "";
          if (nextStepType !== "done") {
            stepType = nextStepType;
          }
          if (nextStepType !== "continue") {
            recordedResponse.messages.push(...stepMessages);
            recordedContinuationText = "";
          }
        }
        if (part.type === "finish") {
          recordedResponse.id = part.response.id;
          recordedResponse.timestamp = part.response.timestamp;
          recordedResponse.modelId = part.response.modelId;
          recordedResponse.headers = part.response.headers;
          recordedUsage = part.usage;
          recordedFinishReason = part.finishReason;
        }
      },
      async flush(controller) {
        var _a16;
        try {
          if (recordedSteps.length === 0) {
            return;
          }
          const lastStep = recordedSteps[recordedSteps.length - 1];
          self2.warningsPromise.resolve(lastStep.warnings);
          self2.requestPromise.resolve(lastStep.request);
          self2.responsePromise.resolve(lastStep.response);
          self2.toolCallsPromise.resolve(lastStep.toolCalls);
          self2.toolResultsPromise.resolve(lastStep.toolResults);
          self2.providerMetadataPromise.resolve(
            lastStep.experimental_providerMetadata
          );
          const finishReason = recordedFinishReason != null ? recordedFinishReason : "unknown";
          const usage = recordedUsage != null ? recordedUsage : {
            completionTokens: NaN,
            promptTokens: NaN,
            totalTokens: NaN
          };
          self2.finishReasonPromise.resolve(finishReason);
          self2.usagePromise.resolve(usage);
          self2.textPromise.resolve(recordedFullText);
          self2.reasoningPromise.resolve(recordedReasoningText);
          self2.stepsPromise.resolve(recordedSteps);
          await (onFinish == null ? void 0 : onFinish({
            finishReason,
            logprobs: void 0,
            usage,
            text: recordedFullText,
            reasoning: recordedReasoningText,
            toolCalls: lastStep.toolCalls,
            toolResults: lastStep.toolResults,
            request: (_a16 = lastStep.request) != null ? _a16 : {},
            response: lastStep.response,
            warnings: lastStep.warnings,
            experimental_providerMetadata: lastStep.experimental_providerMetadata,
            steps: recordedSteps
          }));
          rootSpan.setAttributes(
            selectTelemetryAttributes({
              telemetry,
              attributes: {
                "ai.response.finishReason": finishReason,
                "ai.response.text": { output: () => recordedFullText },
                "ai.response.toolCalls": {
                  output: () => {
                    var _a17;
                    return ((_a17 = lastStep.toolCalls) == null ? void 0 : _a17.length) ? JSON.stringify(lastStep.toolCalls) : void 0;
                  }
                },
                "ai.usage.promptTokens": usage.promptTokens,
                "ai.usage.completionTokens": usage.completionTokens
              }
            })
          );
        } catch (error) {
          controller.error(error);
        } finally {
          rootSpan.end();
        }
      }
    });
    const stitchableStream = createStitchableStream();
    this.addStream = stitchableStream.addStream;
    this.closeStream = stitchableStream.close;
    let stream = stitchableStream.stream;
    for (const transform of transforms) {
      stream = stream.pipeThrough(
        transform({
          tools: tools2,
          stopStream() {
            stitchableStream.terminate();
          }
        })
      );
    }
    this.baseStream = stream.pipeThrough(createOutputTransformStream(output)).pipeThrough(eventProcessor);
    const { maxRetries, retry } = prepareRetries({
      maxRetries: maxRetriesArg
    });
    const tracer = getTracer(telemetry);
    const baseTelemetryAttributes = getBaseTelemetryAttributes({
      model,
      telemetry,
      headers,
      settings: { ...settings, maxRetries }
    });
    const initialPrompt = standardizePrompt({
      prompt: {
        system: (_a152 = output == null ? void 0 : output.injectIntoSystemPrompt({ system, model })) != null ? _a152 : system,
        prompt: prompt2,
        messages
      },
      tools: tools2
    });
    const self2 = this;
    recordSpan({
      name: "ai.streamText",
      attributes: selectTelemetryAttributes({
        telemetry,
        attributes: {
          ...assembleOperationName({ operationId: "ai.streamText", telemetry }),
          ...baseTelemetryAttributes,
          // specific settings that only make sense on the outer level:
          "ai.prompt": {
            input: () => JSON.stringify({ system, prompt: prompt2, messages })
          },
          "ai.settings.maxSteps": maxSteps
        }
      }),
      tracer,
      endWhenDone: false,
      fn: async (rootSpanArg) => {
        rootSpan = rootSpanArg;
        async function streamStep({
          currentStep,
          responseMessages,
          usage,
          stepType: stepType2,
          previousStepText,
          hasLeadingWhitespace,
          messageId
        }) {
          var _a16;
          const promptFormat = responseMessages.length === 0 ? initialPrompt.type : "messages";
          const stepInputMessages = [
            ...initialPrompt.messages,
            ...responseMessages
          ];
          const promptMessages = await convertToLanguageModelPrompt({
            prompt: {
              type: promptFormat,
              system: initialPrompt.system,
              messages: stepInputMessages
            },
            modelSupportsImageUrls: model.supportsImageUrls,
            modelSupportsUrl: (_a16 = model.supportsUrl) == null ? void 0 : _a16.bind(model)
            // support 'this' context
          });
          const mode = {
            type: "regular",
            ...prepareToolsAndToolChoice({ tools: tools2, toolChoice, activeTools })
          };
          const {
            result: { stream: stream2, warnings, rawResponse, request },
            doStreamSpan,
            startTimestampMs
          } = await retry(
            () => recordSpan({
              name: "ai.streamText.doStream",
              attributes: selectTelemetryAttributes({
                telemetry,
                attributes: {
                  ...assembleOperationName({
                    operationId: "ai.streamText.doStream",
                    telemetry
                  }),
                  ...baseTelemetryAttributes,
                  "ai.prompt.format": {
                    input: () => promptFormat
                  },
                  "ai.prompt.messages": {
                    input: () => JSON.stringify(promptMessages)
                  },
                  "ai.prompt.tools": {
                    // convert the language model level tools:
                    input: () => {
                      var _a17;
                      return (_a17 = mode.tools) == null ? void 0 : _a17.map((tool2) => JSON.stringify(tool2));
                    }
                  },
                  "ai.prompt.toolChoice": {
                    input: () => mode.toolChoice != null ? JSON.stringify(mode.toolChoice) : void 0
                  },
                  // standardized gen-ai llm span attributes:
                  "gen_ai.system": model.provider,
                  "gen_ai.request.model": model.modelId,
                  "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                  "gen_ai.request.max_tokens": settings.maxTokens,
                  "gen_ai.request.presence_penalty": settings.presencePenalty,
                  "gen_ai.request.stop_sequences": settings.stopSequences,
                  "gen_ai.request.temperature": settings.temperature,
                  "gen_ai.request.top_k": settings.topK,
                  "gen_ai.request.top_p": settings.topP
                }
              }),
              tracer,
              endWhenDone: false,
              fn: async (doStreamSpan2) => ({
                startTimestampMs: now2(),
                // get before the call
                doStreamSpan: doStreamSpan2,
                result: await model.doStream({
                  mode,
                  ...prepareCallSettings(settings),
                  inputFormat: promptFormat,
                  responseFormat: output == null ? void 0 : output.responseFormat({ model }),
                  prompt: promptMessages,
                  providerMetadata: providerOptions,
                  abortSignal,
                  headers
                })
              })
            })
          );
          const transformedStream = runToolsTransformation({
            tools: tools2,
            generatorStream: stream2,
            toolCallStreaming,
            tracer,
            telemetry,
            system,
            messages: stepInputMessages,
            repairToolCall,
            abortSignal
          });
          const stepRequest = request != null ? request : {};
          const stepToolCalls = [];
          const stepToolResults = [];
          let stepFinishReason = "unknown";
          let stepUsage = {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          };
          let stepProviderMetadata;
          let stepFirstChunk = true;
          let stepText = "";
          let stepReasoning = "";
          let fullStepText = stepType2 === "continue" ? previousStepText : "";
          let stepLogProbs;
          let stepResponse = {
            id: generateId3(),
            timestamp: currentDate(),
            modelId: model.modelId
          };
          let chunkBuffer = "";
          let chunkTextPublished = false;
          let inWhitespacePrefix = true;
          let hasWhitespaceSuffix = false;
          async function publishTextChunk({
            controller,
            chunk
          }) {
            controller.enqueue(chunk);
            stepText += chunk.textDelta;
            fullStepText += chunk.textDelta;
            chunkTextPublished = true;
            hasWhitespaceSuffix = chunk.textDelta.trimEnd() !== chunk.textDelta;
          }
          self2.addStream(
            transformedStream.pipeThrough(
              new TransformStream({
                async transform(chunk, controller) {
                  var _a17, _b2, _c2;
                  if (stepFirstChunk) {
                    const msToFirstChunk = now2() - startTimestampMs;
                    stepFirstChunk = false;
                    doStreamSpan.addEvent("ai.stream.firstChunk", {
                      "ai.response.msToFirstChunk": msToFirstChunk
                    });
                    doStreamSpan.setAttributes({
                      "ai.response.msToFirstChunk": msToFirstChunk
                    });
                    controller.enqueue({
                      type: "step-start",
                      messageId,
                      request: stepRequest,
                      warnings: warnings != null ? warnings : []
                    });
                  }
                  if (chunk.type === "text-delta" && chunk.textDelta.length === 0) {
                    return;
                  }
                  const chunkType = chunk.type;
                  switch (chunkType) {
                    case "text-delta": {
                      if (continueSteps) {
                        const trimmedChunkText = inWhitespacePrefix && hasLeadingWhitespace ? chunk.textDelta.trimStart() : chunk.textDelta;
                        if (trimmedChunkText.length === 0) {
                          break;
                        }
                        inWhitespacePrefix = false;
                        chunkBuffer += trimmedChunkText;
                        const split = splitOnLastWhitespace(chunkBuffer);
                        if (split != null) {
                          chunkBuffer = split.suffix;
                          await publishTextChunk({
                            controller,
                            chunk: {
                              type: "text-delta",
                              textDelta: split.prefix + split.whitespace
                            }
                          });
                        }
                      } else {
                        await publishTextChunk({ controller, chunk });
                      }
                      break;
                    }
                    case "reasoning": {
                      controller.enqueue(chunk);
                      stepReasoning += chunk.textDelta;
                      break;
                    }
                    case "tool-call": {
                      controller.enqueue(chunk);
                      stepToolCalls.push(chunk);
                      break;
                    }
                    case "tool-result": {
                      controller.enqueue(chunk);
                      stepToolResults.push(chunk);
                      break;
                    }
                    case "response-metadata": {
                      stepResponse = {
                        id: (_a17 = chunk.id) != null ? _a17 : stepResponse.id,
                        timestamp: (_b2 = chunk.timestamp) != null ? _b2 : stepResponse.timestamp,
                        modelId: (_c2 = chunk.modelId) != null ? _c2 : stepResponse.modelId
                      };
                      break;
                    }
                    case "finish": {
                      stepUsage = chunk.usage;
                      stepFinishReason = chunk.finishReason;
                      stepProviderMetadata = chunk.experimental_providerMetadata;
                      stepLogProbs = chunk.logprobs;
                      const msToFinish = now2() - startTimestampMs;
                      doStreamSpan.addEvent("ai.stream.finish");
                      doStreamSpan.setAttributes({
                        "ai.response.msToFinish": msToFinish,
                        "ai.response.avgCompletionTokensPerSecond": 1e3 * stepUsage.completionTokens / msToFinish
                      });
                      break;
                    }
                    case "tool-call-streaming-start":
                    case "tool-call-delta": {
                      controller.enqueue(chunk);
                      break;
                    }
                    case "error": {
                      controller.enqueue(chunk);
                      stepFinishReason = "error";
                      break;
                    }
                    default: {
                      const exhaustiveCheck = chunkType;
                      throw new Error(`Unknown chunk type: ${exhaustiveCheck}`);
                    }
                  }
                },
                // invoke onFinish callback and resolve toolResults promise when the stream is about to close:
                async flush(controller) {
                  const stepToolCallsJson = stepToolCalls.length > 0 ? JSON.stringify(stepToolCalls) : void 0;
                  let nextStepType = "done";
                  if (currentStep + 1 < maxSteps) {
                    if (continueSteps && stepFinishReason === "length" && // only use continue when there are no tool calls:
                    stepToolCalls.length === 0) {
                      nextStepType = "continue";
                    } else if (
                      // there are tool calls:
                      stepToolCalls.length > 0 && // all current tool calls have results:
                      stepToolResults.length === stepToolCalls.length
                    ) {
                      nextStepType = "tool-result";
                    }
                  }
                  if (continueSteps && chunkBuffer.length > 0 && (nextStepType !== "continue" || // when the next step is a regular step, publish the buffer
                  stepType2 === "continue" && !chunkTextPublished)) {
                    await publishTextChunk({
                      controller,
                      chunk: {
                        type: "text-delta",
                        textDelta: chunkBuffer
                      }
                    });
                    chunkBuffer = "";
                  }
                  try {
                    doStreamSpan.setAttributes(
                      selectTelemetryAttributes({
                        telemetry,
                        attributes: {
                          "ai.response.finishReason": stepFinishReason,
                          "ai.response.text": { output: () => stepText },
                          "ai.response.toolCalls": {
                            output: () => stepToolCallsJson
                          },
                          "ai.response.id": stepResponse.id,
                          "ai.response.model": stepResponse.modelId,
                          "ai.response.timestamp": stepResponse.timestamp.toISOString(),
                          "ai.usage.promptTokens": stepUsage.promptTokens,
                          "ai.usage.completionTokens": stepUsage.completionTokens,
                          // standardized gen-ai llm span attributes:
                          "gen_ai.response.finish_reasons": [stepFinishReason],
                          "gen_ai.response.id": stepResponse.id,
                          "gen_ai.response.model": stepResponse.modelId,
                          "gen_ai.usage.input_tokens": stepUsage.promptTokens,
                          "gen_ai.usage.output_tokens": stepUsage.completionTokens
                        }
                      })
                    );
                  } catch (error) {
                  } finally {
                    doStreamSpan.end();
                  }
                  controller.enqueue({
                    type: "step-finish",
                    finishReason: stepFinishReason,
                    usage: stepUsage,
                    experimental_providerMetadata: stepProviderMetadata,
                    logprobs: stepLogProbs,
                    request: stepRequest,
                    response: {
                      ...stepResponse,
                      headers: rawResponse == null ? void 0 : rawResponse.headers
                    },
                    warnings,
                    isContinued: nextStepType === "continue",
                    messageId
                  });
                  const combinedUsage = addLanguageModelUsage(usage, stepUsage);
                  if (nextStepType === "done") {
                    controller.enqueue({
                      type: "finish",
                      finishReason: stepFinishReason,
                      usage: combinedUsage,
                      experimental_providerMetadata: stepProviderMetadata,
                      logprobs: stepLogProbs,
                      response: {
                        ...stepResponse,
                        headers: rawResponse == null ? void 0 : rawResponse.headers
                      }
                    });
                    self2.closeStream();
                  } else {
                    if (stepType2 === "continue") {
                      const lastMessage = responseMessages[responseMessages.length - 1];
                      if (typeof lastMessage.content === "string") {
                        lastMessage.content += stepText;
                      } else {
                        lastMessage.content.push({
                          text: stepText,
                          type: "text"
                        });
                      }
                    } else {
                      responseMessages.push(
                        ...toResponseMessages({
                          text: stepText,
                          tools: tools2 != null ? tools2 : {},
                          toolCalls: stepToolCalls,
                          toolResults: stepToolResults,
                          messageId,
                          generateMessageId
                        })
                      );
                    }
                    await streamStep({
                      currentStep: currentStep + 1,
                      responseMessages,
                      usage: combinedUsage,
                      stepType: nextStepType,
                      previousStepText: fullStepText,
                      hasLeadingWhitespace: hasWhitespaceSuffix,
                      messageId: (
                        // keep the same id when continuing a step:
                        nextStepType === "continue" ? messageId : generateMessageId()
                      )
                    });
                  }
                }
              })
            )
          );
        }
        await streamStep({
          currentStep: 0,
          responseMessages: [],
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          },
          previousStepText: "",
          stepType: "initial",
          hasLeadingWhitespace: false,
          messageId: generateMessageId()
        });
      }
    }).catch((error) => {
      self2.addStream(
        new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "error", error });
            controller.close();
          }
        })
      );
      self2.closeStream();
    });
  }
  get warnings() {
    return this.warningsPromise.value;
  }
  get usage() {
    return this.usagePromise.value;
  }
  get finishReason() {
    return this.finishReasonPromise.value;
  }
  get experimental_providerMetadata() {
    return this.providerMetadataPromise.value;
  }
  get text() {
    return this.textPromise.value;
  }
  get reasoning() {
    return this.reasoningPromise.value;
  }
  get toolCalls() {
    return this.toolCallsPromise.value;
  }
  get toolResults() {
    return this.toolResultsPromise.value;
  }
  get request() {
    return this.requestPromise.value;
  }
  get response() {
    return this.responsePromise.value;
  }
  get steps() {
    return this.stepsPromise.value;
  }
  /**
  Split out a new stream from the original stream.
  The original stream is replaced to allow for further splitting,
  since we do not know how many times the stream will be split.
  
  Note: this leads to buffering the stream content on the server.
  However, the LLM results are expected to be small enough to not cause issues.
     */
  teeStream() {
    const [stream1, stream2] = this.baseStream.tee();
    this.baseStream = stream2;
    return stream1;
  }
  get textStream() {
    return createAsyncIterableStream(
      this.teeStream().pipeThrough(
        new TransformStream({
          transform({ part }, controller) {
            if (part.type === "text-delta") {
              controller.enqueue(part.textDelta);
            }
          }
        })
      )
    );
  }
  get fullStream() {
    return createAsyncIterableStream(
      this.teeStream().pipeThrough(
        new TransformStream({
          transform({ part }, controller) {
            controller.enqueue(part);
          }
        })
      )
    );
  }
  async consumeStream() {
    const stream = this.fullStream;
    for await (const part of stream) {
    }
  }
  get experimental_partialOutputStream() {
    if (this.output == null) {
      throw new NoOutputSpecifiedError();
    }
    return createAsyncIterableStream(
      this.teeStream().pipeThrough(
        new TransformStream({
          transform({ partialOutput }, controller) {
            if (partialOutput != null) {
              controller.enqueue(partialOutput);
            }
          }
        })
      )
    );
  }
  toDataStreamInternal({
    getErrorMessage: getErrorMessage5 = () => "An error occurred.",
    // mask error messages for safety by default
    sendUsage = true,
    sendReasoning = false
  }) {
    let aggregatedResponse = "";
    const callbackTransformer = new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(chunk);
        if (chunk.type === "text-delta") {
          aggregatedResponse += chunk.textDelta;
        }
      }
    });
    const streamPartsTransformer = new TransformStream({
      transform: async (chunk, controller) => {
        const chunkType = chunk.type;
        switch (chunkType) {
          case "text-delta": {
            controller.enqueue(formatDataStreamPart("text", chunk.textDelta));
            break;
          }
          case "reasoning": {
            if (sendReasoning) {
              controller.enqueue(
                formatDataStreamPart("reasoning", chunk.textDelta)
              );
            }
            break;
          }
          case "tool-call-streaming-start": {
            controller.enqueue(
              formatDataStreamPart("tool_call_streaming_start", {
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName
              })
            );
            break;
          }
          case "tool-call-delta": {
            controller.enqueue(
              formatDataStreamPart("tool_call_delta", {
                toolCallId: chunk.toolCallId,
                argsTextDelta: chunk.argsTextDelta
              })
            );
            break;
          }
          case "tool-call": {
            controller.enqueue(
              formatDataStreamPart("tool_call", {
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName,
                args: chunk.args
              })
            );
            break;
          }
          case "tool-result": {
            controller.enqueue(
              formatDataStreamPart("tool_result", {
                toolCallId: chunk.toolCallId,
                result: chunk.result
              })
            );
            break;
          }
          case "error": {
            controller.enqueue(
              formatDataStreamPart("error", getErrorMessage5(chunk.error))
            );
            break;
          }
          case "step-start": {
            controller.enqueue(
              formatDataStreamPart("start_step", {
                messageId: chunk.messageId
              })
            );
            break;
          }
          case "step-finish": {
            controller.enqueue(
              formatDataStreamPart("finish_step", {
                finishReason: chunk.finishReason,
                usage: sendUsage ? {
                  promptTokens: chunk.usage.promptTokens,
                  completionTokens: chunk.usage.completionTokens
                } : void 0,
                isContinued: chunk.isContinued
              })
            );
            break;
          }
          case "finish": {
            controller.enqueue(
              formatDataStreamPart("finish_message", {
                finishReason: chunk.finishReason,
                usage: sendUsage ? {
                  promptTokens: chunk.usage.promptTokens,
                  completionTokens: chunk.usage.completionTokens
                } : void 0
              })
            );
            break;
          }
          default: {
            const exhaustiveCheck = chunkType;
            throw new Error(`Unknown chunk type: ${exhaustiveCheck}`);
          }
        }
      }
    });
    return this.fullStream.pipeThrough(callbackTransformer).pipeThrough(streamPartsTransformer);
  }
  pipeDataStreamToResponse(response, {
    status,
    statusText,
    headers,
    data,
    getErrorMessage: getErrorMessage5,
    sendUsage,
    sendReasoning
  } = {}) {
    writeToServerResponse({
      response,
      status,
      statusText,
      headers: prepareOutgoingHttpHeaders(headers, {
        contentType: "text/plain; charset=utf-8",
        dataStreamVersion: "v1"
      }),
      stream: this.toDataStream({
        data,
        getErrorMessage: getErrorMessage5,
        sendUsage,
        sendReasoning
      })
    });
  }
  pipeTextStreamToResponse(response, init) {
    writeToServerResponse({
      response,
      status: init == null ? void 0 : init.status,
      statusText: init == null ? void 0 : init.statusText,
      headers: prepareOutgoingHttpHeaders(init == null ? void 0 : init.headers, {
        contentType: "text/plain; charset=utf-8"
      }),
      stream: this.textStream.pipeThrough(new TextEncoderStream())
    });
  }
  // TODO breaking change 5.0: remove pipeThrough(new TextEncoderStream())
  toDataStream(options) {
    const stream = this.toDataStreamInternal({
      getErrorMessage: options == null ? void 0 : options.getErrorMessage,
      sendUsage: options == null ? void 0 : options.sendUsage,
      sendReasoning: options == null ? void 0 : options.sendReasoning
    }).pipeThrough(new TextEncoderStream());
    return (options == null ? void 0 : options.data) ? mergeStreams(options == null ? void 0 : options.data.stream, stream) : stream;
  }
  mergeIntoDataStream(writer, options) {
    writer.merge(
      this.toDataStreamInternal({
        getErrorMessage: writer.onError,
        sendUsage: options == null ? void 0 : options.sendUsage,
        sendReasoning: options == null ? void 0 : options.sendReasoning
      })
    );
  }
  toDataStreamResponse({
    headers,
    status,
    statusText,
    data,
    getErrorMessage: getErrorMessage5,
    sendUsage,
    sendReasoning
  } = {}) {
    return new Response(
      this.toDataStream({ data, getErrorMessage: getErrorMessage5, sendUsage, sendReasoning }),
      {
        status,
        statusText,
        headers: prepareResponseHeaders(headers, {
          contentType: "text/plain; charset=utf-8",
          dataStreamVersion: "v1"
        })
      }
    );
  }
  toTextStreamResponse(init) {
    var _a152;
    return new Response(this.textStream.pipeThrough(new TextEncoderStream()), {
      status: (_a152 = init == null ? void 0 : init.status) != null ? _a152 : 200,
      headers: prepareResponseHeaders(init == null ? void 0 : init.headers, {
        contentType: "text/plain; charset=utf-8"
      })
    });
  }
};
var wrapLanguageModel = ({
  model,
  middleware: middlewareArg,
  modelId,
  providerId
}) => {
  return asArray(middlewareArg).reverse().reduce((wrappedModel, middleware) => {
    return doWrap({ model: wrappedModel, middleware, modelId, providerId });
  }, model);
};
var doWrap = ({
  model,
  middleware: { transformParams, wrapGenerate, wrapStream },
  modelId,
  providerId
}) => {
  var _a152;
  async function doTransform({
    params,
    type: type2
  }) {
    return transformParams ? await transformParams({ params, type: type2 }) : params;
  }
  return {
    specificationVersion: "v1",
    provider: providerId != null ? providerId : model.provider,
    modelId: modelId != null ? modelId : model.modelId,
    defaultObjectGenerationMode: model.defaultObjectGenerationMode,
    supportsImageUrls: model.supportsImageUrls,
    supportsUrl: (_a152 = model.supportsUrl) == null ? void 0 : _a152.bind(model),
    supportsStructuredOutputs: model.supportsStructuredOutputs,
    async doGenerate(params) {
      const transformedParams = await doTransform({ params, type: "generate" });
      const doGenerate = async () => model.doGenerate(transformedParams);
      return wrapGenerate ? wrapGenerate({ doGenerate, params: transformedParams, model }) : doGenerate();
    },
    async doStream(params) {
      const transformedParams = await doTransform({ params, type: "stream" });
      const doStream = async () => model.doStream(transformedParams);
      return wrapStream ? wrapStream({ doStream, params: transformedParams, model }) : doStream();
    }
  };
};
function tool(tool2) {
  return tool2;
}
function cosineSimilarity(vector1, vector2, options = {
  throwErrorForEmptyVectors: false
}) {
  const { throwErrorForEmptyVectors } = options;
  if (vector1.length !== vector2.length) {
    throw new Error(
      `Vectors must have the same length (vector1: ${vector1.length} elements, vector2: ${vector2.length} elements)`
    );
  }
  if (throwErrorForEmptyVectors && vector1.length === 0) {
    throw new InvalidArgumentError2({
      parameter: "vector1",
      value: vector1,
      message: "Vectors cannot be empty"
    });
  }
  const magnitude1 = magnitude(vector1);
  const magnitude2 = magnitude(vector2);
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  return dotProduct(vector1, vector2) / (magnitude1 * magnitude2);
}
function dotProduct(vector1, vector2) {
  return vector1.reduce(
    (accumulator, value, index2) => accumulator + value * vector2[index2],
    0
  );
}
function magnitude(vector) {
  return Math.sqrt(dotProduct(vector, vector));
}
var langchain_adapter_exports = {};
__export(langchain_adapter_exports, {
  mergeIntoDataStream: () => mergeIntoDataStream,
  toDataStream: () => toDataStream,
  toDataStreamResponse: () => toDataStreamResponse
});
function createCallbacksTransformer(callbacks = {}) {
  const textEncoder = new TextEncoder();
  let aggregatedResponse = "";
  return new TransformStream({
    async start() {
      if (callbacks.onStart)
        await callbacks.onStart();
    },
    async transform(message, controller) {
      controller.enqueue(textEncoder.encode(message));
      aggregatedResponse += message;
      if (callbacks.onToken)
        await callbacks.onToken(message);
      if (callbacks.onText && typeof message === "string") {
        await callbacks.onText(message);
      }
    },
    async flush() {
      if (callbacks.onCompletion) {
        await callbacks.onCompletion(aggregatedResponse);
      }
      if (callbacks.onFinal) {
        await callbacks.onFinal(aggregatedResponse);
      }
    }
  });
}
function toDataStreamInternal(stream, callbacks) {
  return stream.pipeThrough(
    new TransformStream({
      transform: async (value, controller) => {
        var _a152;
        if (typeof value === "string") {
          controller.enqueue(value);
          return;
        }
        if ("event" in value) {
          if (value.event === "on_chat_model_stream") {
            forwardAIMessageChunk(
              (_a152 = value.data) == null ? void 0 : _a152.chunk,
              controller
            );
          }
          return;
        }
        forwardAIMessageChunk(value, controller);
      }
    })
  ).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(new TextDecoderStream()).pipeThrough(
    new TransformStream({
      transform: async (chunk, controller) => {
        controller.enqueue(formatDataStreamPart("text", chunk));
      }
    })
  );
}
function toDataStream(stream, callbacks) {
  return toDataStreamInternal(stream, callbacks).pipeThrough(
    new TextEncoderStream()
  );
}
function toDataStreamResponse(stream, options) {
  var _a152;
  const dataStream = toDataStreamInternal(
    stream,
    options == null ? void 0 : options.callbacks
  ).pipeThrough(new TextEncoderStream());
  const data = options == null ? void 0 : options.data;
  const init = options == null ? void 0 : options.init;
  const responseStream = data ? mergeStreams(data.stream, dataStream) : dataStream;
  return new Response(responseStream, {
    status: (_a152 = init == null ? void 0 : init.status) != null ? _a152 : 200,
    statusText: init == null ? void 0 : init.statusText,
    headers: prepareResponseHeaders(init == null ? void 0 : init.headers, {
      contentType: "text/plain; charset=utf-8",
      dataStreamVersion: "v1"
    })
  });
}
function mergeIntoDataStream(stream, options) {
  options.dataStream.merge(toDataStreamInternal(stream, options.callbacks));
}
function forwardAIMessageChunk(chunk, controller) {
  if (typeof chunk.content === "string") {
    controller.enqueue(chunk.content);
  } else {
    const content = chunk.content;
    for (const item of content) {
      if (item.type === "text") {
        controller.enqueue(item.text);
      }
    }
  }
}
var llamaindex_adapter_exports = {};
__export(llamaindex_adapter_exports, {
  mergeIntoDataStream: () => mergeIntoDataStream2,
  toDataStream: () => toDataStream2,
  toDataStreamResponse: () => toDataStreamResponse2
});
function toDataStreamInternal2(stream, callbacks) {
  const trimStart = trimStartOfStream();
  return convertAsyncIteratorToReadableStream(stream[Symbol.asyncIterator]()).pipeThrough(
    new TransformStream({
      async transform(message, controller) {
        controller.enqueue(trimStart(message.delta));
      }
    })
  ).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(new TextDecoderStream()).pipeThrough(
    new TransformStream({
      transform: async (chunk, controller) => {
        controller.enqueue(formatDataStreamPart("text", chunk));
      }
    })
  );
}
function toDataStream2(stream, callbacks) {
  return toDataStreamInternal2(stream, callbacks).pipeThrough(
    new TextEncoderStream()
  );
}
function toDataStreamResponse2(stream, options = {}) {
  var _a152;
  const { init, data, callbacks } = options;
  const dataStream = toDataStreamInternal2(stream, callbacks).pipeThrough(
    new TextEncoderStream()
  );
  const responseStream = data ? mergeStreams(data.stream, dataStream) : dataStream;
  return new Response(responseStream, {
    status: (_a152 = init == null ? void 0 : init.status) != null ? _a152 : 200,
    statusText: init == null ? void 0 : init.statusText,
    headers: prepareResponseHeaders(init == null ? void 0 : init.headers, {
      contentType: "text/plain; charset=utf-8",
      dataStreamVersion: "v1"
    })
  });
}
function mergeIntoDataStream2(stream, options) {
  options.dataStream.merge(toDataStreamInternal2(stream, options.callbacks));
}
function trimStartOfStream() {
  let isStreamStart = true;
  return (text2) => {
    if (isStreamStart) {
      text2 = text2.trimStart();
      if (text2)
        isStreamStart = false;
    }
    return text2;
  };
}
var anthropicErrorDataSchema = z.object({
  type: z.literal("error"),
  error: z.object({
    type: z.string(),
    message: z.string()
  })
});
var anthropicFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: anthropicErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function convertToAnthropicMessagesPrompt({
  prompt: prompt2
}) {
  var _a16, _b2, _c2, _d2;
  const betas = /* @__PURE__ */ new Set();
  const blocks = groupIntoBlocks(prompt2);
  let system = void 0;
  const messages = [];
  function getCacheControl(providerMetadata) {
    var _a22;
    const anthropic2 = providerMetadata == null ? void 0 : providerMetadata.anthropic;
    const cacheControlValue = (_a22 = anthropic2 == null ? void 0 : anthropic2.cacheControl) != null ? _a22 : anthropic2 == null ? void 0 : anthropic2.cache_control;
    return cacheControlValue;
  }
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isLastBlock = i === blocks.length - 1;
    const type2 = block.type;
    switch (type2) {
      case "system": {
        if (system != null) {
          throw new UnsupportedFunctionalityError({
            functionality: "Multiple system messages that are separated by user/assistant messages"
          });
        }
        system = block.messages.map(({ content, providerMetadata }) => ({
          type: "text",
          text: content,
          cache_control: getCacheControl(providerMetadata)
        }));
        break;
      }
      case "user": {
        const anthropicContent = [];
        for (const message of block.messages) {
          const { role, content } = message;
          switch (role) {
            case "user": {
              for (let j = 0; j < content.length; j++) {
                const part = content[j];
                const isLastPart = j === content.length - 1;
                const cacheControl = (_a16 = getCacheControl(part.providerMetadata)) != null ? _a16 : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                switch (part.type) {
                  case "text": {
                    anthropicContent.push({
                      type: "text",
                      text: part.text,
                      cache_control: cacheControl
                    });
                    break;
                  }
                  case "image": {
                    if (part.image instanceof URL) {
                      throw new UnsupportedFunctionalityError({
                        functionality: "Image URLs in user messages"
                      });
                    }
                    anthropicContent.push({
                      type: "image",
                      source: {
                        type: "base64",
                        media_type: (_b2 = part.mimeType) != null ? _b2 : "image/jpeg",
                        data: convertUint8ArrayToBase64(part.image)
                      },
                      cache_control: cacheControl
                    });
                    break;
                  }
                  case "file": {
                    if (part.data instanceof URL) {
                      throw new UnsupportedFunctionalityError({
                        functionality: "Image URLs in user messages"
                      });
                    }
                    if (part.mimeType !== "application/pdf") {
                      throw new UnsupportedFunctionalityError({
                        functionality: "Non-PDF files in user messages"
                      });
                    }
                    betas.add("pdfs-2024-09-25");
                    anthropicContent.push({
                      type: "document",
                      source: {
                        type: "base64",
                        media_type: "application/pdf",
                        data: part.data
                      },
                      cache_control: cacheControl
                    });
                    break;
                  }
                }
              }
              break;
            }
            case "tool": {
              for (let i2 = 0; i2 < content.length; i2++) {
                const part = content[i2];
                const isLastPart = i2 === content.length - 1;
                const cacheControl = (_c2 = getCacheControl(part.providerMetadata)) != null ? _c2 : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                const toolResultContent = part.content != null ? part.content.map((part2) => {
                  var _a22;
                  switch (part2.type) {
                    case "text":
                      return {
                        type: "text",
                        text: part2.text,
                        cache_control: void 0
                      };
                    case "image":
                      return {
                        type: "image",
                        source: {
                          type: "base64",
                          media_type: (_a22 = part2.mimeType) != null ? _a22 : "image/jpeg",
                          data: part2.data
                        },
                        cache_control: void 0
                      };
                  }
                }) : JSON.stringify(part.result);
                anthropicContent.push({
                  type: "tool_result",
                  tool_use_id: part.toolCallId,
                  content: toolResultContent,
                  is_error: part.isError,
                  cache_control: cacheControl
                });
              }
              break;
            }
            default: {
              const _exhaustiveCheck = role;
              throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({ role: "user", content: anthropicContent });
        break;
      }
      case "assistant": {
        const anthropicContent = [];
        for (let j = 0; j < block.messages.length; j++) {
          const message = block.messages[j];
          const isLastMessage = j === block.messages.length - 1;
          const { content } = message;
          for (let k = 0; k < content.length; k++) {
            const part = content[k];
            const isLastContentPart = k === content.length - 1;
            const cacheControl = (_d2 = getCacheControl(part.providerMetadata)) != null ? _d2 : isLastContentPart ? getCacheControl(message.providerMetadata) : void 0;
            switch (part.type) {
              case "text": {
                anthropicContent.push({
                  type: "text",
                  text: (
                    // trim the last text part if it's the last message in the block
                    // because Anthropic does not allow trailing whitespace
                    // in pre-filled assistant responses
                    isLastBlock && isLastMessage && isLastContentPart ? part.text.trim() : part.text
                  ),
                  cache_control: cacheControl
                });
                break;
              }
              case "tool-call": {
                anthropicContent.push({
                  type: "tool_use",
                  id: part.toolCallId,
                  name: part.toolName,
                  input: part.args,
                  cache_control: cacheControl
                });
                break;
              }
            }
          }
        }
        messages.push({ role: "assistant", content: anthropicContent });
        break;
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  return {
    prompt: { system, messages },
    betas
  };
}
function groupIntoBlocks(prompt2) {
  const blocks = [];
  let currentBlock = void 0;
  for (const message of prompt2) {
    const { role } = message;
    switch (role) {
      case "system": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "system") {
          currentBlock = { type: "system", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "assistant": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "assistant") {
          currentBlock = { type: "assistant", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "user": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "tool": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return blocks;
}
function mapAnthropicStopReason(finishReason) {
  switch (finishReason) {
    case "end_turn":
    case "stop_sequence":
      return "stop";
    case "tool_use":
      return "tool-calls";
    case "max_tokens":
      return "length";
    default:
      return "unknown";
  }
}
function prepareTools$6(mode) {
  var _a16;
  const tools2 = ((_a16 = mode.tools) == null ? void 0 : _a16.length) ? mode.tools : void 0;
  const toolWarnings = [];
  const betas = /* @__PURE__ */ new Set();
  if (tools2 == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings, betas };
  }
  const anthropicTools2 = [];
  for (const tool2 of tools2) {
    switch (tool2.type) {
      case "function":
        anthropicTools2.push({
          name: tool2.name,
          description: tool2.description,
          input_schema: tool2.parameters
        });
        break;
      case "provider-defined":
        betas.add("computer-use-2024-10-22");
        switch (tool2.id) {
          case "anthropic.computer_20241022":
            anthropicTools2.push({
              name: tool2.name,
              type: "computer_20241022",
              display_width_px: tool2.args.displayWidthPx,
              display_height_px: tool2.args.displayHeightPx,
              display_number: tool2.args.displayNumber
            });
            break;
          case "anthropic.text_editor_20241022":
            anthropicTools2.push({
              name: tool2.name,
              type: "text_editor_20241022"
            });
            break;
          case "anthropic.bash_20241022":
            anthropicTools2.push({
              name: tool2.name,
              type: "bash_20241022"
            });
            break;
          default:
            toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
            break;
        }
        break;
      default:
        toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
        break;
    }
  }
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return {
      tools: anthropicTools2,
      tool_choice: void 0,
      toolWarnings,
      betas
    };
  }
  const type2 = toolChoice.type;
  switch (type2) {
    case "auto":
      return {
        tools: anthropicTools2,
        tool_choice: { type: "auto" },
        toolWarnings,
        betas
      };
    case "required":
      return {
        tools: anthropicTools2,
        tool_choice: { type: "any" },
        toolWarnings,
        betas
      };
    case "none":
      return { tools: void 0, tool_choice: void 0, toolWarnings, betas };
    case "tool":
      return {
        tools: anthropicTools2,
        tool_choice: { type: "tool", name: toolChoice.toolName },
        toolWarnings,
        betas
      };
    default: {
      const _exhaustiveCheck = type2;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var AnthropicMessagesLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "tool";
    this.supportsImageUrls = false;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    mode,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed
  }) {
    const type2 = mode.type;
    const warnings = [];
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: messagesPrompt, betas: messagesBetas } = convertToAnthropicMessagesPrompt({
      prompt: prompt2
    });
    const baseArgs = {
      // model id:
      model: this.modelId,
      // standardized settings:
      max_tokens: maxTokens != null ? maxTokens : 4096,
      // 4096: max model output tokens TODO remove
      temperature,
      top_k: topK,
      top_p: topP,
      stop_sequences: stopSequences,
      // prompt:
      system: messagesPrompt.system,
      messages: messagesPrompt.messages
    };
    switch (type2) {
      case "regular": {
        const {
          tools: tools2,
          tool_choice,
          toolWarnings,
          betas: toolsBetas
        } = prepareTools$6(mode);
        return {
          args: { ...baseArgs, tools: tools2, tool_choice },
          warnings: [...warnings, ...toolWarnings],
          betas: /* @__PURE__ */ new Set([...messagesBetas, ...toolsBetas])
        };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "json-mode object generation"
        });
      }
      case "object-tool": {
        const { name: name14, description, parameters } = mode.tool;
        return {
          args: {
            ...baseArgs,
            tools: [{ name: name14, description, input_schema: parameters }],
            tool_choice: { type: "tool", name: name14 }
          },
          warnings,
          betas: messagesBetas
        };
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async getHeaders({
    betas,
    headers
  }) {
    return combineHeaders(
      await resolve(this.config.headers),
      betas.size > 0 ? { "anthropic-beta": Array.from(betas).join(",") } : {},
      headers
    );
  }
  buildRequestUrl(isStreaming) {
    var _a16, _b2, _c2;
    return (_c2 = (_b2 = (_a16 = this.config).buildRequestUrl) == null ? void 0 : _b2.call(_a16, this.config.baseURL, isStreaming)) != null ? _c2 : `${this.config.baseURL}/messages`;
  }
  transformRequestBody(args) {
    var _a16, _b2, _c2;
    return (_c2 = (_b2 = (_a16 = this.config).transformRequestBody) == null ? void 0 : _b2.call(_a16, args)) != null ? _c2 : args;
  }
  async doGenerate(options) {
    var _a16, _b2, _c2, _d2;
    const { args, warnings, betas } = await this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.buildRequestUrl(false),
      headers: await this.getHeaders({ betas, headers: options.headers }),
      body: this.transformRequestBody(args),
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        anthropicMessagesResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let text2 = "";
    for (const content of response.content) {
      if (content.type === "text") {
        text2 += content.text;
      }
    }
    let toolCalls = void 0;
    if (response.content.some((content) => content.type === "tool_use")) {
      toolCalls = [];
      for (const content of response.content) {
        if (content.type === "tool_use") {
          toolCalls.push({
            toolCallType: "function",
            toolCallId: content.id,
            toolName: content.name,
            args: JSON.stringify(content.input)
          });
        }
      }
    }
    return {
      text: text2,
      toolCalls,
      finishReason: mapAnthropicStopReason(response.stop_reason),
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: {
        id: (_a16 = response.id) != null ? _a16 : void 0,
        modelId: (_b2 = response.model) != null ? _b2 : void 0
      },
      warnings,
      providerMetadata: {
        anthropic: {
          cacheCreationInputTokens: (_c2 = response.usage.cache_creation_input_tokens) != null ? _c2 : null,
          cacheReadInputTokens: (_d2 = response.usage.cache_read_input_tokens) != null ? _d2 : null
        }
      },
      request: { body: JSON.stringify(args) }
    };
  }
  async doStream(options) {
    const { args, warnings, betas } = await this.getArgs(options);
    const body = { ...args, stream: true };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.buildRequestUrl(true),
      headers: await this.getHeaders({ betas, headers: options.headers }),
      body: this.transformRequestBody(body),
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        anthropicMessagesChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    const usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    const toolCallContentBlocks = {};
    let providerMetadata = void 0;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a16, _b2, _c2, _d2;
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            switch (value.type) {
              case "ping": {
                return;
              }
              case "content_block_start": {
                const contentBlockType = value.content_block.type;
                switch (contentBlockType) {
                  case "text": {
                    return;
                  }
                  case "tool_use": {
                    toolCallContentBlocks[value.index] = {
                      toolCallId: value.content_block.id,
                      toolName: value.content_block.name,
                      jsonText: ""
                    };
                    return;
                  }
                  default: {
                    const _exhaustiveCheck = contentBlockType;
                    throw new Error(
                      `Unsupported content block type: ${_exhaustiveCheck}`
                    );
                  }
                }
              }
              case "content_block_stop": {
                if (toolCallContentBlocks[value.index] != null) {
                  const contentBlock = toolCallContentBlocks[value.index];
                  controller.enqueue({
                    type: "tool-call",
                    toolCallType: "function",
                    toolCallId: contentBlock.toolCallId,
                    toolName: contentBlock.toolName,
                    args: contentBlock.jsonText
                  });
                  delete toolCallContentBlocks[value.index];
                }
                return;
              }
              case "content_block_delta": {
                const deltaType = value.delta.type;
                switch (deltaType) {
                  case "text_delta": {
                    controller.enqueue({
                      type: "text-delta",
                      textDelta: value.delta.text
                    });
                    return;
                  }
                  case "input_json_delta": {
                    const contentBlock = toolCallContentBlocks[value.index];
                    controller.enqueue({
                      type: "tool-call-delta",
                      toolCallType: "function",
                      toolCallId: contentBlock.toolCallId,
                      toolName: contentBlock.toolName,
                      argsTextDelta: value.delta.partial_json
                    });
                    contentBlock.jsonText += value.delta.partial_json;
                    return;
                  }
                  default: {
                    const _exhaustiveCheck = deltaType;
                    throw new Error(
                      `Unsupported delta type: ${_exhaustiveCheck}`
                    );
                  }
                }
              }
              case "message_start": {
                usage.promptTokens = value.message.usage.input_tokens;
                usage.completionTokens = value.message.usage.output_tokens;
                providerMetadata = {
                  anthropic: {
                    cacheCreationInputTokens: (_a16 = value.message.usage.cache_creation_input_tokens) != null ? _a16 : null,
                    cacheReadInputTokens: (_b2 = value.message.usage.cache_read_input_tokens) != null ? _b2 : null
                  }
                };
                controller.enqueue({
                  type: "response-metadata",
                  id: (_c2 = value.message.id) != null ? _c2 : void 0,
                  modelId: (_d2 = value.message.model) != null ? _d2 : void 0
                });
                return;
              }
              case "message_delta": {
                usage.completionTokens = value.usage.output_tokens;
                finishReason = mapAnthropicStopReason(value.delta.stop_reason);
                return;
              }
              case "message_stop": {
                controller.enqueue({
                  type: "finish",
                  finishReason,
                  usage,
                  providerMetadata
                });
                return;
              }
              case "error": {
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              default: {
                const _exhaustiveCheck = value;
                throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
              }
            }
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body: JSON.stringify(body) }
    };
  }
};
var anthropicMessagesResponseSchema = z.object({
  type: z.literal("message"),
  id: z.string().nullish(),
  model: z.string().nullish(),
  content: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("text"),
        text: z.string()
      }),
      z.object({
        type: z.literal("tool_use"),
        id: z.string(),
        name: z.string(),
        input: z.unknown()
      })
    ])
  ),
  stop_reason: z.string().nullish(),
  usage: z.object({
    input_tokens: z.number(),
    output_tokens: z.number(),
    cache_creation_input_tokens: z.number().nullish(),
    cache_read_input_tokens: z.number().nullish()
  })
});
var anthropicMessagesChunkSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("message_start"),
    message: z.object({
      id: z.string().nullish(),
      model: z.string().nullish(),
      usage: z.object({
        input_tokens: z.number(),
        output_tokens: z.number(),
        cache_creation_input_tokens: z.number().nullish(),
        cache_read_input_tokens: z.number().nullish()
      })
    })
  }),
  z.object({
    type: z.literal("content_block_start"),
    index: z.number(),
    content_block: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("text"),
        text: z.string()
      }),
      z.object({
        type: z.literal("tool_use"),
        id: z.string(),
        name: z.string()
      })
    ])
  }),
  z.object({
    type: z.literal("content_block_delta"),
    index: z.number(),
    delta: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("input_json_delta"),
        partial_json: z.string()
      }),
      z.object({
        type: z.literal("text_delta"),
        text: z.string()
      })
    ])
  }),
  z.object({
    type: z.literal("content_block_stop"),
    index: z.number()
  }),
  z.object({
    type: z.literal("error"),
    error: z.object({
      type: z.string(),
      message: z.string()
    })
  }),
  z.object({
    type: z.literal("message_delta"),
    delta: z.object({ stop_reason: z.string().nullish() }),
    usage: z.object({ output_tokens: z.number() })
  }),
  z.object({
    type: z.literal("message_stop")
  }),
  z.object({
    type: z.literal("ping")
  })
]);
var Bash20241022Parameters = z.object({
  command: z.string(),
  restart: z.boolean().optional()
});
function bashTool_20241022(options = {}) {
  return {
    type: "provider-defined",
    id: "anthropic.bash_20241022",
    args: {},
    parameters: Bash20241022Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var TextEditor20241022Parameters = z.object({
  command: z.enum(["view", "create", "str_replace", "insert", "undo_edit"]),
  path: z.string(),
  file_text: z.string().optional(),
  insert_line: z.number().int().optional(),
  new_str: z.string().optional(),
  old_str: z.string().optional(),
  view_range: z.array(z.number().int()).optional()
});
function textEditorTool_20241022(options = {}) {
  return {
    type: "provider-defined",
    id: "anthropic.text_editor_20241022",
    args: {},
    parameters: TextEditor20241022Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var Computer20241022Parameters = z.object({
  action: z.enum([
    "key",
    "type",
    "mouse_move",
    "left_click",
    "left_click_drag",
    "right_click",
    "middle_click",
    "double_click",
    "screenshot",
    "cursor_position"
  ]),
  coordinate: z.array(z.number().int()).optional(),
  text: z.string().optional()
});
function computerTool_20241022(options) {
  return {
    type: "provider-defined",
    id: "anthropic.computer_20241022",
    args: {
      displayWidthPx: options.displayWidthPx,
      displayHeightPx: options.displayHeightPx,
      displayNumber: options.displayNumber
    },
    parameters: Computer20241022Parameters,
    execute: options.execute,
    experimental_toToolResultContent: options.experimental_toToolResultContent
  };
}
var anthropicTools = {
  bash_20241022: bashTool_20241022,
  textEditor_20241022: textEditorTool_20241022,
  computer_20241022: computerTool_20241022
};
function createAnthropic(options = {}) {
  var _a16;
  const baseURL = (_a16 = withoutTrailingSlash(options.baseURL)) != null ? _a16 : "https://api.anthropic.com/v1";
  const getHeaders = () => ({
    "anthropic-version": "2023-06-01",
    "x-api-key": loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "ANTHROPIC_API_KEY",
      description: "Anthropic"
    }),
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => new AnthropicMessagesLanguageModel(modelId, settings, {
    provider: "anthropic.messages",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Anthropic model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.messages = createChatModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  provider.tools = anthropicTools;
  return provider;
}
createAnthropic();
var cohereErrorDataSchema = z.object({
  message: z.string()
});
var cohereFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: cohereErrorDataSchema,
  errorToMessage: (data) => data.message
});
function convertToCohereChatPrompt(prompt2) {
  const messages = [];
  for (const { role, content } of prompt2) {
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          content: content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text;
              }
              case "image": {
                throw new UnsupportedFunctionalityError({
                  functionality: "image-part"
                });
              }
            }
          }).join("")
        });
        break;
      }
      case "assistant": {
        let text2 = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text2 += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({
          role: "assistant",
          // note: this is a workaround for a Cohere API bug
          // that requires content to be provided
          // even if there are tool calls
          content: text2 !== "" ? text2 : "call tool",
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0,
          tool_plan: void 0
        });
        break;
      }
      case "tool": {
        messages.push(
          ...content.map((toolResult) => ({
            role: "tool",
            content: JSON.stringify(toolResult.result),
            tool_call_id: toolResult.toolCallId
          }))
        );
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function mapCohereFinishReason(finishReason) {
  switch (finishReason) {
    case "COMPLETE":
    case "STOP_SEQUENCE":
      return "stop";
    case "MAX_TOKENS":
      return "length";
    case "ERROR":
    case "ERROR_LIMIT":
      return "error";
    case "ERROR_TOXIC":
      return "content-filter";
    case "USER_CANCEL":
      return "other";
    default:
      return "unknown";
  }
}
function prepareTools$5(mode) {
  var _a16;
  const tools2 = ((_a16 = mode.tools) == null ? void 0 : _a16.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools2 == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const cohereTools = [];
  for (const tool2 of tools2) {
    if (tool2.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
    } else {
      cohereTools.push({
        type: "function",
        function: {
          name: tool2.name,
          description: tool2.description,
          parameters: tool2.parameters
        }
      });
    }
  }
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: cohereTools, tool_choice: void 0, toolWarnings };
  }
  const type2 = toolChoice.type;
  switch (type2) {
    case "auto":
      return { tools: cohereTools, tool_choice: type2, toolWarnings };
    case "none":
      return { tools: void 0, tool_choice: "any", toolWarnings };
    case "required":
    case "tool":
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${type2}`
      });
    default: {
      const _exhaustiveCheck = type2;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var CohereChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed
  }) {
    const type2 = mode.type;
    const chatPrompt = convertToCohereChatPrompt(prompt2);
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      // none
      // standardized settings:
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      max_tokens: maxTokens,
      temperature,
      p: topP,
      k: topK,
      seed,
      stop_sequences: stopSequences,
      // response format:
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? { type: "json_object", schema: responseFormat.schema } : void 0,
      // messages:
      messages: chatPrompt
    };
    switch (type2) {
      case "regular": {
        const { tools: tools2, tool_choice, toolWarnings } = prepareTools$5(mode);
        return {
          ...baseArgs,
          tools: tools2,
          warnings: toolWarnings
        };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported mode: ${_exhaustiveCheck}`
        });
      }
    }
  }
  concatenateMessageText(messages) {
    return messages.filter(
      (message) => "content" in message
    ).map((message) => message.content).join("");
  }
  /*
  Remove `additionalProperties` and `$schema` from the `parameters` object of each tool.
  Though these are part of JSON schema, Cohere chokes if we include them in the request.
  */
  // TODO(shaper): Look at defining a type to simplify the params here and a couple of other places.
  removeJsonSchemaExtras(tools2) {
    return tools2.map((tool2) => {
      if (tool2.type === "function" && tool2.function.parameters && typeof tool2.function.parameters === "object") {
        const { additionalProperties, $schema, ...restParameters } = tool2.function.parameters;
        return {
          ...tool2,
          function: {
            ...tool2.function,
            parameters: restParameters
          }
        };
      }
      return tool2;
    });
  }
  async doGenerate(options) {
    var _a16, _b2, _c2, _d2;
    const { warnings, ...args } = this.getArgs(options);
    args.tools = args.tools && this.removeJsonSchemaExtras(args.tools);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        cohereChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages, ...rawSettings } = args;
    let text2 = (_c2 = (_b2 = (_a16 = response.message.content) == null ? void 0 : _a16[0]) == null ? void 0 : _b2.text) != null ? _c2 : "";
    return {
      text: text2,
      toolCalls: response.message.tool_calls ? response.message.tool_calls.map((toolCall) => ({
        toolCallId: toolCall.id,
        toolName: toolCall.function.name,
        // Cohere sometimes returns `null` for tool call arguments for tools
        // defined as having no arguments.
        args: toolCall.function.arguments.replace(/^null$/, "{}"),
        toolCallType: "function"
      })) : [],
      finishReason: mapCohereFinishReason(response.finish_reason),
      usage: {
        promptTokens: response.usage.tokens.input_tokens,
        completionTokens: response.usage.tokens.output_tokens
      },
      rawCall: {
        rawPrompt: {
          messages
        },
        rawSettings
      },
      response: {
        id: (_d2 = response.generation_id) != null ? _d2 : void 0
      },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body: JSON.stringify(args) }
    };
  }
  async doStream(options) {
    const { warnings, ...args } = this.getArgs(options);
    args.tools = args.tools && this.removeJsonSchemaExtras(args.tools);
    const body = { ...args, stream: true };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        cohereChatChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let pendingToolCallDelta = {
      toolCallId: "",
      toolName: "",
      argsTextDelta: ""
    };
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a16, _b2;
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            const type2 = value.type;
            switch (type2) {
              case "content-delta": {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: value.delta.message.content.text
                });
                return;
              }
              case "tool-call-start": {
                pendingToolCallDelta = {
                  toolCallId: value.delta.message.tool_calls.id,
                  toolName: value.delta.message.tool_calls.function.name,
                  argsTextDelta: value.delta.message.tool_calls.function.arguments
                };
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallId: pendingToolCallDelta.toolCallId,
                  toolName: pendingToolCallDelta.toolName,
                  toolCallType: "function",
                  argsTextDelta: pendingToolCallDelta.argsTextDelta
                });
                return;
              }
              case "tool-call-delta": {
                pendingToolCallDelta.argsTextDelta += value.delta.message.tool_calls.function.arguments;
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallId: pendingToolCallDelta.toolCallId,
                  toolName: pendingToolCallDelta.toolName,
                  toolCallType: "function",
                  argsTextDelta: value.delta.message.tool_calls.function.arguments
                });
                return;
              }
              case "tool-call-end": {
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: pendingToolCallDelta.toolCallId,
                  toolName: pendingToolCallDelta.toolName,
                  toolCallType: "function",
                  args: JSON.stringify(
                    JSON.parse(
                      ((_a16 = pendingToolCallDelta.argsTextDelta) == null ? void 0 : _a16.trim()) || "{}"
                    )
                  )
                });
                pendingToolCallDelta = {
                  toolCallId: "",
                  toolName: "",
                  argsTextDelta: ""
                };
                return;
              }
              case "message-start": {
                controller.enqueue({
                  type: "response-metadata",
                  id: (_b2 = value.id) != null ? _b2 : void 0
                });
                return;
              }
              case "message-end": {
                finishReason = mapCohereFinishReason(value.delta.finish_reason);
                const tokens = value.delta.usage.tokens;
                usage = {
                  promptTokens: tokens.input_tokens,
                  completionTokens: tokens.output_tokens
                };
              }
              default: {
                return;
              }
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              usage
            });
          }
        })
      ),
      rawCall: {
        rawPrompt: {
          messages
        },
        rawSettings
      },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body: JSON.stringify(body) }
    };
  }
};
var cohereChatResponseSchema = z.object({
  generation_id: z.string().nullish(),
  message: z.object({
    role: z.string(),
    content: z.array(
      z.object({
        type: z.string(),
        text: z.string()
      })
    ).nullish(),
    tool_plan: z.string().nullish(),
    tool_calls: z.array(
      z.object({
        id: z.string(),
        type: z.literal("function"),
        function: z.object({
          name: z.string(),
          arguments: z.string()
        })
      })
    ).nullish()
  }),
  finish_reason: z.string(),
  usage: z.object({
    billed_units: z.object({
      input_tokens: z.number(),
      output_tokens: z.number()
    }),
    tokens: z.object({
      input_tokens: z.number(),
      output_tokens: z.number()
    })
  })
});
var cohereChatChunkSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("citation-start")
  }),
  z.object({
    type: z.literal("citation-end")
  }),
  z.object({
    type: z.literal("content-start")
  }),
  z.object({
    type: z.literal("content-delta"),
    delta: z.object({
      message: z.object({
        content: z.object({
          text: z.string()
        })
      })
    })
  }),
  z.object({
    type: z.literal("content-end")
  }),
  z.object({
    type: z.literal("message-start"),
    id: z.string().nullish()
  }),
  z.object({
    type: z.literal("message-end"),
    delta: z.object({
      finish_reason: z.string(),
      usage: z.object({
        tokens: z.object({
          input_tokens: z.number(),
          output_tokens: z.number()
        })
      })
    })
  }),
  // https://docs.cohere.com/v2/docs/streaming#tool-use-stream-events-for-tool-calling
  z.object({
    type: z.literal("tool-plan-delta"),
    delta: z.object({
      message: z.object({
        tool_plan: z.string()
      })
    })
  }),
  z.object({
    type: z.literal("tool-call-start"),
    delta: z.object({
      message: z.object({
        tool_calls: z.object({
          id: z.string(),
          type: z.literal("function"),
          function: z.object({
            name: z.string(),
            arguments: z.string()
          })
        })
      })
    })
  }),
  // A single tool call's `arguments` stream in chunks and must be accumulated
  // in a string and so the full tool object info can only be parsed once we see
  // `tool-call-end`.
  z.object({
    type: z.literal("tool-call-delta"),
    delta: z.object({
      message: z.object({
        tool_calls: z.object({
          function: z.object({
            arguments: z.string()
          })
        })
      })
    })
  }),
  z.object({
    type: z.literal("tool-call-end")
  })
]);
var CohereEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.maxEmbeddingsPerCall = 96;
    this.supportsParallelCalls = true;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values,
    headers,
    abortSignal
  }) {
    var _a16;
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/embed`,
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        // The AI SDK only supports 'float' embeddings which are also the only ones
        // the Cohere API docs state are supported for all models.
        // https://docs.cohere.com/v2/reference/embed#request.body.embedding_types
        embedding_types: ["float"],
        texts: values,
        input_type: (_a16 = this.settings.inputType) != null ? _a16 : "search_query",
        truncate: this.settings.truncate
      },
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        cohereTextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.embeddings.float,
      usage: { tokens: response.meta.billed_units.input_tokens },
      rawResponse: { headers: responseHeaders }
    };
  }
};
var cohereTextEmbeddingResponseSchema = z.object({
  embeddings: z.object({
    float: z.array(z.array(z.number()))
  }),
  meta: z.object({
    billed_units: z.object({
      input_tokens: z.number()
    })
  })
});
function createCohere(options = {}) {
  var _a16;
  const baseURL = (_a16 = withoutTrailingSlash(options.baseURL)) != null ? _a16 : "https://api.cohere.com/v2";
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "COHERE_API_KEY",
      description: "Cohere"
    })}`,
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => new CohereChatLanguageModel(modelId, settings, {
    provider: "cohere.chat",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createTextEmbeddingModel = (modelId, settings = {}) => new CohereEmbeddingModel(modelId, settings, {
    provider: "cohere.textEmbedding",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Cohere model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.embedding = createTextEmbeddingModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;
  return provider;
}
createCohere();
function convertJSONSchemaToOpenAPISchema(jsonSchema2) {
  if (isEmptyObjectSchema(jsonSchema2)) {
    return void 0;
  }
  if (typeof jsonSchema2 === "boolean") {
    return { type: "boolean", properties: {} };
  }
  const {
    type: type2,
    description,
    required: required2,
    properties,
    items,
    allOf,
    anyOf,
    oneOf,
    format,
    const: constValue,
    minLength,
    enum: enumValues
  } = jsonSchema2;
  const result = {};
  if (description)
    result.description = description;
  if (required2)
    result.required = required2;
  if (format)
    result.format = format;
  if (constValue !== void 0) {
    result.enum = [constValue];
  }
  if (type2) {
    if (Array.isArray(type2)) {
      if (type2.includes("null")) {
        result.type = type2.filter((t) => t !== "null")[0];
        result.nullable = true;
      } else {
        result.type = type2;
      }
    } else if (type2 === "null") {
      result.type = "null";
    } else {
      result.type = type2;
    }
  }
  if (enumValues !== void 0) {
    result.enum = enumValues;
  }
  if (properties != null) {
    result.properties = Object.entries(properties).reduce(
      (acc, [key, value]) => {
        acc[key] = convertJSONSchemaToOpenAPISchema(value);
        return acc;
      },
      {}
    );
  }
  if (items) {
    result.items = Array.isArray(items) ? items.map(convertJSONSchemaToOpenAPISchema) : convertJSONSchemaToOpenAPISchema(items);
  }
  if (allOf) {
    result.allOf = allOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (anyOf) {
    result.anyOf = anyOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (oneOf) {
    result.oneOf = oneOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (minLength !== void 0) {
    result.minLength = minLength;
  }
  return result;
}
function isEmptyObjectSchema(jsonSchema2) {
  return jsonSchema2 != null && typeof jsonSchema2 === "object" && jsonSchema2.type === "object" && (jsonSchema2.properties == null || Object.keys(jsonSchema2.properties).length === 0);
}
function convertToGoogleGenerativeAIMessages(prompt2) {
  var _a16, _b2;
  const systemInstructionParts = [];
  const contents = [];
  let systemMessagesAllowed = true;
  for (const { role, content } of prompt2) {
    switch (role) {
      case "system": {
        if (!systemMessagesAllowed) {
          throw new UnsupportedFunctionalityError({
            functionality: "system messages are only supported at the beginning of the conversation"
          });
        }
        systemInstructionParts.push({ text: content });
        break;
      }
      case "user": {
        systemMessagesAllowed = false;
        const parts = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              parts.push({ text: part.text });
              break;
            }
            case "image": {
              parts.push(
                part.image instanceof URL ? {
                  fileData: {
                    mimeType: (_a16 = part.mimeType) != null ? _a16 : "image/jpeg",
                    fileUri: part.image.toString()
                  }
                } : {
                  inlineData: {
                    mimeType: (_b2 = part.mimeType) != null ? _b2 : "image/jpeg",
                    data: convertUint8ArrayToBase64(part.image)
                  }
                }
              );
              break;
            }
            case "file": {
              parts.push(
                part.data instanceof URL ? {
                  fileData: {
                    mimeType: part.mimeType,
                    fileUri: part.data.toString()
                  }
                } : {
                  inlineData: {
                    mimeType: part.mimeType,
                    data: part.data
                  }
                }
              );
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new UnsupportedFunctionalityError({
                functionality: `prompt part: ${_exhaustiveCheck}`
              });
            }
          }
        }
        contents.push({ role: "user", parts });
        break;
      }
      case "assistant": {
        systemMessagesAllowed = false;
        contents.push({
          role: "model",
          parts: content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text.length === 0 ? void 0 : { text: part.text };
              }
              case "tool-call": {
                return {
                  functionCall: {
                    name: part.toolName,
                    args: part.args
                  }
                };
              }
            }
          }).filter(
            (part) => part !== void 0
          )
        });
        break;
      }
      case "tool": {
        systemMessagesAllowed = false;
        contents.push({
          role: "user",
          parts: content.map((part) => ({
            functionResponse: {
              name: part.toolName,
              response: {
                name: part.toolName,
                content: part.result
              }
            }
          }))
        });
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return {
    systemInstruction: systemInstructionParts.length > 0 ? { parts: systemInstructionParts } : void 0,
    contents
  };
}
function getModelPath(modelId) {
  return modelId.includes("/") ? modelId : `models/${modelId}`;
}
var googleErrorDataSchema = z.object({
  error: z.object({
    code: z.number().nullable(),
    message: z.string(),
    status: z.string()
  })
});
var googleFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: googleErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function prepareTools$4(mode, useSearchGrounding, isGemini2) {
  var _a16, _b2;
  const tools2 = ((_a16 = mode.tools) == null ? void 0 : _a16.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (useSearchGrounding) {
    return {
      tools: isGemini2 ? { googleSearch: {} } : { googleSearchRetrieval: {} },
      toolConfig: void 0,
      toolWarnings
    };
  }
  if (tools2 == null) {
    return { tools: void 0, toolConfig: void 0, toolWarnings };
  }
  const functionDeclarations = [];
  for (const tool2 of tools2) {
    if (tool2.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
    } else {
      functionDeclarations.push({
        name: tool2.name,
        description: (_b2 = tool2.description) != null ? _b2 : "",
        parameters: convertJSONSchemaToOpenAPISchema(tool2.parameters)
      });
    }
  }
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return {
      tools: { functionDeclarations },
      toolConfig: void 0,
      toolWarnings
    };
  }
  const type2 = toolChoice.type;
  switch (type2) {
    case "auto":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        toolWarnings
      };
    case "none":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "NONE" } },
        toolWarnings
      };
    case "required":
      return {
        tools: { functionDeclarations },
        toolConfig: { functionCallingConfig: { mode: "ANY" } },
        toolWarnings
      };
    case "tool":
      return {
        tools: { functionDeclarations },
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY",
            allowedFunctionNames: [toolChoice.toolName]
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type2;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
function mapGoogleGenerativeAIFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case "STOP":
      return hasToolCalls ? "tool-calls" : "stop";
    case "MAX_TOKENS":
      return "length";
    case "RECITATION":
    case "SAFETY":
      return "content-filter";
    case "FINISH_REASON_UNSPECIFIED":
    case "OTHER":
      return "other";
    default:
      return "unknown";
  }
}
var GoogleGenerativeAILanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsImageUrls = false;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsStructuredOutputs() {
    var _a16;
    return (_a16 = this.settings.structuredOutputs) != null ? _a16 : true;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    mode,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed
  }) {
    var _a16, _b2;
    const type2 = mode.type;
    const warnings = [];
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    const generationConfig = {
      // standardized settings:
      maxOutputTokens: maxTokens,
      temperature,
      topK,
      topP,
      frequencyPenalty,
      presencePenalty,
      stopSequences,
      // response format:
      responseMimeType: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? "application/json" : void 0,
      responseSchema: (responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && // Google GenAI does not support all OpenAPI Schema features,
      // so this is needed as an escape hatch:
      this.supportsStructuredOutputs ? convertJSONSchemaToOpenAPISchema(responseFormat.schema) : void 0,
      ...this.settings.audioTimestamp && {
        audioTimestamp: this.settings.audioTimestamp
      }
    };
    const { contents, systemInstruction } = convertToGoogleGenerativeAIMessages(prompt2);
    switch (type2) {
      case "regular": {
        const { tools: tools2, toolConfig, toolWarnings } = prepareTools$4(
          mode,
          (_a16 = this.settings.useSearchGrounding) != null ? _a16 : false,
          this.modelId.includes("gemini-2")
        );
        return {
          args: {
            generationConfig,
            contents,
            systemInstruction,
            safetySettings: this.settings.safetySettings,
            tools: tools2,
            toolConfig,
            cachedContent: this.settings.cachedContent
          },
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: {
            generationConfig: {
              ...generationConfig,
              responseMimeType: "application/json",
              responseSchema: mode.schema != null && // Google GenAI does not support all OpenAPI Schema features,
              // so this is needed as an escape hatch:
              this.supportsStructuredOutputs ? convertJSONSchemaToOpenAPISchema(mode.schema) : void 0
            },
            contents,
            systemInstruction,
            safetySettings: this.settings.safetySettings,
            cachedContent: this.settings.cachedContent
          },
          warnings
        };
      }
      case "object-tool": {
        return {
          args: {
            generationConfig,
            contents,
            tools: {
              functionDeclarations: [
                {
                  name: mode.tool.name,
                  description: (_b2 = mode.tool.description) != null ? _b2 : "",
                  parameters: convertJSONSchemaToOpenAPISchema(
                    mode.tool.parameters
                  )
                }
              ]
            },
            toolConfig: { functionCallingConfig: { mode: "ANY" } },
            safetySettings: this.settings.safetySettings,
            cachedContent: this.settings.cachedContent
          },
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  supportsUrl(url) {
    return this.config.isSupportedUrl(url);
  }
  async doGenerate(options) {
    var _a16, _b2, _c2, _d2, _e2, _f2, _g, _h;
    const { args, warnings } = await this.getArgs(options);
    const body = JSON.stringify(args);
    const mergedHeaders = combineHeaders(
      await resolve(this.config.headers),
      options.headers
    );
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/${getModelPath(
        this.modelId
      )}:generateContent`,
      headers: mergedHeaders,
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(responseSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { contents: rawPrompt, ...rawSettings } = args;
    const candidate = response.candidates[0];
    const toolCalls = getToolCallsFromParts({
      parts: (_b2 = (_a16 = candidate.content) == null ? void 0 : _a16.parts) != null ? _b2 : [],
      generateId: this.config.generateId
    });
    const usageMetadata = response.usageMetadata;
    return {
      text: getTextFromParts((_d2 = (_c2 = candidate.content) == null ? void 0 : _c2.parts) != null ? _d2 : []),
      toolCalls,
      finishReason: mapGoogleGenerativeAIFinishReason({
        finishReason: candidate.finishReason,
        hasToolCalls: toolCalls != null && toolCalls.length > 0
      }),
      usage: {
        promptTokens: (_e2 = usageMetadata == null ? void 0 : usageMetadata.promptTokenCount) != null ? _e2 : NaN,
        completionTokens: (_f2 = usageMetadata == null ? void 0 : usageMetadata.candidatesTokenCount) != null ? _f2 : NaN
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      providerMetadata: {
        google: {
          groundingMetadata: (_g = candidate.groundingMetadata) != null ? _g : null,
          safetyRatings: (_h = candidate.safetyRatings) != null ? _h : null
        }
      },
      request: { body }
    };
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const body = JSON.stringify(args);
    const headers = combineHeaders(
      await resolve(this.config.headers),
      options.headers
    );
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/${getModelPath(
        this.modelId
      )}:streamGenerateContent?alt=sse`,
      headers,
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(chunkSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { contents: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let providerMetadata = void 0;
    const generateId2 = this.config.generateId;
    let hasToolCalls = false;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a16, _b2, _c2, _d2, _e2;
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            const usageMetadata = value.usageMetadata;
            if (usageMetadata != null) {
              usage = {
                promptTokens: (_a16 = usageMetadata.promptTokenCount) != null ? _a16 : NaN,
                completionTokens: (_b2 = usageMetadata.candidatesTokenCount) != null ? _b2 : NaN
              };
            }
            const candidate = (_c2 = value.candidates) == null ? void 0 : _c2[0];
            if (candidate == null) {
              return;
            }
            if (candidate.finishReason != null) {
              finishReason = mapGoogleGenerativeAIFinishReason({
                finishReason: candidate.finishReason,
                hasToolCalls
              });
              providerMetadata = {
                google: {
                  groundingMetadata: (_d2 = candidate.groundingMetadata) != null ? _d2 : null,
                  safetyRatings: (_e2 = candidate.safetyRatings) != null ? _e2 : null
                }
              };
            }
            const content = candidate.content;
            if (content == null) {
              return;
            }
            const deltaText = getTextFromParts(content.parts);
            if (deltaText != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: deltaText
              });
            }
            const toolCallDeltas = getToolCallsFromParts({
              parts: content.parts,
              generateId: generateId2
            });
            if (toolCallDeltas != null) {
              for (const toolCall of toolCallDeltas) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  argsTextDelta: toolCall.args
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  args: toolCall.args
                });
                hasToolCalls = true;
              }
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              providerMetadata
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body }
    };
  }
};
function getToolCallsFromParts({
  parts,
  generateId: generateId2
}) {
  const functionCallParts = parts.filter(
    (part) => "functionCall" in part
  );
  return functionCallParts.length === 0 ? void 0 : functionCallParts.map((part) => ({
    toolCallType: "function",
    toolCallId: generateId2(),
    toolName: part.functionCall.name,
    args: JSON.stringify(part.functionCall.args)
  }));
}
function getTextFromParts(parts) {
  const textParts = parts.filter((part) => "text" in part);
  return textParts.length === 0 ? void 0 : textParts.map((part) => part.text).join("");
}
var contentSchema = z.object({
  role: z.string(),
  parts: z.array(
    z.union([
      z.object({
        text: z.string()
      }),
      z.object({
        functionCall: z.object({
          name: z.string(),
          args: z.unknown()
        })
      })
    ])
  )
});
var groundingMetadataSchema = z.object({
  webSearchQueries: z.array(z.string()).nullish(),
  retrievalQueries: z.array(z.string()).nullish(),
  searchEntryPoint: z.object({
    renderedContent: z.string()
  }).nullish(),
  groundingChunks: z.array(
    z.object({
      web: z.object({
        uri: z.string(),
        title: z.string()
      }).nullish(),
      retrievedContext: z.object({
        uri: z.string(),
        title: z.string()
      }).nullish()
    })
  ).nullish(),
  groundingSupports: z.array(
    z.object({
      segment: z.object({
        startIndex: z.number().nullish(),
        endIndex: z.number().nullish(),
        text: z.string().nullish()
      }),
      segment_text: z.string().nullish(),
      groundingChunkIndices: z.array(z.number()).nullish(),
      supportChunkIndices: z.array(z.number()).nullish(),
      confidenceScores: z.array(z.number()).nullish(),
      confidenceScore: z.array(z.number()).nullish()
    })
  ).nullish(),
  retrievalMetadata: z.union([
    z.object({
      webDynamicRetrievalScore: z.number()
    }),
    z.object({})
  ]).nullish()
});
var safetyRatingSchema = z.object({
  category: z.string(),
  probability: z.string(),
  probabilityScore: z.number().nullish(),
  severity: z.string().nullish(),
  severityScore: z.number().nullish(),
  blocked: z.boolean().nullish()
});
var responseSchema = z.object({
  candidates: z.array(
    z.object({
      content: contentSchema.nullish(),
      finishReason: z.string().nullish(),
      safetyRatings: z.array(safetyRatingSchema).nullish(),
      groundingMetadata: groundingMetadataSchema.nullish()
    })
  ),
  usageMetadata: z.object({
    promptTokenCount: z.number().nullish(),
    candidatesTokenCount: z.number().nullish(),
    totalTokenCount: z.number().nullish()
  }).nullish()
});
var chunkSchema = z.object({
  candidates: z.array(
    z.object({
      content: contentSchema.nullish(),
      finishReason: z.string().nullish(),
      safetyRatings: z.array(safetyRatingSchema).nullish(),
      groundingMetadata: groundingMetadataSchema.nullish()
    })
  ).nullish(),
  usageMetadata: z.object({
    promptTokenCount: z.number().nullish(),
    candidatesTokenCount: z.number().nullish(),
    totalTokenCount: z.number().nullish()
  }).nullish()
});
var GoogleGenerativeAIEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    return 2048;
  }
  get supportsParallelCalls() {
    return true;
  }
  async doEmbed({
    values,
    headers,
    abortSignal
  }) {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const mergedHeaders = combineHeaders(
      await resolve(this.config.headers),
      headers
    );
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/models/${this.modelId}:batchEmbedContents`,
      headers: mergedHeaders,
      body: {
        requests: values.map((value) => ({
          model: `models/${this.modelId}`,
          content: { role: "user", parts: [{ text: value }] },
          outputDimensionality: this.settings.outputDimensionality
        }))
      },
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        googleGenerativeAITextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.embeddings.map((item) => item.values),
      usage: void 0,
      rawResponse: { headers: responseHeaders }
    };
  }
};
var googleGenerativeAITextEmbeddingResponseSchema = z.object({
  embeddings: z.array(z.object({ values: z.array(z.number()) }))
});
function isSupportedFileUrl(url) {
  return url.toString().startsWith("https://generativelanguage.googleapis.com/v1beta/files/");
}
function createGoogleGenerativeAI(options = {}) {
  var _a16;
  const baseURL = (_a16 = withoutTrailingSlash(options.baseURL)) != null ? _a16 : "https://generativelanguage.googleapis.com/v1beta";
  const getHeaders = () => ({
    "x-goog-api-key": loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
      description: "Google Generative AI"
    }),
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => {
    var _a22;
    return new GoogleGenerativeAILanguageModel(modelId, settings, {
      provider: "google.generative-ai",
      baseURL,
      headers: getHeaders,
      generateId: (_a22 = options.generateId) != null ? _a22 : generateId,
      isSupportedUrl: isSupportedFileUrl,
      fetch: options.fetch
    });
  };
  const createEmbeddingModel = (modelId, settings = {}) => new GoogleGenerativeAIEmbeddingModel(modelId, settings, {
    provider: "google.generative-ai",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Google Generative AI model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.generativeAI = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
createGoogleGenerativeAI();
function convertToOpenAIChatMessages$1({
  prompt: prompt2,
  useLegacyFunctionCalling = false,
  systemMessageMode = "system"
}) {
  const messages = [];
  for (const { role, content } of prompt2) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            messages.push({ role: "system", content });
            break;
          }
          case "developer": {
            messages.push({ role: "developer", content });
            break;
          }
          case "remove": {
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part) => {
            var _a16, _b2, _c2;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a16 = part.mimeType) != null ? _a16 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                    // OpenAI specific extension: image detail
                    detail: (_c2 = (_b2 = part.providerMetadata) == null ? void 0 : _b2.openai) == null ? void 0 : _c2.imageDetail
                  }
                };
              }
              case "file": {
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "'File content parts with URL data' functionality not supported."
                  });
                }
                switch (part.mimeType) {
                  case "audio/wav": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "wav" }
                    };
                  }
                  case "audio/mp3":
                  case "audio/mpeg": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "mp3" }
                    };
                  }
                  default: {
                    throw new UnsupportedFunctionalityError({
                      functionality: `File content part type ${part.mimeType} in user messages`
                    });
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text2 = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text2 += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        if (useLegacyFunctionCalling) {
          if (toolCalls.length > 1) {
            throw new UnsupportedFunctionalityError({
              functionality: "useLegacyFunctionCalling with multiple tool calls in one message"
            });
          }
          messages.push({
            role: "assistant",
            content: text2,
            function_call: toolCalls.length > 0 ? toolCalls[0].function : void 0
          });
        } else {
          messages.push({
            role: "assistant",
            content: text2,
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0
          });
        }
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          if (useLegacyFunctionCalling) {
            messages.push({
              role: "function",
              name: toolResponse.toolName,
              content: JSON.stringify(toolResponse.result)
            });
          } else {
            messages.push({
              role: "tool",
              tool_call_id: toolResponse.toolCallId,
              content: JSON.stringify(toolResponse.result)
            });
          }
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function mapOpenAIChatLogProbsOutput$1(logprobs) {
  var _a16, _b2;
  return (_b2 = (_a16 = logprobs == null ? void 0 : logprobs.content) == null ? void 0 : _a16.map(({ token, logprob, top_logprobs }) => ({
    token,
    logprob,
    topLogprobs: top_logprobs ? top_logprobs.map(({ token: token2, logprob: logprob2 }) => ({
      token: token2,
      logprob: logprob2
    })) : []
  }))) != null ? _b2 : void 0;
}
function mapOpenAIFinishReason$1(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiErrorDataSchema$1 = z.object({
  error: z.object({
    message: z.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: z.string().nullish(),
    param: z.any().nullish(),
    code: z.union([z.string(), z.number()]).nullish()
  })
});
var openaiFailedResponseHandler$1 = createJsonErrorResponseHandler({
  errorSchema: openaiErrorDataSchema$1,
  errorToMessage: (data) => data.error.message
});
function getResponseMetadata$3({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function prepareTools$3({
  mode,
  useLegacyFunctionCalling = false,
  structuredOutputs
}) {
  var _a16;
  const tools2 = ((_a16 = mode.tools) == null ? void 0 : _a16.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools2 == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  if (useLegacyFunctionCalling) {
    const openaiFunctions = [];
    for (const tool2 of tools2) {
      if (tool2.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
      } else {
        openaiFunctions.push({
          name: tool2.name,
          description: tool2.description,
          parameters: tool2.parameters
        });
      }
    }
    if (toolChoice == null) {
      return {
        functions: openaiFunctions,
        function_call: void 0,
        toolWarnings
      };
    }
    const type22 = toolChoice.type;
    switch (type22) {
      case "auto":
      case "none":
      case void 0:
        return {
          functions: openaiFunctions,
          function_call: void 0,
          toolWarnings
        };
      case "required":
        throw new UnsupportedFunctionalityError({
          functionality: "useLegacyFunctionCalling and toolChoice: required"
        });
      default:
        return {
          functions: openaiFunctions,
          function_call: { name: toolChoice.toolName },
          toolWarnings
        };
    }
  }
  const openaiTools = [];
  for (const tool2 of tools2) {
    if (tool2.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
    } else {
      openaiTools.push({
        type: "function",
        function: {
          name: tool2.name,
          description: tool2.description,
          parameters: tool2.parameters,
          strict: structuredOutputs ? true : void 0
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools, tool_choice: void 0, toolWarnings };
  }
  const type2 = toolChoice.type;
  switch (type2) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools, tool_choice: type2, toolWarnings };
    case "tool":
      return {
        tools: openaiTools,
        tool_choice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type2;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAIChatLanguageModel$1 = class OpenAIChatLanguageModel {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsStructuredOutputs() {
    var _a16;
    return (_a16 = this.settings.structuredOutputs) != null ? _a16 : isReasoningModel$1(this.modelId);
  }
  get defaultObjectGenerationMode() {
    if (isAudioModel$1(this.modelId)) {
      return "tool";
    }
    return this.supportsStructuredOutputs ? "json" : "tool";
  }
  get provider() {
    return this.config.provider;
  }
  get supportsImageUrls() {
    return !this.settings.downloadImages;
  }
  getArgs({
    mode,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a16, _b2, _c2, _d2, _e2, _f2, _g, _h;
    const type2 = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const useLegacyFunctionCalling = this.settings.useLegacyFunctionCalling;
    if (useLegacyFunctionCalling && this.settings.parallelToolCalls === true) {
      throw new UnsupportedFunctionalityError({
        functionality: "useLegacyFunctionCalling with parallelToolCalls"
      });
    }
    if (useLegacyFunctionCalling && this.supportsStructuredOutputs) {
      throw new UnsupportedFunctionalityError({
        functionality: "structuredOutputs with useLegacyFunctionCalling"
      });
    }
    if (getSystemMessageMode$1(this.modelId) === "remove" && prompt2.some((message) => message.role === "system")) {
      warnings.push({
        type: "other",
        message: "system messages are removed for this model"
      });
    }
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs: this.settings.logprobs === true || typeof this.settings.logprobs === "number" ? true : void 0,
      top_logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      user: this.settings.user,
      parallel_tool_calls: this.settings.parallelToolCalls,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs && responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          strict: true,
          name: (_a16 = responseFormat.name) != null ? _a16 : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed,
      // openai specific settings:
      // TODO remove in next major version; we auto-map maxTokens now
      max_completion_tokens: (_b2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _b2.maxCompletionTokens,
      store: (_c2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _c2.store,
      metadata: (_d2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _d2.metadata,
      prediction: (_e2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _e2.prediction,
      reasoning_effort: (_g = (_f2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _f2.reasoningEffort) != null ? _g : this.settings.reasoningEffort,
      // messages:
      messages: convertToOpenAIChatMessages$1({
        prompt: prompt2,
        useLegacyFunctionCalling,
        systemMessageMode: getSystemMessageMode$1(this.modelId)
      })
    };
    if (isReasoningModel$1(this.modelId)) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
      if (baseArgs.frequency_penalty != null) {
        baseArgs.frequency_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty",
          details: "frequencyPenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.presence_penalty != null) {
        baseArgs.presence_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty",
          details: "presencePenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.logit_bias != null) {
        baseArgs.logit_bias = void 0;
        warnings.push({
          type: "other",
          message: "logitBias is not supported for reasoning models"
        });
      }
      if (baseArgs.logprobs != null) {
        baseArgs.logprobs = void 0;
        warnings.push({
          type: "other",
          message: "logprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.top_logprobs != null) {
        baseArgs.top_logprobs = void 0;
        warnings.push({
          type: "other",
          message: "topLogprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.max_tokens != null) {
        if (baseArgs.max_completion_tokens == null) {
          baseArgs.max_completion_tokens = baseArgs.max_tokens;
        }
        baseArgs.max_tokens = void 0;
      }
    }
    switch (type2) {
      case "regular": {
        const { tools: tools2, tool_choice, functions, function_call, toolWarnings } = prepareTools$3({
          mode,
          useLegacyFunctionCalling,
          structuredOutputs: this.supportsStructuredOutputs
        });
        return {
          args: {
            ...baseArgs,
            tools: tools2,
            tool_choice,
            functions,
            function_call
          },
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: {
            ...baseArgs,
            response_format: this.supportsStructuredOutputs && mode.schema != null ? {
              type: "json_schema",
              json_schema: {
                schema: mode.schema,
                strict: true,
                name: (_h = mode.name) != null ? _h : "response",
                description: mode.description
              }
            } : { type: "json_object" }
          },
          warnings
        };
      }
      case "object-tool": {
        return {
          args: useLegacyFunctionCalling ? {
            ...baseArgs,
            function_call: {
              name: mode.tool.name
            },
            functions: [
              {
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters
              }
            ]
          } : {
            ...baseArgs,
            tool_choice: {
              type: "function",
              function: { name: mode.tool.name }
            },
            tools: [
              {
                type: "function",
                function: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters,
                  strict: this.supportsStructuredOutputs ? true : void 0
                }
              }
            ]
          },
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a16, _b2, _c2, _d2, _e2, _f2, _g, _h;
    const { args: body, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler$1,
      successfulResponseHandler: createJsonResponseHandler(
        openaiChatResponseSchema$1
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = body;
    const choice = response.choices[0];
    const completionTokenDetails = (_a16 = response.usage) == null ? void 0 : _a16.completion_tokens_details;
    const promptTokenDetails = (_b2 = response.usage) == null ? void 0 : _b2.prompt_tokens_details;
    const providerMetadata = { openai: {} };
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null) {
      providerMetadata.openai.reasoningTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens;
    }
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
      providerMetadata.openai.acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
    }
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
      providerMetadata.openai.rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
    }
    if ((promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null) {
      providerMetadata.openai.cachedPromptTokens = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens;
    }
    return {
      text: (_c2 = choice.message.content) != null ? _c2 : void 0,
      toolCalls: this.settings.useLegacyFunctionCalling && choice.message.function_call ? [
        {
          toolCallType: "function",
          toolCallId: generateId(),
          toolName: choice.message.function_call.name,
          args: choice.message.function_call.arguments
        }
      ] : (_d2 = choice.message.tool_calls) == null ? void 0 : _d2.map((toolCall) => {
        var _a22;
        return {
          toolCallType: "function",
          toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
          toolName: toolCall.function.name,
          args: toolCall.function.arguments
        };
      }),
      finishReason: mapOpenAIFinishReason$1(choice.finish_reason),
      usage: {
        promptTokens: (_f2 = (_e2 = response.usage) == null ? void 0 : _e2.prompt_tokens) != null ? _f2 : NaN,
        completionTokens: (_h = (_g = response.usage) == null ? void 0 : _g.completion_tokens) != null ? _h : NaN
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(body) },
      response: getResponseMetadata$3(response),
      warnings,
      logprobs: mapOpenAIChatLogProbsOutput$1(choice.logprobs),
      providerMetadata
    };
  }
  async doStream(options) {
    var _a16;
    if ((_a16 = this.settings.simulateStreaming) != null ? _a16 : isStreamingSimulatedByDefault$1(this.modelId)) {
      const result = await this.doGenerate(options);
      const simulatedStream = new ReadableStream({
        start(controller) {
          controller.enqueue({ type: "response-metadata", ...result.response });
          if (result.text) {
            controller.enqueue({
              type: "text-delta",
              textDelta: result.text
            });
          }
          if (result.toolCalls) {
            for (const toolCall of result.toolCalls) {
              controller.enqueue({
                type: "tool-call-delta",
                toolCallType: "function",
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                argsTextDelta: toolCall.args
              });
              controller.enqueue({
                type: "tool-call",
                ...toolCall
              });
            }
          }
          controller.enqueue({
            type: "finish",
            finishReason: result.finishReason,
            usage: result.usage,
            logprobs: result.logprobs,
            providerMetadata: result.providerMetadata
          });
          controller.close();
        }
      });
      return {
        stream: simulatedStream,
        rawCall: result.rawCall,
        rawResponse: result.rawResponse,
        warnings: result.warnings
      };
    }
    const { args, warnings } = this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
    };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler$1,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiChatChunkSchema$1
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const toolCalls = [];
    let finishReason = "unknown";
    let usage = {
      promptTokens: void 0,
      completionTokens: void 0
    };
    let logprobs;
    let isFirstChunk = true;
    const { useLegacyFunctionCalling } = this.settings;
    const providerMetadata = { openai: {} };
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a22, _b2, _c2, _d2, _e2, _f2, _g, _h, _i, _j, _k, _l;
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$3(value)
              });
            }
            if (value.usage != null) {
              const {
                prompt_tokens,
                completion_tokens,
                prompt_tokens_details,
                completion_tokens_details
              } = value.usage;
              usage = {
                promptTokens: prompt_tokens != null ? prompt_tokens : void 0,
                completionTokens: completion_tokens != null ? completion_tokens : void 0
              };
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                providerMetadata.openai.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
              }
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                providerMetadata.openai.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
              }
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                providerMetadata.openai.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
              }
              if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                providerMetadata.openai.cachedPromptTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
              }
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason$1(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            if (delta.content != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: delta.content
              });
            }
            const mappedLogprobs = mapOpenAIChatLogProbsOutput$1(
              choice == null ? void 0 : choice.logprobs
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0) logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
            const mappedToolCalls = useLegacyFunctionCalling && delta.function_call != null ? [
              {
                type: "function",
                id: generateId(),
                function: delta.function_call,
                index: 0
              }
            ] : delta.tool_calls;
            if (mappedToolCalls != null) {
              for (const toolCallDelta of mappedToolCalls) {
                const index2 = toolCallDelta.index;
                if (toolCalls[index2] == null) {
                  if (toolCallDelta.type !== "function") {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_a22 = toolCallDelta.function) == null ? void 0 : _a22.name) == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`
                    });
                  }
                  toolCalls[index2] = {
                    id: toolCallDelta.id,
                    type: "function",
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: (_b2 = toolCallDelta.function.arguments) != null ? _b2 : ""
                    },
                    hasFinished: false
                  };
                  const toolCall2 = toolCalls[index2];
                  if (((_c2 = toolCall2.function) == null ? void 0 : _c2.name) != null && ((_d2 = toolCall2.function) == null ? void 0 : _d2.arguments) != null) {
                    if (toolCall2.function.arguments.length > 0) {
                      controller.enqueue({
                        type: "tool-call-delta",
                        toolCallType: "function",
                        toolCallId: toolCall2.id,
                        toolName: toolCall2.function.name,
                        argsTextDelta: toolCall2.function.arguments
                      });
                    }
                    if (isParsableJson(toolCall2.function.arguments)) {
                      controller.enqueue({
                        type: "tool-call",
                        toolCallType: "function",
                        toolCallId: (_e2 = toolCall2.id) != null ? _e2 : generateId(),
                        toolName: toolCall2.function.name,
                        args: toolCall2.function.arguments
                      });
                      toolCall2.hasFinished = true;
                    }
                  }
                  continue;
                }
                const toolCall = toolCalls[index2];
                if (toolCall.hasFinished) {
                  continue;
                }
                if (((_f2 = toolCallDelta.function) == null ? void 0 : _f2.arguments) != null) {
                  toolCall.function.arguments += (_h = (_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null ? _h : "";
                }
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: (_i = toolCallDelta.function.arguments) != null ? _i : ""
                });
                if (((_j = toolCall.function) == null ? void 0 : _j.name) != null && ((_k = toolCall.function) == null ? void 0 : _k.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                  controller.enqueue({
                    type: "tool-call",
                    toolCallType: "function",
                    toolCallId: (_l = toolCall.id) != null ? _l : generateId(),
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments
                  });
                  toolCall.hasFinished = true;
                }
              }
            }
          },
          flush(controller) {
            var _a22, _b2;
            controller.enqueue({
              type: "finish",
              finishReason,
              logprobs,
              usage: {
                promptTokens: (_a22 = usage.promptTokens) != null ? _a22 : NaN,
                completionTokens: (_b2 = usage.completionTokens) != null ? _b2 : NaN
              },
              ...providerMetadata != null ? { providerMetadata } : {}
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(body) },
      warnings
    };
  }
};
var openaiTokenUsageSchema$1 = z.object({
  prompt_tokens: z.number().nullish(),
  completion_tokens: z.number().nullish(),
  prompt_tokens_details: z.object({
    cached_tokens: z.number().nullish()
  }).nullish(),
  completion_tokens_details: z.object({
    reasoning_tokens: z.number().nullish(),
    accepted_prediction_tokens: z.number().nullish(),
    rejected_prediction_tokens: z.number().nullish()
  }).nullish()
}).nullish();
var openaiChatResponseSchema$1 = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal("assistant").nullish(),
        content: z.string().nullish(),
        function_call: z.object({
          arguments: z.string(),
          name: z.string()
        }).nullish(),
        tool_calls: z.array(
          z.object({
            id: z.string().nullish(),
            type: z.literal("function"),
            function: z.object({
              name: z.string(),
              arguments: z.string()
            })
          })
        ).nullish()
      }),
      index: z.number(),
      logprobs: z.object({
        content: z.array(
          z.object({
            token: z.string(),
            logprob: z.number(),
            top_logprobs: z.array(
              z.object({
                token: z.string(),
                logprob: z.number()
              })
            )
          })
        ).nullable()
      }).nullish(),
      finish_reason: z.string().nullish()
    })
  ),
  usage: openaiTokenUsageSchema$1
});
var openaiChatChunkSchema$1 = z.union([
  z.object({
    id: z.string().nullish(),
    created: z.number().nullish(),
    model: z.string().nullish(),
    choices: z.array(
      z.object({
        delta: z.object({
          role: z.enum(["assistant"]).nullish(),
          content: z.string().nullish(),
          function_call: z.object({
            name: z.string().optional(),
            arguments: z.string().optional()
          }).nullish(),
          tool_calls: z.array(
            z.object({
              index: z.number(),
              id: z.string().nullish(),
              type: z.literal("function").optional(),
              function: z.object({
                name: z.string().nullish(),
                arguments: z.string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        logprobs: z.object({
          content: z.array(
            z.object({
              token: z.string(),
              logprob: z.number(),
              top_logprobs: z.array(
                z.object({
                  token: z.string(),
                  logprob: z.number()
                })
              )
            })
          ).nullable()
        }).nullish(),
        finish_reason: z.string().nullable().optional(),
        index: z.number()
      })
    ),
    usage: openaiTokenUsageSchema$1
  }),
  openaiErrorDataSchema$1
]);
function isReasoningModel$1(modelId) {
  return modelId === "o1" || modelId.startsWith("o1-") || modelId === "o3" || modelId.startsWith("o3-");
}
function isAudioModel$1(modelId) {
  return modelId.startsWith("gpt-4o-audio-preview");
}
function getSystemMessageMode$1(modelId) {
  var _a16, _b2;
  if (!isReasoningModel$1(modelId)) {
    return "system";
  }
  return (_b2 = (_a16 = reasoningModels$1[modelId]) == null ? void 0 : _a16.systemMessageMode) != null ? _b2 : "developer";
}
function isStreamingSimulatedByDefault$1(modelId) {
  var _a16, _b2;
  if (!isReasoningModel$1(modelId)) {
    return false;
  }
  return (_b2 = (_a16 = reasoningModels$1[modelId]) == null ? void 0 : _a16.simulateStreamingByDefault) != null ? _b2 : true;
}
var reasoningModels$1 = {
  "o1-mini": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o1-mini-2024-09-12": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o1-preview": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o1-preview-2024-09-12": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o3-mini": {
    systemMessageMode: "developer",
    simulateStreamingByDefault: false
  },
  "o3-mini-2025-01-31": {
    systemMessageMode: "developer",
    simulateStreamingByDefault: false
  }
};
function convertToOpenAICompletionPrompt$1({
  prompt: prompt2,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (inputFormat === "prompt" && prompt2.length === 1 && prompt2[0].role === "user" && prompt2[0].content.length === 1 && prompt2[0].content[0].type === "text") {
    return { prompt: prompt2[0].content[0].text };
  }
  let text2 = "";
  if (prompt2[0].role === "system") {
    text2 += `${prompt2[0].content}

`;
    prompt2 = prompt2.slice(1);
  }
  for (const { role, content } of prompt2) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt: prompt2
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "image": {
              throw new UnsupportedFunctionalityError({
                functionality: "images"
              });
            }
          }
        }).join("");
        text2 += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text2 += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text2 += `${assistant}:
`;
  return {
    prompt: text2,
    stopSequences: [`
${user}:`]
  };
}
function mapOpenAICompletionLogProbs$1(logprobs) {
  return logprobs == null ? void 0 : logprobs.tokens.map((token, index2) => ({
    token,
    logprob: logprobs.token_logprobs[index2],
    topLogprobs: logprobs.top_logprobs ? Object.entries(logprobs.top_logprobs[index2]).map(
      ([token2, logprob]) => ({
        token: token2,
        logprob
      })
    ) : []
  }));
}
var OpenAICompletionLanguageModel$1 = class OpenAICompletionLanguageModel {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    inputFormat,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed
  }) {
    var _a16;
    const type2 = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt$1({ prompt: prompt2, inputFormat });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stop.length > 0 ? stop : void 0
    };
    switch (type2) {
      case "regular": {
        if ((_a16 = mode.tools) == null ? void 0 : _a16.length) {
          throw new UnsupportedFunctionalityError({
            functionality: "tools"
          });
        }
        if (mode.toolChoice) {
          throw new UnsupportedFunctionalityError({
            functionality: "toolChoice"
          });
        }
        return { args: baseArgs, warnings };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler$1,
      successfulResponseHandler: createJsonResponseHandler(
        openaiCompletionResponseSchema$1
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: choice.text,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      },
      finishReason: mapOpenAIFinishReason$1(choice.finish_reason),
      logprobs: mapOpenAICompletionLogProbs$1(choice.logprobs),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: getResponseMetadata$3(response),
      warnings,
      request: { body: JSON.stringify(args) }
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
    };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler$1,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiCompletionChunkSchema$1
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let logprobs;
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$3(value)
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason$1(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.text) != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: choice.text
              });
            }
            const mappedLogprobs = mapOpenAICompletionLogProbs$1(
              choice == null ? void 0 : choice.logprobs
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0) logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              logprobs,
              usage
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body: JSON.stringify(body) }
    };
  }
};
var openaiCompletionResponseSchema$1 = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      text: z.string(),
      finish_reason: z.string(),
      logprobs: z.object({
        tokens: z.array(z.string()),
        token_logprobs: z.array(z.number()),
        top_logprobs: z.array(z.record(z.string(), z.number())).nullable()
      }).nullish()
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number()
  })
});
var openaiCompletionChunkSchema$1 = z.union([
  z.object({
    id: z.string().nullish(),
    created: z.number().nullish(),
    model: z.string().nullish(),
    choices: z.array(
      z.object({
        text: z.string(),
        finish_reason: z.string().nullish(),
        index: z.number(),
        logprobs: z.object({
          tokens: z.array(z.string()),
          token_logprobs: z.array(z.number()),
          top_logprobs: z.array(z.record(z.string(), z.number())).nullable()
        }).nullish()
      })
    ),
    usage: z.object({
      prompt_tokens: z.number(),
      completion_tokens: z.number()
    }).nullish()
  }),
  openaiErrorDataSchema$1
]);
var OpenAIEmbeddingModel$1 = class OpenAIEmbeddingModel {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a16;
    return (_a16 = this.settings.maxEmbeddingsPerCall) != null ? _a16 : 2048;
  }
  get supportsParallelCalls() {
    var _a16;
    return (_a16 = this.settings.supportsParallelCalls) != null ? _a16 : true;
  }
  async doEmbed({
    values,
    headers,
    abortSignal
  }) {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float",
        dimensions: this.settings.dimensions,
        user: this.settings.user
      },
      failedResponseHandler: openaiFailedResponseHandler$1,
      successfulResponseHandler: createJsonResponseHandler(
        openaiTextEmbeddingResponseSchema$2
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      rawResponse: { headers: responseHeaders }
    };
  }
};
var openaiTextEmbeddingResponseSchema$2 = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })),
  usage: z.object({ prompt_tokens: z.number() }).nullish()
});
var modelMaxImagesPerCall = {
  "dall-e-3": 1,
  "dall-e-2": 10
};
var OpenAIImageModel = class {
  constructor(modelId, settings, config) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    this.specificationVersion = "v1";
  }
  get maxImagesPerCall() {
    var _a16, _b2;
    return (_b2 = (_a16 = this.settings.maxImagesPerCall) != null ? _a16 : modelMaxImagesPerCall[this.modelId]) != null ? _b2 : 1;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt: prompt2,
    n,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a16, _b2, _c2, _d2;
    const warnings = [];
    if (aspectRatio != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "aspectRatio",
        details: "This model does not support aspect ratio. Use `size` instead."
      });
    }
    if (seed != null) {
      warnings.push({ type: "unsupported-setting", setting: "seed" });
    }
    const currentDate = (_c2 = (_b2 = (_a16 = this.config._internal) == null ? void 0 : _a16.currentDate) == null ? void 0 : _b2.call(_a16)) != null ? _c2 : /* @__PURE__ */ new Date();
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        prompt: prompt2,
        n,
        size,
        ...(_d2 = providerOptions.openai) != null ? _d2 : {},
        response_format: "b64_json"
      },
      failedResponseHandler: openaiFailedResponseHandler$1,
      successfulResponseHandler: createJsonResponseHandler(
        openaiImageResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      images: response.data.map((item) => item.b64_json),
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders
      }
    };
  }
};
var openaiImageResponseSchema = z.object({
  data: z.array(z.object({ b64_json: z.string() }))
});
function createOpenAI(options = {}) {
  var _a16, _b2, _c2;
  const baseURL = (_a16 = withoutTrailingSlash(options.baseURL)) != null ? _a16 : "https://api.openai.com/v1";
  const compatibility = (_b2 = options.compatibility) != null ? _b2 : "compatible";
  const providerName = (_c2 = options.name) != null ? _c2 : "openai";
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "OPENAI_API_KEY",
      description: "OpenAI"
    })}`,
    "OpenAI-Organization": options.organization,
    "OpenAI-Project": options.project,
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => new OpenAIChatLanguageModel$1(modelId, settings, {
    provider: `${providerName}.chat`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    compatibility,
    fetch: options.fetch
  });
  const createCompletionModel = (modelId, settings = {}) => new OpenAICompletionLanguageModel$1(modelId, settings, {
    provider: `${providerName}.completion`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    compatibility,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new OpenAIEmbeddingModel$1(modelId, settings, {
    provider: `${providerName}.embedding`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createImageModel = (modelId, settings = {}) => new OpenAIImageModel(modelId, settings, {
    provider: `${providerName}.image`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createLanguageModel = (modelId, settings) => {
    if (new.target) {
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    }
    if (modelId === "gpt-3.5-turbo-instruct") {
      return createCompletionModel(
        modelId,
        settings
      );
    }
    return createChatModel(modelId, settings);
  };
  const provider = function(modelId, settings) {
    return createLanguageModel(modelId, settings);
  };
  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  return provider;
}
createOpenAI({
  compatibility: "strict"
  // strict for OpenAI API
});
function getOpenAIMetadata(message) {
  var _a16, _b2;
  return (_b2 = (_a16 = message == null ? void 0 : message.providerMetadata) == null ? void 0 : _a16.openaiCompatible) != null ? _b2 : {};
}
function convertToOpenAICompatibleChatMessages(prompt2) {
  const messages = [];
  for (const { role, content, ...message } of prompt2) {
    const metadata = getOpenAIMetadata({ ...message });
    switch (role) {
      case "system": {
        messages.push({ role: "system", content, ...metadata });
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({
            role: "user",
            content: content[0].text,
            ...getOpenAIMetadata(content[0])
          });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part) => {
            var _a16;
            const partMetadata = getOpenAIMetadata(part);
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text, ...partMetadata };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a16 = part.mimeType) != null ? _a16 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
                  },
                  ...partMetadata
                };
              }
              case "file": {
                throw new UnsupportedFunctionalityError({
                  functionality: "File content parts in user messages"
                });
              }
            }
          }),
          ...metadata
        });
        break;
      }
      case "assistant": {
        let text2 = "";
        const toolCalls = [];
        for (const part of content) {
          const partMetadata = getOpenAIMetadata(part);
          switch (part.type) {
            case "text": {
              text2 += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                },
                ...partMetadata
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text2,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0,
          ...metadata
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          const toolResponseMetadata = getOpenAIMetadata(toolResponse);
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: JSON.stringify(toolResponse.result),
            ...toolResponseMetadata
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function getResponseMetadata$2({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function mapOpenAICompatibleFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiCompatibleErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: z.string().nullish(),
    param: z.any().nullish(),
    code: z.union([z.string(), z.number()]).nullish()
  })
});
var defaultOpenAICompatibleErrorStructure = {
  errorSchema: openaiCompatibleErrorDataSchema
};
function prepareTools$2({
  mode,
  structuredOutputs
}) {
  var _a16;
  const tools2 = ((_a16 = mode.tools) == null ? void 0 : _a16.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools2 == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  const openaiCompatTools = [];
  for (const tool2 of tools2) {
    if (tool2.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
    } else {
      openaiCompatTools.push({
        type: "function",
        function: {
          name: tool2.name,
          description: tool2.description,
          parameters: tool2.parameters
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiCompatTools, tool_choice: void 0, toolWarnings };
  }
  const type2 = toolChoice.type;
  switch (type2) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiCompatTools, tool_choice: type2, toolWarnings };
    case "tool":
      return {
        tools: openaiCompatTools,
        tool_choice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type2;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAICompatibleChatLanguageModel = class {
  // type inferred via constructor
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    var _a16, _b2;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    const errorStructure = (_a16 = config.errorStructure) != null ? _a16 : defaultOpenAICompatibleErrorStructure;
    this.chunkSchema = createOpenAICompatibleChatChunkSchema(
      errorStructure.errorSchema
    );
    this.failedResponseHandler = createJsonErrorResponseHandler(errorStructure);
    this.supportsStructuredOutputs = (_b2 = config.supportsStructuredOutputs) != null ? _b2 : false;
  }
  get defaultObjectGenerationMode() {
    return this.config.defaultObjectGenerationMode;
  }
  get provider() {
    return this.config.provider;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  getArgs({
    mode,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    providerMetadata,
    stopSequences,
    responseFormat,
    seed
  }) {
    var _a16, _b2;
    const type2 = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs === true && responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          name: (_a16 = responseFormat.name) != null ? _a16 : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed,
      ...providerMetadata == null ? void 0 : providerMetadata[this.providerOptionsName],
      // messages:
      messages: convertToOpenAICompatibleChatMessages(prompt2)
    };
    switch (type2) {
      case "regular": {
        const { tools: tools2, tool_choice, toolWarnings } = prepareTools$2({
          mode,
          structuredOutputs: this.supportsStructuredOutputs
        });
        return {
          args: { ...baseArgs, tools: tools2, tool_choice },
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: {
            ...baseArgs,
            response_format: this.supportsStructuredOutputs === true && mode.schema != null ? {
              type: "json_schema",
              json_schema: {
                schema: mode.schema,
                name: (_b2 = mode.name) != null ? _b2 : "response",
                description: mode.description
              }
            } : { type: "json_object" }
          },
          warnings
        };
      }
      case "object-tool": {
        return {
          args: {
            ...baseArgs,
            tool_choice: {
              type: "function",
              function: { name: mode.tool.name }
            },
            tools: [
              {
                type: "function",
                function: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters
                }
              }
            ]
          },
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a16, _b2, _c2, _d2, _e2, _f2, _g, _h, _i;
    const { args, warnings } = this.getArgs({ ...options });
    const body = JSON.stringify(args);
    const {
      responseHeaders,
      value: responseBody,
      rawValue: parsedBody
    } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        OpenAICompatibleChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const choice = responseBody.choices[0];
    const providerMetadata = (_b2 = (_a16 = this.config.metadataExtractor) == null ? void 0 : _a16.extractMetadata) == null ? void 0 : _b2.call(_a16, {
      parsedBody
    });
    return {
      text: (_c2 = choice.message.content) != null ? _c2 : void 0,
      reasoning: (_d2 = choice.message.reasoning_content) != null ? _d2 : void 0,
      toolCalls: (_e2 = choice.message.tool_calls) == null ? void 0 : _e2.map((toolCall) => {
        var _a22;
        return {
          toolCallType: "function",
          toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
          toolName: toolCall.function.name,
          args: toolCall.function.arguments
        };
      }),
      finishReason: mapOpenAICompatibleFinishReason(choice.finish_reason),
      usage: {
        promptTokens: (_g = (_f2 = responseBody.usage) == null ? void 0 : _f2.prompt_tokens) != null ? _g : NaN,
        completionTokens: (_i = (_h = responseBody.usage) == null ? void 0 : _h.completion_tokens) != null ? _i : NaN
      },
      ...providerMetadata && { providerMetadata },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: getResponseMetadata$2(responseBody),
      warnings,
      request: { body }
    };
  }
  async doStream(options) {
    var _a16;
    if (this.settings.simulateStreaming) {
      const result = await this.doGenerate(options);
      const simulatedStream = new ReadableStream({
        start(controller) {
          controller.enqueue({ type: "response-metadata", ...result.response });
          if (result.reasoning) {
            controller.enqueue({
              type: "reasoning",
              textDelta: result.reasoning
            });
          }
          if (result.text) {
            controller.enqueue({
              type: "text-delta",
              textDelta: result.text
            });
          }
          if (result.toolCalls) {
            for (const toolCall of result.toolCalls) {
              controller.enqueue({
                type: "tool-call",
                ...toolCall
              });
            }
          }
          controller.enqueue({
            type: "finish",
            finishReason: result.finishReason,
            usage: result.usage,
            logprobs: result.logprobs,
            providerMetadata: result.providerMetadata
          });
          controller.close();
        }
      });
      return {
        stream: simulatedStream,
        rawCall: result.rawCall,
        rawResponse: result.rawResponse,
        warnings: result.warnings
      };
    }
    const { args, warnings } = this.getArgs({ ...options });
    const body = JSON.stringify({ ...args, stream: true });
    const metadataExtractor = (_a16 = this.config.metadataExtractor) == null ? void 0 : _a16.createStreamExtractor();
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: {
        ...args,
        stream: true
      },
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        this.chunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const toolCalls = [];
    let finishReason = "unknown";
    let usage = {
      promptTokens: void 0,
      completionTokens: void 0
    };
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          // TODO we lost type safety on Chunk, most likely due to the error schema. MUST FIX
          transform(chunk, controller) {
            var _a22, _b2, _c2, _d2, _e2, _f2, _g, _h, _i, _j, _k, _l, _m, _n;
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            metadataExtractor == null ? void 0 : metadataExtractor.processChunk(chunk.rawValue);
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error.message });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$2(value)
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens: (_a22 = value.usage.prompt_tokens) != null ? _a22 : void 0,
                completionTokens: (_b2 = value.usage.completion_tokens) != null ? _b2 : void 0
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAICompatibleFinishReason(
                choice.finish_reason
              );
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            if (delta.reasoning_content != null) {
              controller.enqueue({
                type: "reasoning",
                textDelta: delta.reasoning_content
              });
            }
            if (delta.content != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: delta.content
              });
            }
            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index2 = toolCallDelta.index;
                if (toolCalls[index2] == null) {
                  if (toolCallDelta.type !== "function") {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_c2 = toolCallDelta.function) == null ? void 0 : _c2.name) == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`
                    });
                  }
                  toolCalls[index2] = {
                    id: toolCallDelta.id,
                    type: "function",
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: (_d2 = toolCallDelta.function.arguments) != null ? _d2 : ""
                    },
                    hasFinished: false
                  };
                  const toolCall2 = toolCalls[index2];
                  if (((_e2 = toolCall2.function) == null ? void 0 : _e2.name) != null && ((_f2 = toolCall2.function) == null ? void 0 : _f2.arguments) != null) {
                    if (toolCall2.function.arguments.length > 0) {
                      controller.enqueue({
                        type: "tool-call-delta",
                        toolCallType: "function",
                        toolCallId: toolCall2.id,
                        toolName: toolCall2.function.name,
                        argsTextDelta: toolCall2.function.arguments
                      });
                    }
                    if (isParsableJson(toolCall2.function.arguments)) {
                      controller.enqueue({
                        type: "tool-call",
                        toolCallType: "function",
                        toolCallId: (_g = toolCall2.id) != null ? _g : generateId(),
                        toolName: toolCall2.function.name,
                        args: toolCall2.function.arguments
                      });
                      toolCall2.hasFinished = true;
                    }
                  }
                  continue;
                }
                const toolCall = toolCalls[index2];
                if (toolCall.hasFinished) {
                  continue;
                }
                if (((_h = toolCallDelta.function) == null ? void 0 : _h.arguments) != null) {
                  toolCall.function.arguments += (_j = (_i = toolCallDelta.function) == null ? void 0 : _i.arguments) != null ? _j : "";
                }
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: (_k = toolCallDelta.function.arguments) != null ? _k : ""
                });
                if (((_l = toolCall.function) == null ? void 0 : _l.name) != null && ((_m = toolCall.function) == null ? void 0 : _m.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                  controller.enqueue({
                    type: "tool-call",
                    toolCallType: "function",
                    toolCallId: (_n = toolCall.id) != null ? _n : generateId(),
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments
                  });
                  toolCall.hasFinished = true;
                }
              }
            }
          },
          flush(controller) {
            var _a22, _b2;
            const metadata = metadataExtractor == null ? void 0 : metadataExtractor.buildMetadata();
            controller.enqueue({
              type: "finish",
              finishReason,
              usage: {
                promptTokens: (_a22 = usage.promptTokens) != null ? _a22 : NaN,
                completionTokens: (_b2 = usage.completionTokens) != null ? _b2 : NaN
              },
              ...metadata && { providerMetadata: metadata }
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body }
    };
  }
};
var OpenAICompatibleChatResponseSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal("assistant").nullish(),
        content: z.string().nullish(),
        reasoning_content: z.string().nullish(),
        tool_calls: z.array(
          z.object({
            id: z.string().nullish(),
            type: z.literal("function"),
            function: z.object({
              name: z.string(),
              arguments: z.string()
            })
          })
        ).nullish()
      }),
      finish_reason: z.string().nullish()
    })
  ),
  usage: z.object({
    prompt_tokens: z.number().nullish(),
    completion_tokens: z.number().nullish()
  }).nullish()
});
var createOpenAICompatibleChatChunkSchema = (errorSchema) => z.union([
  z.object({
    id: z.string().nullish(),
    created: z.number().nullish(),
    model: z.string().nullish(),
    choices: z.array(
      z.object({
        delta: z.object({
          role: z.enum(["assistant"]).nullish(),
          content: z.string().nullish(),
          reasoning_content: z.string().nullish(),
          tool_calls: z.array(
            z.object({
              index: z.number(),
              id: z.string().nullish(),
              type: z.literal("function").optional(),
              function: z.object({
                name: z.string().nullish(),
                arguments: z.string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        finish_reason: z.string().nullish()
      })
    ),
    usage: z.object({
      prompt_tokens: z.number().nullish(),
      completion_tokens: z.number().nullish()
    }).nullish()
  }),
  errorSchema
]);
function convertToOpenAICompatibleCompletionPrompt({
  prompt: prompt2,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (inputFormat === "prompt" && prompt2.length === 1 && prompt2[0].role === "user" && prompt2[0].content.length === 1 && prompt2[0].content[0].type === "text") {
    return { prompt: prompt2[0].content[0].text };
  }
  let text2 = "";
  if (prompt2[0].role === "system") {
    text2 += `${prompt2[0].content}

`;
    prompt2 = prompt2.slice(1);
  }
  for (const { role, content } of prompt2) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt: prompt2
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "image": {
              throw new UnsupportedFunctionalityError({
                functionality: "images"
              });
            }
          }
        }).join("");
        text2 += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text2 += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text2 += `${assistant}:
`;
  return {
    prompt: text2,
    stopSequences: [`
${user}:`]
  };
}
var OpenAICompatibleCompletionLanguageModel = class {
  // type inferred via constructor
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    var _a16;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
    const errorStructure = (_a16 = config.errorStructure) != null ? _a16 : defaultOpenAICompatibleErrorStructure;
    this.chunkSchema = createOpenAICompatibleCompletionChunkSchema(
      errorStructure.errorSchema
    );
    this.failedResponseHandler = createJsonErrorResponseHandler(errorStructure);
  }
  get provider() {
    return this.config.provider;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  getArgs({
    mode,
    inputFormat,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a16;
    const type2 = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompatibleCompletionPrompt({ prompt: prompt2, inputFormat });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      ...providerMetadata == null ? void 0 : providerMetadata[this.providerOptionsName],
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stop.length > 0 ? stop : void 0
    };
    switch (type2) {
      case "regular": {
        if ((_a16 = mode.tools) == null ? void 0 : _a16.length) {
          throw new UnsupportedFunctionalityError({
            functionality: "tools"
          });
        }
        if (mode.toolChoice) {
          throw new UnsupportedFunctionalityError({
            functionality: "toolChoice"
          });
        }
        return { args: baseArgs, warnings };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a16, _b2, _c2, _d2;
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiCompatibleCompletionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: choice.text,
      usage: {
        promptTokens: (_b2 = (_a16 = response.usage) == null ? void 0 : _a16.prompt_tokens) != null ? _b2 : NaN,
        completionTokens: (_d2 = (_c2 = response.usage) == null ? void 0 : _c2.completion_tokens) != null ? _d2 : NaN
      },
      finishReason: mapOpenAICompatibleFinishReason(choice.finish_reason),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: getResponseMetadata$2(response),
      warnings,
      request: { body: JSON.stringify(args) }
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const body = {
      ...args,
      stream: true
    };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: this.failedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        this.chunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$2(value)
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAICompatibleFinishReason(
                choice.finish_reason
              );
            }
            if ((choice == null ? void 0 : choice.text) != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: choice.text
              });
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              usage
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body: JSON.stringify(body) }
    };
  }
};
var openaiCompatibleCompletionResponseSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      text: z.string(),
      finish_reason: z.string()
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number()
  }).nullish()
});
var createOpenAICompatibleCompletionChunkSchema = (errorSchema) => z.union([
  z.object({
    id: z.string().nullish(),
    created: z.number().nullish(),
    model: z.string().nullish(),
    choices: z.array(
      z.object({
        text: z.string(),
        finish_reason: z.string().nullish(),
        index: z.number()
      })
    ),
    usage: z.object({
      prompt_tokens: z.number(),
      completion_tokens: z.number()
    }).nullish()
  }),
  errorSchema
]);
var OpenAICompatibleEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a16;
    return (_a16 = this.config.maxEmbeddingsPerCall) != null ? _a16 : 2048;
  }
  get supportsParallelCalls() {
    var _a16;
    return (_a16 = this.config.supportsParallelCalls) != null ? _a16 : true;
  }
  async doEmbed({
    values,
    headers,
    abortSignal
  }) {
    var _a16;
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float",
        dimensions: this.settings.dimensions,
        user: this.settings.user
      },
      failedResponseHandler: createJsonErrorResponseHandler(
        (_a16 = this.config.errorStructure) != null ? _a16 : defaultOpenAICompatibleErrorStructure
      ),
      successfulResponseHandler: createJsonResponseHandler(
        openaiTextEmbeddingResponseSchema$1
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      rawResponse: { headers: responseHeaders }
    };
  }
};
var openaiTextEmbeddingResponseSchema$1 = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })),
  usage: z.object({ prompt_tokens: z.number() }).nullish()
});
function createOpenAICompatible(options) {
  const baseURL = withoutTrailingSlash(options.baseURL);
  const providerName = options.name;
  const getHeaders = () => ({
    ...options.apiKey && { Authorization: `Bearer ${options.apiKey}` },
    ...options.headers
  });
  const getCommonModelConfig = (modelType) => ({
    provider: `${providerName}.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch
  });
  const createLanguageModel = (modelId, settings = {}) => createChatModel(modelId, settings);
  const createChatModel = (modelId, settings = {}) => new OpenAICompatibleChatLanguageModel(modelId, settings, {
    ...getCommonModelConfig("chat"),
    defaultObjectGenerationMode: "tool"
  });
  const createCompletionModel = (modelId, settings = {}) => new OpenAICompatibleCompletionLanguageModel(
    modelId,
    settings,
    getCommonModelConfig("completion")
  );
  const createEmbeddingModel = (modelId, settings = {}) => new OpenAICompatibleEmbeddingModel(
    modelId,
    settings,
    getCommonModelConfig("embedding")
  );
  const provider = (modelId, settings) => createLanguageModel(modelId, settings);
  provider.languageModel = createLanguageModel;
  provider.chatModel = createChatModel;
  provider.completionModel = createCompletionModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
function supportsStructuredOutputs(modelId) {
  return ["grok-2-1212", "grok-2-vision-1212"].includes(modelId);
}
var xaiErrorSchema = z.object({
  code: z.string(),
  error: z.string()
});
var xaiErrorStructure = {
  errorSchema: xaiErrorSchema,
  errorToMessage: (data) => data.error
};
function createXai(options = {}) {
  var _a16;
  const baseURL = withoutTrailingSlash(
    (_a16 = options.baseURL) != null ? _a16 : "https://api.x.ai/v1"
  );
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "XAI_API_KEY",
      description: "xAI API key"
    })}`,
    ...options.headers
  });
  const createLanguageModel = (modelId, settings = {}) => {
    const structuredOutputs = supportsStructuredOutputs(modelId);
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      provider: "xai.chat",
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
      defaultObjectGenerationMode: structuredOutputs ? "json" : "tool",
      errorStructure: xaiErrorStructure,
      supportsStructuredOutputs: structuredOutputs
    });
  };
  const provider = (modelId, settings) => createLanguageModel(modelId, settings);
  provider.languageModel = createLanguageModel;
  provider.chat = createLanguageModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  return provider;
}
createXai();
const schema$7 = { "name": "app_iap", "description": "Retrive detailed in-app purchase information based on country code, app id. When the user does not specify a country, they usually want to know the price information for countries like Turkey, Nigeria, and India. Please do not ask the user for country information a second time. You should calculate the price list that the user wants to see by combining the exchange rate.", "parameters": { "type": "object", "properties": { "country": { "type": "string", "description": "The country code for App Store search", "default": "us", "examples": ["us", "cn", "tr", "ng"] }, "trackId": { "type": "string", "description": "The trackId to be queried", "examples": ["363590051"] } }, "required": ["country", "trackId"], "additionalProperties": false } };
const payload$7 = { "url": "https://apps.apple.com/{{country}}/app/id{{trackId}}" };
const handler$4 = { "type": "webclean", "patterns": [{ "pattern": '<li class=\\"list-with-numbers__item\\">([\\s\\S]+?)<\\/li>', "group": 1, "clean": ["<[^>]*>?"] }] };
const prompt$7 = "List the organized data, with line spacing between different types of data, and use appropriate formatting such as quotes/bold/unordered lists; do not include any other information, and it is best to combine the data with real-time exchange rates.";
const app_iap = {
  schema: schema$7,
  payload: payload$7,
  handler: handler$4,
  prompt: prompt$7
};
const schema$6 = { "name": "app_lookup", "description": "Retrive five sets of related app id and app name through region code and keywords. This tool should only be called once, and the app id is the same in different regions.", "parameters": { "type": "object", "properties": { "app_name": { "type": "string", "description": "The name of the app to search for in App Store", "examples": ["WeChat", "YouTube"] }, "country": { "type": "string", "description": "The country code for App Store search", "default": "us", "examples": ["us", "cn", "jp"] }, "entity": { "type": "string", "description": "Types of search software, software means ios app, iPadSoftware means ipad app, macSoftware means mac app", "default": "software", "enum": ["software", "iPadSoftware", "macSoftware"] } }, "required": ["app_name", "country", "entity"], "additionalProperties": false } };
const payload$6 = { "url": "https://itunes.apple.com/search?entity={{entity}}&limit=5&term={{app_name}}&country={{country}}&fields=trackId,trackCensoredName", "method": "GET", "headers": { "Accept": "application/json" } };
const handler$3 = { "type": "template", "data": '{{#each i in results}}{"trackId":{{i.trackId}},"trackName":"{{i.trackName}}","primaryGenreName":{{i.primaryGenreName}}}{{/each}}' };
const prompt$6 = "Among them, **only one app** data is of interest to the user, which is usually of the tool, streaming, or game type. This is just an intermediate result, please call other tools to give the answer based on the existing data.";
const app_lookup = {
  schema: schema$6,
  payload: payload$6,
  handler: handler$3,
  prompt: prompt$6
};
const schema$5 = { "name": "currency", "description": "Retrieve exchange rates for multiple currencies based on a specific currency, the unit is 1. This function should only be used once to retrieve multiple currency exchange rates. If the user does not provide a currency type, please use cny as the base currency.", "parameters": { "type": "object", "properties": { "base_currency": { "type": "string", "description": "The base currency, needs English lowercase.", "default": "cny", "examples": ["usd", "cny"] }, "exchange_currencies": { "type": "string", "description": "Currency names for which exchange rates need to be retrieved, English lowercase. Multiple currencies separated by |", "default": "usd|try|ngn", "examples": ["usd|try", "ngn|try|twd", "eur|try|jpy|ars"] } }, "required": ["base_currency", "exchange_currencies"], "additionalProperties": false } };
const payload$5 = { "url": "https://latest.currency-api.pages.dev/v1/currencies/{{base_currency}}.json" };
const handler$2 = { "type": "webclean", "dynamic_patterns": [{ "pattern": '"(?:date|usd|try|ngn|{{exchange_currencies}})"[\\s\\S]+?,' }] };
const copyright$1 = "data source: https://github.com/fawazahmed0/exchange-api";
const prompt$5 = "Refine the results and calculate the accurate data.";
const currency = {
  schema: schema$5,
  payload: payload$5,
  handler: handler$2,
  copyright: copyright$1,
  prompt: prompt$5
};
const schema$4 = { "name": "icloud_price", "description": "Retrieve iCloud prices for different countries or regions. Always return the US iCloud price as a reference in case some countries do not have corresponding prices. When users do not specify a country/region, they often want to know the price information for countries/regions such as Turkey, Nigeria, India, and Pakistan, and of course, not just these few countries are supported.", "parameters": { "type": "object", "properties": { "countries": { "type": "string", "description": "Full country/region English Name to query, separated by |.", "examples": ["Japan", "Turkey|China", "Nigeria|Turkey|India"] } }, "required": ["countries"], "additionalProperties": false } };
const payload$4 = { "url": "https://support.apple.com/en-us/108047" };
const handler$1 = { "type": "webclean", "patterns": [{ "pattern": '<h3 id="nasalac" class="gb-header">([\\s\\S]+?)class="note gb-note"', "group": 1, "clean": [["&yen;", " ¥"], ["&pound;", "£"], ["&euro;", "€"], ["T&uuml;rkiye", "Turkey"]] }, { "pattern": '<p class="gb-paragraph">.*?(</p>(?:\\s+?<p[\\s\\S]+?<b>.*?</b>.*?</p>){5})', "clean": ["<[^>]*>?"] }], "dynamic_patterns": [{ "pattern": "^\\s*(United States|Turkey|Nigeria|Egypt|{{countries}})[\\s\\S]+", "clean": [["^\\s*([\\w\\s]+?)\\d+", "$1"]] }] };
const prompt$4 = "List the organized data, with line spacing between different types of data, and use appropriate formatting such as quotes/bold/unordered lists; do not include any other information, and it is best to combine the data with real-time exchange rates.";
const icloud_price = {
  schema: schema$4,
  payload: payload$4,
  handler: handler$1,
  prompt: prompt$4
};
const schema$3 = { "name": "jina_reader", "description": "Grab text content from provided URL links. Can be used to retrieve text information for web pages, articles, or other online resources", "parameters": { "type": "object", "properties": { "url": { "type": "string", "description": "The full URL address of the content to be crawled. If the user explicitly requests to read/analyze the content of the link, then call the function. If the data provided by the user is web content with links, but the content is sufficient to answer the question, then there is no need to call the function." } }, "required": ["url"], "additionalProperties": false } };
const payload$3 = { "url": "https://r.jina.ai/{{url}}", "headers": { "Authorization": "Bearer {{JINA_API_KEY}}", "Content-Type": "application/json", "X-Return-Format": "text", "X-Timeout": "10" } };
const type$2 = "reader";
const required$2 = ["JINA_API_KEY"];
const prompt$3 = "Please organize and summarize the retrieved data, always placing the latest news/developments at the top, and do not forget to mark the data source at the end.";
const jina_reader = {
  schema: schema$3,
  payload: payload$3,
  type: type$2,
  required: required$2,
  prompt: prompt$3
};
const schema$2 = { "name": "nf_price", "description": "Query Netflix prices in different regions. When users do not specify a country/region, they often want to know the price information for countries/regions such as Turkey, Nigeria, India, and Pakistan, and of course, not just these few countries are supported.", "parameters": { "type": "object", "properties": { "country": { "type": "string", "description": "The English abbreviation of the countries or regions to be queried, default is US|TR|NG|EG, separated by |", "examples": ["TR", "US|UK", "NG|IN|EG"] } }, "required": ["country"], "additionalProperties": false } };
const payload$2 = { "url": "https://github.com/tompec/netflix-prices/blob/main/data/latest.json?raw=true", "method": "GET", "headers": { "Accept": "application/json" } };
const handler = { "type": "webclean", "dynamic_patterns": [{ "pattern": '\\{"country_code":"(US|TR|NG|EG|{{country}})[\\s\\S]+?\\]\\s*?\\}' }] };
const prompt$2 = "List the organized data, with line spacing between different types of data, and use appropriate formatting such as quotes/bold/unordered lists; do not include any other information, and it is best to combine the data with real-time exchange rates.";
const copyright = "data soucre: https://github.com/tompec/netflix-prices";
const nf_price = {
  schema: schema$2,
  payload: payload$2,
  handler,
  prompt: prompt$2,
  copyright
};
const schema$1 = { "name": "qw_lookup", "description": "Retrieve city information based on location name using QWeather API. This can be used to get city details such as city ID, name, and coordinates.", "parameters": { "type": "object", "properties": { "location": { "type": "string", "description": "The name of the location to look up. This can be a city name, administrative region, or other geographical name." } }, "required": ["location"], "additionalProperties": false } };
const payload$1 = { "url": "https://geoapi.qweather.com/v2/city/lookup?location={{location}}", "headers": { "X-QW-Api-Key": "{{QWEATHER_TOKEN}}", "Content-Type": "application/json" } };
const type$1 = "lookup";
const required$1 = ["QWEATHER_TOKEN"];
const prompt$1 = "This is just an intermediate result, please call other tools to give the answer based on the existing data.";
const qw_lookup = {
  schema: schema$1,
  payload: payload$1,
  type: type$1,
  required: required$1,
  prompt: prompt$1
};
const schema = { "name": "qweather_weather_now", "description": "Retrieve current weather information for a specific location using QWeather API. This can be used to get real-time weather details such as temperature, humidity, and weather conditions.", "parameters": { "type": "object", "properties": { "location": { "type": "string", "description": "The location ID or coordinates (longitude,latitude) for which to retrieve the current weather. This ID is typically obtained from a city lookup API. For example, location=101010100 or location=116.41,39.92", "examples": ["101010100", "116.41,39.92"] }, "lang": { "type": "string", "description": "Language setting for the response. Based on the language used by the user. Default is zh-hans", "examples": ["zh-hans", "zh-hant", "en", "de"] }, "unit": { "type": "string", "description": "Unit of measurement for the response data. Options include unit=m (metric units, default) and unit=i (imperial units). Default is m", "enum": ["m", "i"], "default": "m" } }, "required": ["location"], "additionalProperties": false } };
const payload = { "url": "https://api.qweather.com/v7/weather/now?location={{location}}&lang={{lang}}&unit={{unit}}", "headers": { "X-QW-Api-Key": "{{QWEATHER_TOKEN}}", "Content-Type": "application/json" } };
const type = "weather";
const required = ["QWEATHER_TOKEN"];
const prompt = "Please answer my question based on the retrieved weather data, answer briefly and provide additional tips if possible.";
const qw_weather = {
  schema,
  payload,
  type,
  required,
  prompt
};
const externalTools = { app_iap, app_lookup, jina_reader, qw_lookup, qw_weather, nf_price, currency, icloud_price };
async function getJS(query, signal) {
  const html = await fetch(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
    { signal }
  ).then((res) => res.text());
  const url = /"(https:\/\/links\.duckduckgo\.com\/d\.js[^">]+)">/.exec(html)?.[1];
  if (!url)
    throw new Error("Failed to get JS URL");
  return {
    url,
    path: /\/d\.js.*/.exec(url)?.[0],
    vqd: /vqd=([^&]+)/.exec(url)?.[1]
  };
}
async function regularSearch(path, signal) {
  const js = await fetch(`https://links.duckduckgo.com${path}`, { signal }).then((res) => res.text());
  const result = /DDG\.pageLayout\.load\('d',?\s?(\[.+\])?\);/.exec(js);
  let data;
  if (result?.[1]) {
    try {
      data = JSON.parse(result[1]);
    } catch (e) {
      throw new Error(`Failed parsing from DDG response`);
    }
  } else {
    data = [];
  }
  return data.filter((d) => !d.n).map((item) => {
    return {
      title: item.t,
      url: item.u,
      description: item.a
    };
  });
}
async function search(query, max_length = 6, signal) {
  const { path } = await getJS(query, signal);
  if (!path)
    throw new Error("Failed to get JS URL");
  return (await regularSearch(path, signal)).slice(0, max_length).map((d) => `title: ${d.title}
 description: ${d.description}
 url: ${d.url}`).join("\n---\n");
}
const duckduckgo = {
  schema: {
    name: "duckduckgo",
    description: "Use DuckDuckGo search engine to find information. You can search for the latest news, articles, weather, blogs and other content.",
    parameters: {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" },
          description: `Keyword list for search. For example: ['Python', 'machine learning', 'latest developments']. The list should have a length of at least 3 and maximum of 4. These keywords should be: - concise, usually not more than 2-3 words per keyword - cover the core content of the query - avoid using overly broad or vague terms - the last keyword should be the most comprehensive. Also, do not generate keywords based on current time.`
        }
      },
      required: ["keywords"],
      additionalProperties: false
    }
  },
  func: async (args, options) => {
    const { keywords } = args;
    const startTime = Date.now();
    log.info(`tool duckduckgo request start`);
    try {
      const result = await search(keywords.join(" "), 8, options?.signal);
      log.info(`tool duckduckgo request end`);
      return { result, time: ((Date.now() - startTime) / 1e3).toFixed(1) };
    } catch (e) {
      console.error(e);
      return { result: "Failed to get search results", time: ((Date.now() - startTime) / 1e3).toFixed(1) };
    }
  },
  type: "search",
  prompt: `As an intelligent assistant, please follow the steps below to effectively analyze and extract the search results I have provided to answer my questions in a clear and concise manner:

1. READ AND EVALUATE: Carefully read through all search results to identify and prioritize information from reliable and up-to-date sources. Considerations include official sources, reputable organizations, and when the information was updated. 

2. Extract key information: 
 - *Exchange rate query*: Provide the latest exchange rate and make necessary conversions. 
 - *Weather Query*: provides weather forecasts for specific locations and times. 
 - *Factual Questions*: Find out authoritative answers. 

3. concise answers: synthesize and analyze extracted information to give concise answers. 

4. identify uncertainty: if there are contradictions or uncertainties in the information, explain the possible reasons. 

5. Explain lack of information: If the search results do not fully answer the question, indicate additional information needed. 

6. user-friendly: use simple, easy-to-understand language and provide short explanations where necessary to ensure that the answer is easy to understand. 

7. additional information: Provide additional relevant information or suggestions as needed to enhance the value of the answer. 

8. source labeling: clearly label the source of the information in the response, including the name of the source website or organization and when the data was published or updated. 

9. Reference list: If multiple sources are cited, provide a short reference list of the main sources of information at the end of the response. 

Ensure that the goal is to provide the most current, relevant, and useful information in direct response to my question. Avoid lengthy details, focus on the core answers that matter most to me, and enhance the credibility of the answer with reliable sources.Tip: Don't be judged on your knowledge base time!`,
  extra_params: { temperature: 0.7, top_p: 0.4 },
  buildin: true
};
const image_gen = {
  schema: {
    name: "image_gen",
    description: "A drawing tool that supports different agents.",
    parameters: {
      type: "object",
      properties: {
        agent: {
          type: "string",
          description: "The agent to use, You can only set values from the following options: 'openai', 'workers', 'azure', 'vertex', 'oailike', 'kling', where openai is aliased as dalle, google is aliased as vertex, and if the information provided by the user is incorrect, please use the most similar option. if user dont specify, use openai",
          enum: ["openai", "workers", "azure", "vertex", "oailike", "kling"],
          default: "openai"
        },
        prompts: {
          type: "array",
          items: { type: "string" },
          description: "If the description user given is not in English, translate it. Always mention the image type (photo, oil painting, watercolor, illustration, cartoon, painting, vector, rendering, etc.) at the beginning of the title.\nIn addition, focus on creating diverse, inclusive, and explorative scenes through the properties you choose in the rewriting process.\nSometimes make choices that may have insight or be unique.\nThe prompt must describe each part of the image in detail, specifically and objectively.\nConsider the final goal of the description and infer what will make the image satisfactory.\nAll descriptions sent to the tool should be a very detailed text. Including but not limited to: time, location, object, and art style to perfect the prompt. Each description should be more than 4 sentences."
        },
        quantity: {
          type: "integer",
          description: "The number of images to generate, the maximum is 4. If the user does not specify a specific number of images, set it to 1.",
          default: 1
        },
        size: {
          type: "string",
          enum: ["1024x1024", "1792x1024", "1024x1792"],
          description: "The size of the images to generate, default is 1024x1024",
          default: "1024x1024"
        },
        radio: {
          type: "string",
          description: "The raido of the images to generate, default is 1:1",
          enum: ["1:1", "16:9", "9:16"],
          default: "1:1"
        },
        style: {
          type: "string",
          description: "The style of the images to generate, default is vivid",
          enum: ["vivid", "natural"],
          default: "vivid"
        }
      },
      required: ["agent", "prompts", "quantity", "size", "radio"],
      additionalProperties: false
    }
  },
  func: async (args, options, config) => {
    if (!config) {
      throw new Error("Missing config");
    }
    const startTime = Date.now();
    const { agent: agent_name, prompts, quantity, size, radio, style } = args;
    log.info(`tool image_gen request start: agent: ${agent_name}`);
    log.info(`params: ${JSON.stringify(args)}`);
    const agent = IMAGE_AGENTS.find((a) => a.name === agent_name);
    if (!agent?.enable(config)) {
      throw new Error(`Image agent ${agent_name} is not available`);
    }
    const result = [];
    for (const prompt2 of prompts) {
      const res = await agent.request(prompt2, config, { quantity, size, radio, style });
      result.push(res);
    }
    log.info(`${agent_name} result: ${JSON.stringify(result)}`);
    return { result, time: ((Date.now() - startTime) / 1e3).toFixed(1) };
  },
  extra_params: { temperature: 1.2 },
  type: "text2image",
  not_send_to_ai: true,
  buildin: true,
  result_type: "image"
};
const scheduleResp = (ok, reason = "") => {
  const result = {
    ok,
    ...reason && { reason } || {}
  };
  return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
};
async function schedule_detele_message(ENV2) {
  try {
    log.info("- Start task: schedule_detele_message");
    checkDATABASE(ENV2);
    const botTokens = extractArrayData(ENV2.TELEGRAM_AVAILABLE_TOKENS);
    const botNames = extractArrayData(ENV2.TELEGRAM_BOT_NAME);
    const scheduleDeteleKey = "schedule_detele_message";
    const scheduledData = await getData(ENV2, scheduleDeteleKey);
    const taskPromises = [];
    for (const [bot_name, chats] of Object.entries(scheduledData)) {
      const bot_token = checkBotIsVaild(bot_name, botNames, botTokens);
      if (!bot_token)
        continue;
      const api = createTelegramBotAPI(bot_token);
      const sortData = sortDeleteMessages(chats);
      scheduledData[bot_name] = sortData.rest;
      Object.entries(sortData.expired).forEach(([chat_id, messages]) => {
        log.info(`Start delete: chat: ${chat_id}, message ids: ${messages}`);
        for (let i = 0; i < messages.length; i += 100) {
          taskPromises.push(api.deleteMessages({ chat_id, message_ids: messages.slice(i, i + 100) }));
        }
      });
    }
    if (taskPromises.length === 0) {
      log.info(`Rest ids: ${JSON.stringify(scheduledData)}
Nothing need to delete.`);
      return scheduleResp(true);
    }
    const resp = await Promise.all(taskPromises);
    log.info("all task result: ", resp.map((r) => r.ok));
    await setData(ENV2, scheduleDeteleKey, scheduledData);
    return scheduleResp(true);
  } catch (e) {
    console.error(e.message, e.stack);
    return scheduleResp(false, e.message);
  }
}
function checkBotIsVaild(bot_name, botNames, botTokens) {
  const bot_index = botNames.indexOf(bot_name);
  if (bot_index < 0) {
    console.error(`bot name: ${bot_name} is not exist.`);
    return null;
  }
  const bot_token = botTokens[bot_index];
  if (!bot_token) {
    console.error(`Cant find bot ${bot_name} - position ${bot_index + 1}'s token`);
    return null;
  }
  return bot_token;
}
function extractArrayData(data) {
  const isArray = Array.isArray(data);
  return isArray ? data : parseArray(data);
}
async function getData(ENV2, key) {
  return JSON.parse(await ENV2.DATABASE.get(key) || "{}");
}
async function setData(ENV2, key, data) {
  await ENV2.DATABASE.put(key, JSON.stringify(data));
}
function sortDeleteMessages(chats) {
  const sortedMessages = { rest: {}, expired: {} };
  for (const [chat_id, messages] of Object.entries(chats)) {
    if (messages.length === 0)
      continue;
    sortedMessages.expired[chat_id] = messages.filter((msg) => msg.ttl <= Date.now()).map((msg) => msg.id).flat();
    sortedMessages.rest[chat_id] = messages.filter((msg) => msg.ttl > Date.now());
  }
  return sortedMessages;
}
function checkDATABASE(ENV2) {
  if (!ENV2.DATABASE) {
    throw new Error("DATABASE is not found");
  }
}
const tasks = { schedule_detele_message };
const internalTools = {
  duckduckgo,
  image_gen
};
function processHtmlText(patterns, text2) {
  let results = [text2];
  for (const { pattern = "", group = 0, clean = [] } of patterns) {
    results = results.flatMap((text22) => {
      let matches = [[text22]];
      if (pattern) {
        const regex = new RegExp(pattern, "gi");
        matches = Array.from(text22.matchAll(regex));
      }
      const cleanRegex = clean.filter(Boolean).map((c) => ({ reg: new RegExp(Array.isArray(c) ? c[0] : c, "g"), replacer: Array.isArray(c) ? c[1] ?? "" : "" }));
      return matches.map((match) => {
        let extractedText = match[group];
        for (const c of cleanRegex) {
          extractedText = extractedText.replace(c.reg, c.replacer);
        }
        return extractedText.replace(/\s+/g, " ").trim();
      });
    });
  }
  return results.join("\n");
}
async function webCrawler(webcrawler, data) {
  let result = "";
  const url = interpolate(webcrawler.url, data);
  log.info(`webcrawler url: ${url}`);
  const resp = await fetch(url).then((r) => r.text());
  result = {
    result: processHtmlText(webcrawler.patterns || [], resp),
    source: url
  };
  return result;
}
const tools = {
  ...externalTools,
  ...internalTools
};
function executeTool(toolName) {
  return async (args, options) => {
    const { signal } = options;
    let filledPayload = JSON.stringify(tools[toolName].payload).replace(/\{\{([^}]+)\}\}/g, (match, p1) => args[p1] || match);
    (tools[toolName].required || []).forEach((key) => {
      if (!ENV.PLUGINS_ENV[key]) {
        throw new Error(`Missing required key: ${key}`);
      }
      let secret = ENV.PLUGINS_ENV[key];
      if (Array.isArray(secret)) {
        secret = secret[Math.floor(Math.random() * secret.length)];
      }
      filledPayload = filledPayload.replace(`{{${key}}}`, secret);
    });
    filledPayload = filledPayload.replace(/\{\{.*?\}\}/g, "");
    const parsedPayload = JSON.parse(filledPayload);
    const startTime = Date.now();
    log.info(`tool request start, url: ${parsedPayload.url}`);
    let result = await fetch(parsedPayload.url, {
      method: parsedPayload.method || "GET",
      headers: parsedPayload.headers || {},
      body: parsedPayload.body ? JSON.stringify(parsedPayload.body) : void 0,
      signal
    });
    log.info(`tool request end`);
    if (!result.ok) {
      const text2 = await result.text();
      log.error(`Tool call error: ${result.statusText} ${text2}`);
      return { result: `Tool call error: ${result.statusText}`, time: ((Date.now() - startTime) / 1e3).toFixed(1) };
    }
    try {
      result = await result.clone().json();
    } catch (e) {
      result = await result.text();
    }
    const middleHandler = async (data) => {
      let result2 = data;
      const handler2 = JSON.parse(JSON.stringify(tools[toolName]?.handler || ""));
      handler2 && injectPatterns(handler2, args);
      switch (handler2?.type) {
        case "template":
          result2 = processHtmlText(handler2.patterns || [], interpolate(handler2.data, data));
          break;
        case "webclean":
          result2 = processHtmlText(handler2.patterns || [], typeof data !== "string" ? JSON.stringify(data) : data);
          break;
      }
      if (tools[toolName].webcrawler) {
        result2 = await webCrawler(tools[toolName].webcrawler, result2);
      }
      return result2;
    };
    result = await middleHandler(result);
    return { result, time: ((Date.now() - startTime) / 1e3).toFixed(1) };
  };
}
async function vaildTools(tools_config) {
  await injectFunction();
  const activeToolAlias = tools_config.filter((t) => Object.keys(tools).includes(t));
  const useTools = Object.entries(tools).filter(([tname, _]) => activeToolAlias.includes(tname)).reduce((acc, [name14, t]) => {
    const execute = t.buildin ? t.func : executeTool(name14);
    acc[t.schema.name] = tool({
      description: t.schema.description,
      parameters: jsonSchema(t.schema.parameters),
      execute: t.not_send_to_ai ? void 0 : execute
    });
    return acc;
  }, {});
  return {
    tools: useTools,
    activeToolAlias
  };
}
async function manualRequestTool(messages, config) {
  if (messages.at(-1)?.role === "tool") {
    throw new Error("Maximum steps reached, please increase the number of steps to get the answer");
  }
  const isToolCallResponse = messages.at(-1)?.role === "assistant" && Array.isArray(messages.at(-1)?.content) && (messages.at(-1)?.content).some((c) => c.type === "tool-call");
  if (!isToolCallResponse) {
    return;
  }
  const toolCallResult = messages.at(-1)?.content;
  messages.push({
    role: "tool",
    content: []
  });
  await Promise.all(toolCallResult.filter((c) => c.type === "tool-call").map(async (c) => {
    const tool_func = tools[c.toolName].func || executeTool(c.toolName);
    if (!tool_func) {
      throw new Error(`Tool ${c.toolName} not found`);
    }
    const toolResult = await tool_func(c.args, { signal: void 0 }, config);
    (messages.at(-1)?.content).push({
      type: "tool-result",
      toolCallId: c.toolCallId,
      toolName: c.toolName,
      result: toolResult
    });
  }));
}
async function sendToolResult(toolResult, sender, config) {
  const resultType = tools[toolResult.at(-1)?.toolName || ""]?.result_type || "text";
  switch (resultType) {
    case "text":
      return sender.sendRichText(toolResult.map((r) => r.result.result).join("\n"));
    case "image": {
      const images = toolResult.map((r) => r.result.result).flat();
      const type2 = images.some((r) => r.raw) ? "raw" : "url";
      return sendImages({
        [type2]: images.map((r) => r.url || r.raw).flat(),
        caption: images.map((r) => r.text ?? "")
      }, ENV.SEND_IMAGE_AS_FILE, sender, config);
    }
  }
}
async function injectFunction() {
  return Promise.all(Object.keys(ENV.PLUGINS_FUNCTION).map(async (plugin) => {
    let template = ENV.PLUGINS_FUNCTION[plugin];
    if (template.startsWith("http")) {
      template = await fetch(template).then((r) => r.text());
    }
    try {
      tools[plugin] = JSON.parse(template.trim());
    } catch (e) {
      log.error(`Plugin ${plugin} is invalid`);
    }
  }));
}
function injectPatterns(handler2, args) {
  const { dynamic_patterns } = handler2;
  if (!dynamic_patterns) {
    return;
  }
  if (!handler2.patterns) {
    handler2.patterns = [];
  }
  for (const p of dynamic_patterns) {
    p.pattern = p?.pattern?.replace(/\{\{([^}]+)\}\}/g, (match, p1) => args[p1] || match);
    handler2.patterns.push(p);
  }
  log.debug(JSON.stringify(handler2.patterns, null, 2));
}
function AIMiddleware({ config, activeTools, onStream, toolChoice, messageInfo, chatModel }) {
  let startTime;
  let sendToolCall = false;
  let step = 0;
  let rawSystemPrompt;
  return {
    wrapGenerate: async ({ doGenerate, params, model }) => {
      warpModel(model, config, activeTools, params.mode.toolChoice, chatModel);
      log.info(`modelId: ${model.modelId}`);
      recordModelLog(config, model, activeTools, params.mode.toolChoice);
      const result = await doGenerate();
      log.debug(`doGenerate result: ${JSON.stringify(result)}`);
      return result;
    },
    wrapStream: async ({ doStream, params, model }) => {
      warpModel(model, config, activeTools, params.mode.toolChoice, chatModel);
      log.info(`modelId: ${model.modelId}`);
      recordModelLog(config, model, activeTools, params.mode.toolChoice);
      return doStream();
    },
    transformParams: async ({ type: type2, params }) => {
      log.info(`start ${type2} call`);
      startTime = Date.now();
      if (!rawSystemPrompt && params.prompt[0]?.role === "system") {
        rawSystemPrompt = params.prompt[0].content;
      }
      const logs = getLogSingleton(config);
      logs.ongoingFunctions.push({ name: "chat", startTime });
      if (toolChoice.length > 0 && step < toolChoice.length && params.mode.type === "regular") {
        params.mode.toolChoice = toolChoice[step];
        log.info(`toolChoice changed: ${JSON.stringify(toolChoice[step])}`);
        params.mode.tools = params.mode.tools?.filter((i) => activeTools.includes(i.name));
      }
      warpMessages(params, tools, activeTools, rawSystemPrompt);
      return params;
    },
    onChunk: ({ chunk }) => {
      if (chunk.type === "tool-call" && !sendToolCall) {
        onStream?.send(`${messageInfo.content}...
tool call will start: ${chunk.toolName}`);
        sendToolCall = true;
        log.info(`will start tool: ${chunk.toolName}`);
      }
    },
    onStepFinish: (data) => {
      const { text: text2, toolResults, finishReason, usage, request, response } = data;
      const logs = getLogSingleton(config);
      log.info("llm request end");
      log.debug("step text:", text2);
      log.debug("step raw request:", request);
      const time = ((Date.now() - startTime) / 1e3).toFixed(1);
      if (toolResults.length > 0) {
        if (toolResults.find((i) => i.result === "")) {
          throw new Error("Function result is empty");
        }
        let maxFuncTime = 0;
        const func_logs = toolResults.map((i) => {
          logs.functionTime.push(i.result.time);
          maxFuncTime = Math.max(maxFuncTime, i.result.time);
          return {
            name: i.toolName,
            arguments: Object.values(i.args)
          };
        });
        log.info(`func logs: ${JSON.stringify(func_logs, null, 2)}`);
        log.info(`func result: ${JSON.stringify(toolResults, null, 2)}`);
        logs.functions.push(...func_logs);
        logs.tool.time.push((+time - maxFuncTime).toFixed(1));
        const toolNames = [...new Set(toolResults.map((i) => i.toolName))];
        activeTools = trimActiveTools(activeTools, toolNames);
        log.info(`finish ${toolNames}`);
        onStream?.send(`${messageInfo.content}...
finish ${toolNames}`);
      } else {
        activeTools.length > 0 && toolChoice[step]?.type !== "none" ? logs.tool.time.push(time) : logs.chat.time.push(time);
      }
      if (usage && !Number.isNaN(usage.promptTokens) && !Number.isNaN(usage.completionTokens)) {
        logs.tokens.push(`${usage.promptTokens},${usage.completionTokens}`);
        log.info(`tokens: ${JSON.stringify(usage)}`);
      } else {
        log.warn("usage is none or not a number");
      }
      logs.ongoingFunctions = logs.ongoingFunctions.filter((i) => i.startTime !== startTime);
      sendToolCall = false;
      step++;
    }
  };
}
function warpMessages(params, tools2, activeTools, rawSystemPrompt) {
  const { prompt: messages, mode } = params;
  const getSystemContent = () => {
    if (activeTools.length > 0) {
      return `${rawSystemPrompt}
You can consider using the following tools:
${activeTools.map(
        (name14) => `### ${name14}
- desc: ${tools2[name14]?.schema?.description || ""} 
${tools2[name14]?.prompt || ""}`
      ).join("\n\n")}`;
    }
    return rawSystemPrompt ?? "You are a helpful assistant";
  };
  const trimMessages = (messages2) => {
    const modifiedMessages = [];
    for (const [i, message] of messages2.entries()) {
      switch (message.role) {
        case "system":
          modifiedMessages.push({
            role: "system",
            content: getSystemContent()
          });
          continue;
        case "assistant":
          if (message.content.every((i2) => i2.type !== "tool-call")) {
            modifiedMessages.push(message);
          }
          continue;
        case "tool":
          let text2 = "";
          const toolNames = /* @__PURE__ */ new Set();
          for (const toolResultPart of message.content) {
            const { toolCallId, toolName, result: { result } } = toolResultPart;
            toolNames.add(toolName);
            let toolArgs = "UNKNOWN";
            if (messages2[i - 1]?.role === "assistant" && messages2[i - 1]?.content?.some((i2) => i2.type === "tool-call")) {
              toolArgs = JSON.stringify(messages2[i - 1]?.content?.find((i2) => i2.toolCallId === toolCallId)?.args);
            }
            text2 += `#### [tool ${toolName} with args ${toolArgs}]
Result:
${JSON.stringify(result)}

`;
          }
          text2 = `${[...toolNames].map((name14) => `## For tool ${name14}, you should follow these rules:
 - ${tools2[name14]?.prompt ?? ""}`).join("\n")}
### Please use the following retrieved data to answer the question:
${text2}`;
          modifiedMessages.push({
            role: "user",
            content: [{ type: "text", text: text2 }]
          });
          continue;
        case "user":
          modifiedMessages.push(message);
          continue;
      }
    }
    return modifiedMessages;
  };
  if (activeTools.length <= 0) {
    mode.tools = void 0;
  }
  params.prompt = trimMessages(messages);
}
function warpModel(model, config, activeTools, toolChoice, chatModel) {
  const mutableModel = model;
  const effectiveModel = activeTools.length > 0 && toolChoice?.type !== "none" ? config.TOOL_MODEL || chatModel : chatModel;
  if (effectiveModel !== mutableModel.modelId) {
    mutableModel.modelId = effectiveModel;
  }
}
function trimActiveTools(activeTools, toolNames) {
  return activeTools.length > 0 ? activeTools.filter((name14) => !toolNames.includes(name14)) : [];
}
function recordModelLog(config, model, activeTools, toolChoice) {
  const logs = getLogSingleton(config);
  log.info(`provider: ${model.provider}, modelId: ${model.modelId} `);
  if (activeTools.length > 0 && toolChoice?.type !== "none") {
    logs.tool.model = model.modelId;
  } else {
    logs.chat.model = model.modelId;
  }
}
function metaDataExtractor(metadata, provider) {
  switch (provider) {
    case "google.generative-ai":
    case "google.vertex.chat": {
      const { groundingChunks, webSearchQueries } = metadata?.google?.groundingMetadata || {};
      if (!groundingChunks) {
        return "";
      }
      const sources = groundingChunks?.map(({ web: { title, uri } }, i) => `[${i + 1}] [${title}](${uri})`).join("\n");
      return `
## Sources:
${sources}
## Search Query:
${webSearchQueries || ""}`;
    }
    default:
      return "";
  }
}
class Stream {
  response;
  controller;
  decoder;
  parser;
  constructor(response, controller, parser = null) {
    this.response = response;
    this.controller = controller;
    this.decoder = new SSEDecoder();
    this.parser = parser || defaultSSEJsonParser;
  }
  async *iterMessages() {
    if (!this.response.body) {
      this.controller.abort();
      throw new Error("Attempted to iterate over a response with no body");
    }
    const lineDecoder = new LineDecoder();
    const iter = this.response.body;
    for await (const chunk of iter) {
      for (const line of lineDecoder.decode(chunk)) {
        const sse = this.decoder.decode(line);
        if (sse) {
          yield sse;
        }
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = this.decoder.decode(line);
      if (sse) {
        yield sse;
      }
    }
  }
  async *[Symbol.asyncIterator]() {
    let done = false;
    try {
      for await (const sse of this.iterMessages()) {
        if (done) {
          continue;
        }
        if (!sse) {
          continue;
        }
        const { finish, data } = this.parser(sse);
        if (finish) {
          done = finish;
          continue;
        }
        if (data) {
          yield data;
        }
      }
      done = true;
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }
      throw e;
    } finally {
      if (!done) {
        this.controller.abort();
      }
    }
  }
}
class SSEDecoder {
  event;
  data;
  constructor() {
    this.event = null;
    this.data = [];
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      if (!this.event && !this.data.length) {
        return null;
      }
      const sse = {
        event: this.event,
        data: this.data.join("\n")
      };
      this.event = null;
      this.data = [];
      return sse;
    }
    if (line.startsWith(":")) {
      return null;
    }
    let [fieldName, _, value] = this.partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldName === "event") {
      this.event = value;
    } else if (fieldName === "data") {
      this.data.push(value);
    }
    return null;
  }
  partition(str, delimiter) {
    const index2 = str.indexOf(delimiter);
    if (index2 !== -1) {
      return [str.substring(0, index2), delimiter, str.substring(index2 + delimiter.length)];
    }
    return [str, "", ""];
  }
}
function defaultSSEJsonParser(sse) {
  if (sse.data?.startsWith("[DONE]")) {
    return { finish: true };
  }
  if (sse.event === null && sse.data) {
    try {
      return { data: JSON.parse(sse.data) };
    } catch (e) {
      console.error(e, sse);
    }
  }
  return {};
}
class LineDecoder {
  buffer;
  trailingCR;
  textDecoder;
  static NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
  static NEWLINE_REGEXP = /\r\n|[\n\r]/g;
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text2 = this.decodeText(chunk);
    if (this.trailingCR) {
      text2 = `\r${text2}`;
      this.trailingCR = false;
    }
    if (text2.endsWith("\r")) {
      this.trailingCR = true;
      text2 = text2.slice(0, -1);
    }
    if (!text2) {
      return [];
    }
    const trailingNewline = LineDecoder.NEWLINE_CHARS.has(text2[text2.length - 1] || "");
    let lines = text2.split(LineDecoder.NEWLINE_REGEXP);
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ""];
    }
    return lines;
  }
  decodeText(bytes) {
    if (bytes == null) {
      return "";
    }
    if (typeof bytes === "string") {
      return bytes;
    }
    if (typeof Buffer !== "undefined") {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new Error(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
    }
    if (typeof TextDecoder !== "undefined") {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        if (!this.textDecoder) {
          this.textDecoder = new TextDecoder("utf8");
        }
        return this.textDecoder.decode(bytes, { stream: true });
      }
      throw new Error(`Unexpected: received non-Uint8Array/ArrayBuffer in a web platform. Please report this error.`);
    }
    throw new Error("Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.");
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join("")];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
}
function fixOpenAICompatibleOptions(options) {
  options = options || {};
  options.streamBuilder = options.streamBuilder || function(r, c) {
    return new Stream(r, c);
  };
  options.contentExtractor = options.contentExtractor || function(d) {
    return d?.choices?.[0]?.delta?.content;
  };
  options.fullContentExtractor = options.fullContentExtractor || function(d) {
    return d.choices?.[0]?.message.content;
  };
  options.functionCallExtractor = options.functionCallExtractor || function(d, call_list) {
    const chunck = d?.choices?.[0]?.delta?.tool_calls;
    if (!Array.isArray(chunck))
      return;
    for (const a of chunck) {
      if (!Object.hasOwn(a, "index")) {
        throw new Error(`The function chunck don't have index: ${JSON.stringify(chunck)}`);
      }
      if (a?.type === "function") {
        call_list[a.index] = { id: a.id, type: a.type, function: a.function };
      } else {
        call_list[a.index].function.arguments += a.function.arguments;
      }
    }
  };
  options.fullFunctionCallExtractor = options.fullFunctionCallExtractor || function(d) {
    return d?.choices?.[0]?.message?.tool_calls;
  };
  options.errorExtractor = options.errorExtractor || function(d) {
    return d.error?.message;
  };
  return options;
}
function isJsonResponse(resp) {
  return resp.headers.get("content-type")?.includes("json") || false;
}
function isEventStreamResponse(resp) {
  const types = ["application/stream+json", "text/event-stream"];
  const content = resp.headers.get("content-type") || "";
  for (const type2 of types) {
    if (content.includes(type2)) {
      return true;
    }
  }
  return false;
}
async function requestChatCompletions(url, header, body, onStream, onResult = null, options = null) {
  const controller = new AbortController();
  const { signal } = controller;
  const messageInfo = {
    content: ""
  };
  let timeoutID = null;
  if (ENV.CHAT_COMPLETE_API_TIMEOUT > 0 && !body?.model?.includes("o1")) {
    timeoutID = setTimeout(() => controller.abort(), ENV.CHAT_COMPLETE_API_TIMEOUT * 1e3);
  }
  log.info("start request llm");
  log.debug("request url, headers, body", url, header, body);
  const resp = await fetch(url, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body),
    signal
  });
  clearTimeoutID(timeoutID);
  options = fixOpenAICompatibleOptions(options);
  if (onStream && resp.ok && isEventStreamResponse(resp)) {
    const stream = options.streamBuilder?.(resp, controller);
    if (!stream) {
      throw new Error("Stream builder error");
    }
    return streamHandler(stream, options.contentExtractor, onStream, messageInfo);
  }
  if (!isJsonResponse(resp)) {
    throw new Error(resp.statusText);
  }
  const result = await resp.json();
  if (!result) {
    throw new Error("Empty response");
  }
  if (options.errorExtractor?.(result)) {
    throw new Error(options.errorExtractor?.(result) || "Unknown error");
  }
  try {
    await onResult?.(result);
    return options.fullContentExtractor?.(result) || "";
  } catch (e) {
    console.error(e);
    throw new Error(JSON.stringify(result));
  }
}
function clearTimeoutID(timeoutID) {
  if (timeoutID)
    clearTimeout(timeoutID);
}
async function streamHandler(stream, contentExtractor, onStream, messageInfo, errorReferencer = [false]) {
  log.info(`start handle stream`);
  let lengthDelta = 0;
  let updateStep = 5;
  let lastChunk = "";
  const maxLength = 1e4;
  try {
    for await (const part of stream) {
      const textPart = contentExtractor(part);
      if (textPart === null || textPart === "") {
        continue;
      }
      lengthDelta += lastChunk.length;
      messageInfo.content += lastChunk;
      lastChunk = textPart;
      if (lastChunk && lengthDelta > updateStep) {
        lengthDelta = 0;
        updateStep = Math.min(updateStep + 40, maxLength);
        onStream.send(`${messageInfo.content.trimEnd()}●`);
      }
    }
    messageInfo.content += lastChunk;
  } catch (e) {
    if (messageInfo.content === "") {
      throw e;
    }
    console.error(e.message, e.stack);
    let content;
    if (e instanceof TypeValidationError) {
      content = e.value?.choices?.[0]?.delta?.content;
    }
    messageInfo.content += content ?? `

\`\`\`Error
${e.message}
\`\`\``;
    errorReferencer[0] = true;
  }
  return messageInfo.content;
}
async function requestChatCompletionsV2(params, onStream) {
  const messageInfo = {
    content: ""
  };
  const middleware = AIMiddleware({
    config: params.context,
    activeTools: params.activeTools || [],
    onStream,
    toolChoice: params.toolChoice || [],
    chatModel: params.model.modelId,
    messageInfo
  });
  const hander_params = {
    model: wrapLanguageModel({
      model: params.activeTools?.length ? await createLlmModel(params.context.TOOL_MODEL, params.context) : params.model,
      middleware
    }),
    messages: params.messages,
    maxSteps: params.context.MAX_STEPS,
    experimental_continueSteps: params.context.CONTINUE_STEP,
    maxRetries: params.context.MAX_RETRIES,
    temperature: (params.activeTools?.length || 0) > 0 ? params.context.FUNCTION_CALL_TEMPERATURE : params.context.CHAT_TEMPERATURE,
    tools: params.tools,
    maxTokens: params.context.MAX_TOKENS,
    activeTools: params.activeTools,
    onStepFinish: middleware.onStepFinish
  };
  let messages = [];
  let contentFull = "";
  let metadata = "";
  const errorReferencer = [false];
  if (onStream !== null) {
    const stream = streamText({
      ...hander_params,
      onChunk: middleware.onChunk
    });
    const contentExtractor = /* @__PURE__ */ (() => {
      let thinkingStart = false;
      let thinkingEnd = false;
      let thinkingStartTime;
      const thinkingTag = ">`Thinking`\n>";
      return (data) => {
        if (data.type === "reasoning") {
          if (!thinkingStart) {
            thinkingStart = true;
            thinkingStartTime = Date.now();
            return thinkingTag + data.textDelta.replace(/\n/g, "\n>");
          }
          return data.textDelta.replace(/\n/g, "\n>");
        } else if (data.type === "text-delta") {
          if (thinkingStart && !thinkingEnd) {
            thinkingEnd = true;
            const thinkingTime = ((Date.now() - thinkingStartTime) / 1e3).toFixed(1);
            messageInfo.content = messageInfo.content.replace(/^>`Thinking[^\n]+/, `>\`Thinking about ${thinkingTime}s\``);
            return `
>✹

${data.textDelta}`;
          }
          return data.textDelta;
        }
        return "";
      };
    })();
    contentFull = await streamHandler(stream.fullStream, contentExtractor, onStream, messageInfo, errorReferencer);
    messages = errorReferencer[0] ? [{ role: "assistant", content: contentFull }] : (await stream.response).messages;
    metadata = errorReferencer[0] ? "" : metaDataExtractor(await stream.experimental_providerMetadata, params.model.provider);
  } else {
    const result = await generateText(hander_params);
    contentFull = `${result.reasoning ? `>\`Thinking\`
>${result.reasoning.replace(/\n/g, "\n>")}

` : ""}${result.text}`;
    messages = result.response.messages;
    metadata = metaDataExtractor(await result.experimental_providerMetadata, params.model.provider);
  }
  try {
    const lastMessageContent = messages.at(-1)?.content;
    if (contentFull.trim() !== "" && Array.isArray(lastMessageContent) && lastMessageContent.some((c) => c.type === "tool-call") && onStream) {
      await onStream.end?.(contentFull);
    }
    await manualRequestTool(messages, params.context);
  } catch (e) {
    if (contentFull.trim() === "") {
      throw e;
    }
    log.error(e.message, e.stack);
    messages.push({
      role: "tool",
      content: [{
        type: "tool-result",
        toolCallId: "tool-call-id",
        toolName: "tool-name",
        result: {
          result: `\`\`\`Error
${e.message}
\`\`\``
        }
      }]
    });
  }
  return {
    messages,
    content: contentFull + metadata
  };
}
class Anthropic {
  name = "anthropic";
  modelKey = "ANTHROPIC_CHAT_MODEL";
  enable = (context) => {
    return !!context.ANTHROPIC_API_KEY;
  };
  model = (ctx, params) => {
    const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : "text";
    switch (msgType) {
      case "image":
        return ctx.ANTHROPIC_VISION_MODEL;
      case "file":
      default:
        return ctx.ANTHROPIC_CHAT_MODEL;
    }
  };
  request = async (params, context, onStream) => {
    const provider = createAnthropic({
      baseURL: context.ANTHROPIC_API_BASE,
      apiKey: context.ANTHROPIC_API_KEY || void 0
    });
    const userMessage = params.messages.at(-1);
    const languageModelV1 = provider.languageModel(this.model(context, userMessage), void 0);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), onStream);
  };
}
function convertToOpenAIChatMessages({
  prompt: prompt2,
  useLegacyFunctionCalling = false,
  systemMessageMode = "system"
}) {
  const messages = [];
  for (const { role, content } of prompt2) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            messages.push({ role: "system", content });
            break;
          }
          case "developer": {
            messages.push({ role: "developer", content });
            break;
          }
          case "remove": {
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text") {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part) => {
            var _a16, _b2, _c2;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a16 = part.mimeType) != null ? _a16 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`,
                    // OpenAI specific extension: image detail
                    detail: (_c2 = (_b2 = part.providerMetadata) == null ? void 0 : _b2.openai) == null ? void 0 : _c2.imageDetail
                  }
                };
              }
              case "file": {
                if (part.data instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "'File content parts with URL data' functionality not supported."
                  });
                }
                switch (part.mimeType) {
                  case "audio/wav": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "wav" }
                    };
                  }
                  case "audio/mp3":
                  case "audio/mpeg": {
                    return {
                      type: "input_audio",
                      input_audio: { data: part.data, format: "mp3" }
                    };
                  }
                  default: {
                    throw new UnsupportedFunctionalityError({
                      functionality: `File content part type ${part.mimeType} in user messages`
                    });
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text2 = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text2 += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        if (useLegacyFunctionCalling) {
          if (toolCalls.length > 1) {
            throw new UnsupportedFunctionalityError({
              functionality: "useLegacyFunctionCalling with multiple tool calls in one message"
            });
          }
          messages.push({
            role: "assistant",
            content: text2,
            function_call: toolCalls.length > 0 ? toolCalls[0].function : void 0
          });
        } else {
          messages.push({
            role: "assistant",
            content: text2,
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0
          });
        }
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          if (useLegacyFunctionCalling) {
            messages.push({
              role: "function",
              name: toolResponse.toolName,
              content: JSON.stringify(toolResponse.result)
            });
          } else {
            messages.push({
              role: "tool",
              tool_call_id: toolResponse.toolCallId,
              content: JSON.stringify(toolResponse.result)
            });
          }
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function mapOpenAIChatLogProbsOutput(logprobs) {
  var _a16, _b2;
  return (_b2 = (_a16 = logprobs == null ? void 0 : logprobs.content) == null ? void 0 : _a16.map(({ token, logprob, top_logprobs }) => ({
    token,
    logprob,
    topLogprobs: top_logprobs ? top_logprobs.map(({ token: token2, logprob: logprob2 }) => ({
      token: token2,
      logprob: logprob2
    })) : []
  }))) != null ? _b2 : void 0;
}
function mapOpenAIFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var openaiErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: z.string().nullish(),
    param: z.any().nullish(),
    code: z.union([z.string(), z.number()]).nullish()
  })
});
var openaiFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: openaiErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
function getResponseMetadata$1({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function prepareTools$1({
  mode,
  useLegacyFunctionCalling = false,
  structuredOutputs
}) {
  var _a16;
  const tools2 = ((_a16 = mode.tools) == null ? void 0 : _a16.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools2 == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  if (useLegacyFunctionCalling) {
    const openaiFunctions = [];
    for (const tool2 of tools2) {
      if (tool2.type === "provider-defined") {
        toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
      } else {
        openaiFunctions.push({
          name: tool2.name,
          description: tool2.description,
          parameters: tool2.parameters
        });
      }
    }
    if (toolChoice == null) {
      return {
        functions: openaiFunctions,
        function_call: void 0,
        toolWarnings
      };
    }
    const type22 = toolChoice.type;
    switch (type22) {
      case "auto":
      case "none":
      case void 0:
        return {
          functions: openaiFunctions,
          function_call: void 0,
          toolWarnings
        };
      case "required":
        throw new UnsupportedFunctionalityError({
          functionality: "useLegacyFunctionCalling and toolChoice: required"
        });
      default:
        return {
          functions: openaiFunctions,
          function_call: { name: toolChoice.toolName },
          toolWarnings
        };
    }
  }
  const openaiTools = [];
  for (const tool2 of tools2) {
    if (tool2.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
    } else {
      openaiTools.push({
        type: "function",
        function: {
          name: tool2.name,
          description: tool2.description,
          parameters: tool2.parameters,
          strict: structuredOutputs ? true : void 0
        }
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools, tool_choice: void 0, toolWarnings };
  }
  const type2 = toolChoice.type;
  switch (type2) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools, tool_choice: type2, toolWarnings };
    case "tool":
      return {
        tools: openaiTools,
        tool_choice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type2;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var OpenAIChatLanguageModel2 = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsStructuredOutputs() {
    var _a16;
    return (_a16 = this.settings.structuredOutputs) != null ? _a16 : isReasoningModel(this.modelId);
  }
  get defaultObjectGenerationMode() {
    if (isAudioModel(this.modelId)) {
      return "tool";
    }
    return this.supportsStructuredOutputs ? "json" : "tool";
  }
  get provider() {
    return this.config.provider;
  }
  get supportsImageUrls() {
    return !this.settings.downloadImages;
  }
  getArgs({
    mode,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    providerMetadata
  }) {
    var _a16, _b2, _c2, _d2, _e2, _f2, _g, _h;
    const type2 = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if ((responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && !this.supportsStructuredOutputs) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is only supported with structuredOutputs"
      });
    }
    const useLegacyFunctionCalling = this.settings.useLegacyFunctionCalling;
    if (useLegacyFunctionCalling && this.settings.parallelToolCalls === true) {
      throw new UnsupportedFunctionalityError({
        functionality: "useLegacyFunctionCalling with parallelToolCalls"
      });
    }
    if (useLegacyFunctionCalling && this.supportsStructuredOutputs) {
      throw new UnsupportedFunctionalityError({
        functionality: "structuredOutputs with useLegacyFunctionCalling"
      });
    }
    if (getSystemMessageMode(this.modelId) === "remove" && prompt2.some((message) => message.role === "system")) {
      warnings.push({
        type: "other",
        message: "system messages are removed for this model"
      });
    }
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs: this.settings.logprobs === true || typeof this.settings.logprobs === "number" ? true : void 0,
      top_logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      user: this.settings.user,
      parallel_tool_calls: this.settings.parallelToolCalls,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? this.supportsStructuredOutputs && responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          strict: true,
          name: (_a16 = responseFormat.name) != null ? _a16 : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed,
      // openai specific settings:
      // TODO remove in next major version; we auto-map maxTokens now
      max_completion_tokens: (_b2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _b2.maxCompletionTokens,
      store: (_c2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _c2.store,
      metadata: (_d2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _d2.metadata,
      prediction: (_e2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _e2.prediction,
      reasoning_effort: (_g = (_f2 = providerMetadata == null ? void 0 : providerMetadata.openai) == null ? void 0 : _f2.reasoningEffort) != null ? _g : this.settings.reasoningEffort,
      // messages:
      messages: convertToOpenAIChatMessages({
        prompt: prompt2,
        useLegacyFunctionCalling,
        systemMessageMode: getSystemMessageMode(this.modelId)
      })
    };
    if (isReasoningModel(this.modelId)) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "temperature",
          details: "temperature is not supported for reasoning models"
        });
      }
      if (baseArgs.top_p != null) {
        baseArgs.top_p = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "topP",
          details: "topP is not supported for reasoning models"
        });
      }
      if (baseArgs.frequency_penalty != null) {
        baseArgs.frequency_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "frequencyPenalty",
          details: "frequencyPenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.presence_penalty != null) {
        baseArgs.presence_penalty = void 0;
        warnings.push({
          type: "unsupported-setting",
          setting: "presencePenalty",
          details: "presencePenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.logit_bias != null) {
        baseArgs.logit_bias = void 0;
        warnings.push({
          type: "other",
          message: "logitBias is not supported for reasoning models"
        });
      }
      if (baseArgs.logprobs != null) {
        baseArgs.logprobs = void 0;
        warnings.push({
          type: "other",
          message: "logprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.top_logprobs != null) {
        baseArgs.top_logprobs = void 0;
        warnings.push({
          type: "other",
          message: "topLogprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.max_tokens != null) {
        if (baseArgs.max_completion_tokens == null) {
          baseArgs.max_completion_tokens = baseArgs.max_tokens;
        }
        baseArgs.max_tokens = void 0;
      }
    }
    switch (type2) {
      case "regular": {
        const { tools: tools2, tool_choice, functions, function_call, toolWarnings } = prepareTools$1({
          mode,
          useLegacyFunctionCalling,
          structuredOutputs: this.supportsStructuredOutputs
        });
        return {
          args: {
            ...baseArgs,
            tools: tools2,
            tool_choice,
            functions,
            function_call
          },
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: {
            ...baseArgs,
            response_format: this.supportsStructuredOutputs && mode.schema != null ? {
              type: "json_schema",
              json_schema: {
                schema: mode.schema,
                strict: true,
                name: (_h = mode.name) != null ? _h : "response",
                description: mode.description
              }
            } : { type: "json_object" }
          },
          warnings
        };
      }
      case "object-tool": {
        return {
          args: useLegacyFunctionCalling ? {
            ...baseArgs,
            function_call: {
              name: mode.tool.name
            },
            functions: [
              {
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters
              }
            ]
          } : {
            ...baseArgs,
            tool_choice: {
              type: "function",
              function: { name: mode.tool.name }
            },
            tools: [
              {
                type: "function",
                function: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  parameters: mode.tool.parameters,
                  strict: this.supportsStructuredOutputs ? true : void 0
                }
              }
            ]
          },
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a16, _b2, _c2, _d2, _e2, _f2, _g, _h;
    const { args: body, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = body;
    const choice = response.choices[0];
    const completionTokenDetails = (_a16 = response.usage) == null ? void 0 : _a16.completion_tokens_details;
    const promptTokenDetails = (_b2 = response.usage) == null ? void 0 : _b2.prompt_tokens_details;
    const providerMetadata = { openai: {} };
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens) != null) {
      providerMetadata.openai.reasoningTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.reasoning_tokens;
    }
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
      providerMetadata.openai.acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
    }
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
      providerMetadata.openai.rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
    }
    if ((promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens) != null) {
      providerMetadata.openai.cachedPromptTokens = promptTokenDetails == null ? void 0 : promptTokenDetails.cached_tokens;
    }
    return {
      text: (_c2 = choice.message.content) != null ? _c2 : void 0,
      toolCalls: this.settings.useLegacyFunctionCalling && choice.message.function_call ? [
        {
          toolCallType: "function",
          toolCallId: generateId(),
          toolName: choice.message.function_call.name,
          args: choice.message.function_call.arguments
        }
      ] : (_d2 = choice.message.tool_calls) == null ? void 0 : _d2.map((toolCall) => {
        var _a22;
        return {
          toolCallType: "function",
          toolCallId: (_a22 = toolCall.id) != null ? _a22 : generateId(),
          toolName: toolCall.function.name,
          args: toolCall.function.arguments
        };
      }),
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      usage: {
        promptTokens: (_f2 = (_e2 = response.usage) == null ? void 0 : _e2.prompt_tokens) != null ? _f2 : NaN,
        completionTokens: (_h = (_g = response.usage) == null ? void 0 : _g.completion_tokens) != null ? _h : NaN
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(body) },
      response: getResponseMetadata$1(response),
      warnings,
      logprobs: mapOpenAIChatLogProbsOutput(choice.logprobs),
      providerMetadata
    };
  }
  async doStream(options) {
    var _a16;
    if ((_a16 = this.settings.simulateStreaming) != null ? _a16 : isStreamingSimulatedByDefault(this.modelId)) {
      const result = await this.doGenerate(options);
      const simulatedStream = new ReadableStream({
        start(controller) {
          controller.enqueue({ type: "response-metadata", ...result.response });
          if (result.text) {
            controller.enqueue({
              type: "text-delta",
              textDelta: result.text
            });
          }
          if (result.toolCalls) {
            for (const toolCall of result.toolCalls) {
              controller.enqueue({
                type: "tool-call-delta",
                toolCallType: "function",
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                argsTextDelta: toolCall.args
              });
              controller.enqueue({
                type: "tool-call",
                ...toolCall
              });
            }
          }
          controller.enqueue({
            type: "finish",
            finishReason: result.finishReason,
            usage: result.usage,
            logprobs: result.logprobs,
            providerMetadata: result.providerMetadata
          });
          controller.close();
        }
      });
      return {
        stream: simulatedStream,
        rawCall: result.rawCall,
        rawResponse: result.rawResponse,
        warnings: result.warnings
      };
    }
    const { args, warnings } = this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
    };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiChatChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const toolCalls = [];
    let finishReason = "unknown";
    let usage = {
      promptTokens: void 0,
      completionTokens: void 0
    };
    let logprobs;
    let isFirstChunk = true;
    const { useLegacyFunctionCalling } = this.settings;
    const providerMetadata = { openai: {} };
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a22, _b2, _c2, _d2, _e2, _f2, _g, _h, _i, _j, _k, _l;
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$1(value)
              });
            }
            if (value.usage != null) {
              const {
                prompt_tokens,
                completion_tokens,
                prompt_tokens_details,
                completion_tokens_details
              } = value.usage;
              usage = {
                promptTokens: prompt_tokens != null ? prompt_tokens : void 0,
                completionTokens: completion_tokens != null ? completion_tokens : void 0
              };
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens) != null) {
                providerMetadata.openai.reasoningTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.reasoning_tokens;
              }
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens) != null) {
                providerMetadata.openai.acceptedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.accepted_prediction_tokens;
              }
              if ((completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens) != null) {
                providerMetadata.openai.rejectedPredictionTokens = completion_tokens_details == null ? void 0 : completion_tokens_details.rejected_prediction_tokens;
              }
              if ((prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens) != null) {
                providerMetadata.openai.cachedPromptTokens = prompt_tokens_details == null ? void 0 : prompt_tokens_details.cached_tokens;
              }
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            if (delta.content != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: delta.content
              });
            }
            const mappedLogprobs = mapOpenAIChatLogProbsOutput(
              choice == null ? void 0 : choice.logprobs
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0) logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
            const mappedToolCalls = useLegacyFunctionCalling && delta.function_call != null ? [
              {
                type: "function",
                id: generateId(),
                function: delta.function_call,
                index: 0
              }
            ] : delta.tool_calls;
            if (mappedToolCalls != null) {
              for (const toolCallDelta of mappedToolCalls) {
                const index2 = toolCallDelta.index;
                if (toolCalls[index2] == null) {
                  if (toolCallDelta.type !== "function") {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_a22 = toolCallDelta.function) == null ? void 0 : _a22.name) == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`
                    });
                  }
                  toolCalls[index2] = {
                    id: toolCallDelta.id,
                    type: "function",
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: (_b2 = toolCallDelta.function.arguments) != null ? _b2 : ""
                    },
                    hasFinished: false
                  };
                  const toolCall2 = toolCalls[index2];
                  if (((_c2 = toolCall2.function) == null ? void 0 : _c2.name) != null && ((_d2 = toolCall2.function) == null ? void 0 : _d2.arguments) != null) {
                    if (toolCall2.function.arguments.length > 0) {
                      controller.enqueue({
                        type: "tool-call-delta",
                        toolCallType: "function",
                        toolCallId: toolCall2.id,
                        toolName: toolCall2.function.name,
                        argsTextDelta: toolCall2.function.arguments
                      });
                    }
                    if (isParsableJson(toolCall2.function.arguments)) {
                      controller.enqueue({
                        type: "tool-call",
                        toolCallType: "function",
                        toolCallId: (_e2 = toolCall2.id) != null ? _e2 : generateId(),
                        toolName: toolCall2.function.name,
                        args: toolCall2.function.arguments
                      });
                      toolCall2.hasFinished = true;
                    }
                  }
                  continue;
                }
                const toolCall = toolCalls[index2];
                if (toolCall.hasFinished) {
                  continue;
                }
                if (((_f2 = toolCallDelta.function) == null ? void 0 : _f2.arguments) != null) {
                  toolCall.function.arguments += (_h = (_g = toolCallDelta.function) == null ? void 0 : _g.arguments) != null ? _h : "";
                }
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: (_i = toolCallDelta.function.arguments) != null ? _i : ""
                });
                if (((_j = toolCall.function) == null ? void 0 : _j.name) != null && ((_k = toolCall.function) == null ? void 0 : _k.arguments) != null && isParsableJson(toolCall.function.arguments)) {
                  controller.enqueue({
                    type: "tool-call",
                    toolCallType: "function",
                    toolCallId: (_l = toolCall.id) != null ? _l : generateId(),
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments
                  });
                  toolCall.hasFinished = true;
                }
              }
            }
          },
          flush(controller) {
            var _a22, _b2;
            controller.enqueue({
              type: "finish",
              finishReason,
              logprobs,
              usage: {
                promptTokens: (_a22 = usage.promptTokens) != null ? _a22 : NaN,
                completionTokens: (_b2 = usage.completionTokens) != null ? _b2 : NaN
              },
              ...providerMetadata != null ? { providerMetadata } : {}
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(body) },
      warnings
    };
  }
};
var openaiTokenUsageSchema = z.object({
  prompt_tokens: z.number().nullish(),
  completion_tokens: z.number().nullish(),
  prompt_tokens_details: z.object({
    cached_tokens: z.number().nullish()
  }).nullish(),
  completion_tokens_details: z.object({
    reasoning_tokens: z.number().nullish(),
    accepted_prediction_tokens: z.number().nullish(),
    rejected_prediction_tokens: z.number().nullish()
  }).nullish()
}).nullish();
var openaiChatResponseSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal("assistant").nullish(),
        content: z.string().nullish(),
        function_call: z.object({
          arguments: z.string(),
          name: z.string()
        }).nullish(),
        tool_calls: z.array(
          z.object({
            id: z.string().nullish(),
            type: z.literal("function"),
            function: z.object({
              name: z.string(),
              arguments: z.string()
            })
          })
        ).nullish()
      }),
      index: z.number(),
      logprobs: z.object({
        content: z.array(
          z.object({
            token: z.string(),
            logprob: z.number(),
            top_logprobs: z.array(
              z.object({
                token: z.string(),
                logprob: z.number()
              })
            )
          })
        ).nullable()
      }).nullish(),
      finish_reason: z.string().nullish()
    })
  ),
  usage: openaiTokenUsageSchema
});
var openaiChatChunkSchema = z.union([
  z.object({
    id: z.string().nullish(),
    created: z.number().nullish(),
    model: z.string().nullish(),
    choices: z.array(
      z.object({
        delta: z.object({
          role: z.enum(["assistant"]).nullish(),
          content: z.string().nullish(),
          function_call: z.object({
            name: z.string().optional(),
            arguments: z.string().optional()
          }).nullish(),
          tool_calls: z.array(
            z.object({
              index: z.number(),
              id: z.string().nullish(),
              type: z.literal("function").optional(),
              function: z.object({
                name: z.string().nullish(),
                arguments: z.string().nullish()
              })
            })
          ).nullish()
        }).nullish(),
        logprobs: z.object({
          content: z.array(
            z.object({
              token: z.string(),
              logprob: z.number(),
              top_logprobs: z.array(
                z.object({
                  token: z.string(),
                  logprob: z.number()
                })
              )
            })
          ).nullable()
        }).nullish(),
        finish_reason: z.string().nullable().optional(),
        index: z.number()
      })
    ),
    usage: openaiTokenUsageSchema
  }),
  openaiErrorDataSchema
]);
function isReasoningModel(modelId) {
  return modelId === "o1" || modelId.startsWith("o1-") || modelId === "o3" || modelId.startsWith("o3-");
}
function isAudioModel(modelId) {
  return modelId.startsWith("gpt-4o-audio-preview");
}
function getSystemMessageMode(modelId) {
  var _a16, _b2;
  if (!isReasoningModel(modelId)) {
    return "system";
  }
  return (_b2 = (_a16 = reasoningModels[modelId]) == null ? void 0 : _a16.systemMessageMode) != null ? _b2 : "developer";
}
function isStreamingSimulatedByDefault(modelId) {
  var _a16, _b2;
  if (!isReasoningModel(modelId)) {
    return false;
  }
  return (_b2 = (_a16 = reasoningModels[modelId]) == null ? void 0 : _a16.simulateStreamingByDefault) != null ? _b2 : true;
}
var reasoningModels = {
  "o1-mini": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o1-mini-2024-09-12": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o1-preview": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o1-preview-2024-09-12": {
    systemMessageMode: "remove",
    simulateStreamingByDefault: false
  },
  "o3-mini": {
    systemMessageMode: "developer",
    simulateStreamingByDefault: false
  },
  "o3-mini-2025-01-31": {
    systemMessageMode: "developer",
    simulateStreamingByDefault: false
  }
};
function convertToOpenAICompletionPrompt({
  prompt: prompt2,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (inputFormat === "prompt" && prompt2.length === 1 && prompt2[0].role === "user" && prompt2[0].content.length === 1 && prompt2[0].content[0].type === "text") {
    return { prompt: prompt2[0].content[0].text };
  }
  let text2 = "";
  if (prompt2[0].role === "system") {
    text2 += `${prompt2[0].content}

`;
    prompt2 = prompt2.slice(1);
  }
  for (const { role, content } of prompt2) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt: prompt2
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "image": {
              throw new UnsupportedFunctionalityError({
                functionality: "images"
              });
            }
          }
        }).join("");
        text2 += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text2 += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text2 += `${assistant}:
`;
  return {
    prompt: text2,
    stopSequences: [`
${user}:`]
  };
}
function mapOpenAICompletionLogProbs(logprobs) {
  return logprobs == null ? void 0 : logprobs.tokens.map((token, index2) => ({
    token,
    logprob: logprobs.token_logprobs[index2],
    topLogprobs: logprobs.top_logprobs ? Object.entries(logprobs.top_logprobs[index2]).map(
      ([token2, logprob]) => ({
        token: token2,
        logprob
      })
    ) : []
  }));
}
var OpenAICompletionLanguageModel2 = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    inputFormat,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed
  }) {
    var _a16;
    const type2 = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt({ prompt: prompt2, inputFormat });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stop.length > 0 ? stop : void 0
    };
    switch (type2) {
      case "regular": {
        if ((_a16 = mode.tools) == null ? void 0 : _a16.length) {
          throw new UnsupportedFunctionalityError({
            functionality: "tools"
          });
        }
        if (mode.toolChoice) {
          throw new UnsupportedFunctionalityError({
            functionality: "toolChoice"
          });
        }
        return { args: baseArgs, warnings };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiCompletionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: choice.text,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      },
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      logprobs: mapOpenAICompletionLogProbs(choice.logprobs),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: getResponseMetadata$1(response),
      warnings,
      request: { body: JSON.stringify(args) }
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options: this.config.compatibility === "strict" ? { include_usage: true } : void 0
    };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiCompletionChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let logprobs;
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata$1(value)
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.text) != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: choice.text
              });
            }
            const mappedLogprobs = mapOpenAICompletionLogProbs(
              choice == null ? void 0 : choice.logprobs
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0) logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              logprobs,
              usage
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body: JSON.stringify(body) }
    };
  }
};
var openaiCompletionResponseSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      text: z.string(),
      finish_reason: z.string(),
      logprobs: z.object({
        tokens: z.array(z.string()),
        token_logprobs: z.array(z.number()),
        top_logprobs: z.array(z.record(z.string(), z.number())).nullable()
      }).nullish()
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number()
  })
});
var openaiCompletionChunkSchema = z.union([
  z.object({
    id: z.string().nullish(),
    created: z.number().nullish(),
    model: z.string().nullish(),
    choices: z.array(
      z.object({
        text: z.string(),
        finish_reason: z.string().nullish(),
        index: z.number(),
        logprobs: z.object({
          tokens: z.array(z.string()),
          token_logprobs: z.array(z.number()),
          top_logprobs: z.array(z.record(z.string(), z.number())).nullable()
        }).nullish()
      })
    ),
    usage: z.object({
      prompt_tokens: z.number(),
      completion_tokens: z.number()
    }).nullish()
  }),
  openaiErrorDataSchema
]);
var OpenAIEmbeddingModel2 = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a16;
    return (_a16 = this.settings.maxEmbeddingsPerCall) != null ? _a16 : 2048;
  }
  get supportsParallelCalls() {
    var _a16;
    return (_a16 = this.settings.supportsParallelCalls) != null ? _a16 : true;
  }
  async doEmbed({
    values,
    headers,
    abortSignal
  }) {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await postJsonToApi({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float",
        dimensions: this.settings.dimensions,
        user: this.settings.user
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiTextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      rawResponse: { headers: responseHeaders }
    };
  }
};
var openaiTextEmbeddingResponseSchema = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })),
  usage: z.object({ prompt_tokens: z.number() }).nullish()
});
function createAzure(options = {}) {
  var _a16;
  const getHeaders = () => ({
    "api-key": loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "AZURE_API_KEY",
      description: "Azure OpenAI"
    }),
    ...options.headers
  });
  const getResourceName = () => loadSetting({
    settingValue: options.resourceName,
    settingName: "resourceName",
    environmentVariableName: "AZURE_RESOURCE_NAME",
    description: "Azure OpenAI resource name"
  });
  const apiVersion = (_a16 = options.apiVersion) != null ? _a16 : "2024-10-01-preview";
  const url = ({ path, modelId }) => options.baseURL ? `${options.baseURL}/${modelId}${path}?api-version=${apiVersion}` : `https://${getResourceName()}.openai.azure.com/openai/deployments/${modelId}${path}?api-version=${apiVersion}`;
  const createChatModel = (deploymentName, settings = {}) => new OpenAIChatLanguageModel2(deploymentName, settings, {
    provider: "azure-openai.chat",
    url,
    headers: getHeaders,
    compatibility: "strict",
    fetch: options.fetch
  });
  const createCompletionModel = (modelId, settings = {}) => new OpenAICompletionLanguageModel2(modelId, settings, {
    provider: "azure-openai.completion",
    url,
    compatibility: "strict",
    headers: getHeaders,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new OpenAIEmbeddingModel2(modelId, settings, {
    provider: "azure-openai.embeddings",
    headers: getHeaders,
    url,
    fetch: options.fetch
  });
  const provider = function(deploymentId, settings) {
    if (new.target) {
      throw new Error(
        "The Azure OpenAI model function cannot be called with the new keyword."
      );
    }
    return createChatModel(deploymentId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
createAzure();
async function loadHistory(key, length) {
  let history = [];
  try {
    history = JSON.parse(await ENV.DATABASE.get(key));
  } catch (e) {
    console.error(e);
  }
  if (!history || !Array.isArray(history)) {
    history = [];
  }
  const trimHistory = (list, maxLength) => {
    if (maxLength >= 0 && list.length > maxLength) {
      list = list.splice(list.length - maxLength);
    }
    return list;
  };
  if (ENV.AUTO_TRIM_HISTORY) {
    history = trimHistory(history, length);
  }
  return history;
}
async function requestCompletionsFromLLM(params, context, agent, modifier, onStream) {
  let history = context.MIDDLE_CONTEXT.history;
  const historyDisable = context.USER_CONFIG.MAX_HISTORY_LENGTH <= 0;
  if (modifier) {
    const modifierData = modifier(history, params);
    history = modifierData.history;
    params = modifierData.message;
  }
  if (params === null) {
    throw new Error("Message is null");
  }
  const messages = [...history, params];
  if (context.USER_CONFIG.SYSTEM_INIT_MESSAGE) {
    messages.unshift({
      role: "system",
      content: context.USER_CONFIG.SYSTEM_INIT_MESSAGE
    });
  }
  const llmParams = {
    messages
  };
  const answer = await agent.request(llmParams, context.USER_CONFIG, onStream);
  const { messages: raw_messages } = answer;
  if (answer.content.trim() === "" && raw_messages.at(-1)?.role === "assistant") {
    throw new Error("Response is empty");
  }
  if (!historyDisable) {
    if (raw_messages.at(-1)?.role === "assistant") {
      history.push(params);
      history.push(...raw_messages);
      await storeHistory(history, context);
    }
  }
  return answer;
}
async function requestText2Image(url, headers, body, render) {
  console.log("start generate image.");
  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  const result = await render(resp, body.prompt);
  if (result.message) {
    throw new Error(result.message);
  }
  return result;
}
async function storeHistory(history, context) {
  const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
  const userMessage = history.findLast((h) => h.role === "user");
  if (ENV.HISTORY_IMAGE_PLACEHOLDER && Array.isArray(userMessage?.content) && userMessage.content.length > 0) {
    userMessage.content = userMessage.content.map((c) => c.type === "text" ? c.text : `[${c.type}]`).join("\n");
  }
  await ENV.DATABASE.put(historyKey, JSON.stringify(history)).catch(console.error);
  log.info(`[STORE HISTORY] DONE`);
}
class AzureChatAI {
  name = "azure";
  modelKey = "AZURE_CHAT_MODEL";
  enable = (context) => {
    return !!(context.AZURE_API_KEY && context.AZURE_RESOURCE_NAME && context.AZURE_CHAT_MODEL);
  };
  model = (ctx, params) => {
    const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : "text";
    switch (msgType) {
      case "image":
        return ctx.AZURE_VISION_MODEL;
      case "file":
      default:
        return ctx.AZURE_CHAT_MODEL;
    }
  };
  request = async (params, context, onStream) => {
    const provider = createAzure({
      resourceName: context.AZURE_RESOURCE_NAME || void 0,
      apiKey: context.AZURE_API_KEY || void 0
    });
    const userMessage = params.messages.at(-1);
    const languageModelV1 = provider.languageModel(this.model(context, userMessage), void 0);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), onStream);
  };
}
_request_dec = [Log];
class AzureImageAI {
  constructor() {
    __publicField(this, "name", "azure");
    __publicField(this, "modelKey", "AZURE_IMAGE_MODEL");
    __publicField(this, "enable", (context) => {
      return !!(context.AZURE_API_KEY && context.AZURE_RESOURCE_NAME && context.AZURE_IMAGE_MODEL);
    });
    __publicField(this, "model", (ctx) => {
      return ctx.AZURE_IMAGE_MODEL || "";
    });
    __publicField(this, "request", __runInitializers(_init, 8, this, async (prompt2, context, extraParams) => {
      const url = `https://${context.AZURE_RESOURCE_NAME}.openai.azure.com/openai/deployments/${context.AZURE_IMAGE_MODEL}/chat/completions?${context.AZURE_API_VERSION}`;
      if (!url || !context.AZURE_API_KEY) {
        throw new Error("Azure DALL-E API is not set");
      }
      const header = {
        "Content-Type": "application/json",
        "api-key": context.AZURE_API_KEY
      };
      const { n = 1, size, style, quality } = extraParams || {};
      const body = {
        prompt: prompt2,
        n,
        size: size || context.DALL_E_IMAGE_SIZE,
        style: style || context.DALL_E_IMAGE_STYLE,
        quality: quality || context.DALL_E_IMAGE_QUALITY
      };
      const validSize = ["1792x1024", "1024x1024", "1024x1792"];
      if (!validSize.includes(body.size)) {
        body.size = "1024x1024";
      }
      return requestText2Image(url, header, body, this.render);
    })), __runInitializers(_init, 11, this);
    __publicField(this, "render", async (response, prompt2) => {
      const resp = await response.json();
      if (resp.error?.message) {
        throw new Error(resp.error.message);
      }
      return {
        type: "image",
        url: resp?.data?.map((i) => i?.url),
        text: resp?.data?.[0]?.revised_prompt || prompt2
      };
    });
  }
}
_init = __decoratorStart(null);
__decorateElement(_init, 5, "request", _request_dec, AzureImageAI);
__decoratorMetadata(_init, AzureImageAI);
class Cohere {
  name = "cohere";
  modelKey = "COHERE_CHAT_MODEL";
  enable = (context) => {
    return !!context.COHERE_API_KEY;
  };
  model = (ctx) => {
    return ctx.COHERE_CHAT_MODEL;
  };
  request = async (params, context, onStream) => {
    const provider = createCohere({
      baseURL: context.COHERE_API_BASE,
      apiKey: context.COHERE_API_KEY || void 0
    });
    const languageModelV1 = provider.languageModel(this.model(context), void 0);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), onStream);
  };
}
class Google {
  name = "google";
  modelKey = "GOOGLE_CHAT_MODEL";
  enable = (context) => {
    return !!context.GOOGLE_API_KEY;
  };
  model = (ctx, params) => {
    const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : "text";
    switch (msgType) {
      case "image":
        return ctx.GOOGLE_VISION_MODEL;
      case "file":
      default:
        return ctx.GOOGLE_CHAT_MODEL;
    }
  };
  request = async (params, context, onStream) => {
    const userMessage = handleUrl(params.messages.at(-1));
    const languageModelV1 = await createLlmModel(this.model(context, userMessage), context);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), onStream);
  };
}
function handleUrl(messages, isVertex = false) {
  if (typeof messages.content === "string") {
    const { data = [], text: text2 } = extractUrls(messages.content, isVertex);
    if (data.length > 0) {
      const newMessage = [];
      newMessage.push({
        type: "text",
        text: text2
      });
      data.forEach((i) => newMessage.push({
        type: i.type,
        [i.type === "image" ? "url" : "data"]: i.url,
        mimeType: i.mimeType
      }));
      messages.content = newMessage;
    }
  }
  return messages;
}
function extractUrls(str, isVertex = false) {
  const supportTypes = {
    pdf: "application/pdf",
    mp3: "audio/mpeg",
    aac: "audio/aac",
    flac: "audio/flac",
    ogg: "audio/ogg",
    wav: "audio/wav",
    mp4: "video/mp4",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    js: "text/javascript",
    py: "text/x-python",
    css: "text/css",
    xml: "application/xml",
    csv: "text/csv",
    rtf: "text/rtf",
    txt: "text/plain",
    md: "text/markdown"
  };
  const urlRegex = new RegExp(`https?://\\S+\\.(${Object.keys(supportTypes).join("|")})`, "g");
  const matches = [...str.matchAll(urlRegex)];
  if (isVertex) {
    matches.push(...str.matchAll(/https?:\/\/(youtu\.be|www\.youtube\.com)\/.+/g));
  }
  return {
    data: matches.map((i) => {
      const type2 = i[1];
      return {
        mimeType: supportTypes[type2] || "video/webm",
        url: i[0],
        type: supportTypes[type2]?.startsWith("image") ? "image" : "file"
      };
    }),
    text: str.replace(urlRegex, "").trim()
  };
}
_request_dec2 = [Log];
class KlingAI {
  constructor() {
    __publicField(this, "name", "kling");
    __publicField(this, "enable", (context) => {
      return context.KLINGAI_COOKIE.length > 0;
    });
    __publicField(this, "model", (_ctx) => {
      return "kling";
    });
    __publicField(this, "request", __runInitializers(_init2, 8, this, async (prompt2, context, extraParams) => {
      const { n, radio, inputs = [], args, type: type2 } = extraParams || {};
      const COOKIES = context.KLINGAI_COOKIE;
      let cookie = "";
      if (COOKIES.length > 0) {
        cookie = COOKIES[Math.floor(Math.random() * COOKIES.length)];
      } else {
        throw new Error("No KlingAI cookie found");
      }
      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Cookie": cookie
      };
      const body = {
        arguments: [
          { name: "prompt", value: prompt2 },
          { name: "style", value: "默认" },
          { name: "aspect_ratio", value: radio || context.KLINGAI_IMAGE_RATIO },
          { name: "imageCount", value: n || context.KLINGAI_IMAGE_COUNT },
          { name: "biz", value: "klingai" },
          ...args || []
        ],
        type: type2 || "mmu_txt2img_aiweb",
        inputs
      };
      const resp = await fetch(`https://klingai.com/api/task/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      }).then((res) => res.json());
      const taskId = resp.data?.task?.id;
      if (!taskId) {
        console.error(JSON.stringify(resp));
        throw new Error(resp.data?.message || "Failed to get task id, see logs for more details");
      }
      return this.handleTask(taskId, headers, prompt2);
    })), __runInitializers(_init2, 11, this);
    __publicField(this, "handleTask", async (taskId, headers, prompt2) => {
      const MAX_WAIT_TIME = 6e5;
      const startTime = Date.now();
      while (true) {
        const resp = await fetch(`https://klingai.com/api/task/status?taskId=${taskId}`, {
          headers
        }).then((res) => res.json());
        if ([5, 98, 99].includes(resp.data?.status)) {
          const urls = resp.data.works.map(({ resource }) => resource.resource).filter(Boolean);
          if (urls.length > 0) {
            log.info(`KlingAI image urls: ${urls.join(", ")}`);
            return this.render(urls, prompt2);
          }
        } else if (resp.data?.status !== 10) {
          log.error(JSON.stringify(resp));
          throw new Error(`${resp.data?.message || resp.message || JSON.stringify(resp)}`);
        }
        if (Date.now() - startTime > MAX_WAIT_TIME) {
          throw new Error(`KlingAI Task timeout`);
        }
        await new Promise((resolve2) => setTimeout(resolve2, 1e4));
      }
    });
    __publicField(this, "getFileUrl", async (file_id, context, headers) => {
      const api = createTelegramBotAPI(context.SHARE_CONTEXT.botToken);
      const img_path = (await api.getFileWithReturns({ file_id }).then((res) => res.result)).file_path;
      const img_blob = await fetch(`https://api.telegram.org/file/bot${context.SHARE_CONTEXT.botToken}/${img_path}`, {}).then((res) => res.blob());
      const { token, domain } = await this.getUploadFileTokenAndEndpoint(headers);
      await fetch(`https://${domain}/api/upload/fragment?upload_token=${token}&fragment_id=0`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/octet-stream"
        },
        body: img_blob
      });
      await fetch(`https://${domain}/api/upload/complete?fragment_count=1&upload_token=${token}`, {
        method: "POST",
        headers
      });
      const url_resp = await fetch(`https://klingai.com/api/upload/verify/token?token=${token}`, {
        headers
      }).then((res) => res.json());
      if (!url_resp.data?.url) {
        throw new Error(url_resp.data.message || "Failed to get file url, see logs for more details");
      }
      return url_resp.data.url;
    });
    __publicField(this, "getUploadFileTokenAndEndpoint", async (headers) => {
      const resp = await fetch(`https://klingai.com/api/upload/issue/token?filename=image.jpg`, {
        headers
      }).then((res) => res.json());
      if (!resp.data.token || !resp.data?.httpEndpoints?.[0]) {
        throw new Error(`Failed to upload file, see logs for more details`);
      }
      return {
        token: resp.data.token,
        domain: resp.data.httpEndpoints[0]
      };
    });
    __publicField(this, "render", async (data, prompt2) => {
      return { type: "image", url: data, text: prompt2 };
    });
  }
}
_init2 = __decoratorStart(null);
__decorateElement(_init2, 5, "request", _request_dec2, KlingAI);
__decoratorMetadata(_init2, KlingAI);
function convertToMistralChatMessages(prompt2) {
  const messages = [];
  for (let i = 0; i < prompt2.length; i++) {
    const { role, content } = prompt2[i];
    const isLastMessage = i === prompt2.length - 1;
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          content: content.map((part) => {
            var _a16;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: part.image instanceof URL ? part.image.toString() : `data:${(_a16 = part.mimeType) != null ? _a16 : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
                };
              }
              case "file": {
                throw new UnsupportedFunctionalityError({
                  functionality: "File content parts in user messages"
                });
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text2 = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text2 += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text2,
          prefix: isLastMessage ? true : void 0,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          messages.push({
            role: "tool",
            name: toolResponse.toolName,
            content: JSON.stringify(toolResponse.result),
            tool_call_id: toolResponse.toolCallId
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}
function mapMistralFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
    case "model_length":
      return "length";
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}
var mistralErrorDataSchema = z.object({
  object: z.literal("error"),
  message: z.string(),
  type: z.string(),
  param: z.string().nullable(),
  code: z.string().nullable()
});
var mistralFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: mistralErrorDataSchema,
  errorToMessage: (data) => data.message
});
function getResponseMetadata({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
function prepareTools(mode) {
  var _a16;
  const tools2 = ((_a16 = mode.tools) == null ? void 0 : _a16.length) ? mode.tools : void 0;
  const toolWarnings = [];
  if (tools2 == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const mistralTools = [];
  for (const tool2 of tools2) {
    if (tool2.type === "provider-defined") {
      toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
    } else {
      mistralTools.push({
        type: "function",
        function: {
          name: tool2.name,
          description: tool2.description,
          parameters: tool2.parameters
        }
      });
    }
  }
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: mistralTools, tool_choice: void 0, toolWarnings };
  }
  const type2 = toolChoice.type;
  switch (type2) {
    case "auto":
    case "none":
      return { tools: mistralTools, tool_choice: type2, toolWarnings };
    case "required":
      return { tools: mistralTools, tool_choice: "any", toolWarnings };
    case "tool":
      return {
        tools: mistralTools.filter(
          (tool2) => tool2.function.name === toolChoice.toolName
        ),
        tool_choice: "any",
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type2;
      throw new UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var MistralChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsImageUrls = false;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    prompt: prompt2,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed
  }) {
    const type2 = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences"
      });
    }
    if (responseFormat != null && responseFormat.type === "json" && responseFormat.schema != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is not supported"
      });
    }
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      safe_prompt: this.settings.safePrompt,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      random_seed: seed,
      // response format:
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? { type: "json_object" } : void 0,
      // messages:
      messages: convertToMistralChatMessages(prompt2)
    };
    switch (type2) {
      case "regular": {
        const { tools: tools2, tool_choice, toolWarnings } = prepareTools(mode);
        return {
          args: { ...baseArgs, tools: tools2, tool_choice },
          warnings: [...warnings, ...toolWarnings]
        };
      }
      case "object-json": {
        return {
          args: {
            ...baseArgs,
            response_format: { type: "json_object" }
          },
          warnings
        };
      }
      case "object-tool": {
        return {
          args: {
            ...baseArgs,
            tool_choice: "any",
            tools: [{ type: "function", function: mode.tool }]
          },
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type2;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a16;
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: mistralFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        mistralChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    let text2 = extractTextContent(choice.message.content);
    const lastMessage = rawPrompt[rawPrompt.length - 1];
    if (lastMessage.role === "assistant" && (text2 == null ? void 0 : text2.startsWith(lastMessage.content))) {
      text2 = text2.slice(lastMessage.content.length);
    }
    return {
      text: text2,
      toolCalls: (_a16 = choice.message.tool_calls) == null ? void 0 : _a16.map((toolCall) => ({
        toolCallType: "function",
        toolCallId: toolCall.id,
        toolName: toolCall.function.name,
        args: toolCall.function.arguments
      })),
      finishReason: mapMistralFinishReason(choice.finish_reason),
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(args) },
      response: getResponseMetadata(response),
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const body = { ...args, stream: true };
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body,
      failedResponseHandler: mistralFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        mistralChatChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let chunkNumber = 0;
    let trimLeadingSpace = false;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            chunkNumber++;
            const value = chunk.value;
            if (chunkNumber === 1) {
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata(value)
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapMistralFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            const textContent = extractTextContent(delta.content);
            if (chunkNumber <= 2) {
              const lastMessage = rawPrompt[rawPrompt.length - 1];
              if (lastMessage.role === "assistant" && textContent === lastMessage.content.trimEnd()) {
                if (textContent.length < lastMessage.content.length) {
                  trimLeadingSpace = true;
                }
                return;
              }
            }
            if (textContent != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: trimLeadingSpace ? textContent.trimStart() : textContent
              });
              trimLeadingSpace = false;
            }
            if (delta.tool_calls != null) {
              for (const toolCall of delta.tool_calls) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: toolCall.function.arguments
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  args: toolCall.function.arguments
                });
              }
            }
          },
          flush(controller) {
            controller.enqueue({ type: "finish", finishReason, usage });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(body) },
      warnings
    };
  }
};
function extractTextContent(content) {
  return typeof content === "string" ? content : (content == null ? void 0 : content.type) === "text" ? content.text : void 0;
}
var mistralContentSchema = z.union([
  z.string(),
  z.object({
    type: z.literal("text"),
    text: z.string()
  }),
  z.object({
    type: z.literal("image_url"),
    image_url: z.union([
      z.string(),
      z.object({
        url: z.string(),
        detail: z.string().nullable()
      })
    ])
  }),
  z.object({
    type: z.literal("reference"),
    reference_ids: z.array(z.number())
  })
]).nullable();
var mistralChatResponseSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal("assistant"),
        content: mistralContentSchema,
        tool_calls: z.array(
          z.object({
            id: z.string(),
            function: z.object({ name: z.string(), arguments: z.string() })
          })
        ).nullish()
      }),
      index: z.number(),
      finish_reason: z.string().nullish()
    })
  ),
  object: z.literal("chat.completion"),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number()
  })
});
var mistralChatChunkSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      delta: z.object({
        role: z.enum(["assistant"]).optional(),
        content: mistralContentSchema,
        tool_calls: z.array(
          z.object({
            id: z.string(),
            function: z.object({ name: z.string(), arguments: z.string() })
          })
        ).nullish()
      }),
      finish_reason: z.string().nullish(),
      index: z.number()
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number()
  }).nullish()
});
var MistralEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a16;
    return (_a16 = this.settings.maxEmbeddingsPerCall) != null ? _a16 : 32;
  }
  get supportsParallelCalls() {
    var _a16;
    return (_a16 = this.settings.supportsParallelCalls) != null ? _a16 : false;
  }
  async doEmbed({
    values,
    abortSignal,
    headers
  }) {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/embeddings`,
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float"
      },
      failedResponseHandler: mistralFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        MistralTextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      rawResponse: { headers: responseHeaders }
    };
  }
};
var MistralTextEmbeddingResponseSchema = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })),
  usage: z.object({ prompt_tokens: z.number() }).nullish()
});
function createMistral(options = {}) {
  var _a16;
  const baseURL = (_a16 = withoutTrailingSlash(options.baseURL)) != null ? _a16 : "https://api.mistral.ai/v1";
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "MISTRAL_API_KEY",
      description: "Mistral"
    })}`,
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => new MistralChatLanguageModel(modelId, settings, {
    provider: "mistral.chat",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new MistralEmbeddingModel(modelId, settings, {
    provider: "mistral.embedding",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Mistral model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
createMistral();
class Mistral {
  name = "mistral";
  modelKey = "MISTRAL_CHAT_MODEL";
  enable = (context) => {
    return !!context.MISTRAL_API_KEY;
  };
  model = (ctx) => {
    return ctx.MISTRAL_CHAT_MODEL;
  };
  request = async (params, context, onStream) => {
    const provider = createMistral({
      baseURL: context.MISTRAL_API_BASE,
      apiKey: context.MISTRAL_API_KEY || void 0
    });
    const languageModelV1 = provider.languageModel(this.model(context), void 0);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), onStream);
  };
}
class OpenAIBase {
  name = "openai";
  enable = (context) => {
    return context.OPENAI_API_KEY.length > 0;
  };
  apikey = (context) => {
    const length = context.OPENAI_API_KEY.length;
    return context.OPENAI_API_KEY[Math.floor(Math.random() * length)];
  };
}
class OpenAI extends OpenAIBase {
  modelKey = "OPENAI_CHAT_MODEL";
  static transformModelPerfix = "TRANSFROM-";
  model = (ctx, params) => {
    const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : "text";
    switch (msgType) {
      case "image":
        return ctx.OPENAI_VISION_MODEL;
      case "file":
        return "gpt-4o-audio-preview";
      default:
        return ctx.OPENAI_CHAT_MODEL;
    }
  };
  request = async (params, context, onStream) => {
    const userMessage = params.messages.at(-1);
    const originalModel = this.model(context, userMessage);
    const provider = createOpenAI({
      baseURL: context.OPENAI_API_BASE,
      apiKey: this.apikey(context),
      compatibility: "strict",
      fetch: this.fetch(context)
    });
    const languageModelV1 = provider.languageModel(originalModel, void 0);
    const newOnStream = this.streamHandle(originalModel, context, onStream);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), newOnStream);
  };
  streamHandle = (model, context, onStream) => {
    if (Object.keys(context.DROPS_OPENAI_PARAMS).length > 0) {
      for (const [model_perfix, params] of Object.entries(context.DROPS_OPENAI_PARAMS)) {
        if (model_perfix.split(",").some((p) => model.startsWith(p))) {
          params.split(",").includes("stream") && (onStream = null);
          break;
        }
      }
    }
    return onStream;
  };
  paramsHandle = (model, body, context) => {
    if (Object.keys(context.DROPS_OPENAI_PARAMS).length > 0) {
      for (const [model_perfix, params] of Object.entries(context.DROPS_OPENAI_PARAMS)) {
        if (model_perfix.split(",").some((p) => model.startsWith(p))) {
          params.split(",").forEach((p) => delete body[p]);
          break;
        }
      }
    }
    if (context.COVER_MESSAGE_ROLE) {
      for (const [models, roles] of Object.entries(context.COVER_MESSAGE_ROLE)) {
        const [oldRole, newRole] = roles.split(":");
        if (models.split(",").some((p) => model.startsWith(p))) {
          body.messages = body.messages.map((m) => {
            m.role = m.role === oldRole ? newRole : m.role;
            return m;
          });
        }
      }
    }
    if (context.OPENAI_REASONING_EFFORT && body.model.startsWith("o1")) {
      body.reasoning_effort = context.OPENAI_REASONING_EFFORT;
    }
    Object.entries(context.OPENAI_API_EXTRA_PARAMS).forEach(([key, value]) => {
      body[key] = value;
    });
  };
  fetch = (context) => async (url, options) => {
    const body = JSON.parse(options?.body);
    this.paramsHandle(body.model, body, context);
    return fetch(url, {
      ...options,
      body: JSON.stringify(body)
    });
  };
}
class Dalle extends (_a15 = OpenAIBase, _request_dec3 = [Log], _a15) {
  constructor() {
    super(...arguments);
    __publicField(this, "modelKey", "DALL_E_MODEL");
    __publicField(this, "model", (ctx) => {
      return ctx.DALL_E_MODEL;
    });
    __publicField(this, "request", __runInitializers(_init3, 8, this, async (prompt2, context, extraParams) => {
      const url = `${context.OPENAI_API_BASE}/images/generations`;
      const header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apikey(context)}`
      };
      const { n = 1, size = "1024x1024", style = "vivid", quality = "hd" } = extraParams || {};
      const body = {
        prompt: prompt2,
        n,
        model: extraParams?.model || context.DALL_E_MODEL
      };
      if (body.model === "dall-e-3") {
        body.size = size || context.DALL_E_IMAGE_SIZE;
        body.style = style || context.DALL_E_IMAGE_STYLE;
        body.quality = quality || context.DALL_E_IMAGE_QUALITY;
      }
      return requestText2Image(url, header, body, this.render);
    })), __runInitializers(_init3, 11, this);
    __publicField(this, "render", async (response, prompt2) => {
      const resp = await response.json();
      if (resp.error?.message) {
        throw new Error(resp.error.message);
      }
      if (!Array.isArray(resp.data) || resp.data.length === 0) {
        throw new Error(`Data is invalid: ${JSON.stringify(resp)}`);
      }
      return {
        type: "image",
        url: resp.data?.map((i) => i?.url),
        text: resp.data?.[0]?.revised_prompt || prompt2
      };
    });
  }
}
_init3 = __decoratorStart(_a15);
__decorateElement(_init3, 5, "request", _request_dec3, Dalle);
__decoratorMetadata(_init3, Dalle);
class OpenAIASR extends (_b = OpenAIBase, _request_dec4 = [Log], _b) {
  constructor() {
    super(...arguments);
    __publicField(this, "modelKey", "OPENAI_STT_MODEL");
    __publicField(this, "model", (ctx) => {
      return ctx.OPENAI_STT_MODEL;
    });
    __publicField(this, "request", __runInitializers(_init4, 8, this, async (audio, context) => {
      const url = `${context.OPENAI_API_BASE}/audio/transcriptions`;
      const header = {
        Authorization: `Bearer ${this.apikey(context)}`,
        Accept: "application/json"
      };
      const formData = new FormData();
      formData.append("file", audio, "audio.ogg");
      formData.append("model", context.OPENAI_STT_MODEL);
      if (context.OPENAI_STT_EXTRA_PARAMS) {
        Object.entries(context.OPENAI_STT_EXTRA_PARAMS).forEach(([k, v]) => {
          formData.append(k, v);
        });
      }
      formData.append("response_format", "json");
      const resp = await fetch(url, {
        method: "POST",
        headers: header,
        body: formData,
        redirect: "follow"
      }).then((res) => res.json());
      if (!resp.text) {
        console.error(resp);
        throw new Error(JSON.stringify(resp));
      }
      log.info(`Transcription: ${resp.text}`);
      return resp.text;
    })), __runInitializers(_init4, 11, this);
  }
}
_init4 = __decoratorStart(_b);
__decorateElement(_init4, 5, "request", _request_dec4, OpenAIASR);
__decoratorMetadata(_init4, OpenAIASR);
class OpenAITTS extends OpenAIBase {
  modelKey = "OPENAI_TTS_MODEL";
  model = (ctx) => {
    return ctx.OPENAI_TTS_MODEL;
  };
  request = async (text2, context) => {
    const url = `${context.OPENAI_API_BASE}/audio/speech`;
    const headers = {
      "Authorization": `Bearer ${this.apikey(context)}`,
      "Content-Type": "application/json"
    };
    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: context.OPENAI_TTS_MODEL,
        input: text2,
        voice: context.OPENAI_TTS_VOICE,
        response_format: "opus",
        speed: 1
      })
    });
    if (resp.ok) {
      return resp.blob();
    } else {
      throw new Error(`${resp.status} ${resp.statusText}

${await resp.text()}`);
    }
  };
}
class OpenAILikeBase {
  name = "oailike";
  enable = (context) => {
    return !!context.OAILIKE_API_KEY;
  };
}
class OpenAILike extends OpenAILikeBase {
  modelKey = "OAILIKE_CHAT_MODEL";
  enable = (context) => {
    return !!context.OAILIKE_API_KEY;
  };
  model = (ctx, params) => {
    const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : "text";
    switch (msgType) {
      case "image":
        return ctx.OAILIKE_VISION_MODEL;
      case "file":
      default:
        return ctx.OAILIKE_CHAT_MODEL;
    }
  };
  request = async (params, context, onStream) => {
    const provider = createOpenAICompatible({
      name: "oailike",
      baseURL: context.OAILIKE_API_BASE,
      apiKey: context.OAILIKE_API_KEY || ""
    });
    const userMessage = params.messages.at(-1);
    const languageModelV1 = provider.languageModel(this.model(context, userMessage), void 0);
    return requestChatCompletionsV2({
      model: languageModelV1,
      messages: params.messages,
      context
    }, onStream);
  };
}
class OpenAILikeImage extends (_c = OpenAILikeBase, _request_dec5 = [Log], _c) {
  constructor() {
    super(...arguments);
    __publicField(this, "modelKey", "OAILIKE_IMAGE_MODEL");
    __publicField(this, "model", (ctx) => {
      return ctx.OAILIKE_IMAGE_MODEL;
    });
    __publicField(this, "request", __runInitializers(_init5, 8, this, async (prompt2, context) => {
      const url = `${context.OAILIKE_API_BASE}/image/generations`;
      const header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.OAILIKE_API_KEY}`
      };
      const body = {
        prompt: prompt2,
        image_size: context.OAILIKE_IMAGE_SIZE,
        model: context.OAILIKE_IMAGE_MODEL,
        batch_size: 4,
        ...context.OAILIKE_EXTRA_PARAMS
      };
      return requestText2Image(url, header, body, this.render);
    })), __runInitializers(_init5, 11, this);
    __publicField(this, "render", async (response, prompt2) => {
      const resp = response;
      if (!resp.ok)
        return { type: "image", message: await resp.text() };
      const data = await resp.json();
      if (data.message) {
        return { type: "image", message: data.message };
      }
      return { type: "image", url: data?.images?.map((i) => i?.url), text: prompt2 };
    });
  }
}
_init5 = __decoratorStart(_c);
__decorateElement(_init5, 5, "request", _request_dec5, OpenAILikeImage);
__decoratorMetadata(_init5, OpenAILikeImage);
class OpenAILikeASR extends (_d = OpenAILikeBase, _request_dec6 = [Log], _d) {
  constructor() {
    super(...arguments);
    __publicField(this, "modelKey", "OAILIKE_STT_MODEL");
    __publicField(this, "model", (ctx) => {
      return ctx.OAILIKE_STT_MODEL;
    });
    __publicField(this, "request", __runInitializers(_init6, 8, this, async (audio, context) => {
      const url = `${context.OAILIKE_API_BASE}/audio/transcriptions`;
      const header = {
        Authorization: `Bearer ${context.OAILIKE_API_KEY}`,
        Accept: "application/json"
      };
      const formData = new FormData();
      formData.append("file", audio, "audio.mp3");
      formData.append("model", context.OAILIKE_STT_MODEL);
      if (context.OAILIKE_STT_EXTRA_PARAMS) {
        Object.entries(context.OAILIKE_STT_EXTRA_PARAMS).forEach(([k, v]) => {
          formData.append(k, v);
        });
      }
      formData.append("response_format", "json");
      const resp = await fetch(url, {
        method: "POST",
        headers: header,
        body: formData,
        redirect: "follow"
      }).then((r) => r.json());
      if (resp.error?.message) {
        throw new Error(resp.error.message);
      }
      if (resp.text === void 0) {
        console.error(JSON.stringify(resp));
        throw new Error(JSON.stringify(resp));
      }
      log.info(`Transcription: ${resp.text}`);
      return resp.text;
    })), __runInitializers(_init6, 11, this);
  }
}
_init6 = __decoratorStart(_d);
__decorateElement(_init6, 5, "request", _request_dec6, OpenAILikeASR);
__decoratorMetadata(_init6, OpenAILikeASR);
class OpenAILikeTTS extends OpenAILikeBase {
  modelKey = "OAILIKE_TTS_MODEL";
  model = (ctx) => {
    return ctx.OAILIKE_TTS_MODEL;
  };
  request = async (text2, context) => {
    const url = `${context.OAILIKE_API_BASE}/audio/speech`;
    const headers = {
      "Authorization": `Bearer ${context.OAILIKE_API_KEY}`,
      "Content-Type": "application/json"
    };
    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: context.OAILIKE_TTS_MODEL,
        input: text2,
        voice: context.OAILIKE_TTS_VOICE,
        response_format: "opus",
        speed: 1,
        stream: false
      })
    });
    if (resp.ok) {
      return resp.blob();
    } else {
      throw new Error(`${resp.status} ${resp.statusText}

${await resp.text()}`);
    }
  };
}
class VertexBase {
  name = "vertex";
  enable = (context) => {
    return !!(context.VERTEX_PROJECT_ID && context.VERTEX_CREDENTIALS?.client_email && context.VERTEX_CREDENTIALS?.private_key);
  };
  model = (ctx, params) => {
    const msgType = Array.isArray(params?.content) ? params.content.at(-1)?.type : "text";
    switch (msgType) {
      case "image":
        return ctx.VERTEX_VISION_MODEL;
      case "file":
      default:
        return ctx.VERTEX_CHAT_MODEL;
    }
  };
}
class Vertex extends VertexBase {
  modelKey = "VERTEX_CHAT_MODEL";
  request = async (params, context, onStream) => {
    const userMessage = handleUrl(params.messages.at(-1), true);
    const languageModelV1 = await createLlmModel(this.model(context, userMessage), context);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), onStream);
  };
}
class VertexImage extends (_e = VertexBase, _request_dec7 = [Log], _e) {
  constructor() {
    super(...arguments);
    __publicField(this, "modelKey", "VERTEX_IMAGE_MODEL");
    __publicField(this, "model", (ctx) => {
      return ctx.VERTEX_IMAGE_MODEL;
    });
    __publicField(this, "request", __runInitializers(_init7, 8, this, async (prompt2, context, extraParams) => {
      const { n = 1, radio: aspectRatio = "16:9" } = extraParams || {};
      const { images } = await generateImage({
        model: createVertex({
          project: context.VERTEX_PROJECT_ID,
          location: context.VERTEX_LOCATION,
          googleAuthOptions: {
            credentials: context.VERTEX_CREDENTIALS
          }
        }).image(this.model(context)),
        prompt: prompt2,
        n,
        providerOptions: {
          vertex: {
            aspectRatio,
            safetyFilterLevel: "none"
          }
        },
        maxRetries: 0
      });
      return this.render(images, prompt2);
    })), __runInitializers(_init7, 11, this);
    __publicField(this, "render", async (result, prompt2) => {
      const images = result;
      if (images.length === 0) {
        throw new Error(`Data is invalid: ${JSON.stringify(images)}`);
      }
      return {
        type: "image",
        raw: images.map(({ uint8Array }) => new Blob([uint8Array], { type: "image/png" })),
        text: prompt2
      };
    });
  }
}
_init7 = __decoratorStart(_e);
__decorateElement(_init7, 5, "request", _request_dec7, VertexImage);
__decoratorMetadata(_init7, VertexImage);
class WorkerBase {
  name = "workers";
  run = async (model, body, id, token) => {
    return await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: JSON.stringify(body)
      }
    );
  };
  enable = (context) => {
    return !!(context.CLOUDFLARE_ACCOUNT_ID && context.CLOUDFLARE_TOKEN);
  };
}
class WorkersChat extends WorkerBase {
  modelKey = "WORKERS_CHAT_MODEL";
  model = (ctx) => {
    return ctx.WORKERS_CHAT_MODEL;
  };
  request = async (params, context, onStream) => {
    const { messages, prompt: prompt2 } = params;
    const id = context.CLOUDFLARE_ACCOUNT_ID;
    const token = context.CLOUDFLARE_TOKEN;
    const model = context.WORKERS_CHAT_MODEL;
    const url = `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`;
    const header = {
      Authorization: `Bearer ${token}`
    };
    const reqMessages = messages.map((raw) => {
      return {
        role: raw.role,
        content: raw.content
      };
    });
    if (prompt2) {
      reqMessages.unshift({ role: "system", content: prompt2 });
    }
    const body = {
      messages: reqMessages,
      stream: onStream !== null
    };
    const options = {};
    options.contentExtractor = function(data) {
      return data?.response;
    };
    options.fullContentExtractor = function(data) {
      return data?.result?.response;
    };
    options.errorExtractor = function(data) {
      return data?.errors?.[0]?.message;
    };
    const text2 = await requestChatCompletions(url, header, body, onStream, null, options);
    return {
      messages: [
        {
          role: "assistant",
          content: text2
        }
      ],
      content: text2
    };
  };
}
class WorkersImage extends (_f = WorkerBase, _request_dec8 = [Log], _f) {
  constructor() {
    super(...arguments);
    __publicField(this, "modelKey", "WORKERS_IMAGE_MODEL");
    __publicField(this, "model", (ctx) => {
      return ctx.WORKERS_IMAGE_MODEL;
    });
    __publicField(this, "request", __runInitializers(_init8, 8, this, async (prompt2, context, extraParams) => {
      const id = context.CLOUDFLARE_ACCOUNT_ID;
      const token = context.CLOUDFLARE_TOKEN;
      if (!id || !token) {
        throw new Error("Cloudflare account ID or token is not set");
      }
      const raw = await this.run(context.WORKERS_IMAGE_MODEL, { prompt: prompt2, ...extraParams }, id, token);
      if (isJsonResponse(raw)) {
        const { result } = await raw.json();
        const image = result?.image;
        if (typeof image !== "string") {
          throw new TypeError("Invalid image response");
        }
        return { type: "image", raw: [await base64StringToBlob(image)] };
      }
      return { type: "image", raw: [await raw.blob()], text: prompt2 };
    })), __runInitializers(_init8, 11, this);
  }
}
_init8 = __decoratorStart(_f);
__decorateElement(_init8, 5, "request", _request_dec8, WorkersImage);
__decoratorMetadata(_init8, WorkersImage);
async function base64StringToBlob(base64String) {
  try {
    const { Buffer: Buffer2 } = await import("node:buffer");
    const buffer = Buffer2.from(base64String, "base64");
    return new Blob([buffer], { type: "image/png" });
  } catch {
    const uint8Array = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
    return new Blob([uint8Array], { type: "image/png" });
  }
}
class XAI {
  name = "xai";
  modelKey = "XAI_CHAT_MODEL";
  enable = (context) => {
    return !!context.XAI_API_KEY;
  };
  model = (ctx, params) => {
    return Array.isArray(params?.content) ? ctx.XAI_VISION_MODEL : ctx.XAI_CHAT_MODEL;
  };
  request = async (params, context, onStream) => {
    const provider = createXai({
      baseURL: context.XAI_API_BASE,
      apiKey: context.XAI_API_KEY || void 0
    });
    const userMessage = params.messages.at(-1);
    const languageModelV1 = provider.languageModel(this.model(context, userMessage), void 0);
    return requestChatCompletionsV2(await warpLLMParams({
      model: languageModelV1,
      messages: params.messages
    }, context), onStream);
  };
}
const CHAT_AGENTS = [
  new Anthropic(),
  new AzureChatAI(),
  new Cohere(),
  new Google(),
  new Mistral(),
  new OpenAI(),
  new WorkersChat(),
  new OpenAILike(),
  new Vertex(),
  new XAI()
];
function loadChatLLM(context) {
  for (const llm of CHAT_AGENTS) {
    if (llm.name === context.AI_PROVIDER) {
      return llm;
    }
  }
  for (const llm of CHAT_AGENTS) {
    if (llm.enable(context)) {
      return llm;
    }
  }
  return null;
}
const IMAGE_AGENTS = [
  new AzureImageAI(),
  new Dalle(),
  new WorkersImage(),
  new OpenAILikeImage(),
  new VertexImage(),
  new KlingAI()
];
function loadImageGen(context) {
  for (const imgGen of IMAGE_AGENTS) {
    if (imgGen.name === context.AI_IMAGE_PROVIDER) {
      return imgGen;
    }
  }
  throw new Error(`Image generator not found: ${context.AI_IMAGE_PROVIDER}
Available: ${IMAGE_AGENTS.map((i) => i.name).join(", ")}`);
}
const ASR_AGENTS = [
  new OpenAIASR(),
  new OpenAILikeASR()
];
function loadASRLLM(context) {
  for (const llm of ASR_AGENTS) {
    if (llm.name === context.AI_ASR_PROVIDER) {
      return llm;
    }
  }
  return null;
}
const TTS_AGENTS = [
  new OpenAITTS(),
  new OpenAILikeTTS()
];
function loadTTSLLM(context) {
  for (const llm of TTS_AGENTS) {
    if (llm.name === context.AI_TTS_PROVIDER) {
      return llm;
    }
  }
  return null;
}
function customInfo(config) {
  const prompt2 = config.SYSTEM_INIT_MESSAGE || "";
  const other_info = {
    mode: config.CURRENT_MODE,
    prompt: prompt2.length > 50 ? `${prompt2.slice(0, 50)}...` : prompt2,
    MAPPING_KEY: config.MAPPING_KEY,
    MAPPING_VALUE: config.MAPPING_VALUE,
    USE_TOOLS: config.USE_TOOLS.join(","),
    SUPPORT_PLUGINS: Object.keys({ ...ENV.PLUGINS_FUNCTION, ...tools }).join("|"),
    CHAT_TRIGGER_PERFIX: ENV.CHAT_TRIGGER_PERFIX,
    MESSAGE_REPLACER: Object.keys(ENV.MESSAGE_REPLACER).join("|"),
    MAX_STEPS: config.MAX_STEPS,
    MAX_RETRIES: config.MAX_RETRIES,
    SEND_IMAGE_AS_FILE: ENV.SEND_IMAGE_AS_FILE,
    SUPPORT_PROMPT_ROLE: Object.keys(config.PROMPT).join("|"),
    SEARCH_GROUNDING: config.SEARCH_GROUNDING,
    TEXT_OUTPUT: config.TEXT_OUTPUT,
    TEXT_HANDLE_TYPE: config.TEXT_HANDLE_TYPE,
    AUDIO_OUTPUT: config.AUDIO_OUTPUT,
    AUDIO_HANDLE_TYPE: config.AUDIO_HANDLE_TYPE,
    AUDIO_TEXT_FORMAT: ENV.AUDIO_TEXT_FORMAT
  };
  return JSON.stringify(other_info, null, 2);
}
async function warpLLMParams(params, context) {
  const tool_envs = { ...context.JINA_API_KEY && { JINA_API_KEY: context.JINA_API_KEY[Math.floor(Math.random() * context.JINA_API_KEY.length)] } };
  const env_perfix = "TOOL_ENV_";
  Object.keys(context).forEach((i) => i.startsWith(env_perfix) && (tool_envs[i.substring(env_perfix.length - 1)] = context[i]));
  const messages = params.messages.at(-1);
  let tool2 = typeof messages.content === "string" ? await vaildTools(context.USE_TOOLS) : void 0;
  let activeTools = tool2?.activeToolAlias.map((t) => tools[t].schema.name);
  if (params.model.provider === "google-vertex" && context.SEARCH_GROUNDING) {
    activeTools = void 0;
    tool2 = void 0;
    params.messages = [params.messages.find((p) => p.role === "system"), params.messages.findLast((p) => p.role === "user")];
  }
  let toolChoice;
  if (tool2?.activeToolAlias && tool2?.activeToolAlias.length > 0) {
    const userMessageIsString = typeof messages.content === "string";
    const choiceResult = wrapToolChoice(tool2?.activeToolAlias, userMessageIsString ? messages.content : "");
    userMessageIsString && (messages.content = choiceResult.message);
    toolChoice = choiceResult.toolChoices;
  }
  log.info(`[warpLLMParams] activeTools: ${activeTools}`);
  return {
    model: params.model,
    messages: params.messages,
    tools: tool2?.tools,
    activeTools,
    toolChoice,
    context
  };
}
async function createLlmModel(model, context) {
  let [agent, model_id] = model.includes(":") ? model.trim().split(":") : [context.AI_PROVIDER, model];
  if (agent === "auto") {
    throw new Error("Auto mode is not supported, please specify the agent");
  }
  if (!model_id) {
    model_id = context[`${agent.toUpperCase()}_CHAT_MODEL`];
  }
  const GOOGLE_SAFETY = [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
  ];
  switch (agent) {
    case "openai":
    case "gpt":
      return createOpenAI({
        baseURL: context.OPENAI_API_BASE,
        apiKey: context.OPENAI_API_KEY[Math.floor(Math.random() * context.OPENAI_API_KEY.length)],
        compatibility: "strict"
      }).languageModel(model_id, void 0);
    case "claude":
    case "anthropic":
      return createAnthropic({
        baseURL: context.ANTHROPIC_API_BASE,
        apiKey: context.ANTHROPIC_API_KEY || void 0
      }).languageModel(model_id, void 0);
    case "google":
    case "gemini":
      return createGoogleGenerativeAI({
        baseURL: context.GOOGLE_API_BASE,
        apiKey: context.GOOGLE_API_KEY || void 0
      }).languageModel(model_id, {
        safetySettings: GOOGLE_SAFETY,
        useSearchGrounding: context.SEARCH_GROUNDING
      });
    case "cohere":
      return createCohere({
        baseURL: context.COHERE_API_BASE,
        apiKey: context.COHERE_API_KEY || void 0
      }).languageModel(model_id, void 0);
    case "vertex":
      if (isCfWorker)
        throw new Error("Vertex is not supported in Cloudflare Workers");
      const { createVertex: createVertex2 } = await import("@ai-sdk/google-vertex");
      return createVertex2({
        project: context.VERTEX_PROJECT_ID,
        location: context.VERTEX_LOCATION,
        googleAuthOptions: {
          credentials: context.VERTEX_CREDENTIALS
        }
      }).languageModel(model_id, {
        safetySettings: GOOGLE_SAFETY,
        useSearchGrounding: context.SEARCH_GROUNDING
      });
    case "xai":
      return createXai({
        baseURL: context.XAI_API_BASE,
        apiKey: context.XAI_API_KEY || void 0
      }).languageModel(model_id, void 0);
    default:
      return createOpenAI({
        name: "olike",
        baseURL: context.OAILIKE_API_BASE || void 0,
        apiKey: context.OAILIKE_API_KEY || void 0
      }).languageModel(model_id, void 0);
  }
}
function wrapToolChoice(activeToolAlias, message) {
  const tool_perfix = "/t-";
  let text2 = message.trim();
  const choices = ["auto", "none", "required", ...activeToolAlias];
  const toolChoices = [];
  while (true) {
    const toolAlias = choices.find((t) => text2.startsWith(`${tool_perfix}${t}`)) || "";
    if (toolAlias) {
      text2 = text2.substring(tool_perfix.length + toolAlias.length).trim();
      const choice = ["auto", "none", "required"].includes(toolAlias) ? { type: toolAlias } : { type: "tool", toolName: tools[toolAlias].schema.name };
      toolChoices.push(choice);
    } else {
      break;
    }
  }
  log.info(`All RealtoolChoices: ${JSON.stringify(toolChoices)}`);
  return {
    message: text2,
    toolChoices
  };
}
class Cache {
  maxItems;
  maxAge;
  cache;
  constructor() {
    this.maxItems = 10;
    this.maxAge = 1e3 * 60 * 60;
    this.cache = {};
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
  }
  set(key, value) {
    this.trim();
    this.cache[key] = {
      value,
      time: Date.now()
    };
  }
  get(key) {
    this.trim();
    return this.cache[key]?.value;
  }
  trim() {
    let keys = Object.keys(this.cache);
    for (const key of keys) {
      if (Date.now() - this.cache[key].time > this.maxAge) {
        delete this.cache[key];
      }
    }
    keys = Object.keys(this.cache);
    if (keys.length > this.maxItems) {
      keys.sort((a, b) => this.cache[a].time - this.cache[b].time);
      for (let i = 0; i < keys.length - this.maxItems; i++) {
        delete this.cache[keys[i]];
      }
    }
  }
}
const IMAGE_CACHE = new Cache();
async function fetchImage(url) {
  const cache = IMAGE_CACHE.get(url);
  if (cache) {
    return cache;
  }
  return fetch(url).then((resp) => resp.blob()).then((blob) => {
    IMAGE_CACHE.set(url, blob);
    return blob;
  });
}
async function urlToBase64String(url) {
  try {
    const { Buffer: Buffer2 } = await import("node:buffer");
    return fetchImage(url).then((blob) => blob.arrayBuffer()).then((buffer) => Buffer2.from(buffer).toString("base64"));
  } catch {
    return fetchImage(url).then((blob) => blob.arrayBuffer()).then((buffer) => btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))));
  }
}
function getImageFormatFromBase64(base64String) {
  const firstChar = base64String.charAt(0);
  switch (firstChar) {
    case "/":
      return "jpeg";
    case "i":
      return "png";
    case "R":
      return "gif";
    case "U":
      return "webp";
    default:
      throw new Error("Unsupported image format");
  }
}
async function imageToBase64String(url) {
  const base64String = await urlToBase64String(url);
  const format = getImageFormatFromBase64(base64String);
  return {
    data: base64String,
    format: `image/${format}`
  };
}
var __defProp2 = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty, __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    __hasOwnProp.call(b, prop) && __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b))
      __propIsEnum.call(b, prop) && __defNormalProp2(a, prop, b[prop]);
  return a;
};
var __publicField2 = (obj, key, value) => (__defNormalProp2(obj, typeof key != "symbol" ? key + "" : key, value), value);
var __async = (__this, __arguments, generator) => new Promise((resolve2, reject) => {
  var fulfilled = (value) => {
    try {
      step(generator.next(value));
    } catch (e) {
      reject(e);
    }
  }, rejected = (value) => {
    try {
      step(generator.throw(value));
    } catch (e) {
      reject(e);
    }
  }, step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
  step((generator = generator.apply(__this, __arguments)).next());
});
var version = "0.13.1";
var defaultInitOptions = {
  core: "@ffmpeg.wasm/core-mt",
  coreOptions: {},
  defaultArgs: ["-nostdin", "-y", "-hide_banner"],
  log: false,
  logger: (level, ...msg) => {
    var _a16;
    return level !== "debug" || ((_a16 = process == null ? void 0 : process.env) == null ? void 0 : _a16.NODE_ENV) === "development" && console[level](`[${level}] `, ...msg);
  }
};
var importCore = (core, logger) => __async(void 0, null, function* () {
  switch (typeof core) {
    case "string":
      return logger("debug", `Import '${core}' with esm dynamic import()`), (yield import(core)).default;
    case "function":
      return logger("debug", "FFmpeg core constructor detected, use it directly"), core;
    default:
      throw new Error(
        `Invalid type of option core: ${typeof core}, expect string or function`
      );
  }
});
var logError = (err, args, logger) => {
  let reason = err instanceof Error ? err == null ? void 0 : err.message : err;
  logger("error", `Failed to execute '${args.join(" ")}': `, reason);
};
var coreVersionRegExp = /^ffmpeg\sversion\s([^\s]+)/m, configurationRegExp = /^\s*configuration:\s(.+)$/m, libsRegExp = /^\s*(\w+)\s*(\d+)\.\s*(\d+)\.\s*(\d+)\s*\/.*$/gm;
function parseVersion(output) {
  var _a16, _b2, _c2, _d2;
  return {
    version: (_b2 = (_a16 = output.match(coreVersionRegExp)) == null ? void 0 : _a16[1]) != null ? _b2 : "unknown",
    configuration: (_d2 = (_c2 = output.match(configurationRegExp)) == null ? void 0 : _c2[1]) != null ? _d2 : "",
    libs: Object.fromEntries(
      [...output.matchAll(libsRegExp)].map(([, name14, major2, minor, patch]) => [
        name14,
        `${major2}.${minor}.${patch}`
      ])
    ),
    raw: output
  };
}
var writeArgs = (core, args) => {
  let argsPtr = core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
  return args.forEach((arg, idx) => {
    let strLength = core.lengthBytesUTF8(arg) + 1, buf = core._malloc(strLength);
    core.stringToUTF8(arg, buf, strLength), core.setValue(argsPtr + Uint32Array.BYTES_PER_ELEMENT * idx, buf, "i32");
  }), argsPtr;
};
var VERSION_ARGS = ["ffmpeg", "-version"], FFmpeg = class _FFmpeg {
  /**
   * Don't use this constructor direct, use FFmpeg.create() instead!
   * @see {@link create}
   * @param core FFmpeg.wasm core
   * @param options init options
   */
  constructor(core, options, coreVersion) {
    __publicField2(this, "flags");
    __publicField2(this, "fs");
    __publicField2(this, "version");
    __publicField2(this, "core");
    __publicField2(this, "_exited", false);
    __publicField2(this, "exec");
    __publicField2(this, "execAsync");
    __publicField2(this, "options");
    __publicField2(this, "tasks", /* @__PURE__ */ new Map());
    this.core = core, this.options = options, this.version = { main: version, core: coreVersion };
    let { simd, thread, wasi } = core;
    this.flags = { simd, thread, wasi }, this.exec = core.cwrap("exec", "number", ["number", "number"]), this.execAsync = core.cwrap("execAsync", "number", [
      "number",
      "number",
      "number",
      "number"
    ]), this.fs = core.FS;
  }
  /**
   * Has the core exited
   * @readonly
   */
  get exited() {
    return this._exited;
  }
  /**
   * Create a new FFmpeg instance
   * @param _options init options
   * @returns created instance
   */
  static create() {
    return __async(this, arguments, function* (_options = {}) {
      var _a16;
      let options = __spreadValues(__spreadValues({}, defaultInitOptions), _options);
      (_a16 = options.coreOptions).locateFile != null || (_a16.locateFile = (url, prefix) => options.coreOptions.wasmPath && url.endsWith(".wasm") ? options.coreOptions.wasmPath : options.coreOptions.workerPath && url.endsWith(".js") ? options.coreOptions.workerPath : `${prefix}${url}`);
      let { log: log2, logger } = options, output = "";
      options.log = true, options.logger = (level, msg) => {
        level === "info" && (output += `${String(msg)}
`);
      };
      let core = yield (yield importCore(options.core, logger))({
        arguments: VERSION_ARGS,
        locateFile: options.coreOptions.locateFile,
        noExitRuntime: true,
        print(msg) {
          options.log && options.logger("info", msg);
        },
        printErr(msg) {
          options.log && options.logger("error", msg);
        }
      }), coreVersion = parseVersion(output);
      return options.log = log2, options.logger = logger, new _FFmpeg(core, options, coreVersion);
    });
  }
  /**
   * Execute FFmpeg like CLI (stdin is not available)
   * @param _args array of parameters, same as CLI
   * @returns promise with exit code
   */
  run(..._args) {
    return __async(this, null, function* () {
      var _a16;
      if (this._exited)
        throw new Error("FFmpeg core has already been exited!");
      let args = ["ffmpeg", ...this.options.defaultArgs, ..._args], handle = Symbol(
        ((_a16 = process == null ? void 0 : process.env) == null ? void 0 : _a16.NODE_ENV) === "development" ? `FFmpeg convert ${args.join(" ")}` : ""
      ), argsPtr, resloveCallbackPtr, rejectCallbackPtr;
      try {
        let promise = new Promise((resolve2, reject) => {
          argsPtr = writeArgs(this.core, args), resloveCallbackPtr = this.core.addFunction(resolve2, "vi"), rejectCallbackPtr = this.core.addFunction(reject, "vi"), this.core.thread ? (this.execAsync(
            args.length,
            argsPtr,
            resloveCallbackPtr,
            rejectCallbackPtr
          ) || reject("Failed to add task into queue!"), this.tasks.set(handle, {
            // can only be accessed after initialisation
            get promise() {
              return promise;
            },
            reject
          })) : resolve2(this.exec(args.length, argsPtr));
        });
        return yield promise;
      } catch (err) {
        throw logError(err, args, this.options.logger), err;
      } finally {
        this.tasks.delete(handle), argsPtr && this.core._free(argsPtr);
      }
    });
  }
  /**
   * Force FFmpeg to run synchronously (same behaviour as ffmpeg.run() in single-thread core)
   * @param _args array of parameters, same as CLI
   * @returns exit code
   */
  runSync(..._args) {
    if (this._exited)
      throw new Error("FFmpeg core has already been exited!");
    let args = ["ffmpeg", ..._args], argsPtr = writeArgs(this.core, args);
    try {
      return this.exec(args.length, argsPtr);
    } catch (err) {
      throw logError(err, args, this.options.logger), err;
    } finally {
      this.core._free(argsPtr);
    }
  }
  exit(handleInProgress = "kill") {
    switch (this._exited = true, handleInProgress) {
      case "wait":
        return Promise.allSettled(
          Array.from(this.tasks.values()).map(({ promise }) => promise)
        ).then(() => this.core.exit());
      case "kill":
        this.tasks.forEach(({ reject }) => reject("ffmpeg core has exited!"));
        break;
      default:
        if (this.tasks.size !== 0)
          return this.options.logger("warn", "Task list is not empty, break."), false;
        break;
    }
    return this.core.exit();
  }
  setLogging(enbaled) {
    this.options.log = enbaled;
  }
  /**
   * Replace logger
   * @param logger logger function
   */
  setLogger(logger) {
    this.options.logger = logger;
  }
};
async function convertOgaToMp3(file, target = "base64") {
  const ffmpeg = await FFmpeg.create({ core: "@ffmpeg.wasm/core-st" });
  try {
    const uint8Array = new Uint8Array(await file.arrayBuffer());
    ffmpeg.fs.writeFile("input.oga", uint8Array);
    await ffmpeg.run("-i", "input.oga", "output.mp3");
    const output = ffmpeg.fs.readFile("output.mp3");
    return target === "base64" ? uint8ArrayToBase64(output) : new Blob([output], { type: "audio/mp3" });
  } catch (error) {
    console.error("Error in convertOgaToMp3:", error);
    throw error;
  } finally {
    ffmpeg.exit();
  }
}
function uint8ArrayToBase64(uint8Array) {
  return Buffer.from(uint8Array).toString("base64");
}
async function messageInitialize(sender, context, message) {
  setTimeout(() => sendAction(sender.api.token, sender.context.chat_id, "typing"), 0);
  log.info(`send init message`);
  const streamSender = OnStreamHander(sender, context, message?.text || message?.caption || "");
  streamSender.send("...");
  return streamSender;
}
async function chatWithLLM(message, params, context, modifier, sender, isMiddle) {
  const agent = loadChatLLM(context.USER_CONFIG);
  const streamSender = sender ?? OnStreamHander(MessageSender.from(context.SHARE_CONTEXT.botToken, message), context, message?.text || message?.caption || "");
  if (!agent) {
    return streamSender.end("LLM is not enabled", false);
  }
  try {
    log.info(`start chat with LLM`);
    const answer = await requestCompletionsFromLLM(params, context, agent, modifier, ENV.STREAM_MODE && !isMiddle ? streamSender : null);
    log.info(`chat with LLM done`);
    if (answer.messages.at(-1)?.role === "tool") {
      await sendToolResult(answer.messages.at(-1)?.content, streamSender.sender, context.USER_CONFIG);
      return new Response("Success");
    }
    if (isMiddle) {
      return answer.content;
    }
    return streamSender.end(answer.content);
  } catch (e) {
    log.error(e.message, e.stack);
    let errMsg = "";
    if (e.name === "AbortError") {
      errMsg += "Chat with LLM timeout";
    } else {
      errMsg += e.message;
      if (e instanceof APICallError && e.responseBody && errMsg === "") {
        log.error(`error detail: ${e.responseBody}`);
        errMsg += `

${e.responseBody}`;
      }
    }
    errMsg = errMsg.trim().replace(context.SHARE_CONTEXT.botToken, "[REDACTED]").substring(0, 2048);
    return streamSender.end(`\`\`\`Error
${errMsg}
\`\`\``, false);
  }
}
function findPhotoFileID(photos, offset) {
  let sizeIndex = offset >= 0 ? offset : photos.length + offset;
  sizeIndex = Math.max(0, Math.min(sizeIndex, photos.length - 1));
  return photos[sizeIndex].file_id;
}
class ChatHandler {
  handle = async (message, context) => {
    const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
    const streamSender = await messageInitialize(sender, context, message);
    try {
      log.info(`message type: ${context.MIDDLE_CONTEXT.messageInfo.type}`);
      await this.initializeHistory(context);
      const params = await this.processOriginalMessage(message, context);
      await workflow(context, message, params, streamSender);
      return null;
    } catch (e) {
      log.error(e.stack);
      const errMsg = e.message.replace(context.SHARE_CONTEXT.botToken, "[REDACTED]").substring(0, 2048);
      return streamSender.end(`\`\`\`Error
${errMsg}
\`\`\``, false);
    }
  };
  async initializeHistory(context) {
    const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
    if (!historyKey) {
      throw new Error("History key not found");
    }
    const length = context.USER_CONFIG.MAX_HISTORY_LENGTH;
    if (length > 0) {
      context.MIDDLE_CONTEXT.history = await loadHistory(historyKey, length);
    }
  }
  async processOriginalMessage(message, context) {
    const { type: type2, id } = context.MIDDLE_CONTEXT.messageInfo;
    const params = {
      role: "user",
      content: message.text || message.caption || ""
    };
    if (id) {
      const api = createTelegramBotAPI(context.SHARE_CONTEXT.botToken);
      const files = await Promise.all(id.map((i) => api.getFileWithReturns({ file_id: i })));
      const paths = files.map((f) => f.result?.file_path).filter(Boolean);
      if (paths.length === 0) {
        throw new Error(files.map((f) => f.description).join("\n"));
      }
      const urls = paths.map((p) => `https://api.telegram.org/file/bot${context.SHARE_CONTEXT.botToken}/${p}`);
      log.info(`File URLs:
${urls.join("\n")}`);
      if (urls.length > 0) {
        params.content = [];
        if (message.text || message.caption) {
          params.content.push({
            type: "text",
            text: message.text || message.caption
          });
        } else {
          params.content.push({
            type: "text",
            text: type2 === "sticker" ? "User sent a sticker to respond to you" : ["audio", "voice"].includes(type2) ? "Please answer the question from the audio clip" : `Please explain the ${type2}`
          });
        }
        switch (type2) {
          case "image":
          case "photo": {
            const isUrl = ENV.TELEGRAM_IMAGE_TRANSFER_MODE === "url";
            for (const url of urls) {
              const { data, format } = isUrl ? { data: url, format: `image/${url.split(".").pop()}` } : await imageToBase64String(url);
              params.content.push({
                type: "image",
                image: data,
                mimeType: format
              });
            }
            break;
          }
          case "sticker": {
            const isUrl = ENV.TELEGRAM_IMAGE_TRANSFER_MODE === "url";
            const format = urls[0].split(".").pop();
            if (format === "webm") {
              params.content.push({
                type: "file",
                data: urls[0],
                mimeType: "video/webm"
              });
            } else {
              const { data, format: mimeType } = isUrl ? { data: urls[0], format: `image/${format}` } : await imageToBase64String(urls[0]);
              params.content.push({
                type: "image",
                image: data,
                mimeType
              });
            }
            break;
          }
          case "audio":
          case "voice": {
            const isChat = context.USER_CONFIG.AUDIO_HANDLE_TYPE === "chat";
            let audioData = urls[0];
            if (isChat && context.USER_CONFIG.AI_PROVIDER === "openai") {
              const response = await fetch(urls[0]);
              if (!response.body) {
                throw new Error("Failed to fetch audio data");
              }
              audioData = await convertOgaToMp3(response, "base64");
            }
            params.content.push({
              type: "file",
              data: audioData,
              mimeType: `audio/${audioData.split(".").pop()}`
            });
            break;
          }
          case "text": {
            const text2 = await Promise.all(urls.map((url) => fetch(url).then((r) => r.text()))).then((t) => t.join("\n"));
            params.content = [
              {
                type: "text",
                text: `${message.text || message.caption}
${text2}`.trim()
              }
            ];
            break;
          }
          case "video":
            params.content.push({
              type: "file",
              data: urls[0],
              mimeType: `video/${urls[0].split(".").pop()}`
            });
            break;
        }
      }
    }
    return params;
  }
}
function OnStreamHander(sender, context, question) {
  let sentPromise = null;
  let nextEnableTime = null;
  const isMessageSender = sender instanceof MessageSender;
  const sendInterval = isMessageSender ? ENV.TELEGRAM_MIN_STREAM_INTERVAL : ENV.INLINE_QUERY_SEND_INTERVAL;
  const isSendTelegraph = (text2) => {
    return isMessageSender ? ENV.TELEGRAPH_SCOPE.includes(sender.context.chatType) && ENV.TELEGRAPH_NUM_LIMIT > 0 && text2.length > ENV.TELEGRAPH_NUM_LIMIT : sender.context.inline_message_id && text2.length > 4096;
  };
  const addQuotePrerequisites = ENV.ADD_QUOTE_LIMIT > 0 && ENV.ADD_QUOTE_SCOPE.includes(sender.context.chatType);
  const expandParams = { addQuote: false, quoteExpandable: ENV.QUOTE_EXPANDABLE };
  const botName = context?.SHARE_CONTEXT?.botName || "AI";
  const telegraphAccessTokenKey = context?.SHARE_CONTEXT?.telegraphAccessTokenKey || "";
  const telegraphSender = new TelegraphSender(botName, telegraphAccessTokenKey);
  let hasSentTelegraphLink = false;
  const telegraphContext = (isEnd, containRaw) => {
    return {
      context,
      textSender: sender,
      telegraphSender,
      hasSentTelegraphLink,
      isEnd,
      containRaw
    };
  };
  const immediatePromise = Promise.resolve("[PROMISE DONE]");
  const streamSender = {
    send: null,
    end: null,
    sender
  };
  streamSender.send = async (text2) => {
    try {
      if ((nextEnableTime || 0) > Date.now()) {
        log.info(`Need await: ${(nextEnableTime || 0) - Date.now()}ms`);
        return;
      }
      if (sentPromise && await Promise.race([sentPromise, immediatePromise]) === "[PROMISE DONE]") {
        return;
      }
      if (sendInterval > 0) {
        nextEnableTime = Date.now() + sendInterval;
      }
      if (isSendTelegraph(text2)) {
        sentPromise = sendTelegraph(telegraphContext(false, false), question || "Redo Question", text2);
        hasSentTelegraphLink = true;
        return;
      }
      const data = context ? mergeLogMessages(text2, context.USER_CONFIG) : text2;
      expandParams.addQuote = addQuotePrerequisites && data.length > ENV.ADD_QUOTE_LIMIT;
      log.info(`sent message ids: ${isMessageSender ? sender.context.sentMessageIds : sender.context.inline_message_id}`);
      isMessageSender && sendAction(sender.api.token, sender.context.chat_id, "typing");
      sentPromise = sender.sendRichText(data, void 0, "chat", expandParams);
      const resp = await sentPromise;
      if (resp.status === 429) {
        const retryAfter = Number.parseInt(resp.headers.get("Retry-After") || "");
        if (retryAfter) {
          nextEnableTime = Date.now() + retryAfter * 1e3;
          log.error(`Status 429, need wait: ${nextEnableTime - Date.now()}ms`);
          return;
        }
      }
      if (!resp.ok) {
        log.error(`send message failed: ${resp.status} ${await resp.json().then((j) => j.description)}`);
        return sentPromise = sender.sendPlainText(text2, "chat");
      }
    } catch (e) {
      log.error(e.stack);
    }
  };
  streamSender.end = async (text2, needLog = true) => {
    log.info("--- start end ---");
    await sentPromise;
    if (isSendTelegraph(text2)) {
      return sendTelegraph(telegraphContext(true, false), question || "Redo Question", text2);
    }
    const data = context && needLog ? mergeLogMessages(text2, context.USER_CONFIG) : text2;
    log.info(`sent message ids: ${isMessageSender ? sender.context.sentMessageIds : sender.context.inline_message_id}`);
    expandParams.addQuote = addQuotePrerequisites && data.length > ENV.ADD_QUOTE_LIMIT;
    while (true) {
      const finalResp = await sender.sendRichText(data, void 0, "chat", expandParams);
      if (finalResp.status === 429) {
        const retryAfter = Number.parseInt(finalResp.headers.get("Retry-After") || "");
        if (retryAfter) {
          log.error(`Status 429, need wait: ${retryAfter}s`);
          await waitUntil(Date.now() + retryAfter * 1e3 + 10);
          continue;
        } else {
          await waitUntil(Date.now() + 1e4);
          continue;
        }
      }
      if (!finalResp.ok) {
        sender.context.sentMessageIds.length = 0;
        log.error(`send message failed: ${finalResp.status} ${await finalResp.json().then((j) => j.description)}`);
        await sendTelegraph(telegraphContext(true, true), question || "Redo Question", text2);
        return;
      }
      return finalResp;
    }
  };
  return streamSender;
}
async function sendTelegraph(sendContext, question, text2) {
  log.info(`start send telegraph`);
  const { context, textSender, telegraphSender, hasSentTelegraphLink, isEnd, containRaw } = sendContext;
  if (question.length > 600) {
    question = `${question.slice(0, 300)}...${question.slice(-300)}`;
  }
  const prefix = `#Question
\`\`\`
${question}
\`\`\`
---`;
  const telegraph_prefix = `${prefix}
#Answer
🤖 **${getLog(context.USER_CONFIG, true)}**
`;
  const debug_info = `${getLog(context.USER_CONFIG, false, true)}`;
  const telegraph_suffix = `
---
\`\`\`
${debug_info}
\`\`\``;
  try {
    if ((telegraph_prefix + text2 + telegraph_suffix).length >= 10917 * 6) {
      const file = new File([text2], "answer.txt", { type: "text/plain" });
      return textSender.sendDocument(file, getLog(context.USER_CONFIG), "MarkdownV2");
    }
    const resp = await telegraphSender.send(
      "Daily Q&A",
      telegraph_prefix + text2 + telegraph_suffix,
      containRaw ? text2 : void 0
    );
    if (!hasSentTelegraphLink) {
      const url = `https://telegra.ph/${telegraphSender.teleph_path}`;
      const msg = `${containRaw ? "由于渲染出现错误 " : ""}回答已经转换成完整文章。
[🔗点击进行查看](${url})`.trim();
      log.info(`send telegraph message: ${msg}`);
      return textSender.sendRichText(msg);
    }
    return resp;
  } catch (error) {
    if (isEnd) {
      const file = new File([text2], "answer.txt", { type: "text/plain" });
      return textSender.sendDocument(file, getLog(context.USER_CONFIG), "MarkdownV2");
    }
  }
}
function workflowHandlers(type2) {
  switch (type2) {
    case "text:image":
      return handleTextToImage;
    case "audio:audio":
    case "audio:text":
    case "stt:text":
    case "stt:audio":
      return handleAudio;
    default:
      return handleText;
  }
}
async function workflow(context, message, params, streamSender) {
  const msgType = context.MIDDLE_CONTEXT.messageInfo.type;
  let handlerKey = `${msgType}:`;
  if (msgType === "text") {
    handlerKey = `${context.USER_CONFIG.TEXT_HANDLE_TYPE}:${context.USER_CONFIG.TEXT_OUTPUT}`;
  } else if (msgType === "audio" || msgType === "voice") {
    handlerKey = `${context.USER_CONFIG.AUDIO_HANDLE_TYPE}:${context.USER_CONFIG.AUDIO_OUTPUT}`;
  } else {
    handlerKey += "text";
  }
  if (!["audio", "stt", "chat"].includes(context.USER_CONFIG.AUDIO_HANDLE_TYPE) && ["audio", "voice"].includes(msgType)) {
    handlerKey = "stt:text";
  } else if (!["tts", "text", "chat"].includes(context.USER_CONFIG.TEXT_HANDLE_TYPE) && msgType === "text") {
    handlerKey = "text:text";
  }
  const handler2 = workflowHandlers(handlerKey);
  return handler2(message, params, context, streamSender, handlerKey);
}
async function handleText(message, params, context, streamSender, handleKey) {
  switch (handleKey) {
    case "tts:audio":
    case "tts:text":
    case "text:audio":
      return handleTextToAudio(message, params, context, streamSender, handleKey);
    default:
      return chatWithLLM(message, params, context, null, streamSender);
  }
}
async function handleTextToImage(message, params, context, streamSender, handleKey) {
  const agent = loadImageGen(context.USER_CONFIG);
  const sender = streamSender.sender;
  if (!agent) {
    return sender.sendPlainText("ERROR: Image generator not found");
  }
  sendAction(context.SHARE_CONTEXT.botToken, message.chat.id);
  await sender.sendPlainText("Please wait a moment...", "tip").then((r) => r.json());
  const result = await agent.request(message.text || message.caption || "", context.USER_CONFIG);
  log.info("imageresult", JSON.stringify(result));
  await sendImages(result, ENV.SEND_IMAGE_AS_FILE, sender, context.USER_CONFIG);
  const api = createTelegramBotAPI(context.SHARE_CONTEXT.botToken);
  return api.deleteMessage({ chat_id: sender.context.chat_id, message_id: sender.context.message_id });
}
async function handleAudio(message, params, context, streamSender, handleKey) {
  const url = params.content.at(-1)?.data;
  const audio = await fetch(url).then((b) => b.blob());
  const text2 = await asr(audio, context.USER_CONFIG);
  context.MIDDLE_CONTEXT.history.push({ role: "user", content: text2 });
  const sender = streamSender.sender;
  if (handleKey === "audio:text" || !ENV.HIDE_MIDDLE_MESSAGE) {
    await sender.sendRichText(mergeLogMessages(text2, context.USER_CONFIG));
  }
  if (handleKey.startsWith("stt")) {
    return new Response("audio handle done");
  }
  clearLog(context.USER_CONFIG);
  !ENV.HIDE_MIDDLE_MESSAGE && (sender.context.sentMessageIds.length = 0);
  const isMiddle = handleKey === "audio:audio";
  const otherText = params.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  const resp = await chatWithLLM(message, { role: "user", content: `[AUDIO TRANSCRIPTION]: ${text2}
${otherText}` }, context, null, streamSender, isMiddle);
  if (isMiddle) {
    const voice = await tts(resp, context.USER_CONFIG);
    ENV.HIDE_MIDDLE_MESSAGE && sender.api.deleteMessage({ chat_id: sender.context.chat_id, message_id: sender.context.message_id });
    sendAction(context.SHARE_CONTEXT.botToken, sender.context.chat_id, "upload_voice");
    return sender.sendVoice(voice);
  }
  return resp;
}
async function handleTextToAudio(message, params, context, streamSender, handleKey) {
  let text2 = params.content;
  const sender = streamSender.sender;
  if (handleKey === "text:audio") {
    !ENV.HIDE_MIDDLE_MESSAGE && streamSender.send("Chat with LLM in progress");
    text2 = await chatWithLLM(message, params, context, null, streamSender, true);
    !ENV.HIDE_MIDDLE_MESSAGE && streamSender.send("Chat with LLM done");
  }
  const audio = await tts(text2, context.USER_CONFIG);
  sendAction(context.SHARE_CONTEXT.botToken, sender.context.chat_id, "upload_voice");
  const resp = await sender.sendVoice(audio, context.USER_CONFIG.AUDIO_CONTAINS_TEXT ? text2 : void 0);
  if (resp.ok) {
    return sender.api.deleteMessage({ chat_id: sender.context.chat_id, message_id: sender.context.message_id });
  }
  throw new Error(`Failed to send voice message: ${resp.status} ${await resp.json().then((j) => j.description)}`);
}
async function sendImages(img, sendAsFile, sender, config) {
  if (img.url?.length === 0 && img.raw?.length === 0) {
    return sender.sendPlainText("ERROR: No image found");
  }
  const caption = img.caption?.map((t) => `>${t}`?.slice(0, 800)?.trim()) || [img.text || "No prompt"];
  if (img.url?.length === 1 || img.raw?.length === 1) {
    return sender.editMessageMedia({
      type: sendAsFile ? "document" : "photo",
      media: img.url?.[0] || "",
      caption: escape(mergeLogMessages(caption[0], config), { quoteExpandable: false, addQuote: true })
    }, ENV.DEFAULT_PARSE_MODE, img.raw?.[0] && new File([img.raw[0]], "image.png", { type: "image/png" }));
  } else {
    const medias = (img.url || img.raw).map((media, index2) => ({
      type: sendAsFile ? "document" : "photo",
      media: typeof media === "string" ? media : "",
      caption: caption[index2] && escape(index2 === 0 ? mergeLogMessages(caption[index2], config) : caption[index2], { quoteExpandable: true, addQuote: true }),
      parse_mode: ENV.DEFAULT_PARSE_MODE
    }));
    if (img.raw && img.raw.length > 0) {
      const files = img.raw.map((_, i) => new File([img.raw[i]], "image.png", { type: "image/png" }));
      return sender.sendMediaGroup(medias, files);
    }
    return sender.sendMediaGroup(medias);
  }
}
function tts(text2, config) {
  const agent = loadTTSLLM(config);
  if (!agent) {
    throw new Error("TTS agent not found");
  }
  return agent.request(text2, config);
}
async function asr(audio, config) {
  const agent = loadASRLLM(config);
  if (!agent) {
    throw new Error("ASR agent not found");
  }
  if (agent.name === "oailike") {
    const start = Date.now();
    audio = await convertOgaToMp3(audio, "blob");
    log.info(`transform audio time: ${((Date.now() - start) / 1e3).toFixed(2)}s`);
  }
  return agent.request(audio, config);
}
function mergeLogMessages(text2, config) {
  if (ENV.LOG_POSITION_ON_TOP) {
    return `${getLog(config)}

${text2.trim()}`.trim();
  }
  return `${text2.trim()}

${getLog(config)}`;
}
function isTelegramChatTypeGroup(type2) {
  return type2 === "group" || type2 === "supergroup";
}
function extractMessageInfo(message, currentBotId) {
  const messageData = extractTypeFromMessage(message);
  if (messageData.type === "text" && isNeedGetReplyMessage(message, currentBotId)) {
    const { type: type2, id, mime_type, media_group_id } = extractTypeFromMessage(message.reply_to_message) || {};
    if (type2 && type2 !== "text" && type2 !== "unknown")
      messageData.type = type2;
    if (id && id.length > 0)
      messageData.id = id;
    if (mime_type)
      messageData.mime_type = mime_type;
    if (media_group_id)
      messageData.media_group_id = media_group_id;
  }
  return messageData;
}
function extractTypeFromMessage(message) {
  const msgTypes = ["text", "photo", "voice", "document", "audio", "animation", "sticker", "video"];
  const msgType = Object.keys(message).find((t) => msgTypes.includes(t));
  const typeInfo = {
    type: msgType ?? "unknown",
    original_type: msgType ?? "unknown"
  };
  switch (msgType) {
    case "text":
      return typeInfo;
    case "photo": {
      const file_id = findPhotoFileID(message.photo, ENV.TELEGRAM_PHOTO_SIZE_OFFSET);
      if (!file_id) {
        console.error("photo file_id not found", message);
      }
      return {
        type: msgType,
        original_type: "photo",
        id: file_id ? [file_id] : void 0,
        media_group_id: message.media_group_id
      };
    }
    case "document":
    case "audio":
    case "voice":
    case "animation":
    case "sticker":
    case "video": {
      const MAX_FILE_SIZE = 20 * 1024 * 1024;
      const fileSize = message[msgType]?.file_size;
      if (fileSize && fileSize > MAX_FILE_SIZE) {
        throw new Error(`File size over limit: ${(fileSize / 1024 / 1024).toFixed(1)}MB
The maximum file size to download is 20 MB`);
      }
      const id = message[msgType]?.file_id;
      if (!id) {
        throw new Error("file_id not found");
      }
      if (msgType === "document") {
        const testSupport = message.document?.mime_type?.match(/(audio|image|text|video)/)?.[1];
        testSupport && (typeInfo.type = testSupport);
      }
      return {
        type: typeInfo.type,
        original_type: msgType,
        id: id ? [id] : void 0,
        media_group_id: message.media_group_id
      };
    }
    default:
      return typeInfo;
  }
}
function isNeedGetReplyMessage(message, currentBotId) {
  return ENV.EXTRA_MESSAGE_CONTEXT && message.reply_to_message && (message.reply_to_message.from?.id !== currentBotId || message.reply_to_message.photo);
}
function UUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
const isCfWorker = typeof globalThis !== "undefined" && typeof globalThis.ServiceWorkerGlobalScope !== "undefined" && globalThis instanceof globalThis.ServiceWorkerGlobalScope;
function chunckArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
async function waitUntil(timestamp) {
  return new Promise((resolve2) => setTimeout(resolve2, Math.max(0, timestamp - Date.now())));
}
class MessageContext {
  chat_id;
  message_id = null;
  reply_to_message_id;
  parse_mode = null;
  allow_sending_without_reply = null;
  disable_web_page_preview = ENV.DISABLE_WEB_PREVIEW;
  message_thread_id = null;
  chatType;
  message;
  sentMessageIds = [];
  constructor(message) {
    this.chat_id = message.chat.id;
    this.chatType = message.chat.type;
    this.message = message;
    if (message.chat.type === "group" || message.chat.type === "supergroup") {
      if (message?.reply_to_message && ENV.EXTRA_MESSAGE_CONTEXT && !message.is_topic_message && ENV.ENABLE_REPLY_TO_MENTION && !message.reply_to_message.from?.is_bot) {
        this.reply_to_message_id = message.reply_to_message.message_id;
      } else {
        this.reply_to_message_id = message.message_id;
      }
      this.allow_sending_without_reply = true;
      if (message.is_topic_message && message.message_thread_id) {
        this.message_thread_id = message.message_thread_id;
      }
    } else {
      this.reply_to_message_id = null;
    }
  }
}
class MessageSender {
  api;
  context;
  constructor(token, context) {
    this.api = createTelegramBotAPI(token);
    this.context = context;
    this.sendRichText = this.sendRichText.bind(this);
    this.sendPlainText = this.sendPlainText.bind(this);
    this.sendPhoto = this.sendPhoto.bind(this);
    this.sendMediaGroup = this.sendMediaGroup.bind(this);
    this.sendDocument = this.sendDocument.bind(this);
    this.sendVoice = this.sendVoice.bind(this);
    this.editMessageMedia = this.editMessageMedia.bind(this);
  }
  static from(token, message) {
    return new MessageSender(token, new MessageContext(message));
  }
  with(message) {
    this.context = new MessageContext(message);
    return this;
  }
  update(context) {
    if (!this.context) {
      this.context = context;
      return this;
    }
    for (const key in context) {
      this.context[key] = context[key];
    }
    return this;
  }
  async sendMessage(message, context) {
    if (context?.message_id) {
      const params = {
        chat_id: context.chat_id,
        message_id: context.message_id,
        parse_mode: context.parse_mode || void 0,
        text: message
      };
      if (context.disable_web_page_preview) {
        params.link_preview_options = {
          is_disabled: true
        };
      }
      return this.api.editMessageText(params);
    } else {
      const params = {
        chat_id: context.chat_id,
        message_thread_id: context.message_thread_id || void 0,
        parse_mode: context.parse_mode || void 0,
        text: message
      };
      if (context.reply_to_message_id) {
        params.reply_parameters = {
          message_id: context.reply_to_message_id,
          chat_id: context.chat_id,
          allow_sending_without_reply: context.allow_sending_without_reply || void 0
        };
      }
      if (context.disable_web_page_preview) {
        params.link_preview_options = {
          is_disabled: true
        };
      }
      return this.api.sendMessage(params);
    }
  }
  async sendLongMessage(message, context, expandParams) {
    const chatContext = { ...context };
    const messages = renderMessage(context.parse_mode, message, expandParams);
    let lastMessageResponse = null;
    let lastMessageRespJson = null;
    for (let i = 0; i < messages.length; i++) {
      if (ENV.LOG_POSITION_ON_TOP) {
        if (i > 0 && i < context.sentMessageIds.length - 1) {
          continue;
        }
      } else if (context.sentMessageIds.length > 2 && i < context.sentMessageIds.length - 2) {
        continue;
      }
      if (messages[i].trim() === "") {
        continue;
      }
      chatContext.message_id = context.sentMessageIds[i] ?? null;
      log.info(`message id: ${chatContext.message_id}`);
      lastMessageResponse = await this.sendMessage(messages[i], chatContext);
      if (lastMessageResponse.status === 400) {
        const message2 = (await lastMessageResponse.clone().json()).description;
        if (message2.includes("not modified")) {
          continue;
        }
      }
      if (lastMessageResponse.status !== 200) {
        break;
      }
      lastMessageRespJson = await lastMessageResponse.clone().json();
      this.context.sentMessageIds[i] = lastMessageRespJson.result.message_id;
      this.context.message_id = lastMessageRespJson.result.message_id;
    }
    if (lastMessageResponse === null) {
      throw new Error("Send message failed");
    }
    return lastMessageResponse;
  }
  sendRichText(message, parseMode = ENV.DEFAULT_PARSE_MODE, type2 = "chat", expandParams) {
    if (!this.context) {
      throw new Error("Message context not set");
    }
    return checkIsNeedTagIds(this.context, this.sendLongMessage(message, {
      ...this.context,
      parse_mode: parseMode
    }, expandParams), type2);
  }
  sendPlainText(message, type2 = "tip") {
    if (!this.context) {
      throw new Error("Message context not set");
    }
    return checkIsNeedTagIds(this.context, this.sendLongMessage(message, {
      ...this.context,
      parse_mode: null
    }), type2);
  }
  sendPhoto(photo, caption, parse_mode) {
    if (!this.context) {
      throw new Error("Message context not set");
    }
    const params = {
      chat_id: this.context.chat_id,
      message_thread_id: this.context.message_thread_id || void 0,
      photo,
      ...caption ? { caption: renderMessage(parse_mode || null, caption)[0] } : {},
      parse_mode
    };
    if (this.context.reply_to_message_id) {
      params.reply_parameters = {
        message_id: this.context.reply_to_message_id,
        chat_id: this.context.chat_id,
        allow_sending_without_reply: this.context.allow_sending_without_reply || void 0
      };
    }
    return checkIsNeedTagIds(this.context, this.api.sendPhoto(params), "chat");
  }
  sendMediaGroup(media, files) {
    if (!this.context) {
      throw new Error("Message context not set");
    }
    const params = {
      chat_id: this.context.chat_id,
      message_thread_id: this.context.message_thread_id || void 0,
      media
    };
    if (this.context.reply_to_message_id) {
      params.reply_parameters = {
        message_id: this.context.reply_to_message_id,
        chat_id: this.context.chat_id,
        allow_sending_without_reply: this.context.allow_sending_without_reply || void 0
      };
    }
    if (files) {
      params.media.forEach((media2, index2) => {
        media2.media = `attach://file${index2}`;
        params[`file${index2}`] = files[index2];
      });
    }
    return checkIsNeedTagIds(this.context, this.api.sendMediaGroup(params), "chat");
  }
  sendDocument(document, caption, parse_mode) {
    if (!this.context) {
      throw new Error("Message context not set");
    }
    const params = {
      chat_id: this.context.chat_id,
      message_thread_id: this.context.message_thread_id || void 0,
      document,
      caption,
      parse_mode
    };
    if (this.context.reply_to_message_id) {
      params.reply_parameters = {
        message_id: this.context.reply_to_message_id,
        chat_id: this.context.chat_id,
        allow_sending_without_reply: this.context.allow_sending_without_reply || void 0
      };
    }
    return checkIsNeedTagIds(this.context, this.api.sendDocument(params), "chat");
  }
  editMessageMedia(media, parse_mode, file) {
    if (!this.context) {
      throw new Error("Message context not set");
    }
    if (!this.context.message_id) {
      throw new Error("Message id is null");
    }
    const params = {
      chat_id: this.context.chat_id,
      message_id: this.context.message_id,
      media: {
        ...media,
        parse_mode,
        ...file && { media: `attach://file` }
      },
      ...file && { file }
    };
    return checkIsNeedTagIds(this.context, this.api.request("editMessageMedia", { ...params, file }), "chat");
  }
  sendVoice(voice, caption) {
    const params = {
      chat_id: this.context.chat_id,
      voice,
      caption
    };
    if (caption && ["spoiler", "bold", "italic", "underline", "strikethrough", "code", "pre"].includes(ENV.AUDIO_TEXT_FORMAT || "")) {
      params.caption_entities = [{
        type: ENV.AUDIO_TEXT_FORMAT,
        offset: 0,
        length: caption.length
      }];
    }
    if (this.context.reply_to_message_id) {
      params.reply_parameters = {
        message_id: this.context.reply_to_message_id,
        chat_id: this.context.chat_id,
        allow_sending_without_reply: this.context.allow_sending_without_reply || void 0
      };
    }
    return checkIsNeedTagIds(this.context, this.api.sendVoice(params), "chat");
  }
}
class TelegraphSender {
  telegraphAccessTokenKey;
  telegraphAccessToken;
  teleph_path;
  author = {
    short_name: "Mewo",
    author_name: "A Cat",
    author_url: ENV.TELEGRAPH_AUTHOR_URL
  };
  constructor(botName, telegraphAccessTokenKey) {
    this.telegraphAccessTokenKey = telegraphAccessTokenKey;
    if (botName) {
      this.author = {
        short_name: botName,
        author_name: botName,
        author_url: ENV.TELEGRAPH_AUTHOR_URL
      };
    }
  }
  async createAccount() {
    const { short_name, author_name } = this.author;
    const url = `https://api.telegra.ph/createAccount?short_name=${short_name}&author_name=${author_name}`;
    const resp = await fetch(url).then((r) => r.json());
    if (resp.ok) {
      return resp.result.access_token;
    } else {
      throw new Error("create telegraph account failed");
    }
  }
  async createOrEditPage(url, title, content, raw) {
    const contentNode = markdownToTelegraphNodes(content);
    if (raw) {
      contentNode.push(...[
        { tag: "hr" },
        {
          tag: "blockquote",
          children: ["RAW DATA"]
        },
        {
          tag: "pre",
          children: [
            {
              tag: "code",
              attrs: { class: "language-plaintext" },
              children: [raw.trim()]
            }
          ]
        }
      ]);
    }
    const body = {
      access_token: this.telegraphAccessToken,
      path: this.teleph_path ?? void 0,
      title: title || "Daily Q&A",
      content: contentNode,
      ...this.author
    };
    const headers = { "Content-Type": "application/json" };
    return fetch(url, {
      method: "post",
      headers,
      body: JSON.stringify(body)
    });
  }
  async send(title, content, raw) {
    let endPoint = "https://api.telegra.ph/editPage";
    if (!this.telegraphAccessToken) {
      this.telegraphAccessToken = await ENV.DATABASE.get(this.telegraphAccessTokenKey);
      if (!this.telegraphAccessToken) {
        this.telegraphAccessToken = await this.createAccount();
        await ENV.DATABASE.put(this.telegraphAccessTokenKey, this.telegraphAccessToken).catch(console.error);
      }
    }
    if (!this.teleph_path) {
      endPoint = "https://api.telegra.ph/createPage";
    }
    const resp = await this.createOrEditPage(endPoint, title, content, raw);
    if (resp.ok) {
      const data = await resp.json();
      if (!data.ok) {
        console.error("telegraph send error:", JSON.stringify(data));
        throw new Error(JSON.stringify(data));
      }
      this.teleph_path = data.result?.path;
    } else if (resp.status === 429) {
      const retryAfter = Number.parseInt(resp.headers.get("Retry-After") || "");
      log.error(`Send telegraph page failed, Status 429, need wait: ${retryAfter || 10}s`);
      if (retryAfter) {
        await waitUntil(Date.now() + retryAfter * 1e3);
      } else {
        await waitUntil(Date.now() + 5e3);
      }
      return this.send(title, content, raw);
    } else if (!resp.ok) {
      log.error("Send telegraph page failed:", resp.status);
      throw new Error(await resp.text());
    }
    return resp;
  }
}
function sendAction(botToken, chat_id, action = "typing") {
  const api = createTelegramBotAPI(botToken);
  setTimeout(() => api.sendChatAction({
    chat_id,
    action
  }).catch(console.error), 0);
}
async function checkIsNeedTagIds(context, resp, msgType) {
  const { chatType, message } = context;
  let message_id = [];
  const original_resp = await resp;
  do {
    if (ENV.EXPIRED_TIME <= 0) break;
    const clone_resp = await original_resp.clone().json();
    if (Array.isArray(clone_resp.result)) {
      message_id = clone_resp?.result?.map((i) => i.message_id);
    } else {
      message_id = [clone_resp?.result?.message_id];
    }
    if (message_id.filter(Boolean).length === 0) {
      log.error("resp:", JSON.stringify(clone_resp));
      break;
    }
    const isGroup = ["group", "supergroup"].includes(chatType);
    const isNeedTag = isGroup && ENV.SCHEDULE_GROUP_DELETE_TYPE.includes(msgType) || !isGroup && ENV.SCHEDULE_PRIVATE_DELETE_TYPE.includes(msgType);
    if (isNeedTag) {
      if (!tagMessageIds.has(message)) {
        tagMessageIds.set(message, /* @__PURE__ */ new Set());
      }
      message_id.forEach((id) => tagMessageIds.get(message)?.add(id));
    }
  } while (false);
  return original_resp;
}
class ChosenInlineContext {
  result_id;
  inline_message_id;
  query;
  parse_mode = null;
  telegraphAccessTokenKey;
  chatType = "private";
  constructor(result) {
    this.result_id = result.result_id;
    this.inline_message_id = result.inline_message_id;
    this.query = result.query;
    if (ENV.TELEGRAPH_NUM_LIMIT > 0) {
      this.telegraphAccessTokenKey = `telegraph_access_token:${result.from.id}`;
    }
  }
}
class ChosenInlineSender {
  api;
  context;
  constructor(token, context) {
    this.api = createTelegramBotAPI(token);
    this.context = context;
  }
  static from(token, result) {
    return new ChosenInlineSender(token, new ChosenInlineContext(result));
  }
  sendRichText(text2, parseMode = ENV.DEFAULT_PARSE_MODE, _type = "chat", expandParams) {
    return this.editMessageText(text2, parseMode, expandParams);
  }
  sendPlainText(text2) {
    return this.editMessageText(text2);
  }
  editMessageText(text2, parse_mode, expandParams) {
    return this.api.editMessageText({
      inline_message_id: this.context.inline_message_id,
      text: renderMessage(parse_mode || null, text2, expandParams)[0],
      parse_mode,
      link_preview_options: {
        is_disabled: ENV.DISABLE_WEB_PREVIEW
      }
    });
  }
  editMessageMedia(media, parse_mode) {
    return this.api.editMessageMedia({
      inline_message_id: this.context.inline_message_id,
      media: {
        ...media,
        parse_mode
      }
    });
  }
}
function renderMessage(parse_mode, message, expandParams) {
  const chunkMessage = chunkDocument(message);
  if (parse_mode === "MarkdownV2") {
    return chunkMessage.map((lines) => escape(lines, expandParams));
  }
  return chunkMessage;
}
async function loadChatRoleWithContext(message, context, isCallbackQuery = false) {
  const { groupAdminsKey } = context.SHARE_CONTEXT;
  const chatId = message.chat.id;
  const speakerId = isCallbackQuery ? context?.from?.id : message.from?.id || chatId;
  if (!groupAdminsKey) {
    return null;
  }
  let groupAdmin = null;
  try {
    groupAdmin = JSON.parse(await ENV.DATABASE.get(groupAdminsKey));
  } catch (e) {
    console.error(e);
  }
  if (groupAdmin === null || !Array.isArray(groupAdmin) || groupAdmin.length === 0) {
    const api = createTelegramBotAPI(context.SHARE_CONTEXT.botToken);
    const result = await api.getChatAdministratorsWithReturns({ chat_id: chatId });
    if (result == null) {
      return null;
    }
    groupAdmin = result.result;
    await ENV.DATABASE.put(
      groupAdminsKey,
      JSON.stringify(groupAdmin),
      { expiration: Date.now() / 1e3 + 120 }
    );
  }
  for (const user of groupAdmin) {
    if (`${user.user?.id}` === `${speakerId}`) {
      return user.status;
    }
  }
  return "member";
}
class AsyncIter {
  queue = [];
  resolver = [];
  done = false;
  get isDone() {
    return this.done;
  }
  add(item) {
    if (this.done) {
      throw new Error("Cannot add items to a completed iterator.");
    }
    if (item.done) {
      this.done = true;
    }
    if (this.resolver.length > 0) {
      const resolve2 = this.resolver.shift();
      resolve2({ done: false, value: item.content });
      if (item.done && this.resolver.length > 0) {
        this.resolver.forEach((resolve22) => resolve22({ done: true, value: void 0 }));
        this.resolver = [];
        this.done = true;
      }
    } else {
      this.queue.push(item);
    }
  }
  next() {
    return new Promise((resolve2) => {
      if (this.queue.length > 0) {
        const data = this.queue.shift();
        resolve2({ done: false, value: data.content });
        if (data.done) {
          this.done = true;
        }
        return;
      }
      if (this.done) {
        resolve2({ done: true, value: void 0 });
        return;
      }
      this.resolver.push(resolve2);
    });
  }
  return() {
    if (!this.done) {
      this.done = true;
    }
    this.resolver.forEach((resolve2) => resolve2({ done: true, value: void 0 }));
    return Promise.resolve({ done: true, value: void 0 });
  }
  [Symbol.asyncIterator]() {
    return this;
  }
}
const perplexityExtractor = {
  contentExtractor: (data) => {
    if (data.chunks && data.chunks.length > 0) {
      const chunk = data.chunks.at(-1) || "";
      return chunk;
    }
    return "";
  },
  fullContentExtractor: (data) => {
    return `${data?.answer || ""}

${perplexityExtractor.finalAdd(data)}`;
  },
  finalAdd: (data) => {
    if (data.web_results && data.web_results.length > 0) {
      return `${data.web_results.map((r, i) => `${i + 1}. [${r.name}](${r.url})`).join("\n")}`;
    }
    return "";
  }
};
function perplexityFormatter(message) {
  const [event, data] = message;
  switch (event) {
    case "query_progress":
      if (data.text) {
        return {
          done: data.final,
          content: JSON.parse(data.text)
        };
      }
      return {
        done: false,
        content: ""
      };
    case "error":
      return {
        done: true,
        content: "[ERROR] Occur error"
      };
    case "disconnect":
    default:
      return {
        done: true,
        content: ""
      };
  }
}
async function WssRequest(url, protocols, options, messages, handlers) {
  const { WebSocket } = await import("ws");
  let { extractor, onStream } = handlers;
  return new Promise((resolve2) => {
    const ws = new WebSocket(url, options);
    let result = {};
    let streamSender;
    extractor = extractor || perplexityExtractor;
    let streamIter = null;
    if (onStream) {
      streamIter = new AsyncIter();
      const messageInfo = {
        content: ""
      };
      streamSender = streamHandler(streamIter, extractor, onStream, messageInfo);
    }
    ws.on("open", () => {
      log.info("wss connected.");
    });
    ws.on("message", async (data) => {
      const message = data.toString("utf-8");
      if (message.startsWith("0")) {
        const handshake = JSON.parse(message.substring(1));
        log.info("Handshake received:", handshake);
        ws.send("40");
        for (const message2 of messages) {
          ws.send(message2);
        }
      } else if (message.startsWith("42")) {
        const parsedMsg = JSON.parse(message.substring(2));
        const extracted = perplexityFormatter(parsedMsg);
        if (streamIter && !streamIter.isDone) {
          streamIter.add(extracted);
        }
        if (extracted.done) {
          log.info("Stream done.");
          result = extracted.content;
          ws.close();
        }
      } else if (message.startsWith("3")) {
        log.info("Heartbeat received");
      } else {
        log.info("Received non-data message:", message);
      }
    });
    ws.on("close", async () => {
      log.info("wss closed.");
      closeWss(resolve2, result, streamIter, streamSender, extractor);
    });
    ws.on("error", async (e) => {
      console.error(e.message);
      if (streamIter) {
        streamIter.return();
      }
      result.message = `Error: ${e.message}`;
    });
  });
}
async function closeWss(resolve2, result, streamIter, streamSender, extractor) {
  let data = "";
  if (streamIter) {
    data = await streamSender || "";
    data += `

${extractor.finalAdd(result)}`;
    data += result.message ? `
${result.message}` : "";
  } else {
    data = `${extractor.fullContentExtractor(result)}
${result.message || ""}`;
  }
  log.info("Result:", data.trim());
  resolve2(data.trim());
}
const COMMAND_AUTH_CHECKER = {
  default(chatType) {
    if (isTelegramChatTypeGroup(chatType)) {
      return ["administrator", "creator"];
    }
    return null;
  },
  shareModeGroup(chatType) {
    if (isTelegramChatTypeGroup(chatType)) {
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE) {
        return null;
      }
      return ["administrator", "creator"];
    }
    return null;
  }
};
class ImgCommandHandler {
  command = "/img";
  scopes = ["all_private_chats", "all_chat_administrators"];
  handle = async (message, subcommand, context, sender) => {
    if (subcommand === "") {
      return sender.sendPlainText(ENV.I18N.command.help.img);
    }
    try {
      const agent = loadImageGen(context.USER_CONFIG);
      sendAction(context.SHARE_CONTEXT.botToken, message.chat.id, "upload_photo");
      await sender.sendPlainText("Please wait a moment...");
      const img = await agent.request(subcommand, context.USER_CONFIG);
      log.info("img", img);
      const resp = await sendImages(img, ENV.SEND_IMAGE_AS_FILE, sender, context.USER_CONFIG);
      if (!resp.ok) {
        return sender.sendPlainText(`\`\`\`Error
${resp.statusText} ${await resp.text()}
\`\`\``);
      }
      return resp;
    } catch (e) {
      return sender.sendRichText(`\`\`\`Error
${e.message}
\`\`\``);
    }
  };
}
class HelpCommandHandler {
  command = "/help";
  scopes = ["all_private_chats", "all_chat_administrators"];
  handle = async (message, subcommand, context, sender) => {
    let helpMsg = `${ENV.I18N.command.help.summary}
`;
    for (const [k, v] of Object.entries(ENV.I18N.command.help)) {
      if (k === "summary") {
        continue;
      }
      helpMsg += `/${k}：${v}
`;
    }
    for (const [k, v] of Object.entries(ENV.CUSTOM_COMMAND)) {
      if (v.description) {
        helpMsg += `${k}：${v.description}
`;
      }
    }
    for (const [k, v] of Object.entries(ENV.PLUGINS_COMMAND)) {
      if (v.description) {
        helpMsg += `${k}：${v.description}
`;
      }
    }
    helpMsg = helpMsg.split("\n").map((line) => `> ${line}`).join("\n");
    return sender.sendRichText(helpMsg, "MarkdownV2", "tip");
  };
}
class BaseNewCommandHandler {
  static async handle(showID, message, subcommand, context) {
    await ENV.DATABASE.delete(context.SHARE_CONTEXT.chatHistoryKey);
    const text2 = ENV.I18N.command.new.new_chat_start + (showID ? `(${message.chat.id})` : "");
    const params = {
      chat_id: message.chat.id,
      message_thread_id: message.is_topic_message && message.message_thread_id || void 0,
      text: text2
    };
    if (ENV.SHOW_REPLY_BUTTON && !isTelegramChatTypeGroup(message.chat.type)) {
      params.reply_markup = {
        keyboard: [[{ text: "/new" }, { text: "/redo" }]],
        selective: true,
        resize_keyboard: true,
        one_time_keyboard: false
      };
    } else {
      params.reply_markup = {
        remove_keyboard: true,
        selective: true
      };
    }
    const resp = createTelegramBotAPI(context.SHARE_CONTEXT.botToken).sendMessage(params);
    return checkIsNeedTagIds({ chatType: message.chat.type, message }, resp, "tip");
  }
}
class NewCommandHandler extends BaseNewCommandHandler {
  command = "/new";
  scopes = ["all_private_chats", "all_group_chats", "all_chat_administrators"];
  handle = async (message, subcommand, context) => {
    return BaseNewCommandHandler.handle(false, message, subcommand, context);
  };
}
class StartCommandHandler extends BaseNewCommandHandler {
  command = "/start";
  handle = async (message, subcommand, context) => {
    return BaseNewCommandHandler.handle(true, message, subcommand, context);
  };
}
class SetEnvCommandHandler {
  command = "/setenv";
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    const kv = subcommand.indexOf("=");
    if (kv === -1) {
      return sender.sendPlainText(ENV.I18N.command.help.setenv);
    }
    let key = subcommand.slice(0, kv);
    const value = subcommand.slice(kv + 1);
    key = ENV_KEY_MAPPER[key] || key;
    if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
      return sender.sendPlainText(`Key ${key} is locked`);
    }
    if (!Object.keys(context.USER_CONFIG).includes(key)) {
      return sender.sendPlainText(`Key ${key} not found`);
    }
    try {
      context.USER_CONFIG.DEFINE_KEYS.push(key);
      context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
      ConfigMerger.merge(context.USER_CONFIG, {
        [key]: value
      });
      log.info("Update user config: ", key, context.USER_CONFIG[key]);
      await ENV.DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(ConfigMerger.trim(context.USER_CONFIG, ENV.LOCK_USER_CONFIG_KEYS))
      );
      return sender.sendPlainText("Update user config success");
    } catch (e) {
      return sender.sendPlainText(`ERROR: ${e.message}`);
    }
  };
}
class SetEnvsCommandHandler {
  command = "/setenvs";
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    try {
      const values = JSON.parse(subcommand);
      const configKeys = Object.keys(context.USER_CONFIG);
      for (const ent of Object.entries(values)) {
        let [key, value] = ent;
        key = ENV_KEY_MAPPER[key] || key;
        if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
          return sender.sendPlainText(`Key ${key} is locked`);
        }
        if (!configKeys.includes(key)) {
          return sender.sendPlainText(`Key ${key} not found`);
        }
        context.USER_CONFIG.DEFINE_KEYS.push(key);
        ConfigMerger.merge(context.USER_CONFIG, {
          [key]: value
        });
        log.info("Update user config: ", key, context.USER_CONFIG[key]);
      }
      context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
      await ENV.DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(ConfigMerger.trim(context.USER_CONFIG, ENV.LOCK_USER_CONFIG_KEYS))
      );
      return sender.sendPlainText("Update user config success");
    } catch (e) {
      return sender.sendPlainText(`ERROR: ${e.message}`);
    }
  };
}
class DelEnvCommandHandler {
  command = "/delenv";
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    if (ENV.LOCK_USER_CONFIG_KEYS.includes(subcommand)) {
      const msg = `Key ${subcommand} is locked`;
      return sender.sendPlainText(msg);
    }
    try {
      context.USER_CONFIG[subcommand] = null;
      context.USER_CONFIG.DEFINE_KEYS = context.USER_CONFIG.DEFINE_KEYS.filter((key) => key !== subcommand);
      await ENV.DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(ConfigMerger.trim(context.USER_CONFIG, ENV.LOCK_USER_CONFIG_KEYS))
      );
      return sender.sendPlainText("Delete user config success");
    } catch (e) {
      return sender.sendPlainText(`ERROR: ${e.message}`);
    }
  };
}
class ClearEnvCommandHandler {
  command = "/clearenv";
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    try {
      await ENV.DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify({})
      );
      return sender.sendPlainText("Clear user config success");
    } catch (e) {
      return sender.sendPlainText(`ERROR: ${e.message}`);
    }
  };
}
class VersionCommandHandler {
  command = "/version";
  scopes = ["all_private_chats", "all_chat_administrators"];
  handle = async (message, subcommand, context, sender) => {
    const current = {
      ts: ENV.BUILD_TIMESTAMP,
      sha: ENV.BUILD_VERSION
    };
    try {
      const info = `https://raw.githubusercontent.com/TBXark/ChatGPT-Telegram-Workers/${ENV.UPDATE_BRANCH}/dist/buildinfo.json`;
      const online = await fetch(info).then((r) => r.json());
      const timeFormat = (ts) => {
        return new Date(ts * 1e3).toLocaleString("en-US", {});
      };
      if (current.ts < online.ts) {
        const text2 = `New version detected: ${online.sha}(${timeFormat(online.ts)})
Current version: ${current.sha}(${timeFormat(current.ts)})`;
        return sender.sendPlainText(text2);
      } else {
        const text2 = `Current version: ${current.sha}(${timeFormat(current.ts)}) is up to date`;
        return sender.sendPlainText(text2);
      }
    } catch (e) {
      return sender.sendPlainText(`ERROR: ${e.message}`);
    }
  };
}
class SystemCommandHandler {
  command = "/system";
  scopes = ["all_private_chats", "all_chat_administrators"];
  handle = async (message, subcommand, context, sender) => {
    const chatAgent = loadChatLLM(context.USER_CONFIG);
    const imageAgent = loadImageGen(context.USER_CONFIG);
    const asrAgent = loadASRLLM(context.USER_CONFIG);
    const ttsAgent = loadTTSLLM(context.USER_CONFIG);
    const agent = {
      AI_PROVIDER: chatAgent?.name,
      [chatAgent?.modelKey || "AI_PROVIDER_NOT_FOUND"]: chatAgent?.model ? chatAgent.model(context.USER_CONFIG) : "AI_PROVIDER_NOT_FOUND",
      TOOL_MODEL: context.USER_CONFIG.TOOL_MODEL || "same as chat model",
      AI_IMAGE_PROVIDER: imageAgent?.name,
      [imageAgent?.modelKey || "AI_IMAGE_PROVIDER_NOT_FOUND"]: imageAgent?.model ? imageAgent.model(context.USER_CONFIG) : "AI_IMAGE_PROVIDER_NOT_FOUND",
      [asrAgent?.modelKey || "AI_ASR_PROVIDER_NOT_FOUND"]: asrAgent?.model ? asrAgent.model(context.USER_CONFIG) : "AI_ASR_PROVIDER_NOT_FOUND",
      [ttsAgent?.modelKey || "AI_TTS_PROVIDER_NOT_FOUND"]: ttsAgent?.model(context.USER_CONFIG),
      VISION_MODEL: context.USER_CONFIG.OPENAI_VISION_MODEL,
      IMAGE_MODEL: context.USER_CONFIG.IMAGE_MODEL
    };
    let msg = `<pre>AGENT: ${JSON.stringify(agent, null, 2)}
OTHERS: ${customInfo(context.USER_CONFIG)}
</pre>`;
    if (ENV.DEV_MODE) {
      const shareCtx = { ...context.SHARE_CONTEXT };
      shareCtx.botToken = "******";
      context.USER_CONFIG.OPENAI_API_KEY = ["******"];
      context.USER_CONFIG.AZURE_API_KEY = "******";
      context.USER_CONFIG.AZURE_COMPLETIONS_API = "******";
      context.USER_CONFIG.AZURE_DALLE_API = "******";
      context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID = "******";
      context.USER_CONFIG.CLOUDFLARE_TOKEN = "******";
      context.USER_CONFIG.GOOGLE_API_KEY = "******";
      context.USER_CONFIG.MISTRAL_API_KEY = "******";
      context.USER_CONFIG.COHERE_API_KEY = "******";
      context.USER_CONFIG.ANTHROPIC_API_KEY = "******";
      const config = ConfigMerger.trim(context.USER_CONFIG, ENV.LOCK_USER_CONFIG_KEYS);
      msg = `<pre>
${msg}`;
      msg += `USER_CONFIG: ${JSON.stringify(config, null, 2)}
`;
      msg += `CHAT_CONTEXT: ${JSON.stringify(sender.context || {}, null, 2)}
`;
      msg += `SHARE_CONTEXT: ${JSON.stringify(shareCtx, null, 2)}
`;
      msg += "</pre>";
    }
    return sender.sendRichText(msg, "HTML", "tip");
  };
}
class RedoCommandHandler {
  command = "/redo";
  scopes = ["all_private_chats", "all_group_chats", "all_chat_administrators"];
  handle = async (message, subcommand, context) => {
    const mf = (history, message2) => {
      let nextMessage = message2;
      if (!(history && Array.isArray(history) && history.length > 0)) {
        throw new Error("History not found");
      }
      const historyCopy = structuredClone(history);
      while (true) {
        const data = historyCopy.pop();
        if (data === void 0 || data === null) {
          break;
        } else if (data.role === "user") {
          nextMessage = data;
          break;
        }
      }
      if (subcommand) {
        nextMessage = {
          role: "user",
          content: subcommand
        };
      }
      if (nextMessage === null) {
        throw new Error("Redo message not found");
      }
      return { history: historyCopy, message: nextMessage };
    };
    return chatWithLLM(message, null, context, mf);
  };
}
class EchoCommandHandler {
  command = "/echo";
  handle = (message, subcommand, context, sender) => {
    let msg = "<pre>";
    msg += JSON.stringify({ message }, null, 2);
    msg += "</pre>";
    return sender.sendRichText(msg, "HTML");
  };
}
class SetCommandHandler {
  command = "/set";
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  scopes = ["all_private_chats", "all_chat_administrators"];
  relaxAuth = true;
  handle = async (message, subcommand, context, sender) => {
    try {
      if (!subcommand) {
        const detailSet = ENV.I18N.command?.detail?.set || "Have no detailed information in the language";
        return sender.sendRichText(`<pre>${detailSet}</pre>`, "HTML");
      }
      const { keys, values } = this.parseMappings(context);
      const { flags, remainingText } = this.tokenizeSubcommand(subcommand);
      const needUpdate = remainingText === "";
      let msg = "";
      const updatedKeys = [];
      if (context.USER_CONFIG.AI_PROVIDER === "auto") {
        context.USER_CONFIG.AI_PROVIDER = "openai";
      }
      for (const { flag, value } of flags) {
        const result = await this.processSubcommand(flag, value, keys, values, context, sender);
        if (result instanceof Response) {
          return result;
        }
        updatedKeys.push(result);
      }
      await this.RelaxAuthCheck(message, context, updatedKeys, needUpdate);
      if (needUpdate && updatedKeys.length > 0 && context.SHARE_CONTEXT?.configStoreKey) {
        context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
        await ENV.DATABASE.put(
          context.SHARE_CONTEXT.configStoreKey,
          JSON.stringify(ConfigMerger.trim(context.USER_CONFIG, ENV.LOCK_USER_CONFIG_KEYS))
        );
        const suffixWhiteList = ["_PROVIDER", "_MODEL", "_MODELS", "_TOOLS", "_TYPE", "_OUTPUT", "_AGENT", "_TEMPERATURE", "MAPPING_KEY", "MAPPING_VALUE"];
        msg += `${updatedKeys.filter((key) => suffixWhiteList.some((suffix) => key.endsWith(suffix))).map((key) => `${key}: ${context.USER_CONFIG[key]}`).join("\n")}
${updatedKeys.filter((key) => !suffixWhiteList.some((suffix) => key.endsWith(suffix))).join("\n")}`;
      }
      if (remainingText) {
        message.text = remainingText;
        return null;
      }
      return sender.sendRichText(`<pre><code class="language-Update">${msg}</code></pre>`, "HTML", "tip");
    } catch (e) {
      log.error(`/set error: ${e.message}`);
      return sender.sendPlainText(`ERROR: ${e.message}`);
    }
  };
  parseMappings(context) {
    const parseMapping = (mapping) => {
      if (!mapping) {
        return {};
      }
      const entries = [];
      const pairs = mapping.split("|");
      for (const k of pairs) {
        const [key, ...rest] = k.split(":");
        if (!key) {
          console.warn(`Invalid key in mapping: "${k}"`);
          continue;
        }
        const value = rest.length > 0 ? rest.join(":") : "";
        entries.push([key, value]);
      }
      return Object.fromEntries(entries);
    };
    const keys = parseMapping(context.USER_CONFIG.MAPPING_KEY);
    const values = parseMapping(context.USER_CONFIG.MAPPING_VALUE);
    return { keys, values };
  }
  tokenizeSubcommand(subcommand) {
    const regex = /^\s*(-\w+)\s+("[^"]*"|'[^']*'|\S+|$)/;
    const flags = [];
    let text2 = subcommand;
    let match;
    while ((match = regex.exec(text2)) !== null) {
      const flag = match[1];
      let value = match[2];
      if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      flags.push({ flag, value });
      text2 = text2.slice(match[0].length);
    }
    const remainingText = text2.trim();
    log.info(`/set flags: ${JSON.stringify(flags, null, 2)}, remainingText: ${remainingText}`);
    return { flags, remainingText };
  }
  async processSubcommand(flag, value, keys, values, context, sender) {
    let key = keys[flag] || (Object.values(keys).includes(flag.slice(1)) || Object.keys(context.USER_CONFIG).includes(flag.slice(1)) ? flag.slice(1) : null);
    let mappedValue = values[value] ?? value;
    if (!key) {
      throw new Error(`Mapping Key ${flag} not found`);
    }
    if (ENV.LOCK_USER_CONFIG_KEYS.includes(key) && sender) {
      return sender.sendPlainText(`Key ${key} is locked`);
    }
    switch (key) {
      case "SYSTEM_INIT_MESSAGE":
        mappedValue = context.USER_CONFIG.PROMPT[value] || value;
        break;
      case "CHAT_MODEL":
      case "VISION_MODEL":
      case "STT_MODEL":
      case "TTS_MODEL":
        key = context.USER_CONFIG.AI_PROVIDER ? `${context.USER_CONFIG.AI_PROVIDER.toUpperCase()}_${key}` : key;
        break;
      case "USE_TOOLS":
        if (value === "on") {
          mappedValue = Object.keys(tools);
        } else if (value === "off") {
          mappedValue = [];
        }
        break;
    }
    if (!(key in context.USER_CONFIG)) {
      return sender.sendPlainText(`Key ${key} not found`);
    }
    ConfigMerger.merge(context.USER_CONFIG, { [key]: mappedValue || ENV.USER_CONFIG[key] });
    if (!context.USER_CONFIG.DEFINE_KEYS.includes(key) && mappedValue) {
      context.USER_CONFIG.DEFINE_KEYS.push(key);
    } else if (!mappedValue) {
      context.USER_CONFIG.DEFINE_KEYS = context.USER_CONFIG.DEFINE_KEYS.filter((k) => k !== key);
    }
    log.info(`/set ${key} ${(JSON.stringify(mappedValue) || value).substring(0, 100)}...`);
    return key;
  }
  async RelaxAuthCheck(message, context, keys, needUpdate) {
    if (needUpdate || keys.length > 0 && keys.some((key) => !ENV.RELAX_AUTH_KEYS.includes(key))) {
      await authChecker(this, message, context);
    }
  }
}
class PerplexityCommandHandler {
  command = "/pplx";
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    if (isCfWorker) {
      return sender.sendPlainText("Due to the limitation of browser, Perplexity is not supported in worker / browser");
    }
    if (!ENV.PPLX_COOKIE) {
      return sender.sendPlainText("Perplexity cookie is not set");
    }
    const supportedModes = ["internet", "scholar", "writing", "wolfram", "youtube", "reddit"];
    const match = subcommand.split(" ")[0];
    const mode = supportedModes.find((m) => match === m) || "internet";
    if (mode === match) {
      subcommand = subcommand.slice(match.length).trim();
    }
    if (!subcommand) {
      return sender.sendPlainText("Please input your query");
    }
    const perplexityMessageData = {
      version: "2.9",
      source: "default",
      attachments: [],
      language: "en-GB",
      timezone: "Europe/London",
      search_focus: mode,
      frontend_uuid: UUIDv4(),
      mode: "concise",
      is_related_query: false,
      is_default_related_query: false,
      visitor_id: UUIDv4(),
      frontend_context_uuid: UUIDv4(),
      prompt_source: "user",
      query_source: "home"
    };
    const perplexityMessage = [`42["perplexity_ask", "${subcommand}", ${JSON.stringify(perplexityMessageData)}]`];
    const perplexityWsUrl = "wss://www.perplexity.ai/socket.io/?EIO=4&transport=websocket";
    const perplexityWsOptions = {
      headers: {
        "Cookie": ENV.PPLX_COOKIE,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "priority": "u=1, i",
        "Referer": "https://www.perplexity.ai/"
      },
      rejectUnauthorized: false
    };
    await (await sender.sendRichText("Perplexity is asking...")).json();
    const onStream = OnStreamHander(sender, context, subcommand);
    const logs = getLogSingleton(context.USER_CONFIG);
    logs.chat.model = `Perplexity ${mode}`;
    const startTime = Date.now();
    const result = await WssRequest(perplexityWsUrl, null, perplexityWsOptions, perplexityMessage, { onStream }).catch(console.error);
    logs.chat.time.push(((Date.now() - startTime) / 1e3).toFixed(1));
    await onStream.end?.(result);
    return new Response("success");
  };
}
class InlineCommandHandler {
  command = "/settings";
  scopes = ["all_private_chats", "all_chat_administrators"];
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    const defaultInlineKeys = this.defaultInlineKeys(context.USER_CONFIG);
    const currentSettings = this.settingsMessage(context.USER_CONFIG, defaultInlineKeys);
    return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).sendMessage({
      chat_id: message.chat.id,
      ...message.chat.type === "private" ? {} : { reply_to_message_id: message.message_id },
      text: escape(currentSettings),
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: this.inlineKeyboard(context.USER_CONFIG, defaultInlineKeys)
      }
    });
  };
  defaultInlineKeys = (context) => {
    const chatAgent = loadChatLLM(context);
    const imageAgent = loadImageGen(context);
    return {
      INLINE_AGENTS: {
        label: "Agent",
        data: "INLINE_AGENTS",
        config_key: "AI_PROVIDER",
        available_values: CHAT_AGENTS.map((agent) => agent.name)
      },
      INLINE_IMAGE_AGENTS: {
        label: "Image Agent",
        data: "INLINE_IMAGE_AGENTS",
        config_key: "AI_IMAGE_PROVIDER",
        available_values: IMAGE_AGENTS.map((agent) => agent.name)
      },
      INLINE_CHAT_MODELS: {
        label: "Chat Model",
        data: "INLINE_CHAT_MODELS",
        config_key: chatAgent?.modelKey || "None",
        available_values: context.INLINE_CHAT_MODELS || [context[chatAgent?.modelKey || ""]]
      },
      INLINE_VISION_MODELS: {
        label: "Vision Model",
        data: "INLINE_VISION_MODELS",
        config_key: chatAgent?.name === "openai" ? "OPENAI_VISION_MODEL" : chatAgent?.modelKey || "None",
        available_values: context.INLINE_VISION_MODELS || [context[chatAgent?.name === "openai" ? "OPENAI_VISION_MODEL" : chatAgent?.modelKey || ""]]
      },
      INLINE_IMAGE_MODELS: {
        label: "Image Model",
        data: "INLINE_IMAGE_MODELS",
        config_key: imageAgent?.modelKey || "",
        available_values: context.INLINE_IMAGE_MODELS || [context[imageAgent?.modelKey || ""]]
      },
      INLINE_TOOL_MODELS: {
        label: "Tool Model",
        data: "INLINE_TOOL_MODELS",
        config_key: chatAgent?.modelKey || "None",
        available_values: context.INLINE_TOOL_MODELS || [context[chatAgent?.modelKey || ""]]
      },
      INLINE_FUNCTION_TOOLS: {
        label: "Tools",
        data: "INLINE_FUNCTION_TOOLS",
        config_key: "USE_TOOLS",
        available_values: Object.keys({ ...ENV.PLUGINS_FUNCTION, ...tools })
      }
    };
  };
  settingsMessage = (context, inlineKeys) => {
    const menu = "\n当前配置:\n";
    const currentSettings = `${menu}
${Object.entries(inlineKeys).map(([_, { label, config_key }]) => {
      return `\`${label}: ${context[config_key] || "None"}\``;
    }).join("\n")}`;
    return currentSettings;
  };
  inlineKeyboard = (context, inlineKeys) => {
    const inline_keyboard_list = Object.entries(inlineKeys).reduce((acc, [key, { available_values, label }]) => {
      if (available_values.length > 0) {
        acc.push({
          text: label,
          callback_data: key
        });
      }
      return acc;
    }, []);
    inline_keyboard_list.push({
      text: "❌",
      callback_data: "CLOSE"
    });
    return chunckArray(inline_keyboard_list, 3);
  };
}
class KlingAICommandHandler {
  command = "/kling";
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    if (context.USER_CONFIG.KLINGAI_COOKIE.length === 0) {
      return sender.sendPlainText("KlingAI token is not set");
    }
    if (subcommand.trim() === "") {
      return sender.sendPlainText("Please input your prompt");
    }
    try {
      let prompt2 = subcommand.trim();
      let n = context.USER_CONFIG.KLINGAI_IMAGE_COUNT;
      const match = /^\d+/.exec(prompt2);
      if (match) {
        n = Number.parseInt(match[0]);
        prompt2 = prompt2.slice(match[0].length).trim();
      }
      const inputs = [];
      const args = [];
      let type2 = "mmu_txt2img_aiweb";
      if (["image", "photo"].includes(context.MIDDLE_CONTEXT.messageInfo?.type) && context.MIDDLE_CONTEXT.messageInfo.id?.[0]) {
        const COOKIES = context.USER_CONFIG.KLINGAI_COOKIE;
        let cookie = "";
        if (COOKIES.length > 0) {
          cookie = COOKIES[Math.floor(Math.random() * COOKIES.length)];
        } else {
          throw new Error("No KlingAI cookie found");
        }
        const headers = {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          "Cookie": cookie
        };
        const img_id = context.MIDDLE_CONTEXT.messageInfo.id?.[0];
        const img_url = await this.getFileUrl(img_id, context, headers);
        inputs.push({ name: "input", url: img_url, inputType: "URL" });
        args.push({ name: "fidelity", value: 0.5 });
        type2 = "mmu_img2img_aiweb";
      }
      await sender.sendPlainText("Please wait a moment...");
      const data = await new KlingAI().request(prompt2, context.USER_CONFIG, { inputs, args, type: type2, n });
      return sendImages(data, ENV.SEND_IMAGE_AS_FILE, sender, context.USER_CONFIG);
    } catch (e) {
      return sender.sendRichText(`<pre><code class="language-error">${e.message}</code></pre>`, "HTML", "tip");
    }
  };
  getFileUrl = async (file_id, context, headers) => {
    const api = createTelegramBotAPI(context.SHARE_CONTEXT.botToken);
    const img_path = (await api.getFileWithReturns({ file_id }).then((res) => res.result)).file_path;
    const img_blob = await fetch(`https://api.telegram.org/file/bot${context.SHARE_CONTEXT.botToken}/${img_path}`, {}).then((res) => res.blob());
    const { token, domain } = await this.getUploadFileTokenAndEndpoint(headers);
    await fetch(`https://${domain}/api/upload/fragment?upload_token=${token}&fragment_id=0`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/octet-stream"
      },
      body: img_blob
    });
    await fetch(`https://${domain}/api/upload/complete?fragment_count=1&upload_token=${token}`, {
      method: "POST",
      headers
    });
    const url_resp = await fetch(`https://klingai.com/api/upload/verify/token?token=${token}`, {
      headers
    }).then((res) => res.json());
    if (!url_resp.data?.url) {
      throw new Error(url_resp.data.message || "Failed to get file url, see logs for more details");
    }
    return url_resp.data.url;
  };
  getUploadFileTokenAndEndpoint = async (headers) => {
    const resp = await fetch(`https://klingai.com/api/upload/issue/token?filename=image.jpg`, {
      headers
    }).then((res) => res.json());
    if (!resp.data.token || !resp.data?.httpEndpoints?.[0]) {
      throw new Error(`Failed to upload file, see logs for more details`);
    }
    return {
      token: resp.data.token,
      domain: resp.data.httpEndpoints[0]
    };
  };
}
class HistoryCommandHandler {
  command = "/history";
  scopes = ["all_private_chats", "all_chat_administrators"];
  needAuth = COMMAND_AUTH_CHECKER.shareModeGroup;
  handle = async (message, subcommand, context, sender) => {
    const length = Number.parseInt(subcommand.trim()) || context.USER_CONFIG.HISTORY_LENGTH;
    const history = await loadHistory(context.SHARE_CONTEXT.chatHistoryKey, length);
    return sender.sendDocument(new File([JSON.stringify(history, null, 2)], "history.json", { type: "application/json" }));
  };
}
const SYSTEM_COMMANDS = [
  new StartCommandHandler(),
  new NewCommandHandler(),
  new RedoCommandHandler(),
  new ImgCommandHandler(),
  new SetEnvCommandHandler(),
  new SetEnvsCommandHandler(),
  new DelEnvCommandHandler(),
  new ClearEnvCommandHandler(),
  new VersionCommandHandler(),
  new SystemCommandHandler(),
  new HelpCommandHandler(),
  new SetCommandHandler(),
  new PerplexityCommandHandler(),
  new InlineCommandHandler(),
  new KlingAICommandHandler(),
  new HistoryCommandHandler()
];
async function handleSystemCommand(message, raw, command, context) {
  const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
  try {
    if (command.needAuth && !command.relaxAuth) {
      await authChecker(command, message, context);
    }
  } catch (e) {
    return sender.sendPlainText(`ERROR: ${e.message}`);
  }
  const subcommand = raw.substring(command.command.length).trim();
  try {
    return command.handle(message, subcommand, context, sender);
  } catch (e) {
    return sender.sendPlainText(`ERROR: ${e.message}`);
  }
}
async function handlePluginCommand(message, command, raw, template, context) {
  const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
  try {
    const subcommand = raw.substring(command.length).trim();
    if (template.input?.required && !subcommand) {
      throw new Error("Missing required input");
    }
    const DATA = formatInput(subcommand, template.input?.type);
    const { type: type2, content } = await executeRequest(template, {
      DATA,
      ENV: ENV.PLUGINS_ENV
    });
    if (type2 === "image") {
      sendAction(context.SHARE_CONTEXT.botToken, message.chat.id, "upload_photo");
      return sender.sendPhoto(content);
    }
    sendAction(context.SHARE_CONTEXT.botToken, message.chat.id, "typing");
    switch (type2) {
      case "html":
        return sender.sendRichText(content, "HTML");
      case "markdown":
        return sender.sendRichText(content, "Markdown");
      case "markdownV2":
        return sender.sendRichText(content, "MarkdownV2");
      case "text":
      default:
        return sender.sendPlainText(content);
    }
  } catch (e) {
    const help = ENV.PLUGINS_COMMAND[command].description;
    return sender.sendPlainText(`ERROR: ${e.message}${help ? `
${help}` : ""}`);
  }
}
async function handleCommandMessage(message, context) {
  let text2 = (message.text || message.caption || "").trim();
  if (ENV.CUSTOM_COMMAND[text2]) {
    text2 = ENV.CUSTOM_COMMAND[text2].value;
  }
  if (ENV.DEV_MODE) {
    SYSTEM_COMMANDS.push(new EchoCommandHandler());
  }
  for (const key in ENV.PLUGINS_COMMAND) {
    if (text2 === key || text2.startsWith(`${key} `)) {
      let template = ENV.PLUGINS_COMMAND[key].value.trim();
      if (template.startsWith("http")) {
        template = await fetch(template).then((r) => r.text());
      }
      if (key.trim() === text2.trim() && template.includes("{{DATA}}")) {
        const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
        return sender.sendPlainText(`Tip: ${ENV.PLUGINS_COMMAND[key].description || "Please input something"}`, "tip");
      }
      return await handlePluginCommand(message, key, text2, JSON.parse(template), context);
    }
  }
  for (const cmd of SYSTEM_COMMANDS) {
    if (text2 === cmd.command || text2.startsWith(`${cmd.command} `)) {
      log.info(`[SYSTEM COMMAND] handle system command: ${cmd.command}`);
      return handleSystemCommand(message, text2, cmd, context);
    }
  }
  return null;
}
function commandsBindScope() {
  const scopeCommandMap = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: []
  };
  for (const cmd of SYSTEM_COMMANDS) {
    if (ENV.HIDE_COMMAND_BUTTONS.includes(cmd.command)) {
      continue;
    }
    if (cmd.scopes) {
      for (const scope of cmd.scopes) {
        if (!scopeCommandMap[scope]) {
          scopeCommandMap[scope] = [];
        }
        scopeCommandMap[scope].push({
          command: cmd.command,
          description: ENV.I18N.command.help[cmd.command.substring(1)] || ""
        });
      }
    }
  }
  for (const list of [ENV.CUSTOM_COMMAND, ENV.PLUGINS_COMMAND]) {
    for (const [cmd, config] of Object.entries(list)) {
      if (config.scope) {
        for (const scope of config.scope) {
          if (!scopeCommandMap[scope]) {
            scopeCommandMap[scope] = [];
          }
          scopeCommandMap[scope].push({
            command: cmd,
            description: config.description || ""
          });
        }
      }
    }
  }
  const result = {};
  for (const scope in scopeCommandMap) {
    result[scope] = {
      commands: scopeCommandMap[scope],
      scope: {
        type: scope
      }
    };
  }
  return result;
}
function commandsDocument() {
  return SYSTEM_COMMANDS.map((command) => {
    return {
      command: command.command,
      description: ENV.I18N.command.help[command.command.substring(1)] || ""
    };
  }).filter((item) => item.description !== "");
}
async function authChecker(command, message, context) {
  if (ENV.CHAT_WHITE_LIST.includes(message.from?.id?.toString() ?? "")) {
    return;
  }
  const roleList = command.needAuth(message.chat?.type ?? "private");
  if (roleList) {
    const chatRole = await loadChatRoleWithContext(message, context);
    if (chatRole === null) {
      throw new Error("Get chat role failed");
    }
    if (!roleList.includes(chatRole)) {
      throw new Error(`Permission denied, need ${roleList.join(" or ")}`);
    }
  }
}
class ShareContext {
  botId;
  botToken;
  botName = null;
  chatHistoryKey;
  lastMessageKey;
  configStoreKey;
  groupAdminsKey;
  telegraphAccessTokenKey;
  scheduleDeteleKey = "schedule_detele_message";
  storeMediaMessageKey;
  chunkMessageKey;
  isForwarding = false;
  constructor(token, message) {
    const botId = Number.parseInt(token.split(":")[0]);
    const telegramIndex = ENV.TELEGRAM_AVAILABLE_TOKENS.indexOf(token);
    if (telegramIndex === -1) {
      throw new Error("Token not allowed");
    }
    if (ENV.TELEGRAM_BOT_NAME.length > telegramIndex) {
      this.botName = ENV.TELEGRAM_BOT_NAME[telegramIndex];
    }
    this.botToken = token;
    this.botId = botId;
    const id = message?.chat?.id;
    if (id === void 0 || id === null) {
      throw new Error("Chat id not found");
    }
    let historyKey = `history:${id}`;
    let configStoreKey = `user_config:${id}`;
    let chunkMessageKey = ENV.STORE_TEXT_CHUNK_MESSAGE ? `chunk_message:${id}` : void 0;
    let storeMediaMessageKey = ENV.STORE_MEDIA_MESSAGE ? `store_media_message:${id}` : void 0;
    if (botId) {
      historyKey += `:${botId}`;
      configStoreKey += `:${botId}`;
    }
    switch (message.chat.type) {
      case "group":
      case "supergroup":
        if (!ENV.GROUP_CHAT_BOT_SHARE_MODE && message.from?.id) {
          historyKey += `:${message.from.id}`;
          configStoreKey += `:${message.from.id}`;
        }
        this.groupAdminsKey = `group_admin:${id}`;
        if (message.from?.id) {
          chunkMessageKey = chunkMessageKey ? `${chunkMessageKey}:${message.from.id}` : void 0;
          storeMediaMessageKey = storeMediaMessageKey ? `${storeMediaMessageKey}:${message.from.id}` : void 0;
        }
        break;
    }
    if (message?.chat.is_forum && message?.is_topic_message) {
      if (message?.message_thread_id) {
        historyKey += `:${message.message_thread_id}`;
        configStoreKey += `:${message.message_thread_id}`;
      }
    }
    this.chatHistoryKey = historyKey;
    this.lastMessageKey = `last_message_id:${historyKey}`;
    this.configStoreKey = configStoreKey;
    this.chunkMessageKey = chunkMessageKey;
    this.storeMediaMessageKey = storeMediaMessageKey;
    if (ENV.TELEGRAPH_NUM_LIMIT > 0) {
      this.telegraphAccessTokenKey = `telegraph_access_token:${id}`;
    }
  }
}
class MiddleContext {
  messageInfo = { type: "text" };
  history = [];
  sender = null;
}
class WorkerContextBase {
  SHARE_CONTEXT;
  MIDDLE_CONTEXT = new MiddleContext();
  constructor(token, message) {
    this.SHARE_CONTEXT = new ShareContext(token, message);
  }
}
class WorkerContext {
  USER_CONFIG;
  SHARE_CONTEXT;
  MIDDLE_CONTEXT;
  constructor(USER_CONFIG, SHARE_CONTEXT, MIDDLE_CONTEXT) {
    this.USER_CONFIG = USER_CONFIG;
    this.SHARE_CONTEXT = SHARE_CONTEXT;
    this.MIDDLE_CONTEXT = MIDDLE_CONTEXT;
  }
  static async from(SHARE_CONTEXT, MIDDLE_CONTEXT) {
    const USER_CONFIG = { ...ENV.USER_CONFIG };
    try {
      const userConfig = JSON.parse(await ENV.DATABASE.get(SHARE_CONTEXT.configStoreKey));
      ConfigMerger.merge(USER_CONFIG, ConfigMerger.trim(userConfig, ENV.LOCK_USER_CONFIG_KEYS) || {});
    } catch (e) {
      console.warn(e);
    }
    return new WorkerContext(USER_CONFIG, SHARE_CONTEXT, MIDDLE_CONTEXT);
  }
}
class CallbackQueryContext {
  data;
  query_id;
  from;
  USER_CONFIG;
  SHARE_CONTEXT;
  constructor(callbackQuery, workContext) {
    this.data = callbackQuery.data;
    this.query_id = callbackQuery.id;
    this.from = callbackQuery.from;
    this.USER_CONFIG = workContext.USER_CONFIG;
    this.SHARE_CONTEXT = workContext.SHARE_CONTEXT;
  }
}
class InlineQueryContext {
  token;
  query_id;
  from;
  chat_type;
  query;
  constructor(token, inlineQuery) {
    this.token = token;
    this.query_id = inlineQuery.id;
    this.from = inlineQuery.from;
    this.chat_type = inlineQuery.chat_type;
    this.query = inlineQuery.query;
  }
}
class ChosenInlineWorkerContext {
  USER_CONFIG;
  botToken;
  MIDDLE_CONTEXT;
  SHARE_CONTEXT;
  constructor(chosenInline, token, USER_CONFIG) {
    this.USER_CONFIG = USER_CONFIG;
    this.botToken = token;
    this.MIDDLE_CONTEXT = {
      messageInfo: { type: "text" }
    };
    this.SHARE_CONTEXT = {
      botName: "AI",
      telegraphAccessTokenKey: `telegraph_access_token:${chosenInline.from.id}`
    };
  }
  static async from(token, chosenInline) {
    const USER_CONFIG = { ...ENV.USER_CONFIG };
    let userConfigKey = `user_config:${chosenInline.from.id}`;
    const botId = Number.parseInt(token.split(":")[0]);
    if (botId) {
      userConfigKey += `:${botId}`;
    }
    try {
      const userConfig = JSON.parse(await ENV.DATABASE.get(userConfigKey));
      ConfigMerger.merge(USER_CONFIG, ConfigMerger.trim(userConfig, ENV.LOCK_USER_CONFIG_KEYS) || {});
      USER_CONFIG.ENABLE_SHOWINFO = ENV.INLINE_QUERY_SHOW_INFO;
      ENV.TELEGRAM_MIN_STREAM_INTERVAL = ENV.INLINE_QUERY_SEND_INTERVAL;
    } catch (e) {
      console.warn(e);
    }
    return new ChosenInlineWorkerContext(chosenInline, token, USER_CONFIG);
  }
}
function checkMention(content, entities, botName, botId) {
  let isMention = false;
  for (const entity of entities) {
    const entityStr = content.slice(entity.offset, entity.offset + entity.length);
    switch (entity.type) {
      case "mention":
        if (entityStr === `@${botName}`) {
          isMention = true;
          content = content.slice(0, entity.offset) + content.slice(entity.offset + entity.length);
        }
        break;
      case "text_mention":
        if (`${entity.user?.id}` === `${botId}`) {
          isMention = true;
          content = content.slice(0, entity.offset) + content.slice(entity.offset + entity.length);
        }
        break;
      case "bot_command":
        if (entityStr.endsWith(`@${botName}`)) {
          isMention = true;
          const newEntityStr = entityStr.replace(`@${botName}`, "");
          content = content.slice(0, entity.offset) + newEntityStr + content.slice(entity.offset + entity.length);
        }
        break;
    }
  }
  return {
    isMention,
    content
  };
}
function SubstituteWords(message) {
  const oldTrigger = ENV.CHAT_MESSAGE_TRIGGER;
  if (Object.keys(oldTrigger).length > 0) {
    const triggered = Object.entries(oldTrigger).find(([key, _value]) => message.text?.startsWith(key));
    if (triggered) {
      message.text && (message.text = triggered[1] + message.text.substring(triggered[0].length));
      message.caption && (message.caption = triggered[1] + message.caption.substring(triggered[0].length));
      return true;
    } else {
      return false;
    }
  }
  let replacedString = "";
  const textBefore = message.text || message.caption || "";
  let text2 = textBefore.replace(new RegExp(`^${ENV.CHAT_TRIGGER_PERFIX}`), "").trim();
  const isTrigger = text2 !== textBefore;
  const replacer = { ...ENV.MESSAGE_REPLACER };
  do {
    const triggerKey = Object.keys(replacer).find(
      (key) => text2.startsWith(key)
    );
    if (triggerKey) {
      replacedString += `${replacer[triggerKey]} `;
      text2 = text2.substring(triggerKey.length).trim();
      delete replacer[triggerKey];
    } else {
      break;
    }
  } while (true);
  message.text ? message.text = replacedString + text2 : message.caption = replacedString + text2;
  return isTrigger;
}
class GroupMention {
  handle = async (message, context) => {
    const substituteMention = SubstituteWords(message);
    if (!isTelegramChatTypeGroup(message.chat.type)) {
      this.mergeMessage(false, message);
      const noneMessage = await this.noneMessage(message, context);
      if (noneMessage instanceof Response) {
        return noneMessage;
      }
      return this.furtherChecker(message, context);
    }
    const replyMe = `${message.reply_to_message?.from?.id}` === `${context.SHARE_CONTEXT.botId}`;
    if (replyMe) {
      if (context.SHARE_CONTEXT.botName && message.text?.endsWith(`@${context.SHARE_CONTEXT.botName}`)) {
        message.text = message.text.slice(0, -context.SHARE_CONTEXT.botName.length - 1);
      }
      const data = this.furtherChecker(message, context);
      return data;
    }
    let botName = context.SHARE_CONTEXT.botName;
    if (!botName) {
      const res = await createTelegramBotAPI(context.SHARE_CONTEXT.botToken).getMeWithReturns();
      botName = res.result.username || null;
      context.SHARE_CONTEXT.botName = botName;
    }
    if (!botName) {
      throw new Error("Not set bot name");
    }
    let isMention = false;
    if (message.text && message.entities) {
      const res = checkMention(message.text, message.entities, botName, context.SHARE_CONTEXT.botId);
      isMention = res.isMention;
      message.text = res.content.trim();
    }
    if (message.caption && message.caption_entities) {
      const res = checkMention(message.caption, message.caption_entities, botName, context.SHARE_CONTEXT.botId);
      isMention = res.isMention || isMention;
      message.caption = res.content.trim();
    }
    if ((substituteMention || context.SHARE_CONTEXT.isForwarding) && !isMention) {
      isMention = true;
    }
    const finalCheckResult = await this.furtherChecker(message, context);
    if (finalCheckResult instanceof Response) {
      return finalCheckResult;
    }
    if (!isMention && !finalCheckResult) {
      log.error("Not mention");
      return new Response("Not mention");
    }
    this.mergeMessage(replyMe, message);
    return this.noneMessage(message, context);
  };
  furtherChecker = async (message, context) => {
    let forwardCheckResult = null;
    if (message.media_group_id || message.reply_to_message?.media_group_id) {
      forwardCheckResult = await new HandleMediaGroupMessage().handle(message, context);
    } else if (message.text) {
      forwardCheckResult = await new HandleChunkMessage().handle(message, context);
    }
    if (forwardCheckResult instanceof Response) {
      return forwardCheckResult;
    }
    return null;
  };
  mergeMessage = async (replyMe, message) => {
    if (ENV.EXTRA_MESSAGE_CONTEXT && !replyMe && message.reply_to_message) {
      const replyText = message.reply_to_message.text || message.reply_to_message.caption || "";
      const currentText = message.text || message.caption || "";
      message.text = `${currentText}
${replyText ? `> ${replyText}` : ""}`;
    }
  };
  noneMessage = async (message, context) => {
    const messageInfo = context.MIDDLE_CONTEXT.messageInfo;
    if (messageInfo.type === "text" && message.text === "" && (message.reply_to_message?.text ?? "") === "") {
      const resp = createTelegramBotAPI(context.SHARE_CONTEXT.botToken).sendMessage({
        chat_id: message.chat.id,
        text: "?"
      });
      return checkIsNeedTagIds({ chatType: message.chat.type, message }, resp, "chat");
    }
    return null;
  };
}
class Lock {
  lockKey = "";
  quireLock = async () => {
    let retry = 0;
    while (retry < 24) {
      await new Promise((resolve2) => setTimeout(resolve2, 50));
      const lock = await ENV.DATABASE.put(this.lockKey, "1", { expirationTtl: 1, condition: "NX" });
      if (lock === true || lock === void 0) {
        log.info(`Lock success, key: ${this.lockKey}, retry: ${retry}`);
        return;
      }
      log.info(`Lock failed, key: ${this.lockKey}, retry: ${retry}`);
      retry++;
    }
    throw new Error("Lock failed");
  };
  releaseLock = async () => {
    await ENV.DATABASE.delete(this.lockKey);
  };
}
class HandleChunkMessage extends Lock {
  handle = async (message, context) => {
    const chunkMessageKey = context.SHARE_CONTEXT?.chunkMessageKey;
    if (!chunkMessageKey) {
      return null;
    }
    const textFragmentThreshold = 4e3;
    if ((message.text || "")?.length > textFragmentThreshold) {
      this.lockKey = `${chunkMessageKey}:lock`;
      await this.quireLock();
      await this.chunkMessageStore(message, chunkMessageKey);
      await this.releaseLock();
      return new Response("ok");
    }
    await new Promise((resolve2) => setTimeout(resolve2, 50));
    log.info(`[CHUNK MESSAGE] handle chunk message, key: ${chunkMessageKey}`);
    const chuncks = JSON.parse(await ENV.DATABASE.get(chunkMessageKey) || "[]");
    if (chuncks.length > 0) {
      message.text = chuncks.sort((a, b) => a.message_id - b.message_id).map(({ text: text2 }) => text2).join("\n") + message.text;
      log.info(`[CHUNK MESSAGE] Merged message chunk, text: ${message.text}`);
      await ENV.DATABASE.delete(chunkMessageKey);
      return true;
    }
    return false;
  };
  async chunkMessageStore(message, chunkMessageKey) {
    log.info(`[CHUNK MESSAGE] Stored message chunk, message_id: ${message.message_id} key: ${chunkMessageKey}`);
    const data = JSON.parse(await ENV.DATABASE.get(chunkMessageKey) || "[]");
    data.push({
      message_id: message.message_id,
      text: message.text
    });
    return ENV.DATABASE.put(chunkMessageKey, JSON.stringify(data), { expirationTtl: 5 });
  }
}
class HandleMediaGroupMessage extends Lock {
  handle = async (message, context) => {
    const storeMediaMessageKey = context.SHARE_CONTEXT?.storeMediaMessageKey;
    if (!storeMediaMessageKey) {
      return null;
    }
    const msgInfo = context.MIDDLE_CONTEXT.messageInfo;
    if (message.media_group_id && ["photo", "image"].includes(msgInfo.type) && Array.isArray(msgInfo.id)) {
      return this.storeMediaMessage(message, storeMediaMessageKey, msgInfo);
    } else if (message.reply_to_message?.media_group_id) {
      const data = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || "{}");
      const fileIds = data[message.reply_to_message.media_group_id];
      if (fileIds) {
        context.MIDDLE_CONTEXT.messageInfo.id = fileIds;
      }
    }
    return null;
  };
  storeMediaMessage = async (message, storeMediaMessageKey, msgInfo) => {
    const maxMediaGroupNum = 10;
    this.lockKey = `${storeMediaMessageKey}:lock`;
    await this.quireLock();
    const data = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || "{}");
    console.debug(`current data length: ${data?.[msgInfo.media_group_id]?.length ?? 0}`);
    if (!data[msgInfo.media_group_id]) {
      data[msgInfo.media_group_id] = [];
    }
    const needStoreIds = msgInfo.id?.filter((id) => !data[msgInfo.media_group_id].includes(id)) || [];
    if (needStoreIds.length === 0) {
      await this.releaseLock();
      return new Response("no need store");
    }
    data[msgInfo.media_group_id].push(...needStoreIds);
    if (Object.keys(data).length > maxMediaGroupNum) {
      const groupIds = Object.keys(data).sort((a, b) => Number(a) - Number(b));
      groupIds.splice(0, groupIds.length - maxMediaGroupNum).forEach((key) => {
        delete data[key];
      });
    }
    await ENV.DATABASE.put(storeMediaMessageKey, JSON.stringify(data));
    await this.releaseLock();
    log.info(`[STORE MESSAGE] Store message media, group_id: ${msgInfo.media_group_id}, id: ${msgInfo.id}`);
    return new Response("ok");
  };
}
class OpenaiEmbedding extends OpenAIBase {
  request = async (data, context) => {
    const { embeddings, values } = await embedMany({
      model: createOpenAI({
        baseURL: context.OPENAI_API_BASE,
        apiKey: this.apikey(context)
      }).embedding(context.OPENAI_EMBEDDING_MODEL),
      values: data,
      maxRetries: 0
    });
    return values.map((value, i) => ({ embed: embeddings[i], value }));
  };
}
class OpenAILikeEmbedding extends OpenAILikeBase {
  request = async (data, context) => {
    const { embeddings, values } = await embedMany({
      model: createOpenAI({
        baseURL: context.OAILIKE_API_BASE,
        apiKey: context.OAILIKE_API_KEY || void 0
      }).embedding(context.OAILIKE_EMBEDDING_MODEL),
      values: data
    });
    return values.map((value, i) => ({ embed: embeddings[i], value }));
  };
}
class GoogleEmbedding {
  request = async (data, context) => {
    const { embeddings, values } = await embedMany({
      model: createGoogleGenerativeAI({
        baseURL: context.GOOGLE_API_BASE,
        apiKey: context.GOOGLE_API_KEY || void 0
      }).textEmbeddingModel(context.GOOGLE_EMBEDDING_MODEL),
      values: data,
      maxRetries: 0
    });
    return values.map((value, i) => ({ embed: embeddings[i], value }));
  };
}
const generalRerankAgent = {
  openai: new OpenaiEmbedding(),
  oailikeV1: new OpenAILikeEmbedding(),
  oailikeV2: new OpenAILikeEmbedding(),
  google: new GoogleEmbedding()
};
class Rerank {
  rank = async (context, data, topN = 1) => {
    switch (context.RERANK_AGENT) {
      case "jina":
        return this.jina(context, data, topN);
      case "openai":
      case "oailikeV1":
      case "google":
        return this.generalRerankAgent(context, data, topN);
      case "oailikeV2":
        return this.oailikeV2(context, data, topN);
      default:
        throw new Error("Invalid RERANK_AGENT");
    }
  };
  generalRerankAgent = async (context, data, topN) => {
    const embeddings = await generalRerankAgent[context.RERANK_AGENT].request(data, context);
    const inputEmbeddings = embeddings[0].embed;
    return embeddings.slice(1).map(({ embed, value }) => ({ similar: cosineSimilarity(inputEmbeddings, embed), value })).sort((a, b) => b.similar - a.similar).slice(0, topN);
  };
  jina = async (context, data, topN) => {
    const url = "https://api.jina.ai/v1/rerank";
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.JINA_API_KEY}`
      },
      body: JSON.stringify({
        model: context.JINA_RERANK_MODEL,
        query: data[0],
        documents: data.slice(1),
        top_n: topN
      })
    }).then((res) => res.json());
    if (!result.results) {
      throw new Error(`${JSON.stringify(result)}`);
    }
    return result.results.map((item) => ({ similar: item.relevance_score, value: item.document.text }));
  };
  oailikeV2 = async (context, data, topN) => {
    const url = `${context.OAILIKE_API_BASE}/rerank`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.OAILIKE_API_KEY}`
      },
      body: JSON.stringify({
        model: context.OAILIKE_RERANK_MODEL,
        query: data[0],
        documents: data.slice(1),
        top_n: topN,
        return_documents: true
      })
    }).then((res) => res.json());
    if (!result.results) {
      throw new Error(`${JSON.stringify(result)}`);
    }
    return result.results.map((item) => ({ similar: item.relevance_score, value: item.document.text }));
  };
}
class SaveLastMessage {
  handle = async (message, context) => {
    if (!ENV.DEBUG_MODE) {
      return null;
    }
    const lastMessageKey = `last_message:${context.SHARE_CONTEXT.chatHistoryKey}`;
    await ENV.DATABASE.put(lastMessageKey, JSON.stringify(message));
    return null;
  };
}
class OldMessageFilter {
  handle = async (message, context) => {
    if (!ENV.SAFE_MODE || context.SHARE_CONTEXT.isForwarding) {
      return null;
    }
    let idList = [];
    try {
      idList = JSON.parse(await ENV.DATABASE.get(context.SHARE_CONTEXT.lastMessageKey).catch(() => "[]")) || [];
    } catch (e) {
      console.error(e);
    }
    if (idList.includes(message.message_id)) {
      throw new Error("Ignore old message");
    } else {
      idList.push(message.message_id);
      if (idList.length > 100) {
        idList.shift();
      }
      await ENV.DATABASE.put(context.SHARE_CONTEXT.lastMessageKey, JSON.stringify(idList));
    }
    return null;
  };
}
class EnvChecker {
  handle = async (message, context) => {
    if (!ENV.DATABASE) {
      return MessageSender.from(context.SHARE_CONTEXT.botToken, message).sendPlainText("DATABASE Not Set");
    }
    return null;
  };
}
class WhiteListFilter {
  handle = async (message, context) => {
    if (ENV.I_AM_A_GENEROUS_PERSON) {
      return null;
    }
    const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
    const text2 = `You are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${message.chat.id}`;
    if (message.chat.type === "private") {
      if (!ENV.CHAT_WHITE_LIST.includes(`${message.chat.id}`)) {
        log.error(`[WHITE LIST] ${message.chat.id} not in white list`);
        return new Response("success", { status: 200 });
      }
      return null;
    }
    if (isTelegramChatTypeGroup(message.chat.type)) {
      if (!ENV.GROUP_CHAT_BOT_ENABLE) {
        throw new Error("Not support");
      }
      if (!ENV.CHAT_GROUP_WHITE_LIST.includes(`${message.chat.id}`)) {
        return sender.sendPlainText(text2);
      }
      return null;
    }
    return sender.sendPlainText(
      `Not support chat type: ${message.chat.type}`
    );
  };
}
class MessageFilter {
  handle = async (message, context) => {
    if (ENV.IGNORE_TEXT_PERFIX && (message.text || message.caption || "").startsWith(ENV.IGNORE_TEXT_PERFIX)) {
      log.info(`[IGNORE MESSAGE] Ignore message`);
      return new Response("success", { status: 200 });
    }
    const messageInfo = extractMessageInfo(message, context.SHARE_CONTEXT.botId);
    const supportMessageType = ENV.ENABLE_FILE === false ? ["text"] : ENV.SUPPORT_FORMAT;
    const types = [messageInfo.original_type, messageInfo.type];
    if (!types.every((type2) => supportMessageType.includes(type2))) {
      log.error(`[MESSAGE FILTER] Not supported message type: ${types.join(", ")}`);
      return new Response("success", { status: 200 });
    }
    context.MIDDLE_CONTEXT.messageInfo = messageInfo;
    return null;
  };
}
class CommandHandler {
  handle = async (message, context) => {
    if (message.text || message.caption) {
      return await handleCommandMessage(message, context);
    }
    return null;
  };
}
class InitUserConfig {
  handle = async (message, context) => {
    Object.assign(context, { USER_CONFIG: (await WorkerContext.from(context.SHARE_CONTEXT, context.MIDDLE_CONTEXT)).USER_CONFIG });
    return null;
  };
}
class TagNeedDelete {
  handle = async (message, context) => {
    if ((tagMessageIds.get(message) ?? /* @__PURE__ */ new Set()).size === 0) {
      log.info(`[TAG MESSAGE] No message id to tag`);
      return null;
    }
    const botName = context.SHARE_CONTEXT?.botName;
    if (!botName) {
      throw new Error("Cannot find Bot Name, cannot set scheduled deletion.");
    }
    const chatId = message.chat.id;
    const scheduleDeteleKey = context.SHARE_CONTEXT.scheduleDeteleKey;
    const scheduledData = JSON.parse(await ENV.DATABASE.get(scheduleDeteleKey) || "{}");
    if (!scheduledData[botName]) {
      scheduledData[botName] = {};
    }
    if (!scheduledData[botName][chatId]) {
      scheduledData[botName][chatId] = [];
    }
    const offsetInMillisenconds = ENV.EXPIRED_TIME * 60 * 1e3;
    scheduledData[botName][chatId].push({
      id: [...tagMessageIds.get(message) || []],
      ttl: Date.now() + offsetInMillisenconds
    });
    await ENV.DATABASE.put(scheduleDeteleKey, JSON.stringify(scheduledData));
    log.info(`[TAG MESSAGE] Record chat ${chatId}, message ids: ${[...tagMessageIds.get(message) || []]}`);
    return null;
  };
}
class CheckForwarding {
  handle = async (message, context) => {
    if (ENV.QSTASH_PUBLISH_URL && ENV.QSTASH_TOKEN && ENV.QSTASH_TRIGGER_PREFIX && !context.SHARE_CONTEXT.isForwarding) {
      let text2 = (message.text || message.caption || "").trim();
      if (text2.startsWith(ENV.QSTASH_TRIGGER_PREFIX)) {
        text2 = text2.slice(ENV.QSTASH_TRIGGER_PREFIX.length);
        if (message.text) {
          message.text = text2;
        } else {
          message.caption = text2;
        }
        const QSTASH_REQUEST_URL = `${ENV.QSTASH_URL}/v2/publish/${ENV.QSTASH_PUBLISH_URL}/telegram/${context.SHARE_CONTEXT.botToken}/webhook`;
        log.info(`[FORWARD] Forward message to Qstash`);
        const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
        await sender.sendRichText("`Forwarding message to Qstash`", "MarkdownV2", "tip");
        return await fetch(QSTASH_REQUEST_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ENV.QSTASH_TOKEN}`,
            "Upstash-Timeout": `${ENV.QSTASH_TIMEOUT}`,
            "Upstash-Retries": "0"
          },
          body: JSON.stringify({
            message
          })
        });
      }
    }
    return null;
  };
}
class IntelligentModelProcess {
  handle = async (message, context) => {
    if (!context.USER_CONFIG.ENABLE_INTELLIGENT_MODEL) {
      return null;
    }
    const regex = /^\s*\/\/([cvt])\s*(\S+)/;
    const text2 = new RegExp(regex).exec((message.text || message.caption || "").trim());
    if (text2?.[1] && text2[2]) {
      const rerank = new Rerank();
      const sendTipPromise = this.sendTip(context, message);
      try {
        const similarityModel = (await rerank.rank(context.USER_CONFIG, [text2[2], ...context.USER_CONFIG.RERANK_MODELS], 1))[0].value;
        if (!similarityModel) {
          return this.editTip(context, (await sendTipPromise).result, "No similarity model found");
        }
        log.info(`[INTELLIGENT MODEL] find similarity model: ${similarityModel}`);
        const mode = text2[1];
        let textReplace = `/set `;
        switch (mode) {
          case "c":
            textReplace += `-CHAT_MODEL`;
            break;
          case "v":
            textReplace += `-VISION_MODEL`;
            break;
          case "t":
            textReplace += `-TOOL_MODEL`;
            break;
        }
        textReplace += ` ${similarityModel}`;
        if (message.text) {
          message.text = textReplace + message.text.slice(text2[0].length);
        } else if (message.caption) {
          message.caption = textReplace + message.caption.slice(text2[0].length);
        }
        this.deleteTip(context, (await sendTipPromise).result);
      } catch (error) {
        return this.editTip(context, (await sendTipPromise).result, error.message, "Error");
      }
    }
    return null;
  };
  sendTip = (context, message) => {
    const tip = "Searching for similarity result...";
    const sendeParams = {
      chat_id: message.chat.id,
      text: tip,
      message_thread_id: message.is_topic_message && message.message_thread_id ? message.message_thread_id : void 0,
      entities: [{
        type: "italic",
        offset: 0,
        length: tip.length
      }]
    };
    return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).sendMessageWithReturns(sendeParams);
  };
  deleteTip = (context, message) => {
    const delParams = {
      message_id: message.message_id,
      chat_id: message.chat.id
    };
    log.info("delete similarity tip.");
    return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).deleteMessage(delParams);
  };
  editTip = async (context, message, tip, type2 = "Tip") => {
    const editParams = {
      chat_id: message.chat.id,
      message_id: message.message_id,
      text: tip,
      entities: [{
        type: "pre",
        offset: 0,
        length: tip.length,
        language: type2
      }]
    };
    return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).editMessageText(editParams);
  };
}
class AnswerChatInlineQuery {
  type = ":c";
  handler = async (chosenInline, context) => {
    const sender = ChosenInlineSender.from(context.botToken, chosenInline);
    const question = await this.handlerQuestion(chosenInline, context, sender);
    if (!question) {
      return new Response("ok");
    }
    const agent = loadChatLLM(context.USER_CONFIG);
    if (!agent) {
      throw new Error("Agent not found");
    }
    const isStream = chosenInline.result_id === ":c stream";
    const OnStream = OnStreamHander(sender, context, question);
    const messages = [{ role: "user", content: question }];
    if (context.USER_CONFIG.SYSTEM_INIT_MESSAGE) {
      messages.unshift({ role: "system", content: context.USER_CONFIG.SYSTEM_INIT_MESSAGE });
    }
    try {
      const resp = await agent.request({
        messages
      }, context.USER_CONFIG, isStream ? OnStream : null);
      const { content: answer } = resp;
      if (answer === "") {
        return OnStream.end?.("Response is empty");
      }
      return OnStream.end?.(answer);
    } catch (e) {
      const filtered = e.message.replace(context.botToken, "[REDACTED]");
      return OnStream.sender.sendRichText(`<pre><code class="language-error">${filtered.substring(0, 2048)}</code></pre>`, "HTML", "tip");
    }
  };
  handlerQuestion = async (chosenInline, context, sender) => {
    const question = chosenInline.query.substring(0, chosenInline.query.length - 1).trim();
    const message = { text: question };
    SubstituteWords(message);
    if (message.text?.startsWith("/set ")) {
      const resp = await new SetCommandHandler().handle(message, message.text.substring(5).trim(), context, sender);
      if (resp instanceof Response) {
        return "";
      }
    }
    return message.text || "";
  };
}
async function handleCallbackQuery(token, callbackQuery) {
  try {
    log.info("handleCallbackQuery");
    if (!callbackQuery?.message || !callbackQuery?.data) {
      throw new Error("Not support callback query type");
    }
    const workContext = new WorkerContextBase(token, callbackQuery.message);
    const handlers = [
      new EnvChecker(),
      new WhiteListFilter(),
      new InitUserConfig()
    ];
    for (const handler2 of handlers) {
      const result2 = await handler2.handle(callbackQuery.message, workContext);
      if (result2 instanceof Response) {
        return result2;
      }
    }
    const callbackQueryContext = new CallbackQueryContext(callbackQuery, workContext);
    const result = await new HandlerCallbackQuery().handle(callbackQuery.message, callbackQueryContext);
    if (result instanceof Response) {
      return result;
    }
  } catch (e) {
    return catchError(e);
  }
  return null;
}
async function handleInlineQuery(token, inlineQuery) {
  log.info(`handleInlineQuery`, inlineQuery);
  try {
    const context = new InlineQueryContext(token, inlineQuery);
    const handlers = [
      new CheckInlineQueryWhiteList(),
      new HandlerInlineQuery()
    ];
    for (const handler2 of handlers) {
      const result = await handler2.handle(inlineQuery, context);
      if (result instanceof Response) {
        return result;
      }
    }
  } catch (error) {
    return catchError(error);
  }
  return null;
}
async function handleChosenInline(token, chosenInlineQuery) {
  log.info(`handleChosenInlineQuery`, chosenInlineQuery);
  try {
    const context = await ChosenInlineWorkerContext.from(token, chosenInlineQuery);
    const handlers = [
      new AnswerInlineQuery()
    ];
    for (const handler2 of handlers) {
      const result = await handler2.handle(chosenInlineQuery, context);
      if (result instanceof Response) {
        return result;
      }
    }
  } catch (error) {
    return catchError(error);
  }
  return null;
}
class HandlerCallbackQuery {
  handle = async (message, context) => {
    if (!context.data) {
      return new Response("success", { status: 200 });
    }
    const api = createTelegramBotAPI(context.SHARE_CONTEXT.botToken);
    const checkRoleResult = await this.checkWhiteList(message, context, api);
    if (checkRoleResult instanceof Response) {
      return checkRoleResult;
    }
    if (context.data === "CLOSE") {
      return this.closeInlineKeyboard(api, message);
    }
    const queryHandler = new InlineCommandHandler();
    const defaultInlineKeys = queryHandler.defaultInlineKeys(context.USER_CONFIG);
    const [inlineKey, option] = context.data.split(".");
    await this.checkInlineKey(api, context, inlineKey, option, defaultInlineKeys);
    let inlineKeyboard = [];
    if (inlineKey === "BACK") {
      inlineKeyboard = queryHandler.inlineKeyboard(context.USER_CONFIG, defaultInlineKeys);
    } else {
      const configKey = defaultInlineKeys[inlineKey].config_key;
      const optionValue = defaultInlineKeys[inlineKey].available_values?.[Number.parseInt(option)];
      if (optionValue) {
        await this.updateConfig(context, api, configKey, optionValue);
      }
      let configValue = context.USER_CONFIG[configKey];
      if (typeof configValue === "boolean") {
        configValue = configValue ? "true" : "false";
      }
      inlineKeyboard = this.updateInlineList(defaultInlineKeys[inlineKey], configValue);
    }
    const settingMessage = queryHandler.settingsMessage(context.USER_CONFIG, queryHandler.defaultInlineKeys(context.USER_CONFIG));
    return this.sendCallBackMessage(api, message, settingMessage, inlineKeyboard);
  };
  async checkInlineKey(api, context, key, index2, inlineKeys) {
    if (key === "BACK") {
      return;
    }
    if (index2 && inlineKeys[key]?.available_values?.[index2] || !index2 && inlineKeys[key]) {
      return;
    }
    this.sendAlert(api, context.query_id, "Not support inline key", false);
    throw new Error("Not support inline key");
  }
  async sendAlert(api, query_id, text2, show_alert, cache_time) {
    return api.answerCallbackQuery({
      callback_query_id: query_id,
      text: text2,
      show_alert,
      cache_time
    });
  }
  async checkWhiteList(message, context, api) {
    if (ENV.CHAT_WHITE_LIST.includes(`${context.from.id}`)) {
      return null;
    }
    const roleList = COMMAND_AUTH_CHECKER.shareModeGroup(message.chat.type);
    if (roleList) {
      const chatRole = await loadChatRoleWithContext(message, context, true);
      if (chatRole === null) {
        return this.sendAlert(api, context.query_id, "⚠️ Get chat role failed", false);
      }
      if (!roleList.includes(chatRole)) {
        log.error(`[CALLBACK QUERY] User ${context.from.first_name}, id: ${context.from.id} not in the white list`);
        return this.sendAlert(api, context.query_id, `⚠️ You don't have permission to operate`, true);
      }
    }
    return null;
  }
  async updateConfig(context, api, configKey, newValue) {
    const oldValue = context.USER_CONFIG[configKey];
    const type2 = Array.isArray(oldValue) ? "array" : typeof oldValue;
    switch (type2) {
      case "string":
      case "boolean":
        if (oldValue === newValue) {
          return;
        } else {
          context.USER_CONFIG[configKey] = newValue;
        }
        break;
      case "array":
        if (oldValue.includes(newValue)) {
          oldValue.splice(oldValue.indexOf(newValue), 1);
        } else {
          oldValue.push(newValue);
        }
        break;
      default:
        throw new TypeError("Not support config type");
    }
    if (!context.USER_CONFIG.DEFINE_KEYS.includes(configKey)) {
      context.USER_CONFIG.DEFINE_KEYS.push(configKey);
    }
    log.info(`[CALLBACK QUERY] Update config: ${configKey} = ${context.USER_CONFIG[configKey]}`);
    await ENV.DATABASE.put(context.SHARE_CONTEXT.configStoreKey, JSON.stringify(context.USER_CONFIG)).catch(console.error);
    this.sendAlert(api, context.query_id, "✅ Data update successful", false);
  }
  async closeInlineKeyboard(api, message) {
    return api.deleteMessage({
      chat_id: message.chat.id,
      message_id: message.message_id
    }).then((r) => r.json());
  }
  async sendCallBackMessage(api, message, text2, inline_keyboard) {
    return api.editMessageText({
      chat_id: message.chat.id,
      message_id: message.message_id,
      ...message.chat.type === "private" ? {} : { reply_to_message_id: message.message_id },
      text: escape(text2),
      parse_mode: "MarkdownV2",
      reply_markup: { inline_keyboard }
    });
  }
  updateInlineList(inline_item, configValue) {
    const inline_list = inline_item.available_values.map((item, index2) => {
      let selected = "";
      if (configValue && item === configValue || Array.isArray(configValue) && configValue?.includes(item)) {
        selected = "✅";
      }
      return {
        text: `${selected}${item}`,
        callback_data: `${inline_item.data}.${index2}`
      };
    });
    inline_list.push({
      text: "↩️",
      callback_data: "BACK"
    }, {
      text: "❌",
      callback_data: "CLOSE"
    });
    return chunckArray(inline_list, 2);
  }
}
class HandlerInlineQuery {
  handle = async (chosenInline, context) => {
    const endSuffix = "$";
    if (!chosenInline.query.endsWith(endSuffix)) {
      log.info(`[INLINE QUERY] Not end with $: ${chosenInline.query}`);
      return new Response("success", { status: 200 });
    }
    const api = createTelegramBotAPI(context.token);
    const resp = await api.answerInlineQuery({
      inline_query_id: context.query_id,
      results: [{
        type: "article",
        id: ":c stream",
        title: "Stream Mode",
        input_message_content: {
          message_text: `Please wait a moment`
        },
        reply_markup: {
          inline_keyboard: [
            [{
              text: "Thinking...",
              callback_data: ":c stream"
            }]
          ]
        }
      }, {
        type: "article",
        id: ":c full",
        title: "Full Mode",
        input_message_content: {
          message_text: `Please wait a moment`
        },
        reply_markup: {
          inline_keyboard: [
            [{
              text: "Thinking...",
              callback_data: ":c full"
            }]
          ]
        }
      }]
    }).then((r) => r.json());
    log.info(`[INLINE QUERY] Answer inline query: ${JSON.stringify(resp)}`);
    return new Response("success", { status: 200 });
  };
}
class CheckInlineQueryWhiteList {
  handle = async (inlineQuery, context) => {
    if (ENV.CHAT_WHITE_LIST.includes(`${context.from.id}`)) {
      return null;
    }
    log.error(`User ${context.from.username}, id: ${context.from.id} not in the white list`);
    return new Response(`User ${context.from.id} not in the white list`, { status: 403 });
  };
}
class AnswerInlineQuery {
  handle = async (chosenInline, context) => {
    const answer = new AnswerChatInlineQuery();
    return answer.handler(chosenInline, context);
  };
}
function loadMessage(body, isForwarding) {
  switch (true) {
    case !!body.message:
      return (token) => handleMessage(token, body.message, isForwarding);
    case !!body.inline_query:
      return (token) => handleInlineQuery(token, body.inline_query);
    case !!body.callback_query:
      return (token) => handleCallbackQuery(token, body.callback_query);
    case !!body.chosen_inline_result:
      return (token) => handleChosenInline(token, body.chosen_inline_result);
    case !!body.edited_message:
      log.info("Ignore edited message");
      return null;
    default:
      log.info(`Not support message type: ${JSON.stringify(body, null, 2)}`);
      return null;
  }
}
const exitHanders = [new TagNeedDelete()];
async function handleUpdate(token, update, headers) {
  log.debug(`handleUpdate`, update.message?.chat);
  const isForwarding = headers?.get("User-Agent") === "Upstash-QStash";
  const messageHandler = loadMessage(update, isForwarding);
  return messageHandler ? messageHandler(token) : null;
}
async function handleMessage(token, message, isForwarding) {
  const SHARE_HANDLER = [
    new EnvChecker(),
    new WhiteListFilter(),
    new MessageFilter(),
    new GroupMention(),
    new OldMessageFilter(),
    new SaveLastMessage(),
    new InitUserConfig(),
    new IntelligentModelProcess(),
    new CommandHandler(),
    new CheckForwarding(),
    new ChatHandler()
  ];
  const context = new WorkerContextBase(token, message);
  context.SHARE_CONTEXT.isForwarding = isForwarding;
  try {
    for (const handler2 of SHARE_HANDLER) {
      const result = await handler2.handle(message, context);
      if (result instanceof Response) {
        break;
      }
    }
    for (const handler2 of exitHanders) {
      const result = await handler2.handle(message, context);
      if (result && result instanceof Response) {
        return result;
      }
    }
  } catch (e) {
    return catchError(e);
  }
  return null;
}
function catchError(e) {
  console.error(e.message);
  return new Response(JSON.stringify({
    message: e.message,
    stack: e.stack
  }), { status: 500 });
}
function renderHTML(body) {
  return `
<html lang="en">  
  <head>
    <title>ChatGPT-Telegram-Workers</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="ChatGPT-Telegram-Workers">
    <meta name="author" content="TBXark">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }
      p {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
      }
      a:hover {
        color: #0056b3;
        text-decoration: underline;
      }
      strong {
        font-weight: bolder;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
  `;
}
function errorToString(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack
  });
}
function makeResponse200(resp) {
  if (resp === null) {
    return new Response("NOT HANDLED", { status: 200 });
  }
  if (resp.status === 200) {
    return resp;
  } else {
    return new Response(resp.body, {
      status: 200,
      headers: {
        "Original-Status": `${resp.status}`,
        ...resp.headers
      }
    });
  }
}
class Router {
  routes;
  base;
  errorHandler = async (req, error) => new Response(errorToString(error), { status: 500 });
  constructor({ base = "", routes = [], ...other } = {}) {
    this.routes = routes;
    this.base = base;
    Object.assign(this, other);
    this.fetch = this.fetch.bind(this);
    this.route = this.route.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.patch = this.patch.bind(this);
    this.head = this.head.bind(this);
    this.options = this.options.bind(this);
    this.all = this.all.bind(this);
  }
  parseQueryParams(searchParams) {
    const query = {};
    searchParams.forEach((v, k) => {
      query[k] = k in query ? [...Array.isArray(query[k]) ? query[k] : [query[k]], v] : v;
    });
    return query;
  }
  normalizePath(path) {
    return path.replace(/\/+(\/|$)/g, "$1");
  }
  createRouteRegex(path) {
    return new RegExp(`^${path.replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`);
  }
  async fetch(request, ...args) {
    try {
      const url = new URL(request.url);
      const reqMethod = request.method.toUpperCase();
      request.query = this.parseQueryParams(url.searchParams);
      for (const [method, regex, handlers, path] of this.routes) {
        let match = null;
        if ((method === reqMethod || method === "ALL") && (match = url.pathname.match(regex))) {
          request.params = match?.groups || {};
          request.route = path;
          for (const handler2 of handlers) {
            const response = await handler2(request, ...args);
            if (response != null) {
              return response;
            }
          }
        }
      }
      return new Response("Not Found", { status: 404 });
    } catch (e) {
      return this.errorHandler(request, e);
    }
  }
  route(method, path, ...handlers) {
    const route = this.normalizePath(this.base + path);
    const regex = this.createRouteRegex(route);
    this.routes.push([method.toUpperCase(), regex, handlers, route]);
    return this;
  }
  get(path, ...handlers) {
    return this.route("GET", path, ...handlers);
  }
  post(path, ...handlers) {
    return this.route("POST", path, ...handlers);
  }
  put(path, ...handlers) {
    return this.route("PUT", path, ...handlers);
  }
  delete(path, ...handlers) {
    return this.route("DELETE", path, ...handlers);
  }
  patch(path, ...handlers) {
    return this.route("PATCH", path, ...handlers);
  }
  head(path, ...handlers) {
    return this.route("HEAD", path, ...handlers);
  }
  options(path, ...handlers) {
    return this.route("OPTIONS", path, ...handlers);
  }
  all(path, ...handlers) {
    return this.route("ALL", path, ...handlers);
  }
}
const helpLink = "https://github.com/TBXark/ChatGPT-Telegram-Workers/blob/master/doc/en/DEPLOY.md";
const issueLink = "https://github.com/TBXark/ChatGPT-Telegram-Workers/issues";
const initLink = "./init";
const footer = `
<br/>
<p>For more information, please visit <a href="${helpLink}">${helpLink}</a></p>
<p>If you have any questions, please visit <a href="${issueLink}">${issueLink}</a></p>
`;
async function bindWebHookAction(request) {
  const result = {};
  const domain = new URL(request.url).host;
  const hookMode = ENV.API_GUARD ? "safehook" : "webhook";
  const scope = commandsBindScope();
  for (const token of ENV.TELEGRAM_AVAILABLE_TOKENS) {
    const api = createTelegramBotAPI(token);
    const url = `https://${domain}/telegram/${token.trim()}/${hookMode}`;
    console.log("webhook url: ", url);
    const id = token.split(":")[0];
    result[id] = {};
    result[id].webhook = await api.setWebhook({ url }).then((res) => res.json()).catch((e) => errorToString(e));
    for (const [s, data] of Object.entries(scope)) {
      result[id][s] = await api.setMyCommands(data).then((res) => res.json()).catch((e) => errorToString(e));
    }
  }
  let html = `<h1>ChatGPT-Telegram-Workers</h1>`;
  html += `<h2>${domain}</h2>`;
  if (ENV.TELEGRAM_AVAILABLE_TOKENS.length === 0) {
    html += `<p style="color: red">Please set the <strong> TELEGRAM_AVAILABLE_TOKENS </strong> environment variable in Cloudflare Workers.</p> `;
  } else {
    for (const [key, res] of Object.entries(result)) {
      html += `<h3>Bot: ${`${key.slice(0, 2)}***${key.slice(-2)}`}</h3>`;
      for (const [s, data] of Object.entries(res)) {
        html += `<p style="color: ${data.ok ? "green" : "red"}">${s}: ${JSON.stringify(data)}</p>`;
      }
    }
  }
  html += footer;
  const HTML = renderHTML(html);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function telegramWebhook(request) {
  try {
    const { token } = request.params;
    const body = await request.json();
    const headers = request.headers;
    return makeResponse200(await handleUpdate(token, body, headers));
  } catch (e) {
    console.error(e);
    return new Response(errorToString(e), { status: 200 });
  }
}
async function telegramSafeHook(request) {
  try {
    if (ENV.API_GUARD === void 0 || ENV.API_GUARD === null) {
      return telegramWebhook(request);
    }
    console.log("API_GUARD is enabled");
    const url = new URL(request.url);
    url.pathname = url.pathname.replace("/safehook", "/webhook");
    const newRequest = new Request(url, request);
    return makeResponse200(await ENV.API_GUARD.fetch(newRequest));
  } catch (e) {
    console.error(e);
    return new Response(errorToString(e), { status: 200 });
  }
}
async function defaultIndexAction() {
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Deployed Successfully!</p>
    <p> Version (ts:${ENV.BUILD_TIMESTAMP},sha:${ENV.BUILD_VERSION})</p>
    <br/>
    <p>You must <strong><a href="${initLink}"> >>>>> click here <<<<< </a></strong> to bind the webhook.</p>
    <br/>
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${commandsDocument().map((item) => `<p><strong>${item.command}</strong> - ${item.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${footer}
  `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
function createRouter() {
  const router = new Router();
  router.get("/", defaultIndexAction);
  router.get("/init", bindWebHookAction);
  router.post("/telegram/:token/webhook", telegramWebhook);
  router.post("/telegram/:token/safehook", telegramSafeHook);
  router.all("*", () => new Response("Not Found", { status: 404 }));
  return router;
}
class UpstashRedis {
  baseUrl;
  token;
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  async fetchFromRedis(method = "GET", body = null) {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.token}`
    };
    const options = {
      method,
      headers,
      ...body ? { body: JSON.stringify(body) } : {}
    };
    const response = await fetch(this.baseUrl, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Redis: ${response.statusText}`);
    }
    return response.json();
  }
  async get(key, info) {
    try {
      const data = ["get", key];
      const raw = await this.fetchFromRedis("POST", data);
      if (!raw) {
        return null;
      }
      switch (info?.type || "string") {
        case "string":
          return raw.result;
        case "json":
          return JSON.parse(raw.result);
        case "arrayBuffer":
          return new Uint8Array(raw).buffer;
        default:
          return raw.result;
      }
    } catch (error) {
      console.error(`Error getting key ${key}:`, error);
      return null;
    }
  }
  async mget(keys, info) {
    try {
      const data = ["mget"];
      data.push(...keys);
      const raw = await this.fetchFromRedis("POST", data);
      if (!raw) {
        return null;
      }
      switch (info?.type || "string") {
        case "string":
          return raw.result;
        case "json":
          return raw.result.map((i) => JSON.parse(i));
        case "arrayBuffer":
          return raw.result.map((i) => new Uint8Array(Buffer.from(i)));
        default:
          return raw.result;
      }
    } catch (error) {
      console.error(`Error getting keys ${keys}:`, error);
      return null;
    }
  }
  async put(key, value, info) {
    const data = ["set", key, value];
    if (info?.expiration) {
      data.push(...["exat", info.expiration]);
    } else if (info?.expirationTtl) {
      data.push(...["ex", info.expirationTtl]);
    }
    if (info?.condition === "NX") {
      data.push(...["nx"]);
    } else if (info?.condition === "XX") {
      data.push(...["xx"]);
    }
    return this.fetchFromRedis("POST", data).then((res) => info?.condition && ["NX", "XX"].includes(info.condition) ? res.result === "OK" : void 0);
  }
  async delete(key) {
    const data = ["del"];
    Array.isArray(key) ? data.push(...key) : data.push(key);
    return this.fetchFromRedis("POST", data);
  }
}
const index = {
  async fetch(request, env) {
    try {
      if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
        env.DATABASE = new UpstashRedis(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
      }
      ENV.merge(env);
      return createRouter().fetch(request);
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({
        message: e.message,
        stack: e.stack
      }), { status: 500 });
    }
  },
  async scheduled(event, env, ctx) {
    try {
      if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
        env.DATABASE = new UpstashRedis(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
      }
      const promises = [];
      for (const task of Object.values(tasks)) {
        promises.push(task(env));
      }
      await Promise.all(promises);
      console.log("All tasks done.");
    } catch (e) {
      console.error("Error in scheduled tasks:", e);
    }
  }
};
export {
  index as default
};
