/**
 * Telegram Message Rendering Fallback Strategy
 *
 * Based on best practices from:
 * - https://stackoverflow.com/questions/60130062/escaped-character-on-telegram-bot-api-4-5-markdownv2-gives-trouble-for-hyper-lin
 * - https://hexdocs.pm/telegex_marked/readme.html
 * - https://pypi.org/project/telegram-markdown-entities/0.1.0/
 *
 * Fallback order: MarkdownV2 → HTML → Plain Text → Telegraph
 */

import type * as Telegram from 'telegram-bot-api-types';
import { escape as escapeMarkdownV2 } from './md2tgmd';

export interface RenderResult {
    success: boolean;
    text: string;
    parseMode?: 'MarkdownV2' | 'HTML' | undefined;
    error?: string;
    fallbackUsed?: 'html' | 'plain' | 'telegraph';
}

/**
 * Validate MarkdownV2 format before sending
 * Detects common issues that cause rendering failures
 */
export function validateMarkdownV2(text: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for unbalanced bold markers
    const boldCount = (text.match(/(?<!\\)\*\*/g) || []).length;
    if (boldCount % 2 !== 0) {
        issues.push('Unbalanced bold markers (**)');
    }

    // Check for unbalanced italic markers (excluding list markers)
    // List markers: "* " or "*   " at start of line
    const textWithoutLists = text.replace(/^[\s]*\*\s+/gm, '');
    const italicCount = (textWithoutLists.match(/(?<!\\)(?<!\*)\*(?!\*)/g) || []).length;
    if (italicCount % 2 !== 0) {
        issues.push('Unbalanced italic markers (*)');
    }

    // Check for unbalanced underline markers
    const underlineCount = (text.match(/(?<!\\)__/g) || []).length;
    if (underlineCount % 2 !== 0) {
        issues.push('Unbalanced underline markers (__)');
    }

    // Check for unbalanced code markers
    const codeCount = (text.match(/(?<!\\)```/g) || []).length;
    if (codeCount % 2 !== 0) {
        issues.push('Unbalanced code block markers (```)');
    }

    // Check for unbalanced inline code markers
    const inlineCodeCount = (text.match(/(?<!\\)`(?!``)/g) || []).length;
    if (inlineCodeCount % 2 !== 0) {
        issues.push('Unbalanced inline code markers (`)');
    }

    // Check for unbalanced spoiler markers
    const spoilerCount = (text.match(/(?<!\\)\|\|/g) || []).length;
    if (spoilerCount % 2 !== 0) {
        issues.push('Unbalanced spoiler markers (||)');
    }

    // Check for malformed links [text](url)
    const linkPattern = /\[([^\]]*)\]\(([^)]*)\)/g;
    const links = text.matchAll(linkPattern);
    for (const link of links) {
        if (!link[1] || !link[2]) {
            issues.push(`Malformed link: [${link[1]}](${link[2]})`);
        }
    }

    // Check for invalid nested formatting patterns
    const invalidPatterns = [
        { pattern: /\*\*_[^_]*_\*\*/, desc: 'Invalid nested bold+italic (**_text_**), use ***text*** instead' },
        { pattern: /__\*[^*]*\*__/, desc: 'Invalid nested underline+italic (__*text*__), use ___text___ instead' },
    ];

    for (const { pattern, desc } of invalidPatterns) {
        if (pattern.test(text)) {
            issues.push(desc);
        }
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}

/**
 * Preprocess text for MarkdownV2 compatibility
 * Converts unsupported Markdown features to MarkdownV2-safe format
 */
export function preprocessMarkdownV2(text: string): string {
    let processed = text;

    // Convert unordered lists (* item) to bullet points (• item)
    // Telegram MarkdownV2 doesn't support list syntax
    // Handle both regular lists and lists inside blockquotes
    // Pattern: optional whitespace + optional '>' + optional whitespace + '*' + space
    processed = processed.replace(/^([\s]*>?[\s]*)\*\s+/gm, '$1• ');

    return processed;
}

/**
 * Convert MarkdownV2 to safe HTML
 * Fallback when MarkdownV2 fails
 */
