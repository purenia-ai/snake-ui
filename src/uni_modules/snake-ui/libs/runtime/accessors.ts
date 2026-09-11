import { getRuntimeOptions } from './context';
import { RuntimeError, type CacheAdapter, type RequestAdapter, type RuntimeConfig } from './types';

/**
 * 面向组件的运行时访问器。
 * 所有缺失能力都在这里附带组件名报错，调用方无需各自判断或复制错误文案。
 */
export function requireRequest(component: string): RequestAdapter {
    const request = getRuntimeOptions().request;
    if (!request) throw new RuntimeError(component, 'request');
    return request;
}

export function requireCache(component: string): CacheAdapter {
    const cache = getRuntimeOptions().cache;
    if (!cache) throw new RuntimeError(component, 'cache');
    return cache;
}

export function getRuntimeConfig(component: string): Readonly<RuntimeConfig> {
    const config = getRuntimeOptions().config;
    if (!config) throw new RuntimeError(component, 'config');
    return config;
}

/** 为组件创建带组件名的请求访问门面，统一保留缺失能力报错上下文。 */
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

/** 为组件创建带组件名的缓存访问门面，统一保留缺失能力报错上下文。 */
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

export function getConfig(component: string): Readonly<RuntimeConfig> {
    return getRuntimeConfig(component);
}
