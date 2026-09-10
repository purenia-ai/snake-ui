import type { DemoCatalogItem } from '../../common/demo-types';

const templates: DemoCatalogItem[] = [
    {
        key: 'commerce-home',
        path: '/pages/example/templates?template=commerce-home',
        title: '商品首页',
        titleEn: 'Commerce home',
        desc: '轮播、导航、商品列表和优惠券组合的首页模板。',
        icon: 'home',
        tags: ['轮播', '导航', '商品'],
        badge: 'new'
    },
    {
        key: 'campaign',
        path: '/pages/example/templates?template=campaign',
        title: '活动专题页',
        titleEn: 'Campaign page',
        desc: '活动通知、营销广告、倒计时和商品内容组合。',
        icon: 'star-fill',
        tags: ['活动', '营销', '倒计时'],
        badge: 'business'
    },
    {
        key: 'cms-content',
        path: '/pages/example/templates?template=cms-content',
        title: 'CMS 内容页',
        titleEn: 'CMS content page',
        desc: '适合装修系统的内容模块编排和预览页面。',
        icon: 'file-text',
        tags: ['CMS', '装修', '内容'],
        badge: 'cms'
    }
];

export default templates;
