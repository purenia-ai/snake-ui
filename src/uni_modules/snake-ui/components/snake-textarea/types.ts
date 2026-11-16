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
    /** 占位文本样式类名，需要页面或全局样式自行定义。 */
    placeholderClass?: string;
    /** 允许输入的最大字符数。 */
    maxlength?: number;
    /** 组件高度，数值按 px（375 稿）处理；不传时跟随 size 档位（64 / 80 / 112）。 */
    height?: UnitValue;
    /** auto height 配置。 */
    autoHeight?: boolean;
    /** 是否显示固定定位。 */
    fixed?: boolean;
    /** 数量或徽标内容。 */
    count?: boolean;
    /** 是否强制显示错误态。 */
    error?: boolean;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 是否为只读状态。 */
    readonly?: boolean;
    /** 组件尺寸，决定容器高度与字号；不传时跟随 FormItem。 */
    size?: FormSize;
    /** 边框展示模式。 */
    border?: 'none' | 'surround' | 'bottom';
    /** 内容颜色。 */
    color?: string;
    /** 占位文本颜色。 */
    placeholderColor?: string;
    /** 文字尺寸，数值按 px（375 稿）处理。 */
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
    /** 是否去掉 iOS 下 textarea 的默认内边距（仅微信小程序生效）。 */
    disableDefaultPadding?: boolean;
    /** 内容格式化函数，应为同步且无副作用。 */
    formatter?: (value: string) => string;
    /** 格式化时机。 */
    formatTrigger?: 'input' | 'blur';
    /** 失焦时是否去除首尾空格。 */
    trim?: boolean;
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
    /** clear 事件携带的参数。 */
    clear: [];
    /** click 事件携带的参数。 */
    click: [event: unknown];
};

/** Textarea 组件通过 ref 暴露的方法。 */
export interface TextareaExpose {
    /** 聚焦文本域，disabled / readonly 时不生效。 */
    focus: () => void;
    /** 让文本域失焦并收起键盘。 */
    blur: () => void;
    /** 清空内容，有值时同步派发 update:modelValue / input / change。 */
    clear: () => void;
}
