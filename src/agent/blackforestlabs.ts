import type { AgentUserConfig } from '../config/env';
import type { GeneratedImage, ImageAgent, ImageResult } from './types';
import { createBlackForestLabs } from '@ai-sdk/black-forest-labs';
import { generateImage } from 'ai';
import { Logger } from '../log';
import { selectKey } from './key-manager';

export class BlackForestLabsImage implements ImageAgent {
    readonly name = 'bfl';
    readonly modelKey = 'BFL_IMAGE_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return context.BFL_API_KEY.length > 0;
    };

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.BFL_IMAGE_MODEL || 'flux-kontext-pro';
    };

    @Logger
    request = async (prompt: string, context: AgentUserConfig, extraParams?: Record<string, any>): Promise<ImageResult> => {
        const {
            referenceImages,
            mask,
            aspectRatio,
            steps,
            guidance,
            safetyTolerance,
            outputFormat,
            imagePromptStrength,
        } = extraParams || {};

        const bflClient = createBlackForestLabs({
            apiKey: selectKey('bfl', context.BFL_API_KEY) || undefined,
            baseURL: context.BFL_API_BASE,
        });

        const providerOptions: Record<string, any> = {};
        if (steps !== undefined) {
            providerOptions.steps = steps;
        }
        if (guidance !== undefined) {
            providerOptions.guidance = guidance;
        }
        if (safetyTolerance !== undefined) {
            providerOptions.safetyTolerance = safetyTolerance;
        }
        if (outputFormat !== undefined) {
            providerOptions.outputFormat = outputFormat;
        }
        if (imagePromptStrength !== undefined) {
            providerOptions.imagePromptStrength = imagePromptStrength;
        }

        const providerOptionsParam = Object.keys(providerOptions).length > 0
            ? { blackForestLabs: providerOptions }
            : undefined;

        // 支持图片编辑（Image-to-Image，使用 flux-kontext-pro/max）
        if (referenceImages && referenceImages.length > 0) {
            const result = await generateImage({
                model: bflClient.image(this.model(context)),
                prompt: {
                    text: prompt,
                    images: referenceImages,
                    ...(mask && { mask }),
                },
                ...(aspectRatio && { aspectRatio }),
                ...(providerOptionsParam && { providerOptions: providerOptionsParam }),
            } as any);

            return this.render(result.images, prompt);
        }

        // 文本到图片生成（Text-to-Image）
        const result = await generateImage({
            model: bflClient.image(this.model(context)),
            prompt,
            ...(aspectRatio && { aspectRatio }),
            ...(providerOptionsParam && { providerOptions: providerOptionsParam }),
        } as any);

        return this.render(result.images, prompt);
    };

    readonly render = async (result: Response | GeneratedImage[] | string[], prompt: string): Promise<ImageResult> => {
        const images = result as GeneratedImage[];
        if (images.length === 0) {
            throw new Error('No images generated');
        }
        return {
            raw: images.map(({ uint8Array }) => new Blob([Buffer.from(uint8Array)], { type: 'image/png' })),
            text: prompt,
        };
    };
}
