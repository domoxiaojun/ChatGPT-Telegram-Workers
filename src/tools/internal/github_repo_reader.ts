import type { AgentUserConfig } from '../../config/env';
import type { ToolResult } from '../types';
import { log } from '../../log/logger';

interface GitHubRepoRef {
    owner: string;
    repo: string;
    ref?: string;
    path?: string;
}

interface TreeItem {
    path: string;
    type: 'blob' | 'tree';
    size?: number;
}

const DEFAULT_EXCLUDES = [
    '.git/',
    '.github/',
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    'vendor/',
    'public/',
    'assets/',
    'static/',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
];

const TEXT_EXTENSIONS = new Set([
    '',
    '.c',
    '.cc',
    '.cfg',
    '.conf',
    '.cpp',
    '.cs',
    '.css',
    '.dockerfile',
    '.env',
    '.go',
    '.h',
    '.hpp',
    '.html',
    '.java',
    '.js',
    '.json',
    '.jsx',
    '.kt',
    '.lua',
    '.md',
    '.mjs',
    '.py',
    '.rb',
    '.rs',
    '.sh',
    '.sql',
    '.svelte',
    '.toml',
    '.ts',
    '.tsx',
    '.txt',
    '.vue',
    '.xml',
    '.yaml',
    '.yml',
]);

export default {
    schema: {
        name: 'github_repo_reader',
        description: 'Read and summarize relevant files from a GitHub repository. Use this when the user sends a GitHub repository URL, GitHub file URL, or asks to analyze a repo/codebase. It reads README/config/source files through the GitHub API; it does not execute code.',
        parameters: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'GitHub repository, tree, or blob URL, for example https://github.com/owner/repo or https://github.com/owner/repo/tree/main/src.',
                },
                owner: {
                    type: 'string',
                    description: 'Repository owner. Optional when url is provided.',
                },
                repo: {
                    type: 'string',
                    description: 'Repository name. Optional when url is provided.',
                },
                ref: {
                    type: 'string',
                    description: 'Branch, tag, or commit SHA. Optional; defaults to the repository default branch or the ref in the GitHub URL.',
                },
                paths: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Specific files or directories to read. If omitted, the tool selects important README/config/source files automatically.',
                },
                maxFiles: {
                    type: 'integer',
                    description: 'Maximum number of files to include. Defaults to GITHUB_REPO_READER_MAX_FILES.',
                    minimum: 1,
                    maximum: 80,
                },
            },
            required: [],
        },
    },

    func: async ({ url, owner, repo, ref, paths = [], maxFiles }: { url?: string; owner?: string; repo?: string; ref?: string; paths?: string[]; maxFiles?: number }, _env?: Record<string, any>, config?: AgentUserConfig): Promise<ToolResult> => {
        try {
            const repoRef = resolveRepoRef({ url, owner, repo, ref });
            const result = await readGitHubRepository(repoRef, paths, maxFiles, config);
            return { content: [{ type: 'text', text: result }] };
        } catch (error: any) {
            const message = error?.message || String(error);
            log.error(`[github_repo_reader] ${message}`);
            return { content: [{ type: 'text', text: `github_repo_reader failed: ${message}`, is_error: true }] };
        }
    },

    type: 'web_crawler',
    prompt: 'Analyze the repository content returned by github_repo_reader. Prefer evidence from the included files. If the requested conclusion needs files that were not included, say which files should be read next.',
};

function resolveRepoRef({ url, owner, repo, ref }: { url?: string; owner?: string; repo?: string; ref?: string }): GitHubRepoRef {
    if (url) {
        const parsed = parseGitHubUrl(url);
        return {
            ...parsed,
            ref: ref || parsed.ref,
        };
    }
    if (!owner || !repo) {
        throw new Error('Provide a GitHub url, or both owner and repo.');
    }
    return { owner, repo, ref };
}

function parseGitHubUrl(rawUrl: string): GitHubRepoRef {
    let parsed: URL;
    try {
        parsed = new URL(rawUrl);
    } catch {
        throw new Error(`Invalid GitHub URL: ${rawUrl}`);
    }

    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
        throw new Error(`Only github.com URLs are supported: ${rawUrl}`);
    }

    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
        throw new Error(`GitHub URL must include owner and repo: ${rawUrl}`);
    }

    const [owner, repoWithSuffix, kind, urlRef, ...pathParts] = parts;
    const repo = repoWithSuffix.replace(/\.git$/, '');
    const result: GitHubRepoRef = { owner, repo };

    if ((kind === 'tree' || kind === 'blob') && urlRef) {
        result.ref = decodeURIComponent(urlRef);
        result.path = pathParts.map(decodeURIComponent).join('/');
    }

    return result;
}

