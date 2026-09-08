<template>
    <snake-popup v-model="show" :mode="data.popupMode === 'center' ? 'center' : 'bottom'" :bg-color="data.popupMode === 'center' ? 'transparent' : '#fff'">
        <view class="cms-v2-popup"><image class="cms-v2-popup__image" :src="data.image || ''" mode="widthFix" @click="openV2Link(data.link, linkService, pageInfo)" /><view class="cms-v2-popup__close" @click="show = false">×</view></view>
    </snake-popup>
</template>
<script setup lang="ts">
/** @component CmsV2Popup @description CMS v2 页面弹窗内部渲染器。 @see /cms/components */
import { ref } from 'vue';
import SnakePopup from '../../../snake-popup/snake-popup.vue';
import { openV2Link, type V2BlockProps } from './shared';
defineProps<V2BlockProps>();
const show = ref(true);
</script>
<style scoped>.cms-v2-popup { position: relative; width: 560rpx; max-width: 100%; } .cms-v2-popup__image { display: block; width: 100%; } .cms-v2-popup__close { position: absolute; top: -70rpx; right: 0; color: #fff; font-size: 60rpx; line-height: 60rpx; }</style>
