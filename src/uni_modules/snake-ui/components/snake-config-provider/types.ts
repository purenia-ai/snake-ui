import type { SnakeDarkMode } from '../../libs/config/types';
import type { SnakeStyleValue } from '../../types/global';

export interface SnakeConfigProviderProps {
    /** 初始化/切换暗黑模式(light | dark | auto),不传则沿用当前引擎状态 */
    darkMode?: SnakeDarkMode;
    /** 初始化/切换主题名(需已通过 app.use 注册主题),不传则沿用当前主题 */
    currentTheme?: string;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeConfigProviderEmits {
    'theme-change': [themeName: string];
    'mode-change': [mode: 'light' | 'dark'];
}
