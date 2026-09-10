import type { CSSProperties } from 'vue';
import type { CmsLinkService, CmsPageInfo } from '../../../../libs/cms';

export type V2Record = Record<string, any>;

export interface V2BlockProps {
    data: V2Record;
    linkService?: CmsLinkService;
    pageInfo?: CmsPageInfo;
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
