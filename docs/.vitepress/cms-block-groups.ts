export interface CmsBlockItem {
    name: string;
    title: string;
    link: `/cms/${string}`;
    description: string;
    keywords: string[];
}

type CmsBlockDefinition = Omit<CmsBlockItem, 'description' | 'keywords'>;

export interface CmsBlockGroup {
    title: string;
    items: CmsBlockItem[];
}

interface CmsBlockGroupDefinition {
    title: string;
    items: CmsBlockDefinition[];
}

const cmsDescriptions: Partial<Record<CmsBlockItem['link'], string>> = {
    '/cms/images': '按单图、纵向列表或网格展示可跳转图片。',
    '/cms/carousel': '配置商城轮播广告、指示器、自动播放与链接。',
    '/cms/hotzone': '在营销图片上配置百分比定位的可点击热区。',
    '/cms/magiccube': '用多种宫格布局组合图片、活动与商品入口。',
    '/cms/coupon': '展示并领取优惠券，连接宿主优惠券和跳转服务。',
    '/cms/goodslist': '按配置查询、筛选、分页并展示商城商品。'
};

const cmsBlockDefinitions: CmsBlockGroupDefinition[] = [
    {
        title: '内容区块',
        items: [
            { name: 'Images', title: '图片展示', link: '/cms/images' },
            { name: 'Carousel', title: '轮播图', link: '/cms/carousel' },
            { name: 'Video', title: '视频', link: '/cms/video' },
            { name: 'Hotzone', title: '热区图', link: '/cms/hotzone' },
            { name: 'MagicCube', title: '魔方', link: '/cms/magiccube' },
            { name: 'Notice', title: '公告', link: '/cms/notice' },
            { name: 'Divider', title: '分割线', link: '/cms/divider' },
            { name: 'RichText', title: '富文本', link: '/cms/richtext' }
        ]
    },
    {
        title: '互动区块',
        items: [
            { name: 'Search', title: '搜索框', link: '/cms/search' },
            { name: 'FloatButton', title: '悬浮按钮', link: '/cms/floatbutton' },
            { name: 'Popup', title: '页面弹窗', link: '/cms/popup' },
            { name: 'Custom', title: '自定义模块', link: '/cms/custom' }
        ]
    },
    {
        title: '商城区块',
        items: [
            { name: 'Coupon', title: '优惠券', link: '/cms/coupon' },
            { name: 'GoodsList', title: '商品列表', link: '/cms/goodslist' }
        ]
    }
];

export const cmsBlockGroups: CmsBlockGroup[] = cmsBlockDefinitions.map(group => ({
    ...group,
    items: group.items.map(item => {
        const slug = item.link.slice('/cms/'.length);
        return {
            ...item,
            description: cmsDescriptions[item.link] || `通过 Snake CMS 配置并渲染${item.title}区块。`,
            keywords: [item.name, item.title, slug, `v2.${slug}`]
        };
    })
}));

export const cmsBlockCount = cmsBlockGroups.reduce((total, group) => total + group.items.length, 0);
export const cmsBlockItems = cmsBlockGroups.flatMap(group => group.items);
