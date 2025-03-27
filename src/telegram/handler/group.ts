import type * as Telegram from 'telegram-bot-api-types';
import type { WorkerContext } from '../../config/context';
import type { MessageHandler } from './types';
import { ENV } from '../../config/env';
import { createTelegramBotAPI } from '../api';
import { checkIsNeedTagIds } from '../utils/send';
import { isTelegramChatTypeGroup } from '../utils/tg_utils';

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
    message.text ? message.text = text : message.caption = text;
    return text !== textBefore;
}

export class GroupMention implements MessageHandler {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        const isTriggered = CheckTrigger(message);
        // 非群组消息不作判断，交给下一个中间件处理
        if (!isTelegramChatTypeGroup(message.chat.type)) {
            const noneMessage = await this.noneMessage(message, context);
            if (noneMessage instanceof Response) {
                return noneMessage;
            }
            return null;
        }

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
        if (!isMention) {
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
