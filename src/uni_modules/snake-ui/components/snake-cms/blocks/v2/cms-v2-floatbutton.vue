<template>
    <snake-floating-bubble
        :datas="bubbleDatas"
        :scroll-top="scrollTop"
        unit="px"
        @click="openV2Link(data.link, linkService, pageInfo)"
    />
</template>
<script setup lang="ts">
/** @component CmsV2Floatbutton @description CMS v2 悬浮按钮内部渲染器，复用悬浮气泡获得关闭持久化与滚动收起行为。 @see /cms/overview */
import { computed } from 'vue';
import SnakeFloatingBubble from '../../../snake-floating-bubble/snake-floating-bubble.vue';
import { openV2Link, type V2BlockProps } from './shared';

const props = defineProps<V2BlockProps & { scrollTop?: number; uid?: string | number }>();

// v2 契约字段映射到气泡数据；跳转不走气泡内置直跳（url 留空），统一交给 link service。
const bubbleDatas = computed(() => {
    // 0 是编辑器滑杆合法取值（如贴底 bottom: 0），仅缺失时回退默认。
    const right = Number(props.data.position?.right);
    const bottom = Number(props.data.position?.bottom);
    return {
        src: props.data.src,
        width: props.data.style?.width ?? 38,
        height: props.data.style?.height ?? 38,
        right: Number.isFinite(right) ? right : 0,
        bottom: Number.isFinite(bottom) ? bottom : 20,
        uid: props.uid
    };
});
</script>
