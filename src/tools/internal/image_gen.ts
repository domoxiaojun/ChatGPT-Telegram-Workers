import type { ImageResult } from '../../agent/types';
import type { AgentUserConfig } from '../../config/env';

import type { ToolResult } from '../types';
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
                    description: 'The agent to use, You can only set values from the following options: \'openai\', \'workers\', \'azure\', \'vertex\', \'oailike\', \'kling\', \'google\', where openai is aliased as dalle, google is aliased as vertex, and if the information provided by the user is incorrect, please use the most similar option. if user dont specify, use openai. Default value is openai',
                    enum: ['openai', 'workers', 'azure', 'vertex', 'oailike', 'kling', 'google'],
                },
                prompts: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'If the description user given is not in English, translate it. Always mention the image type (photo, oil painting, watercolor, illustration, cartoon, painting, vector, rendering, etc.) at the beginning of the title.\nIn addition, focus on creating diverse, inclusive, and explorative scenes through the properties you choose in the rewriting process.\nSometimes make choices that may have insight or be unique.\nThe prompt must describe each part of the image in detail, specifically and objectively.\nConsider the final goal of the description and infer what will make the image satisfactory.\nAll descriptions sent to the tool should be a very detailed text. Including but not limited to: time, location, object, and art style to perfect the prompt. Each description should be more than 4 sentences.',
                },
                quantity: {
                    type: 'integer',
                    description: 'The number of images to generate, the maximum is 4. If the user does not specify a specific number of images, set it to 1. Default value is 1',
                },
                size: {
                    type: 'string',
                    // enum: ['1024x1024', '1792x1024', '1024x1792'],
                    description: 'The size of the images to generate, default is 1024x1024. Enum values: 1024x1024, 1792x1024, 1024x1792',
                },
                radio: {
                    type: 'string',
                    description: 'The raido of the images to generate, default is 1:1. Default value is 1:1. Enum values: 1:1, 16:9, 9:16',
                    // enum: ['1:1', '16:9', '9:16'],
                },
                style: {
                    type: 'string',
                    description: 'The style of the images to generate, default is vivid. Default value is vivid. Enum values: vivid, natural',
                    // enum: ['vivid', 'natural'],
                },
            },
            required: ['agent', 'prompts', 'quantity', 'size', 'radio', 'style'],
        },
    },

    func: async (args: Record<string, any>, { config }: { config: AgentUserConfig }): Promise<ToolResult> => {
        if (!config) {
            return { content: [{ type: 'text', text: 'Missing config' }] };
        }
        const { agent: agent_name, prompts, quantity, size, radio, style } = args;
        log.info(`tool image_gen request start: agent: ${agent_name}`);
        log.info(`params: ${JSON.stringify(args)}`);
        const agent = IMAGE_AGENTS.find(a => a.name === agent_name);
        if (!agent?.enable(config)) {
            return { content: [{ type: 'text', text: `Image agent ${agent_name} is not available` }] };
        }
        const result: ImageResult[] = [];
        for (const prompt of prompts) {
            const res = await agent.request(prompt, config, { quantity, size, radio, style });
            result.push(res);
        }
        log.info(`${agent_name} result: ${JSON.stringify(result)}`);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    },

    extra_params: { temperature: 1.2 },
    type: 'text2image',
    send_type: 'message',
};
