import { describe, expect, it, vi } from 'vitest';

vi.mock('../log', () => ({
    log: {
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
    },
    withLogger: (fn: any) => fn,
}));
vi.mock('./llm', () => ({ createLlmModel: vi.fn() }));
vi.mock('./model_middleware', () => ({ warpLLMParams: vi.fn() }));
vi.mock('./request', () => ({ requestChatCompletionsV2: vi.fn() }));

const { renderImage } = await import('./openai');

describe('renderImage', () => {
    it('formats Cloudflare gateway timeout errors without dumping raw HTML', async () => {
        const html = `<!DOCTYPE html>
<html><head><title>domob.org | 504: Gateway time-out</title></head>
<body>
<div id="cf-host-status">
  <span>cpa.domob.org</span>
  <h3>Host</h3>
  <span>Error</span>
</div>
<div>Cloudflare Ray ID: <strong>9f1d1d256d5f1e0f</strong></div>
</body></html>`;
        const response = new Response(html, {
            status: 504,
            statusText: 'Gateway time-out',
            headers: { 'content-type': 'text/html; charset=UTF-8' },
        });

        try {
            await renderImage(response, 'flying pig');
            throw new Error('renderImage should throw');
        } catch (error: any) {
            expect(error.message).toContain('Image API upstream timeout');
            expect(error.message).toContain('cpa.domob.org');
            expect(error.message).toContain('/images/generations');
            expect(error.message).not.toContain('<!DOCTYPE html>');
            expect(error.message.length).toBeLessThan(900);
        }
    });

    it('parses base64 image responses', async () => {
        const response = new Response(JSON.stringify({
            data: [{ b64_json: Buffer.from('image').toString('base64') }],
        }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });

        const result = await renderImage(response, 'prompt');

        expect(result.raw).toHaveLength(1);
        expect(result.text).toBe('prompt');
    });
});
