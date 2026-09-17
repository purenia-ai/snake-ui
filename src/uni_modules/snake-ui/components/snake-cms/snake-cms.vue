<template>
    <view v-if="components.length" class="snake-cms">
        <template v-for="item in components" :key="item.id">
            <snake-commodity-search v-if="item.component === 'commoditysearch'" :datas="item.setStyle" />
            <snake-auxiliary-segmentation
                v-else-if="item.component === 'auxiliarysegmentation'"
                :datas="item.setStyle"
            />
            <snake-rich-text v-else-if="item.component === 'richtext'" :datas="item.setStyle" />
            <snake-graphic-navigation v-else-if="item.component === 'graphicnavigation'" :datas="item.setStyle" />
            <snake-images v-else-if="item.component === 'images'" :datas="item.setStyle" />
            <snake-picture-ads v-else-if="item.component === 'pictureads'" :datas="item.setStyle" />
            <snake-magic-cube v-else-if="item.component === 'magiccube'" :datas="item.setStyle" />
            <snake-videos v-else-if="item.component === 'videos'" :datas="item.setStyle" />
            <snake-notice v-else-if="item.component === 'notice'" :datas="item.setStyle" />
            <snake-jump-applet
                v-else-if="item.component === 'jumpApplet'"
                :datas="item.setStyle"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <snake-follow v-else-if="item.component === 'follow'" :datas="item.setStyle" />
            <snake-floating-bubble
                v-else-if="item.component === 'suspension'"
                :datas="item.setStyle"
                :scroll-top="scrollTop"
            />
            <snake-coupon
                v-else-if="item.component === 'coupon'"
                :datas="item.setStyle"
                :coupon-service="options.services?.coupon"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <snake-page-popup v-else-if="item.component === 'pagePopup'" :datas="item.setStyle" />

            <template v-else-if="item.component === 'goodslist'">
                <snake-activity-list
                    v-if="item.setStyle.activitySessionShow && item.setStyle.listType === 'auction'"
                    :list="activityList"
                    :current="activityCurrent"
                    @change="changeActivity"
                />
                <snake-sticky
                    v-if="item.setStyle.tabShow || item.setStyle.filterShow"
                    :offset-top="stickyOffsetTop"
                    :custom-nav-height="stickyCustomNavHeight"
                    :scroll-top="scrollTop"
                    :disabled="resolveStickyDisabled(item.setStyle.stickyDisabled)"
                    :bg-color="item.setStyle.backgroundColor || 'var(--snake-color-background, #f6f6f6)'"
                    :z-index="19"
                >
                    <snake-tabs
                        v-if="item.setStyle.tabShow && item.setStyle.tabslist?.length"
                        name="label"
                        :list="item.setStyle.tabslist"
                        :current="tabsCurrent"
                        font-size="26rpx"
                        active-color="var(--snake-color-text, #303133)"
                        inactive-color="var(--snake-color-text-secondary, #606266)"
                        :active-item-style="activeTabStyle"
                        :bar-style="activeBarStyle"
                        :bg-color="item.setStyle.backgroundColor"
                        @change="changeTab($event, item.setStyle.tabslist)"
                    />
                    <snake-filter-sorts
                        v-if="item.setStyle.filterShow"
                        :goods-list-length="goodsList.length"
                        :filters="filtersData"
                        :bg-color="item.setStyle.backgroundColor"
                        :show-tabs="item.setStyle.tabShow && !!item.setStyle.tabslist?.length"
                        :sort="item.setStyle.filterParams?.sort"
                        :custom-style="{ padding: '0 20rpx' }"
                        @change="confirmFilter"
                    />
                </snake-sticky>
                <snake-goods-list
                    :goods-list="goodsList"
                    :attendance-show="item.setStyle.attendanceShow"
                    :bg-color="item.setStyle.backgroundColor"
                    :page-margin="item.setStyle.pageMargin"
                    :commodity-type="item.setStyle.commodityType"
                    :image-margin="item.setStyle.imageMargin"
                    :list-type="item.setStyle.listType"
                    :assets="options.assets"
                    @item-click="handleGoodsClick"
                    @handler-offer="handleOfferClick"
                />
                <snake-loadmore
                    v-if="goodsList.length"
                    margin-bottom="0"
                    custom-style="padding-bottom: 20rpx"
                    :status="goodsLoadingStatus"
                    :bg-color="item.setStyle.backgroundColor"
                />
                <snake-empty
                    v-else-if="status !== 'initial-loading'"
                    :icon="item.setStyle.emptySrc"
                    :text="item.setStyle.emptyText"
                    :text-color="item.setStyle.emptyColor"
                    :custom-style="{
                        padding: '60px 0 300px',
                        backgroundColor: item.setStyle.backgroundColor
                    }"
                />
            </template>

            <snake-custom-module v-else-if="item.component === 'custommodule'" :datas="item.setStyle">
                <slot :name="item.setStyle.slotName" :item="item" />
            </snake-custom-module>
            <cms-v2-carousel
                v-else-if="item.component === 'v2.carousel'"
                :data="item.props"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <cms-v2-coupon
                v-else-if="item.component === 'v2.coupon'"
                :data="item.props"
                :coupon-service="options.services?.coupon"
                :link-service="linkService"
                :page-info="pageInfo"
                @error="emit('error', $event)"
            />
            <cms-v2-custom v-else-if="item.component === 'v2.custom'" :data="item.props">
                <slot :name="item.props.slotName || 'custom'" :item="item" />
            </cms-v2-custom>
            <cms-v2-divider v-else-if="item.component === 'v2.divider'" :data="item.props" />
            <cms-v2-floatbutton
                v-else-if="item.component === 'v2.floatbutton'"
                :data="item.props"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <cms-v2-goods-list
                v-else-if="item.component === 'v2.goodslist'"
                :data="item.props"
                :goods-list="goodsList"
                :tabs-current="tabsCurrent"
                :loading-status="goodsLoadingStatus"
                :status="status"
                :assets="options.assets"
                :filters-data="filtersData"
                :activity-list="activityList"
                :activity-current="activityCurrent"
                :scroll-top="scrollTop"
                :sticky-offset-top="stickyOffsetTop"
                :sticky-custom-nav-height="stickyCustomNavHeight"
                @tab-change="changeTab"
                @activity-change="changeActivity"
                @filter-change="confirmFilter"
                @item-click="handleGoodsClick"
                @offer-click="handleOfferClick"
            />
            <cms-v2-hotzone
                v-else-if="item.component === 'v2.hotzone'"
                :data="item.props"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <cms-v2-images
                v-else-if="item.component === 'v2.images'"
                :data="item.props"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <cms-v2-magiccube
                v-else-if="item.component === 'v2.magiccube'"
                :data="item.props"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <cms-v2-notice
                v-else-if="item.component === 'v2.notice'"
                :data="item.props"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <cms-v2-popup
                v-else-if="item.component === 'v2.popup'"
                :data="item.props"
                :link-service="linkService"
                :page-info="pageInfo"
            />
            <cms-v2-richtext v-else-if="item.component === 'v2.richtext'" :data="item.props" />
            <template v-else-if="item.component === 'v2.search'">
                <snake-sticky
                    v-if="searchStickyEnabled(item.props)"
                    :offset-top="stickyOffsetTop"
                    :custom-nav-height="stickyCustomNavHeight"
                    :scroll-top="scrollTop"
                    :bg-color="item.props.style?.backgroundColor || '#f9f9f9'"
                    :z-index="20"
                >
                    <cms-v2-search :data="item.props" :link-service="linkService" :page-info="pageInfo" />
                </snake-sticky>
                <cms-v2-search v-else :data="item.props" :link-service="linkService" :page-info="pageInfo" />
            </template>
            <cms-v2-video v-else-if="item.component === 'v2.video'" :data="item.props" />
            <slot v-else name="extension" :item="item" :page-info="pageInfo" />
        </template>

        <snake-floating-bubble
            v-if="goodsList.length && options.assets?.backToTop"
            :scroll-top="scrollTop"
            bottom="310rpx"
            background="transparent"
        >
            <image
                v-show="scrollTop > 500"
                :src="options.assets.backToTop"
                class="snake-cms__to-top"
                @click="handleToTop"
            />
        </snake-floating-bubble>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Cms
 * @description `snake-cms` 是 Snake UI 的页面装修门面。内容组件只负责渲染；商品、活动、筛选、优惠券和跳转统一由宿主应用通过 CMS 服务注入。组件支持 H5、微信小程序和 App，不使用小程序不支持的动态组件。
 * @see /components/snake-cms
 */

