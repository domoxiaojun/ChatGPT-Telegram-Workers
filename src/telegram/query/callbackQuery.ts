import type * as Telegram from 'telegram-bot-api-types';
import type { AgentUserConfig, WorkerContext } from '../../config/types';
import type { TelegramBotAPI } from '../api';
import type { InlineItem } from '../command/types';
import type { MessageHandler } from '../handler/types';
import type { CallbackQueryHandler } from './types';
import { WorkerContextBase } from '../../config/context';
import { ENV } from '../../config/env';
import { log } from '../../log/logger';
import { createTelegramBotAPI } from '../api';
import { InlineCommandHandler } from '../command/system';
import { catchError } from '../handler';
import { EnvChecker, InitUserConfig } from '../handler/handlers';
import { escape } from '../utils/md2tgmd';
import { chunkArray } from '../utils/utils';
import { CallbackQueryContext } from './context';

class HandlerCallbackQuery implements CallbackQueryHandler<CallbackQueryContext> {
    handle = async (query: Telegram.CallbackQuery, context: CallbackQueryContext): Promise<Response | null> => {
        if (!query.data || !(query.message as Telegram.Message)?.reply_markup) {
            return new Response('success', { status: 200 });
        }

        if (query.data.startsWith(query.from.id.toString()) || query.data.startsWith('PAGE_INDEX:')) {
            return new Response('success', { status: 200 });
        }

        const message = query.message as Telegram.Message;
        const keyboard = message.reply_markup?.inline_keyboard ?? [];
        const api = createTelegramBotAPI(context.SHARE_CONTEXT.botToken);

        // const authorized = isAuthorized(query.from?.id ?? 0, keyboard);
        // if (!authorized) {
        //     log.error(`[CALLBACK QUERY] User ${context.from.first_name}, id: ${context.from.id} not in the white list`);
        //     return this.sendAlert(api, context.query_id, `⚠️ You don't have permission to operate`, true);
        // }
        if (query.data === 'CLOSE') {
            return this.closeInlineKeyboard(api, message);
        }
        // 移除set
        const pathData = keyboard[0]?.[0]?.callback_data?.replace(':set', '');
        const path = pathData ? pathData.split('.').map(Number) : [query.from.id];

        (query.data === 'BACK') && path.pop();
        const queryHandler = new InlineCommandHandler();
        let data = queryHandler.defaultInlines(context.USER_CONFIG);
        let currentLevel;
        for (const i of path.slice(1)) {
            currentLevel = data[i];
            if (!currentLevel) {
                throw new Error('Invalid path');
            }
            data = currentLevel.value as any[];
        }

        const [row = 5, col = 3] = ENV.CALLBACK_QUERY_RC.split('x').map(Number);
        const pageLength = row * col;
        const paging = (data: InlineItem[], pageInfo: string) => {
            let [pageIndex, pageNum] = [0, 1];
            if (pageLength < data.length) {
                pageNum = Math.ceil(data.length / pageLength);
                if (pageInfo) {
                    pageIndex = Number(pageInfo.slice('PAGE_INDEX:'.length));
                }
            }
            pageNum > 1 && (data = data.slice(pageIndex * pageLength, (pageIndex + 1) * pageLength));
            return { data, pageIndex, pageNum };
        };
        const checkCurrentLevel = (currentLevel: InlineItem | undefined) => {
            if (path.length === 1 || (path.length > 1 && currentLevel?.value)) {
                return;
            }
            throw new Error('Invalid inline key');
        };

        let [pageIndex, pageNum] = [0, 1];
        let callbackData;
        if (query.data !== 'BACK') {
            checkCurrentLevel(currentLevel);
            const pageInfo = keyboard.flat().find(i => i.callback_data?.startsWith('PAGE_INDEX:'))?.callback_data ?? '';
            ({ data, pageIndex, pageNum } = paging(data, pageInfo));
            callbackData = (Number.isNaN(Number(query.data)) ? query.data : Number(query.data));
            // 顶层或包含子选项
            if (!currentLevel?.config_key && typeof callbackData === 'number') {
                currentLevel = data[callbackData];
                checkCurrentLevel(currentLevel);
                path.push(callbackData);
                // 进入下一级
                ({ data, pageIndex, pageNum } = paging(currentLevel.value as InlineItem[], `PAGE_INDEX:${pageIndex}`));
            } else if (['prev', 'next'].includes(callbackData as string)) {
                pageIndex = callbackData === 'prev' ? pageIndex - 1 : pageIndex + 1;
                ({ data, pageIndex, pageNum } = paging(currentLevel?.value as InlineItem[], `PAGE_INDEX:${pageIndex}`));
            } else if (currentLevel?.config_key) {
                await this.updateConfig(context, api, currentLevel, callbackData as number);
            }
        }
        if ((currentLevel?.config_key && currentLevel?.config_key !== 'ENVS') || query.data === 'BACK') {
            callbackData = undefined;
        }
        let inlineKeyboard: Telegram.InlineKeyboardButton[][] = [];
        inlineKeyboard = this.constructInlineList(
            {
                path,
                data,
                pageIndex,
                pageNum,
                col,
                label: currentLevel?.label,
                key: currentLevel?.config_key,
                config: context.USER_CONFIG,
                callbackData: callbackData ?? '',
            },
        );
        const settingMessage = queryHandler.settingsMessage(context.USER_CONFIG, queryHandler.defaultInlines(context.USER_CONFIG), {
            key: currentLevel?.config_key,
            callBack: typeof callbackData === 'number' ? data[callbackData] : undefined,
        });

        return this.sendCallBackMessage(api, message, settingMessage, inlineKeyboard);
    };

