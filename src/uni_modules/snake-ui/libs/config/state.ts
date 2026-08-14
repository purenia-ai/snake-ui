import { reactive } from 'vue';
import type { SnakeDebugLevel } from './types';

export const SNAKE_UI_VERSION = '0.3.0';

export interface SnakeAppConfig {
    v: string;
    version: string;
    defaultTheme: string;
    defaultDarkMode: 'light' | 'dark' | 'auto';
    defaultLocale: string;
    debugMode: boolean | SnakeDebugLevel | SnakeDebugLevel[];
}

export const snakeConfig = reactive<SnakeAppConfig>({
    v: SNAKE_UI_VERSION,
    version: SNAKE_UI_VERSION,
    defaultTheme: 'snake',
    defaultDarkMode: 'light',
    defaultLocale: 'zh-CN',
    debugMode: false
});

export function setSnakeConfig(options: Partial<SnakeAppConfig>): void {
    Object.assign(snakeConfig, options);
}

export function isSnakeDebugMode(level: SnakeDebugLevel = 'log'): boolean {
    if (snakeConfig.debugMode === true) return true;
    if (snakeConfig.debugMode === false) return false;
    if (Array.isArray(snakeConfig.debugMode)) return snakeConfig.debugMode.includes(level);
    return snakeConfig.debugMode === level;
}
