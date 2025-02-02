import {CONST, DATABASE, ENV} from './env.js';
import {gpt3TokensCounter} from './vendors/gpt3.js';

/**
 * @param {number} length
 * @return {string}
 */
export function randomString(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

/**
 * @return {Promise<string>}
 */
export async function historyPassword() {
  let password = await DATABASE.get(CONST.PASSWORD_KEY);
  if (password === null) {
    password = randomString(32);
    await DATABASE.put(CONST.PASSWORD_KEY, password);
  }
  return password;
}


/**
 * @param {string} body
 * @return {string}
 */
export function renderHTML(body) {
  return `
<html>  
  <head>
    <title>ChatGPT-Telegram-Workers</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="ChatGPT-Telegram-Workers">
    <meta name="author" content="TBXark">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }
      p {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
      }
      a:hover {
        color: #0056b3;
        text-decoration: underline;
      }
      strong {
        font-weight: bolder;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
  `;
}

/**
 *
 * @param {Error} e
 * @return {string}
 */
export function errorToString(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack,
  });
}


/**
 * @param {object} config
 * @param {string} key
 * @param {string} value
 */
export function mergeConfig(config, key, value) {
  const type = typeof config[key];
  switch (type) {
    case 'number':
      config[key] = parseInt(value, 10);
      break;
    case 'boolean':
      config[key] = value === 'true';
      break;
    case 'string':
      config[key] = value;
      break;
    case 'object':
      const object = JSON.parse(value);
      if (typeof object === 'object') {
        config[key] = object;
        break;
      }
      throw new Error(ENV.I18N.utils.not_supported_configuration);
    default:
      throw new Error(ENV.I18N.utils.not_supported_configuration);
  }
}

/**
 * @return {Promise<(function(string): number)>}
 */
export async function tokensCounter() {
  let counter = (text) => Array.from(text).length;
  try {
    if (ENV.GPT3_TOKENS_COUNT) {
      const loader = async (key, url) => {
        try {
          const raw = await DATABASE.get(key);
          if (raw && raw !== '') {
            return raw;
          }
        } catch (e) {
          console.error(e);
        }
        try {
          const bpe = await fetchWithRetry(url, {
            headers: {
              'User-Agent': CONST.USER_AGENT,
            },
          }).then((x) => x.text());
          await DATABASE.put(key, bpe);
          return bpe;
        } catch (e) {
          console.error(e);
        }
        return null;
      };
      counter = await gpt3TokensCounter( ENV.GPT3_TOKENS_COUNT_REPO, loader);
    }
  } catch (e) {
    console.error(e);
  }
  return (text) => {
    try {
      return counter(text);
    } catch (e) {
      console.error(e);
      return Array.from(text).length;
    }
  };
}

/**
 *
 * @param {Response} resp
 * @return {Response}
 */
export async function makeResponse200(resp) {
  if (resp === null) {
    return new Response('NOT HANDLED', {status: 200});
  }
  if (resp.status === 200) {
    return resp;
  } else {
    // 如果返回4xx，5xx，Telegram会重试这个消息，后续消息就不会到达，所有webhook的错误都返回200
    return new Response(resp.body, {
      status: 200,
      headers: {
        'Original-Status': resp.status,
        ...resp.headers,
      }});
  }
}

/**
 *
 * @param {Response} resp
 * @return {boolean}
 */
export function isJsonResponse(resp) {
  return resp.headers.get('content-type').indexOf('json') !== -1;
}

/**
 *
 * @param {Response} resp
 * @return {boolean}
 */
export function isEventStreamResponse(resp) {
  return resp.headers.get('content-type').indexOf('text/event-stream') !== -1;
}
/**
 * 
 * @param {string} text 
 * @param {string} type 
 * @returns {string}
 */
export function escapeText(text, type = 'info') {
const regex = /[\[\]\/\{\}\(\)\#\+\-\=\|\.\\\!]/g; // TG支持的格式不转义
  if (type === 'info') {
  return text.replace(regex, '\\$&');
  } else {
  return text
    .replace(/\n[\-\*\+]\s/g, '\n• ')
    // \_*[]()~`>#- MD内默认已经经过转义，但普通文本可能没有，不处理\_~`
    .replace(/(?<!\\)[\+\=\{\}\.\|\!\_\*\[\]\(\)\~\#\-]/g, '\\$&')
    .replace(/\>(?!\s)/g, '\\>')
    .replace(/\\\*\\\*/g, '*')
    // .replace(/(\\\#){1,6}\s(.+)\n/g, '*$1*\n')
    .replace(/(\!)?\\\[(.+)?\\\]\\\((.+)?\\\)/g, '[$2]($3)')
  // .replace(/\`\\+\`/g, '`\\\\`')
}
}


/**
 * retry request via async/await
 * @param {string} url
 * @param {object} options
 * @param {number} retries
 * @param {number} delayMs retry
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options, retries = 3, delayMs = 1000) {
  try {
    let resp = await fetch(url, options);
    if (!resp.ok) {
      console.log(`unsuccessful status: ${resp.status} ${resp.statusText}`);
    }
    return resp;
  } catch (error) {
    if (retries > 0) {
      const delayTime = delayMs * Math.pow(2, 3 - retries);
      console.log(`request failed, will retry after ${delayTime/1000} s...`);
      await delay(delayTime);
      return fetchWithRetry(url, options, retries - 1, delayMs);
    } else {
      throw new Error('failed after retries: ' + error.message);
    }
  }
}

/**
 * 延迟执行一段时间
 * @param {number} ms 毫秒数
 * @returns {Promise<void>}
 */
export function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}