<template>
    <view v-if="components.length" class="snake-cms" :style="$snakeThemeStyle">
        <template v-for="item in components" :key="item.id">
            <snake-commodity-search v-if="item.component === 'commoditysearch'" :datas="item.setStyle" />
            <snake-auxiliary-segmentation
                v-else-if="item.component === 'auxiliarysegmentation'"
                :datas="item.setStyle"
            />
            <snake-rich-text v-else-if="item.component === 'richtext'" :datas="item.setStyle" />
            <snake-graphic-navigation v-else-if="item.component === 'graphicnavigation'" :datas="item.setStyle" />
            <snake-images v-else-if="item.component === 'images'" :datas="item.setStyle" />
            <snake-hotzone
                v-else-if="item.component === 'hotzone'"
                :datas="item.setStyle"
                :link-service="options.services?.link"
                :page-info="pageInfo"
            />
            <snake-picture-ads v-else-if="item.component === 'pictureads'" :datas="item.setStyle" />
            <snake-magic-cube v-else-if="item.component === 'magiccube'" :datas="item.setStyle" />
            <snake-videos v-else-if="item.component === 'videos'" :datas="item.setStyle" />
            <snake-notice v-else-if="item.component === 'notice'" :datas="item.setStyle" />
            <snake-jump-applet
                v-else-if="item.component === 'jumpApplet'"
                :datas="item.setStyle"
                :link-service="options.services?.link"
                :page-info="pageInfo"
            />
            <snake-follow v-else-if="item.component === 'follow'" :datas="item.setStyle" />
            <snake-suspension
                v-else-if="item.component === 'suspension'"
                :datas="item.setStyle"
                :scroll-top="scrollTop"
            />
            <snake-coupon
                v-else-if="item.component === 'coupon'"
                :datas="item.setStyle"
                :coupon-service="options.services?.coupon"
                :link-service="options.services?.link"
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
                    :scroll-top="scrollTop"
                    :disabled="!item.setStyle.stickyDisabled"
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
                        :scroll-top="scrollTop"
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
            <slot v-else name="extension" :item="item" :page-info="pageInfo" />
        </template>

        <snake-suspension
            v-if="goodsList.length && options.assets?.backToTop"
            :top="scrollTop"
            bottom="310rpx"
            background="transparent"
        >
            <image
                v-show="scrollTop > 500"
                :src="options.assets.backToTop"
                class="snake-cms__to-top"
                @click="handleToTop"
            />
        </snake-suspension>
    </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import SnakeActivityList from '../snake-activity-list/snake-activity-list.vue';
import SnakeAuxiliarySegmentation from '../snake-auxiliary-segmentation/snake-auxiliary-segmentation.vue';
import SnakeCommoditySearch from '../snake-commodity-search/snake-commodity-search.vue';
import SnakeCoupon from '../snake-coupon/snake-coupon.vue';
import SnakeCustomModule from '../snake-custom-module/snake-custom-module.vue';
import SnakeFilterSorts from '../snake-filter-sorts/snake-filter-sorts.vue';
import SnakeFollow from '../snake-follow/snake-follow.vue';
import SnakeGoodsList from '../snake-goods-list/snake-goods-list.vue';
import SnakeGraphicNavigation from '../snake-graphic-navigation/snake-graphic-navigation.vue';
import SnakeHotzone from '../snake-hotzone/snake-hotzone.vue';
import SnakeImages from '../snake-images/snake-images.vue';
import SnakeJumpApplet from '../snake-jump-applet/snake-jump-applet.vue';
import SnakeMagicCube from '../snake-magic-cube/snake-magic-cube.vue';
import SnakeNotice from '../snake-notice/snake-notice.vue';
import SnakePagePopup from '../snake-page-popup/snake-page-popup.vue';
import SnakePictureAds from '../snake-picture-ads/snake-picture-ads.vue';
import SnakeRichText from '../snake-rich-text/snake-rich-text.vue';
import SnakeSuspension from '../snake-suspension/snake-suspension.vue';
import SnakeVideos from '../snake-videos/snake-videos.vue';
import {
    normalizeSnakeCmsComponents,
    reportSnakeCmsDiagnostic,
    resolveSnakeCmsOptions,
    useSnakeCmsCommerce
} from '../../libs/cms';
import type {
    SnakeCmsDiagnostic,
    SnakeCmsError,
    SnakeCmsOptions,
    SnakeCmsPageInfo,
    SnakeCmsStateChange
} from './types';

defineOptions({
    name: 'SnakeCms',
    options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' }
});

const props = withDefaults(
    defineProps<{
        pageInfo?: SnakeCmsPageInfo;
        pageComponents?: unknown[];
        scrollTop?: number;
        stickyOffsetTop?: number;
        cmsOptions?: SnakeCmsOptions;
    }>(),
    {
        pageInfo: () => ({}),
        pageComponents: () => [],
        scrollTop: 0,
        stickyOffsetTop: 0,
        cmsOptions: () => ({})
    }
);

const emit = defineEmits<{
    ready: [state: SnakeCmsStateChange];
    'state-change': [state: SnakeCmsStateChange];
    diagnostic: [diagnostic: SnakeCmsDiagnostic];
    error: [error: SnakeCmsError];
    'goods-click': [payload: { item: Record<string, any>; index: number }];
    'offer-click': [payload: { item: Record<string, any>; index: number }];
}>();

const options = computed(() => resolveSnakeCmsOptions(props.cmsOptions));
const normalized = computed(() => normalizeSnakeCmsComponents(props.pageComponents, props.pageInfo, options.value));
const components = computed(() => normalized.value.components);
const commerceComponent = computed(() => components.value.find(item => item.component === 'goodslist'));
const activeTabStyle = { color: 'var(--snake-color-text, #303133)', fontWeight: 600, fontSize: '32rpx' };
const activeBarStyle = {
    width: '25px',
    height: '8rpx',
    backgroundColor: 'var(--snake-color-primary, #00a86f)',
    borderRadius: '2rpx'
};

let readyEmitted = false;
const commerce = useSnakeCmsCommerce({
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

watch(
    normalized,
    async result => {
        readyEmitted = false;
        for (const diagnostic of result.diagnostics) {
            reportSnakeCmsDiagnostic(options.value, diagnostic);
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
