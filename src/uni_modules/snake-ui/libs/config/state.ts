import { reactive } from 'vue';
import type { DebugLevel } from './types';

export const SNAKE_UI_VERSION = '0.3.0';

export interface AppConfig {
    v: string;
    version: string;
    defaultTheme: string;
    defaultDarkMode: 'light' | 'dark' | 'auto';
    defaultLocale: string;
    debugMode: boolean | DebugLevel | DebugLevel[];
}

export const config = reactive<AppConfig>({
    v: SNAKE_UI_VERSION,
    version: SNAKE_UI_VERSION,
    defaultTheme: 'snake',
    defaultDarkMode: 'light',
    defaultLocale: 'zh-CN',
    debugMode: false
});

export function setConfig(options: Partial<AppConfig>): void {
    Object.assign(config, options);
}

export function isDebugMode(level: DebugLevel = 'log'): boolean {
    if (config.debugMode === true) return true;
    if (config.debugMode === false) return false;
    if (Array.isArray(config.debugMode)) return config.debugMode.includes(level);
    return config.debugMode === level;
}
