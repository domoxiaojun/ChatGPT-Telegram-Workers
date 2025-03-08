import * as fs from 'node:fs/promises';
import path from 'node:path';

const dockerfile = `
FROM node:20-alpine as PROD

WORKDIR /app
COPY index.js package.json /app/
RUN npm install --only=production && \
apk add --no-cache sqlite && \
npm cache clean --force
EXPOSE 8787
CMD ["npm", "run", "start"]
`;

const packageJson = `
{
  "name": "chatgpt-telegram-workers",
  "type": "module",
  "version": "2.4.0",
  "author": "TBXark",
  "license": "MIT",
  "module": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@ai-sdk/anthropic": "^1.1.15",
    "@ai-sdk/azure": "^1.2.1",
    "@ai-sdk/cohere": "^1.1.13",
    "@ai-sdk/google": "^1.1.17",
    "@ai-sdk/google-vertex": "^2.1.24",
    "@ai-sdk/mistral": "^1.1.15",
    "@ai-sdk/openai": "^1.2.1",
    "@ai-sdk/openai-compatible": "^0.1.13",
    "@ai-sdk/provider": "^1.0.10",
    "@ai-sdk/xai": "^1.1.13",
    "@ffmpeg.wasm/core-st": "^0.13.2",
    "@ffmpeg.wasm/main": "^0.13.1",
    "ai": "^4.1.47",
    "cf-worker-adapter": "^1.4.0",
    "node-cron": "^3.0.3"
  },
  "devDependencies": {}
}
`;

export function createDockerPlugin(targetDir: string) {
    return {
        name: 'docker',
        async closeBundle() {
            await fs.writeFile(path.resolve(targetDir, 'Dockerfile'), dockerfile.trim());
            await fs.writeFile(path.resolve(targetDir, 'package.json'), packageJson.trim());
        },
    };
}
