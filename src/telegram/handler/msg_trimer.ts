import type * as Telegram from 'telegram-bot-api-types';
import type { Message } from 'telegram-bot-api-types';
import type { WorkerContext } from '../../config/types';
import type { UnionData } from '../utils/tg_utils';
import { ENV } from '../../config/env';
import { log } from '../../log/logger';
import { MessageSender } from '../utils/send';

export function substituteMessage(message: Message, replacer: Record<string, string>): void {
    let replacedString = '';
    let text = message.text || message.caption || '';
    const substituter = { ...replacer };
    do {
        const triggerKey = Object.keys(substituter).find(key =>
        // adjust the order of trigger words with the same prefix by yourself.
            text.trim().startsWith(key),
        );
        if (triggerKey) {
            text = text.replace(new RegExp(`(\\s*)${triggerKey}`), (_, p1) => {
                replacedString += `${p1}${substituter[triggerKey]}`;
                return '';
            });
            // remove the trigger key from replacer to avoid replace again
            delete substituter[triggerKey];
        } else {
            break;
        }
    } while (true);
    // log.info(`replacedString: ${replacedString || 'null'}, text: ${text}`);
    message.text ? (message.text = replacedString + text) : (message.caption = replacedString + text);
}

class Lock {
    static quireLock = async (lockKey: string) => {
        let retry = 0;
        // 移除异常情况下未释放的锁
        // const lock = await ENV.DATABASE.get(this.lockKey);
        // if (lock && lock.expiration < Math.floor(Date.now() / 1000)) {
        //     await ENV.DATABASE.delete(this.lockKey);
        // }
        while (retry < 24) {
            const lock = await ENV.DATABASE.put(lockKey, '1', { expirationTtl: 1, condition: 'NX' });
            if (lock === true || lock === undefined) {
                log.info(`Lock success, key: ${lockKey}, retry: ${retry}`);
                return;
            }
            // log.info(`Lock failed, key: ${lockKey}, retry: ${retry}`);
            retry++;
            await new Promise(resolve => setTimeout(resolve, 15));
        }
        throw new Error('Lock failed');
    };

    static releaseLock = async (lockKey: string) => {
        await ENV.DATABASE.delete(lockKey);
    };
}

export class HandleMediaGroupMessage {
    static processingMediaGroups = new Set<string>();

