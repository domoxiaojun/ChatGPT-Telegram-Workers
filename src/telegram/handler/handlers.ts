import type * as Telegram from 'telegram-bot-api-types';
import type { WorkerContextBase } from '../../config/context';
import type { UnionData } from '../utils/utils';
import type { MessageHandler } from './types';
import { WorkerContext } from '../../config/context';
import { ENV } from '../../config/env';
import { sentMessageIds } from '../../extra/log/logDecortor';
import { log } from '../../extra/log/logger';
import { handleCommandMessage } from '../command';
import { MessageSender } from '../utils/send';
import { extractMessage, isTelegramChatTypeGroup } from '../utils/utils';

export class SaveLastMessage implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        if (!ENV.DEBUG_MODE) {
            return null;
        }
        const lastMessageKey = `last_message:${context.SHARE_CONTEXT.chatHistoryKey}`;
        await ENV.DATABASE.put(lastMessageKey, JSON.stringify(message), { expirationTtl: 3600 });
        return null;
    };
}

export class OldMessageFilter implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        if (!ENV.SAFE_MODE) {
            return null;
        }
        let idList = [];
        try {
            idList = JSON.parse(await ENV.DATABASE.get(context.SHARE_CONTEXT.lastMessageKey).catch(() => '[]')) || [];
        } catch (e) {
            console.error(e);
        }
        // 保存最近的100条消息，如果存在则忽略，如果不存在则保存
        if (idList.includes(message.message_id)) {
            throw new Error('Ignore old message');
        } else {
            idList.push(message.message_id);
            if (idList.length > 100) {
                idList.shift();
            }
            await ENV.DATABASE.put(context.SHARE_CONTEXT.lastMessageKey, JSON.stringify(idList));
        }
        return null;
    };
}

export class EnvChecker implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        if (!ENV.DATABASE) {
            return MessageSender
                .from(context.SHARE_CONTEXT.botToken, message)
                .sendPlainText('DATABASE Not Set');
        }
        return null;
    };
}

export class WhiteListFilter implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        if (ENV.I_AM_A_GENEROUS_PERSON) {
            return null;
        }
        const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
        const text = `You are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${message.chat.id}`;

        // 判断私聊消息
        if (message.chat.type === 'private') {
            // 白名单判断
            if (!ENV.CHAT_WHITE_LIST.includes(`${message.chat.id}`)) {
                return sender.sendPlainText(text);
            }
            return null;
        }

        // 判断群组消息
        if (isTelegramChatTypeGroup(message.chat.type)) {
            // 未打开群组机器人开关,直接忽略
            if (!ENV.GROUP_CHAT_BOT_ENABLE) {
                throw new Error('Not support');
            }
            // 白名单判断
            if (!ENV.CHAT_GROUP_WHITE_LIST.includes(`${message.chat.id}`)) {
                return sender.sendPlainText(text);
            }
            return null;
        }

        return sender.sendPlainText(
            `Not support chat type: ${message.chat.type}`,
        );
    };
}

export class MessageFilter implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        const extractMessageData = extractMessage(message, context.SHARE_CONTEXT.botId);
        if (extractMessageData === null) {
            throw new Error('Not supported message type');
        };
        context.MIDDEL_CONTEXT.originalMessage = extractMessageData;
        return null;
    };
}

export class CommandHandler implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | UnionData | null> => {
        if (message.text || message.caption) {
            return await handleCommandMessage(message, context);
        }
        // 非文本消息不作处理
        return null;
    };
}

export class InitUserConfig implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        Object.assign(context, { USER_CONFIG: (await WorkerContext.from(context.SHARE_CONTEXT, context.MIDDEL_CONTEXT)).USER_CONFIG });
        return null;
    };
}

export class StoreHistory implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
        if (!historyDisable) {
            const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
            const history = context.MIDDEL_CONTEXT.history;
            const userMessage = history.findLast(h => h.role === 'user');
            if (ENV.HISTORY_IMAGE_PLACEHOLDER && userMessage?.images && userMessage.images.length > 0) {
                delete userMessage.images;
                userMessage.content = `${ENV.HISTORY_IMAGE_PLACEHOLDER}\n${userMessage.content}`;
            }
            await ENV.DATABASE.put(historyKey, JSON.stringify(history)).catch(console.error);
        }
        return null;
    };
}

export class TagNeedDelete implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        // 未记录消息
        if (!sentMessageIds.get(message) || sentMessageIds.get(message)?.length === 0)
            return new Response('success', { status: 200 });
        const botName = context.SHARE_CONTEXT?.botName;
        if (!botName) {
            throw new Error('未检索到Bot Name, 无法设定定时删除.');
        }

        const chatId = message.chat.id;
        const scheduleDeteleKey = context.SHARE_CONTEXT.scheduleDeteleKey;
        const scheduledData = JSON.parse((await ENV.DATABASE.get(scheduleDeteleKey)) || '{}');
        if (!scheduledData[botName]) {
            scheduledData[botName] = {};
        }
        if (!scheduledData[botName][chatId]) {
            scheduledData[botName][chatId] = [];
        }
        const offsetInMillisenconds = ENV.EXPIRED_TIME * 60 * 1000;
        scheduledData[botName][chatId].push({
            id: sentMessageIds.get(message) || [],
            ttl: Date.now() + offsetInMillisenconds,
        });

        await ENV.DATABASE.put(scheduleDeteleKey, JSON.stringify(scheduledData));
        log.info(`Record chat ${chatId}, message ids: ${sentMessageIds.get(message) || []}`);

        return new Response('success', { status: 200 });
    };
}

export class StoreWhiteListMessage implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        const storeMessageKey = context.SHARE_CONTEXT?.storeMessageKey;
        if (storeMessageKey) {
            const data: UnionData[] = JSON.parse(await ENV.DATABASE.get(storeMessageKey) || '[]');
            data.push(context.MIDDEL_CONTEXT.originalMessage);
            if (data.length > ENV.STORE_MESSAGE_NUM) {
                data.splice(0, data.length - ENV.STORE_MESSAGE_NUM);
            }
            await ENV.DATABASE.put(storeMessageKey, JSON.stringify(data));
        }
        return new Response('ok');
    };
}

// TODO 处理内联消息
// export class InlineMessageHandler implements MessageHandler<WorkerContext> {
//     handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
//         if (message.inline_query) {
//             return await handleInlineQuery(message, context);
//         }
//         return null;
//     };
// }
