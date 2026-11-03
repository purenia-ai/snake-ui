<template>
    <DemoPage :title="title" :desc="text('完整展示 v1 / v2 两代装修协议支持的全部组件与常用形态。')">
        <DemoSection
            variant="controls"
            :title="text('参数配置')"
            :description="text('商品、筛选、活动、优惠券与链接均为本地 mock 服务。')"
        >
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>

        <template v-if="state.cmsScene !== 'v2'">
            <DemoSection
                bare
                variant="preview"
                :title="text('V1 · 基础内容')"
                :description="
                    text('搜索 / 公告 / 图文导航 / 轮播广告 / 魔方 / 单图 / 视频 / 富文本（setStyle · 750 稿）')
                "
            >
                <view v-for="item in v1ContentItems" :key="item.key" class="demo-cms-item">
                    <view class="demo-cms-item__head">
                        <text class="demo-cms-item__name">{{ item.name }}</text>
                        <text class="demo-cms-item__key">{{ item.key }}</text>
                    </view>
                    <snake-cms
                        class="demo-snake-cms-showcase"
                        :page-info="{ pageId: `demo-${item.key}` }"
                        :page-components="[item.config]"
                        :scroll-top="scrollTop"
                        :cms-options="cmsDemoOptions"
                        @error="onCmsError"
                    />
                </view>
            </DemoSection>
            <DemoSection
                bare
                variant="preview"
                :title="text('V1 · 营销互动')"
                :description="text('优惠券 / 小程序入口 / 关注 / 自定义插槽 / 悬浮气泡 / 辅助分割')"
            >
                <view v-for="item in v1MarketingItems" :key="item.key" class="demo-cms-item">
                    <view class="demo-cms-item__head">
                        <text class="demo-cms-item__name">{{ item.name }}</text>
                        <text class="demo-cms-item__key">{{ item.key }}</text>
                    </view>
                    <snake-cms
                        class="demo-snake-cms-showcase"
                        :page-info="{ pageId: `demo-${item.key}` }"
                        :page-components="[item.config]"
                        :scroll-top="scrollTop"
                        :cms-options="cmsDemoOptions"
                        @error="onCmsError"
                    >
                        <template #v1Custom>
                            <view class="demo-cms-slot">{{ text('业务插槽可以在这里承载任意内容') }}</view>
                        </template>
                    </snake-cms>
                </view>
            </DemoSection>
            <DemoSection
                bare
                variant="preview"
                :title="text('V1 · 商品楼层')"
                :description="text('页签 + 筛选排序吸顶与商品列表（同一实例仅允许一个商品楼层）')"
            >
                <view class="demo-cms-item">
                    <view class="demo-cms-item__head">
                        <text class="demo-cms-item__name">{{ name('商品楼层', 'Goods Floor') }}</text>
                        <text class="demo-cms-item__key">goodslist</text>
                    </view>
                    <snake-cms
                        class="demo-snake-cms-showcase"
                        :page-info="{ pageId: 'demo-v1-goodslist' }"
                        :page-components="v1GoodsComponents"
                        :scroll-top="scrollTop"
                        :cms-options="cmsDemoOptions"
                        @goods-click="onGoodsClick"
                    />
                </view>
            </DemoSection>
        </template>

        <template v-if="state.cmsScene !== 'v1'">
            <DemoSection
                bare
                variant="preview"
                :title="text('V2 · 内容展示')"
                :description="text('搜索 / 公告 / 轮播 / 魔方 / 图片 / 热区 / 视频 / 富文本（props · 375 px 直出）')"
            >
                <view v-for="item in v2ContentItems" :key="item.key" class="demo-cms-item">
                    <view class="demo-cms-item__head">
                        <text class="demo-cms-item__name">{{ item.name }}</text>
                        <text class="demo-cms-item__key">{{ item.key }}</text>
                    </view>
                    <snake-cms
                        class="demo-snake-cms-showcase"
                        :page-info="{ pageId: `demo-${item.key}` }"
                        :page-components="[item.config]"
                        :scroll-top="scrollTop"
                        :cms-options="cmsDemoOptions"
                        @error="onCmsError"
                    />
                </view>
            </DemoSection>
            <DemoSection
                bare
                variant="preview"
                :title="text('V2 · 营销浮动')"
                :description="text('优惠券 / 悬浮按钮 / 自定义插槽 / 分割线（coupon 走 v2 协议自动映射）')"
            >
                <view v-for="item in v2MarketingItems" :key="item.key" class="demo-cms-item">
                    <view class="demo-cms-item__head">
                        <text class="demo-cms-item__name">{{ item.name }}</text>
                        <text class="demo-cms-item__key">{{ item.key }}</text>
                    </view>
                    <snake-cms
                        class="demo-snake-cms-showcase"
                        :page-info="{ pageId: `demo-${item.key}` }"
                        :page-components="[item.config]"
                        :scroll-top="scrollTop"
                        :cms-options="cmsDemoOptions"
                        @error="onCmsError"
                    >
                        <template #v2Custom>
                            <view class="demo-cms-slot">{{ text('v2 自定义插槽：任意业务内容') }}</view>
                        </template>
                    </snake-cms>
                </view>
            </DemoSection>
            <DemoSection
                bare
                variant="preview"
                :title="text('V2 · 商品楼层')"
                :description="text('bars 开关页签 / 筛选 / 吸顶，display 控制卡片与列数')"
            >
                <view class="demo-cms-item">
                    <view class="demo-cms-item__head">
                        <text class="demo-cms-item__name">{{ name('商品楼层', 'Goods Floor') }}</text>
                        <text class="demo-cms-item__key">v2.goodslist</text>
                    </view>
                    <snake-cms
                        class="demo-snake-cms-showcase"
                        :page-info="{ pageId: 'demo-v2-goodslist' }"
                        :page-components="v2GoodsComponents"
                        :scroll-top="scrollTop"
                        :cms-options="cmsDemoOptions"
                        @goods-click="onGoodsClick"
                    />
                </view>
            </DemoSection>
        </template>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import {
    activities,
    auxiliaryData,
    couponData,
    createDemoCouponService,
    filters,
    goods,
    jumpAppletData,
    noticeData,
    searchData
} from '../../../common/fixtures';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import type { CmsComponentConfig, CmsOptions } from '../../../uni_modules/snake-ui';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const name = (zh: string, en: string) => (isEnglish.value ? en : zh);
const scrollTop = ref(0);
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});

