/**
 * Snake UI 全局 API 聚合与插件初始化。
 *
 * foundation 汇总工具函数、hooks、主题、国际化、HTTP 与全局配置，
 * 经根入口挂载为 $snake；宿主注入的 request / cache 等运行时适配器
 * 由 libs/runtime 负责，不经此文件。
 */
import type { App } from 'vue';
import type { RuntimeOptions } from './runtime';
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

/**
 * 全局 API 聚合：工具函数与 hooks 全量展开，再显式补上配置、
 * 主题、国际化、HTTP 等具名成员，并保留 date / isInDarkMode / t 等短别名。
 */
export const foundation = {
    ...functions,
    ...hooks,
    color: color,
    config: config,
    zIndex,
    version: SNAKE_UI_VERSION,
    /** 语义色类型清单，toast / modal 等组件按它约束 type 取值。 */
    type: ['primary', 'success', 'error', 'warning', 'info'],
    /** date 是 formatTime 的短别名。 */
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
    /** t 是 translate 的短别名。 */
    t: translate
};

/** foundation 的公开类型视图，供宿主对 $snake 做类型标注。 */
export type FoundationAPI = typeof foundation;
/** Snake UI 的唯一全局 API 聚合。运行时适配器不在这里安装。 */
export const snake = foundation;

/**
 * 安装 UI 基座：由根入口（index.ts 的 install）调用，在 $snake
 * 挂载到全局属性之前完成配置、主题、语言、HTTP 与 CMS 的初始化。
 *
 * - `$http`：请求全局属性，与 snake.http 同一单例。
 * - `$themeStyle`：用 getter 定义而非直接赋值，模板每次读取都取
 *   cssVars 当前值，主题切换后不需要重新挂属性、也不会固化快照。
 * - provide 的 theme / locale 面向宿主业务组件 inject 使用；
 *   snake-ui 自身组件直接消费 config/theme 与 locale 模块，
 *   不依赖这两个注入。
 */
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