async function readGitHubRepository(repoRef: GitHubRepoRef, paths: string[], requestedMaxFiles: number | undefined, config?: AgentUserConfig): Promise<string> {
    const headers = githubHeaders(config);
    const signal = createTimeoutSignal(config?.GITHUB_REPO_READER_TIMEOUT ?? 20);
    const repoInfo = await githubJson<any>(`https://api.github.com/repos/${repoRef.owner}/${repoRef.repo}`, headers, signal);
    const ref = repoRef.ref || repoInfo.default_branch;
    const maxFiles = clamp(requestedMaxFiles ?? config?.GITHUB_REPO_READER_MAX_FILES ?? 30, 1, 80);
    const maxFileSize = config?.GITHUB_REPO_READER_MAX_FILE_SIZE ?? 30_000;
    const maxTotalChars = config?.GITHUB_REPO_READER_MAX_TOTAL_CHARS ?? 120_000;

    const tree = await githubJson<{ tree: TreeItem[] }>(
        `https://api.github.com/repos/${repoRef.owner}/${repoRef.repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
        headers,
        signal,
    );

    const requestedPaths = normalizeRequestedPaths([...(repoRef.path ? [repoRef.path] : []), ...paths]);
    const selectedFiles = selectFiles(tree.tree || [], requestedPaths, maxFiles, maxFileSize);
    if (selectedFiles.length === 0) {
        throw new Error(`No readable text files found in ${repoRef.owner}/${repoRef.repo}${requestedPaths.length ? ` for ${requestedPaths.join(', ')}` : ''}`);
    }

    const sections: string[] = [];
    let totalChars = 0;
    for (const file of selectedFiles) {
        if (totalChars >= maxTotalChars) {
            break;
        }

        const content = await githubText(
            `https://api.github.com/repos/${repoRef.owner}/${repoRef.repo}/contents/${encodeGitHubPath(file.path)}?ref=${encodeURIComponent(ref)}`,
            headers,
            signal,
        );
        if (!isProbablyText(content)) {
            continue;
        }
        const remaining = maxTotalChars - totalChars;
        const trimmed = content.length > remaining ? `${content.slice(0, remaining)}\n...[truncated by github_repo_reader]` : content;
        totalChars += trimmed.length;
        sections.push(`--- FILE: ${file.path} (${content.length} chars) ---\n${trimmed}`);
    }

    return [
        `GitHub repository snapshot`,
        `Repository: ${repoRef.owner}/${repoRef.repo}`,
        `Description: ${repoInfo.description || ''}`,
        `Default branch: ${repoInfo.default_branch}`,
        `Read ref: ${ref}`,
        `URL: ${repoInfo.html_url}`,
        `Files included (${sections.length}/${selectedFiles.length} selected): ${selectedFiles.map(file => file.path).join(', ')}`,
        '',
        sections.join('\n\n'),
    ].join('\n');
}

function githubHeaders(config?: AgentUserConfig): Record<string, string> {
    const token = selectToken(config?.GITHUB_TOKEN || []);
    return {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'ChatGPT-Telegram-Workers github_repo_reader',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function githubJson<T>(url: string, headers: Record<string, string>, signal?: AbortSignal): Promise<T> {
    const resp = await fetch(url, { headers, signal });
    if (!resp.ok) {
        throw new Error(`GitHub API ${resp.status} ${resp.statusText}: ${await safeText(resp)}`);
    }
    return resp.json() as Promise<T>;
}

async function githubText(url: string, headers: Record<string, string>, signal?: AbortSignal): Promise<string> {
    const resp = await fetch(url, {
        headers: {
            ...headers,
            Accept: 'application/vnd.github.raw',
        },
        signal,
    });
    if (!resp.ok) {
        throw new Error(`GitHub file ${resp.status} ${resp.statusText}: ${await safeText(resp)}`);
    }
    return resp.text();
}

function selectFiles(tree: TreeItem[], requestedPaths: string[], maxFiles: number, maxFileSize: number): TreeItem[] {
    return tree
        .filter(item => item.type === 'blob')
        .filter(item => !item.size || item.size <= maxFileSize)
        .filter(item => isReadablePath(item.path))
        .filter(item => requestedPaths.length === 0 || requestedPaths.some(path => item.path === path || item.path.startsWith(`${path}/`)))
        .sort((a, b) => scorePath(b.path) - scorePath(a.path) || a.path.localeCompare(b.path))
        .slice(0, maxFiles);
}

function scorePath(path: string): number {
    const lower = path.toLowerCase();
    let score = 0;
    if (/^readme(\.|$)/i.test(path)) score += 1000;
    if (/^(package|deno|bun|pnpm-workspace|pyproject|requirements|cargo|go\.mod|composer|gemfile|pom|build\.gradle)/i.test(path)) score += 900;
    if (/^(dockerfile|docker-compose|wrangler|vite\.config|next\.config|nuxt\.config|tsconfig|eslint|prettier)/i.test(path)) score += 800;
    if (lower.startsWith('src/')) score += 600;
    if (lower.startsWith('app/') || lower.startsWith('pages/') || lower.startsWith('lib/')) score += 500;
    if (lower.includes('/index.') || lower.includes('/main.') || lower.includes('/app.') || lower.includes('/server.')) score += 120;
    score -= path.split('/').length * 10;
    return score;
}

function isReadablePath(path: string): boolean {
    const lower = path.toLowerCase();
    if (DEFAULT_EXCLUDES.some(exclude => lower === exclude.replace(/\/$/, '') || lower.startsWith(exclude))) {
        return false;
    }
    const extMatch = lower.match(/(\.[^.\/]+)$/);
    const ext = extMatch?.[1] || '';
    return TEXT_EXTENSIONS.has(ext) || /^dockerfile$/i.test(path.split('/').pop() || '');
}

function normalizeRequestedPaths(paths: string[]): string[] {
    return paths
        .map(path => path.trim().replace(/^\/+|\/+$/g, ''))
        .filter(Boolean);
}

function encodeGitHubPath(path: string): string {
    return path.split('/').map(encodeURIComponent).join('/');
}

function isProbablyText(content: string): boolean {
    return !content.includes('\0');
}

function selectToken(tokens: string[]): string {
    const validTokens = tokens.filter(Boolean);
    if (validTokens.length === 0) {
        return '';
    }
    return validTokens[Math.floor(Math.random() * validTokens.length)];
}

function createTimeoutSignal(seconds: number): AbortSignal | undefined {
    return seconds > 0 ? AbortSignal.timeout(seconds * 1000) : undefined;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

async function safeText(resp: Response): Promise<string> {
    try {
        return (await resp.text()).slice(0, 500);
    } catch {
        return '';
    }
}
