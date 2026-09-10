import { ref } from 'vue';
import { isDebugMode, config } from '../libs/config/state';
import type { Locale, LocaleOption } from '../libs/config/types';
import enUS from './lang/en-US';
import zhCN from './lang/zh-CN';

const LOCALE_STORAGE_KEY = 'snake-ui-locale';

export { enUS, zhCN };

export const locales = ref<Locale[]>([zhCN, enUS]);
export const currentLocale = ref<Locale>(zhCN);

let initialized = false;

function readLocale(): string | undefined {
    try {
        if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
            return uni.getStorageSync(LOCALE_STORAGE_KEY) || undefined;
        }
    } catch (error) {
        if (isDebugMode('warn')) console.warn('[Snake UI] failed to read locale', error);
    }
    return undefined;
}

function writeLocale(name: string): void {
    try {
        if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
            uni.setStorageSync(LOCALE_STORAGE_KEY, name);
        }
    } catch (error) {
        if (isDebugMode('warn')) console.warn('[Snake UI] failed to persist locale', error);
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

function mergeLocales(custom: Locale[]): Locale[] {
    const map = new Map<string, Locale>([
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

export function initLocale(option?: LocaleOption): void {
    let localeEntries: Locale[] = [];
    let defaultLocale = config.defaultLocale;
    let force = false;
    if (typeof option === 'string') {
        defaultLocale = option;
    } else if (Array.isArray(option)) {
        localeEntries = option;
    } else if (option) {
        localeEntries = option.locales || [];
        defaultLocale = option.defaultLocale || defaultLocale;
        force = Boolean(option.force);
    }
    if (!initialized || force || localeEntries.length) locales.value = mergeLocales(localeEntries);
    const initialName = (force ? undefined : readLocale()) || defaultLocale;
    currentLocale.value =
        locales.value.find(locale => locale.name === initialName) ||
        locales.value.find(locale => locale.name === 'zh-CN') ||
        locales.value[0];
    initialized = true;
}

export function setLocale(name: string): boolean {
    const locale = locales.value.find(item => item.name === name);
    if (!locale) return false;
    currentLocale.value = locale;
    writeLocale(name);
    return true;
}

function readMessage(locale: Locale | undefined, key: string): string | undefined {
    let current: unknown = locale?.messages;
    for (const part of key.split('.')) {
        if (!current || typeof current !== 'object') return undefined;
        current = (current as Record<string, unknown>)[part];
    }
    return typeof current === 'string' ? current : undefined;
}

export function translate(
    key: string,
    replacements?: Record<string, unknown> | unknown[],
    localeName?: string
): string {
    const selected = localeName
        ? locales.value.find(locale => locale.name === localeName)
        : currentLocale.value;
    const fallback = locales.value.find(locale => locale.name === 'zh-CN');
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

export function resetLocale(): void {
    initialized = false;
    locales.value = [zhCN, enUS];
    currentLocale.value = zhCN;
}