    static handle = async (message: Message, context: WorkerContext): Promise<Response | null> => {
        const storeMediaMessageKey = context.SHARE_CONTEXT?.storeMediaMessageKey;
        if (!storeMediaMessageKey) {
            return null;
        }
        const msgInfo = context.MIDDLE_CONTEXT.messageInfo;
        if (message.media_group_id && ['photo', 'image'].includes(msgInfo.type) && Array.isArray(msgInfo.id)) {
            const mediaGroupId = message.media_group_id;
            const hasPrompt = !!(message.caption || message.text)?.trim();

            await this.storeMediaMessage(`${storeMediaMessageKey}:lock`, storeMediaMessageKey, msgInfo);
            if (hasPrompt) {
                await this.markMediaGroupPrompt(storeMediaMessageKey, mediaGroupId);
            }

            const fileIds = await this.waitStableMediaGroup(storeMediaMessageKey, mediaGroupId, hasPrompt);
            if (!fileIds.length) {
                log.info(`[MEDIA GROUP] No images found after wait, group_id: ${mediaGroupId}`);
                return new Response('ok');
            }

            if (!hasPrompt && await this.hasMediaGroupPrompt(storeMediaMessageKey, mediaGroupId)) {
                log.info(`[MEDIA GROUP] Skipping image-only update because caption update will process group_id: ${mediaGroupId}`);
                return new Response('ok');
            }

            if (!await this.reserveMediaGroupProcessing(storeMediaMessageKey, mediaGroupId)) {
                log.info(`[MEDIA GROUP] Skipping duplicate processing, group_id: ${mediaGroupId}`);
                return new Response('ok');
            }

            context.MIDDLE_CONTEXT.messageInfo.id = fileIds;
            await this.sendProcessingTip(
                message,
                context,
                `Processing ${fileIds.length} image${fileIds.length > 1 ? 's' : ''} from media group...`,
            );
            log.info(`[MEDIA GROUP] Processing ${fileIds.length} images, group_id: ${mediaGroupId}, hasPrompt: ${hasPrompt}`);
            return null;
        } else if (message.reply_to_message?.media_group_id) {
            const data: Record<string, string[]> = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || '{}');
            const fileIds = data[message.reply_to_message.media_group_id];
            if (fileIds) {
                context.MIDDLE_CONTEXT.messageInfo.id = fileIds;
                await this.sendProcessingTip(message, context, `Has received ${fileIds.length} images, processing...`);
            }
        }
        return null;
    };

    static sendProcessingTip = async (message: Message, context: WorkerContext, tip: string): Promise<number | null> => {
        try {
            const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
            const resp = await sender.sendRichText(`<pre><code class="language-tip">${tip}</code></pre>`, 'HTML', 'tip');
            if (!resp.ok) {
                log.warn(`[MEDIA GROUP] Failed to send processing tip: ${resp.status}`);
                return null;
            }
            const data = await resp.clone().json() as Telegram.ResponseWithMessage;
            const messageId = data.result?.message_id ?? null;
            context.MIDDLE_CONTEXT.processingMessageId = messageId;
            if (messageId) {
                log.info(`[MEDIA GROUP] Processing tip message id: ${messageId}`);
            }
            return messageId;
        } catch (e) {
            log.error(`[MEDIA GROUP] Failed to send processing tip: ${(e as Error).message}`);
            return null;
        }
    };

    static waitStableMediaGroup = async (storeMediaMessageKey: string, mediaGroupId: string, hasPrompt: boolean): Promise<string[]> => {
        const pollIntervalMs = 300;
        const stableWaitMs = hasPrompt ? 1200 : 2200;
        const maxWaitMs = 6000;
        const start = Date.now();
        let stableSince = Date.now();
        let lastSignature = '';
        let latestFileIds: string[] = [];

        while (Date.now() - start < maxWaitMs) {
            latestFileIds = await this.getMediaGroupFileIds(storeMediaMessageKey, mediaGroupId);
            const signature = latestFileIds.join(',');
            if (signature && signature === lastSignature && Date.now() - stableSince >= stableWaitMs) {
                return latestFileIds;
            }
            if (signature !== lastSignature) {
                lastSignature = signature;
                stableSince = Date.now();
            }
            await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
        }

        return latestFileIds.length ? latestFileIds : this.getMediaGroupFileIds(storeMediaMessageKey, mediaGroupId);
    };

    static getMediaGroupFileIds = async (storeMediaMessageKey: string, mediaGroupId: string): Promise<string[]> => {
        const data: Record<string, string[]> = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || '{}');
        return data[mediaGroupId] || [];
    };

    static markMediaGroupPrompt = async (storeMediaMessageKey: string, mediaGroupId: string): Promise<void> => {
        await ENV.DATABASE.put(`${storeMediaMessageKey}:prompt:${mediaGroupId}`, '1', { expirationTtl: 60 });
    };

    static hasMediaGroupPrompt = async (storeMediaMessageKey: string, mediaGroupId: string): Promise<boolean> => {
        return !!(await ENV.DATABASE.get(`${storeMediaMessageKey}:prompt:${mediaGroupId}`));
    };

    static reserveMediaGroupProcessing = async (storeMediaMessageKey: string, mediaGroupId: string): Promise<boolean> => {
        const processingKey = `${storeMediaMessageKey}:processing:${mediaGroupId}`;
        if (this.processingMediaGroups.has(processingKey)) {
            return false;
        }
        this.processingMediaGroups.add(processingKey);
        try {
            if (await ENV.DATABASE.get(processingKey)) {
                this.processingMediaGroups.delete(processingKey);
                return false;
            }
            const reserved = await ENV.DATABASE.put(processingKey, '1', { expirationTtl: 120, condition: 'NX' });
            if (reserved === false) {
                this.processingMediaGroups.delete(processingKey);
                return false;
            }
            setTimeout(() => this.processingMediaGroups.delete(processingKey), 120_000);
            return true;
        } catch (e) {
            this.processingMediaGroups.delete(processingKey);
            throw e;
        }
    };

    static storeMediaMessage = async (lockKey: string, storeMediaMessageKey: string, msgInfo: UnionData) => {
        const maxMediaGroupNum = 12;
        await Lock.quireLock(lockKey);
        const data: Record<string, string[]> = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || '{}');
        console.debug(`current data length: ${data?.[msgInfo.media_group_id!]?.length ?? 0}`);
        if (!data[msgInfo.media_group_id!]) {
            data[msgInfo.media_group_id!] = [];
        }
        const needStoreIds = msgInfo.id?.filter((id: string) => !data[msgInfo.media_group_id!].includes(id)) || [];
        if (needStoreIds.length === 0) {
            await Lock.releaseLock(`${storeMediaMessageKey}:lock`);
            return new Response('no need store');
        }
        data[msgInfo.media_group_id!].push(...needStoreIds);
        if (Object.keys(data).length > maxMediaGroupNum) {
            const groupIds = Object.keys(data).sort((a, b) => Number(a) - Number(b));
            groupIds.splice(0, groupIds.length - maxMediaGroupNum).forEach((key) => {
                delete data[key];
            });
        }
        await ENV.DATABASE.put(storeMediaMessageKey, JSON.stringify(data));
        await Lock.releaseLock(`${storeMediaMessageKey}:lock`);
        log.info(`[CHUNK] Store message media, group_id: ${msgInfo.media_group_id}, id: ${msgInfo.id}`);
        return new Response('ok');
    };
}

