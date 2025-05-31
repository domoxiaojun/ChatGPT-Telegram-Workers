import type { MCPTransport } from '../config/types';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport as MCPStdioTransport } from 'ai/mcp-stdio';
import { ENV } from '../config/env';
import { log } from '../log';
import { isCfWorker } from '../telegram/utils/tg_utils';

const mcpTools: Record<string, Record<string, any>> = {};
let mcpInitialized = false;
let mcpPromise: Promise<void> | null = null;
const mcpClients: any[] = [];

export async function initializeMcp() {
    if (isCfWorker) {
        log.info('MCP is not supported in worker / browser');
        return;
    }
    if (mcpPromise) {
        return mcpPromise;
    }
    log.info('initializing mcp...');

    {
        const mcpConfig = Object.entries(ENV.MCP_CONFIG);
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
        mcpInitialized = true;
        log.debug('MCP:', JSON.stringify(Object.entries(mcpTools).map(([name, tools]) => ({ [name]: Object.entries(tools).map(([tname, t]) => ({ name: tname, description: t.description })) })), null, 1));
    }
    log.info('initialize mcp done');
    log.info(`mcpTools: ${Object.keys(mcpTools)}`);
}

export async function getMcp() {
    if (!mcpInitialized) {
        await initializeMcp();
    }
    return mcpTools;
}

export async function updateMcp() {
    log.info('updating mcp...');
    await Promise.all(mcpClients.map(mcpClient => mcpClient.close()));
    mcpClients.length = 0;
    mcpPromise = null;
    mcpInitialized = false;
    await initializeMcp();
    return Object.keys(mcpTools);
}

// initializeMcp().catch(console.error);
