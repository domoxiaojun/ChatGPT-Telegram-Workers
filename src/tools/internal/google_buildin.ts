import type { AgentUserConfig } from '../../config/types';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

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

            // Create Google provider instance for built-in tools
            try {
                const google = createGoogleGenerativeAI({
                    baseURL: config.GOOGLE_API_BASE,
                    apiKey: config.GOOGLE_API_KEY || undefined,
                });

                // Create actual Google tools using the proper SDK API
                const googleToolsMap: Record<string, any> = {};

                tool.forEach(toolName => {
                    switch (toolName) {
                        case 'googleSearch':
                            googleToolsMap.google_search = google.tools.googleSearch({});
                            break;
                        case 'codeExecution':
                            googleToolsMap.code_execution = google.tools.codeExecution({});
                            break;
                        case 'urlContext':
                            googleToolsMap.url_context = google.tools.urlContext({});
                            break;
                    }
                });

                // Store the actual tools for use in generateText/streamText
                config.GOOGLE_TOOLS_MAP = googleToolsMap;

                console.log('Google built-in tools created:', Object.keys(googleToolsMap));

            } catch (error) {
                console.error('Failed to create Google built-in tools:', error);
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to initialize Google built-in tools: ${error instanceof Error ? error.message : 'Unknown error'}`
                    }]
                };
            }
        }

        return {
            content: [{
                type: 'text',
                text: `Successfully enabled Google built-in tools: ${tool.join(', ')}. These tools are now available for use.`
            }]
        };
    },
    prompt: 'When built-in tools are enabled, you can use them to search the web, execute code, or analyze URLs to provide better answers.',
};
