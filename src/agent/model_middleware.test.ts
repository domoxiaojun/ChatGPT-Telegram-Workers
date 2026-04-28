import { describe, expect, it } from 'vitest';
import { sanitizeOpenAIResponsePrompt } from './model_middleware';

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
