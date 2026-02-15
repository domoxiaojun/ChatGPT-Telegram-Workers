import type { AgentUserConfig } from '../../config/types';
import { selectKey } from '../../agent/key-manager';
import { createXai } from '@ai-sdk/xai';
import { experimental_generateVideo as generateVideo } from 'ai';

export default {
    schema: {
        name: 'xai_video',
        description: 'xAI Grok Imagine Video generation tool. Supports text-to-video, image-to-video, and video editing. Generates videos up to 5 seconds in 720p or 480p resolution.',
        parameters: {
            type: 'object',
            required: ['prompt'],
            properties: {
                prompt: {
                    type: 'string',
                    description: 'The text prompt to generate or edit a video. For video editing, describe the transformation you want.',
                },
                mode: {
                    type: 'string',
                    description: 'Video generation mode',
                    enum: ['text-to-video', 'image-to-video', 'video-edit'],
                    default: 'text-to-video',
                },
                imageUrl: {
                    type: 'string',
                    description: 'Image URL for image-to-video mode. The image will be animated based on the prompt.',
                },
                videoUrl: {
                    type: 'string',
                    description: 'Video URL for video editing mode. The video will be transformed based on the prompt.',
                },
                aspectRatio: {
                    type: 'string',
                    description: 'The aspect ratio of the video (not supported for video editing)',
                    enum: ['16:9', '9:16', '1:1'],
                    default: '16:9',
                },
                duration: {
                    type: 'number',
                    description: 'Video duration in seconds (not supported for video editing)',
                    enum: [5],
                    default: 5,
                },
                resolution: {
                    type: 'string',
                    description: 'Video resolution (not supported for video editing)',
                    enum: ['480p', '720p'],
                    default: '720p',
                },
            },
        },
    },
    func: generateXaiVideo,
    send_type: 'message',
};

async function generateXaiVideo({
    prompt,
    mode = 'text-to-video',
    imageUrl,
    videoUrl,
    aspectRatio = '16:9' as `${number}:${number}`,
    duration = 5,
    resolution = '720p',
}: {
    prompt: string;
    mode?: string;
    imageUrl?: string;
    videoUrl?: string;
    aspectRatio?: `${number}:${number}`;
    duration?: number;
    resolution?: string;
}, _env: Record<string, any>, config: AgentUserConfig) {
    const apiKey = selectKey('xai', config.XAI_API_KEY) || '';

    if (!apiKey) {
        return {
            content: [{
                type: 'text',
                text: 'Error: XAI_API_KEY is not configured'
            }],
        };
    }

    // Validate mode-specific requirements
    if (mode === 'image-to-video' && !imageUrl) {
        return {
            content: [{
                type: 'text',
                text: 'Error: imageUrl is required for image-to-video mode'
            }],
        };
    }

    if (mode === 'video-edit' && !videoUrl) {
        return {
            content: [{
                type: 'text',
                text: 'Error: videoUrl is required for video-edit mode'
            }],
        };
    }

    const xaiClient = createXai({
        apiKey,
        baseURL: config.XAI_API_BASE,
    });

    console.log('=== xAI Grok Imagine Video Request ===');
    console.log('Mode:', mode);
    console.log('Prompt:', prompt);
    console.log('======================================');

    try {
        let videoResult;

        if (mode === 'video-edit') {
            // Video editing mode
            videoResult = await generateVideo({
                model: xaiClient.video('grok-imagine-video'),
                prompt,
                providerOptions: {
                    xai: {
                        videoUrl,
                        pollTimeoutMs: 600000, // 10 minutes
                        pollIntervalMs: 5000,
                    },
                },
            });
        } else if (mode === 'image-to-video') {
            // Image-to-video mode
            videoResult = await generateVideo({
                model: xaiClient.video('grok-imagine-video'),
                prompt: {
                    image: imageUrl!,
                    text: prompt,
                },
                duration,
                aspectRatio,
                providerOptions: {
                    xai: {
                        resolution,
                        pollTimeoutMs: 600000,
                        pollIntervalMs: 5000,
                    },
                },
            });
        } else {
            // Text-to-video mode
            videoResult = await generateVideo({
                model: xaiClient.video('grok-imagine-video'),
                prompt,
                duration,
                aspectRatio,
                providerOptions: {
                    xai: {
                        resolution,
                        pollTimeoutMs: 600000,
                        pollIntervalMs: 5000,
                    },
                },
            });
        }

        const { videos } = videoResult;

        if (!videos || videos.length === 0) {
            throw new Error('No videos generated');
        }

        console.log(`xAI video generated successfully: ${videos.length} video(s)`);

        return {
            content: videos.map(video => ({
                type: 'video',
                data_type: 'base64',
                data: video.base64,
                mimeType: video.mediaType || 'video/mp4',
            })),
        };
    } catch (error: any) {
        console.error('xAI video generation failed:', error);
        return {
            content: [{
                type: 'text',
                text: `xAI video generation failed: ${error.message || error}`
            }],
        };
    }
}
