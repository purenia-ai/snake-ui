import type { SnakeDarkMode } from '../../libs/config/types';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeConfigProvider 组件的公开属性。 */
export interface SnakeConfigProviderProps {
    /** 初始化/切换暗黑模式(light | dark | auto),不传则沿用当前引擎状态 */
    darkMode?: SnakeDarkMode;
    /** 初始化/切换主题名(需已通过 app.use 注册主题),不传则沿用当前主题 */
    currentTheme?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeConfigProvider 组件的事件契约。 */
export interface SnakeConfigProviderEmits {
    /** theme-change 事件携带的参数。 */
    'theme-change': [themeName: string];
    /** mode-change 事件携带的参数。 */
    'mode-change': [mode: 'light' | 'dark'];
}
