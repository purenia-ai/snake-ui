import type { RequestAdapter } from '../runtime';
import type { App } from 'vue';
import { deepMerge } from '../function';
import { translate } from '../../locale';
import type {
    RequestConfig,
    RequestInterceptor,
    RequestMeta,
    RequestMethod,
    RequestOptions,
    RequestResponse,
    RequestSetup,
    RequestTransport
} from '../config/types';

const defaultConfig: Required<Omit<RequestConfig, 'baseUrl'>> & Pick<RequestConfig, 'baseUrl'> = {
    baseUrl: '',
    header: {},
    timeout: 60000,
    dataType: 'json',
    responseType: 'text',
    method: 'POST',
    meta: { loading: false, toast: false, originalData: true }
};

export class RequestError extends Error {
    readonly kind: 'canceled' | 'http' | 'transport' | 'interceptor';
    readonly config?: RequestOptions;
    readonly response?: unknown;
    readonly statusCode?: number;
    /** 原始宿主网络错误，例如支付宝小程序返回的 errMsg。 */
    readonly platformError?: unknown;

    constructor(
        message: string,
        options: {
            kind?: RequestError['kind'];
            config?: RequestOptions;
            response?: unknown;
            statusCode?: number;
            platformError?: unknown;
            cause?: unknown;
        } = {}
    ) {
        super(message, options.cause === undefined ? undefined : { cause: options.cause });
        this.name = 'RequestError';
        this.kind = options.kind || 'transport';
        this.config = options.config;
        this.response = options.response;
        this.statusCode = options.statusCode;
        this.platformError = options.platformError;
    }
}

function joinUrl(baseUrl: string, url: string): string {
    if (!baseUrl || /^https?:\/\//i.test(url)) return url;
    return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}

function isHttpResponse(value: unknown): value is RequestResponse {
    return Boolean(value && typeof value === 'object' && typeof (value as RequestResponse).statusCode === 'number');
}

function isSuccessfulStatus(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'string' && error) return error;
    if (error && typeof error === 'object') {
        const message =
            (error as { errMsg?: unknown; message?: unknown }).errMsg || (error as { message?: unknown }).message;
        if (typeof message === 'string' && message) return message;
    }
    return fallback;
}

let loadingCount = 0;

function showLoading(): void {
    loadingCount += 1;
    if (loadingCount > 1) return;
    if (typeof uni !== 'undefined' && typeof uni.showLoading === 'function') {
        uni.showLoading({ title: translate('common.loading'), mask: true });
    }
}

function hideLoading(): void {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0 && typeof uni !== 'undefined' && typeof uni.hideLoading === 'function') uni.hideLoading();
}

function showError(message: string): void {
    if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
        uni.showToast({ title: message, icon: 'none' });
    }
}

function uniTransport(options: RequestOptions): Promise<RequestResponse> {
    return new Promise((resolve, reject) => {
        if (typeof uni === 'undefined' || typeof uni.request !== 'function') {
            reject(new RequestError('[Snake UI] uni.request is unavailable.', { kind: 'transport', config: options }));
            return;
        }
        // meta、baseUrl 和 params 是 Snake 的内部配置，不应透传给各小程序运行时。
        const { baseUrl: _baseUrl, meta: _meta, params: _params, ...platformOptions } = options;
        uni.request({
            ...platformOptions,
            method: options.method || 'GET',
            data: options.data ?? options.params,
            // 支付宝小程序会把 HTTP 401 等非成功状态送入 fail，但 complete 仍能提供 statusCode。
            // 只要收到 HTTP 状态就交给上层响应拦截器；没有状态码时才是网络层失败。
            complete: result => {
                if (isHttpResponse(result)) {
                    resolve(result);
                    return;
                }
                reject(
                    new RequestError(getErrorMessage(result, translate('network.error')), {
                        kind: 'transport',
                        config: options,
                        platformError: result,
                        cause: result
                    })
                );
            }
        });
    });
}

export class Request {
    config: RequestConfig = deepMerge(defaultConfig, {});
    interceptor: RequestInterceptor = {};
    private transport?: RequestTransport;
    private legacyAdapter?: RequestAdapter;

    setConfig(config: RequestConfig = {}): void {
        this.config = deepMerge(this.config, config);
    }

    setInterceptor(interceptor: RequestInterceptor = {}): void {
        this.interceptor = { ...this.interceptor, ...interceptor };
    }

    setTransport(transport?: RequestTransport): void {
        this.transport = transport;
    }

    setLegacyAdapter(adapter?: RequestAdapter): void {
        this.legacyAdapter = adapter;
    }

    private mergeOptions(options: RequestOptions): RequestOptions {
        const meta = deepMerge((this.config.meta || {}) as RequestMeta, options.meta || {});
        const header = deepMerge((this.config.header || {}) as Record<string, unknown>, options.header || {});
        return {
            ...this.config,
            ...options,
            url: joinUrl(this.config.baseUrl || '', options.url),
            method: options.method || 'POST',
            header,
            meta
        };
    }

    private async send(options: RequestOptions): Promise<RequestResponse | unknown> {
        // 自定义 transport 优先；legacy adapter 仅兼容 GET/POST，其余方法仍交由 uni.request。
        if (this.transport) return this.transport(options);
        if (this.legacyAdapter && options.method === 'GET') {
            return {
                data: await this.legacyAdapter.get(options.url, options.params || (options.data as any)),
                statusCode: 200
            };
        }
        if (this.legacyAdapter && options.method === 'POST') {
            return {
                data: await this.legacyAdapter.post(options.url, (options.data || {}) as Record<string, unknown>),
                statusCode: 200
            };
        }
        return uniTransport(options);
    }