/* 演示素材：促销 banner + 商品图形，每种形态不同图。 */
const banner = {
    spring: '/static/demo-cms-b-spring.png',
    sale: '/static/demo-cms-b-sale.png',
    vip: '/static/demo-cms-b-vip.png',
    brand: '/static/demo-cms-b-brand.png'
};
const product = {
    tshirt: '/static/demo-cms-p-tshirt.png',
    watch: '/static/demo-cms-p-watch.png',
    bag: '/static/demo-cms-p-bag.png',
    camera: '/static/demo-cms-p-camera.png',
    headphones: '/static/demo-cms-p-headphones.png',
    perfume: '/static/demo-cms-p-perfume.png',
    cup: '/static/demo-cms-p-cup.png',
    lamp: '/static/demo-cms-p-lamp.png'
};

const controls: DemoControl[] = [
    {
        key: 'cmsScene',
        label: '页面场景',
        type: 'select',
        defaultValue: 'v1',
        options: [
            { label: '仅 V1', value: 'v1' },
            { label: '仅 V2', value: 'v2' }
        ]
    },
    { key: 'cmsPopups', label: '弹窗组件', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>({ cmsScene: 'v1', cmsPopups: false });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: demoText(control.label),
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('snake-cms', 'Snake CMS');
});

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}

/* ---------------------------------------------------------------------------
 * 本地 mock 服务：商品 / 筛选 / 活动 / 优惠券 / 链接全部离线可用。
 * ------------------------------------------------------------------------- */
