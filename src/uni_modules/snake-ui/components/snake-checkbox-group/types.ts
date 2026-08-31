import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeChoiceDirection } from '../../libs/internal/checkbox';
import type { SnakeFormSize } from '../../libs/internal/form';
/** SnakeCheckboxGroup 组件的公开属性。 */
export interface SnakeCheckboxGroupProps {
    /** 双向绑定的当前值。 */
    modelValue?: unknown[];
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 允许设置的最大值。 */
    max?: number;
    /** 内容排列或滚动方向。 */
    direction?: SnakeChoiceDirection;
    /** 内容出现的位置。 */
    placement?: SnakeChoiceDirection;
    /** 组件尺寸。 */
    size?: SnakeFormSize;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** 图标尺寸，数值按 rpx 处理。 */
    iconSize?: UnitValue;
    /** 标签文字尺寸，数值按 rpx 处理。 */
    labelSize?: UnitValue;
    /** 组件形状。 */
    shape?: 'square' | 'circle';
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeCheckboxGroup 组件的事件契约。 */
export interface SnakeCheckboxGroupEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: unknown[]];
    /** change 事件携带的参数。 */
    change: [value: unknown[]];
}
