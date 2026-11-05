/** Per-request presentation and response options. */
export interface RequestMeta {
    loading?: boolean;
    toast?: boolean;
    originalData?: boolean;
    [key: string]: unknown;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';

export interface RequestOptions {
    url: string;
    method?: RequestMethod;
    data?: unknown;
    params?: Record<string, unknown>;
    header?: Record<string, unknown>;
    timeout?: number;
    dataType?: string;
    responseType?: string;
    meta?: RequestMeta;
    [key: string]: unknown;
}

export interface RequestResponse<T = unknown> {
    data: T;
    statusCode: number;
    header?: Record<string, unknown>;
    cookies?: string[];
    errMsg?: string;
    config?: RequestOptions;
    [key: string]: unknown;
}

/** Shared request-client defaults. */
export interface RequestConfig {
    baseUrl?: string;
    method?: RequestMethod;
    header?: Record<string, unknown>;
    timeout?: number;
    dataType?: string;
    responseType?: string;
    meta?: RequestMeta;
}

export interface RequestInterceptor {
    request?: (options: RequestOptions) => RequestOptions | false | Promise<RequestOptions | false>;
    /** response：originalData 时为完整平台响应，否则为 data。 */
    response?: (response: any, config: RequestOptions) => any;
}

/** 返回平台响应或自定义传输的任意结果，消费方用 isHttpResponse 收窄。 */
export type RequestTransport = (options: RequestOptions) => Promise<unknown>;

export interface RequestSetup {
    config?: RequestConfig;
    interceptor?: RequestInterceptor;
    transport?: RequestTransport;
}