export function markdownToHTML(text: string): string {
    let html = text;

    // Escape HTML special characters first
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Convert unordered lists (must be done before italic conversion)
    // Match: "* item" or "*   item" at start of line
    html = html.replace(/^[\s]*\*\s+(.+)$/gm, '• $1');

    // Convert code blocks (must be done before inline code)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');

    // Convert inline code
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // Convert bold + italic (must be before individual bold/italic)
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>');
    html = html.replace(/___(.+?)___/g, '<b><i>$1</i></b>');

    // Convert bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    html = html.replace(/__(.+?)__/g, '<u>$1</u>');

    // Convert italic
    html = html.replace(/\*(.+?)\*/g, '<i>$1</i>');
    html = html.replace(/_(.+?)_/g, '<i>$1</i>');

    // Convert strikethrough
    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');
    html = html.replace(/~(.+?)~/g, '<s>$1</s>');

    // Convert spoiler
    html = html.replace(/\|\|(.+?)\|\|/g, '<span class="tg-spoiler">$1</span>');

    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    return html;
}

/**
 * Strip all formatting and return plain text
 * Last resort before Telegraph
 */
export function stripFormatting(text: string): string {
    let plain = text;

    // Remove code blocks
    plain = plain.replace(/```[\s\S]*?```/g, (match) => {
        return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
    });

    // Remove inline code markers
    plain = plain.replace(/`([^`]+)`/g, '$1');

    // Remove bold/italic/underline markers
    plain = plain.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
    plain = plain.replace(/\*\*(.+?)\*\*/g, '$1');
    plain = plain.replace(/__(.+?)__/g, '$1');
    plain = plain.replace(/\*(.+?)\*/g, '$1');
    plain = plain.replace(/_(.+?)_/g, '$1');

    // Remove strikethrough
    plain = plain.replace(/~~(.+?)~~/g, '$1');
    plain = plain.replace(/~(.+?)~/g, '$1');

    // Remove spoiler
    plain = plain.replace(/\|\|(.+?)\|\|/g, '$1');

    // Convert links to text
    plain = plain.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

    // Remove escape characters
    plain = plain.replace(/\\([_*[\]()~`>#+\-=|{}.!\\])/g, '$1');

    return plain;
}

/**
 * Attempt to send message with automatic fallback
 * Returns the successful render result or throws if all methods fail
 */
export async function sendWithFallback(
    api: any,
    chatId: number | string,
    text: string,
    options: Partial<Telegram.SendMessageParams> = {},
): Promise<RenderResult> {
    const maxLength = 4096;

    // If text is too long, immediately return telegraph flag
    if (text.length > maxLength) {
        return {
            success: false,
            text,
            error: 'Message too long (>4096 chars)',
            fallbackUsed: 'telegraph',
        };
    }

    // Try MarkdownV2 first
    try {
        // Preprocess text to convert unsupported Markdown features
        const processedText = preprocessMarkdownV2(text);

        const validation = validateMarkdownV2(processedText);
        if (!validation.valid) {
            console.warn('[Render] MarkdownV2 validation failed:', validation.issues);
        }

        const resp = await api.sendMessage({
            chat_id: chatId,
            text: processedText,
            parse_mode: 'MarkdownV2',
            ...options,
        });

        if (resp.ok) {
            return {
                success: true,
                text: processedText,
                parseMode: 'MarkdownV2',
            };
        }

        const errorData = await resp.json();
        console.warn('[Render] MarkdownV2 failed:', errorData.description);
    } catch (e) {
        console.error('[Render] MarkdownV2 error:', (e as Error).message);
    }

    // Try HTML fallback
    try {
        const htmlText = markdownToHTML(text);
        const resp = await api.sendMessage({
            chat_id: chatId,
            text: htmlText,
            parse_mode: 'HTML',
            ...options,
        });

        if (resp.ok) {
            return {
                success: true,
                text: htmlText,
                parseMode: 'HTML',
                fallbackUsed: 'html',
            };
        }

        const errorData = await resp.json();
        console.warn('[Render] HTML fallback failed:', errorData.description);
    } catch (e) {
        console.error('[Render] HTML error:', (e as Error).message);
    }

    // Try plain text fallback
    try {
        const plainText = stripFormatting(text);
        const resp = await api.sendMessage({
            chat_id: chatId,
            text: plainText,
            ...options,
        });

        if (resp.ok) {
            return {
                success: true,
                text: plainText,
                parseMode: undefined,
                fallbackUsed: 'plain',
            };
        }

        const errorData = await resp.json();
        console.warn('[Render] Plain text fallback failed:', errorData.description);
    } catch (e) {
        console.error('[Render] Plain text error:', (e as Error).message);
    }

    // All methods failed, return telegraph flag
    return {
        success: false,
        text,
        error: 'All rendering methods failed',
        fallbackUsed: 'telegraph',
    };
}
