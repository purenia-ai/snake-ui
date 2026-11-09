export type DarkMode = 'light' | 'dark' | 'auto';
export type DebugLevel = 'log' | 'warn' | 'error';

export interface ThemeColor {
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

export interface Theme {
    name: string;
    label?: string;
    description?: string;
    color: Partial<ThemeColor>;
    darkColor?: Partial<ThemeColor>;
    /** 主题自定义 CSS 变量（亮色），与色板令牌一起写入页面根部。 */
    css?: Record<string, string>;
    /** 主题自定义 CSS 变量（暗色），暗色模式下覆盖 `css` 的同名键。 */
    darkCss?: Record<string, string>;
}

export interface ThemeConfig {
    themes?: Theme[];
    defaultTheme?: string;
    defaultDarkMode?: DarkMode;
    force?: boolean;
    /** 广播到全部主题的自定义变量（亮色），主题自身同名键优先。 */
    css?: Record<string, string>;
    /** 广播到全部主题的自定义变量（暗色），主题自身同名键优先。 */
    darkCss?: Record<string, string>;
}

/**
 * 单主题配置形态：颜色令牌 + 可选的元信息与自定义变量。
 * 未列出的颜色令牌继承内置色板；未列出的暗色令牌由亮色派生。
 */
export type SingleTheme = Partial<ThemeColor> & {
    name?: string;
    label?: string;
    description?: string;
    darkColor?: Partial<ThemeColor>;
    css?: Record<string, string>;
    darkCss?: Record<string, string>;
    defaultDarkMode?: DarkMode;
    force?: boolean;
};

export type ThemeOption = SingleTheme | Theme[] | ThemeConfig;

export interface Locale {
    name: string;
    label?: string;
    messages: Record<string, unknown>;
}

export interface LocaleConfig {
    locales?: Locale[];
    defaultLocale?: string;
    force?: boolean;
}

export type LocaleOption = string | Locale[] | LocaleConfig;
