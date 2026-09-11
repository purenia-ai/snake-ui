import type { DebugLevel, LocaleOption, RequestSetup, ThemeOption } from '../config/types';
import type { CmsOptions } from '../cms/types';

/** 由宿主项目实现的最小请求能力；Snake UI 不绑定某个 HTTP 库。 */
export interface RequestAdapter {
    get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
    post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T>;
}

export interface CacheAdapter {
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T, ttlSeconds?: number): void;
    delete(key: string): void;
}

export interface RuntimeConfig {
    baseUrl?: string;
    [key: string]: unknown;
}

/**
 * 宿主应用在安装 Snake UI 时提供的运行期能力。
 * request、cache、config 与 cms 会存入 runtime；其余字段由 UI 初始化阶段消费。
 */
export interface RuntimeOptions {
    request?: RequestAdapter;
    cache?: CacheAdapter;
    config?: RuntimeConfig;
    theme?: ThemeOption;
    locale?: LocaleOption;
    http?: RequestSetup;
    debugMode?: boolean | DebugLevel | DebugLevel[];
    cms?: CmsOptions;
}

export class RuntimeError extends Error {
    readonly component: string;
    readonly capability: keyof RuntimeOptions;

    constructor(component: string, capability: keyof RuntimeOptions) {
        super(
            `[Snake UI] ${component} requires the "${capability}" adapter. ` +
                `Configure it with app.use(SnakeUI, { ${capability}: ... }).`
        );
        this.name = 'RuntimeError';
        this.component = component;
        this.capability = capability;
    }
}
