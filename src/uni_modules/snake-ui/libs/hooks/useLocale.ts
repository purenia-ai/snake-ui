import { currentLocale, initLocale, setLocale, locales, translate as translateMessage } from '../../locale';

export function useLocale(namespace?: string) {
    const translate = (key: string, replacements?: Record<string, unknown> | unknown[], locale?: string) =>
        translateMessage(namespace ? `${namespace}.${key}` : key, replacements, locale);
    return {
        currentLocale: currentLocale,
        locales: locales,
        t: translate,
        initLocales: initLocale,
        setLocale: setLocale
    };
}