import { computed, onBeforeUnmount, watch } from 'vue';
import ActivityList from '../snake-activity-list/snake-activity-list.vue';
import AuxiliarySegmentation from '../snake-auxiliary-segmentation/snake-auxiliary-segmentation.vue';
import CommoditySearch from '../snake-commodity-search/snake-commodity-search.vue';
import Coupon from '../snake-coupon/snake-coupon.vue';
import CustomModule from '../snake-custom-module/snake-custom-module.vue';
import FilterSorts from '../snake-filter-sorts/snake-filter-sorts.vue';
import Follow from '../snake-follow/snake-follow.vue';
import GoodsList from '../snake-goods-list/snake-goods-list.vue';
import GraphicNavigation from '../snake-graphic-navigation/snake-graphic-navigation.vue';
import Images from '../snake-images/snake-images.vue';
import JumpApplet from '../snake-jump-applet/snake-jump-applet.vue';
import MagicCube from '../snake-magic-cube/snake-magic-cube.vue';
import Notice from '../snake-notice/snake-notice.vue';
import PagePopup from '../snake-page-popup/snake-page-popup.vue';
import PictureAds from '../snake-picture-ads/snake-picture-ads.vue';
import RichText from '../snake-rich-text/snake-rich-text.vue';
import FloatingBubble from '../snake-floating-bubble/snake-floating-bubble.vue';
import Videos from '../snake-videos/snake-videos.vue';
import CmsV2Carousel from './blocks/v2/cms-v2-carousel.vue';
import CmsV2Coupon from './blocks/v2/cms-v2-coupon.vue';
import CmsV2Custom from './blocks/v2/cms-v2-custom.vue';
import CmsV2Divider from './blocks/v2/cms-v2-divider.vue';
import CmsV2Floatbutton from './blocks/v2/cms-v2-floatbutton.vue';
import CmsV2GoodsList from './blocks/v2/cms-v2-goods-list.vue';
import CmsV2Hotzone from './blocks/v2/cms-v2-hotzone.vue';
import CmsV2Images from './blocks/v2/cms-v2-images.vue';
import CmsV2Magiccube from './blocks/v2/cms-v2-magiccube.vue';
import CmsV2Notice from './blocks/v2/cms-v2-notice.vue';
import CmsV2Popup from './blocks/v2/cms-v2-popup.vue';
import CmsV2Richtext from './blocks/v2/cms-v2-richtext.vue';
import CmsV2Search from './blocks/v2/cms-v2-search.vue';
import CmsV2Video from './blocks/v2/cms-v2-video.vue';
import { searchStickyEnabled } from './blocks/v2/shared';
import { normalizeCmsComponents, reportCmsDiagnostic, resolveCmsOptions, useCmsCommerce } from '../../libs/cms';
import { CmsError } from './types';
import type { CmsDiagnostic, CmsLinkService, CmsOptions, CmsPageInfo, CmsStateChange } from './types';

