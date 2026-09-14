import { computed, reactive, ref } from 'vue';
import { isDebugMode, config } from './state';
import type { DarkMode, Theme, ThemeColor, ThemeOption } from './types';

const THEME_STORAGE_KEY = 'snake-ui-theme';
const DARK_MODE_STORAGE_KEY = 'snake-ui-dark-mode';

export const lightPalette: ThemeColor = {
    // 品牌绿七档（自有品牌色，保留）
    primary: '#06D290',
    primaryDark: '#2EBD7C',
    primaryDeep: '#26273A',
    primaryDeeper: '#22242E',
    primaryDisabled: '#A6EBD3',
    primaryLight: '#EEFFE0',
    primaryInk: '#FFFFFF',
    // 语义色与中性色默认主题（lightPalette）
    success: '#19BE6B',
    successDark: '#18B566',
    successDisabled: '#71D5A1',
    successLight: '#DBF1E1',
    warning: '#FF9900',
    warningDark: '#F29100',
    warningDisabled: '#FCBD71',
    warningLight: '#FDF6EC',
    error: '#FA3534',
    errorDark: '#DD6161',
    errorDisabled: '#FAB6B6',
    errorLight: '#FEF0F0',
    info: '#909399',
    infoDark: '#82848A',
    infoDisabled: '#C8C9CC',
    infoLight: '#F4F4F5',
    white: '#ffffff',
    black: '#000000',
    // mainColor / contentColor / tipsColor / lightColor
    text: '#303133',
    textSecondary: '#606266',
    textMuted: '#909399',
    textLight: '#C0C4CC',
    // borderColor / dividerColor / maskColor / shadowColor / bgColor / bgWhite / bgGrayLight
    border: '#DCDFE6',
    divider: '#E4E7ED',
    mask: 'rgba(0, 0, 0, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    background: '#F6F6F6',
    surface: '#ffffff',
    surfaceMuted: '#F1F1F1',
    notice: '#FF9900',
    noticeBackground: '#FDF6EC'
};

export const darkPalette: ThemeColor = {
    // 品牌绿七档（暗色下仍保持品牌绿，自有体系）
    primary: '#06D290',
    primaryDark: '#2EE6A8',
    primaryDeep: '#1A1B29',
    primaryDeeper: '#14151F',
    primaryDisabled: '#1E3A31',
    primaryLight: '#0C2A1E',
    primaryInk: '#26273A',
    // 语义色与中性色暗色主题（darkPalette）
    success: '#4ADE80',
    successDark: '#1F9D57',
    successDisabled: '#2F4D3D',
    successLight: '#10291F',
    warning: '#FBBF24',
    warningDark: '#C88F00',
    warningDisabled: '#4A3B17',
    warningLight: '#2B1F05',
    error: '#FF6B6B',
    errorDark: '#D83A3A',
    errorDisabled: '#4F2323',
    errorLight: '#2D1414',
    info: '#A0A7B8',
    infoDark: '#7C8394',
    infoDisabled: '#3B3F4C',
    infoLight: '#1D2029',
    white: '#F5F6F7',
    black: '#F5F6F7',
    // mainColor / contentColor / tipsColor / lightColor
    text: '#F5F6F7',
    textSecondary: '#CFD3DC',
    textMuted: '#9AA1AF',
    textLight: '#6B7082',
    // borderColor / dividerColor / maskColor / shadowColor / bgColor / bgWhite / bgGrayLight
    border: '#3A4251',
    divider: '#3A4251',
    mask: 'rgba(0, 0, 0, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    background: '#111827',
    surface: '#000000',
    surfaceMuted: '#1A1A1A',
    notice: '#FBBF24',
    noticeBackground: '#2B1F05'
};

export const defaultTheme: Theme = {
    name: 'snake',
    label: 'Snake 绿',
    description: 'Snake UI 默认明暗主题',
    color: lightPalette,
    darkColor: darkPalette
};

export const themes = ref<Theme[]>([defaultTheme]);
export const currentTheme = ref<Theme>(defaultTheme);
export const darkMode = ref<DarkMode>('light');
export const systemDark = ref(false);
export const color = reactive<ThemeColor>({ ...lightPalette });
export const cssVars = ref<Record<string, string>>({});

let listenersReady = false;
let initialized = false;
let lastCssKeys: string[] = [];

const tokenNames: Record<keyof ThemeColor, string> = {
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
        if (isDebugMode('warn')) console.warn(`[Snake UI] failed to read ${key}`, error);
        return undefined;
    }
}

function writeStorage(key: string, value: unknown): void {
    try {
        if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
            uni.setStorageSync(key, value);
        }
    } catch (error) {
        if (isDebugMode('warn')) console.warn(`[Snake UI] failed to write ${key}`, error);
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
        if (isDebugMode('warn')) console.warn('[Snake UI] failed to detect system theme', error);
    }
    return false;
}

