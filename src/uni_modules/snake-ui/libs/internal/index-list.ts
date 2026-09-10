import type { CSSProperties, InjectionKey, Ref } from 'vue';

export type IndexValue = string | number;

export interface IndexListContext {
    activeIndex: Ref<number>;
    sticky: Ref<boolean>;
    offsetTop: Ref<string | number | null | undefined>;
    zIndex: Ref<number>;
    anchorId(index: IndexValue): string;
    anchorStyle(index: IndexValue): CSSProperties;
    wrapperStyle(index: IndexValue): CSSProperties;
    isActive(index: IndexValue): boolean;
}

export const indexListKey: InjectionKey<IndexListContext> = Symbol('snake-index-list');

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

export function indexFromTouch(clientY: number, railTop: number, railHeight: number, length: number): number {
    if (!Number.isFinite(clientY) || railHeight <= 0 || length <= 0) return -1;
    return Math.max(0, Math.min(length - 1, Math.floor(((clientY - railTop) / railHeight) * length)));
}

export function offsetTopPx(value: string | number | null | undefined): number {
    const number = Number.parseFloat(String(value ?? 0));
    if (!Number.isFinite(number)) return 0;
    if (typeof value === 'string' && value.trim().endsWith('px')) return number;
    return typeof uni !== 'undefined' && typeof uni.upx2px === 'function' ? uni.upx2px(number) : number;
}
