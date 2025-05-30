import type { GeneratedImage, ImageResult } from './types';

export async function requestText2Image(url: string, headers: Record<string, any>, body: any, render: (arg: Response | GeneratedImage[] | string[], prompt: string) => Promise<ImageResult>) {
    console.log('start generate image.');
    const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    return render(resp, body.prompt);
}
