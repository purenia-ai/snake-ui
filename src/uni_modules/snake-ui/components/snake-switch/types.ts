import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormSize } from '../../libs/internal/form';
/** SnakeSwitchValue 类型定义。 */
export type SnakeSwitchValue = boolean | string | number;
/** SnakeSwitch 组件的公开属性。 */
export interface SnakeSwitchProps {
    /** 双向绑定的当前值。 */
    modelValue?: SnakeSwitchValue;
    /** active value 配置。 */
    activeValue?: SnakeSwitchValue;
    /** inactive value 配置。 */
    inactiveValue?: SnakeSwitchValue;
    /** 是否显示加载状态。 */
    loading?: boolean;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 组件尺寸。 */
    size?: UnitValue | SnakeFormSize;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** space 配置。 */
    space?: UnitValue;
    /** vibrate short 配置。 */
    vibrateShort?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeSwitch 组件的事件契约。 */
export interface SnakeSwitchEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: SnakeSwitchValue];
    /** change 事件携带的参数。 */
    change: [value: SnakeSwitchValue];
    /** click 事件携带的参数。 */
    click: [event: unknown];
}
