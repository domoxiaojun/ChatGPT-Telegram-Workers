import * as fs from 'node:fs/promises';
import path from 'node:path';

const dockerfile = `
FROM node:24-alpine as prod

WORKDIR /app
COPY index.js package.json /app/
RUN apk add --no-cache sqlite && \\
    apk add --no-cache --virtual .build-deps python3 make g++ && \\
    npm install --omit=dev && \\
    npm cache clean --force && \\
    apk del .build-deps
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
