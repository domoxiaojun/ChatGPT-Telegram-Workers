import type { GeneratedImage, ImageResult } from './types';
import { log } from '../log';

export async function requestText2Image(url: string, headers: Record<string, any>, body: any, render: (arg: Response | GeneratedImage[] | string[], prompt: string) => Promise<ImageResult>) {
    const endpoint = formatImageEndpoint(url);
    const model = body?.model || 'unknown';
    log.info(`[image] start generate image: ${endpoint}, model: ${model}`);
    const startTime = Date.now();
    let resp: Response;

    try {
        resp = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
    } catch (error: any) {
        const message = error?.message || String(error);
        log.error(`[image] request failed: ${endpoint}, model: ${model}, error: ${message}`);
        throw new Error(`Image API request failed (${endpoint}, model: ${model}): ${message}`);
    }

    log.info(`[image] response: ${resp.status} ${resp.statusText}, ${Date.now() - startTime}ms, ${endpoint}, model: ${model}`);

    return render(resp, body.prompt);
}

function formatImageEndpoint(url: string): string {
    try {
        const parsed = new URL(url);
        return `${parsed.origin}${parsed.pathname}`;
    } catch {
        return url.split('?')[0] || url;
    }
}
