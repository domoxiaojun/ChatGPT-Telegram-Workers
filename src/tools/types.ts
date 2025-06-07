import type { AgentUserConfig } from '../config/env';

export interface SchemaData<T extends Record<string, any>> {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, T>;
        $defs?: Record<string, T>;
        required: string[];
        additionalProperties?: boolean;
    };
}

export type ToolHandler
    = | {
        type: 'template';
        data: string;
        patterns?: PatternInfo[];
        dynamic_patterns?: PatternInfo[];

    }
    | {
        type: 'webclean';
        patterns?: PatternInfo[];
        dynamic_patterns?: PatternInfo[];

    };

/**
 * Function ToolType
 * @schema tool json schema
 * @func tool function, only supported in internal function
 * @prompt tool prompt
 * @extra_params tool extra params
 * @type options: search, web_crawler, command, llm, workflow
 * @required tool required env variables, array of env variables
 * @send_type tool send type, options: `tool-result` means send as tool-result to ai,
 * WIP: `assistant` means send tool-result as assistant message,
 * `message` means will send the result to user directly, and return tip as tool-result to ai;
 * default: tool-result
 * - @scope tool scope, options: private, supergroup, group
 * @payload tool payload
 * @handler type options: HandlerType
 * @webcrawler support input template(same as plugin input template but only support variable interpolation not support loop and condition) and patterns
 */
export interface FuncTool {
    schema: SchemaData<Record<string, any>>;
    func?: (params: Record<string, any>, options?: { signal?: AbortSignal; [key: string]: any }, config?: AgentUserConfig) => Promise<ToolResult>;
    prompt?: string;
    extra_params?: Record<string, any>;
    type?: 'search' | 'web_crawler' | 'command' | 'text2image';
    required?: string[];
    payload?: Record<string, any>;
    send_type?: 'tool-result' | 'assistant' | 'message';
    handler?: ToolHandler;
    webcrawler?: {
        url: string;
        patterns?: PatternInfo[];
    };
    copyright?: string;
}

export interface PatternInfo {
    pattern?: string;
    group?: number;
    clean?: Array<string | string[]>;
}

export type ToolResultType = 'text' | 'image' | 'audio' | 'video' | 'file' | 'resource';

export interface TextToolResultContent {
    type: 'text';
    text: string;
    is_error?: boolean;
}

export interface ResourceToolResultContent {
    type: 'resource';
    resource: {
        uri: string;
        mimeType: string;
        text: string;
    };
}

export interface MediaToolResultContent {
    text: string;
    type: Exclude<ToolResultType, 'text' | 'resource'>;
    data_type: 'base64' | 'url' | 'blob';
    data: string | Blob;
    mimeType: string;
}

type ContentItem = TextToolResultContent | ResourceToolResultContent | MediaToolResultContent;

export interface ToolResult {
    content: Array<Extract<ContentItem, { type: ToolResultType }>>;
}

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