defineOptions({
    name: 'Cms',
    options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' }
});

const props = withDefaults(
    defineProps<{
        pageInfo?: CmsPageInfo;
        pageComponents?: unknown[];
        scrollTop?: number;
        stickyOffsetTop?: number;
        stickyCustomNavHeight?: number;
        cmsOptions?: CmsOptions;
    }>(),
    {
        pageInfo: () => ({}),
        pageComponents: () => [],
        scrollTop: 0,
        stickyOffsetTop: 0,
        stickyCustomNavHeight: 0,
        cmsOptions: () => ({})
    }
);

const emit = defineEmits<{
    ready: [state: CmsStateChange];
    'state-change': [state: CmsStateChange];
    diagnostic: [diagnostic: CmsDiagnostic];
    error: [error: CmsError];
    'goods-click': [payload: { item: Record<string, any>; index: number }];
    'offer-click': [payload: { item: Record<string, any>; index: number }];
}>();

const options = computed(() => resolveCmsOptions(props.cmsOptions));
const linkService = computed<CmsLinkService | undefined>(() => {
    const service = options.value.services?.link;
    if (!service) return undefined;
    return {
        async open(action, context) {
            try {
                await service.open(action, context);
            } catch (cause) {
                const error = new CmsError('link', 'CMS link failed to open.', cause);
                emit('error', error);
            }
        },
        createScheme: service.createScheme?.bind(service)
    };
});
// 先规范化别名、扩展组件和重复商品区，模板只消费稳定的静态组件映射。
const normalized = computed(() => normalizeCmsComponents(props.pageComponents, props.pageInfo, options.value));
const components = computed(() => normalized.value.components);
const commerceComponent = computed(() =>
    components.value.find(item => item.component === 'goodslist' || item.component === 'v2.goodslist')
);
const activeTabStyle = { color: 'var(--snake-color-text, #303133)', fontWeight: 600, fontSize: '32rpx' };
const activeBarStyle = {
    width: '25px',
    height: '8rpx',
    backgroundColor: 'var(--snake-color-primary, #06D290)',
    borderRadius: '2rpx'
};

