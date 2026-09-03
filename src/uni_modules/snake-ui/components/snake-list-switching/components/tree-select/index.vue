<template>
  <view class="menu-wrap">
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
/**
 * @component TreeSelect
 * @description 列表切换组件内部使用的树形分类选择器，负责节点测量、滚动定位和分类切换。
 * @see /components/list-switching
 */

export default {
  name: 'tree-select',
  emits: ['click-nav'],
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
        /** 切换分类并将激活项滚动到左侧菜单中部。 */
        async swichMenu(item, index) {
            // 当前分类不重复触发业务请求。
      if (this.currentIndex === index) {
        return;
      }
            // 首次交互可能早于节点测量，按需获取真实尺寸。
      if (this.menuHeight == 0 || this.menuItemHeight == 0) {
        await this.getElRect('menu-scroll-view', 'menuHeight');
        await this.getElRect('tab-item', 'menuItemHeight');
      }
            // 让激活项中心与可视区域中心对齐。
      this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
      this.$emit('click-nav', item, index);
    },
        /**
         * 获取目标节点尺寸；节点尚未挂载时短暂重试。
         * Promise 必须等到成功测量后再完成，调用方才能安全计算滚动位置。
         */
        getElRect(elClass, dataVal) {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('.' + elClass)
          .fields(
            {
              size: true,
            },
            (res) => {
                            // 条件渲染下节点查询可能暂时为空，延迟到下一轮重试。
              if (!res) {
                setTimeout(() => {
                  this.getElRect(elClass, dataVal).then(resolve);
                }, 10);
                return;
              }
              this[dataVal] = res.height;
              resolve(res);
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
  border-left: 4px solid var(--snake-color-primary, #06D290);
}

.right-box {
  background-color: var(--snake-color-surface-muted, rgb(250, 250, 250));
}

.content {
  width: 100%;
  overflow: hidden;
}
</style>