    // private async checkInlineKey(api: TelegramBotAPI, context: CallbackQueryContext, key: string, index: string, inlineKeys: Record<string, any>) {
    //     if (key === 'BACK') {
    //         return;
    //     }
    //     if ((index && inlineKeys[key]?.available.value?.[index]) || (!index && inlineKeys[key])) {
    //         return;
    //     }
    //     this.sendAlert(api, context.query_id, 'Not support inline key', false);
    //     throw new Error('Not support inline key');
    // }

    private async sendAlert(api: TelegramBotAPI, query_id: string, text: string, show_alert?: boolean, cache_time?: number) {
        return api.answerCallbackQuery({
            callback_query_id: query_id,
            text,
            show_alert,
            cache_time,
        });
    }

    private async updateConfig(context: CallbackQueryContext, api: TelegramBotAPI, level: InlineItem, index: number) {
        if (level.config_key === 'ENVS') {
            return;
        }
        const oldValue = context.USER_CONFIG[level.config_key];
        const newValue = level.value[index];
        const type = Array.isArray(oldValue) ? 'array' : typeof oldValue;
        switch (type) {
            case 'string':
            case 'boolean':
            case 'undefined':
                if (oldValue === newValue) {
                    return;
                } else {
                    context.USER_CONFIG[level.config_key] = newValue;
                }
                break;
            case 'array':
                if (oldValue.includes(newValue)) {
                    oldValue.splice(oldValue.indexOf(newValue), 1);
                } else {
                    oldValue.push(newValue);
                }
                break;
            default:
                throw new TypeError('Not support config type');
        }

        if (!context.USER_CONFIG.DEFINE_KEYS.includes(level.config_key)) {
            context.USER_CONFIG.DEFINE_KEYS.push(level.config_key);
        }
        log.info(`[CALLBACK QUERY] Update config: ${level.config_key} = ${context.USER_CONFIG[level.config_key]}`);
        await ENV.DATABASE.put(context.SHARE_CONTEXT.configStoreKey, JSON.stringify(context.USER_CONFIG)).catch(console.error);
        this.sendAlert(api, context.query_id, '✅ Data update successful', false);
    }

    private async closeInlineKeyboard(api: TelegramBotAPI, message: Telegram.Message) {
        return api.deleteMessage({
            chat_id: message.chat.id,
            message_id: message.message_id,
        }).then(r => r.json());
    }

