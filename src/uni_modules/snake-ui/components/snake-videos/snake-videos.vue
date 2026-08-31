<template>
  <view :style="$snakeThemeStyle">
    <view class="wh-full pos-relative" role="button" tabindex="0" aria-label="播放视频" @click="open" @keydown.enter.prevent="open" @keydown.space.prevent="open">
      <snake-image :src="datas.src + '?x-oss-process=video/snapshot,t_0,f_jpg'" alt="视频封面" width="100%" mode="widthFix"></snake-image>
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
        ">
        <snake-icon name="play-right-fill" size="70rpx" color="#fff"></snake-icon>
      </view>
    </view>

    <!-- <video
			class="videos"
			:src="datas.src"
			object-fit="fill"
			style="width: 100%"
			@click.stop=""
			:poster="datas.src + '?x-oss-process=video/snapshot,t_0,f_jpg'"></video> -->

    <snake-popup v-model="show" mode="center" @close="show = false">
      <view class="w-100vw h-100vh flex-items-center bg-#000" v-if="show" @click.stop="close">
        <view class="pos-absolute top-60rpx right-50rpx" role="button" tabindex="0" aria-label="关闭视频" @keydown.enter.prevent="close" @keydown.space.prevent="close">
          <snake-icon name="close" color="#707184" size="30rpx" bold></snake-icon>
        </view>
        <video
          class="videos"
          :src="datas.src"
          object-fit="fill"
          style="width: 100%"
          @click.stop=""
          :poster="datas.src + '?x-oss-process=video/snapshot,t_0,f_jpg'"></video>
      </view>
    </snake-popup>
  </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeVideos
 * @description 显示视频首帧封面，点击后在全屏弹层中播放视频。
 * @see /components/videos
 */

import { ref } from 'vue';
import type { SnakeVideosProps } from './types';

defineOptions({ name: 'SnakeVideos' });
withDefaults(defineProps<SnakeVideosProps>(), { datas: () => ({}), scrollTop: 0 });
const show = ref(false);
function open() { show.value = true; }
function close() { show.value = false; }
</script>

<style lang="scss" scoped>
.videos {
  width: 100%;
}
</style>
