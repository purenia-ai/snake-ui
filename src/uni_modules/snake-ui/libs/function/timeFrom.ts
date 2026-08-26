import { formatTime } from './platform';

function normalizeTime(value: string | number | Date): Date {
    if (value instanceof Date) return new Date(value.getTime());
    if (typeof value === 'number' || /^\d+(?:\.\d+)?$/.test(String(value).trim())) {
        const numeric = Number(value);
        return new Date(Math.abs(numeric) < 1e12 ? numeric * 1000 : numeric);
    }
    return new Date(value);
}

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
