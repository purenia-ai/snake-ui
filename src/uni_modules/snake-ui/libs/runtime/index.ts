/**
 * 宿主运行时能力的唯一入口。
 *
 * 这里仅管理组件库需要由业务应用提供的 request、cache、config、cms。
 * 主题、语言、HTTP 初始化和 `$snake` 全局 API 由 foundation 与根入口负责，
 * 避免把“运行时依赖注入”和“UI 初始化”混在同一个模块。
 */
export { configureRuntime, getRuntimeOptions, resetRuntime, runtimeOptionsKey } from './context';
export {
    createCacheClient,
    createRequestClient,
    getConfig,
    getRuntimeConfig,
    requireCache,
    requireRequest
} from './accessors';
export { RuntimeError } from './types';
export type { CacheAdapter, RequestAdapter, RuntimeConfig, RuntimeOptions } from './types';
