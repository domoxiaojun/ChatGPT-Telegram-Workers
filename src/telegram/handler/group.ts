import type * as Telegram from 'telegram-bot-api-types';
import type { WorkerContext } from '../../config/context';
import type { MessageHandler } from './types';
import { ENV } from '../../config/env';
import { log } from '../../log/logger';
import { createTelegramBotAPI } from '../api';
import { checkIsNeedTagIds } from '../utils/send';
import { isTelegramChatTypeGroup } from '../utils/tg_utils';

// 群组消息缓存接口
export interface GroupCachedMessage {
    messageId: number;
    userId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    text: string;
    timestamp: number;
    messageType?: string;
}

/**
 * 获取群组消息缓存的 Key
 */
export function getGroupMessageCacheKey(chatId: number | string): string {
    return `group_message_cache:${chatId}`;
}

/**
 * 保存群组消息到缓存
 */
export async function cacheGroupMessage(message: Telegram.Message, context: WorkerContext): Promise<void> {
    if (!ENV.GROUP_MESSAGE_LISTEN_MODE || !isTelegramChatTypeGroup(message.chat.type)) {
        return;
    }

    const chatId = message.chat.id;
    const cacheKey = getGroupMessageCacheKey(chatId);

    // 提取消息文本或生成媒体描述
    let messageText = message.text || message.caption || '';

    // 如果是媒体消息但没有文本，生成描述性文本
    if (!messageText.trim()) {
        if (message.photo) {
            messageText = '[sent a photo]';
        } else if (message.sticker) {
            messageText = '[sent a sticker]';
        } else if (message.video) {
            messageText = '[sent a video]';
        } else if (message.voice) {
            messageText = '[sent a voice message]';
        } else if (message.audio) {
            messageText = '[sent an audio]';
        } else if (message.document) {
            messageText = '[sent a document]';
        } else if (message.animation) {
            messageText = '[sent a GIF]';
        } else {
            // 完全没有内容，跳过
            return;
        }
    }

    // 构造缓存消息对象
    const cachedMessage: GroupCachedMessage = {
        messageId: message.message_id,
        userId: message.from?.id || 0,
        username: message.from?.username,
        firstName: message.from?.first_name,
        lastName: message.from?.last_name,
        text: messageText,
        timestamp: message.date * 1000, // Telegram 使用秒，转换为毫秒
        messageType: message.photo ? 'photo' : message.voice ? 'voice' : message.audio ? 'audio' : 'text',
    };

    try {
        // 获取现有缓存
        const existingCache = await ENV.DATABASE.get(cacheKey);
        let messages: GroupCachedMessage[] = existingCache ? JSON.parse(existingCache) : [];

        // 手动实现 TTL：过滤掉过期的消息
        // 这对于不支持原生 TTL 的数据库（如 sqlite）很重要
        const now = Date.now();
        const ttlMs = ENV.GROUP_MESSAGE_CACHE_TTL * 1000;
        messages = messages.filter(msg => (now - msg.timestamp) < ttlMs);

        // 添加新消息到缓存
        messages.push(cachedMessage);

        // 保留最近的 N 条消息
        if (messages.length > ENV.GROUP_MESSAGE_CACHE_SIZE) {
            messages = messages.slice(-ENV.GROUP_MESSAGE_CACHE_SIZE);
        }

        // 保存回数据库，设置过期时间
        // 注意：expirationTtl 仅对 Cloudflare KV 和 Redis 有效
        // 对于 sqlite/local，依赖上面的手动过滤逻辑
        await ENV.DATABASE.put(cacheKey, JSON.stringify(messages), {
            expirationTtl: ENV.GROUP_MESSAGE_CACHE_TTL,
        });

        log.info(`[GROUP CACHE] Cached message in group ${chatId}, total: ${messages.length}/${ENV.GROUP_MESSAGE_CACHE_SIZE}`);
    } catch (error) {
        log.error(`[GROUP CACHE] Failed to cache message: ${(error as Error).message}`);
    }
}

/**
 * 加载群组消息缓存
 */
