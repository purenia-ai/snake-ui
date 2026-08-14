<template>
  <view
    class="suspension"
    :animation="animationData"
    :style="[$snakeThemeStyle, { right: datas.right + '%', bottom: datas.bottom + '%' }]"
    v-if="datas.src && isShow">
    <view
      class="suspension-wrap"
      :style="{ width: datas.width + 'rpx', height: datas.height + 'rpx' }"
      @click="uni.$snake.navTo(datas.url)">
      <view class="icons" @click.stop.prevent="close">
        <snake-icon name="close-circle-fill" size="28" color="rgba(7, 7, 7, 0.2)"></snake-icon>
      </view>
      <image class="suspension-logo" :src="datas.src"></image>
    </view>
  </view>
</template>
<script>
import { getCurrentInstance } from 'vue';
export default {
  name: 'suspension',
  props: {
    datas: Object,
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const instance = getCurrentInstance();
    return { instance };
  },
  data() {
    return {
      suspensionList: [],
      animationData: {}, // 动画
      off: false, // 判断是否开启动画
      size: {},
      timer: null,
    };
  },
  computed: {
    isShow() {
      let show = true;
      this.suspensionList.forEach((item) => {
        if (item === this.datas.uid) {
          show = false;
        }
      });
      return show;
    },
  },
  watch: {
    scrollTop() {
      this.declick();
    },
  },
  async mounted() {
    this.suspensionList = uni.getStorageSync('suspensionList') || [];
    // 初始化一个动画
    const animation = uni.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    });
    this.animation = animation;
    const size = await uni.$snake.getRect('.suspension', this.instance);
    if (size) {
      this.size = size;
    }
  },
  beforeUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    // 开启动画事件
    declick() {
      if (!this.off) {
        this.rotateAndScale();
        this.off = true;
      }
    },
    // 定义滚动时的动画内容
    rotateAndScale() {
      const screenWidth = uni.$snake.sys().screenWidth;
      const x = this.size.width / 2 + screenWidth - this.size.right;
      // 定义动画内容
      this.animation.translateX(x).step();
      // 导出动画数据传递给data层
      this.animationData = this.animation.export();
      // 2秒内不滚动时触发
      this.timer = setTimeout(() => {
        this.off = false;
        this.norotateAndScale();
      }, 2000);
    },
    // 定义停止滚动后的动画内容
    norotateAndScale() {
      this.animation.translateX(0).step();
      this.animationData = this.animation.export();
    },
    close() {
      // 储存关闭的悬浮uid
      if (this.suspensionList.length === 0) {
        this.suspensionList.push(this.datas.uid);
      } else {
        this.suspensionList.forEach((item) => {
          if (item !== this.datas.uid) {
            this.suspensionList.push(this.datas.uid);
          }
        });
      }
      uni.setStorageSync('suspensionList', this.suspensionList);
    },
  },
};
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
