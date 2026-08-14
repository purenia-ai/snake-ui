import type { SnakeRequestAdapter } from '../runtime';
import { deepMerge } from '../functions';
import { snakeTranslate } from '../../locale';
import type {
    SnakeHttpConfig,
    SnakeHttpInterceptor,
    SnakeHttpMeta,
    SnakeHttpOptions,
    SnakeHttpResponse,
    SnakeHttpSetup,
    SnakeHttpTransport
} from '../config/types';

const defaultConfig: Required<Omit<SnakeHttpConfig, 'baseUrl'>> & Pick<SnakeHttpConfig, 'baseUrl'> = {
    baseUrl: '',
    header: {},
    timeout: 60000,
    dataType: 'json',
    responseType: 'text',
    meta: { loading: false, toast: false, originalData: false }
};

export class SnakeHttpError extends Error {
    readonly kind: 'canceled' | 'http' | 'transport' | 'interceptor';
    readonly config?: SnakeHttpOptions;
    readonly response?: unknown;
    readonly statusCode?: number;

    constructor(
        message: string,
        options: {
            kind?: SnakeHttpError['kind'];
            config?: SnakeHttpOptions;
            response?: unknown;
            statusCode?: number;
            cause?: unknown;
        } = {}
    ) {
        super(message, options.cause === undefined ? undefined : { cause: options.cause });
        this.name = 'SnakeHttpError';
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

function isHttpResponse(value: unknown): value is SnakeHttpResponse {
    return Boolean(value && typeof value === 'object' && typeof (value as SnakeHttpResponse).statusCode === 'number');
}

function showLoading(): void {
    if (typeof uni !== 'undefined' && typeof uni.showLoading === 'function') {
        uni.showLoading({ title: snakeTranslate('common.loading'), mask: true });
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

function uniTransport(options: SnakeHttpOptions): Promise<SnakeHttpResponse> {
    return new Promise((resolve, reject) => {
        if (typeof uni === 'undefined' || typeof uni.request !== 'function') {
            reject(
                new SnakeHttpError('[Snake UI] uni.request is unavailable.', { kind: 'transport', config: options })
            );
            return;
        }
        uni.request({
            ...options,
            method: options.method || 'GET',
            data: options.data ?? options.params,
            success: response => resolve(response as SnakeHttpResponse),
            fail: error => reject(error)
        });
    });
}

export class SnakeRequest {
    config: SnakeHttpConfig = deepMerge(defaultConfig, {});
    interceptor: SnakeHttpInterceptor = {};
    private transport?: SnakeHttpTransport;
    private legacyAdapter?: SnakeRequestAdapter;

    setConfig(config: SnakeHttpConfig = {}): void {
        this.config = deepMerge(this.config, config);
    }

    setInterceptor(interceptor: SnakeHttpInterceptor = {}): void {
        this.interceptor = { ...this.interceptor, ...interceptor };
    }

    setTransport(transport?: SnakeHttpTransport): void {
        this.transport = transport;
    }

    setLegacyAdapter(adapter?: SnakeRequestAdapter): void {
        this.legacyAdapter = adapter;
    }

    private mergeOptions(options: SnakeHttpOptions): SnakeHttpOptions {
        const meta = deepMerge((this.config.meta || {}) as SnakeHttpMeta, options.meta || {});
        const header = deepMerge((this.config.header || {}) as Record<string, string>, options.header || {});
        return {
            ...this.config,
            ...options,
            url: joinUrl(this.config.baseUrl || '', options.url),
            method: options.method || 'GET',
            header,
            meta
        };
    }

    private async send(options: SnakeHttpOptions): Promise<SnakeHttpResponse | unknown> {
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

    async request<T = unknown>(options: SnakeHttpOptions): Promise<T> {
        let config = this.mergeOptions(options);
        if (this.interceptor.request) {
            const intercepted = await this.interceptor.request(config);
            if (intercepted === false) {
                throw new SnakeHttpError(snakeTranslate('network.canceled'), { kind: 'canceled', config });
            }
            config = intercepted;
        }
        const meta = config.meta || {};
        if (meta.loading) showLoading();
        try {
            const raw = await this.send(config);
            if (isHttpResponse(raw) && (raw.statusCode < 200 || raw.statusCode >= 300)) {
                throw new SnakeHttpError(`HTTP ${raw.statusCode}`, {
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
                throw new SnakeHttpError('[Snake UI] response rejected by interceptor.', {
                    kind: 'interceptor',
                    config,
                    response
                });
            }
            return intercepted as T;
        } catch (error) {
            const normalized =
                error instanceof SnakeHttpError
                    ? error
                    : new SnakeHttpError(snakeTranslate('network.error'), {
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

    get<T = unknown>(url: string, params: Record<string, unknown> = {}, options: Partial<SnakeHttpOptions> = {}) {
        return this.request<T>({ ...options, url, params, method: 'GET' });
    }

    post<T = unknown>(url: string, data: unknown = {}, options: Partial<SnakeHttpOptions> = {}) {
        return this.request<T>({ ...options, url, data, method: 'POST' });
    }

    put<T = unknown>(url: string, data: unknown = {}, options: Partial<SnakeHttpOptions> = {}) {
        return this.request<T>({ ...options, url, data, method: 'PUT' });
    }

    delete<T = unknown>(url: string, data: unknown = {}, options: Partial<SnakeHttpOptions> = {}) {
        return this.request<T>({ ...options, url, data, method: 'DELETE' });
    }

    reset(): void {
        this.config = deepMerge(defaultConfig, {});
        this.interceptor = {};
        this.transport = undefined;
        this.legacyAdapter = undefined;
    }
}

export const snakeHttp = new SnakeRequest();

export function configureSnakeHttp(setup?: SnakeHttpSetup, adapter?: SnakeRequestAdapter): SnakeRequest {
    if (setup?.config) snakeHttp.setConfig(setup.config);
    if (setup?.interceptor) snakeHttp.setInterceptor(setup.interceptor);
    if (setup && 'transport' in setup) snakeHttp.setTransport(setup.transport);
    if (adapter) snakeHttp.setLegacyAdapter(adapter);
    return snakeHttp;
}
