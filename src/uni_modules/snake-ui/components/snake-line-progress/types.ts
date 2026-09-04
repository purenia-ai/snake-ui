import type { ExtractPropTypes, PropType } from 'vue';

/** snakeLineProgressProps 运行时属性及默认值。 */
export const snakeLineProgressProps = {
    /** 进度条两端是否显示半圆形。 */
    round: { type: Boolean, default: true },
    /** 主题颜色，如设置则 activeColor 失效，可选 primary/success/warning/error/info。 */
    type: { type: String, default: '' },
    /** 激活部分的颜色。 */
    activeColor: { type: String, default: 'var(--snake-color-success, #19be6b)' },
    /** 进度条的底色。 */
    inactiveColor: { type: String, default: 'var(--snake-color-divider, #e4e7ed)' },
    /** 进度百分比，数值 0-100。 */
    percent: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** 是否在进度条内部显示百分比的值。 */
    showPercent: { type: Boolean, default: true },
    /** 进度条的高度，数值按 rpx 处理。 */
    height: { type: [Number, String] as PropType<number | string>, default: 28 },
    /** 是否显示激活部分的条纹。 */
    striped: { type: Boolean, default: false },
    /** 条纹是否具有动态效果。 */
    stripedActive: { type: Boolean, default: false }
} as const;

/** SnakeLineProgress 组件的公开属性。 */
export type SnakeLineProgressProps = ExtractPropTypes<typeof snakeLineProgressProps>;
