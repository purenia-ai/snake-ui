import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** LineDirection 类型定义。 */
export type LineDirection = 'row' | 'col';
/** LineBorderStyle 类型定义。 */
export type LineBorderStyle = 'solid' | 'dashed' | 'dotted';

/** lineProps 运行时属性及默认值。 */
export const lineProps = {
    /** 线条颜色。 */
    color: { type: String, default: 'var(--snake-color-border, #e4e7ed)' },
    /** 长度，竖向表现为高度，横向表现为长度，可为百分比或带 rpx 单位的值。 */
    length: { type: String, default: '100%' },
    /** 线条方向，row 横向，col 竖向。 */
    direction: { type: String as PropType<LineDirection>, default: 'row' },
    /** 是否显示半像素细线条。 */
    hairLine: { type: Boolean, default: true },
    /** 线条与上下左右元素的间距，字符串形式，如 "30rpx"、"20rpx 30rpx"。 */
    margin: { type: String, default: '0' },
    /** 线条类型，solid 实线，dashed 方形虚线，dotted 圆点虚线。 */
    borderStyle: { type: String as PropType<LineBorderStyle>, default: 'solid' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' }
} as const;

/** Line 组件的公开属性。 */
export type LineProps = ExtractPropTypes<typeof lineProps>;
