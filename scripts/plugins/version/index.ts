import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import path from 'node:path';

const TIMESTAMP = Math.floor(Date.now() / 1000);
const COMMIT_HASH = resolveCommitHash();

function resolveCommitHash(): string {
    const envHash = process.env.COMMIT_HASH || process.env.GITHUB_SHA || process.env.CF_PAGES_COMMIT_SHA;
    if (envHash) {
        return envHash.slice(0, 7);
    }

    try {
        return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
        return 'unknown';
    }
}

export function createVersionPlugin(targetDir: string) {
    return {
        name: 'buildInfo',
        async closeBundle() {
            await fs.mkdir(targetDir, { recursive: true });
            await fs.writeFile(path.resolve(targetDir, 'timestamp'), TIMESTAMP.toString());
            await fs.writeFile(path.resolve(targetDir, 'buildinfo.json'), JSON.stringify({
                sha: COMMIT_HASH,
                timestamp: TIMESTAMP,
            }));
        },
    };
}

export const versionDefine = {
    __BUILD_VERSION__: JSON.stringify(COMMIT_HASH),
    __BUILD_TIMESTAMP__: TIMESTAMP.toString(),
};
