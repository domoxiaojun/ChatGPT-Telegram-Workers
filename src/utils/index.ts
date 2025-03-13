/* eslint-disable no-case-declarations */

export function paramsModifier(model: string, body: Record<string, any>, modifier: string[], extraParams: Record<string, Record<string, any>>) {
    // 处理 extraParams
    for (const [models, params] of Object.entries(extraParams)) {
        if (models.includes(model) || models.includes('*')) {
            Object.entries(params).forEach(([key, value]) => {
                body[key] = value;
            });
            break;
        }
    }
    if (modifier.length === 0) {
        return body;
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
        if (seperator === -1) {
            continue;
        }
        const models = item.slice(0, seperator).split(',');
        const values = item.slice(seperator + 1).split('|');
        if (models.includes(model)) {
            values.forEach((text) => {
                switch (text[0]) {
                    case '+':
                        const [key, value] = text.slice(1).split('=');
                        body[key] = valueParser(value);
                        break;
                    case '-':
                        delete body[text.slice(1)];
                        break;
                    default:
                        // delete body[text];
                        break;
                }
            });
            break;
        }
    }

    return body;
}

export function mockFetch(model: string, PARAMS_MODIFIER: string[], extraParams: Record<string, Record<string, any>> = {}, relay?: { tools: { type: string; function: { name: string } }[] }) {
    return (url: RequestInfo | URL, options?: RequestInit) => {
        const body = JSON.parse(options?.body as string);
        if (relay && relay.tools.length > 0) {
            body.tools = relay.tools;
        }
        paramsModifier(model, body, PARAMS_MODIFIER, extraParams);
        return fetch(url, {
            ...options,
            body: JSON.stringify(body),
        });
    };
}
