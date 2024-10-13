import { ENV } from '../../config/env';
import md2node from '../../telegram/utils/md2node';

interface Author {
    short_name?: string;
    author_name?: string;
    author_url?: string;
}

interface SendContext {
    url: string;
    access_token: string;
    path?: string;
}

interface Context {
    telegraphAccessToken?: string;
    telegraphPath?: string;
    telegraphAccessTokenKey: string;
}

interface CreateAccountResponse {
    access_token: string;
}

interface CreateOrEditPageResponse {
    ok: boolean;
    result?: {
        path: string;
        url: string;
    };
    error?: string;
}

async function createAccount(author?: Author): Promise<CreateAccountResponse> {
    const { short_name = 'Mewo', author_name = 'A Cat' } = author || {};
    const url = `https://api.telegra.ph/createAccount?short_name=${short_name}&author_name=${author_name}`;
    const resp = await fetch(url).then(r => r.json());
    if (resp.ok) {
        return {
            access_token: resp.result.access_token,
        };
    } else {
        throw new Error('create telegraph account failed');
    }
}

async function createOrEditPage(sendContext: SendContext, title: string, content: string, author: Author): Promise<CreateOrEditPageResponse> {
    const { url, access_token, path } = sendContext;
    const { short_name, author_name, author_url } = author;
    const body = {
        access_token,
        ...((path && { path }) || {}),
        title: title || 'Daily Q&A',
        content: md2node(content),
        short_name: short_name ?? 'anonymous',
        author_name: author_name ?? 'anonymous',
        ...((author_url && { author_url }) || {}),
    };
    const headers = { 'Content-Type': 'application/json' };
    return fetch(url, {
        method: 'post',
        headers,
        body: JSON.stringify(body),
    }).then(r => r.json());
}

/**
 * @description:
 * @param {*} context
 * @param {*} title
 * @param {*} content
 * @param {*} author
 * @return {*}
 */
async function sendTelegraph(context: Context, title: string, content: string, author: Author): Promise<CreateOrEditPageResponse> {
    const endPoint = 'https://api.telegra.ph/editPage';
    let access_token = context.telegraphAccessToken;
    const path = context.telegraphPath;
    if (!access_token) {
        access_token = (await createAccount(author)).access_token;
        context.telegraphAccessToken = access_token;
        await ENV.DATABASE.put(context.telegraphAccessTokenKey, access_token);
    }
    const sendContext: SendContext = { url: endPoint, access_token, path };

    if (!path) {
        sendContext.url = 'https://api.telegra.ph/createPage';
        const c_resp = await createOrEditPage(sendContext, title, content, author);
        if (c_resp.ok) {
            context.telegraphPath = c_resp.result!.path;
            console.log('telegraph url: ', c_resp.result!.url);
            return c_resp;
        } else {
            console.error(c_resp.error);
            throw new Error(c_resp.error);
        }
    } else {
        return createOrEditPage(sendContext, title, content, author);
    }
}

/**
 * @description:
 * @param {*} context
 * @return {*}
 */
export function sendTelegraphWithContext(context: Context): any {
    return async (title: string, content: string, author: Author) => sendTelegraph(context, title, content, author);
}
