/* eslint-disable no-case-declarations */

import type { LanguageModelV1 } from '@ai-sdk/provider';

export function paramsModifier(model: string, options: Record<string, any>, modifier: string[], extraParams: Record<string, Record<string, any>>) {
    // 处理 extraParams
    for (const [models, params] of Object.entries(extraParams)) {
        if (models.includes(model) || models.includes('*')) {
            Object.entries(params).forEach(([key, value]) => {
                options[key] = value;
            });
            break;
        }
    }
    if (modifier.length === 0) {
        return options;
    }

    const valueParser = (text: string) => {
        const numericParser = (text: string) => {
            const num = Number(text);
            return !Number.isNaN(num) && Number.isFinite(num) && String(num) === text.trim() ? num : text;
        };
        switch (text) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                try {
                    return JSON.parse(text);
                } catch {
                    return numericParser(text);
                }
        }
    };
    // 处理 modifier
    for (const item of modifier) {
        const seperator = item.indexOf(':');
        if (seperator < 0) {
            continue;
        }
        const models = item.slice(0, seperator).split(',');
        const values = item.slice(seperator + 1).split('|');
        if (models.includes(model)) {
            values.forEach((text) => {
                switch (text[0]) {
                    case '+':
                        const [key, value] = text.slice(1).split('=');
                        options[key] = valueParser(value);
                        break;
                    case '-':
                        options[text.slice(1)] = undefined;
                        break;
                    default:
                        // options[text] = undefined;
                        break;
                }
            });
            break;
        }
    }

    return options;
}

export function providerOptionsGenerator(model: LanguageModelV1, PARAMS_MODIFIER: string[], EXTRA_PARAMS: Record<string, Record<string, any>>, relay?: { tools: { type: string; function: { name: string } }[]; params: Record<string, any> }) {
    const options: Record<string, any> = {};
    if (relay && relay.tools.length > 0) {
        options.tools = relay.tools;
    }
    if (relay && Object.keys(relay.params).length > 0) {
        Object.assign(options, relay.params);
    }
    paramsModifier(model.modelId, options, PARAMS_MODIFIER, EXTRA_PARAMS);
    return { [model.provider.split('.')[0]]: options };
}
