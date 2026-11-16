import type { ComputedRef, InjectionKey } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { RadioPlacement } from '../snake-radio/types';

/** RadioGroup 组件的公开属性。 */
export interface RadioGroupProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 是否禁用所有 radio。 */
    disabled?: boolean;
    /** 匹配某一个 radio 组件，如果某个 radio 的 name 值等于此值，那么这个 radio 就被会选中。 */
    modelValue?: string | number;
    /** 选中状态下的颜色，应用到所有子 radio。 */
    activeColor?: string;
    /** 未选中状态的边框颜色，应用到所有子 radio。 */
    inactiveColor?: string;
    /** 组件整体大小，small/default/large 或自定义数值。 */
    size?: string | number;
    /** 是否禁止点击标签选中。 */
    labelDisabled?: boolean;
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape?: 'square' | 'circle';
    /** 勾选指示器相对文字的位置，应用到所有子 radio。 */
    placement?: RadioPlacement;
    /** 勾选图标的大小，单位 px（375 稿）。 */
    iconSize?: UnitValue;
    /** 每个 radio 占 snake-radio-group 的宽度，数值按 375 稿 px 处理。 */
    width?: UnitValue;
    /** 是否每个 radio 都换行。 */
    wrap?: boolean;
    /** 标签文字大小，单位 px（375 稿）。 */
    labelSize?: UnitValue;
    /** 标签文字颜色，应用到所有子 radio。 */
    labelColor?: string;
    /** 是否为每个 radio 绘制行分隔线（分组内最后一项不绘制）。 */
    border?: boolean;
}

/** RadioGroup 组件的事件契约。 */
export type RadioGroupEmits = {
    /** 更新当前选中值。 */
    'update:modelValue': [value: string | number];
    /** 任一个 radio 状态发生变化时触发，携带最新选中值。 */
    change: [value: string | number];
};

/** RadioGroup 向子 radio 提供的配对上下文（useChildren / useParent 通道）。 */
export interface RadioGroupContext {
    /** 父组件的响应式 props 对象，子项读取 modelValue 派生选中态。 */
    props: RadioGroupProps;
    /** 合并后的禁用态（含 Form / FormItem 下发），子项应优先读它。 */
    disabled: ComputedRef<boolean>;
    /** 子项点击后由 group 统一更新 v-model 并派发 change。 */
    setValue(val: string | number): void;
}

/** RadioGroup 通过模板 ref 暴露的接口。 */
export interface RadioGroupExpose {
    /** 组件的响应式 props 对象。 */
    props: RadioGroupProps;
    /** 子项读取的级联配置快照。 */
    getData(): Record<string, unknown>;
    /** 设置选中值（等同子项点击，会派发 change 并触发 form-item 校验）。 */
    setValue(val: string | number): void;
}

/** RadioGroup ↔ Radio 配对注入键。 */
export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol('snake-radio-group');
