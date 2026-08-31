import type { ExtractPropTypes, PropType } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormSize } from '../../libs/internal/form';

/** snakeRadioProps 运行时属性及默认值。 */
export const snakeRadioProps = {
    /** 双向绑定的当前值。 */
    modelValue: { type: Boolean, default: false },
    /** 数据项名称或唯一标识。 */
    name: null as unknown as PropType<unknown>,
    /** 展示标签文本。 */
    label: { type: String, default: '' },
    /** 是否禁用交互。 */
    disabled: { type: Boolean, default: false },
    /** 是否禁止点击标签切换状态。 */
    labelDisabled: { type: Boolean, default: false },
    /** 组件形状。 */
    shape: String as PropType<'square' | 'circle'>,
    /** 组件尺寸。 */
    size: String as PropType<SnakeFormSize>,
    /** 激活状态颜色。 */
    activeColor: String,
    /** 未激活状态颜色。 */
    inactiveColor: String,
    /** 图标颜色。 */
    iconColor: { type: String, default: '#fff' },
    /** 图标尺寸，数值按 rpx 处理。 */
    iconSize: [String, Number] as PropType<UnitValue>,
    /** 标签文字尺寸，数值按 rpx 处理。 */
    labelSize: [String, Number] as PropType<UnitValue>,
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' }
} as const;

/** SnakeRadioResolved 组件的公开属性。 */
export type SnakeRadioResolvedProps = ExtractPropTypes<typeof snakeRadioProps>;

/** SnakeRadio 组件的公开属性。 */
export interface SnakeRadioProps {
    /** 双向绑定的当前值。 */
    modelValue?: boolean;
    /** 数据项名称或唯一标识。 */
    name?: unknown;
    /** 展示标签文本。 */
    label?: string;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 是否禁止点击标签切换状态。 */
    labelDisabled?: boolean;
    /** 组件形状。 */
    shape?: 'square' | 'circle';
    /** 组件尺寸。 */
    size?: SnakeFormSize;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** 图标颜色。 */
    iconColor?: string;
    /** 图标尺寸，数值按 rpx 处理。 */
    iconSize?: UnitValue;
    /** 标签文字尺寸，数值按 rpx 处理。 */
    labelSize?: UnitValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeRadio 组件的事件契约。 */
export interface SnakeRadioEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: boolean];
    /** change 事件携带的参数。 */
    change: [value: boolean, name: unknown];
    /** click 事件携带的参数。 */
    click: [event: unknown];
}
