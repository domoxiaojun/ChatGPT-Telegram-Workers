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
    func: (params: { tool: string[] }, _env: Record<string, any>, config: AgentUserConfig) => {
        const { tool } = params;
        if (tool.length > 1) {
            return { content: [{ type: 'text', text: 'google_buildin: only support turn on one tool' }] };
        }
        const builtInTools = config.GOOGLE_BUILDIN;
        const toolName = tool[0];
        if (!builtInTools.includes(toolName)) {
            return { content: [{ type: 'text', text: `google_buildin: not support tool: ${toolName}` }] };
        }
        config.USE_GOOGLE_BUILDIN = [toolName];
        config.USE_OAILIKE_RELAY_TOOLS = [toolName];
        return { content: [{ type: 'text', text: `Has turned on the google gemini built-in tool: ${toolName}` }] };
    },
    prompt: 'Only one tool can be enabled at a time. When enabling a built-in tool, you should call this tool internally, then answer user questions.',
};
