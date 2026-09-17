import type { DemoCatalogGroup } from '../../common/demo-types';

const scenes: DemoCatalogGroup[] = [
    {
        key: 'showcases',
        title: '完整场景',
        titleEn: 'Complete scenes',
        icon: 'home',
        items: [
            {
                key: 'commerce-home',
                kind: 'scene',
                path: '/pages/showcase/commerceHome/index',
                title: '商品首页',
                titleEn: 'Commerce home',
                desc: '从导航、商品浏览到优惠券的完整首页。',
                icon: 'home',
                badge: 'new'
            },
            {
                key: 'campaign',
                kind: 'scene',
                path: '/pages/showcase/campaign/index',
                title: '活动专题页',
                titleEn: 'Campaign page',
                desc: '组合通知、倒计时、活动场次与商品。',
                icon: 'star-fill',
                badge: 'business'
            },
            {
                key: 'cms-content',
                kind: 'scene',
                path: '/pages/showcase/cmsContent/index',
                title: 'CMS 内容页',
                titleEn: 'CMS content page',
                desc: '使用真实装修配置编排内容模块。',
                icon: 'file-text',
                badge: 'cms'
            }
        ]
    },
    {
        key: 'commerce',
        title: '商品业务',
        titleEn: 'Commerce',
        icon: 'shopping-cart',
        items: [
            {
                key: 'goods-list',
                path: '/pages/componentsB/goodsList/index',
                title: '商品列表',
                titleEn: 'Goods list',
                desc: '展示商品图片、价格、标签和库存状态。',
                icon: 'shopping-cart',
                badge: 'business'
            },
            {
                key: 'activity-list',
                path: '/pages/componentsB/activityList/index',
                title: '活动会场',
                titleEn: 'Activity list',
                desc: '展示限时活动、倒计时和当前活动状态。',
                icon: 'clock',
                badge: 'business'
            },
            {
                key: 'filter-sorts',
                path: '/pages/componentsB/filterSorts/index',
                title: '筛选排序',
                titleEn: 'Filter & sort',
                desc: '组合顶部排序、筛选条件和结果列表。',
                icon: 'setting',
                badge: 'business'
            },
            {
                key: 'list-switching',
                path: '/pages/componentsB/listSwitching/index',
                title: '列表切换',
                titleEn: 'List switching',
                desc: '在网格与列表布局之间切换商品展示。',
                icon: 'grid',
                badge: 'business'
            }
        ]
    },
    {
        key: 'content',
        title: '内容营销',
        titleEn: 'Content & marketing',
        icon: 'photo',
        items: [
            {
                key: 'cms',
                path: '/pages/componentsB/snakeCms/index',
                title: 'CMS 内容页',
                titleEn: 'CMS content',
                desc: '按装修配置渲染通知、导航和内容模块。',
                icon: 'file-text',
                badge: 'cms'
            },
            {
                key: 'picture-ads',
                path: '/pages/componentsB/pictureAds/index',
                title: '营销轮播',
                titleEn: 'Marketing banner',
                desc: '用图片广告和轮播承载活动入口。',
                icon: 'photo',
                badge: 'cms'
            },
            {
                key: 'graphic-navigation',
                path: '/pages/componentsB/graphicNavigation/index',
                title: '图文导航',
                titleEn: 'Graphic navigation',
                desc: '用图文宫格组织频道和业务入口。',
                icon: 'grid',
                badge: 'cms'
            },
            {
                key: 'coupon',
                path: '/pages/componentsB/coupon/index',
                title: '优惠券',
                titleEn: 'Coupon',
                desc: '展示优惠券状态并提供领取入口。',
                icon: 'gift',
                badge: 'business'
            }
        ]
    }
];

export default scenes;
