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
    static handle = async (message: Message, context: WorkerContext): Promise<Response | null> => {
        const storeMediaMessageKey = context.SHARE_CONTEXT?.storeMediaMessageKey;
        if (!storeMediaMessageKey) {
            return null;
        }
        const msgInfo = context.MIDDLE_CONTEXT.messageInfo;

        log.info(`[MEDIA GROUP DEBUG] message_id: ${message.message_id}, has media_group_id: ${!!message.media_group_id}, media_group_id: ${message.media_group_id}, type: ${msgInfo.type}`);

        if (message.media_group_id && ['photo', 'image'].includes(msgInfo.type) && Array.isArray(msgInfo.id)) {
            log.info(`[MEDIA GROUP] message_id ${message.message_id} entering handler, media_group_id: ${message.media_group_id}`);

            // CRITICAL: Acquire lock BEFORE storing to prevent race conditions
            const lockKey = `media_group_lock:${message.media_group_id}`;
            log.info(`[MEDIA GROUP] message_id ${message.message_id} trying to acquire lock: ${lockKey}`);
            const lockAcquired = await ENV.DATABASE.put(lockKey, message.message_id.toString(), { expirationTtl: 30, condition: 'NX' });
            log.info(`[MEDIA GROUP] message_id ${message.message_id} lock result: ${lockAcquired}`);

            // Store this image's file_id regardless of lock status
            await this.storeMediaMessage(`${storeMediaMessageKey}:lock`, storeMediaMessageKey, msgInfo);

            if (lockAcquired !== true && lockAcquired !== undefined) {
                // Another message already acquired the lock
                log.info(`[MEDIA GROUP] Skipping message_id ${message.message_id} - lock held by another message`);
                return new Response('ok');
            }

            // We acquired the lock! Wait for all images to arrive
            // Even with caption, need to wait long enough for all images
            // Telegram can delay sending images in media group by several seconds
            const hasCaption = !!(message.caption || message.text);
            log.info(`[MEDIA GROUP] Lock acquired by message_id ${message.message_id}, has_caption: ${hasCaption}, caption: "${message.caption}", text: "${message.text}"`);

            // Wait and check multiple times if more images arrive
            let previousCount = 0;
            let stableCount = 0;
            const maxWaitTime = 15000; // Maximum 15 seconds
            const checkInterval = 500; // Check every 500ms
            const stableRequired = 3; // Need 3 consecutive same counts to consider complete

            const startTime = Date.now();
            while (Date.now() - startTime < maxWaitTime) {
                await new Promise(resolve => setTimeout(resolve, checkInterval));

                const data: Record<string, string[]> = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || '{}');
                const currentCount = data[message.media_group_id]?.length || 0;

                if (currentCount === previousCount) {
                    stableCount++;
                    if (stableCount >= stableRequired) {
                        log.info(`[MEDIA GROUP] Image count stable at ${currentCount} for ${stableCount * checkInterval}ms, proceeding`);
                        break;
                    }
                } else {
                    log.info(`[MEDIA GROUP] Image count changed: ${previousCount} -> ${currentCount}`);
                    previousCount = currentCount;
                    stableCount = 0;
                }
            }

            const totalWaitTime = Date.now() - startTime;
            log.info(`[MEDIA GROUP] Waited ${totalWaitTime}ms total`);

            // Load all collected images
            const data: Record<string, string[]> = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || '{}');
            const fileIds = data[message.media_group_id];

            if (fileIds && fileIds.length > 0) {
                context.MIDDLE_CONTEXT.messageInfo.id = fileIds;
                log.info(`[MEDIA GROUP] message_id ${message.message_id} processing ${fileIds.length} images`);
                return null; // Continue to process
            }

            log.info(`[MEDIA GROUP] message_id ${message.message_id} no file IDs found, skipping`);
            return new Response('ok');
        } else if (message.reply_to_message?.media_group_id) {
            const data: Record<string, string[]> = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || '{}');
            const fileIds = data[message.reply_to_message.media_group_id];
            if (fileIds) {
                context.MIDDLE_CONTEXT.messageInfo.id = fileIds;
                const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
                sender.sendRichText(`<pre><code class="language-tip">Has received ${fileIds.length} images, processing...</code></pre>`, 'HTML', 'tip');
            }
        }
        return null;
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
