import type { ExtractPropTypes, PropType } from 'vue';
import zIndex from '../../libs/config/zIndex';

/** snakeNoNetworkProps 运行时属性及默认值。 */
export const snakeNoNetworkProps = {
    /** 没有网络时的提示语。 */
    tips: { type: String, default: '' },
    /** 组件的层级值。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: zIndex.noNetwork },
    /** 无网络的图片提示，可用的图片地址或 base64 图片。 */
    image: { type: String, default: '' }
} as const;

/** SnakeNoNetwork 组件的公开属性。 */
export type SnakeNoNetworkProps = ExtractPropTypes<typeof snakeNoNetworkProps>;

/** SnakeNoNetwork 组件的事件契约。 */
export interface SnakeNoNetworkEmits {
    /** 用户点击重试按钮时触发。 */
    retry: [];
}

/** SnakeNoNetwork 组件实例公开的方法。 */
export interface SnakeNoNetworkExpose {
    /** 重新检查网络并发出 retry 事件。 */
    retry(): void;
}