const couponDemo = createDemoCouponService();
const demoGoods = computed(() =>
    (isEnglish.value
        ? goods.map((item, index) => ({
              ...item,
              name: index ? 'Vintage sneakers' : 'Spring windbreaker',
              goodsName: index ? 'Vintage sneakers' : 'Spring windbreaker',
              tag: index ? 'New' : 'Featured'
          }))
        : goods
    ).map((item, index) => ({ ...item, image: [product.tshirt, product.watch][index % 2] }))
);
const cmsDemoOptions: CmsOptions = {
    services: {
        commerce: {
            async getActivities() {
                return { items: activities };
            },
            async getFilters() {
                return filters;
            },
            async getGoods() {
                return { items: demoGoods.value, hasMore: false };
            },
            navigateGoods({ item }) {
                uni.showToast({ title: `${text('已选择商品')}: ${item.goodsName || item.name || ''}`, icon: 'none' });
            }
        },
        coupon: couponDemo.service,
        link: {
            open(action) {
                uni.showToast({ title: `${text('打开链接')}: ${action.url || action.type}`, icon: 'none' });
            }
        }
    }
};

/* ---------------------------------------------------------------------------
 * V1 组件（setStyle · 750 稿语义，内部 from750 换算）
 * ------------------------------------------------------------------------- */
const v1NoticeRotate = computed(() =>
    isEnglish.value
        ? {
              ...noticeData,
              textList: [
                  { text: 'The Snake UI demo is ready', url: '' },
                  { text: 'All example data runs locally', url: '' }
              ]
          }
        : noticeData
);
const v1NoticeMarquee = computed(() => ({
    ...noticeData,
    direction: 'row',
    noticeText: isEnglish.value
        ? 'Notice: Snake UI 0.0.8 ships the full v1 / v2 CMS toolchain.'
        : '公告：Snake UI 0.0.8 发布，v1 / v2 装修组件全覆盖。'
}));
const v1Navigation = computed(() => ({
    imgStyle: 0,
    navigationType: 0,
    backgroundColor: '#ffffff',
    imgMargin: 12,
    borderRadius: 16,
    textColor: '#24342c',
    textSize: 24,
    textHeight: 32,
    imageList: (isEnglish.value ? ['New', 'Watch', 'Bags', 'Camera'] : ['新品', '腕表', '箱包', '相机']).map(
        (label, index) => ({
            text: label,
            src: [product.tshirt, product.watch, product.bag, product.camera][index],
            url: ''
        })
    )
}));
const v1AdsSingle = {
    swiperType: 0,
    imageList: [{ src: banner.spring, text: '新品首发', url: '' }],
    height: 180,
    pageMargin: 24,
    imageMargin: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    interval: 3000,
    pagingType: 'bullets',
    indicatorColor: '#06D290'
};
const v1AdsSwiper = {
    ...v1AdsSingle,
    swiperType: 1,
    imageList: [
        { src: banner.sale, text: '限时秒杀', url: '' },
        { src: banner.vip, text: '会员专享', url: '' }
    ]
};
const v1MagicCube = computed(() => ({
    rubiksCubeType: 1,
    heights: 180,
    pageMargin: 20,
    imgMargin: 8,
    borderRadius: 12,
    bgColor: '#ffffff',
    imageTypeObj: {
        1: (isEnglish.value ? ['Audio', 'Fragrance', 'Mugs', 'Lamps'] : ['耳机', '香氛', '杯具', '灯具']).map(
            (title, index) => [
                { src: [product.headphones, product.perfume, product.cup, product.lamp][index], url: '', title }
            ]
        )
    }
}));
const v1Images = {
    platformOptions: [{ value: 'h5', imgs: { src: banner.brand, url: '', paddingLR: 20, height: 320 } }]
};
const v1Videos = computed(() => ({
    src: '/static/demo-flower.mp4',
    poster: product.cup,
    emptyText: text('暂无视频')
}));
const v1RichText = computed(() => ({
    myValue: `<h3>Snake UI CMS</h3><p>${
        isEnglish.value ? 'Rich text content rendered by the v1 decoration protocol.' : 'V1 装修协议渲染的富文本内容。'
    }</p>`
}));

