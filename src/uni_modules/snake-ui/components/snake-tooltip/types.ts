import type { StyleValue } from '../../types/global';
import type { UnitValue } from '../../libs/function/unit';

/** Tooltip 可相对触发元素展示的方向。 */
export type TooltipPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

/** Tooltip 组件的公开属性。 */
export interface TooltipProps {
    /** 通过 v-model 控制显示状态。 */
    modelValue?: boolean;
    /** 未使用内容插槽时显示的纯文本内容。 */
    content?: string;
    /** 浮层相对于触发元素的方向。 */
    placement?: TooltipPlacement;
    /** 浮层与触发元素之间的间距，数值按 rpx 处理。 */
    offset?: UnitValue;
    /** 是否显示指向触发元素的箭头。 */
    visibleArrow?: boolean;
    /** 是否禁用点击触发。 */
    disabled?: boolean;
    /** 是否显示右上角关闭按钮。 */
    closeable?: boolean;
    /** 点击透明遮罩时是否关闭。 */
    closeOnClickOverlay?: boolean;
    /** 透明遮罩的层级；内容层始终比它高一层。 */
    zIndex?: number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 浮层内容容器的自定义类名。 */
    contentClass?: string;
    /** 浮层内容容器的自定义样式。 */
    contentStyle?: StyleValue;
}

/** Tooltip 显隐变化详情。 */
export interface TooltipChangeDetail {
    /** 当前是否显示 Tooltip。 */
    show: boolean;
}

/** Tooltip 组件的事件契约。 */
export type TooltipEmits = {
    'update:modelValue': [value: boolean];
    change: [detail: TooltipChangeDetail];
    open: [];
    close: [];
    'click-overlay': [event: unknown];
};

/** Tooltip 实例暴露的方法。 */
export interface TooltipExpose {
    /** 打开 Tooltip。 */
    open(): void;
    /** 关闭 Tooltip。 */
    close(): void;
    /** 切换 Tooltip 显隐状态。 */
    toggle(): void;
}
