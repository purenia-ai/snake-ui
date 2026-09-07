import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeCheckboxGroup 组件的公开属性。 */
export interface SnakeCheckboxGroupProps {
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
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

/** SnakeCheckboxGroup 组件的事件契约。 */
export interface SnakeCheckboxGroupEmits {
    /** 更新当前选中值数组。 */
    'update:modelValue': [value: (string | number)[]];
    /** 任一个 checkbox 状态发生变化时触发，回调为选中的 name 数组。 */
    change: [value: (string | number)[]];
}
