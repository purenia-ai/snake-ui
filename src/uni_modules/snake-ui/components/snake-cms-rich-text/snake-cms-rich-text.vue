<template>
    <view class="richtext">
        <snake-rich-text :content="datas.myValue"></snake-rich-text>
    </view>
</template>

<script setup lang="ts">
/**
 * @component CmsRichText
 * @description 渲染 CMS 提供的 HTML 内容。
 */

import type { CmsRichTextProps } from './types';

defineOptions({ name: 'CmsRichText', options: { virtualHost: true, styleIsolation: 'shared' } });
withDefaults(defineProps<CmsRichTextProps>(), { datas: () => ({}) });
</script>

<style lang="scss" scoped>
.richtext {
    padding: 0 10px;
    white-space: break-word !important;
}
</style>