interface DemoCmsItem {
    key: string;
    name: string;
    config: CmsComponentConfig;
}

const v1ContentItems = computed<DemoCmsItem[]>(() => [
    {
        key: 'commoditysearch',
        name: name('商品搜索', 'Product Search'),
        config: { component: 'commoditysearch', setStyle: searchData }
    },
    {
        key: 'notice-rotate',
        name: name('公告 · 滚动轮播', 'Notice · Rotate'),
        config: { component: 'notice', setStyle: v1NoticeRotate.value }
    },
    {
        key: 'notice-marquee',
        name: name('公告 · 跑马灯', 'Notice · Marquee'),
        config: { component: 'notice', setStyle: v1NoticeMarquee.value }
    },
    {
        key: 'graphicnavigation',
        name: name('图文导航', 'Graphic Navigation'),
        config: { component: 'graphicnavigation', setStyle: v1Navigation.value }
    },
    {
        key: 'pictureads-single',
        name: name('轮播广告 · 单图', 'Picture Ads · Single'),
        config: { component: 'pictureads', setStyle: v1AdsSingle }
    },
    {
        key: 'pictureads-swiper',
        name: name('轮播广告 · 轮播', 'Picture Ads · Swiper'),
        config: { component: 'pictureads', setStyle: v1AdsSwiper }
    },
    {
        key: 'magiccube',
        name: name('魔方布局 · 单行四列', 'Magic Cube · Row'),
        config: { component: 'magiccube', setStyle: v1MagicCube.value }
    },
    { key: 'images', name: name('单图广告', 'Images'), config: { component: 'images', setStyle: v1Images } },
    { key: 'videos', name: name('视频', 'Videos'), config: { component: 'videos', setStyle: v1Videos.value } },
    {
        key: 'richtext',
        name: name('富文本', 'Rich Text'),
        config: { component: 'richtext', setStyle: v1RichText.value }
    }
]);

const v1MarketingItems = computed<DemoCmsItem[]>(() => {
    const list: DemoCmsItem[] = [
        { key: 'coupon', name: name('优惠券', 'Coupon'), config: { component: 'coupon', setStyle: couponData } },
        {
            key: 'jumpApplet',
            name: name('小程序入口', 'Mini Program Entry'),
            config: { component: 'jumpApplet', setStyle: jumpAppletData }
        },
        {
            key: 'follow',
            name: name('关注（仅微信小程序）', 'Follow (WeChat only)'),
            config: { component: 'follow', setStyle: {} }
        },
        {
            key: 'custommodule',
            name: name('自定义插槽', 'Custom Slot'),
            config: { component: 'custommodule', setStyle: { slotName: 'v1Custom' } }
        },
        {
            key: 'suspension',
            name: name('悬浮气泡', 'Floating Bubble'),
            config: {
                component: 'suspension',
                setStyle: { uid: 'v1-demo', src: product.camera, url: '', width: 96, height: 96, right: 0, bottom: 20 }
            }
        },
        {
            key: 'auxiliarysegmentation',
            name: name('辅助分割', 'Segmentation'),
            config: { component: 'auxiliarysegmentation', setStyle: auxiliaryData }
        }
    ];
    if (state.cmsPopups)
        list.push({
            key: 'pagePopup',
            name: name('页面弹窗', 'Page Popup'),
            config: { component: 'pagePopup', setStyle: { popupMode: 'center', image: banner.brand, url: '' } }
        });
    return list;
});

const v1GoodsComponents = computed<CmsComponentConfig[]>(() => [
    {
        component: 'goodslist',
        setStyle: {
            tabShow: true,
            tabslist: isEnglish.value
                ? [{ label: 'Featured' }, { label: 'New' }, { label: 'Auction' }]
                : [{ label: '推荐' }, { label: '新品' }, { label: '拍卖' }],
            filterShow: true,
            filterParams: { sort: 'auto' },
            attendanceShow: false,
            activitySessionShow: false,
            listType: 'sale',
            commodityType: 0,
            pageMargin: 24,
            imageMargin: 16,
            backgroundColor: '#f6f6f6',
            emptyText: text('暂无商品')
        }
    }
]);

