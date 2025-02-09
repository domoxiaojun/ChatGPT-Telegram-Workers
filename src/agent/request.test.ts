import type { TextStreamPart } from 'ai';
import type { MessageInfo } from './model_middleware';
import { simulateReadableStream, streamText } from 'ai';
import { MockLanguageModelV1 } from 'ai/test';
import { streamHandler } from './request';

const messageInfo: MessageInfo = {
    content: '',
};

const contentExtractor = (() => {
    let thinkingStart = false;
    let thinkingEnd = false;
    let thinkingStartTime: undefined | number;
    const thinkingTag = '>`Thinking`\n>';
    return (data: TextStreamPart<any>) => {
        if (data.type === 'reasoning') {
            if (!thinkingStart) {
                thinkingStart = true;
                thinkingStartTime = Date.now();
                // thinking转为引用
                return thinkingTag + data.textDelta.replace(/\n/g, '\n>');
            }
            return data.textDelta.replace(/\n/g, '\n>');
        } else if (data.type === 'text-delta') {
            if (thinkingStart && !thinkingEnd) {
                thinkingEnd = true;
                const thinkingTime = ((Date.now() - thinkingStartTime!) / 1e3).toFixed(1);
                messageInfo.content = messageInfo.content.replace(/^>`Thinking[^\n]+/, `>\`Thinking about ${thinkingTime}s\``);
                return `\n>**END**\n\n${data.textDelta}`;
            }
            return data.textDelta;
        }
        return '';
    };
})();

const result = streamText({
    model: new MockLanguageModelV1({
        doStream: async () => ({
            stream: simulateReadableStream({
                chunks: [
                    { type: 'reasoning', textDelta: 'User is ' },
                    { type: 'reasoning', textDelta: 'thinking ' },
                    { type: 'reasoning', textDelta: 'about ' },
                    { type: 'reasoning', textDelta: 'the weather.' },
                    { type: 'text-delta', textDelta: 'The weather is sunny today. ' },
                    { type: 'text-delta', textDelta: 'I wish you a good day.' },
                    {
                        type: 'finish',
                        finishReason: 'stop',
                        logprobs: undefined,
                        usage: { completionTokens: 10, promptTokens: 3 },
                    },
                ],
            }),
            rawCall: { rawPrompt: null, rawSettings: {} },
        }),
    }),
    prompt: 'Hello, test!',
});

async function main() {
    const result2 = await streamHandler(result.fullStream, contentExtractor, {
        send: (data) => {
            console.log(`::send::\n${data}`);
            return Promise.resolve();
        },
    }, messageInfo);
    console.log(`::final result::\n${result2}`);
}

main().catch(console.error);
