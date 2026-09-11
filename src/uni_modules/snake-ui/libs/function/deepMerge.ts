import { deepClone } from './deepClone';

/** 纯对象判定（原型为 null 或 Object.prototype），非纯对象不参与递归合并。 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}

/**
 * 多源深合并：target 深拷贝后作为基底（不改动入参），sources 依次覆盖。
 * 只有两侧都是纯对象才递归合并；数组等其余值整体替换为深拷贝。
 */
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
