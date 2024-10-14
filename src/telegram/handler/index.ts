import type * as Telegram from 'telegram-bot-api-types';
import type { WorkerContext } from '../../config/context';
import type { MessageHandler } from './types';
import { WorkerContextBase } from '../../config/context';
import { clearLog, sentMessageIds } from '../../extra/log/logDecortor';
import { ChatHandler } from './chat';
import { GroupMention } from './group';
import {
    CommandHandler,
    EnvChecker,
    InitUserConfig,
    MessageFilter,
    OldMessageFilter,
    SaveLastMessage,
    StoreHistory,
    StoreWhiteListMessage,
    TagNeedDelete,
    WhiteListFilter,
} from './handlers';

function loadMessage(body: Telegram.Update): Telegram.Message {
    if (body.edited_message) {
        throw new Error('Ignore edited message');
    }
    if (body.message) {
        return body?.message;
    } else {
        throw new Error('Invalid message');
    }
}

// 消息处理中间件
const SHARE_HANDLER: MessageHandler<any>[] = [
    // 检查环境是否准备好: DATABASE
    new EnvChecker(),
    // 过滤非白名单用户, 提前过滤减少KV消耗
    new WhiteListFilter(),
    // 过滤不支持的消息(抛出异常结束消息处理)
    new MessageFilter(),
    // 处理群消息，判断是否需要响应此条消息
    new GroupMention(),
    // 忽略旧消息
    new OldMessageFilter(),
    // DEBUG: 保存最后一条消息,按照需求自行调整此中间件位置
    new SaveLastMessage(),
    // 初始化用户配置
    new InitUserConfig(),
    // 处理命令消息
    new CommandHandler(),
    // 与llm聊天
    new ChatHandler(),
    // 缓存历史记录
    new StoreHistory(),
];

const exitHanders: MessageHandler<any>[] = [new TagNeedDelete(), new StoreWhiteListMessage()];

export async function handleUpdate(token: string, update: Telegram.Update): Promise<Response | null> {
    // console.log(`[${new Date().toISOString()}]: handleUpdate: ${JSON.stringify(update.message?.chat)}`);
    const message = loadMessage(update);
    // 延迟初始化用户配置
    const context = new WorkerContextBase(token, message);
    try {
        for (const handler of SHARE_HANDLER) {
            const result = await handler.handle(message, context);
            if (result) {
                break;
            }
        }

        for (const handler of exitHanders) {
            const result = await handler.handle(message, context);
            if (result && result instanceof Response) {
                clearMessageIdsAndLog(message, context as WorkerContext);
                return result;
            }
        }
    } catch (e) {
        console.error((e as Error).message);
        return new Response(JSON.stringify({
            message: (e as Error).message,
            stack: (e as Error).stack,
        }), { status: 500 });
    } finally {
        clearMessageIdsAndLog(message, context as WorkerContext);
    }

    return null;
}

function clearMessageIdsAndLog(message: Telegram.Message, context: WorkerContext) {
    sentMessageIds.delete(message);
    clearLog(context.USER_CONFIG);
}
