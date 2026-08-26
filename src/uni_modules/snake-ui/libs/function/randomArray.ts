import { random } from './random';

export function randomArray<T>(values: readonly T[]): T[] {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const next = random(0, index);
        [result[index], result[next]] = [result[next], result[index]];
    }
    return result;
}