/* ---------------------------------------------------------------------------
 * V2 组件（props · 375 px 直出，与编辑器 v2 schema 默认值一致）
 * ------------------------------------------------------------------------- */
const v2Link = { http: '', httpType: 10 };
const v2SearchStyleBase = {
    pageMargin: 0,
    height: 30,
    backgroundColor: 'rgb(249, 249, 249)',
    textColor: 'rgb(150, 151, 153)'
};
const v2SearchDefault = computed(() => ({
    inputType: 'text',
    isSearch: true,
    searchText: text('搜索商品'),
    textList: isEnglish.value
        ? [
              { text: 'Sneakers', link: v2Link },
              { text: 'Vintage bags', link: v2Link }
          ]
        : [
              { text: '运动鞋', link: v2Link },
              { text: '复古包', link: v2Link }
          ],
    rightImage: { show: false },
    icons: [],
    style: {
        ...v2SearchStyleBase,
        borderBgColor: 'rgb(255, 255, 255)',
        borderRadius: 0,
        showBorder: true,
        borderSize: 1,
        borderColor: 'rgb(0, 0, 0)'
    }
}));
const v2SearchPill = computed(() => ({
    inputType: 'text',
    isSearch: true,
    searchText: text('搜索商品'),
    textList: [],
    rightImage: { show: false },
    icons: [],
    style: {
        ...v2SearchStyleBase,
        pageMargin: 12,
        height: 34,
        borderBgColor: 'rgb(242, 243, 245)',
        borderRadius: 17,
        showBorder: false
    }
}));
const v2NoticeRotate = computed(() => ({
    direction: 'column',
    isLeftIcon: true,
    textList: isEnglish.value
        ? [
              { text: 'New version published', link: v2Link },
              { text: 'V2 blocks are fully covered', link: v2Link }
          ]
        : [
              { text: '新版本已发布', link: v2Link },
              { text: 'V2 组件全覆盖演示', link: v2Link }
          ],
    style: { height: 36, pageMargin: 5, textColor: '#176b4b', backgroundColor: '#effaf5' }
}));
const v2NoticeMarquee = computed(() => ({
    direction: 'row',
    isLeftIcon: true,
    noticeText: isEnglish.value ? 'Members day: double points on every order.' : '会员日：全场订单双倍积分，上不封顶。',
    link: v2Link,
    style: { height: 36, pageMargin: 5, textColor: '#2d57e7', backgroundColor: '#eaf1ff' }
}));
const v2CarouselBullets = {
    items: [
        { src: banner.spring, link: v2Link },
        { src: banner.sale, link: v2Link }
    ],
    play: { autoplay: true, interval: 3, loop: true },
    indicator: { type: 'bullets', color: '#06D290' },
    style: { heightMode: 'auto', pageMargin: 0, imageRadius: 0, backgroundColor: '#ffffff' }
};
const v2CarouselProgress = {
    items: [
        { src: banner.vip, link: v2Link },
        { src: banner.brand, link: v2Link }
    ],
    play: { autoplay: true, interval: 4, loop: true },
    indicator: { type: 'progressbar', color: '#06D290' },
    style: { heightMode: 'auto', pageMargin: 0, imageRadius: 0, backgroundColor: '#ffffff' }
};
const v2MagicRow = {
    layout: 'row',
    columns: 4,
    cells: [product.tshirt, product.watch, product.bag, product.camera].map(src => ({ src, link: v2Link })),
    play: { interval: 5 },
    style: { height: 94, gap: 6, radius: 4, pageMargin: 0, backgroundColor: '#ffffff' }
};
const v2MagicGrid = {
    layout: 'grid2x2',
    cells: [product.headphones, product.perfume, product.cup, product.lamp].map(src => ({ src, link: v2Link })),
    play: { interval: 5 },
    style: { height: 350, gap: 6, radius: 4, pageMargin: 0, backgroundColor: '#ffffff' }
};
const v2MagicL1R2 = {
    layout: 'left1right2',
    cells: [product.watch, product.bag, product.camera].map(src => ({ src, link: v2Link })),
    play: { interval: 5 },
    style: { height: 300, gap: 6, radius: 4, pageMargin: 0, backgroundColor: '#ffffff' }
};
const v2ImagesSingle = {
    layout: { mode: 'single', columns: 1 },
    items: [{ src: banner.brand, link: v2Link }],
    style: { pageMargin: 0, heightMode: 'auto', gap: 4, radius: 0, backgroundColor: '#ffffff' }
};
const v2ImagesGrid = {
    layout: { mode: 'grid', columns: 2 },
    items: [product.camera, product.headphones, product.perfume, product.cup].map(src => ({ src, link: v2Link })),
    style: { pageMargin: 0, heightMode: 'auto', gap: 4, radius: 0, backgroundColor: '#ffffff' }
};
const v2Hotzone = {
    image: banner.spring,
    zones: [
        { top: 22, left: 6, width: 46, height: 56, link: v2Link },
        { top: 22, left: 54, width: 40, height: 56, link: v2Link }
    ]
};
const v2Video = {
    src: '/static/demo-flower.mp4',
    coverUrl: product.lamp,
    autoplay: false,
    style: { pageMargin: 0, heightMode: 'auto', radius: 0, backgroundColor: '#ffffff' }
};
const v2RichText = computed(() => ({
    content: `<h3>Snake UI CMS v2</h3><p>${
        isEnglish.value
            ? 'Rich text block with sanitized HTML in the v2 schema.'
            : 'V2 协议富文本模块，内容经过安全过滤。'
    }</p>`,
    style: { backgroundColor: '#ffffff' }
}));

