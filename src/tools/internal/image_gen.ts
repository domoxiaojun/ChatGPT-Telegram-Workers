import type { ImageResult } from '../../agent/types';
import type { AgentUserConfig } from '../../config/types';

import type { MediaToolResultContent, TextToolResultContent, ToolResult } from '../types';
import { IMAGE_AGENTS } from '../../agent';
import { log } from '../../log/logger';

export default {
    schema: {
        name: 'image_gen',
        description: `A drawing tool that supports different agents. Please comply with the following requirements when using:\nYour role is to:\n   1. Carefully analyze the user's image description.\n 2. Expand on the given details, adding relevant visual elements that enhance the scene.\n 3. Consider lighting, perspective, color palette, and composition to create a vivid mental image.\n 4. Incorporate specific artistic styles or techniques if mentioned or appropriate.\n 5. Ensure all added details are consistent with the user's original vision.\n 6. Translate the expanded description into clear, detailed instructions for image generation. Be creative yet faithful to the original concept.`,
        parameters: {
            type: 'object',
            properties: {
                agent: {
                    type: 'string',
                    description: 'The image agent to use. Default is "default".',
                    enum: ['default', 'dalle', 'openai', 'workers', 'azure', 'vertex', 'oailike', 'kling', 'google'],
                    default: 'default',
                },
                prompts: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'If the description user given is not in English, translate it. Always mention the image type (photo, oil painting, watercolor, illustration, cartoon, painting, vector, rendering, etc.) at the beginning of the title.\nIn addition, focus on creating diverse, inclusive, and explorative scenes through the properties you choose in the rewriting process.\nSometimes make choices that may have insight or be unique.\nThe prompt must describe each part of the image in detail, specifically and objectively.\nConsider the final goal of the description and infer what will make the image satisfactory.\nAll descriptions sent to the tool should be a very detailed text. Including but not limited to: time, location, object, and art style to perfect the prompt. Each description should be more than 4 sentences.',
                },
                quantity: {
                    type: 'integer',
                    description: 'The number of images to generate, the maximum is 4. Default is 1.',
                    default: 1,
                },
                size: {
                    type: 'string',
                    enum: ['1024x1024', '1792x1024', '1024x1792'],
                    description: 'The size of the images to generate. Default is "1024x1024".',
                    default: '1024x1024',
                },
                radio: {
                    type: 'string',
                    description: 'The raido of the images to generate. Default is "16:9".',
                    enum: ['1:1', '16:9', '9:16'],
                    default: '16:9',
                },
                style: {
                    type: 'string',
                    description: 'The style of the images to generate. Default is "vivid".',
                    enum: ['vivid', 'natural'],
                    default: 'vivid',
                },
            },
            required: ['prompts'],
        },
    },

    func: async ({
        agent: agent_name = 'default',
        prompts,
        quantity = 1,
        size = '1024x1024',
        radio = '16:9',
        style = 'vivid',
    }: { agent: string; prompts: string[]; quantity: number; size: string; radio: string; style: string }, _env: Record<string, any>, config: AgentUserConfig): Promise<ToolResult> => {
        if (!config) {
            return { content: [{ type: 'text', text: 'Missing config' }] };
        }
        if (agent_name === 'dalle') {
            agent_name = 'openai';
        }
        if (agent_name === 'default') {
            agent_name = config.AI_IMAGE_PROVIDER;
        }
        log.info(`tool image_gen request start: agent: ${agent_name}`);
        log.info(`params: ${JSON.stringify({ agent: agent_name, prompts, quantity, size, radio, style })}`);
        const agent = IMAGE_AGENTS.find(a => a.name === agent_name);
        if (!agent?.enable(config)) {
            return { content: [{ type: 'text', text: `Image agent ${agent_name} is not available`, is_error: true }] };
        }
        const result: ImageResult[] = await Promise.all(prompts.map(async (prompt) => {
            try {
                return await agent.request(prompt, config, { quantity, size, radio, style });
            } catch (e) {
                return { message: (e as Error).message };
            }
        }));
        log.info(`${agent_name} result: ${JSON.stringify(result)}`);
        const type = result[0].url ? 'url' : 'blob';
        const messages = result.filter(({ message }) => message).map(({ message }) => ({
            type: 'text',
            text: message,
        })) as TextToolResultContent[];
        const images = result.flatMap(r => (r.url || r.raw || []).map(data => ({
            type: 'image',
            data_type: type,
            data,
            mimeType: 'image/png',
            text: result[0].text ?? '',
        }))) as MediaToolResultContent[];
        return {
            content: [...messages, ...images],
        };
    },

    extra_params: { temperature: 1.2 },
    type: 'text2image',
    send_type: 'message',
};
