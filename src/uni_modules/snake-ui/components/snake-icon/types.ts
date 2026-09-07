import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeImageMode, SnakeStyleValue } from '../../types/global';

/** 标签相对图标的显示方向。 */
export type SnakeIconLabelPosition = 'left' | 'right' | 'top' | 'bottom';

/** SnakeIcon 运行时属性。 */
export const SnakeIconProps = {
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: () => ({}) },
    customClass: { type: String, default: '' },
    name: { type: String, default: '' },
    color: { type: String, default: '' },
    size: { type: [Number, String] as PropType<string | number>, default: 'inherit' },
    bold: { type: Boolean, default: false },
    index: { type: [Number, String] as PropType<string | number>, default: '' },
    hoverClass: { type: String, default: '' },
    customPrefix: { type: String, default: 'sicon' },
    label: { type: [String, Number] as PropType<string | number>, default: '' },
    labelPos: { type: String as PropType<SnakeIconLabelPosition>, default: 'right' },
    labelSize: { type: [String, Number] as PropType<string | number>, default: '28' },
    labelColor: { type: String, default: 'var(--snake-color-text-secondary, #606266)' },
    marginLeft: { type: [String, Number] as PropType<string | number>, default: '6' },
    marginTop: { type: [String, Number] as PropType<string | number>, default: '6' },
    marginRight: { type: [String, Number] as PropType<string | number>, default: '6' },
    marginBottom: { type: [String, Number] as PropType<string | number>, default: '6' },
    space: { type: [String, Number] as PropType<string | number>, default: '' },
    imgMode: { type: String as PropType<SnakeImageMode>, default: 'widthFix' },
    width: { type: [String, Number] as PropType<string | number>, default: '' },
    height: { type: [String, Number] as PropType<string | number>, default: '' },
    top: { type: [String, Number] as PropType<string | number>, default: 0 },
    showDecimalIcon: { type: Boolean, default: false },
    inactiveColor: { type: String, default: 'var(--snake-color-divider, #e4e7ed)' },
    percent: { type: [Number, String] as PropType<string | number>, default: '50' }
};

/** SnakeIcon 组件的公开属性类型。 */
export type SnakeIconProps = ExtractPropTypes<typeof SnakeIconProps>;

/** SnakeIcon 组件的公开事件。 */
export interface SnakeIconEmits {
    /** 点击图标时返回 index，未设置时返回原始事件。 */
    (event: 'click', index: string | number | unknown): void;
    /** 触摸图标时返回 index，未设置时返回原始事件。 */
    (event: 'touchstart', index: string | number | unknown): void;
}
