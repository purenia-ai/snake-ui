import { addUnit } from '../unit';
import { formatTime, getQueryParams, getRect, getSystemInfo, guid, navTo, sleep, toast } from '../platform';

export { addUnit, formatTime, getQueryParams, getRect, getSystemInfo, guid, navTo, sleep, toast };
export const queryParams = getQueryParams;
export const route = navTo;
export const timeFormat = formatTime;

export function timeFrom(value: string | number | Date, now = Date.now()): string {
    const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
    if (!Number.isFinite(timestamp)) return '';
    const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}天前`;
    return formatTime(value, 'yyyy-mm-dd');
}

function normalizeHex(value: string): string | undefined {
    const color = value.trim().replace('#', '');
    if (/^[0-9a-f]{3}$/i.test(color))
        return color
            .split('')
            .map(item => item.repeat(2))
            .join('');
    return /^[0-9a-f]{6}$/i.test(color) ? color : undefined;
}

export function hexToRgb(value: string): { r: number; g: number; b: number } | undefined {
    const color = normalizeHex(value);
    if (!color) return undefined;
    return {
        r: Number.parseInt(color.slice(0, 2), 16),
        g: Number.parseInt(color.slice(2, 4), 16),
        b: Number.parseInt(color.slice(4, 6), 16)
    };
}

export function rgbToHex(r: number, g: number, b: number): string {
    const channel = (value: number) =>
        Math.min(255, Math.max(0, Math.round(value)))
            .toString(16)
            .padStart(2, '0');
    return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function colorToRgba(value: string, alpha = 1): string {
    const rgb = hexToRgb(value);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(1, Math.max(0, alpha))})` : value;
}

export function colorGradient(start: string, end: string, steps: number): string[] {
    const from = hexToRgb(start);
    const to = hexToRgb(end);
    if (!from || !to || steps <= 0) return [];
    if (steps === 1) return [rgbToHex(from.r, from.g, from.b)];
    return Array.from({ length: steps }, (_, index) => {
        const ratio = index / (steps - 1);
        return rgbToHex(
            from.r + (to.r - from.r) * ratio,
            from.g + (to.g - from.g) * ratio,
            from.b + (to.b - from.b) * ratio
        );
    });
}

export function deepClone<T>(value: T, seen = new WeakMap<object, unknown>()): T {
    if (value == null || typeof value !== 'object') return value;
    if (seen.has(value as object)) return seen.get(value as object) as T;
    if (value instanceof Date) return new Date(value.getTime()) as T;
    if (value instanceof Map) {
        const result = new Map();
        seen.set(value, result);
        value.forEach((item, key) => result.set(deepClone(key, seen), deepClone(item, seen)));
        return result as T;
    }
    if (value instanceof Set) {
        const result = new Set();
        seen.set(value, result);
        value.forEach(item => result.add(deepClone(item, seen)));
        return result as T;
    }
    const result: unknown[] | Record<PropertyKey, unknown> = Array.isArray(value) ? [] : {};
    seen.set(value as object, result);
    Reflect.ownKeys(value as object).forEach(key => {
        (result as Record<PropertyKey, unknown>)[key] = deepClone((value as Record<PropertyKey, unknown>)[key], seen);
    });
    return result as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}

export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Array<Partial<T>>): T {
    const result = deepClone(target);
    sources.forEach(source => {
        Object.entries(source || {}).forEach(([key, value]) => {
            const previous = result[key];
            result[key as keyof T] = (
                isPlainObject(previous) && isPlainObject(value) ? deepMerge(previous, value) : deepClone(value)
            ) as T[keyof T];
        });
    });
    return result;
}

export interface SnakeCancelableFunction<Args extends unknown[]> {
    (...args: Args): void;
    cancel(): void;
}

export function debounce<Args extends unknown[]>(
    callback: (...args: Args) => void,
    wait = 300,
    immediate = false
): SnakeCancelableFunction<Args> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wrapped = ((...args: Args) => {
        const callNow = immediate && !timer;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
            if (!immediate) callback(...args);
        }, wait);
        if (callNow) callback(...args);
    }) as SnakeCancelableFunction<Args>;
    wrapped.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
    };
    return wrapped;
}

export function throttle<Args extends unknown[]>(
    callback: (...args: Args) => void,
    wait = 300
): SnakeCancelableFunction<Args> {
    let lastCall = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wrapped = ((...args: Args) => {
        const remaining = wait - (Date.now() - lastCall);
        if (remaining <= 0) {
            if (timer) clearTimeout(timer);
            timer = undefined;
            lastCall = Date.now();
            callback(...args);
            return;
        }
        if (!timer) {
            timer = setTimeout(() => {
                timer = undefined;
                lastCall = Date.now();
                callback(...args);
            }, remaining);
        }
    }) as SnakeCancelableFunction<Args>;
    wrapped.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
        lastCall = 0;
    };
    return wrapped;
}

