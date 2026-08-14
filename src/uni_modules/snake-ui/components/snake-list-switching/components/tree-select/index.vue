<template>
  <view class="menu-wrap" :style="$snakeThemeStyle">
    <scroll-view scroll-y scroll-with-animation class="tab-view menu-scroll-view" :scroll-top="scrollTop">
      <view
        v-for="(item, index) in items"
        :key="index"
        class="tab-item"
        :class="[current == index ? 'tab-item-active' : '']"
        :data-current="index"
        @tap.stop="swichMenu(item, index)">
        <text class="tab-item-text">{{ item.text }}</text>
      </view>
    </scroll-view>
    <view class="content">
      <slot name="content"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tree-select',
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    current: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      scrollTop: 0, //tab标题的滚动条位置
      currentIndex: 0,
      menuHeight: 0, // 左边菜单的高度
      menuItemHeight: 0, // 左边菜单item的高度
    };
  },
  watch: {
    current(val) {
      // 父组件如果重置了current，则重新赋值
      this.currentIndex = val;
    },
  },
  methods: {
    async swichMenu(item, index) {
      // 做限制 处于当前选项 不用重新请求接口
      if (this.currentIndex === index) {
        return;
      }
      // 如果为0，意味着尚未初始化
      if (this.menuHeight == 0 || this.menuItemHeight == 0) {
        await this.getElRect('menu-scroll-view', 'menuHeight');
        await this.getElRect('tab-item', 'menuItemHeight');
      }
      // 将菜单菜单活动item垂直居中
      this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
      this.$emit('click-nav', item, index);
    },
    // 获取一个目标元素的高度
    getElRect(elClass, dataVal) {
      new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('.' + elClass)
          .fields(
            {
              size: true,
            },
            (res) => {
              // 如果节点尚未生成，res值为null，循环调用执行
              if (!res) {
                setTimeout(() => {
                  this.getElRect(elClass);
                }, 10);
                return;
              }
              this[dataVal] = res.height;
            },
          )
          .exec();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-wrap {
  display: flex;
  flex: 1;
  height: auto;
  overflow: hidden;
}

.tab-view {
  width: 140rpx;
  height: 100%;
}

.tab-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140rpx;
  height: 110rpx;
  font-size: 26rpx;
  font-weight: 400;
  line-height: 1;
  color: var(--snake-color-text-secondary, #444);
  background: var(--snake-color-background, #f6f6f6);
}

.tab-item-active {
  position: relative;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--snake-color-text, #000);
  background: var(--snake-color-surface, #fff);
}

.tab-item-active::before {
  position: absolute;
  top: 39rpx;
  left: 0;
  height: 32rpx;
  content: '';
  border-left: 4px solid var(--snake-color-primary, #00a86f);
}

.right-box {
  background-color: var(--snake-color-surface-muted, rgb(250, 250, 250));
}

.content {
  width: 100%;
  overflow: hidden;
}
</style>
