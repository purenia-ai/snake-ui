import type { SnakeCmsCouponService, SnakeCmsError, SnakeCmsLinkService, SnakeCmsPageInfo } from '../snake-cms/types';

/** SnakeCoupon 组件的公开属性。 */
export interface SnakeCouponProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
    /** coupon service 配置。 */
    couponService?: SnakeCmsCouponService;
    /** link service 配置。 */
    linkService?: SnakeCmsLinkService;
    /** CMS 页面上下文信息。 */
    pageInfo?: SnakeCmsPageInfo;
}

/** SnakeCoupon 组件的事件契约。 */
export interface SnakeCouponEmits {
    /** error 事件携带的参数。 */
    error: [error: SnakeCmsError];
    /** received 事件携带的参数。 */
    received: [];
}
