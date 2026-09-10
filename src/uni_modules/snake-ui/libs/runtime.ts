import type { App, InjectionKey } from 'vue';
import type { RequestSetup, DebugLevel, LocaleOption, ThemeOption } from './config/types';
import type { CmsOptions } from './cms/types';
import { addUnit, pxToRpx } from './function/unit';
import { formatTime, getQueryParams, getRect, getSystemInfo, guid, navTo, route, sleep, toast } from './function/platform';
import { queryParams, timeFormat, timeFrom } from './function';

export interface RequestAdapter {
    get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
    post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T>;
}

export interface CacheAdapter {
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T, ttlSeconds?: number): void;
    delete(key: string): void;
}

export interface RuntimeConfig {
    baseUrl?: string;
    [key: string]: unknown;
}

export interface RuntimeOptions {
    request?: RequestAdapter;
    cache?: CacheAdapter;
    config?: RuntimeConfig;
    theme?: ThemeOption;
    locale?: LocaleOption;
    http?: RequestSetup;
    debugMode?: boolean | DebugLevel | DebugLevel[];
    cms?: CmsOptions;
}

export class RuntimeError extends Error {
    readonly component: string;
    readonly capability: keyof RuntimeOptions;

    constructor(component: string, capability: keyof RuntimeOptions) {
        super(
            `[Snake UI] ${component} requires the "${capability}" adapter. ` +
                `Configure it with app.use(SnakeUI, { ${capability}: ... }).`
        );
        this.name = 'RuntimeError';
        this.component = component;
        this.capability = capability;
    }
}

const runtime: RuntimeOptions = {};

export const runtimeOptionsKey: InjectionKey<Readonly<RuntimeOptions>> = Symbol('snake-ui-options');

export function configureRuntime(options: RuntimeOptions = {}): Readonly<RuntimeOptions> {
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

export function getRuntimeOptions(): Readonly<RuntimeOptions> {
    return runtime;
}

export function resetRuntime(): void {
    delete runtime.request;
    delete runtime.cache;
    delete runtime.config;
    delete runtime.cms;
}

export function requireRequest(component: string): RequestAdapter {
    if (!runtime.request) throw new RuntimeError(component, 'request');
    return runtime.request;
}

export function requireCache(component: string): CacheAdapter {
    if (!runtime.cache) throw new RuntimeError(component, 'cache');
    return runtime.cache;
}

export function getRuntimeConfig(component: string): Readonly<RuntimeConfig> {
    if (!runtime.config) throw new RuntimeError(component, 'config');
    return runtime.config;
}

// ===== 宿主能力注入门面（原 adapters/ 目录折叠而来，仍从 ./libs barrel 导出） =====

export function createRequestClient(component: string) {
    return {
        get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
            return requireRequest(component).get<T>(url, params);
        },
        post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T> {
            return requireRequest(component).post<T>(url, data);
        }
    };
}

export function createCacheClient(component: string) {
    return {
        get<T = unknown>(key: string): T | undefined {
            return requireCache(component).get<T>(key);
        },
        set<T = unknown>(key: string, value: T, ttlSeconds?: number): void {
            requireCache(component).set(key, value, ttlSeconds);
        },
        delete(key: string): void {
            requireCache(component).delete(key);
        }
    };
}

export function getConfig(component: string) {
    return getRuntimeConfig(component);
}

export function installRuntime(app: App, options: RuntimeOptions = {}): void {
    const configured = configureRuntime(options);
    app.provide(runtimeOptionsKey, configured);
    (app.config.globalProperties as Record<string, unknown>).$snake = snake;
    if (typeof uni !== 'undefined') {
        (uni as unknown as Record<string, unknown>).$snake = snake;
    }
}

export const snake = {
    addUnit,
    configure: configureRuntime,
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
    get options(): Readonly<RuntimeOptions> {
        return getRuntimeOptions();
    }
};
