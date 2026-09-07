import type { ExtractPropTypes, PropType } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

/** snakeCheckboxProps 运行时属性及默认值。 */
export const snakeCheckboxProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: () => ({}) },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 展示标签文本。 */
    label: { type: String, default: '' },
    /** 数据项名称或唯一标识。 */
    name: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 兼容旧 API 的值，非空时优先于 name。 */
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape: { type: String as PropType<'square' | 'circle'>, default: '' },
    /** 是否选中，支持 v-model。 */
    modelValue: { type: Boolean, default: false },
    /** 是否禁用。 */
    disabled: { type: [String, Boolean] as PropType<string | boolean>, default: '' },
    /** 是否禁止点击标签选中。 */
    labelDisabled: { type: [String, Boolean] as PropType<string | boolean>, default: '' },
    /** 选中状态下的颜色，设置后将覆盖父级 activeColor。 */
    activeColor: { type: String, default: '' },
    /** 勾选图标的大小，单位 rpx。 */
    iconSize: { type: [String, Number] as PropType<UnitValue>, default: '' },
    /** 标签文字大小，单位 rpx。 */
    labelSize: { type: [String, Number] as PropType<UnitValue>, default: '' },
    /** 组件整体大小，small/default/large 或自定义数值。 */
    size: { type: [String, Number] as PropType<string | number>, default: '' }
} as const;

/** SnakeCheckboxResolved 组件的公开属性。 */
export type SnakeCheckboxResolvedProps = ExtractPropTypes<typeof snakeCheckboxProps>;

/** SnakeCheckbox 组件的公开属性。 */
export interface SnakeCheckboxProps {
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 展示标签文本。 */
    label?: string;
    /** 数据项名称或唯一标识。 */
    name?: string | number;
    /** 兼容旧 API 的值，非空时优先于 name。 */
    value?: string | number;
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape?: 'square' | 'circle';
    /** 是否选中，支持 v-model。 */
    modelValue?: boolean;
    /** 是否禁用。 */
    disabled?: string | boolean;
    /** 是否禁止点击标签选中。 */
    labelDisabled?: string | boolean;
    /** 选中状态下的颜色，设置后将覆盖父级 activeColor。 */
    activeColor?: string;
    /** 勾选图标的大小，单位 rpx。 */
    iconSize?: UnitValue;
    /** 标签文字大小，单位 rpx。 */
    labelSize?: UnitValue;
    /** 组件整体大小，small/default/large 或自定义数值。 */
    size?: string | number;
}

/** SnakeCheckbox 组件的事件契约。 */
export interface SnakeCheckboxEmits {
    /** 选中状态变化时触发。 */
    'update:modelValue': [value: boolean];
    /** 选中状态变化时触发，携带变化后的新状态。 */
    change: [value: boolean];
}
