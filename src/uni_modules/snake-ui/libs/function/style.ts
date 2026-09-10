import type { CSSProperties } from 'vue';

/** 可归一为样式声明集合的输入：声明字符串、样式对象（含 CSSProperties）或其数组。 */
export type StyleSource = string | CSSProperties | Record<string, unknown> | StyleSource[] | null | undefined;

export function kebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

export function addStyle(style: StyleSource, target: 'object' | 'string' = 'object'): Record<string, string> | string {
    if (target === 'string') return typeof style === 'string' ? style : toStyle(style);
    if (Array.isArray(style)) return toStyle(style);
    if (typeof style !== 'string') {
        if (!style) return {};
        return Object.fromEntries(Object.entries(style).map(([key, value]) => [key, String(value)]));
    }
    return style.split(';').reduce<Record<string, string>>((result, declaration) => {
        const separator = declaration.indexOf(':');
        if (separator < 0) return result;
        const key = declaration.slice(0, separator).trim();
        const value = declaration.slice(separator + 1).trim();
        if (key && value) result[key] = value;
        return result;
    }, {});
}

export function toStyle(...styles: Array<StyleSource>): string {
    // 兼容旧用法：单个数组整体传入时（如 [object, string]）解构展开
    if (styles.length === 1 && Array.isArray(styles[0])) {
        styles = (styles[0] as StyleSource[]).slice();
    }
    const declarations = new Map<string, string>();
    styles.forEach(style => {
        const source = typeof style === 'string' ? (addStyle(style) as Record<string, string>) : style;
        if (!source) return;
        Object.entries(source).forEach(([key, value]) => {
            if (value != null && value !== '') declarations.set(kebabCase(key), String(value));
        });
    });
    return Array.from(declarations, ([key, value]) => `${key}:${value}`).join(';');
}
