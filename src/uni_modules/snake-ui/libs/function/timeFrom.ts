import { formatTime } from './timeFormat';

/** 归一化为 Date：数字或纯数字串在绝对值 < 1e12 时按秒级时间戳升位为毫秒。 */
function normalizeTime(value: string | number | Date): Date {
    if (value instanceof Date) return new Date(value.getTime());
    if (typeof value === 'number' || /^\d+(?:\.\d+)?$/.test(String(value).trim())) {
        const numeric = Number(value);
        return new Date(Math.abs(numeric) < 1e12 ? numeric * 1000 : numeric);
    }
    return new Date(value);
}

/**
 * 时间转为「多久之前」：刚刚 / n分钟前 / n小时前 / n天前，超过 30 天回落为 yyyy-mm-dd。
 * @param now 当前时间基准，默认 Date.now()；注入固定值便于测试
 */
export function timeFrom(value: string | number | Date, now = Date.now()): string {
    const date = normalizeTime(value);
    const timestamp = date.getTime();
    if (!Number.isFinite(timestamp)) return '';
    const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}天前`;
    return formatTime(date, 'yyyy-mm-dd');
}
