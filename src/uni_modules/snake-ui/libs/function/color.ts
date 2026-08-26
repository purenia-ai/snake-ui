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
