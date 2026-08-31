<template>
    <view
        class="suspension"
        :animation="animationData"
        :style="[$snakeThemeStyle, { right: datas.right + '%', bottom: datas.bottom + '%' }]"
        v-if="datas.src && isShow"
    >
        <view
            class="suspension-wrap"
            :style="{ width: datas.width + 'rpx', height: datas.height + 'rpx' }"
            @click="handleNavigate"
        >
            <view class="icons" @click.stop.prevent="close">
                <snake-icon name="close-circle-fill" size="28" color="rgba(7, 7, 7, 0.2)"></snake-icon>
            </view>
            <image class="suspension-logo" :src="datas.src"></image>
        </view>
    </view>
</template>
<script setup lang="ts">
/**
 * @component SnakeSuspension
 * @description 在页面右侧显示可关闭的悬浮图片；页面滚动时暂时向屏幕外收起，停止后恢复。
 * @see /components/suspension
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { SnakeSuspensionProps } from './types';

defineOptions({ name: 'SnakeSuspension' });

const props = withDefaults(defineProps<SnakeSuspensionProps>(), {
    datas: () => ({}),
    scrollTop: 0
});
const instance = getCurrentInstance();
const suspensionList = ref<Array<string | number>>([]);
const animationData = ref<Record<string, unknown>>({});
const animation = ref<ReturnType<typeof uni.createAnimation>>();
const size = ref({ width: 0, right: 0 });
const off = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
const isShow = computed(() => !suspensionList.value.includes(props.datas.uid ?? ''));

watch(() => props.scrollTop, declick);

onMounted(async () => {
    suspensionList.value = uni.getStorageSync('suspensionList') || [];
    animation.value = uni.createAnimation({ duration: 1000, timingFunction: 'ease' });
    const rect = await uni.$snake.getRect('.suspension', instance);
    if (rect) size.value = { width: rect.width, right: rect.right ?? 0 };
});

onBeforeUnmount(() => clearTimeout(timer));

function declick() {
    if (!off.value) {
        rotateAndScale();
        off.value = true;
    }
}

function rotateAndScale() {
    if (!animation.value) return;
    const screenWidth = uni.$snake.sys().screenWidth;
    const x = size.value.width / 2 + screenWidth - size.value.right;
    animation.value.translateX(x).step();
    animationData.value = animation.value.export();
    timer = setTimeout(() => {
        off.value = false;
        norotateAndScale();
    }, 2000);
}

function norotateAndScale() {
    if (!animation.value) return;
    animation.value.translateX(0).step();
    animationData.value = animation.value.export();
}

function close() {
    const uid = props.datas.uid;
    if (uid !== undefined && !suspensionList.value.includes(uid)) suspensionList.value.push(uid);
    uni.setStorageSync('suspensionList', suspensionList.value);
}

function handleNavigate() {
    if (props.datas.url) uni.$snake.navTo(props.datas.url);
}
</script>
<style lang="scss" scoped>
.suspension {
    position: fixed;
    right: 0;
    bottom: 20%;
    z-index: 6;
    padding-bottom: 0rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .suspension-wrap {
        position: relative;
        width: 72rpx;
        height: 72rpx;

        .icons {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 12;
            // font-size: 36rpx;
            color: rgba(7, 7, 7, 0.2);
        }

        .suspension-logo {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