function resolveStickyDisabled(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 'true';
}

let readyEmitted = false;
const commerce = useCmsCommerce({
    pageInfo: () => props.pageInfo,
    component: () => commerceComponent.value,
    options: () => options.value,
    onStateChange(state) {
        emit('state-change', state);
        if (!readyEmitted && ['ready', 'empty', 'no-more'].includes(state.status)) {
            readyEmitted = true;
            emit('ready', state);
        }
    },
    onError(error) {
        emit('error', error);
    }
});

const {
    goodsList,
    filtersData,
    activityList,
    activityCurrent,
    tabsCurrent,
    auctionSetParams,
    status,
    goodsLoadingStatus,
    init,
    loadMore,
    retry,
    changeActivity,
    changeTab,
    confirmFilter,
    refreshQuotePay
} = commerce;

// 页面配置变化会开启一轮新的初始化；commerce 控制器负责让旧请求失效，避免跨页面回写。
watch(
    normalized,
    async result => {
        readyEmitted = false;
        for (const diagnostic of result.diagnostics) {
            reportCmsDiagnostic(options.value, diagnostic);
            emit('diagnostic', diagnostic);
        }
        await init();
    },
    { immediate: true }
);

async function handleGoodsClick(item: Record<string, any>, index: number): Promise<void> {
    emit('goods-click', { item, index });
    await commerce.navigateGoods(item, index);
}

async function handleOfferClick(item: Record<string, any>, index: number): Promise<void> {
    emit('offer-click', { item, index });
    await commerce.navigateGoods(item, index);
}

function handleToTop(): void {
    uni.pageScrollTo({ scrollTop: 0, duration: 300 });
}

onBeforeUnmount(commerce.invalidate);

defineExpose({ init, loadMore, retry, refreshQuotePay, auctionSetParams });
</script>

<style lang="scss">
.snake-cms {
    position: relative;
    background-color: transparent;
}

.snake-cms__to-top {
    width: 80rpx;
    height: 80rpx;
}
</style>
