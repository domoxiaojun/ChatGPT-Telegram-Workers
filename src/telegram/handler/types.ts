import type * as Telegram from 'telegram-bot-api-types';
import type { UnionData } from '../utils/utils';
// import type { ShareContext } from '../../config/context';

// 分离handler 仅shareContext
// export interface PreHandler {
//     handle: (message: Telegram.Message, context: { SHARE_CONTEXT: ShareContext }) => Promise<Response | null>;
// }

// 中间件定义 function (message: TelegramMessage, context: Context): Promise<Response|null>
// 1. 当函数抛出异常时，结束消息处理，返回异常信息
// 2. 当函数返回 Response 对象时，结束消息处理，返回 Response 对象
// 3. 当函数返回 null 时，继续下一个中间件处理
export interface MessageHandler<Ctx = any> {
    handle: (message: Telegram.Message, context: Ctx) => Promise<Response | UnionData | null>;
}

export interface InlineQueryHandler<Ctx = any> {
    handle: (inlineQuery: Telegram.InlineQuery, context: Ctx) => Promise<Response | UnionData | null>;
}

export interface CallbackQueryHandler<Ctx = any> {
    handle: (callbackQuery: Telegram.CallbackQuery, context: Ctx) => Promise<Response | UnionData | null>;
}
