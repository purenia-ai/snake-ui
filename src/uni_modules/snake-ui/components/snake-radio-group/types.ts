import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

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
    /** 组件整体大小，small/default/large 或自定义数值。 */
    size?: string | number;
    /** 是否禁止点击标签选中。 */
    labelDisabled?: boolean;
    /** 组件形状，square 为方形，circle 为圆形。 */
    shape?: 'square' | 'circle';
    /** 勾选图标的大小，单位 rpx。 */
    iconSize?: UnitValue;
    /** 每个 radio 占 snake-radio-group 的宽度，需带单位。 */
    width?: UnitValue;
    /** 是否每个 radio 都换行。 */
    wrap?: boolean;
}

/** RadioGroup 组件的事件契约。 */
export interface RadioGroupEmits {
    /** 更新当前选中值。 */
    'update:modelValue': [value: string | number];
    /** 任一个 radio 状态发生变化时触发，携带最新选中值。 */
    change: [value: string | number];
}
