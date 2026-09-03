import type { App } from 'vue';
import type { SnakeUIOptions } from './runtime';
import { snake as runtimeSnake } from './runtime';
import { snakeConfig, setSnakeConfig, SNAKE_UI_VERSION } from './config/state';
import zIndex from './config/zIndex';
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
} from './config/theme';
import * as functions from './function';
import * as hooks from './hooks';
import { currentSnakeLocale, initSnakeLocale, setSnakeLocale, snakeLocales, snakeTranslate } from '../locale';
import { configureSnakeHttp, snakeHttp } from './request';
import { configureSnakeCms } from './cms';

export const snakeFoundation = {
    ...functions,
    ...hooks,
    color: snakeColor,
    config: snakeConfig,
    zIndex,
    version: SNAKE_UI_VERSION,
    http: snakeHttp,
    themes: snakeThemes,
    currentTheme: currentSnakeTheme,
    darkMode: snakeDarkMode,
    cssVars: snakeCssVars,
    locales: snakeLocales,
    currentLocale: currentSnakeLocale,
    initTheme: initSnakeTheme,
    setTheme: setSnakeTheme,
    setThemeColor: setSnakeThemeColor,
    setDarkMode: setSnakeDarkMode,
    toggleDarkMode: toggleSnakeDarkMode,
    isInDarkMode: isSnakeDarkMode,
    initLocales: initSnakeLocale,
    setLocale: setSnakeLocale,
    t: snakeTranslate
};

export type SnakeFoundationAPI = typeof snakeFoundation;
export const snake = Object.assign(runtimeSnake, snakeFoundation) as typeof runtimeSnake & SnakeFoundationAPI;

export function installSnakeUIFoundation(app: App, options: SnakeUIOptions = {}): void {
    setSnakeConfig({ debugMode: options.debugMode ?? false });
    initSnakeTheme(options.theme);
    initSnakeLocale(options.locale);
    configureSnakeHttp(options.http, options.request);
    configureSnakeCms(options.cms);
    Object.defineProperty(app.config.globalProperties, '$snakeThemeStyle', {
        configurable: true,
        get: () => snakeCssVars.value
    });
    app.provide('snake-ui-theme', currentSnakeTheme);
    app.provide('snake-ui-locale', currentSnakeLocale);
}
