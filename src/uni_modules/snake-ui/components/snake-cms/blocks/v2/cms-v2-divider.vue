<template>
    <view class="cms-v2-divider" :style="rootStyle">
        <view v-if="data.mode === 'line'" class="cms-v2-divider__line" :style="lineStyle" />
    </view>
</template>

<script setup lang="ts">
/** @component CmsV2Divider @description CMS v2 空白与分割线内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import { rpx, type V2Record } from './shared';
const props = defineProps<{ data: V2Record }>();
const rootStyle = computed(() => ({
    height: rpx(props.data.height, 30),
    padding: Number(props.data.margin) === 1 ? '0 30rpx' : 0,
    backgroundColor: props.data.style?.backgroundColor || '#fff'
}));
const lineStyle = computed(() => ({
    borderTop: `2rpx ${['solid', 'dashed', 'dotted'].includes(props.data.lineStyle) ? props.data.lineStyle : 'solid'} ${props.data.style?.lineColor || '#e5e5e5'}`
}));
</script>

<style scoped>.cms-v2-divider { display: flex; box-sizing: border-box; align-items: center; width: 100%; } .cms-v2-divider__line { width: 100%; height: 0; }</style>
