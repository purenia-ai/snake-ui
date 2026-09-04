import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeSelectMode 类型定义。 */
export type SnakeSelectMode = 'single-column' | 'mutil-column' | 'mutil-column-auto';
/** SnakeSelectItem 选择列表数据项。 */
export type SnakeSelectItem = Record<string, unknown>;
/** SnakeSelectResult 确认/取消回调中的单项结果。 */
export interface SnakeSelectResult {
    /** 数据项的 value 字段。 */
    value: unknown;
    /** 数据项的 label 字段。 */
    label: unknown;
    /** 数据项额外携带的参数。 */
    extra?: unknown;
}

/** snakeSelectProps 运行时属性及默认值。 */
export const snakeSelectProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 列数据。 */
    list: { type: Array as PropType<SnakeSelectItem[] | SnakeSelectItem[][]>, default: () => [] },
    /** 是否显示边框。 */
    border: { type: Boolean, default: true },
    /** 双向绑定控制选择器的弹出与收起。 */
    modelValue: { type: Boolean, default: false },
    /** 取消按钮的颜色。 */
    cancelColor: { type: String, default: 'var(--snake-color-text-secondary, #606266)' },
    /** 确认按钮的颜色。 */
    confirmColor: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 弹出时的层级，0 表示使用弹层默认层级。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** 是否开启底部安全区适配。 */
    safeAreaInsetBottom: { type: Boolean, default: false },
    /** 是否允许通过点击遮罩关闭选择器。 */
    maskCloseAble: { type: Boolean, default: true },
    /** 默认选中的下标数组。 */
    defaultValue: { type: Array as PropType<number[]>, default: () => [0] },
    /** 是否保留用户上次确认的选择。 */
    preserveSelection: { type: Boolean, default: true },
    /** 模式选择，single-column 单列，mutil-column 多列，mutil-column-auto 多列联动。 */
    mode: { type: String as PropType<SnakeSelectMode>, default: 'single-column' },
    /** 自定义 value 属性名。 */
    valueName: { type: String, default: 'value' },
    /** 自定义 label 属性名。 */
    labelName: { type: String, default: 'label' },
    /** 自定义多列联动模式的 children 属性名。 */
    childName: { type: String, default: 'children' },
    /** 顶部标题。 */
    title: { type: String, default: '' },
    /** 取消按钮的文字。 */
    cancelText: { type: String, default: '' },
    /** 确认按钮的文字。 */
    confirmText: { type: String, default: '' }
} as const;

/** SnakeSelect 组件的公开属性。 */
export type SnakeSelectProps = ExtractPropTypes<typeof snakeSelectProps>;

/** SnakeSelect 组件的事件契约。 */
export interface SnakeSelectEmits {
    /** 双向绑定值更新。 */
    'update:modelValue': [value: boolean];
    /** 点击确认按钮，返回当前选择的值。 */
    confirm: [value: SnakeSelectResult[]];
    /** 点击取消按钮，返回当前选择的值。 */
    cancel: [value: SnakeSelectResult[]];
    /** 点击遮罩等非确认/取消方式关闭时触发。 */
    close: [];
    /** 点击触发入口时触发（兼容声明）。 */
    click: [];
}
