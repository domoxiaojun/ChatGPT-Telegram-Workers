import * as fs from 'node:fs/promises';
import path from 'node:path';

const dockerfile = `
FROM node:20-alpine as builder

WORKDIR /build
COPY package.json /build/
RUN apk add --no-cache python3 make g++ sqlite-dev && \\
    npm install --omit=dev --production && \\
    npm rebuild --build-from-source && \\
    apk del python3 make g++

FROM node:20-alpine as prod

WORKDIR /app
COPY --from=builder /build/node_modules /app/node_modules
COPY index.js package.json /app/
RUN apk add --no-cache sqlite
EXPOSE 8787
CMD ["node", "index.js"]
`;

export function createDockerPlugin(targetDir: string) {
    return {
        name: 'docker',
        async closeBundle() {
            await fs.writeFile(path.resolve(targetDir, 'Dockerfile'), dockerfile.trim());

            const packageJsonPath = path.resolve(process.cwd(), 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
            const cleanedPackageJson = {
                name: packageJson.name,
                type: packageJson.type,
                version: packageJson.version,
                dependencies: packageJson.dependencies,
            };

            await fs.writeFile(
                path.resolve(targetDir, 'package.json'),
                JSON.stringify(cleanedPackageJson, null, 2),
            );
        },
    };
}
