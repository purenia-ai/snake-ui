<template>
    <view class="richtext">
        <snake-parse :content="datas.myValue"></snake-parse>
    </view>
</template>

<script setup lang="ts">
/**
 * @component RichText
 * @description 渲染 CMS 提供的 HTML 内容。
 */

import type { RichTextProps } from './types';

defineOptions({ name: 'RichText', options: { virtualHost: true, styleIsolation: 'shared' } });
withDefaults(defineProps<RichTextProps>(), { datas: () => ({}) });
</script>

<style lang="scss" scoped>
.richtext {
    padding: 0 20rpx;
    white-space: break-word !important;
}
</style>
