<template>
    <view>
        <view
            v-if="videoSrc"
            class="snake-videos__cover"
            role="button"
            tabindex="0"
            aria-label="播放视频"
            @click="open"
            @keydown.enter.prevent="open"
            @keydown.space.prevent="open"
        >
            <snake-image :src="coverSrc" alt="视频封面" width="100%" mode="widthFix"></snake-image>
            <view
                style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.4);
                    transform: translate(-50%, -50%);
                "
            >
                <snake-icon name="play-right-fill" size="70rpx" color="#fff"></snake-icon>
            </view>
        </view>
        <view v-else class="snake-videos__empty">{{ datas.emptyText || '暂无视频' }}</view>

        <!-- <video
			class="videos"
			:src="datas.src"
			object-fit="fill"
			style="width: 100%"
			@click.stop=""
			:poster="datas.src + '?x-oss-process=video/snapshot,t_0,f_jpg'"></video> -->

        <snake-popup v-if="videoSrc" v-model="show" mode="center" @close="show = false">
            <view class="snake-videos__player" v-if="show" @click.stop="close">
                <view
                    class="snake-videos__close"
                    role="button"
                    tabindex="0"
                    aria-label="关闭视频"
                    @keydown.enter.prevent="close"
                    @keydown.space.prevent="close"
                >
                    <snake-icon name="close" color="#909399" size="30rpx" bold></snake-icon>
                </view>
                <video
                    class="videos"
                    :src="videoSrc"
                    object-fit="fill"
                    style="width: 100%"
                    @click.stop=""
                    :poster="coverSrc"
                ></video>
            </view>
        </snake-popup>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Videos
 * @description 显示视频首帧封面，点击后在全屏弹层中播放视频。
 */

import { computed, ref } from 'vue';
import type { VideosProps } from './types';

defineOptions({ name: 'Videos', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<VideosProps>(), { datas: () => ({}), scrollTop: 0 });
const show = ref(false);
const videoSrc = computed(() => String(props.datas.src || ''));
const coverSrc = computed(() => props.datas.poster || `${videoSrc.value}?x-oss-process=video/snapshot,t_0,f_jpg`);
function open() {
    if (!videoSrc.value) return;
    show.value = true;
}
function close() {
    show.value = false;
}
</script>

<style lang="scss" scoped>
.videos {
    width: 100%;
}

.snake-videos__cover {
    position: relative;
    width: 100%;
    height: 100%;
}
.snake-videos__empty {
    display: flex;
    min-height: 240rpx;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-secondary, #909399);
    background: var(--snake-color-bg, #f7f8fa);
}

.snake-videos__player {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    background-color: #000;
}

.snake-videos__close {
    position: absolute;
    top: 60rpx;
    right: 50rpx;
}
</style>
