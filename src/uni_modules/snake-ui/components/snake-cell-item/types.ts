import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** CellItemIndex 类型定义。 */
export type CellItemIndex = string | number;
/** CellItemStyle 类型定义。 */
export type CellItemStyle = Record<string, unknown>;
/** CellItemArrowDirection 类型定义。 */
export type CellItemArrowDirection = 'right' | 'up' | 'down';

/** cellItemProps 运行时属性及默认值。 */
export const cellItemProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 左侧图标名称或图片地址。 */
    icon: { type: String, default: '' },
    /** 左侧标题。 */
    title: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 右侧内容。 */
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 标题下方的描述信息。 */
    label: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 是否显示下边框。 */
    borderBottom: { type: Boolean, default: true },
    /** 是否显示上边框。 */
    borderTop: { type: Boolean, default: false },
    /** 是否开启点击反馈，点击时背景变灰。 */
    hoverClass: { type: String, default: 'snake-cell-item--hover' },
    /** 是否显示右侧箭头。 */
    arrow: { type: Boolean, default: true },
    /** 内容是否垂直居中。 */
    center: { type: Boolean, default: false },
    /** 是否显示左侧表示必填的星号。 */
    required: { type: Boolean, default: false },
    /** 标题的宽度，数值按 rpx 处理。 */
    titleWidth: { type: [Number, String] as PropType<number | string>, default: '' },
    /** 右侧箭头方向。 */
    arrowDirection: { type: String as PropType<CellItemArrowDirection>, default: 'right' },
    /** 标题样式，对象形式。 */
    titleStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 右侧内容样式，对象形式。 */
    valueStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 描述信息样式，对象形式。 */
    labelStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 背景颜色。 */
    bgColor: { type: String, default: 'transparent' },
    /** 用于 click 事件回调中标识当前是第几个条目。 */
    index: { type: [String, Number] as PropType<CellItemIndex>, default: '' },
    /** 是否使用 label 插槽。 */
    useLabelSlot: { type: Boolean, default: false },
    /** 左侧图标的大小，数值按 rpx 处理，只对传入 icon 字段时有效。 */
    iconSize: { type: [Number, String] as PropType<number | string>, default: 34 },
    /** 左侧图标的样式，对象形式。 */
    iconStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) }
} as const;

/** CellItem 组件的公开属性。 */
export type CellItemProps = ExtractPropTypes<typeof cellItemProps>;

/** CellItem 组件的事件契约。 */
export interface CellItemEmits {
    /** click 事件携带的参数。 */
    click: [index: CellItemIndex];
}