export async function loadGroupMessageCache(chatId: number | string): Promise<GroupCachedMessage[]> {
    if (!ENV.GROUP_MESSAGE_LISTEN_MODE) {
        return [];
    }

    const cacheKey = getGroupMessageCacheKey(chatId);

    try {
        const cache = await ENV.DATABASE.get(cacheKey);
        if (!cache) {
            return [];
        }

        let messages: GroupCachedMessage[] = JSON.parse(cache);

        // 手动过滤过期消息（对于不支持原生 TTL 的数据库）
        const now = Date.now();
        const ttlMs = ENV.GROUP_MESSAGE_CACHE_TTL * 1000;
        messages = messages.filter(msg => (now - msg.timestamp) < ttlMs);

        log.info(`[GROUP CACHE] Loaded ${messages.length} cached messages from group ${chatId}`);
        return messages;
    } catch (error) {
        log.error(`[GROUP CACHE] Failed to load cache: ${(error as Error).message}`);
        return [];
    }
}

/**
 * 将缓存的群组消息格式化为上下文字符串
 */
export function formatGroupCacheAsContext(messages: GroupCachedMessage[]): string {
    if (messages.length === 0) {
        return '';
    }

    const contextLines: string[] = ['=== Recent Group Messages ==='];

    for (const msg of messages) {
        let userIdentifier = '';
        if (msg.username) {
            userIdentifier = `@${msg.username}`;
        } else if (msg.lastName) {
            userIdentifier = `${msg.firstName} ${msg.lastName}`;
        } else {
            userIdentifier = msg.firstName || 'Unknown';
        }
        userIdentifier += ` (ID:${msg.userId})`;

        const time = new Date(msg.timestamp).toISOString().substring(11, 19); // HH:MM:SS
        contextLines.push(`[${time}] ${userIdentifier}: ${msg.text}`);
    }

    contextLines.push('=== End of Recent Messages ===\n');
    return contextLines.join('\n');
}

function checkMention(content: string, entities: Telegram.MessageEntity[], botName: string, botId: number): {
    isMention: boolean;
    content: string;
} {
    let isMention = false;
    for (const entity of entities) {
        const entityStr = content.slice(entity.offset, entity.offset + entity.length);
        switch (entity.type) {
            case 'mention': // "mention"适用于有用户名的普通用户
                if (entityStr === `@${botName}`) {
                    isMention = true;
                    content = content.slice(0, entity.offset) + content.slice(entity.offset + entity.length);
                }
                break;
            case 'text_mention': // "text_mention"适用于没有用户名的用户或需要通过ID提及用户的情况
                if (`${entity.user?.id}` === `${botId}`) {
                    isMention = true;
                    content = content.slice(0, entity.offset) + content.slice(entity.offset + entity.length);
                }
                break;
            case 'bot_command': // "bot_command"适用于命令
                if (entityStr.endsWith(`@${botName}`)) {
                    isMention = true;
                    const newEntityStr = entityStr.replace(`@${botName}`, '');
                    content = content.slice(0, entity.offset) + newEntityStr + content.slice(entity.offset + entity.length);
                }
                break;
            default:
                break;
        }
    }
    return {
        isMention,
        content,
    };
}

/**
 * 处理替换词
 *
 * @param {Telegram.Message} message
 * @returns {boolean} 如果找到触发词，返回 true；否则 false
 */
export function CheckTrigger(message: Telegram.Message): boolean {
    // 旧的触发逻辑
    const oldTrigger = ENV.CHAT_MESSAGE_TRIGGER;
    if (Object.keys(oldTrigger).length > 0) {
        const triggered = Object.entries(oldTrigger).find(([key, _value]) => message.text?.startsWith(key));
        if (triggered) {
            message.text && (message.text = triggered[1] + message.text.substring(triggered[0].length));
            message.caption && (message.caption = triggered[1] + message.caption.substring(triggered[0].length));
            return true;
        } else {
            return false;
        }
    }

    const textBefore = message.text || message.caption || '';
    const text = textBefore.replace(new RegExp(`^${ENV.CHAT_TRIGGER_PREFIX}`), '');
    message.text = text;
    return text !== textBefore;
}

export class GroupMention implements MessageHandler {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        const isTriggered = CheckTrigger(message);

        // 非群组消息不作判断，交给下一个中间件处理
        if (!isTelegramChatTypeGroup(message.chat.type)) {
            return this.noneMessage(message, context);
        }

        // 在检查触发之前，先缓存所有群组消息（如果启用了监听模式）
        await cacheGroupMessage(message, context);

        // 处理回复消息, 如果回复的是当前机器人的消息交给下一个中间件处理
        const replyMe = `${message.reply_to_message?.from?.id}` === `${context.SHARE_CONTEXT.botId}`;
        if (replyMe) {
            if (context.SHARE_CONTEXT.botName && message.text?.endsWith(`@${context.SHARE_CONTEXT.botName}`)) {
                message.text = message.text.slice(0, -context.SHARE_CONTEXT.botName.length - 1);
            }
            return null;
        }

