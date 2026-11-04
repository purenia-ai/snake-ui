import type { ExtractPropTypes, PropType } from 'vue';

/** circleProgressProps 运行时属性及默认值。 */
export const circleProgressProps = {
    /** 进度百分比，数值 0-100。 */
    percent: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** 圆环直径，数值按 px（375 稿）处理。 */
    width: { type: [Number, String] as PropType<number | string>, default: 100 },
    /** 圆环线条宽度，数值按 px（375 稿）处理。 */
    borderWidth: { type: [Number, String] as PropType<number | string>, default: 8 },
    /** 激活弧颜色。 */
    activeColor: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 底环颜色。 */
    inactiveColor: { type: String, default: 'var(--snake-color-divider, #e4e7ed)' },
    /** 弧端形状，round 圆头，butt 平头，square 方头。 */
    lineCap: { type: String as PropType<'butt' | 'round' | 'square'>, default: 'round' },
    /** 是否顺时针，从 12 点方向起笔。 */
    clockwise: { type: Boolean, default: true }
} as const;

/** CircleProgress 组件的公开属性。 */
export type CircleProgressProps = ExtractPropTypes<typeof circleProgressProps>;
