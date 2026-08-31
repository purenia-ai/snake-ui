import type { SnakeCmsComponentConfig, SnakeCmsDiagnostic, SnakeCmsOptions, SnakeCmsPageInfo, SnakeCmsStatus } from '../../libs/cms/types';
import type { SnakeCmsError } from '../../libs/cms/types';

export * from '../../libs/cms/types';

export interface SnakeCmsProps {
    pageInfo?: SnakeCmsPageInfo;
    pageComponents?: SnakeCmsComponentConfig[];
    scrollTop?: number;
    stickyOffsetTop?: number;
    cmsOptions?: SnakeCmsOptions;
}

export interface SnakeCmsStateChange {
    status: SnakeCmsStatus;
    page: number;
    itemCount: number;
}

export interface SnakeCmsEmits {
    ready: [state: SnakeCmsStateChange];
    'state-change': [state: SnakeCmsStateChange];
    diagnostic: [diagnostic: SnakeCmsDiagnostic];
    error: [error: SnakeCmsError];
    'goods-click': [payload: { item: Record<string, any>; index: number }];
    'offer-click': [payload: { item: Record<string, any>; index: number }];
}

export interface SnakeCmsExposed {
    init(): Promise<void>;
    loadMore(): Promise<void>;
    retry(): Promise<void>;
    refreshQuotePay(price: unknown, index: number): void;
    readonly auctionSetParams: Readonly<Record<string, any>>;
}
