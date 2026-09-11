import type { CSSProperties } from 'vue';

/**
 * 样式值归一化与串化。与 styleUtils 的分工：这里不过滤无效值，
 * 需要 'null' / 'undefined' 字符串清洗的合并场景用 styleUtils.mergeStyles。
 */

/** 可归一为样式声明集合的输入：声明字符串、样式对象（含 CSSProperties）或其数组。 */
export type StyleSource = string | CSSProperties | Record<string, unknown> | StyleSource[] | null | undefined;

/** 驼峰 / 空格 / 下划线分隔转短横线小写（CSS 属性名风格）。 */
export function kebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * 样式输入归一化：target='object'（默认）统一返回样式对象，声明串按 ; 与首个 : 拆解；
 * target='string' 统一返回样式串（非字符串输入经 toStyle 转换）。
 */
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

/**
 * 合并多份样式输入为一条 `k:v;k:v` 串：键统一短横线小写，
 * 后出现的同键覆盖先出现的（Map 去重），null / 空串值跳过。
 */
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
