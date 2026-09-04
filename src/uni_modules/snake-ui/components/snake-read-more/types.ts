import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeStyleValue } from '../../types/global';

/** snakeReadMoreProps 运行时属性及默认值。 */
export const snakeReadMoreProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 默认的显示占位高度，数值按 rpx 处理，内容超出才显示展开按钮。 */
    showHeight: { type: [Number, String] as PropType<number | string>, default: 400 },
    /** 展开后是否显示收起按钮。 */
    toggle: { type: Boolean, default: false },
    /** 收起状态的提示文字。 */
    closeText: { type: String, default: '' },
    /** 展开状态的提示文字。 */
    openText: { type: String, default: '' },
    /** 提示文字的颜色。 */
    color: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 提示文字的大小，数值按 rpx 处理。 */
    fontSize: { type: [Number, String] as PropType<number | string>, default: 28 },
    /** 收起时覆盖在内容底部的阴影样式，对象形式。 */
    shadowStyle: {
      type: [Object, Array] as PropType<SnakeStyleValue>,
      default: () => ({
        backgroundImage: 'linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, var(--snake-color-surface, #fff) 80%)',
        paddingTop: '300rpx',
        marginTop: '-300rpx'
      })
    },
    /** 段落首行缩进的字符个数。 */
    textIndent: { type: String, default: '2em' },
    /** open 和 close 事件回调中返回的标识值。 */
    index: { type: [Number, String] as PropType<number | string>, default: '' }
} as const;

/** SnakeReadMore 组件的公开属性。 */
export type SnakeReadMoreProps = ExtractPropTypes<typeof snakeReadMoreProps>;

/** SnakeReadMore 组件的事件契约。 */
export interface SnakeReadMoreEmits {
    /** 展开时触发。 */
    open: [index: string | number];
    /** 收起时触发。 */
    close: [index: string | number];
}

/** SnakeReadMore 组件实例公开的方法。 */
export interface SnakeReadMoreExpose {
    /** 重新测量内容高度并刷新展开状态。 */
    init(): void;
}
