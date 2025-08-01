import type { AgentUserConfig } from '../../config/types';

export default {
    schema: {
        name: 'google_veo',
        description: 'Google veo video generation tool, you can specify the aspect ratio and person generation.',
        parameters: {
            type: 'object',
            required: ['prompt'],
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
                durationSeconds: {
                    type: 'number',
                    description: 'The duration of the video; minimum 5, maximum 8',
                    default: 5,
                },
                numberOfVideos: {
                    type: 'number',
                    description: 'The number of videos to generate; minimum 1, maximum 4',
                    default: 1,
                },
                includeAudio: {
                    type: 'boolean',
                    description: 'Whether to generate synchronized audio (dialogue, effects, and music) with the video',
                    default: true,
                },
                negativePrompt: {
                    type: 'string',
                    description: 'Negative prompt to exclude specific elements from the generated video',
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
    durationSeconds = 5,
    numberOfVideos = 1,
    includeAudio = true,
    negativePrompt,
}: {
    prompt: string;
    aspectRatio: string;
    personGeneration: string;
    durationSeconds: number;
    numberOfVideos: number;
    includeAudio?: boolean;
    negativePrompt?: string;
}, _env: Record<string, any>, config: AgentUserConfig) {
    const model = 'veo-3.0-fast-generate-preview';
    const url = `${config.GOOGLE_API_BASE}/models/${model}:predictLongRunning?key=${config.GOOGLE_API_KEY}`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instances: [{
                prompt,
                ...(negativePrompt && { negativePrompt }),
            }],
            parameters: {
                aspectRatio,
                personGeneration,
                durationSeconds,
                sampleCount: numberOfVideos,
                includeAudio,
                // enhancePrompt: gemini api not support
                // fps: gemini api not support
                // outputGcsUri: gemini api not support
                // seed: gemini api not support
                // resolution: gemini api not support
                // pubsubTopic: gemini api not support
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
    let elapsedTime = 0;
    const video_urls = [];
    const audio_urls = [];
    while (true) {
        const resp = await fetch(operationUrl);
        if (resp.ok) {
            const { done, response } = await resp.json();
            if (done) {
                for (const sample of response?.generateVideoResponse?.generatedSamples || []) {
                    if (sample.video) {
                        video_urls.push(`${sample.video.uri}&key=${config.GOOGLE_API_KEY}`);
                    }
                    if (sample.audio && includeAudio) {
                        audio_urls.push(`${sample.audio.uri}&key=${config.GOOGLE_API_KEY}`);
                    }
                }
                break;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 10_000));
        elapsedTime += 10_000;
        if (elapsedTime > MAX_TIME) {
            throw new Error(`Failed to generate video: timeout, please see the operation in log`);
        }
    }

    console.log(`Google veo operation ${op_name} generated ${video_urls.length} videos${audio_urls.length > 0 ? ` and ${audio_urls.length} audio files` : ''}: ${[...video_urls, ...audio_urls].join(', ')}`);
    
    const content = [];
    
    // Add video content
    content.push(...video_urls.map(url => ({
        type: 'video',
        data_type: 'url',
        data: url,
        mimeType: 'video/mp4',
    })));
    
    // Add audio content if available
    if (audio_urls.length > 0) {
        content.push(...audio_urls.map(url => ({
            type: 'audio',
            data_type: 'url',
            data: url,
            mimeType: 'audio/wav',
        })));
    }
    
    return { content };
}
