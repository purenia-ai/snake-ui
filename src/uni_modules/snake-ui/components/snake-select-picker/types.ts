import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** SelectPickerPrimitive 选项的原始值类型。 */
export type SelectPickerPrimitive = string | number | boolean;
/** SelectPickerValue 选中值：单选为原始值，多选为数组。 */
export type SelectPickerValue = SelectPickerPrimitive | SelectPickerPrimitive[];
/** SelectPickerItem 选项数据结构，字段名由 valueName / labelName / disabledName 决定。 */
export type SelectPickerItem = Record<string, unknown>;

/**
 * 确认前拦截器：同步返回 `true`、异步 resolve `true` 才会提交并关闭；
 * 返回 `false`、不返回值或抛错都会保持弹层打开，方便接异步校验。
 */
export type SelectPickerBeforeConfirm = (value: SelectPickerValue) => boolean | Promise<boolean>;

/** 列表区默认最大高度，单位 px（375 设计稿），与 snake-picker 的 6 行视觉对齐。 */
export const DEFAULT_SELECT_PICKER_MAX_HEIGHT = 264;
/** 多选最多可选数量的默认值，`0` 表示不限制。 */
export const DEFAULT_SELECT_PICKER_MAX = 0;
/** 多选最少可选数量的默认值。 */
export const DEFAULT_SELECT_PICKER_MIN = 0;

/** selectPickerProps 运行时属性及默认值。 */
export const selectPickerProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 选中值：单选为标量，多选为数组，配合 `v-model` 使用。 */
    modelValue: {
        type: [String, Number, Boolean, Array] as PropType<SelectPickerValue>,
        default: undefined
    },
    /** 弹层开合，配合 `v-model:visible` 使用。 */
    visible: { type: Boolean, default: false },
    /** 选项数据，字段名由 valueName / labelName / disabledName 决定。 */
    list: { type: Array as PropType<SelectPickerItem[]>, default: () => [] },
    /** 是否多选；开启后 `v-model` 为数组。 */
    multiple: { type: Boolean, default: false },
    /** 选项对象中的值字段名。 */
    valueName: { type: String, default: 'value' },
    /** 选项对象中的文案字段名。 */
    labelName: { type: String, default: 'label' },
    /** 选项对象中的禁用字段名。 */
    disabledName: { type: String, default: 'disabled' },
    /** 弹层标题，缺省取语言包。 */
    title: { type: String, default: '' },
    /** 确认按钮文案，缺省取语言包。 */
    confirmText: { type: String, default: '' },
    /** 是否显示确认栏；不传时单选为 `false`（选中即提交）、多选为 `true`。 */
    showConfirm: { type: Boolean, default: undefined },
    /** 多选最少选中数，单选忽略。 */
    min: { type: Number, default: DEFAULT_SELECT_PICKER_MIN },
    /** 多选最多选中数，`0` 为不限制，单选忽略。 */
    max: { type: Number, default: DEFAULT_SELECT_PICKER_MAX },
    /** 是否开启本地搜索。 */
    filterable: { type: Boolean, default: false },
    /** 搜索框占位文案，缺省取语言包。 */
    filterPlaceholder: { type: String, default: '' },
    /** 是否处于加载态：内容区遮罩，选项与确认均不可用。 */
    loading: { type: Boolean, default: false },
    /** 空数据文案，缺省取语言包。 */
    emptyText: { type: String, default: '' },
    /** 搜索无结果文案，缺省取语言包。 */
    noMatchText: { type: String, default: '' },
    /** 未达 min 的提示文案，缺省取语言包，`{n}` 会替换为 min。 */
    minText: { type: String, default: '' },
    /** 确认前拦截器。 */
    beforeConfirm: { type: Function as PropType<SelectPickerBeforeConfirm>, default: undefined },
    /** 打开时是否滚动到首个已选项。 */
    scrollIntoView: { type: Boolean, default: true },
    /** 是否允许点击遮罩关闭。 */
    closeOnClickOverlay: { type: Boolean, default: true },
    /** 是否开启底部安全区适配。 */
    safeAreaInsetBottom: { type: Boolean, default: true },
    /** 是否将弹层传送到页面根节点渲染，避免被祖先的 transform、overflow 裁剪。 */
    rootPortal: { type: Boolean, default: false },
    /** 面板圆角：`true` 取 `--snake-radius-large`，数字/字符串按 CSS 尺寸，`false` 为直角。 */
    round: { type: [Boolean, Number, String] as PropType<boolean | number | string>, default: true },
    /** 列表区最大高度，单位 px（375 设计稿）。 */
    maxHeight: { type: Number, default: DEFAULT_SELECT_PICKER_MAX_HEIGHT },
    /** 选中色，缺省取主题主色。 */
    activeColor: { type: String, default: '' },
    /** 是否禁用整组件，禁用后无法打开。 */
    disabled: { type: Boolean, default: false },
    /** 弹出时的层级，0 表示使用弹层默认层级。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: 0 }
} as const;

/** SelectPicker 组件的公开属性。 */
export type SelectPickerProps = ExtractPropTypes<typeof selectPickerProps>;

/** SelectPicker 组件的事件契约。 */
export type SelectPickerEmits = {
    /** 确认提交时派发的选中值。 */
    'update:modelValue': [value: SelectPickerValue];
    /** 打开或关闭弹层时派发。 */
    'update:visible': [visible: boolean];
    /** 打开动画完成后触发。 */
    open: [];
    /** 草稿变化时触发：多选每次勾选，单选在点选时触发。 */
    change: [value: SelectPickerValue, items: SelectPickerItem[]];
    /** 确认提交时触发。 */
    confirm: [value: SelectPickerValue, items: SelectPickerItem[]];
    /** 弹层关闭后触发（含确认关闭、遮罩关闭与关闭图标）。 */
    close: [];
};

/** SelectPicker 组件通过模板 ref 暴露的接口。 */
export interface SelectPickerExpose {
    /** 打开弹层，需要绑定 visible 才能生效。 */
    open(): void;
    /** 关闭弹层并丢弃未确认的草稿。 */
    close(): void;
}
