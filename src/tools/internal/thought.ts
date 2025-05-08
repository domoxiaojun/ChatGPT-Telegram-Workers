import type { AgentUserConfig } from '../../config/env';

import type { FuncTool, ToolResult } from '../types';
import { log } from '../../log/logger';

export const think: FuncTool = {
    schema: {
        name: 'think',
        description: 'Use the tool to think about something. It will not obtain new information or make any changes to the repository, but just log the thought. Use it when complex reasoning or brainstorming is needed. For example, if you explore the repo and discover the source of a bug, call this tool to brainstorm several unique ways of fixing the bug, and assess which change(s) are likely to be simplest and most effective. Alternatively, if you receive some test results, call this tool to brainstorm ways to fix the failing tests.',
        parameters: {
            type: 'object',
            properties: {
                thought: {
                    type: 'string',
                    description: 'Your thoughts.',
                },
            },
            required: ['thought'],
        },
    },

    func: async ({ thought }: any, _options?: { signal?: AbortSignal; [key: string]: any }, _config?: AgentUserConfig): Promise<ToolResult> => {
        log.info(`tool think request start: thought: ${thought}`);
        return { content: 'Thought has been logged', time: '0' };
    },

    buildin: true,
    result_type: 'text',
    prompt: '## Using the think tool\nBefore taking any action or responding to the user after receiving tool results, use the think tool as a scratchpad to:\n- List the specific rules that apply to the current request\n- Check if all required information is collected\n- Verify that the planned action complies with all policies\n- Iterate over tool results for correctness',
};
