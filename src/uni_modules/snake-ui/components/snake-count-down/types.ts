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
    /** 分隔符大小，单位 px（375 稿）。 */
    separatorSize: { type: [Number, String] as PropType<number | string>, default: 15 },
    /** 分隔符颜色。 */
    separatorColor: { type: String, default: 'var(--snake-color-text, #22292f)' },
    /** 倒计时数字颜色。 */
    color: { type: String, default: 'var(--snake-color-text, #22292f)' },
    /** 倒计时数字大小，单位 px（375 稿）。 */
    fontSize: { type: [Number, String] as PropType<number | string>, default: 15 },
    /** 倒计时数字背景颜色。 */
    bgColor: { type: String, default: 'var(--snake-color-surface, #fff)' },
    /** 数字块高度（宽度不小于该值），单位 px（375 稿）。 */
    height: { type: [Number, String] as PropType<number | string>, default: 'auto' },
    /** 是否显示数字边框。 */
    showBorder: { type: Boolean, default: false },
    /** 数字边框颜色。 */
    borderColor: { type: String, default: 'var(--snake-color-text, #22292f)' },
    /** 是否显示秒。 */
    showSeconds: { type: Boolean, default: true },
    /** 是否显示分钟；关闭后分钟数折算到秒。 */
    showMinutes: { type: Boolean, default: true },
    /** 是否显示小时；关闭后小时数折算到分钟。 */
    showHours: { type: Boolean, default: true },
    /** 是否显示天；关闭后天数折算到小时。 */
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
    /** 分隔符大小，单位 px（375 稿）。 */
    separatorSize?: number | string;
    /** 分隔符颜色。 */
    separatorColor?: string;
    /** 倒计时数字颜色。 */
    color?: string;
    /** 倒计时数字大小，单位 px（375 稿）。 */
    fontSize?: number | string;
    /** 倒计时数字背景颜色。 */
    bgColor?: string;
    /** 数字块高度（宽度不小于该值），单位 px（375 稿）。 */
    height?: number | string;
    /** 是否显示数字边框。 */
    showBorder?: boolean;
    /** 数字边框颜色。 */
    borderColor?: string;
    /** 是否显示秒。 */
    showSeconds?: boolean;
    /** 是否显示分钟；关闭后分钟数折算到秒。 */
    showMinutes?: boolean;
    /** 是否显示小时；关闭后小时数折算到分钟。 */
    showHours?: boolean;
    /** 是否显示天；关闭后天数折算到小时。 */
    showDays?: boolean;
    /** 天数为 0 时是否隐藏天部分。 */
    hideZeroDay?: boolean;
}

/** CountDown 组件的事件契约。 */
export type CountDownEmits = {
    /** 倒计时归零或提前结束时触发。 */
    end: [];
    /** 开始计时与每秒更新时触发，参数为剩余秒数。 */
    change: [seconds: number];
};

/** CountDown 组件暴露的方法。 */
export interface CountDownExpose {
    /** 开始倒计时；暂停后再次调用会从剩余时间继续。 */
    start: () => void;
    /** 暂停倒计时，保留剩余时间。 */
    pause: () => void;
    /** 重设到 timestamp 指定的时长，autoplay 为真时立即开始。 */
    reset: () => void;
    /** 提前结束并触发 end 事件。 */
    end: () => void;
    /** 静默停止倒计时，不触发 end 事件，也不复位显示。 */
    destroy: () => void;
}
