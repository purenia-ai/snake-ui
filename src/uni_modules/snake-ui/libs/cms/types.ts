export type SnakeCmsBuiltinComponent =
    | 'commoditysearch'
    | 'auxiliarysegmentation'
    | 'richtext'
    | 'graphicnavigation'
    | 'images'
    | 'hotzone'
    | 'pictureads'
    | 'magiccube'
    | 'videos'
    | 'notice'
    | 'jumpApplet'
    | 'follow'
    | 'suspension'
    | 'coupon'
    | 'pagePopup'
    | 'goodslist'
    | 'custommodule';

export interface SnakeCmsPageInfo {
    id?: string | number;
    pageId?: string | number;
    name?: string;
    activityId?: string | number;
    [key: string]: unknown;
}

export interface SnakeCmsComponentConfig<Style extends Record<string, any> = Record<string, any>> {
    id?: string | number;
    component: string;
    setStyle?: Style;
    visible?: boolean;
    [key: string]: unknown;
}

export interface SnakeCmsNormalizedComponent<Style extends Record<string, any> = Record<string, any>> extends Omit<
    SnakeCmsComponentConfig<Style>,
    'id' | 'setStyle'
> {
    id: string;
    originalComponent: string;
    setStyle: Style;
    builtin: boolean;
}

export type SnakeCmsDiagnosticCode =
    'invalid-component' | 'unknown-component' | 'normalizer-error' | 'duplicate-commerce-section' | 'legacy-adapter';

export interface SnakeCmsDiagnostic {
    code: SnakeCmsDiagnosticCode;
    level: 'warn' | 'error';
    message: string;
    index?: number;
    component?: string;
    cause?: unknown;
}

export type SnakeCmsStatus = 'idle' | 'initial-loading' | 'ready' | 'empty' | 'loading-more' | 'no-more' | 'error';

/** SnakeCmsStateChange 类型定义。 */
export interface SnakeCmsStateChange {
    /** 当前状态。 */
    status: SnakeCmsStatus;
    /** page 配置。 */
    page: number;
    /** item count 配置。 */
    itemCount: number;
}

export interface SnakeCmsServiceContext {
    pageInfo: Readonly<SnakeCmsPageInfo>;
    component: Readonly<SnakeCmsNormalizedComponent>;
    generation: number;
}

export interface SnakeCmsActivityResult<Item = Record<string, any>> {
    items: Item[];
}

export interface SnakeCmsGoodsResult<Item = Record<string, any>> {
    items: Item[];
    total?: number;
    hasMore?: boolean;
}

export interface SnakeCmsCommerceService<
    Activity = Record<string, any>,
    Filters = Record<string, any>,
    Goods = Record<string, any>
> {
    getActivities?(
        context: SnakeCmsServiceContext & { params: Record<string, unknown> }
    ): Promise<SnakeCmsActivityResult<Activity>>;
    getFilters?(context: SnakeCmsServiceContext & { params: Record<string, unknown> }): Promise<Filters>;
    getGoods(
        context: SnakeCmsServiceContext & { params: Record<string, unknown> }
    ): Promise<SnakeCmsGoodsResult<Goods>>;
    navigateGoods?(context: SnakeCmsServiceContext & { item: Goods; index: number }): void | Promise<void>;
}

export interface SnakeCmsCouponService {
    check(context: {
        config: Record<string, any>;
        pageInfo?: SnakeCmsPageInfo;
    }): Promise<{ claimable: boolean; message?: string }>;
    receive(context: {
        config: Record<string, any>;
        pageInfo?: SnakeCmsPageInfo;
    }): Promise<{ success: boolean; message?: string }>;
}

export interface SnakeCmsLinkAction {
    type: 'navigate' | 'mini-program' | 'external' | 'scheme';
    url?: string;
    appId?: string;
    path?: string;
    extraData?: Record<string, unknown>;
    envVersion?: 'develop' | 'trial' | 'release';
    [key: string]: unknown;
}

export interface SnakeCmsLinkService {
    open(
        action: SnakeCmsLinkAction,
        context?: { component?: SnakeCmsNormalizedComponent; pageInfo?: SnakeCmsPageInfo }
    ): void | Promise<void>;
    createScheme?(action: SnakeCmsLinkAction): Promise<string>;
}

export interface SnakeCmsServices {
    commerce?: SnakeCmsCommerceService;
    coupon?: SnakeCmsCouponService;
    link?: SnakeCmsLinkService;
}

export interface SnakeCmsAssets {
    backToTop?: string;
    activityAll?: string;
    goodsLoading?: string;
    goodsError?: string;
    goodsSoldOut?: string;
    goodsInspection?: string;
    goodsNewcomer?: string;
    goodsPopular?: string;
}

export type SnakeCmsNormalizer = (
    component: SnakeCmsComponentConfig,
    context: { index: number; pageInfo: Readonly<SnakeCmsPageInfo> }
) => SnakeCmsComponentConfig | null | undefined;

export interface SnakeCmsOptions {
    aliases?: Record<string, SnakeCmsBuiltinComponent>;
    normalizers?: Record<string, SnakeCmsNormalizer>;
    services?: SnakeCmsServices;
    assets?: SnakeCmsAssets;
    cachePrefix?: string;
    legacy?: boolean | 'auto';
    onDiagnostic?: (diagnostic: SnakeCmsDiagnostic) => void;
}

export class SnakeCmsError extends Error {
    readonly stage: 'normalize' | 'activities' | 'filters' | 'goods' | 'coupon' | 'link';
    readonly cause?: unknown;

    constructor(stage: SnakeCmsError['stage'], message: string, cause?: unknown) {
        super(message, cause === undefined ? undefined : { cause });
        this.name = 'SnakeCmsError';
        this.stage = stage;
        this.cause = cause;
    }
}
