import type { ExtractPropTypes, PropType } from 'vue';
import zIndex from '../../libs/config/zIndex';

/** snake-toast 支持的提示类型。 */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'default' | '';

/** snake-toast 支持的显示位置。 */
export type ToastPosition = 'center' | 'top' | 'bottom';

/** toastProps 运行时属性及默认值。 */
export const toastProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<string | Record<string, any> | unknown[]>, default: () => ({}) },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 层级 z-index。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: zIndex.toast },
    /** 提示类型，success/warning/error/info 等。 */
    type: { type: String as PropType<ToastType>, default: '' },
    /** 显示时长，单位 ms。设为 0 表示不自动关闭，需手动调用 hide/close。 */
    duration: { type: Number, default: 2000 },
    /** 是否显示图标。 */
    icon: { type: Boolean, default: true },
    /** 显示位置，center/top/bottom。 */
    position: { type: String as PropType<ToastPosition>, default: 'center' },
    /** 关闭时的回调函数。 */
    callback: { type: Function as unknown as PropType<(() => void) | null>, default: null },
    /** 是否返回上一页。 */
    back: { type: Boolean, default: false },
    /** 是否为 tab 页面跳转。 */
    isTab: { type: Boolean, default: false },
    /** 跳转的 url。 */
    url: { type: String, default: '' },
    /** 跳转参数对象。 */
    params: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 是否作为全局根部 toast（通常放在 App.vue 中，给 useToast() 使用）。 */
    global: { type: Boolean, default: false },
    /** 是否作为页面级 toast（通常放在页面中，给 useToast({ page: true }) 使用）。 */
    page: { type: [Boolean, String] as PropType<boolean | string>, default: false },
    /** 是否为 loading “常驻”。 */
    loading: { type: Boolean, default: false }
};

/** Toast 组件公开属性。 */
export type ToastProps = ExtractPropTypes<typeof toastProps>;

/** Toast 组件通过 ref 暴露的方法。 */
export type ToastExpose = {
    /** 显示 toast。 */
    show: (options: Record<string, any>) => void;
    /** 隐藏 toast。 */
    hide: () => void;
    /** 关闭 toast（hide 的别名）。 */
    close: () => void;
};
