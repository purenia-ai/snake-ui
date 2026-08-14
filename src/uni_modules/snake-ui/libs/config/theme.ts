import { computed, reactive, ref } from 'vue';
import { isSnakeDebugMode, snakeConfig } from './state';
import type { SnakeDarkMode, SnakeTheme, SnakeThemeColor, SnakeThemeOption } from './types';

const THEME_STORAGE_KEY = 'snake-ui-theme';
const DARK_MODE_STORAGE_KEY = 'snake-ui-dark-mode';

export const snakeLightPalette: SnakeThemeColor = {
    primary: '#00a86f',
    primaryDark: '#008d5d',
    primaryDisabled: '#9ad9c3',
    primaryLight: '#e8f8f2',
    success: '#19be6b',
    successDark: '#18a45f',
    successDisabled: '#9bd8b6',
    successLight: '#e8f7ef',
    warning: '#f59e0b',
    warningDark: '#d98700',
    warningDisabled: '#f7d99d',
    warningLight: '#fff7e6',
    error: '#ef4444',
    errorDark: '#d73535',
    errorDisabled: '#f3aaaa',
    errorLight: '#fff0f0',
    info: '#909399',
    infoDark: '#73767a',
    infoDisabled: '#c8c9cc',
    infoLight: '#f4f4f5',
    white: '#ffffff',
    black: '#000000',
    text: '#303133',
    textSecondary: '#606266',
    textMuted: '#909399',
    textLight: '#c0c4cc',
    border: '#dcdfe6',
    divider: '#e4e7ed',
    mask: 'rgba(0, 0, 0, 0.45)',
    shadow: 'rgba(15, 30, 24, 0.12)',
    background: '#f5f6f8',
    surface: '#ffffff',
    surfaceMuted: '#f7f8fa',
    notice: '#f59e0b',
    noticeBackground: '#fff8e6'
};

export const snakeDarkPalette: SnakeThemeColor = {
    primary: '#38d49b',
    primaryDark: '#20bf85',
    primaryDisabled: '#285f4c',
    primaryLight: '#15382c',
    success: '#4ade80',
    successDark: '#22b862',
    successDisabled: '#2f4d3d',
    successLight: '#10291f',
    warning: '#fbbf24',
    warningDark: '#d9a10d',
    warningDisabled: '#59491e',
    warningLight: '#302607',
    error: '#ff6b6b',
    errorDark: '#df4e4e',
    errorDisabled: '#5c3030',
    errorLight: '#321818',
    info: '#a0a7a3',
    infoDark: '#858d88',
    infoDisabled: '#424946',
    infoLight: '#232826',
    white: '#ffffff',
    black: '#000000',
    text: '#eef5f2',
    textSecondary: '#b1bdb8',
    textMuted: '#89958f',
    textLight: '#66716c',
    border: '#303936',
    divider: '#2b3330',
    mask: 'rgba(0, 0, 0, 0.66)',
    shadow: 'rgba(0, 0, 0, 0.34)',
    background: '#101312',
    surface: '#151918',
    surfaceMuted: '#1d2321',
    notice: '#f6c453',
    noticeBackground: '#302607'
};

export const defaultSnakeTheme: SnakeTheme = {
    name: 'snake',
    label: 'Snake 绿',
    description: 'Snake UI 默认明暗主题',
    color: snakeLightPalette,
    darkColor: snakeDarkPalette
};

export const snakeThemes = ref<SnakeTheme[]>([defaultSnakeTheme]);
export const currentSnakeTheme = ref<SnakeTheme>(defaultSnakeTheme);
export const snakeDarkMode = ref<SnakeDarkMode>('light');
export const snakeSystemDark = ref(false);
export const snakeColor = reactive<SnakeThemeColor>({ ...snakeLightPalette });
export const snakeCssVars = ref<Record<string, string>>({});

let listenersReady = false;
let initialized = false;
let lastCssKeys: string[] = [];

