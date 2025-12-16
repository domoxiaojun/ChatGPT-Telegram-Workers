import type { AgentUserConfig } from '../../config/types';

export default {
    schema: {
        name: 'google_buildin',
        description: `Turn on the google gemini built-in tool.
        Available tools: googleSearch, codeExecution, urlContext, googleMaps.
        googleSearch: search the web for information.
        codeExecution: execute code.
        urlContext: search the web for information based on the url.
        googleMaps: search for location-based information and places using Google Maps.
        `,
        parameters: {
            type: 'object',
            properties: {
                tool: {
                    type: 'array',
                    description: 'The google built-in tool to turn on, optional values: googleSearch, codeExecution, urlContext, googleMaps',
                    items: {
                        type: 'string',
                        enum: ['googleSearch', 'codeExecution', 'urlContext', 'googleMaps'],
                    },
                    default: [],
                },
            },
            required: ['tool'],
            additionalProperties: false,
        },
    },
    func: ({ tool }: { tool: string[] }, _env: Record<string, any>, config: AgentUserConfig) => {
        // if (tool.length > 1) {
        //     return { content: [{ type: 'text', text: 'google_buildin: only support turn on one tool' }] };
        // }
        if (!tool.every(t => config.GOOGLE_BUILDIN.includes(t))) {
            return { content: [{ type: 'text', text: `Contain not support tool: ${tool.filter(t => !config.GOOGLE_BUILDIN.includes(t)).join(', ')}` }] };
        }
        const agentName = config.AI_CHAT_PROVIDER;
        if (agentName === 'oailike') {
            config.USE_OAILIKE_RELAY_TOOLS = tool;
        }
        if (agentName === 'google' || agentName === 'vertex' || agentName === 'gemini') {
            config.USE_GOOGLE_BUILDIN = tool;
        }
        return { content: [{ type: 'text', text: `Has turned on the google gemini built-in tool: ${tool.join(', ')}` }] };
    },
    prompt: 'When enabling built-in tool, you should use the tools internally and answer user questions.',
};
