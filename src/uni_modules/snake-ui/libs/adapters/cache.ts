import { requireSnakeCache } from '../runtime';

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
    },
  };
}
