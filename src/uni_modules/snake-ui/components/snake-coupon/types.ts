import type { SnakeCmsCouponService, SnakeCmsError, SnakeCmsLinkService, SnakeCmsPageInfo } from '../snake-cms/types';

export interface SnakeCouponProps<Data extends Record<string, any> = Record<string, any>> {
    datas?: Data;
    couponService?: SnakeCmsCouponService;
    linkService?: SnakeCmsLinkService;
    pageInfo?: SnakeCmsPageInfo;
}

export interface SnakeCouponEmits {
    error: [error: SnakeCmsError];
    received: [];
}
