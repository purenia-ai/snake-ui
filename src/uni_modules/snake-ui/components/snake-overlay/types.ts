import type { SnakeStyleValue } from '../../types/global';

/** SnakeOverlay 组件的公开属性。 */
export interface SnakeOverlayProps {
    /** 双向绑定的当前值。 */
    modelValue?: boolean;
    /** 是否显示组件。 */
    show?: boolean;
    /** opacity 配置。 */
    opacity?: number;
    /** 组件层级。 */
    zIndex?: number;
    /** 动画持续时间。 */
    duration?: number;
    /** lock scroll 配置。 */
    lockScroll?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeOverlay 组件的事件契约。 */
export interface SnakeOverlayEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: boolean];
    /** update:show 事件携带的参数。 */
    'update:show': [value: boolean];
    /** click 事件携带的参数。 */
    click: [event: unknown];
    /** opened 事件携带的参数。 */
    opened: [];
    /** closed 事件携带的参数。 */
    closed: [];
}
