import type { CSSProperties, InjectionKey, Ref } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
/** IndexValue 类型定义。 */
export type IndexValue = string | number;

/** 锚点自测的几何信息（视口坐标系）。 */
export interface IndexAnchorRect {
    /** 视口顶部到锚点顶部的距离，单位 px。 */
    top: number;
    /** 锚点高度，单位 px。 */
    height: number;
}
/** IndexList 组件的公开属性。 */
export interface IndexListProps {
    /** index list 配置。 */
    indexList?: IndexValue[];
    /** 页面当前滚动距离，由页面的 onPageScroll 事件传入。 */
    scrollTop?: number | string;
    /** 组件层级。 */
    zIndex?: number;
    /** sticky 配置。 */
    sticky?: boolean;
    /** 吸顶或定位的顶部偏移量。 */
    offsetTop?: UnitValue;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** rail style 配置。 */
    railStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** IndexListChange 事件详情。 */
export interface IndexListChangeDetail {
    /** 当前数据项索引。 */
    index: number;
    /** 当前值。 */
    value: IndexValue;
}
/** IndexList 组件的事件契约。 */
export type IndexListEmits = {
    /** select 事件携带的参数。 */
    select: [value: IndexValue];
    /** change 事件携带的参数。 */
    change: [detail: IndexListChangeDetail];
};
/** IndexList 组件实例公开的方法和状态。 */
export interface IndexListExpose {
    /** scrollTo 方法。 */
    scrollTo(index: number | IndexValue): void;
    /** update 方法。 */
    update(): Promise<void>;
}

/** IndexList 向 Anchor / Panel 注入的配对上下文。 */
export interface IndexListContext {
    /** 当前激活项下标。 */
    activeIndex: Ref<number>;
    /** 锚点是否吸顶。 */
    sticky: Ref<boolean>;
    /** 吸顶或定位的顶部偏移量。 */
    offsetTop: Ref<string | number | null | undefined>;
    /** 组件层级。 */
    zIndex: Ref<number>;
    /** 生成锚点节点 id。 */
    anchorId(index: IndexValue): string;
    /** 生成锚点样式。 */
    anchorStyle(index: IndexValue): CSSProperties;
    /** 生成分组容器样式。 */
    wrapperStyle(index: IndexValue): CSSProperties;
    /** 判断指定项是否激活。 */
    isActive(index: IndexValue): boolean;
    /** 自测轮次号：变化时锚点需重新测量并回报。 */
    measureToken: Ref<number>;
    /** 登记已挂载的锚点。 */
    registerAnchor(value: IndexValue): void;
    /** 注销锚点。 */
    unregisterAnchor(value: IndexValue): void;
    /** 锚点回报自身几何信息。 */
    reportAnchor(value: IndexValue, rect: IndexAnchorRect): void;
}

/** IndexList ↔ Anchor / Panel 配对注入键。 */
export const indexListKey: InjectionKey<IndexListContext> = Symbol('snake-index-list');

/** 索引或取值解析为下标：合法整数下标原样返回，否则按值查找。 */
export function resolveIndex(indexOrValue: number | IndexValue, indexList: IndexValue[]): number {
    if (
        typeof indexOrValue === 'number' &&
        Number.isInteger(indexOrValue) &&
        indexOrValue >= 0 &&
        indexOrValue < indexList.length
    ) {
        return indexOrValue;
    }
    return indexList.indexOf(indexOrValue);
}

/** 由触摸纵坐标换算最近的数据项下标，越界自动收敛。 */
export function indexFromTouch(clientY: number, railTop: number, railHeight: number, length: number): number {
    if (!Number.isFinite(clientY) || railHeight <= 0 || length <= 0) return -1;
    return Math.max(0, Math.min(length - 1, Math.floor(((clientY - railTop) / railHeight) * length)));
}

/** offsetTop 值转 px 数值：rpx / 裸数字按 rpx 换算。 */
export function offsetTopPx(value: string | number | null | undefined): number {
    const number = Number.parseFloat(String(value ?? 0));
    if (!Number.isFinite(number)) return 0;
    if (typeof value === 'string' && value.trim().endsWith('px')) return number;
    return typeof uni !== 'undefined' && typeof uni.upx2px === 'function' ? uni.upx2px(number) : number;
}
