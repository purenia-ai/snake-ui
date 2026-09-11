import type { StyleValue } from '../../types/global';

/** TransitionPreset 类型定义。 */
export type TransitionPreset =
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

/** TransitionDuration 类型定义。 */
export interface TransitionDuration {
    /** enter 配置。 */
    enter?: number;
    /** leave 配置。 */
    leave?: number;
}

/** Transition 组件的公开属性。 */
export interface TransitionProps {
    /** 是否显示组件。 */
    show?: boolean;
    /** 数据项名称或唯一标识。 */
    name?: TransitionPreset;
    /** 动画持续时间。 */
    duration?: number | TransitionDuration;
    /** 动画缓动函数。 */
    timingFunction?: string;
    /** delay 配置。 */
    delay?: number;
    /** appear 配置。 */
    appear?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** Transition 组件的事件契约。 */
export type TransitionEmits = {
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
};
