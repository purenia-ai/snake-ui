import type { SnakeStyleValue } from '../../types/global';

/** SnakeLoadingIconMode 类型定义。 */
export type SnakeLoadingIconMode = 'circle' | 'spinner';

/** SnakeLoadingIcon 组件的公开属性。 */
export interface SnakeLoadingIconProps {
    /** 是否显示组件。 */
    show?: boolean;
    /** 组件展示模式。 */
    mode?: SnakeLoadingIconMode;
    /** 内容颜色。 */
    color?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** 组件尺寸。 */
    size?: number | string;
    /** 展示文本。 */
    text?: string;
    /** 文字颜色。 */
    textColor?: string;
    /** text size 配置。 */
    textSize?: number | string;
    /** vertical 配置。 */
    vertical?: boolean;
    /** 动画缓动函数。 */
    timingFunction?: string;
    /** 动画持续时间。 */
    duration?: number;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
