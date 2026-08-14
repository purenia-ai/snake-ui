export type SelectorRect = UniApp.NodeInfo & { width: number; height: number; top: number; left: number };

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

export function getQueryParams(url: string): Record<string, string> {
  const query = url.split('?')[1]?.split('#')[0] || '';
  return query.split('&').reduce<Record<string, string>>((result, part) => {
    if (!part) return result;
    const [key, value = ''] = part.split('=');
    result[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
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
