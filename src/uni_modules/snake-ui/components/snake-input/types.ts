import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { FormSize } from '../../libs/internal/form';
/** InputType 类型定义。 */
export type InputType = 'text' | 'number' | 'idcard' | 'digit' | 'password' | 'nickname';
/** InputShape 类型定义。 */
export type InputShape = 'square' | 'circle';
/** Input 组件的公开属性。 */
export interface InputProps {
    /** 双向绑定的当前值。 */
    modelValue?: string | number;
    /** 组件类型或展示模式。 */
    type?: InputType;
    /** password 配置。 */
    password?: boolean;
    /** 输入为空时的占位文本。 */
    placeholder?: string;
    /** 占位文本样式。 */
    placeholderStyle?: string;
    /** 允许输入的最大字符数。 */
    maxlength?: number;
    /** 是否显示清空操作。 */
    clearable?: boolean;
    /** show password 配置。 */
    showPassword?: boolean;
    /** prefix icon 配置。 */
    prefixIcon?: string;
    /** suffix icon 配置。 */
    suffixIcon?: string;
    /** 边框展示模式。 */
    border?: 'none' | 'surround' | 'bottom';
    /** 组件形状。 */
    shape?: InputShape;
    /** 组件尺寸。 */
    size?: FormSize;
    /** 内容颜色。 */
    color?: string;
    /** 占位文本颜色。 */
    placeholderColor?: string;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 是否为只读状态。 */
    readonly?: boolean;
    /** disabled color 配置。 */
    disabledColor?: string;
    /** 文字尺寸，数值按 rpx 处理。 */
    fontSize?: UnitValue;
    /** input align 配置。 */
    inputAlign?: 'left' | 'center' | 'right';
    /** formatter 配置。 */
    formatter?: (value: string) => string;
    /** format trigger 配置。 */
    formatTrigger?: 'input' | 'blur';
    /** trim 配置。 */
    trim?: boolean;
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
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** Input 组件的事件契约。 */
export interface InputEmits {
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
    /** clear 事件携带的参数。 */
    clear: [];
    /** click 事件携带的参数。 */
    click: [event: unknown];
    /** keyboardheightchange 事件携带的参数。 */
    keyboardheightchange: [event: unknown];
}
