import type { CmsCouponService, CmsError, CmsLinkService, CmsPageInfo } from '../snake-cms/types';

/** Coupon 组件的公开属性。 */
export interface CouponProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
    /** coupon service 配置。 */
    couponService?: CmsCouponService;
    /** link service 配置。 */
    linkService?: CmsLinkService;
    /** CMS 页面上下文信息。 */
    pageInfo?: CmsPageInfo;
}

/** Coupon 组件的事件契约。 */
export type CouponEmits = {
    /** error 事件携带的参数。 */
    error: [error: CmsError];
    /** received 事件携带的参数。 */
    received: [];
};
