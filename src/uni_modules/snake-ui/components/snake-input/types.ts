import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { FormSize } from '../snake-form/types';
/** InputType 类型定义。 */
export type InputType = 'text' | 'number' | 'idcard' | 'digit' | 'password' | 'nickname';
/** InputShape 类型定义。 */
export type InputShape = 'square' | 'circle';
/** 清空按钮的显示时机：always 有内容即显示，focus 仅在聚焦且有内容时显示。 */
export type InputClearTrigger = 'always' | 'focus';
/** Input 组件的公开属性。 */
export interface InputProps {
    /** 双向绑定的当前值。 */
    modelValue?: string | number;
    /** 组件类型或展示模式。 */
    type?: InputType;
    /** 输入为空时的占位文本。 */
    placeholder?: string;
    /** 占位文本样式。 */
    placeholderStyle?: string;
    /** 占位文本样式类名，需要页面或全局样式自行定义。 */
    placeholderClass?: string;
    /** 输入框本体的附加类名。 */
    customInputClass?: string;
    /** 允许输入的最大字符数。 */
    maxlength?: number;
    /** 是否显示清空操作。 */
    clearable?: boolean;
    /** 清空按钮的显示时机。 */
    clearTrigger?: InputClearTrigger;
    /** show password 配置。 */
    showPassword?: boolean;
    /** 是否显示字数统计，需同时设置 maxlength。 */
    showWordLimit?: boolean;
    /** 是否强制显示错误态。 */
    error?: boolean;
    /** prefix icon 配置。 */
    prefixIcon?: string;
    /** suffix icon 配置。 */
    suffixIcon?: string;
    /** 边框展示模式。 */
    border?: 'none' | 'surround' | 'bottom';
    /** 组件形状。 */
    shape?: InputShape;
    /** 组件尺寸，决定容器高度、字号与图标大小；不传时跟随 FormItem。 */
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
    /** 文字尺寸，数值按 px（375 稿）处理；不传时跟随 size 档位（small 13 / default 14 / large 16）。 */
    fontSize?: UnitValue;
    /** 容器高度，数值按 px（375 稿）处理；不传时跟随 size 档位（32 / 40 / 48）。 */
    height?: UnitValue;
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
export type InputEmits = {
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
};

/** Input 组件通过 ref 暴露的方法。 */
export interface InputExpose {
    /** 聚焦输入框，disabled / readonly 时不生效。 */
    focus: () => void;
    /** 让输入框失焦并收起键盘。 */
    blur: () => void;
    /** 清空输入内容，有值时同步派发 update:modelValue / input / change。 */
    clear: () => void;
}
