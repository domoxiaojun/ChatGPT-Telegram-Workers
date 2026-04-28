import { describe, expect, it } from 'vitest';
import { sanitizeOpenAIResponsePrompt, shouldEnableOpenAIWebSearch } from './model_middleware';

function webSearchConfig(overrides: Record<string, unknown> = {}) {
    return {
        OPENAI_ENABLE_WEB_SEARCH: true,
        OPENAI_WEB_SEARCH_TRIGGER_MODE: 'intent',
        OPENAI_WEB_SEARCH_TRIGGER_PREFIXES: ['搜:', '搜索:', '查:', 'x搜', 'X搜'],
        OPENAI_WEB_SEARCH_TRIGGER_KEYWORDS: ['搜', '搜索', '最新', '新闻'],
        ...overrides,
    } as any;
}

describe('sanitizeOpenAIResponsePrompt', () => {
    it('removes server-side OpenAI response item references while keeping local tool linkage', () => {
        const prompt = [
            {
                role: 'assistant',
                id: 'msg_06d1724f1583f7ea0169ec4933a9048191a23bea80b2d791b1',
                content: [
                    {
                        type: 'text',
                        text: 'done',
                        providerOptions: {
                            openai: {
                                itemId: 'msg_06d1724f1583f7ea0169ec4933a9048191a23bea80b2d791b1',
                            },
                        },
                    },
                    {
                        type: 'reasoning',
                        text: 'hidden',
                        providerOptions: {
                            openai: {
                                itemId: 'rs_123',
                            },
                        },
                    },
                    {
                        type: 'tool-call',
                        toolCallId: 'call_local_1',
                        toolName: 'weather',
                        input: { city: 'Shanghai' },
                    },
                    {
                        type: 'item_reference',
                        id: 'msg_deadbeef',
                    },
                ],
            },
        ] as any;

        const sanitized = sanitizeOpenAIResponsePrompt(prompt) as any;
        const serialized = JSON.stringify(sanitized);

        expect(serialized).not.toContain('msg_06d1724f1583f7ea0169ec4933a9048191a23bea80b2d791b1');
        expect(serialized).not.toContain('rs_123');
        expect(serialized).not.toContain('msg_deadbeef');
        expect(serialized).toContain('call_local_1');
    });
});

describe('shouldEnableOpenAIWebSearch', () => {
    it('does not enable web search when the feature is disabled', () => {
        expect(shouldEnableOpenAIWebSearch(webSearchConfig({ OPENAI_ENABLE_WEB_SEARCH: false }), '搜一下新闻')).toBe(false);
    });

    it('enables web search for explicit current-message search intent', () => {
        expect(shouldEnableOpenAIWebSearch(webSearchConfig(), '帮我查一下最新新闻')).toBe(true);
    });

    it('enables web search for a URL in the current message', () => {
        expect(shouldEnableOpenAIWebSearch(
            webSearchConfig(),
            '总结 https://www.cnbeta.com.tw/articles/tech/123.htm',
        )).toBe(true);
    });

    it('enables web search for a replied URL when the current message asks to summarize it', () => {
        expect(shouldEnableOpenAIWebSearch(
            webSearchConfig(),
            '这个网页总结下\n> https://www.cnbeta.com.tw/articles/tech/123.htm - @someone (ID:1)',
        )).toBe(true);
    });

    it('does not treat local summary requests as web search intent', () => {
        expect(shouldEnableOpenAIWebSearch(
            webSearchConfig(),
            '总结这段代码',
        )).toBe(false);
    });

    it('enables web search for weather intent', () => {
        expect(shouldEnableOpenAIWebSearch(
            webSearchConfig({ OPENAI_WEB_SEARCH_TRIGGER_KEYWORDS: ['天气'] }),
            '上海天气怎么样',
        )).toBe(true);
    });

    it('keeps prefix mode restricted to configured prefixes', () => {
        expect(shouldEnableOpenAIWebSearch(
            webSearchConfig({ OPENAI_WEB_SEARCH_TRIGGER_MODE: 'prefix' }),
            '总结 https://www.cnbeta.com.tw/articles/tech/123.htm',
        )).toBe(false);
    });

    it('exposes web search in model trigger mode', () => {
        expect(shouldEnableOpenAIWebSearch(
            webSearchConfig({ OPENAI_WEB_SEARCH_TRIGGER_MODE: 'model' }),
            '普通聊天，不带搜索关键词',
        )).toBe(true);
    });

    it('defaults to model trigger mode when no trigger mode is configured', () => {
        expect(shouldEnableOpenAIWebSearch(
            webSearchConfig({ OPENAI_WEB_SEARCH_TRIGGER_MODE: '' }),
            '普通聊天，不带搜索关键词',
        )).toBe(true);
    });

    it('respects negative current-message search instructions', () => {
        expect(shouldEnableOpenAIWebSearch(webSearchConfig(), '不用搜索，直接猜一下 搜索新闻')).toBe(false);
    });
});
