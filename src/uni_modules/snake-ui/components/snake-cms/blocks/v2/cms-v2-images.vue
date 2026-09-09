<template>
    <view class="cms-v2-images" :style="rootStyle">
        <view class="cms-v2-images__grid" :style="gridStyle">
            <image v-for="(item, index) in items" :key="item.id ?? index" class="cms-v2-images__image" :src="item.src || ''" mode="widthFix" @click="openV2Link(item.link, linkService, pageInfo)" />
        </view>
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Images @description CMS v2 单列与网格图片内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import { blockStyle, openV2Link, rpx, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const items = computed(() => Array.isArray(props.data.items) ? props.data.items : []);
const rootStyle = computed(() => blockStyle(props.data.style));
const gridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${props.data.layout?.mode === 'grid' ? Math.min(4, Math.max(1, Number(props.data.layout?.columns) || 2)) : 1}, minmax(0, 1fr))`,
    gap: rpx(props.data.style?.gap)
}));
</script>
<style scoped>.cms-v2-images__grid { display: grid; width: 100%; } .cms-v2-images__image { display: block; width: 100%; }</style>
