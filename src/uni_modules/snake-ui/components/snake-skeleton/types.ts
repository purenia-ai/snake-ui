import type { StyleValue } from '../../types/global';

/** Skeleton 支持的尺寸值。 */
export type SkeletonSize = number | string;

/**
 * 骨架占位动画类型。
 *
 * - `shimmer`：流光扫过（默认），用 `background-position` 位移实现；
 * - `pulse`：呼吸闪烁，只动 `opacity`，小程序端更省（不逐帧重绘背景）；
 * - `none`：静态占位。
 */
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

/** Skeleton 组件的公开属性。 */
export interface SkeletonProps {
    /** 是否显示骨架内容。 */
    loading?: boolean;
    /**
     * 是否启用流光动画。
     * @deprecated 0.1.0 起改用 `animation`（可选 `shimmer` / `pulse` / `none`）；
     * `animated=false` 等价 `animation="none"`，`animation` 优先级更高。
     */
    animated?: boolean;
    /** 占位动画类型，优先级高于 `animated`；不传时按 `animated` 推导（默认 `shimmer`）。 */
    animation?: SkeletonAnimation;
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
    /** 无障碍文案：加载中时写在根节点的 `aria-label` 上，供读屏朗读。 */
    label?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
