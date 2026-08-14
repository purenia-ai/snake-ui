export type SnakeFormPath = string | Array<string | number>;

export function toPath(path: SnakeFormPath): Array<string | number> {
    if (Array.isArray(path)) return [...path];
    return String(path)
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean)
        .map(item => (/^\d+$/.test(item) ? Number(item) : item));
}

export function getPathValue(target: unknown, path: SnakeFormPath): unknown {
    return toPath(path).reduce<unknown>(
        (value, key) => (value == null ? undefined : (value as Record<string | number, unknown>)[key]),
        target
    );
}

export function setPathValue(target: unknown, path: SnakeFormPath, value: unknown): boolean {
    const parts = toPath(path);
    if (!target || typeof target !== 'object' || !parts.length) return false;
    let cursor = target as Record<string | number, unknown>;
    for (let index = 0; index < parts.length - 1; index += 1) {
        const key = parts[index];
        const nextKey = parts[index + 1];
        if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = typeof nextKey === 'number' ? [] : {};
        cursor = cursor[key] as Record<string | number, unknown>;
    }
    cursor[parts[parts.length - 1]] = value;
    return true;
}

export function cloneFormValue<T>(value: T): T {
    if (value == null || typeof value !== 'object') return value;
    if (value instanceof Date) return new Date(value.getTime()) as T;
    if (Array.isArray(value)) return value.map(cloneFormValue) as T;
    return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, cloneFormValue(item)])
    ) as T;
}