const v2ContentItems = computed<DemoCmsItem[]>(() => [
    {
        key: 'v2.search-default',
        name: name('搜索框 · 默认样式', 'Search · Default'),
        config: { component: 'v2.search', props: v2SearchDefault.value }
    },
    {
        key: 'v2.search-pill',
        name: name('搜索框 · 胶囊样式', 'Search · Pill'),
        config: { component: 'v2.search', props: v2SearchPill.value }
    },
    {
        key: 'v2.notice-rotate',
        name: name('公告 · 滚动轮播', 'Notice · Rotate'),
        config: { component: 'v2.notice', props: v2NoticeRotate.value }
    },
    {
        key: 'v2.notice-marquee',
        name: name('公告 · 跑马灯', 'Notice · Marquee'),
        config: { component: 'v2.notice', props: v2NoticeMarquee.value }
    },
    {
        key: 'v2.carousel-bullets',
        name: name('图片轮播 · 圆点指示', 'Carousel · Bullets'),
        config: { component: 'v2.carousel', props: v2CarouselBullets }
    },
    {
        key: 'v2.carousel-progress',
        name: name('图片轮播 · 进度条', 'Carousel · Progress'),
        config: { component: 'v2.carousel', props: v2CarouselProgress }
    },
    {
        key: 'v2.magiccube-row',
        name: name('魔方布局 · 单行四列', 'Magic Cube · Row'),
        config: { component: 'v2.magiccube', props: v2MagicRow }
    },
    {
        key: 'v2.magiccube-grid',
        name: name('魔方布局 · 2×2', 'Magic Cube · Grid'),
        config: { component: 'v2.magiccube', props: v2MagicGrid }
    },
    {
        key: 'v2.magiccube-l1r2',
        name: name('魔方布局 · 左一右二', 'Magic Cube · 1L2R'),
        config: { component: 'v2.magiccube', props: v2MagicL1R2 }
    },
    {
        key: 'v2.images-single',
        name: name('图片组合 · 单图', 'Images · Single'),
        config: { component: 'v2.images', props: v2ImagesSingle }
    },
    {
        key: 'v2.images-grid',
        name: name('图片组合 · 双列网格', 'Images · Grid'),
        config: { component: 'v2.images', props: v2ImagesGrid }
    },
    { key: 'v2.hotzone', name: name('热区图片', 'Hotzone'), config: { component: 'v2.hotzone', props: v2Hotzone } },
    { key: 'v2.video', name: name('视频', 'Video'), config: { component: 'v2.video', props: v2Video } },
    {
        key: 'v2.richtext',
        name: name('富文本', 'Rich Text'),
        config: { component: 'v2.richtext', props: v2RichText.value }
    }
]);

