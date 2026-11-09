import { computed, reactive, ref } from 'vue';
import { isDebugMode, config } from './state';
import type { DarkMode, SingleTheme, Theme, ThemeColor, ThemeConfig, ThemeOption } from './types';

const THEME_STORAGE_KEY = 'snake-ui-theme';
const DARK_MODE_STORAGE_KEY = 'snake-ui-dark-mode';

export const lightPalette: ThemeColor = {
    // 品牌绿七档（自有品牌色，保留）
    primary: '#06D290',
    primaryDark: '#2EBD7C',
    primaryDeep: '#26273A',
    primaryDeeper: '#22242E',
    primaryDisabled: '#A6EBD3',
    primaryLight: '#06D2901A',
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

const builtinThemes: Theme[] = [defaultTheme];

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

/**
 * 亮色改色时不派生到暗色的令牌：这些令牌随明暗模式整体反转，
 * 继续沿用基线暗色比“跟着亮色走”更安全。
 */
const structuralTokens = new Set<keyof ThemeColor>([
    'white',
    'black',
    'text',
    'textSecondary',
    'textMuted',
    'textLight',
    'border',
    'divider',
    'mask',
    'shadow',
    'background',
    'surface',
    'surfaceMuted',
    'primaryInk'
]);

/** 扁平单主题里不属于颜色令牌的字段。 */
const themeMetaKeys = new Set([
    'themes',
    'css',
    'darkCss',
    'darkColor',
    'name',
    'label',
    'description',
    'defaultTheme',
    'defaultDarkMode',
    'force'
]);

interface HslColor {
    h: number;
    s: number;
    l: number;
}

interface ParsedColor {
    r: number;
    g: number;
    b: number;
    alpha?: number;
}

function parseHexColor(value?: string): ParsedColor | undefined {
    if (typeof value !== 'string') return undefined;
    const match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(value.trim());
    if (!match) return undefined;
    const rgb = Number.parseInt(match[1], 16);
    return {
        r: (rgb >> 16) & 255,
        g: (rgb >> 8) & 255,
        b: rgb & 255,
        alpha: match[2] ? Number.parseInt(match[2], 16) / 255 : undefined
    };
}

function channelToHex(value: number): string {
    return Math.min(255, Math.max(0, Math.round(value)))
        .toString(16)
        .padStart(2, '0');
}

function rgbToHsl({ r, g, b }: ParsedColor): HslColor {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const delta = max - min;
    const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    let h: number;
    if (max === red) h = ((green - blue) / delta + (green < blue ? 6 : 0)) * 60;
    else if (max === green) h = ((blue - red) / delta + 2) * 60;
    else h = ((red - green) / delta + 4) * 60;
    return { h, s, l };
}

function hslToRgb({ h, s, l }: HslColor): ParsedColor {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = (((h % 360) + 360) % 360) / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    const [r1, g1, b1] =
        hp < 1
            ? [c, x, 0]
            : hp < 2
              ? [x, c, 0]
              : hp < 3
                ? [0, c, x]
                : hp < 4
                  ? [0, x, c]
                  : hp < 5
                    ? [x, 0, c]
                    : [c, 0, x];
    const m = l - c / 2;
    return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

/**
 * 从亮色令牌派生暗色令牌：色相与饱和度沿用亮色，明度取基线暗色。
 * 这样用户只改亮色时，暗色拿到的是同一色相的新颜色，而不是内置主题的旧颜色。
 */
function deriveDarkToken(lightValue: string, baseDarkValue?: string): string | undefined {
    const light = parseHexColor(lightValue);
    if (!light) return undefined;
    const baseDark = parseHexColor(baseDarkValue);
    const lightHsl = rgbToHsl(light);
    const l = baseDark ? rgbToHsl(baseDark).l : lightHsl.l;
    const next = hslToRgb({ h: lightHsl.h, s: lightHsl.s, l });
    if (light.alpha == null) {
        return `#${channelToHex(next.r)}${channelToHex(next.g)}${channelToHex(next.b)}`;
    }
    const alpha = Math.round(light.alpha * 100) / 100;
    return `rgba(${Math.round(next.r)}, ${Math.round(next.g)}, ${Math.round(next.b)}, ${alpha})`;
}

/** 用户改过的亮色键从基线暗色里摘除，交给 deriveDarkToken 重新生成。 */
function inheritBaseDarkColor(
    colorOverrides: Partial<ThemeColor> | undefined,
    baseDark: Partial<ThemeColor> | undefined,
    ownDark: Partial<ThemeColor> | undefined
): Partial<ThemeColor> | undefined {
    const inherited: Partial<ThemeColor> = { ...(baseDark || {}) };
    Object.keys(colorOverrides || {}).forEach(key => {
        if (!ownDark || !Object.prototype.hasOwnProperty.call(ownDark, key)) {
            delete (inherited as Record<string, unknown>)[key];
        }
    });
    if (!Object.keys(inherited).length) return ownDark;
    return { ...inherited, ...(ownDark || {}) };
}

function normalizeTheme(theme: Theme): Theme {
    const color: Partial<ThemeColor> = { ...theme.color };
    const derived: Partial<ThemeColor> = {};
    Object.entries(color).forEach(([key, value]) => {
        if (typeof value !== 'string') return;
        const token = key as keyof ThemeColor;
        if (structuralTokens.has(token)) return;
        if (theme.darkColor && Object.prototype.hasOwnProperty.call(theme.darkColor, key)) return;
        const next = deriveDarkToken(value, darkPalette[token]);
        if (next) derived[token] = next;
    });
    return {
        ...theme,
        color: { ...lightPalette, ...color },
        darkColor: { ...darkPalette, ...derived, ...theme.darkColor }
    };
}

/**
 * 归一化主题列表：
 * - 同名主题按内置主题补齐未声明的字段（基线补齐），不再总是合并内置主题
 * - 用户声明的列表就是最终列表，未声明时（空列表 / 未配置）才回退到内置主题
 */
function mergeThemes(entries: Theme[]): Theme[] {
    const merged = new Map<string, Theme>();
    entries.forEach(entry => {
        const name = entry.name || defaultTheme.name;
        const base = merged.get(name) ?? builtinThemes.find(theme => theme.name === name);
        merged.set(
            name,
            normalizeTheme({
                name,
                label: entry.label ?? base?.label,
                description: entry.description ?? base?.description,
                color: { ...(base?.color || {}), ...(entry.color || {}) },
                darkColor: inheritBaseDarkColor(entry.color, base?.darkColor, entry.darkColor),
                css: { ...(base?.css || {}), ...(entry.css || {}) },
                darkCss: { ...(base?.darkCss || {}), ...(entry.darkCss || {}) }
            })
        );
    });
    return Array.from(merged.values());
}

/** 顶层共享变量广播到全部主题，主题自身同名键优先。 */
function applyGlobalCss(entries: Theme[], css?: Record<string, string>, darkCss?: Record<string, string>): Theme[] {
    if (!css && !darkCss) return entries;
    return entries.map(entry => ({
        ...entry,
        css: { ...(css || {}), ...(entry.css || {}) },
        darkCss: { ...(darkCss || {}), ...(entry.darkCss || {}) }
    }));
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
    // 暗色下合并 css 与 darkCss：只在 darkCss 里声明同名键时覆盖，未声明的亮色变量继续可用。
    Object.assign(result, mode === 'dark' ? { ...(theme.css || {}), ...(theme.darkCss || {}) } : theme.css);
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
    const palette = (mode === 'dark' ? currentTheme.value.darkColor : currentTheme.value.color) as
        ThemeColor | undefined;
    Object.assign(color, mode === 'dark' ? darkPalette : lightPalette, palette || {});
    const vars = createCssVars(currentTheme.value, mode);
    cssVars.value = vars;
    flushDocument(vars, mode);
}

/** `resolveThemeOption` 的归一化结果。 */
export interface ResolvedThemeOption {
    themes?: Theme[];
    defaultTheme?: string;
    defaultDarkMode?: DarkMode;
    force?: boolean;
    css?: Record<string, string>;
    darkCss?: Record<string, string>;
}

/**
 * 把三种主题配置形态归一化为同一种结构：
 * - `Theme[]`：多主题
 * - `{ themes, defaultTheme, defaultDarkMode, force, css?, darkCss? }`：多主题 + 共享变量
 * - 扁平单主题：`{ primary, ..., name?, darkColor?, css?, darkCss? }`
 */
export function resolveThemeOption(option?: ThemeOption): ResolvedThemeOption {
    if (!option) return {};
    if (Array.isArray(option)) return { themes: option };

    const configOption = option as ThemeConfig;
    if (Array.isArray(configOption.themes)) {
        return {
            themes: configOption.themes,
            defaultTheme: configOption.defaultTheme,
            defaultDarkMode: configOption.defaultDarkMode,
            force: configOption.force,
            css: configOption.css,
            darkCss: configOption.darkCss
        };
    }

    // 扁平单主题：剔除元信息字段后，其余字段视为颜色令牌，避免 css / name 被当成颜色令牌吞掉。
    const flat = option as SingleTheme & { defaultTheme?: string };
    const color: Partial<ThemeColor> = {};
    Object.entries(flat).forEach(([key, value]) => {
        if (themeMetaKeys.has(key) || typeof value !== 'string') return;
        (color as Record<string, string>)[key] = value;
    });
    const hasCustomCss =
        Boolean(flat.css && Object.keys(flat.css).length) || Boolean(flat.darkCss && Object.keys(flat.darkCss).length);

    // 只带配置字段（默认模式 / force）时保持主题列表不变，与旧版行为一致。
    if (!Object.keys(color).length && !hasCustomCss && !flat.darkColor) {
        return { defaultTheme: flat.defaultTheme, defaultDarkMode: flat.defaultDarkMode, force: flat.force };
    }

    return {
        themes: [
            {
                name: flat.name || defaultTheme.name,
                label: flat.label,
                description: flat.description,
                color,
                darkColor: flat.darkColor,
                css: flat.css,
                darkCss: flat.darkCss
            }
        ],
        defaultTheme: flat.defaultTheme,
        defaultDarkMode: flat.defaultDarkMode,
        force: flat.force
    };
}

export function initTheme(option?: ThemeOption): void {
    prepareListeners();
    const resolved = resolveThemeOption(option);
    const force = Boolean(resolved.force);

    let entries = resolved.themes;
    if (entries && !entries.length) {
        if (isDebugMode('warn')) {
            console.warn('[Snake UI] initTheme 收到空主题数组，已回退到内置主题');
        }
        entries = builtinThemes.slice();
    }
    if (!entries && (!initialized || force)) entries = builtinThemes.slice();
    if (entries) {
        const merged = applyGlobalCss(mergeThemes(entries), resolved.css, resolved.darkCss);
        if (merged.length) themes.value = merged;
    }

    const savedTheme = force ? undefined : readStorage<string>(THEME_STORAGE_KEY);
    const savedMode = force ? undefined : readStorage<DarkMode>(DARK_MODE_STORAGE_KEY);
    const defaultThemeName = resolved.defaultTheme || config.defaultTheme;
    const defaultDarkMode = resolved.defaultDarkMode || config.defaultDarkMode;
    const found = themes.value.find(theme => theme.name === (savedTheme || defaultThemeName)) || themes.value[0];
    if (!found) return;

    // 默认主题名指向不存在的主题时回写到实际生效值，避免 $snake.config.defaultTheme 成为脏值。
    if (resolved.defaultTheme) {
        if (themes.value.some(theme => theme.name === resolved.defaultTheme)) {
            config.defaultTheme = resolved.defaultTheme;
        } else if (isDebugMode('warn')) {
            console.warn(`[Snake UI] 默认主题 ${resolved.defaultTheme} 不存在，已回退到 ${found.name}`);
        }
    }
    if (!themes.value.some(theme => theme.name === config.defaultTheme)) config.defaultTheme = found.name;
    if (resolved.defaultDarkMode) config.defaultDarkMode = resolved.defaultDarkMode;

    currentTheme.value = found;
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
    const theme = currentTheme.value;
    if (activeMode() === 'dark') {
        currentTheme.value = { ...theme, darkColor: { ...theme.darkColor, ...colors } };
        applyTheme();
        return;
    }
    const darkColor: Partial<ThemeColor> = { ...theme.darkColor };
    Object.entries(colors).forEach(([key, value]) => {
        const token = key as keyof ThemeColor;
        if (typeof value !== 'string' || structuralTokens.has(token)) return;
        // 主题自己声明过的暗色保持不动，其余按亮色派生，避免暗色继续显示基线色。
        if (theme.darkColor && theme.darkColor[token] !== darkPalette[token]) return;
        const next = deriveDarkToken(value, darkPalette[token]);
        if (next) darkColor[token] = next;
    });
    currentTheme.value = { ...theme, color: { ...theme.color, ...colors }, darkColor };
    applyTheme();
}

export const themeStyle = computed<Record<string, string>>(() => cssVars.value);

export function resetTheme(): void {
    initialized = false;
    config.defaultTheme = defaultTheme.name;
    config.defaultDarkMode = 'light';
    themes.value = [defaultTheme];
    currentTheme.value = defaultTheme;
    darkMode.value = 'light';
    systemDark.value = false;
    applyTheme();
}
