<template>
    <view class="richtext" :style="backgroundColor ? { backgroundColor } : undefined">
        <snake-rich-text :content="content"></snake-rich-text>
    </view>
</template>

<script setup lang="ts">
/**
 * @component CmsRichText
 * @description 渲染 CMS 富文本区块：v1 取 `setStyle.myValue`，v2 取 `props.content`。
 */

import { computed } from 'vue';
import { sanitizeRichText } from '../../libs/cms';
import type { CmsRichTextProps } from './types';

defineOptions({ name: 'CmsRichText', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<CmsRichTextProps>(), { datas: () => ({}) });
const content = computed(() => sanitizeRichText(props.content || props.datas?.myValue));
</script>

<style lang="scss" scoped>
.richtext {
    padding: 0 10px;
    white-space: break-word !important;
}
</style>
