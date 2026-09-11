import type { ExtractPropTypes, PropType } from 'vue';
import zIndex from '../../libs/config/zIndex';

/** noNetworkProps 运行时属性及默认值。 */
export const noNetworkProps = {
    /** 没有网络时的提示语。 */
    tips: { type: String, default: '' },
    /** 组件的层级值。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: zIndex.noNetwork },
    /** 无网络的图片提示，可用的图片地址或 base64 图片。 */
    image: { type: String, default: '' }
} as const;

/** NoNetwork 组件的公开属性。 */
export type NoNetworkProps = ExtractPropTypes<typeof noNetworkProps>;

/** NoNetwork 组件的事件契约。 */
export type NoNetworkEmits = {
    /** 用户点击重试按钮时触发。 */
    retry: [];
};

/** NoNetwork 组件实例公开的方法。 */
export interface NoNetworkExpose {
    /** 重新检查网络并发出 retry 事件。 */
    retry(): void;
}
