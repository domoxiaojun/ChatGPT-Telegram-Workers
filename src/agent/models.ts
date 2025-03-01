import type { AgentUserConfig } from '../config/types';
import { loadChatLLM } from '.';

export async function getModels(context: AgentUserConfig) {
    const agent = loadChatLLM(context);
    const configKey = `${agent.name.toUpperCase()}_MODELS_API`;
    let url = context[configKey];
    if (!url) {
        throw new Error(`${agent.name} models api not found`);
    }
    if (!url.startsWith('http')) {
        url = `${context[`${agent.name.toUpperCase()}_API_BASE`]}${url}`;
    }
    const headers = {} as Record<string, string>;
    if (agent.name === 'anthropic') {
        headers['x-api-key'] = context.ANTHROPIC_API_KEY ?? '';
        headers['anthropic-version'] = '2023-06-01';
    } else if (agent.name === 'google') {
        url += `?key=${context.GOOGLE_API_KEY}`;
    } else {
        headers.Authorization = `Bearer ${context[`${agent.name.toUpperCase()}_API_KEY`]}`;
    }

    const result = await fetch(url, { headers });
    if (!result.ok) {
        throw new Error(`${agent.name} models api error: ${result.status} ${result.statusText}`);
    }
    const modlesData = await result.json();
    const models = [] as string[];
    switch (agent.name) {
        case 'google':
            models.push(...modlesData.models.map((model: any) => model.name.split('/').pop()));
            break;
        case 'vertex':
            models.push(...modlesData.models.map((model: any) => model.baseModelId));
            break;
        case 'openai':
        case 'oailike':
        case 'cohere':
        case 'anthropic':
        case 'xai':
        case 'mistral':
        default:
            models.push(...modlesData.data.map((model: any) => model.id));
            break;
    }
    return models.filter(Boolean);
}