const tokenNames: Record<keyof SnakeThemeColor, string> = {
    primary: '--snake-color-primary',
    primaryDark: '--snake-color-primary-dark',
    primaryDisabled: '--snake-color-primary-disabled',
    primaryLight: '--snake-color-primary-light',
    success: '--snake-color-success',
    successDark: '--snake-color-success-dark',
    successDisabled: '--snake-color-success-disabled',
    successLight: '--snake-color-success-light',
    warning: '--snake-color-warning',
    warningDark: '--snake-color-warning-dark',
    warningDisabled: '--snake-color-warning-disabled',
    warningLight: '--snake-color-warning-light',
    error: '--snake-color-error',
    errorDark: '--snake-color-error-dark',
    errorDisabled: '--snake-color-error-disabled',
    errorLight: '--snake-color-error-light',
    info: '--snake-color-info',
    infoDark: '--snake-color-info-dark',
    infoDisabled: '--snake-color-info-disabled',
    infoLight: '--snake-color-info-light',
    white: '--snake-color-white',
    black: '--snake-color-black',
    text: '--snake-color-text',
    textSecondary: '--snake-color-text-secondary',
    textMuted: '--snake-color-text-muted',
    textLight: '--snake-color-text-light',
    border: '--snake-color-border',
    divider: '--snake-color-divider',
    mask: '--snake-color-mask',
    shadow: '--snake-color-shadow',
    background: '--snake-color-background',
    surface: '--snake-color-surface',
    surfaceMuted: '--snake-color-surface-muted',
    notice: '--snake-color-notice',
    noticeBackground: '--snake-color-notice-background'
};

function readStorage<T>(key: string): T | undefined {
    try {
        if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') return undefined;
        const value = uni.getStorageSync(key);
        return value === '' || value == null ? undefined : (value as T);
    } catch (error) {
        if (isSnakeDebugMode('warn')) console.warn(`[Snake UI] failed to read ${key}`, error);
        return undefined;
    }
}

function writeStorage(key: string, value: unknown): void {
    try {
        if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
            uni.setStorageSync(key, value);
        }
    } catch (error) {
        if (isSnakeDebugMode('warn')) console.warn(`[Snake UI] failed to write ${key}`, error);
    }
}

function detectSystemDark(): boolean {
    try {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
            return (uni.getSystemInfoSync() as { theme?: string }).theme === 'dark';
        }
    } catch (error) {
        if (isSnakeDebugMode('warn')) console.warn('[Snake UI] failed to detect system theme', error);
    }
    return false;
}

function prepareListeners(): void {
    if (listenersReady) return;
    listenersReady = true;
    snakeSystemDark.value = detectSystemDark();
    try {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            media.addEventListener?.('change', event => {
                snakeSystemDark.value = event.matches;
                if (snakeDarkMode.value === 'auto') applySnakeTheme();
            });
        }
        if (typeof uni !== 'undefined' && typeof uni.onThemeChange === 'function') {
            uni.onThemeChange(event => {
                snakeSystemDark.value = event.theme === 'dark';
                if (snakeDarkMode.value === 'auto') applySnakeTheme();
            });
        }
    } catch (error) {
        if (isSnakeDebugMode('warn')) console.warn('[Snake UI] failed to watch system theme', error);
    }
}

function normalizeTheme(theme: SnakeTheme): SnakeTheme {
    return {
        ...theme,
        color: { ...snakeLightPalette, ...theme.color },
        darkColor: { ...snakeDarkPalette, ...theme.darkColor }
    };
}

function mergeThemes(custom: SnakeTheme[]): SnakeTheme[] {
    const map = new Map<string, SnakeTheme>([[defaultSnakeTheme.name, defaultSnakeTheme]]);
    custom.forEach(theme => map.set(theme.name, normalizeTheme(theme)));
    return Array.from(map.values());
}

function activeMode(): 'light' | 'dark' {
    if (snakeDarkMode.value === 'auto') return snakeSystemDark.value ? 'dark' : 'light';
    return snakeDarkMode.value;
}

function createCssVars(theme: SnakeTheme, mode: 'light' | 'dark'): Record<string, string> {
    const palette = (mode === 'dark' ? theme.darkColor : theme.color) as SnakeThemeColor;
    const result: Record<string, string> = { '--snake-theme-mode': mode };
    Object.entries(palette).forEach(([key, value]) => {
        const name = tokenNames[key as keyof SnakeThemeColor];
        if (name && value != null) result[name] = String(value);
    });
    Object.assign(result, mode === 'dark' ? theme.darkCss : theme.css);
    return result;
}

