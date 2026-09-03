import { inject, provide, type InjectionKey } from 'vue';

/**
 * snake 原生表单族的 provide/inject 关系助手（internal/ 的类型化 InjectionKey 方案）。
 * 与 useCompRelation.ts（uView 式按组件 name 链查找 + 广播）双轨并存：
 * 库内自研组件用本 hook（类型更严格），从 uView 移植的组件用 useParent/useChildren。
 */
export function useSnakeCompRelation<T>(key: InjectionKey<T>, value?: T): T | null {
    if (value !== undefined) provide(key, value);
    return inject(key, null);
}