export class HandleChunkMessage {
    static handle = async (message: Message, context: WorkerContext): Promise<Response | null> => {
        const chunkMessageKey = context.SHARE_CONTEXT?.chunkMessageKey;
        if (!chunkMessageKey) {
            return null;
        }

        const textFragmentThreshold = 3500;
        if ((message.text || '')?.length > textFragmentThreshold) {
            await Lock.quireLock(`${chunkMessageKey}:lock`);
            await this.chunkMessageStore(message, chunkMessageKey);
            await Lock.releaseLock(`${chunkMessageKey}:lock`);
            return new Response('ok');
        }
        // polling会同时接收多条消息 等待50ms
        log.info(`[CHUNK] start handle chunk text, key: ${chunkMessageKey}`);
        await new Promise(resolve => setTimeout(resolve, 50));
        const chunks = JSON.parse(await ENV.DATABASE.get(chunkMessageKey) || '[]');
        if (chunks.length > 0) {
            message.text = chunks
                .sort((a: { message_id: number }, b: { message_id: number }) => a.message_id - b.message_id)
                .map(({ text }: { text: string }) => text)
                .join('\n') + message.text;
            log.info(`[CHUNK] Merged message chunk, chunks length: ${chunks?.length}, text length: ${message.text?.length}`);
            // 读取后立即删除
            await ENV.DATABASE.delete(chunkMessageKey);
        }
        return null;
    };

    static chunkMessageStore = async (message: Message, chunkMessageKey: string) => {
        log.info(`[CHUNK] Stored message chunk, message_id: ${message.message_id} key: ${chunkMessageKey}`);
        const data = JSON.parse(await ENV.DATABASE.get(chunkMessageKey) || '[]');
        data.push({
            message_id: message.message_id,
            text: message.text,
        });
        console.log(`chunk size: ${data.length}, current chunk message length: ${message.text?.length}`);
        // 60s后删除
        return ENV.DATABASE.put(chunkMessageKey, JSON.stringify(data), { expirationTtl: 60 });
    };
}
