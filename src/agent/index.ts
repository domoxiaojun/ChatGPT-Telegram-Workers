import { type AgentUserConfig, ENV } from '../config/env';
import type { AudioAgent, ChatAgent, ImageAgent } from './types';
import { Anthropic } from './anthropic';
import { AzureChatAI, AzureImageAI } from './azure';
import { Cohere } from './cohere';
import { Gemini } from './gemini';
import { Mistral } from './mistralai';
import { Dalle, OpenAI, Transcription } from './openai';
import { WorkersChat, WorkersImage } from './workersai';
import { Silicon, SiliconImage } from './silicon';

const CHAT_AGENTS: ChatAgent[] = [
    new Anthropic(),
    new AzureChatAI(),
    new Cohere(),
    new Gemini(),
    new Mistral(),
    new OpenAI(),
    new WorkersChat(),
    new Silicon(),
];

// const agentsHandler: any[] = [OpenAI, Anthropic, AzureChatAI, Cohere, Gemini, Mistral, WorkersChat];

// function* CHAT_AGENTS_ITER() {
//     for (const Agent of agentsHandler) {
//         yield new Agent();
//     }
// }

export function loadChatLLM(context: AgentUserConfig): ChatAgent | null {
    // let CHAT_AGENTS = CHAT_AGENTS_ITER();
    for (const llm of CHAT_AGENTS) {
        if (llm.name === context.AI_PROVIDER) {
            return llm;
        }
    }
    // 找不到指定的AI，使用第一个可用的AI
    // CHAT_AGENTS = CHAT_AGENTS_ITER();
    for (const llm of CHAT_AGENTS) {
        if (llm.enable(context)) {
            return llm;
        }
    }
    return null;
}

const IMAGE_AGENTS: ImageAgent[] = [
    new AzureImageAI(),
    new Dalle(),
    new WorkersImage(),
    new SiliconImage(),
];

export function loadImageGen(context: AgentUserConfig): ImageAgent | null {
    for (const imgGen of IMAGE_AGENTS) {
        if (imgGen.name === context.AI_IMAGE_PROVIDER) {
            return imgGen;
        }
    }
    // 找不到指定的AI，使用第一个可用的AI
    for (const imgGen of IMAGE_AGENTS) {
        if (imgGen.enable(context)) {
            return imgGen;
        }
    }
    return null;
}

const AUDIO_AGENTS: AudioAgent[] = [
    // 当前仅实现OpenAI音频处理
    new Transcription(),
];

export function loadAudioLLM(context: AgentUserConfig) {
    for (const llm of AUDIO_AGENTS) {
        if (llm.name === context.AI_PROVIDER) {
            return llm;
        }
    }
    // 找不到指定的AI，使用第一个可用的AI
    for (const llm of AUDIO_AGENTS) {
        if (llm.enable(context)) {
            return llm;
        }
    }
    return null;
}

/**
 * 提取模型等信息
 * @param {UserConfigType} config
 * @return {string} info
 */
export function customInfo(config: AgentUserConfig): string {
    const other_info = {
        mode: config.CURRENT_MODE,
        prompt: `${(config.SYSTEM_INIT_MESSAGE?.slice(0, 50))}...`,
        MAPPING_KEY: config.MAPPING_KEY,
        MAPPING_VALUE: config.MAPPING_VALUE,
        USE_TOOLS: config.USE_TOOLS,
        FUNCTION_CALL_MODEL: config.FUNCTION_CALL_MODEL,
        FUNCTION_REPLY_ASAP: config.FUNCTION_REPLY_ASAP,
        FUNC_LOOP_TIMES: ENV.FUNC_LOOP_TIMES,
        FUNC_CALL_TIMES: ENV.CON_EXEC_FUN_NUM,
        EXPIRED_TIME: ENV.EXPIRED_TIME,
        CRON_CHECK_TIME: ENV.CRON_CHECK_TIME,
    };
    return JSON.stringify(other_info, null, 2);
}
