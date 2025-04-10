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
