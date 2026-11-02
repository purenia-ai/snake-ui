import type { InjectionKey } from 'vue';
import type { RuntimeOptions } from './types';

/**
 * 运行时上下文只保存宿主应用注入的可选能力。
 * 状态挂在 globalThis 上做跨模块实例单例：dev 场景下宿主可能同时加载两份模块图
 * （插件经 npm 包入口被 vite 预打包成一份；easycom 组件按文件路径以源码形态加载另一份），
 * 模块级 const 会让两份图各持一份状态，插件注入的能力对组件不可见。
 */
const RUNTIME_STATE_KEY = '__SNAKE_UI_RUNTIME__';
const carrier = (typeof globalThis !== 'undefined' ? globalThis : {}) as Record<string, unknown>;
if (!carrier[RUNTIME_STATE_KEY]) carrier[RUNTIME_STATE_KEY] = {};
const runtime: RuntimeOptions = carrier[RUNTIME_STATE_KEY] as RuntimeOptions;

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
