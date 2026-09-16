import type { CmsComponentConfig, CmsDiagnostic, CmsOptions, CmsPageInfo, CmsStateChange } from '../../libs/cms/types';
import type { CmsError } from '../../libs/cms/types';

export * from '../../libs/cms/types';

/** Cms 组件的公开属性。 */
export interface CmsProps {
    /** CMS 页面上下文信息。 */
    pageInfo?: CmsPageInfo;
    /** CMS 页面组件配置列表。 */
    pageComponents?: CmsComponentConfig[];
    /** 页面或容器当前滚动距离。 */
    scrollTop?: number;
    /** CMS 商品区域和搜索框吸顶偏移量，按 rpx 处理。 */
    stickyOffsetTop?: number;
    /** 自定义导航栏高度，单位 px。 */
    stickyCustomNavHeight?: number;
    /** 当前实例使用的 CMS 服务与兼容配置。 */
    cmsOptions?: CmsOptions;
}

/** Cms 组件的事件契约。 */
export type CmsEmits = {
    /** ready 事件携带的参数。 */
    ready: [state: CmsStateChange];
    /** state-change 事件携带的参数。 */
    'state-change': [state: CmsStateChange];
    /** diagnostic 事件携带的参数。 */
    diagnostic: [diagnostic: CmsDiagnostic];
    /** error 事件携带的参数。 */
    error: [error: CmsError];
    /** goods-click 事件携带的参数。 */
    'goods-click': [payload: { item: Record<string, any>; index: number }];
    /** offer-click 事件携带的参数。 */
    'offer-click': [payload: { item: Record<string, any>; index: number }];
};

/** Cms 组件实例公开的方法和状态。 */
export interface CmsExposed {
    /** init 方法。 */
    init(): Promise<void>;
    /** loadMore 方法。 */
    loadMore(): Promise<void>;
    /** retry 方法。 */
    retry(): Promise<void>;
    /** refreshQuotePay 方法。 */
    refreshQuotePay(price: unknown, index: number): void;
    /** auctionSetParams 方法。 */
    readonly auctionSetParams: Readonly<Record<string, any>>;
}
