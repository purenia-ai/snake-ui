import { ref, type Ref } from 'vue';
import type { IndexAnchorRect, IndexValue } from './types';

/** 自测回报的兜底等待时长；超时后按已回报数据聚合，避免死等。 */
const COLLECT_TIMEOUT = 200;

/**
 * 锚点登记与自测回报的共享实现。
 *
 * 微信小程序的选择器查询不能跨自定义组件边界：锚点节点位于
 * `snake-index-anchor` 自身模板内、又经由插槽渲染，列表侧
 * `createSelectorQuery().in(list)` 永远查不到。因此改为锚点在自身
 * 作用域内测量并回报，列表 / 面板在 collect() 中聚合。
 */
export function createAnchorRegistry() {
    /** 自测轮次号：锚点监听到变化后重新测量。 */
    const measureToken = ref(0);
    /** 各锚点最近一次回报的几何信息（非响应式，聚合时机由 collect 控制）。 */
    const rects = new Map<IndexValue, IndexAnchorRect>();
    /** 已挂载锚点集合，collect 按其数量等待回报。 */
    const registered = new Set<IndexValue>();
    let waiter: { expected: number; received: Set<IndexValue>; done: boolean; resolve: () => void } | null = null;
    let waiterTimer: ReturnType<typeof setTimeout> | undefined;

    function registerAnchor(value: IndexValue) {
        registered.add(value);
    }

    /** 判断指定索引是否已有挂载锚点登记（供容器在开发期校验 indexList 配置）。 */
    function hasAnchor(value: IndexValue) {
        return registered.has(value);
    }

    function unregisterAnchor(value: IndexValue) {
        registered.delete(value);
        rects.delete(value);
    }

    function reportAnchor(value: IndexValue, rect: IndexAnchorRect) {
        rects.set(value, rect);
        if (waiter && !waiter.done && registered.has(value) && !waiter.received.has(value)) {
            waiter.received.add(value);
            if (waiter.received.size >= waiter.expected) settle();
        }
    }

    function settle() {
        if (!waiter || waiter.done) return;
        waiter.done = true;
        if (waiterTimer) clearTimeout(waiterTimer);
        const resolve = waiter.resolve;
        waiter = null;
        resolve();
    }

    /**
     * 触发一轮锚点自测并等待全部已登记锚点回报。
     * 无锚点或超时（200ms）时立即返回，调用方按现有数据聚合。
     */
    function collect(): Promise<void> {
        if (waiter) settle();
        const expected = registered.size;
        if (!expected) return Promise.resolve();
        measureToken.value += 1;
        return new Promise(resolve => {
            waiter = { expected, received: new Set(), done: false, resolve };
            waiterTimer = setTimeout(settle, COLLECT_TIMEOUT);
        });
    }

    return {
        measureToken,
        rects,
        registerAnchor,
        hasAnchor,
        unregisterAnchor,
        reportAnchor,
        collect
    };
}

/**
 * 监听窗口尺寸变化（旋转屏、分屏、桌面端拖拽），防抖后触发重测。
 * 使用跨端的 uni.onWindowResize，返回解除监听函数供容器卸载时清理。
 */
export function watchViewportResize(callback: () => void): () => void {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handler = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(callback, 200);
    };
    uni.onWindowResize?.(handler as never);
    return () => {
        if (timer) clearTimeout(timer);
        uni.offWindowResize?.(handler as never);
    };
}

/** createAnchorRegistry 返回的锚点登记器。 */
export interface AnchorRegistry extends ReturnType<typeof createAnchorRegistry> {
    /** 自测轮次号（响应式，供锚点监听）。 */
    measureToken: Ref<number>;
}
