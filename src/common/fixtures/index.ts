export const localImage = '/static/logo.png';

export const foundationSwiperData = [
    { url: localImage, title: 'Snake UI 基础组件' },
    { url: localImage, title: '跨端实时预览' }
];

export const foundationTabs = [
    { name: '推荐', count: 12 },
    { name: '新品', count: 3 },
    { name: '热门' },
    { name: '限时活动', count: 8 },
    { name: '隐藏分类', hidden: true },
    { name: '品牌馆' },
    { name: '会员专享', count: 1 },
    { name: '暂未开放', disabled: true }
];

export const noticeData = {
    direction: 'column',
    textList: [
        { text: 'Snake UI 文档预览已就绪', url: '' },
        { text: '所有示例数据均在本地运行', url: '' }
    ],
    noticeText: [],
    isLeftIcon: true,
    backColor: '#effaf5',
    textColor: '#176b4b',
    pageMargin: 24,
    height: 72
};

export const auxiliaryData = {
    blankHeight: 32,
    paddType: 1,
    bgColor: '#ffffff',
    segmentationtype: 1,
    bordertp: 'dashed',
    auxliarColor: '#9ccdb5'
};

export const searchData = {
    position: 0,
    backgroundColor: '#ffffff',
    pageMargin: 24,
    heights: 72,
    borderBgColor: '#f3f6f4',
    borderRadius: 36,
    showBorder: false,
    textColor: '#7b8780',
    searchText: '搜索 Snake UI 组件',
    isSearch: true,
    inputType: 'text',
    url: '',
    textList: [],
    rightImage: { show: false, marginRight: 0 },
    iconImgList: []
};

export const imageData = {
    platformOptions: [{ value: 'h5', imgs: { src: localImage, url: '', paddingLR: 20, height: 320 } }]
};

export const pictureAdsData = {
    swiperType: 1,
    imageList: [
        { src: localImage, url: '' },
        { src: localImage, url: '' }
    ],
    height: 180,
    pageMargin: 24,
    imageMargin: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    interval: 3000,
    pagingType: 'bullets',
    indicatorColor: '#06D290'
};

export const navigationData = {
    imgStyle: 0,
    navigationType: 0,
    backgroundColor: '#ffffff',
    imgMargin: 12,
    borderRadius: 16,
    textColor: '#24342c',
    textSize: 24,
    textHeight: 32,
    imageList: ['新品', '拍卖', '精选', '服务'].map(text => ({ text, src: localImage, url: '' }))
};

export const popupData = { popupMode: 'center', image: localImage, url: '' };
export const floatingBubbleData = {
    uid: 'service',
    src: localImage,
    url: '',
    width: 96,
    height: 96,
    right: 0,
    bottom: 20
};
export const couponData = {
    modeType: 'page',
    couponId: 'preview',
    beforeImage: '/static/demo-coupon-available.png',
    afterImage: '/static/demo-coupon-claimed.png',
    type: '10',
    afterUrl: ''
};
export function createDemoCouponService() {
    let claimed = false;
    return {
        service: {
            async check() {
                return { claimable: !claimed };
            },
            async receive() {
                claimed = true;
                return { success: true };
            }
        },
        reset() {
            claimed = false;
        }
    };
}
export const jumpAppletData = {
    isButton: true,
    title: '打开小程序',
    textColor: '#ffffff',
    btnColor: '#06D290',
    appId: '',
    path: '',
    query: '',
    isAuto: false,
    isWeCom: false
};

export const activities = [
    {
        id: '001',
        name: '正在热拍',
        subtitle: '限时竞价',
        squareImage: localImage,
        startTime: Date.now() - 3600000,
        endTime: Date.now() + 3600000
    },
    {
        id: '002',
        name: '今晚八点',
        subtitle: '即将开始',
        squareImage: localImage,
        startTime: Date.now() + 3600000,
        endTime: Date.now() + 7200000
    }
];

export const goods = [
    {
        id: 'sku-1',
        image: localImage,
        name: 'Snake UI 示例商品',
        goodsName: 'Snake UI 示例商品',
        price: 1299,
        discountPrice: 999,
        amount: 8,
        channelStatus: 1,
        status: 1,
        tag: '精选'
    },
    {
        id: 'sku-2',
        image: localImage,
        name: '离线预览商品',
        goodsName: '离线预览商品',
        price: 899,
        discountPrice: 699,
        amount: 3,
        channelStatus: 1,
        status: 1,
        tag: '新品'
    }
];

export const filters = {
    topFilter: [
        { name: '综合', type: 'click', value: 'auto' },
        { name: '价格', type: 'sort', value: 'price' }
    ],
    mainFilter: [
        {
            name: '尺码',
            value: 'sizeFilter',
            type: 'multiple',
            children: [
                { label: '42', value: '42' },
                { label: '43', value: '43' }
            ]
        }
    ],
    brandFilter: {}
};

export const listSwitchingData = {
    commoditylisttype: 0,
    commodityType: 0,
    pageMargin: 20,
    commodityMargin: 16,
    borderRadius: 12,
    imageList: goods,
    commoditylisttypetab: [],
    commoditycorner: true,
    commoditycornertype: 0,
    commodityTagColor: '#06D290',
    tagPosition: 0
};

export const cmsComponents = [
    { component: 'notice', setStyle: noticeData },
    { component: 'graphicnavigation', setStyle: navigationData }
];
