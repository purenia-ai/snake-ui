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
