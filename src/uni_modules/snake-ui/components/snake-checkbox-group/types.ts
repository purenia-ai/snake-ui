import type { InjectionKey } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** CheckboxGroup 组件的公开属性。 */
export interface CheckboxGroupProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 绑定值，选中的 checkbox name 组成的数组，支持 v-model。 */
    modelValue?: (string | number)[];
    /** 最多能选中多少个 checkbox。 */
    max?: number;
    /** 是否禁用所有 checkbox。 */
    disabled?: boolean;
    /** 在表单内提交时的标识符。 */
    name?: boolean | string;
    /** 是否禁止点击标签选中。 */
    labelDisabled?: boolean;
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape?: 'square' | 'circle';
    /** 选中状态下的颜色，应用到所有子 checkbox。 */
    activeColor?: string;
    /** 组件整体大小，small/default/large 或自定义数值。 */
    size?: string | number;
    /** 每个 checkbox 占 snake-checkbox-group 的宽度，需带单位。 */
    width?: string;
    /** 是否每个 checkbox 都换行。 */
    wrap?: boolean;
    /** 勾选图标的大小，单位 rpx。 */
    iconSize?: UnitValue;
}

/** CheckboxGroup 组件的事件契约。 */
export interface CheckboxGroupEmits {
    /** 更新当前选中值数组。 */
    'update:modelValue': [value: (string | number)[]];
    /** 任一个 checkbox 状态发生变化时触发，回调为选中的 name 数组。 */
    change: [value: (string | number)[]];
}

/** CheckboxGroup 向子 checkbox 提供的配对上下文（useChildren / useParent 通道）。 */
export interface CheckboxGroupContext {
    /** 父组件的响应式 props 对象，子项直接读取即可保持联动。 */
    props: CheckboxGroupProps;
    /** 子项点击后通知 group 收集选中值并派发 change（防抖合并同轮多次点击）。 */
    emitEvent(): void;
    /** 校验再选中一个是否会超过 max，超限则 toast 并返回 false。 */
    validateSelection(): boolean;
}

/** CheckboxGroup ↔ Checkbox 配对注入键。 */
export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupContext> = Symbol('snake-checkbox-group');
