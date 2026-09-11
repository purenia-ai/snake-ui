/**
 * 解析 url 的 query 串为对象：取第一个 ? 之后、# 之前的部分，
 * key / value 均做 URL 解码并把 + 还原为空格。
 *
 * 注意与 uView 的方向差异：本文件的 queryParams 只是 getQueryParams 的别名（串 → 对象），
 * uView 同名方法是对象 → 串；另外参数段内再含 = 时值会被截断。
 */
export function getQueryParams(url: string): Record<string, string> {
    const query = url.split('?')[1]?.split('#')[0] || '';
    return query.split('&').reduce<Record<string, string>>((result, part) => {
        if (!part) return result;
        const [key, value = ''] = part.split('=');
        result[decodeURIComponent(key.replace(/\+/g, ' '))] = decodeURIComponent(value.replace(/\+/g, ' '));
        return result;
    }, {});
}

export { getQueryParams as queryParams };
