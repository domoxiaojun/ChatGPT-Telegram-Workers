import type { MCPTransport } from '../config/types';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport as MCPStdioTransport } from 'ai/mcp-stdio';
import { ENV } from '../config/env';

// const mcpTools: Record<string, Record<string, any>> = {};
// let mcpInitialized = false;
// let mcpPromise: Promise<void> | null = null;
// const mcpClients: any[] = [];

async function initializeMcp(activeMcp: string[] = []): Promise<{
    mcpTools: Record<string, Record<string, any>>;
    mcpClients: any[];
}> {
    // if (mcpPromise) {
    //     return mcpPromise;
    // }

    const mcpTools: Record<string, Record<string, any>> = {};
    const mcpClients: any[] = [];

    await (async () => {
        let mcpConfig = Object.entries(ENV.MCP_CONFIG);
        if (activeMcp.length > 0 && activeMcp.length < Object.keys(ENV.MCP_CONFIG).length) {
            mcpConfig = mcpConfig.filter(([name]) => activeMcp.includes(name));
        }
        const toolPromises = mcpConfig.map(async ([name, transport]: [string, MCPTransport]) => {
            let mcpTransport: MCPTransport | MCPStdioTransport | StreamableHTTPClientTransport;
            switch (transport.type) {
                case 'stdio':
                    mcpTransport = new MCPStdioTransport({
                        command: transport.command,
                        args: transport.args,
                        env: transport.env,
                        cwd: transport.cwd,
                    });
                    break;
                case 'http':
                    mcpTransport = new StreamableHTTPClientTransport(new URL(transport.url));
                    break;
                default:
                    mcpTransport = transport;
            }

            const mcpClient = await createMCPClient({
                name,
                transport: mcpTransport as any,
            });
            mcpClients.push(mcpClient);
            const tools = await mcpClient.tools();
            Object.assign(mcpTools, {
                [name]: tools,
            });
        });

        await Promise.all(toolPromises);
        // mcpInitialized = true;
        console.log('MCP:', JSON.stringify(Object.entries(mcpTools).map(([name, tools]) => ({ [name]: Object.entries(tools).map(([tname, t]) => ({ name: tname, description: t.description })) })), null, 1));
    })();

    console.log('initialize mcp done');

    return {
        mcpTools,
        mcpClients,
    };
}

export async function getMcp() {
    // if (!mcpInitialized) {
    //     await initializeMcp();
    // }
    console.log('initializing mcp...');
    return initializeMcp();
}

// export async function updateMcpTool(activeMcp: string[] = []) {
//     await Promise.all(mcpClients.map(async (mcpClient) => {
//         await mcpClient.close();
//     }));
//     mcpClients.length = 0;
//     mcpPromise = null;
//     await initializeMcp(activeMcp);
// }

// initializeMcp().catch(console.error);
