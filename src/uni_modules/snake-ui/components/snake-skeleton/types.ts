import type { StyleValue } from '../../types/global';

/** Skeleton 支持的尺寸值。 */
export type SkeletonSize = number | string;

/** Skeleton 组件的公开属性。 */
export interface SkeletonProps {
    /** 是否显示骨架内容。 */
    loading?: boolean;
    /** 是否启用流光动画。 */
    animated?: boolean;
    /** 是否显示默认标题占位。 */
    title?: boolean;
    /** 默认标题宽度。 */
    titleWidth?: SkeletonSize;
    /** 默认标题高度。 */
    titleHeight?: SkeletonSize;
    /** 默认段落行数。 */
    rows?: number;
    /** 默认段落宽度；数组可逐行配置。 */
    rowsWidth?: SkeletonSize | SkeletonSize[];
    /** 默认段落高度；数组可逐行配置。 */
    rowsHeight?: SkeletonSize | SkeletonSize[];
    /** 是否显示默认头像占位。 */
    avatar?: boolean;
    /** 默认头像尺寸。 */
    avatarSize?: SkeletonSize;
    /** 默认头像形状。 */
    avatarShape?: 'circle' | 'square';
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
