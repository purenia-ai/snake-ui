import type { CmsBuiltinComponent } from './blocks';

export type {
    CmsBlockCategory,
    CmsBlockDefinition,
    CmsBuiltinComponent,
    CmsV1BuiltinComponent,
    CmsV2BuiltinComponent
} from './blocks';

export interface CmsPageInfo {
    id?: string | number;
    pageId?: string | number;
    name?: string;
    activityId?: string | number;
    [key: string]: unknown;
}

export interface CmsComponentConfig<Style extends Record<string, any> = Record<string, any>> {
    id?: string | number;
    component: string;
    setStyle?: Style;
    props?: Record<string, any>;
    active?: boolean;
    visible?: boolean;
    [key: string]: unknown;
}

export interface CmsNormalizedComponent<Style extends Record<string, any> = Record<string, any>> extends Omit<
    CmsComponentConfig<Style>,
    'id' | 'setStyle'
> {
    id: string;
    version: 1 | 2;
    originalComponent: string;
    setStyle: Style;
    props: Record<string, any>;
    builtin: boolean;
}

export type CmsDiagnosticCode =
    'invalid-component' | 'unknown-component' | 'normalizer-error' | 'duplicate-commerce-section';

export interface CmsDiagnostic {
    code: CmsDiagnosticCode;
    level: 'warn' | 'error';
    message: string;
    index?: number;
    component?: string;
    cause?: unknown;
}

export type CmsStatus = 'idle' | 'initial-loading' | 'ready' | 'empty' | 'loading-more' | 'no-more' | 'error';

/** CmsStateChange 类型定义。 */
export interface CmsStateChange {
    /** 当前状态。 */
    status: CmsStatus;
    /** page 配置。 */
    page: number;
    /** item count 配置。 */
    itemCount: number;
}

export interface CmsServiceContext {
    pageInfo: Readonly<CmsPageInfo>;
    component: Readonly<CmsNormalizedComponent>;
    generation: number;
}

export interface CmsActivityResult<Item = Record<string, any>> {
    items: Item[];
}

export interface CmsGoodsResult<Item = Record<string, any>> {
    items: Item[];
    total?: number;
    hasMore?: boolean;
}

export interface CmsCommerceService<
    Activity = Record<string, any>,
    Filters = Record<string, any>,
    Goods = Record<string, any>
> {
    getActivities?(
        context: CmsServiceContext & { params: Record<string, unknown> }
    ): Promise<CmsActivityResult<Activity>>;
    getFilters?(context: CmsServiceContext & { params: Record<string, unknown> }): Promise<Filters>;
    getGoods(context: CmsServiceContext & { params: Record<string, unknown> }): Promise<CmsGoodsResult<Goods>>;
    navigateGoods?(context: CmsServiceContext & { item: Goods; index: number }): void | Promise<void>;
}

export interface CmsCouponService {
    check(context: {
        config: Record<string, any>;
        pageInfo?: CmsPageInfo;
    }): Promise<{ claimable: boolean; message?: string }>;
    receive(context: {
        config: Record<string, any>;
        pageInfo?: CmsPageInfo;
    }): Promise<{ success: boolean; message?: string }>;
}

export interface CmsLinkAction {
    type: 'navigate' | 'mini-program' | 'external' | 'scheme';
    url?: string;
    appId?: string;
    path?: string;
    extraData?: Record<string, unknown>;
    envVersion?: 'develop' | 'trial' | 'release';
    [key: string]: unknown;
}

export interface CmsLinkService {
    open(
        action: CmsLinkAction,
        context?: { component?: CmsNormalizedComponent; pageInfo?: CmsPageInfo }
    ): void | Promise<void>;
    createScheme?(action: CmsLinkAction): Promise<string>;
}

export interface CmsServices {
    commerce?: CmsCommerceService;
    coupon?: CmsCouponService;
    link?: CmsLinkService;
}

export interface CmsAssets {
    backToTop?: string;
    activityAll?: string;
    goodsLoading?: string;
    goodsError?: string;
    goodsSoldOut?: string;
    goodsInspection?: string;
    goodsNewcomer?: string;
    goodsPopular?: string;
}

export type CmsNormalizer = (
    component: CmsComponentConfig,
    context: { index: number; pageInfo: Readonly<CmsPageInfo> }
) => CmsComponentConfig | null | undefined;

export interface CmsOptions {
    aliases?: Record<string, CmsBuiltinComponent>;
    normalizers?: Record<string, CmsNormalizer>;
    services?: CmsServices;
    assets?: CmsAssets;
    cachePrefix?: string;
    onDiagnostic?: (diagnostic: CmsDiagnostic) => void;
}

export class CmsError extends Error {
    readonly stage: 'normalize' | 'activities' | 'filters' | 'goods' | 'coupon' | 'link';
    readonly cause?: unknown;

    constructor(stage: CmsError['stage'], message: string, cause?: unknown) {
        super(message, cause === undefined ? undefined : { cause });
        this.name = 'CmsError';
        this.stage = stage;
        this.cause = cause;
    }
}
