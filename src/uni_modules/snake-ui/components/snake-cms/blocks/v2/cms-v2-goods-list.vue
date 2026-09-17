<template>
    <view class="cms-v2-goods" :style="rootStyle">
        <snake-activity-list
            v-if="data.bars.activitySession && data.display.cardType === 'auction'"
            :list="activityList"
            :current="activityCurrent"
            @change="$emit('activity-change', $event)"
        />
        <snake-sticky
            v-if="showBars"
            :offset-top="stickyOffsetTop"
            :custom-nav-height="stickyCustomNavHeight"
            :scroll-top="scrollTop"
            :disabled="!data.bars.sticky"
            :bg-color="data.style.backgroundColor"
            :z-index="19"
        >
            <scroll-view v-if="data.bars.tabs.enabled && tabs.length" scroll-x class="cms-v2-goods__tabs">
                <view
                    v-for="(tab, index) in tabs"
                    :key="tab.id ?? index"
                    class="cms-v2-goods__tab"
                    :class="{ 'cms-v2-goods__tab--active': index === tabsCurrent }"
                    @click="$emit('tab-change', index, tabs)"
                >
                    {{ tab.label }}
                </view>
            </scroll-view>
            <scroll-view
                v-if="data.bars.filter === 'custom' && data.bars.filterList.length"
                scroll-x
                class="cms-v2-goods__filters"
            >
                <view class="cms-v2-goods__filters-inner">
                    <view
                        v-for="(item, index) in data.bars.filterList"
                        :key="item.id || index"
                        class="cms-v2-goods__filter-chip"
                    >
                        {{ item.name }}
                    </view>
                </view>
            </scroll-view>
            <snake-filter-sorts
                v-else-if="data.bars.filter === true"
                :goods-list-length="goodsList.length"
                :filters="filtersData"
                :bg-color="data.style.backgroundColor"
                :show-tabs="data.bars.tabs.enabled && !!tabs.length"
                :sort="data.query.sort"
                :custom-style="{ padding: '0 20rpx' }"
                @change="$emit('filter-change', $event)"
            />
        </snake-sticky>
        <snake-goods-list
            :goods-list="goodsList"
            :list-type="data.display?.cardType || 'sale'"
            :commodity-type="Number(data.display?.columns) === 3 ? 1 : 0"
            :attendance-show="data.display?.showAttendance !== false"
            :page-margin="data.style?.pageMargin"
            :image-margin="data.style?.gap"
            :bg-color="data.style?.backgroundColor"
            :assets="assets"
            :layout="data.display.layout"
            :card-radius="data.style.radius"
            :show-tag="data.display.showTag"
            @item-click="(item: Record<string, any>, index: number) => $emit('item-click', item, index)"
            @handler-offer="(item: Record<string, any>, index: number) => $emit('offer-click', item, index)"
        />
        <snake-loadmore v-if="goodsList.length" :status="loadingStatus" :bg-color="data.style?.backgroundColor" />
        <snake-empty
            v-else-if="status !== 'initial-loading'"
            :icon="data.empty?.image"
            :text="data.empty?.text || '列表为空'"
            :text-color="data.empty?.color || '#000'"
        />
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2GoodsList @description CMS v2 商品楼层内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import Empty from '../../../snake-empty/snake-empty.vue';
import ActivityList from '../../../snake-activity-list/snake-activity-list.vue';
import FilterSorts from '../../../snake-filter-sorts/snake-filter-sorts.vue';
import GoodsList from '../../../snake-goods-list/snake-goods-list.vue';
import Loadmore from '../../../snake-loadmore/snake-loadmore.vue';
import Sticky from '../../../snake-sticky/snake-sticky.vue';
import type { CmsAssets, CmsStatus } from '../../../../libs/cms';
import type { LoadmoreStatus } from '../../../snake-loadmore/types';
const props = defineProps<{
    data: Record<string, any>;
    goodsList: Record<string, any>[];
    tabsCurrent: number;
    loadingStatus: LoadmoreStatus;
    status: CmsStatus;
    assets?: CmsAssets;
    filtersData: Record<string, any>;
    activityList: Record<string, any>[];
    activityCurrent: string | number;
    scrollTop: number;
    stickyOffsetTop: number;
    stickyCustomNavHeight: number;
}>();
defineEmits<{
    'tab-change': [index: number, list: Record<string, any>[]];
    'item-click': [item: Record<string, any>, index: number];
    'offer-click': [item: Record<string, any>, index: number];
    'activity-change': [item: Record<string, any>];
    'filter-change': [params: Record<string, any>];
}>();
const tabs = computed(() => (Array.isArray(props.data.bars?.tabs?.list) ? props.data.bars.tabs.list : []));
const showBars = computed(
    () => (props.data.bars?.tabs?.enabled && tabs.value.length) || Boolean(props.data.bars?.filter)
);
const rootStyle = computed(() => ({ backgroundColor: props.data.style?.backgroundColor || '#f8f8f8' }));
</script>
<style scoped>
.cms-v2-goods__tabs {
    width: 100%;
    white-space: nowrap;
}
.cms-v2-goods__tab {
    display: inline-block;
    padding: 20rpx 28rpx;
    color: #606266;
}
.cms-v2-goods__tab--active {
    color: var(--snake-color-primary, #06d290);
    font-weight: 600;
}
.cms-v2-goods__filters {
    width: 100%;
    white-space: nowrap;
}
.cms-v2-goods__filters-inner {
    display: inline-flex;
    gap: 16rpx;
    min-width: 100%;
    padding: 16rpx 20rpx;
    box-sizing: border-box;
}
.cms-v2-goods__filter-chip {
    flex: 0 0 auto;
    padding: 10rpx 24rpx;
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.05);
    font-size: 24rpx;
    line-height: 32rpx;
}
</style>
