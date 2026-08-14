import type { SnakeUIOptions } from "../uni_modules/snake-ui";

interface CacheEntry {
  expiresAt?: number;
  value: unknown;
}

const cache = new Map<string, CacheEntry>();

function responseFor(url: string) {
  if (url.includes("coupon/check")) {
    return { success: true, data: { result: true }, msg: "可领取" };
  }
  if (url.includes("coupon/add")) {
    return { success: true, data: { msg: "领取成功" }, msg: "领取成功" };
  }
  if (url.includes("activity/list")) {
    return { success: true, data: { items: [] } };
  }
  if (url.includes("generateUrlScheme")) {
    return { success: true, data: { openLink: "#" } };
  }
  if (url.includes("filter")) {
    return { success: true, data: { topFilter: [], mainFilter: [], brandFilter: {} } };
  }
  return { success: true, data: { items: [], total: 0 } };
}

export const mockSnakeUIOptions: SnakeUIOptions = {
  config: {
    baseUrl: "",
    preview: true,
  },
  request: {
    async get<T>(url: string): Promise<T> {
      return responseFor(url) as T;
    },
    async post<T>(url: string): Promise<T> {
      return responseFor(url) as T;
    },
  },
  cache: {
    get<T>(key: string): T | undefined {
      const entry = cache.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt && entry.expiresAt <= Date.now()) {
        cache.delete(key);
        return undefined;
      }
      return entry.value as T;
    },
    set<T>(key: string, value: T, ttlSeconds?: number): void {
      cache.set(key, {
        value,
        expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
      });
    },
    delete(key: string): void {
      cache.delete(key);
    },
  },
};
