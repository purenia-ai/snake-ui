import type { SnakeStyleValue } from '../../types/global';

/** SnakeSkeleton 支持的尺寸值。 */
export type SnakeSkeletonSize = number | string;

/** SnakeSkeleton 组件的公开属性。 */
export interface SnakeSkeletonProps {
    /** 是否显示骨架内容。 */
    loading?: boolean;
    /** 是否启用流光动画。 */
    animated?: boolean;
    /** 是否显示默认标题占位。 */
    title?: boolean;
    /** 默认标题宽度。 */
    titleWidth?: SnakeSkeletonSize;
    /** 默认标题高度。 */
    titleHeight?: SnakeSkeletonSize;
    /** 默认段落行数。 */
    rows?: number;
    /** 默认段落宽度；数组可逐行配置。 */
    rowsWidth?: SnakeSkeletonSize | SnakeSkeletonSize[];
    /** 默认段落高度；数组可逐行配置。 */
    rowsHeight?: SnakeSkeletonSize | SnakeSkeletonSize[];
    /** 是否显示默认头像占位。 */
    avatar?: boolean;
    /** 默认头像尺寸。 */
    avatarSize?: SnakeSkeletonSize;
    /** 默认头像形状。 */
    avatarShape?: 'circle' | 'square';
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
