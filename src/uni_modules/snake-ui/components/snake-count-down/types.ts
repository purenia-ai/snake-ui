import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** countDownProps 运行时属性及默认值。 */
export const countDownProps = {
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 倒计时剩余秒数。 */
    timestamp: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** 是否挂载后自动开始倒计时。 */
    autoplay: { type: Boolean, default: true },
    /** 分隔符形态，colon 为英文冒号，zh 为中文单位。 */
    separator: { type: String as PropType<'colon' | 'zh'>, default: 'colon' },
    /** 分隔符大小，单位 rpx。 */
    separatorSize: { type: [Number, String] as PropType<number | string>, default: 30 },
    /** 分隔符颜色。 */
    separatorColor: { type: String, default: 'var(--snake-color-text, #22292f)' },
    /** 倒计时数字颜色。 */
    color: { type: String, default: 'var(--snake-color-text, #22292f)' },
    /** 倒计时数字大小，单位 rpx。 */
    fontSize: { type: [Number, String] as PropType<number | string>, default: 30 },
    /** 倒计时数字背景颜色。 */
    bgColor: { type: String, default: 'var(--snake-color-surface, #fff)' },
    /** 数字块高度（宽度同值），单位 rpx。 */
    height: { type: [Number, String] as PropType<number | string>, default: 'auto' },
    /** 是否显示数字边框。 */
    showBorder: { type: Boolean, default: false },
    /** 数字边框颜色。 */
    borderColor: { type: String, default: 'var(--snake-color-text, #22292f)' },
    /** 是否显示秒。 */
    showSeconds: { type: Boolean, default: true },
    /** 是否显示分钟。 */
    showMinutes: { type: Boolean, default: true },
    /** 是否显示小时。 */
    showHours: { type: Boolean, default: true },
    /** 是否显示天。 */
    showDays: { type: Boolean, default: true },
    /** 天数为 0 时是否隐藏天部分。 */
    hideZeroDay: { type: Boolean, default: false }
} as const;

/** CountDownResolved 组件的解析属性。 */
export type CountDownResolvedProps = ExtractPropTypes<typeof countDownProps>;

/** CountDown 组件的公开属性。 */
export interface CountDownProps {
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 倒计时剩余秒数。 */
    timestamp?: number | string;
    /** 是否挂载后自动开始倒计时。 */
    autoplay?: boolean;
    /** 分隔符形态，colon 为英文冒号，zh 为中文单位。 */
    separator?: 'colon' | 'zh';
    /** 分隔符大小，单位 rpx。 */
    separatorSize?: number | string;
    /** 分隔符颜色。 */
    separatorColor?: string;
    /** 倒计时数字颜色。 */
    color?: string;
    /** 倒计时数字大小，单位 rpx。 */
    fontSize?: number | string;
    /** 倒计时数字背景颜色。 */
    bgColor?: string;
    /** 数字块高度（宽度同值），单位 rpx。 */
    height?: number | string;
    /** 是否显示数字边框。 */
    showBorder?: boolean;
    /** 数字边框颜色。 */
    borderColor?: string;
    /** 是否显示秒。 */
    showSeconds?: boolean;
    /** 是否显示分钟。 */
    showMinutes?: boolean;
    /** 是否显示小时。 */
    showHours?: boolean;
    /** 是否显示天。 */
    showDays?: boolean;
    /** 天数为 0 时是否隐藏天部分。 */
    hideZeroDay?: boolean;
}

/** CountDown 组件的事件契约。 */
export interface CountDownEmits {
    /** 倒计时结束时触发。 */
    end: [];
    /** 每秒触发一次，参数为剩余秒数。 */
    change: [seconds: number];
}

/** CountDown 组件暴露的方法。 */
export interface CountDownExpose {
    /** 开始倒计时。 */
    start: () => void;
    /** 结束倒计时。 */
    end: () => void;
}
