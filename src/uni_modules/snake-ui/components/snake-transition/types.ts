import type { SnakeStyleValue } from '../../types/global';

/** SnakeTransitionPreset 类型定义。 */
export type SnakeTransitionPreset =
    | 'fade'
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-out';

/** SnakeTransitionDuration 类型定义。 */
export interface SnakeTransitionDuration {
    /** enter 配置。 */
    enter?: number;
    /** leave 配置。 */
    leave?: number;
}

/** SnakeTransition 组件的公开属性。 */
export interface SnakeTransitionProps {
    /** 是否显示组件。 */
    show?: boolean;
    /** 数据项名称或唯一标识。 */
    name?: SnakeTransitionPreset;
    /** 动画持续时间。 */
    duration?: number | SnakeTransitionDuration;
    /** 动画缓动函数。 */
    timingFunction?: string;
    /** delay 配置。 */
    delay?: number;
    /** appear 配置。 */
    appear?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeTransition 组件的事件契约。 */
export interface SnakeTransitionEmits {
    /** before-enter 事件携带的参数。 */
    'before-enter': [];
    /** enter 事件携带的参数。 */
    enter: [];
    /** after-enter 事件携带的参数。 */
    'after-enter': [];
    /** enter-cancelled 事件携带的参数。 */
    'enter-cancelled': [];
    /** before-leave 事件携带的参数。 */
    'before-leave': [];
    /** leave 事件携带的参数。 */
    leave: [];
    /** after-leave 事件携带的参数。 */
    'after-leave': [];
    /** leave-cancelled 事件携带的参数。 */
    'leave-cancelled': [];
    /** click 事件携带的参数。 */
    click: [event: unknown];
}
