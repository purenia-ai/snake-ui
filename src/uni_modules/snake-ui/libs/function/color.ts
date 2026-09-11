/** 归一化 hex：接受 3 / 6 位（可带 #），3 位展开为 6 位，其余返回 undefined。 */
function normalizeHex(value: string): string | undefined {
    const color = value.trim().replace('#', '');
    if (/^[0-9a-f]{3}$/i.test(color))
        return color
            .split('')
            .map(item => item.repeat(2))
            .join('');
    return /^[0-9a-f]{6}$/i.test(color) ? color : undefined;
}

/** hex → { r, g, b }；无法解析时返回 undefined。 */
export function hexToRgb(value: string): { r: number; g: number; b: number } | undefined {
    const color = normalizeHex(value);
    if (!color) return undefined;
    return {
        r: Number.parseInt(color.slice(0, 2), 16),
        g: Number.parseInt(color.slice(2, 4), 16),
        b: Number.parseInt(color.slice(4, 6), 16)
    };
}

/** rgb → #rrggbb；各通道先收敛到 [0, 255] 再取整，输出恒为 6 位。 */
export function rgbToHex(r: number, g: number, b: number): string {
    const channel = (value: number) =>
        Math.min(255, Math.max(0, Math.round(value)))
            .toString(16)
            .padStart(2, '0');
    return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** hex → rgba(...)：alpha 收敛到 [0, 1]，无法解析的输入原样返回。 */
export function colorToRgba(value: string, alpha = 1): string {
    const rgb = hexToRgb(value);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(1, Math.max(0, alpha))})` : value;
}

/**
 * 两色之间的线性渐变阶梯，首尾正好是起止色。
 * @param steps 阶梯数：<=0 返回空数组，1 只返回起点色
 */
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
