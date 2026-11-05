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
    css?: Record<string, string>;
    darkCss?: Record<string, string>;
}

export interface ThemeConfig {
    themes?: Theme[];
    defaultTheme?: string;
    defaultDarkMode?: DarkMode;
    force?: boolean;
}

export type ThemeOption = Partial<ThemeColor> | Theme[] | ThemeConfig;

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
