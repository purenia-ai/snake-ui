import type { ComputedRef, InjectionKey } from 'vue';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeSkeletonItem 的占位形态。 */
export type SnakeSkeletonItemVariant = 'text' | 'rect' | 'circle' | 'image';

/** SnakeSkeletonItem 组件的公开属性。 */
export interface SnakeSkeletonItemProps {
    /** 占位形态。 */
    variant?: SnakeSkeletonItemVariant;
    /** 占位宽度。 */
    width?: number | string;
    /** 占位高度。 */
    height?: number | string;
    /** 圆角尺寸。 */
    radius?: number | string;
    /** 是否启用流光动画；未传时继承 Skeleton 容器。 */
    animated?: boolean;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeSkeleton 向占位单元提供的上下文。 */
export interface SnakeSkeletonContext {
    /** 容器当前是否启用动画。 */
    animated: ComputedRef<boolean>;
}

/** SnakeSkeleton 上下文注入键。 */
export const SNAKE_SKELETON_CONTEXT: InjectionKey<SnakeSkeletonContext> = Symbol('snake-skeleton-context');
