export function kebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

export function addStyle(
    style: Record<string, unknown> | string,
    target: 'object' | 'string' = 'object'
): Record<string, string> | string {
    if (target === 'string') return typeof style === 'string' ? style : toStyle(style);
    if (typeof style !== 'string') {
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

export function toStyle(...styles: Array<Record<string, unknown> | string | null | undefined>): string {
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
