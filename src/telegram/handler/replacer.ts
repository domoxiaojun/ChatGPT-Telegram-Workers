import type { Message } from 'telegram-bot-api-types';

export function substituteMessage(message: Message, replacer: Record<string, string>): void {
    let replacedString = '';
    let text = message.text || message.caption || '';
    do {
        const triggerKey = Object.keys(replacer).find(key =>
        // adjust the order of trigger words with the same prefix by yourself.
            text.trim().startsWith(key),
        );
        if (triggerKey) {
            text = text.replace(new RegExp(`(\\s*)${triggerKey}`), (_, p1) => {
                replacedString += `${p1}${replacer[triggerKey]}`;
                return '';
            });
            // remove the trigger key from replacer to avoid replace again
            delete replacer[triggerKey];
        } else {
            break;
        }
    } while (true);
    // log.info(`replacedString: ${replacedString || 'null'}, text: ${text}`);
    message.text ? (message.text = replacedString + text) : (message.caption = replacedString + text);
}
