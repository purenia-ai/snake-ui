/**
 * 清除富文本里可执行的内容，保留排版。
 *
 * `style` 属性是 CMS 装修的排版本身，必须保留；只拦脚本、事件属性与伪协议地址。
 */
export function sanitizeRichText(input: unknown): string {
    if (typeof input !== 'string') return '';
    return input
        .replace(/<(script|style|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
        .replace(/<\/?(?:script|style|iframe|object|embed|form|meta|link)\b[^>]*>/gi, '')
        .replace(/\s(?:on\w+|srcdoc)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(
            /\s(?:href|src)\s*=\s*(?:"\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^"]*"|'\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^']*'|(?:javascript|vbscript|data\s*:\s*text\/html)[^\s>]*)/gi,
            ''
        );
}
