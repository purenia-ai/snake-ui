import type { ComputedRef, InjectionKey } from 'vue';
import type { StyleValue } from '../../types/global';
import type { SkeletonAnimation } from '../snake-skeleton/types';

/** SkeletonItem 的占位形态。 */
export type SkeletonItemVariant = 'text' | 'rect' | 'circle' | 'image';

/** SkeletonItem 组件的公开属性。 */
export interface SkeletonItemProps {
    /** 占位形态。 */
    variant?: SkeletonItemVariant;
    /** 宽高同时取值（正方形）；`width` / `height` 显式传入时以各自为准。 */
    size?: number | string;
    /** 占位宽度；不传时按形态取 CSS 默认值（可被主题变量覆盖）。 */
    width?: number | string;
    /** 占位高度；不传时按形态取 CSS 默认值（可被主题变量覆盖）。 */
    height?: number | string;
    /** 圆角尺寸；不传时按形态取 CSS 默认值（可被主题变量覆盖）。 */
    radius?: number | string;
    /**
     * 是否启用流光动画。
     * @deprecated 0.1.0 起改用 `animation`；`animated=false` 等价 `animation="none"`。
     */
    animated?: boolean;
    /** 占位动画类型；未传时继承 Skeleton 容器。 */
    animation?: SkeletonAnimation;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** Skeleton 向占位单元提供的上下文。 */
export interface SkeletonContext {
    /** 容器当前的动画类型（已折算 `animation` 与 `animated`）。 */
    animation: ComputedRef<SkeletonAnimation>;
}

/** Skeleton 上下文注入键。 */
export const SNAKE_SKELETON_CONTEXT: InjectionKey<SkeletonContext> = Symbol('snake-skeleton-context');
