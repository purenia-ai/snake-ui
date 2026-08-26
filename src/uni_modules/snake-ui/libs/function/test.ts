function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
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