    private async sendCallBackMessage(api: TelegramBotAPI, message: Telegram.Message, text: string, inline_keyboard: Telegram.InlineKeyboardButton[][]) {
        return api.editMessageText({
            chat_id: message.chat.id,
            message_id: message.message_id,
            ...(message.chat.type === 'private' ? {} : { reply_to_message_id: message.message_id }),
            text: escape(text),
            parse_mode: 'MarkdownV2',
            reply_markup: { inline_keyboard },
        });
    }

    private constructInlineList({ path, data, label, key, config, callbackData, pageIndex, pageNum, col }: { path: number[]; data: (string | InlineItem)[]; label?: string; key?: string; config: AgentUserConfig; callbackData: number | string; pageIndex: number; pageNum: number; col: number }): Telegram.InlineKeyboardButton[][] {
        const isSelected = (item: string | InlineItem, index: number) => {
            if ((typeof callbackData === 'number' && callbackData === index)
                || (key && key !== 'ENVS' && (config[key] === item || (Array.isArray(config[key]) && config[key]?.includes(item))))) {
                return '✅';
            }
            return '';
        };
        let inlineList: Telegram.InlineKeyboardButton[] = [];
        if (path.length > 1 && key) {
            inlineList = data.map((item, index) => ({
                text: `${isSelected(item, index)}${key ? item as string : ''}`,
                callback_data: index.toString(),
            }));
        } else {
            inlineList = data.map((item, index) => ({
                text: (item as InlineItem).label,
                callback_data: index.toString(),
            }));
        }

        const realCol = path.length === 1 || key === '' ? 3 : col;

        const chunkedList = chunkArray(inlineList, realCol) as Telegram.InlineKeyboardButton[][];
        chunkedList.unshift([{
            text: `请选择 ${label ?? '需要配置的选项'}`,
            callback_data: path.join('.') + (key === 'ENVS' ? ':set' : ''),
        }]);

        const page: Telegram.InlineKeyboardButton[] = [];
        if (pageNum > 1) {
            if (pageIndex > 0) {
                page.push({
                    text: 'prev',
                    callback_data: `prev`,
                });
            }
            page.push({
                text: `${pageIndex + 1} / ${pageNum}`,
                callback_data: `PAGE_INDEX:${pageIndex}`,
            });
            if (pageIndex < pageNum - 1) {
                page.push({
                    text: 'next',
                    callback_data: `next`,
                });
            }
            chunkedList.push(page);
        }

        const footer: Telegram.InlineKeyboardButton[] = [];
        footer.push({
            text: '❌',
            callback_data: 'CLOSE',
        });
        if (path.length > 1) {
            footer.unshift({
                text: '↩️',
                callback_data: 'BACK',
            });
        }
        chunkedList.push(footer);

        return chunkedList;
    }
}

export async function handleCallbackQuery(token: string, callbackQuery: Telegram.CallbackQuery) {
    try {
        log.info('handleCallbackQuery');
        const message = callbackQuery.message as Telegram.Message;
        if (!message?.reply_markup || !callbackQuery.data) {
            throw new Error('Not supported callback query type');
        }

        if (!isAuthorized(callbackQuery.from?.id ?? 0, message.reply_markup.inline_keyboard)) {
            return new Response('Not authorized', { status: 403 });
        }

        const workContext = new WorkerContextBase(token, message);

        const handlers: MessageHandler<any>[] = [
            new EnvChecker(),
            new InitUserConfig(),
        ];
        for (const handler of handlers) {
            const result = await handler.handle(message, workContext);
            if (result instanceof Response) {
                return result;
            }
        }

        const callbackQueryContext = new CallbackQueryContext(callbackQuery, workContext as WorkerContext);
        const result = await new HandlerCallbackQuery().handle(callbackQuery, callbackQueryContext);
        if (result instanceof Response) {
            return result;
        }
    } catch (e) {
        return catchError(e as Error);
    }
    return null;
}

export function isAuthorized(fromId: number, inline_keyboard: Array<Array<Telegram.InlineKeyboardButton>>) {
    const [id, _] = (inline_keyboard?.[0]?.[0]?.callback_data ?? '').split('.');
    const authorizedId = [id, ...ENV.CHAT_WHITE_LIST];
    return authorizedId.includes(fromId.toString());
}
