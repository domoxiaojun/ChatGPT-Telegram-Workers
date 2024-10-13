import * as fs from 'node:fs/promises';
import path from 'node:path';

const dockerfile = `
FROM node:alpine as PROD

WORKDIR /app
COPY index.js package.json /app/
RUN npm install --only=production --omit=dev && \
apk add --no-cache sqlite && \
npm cache clean --force
EXPOSE 8787
CMD ["npm", "run", "start"]
`;

const packageJson = `
{
  "name": "chatgpt-telegram-workers",
  "type": "module",
  "version": "1.8.0",
  "author": "TBXark",
  "license": "MIT",
  "module": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cloudflare-worker-adapter": "^1.2.3",
    "node-cron": "^3.0.2",
    "ws": "^8.13.0"
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
