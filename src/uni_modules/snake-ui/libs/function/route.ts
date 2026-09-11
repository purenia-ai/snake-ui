import { getQueryParams } from './queryParams';

export type RouteType =
    'navigateTo' | 'to' | 'redirect' | 'redirectTo' | 'switchTab' | 'tab' | 'reLaunch' | 'navigateBack' | 'back';
export type RouteParamValue = string | number | boolean | null | undefined;
export type RouteParams = Record<string, RouteParamValue | readonly RouteParamValue[]>;

export interface RouteOptions {
    type?: RouteType;
    url?: string;
    params?: RouteParams;
    delta?: number;
    animationType?: string;
    animationDuration?: number;
}

type NavigationMethod = 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | 'navigateBack';

const routeTypeMap: Record<RouteType, NavigationMethod> = {
    navigateTo: 'navigateTo',
    to: 'navigateTo',
    redirect: 'redirectTo',
    redirectTo: 'redirectTo',
    switchTab: 'switchTab',
    tab: 'switchTab',
    reLaunch: 'reLaunch',
    navigateBack: 'navigateBack',
    back: 'navigateBack'
};

function appendQueryParams(url: string, params?: RouteParams): string {
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

export function route(url: string, params?: RouteParams): Promise<void>;
export function route(options: RouteOptions): Promise<void>;
export function route(input: string | RouteOptions, params?: RouteParams): Promise<void> {
    const options: RouteOptions = typeof input === 'string' ? { url: input, params } : input || {};
    const requestedType = options.type || 'navigateTo';
    const method = routeTypeMap[requestedType];
    if (!method) return Promise.reject(routeError(`Unsupported route type: ${String(requestedType)}.`));

    const platformMethod = (uni as unknown as Record<string, unknown>)[method];
    if (typeof platformMethod !== 'function')
        return Promise.reject(routeError(`${method} is unavailable on this platform.`));

    let navigationOptions: Record<string, unknown>;
    if (method === 'navigateBack') {
        navigationOptions = { delta: Math.max(1, Math.trunc(Number(options.delta) || 1)) };
    } else {
        const url = String(options.url || '').trim();
        if (!url) return Promise.reject(routeError(`${method} requires a non-empty url.`));
        navigationOptions = { url: method === 'switchTab' ? url : appendQueryParams(url, options.params) };
        if (method === 'navigateTo' || method === 'redirectTo') {
            if (options.animationType !== undefined) navigationOptions.animationType = options.animationType;
            if (options.animationDuration !== undefined)
                navigationOptions.animationDuration = options.animationDuration;
        }
    }

    return new Promise((resolve, reject) => {
        (platformMethod as (options: Record<string, unknown>) => void)({
            ...navigationOptions,
            success: () => resolve(),
            fail: (error: { errMsg?: string }) => reject(routeError(error?.errMsg || `${method} failed.`))
        });
    });
}

function parseJsonObject(raw: string | undefined): Record<string, unknown> {
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
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

    // 小程序打开其他小程序：/miniprogram?appId=wx...&path=pages/...&extra={...}
    // 运行时探测跨小程序 API，避免平台条件编译差异。
    if (url.includes('/miniprogram')) {
        if (typeof uni.navigateToMiniProgram !== 'function') return;
        const query = getQueryParams(url);
        const appId = query.wxAppId || query.aliAppId || query.appId || '';
        if (!appId) return;
        uni.navigateToMiniProgram({
            appId,
            path: query.path || '',
            extraData: parseJsonObject(query.extra),
            envVersion: (query.envVersion as 'release' | 'develop' | 'trial') || 'release',
            fail: () => {}
        });
        return;
    }

    // 微信客服：/serviceChat?url=...&corpId=...
    if (url.includes('/serviceChat')) {
        if (typeof uni.openCustomerServiceChat !== 'function') return;
        const query = getQueryParams(url);
        uni.openCustomerServiceChat({
            extInfo: { url: query.url || '' },
            corpId: query.corpId || ''
        });
        return;
    }

    uni.navigateTo({ url, fail: () => uni.switchTab({ url }) });
}
