/**
 * URL 查询串工具：queryParams 负责「对象 → 串」拼接（与 uview 的
 * $u.queryParams 语义一致），getQueryParams 负责「串 → 对象」解析。
 */

/** 数组参数的序列化格式：indices 下标 / brackets 中括号 / repeat 重复键 / comma 逗号合并 */
export type QueryArrayFormat = 'indices' | 'brackets' | 'repeat' | 'comma';

const ARRAY_FORMATS = ['indices', 'brackets', 'repeat', 'comma'];

/**
 * 把对象拼接成 URL 查询串（uview 的 queryParams 兼容实现）。
 *
 * - 空值（'' / undefined / null）参数直接跳过；
 * - 数组按 arrayFormat 序列化，默认 brackets（key[]=v1&key[]=v2）；
 * - 普通对象 JSON 序列化并 encodeURIComponent；
 * - 其余值经模板字符串原样输出、不做额外编码，与 uview 行为一致。
 *
 * @param data 参数对象
 * @param isPrefix 是否自动加上 "?"，默认 true
 * @param arrayFormat 数组格式，默认 brackets
 */
export function queryParams(
    data: Record<string, unknown> = {},
    isPrefix = true,
    arrayFormat: QueryArrayFormat = 'brackets'
): string {
    const prefix = isPrefix ? '?' : '';
    const result: string[] = [];
    const format = (ARRAY_FORMATS as string[]).includes(arrayFormat) ? arrayFormat : 'brackets';

    Object.keys(data).forEach(key => {
        const value = data[key];
        // 过滤空参数，与 uview 行为一致
        if (value === '' || value === undefined || value === null) return;

        if (Array.isArray(value)) {
            if (format === 'indices') {
                value.forEach((item, index) => result.push(`${key}[${index}]=${item}`));
            } else if (format === 'brackets') {
                value.forEach(item => result.push(`${key}[]=${item}`));
            } else if (format === 'repeat') {
                value.forEach(item => result.push(`${key}=${item}`));
            } else {
                result.push(`${key}=${value.join(',')}`);
            }
            return;
        }

        if (value !== null && typeof value === 'object') {
            result.push(`${key}=${encodeURIComponent(JSON.stringify(value))}`);
            return;
        }

        result.push(`${key}=${value}`);
    });

    return prefix + result.join('&');
}

/**
 * 解析 url 的 query 串为对象：取第一个 ? 之后、# 之前的部分，
 * key / value 均做 URL 解码并把 + 还原为空格；参数段内再含 = 时值会被截断。
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
