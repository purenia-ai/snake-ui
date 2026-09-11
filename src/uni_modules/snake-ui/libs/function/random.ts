/** 生成 [min, max] 闭区间随机整数；两参大小颠倒时自动交换，默认 [0, 1]。 */
export function random(min = 0, max = 1): number {
    const lower = Math.ceil(Math.min(min, max));
    const upper = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
