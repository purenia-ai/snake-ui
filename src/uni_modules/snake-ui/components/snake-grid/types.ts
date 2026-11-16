import type { ComponentPublicInstance, InjectionKey, Ref } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 宫格间距，裸数字按 375 设计稿 px 处理。 */
export type GridGutter = number | string;

/** snake-grid 运行时属性。 */
export const gridProps = {
    /** 每行列数。 */ column: { type: Number, default: 4 },
    /** 是否显示格线。 */ border: { type: Boolean, default: false },
    /** 格子间距。 */ gutter: { type: [Number, String] as PropType<GridGutter>, default: 0 },
    /** 是否等宽等高。 */ square: { type: Boolean, default: false },
    /** 子项是否有点击态。 */ clickable: { type: Boolean, default: false },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-grid 解析后的属性。 */
export type GridResolvedProps = ExtractPropTypes<typeof gridProps>;

/** snake-grid 对外属性。 */
export interface GridProps {
    /** 每行列数。 */ column?: number;
    /** 是否显示格线。 */ border?: boolean;
    /** 格子间距。 */ gutter?: GridGutter;
    /** 是否等宽等高。 */ square?: boolean;
    /** 子项是否有点击态。 */ clickable?: boolean;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}

/** 宫格向下提供的上下文。 */
export interface GridContext {
    /** 每行列数。 */ column: Ref<number>;
    /** 是否显示格线。 */ border: Ref<boolean>;
    /** 格子间距。 */ gutter: Ref<GridGutter>;
    /** 是否等宽等高。 */ square: Ref<boolean>;
    /** 子项是否有点击态。 */ clickable: Ref<boolean>;
}

/** 宫格上下文注入键。 */
export const gridContextKey: InjectionKey<GridContext> = Symbol('snakeGrid');

/** 宫格子项在父级上下文中的公开形态。 */
export type GridChild = ComponentPublicInstance;
