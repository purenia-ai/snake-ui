import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** SearchShape 类型定义。 */
export type SearchShape = 'round' | 'square';
/** SearchInputAlign 类型定义。 */
export type SearchInputAlign = 'left' | 'center' | 'right';

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
    /** 是否启用清除控件。 */
    clearabled: { type: Boolean, default: true },
    /** 是否自动聚焦。 */
    focus: { type: Boolean, default: false },
    /** 是否在搜索框右侧显示操作按钮。 */
    showAction: { type: Boolean, default: true },
    /** 右侧操作按钮的样式，对象形式。 */
    actionStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 右侧操作按钮文字。 */
    actionText: { type: String, default: '' },
    /** 输入框内容水平对齐方式。 */
    inputAlign: { type: String as PropType<SearchInputAlign>, default: 'left' },
    /** 是否禁用输入框。 */
    disabled: { type: Boolean, default: false },
    /** 开启 showAction 时，是否在 input 获取焦点时才显示操作按钮。 */
    animation: { type: Boolean, default: false },
    /** 边框颜色，只要配置了颜色，才会有边框。 */
    borderColor: { type: String, default: 'none' },
    /** 双向绑定的输入值。 */
    modelValue: { type: String, default: '' },
    /** 搜索框高度，数值按 rpx 处理。 */
    height: { type: [Number, String] as PropType<number | string>, default: 64 },
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
    adjustPosition: { type: Boolean, default: true }
} as const;

/** Search 组件的公开属性。 */
export type SearchProps = ExtractPropTypes<typeof searchProps>;

/** Search 组件的事件契约。 */
export interface SearchEmits {
    /** 双向绑定值更新。 */
    'update:modelValue': [value: string];
    /** 输入事件，携带输入框内容。 */
    input: [value: string];
    /** 内容变化事件，携带输入框内容。 */
    change: [value: string];
    /** 用户确定搜索时触发。 */
    search: [value: string];
    /** 用户点击右侧操作按钮时触发。 */
    custom: [value: string];
    /** 用户点击清除按钮时触发。 */
    clear: [];
    /** 输入框获得焦点时触发。 */
    focus: [value: string];
    /** 输入框失去焦点时触发。 */
    blur: [value: string];
    /** 禁用状态下点击搜索框时触发。 */
    click: [];
}
