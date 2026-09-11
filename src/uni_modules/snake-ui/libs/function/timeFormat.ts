/**
 * 时间格式化，占位符区分大小写：yyyy 年、mm 月、dd 日、hh 时、MM 分、ss 秒
 * （分钟是大写 MM，沿用 uView 习惯）。非法日期返回空串。
 * @param value 时间戳 / 日期字符串 / Date；10 位数字按秒级时间戳升位为毫秒
 * @param pattern 格式模板，默认 'yyyy-mm-dd hh:MM:ss'
 */
export function formatTime(value: string | number | Date, pattern = 'yyyy-mm-dd hh:MM:ss'): string {
    // 10 位数字/字符串按秒级时间戳处理，统一换算为毫秒
    let timeValue: string | number | Date = value;
    if ((typeof timeValue === 'number' || typeof timeValue === 'string') && String(timeValue).length === 10) {
        timeValue = Number(timeValue) * 1000;
    }
    const date = timeValue instanceof Date ? timeValue : new Date(timeValue);
    if (Number.isNaN(date.getTime())) return '';
    const parts: Record<string, string> = {
        yyyy: String(date.getFullYear()),
        mm: String(date.getMonth() + 1).padStart(2, '0'),
        dd: String(date.getDate()).padStart(2, '0'),
        hh: String(date.getHours()).padStart(2, '0'),
        MM: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0')
    };
    return pattern.replace(/yyyy|mm|dd|hh|MM|ss/g, token => parts[token]);
}

// uView 兼容别名：timeFormat = formatTime
export { formatTime as timeFormat };