function flushDocument(vars: Record<string, string>, mode: 'light' | 'dark'): void {
    if (typeof document === 'undefined' || !document.documentElement) return;
    const root = document.documentElement;
    lastCssKeys.forEach(key => root.style.removeProperty(key));
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
    lastCssKeys = Object.keys(vars);
    root.dataset.snakeThemeMode = mode;
    root.classList.remove('snake-theme-light', 'snake-theme-dark');
    root.classList.add(`snake-theme-${mode}`);
}

export function applySnakeTheme(): void {
    const mode = activeMode();
    const palette = (mode === 'dark' ? currentSnakeTheme.value.darkColor : currentSnakeTheme.value.color) as
        SnakeThemeColor | undefined;
    Object.assign(snakeColor, mode === 'dark' ? snakeDarkPalette : snakeLightPalette, palette || {});
    const vars = createCssVars(currentSnakeTheme.value, mode);
    snakeCssVars.value = vars;
    flushDocument(vars, mode);
}

export function initSnakeTheme(option?: SnakeThemeOption): void {
    prepareListeners();
    let themes: SnakeTheme[] = [];
    let defaultTheme = snakeConfig.defaultTheme;
    let defaultDarkMode = snakeConfig.defaultDarkMode;
    let force = false;

    if (Array.isArray(option)) {
        themes = option;
    } else if (
        option &&
        typeof option === 'object' &&
        ('themes' in option || 'defaultTheme' in option || 'defaultDarkMode' in option || 'force' in option)
    ) {
        themes = option.themes || [];
        defaultTheme = option.defaultTheme || defaultTheme;
        defaultDarkMode = option.defaultDarkMode || defaultDarkMode;
        force = Boolean(option.force);
    } else if (option && typeof option === 'object') {
        themes = [{ ...defaultSnakeTheme, color: { ...defaultSnakeTheme.color, ...option } }];
    }

    if (!initialized || force || themes.length) snakeThemes.value = mergeThemes(themes);
    const savedTheme = force ? undefined : readStorage<string>(THEME_STORAGE_KEY);
    const savedMode = force ? undefined : readStorage<SnakeDarkMode>(DARK_MODE_STORAGE_KEY);
    currentSnakeTheme.value =
        snakeThemes.value.find(theme => theme.name === (savedTheme || defaultTheme)) || snakeThemes.value[0];
    snakeDarkMode.value = savedMode || defaultDarkMode;
    initialized = true;
    applySnakeTheme();
}

export function setSnakeTheme(name: string): boolean {
    const theme = snakeThemes.value.find(item => item.name === name);
    if (!theme) return false;
    currentSnakeTheme.value = theme;
    writeStorage(THEME_STORAGE_KEY, name);
    applySnakeTheme();
    return true;
}

export function setSnakeDarkMode(mode: SnakeDarkMode): void {
    snakeDarkMode.value = mode;
    writeStorage(DARK_MODE_STORAGE_KEY, mode);
    applySnakeTheme();
}

export function toggleSnakeDarkMode(): void {
    setSnakeDarkMode(activeMode() === 'dark' ? 'light' : 'dark');
}

export function isSnakeDarkMode(): boolean {
    return activeMode() === 'dark';
}

export function setSnakeThemeColor(colors: Partial<SnakeThemeColor>): void {
    const key = activeMode() === 'dark' ? 'darkColor' : 'color';
    currentSnakeTheme.value = {
        ...currentSnakeTheme.value,
        [key]: { ...currentSnakeTheme.value[key], ...colors }
    };
    applySnakeTheme();
}

export const snakeThemeStyle = computed<Record<string, string>>(() => snakeCssVars.value);

export function resetSnakeTheme(): void {
    initialized = false;
    snakeThemes.value = [defaultSnakeTheme];
    currentSnakeTheme.value = defaultSnakeTheme;
    snakeDarkMode.value = 'light';
    snakeSystemDark.value = false;
    applySnakeTheme();
}
