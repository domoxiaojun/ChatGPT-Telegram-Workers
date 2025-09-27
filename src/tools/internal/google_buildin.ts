import type { AgentUserConfig } from '../../config/types';

export default {
    schema: {
        name: 'google_buildin',
        description: `Turn on the google gemini built-in tool.
        Available tools: googleSearch, codeExecution, urlContext.
        googleSearch: search the web for information.
        codeExecution: execute code.
        urlContext: search the web for information based on the url.
        `,
        parameters: {
            type: 'object',
            properties: {
                tool: {
                    type: 'array',
                    description: 'The google built-in tool to turn on, optional values: googleSearch, codeExecution, urlContext',
                    items: {
                        type: 'string',
                        enum: ['googleSearch', 'codeExecution', 'urlContext'],
                    },
                    default: [],
                },
            },
            required: ['tool'],
            additionalProperties: false,
        },
    },
    func: ({ tool }: { tool: string[] }, _env: Record<string, any>, config: AgentUserConfig) => {
        if (!tool.every(t => config.GOOGLE_BUILDIN.includes(t))) {
            return { content: [{ type: 'text', text: `Contain not support tool: ${tool.filter(t => !config.GOOGLE_BUILDIN.includes(t)).join(', ')}` }] };
        }

        const agentName = config.AI_CHAT_PROVIDER;

        if (agentName === 'oailike') {
            config.USE_OAILIKE_RELAY_TOOLS = tool;
        }

        if (agentName === 'google' || agentName === 'vertex' || agentName === 'gemini') {
            config.USE_GOOGLE_BUILDIN = tool;

            // Store the tool names for use in model middleware
            // Don't create the actual tools here - let the SDK handle it properly
            config.GOOGLE_BUILDIN_TOOLS = tool;

            console.log('Google built-in tools configured:', tool);

            // IMPORTANT: Remove google_buildin from USE_TOOLS to prevent future conflicts
            // This ensures google_buildin doesn't appear in subsequent requests
            if (config.USE_TOOLS.includes('google_buildin')) {
                config.USE_TOOLS = config.USE_TOOLS.filter(t => t !== 'google_buildin');
                console.log('Removed google_buildin from USE_TOOLS to prevent tool mixing');
            }
        }

        return {
            content: [{
                type: 'text',
                text: `Successfully enabled Google built-in tools: ${tool.join(', ')}. These tools are now available for use. The google_buildin setup tool has been automatically disabled to prevent conflicts.`
            }]
        };
    },
    prompt: 'When built-in tools are enabled, you can use them to search the web, execute code, or analyze URLs to provide better answers.',
};
