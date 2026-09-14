import { random } from './random';

/**
 * Fisher–Yates 洗牌：返回打乱后的新数组，不改动原数组。
 * 分布均匀，且无原地副作用。
 */
export function randomArray<T>(values: readonly T[]): T[] {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const next = random(0, index);
        [result[index], result[next]] = [result[next], result[index]];
    }
    return result;
}
