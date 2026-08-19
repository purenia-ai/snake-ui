<template>
  <view :style="$snakeThemeStyle">
    <view class="wh-full pos-relative" @click="show = true">
      <snake-image :src="datas.src + '?x-oss-process=video/snapshot,t_0,f_jpg'" width="100%" mode="widthFix"></snake-image>
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
      <view class="w-100vw h-100vh flex-items-center bg-#000" v-if="show" @click.stop="show = false">
        <view class="pos-absolute top-60rpx right-50rpx">
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

<script>
export default {
  props: {
    datas: Object,
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      show: false,
      uid: uni.$snake.guid(),
      isShow: false,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.videos {
  width: 100%;
}
</style>
