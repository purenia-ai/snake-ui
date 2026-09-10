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

    constructor(
        message: string,
        options: {
            kind?: RequestError['kind'];
            config?: RequestOptions;
            response?: unknown;
            statusCode?: number;
            cause?: unknown;
        } = {}
    ) {
        super(message, options.cause === undefined ? undefined : { cause: options.cause });
        this.name = 'RequestError';
        this.kind = options.kind || 'transport';
        this.config = options.config;
        this.response = options.response;
        this.statusCode = options.statusCode;
    }
}

function joinUrl(baseUrl: string, url: string): string {
    if (!baseUrl || /^https?:\/\//i.test(url)) return url;
    return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}

function isHttpResponse(value: unknown): value is RequestResponse {
    return Boolean(value && typeof value === 'object' && typeof (value as RequestResponse).statusCode === 'number');
}

function showLoading(): void {
    if (typeof uni !== 'undefined' && typeof uni.showLoading === 'function') {
        uni.showLoading({ title: translate('common.loading'), mask: true });
    }
}

function hideLoading(): void {
    if (typeof uni !== 'undefined' && typeof uni.hideLoading === 'function') uni.hideLoading();
}

function showError(message: string): void {
    if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
        uni.showToast({ title: message, icon: 'none' });
    }
}

function uniTransport(options: RequestOptions): Promise<RequestResponse> {
    return new Promise((resolve, reject) => {
        if (typeof uni === 'undefined' || typeof uni.request !== 'function') {
            reject(
                new RequestError('[Snake UI] uni.request is unavailable.', { kind: 'transport', config: options })
            );
            return;
        }
        uni.request({
            ...options,
            method: options.method || 'GET',
            data: options.data ?? options.params,
            success: response => resolve(response as RequestResponse),
            fail: error => reject(error)
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
            const intercepted = await this.interceptor.request(config);
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
            // uView hands the complete platform response to the interceptor when
            // originalData is enabled; status-code handling then belongs to that interceptor.
            if (isHttpResponse(raw) && !meta.originalData && raw.statusCode !== 200) {
                throw new RequestError(`HTTP ${raw.statusCode}`, {
                    kind: 'http',
                    config,
                    response: raw,
                    statusCode: raw.statusCode
                });
            }
            const response = meta.originalData || !isHttpResponse(raw) ? raw : raw.data;
            if (!this.interceptor.response) return response as T;
            const intercepted = await this.interceptor.response(response, config);
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
                    : new RequestError(translate('network.error'), {
                          kind: 'transport',
                          config,
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
    }
}

/** uView-compatible shared singleton. */
export const http = new Request();

export interface HttpPluginOptions {
    requestConfig?: RequestConfig;
    interceptor?: RequestInterceptor;
}

/**
 * Installs the shared request singleton as `$http`, matching uView's plugin API.
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
    return Boolean(value && typeof (value as Promise<unknown>).then === 'function' && typeof (value as Promise<unknown>).catch === 'function');
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
                : config.url ?? urlConfig.url;
            const { url: _url, ...overrides } = config;
            const method = (config.method ?? urlConfig.method ?? 'GET') as RequestMethod;
            const options = deepMerge(urlConfig, { ...overrides, url, method }) as RequestOptions;
            return this.instance instanceof Request
                ? this.instance.request<T>(options)
                : this.instance(options);
        }
    };
}

export default httpPlugin;