function prepareListeners(): void {
    if (listenersReady) return;
    listenersReady = true;
    systemDark.value = detectSystemDark();
    try {
        // H5 与 uni 平台分别监听系统主题；仅 auto 模式跟随变化，手动模式不被系统事件覆盖。
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            media.addEventListener?.('change', event => {
                systemDark.value = event.matches;
                if (darkMode.value === 'auto') applyTheme();
            });
        }
        if (typeof uni !== 'undefined' && typeof uni.onThemeChange === 'function') {
            uni.onThemeChange(event => {
                systemDark.value = event.theme === 'dark';
                if (darkMode.value === 'auto') applyTheme();
            });
        }
    } catch (error) {
        if (isDebugMode('warn')) console.warn('[Snake UI] failed to watch system theme', error);
    }
}

function normalizeTheme(theme: Theme): Theme {
    return {
        ...theme,
        color: { ...lightPalette, ...theme.color },
        darkColor: { ...darkPalette, ...theme.darkColor }
    };
}

function mergeThemes(custom: Theme[]): Theme[] {
    const map = new Map<string, Theme>([[defaultTheme.name, defaultTheme]]);
    custom.forEach(theme => map.set(theme.name, normalizeTheme(theme)));
    return Array.from(map.values());
}

function activeMode(): 'light' | 'dark' {
    if (darkMode.value === 'auto') return systemDark.value ? 'dark' : 'light';
    return darkMode.value;
}

function toRgbTriplet(value: string): string | undefined {
    const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
    if (!match) return undefined;
    const hex = Number.parseInt(match[1], 16);
    return `${(hex >> 16) & 255}, ${(hex >> 8) & 255}, ${hex & 255}`;
}

function createCssVars(theme: Theme, mode: 'light' | 'dark'): Record<string, string> {
    const palette = (mode === 'dark' ? theme.darkColor : theme.color) as ThemeColor;
    const result: Record<string, string> = { '--snake-theme-mode': mode };
    Object.entries(palette).forEach(([key, value]) => {
        const name = tokenNames[key as keyof ThemeColor];
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
    // 先移除上一主题独有的变量，防止自定义 css/darkCss 在切换后残留。
    lastCssKeys.forEach(key => root.style.removeProperty(key));
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
    lastCssKeys = Object.keys(vars);
    root.dataset.snakeThemeMode = mode;
    root.classList.remove('snake-theme-light', 'snake-theme-dark');
    root.classList.add(`snake-theme-${mode}`);
}

export function applyTheme(): void {
    const mode = activeMode();
    const palette = (mode === 'dark' ? currentTheme.value.darkColor : currentTheme.value.color) as ThemeColor | undefined;
    Object.assign(color, mode === 'dark' ? darkPalette : lightPalette, palette || {});
    const vars = createCssVars(currentTheme.value, mode);
    cssVars.value = vars;
    flushDocument(vars, mode);
}

export function initTheme(option?: ThemeOption): void {
    prepareListeners();
    let themeEntries: Theme[] = [];
    let defaultThemeName = config.defaultTheme;
    let defaultDarkMode = config.defaultDarkMode;
    let force = false;

    if (Array.isArray(option)) {
        themeEntries = option;
    } else if (
        option &&
        typeof option === 'object' &&
        ('themes' in option || 'defaultTheme' in option || 'defaultDarkMode' in option || 'force' in option)
    ) {
        themeEntries = option.themes || [];
        defaultThemeName = option.defaultTheme || defaultThemeName;
        defaultDarkMode = option.defaultDarkMode || defaultDarkMode;
        force = Boolean(option.force);
    } else if (option && typeof option === 'object') {
        themeEntries = [{ ...defaultTheme, color: { ...defaultTheme.color, ...option } }];
    }

    if (!initialized || force || themeEntries.length) themes.value = mergeThemes(themeEntries);
    const savedTheme = force ? undefined : readStorage<string>(THEME_STORAGE_KEY);
    const savedMode = force ? undefined : readStorage<DarkMode>(DARK_MODE_STORAGE_KEY);
    currentTheme.value = themes.value.find(theme => theme.name === (savedTheme || defaultThemeName)) || themes.value[0];
    darkMode.value = savedMode || defaultDarkMode;
    initialized = true;
    applyTheme();
}

export function setTheme(name: string): boolean {
    const theme = themes.value.find(item => item.name === name);
    if (!theme) return false;
    currentTheme.value = theme;
    writeStorage(THEME_STORAGE_KEY, name);
    applyTheme();
    return true;
}

export function setDarkMode(mode: DarkMode): void {
    darkMode.value = mode;
    writeStorage(DARK_MODE_STORAGE_KEY, mode);
    applyTheme();
}

export function toggleDarkMode(): void {
    setDarkMode(activeMode() === 'dark' ? 'light' : 'dark');
}

export function isDarkMode(): boolean {
    return activeMode() === 'dark';
}

export function setThemeColor(colors: Partial<ThemeColor>): void {
    const key = activeMode() === 'dark' ? 'darkColor' : 'color';
    currentTheme.value = {
        ...currentTheme.value,
        [key]: { ...currentTheme.value[key], ...colors }
    };
    applyTheme();
}

export const themeStyle = computed<Record<string, string>>(() => cssVars.value);

export function resetTheme(): void {
    initialized = false;
    themes.value = [defaultTheme];
    currentTheme.value = defaultTheme;
    darkMode.value = 'light';
    systemDark.value = false;
    applyTheme();
}
