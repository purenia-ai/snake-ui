<template>
    <snake-transition :show="visible" name="fade">
        <view
            class="snake-backtop"
            :class="[`snake-backtop--${shape}`, customClass]"
            :style="rootStyle"
            @click="handleClick"
        >
            <slot>
                <snake-icon :name="icon" :size="iconSize" :color="iconColor" />
                <text v-if="text" class="snake-backtop__text">{{ text }}</text>
            </slot>
        </view>
    </snake-transition>
</template>

<script setup lang="ts">
/**
 * @component Backtop
 * @description 长页面滚动超过阈值后出现的回到顶部按钮，点击调用 uni.pageScrollTo 平滑回到页面顶部，隐藏时不保留节点。
 * @see /components/backtop
 */

import { computed } from 'vue';
import { addUnit, unitToPx } from '../../libs/function/unit';
import type { BacktopEmits, BacktopProps } from './types';

defineOptions({ name: 'Backtop', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<BacktopProps>(), {
    top: 300,
    bottom: 100,
    right: 20,
    shape: 'circle',
    icon: 'arrow-upward',
    iconSize: 20,
    iconColor: 'var(--snake-color-text-secondary, #606266)',
    text: '',
    duration: 100,
    zIndex: 10,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<BacktopEmits>();

// 组件拿不到页面滚动距离，阈值由宿主的 onPageScroll 经 scrollTop 喂入；
// top 允许带单位，比较前统一折算成 px，避免带单位的字符串被直接参与数值比较。
const visible = computed(() => Number(props.scrollTop) > unitToPx(props.top));
const rootStyle = computed(() => [
    { bottom: addUnit(props.bottom), right: addUnit(props.right), zIndex: props.zIndex },
    props.customStyle
]);

function handleClick(event: unknown) {
    emit('click', event);
    uni.pageScrollTo({ scrollTop: 0, duration: props.duration });
}
</script>

<style scoped>
.snake-backtop {
    position: fixed;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;
    padding: 6px;
    background-color: var(--snake-color-surface);
    border: 1px solid var(--snake-color-border);
    box-shadow: 0 2px 8px var(--snake-color-shadow);
}
.snake-backtop--circle {
    border-radius: 9999px;
}
.snake-backtop--square {
    border-radius: var(--snake-radius-large);
}
.snake-backtop__text {
    margin-top: 2px;
    color: var(--snake-color-text-muted);
    font-size: 10px;
    line-height: 1;
}
</style>
