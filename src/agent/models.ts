import type { AgentUserConfig } from '../config/types';
import type { CallbackQueryContext } from '../telegram/query';
import { loadChatLLM } from '.';
import { ENV } from '../config/env';
import { selectKey } from './key-manager';

export async function getModels(context: AgentUserConfig, agent: string) {
    const configKey = `${agent}_MODELS_API`;
    let url = context[configKey];
    if (!url) {
        throw new Error(`${agent} models api not found`);
    }
    if (!url.startsWith('http')) {
        url = `${context[`${agent}_API_BASE`]}${url}`;
    }
    const headers = {} as Record<string, string>;
    if (agent === 'ANTHROPIC') {
        headers['x-api-key'] = selectKey('anthropic', context.ANTHROPIC_API_KEY) || '';
        headers['anthropic-version'] = '2023-06-01';
    } else if (agent === 'GOOGLE') {
        url += `?key=${selectKey('google', context.GOOGLE_API_KEY) || ''}`;
    } else {
        const keyName = `${agent.toUpperCase()}_API_KEY`;
        const keys = context[keyName];
        headers.Authorization = `Bearer ${selectKey(agent.toLowerCase(), keys) || ''}`;
    }

    const result = await fetch(url, { headers });
    if (!result.ok) {
        throw new Error(`${agent} models api error: ${result.status} ${result.statusText}`);
    }
    const modlesData = await result.json();
    const models = [] as string[];
    switch (agent) {
        case 'GOOGLE':
            models.push(...modlesData.models.map((model: any) => model.name.split('/').pop()));
            break;
        case 'VERTEX':
            models.push(...modlesData.models.map((model: any) => model.baseModelId));
            break;
        case 'OPENAI':
        case 'OAILIKE':
        case 'COHERE':
        case 'ANTHROPIC':
        case 'XAI':
        case 'MISTRAL':
        default:
            models.push(...modlesData.data.map((model: any) => model.id));
            break;
    }
    return models.filter(Boolean);
}

export async function updateModels(context: CallbackQueryContext, modelKey: string) {
    let agent;
    if (modelKey === 'TOOL_MODEL') {
        agent = loadChatLLM(context.USER_CONFIG).name.toUpperCase();
    } else {
        agent = modelKey.split('_')[0];
    }
    const models = await getModels(context.USER_CONFIG, agent);
    if (models.length > 0) {
        const modelKey = `${agent}_MODELS`;
        context.USER_CONFIG[modelKey] = models;
        if (!context.USER_CONFIG.DEFINE_KEYS.includes(modelKey)) {
            context.USER_CONFIG.DEFINE_KEYS.push(modelKey);
        }
        await ENV.DATABASE.put(context.SHARE_CONTEXT.configStoreKey, JSON.stringify(context.USER_CONFIG)).catch(console.error);
    } else {
        throw new Error('No models found');
    }
    return models;
}
