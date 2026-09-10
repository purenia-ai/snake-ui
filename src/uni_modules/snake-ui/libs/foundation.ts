import type { App } from 'vue';
import type { RuntimeOptions } from './runtime';
import { snake as runtimeSnake } from './runtime';
import { config, setConfig, SNAKE_UI_VERSION } from './config/state';
import zIndex from './config/zIndex';
import {
    currentTheme,
    initTheme,
    isDarkMode,
    setDarkMode,
    setTheme,
    setThemeColor,
    color,
    cssVars,
    darkMode,
    themes,
    toggleDarkMode
} from './config/theme';
import * as functions from './function';
import { emitter } from './function/emitter';
import * as hooks from './hooks';
import { currentLocale, initLocale, setLocale, locales, translate } from '../locale';
import { configureHttp, http } from './request';
import { configureCms } from './cms';

export const foundation = {
    ...functions,
    ...hooks,
    color: color,
    config: config,
    zIndex,
    version: SNAKE_UI_VERSION,
    type: ['primary', 'success', 'error', 'warning', 'info'],
    date: functions.formatTime,
    emitter: emitter,
    http,
    themes: themes,
    currentTheme: currentTheme,
    darkMode: darkMode,
    cssVars: cssVars,
    locales: locales,
    currentLocale: currentLocale,
    initTheme: initTheme,
    setTheme: setTheme,
    setThemeColor: setThemeColor,
    setDarkMode: setDarkMode,
    toggleDarkMode: toggleDarkMode,
    isInDarkMode: isDarkMode,
    initLocales: initLocale,
    setLocale: setLocale,
    t: translate
};

export type FoundationAPI = typeof foundation;
export const snake = Object.assign(runtimeSnake, foundation) as typeof runtimeSnake & FoundationAPI;

export function installUIFoundation(app: App, options: RuntimeOptions = {}): void {
    setConfig({ debugMode: options.debugMode ?? false });
    initTheme(options.theme);
    initLocale(options.locale);
    configureHttp(options.http, options.request);
    (app.config.globalProperties as Record<string, unknown>).$http = http;
    configureCms(options.cms);
    Object.defineProperty(app.config.globalProperties, '$themeStyle', {
        configurable: true,
        get: () => cssVars.value
    });
    app.provide('snake-ui-theme', currentTheme);
    app.provide('snake-ui-locale', currentLocale);
}
