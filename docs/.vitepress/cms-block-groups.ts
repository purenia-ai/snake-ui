export interface CmsBlockItem {
    name: string;
    title: string;
    link: `/cms/${string}`;
}

export interface CmsBlockGroup {
    title: string;
    items: CmsBlockItem[];
}

export const cmsBlockGroups: CmsBlockGroup[] = [
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

export const cmsBlockCount = cmsBlockGroups.reduce((total, group) => total + group.items.length, 0);
