import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';

const TOOL_PATH = process.env.TOOL_PATH || '/app/tool';

async function readToolFiles(files: string[]) {
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    const scriptFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    const tools: Record<string, any> = {};

    await Promise.all(jsonFiles.map(async (file) => {
        const toolName = file.replace(/\.json$/, '');
        const content = await fs.readFile(resolve(TOOL_PATH, file), 'utf8');
        try {
            tools[toolName] = JSON.parse(content);
        } catch (error) {
            console.error(error);
        }
    }));
    await Promise.all(scriptFiles.map(async (file) => {
        const toolName = file.replace(/\.[j|t]s$/, '');
        try {
            const { default: tool } = await import(resolve(TOOL_PATH, file));
            tools[toolName] = tool;
        } catch (error) {
            console.error(error);
        }
    }));
    return tools;
}

export async function getLocalTools() {
    if (existsSync(TOOL_PATH)) {
        const files = await fs.readdir(TOOL_PATH);
        return readToolFiles(files);
    }
    return {};
}

// async function main() {
//     const tools = await localTools();
//     console.log(tools);
// }

// main();
