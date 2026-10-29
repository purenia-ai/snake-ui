<template>
    <view class="snake-index-anchor__wrapper" :style="wrapperStyle">
        <view :id="anchorId" class="snake-index-anchor" :class="[customClass, { 'is-active': active }]" :style="style">
            <slot v-if="useSlot" />
            <text v-else>{{ text || index }}</text>
        </view>
    </view>
</template>
<script setup lang="ts">
/**
 * @component IndexAnchor
 * @description 定义 `IndexList` 中的分组位置，并根据父组件配置提供吸顶效果。
 * @see /components/index-anchor
 */

import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, watch } from 'vue';
import { indexListKey } from '../snake-index-list/types';
import type { IndexAnchorProps } from './types';
defineOptions({ name: 'IndexAnchor', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<IndexAnchorProps>(), {
    text: '',
    useSlot: false,
    customClass: '',
    customStyle: ''
});
const instance = getCurrentInstance();
const list = inject(indexListKey);
const anchorId = computed(() => list?.anchorId(props.index) ?? `snake-index-anchor-${props.index}`);
const active = computed(() => list?.isActive(props.index) ?? false);
const wrapperStyle = computed(() => list?.wrapperStyle(props.index) ?? {});
const style = computed(() => [list?.anchorStyle(props.index) ?? {}, props.customStyle]);

// 微信端选择器查询不能跨自定义组件边界，锚点需在自身作用域内测量并回报父级。
onMounted(() => {
    list?.registerAnchor(props.index);
    measure();
});
onBeforeUnmount(() => list?.unregisterAnchor(props.index));
watch(
    () => props.index,
    (value, previous) => {
        if (previous !== undefined && previous !== value) list?.unregisterAnchor(previous);
        list?.registerAnchor(value);
        measure();
    }
);
watch(
    () => list?.measureToken.value,
    () => measure()
);

/** 测量自身节点位置并回报父级：查询限定在自身模板内，跨端可靠。 */
function measure() {
    if (typeof uni === 'undefined' || !instance) return;
    uni.createSelectorQuery()
        .in(instance?.proxy as any)
        .select('.snake-index-anchor__wrapper')
        .boundingClientRect()
        .exec((results: any[]) => {
            const rect = results?.[0];
            if (rect) {
                list?.reportAnchor(props.index, { top: Number(rect.top) || 0, height: Number(rect.height) || 0 });
            }
        });
}
</script>
<style scoped>
.snake-index-anchor__wrapper {
    position: relative;
}
.snake-index-anchor {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    min-height: 64rpx;
    align-items: center;
    padding: 0 20rpx;
    color: var(--snake-color-text, #303133);
    font-size: 24rpx;
    font-weight: 600;
    background: var(--snake-color-background, #f5f6f8);
}
</style>
