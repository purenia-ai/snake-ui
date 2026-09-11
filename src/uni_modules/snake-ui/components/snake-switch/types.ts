import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { FormSize } from '../snake-form/types';
/** SwitchValue 类型定义。 */
export type SwitchValue = boolean | string | number;
/** Switch 组件的公开属性。 */
export interface SwitchProps {
    /** 双向绑定的当前值。 */
    modelValue?: SwitchValue;
    /** active value 配置。 */
    activeValue?: SwitchValue;
    /** inactive value 配置。 */
    inactiveValue?: SwitchValue;
    /** 是否显示加载状态。 */
    loading?: boolean;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 组件尺寸。 */
    size?: UnitValue | FormSize;
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
    customStyle?: StyleValue;
}
/** Switch 组件的事件契约。 */
export interface SwitchEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: SwitchValue];
    /** change 事件携带的参数。 */
    change: [value: SwitchValue];
    /** click 事件携带的参数。 */
    click: [event: unknown];
}
