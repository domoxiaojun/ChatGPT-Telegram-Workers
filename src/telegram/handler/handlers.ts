import type * as Telegram from 'telegram-bot-api-types';
import type { WorkerContextBase } from '../../config/context';
import type { UnionData } from '../utils/tg_utils';
import type { MessageHandler } from './types';
import { WorkerContext } from '../../config/context';
import { ENV } from '../../config/env';
import { tagMessageIds } from '../../log/logDecortor';
import { log } from '../../log/logger';
import { Rerank } from '../../utils/data_calculation/rerank';
import { createTelegramBotAPI } from '../api';
import { handleCommandMessage } from '../command';
import { isAuthorized } from '../query';
import { MessageSender } from '../utils/send';
import { extractMessageInfo, isTelegramChatTypeGroup } from '../utils/tg_utils';
import { substituteMessage } from './replacer';

export class SaveLastMessage implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        if (!ENV.DEBUG_MODE) {
            return null;
        }
        const lastMessageKey = `last_message:${context.SHARE_CONTEXT.chatHistoryKey}`;
        await ENV.DATABASE.put(lastMessageKey, JSON.stringify(message));
        return null;
    };
}

export class OldMessageFilter implements MessageHandler<WorkerContextBase> {
    handle = async (message: Telegram.Message, context: WorkerContextBase): Promise<Response | null> => {
        if (!ENV.SAFE_MODE || context.SHARE_CONTEXT.isForwarding) {
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
                // return sender.sendPlainText(text);
                log.error(`[WHITE LIST] ${message.chat.id} not in white list`);
                return new Response('success', { status: 200 });
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
        if (ENV.IGNORE_TEXT_PREFIX && (message.text || message.caption || '').startsWith(ENV.IGNORE_TEXT_PREFIX)) {
            log.info(`[IGNORE MESSAGE] Ignore message`);
            return new Response('success', { status: 200 });
        }
        const messageInfo = extractMessageInfo(message, context.SHARE_CONTEXT.botId);
        const supportMessageType = ENV.ENABLE_FILE === false ? ['text'] : ENV.SUPPORT_FORMAT;
        const types = [messageInfo.original_type, messageInfo.type];
        if (!types.every(type => supportMessageType.includes(type!))) {
            log.error(`[MESSAGE FILTER] Not supported message type: ${types.join(', ')}`);
            return new Response('success', { status: 200 });
        }
        context.MIDDLE_CONTEXT.messageInfo = messageInfo;
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
        Object.assign(context, { USER_CONFIG: (await WorkerContext.from(context.SHARE_CONTEXT, context.MIDDLE_CONTEXT)).USER_CONFIG });

        // 兼容旧的DROPS_OPENAI_PARAMS
        const paramsModifier = new Set((context as WorkerContext).USER_CONFIG.PARAMS_MODIFIER);
        for (const [model, params] of Object.entries((context as WorkerContext).USER_CONFIG.DROPS_OPENAI_PARAMS)) {
            paramsModifier.add(`${model}:${params.split(',').map(param => `-${param}`).join('|')}`);
        }
        (context as WorkerContext).USER_CONFIG.PARAMS_MODIFIER = Array.from(paramsModifier);
        return null;
    };
}

export class SubstituteHandler implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        if (context.USER_CONFIG.MESSAGE_REPLACER && (message.text || message.caption)) {
            substituteMessage(message, context.USER_CONFIG.MESSAGE_REPLACER);
        }
        return null;
    };
}

export class TagNeedDelete implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        // 未记录消息
        if ((tagMessageIds.get(message) ?? new Set()).size === 0) {
            log.info(`[TAG MESSAGE] No message id to tag`);
            return null;
        }
        const botName = context.SHARE_CONTEXT?.botName;
        if (!botName) {
            throw new Error('Cannot find Bot Name, cannot set scheduled deletion.');
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
            id: [...(tagMessageIds.get(message) || [])],
            ttl: Date.now() + offsetInMillisenconds,
        });

        await ENV.DATABASE.put(scheduleDeteleKey, JSON.stringify(scheduledData));
        log.info(`[TAG MESSAGE] Record chat ${chatId}, message ids: ${[...(tagMessageIds.get(message) || [])]}`);
        return null;
    };
}

