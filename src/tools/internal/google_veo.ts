import type { AgentUserConfig } from '../../config/types';

export default {
    schema: {
        name: 'google_veo',
        description: 'Google veo video generation tool, you can specify the aspect ratio and person generation.',
        parameters: {
            type: 'object',
            required: ['prompt', 'aspectRatio', 'personGeneration'],
            properties: {
                prompt: {
                    type: 'string',
                    description: 'The text prompt to generate a video from',
                },
                aspectRatio: {
                    type: 'string',
                    description: 'The aspect ratio of the video',
                    enum: ['16:9', '9:16'],
                    default: '16:9',
                },
                personGeneration: {
                    type: 'string',
                    description: 'The person generation of the video',
                    enum: ['allow_adult', 'dont_allow'],
                    default: 'dont_allow',
                },
            },
        },
    },
    func: generateVideo,
    send_type: 'message',
};

async function generateVideo({
    prompt,
    aspectRatio = '16:9',
    personGeneration = 'dont_allow',
}: { prompt: string; aspectRatio: string; personGeneration: string }, _env: Record<string, any>, config: AgentUserConfig) {
    const model = 'veo-2.0-generate-001';
    const url = `${config.GOOGLE_API_BASE}/models/${model}:predictLongRunning?key=${config.GOOGLE_API_KEY}`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instances: [{
                prompt,
            }],
            parameters: {
                aspectRatio,
                personGeneration,
            },
        }),
    });
    if (!resp.ok) {
        const detail = await resp.json();
        console.error(`Google veo operation failed: ${detail.error.message}`);
        return {
            content: [{ type: 'text', text: `Google veo operation failed: ${detail.error.message}` }],
        };
    }

    const { name: op_name } = await resp.json();
    console.log(`Google veo operation name: ${op_name}`);
    const operationUrl = `${config.GOOGLE_API_BASE}/${op_name}?key=${config.GOOGLE_API_KEY}`;
    // max wait time: 15 minutes
    const MAX_TIME = 15 * 60 * 1000;
    let duration = 0;
    const video_urls = [];
    while (true) {
        const resp = await fetch(operationUrl);
        if (resp.ok) {
            const { done, response } = await resp.json();
            if (done) {
                for (const { video } of response?.generateVideoResponse?.generatedSamples || []) {
                    video_urls.push(`${video.uri}&key=${config.GOOGLE_API_KEY}`);
                }
                break;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 10_000));
        duration += 10_000;
        if (duration > MAX_TIME) {
            throw new Error(`Failed to generate video: timeout, please see the operation in log`);
        }
    }

    console.log(`Google veo operation ${op_name} generated ${video_urls.length} videos: ${video_urls.join(', ')}`);
    return {
        content: video_urls.map(url => ({
            type: 'video',
            data_type: 'url',
            data: url,
            mimeType: 'video/mp4',
        })),
    };
}