export function random(min = 0, max = 1): number {
    const lower = Math.ceil(Math.min(min, max));
    const upper = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

export function randomArray<T>(values: readonly T[]): T[] {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const next = random(0, index);
        [result[index], result[next]] = [result[next], result[index]];
    }
    return result;
}

export function trim(value: string, position: 'both' | 'left' | 'right' | 'all' = 'both'): string {
    if (position === 'left') return value.replace(/^\s+/, '');
    if (position === 'right') return value.replace(/\s+$/, '');
    if (position === 'all') return value.replace(/\s+/g, '');
    return value.trim();
}

export const test = {
    email: (value: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
    mobile: (value: unknown) => /^1[3-9]\d{9}$/.test(String(value)),
    url: (value: unknown) => /^https?:\/\//i.test(String(value)),
    number: (value: unknown) => value !== '' && Number.isFinite(Number(value)),
    string: (value: unknown): value is string => typeof value === 'string',
    object: isPlainObject,
    array: Array.isArray,
    empty: (value: unknown) =>
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (isPlainObject(value) && Object.keys(value).length === 0)
};

export function kebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

export function addStyle(
    style: Record<string, unknown> | string,
    target: 'object' | 'string' = 'object'
): Record<string, string> | string {
    if (target === 'string') return typeof style === 'string' ? style : toStyle(style);
    if (typeof style !== 'string') {
        return Object.fromEntries(Object.entries(style).map(([key, value]) => [key, String(value)]));
    }
    return style.split(';').reduce<Record<string, string>>((result, declaration) => {
        const separator = declaration.indexOf(':');
        if (separator < 0) return result;
        const key = declaration.slice(0, separator).trim();
        const value = declaration.slice(separator + 1).trim();
        if (key && value) result[key] = value;
        return result;
    }, {});
}

export function toStyle(...styles: Array<Record<string, unknown> | string | null | undefined>): string {
    const declarations = new Map<string, string>();
    styles.forEach(style => {
        const source = typeof style === 'string' ? (addStyle(style) as Record<string, string>) : style;
        if (!source) return;
        Object.entries(source).forEach(([key, value]) => {
            if (value != null && value !== '') declarations.set(kebabCase(key), String(value));
        });
    });
    return Array.from(declarations, ([key, value]) => `${key}:${value}`).join(';');
}

export function formatPrice(
    value: string | number,
    decimals = 0,
    decimalPoint = '.',
    thousandsSeparator = ','
): string {
    const numeric = Number(String(value).replace(/[^0-9+\-Ee.]/g, ''));
    const safe = Number.isFinite(numeric) ? numeric : 0;
    const fixed = safe.toFixed(Math.max(0, decimals)).split('.');
    fixed[0] = fixed[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    return fixed.join(decimalPoint);
}

export function formatName(value: string): string {
    if (value.length <= 1) return value;
    if (value.length === 2) return `${value[0]}*`;
    return `${value[0]}${'*'.repeat(value.length - 2)}${value.at(-1)}`;
}

export function clipboard(value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof uni === 'undefined' || typeof uni.setClipboardData !== 'function') {
            reject(new Error('[Snake UI] clipboard is unavailable on this platform.'));
            return;
        }
        uni.setClipboardData({ data: value, success: () => resolve(), fail: reject });
    });
}

export function sys(): UniApp.GetSystemInfoResult {
    return getSystemInfo();
}

export function os(): string {
    return String(sys().platform || '').toLowerCase();
}

export function type2icon(type: string): string {
    return (
        (
            { success: 'checkmark-circle', warning: 'warning', error: 'close-circle', info: 'info-circle' } as Record<
                string,
                string
            >
        )[type] || 'info-circle'
    );
}

export type SnakeEventHandler<Payload = unknown> = (payload: Payload) => void;

export function createSnakeEmitter() {
    const events = new Map<string, Set<SnakeEventHandler>>();
    return {
        on<Payload>(name: string, handler: SnakeEventHandler<Payload>) {
            const handlers = events.get(name) || new Set();
            handlers.add(handler as SnakeEventHandler);
            events.set(name, handlers);
            return () => handlers.delete(handler as SnakeEventHandler);
        },
        off<Payload>(name: string, handler?: SnakeEventHandler<Payload>) {
            if (!handler) events.delete(name);
            else events.get(name)?.delete(handler as SnakeEventHandler);
        },
        emit<Payload>(name: string, payload: Payload) {
            events.get(name)?.forEach(handler => handler(payload));
        },
        clear() {
            events.clear();
        }
    };
}

export const snakeEmitter = createSnakeEmitter();
