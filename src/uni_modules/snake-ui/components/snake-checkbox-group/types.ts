import type { ComputedRef, InjectionKey } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { CheckboxPlacement } from '../snake-checkbox/types';

/** CheckboxGroup 组件的公开属性。 */
export interface CheckboxGroupProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 绑定值，选中的 checkbox name 组成的数组，支持 v-model。 */
    modelValue?: (string | number)[];
    /** 最多能选中多少个 checkbox，0 表示不限制。 */
    max?: number;
    /** 最少需要选中多少个 checkbox，0 表示不限制。 */
    min?: number;
    /** 是否禁用所有 checkbox。 */
    disabled?: boolean;
    /** 是否禁止点击标签选中。 */
    labelDisabled?: boolean;
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape?: 'square' | 'circle';
    /** 勾选指示器相对文字的位置，应用到所有子 checkbox。 */
    placement?: CheckboxPlacement;
    /** 选中状态下的颜色，应用到所有子 checkbox。 */
    activeColor?: string;
    /** 未选中状态的边框颜色，应用到所有子 checkbox。 */
    inactiveColor?: string;
    /** 组件整体大小，small/default/large 或自定义数值。 */
    size?: string | number;
    /** 每个 checkbox 占 snake-checkbox-group 的宽度，数值按 375 稿 px 处理。 */
    width?: UnitValue;
    /** 是否每个 checkbox 都换行。 */
    wrap?: boolean;
    /** 勾选图标的大小，单位 px（375 稿）。 */
    iconSize?: UnitValue;
    /** 标签文字大小，单位 px（375 稿）。 */
    labelSize?: UnitValue;
    /** 标签文字颜色，应用到所有子 checkbox。 */
    labelColor?: string;
    /** 是否为每个 checkbox 绘制行分隔线（分组内最后一项不绘制）。 */
    border?: boolean;
    /** 超过 max 时的提示文案，支持 {n} 占位符，默认取语言包。 */
    maxText?: string;
    /** 少于 min 时的提示文案，支持 {n} 占位符，默认取语言包。 */
    minText?: string;
}

/** 全选 / 反选的选项。 */
export interface CheckboxToggleAllOptions {
    /** 期望的目标状态；不传时对每个可操作项取反。 */
    checked?: boolean;
    /** 是否跳过禁用项（保留它们原有的选中状态）。 */
    skipDisabled?: boolean;
}

/** CheckboxGroup 组件的事件契约。 */
export type CheckboxGroupEmits = {
    /** 更新当前选中值数组。 */
    'update:modelValue': [value: (string | number)[]];
    /** 任一个 checkbox 状态发生变化时触发，回调为选中的 name 数组。 */
    change: [value: (string | number)[]];
};

/** CheckboxGroup 向子 checkbox 提供的配对上下文（useChildren / useParent 通道）。 */
export interface CheckboxGroupContext {
    /** 父组件的响应式 props 对象，子项直接读取即可保持联动。 */
    props: CheckboxGroupProps;
    /** 合并后的禁用态（含 Form / FormItem 下发），子项应优先读它。 */
    disabled: ComputedRef<boolean>;
    /** 子项点击入口：在 modelValue 上增删自身值，min/max 校验与事件派发由 group 统一处理。 */
    toggleSelect(value: string | number): void;
}

/** CheckboxGroup 通过模板 ref 暴露的接口。 */
export interface CheckboxGroupExpose {
    /** 组件的响应式 props 对象。 */
    props: CheckboxGroupProps;
    /** 全选或全不选（禁用项保持原有状态），返回提交后的数组。 */
    setAllChecked(checked: boolean): (string | number)[];
    /** 批量切换：不传参数时按项取反，也可指定目标状态或跳过禁用项。 */
    toggleAll(options?: boolean | CheckboxToggleAllOptions): (string | number)[];
    /** 获取当前选中的值（返回副本）。 */
    getSelectedValues(): (string | number)[];
    /** 当前是否还能继续选择（未达 max，且未禁用）。 */
    validateSelection(): boolean;
    /** 当前选中数量。 */
    selectedCount: number;
    /** 是否已达 max。 */
    isFull: boolean;
    /** 是否还有未选项（未选满）。 */
    isEmpty: boolean;
    /** 是否已达 min（此状态下已选项不可取消）。 */
    isMinReached: boolean;
    /** 已注册的子项数量。 */
    getChildrenCount(): number;
}

/** CheckboxGroup ↔ Checkbox 配对注入键。 */
export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupContext> = Symbol('snake-checkbox-group');