const v2MarketingItems = computed<DemoCmsItem[]>(() => {
    const list: DemoCmsItem[] = [
        {
            key: 'v2.coupon',
            name: name('优惠券', 'Coupon'),
            config: {
                component: 'v2.coupon',
                props: {
                    mode: 'page',
                    coupon: 'preview',
                    before: { image: '/static/demo-coupon-available.png', link: v2Link },
                    after: { image: '/static/demo-coupon-claimed.png', link: v2Link }
                }
            }
        },
        {
            key: 'v2.floatbutton',
            name: name('悬浮按钮', 'Float Button'),
            config: {
                component: 'v2.floatbutton',
                props: {
                    src: product.headphones,
                    link: v2Link,
                    style: { width: 38, height: 38 },
                    position: { right: 2, bottom: 30 }
                }
            }
        },
        {
            key: 'v2.custom',
            name: name('自定义插槽', 'Custom Slot'),
            config: { component: 'v2.custom', props: { slotName: 'v2Custom' } }
        },
        {
            key: 'v2.divider-blank',
            name: name('分割线 · 辅助空白', 'Divider · Blank'),
            config: {
                component: 'v2.divider',
                props: { mode: 'blank', height: 15, style: { backgroundColor: 'transparent' } }
            }
        },
        {
            key: 'v2.divider-line',
            name: name('分割线 · 虚线', 'Divider · Dashed'),
            config: {
                component: 'v2.divider',
                props: {
                    mode: 'line',
                    height: 15,
                    margin: 1,
                    lineStyle: 'dashed',
                    style: { backgroundColor: 'transparent', lineColor: '#e5e5e5' }
                }
            }
        }
    ];
    if (state.cmsPopups)
        list.push({
            key: 'v2.popup',
            name: name('页面弹窗', 'Popup'),
            config: { component: 'v2.popup', props: { popupMode: 'center', image: banner.vip, link: v2Link } }
        });
    return list;
});

const v2GoodsComponents = computed<CmsComponentConfig[]>(() => [
    {
        component: 'v2.goodslist',
        props: {
            bars: {
                tabs: {
                    enabled: true,
                    list: isEnglish.value
                        ? [
                              { id: 't1', label: 'Featured' },
                              { id: 't2', label: 'New' }
                          ]
                        : [
                              { id: 't1', label: '推荐' },
                              { id: 't2', label: '新品' }
                          ]
                },
                filter: true,
                sticky: true,
                activitySession: false
            },
            display: { cardType: 'sale', columns: 2, showAttendance: false, showTag: true },
            query: { sort: 'auto' },
            style: { backgroundColor: '#F8F8F8', pageMargin: 2.5, gap: 5, radius: 0 },
            empty: { text: text('列表为空') }
        }
    }
]);

function onGoodsClick(payload: { item: Record<string, any>; index: number }) {
    uni.showToast({
        title: `${text('已选择商品')}: ${payload.item.goodsName || payload.item.name || ''}`,
        icon: 'none'
    });
}
function onCmsError(error: unknown) {
    uni.showToast({ title: text('CMS 渲染异常，详见控制台'), icon: 'none' });
    console.warn('[snake-cms demo]', error);
}
</script>

<style scoped>
.demo-cms-item {
    margin-bottom: 14px;
}
.demo-cms-item__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    padding: 0 12px;
}
.demo-cms-item__name {
    color: var(--snake-color-text);
    font-size: 13px;
    font-weight: 600;
}
.demo-cms-item__key {
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--snake-color-primary-deep);
    background: var(--snake-color-primary-light);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 10px;
}
.demo-cms-slot {
    margin: 10px 12px;
    padding: 20px 14px;
    border-radius: 10px;
    color: #eafff4;
    background: linear-gradient(135deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
    font-weight: 700;
}
</style>
