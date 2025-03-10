import type { AgentUserConfig } from '../config/types';
import { loadChatLLM } from '.';

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
        headers['x-api-key'] = context.ANTHROPIC_API_KEY ?? '';
        headers['anthropic-version'] = '2023-06-01';
    } else if (agent === 'GOOGLE') {
        url += `?key=${context.GOOGLE_API_KEY}`;
    } else {
        headers.Authorization = `Bearer ${context[`${agent.toUpperCase()}_API_KEY`]}`;
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
        case 'OAI_LIKE':
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