export class CheckForwarding implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        if (ENV.QSTASH_PUBLISH_URL && ENV.QSTASH_TOKEN && ENV.QSTASH_TRIGGER_PREFIX && !context.SHARE_CONTEXT.isForwarding) {
            let text = (message.text || message.caption || '').trim();
            if (text.startsWith(ENV.QSTASH_TRIGGER_PREFIX)) {
                text = text.slice(ENV.QSTASH_TRIGGER_PREFIX.length);
                if (message.text) {
                    message.text = text;
                } else {
                    message.caption = text;
                }
                const QSTASH_REQUEST_URL = `${ENV.QSTASH_URL}/v2/publish/${ENV.QSTASH_PUBLISH_URL}/telegram/${context.SHARE_CONTEXT.botToken}/webhook`;
                log.info(`[FORWARD] Forward message to Qstash`);
                const sender = MessageSender.from(context.SHARE_CONTEXT.botToken, message);
                await sender.sendRichText('`Forwarding message to Qstash`', 'MarkdownV2', 'tip');
                return await fetch(QSTASH_REQUEST_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ENV.QSTASH_TOKEN}`,
                        'Upstash-Timeout': `${ENV.QSTASH_TIMEOUT}`,
                        // no retry
                        'Upstash-Retries': '0',
                    },
                    body: JSON.stringify({
                        message,
                    }),
                });
            }
        }
        return null;
    };
}

export class IntelligentModelProcess implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        const agentModelKey = `${context.USER_CONFIG.AI_CHAT_PROVIDER.toUpperCase()}_MODELS`;
        const models = context.USER_CONFIG[agentModelKey] || [];
        if (models.length === 0) {
            return null;
        }
        const regex = /^\s*\/\/([cvts])\s*(\S+)/;
        const text = new RegExp(regex).exec((message.text || message.caption || '').trim());
        if (text?.[1] && text[2]) {
            const rerank = new Rerank();
            const sendTipPromise = this.sendTip(context, message);
            try {
                const similarityModel = (await rerank.rank(context.USER_CONFIG, [text[2], ...models], 1))[0].value;
                if (!similarityModel) {
                    return this.editTip(context, (await sendTipPromise).result, 'No similarity model found');
                }
                log.info(`[INTELLIGENT MODEL] find similarity model: ${similarityModel}`);
                const mode = text[1];
                let textReplace = `/set `;
                switch (mode) {
                    case 'c':
                        textReplace += `-CHAT_MODEL`;
                        break;
                    case 'v':
                        textReplace += `-VISION_MODEL`;
                        break;
                    case 't':
                        textReplace += `-TOOL_MODEL`;
                        break;
                    case 's':
                        textReplace += `-TTS_MODEL`;
                        break;
                }
                textReplace += ` ${similarityModel}`;
                if (message.text) {
                    message.text = textReplace + message.text.slice(text[0].length);
                } else if (message.caption) {
                    message.caption = textReplace + message.caption.slice(text[0].length);
                }
                this.deleteTip(context, (await sendTipPromise).result);
            } catch (error) {
                return this.editTip(context, (await sendTipPromise).result, (error as Error).message, 'Error');
            }
        }
        return null;
    };

    sendTip = (context: WorkerContext, message: Telegram.Message) => {
        const tip = 'Searching for similarity result...';
        const sendeParams: Telegram.SendMessageParams = {
            chat_id: message.chat.id,
            text: tip,
            message_thread_id: message.is_topic_message && message.message_thread_id ? message.message_thread_id : undefined,
            entities: [{
                type: 'italic',
                offset: 0,
                length: tip.length,
            }],
        };
        return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).sendMessageWithReturns(sendeParams);
    };

    deleteTip = (context: WorkerContext, message: Telegram.Message) => {
        const delParams: Telegram.DeleteMessageParams = {
            message_id: message.message_id,
            chat_id: message.chat.id,
        };
        log.info('delete similarity tip.');
        return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).deleteMessage(delParams);
    };

    editTip = async (context: WorkerContext, message: Telegram.Message, tip: string, type = 'Tip') => {
        const editParams: Telegram.EditMessageTextParams = {
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: tip,
            entities: [{
                type: 'pre',
                offset: 0,
                length: tip.length,
                language: type,
            }],
        };
        return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).editMessageText(editParams);
    };
}

export class ReplyInlineHandler implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        const isMyInlineSetMessage = this.isMyInlineSetMessage(message, context);
        const authorized = isAuthorized(message?.from?.id ?? 0, message.reply_to_message?.reply_markup?.inline_keyboard ?? []);
        if (isMyInlineSetMessage && authorized) {
            const inlineKeyboard = message.reply_to_message!.reply_markup!.inline_keyboard.flat();
            const variable = inlineKeyboard.find(i => i.text.startsWith('✅'))?.text.split('✅')[1];
            if (variable) {
                message.text = `/set -${variable} ${message.text}`;
            } else {
                return createTelegramBotAPI(context.SHARE_CONTEXT.botToken).sendMessage({
                    chat_id: message.chat.id,
                    text: '```Tip\n选中变量后再进行回复\n```',
                    parse_mode: 'MarkdownV2',
                });
            }
        }
        return null;
    };

    isMyInlineSetMessage = (message: Telegram.Message, context: WorkerContext) => {
        const isMyMessage = message.reply_to_message?.from?.id === Number(context.SHARE_CONTEXT.botId);
        const isInlineSetMessage = (message.reply_to_message?.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data ?? '').endsWith(':set');
        return isMyMessage && isInlineSetMessage;
    };
}

export class MergeQuote implements MessageHandler<WorkerContext> {
    handle = async (message: Telegram.Message, context: WorkerContext): Promise<Response | null> => {
        const isReplyMe = message.reply_to_message?.from?.id === Number(context.SHARE_CONTEXT.botId);
        const quoteText = message.quote?.text || '';
        const replyText = message.reply_to_message?.text || message.reply_to_message?.caption || '';
        // 开启引用消息且
        // 不是回复bot且包含回复消息 或 是引用消息 则将回复/引用消息和当前消息合并
        if (ENV.EXTRA_MESSAGE_CONTEXT && ((!isReplyMe && replyText) || quoteText)) {
            message.text
                ? message.text += `\n${`> ${quoteText || replyText}`}`
                : message.caption += `\n${`> ${quoteText || replyText}`}`;
        }
        return null;
    };
}
