import type { SnakeUIOptions } from '../runtime';
import { getSnakeUIOptions, SnakeUIRuntimeError } from '../runtime';
import { getQueryParams, navTo } from '../function/platform';
import type {
    SnakeCmsCommerceService,
    SnakeCmsCouponService,
    SnakeCmsLinkAction,
    SnakeCmsLinkService,
    SnakeCmsOptions
} from './types';

interface LegacyResponse<T = any> {
    success?: boolean;
    data?: T;
    msg?: string;
}

function resolveOptions(options?: Pick<SnakeUIOptions, 'request' | 'cache' | 'config'>) {
    return options || getSnakeUIOptions();
}

function requireRequest(options?: Pick<SnakeUIOptions, 'request'>) {
    const request = resolveOptions(options).request;
    if (!request) throw new SnakeUIRuntimeError('snake-cms legacy adapter', 'request');
    return request;
}

function unwrap<T>(response: LegacyResponse<T>, fallback: string): T {
    if (response?.success === false) throw new Error(response.msg || fallback);
    return response?.data as T;
}

function createCommerce(options?: Pick<SnakeUIOptions, 'request'>): SnakeCmsCommerceService {
    return {
        async getActivities(context) {
            const response = await requireRequest(options).get<LegacyResponse<{ items?: Record<string, any>[] }>>(
                '/v3/mms/activity/list',
                context.params
            );
            return { items: unwrap(response, '活动场次加载失败')?.items || [] };
        },
        async getFilters(context) {
            const url = String(context.component.setStyle.filterInterfaceUrl || '');
            if (!url) return {};
            const response = await requireRequest(options).get<LegacyResponse<Record<string, any>>>(
                url,
                context.params
            );
            return unwrap(response, '筛选项加载失败') || {};
        },
        async getGoods(context) {
            const url = String(context.component.setStyle.goodsInterfaceUrl || '');
            if (!url) throw new Error('goodsInterfaceUrl is required by the legacy CMS adapter.');
            const response = await requireRequest(options).get<
                LegacyResponse<{ items?: Record<string, any>[]; total?: number }>
            >(url, context.params);
            const data = unwrap(response, '商品列表加载失败') || {};
            return { items: data.items || [], total: data.total };
        },
        navigateGoods(context) {
            const pageId = context.pageInfo.pageId ?? context.pageInfo.id ?? '';
            navTo(`/pages/buy/detail?id=${context.item.id}&goodsIndex=${context.index}&cmsId=${pageId}`);
        }
    };
}

function createCoupon(options?: Pick<SnakeUIOptions, 'request'>): SnakeCmsCouponService {
    return {
        async check({ config }) {
            const response = await requireRequest(options).get<LegacyResponse<{ result?: boolean }>>(
                '/v3/app/user/coupon/check',
                { activityId: config.couponId }
            );
            return { claimable: Boolean(response?.data?.result), message: response?.msg };
        },
        async receive({ config }) {
            const response = await requireRequest(options).post<LegacyResponse<{ msg?: string }>>(
                '/v3/app/user/coupon/add',
                { activityId: config.couponId }
            );
            return { success: response?.success !== false, message: response?.data?.msg || response?.msg };
        }
    };
}

async function openMiniProgram(action: SnakeCmsLinkAction): Promise<void> {
    if (typeof uni === 'undefined' || typeof uni.navigateToMiniProgram !== 'function') return;
    await new Promise<void>((resolve, reject) => {
        uni.navigateToMiniProgram({
            appId: action.appId || '',
            path: action.path,
            extraData: action.extraData || {},
            envVersion: action.envVersion,
            success: () => resolve(),
            fail: reject
        });
    });
}

function createLink(options?: Pick<SnakeUIOptions, 'request' | 'config'>): SnakeCmsLinkService {
    return {
        async open(action) {
            if (action.type === 'navigate') {
                if (action.url) navTo(action.url);
                return;
            }
            if (action.type === 'mini-program') {
                await openMiniProgram(action);
                return;
            }
            if (action.type === 'scheme') {
                const url = await this.createScheme?.(action);
                if (url && typeof location !== 'undefined') location.href = url;
                return;
            }
            if (!action.url) return;
            try {
                let clickid = '';
                // #ifdef H5
                clickid = String(getQueryParams(typeof location === 'undefined' ? '' : location.href).clickid || '');
                // #endif
                await requireRequest(options).post('/juliang', {
                    event_type: 'work_wechat_added',
                    context: { ad: { callback: clickid } },
                    timestamp: Date.now()
                });
            } catch {
                // Reporting must not prevent the legacy destination from opening.
            }
            navTo(`/pages/custom/webview?url=${encodeURIComponent(action.url)}&back=true`);
        },
        async createScheme(action) {
            const response = await requireRequest(options).post<LegacyResponse<string | { openLink?: string }>>(
                '/user/weixin/generateUrlScheme',
                {
                    appid: action.appId,
                    path: action.path,
                    query: action.query,
                    timestamp: Date.now()
                }
            );
            const data = unwrap(response, 'URL Scheme 生成失败');
            return typeof data === 'string' ? data : data?.openLink || '';
        }
    };
}

/** @deprecated Compatibility bridge for the historical r2nd-joker CMS contract. */
export function createLegacyJokerCmsOptions(
    options?: Pick<SnakeUIOptions, 'request' | 'cache' | 'config'>
): SnakeCmsOptions {
    return {
        legacy: true,
        services: {
            commerce: createCommerce(options),
            coupon: createCoupon(options),
            link: createLink(options)
        },
        assets: {
            backToTop: 'https://cdn.puresnake.com/joker/static/icon-totop.png',
            activityAll: 'https://cdn.puresnake.com/joker/static/all.png',
            goodsLoading: 'https://cdn.puresnake.com/joker/static/snake-loading.png',
            goodsError: 'https://cdn.puresnake.com/joker/static/loadfail.png',
            goodsSoldOut: 'https://cdn.puresnake.com/joker/static/daily-new-soldout.png',
            goodsInspection: 'https://cdn.puresnake.com/joker/static/goods_send.png',
            goodsNewcomer: 'https://cdn.puresnake.com/joker/auction/newcomer_product.png',
            goodsPopular: 'https://cdn.puresnake.com/joker/auction/popular_product.png'
        },
        normalizers: {
            graphicnavigation(component) {
                const style = component.setStyle || {};
                const imageList = Array.isArray(style.imageList) ? style.imageList : [];
                if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') return component;
                const stored = uni.getStorageSync('isContentVisibleInReview');
                if (stored !== false) return component;
                let filtered = imageList;
                // #ifdef MP-WEIXIN
                filtered = imageList.filter(item => item.url !== '/pages/merchantCenter/index');
                // #endif
                // #ifdef MP-ALIPAY
                filtered = imageList.filter(item => item.url !== '/pages/consignment/inquiry');
                // #endif
                return { ...component, setStyle: { ...style, imageList: filtered } };
            },
            pictureads(component) {
                const style = component.setStyle || {};
                const imageList = Array.isArray(style.imageList) ? style.imageList : [];
                if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') return component;
                if (uni.getStorageSync('isContentVisibleInReview') !== false) return component;
                let filtered = imageList;
                // #ifdef MP-ALIPAY
                filtered = imageList.filter(item => !String(item.url || '').includes('pageId=1023'));
                // #endif
                return { ...component, setStyle: { ...style, imageList: filtered } };
            }
        }
    };
}
