import type { AgentUserConfig } from '../../config/types';
import { google } from '@ai-sdk/google';

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
}: {
    prompt: string;
    aspectRatio: string;
    personGeneration: string;
    durationSeconds: number;
    numberOfVideos: number;
}, _env: Record<string, any>, config: AgentUserConfig) {
    try {
        // 使用新版本 AI SDK 的方式初始化 Google provider
        const googleProvider = google({
            apiKey: config.GOOGLE_API_KEY,
            baseURL: config.GOOGLE_API_BASE,
        });

        // 使用新版本的 API 调用方式
        const model = 'veo-3.0-fast-generate-preview';
        const url = `${config.GOOGLE_API_BASE}/models/${model}:predictLongRunning?key=${config.GOOGLE_API_KEY}`;
        
        const requestBody = {
            instances: [{
                prompt,
            }],
            parameters: {
                aspectRatio,
                personGeneration,
                durationSeconds,
                sampleCount: numberOfVideos,
            },
        };
        
        console.log('=== DEBUG: Google Veo Request (New AI SDK) ===');
        console.log('URL:', url);
        console.log('Model:', model);
        console.log('Request Body:', JSON.stringify(requestBody, null, 2));
        console.log('================================');
        
        console.log('=== DEBUG: Environment Check ===');
        console.log('GOOGLE_API_BASE:', config.GOOGLE_API_BASE);
        console.log('GOOGLE_API_KEY:', config.GOOGLE_API_KEY ? 'Present' : 'Missing');
        console.log('Final URL:', url);
        console.log('================================');

        // 先不用新 SDK，回到最原始的方式
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
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
            elapsedTime += 10_000;
            if (elapsedTime > MAX_TIME) {
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
    } catch (error) {
        console.error('Google Veo generation error:', error);
        return {
            content: [{ type: 'text', text: `Google veo operation failed: ${error.message}` }],
        };
    }
}
