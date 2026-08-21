export type SelectorRect = UniApp.NodeInfo & { width: number; height: number; top: number; left: number };
export type SnakeRouteType =
  | 'navigateTo'
  | 'to'
  | 'redirect'
  | 'redirectTo'
  | 'switchTab'
  | 'tab'
  | 'reLaunch'
  | 'navigateBack'
  | 'back';
export type SnakeRouteParamValue = string | number | boolean | null | undefined;
export type SnakeRouteParams = Record<string, SnakeRouteParamValue | readonly SnakeRouteParamValue[]>;

export interface SnakeRouteOptions {
  type?: SnakeRouteType;
  url?: string;
  params?: SnakeRouteParams;
  delta?: number;
  animationType?: string;
  animationDuration?: number;
}

type SnakeNavigationMethod = 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | 'navigateBack';

const routeTypeMap: Record<SnakeRouteType, SnakeNavigationMethod> = {
  navigateTo: 'navigateTo',
  to: 'navigateTo',
  redirect: 'redirectTo',
  redirectTo: 'redirectTo',
  switchTab: 'switchTab',
  tab: 'switchTab',
  reLaunch: 'reLaunch',
  navigateBack: 'navigateBack',
  back: 'navigateBack',
};

export function sleep(delay = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function guid(prefix = 'snake'): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export function getSystemInfo(): UniApp.GetSystemInfoResult {
  return uni.getSystemInfoSync();
}

export function getRect(selector: string, instance?: unknown): Promise<SelectorRect> {
  return new Promise((resolve) => {
    let query = uni.createSelectorQuery();
    const target = (instance as { proxy?: unknown } | undefined)?.proxy ?? instance;
    if (target && typeof query.in === 'function') query = query.in(target);
    query
      .select(selector)
      .boundingClientRect((rect) => resolve((rect || { width: 0, height: 0, top: 0, left: 0 }) as SelectorRect))
      .exec();
  });
}

export function toast(title: string, duration = 2000): void {
  if (!title) return;
  uni.showToast({ title: String(title), icon: 'none', duration });
}

export function navTo(url?: string): void {
  if (!url) return;
  if (/^https?:\/\//i.test(url)) {
    // H5 外链沿用浏览器跳转，其余平台交由业务方提供 web-view 页面。
    // #ifdef H5
    window.location.href = url;
    // #endif
    return;
  }
  uni.navigateTo({ url, fail: () => uni.switchTab({ url }) });
}

function appendQueryParams(url: string, params?: SnakeRouteParams): string {
  if (!params) return url;
  const entries: string[] = [];
  Object.entries(params).forEach(([key, rawValue]) => {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    values.forEach(value => {
      if (value === null || value === undefined) return;
      entries.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    });
  });
  if (!entries.length) return url;
  const hashIndex = url.indexOf('#');
  const path = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
  const separator = path.includes('?') ? (path.endsWith('?') || path.endsWith('&') ? '' : '&') : '?';
  return `${path}${separator}${entries.join('&')}${hash}`;
}

function routeError(message: string): Error {
  return new Error(`[Snake UI] ${message}`);
}

export function route(url: string, params?: SnakeRouteParams): Promise<void>;
export function route(options: SnakeRouteOptions): Promise<void>;
export function route(input: string | SnakeRouteOptions, params?: SnakeRouteParams): Promise<void> {
  const options: SnakeRouteOptions = typeof input === 'string' ? { url: input, params } : input || {};
  const requestedType = options.type || 'navigateTo';
  const method = routeTypeMap[requestedType];
  if (!method) return Promise.reject(routeError(`Unsupported route type: ${String(requestedType)}.`));

  const platformMethod = (uni as unknown as Record<string, unknown>)[method];
  if (typeof platformMethod !== 'function') return Promise.reject(routeError(`${method} is unavailable on this platform.`));

  let navigationOptions: Record<string, unknown>;
  if (method === 'navigateBack') {
    navigationOptions = { delta: Math.max(1, Math.trunc(Number(options.delta) || 1)) };
  } else {
    const url = String(options.url || '').trim();
    if (!url) return Promise.reject(routeError(`${method} requires a non-empty url.`));
    navigationOptions = { url: method === 'switchTab' ? url : appendQueryParams(url, options.params) };
    if (method === 'navigateTo' || method === 'redirectTo') {
      if (options.animationType !== undefined) navigationOptions.animationType = options.animationType;
      if (options.animationDuration !== undefined) navigationOptions.animationDuration = options.animationDuration;
    }
  }

  return new Promise((resolve, reject) => {
    (platformMethod as (options: Record<string, unknown>) => void)({
      ...navigationOptions,
      success: () => resolve(),
      fail: (error: { errMsg?: string }) => reject(routeError(error?.errMsg || `${method} failed.`)),
    });
  });
}

export function getQueryParams(url: string): Record<string, string> {
  const query = url.split('?')[1]?.split('#')[0] || '';
  return query.split('&').reduce<Record<string, string>>((result, part) => {
    if (!part) return result;
    const [key, value = ''] = part.split('=');
    result[decodeURIComponent(key.replace(/\+/g, ' '))] = decodeURIComponent(value.replace(/\+/g, ' '));
    return result;
  }, {});
}

export function formatTime(value: string | number | Date, pattern = 'yyyy-mm-dd hh:MM:ss'): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    mm: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
    hh: String(date.getHours()).padStart(2, '0'),
    MM: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };
  return pattern.replace(/yyyy|mm|dd|hh|MM|ss/g, (token) => parts[token]);
}
