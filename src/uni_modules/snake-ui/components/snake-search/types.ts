import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** SearchShape 类型定义。 */
export type SearchShape = 'round' | 'square';
/** SearchInputAlign 类型定义。 */
export type SearchInputAlign = 'left' | 'center' | 'right';
/** SearchInputType 类型定义。 */
export type SearchInputType = 'text' | 'number' | 'idcard' | 'digit';

/** searchProps 运行时属性及默认值。 */
export const searchProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 搜索框形状，round 圆形，square 方形。 */
    shape: { type: String as PropType<SearchShape>, default: 'round' },
    /** 搜索框背景色。 */
    bgColor: { type: String, default: 'var(--snake-color-surface-muted, #f2f3f6)' },
    /** 占位提示文字。 */
    placeholder: { type: String, default: '' },
    /** 是否启用清除控件；启用后只要输入框有内容就显示，不依赖聚焦状态。 */
    clearabled: { type: Boolean, default: true },
    /** 是否自动聚焦。 */
    focus: { type: Boolean, default: false },
    /** 是否在搜索框右侧显示操作按钮。 */
    showAction: { type: Boolean, default: true },
    /** 右侧操作按钮的样式，作用于按钮本体（宽度、圆角、背景等），不会影响显隐。 */
    actionStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 右侧操作按钮文字。 */
    actionText: { type: String, default: '' },
    /** 输入框内容水平对齐方式。 */
    inputAlign: { type: String as PropType<SearchInputAlign>, default: 'left' },
    /** 是否禁用输入框；禁用时输入框不可编辑、清除控件隐藏，点击组件会触发 click。 */
    disabled: { type: Boolean, default: false },
    /** 开启 showAction 时，是否在 input 获取焦点时才展开操作按钮。 */
    animation: { type: Boolean, default: false },
    /** 边框颜色，只要配置了颜色，才会有边框。 */
    borderColor: { type: String, default: '' },
    /** 双向绑定的输入值。 */
    modelValue: { type: String, default: '' },
    /** 搜索框高度，数值按 px（375 稿）处理。 */
    height: { type: [Number, String] as PropType<number | string>, default: 32 },
    /** 输入框的样式，可以定义文字颜色、大小等，对象形式。 */
    inputStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 输入框最大能输入的长度，-1 为不限制长度。 */
    maxlength: { type: [Number, String] as PropType<number | string>, default: '-1' },
    /** 搜索图标的颜色，默认同输入框字体颜色。 */
    searchIconColor: { type: String, default: '' },
    /** 输入框字体颜色。 */
    color: { type: String, default: 'var(--snake-color-text-secondary, #606266)' },
    /** placeholder 的颜色。 */
    placeholderColor: { type: String, default: 'var(--snake-color-text-muted, #909399)' },
    /** 与上下左右元素的间距，带单位的字符串形式。 */
    margin: { type: String, default: '0' },
    /** 左侧输入框的图标，可以为图标名称或图片路径。 */
    searchIcon: { type: String, default: 'search' },
    /** 弹出键盘时是否自动调节高度。 */
    adjustPosition: { type: Boolean, default: true },
    /** 输入框类型：text 文本键盘，number 数字键盘，idcard 身份证键盘，digit 带小数点数字键盘。 */
    type: { type: String as PropType<SearchInputType>, default: 'text' }
} as const;

/** Search 组件的公开属性。 */
export type SearchProps = ExtractPropTypes<typeof searchProps>;

/** Search 组件的事件契约。 */
export type SearchEmits = {
    /** 双向绑定值更新。 */
    'update:modelValue': [value: string];
    /** 用户输入时触发（程序化修改 modelValue 不会再触发）。 */
    input: [value: string];
    /** 用户输入或清除时触发，语义同 input。 */
    change: [value: string];
    /** 用户确定搜索时触发。 */
    search: [value: string];
    /** 用户点击右侧操作按钮时触发。 */
    custom: [value: string];
    /** 用户点击清除控件时触发（此时 modelValue 已更新为空串）。 */
    clear: [];
    /** 输入框获得焦点时触发。 */
    focus: [value: string];
    /** 输入框失去焦点时触发。 */
    blur: [value: string];
    /** 禁用状态下点击搜索框时触发。 */
    click: [];
};

/** Search 组件通过 ref 暴露的方法。 */
export interface SearchExpose {
    /** 聚焦输入框，disabled 时不生效。 */
    focus: () => void;
    /** 让输入框失焦并收起键盘。 */
    blur: () => void;
    /** 清空输入内容，并同步派发 update:modelValue / input / change / clear。 */
    clear: () => void;
}
