import { ref } from 'vue';
import { isSnakeDebugMode, snakeConfig } from '../libs/config/state';
import type { SnakeLocale, SnakeLocaleOption } from '../libs/config/types';
import enUS from './lang/en-US';
import zhCN from './lang/zh-CN';

const LOCALE_STORAGE_KEY = 'snake-ui-locale';

export { enUS, zhCN };

export const snakeLocales = ref<SnakeLocale[]>([zhCN, enUS]);
export const currentSnakeLocale = ref<SnakeLocale>(zhCN);

let initialized = false;

function readLocale(): string | undefined {
    try {
        if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
            return uni.getStorageSync(LOCALE_STORAGE_KEY) || undefined;
        }
    } catch (error) {
        if (isSnakeDebugMode('warn')) console.warn('[Snake UI] failed to read locale', error);
    }
    return undefined;
}

function writeLocale(name: string): void {
    try {
        if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
            uni.setStorageSync(LOCALE_STORAGE_KEY, name);
        }
    } catch (error) {
        if (isSnakeDebugMode('warn')) console.warn('[Snake UI] failed to persist locale', error);
    }
}

function deepMergeMessages(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
    const result = { ...base };
    Object.entries(patch).forEach(([key, value]) => {
        const previous = result[key];
        result[key] =
            previous && value && typeof previous === 'object' && typeof value === 'object'
                ? deepMergeMessages(previous as Record<string, unknown>, value as Record<string, unknown>)
                : value;
    });
    return result;
}

function mergeLocales(custom: SnakeLocale[]): SnakeLocale[] {
    const map = new Map<string, SnakeLocale>([
        [zhCN.name, zhCN],
        [enUS.name, enUS]
    ]);
    custom.forEach(locale => {
        const base = map.get(locale.name);
        map.set(locale.name, {
            ...base,
            ...locale,
            messages: deepMergeMessages(base?.messages || {}, locale.messages || {})
        });
    });
    return Array.from(map.values());
}

export function initSnakeLocale(option?: SnakeLocaleOption): void {
    let locales: SnakeLocale[] = [];
    let defaultLocale = snakeConfig.defaultLocale;
    let force = false;
    if (typeof option === 'string') {
        defaultLocale = option;
    } else if (Array.isArray(option)) {
        locales = option;
    } else if (option) {
        locales = option.locales || [];
        defaultLocale = option.defaultLocale || defaultLocale;
        force = Boolean(option.force);
    }
    if (!initialized || force || locales.length) snakeLocales.value = mergeLocales(locales);
    const initialName = (force ? undefined : readLocale()) || defaultLocale;
    currentSnakeLocale.value =
        snakeLocales.value.find(locale => locale.name === initialName) ||
        snakeLocales.value.find(locale => locale.name === 'zh-CN') ||
        snakeLocales.value[0];
    initialized = true;
}

export function setSnakeLocale(name: string): boolean {
    const locale = snakeLocales.value.find(item => item.name === name);
    if (!locale) return false;
    currentSnakeLocale.value = locale;
    writeLocale(name);
    return true;
}

function readMessage(locale: SnakeLocale | undefined, key: string): string | undefined {
    let current: unknown = locale?.messages;
    for (const part of key.split('.')) {
        if (!current || typeof current !== 'object') return undefined;
        current = (current as Record<string, unknown>)[part];
    }
    return typeof current === 'string' ? current : undefined;
}

export function snakeTranslate(
    key: string,
    replacements?: Record<string, unknown> | unknown[],
    localeName?: string
): string {
    const selected = localeName
        ? snakeLocales.value.find(locale => locale.name === localeName)
        : currentSnakeLocale.value;
    const fallback = snakeLocales.value.find(locale => locale.name === 'zh-CN');
    let result = readMessage(selected, key) || readMessage(fallback, key) || key;
    if (Array.isArray(replacements)) {
        replacements.forEach((value, index) => {
            result = result.split(`{${index}}`).join(String(value));
        });
    } else if (replacements) {
        Object.entries(replacements).forEach(([name, value]) => {
            result = result.split(`{${name}}`).join(String(value));
        });
    }
    return result;
}

export function resetSnakeLocale(): void {
    initialized = false;
    snakeLocales.value = [zhCN, enUS];
    currentSnakeLocale.value = zhCN;
}
