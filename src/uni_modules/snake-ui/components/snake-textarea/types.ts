import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { FormSize } from '../snake-form/types';
/** Textarea 组件的公开属性。 */
export interface TextareaProps {
    /** 双向绑定的当前值。 */
    modelValue?: string | number;
    /** 输入为空时的占位文本。 */
    placeholder?: string;
    /** 占位文本样式。 */
    placeholderStyle?: string;
    /** 允许输入的最大字符数。 */
    maxlength?: number;
    /** 组件高度。 */
    height?: UnitValue;
    /** auto height 配置。 */
    autoHeight?: boolean;
    /** 是否使用固定定位。 */
    fixed?: boolean;
    /** 数量或徽标内容。 */
    count?: boolean;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 是否为只读状态。 */
    readonly?: boolean;
    /** 组件尺寸。 */
    size?: FormSize;
    /** 边框展示模式。 */
    border?: 'none' | 'surround' | 'bottom';
    /** 内容颜色。 */
    color?: string;
    /** 占位文本颜色。 */
    placeholderColor?: string;
    /** 文字尺寸，数值按 rpx 处理。 */
    fontSize?: UnitValue;
    /** 是否自动获取焦点。 */
    focus?: boolean;
    /** 输入框光标位置。 */
    cursor?: number;
    /** 文本选择区域的起始位置。 */
    selectionStart?: number;
    /** 文本选择区域的结束位置。 */
    selectionEnd?: number;
    /** 键盘右下角确认按钮类型。 */
    confirmType?: string;
    /** 确认输入后是否保持键盘弹出。 */
    confirmHold?: boolean;
    /** 键盘弹起时是否自动调整页面位置。 */
    adjustPosition?: boolean;
    /** 点击页面时是否保持键盘弹出。 */
    holdKeyboard?: boolean;
    /** 光标与键盘的距离，单位 px。 */
    cursorSpacing?: number;
    /** show confirm bar 配置。 */
    showConfirmBar?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** Textarea 组件的事件契约。 */
export type TextareaEmits = {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: string];
    /** input 事件携带的参数。 */
    input: [value: string];
    /** change 事件携带的参数。 */
    change: [value: string];
    /** focus 事件携带的参数。 */
    focus: [event: unknown];
    /** blur 事件携带的参数。 */
    blur: [event: unknown];
    /** confirm 事件携带的参数。 */
    confirm: [value: string, event: unknown];
    /** linechange 事件携带的参数。 */
    linechange: [event: unknown];
    /** keyboardheightchange 事件携带的参数。 */
    keyboardheightchange: [event: unknown];
};
