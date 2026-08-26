import { currentSnakeLocale, initSnakeLocale, setSnakeLocale, snakeLocales, snakeTranslate } from '../../locale';

export function useSnakeLocale(namespace?: string) {
    const translate = (key: string, replacements?: Record<string, unknown> | unknown[], locale?: string) =>
        snakeTranslate(namespace ? `${namespace}.${key}` : key, replacements, locale);
    return {
        currentLocale: currentSnakeLocale,
        locales: snakeLocales,
        t: translate,
        initLocales: initSnakeLocale,
        setLocale: setSnakeLocale
    };
}
