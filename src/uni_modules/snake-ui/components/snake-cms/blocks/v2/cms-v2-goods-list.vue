<template>
    <view class="cms-v2-goods" :style="rootStyle">
        <scroll-view v-if="data.bars?.tabs?.enabled && tabs.length" scroll-x class="cms-v2-goods__tabs">
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
        <snake-goods-list
            :goods-list="goodsList"
            :list-type="data.display?.cardType || 'sale'"
            :commodity-type="Number(data.display?.columns) === 3 ? 1 : 0"
            :attendance-show="data.display?.showAttendance !== false"
            :page-margin="data.style?.pageMargin"
            :image-margin="data.style?.gap"
            :bg-color="data.style?.backgroundColor"
            :assets="assets"
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
import GoodsList from '../../../snake-goods-list/snake-goods-list.vue';
import Loadmore from '../../../snake-loadmore/snake-loadmore.vue';
import type { CmsAssets, CmsStatus } from '../../../../libs/cms';
import type { LoadmoreStatus } from '../../../snake-loadmore/types';
const props = defineProps<{
    data: Record<string, any>;
    goodsList: Record<string, any>[];
    tabsCurrent: number;
    loadingStatus: LoadmoreStatus;
    status: CmsStatus;
    assets?: CmsAssets;
}>();
defineEmits<{
    'tab-change': [index: number, list: Record<string, any>[]];
    'item-click': [item: Record<string, any>, index: number];
    'offer-click': [item: Record<string, any>, index: number];
}>();
const tabs = computed(() => (Array.isArray(props.data.bars?.tabs?.list) ? props.data.bars.tabs.list : []));
const rootStyle = computed(() => ({ backgroundColor: props.data.style?.backgroundColor || '#f8f8f8' }));
</script>
<style scoped>
.cms-v2-goods__tabs {
    display: flex;
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
</style>
