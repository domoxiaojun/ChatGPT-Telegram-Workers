import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { experimental_createMCPClient as createMCPClient, streamText } from 'ai';
import { Experimental_StdioMCPTransport as MCPStdioTransport } from 'ai/mcp-stdio';

let mcpClient;

try {
    // mcpClient = await createMCPClient({
    //     name: 'amap',
    //     transport: {
    //         type: 'sse',
    //         url: `https://mcp.amap.com/sse?key=${process.env.AMAP_KEY}`,
    //     },
    // });
    const transport = new MCPStdioTransport({
        command: 'npx',
        args: ['-y', '@amap/amap-maps-mcp-server'],
        env: {
            AMAP_MAPS_API_KEY: process.env.AMAP_MAPS_API_KEY!,
        },
    });
    mcpClient = await createMCPClient({
        name: 'amap',
        transport,
    });

    const { textStream } = streamText({
        model: createOpenAICompatible({
            baseURL: process.env.BASE_URL!,
            apiKey: process.env.API_KEY!,
            name: 'oailike',
        }).languageModel('gemini-2.5-pro'),
        tools: await mcpClient.tools(),
        maxSteps: 10,
        prompt: '上海虹桥站到东方明珠最快路径 开车前往 我不知道经纬度 请使用工具后告诉我最快捷路线',
    });

    for await (const textPart of textStream) {
        process.stdout.write(textPart);
    }
} catch (error) {
    console.error(error);
} finally {
    await mcpClient!.close();
}
