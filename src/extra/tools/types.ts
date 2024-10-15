export interface SchemaData {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, any & {
            type: string;
            description: string;
        }>;
        required: string[];
        additionalProperties: boolean;
    };
}

type ToolType = 'search' | 'web_crawler' | 'command' | 'llm' | 'workflow';

export interface FuncTool {
    schema: SchemaData;
    func: (params: Record<string, any>, signal?: AbortSignal) => Promise<string>;
    type: ToolType;
    ENV_KEY?: string;
    prompt?: string;
    extra_params?: Record<string, any>;
}
