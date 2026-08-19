import { computed, reactive, ref } from 'vue';
import { isSnakeDebugMode, snakeConfig } from './state';
import type { SnakeDarkMode, SnakeTheme, SnakeThemeColor, SnakeThemeOption } from './types';

const THEME_STORAGE_KEY = 'snake-ui-theme';
const DARK_MODE_STORAGE_KEY = 'snake-ui-dark-mode';

export const snakeLightPalette: SnakeThemeColor = {
    primary: '#06D290',
    primaryDark: '#2EBD7C',
    primaryDeep: '#26273A',
    primaryDeeper: '#22242E',
    primaryDisabled: '#A6EBD3',
    primaryLight: '#EEFFE0',
    primaryInk: '#FFFFFF',
    success: '#06D290',
    successDark: '#2EBD7C',
    successDisabled: '#A6EBD3',
    successLight: '#EEFFE0',
    warning: '#FF6A0C',
    warningDark: '#E05D0B',
    warningDisabled: '#E2C0AB',
    warningLight: '#F9F1EC',
    error: '#FE0832',
    errorDark: '#E0072C',
    errorDisabled: '#DDA5AF',
    errorLight: '#F7EBED',
    info: '#2D57E7',
    infoDark: '#284DCB',
    infoDisabled: '#B2BBDB',
    infoLight: '#EEF0F7',
    white: '#ffffff',
    black: '#000000',
    text: '#0F1113',
    textSecondary: '#404155',
    textMuted: '#707184',
    textLight: '#B1B2C1',
    border: '#E8E8E8',
    divider: '#DBDCE2',
    mask: 'rgba(0, 0, 0, 0.45)',
    shadow: 'rgba(7, 7, 7, 0.12)',
    background: '#F6F6F6',
    surface: '#ffffff',
    surfaceMuted: '#F6F6F6',
    notice: '#FF6A0C',
    noticeBackground: '#F9F1EC'
};

export const snakeDarkPalette: SnakeThemeColor = {
    primary: '#06D290',
    primaryDark: '#2EE6A8',
    primaryDeep: '#1A1B29',
    primaryDeeper: '#14151F',
    primaryDisabled: '#1E3A31',
    primaryLight: '#0C2A1E',
    primaryInk: '#26273A',
    success: '#06D290',
    successDark: '#2EBD7C',
    successDisabled: '#1E3A31',
    successLight: '#0C2A1E',
    warning: '#FFAD79',
    warningDark: '#FFB789',
    warningDisabled: '#432818',
    warningLight: '#1E120B',
    error: '#FFA9B7',
    errorDark: '#FFB3C0',
    errorDisabled: '#3F141B',
    errorLight: '#1D090C',
    info: '#B5C4F7',
    infoDark: '#BECBF8',
    infoDisabled: '#1D243E',
    infoLight: '#0D111C',
    white: '#ffffff',
    black: '#000000',
    text: '#FFFFFF',
    textSecondary: '#D6D8E8',
    textMuted: '#9CA0B8',
    textLight: '#6B6E82',
    border: '#2E3040',
    divider: '#282A37',
    mask: 'rgba(0, 0, 0, 0.66)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    background: '#111111',
    surface: '#1B1D24',
    surfaceMuted: '#22242E',
    notice: '#FFAD79',
    noticeBackground: '#1E120B'
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
    primaryDeep: '--snake-color-primary-deep',
    primaryDeeper: '--snake-color-primary-deeper',
    primaryDisabled: '--snake-color-primary-disabled',
    primaryLight: '--snake-color-primary-light',
    primaryInk: '--snake-color-primary-ink',
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

function toRgbTriplet(value: string): string | undefined {
    const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
    if (!match) return undefined;
    const hex = Number.parseInt(match[1], 16);
    return `${(hex >> 16) & 255}, ${(hex >> 8) & 255}, ${hex & 255}`;
}

function createCssVars(theme: SnakeTheme, mode: 'light' | 'dark'): Record<string, string> {
    const palette = (mode === 'dark' ? theme.darkColor : theme.color) as SnakeThemeColor;
    const result: Record<string, string> = { '--snake-theme-mode': mode };
    Object.entries(palette).forEach(([key, value]) => {
        const name = tokenNames[key as keyof SnakeThemeColor];
        if (name && value != null) {
            result[name] = String(value);
            const rgb = toRgbTriplet(String(value));
            if (rgb) result[`${name}-rgb`] = rgb;
        }
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
