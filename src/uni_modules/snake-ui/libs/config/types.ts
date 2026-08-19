export type SnakeDarkMode = 'light' | 'dark' | 'auto';
export type SnakeDebugLevel = 'log' | 'warn' | 'error';

export interface SnakeThemeColor {
    primary: string;
    primaryDark: string;
    primaryDeep: string;
    primaryDeeper: string;
    primaryDisabled: string;
    primaryLight: string;
    primaryInk: string;
    success: string;
    successDark: string;
    successDisabled: string;
    successLight: string;
    warning: string;
    warningDark: string;
    warningDisabled: string;
    warningLight: string;
    error: string;
    errorDark: string;
    errorDisabled: string;
    errorLight: string;
    info: string;
    infoDark: string;
    infoDisabled: string;
    infoLight: string;
    white: string;
    black: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    textLight: string;
    border: string;
    divider: string;
    mask: string;
    shadow: string;
    background: string;
    surface: string;
    surfaceMuted: string;
    notice: string;
    noticeBackground: string;
}

export interface SnakeTheme {
    name: string;
    label?: string;
    description?: string;
    color: Partial<SnakeThemeColor>;
    darkColor?: Partial<SnakeThemeColor>;
    css?: Record<string, string>;
    darkCss?: Record<string, string>;
}

export interface SnakeThemeConfig {
    themes?: SnakeTheme[];
    defaultTheme?: string;
    defaultDarkMode?: SnakeDarkMode;
    force?: boolean;
}

export type SnakeThemeOption = Partial<SnakeThemeColor> | SnakeTheme[] | SnakeThemeConfig;

export interface SnakeLocale {
    name: string;
    label?: string;
    messages: Record<string, unknown>;
}

export interface SnakeLocaleConfig {
    locales?: SnakeLocale[];
    defaultLocale?: string;
    force?: boolean;
}

export type SnakeLocaleOption = string | SnakeLocale[] | SnakeLocaleConfig;

export interface SnakeHttpMeta {
    loading?: boolean;
    toast?: boolean;
    originalData?: boolean;
    [key: string]: unknown;
}

export type SnakeHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface SnakeHttpOptions {
    url: string;
    method?: SnakeHttpMethod;
    data?: unknown;
    params?: Record<string, unknown>;
    header?: Record<string, string>;
    timeout?: number;
    dataType?: string;
    responseType?: string;
    meta?: SnakeHttpMeta;
    [key: string]: unknown;
}

export interface SnakeHttpResponse<T = unknown> {
    data: T;
    statusCode: number;
    header?: Record<string, unknown>;
    cookies?: string[];
    errMsg?: string;
    config?: SnakeHttpOptions;
    [key: string]: unknown;
}

export interface SnakeHttpConfig {
    baseUrl?: string;
    header?: Record<string, string>;
    timeout?: number;
    dataType?: string;
    responseType?: string;
    meta?: SnakeHttpMeta;
}

export interface SnakeHttpInterceptor {
    request?: (options: SnakeHttpOptions) => SnakeHttpOptions | false | Promise<SnakeHttpOptions | false>;
    response?: <T>(response: T, config: SnakeHttpOptions) => T | false | Promise<T | false>;
}

export type SnakeHttpTransport = (options: SnakeHttpOptions) => Promise<SnakeHttpResponse | unknown>;

export interface SnakeHttpSetup {
    config?: SnakeHttpConfig;
    interceptor?: SnakeHttpInterceptor;
    transport?: SnakeHttpTransport;
}
