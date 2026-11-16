import type { ExtractPropTypes, PropType } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** 单选指示器相对文字的位置。 */
export type RadioPlacement = 'left' | 'right';

/** radioProps 运行时属性及默认值。 */
export const radioProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 展示标签文本。 */
    label: { type: String, default: '' },
    /** 数据项名称或唯一标识。 */
    name: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape: { type: String as PropType<'square' | 'circle'>, default: '' },
    /** 是否禁用。 */
    disabled: { type: [String, Boolean] as PropType<string | boolean>, default: '' },
    /** 是否禁止点击标签选中。 */
    labelDisabled: { type: [String, Boolean] as PropType<string | boolean>, default: '' },
    /** 选中状态下的颜色，设置后将覆盖父级 activeColor。 */
    activeColor: { type: String, default: '' },
    /** 未选中状态的边框颜色，未设置时继承 RadioGroup。 */
    inactiveColor: { type: String, default: '' },
    /** 勾选图标的大小，单位 px（375 稿）。 */
    iconSize: { type: [String, Number] as PropType<UnitValue>, default: '' },
    /** 标签文字大小，单位 px（375 稿）。 */
    labelSize: { type: [String, Number] as PropType<UnitValue>, default: '' },
    /** 标签文字颜色，未设置时继承 RadioGroup。 */
    labelColor: { type: String, default: '' },
    /** 组件整体大小，small/default/large 或自定义数值（375 稿 px）。 */
    size: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 勾选指示器相对文字的位置，未设置时继承 RadioGroup。 */
    placement: { type: String as PropType<RadioPlacement | ''>, default: '' },
    /** 是否在底部显示行分隔线，未设置时继承 RadioGroup。 */
    border: { type: [String, Boolean] as PropType<string | boolean>, default: '' }
} as const;

/** RadioResolved 组件的公开属性。 */
export type RadioResolvedProps = ExtractPropTypes<typeof radioProps>;

/** Radio 组件的公开属性。 */
export interface RadioProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 展示标签文本。 */
    label?: string;
    /** 数据项名称或唯一标识。 */
    name?: string | number;
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape?: 'square' | 'circle';
    /** 是否禁用。 */
    disabled?: string | boolean;
    /** 是否禁止点击标签选中。 */
    labelDisabled?: string | boolean;
    /** 选中状态下的颜色，设置后将覆盖父级 activeColor。 */
    activeColor?: string;
    /** 未选中状态的边框颜色，未设置时继承 RadioGroup。 */
    inactiveColor?: string;
    /** 勾选图标的大小，单位 px（375 稿）。 */
    iconSize?: UnitValue;
    /** 标签文字大小，单位 px（375 稿）。 */
    labelSize?: UnitValue;
    /** 标签文字颜色，未设置时继承 RadioGroup。 */
    labelColor?: string;
    /** 组件整体大小，small/default/large 或自定义数值（375 稿 px）。 */
    size?: string | number;
    /** 勾选指示器相对文字的位置，未设置时继承 RadioGroup。 */
    placement?: RadioPlacement;
    /** 是否在底部显示行分隔线，未设置时继承 RadioGroup。 */
    border?: string | boolean;
}

/** Radio 组件的事件契约。 */
export type RadioEmits = {
    /** 未选中变为选中时触发，携带当前 radio 的 name。 */
    change: [value: string | number];
};

/** Radio 通过模板 ref 暴露的接口。 */
export interface RadioExpose {
    /** 当前是否选中（由 RadioGroup 的 modelValue 派生）。 */
    isChecked: boolean;
    /** 是否禁用（含 RadioGroup / Form / FormItem 下发）。 */
    isDisabled: boolean;
    /** 数据项标识符。 */
    value: string | number;
    /** 组件的响应式 props 对象。 */
    props: RadioProps;
}
