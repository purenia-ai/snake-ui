import type { CSSProperties } from 'vue';
import type { CmsLinkService, CmsPageInfo } from '../../../../libs/cms';

export type V2Record = Record<string, any>;

export interface V2BlockProps {
    data: V2Record;
    linkService?: CmsLinkService;
    pageInfo?: CmsPageInfo;
}

export function carouselIndicatorType(data: V2Record): 'none' | 'bullets' | 'fraction' | 'progressbar' {
    const type = data.indicator?.type;
    return type === 'none' || type === 'fraction' || type === 'progressbar' ? type : 'bullets';
}

export function carouselProgress(current: number, count: number): number {
    if (count <= 0) return 0;
    return ((Math.min(Math.max(current, 0), count - 1) + 1) * 100) / count;
}

export function searchStickyEnabled(data: V2Record): boolean {
    return Number(data.style?.position) === 1;
}

export function v2CouponLegacyData(data: V2Record): V2Record {
    return {
        modeType: data.mode || 'page',
        popupMode: data.popupMode || 'bottom',
        coupon: data.coupon,
        couponObj: data.coupon,
        beforeImage: data.before?.image || '',
        beforeUrl: data.before?.link?.http || '',
        afterImage: data.after?.image || '',
        afterUrl: data.after?.link?.http || '',
        type: String(data.after?.link?.httpType || 10)
    };
}

export function rpx(value: unknown, fallback = 0): string {
    const number = Number(value);
    return `${Number.isFinite(number) ? number : fallback}rpx`;
}

export function blockStyle(style: V2Record = {}): CSSProperties {
    return {
        boxSizing: 'border-box',
        minHeight: style.heightMode === 'fixed' ? rpx(style.height) : undefined,
        marginLeft: rpx(style.pageMargin),
        marginRight: rpx(style.pageMargin),
        borderRadius: rpx(style.imageRadius ?? style.radius),
        backgroundColor: style.backgroundColor || undefined,
        overflow: 'hidden'
    };
}

export async function openV2Link(
    link: V2Record | undefined,
    service?: CmsLinkService,
    pageInfo?: CmsPageInfo
): Promise<void> {
    const url = typeof link?.http === 'string' ? link.http.trim() : '';
    if (!url || !service) return;
    await service.open({ type: Number(link?.httpType) === 11 ? 'external' : 'navigate', url }, { pageInfo });
}
