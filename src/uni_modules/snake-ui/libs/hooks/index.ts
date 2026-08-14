import { computed, inject, provide, type InjectionKey } from 'vue';
import {
    currentSnakeTheme,
    initSnakeTheme,
    isSnakeDarkMode,
    setSnakeDarkMode,
    setSnakeTheme,
    setSnakeThemeColor,
    snakeColor,
    snakeCssVars,
    snakeDarkMode,
    snakeThemes,
    toggleSnakeDarkMode
} from '../config/theme';
import { debounce, getRect, navTo, snakeEmitter, throttle, toast } from '../functions';
import { currentSnakeLocale, initSnakeLocale, setSnakeLocale, snakeLocales, snakeTranslate } from '../../locale';

export function useSnakeTheme() {
    return {
        currentTheme: currentSnakeTheme,
        themes: snakeThemes,
        darkMode: snakeDarkMode,
        color: snakeColor,
        cssVars: snakeCssVars,
        themeStyle: computed(() => snakeCssVars.value),
        initTheme: initSnakeTheme,
        setTheme: setSnakeTheme,
        setThemeColor: setSnakeThemeColor,
        setDarkMode: setSnakeDarkMode,
        toggleDarkMode: toggleSnakeDarkMode,
        isInDarkMode: isSnakeDarkMode
    };
}

export function useSnakeColor() {
    return { color: snakeColor, setColor: setSnakeThemeColor };
}

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

export function useSnakeRouter() {
    return { route: navTo };
}

export function useSnakeRect(instance?: unknown) {
    return { getRect: (selector: string) => getRect(selector, instance) };
}

export function useSnakeToast() {
    return { show: toast };
}

export function useSnakeModal() {
    return {
        show(options: UniApp.ShowModalOptions): Promise<UniApp.ShowModalRes> {
            return new Promise((resolve, reject) => {
                uni.showModal({ ...options, success: resolve, fail: reject });
            });
        }
    };
}

export function useSnakeDebounce<Args extends unknown[]>(callback: (...args: Args) => void, wait?: number) {
    return debounce(callback, wait);
}

export function useSnakeThrottle<Args extends unknown[]>(callback: (...args: Args) => void, wait?: number) {
    return throttle(callback, wait);
}

export function useSnakeEmitter() {
    return snakeEmitter;
}

export function useSnakeCompRelation<T>(key: InjectionKey<T>, value?: T): T | null {
    if (value !== undefined) provide(key, value);
    return inject(key, null);
}
