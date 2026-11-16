import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** PickerMode 类型定义。 */
export type PickerMode = 'single-column' | 'mutil-column' | 'mutil-column-auto';
/** PickerItem 选择列表数据项。 */
export type PickerItem = Record<string, unknown>;
/** PickerResult 确认/取消回调中的单项结果。 */
export interface PickerResult {
    /** 数据项的 value 字段。 */
    value: unknown;
    /** 数据项的 label 字段。 */
    label: unknown;
    /** 数据项额外携带的参数。 */
    extra?: unknown;
}

/**
 * 确认前拦截器：同步返回 `true`、异步 resolve `true` 才会关闭并派发 `confirm`；
 * 返回 `false`、不返回值或抛错都会保持弹层打开，方便接异步校验。
 */
export type PickerBeforeConfirm = (value: PickerResult[]) => boolean | Promise<boolean>;

/** 每一行选项的默认高度，单位 px（375 设计稿）。 */
export const DEFAULT_PICKER_ITEM_HEIGHT = 44;
/** 选择器可见行数的默认值。 */
export const DEFAULT_PICKER_VISIBLE_ITEM_COUNT = 6;
/** 联动模式的最大列数，防止循环 children 造成死循环。 */
export const MAX_PICKER_COLUMN_COUNT = 20;

/** pickerProps 运行时属性及默认值。 */
export const pickerProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 列数据。 */
    list: { type: Array as PropType<PickerItem[] | PickerItem[][]>, default: () => [] },
    /** 是否显示工具栏底部分隔线。 */
    border: { type: Boolean, default: true },
    /** 面板圆角：`true` 取 `--snake-radius-large`，数字/字符串按 CSS 尺寸，`false` 为直角。 */
    round: { type: [Boolean, Number, String] as PropType<boolean | number | string>, default: true },
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
    /** 是否将弹层传送到页面根节点渲染，避免被祖先的 transform、overflow 裁剪。 */
    rootPortal: { type: Boolean, default: false },
    /** 是否禁用选择器，禁用后无法打开。 */
    disabled: { type: Boolean, default: false },
    /** 默认选中的下标数组。 */
    defaultValue: { type: Array as PropType<number[]>, default: () => [0] },
    /** 是否保留用户上次确认的选择。 */
    preserveSelection: { type: Boolean, default: true },
    /** 模式选择，single-column 单列，mutil-column 多列，mutil-column-auto 多列联动。 */
    mode: { type: String as PropType<PickerMode>, default: 'single-column' },
    /** 自定义 value 属性名。 */
    valueName: { type: String, default: 'value' },
    /** 自定义 label 属性名。 */
    labelName: { type: String, default: 'label' },
    /** 自定义多列联动模式的 children 属性名。 */
    childName: { type: String, default: 'children' },
    /** 每一行选项的高度，单位 px（375 设计稿）。 */
    itemHeight: { type: Number, default: DEFAULT_PICKER_ITEM_HEIGHT },
    /** 可见的行数，与 itemHeight 共同决定选择器高度。 */
    visibleItemCount: { type: Number, default: DEFAULT_PICKER_VISIBLE_ITEM_COUNT },
    /** 确认前的异步拦截器。 */
    beforeConfirm: { type: Function as PropType<PickerBeforeConfirm>, default: undefined },
    /** 顶部标题。 */
    title: { type: String, default: '' },
    /** 取消按钮的文字。 */
    cancelText: { type: String, default: '' },
    /** 确认按钮的文字。 */
    confirmText: { type: String, default: '' },
    /** 无选项时的空态文案，缺省取语言包。 */
    emptyText: { type: String, default: '' }
} as const;

/** Select 组件的公开属性。 */
export type PickerProps = ExtractPropTypes<typeof pickerProps>;

/** Select 组件的事件契约。 */
export type PickerEmits = {
    /** 双向绑定值更新。 */
    'update:modelValue': [value: boolean];
    /** 打开弹层。 */
    open: [];
    /** 点击确认按钮，返回当前选择的值。 */
    confirm: [value: PickerResult[]];
    /** 点击取消按钮，返回当前选择的值。 */
    cancel: [value: PickerResult[]];
    /** 点击遮罩等非确认/取消方式关闭时触发。 */
    close: [];
    /** 滚动过程中选中项变化时触发，参数与 confirm 一致。 */
    change: [value: PickerResult[]];
};

/** Select 组件通过模板 ref 暴露的接口。 */
export interface PickerExpose {
    /** 打开选择器，需要绑定 v-model 才能生效。 */
    open(): void;
    /** 关闭选择器。 */
    close(): void;
}
