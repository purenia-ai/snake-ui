import { deepClone } from './deepClone';

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
