import type { App, InjectionKey } from 'vue';
import type { SnakeDebugLevel, SnakeHttpSetup, SnakeLocaleOption, SnakeThemeOption } from './config/types';
import type { SnakeCmsOptions } from './cms/types';
import { addUnit, pxToRpx } from './function/unit';
import { formatTime, getQueryParams, getRect, getSystemInfo, guid, navTo, route, sleep, toast } from './function/platform';
import { queryParams, timeFormat, timeFrom } from './function';

export interface SnakeRequestAdapter {
    get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
    post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T>;
}

export interface SnakeCacheAdapter {
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T, ttlSeconds?: number): void;
    delete(key: string): void;
}

export interface SnakeUIConfig {
    baseUrl?: string;
    [key: string]: unknown;
}

export interface SnakeUIOptions {
    request?: SnakeRequestAdapter;
    cache?: SnakeCacheAdapter;
    config?: SnakeUIConfig;
    theme?: SnakeThemeOption;
    locale?: SnakeLocaleOption;
    http?: SnakeHttpSetup;
    debugMode?: boolean | SnakeDebugLevel | SnakeDebugLevel[];
    cms?: SnakeCmsOptions;
}

export class SnakeUIRuntimeError extends Error {
    readonly component: string;
    readonly capability: keyof SnakeUIOptions;

    constructor(component: string, capability: keyof SnakeUIOptions) {
        super(
            `[Snake UI] ${component} requires the "${capability}" adapter. ` +
                `Configure it with app.use(SnakeUI, { ${capability}: ... }).`
        );
        this.name = 'SnakeUIRuntimeError';
        this.component = component;
        this.capability = capability;
    }
}

const runtime: SnakeUIOptions = {};

export const snakeUIOptionsKey: InjectionKey<Readonly<SnakeUIOptions>> = Symbol('snake-ui-options');

export function configureSnakeUI(options: SnakeUIOptions = {}): Readonly<SnakeUIOptions> {
    if (options.request !== undefined) runtime.request = options.request;
    if (options.cache !== undefined) runtime.cache = options.cache;
    if (options.config !== undefined) {
        runtime.config = {
            ...runtime.config,
            ...options.config
        };
    }
    if (options.cms !== undefined) runtime.cms = options.cms;
    return runtime;
}

export function getSnakeUIOptions(): Readonly<SnakeUIOptions> {
    return runtime;
}

export function resetSnakeUIRuntime(): void {
    delete runtime.request;
    delete runtime.cache;
    delete runtime.config;
    delete runtime.cms;
}

export function requireSnakeRequest(component: string): SnakeRequestAdapter {
    if (!runtime.request) throw new SnakeUIRuntimeError(component, 'request');
    return runtime.request;
}

export function requireSnakeCache(component: string): SnakeCacheAdapter {
    if (!runtime.cache) throw new SnakeUIRuntimeError(component, 'cache');
    return runtime.cache;
}

export function getSnakeConfig(component: string): Readonly<SnakeUIConfig> {
    if (!runtime.config) throw new SnakeUIRuntimeError(component, 'config');
    return runtime.config;
}

// ===== 宿主能力注入门面（原 adapters/ 目录折叠而来，仍从 ./libs barrel 导出） =====

export function createRequestClient(component: string) {
    return {
        get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
            return requireSnakeRequest(component).get<T>(url, params);
        },
        post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T> {
            return requireSnakeRequest(component).post<T>(url, data);
        }
    };
}

export function createCacheClient(component: string) {
    return {
        get<T = unknown>(key: string): T | undefined {
            return requireSnakeCache(component).get<T>(key);
        },
        set<T = unknown>(key: string, value: T, ttlSeconds?: number): void {
            requireSnakeCache(component).set(key, value, ttlSeconds);
        },
        delete(key: string): void {
            requireSnakeCache(component).delete(key);
        }
    };
}

export function getConfig(component: string) {
    return getSnakeConfig(component);
}

export function installSnakeUIRuntime(app: App, options: SnakeUIOptions = {}): void {
    const configured = configureSnakeUI(options);
    app.provide(snakeUIOptionsKey, configured);
    (app.config.globalProperties as Record<string, unknown>).$snake = snake;
    if (typeof uni !== 'undefined') {
        (uni as unknown as Record<string, unknown>).$snake = snake;
    }
}

export const snake = {
    addUnit,
    configure: configureSnakeUI,
    formatTime,
    getQueryParams,
    getRect,
    guid,
    navTo,
    pxToRpx,
    queryParams,
    route,
    sleep,
    sys: getSystemInfo,
    timeFormat,
    timeFrom,
    toast,
    get options(): Readonly<SnakeUIOptions> {
        return getSnakeUIOptions();
    }
};
