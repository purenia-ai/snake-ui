<template>
    <snake-popup
        v-if="data.image"
        v-model="show"
        :mode="data.popupMode === 'center' ? 'center' : 'bottom'"
        :bg-color="data.popupMode === 'center' ? 'transparent' : '#fff'"
        safe-area-inset-bottom
        close-on-click-overlay
    >
        <view class="cms-v2-popup">
            <image class="cms-v2-popup__image" :src="data.image || ''" mode="widthFix" @click="handleImageClick" />
            <view class="cms-v2-popup__close" @click="show = false">×</view>
        </view>
    </snake-popup>
</template>
<script setup lang="ts">
/** @component CmsV2Popup @description CMS v2 页面弹窗内部渲染器。 @see /cms/overview */
import { ref } from 'vue';
import Popup from '../../../snake-popup/snake-popup.vue';
import { openV2Link, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const show = ref(true);
const handleImageClick = async () => {
    await openV2Link(props.data.link, props.linkService, props.pageInfo);
    show.value = false;
};
</script>
<style scoped>
.cms-v2-popup {
    position: relative;
    width: 560rpx;
    max-width: 100%;
}
.cms-v2-popup__image {
    display: block;
    width: 100%;
}
.cms-v2-popup__close {
    position: absolute;
    top: -70rpx;
    right: 0;
    color: #fff;
    font-size: 60rpx;
    line-height: 60rpx;
}
</style>