        // 处理群组消息，过滤掉AT部分
        let botName = context.SHARE_CONTEXT.botName;
        if (!botName) {
            const res = await createTelegramBotAPI(context.SHARE_CONTEXT.botToken).getMeWithReturns();
            botName = res.result.username || null;
            context.SHARE_CONTEXT.botName = botName;
        }
        if (!botName) {
            throw new Error('Not set bot name');
        }
        let isMention = false;
        // 检查text中是否有机器人的提及
        if (message.text && message.entities) {
            const res = checkMention(message.text, message.entities, botName, context.SHARE_CONTEXT.botId);
            isMention = res.isMention;
            message.text = res.content.trim();
        }
        // 检查caption中是否有机器人的提及
        if (message.caption && message.caption_entities) {
            const res = checkMention(message.caption, message.caption_entities, botName, context.SHARE_CONTEXT.botId);
            isMention = res.isMention || isMention;
            message.caption = res.content.trim();
        }
        // substituteMention
        if (isTriggered && !isMention) {
            isMention = true;
        }

        // If this is part of a media group that was already triggered, allow it through
        if (!isMention && message.media_group_id) {
            const storeMediaMessageKey = context.SHARE_CONTEXT?.storeMediaMessageKey;
            if (storeMediaMessageKey) {
                const data: Record<string, string[]> = JSON.parse(await ENV.DATABASE.get(storeMediaMessageKey) || '{}');
                // If this media_group_id already has stored images, it means a triggered message already passed
                if (data[message.media_group_id] && data[message.media_group_id].length > 0) {
                    log.info(`[GROUP MENTION] Allowing media group ${message.media_group_id} image without trigger (part of triggered group)`);
                    isMention = true;
                }
            }
        }

        if (!isMention) {
            // 消息未触发，但已被缓存，直接返回
            return new Response('Not mention');
        }

        return this.noneMessage(message, context);
    };

    noneMessage = async (message: Telegram.Message, context: WorkerContext) => {
        const messageInfo = context.MIDDLE_CONTEXT.messageInfo;
        if (messageInfo.type === 'text' && message.text === '' && (message.reply_to_message?.text ?? '') === '') {
            const resp = createTelegramBotAPI(context.SHARE_CONTEXT.botToken).sendMessage({
                chat_id: message.chat.id,
                text: '?',
            });
            return checkIsNeedTagIds({ chatType: message.chat.type, message }, resp, 'chat');
        }
        return null;
    };
}

// async function chunkMessageCheck(message: Telegram.Message, context: WorkerContext, isMention: boolean) {
//     const chunkMessageKeyPrefix = context.SHARE_CONTEXT?.chunkMessageKeyPrefix;
//     if (!chunkMessageKeyPrefix) {
//         return isMention;
//     }

//     const textFragmentThreshold = 4000;
//     // 第一条消息直接缓存
//     if (isMention && (message.text || '')?.length > textFragmentThreshold) {
//         return chunkMessageStore(message, chunkMessageKeyPrefix);
//     }
//     // polling模式下同时接收多条消息 等待100ms后读取
//     await new Promise(resolve => setTimeout(resolve, 50));
//     const checkAnyChunkMessage = await ENV.DATABASE.list(`${chunkMessageKeyPrefix}:*`);
//     if (checkAnyChunkMessage.length > 0) {
//         if ((message.text || '')?.length > textFragmentThreshold) {
//             return chunkMessageStore(message, chunkMessageKeyPrefix);
//         }
//         // 防止过快读取
//         await new Promise(resolve => setTimeout(resolve, 100));
//         const messageKeys = await ENV.DATABASE.list(`${chunkMessageKeyPrefix}:*`);
//         if (messageKeys.length > 0) {
//             const chunks = await ENV.DATABASE.get(messageKeys.sort());
//             if (chunks.length > 0) {
//                 message.text = chunks.join('') + message.text;
//                 log.info(`[CHUNK MESSAGE] Merged message chunk, text: ${message.text}`);
//             }
//         }
//         return true;
//     }
//     return isMention;

//     async function chunkMessageStore(message: Telegram.Message, chunkMessageKeyPrefix: string) {
//         log.info(`[CHUNK MESSAGE] Stored message chunk, message_id: ${message.message_id}`);
//         return ENV.DATABASE.put(`${chunkMessageKeyPrefix}:${message.message_id}`, message.text!, { expirationTtl: 5 });
//     }
// }
