import type { ExtractPropTypes, PropType } from 'vue';

/** modalProps 运行时属性及默认值。 */
export const modalProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<string | Record<string, any> | unknown[]>, default: () => ({}) },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 是否显示模态框（v-model）。 */
    modelValue: { type: Boolean, default: false },
    /** 层级 z-index。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: '' },
    /** 标题。 */
    title: { type: String, default: '' },
    /** 弹窗宽度，单位 rpx。 */
    width: { type: [Number, String] as PropType<number | string>, default: 600 },
    /** 弹窗内容。 */
    content: { type: String, default: '' },
    /** 是否显示标题。 */
    showTitle: { type: Boolean, default: true },
    /** 是否显示确认按钮。 */
    showConfirmButton: { type: Boolean, default: true },
    /** 是否显示取消按钮。 */
    showCancelButton: { type: Boolean, default: false },
    /** 确认按钮文案。 */
    confirmText: { type: String, default: '' },
    /** 取消按钮文案。 */
    cancelText: { type: String, default: '' },
    /** 确认按钮颜色。 */
    confirmColor: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 取消文字颜色。 */
    cancelColor: { type: String, default: 'var(--snake-color-text-secondary, #909399)' },
    /** 弹窗圆角值，单位 rpx。 */
    borderRadius: { type: [Number, String] as PropType<number | string>, default: 16 },
    /** 标题样式。 */
    titleStyle: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 内容样式。 */
    contentStyle: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 取消按钮样式。 */
    cancelStyle: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 确定按钮样式。 */
    confirmStyle: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 是否开启缩放效果。 */
    zoom: { type: Boolean, default: true },
    /** 是否异步关闭，只对确定按钮有效。 */
    asyncClose: { type: Boolean, default: false },
    /** 是否允许点击遮罩关闭。 */
    maskCloseAble: { type: Boolean, default: false },
    /** 往上偏移的值，避免和键盘重合。 */
    negativeTop: { type: [String, Number] as PropType<number | string>, default: 0 },
    /** 是否作为全局根部 modal（配合 useModal() 使用）。 */
    global: { type: Boolean, default: false },
    /** 是否作为页面级 modal（配合 useModal({ page: true }) 使用）。 */
    page: { type: [Boolean, String] as PropType<boolean | string>, default: false }
};

/** Modal 组件公开属性。 */
export type ModalProps = ExtractPropTypes<typeof modalProps>;

/** Modal 组件的事件契约。 */
export interface ModalEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: boolean];
    /** confirm 事件。 */
    confirm: [];
    /** cancel 事件。 */
    cancel: [];
}
