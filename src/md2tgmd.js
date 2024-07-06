const escapeChars = /([\_\*\[\]\(\)\\\~\`\>\#\+\-\=\|\{\}\.\!])/g;
let codeBlank = 0;

/**
 * 分割代码块文本 适配嵌套代码块
 * @param {string} text
 * @return {string} text
 */
export function escape(text) {
  const lines = text.split('\n');
  const stack = [];
  const result = [];
  let linetrim = '';
  for (const [i, line] of lines.entries()) {
    linetrim = line.trim();
    let startIndex;
    if (/^```.+/.test(linetrim)) {
      stack.push(i);
    } else if (linetrim === '```') {
      if (stack.length) {
        startIndex = stack.pop();
        if (!stack.length) {
          const content = lines.slice(startIndex, i + 1).join('\n');
          result.push(handleEscape(content, 'code'));
          continue;
        }
      } else {
        stack.push(i);
      }
    }

    if (!stack.length) {
      result.push(handleEscape(line));
    }
  }
  if (stack.length) {
    const last = lines.slice(stack[0]).join('\n') + '\n```';
    result.push(handleEscape(last, 'code'));
  }
  return result.join('\n');
}


/**
 * 处理转义
 * @param {string} text
 * @param {string} type 
 * @return {string} text
 */
function handleEscape(text, type = 'text') {
  if (!text.trim()) {
    return text;
  }
  if (type === 'text') {
    text = text
      .replace(escapeChars, '\\$1')
      // force all characters that need to be escaped to be escaped once.
      .replace(/\\\*\\\*(.*?[^\\])\\\*\\\*/g, '*$1*') // bold
      // \\\*(.+?[^\\])\\\*(.*)$
      // \\\*([^(\\\*)])(.+?[^\\])\\\*(\s*)$
      .replace(/\\_\\_(.*?[^\\])\\_\\_/g, '__$1__') // underline
      .replace(/\\_(.*?[^\\])\\_/g, '_$1_') // italic
      .replace(/\\~(.*?[^\\])\\~/g, '~$1~') // strikethrough
      .replace(/\\\|\\\|(.*?[^\\])\\\|\\\|/g, '||$1||') // spoiler
      .replace(/\\\[([^\]]+?)\\\]\\\((.+?)\\\)/g, '[$1]($2)') // url
      .replace(/\\\`(.*?[^\\])\\\`/g, '`$1`') // inline code
      // .replace(/`\\``/g, '```') // code block
      .replace(/\\\\([\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '\\$1') // restore duplicate escapes
      .replace(/^(\s*)\\(>.+\s*)$/gm, '$1$2') // more than
      // .replace(/([^\\])\\([^\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '$1\\\\$2') // escape sign
      .replace(/^((\\#){1,3}\s)(.+)/gm, '$1*$3*'); // number sign
  } else {
    if (codeBlank === 0) codeBlank = text.length - text.trimStart().length;
    if (codeBlank > 0) {
      const blankReg = new RegExp(`^\\s{${codeBlank}}`, 'gm');
      text = text.replace(blankReg, '');
    }
    text = text
      .trimEnd()
      .replace(/([\\\`])/g, '\\$1') 
      // .replace(/\\\\([\`\=])/g, '\\$1') // restore duplicate escapes
      // .replace(/([^\\])\\([^\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '$1\\\\$2') // escape
      .replace(/^\\`\\`\\`([\s\S]+)\\`\\`\\`$/g, '```$1```'); // code block
  }
  // text = text.replace(/([^\\])\\([^\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '$1\\\\$2'); // single escape sign

  // Where escaping is needed in a normal MD document tg also needs to be escaped, so it does not need to be repeated, but in the case of a single symbol, tg needs to be escaped here, so only the symbols that are repeatedly escaped are restored;
  // In the code block, there are only two symbols need to be escaped, such as the escape character, the escape character is mostly a single occurrence, tg will automatically hide, need to be escaped to express its literal value, in addition to the back-quote involved in the identification of the code block, so in the middle of the code block must be escaped.
  return text;
}