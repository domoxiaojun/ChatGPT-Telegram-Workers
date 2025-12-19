import type { ImageResult } from '../../agent/types';
import type { AgentUserConfig } from '../../config/types';

import type { MediaToolResultContent, TextToolResultContent, ToolResult } from '../types';
import { IMAGE_AGENTS } from '../../agent';
import { log } from '../../log/logger';

export default {
    schema: {
        name: 'image_edit',
        description: `A specialized image editing tool that modifies existing images based on text instructions.

IMPORTANT: When the user message contains images (e.g., user replied to an image), you MUST extract the image URLs from the message content and pass them to the 'referenceImages' parameter.

This tool is ideal for:
- Editing images the user sent or replied to in the conversation
- Editing specific parts of an image (using mask for inpainting)
- Changing image style while preserving structure
- Making targeted modifications to images
- Creating variations based on reference images

How to use:
1. Extract image URLs from the user's message content
2. Pass them to 'referenceImages' parameter (required)
3. Use the user's text description as the 'prompt' parameter
4. Optionally provide a mask for targeted editing`,
        parameters: {
            type: 'object',
            properties: {
                agent: {
                    type: 'string',
                    description: 'The image agent to use. Supported: vertex, google. Default is "default".',
                    enum: ['default', 'vertex', 'google'],
                    default: 'default',
                },
                prompt: {
                    type: 'string',
                    description: 'Detailed instructions for how to edit the image. Be specific about what should change and what should stay the same.',
                },
                referenceImages: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The image(s) to edit. REQUIRED. Extract these from the user message content (look for image URLs in the message). Can be URLs or base64-encoded images. Google supports up to 14 images.',
                },
                mask: {
                    type: 'string',
                    description: 'Optional mask image for inpainting. Black areas will be preserved, white areas will be edited. Can be URL or base64-encoded image. Only supported by vertex agent.',
                },
                quantity: {
                    type: 'integer',
                    description: 'The number of variations to generate. Maximum is 4. Default is 1.',
                    default: 1,
                },
                radio: {
                    type: 'string',
                    description: 'The aspect ratio of the edited images. Default is "16:9".',
                    enum: ['1:1', '16:9', '9:16'],
                    default: '16:9',
                },
            },
            required: ['prompt', 'referenceImages'],
        },
    },

    func: async ({
        agent: agent_name = 'default',
        prompt,
        referenceImages,
        mask,
        quantity = 1,
        radio = '16:9',
    }: { agent: string; prompt: string; referenceImages: string[]; mask?: string; quantity: number; radio: string }, _env: Record<string, any>, config: AgentUserConfig): Promise<ToolResult> => {
        if (!config) {
            return { content: [{ type: 'text', text: 'Missing config' }] };
        }

        // Validate reference images
        if (!referenceImages || referenceImages.length === 0) {
            return { content: [{ type: 'text', text: 'Reference images are required for image editing', is_error: true }] };
        }

        // Determine agent
        if (agent_name === 'default') {
            agent_name = config.AI_IMAGE_PROVIDER;
        }

        log.info(`tool image_edit request start: agent: ${agent_name}`);
        log.info(`params: ${JSON.stringify({ agent: agent_name, prompt, referenceImages: referenceImages.length, mask: !!mask, quantity, radio })}`);

        const agent = IMAGE_AGENTS.find(a => a.name === agent_name);
        if (!agent?.enable(config)) {
            return { content: [{ type: 'text', text: `Image agent ${agent_name} is not available`, is_error: true }] };
        }

        // Check if agent supports image editing
        const supportedAgents = ['vertex', 'google'];
        if (!supportedAgents.includes(agent_name)) {
            return {
                content: [{
                    type: 'text',
                    text: `Agent ${agent_name} does not support image editing. Please use one of: ${supportedAgents.join(', ')}`,
                    is_error: true,
                }],
            };
        }

        try {
            const result: ImageResult = await agent.request(prompt, config, {
                n: quantity,
                radio,
                referenceImages,
                mask,
            });

            log.info(`${agent_name} image_edit result: success`);

            const type = result.url ? 'url' : 'blob';
            const messages: TextToolResultContent[] = result.message
                ? [{ type: 'text', text: result.message }]
                : [];
            const images = (result.url || result.raw || []).map(data => ({
                type: 'image',
                data_type: type,
                data,
                mimeType: 'image/png',
                text: result.text ?? '',
            })) as MediaToolResultContent[];

            return {
                content: [...messages, ...images],
            };
        } catch (e) {
            log.error(`image_edit error: ${(e as Error).message}`);
            return {
                content: [{
                    type: 'text',
                    text: `Failed to edit image: ${(e as Error).message}`,
                    is_error: true,
                }],
            };
        }
    },

    extra_params: { temperature: 1.2 },
    type: 'image2image',
    send_type: 'message',
};
