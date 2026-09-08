<template>
    <view class="cms-v2-search" :style="rootStyle">
        <view class="cms-v2-search__box" :style="boxStyle" @click="openV2Link(data.link, linkService, pageInfo)"><text class="cms-v2-search__symbol">⌕</text><input class="cms-v2-search__input" :type="data.inputType === 'number' ? 'number' : 'text'" :placeholder="placeholder" :disabled="!data.isSearch" @confirm="openV2Link(data.link, linkService, pageInfo)" /><image v-if="data.rightImage?.show && data.rightImage?.src" class="cms-v2-search__right" :src="data.rightImage.src" mode="aspectFit" @click.stop="openV2Link(data.rightImage.link, linkService, pageInfo)" /></view>
        <image v-for="(icon, index) in icons" :key="index" class="cms-v2-search__icon" :src="icon.src || ''" mode="aspectFit" @click="openV2Link(icon.link, linkService, pageInfo)" />
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Search @description CMS v2 搜索框内部渲染器。 @see /cms/components */
import { computed } from 'vue';
import { openV2Link, rpx, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const icons = computed(() => Array.isArray(props.data.icons) ? props.data.icons.slice(0, 2) : []);
const placeholder = computed(() => props.data.textList?.[0]?.text || props.data.searchText || '请输入搜索内容');
const rootStyle = computed(() => ({ minHeight: rpx(props.data.style?.height, 60), padding: `10rpx ${rpx(props.data.style?.pageMargin)}`, backgroundColor: props.data.style?.backgroundColor || '#f9f9f9' }));
const boxStyle = computed(() => ({ color: props.data.style?.textColor || '#969799', backgroundColor: props.data.style?.borderBgColor || '#fff', border: props.data.style?.showBorder === false ? 'none' : `${rpx(props.data.style?.borderSize, 1)} solid ${props.data.style?.borderColor || '#000'}`, borderRadius: rpx(props.data.style?.borderRadius) }));
</script>
<style scoped>.cms-v2-search { display: flex; box-sizing: border-box; align-items: center; gap: 12rpx; width: 100%; } .cms-v2-search__box { display: flex; flex: 1; align-items: center; height: 100%; padding: 0 16rpx; } .cms-v2-search__input { flex: 1; min-width: 0; } .cms-v2-search__symbol { margin-right: 10rpx; font-size: 32rpx; } .cms-v2-search__right,.cms-v2-search__icon { width: 60rpx; height: 60rpx; }</style>
