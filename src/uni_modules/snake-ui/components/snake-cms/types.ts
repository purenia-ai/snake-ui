import type {
    SnakeCmsComponentConfig,
    SnakeCmsDiagnostic,
    SnakeCmsOptions,
    SnakeCmsPageInfo,
    SnakeCmsStateChange
} from '../../libs/cms/types';
import type { SnakeCmsError } from '../../libs/cms/types';

export * from '../../libs/cms/types';

/** SnakeCms 组件的公开属性。 */
export interface SnakeCmsProps {
    /** CMS 页面上下文信息。 */
    pageInfo?: SnakeCmsPageInfo;
    /** CMS 页面组件配置列表。 */
    pageComponents?: SnakeCmsComponentConfig[];
    /** 页面或容器当前滚动距离。 */
    scrollTop?: number;
    /** CMS 商品区域吸顶偏移量。 */
    stickyOffsetTop?: number;
    /** 当前实例使用的 CMS 服务与兼容配置。 */
    cmsOptions?: SnakeCmsOptions;
}

/** SnakeCms 组件的事件契约。 */
export interface SnakeCmsEmits {
    /** ready 事件携带的参数。 */
    ready: [state: SnakeCmsStateChange];
    /** state-change 事件携带的参数。 */
    'state-change': [state: SnakeCmsStateChange];
    /** diagnostic 事件携带的参数。 */
    diagnostic: [diagnostic: SnakeCmsDiagnostic];
    /** error 事件携带的参数。 */
    error: [error: SnakeCmsError];
    /** goods-click 事件携带的参数。 */
    'goods-click': [payload: { item: Record<string, any>; index: number }];
    /** offer-click 事件携带的参数。 */
    'offer-click': [payload: { item: Record<string, any>; index: number }];
}

/** SnakeCms 组件实例公开的方法和状态。 */
export interface SnakeCmsExposed {
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
