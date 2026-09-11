import type { InjectionKey } from 'vue';
import type { RuntimeOptions } from './types';

/**
 * 运行时上下文只保存宿主应用注入的可选能力。
 * 它是模块级状态，供非 Vue 组件场景读取；Vue 组件同时可通过 runtimeOptionsKey 注入。
 */
const runtime: RuntimeOptions = {};

/** 提供给 Vue 组件树的只读运行时上下文 key。 */
export const runtimeOptionsKey: InjectionKey<Readonly<RuntimeOptions>> = Symbol('snake-ui-options');

/**
 * 合并宿主注入的能力。运行时上下文不负责主题、语言等 UI 初始化，
 * 那些职责由 foundation 单独处理。
 */
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

/** 仅用于测试或重新初始化场景，清除全部宿主注入能力。 */
export function resetRuntime(): void {
    delete runtime.request;
    delete runtime.cache;
    delete runtime.config;
    delete runtime.cms;
}
