import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
/** SliderValuePosition 类型定义。 */
export type SliderValuePosition = 'top' | 'bottom';
/** Slider 组件的公开属性。 */
export interface SliderProps {
    /** 双向绑定的当前值。 */
    modelValue?: number | string;
    /** 允许设置的最小值。 */
    min?: number | string;
    /** 允许设置的最大值。 */
    max?: number | string;
    /** 每次变化的步长。 */
    step?: number | string;
    /** 组件高度。 */
    height?: UnitValue;
    /** block width 配置。 */
    blockWidth?: UnitValue;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** block color 配置。 */
    blockColor?: string;
    /** block style 配置。 */
    blockStyle?: StyleValue;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 是否使用默认插槽替代文本。 */
    useSlot?: boolean;
    /** show value 配置。 */
    showValue?: boolean;
    /** value position 配置。 */
    valuePosition?: SliderValuePosition;
    /** show edge value 配置。 */
    showEdgeValue?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** Slider 组件的事件契约。 */
export type SliderEmits = {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: number];
    /** change 事件携带的参数。 */
    change: [value: number];
    /** start 事件携带的参数。 */
    start: [value: number];
    /** moving 事件携带的参数。 */
    moving: [value: number];
    /** end 事件携带的参数。 */
    end: [value: number];
};
/** Slider 组件实例公开的方法和状态。 */
export interface SliderExpose {
    /** update 方法。 */
    update(): Promise<void>;
}
