import { inject, provide, type InjectionKey } from 'vue';

export function useSnakeCompRelation<T>(key: InjectionKey<T>, value?: T): T | null {
    if (value !== undefined) provide(key, value);
    return inject(key, null);
}
