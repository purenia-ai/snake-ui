import { reactive } from 'vue';

/** 触摸点坐标。 */
interface TouchPoint {
    clientX?: number;
    clientY?: number;
    pageX?: number;
    pageY?: number;
}

/** 触摸事件的归一化形态：小程序与 H5 的触点字段位置不同，逐级兜底。 */
interface TouchEventLike {
    touches?: TouchPoint[];
    changedTouches?: TouchPoint[];
}

/** 一次手势的累计状态。 */
export interface TouchState {
    /** 起点 X 坐标。 */ startX: number;
    /** 起点 Y 坐标。 */ startY: number;
    /** 相对起点的 X 位移。 */ deltaX: number;
    /** 相对起点的 Y 位移。 */ deltaY: number;
    /** 相对起点的 X 偏移。 */ offsetX: number;
    /** 相对起点的 Y 偏移。 */ offsetY: number;
    /** 已判定的手势方向，空串表示尚未判定。 */ direction: 'horizontal' | 'vertical' | '';
    /** 是否处于触摸中。 */ touching: boolean;
}

function readPoint(event: unknown): TouchPoint | null {
    const source = event as TouchEventLike | null;
    if (!source) return null;
    const point = source.changedTouches?.[0] ?? source.touches?.[0];
    if (!point) return null;
    const x = point.clientX ?? point.pageX;
    const y = point.clientY ?? point.pageY;
    if (typeof x !== 'number' || typeof y !== 'number') return null;
    return { clientX: x, clientY: y };
}

/**
 * 手势基础 hook：记录位移并做方向锁定。
 * 横向位移超过 `lockDistance` 且大于纵向位移才判定为横向，
 * 判定为纵向后不再响应，把滚动手势交还给页面。
 */
export function useTouch(lockDistance = 5) {
    const state = reactive<TouchState>({
        startX: 0,
        startY: 0,
        deltaX: 0,
        deltaY: 0,
        offsetX: 0,
        offsetY: 0,
        direction: '',
        touching: false
    });

    function reset() {
        state.startX = 0;
        state.startY = 0;
        state.deltaX = 0;
        state.deltaY = 0;
        state.offsetX = 0;
        state.offsetY = 0;
        state.direction = '';
        state.touching = false;
    }

    function onTouchStart(event: unknown) {
        const point = readPoint(event);
        if (!point) return;
        state.touching = true;
        state.direction = '';
        state.startX = point.clientX as number;
        state.startY = point.clientY as number;
        state.deltaX = 0;
        state.deltaY = 0;
        state.offsetX = 0;
        state.offsetY = 0;
    }

    function onTouchMove(event: unknown) {
        if (!state.touching) return;
        const point = readPoint(event);
        if (!point) return;
        state.deltaX = (point.clientX as number) - state.startX;
        state.deltaY = (point.clientY as number) - state.startY;
        state.offsetX = state.deltaX;
        state.offsetY = state.deltaY;
        if (state.direction) return;
        const horizontal = Math.abs(state.deltaX);
        const vertical = Math.abs(state.deltaY);
        if (horizontal < lockDistance && vertical < lockDistance) return;
        state.direction = horizontal >= vertical ? 'horizontal' : 'vertical';
    }

    function onTouchEnd() {
        state.touching = false;
    }

    return { state, reset, onTouchStart, onTouchMove, onTouchEnd };
}
