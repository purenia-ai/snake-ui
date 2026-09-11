import type { CSSProperties } from 'vue';
import { trim } from './trim';
import { test } from './test';

/**
 * 样式合并的「清洗」版：合并前过滤 'null' / 'undefined' 字符串等无效值，
 * 适合拼接来源不可控的样式（如接口下发的 customStyle）；基础归一化见 style.ts。
 */

/** 过滤空值与 'null' / 'undefined' 字符串，这类脏值常见于接口透传。 */
function isValidValue(value: unknown): boolean {
    if (test.isEmpty(value)) return false;
    if (typeof value === 'string') {
        const trimmed = trim(value).toLowerCase();
        return trimmed !== 'null' && trimmed !== 'undefined' && trimmed !== '';
    }
    return true;
}

/** 将 CSS 字符串解析为驼峰键对象。 */
function cssStrToObj(str: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!isValidValue(str)) return result;
    const declarations = trim(String(str)).split(';');
    declarations.forEach(decl => {
        const [prop, ...values] = decl.split(':').map(segment => segment.trim());
        const value = values.join(':');
        if (prop && value) {
            const camelProp = prop.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase());
            result[camelProp] = value;
        }
    });
    return result;
}

/** 将驼峰键对象转换为 CSS 字符串。 */
function cssObjToStr(obj: CSSProperties): string {
    if (!isValidValue(obj) || typeof obj !== 'object') return '';
    return (
        Object.entries(obj)
            .map(([key, value]) => {
                if (!isValidValue(value)) return '';
                // 驼峰转短横线
                const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${kebab}: ${value}`;
            })
            .filter(Boolean)
            .join('; ') + ';'
    );
}

/**
 * 合并多个 CSS 输入（对象或字符串），返回一个 CSS 对象，后参数覆盖先参数。
 */
export function mergeStyles(...args: (object | string)[]): CSSProperties {
    const result = {} as Record<string, any>;
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!isValidValue(arg)) return result as CSSProperties;
        if (typeof arg === 'string') {
            Object.assign(result, cssStrToObj(arg));
        } else if (test.object(arg)) {
            const cleanedObj: Record<string, any> = {};
            Object.keys(arg).forEach(key => {
                const value = (arg as Record<string, any>)[key];
                if (isValidValue(value)) {
                    cleanedObj[key] = value;
                }
            });
            Object.assign(result, cleanedObj);
        }
    }
    return result as CSSProperties;
}

/**
 * 合并多个 CSS 输入并返回 CSS 字符串。
 */
export function mergeCssStrings(...args: (object | string)[]): string {
    const obj = mergeStyles(...args);
    return cssObjToStr(obj);
}