    async request<T = unknown>(options: RequestOptions): Promise<T> {
        let config = this.mergeOptions(options);
        if (this.interceptor.request) {
            let intercepted: RequestOptions | false;
            try {
                intercepted = await this.interceptor.request(config);
            } catch (error) {
                throw new RequestError('[Snake UI] request interceptor failed.', {
                    kind: 'interceptor',
                    config,
                    cause: error
                });
            }
            if (intercepted === false) {
                throw new RequestError(translate('network.canceled'), { kind: 'canceled', config });
            }
            config = intercepted;
        }
        const meta = config.meta || {};
        if (meta.loading) showLoading();
        try {
            const raw = await this.send(config);
            if (isHttpResponse(raw)) raw.config = config;
            // originalData=true 时 interceptor 接收完整平台响应，状态码校验也由它负责；否则本层校验并仅传 data。
            if (isHttpResponse(raw) && !meta.originalData && !isSuccessfulStatus(raw.statusCode)) {
                throw new RequestError(`HTTP ${raw.statusCode}`, {
                    kind: 'http',
                    config,
                    response: raw,
                    statusCode: raw.statusCode
                });
            }
            const response = meta.originalData || !isHttpResponse(raw) ? raw : raw.data;
            if (!this.interceptor.response) return response as T;
            let intercepted: T | false;
            try {
                intercepted = await this.interceptor.response(response, config);
            } catch (error) {
                throw new RequestError('[Snake UI] response interceptor failed.', {
                    kind: 'interceptor',
                    config,
                    response,
                    cause: error
                });
            }
            if (intercepted === false) {
                throw new RequestError('[Snake UI] response rejected by interceptor.', {
                    kind: 'interceptor',
                    config,
                    response
                });
            }
            return intercepted as T;
        } catch (error) {
            const normalized =
                error instanceof RequestError
                    ? error
                    : new RequestError(getErrorMessage(error, translate('network.error')), {
                          kind: 'transport',
                          config,
                          platformError: error,
                          cause: error
                      });
            if (meta.toast) showError(normalized.message);
            throw normalized;
        } finally {
            if (meta.loading) hideLoading();
        }
    }

    get<T = unknown>(url: string, data: Record<string, unknown> = {}, options: Partial<RequestOptions> = {}) {
        return this.request<T>({ ...options, url, data, params: data, method: 'GET' });
    }

    post<T = unknown>(url: string, data: unknown = {}, options: Partial<RequestOptions> = {}) {
        return this.request<T>({ ...options, url, data, method: 'POST' });
    }

    put<T = unknown>(url: string, data: unknown = {}, options: Partial<RequestOptions> = {}) {
        return this.request<T>({ ...options, url, data, method: 'PUT' });
    }

    delete<T = unknown>(url: string, data: unknown = {}, options: Partial<RequestOptions> = {}) {
        return this.request<T>({ ...options, url, data, method: 'DELETE' });
    }

    reset(): void {
        this.config = deepMerge(defaultConfig, {});
        this.interceptor = {};
        this.transport = undefined;
        this.legacyAdapter = undefined;
        loadingCount = 0;
    }
}

/** 共享请求单例。 */
export const http = new Request();

export interface HttpPluginOptions {
    requestConfig?: RequestConfig;
    interceptor?: RequestInterceptor;
}

/**
 * Installs the shared request singleton as `$http`.
 */
export const httpPlugin = {
    install(app: App, options: HttpPluginOptions = {}): void {
        if (options.interceptor) http.setInterceptor(options.interceptor);
        if (options.requestConfig) http.setConfig(options.requestConfig);
        (app.config.globalProperties as Record<string, unknown>).$http = http;
    }
};

export function configureHttp(setup?: RequestSetup, adapter?: RequestAdapter): Request {
    if (setup?.config) http.setConfig(setup.config);
    if (setup?.interceptor) http.setInterceptor(setup.interceptor);
    if (setup && 'transport' in setup) http.setTransport(setup.transport);
    if (adapter) http.setLegacyAdapter(adapter);
    return http;
}

export function isFunction(value: unknown): value is (...args: any[]) => unknown {
    return typeof value === 'function';
}

export function isPromise(value: unknown): value is Promise<unknown> {
    return Boolean(
        value &&
        typeof (value as Promise<unknown>).then === 'function' &&
        typeof (value as Promise<unknown>).catch === 'function'
    );
}

export class AutoHttp {
    static Builder = class<T = unknown> {
        constructor(private readonly instance: Request | ((options: RequestOptions) => Promise<T>)) {}

        dispatch(urlConfig: Record<string, RequestOptions>, extra: Record<string, unknown> = {}): Record<string, any> {
            const api: Record<string, any> = {};
            for (const name of Object.keys(urlConfig)) api[name] = this.use.bind(this, urlConfig[name]);
            return { ...api, ...extra };
        }

        use(
            urlConfig: RequestOptions,
            config: Partial<Omit<RequestOptions, 'url'>> & { url?: string | (() => string) } = {}
        ): Promise<T> {
            const url: string = isFunction(config.url)
                ? `${urlConfig.url}${config.url()}`
                : (config.url ?? urlConfig.url);
            const { url: _url, ...overrides } = config;
            const method = (config.method ?? urlConfig.method ?? 'GET') as RequestMethod;
            const options = deepMerge(urlConfig, { ...overrides, url, method }) as RequestOptions;
            return this.instance instanceof Request ? this.instance.request<T>(options) : this.instance(options);
        }
    };
}

export default httpPlugin;
